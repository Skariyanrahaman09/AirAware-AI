const {
  getAIChatResponse,
  generateExpertEnvironmentalResponse,
} = require('../src/services/openaiService');

describe('AI Environmental Assistant Service Tests', () => {
  test('should generate structured JSON matching the required schema', async () => {
    const response = await getAIChatResponse({
      query: 'Is it safe to go jogging outside today?',
      airData: {
        city: 'Delhi',
        aqi: 245,
        severity: 'Very Unhealthy',
        pollutants: { pm25: 195, pm10: 310 },
      },
      weatherData: {
        temperature: 15,
        humidity: 80,
        condition: 'Heavy Winter Smog',
      },
      familyProfile: {
        memberCount: 4,
        hasChildren: true,
        hasElderly: true,
      },
    });

    // Validate required fields
    expect(response).toBeDefined();
    expect(typeof response.airQualitySummary).toBe('string');
    expect(typeof response.pollutionLevel).toBe('string');
    expect(Array.isArray(response.recommendedActions)).toBe(true);
    expect(response.recommendedActions.length).toBeGreaterThan(0);
    expect(Array.isArray(response.indoorSafetyTips)).toBe(true);
    expect(response.indoorSafetyTips.length).toBeGreaterThan(0);
    expect(Array.isArray(response.lowEmissionAlternatives)).toBe(true);
    expect(response.lowEmissionAlternatives.length).toBeGreaterThan(0);
    expect(typeof response.estimatedImpact).toBe('string');
    expect(typeof response.healthPrecautions).toBe('string');
  });

  test('should adapt advice specifically for indoor air quality queries', () => {
    const response = generateExpertEnvironmentalResponse({
      query: 'How do I improve indoor air quality and choose an air purifier on a budget?',
      airData: { city: 'Delhi', aqi: 280 },
      weatherData: { temp: 16, condition: 'Smog' },
    });

    expect(response.indoorSafetyTips.some((tip) => tip.includes('HEPA') || tip.includes('Box Fan'))).toBe(true);
    expect(response.indoorSafetyTips.some((tip) => tip.includes('damp') || tip.includes('mopping'))).toBe(true);
  });

  test('should include precautions for children and elderly during severe pollution', () => {
    const response = generateExpertEnvironmentalResponse({
      query: 'What precautions should children and elderly family members take?',
      airData: { city: 'Delhi', aqi: 310 },
      weatherData: { temp: 14 },
    });

    expect(response.healthPrecautions).toContain('Children');
    expect(response.healthPrecautions).toContain('elderly');
  });
  test('does not invent AQI or weather values when readings are unavailable', () => {
    const response = generateExpertEnvironmentalResponse({
      query: 'Is it safe to go outside?',
      airData: { city: 'Kolkata' },
      weatherData: {},
    });

    expect(response.pollutionLevel).toBe('Unknown');
    expect(response.airQualitySummary).toContain('AQI reading for Kolkata is unavailable');
    expect(response.airQualitySummary).not.toContain('180');
    expect(response.airQualitySummary).toContain('Temperature reading is unavailable');
  });

  test('rejects malformed structured AI payloads', () => {
    const { isValidAiPayload } = require('../src/services/openaiService');
    expect(isValidAiPayload({ airQualitySummary: 'ok' })).toBe(false);
    expect(isValidAiPayload({
      airQualitySummary: 'Summary',
      pollutionLevel: 'Good',
      recommendedActions: [],
      indoorSafetyTips: [],
      lowEmissionAlternatives: [],
      estimatedImpact: 'Not quantified',
      healthPrecautions: 'Follow local guidance',
    })).toBe(true);
  });

});