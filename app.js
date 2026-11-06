import {createUniverse} from './space.js';
import {createProjectView} from './project-view.js';
import {answerQuestion} from './guide.js';
const $=s=>document.querySelector(s);
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const motion=matchMedia('(prefers-reduced-motion: reduce)');
let projects=[],profile={},activeFilter='Selected',chatContext={},lastFocus=null;
const categories=['Selected','All','Current','Internships','Research','Projects','Academics','Skills','Leadership'];
const featured=['jarvis','visible','protein-function-predictor','terrasite'];
const universe=createUniverse($('#universe'),$('#celestial-map'),$('#pause-space'));
const projectView=createProjectView($('#case-dialog'));
$('#replay-intro').addEventListener('click',()=>window.dispatchEvent(new Event('portfolio:replay-intro')));
// Type once, reserving the complete two-line name to prevent layout movement.
const full=['Isaiah','Hawkins'],names=[$('#first-name'),$('#last-name')];
let typeTimer;
function finishName(){clearTimeout(typeTimer);names.forEach((n,i)=>n.textContent=full[i]);document.body.classList.add('typing-complete');}
let nameStarted=false;
function startName(){
 if(nameStarted)return;nameStarted=true;
 if(motion.matches){finishName();return;}
 names.forEach(n=>n.textContent='');let n=0;
 const type=()=>{n++;names[0].textContent=full[0].slice(0,n);names[1].textContent=full[1].slice(0,Math.max(0,n-full[0].length));if(n<full.join('').length)typeTimer=setTimeout(type,n===full[0].length?240:100);else finishName();};
 typeTimer=setTimeout(type,150);
}
if(document.documentElement.classList.contains('intro-pending')){
 names.forEach(n=>n.textContent='');
 window.addEventListener('portfolio:intro-complete',startName,{once:true});
}else startName();
window.addEventListener('portfolio:intro-start',()=>{clearTimeout(typeTimer);nameStarted=false;document.body.classList.remove('typing-complete');names.forEach(n=>n.textContent='');window.addEventListener('portfolio:intro-complete',startName,{once:true});});
motion.addEventListener('change',()=>{if(motion.matches)finishName();});
if('IntersectionObserver' in window){document.documentElement.classList.add('js-reveal');const reveal=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('is-visible');reveal.unobserve(e.target);}},{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>reveal.observe(el));}
const listMarkup=(rows)=>'<dl class="detail-list">'+rows.map(x=>`<div class="detail-line"><dt>${safe(x.k)}</dt><dd>${safe(x.v)}</dd></div>`).join('')+'</dl>';
function setFilter(value){activeFilter=value;$('#work-search').value='';renderWork();}
function renderWork(){
 if(!$('#filters').children.length) $('#filters').innerHTML=categories.map(c=>`<button aria-pressed="false" data-filter="${c}">${c}</button>`).join('');
 $('#filters').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===activeFilter)));
 const q=$('#work-search').value.trim().toLowerCase();
 const match=x=>!q||JSON.stringify(x).toLowerCase().includes(q);
 let html='',count=0;
 if(activeFilter==='Skills'){const rows=profile.skills.map(g=>({k:g.k,v:g.items.map(i=>i.n).join(' · ')})).filter(match);count=rows.length;html=listMarkup(rows);}
 else if(activeFilter==='Leadership'){const rows=profile.orgs.filter(match);count=rows.length;html=listMarkup(rows);}
 else if(activeFilter==='Academics'){const groups=[['Education',profile.degree],['Coursework',profile.coursework.map(v=>({k:v,v:'Prairie View A&M University'}))],['Certifications',profile.certs.map(v=>({k:v,v:'Listed certification'}))],['Recognition',profile.awards.map(a=>({k:a.k,v:a.v+' · '+a.m}))]];html=groups.map(([h,rows])=>{const r=rows.filter(match);count+=r.length;return r.length?`<h3 class="section-subtitle">${h}</h3>`+listMarkup(r):'';}).join('');}
 else {
 const ps=projects.filter(p=>(activeFilter==='All'||activeFilter==='Selected'&&featured.includes(p.slug)||activeFilter==='Current'&&p.current||p.cat===activeFilter||p.also===activeFilter)&&match(p));
 if(activeFilter==='Selected')ps.sort((a,b)=>featured.indexOf(a.slug)-featured.indexOf(b.slug));count=ps.length;
 html=ps.map((p,i)=>`<button class="work-row" data-project="${safe(p.slug)}" aria-label="Read ${safe(p.title)}"><span class="number">${String(i+1).padStart(2,'0')}</span><div><h3>${safe(p.title)}</h3><p class="meta">${safe(p.org)} · ${safe(p.when)}</p></div><div><p class="summary">${safe(p.lede||p.blurb)}</p><p class="tags">${p.tags.slice(0,4).map(safe).join(' / ')}</p></div><span class="row-arrow" aria-hidden="true">↗</span></button>`).join('');
 }
 $('#result-count').textContent=`${activeFilter} / ${count} ${count===1?'entry':'entries'}`;
 $('#work-list').innerHTML=count?html:'<p class="empty-state">No matches. Try another term or choose a different category.</p>';
}
function openCase(slug,origin=document.activeElement){
 if(slug==='watersight')slug='terrasite';
 const p=projects.find(x=>x.slug===slug);if(!p)return;
 if($('#chat-dialog').open){$('#chat-dialog').close();origin=lastFocus||$('#home');}
 $('#case-content').innerHTML=`<p class="eyebrow">${safe(p.cat)} · ${safe(p.org)} · ${safe(p.when)}</p><h2 id="case-title">${safe(p.title)}</h2><p class="case-lede">${safe(p.lede||p.blurb)}</p><p class="case-tags">${p.tags.map(safe).join(' / ')}</p>${p.stats?.length?'<dl class="case-stats">'+p.stats.map(s=>`<div><dt>${safe(s.n)}</dt><dd>${safe(s.label)}</dd></div>`).join('')+'</dl>':''}${p.sections.map(s=>`<section class="case-section"><h3>${safe(s.h)}</h3><div>${(s.paras||[]).map(p=>`<p>${safe(p)}</p>`).join('')}${s.rows?.length?'<dl>'+s.rows.map(r=>`<dt>${safe(r.k)}</dt><dd>${safe(r.v)}</dd>`).join('')+'</dl>':''}</div></section>`).join('')}<button class="text-link case-ask" data-question="Tell me more about ${safe(p.title)}">Ask about this work <span aria-hidden="true">↗</span></button>`;
 $('#case-title').tabIndex=-1;projectView.open(p.slug,origin);
}
function openChat(){if($('#case-dialog').open)projectView.close({immediate:true});if(!$('#chat-dialog').open){lastFocus=document.activeElement;$('#chat-dialog').showModal();}$('#chat-input').focus();}
function addMessage(text,role,sources=[]){const el=document.createElement('div');el.className='message '+role;const p=document.createElement('p');p.textContent=text;el.append(p);
 if(sources.length){const refs=document.createElement('div');refs.className='sources';for(const s of sources){let a;if(s.slug||s.filter){a=document.createElement('button');if(s.slug)a.dataset.project=s.slug;else a.dataset.chatFilter=s.filter;}else{a=document.createElement('a');a.href=s.href;if(s.href.startsWith('http')||s.href.endsWith('.pdf')){a.target='_blank';a.rel='noopener';}}a.textContent=s.label;refs.append(a);}el.append(refs);}
 $('#chat-log').append(el);$('#chat-log').scrollTop=$('#chat-log').scrollHeight;
}
function ask(q){q=q.trim().slice(0,500);if(!q)return;openChat();addMessage(q,'user');$('#chat-input').value='';if(!projects.length){addMessage('The portfolio details could not be loaded. Please refresh the page, or contact Isaiah using the email link below.','assistant',[{label:'Email Isaiah',href:'mailto:Ihawkins5@pvamu.edu'}]);return;}const response=answerQuestion(q,projects,profile,chatContext);chatContext=response.context;addMessage(response.text,'assistant',response.sources);}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-chat-open'))openChat();
 else if(b.dataset.question)ask(b.dataset.question);
 else if(b.dataset.project)openCase(b.dataset.project,b);
 else if(b.dataset.filter)setFilter(b.dataset.filter);
 else if(b.dataset.chatFilter){$('#chat-dialog').close();setFilter(b.dataset.chatFilter);$('#work').scrollIntoView({behavior:motion.matches?'instant':'smooth'});}
});
$('#work-search').addEventListener('input',renderWork);
$('#chat-form').addEventListener('submit',e=>{e.preventDefault();ask($('#chat-input').value);});
$('#close-chat').addEventListener('click',()=>$('#chat-dialog').close());
for(const dialog of [$('#chat-dialog')]){
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{if(lastFocus?.isConnected)lastFocus.focus({preventScroll:true});});
}
$('#clear-chat').addEventListener('click',()=>{chatContext={};$('#chat-log').replaceChildren();addMessage('A fresh start. Ask me about Isaiah’s projects, experience, or skills.','assistant');$('#chat-input').focus();});
$('#chat-log').addEventListener('click',e=>{const a=e.target.closest('a');if(a?.getAttribute('href').startsWith('#'))$('#chat-dialog').close();});
try{
 const responses=await Promise.all([fetch('content.json'),fetch('profile.json')]);if(responses.some(r=>!r.ok))throw Error('Portfolio data unavailable');
 [projects,profile]=await Promise.all(responses.map(r=>r.json()));
 $('#current-list').innerHTML=['quant','visible','protein-function-predictor'].map((slug,i)=>{const p=projects.find(p=>p.slug===slug);return `<button class="current-row" data-project="${slug}"><span class="number">0${i+1}</span><div><h3>${safe(p.title)}</h3><small>${safe(p.org)} · ${safe(p.when)}</small></div><p>${safe(p.lede)}</p><span class="row-arrow" aria-hidden="true">↗</span></button>`;}).join('');
 universe.setProjects(projects);
 renderWork();if(location.hash.startsWith('#project/'))openCase(decodeURIComponent(location.hash.slice(9)));
}catch(err){$('#work-list').innerHTML='<p class="empty-state">The portfolio details could not be loaded. Please refresh the page or <a href="assets/Isaiah-Hawkins-Resume.pdf">read the résumé</a>.</p>';$('#current-list').innerHTML='<p class="empty-state">Project details are temporarily unavailable.</p>';}
window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#project/'))openCase(decodeURIComponent(location.hash.slice(9)));else projectView.close({immediate:true,focus:false,history:false});});
