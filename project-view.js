import {destinations, paintPlanet} from './space.js';

// A full-screen destination, with native dialog focus containment and Escape support.
export function createProjectView(dialog) {
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const scene=dialog.querySelector('.project-scene');
 const closeButton=dialog.querySelector('#close-case');
 let returnFocus=null,returnHash='#home',exitTimer=0,restore=true,updateHash=true,pushed=false,order=null;
 const instant=()=>motion.matches||document.body.classList.contains('space-user-paused');
 // order: the slugs that previous/next should follow (the list the visitor opened from); defaults to the constellation.
 function open(slug,origin=document.activeElement,browseOrder) {
  clearTimeout(exitTimer);dialog.classList.remove('is-departing');
  const destination=destinations.find(n=>n.slug===slug);
  const accent={ocean:'110,211,200',amber:'225,186,125',verdant:'143,209,162',ember:'237,163,160'}[destination?.planet]||'176,166,255';
  dialog.style.setProperty('--destination-rgb',accent);
  const r=origin?.getBoundingClientRect?.();
  const onscreen=r&&r.width&&r.bottom>0&&r.top<innerHeight;
  dialog.style.setProperty('--launch-x',onscreen?`${r.left+r.width/2}px`:'50vw');
  dialog.style.setProperty('--launch-y',onscreen?`${r.top+r.height/2}px`:'50vh');
  scene.replaceChildren();scene.dataset.kind=destination?.kind||'other';
  const body=document.createElement('div');body.className='destination-body';
  if(destination?.planet){
   const canvas=document.createElement('canvas');paintPlanet(canvas,destination.planet,480);body.append(canvas);
   if(destination.planet==='violet'){const ring=document.createElement('span');ring.className='destination-ring';body.append(ring);}
  }else{const star=document.createElement('span');star.className='destination-star';body.append(star);}
  const orbit=document.createElement('span');orbit.className='destination-orbit';body.append(orbit);scene.append(body);
  const caption=document.createElement('p');caption.className='destination-caption';caption.textContent=destination?.kind==='current'?'In orbit · Current work':'A closer look · '+(destination?.label||'The work');scene.append(caption);
  if(browseOrder!==undefined)order=browseOrder;
  const list=order?.includes(slug)&&order.length>1?order.map(s=>destinations.find(n=>n.slug===s)).filter(Boolean):destinations;
  const index=list.findIndex(n=>n.slug===slug);
  dialog.querySelector('#destination-index').textContent=`${String(index+1).padStart(2,'0')} / ${String(list.length).padStart(2,'0')}`;
  for(const [id,offset] of [['previous-project',-1],['next-project',1]]){
   const next=list[(index+offset+list.length)%list.length];
   const button=dialog.querySelector('#'+id);button.dataset.project=next.slug;button.setAttribute('aria-label',`${offset<0?'Previous':'Next'} project: ${next.label}`);
  }
  if(!dialog.open){
   returnFocus=origin;returnHash=location.hash.startsWith('#project/')?'#home':location.hash||'#home';
   document.body.classList.add('project-open');
   window.dispatchEvent(new CustomEvent('portfolio:project-state',{detail:{open:true}}));
   dialog.showModal();
   // Opening adds a history entry so the browser Back button closes the project instead of leaving the site.
   pushed=location.hash!=='#project/'+slug;
   if(pushed)history.pushState(null,'','#project/'+slug);
  }
  dialog.scrollTop=0;dialog.querySelector('.project-reader').scrollTop=0;
  if(!instant())dialog.querySelector('#case-content').animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.2,.7,.2,1)'});
  dialog.querySelector('#case-title').focus({preventScroll:true});
  // Previous/next swap the project in place, so they replace the entry rather than add one.
  if(location.hash!=='#project/'+slug)history.replaceState(null,'','#project/'+slug);
 }
 function close({immediate=false,focus=true,history=true}={}) {
  if(!dialog.open)return;
  restore=focus;updateHash=history;clearTimeout(exitTimer);
  if(immediate||instant()){dialog.close();return;}
  dialog.classList.add('is-departing');exitTimer=setTimeout(()=>dialog.close(),320);
 }
 closeButton.addEventListener('click',()=>close());
 dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
 dialog.addEventListener('close',()=>{
  clearTimeout(exitTimer);dialog.classList.remove('is-departing');document.body.classList.remove('project-open');
  if(updateHash&&location.hash.startsWith('#project/')){
   // Step back over the entry this view added; a deep link that opened the page has none, so rewrite it.
   if(pushed)history.back();else history.replaceState(null,'',returnHash);
  }
  pushed=false;
  window.dispatchEvent(new CustomEvent('portfolio:project-state',{detail:{open:false}}));
  if(restore&&returnFocus?.isConnected)returnFocus.focus({preventScroll:true});
  restore=true;updateHash=true;
 });
 motion.addEventListener('change',()=>{if(motion.matches&&dialog.classList.contains('is-departing'))close({immediate:true});});
 return {open,close};
}
