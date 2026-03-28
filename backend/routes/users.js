const express = require('express');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

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

    // Build query
    const query = { isActive: true };

    if (role) {
      query.role = role;
    }

    // Editor specific filters
    if (role === 'editor') {
      if (skills) {
        query['editorProfile.skills'] = { $in: skills.split(',') };
      }
      if (experience) {
        query['editorProfile.experience'] = experience;
      }
      if (minRate || maxRate) {
        query['editorProfile.hourlyRate'] = {};
        if (minRate) query['editorProfile.hourlyRate'].$gte = parseFloat(minRate);
        if (maxRate) query['editorProfile.hourlyRate'].$lte = parseFloat(maxRate);
      }
    }

    // Search functionality
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { 'profile.firstName': { $regex: search, $options: 'i' } },
        { 'profile.lastName': { $regex: search, $options: 'i' } },
        { 'profile.bio': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password')
      .sort({ 'ratings.average': -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

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
    const user = await User.findById(req.params.id).select('-password');

    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
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

    const users = await User.find({ role, isActive: true })
      .select('-password')
      .sort({ 'ratings.average': -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments({ role, isActive: true });

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

    const editors = await User.find({
      role: 'editor',
      isActive: true,
      'editorProfile.availability': true,
      'ratings.average': { $gte: 4.0 }
    })
      .select('-password')
      .sort({ 'ratings.average': -1, 'editorProfile.completedProjects': -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        editors
      }
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
router.put('/:id/portfolio', auth, authorize('editor'), async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, tags } = req.body;

    if (!title || !videoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title and video URL are required'
      });
    }

    // Check if user is updating their own portfolio
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own portfolio'
      });
    }

    const portfolioItem = {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      tags: tags || []
    };

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { 'editorProfile.portfolio': portfolioItem } },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Portfolio item added successfully',
      data: {
        user
      }
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
router.delete('/:id/portfolio/:portfolioId', auth, authorize('editor'), async (req, res) => {
  try {
    // Check if user is updating their own portfolio
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own portfolio'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { 'editorProfile.portfolio': { _id: req.params.portfolioId } } },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Portfolio item removed successfully',
      data: {
        user
      }
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
