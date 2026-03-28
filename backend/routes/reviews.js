const express = require('express');
const Review = require('../models/Review');
const Project = require('../models/Project');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reviews
// @desc    Get all reviews (with filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      reviewee,
      reviewer,
      project,
      minRating,
      maxRating,
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = {};

    if (reviewee) query.reviewee = reviewee;
    if (reviewer) query.reviewer = reviewer;
    if (project) query.project = project;

    if (minRating || maxRating) {
      query.rating = {};
      if (minRating) query.rating.$gte = parseInt(minRating);
      if (maxRating) query.rating.$lte = parseInt(maxRating);
    }

    const skip = (page - 1) * limit;

    const reviews = await Review.find(query)
      .populate('reviewer', 'username profile.firstName profile.lastName profile.avatar')
      .populate('reviewee', 'username profile.firstName profile.lastName profile.avatar')
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/reviews/user/:userId
// @desc    Get reviews for a specific user
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'username profile.firstName profile.lastName profile.avatar')
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ reviewee: req.params.userId });

    // Calculate rating breakdown
    const ratingBreakdown = await Review.aggregate([
      { $match: { reviewee: mongoose.Types.ObjectId(req.params.userId) } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        ratingBreakdown,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      reviewee,
      project,
      rating,
      comment,
      categories
    } = req.body;

    if (!reviewee || !project || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Reviewee, project, and rating are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if project exists and is completed
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (projectDoc.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed projects'
      });
    }

    // Check if user is involved in the project
    const isClient = projectDoc.client.toString() === req.user._id.toString();
    const isEditor = projectDoc.editor && projectDoc.editor.toString() === req.user._id.toString();

    if (!isClient && !isEditor) {
      return res.status(403).json({
        success: false,
        message: 'You can only review projects you are involved in'
      });
    }

    // Check if reviewee is the other party in the project
    const revieweeId = reviewee.toString();
    const clientId = projectDoc.client.toString();
    const editorId = projectDoc.editor ? projectDoc.editor.toString() : null;

    if ((isClient && revieweeId !== editorId) || (isEditor && revieweeId !== clientId)) {
      return res.status(400).json({
        success: false,
        message: 'You can only review the other party in the project'
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      reviewer: req.user._id,
      project: project
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this project'
      });
    }

    const review = new Review({
      reviewer: req.user._id,
      reviewee,
      project,
      rating,
      comment,
      categories
    });

    await review.save();

    // Update reviewee's average rating
    await updateUserRating(reviewee);

    // Mark review as verified if project is completed
    review.isVerified = true;
    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('reviewer', 'username profile.firstName profile.lastName profile.avatar')
      .populate('reviewee', 'username profile.firstName profile.lastName profile.avatar')
      .populate('project', 'title');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: {
        review: populatedReview
      }
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during review creation'
    });
  }
});

// @route   PUT /api/reviews/:id/response
// @desc    Respond to a review
// @access  Private
router.put('/:id/response', auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Response content is required'
      });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user is the reviewee
    if (review.reviewee.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only respond to reviews about yourself'
      });
    }

    review.response = {
      content,
      respondedAt: new Date()
    };

    await review.save();

    const updatedReview = await Review.findById(req.params.id)
      .populate('reviewer', 'username profile.firstName profile.lastName profile.avatar')
      .populate('reviewee', 'username profile.firstName profile.lastName profile.avatar')
      .populate('project', 'title');

    res.status(200).json({
      success: true,
      message: 'Response added successfully',
      data: {
        review: updatedReview
      }
    });
  } catch (error) {
    console.error('Respond to review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during response creation'
    });
  }
});

// @route   GET /api/reviews/stats/:userId
// @desc    Get review statistics for a user
// @access  Public
router.get('/stats/:userId', async (req, res) => {
  try {
    const stats = await Review.aggregate([
      { $match: { reviewee: mongoose.Types.ObjectId(req.params.userId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingCounts: {
            $push: '$rating'
          }
        }
      }
    ]);

    const categoryStats = await Review.aggregate([
      { 
        $match: { 
          reviewee: mongoose.Types.ObjectId(req.params.userId),
          'categories.communication': { $exists: true }
        } 
      },
      {
        $group: {
          _id: null,
          avgCommunication: { $avg: '$categories.communication' },
          avgQuality: { $avg: '$categories.quality' },
          avgTimeliness: { $avg: '$categories.timeliness' },
          avgProfessionalism: { $avg: '$categories.professionalism' }
        }
      }
    ]);

    const result = {
      averageRating: stats[0]?.averageRating || 0,
      totalReviews: stats[0]?.totalReviews || 0,
      ratingBreakdown: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
      },
      categoryAverages: categoryStats[0] || {
        communication: 0,
        quality: 0,
        timeliness: 0,
        professionalism: 0
      }
    };

    // Calculate rating breakdown
    if (stats[0]) {
      stats[0].ratingCounts.forEach(rating => {
        result.ratingBreakdown[rating] = (result.ratingBreakdown[rating] || 0) + 1;
      });
    }

    res.status(200).json({
      success: true,
      data: {
        stats: result
      }
    });
  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Helper function to update user's average rating
async function updateUserRating(userId) {
  try {
    const stats = await Review.aggregate([
      { $match: { reviewee: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    const averageRating = stats[0]?.averageRating || 0;
    const totalReviews = stats[0]?.totalReviews || 0;

    await User.findByIdAndUpdate(userId, {
      'ratings.average': averageRating,
      'ratings.count': totalReviews
    });
  } catch (error) {
    console.error('Update user rating error:', error);
  }
}

module.exports = router;
