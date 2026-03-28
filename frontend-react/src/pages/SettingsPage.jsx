import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  User, 
  Shield, 
  CreditCard, 
  Bell, 
  Globe,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Save,
  Upload,
  Trash2,
  Plus,
  X
} from 'lucide-react'
import { useAuthStore } from '@store/authStore'
import { useSubscriptionStore } from '@store/subscriptionStore'
import TrustSafetySystem from '@components/TrustSafetySystem'
import PaymentEscrowSystem from '@components/PaymentEscrowSystem'
import NotificationSystem from '@components/NotificationSystem'
import toast from 'react-hot-toast'

const SettingsPage = () => {
  const { user, updateProfile, changePassword } = useAuthStore()
  const { currentPlan } = useSubscriptionStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    bio: user?.profile?.bio || '',
    location: user?.profile?.location || '',
    website: user?.profile?.website || ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Globe }
  ]

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      await updateProfile(formData)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    
    setIsSaving(true)
    
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      toast.success('Password changed successfully!')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowPasswordForm(false)
    } catch (error) {
      toast.error('Failed to change password')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordInputChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  // Profile Tab Content
  const ProfileContent = () => (
    <div className="space-y-6">
      <div className="glass-morphism rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold mb-6">Profile Information</h3>
        
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="input w-full"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="input w-full resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="input w-full"
                placeholder="City, Country"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="input w-full"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-primary"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Avatar Upload */}
      <div className="glass-morphism rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold mb-6">Profile Picture</h3>
        
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-white text-2xl font-bold">
                {user?.profile?.firstName?.charAt(0)}{user?.profile?.lastName?.charAt(0)}
              </span>
            )}
          </div>
          
          <div>
            <button className="btn btn-primary mb-2">
              <Upload className="w-4 h-4 mr-2" />
              Upload New Picture
            </button>
            <p className="text-sm text-gray-400">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  // Security Tab Content
  const SecurityContent = () => (
    <div className="space-y-6">
      <div className="glass-morphism rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Change Password</h3>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="btn btn-outline btn-sm"
          >
            {showPasswordForm ? 'Cancel' : 'Change Password'}
          </button>
        </div>
        
        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  className="input w-full pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  className="input w-full pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  className="input w-full pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="btn btn-primary"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div className="glass-morphism rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold mb-6">Two-Factor Authentication</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
            <div>
              <h4 className="font-medium">Enable 2FA</h4>
              <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
            </div>
            <button className="btn btn-outline btn-sm">
              <Shield className="w-4 h-4 mr-2" />
              Enable 2FA
            </button>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="glass-morphism rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold mb-6">Active Sessions</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
            <div>
              <h4 className="font-medium">Current Session</h4>
              <p className="text-sm text-gray-400">Chrome on Windows • Now</p>
            </div>
            <span className="badge badge-success">Current</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
            <div>
              <h4 className="font-medium">Mobile App</h4>
              <p className="text-sm text-gray-400">iOS • 2 hours ago</p>
            </div>
            <button className="text-error hover:text-red-400">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Tab Content Renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileContent />
      case 'security':
        return <SecurityContent />
      case 'billing':
        return <PaymentEscrowSystem />
      case 'notifications':
        return <NotificationSystem />
      case 'privacy':
        return <TrustSafetySystem />
      default:
        return <ProfileContent />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account settings and preferences</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-400">Current Plan</div>
            <div className={`font-semibold ${
              currentPlan?.type === 'premium' ? 'text-yellow-400' :
              currentPlan?.type === 'pro' ? 'text-primary-400' : 'text-gray-400'
            }`}>
              {currentPlan?.name || 'Free'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-dark-800 p-1 rounded-xl overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-primary-500 to-accent-400 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  )
}

export default SettingsPage
