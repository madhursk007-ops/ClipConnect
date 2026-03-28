const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  type: {
    type: String,
    enum: ['text', 'file', 'image', 'video', 'system'],
    default: 'text'
  },
  attachments: [{
    filename: String,
    url: String,
    size: Number,
    mimeType: String
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date,
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, isRead: 1 });
messageSchema.index({ project: 1, createdAt: -1 });

// Pre-save middleware to handle read status
messageSchema.pre('save', function(next) {
  if (this.isRead && !this.readAt) {
    this.readAt = new Date();
  }
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true;
    this.editedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Message', messageSchema);
