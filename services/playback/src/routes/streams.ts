import express from 'express';
import { prisma } from '@the-wans/database';
import { createSuccessResponse, createErrorResponse } from '@the-wans/shared';

const router = express.Router();

// Get stream manifest
router.get('/:filmId/manifest', async (req, res, next) => {
  try {
    const { filmId } = req.params;
    const { quality } = req.query;

    const film = await prisma.film.findUnique({
      where: { id: filmId },
      include: {
        assets: {
          where: {
            type: 'video',
          },
        },
      },
    });

    if (!film) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Film not found')
      );
    }

    const CDN_URL = process.env.CDN_URL || 'https://cdn.thewans.com';
    const qualityPath = quality && quality !== 'auto' ? `/${quality}` : '';

    const manifest = {
      filmId: film.id,
      title: film.title,
      duration: film.runtime * 60, // Convert to seconds
      formats: {
        hls: `${CDN_URL}/streams/${filmId}${qualityPath}/master.m3u8`,
        dash: `${CDN_URL}/streams/${filmId}${qualityPath}/manifest.mpd`,
      },
      qualities: [
        { label: '4K', resolution: '2160p', bandwidth: 25000000 },
        { label: '1080p', resolution: '1080p', bandwidth: 8000000 },
        { label: '720p', resolution: '720p', bandwidth: 5000000 },
        { label: '480p', resolution: '480p', bandwidth: 2500000 },
        { label: '360p', resolution: '360p', bandwidth: 1000000 },
        { label: '240p', resolution: '240p', bandwidth: 500000 },
      ],
      subtitles: film.subtitles.map((lang) => ({
        language: lang,
        url: `${CDN_URL}/streams/${filmId}/subtitles/${lang}.vtt`,
      })),
      thumbnails: `${CDN_URL}/streams/${filmId}/thumbnails/sprite.jpg`,
      poster: film.posterUrl,
    };

    res.json(createSuccessResponse(manifest));
  } catch (error) {
    next(error);
  }
});

// Get quality options
router.get('/:filmId/qualities', async (req, res, next) => {
  try {
    const { filmId } = req.params;

    const transcodingJob = await prisma.transcodingJob.findFirst({
      where: {
        filmId,
        status: 'COMPLETED',
      },
      orderBy: { completedAt: 'desc' },
    });

    if (!transcodingJob) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'No transcoded versions available')
      );
    }

    const qualities = transcodingJob.resolution.map((res) => {
      const bandwidth = getBandwidthForResolution(res);
      return {
        resolution: res,
        bandwidth,
        label: res.replace('p', ''),
      };
    });

    res.json(createSuccessResponse(qualities));
  } catch (error) {
    next(error);
  }
});

// Get playback statistics
router.get('/:filmId/stats', async (req, res, next) => {
  try {
    const { filmId } = req.params;

    const [totalPlays, uniqueViewers, avgWatchTime] = await Promise.all([
      prisma.playbackLog.count({
        where: { filmId },
      }),
      prisma.playbackLog.groupBy({
        by: ['userId'],
        where: { filmId },
        _count: true,
      }),
      prisma.playbackLog.aggregate({
        where: { filmId },
        _avg: {
          position: true,
        },
      }),
    ]);

    const stats = {
      totalPlays,
      uniqueViewers: uniqueViewers.length,
      avgWatchTime: avgWatchTime._avg.position || 0,
    };

    res.json(createSuccessResponse(stats));
  } catch (error) {
    next(error);
  }
});

// Helper functions
function getBandwidthForResolution(resolution: string): number {
  const bandwidthMap: Record<string, number> = {
    '2160p': 25000000,
    '1440p': 16000000,
    '1080p': 8000000,
    '720p': 5000000,
    '480p': 2500000,
    '360p': 1000000,
    '240p': 500000,
  };

  return bandwidthMap[resolution] || 5000000;
}

export default router;
