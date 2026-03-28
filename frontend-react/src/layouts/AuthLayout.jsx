import React from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Outlet />
      </motion.div>
    </div>
  )
}

export default AuthLayout
