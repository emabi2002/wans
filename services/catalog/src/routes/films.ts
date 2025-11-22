import express from 'express';
import { prisma } from '@the-wans/database';
import { createFilmSchema, updateFilmStatusSchema, paginationSchema } from '@the-wans/shared';
import { createSuccessResponse, createErrorResponse, slugify } from '@the-wans/shared';

const router = express.Router();

// Get all films (paginated)
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, sortBy, sortOrder } = paginationSchema.parse(req.query);

    const skip = (page - 1) * limit;

    const [films, total] = await Promise.all([
      prisma.film.findMany({
        where: { status: 'PUBLISHED' },
        skip,
        take: limit,
        orderBy: { [sortBy || 'createdAt']: sortOrder },
        include: {
          genres: {
            include: {
              genre: true,
            },
          },
        },
      }),
      prisma.film.count({ where: { status: 'PUBLISHED' } }),
    ]);

    res.json(
      createSuccessResponse(films, {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      })
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'Invalid query parameters', error.errors)
      );
    }
    next(error);
  }
});

// Get film by ID or slug
router.get('/:identifier', async (req, res, next) => {
  try {
    const { identifier } = req.params;

    const film = await prisma.film.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier },
        ],
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        assets: true,
        windows: {
          orderBy: { startDate: 'asc' },
        },
        royaltyRules: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!film) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Film not found')
      );
    }

    res.json(createSuccessResponse(film));
  } catch (error) {
    next(error);
  }
});

// Create film (creator/admin only)
router.post('/', async (req, res, next) => {
  try {
    const validatedData = createFilmSchema.parse(req.body);
    const creatorId = req.headers['x-user-id'] as string;

    if (!creatorId) {
      return res.status(401).json(
        createErrorResponse('UNAUTHORIZED', 'User ID required')
      );
    }

    const slug = slugify(validatedData.title);

    // Check if slug exists
    const existingFilm = await prisma.film.findUnique({
      where: { slug },
    });

    if (existingFilm) {
      return res.status(400).json(
        createErrorResponse('DUPLICATE_SLUG', 'A film with this title already exists')
      );
    }

    const film = await prisma.film.create({
      data: {
        title: validatedData.title,
        slug,
        description: validatedData.description,
        longDescription: validatedData.longDescription,
        language: validatedData.language,
        subtitles: validatedData.subtitles,
        runtime: validatedData.runtime,
        releaseYear: validatedData.releaseYear,
        rating: validatedData.rating,
        version: validatedData.version,
        creatorId,
        status: 'DRAFT',
        genres: {
          create: validatedData.genres.map((genreName) => ({
            genre: {
              connectOrCreate: {
                where: { slug: slugify(genreName) },
                create: {
                  name: genreName,
                  slug: slugify(genreName),
                },
              },
            },
          })),
        },
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    res.status(201).json(createSuccessResponse(film));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'Invalid input data', error.errors)
      );
    }
    next(error);
  }
});

// Update film
router.patch('/:filmId', async (req, res, next) => {
  try {
    const { filmId } = req.params;
    const userId = req.headers['x-user-id'] as string;

    // Verify ownership or admin
    const film = await prisma.film.findUnique({
      where: { id: filmId },
    });

    if (!film) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Film not found')
      );
    }

    if (film.creatorId !== userId) {
      return res.status(403).json(
        createErrorResponse('FORBIDDEN', 'You do not have permission to update this film')
      );
    }

    const updatedFilm = await prisma.film.update({
      where: { id: filmId },
      data: req.body,
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    res.json(createSuccessResponse(updatedFilm));
  } catch (error) {
    next(error);
  }
});

// Update film status
router.patch('/:filmId/status', async (req, res, next) => {
  try {
    const { filmId } = req.params;
    const validatedData = updateFilmStatusSchema.parse(req.body);

    const updatedFilm = await prisma.film.update({
      where: { id: filmId },
      data: {
        status: validatedData.status,
        publishedAt: validatedData.status === 'PUBLISHED' ? new Date() : undefined,
      },
    });

    res.json(createSuccessResponse(updatedFilm));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'Invalid input data', error.errors)
      );
    }
    next(error);
  }
});

// Delete film
router.delete('/:filmId', async (req, res, next) => {
  try {
    const { filmId } = req.params;
    const userId = req.headers['x-user-id'] as string;

    // Verify ownership
    const film = await prisma.film.findUnique({
      where: { id: filmId },
    });

    if (!film) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Film not found')
      );
    }

    if (film.creatorId !== userId) {
      return res.status(403).json(
        createErrorResponse('FORBIDDEN', 'You do not have permission to delete this film')
      );
    }

    await prisma.film.delete({
      where: { id: filmId },
    });

    res.json(createSuccessResponse({ message: 'Film deleted successfully' }));
  } catch (error) {
    next(error);
  }
});

// Get films by genre
router.get('/genre/:genreSlug', async (req, res, next) => {
  try {
    const { genreSlug } = req.params;
    const { page, limit } = paginationSchema.parse(req.query);
    const skip = (page - 1) * limit;

    const films = await prisma.film.findMany({
      where: {
        status: 'PUBLISHED',
        genres: {
          some: {
            genre: {
              slug: genreSlug,
            },
          },
        },
      },
      skip,
      take: limit,
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    res.json(createSuccessResponse(films));
  } catch (error) {
    next(error);
  }
});

export default router;
