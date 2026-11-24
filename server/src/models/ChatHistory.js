const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  structuredData: {
    airQualitySummary: String,
    pollutionLevel: String,
    recommendedActions: [String],
    indoorSafetyTips: [String],
    lowEmissionAlternatives: [String],
    estimatedImpact: String,
    healthPrecautions: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    messages: [messageSchema],
    contextSnapshot: {
      city: String,
      aqi: Number,
      temp: Number,
      severity: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
