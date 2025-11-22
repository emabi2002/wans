import express from 'express';
import { prisma } from '@the-wans/database';
import { createProfileSchema } from '@the-wans/shared';
import { createSuccessResponse, createErrorResponse } from '@the-wans/shared';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get all profiles for user
router.get('/', authenticate, async (req, res, next) => {
  try {
    const profiles = await prisma.profile.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'asc' },
    });

    res.json(createSuccessResponse(profiles));
  } catch (error) {
    next(error);
  }
});

// Create profile
router.post('/', authenticate, async (req, res, next) => {
  try {
    const validatedData = createProfileSchema.parse(req.body);

    // Check profile limit
    const profileCount = await prisma.profile.count({
      where: { userId: req.user!.userId },
    });

    if (profileCount >= 5) {
      return res.status(400).json(
        createErrorResponse('PROFILE_LIMIT', 'Maximum number of profiles reached')
      );
    }

    const profile = await prisma.profile.create({
      data: {
        userId: req.user!.userId,
        name: validatedData.name,
        isKids: validatedData.isKids,
        pin: validatedData.pin,
      },
    });

    res.status(201).json(createSuccessResponse(profile));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'Invalid input data', error.errors)
      );
    }
    next(error);
  }
});

// Update profile
router.patch('/:profileId', authenticate, async (req, res, next) => {
  try {
    const { profileId } = req.params;

    // Verify ownership
    const profile = await prisma.profile.findFirst({
      where: {
        id: profileId,
        userId: req.user!.userId,
      },
    });

    if (!profile) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Profile not found')
      );
    }

    const updatedProfile = await prisma.profile.update({
      where: { id: profileId },
      data: req.body,
    });

    res.json(createSuccessResponse(updatedProfile));
  } catch (error) {
    next(error);
  }
});

// Delete profile
router.delete('/:profileId', authenticate, async (req, res, next) => {
  try {
    const { profileId } = req.params;

    // Verify ownership
    const profile = await prisma.profile.findFirst({
      where: {
        id: profileId,
        userId: req.user!.userId,
      },
    });

    if (!profile) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Profile not found')
      );
    }

    await prisma.profile.delete({
      where: { id: profileId },
    });

    res.json(createSuccessResponse({ message: 'Profile deleted successfully' }));
  } catch (error) {
    next(error);
  }
});

export default router;
