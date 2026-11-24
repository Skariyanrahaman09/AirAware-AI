const FamilyProfile = require('../models/FamilyProfile');

/**
 * GET /api/family/profile
 * Retrieve authenticated user's family profile
 */
const getProfile = async (req, res, next) => {
  try {
    let profile = await FamilyProfile.findOne({ userId: req.user._id });

    if (!profile) {
      // Auto-create default profile if not found
      profile = await FamilyProfile.create({
        userId: req.user._id,
        householdName: `${req.user.name.split(' ')[0]}'s Household`,
        city: req.user.city || 'Delhi',
      });
    }

    res.json({
      success: true,
      profile,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/family/profile
 * Update family profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const {
      householdName,
      memberCount,
      hasChildren,
      hasElderly,
      hasAsthmaOrRespiratory,
      vulnerableNotes,
      commuteType,
      dailyCommuteDistanceKm,
      homeVentilation,
      budgetLevel,
      indoorConcerns,
      city,
    } = req.body;

    const updated = await FamilyProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: {
          householdName: householdName !== undefined ? householdName : undefined,
          memberCount: memberCount !== undefined ? Number(memberCount) : undefined,
          hasChildren: hasChildren !== undefined ? Boolean(hasChildren) : undefined,
          hasElderly: hasElderly !== undefined ? Boolean(hasElderly) : undefined,
          hasAsthmaOrRespiratory: hasAsthmaOrRespiratory !== undefined ? Boolean(hasAsthmaOrRespiratory) : undefined,
          vulnerableNotes: vulnerableNotes !== undefined ? vulnerableNotes : undefined,
          commuteType: commuteType !== undefined ? commuteType : undefined,
          dailyCommuteDistanceKm: dailyCommuteDistanceKm !== undefined ? Number(dailyCommuteDistanceKm) : undefined,
          homeVentilation: homeVentilation !== undefined ? homeVentilation : undefined,
          budgetLevel: budgetLevel !== undefined ? budgetLevel : undefined,
          indoorConcerns: indoorConcerns !== undefined ? indoorConcerns : undefined,
          city: city !== undefined ? city : undefined,
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Family profile updated successfully',
      profile: updated,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
