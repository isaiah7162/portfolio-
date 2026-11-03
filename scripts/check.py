import json
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse, parse_qs
root = Path(__file__).resolve().parents[1]
projects = json.loads((root/'content.json').read_text())
slugs = [p['slug'] for p in projects]
assert len(slugs) == len(set(slugs)), 'Duplicate project slugs'
class Links(HTMLParser):
    def __init__(self): super().__init__(); self.refs=[]; self.ids=set()
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if 'id' in attrs: self.ids.add(attrs['id'])
        for key in ('href','src'):
            if key in attrs: self.refs.append(attrs[key])
page=Links();page.feed((root/'index.html').read_text())
cards=[]
for ref in page.refs:
    url=urlparse(ref)
    if url.scheme or url.netloc: continue
    if url.path and url.path != './': assert (root/url.path).exists(), f'Missing file: {ref}'
    if url.fragment: assert url.fragment in page.ids, f'Missing anchor: {ref}'
    if 'project' in parse_qs(url.query): cards.append(parse_qs(url.query)['project'][0])
assert sorted(cards)==sorted(slugs), 'Cards and projects differ'
for p in projects:
    assert all(p.get(k) for k in ('slug','title','lede','sections','tags'))
assert (root/'assets/Isaiah-Hawkins-Resume.pdf').read_bytes().startswith(b'%PDF')
print(f'PASS: {len(projects)} projects, all local links and anchors, and résumé PDF.')
