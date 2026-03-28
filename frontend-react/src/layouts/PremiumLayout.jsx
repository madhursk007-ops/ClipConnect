import React from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import PremiumNavbar from '@components/PremiumNavbar'
import PremiumFooter from '@components/PremiumFooter'

const PremiumLayout = ({ children, className = '' }) => {
  const location = useLocation()

  // Pages that don't need footer
  const noFooterPages = ['/auth/world-class', '/auth/luxury', '/auth/login', '/auth/register']
  const showFooter = !noFooterPages.some(path => location.pathname.startsWith(path))

  return (
    <div className={`min-h-screen bg-dark-900 text-white ${className}`}>
      <PremiumNavbar />
      
      <main className="flex-grow">
        {children}
      </main>

      {showFooter && <PremiumFooter />}
    </div>
  )
}

export default PremiumLayout
