import express from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '@the-wans/database';
import { createSuccessResponse, createErrorResponse, generateDRMLicenseUrl } from '@the-wans/shared';

const router = express.Router();
const DRM_SECRET = process.env.DRM_SECRET || 'drm-secret-key-change-in-production';

// Get DRM token for film
router.get('/token/:filmId', async (req, res, next) => {
  try {
    const { filmId } = req.params;
    const userId = req.headers['x-user-id'] as string;
    const deviceId = req.headers['x-device-id'] as string;

    if (!userId) {
      return res.status(401).json(
        createErrorResponse('UNAUTHORIZED', 'User ID required')
      );
    }

    // Check film exists
    const film = await prisma.film.findUnique({
      where: { id: filmId },
    });

    if (!film) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Film not found')
      );
    }

    // Check user access
    const hasAccess = await checkUserAccess(userId, filmId);

    if (!hasAccess) {
      return res.status(403).json(
        createErrorResponse('ACCESS_DENIED', 'You do not have access to this content')
      );
    }

    // Generate DRM tokens for different systems
    const tokens = {
      widevine: generateWidevineToken(filmId, userId, deviceId),
      fairplay: generateFairPlayToken(filmId, userId, deviceId),
      playready: generatePlayReadyToken(filmId, userId, deviceId),
    };

    res.json(
      createSuccessResponse({
        filmId,
        tokens,
        licenseUrls: {
          widevine: generateDRMLicenseUrl(filmId, 'widevine'),
          fairplay: generateDRMLicenseUrl(filmId, 'fairplay'),
          playready: generateDRMLicenseUrl(filmId, 'playready'),
        },
        expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
      })
    );
  } catch (error) {
    next(error);
  }
});

// Widevine license endpoint
router.post('/license/widevine/:filmId', async (req, res, next) => {
  try {
    const { filmId } = req.params;
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json(
        createErrorResponse('UNAUTHORIZED', 'Token required')
      );
    }

    // Verify token
    const decoded = jwt.verify(token, DRM_SECRET) as any;

    if (decoded.filmId !== filmId) {
      return res.status(403).json(
        createErrorResponse('FORBIDDEN', 'Invalid token for this film')
      );
    }

    // In production, this would communicate with actual Widevine license server
    const license = {
      type: 'widevine',
      filmId,
      userId: decoded.userId,
      expiresAt: decoded.exp,
      // Actual Widevine license data would go here
      licenseData: 'MOCK_WIDEVINE_LICENSE_DATA',
    };

    res.json(createSuccessResponse(license));
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json(
        createErrorResponse('UNAUTHORIZED', 'Invalid token')
      );
    }
    next(error);
  }
});

// FairPlay license endpoint
router.post('/license/fairplay/:filmId', async (req, res, next) => {
  try {
    const { filmId } = req.params;
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json(
        createErrorResponse('UNAUTHORIZED', 'Token required')
      );
    }

    // Verify token
    const decoded = jwt.verify(token, DRM_SECRET) as any;

    if (decoded.filmId !== filmId) {
      return res.status(403).json(
        createErrorResponse('FORBIDDEN', 'Invalid token for this film')
      );
    }

    // In production, this would communicate with actual FairPlay license server
    const license = {
      type: 'fairplay',
      filmId,
      userId: decoded.userId,
      expiresAt: decoded.exp,
      // Actual FairPlay license data would go here
      licenseData: 'MOCK_FAIRPLAY_LICENSE_DATA',
    };

    res.json(createSuccessResponse(license));
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json(
        createErrorResponse('UNAUTHORIZED', 'Invalid token')
      );
    }
    next(error);
  }
});

// PlayReady license endpoint
router.post('/license/playready/:filmId', async (req, res, next) => {
  try {
    const { filmId } = req.params;
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json(
        createErrorResponse('UNAUTHORIZED', 'Token required')
      );
    }

    // Verify token
    const decoded = jwt.verify(token, DRM_SECRET) as any;

    if (decoded.filmId !== filmId) {
      return res.status(403).json(
        createErrorResponse('FORBIDDEN', 'Invalid token for this film')
      );
    }

    // In production, this would communicate with actual PlayReady license server
    const license = {
      type: 'playready',
      filmId,
      userId: decoded.userId,
      expiresAt: decoded.exp,
      // Actual PlayReady license data would go here
      licenseData: 'MOCK_PLAYREADY_LICENSE_DATA',
    };

    res.json(createSuccessResponse(license));
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json(
        createErrorResponse('UNAUTHORIZED', 'Invalid token')
      );
    }
    next(error);
  }
});

// Helper functions
function generateWidevineToken(filmId: string, userId: string, deviceId: string): string {
  return jwt.sign(
    {
      filmId,
      userId,
      deviceId,
      drmType: 'widevine',
    },
    DRM_SECRET,
    { expiresIn: '4h' }
  );
}

function generateFairPlayToken(filmId: string, userId: string, deviceId: string): string {
  return jwt.sign(
    {
      filmId,
      userId,
      deviceId,
      drmType: 'fairplay',
    },
    DRM_SECRET,
    { expiresIn: '4h' }
  );
}

function generatePlayReadyToken(filmId: string, userId: string, deviceId: string): string {
  return jwt.sign(
    {
      filmId,
      userId,
      deviceId,
      drmType: 'playready',
    },
    DRM_SECRET,
    { expiresIn: '4h' }
  );
}

async function checkUserAccess(userId: string, filmId: string): Promise<boolean> {
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

export default router;
