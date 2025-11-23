import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import windowRouter from './routes/windows';
import availabilityRouter from './routes/availability';

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'rights' });
});

// Routes
app.use('/api/windows', windowRouter);
app.use('/api/availability', availabilityRouter);

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
  console.log(`🎫 Rights Service running on port ${PORT}`);
});
