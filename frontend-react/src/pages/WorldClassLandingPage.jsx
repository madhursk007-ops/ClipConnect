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
  ArrowRight,
  Shield,
  Rocket,
  Award,
  Target
} from 'lucide-react'
import WorldClassAuthPage from './WorldClassAuthPage'

const WorldClassLandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)

  // Track mouse position for cursor glow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const openAuthModal = (mode) => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Matching',
      description: 'Our intelligent algorithm connects you with the perfect editor for your project using advanced machine learning',
      gradient: 'from-primary-500 to-accent-400',
      stats: '95% Match Accuracy'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Find and hire top editors in minutes, not days. Our streamlined process gets you started instantly.',
      gradient: 'from-accent-400 to-blue-500',
      stats: '2-Minute Setup'
    },
    {
      icon: Shield,
      title: 'Premium Quality',
      description: 'Only the best video editors with proven track records and verified credentials.',
      gradient: 'from-blue-500 to-purple-500',
      stats: 'Top 1% Talent'
    },
    {
      icon: Target,
      title: 'Smart Analytics',
      description: 'Track performance, optimize workflows, and make data-driven decisions with our advanced analytics.',
      gradient: 'from-purple-500 to-pink-500',
      stats: 'Real-time Insights'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CEO, TechCorp',
      content: 'ClipConnect transformed our video production. The AI matching found us the perfect editor instantly.',
      rating: 5,
      avatar: '/avatars/sarah.jpg',
      company: 'Fortune 500'
    },
    {
      name: 'Marcus Johnson',
      role: 'Video Editor',
      content: 'As an editor, ClipConnect has tripled my client base. The platform is professional and reliable.',
      rating: 5,
      avatar: '/avatars/marcus.jpg',
      company: 'Top Rated'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Marketing Director',
      content: 'The quality of editors on this platform is unmatched. Highly recommend for premium brands.',
      rating: 5,
      avatar: '/avatars/elena.jpg',
      company: 'Global Brand'
    }
  ]

  const stats = [
    { value: '2,847', label: 'Active Editors', icon: Users, growth: '+23%' },
    { value: '15.2K', label: 'Projects Completed', icon: Film, growth: '+45%' },
    { value: '98%', label: 'Success Rate', icon: Star, growth: '+5%' },
    { value: '$2.4M', label: 'Total Earnings', icon: Zap, growth: '+67%' }
  ]

  const FloatingOrb = ({ delay, duration, size, color, className = '' }) => (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      style={{
        width: size,
        height: size,
        background: color
      }}
      animate={{
        x: [0, 100, -100, 0],
        y: [0, -100, 100, 0],
        scale: [1, 1.2, 0.8, 1],
        opacity: [0.3, 0.6, 0.3, 0.6]
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )

  const Particle = ({ delay, duration }) => (
    <motion.div
      className="absolute w-1 h-1 bg-white rounded-full"
      animate={{
        x: [0, Math.random() * 200 - 100],
        y: [0, -100, 0],
        opacity: [0, 1, 0]
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )

  const TypingAnimation = ({ text, className = '' }) => {
    const [displayedText, setDisplayedText] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(prev => prev + text[currentIndex])
          setCurrentIndex(prev => prev + 1)
        }, 100)
        return () => clearTimeout(timeout)
      }
    }, [currentIndex, text])

    return (
      <span className={className}>
        {displayedText}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-primary-400"
        >
          |
        </motion.span>
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 overflow-hidden relative">
      {/* Dynamic Background System */}
      <div className="fixed inset-0">
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-dark-900 to-accent-900/20" />
        
        {/* Animated Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-primary-600/10 via-transparent to-accent-600/10"
          animate={{
            background: [
              'linear-gradient(to top right, rgba(127, 90, 240, 0.1), transparent, rgba(44, 185, 255, 0.1))',
              'linear-gradient(to bottom right, rgba(44, 185, 255, 0.1), transparent, rgba(127, 90, 240, 0.1))',
              'linear-gradient(to top right, rgba(127, 90, 240, 0.1), transparent, rgba(44, 185, 255, 0.1))'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating Orbs */}
        <FloatingOrb delay={0} duration={20} size="400px" color="rgba(127, 90, 240, 0.3)" className="top-10 left-10" />
        <FloatingOrb delay={5} duration={25} size="300px" color="rgba(44, 185, 255, 0.3)" className="bottom-10 right-10" />
        <FloatingOrb delay={10} duration={30} size="250px" color="rgba(147, 51, 234, 0.3)" className="top-1/2 left-1/2" />
        
        {/* Particle System */}
        {[...Array(30)].map((_, i) => (
          <Particle key={i} delay={i * 0.3} duration={3 + Math.random() * 2} />
        ))}
      </div>

      {/* Noise Texture Overlay */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3Cfilter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Parallax Elements */}
        <motion.div
          className="absolute top-20 left-20"
          animate={{
            y: scrollY * 0.1
          }}
        >
          <div className="w-24 h-24 bg-gradient-to-r from-primary-500/20 to-accent-400/20 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/10">
            <Rocket className="w-12 h-12 text-primary-400" />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-20"
          animate={{
            y: scrollY * -0.1
          }}
        >
          <div className="w-20 h-20 bg-gradient-to-r from-accent-400/20 to-blue-500/20 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/10">
            <Award className="w-10 h-10 text-accent-400" />
          </div>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center justify-center mb-12">
              <motion.div
                className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-400 rounded-3xl flex items-center justify-center mr-6 shadow-2xl shadow-primary-500/30"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Film className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary-400 via-accent-400 to-blue-400 bg-clip-text text-transparent">
                ClipConnect
              </h1>
            </div>
            
            <motion.h2
              className="text-5xl lg:text-6xl font-bold text-white mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <TypingAnimation text="Connect. Create. Conquer." className="inline-block" />
            </motion.h2>
            
            <motion.p
              className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              The premium marketplace connecting top video editors with brands that need exceptional content
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <motion.button
                onClick={() => openAuthModal('register')}
                className="group px-10 py-5 bg-gradient-to-r from-primary-500 via-accent-400 to-blue-500 text-white font-bold text-lg rounded-2xl relative overflow-hidden shadow-2xl shadow-primary-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated Gradient Background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-600 via-accent-500 to-blue-600"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                
                <div className="relative flex items-center">
                  Get Started
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                </div>
              </motion.button>
              
              <motion.button
                onClick={() => openAuthModal('login')}
                className="px-10 py-5 border border-white/20 text-white font-bold text-lg rounded-2xl hover:bg-white/10 transition-all flex items-center backdrop-blur-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 + index * 0.1 }}
              >
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className="w-5 h-5 text-primary-400 mr-2" />
                  <div className="text-4xl lg:text-5xl font-bold text-primary-400">{stat.value}</div>
                </div>
                <div className="text-gray-400 mb-1">{stat.label}</div>
                <div className="text-success text-sm font-medium">{stat.growth}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Why Choose ClipConnect?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the future of video editing collaboration with our AI-powered platform
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glass-morphism-strong rounded-3xl p-8 border border-white/10 hover:border-primary-500/30 transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                <feature.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300 mb-4">{feature.description}</p>
              <div className="text-primary-400 font-semibold">{feature.stats}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
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
              className="glass-morphism-strong rounded-3xl p-8 border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">{testimonial.name}</h4>
                  <p className="text-gray-400">{testimonial.role}</p>
                  <p className="text-primary-400 text-sm font-medium">{testimonial.company}</p>
                </div>
              </div>
              
              <div className="flex mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-300 text-lg italic">"{testimonial.content}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
        <motion.div
          className="glass-morphism-strong rounded-3xl p-16 border border-primary-500/30 bg-gradient-to-r from-primary-500/10 to-accent-400/10 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-8">
            Ready to Transform Your Video Production?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of professionals who have already discovered the power of AI-driven video editing collaboration
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.button
              onClick={() => openAuthModal('register')}
              className="group px-10 py-5 bg-gradient-to-r from-primary-500 via-accent-400 to-blue-500 text-white font-bold text-lg rounded-2xl relative overflow-hidden shadow-2xl shadow-primary-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary-600 via-accent-500 to-blue-600"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <div className="relative flex items-center">
                Start Free Trial
                <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </div>
            </motion.button>
            
            <motion.button
              onClick={() => openAuthModal('login')}
              className="px-10 py-5 border border-white/20 text-white font-bold text-lg rounded-2xl hover:bg-white/10 transition-all backdrop-blur-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* World Class Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-full max-w-6xl h-[90vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <WorldClassAuthPage />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cursor Glow Effect */}
      <div
        className="pointer-events-none fixed w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full blur-2xl opacity-30 z-50"
        style={{
          left: mousePosition.x - 24,
          top: mousePosition.y - 24,
          transition: 'all 0.15s ease-out'
        }}
      />
    </div>
  )
}

export default WorldClassLandingPage
