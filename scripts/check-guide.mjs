import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {answerQuestion} from '../guide.js';
const projects=JSON.parse(readFileSync('content.json'));const profile=JSON.parse(readFileSync('profile.json'));
const ask=(q,c={})=>answerQuestion(q,projects,profile,c);
assert.deepEqual(ask('What are you working on now?').context.slugs,['quant','protein-function-predictor','visible']);
assert.match(ask('What did Isaiah build at Disney?').text,/Automated evaluation pipelines/);
assert.match(ask('Tell me about Visible').text,/prototype|wellness/);
assert.match(ask('What is your role at SC Capital?').text,/Quantitative Analyst Intern/);
assert.match(ask('What results did the protein project get?').text,/hypotheses|planned|in development/i);
assert.match(ask('What skills do you have?').text,/Python/);
assert.match(ask('Where do you go to school?').text,/2027/);
assert.match(ask('What is your salary at Disney?').text,/isn’t included/);
assert.match(ask('What is the weather in Houston?').text,/isn’t included/);
assert.match(ask('What tools did you use?',ask('Tell me about Disney').context).text,/Evaluating AI at Disney/);
assert.equal(ask('Compare Disney and Visible').sources.length,2);
assert.equal(ask('How can I contact you?').sources.length,4);
assert.match(ask('<img src=x onerror=alert(1)>').text,/isn’t included/);
for(const q of ['Python','research','current work','education','leadership','hackathons','AI evaluation']){
 const r=ask(q);assert.ok(r.text.length);for(const s of r.sources)if(s.slug)assert.ok(projects.some(p=>p.slug===s.slug));
}
console.log('PASS: chatbot facts, follow-ups, sources, comparisons, unknowns, and contact links.');

assert.ok(!projects.some(p=>p.slug==='watersight'));
assert.match(projects.find(p=>p.slug==='terrasite').sections.at(-1).h,/Preliminary idea.*WaterSight/);
assert.match(ask('Tell me about WaterSight').text,/preliminary concept/);
assert.equal(ask('Tell me about WaterSight').sources[0].slug,'terrasite');

// Regressions from the Nov 2026 audit: whole-word aliases, a narrow privacy filter, every entry reachable, kept context.
const slugsOf=r=>r.sources.filter(s=>s.slug).map(s=>s.slug);
assert.equal(ask('What is his email address?').sources.length,4);
assert.equal(ask('Can I see his résumé?').sources.length,4);
assert.match(ask('What is his home address?').text,/isn’t included/);
assert.match(ask('Does he have a diagnosis?').text,/isn’t included/);
assert.ok(!slugsOf(ask('Did you do any marketing?')).includes('quant'));
assert.ok(!slugsOf(ask('Any chemistry or aesthetics work?')).includes('protein-function-predictor'));
for(const [q,slug] of [['Tell me about Vital Handoff','vital'],['Where was he a lifeguard?','americanpool'],['Tell me about Bahama Buck’s','bahamabucks'],['What is LSAMP?','pruning'],['Tell me about the Summer House Institute','summerhouse'],['What is TACC?','tacc'],['Tell me about Slingo','slingo'],['Tell me about the cookbook blog','cookbook'],['Tell me about FinSight','finsight'],['Tell me about the Vista hackathon','vista'],['Tell me about his hackathon record','hackathons'],['Tell me about On Record','onrecord'],['Tell me about On Record research','onrecord-research']])
 assert.deepEqual(slugsOf(ask(q)),[slug],q);
for(const p of projects)assert.ok(slugsOf(ask('Tell me about '+p.title)).includes(p.slug==='watersight'?'terrasite':p.slug),p.title);
const disney=ask('Tell me about Disney').context, afterUnknown=ask('What is his salary?',disney);
assert.deepEqual(afterUnknown.context.slugs,['jarvis']);
assert.match(ask('What tools did you use?',afterUnknown.context).text,/Evaluating AI at Disney/);
console.log('PASS: whole-word matching, privacy filter scope, every entry reachable, and context kept after an unknown answer.');
