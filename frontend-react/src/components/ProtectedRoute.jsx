import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@store/authStore'
import LoadingScreen from './LoadingScreen'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return <LoadingScreen />
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth/login"
        state={{ from: location.pathname }}
        replace
      />
    )
  }

  // Check role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-dark-900 flex items-center justify-center"
      >
        <div className="text-center max-w-md p-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              className="w-10 h-10 text-error"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-4">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="btn btn-primary"
          >
            Go Back
          </button>
        </div>
      </motion.div>
    )
  }

  return children
}

export default ProtectedRoute
