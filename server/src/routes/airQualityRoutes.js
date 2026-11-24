const express = require('express');
const router = express.Router();
const airQualityController = require('../controllers/airQualityController');

router.get('/current', airQualityController.getCurrentAirQuality);
router.get('/forecast', airQualityController.getForecast);
router.get('/search', airQualityController.searchCities);

module.exports = router;
