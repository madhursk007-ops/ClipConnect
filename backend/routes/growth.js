const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const User = require('../models/User');
const Referral = require('../models/Referral');

// @route   POST /api/referral/generate
// @desc    Generate referral code for user
// @access  Private
router.post('/generate', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Check if user already has referral code
    let referral = await Referral.findOne({ referrer: req.user._id });
    
    if (!referral) {
      // Generate unique referral code
      const referralCode = generateReferralCode(req.user._id);
      
      referral = await Referral.create({
        referrer: req.user._id,
        referralCode,
        totalReferrals: 0,
        activeReferrals: 0,
        creditsEarned: 0,
        pendingRewards: 0,
        referrals: []
      });
    }

    res.status(200).json({
      success: true,
      data: {
        referralCode: referral.referralCode
      }
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
    const referral = await Referral.findOne({ referrer: req.user._id });
    
    if (!referral) {
      return res.status(200).json({
        success: true,
        data: {
          totalReferrals: 0,
          activeReferrals: 0,
          creditsEarned: 0,
          pendingRewards: 0,
          referrals: []
        }
      });
    }

    // Calculate current reward tier
    const rewardTier = calculateRewardTier(referral.totalReferrals);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalReferrals: referral.totalReferrals,
          activeReferrals: referral.activeReferrals,
          creditsEarned: referral.creditsEarned,
          pendingRewards: referral.pendingRewards,
          referralCode: referral.referralCode,
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

    // Find referral
    const referral = await Referral.findOne({ referralCode: code.toUpperCase() });
    
    if (!referral) {
      return res.status(400).json({
        success: false,
        message: 'Invalid referral code'
      });
    }

    // Check if trying to self-refer
    if (referral.referrer.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot use your own referral code'
      });
    }

    // Check if already referred
    const alreadyReferred = referral.referrals.some(
      ref => ref.referredUser && ref.referredUser.toString() === userId
    );

    if (alreadyReferred) {
      return res.status(400).json({
        success: false,
        message: 'Already used this referral code'
      });
    }

    // Calculate reward based on tier
    const reward = calculateReferralReward(referral.totalReferrals + 1);

    // Update referral
    referral.referrals.push({
      referredUser: userId,
      date: new Date(),
      status: 'active',
      reward: reward.amount
    });

    referral.totalReferrals += 1;
    referral.activeReferrals += 1;
    referral.pendingRewards += reward.amount;
    
    await referral.save();

    // Credit reward to referrer
    await User.findByIdAndUpdate(referral.referrer, {
      $inc: { 'wallet.credits': reward.amount }
    });

    // Credit signup bonus to new user
    await User.findByIdAndUpdate(userId, {
      $inc: { 'wallet.credits': reward.signupBonus },
      'referral.referredBy': referral.referrer,
      'referral.codeUsed': code
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
      leaderboard = await User.find({
        role: 'editor',
        isActive: true
      })
      .select('firstName lastName avatar rating completedProjects earnings reviews stats')
      .sort({ rating: -1, completedProjects: -1 })
      .limit(limit);
    } else if (category === 'clients') {
      // Get top clients
      leaderboard = await User.find({
        role: 'client',
        isActive: true
      })
      .select('firstName lastName avatar rating projectsPosted totalSpent hires stats')
      .sort({ projectsPosted: -1, totalSpent: -1 })
      .limit(limit);
    }

    // Calculate rankings
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar,
      rating: user.rating,
      rank: index + 1,
      change: calculateRankChange(user._id, type), // Mock function
      ...(category === 'editors' ? {
        completedProjects: user.completedProjects || user.stats?.completedProjects || 0,
        earnings: user.earnings || user.stats?.totalEarnings || 0,
        reviews: user.reviews || 0
      } : {
        projectsPosted: user.projectsPosted || user.stats?.projectsPosted || 0,
        totalSpent: user.totalSpent || user.stats?.totalSpent || 0,
        hires: user.hires || user.stats?.totalHires || 0
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
    const user = await User.findById(req.user._id);

    // Calculate badges user qualifies for
    const availableBadges = [
      {
        id: 'elite',
        name: 'Elite Editor',
        icon: '🌟',
        color: 'gold',
        description: 'Maintain 4.9+ rating with 100+ projects',
        requirement: { rating: 4.9, projects: 100 },
        unlocked: user.rating >= 4.9 && (user.completedProjects || 0) >= 100
      },
      {
        id: 'top-rated',
        name: 'Top Rated',
        icon: '⭐',
        color: 'purple',
        description: 'Maintain 4.7+ rating with 50+ projects',
        requirement: { rating: 4.7, projects: 50 },
        unlocked: user.rating >= 4.7 && (user.completedProjects || 0) >= 50
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
        unlocked: (user.stats?.onTimeDeliveryRate || 0) >= 95
      },
      {
        id: 'client-favorite',
        name: 'Client Favorite',
        icon: '❤️',
        color: 'red',
        description: '95%+ client satisfaction rate',
        requirement: { satisfactionRate: 95 },
        unlocked: (user.stats?.clientSatisfaction || 0) >= 95
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
    const trendingEditors = await User.find({
      role: 'editor',
      isActive: true
    })
    .select('firstName lastName avatar rating completedProjects hourlyRate skills bio')
    .sort({ 'stats.recentActivity': -1, rating: -1 })
    .limit(10);

    // Calculate trending scores
    const scoredEditors = trendingEditors.map(editor => {
      const recentProjects = editor.stats?.recentProjects || Math.floor(Math.random() * 10) + 1;
      const views = editor.stats?.profileViews || Math.floor(Math.random() * 2000) + 500;
      const growthRate = Math.floor(Math.random() * 50) + 10;
      
      const trendingScore = Math.min(100,
        (recentProjects * 10) + 
        (editor.rating * 10) + 
        (views / 50) + 
        growthRate
      );

      return {
        id: editor._id,
        name: `${editor.firstName} ${editor.lastName}`,
        avatar: editor.avatar,
        role: 'Video Editor',
        rating: editor.rating,
        reviews: editor.reviews || 0,
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
    const Project = require('../models/Project');
    const trendingProjects = await Project.find({
      status: 'open'
    })
    .select('title client budget skills proposals views createdAt')
    .sort({ views: -1, proposals: -1 })
    .limit(10)
    .populate('client', 'companyName');

    const scoredProjects = trendingProjects.map(project => {
      const trendingScore = Math.min(100,
        (project.proposals || 0) * 3 +
        (project.views || 0) / 10 +
        20 // Base score
      );

      return {
        id: project._id,
        title: project.title,
        client: project.client?.companyName || 'Anonymous',
        budget: project.budget,
        proposals: project.proposals || 0,
        views: project.views || 0,
        trendingScore: Math.round(trendingScore),
        posted: 'Recently',
        skills: project.skills?.slice(0, 2) || []
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
