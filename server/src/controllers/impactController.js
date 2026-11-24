const impactCalculator = require('../services/impactCalculator');

/**
 * POST /api/impact/calculate
 * Calculate emissions avoided, fuel saved, energy conserved, and trees equivalent
 */
const calculateImpact = async (req, res, next) => {
  try {
    const {
      commuteDistanceKm,
      daysPerWeek,
      currentMode,
      alternativeMode,
      carpoolOccupancy,
      avoidIdling,
      combineTrips,
      reducedKwhMonthly,
    } = req.body;

    const result = impactCalculator.calculateImpact({
      commuteDistanceKm: commuteDistanceKm !== undefined ? Number(commuteDistanceKm) : 15,
      daysPerWeek: daysPerWeek !== undefined ? Number(daysPerWeek) : 5,
      currentMode: currentMode || 'personal_car',
      alternativeMode: alternativeMode || 'public_transit',
      carpoolOccupancy: carpoolOccupancy !== undefined ? Number(carpoolOccupancy) : 2,
      avoidIdling: avoidIdling !== undefined ? Boolean(avoidIdling) : true,
      combineTrips: combineTrips !== undefined ? Boolean(combineTrips) : true,
      reducedKwhMonthly: reducedKwhMonthly !== undefined ? Number(reducedKwhMonthly) : 35,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  calculateImpact,
};
