"""Checks scene references (go-to, set-jump, call, - @id, - #tag) in source/ against existing scenes and tags.
Usage: python tools/check_links.py  (exit code 1 if broken references are found)"""
import os, re, sys
root = os.path.join(os.path.dirname(__file__), '..', 'source')
ids, tags, refs = set(), set(), []
for d, _, fs in os.walk(root):
    for f in fs:
        if not f.endswith('.scene.dry'): continue
        base = f[:-len('.scene.dry')]
        ids.add(base)
        cur = base
        for n, line in enumerate(open(os.path.join(d, f), encoding='utf-8'), 1):
            m = re.match(r'^@([\w.]+)\s*$', line)
            if m:
                cur = base + '.' + m.group(1); ids.add(cur); continue
            m = re.match(r'^tags:\s*(.*)$', line)
            if m: tags.update(t.strip() for t in m.group(1).split(',') if t.strip())
            m = re.match(r'^(go-to|set-jump|call):\s*(.*)$', line)
            if m:
                for part in m.group(2).split(';'):
                    t = part.strip().split(' if ')[0].strip()
                    if t and t not in ('jumpScene', 'backSpecialScene'): refs.append((f, n, base, t, 'id'))
            m = re.match(r'^-\s*([@#])([\w.]+)', line)
            if m and m.group(2) != 'backSpecialScene': refs.append((f, n, base, m.group(2), 'id' if m.group(1) == '@' else 'tag'))
bad = 0
for f, n, base, t, kind in refs:
    if kind == 'tag':
        ok = t in tags
    else:
        ok = t in ids or (base + '.' + t) in ids or any(i.endswith('.' + t) and i.split('.')[0] == base for i in ids)
    if not ok:
        bad += 1; print(f'{f}:{n}: missing {kind} {t}')
print(f'{len(refs)} references, {bad} broken')
sys.exit(1 if bad else 0)
