import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CreditCard, 
  Wallet,
  Shield,
  CheckCircle,
  Clock,
  ArrowRight,
  Lock,
  DollarSign,
  Calendar,
  Download,
  AlertCircle,
  X,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useSubscriptionStore } from '@store/subscriptionStore'
import { useAuthStore } from '@store/authStore'
import toast from 'react-hot-toast'

const PaymentEscrowSystem = ({ className = '' }) => {
  const { user } = useAuthStore()
  const { currentPlan, calculateCommission } = useSubscriptionStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [expandedTransaction, setExpandedTransaction] = useState(null)

  // Mock wallet data
  const wallet = {
    balance: 3250,
    escrow: 1500,
    pending: 750,
    totalEarnings: 12540
  }

  // Mock payment methods
  const paymentMethods = [
    {
      id: 1,
      type: 'card',
      brand: 'Visa',
      last4: '4242',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: 2,
      type: 'card',
      brand: 'Mastercard',
      last4: '8888',
      expiry: '08/26',
      isDefault: false
    }
  ]

  // Mock transactions
  const transactions = [
    {
      id: 1,
      type: 'escrow',
      project: 'Corporate Brand Video',
      amount: 2500,
      status: 'in_escrow',
      date: '2024-01-20',
      client: 'TechCorp Inc.',
      escrowStatus: 'funded',
      milestones: [
        { name: 'Initial Draft', amount: 1000, status: 'completed', completedAt: '2024-01-15' },
        { name: 'Final Delivery', amount: 1500, status: 'pending', completedAt: null }
      ]
    },
    {
      id: 2,
      type: 'payment',
      project: 'Music Video Production',
      amount: 1800,
      status: 'completed',
      date: '2024-01-18',
      client: 'Indie Rock Band',
      fee: 180,
      netAmount: 1620
    },
    {
      id: 3,
      type: 'withdrawal',
      amount: 2000,
      status: 'pending',
      date: '2024-01-19',
      method: 'Bank Transfer',
      estimatedArrival: '2024-01-22'
    },
    {
      id: 4,
      type: 'refund',
      project: 'Social Media Campaign',
      amount: 500,
      status: 'completed',
      date: '2024-01-17',
      reason: 'Project cancelled by mutual agreement'
    }
  ]

  const isEditor = user?.role === 'editor'

  const handleWithdraw = () => {
    toast.success('Withdrawal initiated! Funds will arrive in 2-3 business days.')
  }

  const handleReleaseEscrow = (transactionId) => {
    toast.success('Escrow released! Funds added to your wallet.')
  }

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success/20 text-success border-success/30'
      case 'in_escrow':
        return 'bg-primary-500/20 text-primary-400 border-primary-500/30'
      case 'pending':
        return 'bg-warning/20 text-warning border-warning/30'
      case 'failed':
        return 'bg-error/20 text-error border-error/30'
      default:
        return 'bg-dark-800 text-gray-400'
    }
  }

  const getEscrowStatusColor = (status) => {
    switch (status) {
      case 'funded':
        return 'text-success'
      case 'partial':
        return 'text-warning'
      case 'released':
        return 'text-primary-400'
      default:
        return 'text-gray-400'
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
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center mr-4">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Payment & Escrow</h3>
              <p className="text-sm text-gray-400">Manage your funds and secure payments</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="badge badge-primary text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Secure
            </span>
          </div>
        </div>

        {/* Wallet Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-dark-800/50 rounded-xl p-4 text-center border border-white/10">
            <div className="text-2xl font-bold text-primary-400">
              {formatAmount(wallet.balance)}
            </div>
            <div className="text-xs text-gray-400">Available Balance</div>
          </div>
          <div className="bg-dark-800/50 rounded-xl p-4 text-center border border-white/10">
            <div className="text-2xl font-bold text-warning">
              {formatAmount(wallet.escrow)}
            </div>
            <div className="text-xs text-gray-400">In Escrow</div>
          </div>
          <div className="bg-dark-800/50 rounded-xl p-4 text-center border border-white/10">
            <div className="text-2xl font-bold text-accent-400">
              {formatAmount(wallet.pending)}
            </div>
            <div className="text-xs text-gray-400">Pending</div>
          </div>
          <div className="bg-dark-800/50 rounded-xl p-4 text-center border border-white/10">
            <div className="text-2xl font-bold text-success">
              {formatAmount(wallet.totalEarnings)}
            </div>
            <div className="text-xs text-gray-400">Total Earnings</div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-3"
      >
        {isEditor ? (
          <>
            <button 
              onClick={() => setShowPaymentModal(true)}
              className="flex-1 btn btn-primary"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Withdraw Funds
            </button>
            <button className="flex-1 btn btn-outline">
              <Download className="w-4 h-4 mr-2" />
              Export History
            </button>
          </>
        ) : (
          <>
            <button className="flex-1 btn btn-primary">
              <CreditCard className="w-4 h-4 mr-2" />
              Add Payment Method
            </button>
            <button className="flex-1 btn btn-outline">
              <Download className="w-4 h-4 mr-2" />
              Export History
            </button>
          </>
        )}
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-dark-800 p-1 rounded-xl">
        {[
          { id: 'overview', name: 'Overview' },
          { id: 'transactions', name: 'Transactions' },
          { id: 'escrow', name: 'Escrow' },
          { id: 'methods', name: 'Payment Methods' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-primary-500 to-accent-400 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Recent Transactions */}
          <div className="glass-morphism rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Recent Transactions</h4>
              <button 
                onClick={() => setActiveTab('transactions')}
                className="text-sm text-primary-400 hover:text-primary-300"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-3">
              {transactions.slice(0, 3).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg border border-white/10"
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      transaction.type === 'escrow' ? 'bg-primary-500/20 text-primary-400' :
                      transaction.type === 'payment' ? 'bg-success/20 text-success' :
                      transaction.type === 'withdrawal' ? 'bg-warning/20 text-warning' :
                      'bg-error/20 text-error'
                    }`}>
                      {transaction.type === 'escrow' && <Shield className="w-5 h-5" />}
                      {transaction.type === 'payment' && <DollarSign className="w-5 h-5" />}
                      {transaction.type === 'withdrawal' && <ArrowRight className="w-5 h-5" />}
                      {transaction.type === 'refund' && <RefreshCw className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="font-medium">{transaction.project || transaction.type}</div>
                      <div className="text-sm text-gray-400">{transaction.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${
                      transaction.type === 'withdrawal' || transaction.type === 'refund' 
                        ? 'text-error' 
                        : 'text-success'
                    }`}>
                      {transaction.type === 'withdrawal' || transaction.type === 'refund' ? '-' : '+'}
                      {formatAmount(transaction.amount)}
                    </div>
                    <span className={`badge ${getStatusColor(transaction.status)} text-xs`}>
                      {transaction.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Escrow Summary */}
          <div className="glass-morphism rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Active Escrow</h4>
              <button 
                onClick={() => setActiveTab('escrow')}
                className="text-sm text-primary-400 hover:text-primary-300"
              >
                Manage Escrow
              </button>
            </div>
            
            <div className="bg-primary-500/10 rounded-xl p-4 border border-primary-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-primary-400">Total in Escrow</span>
                <span className="text-xl font-bold text-primary-400">{formatAmount(wallet.escrow)}</span>
              </div>
              <p className="text-sm text-gray-400">
                Funds are held securely until project milestones are completed.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-morphism rounded-xl p-4 border border-white/10 cursor-pointer"
              onClick={() => setExpandedTransaction(
                expandedTransaction === transaction.id ? null : transaction.id
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                    transaction.type === 'escrow' ? 'bg-primary-500/20 text-primary-400' :
                    transaction.type === 'payment' ? 'bg-success/20 text-success' :
                    transaction.type === 'withdrawal' ? 'bg-warning/20 text-warning' :
                    'bg-error/20 text-error'
                  }`}>
                    {transaction.type === 'escrow' && <Shield className="w-5 h-5" />}
                    {transaction.type === 'payment' && <DollarSign className="w-5 h-5" />}
                    {transaction.type === 'withdrawal' && <ArrowRight className="w-5 h-5" />}
                    {transaction.type === 'refund' && <RefreshCw className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-medium">{transaction.project || transaction.type}</div>
                    <div className="text-sm text-gray-400">{transaction.date}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-right mr-4">
                    <div className={`font-semibold ${
                      transaction.type === 'withdrawal' || transaction.type === 'refund' 
                        ? 'text-error' 
                        : 'text-success'
                    }`}>
                      {transaction.type === 'withdrawal' || transaction.type === 'refund' ? '-' : '+'}
                      {formatAmount(transaction.amount)}
                    </div>
                    <span className={`badge ${getStatusColor(transaction.status)} text-xs`}>
                      {transaction.status.replace('_', ' ')}
                    </span>
                  </div>
                  {expandedTransaction === transaction.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedTransaction === transaction.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-white/10"
                  >
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Transaction ID:</span>
                        <span className="ml-2 font-mono">TXN-{transaction.id.toString().padStart(6, '0')}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Date:</span>
                        <span className="ml-2">{transaction.date}</span>
                      </div>
                      {transaction.client && (
                        <div>
                          <span className="text-gray-400">Client:</span>
                          <span className="ml-2">{transaction.client}</span>
                        </div>
                      )}
                      {transaction.fee && (
                        <div>
                          <span className="text-gray-400">Platform Fee:</span>
                          <span className="ml-2 text-warning">{formatAmount(transaction.fee)}</span>
                        </div>
                      )}
                      {transaction.netAmount && (
                        <div>
                          <span className="text-gray-400">Net Amount:</span>
                          <span className="ml-2 text-success">{formatAmount(transaction.netAmount)}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Payment Methods Tab */}
      {activeTab === 'methods' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="glass-morphism rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Saved Payment Methods</h4>
              <button className="btn btn-primary btn-sm">
                <CreditCard className="w-4 h-4 mr-2" />
                Add New
              </button>
            </div>

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border border-white/10"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded mr-4 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{method.brand}</span>
                    </div>
                    <div>
                      <div className="font-medium">
                        •••• •••• •••• {method.last4}
                      </div>
                      <div className="text-sm text-gray-400">Expires {method.expiry}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {method.isDefault && (
                      <span className="badge badge-success text-xs">Default</span>
                    )}
                    <button className="text-gray-400 hover:text-white">
                      <Lock className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-morphism rounded-2xl p-6 border border-white/10">
            <h4 className="font-semibold mb-4">Security</h4>
            <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="w-5 h-5 text-success" />
                </div>
                <div>
                  <div className="font-medium">PCI DSS Compliant</div>
                  <div className="text-sm text-gray-400">Your payment info is encrypted and secure</div>
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Withdrawal Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-morphism-strong rounded-2xl p-6 max-w-md w-full mx-4 border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Withdraw Funds</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-dark-800/50 rounded-xl p-4 border border-white/10">
                  <div className="text-sm text-gray-400 mb-1">Available Balance</div>
                  <div className="text-2xl font-bold text-primary-400">
                    {formatAmount(wallet.balance)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount to Withdraw
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      className="input pl-10 w-full"
                      placeholder="0.00"
                      max={wallet.balance}
                    />
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-400">Minimum: $50</span>
                    <button className="text-primary-400 hover:text-primary-300">
                      Withdraw All
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Withdrawal Method
                  </label>
                  <select className="input w-full">
                    <option>Bank Transfer (2-3 days)</option>
                    <option>PayPal (Instant)</option>
                    <option>Stripe (1-2 days)</option>
                  </select>
                </div>

                <div className="bg-warning/10 rounded-xl p-4 border border-warning/20">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-warning mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-warning text-sm mb-1">Processing Fee</h5>
                      <p className="text-xs text-gray-400">
                        A 2.9% + $0.30 processing fee applies to all withdrawals.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleWithdraw}
                  className="flex-1 btn btn-primary"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Withdraw
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
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

export default PaymentEscrowSystem
