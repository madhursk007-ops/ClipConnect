import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Flame,
  Star,
  Eye,
  Clock,
  ArrowRight,
  Zap,
  Award,
  Users,
  DollarSign,
  Briefcase
} from 'lucide-react'
import { useGrowthStore } from '@store/growthStore'
import { useInView } from 'react-intersection-observer'

const TrendingSection = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('editors')
  const [trendingRef, trendingInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  // Mock trending data
  const trendingData = {
    editors: [
      {
        id: 1,
        name: 'Sarah Chen',
        role: 'Video Editor',
        avatar: '/avatars/sarah.jpg',
        rating: 4.9,
        reviews: 127,
        hourlyRate: 75,
        trendingScore: 98,
        growthRate: 45,
        recentProjects: 8,
        skills: ['Premiere Pro', 'After Effects'],
        badge: 'Hot 🔥',
        views: 2340
      },
      {
        id: 2,
        name: 'Marcus Johnson',
        role: 'Motion Designer',
        avatar: '/avatars/marcus.jpg',
        rating: 4.8,
        reviews: 94,
        hourlyRate: 85,
        trendingScore: 95,
        growthRate: 38,
        recentProjects: 6,
        skills: ['After Effects', 'Cinema 4D'],
        badge: 'Rising ⬆️',
        views: 1890
      },
      {
        id: 3,
        name: 'Elena Rodriguez',
        role: 'Video Producer',
        avatar: '/avatars/elena.jpg',
        rating: 5.0,
        reviews: 156,
        hourlyRate: 95,
        trendingScore: 93,
        growthRate: 32,
        recentProjects: 7,
        skills: ['Final Cut Pro', 'DaVinci'],
        badge: 'Elite 💎',
        views: 2150
      },
      {
        id: 4,
        name: 'James Wilson',
        role: 'Colorist',
        avatar: '/avatars/james.jpg',
        rating: 4.9,
        reviews: 78,
        hourlyRate: 80,
        trendingScore: 91,
        growthRate: 28,
        recentProjects: 5,
        skills: ['DaVinci Resolve', 'Color Grading'],
        badge: 'Expert ⭐',
        views: 1420
      }
    ],
    projects: [
      {
        id: 1,
        title: 'YouTube Channel Editor Needed',
        client: 'TechReview Channel',
        budget: '$500 - $800',
        proposals: 28,
        views: 450,
        trendingScore: 96,
        posted: '2 hours ago',
        skills: ['YouTube Editing', 'Fast Turnaround']
      },
      {
        id: 2,
        title: 'Corporate Brand Video',
        client: 'StartupXYZ',
        budget: '$2,500 - $3,500',
        proposals: 15,
        views: 320,
        trendingScore: 94,
        posted: '4 hours ago',
        skills: ['Corporate Video', 'Motion Graphics']
      },
      {
        id: 3,
        title: 'Music Video Production',
        client: 'Indie Rock Band',
        budget: '$5,000 - $8,000',
        proposals: 22,
        views: 680,
        trendingScore: 92,
        posted: '6 hours ago',
        skills: ['Music Videos', 'Creative Direction']
      },
      {
        id: 4,
        title: 'Social Media Content Creator',
        client: 'Fashion Brand',
        budget: '$1,000 - $1,500',
        proposals: 35,
        views: 520,
        trendingScore: 90,
        posted: '8 hours ago',
        skills: ['Social Media', 'TikTok/Reels']
      }
    ]
  }

  const getTrendingColor = (score) => {
    if (score >= 95) return 'from-red-500 to-orange-500'
    if (score >= 90) return 'from-orange-500 to-yellow-500'
    if (score >= 85) return 'from-yellow-500 to-green-500'
    return 'from-green-500 to-blue-500'
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Trending Now</h3>
            <p className="text-sm text-gray-400">What's hot this week</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-dark-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('editors')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center ${
              activeTab === 'editors'
                ? 'bg-gradient-to-r from-primary-500 to-accent-400 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Star className="w-4 h-4 mr-2" />
            Trending Editors
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center ${
              activeTab === 'projects'
                ? 'bg-gradient-to-r from-primary-500 to-accent-400 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Hot Projects
          </button>
        </div>
      </motion.div>

      {/* Trending Grid */}
      <motion.div
        ref={trendingRef}
        initial={{ opacity: 0 }}
        animate={trendingInView ? { opacity: 1 } : {}}
        className="grid md:grid-cols-2 gap-4"
      >
        {activeTab === 'editors' ? (
          trendingData.editors.map((editor, index) => (
            <motion.div
              key={editor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={trendingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-morphism rounded-2xl p-5 border border-white/10 hover:border-primary-500/30 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xl font-bold">
                      {editor.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{editor.name}</h4>
                    <p className="text-sm text-gray-400">{editor.role}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="badge badge-accent text-xs mb-1">
                    {editor.badge}
                  </span>
                  <div className={`text-xs font-bold bg-gradient-to-r ${getTrendingColor(editor.trendingScore)} bg-clip-text text-transparent`}>
                    #{index + 1} Trending
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 bg-dark-800/50 rounded-lg">
                  <div className="flex items-center justify-center text-yellow-400">
                    <Star className="w-4 h-4 fill-current mr-1" />
                    {editor.rating}
                  </div>
                  <div className="text-xs text-gray-400">{editor.reviews} reviews</div>
                </div>
                <div className="text-center p-2 bg-dark-800/50 rounded-lg">
                  <div className="text-primary-400 font-semibold">
                    ${editor.hourlyRate}/hr
                  </div>
                  <div className="text-xs text-gray-400">Hourly Rate</div>
                </div>
                <div className="text-center p-2 bg-dark-800/50 rounded-lg">
                  <div className="flex items-center justify-center text-success">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +{editor.growthRate}%
                  </div>
                  <div className="text-xs text-gray-400">This Week</div>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {editor.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Trending Score Bar */}
              <div className="relative">
                <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${getTrendingColor(editor.trendingScore)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${editor.trendingScore}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-400">Trending Score</span>
                  <span className="font-semibold">{editor.trendingScore}/100</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center text-sm text-gray-400">
                  <Eye className="w-4 h-4 mr-1" />
                  {editor.views.toLocaleString()} views
                </div>
                <button className="btn btn-primary btn-sm">
                  View Profile
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          trendingData.projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={trendingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-morphism rounded-2xl p-5 border border-white/10 hover:border-primary-500/30 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="badge badge-warning text-xs mb-2 inline-block">
                    <Flame className="w-3 h-3 mr-1" />
                    Hot Project
                  </span>
                  <h4 className="font-semibold text-lg">{project.title}</h4>
                  <p className="text-sm text-gray-400">{project.client}</p>
                </div>
                <div className={`text-xs font-bold bg-gradient-to-r ${getTrendingColor(project.trendingScore)} bg-clip-text text-transparent`}>
                  #{index + 1}
                </div>
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 bg-dark-800/50 rounded-lg">
                  <div className="text-primary-400 font-semibold">{project.budget}</div>
                  <div className="text-xs text-gray-400">Budget</div>
                </div>
                <div className="text-center p-2 bg-dark-800/50 rounded-lg">
                  <div className="text-accent-400 font-semibold">{project.proposals}</div>
                  <div className="text-xs text-gray-400">Proposals</div>
                </div>
                <div className="text-center p-2 bg-dark-800/50 rounded-lg">
                  <div className="flex items-center justify-center text-success">
                    <Clock className="w-4 h-4 mr-1" />
                    {project.posted.replace(' ago', '')}
                  </div>
                  <div className="text-xs text-gray-400">Posted</div>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-accent-400/20 text-accent-400 px-2 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Trending Score Bar */}
              <div className="relative">
                <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${getTrendingColor(project.trendingScore)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${project.trendingScore}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-400">Popularity Score</span>
                  <span className="font-semibold">{project.trendingScore}/100</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center text-sm text-gray-400">
                  <Eye className="w-4 h-4 mr-1" />
                  {project.views} views
                </div>
                <button className="btn btn-primary btn-sm">
                  Apply Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={trendingInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="glass-morphism rounded-xl p-4 border border-white/10 text-center">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-400 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold">2,847</div>
          <div className="text-xs text-gray-400">Active Editors</div>
        </div>
        <div className="glass-morphism rounded-xl p-4 border border-white/10 text-center">
          <div className="w-10 h-10 bg-gradient-to-r from-success to-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold">156</div>
          <div className="text-xs text-gray-400">New Projects Today</div>
        </div>
        <div className="glass-morphism rounded-xl p-4 border border-white/10 text-center">
          <div className="w-10 h-10 bg-gradient-to-r from-warning to-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-2">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold">$2.4M</div>
          <div className="text-xs text-gray-400">Total Volume</div>
        </div>
        <div className="glass-morphism rounded-xl p-4 border border-white/10 text-center">
          <div className="w-10 h-10 bg-gradient-to-r from-accent-400 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold">98%</div>
          <div className="text-xs text-gray-400">Success Rate</div>
        </div>
      </motion.div>
    </div>
  )
}

export default TrendingSection
