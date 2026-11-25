const rateLimit = require('express-rate-limit');

/**
 * Dedicated rate limiters for different application endpoints
 */

const isTestEnv = process.env.NODE_ENV === 'test';

// General API limiter: 1000 requests per 15 minutes
const generalLimiter = isTestEnv
  ? (req, res, next) => next()
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 1000,
      standardHeaders: true,
      legacyHeaders: false,
      skip: (req) => req.path === '/health' || req.path === '/api/health',
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes.',
      },
    });

// Auth limiter: 20 requests per 15 minutes (protects against credential brute forcing)
const authLimiter = isTestEnv
  ? (req, res, next) => next()
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 20,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        message: 'Too many authentication attempts. Please try again after 15 minutes.',
      },
    });

// AI limiter: 30 requests per minute (protects LLM quota & cost)
const aiLimiter = isTestEnv
  ? (req, res, next) => next()
  : rateLimit({
      windowMs: 60 * 1000,
      max: 30,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        message: 'AI query rate limit reached. Please wait a moment before sending another request.',
      },
    });

module.exports = {
  generalLimiter,
  authLimiter,
  aiLimiter,
};
