import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  Star,
  Clock,
  CheckCircle,
  FolderKanban,
  MessageSquare,
  ArrowUpRight,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@hooks';

const Dashboard = () => {
  const { user } = useAuth();
  const isEditor = user?.role === 'editor';
  const isClient = user?.role === 'client';

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  // Editor Dashboard Stats
  const editorStats = [
    { label: 'Total Earnings', value: '$12,450', icon: DollarSign, color: 'from-green-500 to-emerald-400', change: '+15%' },
    { label: 'Active Projects', value: '8', icon: FolderKanban, color: 'from-blue-500 to-cyan-400', change: '+2' },
    { label: 'Completed Jobs', value: '47', icon: CheckCircle, color: 'from-purple-500 to-pink-400', change: '+5' },
    { label: 'Rating', value: '4.9', icon: Star, color: 'from-yellow-500 to-orange-400', change: 'Top 5%' },
  ];

  // Client Dashboard Stats
  const clientStats = [
    { label: 'Posted Projects', value: '12', icon: Briefcase, color: 'from-blue-500 to-cyan-400', change: '+3' },
    { label: 'Active Hires', value: '5', icon: FolderKanban, color: 'from-purple-500 to-pink-400', change: '2 pending' },
    { label: 'Completed', value: '28', icon: CheckCircle, color: 'from-green-500 to-emerald-400', change: '+8' },
    { label: 'Total Spent', value: '$24,800', icon: DollarSign, color: 'from-primary-500 to-accent-400', change: '+22%' },
  ];

  const stats = isEditor ? editorStats : clientStats;

  // Recent Activity (Mock data)
  const activities = [
    { type: 'project', title: 'New project proposal received', time: '2 hours ago', icon: FolderKanban },
    { type: 'message', title: 'New message from Sarah Johnson', time: '4 hours ago', icon: MessageSquare },
    { type: 'complete', title: 'Project "Brand Video" completed', time: '1 day ago', icon: CheckCircle },
    { type: 'payment', title: 'Payment received: $1,200', time: '2 days ago', icon: DollarSign },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div {...fadeInUp}>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.profile?.firstName || 'User'}!
        </h1>
        <p className="text-gray-400">
          Here's what's happening with your {isEditor ? 'freelance' : 'hiring'} activity
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-morphism p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-green-400 font-medium bg-green-500/10 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-morphism p-6 rounded-2xl border border-white/5"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
            <button className="text-sm text-primary-400 hover:text-primary-300 flex items-center">
              View All <ArrowUpRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div 
                key={index}
                className="flex items-center p-4 bg-dark-700/30 rounded-xl hover:bg-dark-700/50 transition-colors"
              >
                <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center mr-4">
                  <activity.icon className="w-5 h-5 text-primary-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.3 }}
          className="glass-morphism p-6 rounded-2xl border border-white/5"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
          
          <div className="space-y-3">
            {isEditor ? (
              <>
                <button className="w-full p-4 bg-dark-700/30 rounded-xl text-left hover:bg-primary-500/10 hover:border-primary-500/20 border border-transparent transition-all group">
                  <div className="flex items-center">
                    <FolderKanban className="w-5 h-5 text-primary-400 mr-3" />
                    <div>
                      <p className="text-white font-medium group-hover:text-primary-400 transition-colors">Browse Projects</p>
                      <p className="text-sm text-gray-400">Find new opportunities</p>
                    </div>
                  </div>
                </button>
                <button className="w-full p-4 bg-dark-700/30 rounded-xl text-left hover:bg-primary-500/10 hover:border-primary-500/20 border border-transparent transition-all group">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-green-400 mr-3" />
                    <div>
                      <p className="text-white font-medium group-hover:text-primary-400 transition-colors">View Earnings</p>
                      <p className="text-sm text-gray-400">Track your income</p>
                    </div>
                  </div>
                </button>
              </>
            ) : (
              <>
                <button className="w-full p-4 bg-dark-700/30 rounded-xl text-left hover:bg-primary-500/10 hover:border-primary-500/20 border border-transparent transition-all group">
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 text-primary-400 mr-3" />
                    <div>
                      <p className="text-white font-medium group-hover:text-primary-400 transition-colors">Post New Project</p>
                      <p className="text-sm text-gray-400">Hire an editor</p>
                    </div>
                  </div>
                </button>
                <button className="w-full p-4 bg-dark-700/30 rounded-xl text-left hover:bg-primary-500/10 hover:border-primary-500/20 border border-transparent transition-all group">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-yellow-400 mr-3" />
                    <div>
                      <p className="text-white font-medium group-hover:text-primary-400 transition-colors">Active Projects</p>
                      <p className="text-sm text-gray-400">Manage ongoing work</p>
                    </div>
                  </div>
                </button>
              </>
            )}
            
            <button className="w-full p-4 bg-dark-700/30 rounded-xl text-left hover:bg-primary-500/10 hover:border-primary-500/20 border border-transparent transition-all group">
              <div className="flex items-center">
                <MessageSquare className="w-5 h-5 text-blue-400 mr-3" />
                <div>
                  <p className="text-white font-medium group-hover:text-primary-400 transition-colors">Messages</p>
                  <p className="text-sm text-gray-400">3 unread conversations</p>
                </div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Recommended/Featured Section */}
      <motion.div 
        {...fadeInUp}
        transition={{ delay: 0.4 }}
        className="glass-morphism p-6 rounded-2xl border border-white/5"
      >
        <h2 className="text-xl font-semibold text-white mb-6">
          {isEditor ? 'Recommended for You' : 'Top Rated Editors'}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-4 bg-dark-700/30 rounded-xl hover:bg-dark-700/50 transition-colors">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {isEditor ? 'P' : String.fromCharCode(64 + item)}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium">
                    {isEditor ? `Project ${item}` : `Editor ${item}`}
                  </p>
                  <p className="text-sm text-gray-400">
                    {isEditor ? 'Video Editing - $500' : '4.9 ★ Video Editor'}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Clock className="w-4 h-4 mr-1" />
                {isEditor ? 'Posted 2 hours ago' : 'Available now'}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
