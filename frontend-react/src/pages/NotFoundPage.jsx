import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Home, Search, Video } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.3, 0],
              scale: [1, 1.5, 1],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 1.5,
              ease: 'easeInOut'
            }}
            className="absolute rounded-full bg-gradient-to-r from-primary-500/20 to-accent-400/20 blur-3xl"
            style={{
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
              left: `${20 + i * 30}%`,
              top: `${20 + i * 20}%`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        {/* 404 Animation */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.02, 1]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-9xl font-bold font-heading"
            >
              <span className="bg-gradient-to-r from-primary-500 via-accent-400 to-primary-500 bg-clip-text text-transparent">
                404
              </span>
            </motion.div>
            
            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute -top-4 -right-8 w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-400 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Video className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-4xl font-heading font-bold mb-4">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-lg mx-auto">
            Oops! Looks like this scene got cut from the final edit. The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/"
            className="btn btn-primary btn-lg group"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline btn-lg group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
        </motion.div>

        {/* Search Suggestion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12"
        >
          <p className="text-gray-500 mb-4">Or try searching for what you need:</p>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search editors, projects..."
                className="input pl-10 w-full"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    window.location.href = `/marketplace?search=${e.target.value}`
                  }
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Popular Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-12"
        >
          <p className="text-gray-500 mb-4">Popular destinations:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: 'Browse Editors', href: '/marketplace' },
              { name: 'Post a Project', href: '/dashboard' },
              { name: 'My Dashboard', href: '/dashboard' },
              { name: 'Help Center', href: '#' }
            ].map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="px-4 py-2 bg-dark-800 rounded-lg text-gray-400 hover:text-white hover:bg-dark-700 transition-colors text-sm"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-16 flex justify-center space-x-2"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-2 h-2 bg-primary-500 rounded-full"
            />
          ))}
        </motion.div>
      </div>

      {/* Error Code Detail */}
      <div className="absolute bottom-8 left-8 text-gray-600 text-sm">
        Error Code: 404_NOT_FOUND
      </div>

      {/* Support Link */}
      <div className="absolute bottom-8 right-8">
        <Link
          to="/contact"
          className="text-gray-500 hover:text-white text-sm transition-colors"
        >
          Need help? Contact Support
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
