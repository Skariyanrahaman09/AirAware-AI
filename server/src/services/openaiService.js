const { openai, isOpenAIConfigured, defaultModel } = require('../config/openai');
const { SYSTEM_PROMPT, buildUserChatPrompt } = require('../utils/promptTemplates');
const { getSeverityInfo } = require('./airQualityService');

function generateExpertEnvironmentalResponse({ query = '', airData = {}, weatherData = {} }) {
  const hasAqi = Number.isFinite(Number(airData?.aqi));
  const aqi = hasAqi ? Number(airData.aqi) : null;
  const city = airData?.city || 'your area';
  const severityInfo = hasAqi ? getSeverityInfo(aqi) : null;
  const qLower = String(query).toLowerCase();
  const isSevere = hasAqi && aqi > 200;

  const aqiSummary = hasAqi
    ? `Current AQI in ${city} is ${aqi} (${severityInfo.severity}).`
    : `A current AQI reading for ${city} is unavailable, so location-specific risk cannot be assessed.`;
  const pm25 = airData.pollutants?.pm25 ?? airData.pm25;
  const temperature = weatherData.temperature ?? weatherData.temp;
  const details = [
    pm25 !== undefined && pm25 !== null ? `PM2.5 is ${pm25} µg/m³.` : 'PM2.5 reading is unavailable.',
    temperature !== undefined && temperature !== null ? `Temperature is ${temperature}°C.` : 'Temperature reading is unavailable.',
    weatherData.condition ? `Conditions: ${weatherData.condition}.` : '',
  ].filter(Boolean).join(' ');
  let recommendedActions = [];

  if (qLower.includes('safe') || qLower.includes('outside') || qLower.includes('exercise') || qLower.includes('go out')) {
    recommendedActions = isSevere
      ? ['Avoid strenuous outdoor activity while pollution is very high.', 'If going outside is essential, use a well-fitting certified N95/FFP2 respirator.', 'Follow local public-health advisories and seek medical advice for symptoms.']
      : ['Check a current local air-quality advisory before strenuous outdoor activity.', 'People sensitive to air pollution should reduce exertion if symptoms occur.', 'Prefer routes away from busy roads when practical.'];
  } else if (qLower.includes('indoor') || qLower.includes('purifier') || qLower.includes('clean air') || qLower.includes('home')) {
    recommendedActions = ['Use a correctly sized HEPA air cleaner in occupied rooms if available.', 'Avoid indoor smoke sources such as tobacco, incense, and mosquito coils.', 'Use damp cleaning rather than dry sweeping to reduce resuspended dust.'];
  } else {
    recommendedActions = isSevere
      ? ['Reduce non-essential outdoor exposure while pollution is very high.', 'Use a well-fitting certified respirator if outdoor exposure is unavoidable.', 'Monitor official local air-quality and health advisories.']
      : ['Check current local air-quality readings before planning prolonged outdoor activity.', 'Reduce indoor and outdoor combustion sources where possible.', 'Follow local public-health guidance, especially for sensitive groups.'];
  }

  const indoorSafetyTips = [
    'Use a correctly sized HEPA air cleaner in occupied rooms where feasible.',
    'Avoid smoking, incense, candles, and other indoor combustion sources.',
    'Use damp mopping or wiping to reduce settled dust.',
  ];
  const lowEmissionAlternatives = [
    'Combine errands where practical to reduce repeated vehicle trips.',
    'Consider public transport, walking, or cycling when routes and air quality make them appropriate.',
    'Avoid unnecessary vehicle idling.',
  ];
  return {
    airQualitySummary: `${aqiSummary} ${details}`,
    pollutionLevel: severityInfo?.severity || 'Unknown',
    recommendedActions,
    indoorSafetyTips,
    lowEmissionAlternatives,
    estimatedImpact: 'Environmental impact depends on local conditions and individual behavior; no quantified estimate is available for this response.',
    healthPrecautions: 'Children, older adults, pregnant people, and people with heart or lung conditions may be more sensitive to air pollution. Follow local health guidance and seek medical care for concerning symptoms.',
    generatedBy: 'AirAware Environmental Engine',
  };
}

const isValidAiPayload = (value) => value && typeof value === 'object' && !Array.isArray(value)
  && typeof value.airQualitySummary === 'string'
  && typeof value.pollutionLevel === 'string'
  && Array.isArray(value.recommendedActions)
  && Array.isArray(value.indoorSafetyTips)
  && Array.isArray(value.lowEmissionAlternatives)
  && typeof value.estimatedImpact === 'string'
  && typeof value.healthPrecautions === 'string';

async function getAIChatResponse({
  query,
  chatHistory = [],
  airData = {},
  weatherData = {},
  familyProfile = {},
}) {
  if (isOpenAIConfigured && openai) {
    try {
      const messages = [{ role: 'system', content: SYSTEM_PROMPT }];
      for (const msg of chatHistory.slice(-6)) {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      }
      messages.push({
        role: 'user',
        content: buildUserChatPrompt({ query, airData, weatherData, familyProfile }),
      });

      const response = await openai.chat.completions.create({
        model: defaultModel,
        messages,
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });
      const rawContent = response.choices[0]?.message?.content;
      if (rawContent) {
        const parsed = JSON.parse(rawContent);
        if (isValidAiPayload(parsed)) {
          parsed.generatedBy = `OpenAI (${defaultModel})`;
          return parsed;
        }
        console.warn('[OpenAIService] Model returned an invalid response shape; using safe fallback.');
      }
    } catch (err) {
      console.warn('[OpenAIService] AI request failed; using safe fallback.');
    }
  }

  return generateExpertEnvironmentalResponse({ query, airData, weatherData, familyProfile });
}

async function getPersonalizedRecommendations({
  airData = {},
  weatherData = {},
  familyProfile = {},
  lifestyle = 'office_worker',
}) {
  const query = `Generate comprehensive personalized environmental recommendations for a ${lifestyle} household based on our real-time air quality and profile.`;
  return getAIChatResponse({ query, airData, weatherData, familyProfile });
}

module.exports = {
  getAIChatResponse,
  getPersonalizedRecommendations,
  generateExpertEnvironmentalResponse,
  isValidAiPayload,
};
