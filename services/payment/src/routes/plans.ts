import express from 'express';
import { prisma } from '@the-wans/database';
import { createSuccessResponse, createErrorResponse } from '@the-wans/shared';

const router = express.Router();

// Get all active plans
router.get('/', async (req, res, next) => {
  try {
    const territory = (req.query.territory as string) || 'GLOBAL';

    const plans = await prisma.subscriptionPlan.findMany({
      where: {
        isActive: true,
        territories: {
          has: territory,
        },
      },
      orderBy: { price: 'asc' },
    });

    res.json(createSuccessResponse(plans));
  } catch (error) {
    next(error);
  }
});

// Get plan by ID
router.get('/:planId', async (req, res, next) => {
  try {
    const { planId } = req.params;

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Plan not found')
      );
    }

    res.json(createSuccessResponse(plan));
  } catch (error) {
    next(error);
  }
});

// Create plan (admin only)
router.post('/', async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      currency,
      interval,
      features,
      maxStreams,
      maxProfiles,
      adFree,
      territories,
    } = req.body;

    const plan = await prisma.subscriptionPlan.create({
      data: {
        name,
        description,
        price,
        currency: currency || 'USD',
        interval,
        features: features || [],
        maxStreams: maxStreams || 1,
        maxProfiles: maxProfiles || 1,
        adFree: adFree !== undefined ? adFree : true,
        isActive: true,
        territories: territories || ['GLOBAL'],
      },
    });

    res.status(201).json(createSuccessResponse(plan));
  } catch (error) {
    next(error);
  }
});

// Update plan
router.patch('/:planId', async (req, res, next) => {
  try {
    const { planId } = req.params;

    const plan = await prisma.subscriptionPlan.update({
      where: { id: planId },
      data: req.body,
    });

    res.json(createSuccessResponse(plan));
  } catch (error) {
    next(error);
  }
});

// Deactivate plan
router.delete('/:planId', async (req, res, next) => {
  try {
    const { planId } = req.params;

    const plan = await prisma.subscriptionPlan.update({
      where: { id: planId },
      data: { isActive: false },
    });

    res.json(createSuccessResponse(plan));
  } catch (error) {
    next(error);
  }
});

export default router;
