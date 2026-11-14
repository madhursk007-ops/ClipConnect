import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Clock, DollarSign, Briefcase, MapPin, Calendar,
  User, CheckCircle, MessageSquare, Send, AlertCircle
} from 'lucide-react';
import { useAuth } from '@hooks';
import { projectService } from '@services/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = String(user?.role || '').toLowerCase();
  const isEditor = role === 'editor';
  const isClient = role === 'client';
  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [acceptingId, setAcceptingId] = useState('');

  const loadProject = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const response = await projectService.getProjectById(id);
      const nextProject = response.data?.data?.project;
      if (!nextProject) throw new Error('Project details were not returned.');
      setProject(nextProject);
      if (isClient && nextProject.clientId === user?.id) {
        const proposalResponse = await projectService.getProjectProposals(id);
        setProposals(proposalResponse.data?.data?.proposals || []);
      } else {
        setProposals([]);
      }
    } catch (error) {
      setLoadError(error.response?.data?.message || error.message || 'Unable to load this project.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProject(); }, [id, user?.id, role]);

  const handleSubmitProposal = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setFormError('');
    try {
      await projectService.submitProposal(id, {
        proposedBudget: Number(form.get('proposedBudget')),
        estimatedTime: form.get('estimatedTime'),
        message: String(form.get('message') || '').trim(),
      });
      await loadProject();
      event.currentTarget.reset();
    } catch (error) {
      setFormError(error.response?.data?.message || 'Your proposal could not be submitted.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptProposal = async (proposalId) => {
    setAcceptingId(proposalId);
    setFormError('');
    try {
      const response = await projectService.acceptProposal(id, proposalId);
      setProject(response.data?.data?.project || project);
      const proposalResponse = await projectService.getProjectProposals(id).catch(() => null);
      setProposals(proposalResponse?.data?.data?.proposals || []);
    } catch (error) {
      setFormError(error.response?.data?.message || 'Could not accept this proposal.');
    } finally {
      setAcceptingId('');
    }
  };

  if (loading) return <div className="py-20 text-center text-gray-400">Loading project details…</div>;
  if (loadError || !project) return (
    <div className="space-y-4">
      <Link to="/projects" className="inline-flex items-center text-gray-400 hover:text-white"><ArrowLeft className="w-4 h-4 mr-2" />Back to Projects</Link>
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">{loadError || 'Project not found.'}</div>
      <button onClick={loadProject} className="text-primary-400 underline">Try again</button>
    </div>
  );

  const status = String(project.status || 'OPEN').toLowerCase().replaceAll('_', ' ');
  const clientName = [project.client?.firstName, project.client?.lastName].filter(Boolean).join(' ') || project.client?.username || 'ClipConnect client';
  const category = String(project.category || '').replaceAll('_', ' ').toLowerCase();
  const isOwner = isClient && project.clientId === user?.id;
  const canApply = isEditor && String(project.status).toUpperCase() === 'OPEN';

  return (
    <div className="space-y-6">
      <Link to="/projects" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" />Back to Projects
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-morphism p-8 rounded-2xl border border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border mb-3 ${String(project.status).toUpperCase() === 'OPEN' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-primary-500/10 text-primary-400 border-primary-500/20'}`}>
                  {status}
                </span>
                <h1 className="text-3xl font-bold text-white">{project.title}</h1>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-3xl font-bold text-white">{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(project.budget || 0))}</p>
                <p className="text-gray-400">Project budget</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-6 pb-6 border-b border-white/5">
              <span className="flex items-center"><Briefcase className="w-4 h-4 mr-2" />{category}</span>
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" />Posted {new Date(project.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center"><Clock className="w-4 h-4 mr-2" />Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
              <span className="flex items-center"><Send className="w-4 h-4 mr-2" />{proposals.length} proposals{!isOwner && ' shown to project owner'}</span>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Project Description</h3>
              <p className="text-gray-300 whitespace-pre-line">{project.description}</p>
            </div>
            {(project.tags || []).length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">Skills & Tags</h3>
                <div className="flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="px-4 py-2 bg-primary-500/10 text-primary-400 text-sm rounded-full border border-primary-500/20">{String(tag).replaceAll('_', ' ')}</span>)}</div>
              </div>
            )}
            {project.editor && (
              <div className="mt-6 rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-green-300">
                Assigned to {[project.editor.firstName, project.editor.lastName].filter(Boolean).join(' ') || project.editor.username}
              </div>
            )}
          </motion.div>

          {isOwner && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-morphism p-6 rounded-2xl border border-white/5">
              <h3 className="text-xl font-semibold text-white mb-6">Proposals ({proposals.length})</h3>
              {formError && <p role="alert" className="mb-4 text-sm text-red-300">{formError}</p>}
              {proposals.length === 0 ? <p className="text-gray-400">No proposals have been submitted yet.</p> : (
                <div className="space-y-4">
                  {proposals.map((proposal) => {
                    const editor = proposal.editor || {};
                    const editorName = [editor.firstName, editor.lastName].filter(Boolean).join(' ') || editor.username || 'Video editor';
                    return (
                      <div key={proposal.id} className="p-4 bg-dark-800/50 rounded-xl border border-white/5">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                          <div>
                            <Link to={`/profile/${editor.id}`} className="text-white font-semibold hover:text-primary-400">{editorName}</Link>
                            <p className="text-xs text-gray-400 mt-1">{Number(editor.ratingAverage || 0).toFixed(1)} ★ · {editor.ratingCount || 0} reviews</p>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-xl text-primary-400 font-semibold">{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(proposal.proposedBudget || 0))}</p>
                            <p className="text-xs text-gray-400">{proposal.estimatedTime}</p>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm whitespace-pre-line">{proposal.message}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {String(project.status).toUpperCase() === 'OPEN' && <button onClick={() => handleAcceptProposal(proposal.id)} disabled={Boolean(acceptingId)} className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 disabled:opacity-50">{acceptingId === proposal.id ? 'Accepting…' : 'Accept proposal'}</button>}
                          <Link to={`/chat/${editor.id}`} className="px-4 py-2 bg-dark-700 text-white text-sm rounded-lg hover:bg-dark-600">Message editor</Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-morphism p-6 rounded-2xl border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-4">About the Client</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center"><span className="text-2xl font-bold text-white">{clientName.slice(0, 1).toUpperCase()}</span></div>
              <div><p className="text-white font-semibold">{clientName}</p><p className="text-gray-400 text-sm">{project.client?.company || 'ClipConnect client'}</p></div>
            </div>
            {project.client?.location && <p className="flex items-center text-sm text-gray-400 mb-3"><MapPin className="w-4 h-4 mr-2" />{project.client.location}</p>}
            {project.client?.id && <Link to={`/chat/${project.client.id}`} className="w-full mt-4 py-2.5 border border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center"><MessageSquare className="w-4 h-4 mr-2" />Contact Client</Link>}
          </motion.div>

          {canApply && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-morphism p-6 rounded-2xl border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-4">Submit a Proposal</h3>
              <form className="space-y-4" onSubmit={handleSubmitProposal}>
                <div><label className="block text-sm text-gray-400 mb-2" htmlFor="proposedBudget">Your Bid (USD)</label><input id="proposedBudget" name="proposedBudget" type="number" min="1" step="1" required placeholder={String(project.budget || 0)} className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500/50" /></div>
                <div><label className="block text-sm text-gray-400 mb-2" htmlFor="estimatedTime">Estimated Time</label><select id="estimatedTime" name="estimatedTime" required className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500/50"><option value="LESS_THAN_WEEK">Less than 1 week</option><option value="ONE_TO_TWO_WEEKS">1–2 weeks</option><option value="TWO_TO_FOUR_WEEKS">2–4 weeks</option><option value="ONE_TO_TWO_MONTHS">1–2 months</option></select></div>
                <div><label className="block text-sm text-gray-400 mb-2" htmlFor="proposalMessage">Cover Letter</label><textarea id="proposalMessage" name="message" rows={4} required minLength={20} placeholder="Explain your approach, relevant experience and delivery plan…" className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 resize-none" /></div>
                {formError && <p role="alert" className="text-sm text-red-300">{formError}</p>}
                <button type="submit" disabled={submitting} className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-50">{submitting ? 'Submitting…' : 'Submit Proposal'}</button>
              </form>
            </motion.div>
          )}
          {!isEditor && !isClient && <div className="glass-morphism p-5 rounded-2xl border border-white/5 text-gray-400">Sign in as a client or editor to use project actions.</div>}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
