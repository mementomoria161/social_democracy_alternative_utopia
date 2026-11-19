"""Lists .dry files that still contain English prose (rough heuristic: count of common English words outside code lines)."""
import os, re, sys
root = os.path.join(os.path.dirname(__file__), '..', 'source')
W = re.compile(r"\b(the|and|of|our|we|is|has|have|with|this|that|will|their|they|which|are|was|been|be|to)\b")
res = []
for d, _, fs in os.walk(root):
    for f in fs:
        if not f.endswith('.dry'): continue
        n = 0
        for line in open(os.path.join(d, f), encoding='utf-8'):
            if re.match(r'^\s*(on-arrival|on-departure|view-if|choose-if|go-to|Q\.|//|#|var |if |for |\}|tags|max-visits|priority|frequency|set-|call|card-image|face-image|audio)', line): continue
            n += len(W.findall(line))
        if n: res.append((n, os.path.relpath(os.path.join(d, f), root)))
for n, p in sorted(res, reverse=True): print(f'{n:5d} {p}')
print(f'{len(res)} files with English, {sum(n for n,_ in res)} hits')
