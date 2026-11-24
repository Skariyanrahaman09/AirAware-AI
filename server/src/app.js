const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const airQualityRoutes = require('./routes/airQualityRoutes');
const aiRoutes = require('./routes/aiRoutes');
const routineRoutes = require('./routes/routineRoutes');
const impactRoutes = require('./routes/impactRoutes');
const familyRoutes = require('./routes/familyRoutes');
const communityRoutes = require('./routes/communityRoutes');

const app = express();

// Security & Parsing Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting (generous in development and skips localhost/health)
if (process.env.NODE_ENV !== 'test') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5000, // generous allowance for smooth frontend navigation & proxying
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path === '/health' || req.path === '/api/health',
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again after 15 minutes.',
    },
  });
  app.use('/api', limiter);
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'AirAware AI Backend',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

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
