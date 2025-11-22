import express from 'express';
import { createSuccessResponse, createErrorResponse } from '@the-wans/shared';

const router = express.Router();

// Generate pre-signed URL for upload (placeholder)
router.post('/url', async (req, res, next) => {
  try {
    const { filmId, filename, contentType } = req.body;

    if (!filmId || !filename) {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'filmId and filename are required')
      );
    }

    // In production, generate actual S3 pre-signed URL
    const uploadUrl = `https://s3.amazonaws.com/${process.env.S3_BUCKET}/uploads/${filmId}/${filename}`;
    const uploadId = `upload_${Date.now()}`;

    res.json(
      createSuccessResponse({
        uploadId,
        uploadUrl,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        method: 'PUT',
        headers: {
          'Content-Type': contentType || 'video/mp4',
        },
      })
    );
  } catch (error) {
    next(error);
  }
});

// Confirm upload completion
router.post('/complete', async (req, res, next) => {
  try {
    const { uploadId, filmId, path } = req.body;

    res.json(
      createSuccessResponse({
        uploadId,
        filmId,
        path,
        status: 'completed',
      })
    );
  } catch (error) {
    next(error);
  }
});

export default router;
