const express = require('express');
const cors = require('cors');
const { securityHeaders, noSqlSanitizer } = require('./middleware/securityMiddleware');
const { generalLimiter } = require('./middleware/rateLimiters');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');
const { getDatabaseStatus } = require('./config/database');

// Route imports
const authRoutes = require('./routes/authRoutes');
const airQualityRoutes = require('./routes/airQualityRoutes');
const aiRoutes = require('./routes/aiRoutes');
const routineRoutes = require('./routes/routineRoutes');
const impactRoutes = require('./routes/impactRoutes');
const familyRoutes = require('./routes/familyRoutes');
const communityRoutes = require('./routes/communityRoutes');

const app = express();

// Trust reverse proxy header (essential for Render, Vercel, Heroku, Cloudflare load balancers)
app.set('trust proxy', 1);

// Security Headers (OWASP compliant)
app.use(securityHeaders);

// CORS configuration (supports comma-separated origins, rejects wildcard in production)
const rawCorsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
const isProduction = process.env.NODE_ENV === 'production';

let corsOrigin;
if (isProduction) {
  if (rawCorsOrigin === '*') {
    console.warn('[Security Warning] Wildcard CORS_ORIGIN="*" is not permitted in production. Falling back to localhost.');
    corsOrigin = false;
  } else {
    corsOrigin = rawCorsOrigin
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean);
  }
} else {
  corsOrigin =
    rawCorsOrigin === '*'
      ? '*'
      : [
          ...rawCorsOrigin
            .split(',')
            .map((o) => o.trim())
            .filter(Boolean),
          'http://localhost:3000',
          'http://127.0.0.1:3000',
        ];
}

app.use(
  cors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// NoSQL query injection sanitizer
app.use(noSqlSanitizer);

// General Rate Limiting
app.use('/api', generalLimiter);

// Health Check Endpoints (/api/health and /health for Render monitoring)
const healthHandler = (req, res) => {
  const dbStatus = getDatabaseStatus();
  const isHealthy = dbStatus === 'connected';

  // In production, return 503 if database is disconnected
  const statusCode = isHealthy || process.env.NODE_ENV !== 'production' ? 200 : 503;

  res.status(statusCode).json({
    status: isHealthy ? 'healthy' : 'degraded',
    database: dbStatus,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    service: 'AirAware AI Backend',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/air-quality', airQualityRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/community', communityRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
