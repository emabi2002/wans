import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import filmRouter from './routes/films';
import genreRouter from './routes/genres';
import searchRouter from './routes/search';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'catalog' });
});

// Routes
app.use('/api/films', filmRouter);
app.use('/api/genres', genreRouter);
app.use('/api/search', searchRouter);

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
  console.log(`🎬 Catalog Service running on port ${PORT}`);
});
