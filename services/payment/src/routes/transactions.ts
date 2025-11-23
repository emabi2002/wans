import express from 'express';
import Stripe from 'stripe';
import { prisma } from '@the-wans/database';
import { createTransactionSchema } from '@the-wans/shared';
import { createSuccessResponse, createErrorResponse } from '@the-wans/shared';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

// Get user transactions
router.get('/user/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          film: {
            select: {
              id: true,
              title: true,
              posterUrl: true,
            },
          },
        },
      }),
      prisma.transaction.count({ where: { userId } }),
    ]);

    res.json(
      createSuccessResponse(transactions, {
        page: Number(page),
        limit: Number(limit),
        total,
      })
    );
  } catch (error) {
    next(error);
  }
});

// Get transaction by ID
router.get('/:transactionId', async (req, res, next) => {
  try {
    const { transactionId } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        film: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!transaction) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Transaction not found')
      );
    }

    res.json(createSuccessResponse(transaction));
  } catch (error) {
    next(error);
  }
});

// Create transaction (TVOD, PPV, PVOD purchases)
router.post('/', async (req, res, next) => {
  try {
    const validatedData = createTransactionSchema.parse(req.body);
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
      return res.status(401).json(
        createErrorResponse('UNAUTHORIZED', 'User ID required')
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(validatedData.amount * 100), // Convert to cents
      currency: validatedData.currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId,
        filmId: validatedData.filmId || '',
        windowType: validatedData.windowType || '',
      },
    });

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        filmId: validatedData.filmId,
        windowType: validatedData.windowType,
        amount: validatedData.amount,
        currency: validatedData.currency,
        status: 'PENDING',
        paymentProvider: 'stripe',
        paymentId: paymentIntent.id,
        metadata: {
          paymentIntentId: paymentIntent.id,
        },
      },
    });

    res.status(201).json(
      createSuccessResponse({
        transaction,
        clientSecret: paymentIntent.client_secret,
      })
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'Invalid input data', error.errors)
      );
    }
    next(error);
  }
});

// Process PNG payment providers (BSP, Digicel, Vodafone)
router.post('/png', async (req, res, next) => {
  try {
    const { provider, phoneNumber, amount, filmId, windowType } = req.body;
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
      return res.status(401).json(
        createErrorResponse('UNAUTHORIZED', 'User ID required')
      );
    }

    // Validate provider
    const validProviders = ['bsp', 'digicel', 'vodafone'];
    if (!validProviders.includes(provider)) {
      return res.status(400).json(
        createErrorResponse('INVALID_PROVIDER', 'Invalid payment provider')
      );
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        filmId,
        windowType,
        amount,
        currency: 'PGK',
        status: 'PENDING',
        paymentProvider: provider,
        metadata: {
          phoneNumber,
          provider,
        },
      },
    });

    // Initiate payment with PNG provider
    let paymentResponse;

    switch (provider) {
      case 'bsp':
        paymentResponse = await initiateBSPPayment(phoneNumber, amount, transaction.id);
        break;
      case 'digicel':
        paymentResponse = await initiateDigicelPayment(phoneNumber, amount, transaction.id);
        break;
      case 'vodafone':
        paymentResponse = await initiateVodafonePayment(phoneNumber, amount, transaction.id);
        break;
    }

    // Update transaction with payment ID
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        paymentId: paymentResponse.paymentId,
        metadata: {
          phoneNumber,
          provider,
          paymentResponse,
        },
      },
    });

    res.status(201).json(
      createSuccessResponse({
        transaction,
        paymentResponse,
        message: 'Payment initiated. Check your phone to confirm.',
      })
    );
  } catch (error) {
    next(error);
  }
});

// Refund transaction
router.post('/:transactionId/refund', async (req, res, next) => {
  try {
    const { transactionId } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Transaction not found')
      );
    }

    if (transaction.status !== 'COMPLETED') {
      return res.status(400).json(
        createErrorResponse('INVALID_STATUS', 'Can only refund completed transactions')
      );
    }

    // Refund via Stripe
    if (transaction.paymentProvider === 'stripe' && transaction.paymentId) {
      await stripe.refunds.create({
        payment_intent: transaction.paymentId,
      });
    }

    // Update transaction
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'REFUNDED' },
    });

    res.json(createSuccessResponse(updatedTransaction));
  } catch (error) {
    next(error);
  }
});

// PNG Payment Provider Integration Functions
async function initiateBSPPayment(phoneNumber: string, amount: number, transactionId: string) {
  // BSP Papua New Guinea integration
  const BSP_API_KEY = process.env.BSP_API_KEY;
  const BSP_MERCHANT_ID = process.env.BSP_MERCHANT_ID;

  // Placeholder implementation - replace with actual BSP API
  return {
    paymentId: `bsp_${Date.now()}`,
    status: 'pending',
    message: 'Payment request sent to your BSP account',
  };
}

async function initiateDigicelPayment(phoneNumber: string, amount: number, transactionId: string) {
  // Digicel Mobile Money integration
  const DIGICEL_API_KEY = process.env.DIGICEL_API_KEY;
  const DIGICEL_MERCHANT_ID = process.env.DIGICEL_MERCHANT_ID;

  // Placeholder implementation - replace with actual Digicel API
  return {
    paymentId: `digicel_${Date.now()}`,
    status: 'pending',
    message: 'Payment request sent to your Digicel Mobile Money',
  };
}

async function initiateVodafonePayment(phoneNumber: string, amount: number, transactionId: string) {
  // Vodafone Cash integration
  const VODAFONE_API_KEY = process.env.VODAFONE_API_KEY;
  const VODAFONE_MERCHANT_ID = process.env.VODAFONE_MERCHANT_ID;

  // Placeholder implementation - replace with actual Vodafone API
  return {
    paymentId: `vodafone_${Date.now()}`,
    status: 'pending',
    message: 'Payment request sent to your Vodafone Cash',
  };
}

export default router;
