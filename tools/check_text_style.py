"""Finds typographic errors in scene texts that the Dendry compiler does not report.

Usage: python -I tools/check_text_style.py
Checks (scene text only; comments, JS blocks {! ... !} and the data scenes groups_data/climate_data are skipped):
  stern     unescaped gender star (Arbeitnehmer*innen): Dendry reads * as emphasis, the star vanishes and text turns italic.
            Write Arbeitnehmer\\*innen.
  klebt     a conditional directly after a word ("Parteivorsitzender[? if x : und ...?]"): the compiler trims the space
            after the colon, so the words are glued. Put a space before [? .
  leer      a space before ?] that is directly followed by punctuation ("hat ?]."): shows as "hat ." in the game.
  anrede    "Bundeskanzler\\*in [+ chancellor +]": use [+ chancellor_title +] [+ chancellor +].
Exit code 1 if anything is found.
"""
import os, re, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'source', 'scenes')
SKIP = {'groups_data.scene.dry', 'climate_data.scene.dry'}
CODE = re.compile(r'^\s*(#|//)|^\s*(on-arrival|on-departure|on-display|view-if|choose-if|go-to|max-visits|tags|set-jump|call|frequency|priority|order|face-image|card-image|set-bg|new-page|is-card|is-pinned-card|is-special|is-hand|max-cards)\b')
RULES = [
    ('stern', re.compile(r'(?<=[A-Za-zäöüßÄÖÜ])(?<!\\)\*(?=innen|in\b|r\b)')),
    ('klebt', re.compile(r'(?<=[A-Za-zäöüßÄÖÜ0-9“”"»)])\[\?\s*if[^:\]]*?:\s*(?=[A-Za-zäöüÄÖÜ–„])')),
    ('leer', re.compile(r'\s+\?\](?=[.,;:!?)])')),
    ('anrede', re.compile(r'Bundeskanzler\\?\*in \[\+ chancellor \+\]')),
]
hits = 0
for dp, dn, fn in os.walk(ROOT):
    for f in sorted(fn):
        if not f.endswith('.dry') or f in SKIP:
            continue
        p = os.path.join(dp, f)
        injs = False
        for i, ln in enumerate(open(p, encoding='utf8').read().split('\n'), 1):
            o, c = ln.count('{!'), ln.count('!}')
            if injs:
                if c > o or (c and not o):
                    injs = False
                continue
            if o > c:
                injs = True
            if CODE.match(ln):
                continue
            text = re.sub(r'\{!.*?!\}', '', ln)
            for name, rx in RULES:
                for m in rx.finditer(text):
                    hits += 1
                    print('%s:%d [%s] …%s…' % (os.path.relpath(p, ROOT), i, name, text[max(0, m.start() - 30):m.end() + 20]))
print('%d Fundstellen' % hits)
sys.exit(1 if hits else 0)
