import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import subscriptionRouter from './routes/subscriptions';
import transactionRouter from './routes/transactions';
import couponRouter from './routes/coupons';
import webhookRouter from './routes/webhooks';
import planRouter from './routes/plans';

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

// Webhook routes need raw body
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRouter);

// All other routes use JSON
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'payment' });
});

// Routes
app.use('/api/subscriptions', subscriptionRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/coupons', couponRouter);
app.use('/api/plans', planRouter);

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
  console.log(`💳 Payment Service running on port ${PORT}`);
});
