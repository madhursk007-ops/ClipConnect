const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');
const { verifyToken } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * Authentication middleware - Protect routes
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId || decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        isSuspended: true,
        firstName: true,
        lastName: true,
        avatar: true,
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or account deactivated.',
      });
    }

    // Add user to request object
    req.user = user;
    next();

  } catch (error) {
    logger.error('Authentication middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Token verification failed.',
    });
  }
};

/**
 * Role-based authorization middleware
 * @param {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Access denied for user ${req.user._id}. Role: ${req.user.role}, Required: ${roles.join(', ')}`);
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
      });
    }

    next();
  };
};

/**
 * Optional authentication - Doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (decoded) {
      const user = await User.findById(decoded.userId).select('-password -refreshToken');
      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Don't fail the request, just continue without user
    next();
  }
};

/**
 * Check if user owns the resource
 * @param {string} resourceField - Field name in req.params that contains resource owner ID
 */
const checkOwnership = (resourceField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const resourceOwnerId = req.params[resourceField];
    const userId = req.user.id;

    if (resourceOwnerId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.',
      });
    }

    next();
  };
};

/**
 * Check if user is project client or assigned editor
 */
const checkProjectAccess = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.params.id;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required.',
      });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    const userId = req.user.id;
    const isClient = project.clientId === userId;
    const isEditor = project.editorId === userId;

    if (!isClient && !isEditor && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not associated with this project.',
      });
    }

    req.project = project;
    next();

  } catch (error) {
    logger.error('Project access check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during project access check.',
    });
  }
};

/**
 * Check if users can message each other
 */
const checkMessagingAccess = async (req, res, next) => {
  try {
    const recipientId = req.body.recipient || req.params.userId;
    const senderId = req.user.id;

    if (recipientId === senderId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send messages to yourself.',
      });
    }

    // Check if recipient exists and is active
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId }
    });

    if (!recipient || !recipient.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found or account deactivated.',
      });
    }

    next();

  } catch (error) {
    logger.error('Messaging access check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during messaging access check.',
    });
  }
};

/**
 * Check if user can review the project/editor
 */
const checkReviewAccess = async (req, res, next) => {
  try {
    const { project, reviewee } = req.body;
    const reviewer = req.user.id;

    if (!project || !reviewee) {
      return res.status(400).json({
        success: false,
        message: 'Project ID and reviewee ID are required.',
      });
    }

    const projectDoc = await prisma.project.findUnique({
      where: { id: project }
    });

    if (!projectDoc) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    // Check if project is completed
    if (projectDoc.status !== 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'You can only review completed projects.',
      });
    }

    // Check if user is involved in the project
    const isClient = projectDoc.clientId === reviewer;
    const isEditor = projectDoc.editorId === reviewer;

    if (!isClient && !isEditor) {
      return res.status(403).json({
        success: false,
        message: 'You can only review projects you are involved in.',
      });
    }

    // Check if reviewee is the other party in the project
    const revieweeId = reviewee;
    const clientId = projectDoc.clientId;
    const editorId = projectDoc.editorId;

    if ((isClient && revieweeId !== editorId) || (isEditor && revieweeId !== clientId)) {
      return res.status(400).json({
        success: false,
        message: 'You can only review the other party in the project.',
      });
    }

    // Check if review already exists
    const existingReview = await prisma.review.findFirst({
      where: {
        reviewerId: reviewer,
        projectId: project,
      }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this project.',
      });
    }

    next();

  } catch (error) {
    logger.error('Review access check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during review access check.',
    });
  }
};

/**
 * Rate limiting for specific actions
 */
const createRateLimit = (windowMs, max, message) => {
  const rateLimit = require('express-rate-limit');

  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || 'Too many requests. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Predefined rate limits
const rateLimits = {
  auth: createRateLimit(15 * 60 * 1000, 5, 'Too many authentication attempts. Please try again later.'),
  message: createRateLimit(1 * 60 * 1000, 30, 'Too many messages sent. Please wait a moment.'),
  project: createRateLimit(1 * 60 * 1000, 10, 'Too many project actions. Please slow down.'),
  review: createRateLimit(1 * 60 * 1000, 5, 'Too many review attempts. Please try again later.'),
};

module.exports = {
  authenticate,
  protect: authenticate, // Alias for compatibility
  authorize,
  optionalAuth,
  checkOwnership,
  checkProjectAccess,
  checkMessagingAccess,
  checkReviewAccess,
  rateLimits,
};
