const express = require('express');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { emitUserJoined } = require('../config/socket');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role,
      firstName,
      lastName,
      bio,
      location,
      website
    } = req.body;

    // Validation
    if (!username || !email || !password || !role || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (!['editor', 'client'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either editor or client'
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role,
      profile: {
        firstName,
        lastName,
        bio,
        location,
        website
      }
    });

    await user.save();

    // Emit socket event for real-time stats update
    emitUserJoined({
      name: `${user.profile.firstName} ${user.profile.lastName}`,
      role: user.role
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: req.user
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

// @route   PUT /api/auth/update-profile
// @desc    Update user profile
// @access  Private
router.put('/update-profile', auth, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      bio,
      location,
      website,
      // Editor specific fields
      skills,
      experience,
      hourlyRate,
      availability,
      // Client specific fields
      company,
      industry
    } = req.body;

    const updateData = {};
    
    // Update basic profile
    if (firstName) updateData['profile.firstName'] = firstName;
    if (lastName) updateData['profile.lastName'] = lastName;
    if (bio !== undefined) updateData['profile.bio'] = bio;
    if (location !== undefined) updateData['profile.location'] = location;
    if (website !== undefined) updateData['profile.website'] = website;

    // Update role-specific profile
    if (req.user.role === 'editor') {
      if (skills) updateData['editorProfile.skills'] = skills;
      if (experience) updateData['editorProfile.experience'] = experience;
      if (hourlyRate !== undefined) updateData['editorProfile.hourlyRate'] = hourlyRate;
      if (availability !== undefined) updateData['editorProfile.availability'] = availability;
    } else if (req.user.role === 'client') {
      if (company !== undefined) updateData['clientProfile.company'] = company;
      if (industry !== undefined) updateData['clientProfile.industry'] = industry;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile update',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
