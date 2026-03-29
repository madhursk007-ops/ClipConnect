import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Animated Orbs */}
      <motion.div
        className="absolute w-4 h-4 bg-primary-400 rounded-full"
        animate={{
          x: [0, 100, 200, 100, 0],
          y: [0, -100, 0, 100, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ top: '20%', left: '10%' }}
      />
      <motion.div
        className="absolute w-3 h-3 bg-accent-400 rounded-full"
        animate={{
          x: [0, -150, -100, -200, 0],
          y: [0, 50, 150, 50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{ bottom: '30%', right: '15%' }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div 
            className="w-16 h-16 mx-auto bg-gradient-to-r from-primary-500 to-accent-400 rounded-2xl flex items-center justify-center mb-4"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </motion.div>
          <h1 className="text-2xl font-bold text-white">ClipConnect</h1>
          <p className="text-gray-400 mt-1">Connect. Create. Conquer.</p>
        </div>

        <Outlet />
      </motion.div>
    </div>
  );
};

export default AuthLayout;
