const {
  calculateCpcbAqi,
  getCpcbSeverityInfo,
  calculateAqiFromPm25,
  getSeverityInfo,
  getCurrentAirQuality,
  getForecast,
  resolveStandard,
} = require('../src/services/airQualityService');

describe('CPCB NAQI and Environmental Accuracy Suite', () => {
  describe('Standard Normalization & Resolution (resolveStandard)', () => {
    test('explicit epa values resolve to US_EPA regardless of case or country', () => {
      expect(resolveStandard('epa', 'India', 'Delhi')).toBe('US_EPA');
      expect(resolveStandard('EPA', 'India', 'Delhi')).toBe('US_EPA');
      expect(resolveStandard('us_epa', 'India', 'Delhi')).toBe('US_EPA');
      expect(resolveStandard('US-EPA', 'UK', 'London')).toBe('US_EPA');
    });

    test('explicit cpcb values resolve to IN_CPCB regardless of case or country', () => {
      expect(resolveStandard('cpcb', 'USA', 'New York')).toBe('IN_CPCB');
      expect(resolveStandard('CPCB', 'USA', 'New York')).toBe('IN_CPCB');
      expect(resolveStandard('in_cpcb', 'USA', 'New York')).toBe('IN_CPCB');
      expect(resolveStandard('IN-CPCB', 'Japan', 'Tokyo')).toBe('IN_CPCB');
    });

    test('defaults to IN_CPCB for Indian locations when standard is auto', () => {
      expect(resolveStandard('auto', 'India', 'Delhi')).toBe('IN_CPCB');
      expect(resolveStandard('auto', '', 'Kolkata')).toBe('IN_CPCB');
      expect(resolveStandard('auto', 'India', '')).toBe('IN_CPCB');
    });

    test('defaults to US_EPA for non-Indian locations when standard is auto', () => {
      expect(resolveStandard('auto', 'United Kingdom', 'London')).toBe('US_EPA');
      expect(resolveStandard('auto', 'USA', 'New York')).toBe('US_EPA');
    });

    test('safely handles invalid, null, undefined or unexpected standard values', () => {
      expect(resolveStandard('invalid_standard', 'India', 'Delhi')).toBe('IN_CPCB');
      expect(resolveStandard('invalid_standard', 'UK', 'London')).toBe('US_EPA');
      expect(resolveStandard(null, 'India', 'Mumbai')).toBe('IN_CPCB');
      expect(resolveStandard(undefined, 'USA', 'Los Angeles')).toBe('US_EPA');
      expect(resolveStandard(12345, 'India', 'Bengaluru')).toBe('IN_CPCB');
    });
  });

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
      expect(result.aqi).toBe(result.standards.cpcb.aqi);
      expect(result.category).toBe(result.standards.cpcb.category);
      expect(result.standard).toContain('CPCB');
    });

    test('honors explicit standard parameter override for epa', async () => {
      const result = await getCurrentAirQuality({ city: 'Delhi', standard: 'epa' });
      expect(result.activeStandard).toBe('US_EPA');
      expect(result.aqi).toBe(result.standards.epa.aqi);
      expect(result.category).toBe(result.standards.epa.category);
      expect(result.standard).toContain('US EPA');
    });

    test('safely falls back to regional default when invalid standard is provided', async () => {
      const indiaResult = await getCurrentAirQuality({ city: 'Delhi', standard: 'invalid_standard_123' });
      expect(indiaResult.activeStandard).toBe('IN_CPCB');

      const usResult = await getCurrentAirQuality({ city: 'New York', standard: 'invalid_standard_123' });
      expect(usResult.activeStandard).toBe('US_EPA');
    });

    test('correctly applies requested standard dynamically even when reading from cache', async () => {
      // Prime cache with explicit cpcb
      const cpcbResult = await getCurrentAirQuality({ city: 'Delhi', standard: 'cpcb' });
      expect(cpcbResult.activeStandard).toBe('IN_CPCB');

      // Subsequent call for same location with epa override must return US_EPA from cache
      const epaResult = await getCurrentAirQuality({ city: 'Delhi', standard: 'epa' });
      expect(epaResult.activeStandard).toBe('US_EPA');
      expect(epaResult.aqi).toBe(epaResult.standards.epa.aqi);
      expect(epaResult.category).toBe(epaResult.standards.epa.category);
      expect(epaResult.standard).toContain('US EPA');
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
