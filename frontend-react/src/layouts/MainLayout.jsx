import React from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '@components/Navbar'
import Footer from '@components/Footer'

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col">
      <Navbar />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex-1"
      >
        <Outlet />
      </motion.main>
      
      <Footer />
    </div>
  )
}

export default MainLayout
