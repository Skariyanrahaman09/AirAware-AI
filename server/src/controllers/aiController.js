const openaiService = require('../services/openaiService');
const airQualityService = require('../services/airQualityService');
const FamilyProfile = require('../models/FamilyProfile');
const ChatHistory = require('../models/ChatHistory');

/**
 * POST /api/ai/chat
 * Natural language chat with the AI environmental assistant
 */
const chat = async (req, res, next) => {
  try {
    const { query, city, lat, lon, sessionId = 'guest-session', chatHistory = [] } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'A valid text query is required.',
      });
    }

    // 1. Fetch live air quality and weather context
    const airQualityData = await airQualityService.getCurrentAirQuality({
      city: city || 'Delhi',
      lat: lat ? parseFloat(lat) : undefined,
      lon: lon ? parseFloat(lon) : undefined,
    });

    // 2. Fetch user's family profile if authenticated
    let familyProfile = null;
    if (req.user) {
      familyProfile = await FamilyProfile.findOne({ userId: req.user._id });
    }

    // 3. Request AI reasoning response
    const aiResponse = await openaiService.getAIChatResponse({
      query,
      chatHistory,
      airData: airQualityData,
      weatherData: airQualityData.weather,
      familyProfile: familyProfile ? familyProfile.toObject() : {},
    });

    // 4. Optionally record to ChatHistory model asynchronously
    try {
      await ChatHistory.findOneAndUpdate(
        { sessionId },
        {
          $setOnInsert: { userId: req.user ? req.user._id : null, sessionId },
          $set: {
            contextSnapshot: {
              city: airQualityData.city,
              aqi: airQualityData.aqi,
              temp: airQualityData.weather.temperature,
              severity: airQualityData.severity,
            },
          },
          $push: {
            messages: [
              { role: 'user', content: query, timestamp: new Date() },
              {
                role: 'assistant',
                content: aiResponse.airQualitySummary || 'Environmental guidance provided.',
                structuredData: aiResponse,
                timestamp: new Date(),
              },
            ],
          },
        },
        { upsert: true, new: true }
      );
    } catch (saveErr) {
      // Don't fail the request if chat history logging encounters an issue
      console.warn('[ChatHistory Log Warning]:', saveErr.message);
    }

    res.json({
      success: true,
      query,
      environmentalContext: {
        city: airQualityData.city,
        aqi: airQualityData.aqi,
        severity: airQualityData.severity,
        temperature: airQualityData.weather.temperature,
      },
      response: aiResponse,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/ai/recommendations
 * Structured AI recommendations based on context
 */
const getRecommendations = async (req, res, next) => {
  try {
    const { city, lat, lon, lifestyle = 'office_worker' } = req.body;

    const airData = await airQualityService.getCurrentAirQuality({
      city: city || 'Delhi',
      lat: lat ? parseFloat(lat) : undefined,
      lon: lon ? parseFloat(lon) : undefined,
    });

    let familyProfile = null;
    if (req.user) {
      familyProfile = await FamilyProfile.findOne({ userId: req.user._id });
    }

    const recommendations = await openaiService.getPersonalizedRecommendations({
      airData,
      weatherData: airData.weather,
      familyProfile: familyProfile ? familyProfile.toObject() : {},
      lifestyle,
    });

    res.json({
      success: true,
      data: recommendations,
      airQuality: {
        city: airData.city,
        aqi: airData.aqi,
        severity: airData.severity,
        pollutants: airData.pollutants,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  chat,
  getRecommendations,
};
