import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <div className="text-9xl font-bold bg-gradient-to-r from-primary-500 to-accent-400 bg-clip-text text-transparent">
            404
          </div>
          
          {/* Floating Elements */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-4 -right-4 w-20 h-20 bg-primary-500/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ y: [0, 10, 0], rotate: [0, -5, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent-400/20 rounded-full blur-xl"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-white mb-4"
        >
          Page Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-lg mb-8"
        >
          The page you're looking for doesn't exist or has been moved. 
          Check the URL or navigate back to continue.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/"
            className="group px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 flex items-center"
          >
            <Home className="w-5 h-5 mr-2" />
            Back Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/5 transition-all duration-300 flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <p className="text-gray-500 mb-4">Looking for something else?</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/marketplace" className="text-primary-400 hover:text-primary-300 transition-colors">
              Marketplace
            </Link>
            <span className="text-gray-600">•</span>
            <Link to="/projects" className="text-primary-400 hover:text-primary-300 transition-colors">
              Projects
            </Link>
            <span className="text-gray-600">•</span>
            <Link to="/dashboard" className="text-primary-400 hover:text-primary-300 transition-colors">
              Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
