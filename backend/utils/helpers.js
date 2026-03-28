const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const logger = require('./logger');

/**
 * Generate random token
 * @param {number} length - Token length
 * @returns {string} Random token
 */
const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate JWT tokens
 * @param {string} userId - User ID
 * @returns {object} Access and refresh tokens
 */
const generateAuthTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
  );

  return { accessToken, refreshToken };
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @param {string} secret - JWT secret
 * @returns {object} Decoded token
 */
const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    logger.error('Token verification failed:', error);
    return null;
  }
};

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @returns {string} Hashed password
 */
const hashPassword = async (password) => {
  const bcrypt = require('bcryptjs');
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password
 * @returns {boolean} Password match
 */
const comparePassword = async (password, hashedPassword) => {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Create slug from string
 * @param {string} text - Text to slugify
 * @returns {string} Slug
 */
const createSlug = (text) => {
  const slugify = require('slugify');
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
};

/**
 * Sanitize user object (remove sensitive data)
 * @param {object} user - User object
 * @returns {object} Sanitized user object
 */
const sanitizeUser = (user) => {
  const { password, refreshToken, __v, ...sanitizedUser } = user.toObject();
  return sanitizedUser;
};

/**
 * Pagination helper
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {object} Pagination options
 */
const getPaginationOptions = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return {
    skip,
    limit: parseInt(limit),
    page: parseInt(page),
  };
};

/**
 * Create pagination response
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {object} Pagination info
 */
const createPaginationResponse = (page, limit, total) => {
  const pages = Math.ceil(total / limit);
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages,
    hasNext: page < pages,
    hasPrev: page > 1,
  };
};

/**
 * Filter and sort options helper
 * @param {object} query - Query parameters
 * @param {array} allowedFields - Allowed filter fields
 * @returns {object} Filter and sort options
 */
const getFilterSortOptions = (query, allowedFields = []) => {
  const { page, limit, sort, sortBy, ...filters } = query;
  
  // Build filter object
  const filterObj = {};
  allowedFields.forEach(field => {
    if (filters[field]) {
      filterObj[field] = filters[field];
    }
  });

  // Build sort object
  const sortObj = {};
  if (sortBy && allowedFields.includes(sortBy)) {
    sortObj[sortBy] = sort === 'desc' ? -1 : 1;
  } else {
    sortObj.createdAt = -1; // Default sort
  }

  return { filter: filterObj, sort: sortObj };
};

/**
 * Calculate average rating
 * @param {array} reviews - Array of reviews with ratings
 * @returns {number} Average rating
 */
const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10; // Round to 1 decimal place
};

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} Valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate random string
 * @param {number} length - String length
 * @returns {string} Random string
 */
const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Format date to readable string
 * @param {Date} date - Date object
 * @returns {string} Formatted date
 */
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Calculate time ago
 * @param {Date} date - Date object
 * @returns {string} Time ago string
 */
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  
  return 'Just now';
};

module.exports = {
  generateToken,
  generateAuthTokens,
  verifyToken,
  hashPassword,
  comparePassword,
  createSlug,
  sanitizeUser,
  getPaginationOptions,
  createPaginationResponse,
  getFilterSortOptions,
  calculateAverageRating,
  isValidEmail,
  generateRandomString,
  formatDate,
  timeAgo,
};
