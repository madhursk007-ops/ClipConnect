import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Zap, 
  TrendingUp,
  Users,
  Star,
  Film,
  ChevronRight,
  Play,
  ArrowRight
} from 'lucide-react'
import FloatingAuthModal from '@components/FloatingAuthModal'

const LuxuryLandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Track mouse position for cursor glow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const openAuthModal = (mode) => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }
  
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Matching',
      description: 'Our intelligent algorithm connects you with the perfect editor for your project',
      gradient: 'from-primary-500 to-accent-400'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Find and hire top editors in minutes, not days',
      gradient: 'from-accent-400 to-blue-500'
    },
    {
      icon: TrendingUp,
      title: 'Premium Quality',
      description: 'Only the best video editors with proven track records',
      gradient: 'from-blue-500 to-purple-500'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CEO, TechCorp',
      content: 'ClipConnect transformed our video production. The AI matching found us the perfect editor instantly.',
      rating: 5,
      avatar: '/avatars/sarah.jpg'
    },
    {
      name: 'Marcus Johnson',
      role: 'Video Editor',
      content: 'As an editor, ClipConnect has tripled my client base. The platform is professional and reliable.',
      rating: 5,
      avatar: '/avatars/marcus.jpg'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Marketing Director',
      content: 'The quality of editors on this platform is unmatched. Highly recommend!',
      rating: 5,
      avatar: '/avatars/elena.jpg'
    }
  ]

  const stats = [
    { value: '2,847', label: 'Active Editors' },
    { value: '15.2K', label: 'Projects Completed' },
    { value: '98%', label: 'Success Rate' },
    { value: '$2.4M', label: 'Total Earnings' }
  ]

  return (
    <div className="min-h-screen bg-dark-900 overflow-hidden relative">
      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3Cfilter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-accent-500/10 to-blue-600/10" />
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-400 rounded-2xl flex items-center justify-center mr-4">
                <Film className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                ClipConnect
              </h1>
            </div>
            
            <motion.h2
              className="text-4xl lg:text-5xl font-semibold text-white mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Connect. Create. Conquer.
            </motion.h2>
            
            <motion.p
              className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              The premium marketplace connecting top video editors with brands that need exceptional content
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                onClick={() => openAuthModal('register')}
                className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-400 text-white font-semibold rounded-xl relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
              
              <motion.button
                onClick={() => openAuthModal('login')}
                className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary-400 mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Why Choose ClipConnect?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the future of video editing collaboration with our AI-powered platform
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glass-morphism rounded-2xl p-8 border border-white/10 hover:border-primary-500/30 transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-300">
            See what our users have to say about their experience
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="glass-morphism rounded-2xl p-8 border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-300 italic">"{testimonial.content}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
        <motion.div
          className="glass-morphism-strong rounded-3xl p-12 border border-primary-500/30 bg-gradient-to-r from-primary-500/10 to-accent-400/10 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Video Production?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already discovered the power of AI-driven video editing collaboration
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => openAuthModal('register')}
              className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-400 text-white font-semibold rounded-xl relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center">
                Start Free Trial
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
            
            <motion.button
              onClick={() => openAuthModal('login')}
              className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Floating Auth Modal */}
      <FloatingAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />

      {/* Cursor Glow Effect */}
      <div
        className="pointer-events-none fixed w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full blur-xl opacity-50 z-50"
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
          transition: 'all 0.1s ease-out'
        }}
      />
    </div>
  )
}

export default LuxuryLandingPage
