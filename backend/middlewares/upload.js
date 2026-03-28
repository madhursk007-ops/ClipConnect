const multer = require('multer');
const { cloudinary } = require('../config/cloudinary');
const { AppError } = require('./errorHandler');
const logger = require('../utils/logger');

/**
 * Configure multer for memory storage
 */
const storage = multer.memoryStorage();

/**
 * File filter function
 */
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed!', 400), false);
  }
};

/**
 * Configure multer upload
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5, // Maximum 5 files
  },
});

/**
 * Upload single image to Cloudinary
 */
const uploadSingleImage = async (file, folder = 'clipconnect') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto' },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      size: result.bytes,
      format: result.format,
    };
  } catch (error) {
    logger.error('Cloudinary upload error:', error);
    throw new AppError('Failed to upload image to cloud storage', 500);
  }
};

/**
 * Upload multiple images to Cloudinary
 */
const uploadMultipleImages = async (files, folder = 'clipconnect') => {
  try {
    const uploadPromises = files.map(file => uploadSingleImage(file, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    logger.error('Multiple Cloudinary upload error:', error);
    throw new AppError('Failed to upload images to cloud storage', 500);
  }
};

/**
 * Delete image from Cloudinary
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    logger.error('Cloudinary delete error:', error);
    throw new AppError('Failed to delete image from cloud storage', 500);
  }
};

/**
 * Upload middleware for single image
 */
const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    const singleUpload = upload.single(fieldName);
    
    singleUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError('File size too large. Maximum size is 5MB', 400));
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return next(new AppError('Too many files uploaded', 400));
        }
        return next(new AppError(`Upload error: ${err.message}`, 400));
      } else if (err) {
        return next(err);
      }
      next();
    });
  };
};

/**
 * Upload middleware for multiple images
 */
const uploadMultiple = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    const multipleUpload = upload.array(fieldName, maxCount);
    
    multipleUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError('File size too large. Maximum size is 5MB', 400));
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return next(new AppError(`Too many files uploaded. Maximum is ${maxCount}`, 400));
        }
        return next(new AppError(`Upload error: ${err.message}`, 400));
      } else if (err) {
        return next(err);
      }
      next();
    });
  };
};

/**
 * Process uploaded images and add to request
 */
const processImages = async (req, res, next) => {
  try {
    if (!req.files && !req.file) {
      return next();
    }

    let uploadedImages = [];

    if (req.file) {
      // Single file upload
      const uploadedImage = await uploadSingleImage(req.file.buffer, 'profiles');
      uploadedImages.push(uploadedImage);
    } else if (req.files && req.files.length > 0) {
      // Multiple files upload
      uploadedImages = await uploadMultipleImages(req.files.map(f => f.buffer), 'portfolio');
    }

    // Add uploaded images to request object
    req.uploadedImages = uploadedImages;
    next();

  } catch (error) {
    next(error);
  }
};

/**
 * Video upload middleware (for portfolio videos)
 */
const uploadVideo = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Allowed video types
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Only video files are allowed! (MP4, AVI, MOV, WMV, FLV)', 400), false);
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
    files: 1, // Only one video at a time
  },
});

/**
 * Upload video to Cloudinary
 */
const uploadSingleVideo = async (file, folder = 'clipconnect/videos') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'video',
      transformation: [
        { quality: 'auto' },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      size: result.bytes,
      format: result.format,
      duration: result.duration,
    };
  } catch (error) {
    logger.error('Cloudinary video upload error:', error);
    throw new AppError('Failed to upload video to cloud storage', 500);
  }
};

/**
 * Process uploaded video
 */
const processVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const uploadedVideo = await uploadSingleVideo(req.file.buffer, 'portfolio');
    req.uploadedVideo = uploadedVideo;
    next();

  } catch (error) {
    next(error);
  }
};

/**
 * Document upload middleware (for project files)
 */
const uploadDocument = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Allowed document types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Only document files are allowed! (PDF, DOC, DOCX, XLS, XLSX, TXT)', 400), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for documents
    files: 5, // Maximum 5 documents
  },
});

/**
 * Upload document to Cloudinary
 */
const uploadSingleDocument = async (file, folder = 'clipconnect/documents') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'raw',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      size: result.bytes,
      format: result.format,
      originalName: file.originalname,
    };
  } catch (error) {
    logger.error('Cloudinary document upload error:', error);
    throw new AppError('Failed to upload document to cloud storage', 500);
  }
};

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadVideo,
  uploadDocument,
  processImages,
  processVideo,
  uploadSingleImage,
  uploadMultipleImages,
  uploadSingleVideo,
  uploadSingleDocument,
  deleteImage,
};
