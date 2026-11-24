/**
 * Recommendation Service
 * Generates context-aware, personalized low-emission daily routines,
 * indoor air quality improvement strategies, and sustainable lifestyle plans.
 */

/**
 * Generate a personalized daily routine adapted to lifestyle, AQI, and commute
 */
function generateDailyRoutine({
  lifestyle = 'office_worker', // 'student' | 'office_worker' | 'remote_worker' | 'family'
  aqi = 180,
  weather = { temperature: 18, condition: 'Smoggy' },
  commuteMode = 'personal_car',
  outdoorActivityLevel = 'moderate', // 'low' | 'moderate' | 'high'
  hasChildren = false,
  hasElderly = false,
}) {
  const isSevereSmog = aqi > 200;
  const isModerateSmog = aqi > 100 && aqi <= 200;
  const isGoodAir = aqi <= 100;

  // 1. Morning Block (06:00 - 09:00) - Inversion Peak
  let morningPlan = {};
  if (isSevereSmog) {
    morningPlan = {
      timeSlot: '06:00 - 09:00 (Early Morning)',
      activity: 'Indoor Awakening & Thermal Inversion Protection',
      what: 'Keep all windows tightly latched. Avoid outdoor morning walks, jogging, or cycling.',
      why: 'Severe winter thermal inversion traps hazardous toxic particulate matter (PM2.5) near ground level before the sun warms the atmospheric boundary layer.',
      how: 'Perform 15-20 minutes of indoor stretching or yoga. Run your HEPA purifier in the bedroom and living area.',
      commuteAction:
        commuteMode === 'personal_car'
          ? 'Switch car AC to Recirculation Mode (internal air circulation) before departing. Turn off ignition at signals >30 seconds.'
          : 'Wear a well-fitted N95/FFP2 respirator mask continuously when waiting for and riding public transit.',
      estimatedEmissionSaved: 'Avoided cold-start engine idling and saved ~0.4 kg CO2e.',
    };
  } else if (isModerateSmog) {
    morningPlan = {
      timeSlot: '06:00 - 09:00 (Early Morning)',
      activity: 'Cautious Morning Routine',
      what: 'Limit strenuous outdoor workouts; opt for light brisk walking after sunrise.',
      why: 'Particulate levels are moderately elevated, especially along heavy transit corridors.',
      how: 'Check real-time local sensor before heading out. Sensitive individuals should wear a mask near main roads.',
      commuteAction: 'Take the metro or carpool to reduce traffic congestion and personal smog exposure.',
      estimatedEmissionSaved: 'Carpooling / transit avoids ~1.2 kg CO2e per trip.',
    };
  } else {
    morningPlan = {
      timeSlot: '06:00 - 09:00 (Early Morning)',
      activity: 'Active Fresh Air Start',
      what: 'Open east-facing windows for natural ventilation and enjoy outdoor physical exercise.',
      why: 'Air quality is clear and ambient dispersion is favorable.',
      how: 'Bicycle or walk to school/work if distance is under 4 km.',
      commuteAction: 'Walking or cycling produces zero tailpipe emissions and boosts cardiovascular health.',
      estimatedEmissionSaved: 'Zero tailpipe emissions: ~2.1 kg CO2 avoided vs driving.',
    };
  }

  // 2. Midday Block (10:00 - 14:00) - Atmospheric Mixing Window
  let middayPlan = {};
  if (isSevereSmog) {
    middayPlan = {
      timeSlot: '10:00 - 14:00 (Midday)',
      activity: 'Controlled Workplace / Study Focus',
      what: 'Conduct all meetings and study sessions indoors. Chain any necessary errands into a single midday outing.',
      why: 'Sunlight slightly disperses ground inversion, but ambient PM2.5 remains hazardous.',
      how: 'If running errands, combine pharmacy, grocery, and banking into one direct route to minimize cold vehicle starts.',
      commuteAction: 'Walk between adjacent stores instead of moving your car. Keep your respirator on outdoors.',
      estimatedEmissionSaved: 'Trip combining reduces vehicle trips by 40% and saves ~1.5 liters of fuel weekly.',
    };
  } else {
    middayPlan = {
      timeSlot: '10:00 - 14:00 (Midday)',
      activity: 'Productive Work & Balanced Airing',
      what: 'Best window for brief 15-minute cross-ventilation if outdoor AQI is under 120.',
      why: 'Solar heating promotes vertical dispersion, making midday air relatively cleaner than night.',
      how: 'Open opposite windows for 15 minutes to flush indoor CO2 and cooking odors, then reseal.',
      commuteAction: 'Walk for lunch to a local eatery rather than using delivery or ride-hailing vehicles.',
      estimatedEmissionSaved: 'Walking locally saves ~0.5 kg CO2 per lunch outing.',
    };
  }

  // 3. Evening Block (16:00 - 19:30) - Evening Traffic Peak & Inversion Return
  let eveningPlan = {};
  if (isSevereSmog) {
    eveningPlan = {
      timeSlot: '16:00 - 19:30 (Evening Commute)',
      activity: 'Low-Exposure Commute & Arrival Sanitization',
      what: 'Depart early or late to avoid peak gridlock smog. Do not exercise outdoors in the evening.',
      why: 'Rush hour exhaust combined with sinking winter evening temperatures traps unburned hydrocarbons and PM2.5 at face level.',
      how: 'Use underground rail or covered transit. On returning home, change outer clothes and gently wash face/eyes with clean water.',
      commuteAction: 'Avoid open-air two-wheelers in standstill traffic; choose bus or carpool with cabin filtration.',
      estimatedEmissionSaved: 'Avoiding stop-and-go idling saves ~0.6L fuel per commute.',
    };
  } else {
    eveningPlan = {
      timeSlot: '16:00 - 19:30 (Evening)',
      activity: 'Outdoor Leisure & Sustainable Commute',
      what: 'Safe for evening walks, outdoor sports, and cycling.',
      why: 'AQI within acceptable range; no immediate respiratory hazard for general public.',
      how: 'Cycle or use public transit home from campus or office.',
      commuteAction: 'Active transit reinforces low-carbon lifestyle habits.',
      estimatedEmissionSaved: 'Saved ~1.8 kg CO2 vs private vehicle.',
    };
  }

  // 4. Night Block (20:00 - 06:00) - Indoor Air Quality Maintenance
  let nightPlan = {
    timeSlot: '20:00 - 06:00 (Night & Sleep)',
    activity: 'Restorative Clean-Air Sleep',
    what: 'Damp-wipe bedroom nightstands and headboards. Run air purifier on quiet/sleep mode near the bed.',
    why: 'Humans spend 7-9 continuous hours in the bedroom. Sub-micron particles irritate airway linings overnight, triggering morning coughing.',
    how: 'Use a damp microfiber cloth (never dry dusters which re-suspend PM2.5). Keep bedroom door slightly ajar if multiple occupants to prevent excessive CO2 buildup if no ventilation.',
    commuteAction: 'Charge electronics on timers during off-peak power hours.',
    estimatedEmissionSaved: 'Off-peak charging lowers grid peak load and household electricity footprint.',
  };

  // Lifestyle-specific highlight
  let lifestyleSpecificNote = '';
  if (lifestyle === 'student') {
    lifestyleSpecificNote = 'Student focus: Wear an N95 mask while commuting on public buses. Avoid sports ground training when school AQI alerts exceed 200; study in closed library areas with filtered air.';
  } else if (lifestyle === 'office_worker') {
    lifestyleSpecificNote = 'Office worker focus: Request hybrid telecommuting on severe smog days. If driving, set cabin ventilation to Recirculate and carpool with colleagues.';
  } else if (lifestyle === 'remote_worker') {
    lifestyleSpecificNote = 'Remote worker focus: Zero commute emissions! Maintain dedicated clean-air home office zone with weatherstripped door gaps and monitor indoor humidity between 40-50%.';
  } else {
    lifestyleSpecificNote = 'Family focus: Shield children and grandparents. Ensure schools minimize outdoor playtime on red-alert days. Keep emergency inhalers and saline nasal sprays readily accessible.';
  }

  return {
    lifestyle,
    aqiLevel: aqi,
    smogSeverity: isSevereSmog ? 'Severe' : isModerateSmog ? 'Moderate' : 'Good',
    lifestyleSpecificNote,
    timeline: [morningPlan, middayPlan, eveningPlan, nightPlan],
    lowEmissionAlternatives: [
      'Shift 2 days of office commute to remote telecommuting (saves ~18 kg CO2/week).',
      'Chain multiple weekend shopping errands into one single trip.',
      'Adopt metro rail or shared shuttle during winter peak smog months.',
      'Turn off vehicle ignition whenever waiting at railway crossings or signals >30 seconds.',
    ],
    vulnerableGroupCaution: (hasChildren || hasElderly)
      ? 'Alert: Vulnerable family members (children/seniors) have smaller airways and higher breath rates per kg of body weight. Restrict outdoor exposure entirely while AQI is over 150.'
      : null,
  };
}

/**
 * Indoor Air Quality Improvement Strategies
 * Clearly distinguishes between Particulate Matter (PM2.5/PM10) and Gaseous Pollutants (VOCs/CO/NO2)
 */
function getIndoorAirQualityGuide() {
  return {
    particulateVsGaseousGuide: {
      particulates: {
        title: 'Particulate Matter (PM2.5, PM10, Dust, Soot)',
        nature: 'Microscopic solid particles and liquid droplets that penetrate deep into alveolar lung tissues.',
        effectiveSolutions: [
          'True HEPA H13 filters (captures 99.97% of particles down to 0.3 microns).',
          'DIY Corsi-Rosenthal Box or Box Fan + MERV-13 filter (low-cost alternative).',
          'Wet cleaning: Damp microfiber mopping and wiping (dry broom sweeps re-suspend particles).',
          'Weatherstripping windows and exterior doors with foam tape to prevent outdoor smog ingress.',
        ],
        ineffectiveSolutions: [
          'Ionizers without HEPA (often generate harmful ozone gas as a byproduct).',
          'Basic mesh dust screens (let microscopic PM2.5 pass through unimpeded).',
          'Scented sprays or aerosol sanitizers (add toxic VOCs).',
        ],
      },
      gaseousPollutants: {
        title: 'Gaseous Pollutants (NO2, CO, Ozone, Formaldehyde & VOCs)',
        nature: 'Volatile chemicals and combustion gases from cooking flames, unvented heating, and synthetic materials.',
        effectiveSolutions: [
          'Active charcoal / granular activated carbon filters (adsorbs chemical gases).',
          'Source Elimination: Never burn incense, mosquito coils, or paraffin candles indoors.',
          'Kitchen Exhaust Hood: Run powerful external-venting range hood during all frying/cooking.',
          'Timed Ventilation: Open windows only when outdoor AQI drops to clean levels (usually 13:00-15:00 on windy days).',
        ],
        ineffectiveSolutions: [
          'Standard HEPA filters alone (HEPA traps particles, not chemical gas molecules).',
          'Air fresheners or odor-masking sprays (heavily increase phthalates and toxic VOCs).',
        ],
      },
    },
    budgetFriendlyAlternatives: [
      {
        title: 'The DIY Box Fan + MERV 13 Filter (Corsi-Rosenthal Concept)',
        costEstimate: '$25 - $35 (vs $250+ for branded purifiers)',
        description: 'Attach a 20x20 inch MERV 13 HVAC furnace filter to the intake side of a standard 20-inch box fan using duct tape.',
        effectiveness: 'Removes 80-90% of airborne PM2.5 in a 200 sq ft room within 45 minutes.',
        maintenance: 'Replace filter every 2-3 months during winter smog season.',
      },
      {
        title: 'Damp Mopping with Plain Water',
        costEstimate: '$0 (zero cost)',
        description: 'Replace dry broom sweeping with damp cloth wiping. Dry brooms kick settled toxic particles back into the breathing zone.',
        effectiveness: 'Prevents up to 60% of indoor particulate re-suspension.',
        maintenance: 'Do daily, especially in living and sleeping quarters.',
      },
      {
        title: 'DIY Draft Stoppers (Rolled Towels / Foam Seals)',
        costEstimate: '$2 - $5',
        description: 'Place rolled damp towels or self-adhesive foam strips under door thresholds and window seams.',
        effectiveness: 'Cuts toxic outdoor smog seepage into bedrooms by 35-50%.',
        maintenance: 'Check alignment weekly.',
      },
      {
        title: 'Natural Simmer Pots instead of Chemical Fresheners',
        costEstimate: '$1',
        description: 'Simmer orange peels, cinnamon sticks, and cloves in water on the stove for fresh scent with zero VOCs.',
        effectiveness: 'Zero chemical emission while maintaining pleasant indoor aroma.',
        maintenance: 'Never leave unattended.',
      },
    ],
    indoorDosAndDonts: [
      { type: 'do', tip: 'Run kitchen exhaust fans for 5 minutes after cooking finishes to remove lingering NO2.' },
      { type: 'do', tip: 'Keep indoor humidity between 40% and 50% to prevent mucosal drying without fostering mold.' },
      { type: 'do', tip: 'Remove outdoor shoes at the front door to prevent tracking toxic road dust inside.' },
      { type: 'dont', tip: 'NEVER burn incense sticks, dhoop, or scented candles during winter smog periods.' },
      { type: 'dont', tip: 'Do not use dry feather dusters or dry sweeping brooms inside closed rooms.' },
      { type: 'dont', tip: 'Do not smoke or allow vaping anywhere inside the living quarters.' },
    ],
  };
}

/**
 * Sustainable Lifestyle & Community Recommendations
 */
function getSustainableLifestyleTips() {
  return [
    {
      category: 'Clean Commuting',
      icon: 'bus',
      title: 'Shift to Public Transit & Metro',
      action: 'Replace single-occupant car drives with electric rail or hybrid bus for your daily route.',
      whyItMatters: 'One full bus replaces up to 40 private cars, drastically cutting localized NOx and road dust resuspension.',
      annualCO2SavingsKg: 650,
      annualCostSavingsUSD: 480,
    },
    {
      category: 'Eco Driving',
      icon: 'gauge',
      title: 'Zero Idling Policy',
      action: 'Turn off your vehicle ignition whenever stationary for more than 30 seconds (except in moving traffic).',
      whyItMatters: 'Idling produces twice as many unburned toxic emissions as a vehicle in smooth motion.',
      annualCO2SavingsKg: 95,
      annualCostSavingsUSD: 60,
    },
    {
      category: 'Home Energy',
      icon: 'zap',
      title: 'Energy Efficient Inverter Appliances',
      action: 'Upgrade to 5-star or Energy Star certified heat pumps and refrigerators.',
      whyItMatters: 'Thermal power plants generate significant coal-based PM2.5 and SO2; saving electricity cuts emissions at the source.',
      annualCO2SavingsKg: 280,
      annualCostSavingsUSD: 140,
    },
    {
      category: 'Clean Cooking',
      icon: 'utensils',
      title: 'Transition from Biomass / Coal to Induction or Clean Gas',
      action: 'Cook on electric induction stoves or certified clean burners with active ventilation.',
      whyItMatters: 'Indoor biomass cooking is a leading cause of childhood pneumonia and household smog.',
      annualCO2SavingsKg: 320,
      annualCostSavingsUSD: 90,
    },
    {
      category: 'Waste Management',
      icon: 'recycle',
      title: 'Zero Waste Burning & Strict Segregation',
      action: 'Never burn garden dry leaves, plastics, or garbage; compost organic waste.',
      whyItMatters: 'Open leaf and plastic burning releases lethal dioxins, furans, and ultrafine carbon black directly into neighborhood air.',
      annualCO2SavingsKg: 180,
      annualCostSavingsUSD: 30,
    },
  ];
}

module.exports = {
  generateDailyRoutine,
  getIndoorAirQualityGuide,
  getSustainableLifestyleTips,
};
