(() => {
  "use strict";
  const STORAGE_KEY = "clipconnect-marketplace-demo-v2";
  const seedProjects = [
    { id: "brief-101", title: "YouTube channel — weekly editing partner", description: "Edit 10–15 minute educational videos with clean pacing, captions and simple motion graphics.", budget: "$250–400", deadline: "3–5 days", client: "Northstar Learning", status: "Open", createdAt: "Sample brief" },
    { id: "brief-102", title: "Launch film for a sustainable skincare brand", description: "A 45-second premium product film with thoughtful color grading and sound design.", budget: "$600–900", deadline: "1–2 weeks", client: "Morrow Studio", status: "Open", createdAt: "Sample brief" },
    { id: "brief-103", title: "Animated explainer for a SaaS product", description: "Create a concise 60-second motion-led explainer with clear visual storytelling.", budget: "$400–650", deadline: "1 week", client: "Orbit Tools", status: "Open", createdAt: "Sample brief" }
  ];
  const profiles = [
    { name: "Alex Rivera", role: "Film & brand editor", skills: "Premiere Pro · Color grading", rating: "4.9" },
    { name: "Maya Chen", role: "YouTube & social editor", skills: "Short-form · After Effects", rating: "5.0" },
    { name: "Jordan Smith", role: "Motion designer", skills: "2D animation · Motion design", rating: "4.8" },
    { name: "Priya Nair", role: "Documentary editor", skills: "DaVinci Resolve · Storytelling", rating: "4.9" },
    { name: "Noah Williams", role: "Creator video editor", skills: "YouTube · Podcast", rating: "4.7" },
    { name: "Sam Taylor", role: "3D & motion artist", skills: "Blender · 3D", rating: "5.0" }
  ];
  const $ = (selector, root = document) => root.querySelector(selector);
  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && Array.isArray(saved.projects) && Array.isArray(saved.proposals)) return saved;
    } catch (_) {}
    return { projects: seedProjects, proposals: [], portfolio: [] };
  }
  let state = load();
  if (!Array.isArray(state.portfolio)) state.portfolio = [];
  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  function notify(message) {
    const node = $("#notice");
    if (!node) return;
    node.textContent = message;
    node.hidden = false;
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => { node.hidden = true; }, 2800);
  }
  function projectCard(project, clientView) {
    const proposalCount = state.proposals.filter(item => item.projectId === project.id).length;
    return `<article class="work-card">
      <div><span class="work-status">${esc(project.status)}</span><h3>${esc(project.title)}</h3><p>${esc(project.description)}</p>
      <div class="work-meta"><span>${esc(project.client)}</span><span>${esc(project.deadline)}</span><span>${proposalCount} proposal(s)</span></div></div>
      <div class="work-side"><strong>${esc(project.budget)}</strong><small>ESTIMATED BUDGET</small>
      ${clientView ? `<button class="small-action" data-toggle-project="${esc(project.id)}">${project.status === "Open" ? "Close brief" : "Reopen brief"}</button>` : `<button class="small-action" data-apply-project="${esc(project.id)}">Send proposal ↗</button>`}</div>
    </article>`;
  }
  function renderClient() {
    const projects = $("#client-projects");
    const proposals = $("#client-proposals");
    const open = state.projects.filter(project => project.status === "Open");
    if (projects) projects.innerHTML = state.projects.length ? state.projects.map(project => projectCard(project, true)).join("") : '<p class="empty-state">You have not posted a brief yet. Create your first project above.</p>';
    if (proposals) {
      const rows = state.proposals;
      proposals.innerHTML = rows.length ? rows.map(item => {
        const project = state.projects.find(p => p.id === item.projectId);
        return `<article class="work-card"><div><span class="work-status">${esc(item.status)}</span><h3>${esc(project?.title || "Project brief")}</h3><p>${esc(item.message)}</p><div class="work-meta"><span>${esc(item.editor)}</span><span>${esc(item.createdAt)}</span></div></div><div class="work-side"><strong>${esc(item.quote || "Quote pending")}</strong><small>EDITOR PROPOSAL</small>${item.status === "Submitted" ? `<button class="small-action" data-accept-proposal="${esc(item.id)}">Accept proposal</button>` : ""}</div></article>`;
      }).join("") : '<p class="empty-state">No proposals yet. Editor applications will appear here.</p>';
    }
    $("#client-open-count") && ($("#client-open-count").textContent = String(open.length));
    $("#client-proposal-count") && ($("#client-proposal-count").textContent = String(state.proposals.length));
    $("#client-total-count") && ($("#client-total-count").textContent = String(state.projects.length));
  }
  let activeBrief = null;
  function renderEditor() {
    const list = $("#editor-available-projects");
    const applications = $("#editor-applications");
    const open = state.projects.filter(project => project.status === "Open");
    if (list) list.innerHTML = open.length ? open.map(project => projectCard(project, false) + (activeBrief === project.id ? `<form class="workspace-form proposal-form" data-proposal-form="${esc(project.id)}"><label>Proposal message<textarea name="message" required minlength="12" maxlength="700" placeholder="Explain how you would approach this edit..." required></textarea></label><label>Your estimated quote<input name="quote" maxlength="60" placeholder="e.g. $320 fixed price" required></label><button class="btn primary" type="submit">Submit proposal</button></form>` : "")).join("") : '<p class="empty-state">No open briefs at the moment. Check back soon.</p>';
    if (applications) {
      const mine = state.proposals.filter(item => item.editor === "Demo Editor");
      applications.innerHTML = mine.length ? mine.map(item => {
        const project = state.projects.find(p => p.id === item.projectId);
        return `<article class="work-card"><div><span class="work-status">${esc(item.status)}</span><h3>${esc(project?.title || "Project brief")}</h3><p>${esc(item.message)}</p><div class="work-meta"><span>${esc(item.createdAt)}</span></div></div><div class="work-side"><strong>${esc(item.quote)}</strong><small>YOUR QUOTE</small></div></article>`;
      }).join("") : '<p class="empty-state">You have not submitted a proposal yet. Find a brief above to get started.</p>';
    }
    $("#editor-open-count") && ($("#editor-open-count").textContent = String(open.length));
    $("#editor-application-count") && ($("#editor-application-count").textContent = String(state.proposals.filter(item => item.editor === "Demo Editor").length));
    $("#editor-profile-count") && ($("#editor-profile-count").textContent = String(profiles.length));
    const portfolio = $("#editor-portfolio");
    if (portfolio) portfolio.innerHTML = state.portfolio.length ? state.portfolio.map((item, index) => `<article class="work-card"><div><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p></div><button class="small-action" data-remove-work="${index}">Remove</button></article>`).join("") : '<p class="empty-state">Your demo portfolio is empty. Add a work sample to preview your editor profile.</p>';
  }
  $("#client-project-form")?.addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    state.projects.unshift({
      id: "brief-" + Date.now(), title: values.get("title").trim(), description: values.get("description").trim(),
      budget: values.get("budget").trim(), deadline: values.get("deadline"), client: "Demo Client", status: "Open", createdAt: new Date().toLocaleDateString()
    });
    save(); form.reset(); renderClient(); notify("Your brief is now visible in the Editor workspace demo.");
  });
  $("#client-projects")?.addEventListener("click", event => {
    const button = event.target.closest("[data-toggle-project]");
    if (!button) return;
    const project = state.projects.find(item => item.id === button.dataset.toggleProject);
    if (!project) return;
    project.status = project.status === "Open" ? "Closed" : "Open";
    save(); renderClient(); notify("Project brief status updated.");
  });
  $("#client-proposals")?.addEventListener("click", event => {
    const button = event.target.closest("[data-accept-proposal]");
    if (!button) return;
    const proposal = state.proposals.find(item => item.id === button.dataset.acceptProposal);
    if (!proposal) return;
    proposal.status = "Accepted (demo)";
    save(); renderClient(); renderEditor(); notify("Proposal accepted in the shared demo workspace.");
  });
  $("#editor-available-projects")?.addEventListener("click", event => {
    const button = event.target.closest("[data-apply-project]");
    if (!button) return;
    activeBrief = activeBrief === button.dataset.applyProject ? null : button.dataset.applyProject;
    renderEditor();
  });
  $("#editor-available-projects")?.addEventListener("submit", event => {
    const form = event.target.closest("[data-proposal-form]");
    if (!form) return;
    event.preventDefault();
    const values = new FormData(form);
    const message = String(values.get("message") || "").trim();
    const quote = String(values.get("quote") || "").trim();
    if (message.length < 12 || !quote) { notify("Add a proposal message and quote before submitting."); return; }
    const projectId = form.dataset.proposalForm;
    if (state.proposals.some(item => item.projectId === projectId && item.editor === "Demo Editor")) {
      notify("You have already submitted a demo proposal for this brief."); return;
    }
    state.proposals.unshift({ id: "proposal-" + Date.now(), projectId, editor: "Demo Editor", message, quote, createdAt: new Date().toLocaleDateString(), status: "Submitted" });
    activeBrief = null; save(); renderEditor(); renderClient(); notify("Proposal submitted. It now appears in the Client workspace.");
  });
  $("#editor-portfolio-form")?.addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget, values = new FormData(form);
    state.portfolio.unshift({ title: String(values.get("title")).trim(), description: String(values.get("description")).trim() });
    save(); form.reset(); renderEditor(); notify("Work sample added to your demo portfolio.");
  });
  $("#editor-portfolio")?.addEventListener("click", event => {
    const button = event.target.closest("[data-remove-work]");
    if (!button) return;
    state.portfolio.splice(Number(button.dataset.removeWork), 1);
    save(); renderEditor(); notify("Work sample removed.");
  });
  document.querySelectorAll(".menu-toggle").forEach(button => button.addEventListener("click", () => $(".topbar")?.classList.toggle("menu-open")));
  document.querySelectorAll(".topbar nav a").forEach(link => link.addEventListener("click", () => $(".topbar")?.classList.remove("menu-open")));
  if (document.body.dataset.workspace === "client") renderClient();
  if (document.body.dataset.workspace === "editor") renderEditor();
})();