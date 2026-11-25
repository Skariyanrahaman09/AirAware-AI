const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { optionalAuth } = require('../middleware/authMiddleware');
const { aiLimiter } = require('../middleware/rateLimiters');
const { validateChat } = require('../middleware/validationMiddleware');

router.post('/chat', aiLimiter, optionalAuth, validateChat, aiController.chat);
router.post('/recommendations', aiLimiter, optionalAuth, aiController.getRecommendations);

module.exports = router;
