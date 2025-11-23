import express from 'express';
import Stripe from 'stripe';
import { prisma } from '@the-wans/database';
import { createSubscriptionSchema } from '@the-wans/shared';
import { createSuccessResponse, createErrorResponse } from '@the-wans/shared';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

// Get user subscriptions
router.get('/user/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      include: {
        plan: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(createSuccessResponse(subscriptions));
  } catch (error) {
    next(error);
  }
});

// Get active subscription
router.get('/user/:userId/active', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const now = new Date();

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active',
        currentPeriodEnd: { gte: now },
      },
      include: {
        plan: true,
      },
    });

    res.json(createSuccessResponse(subscription));
  } catch (error) {
    next(error);
  }
});

// Create subscription
router.post('/', async (req, res, next) => {
  try {
    const validatedData = createSubscriptionSchema.parse(req.body);
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
      return res.status(401).json(
        createErrorResponse('UNAUTHORIZED', 'User ID required')
      );
    }

    // Get plan
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: validatedData.planId },
    });

    if (!plan || !plan.isActive) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Plan not found or inactive')
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'User not found')
      );
    }

    // Create Stripe customer if doesn't exist
    let stripeCustomerId = user.email; // Simplified - should store in user table

    // Create Stripe subscription
    const stripeSubscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [
        {
          price_data: {
            currency: plan.currency.toLowerCase(),
            product_data: {
              name: plan.name,
              description: plan.description || undefined,
            },
            recurring: {
              interval: plan.interval as any,
            },
            unit_amount: Math.round(plan.price * 100), // Convert to cents
          },
        },
      ],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    // Create subscription in database
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planId: plan.id,
        status: stripeSubscription.status,
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        stripeSubscriptionId: stripeSubscription.id,
      },
      include: {
        plan: true,
      },
    });

    // Get client secret from payment intent
    const invoice = stripeSubscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    res.status(201).json(
      createSuccessResponse({
        subscription,
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

// Cancel subscription
router.delete('/:subscriptionId', async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.headers['x-user-id'] as string;

    const subscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId,
      },
    });

    if (!subscription) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Subscription not found')
      );
    }

    // Cancel in Stripe
    if (subscription.stripeSubscriptionId) {
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
    }

    // Update in database
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { cancelAtPeriodEnd: true },
    });

    res.json(createSuccessResponse(updatedSubscription));
  } catch (error) {
    next(error);
  }
});

// Reactivate subscription
router.post('/:subscriptionId/reactivate', async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.headers['x-user-id'] as string;

    const subscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId,
      },
    });

    if (!subscription) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Subscription not found')
      );
    }

    // Reactivate in Stripe
    if (subscription.stripeSubscriptionId) {
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: false,
      });
    }

    // Update in database
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { cancelAtPeriodEnd: false },
    });

    res.json(createSuccessResponse(updatedSubscription));
  } catch (error) {
    next(error);
  }
});

export default router;
