import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  ArrowRight,
  Film,
  Briefcase,
  Loader2,
  CheckCircle,
  AlertCircle,
  Video,
  Edit3,
  Scissors,
  Monitor,
  Sparkles
} from 'lucide-react'
import { useAuthStore } from '@store/authStore'
import toast from 'react-hot-toast'

const PremiumLoginPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'editor',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState('')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const cardRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [6, -6]), { stiffness: 100, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-6, 6]), { stiffness: 100, damping: 30 })

  const { login, register } = useAuthStore()

  // Mouse tracking for 3D tilt
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
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields')
      return
    }

    if (!isLogin) {
      if (!formData.name) { setError('Please enter your name'); return }
      if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return }
      if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return }
    }

    setIsLoading(true)
    setError('')
    
    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password })
        setIsSuccess(true)
        toast.success('Welcome back!')
      } else {
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          firstName: formData.firstName,
          lastName: formData.lastName
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
    setFormData({ username: '', firstName: '', lastName: '', email: '', password: '', confirmPassword: '', role: 'editor', rememberMe: false })
    setError('')
  }

  // Floating Orb Component
  const FloatingOrb = ({ delay, duration, size, color, className = '' }) => (
    <motion.div
      className={`absolute rounded-full ${className}`}
      style={{ width: size, height: size, background: color, filter: 'blur(60px)' }}
      animate={{
        x: [0, 60, -60, 0],
        y: [0, -60, 60, 0],
        scale: [1, 1.2, 0.9, 1],
        opacity: [0.3, 0.6, 0.3, 0.6]
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  )

  // Particle Component
  const Particle = ({ delay, duration, x, y }) => (
    <motion.div
      className="absolute w-0.5 h-0.5 bg-white/30 rounded-full"
      style={{ left: x, top: y }}
      animate={{ y: [0, -100, 0], opacity: [0, 1, 0], scale: [0, 1, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeOut" }}
    />
  )

  return (
    <div className="min-h-screen bg-[#0B0B0F] overflow-hidden relative font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7F5AF0]/10 via-[#0B0B0F] to-[#2CB9FF]/10" />
        
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse at 20% 20%, rgba(127, 90, 240, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(44, 185, 255, 0.15) 0%, transparent 50%)',
              'radial-gradient(ellipse at 80% 20%, rgba(44, 185, 255, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(127, 90, 240, 0.15) 0%, transparent 50%)',
              'radial-gradient(ellipse at 20% 20%, rgba(127, 90, 240, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(44, 185, 255, 0.15) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <FloatingOrb delay={0} duration={20} size="300px" color="rgba(127, 90, 240, 0.4)" className="top-0 left-0" />
        <FloatingOrb delay={5} duration={25} size="250px" color="rgba(44, 185, 255, 0.4)" className="bottom-0 right-0" />
        <FloatingOrb delay={10} duration={30} size="200px" color="rgba(147, 51, 234, 0.3)" className="top-1/3 left-1/3" />
        
        {[...Array(20)].map((_, i) => (
          <Particle key={i} delay={i * 0.5} duration={3 + Math.random() * 2} x={`${Math.random() * 100}%`} y={`${Math.random() * 100}%`} />
        ))}
      </div>

      {/* Noise Overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7F5AF0]/10 via-transparent to-[#2CB9FF]/10" />
        
        {/* Floating Icons */}
        <motion.div className="absolute top-20 left-20" animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 8, repeat: Infinity }}>
          <div className="w-20 h-20 bg-gradient-to-r from-[#7F5AF0]/30 to-[#2CB9FF]/30 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
            <Video className="w-10 h-10 text-[#7F5AF0]" />
          </div>
        </motion.div>

        <motion.div className="absolute top-32 right-24" animate={{ y: [0, 18, 0], rotate: [0, -5, 5, 0] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }}>
          <div className="w-16 h-16 bg-gradient-to-r from-[#2CB9FF]/30 to-[#7F5AF0]/30 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20">
            <Edit3 className="w-8 h-8 text-[#2CB9FF]" />
          </div>
        </motion.div>

        <motion.div className="absolute bottom-40 left-28" animate={{ y: [0, 12, 0], rotate: [0, 3, -3, 0] }} transition={{ duration: 9, repeat: Infinity, delay: 1 }}>
          <div className="w-24 h-24 bg-gradient-to-r from-[#7F5AF0]/25 to-[#2CB9FF]/25 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
            <Scissors className="w-12 h-12 text-[#7F5AF0]" />
          </div>
        </motion.div>

        <motion.div className="absolute bottom-28 right-20" animate={{ y: [0, -10, 0], rotate: [0, -3, 3, 0] }} transition={{ duration: 7, repeat: Infinity, delay: 3 }}>
          <div className="w-16 h-16 bg-gradient-to-r from-[#2CB9FF]/25 to-[#7F5AF0]/25 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20">
            <Monitor className="w-8 h-8 text-[#2CB9FF]" />
          </div>
        </motion.div>

        {/* Brand Content */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <div className="flex items-center justify-center mb-8">
              <motion.div className="w-20 h-20 bg-gradient-to-r from-[#7F5AF0] to-[#2CB9FF] rounded-2xl flex items-center justify-center mr-4 shadow-2xl shadow-[#7F5AF0]/40"
                animate={{ rotate: [0, 360] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}>
                <Film className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-[#7F5AF0] via-[#2CB9FF] to-[#7F5AF0] bg-clip-text text-transparent">
                ClipConnect
              </h1>
            </div>
            
            <motion.h2 className="text-4xl font-bold text-white mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              Connect. Create. Conquer.
            </motion.h2>
            
            <motion.p className="text-lg text-gray-300 mb-8 max-w-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              The premium marketplace connecting top video editors with brands that need exceptional content
            </motion.p>

            <motion.div className="grid grid-cols-2 gap-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#7F5AF0]">2,847</div>
                <div className="text-gray-400">Active Editors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#2CB9FF]">15.2K</div>
                <div className="text-gray-400">Projects Completed</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
        {/* Mobile Branding */}
        <div className="lg:hidden absolute top-6 left-6 flex items-center z-10">
          <motion.div className="w-12 h-12 bg-gradient-to-r from-[#7F5AF0] to-[#2CB9FF] rounded-xl flex items-center justify-center mr-3"
            animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
            <Film className="w-6 h-6 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white">ClipConnect</h1>
        </div>

        {/* Auth Card */}
        <motion.div
          ref={cardRef}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="w-full max-w-md backdrop-blur-2xl bg-white/[0.03] rounded-3xl p-8 lg:p-10 border border-white/20 shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
        >
          {/* Gradient Border */}
          <motion.div
            className="absolute inset-0 rounded-3xl p-[1px]"
            animate={{
              background: [
                'linear-gradient(135deg, rgba(127, 90, 240, 0.3) 0%, rgba(44, 185, 255, 0.3) 50%, rgba(127, 90, 240, 0.3) 100%)',
                'linear-gradient(135deg, rgba(44, 185, 255, 0.3) 0%, rgba(127, 90, 240, 0.3) 50%, rgba(44, 185, 255, 0.3) 100%)',
                'linear-gradient(135deg, rgba(127, 90, 240, 0.3) 0%, rgba(44, 185, 255, 0.3) 50%, rgba(127, 90, 240, 0.3) 100%)'
              ]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <motion.h2 className="text-3xl font-bold text-white mb-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </motion.h2>
            <motion.p className="text-gray-400" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              {isLogin ? 'Sign in to your account' : 'Join the premium video editor marketplace'}
            </motion.p>
          </div>

          {/* Tab Switch */}
          <div className="flex items-center justify-center mb-8 relative z-10">
            <div className="relative bg-[#0B0B0F]/50 backdrop-blur-xl rounded-2xl p-1 border border-white/10">
              <div className="flex items-center">
                <button onClick={() => setIsLogin(true)} className={`px-6 py-3 rounded-xl font-medium transition-all z-10 relative ${isLogin ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                  Sign In
                </button>
                <button onClick={() => setIsLogin(false)} className={`px-6 py-3 rounded-xl font-medium transition-all z-10 relative ${!isLogin ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                  Sign Up
                </button>
              </div>
              <motion.div className="absolute inset-1 bg-gradient-to-r from-[#7F5AF0]/30 to-[#2CB9FF]/30 rounded-xl border border-[#7F5AF0]/30"
                animate={{ x: isLogin ? 0 : '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div key={isLogin ? 'login' : 'register'} initial={{ opacity: 0, x: isLogin ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isLogin ? 20 : -20 }} transition={{ duration: 0.3 }} className="space-y-5">
                
                {!isLogin && (
                  <>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                          <User className={`w-5 h-5 transition-all ${focusedField === 'username' ? 'text-[#7F5AF0]' : 'text-gray-500'}`} />
                        </div>
                        <input type="text" name="username" value={formData.username} onChange={handleInputChange} onFocus={() => setFocusedField('username')} onBlur={() => setFocusedField('')} placeholder="Username" required={!isLogin}
                          className={`w-full pl-12 pr-4 py-4 bg-[#0B0B0F]/40 backdrop-blur-xl border rounded-xl text-white placeholder-gray-400 transition-all outline-none ${focusedField === 'username' ? 'border-[#7F5AF0]/50 shadow-lg shadow-[#7F5AF0]/20' : 'border-white/10'}`} />
                      </div>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4">
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                            <User className={`w-5 h-5 transition-all ${focusedField === 'firstName' ? 'text-[#7F5AF0]' : 'text-gray-500'}`} />
                          </div>
                          <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} onFocus={() => setFocusedField('firstName')} onBlur={() => setFocusedField('')} placeholder="First Name" required={!isLogin}
                            className={`w-full pl-12 pr-4 py-4 bg-[#0B0B0F]/40 backdrop-blur-xl border rounded-xl text-white placeholder-gray-400 transition-all outline-none ${focusedField === 'firstName' ? 'border-[#7F5AF0]/50 shadow-lg shadow-[#7F5AF0]/20' : 'border-white/10'}`} />
                        </div>
                      </motion.div>

                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                            <User className={`w-5 h-5 transition-all ${focusedField === 'lastName' ? 'text-[#7F5AF0]' : 'text-gray-500'}`} />
                          </div>
                          <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} onFocus={() => setFocusedField('lastName')} onBlur={() => setFocusedField('')} placeholder="Last Name" required={!isLogin}
                            className={`w-full pl-12 pr-4 py-4 bg-[#0B0B0F]/40 backdrop-blur-xl border rounded-xl text-white placeholder-gray-400 transition-all outline-none ${focusedField === 'lastName' ? 'border-[#7F5AF0]/50 shadow-lg shadow-[#7F5AF0]/20' : 'border-white/10'}`} />
                        </div>
                      </motion.div>
                    </div>
                  </>
                )}

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <Mail className={`w-5 h-5 transition-all ${focusedField === 'email' ? 'text-[#7F5AF0]' : 'text-gray-500'}`} />
                    </div>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField('')} placeholder="Email Address" required
                      className={`w-full pl-12 pr-4 py-4 bg-[#0B0B0F]/40 backdrop-blur-xl border rounded-xl text-white placeholder-gray-400 transition-all outline-none ${focusedField === 'email' ? 'border-[#7F5AF0]/50 shadow-lg shadow-[#7F5AF0]/20' : 'border-white/10'}`} />
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <Lock className={`w-5 h-5 transition-all ${focusedField === 'password' ? 'text-[#7F5AF0]' : 'text-gray-500'}`} />
                    </div>
                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField('')} placeholder="Password" required
                      className={`w-full pl-12 pr-12 py-4 bg-[#0B0B0F]/40 backdrop-blur-xl border rounded-xl text-white placeholder-gray-400 transition-all outline-none ${focusedField === 'password' ? 'border-[#7F5AF0]/50 shadow-lg shadow-[#7F5AF0]/20' : 'border-white/10'}`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>

                {!isLogin && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                        <Lock className={`w-5 h-5 transition-all ${focusedField === 'confirmPassword' ? 'text-[#7F5AF0]' : 'text-gray-500'}`} />
                      </div>
                      <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} onFocus={() => setFocusedField('confirmPassword')} onBlur={() => setFocusedField('')} placeholder="Confirm Password" required={!isLogin}
                        className={`w-full pl-12 pr-12 py-4 bg-[#0B0B0F]/40 backdrop-blur-xl border rounded-xl text-white placeholder-gray-400 transition-all outline-none ${focusedField === 'confirmPassword' ? 'border-[#7F5AF0]/50 shadow-lg shadow-[#7F5AF0]/20' : 'border-white/10'}`} />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Role Toggle */}
                {!isLogin && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex items-center justify-center space-x-4">
                    <motion.button type="button" onClick={() => setFormData({ ...formData, role: 'editor' })}
                      className={`flex items-center space-x-2 px-5 py-3 rounded-xl transition-all font-medium ${formData.role === 'editor' ? 'bg-gradient-to-r from-[#7F5AF0]/20 to-[#2CB9FF]/20 border border-[#7F5AF0]/50 text-[#7F5AF0] shadow-lg shadow-[#7F5AF0]/20' : 'text-gray-400 border border-transparent'}`}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Film className="w-4 h-4" />
                      <span>Editor</span>
                    </motion.button>
                    
                    <div className="w-14 h-7 bg-[#0B0B0F]/60 rounded-full relative cursor-pointer border border-white/10" onClick={() => setFormData({ ...formData, role: formData.role === 'editor' ? 'client' : 'editor' })}>
                      <motion.div className="absolute top-1 w-5 h-5 bg-gradient-to-r from-[#7F5AF0] to-[#2CB9FF] rounded-full shadow-lg"
                        animate={{ x: formData.role === 'editor' ? 4 : 34 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} />
                    </div>
                    
                    <motion.button type="button" onClick={() => setFormData({ ...formData, role: 'client' })}
                      className={`flex items-center space-x-2 px-5 py-3 rounded-xl transition-all font-medium ${formData.role === 'client' ? 'bg-gradient-to-r from-[#2CB9FF]/20 to-[#7F5AF0]/20 border border-[#2CB9FF]/50 text-[#2CB9FF] shadow-lg shadow-[#2CB9FF]/20' : 'text-gray-400 border border-transparent'}`}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Briefcase className="w-4 h-4" />
                      <span>Client</span>
                    </motion.button>
                  </motion.div>
                )}

                {isLogin && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" checked={formData.rememberMe} onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                        className="w-4 h-4 rounded border-white/20 bg-[#0B0B0F]/50 text-[#7F5AF0]" />
                      <span className="text-sm text-gray-400">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-[#7F5AF0] hover:text-[#2CB9FF] transition-colors">Forgot password?</a>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -10, x: 0 }} animate={{ opacity: 1, y: 0, x: [0, -10, 10, -5, 5, 0] }} exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-sm">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button type="submit" disabled={isLoading || isSuccess}
              className="w-full py-4 bg-gradient-to-r from-[#7F5AF0] via-[#2CB9FF] to-[#7F5AF0] text-white font-semibold rounded-xl relative overflow-hidden group"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <motion.div className="absolute inset-0 bg-gradient-to-r from-[#7F5AF0] via-[#2CB9FF] to-[#7F5AF0]"
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} style={{ backgroundSize: '200% 200%' }} />
              <div className="relative flex items-center justify-center">
                {isLoading ? (
                  <><Loader2 className="w-5 h-5 animate-spin mr-2" />{isLogin ? 'Signing in...' : 'Creating account...'}</>
                ) : isSuccess ? (
                  <><CheckCircle className="w-5 h-5 mr-2" />Success!</>
                ) : (
                  <>{isLogin ? 'Sign In' : 'Create Account'}<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></>
                )}
              </div>
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-8 z-10">
            <div className="absolute inset-0 flex items-center">
              <motion.div className="w-full h-px" animate={{ background: ['linear-gradient(to right, transparent, rgba(127, 90, 240, 0.5), transparent)', 'linear-gradient(to right, transparent, rgba(44, 185, 255, 0.5), transparent)', 'linear-gradient(to right, transparent, rgba(127, 90, 240, 0.5), transparent)'] }} transition={{ duration: 3, repeat: Infinity }} />
            </div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-[#0B0B0F] text-gray-400">OR</span></div>
          </div>

          {/* Social Login */}
          <div className="space-y-3 relative z-10">
            <motion.button className="w-full py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center space-x-3 hover:bg-white/10 transition-all" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <div className="w-5 h-5 bg-white rounded" />
              <span className="text-white">Continue with Google</span>
            </motion.button>
            <motion.button className="w-full py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center space-x-3 hover:bg-white/10 transition-all" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center"><div className="w-3 h-3 bg-black rounded-full" /></div>
              <span className="text-white">Continue with Apple</span>
            </motion.button>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 relative z-10">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button onClick={toggleForm} className="text-[#7F5AF0] hover:text-[#2CB9FF] font-semibold transition-colors relative">
                {isLogin ? 'Sign up' : 'Sign in'}
                <motion.div className="absolute -bottom-1 left-0 h-0.5 bg-[#7F5AF0]" initial={{ width: 0 }} whileHover={{ width: '100%' }} transition={{ duration: 0.3 }} />
              </button>
            </p>
          </div>
        </motion.div>

        {/* Cursor Glow */}
        <motion.div className="pointer-events-none fixed w-12 h-12 rounded-full blur-xl z-50"
          style={{ left: mousePosition.x - 24, top: mousePosition.y - 24, background: 'radial-gradient(circle, rgba(127, 90, 240, 0.3) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
      </div>
    </div>
  )
}

export default PremiumLoginPage
