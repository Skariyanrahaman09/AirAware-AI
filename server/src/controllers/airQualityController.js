const airQualityService = require('../services/airQualityService');

/**
 * GET /api/air-quality/current
 * Query params: city, lat, lon
 */
const getCurrentAirQuality = async (req, res, next) => {
  try {
    const { city, lat, lon } = req.query;
    const parsedLat = lat ? parseFloat(lat) : undefined;
    const parsedLon = lon ? parseFloat(lon) : undefined;

    const data = await airQualityService.getCurrentAirQuality({
      city: city || undefined,
      lat: parsedLat,
      lon: parsedLon,
    });

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/air-quality/forecast
 * Query params: city, lat, lon
 */
const getForecast = async (req, res, next) => {
  try {
    const { city, lat, lon } = req.query;
    const parsedLat = lat ? parseFloat(lat) : undefined;
    const parsedLon = lon ? parseFloat(lon) : undefined;

    const forecast = await airQualityService.getForecast({
      city: city || 'Delhi',
      lat: parsedLat,
      lon: parsedLon,
    });

    res.json({
      success: true,
      data: forecast,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/air-quality/search
 * Query param: q (search text)
 */
const searchCities = async (req, res, next) => {
  try {
    const { q } = req.query;
    const results = airQualityService.searchWorldCities(q);
    res.json({
      success: true,
      results,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCurrentAirQuality,
  getForecast,
  searchCities,
};
