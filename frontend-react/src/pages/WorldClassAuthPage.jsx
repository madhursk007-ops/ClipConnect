import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  ArrowRight,
  Sparkles,
  Zap,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  Film,
  Briefcase,
  X,
  Star,
  Shield,
  Clock,
  Users,
  Video,
  Edit3,
  Timeline,
  Scissors
} from 'lucide-react'
import { useAuthStore } from '@store/authStore'
import toast from 'react-hot-toast'

const WorldClassAuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'editor',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState('')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const cardRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10])
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10])

  const { login, register } = useAuthStore()

  // Track mouse position for 3D tilt effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!cardRef.current) return
      
      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      mouseX.set(x)
      mouseY.set(y)
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields')
      return
    }

    if (!isLogin) {
      if (!formData.name) {
        setError('Please enter your name')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
    }

    setIsLoading(true)
    setError('')
    
    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password
        })
        setIsSuccess(true)
        toast.success('Welcome back!')
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
        setIsSuccess(true)
        toast.success('Account created successfully!')
      }
    } catch (error) {
      setError(error.message || 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleForm = () => {
    setIsLogin(!isLogin)
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'editor',
      rememberMe: false
    })
    setError('')
  }

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

  const PremiumInput = ({ 
    type, 
    name, 
    placeholder, 
    icon: Icon, 
    required = true,
    showToggle = false,
    toggleShow = null,
    value,
    onChange
  }) => (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        <Icon className={`w-5 h-5 transition-all duration-300 ${
          focusedField === name 
            ? 'text-primary-400 scale-110' 
            : 'text-gray-500 group-hover:text-gray-400'
        }`} />
      </div>
      
      <motion.input
        type={showToggle && showToggle ? 'text' : type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocusedField(name)}
        onBlur={() => setFocusedField('')}
        required={required}
        placeholder=" "
        className={`w-full pl-12 pr-12 py-4 bg-dark-800/30 backdrop-blur-xl border rounded-2xl transition-all duration-300 outline-none ${
          focusedField === name 
            ? 'border-primary-500/50 shadow-lg shadow-primary-500/20 bg-dark-800/50' 
            : 'border-white/10 hover:border-white/20'
        }`}
        whileFocus={{ scale: 1.02 }}
      />
      
      <motion.label 
        className={`absolute left-12 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ${
          value ? '-top-6 text-xs text-primary-400' : 'text-gray-400'
        }`}
        animate={{
          y: value ? -20 : 0,
          scale: value ? 0.85 : 1
        }}
      >
        {placeholder}
      </motion.label>
      
      {showToggle && (
        <motion.button
          type="button"
          onClick={toggleShow}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {showToggle ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </motion.button>
      )}
    </div>
  )

  const AnimatedRoleToggle = () => (
    <div className="flex items-center justify-center space-x-2">
      <motion.button
        onClick={() => setFormData({ ...formData, role: 'editor' })}
        className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all font-medium ${
          formData.role === 'editor'
            ? 'bg-gradient-to-r from-primary-500/20 to-accent-400/20 border border-primary-500/50 text-primary-400 shadow-lg shadow-primary-500/20'
            : 'text-gray-400 hover:text-white border border-transparent'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Film className="w-4 h-4" />
        <span>Editor</span>
      </motion.button>
      
      <motion.div
        className="w-16 h-8 bg-dark-800/50 backdrop-blur-xl rounded-full relative cursor-pointer border border-white/10"
        onClick={() => setFormData({ 
          ...formData, 
          role: formData.role === 'editor' ? 'client' : 'editor' 
        })}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute top-1 w-6 h-6 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full shadow-lg"
          animate={{
            x: formData.role === 'editor' ? 4 : 36
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        />
      </motion.div>
      
      <motion.button
        onClick={() => setFormData({ ...formData, role: 'client' })}
        className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all font-medium ${
          formData.role === 'client'
            ? 'bg-gradient-to-r from-accent-400/20 to-blue-500/20 border border-accent-400/50 text-accent-400 shadow-lg shadow-accent-400/20'
            : 'text-gray-400 hover:text-white border border-transparent'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Briefcase className="w-4 h-4" />
        <span>Client</span>
      </motion.button>
    </div>
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
      <div className="absolute inset-0">
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
        {[...Array(20)].map((_, i) => (
          <Particle key={i} delay={i * 0.5} duration={3 + Math.random() * 2} />
        ))}
      </div>

      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3Cfilter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Left Panel - Immersive Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-accent-600/10" />
        
        {/* Floating UI Elements */}
        <motion.div
          className="absolute top-20 left-20"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <div className="w-20 h-20 bg-gradient-to-r from-primary-500/20 to-accent-400/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10">
            <Video className="w-10 h-10 text-primary-400" />
          </div>
        </motion.div>

        <motion.div
          className="absolute top-40 right-20"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-accent-400/20 to-blue-500/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/10">
            <Edit3 className="w-8 h-8 text-accent-400" />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-40 left-32"
          animate={{
            y: [0, 15, 0],
            rotate: [0, 3, -3, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
        >
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10">
            <Timeline className="w-12 h-12 text-purple-400" />
          </div>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
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
              <h1 className="text-6xl font-bold bg-gradient-to-r from-primary-400 via-accent-400 to-blue-400 bg-clip-text text-transparent">
                ClipConnect
              </h1>
            </div>
            
            <motion.h2
              className="text-5xl font-bold text-white mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <TypingAnimation text="Connect. Create. Conquer." className="inline-block" />
            </motion.h2>
            
            <motion.p
              className="text-xl text-gray-300 mb-12 max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              The premium marketplace connecting top video editors with brands that need exceptional content
            </motion.p>

            <motion.div
              className="grid grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-400 mb-2">2,847</div>
                <div className="text-gray-400">Active Editors</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent-400 mb-2">15.2K</div>
                <div className="text-gray-400">Projects Completed</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form Experience */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative">
        {/* Mobile Branding */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center z-10">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-2xl flex items-center justify-center mr-3">
            <Film className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">ClipConnect</h1>
        </div>

        {/* Glassmorphic Auth Card */}
        <motion.div
          ref={cardRef}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d'
          }}
          className="w-full max-w-md glass-morphism-strong rounded-3xl p-10 border border-white/20 shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
        >
          {/* Inner Light Reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
          
          {/* Header */}
          <div className="text-center mb-10">
            <motion.h2
              className="text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </motion.h2>
            <motion.p
              className="text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {isLogin 
                ? 'Sign in to your ClipConnect account' 
                : 'Join the premium video editor marketplace'
              }
            </motion.p>
          </div>

          {/* Animated Tab Switch */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="flex items-center bg-dark-800/30 backdrop-blur-xl rounded-2xl p-1 border border-white/10">
                <button
                  onClick={() => toggleForm()}
                  className={`px-6 py-3 rounded-xl font-medium transition-all z-10 relative ${
                    isLogin
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => toggleForm()}
                  className={`px-6 py-3 rounded-xl font-medium transition-all z-10 relative ${
                    !isLogin
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>
              
              <motion.div
                className="absolute inset-1 bg-gradient-to-r from-primary-500/20 to-accent-400/20 rounded-xl border border-primary-500/30"
                animate={{
                  x: isLogin ? 0 : '100%'
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <PremiumInput
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      icon={User}
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <PremiumInput
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    icon={Mail}
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <PremiumInput
                    type="password"
                    name="password"
                    placeholder="Password"
                    icon={Lock}
                    showToggle={true}
                    toggleShow={() => setShowPassword(!showPassword)}
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </motion.div>

                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <PremiumInput
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      icon={Lock}
                      showToggle={true}
                      toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </motion.div>
                )}

                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <AnimatedRoleToggle />
                  </motion.div>
                )}

                {isLogin && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-between"
                  >
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                        className="w-4 h-4 rounded border-white/20 bg-dark-800/50 text-primary-500 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-400">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                      Forgot password?
                    </a>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-error/10 border border-error/30 rounded-xl flex items-center space-x-2"
                >
                  <AlertCircle className="w-4 h-4 text-error" />
                  <span className="text-error text-sm">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full py-4 bg-gradient-to-r from-primary-500 via-accent-400 to-blue-500 text-white font-semibold rounded-2xl relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated Gradient Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary-600 via-accent-500 to-blue-600"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Glow Pulse Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 opacity-0 group-hover:opacity-20"
                animate={{
                  opacity: [0, 0.2, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <div className="relative flex items-center justify-center">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Success!
                  </>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </motion.button>
          </form>

          {/* Animated Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <motion.div
                className="w-full border-t border-white/10"
                animate={{
                  background: [
                    'linear-gradient(to right, transparent, rgba(127, 90, 240, 0.5), transparent)',
                    'linear-gradient(to right, transparent, rgba(44, 185, 255, 0.5), transparent)',
                    'linear-gradient(to right, transparent, rgba(127, 90, 240, 0.5), transparent)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-dark-900/50 backdrop-blur-xl text-gray-400">OR</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <motion.button
              className="w-full py-3 bg-dark-800/30 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center space-x-3 hover:bg-dark-800/50 transition-all hover:border-white/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-5 h-5 bg-white rounded" />
              <span className="text-white">Continue with Google</span>
            </motion.button>
            
            <motion.button
              className="w-full py-3 bg-dark-800/30 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center space-x-3 hover:bg-dark-800/50 transition-all hover:border-white/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-black rounded-full" />
              </div>
              <span className="text-white">Continue with Apple</span>
            </motion.button>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={toggleForm}
                className="text-primary-400 hover:text-primary-300 font-semibold transition-colors relative"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-primary-400"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </button>
            </p>
          </div>
        </motion.div>

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
    </div>
  )
}

export default WorldClassAuthPage
