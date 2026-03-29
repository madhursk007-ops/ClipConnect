import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  DollarSign, 
  Briefcase,
  MapPin,
  Calendar,
  User,
  CheckCircle,
  MessageSquare,
  Send,
  Paperclip
} from 'lucide-react';
import { useAuth } from '@hooks';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isEditor = user?.role === 'editor';

  // Mock project data
  const project = {
    _id: id,
    title: 'Brand Commercial Video',
    description: 'We need a professional 30-second commercial video for our new product launch. The video should be high-energy, modern, and appeal to a young professional audience. We have existing brand assets and footage that can be used. The final deliverable should include 16:9, 9:16, and 1:1 aspect ratios for different platforms.\n\nRequirements:\n- Professional color grading\n- Motion graphics for text overlays\n- Background music selection\n- Sound design and mixing\n- 3 revision rounds included',
    status: 'open',
    budget: 1500,
    deadline: '2026-04-15',
    category: 'Commercial',
    createdAt: '2026-03-20',
    client: {
      _id: 'client1',
      name: 'Tech Corp',
      profile: {
        firstName: 'John',
        lastName: 'Smith',
        location: 'San Francisco, CA',
        avatar: null
      }
    },
    requirements: ['Adobe Premiere Pro', 'After Effects', 'Color Grading', 'Sound Design'],
    proposals: 5,
    views: 127
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link 
        to="/projects" 
        className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Projects
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-morphism p-8 rounded-2xl border border-white/5"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="inline-block px-3 py-1 bg-green-500/10 text-green-400 text-sm font-medium rounded-full border border-green-500/20 mb-3">
                  <CheckCircle className="w-3 h-3 inline mr-1" />
                  Open for Proposals
                </span>
                <h1 className="text-3xl font-bold text-white">{project.title}</h1>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">${project.budget.toLocaleString()}</p>
                <p className="text-gray-400">Budget</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-6 pb-6 border-b border-white/5">
              <span className="flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                {project.category}
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Posted {new Date(project.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Deadline: {new Date(project.deadline).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {project.views} views
              </span>
              <span className="flex items-center">
                <Send className="w-4 h-4 mr-2" />
                {project.proposals} proposals
              </span>
            </div>

            <div className="prose prose-invert max-w-none">
              <h3 className="text-xl font-semibold text-white mb-3">Project Description</h3>
              <p className="text-gray-300 whitespace-pre-line">{project.description}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {project.requirements.map((skill) => (
                  <span 
                    key={skill}
                    className="px-4 py-2 bg-primary-500/10 text-primary-400 text-sm rounded-full border border-primary-500/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Proposals Section (for client) */}
          {!isEditor && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-morphism p-6 rounded-2xl border border-white/5"
            >
              <h3 className="text-xl font-semibold text-white mb-6">Proposals ({project.proposals})</h3>
              
              <div className="space-y-4">
                {[1, 2, 3].map((proposal) => (
                  <div key={proposal} className="p-4 bg-dark-800/50 rounded-xl border border-white/5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center">
                        <span className="text-lg font-bold text-white">E{proposal}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-semibold">Editor {proposal}</h4>
                          <span className="text-primary-400 font-semibold">${1000 + proposal * 200}</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">
                          I have extensive experience in commercial video editing. I can deliver high-quality work within your timeline...
                        </p>
                        <div className="flex items-center gap-3">
                          <button className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors">
                            View Profile
                          </button>
                          <button className="px-4 py-2 bg-dark-700 text-white text-sm rounded-lg hover:bg-dark-600 transition-colors">
                            Message
                          </button>
                          <button className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors">
                            Accept Proposal
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-morphism p-6 rounded-2xl border border-white/5"
          >
            <h3 className="text-lg font-semibold text-white mb-4">About the Client</h3>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {project.client.profile.firstName[0]}{project.client.profile.lastName[0]}
                </span>
              </div>
              <div>
                <p className="text-white font-semibold">
                  {project.client.profile.firstName} {project.client.profile.lastName}
                </p>
                <p className="text-gray-400 text-sm">{project.client.name}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-400">
              <p className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {project.client.profile.location}
              </p>
              <p className="flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                12 projects posted
              </p>
              <p className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Member since 2021
              </p>
            </div>

            <button className="w-full mt-4 py-2.5 border border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Client
            </button>
          </motion.div>

          {/* Apply Card (for editors) */}
          {isEditor && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-morphism p-6 rounded-2xl border border-white/5"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Submit a Proposal</h3>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Your Bid ($)</label>
                  <input
                    type="number"
                    placeholder="1500"
                    className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Estimated Time</label>
                  <select className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500/50">
                    <option>Less than 1 week</option>
                    <option>1-2 weeks</option>
                    <option>2-4 weeks</option>
                    <option>1-2 months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Cover Letter</label>
                  <textarea
                    rows={4}
                    placeholder="Describe why you're the best fit for this project..."
                    className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 p-3 bg-dark-800 rounded-lg">
                  <Paperclip className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-400">Attach portfolio samples</span>
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all">
                  Submit Proposal
                </button>
              </form>
            </motion.div>
          )}

          {/* Project Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-morphism p-6 rounded-2xl border border-white/5"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Project Stats</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Views</span>
                <span className="text-white font-semibold">{project.views}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Proposals</span>
                <span className="text-white font-semibold">{project.proposals}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Interviewing</span>
                <span className="text-white font-semibold">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Invites sent</span>
                <span className="text-white font-semibold">8</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
