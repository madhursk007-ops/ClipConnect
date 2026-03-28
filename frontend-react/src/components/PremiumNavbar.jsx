import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut,
  Film,
  Briefcase,
  Search,
  Star,
  Zap,
  Shield,
  ArrowRight
} from 'lucide-react'
import { useAuthStore } from '@store/authStore'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const PremiumNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, logout, isAuthenticated } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false)
      }
      if (!event.target.closest('.mobile-menu')) {
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsProfileDropdownOpen(false)
  }

  const navigationItems = [
    { name: 'Marketplace', href: '/marketplace', icon: Search },
    { name: 'Browse Editors', href: '/marketplace?tab=editors', icon: Film },
    { name: 'Post Project', href: '/marketplace?tab=projects', icon: Briefcase },
    { name: 'Pricing', href: '/pricing', icon: Star },
    { name: 'How It Works', href: '/how-it-works', icon: Zap }
  ]

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' }
  ]

  const supportLinks = [
    { name: 'Help Center', href: '/help' },
    { name: 'Safety', href: '/safety' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' }
  ]

  const isActivePath = (path) => {
    if (path.includes('?')) {
      return location.pathname + location.search === path
    }
    return location.pathname === path
  }

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-dark-900/90 backdrop-blur-xl border-b border-white/10' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <motion.div
                className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center mr-3"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Film className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold text-white">ClipConnect</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    isActivePath(item.href)
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                /* Authenticated User */
                <div className="flex items-center space-x-4">
                  {/* Notifications */}
                  <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                    <div className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full" />
                    <Star className="w-5 h-5" />
                  </button>

                  {/* Profile Dropdown */}
                  <div className="relative profile-dropdown">
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {user?.profile?.firstName?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                        isProfileDropdownOpen ? 'rotate-180' : ''
                      }`} />
                    </button>

                    <AnimatePresence>
                      {isProfileDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-64 glass-morphism-strong rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
                        >
                          <div className="p-4 border-b border-white/10">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">
                                  {user?.profile?.firstName?.charAt(0) || 'U'}
                                </span>
                              </div>
                              <div>
                                <div className="font-semibold text-white">
                                  {user?.profile?.firstName} {user?.profile?.lastName}
                                </div>
                                <div className="text-sm text-gray-400 capitalize">
                                  {user?.role}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-2">
                            <Link
                              to="/dashboard"
                              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                              onClick={() => setIsProfileDropdownOpen(false)}
                            >
                              <Zap className="w-4 h-4" />
                              <span>Dashboard</span>
                            </Link>
                            <Link
                              to="/profile"
                              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                              onClick={() => setIsProfileDropdownOpen(false)}
                            >
                              <User className="w-4 h-4" />
                              <span>Profile</span>
                            </Link>
                            <Link
                              to="/settings"
                              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                              onClick={() => setIsProfileDropdownOpen(false)}
                            >
                              <Settings className="w-4 h-4" />
                              <span>Settings</span>
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors text-gray-300 hover:text-red-400 w-full"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                /* Not Authenticated */
                <div className="hidden lg:flex items-center space-x-4">
                  <Link
                    to="/auth/world-class"
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/world-class"
                    className="px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors mobile-menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-dark-900/95 backdrop-blur-xl border-t border-white/10 mobile-menu"
            >
              <div className="px-4 py-6 space-y-4">
                {/* Mobile Navigation Items */}
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActivePath(item.href)
                        ? 'text-primary-400 bg-primary-500/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}

                {/* Mobile Auth Section */}
                {!isAuthenticated && (
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <Link
                      to="/auth/world-class"
                      className="block w-full px-4 py-3 text-center text-gray-300 hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/auth/world-class"
                      className="block w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-400 text-white font-semibold rounded-xl text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}

                {/* Mobile Profile Section */}
                {isAuthenticated && (
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex items-center space-x-3 px-4 py-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {user?.profile?.firstName?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-white">
                          {user?.profile?.firstName} {user?.profile?.lastName}
                        </div>
                        <div className="text-sm text-gray-400 capitalize">
                          {user?.role}
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Zap className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="w-5 h-5" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-500/10 transition-colors text-gray-300 hover:text-red-400 w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 lg:h-20" />
    </>
  )
}

export default PremiumNavbar
