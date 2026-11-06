import assert from 'node:assert/strict';
import {createProjectView} from '../project-view.js';

// DOM-contract checks for navigation and focus; visual layout still needs browser review.
class Element extends EventTarget {
 constructor(){super();this.children=[];this.dataset={};this.open=false;this.isConnected=true;this.scrollTop=0;this.attributes={};this.tokens=new Set();this.classList={add:(...v)=>v.forEach(x=>this.tokens.add(x)),remove:(...v)=>v.forEach(x=>this.tokens.delete(x)),contains:v=>this.tokens.has(v)};this.style={setProperty(){}};}
 append(...children){this.children.push(...children);}
 replaceChildren(...children){this.children=children;}
 setAttribute(k,v){this.attributes[k]=v;}
 getBoundingClientRect(){return {left:200,top:200,bottom:250,width:50,height:50};}
 focus(options){document.activeElement=this;this.focusOptions=options;}
 animate(){return {cancel(){}};}
 showModal(){this.open=true;}
 close(){this.open=false;this.dispatchEvent(new Event('close'));}
 querySelector(selector){return this.elements[selector];}
 getContext(){return {createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){}};}
}
const media=new EventTarget();media.matches=false;
globalThis.matchMedia=()=>media;
globalThis.innerHeight=900;
globalThis.window=new EventTarget();
globalThis.document={body:new Element(),activeElement:null,createElement:()=>new Element()};
globalThis.location={hash:'#home'};
globalThis.history={replaceState:(_state,_unused,hash)=>location.hash=hash};
const dialog=new Element();dialog.elements=Object.fromEntries(['.project-scene','#close-case','#destination-index','#previous-project','#next-project','.project-reader','#case-content','#case-title'].map(key=>[key,new Element()]));
const origin=new Element();origin.focus();
const events=[];window.addEventListener('portfolio:project-state',e=>events.push(e.detail.open));
const view=createProjectView(dialog);
view.open('jarvis',origin);
assert(dialog.open);assert.equal(location.hash,'#project/jarvis');
assert(document.body.classList.contains('project-open'));
assert.equal(document.activeElement,dialog.elements['#case-title']);
assert.equal(dialog.elements['#next-project'].dataset.project,'terrasite');
assert.equal(dialog.elements['#previous-project'].dataset.project,'bahamabucks');
view.open('quant',dialog.elements['#next-project']);
assert.equal(dialog.elements['.project-scene'].dataset.kind,'current');
assert.equal(location.hash,'#project/quant');
view.close({immediate:true});
assert(!dialog.open);assert.equal(location.hash,'#home');
assert.equal(document.activeElement,origin);assert(origin.focusOptions.preventScroll);
assert.deepEqual(events,[true,false]);

// Escape uses the same graceful exit and restores the source instead of jumping to Work.
location.hash='#current';view.open('visible',origin);
const escape=new Event('cancel',{cancelable:true});dialog.dispatchEvent(escape);
assert(escape.defaultPrevented);assert(dialog.classList.contains('is-departing'));
await new Promise(resolve=>setTimeout(resolve,350));
assert(!dialog.open);assert.equal(location.hash,'#current');

// Opening another destination during exit must cancel the old close callback.
view.open('terrasite',origin);view.close();view.open('pruning',origin);
await new Promise(resolve=>setTimeout(resolve,350));
assert(dialog.open);assert.equal(location.hash,'#project/pruning');
view.close({immediate:true});

// Reduced motion and user pause bypass animated exits, including deep links.
media.matches=true;location.hash='#project/quant';view.open('quant',origin);view.close();
assert(!dialog.open);assert.equal(location.hash,'#home');
media.matches=false;document.body.classList.add('space-user-paused');
view.open('visible',origin);view.close();assert(!dialog.open);
document.body.classList.remove('space-user-paused');

// Back/forward navigation can close without overwriting the new hash or stealing focus.
view.open('jarvis',origin);location.hash='#about';const focusBefore=document.activeElement;
view.close({immediate:true,focus:false,history:false});
assert.equal(location.hash,'#about');assert.equal(document.activeElement,focusBefore);
assert(!document.body.classList.contains('project-open'));
console.log('PASS: destination navigation, focus restoration, Escape, rapid switching, reduced motion, pause, and history.');
