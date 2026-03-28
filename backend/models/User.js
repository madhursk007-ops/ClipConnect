const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't include password in queries by default
  },
  refreshToken: {
    type: String,
    select: false,
  },
  role: {
    type: String,
    enum: {
      values: ['editor', 'client'],
      message: 'Role must be either editor or client',
    },
    required: [true, 'Role is required'],
  },
  profile: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    website: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Please enter a valid website URL'],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'],
    },
  },
  // Editor specific fields
  editorProfile: {
    skills: [{
      type: String,
      enum: {
        values: ['video-editing', 'motion-graphics', 'color-grading', 'audio-editing', 'animation', 'vfx', 'storytelling'],
        message: 'Invalid skill type',
      },
    }],
    experience: {
      type: String,
      enum: {
        values: ['beginner', 'intermediate', 'expert', 'professional'],
        message: 'Experience must be beginner, intermediate, expert, or professional',
      },
      default: 'intermediate',
    },
    hourlyRate: {
      type: Number,
      min: [5, 'Hourly rate must be at least $5'],
      max: [500, 'Hourly rate cannot exceed $500'],
    },
    portfolio: [{
      title: {
        type: String,
        required: [true, 'Portfolio item title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters'],
      },
      description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters'],
        trim: true,
      },
      videoUrl: {
        type: String,
        match: [/^https?:\/\/.+/, 'Please enter a valid video URL'],
      },
      thumbnailUrl: {
        type: String,
        match: [/^https?:\/\/.+/, 'Please enter a valid thumbnail URL'],
      },
      tags: [String],
      category: {
        type: String,
        enum: ['video-editing', 'motion-graphics', 'color-grading', 'audio-editing', 'animation', 'vfx'],
      },
      duration: String, // e.g., "2:30"
      clientName: String,
      completedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    availability: {
      type: Boolean,
      default: true,
    },
    totalEarnings: {
      type: Number,
      default: 0,
      min: [0, 'Total earnings cannot be negative'],
    },
    completedProjects: {
      type: Number,
      default: 0,
      min: [0, 'Completed projects cannot be negative'],
    },
    education: [{
      institution: String,
      degree: String,
      field: String,
      startDate: Date,
      endDate: Date,
      current: Boolean,
    }],
    certifications: [{
      name: String,
      issuer: String,
      issueDate: Date,
      expiryDate: Date,
      credentialId: String,
      credentialUrl: String,
    }],
    software: [{
      name: String,
      level: {
        type: String,
        enum: ['beginner', 'intermediate', 'expert'],
        default: 'intermediate',
      },
    }],
    languages: [{
      language: String,
      proficiency: {
        type: String,
        enum: ['basic', 'conversational', 'fluent', 'native'],
        default: 'conversational',
      },
    }],
  },
  // Client specific fields
  clientProfile: {
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    industry: {
      type: String,
      trim: true,
      maxlength: [100, 'Industry cannot exceed 100 characters'],
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: [0, 'Total spent cannot be negative'],
    },
    postedProjects: {
      type: Number,
      default: 0,
      min: [0, 'Posted projects cannot be negative'],
    },
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
    },
    website: String,
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Average rating cannot be less than 0'],
      max: [5, 'Average rating cannot exceed 5'],
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Review count cannot be negative'],
    },
    breakdown: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 },
    },
    categories: {
      communication: { type: Number, default: 0 },
      quality: { type: Number, default: 0 },
      timeliness: { type: Number, default: 0 },
      professionalism: { type: Number, default: 0 },
    },
  },
  verification: {
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationExpires: Date,
    emailVerified: {
      type: Boolean,
      default: false,
    },
    idVerified: {
      type: Boolean,
      default: false,
    },
    documents: [{
      type: {
        type: String,
        enum: ['id-card', 'passport', 'driving-license', 'other'],
      },
      url: String,
      publicId: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
      },
      rejectedReason: String,
    }],
  },
  security: {
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: String,
  },
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: true,
      },
      projectUpdates: {
        type: Boolean,
        default: true,
      },
      messages: {
        type: Boolean,
        default: true,
      },
      marketing: {
        type: Boolean,
        default: false,
      },
    },
    privacy: {
      showEmail: {
        type: Boolean,
        default: false,
      },
      showPhone: {
        type: Boolean,
        default: false,
      },
      allowMessages: {
        type: Boolean,
        default: true,
      },
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'dark',
    },
    language: {
      type: String,
      default: 'en',
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isSuspended: {
    type: Boolean,
    default: false,
  },
  suspensionReason: String,
  suspendedAt: Date,
  suspendedUntil: Date,
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'premium'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'unpaid'],
      default: 'active'
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false
    }
  },
  wallet: {
    balance: {
      type: Number,
      default: 0
    },
    credits: {
      type: Number,
      default: 0
    },
    escrow: {
      type: Number,
      default: 0
    },
    pending: {
      type: Number,
      default: 0
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    }
  },
  referral: {
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    codeUsed: String,
    referralCode: String,
    totalReferrals: {
      type: Number,
      default: 0
    },
    creditsEarned: {
      type: Number,
      default: 0
    }
  },
  usage: {
    projectsPosted: {
      type: Number,
      default: 0
    },
    applicationsSubmitted: {
      type: Number,
      default: 0
    },
    messagesSent: {
      type: Number,
      default: 0
    },
    storageUsed: {
      type: Number,
      default: 0
    }
  },
  stats: {
    profileViews: {
      type: Number,
      default: 0
    },
    recentProjects: {
      type: Number,
      default: 0
    },
    recentActivity: {
      type: Number,
      default: 0
    },
    onTimeDeliveryRate: {
      type: Number,
      default: 0
    },
    clientSatisfaction: {
      type: Number,
      default: 0
    },
    responseRate: {
      type: Number,
      default: 0
    },
    averageDeliveryTime: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});
      // Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'ratings.average': -1 });
userSchema.index({ 'editorProfile.availability': 1, role: 1 });
userSchema.index({ 'editorProfile.skills': 1 });
userSchema.index({ 'editorProfile.hourlyRate': 1 });
userSchema.index({ createdAt: -1 });

// Virtual fields
userSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

userSchema.virtual('isLocked').get(function() {
  return !!(this.security.lockUntil && this.security.lockUntil > Date.now());
});

// Pre-save middleware
userSchema.pre('save', async function(next) {
  // Hash password if it was modified
  if (this.isModified('password')) {
    this.security.passwordChangedAt = Date.now() - 1000; // 1 second buffer
    this.password = await bcrypt.hash(this.password, 12);
  }

  // Update username slug
  if (this.isModified('username')) {
    this.username = this.username.toLowerCase();
  }

  next();
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createPasswordResetToken = function() {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.security.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.security.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

userSchema.methods.createEmailVerificationToken = function() {
  const crypto = require('crypto');
  const verificationToken = crypto.randomBytes(32).toString('hex');

  this.verification.verificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  this.verification.verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return verificationToken;
};

userSchema.methods.incrementLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.security.lockUntil && this.security.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { 'security.lockUntil': 1 },
      $set: { 'security.loginAttempts': 1 },
    });
  }

  const updates = { $inc: { 'security.loginAttempts': 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.security.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { 'security.lockUntil': Date.now() + 2 * 60 * 60 * 1000 };
  }

  return this.updateOne(updates);
};

userSchema.methods.updateRatings = async function() {
  const Review = mongoose.model('Review');
  
  const stats = await Review.aggregate([
    { $match: { reviewee: this._id } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingCounts: { $push: '$rating' },
        avgCommunication: { $avg: '$categories.communication' },
        avgQuality: { $avg: '$categories.quality' },
        avgTimeliness: { $avg: '$categories.timeliness' },
        avgProfessionalism: { $avg: '$categories.professionalism' },
      },
    },
  ]);

  if (stats.length > 0) {
    const stat = stats[0];
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    stat.ratingCounts.forEach(rating => {
      breakdown[rating] = (breakdown[rating] || 0) + 1;
    });

    this.ratings = {
      average: Math.round(stat.averageRating * 10) / 10,
      count: stat.totalReviews,
      breakdown,
      categories: {
        communication: Math.round(stat.avgCommunication * 10) / 10 || 0,
        quality: Math.round(stat.avgQuality * 10) / 10 || 0,
        timeliness: Math.round(stat.avgTimeliness * 10) / 10 || 0,
        professionalism: Math.round(stat.avgProfessionalism * 10) / 10 || 0,
      },
    };
  } else {
    this.ratings = {
      average: 0,
      count: 0,
      breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      categories: { communication: 0, quality: 0, timeliness: 0, professionalism: 0 },
    };
  }

  await this.save();
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findByUsername = function(username) {
  return this.findOne({ username: username.toLowerCase() });
};

// Hide sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.refreshToken;
  delete user.verification.verificationToken;
  delete user.security.passwordResetToken;
  delete user.security.passwordResetExpires;
  delete user.security.twoFactorSecret;
  delete user.__v;
  return user;
};

module.exports = mongoose.model('User', userSchema);
