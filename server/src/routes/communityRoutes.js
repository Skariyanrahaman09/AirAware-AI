const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const { optionalAuth } = require('../middleware/authMiddleware');
const { validateCommunityPost } = require('../middleware/validationMiddleware');

router.get('/posts', communityController.getPosts);
router.post('/posts', optionalAuth, validateCommunityPost, communityController.createPost);
router.post('/posts/:id/upvote', optionalAuth, communityController.upvotePost);

module.exports = router;
