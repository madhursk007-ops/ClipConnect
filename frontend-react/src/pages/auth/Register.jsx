import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle, Briefcase, Camera } from 'lucide-react';
import { useAuth } from '@hooks';

const Register = () => {
  const [searchParams] = useSearchParams();
  const preselectedRole = searchParams.get('role');
  
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(preselectedRole || '');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    const userData = {
      username: formData.email.split('@')[0],
      email: formData.email,
      password: formData.password,
      role: selectedRole,
      profile: {
        firstName: formData.firstName,
        lastName: formData.lastName,
      },
    };

    const result = await signUp(userData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="glass-morphism p-8 rounded-2xl border border-white/10">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <h2 className="text-2xl font-bold text-white mb-2">Join ClipConnect</h2>
              <p className="text-gray-400 mb-6">Choose how you want to use the platform</p>

              <div className="space-y-4">
                <motion.button
                  onClick={() => handleRoleSelect('client')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-6 rounded-xl border-2 transition-all duration-300 flex items-center space-x-4 ${
                    selectedRole === 'client'
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-white/10 hover:border-primary-500/50 hover:bg-white/5'
                  }`}
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-white">I'm a Client</h3>
                    <p className="text-sm text-gray-400">Hire professional video editors for my projects</p>
                  </div>
                  {selectedRole === 'client' && (
                    <CheckCircle className="w-6 h-6 text-primary-400 ml-auto" />
                  )}
                </motion.button>

                <motion.button
                  onClick={() => handleRoleSelect('editor')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-6 rounded-xl border-2 transition-all duration-300 flex items-center space-x-4 ${
                    selectedRole === 'editor'
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-white/10 hover:border-primary-500/50 hover:bg-white/5'
                  }`}
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-400 rounded-xl flex items-center justify-center">
                    <Camera className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-white">I'm an Editor</h3>
                    <p className="text-sm text-gray-400">Find video editing projects and grow my career</p>
                  </div>
                  {selectedRole === 'editor' && (
                    <CheckCircle className="w-6 h-6 text-primary-400 ml-auto" />
                  )}
                </motion.button>
              </div>

              <p className="text-center mt-6 text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
                  Sign in
                </Link>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button
                onClick={() => setStep(1)}
                className="text-sm text-gray-400 hover:text-white mb-4 flex items-center"
              >
                ← Back to role selection
              </button>

              <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-gray-400 mb-6">
                Signing up as a <span className="text-primary-400 capitalize">{selectedRole}</span>
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                      required
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3.5 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    required
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    required
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-12 py-3.5 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Confirm Password */}
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3.5 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  required
                />

                {/* Terms */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-4 h-4 rounded border-white/10 bg-dark-700 text-primary-500 focus:ring-primary-500"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary-400 hover:text-primary-300">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-primary-400 hover:text-primary-300">Privacy Policy</Link>
                  </label>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </motion.button>
              </form>

              <p className="text-center mt-6 text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
                  Sign in
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Register;
