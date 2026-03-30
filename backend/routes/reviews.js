const express = require('express');
const { prisma } = require('../config/database');
const { protect } = require('../middlewares/auth');

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

    // Build Prisma where clause
    const where = {};

    if (reviewee) {
      where.revieweeId = reviewee;
    }
    if (reviewer) {
      where.reviewerId = reviewer;
    }
    if (project) {
      where.projectId = project;
    }
    if (minRating !== undefined || maxRating !== undefined) {
      where.rating = {};
      if (minRating) where.rating.gte = parseFloat(minRating);
      if (maxRating) where.rating.lte = parseFloat(maxRating);
    }

    const skip = (page - 1) * limit;

    const reviews = await prisma.review.findMany({
      where,
      include: {
        reviewer: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        reviewee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        project: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.review.count({ where });

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

    const reviews = await prisma.review.findMany({
      where: { revieweeId: req.params.userId },
      include: {
        reviewer: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        project: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.review.count({
      where: { revieweeId: req.params.userId }
    });

    // Calculate rating breakdown
    const ratingBreakdown = await prisma.review.groupBy({
      by: ['rating'],
      where: { revieweeId: req.params.userId },
      _count: {
        rating: true
      }
    });

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
router.post('/', protect, async (req, res) => {
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
    const projectDoc = await prisma.project.findUnique({
      where: { id: project }
    });

    if (!projectDoc) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (projectDoc.status !== 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed projects'
      });
    }

    // Check if user is involved in the project
    const isClient = projectDoc.clientId === req.user.id;
    const isEditor = projectDoc.editorId === req.user.id;

    if (!isClient && !isEditor) {
      return res.status(403).json({
        success: false,
        message: 'You can only review projects you are involved in'
      });
    }

    // Check if reviewee is the other party in the project
    const revieweeId = reviewee;
    const clientId = projectDoc.clientId;
    const editorId = projectDoc.editorId;

    if ((isClient && revieweeId !== editorId) || (isEditor && revieweeId !== clientId)) {
      return res.status(400).json({
        success: false,
        message: 'You can only review the other party in the project'
      });
    }

    // Check if review already exists
    const existingReview = await prisma.review.findFirst({
      where: {
        reviewerId: req.user.id,
        projectId: project
      }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this project'
      });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        reviewerId: req.user.id,
        revieweeId: reviewee,
        projectId: project,
        rating,
        comment,
        communication: categories?.communication,
        quality: categories?.quality,
        timeliness: categories?.timeliness,
        professionalism: categories?.professionalism,
        isVerified: true
      },
      include: {
        reviewer: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        reviewee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        project: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    // Update reviewee's average rating
    await updateUserRating(reviewee);

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: { review }
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
router.put('/:id/response', protect, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Response content is required'
      });
    }

    const review = await prisma.review.findUnique({
      where: { id: req.params.id }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user is the reviewee
    if (review.revieweeId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only respond to reviews about yourself'
      });
    }

    const updatedReview = await prisma.review.update({
      where: { id: req.params.id },
      data: {
        response: content,
        respondedAt: new Date()
      },
      include: {
        reviewer: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        reviewee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        project: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Response added successfully',
      data: { review: updatedReview }
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
    const stats = await prisma.review.aggregate({
      where: { revieweeId: req.params.userId },
      _avg: { rating: true },
      _count: { rating: true }
    });

    const categoryStats = await prisma.review.aggregate({
      where: {
        revieweeId: req.params.userId,
        NOT: {
          communication: null
        }
      },
      _avg: {
        communication: true,
        quality: true,
        timeliness: true,
        professionalism: true
      }
    });

    // Get rating breakdown
    const ratingBreakdownRaw = await prisma.review.groupBy({
      by: ['rating'],
      where: { revieweeId: req.params.userId },
      _count: { rating: true }
    });

    const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingBreakdownRaw.forEach(item => {
      ratingBreakdown[Math.floor(item.rating)] = item._count.rating;
    });

    const result = {
      averageRating: parseFloat(stats._avg.rating || 0).toFixed(1),
      totalReviews: stats._count.rating || 0,
      ratingBreakdown,
      categoryAverages: {
        communication: parseFloat(categoryStats._avg.communication || 0).toFixed(1),
        quality: parseFloat(categoryStats._avg.quality || 0).toFixed(1),
        timeliness: parseFloat(categoryStats._avg.timeliness || 0).toFixed(1),
        professionalism: parseFloat(categoryStats._avg.professionalism || 0).toFixed(1)
      }
    };

    res.status(200).json({
      success: true,
      data: { stats: result }
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
    const stats = await prisma.review.aggregate({
      where: { revieweeId: userId },
      _avg: { rating: true },
      _count: { rating: true }
    });

    const averageRating = stats._avg.rating || 0;
    const totalReviews = stats._count.rating || 0;

    await prisma.user.update({
      where: { id: userId },
      data: {
        ratingAverage: averageRating,
        ratingCount: totalReviews
      }
    });
  } catch (error) {
    console.error('Update user rating error:', error);
  }
}

module.exports = router;
