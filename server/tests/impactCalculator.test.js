const { calculateImpact, EMISSION_FACTORS } = require('../src/services/impactCalculator');

describe('Impact Calculator Service Tests', () => {
  test('should calculate valid emissions avoided when shifting from car to public transit', () => {
    const result = calculateImpact({
      commuteDistanceKm: 20,
      daysPerWeek: 5,
      currentMode: 'personal_car',
      alternativeMode: 'public_transit',
      avoidIdling: true,
      combineTrips: true,
      reducedKwhMonthly: 40,
    });

    expect(result).toBeDefined();
    expect(result.summary).toBeDefined();
    expect(result.summary.totalAnnualCO2AvoidedKg).toBeGreaterThan(0);
    expect(result.summary.fuelSavedLiters).toBeGreaterThan(0);
    expect(result.summary.estimatedFuelCostSavedUSD).toBeGreaterThan(0);
    expect(result.summary.equivalentTreesPlanted).toBeGreaterThan(0);
    expect(result.summary.localPM25AvoidedGrams).toBeGreaterThan(0);
    expect(result.summary.unnecessaryVehicleTripsReduced).toBeGreaterThan(0);
  });

  test('should provide 12 months of breakdown data', () => {
    const result = calculateImpact({
      commuteDistanceKm: 15,
      daysPerWeek: 5,
      currentMode: 'personal_car',
      alternativeMode: 'bicycle_walk',
    });

    expect(result.monthlyBreakdown).toHaveLength(12);
    expect(result.monthlyBreakdown[0].month).toBe('Jan');
    expect(result.monthlyBreakdown[0].co2AvoidedKg).toBeGreaterThanOrEqual(0);
  });

  test('should clearly distinguish between CO2 reduction and immediate local PM2.5 exposure', () => {
    const result = calculateImpact();

    expect(result.scientificDisclaimer).toBeDefined();
    expect(result.scientificDisclaimer.label).toContain('Global CO2 vs. Local Air Quality');
    expect(result.scientificDisclaimer.explanation).toContain('PM2.5');
    expect(result.assumptions.length).toBeGreaterThan(0);
  });

  test('should handle edge cases with 0 commute distance or remote work', () => {
    const result = calculateImpact({
      commuteDistanceKm: 0,
      daysPerWeek: 0,
      currentMode: 'bicycle_walk',
      alternativeMode: 'remote_work',
      reducedKwhMonthly: 0,
    });

    expect(result.summary.totalAnnualCO2AvoidedKg).toBe(0);
    expect(result.summary.fuelSavedLiters).toBe(0);
  });
});
