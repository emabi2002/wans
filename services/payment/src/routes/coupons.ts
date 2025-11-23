import express from 'express';
import { prisma } from '@the-wans/database';
import { createCouponSchema } from '@the-wans/shared';
import { createSuccessResponse, createErrorResponse } from '@the-wans/shared';

const router = express.Router();

// Validate coupon
router.post('/validate', async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'Coupon code is required')
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Coupon not found')
      );
    }

    const now = new Date();

    // Check validity
    if (!coupon.isActive) {
      return res.status(400).json(
        createErrorResponse('COUPON_INACTIVE', 'This coupon is no longer active')
      );
    }

    if (coupon.validFrom > now) {
      return res.status(400).json(
        createErrorResponse('COUPON_NOT_STARTED', 'This coupon is not yet valid')
      );
    }

    if (coupon.validUntil && coupon.validUntil < now) {
      return res.status(400).json(
        createErrorResponse('COUPON_EXPIRED', 'This coupon has expired')
      );
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json(
        createErrorResponse('COUPON_MAX_USES', 'This coupon has reached its maximum uses')
      );
    }

    res.json(
      createSuccessResponse({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        description: coupon.description,
        valid: true,
      })
    );
  } catch (error) {
    next(error);
  }
});

// Apply coupon
router.post('/apply', async (req, res, next) => {
  try {
    const { code, amount } = req.body;

    if (!code || amount === undefined) {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'Code and amount are required')
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return res.status(404).json(
        createErrorResponse('INVALID_COUPON', 'Invalid or inactive coupon')
      );
    }

    // Calculate discount
    let discountAmount = 0;
    let finalAmount = amount;

    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (amount * coupon.discountValue) / 100;
      finalAmount = amount - discountAmount;
    } else if (coupon.discountType === 'FIXED') {
      discountAmount = Math.min(coupon.discountValue, amount);
      finalAmount = amount - discountAmount;
    }

    // Increment usage count
    await prisma.coupon.update({
      where: { id: coupon.id },
      data: { usedCount: { increment: 1 } },
    });

    res.json(
      createSuccessResponse({
        originalAmount: amount,
        discountAmount,
        finalAmount: Math.max(0, finalAmount),
        couponCode: coupon.code,
      })
    );
  } catch (error) {
    next(error);
  }
});

// Create coupon (admin only)
router.post('/', async (req, res, next) => {
  try {
    const validatedData = createCouponSchema.parse(req.body);

    // Check if code exists
    const existing = await prisma.coupon.findUnique({
      where: { code: validatedData.code },
    });

    if (existing) {
      return res.status(400).json(
        createErrorResponse('DUPLICATE_CODE', 'Coupon code already exists')
      );
    }

    const coupon = await prisma.coupon.create({
      data: validatedData,
    });

    res.status(201).json(createSuccessResponse(coupon));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'Invalid input data', error.errors)
      );
    }
    next(error);
  }
});

// Get all coupons (admin only)
router.get('/', async (req, res, next) => {
  try {
    const { active } = req.query;

    const where = active === 'true' ? { isActive: true } : {};

    const coupons = await prisma.coupon.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(createSuccessResponse(coupons));
  } catch (error) {
    next(error);
  }
});

// Update coupon
router.patch('/:couponId', async (req, res, next) => {
  try {
    const { couponId } = req.params;

    const coupon = await prisma.coupon.update({
      where: { id: couponId },
      data: req.body,
    });

    res.json(createSuccessResponse(coupon));
  } catch (error) {
    next(error);
  }
});

// Deactivate coupon
router.delete('/:couponId', async (req, res, next) => {
  try {
    const { couponId } = req.params;

    const coupon = await prisma.coupon.update({
      where: { id: couponId },
      data: { isActive: false },
    });

    res.json(createSuccessResponse(coupon));
  } catch (error) {
    next(error);
  }
});

export default router;
