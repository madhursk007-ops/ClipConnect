import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, Loader2, MapPin, MessageSquare, Send, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@hooks';
import { projectService } from '@services/api';

const money = (value) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value || 0));
const dateLabel = (value) => value ? new Date(value).toLocaleDateString() : 'Not specified';
const messageFor = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isEditor = String(user?.role || '').toLowerCase() === 'editor';
  const isClient = String(user?.role || '').toLowerCase() === 'client';
  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [proposal, setProposal] = useState({ proposedBudget: '', estimatedTime: '3–5 days', message: '' });

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await projectService.getProjectById(id);
      const current = response.data?.data?.project;
      if (!current) throw new Error('Project not found.');
      setProject(current);
      if (isClient && current.clientId === (user?.id || user?._id)) {
        const proposalResponse = await projectService.getProjectProposals(id);
        setProposals(proposalResponse.data?.data?.proposals || []);
      }
    } catch (requestError) {
      setError(messageFor(requestError, 'Unable to load this project.'));
    } finally {
      setLoading(false);
    }
  }, [id, isClient, user?.id, user?._id]);

  useEffect(() => { load(); }, [load]);

  const submitProposal = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await projectService.submitProposal(id, { ...proposal, proposedBudget: Number(proposal.proposedBudget) });
      toast.success('Your proposal has been sent to the client.');
      setProposal({ proposedBudget: '', estimatedTime: '3–5 days', message: '' });
    } catch (requestError) {
      toast.error(messageFor(requestError, 'Could not submit your proposal.'));
    } finally {
      setSaving(false);
    }
  };

  const acceptProposal = async (proposalId) => {
    setSaving(true);
    try {
      await projectService.acceptProposal(id, proposalId);
      toast.success('Proposal accepted. The project is now in progress.');
      await load();
    } catch (requestError) {
      toast.error(messageFor(requestError, 'Could not accept this proposal.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center gap-3 py-20 text-gray-400"><Loader2 className="h-5 w-5 animate-spin" />Loading project details…</div>;
  if (error || !project) return <div className="glass-morphism rounded-2xl border border-white/5 p-8"><p className="text-rose-200">{error || 'Project not found.'}</p><Link to="/projects" className="mt-4 inline-flex text-sm text-primary-300 hover:text-primary-200">← Back to projects</Link></div>;

  const isOwner = isClient && project.clientId === (user?.id || user?._id);
  const isOpen = project.status === 'OPEN';

  return <div className="space-y-6">
    <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"><ArrowLeft className="h-4 w-4" />Back to marketplace</Link>
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-morphism rounded-2xl border border-white/5 p-6 sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <span className="inline-flex rounded-full border border-primary-400/20 bg-primary-400/10 px-3 py-1 text-xs font-semibold text-primary-200">{String(project.status).replaceAll('_', ' ')}</span>
          <h1 className="mt-4 text-3xl font-bold text-white">{project.title}</h1>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-300">{project.description}</p>
        </div>
        <div className="shrink-0 rounded-xl bg-white/[0.04] p-5 sm:min-w-40 sm:text-right"><div className="text-2xl font-bold text-white">{money(project.budget)}</div><div className="mt-1 text-xs uppercase tracking-wider text-gray-500">Client budget</div></div>
      </div>
      <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/[0.07] pt-5 text-sm text-gray-400">
        <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" />Deadline {dateLabel(project.deadline)}</span>
        <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4" />{project.duration || 'Duration flexible'}</span>
        <span className="inline-flex items-center gap-2"><Users className="h-4 w-4" />{project.proposals?.length ?? 0} proposal(s)</span>
        {project.client?.location && <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{project.client.location}</span>}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">{(project.tags || []).map((tag) => <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-300">{tag}</span>)}</div>
    </motion.div>

    {isEditor && isOpen && <section className="glass-morphism rounded-2xl border border-primary-400/20 p-6">
      <h2 className="text-xl font-semibold text-white">Send a proposal</h2>
      <p className="mt-1 text-sm text-gray-400">Share your approach, estimated delivery time and quote with the client.</p>
      <form onSubmit={submitProposal} className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-gray-300">Your quote (USD)<input required type="number" min="1" step="0.01" value={proposal.proposedBudget} onChange={(e) => setProposal({ ...proposal, proposedBudget: e.target.value })} className="w-full rounded-xl border border-white/10 bg-dark-800 px-4 py-3 text-white" placeholder="450" /></label>
        <label className="space-y-2 text-sm text-gray-300">Estimated delivery<input required value={proposal.estimatedTime} onChange={(e) => setProposal({ ...proposal, estimatedTime: e.target.value })} className="w-full rounded-xl border border-white/10 bg-dark-800 px-4 py-3 text-white" placeholder="5 days" /></label>
        <label className="space-y-2 text-sm text-gray-300 sm:col-span-2">Cover message<textarea required minLength={20} rows={4} value={proposal.message} onChange={(e) => setProposal({ ...proposal, message: e.target.value })} className="w-full rounded-xl border border-white/10 bg-dark-800 px-4 py-3 text-white" placeholder="Explain your relevant experience and how you would approach this edit…" /></label>
        <button disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50 sm:col-span-2"><Send className="h-4 w-4" />{saving ? 'Sending…' : 'Submit proposal'}</button>
      </form>
    </section>}

    {isOwner && <section className="glass-morphism rounded-2xl border border-white/5 p-6">
      <div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="text-xl font-semibold text-white">Editor proposals</h2><p className="mt-1 text-sm text-gray-400">Choose a proposal to assign this project.</p></div><span className="text-sm text-gray-400">{proposals.length} received</span></div>
      {proposals.length === 0 ? <p className="rounded-xl bg-white/[0.03] p-5 text-sm text-gray-400">No proposals yet. Editors will appear here when they apply.</p> : <div className="space-y-3">{proposals.map((item) => <article key={item.id} className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold text-white">{item.editor?.firstName || item.editor?.username || 'Editor'} {item.editor?.lastName || ''}</h3><p className="mt-1 text-xs text-gray-500">Submitted {dateLabel(item.submittedAt)} · {item.estimatedTime || 'Timeline not specified'}</p></div><div className="text-right"><div className="font-semibold text-white">{money(item.proposedBudget)}</div><span className="text-xs text-gray-500">{String(item.status).toLowerCase()}</span></div></div>
        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-300">{item.message}</p>
        {isOpen && item.status === 'PENDING' && <button disabled={saving} onClick={() => acceptProposal(item.id)} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/25 disabled:opacity-50"><CheckCircle2 className="h-4 w-4" />Accept proposal</button>}
      </article>)}</div>}
    </section>}

    {!isClient && !isEditor && <div className="rounded-xl border border-white/10 p-4 text-sm text-gray-300">Sign in with a Client or Editor account to interact with this project.</div>}
  </div>;
};

export default ProjectDetail;
