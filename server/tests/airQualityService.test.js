const {
  calculateAqiFromPm25,
  getSeverityInfo,
  getCurrentAirQuality,
  getForecast,
} = require('../src/services/airQualityService');

describe('Air Quality Service Tests', () => {
  describe('EPA AQI Breakpoints Calculation', () => {
    test('should accurately calculate AQI for Good range (0-50)', () => {
      const aqi = calculateAqiFromPm25(9.0);
      expect(aqi).toBeGreaterThanOrEqual(0);
      expect(aqi).toBeLessThanOrEqual(50);
    });

    test('should accurately calculate AQI for Moderate range (51-100)', () => {
      const aqi = calculateAqiFromPm25(25.0);
      expect(aqi).toBeGreaterThanOrEqual(51);
      expect(aqi).toBeLessThanOrEqual(100);
    });

    test('should accurately calculate AQI for Unhealthy for Sensitive Groups (101-150)', () => {
      const aqi = calculateAqiFromPm25(45.0);
      expect(aqi).toBeGreaterThanOrEqual(101);
      expect(aqi).toBeLessThanOrEqual(150);
    });

    test('should accurately calculate AQI for Unhealthy range (151-200)', () => {
      const aqi = calculateAqiFromPm25(90.0);
      expect(aqi).toBeGreaterThanOrEqual(151);
      expect(aqi).toBeLessThanOrEqual(200);
    });

    test('should accurately calculate AQI for Very Unhealthy range (201-300)', () => {
      const aqi = calculateAqiFromPm25(200.0);
      expect(aqi).toBeGreaterThanOrEqual(201);
      expect(aqi).toBeLessThanOrEqual(300);
    });

    test('should accurately calculate AQI for Hazardous range (301-500)', () => {
      const aqi = calculateAqiFromPm25(380.0);
      expect(aqi).toBeGreaterThanOrEqual(301);
    });
  });

  describe('Severity Information & Color Codes', () => {
    test('should map AQI <= 50 to Green / Good', () => {
      const info = getSeverityInfo(40);
      expect(info.severity).toBe('Good');
      expect(info.colorCode).toBe('green');
      expect(info.maskRecommended).toBe(false);
    });

    test('should map AQI between 151 and 200 to Red / Unhealthy', () => {
      const info = getSeverityInfo(175);
      expect(info.severity).toBe('Unhealthy');
      expect(info.colorCode).toBe('red');
      expect(info.maskRecommended).toBe(true);
    });

    test('should map AQI > 300 to Maroon / Hazardous with emergency precautions', () => {
      const info = getSeverityInfo(360);
      expect(info.severity).toBe('Hazardous');
      expect(info.colorCode).toBe('maroon');
      expect(info.healthGuidance.toLowerCase()).toContain('emergency');
    });
  });

  describe('Air Quality Data Fetching', () => {
    test('should return formatted air quality object with pollutants and weather', async () => {
      const result = await getCurrentAirQuality({ city: 'Delhi' });

      expect(result).toBeDefined();
      expect(result.city).toBeDefined();
      expect(result.aqi).toBeGreaterThan(0);
      expect(result.severity).toBeDefined();
      expect(result.pollutants).toBeDefined();
      expect(result.pollutants.pm25).toBeDefined();
      expect(result.pollutants.pm10).toBeDefined();
      expect(result.weather).toBeDefined();
      expect(result.hourlyTrends).toBeDefined();
      expect(Array.isArray(result.hourlyTrends)).toBe(true);
    });

    test('should fetch air quality for any global city without defaulting to Delhi', async () => {
      const result = await getCurrentAirQuality({ city: 'Kolkata' });
      expect(result).toBeDefined();
      expect(result.city).toBe('Kolkata');
      expect(result.aqi).toBeGreaterThan(0);
    });

    test('should support searching cities with autocomplete', () => {
      const { searchCities } = require('../src/services/airQualityService');
      const results = searchCities('kolk');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].city).toBe('Kolkata');
    });

    test('should return 5-day forecast', async () => {
      const forecast = await getForecast({ city: 'Delhi' });

      expect(forecast).toBeDefined();
      expect(forecast.city).toBeDefined();
      expect(forecast.forecastDays).toHaveLength(5);
      expect(forecast.forecastDays[0]).toHaveProperty('day');
      expect(forecast.forecastDays[0]).toHaveProperty('aqi');
      expect(forecast.forecastDays[0]).toHaveProperty('severity');
    });
  });
});
