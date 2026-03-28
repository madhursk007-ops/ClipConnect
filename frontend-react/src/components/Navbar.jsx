import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Video, 
  LayoutDashboard, 
  Search, 
  MessageSquare, 
  User, 
  Bell,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Settings
} from 'lucide-react'
import { useAuthStore } from '@store/authStore'
import toast from 'react-hot-toast'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, isAuthenticated } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const isEditor = user?.role === 'editor'

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Marketplace', path: '/marketplace', icon: Search },
    { name: 'Messages', path: '/chat', icon: MessageSquare },
  ]

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/')
    } catch (error) {
      toast.error('Error logging out')
    }
  }

  const isActive = (path) => {
    return location.pathname.startsWith(path)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-white/10"
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-400 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-heading">ClipConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated && navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-primary-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium hidden lg:block">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 glass-morphism-strong rounded-xl border border-white/10 overflow-hidden"
                      >
                        <div className="p-4 border-b border-white/10">
                          <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
                          <p className="text-sm text-gray-400">{user?.email}</p>
                          <span className="inline-block mt-2 px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-full">
                            {isEditor ? 'Editor' : 'Client'}
                          </span>
                        </div>

                        <div className="p-2">
                          <Link
                            to={`/profile/${user?._id}`}
                            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                          </Link>

                          <button
                            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
                            onClick={() => {
                              setIsProfileOpen(false)
                              toast.info('Settings coming soon!')
                            }}
                          >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </button>

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/auth/login"
                  className="btn btn-ghost btn-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  className="btn btn-primary btn-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10"
            >
              <div className="py-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                          isActive(item.path)
                            ? 'bg-primary-500/20 text-primary-400'
                            : 'text-gray-400 hover:bg-white/5'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    ))}

                    <div className="border-t border-white/10 my-2" />

                    <Link
                      to={`/profile/${user?._id}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5"
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        handleLogout()
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-error hover:bg-error/10"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 text-gray-400 hover:bg-white/5 rounded-lg"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/auth/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-400 text-white rounded-lg"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar
