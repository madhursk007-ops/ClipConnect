import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, 
  Crown, 
  Star, 
  TrendingUp, 
  Users,
  Target,
  Award,
  Zap,
  Medal,
  Flame,
  Diamond,
  Calendar,
  Filter
} from 'lucide-react'
import { useGrowthStore } from '@store/growthStore'
import { useAuthStore } from '@store/authStore'

const LeaderboardSystem = ({ className = '' }) => {
  const { 
    leaderboard, 
    fetchLeaderboard, 
    badges, 
    fetchBadges,
    calculateRanking,
    calculateBadges
  } = useGrowthStore()
  
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('weekly')
  const [activeCategory, setActiveCategory] = useState('editors')
  const [timeFilter, setTimeFilter] = useState('week')

  const categories = [
    { id: 'editors', name: 'Top Editors', icon: Star },
    { id: 'clients', name: 'Top Clients', icon: Users }
  ]

  const timeFilters = [
    { id: 'day', name: 'Today' },
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'year', name: 'This Year' }
  ]

  useEffect(() => {
    fetchLeaderboard(timeFilter, activeCategory)
    fetchBadges()
  }, [fetchLeaderboard, fetchBadges, timeFilter, activeCategory])

  // Mock data for demonstration
  const mockLeaderboard = {
    editors: [
      {
        id: 1,
        name: 'Sarah Chen',
        avatar: '/avatars/sarah.jpg',
        rating: 4.9,
        completedProjects: 127,
        earnings: 15420,
        rank: 1,
        change: 2,
        badges: ['elite', 'top-rated', 'speed-demon'],
        stats: {
          onTimeDelivery: 98,
          clientSatisfaction: 96,
          responseRate: 92
        }
      },
      {
        id: 2,
        name: 'Marcus Johnson',
        avatar: '/avatars/marcus.jpg',
        rating: 4.8,
        completedProjects: 94,
        earnings: 12350,
        rank: 2,
        change: -1,
        badges: ['veteran', 'client-favorite'],
        stats: {
          onTimeDelivery: 95,
          clientSatisfaction: 94,
          responseRate: 88
        }
      },
      {
        id: 3,
        name: 'Elena Rodriguez',
        avatar: '/avatars/elena.jpg',
        rating: 5.0,
        completedProjects: 156,
        earnings: 18900,
        rank: 3,
        change: 1,
        badges: ['elite', 'centurion'],
        stats: {
          onTimeDelivery: 99,
          clientSatisfaction: 98,
          responseRate: 95
        }
      },
      {
        id: 4,
        name: 'James Wilson',
        avatar: '/avatars/james.jpg',
        rating: 4.7,
        completedProjects: 78,
        earnings: 8900,
        rank: 4,
        change: 0,
        badges: ['veteran'],
        stats: {
          onTimeDelivery: 92,
          clientSatisfaction: 90,
          responseRate: 85
        }
      },
      {
        id: 5,
        name: 'Lisa Anderson',
        avatar: '/avatars/lisa.jpg',
        rating: 4.9,
        completedProjects: 112,
        earnings: 13400,
        rank: 5,
        change: 3,
        badges: ['top-rated', 'speed-demon'],
        stats: {
          onTimeDelivery: 97,
          clientSatisfaction: 95,
          responseRate: 91
        }
      }
    ],
    clients: [
      {
        id: 1,
        name: 'TechCorp Inc.',
        avatar: '/avatars/techcorp.jpg',
        rating: 4.8,
        projectsPosted: 45,
        totalSpent: 28900,
        rank: 1,
        change: 1,
        badges: ['power-client', 'repeat-customer'],
        stats: {
          hireSuccess: 94,
          avgProjectValue: 642,
          repeatRate: 78
        }
      },
      {
        id: 2,
        name: 'Creative Agency',
        avatar: '/avatars/agency.jpg',
        rating: 4.9,
        projectsPosted: 67,
        totalSpent: 45600,
        rank: 2,
        change: -2,
        badges: ['power-client'],
        stats: {
          hireSuccess: 96,
          avgProjectValue: 680,
          repeatRate: 82
        }
      }
    ]
  }

  const currentLeaderboard = leaderboard[`${timeFilter}_${activeCategory}`] || 
    mockLeaderboard[activeCategory] || []

  const getUserRank = () => {
    if (!user) return null
    return currentLeaderboard.find(item => item.id === user.id)
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />
      case 3:
        return <Medal className="w-6 h-6 text-orange-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-400">#{rank}</span>
    }
  }

  const getBadgeIcon = (badgeId) => {
    switch (badgeId) {
      case 'elite':
        return <Diamond className="w-4 h-4" />
      case 'top-rated':
        return <Star className="w-4 h-4" />
      case 'speed-demon':
        return <Zap className="w-4 h-4" />
      case 'centurion':
        return <Trophy className="w-4 h-4" />
      case 'veteran':
        return <Award className="w-4 h-4" />
      case 'client-favorite':
        return <Heart className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  const getBadgeColor = (badgeId) => {
    switch (badgeId) {
      case 'elite':
        return 'from-yellow-500 to-orange-500'
      case 'top-rated':
        return 'from-primary-500 to-accent-400'
      case 'speed-demon':
        return 'from-success to-green-500'
      case 'centurion':
        return 'from-blue-500 to-purple-500'
      case 'veteran':
        return 'from-gray-500 to-gray-600'
      case 'client-favorite':
        return 'from-error to-pink-500'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-success" />
    if (change < 0) return <TrendingUp className="w-4 h-4 text-error rotate-180" />
    return <div className="w-4 h-4" />
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
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Leaderboard</h3>
              <p className="text-sm text-gray-400">Top performers this {timeFilter}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="badge badge-primary text-xs">
              <Flame className="w-3 h-3 mr-1" />
              Live Rankings
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Category Tabs */}
          <div className="flex space-x-1 bg-dark-800 p-1 rounded-xl flex-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-primary-500 to-accent-400 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <category.icon className="w-4 h-4 mr-2" />
                {category.name}
              </button>
            ))}
          </div>

          {/* Time Filter */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="input bg-dark-800 text-sm"
            >
              {timeFilters.map((filter) => (
                <option key={filter.id} value={filter.id}>
                  {filter.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Top 3 Podium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {currentLeaderboard.slice(0, 3).map((user, index) => {
          const rank = index + 1
          const isUserRank = getUserRank()?.id === user.id

          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`glass-morphism rounded-2xl p-6 border text-center ${
                rank === 1
                  ? 'border-yellow-500/50 shadow-glow'
                  : rank === 2
                  ? 'border-gray-400/50'
                  : 'border-orange-600/50'
              } ${isUserRank ? 'ring-2 ring-primary-500/50' : ''}`}
            >
              {/* Rank Badge */}
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                rank === 1
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                  : rank === 2
                  ? 'bg-gradient-to-r from-gray-400 to-gray-600'
                  : 'bg-gradient-to-r from-orange-600 to-red-600'
              }`}>
                {getRankIcon(rank)}
              </div>

              {/* User Info */}
              <div className="mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl font-bold">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <h4 className="font-semibold text-lg">{user.name}</h4>
                <div className="flex items-center justify-center text-sm text-gray-400">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  {user.rating}
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-2 mb-4">
                {activeCategory === 'editors' ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Projects</span>
                      <span className="font-semibold">{user.completedProjects}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Earnings</span>
                      <span className="font-semibold text-primary-400">${user.earnings.toLocaleString()}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Projects Posted</span>
                      <span className="font-semibold">{user.projectsPosted}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Spent</span>
                      <span className="font-semibold text-primary-400">${user.totalSpent.toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Badges */}
              {user.badges && user.badges.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1 mb-4">
                  {user.badges.slice(0, 2).map((badge) => (
                    <div
                      key={badge}
                      className={`w-8 h-8 bg-gradient-to-r ${getBadgeColor(badge)} rounded-full flex items-center justify-center`}
                      title={badge.replace('-', ' ')}
                    >
                      {getBadgeIcon(badge)}
                    </div>
                  ))}
                </div>
              )}

              {/* Rank Change */}
              <div className="flex items-center justify-center text-sm">
                {getChangeIcon(user.change)}
                <span className={`ml-1 ${
                  user.change > 0 ? 'text-success' : user.change < 0 ? 'text-error' : 'text-gray-400'
                }`}>
                  {user.change > 0 ? `+${user.change}` : user.change < 0 ? user.change : 'No change'}
                </span>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Full Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-morphism rounded-2xl p-6 border border-white/10"
      >
        <h4 className="text-lg font-semibold mb-4">Full Rankings</h4>
        <div className="space-y-3">
          {currentLeaderboard.map((user, index) => {
            const rank = index + 1
            const isUserRank = getUserRank()?.id === user.id

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  isUserRank ? 'border-primary-500/50 bg-primary-500/10' : 'border-white/10'
                } hover:border-white/20 transition-all`}
              >
                <div className="flex items-center flex-1">
                  {/* Rank */}
                  <div className="w-10 h-10 flex items-center justify-center mr-4">
                    {getRankIcon(rank)}
                  </div>

                  {/* User Info */}
                  <div className="flex items-center flex-1">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold">{user.name}</h5>
                      <div className="flex items-center text-sm text-gray-400">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        {user.rating}
                        {user.badges && user.badges.length > 0 && (
                          <div className="flex ml-2 gap-1">
                            {user.badges.slice(0, 3).map((badge) => (
                              <div
                                key={badge}
                                className={`w-5 h-5 bg-gradient-to-r ${getBadgeColor(badge)} rounded-full flex items-center justify-center`}
                                title={badge.replace('-', ' ')}
                              >
                                {getBadgeIcon(badge)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-6 text-right">
                  {activeCategory === 'editors' ? (
                    <>
                      <div>
                        <div className="text-lg font-bold">{user.completedProjects}</div>
                        <div className="text-xs text-gray-400">Projects</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-primary-400">${user.earnings.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">Earnings</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="text-lg font-bold">{user.projectsPosted}</div>
                        <div className="text-xs text-gray-400">Posted</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-primary-400">${user.totalSpent.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">Spent</div>
                      </div>
                    </>
                  )}
                  
                  {/* Rank Change */}
                  <div className="flex items-center">
                    {getChangeIcon(user.change)}
                    <span className={`ml-1 text-sm ${
                      user.change > 0 ? 'text-success' : user.change < 0 ? 'text-error' : 'text-gray-400'
                    }`}>
                      {user.change > 0 ? `+${user.change}` : user.change < 0 ? user.change : '0'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Your Ranking */}
      {getUserRank() && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-morphism rounded-2xl p-6 border border-primary-500/50 bg-primary-500/10"
        >
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <Target className="w-5 h-5 text-primary-400 mr-2" />
            Your Ranking
          </h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold text-lg">
                  {getUserRank().rank}
                </span>
              </div>
              <div>
                <h5 className="font-semibold">You</h5>
                <div className="flex items-center text-sm text-gray-400">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  {getUserRank().rating}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary-400">
                {activeCategory === 'editors' 
                  ? `$${getUserRank().earnings?.toLocaleString() || 0}`
                  : `${getUserRank().totalSpent?.toLocaleString() || 0}`
                }
              </div>
              <div className="text-xs text-gray-400">
                {activeCategory === 'editors' ? 'Total Earnings' : 'Total Spent'}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default LeaderboardSystem
