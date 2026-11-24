const CommunityPost = require('../models/CommunityPost');

/**
 * GET /api/community/posts
 */
const getPosts = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    let posts = await CommunityPost.find(filter).sort({ upvotes: -1, createdAt: -1 }).limit(50);

    // If no posts yet, seed realistic community posts
    if (posts.length === 0 && !search && (!category || category === 'all')) {
      const seedPosts = [
        {
          authorName: 'Priya Sharma (Green Parent)',
          category: 'smog_alert',
          title: 'Heavy Inversion Spike along Ring Road this morning',
          content: 'Noticed morning AQI exceeded 360 near Lajpat Nagar junction. Visibility under 200m. Please ensure your kids wear N95 masks when waiting for school buses today!',
          location: 'South Delhi',
          upvotes: 42,
          verifiedTip: true,
        },
        {
          authorName: 'Vikram Mehta (DIY Maker)',
          category: 'indoor_hack',
          title: 'Built a 20-inch Box Fan + MERV 13 purifier for under $30',
          content: 'Tested with a laser PM2.5 monitor: Room PM2.5 dropped from 240 µg/m³ to 28 µg/m³ in 35 minutes! Sealed edges with heavy gorilla duct tape. Cost 1/10th of high-end brands.',
          location: 'Dwarka Sector 12',
          upvotes: 89,
          verifiedTip: true,
        },
        {
          authorName: 'Arjun Sen',
          category: 'carpooling',
          title: 'Carpool route: Noida Sector 62 to Cyber City Gurugram',
          content: 'Looking for 2 co-passengers to share electric sedan commute Mon-Fri. Cutting 3 single-occupancy vehicles off the expressway.',
          location: 'NCR Transit Corridor',
          upvotes: 27,
          verifiedTip: false,
        },
        {
          authorName: 'Dr. Sunita Rao (Pulmonologist)',
          category: 'general_advice',
          title: 'Why dry broom sweeping is dangerous during winter smog',
          content: 'Dry brooms kick up settled heavy metals and particulate toxins back into the 1-meter breathing zone. Please insist your housekeepers use damp microfiber cloths or wet mopping only.',
          location: 'Central Medical Center',
          upvotes: 114,
          verifiedTip: true,
        },
        {
          authorName: 'Anand K.',
          category: 'clean_commute',
          title: 'Metro Yellow Line now running extra AC trains during peak smog',
          content: 'Heads up commuters: Delhi Metro has added 60 extra trips during peak smog hours. Safe, clean filtered air inside coaches and zero tailpipe emissions.',
          location: 'Yellow Line Corridor',
          upvotes: 56,
          verifiedTip: false,
        },
      ];
      posts = await CommunityPost.insertMany(seedPosts);
    }

    res.json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/community/posts
 */
const createPost = async (req, res, next) => {
  try {
    const { title, content, category, location, authorName } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required.',
      });
    }

    const post = await CommunityPost.create({
      authorId: req.user ? req.user._id : null,
      authorName: req.user ? req.user.name : authorName || 'Community Member',
      title,
      content,
      category: category || 'general_advice',
      location: location || (req.user?.city || 'Local Area'),
      upvotes: 0,
      upvotedBy: [],
    });

    res.status(201).json({
      success: true,
      message: 'Community tip posted successfully',
      post,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/community/posts/:id/upvote
 */
const upvotePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const identifier = req.user ? req.user._id.toString() : (req.body.visitorId || req.ip);

    const post = await CommunityPost.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Toggle upvote
    const hasUpvoted = post.upvotedBy.includes(identifier);
    if (hasUpvoted) {
      post.upvotes = Math.max(0, post.upvotes - 1);
      post.upvotedBy = post.upvotedBy.filter((uid) => uid !== identifier);
    } else {
      post.upvotes += 1;
      post.upvotedBy.push(identifier);
    }

    await post.save();

    res.json({
      success: true,
      upvotes: post.upvotes,
      hasUpvoted: !hasUpvoted,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPosts,
  createPost,
  upvotePost,
};
