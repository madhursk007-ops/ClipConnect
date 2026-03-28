import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal,
  MapPin,
  DollarSign,
  Star,
  Clock,
  Briefcase,
  ChevronDown,
  Sparkles,
  TrendingUp,
  History,
  Zap,
  Target,
  Users,
  Award
} from 'lucide-react'
import { useAIStore } from '@store/aiStore'
import { useGrowthStore } from '@store/growthStore'
import toast from 'react-hot-toast'

const AdvancedSearchDiscovery = ({ 
  onSearch, 
  initialQuery = '', 
  searchType = 'editors',
  className = '' 
}) => {
  const [query, setQuery] = useState(initialQuery)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [recentSearches, setRecentSearches] = useState([
    'video editor',
    'motion graphics',
    'color grading',
    'corporate video'
  ])
  const [trendingSearches, setTrendingSearches] = useState([
    'youtube editor',
    'tiktok video',
    'commercial editing',
    'documentary'
  ])
  const inputRef = useRef(null)

  const [filters, setFilters] = useState({
    skills: [],
    budget: { min: 0, max: 1000 },
    rating: 0,
    location: '',
    availability: 'any',
    experience: 'any',
    language: [],
    tools: []
  })

  const [activeFilters, setActiveFilters] = useState(0)

  const skillsList = [
    'Adobe Premiere Pro', 'After Effects', 'Final Cut Pro', 'DaVinci Resolve',
    'Motion Graphics', 'Color Grading', 'Sound Design', 'Video Editing',
    'Animation', 'VFX', '3D Modeling', 'Storytelling'
  ]

  const locations = [
    'Remote', 'United States', 'United Kingdom', 'Canada', 
    'Australia', 'Germany', 'France', 'India', 'Philippines'
  ]

  const experienceLevels = [
    { id: 'entry', name: 'Entry Level (0-2 years)', value: 'entry' },
    { id: 'intermediate', name: 'Intermediate (3-5 years)', value: 'intermediate' },
    { id: 'expert', name: 'Expert (6+ years)', value: 'expert' }
  ]

  const availabilityOptions = [
    { id: 'any', name: 'Any Availability' },
    { id: 'now', name: 'Available Now' },
    { id: 'week', name: 'Available This Week' },
    { id: 'month', name: 'Available This Month' }
  ]

  useEffect(() => {
    // Count active filters
    let count = 0
    if (filters.skills.length > 0) count++
    if (filters.budget.min > 0 || filters.budget.max < 1000) count++
    if (filters.rating > 0) count++
    if (filters.location) count++
    if (filters.availability !== 'any') count++
    if (filters.experience !== 'any') count++
    setActiveFilters(count)
  }, [filters])

  const handleSearch = () => {
    if (!query.trim()) {
      toast.error('Please enter a search term')
      return
    }

    onSearch?.({ query, filters })
    
    // Add to recent searches
    if (!recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)])
    }
    
    toast.success(`Searching for "${query}"...`)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const toggleSkill = (skill) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const clearFilters = () => {
    setFilters({
      skills: [],
      budget: { min: 0, max: 1000 },
      rating: 0,
      location: '',
      availability: 'any',
      experience: 'any',
      language: [],
      tools: []
    })
    toast.success('Filters cleared')
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
    handleSearch()
  }

  const removeRecentSearch = (search, e) => {
    e.stopPropagation()
    setRecentSearches(prev => prev.filter(s => s !== search))
  }

  // Generate search suggestions based on query
  useEffect(() => {
    if (query.length > 2) {
      const mockSuggestions = [
        `${query} editor`,
        `${query} specialist`,
        `professional ${query}`,
        `experienced ${query}`
      ]
      setSuggestions(mockSuggestions)
    } else {
      setSuggestions([])
    }
  }, [query])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="glass-morphism-strong rounded-2xl p-2 border border-white/20">
          <div className="flex items-center">
            <div className="flex items-center flex-1">
              <div className="pl-4 pr-3">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsExpanded(true)}
                placeholder={`Search ${searchType}...`}
                className="flex-1 bg-transparent py-3 text-white placeholder-gray-400 focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-2 rounded-xl mr-2 transition-colors ${
                showFilters || activeFilters > 0
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilters > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full">
                  {activeFilters}
                </span>
              )}
            </button>

            {/* Search Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              className="btn btn-primary px-6"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Search
            </motion.button>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {isExpanded && (suggestions.length > 0 || recentSearches.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 glass-morphism-strong rounded-xl border border-white/20 overflow-hidden z-50"
            >
              {/* AI Suggestions */}
              {suggestions.length > 0 && (
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center text-sm text-primary-400 mb-3">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Suggestions
                  </div>
                  <div className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm"
                      >
                        <span className="text-gray-400">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center text-sm text-gray-400 mb-3">
                    <History className="w-4 h-4 mr-2" />
                    Recent Searches
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-dark-800 rounded-full px-3 py-1 text-sm"
                      >
                        <button
                          onClick={() => handleSuggestionClick(search)}
                          className="text-gray-300 hover:text-white"
                        >
                          {search}
                        </button>
                        <button
                          onClick={(e) => removeRecentSearch(search, e)}
                          className="ml-2 text-gray-500 hover:text-error"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending */}
              <div className="p-4 border-t border-white/10 bg-primary-500/5">
                <div className="flex items-center text-sm text-primary-400 mb-3">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trending Now
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="badge badge-primary text-xs cursor-pointer"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-morphism rounded-2xl p-6 border border-white/10 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold flex items-center">
                <Target className="w-5 h-5 text-primary-400 mr-2" />
                Advanced Filters
              </h4>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-400 hover:text-white"
              >
                Clear All
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Skills Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Skills
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {skillsList.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1 rounded-full text-xs transition-colors ${
                        filters.skills.includes(skill)
                          ? 'bg-primary-500 text-white'
                          : 'bg-dark-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Budget Range
                </label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>${filters.budget.min}</span>
                    <span>${filters.budget.max}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.budget.max}
                    onChange={(e) => handleFilterChange('budget', { 
                      ...filters.budget, 
                      max: parseInt(e.target.value) 
                    })}
                    className="w-full"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.budget.min}
                      onChange={(e) => handleFilterChange('budget', { 
                        ...filters.budget, 
                        min: parseInt(e.target.value) 
                      })}
                      className="input w-1/2 text-sm"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={filters.budget.max}
                      onChange={(e) => handleFilterChange('budget', { 
                        ...filters.budget, 
                        max: parseInt(e.target.value) 
                      })}
                      className="input w-1/2 text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>

              {/* Minimum Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Minimum Rating
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleFilterChange('rating', star)}
                      className={`p-2 rounded-lg transition-colors ${
                        filters.rating >= star
                          ? 'text-yellow-400'
                          : 'text-gray-600'
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {filters.rating > 0 ? `${filters.rating}+ stars only` : 'Any rating'}
                </p>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="input w-full"
                >
                  <option value="">Any Location</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Experience Level
                </label>
                <select
                  value={filters.experience}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                  className="input w-full"
                >
                  <option value="any">Any Experience</option>
                  {experienceLevels.map((level) => (
                    <option key={level.id} value={level.value}>{level.name}</option>
                  ))}
                </select>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Availability
                </label>
                <select
                  value={filters.availability}
                  onChange={(e) => handleFilterChange('availability', e.target.value)}
                  className="input w-full"
                >
                  {availabilityOptions.map((option) => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Summary */}
            {activeFilters > 0 && (
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-400">Active filters:</span>
                  {filters.skills.map((skill) => (
                    <span key={skill} className="badge badge-primary text-xs">
                      {skill}
                      <button
                        onClick={() => toggleSkill(skill)}
                        className="ml-1 hover:text-error"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {filters.rating > 0 && (
                    <span className="badge badge-primary text-xs">
                      {filters.rating}+ stars
                    </span>
                  )}
                  {filters.location && (
                    <span className="badge badge-primary text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      {filters.location}
                    </span>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-4 text-sm text-gray-400"
      >
        <div className="flex items-center">
          <Zap className="w-4 h-4 mr-2 text-yellow-400" />
          Pro tip: Use multiple keywords for better results
        </div>
        <div className="flex items-center">
          <Award className="w-4 h-4 mr-2 text-primary-400" />
          Filter by verified badges for trusted results
        </div>
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-2 text-accent-400" />
          {Math.floor(Math.random() * 500 + 1000)} editors available now
        </div>
      </motion.div>
    </div>
  )
}

export default AdvancedSearchDiscovery
