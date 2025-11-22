import { Worker } from 'bullmq';
import ffmpeg from 'fluent-ffmpeg';
import { prisma } from '@the-wans/database';
import * as fs from 'fs';
import * as path from 'path';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');
const OUTPUT_DIR = process.env.OUTPUT_DIR || '/tmp/transcoded';
const S3_BUCKET = process.env.S3_BUCKET || 'thewans-content';

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Create transcoding worker
const worker = new Worker(
  'transcoding',
  async (job) => {
    const { jobId, filmId, inputPath, resolution, format } = job.data;

    console.log(`Starting transcoding job ${jobId} for film ${filmId}`);

    try {
      // Update job status
      await prisma.transcodingJob.update({
        where: { id: jobId },
        data: {
          status: 'PROCESSING',
          startedAt: new Date(),
        },
      });

      // Create output directory for this film
      const filmOutputDir = path.join(OUTPUT_DIR, filmId);
      if (!fs.existsSync(filmOutputDir)) {
        fs.mkdirSync(filmOutputDir, { recursive: true });
      }

      // Process each resolution
      const outputs: string[] = [];

      for (const res of resolution) {
        const output = await transcodeToResolution(
          inputPath,
          filmOutputDir,
          res,
          format,
          (progress) => {
            // Update progress in database
            const currentIndex = resolution.indexOf(res);
            const totalProgress = ((currentIndex + progress / 100) / resolution.length) * 100;

            prisma.transcodingJob.update({
              where: { id: jobId },
              data: { progress: Math.round(totalProgress) },
            }).catch(console.error);

            // Update job progress in BullMQ
            job.updateProgress(Math.round(totalProgress));
          }
        );

        outputs.push(output);
      }

      // Generate HLS/DASH manifests
      if (format === 'hls' || format === 'both') {
        await generateHLSManifest(filmOutputDir, outputs);
      }

      if (format === 'dash' || format === 'both') {
        await generateDASHManifest(filmOutputDir, outputs);
      }

      // Generate thumbnails
      await generateThumbnails(inputPath, filmOutputDir);

      // Upload to S3/storage (placeholder)
      const uploadedPath = await uploadToStorage(filmOutputDir, filmId);

      // Update job as completed
      await prisma.transcodingJob.update({
        where: { id: jobId },
        data: {
          status: 'COMPLETED',
          progress: 100,
          outputPath: uploadedPath,
          completedAt: new Date(),
        },
      });

      console.log(`Completed transcoding job ${jobId}`);

      return { jobId, outputs, uploadedPath };
    } catch (error: any) {
      console.error(`Failed transcoding job ${jobId}:`, error);

      // Update job as failed
      await prisma.transcodingJob.update({
        where: { id: jobId },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
          completedAt: new Date(),
        },
      });

      throw error;
    }
  },
  {
    connection: {
      host: REDIS_HOST,
      port: REDIS_PORT,
    },
    concurrency: 2, // Process 2 jobs simultaneously
  }
);

// Transcode video to specific resolution
function transcodeToResolution(
  inputPath: string,
  outputDir: string,
  resolution: string,
  format: string,
  onProgress: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const resolutionMap: Record<string, { width: number; height: number; bitrate: string }> = {
      '2160p': { width: 3840, height: 2160, bitrate: '25000k' },
      '1440p': { width: 2560, height: 1440, bitrate: '16000k' },
      '1080p': { width: 1920, height: 1080, bitrate: '8000k' },
      '720p': { width: 1280, height: 720, bitrate: '5000k' },
      '480p': { width: 854, height: 480, bitrate: '2500k' },
      '360p': { width: 640, height: 360, bitrate: '1000k' },
      '240p': { width: 426, height: 240, bitrate: '500k' },
    };

    const config = resolutionMap[resolution];
    if (!config) {
      return reject(new Error(`Invalid resolution: ${resolution}`));
    }

    const outputPath = path.join(outputDir, `${resolution}.mp4`);

    ffmpeg(inputPath)
      .size(`${config.width}x${config.height}`)
      .videoBitrate(config.bitrate)
      .videoCodec('libx264')
      .audioCodec('aac')
      .audioBitrate('128k')
      .outputOptions([
        '-preset medium',
        '-profile:v high',
        '-level 4.0',
        '-movflags +faststart',
      ])
      .on('progress', (progress) => {
        onProgress(progress.percent || 0);
      })
      .on('end', () => {
        resolve(outputPath);
      })
      .on('error', (error) => {
        reject(error);
      })
      .save(outputPath);
  });
}

// Generate HLS manifest
async function generateHLSManifest(outputDir: string, videoFiles: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const manifestPath = path.join(outputDir, 'master.m3u8');

    // Use first video file as base
    ffmpeg(videoFiles[0])
      .outputOptions([
        '-hls_time 6',
        '-hls_playlist_type vod',
        '-hls_segment_filename',
        path.join(outputDir, 'segment_%03d.ts'),
      ])
      .output(manifestPath)
      .on('end', () => resolve())
      .on('error', (error) => reject(error))
      .run();
  });
}

// Generate DASH manifest
async function generateDASHManifest(outputDir: string, videoFiles: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const manifestPath = path.join(outputDir, 'manifest.mpd');

    // Use first video file as base
    ffmpeg(videoFiles[0])
      .outputOptions([
        '-f dash',
        '-seg_duration 6',
      ])
      .output(manifestPath)
      .on('end', () => resolve())
      .on('error', (error) => reject(error))
      .run();
  });
}

// Generate video thumbnails
async function generateThumbnails(inputPath: string, outputDir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const thumbnailDir = path.join(outputDir, 'thumbnails');

    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }

    ffmpeg(inputPath)
      .screenshots({
        count: 100,
        folder: thumbnailDir,
        filename: 'thumb_%04d.png',
        size: '320x180',
      })
      .on('end', () => resolve())
      .on('error', (error) => reject(error));
  });
}

// Upload to S3-compatible storage
async function uploadToStorage(localDir: string, filmId: string): Promise<string> {
  // Placeholder - integrate with actual S3 SDK
  const remotePath = `s3://${S3_BUCKET}/streams/${filmId}/`;

  console.log(`Would upload ${localDir} to ${remotePath}`);

  // In production, use AWS SDK or similar:
  // await s3.uploadDir(localDir, remotePath);

  return remotePath;
}

worker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message);
});

worker.on('error', (err) => {
  console.error('Worker error:', err);
});

console.log('🎬 Transcoding worker started');
console.log(`Waiting for jobs on Redis ${REDIS_HOST}:${REDIS_PORT}...`);
