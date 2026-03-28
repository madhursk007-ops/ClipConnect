import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  Eye,
  Briefcase,
  Clock,
  Target,
  Award,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download
} from 'lucide-react'
import { useAuthStore } from '@store/authStore'
import { useSubscriptionStore } from '@store/subscriptionStore'

const AnalyticsDashboard = ({ className = '' }) => {
  const { user } = useAuthStore()
  const { usage, isPro } = useSubscriptionStore()
  const isEditor = user?.role === 'editor'
  
  const [timeRange, setTimeRange] = useState('7d')
  const [chartRef, chartInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  // Mock analytics data
  const analyticsData = isEditor ? {
    earnings: {
      total: 12540,
      change: 15.3,
      trend: 'up',
      data: [1200, 1500, 1800, 1600, 2000, 2200, 2440]
    },
    projects: {
      total: 47,
      change: 8.2,
      trend: 'up',
      completed: 43,
      inProgress: 4,
      data: [5, 6, 8, 7, 9, 6, 6]
    },
    profile: {
      views: 3420,
      change: 23.5,
      trend: 'up',
      uniqueViews: 2890,
      avgTime: '2m 34s'
    },
    rating: {
      average: 4.9,
      change: 0.2,
      trend: 'up',
      reviews: 127,
      fiveStar: 115,
      fourStar: 10,
      threeStar: 2
    }
  } : {
    spent: {
      total: 18750,
      change: -5.2,
      trend: 'down',
      data: [2500, 2800, 2200, 3100, 2900, 3100, 2150]
    },
    projects: {
      total: 12,
      change: 20.0,
      trend: 'up',
      posted: 12,
      completed: 10,
      active: 2,
      data: [1, 2, 1, 3, 2, 1, 2]
    },
    hiring: {
      totalEditors: 8,
      change: 33.3,
      trend: 'up',
      repeatRate: 75,
      avgTimeToHire: '2.3 days'
    },
    satisfaction: {
      rate: 96,
      change: 4.0,
      trend: 'up',
      successfulProjects: 11
    }
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']

  const StatCard = ({ title, value, change, trend, icon: Icon, color, subtitle }) => {
    const isPositive = trend === 'up'
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className={`flex items-center text-sm ${isPositive ? 'text-success' : 'text-error'}`}>
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 mr-1" />
            )}
            {Math.abs(change)}%
          </div>
        </div>
        <h4 className="text-gray-400 text-sm mb-1">{title}</h4>
        <div className="text-3xl font-bold mb-1">{value}</div>
        {subtitle && <div className="text-sm text-gray-400">{subtitle}</div>}
      </motion.div>
    )
  }

  const MiniChart = ({ data, color, label }) => {
    const max = Math.max(...data)
    
    return (
      <div className="h-16 flex items-end space-x-1">
        {data.map((value, index) => (
          <div
            key={index}
            className="flex-1 rounded-t-sm transition-all duration-300"
            style={{
              height: `${(value / max) * 100}%`,
              background: `linear-gradient(to top, ${color}, ${color}80)`
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold mb-2">Analytics Dashboard</h2>
          <p className="text-gray-400">
            Track your {isEditor ? 'earnings and performance' : 'projects and hiring success'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input bg-dark-800"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
          <button className="btn btn-outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isEditor ? (
          <>
            <StatCard
              title="Total Earnings"
              value={`$${analyticsData.earnings.total.toLocaleString()}`}
              change={analyticsData.earnings.change}
              trend={analyticsData.earnings.trend}
              icon={DollarSign}
              color="bg-gradient-to-r from-success to-green-500"
              subtitle="This month"
            />
            <StatCard
              title="Projects Completed"
              value={analyticsData.projects.total}
              change={analyticsData.projects.change}
              trend={analyticsData.projects.trend}
              icon={Briefcase}
              color="bg-gradient-to-r from-primary-500 to-accent-400"
              subtitle="43 completed, 4 in progress"
            />
            <StatCard
              title="Profile Views"
              value={analyticsData.profile.views.toLocaleString()}
              change={analyticsData.profile.change}
              trend={analyticsData.profile.trend}
              icon={Eye}
              color="bg-gradient-to-r from-blue-500 to-blue-600"
              subtitle={`${analyticsData.profile.uniqueViews.toLocaleString()} unique visitors`}
            />
            <StatCard
              title="Average Rating"
              value={analyticsData.rating.average}
              change={analyticsData.rating.change}
              trend={analyticsData.rating.trend}
              icon={Star}
              color="bg-gradient-to-r from-yellow-500 to-orange-500"
              subtitle={`${analyticsData.rating.reviews} reviews`}
            />
          </>
        ) : (
          <>
            <StatCard
              title="Total Spent"
              value={`$${analyticsData.spent.total.toLocaleString()}`}
              change={analyticsData.spent.change}
              trend={analyticsData.spent.trend}
              icon={DollarSign}
              color="bg-gradient-to-r from-warning to-yellow-500"
              subtitle="This month"
            />
            <StatCard
              title="Projects Posted"
              value={analyticsData.projects.total}
              change={analyticsData.projects.change}
              trend={analyticsData.projects.trend}
              icon={Briefcase}
              color="bg-gradient-to-r from-primary-500 to-accent-400"
              subtitle="10 completed, 2 active"
            />
            <StatCard
              title="Editors Hired"
              value={analyticsData.hiring.totalEditors}
              change={analyticsData.hiring.change}
              trend={analyticsData.hiring.trend}
              icon={Users}
              color="bg-gradient-to-r from-purple-500 to-pink-500"
              subtitle={`${analyticsData.hiring.repeatRate}% repeat rate`}
            />
            <StatCard
              title="Satisfaction Rate"
              value={`${analyticsData.satisfaction.rate}%`}
              change={analyticsData.satisfaction.change}
              trend={analyticsData.satisfaction.trend}
              icon={Award}
              color="bg-gradient-to-r from-green-500 to-emerald-500"
              subtitle="Project success rate"
            />
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div
          ref={chartRef}
          initial={{ opacity: 0, y: 20 }}
          animate={chartInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-morphism rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">
                {isEditor ? 'Earnings Over Time' : 'Spending Overview'}
              </h3>
              <p className="text-sm text-gray-400">
                {isEditor ? 'Daily earnings for this period' : 'Project spending trends'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-accent-400 rounded mr-2" />
                <span className="text-sm text-gray-400">This period</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-600 rounded mr-2" />
                <span className="text-sm text-gray-400">Previous period</span>
              </div>
            </div>
          </div>

          {/* Chart Visualization */}
          <div className="h-64 flex items-end space-x-4">
            {(isEditor ? analyticsData.earnings.data : analyticsData.spent.data).map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex items-end space-x-1">
                  {/* Current Period */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(value / (isEditor ? 2500 : 3500)) * 100}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex-1 bg-gradient-to-t from-primary-500 to-accent-400 rounded-t"
                  />
                </div>
                <span className="text-xs text-gray-400 mt-2">{months[index]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Secondary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={chartInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Quick Stats */}
          <div className="glass-morphism rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">
              {isEditor ? 'Performance Metrics' : 'Hiring Metrics'}
            </h3>
            <div className="space-y-4">
              {isEditor ? (
                <>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">On-time Delivery</span>
                      <span className="text-success font-medium">98%</span>
                    </div>
                    <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                      <div className="h-full bg-success rounded-full" style={{ width: '98%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Client Satisfaction</span>
                      <span className="text-primary-400 font-medium">96%</span>
                    </div>
                    <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full" style={{ width: '96%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Response Rate</span>
                      <span className="text-accent-400 font-medium">92%</span>
                    </div>
                    <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                      <div className="h-full bg-accent-400 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Hire Success Rate</span>
                      <span className="text-success font-medium">94%</span>
                    </div>
                    <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                      <div className="h-full bg-success rounded-full" style={{ width: '94%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Repeat Hire Rate</span>
                      <span className="text-primary-400 font-medium">78%</span>
                    </div>
                    <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Avg Time to Hire</span>
                      <span className="text-accent-400 font-medium">2.3 days</span>
                    </div>
                    <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                      <div className="h-full bg-accent-400 rounded-full" style={{ width: '60%' }} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mini Chart */}
          <div className="glass-morphism rounded-2xl p-6 border border-white/10">
            <h4 className="text-sm font-medium text-gray-400 mb-4">
              {isEditor ? 'Projects Timeline' : 'Posted Projects'}
            </h4>
            <MiniChart 
              data={analyticsData.projects.data} 
              color="#7F5AF0"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>{months[0]}</span>
              <span>{months[months.length - 1]}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Rating Breakdown (Editors Only) */}
      {isEditor && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-morphism rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-semibold mb-4">Rating Breakdown</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <div className="text-center mr-8">
                <div className="text-5xl font-bold text-primary-400 mb-2">
                  {analyticsData.rating.average}
                </div>
                <div className="text-sm text-gray-400">
                  out of 5.0
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {[
                  { stars: 5, count: analyticsData.rating.fiveStar, total: analyticsData.rating.reviews },
                  { stars: 4, count: analyticsData.rating.fourStar, total: analyticsData.rating.reviews },
                  { stars: 3, count: analyticsData.rating.threeStar, total: analyticsData.rating.reviews }
                ].map((rating) => (
                  <div key={rating.stars} className="flex items-center">
                    <span className="text-sm text-gray-400 w-8">{rating.stars}★</span>
                    <div className="flex-1 mx-3">
                      <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(rating.count / rating.total) * 100}%` }}
                          transition={{ duration: 0.5, delay: rating.stars * 0.1 }}
                          className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-400 w-12 text-right">
                      {rating.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-3" />
                  <span>5-star reviews</span>
                </div>
                <span className="text-success font-semibold">
                  {analyticsData.rating.fiveStar} reviews
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-success mr-3" />
                  <span>Rating trend</span>
                </div>
                <span className="text-success font-semibold">
                  +{analyticsData.rating.change}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-primary-400 mr-3" />
                  <span>Total clients</span>
                </div>
                <span className="text-primary-400 font-semibold">
                  {analyticsData.rating.reviews}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Upgrade CTA */}
      {!isPro && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-morphism rounded-2xl p-6 border border-primary-500/30 bg-gradient-to-r from-primary-500/10 to-accent-400/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Unlock Advanced Analytics</h3>
              <p className="text-gray-400">
                Upgrade to Pro to access detailed insights, competitor analysis, and growth predictions.
              </p>
            </div>
            <button className="btn btn-primary mt-4 md:mt-0">
              <TrendingUp className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default AnalyticsDashboard
