import React from 'react'
import { motion } from 'framer-motion'
import { 
  Film, 
  Users, 
  TrendingUp, 
  Shield,
  ArrowRight,
  CheckCircle,
  Zap,
  Clock,
  Target,
  Award,
  Star
} from 'lucide-react'

const HowItWorksPage = () => {
  const steps = [
    {
      number: '01',
      title: 'Sign Up',
      description: 'Create your free account in seconds. Choose whether you\'re an editor or client.',
      icon: Users,
      features: ['Free to join', 'Quick setup', 'No credit card required'],
      color: 'from-primary-500 to-accent-400'
    },
    {
      number: '02',
      title: 'Create Profile',
      description: 'Build your professional profile with portfolio, skills, and experience.',
      icon: Film,
      features: ['Portfolio upload', 'Skills verification', 'Rating system'],
      color: 'from-accent-400 to-blue-500'
    },
    {
      number: '03',
      title: 'Find Matches',
      description: 'Our AI algorithm connects you with the perfect editor or client for your project.',
      icon: Target,
      features: ['AI-powered matching', '95% accuracy', 'Instant results'],
      color: 'from-blue-500 to-purple-500'
    },
    {
      number: '04',
      title: 'Collaborate',
      description: 'Work together with real-time messaging, file sharing, and project management.',
      icon: Zap,
      features: ['Real-time chat', 'File sharing', 'Project tracking'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      number: '05',
      title: 'Get Paid',
      description: 'Secure escrow payments and instant withdrawals. No fees for editors.',
      icon: Award,
      features: ['Secure payments', 'Instant withdrawals', 'No hidden fees'],
      color: 'from-pink-500 to-red-500'
    }
  ]

  const benefits = [
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Bank-level security and encrypted communications keep your data safe.'
    },
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Find the perfect match in minutes, not days. Our AI does the heavy lifting.'
    },
    {
      icon: Star,
      title: 'Quality Guaranteed',
      description: 'Only verified professionals with proven track records.'
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Business',
      description: 'Access premium tools and analytics to scale your video production.'
    }
  ]

  const stats = [
    { value: '95%', label: 'Match Accuracy' },
    { value: '2Mins', label: 'Average Match Time' },
    { value: '98%', label: 'Success Rate' },
    { value: '24/7', label: 'Support' }
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
            How ClipConnect Works
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            From sign-up to success, we make video production seamless and efficient.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl lg:text-5xl font-bold text-primary-400 mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex-1">
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mr-4`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">{step.title}</h3>
                      <div className="text-primary-400 font-semibold">{step.number}</div>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6">{step.description}</p>
                  <ul className="space-y-2">
                    {step.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-300">
                        <CheckCircle className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1">
                  <div className={`glass-morphism rounded-2xl p-8 border border-white/10 bg-gradient-to-br ${step.color}/10`}>
                    <div className="text-center">
                      <div className="text-6xl font-bold text-primary-400 mb-4">{step.number}</div>
                      <h4 className="text-xl font-semibold text-white">{step.title}</h4>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Why Choose ClipConnect?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="glass-morphism rounded-2xl p-6 border border-white/10 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
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
            <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HowItWorksPage
