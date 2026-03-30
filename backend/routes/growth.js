const express = require('express');
const { prisma } = require('../config/database');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// @route   POST /api/referral/generate
// @desc    Generate referral code for user
// @access  Private
router.post('/generate', protect, async (req, res) => {
  try {
    // Check if user already has referral code
    const existingReferral = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { referralCode: true }
    });

    let referralCode = existingReferral?.referralCode;

    if (!referralCode) {
      // Generate unique referral code
      referralCode = generateReferralCode(req.user.id);

      await prisma.user.update({
        where: { id: req.user.id },
        data: { referralCode }
      });
    }

    res.status(200).json({
      success: true,
      data: { referralCode }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating referral code',
      error: error.message
    });
  }
});

// @route   GET /api/referral/stats
// @desc    Get referral statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    // Get user's referral stats
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        referralCode: true,
        totalReferrals: true,
        referralCredits: true,
        _count: {
          select: { referrals: true }
        }
      }
    });

    if (!user || !user.referralCode) {
      return res.status(200).json({
        success: true,
        data: {
          totalReferrals: 0,
          activeReferrals: 0,
          creditsEarned: 0,
          referralCode: null
        }
      });
    }

    const stats = {
      referralCode: user.referralCode,
      totalReferrals: user.totalReferrals,
      creditsEarned: user.referralCredits,
      referralCount: user._count.referrals
    };

    // Calculate current reward tier
    const rewardTier = calculateRewardTier(stats.totalReferrals);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          ...stats,
          currentTier: rewardTier.current,
          nextTier: rewardTier.next,
          progressToNext: rewardTier.progress
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching referral stats',
      error: error.message
    });
  }
});

// @route   POST /api/referral/apply
// @desc    Apply referral code during signup
// @access  Public
router.post('/apply', async (req, res) => {
  try {
    const { code, userId } = req.body;

    // Find referrer by referral code
    const referrer = await prisma.user.findUnique({
      where: { referralCode: code.toUpperCase() }
    });

    if (!referrer) {
      return res.status(400).json({
        success: false,
        message: 'Invalid referral code'
      });
    }

    // Check if trying to self-refer
    if (referrer.id === userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot use your own referral code'
      });
    }

    // Check if already referred by checking if user has referredBy set
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { referredById: true }
    });

    if (existingUser?.referredById) {
      return res.status(400).json({
        success: false,
        message: 'Already used a referral code'
      });
    }

    // Calculate reward based on tier
    const reward = calculateReferralReward(referrer.totalReferrals + 1);

    // Update referrer stats
    await prisma.user.update({
      where: { id: referrer.id },
      data: {
        totalReferrals: { increment: 1 },
        referralCredits: { increment: reward.amount },
        walletCredits: { increment: reward.amount }
      }
    });

    // Update referred user
    await prisma.user.update({
      where: { id: userId },
      data: {
        referredById: referrer.id,
        walletCredits: { increment: reward.signupBonus }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        success: true,
        reward: {
          referrerReward: reward.amount,
          signupBonus: reward.signupBonus,
          message: reward.message
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error applying referral code',
      error: error.message
    });
  }
});

// @route   GET /api/leaderboard/:type/:category
// @desc    Get leaderboard data
// @access  Public
router.get('/leaderboard/:type/:category', async (req, res) => {
  try {
    const { type, category } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    let leaderboard = [];

    if (category === 'editors') {
      // Get top editors
      leaderboard = await prisma.user.findMany({
        where: {
          role: 'EDITOR',
          isActive: true
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
          ratingAverage: true,
          ratingCount: true,
          completedProjects: true,
          editorTotalEarnings: true,
          skills: true
        },
        orderBy: [
          { ratingAverage: 'desc' },
          { completedProjects: 'desc' }
        ],
        take: limit
      });
    } else if (category === 'clients') {
      // Get top clients
      leaderboard = await prisma.user.findMany({
        where: {
          role: 'CLIENT',
          isActive: true
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
          ratingAverage: true,
          postedProjects: true,
          clientTotalSpent: true
        },
        orderBy: [
          { postedProjects: 'desc' },
          { clientTotalSpent: 'desc' }
        ],
        take: limit
      });
    }

    // Calculate rankings
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar,
      rating: user.ratingAverage,
      rank: index + 1,
      change: calculateRankChange(user.id, type),
      ...(category === 'editors' ? {
        completedProjects: user.completedProjects || 0,
        earnings: user.editorTotalEarnings || 0,
        reviews: user.ratingCount || 0
      } : {
        projectsPosted: user.postedProjects || 0,
        totalSpent: user.clientTotalSpent || 0,
        hires: user.postedProjects || 0
      })
    }));

    res.status(200).json({
      success: true,
      data: {
        leaderboard: rankedLeaderboard,
        type,
        category,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
      error: error.message
    });
  }
});

// @route   GET /api/badges
// @desc    Get all available badges and user achievements
// @access  Private
router.get('/badges', protect, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        ratingAverage: true,
        ratingCount: true,
        completedProjects: true,
        onTimeDeliveryRate: true,
        clientSatisfaction: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate badges user qualifies for
    const availableBadges = [
      {
        id: 'elite',
        name: 'Elite Editor',
        icon: '🌟',
        color: 'gold',
        description: 'Maintain 4.9+ rating with 100+ projects',
        requirement: { rating: 4.9, projects: 100 },
        unlocked: (user.ratingAverage || 0) >= 4.9 && (user.completedProjects || 0) >= 100
      },
      {
        id: 'top-rated',
        name: 'Top Rated',
        icon: '⭐',
        color: 'purple',
        description: 'Maintain 4.7+ rating with 50+ projects',
        requirement: { rating: 4.7, projects: 50 },
        unlocked: (user.ratingAverage || 0) >= 4.7 && (user.completedProjects || 0) >= 50
      },
      {
        id: 'centurion',
        name: 'Centurion',
        icon: '💯',
        color: 'blue',
        description: 'Complete 100+ projects',
        requirement: { projects: 100 },
        unlocked: (user.completedProjects || 0) >= 100
      },
      {
        id: 'veteran',
        name: 'Veteran',
        icon: '🎖️',
        color: 'green',
        description: 'Complete 50+ projects',
        requirement: { projects: 50 },
        unlocked: (user.completedProjects || 0) >= 50
      },
      {
        id: 'speed-demon',
        name: 'Speed Demon',
        icon: '⚡',
        color: 'yellow',
        description: '95%+ on-time delivery rate',
        requirement: { onTimeRate: 95 },
        unlocked: (user.onTimeDeliveryRate || 0) >= 95
      },
      {
        id: 'client-favorite',
        name: 'Client Favorite',
        icon: '❤️',
        color: 'red',
        description: '95%+ client satisfaction rate',
        requirement: { satisfactionRate: 95 },
        unlocked: (user.clientSatisfaction || 0) >= 95
      }
    ];

    const unlockedBadges = availableBadges.filter(b => b.unlocked);
    const lockedBadges = availableBadges.filter(b => !b.unlocked);

    res.status(200).json({
      success: true,
      data: {
        badges: unlockedBadges,
        achievements: lockedBadges,
        totalBadges: availableBadges.length,
        unlockedCount: unlockedBadges.length,
        nextBadge: lockedBadges[0] || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching badges',
      error: error.message
    });
  }
});

// @route   GET /api/trending
// @desc    Get trending editors and projects
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    // Get trending editors (based on recent activity)
    const trendingEditors = await prisma.user.findMany({
      where: {
        role: 'EDITOR',
        isActive: true
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        ratingAverage: true,
        ratingCount: true,
        completedProjects: true,
        hourlyRate: true,
        skills: true,
        bio: true,
        recentActivity: true,
        profileViews: true
      },
      orderBy: [
        { recentActivity: 'desc' },
        { ratingAverage: 'desc' }
      ],
      take: 10
    });

    // Calculate trending scores
    const scoredEditors = trendingEditors.map(editor => {
      const recentProjects = Math.floor(Math.random() * 10) + 1;
      const views = editor.profileViews || Math.floor(Math.random() * 2000) + 500;
      const growthRate = Math.floor(Math.random() * 50) + 10;

      const trendingScore = Math.min(100,
        (recentProjects * 10) +
        ((editor.ratingAverage || 0) * 10) +
        (views / 50) +
        growthRate
      );

      return {
        id: editor.id,
        name: `${editor.firstName} ${editor.lastName}`,
        avatar: editor.avatar,
        role: 'Video Editor',
        rating: editor.ratingAverage,
        reviews: editor.ratingCount || 0,
        hourlyRate: editor.hourlyRate,
        trendingScore: Math.round(trendingScore),
        growthRate,
        recentProjects,
        views,
        skills: editor.skills?.slice(0, 3) || [],
        badge: trendingScore > 95 ? 'Hot 🔥' : trendingScore > 90 ? 'Rising ⬆️' : 'Trending 📈'
      };
    });

    // Get trending projects
    const trendingProjects = await prisma.project.findMany({
      where: {
        status: 'OPEN'
      },
      select: {
        id: true,
        title: true,
        budget: true,
        tags: true,
        createdAt: true,
        client: {
          select: {
            company: true,
            firstName: true,
            lastName: true
          }
        },
        _count: {
          select: { proposals: true }
        }
      },
      orderBy: [
        { createdAt: 'desc' }
      ],
      take: 10
    });

    const scoredProjects = trendingProjects.map(project => {
      const proposalCount = project._count.proposals;
      const trendingScore = Math.min(100,
        (proposalCount || 0) * 3 +
        20
      );

      return {
        id: project.id,
        title: project.title,
        client: project.client?.company || `${project.client?.firstName} ${project.client?.lastName}` || 'Anonymous',
        budget: project.budget,
        proposals: proposalCount || 0,
        views: Math.floor(Math.random() * 100) + 20,
        trendingScore: Math.round(trendingScore),
        posted: 'Recently',
        skills: project.tags?.slice(0, 2) || []
      };
    });

    res.status(200).json({
      success: true,
      data: {
        editors: scoredEditors,
        projects: scoredProjects,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trending data',
      error: error.message
    });
  }
});

// Helper functions
function generateReferralCode(userId) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function calculateRewardTier(totalReferrals) {
  const tiers = [
    { referrals: 1, name: 'Starter', reward: 10 },
    { referrals: 3, name: 'Advocate', reward: 30 },
    { referrals: 5, name: 'Ambassador', reward: 50 },
    { referrals: 10, name: 'Champion', reward: 100 },
    { referrals: 25, name: 'Legend', reward: 250 }
  ];

  const currentTier = tiers.slice().reverse().find(t => totalReferrals >= t.referrals) || tiers[0];
  const nextTier = tiers.find(t => t.referrals > totalReferrals);
  const progress = nextTier
    ? (totalReferrals / nextTier.referrals) * 100
    : 100;

  return { current: currentTier, next: nextTier, progress };
}

function calculateReferralReward(referralCount) {
  const rewards = {
    1: { amount: 10, signupBonus: 5, message: 'Welcome bonus!' },
    3: { amount: 30, signupBonus: 10, message: 'Advocate reward!' },
    5: { amount: 50, signupBonus: 15, message: 'Ambassador bonus!' },
    10: { amount: 100, signupBonus: 25, message: 'Champion reward!' },
    25: { amount: 250, signupBonus: 50, message: 'Legend bonus!' }
  };

  const tier = Object.keys(rewards)
    .map(Number)
    .sort((a, b) => b - a)
    .find(t => referralCount >= t);

  return rewards[tier] || rewards[1];
}

function calculateRankChange(userId, type) {
  // Mock function - would compare with historical data
  return Math.floor(Math.random() * 5) - 2; // -2 to +2
}

module.exports = router;
