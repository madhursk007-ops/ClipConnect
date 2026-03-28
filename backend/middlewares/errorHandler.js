const logger = require('../utils/logger');

/**
 * Custom error class
 */
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle MongoDB CastError
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * Handle MongoDB duplicate fields error
 */
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

/**
 * Handle MongoDB validation error
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Handle JWT error
 */
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

/**
 * Handle JWT expired error
 */
const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

/**
 * Send error response in development
 */
const sendErrorDev = (err, req, res) => {
  // API error
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      success: false,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // Rendered website error
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message,
  });
};

/**
 * Send error response in production
 */
const sendErrorProd = (err, req, res) => {
  // API error
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }

    // Programming or other unknown error: don't leak error details
    logger.error('ERROR 💥', err);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong!',
    });
  }

  // Rendered website
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Programming or other unknown error: don't leak error details
  logger.error('ERROR 💥', err);
  return res.status(err.statusCode).json({
    success: false,
    message: 'Please try again later.',
  });
};

/**
 * Global error handling middleware
 */
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific MongoDB errors
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};

/**
 * Handle unhandled promise rejections
 */
process.on('unhandledRejection', (err, promise) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

/**
 * 404 Not Found handler
 */
const notFound = (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(err);
};

/**
 * Async error wrapper
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * Validation error handler
 */
const validationError = (errors) => {
  const formattedErrors = errors.map(error => ({
    field: error.path,
    message: error.msg,
    value: error.value,
  }));

  return new AppError('Validation failed', 400);
};

module.exports = {
  AppError,
  globalErrorHandler,
  notFound,
  catchAsync,
  validationError,
};
