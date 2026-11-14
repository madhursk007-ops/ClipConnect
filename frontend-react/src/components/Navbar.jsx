import React, { useEffect, useRef, useState } from 'react'
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
  Settings,
  ArrowRight,
} from 'lucide-react'
import { useAuthStore } from '@store/authStore'
import toast from 'react-hot-toast'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, isAuthenticated } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef(null)

  const isEditor = String(user?.role || '').toLowerCase() === 'editor'
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, protected: true },
    { name: 'Marketplace', path: '/marketplace', icon: Search, protected: false },
    { name: 'Messages', path: '/chat', icon: MessageSquare, protected: true },
  ]

  useEffect(() => {
    setIsMenuOpen(false)
    setIsProfileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false)
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setIsProfileOpen(false)
      setIsMenuOpen(false)
      toast.success('Logged out successfully')
      navigate('/')
    } catch (error) {
      toast.error('Error logging out')
    }
  }

  const isActive = (path) => (
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
  )

  const visibleNavItems = navItems.filter((item) => !item.protected || isAuthenticated)

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      aria-label="Main navigation"
      className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#090910]/85 shadow-lg shadow-black/10 backdrop-blur-2xl"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.5rem] items-center justify-between">
          <Link to="/" aria-label="ClipConnect home" className="group flex shrink-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-400 shadow-lg shadow-primary-500/20 transition-transform duration-300 group-hover:rotate-[-5deg] group-hover:scale-105">
              <Video className="h-5 w-5 text-white" />
            </span>
            <span className="font-heading text-xl font-bold tracking-tight text-white">
              Clip<span className="text-primary-300">Connect</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {visibleNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                aria-current={isActive(item.path) ? 'page' : undefined}
                className={`relative inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary-500/10 text-primary-300'
                    : 'text-gray-400 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
                {isActive(item.path) && (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    className="absolute inset-x-4 -bottom-[1.05rem] h-0.5 rounded-full bg-gradient-to-r from-primary-400 to-accent-300"
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  aria-label="Notifications"
                  onClick={() => toast.info('Notifications will be available soon.')}
                  className="relative rounded-xl p-2.5 text-gray-400 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  <Bell className="h-5 w-5" />
                </button>

                <div ref={profileRef} className="relative">
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={isProfileOpen}
                    onClick={() => setIsProfileOpen((open) => !open)}
                    className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] py-1.5 pl-2 pr-3 transition-colors hover:border-white/15 hover:bg-white/[0.07]"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-400 text-white">
                      <User className="h-4 w-4" />
                    </span>
                    <span className="max-w-32 text-left text-sm font-medium text-gray-200">
                      {user?.firstName || 'Account'}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        role="menu"
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.16 }}
                        className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#14141e] shadow-2xl shadow-black/40"
                      >
                        <div className="border-b border-white/[0.08] p-4">
                          <p className="font-semibold text-white">{user?.firstName} {user?.lastName}</p>
                          <p className="mt-1 truncate text-xs text-gray-400">{user?.email}</p>
                          <span className="mt-3 inline-flex rounded-full border border-primary-400/20 bg-primary-400/10 px-2.5 py-1 text-[11px] font-semibold text-primary-300">
                            {isEditor ? 'Editor account' : 'Client account'}
                          </span>
                        </div>
                        <div className="p-2">
                          <Link
                            role="menuitem"
                            to={`/profile/${user?._id}`}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                          >
                            <User className="h-4 w-4" /> Profile
                          </Link>
                          <Link
                            role="menuitem"
                            to="/settings"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                          >
                            <Settings className="h-4 w-4" /> Settings
                          </Link>
                          <button
                            type="button"
                            role="menuitem"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-rose-300 transition-colors hover:bg-rose-400/10"
                          >
                            <LogOut className="h-4 w-4" /> Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/[0.05] hover:text-white">
                  Sign in
                </Link>
                <Link to="/register" className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/15 transition-all hover:-translate-y-0.5 hover:shadow-primary-500/25">
                  Get started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            )}
          </div>

          <button
            type="button"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-gray-300 transition-colors hover:bg-white/[0.08] hover:text-white md:hidden"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {isMenuOpen && (
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="overflow-hidden md:hidden"
            >
              <div className="space-y-1 border-t border-white/[0.08] py-4">
                {visibleNavItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    aria-current={isActive(item.path) ? 'page' : undefined}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-primary-500/10 text-primary-300'
                        : 'text-gray-300 hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5" /> {item.name}
                  </Link>
                ))}

                {isAuthenticated ? (
                  <>
                    <div className="my-3 border-t border-white/[0.08]" />
                    <Link to={`/profile/${user?._id}`} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-300 hover:bg-white/[0.05]">
                      <User className="h-5 w-5" /> Profile
                    </Link>
                    <Link to="/settings" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-300 hover:bg-white/[0.05]">
                      <Settings className="h-5 w-5" /> Settings
                    </Link>
                    <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-rose-300 hover:bg-rose-400/10">
                      <LogOut className="h-5 w-5" /> Sign out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pt-3">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-white/[0.05]">
                      Sign in
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3 text-center text-sm font-semibold text-white">
                      Get started
                    </Link>
                  </div>
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
