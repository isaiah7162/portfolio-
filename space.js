// A procedural constellation: lightweight canvas scenery, accessible HTML destinations.
export const destinations = [
 {slug:'jarvis',kind:'featured',label:'Disney · JARVIS',note:'AI evaluation',x:29,y:55,mx:26,my:41,primary:true},
 {slug:'terrasite',kind:'featured',label:'TerraSite',note:'Environmental intelligence',x:47,y:72,mx:25,my:60},
 {slug:'pruning',kind:'featured',label:'LSAMP Research',note:'Neural network efficiency',x:47,y:32,mx:26,my:77},
 {slug:'quant',kind:'current',label:'Quantitative Analyst Intern',note:'SC Capital · Current',x:78,y:30,mx:74,my:37,planet:'amber'},
 {slug:'visible',kind:'current',label:'Visible',note:'Founder · Builder · Current',x:67,y:55,mx:74,my:56,planet:'ocean'},
 {slug:'protein-function-predictor',kind:'current',label:'Protein Function Predictor',note:'Research · Current',x:85,y:73,mx:74,my:75,planet:'violet'},
 {slug:'vital',kind:'other',label:'Vital Handoff',x:16,y:68,mx:12,my:50},
 {slug:'finsight',kind:'other',label:'FinSight',x:56,y:44,mx:46,my:49},
 {slug:'vista',kind:'other',label:'Vista Hackathon',x:35,y:78,mx:46,my:67},
 {slug:'onrecord',kind:'other',label:'On Record',x:58,y:80,mx:48,my:81},
 {slug:'onrecord-research',kind:'other',label:'On Record: Research',x:65,y:71,mx:13,my:85,desktop:true},
 {slug:'summerhouse',kind:'other',label:'Teaching programming',x:14,y:53,mx:40,my:60,desktop:true},
 {slug:'tacc',kind:'other',label:'Advanced Computing',x:61,y:28,mx:40,my:70,desktop:true},
 {slug:'hackathons',kind:'other',label:'Hackathon record',x:89,y:49,mx:40,my:80,desktop:true},
 {slug:'slingo',kind:'other',label:'Slingo',x:38,y:43,mx:10,my:70,desktop:true},
 {slug:'cookbook',kind:'other',label:'Cookbook',x:80,y:57,mx:10,my:75,desktop:true},
 {slug:'americanpool',kind:'other',label:'American Pool',x:94,y:62,mx:10,my:80,desktop:true},
 {slug:'bahamabucks',kind:'other',label:'Bahama Buck’s',x:72,y:82,mx:10,my:85,desktop:true}
];
const rand = seed => () => {seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};
function planet(canvas,kind){
 const size=180;canvas.width=canvas.height=size;const ctx=canvas.getContext('2d'),im=ctx.createImageData(size,size);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const nx=(x-size/2)/(size/2-3),ny=(y-size/2)/(size/2-3),r2=nx*nx+ny*ny;if(r2>1)continue;
  const z=Math.sqrt(1-r2),lon=Math.atan2(nx,z),lat=Math.asin(ny);
  const grain=Math.sin(lon*29+Math.sin(lat*17)*2)*Math.cos(lat*43+lon*7);
  let rgb;
  if(kind==='amber'){const v=(Math.sin(lat*24+Math.sin(lon*5)*.6)+1)/2;rgb=[156+v*61+grain*8,116+v*58+grain*6,75+v*49];}
  else if(kind==='ocean'){const land=Math.sin(lon*6+lat*3)+Math.cos(lat*10-lon*3)+grain*.3;rgb=land>.55?[87+land*18,153+land*15,137+land*10]:[38,97+grain*10,145+grain*15];const cloud=Math.max(0,Math.sin(lon*16+lat*19+Math.sin(lon*7))*Math.cos(lat*11)-.48)*.65;rgb=rgb.map(c=>c+(235-c)*cloud);}
  else{const band=(Math.sin(lat*16+Math.sin(lon*6)*.8)+1)/2;rgb=[117+band*65,113+band*51,175+band*60];}
  const light=Math.max(0,-nx*.52-ny*.42+z*.62);const shade=.08+light*.92;const rim=Math.pow(1-z,4)*Math.max(0,light)*.35;
  const i=(y*size+x)*4;im.data[i]=Math.min(255,rgb[0]*shade+rim*100);im.data[i+1]=Math.min(255,rgb[1]*shade+rim*150);im.data[i+2]=Math.min(255,rgb[2]*shade+rim*230);im.data[i+3]=Math.min(255,(1-r2)*12000);
 }
 ctx.putImageData(im,0,0);
}
export function createUniverse(canvas,map,pause){
 const ctx=canvas.getContext('2d'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 let w=0,h=0,dpr=1,raf=0,last=0,time=0,paused=false,visible=true,filter='all',active='',nodes=[];
 const random=rand(7162),stars=Array.from({length:750},()=>({x:random(),y:random(),r:.25+random()**4*1.65,a:.18+random()*.6,phase:random()*6.28,speed:.00015+random()*.00035}));
 const dust=Array.from({length:650},()=>{const p=random(),spread=(random()+random()+random()-1.5)*.17;return {x:.08+p*.9,y:.89-p*.65+spread,r:random()*1.1,a:random()*.16};});
 const background=document.createElement('canvas'),bg=background.getContext('2d');
 const at=n=>({x:(w<=600?n.mx:n.x)*w/100,y:(w<=600?n.my:n.y)*h/100});
 function paint(){
  if(!ctx||!w||!h)return;ctx.clearRect(0,0,w,h);ctx.drawImage(background,0,0,w,h);
  for(const s of stars){const a=s.a*(.74+.26*Math.sin(time*s.speed+s.phase));ctx.fillStyle=`rgba(196,212,255,${a})`;ctx.beginPath();ctx.arc(s.x*w,s.y*h,s.r,0,Math.PI*2);ctx.fill();}
  const connections=[['jarvis','slingo'],['slingo','pruning'],['jarvis','vital'],['jarvis','terrasite'],['terrasite','vista'],['terrasite','onrecord'],['visible','finsight'],['visible','protein-function-predictor'],['quant','tacc']];
  for(const [a,b] of connections){const na=nodes.find(n=>n.slug===a),nb=nodes.find(n=>n.slug===b);if(!na||!nb||(w<=600&&(na.desktop||nb.desktop)))continue;if(filter!=='all'&&(na.kind!==filter||nb.kind!==filter))continue;const p=at(na),q=at(nb);const highlight=active===a||active===b;ctx.strokeStyle=highlight?'rgba(154,183,246,.37)':'rgba(141,166,219,.09)';ctx.lineWidth=highlight?1:.65;ctx.setLineDash(highlight?[]:[2,7]);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}
  ctx.setLineDash([]);
 }
 function makeBackground(){
  background.width=Math.round(w*dpr);background.height=Math.round(h*dpr);bg.setTransform(dpr,0,0,dpr,0,0);bg.fillStyle='#070914';bg.fillRect(0,0,w,h);
  for(const g of [[.5,.52,.49,'44,47,108'],[.72,.36,.3,'34,66,104'],[.29,.7,.25,'79,45,101']]){const rad=w*g[2],gradient=bg.createRadialGradient(w*g[0],h*g[1],0,w*g[0],h*g[1],rad);gradient.addColorStop(0,`rgba(${g[3]},.21)`);gradient.addColorStop(.5,`rgba(${g[3]},.07)`);gradient.addColorStop(1,`rgba(${g[3]},0)`);bg.fillStyle=gradient;bg.fillRect(0,0,w,h);}
  for(const s of dust){bg.fillStyle=`rgba(167,156,231,${s.a})`;bg.beginPath();bg.arc(s.x*w,s.y*h,s.r,0,6.283);bg.fill();}
 }
 function resize(){const r=canvas.getBoundingClientRect();w=Math.round(r.width);h=Math.round(r.height);dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0);makeBackground();paint();updateStatus();}
 function updateStatus(){const visibleNodes=nodes.filter(n=>(filter==='all'||n.kind===filter)&&!(w<=600&&n.desktop));document.querySelector('#map-status').textContent=`${visibleNodes.length} destinations shown. ${w<=600?'All projects are available in list view.':''}`;}
 function frame(now){raf=0;if(paused||motion.matches||document.hidden||!visible)return;if(!last||now-last>=32){time+=last?Math.min(now-last,80):0;last=now;paint();}raf=requestAnimationFrame(frame);}
 function resume(){cancelAnimationFrame(raf);last=0;document.body.classList.toggle('space-motion-paused',paused||motion.matches||document.hidden||!visible);paint();if(!paused&&!motion.matches&&!document.hidden&&visible)raf=requestAnimationFrame(frame);}
 pause.addEventListener('click',()=>{paused=!paused;pause.textContent=paused?'Resume motion':'Pause motion';pause.setAttribute('aria-pressed',String(paused));resume();});
 document.querySelectorAll('[data-map-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.mapFilter;document.querySelectorAll('[data-map-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));map.querySelectorAll('.celestial-node').forEach(x=>x.hidden=filter!=='all'&&x.dataset.kind!==filter);updateStatus();paint();}));
 map.addEventListener('pointerover',e=>{active=e.target.closest('[data-project]')?.dataset.project||'';paint();});map.addEventListener('pointerleave',()=>{active='';paint();});map.addEventListener('focusin',e=>{active=e.target.closest('[data-project]')?.dataset.project||'';paint();});map.addEventListener('focusout',()=>{active='';paint();});
 new ResizeObserver(resize).observe(canvas);new IntersectionObserver(es=>{visible=es[0].isIntersecting;document.body.classList.toggle('space-in-view',visible);resume();}).observe(canvas);document.addEventListener('visibilitychange',resume);motion.addEventListener('change',resume);resize();resume();
 return {setProjects(projects){
  nodes=destinations.filter(n=>projects.some(p=>p.slug===n.slug));map.replaceChildren();
  for(const n of nodes){const p=projects.find(p=>p.slug===n.slug);const button=document.createElement('button');button.className=`celestial-node ${n.kind}${n.primary?' primary':''}${n.desktop?' map-desktop-only':''}`;button.dataset.project=n.slug;button.dataset.kind=n.kind;button.setAttribute('aria-label',`${p.title} — ${n.kind==='current'?'current project, planet':n.kind==='featured'?'featured work, bright star':'other work, star'}`);
   for(const [k,v]of Object.entries({x:n.x+'%',y:n.y+'%',mx:n.mx+'%',my:n.my+'%',glow:n.slug==='terrasite'?'#9ac7ff99':'#b5a4ff99',halo:n.planet==='ocean'?'#4da9af44':n.planet==='amber'?'#d8af7344':'#8782cf44',accent:n.planet==='ocean'?'#82c6be':n.planet==='amber'?'#d0b58a':'#b1a4de'}))button.style.setProperty('--'+k,v);
   const core=document.createElement('span');core.className='celestial-core';core.setAttribute('aria-hidden','true');
   if(n.kind==='current'){const cv=document.createElement('canvas');planet(cv,n.planet);core.append(cv);if(n.planet==='violet'){const ring=document.createElement('span');ring.className='planet-ring';core.append(ring);}const orbit=document.createElement('span');orbit.className='node-orbit';const satellite=document.createElement('span');satellite.className='planet-satellite';orbit.append(satellite);button.append(orbit);}
   button.append(core);const label=document.createElement('span');label.className='node-label';label.setAttribute('aria-hidden','true');const title=document.createElement('span');title.className='node-title';title.textContent=n.label;const note=document.createElement('span');note.className='node-kind';note.textContent=n.note||p.cat;label.append(title,note);button.append(label);map.append(button);
  }
  updateStatus();paint();
 }};
}
