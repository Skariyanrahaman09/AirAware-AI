const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
      default: 'Community Member',
    },
    category: {
      type: String,
      enum: ['smog_alert', 'indoor_hack', 'carpooling', 'clean_commute', 'general_advice'],
      default: 'general_advice',
    },
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      maxlength: 120,
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
      trim: true,
      maxlength: 1000,
    },
    location: {
      type: String,
      default: 'Community Hub',
      trim: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    upvotedBy: [
      {
        type: String,
      },
    ],
    verifiedTip: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CommunityPost', communityPostSchema);
