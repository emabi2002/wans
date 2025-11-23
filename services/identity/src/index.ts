import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRouter from './routes/auth';
import profileRouter from './routes/profile';
import userRouter from './routes/user';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'identity' });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/user', userRouter);

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
  console.log(`🔐 Identity Service running on port ${PORT}`);
});
