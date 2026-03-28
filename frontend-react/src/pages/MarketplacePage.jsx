import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Search, 
  Filter, 
  Star, 
  DollarSign, 
  MapPin,
  Clock,
  CheckCircle,
  Briefcase,
  User,
  ChevronDown,
  Grid,
  List,
  Heart
} from 'lucide-react'

const MarketplacePage = () => {
  const [viewMode, setViewMode] = useState('grid')
  const [activeTab, setActiveTab] = useState('editors')
  const [searchRef, searchInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  // Mock data for editors
  const editors = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Video Editor',
      avatar: '/avatars/sarah.jpg',
      rating: 4.9,
      reviews: 127,
      hourlyRate: 75,
      skills: ['Premiere Pro', 'After Effects', 'Color Grading'],
      location: 'San Francisco, CA',
      availability: 'Available now',
      completedProjects: 89,
      badge: 'Top Rated',
      bio: 'Professional video editor with 8+ years experience in corporate and commercial projects.'
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      role: 'Motion Designer',
      avatar: '/avatars/marcus.jpg',
      rating: 4.8,
      reviews: 94,
      hourlyRate: 85,
      skills: ['After Effects', 'Cinema 4D', 'Blender', 'Motion Graphics'],
      location: 'New York, NY',
      availability: 'Available in 2 days',
      completedProjects: 67,
      badge: 'Expert',
      bio: 'Award-winning motion designer specializing in brand animations and visual effects.'
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      role: 'Video Producer',
      avatar: '/avatars/elena.jpg',
      rating: 5.0,
      reviews: 156,
      hourlyRate: 95,
      skills: ['Final Cut Pro', 'DaVinci Resolve', 'Storytelling', 'Documentary'],
      location: 'Los Angeles, CA',
      availability: 'Available now',
      completedProjects: 124,
      badge: 'Premium',
      bio: 'Experienced video producer with a passion for storytelling and documentary filmmaking.'
    },
    {
      id: 4,
      name: 'James Wilson',
      role: 'Colorist',
      avatar: '/avatars/james.jpg',
      rating: 4.9,
      reviews: 78,
      hourlyRate: 80,
      skills: ['DaVinci Resolve', 'Color Grading', 'Film Look', 'HDR'],
      location: 'London, UK',
      availability: 'Available now',
      completedProjects: 95,
      badge: 'Expert',
      bio: 'Professional colorist with expertise in cinematic color grading and film emulation.'
    }
  ]

  // Mock data for projects
  const projects = [
    {
      id: 1,
      title: 'Corporate Video Editing',
      description: 'Looking for an experienced editor to create a 3-minute corporate promotional video.',
      budget: '$2,500 - $3,500',
      deadline: '2 weeks',
      posted: '2 days ago',
      proposals: 12,
      skills: ['Premiere Pro', 'After Effects', 'Motion Graphics'],
      client: 'TechCorp Inc.',
      location: 'Remote'
    },
    {
      id: 2,
      title: 'YouTube Channel Editor',
      description: 'Need a long-term editor for weekly tech review videos (10-15 min each).',
      budget: '$500 - $800',
      deadline: 'Ongoing',
      posted: '1 day ago',
      proposals: 28,
      skills: ['YouTube Editing', 'Fast Turnaround', 'SEO'],
      client: 'TechReview Channel',
      location: 'Remote'
    },
    {
      id: 3,
      title: 'Music Video Production',
      description: 'Create a visually stunning music video for an indie rock band.',
      budget: '$5,000 - $8,000',
      deadline: '1 month',
      posted: '3 days ago',
      proposals: 15,
      skills: ['Music Videos', 'Creative Direction', 'Color Grading'],
      client: 'Indie Rock Band',
      location: 'Los Angeles, CA'
    }
  ]

  const categories = [
    'All Categories',
    'Video Editing',
    'Motion Graphics',
    'Color Grading',
    'Audio Editing',
    'VFX',
    'Animation'
  ]

  const priceRanges = [
    'All Prices',
    '$0 - $50/hr',
    '$50 - $100/hr',
    '$100 - $200/hr',
    '$200+/hr'
  ]

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={searchRef}
          initial={{ opacity: 0, y: -20 }}
          animate={searchInView ? { opacity: 1, y: 0 } : {}}
          className="mb-8"
        >
          <h1 className="text-4xl font-heading font-bold mb-2">
            <span className="gradient-text">Marketplace</span>
          </h1>
          <p className="text-gray-400">
            Find top video editors or browse available projects
          </p>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={searchInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="glass-morphism rounded-2xl p-6 border border-white/10 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                className="input pl-10 w-full"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select className="input cursor-pointer min-w-[140px]">
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select className="input cursor-pointer min-w-[140px]">
                {priceRanges.map((range) => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>

              <button className="btn btn-secondary flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-1 bg-dark-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('editors')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'editors'
                  ? 'bg-gradient-to-r from-primary-500 to-accent-400 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Find Editors
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'projects'
                  ? 'bg-gradient-to-r from-primary-500 to-accent-400 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Browse Projects
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'editors' ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {editors.map((editor, index) => (
              <motion.div
                key={editor.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-morphism rounded-2xl p-6 border border-white/10 hover:border-primary-500/30 transition-all cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center mr-3">
                      <User className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{editor.name}</h3>
                      <p className="text-gray-400 text-sm">{editor.role}</p>
                    </div>
                  </div>
                  <span className={`badge ${
                    editor.badge === 'Top Rated' ? 'badge-primary' :
                    editor.badge === 'Premium' ? 'badge-accent' : 'badge-success'
                  }`}>
                    {editor.badge}
                  </span>
                </div>

                {/* Rating & Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                    <span className="font-semibold">{editor.rating}</span>
                    <span className="text-gray-400 text-sm ml-1">({editor.reviews})</span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Briefcase className="w-4 h-4 mr-1" />
                    {editor.completedProjects} projects
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-2xl font-bold text-primary-400">
                    ${editor.hourlyRate}
                  </span>
                  <span className="text-gray-400">/hr</span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {editor.skills.slice(0, 3).map((skill) => (
                    <span 
                      key={skill} 
                      className="text-xs bg-dark-800 px-2 py-1 rounded-lg text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                  {editor.skills.length > 3 && (
                    <span className="text-xs bg-dark-800 px-2 py-1 rounded-lg text-gray-400">
                      +{editor.skills.length - 3}
                    </span>
                  )}
                </div>

                {/* Location & Availability */}
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {editor.location}
                  </div>
                  <div className="flex items-center text-success">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {editor.availability}
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {editor.bio}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 btn btn-primary">
                    Hire Now
                  </button>
                  <button className="btn btn-outline p-2">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-morphism rounded-2xl p-6 border border-white/10 hover:border-primary-500/30 transition-all cursor-pointer"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-xl">{project.title}</h3>
                      <span className="badge badge-primary">{project.posted}</span>
                    </div>
                    <p className="text-gray-400 mb-3">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.skills.map((skill) => (
                        <span 
                          key={skill}
                          className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded-lg"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {project.client}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {project.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col lg:items-end gap-3">
                    <div className="text-2xl font-bold text-primary-400">
                      {project.budget}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {project.deadline}
                      </span>
                      <span className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {project.proposals} proposals
                      </span>
                    </div>
                    <button className="btn btn-primary w-full lg:w-auto">
                      Apply Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="btn btn-outline btn-lg">
            Load More
            <ChevronDown className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MarketplacePage
