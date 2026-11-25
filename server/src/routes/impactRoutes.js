const express = require('express');
const router = express.Router();
const impactController = require('../controllers/impactController');
const { validateImpactCalculation } = require('../middleware/validationMiddleware');

router.post('/calculate', validateImpactCalculation, impactController.calculateImpact);

module.exports = router;
