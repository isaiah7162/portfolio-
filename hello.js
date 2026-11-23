// Hello: sticky notes cover the desk, then peel away. Loaded in <head> so the
// greeting is on screen before first paint. Shown once per browser session,
// never on a deep link, and never when reduced motion is requested.
(function(){
 var root=document.documentElement,timers=[],returnFocus=null;
 var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,seen=false;
 try{seen=sessionStorage.getItem('hello-seen')==='1';}catch(e){}
 if(!reduce&&!location.hash&&!seen)root.classList.add('hello-on');
 function shell(){return document.getElementById('site-shell');}
 function done(){
  timers.forEach(clearTimeout);timers=[];
  root.classList.remove('hello-on','hello-peel');
  if(shell())shell().inert=false;
  try{sessionStorage.setItem('hello-seen','1');}catch(e){}
  if(returnFocus&&returnFocus.isConnected)returnFocus.focus({preventScroll:true});
  returnFocus=null;
 }
 function run(){
  timers.forEach(clearTimeout);
  if(shell())shell().inert=true;
  timers=[setTimeout(function(){root.classList.add('hello-peel');},2500),setTimeout(done,3550)];
 }
 document.addEventListener('DOMContentLoaded',function(){
  var skip=document.getElementById('skip-hello'),replay=document.getElementById('replay-hello');
  if(skip)skip.addEventListener('click',done);
  if(replay)replay.addEventListener('click',function(){
   returnFocus=replay;root.classList.remove('hello-peel');root.classList.add('hello-on');run();
   if(skip)skip.focus({preventScroll:true});
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&root.classList.contains('hello-on'))done();});
  if(root.classList.contains('hello-on'))run();
 });
 // Fail-safe: the greeting can never block the page.
 setTimeout(function(){if(root.classList.contains('hello-on')&&!timers.length)done();},7000);
})();
