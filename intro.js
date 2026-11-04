// Original implementation of the reference's multilingual greeting and curved reveal.
(() => {
 const root=document.documentElement, overlay=document.getElementById('hello-intro');
 if(!root.classList.contains('intro-pending')){overlay.hidden=true;return;}
 const shell=document.getElementById('site-shell'),word=document.getElementById('hello-word');
 const skip=document.getElementById('skip-intro'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 const greetings=[['Hello','en',700],['Bonjour','fr',190],['नमस्ते','hi',190],['Ciao','it',190],['Olá','pt',190],['こんにちは','ja',190],['Hallå','sv',190],['Guten tag','de',190],['Namaste','en',420]];
 let timer,exitTimer,index=0,finished=false,leaving=false;
 shell.inert=true;
 function finish(){
  if(finished)return;finished=true;
  clearTimeout(timer);clearTimeout(exitTimer);clearTimeout(window.introFailsafe);
  const restoreFocus=overlay.contains(document.activeElement);
  root.classList.remove('intro-pending');shell.inert=false;overlay.hidden=true;
  document.removeEventListener('keydown',onKey);motion.removeEventListener('change',onMotion);
  window.dispatchEvent(new Event('portfolio:intro-complete'));
  if(restoreFocus)document.querySelector('.wordmark').focus({preventScroll:true});
 }
 function leave(immediate=false){
  if(finished)return;
  if(immediate){finish();return;}
  if(leaving)return;leaving=true;clearTimeout(timer);
  overlay.classList.add('is-leaving');
  // Release the page only once the opaque sweep has cleared the viewport.
  exitTimer=setTimeout(finish,900);
 }
 function next(){
  if(index>=greetings.length){leave();return;}
  const [text,lang,duration]=greetings[index++];word.textContent=text;word.lang=lang;
  timer=setTimeout(next,duration);
 }
 function onKey(e){if(e.key==='Escape'){e.preventDefault();leave(true);}}
 function onMotion(){if(motion.matches)leave(true);}
 skip.addEventListener('click',()=>leave(true));
 document.addEventListener('keydown',onKey);motion.addEventListener('change',onMotion);
 next();
})();
