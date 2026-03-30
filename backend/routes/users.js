const express = require('express');
const { prisma } = require('../config/database');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (with filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      role,
      skills,
      experience,
      minRate,
      maxRate,
      search,
      page = 1,
      limit = 10
    } = req.query;

    // Build Prisma where clause
    const where = { isActive: true };

    if (role) {
      where.role = role.toUpperCase();
    }

    // Editor specific filters
    if (role === 'editor') {
      where.isEditor = true;
      if (skills) {
        where.skills = { hasSome: skills.split(',').map(s => s.toUpperCase().replace('-', '_')) };
      }
      if (experience) {
        where.experience = experience.toUpperCase();
      }
      if (minRate !== undefined || maxRate !== undefined) {
        where.hourlyRate = {};
        if (minRate) where.hourlyRate.gte = parseFloat(minRate);
        if (maxRate) where.hourlyRate.lte = parseFloat(maxRate);
      }
    }

    // Search functionality (case insensitive)
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } }
      ];
    }

    const skip = (page - 1) * limit;

    // Get users with pagination
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        bio: true,
        avatar: true,
        location: true,
        website: true,
        isEditor: true,
        skills: true,
        experience: true,
        hourlyRate: true,
        availability: true,
        isClient: true,
        company: true,
        industry: true,
        ratingAverage: true,
        ratingCount: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            projectsAsEditor: true,
            reviewsReceived: true
          }
        }
      },
      orderBy: [
        { ratingAverage: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.user.count({ where });

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        bio: true,
        avatar: true,
        location: true,
        website: true,
        phone: true,
        isEditor: true,
        skills: true,
        experience: true,
        hourlyRate: true,
        availability: true,
        editorTotalEarnings: true,
        completedProjects: true,
        isClient: true,
        company: true,
        industry: true,
        companySize: true,
        clientTotalSpent: true,
        postedProjects: true,
        ratingAverage: true,
        ratingCount: true,
        isVerified: true,
        emailVerified: true,
        idVerified: true,
        createdAt: true,
        updatedAt: true,
        education: true,
        certifications: true,
        portfolioItems: true,
        software: true,
        languages: true,
        reviewsReceived: {
          include: {
            reviewer: {
              select: {
                id: true,
                username: true,
                avatar: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        _count: {
          select: {
            projectsAsEditor: true,
            projectsAsClient: true,
            reviewsReceived: true
          }
        }
      }
    });

    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/role/:role
// @desc    Get users by role
// @access  Public
router.get('/role/:role', async (req, res) => {
  try {
    const { role } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!['editor', 'client'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const skip = (page - 1) * limit;

    // Convert role to uppercase for Prisma enum
    const roleFilter = role.toUpperCase();

    const users = await prisma.user.findMany({
      where: {
        role: roleFilter,
        isActive: true
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        bio: true,
        avatar: true,
        location: true,
        website: true,
        isEditor: true,
        skills: true,
        experience: true,
        hourlyRate: true,
        availability: true,
        isClient: true,
        company: true,
        industry: true,
        ratingAverage: true,
        ratingCount: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: {
            projectsAsEditor: true,
            reviewsReceived: true
          }
        }
      },
      orderBy: [
        { ratingAverage: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.user.count({
      where: { role: roleFilter, isActive: true }
    });

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users by role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/editors/featured
// @desc    Get featured editors
// @access  Public
router.get('/editors/featured', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const editors = await prisma.user.findMany({
      where: {
        role: 'EDITOR',
        isActive: true,
        availability: true,
        ratingAverage: { gte: 4.0 }
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        bio: true,
        avatar: true,
        location: true,
        skills: true,
        experience: true,
        hourlyRate: true,
        ratingAverage: true,
        ratingCount: true,
        completedProjects: true,
        _count: {
          select: {
            reviewsReceived: true
          }
        }
      },
      orderBy: [
        { ratingAverage: 'desc' },
        { completedProjects: 'desc' }
      ],
      take: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      data: { editors }
    });
  } catch (error) {
    console.error('Get featured editors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/:id/portfolio
// @desc    Add portfolio item (editors only)
// @access  Private
router.put('/:id/portfolio', protect, authorize('editor'), async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, tags, category } = req.body;

    if (!title || !videoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title and video URL are required'
      });
    }

    // Check if user is updating their own portfolio
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own portfolio'
      });
    }

    const portfolioItem = await prisma.portfolioItem.create({
      data: {
        userId: req.params.id,
        title,
        description,
        videoUrl,
        thumbnailUrl,
        tags: tags || [],
        category: category ? category.toUpperCase().replace('-', '_') : null
      }
    });

    res.status(200).json({
      success: true,
      message: 'Portfolio item added successfully',
      data: { portfolioItem }
    });
  } catch (error) {
    console.error('Add portfolio item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/users/:id/portfolio/:portfolioId
// @desc    Remove portfolio item (editors only)
// @access  Private
router.delete('/:id/portfolio/:portfolioId', protect, authorize('editor'), async (req, res) => {
  try {
    // Check if user is updating their own portfolio
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own portfolio'
      });
    }

    await prisma.portfolioItem.delete({
      where: { id: req.params.portfolioId }
    });

    res.status(200).json({
      success: true,
      message: 'Portfolio item removed successfully'
    });
  } catch (error) {
    console.error('Remove portfolio item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
