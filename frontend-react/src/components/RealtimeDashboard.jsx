import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Film, 
  Briefcase, 
  CheckCircle, 
  TrendingUp, 
  Activity,
  Zap,
  UserPlus,
  FolderPlus,
  MessageCircle,
  Globe
} from 'lucide-react';
import { useRealtimeStats } from '@services/socket';
import api from '@services/api';

const RealtimeDashboard = () => {
  const { stats: socketStats, activities } = useRealtimeStats();
  const [stats, setStats] = useState({
    totalUsers: 0,
    editors: 0,
    clients: 0,
    totalProjects: 0,
    completedProjects: 0,
    activeProjects: 0
  });
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const prevStats = useRef(stats);

  // Initial fetch from API
  useEffect(() => {
    const fetchInitialStats = async () => {
      try {
        const response = await api.get('/stats');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialStats();
  }, []);

  // Update stats when socket data changes
  useEffect(() => {
    if (socketStats && Object.keys(socketStats).length > 0) {
      setStats(prev => ({
        ...prev,
        ...socketStats
      }));
    }
  }, [socketStats]);

  // Get online users count
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await api.get('/stats/online');
        setOnlineUsers(response.data.count || 0);
      } catch (error) {
        // Silent fail
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Animated counter component
  const AnimatedCounter = ({ value, label, prevValue }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
      if (value !== prevValue && prevValue !== undefined) {
        setIsUpdating(true);
        
        const start = prevValue;
        const end = value;
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(start + (end - start) * easeProgress);
          
          setDisplayValue(current);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setIsUpdating(false);
          }
        };

        requestAnimationFrame(animate);
      }
    }, [value, prevValue]);

    return (
      <motion.span
        className={`text-4xl md:text-5xl font-bold ${isUpdating ? 'text-primary-400' : 'text-white'}`}
        animate={isUpdating ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {displayValue.toLocaleString()}
      </motion.span>
    );
  };

  const statCards = [
    {
      icon: Users,
      label: 'Total Users',
      key: 'totalUsers',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      icon: Film,
      label: 'Video Editors',
      key: 'editors',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      icon: Briefcase,
      label: 'Clients',
      key: 'clients',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/20'
    },
    {
      icon: Activity,
      label: 'Total Projects',
      key: 'totalProjects',
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20'
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      key: 'completedProjects',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    }
  ];

  // Activity icon mapping
  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_joined': return UserPlus;
      case 'project_created': return FolderPlus;
      case 'project_completed': return CheckCircle;
      case 'message_sent': return MessageCircle;
      default: return Zap;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'user_joined': return 'text-blue-400';
      case 'project_created': return 'text-purple-400';
      case 'project_completed': return 'text-green-400';
      case 'message_sent': return 'text-yellow-400';
      default: return 'text-primary-400';
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-4 bg-dark-900">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.span className="inline-flex items-center px-4 py-2 bg-primary-500/10 rounded-full text-primary-400 text-sm font-semibold tracking-wide uppercase">
              <Zap className="w-4 h-4 mr-2" />
              Real-Time Dashboard
            </motion.span>
            
            {/* Online Users Badge */}
            <motion.span 
              className="inline-flex items-center px-4 py-2 bg-green-500/10 rounded-full text-green-400 text-sm font-semibold"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="relative flex h-2.5 w-2.5 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              {onlineUsers} Online
            </motion.span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Live <span className="text-primary-400">Platform Stats</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Watch our platform grow in real-time as users join and projects are created
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`relative group ${stat.bgColor} ${stat.borderColor} border rounded-2xl p-6 backdrop-blur-sm overflow-hidden`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
              
              {/* Update Pulse Effect */}
              <AnimatePresence>
                {prevStats.current[stat.key] !== stats[stat.key] && (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl`}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </AnimatePresence>

              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                
                <AnimatedCounter 
                  value={stats[stat.key] || 0} 
                  label={stat.label}
                  prevValue={prevStats.current[stat.key]}
                />
                
                <p className="text-gray-400 text-sm font-medium mt-1">{stat.label}</p>
              </div>

              {/* Live Indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Activity Feed & Online Users */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Activity Feed */}
          <motion.div 
            className="lg:col-span-2 glass-morphism rounded-2xl p-6 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-primary-400" />
                Live Activity Feed
              </h3>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Real-time</span>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {activities.length === 0 ? (
                  <motion.p 
                    className="text-gray-500 text-center py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Waiting for activity... Check back soon!
                  </motion.p>
                ) : (
                  activities.map((activity, index) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <motion.div
                        key={activity.timestamp + index}
                        layout
                        initial={{ opacity: 0, x: -20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex items-start gap-4 p-4 bg-dark-800/50 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <div className={`p-2 rounded-lg bg-dark-700 ${getActivityColor(activity.type)}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-300 text-sm">{activity.message}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(activity.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Online Users Card */}
          <motion.div 
            className="glass-morphism rounded-2xl p-6 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-green-400" />
              Users Online
            </h3>

            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <motion.div 
                  className="text-6xl font-bold text-green-400 mb-2"
                  key={onlineUsers}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {onlineUsers}
                </motion.div>
                <p className="text-gray-400">Active now</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-dark-800/50 rounded-xl">
              <p className="text-sm text-gray-400 text-center">
                <TrendingUp className="w-4 h-4 inline mr-1 text-green-400" />
                Platform is actively growing
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Store previous stats for comparison */}
      {useEffect(() => {
        prevStats.current = stats;
      })}
    </section>
  );
};

export default RealtimeDashboard;
