import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import jobRouter from './routes/jobs';
import uploadRouter from './routes/upload';
import webhookRouter from './routes/webhooks';

const app = express();
const PORT = process.env.PORT || 3006;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'transcoding' });
});

// Routes
app.use('/api/jobs', jobRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/webhooks', webhookRouter);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred',
    },
  });
});

app.listen(PORT, () => {
  console.log(`🎞️  Transcoding Service running on port ${PORT}`);
});
