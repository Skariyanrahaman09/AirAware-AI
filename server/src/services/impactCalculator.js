/**
 * Impact Calculator Service
 * Computes estimated emissions, fuel, and energy savings.
 * 
 * IMPORTANT:
 * All calculations are estimates based on standard empirical emission factors (e.g., IPCC, EPA, EEA).
 * Avoided CO2 reduces atmospheric greenhouse gas accumulation (global climate impact).
 * Avoided vehicle trips also reduce tailpipe particulate matter (PM2.5/PM10, NOx) locally,
 * but direct personal exposure reduction depends on ambient dispersion, HEPA filtration, and masks.
 */

// Average Emission Factors
const EMISSION_FACTORS = {
  // kg CO2 per km for average single-occupancy passenger car (petrol/diesel mix)
  CAR_KG_CO2_PER_KM: 0.171,
  // kg CO2 per passenger-km for urban bus / metro rail
  PUBLIC_TRANSIT_KG_CO2_PER_KM: 0.043,
  // kg CO2 per km for motorcycle / scooter
  MOTORCYCLE_KG_CO2_PER_KM: 0.082,
  // Fuel consumption: average 0.08 liters per km for passenger car (~12.5 km/l)
  CAR_FUEL_LITERS_PER_KM: 0.08,
  // Average fuel cost per liter (USD baseline)
  AVG_FUEL_PRICE_USD_PER_LITER: 1.35,
  // kg CO2 per kWh grid electricity (global average ~0.45 kg CO2/kWh)
  GRID_KG_CO2_PER_KWH: 0.475,
  // grams of exhaust PM2.5 avoided per km of car trip avoided
  CAR_GRAMS_PM25_PER_KM: 0.035,
};

/**
 * Calculate multi-dimensional environmental and financial savings
 * @param {Object} inputs
 * @param {number} inputs.commuteDistanceKm - Daily round trip distance in km
 * @param {number} inputs.daysPerWeek - Number of days active per week
 * @param {string} inputs.currentMode - 'personal_car' | 'motorcycle_scooter' | 'public_transit' | 'bicycle_walk'
 * @param {string} inputs.alternativeMode - 'public_transit' | 'carpool' | 'bicycle_walk' | 'remote_work'
 * @param {number} inputs.carpoolOccupancy - Number of people sharing ride if carpool
 * @param {boolean} inputs.avoidIdling - Whether user shuts engine at signals >30s
 * @param {boolean} inputs.combineTrips - Chaining errands into 1 trip
 * @param {boolean} inputs.energyEfficientAppliances - Using 5-star / inverter appliances
 * @param {number} inputs.reducedKwhMonthly - Estimated monthly kWh conserved
 */
function calculateImpact(inputs = {}) {
  const {
    commuteDistanceKm = 15,
    daysPerWeek = 5,
    currentMode = 'personal_car',
    alternativeMode = 'public_transit',
    carpoolOccupancy = 2,
    avoidIdling = true,
    combineTrips = true,
    reducedKwhMonthly = 35,
  } = inputs;

  const annualDays = Math.min(365, Math.max(1, daysPerWeek * 52));
  const annualCommuteKm = commuteDistanceKm * annualDays;

  // Baseline Annual Emissions (kg CO2)
  let baselineFactor = EMISSION_FACTORS.CAR_KG_CO2_PER_KM;
  if (currentMode === 'motorcycle_scooter') {
    baselineFactor = EMISSION_FACTORS.MOTORCYCLE_KG_CO2_PER_KM;
  } else if (currentMode === 'public_transit') {
    baselineFactor = EMISSION_FACTORS.PUBLIC_TRANSIT_KG_CO2_PER_KM;
  } else if (currentMode === 'bicycle_walk') {
    baselineFactor = 0;
  }
  const baselineAnnualCO2 = annualCommuteKm * baselineFactor;

  // Alternative Mode Annual Emissions (kg CO2)
  let alternativeFactor = EMISSION_FACTORS.PUBLIC_TRANSIT_KG_CO2_PER_KM;
  if (alternativeMode === 'bicycle_walk' || alternativeMode === 'remote_work') {
    alternativeFactor = 0;
  } else if (alternativeMode === 'carpool') {
    alternativeFactor = EMISSION_FACTORS.CAR_KG_CO2_PER_KM / Math.max(2, carpoolOccupancy);
  } else if (alternativeMode === 'public_transit') {
    alternativeFactor = EMISSION_FACTORS.PUBLIC_TRANSIT_KG_CO2_PER_KM;
  }
  const alternativeAnnualCO2 = annualCommuteKm * alternativeFactor;

  // Transport CO2 avoided
  const transportCO2AvoidedKg = Math.max(0, baselineAnnualCO2 - alternativeAnnualCO2);

  // Behavioral savings: Trip combining reduces ~15% extra unnecessary errand km
  const errandKmSavedAnnual = combineTrips ? annualCommuteKm * 0.15 : 0;
  const errandCO2AvoidedKg = errandKmSavedAnnual * EMISSION_FACTORS.CAR_KG_CO2_PER_KM;

  // Anti-idling savings: idling consumes ~0.6L/hour; 5 minutes saved per trip day = ~15-25L/year = ~45kg CO2
  const antiIdlingCO2AvoidedKg = avoidIdling && currentMode === 'personal_car' ? 38.5 : 0;

  // Total Annual Transport CO2 avoided
  const totalTransportCO2AvoidedKg = transportCO2AvoidedKg + errandCO2AvoidedKg + antiIdlingCO2AvoidedKg;

  // Fuel Savings
  let fuelSavedLiters = 0;
  if (currentMode === 'personal_car') {
    const kmShifted = alternativeMode === 'bicycle_walk' || alternativeMode === 'remote_work' || alternativeMode === 'public_transit'
      ? annualCommuteKm + errandKmSavedAnnual
      : alternativeMode === 'carpool'
      ? (annualCommuteKm * (1 - 1 / Math.max(2, carpoolOccupancy))) + errandKmSavedAnnual
      : 0;
    fuelSavedLiters = kmShifted * EMISSION_FACTORS.CAR_FUEL_LITERS_PER_KM;
    if (avoidIdling) fuelSavedLiters += 16.5; // ~16.5L saved from avoiding idling
  } else if (currentMode === 'motorcycle_scooter') {
    const kmShifted = annualCommuteKm * 0.8;
    fuelSavedLiters = kmShifted * 0.035; // ~28 km/L
  }
  fuelSavedLiters = Math.round(fuelSavedLiters);
  const estimatedFuelCostSavedUSD = Math.round(fuelSavedLiters * EMISSION_FACTORS.AVG_FUEL_PRICE_USD_PER_LITER);

  // Household Electricity Savings
  const annualKwhSaved = Math.max(0, reducedKwhMonthly * 12);
  const electricityCO2AvoidedKg = Math.round(annualKwhSaved * EMISSION_FACTORS.GRID_KG_CO2_PER_KWH);

  // Total Annual CO2 Avoided (Transport + Household)
  const totalAnnualCO2AvoidedKg = Math.round(totalTransportCO2AvoidedKg + electricityCO2AvoidedKg);

  // Trees equivalent (1 mature urban tree absorbs ~21.7 kg CO2 per year)
  const equivalentTreesPlanted = Number((totalAnnualCO2AvoidedKg / 21.7).toFixed(1));

  // Local particulate matter avoided in breathing zone (Grams of direct PM2.5 tailpipe exhaust avoided)
  const localPM25AvoidedGrams = Math.round(
    ((transportCO2AvoidedKg > 0 ? annualCommuteKm : 0) + errandKmSavedAnnual) * EMISSION_FACTORS.CAR_GRAMS_PM25_PER_KM
  );

  // Monthly breakdown for charting
  const monthlyData = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ].map((month, idx) => {
    // Winter smog months (Nov, Dec, Jan, Feb) have higher localized smog sensitivity
    const isWinterSmogSeason = [0, 1, 10, 11].includes(idx);
    const co2Val = Math.round(totalAnnualCO2AvoidedKg / 12);
    const fuelVal = Math.round(fuelSavedLiters / 12);
    const pm25Grams = Math.round(localPM25AvoidedGrams / 12);

    return {
      month,
      co2AvoidedKg: co2Val,
      fuelSavedLiters: fuelVal,
      pm25AvoidedGrams: pm25Grams,
      winterSmogMultiplier: isWinterSmogSeason ? 1.4 : 1.0,
    };
  });

  return {
    summary: {
      totalAnnualCO2AvoidedKg,
      fuelSavedLiters,
      estimatedFuelCostSavedUSD,
      annualKwhSaved,
      electricityCO2AvoidedKg,
      equivalentTreesPlanted,
      localPM25AvoidedGrams,
      unnecessaryVehicleTripsReduced: combineTrips ? Math.round(annualDays * 0.4) : 0,
    },
    monthlyBreakdown: monthlyData,
    assumptions: [
      'Average single-occupancy passenger car generates ~171g CO2/km and consumes ~0.08 L/km of fuel.',
      'Mass transit (bus/metro) produces ~43g CO2 per passenger-km.',
      '1 mature tree absorbs approximately 21.7 kg CO2 annually.',
      'Electric grid emission factor estimated at 0.475 kg CO2/kWh.',
      'Anti-idling savings based on shutting engine for waiting intervals >30 seconds.',
    ],
    scientificDisclaimer: {
      label: 'Scientific Distinction: Global CO2 vs. Local Air Quality (PM2.5)',
      explanation:
        'Reductions in CO2 emissions address long-term global climate disruption. While adopting public transit or reducing vehicle trips also reduces immediate local tailpipe emissions (PM2.5 and NOx), immediate personal health during severe smog episodes depends primarily on avoiding outdoor exertion, proper room sealing, and wearing certified particulate respirators (N95/FFP2). Do not rely on CO2 reduction activities alone for acute smog protection.',
    },
  };
}

module.exports = {
  calculateImpact,
  EMISSION_FACTORS,
};
