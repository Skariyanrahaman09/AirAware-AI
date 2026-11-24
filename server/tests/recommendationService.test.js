const {
  generateDailyRoutine,
  getIndoorAirQualityGuide,
  getSustainableLifestyleTips,
} = require('../src/services/recommendationService');

describe('Recommendation Service Tests', () => {
  describe('Daily Routine Generation', () => {
    test('should generate 4 structured timeline slots with what, why, and how', () => {
      const routine = generateDailyRoutine({
        lifestyle: 'office_worker',
        aqi: 280,
        commuteMode: 'personal_car',
        outdoorActivityLevel: 'high',
        hasChildren: true,
      });

      expect(routine).toBeDefined();
      expect(routine.lifestyle).toBe('office_worker');
      expect(routine.smogSeverity).toBe('Severe');
      expect(routine.timeline).toHaveLength(4);

      routine.timeline.forEach((slot) => {
        expect(slot).toHaveProperty('timeSlot');
        expect(slot).toHaveProperty('what');
        expect(slot).toHaveProperty('why');
        expect(slot).toHaveProperty('how');
        expect(slot).toHaveProperty('commuteAction');
      });

      expect(routine.vulnerableGroupCaution).toContain('Vulnerable family members');
    });

    test('should adapt routine for good air quality allowing outdoor activities', () => {
      const routine = generateDailyRoutine({
        lifestyle: 'student',
        aqi: 45,
        commuteMode: 'bicycle_walk',
      });

      expect(routine.smogSeverity).toBe('Good');
      expect(routine.timeline[0].what).toContain('natural ventilation');
      expect(routine.timeline[0].what).toContain('exercise');
    });
  });

  describe('Indoor Air Quality Guide', () => {
    test('should strictly differentiate between particle pollution and gaseous pollution', () => {
      const guide = getIndoorAirQualityGuide();

      expect(guide.particulateVsGaseousGuide).toBeDefined();
      const { particulates, gaseousPollutants } = guide.particulateVsGaseousGuide;

      expect(particulates.effectiveSolutions.some((s) => s.includes('HEPA'))).toBe(true);
      expect(particulates.effectiveSolutions.some((s) => s.includes('Wet cleaning'))).toBe(true);
      expect(gaseousPollutants.effectiveSolutions.some((s) => s.includes('activated carbon'))).toBe(true);
      expect(gaseousPollutants.ineffectiveSolutions.some((s) => s.includes('Standard HEPA filters alone'))).toBe(true);
    });

    test('should include budget-friendly DIY alternatives', () => {
      const guide = getIndoorAirQualityGuide();

      expect(guide.budgetFriendlyAlternatives.length).toBeGreaterThanOrEqual(3);
      const boxFan = guide.budgetFriendlyAlternatives.find((a) => a.title.includes('Box Fan'));
      expect(boxFan).toBeDefined();
      expect(boxFan.costEstimate).toContain('$');
    });
  });

  describe('Sustainable Lifestyle Tips', () => {
    test('should return rich environmental lifestyle alternatives with CO2 and cost savings', () => {
      const tips = getSustainableLifestyleTips();

      expect(tips.length).toBeGreaterThan(0);
      tips.forEach((tip) => {
        expect(tip).toHaveProperty('title');
        expect(tip).toHaveProperty('action');
        expect(tip).toHaveProperty('whyItMatters');
        expect(tip.annualCO2SavingsKg).toBeGreaterThan(0);
      });
    });
  });
});
