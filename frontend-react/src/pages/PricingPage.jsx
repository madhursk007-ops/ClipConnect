import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Star, 
  Users, 
  TrendingUp, 
  Shield,
  ArrowRight,
  CheckCircle,
  Zap,
  Film,
  Briefcase
} from 'lucide-react'

const PricingPage = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        '3 projects per month',
        '5 applications per month',
        'Basic profile',
        'Standard support',
        'Community access'
      ],
      limitations: [
        'Limited messaging',
        'Basic analytics',
        'No AI features'
      ],
      cta: 'Get Started',
      ctaLink: '/auth/world-class',
      popular: false,
      icon: Star
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      description: 'For professional editors and growing businesses',
      features: [
        'Unlimited projects',
        'Unlimited applications',
        'Enhanced profile',
        'Priority support',
        'AI-powered matching',
        'Advanced analytics',
        'Featured listings',
        'Portfolio analysis'
      ],
      limitations: [
        'No white-label options',
        'No API access'
      ],
      cta: 'Start Free Trial',
      ctaLink: '/auth/world-class',
      popular: true,
      icon: Zap
    },
    {
      name: 'Premium',
      price: '$99',
      period: 'per month',
      description: 'For enterprises and agencies',
      features: [
        'Everything in Pro',
        'White-label options',
        'Dedicated account manager',
        'API access',
        'Custom branding',
        'Advanced security',
        'Priority processing',
        'Custom integrations'
      ],
      limitations: [],
      cta: 'Contact Sales',
      ctaLink: '/contact',
      popular: false,
      icon: Shield
    }
  ]

  const faqs = [
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and we\'ll prorate any differences.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and PayPal. For Enterprise plans, we also offer invoice-based payments.'
    },
    {
      question: 'Is there a free trial for paid plans?',
      answer: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start your trial.'
    },
    {
      question: 'Can I cancel my subscription?',
      answer: 'Absolutely. You can cancel your subscription at any time. Your access will continue until the end of your billing period.'
    },
    {
      question: 'Do you offer discounts for annual billing?',
      answer: 'Yes! Annual billing saves you 20% compared to monthly billing. You can switch to annual billing anytime.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Video Editor',
      content: 'The Pro plan has tripled my client base. The AI matching is incredible!',
      rating: 5
    },
    {
      name: 'Marcus Johnson',
      role: 'Marketing Director',
      content: 'Premium plan gives us everything we need for our agency. Worth every penny.',
      rating: 5
    },
    {
      name: 'Elena Rodriguez',
      role: 'Freelancer',
      content: 'Started with Free, upgraded to Pro, and never looked back. Best decision!',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            className="text-5xl lg:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Choose the perfect plan for your needs. Start free and upgrade as you grow.
          </motion.p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                className={`glass-morphism rounded-2xl p-8 border ${
                  plan.popular 
                    ? 'border-primary-500/50 shadow-2xl shadow-primary-500/20' 
                    : 'border-white/10'
                } relative overflow-hidden`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-primary-500 to-accent-400 text-white px-4 py-2 rounded-bl-xl text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center justify-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${
                    plan.popular ? 'from-primary-500 to-accent-400' : 'from-gray-600 to-gray-700'
                  } rounded-2xl flex items-center justify-center`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400">/{plan.period}</span>
                </div>
                <p className="text-gray-300 mb-8">{plan.description}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-300">
                      <CheckCircle className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                  {plan.limitations.map((limitation, i) => (
                    <li key={i} className="flex items-center text-gray-500">
                      <span className="w-5 h-5 mr-3 flex-shrink-0">—</span>
                      {limitation}
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.ctaLink}
                  className={`block w-full py-3 px-6 rounded-xl font-semibold text-center transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary-500 to-accent-400 text-white hover:shadow-lg hover:shadow-primary-500/30'
                      : 'bg-dark-800 border border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="glass-morphism rounded-2xl p-6 border border-white/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="glass-morphism rounded-xl p-6 border border-white/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="glass-morphism-strong rounded-3xl p-12 border border-primary-500/30 bg-gradient-to-r from-primary-500/10 to-accent-400/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-300 mb-8">
              Join thousands of video editors and clients already using ClipConnect
            </p>
            <Link
              to="/auth/world-class"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default PricingPage
