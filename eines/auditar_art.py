#!/usr/bin/env python3
"""Auditoria de coherència entre art/ (originals) i assets/ (el que carrega el joc).
   python3 eines/auditar_art.py
Comprova: (1) webp d'assets/ sense original a art/<mateixa carpeta>; (2) la mateixa peça en dos formats
a la mateixa carpeta d'art/ (jpg+png...) fora d'antics/no_usats/arxiu; (3) referències de js/ i index.html
a fitxers que no existeixen; (4) relació d'aspecte molt diferent entre original i webp (només avís, sovint és normal:
retall de marges o fulles de frames). art/ fa de mirall d'assets/ (art/ineu/tarota.png -> assets/ineu/tarota.webp)
i per això un mateix nom a carpetes diferents NO és un conflicte."""
import os, re, sys
from PIL import Image
EXT = ('.png', '.jpg', '.jpeg', '.webp')
OCULTES = ('antics', 'no_usats', 'arxiu')
def stems(arrel):
    d = {}
    for p, ds, fs in os.walk(arrel):
        for f in fs:
            s, e = os.path.splitext(f)
            if e.lower() in EXT: d.setdefault((os.path.relpath(p, arrel), s), []).append(f)
    return d
A, W = stems('art'), stems('assets')
ok = True
print('1) webp sense original a la mateixa carpeta d\'art/ (no regenerables des de convertir_webp):')
for (c, s) in sorted(W):
    if c.startswith(('ineu/atac', 'ineu/cop', 'pwa', 'ineu/pingpong')): continue
    if (c, s) not in A: print('  ', os.path.join(c, s)); 
print('2) mateixa peça en diversos formats a la mateixa carpeta d\'art/:')
for (c, s), v in sorted(A.items()):
    if len(v) > 1 and not any(x in c.split(os.sep) for x in OCULTES): print('  ', os.path.join('art', c, s), v); ok = False
print('3) referències a fitxers inexistents:')
refs = set()
for p, _, fs in os.walk('js'):
    for f in fs:
        if f.endswith('.js'): refs |= set(re.findall(r"assets/[\w/ñç·.\-]+\.(?:webp|png|jpg|mp3|m4a|ogg)", open(os.path.join(p, f), encoding='utf8').read()))
for r in sorted(refs):
    if not os.path.exists(r): print('   FALTA', r); ok = False
print('4) relació d\'aspecte (avís, >40% de diferència):')
for (c, s) in sorted(W):
    if (c, s) in A and not c.startswith('ineu'):
        a = os.path.join('art', c, A[(c, s)][0]); w = os.path.join('assets', c, W[(c, s)][0])
        try:
            ia, iw = Image.open(a), Image.open(w)
            if abs(ia.width / ia.height - iw.width / iw.height) / (iw.width / iw.height) > 0.4: print('  ', a, ia.size, '->', iw.size)
        except Exception as e: pass
sys.exit(0 if ok else 1)
