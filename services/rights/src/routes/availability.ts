import express from 'express';
import { prisma } from '@the-wans/database';
import { createSuccessResponse, createErrorResponse, isWindowActive } from '@the-wans/shared';
import type { WindowAvailability } from '@the-wans/shared';

const router = express.Router();

// Check film availability for user
router.get('/:filmId', async (req, res, next) => {
  try {
    const { filmId } = req.params;
    const userId = req.headers['x-user-id'] as string;
    const territory = (req.headers['x-user-territory'] as string) || 'GLOBAL';

    // Get film
    const film = await prisma.film.findUnique({
      where: { id: filmId },
      include: {
        windows: {
          where: { isActive: true },
        },
      },
    });

    if (!film) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Film not found')
      );
    }

    if (film.status !== 'PUBLISHED') {
      return res.json(
        createSuccessResponse({
          available: false,
          reason: 'Film is not yet published',
          windows: [],
        })
      );
    }

    // Check active windows for user's territory
    const now = new Date();
    const availableWindows: WindowAvailability[] = [];

    for (const window of film.windows) {
      // Check if window is active for this territory
      if (!window.territories.includes('GLOBAL') && !window.territories.includes(territory)) {
        continue;
      }

      // Check if window is currently active
      if (!isWindowActive(window.startDate, window.endDate)) {
        continue;
      }

      availableWindows.push({
        windowType: window.windowType,
        isAvailable: true,
        price: window.price,
        currency: window.currency,
        startDate: window.startDate,
        endDate: window.endDate,
        rentalDuration: window.rentalDuration,
      });
    }

    if (availableWindows.length === 0) {
      return res.json(
        createSuccessResponse({
          available: false,
          reason: 'No active windows available for your region',
          windows: [],
        })
      );
    }

    // Check user's entitlements
    let hasAccess = false;
    let accessType = null;

    if (userId) {
      // Check SVOD subscription
      const activeSubscription = await prisma.subscription.findFirst({
        where: {
          userId,
          status: 'active',
          currentPeriodEnd: { gte: now },
        },
      });

      if (activeSubscription && availableWindows.some(w => w.windowType === 'SVOD')) {
        hasAccess = true;
        accessType = 'SVOD';
      }

      // Check TVOD/PPV purchases
      if (!hasAccess) {
        const purchase = await prisma.transaction.findFirst({
          where: {
            userId,
            filmId,
            status: 'COMPLETED',
            windowType: { in: ['TVOD', 'PPV', 'PVOD'] },
          },
          orderBy: { createdAt: 'desc' },
        });

        if (purchase) {
          const window = availableWindows.find(w => w.windowType === purchase.windowType);
          if (window && window.rentalDuration) {
            const expiryDate = new Date(purchase.createdAt);
            expiryDate.setHours(expiryDate.getHours() + window.rentalDuration);

            if (expiryDate > now) {
              hasAccess = true;
              accessType = purchase.windowType;
            }
          } else if (window) {
            hasAccess = true;
            accessType = purchase.windowType;
          }
        }
      }

      // Check AVOD (always available to logged-in users)
      if (!hasAccess && availableWindows.some(w => w.windowType === 'AVOD')) {
        hasAccess = true;
        accessType = 'AVOD';
      }
    }

    res.json(
      createSuccessResponse({
        available: true,
        hasAccess,
        accessType,
        windows: availableWindows,
        requiresPayment: !hasAccess && availableWindows.some(w => w.price && w.price > 0),
        requiresSubscription: !hasAccess && availableWindows.some(w => w.windowType === 'SVOD'),
      })
    );
  } catch (error) {
    next(error);
  }
});

// Check bulk availability (for catalog browsing)
router.post('/bulk', async (req, res, next) => {
  try {
    const { filmIds } = req.body;
    const userId = req.headers['x-user-id'] as string;
    const territory = (req.headers['x-user-territory'] as string) || 'GLOBAL';

    if (!Array.isArray(filmIds) || filmIds.length === 0) {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'filmIds must be a non-empty array')
      );
    }

    const now = new Date();
    const results: Record<string, any> = {};

    // Get user's subscription status
    let hasActiveSubscription = false;
    if (userId) {
      const subscription = await prisma.subscription.findFirst({
        where: {
          userId,
          status: 'active',
          currentPeriodEnd: { gte: now },
        },
      });
      hasActiveSubscription = !!subscription;
    }

    // Get all films with their windows
    const films = await prisma.film.findMany({
      where: {
        id: { in: filmIds },
        status: 'PUBLISHED',
      },
      include: {
        windows: {
          where: {
            isActive: true,
            startDate: { lte: now },
            OR: [
              { endDate: null },
              { endDate: { gte: now } },
            ],
          },
        },
      },
    });

    for (const film of films) {
      const territoryWindows = film.windows.filter(
        w => w.territories.includes('GLOBAL') || w.territories.includes(territory)
      );

      let hasAccess = false;
      let lowestPrice = null;

      for (const window of territoryWindows) {
        if (window.windowType === 'SVOD' && hasActiveSubscription) {
          hasAccess = true;
          break;
        }

        if (window.windowType === 'AVOD' && userId) {
          hasAccess = true;
          break;
        }

        if (window.price && (!lowestPrice || window.price < lowestPrice)) {
          lowestPrice = window.price;
        }
      }

      results[film.id] = {
        available: territoryWindows.length > 0,
        hasAccess,
        lowestPrice,
        windowTypes: territoryWindows.map(w => w.windowType),
      };
    }

    res.json(createSuccessResponse(results));
  } catch (error) {
    next(error);
  }
});

// Get upcoming windows
router.get('/upcoming/:filmId', async (req, res, next) => {
  try {
    const { filmId } = req.params;
    const now = new Date();

    const upcomingWindows = await prisma.window.findMany({
      where: {
        filmId,
        isActive: true,
        startDate: { gt: now },
      },
      orderBy: { startDate: 'asc' },
      take: 5,
    });

    res.json(createSuccessResponse(upcomingWindows));
  } catch (error) {
    next(error);
  }
});

export default router;
