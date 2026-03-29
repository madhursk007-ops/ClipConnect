import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, Film, Briefcase, CheckCircle, TrendingUp, Activity } from 'lucide-react';
import api from '@services/api';

const StatsSection = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    editors: 0,
    clients: 0,
    totalProjects: 0,
    completedProjects: 0,
    activeProjects: 0,
    recentActivity: {
      newUsersToday: 0,
      newProjectsToday: 0,
      projectsCompletedToday: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animatedStats, setAnimatedStats] = useState({});
  const intervalRef = useRef(null);

  // Fetch stats from API
  const fetchStats = async () => {
    try {
      const response = await api.get('/stats');
      if (response.data.success) {
        const newStats = response.data.data;
        setStats(newStats);
        setError(null);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStats();
    
    // Poll for updates every 10 seconds
    intervalRef.current = setInterval(fetchStats, 10000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Count-up animation effect
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    
    const targets = {
      totalUsers: stats.totalUsers,
      editors: stats.editors,
      clients: stats.clients,
      totalProjects: stats.totalProjects,
      completedProjects: stats.completedProjects
    };

    let currentStep = 0;
    
    const animate = () => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const newAnimatedStats = {};
      Object.keys(targets).forEach(key => {
        newAnimatedStats[key] = Math.round(targets[key] * easeOutQuart);
      });
      
      setAnimatedStats(newAnimatedStats);
      
      if (currentStep < steps) {
        setTimeout(animate, stepDuration);
      }
    };
    
    if (!loading && stats.totalUsers > 0) {
      animate();
    }
  }, [stats, loading]);

  const statCards = [
    {
      icon: Users,
      label: 'Total Users',
      value: animatedStats.totalUsers || 0,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      icon: Film,
      label: 'Video Editors',
      value: animatedStats.editors || 0,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      icon: Briefcase,
      label: 'Clients',
      value: animatedStats.clients || 0,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/20'
    },
    {
      icon: Activity,
      label: 'Total Projects',
      value: animatedStats.totalProjects || 0,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20'
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      value: animatedStats.completedProjects || 0,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    }
  ];

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span 
            className="inline-flex items-center px-4 py-2 bg-primary-500/10 rounded-full text-primary-400 text-sm font-semibold tracking-wide uppercase mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Live Statistics
          </motion.span>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Platform <span className="text-primary-400">Growth</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Real-time data from our thriving community of creators and editors
          </p>
          
          {error && (
            <p className="text-red-400 mt-4 text-sm">{error}</p>
          )}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`relative group ${stat.bgColor} ${stat.borderColor} border rounded-2xl p-6 backdrop-blur-sm`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {stat.value.toLocaleString()}
                </div>
                
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                
                {/* Live Indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  <span className="text-xs text-green-400 font-medium">LIVE</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div 
          className="mt-12 glass-morphism rounded-2xl p-8 border border-white/10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-primary-400" />
            Last 24 Hours Activity
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
              <span className="text-gray-400">New Users</span>
              <span className="text-2xl font-bold text-white">+{stats.recentActivity?.newUsersToday || 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
              <span className="text-gray-400">New Projects</span>
              <span className="text-2xl font-bold text-white">+{stats.recentActivity?.newProjectsToday || 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
              <span className="text-gray-400">Completed</span>
              <span className="text-2xl font-bold text-green-400">+{stats.recentActivity?.projectsCompletedToday || 0}</span>
            </div>
          </div>
        </motion.div>

        {/* Update Indicator */}
        <motion.p 
          className="text-center text-gray-500 text-sm mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Statistics update automatically every 10 seconds
        </motion.p>
      </div>
    </section>
  );
};

export default StatsSection;
