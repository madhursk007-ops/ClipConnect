const express = require('express');
const Project = require('../models/Project');
const { auth, authorize } = require('../middleware/auth');
const { emitProjectCreated, emitProjectCompleted } = require('../config/socket');

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects (with filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      status,
      category,
      minBudget,
      maxBudget,
      search,
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = {};

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = parseFloat(minBudget);
      if (maxBudget) query.budget.$lte = parseFloat(maxBudget);
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const projects = await Project.find(query)
      .populate('client', 'username profile.firstName profile.lastName profile.avatar')
      .populate('editor', 'username profile.firstName profile.lastName profile.avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        projects,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'username profile.firstName profile.lastName profile.avatar profile.location')
      .populate('editor', 'username profile.firstName profile.lastName profile.avatar profile.location ratings')
      .populate('proposals.editor', 'username profile.firstName profile.lastName profile.avatar ratings editorProfile.hourlyRate');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        project
      }
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/projects
// @desc    Create a new project (clients only)
// @access  Private
router.post('/', auth, authorize('client'), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      budget,
      deadline,
      requirements,
      tags
    } = req.body;

    // Validation
    if (!title || !description || !category || !budget || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const project = new Project({
      title,
      description,
      client: req.user._id,
      category,
      budget,
      deadline,
      requirements,
      tags: tags || []
    });

    await project.save();

    // Update client's posted projects count
    req.user.clientProfile.postedProjects += 1;
    await req.user.save();

    // Emit socket event for real-time stats update
    emitProjectCreated({
      title: project.title,
      id: project._id
    });

    const populatedProject = await Project.findById(project._id)
      .populate('client', 'username profile.firstName profile.lastName profile.avatar');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: {
        project: populatedProject
      }
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during project creation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project (client only)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is the project client
    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own projects'
      });
    }

    // Don't allow updates if project is in progress or completed
    if (['in-progress', 'completed'].includes(project.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update project in current status'
      });
    }

    const {
      title,
      description,
      category,
      budget,
      deadline,
      requirements,
      tags,
      status
    } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (budget) updateData.budget = budget;
    if (deadline) updateData.deadline = deadline;
    if (requirements) updateData.requirements = requirements;
    if (tags) updateData.tags = tags;
    if (status && ['open', 'cancelled'].includes(status)) updateData.status = status;

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('client', 'username profile.firstName profile.lastName profile.avatar')
     .populate('editor', 'username profile.firstName profile.lastName profile.avatar');

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: {
        project: updatedProject
      }
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during project update'
    });
  }
});

// @route   POST /api/projects/:id/proposals
// @desc    Submit a proposal (editors only)
// @access  Private
router.post('/:id/proposals', auth, authorize('editor'), async (req, res) => {
  try {
    const { message, estimatedTime, proposedBudget } = req.body;

    if (!message || !estimatedTime || !proposedBudget) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if project is still open
    if (project.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Project is not accepting proposals'
      });
    }

    // Check if editor has already submitted a proposal
    const existingProposal = project.proposals.find(
      p => p.editor.toString() === req.user._id.toString()
    );

    if (existingProposal) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a proposal for this project'
      });
    }

    const proposal = {
      editor: req.user._id,
      message,
      estimatedTime,
      proposedBudget
    };

    project.proposals.push(proposal);
    await project.save();

    const updatedProject = await Project.findById(req.params.id)
      .populate('proposals.editor', 'username profile.firstName profile.lastName profile.avatar ratings editorProfile.hourlyRate');

    res.status(201).json({
      success: true,
      message: 'Proposal submitted successfully',
      data: {
        project: updatedProject
      }
    });
  } catch (error) {
    console.error('Submit proposal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during proposal submission'
    });
  }
});

// @route   PUT /api/projects/:id/proposals/:proposalId/accept
// @desc    Accept a proposal (client only)
// @access  Private
router.put('/:id/proposals/:proposalId/accept', auth, authorize('client'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is the project client
    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only accept proposals for your own projects'
      });
    }

    // Find the proposal
    const proposal = project.proposals.id(req.params.proposalId);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }

    // Update project status and assign editor
    project.status = 'in-progress';
    project.editor = proposal.editor;
    proposal.status = 'accepted';

    // Reject all other proposals
    project.proposals.forEach(p => {
      if (p._id.toString() !== req.params.proposalId.toString()) {
        p.status = 'rejected';
      }
    });

    await project.save();

    // Emit socket event when project starts (proposal accepted)
    emitProjectCompleted({
      title: project.title,
      id: project._id,
      status: 'in-progress'
    });

    const updatedProject = await Project.findById(req.params.id)
      .populate('client', 'username profile.firstName profile.lastName profile.avatar')
      .populate('editor', 'username profile.firstName profile.lastName profile.avatar ratings');

    res.status(200).json({
      success: true,
      message: 'Proposal accepted successfully',
      data: {
        project: updatedProject
      }
    });
  } catch (error) {
    console.error('Accept proposal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during proposal acceptance'
    });
  }
});

// @route   GET /api/projects/client/:clientId
// @desc    Get projects by client
// @access  Public
router.get('/client/:clientId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const projects = await Project.find({ client: req.params.clientId })
      .populate('client', 'username profile.firstName profile.lastName profile.avatar')
      .populate('editor', 'username profile.firstName profile.lastName profile.avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Project.countDocuments({ client: req.params.clientId });

    res.status(200).json({
      success: true,
      data: {
        projects,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get client projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/projects/editor/:editorId
// @desc    Get projects by editor
// @access  Public
router.get('/editor/:editorId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const projects = await Project.find({ editor: req.params.editorId })
      .populate('client', 'username profile.firstName profile.lastName profile.avatar')
      .populate('editor', 'username profile.firstName profile.lastName profile.avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Project.countDocuments({ editor: req.params.editorId });

    res.status(200).json({
      success: true,
      data: {
        projects,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get editor projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
