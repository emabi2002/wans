import express from 'express';
import Redis from 'ioredis';
import { prisma } from '@the-wans/database';
import { playbackRequestSchema } from '@the-wans/shared';
import { createSuccessResponse, createErrorResponse, generateSessionId } from '@the-wans/shared';

const router = express.Router();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Start playback session
router.post('/start', async (req, res, next) => {
  try {
    const validatedData = playbackRequestSchema.parse(req.body);
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
      return res.status(401).json(
        createErrorResponse('UNAUTHORIZED', 'User ID required')
      );
    }

    // Check film exists
    const film = await prisma.film.findUnique({
      where: { id: validatedData.filmId },
    });

    if (!film) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Film not found')
      );
    }

    // Check user has access (call rights service)
    // For now, simplified check
    const hasAccess = await checkUserAccess(userId, validatedData.filmId);

    if (!hasAccess) {
      return res.status(403).json(
        createErrorResponse('ACCESS_DENIED', 'You do not have access to this content')
      );
    }

    // Check concurrent stream limit
    const activeStreams = await getActiveStreamCount(userId);
    const streamLimit = await getUserStreamLimit(userId);

    if (activeStreams >= streamLimit) {
      return res.status(429).json(
        createErrorResponse(
          'CONCURRENT_STREAMS_EXCEEDED',
          `Maximum concurrent streams (${streamLimit}) exceeded`
        )
      );
    }

    // Register device if new
    let device = await prisma.device.findUnique({
      where: { deviceId: validatedData.deviceId },
    });

    if (!device) {
      device = await prisma.device.create({
        data: {
          userId,
          deviceId: validatedData.deviceId,
          deviceName: req.headers['user-agent'] || 'Unknown Device',
          deviceType: detectDeviceType(req.headers['user-agent'] || ''),
        },
      });
    } else {
      await prisma.device.update({
        where: { deviceId: validatedData.deviceId },
        data: { lastUsedAt: new Date() },
      });
    }

    // Generate session ID
    const sessionId = generateSessionId();

    // Store session in Redis (expires in 4 hours)
    await redis.setex(
      `session:${sessionId}`,
      4 * 60 * 60,
      JSON.stringify({
        userId,
        filmId: validatedData.filmId,
        deviceId: validatedData.deviceId,
        startTime: new Date().toISOString(),
        quality: validatedData.quality || 'auto',
      })
    );

    // Add to active streams set
    await redis.sadd(`active-streams:${userId}`, sessionId);
    await redis.expire(`active-streams:${userId}`, 4 * 60 * 60);

    // Create playback log
    const playbackLog = await prisma.playbackLog.create({
      data: {
        userId,
        filmId: validatedData.filmId,
        deviceId: validatedData.deviceId,
        sessionId,
        quality: validatedData.quality,
        ipAddress: req.ip,
      },
    });

    res.status(201).json(
      createSuccessResponse({
        sessionId,
        filmId: validatedData.filmId,
        quality: validatedData.quality || 'auto',
        streamUrl: generateStreamUrl(validatedData.filmId, validatedData.quality),
        startTime: new Date(),
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

// Heartbeat to keep session alive
router.post('/:sessionId/heartbeat', async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { position, bandwidth } = req.body;

    const sessionData = await redis.get(`session:${sessionId}`);

    if (!sessionData) {
      return res.status(404).json(
        createErrorResponse('SESSION_NOT_FOUND', 'Playback session not found or expired')
      );
    }

    const session = JSON.parse(sessionData);

    // Update session expiry
    await redis.expire(`session:${sessionId}`, 4 * 60 * 60);

    // Update playback log
    await prisma.playbackLog.updateMany({
      where: { sessionId },
      data: {
        position: position || 0,
        bandwidth: bandwidth || 0,
      },
    });

    // Update watch history
    await prisma.watchHistory.upsert({
      where: {
        profileId_filmId: {
          profileId: session.userId, // Should be actual profileId
          filmId: session.filmId,
        },
      },
      create: {
        userId: session.userId,
        profileId: session.userId, // Should be actual profileId
        filmId: session.filmId,
        position: position || 0,
        completed: false,
      },
      update: {
        position: position || 0,
        lastWatchedAt: new Date(),
      },
    });

    res.json(createSuccessResponse({ sessionId, updated: true }));
  } catch (error) {
    next(error);
  }
});

// Stop playback session
router.post('/:sessionId/stop', async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { position, completed } = req.body;

    const sessionData = await redis.get(`session:${sessionId}`);

    if (!sessionData) {
      return res.status(404).json(
        createErrorResponse('SESSION_NOT_FOUND', 'Playback session not found')
      );
    }

    const session = JSON.parse(sessionData);

    // Update playback log
    await prisma.playbackLog.updateMany({
      where: { sessionId },
      data: {
        endTime: new Date(),
        position: position || 0,
      },
    });

    // Update watch history
    await prisma.watchHistory.updateMany({
      where: {
        userId: session.userId,
        filmId: session.filmId,
      },
      data: {
        position: position || 0,
        completed: completed || false,
      },
    });

    // Remove from active streams
    await redis.srem(`active-streams:${session.userId}`, sessionId);

    // Delete session
    await redis.del(`session:${sessionId}`);

    res.json(createSuccessResponse({ sessionId, stopped: true }));
  } catch (error) {
    next(error);
  }
});

// Get active sessions
router.get('/user/:userId/active', async (req, res, next) => {
  try {
    const { userId } = req.params;

    const sessionIds = await redis.smembers(`active-streams:${userId}`);

    const sessions = [];
    for (const sessionId of sessionIds) {
      const sessionData = await redis.get(`session:${sessionId}`);
      if (sessionData) {
        sessions.push({ sessionId, ...JSON.parse(sessionData) });
      }
    }

    res.json(createSuccessResponse(sessions));
  } catch (error) {
    next(error);
  }
});

// Helper functions
async function checkUserAccess(userId: string, filmId: string): Promise<boolean> {
  // Simplified - should call Rights Service API
  // Check SVOD subscription
  const now = new Date();
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: 'active',
      currentPeriodEnd: { gte: now },
    },
  });

  if (subscription) return true;

  // Check TVOD/PPV purchase
  const purchase = await prisma.transaction.findFirst({
    where: {
      userId,
      filmId,
      status: 'COMPLETED',
    },
  });

  return !!purchase;
}

async function getActiveStreamCount(userId: string): Promise<number> {
  const sessionIds = await redis.smembers(`active-streams:${userId}`);
  return sessionIds.length;
}

async function getUserStreamLimit(userId: string): Promise<number> {
  // Get from subscription plan
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: 'active',
    },
    include: {
      plan: true,
    },
  });

  return subscription?.plan?.maxStreams || 1;
}

function generateStreamUrl(filmId: string, quality?: string): string {
  const CDN_URL = process.env.CDN_URL || 'https://cdn.thewans.com';
  const qualityPath = quality && quality !== 'auto' ? `/${quality}` : '';
  return `${CDN_URL}/streams/${filmId}${qualityPath}/master.m3u8`;
}

function detectDeviceType(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet/i.test(userAgent)) return 'tablet';
  if (/smart-tv|smarttv|tv/i.test(userAgent)) return 'tv';
  return 'desktop';
}

export default router;
