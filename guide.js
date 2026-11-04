// Grounded, browser-local portfolio retrieval. No model, network chat API, or chat storage.
const stop = new Set('a an the is are was were be been being i me my you your yours he him his she they them their it its this that these those what which who how why when where can could would should do does did have has had about tell more please want know give show explain with and or of for at in on to from as by work project projects experience isaiah hawkins'.split(' '));
export const words = text => (String(text).toLowerCase().match(/[a-z0-9+#]+/g)||[]).filter(x=>!stop.has(x));
const normalize = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const aliases = {jarvis:['disney','jarvis','imagineering'],quant:['quant','quantitative','sc capital','trading','market'],visible:['visible','health app','wellness'], 'protein-function-predictor':['protein','proteam','esm','deepgoplus','cafa'],terrasite:['terrasite','watersight','water sight','environment']};
const link = p => ({label:p.title,slug:p.slug});
const summary = p => `${p.title} — ${p.org} (${p.when}).\n${p.lede || p.blurb}`;
const details = p => p.sections.flatMap(s=>s.paras||[]);
export function answerQuestion(question, projects, profile, context={}) {
 const q=normalize(question), tokens=words(question);
 const answer=(text,sources=[],slugs=[])=>({text,sources,context:{slugs}});
 const unknown=()=>answer('That detail isn’t included in Isaiah’s published portfolio. You can ask about a listed project, his experience, or his skills—or contact him directly for more information.',[{label:'Email Isaiah',href:'mailto:Ihawkins5@pvamu.edu'}]);
 if(!q)return unknown();
 if(/^(hi|hello|hey|thanks|thank you)$/.test(q))return answer('Hi! Ask me about Isaiah’s work at Disney, his current projects, research, or technical skills.');
 if(/\b(salary|compensation|phone|address|birthday|married|girlfriend|medical|diagnos|password|secret|ignore|instructions|system prompt|weather)\b/.test(q))return unknown();
 if(/\b(contact|email|reach|linkedin|github|resume|cv)\b/.test(q) && !/\b(built|project|code|used)\b/.test(q))return answer('You can contact Isaiah by email, connect on LinkedIn, explore his GitHub, or read the full résumé.',[{label:'Email Isaiah',href:'mailto:Ihawkins5@pvamu.edu'},{label:'LinkedIn',href:'https://www.linkedin.com/in/isaiah-hawkins-414853249/'},{label:'GitHub',href:'https://github.com/isaiah7162'},{label:'Résumé',href:'assets/Isaiah-Hawkins-Resume.pdf'}]);
 if(/\b(current|currently|now|working on|ongoing)\b/.test(q) && !Object.values(aliases).flat().some(x=>q.includes(x))){const current=projects.filter(p=>p.current);return answer('Isaiah’s current work includes:\n\n'+current.map(summary).join('\n\n'),current.map(link),current.map(p=>p.slug));}
 if(/\b(who|introduce|bio|background|yourself|your story)\b/.test(q) && !tokens.some(t=>Object.values(aliases).flat().includes(t)))return answer('Isaiah Hawkins is a Computer Science student at Prairie View A&M University, graduating in May 2027. His portfolio spans software development, AI evaluation, and applied research. He has worked at Walt Disney Imagineering and is a Quantitative Analyst Intern at SC Capital. He is also the Founder · Builder of Visible, an independent hackathon project.',[{label:'About Isaiah',href:'#about'},...projects.filter(p=>['jarvis','quant','visible'].includes(p.slug)).map(link)]);
 if(/\b(school|university|graduate|graduation|degree|education|major|gpa|coursework|academics)\b/.test(q) && !/\b(protein|lsamp)\b/.test(q))return answer(profile.degree.map(x=>`${x.k}: ${x.v}`).join('\n')+'\n\nSelected coursework: '+profile.coursework.slice(0,8).join(', ')+'.',[{label:'Academics',filter:'Academics'}]);
 if(/\b(leadership|organizations|clubs|volunteer|community)\b/.test(q))return answer('Isaiah’s listed involvement includes:\n\n'+profile.orgs.map(x=>`${x.k} — ${x.v}`).join('\n'),[{label:'Leadership',filter:'Leadership'}]);
 if(/\b(awards|competitions|won|winning|hackathons)\b/.test(q))return answer(profile.awards.map(x=>`${x.k}: ${x.v} (${x.m})`).join('\n\n'),[{label:'Awards & academics',filter:'Academics'}]);
 const explicit=projects.filter(p=>(aliases[p.slug]||[p.slug.replaceAll('-',' ')]).some(a=>q.includes(a)) || (q.includes(normalize(p.title)) && normalize(p.title).length>5));
 if(/\b(skills|languages|stack|technologies|tools)\b/.test(q) && !explicit.length && (!context.slugs?.length || /\b(skills|languages|in general)\b/.test(q)) && !/\b(it|that|this|those)\b/.test(q))return answer('Isaiah’s listed skills include:\n\n'+profile.skills.slice(0,6).map(g=>`${g.k}: ${g.items.map(x=>x.n).join(', ')}`).join('\n\n'),[{label:'Full skills list',filter:'Skills'}]);
 if(/\b(internships|internship|professional experience)\b/.test(q) && !explicit.length){const ps=projects.filter(p=>p.cat==='Internships');return answer(ps.map(summary).join('\n\n'),ps.map(link),ps.map(p=>p.slug));}
 if(/\b(research)\b/.test(q) && !explicit.length && tokens.length<3){const ps=projects.filter(p=>p.cat==='Research'||p.also==='Research');return answer(ps.map(summary).join('\n\n'),ps.map(link),ps.map(p=>p.slug));}
 let candidates=explicit;
 if(!candidates.length && /\b(it|that|this|those|more|tools|results|contribution|role)\b/.test(q) && context.slugs?.length)candidates=projects.filter(p=>context.slugs.includes(p.slug));
 if(candidates.length){
   if(candidates.length>1)return answer(candidates.slice(0,3).map(summary).join('\n\n'),candidates.slice(0,3).map(link),candidates.slice(0,3).map(p=>p.slug));
   const p=candidates[0];
   if(/\b(watersight|water sight|preliminary|original idea)\b/.test(q) && p.slug==='terrasite'){
    const origin=p.sections.find(s=>s.h.includes('WaterSight'));
    return answer(origin.h+'\n\n'+origin.paras.join('\n\n'),[link(p)],[p.slug]);
   }
   if(/\b(stack|tools|technologies|languages|skills)\b/.test(q))return answer(`${p.title}\n\nListed technologies and focus areas: ${p.tags.join(', ')}.\n\n${p.lede}`, [link(p)],[p.slug]);
   const sections=p.sections.map(s=>({s,score:words(s.h+' '+(s.paras||[]).join(' ')).filter(w=>tokens.includes(w)).length})).sort((a,b)=>b.score-a.score);
   const focus=/\b(result|results|accuracy|evaluation|evaluate|performance|status|stage|planned)\b/.test(q)?p.sections.filter(s=>/evaluation|stage|planned|result/i.test(s.h)):[];
   const chosen=focus.length?focus:sections[0]?.score>0?sections.filter(s=>s.score>0).slice(0,2).map(x=>x.s):p.sections.slice(0,2);
   const text=chosen.map(s=>`${s.h}: ${(s.paras||[]).join(' ')}${s.rows?.length?' '+s.rows.slice(0,3).map(r=>r.k+': '+r.v).join('; '):''}`).join('\n\n');
   return answer(`${p.title} — ${p.org}\n\n${text || p.lede}`,[link(p)],[p.slug]);
 }
 if(!tokens.length)return unknown();
 // Score matching facts, weighting project names and technologies above long prose.
 const ranked=projects.map(p=>{
  const head=words([p.title,p.org,...p.tags].join(' '));
  const body=words([p.lede,...details(p)].join(' '));
  const matched=tokens.filter(t=>head.includes(t)||body.includes(t));
  return {p,score:tokens.reduce((n,t)=>n+(head.includes(t)?5:body.includes(t)?1:0),0),coverage:matched.length/tokens.length};
 }).filter(x=>x.score>=3&&x.coverage>=.5).sort((a,b)=>b.score-a.score).slice(0,3);
 if(!ranked.length)return unknown();
 return answer('These portfolio entries are relevant to your question:\n\n'+ranked.map(({p})=>summary(p)).join('\n\n'),ranked.map(({p})=>link(p)),ranked.map(({p})=>p.slug));
}
