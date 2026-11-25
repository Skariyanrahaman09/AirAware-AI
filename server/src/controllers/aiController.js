const openaiService = require('../services/openaiService');
const airQualityService = require('../services/airQualityService');
const FamilyProfile = require('../models/FamilyProfile');
const ChatHistory = require('../models/ChatHistory');

const isValidCoordinate = (value, min, max) => value === undefined || value === null || value === ''
  || (Number.isFinite(Number(value)) && Number(value) >= min && Number(value) <= max);

const validateLocation = ({ city, lat, lon }) => {
  if (city !== undefined && (typeof city !== 'string' || city.trim().length === 0 || city.length > 120)) {
    return 'City must be a non-empty string of at most 120 characters.';
  }
  if (!isValidCoordinate(lat, -90, 90) || !isValidCoordinate(lon, -180, 180)) {
    return 'Latitude or longitude is outside its valid range.';
  }
  if ((lat === undefined) !== (lon === undefined)) {
    return 'Latitude and longitude must be supplied together.';
  }
  return null;
};

/**
 * POST /api/ai/chat
 * Natural language chat with the AI environmental assistant
 */
const chat = async (req, res, next) => {
  try {
    const {
      query, city, lat, lon, sessionId,
      chatHistory = [],
    } = req.body || {};

    if (typeof query !== 'string' || !query.trim() || query.length > 4000) {
      return res.status(400).json({
        success: false,
        message: 'A text query between 1 and 4000 characters is required.',
      });
    }
    if (!Array.isArray(chatHistory) || chatHistory.length > 20
      || chatHistory.some((message) => !message || !['user', 'assistant'].includes(message.role)
        || typeof message.content !== 'string' || message.content.length > 4000)) {
      return res.status(400).json({
        success: false,
        message: 'Chat history must contain at most 20 valid user/assistant messages.',
      });
    }
    if (sessionId !== undefined && (typeof sessionId !== 'string' || sessionId.length > 128)) {
      return res.status(400).json({ success: false, message: 'Invalid chat session identifier.' });
    }
    const locationError = validateLocation({ city, lat, lon });
    if (locationError) return res.status(400).json({ success: false, message: locationError });

    const airQualityData = await airQualityService.getCurrentAirQuality({
      city: city || 'Delhi',
      lat: lat !== undefined && lat !== '' ? Number(lat) : undefined,
      lon: lon !== undefined && lon !== '' ? Number(lon) : undefined,
    });

    let familyProfile = null;
    if (req.user) familyProfile = await FamilyProfile.findOne({ userId: req.user._id });

    const aiResponse = await openaiService.getAIChatResponse({
      query: query.trim(),
      chatHistory,
      airData: airQualityData,
      weatherData: airQualityData.weather,
      familyProfile: familyProfile ? familyProfile.toObject() : {},
    });

    // Preserve optional history logging, but never use a shared guest session.
    if (req.user && sessionId) {
      try {
        await ChatHistory.findOneAndUpdate(
          { userId: req.user._id, sessionId },
          {
            $setOnInsert: { userId: req.user._id, sessionId },
            $set: {
              contextSnapshot: {
                city: airQualityData.city,
                aqi: airQualityData.aqi,
                temp: airQualityData.weather?.temperature,
                severity: airQualityData.severity,
              },
            },
            $push: {
              messages: [
                { role: 'user', content: query.trim(), timestamp: new Date() },
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
        console.warn('[ChatHistory] Unable to save conversation history.');
      }
    }

    return res.json({
      success: true,
      query: query.trim(),
      environmentalContext: {
        city: airQualityData.city,
        aqi: airQualityData.aqi,
        severity: airQualityData.severity,
        temperature: airQualityData.weather?.temperature,
      },
      response: aiResponse,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /api/ai/recommendations
 * Structured AI recommendations based on context
 */
const getRecommendations = async (req, res, next) => {
  try {
    const { city, lat, lon, lifestyle = 'office_worker' } = req.body || {};
    const locationError = validateLocation({ city, lat, lon });
    if (locationError) return res.status(400).json({ success: false, message: locationError });
    const allowedLifestyles = ['student', 'office_worker', 'remote_worker', 'family'];
    if (typeof lifestyle !== 'string' || !allowedLifestyles.includes(lifestyle)) {
      return res.status(400).json({ success: false, message: 'Unsupported lifestyle value.' });
    }

    const airData = await airQualityService.getCurrentAirQuality({
      city: city || 'Delhi',
      lat: lat !== undefined && lat !== '' ? Number(lat) : undefined,
      lon: lon !== undefined && lon !== '' ? Number(lon) : undefined,
    });

    let familyProfile = null;
    if (req.user) familyProfile = await FamilyProfile.findOne({ userId: req.user._id });

    const recommendations = await openaiService.getPersonalizedRecommendations({
      airData,
      weatherData: airData.weather,
      familyProfile: familyProfile ? familyProfile.toObject() : {},
      lifestyle,
    });

    return res.json({
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
    return next(err);
  }
};

module.exports = { chat, getRecommendations };
