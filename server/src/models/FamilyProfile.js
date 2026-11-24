const mongoose = require('mongoose');

const familyProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    householdName: {
      type: String,
      default: 'My Household',
      trim: true,
    },
    memberCount: {
      type: Number,
      default: 4,
      min: 1,
      max: 20,
    },
    hasChildren: {
      type: Boolean,
      default: true,
    },
    hasElderly: {
      type: Boolean,
      default: false,
    },
    hasAsthmaOrRespiratory: {
      type: Boolean,
      default: false,
    },
    vulnerableNotes: {
      type: String,
      default: '',
      trim: true,
    },
    commuteType: {
      type: String,
      enum: ['public_transit', 'personal_car', 'motorcycle_scooter', 'bicycle_walk', 'hybrid_remote'],
      default: 'public_transit',
    },
    dailyCommuteDistanceKm: {
      type: Number,
      default: 15,
      min: 0,
      max: 200,
    },
    homeVentilation: {
      type: String,
      enum: ['poor', 'moderate', 'good'],
      default: 'moderate',
    },
    budgetLevel: {
      type: String,
      enum: ['budget_conscious', 'moderate', 'flexible'],
      default: 'budget_conscious',
    },
    indoorConcerns: {
      type: [String],
      default: ['cooking_smoke', 'dust_pollen', 'outdoor_smog_ingress'],
    },
    city: {
      type: String,
      default: 'Delhi',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('FamilyProfile', familyProfileSchema);
