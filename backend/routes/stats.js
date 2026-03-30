const express = require('express');
const router = express.Router();
const { getStats, getDashboardStats } = require('../controllers/statsController');
const { protect } = require('../middlewares/auth');
const { getConnectedUsersCount } = require('../config/socket');

// Public route - Platform statistics
router.get('/', getStats);

// Protected route - User dashboard stats
router.get('/dashboard', protect, getDashboardStats);

// Get online users count
router.get('/online', (req, res) => {
  res.status(200).json({
    success: true,
    count: getConnectedUsersCount()
  });
});

module.exports = router;
