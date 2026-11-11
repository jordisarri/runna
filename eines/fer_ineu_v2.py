#!/usr/bin/env python3
"""Fulls nous de l'Ineu (caminar i idle en 8 direccions, generats amb AutoSprite) → assets/ineu_v2/<direccio>.webp i idle_<direccio>.webp.

    python3 eines/fer_ineu_v2.py [gruix_contorn]       (per defecte 1)

Origen: art/ineu/v2/zip_walk/<dir>.png i zip_idle/<dir>.png (4x4 fotogrames de 256, 16 per full). Per cada direcció es fa:
  · una escala única per a tots els fulls (perquè l'Ineu faci la mateixa alçada que als fulls vells: uns 224 px d'uns 256),
  · una translació rígida de tota la direcció (mediana dels peus i del centre), de manera que els peus quedin a y = 238 i el cos centrat a x = 128 i el moviment de
    cada fotograma es conservi,
  · el contorn negre d'1 px (eines/contorn_ineu.py).
Els fulls vells (assets/ineu/) no es toquen. El joc tria la versió amb el paràmetre ?ineu=v1 / v2 (vegeu INEU_V2 a js/assets.js).
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image
sys.path.insert(0, str(Path(__file__).resolve().parent))
from contorn_ineu import contorn

ARREL = Path(__file__).resolve().parent.parent
DIRS = ['down', 'up', 'left', 'right', 'southwest', 'southeast', 'northwest', 'northeast']
CEL = 256
PEUS = 238
ALT_VELLA = 224.0          # alçada mediana de l'Ineu als fulls vells (dins la cel·la de 256)
DEST = ARREL / 'assets' / 'ineu_v2'
SENSE = ARREL / 'art' / 'ineu' / 'v2' / 'sense_contorn'

def fots(path):
    im = Image.open(path).convert('RGBA')
    return [im.crop(((i % 4) * CEL, (i // 4) * CEL, (i % 4) * CEL + CEL, (i // 4) * CEL + CEL)) for i in range(16)]
def bbox(im):
    a = np.array(im.split()[3]) > 24
    ys, xs = np.where(a)
    return xs.min(), xs.max(), ys.min(), ys.max()

def main():
    gruix = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    DEST.mkdir(parents=True, exist_ok=True); SENSE.mkdir(parents=True, exist_ok=True)
    tots = {(t, d): fots(ARREL / 'art' / 'ineu' / 'v2' / f'zip_{t}' / f'{d}.png') for t in ('walk', 'idle') for d in DIRS}
    alts = [bbox(f)[3] - bbox(f)[2] + 1 for fs in tots.values() for f in fs]
    f = ALT_VELLA / float(np.median(alts))
    print('escala', round(f, 3))
    for (t, d), fs in tots.items():
        boxes = [bbox(x) for x in fs]
        cx = float(np.median([(b[0] + b[1]) / 2 for b in boxes])); bot = float(np.median([b[3] for b in boxes]))
        dx, dy = 128 - cx * f, PEUS - bot * f
        out = Image.new('RGBA', (4 * CEL, 4 * CEL), (0, 0, 0, 0))
        for i, im in enumerate(fs):
            g = im.resize((round(CEL * f), round(CEL * f)), Image.LANCZOS)
            cel = Image.new('RGBA', (CEL, CEL), (0, 0, 0, 0)); cel.alpha_composite(g, (round(dx), round(dy))) if round(dx) >= 0 and round(dy) >= 0 else cel.paste(g, (round(dx), round(dy)), g)
            out.paste(cel, ((i % 4) * CEL, (i // 4) * CEL))
        nom = d if t == 'walk' else 'idle_' + d
        out.save(SENSE / (nom + '.webp'), 'WEBP', quality=90, alpha_quality=100, method=6)
        contorn(out, gruix).save(DEST / (nom + '.webp'), 'WEBP', quality=88, alpha_quality=100, method=6)
        print(nom, 'ok')

if __name__ == '__main__':
    main()
