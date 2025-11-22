import express from 'express';
import Stripe from 'stripe';
import { prisma } from '@the-wans/database';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

// Stripe webhook handler
router.post('/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// BSP webhook handler
router.post('/bsp', async (req, res) => {
  try {
    const { transactionId, status, paymentId } = req.body;

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        paymentProvider: 'bsp',
      },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: status === 'success' ? 'COMPLETED' : 'FAILED',
        paymentId,
      },
    });

    res.json({ received: true });
  } catch (error) {
    console.error('BSP webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Digicel webhook handler
router.post('/digicel', async (req, res) => {
  try {
    const { transactionId, status, paymentId } = req.body;

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        paymentProvider: 'digicel',
      },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: status === 'success' ? 'COMPLETED' : 'FAILED',
        paymentId,
      },
    });

    res.json({ received: true });
  } catch (error) {
    console.error('Digicel webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Vodafone webhook handler
router.post('/vodafone', async (req, res) => {
  try {
    const { transactionId, status, paymentId } = req.body;

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        paymentProvider: 'vodafone',
      },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: status === 'success' ? 'COMPLETED' : 'FAILED',
        paymentId,
      },
    });

    res.json({ received: true });
  } catch (error) {
    console.error('Vodafone webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Webhook helper functions
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const transaction = await prisma.transaction.findFirst({
    where: { paymentId: paymentIntent.id },
  });

  if (transaction) {
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: 'COMPLETED' },
    });
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const transaction = await prisma.transaction.findFirst({
    where: { paymentId: paymentIntent.id },
  });

  if (transaction) {
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: 'FAILED' },
    });
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (dbSubscription) {
    await prisma.subscription.update({
      where: { id: dbSubscription.id },
      data: {
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (dbSubscription) {
    await prisma.subscription.update({
      where: { id: dbSubscription.id },
      data: { status: 'canceled' },
    });
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    const subscription = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: invoice.subscription as string },
    });

    if (subscription) {
      // Create transaction record for the payment
      await prisma.transaction.create({
        data: {
          userId: subscription.userId,
          amount: invoice.amount_paid / 100,
          currency: invoice.currency.toUpperCase(),
          status: 'COMPLETED',
          paymentProvider: 'stripe',
          paymentId: invoice.payment_intent as string,
        },
      });
    }
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Invoice payment failed:', invoice.id);
  // Could send notification to user here
}

export default router;
