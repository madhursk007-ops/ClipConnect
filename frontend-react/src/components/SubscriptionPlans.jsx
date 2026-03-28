import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Crown, 
  Star, 
  Check, 
  X, 
  Zap, 
  TrendingUp,
  Users,
  MessageSquare,
  BarChart3,
  Shield,
  CreditCard,
  ArrowRight,
  Loader2,
  CheckCircle
} from 'lucide-react'
import { useSubscriptionStore } from '@store/subscriptionStore'
import { useAuthStore } from '@store/authStore'
import toast from 'react-hot-toast'

const SubscriptionPlans = ({ className = '' }) => {
  const { 
    currentPlan, 
    isPro, 
    upgradePlan, 
    fetchSubscription,
    canUseFeature,
    calculateCommission
  } = useSubscriptionStore()
  
  const { user } = useAuthStore()
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  const plans = {
    free: {
      name: 'Free',
      price: 0,
      icon: Users,
      color: 'from-gray-600 to-gray-700',
      features: [
        '3 projects per month',
        '5 applications per month',
        'Basic profile',
        'Standard support',
        '20% platform commission'
      ],
      limitations: [
        'Limited visibility',
        'No analytics',
        'Standard commission',
        'Basic messaging'
      ],
      cta: 'Current Plan',
      popular: false
    },
    pro: {
      name: 'Pro',
      price: 29,
      icon: Star,
      color: 'from-primary-500 to-accent-400',
      features: [
        'Unlimited projects',
        'Unlimited applications',
        'Enhanced profile',
        'Priority support',
        'Analytics dashboard',
        'Featured listings',
        '10% platform commission',
        'AI-powered matching'
      ],
      limitations: [],
      cta: 'Upgrade to Pro',
      popular: true
    },
    premium: {
      name: 'Premium',
      price: 99,
      icon: Crown,
      color: 'from-yellow-500 to-orange-500',
      features: [
        'Everything in Pro',
        'AI-powered portfolio analysis',
        'Advanced analytics',
        'White-label options',
        'Dedicated account manager',
        '5% platform commission',
        'Priority customer support',
        'Custom branding',
        'API access',
        'Advanced AI features'
      ],
      limitations: [],
      cta: 'Go Premium',
      popular: false
    }
  }

  useEffect(() => {
    fetchSubscription()
  }, [fetchSubscription])

  const handleUpgrade = async (planType) => {
    setSelectedPlan(planType)
    setIsUpgrading(true)
    
    try {
      const subscriptionUrl = await upgradePlan(planType)
      // In production, this would redirect to Stripe
      toast.success('Redirecting to secure payment...')
      
      // Simulate successful upgrade for demo
      setTimeout(() => {
        setIsUpgrading(false)
        setSelectedPlan(null)
        toast.success('Successfully upgraded to Pro plan!')
        fetchSubscription()
      }, 2000)
    } catch (error) {
      setIsUpgrading(false)
      setSelectedPlan(null)
      toast.error('Failed to upgrade. Please try again.')
    }
  }

  const getCommissionSavings = (planType) => {
    const freeCommission = 20
    const commissions = { free: 20, pro: 10, premium: 5 }
    return freeCommission - (commissions[planType] || 20)
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Current Plan Banner */}
      {currentPlan && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-2xl p-6 border border-white/10 bg-gradient-to-r from-primary-500/10 to-accent-400/10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-12 h-12 bg-gradient-to-r ${
                currentPlan.type === 'premium' ? 'from-yellow-500 to-orange-500' :
                currentPlan.type === 'pro' ? 'from-primary-500 to-accent-400' :
                'from-gray-600 to-gray-700'
              } rounded-xl flex items-center justify-center mr-4`}>
                {currentPlan.type === 'premium' && <Crown className="w-6 h-6 text-white" />}
                {currentPlan.type === 'pro' && <Star className="w-6 h-6 text-white" />}
                {currentPlan.type === 'free' && <Users className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {currentPlan.name.charAt(0).toUpperCase() + currentPlan.name.slice(1)} Plan
                </h3>
                <p className="text-sm text-gray-400">
                  {currentPlan.type === 'free' 
                    ? 'You\'re on the free plan'
                    : `Managing ${currentPlan.name} subscription`
                  }
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-400">
                {currentPlan.type === 'free' ? '$0' : `$${currentPlan.price}`}
              </div>
              <div className="text-sm text-gray-400">per month</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(plans).map(([planType, plan], index) => {
          const isCurrentPlan = currentPlan?.type === planType
          const canUpgrade = !isCurrentPlan && (planType === 'pro' || planType === 'premium')
          const savings = getCommissionSavings(planType)
          const Icon = plan.icon

          return (
            <motion.div
              key={planType}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`relative glass-morphism rounded-2xl p-6 border ${
                plan.popular 
                  ? 'border-primary-500/50 shadow-glow' 
                  : isCurrentPlan
                  ? 'border-success/50'
                  : 'border-white/10'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="badge badge-primary px-4 py-1 text-sm">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="badge badge-success px-4 py-1 text-sm">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Current Plan
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
                
                {/* Savings */}
                {planType !== 'free' && savings > 0 && (
                  <div className="mt-2">
                    <span className="badge badge-success text-xs">
                      Save {savings}% on commission
                    </span>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-success mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
                
                {plan.limitations.map((limitation, limitIndex) => (
                  <div key={limitIndex} className="flex items-start opacity-60">
                    <X className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-400 line-through">{limitation}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => canUpgrade && handleUpgrade(planType)}
                disabled={!canUpgrade || isUpgrading}
                className={`w-full btn relative overflow-hidden group ${
                  isCurrentPlan
                    ? 'btn-success cursor-default'
                    : plan.popular
                    ? 'btn-primary'
                    : 'btn-outline'
                }`}
              >
                <AnimatePresence mode="wait">
                  {isUpgrading && selectedPlan === planType ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center"
                    >
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Processing...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center"
                    >
                      {isCurrentPlan ? (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          {plan.cta}
                        </>
                      ) : (
                        <>
                          {plan.cta}
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Animated background for upgrade buttons */}
                {canUpgrade && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            </motion.div>
          )
        })}
      </div>

      {/* Feature Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-morphism rounded-2xl p-6 border border-white/10"
      >
        <h3 className="text-xl font-semibold mb-6">Feature Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4">Feature</th>
                <th className="text-center py-3 px-4">Free</th>
                <th className="text-center py-3 px-4">Pro</th>
                <th className="text-center py-3 px-4">Premium</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'Projects per month', free: '3', pro: 'Unlimited', premium: 'Unlimited' },
                { feature: 'Applications per month', free: '5', pro: 'Unlimited', premium: 'Unlimited' },
                { feature: 'Platform commission', free: '20%', pro: '10%', premium: '5%' },
                { feature: 'AI matching', free: '❌', pro: '✅', premium: '✅' },
                { feature: 'Analytics dashboard', free: '❌', pro: '✅', premium: '✅' },
                { feature: 'Portfolio analysis', free: '❌', pro: '❌', premium: '✅' },
                { feature: 'Priority support', free: '❌', pro: '✅', premium: '✅' },
                { feature: 'Dedicated manager', free: '❌', pro: '❌', premium: '✅' },
                { feature: 'API access', free: '❌', pro: '❌', premium: '✅' }
              ].map((row, index) => (
                <tr key={index} className="border-b border-white/5">
                  <td className="py-3 px-4 text-sm">{row.feature}</td>
                  <td className="py-3 px-4 text-center text-sm">
                    <span className={row.free === '❌' ? 'text-gray-500' : 'text-success'}>
                      {row.free}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-sm">
                    <span className={row.pro === '❌' ? 'text-gray-500' : 'text-primary-400'}>
                      {row.pro}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-sm">
                    <span className={row.premium === '❌' ? 'text-gray-500' : 'text-warning'}>
                      {row.premium}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-morphism rounded-2xl p-6 border border-white/10"
      >
        <h3 className="text-xl font-semibold mb-6">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {[
            {
              q: 'Can I change my plan anytime?',
              a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.'
            },
            {
              q: 'What happens to my data if I downgrade?',
              a: 'Your data is always safe. If you downgrade, some features may be limited but your content remains accessible.'
            },
            {
              q: 'Is there a free trial for paid plans?',
              a: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start.'
            },
            {
              q: 'How does the commission work?',
              a: 'We charge a percentage of each successful project. Lower-tier plans have higher commission rates.'
            }
          ].map((faq, index) => (
            <div key={index} className="border-b border-white/10 pb-4 last:border-0">
              <h4 className="font-semibold mb-2">{faq.q}</h4>
              <p className="text-sm text-gray-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default SubscriptionPlans
