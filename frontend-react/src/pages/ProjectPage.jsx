import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  DollarSign, 
  Clock, 
  Calendar, 
  User, 
  Briefcase,
  MapPin,
  CheckCircle,
  MessageSquare,
  Send,
  Paperclip,
  MoreVertical,
  Edit,
  Trash2,
  Flag
} from 'lucide-react'

const ProjectPage = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('details')
  const [messageInput, setMessageInput] = useState('')

  // Mock project data
  const project = {
    id: id,
    title: 'Corporate Video Editing - TechCorp Brand Campaign',
    description: `We are looking for an experienced video editor to create a compelling 3-minute corporate brand video for TechCorp. The video should showcase our company culture, values, and recent achievements.

Key Requirements:
- Professional editing with smooth transitions
- Color grading to match our brand guidelines
- Motion graphics for titles and lower thirds
- Background music selection and audio mixing
- 2-3 rounds of revisions included

The ideal candidate should have:
- 5+ years of corporate video editing experience
- Strong portfolio of similar work
- Proficiency in Adobe Premiere Pro and After Effects
- Excellent communication skills
- Ability to meet tight deadlines

We will provide:
- Raw footage (approximately 2 hours)
- Brand guidelines and style guide
- Script and shot list
- Company logos and assets
- Reference videos for inspiration`,
    status: 'open',
    budget: '$2,500 - $3,500',
    postedDate: '2024-01-10',
    deadline: '2024-01-25',
    duration: '2 weeks',
    location: 'Remote',
    proposals: 12,
    views: 156,
    skills: ['Adobe Premiere Pro', 'After Effects', 'Color Grading', 'Motion Graphics', 'Audio Editing'],
    client: {
      name: 'TechCorp Inc.',
      avatar: '/avatars/techcorp.jpg',
      location: 'San Francisco, CA',
      memberSince: '2021',
      completedProjects: 45,
      rating: 4.8
    }
  }

  // Mock proposals
  const proposals = [
    {
      id: 1,
      editor: {
        name: 'Sarah Chen',
        avatar: '/avatars/sarah.jpg',
        rating: 4.9,
        reviews: 127
      },
      bidAmount: '$3,000',
      deliveryTime: '10 days',
      coverLetter: `Hello! I'm excited about your project. With 8+ years of experience in corporate video editing, I've worked with numerous tech companies to create compelling brand videos.

My approach:
1. Initial consultation to understand your vision
2. Rough cut within 3 days
3. Color grading and motion graphics
4. Final delivery with all formats

I look forward to discussing this project with you!`,
      status: 'pending'
    },
    {
      id: 2,
      editor: {
        name: 'Marcus Johnson',
        avatar: '/avatars/marcus.jpg',
        rating: 4.8,
        reviews: 94
      },
      bidAmount: '$2,800',
      deliveryTime: '12 days',
      coverLetter: `Hi! I specialize in corporate brand videos and have created content for several Fortune 500 companies. My workflow ensures high-quality results within your timeline.

What I offer:
- Professional editing with cinematic transitions
- Custom motion graphics
- Audio enhancement and music selection
- Unlimited revisions within reason

Let's create something amazing together!`,
      status: 'pending'
    }
  ]

  // Mock messages
  const messages = [
    {
      id: 1,
      sender: 'client',
      text: 'Hi Sarah! Thanks for your proposal. I\'d like to discuss the project details with you.',
      timestamp: '2024-01-10T14:30:00'
    },
    {
      id: 2,
      sender: 'editor',
      text: 'Hello! I\'d be happy to discuss the project. When would be a good time for a call?',
      timestamp: '2024-01-10T15:15:00'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-success/20 text-success border-success/30'
      case 'in_progress':
        return 'bg-primary-500/20 text-primary-400 border-primary-500/30'
      case 'completed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default:
        return 'bg-dark-800 text-gray-400'
    }
  }

  const handleSendMessage = () => {
    if (!messageInput.trim()) return
    // Handle sending message
    setMessageInput('')
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="container mx-auto px-6">
        {/* Back Button */}
        <Link
          to="/marketplace"
          className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Project Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-morphism rounded-2xl p-8 border border-white/10 mb-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`badge ${getStatusColor(project.status)} mb-3`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                  <h1 className="text-3xl font-heading font-bold">{project.title}</h1>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Posted {project.postedDate}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {project.duration}
                </span>
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {project.location}
                </span>
                <span className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-1" />
                  {project.proposals} proposals
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-dark-800 p-1 rounded-xl mb-6">
              {['details', 'proposals', 'messages'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all capitalize ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-primary-500 to-accent-400 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-morphism rounded-2xl p-8 border border-white/10"
            >
              {activeTab === 'details' && (
                <div>
                  <h2 className="text-xl font-heading font-semibold mb-4">Project Description</h2>
                  <div className="prose prose-invert max-w-none">
                    {project.description.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-300 mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/10">
                    <h2 className="text-xl font-heading font-semibold mb-4">Activity</h2>
                    <div className="space-y-4">
                      <div className="flex items-center text-gray-400">
                        <div className="w-8 h-8 bg-dark-800 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4" />
                        </div>
                        <span>Project posted by {project.client.name}</span>
                        <span className="ml-auto text-sm">{project.postedDate}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <div className="w-8 h-8 bg-dark-800 rounded-full flex items-center justify-center mr-3">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <span>{project.proposals} proposals received</span>
                        <span className="ml-auto text-sm">Last 24 hours</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'proposals' && (
                <div className="space-y-6">
                  {proposals.map((proposal) => (
                    <div
                      key={proposal.id}
                      className="border border-white/10 rounded-xl p-6 hover:border-primary-500/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center mr-4">
                            <span className="text-white font-semibold">
                              {proposal.editor.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold">{proposal.editor.name}</h3>
                            <div className="flex items-center text-sm text-gray-400">
                              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                              <span>{proposal.editor.rating}</span>
                              <span className="mx-1">•</span>
                              <span>{proposal.editor.reviews} reviews</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary-400">{proposal.bidAmount}</p>
                          <p className="text-sm text-gray-400">{proposal.deliveryTime}</p>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4 whitespace-pre-line">
                        {proposal.coverLetter}
                      </p>

                      <div className="flex gap-3">
                        <button className="btn btn-primary">
                          Hire Editor
                        </button>
                        <button className="btn btn-outline">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'messages' && (
                <div>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                            message.sender === 'client'
                              ? 'bg-gradient-to-r from-primary-500 to-accent-400 text-white'
                              : 'bg-dark-800 text-white'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-3 pt-4 border-t border-white/10">
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 input"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSendMessage()
                      }}
                    />
                    <button
                      onClick={handleSendMessage}
                      className="p-3 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl text-white"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Budget Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-morphism rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-lg font-semibold mb-4">Project Budget</h3>
              <div className="flex items-center mb-4">
                <DollarSign className="w-8 h-8 text-primary-400 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{project.budget}</p>
                  <p className="text-sm text-gray-400">Fixed price</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <span>Deadline</span>
                <span>{project.deadline}</span>
              </div>
              <button className="w-full btn btn-primary mb-3">
                Submit Proposal
              </button>
              <button className="w-full btn btn-outline">
                <Heart className="w-4 h-4 mr-2" />
                Save Project
              </button>
            </motion.div>

            {/* Client Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-morphism rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-lg font-semibold mb-4">About the Client</h3>
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-xl font-semibold">
                    {project.client.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold">{project.client.name}</h4>
                  <div className="flex items-center text-sm text-gray-400">
                    <MapPin className="w-4 h-4 mr-1" />
                    {project.client.location}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-dark-800 rounded-lg">
                  <p className="text-xl font-bold text-primary-400">{project.client.rating}</p>
                  <p className="text-xs text-gray-400">Rating</p>
                </div>
                <div className="text-center p-3 bg-dark-800 rounded-lg">
                  <p className="text-xl font-bold text-primary-400">{project.client.completedProjects}</p>
                  <p className="text-xs text-gray-400">Projects</p>
                </div>
              </div>

              <p className="text-sm text-gray-400 text-center">
                Member since {project.client.memberSince}
              </p>

              <button className="w-full mt-4 btn btn-secondary">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Client
              </button>
            </motion.div>

            {/* Share Project */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-morphism rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-lg font-semibold mb-4">Share Project</h3>
              <div className="flex space-x-2">
                <button className="flex-1 btn btn-outline text-sm">
                  Copy Link
                </button>
                <button className="flex-1 btn btn-outline text-sm">
                  Share
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectPage
