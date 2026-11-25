const {
  calculateCpcbAqi,
  getCpcbSeverityInfo,
  calculateAqiFromPm25,
  getSeverityInfo,
  getCurrentAirQuality,
  getForecast,
} = require('../src/services/airQualityService');

describe('CPCB NAQI and Environmental Accuracy Suite', () => {
  describe('Indian Statutory CPCB NAQI Calculation Breakpoints', () => {
    test('calculates Good category (0-50) for PM2.5 <= 30', () => {
      const aqi = calculateCpcbAqi(15, null);
      expect(aqi).toBeGreaterThanOrEqual(0);
      expect(aqi).toBeLessThanOrEqual(50);
      const severity = getCpcbSeverityInfo(aqi);
      expect(severity.category).toBe('Good');
      expect(severity.severity).toBe('Good');
      expect(severity.maskRecommended).toBe(false);
    });

    test('calculates Satisfactory category (51-100) for PM2.5 between 31 and 60', () => {
      const aqi = calculateCpcbAqi(45, null);
      expect(aqi).toBeGreaterThanOrEqual(51);
      expect(aqi).toBeLessThanOrEqual(100);
      const severity = getCpcbSeverityInfo(aqi);
      expect(severity.category).toBe('Satisfactory');
      expect(severity.maskRecommended).toBe(false);
    });

    test('calculates Moderate category (101-200) for PM2.5 between 61 and 90', () => {
      const aqi = calculateCpcbAqi(75, null);
      expect(aqi).toBeGreaterThanOrEqual(101);
      expect(aqi).toBeLessThanOrEqual(200);
      const severity = getCpcbSeverityInfo(aqi);
      expect(severity.category).toBe('Moderate');
    });

    test('calculates Poor category (201-300) for PM2.5 between 91 and 120', () => {
      const aqi = calculateCpcbAqi(105, null);
      expect(aqi).toBeGreaterThanOrEqual(201);
      expect(aqi).toBeLessThanOrEqual(300);
      const severity = getCpcbSeverityInfo(aqi);
      expect(severity.category).toBe('Poor');
      expect(severity.maskRecommended).toBe(true);
    });

    test('calculates Very Poor category (301-400) for PM2.5 between 121 and 250', () => {
      const aqi = calculateCpcbAqi(180, null);
      expect(aqi).toBeGreaterThanOrEqual(301);
      expect(aqi).toBeLessThanOrEqual(400);
      const severity = getCpcbSeverityInfo(aqi);
      expect(severity.category).toBe('Very Poor');
      expect(severity.maskRecommended).toBe(true);
      expect(severity.purifierRecommended).toBe(true);
    });

    test('calculates Severe category (401-500) for PM2.5 > 250', () => {
      const aqi = calculateCpcbAqi(320, null);
      expect(aqi).toBeGreaterThanOrEqual(401);
      const severity = getCpcbSeverityInfo(aqi);
      expect(severity.category).toBe('Severe');
      expect(severity.maskRecommended).toBe(true);
      expect(severity.healthGuidance.toLowerCase()).toContain('cardiopulmonary');
    });

    test('takes the maximum sub-index between PM2.5 and PM10', () => {
      // PM2.5 = 15 (Good -> ~25), but PM10 = 250 (Moderate: 101-250 -> ~166)
      const aqi = calculateCpcbAqi(15, 200);
      expect(aqi).toBeGreaterThan(100);
    });
  });

  describe('US EPA vs Indian CPCB Distinctions', () => {
    test('same PM2.5 yields different statutory categories between EPA and CPCB', () => {
      // PM2.5 of 45 µg/m³
      // In US EPA: 45 is in 35.5-55.4 -> Unhealthy for Sensitive Groups (AQI 101-150)
      // In India CPCB: 45 is in 31-60 -> Satisfactory (AQI 51-100)
      const epaAqi = calculateAqiFromPm25(45);
      const cpcbAqi = calculateCpcbAqi(45, null);

      expect(epaAqi).toBeGreaterThanOrEqual(101);
      expect(cpcbAqi).toBeLessThanOrEqual(100);

      const epaInfo = getSeverityInfo(epaAqi);
      const cpcbInfo = getCpcbSeverityInfo(cpcbAqi);

      expect(epaInfo.category).not.toBe(cpcbInfo.category);
    });
  });

  describe('Dual Standards Schema in getCurrentAirQuality', () => {
    test('returns both standards in standards property with activeStandard', async () => {
      const result = await getCurrentAirQuality({ city: 'Delhi', standard: 'auto' });

      expect(result).toHaveProperty('standards');
      expect(result.standards).toHaveProperty('cpcb');
      expect(result.standards).toHaveProperty('epa');
      expect(result.standards.cpcb).toHaveProperty('aqi');
      expect(result.standards.cpcb).toHaveProperty('category');
      expect(result.standards.epa).toHaveProperty('aqi');
      expect(result.standards.epa).toHaveProperty('category');
      // Indian city with standard='auto' should default to IN_CPCB
      expect(result.activeStandard).toBe('IN_CPCB');
    });

    test('honors explicit standard parameter override for cpcb', async () => {
      const result = await getCurrentAirQuality({ city: 'London', standard: 'cpcb' });
      expect(result.activeStandard).toBe('IN_CPCB');
    });

    test('honors explicit standard parameter override for epa', async () => {
      const result = await getCurrentAirQuality({ city: 'Delhi', standard: 'epa' });
      expect(result.activeStandard).toBe('US_EPA');
    });
  });

  describe('Data Provenance and Absence of Fake Sensor Data', () => {
    test('reports an explicit provenance tag in result', async () => {
      const result = await getCurrentAirQuality({ city: 'Kolkata' });
      expect(result).toHaveProperty('provenance');
      expect(['live', 'cached', 'simulated']).toContain(result.provenance);
    });

    test('does not invent hardcoded gaseous numbers when sensor has null telemetry', async () => {
      const result = await getCurrentAirQuality({ city: 'Delhi' });
      expect(result).toHaveProperty('pollutants');
      // PM2.5 and PM10 should be valid numbers
      expect(typeof result.pollutants.pm25).toBe('number');
      // CO, NO2, SO2, O3 should be either a valid number or strictly null, never undefined or fabricated strings
      ['co', 'no2', 'so2', 'o3'].forEach((p) => {
        const val = result.pollutants[p];
        expect(val === null || typeof val === 'number').toBe(true);
      });
    });
  });
});
