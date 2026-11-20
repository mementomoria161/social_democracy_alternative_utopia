"""Freely licensed images from Wikimedia Commons: download a thumbnail and append the credit to credits_images.txt.

Usage: python -I tools/commons_images.py jobs.json [--width 960]
jobs.json: {"img/datei.jpg": ["Suchbegriff", "=File:Exakter Dateiname.jpg", "person:Vorname Nachname"], ...}
Paths are relative to out/html/. Each job tries its queries in order and takes the first image whose
license is CC0, public domain, CC BY or CC BY-SA (no NC/ND, no fair use). Existing files are skipped.
"person:" looks up the Wikidata image (P18) of that person first. Portraits: use img/portraits/Name.jpg, --width 480.
"""
import json, os, re, sys, time, urllib.parse, urllib.request

UA = {'User-Agent': 'SozialdemokratieGame/1.0 (image credits script)'}
REPO = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
HTML = os.path.join(REPO, 'out', 'html')
CREDITS = os.path.join(REPO, 'credits_images.txt')
OK = re.compile(r'^(CC BY(-SA)?( [0-9.]+)?( [a-z]{2})?|CC0( 1\.0)?|Public domain|PD[- ].*|PD)$', re.I)
WIDTH = int(sys.argv[sys.argv.index('--width') + 1]) if '--width' in sys.argv else 960


def api(base, params):
    url = base + '?' + urllib.parse.urlencode({**params, 'format': 'json'})
    err = None
    for i in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
                return json.load(r)
        except Exception as e:
            err = e
            time.sleep(10 * (i + 1))
    raise err


def strip(h):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', h or '')).strip()


def info(title):
    d = api('https://commons.wikimedia.org/w/api.php', {'action': 'query', 'titles': title, 'prop': 'imageinfo',
            'iiprop': 'url|extmetadata|size|mime', 'iiurlwidth': WIDTH})
    pg = next(iter(d['query']['pages'].values()))
    if 'imageinfo' not in pg:
        return None
    ii = pg['imageinfo'][0]
    m = ii.get('extmetadata', {})
    lic = strip(m.get('LicenseShortName', {}).get('value'))
    if not OK.match(lic) or ii.get('mime') not in ('image/jpeg', 'image/png') or ii.get('width', 0) < 400:
        return None
    return {'title': pg['title'], 'thumb': ii.get('thumburl') or ii['url'], 'page': ii['descriptionurl'],
            'license': lic, 'license_url': strip(m.get('LicenseUrl', {}).get('value')),
            'artist': strip(m.get('Artist', {}).get('value')) or 'unbekannt'}


def person_file(name):
    d = api('https://www.wikidata.org/w/api.php', {'action': 'wbsearchentities', 'search': name, 'language': 'de', 'limit': 3})
    for e in d.get('search', []):
        c = api('https://www.wikidata.org/w/api.php', {'action': 'wbgetclaims', 'entity': e['id'], 'property': 'P18'})
        for cl in c.get('claims', {}).get('P18', []):
            return 'File:' + cl['mainsnak']['datavalue']['value']
    return None


def search(q):
    d = api('https://commons.wikimedia.org/w/api.php', {'action': 'query', 'list': 'search', 'srnamespace': 6,
            'srsearch': q + ' filetype:bitmap', 'srlimit': 15})
    return [r['title'] for r in d['query']['search']]


def candidates(q):
    if q.startswith('='):
        return [q[1:]]
    if q.startswith('person:'):
        t = person_file(q[7:])
        return ([t] if t else []) + search(q[7:])
    return search(q)


def fetch(url, path):
    for i in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
                data = r.read()
            break
        except Exception:
            if i == 3:
                raise
            time.sleep(15 * (i + 1))
    assert data[:3] == b'\xff\xd8\xff' or data[:8] == b'\x89PNG\r\n\x1a\n', 'not an image'
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, 'wb').write(data)


def main():
    jobs = json.load(open(sys.argv[1], encoding='utf-8'))
    for fn, queries in jobs.items():
        path = os.path.join(HTML, fn)
        if os.path.exists(path):
            print('exists', fn)
            continue
        rec = None
        try:
            for q in queries:
                for t in candidates(q):
                    rec = info(t)
                    if rec:
                        break
                if rec:
                    break
            if not rec:
                print('MISS', fn)
                continue
            fetch(rec['thumb'], path)
            name = fn[4:] if fn.startswith('img/') else fn
            line = '%s: %s. „%s“. Wikimedia Commons, %s. Lizenz: %s %s' % (
                name, rec['artist'], rec['title'][5:], rec['page'], rec['license'], rec['license_url'])
            with open(CREDITS, 'a', encoding='utf-8') as f:
                f.write('\n' + line.strip() + '\n')
            print('ok', fn, rec['title'], rec['license'])
        except Exception as e:
            print('ERR', fn, e)
        time.sleep(3)


if __name__ == '__main__':
    main()
