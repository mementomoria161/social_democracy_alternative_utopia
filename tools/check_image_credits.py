"""Checks that every image under out/html/img/ has a credit in credits_images.txt and in the credits scene, and vice versa.

Usage: python -I tools/check_image_credits.py   (exit code 1 on gaps)
"""
import os, re, sys

REPO = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
IMG = os.path.join(REPO, 'out', 'html', 'img')
files = {os.path.relpath(os.path.join(d, f), IMG).replace(os.sep, '/')
         for d, _, fs in os.walk(IMG) for f in fs if re.search(r'\.(jpe?g|png|gif|webp|svg)$', f, re.I)}


def credited(path):
    return {m.group(1) for m in re.finditer(r'^([\w./-]+\.(?:jpe?g|png|gif|webp|svg)):', open(path, encoding='utf-8').read(), re.M | re.I)}


bad = 0
for name, path in [('credits_images.txt', os.path.join(REPO, 'credits_images.txt')),
                   ('credits.scene.dry', os.path.join(REPO, 'source', 'scenes', 'credits.scene.dry'))]:
    c = credited(path)
    for f in sorted(files - c):
        print(f'{name}: no credit for {f}'); bad += 1
    for f in sorted(c - files):
        print(f'{name}: credit without file {f}'); bad += 1
print(f'{len(files)} images, {bad} gaps')
sys.exit(1 if bad else 0)
