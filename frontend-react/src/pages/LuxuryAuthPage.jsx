import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Briefcase
} from 'lucide-react'
import { useAuthStore } from '@store/authStore'
import toast from 'react-hot-toast'

const LuxuryAuthPage = () => {
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
  const cardRef = useRef(null)

  const { login, register } = useAuthStore()

  // Track mouse position for 3D tilt effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!cardRef.current) return
      
      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!isLogin) {
      if (!formData.name) {
        toast.error('Please enter your name')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match')
        return
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters')
        return
      }
    }

    setIsLoading(true)
    
    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password
        })
        toast.success('Welcome back!')
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
        toast.success('Account created successfully!')
      }
    } catch (error) {
      toast.error(error.message || 'Authentication failed')
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
  }

  const calculateTilt = () => {
    if (!cardRef.current) return {}
    
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = ((mousePosition.y - centerY) / centerY) * 10
    const rotateY = ((mousePosition.x - centerX) / centerX) * -10
    
    return {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: 'transform 0.1s ease-out'
    }
  }

  const FloatingShape = ({ delay, duration, size }) => (
    <motion.div
      className="absolute rounded-full bg-gradient-to-r from-primary-500/20 to-accent-400/20 blur-xl"
      style={{
        width: size,
        height: size,
      }}
      animate={{
        x: [0, 100, -100, 0],
        y: [0, -100, 100, 0],
        scale: [1, 1.2, 0.8, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )

  const InputField = ({ 
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
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        <Icon className={`w-5 h-5 transition-colors ${
          focusedField === name ? 'text-primary-400' : 'text-gray-500'
        }`} />
      </div>
      
      <input
        type={showToggle && showToggle ? 'text' : type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocusedField(name)}
        onBlur={() => setFocusedField('')}
        required={required}
        placeholder=" "
        className={`input pl-12 pr-12 w-full bg-dark-800/50 backdrop-blur-xl border ${
          focusedField === name 
            ? 'border-primary-500/50 shadow-lg shadow-primary-500/20' 
            : 'border-white/10'
        } rounded-xl transition-all duration-300`}
      />
      
      <label 
        className={`absolute left-12 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ${
          value ? '-top-6 text-xs text-primary-400' : 'text-gray-400'
        }`}
      >
        {placeholder}
      </label>
      
      {showToggle && (
        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
        >
          {showToggle ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
    </div>
  )

  const RoleToggle = () => (
    <div className="flex items-center justify-center space-x-4">
      <button
        onClick={() => setFormData({ ...formData, role: 'editor' })}
        className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
          formData.role === 'editor'
            ? 'bg-primary-500/20 border border-primary-500/50 text-primary-400'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <Film className="w-4 h-4" />
        <span>Editor</span>
      </button>
      
      <motion.div
        className="w-12 h-6 bg-dark-800/50 rounded-full relative cursor-pointer"
        onClick={() => setFormData({ 
          ...formData, 
          role: formData.role === 'editor' ? 'client' : 'editor' 
        })}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full"
          animate={{
            x: formData.role === 'editor' ? 4 : 28
          }}
          transition={{ type: 'spring', stiffness: 300 }}
        />
      </motion.div>
      
      <button
        onClick={() => setFormData({ ...formData, role: 'client' })}
        className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
          formData.role === 'client'
            ? 'bg-accent-400/20 border border-accent-400/50 text-accent-400'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <Briefcase className="w-4 h-4" />
        <span>Client</span>
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-900 overflow-hidden relative">
      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Left Side - Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600/20 via-accent-500/20 to-blue-600/20 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-400/10" />
          <FloatingShape delay={0} duration={20} size="300px" />
          <FloatingShape delay={5} duration={25} size="200px" />
          <FloatingShape delay={10} duration={30} size="150px" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-400 rounded-2xl flex items-center justify-center mr-4">
                <Film className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                ClipConnect
              </h1>
            </div>
            
            <motion.h2
              className="text-3xl font-semibold text-white mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Connect. Create. Conquer.
            </motion.h2>
            
            <motion.p
              className="text-gray-300 text-lg mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Hire top editors or become one
            </motion.p>

            <motion.div
              className="flex items-center justify-center space-x-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-400">2,847</div>
                <div className="text-sm text-gray-400">Active Editors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-400">15.2K</div>
                <div className="text-sm text-gray-400">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success">98%</div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Card */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative">
        {/* Mobile Branding */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center mr-3">
            <Film className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">ClipConnect</h1>
        </div>

        {/* Auth Card */}
        <motion.div
          ref={cardRef}
          style={calculateTilt()}
          className="w-full max-w-md glass-morphism-strong rounded-3xl p-8 border border-white/20 shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-400">
              {isLogin 
                ? 'Sign in to your ClipConnect account' 
                : 'Join the premium video editor marketplace'
              }
            </p>
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
                  <InputField
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    icon={User}
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                )}

                <InputField
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  icon={Mail}
                  value={formData.email}
                  onChange={handleInputChange}
                />

                <InputField
                  type="password"
                  name="password"
                  placeholder="Password"
                  icon={Lock}
                  showToggle={true}
                  toggleShow={() => setShowPassword(!showPassword)}
                  value={formData.password}
                  onChange={handleInputChange}
                />

                {!isLogin && (
                  <InputField
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    icon={Lock}
                    showToggle={true}
                    toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                )}

                {!isLogin && <RoleToggle />}

                {isLogin && (
                  <div className="flex items-center justify-between">
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
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-accent-400 text-white font-semibold rounded-xl relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative flex items-center justify-center">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
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

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-dark-900 text-gray-400">OR</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button className="w-full py-3 bg-dark-800/50 border border-white/10 rounded-xl flex items-center justify-center space-x-3 hover:bg-dark-800/70 transition-colors">
              <div className="w-5 h-5 bg-white rounded" />
              <span className="text-white">Continue with Google</span>
            </button>
            
            <button className="w-full py-3 bg-dark-800/50 border border-white/10 rounded-xl flex items-center justify-center space-x-3 hover:bg-dark-800/70 transition-colors">
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-black rounded-full" />
              </div>
              <span className="text-white">Continue with Apple</span>
            </button>
          </div>

          {/* Toggle Form */}
          <div className="text-center mt-8">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={toggleForm}
                className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </motion.div>

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
    </div>
  )
}

export default LuxuryAuthPage
