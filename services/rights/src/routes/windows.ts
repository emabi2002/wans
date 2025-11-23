import express from 'express';
import { prisma } from '@the-wans/database';
import { createWindowSchema } from '@the-wans/shared';
import { createSuccessResponse, createErrorResponse } from '@the-wans/shared';

const router = express.Router();

// Get all windows for a film
router.get('/film/:filmId', async (req, res, next) => {
  try {
    const { filmId } = req.params;

    const windows = await prisma.window.findMany({
      where: { filmId },
      orderBy: { startDate: 'asc' },
    });

    res.json(createSuccessResponse(windows));
  } catch (error) {
    next(error);
  }
});

// Get window by ID
router.get('/:windowId', async (req, res, next) => {
  try {
    const { windowId } = req.params;

    const window = await prisma.window.findUnique({
      where: { id: windowId },
      include: {
        film: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!window) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Window not found')
      );
    }

    res.json(createSuccessResponse(window));
  } catch (error) {
    next(error);
  }
});

// Create window
router.post('/', async (req, res, next) => {
  try {
    const validatedData = createWindowSchema.parse(req.body);

    // Verify film exists
    const film = await prisma.film.findUnique({
      where: { id: validatedData.filmId },
    });

    if (!film) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Film not found')
      );
    }

    // Check for overlapping windows of same type
    const overlappingWindow = await prisma.window.findFirst({
      where: {
        filmId: validatedData.filmId,
        windowType: validatedData.windowType,
        isActive: true,
        OR: [
          {
            startDate: {
              lte: validatedData.endDate || new Date('2099-12-31'),
            },
            endDate: validatedData.endDate
              ? { gte: validatedData.startDate }
              : null,
          },
          {
            startDate: {
              lte: validatedData.endDate || new Date('2099-12-31'),
            },
            endDate: null,
          },
        ],
      },
    });

    if (overlappingWindow) {
      return res.status(400).json(
        createErrorResponse(
          'WINDOW_OVERLAP',
          'A window of this type already exists for the specified date range'
        )
      );
    }

    const window = await prisma.window.create({
      data: validatedData,
    });

    res.status(201).json(createSuccessResponse(window));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'Invalid input data', error.errors)
      );
    }
    next(error);
  }
});

// Update window
router.patch('/:windowId', async (req, res, next) => {
  try {
    const { windowId } = req.params;

    const window = await prisma.window.findUnique({
      where: { id: windowId },
    });

    if (!window) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Window not found')
      );
    }

    const updatedWindow = await prisma.window.update({
      where: { id: windowId },
      data: req.body,
    });

    res.json(createSuccessResponse(updatedWindow));
  } catch (error) {
    next(error);
  }
});

// Delete window
router.delete('/:windowId', async (req, res, next) => {
  try {
    const { windowId } = req.params;

    const window = await prisma.window.findUnique({
      where: { id: windowId },
    });

    if (!window) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Window not found')
      );
    }

    await prisma.window.delete({
      where: { id: windowId },
    });

    res.json(createSuccessResponse({ message: 'Window deleted successfully' }));
  } catch (error) {
    next(error);
  }
});

// Activate/deactivate window
router.patch('/:windowId/toggle', async (req, res, next) => {
  try {
    const { windowId } = req.params;

    const window = await prisma.window.findUnique({
      where: { id: windowId },
    });

    if (!window) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Window not found')
      );
    }

    const updatedWindow = await prisma.window.update({
      where: { id: windowId },
      data: { isActive: !window.isActive },
    });

    res.json(createSuccessResponse(updatedWindow));
  } catch (error) {
    next(error);
  }
});

// Get active windows by type
router.get('/type/:windowType', async (req, res, next) => {
  try {
    const { windowType } = req.params;
    const now = new Date();

    const windows = await prisma.window.findMany({
      where: {
        windowType: windowType as any,
        isActive: true,
        startDate: { lte: now },
        OR: [
          { endDate: null },
          { endDate: { gte: now } },
        ],
      },
      include: {
        film: {
          select: {
            id: true,
            title: true,
            slug: true,
            posterUrl: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    res.json(createSuccessResponse(windows));
  } catch (error) {
    next(error);
  }
});

export default router;
