import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, DollarSign, Star, Clock, CheckCircle, FolderKanban,
  MessageSquare, ArrowUpRight, Briefcase, Plus, Search
} from 'lucide-react';
import { useAuth } from '@hooks';
import { projectService } from '@services/api';

const money = (value) => new Intl.NumberFormat(undefined, {
  style: 'currency', currency: 'USD', maximumFractionDigits: 0,
}).format(Number(value || 0));

const Dashboard = () => {
  const { user } = useAuth();
  const role = String(user?.role || '').toLowerCase();
  const isEditor = role === 'editor';
  const isClient = role === 'client';
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await projectService.getProjects({ limit: 100 });
        const allProjects = response.data?.data?.projects || [];
        if (active) {
          const ownProjects = allProjects.filter((project) =>
            isClient ? project.clientId === user?.id : project.editorId === user?.id
          );
          setProjects(ownProjects);
        }
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.message || 'Unable to load your projects.');
      } finally {
        if (active) setLoading(false);
      }
    };
    if (user?.id && (isClient || isEditor)) load();
    else setLoading(false);
    return () => { active = false; };
  }, [user?.id, role]);

  const counts = useMemo(() => ({
    active: projects.filter((project) => String(project.status).toUpperCase() === 'IN_PROGRESS').length,
    completed: projects.filter((project) => String(project.status).toUpperCase() === 'COMPLETED').length,
  }), [projects]);

  const stats = isEditor ? [
    { label: 'Total Earnings', value: money(user?.editorTotalEarnings), icon: DollarSign, color: 'from-green-500 to-emerald-400' },
    { label: 'Active Projects', value: String(counts.active), icon: FolderKanban, color: 'from-blue-500 to-cyan-400' },
    { label: 'Completed Jobs', value: String(user?.completedProjects ?? counts.completed), icon: CheckCircle, color: 'from-purple-500 to-pink-400' },
    { label: 'Rating', value: Number(user?.ratingAverage || 0).toFixed(1), icon: Star, color: 'from-yellow-500 to-orange-400' },
  ] : [
    { label: 'Posted Projects', value: String(user?.postedProjects ?? projects.length), icon: Briefcase, color: 'from-blue-500 to-cyan-400' },
    { label: 'Active Hires', value: String(counts.active), icon: FolderKanban, color: 'from-purple-500 to-pink-400' },
    { label: 'Completed', value: String(counts.completed), icon: CheckCircle, color: 'from-green-500 to-emerald-400' },
    { label: 'Total Spent', value: money(user?.clientTotalSpent), icon: DollarSign, color: 'from-primary-500 to-accent-400' },
  ];

  const name = user?.firstName || user?.profile?.firstName || user?.username || 'there';
  const recentProjects = [...projects].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {name}!</h1>
            <p className="text-gray-400">Here’s what’s happening with your {isEditor ? 'editing' : 'hiring'} workspace.</p>
          </div>
          <Link to={isEditor ? '/marketplace' : '/projects'} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium hover:shadow-lg hover:shadow-primary-500/20">
            {isEditor ? <Search className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isEditor ? 'Find projects' : 'Manage projects'}
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="glass-morphism p-6 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}><stat.icon className="w-6 h-6 text-white" /></div>
              <span className="text-xs text-gray-500">ACCOUNT DATA</span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 glass-morphism p-6 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div><h2 className="text-xl font-semibold text-white">Your Recent Projects</h2><p className="text-sm text-gray-400 mt-1">Live projects associated with your account</p></div>
            <Link to="/projects" className="text-sm text-primary-400 hover:text-primary-300 flex items-center">View all <ArrowUpRight className="w-4 h-4 ml-1" /></Link>
          </div>
          {loading && <p className="py-8 text-center text-gray-400">Loading your projects…</p>}
          {!loading && error && <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">{error} <button onClick={() => window.location.reload()} className="ml-2 underline">Retry</button></div>}
          {!loading && !error && recentProjects.length === 0 && <div className="py-10 text-center"><FolderKanban className="w-8 h-8 mx-auto text-gray-500 mb-3" /><p className="text-white font-medium">No projects yet</p><p className="text-sm text-gray-400 mt-1">{isEditor ? 'Explore the marketplace to find your first project.' : 'Post a project to start finding the right editor.'}</p><Link to={isEditor ? '/marketplace' : '/projects'} className="inline-block mt-4 text-primary-400 hover:text-primary-300">{isEditor ? 'Browse marketplace' : 'Post a project'} →</Link></div>}
          {!loading && !error && recentProjects.length > 0 && <div className="space-y-3">{recentProjects.map((project) => <Link key={project.id} to={`/projects/${project.id}`} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-dark-700/30 rounded-xl hover:bg-dark-700/50 transition-colors"><div><p className="text-white font-medium">{project.title}</p><p className="text-sm text-gray-400 mt-1">{String(project.category || '').replaceAll('_', ' ').toLowerCase()} · {new Date(project.createdAt).toLocaleDateString()}</p></div><div className="flex items-center gap-3"><span className="text-white font-semibold">{money(project.budget)}</span><span className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-300 text-xs">{String(project.status || '').replaceAll('_', ' ').toLowerCase()}</span></div></Link>)}</div>}
        </section>

        <section className="glass-morphism p-6 rounded-2xl border border-white/5">
          <h2 className="text-xl font-semibold text-white mb-2">Quick Actions</h2>
          <p className="text-sm text-gray-400 mb-6">Jump back into your workspace</p>
          <div className="space-y-3">
            {isEditor ? <>
              <Link to="/marketplace" className="flex items-center gap-3 p-4 bg-dark-700/30 rounded-xl hover:bg-primary-500/10 transition-colors"><Search className="w-5 h-5 text-primary-400" /><span><b className="block text-white">Browse marketplace</b><small className="text-gray-400">Discover open projects</small></span></Link>
              <Link to="/projects" className="flex items-center gap-3 p-4 bg-dark-700/30 rounded-xl hover:bg-primary-500/10 transition-colors"><FolderKanban className="w-5 h-5 text-green-400" /><span><b className="block text-white">My projects</b><small className="text-gray-400">Track accepted work</small></span></Link>
            </> : <>
              <Link to="/projects" className="flex items-center gap-3 p-4 bg-dark-700/30 rounded-xl hover:bg-primary-500/10 transition-colors"><Briefcase className="w-5 h-5 text-primary-400" /><span><b className="block text-white">Post a project</b><small className="text-gray-400">Find the right editor</small></span></Link>
              <Link to="/marketplace" className="flex items-center gap-3 p-4 bg-dark-700/30 rounded-xl hover:bg-primary-500/10 transition-colors"><Star className="w-5 h-5 text-yellow-400" /><span><b className="block text-white">Find an editor</b><small className="text-gray-400">Explore editor profiles</small></span></Link>
            </>}
            <Link to="/chat" className="flex items-center gap-3 p-4 bg-dark-700/30 rounded-xl hover:bg-primary-500/10 transition-colors"><MessageSquare className="w-5 h-5 text-blue-400" /><span><b className="block text-white">Messages</b><small className="text-gray-400">Continue a conversation</small></span></Link>
            <Link to="/settings" className="flex items-center gap-3 p-4 bg-dark-700/30 rounded-xl hover:bg-primary-500/10 transition-colors"><UserIcon /><span><b className="block text-white">Account settings</b><small className="text-gray-400">Update your workspace</small></span></Link>
          </div>
        </section>
      </div>
    </div>
  );
};

const UserIcon = () => <span className="w-5 h-5 inline-flex items-center justify-center text-gray-300">⚙</span>;

export default Dashboard;
