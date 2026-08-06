import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './db/prisma.js';
import { requestLogger } from './middleware/requestLogger.js';
import { globalErrorHandler } from './middleware/errorHandler.js';
import { sendSuccess } from './utils/responseHandler.js';

import authRoutes from './routes/auth.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import vehicleRoutes from './routes/vehicle.routes.js';
import statusRoutes from './routes/status.routes.js';
import pointRoutes from './routes/point.routes.js';
import promoRoutes from './routes/promo.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS for ngrok & external device testing
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'ngrok-skip-browser-warning'],
  })
);

app.use(express.json());
app.use(requestLogger);

// Enterprise Health Check & Live Database Ping
app.get('/api/health', async (_req, res, next) => {
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatencyMs = Date.now() - dbStart;

    const memoryUsage = process.memoryUsage();

    return sendSuccess(res, {
      status: 'HEALTHY',
      service: 'TBC Car Spa Enterprise API',
      database: {
        connected: true,
        latencyMs: dbLatencyMs,
      },
      lineConnected: Boolean(process.env.LINE_CHANNEL_ACCESS_TOKEN && !process.env.LINE_CHANNEL_ACCESS_TOKEN.includes('YOUR_')),
      system: {
        uptimeSeconds: Math.floor(process.uptime()),
        memoryMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      },
    });
  } catch (error) {
    return next(error);
  }
});

// Register Routes
app.use('/api', authRoutes);
app.use('/api', bookingRoutes);
app.use('/api', vehicleRoutes);
app.use('/api', statusRoutes);
app.use('/api', pointRoutes);
app.use('/api', promoRoutes);
app.use('/api', adminRoutes);

// Global Error Handler Middleware
app.use(globalErrorHandler);

app.post('/api/callback', async (req, res) => {
  try {
    const events = req.body.events;
    return res.status(200).json({ status: 'success' });
  } catch (error: any) {
    console.error('LINE Webhook Error:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'TBC Car Spa Enterprise API is running. Please use Frontend (Port 3000) for the UI.',
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 TBC Car Spa Enterprise API running on http://localhost:${PORT}`);
  console.log(`🌐 CORS: Allowed for all origins (ngrok enabled)`);
});

// Enterprise Graceful Shutdown Handlers
async function gracefulShutdown(signal: string) {
  console.log(`\n🛑 Received ${signal}. Initiating Enterprise Graceful Shutdown...`);
  server.close(async () => {
    console.log('🔌 HTTP Server closed.');
    await prisma.$disconnect();
    console.log('📦 Database connections safely disconnected.');
    process.exit(0);
  });
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
