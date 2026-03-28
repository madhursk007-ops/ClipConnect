import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  MapPin, 
  Star, 
  DollarSign, 
  Briefcase,
  Clock,
  Award,
  CheckCircle,
  Calendar,
  Globe,
  MessageSquare,
  Heart,
  Share2,
  ExternalLink,
  Play,
  Image as ImageIcon
} from 'lucide-react'

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [overviewRef, overviewInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  // Mock user data
  const user = {
    name: 'Sarah Chen',
    role: 'Video Editor',
    avatar: '/avatars/sarah.jpg',
    banner: '/banners/sarah-banner.jpg',
    location: 'San Francisco, CA',
    memberSince: '2022',
    rating: 4.9,
    reviews: 127,
    hourlyRate: 75,
    completedProjects: 89,
    availability: 'Available now',
    website: 'sarahchen.video',
    bio: 'Professional video editor with 8+ years of experience in corporate and commercial projects. Specializing in storytelling, color grading, and motion graphics. I bring your vision to life with creativity and technical excellence.',
    skills: [
      'Adobe Premiere Pro',
      'After Effects',
      'DaVinci Resolve',
      'Color Grading',
      'Motion Graphics',
      'Sound Design',
      'Final Cut Pro',
      'Cinema 4D'
    ],
    languages: ['English', 'Spanish', 'Mandarin'],
    education: [
      {
        degree: 'BFA in Film & Television',
        institution: 'New York University',
        year: '2015'
      }
    ],
    certifications: [
      'Adobe Certified Expert - Premiere Pro',
      'Blackmagic Design Certified Trainer'
    ]
  }

  const portfolio = [
    {
      id: 1,
      title: 'TechCorp Brand Video',
      category: 'Corporate',
      thumbnail: '/portfolio/techcorp.jpg',
      videoUrl: '#',
      views: '12.5K',
      likes: 89,
      description: 'A 3-minute brand video showcasing TechCorp\'s mission and values.'
    },
    {
      id: 2,
      title: 'Music Festival Aftermovie',
      category: 'Events',
      thumbnail: '/portfolio/festival.jpg',
      videoUrl: '#',
      views: '45.2K',
      likes: 234,
      description: 'High-energy aftermovie capturing the best moments of the festival.'
    },
    {
      id: 3,
      title: 'Product Launch Campaign',
      category: 'Commercial',
      thumbnail: '/portfolio/product.jpg',
      videoUrl: '#',
      views: '28.1K',
      likes: 156,
      description: 'Series of 5 product videos for a major tech launch.'
    },
    {
      id: 4,
      title: 'Documentary Series',
      category: 'Documentary',
      thumbnail: '/portfolio/documentary.jpg',
      videoUrl: '#',
      views: '8.7K',
      likes: 67,
      description: 'A 6-part documentary series on sustainable living.'
    }
  ]

  const reviews = [
    {
      id: 1,
      author: 'John Smith',
      company: 'TechCorp Inc.',
      rating: 5,
      date: '2024-01-05',
      text: 'Sarah exceeded our expectations! The video she delivered was professional, engaging, and perfectly captured our brand voice. Communication was excellent throughout the project.',
      project: 'Corporate Brand Video'
    },
    {
      id: 2,
      author: 'Emily Davis',
      company: 'StartupXYZ',
      rating: 5,
      date: '2023-12-20',
      text: 'Working with Sarah was an absolute pleasure. She understood our vision immediately and delivered a stunning product video. Will definitely hire again!',
      project: 'Product Launch Video'
    },
    {
      id: 3,
      author: 'Michael Brown',
      company: 'Creative Agency',
      rating: 4,
      date: '2023-12-10',
      text: 'Great work on our documentary series. Sarah has an excellent eye for storytelling and pacing. Minor revisions needed but overall fantastic job.',
      project: 'Documentary Editing'
    }
  ]

  const stats = [
    { label: 'Projects Completed', value: user.completedProjects, icon: Briefcase },
    { label: 'Average Rating', value: user.rating, icon: Star },
    { label: 'Hourly Rate', value: `$${user.hourlyRate}`, icon: DollarSign },
    { label: 'Response Time', value: '< 2 hours', icon: Clock }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'services', label: 'Services' }
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Banner */}
      <div className="h-64 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 relative">
        <div className="absolute inset-0 bg-dark-900/20" />
      </div>

      <div className="container mx-auto px-6 -mt-32 relative z-10">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism-strong rounded-2xl p-8 border border-white/20 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Avatar & Info */}
            <div className="flex flex-col md:flex-row gap-6 flex-1">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-r from-primary-500 to-accent-400 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                  {user.name.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full border-4 border-dark-900 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                  <h1 className="text-3xl font-heading font-bold">{user.name}</h1>
                  <span className="badge badge-primary">{user.role}</span>
                </div>

                <p className="text-gray-300 mb-4 max-w-2xl">{user.bio}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {user.location}
                  </span>
                  <span className="flex items-center">
                    <Globe className="w-4 h-4 mr-1" />
                    {user.website}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Member since {user.memberSince}
                  </span>
                  <span className="flex items-center text-success">
                    <Clock className="w-4 h-4 mr-1" />
                    {user.availability}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 lg:w-48">
              <button className="btn btn-primary w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Me
              </button>
              <button className="btn btn-outline w-full">
                <Heart className="w-4 h-4 mr-2" />
                Save Profile
              </button>
              <button className="btn btn-secondary w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className="w-5 h-5 text-primary-400 mr-2" />
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-dark-800 p-1 rounded-xl mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-500 to-accent-400 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Skills */}
                <div className="glass-morphism rounded-2xl p-6 border border-white/10">
                  <h2 className="text-xl font-heading font-semibold mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 bg-dark-800 rounded-lg text-sm text-gray-300 border border-white/10"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education & Certifications */}
                <div className="glass-morphism rounded-2xl p-6 border border-white/10">
                  <h2 className="text-xl font-heading font-semibold mb-4">Education & Certifications</h2>
                  <div className="space-y-4">
                    {user.education.map((edu, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Award className="w-5 h-5 text-primary-400 mt-1" />
                        <div>
                          <h4 className="font-semibold">{edu.degree}</h4>
                          <p className="text-gray-400">{edu.institution}, {edu.year}</p>
                        </div>
                      </div>
                    ))}
                    {user.certifications.map((cert, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-success mt-1" />
                        <div>
                          <h4 className="font-semibold">{cert}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Portfolio */}
                <div className="glass-morphism rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-heading font-semibold">Recent Work</h2>
                    <button
                      onClick={() => setActiveTab('portfolio')}
                      className="text-primary-400 hover:text-primary-300 text-sm"
                    >
                      View All
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {portfolio.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="group relative aspect-video bg-dark-800 rounded-xl overflow-hidden cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent z-10" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-gray-600" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                          <span className="badge badge-primary text-xs mb-2">{item.category}</span>
                          <h4 className="font-semibold">{item.title}</h4>
                          <p className="text-sm text-gray-400">{item.views} views</p>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                            <Play className="w-6 h-6 text-white ml-1" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Languages */}
                <div className="glass-morphism rounded-2xl p-6 border border-white/10">
                  <h2 className="text-xl font-heading font-semibold mb-4">Languages</h2>
                  <div className="space-y-2">
                    {user.languages.map((lang) => (
                      <div key={lang} className="flex items-center">
                        <Globe className="w-4 h-4 text-primary-400 mr-2" />
                        <span>{lang}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Reviews */}
                <div className="glass-morphism rounded-2xl p-6 border border-white/10">
                  <h2 className="text-xl font-heading font-semibold mb-4">Recent Reviews</h2>
                  <div className="space-y-4">
                    {reviews.slice(0, 2).map((review) => (
                      <div key={review.id} className="border-b border-white/10 pb-4 last:border-0">
                        <div className="flex items-center mb-2">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-sm text-gray-300 mb-2 line-clamp-3">{review.text}</p>
                        <p className="text-xs text-gray-400">
                          {review.author} • {review.date}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="w-full mt-4 text-center text-primary-400 hover:text-primary-300 text-sm"
                  >
                    View All Reviews
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-morphism rounded-2xl overflow-hidden border border-white/10 group cursor-pointer"
                >
                  <div className="aspect-video bg-dark-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent z-10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-gray-600" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 z-20">
                      <span className="badge badge-primary">{item.category}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{item.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{item.views} views</span>
                      <span>{item.likes} likes</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-4xl">
              <div className="glass-morphism rounded-2xl p-6 border border-white/10 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-4xl font-bold text-primary-400 mr-4">{user.rating}</div>
                    <div>
                      <div className="flex items-center mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(user.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-400">{user.reviews} reviews</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="glass-morphism rounded-2xl p-6 border border-white/10"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-semibold">
                            {review.author.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{review.author}</h4>
                          <p className="text-sm text-gray-400">{review.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300 mb-3">{review.text}</p>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>Project: {review.project}</span>
                      <span>{review.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="max-w-4xl space-y-6">
              <div className="glass-morphism rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-heading font-semibold mb-4">Video Editing Services</h2>
                <p className="text-gray-300 mb-6">
                  Professional video editing services tailored to your needs. From corporate videos to social media content,
                  I deliver high-quality edits that engage your audience.
                </p>
                <div className="flex items-center justify-between p-4 bg-dark-800 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-400">Starting from</p>
                    <p className="text-2xl font-bold text-primary-400">${user.hourlyRate}/hour</p>
                  </div>
                  <button className="btn btn-primary">
                    Hire Me
                  </button>
                </div>
              </div>

              <div className="glass-morphism rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-heading font-semibold mb-4">Color Grading</h2>
                <p className="text-gray-300 mb-6">
                  Transform your footage with cinematic color grading. I use industry-standard tools to achieve
                  the perfect look for your project.
                </p>
                <div className="flex items-center justify-between p-4 bg-dark-800 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-400">Starting from</p>
                    <p className="text-2xl font-bold text-primary-400">$100/hour</p>
                  </div>
                  <button className="btn btn-primary">
                    Hire Me
                  </button>
                </div>
              </div>

              <div className="glass-morphism rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-heading font-semibold mb-4">Motion Graphics</h2>
                <p className="text-gray-300 mb-6">
                  Add dynamic motion graphics to your videos. From lower thirds to full animated explainer videos,
                  I create engaging visuals that enhance your content.
                </p>
                <div className="flex items-center justify-between p-4 bg-dark-800 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-400">Starting from</p>
                    <p className="text-2xl font-bold text-primary-400">$125/hour</p>
                  </div>
                  <button className="btn btn-primary">
                    Hire Me
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default ProfilePage
