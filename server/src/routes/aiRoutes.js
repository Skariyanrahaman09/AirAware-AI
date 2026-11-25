const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { optionalAuth } = require('../middleware/authMiddleware');

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'AI request limit reached. Please try again later.' },
});

router.post('/chat', aiLimiter, optionalAuth, aiController.chat);
router.post('/recommendations', aiLimiter, optionalAuth, aiController.getRecommendations);

module.exports = router;
