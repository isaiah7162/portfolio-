const escapeHTML = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const home=document.querySelector('#home'), detail=document.querySelector('#case');
let projects;
async function route(){
 const slug=new URL(location.href).searchParams.get('project');
 if(!slug){home.hidden=false;detail.hidden=true;document.title='Isaiah Hawkins — Software Engineer & AI Builder';return;}
 try{projects ||= await fetch('content.json').then(r=>{if(!r.ok)throw Error('Project data unavailable');return r.json()});const p=projects.find(x=>x.slug===slug);if(!p)throw Error('Project not found');
 detail.innerHTML=`<a class="back" href="./#work">← All work</a><p class="eyebrow">${escapeHTML(p.org)} / ${escapeHTML(p.when)}</p><h1>${escapeHTML(p.title)}</h1><p class="lede">${escapeHTML(p.lede)}</p><div class="tags">${p.tags.map(t=>`<span>${escapeHTML(t)}</span>`).join('')}</div>${p.sections.map(s=>`<section><h2>${escapeHTML(s.h)}</h2>${s.paras.map(t=>`<p>${escapeHTML(t)}</p>`).join('')}<div class="rows">${(s.rows||[]).map(r=>`<div><strong>${escapeHTML(r.k)}</strong>${escapeHTML(r.v)}</div>`).join('')}</div></section>`).join('')}<section><a class="back" href="./#work">← Back to selected work</a></section>`;
 document.title=p.title+' — Isaiah Hawkins';
 }catch(e){detail.innerHTML='<h1>Project unavailable</h1><p>Please return to the portfolio and try again.</p><a class="back" href="./#work">← All work</a>';}
 home.hidden=true;detail.hidden=false;detail.focus();window.scrollTo(0,0);
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelectorAll('[data-category]').forEach(card=>card.hidden=button.dataset.filter!=='All'&&card.dataset.category!==button.dataset.filter);}));
document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0)return;const url=new URL(a.href);if(url.origin!==location.origin||a.target||a.hasAttribute('download'))return;if(url.searchParams.has('project')){e.preventDefault();history.pushState({},'',url);route();}});
window.addEventListener('popstate',route);route();
if(matchMedia('(prefers-reduced-motion: reduce)').matches){document.querySelector('#motion').textContent='Play scene';document.querySelector('#motion').setAttribute('aria-pressed','true');}
