import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  DollarSign, 
  Users, 
  Briefcase, 
  Star,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { useAuthStore } from '@store/authStore'

const DashboardPage = () => {
  const { user } = useAuthStore()
  const isEditor = user?.role === 'editor'
  
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [chartRef, chartInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  // Mock data - will be replaced with real API calls
  const stats = [
    {
      title: isEditor ? 'Total Earnings' : 'Total Spent',
      value: isEditor ? '$12,450' : '$8,320',
      change: '+15%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-primary-500 to-accent-400'
    },
    {
      title: isEditor ? 'Projects Completed' : 'Projects Posted',
      value: isEditor ? '47' : '12',
      change: '+8%',
      trend: 'up',
      icon: Briefcase,
      color: 'from-success to-green-400'
    },
    {
      title: isEditor ? 'Average Rating' : 'Active Hires',
      value: isEditor ? '4.9' : '5',
      change: isEditor ? '+0.2' : '+2',
      trend: 'up',
      icon: isEditor ? Star : Users,
      color: 'from-warning to-yellow-400'
    },
    {
      title: isEditor ? 'Pending Projects' : 'Pending Payments',
      value: isEditor ? '3' : '$1,200',
      change: isEditor ? '-1' : '-$500',
      trend: isEditor ? 'down' : 'up',
      icon: isEditor ? Clock : DollarSign,
      color: 'from-error to-red-400'
    }
  ]

  const recentProjects = [
    {
      id: 1,
      title: 'Corporate Video Editing',
      client: 'TechCorp Inc.',
      status: 'in_progress',
      budget: '$2,500',
      deadline: '2024-01-15',
      progress: 75
    },
    {
      id: 2,
      title: 'Social Media Ads',
      client: 'StartupXYZ',
      status: 'completed',
      budget: '$1,800',
      deadline: '2024-01-10',
      progress: 100
    },
    {
      id: 3,
      title: 'Music Video Production',
      client: 'Artist One',
      status: 'pending',
      budget: '$3,200',
      deadline: '2024-01-20',
      progress: 25
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success/20 text-success border-success/30'
      case 'in_progress':
        return 'bg-primary-500/20 text-primary-400 border-primary-500/30'
      case 'pending':
        return 'bg-warning/20 text-warning border-warning/30'
      default:
        return 'bg-dark-800 text-gray-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'in_progress':
        return <Clock className="w-4 h-4" />
      case 'pending':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <XCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="container mx-auto px-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-heading font-bold mb-2">
            Welcome back, <span className="gradient-text">{user?.firstName || 'User'}</span>!
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your {isEditor ? 'editor' : 'client'} account.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0 }}
          animate={statsInView ? { opacity: 1 } : {}}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-morphism rounded-2xl p-6 border border-white/10 hover:border-primary-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center text-sm ${stat.trend === 'up' ? 'text-success' : 'text-error'}`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <motion.div
            ref={chartRef}
            initial={{ opacity: 0, x: -30 }}
            animate={chartInView ? { opacity: 1, x: 0 } : {}}
            className="lg:col-span-2"
          >
            <div className="glass-morphism rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-semibold">
                  {isEditor ? 'Recent Projects' : 'Your Projects'}
                </h2>
                <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={chartInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.1 }}
                    className="bg-dark-800/50 rounded-xl p-4 hover:bg-dark-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold mb-1">{project.title}</h3>
                        <p className="text-gray-400 text-sm">{project.client}</p>
                      </div>
                      <span className={`badge ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                        <span className="ml-1 capitalize">{project.status.replace('_', ' ')}</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{project.budget}</span>
                      <span>Due: {project.deadline}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="h-2 bg-dark-900 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                          className={`h-full rounded-full ${
                            project.progress === 100
                              ? 'bg-gradient-to-r from-success to-green-400'
                              : 'bg-gradient-to-r from-primary-500 to-accent-400'
                          }`}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{project.progress}% Complete</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={chartInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="glass-morphism rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-xl font-heading font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {isEditor ? (
                  <>
                    <button className="w-full btn btn-primary">
                      Browse New Projects
                    </button>
                    <button className="w-full btn btn-outline">
                      Update Portfolio
                    </button>
                    <button className="w-full btn btn-secondary">
                      View Analytics
                    </button>
                  </>
                ) : (
                  <>
                    <button className="w-full btn btn-primary">
                      Post New Project
                    </button>
                    <button className="w-full btn btn-outline">
                      Browse Editors
                    </button>
                    <button className="w-full btn btn-secondary">
                      Make Payment
                    </button>
                  </>
                )}
              </div>
            </motion.div>

            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={chartInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="glass-morphism rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-xl font-heading font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { action: 'Project completed', time: '2 hours ago', icon: CheckCircle },
                  { action: 'New message received', time: '5 hours ago', icon: Users },
                  { action: 'Payment processed', time: '1 day ago', icon: DollarSign },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <activity.icon className="w-4 h-4 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tips Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={chartInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="glass-morphism rounded-2xl p-6 border border-white/10 bg-gradient-to-br from-primary-500/10 to-accent-400/10"
            >
              <h2 className="text-xl font-heading font-semibold mb-4 gradient-text">
                Pro Tips
              </h2>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="text-primary-400 mr-2">•</span>
                  {isEditor 
                    ? 'Keep your portfolio updated to attract more clients'
                    : 'Provide detailed project briefs for better results'}
                </li>
                <li className="flex items-start">
                  <span className="text-primary-400 mr-2">•</span>
                  {isEditor 
                    ? 'Respond to messages promptly to build trust'
                    : 'Communicate clearly with your chosen editor'}
                </li>
                <li className="flex items-start">
                  <span className="text-primary-400 mr-2">•</span>
                  {isEditor 
                    ? 'Deliver high-quality work on time for better reviews'
                    : 'Leave detailed feedback to help editors improve'}
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
