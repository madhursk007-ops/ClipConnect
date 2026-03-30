const express = require('express');
const { prisma } = require('../config/database');
const { protect, authorize } = require('../middlewares/auth');
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

    // Build Prisma where clause
    const where = {};

    if (status) {
      where.status = status.toUpperCase();
    }

    if (category) {
      where.category = category.toUpperCase().replace('-', '_');
    }

    if (minBudget !== undefined || maxBudget !== undefined) {
      where.budget = {};
      if (minBudget) where.budget.gte = parseFloat(minBudget);
      if (maxBudget) where.budget.lte = parseFloat(maxBudget);
    }

    // Search functionality (case insensitive on title and description)
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const skip = (page - 1) * limit;

    // Get projects with related client and editor data
    const projects = await prisma.project.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        editor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.project.count({ where });

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
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        client: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            location: true
          }
        },
        editor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            location: true,
            ratingAverage: true,
            ratingCount: true
          }
        },
        proposals: {
          include: {
            editor: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
                ratingAverage: true,
                ratingCount: true,
                hourlyRate: true
              }
            }
          },
          orderBy: { submittedAt: 'desc' }
        },
        attachments: true,
        milestones: true,
        payments: true
      }
    });

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
router.post('/', protect, authorize('client'), async (req, res) => {
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

    // Create project
    const project = await prisma.project.create({
      data: {
        title,
        description,
        clientId: req.user.id,
        category: category.toUpperCase().replace('-', '_'),
        budget: parseFloat(budget),
        deadline: new Date(deadline),
        duration: requirements?.duration,
        format: requirements?.format,
        style: requirements?.style,
        footage: requirements?.footage,
        music: requirements?.music,
        revisions: requirements?.revisions || 2,
        tags: tags || []
      },
      include: {
        client: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    });

    // Update client's posted projects count
    await prisma.user.update({
      where: { id: req.user.id },
      data: { postedProjects: { increment: 1 } }
    });

    // Emit socket event for real-time stats update
    emitProjectCreated({
      title: project.title,
      id: project.id
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project }
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
router.put('/:id', protect, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is the project client
    if (project.clientId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own projects'
      });
    }

    // Don't allow updates if project is in progress or completed
    if (['IN_PROGRESS', 'COMPLETED'].includes(project.status)) {
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
    if (category) updateData.category = category.toUpperCase().replace('-', '_');
    if (budget) updateData.budget = parseFloat(budget);
    if (deadline) updateData.deadline = new Date(deadline);
    if (requirements) {
      if (requirements.duration) updateData.duration = requirements.duration;
      if (requirements.format) updateData.format = requirements.format;
      if (requirements.style) updateData.style = requirements.style;
      if (requirements.footage) updateData.footage = requirements.footage;
      if (requirements.music) updateData.music = requirements.music;
      if (requirements.revisions) updateData.revisions = requirements.revisions;
    }
    if (tags) updateData.tags = tags;
    if (status && ['OPEN', 'CANCELLED'].includes(status.toUpperCase())) {
      updateData.status = status.toUpperCase();
    }

    const updatedProject = await prisma.project.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        client: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        editor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: { project: updatedProject }
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
router.post('/:id/proposals', protect, authorize('editor'), async (req, res) => {
  try {
    const { message, estimatedTime, proposedBudget } = req.body;

    if (!message || !estimatedTime || !proposedBudget) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const project = await prisma.project.findUnique({
      where: { id: req.params.id }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if project is still open
    if (project.status !== 'OPEN') {
      return res.status(400).json({
        success: false,
        message: 'Project is not accepting proposals'
      });
    }

    // Check if editor has already submitted a proposal
    const existingProposal = await prisma.proposal.findFirst({
      where: {
        projectId: req.params.id,
        editorId: req.user.id
      }
    });

    if (existingProposal) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a proposal for this project'
      });
    }

    // Create proposal
    await prisma.proposal.create({
      data: {
        projectId: req.params.id,
        editorId: req.user.id,
        message,
        estimatedTime,
        proposedBudget: parseFloat(proposedBudget)
      }
    });

    // Get updated project with proposals
    const updatedProject = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        proposals: {
          include: {
            editor: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
                ratingAverage: true,
                ratingCount: true,
                hourlyRate: true
              }
            }
          },
          orderBy: { submittedAt: 'desc' }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Proposal submitted successfully',
      data: { project: updatedProject }
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
router.put('/:id/proposals/:proposalId/accept', protect, authorize('client'), async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is the project client
    if (project.clientId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only accept proposals for your own projects'
      });
    }

    // Find the proposal
    const proposal = await prisma.proposal.findUnique({
      where: { id: req.params.proposalId }
    });

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }

    // Update project status and assign editor
    await prisma.project.update({
      where: { id: req.params.id },
      data: {
        status: 'IN_PROGRESS',
        editorId: proposal.editorId
      }
    });

    // Accept the selected proposal
    await prisma.proposal.update({
      where: { id: req.params.proposalId },
      data: { status: 'ACCEPTED' }
    });

    // Reject all other proposals
    await prisma.proposal.updateMany({
      where: {
        projectId: req.params.id,
        id: { not: req.params.proposalId }
      },
      data: { status: 'REJECTED' }
    });

    // Emit socket event when project starts (proposal accepted)
    emitProjectCompleted({
      title: project.title,
      id: project.id,
      status: 'in-progress'
    });

    // Get updated project
    const updatedProject = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        client: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        editor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            ratingAverage: true,
            ratingCount: true
          }
        },
        proposals: {
          include: {
            editor: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Proposal accepted successfully',
      data: { project: updatedProject }
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

    const projects = await prisma.project.findMany({
      where: { clientId: req.params.clientId },
      include: {
        client: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        editor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.project.count({
      where: { clientId: req.params.clientId }
    });

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

    const projects = await prisma.project.findMany({
      where: { editorId: req.params.editorId },
      include: {
        client: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        editor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.project.count({
      where: { editorId: req.params.editorId }
    });

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
