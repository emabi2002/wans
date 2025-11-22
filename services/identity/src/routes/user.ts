import express from 'express';
import { prisma } from '@the-wans/database';
import { createSuccessResponse, createErrorResponse } from '@the-wans/shared';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get current user
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        walletAddress: true,
        emailVerified: true,
        mfaEnabled: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'User not found')
      );
    }

    res.json(createSuccessResponse(user));
  } catch (error) {
    next(error);
  }
});

// Update user
router.patch('/me', authenticate, async (req, res, next) => {
  try {
    const { name, phone, walletAddress } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { name, phone, walletAddress },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        walletAddress: true,
      },
    });

    res.json(createSuccessResponse(updatedUser));
  } catch (error) {
    next(error);
  }
});

// Get user devices
router.get('/devices', authenticate, async (req, res, next) => {
  try {
    const devices = await prisma.device.findMany({
      where: { userId: req.user!.userId },
      orderBy: { lastUsedAt: 'desc' },
    });

    res.json(createSuccessResponse(devices));
  } catch (error) {
    next(error);
  }
});

// Remove device
router.delete('/devices/:deviceId', authenticate, async (req, res, next) => {
  try {
    const { deviceId } = req.params;

    await prisma.device.deleteMany({
      where: {
        deviceId,
        userId: req.user!.userId,
      },
    });

    res.json(createSuccessResponse({ message: 'Device removed successfully' }));
  } catch (error) {
    next(error);
  }
});

export default router;
