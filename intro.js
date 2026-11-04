// Greeting letters are sampled into particles, then expand into the starfield.
(() => {
 const root=document.documentElement,overlay=document.getElementById('hello-intro'),shell=document.getElementById('site-shell');
 const word=document.getElementById('hello-word'),greeting=overlay.querySelector('.hello-greeting'),skip=document.getElementById('skip-intro');
 const canvas=document.getElementById('intro-stars'),ctx=canvas.getContext('2d'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 const greetings=[['Hello','en',650],['Bonjour','fr',160],['नमस्ते','hi',160],['Ciao','it',160],['Olá','pt',160],['こんにちは','ja',160],['Hallå','sv',160],['Hello','en',450]];
 let timer,exitTimer,raf=0,index=0,finished=true,particles=[],started=0,w=0,h=0;
 function finish(){
  if(finished)return;finished=true;clearTimeout(timer);clearTimeout(exitTimer);clearTimeout(window.introFailsafe);cancelAnimationFrame(raf);
  const restoreFocus=overlay.contains(document.activeElement);root.classList.remove('intro-pending');shell.inert=false;overlay.hidden=true;
  window.dispatchEvent(new Event('portfolio:intro-complete'));
  if(restoreFocus)document.querySelector('.wordmark').focus({preventScroll:true});
 }
 function draw(now){
  if(finished)return;if(!started)started=now;const elapsed=now-started,p=Math.min(1,elapsed/2100),ease=1-Math.pow(1-p,3);
  ctx.clearRect(0,0,w,h);
  for(const s of particles){const x=s.x+(s.tx-s.x)*ease,y=s.y+(s.ty-s.y)*ease;const a=(1-p*.46)*(.6+.4*Math.sin(s.phase+now*.001));const r=s.r*(1-p*.38);ctx.fillStyle=`rgba(${s.color},${a})`;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();if(s.glow){ctx.fillStyle=`rgba(145,170,255,${a*.09})`;ctx.beginPath();ctx.arc(x,y,r*5,0,Math.PI*2);ctx.fill();}}
  if(elapsed>1450)overlay.classList.add('is-fading');
  if(p<1)raf=requestAnimationFrame(draw);else finish();
 }
 function disperse(){
  if(!ctx){finish();return;}
  w=innerWidth;h=innerHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  const mask=document.createElement('canvas');mask.width=w;mask.height=h;const m=mask.getContext('2d'),r=word.getBoundingClientRect(),style=getComputedStyle(word);
  m.fillStyle='white';m.font=style.font;m.textBaseline='middle';m.fillText('Hello',r.left,r.top+r.height*.5);
  const dot=overlay.querySelector('.hello-dot').getBoundingClientRect();m.beginPath();m.arc(dot.left+dot.width/2,dot.top+dot.height/2,dot.width/2,0,Math.PI*2);m.fill();
  const pixels=m.getImageData(0,0,w,h).data;particles=[];const step=w<600?2:3;
  for(let y=Math.floor(r.top-8);y<r.bottom+8;y+=step)for(let x=Math.floor(dot.left-5);x<r.right+5;x+=step){if(x<0||y<0||x>=w||y>=h)continue;if(pixels[(y*w+x)*4+3]>100){const a=Math.random()*Math.PI*2,dist=Math.random()**.55;particles.push({x,y,tx:w/2+Math.cos(a)*w*.75*dist,ty:h/2+Math.sin(a)*h*.75*dist,r:.5+Math.random()*.95,phase:Math.random()*6.28,color:Math.random()>.7?'163,179,255':'228,235,255',glow:Math.random()>.92});}}
  overlay.classList.add('is-dispersing');started=0;raf=requestAnimationFrame(draw);
 }
 function next(){if(finished)return;if(index>=greetings.length){disperse();return;}const [text,lang,duration]=greetings[index++];word.textContent=text;word.lang=lang;timer=setTimeout(next,duration);}
 function start(){
  clearTimeout(timer);clearTimeout(exitTimer);cancelAnimationFrame(raf);clearTimeout(window.introFailsafe);
  if(motion.matches){root.classList.remove('intro-pending');shell.inert=false;overlay.hidden=true;window.dispatchEvent(new Event('portfolio:intro-complete'));return;}
  window.scrollTo({top:0,behavior:'instant'});finished=false;index=0;root.classList.add('intro-pending');overlay.hidden=false;overlay.classList.remove('is-dispersing','is-fading','is-leaving');ctx?.clearRect(0,0,canvas.width,canvas.height);shell.inert=true;
  window.dispatchEvent(new Event('portfolio:intro-start'));window.introFailsafe=setTimeout(finish,7000);next();
 }
 skip.addEventListener('click',finish);document.addEventListener('keydown',e=>{if(!finished&&e.key==='Escape'){e.preventDefault();finish();}});
 motion.addEventListener('change',()=>{if(motion.matches)finish();});window.addEventListener('resize',()=>{if(!finished&&overlay.classList.contains('is-dispersing'))finish();});
 window.addEventListener('portfolio:replay-intro',start);
 if(root.classList.contains('intro-pending'))start();else overlay.hidden=true;
})();
