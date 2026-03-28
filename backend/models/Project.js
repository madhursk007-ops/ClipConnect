const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  editor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  category: {
    type: String,
    enum: ['video-editing', 'motion-graphics', 'color-grading', 'audio-editing', 'animation', 'vfx', 'full-production'],
    required: true
  },
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
    min: [10, 'Budget must be at least $10']
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Deadline must be in the future'
    }
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  requirements: {
    duration: { type: String }, // e.g., "5-10 minutes"
    format: { type: String }, // e.g., "YouTube", "Instagram", "TikTok"
    style: { type: String }, // e.g., "Cinematic", "Vlog", "Tutorial"
    footage: { type: String }, // e.g., "Client provides", "Stock footage", "Mixed"
    music: { type: String }, // e.g., "Client provides", "Royalty free", "Custom"
    revisions: { type: Number, default: 2 }
  },
  tags: [String],
  attachments: [{
    filename: String,
    url: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now }
  }],
  proposals: [{
    editor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    estimatedTime: String,
    proposedBudget: Number,
    submittedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
  }],
  milestones: [{
    title: String,
    description: String,
    dueDate: Date,
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    completedAt: Date
  }],
  payments: [{
    amount: Number,
    status: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
    paidAt: Date,
    method: String
  }],
  reviews: [{
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update updatedAt field
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for search
projectSchema.index({ title: 'text', description: 'text', tags: 'text' });
projectSchema.index({ status: 1, category: 1 });
projectSchema.index({ client: 1, editor: 1 });

module.exports = mongoose.model('Project', projectSchema);
