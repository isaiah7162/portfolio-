// Paper desk: hash routes swap the desk for one opened paper.
//   #desk (or no hash)   the desk
//   #project/<slug>      a project sheet, from content.json
//   #everything          the folder: every entry that is not a featured note
//   #about               education, skills, recognition, from profile.json
const $=s=>document.querySelector(s);
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const featured=['jarvis','quant','protein-function-predictor','mutation','pruning','terrasite'];
const groups=['Internships','Research','Projects','Work','Archive'];
const baseTitle='Isaiah Hawkins — Portfolio';
const desk=$('#view-desk'),view=$('#view-sheet'),sheet=$('#sheet');
let projects=[],profile={},loaded=false,failed=false;

const others=()=>projects.filter(p=>!featured.includes(p.slug));
const figures=list=>list?.length?'<div class="figures">'+list.map(f=>`<figure><img src="${safe(f.src)}" alt="${safe(f.alt)}" width="1280" height="720" loading="lazy"><figcaption>${safe(f.caption)}</figcaption></figure>`).join('')+'</div>':'';
const meta=(...parts)=>parts.filter(x=>x&&x!=='—').map(safe).join(' · ');
const rows=list=>'<dl class="rows">'+list.map(r=>`<dt>${safe(r.k)}</dt><dd>${safe(r.v)}</dd>`).join('')+'</dl>';

function projectSheet(p){
 // Featured notes page through each other; everything else pages through the folder.
 const order=featured.includes(p.slug)?featured:others().map(x=>x.slug);
 const i=order.indexOf(p.slug),find=s=>projects.find(x=>x.slug===s);
 const prev=find(order[i-1]),next=find(order[i+1]);
 return `<p class="eyebrow">${meta(p.cat,p.org,p.when)}</p>
<h1 tabindex="-1">${safe(p.title)}</h1>
<p class="lede">${safe(p.lede||p.blurb)}</p>
${p.tags?.length?'<ul class="tags">'+p.tags.map(t=>`<li>${safe(t)}</li>`).join('')+'</ul>':''}
${p.stats?.length?'<dl class="stats">'+p.stats.map(s=>`<div><dt>${safe(s.n)}</dt><dd>${safe(s.label)}</dd></div>`).join('')+'</dl>':''}
${figures(p.images)}
${(p.sections||[]).map(s=>`<section><h2>${safe(s.h)}</h2>${(s.paras||[]).map(t=>`<p>${safe(t)}</p>`).join('')}${s.rows?.length?rows(s.rows):''}${figures(s.images)}${(s.links||[]).filter(l=>l.href.startsWith('#')).map(l=>`<p><a href="${safe(l.href)}">${safe(l.label)}</a></p>`).join('')}</section>`).join('')}
<nav class="pager" aria-label="More work">${prev?`<a href="#project/${safe(prev.slug)}">← ${safe(prev.card||prev.title)}</a>`:''}${next?`<a class="next" href="#project/${safe(next.slug)}">${safe(next.card||next.title)} →</a>`:'<a class="next" href="#everything">Everything else →</a>'}</nav>`;
}

function everythingSheet(notice){
 const list=others();
 return `${notice?`<p class="notice" role="status">${safe(notice)}</p>`:''}
<p class="eyebrow">The folder · ${list.length} more ${list.length===1?'entry':'entries'}</p>
<h1 tabindex="-1">Everything else</h1>
${groups.map(g=>{const ps=list.filter(p=>p.cat===g);return ps.length?`<section><h2>${g}</h2><ul class="index">${ps.map(p=>`<li><a href="#project/${safe(p.slug)}"><span class="index-title">${safe(p.card||p.title)}</span><span class="index-meta">${meta(p.org,p.when)}</span></a></li>`).join('')}</ul></section>`:'';}).join('')}`;
}

function aboutSheet(){
 const list=(h,items)=>items?.length?`<section><h2>${h}</h2>${rows(items)}</section>`:'';
 return `<p class="eyebrow">Prairie View, TX · B.S. Computer Science, Data Science concentration · May 2027</p>
<h1 tabindex="-1">About me</h1>
<p class="lede">I’m Isaiah, a Computer Science student at Prairie View A&amp;M University, graduating in May 2027.</p>
<p>My work spans software development, AI evaluation, and research. I’ve built evaluation pipelines at Walt Disney Imagineering, explored neural network efficiency with LSAMP, and turned hackathon ideas into working prototypes.</p>
${list('Education',profile.degree)}
${list('Skills',profile.skills?.map(g=>({k:g.k,v:g.items.map(i=>i.n).join(' · ')})))}
${list('Recognition',profile.awards?.map(a=>({k:a.k,v:a.v+' · '+a.m})))}
${list('Organizations',profile.orgs)}
${profile.coursework?.length?`<section><h2>Coursework</h2><p>${profile.coursework.map(safe).join(' · ')}</p></section>`:''}
${profile.certs?.length?`<section><h2>Certifications</h2><p>${profile.certs.map(safe).join(' · ')}</p></section>`:''}
<nav class="pager" aria-label="Contact"><a href="assets/Isaiah-Hawkins-Resume.pdf" target="_blank" rel="noopener">Read my résumé ↗</a><a class="next" href="mailto:ihawkins5@pvamu.edu">Email me →</a></nav>`;
}

function show(html,title,current){
 sheet.innerHTML=html;
 desk.hidden=true;view.hidden=false;
 document.title=title+' — Isaiah Hawkins';
 view.querySelectorAll('.mini').forEach(a=>{if(a.getAttribute('href')===current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 scrollTo(0,0);
 sheet.querySelector('h1')?.focus({preventScroll:true});
}

function route(){
 const hash=decodeURIComponent(location.hash.slice(1));
 if(hash==='main')return; // skip link
 if(!hash||hash==='desk'){
  const wasOpen=!view.hidden;
  view.hidden=true;desk.hidden=false;document.title=baseTitle;
  if(wasOpen){scrollTo(0,0);$('#name').tabIndex=-1;$('#name').focus({preventScroll:true});}
  return;
 }
 if(failed){show(`<h1 tabindex="-1">This paper went missing</h1><p>The portfolio details could not be loaded. Please refresh the page, or <a href="assets/Isaiah-Hawkins-Resume.pdf">read the résumé</a>.</p>`,'Unavailable',null);return;}
 if(!loaded)return; // route() runs again once the data arrives
 if(hash==='about'){show(aboutSheet(),'About','#about');return;}
 if(hash==='everything'){show(everythingSheet(),'Everything else','#everything');return;}
 if(hash.startsWith('project/')){
  let slug=hash.slice(8);if(slug==='watersight')slug='terrasite'; // WaterSight lives on as TerraSite's origin
  const p=projects.find(x=>x.slug===slug);
  if(p){show(projectSheet(p),p.title,featured.includes(slug)?'#project/'+slug:'#everything');return;}
  show(everythingSheet('That link doesn’t match a paper on this desk, so here is the full folder instead.'),'Everything else','#everything');return;
 }
 history.replaceState(null,'','#desk');route();
}

addEventListener('hashchange',route);
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&!view.hidden&&!document.documentElement.classList.contains('hello-on'))location.hash='#desk';
});
route();
try{
 const res=await Promise.all([fetch('content.json'),fetch('profile.json')]);
 if(res.some(r=>!r.ok))throw Error('Portfolio data unavailable');
 [projects,profile]=await Promise.all(res.map(r=>r.json()));
 loaded=true;
 const n=others().length;
 $('#folder-count').textContent=`${n} more →`;
}catch(err){failed=true;}
route();
