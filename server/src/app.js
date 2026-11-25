const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const airQualityRoutes = require('./routes/airQualityRoutes');
const aiRoutes = require('./routes/aiRoutes');
const routineRoutes = require('./routes/routineRoutes');
const impactRoutes = require('./routes/impactRoutes');
const familyRoutes = require('./routes/familyRoutes');
const communityRoutes = require('./routes/communityRoutes');

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');

app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header (health checks, CLI clients) are not browser CORS requests.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600,
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use('/api', rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skip: (req) => req.path === '/health' || req.path === '/api/health',
    message: { success: false, message: 'Too many requests. Please try again later.' },
  }));
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'AirAware AI Backend',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/air-quality', airQualityRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/community', communityRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
