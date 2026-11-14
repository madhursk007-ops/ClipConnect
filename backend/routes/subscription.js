const express = require('express');
const { prisma } = require('../config/database');
const { protect } = require('../middlewares/auth');

const router = express.Router();
const stripe = process.env.STRIPE_SECRET_KEY
  ? require('stripe')(process.env.STRIPE_SECRET_KEY)
  : null;

function requireStripe(res) {
  if (stripe) return true;
  res.status(503).json({
    success: false,
    message: 'Paid subscriptions are temporarily unavailable. Payment configuration is required.'
  });
  return false;
}

const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    commission: 0.20,
    features: [
      '3 projects per month',
      '5 applications per month',
      'Basic profile',
      'Standard support'
    ],
    limits: {
      projectsPerMonth: 3,
      applicationsPerMonth: 5,
      storageGB: 5
    }
  },
  pro: {
    name: 'Pro',
    price: 29,
    commission: 0.10,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      'Unlimited projects',
      'Unlimited applications',
      'Enhanced profile',
      'Priority support',
      'Analytics dashboard',
      'Featured listings',
      'AI-powered matching'
    ],
    limits: {
      projectsPerMonth: Infinity,
      applicationsPerMonth: Infinity,
      storageGB: 50
    }
  },
  premium: {
    name: 'Premium',
    price: 99,
    commission: 0.05,
    stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    features: [
      'Everything in Pro',
      'AI-powered portfolio analysis',
      'Advanced analytics',
      'White-label options',
      'Dedicated account manager',
      'API access',
      'Custom branding'
    ],
    limits: {
      projectsPerMonth: Infinity,
      applicationsPerMonth: Infinity,
      storageGB: 200
    }
  }
};

// @route   GET /api/subscription/current
// @desc    Get current user's subscription
// @access  Private
router.get('/current', protect, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        subscriptionPeriodEnd: true,
        cancelAtPeriodEnd: true,
        projectsPosted: true,
        applicationsSubmitted: true,
        messagesSent: true,
        storageUsed: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const planType = String(user.subscriptionPlan || 'FREE').toLowerCase();
    const plan = SUBSCRIPTION_PLANS[planType] || SUBSCRIPTION_PLANS.free;
    const usage = {
      projectsPosted: user.projectsPosted || 0,
      applicationsSubmitted: user.applicationsSubmitted || 0,
      storageUsed: user.storageUsed || 0,
      messagesSent: user.messagesSent || 0
    };

    res.status(200).json({
      success: true,
      data: {
        plan: {
          type: planType,
          name: plan.name,
          price: plan.price,
          commission: plan.commission,
          features: plan.features,
          limits: plan.limits
        },
        status: String(user.subscriptionStatus || 'ACTIVE').toLowerCase(),
        currentPeriodEnd: user.subscriptionPeriodEnd,
        cancelAtPeriodEnd: user.cancelAtPeriodEnd || false,
        usage,
        features: getPlanFeatures(planType)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription',
      error: error.message
    });
  }
});

// @route   POST /api/subscription/upgrade
// @desc    Upgrade subscription plan
// @access  Private
router.post('/upgrade', protect, async (req, res) => {
  if (!requireStripe(res)) return;
  try {
    const { planType } = req.body;
    if (!['pro', 'premium'].includes(planType)) {
      return res.status(400).json({ success: false, message: 'Invalid plan type' });
    }

    const plan = SUBSCRIPTION_PLANS[planType];
    if (!plan.stripePriceId) {
      return res.status(503).json({
        success: false,
        message: 'This subscription plan is not configured for checkout yet.'
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: req.user.email,
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/subscription/success?plan=${planType}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
      metadata: { userId: req.user.id.toString(), planType }
    });

    res.status(200).json({
      success: true,
      data: { subscriptionUrl: session.url, sessionId: session.id }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating subscription',
      error: error.message
    });
  }
});

// @route   POST /api/subscription/cancel
// @desc    Cancel subscription
// @access  Private
router.post('/cancel', protect, async (req, res) => {
  if (!requireStripe(res)) return;
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user?.stripeSubscriptionId) {
      return res.status(400).json({ success: false, message: 'No active subscription found' });
    }

    await stripe.subscriptions.update(user.stripeSubscriptionId, { cancel_at_period_end: true });
    await prisma.user.update({
      where: { id: req.user.id },
      data: { cancelAtPeriodEnd: true }
    });

    res.status(200).json({
      success: true,
      message: 'Subscription will be canceled at the end of the billing period'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error canceling subscription',
      error: error.message
    });
  }
});

// @route   POST /api/subscription/reactivate
// @desc    Reactivate canceled subscription
// @access  Private
router.post('/reactivate', protect, async (req, res) => {
  if (!requireStripe(res)) return;
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user?.stripeSubscriptionId) {
      return res.status(400).json({ success: false, message: 'No subscription found' });
    }

    await stripe.subscriptions.update(user.stripeSubscriptionId, { cancel_at_period_end: false });
    await prisma.user.update({
      where: { id: req.user.id },
      data: { cancelAtPeriodEnd: false }
    });

    res.status(200).json({ success: true, message: 'Subscription reactivated' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reactivating subscription',
      error: error.message
    });
  }
});

// @route   POST /api/subscription/webhook
// @desc    Stripe webhook handler
// @access  Public
router.post('/webhook', async (req, res) => {
  if (!requireStripe(res)) return;
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(503).json({
      success: false,
      message: 'Stripe webhook configuration is required.'
    });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const rawBody = req.rawBody || req.body;
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const planType = String(session.metadata.planType || 'free').toUpperCase();

    if (!['PRO', 'PREMIUM'].includes(planType)) {
      return res.status(400).json({ success: false, message: 'Invalid subscription plan in webhook' });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionPlan: planType,
        subscriptionStatus: 'ACTIVE',
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription
      }
    });
  } else if (event.type === 'customer.subscription.deleted') {
    const deletedSub = event.data.object;
    await prisma.user.updateMany({
      where: { stripeCustomerId: deletedSub.customer },
      data: { subscriptionPlan: 'FREE', subscriptionStatus: 'CANCELED' }
    });
  }

  res.json({ received: true });
});

// @route   GET /api/subscription/plans
// @desc    Get all subscription plans
// @access  Public
router.get('/plans', (req, res) => {
  res.status(200).json({ success: true, data: SUBSCRIPTION_PLANS });
});

function getPlanFeatures(planType) {
  return {
    canPostUnlimited: planType !== 'free',
    canApplyUnlimited: planType !== 'free',
    hasAnalytics: planType !== 'free',
    hasPrioritySupport: planType !== 'free',
    hasFeaturedListing: planType !== 'free',
    hasAIMatching: planType !== 'free',
    hasPortfolioAnalysis: planType === 'premium',
    hasAPIAccess: planType === 'premium',
    hasWhiteLabel: planType === 'premium',
    hasAccountManager: planType === 'premium'
  };
}

module.exports = router;
