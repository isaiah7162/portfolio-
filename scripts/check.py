"""Validate the static portfolio, data constraints, and chatbot answers."""
import json,re,subprocess
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse
root=Path(__file__).resolve().parents[1]
page=(root/'index.html').read_text()
projects=json.loads((root/'content.json').read_text())
assert len({p['slug'] for p in projects})==len(projects)
class Assets(HTMLParser):
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  for key in ('src','href'):
   ref=a.get(key,'');u=urlparse(ref)
   if ref and not u.scheme and not u.netloc and u.path:assert (root/u.path).is_file(),ref
Assets().feed(page)
for ref in re.findall(r'url\([\'\"]?([^\'\")]+)',(root/'style.css').read_text()):assert (root/ref).is_file(),ref
for name in ['app.js','guide.js','lake.js','intro.js']:subprocess.run(['node','--check',str(root/name)],check=True)
assert (root/'assets/Isaiah-Hawkins-Resume.pdf').read_bytes().startswith(b'%PDF')
quant=next(x for x in projects if x['slug']=='quant')
assert quant['title']==quant['card']=='Quantitative Analyst Intern' and quant['cat']=='Internships'
assert {x['slug'] for x in projects if x.get('current')}=={'quant','visible','protein-function-predictor'}
assert 'independent hackathon' in next(p for p in projects if p['slug']=='visible')['lede']
assert 'x-dc' not in page and 'rotateY' not in page
subprocess.run(['node',str(root/'scripts/check-guide.mjs')],check=True,cwd=root)
print('PASS: local assets, module syntax, project facts, current membership, and chatbot behavior.')
