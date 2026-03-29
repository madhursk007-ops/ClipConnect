import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  DollarSign, 
  Briefcase,
  ChevronDown,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@hooks';

const Projects = () => {
  const { user } = useAuth();
  const isEditor = user?.role === 'editor';
  const isClient = user?.role === 'client';

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock projects data
  const projects = [
    {
      _id: '1',
      title: 'Brand Commercial Video',
      description: 'Need a 30-second commercial for our new product launch.',
      status: 'open',
      budget: 1500,
      deadline: '2026-04-15',
      category: 'Commercial',
      client: { name: 'Tech Corp', avatar: null },
      proposals: 5,
      createdAt: '2026-03-20'
    },
    {
      _id: '2',
      title: 'YouTube Channel Intro',
      description: 'Create an engaging intro sequence for my gaming channel.',
      status: 'in-progress',
      budget: 800,
      deadline: '2026-04-10',
      category: 'YouTube',
      client: { name: 'Gaming Studio', avatar: null },
      editor: { name: 'Sarah Johnson', avatar: null },
      proposals: 0,
      createdAt: '2026-03-18'
    },
    {
      _id: '3',
      title: 'Music Video Editing',
      description: 'Edit a 4-minute music video with color grading and effects.',
      status: 'open',
      budget: 2500,
      deadline: '2026-04-30',
      category: 'Music',
      client: { name: 'Artist Records', avatar: null },
      proposals: 12,
      createdAt: '2026-03-15'
    },
    {
      _id: '4',
      title: 'Corporate Training Video',
      description: 'Edit 10 training videos for employee onboarding.',
      status: 'completed',
      budget: 3000,
      deadline: '2026-03-20',
      category: 'Corporate',
      client: { name: 'Enterprise Inc', avatar: null },
      editor: { name: 'Mike Chen', avatar: null },
      proposals: 0,
      createdAt: '2026-02-28'
    },
    {
      _id: '5',
      title: 'Social Media Content Package',
      description: 'Create 20 short-form videos for Instagram and TikTok.',
      status: 'open',
      budget: 1200,
      deadline: '2026-04-05',
      category: 'Social Media',
      client: { name: 'Fashion Brand', avatar: null },
      proposals: 8,
      createdAt: '2026-03-22'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-green-500/10 text-green-400 border-green-500/20',
      'in-progress': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      completed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      cancelled: 'bg-red-500/10 text-red-400 border-red-500/20'
    };
    return colors[status] || colors.open;
  };

  const getStatusIcon = (status) => {
    const icons = {
      open: AlertCircle,
      'in-progress': Clock,
      completed: CheckCircle,
      cancelled: XCircle
    };
    return icons[status] || AlertCircle;
  };

  const filteredProjects = filterStatus === 'all' 
    ? projects 
    : projects.filter(p => p.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 mt-1">
            {isClient ? 'Manage your posted projects' : 'Find and apply to projects'}
          </p>
        </div>

        {isClient && (
          <motion.button
            onClick={() => setShowCreateModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Post New Project
          </motion.button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500/50"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <button className="px-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white hover:bg-white/5 transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.map((project, index) => {
          const StatusIcon = getStatusIcon(project.status);
          
          return (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-morphism p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Project Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)} capitalize`}>
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {project.status.replace('-', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                        {project.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          ${project.budget.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Due {new Date(project.deadline).toLocaleDateString()}
                        </span>
                        <span className="px-2 py-1 bg-dark-700 rounded-md">
                          {project.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {project.status === 'open' && isEditor && (
                    <button className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all">
                      Apply Now
                    </button>
                  )}
                  
                  <Link
                    to={`/projects/${project._id}`}
                    className="px-6 py-2.5 bg-dark-700 text-white font-medium rounded-lg hover:bg-dark-600 transition-all"
                  >
                    View Details
                  </Link>

                  {project.proposals > 0 && (
                    <span className="px-3 py-1 bg-primary-500/10 text-primary-400 text-sm rounded-full">
                      {project.proposals} proposals
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-dark-800 rounded-full flex items-center justify-center">
            <Briefcase className="w-12 h-12 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
          <p className="text-gray-400">
            {isClient 
              ? 'Post your first project to get started' 
              : 'Check back later for new opportunities'}
          </p>
        </div>
      )}

      {/* Create Project Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-2xl glass-morphism p-8 rounded-2xl border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Post a New Project</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Project Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Brand Commercial Video"
                    className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your project requirements..."
                    className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Budget ($)</label>
                    <input
                      type="number"
                      placeholder="1500"
                      className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Deadline</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                  <select className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500/50">
                    <option>Commercial</option>
                    <option>YouTube</option>
                    <option>Music Video</option>
                    <option>Corporate</option>
                    <option>Social Media</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3 bg-dark-700 text-white font-medium rounded-xl hover:bg-dark-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all"
                  >
                    Post Project
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
