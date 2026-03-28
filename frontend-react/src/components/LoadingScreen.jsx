import React from 'react'
import { motion } from 'framer-motion'
import { Video } from 'lucide-react'

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center">
      {/* Logo Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        {/* Pulsing Logo */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              '0 0 20px rgba(127, 90, 240, 0.3)',
              '0 0 40px rgba(127, 90, 240, 0.6)',
              '0 0 20px rgba(127, 90, 240, 0.3)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-400 rounded-2xl flex items-center justify-center mb-6"
        >
          <Video className="w-10 h-10 text-white" />
        </motion.div>

        {/* Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold font-heading mb-4"
        >
          ClipConnect
        </motion.h1>

        {/* Loading Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center space-x-2"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                y: [0, -8, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: index * 0.2,
                ease: 'easeInOut'
              }}
              className="w-3 h-3 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full"
            />
          ))}
        </motion.div>

        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-gray-400 mt-6 text-sm"
        >
          Loading...
        </motion.p>

        {/* Skeleton Elements */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '100%' }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-8 w-64"
        >
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-2 bg-white/10 rounded-full animate-pulse"
                style={{ width: `${Math.random() * 40 + 60}%` }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Background Gradient Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
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
    </div>
  )
}

export default LoadingScreen
