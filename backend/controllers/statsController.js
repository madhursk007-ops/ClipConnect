const User = require('../models/User');
const Project = require('../models/Project');

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
      activeProjects,
      pendingProjects
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'editor' }),
      User.countDocuments({ role: 'client' }),
      Project.countDocuments(),
      Project.countDocuments({ status: 'completed' }),
      Project.countDocuments({ status: 'active' }),
      Project.countDocuments({ status: 'pending' })
    ]);

    // Get recent activity (last 24 hours)
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const [
      newUsersToday,
      newProjectsToday,
      projectsCompletedToday
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: last24Hours } }),
      Project.countDocuments({ createdAt: { $gte: last24Hours } }),
      Project.countDocuments({ 
        status: 'completed', 
        updatedAt: { $gte: last24Hours } 
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
        activeProjects,
        pendingProjects,
        recentActivity: {
          newUsersToday,
          newProjectsToday,
          projectsCompletedToday
        }
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
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
    const userId = req.user._id;
    const userRole = req.user.role;

    let stats = {};

    if (userRole === 'editor') {
      // Editor-specific stats
      const [
        totalApplications,
        activeProjects,
        completedProjects,
        totalEarnings
      ] = await Promise.all([
        Project.countDocuments({ 'applications.editor': userId }),
        Project.countDocuments({ 
          assignedEditor: userId, 
          status: 'active' 
        }),
        Project.countDocuments({ 
          assignedEditor: userId, 
          status: 'completed' 
        }),
        // Calculate total earnings from completed projects
        Project.aggregate([
          {
            $match: {
              assignedEditor: userId,
              status: 'completed'
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$budget' }
            }
          }
        ])
      ]);

      stats = {
        role: 'editor',
        totalApplications,
        activeProjects,
        completedProjects,
        totalEarnings: totalEarnings[0]?.total || 0,
        rating: req.user.rating || 0,
        reviewCount: req.user.reviewCount || 0
      };
    } else {
      // Client-specific stats
      const [
        postedProjects,
        activeProjects,
        completedProjects,
        totalSpent
      ] = await Promise.all([
        Project.countDocuments({ client: userId }),
        Project.countDocuments({ 
          client: userId, 
          status: 'active' 
        }),
        Project.countDocuments({ 
          client: userId, 
          status: 'completed' 
        }),
        Project.aggregate([
          {
            $match: {
              client: userId,
              status: 'completed'
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$budget' }
            }
          }
        ])
      ]);

      stats = {
        role: 'client',
        postedProjects,
        activeProjects,
        completedProjects,
        totalSpent: totalSpent[0]?.total || 0
      };
    }

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
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
      User.countDocuments(),
      Project.countDocuments(),
      Project.countDocuments({ status: 'completed' })
    ]);

    return {
      totalUsers,
      totalProjects,
      completedProjects
    };
  } catch (error) {
    console.error('Realtime stats error:', error);
    return null;
  }
};

module.exports = {
  getStats,
  getDashboardStats,
  getRealtimeStats
};
