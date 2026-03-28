import React, { useState, useEffect } from 'react'
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
  Briefcase,
  X
} from 'lucide-react'
import { useAuthStore } from '@store/authStore'
import toast from 'react-hot-toast'

const FloatingAuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'editor'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState('')

  const { login, register } = useAuthStore()

  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

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

    if (mode === 'register') {
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
      if (mode === 'login') {
        await login({
          email: formData.email,
          password: formData.password
        })
        toast.success('Welcome back!')
        onClose()
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
        toast.success('Account created successfully!')
        onClose()
      }
    } catch (error) {
      toast.error(error.message || 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'editor'
    })
  }

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-full max-w-md mx-4 glass-morphism-strong rounded-3xl p-8 border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center mr-3">
                  <Film className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">ClipConnect</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center justify-center mb-6">
              <button
                onClick={() => switchMode('login')}
                className={`px-4 py-2 rounded-l-lg font-medium transition-all ${
                  mode === 'login'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => switchMode('register')}
                className={`px-4 py-2 rounded-r-lg font-medium transition-all ${
                  mode === 'register'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {mode === 'register' && (
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

                  {mode === 'register' && (
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

                  {mode === 'register' && <RoleToggle />}
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
                      {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                    </>
                  ) : (
                    <>
                      {mode === 'login' ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </motion.button>
            </form>

            {/* Social Login */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-dark-900 text-gray-400">OR</span>
                </div>
              </div>

              <button className="w-full py-3 bg-dark-800/50 border border-white/10 rounded-xl flex items-center justify-center space-x-3 hover:bg-dark-800/70 transition-colors">
                <div className="w-5 h-5 bg-white rounded" />
                <span className="text-white">Continue with Google</span>
              </button>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-400">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default FloatingAuthModal
