const axios = require('axios');
const { getCurrentAirQuality } = require('../src/services/airQualityService');
const { getAIChatResponse } = require('../src/services/openaiService');

describe('Deterministic External API Mocking & Failure Recovery Suite', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Open-Meteo External API Resilience', () => {
    test('handles Open-Meteo network 500 error with graceful fallback without unhandled exception', async () => {
      // Force axios.get to reject
      jest.spyOn(axios, 'get').mockRejectedValue(new Error('Open-Meteo upstream 500 server down'));

      const result = await getCurrentAirQuality({ city: 'Mumbai' });

      expect(result).toBeDefined();
      expect(result.city).toBe('Mumbai');
      expect(result.aqi).toBeGreaterThan(0);
      expect(result.provenance).toBe('simulated');
      expect(result.isLive).toBe(false);
      expect(result.standards).toBeDefined();
    });

    test('parses live Open-Meteo payload deterministically when upstream responds successfully', async () => {
      const mockAirResponse = {
        data: {
          current: {
            pm2_5: 42.5,
            pm10: 88.0,
            carbon_monoxide: 420.0,
            nitrogen_dioxide: 28.0,
            sulphur_dioxide: 12.0,
            ozone: 35.0,
          },
          hourly: {
            time: ['2026-11-25T00:00', '2026-11-25T01:00'],
            pm2_5: [40.0, 45.0],
            pm10: [85.0, 90.0],
          },
        },
      };

      const mockWeatherResponse = {
        data: {
          current: {
            temperature_2m: 22.0,
            relative_humidity_2m: 60.0,
            wind_speed_10m: 12.0,
            weather_code: 1,
          },
        },
      };

      jest.spyOn(axios, 'get').mockImplementation((url) => {
        if (url.includes('air-quality-api')) {
          return Promise.resolve(mockAirResponse);
        }
        return Promise.resolve(mockWeatherResponse);
      });

      const result = await getCurrentAirQuality({ city: 'Bengaluru' });

      expect(result).toBeDefined();
      expect(result.pollutants.pm25).toBe(42.5);
      expect(result.pollutants.pm10).toBe(88.0);
      expect(result.pollutants.co).toBe(420);
      expect(result.weather.temperature).toBe(22);
      expect(result.provenance).toBe('live');
      expect(result.isLive).toBe(true);
    });
  });

  describe('AI Service Failure Recovery', () => {
    test('returns valid compliant schema fallback when OpenAI is unavailable', async () => {
      // In test mode without valid OpenAI key or with network disconnect
      const res = await getAIChatResponse({
        query: 'What precautions should an asthmatic child take today?',
        airData: {
          city: 'Delhi',
          aqi: 320,
          severity: 'Severe',
          pollutants: { pm25: 250, pm10: 380 },
        },
        familyProfile: {
          hasAsthmaOrRespiratory: true,
          hasChildren: true,
        },
      });

      expect(res).toBeDefined();
      expect(typeof res.airQualitySummary).toBe('string');
      expect(Array.isArray(res.recommendedActions)).toBe(true);
      expect(Array.isArray(res.indoorSafetyTips)).toBe(true);
      expect(typeof res.healthPrecautions).toBe('string');
      // Should mention asthma or sensitive vulnerability
      expect(res.healthPrecautions.toLowerCase()).toMatch(/asthma|respiratory|vulnerable|child/);
    });
  });
});
