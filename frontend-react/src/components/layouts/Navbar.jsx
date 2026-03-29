import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  MessageSquare, 
  Settings, 
  LogOut,
  User,
  Search,
  Bell,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@hooks';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/marketplace', label: 'Marketplace', icon: Users },
    ...(isAuthenticated ? [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/projects', label: 'Projects', icon: FolderKanban },
    ] : []),
  ];

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Zap className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              ClipConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-primary-500/10 text-primary-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            
            {isAuthenticated ? (
              <>
                <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-white font-medium">
                      {user?.profile?.firstName || 'User'}
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-dark-800 border border-white/10 rounded-xl shadow-2xl py-2"
                      >
                        <Link 
                          to="/dashboard" 
                          className="flex items-center px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                        <Link 
                          to="/settings" 
                          className="flex items-center px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Link>
                        <hr className="my-2 border-white/10" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-800/95 backdrop-blur-xl border-t border-white/5"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium ${
                    isActive(link.path)
                      ? 'bg-primary-500/10 text-primary-400'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <link.icon className="w-5 h-5 mr-3" />
                  {link.label}
                </Link>
              ))}
              
              {!isAuthenticated && (
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-4 py-3 rounded-lg text-sm font-medium bg-gradient-to-r from-primary-600 to-primary-500 text-white"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
