"""Validate the static paper-desk portfolio: local assets, script syntax, data constraints, and security headers."""
import json,re,subprocess
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse
root=Path(__file__).resolve().parents[1]
page=(root/'index.html').read_text()
projects=json.loads((root/'content.json').read_text())
slugs={p['slug'] for p in projects}
assert len(slugs)==len(projects)
class Page(HTMLParser):
 links=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  assert 'style' not in a,'Inline styles are blocked by the Content-Security-Policy'
  for key in ('src','href'):
   ref=a.get(key,'');u=urlparse(ref)
   if ref and not u.scheme and not u.netloc and u.path:assert (root/u.path).is_file(),ref
   if ref.startswith('#project/'):self.links.append(ref[9:])
Page().feed(page)
for ref in re.findall(r'url\([\'\"]?([^\'\")]+)',(root/'desk.css').read_text()):assert (root/ref).is_file(),ref
for name in ['desk.js','hello.js']:subprocess.run(['node','--check',str(root/name)],check=True)
assert (root/'assets/Isaiah-Hawkins-Resume.pdf').read_bytes().startswith(b'%PDF')
# Every note on the desk opens a real entry, and the featured list in desk.js matches the notes.
assert Page.links and set(Page.links)<=slugs,set(Page.links)-slugs
featured=re.search(r"featured=\[([^\]]*)\]",(root/'desk.js').read_text()).group(1).replace("'",'').split(',')
assert set(featured)<=slugs and set(featured)<=set(Page.links)
quant=next(x for x in projects if x['slug']=='quant')
assert quant['title']==quant['card']=='Quantitative Analyst Intern' and quant['cat']=='Internships'
assert 'not a diagnostic' in json.dumps(next(p for p in projects if p['slug']=='visible'))
assert next(p for p in projects if p['slug']=='protein-function-predictor')['status']=='In development'
assert 'watersight' not in slugs
for p in projects:
 for f in p.get('images',[])+[f for s in p.get('sections',[]) for f in s.get('images',[])]:assert (root/f['src']).is_file() and f['alt'] and f['caption'],f
print('PASS: local assets, script syntax, desk links, and project facts.')
# The Content-Security-Policy allows no inline script or style; everything loads from this origin.
csp=next(h['value'] for r in json.loads((root/'vercel.json').read_text())['headers'] for h in r['headers'] if h['key']=='Content-Security-Policy')
assert not re.findall(r'<script>(.*?)</script>',page,re.S) and '<style' not in page
assert "'unsafe-inline'" not in csp and "'unsafe-eval'" not in csp
assert 'http' not in re.sub(r'https://(www\.iisaiah\.com|github\.com/isaiah7162|www\.linkedin\.com)[^"]*','',page),'Unexpected external reference'
for name in ['.env','.env.*']:assert name in (root/'.vercelignore').read_text().split() and name in (root/'.gitignore').read_text().split()
print('PASS: security headers allow no inline code, and env files are excluded from git and deploys.')
