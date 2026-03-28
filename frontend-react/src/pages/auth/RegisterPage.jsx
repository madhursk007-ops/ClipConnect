import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle,
  Upload,
  Camera,
  Building,
  Palette
} from 'lucide-react'
import { useAuthStore } from '@store/authStore'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register: registerUser } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState('client')
  const [isSuccess, setIsSuccess] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const [step, setStep] = useState(1)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger
  } = useForm({
    defaultValues: {
      role: 'client'
    }
  })

  const password = watch('password')

  const registerMutation = useMutation(
    async (data) => {
      const userData = {
        ...data,
        role: selectedRole,
        avatar: avatar
      }
      const response = await registerUser(userData)
      return response
    },
    {
      onSuccess: (data) => {
        setIsSuccess(true)
        toast.success('Account created successfully! Redirecting...')
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Registration failed. Please try again.'
        toast.error(message)
      }
    }
  )

  const onSubmit = (data) => {
    registerMutation.mutate(data)
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
  }

  const nextStep = async () => {
    const fields = step === 1 ? ['firstName', 'lastName', 'email'] : ['password', 'confirmPassword']
    const isValid = await trigger(fields)
    if (isValid) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 to-dark-800"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl font-heading font-bold mb-4">Welcome to ClipConnect!</h2>
          <p className="text-gray-400 mb-8">Account created successfully. Redirecting to dashboard...</p>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 to-dark-800 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-primary-500/10 to-accent-400/10 blur-3xl"
            style={{
              width: `${Math.random() * 400 + 200}px`,
              height: `${Math.random() * 400 + 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${20 + i * 5}s ease-in-out infinite`,
              animationDelay: `${i * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold font-heading">ClipConnect</span>
            </div>
            <h1 className="text-3xl font-heading font-bold mb-2">Create Account</h1>
            <p className="text-gray-400">Join our community of creators and editors</p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step >= s
                      ? 'bg-gradient-to-r from-primary-500 to-accent-400 text-white'
                      : 'bg-dark-800 text-gray-400'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-colors ${
                      step > s ? 'bg-gradient-to-r from-primary-500 to-accent-400' : 'bg-dark-800'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-morphism-strong rounded-2xl p-8 border border-white/20"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        {...register('firstName', {
                          required: 'First name is required',
                          minLength: {
                            value: 2,
                            message: 'First name must be at least 2 characters'
                          }
                        })}
                        type="text"
                        className={`input ${errors.firstName ? 'input-error' : ''}`}
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="text-error text-sm mt-1">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        {...register('lastName', {
                          required: 'Last name is required',
                          minLength: {
                            value: 2,
                            message: 'Last name must be at least 2 characters'
                          }
                        })}
                        type="text"
                        className={`input ${errors.lastName ? 'input-error' : ''}`}
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="text-error text-sm mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        type="email"
                        className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-error text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full btn btn-primary"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </motion.div>
              )}

              {/* Step 2: Password & Role */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters'
                          }
                        })}
                        type={showPassword ? 'text' : 'password'}
                        className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-error text-sm mt-1">{errors.password.message}</p>
                    )}
                    
                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="mt-2">
                        <div className="h-1 w-full bg-dark-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              password.length < 8
                                ? 'bg-error w-1/4'
                                : password.length < 12
                                ? 'bg-warning w-1/2'
                                : 'bg-success w-full'
                            }`}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {password.length < 8
                            ? 'Weak - Use at least 8 characters'
                            : password.length < 12
                            ? 'Medium - Good strength'
                            : 'Strong - Excellent!'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: (value) =>
                            value === password || 'Passwords do not match'
                        })}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`input pl-10 pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-error text-sm mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 btn btn-outline"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 btn btn-primary"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Role Selection */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      I want to:
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => handleRoleSelect('client')}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          selectedRole === 'client'
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <Building className="w-5 h-5 text-primary-400 mr-2" />
                          <span className="font-semibold">Hire Editors</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Post projects and find talented video editors
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRoleSelect('editor')}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          selectedRole === 'editor'
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <Palette className="w-5 h-5 text-accent-400 mr-2" />
                          <span className="font-semibold">Be an Editor</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Showcase your skills and get hired for projects
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Profile Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Profile Picture (Optional)
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div
                          className={`w-20 h-20 rounded-full flex items-center justify-center overflow-hidden border-2 border-dashed border-white/30 hover:border-primary-500 cursor-pointer transition-colors ${
                            avatar ? 'border-primary-500' : ''
                          }`}
                          onClick={() => document.getElementById('avatar-input').click()}
                        >
                          {avatar ? (
                            <img
                              src={avatar}
                              alt="Avatar preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Camera className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <input
                          type="file"
                          id="avatar-input"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-300 mb-1">Add a profile picture</p>
                        <p className="text-xs text-gray-400">Recommended: 400x400px, max 5MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div>
                    <label className="flex items-start">
                      <input
                        {...register('terms', {
                          required: 'You must accept the terms'
                        })}
                        type="checkbox"
                        className="checkbox-custom mr-3 mt-1"
                      />
                      <span className="text-sm text-gray-400">
                        I agree to the{' '}
                        <a href="#" className="text-primary-400 hover:text-primary-300">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-primary-400 hover:text-primary-300">
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                    {errors.terms && (
                      <p className="text-error text-sm mt-1">{errors.terms.message}</p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 btn btn-outline"
                    >
                      Back
                    </button>
                    <motion.button
                      type="submit"
                      disabled={registerMutation.isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 btn btn-primary"
                    >
                      {registerMutation.isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Sign In Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-gray-400 mt-6"
          >
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

export default RegisterPage
