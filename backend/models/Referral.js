const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referralCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  totalReferrals: {
    type: Number,
    default: 0
  },
  activeReferrals: {
    type: Number,
    default: 0
  },
  creditsEarned: {
    type: Number,
    default: 0
  },
  pendingRewards: {
    type: Number,
    default: 0
  },
  referrals: [{
    referredUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'inactive'],
      default: 'pending'
    },
    reward: {
      type: Number,
      default: 0
    },
    firstProjectCompleted: {
      type: Boolean,
      default: false
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

referralSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
referralSchema.index({ referralCode: 1 });
referralSchema.index({ referrer: 1 });

module.exports = mongoose.model('Referral', referralSchema);
