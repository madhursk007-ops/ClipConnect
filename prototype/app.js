const editors=[
{id:1,name:"Alex Rivera",role:"Film & brand editor",initials:"AR",tone:"violet",rating:"4.9",reviews:28,rate:"$45/hr",category:"Commercial",bio:"Cinematic brand films and product stories with a strong visual identity.",skills:["Premiere Pro","Color grading","Brand films"]},
{id:2,name:"Maya Chen",role:"YouTube & social editor",initials:"MC",tone:"blue",rating:"5.0",reviews:34,rate:"$35/hr",category:"YouTube",bio:"Fast-paced storytelling, creator content and short-form edits built for retention.",skills:["YouTube","Short-form","After Effects"]},
{id:3,name:"Jordan Smith",role:"Motion designer",initials:"JS",tone:"green",rating:"4.8",reviews:19,rate:"$50/hr",category:"Motion",bio:"Clean motion systems, kinetic typography and expressive visual explainers.",skills:["Motion design","2D animation","After Effects"]},
{id:4,name:"Priya Nair",role:"Documentary editor",initials:"PN",tone:"rose",rating:"4.9",reviews:22,rate:"$40/hr",category:"Commercial",bio:"Human-first stories, interviews and thoughtful long-form narrative edits.",skills:["DaVinci Resolve","Storytelling","Audio"]},
{id:5,name:"Noah Williams",role:"Creator video editor",initials:"NW",tone:"amber",rating:"4.7",reviews:16,rate:"$30/hr",category:"YouTube",bio:"Reliable weekly edits for creators, podcasts and educational channels.",skills:["YouTube","Podcast","Premiere Pro"]},
{id:6,name:"Sam Taylor",role:"3D & motion artist",initials:"ST",tone:"cyan",rating:"5.0",reviews:12,rate:"$55/hr",category:"Motion",bio:"3D product visuals and motion-led launch films with polished finishing.",skills:["Blender","3D","Motion design"]}
];
const projects=[
{icon:"▶",title:"YouTube channel — weekly editing partner",description:"Looking for an editor to shape 10–15 minute educational videos with clean pacing, captions and simple motion graphics.",client:"Northstar Learning",category:"YouTube",budget:"$250–400",time:"3–5 days",tags:["YouTube","Captions","Premiere Pro"]},
{icon:"✦",title:"Launch film for a sustainable skincare brand",description:"A 45-second product film with a warm, premium feel. Color grading and sound design experience preferred.",client:"Morrow Studio",category:"Commercial",budget:"$600–900",time:"1–2 weeks",tags:["Brand film","Color grading","Sound"]},
{icon:"◈",title:"Animated explainer for a SaaS product",description:"Turn a product walkthrough into a concise 60-second motion-led explainer with clear visual storytelling.",client:"Orbit Tools",category:"Motion",budget:"$400–650",time:"1 week",tags:["Motion design","2D animation","SaaS"]}
];
const grid=document.querySelector("#editor-grid"),projectList=document.querySelector("#project-list"),search=document.querySelector("#search");
let activeFilter="All",saved=new Set();
function renderEditors(){const q=search.value.trim().toLowerCase();const filtered=editors.filter(e=>(activeFilter==="All"||e.category===activeFilter)&&[e.name,e.role,e.bio,...e.skills].join(" ").toLowerCase().includes(q));grid.innerHTML=filtered.length?filtered.map(e=>`<article class="editor-card"><div class="editor-top"><div class="person"><div class="person-avatar ${e.tone}">${e.initials}</div><div><h3>${e.name}</h3><small>${e.role}</small></div></div><button class="save ${saved.has(e.id)?"saved":""}" data-save="${e.id}" aria-label="Save ${e.name}">${saved.has(e.id)?"★":"☆"}</button></div><p class="editor-bio">${e.bio}</p><div class="skill-tags">${e.skills.map(s=>`<span>${s}</span>`).join("")}</div><div class="editor-bottom"><div><b>★ ${e.rating}</b> <small>(${e.reviews} reviews) · ${e.rate}</small></div><button class="text-btn" data-contact="${e.id}">VIEW PROFILE ↗</button></div></article>`).join(""):`<p class="empty">No sample editors match that search. Try another skill or category.</p>`;}
function renderProjects(){projectList.innerHTML=projects.map((p,i)=>`<article class="brief"><div class="brief-main"><div class="brief-icon">${p.icon}</div><div><h3>${p.title}</h3><p>${p.description}</p><div class="brief-meta"><span>◉ ${p.client}</span><span>▦ ${p.time}</span><span>${p.tags.join(" · ")}</span></div></div></div><div class="brief-side"><b>${p.budget}</b><small>ESTIMATED BUDGET</small><button class="text-btn" data-proposal="${i}">VIEW BRIEF ↗</button></div></article>`).join("");}
const modal=document.querySelector("#modal"),modalTitle=document.querySelector("#modal-title"),modalCopy=document.querySelector("#modal-copy"),modalExtra=document.querySelector("#modal-extra");
function showModal(title,copy,extra=""){modalTitle.textContent=title;modalCopy.textContent=copy;modalExtra.innerHTML=extra;modal.hidden=false;document.body.style.overflow="hidden";}
function closeModal(){modal.hidden=true;document.body.style.overflow="";}
document.querySelectorAll("[data-open]").forEach(b=>b.addEventListener("click",()=>{
  if(b.dataset.open==="login"){
    showModal("Enter the demo workspace","Demo access is available without an email or password. Choose a role to explore a simulated dashboard. This does not create or authenticate a real account.",'<div class="role-picks"><button data-demo-role="client">Continue as client ↗</button><button data-demo-role="editor">Continue as editor ↗</button></div>');
    return;
  }
  showModal("Explore ClipConnect","Account creation is not connected in this preview. You can explore the sample editor profiles and project briefs without signing up.",'<div class="role-picks"><button data-jump="discover">Browse sample editors</button><button data-jump="projects">Browse sample projects</button></div>');
}));
document.querySelector(".modal-close").addEventListener("click",closeModal);document.querySelector("#modal-ok").addEventListener("click",closeModal);modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
modalExtra.addEventListener("click",e=>{
  const demo=e.target.closest("[data-demo-role]");
  const jump=e.target.closest("[data-jump]");
  if(demo){
    const role=demo.dataset.demoRole;
    const isClient=role==="client";
    showModal(isClient?"Client demo workspace":"Editor demo workspace",
      "You are viewing a simulated "+role+" dashboard. No account was created, no credentials were checked, and no data is saved. Use the links below to explore the working sample interactions.",
      '<div class="demo-workspace"><div class="demo-stats"><div><small>'+ (isClient?"OPEN BRIEFS":"MATCHED BRIEFS")+'</small><b>'+(isClient?"3":"3")+'</b></div><div><small>'+(isClient?"SAVED EDITORS":"SAMPLE PROFILE")+'</small><b>'+(isClient?"0":"1")+'</b></div></div><div class="role-picks"><button data-jump="'+(isClient?"projects":"discover")+'">'+(isClient?"Explore project briefs":"Explore editor profiles")+' ↗</button><button data-jump="how">How ClipConnect works</button></div></div>');
    return;
  }
  if(jump){closeModal();document.querySelector("#"+jump.dataset.jump)?.scrollIntoView({behavior:"smooth"});}
});
document.querySelector("#filters").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;activeFilter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderEditors();});
search.addEventListener("input",renderEditors);
grid.addEventListener("click",e=>{const save=e.target.closest("[data-save]");const view=e.target.closest("[data-contact]");if(save){const id=Number(save.dataset.save);saved.has(id)?saved.delete(id):saved.add(id);renderEditors();toast(saved.has(id)?"Saved to your shortlist.":"Removed from your shortlist.");}if(view){const p=editors.find(x=>x.id===Number(view.dataset.contact));showModal(p.name+" · "+p.role,p.bio+" This is a sample profile in the interactive preview.",'<div class="skill-tags">'+p.skills.map(x=>'<span>'+x+'</span>').join("")+'</div>');}});
projectList.addEventListener("click",e=>{const b=e.target.closest("[data-proposal]");if(!b)return;const p=projects[Number(b.dataset.proposal)];showModal(p.title,p.description+" Estimated budget: "+p.budget+". Timeline: "+p.time+". This is a sample brief; proposal submission is disabled in this preview.");});
let toastTimer;function toast(message){const el=document.querySelector("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2300);}
document.querySelector(".menu-toggle").addEventListener("click",()=>document.querySelector(".topbar").classList.toggle("menu-open"));document.querySelectorAll(".topbar nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".topbar").classList.remove("menu-open")));
renderEditors();renderProjects();