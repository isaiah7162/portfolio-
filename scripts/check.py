import json,re,subprocess,tempfile
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse
root=Path(__file__).resolve().parents[1]
page=(root/'index.html').read_text()
projects=json.loads((root/'content.json').read_text())
assert len({p['slug'] for p in projects})==len(projects)
assert 'cdn.simpleicons.org' not in page and 'it.hasIcon' not in page
assert 'const TABS = ["Current", "Internships", "Research", "Projects", "Academics", "Skills", "Leadership"]' in page
class Assets(HTMLParser):
 def handle_starttag(self, tag, attrs):
  a=dict(attrs)
  for key in ('src','href'):
   ref=a.get(key,'');u=urlparse(ref)
   if ref and not u.scheme and not u.netloc and u.path:assert (root/u.path).is_file(),ref
Assets().feed(page)
script=re.search(r'<script type="text/x-dc"[^>]*>(.*?)</script>',page,re.S)[1]
with tempfile.NamedTemporaryFile(suffix='.js',mode='w') as f:
 f.write(script);f.flush();subprocess.run(['node','--check',f.name],check=True)
# Exercise the recovered renderer's real tab selection and card data.
harness='const React={createRef:()=>({current:null})}; class DCLogic {}\n'+script+'''\nconst c=new Component(); c.props={}; for(const tab of TABS){c.state.tab=tab;const v=c.renderVals();if(v.showCards && !v.projects.length)throw Error("Empty tab "+tab);if(v.projects.some(p=>!p.title))throw Error("Missing title");console.log(tab+": "+v.tabCount);}'''
subprocess.run(['node','-e',harness],check=True)
assert (root/'assets/Isaiah-Hawkins-Resume.pdf').read_bytes().startswith(b'%PDF')
inline=json.loads(re.search(r'const PROJECTS = (.*?);\nconst SKIES',page,re.S)[1])
assert inline==projects, 'Inline data and content.json disagree'
quant=next(x for x in projects if x['slug']=='quant')
assert quant['title']==quant['card']=='Quant Analyst' and quant['cat']=='Internships'
assert {x['slug'] for x in projects if x.get('current')}=={'quant','visible','protein-function-predictor'}
print('PASS: assets, icon removal, syntax, tabs, Quant Analyst, Current membership, and synced project data.')
