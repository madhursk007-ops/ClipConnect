const express = require('express');
const { prisma } = require('../config/database');
const { protect } = require('../middlewares/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Subscription plans configuration
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
    // Get user subscription details
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        subscriptionPeriodEnd: true,
        cancelAtPeriodEnd: true
      }
    });

    const planType = user.subscriptionPlan || 'free';
    const plan = SUBSCRIPTION_PLANS[planType];

    // Calculate usage
    const usage = {
      projectsPosted: user.stats?.projectsPosted || 0,
      applicationsSubmitted: user.stats?.applicationsSubmitted || 0,
      storageUsed: user.storageUsed || 0,
      messagesSent: user.stats?.messagesSent || 0
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
        status: user.subscription?.status || 'active',
        currentPeriodEnd: user.subscription?.currentPeriodEnd,
        cancelAtPeriodEnd: user.subscription?.cancelAtPeriodEnd || false,
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
  try {
    const { planType } = req.body;

    if (!['pro', 'premium'].includes(planType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan type'
      });
    }

    const plan = SUBSCRIPTION_PLANS[planType];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: req.user.email,
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/subscription/success?plan=${planType}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
      metadata: {
        userId: req.user._id.toString(),
        planType
      }
    });

    res.status(200).json({
      success: true,
      data: {
        subscriptionUrl: session.url,
        sessionId: session.id
      }
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
  try {
    const user = await User.findById(req.user._id);

    if (!user.subscription?.stripeSubscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'No active subscription found'
      });
    }

    // Cancel at period end
    await stripe.subscriptions.update(
      user.subscription.stripeSubscriptionId,
      { cancel_at_period_end: true }
    );

    user.subscription.cancelAtPeriodEnd = true;
    await user.save();

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
  try {
    const user = await User.findById(req.user._id);

    if (!user.subscription?.stripeSubscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'No subscription found'
      });
    }

    // Remove cancel_at_period_end
    await stripe.subscriptions.update(
      user.subscription.stripeSubscriptionId,
      { cancel_at_period_end: false }
    );

    user.subscription.cancelAtPeriodEnd = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Subscription reactivated'
    });
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
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle events
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const userId = session.metadata.userId;
      const planType = session.metadata.planType;

      // Update user subscription
      await User.findByIdAndUpdate(userId, {
        'subscription.plan': planType,
        'subscription.status': 'active',
        'subscription.stripeCustomerId': session.customer,
        'subscription.stripeSubscriptionId': session.subscription,
        'subscription.currentPeriodEnd': new Date(session.expires_at * 1000)
      });
      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object;
      // Handle failed payment
      break;

    case 'customer.subscription.deleted':
      const deletedSub = event.data.object;
      const customerId = deletedSub.customer;

      // Find user and downgrade to free
      await User.findOneAndUpdate(
        { 'subscription.stripeCustomerId': customerId },
        {
          'subscription.plan': 'free',
          'subscription.status': 'canceled'
        }
      );
      break;
  }

  res.json({ received: true });
});

// @route   GET /api/subscription/plans
// @desc    Get all subscription plans
// @access  Public
router.get('/plans', (req, res) => {
  res.status(200).json({
    success: true,
    data: SUBSCRIPTION_PLANS
  });
});

// Helper function to get plan features
function getPlanFeatures(planType) {
  const features = {
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
  return features;
}

module.exports = router;
