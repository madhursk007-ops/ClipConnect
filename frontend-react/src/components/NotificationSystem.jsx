import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  MessageSquare, 
  DollarSign, 
  Briefcase, 
  User, 
  Star,
  CheckCircle,
  AlertTriangle,
  Info,
  Check,
  Trash2,
  Settings,
  X,
  Clock,
  Filter,
  Mail,
  Smartphone
} from 'lucide-react'
import { useSocketStore } from '@store/socketStore'
import { useAuthStore } from '@store/authStore'
import toast from 'react-hot-toast'

const NotificationSystem = ({ className = '' }) => {
  const { 
    notifications, 
    isConnected,
    markNotificationRead,
    markAsRead,
    getUnreadCount,
    clearNotifications
  } = useSocketStore()
  
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('all')
  const [filter, setFilter] = useState('all')
  const [showSettings, setShowSettings] = useState(false)

  // Mock notifications for demonstration
  const [localNotifications, setLocalNotifications] = useState([
    {
      id: 1,
      type: 'message',
      title: 'New Message',
      body: 'Sarah Chen sent you a message about the Corporate Video project',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
      isRead: false,
      avatar: '/avatars/sarah.jpg',
      action: {
        type: 'navigate',
        target: '/chat',
        label: 'View Message'
      }
    },
    {
      id: 2,
      type: 'proposal',
      title: 'New Proposal Received',
      body: 'Marcus Johnson submitted a proposal for your Music Video project',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
      isRead: false,
      avatar: '/avatars/marcus.jpg',
      action: {
        type: 'navigate',
        target: '/project/3',
        label: 'Review Proposal'
      }
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Successful',
      body: 'Payment of $2,500 has been released for TechCorp Brand Video',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      isRead: true,
      icon: DollarSign,
      action: {
        type: 'navigate',
        target: '/dashboard',
        label: 'View Transaction'
      }
    },
    {
      id: 4,
      type: 'badge',
      title: 'Badge Unlocked!',
      body: 'Congratulations! You earned the "Top Rated" badge',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      isRead: true,
      icon: Star,
      action: {
        type: 'navigate',
        target: '/profile',
        label: 'View Profile'
      }
    },
    {
      id: 5,
      type: 'system',
      title: 'Welcome to ClipConnect Pro',
      body: 'Your Pro subscription is now active. Enjoy unlimited projects!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      isRead: true,
      icon: CheckCircle,
      action: {
        type: 'navigate',
        target: '/subscription',
        label: 'Manage Subscription'
      }
    }
  ])

  const displayNotifications = notifications.length > 0 ? notifications : localNotifications

  const unreadCount = displayNotifications.filter(n => !n.isRead).length

  const filteredNotifications = displayNotifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.isRead
    return notification.type === filter
  })

  const handleMarkRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId)
      toast.success('Marked as read')
    } catch (error) {
      // Update local state
      setLocalNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      )
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAsRead()
      toast.success('All notifications marked as read')
    } catch (error) {
      setLocalNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      )
    }
  }

  const handleDelete = (notificationId) => {
    setLocalNotifications(prev =>
      prev.filter(n => n.id !== notificationId)
    )
    toast.success('Notification deleted')
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = (now - date) / 1000 // seconds

    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
    return date.toLocaleDateString()
  }

  const getNotificationIcon = (type, icon) => {
    if (icon) return icon
    
    switch (type) {
      case 'message':
        return MessageSquare
      case 'proposal':
        return Briefcase
      case 'payment':
        return DollarSign
      case 'badge':
        return Star
      case 'system':
        return CheckCircle
      case 'warning':
        return AlertTriangle
      case 'info':
        return Info
      default:
        return Bell
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'message':
        return 'bg-primary-500/20 text-primary-400'
      case 'proposal':
        return 'bg-accent-400/20 text-accent-400'
      case 'payment':
        return 'bg-success/20 text-success'
      case 'badge':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'system':
        return 'bg-gray-500/20 text-gray-400'
      case 'warning':
        return 'bg-error/20 text-error'
      case 'info':
        return 'bg-primary-500/20 text-primary-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const notificationTypes = [
    { id: 'all', name: 'All', count: displayNotifications.length },
    { id: 'unread', name: 'Unread', count: unreadCount },
    { id: 'message', name: 'Messages', icon: MessageSquare },
    { id: 'proposal', name: 'Proposals', icon: Briefcase },
    { id: 'payment', name: 'Payments', icon: DollarSign }
  ]

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
            <div className="relative w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center mr-4">
              <Bell className="w-6 h-6 text-white" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-error rounded-full flex items-center justify-center text-xs font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold">Notifications</h3>
              <p className="text-sm text-gray-400">
                {unreadCount} unread of {displayNotifications.length} total
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className="btn btn-outline btn-sm"
            >
              <Check className="w-4 h-4 mr-2" />
              Mark All Read
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="btn btn-secondary btn-sm"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </button>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center mb-6">
          <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-success' : 'bg-error'}`} />
          <span className="text-sm text-gray-400">
            {isConnected ? 'Real-time notifications connected' : 'Disconnected - check connection'}
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 overflow-x-auto">
          {notificationTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setFilter(type.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                filter === type.id
                  ? 'bg-gradient-to-r from-primary-500 to-accent-400 text-white'
                  : 'bg-dark-800 text-gray-400 hover:text-white'
              }`}
            >
              {type.icon && <type.icon className="w-4 h-4 mr-2" />}
              {type.name}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                filter === type.id ? 'bg-white/20' : 'bg-dark-700'
              }`}>
                {type.count}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        {filteredNotifications.length === 0 ? (
          <div className="glass-morphism rounded-2xl p-12 border border-white/10 text-center">
            <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-gray-500" />
            </div>
            <h4 className="text-lg font-semibold mb-2">No notifications</h4>
            <p className="text-gray-400">
              {filter === 'all' 
                ? 'You\'re all caught up! No new notifications.'
                : 'No notifications match your current filter.'
              }
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredNotifications.map((notification, index) => {
              const Icon = getNotificationIcon(notification.type, notification.icon)
              const isUnread = !notification.isRead

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`glass-morphism rounded-xl p-4 border transition-all cursor-pointer group ${
                    isUnread 
                      ? 'border-primary-500/30 bg-primary-500/5' 
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start">
                    {/* Icon/Avatar */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 ${
                      getNotificationColor(notification.type)
                    }`}>
                      {notification.avatar ? (
                        <div className="w-full h-full rounded-xl overflow-hidden">
                          <img 
                            src={notification.avatar} 
                            alt="" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 mr-4">
                          <div className="flex items-center mb-1">
                            <h4 className={`font-semibold ${isUnread ? 'text-white' : 'text-gray-300'}`}>
                              {notification.title}
                            </h4>
                            {isUnread && (
                              <div className="w-2 h-2 bg-primary-500 rounded-full ml-2" />
                            )}
                          </div>
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {notification.body}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTimestamp(notification.timestamp)}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {isUnread && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMarkRead(notification.id)
                              }}
                              className="p-2 text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(notification.id)
                            }}
                            className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Action Button */}
                      {notification.action && (
                        <button className="mt-3 text-sm text-primary-400 hover:text-primary-300 transition-colors">
                          {notification.action.label}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </motion.div>

      {/* Notification Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-morphism-strong rounded-2xl p-6 max-w-md w-full mx-4 border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Notification Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Email Notifications */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Email Notifications
                  </h4>
                  <div className="space-y-3">
                    {[
                      { id: 'email_messages', label: 'New messages', default: true },
                      { id: 'email_proposals', label: 'Project proposals', default: true },
                      { id: 'email_payments', label: 'Payment updates', default: true },
                      { id: 'email_updates', label: 'Platform updates', default: false }
                    ].map((setting) => (
                      <label key={setting.id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">{setting.label}</span>
                        <input
                          type="checkbox"
                          defaultChecked={setting.default}
                          className="checkbox-custom"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Push Notifications */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <Smartphone className="w-5 h-5 mr-2" />
                    Push Notifications
                  </h4>
                  <div className="space-y-3">
                    {[
                      { id: 'push_messages', label: 'New messages', default: true },
                      { id: 'push_mentions', label: 'Mentions', default: true },
                      { id: 'push_deadlines', label: 'Deadline reminders', default: true }
                    ].map((setting) => (
                      <label key={setting.id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">{setting.label}</span>
                        <input
                          type="checkbox"
                          defaultChecked={setting.default}
                          className="checkbox-custom"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <h4 className="font-medium mb-3">Email Digest Frequency</h4>
                  <select className="input w-full">
                    <option value="immediate">Immediately</option>
                    <option value="hourly">Every hour</option>
                    <option value="daily">Daily digest</option>
                    <option value="weekly">Weekly digest</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 btn btn-primary"
                >
                  Save Settings
                </button>
                <button
                  onClick={() => setShowSettings(false)}
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

export default NotificationSystem
