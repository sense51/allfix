import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import db from './db/index.js';
import authRoutes from './routes/auth.js';
import serviceRoutes from './routes/services.js';
import bookingRoutes from './routes/bookings.js';
import reviewRoutes from './routes/reviews.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const isProd = process.env.NODE_ENV === 'production';
const isVercel = !!process.env.VERCEL;

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');
app.use(cors({
  origin: isProd
    ? allowedOrigins.filter(o => !o.includes('localhost') && !o.includes('127.0.0.1')).length > 0
      ? allowedOrigins.filter(o => !o.includes('localhost') && !o.includes('127.0.0.1'))
      : true
    : allowedOrigins,
  credentials: true,
}));
app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    if (!isProd) {
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
    }
  });
  next();
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/send-otp', authLimiter);
app.use('/api/auth/verify-otp', authLimiter);
app.use('/api/auth/google', authLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/api/health', async (_, res) => {
  try {
    await db.raw('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});

if (isProd) {
  const clientDist = path.resolve(__dirname, '../../client/dist');
  const clientIndex = path.join(clientDist, 'index.html');
  if (fs.existsSync(clientIndex)) {
    app.use(express.static(clientDist));
    app.get('*', (_, res) => {
      res.sendFile(clientIndex);
    });
  } else {
    app.get('/api/*', (req, res) => {
      res.status(404).json({ error: `API endpoint not found: ${req.method} ${req.originalUrl}` });
    });
  }
}

if (!isVercel) {
  app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT} [${isProd ? 'production' : 'development'}]`);
  });
}

export default app;
