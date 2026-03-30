const { prisma } = require('../config/database');
const logger = require('../utils/logger');

// @desc    Get platform statistics
// @route   GET /api/stats
// @access  Public
const getStats = async (req, res) => {
  try {
    // Run all count queries in parallel for better performance
    const [
      totalUsers,
      editors,
      clients,
      totalProjects,
      completedProjects,
      inProgressProjects,
      openProjects
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'EDITOR' } }),
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.project.count(),
      prisma.project.count({ where: { status: 'COMPLETED' } }),
      prisma.project.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.project.count({ where: { status: 'OPEN' } })
    ]);

    // Get recent activity (last 24 hours)
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      newUsersToday,
      newProjectsToday,
      projectsCompletedToday
    ] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: last24Hours } } }),
      prisma.project.count({ where: { createdAt: { gte: last24Hours } } }),
      prisma.project.count({
        where: {
          status: 'COMPLETED',
          updatedAt: { gte: last24Hours }
        }
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        editors,
        clients,
        totalProjects,
        completedProjects,
        activeProjects: inProgressProjects,
        pendingProjects: openProjects,
        recentActivity: {
          newUsersToday,
          newProjectsToday,
          projectsCompletedToday
        }
      }
    });
  } catch (error) {
    logger.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get detailed dashboard stats
// @route   GET /api/stats/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let stats = {};

    if (userRole === 'EDITOR') {
      // Editor-specific stats
      const [
        totalApplications,
        activeProjects,
        completedProjects,
        totalEarningsAgg
      ] = await Promise.all([
        prisma.proposal.count({ where: { editorId: userId } }),
        prisma.project.count({
          where: {
            editorId: userId,
            status: 'IN_PROGRESS'
          }
        }),
        prisma.project.count({
          where: {
            editorId: userId,
            status: 'COMPLETED'
          }
        }),
        // Calculate total earnings from completed projects
        prisma.project.aggregate({
          where: {
            editorId: userId,
            status: 'COMPLETED'
          },
          _sum: { budget: true }
        })
      ]);

      stats = {
        role: 'editor',
        totalApplications,
        activeProjects,
        completedProjects,
        totalEarnings: totalEarningsAgg._sum.budget || 0,
        rating: req.user.ratingAverage || 0,
        reviewCount: req.user.ratingCount || 0
      };
    } else {
      // Client-specific stats
      const [
        postedProjects,
        activeProjects,
        completedProjects,
        totalSpentAgg
      ] = await Promise.all([
        prisma.project.count({ where: { clientId: userId } }),
        prisma.project.count({
          where: {
            clientId: userId,
            status: 'IN_PROGRESS'
          }
        }),
        prisma.project.count({
          where: {
            clientId: userId,
            status: 'COMPLETED'
          }
        }),
        prisma.project.aggregate({
          where: {
            clientId: userId,
            status: 'COMPLETED'
          },
          _sum: { budget: true }
        })
      ]);

      stats = {
        role: 'client',
        postedProjects,
        activeProjects,
        completedProjects,
        totalSpent: totalSpentAgg._sum.budget || 0
      };
    }

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get real-time stats for Socket.io
// @access  Internal
const getRealtimeStats = async () => {
  try {
    const [
      totalUsers,
      totalProjects,
      completedProjects
    ] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.project.count({ where: { status: 'COMPLETED' } })
    ]);

    return {
      totalUsers,
      totalProjects,
      completedProjects
    };
  } catch (error) {
    logger.error('Realtime stats error:', error);
    return null;
  }
};

module.exports = {
  getStats,
  getDashboardStats,
  getRealtimeStats
};
