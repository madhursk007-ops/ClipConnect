import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BriefcaseBusiness, CalendarDays, CheckCircle2, CircleDollarSign, Loader2, Plus, RefreshCw, Send, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@hooks';
import { projectService } from '@services/api';

const categories = [
  ['video-editing', 'Video editing'],
  ['motion-graphics', 'Motion graphics'],
  ['color-grading', 'Color grading'],
  ['audio-editing', 'Audio editing'],
  ['animation', 'Animation'],
  ['vfx', 'Visual effects'],
  ['full-production', 'Full production'],
];

const money = (value) => {
  const amount = Number(value || 0);
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
};
const dateLabel = (value) => value ? new Date(value).toLocaleDateString() : 'Flexible';
const errorMessage = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

function Stat({ icon: Icon, label, value }) {
  return <div className="glass-morphism rounded-2xl border border-white/5 p-5">
    <div className="mb-3 flex items-center gap-2 text-sm text-gray-400"><Icon className="h-4 w-4 text-primary-300" />{label}</div>
    <div className="text-2xl font-bold text-white">{value}</div>
  </div>;
}

function ProjectCard({ project, children, badge }) {
  return <article className="glass-morphism rounded-2xl border border-white/5 p-5 sm:p-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-primary-400/20 bg-primary-400/10 px-3 py-1 text-xs font-semibold text-primary-200">{badge || String(project.status || 'OPEN').replaceAll('_', ' ')}</span>
          <span className="text-xs text-gray-500">{categories.find(([value]) => value.toUpperCase().replaceAll('-', '_') === project.category)?.[1] || String(project.category || 'Video project').replaceAll('_', ' ')}</span>
        </div>
        <h2 className="text-lg font-semibold text-white">{project.title}</h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-400">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-400">
          <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />Due {dateLabel(project.deadline)}</span>
          <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{project._count?.proposals ?? project.proposals?.length ?? '—'} proposals</span>
          {project.client && <span>Client: {project.client.firstName || project.client.username || 'Member'} {project.client.lastName || ''}</span>}
          {project.editor && <span>Editor: {project.editor.firstName || project.editor.username || 'Assigned'}</span>}
        </div>
      </div>
      <div className="shrink-0 rounded-xl bg-white/[0.04] px-4 py-3 sm:min-w-32 sm:text-right">
        <div className="text-lg font-bold text-white">{money(project.budget)}</div>
        <div className="mt-1 text-[10px] uppercase tracking-wider text-gray-500">Project budget</div>
      </div>
    </div>
    {children && <div className="mt-5 border-t border-white/[0.07] pt-5">{children}</div>}
  </article>;
}

const Projects = () => {
  const { user } = useAuth();
  const userId = user?.id || user?._id;
  const isEditor = String(user?.role || '').toLowerCase() === 'editor';
  const isClient = String(user?.role || '').toLowerCase() === 'client';
  const [projects, setProjects] = useState([]);
  const [myProposals, setMyProposals] = useState([]);
  const [proposalsByProject, setProposalsByProject] = useState({});
  const [expandedProject, setExpandedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [proposalFor, setProposalFor] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', category: 'video-editing', budget: '', deadline: '', duration: '', format: '16:9', style: '', revisions: '2' });
  const [proposal, setProposal] = useState({ message: '', estimatedTime: '3–5 days', proposedBudget: '' });

  const load = useCallback(async () => {
    if (!userId || (!isClient && !isEditor)) {
      setError('Your account role could not be verified. Please sign in again.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (isClient) {
        const response = await projectService.getClientProjects(userId, { page: 1, limit: 50 });
        setProjects(response.data?.data?.projects || []);
      } else {
        const [projectResponse, proposalResponse] = await Promise.all([
          projectService.getProjects({ status: 'OPEN', page: 1, limit: 50 }),
          projectService.getMyEditorProposals(),
        ]);
        setProjects(projectResponse.data?.data?.projects || []);
        setMyProposals(proposalResponse.data?.data?.proposals || []);
      }
    } catch (requestError) {
      setError(errorMessage(requestError, 'Could not load marketplace projects.'));
    } finally {
      setLoading(false);
    }
  }, [userId, isClient, isEditor]);

  useEffect(() => { load(); }, [load]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((project) => [project.title, project.description, project.category, ...(project.tags || [])].join(' ').toLowerCase().includes(query));
  }, [projects, search]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await projectService.createProject({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        budget: Number(form.budget),
        deadline: new Date(form.deadline).toISOString(),
        requirements: { duration: form.duration, format: form.format, style: form.style, revisions: Number(form.revisions) },
        tags: []
      });
      toast.success('Project brief published.');
      setForm({ title: '', description: '', category: 'video-editing', budget: '', deadline: '', duration: '', format: '16:9', style: '', revisions: '2' });
      setShowCreate(false);
      await load();
    } catch (requestError) {
      toast.error(errorMessage(requestError, 'Could not publish this project.'));
    } finally {
      setSaving(false);
    }
  };

  const toggleProposals = async (projectId) => {
    if (expandedProject === projectId) { setExpandedProject(null); return; }
    setExpandedProject(projectId);
    if (proposalsByProject[projectId]) return;
    try {
      const response = await projectService.getProjectProposals(projectId);
      setProposalsByProject((current) => ({ ...current, [projectId]: response.data?.data?.proposals || [] }));
    } catch (requestError) {
      toast.error(errorMessage(requestError, 'Could not load proposals.'));
      setExpandedProject(null);
    }
  };

  const handleAccept = async (projectId, proposalId) => {
    setSaving(true);
    try {
      await projectService.acceptProposal(projectId, proposalId);
      toast.success('Proposal accepted. The project is now in progress.');
      setProposalsByProject((current) => ({ ...current, [projectId]: (current[projectId] || []).map((item) => ({ ...item, status: item.id === proposalId ? 'ACCEPTED' : 'REJECTED' })) }));
      await load();
    } catch (requestError) {
      toast.error(errorMessage(requestError, 'Could not accept this proposal.'));
    } finally {
      setSaving(false);
    }
  };

  const handleProposal = async (event) => {
    event.preventDefault();
    if (!proposalFor) return;
    setSaving(true);
    try {
      await projectService.submitProposal(proposalFor, { ...proposal, proposedBudget: Number(proposal.proposedBudget) });
      toast.success('Proposal submitted to the client.');
      setProposalFor(null);
      setProposal({ message: '', estimatedTime: '3–5 days', proposedBudget: '' });
      await load();
    } catch (requestError) {
      toast.error(errorMessage(requestError, 'Could not submit your proposal.'));
    } finally {
      setSaving(false);
    }
  };

  if (!isClient && !isEditor) return <div className="glass-morphism rounded-2xl p-8 text-gray-300">This marketplace workspace is available to Client and Editor accounts.</div>;

  const openCount = projects.filter((project) => project.status === 'OPEN').length;
  const acceptedCount = myProposals.filter((item) => item.status === 'ACCEPTED').length;

  return <div className="space-y-7">
    <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">{isClient ? 'Client workspace' : 'Editor workspace'} / Marketplace</div>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">{isClient ? 'Manage your briefs.' : 'Find your next project.'}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">{isClient ? 'Publish projects, review editor proposals and choose the right creative partner.' : 'Explore open briefs, send a tailored proposal and track every application.'}</p>
      </div>
      <button onClick={load} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-200 transition hover:bg-white/5 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</button>
    </motion.header>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Stat icon={BriefcaseBusiness} label={isClient ? 'Your project briefs' : 'Open opportunities'} value={loading ? '—' : projects.length} />
      <Stat icon={Send} label={isClient ? 'Proposals received' : 'Proposals submitted'} value={loading ? '—' : isClient ? Object.values(proposalsByProject).reduce((sum, items) => sum + items.length, 0) : myProposals.length} />
      <Stat icon={CheckCircle2} label={isClient ? 'Open briefs' : 'Accepted proposals'} value={loading ? '—' : isClient ? openCount : acceptedCount} />
    </div>

    {error && <div role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error}<button onClick={load} className="ml-3 underline">Try again</button></div>}

    {isClient && <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-xl font-semibold text-white">Your project briefs</h2><p className="mt-1 text-sm text-gray-400">Only your client account can manage these projects and their proposals.</p></div>
      <button onClick={() => setShowCreate((value) => !value)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/15"><Plus className="h-4 w-4" />{showCreate ? 'Close form' : 'Post a project'}</button>
    </div>}

    {isClient && showCreate && <form onSubmit={handleCreate} className="glass-morphism space-y-4 rounded-2xl border border-primary-400/20 p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-white">Create a project brief</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-gray-300 sm:col-span-2">Project title<input required minLength={5} maxLength={100} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-xl border border-white/10 bg-dark-800 px-4 py-3 text-white" placeholder="e.g. Product launch video" /></label>
        <label className="space-y-2 text-sm text-gray-300 sm:col-span-2">Description<textarea required minLength={20} rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border border-white/10 bg-dark-800 px-4 py-3 text-white" placeholder="Describe the footage, deliverables and editing style..." /></label>
        <label className="space-y-2 text-sm text-gray-300">Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border border-white/10 bg-dark-800 px-4 py-3 text-white">{categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="space-y-2 text-sm text-gray-300">Budget (USD)<input required type="number" min="1" step="0.01" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="w-full rounded-xl border border-white/10 bg-dark-800 px-4 py-3 text-white" placeholder="500" /></label>
        <label className="space-y-2 text-sm text-gray-300">Deadline<input required type="date" min={new Date().toISOString().slice(0, 10)} value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="w-full rounded-xl border border-white/10 bg-dark-800 px-4 py-3 text-white" /></label>
        <label className="space-y-2 text-sm text-gray-300">Video format<select value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} className="w-full rounded-xl border border-white/10 bg-dark-800 px-4 py-3 text-white"><option>16:9</option><option>9:16</option><option>1:1</option><option>Multiple formats</option></select></label>
        <label className="space-y-2 text-sm text-gray-300">Estimated duration<input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full rounded-xl border border-white/10 bg-dark-800 px-4 py-3 text-white" placeholder="e.g. 60 seconds" /></label>
        <label className="space-y-2 text-sm text-gray-300">Editing style<input value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} className="w-full rounded-xl border border-white/10 bg-dark-800 px-4 py-3 text-white" placeholder="e.g. Cinematic, energetic" /></label>
      </div>
      <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving && <Loader2 className="h-4 w-4 animate-spin" />}Publish project</button>
    </form>}

    <div className="flex flex-col gap-3 sm:flex-row">
      <input aria-label="Search projects" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title, description or category..." className="w-full rounded-xl border border-white/10 bg-dark-800 px-4 py-3 text-sm text-white placeholder:text-gray-500" />
      {isEditor && <div className="self-center text-xs text-gray-500">Live open briefs from the marketplace API</div>}
    </div>

    {loading ? <div className="flex items-center justify-center gap-3 py-16 text-gray-400"><Loader2 className="h-5 w-5 animate-spin" />Loading marketplace data…</div> :
      filteredProjects.length === 0 ? <div className="glass-morphism rounded-2xl border border-white/5 px-6 py-14 text-center"><BriefcaseBusiness className="mx-auto mb-3 h-8 w-8 text-gray-500" /><h2 className="text-lg font-semibold text-white">No projects found</h2><p className="mt-2 text-sm text-gray-400">{isClient ? 'Post your first project brief to get started.' : 'There are no open briefs matching your search right now.'}</p></div> :
      <div className="space-y-4">{filteredProjects.map((project) => <ProjectCard key={project.id} project={project}>
        {isClient ? <div className="space-y-3">
          <button onClick={() => toggleProposals(project.id)} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-200 hover:bg-white/5"><Users className="h-4 w-4" />{expandedProject === project.id ? 'Hide proposals' : 'Review proposals'}</button>
          {expandedProject === project.id && <div className="space-y-3">{(proposalsByProject[project.id] || []).length === 0 ? <p className="text-sm text-gray-400">No proposals submitted for this brief yet.</p> : (proposalsByProject[project.id] || []).map((item) => <div key={item.id} className="rounded-xl border border-white/[0.08] bg-black/10 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="font-semibold text-white">{item.editor?.firstName || item.editor?.username || 'Editor'} {item.editor?.lastName || ''}</div><div className="mt-1 text-xs text-gray-500">Submitted {dateLabel(item.submittedAt)} · {item.estimatedTime || 'Timeline not specified'}</div></div><div className="text-right"><div className="font-semibold text-white">{money(item.proposedBudget)}</div><div className="text-xs text-gray-500">{String(item.status).toLowerCase()}</div></div></div>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-300">{item.message}</p>
            {project.status === 'OPEN' && item.status === 'PENDING' && <button disabled={saving} onClick={() => handleAccept(project.id, item.id)} className="mt-4 rounded-lg bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/25 disabled:opacity-50">Accept proposal</button>}
          </div>)}</div>}
        </div> : <div className="flex flex-wrap items-center gap-3">
          {proposalFor === project.id ? <form onSubmit={handleProposal} className="grid w-full gap-3 sm:grid-cols-2">
            <textarea required minLength={20} rows={3} value={proposal.message} onChange={(e) => setProposal({ ...proposal, message: e.target.value })} placeholder="Explain your approach and relevant experience..." className="rounded-xl border border-white/10 bg-dark-800 px-4 py-3 text-sm text-white sm:col-span-2" />
            <input required value={proposal.estimatedTime} onChange={(e) => setProposal({ ...proposal, estimatedTime: e.target.value })} placeholder="Estimated delivery time" className="rounded-xl border border-white/10 bg-dark-800 px-4 py-3 text-sm text-white" />
            <input required type="number" min="1" step="0.01" value={proposal.proposedBudget} onChange={(e) => setProposal({ ...proposal, proposedBudget: e.target.value })} placeholder="Your quote (USD)" className="rounded-xl border border-white/10 bg-dark-800 px-4 py-3 text-sm text-white" />
            <div className="flex gap-2 sm:col-span-2"><button disabled={saving} className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Sending…' : 'Send proposal'}</button><button type="button" onClick={() => setProposalFor(null)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300">Cancel</button></div>
          </form> : <button onClick={() => setProposalFor(project.id)} className="inline-flex items-center gap-2 rounded-lg bg-primary-500/15 px-4 py-2.5 text-sm font-semibold text-primary-200 hover:bg-primary-500/25"><Send className="h-4 w-4" />Submit a proposal</button>}
          <Link to={`/projects/${project.id}`} className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5">Project details ↗</Link>
        </div>}
      </ProjectCard>)}</div>
    }

    {isEditor && <section className="space-y-4 pt-3"><div><h2 className="text-xl font-semibold text-white">Your proposal activity</h2><p className="mt-1 text-sm text-gray-400">Proposal statuses are loaded from your account, not demo browser storage.</p></div>
      {myProposals.length === 0 ? <div className="glass-morphism rounded-2xl border border-white/5 p-5 text-sm text-gray-400">You have not sent a proposal yet.</div> : myProposals.map((item) => <div key={item.id} className="glass-morphism flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/5 p-4"><div><div className="font-medium text-white">{item.project?.title || 'Project brief'}</div><div className="mt-1 text-xs text-gray-500">Submitted {dateLabel(item.submittedAt)} · {money(item.proposedBudget)}</div></div><span className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-300">{String(item.status).replaceAll('_', ' ')}</span></div>)}
    </section>}
  </div>;
};

export default Projects;
