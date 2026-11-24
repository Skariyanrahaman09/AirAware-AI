const express = require('express');
const router = express.Router();
const familyController = require('../controllers/familyController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/profile', requireAuth, familyController.getProfile);
router.put('/profile', requireAuth, familyController.updateProfile);

module.exports = router;
