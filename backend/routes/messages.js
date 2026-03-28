const express = require('express');
const Message = require('../models/Message');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/messages
// @desc    Get all conversations for current user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Get conversations where user is either sender or recipient
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { recipient: req.user._id }
          ],
          isDeleted: false
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$sender', req.user._id] },
              then: '$recipient',
              else: '$sender'
            }
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$recipient', req.user._id] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'otherUser'
        }
      },
      {
        $unwind: '$otherUser'
      },
      {
        $project: {
          otherUser: {
            _id: 1,
            username: 1,
            'profile.firstName': 1,
            'profile.lastName': 1,
            'profile.avatar': 1,
            role: 1
          },
          lastMessage: 1,
          unreadCount: 1
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      },
      {
        $skip: skip
      },
      {
        $limit: parseInt(limit)
      }
    ]);

    const total = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { recipient: req.user._id }
          ],
          isDeleted: false
        }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$sender', req.user._id] },
              then: '$recipient',
              else: '$sender'
            }
          }
        }
      },
      {
        $count: 'total'
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        conversations,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total[0]?.total || 0,
          pages: Math.ceil((total[0]?.total || 0) / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/messages/:userId
// @desc    Get conversation with specific user
// @access  Private
router.get('/:userId', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    // Mark messages as read
    await Message.updateMany(
      {
        sender: req.params.userId,
        recipient: req.user._id,
        isRead: false,
        isDeleted: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user._id }
      ],
      isDeleted: false
    })
      .populate('sender', 'username profile.firstName profile.lastName profile.avatar')
      .populate('recipient', 'username profile.firstName profile.lastName profile.avatar')
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({
      $or: [
        { sender: req.user._id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user._id }
      ],
      isDeleted: false
    });

    res.status(200).json({
      success: true,
      data: {
        messages: messages.reverse(), // Show oldest first
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { recipient, content, project, type = 'text', attachments } = req.body;

    if (!recipient || !content) {
      return res.status(400).json({
        success: false,
        message: 'Recipient and content are required'
      });
    }

    // Check if recipient exists
    const User = require('../models/User');
    const recipientUser = await User.findById(recipient);
    
    if (!recipientUser || !recipientUser.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    const message = new Message({
      sender: req.user._id,
      recipient,
      content,
      project,
      type,
      attachments: attachments || []
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username profile.firstName profile.lastName profile.avatar')
      .populate('recipient', 'username profile.firstName profile.lastName profile.avatar')
      .populate('project', 'title');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        message: populatedMessage
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during message sending'
    });
  }
});

// @route   PUT /api/messages/:id
// @desc    Update a message
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is the sender
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own messages'
      });
    }

    // Check if message is too old to edit (24 hours)
    const hoursSinceCreation = (Date.now() - message.createdAt) / (1000 * 60 * 60);
    if (hoursSinceCreation > 24) {
      return res.status(400).json({
        success: false,
        message: 'Messages can only be edited within 24 hours'
      });
    }

    message.content = content;
    await message.save();

    const updatedMessage = await Message.findById(req.params.id)
      .populate('sender', 'username profile.firstName profile.lastName profile.avatar')
      .populate('recipient', 'username profile.firstName profile.lastName profile.avatar')
      .populate('project', 'title');

    res.status(200).json({
      success: true,
      message: 'Message updated successfully',
      data: {
        message: updatedMessage
      }
    });
  } catch (error) {
    console.error('Update message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during message update'
    });
  }
});

// @route   DELETE /api/messages/:id
// @desc    Delete a message
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is the sender or recipient
    if (message.sender.toString() !== req.user._id.toString() && 
        message.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own messages'
      });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during message deletion'
    });
  }
});

// @route   GET /api/messages/unread/count
// @desc    Get unread message count
// @access  Private
router.get('/unread/count', auth, async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({
      recipient: req.user._id,
      isRead: false,
      isDeleted: false
    });

    res.status(200).json({
      success: true,
      data: {
        unreadCount
      }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/messages/project/:projectId
// @desc    Get messages for a specific project
// @access  Private
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      project: req.params.projectId,
      isDeleted: false
    })
      .populate('sender', 'username profile.firstName profile.lastName profile.avatar')
      .populate('recipient', 'username profile.firstName profile.lastName profile.avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({
      project: req.params.projectId,
      isDeleted: false
    });

    res.status(200).json({
      success: true,
      data: {
        messages: messages.reverse(),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get project messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
