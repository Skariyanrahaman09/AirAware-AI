const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/posts', communityController.getPosts);
router.post('/posts', optionalAuth, communityController.createPost);
router.post('/posts/:id/upvote', optionalAuth, communityController.upvotePost);

module.exports = router;
