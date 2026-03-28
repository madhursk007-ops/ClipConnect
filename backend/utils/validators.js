const Joi = require('joi');
const logger = require('./logger');

// Common validation schemas
const commonSchemas = {
  objectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).message('Invalid ID format'),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required',
  }),
  name: Joi.string().min(2).max(50).trim().required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required',
  }),
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.alphanum': 'Username must only contain alphanumeric characters',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username cannot exceed 30 characters',
    'any.required': 'Username is required',
  }),
};

// User validation schemas
const userSchemas = {
  register: Joi.object({
    username: commonSchemas.username,
    email: commonSchemas.email,
    password: commonSchemas.password,
    role: Joi.string().valid('editor', 'client').required().messages({
      'any.only': 'Role must be either editor or client',
      'any.required': 'Role is required',
    }),
    firstName: commonSchemas.name,
    lastName: commonSchemas.name,
    bio: Joi.string().max(500).allow(''),
    location: Joi.string().max(100).allow(''),
    website: Joi.string().uri().allow(''),
    // Editor specific fields
    skills: Joi.when('role', {
      is: 'editor',
      then: Joi.array().items(Joi.string().valid(
        'video-editing', 'motion-graphics', 'color-grading', 
        'audio-editing', 'animation', 'vfx', 'storytelling'
      )).min(1),
      otherwise: Joi.forbidden(),
    }),
    experience: Joi.when('role', {
      is: 'editor',
      then: Joi.string().valid('beginner', 'intermediate', 'expert', 'professional'),
      otherwise: Joi.forbidden(),
    }),
    hourlyRate: Joi.when('role', {
      is: 'editor',
      then: Joi.number().min(5).max(500),
      otherwise: Joi.forbidden(),
    }),
    // Client specific fields
    company: Joi.when('role', {
      is: 'client',
      then: Joi.string().max(100).allow(''),
      otherwise: Joi.forbidden(),
    }),
    industry: Joi.when('role', {
      is: 'client',
      then: Joi.string().max(100).allow(''),
      otherwise: Joi.forbidden(),
    }),
  }),

  login: Joi.object({
    email: commonSchemas.email,
    password: Joi.string().required().messages({
      'any.required': 'Password is required',
    }),
  }),

  updateProfile: Joi.object({
    firstName: commonSchemas.name.optional(),
    lastName: commonSchemas.name.optional(),
    bio: Joi.string().max(500).allow('').optional(),
    location: Joi.string().max(100).allow('').optional(),
    website: Joi.string().uri().allow('').optional(),
    // Editor specific fields
    skills: Joi.array().items(Joi.string().valid(
      'video-editing', 'motion-graphics', 'color-grading', 
      'audio-editing', 'animation', 'vfx', 'storytelling'
    )).optional(),
    experience: Joi.string().valid('beginner', 'intermediate', 'expert', 'professional').optional(),
    hourlyRate: Joi.number().min(5).max(500).optional(),
    availability: Joi.boolean().optional(),
    // Client specific fields
    company: Joi.string().max(100).allow('').optional(),
    industry: Joi.string().max(100).allow('').optional(),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      'any.required': 'Current password is required',
    }),
    newPassword: commonSchemas.password,
  }),
};

// Project validation schemas
const projectSchemas = {
  create: Joi.object({
    title: Joi.string().min(5).max(100).required().messages({
      'string.min': 'Title must be at least 5 characters long',
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Title is required',
    }),
    description: Joi.string().min(20).max(2000).required().messages({
      'string.min': 'Description must be at least 20 characters long',
      'string.max': 'Description cannot exceed 2000 characters',
      'any.required': 'Description is required',
    }),
    category: Joi.string().valid(
      'video-editing', 'motion-graphics', 'color-grading', 
      'audio-editing', 'animation', 'vfx', 'full-production'
    ).required().messages({
      'any.only': 'Invalid project category',
      'any.required': 'Category is required',
    }),
    budget: Joi.number().min(10).required().messages({
      'number.min': 'Budget must be at least $10',
      'any.required': 'Budget is required',
    }),
    deadline: Joi.date().min('now').required().messages({
      'date.min': 'Deadline must be in the future',
      'any.required': 'Deadline is required',
    }),
    requirements: Joi.object({
      duration: Joi.string().max(100).allow(''),
      format: Joi.string().max(50).allow(''),
      style: Joi.string().max(50).allow(''),
      footage: Joi.string().max(100).allow(''),
      music: Joi.string().max(100).allow(''),
      revisions: Joi.number().min(1).max(10).default(2),
    }).optional(),
    tags: Joi.array().items(Joi.string().max(30)).max(10).optional(),
  }),

  update: Joi.object({
    title: Joi.string().min(5).max(100).optional(),
    description: Joi.string().min(20).max(2000).optional(),
    category: Joi.string().valid(
      'video-editing', 'motion-graphics', 'color-grading', 
      'audio-editing', 'animation', 'vfx', 'full-production'
    ).optional(),
    budget: Joi.number().min(10).optional(),
    deadline: Joi.date().min('now').optional(),
    status: Joi.string().valid('open', 'in-progress', 'completed', 'cancelled').optional(),
    requirements: Joi.object({
      duration: Joi.string().max(100).allow(''),
      format: Joi.string().max(50).allow(''),
      style: Joi.string().max(50).allow(''),
      footage: Joi.string().max(100).allow(''),
      music: Joi.string().max(100).allow(''),
      revisions: Joi.number().min(1).max(10),
    }).optional(),
    tags: Joi.array().items(Joi.string().max(30)).max(10).optional(),
  }),

  proposal: Joi.object({
    message: Joi.string().min(10).max(1000).required().messages({
      'string.min': 'Message must be at least 10 characters long',
      'string.max': 'Message cannot exceed 1000 characters',
      'any.required': 'Message is required',
    }),
    estimatedTime: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Estimated time must be at least 2 characters long',
      'string.max': 'Estimated time cannot exceed 50 characters',
      'any.required': 'Estimated time is required',
    }),
    proposedBudget: Joi.number().min(5).required().messages({
      'number.min': 'Proposed budget must be at least $5',
      'any.required': 'Proposed budget is required',
    }),
  }),
};

// Message validation schemas
const messageSchemas = {
  send: Joi.object({
    recipient: commonSchemas.objectId.required().messages({
      'any.required': 'Recipient ID is required',
    }),
    content: Joi.string().min(1).max(2000).required().messages({
      'string.min': 'Message cannot be empty',
      'string.max': 'Message cannot exceed 2000 characters',
      'any.required': 'Message content is required',
    }),
    project: commonSchemas.objectId.optional(),
    type: Joi.string().valid('text', 'file', 'image', 'video').default('text'),
    attachments: Joi.array().items(Joi.object({
      filename: Joi.string().required(),
      url: Joi.string().uri().required(),
      size: Joi.number().required(),
      mimeType: Joi.string().required(),
    })).optional(),
  }),

  update: Joi.object({
    content: Joi.string().min(1).max(2000).required().messages({
      'string.min': 'Message cannot be empty',
      'string.max': 'Message cannot exceed 2000 characters',
      'any.required': 'Message content is required',
    }),
  }),
};

// Review validation schemas
const reviewSchemas = {
  create: Joi.object({
    reviewee: commonSchemas.objectId.required().messages({
      'any.required': 'Reviewee ID is required',
    }),
    project: commonSchemas.objectId.required().messages({
      'any.required': 'Project ID is required',
    }),
    rating: Joi.number().min(1).max(5).required().messages({
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating cannot exceed 5',
      'any.required': 'Rating is required',
    }),
    comment: Joi.string().max(1000).allow('').optional(),
    categories: Joi.object({
      communication: Joi.number().min(1).max(5).optional(),
      quality: Joi.number().min(1).max(5).optional(),
      timeliness: Joi.number().min(1).max(5).optional(),
      professionalism: Joi.number().min(1).max(5).optional(),
    }).optional(),
  }),

  response: Joi.object({
    content: Joi.string().min(1).max(500).required().messages({
      'string.min': 'Response cannot be empty',
      'string.max': 'Response cannot exceed 500 characters',
      'any.required': 'Response content is required',
    }),
  }),
};

// Query validation schemas
const querySchemas = {
  pagination: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    sort: Joi.string().valid('asc', 'desc').default('desc'),
    sortBy: Joi.string().default('createdAt'),
  }),

  userSearch: Joi.object({
    role: Joi.string().valid('editor', 'client').optional(),
    skills: Joi.alternatives().try(
      Joi.string(),
      Joi.array().items(Joi.string())
    ).optional(),
    experience: Joi.string().valid('beginner', 'intermediate', 'expert', 'professional').optional(),
    minRate: Joi.number().min(0).optional(),
    maxRate: Joi.number().min(0).optional(),
    search: Joi.string().max(100).optional(),
  }).concat(querySchemas.pagination),

  projectSearch: Joi.object({
    status: Joi.string().valid('open', 'in-progress', 'completed').optional(),
    category: Joi.string().valid(
      'video-editing', 'motion-graphics', 'color-grading', 
      'audio-editing', 'animation', 'vfx', 'full-production'
    ).optional(),
    minBudget: Joi.number().min(0).optional(),
    maxBudget: Joi.number().min(0).optional(),
    search: Joi.string().max(100).optional(),
  }).concat(querySchemas.pagination),
};

// Validation middleware factory
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source];
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      logger.warn('Validation error:', errors);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    req[source] = value;
    next();
  };
};

module.exports = {
  validate,
  schemas: {
    user: userSchemas,
    project: projectSchemas,
    message: messageSchemas,
    review: reviewSchemas,
    query: querySchemas,
  },
  commonSchemas,
};
