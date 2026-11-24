const express = require('express');
const router = express.Router();
const routineController = require('../controllers/routineController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.post('/generate', optionalAuth, routineController.generateRoutine);
router.get('/indoor-guide', routineController.getIndoorGuide);
router.get('/sustainable-lifestyle', routineController.getSustainableLifestyle);

module.exports = router;
