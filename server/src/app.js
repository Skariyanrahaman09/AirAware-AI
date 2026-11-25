const express = require('express');
const cors = require('cors');
const { securityHeaders, noSqlSanitizer } = require('./middleware/securityMiddleware');
const { generalLimiter } = require('./middleware/rateLimiters');
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

// Security Headers (OWASP compliant)
app.use(securityHeaders);

// CORS configuration (strictly scoped or defaults to local Next.js frontend)
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(
  cors({
    origin: allowedOrigin === '*' ? '*' : [allowedOrigin, 'http://127.0.0.1:3000', 'http://localhost:3000'],
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
