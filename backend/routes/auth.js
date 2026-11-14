const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');
const { prisma } = require('../config/database');
const { protect } = require('../middlewares/auth');
const { emitUserJoined } = require('../config/socket');
const { sendEmail, emailTemplates } = require('../config/email');
const logger = require('../utils/logger');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRE || '15m',
});

const generateRefreshToken = (id) => jwt.sign(
  { id },
  process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
);

const hashRefreshToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const publicUser = (user) => {
  const { password, refreshToken, passwordResetToken, twoFactorSecret, ...safeUser } = user;
  return safeUser;
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
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = await prisma.user.create({
      data: {
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role.toUpperCase(),
        firstName,
        lastName,
        bio,
        location,
        website,
        isEditor: role === 'editor',
        isClient: role === 'client',
      }
    });

    // Emit socket event for real-time stats update
    emitUserJoined({
      name: `${user.firstName} ${user.lastName}`,
      role: user.role
    });

    // Issue a short-lived access token and store only a hash of the refresh token.
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashRefreshToken(refreshToken) }
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          ...publicUser(user),
        },
        token,
        refreshToken
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
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Rotate refresh credentials after a successful login.
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date(), refreshToken: hashRefreshToken(refreshToken) }
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          ...publicUser(user),
        },
        token,
        refreshToken
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
router.get('/me', protect, async (req, res) => {
  try {
    // Get full user from Prisma
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        education: true,
        certifications: true,
        portfolioItems: true,
        software: true,
        languages: true,
      }
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          ...user,
          password: undefined,
        }
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
router.put('/update-profile', protect, async (req, res) => {
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
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (website !== undefined) updateData.website = website;

    // Update role-specific profile
    if (req.user.role === 'EDITOR') {
      if (skills) updateData.skills = skills.map(s => s.toUpperCase().replace('-', '_'));
      if (experience) updateData.experience = experience.toUpperCase();
      if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate;
      if (availability !== undefined) updateData.availability = availability;
    } else if (req.user.role === 'CLIENT') {
      if (company !== undefined) updateData.company = company;
      if (industry !== undefined) updateData.industry = industry;
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          ...user,
          password: undefined,
        }
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

// @route   POST /api/auth/logout
// @desc    Logout user and clear session
// @access  Private
router.post('/logout', protect, async (req, res) => {
  try {
    // Clear refresh token from database
    await prisma.user.update({
      where: { id: req.user.id },
      data: { refreshToken: null }
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh access token using refresh token
// @access  Public
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user || !user.isActive || user.refreshToken !== hashRefreshToken(refreshToken)) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is invalid or expired'
      });
    }

    const newAccessToken = generateToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashRefreshToken(newRefreshToken) }
    });

    res.status(200).json({
      success: true,
      data: {
        token: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      message: 'Token refresh failed'
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User with this email not found'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Save hashed token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      }
    });

    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      ...emailTemplates.passwordReset(resetUrl)
    });

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to email'
    });
  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending password reset email'
    });
  }
});

module.exports = router;
