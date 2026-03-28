import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  Lock, 
  CheckCircle,
  AlertTriangle,
  FileText,
  MessageSquare,
  Clock,
  DollarSign,
  User,
  X,
  Send,
  ChevronRight,
  Upload
} from 'lucide-react'
import { useAuthStore } from '@store/authStore'
import toast from 'react-hot-toast'

const TrustSafetySystem = ({ className = '' }) => {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('verification')
  const [showDisputeModal, setShowDisputeModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  // Mock verification status
  const verificationStatus = {
    email: true,
    phone: true,
    identity: false,
    payment: true,
    portfolio: true
  }

  // Mock disputes
  const [disputes, setDisputes] = useState([
    {
      id: 1,
      project: 'Corporate Brand Video',
      type: 'payment',
      status: 'resolved',
      date: '2024-01-15',
      description: 'Dispute regarding final payment release',
      resolution: 'Payment released after mutual agreement'
    },
    {
      id: 2,
      project: 'Music Video Production',
      type: 'quality',
      status: 'open',
      date: '2024-01-20',
      description: 'Client unsatisfied with final edit quality',
      resolution: null
    }
  ])

  const trustScore = 85

  const verificationSteps = [
    {
      id: 'email',
      name: 'Email Verification',
      description: 'Verify your email address',
      icon: MessageSquare,
      status: verificationStatus.email,
      action: 'Verified'
    },
    {
      id: 'phone',
      name: 'Phone Verification',
      description: 'Add and verify phone number',
      icon: MessageSquare,
      status: verificationStatus.phone,
      action: 'Verified'
    },
    {
      id: 'identity',
      name: 'Identity Verification',
      description: 'Upload government ID for verification',
      icon: User,
      status: verificationStatus.identity,
      action: 'Verify Now'
    },
    {
      id: 'payment',
      name: 'Payment Method',
      description: 'Add and verify payment method',
      icon: DollarSign,
      status: verificationStatus.payment,
      action: 'Verified'
    },
    {
      id: 'portfolio',
      name: 'Portfolio Verification',
      description: 'Verify portfolio authenticity',
      icon: FileText,
      status: verificationStatus.portfolio,
      action: 'Verified'
    }
  ]

  const completedSteps = Object.values(verificationStatus).filter(Boolean).length
  const totalSteps = Object.values(verificationStatus).length

  const handleStartDispute = () => {
    setShowDisputeModal(true)
  }

  const handleSubmitDispute = () => {
    toast.success('Dispute submitted successfully!')
    setShowDisputeModal(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-success/20 text-success border-success/30'
      case 'pending':
        return 'bg-warning/20 text-warning border-warning/30'
      case 'unverified':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default:
        return 'bg-dark-800 text-gray-400'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-success to-green-500 rounded-xl flex items-center justify-center mr-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Trust & Safety</h3>
              <p className="text-sm text-gray-400">Build trust and protect your account</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-success">{trustScore}%</div>
            <div className="text-xs text-gray-400">Trust Score</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Verification Progress</span>
            <span className="text-primary-400">{completedSteps}/{totalSteps} completed</span>
          </div>
          <div className="h-3 bg-dark-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-success to-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${(completedSteps / totalSteps) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span className="badge badge-success">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified Email
          </span>
          <span className="badge badge-primary">
            <CheckCircle className="w-3 h-3 mr-1" />
            Payment Verified
          </span>
          <span className="badge badge-secondary">
            <Clock className="w-3 h-3 mr-1" />
            Member Since 2024
          </span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-dark-800 p-1 rounded-xl">
        {[
          { id: 'verification', name: 'Verification', icon: CheckCircle },
          { id: 'security', name: 'Security', icon: Lock },
          { id: 'disputes', name: 'Disputes', icon: AlertTriangle }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center ${
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

      {/* Verification Tab */}
      {activeTab === 'verification' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {verificationSteps.map((step, index) => {
            const Icon = step.icon
            
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glass-morphism rounded-xl p-4 border flex items-center justify-between ${
                  step.status ? 'border-success/30' : 'border-white/10'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                    step.status ? 'bg-success/20 text-success' : 'bg-dark-800 text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{step.name}</h4>
                    <p className="text-sm text-gray-400">{step.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  {step.status ? (
                    <span className="flex items-center text-success">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verified
                    </span>
                  ) : (
                    <button className="btn btn-primary btn-sm">
                      {step.action}
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="glass-morphism rounded-2xl p-6 border border-white/10">
            <h4 className="font-semibold mb-4">Security Settings</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
                <div>
                  <h5 className="font-medium">Two-Factor Authentication</h5>
                  <p className="text-sm text-gray-400">Add extra security to your account</p>
                </div>
                <button className="btn btn-outline btn-sm">Enable 2FA</button>
              </div>

              <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
                <div>
                  <h5 className="font-medium">Password</h5>
                  <p className="text-sm text-gray-400">Last changed 30 days ago</p>
                </div>
                <button className="btn btn-outline btn-sm">Change</button>
              </div>

              <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
                <div>
                  <h5 className="font-medium">Active Sessions</h5>
                  <p className="text-sm text-gray-400">3 devices currently logged in</p>
                </div>
                <button className="btn btn-outline btn-sm">Manage</button>
              </div>

              <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
                <div>
                  <h5 className="font-medium">Login History</h5>
                  <p className="text-sm text-gray-400">View recent login activity</p>
                </div>
                <button className="btn btn-outline btn-sm">View</button>
              </div>
            </div>
          </div>

          <div className="glass-morphism rounded-2xl p-6 border border-white/10">
            <h4 className="font-semibold mb-4">Privacy Settings</h4>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">Profile Visibility</h5>
                  <p className="text-sm text-gray-400">Make your profile visible to all users</p>
                </div>
                <input type="checkbox" className="checkbox-custom" defaultChecked />
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">Portfolio Public</h5>
                  <p className="text-sm text-gray-400">Allow anyone to view your portfolio</p>
                </div>
                <input type="checkbox" className="checkbox-custom" defaultChecked />
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">Show Earnings</h5>
                  <p className="text-sm text-gray-400">Display earnings on public profile</p>
                </div>
                <input type="checkbox" className="checkbox-custom" />
              </label>
            </div>
          </div>
        </motion.div>
      )}

      {/* Disputes Tab */}
      {activeTab === 'disputes' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Dispute History</h4>
            <button 
              onClick={handleStartDispute}
              className="btn btn-outline btn-sm"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Report Issue
            </button>
          </div>

          {disputes.length === 0 ? (
            <div className="glass-morphism rounded-2xl p-12 border border-white/10 text-center">
              <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-success" />
              </div>
              <h4 className="text-lg font-semibold mb-2">No Disputes</h4>
              <p className="text-gray-400">Great! You haven't had any disputes.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {disputes.map((dispute, index) => (
                <motion.div
                  key={dispute.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-morphism rounded-xl p-4 border border-white/10"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h5 className="font-semibold">{dispute.project}</h5>
                      <span className={`badge ${
                        dispute.status === 'resolved' ? 'badge-success' : 'badge-warning'
                      } text-xs mt-1`}>
                        {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">{dispute.date}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{dispute.description}</p>
                  {dispute.resolution && (
                    <div className="bg-success/10 rounded-lg p-3">
                      <span className="text-sm text-success flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {dispute.resolution}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Dispute Modal */}
      <AnimatePresence>
        {showDisputeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowDisputeModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-morphism-strong rounded-2xl p-6 max-w-md w-full mx-4 border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Submit Dispute</h3>
                <button
                  onClick={() => setShowDisputeModal(false)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project
                  </label>
                  <select className="input w-full">
                    <option>Select a project</option>
                    <option>Corporate Brand Video</option>
                    <option>Music Video Production</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Issue Type
                  </label>
                  <select className="input w-full">
                    <option>Select issue type</option>
                    <option>Payment Dispute</option>
                    <option>Quality Issues</option>
                    <option>Communication Problem</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    className="input w-full min-h-[100px] resize-none"
                    placeholder="Describe the issue in detail..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Attachments
                  </label>
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Drag and drop files or click to upload</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSubmitDispute}
                  className="flex-1 btn btn-primary"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Dispute
                </button>
                <button
                  onClick={() => setShowDisputeModal(false)}
                  className="flex-1 btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TrustSafetySystem
