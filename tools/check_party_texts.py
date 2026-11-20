"""Lists party-specific terms in scene texts that are reachable in the game of one playable party.

Usage: python -I tools/check_party_texts.py [linke|spd] [-v]
  linke (default): texts reachable with player = "linke" that name the SPD, Seeheimer, Jusos ...
  spd:             texts reachable with player = "spd" that name Linke-internal things (Karl-Liebknecht-Haus ...)
  -v:              also list hits in explicit party context (sections/conditions with player = "<mode>")

Reachability (approximate, per file): the top scene and subscenes referenced from other files are entry points;
options (- @id) and go-to targets are followed. A section is excluded if its view-if/choose-if requires the other
party; a scene left by "go-to: x if player = <mode>" still shows its text (the engine displays it before the
go-to), but not its options. [? if player = "<other>" : ... ?] is removed,
[+ ... +] inserts are ignored. A comment line "# party-ok: SPD, Jusos" inside a section (in the top section: whole file) marks
these terms as reviewed there (e.g. the SPD as the other party in a shared text); "# party: spd" marks a section that is only
reachable in that party's game although no condition says so (e.g. SPD advisors, root.choose_spd). Exit code 1 if unreviewed hits remain.
"""
import os, re, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'source', 'scenes')
TERMS = {
    'linke': [r'SPD', r'Seeheim\w*', r'Juso\w*', r'Willy-Brandt-Haus', r'[Ss]ozialdemokrat\w*', r'Volkspartei\w*',
              r'Dänische[nr]? Kurs', r'Ortsvereinw*', r'Linkspartei', r'\b[Dd]er Linken\b', r'\b[Dd]ie Linke\b(?![\w*-])'],
    'spd': [r'Karl-Liebknecht-Haus', r'Linksjugend', r'Bewegungslinke', r'Friedensflügel', r'Linksfraktion',
            r'Sozialistische Linke'],
}
mode = 'spd' if 'spd' in sys.argv[1:] else 'linke'
other = 'spd' if mode == 'linke' else 'linke'
verbose = '-v' in sys.argv
OTHER_RE = re.compile(r'player\s*==?\s*"%s"' % other)
MODE_RE = re.compile(r'player\s*==?\s*"%s"' % mode)
COND_RE = re.compile(r'\[\?\s*if\s+(.*?)\s*:(.*?)\?\]', re.S)


def parse(path):
    """Returns sections [(id, headers{key: [values]}, body_lines[(lineno, text)], comments[])]."""
    secs, cur, in_head, in_js = [], None, True, False
    cur = ['', {}, [], []]; secs.append(cur)
    for n, line in enumerate(open(path, encoding='utf-8'), 1):
        line = line.rstrip('\n')
        if in_js:
            in_js = '!}' not in line
            continue
        m = re.match(r'^@([\w.]+)\s*$', line)
        if m:
            cur = [m.group(1), {}, [], []]; secs.append(cur); in_head = True; continue
        if line.startswith('#'):
            cur[3].append(line); continue
        if in_head:
            if not line.strip():
                in_head = False; continue
            m = re.match(r'^([a-z-]+):\s*(.*)$', line)
            if m:
                key, val = m.group(1), m.group(2)
                if '{!' in val and '!}' not in val:
                    in_js = True
                cur[1].setdefault(key, []).append(val)
                if key in ('title', 'subtitle', 'unavailable-subtitle'):
                    cur[2].append((n, val))
                continue
            in_head = False
        if '{!' in line and '!}' not in line.split('{!', 1)[1]:
            in_js = True; continue
        cur[2].append((n, line))
    return secs


def strip_text(text):
    text = re.sub(r'\[\+.*?\+\]', '', text)
    text = re.sub(r'\{!.*?!\}', '', text)
    def cond(m):
        if requires(m.group(1), other):
            return ''
        return ('\x01' if MODE_RE.search(m.group(1)) else '') + m.group(2) + ('\x02' if MODE_RE.search(m.group(1)) else '')
    return COND_RE.sub(cond, text)


files = {}
for d, _, fs in os.walk(ROOT):
    for f in fs:
        if f.endswith('.scene.dry'):
            files[f[:-len('.scene.dry')]] = os.path.join(d, f)
nodes = {}  # 'file' or 'file.sub' -> section
for base, path in files.items():
    for sec in parse(path):
        nodes[base + ('.' + sec[0] if sec[0] else '')] = sec


def cond_of(sec):
    return ' '.join(sec[1].get('view-if', []) + sec[1].get('choose-if', []))


def marker(sec, p):
    return any(re.match(r'#\s*party:\s*%s(?!\w)' % p, c) for c in sec[3])


def resolve(node, target):
    base = node.split('.')[0]
    for cand in (base + '.' + target, target):
        if cand in nodes:
            return cand
    return None


def requires(cond, p):
    """True if the condition is 'player = p' or a top-level conjunction with it."""
    eq = r'\(?\s*player\s*==?\s*"%s"\s*' % p
    cond = cond.strip()
    return bool(re.fullmatch(eq + r'\)?', cond) or re.match(eq + r'and\s', cond) or re.search(r'\sand\s+' + eq + r'\)?$', cond)
                or (re.search(eq, cond) and ' or ' not in cond))


excluded = {k for k, sec in nodes.items() if requires(cond_of(sec), other) or marker(sec, other)}
explicit = {k for k, sec in nodes.items() if requires(cond_of(sec), mode) or marker(sec, mode)}
edges, hidden_body = {}, set()  # node -> [(target, via_mode_condition)]
for k, sec in nodes.items():
    out = []
    for g in sec[1].get('go-to', []):
        for part in g.split(';'):
            tgt, _, c = part.strip().partition(' if ')
            if not tgt or OTHER_RE.search(c):
                continue
            if not c or MODE_RE.search(c):
                hidden_body.add(k)
            out.append((resolve(k, tgt.strip()), bool(MODE_RE.search(c)), 'goto'))
    for _, line in sec[2]:
        m = re.match(r'^-\s*@([\w.]+)', line)
        if m:
            out.append((resolve(k, m.group(1)), False, 'option'))
        m = re.match(r'^-\s*#(\w+)', line)
        if m:  # tag option (e.g. "- #endings"): every section with that tag
            out += [(t, False, 'option') for t, tsec in nodes.items()
                    if m.group(1) in [x.strip() for x in re.split('[,;]', ' '.join(tsec[1].get('tags', [])))]]
    edges[k] = [e for e in out if e[0]]


def reach(stop_explicit):
    entries = [k for k in nodes if '.' not in k]
    seen = set()
    while entries:
        k = entries.pop()
        if k in seen or k in excluded or (stop_explicit and k in explicit):
            continue
        seen.add(k)
        entries += [t for t, via, kind in edges[k] if not (stop_explicit and via) and not (kind == 'option' and k in hidden_body)]
    return seen


reachable, shared = reach(False), reach(True)
hits, ok_hits = [], []
for k in sorted(reachable):
    sec = nodes[k]
    okterms = set()
    for c in sec[3] + nodes[k.split('.')[0]][3]:  # party-ok in the top section applies to the whole file
        m = re.match(r'#\s*party-ok:\s*(.*)', c)
        if m:
            okterms |= {t.strip() for t in m.group(1).split('(')[0].split(',')}
    path = files[k.split('.')[0]]
    for n, line in sec[2]:
        m = re.match(r'^-\s*@([\w.]+)', line)
        if m and (resolve(k, m.group(1)) in excluded or k in hidden_body):
            continue  # option to a section of the other party, or options of a scene that is left by go-to: hidden
        opt_mine = bool(m) and resolve(k, m.group(1)) in explicit
        text = strip_text(line)
        for term in TERMS[mode]:
            for m in re.finditer(term, text):
                inside = text[:m.start()].count('\x01') > text[:m.start()].count('\x02')
                word = m.group(0)
                rec = (os.path.relpath(path, ROOT), n, k, word, line.strip()[:110])
                if k not in shared or inside or opt_mine or any(o and (word.lower().startswith(o.lower()) or o.lower() in word.lower()) for o in okterms):
                    ok_hits.append(rec)
                else:
                    hits.append(rec)

for f, n, sid, w, line in hits:
    print(f'{f}:{n} [{sid}] {w}: {line}')
if verbose:
    print('--- explicit %s context / party-ok ---' % mode)
    for f, n, sid, w, line in ok_hits:
        print(f'{f}:{n} [{sid}] {w}: {line}')
print(f'{mode}: {len(hits)} unreviewed hits, {len(ok_hits)} in explicit context or marked party-ok')
sys.exit(1 if hits else 0)
