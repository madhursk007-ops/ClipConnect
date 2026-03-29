import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  DollarSign,
  Award,
  Clock,
  ChevronDown,
  X
} from 'lucide-react';
import { useAuth } from '@hooks';

const Marketplace = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    skills: [],
    hourlyRate: '',
    rating: '',
    availability: ''
  });

  // Mock editors data
  const editors = [
    {
      _id: '1',
      profile: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        bio: 'Professional video editor specializing in commercials and social content.',
        location: 'Los Angeles, CA',
        avatar: null
      },
      editorProfile: {
        skills: ['Video Editing', 'Color Grading', 'After Effects'],
        hourlyRate: 75,
        experience: '8 years',
        availability: 'Full-time'
      },
      ratings: 4.9,
      totalReviews: 127,
      completedProjects: 156
    },
    {
      _id: '2',
      profile: {
        firstName: 'Michael',
        lastName: 'Chen',
        bio: 'Cinematic storytelling expert. Documentary and narrative film specialist.',
        location: 'New York, NY',
        avatar: null
      },
      editorProfile: {
        skills: ['Documentary', 'Premiere Pro', 'DaVinci Resolve'],
        hourlyRate: 85,
        experience: '10 years',
        availability: 'Part-time'
      },
      ratings: 4.8,
      totalReviews: 89,
      completedProjects: 98
    },
    {
      _id: '3',
      profile: {
        firstName: 'Emma',
        lastName: 'Wilson',
        bio: 'Motion graphics designer and video editor. Creating eye-catching content.',
        location: 'London, UK',
        avatar: null
      },
      editorProfile: {
        skills: ['Motion Graphics', 'Animation', 'After Effects'],
        hourlyRate: 65,
        experience: '5 years',
        availability: 'Full-time'
      },
      ratings: 4.9,
      totalReviews: 64,
      completedProjects: 82
    },
    {
      _id: '4',
      profile: {
        firstName: 'David',
        lastName: 'Park',
        bio: 'YouTube and social media content specialist. Fast turnaround times.',
        location: 'Seoul, Korea',
        avatar: null
      },
      editorProfile: {
        skills: ['Social Media', 'YouTube', 'Fast Editing'],
        hourlyRate: 45,
        experience: '4 years',
        availability: 'Full-time'
      },
      ratings: 4.7,
      totalReviews: 112,
      completedProjects: 145
    },
    {
      _id: '5',
      profile: {
        firstName: 'Lisa',
        lastName: 'Anderson',
        bio: 'Corporate video and training content expert. Professional and reliable.',
        location: 'Chicago, IL',
        avatar: null
      },
      editorProfile: {
        skills: ['Corporate', 'Training Videos', 'Final Cut Pro'],
        hourlyRate: 55,
        experience: '6 years',
        availability: 'Part-time'
      },
      ratings: 4.8,
      totalReviews: 76,
      completedProjects: 93
    },
    {
      _id: '6',
      profile: {
        firstName: 'James',
        lastName: 'Martinez',
        bio: 'Music video editor and colorist. Creative and artistic approach.',
        location: 'Miami, FL',
        avatar: null
      },
      editorProfile: {
        skills: ['Music Videos', 'Color Grading', 'Cinematography'],
        hourlyRate: 90,
        experience: '12 years',
        availability: 'Full-time'
      },
      ratings: 5.0,
      totalReviews: 43,
      completedProjects: 67
    }
  ];

  const skillOptions = ['Video Editing', 'Color Grading', 'After Effects', 'Premiere Pro', 'Motion Graphics', 'Animation', 'DaVinci Resolve', 'Social Media', 'YouTube', 'Corporate'];
  const rateOptions = ['Under $50', '$50-$75', '$75-$100', '$100+'];
  const ratingOptions = ['4.5+', '4.7+', '4.9+'];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div {...fadeInUp} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Find Expert Video Editors
          </h1>
          <p className="text-gray-400">
            Browse {editors.length}+ professional video editors ready to bring your vision to life
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by skill, name, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-dark-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3.5 bg-dark-800 border border-white/10 rounded-xl text-white hover:bg-white/5 transition-all flex items-center justify-center"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
              <ChevronDown className={`w-4 h-4 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-6 bg-dark-800 rounded-xl border border-white/10"
            >
              <div className="grid md:grid-cols-3 gap-6">
                {/* Skills Filter */}
                <div>
                  <label className="text-white font-medium mb-3 block">Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {skillOptions.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => {
                          setFilters(prev => ({
                            ...prev,
                            skills: prev.skills.includes(skill)
                              ? prev.skills.filter(s => s !== skill)
                              : [...prev.skills, skill]
                          }));
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          filters.skills.includes(skill)
                            ? 'bg-primary-500 text-white'
                            : 'bg-dark-700 text-gray-400 hover:text-white'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hourly Rate */}
                <div>
                  <label className="text-white font-medium mb-3 block">Hourly Rate</label>
                  <div className="space-y-2">
                    {rateOptions.map((rate) => (
                      <label key={rate} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="rate"
                          value={rate}
                          checked={filters.hourlyRate === rate}
                          onChange={(e) => setFilters({ ...filters, hourlyRate: e.target.value })}
                          className="w-4 h-4 text-primary-500 border-white/10 bg-dark-700"
                        />
                        <span className="ml-2 text-gray-400">{rate}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="text-white font-medium mb-3 block">Minimum Rating</label>
                  <div className="space-y-2">
                    {ratingOptions.map((rating) => (
                      <label key={rating} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          value={rating}
                          checked={filters.rating === rating}
                          onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                          className="w-4 h-4 text-primary-500 border-white/10 bg-dark-700"
                        />
                        <span className="ml-2 text-gray-400 flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          {rating}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-6 pt-6 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => {
                    setFilters({ skills: [], hourlyRate: '', rating: '', availability: '' });
                    setSearchQuery('');
                  }}
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear all filters
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {editors.map((editor, index) => (
            <motion.div
              key={editor._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-morphism rounded-2xl border border-white/5 overflow-hidden hover:border-primary-500/20 transition-all duration-300 group"
            >
              {/* Card Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center">
                    <span className="text-xl font-bold text-white">
                      {editor.profile.firstName[0]}{editor.profile.lastName[0]}
                    </span>
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="flex items-center px-3 py-1 bg-yellow-500/10 rounded-full">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-yellow-400 font-semibold text-sm">{editor.ratings}</span>
                    <span className="text-gray-500 text-sm ml-1">({editor.totalReviews})</span>
                  </div>
                </div>

                {/* Name & Title */}
                <h3 className="text-xl font-semibold text-white mb-1">
                  {editor.profile.firstName} {editor.profile.lastName}
                </h3>
                <p className="text-primary-400 text-sm mb-3">Video Editor</p>

                {/* Bio */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {editor.profile.bio}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {editor.editorProfile.skills.slice(0, 3).map((skill) => (
                    <span 
                      key={skill}
                      className="px-2 py-1 bg-dark-700 text-gray-300 text-xs rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                  {editor.editorProfile.skills.length > 3 && (
                    <span className="px-2 py-1 bg-dark-700 text-gray-300 text-xs rounded-md">
                      +{editor.editorProfile.skills.length - 3}
                    </span>
                  )}
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {editor.profile.location}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {editor.editorProfile.experience}
                  </span>
                </div>

                {/* Rate & Projects */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div>
                    <span className="text-2xl font-bold text-white">${editor.editorProfile.hourlyRate}</span>
                    <span className="text-gray-400 text-sm">/hr</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-semibold">{editor.completedProjects}</span>
                    <span className="text-gray-400 text-sm ml-1">projects</span>
                  </div>
                </div>
              </div>

              {/* Card Footer - Actions */}
              <div className="p-4 bg-dark-800/50 border-t border-white/5">
                <div className="flex gap-3">
                  <Link
                    to={`/profile/${editor._id}`}
                    className="flex-1 py-2.5 bg-dark-700 text-white text-sm font-medium rounded-lg text-center hover:bg-dark-600 transition-colors"
                  >
                    View Profile
                  </Link>
                  <button className="flex-1 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all">
                    Hire Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <button className="px-8 py-3 border border-white/10 text-white rounded-xl hover:bg-white/5 transition-all">
            Load More Editors
          </button>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
