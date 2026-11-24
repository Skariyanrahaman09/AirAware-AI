const recommendationService = require('../services/recommendationService');
const airQualityService = require('../services/airQualityService');
const FamilyProfile = require('../models/FamilyProfile');

/**
 * POST /api/routines/generate
 * Generates personalized low-emission daily routine
 */
const generateRoutine = async (req, res, next) => {
  try {
    const {
      city,
      lat,
      lon,
      lifestyle = 'office_worker',
      commuteMode = 'personal_car',
      outdoorActivityLevel = 'moderate',
      hasChildren,
      hasElderly,
    } = req.body;

    // Fetch air conditions
    const airData = await airQualityService.getCurrentAirQuality({
      city: city || 'Delhi',
      lat: lat ? parseFloat(lat) : undefined,
      lon: lon ? parseFloat(lon) : undefined,
    });

    // Check user profile for extra preferences
    let profileChildren = hasChildren;
    let profileElderly = hasElderly;
    if (req.user && (profileChildren === undefined || profileElderly === undefined)) {
      const profile = await FamilyProfile.findOne({ userId: req.user._id });
      if (profile) {
        if (profileChildren === undefined) profileChildren = profile.hasChildren;
        if (profileElderly === undefined) profileElderly = profile.hasElderly;
      }
    }

    const routine = recommendationService.generateDailyRoutine({
      lifestyle,
      aqi: airData.aqi,
      weather: airData.weather,
      commuteMode,
      outdoorActivityLevel,
      hasChildren: Boolean(profileChildren),
      hasElderly: Boolean(profileElderly),
    });

    res.json({
      success: true,
      city: airData.city,
      aqi: airData.aqi,
      severity: airData.severity,
      routine,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/routines/indoor-guide
 * Comprehensive indoor air quality guide (particles vs gases, budget options)
 */
const getIndoorGuide = async (req, res, next) => {
  try {
    const guide = recommendationService.getIndoorAirQualityGuide();
    res.json({
      success: true,
      guide,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/routines/sustainable-lifestyle
 * Practical sustainable lifestyle alternatives
 */
const getSustainableLifestyle = async (req, res, next) => {
  try {
    const tips = recommendationService.getSustainableLifestyleTips();
    res.json({
      success: true,
      tips,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  generateRoutine,
  getIndoorGuide,
  getSustainableLifestyle,
};
