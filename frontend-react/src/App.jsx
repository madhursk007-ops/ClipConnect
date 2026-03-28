import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@store/authStore'
import { useSocketStore } from '@store/socketStore'

// Pages
import LandingPage from '@pages/LandingPage'
import LuxuryLandingPage from '@pages/LuxuryLandingPage'
import WorldClassLandingPage from '@pages/WorldClassLandingPage'
import LoginPage from '@pages/auth/LoginPage'
import RegisterPage from '@pages/auth/RegisterPage'
import LuxuryAuthPage from '@pages/LuxuryAuthPage'
import WorldClassAuthPage from '@pages/WorldClassAuthPage'
import DashboardPage from '@pages/DashboardPage'
import PremiumDashboardPage from '@pages/PremiumDashboardPage'
import MarketplacePage from '@pages/MarketplacePage'
import ProfilePage from '@pages/ProfilePage'
import ChatPage from '@pages/ChatPage'
import ProjectPage from '@pages/ProjectPage'
import SettingsPage from '@pages/SettingsPage'
import PricingPage from '@pages/PricingPage'
import HowItWorksPage from '@pages/HowItWorksPage'
import ContactPage from '@pages/ContactPage'
import NotFoundPage from '@pages/NotFoundPage'

// Components
import ProtectedRoute from '@components/ProtectedRoute'
import LoadingScreen from '@components/LoadingScreen'
import Navbar from '@components/Navbar'
import Footer from '@components/Footer'
import PremiumNavbar from '@components/PremiumNavbar'
import PremiumFooter from '@components/PremiumFooter'

// Layouts
import MainLayout from '@layouts/MainLayout'
import AuthLayout from '@layouts/AuthLayout'
import PremiumLayout from '@layouts/PremiumLayout'

function App() {
  const { user, isLoading, checkAuth } = useAuthStore()
  const { initializeSocket } = useSocketStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (user) {
      initializeSocket()
    }
  }, [user, initializeSocket])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PremiumLayout><WorldClassLandingPage /></PremiumLayout>} />
          <Route path="/luxury" element={<PremiumLayout><LuxuryLandingPage /></PremiumLayout>} />
          <Route path="/classic" element={<MainLayout><LandingPage /></MainLayout>} />
          <Route path="/pricing" element={<PremiumLayout><PricingPage /></PremiumLayout>} />
          <Route path="/how-it-works" element={<PremiumLayout><HowItWorksPage /></PremiumLayout>} />
          <Route path="/contact" element={<PremiumLayout><ContactPage /></PremiumLayout>} />
          
          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="luxury" element={<LuxuryAuthPage />} />
            <Route path="world-class" element={<WorldClassAuthPage />} />
          </Route>

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PremiumLayout>
                  <PremiumDashboardPage />
                </PremiumLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <PremiumLayout>
                  <MarketplacePage />
                </PremiumLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <PremiumLayout>
                  <ProfilePage />
                </PremiumLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <PremiumLayout>
                  <ChatPage />
                </PremiumLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/project/:id"
            element={
              <ProtectedRoute>
                <PremiumLayout>
                  <ProjectPage />
                </PremiumLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <PremiumLayout>
                  <SettingsPage />
                </PremiumLayout>
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<PremiumLayout><NotFoundPage /></PremiumLayout>} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
