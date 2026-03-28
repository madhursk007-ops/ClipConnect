import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  Briefcase,
  Star,
  Target,
  Zap,
  Award,
  Calendar,
  Clock,
  BarChart3,
  PieChart,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Crown
} from 'lucide-react'
import { useAuthStore } from '@store/authStore'
import { useSubscriptionStore } from '@store/subscriptionStore'
import { useGrowthStore } from '@store/growthStore'
import AIMatchingCard from '@components/AIMatchingCard'
import AnalyticsDashboard from '@components/AnalyticsDashboard'
import TrendingSection from '@components/TrendingSection'
import LeaderboardSystem from '@components/LeaderboardSystem'
import ReferralSystem from '@components/ReferralSystem'

const PremiumDashboard = () => {
  const { user } = useAuthStore()
  const { currentPlan, isPro, usage, fetchSubscription } = useSubscriptionStore()
  const { fetchLeaderboard, fetchBadges, fetchTrending } = useGrowthStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [recentActivity, setRecentActivity] = useState([])

  const isEditor = user?.role === 'editor'

  useEffect(() => {
    fetchSubscription()
    fetchLeaderboard('week', isEditor ? 'editors' : 'clients')
    fetchBadges()
    fetchTrending()
    
    // Mock recent activity
    setRecentActivity([
      {
        type: 'project',
        title: 'New project proposal received',
        time: '2 hours ago',
        icon: Briefcase,
        color: 'text-primary-400'
      },
      {
        type: 'message',
        title: 'Sarah Chen sent you a message',
        time: '4 hours ago',
        icon: Users,
        color: 'text-accent-400'
      },
      {
        type: 'payment',
        title: 'Payment of $2,500 released',
        time: '1 day ago',
        icon: DollarSign,
        color: 'text-success'
      },
      {
        type: 'badge',
        title: 'Earned "Top Rated" badge',
        time: '2 days ago',
        icon: Award,
        color: 'text-yellow-400'
      }
    ])
  }, [fetchSubscription, fetchLeaderboard, fetchBadges, fetchTrending, isEditor])

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'analytics', name: 'Analytics', icon: PieChart },
    { id: 'ai-tools', name: 'AI Tools', icon: Sparkles },
    { id: 'growth', name: 'Growth', icon: TrendingUp },
    { id: 'trending', name: 'Trending', icon: Zap },
    { id: 'leaderboard', name: 'Leaderboard', icon: Crown }
  ]

  const quickActions = isEditor ? [
    { title: 'Find Projects', icon: Briefcase, color: 'from-primary-500 to-accent-400' },
    { title: 'Update Portfolio', icon: Star, color: 'from-success to-green-500' },
    { title: 'View Analytics', icon: BarChart3, color: 'from-warning to-yellow-500' },
    { title: 'Referral Program', icon: Target, color: 'from-purple-500 to-pink-500' }
  ] : [
    { title: 'Post Project', icon: Briefcase, color: 'from-primary-500 to-accent-400' },
    { title: 'Find Editors', icon: Users, color: 'from-success to-green-500' },
    { title: 'View Proposals', icon: Eye, color: 'from-warning to-yellow-500' },
    { title: 'Manage Team', icon: Target, color: 'from-purple-500 to-pink-500' }
  ]

  const QuickActionCard = ({ action, index }) => {
    const Icon = action.icon
    return (
      <motion.div
        key={action.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        className="glass-morphism rounded-xl p-4 border border-white/10 hover:border-primary-500/30 transition-all cursor-pointer"
      >
        <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-3`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h4 className="font-semibold">{action.title}</h4>
        <p className="text-sm text-gray-400 mt-1">
          {isEditor ? 'Manage your editing career' : 'Find the perfect editor'}
        </p>
      </motion.div>
    )
  }

  const ActivityItem = ({ activity, index }) => {
    const Icon = activity.icon
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="flex items-center p-3 bg-dark-800/50 rounded-lg border border-white/10"
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3`}>
          <Icon className={`w-4 h-4 ${activity.color}`} />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">{activity.title}</div>
          <div className="text-xs text-gray-400">{activity.time}</div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.profile?.firstName}! 👋
          </h1>
          <p className="text-gray-400">
            {isEditor ? 'Manage your video editing career' : 'Find and hire top video editors'}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-400">Current Plan</div>
            <div className="flex items-center">
              <span className={`font-semibold ${
                currentPlan?.type === 'premium' ? 'text-yellow-400' :
                currentPlan?.type === 'pro' ? 'text-primary-400' : 'text-gray-400'
              }`}>
                {currentPlan?.name || 'Free'}
              </span>
              {isPro && <Crown className="w-4 h-4 ml-2 text-yellow-400" />}
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-morphism rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">This Month</h3>
                <Calendar className="w-5 h-5 text-primary-400" />
              </div>
              <div className="space-y-3">
                {isEditor ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Projects Completed</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Earnings</span>
                      <span className="font-semibold text-success">$8,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Avg Rating</span>
                      <span className="font-semibold text-yellow-400">4.9</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Projects Posted</span>
                      <span className="font-semibold">5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Spent</span>
                      <span className="font-semibold text-primary-400">$12,300</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Hired Editors</span>
                      <span className="font-semibold">8</span>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Quick Actions</h3>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickActions.map((action, index) => (
                  <QuickActionCard key={action.title} action={action} index={index} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Activity & AI Matching */}
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-morphism rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-2">
                {recentActivity.map((activity, index) => (
                  <ActivityItem key={index} activity={activity} index={index} />
                ))}
              </div>
            </motion.div>

            {isEditor && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <AIMatchingCard />
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AnalyticsDashboard />
        </motion.div>
      )}

      {/* AI Tools Tab */}
      {activeTab === 'ai-tools' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="glass-morphism rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Sparkles className="w-6 h-6 text-primary-400 mr-3" />
              AI-Powered Tools
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-primary-500/10 rounded-xl border border-primary-500/20">
                <h4 className="font-semibold mb-2">Smart Editor Matching</h4>
                <p className="text-sm text-gray-400 mb-3">
                  Get AI-powered recommendations for the perfect editor for your project
                </p>
                <button className="btn btn-primary btn-sm">
                  Try AI Matching
                </button>
              </div>
              <div className="p-4 bg-accent-400/10 rounded-xl border border-accent-400/20">
                <h4 className="font-semibold mb-2">Project Description AI</h4>
                <p className="text-sm text-gray-400 mb-3">
                  Transform your rough ideas into professional project briefs
                </p>
                <button className="btn btn-accent btn-sm">
                  Enhance Description
                </button>
              </div>
              <div className="p-4 bg-success/10 rounded-xl border border-success/20">
                <h4 className="font-semibold mb-2">Portfolio Analyzer</h4>
                <p className="text-sm text-gray-400 mb-3">
                  Get AI insights on your portfolio quality and improvement suggestions
                </p>
                <button className="btn btn-success btn-sm">
                  Analyze Portfolio
                </button>
              </div>
              <div className="p-4 bg-warning/10 rounded-xl border border-warning/20">
                <h4 className="font-semibold mb-2">Smart Pricing</h4>
                <p className="text-sm text-gray-400 mb-3">
                  AI-powered pricing recommendations based on market data
                </p>
                <button className="btn btn-warning btn-sm">
                  Get Pricing Tips
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Growth Tab */}
      {activeTab === 'growth' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ReferralSystem />
        </motion.div>
      )}

      {/* Trending Tab */}
      {activeTab === 'trending' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TrendingSection />
        </motion.div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <LeaderboardSystem />
        </motion.div>
      )}

      {/* Upgrade CTA */}
      {!isPro && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-2xl p-6 border border-primary-500/30 bg-gradient-to-r from-primary-500/10 to-accent-400/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                <Crown className="w-6 h-6 text-yellow-400 mr-3" />
                Upgrade to Pro for Premium Features
              </h3>
              <p className="text-gray-400">
                Unlock AI tools, advanced analytics, unlimited projects, and much more.
              </p>
            </div>
            <button className="btn btn-primary mt-4 md:mt-0">
              <Zap className="w-4 h-4 mr-2" />
              Upgrade Now
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default PremiumDashboard
