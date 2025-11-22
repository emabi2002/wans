import express from 'express';
import { Queue } from 'bullmq';
import { prisma } from '@the-wans/database';
import { transcodingJobSchema } from '@the-wans/shared';
import { createSuccessResponse, createErrorResponse } from '@the-wans/shared';

const router = express.Router();

// Create BullMQ queue
const transcodingQueue = new Queue('transcoding', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});

// Create transcoding job
router.post('/', async (req, res, next) => {
  try {
    const validatedData = transcodingJobSchema.parse(req.body);

    // Check if film exists
    const film = await prisma.film.findUnique({
      where: { id: validatedData.filmId },
    });

    if (!film) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Film not found')
      );
    }

    // Create job in database
    const job = await prisma.transcodingJob.create({
      data: {
        filmId: validatedData.filmId,
        inputPath: validatedData.inputPath,
        resolution: validatedData.resolution,
        format: validatedData.format,
        status: 'PENDING',
      },
    });

    // Add to queue
    const bullJob = await transcodingQueue.add(
      `transcode-${job.id}`,
      {
        jobId: job.id,
        filmId: validatedData.filmId,
        inputPath: validatedData.inputPath,
        resolution: validatedData.resolution,
        format: validatedData.format,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      }
    );

    res.status(201).json(
      createSuccessResponse({
        job,
        queueJobId: bullJob.id,
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

// Get job status
router.get('/:jobId', async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await prisma.transcodingJob.findUnique({
      where: { id: jobId },
      include: {
        film: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Job not found')
      );
    }

    res.json(createSuccessResponse(job));
  } catch (error) {
    next(error);
  }
});

// Get all jobs for a film
router.get('/film/:filmId', async (req, res, next) => {
  try {
    const { filmId } = req.params;

    const jobs = await prisma.transcodingJob.findMany({
      where: { filmId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(createSuccessResponse(jobs));
  } catch (error) {
    next(error);
  }
});

// Get jobs by status
router.get('/status/:status', async (req, res, next) => {
  try {
    const { status } = req.params;

    if (!['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'].includes(status)) {
      return res.status(400).json(
        createErrorResponse('INVALID_STATUS', 'Invalid status value')
      );
    }

    const jobs = await prisma.transcodingJob.findMany({
      where: { status: status as any },
      include: {
        film: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json(createSuccessResponse(jobs));
  } catch (error) {
    next(error);
  }
});

// Update job progress
router.patch('/:jobId/progress', async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { progress, status, errorMessage } = req.body;

    const job = await prisma.transcodingJob.update({
      where: { id: jobId },
      data: {
        progress,
        status,
        errorMessage,
        startedAt: status === 'PROCESSING' ? new Date() : undefined,
        completedAt: status === 'COMPLETED' || status === 'FAILED' ? new Date() : undefined,
      },
    });

    res.json(createSuccessResponse(job));
  } catch (error) {
    next(error);
  }
});

// Retry failed job
router.post('/:jobId/retry', async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await prisma.transcodingJob.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Job not found')
      );
    }

    if (job.status !== 'FAILED') {
      return res.status(400).json(
        createErrorResponse('INVALID_STATUS', 'Can only retry failed jobs')
      );
    }

    // Reset job status
    const updatedJob = await prisma.transcodingJob.update({
      where: { id: jobId },
      data: {
        status: 'PENDING',
        progress: 0,
        errorMessage: null,
        startedAt: null,
        completedAt: null,
      },
    });

    // Re-add to queue
    await transcodingQueue.add(
      `transcode-retry-${job.id}`,
      {
        jobId: job.id,
        filmId: job.filmId,
        inputPath: job.inputPath,
        resolution: job.resolution,
        format: job.format,
      }
    );

    res.json(createSuccessResponse(updatedJob));
  } catch (error) {
    next(error);
  }
});

// Cancel job
router.delete('/:jobId', async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await prisma.transcodingJob.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Job not found')
      );
    }

    if (job.status === 'COMPLETED') {
      return res.status(400).json(
        createErrorResponse('INVALID_STATUS', 'Cannot cancel completed job')
      );
    }

    await prisma.transcodingJob.update({
      where: { id: jobId },
      data: {
        status: 'FAILED',
        errorMessage: 'Job cancelled by user',
        completedAt: new Date(),
      },
    });

    res.json(createSuccessResponse({ message: 'Job cancelled' }));
  } catch (error) {
    next(error);
  }
});

// Get queue stats
router.get('/stats/queue', async (req, res, next) => {
  try {
    const [waiting, active, completed, failed] = await Promise.all([
      transcodingQueue.getWaitingCount(),
      transcodingQueue.getActiveCount(),
      transcodingQueue.getCompletedCount(),
      transcodingQueue.getFailedCount(),
    ]);

    res.json(
      createSuccessResponse({
        waiting,
        active,
        completed,
        failed,
        total: waiting + active + completed + failed,
      })
    );
  } catch (error) {
    next(error);
  }
});

export default router;
