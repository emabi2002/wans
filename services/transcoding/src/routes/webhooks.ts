import express from 'express';
import { prisma } from '@the-wans/database';
import { createSuccessResponse } from '@the-wans/shared';

const router = express.Router();

// Akash worker callback
router.post('/akash', async (req, res, next) => {
  try {
    const { jobId, status, progress, outputPath, error } = req.body;

    await prisma.transcodingJob.update({
      where: { id: jobId },
      data: {
        status,
        progress,
        outputPath,
        errorMessage: error,
        completedAt: status === 'COMPLETED' || status === 'FAILED' ? new Date() : undefined,
      },
    });

    res.json(createSuccessResponse({ received: true }));
  } catch (error) {
    next(error);
  }
});

// Generic worker callback
router.post('/worker', async (req, res, next) => {
  try {
    const { jobId, event, data } = req.body;

    console.log(`Received ${event} event for job ${jobId}:`, data);

    res.json(createSuccessResponse({ received: true }));
  } catch (error) {
    next(error);
  }
});

export default router;
