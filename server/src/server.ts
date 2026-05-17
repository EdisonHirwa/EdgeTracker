import express from 'express';
import { tradeRoutes } from './routes/trade.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (basic — replace with cors package when needed)
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'EdgeTracker API is running' });
});

// Routes
app.use('/api/trades', tradeRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 EdgeTracker server running on http://localhost:${PORT}`);
});

export default app;
