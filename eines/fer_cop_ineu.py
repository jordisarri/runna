#!/usr/bin/env python3
"""Fulls de l'Ineu quan rep un cop (8 direccions, generats amb AutoSprite: pack isomètric «Hit React») → assets/ineu/cop/cop_<direccio>.webp.

    python3 eines/fer_cop_ineu.py [gruix_contorn]       (per defecte 1)

Origen: art/ineu/cop/<direccio>.png (4x4 fotogrames de 256, 16 per full). Per cada direcció:
  · l'escala es treu de l'Ineu quiet d'aquella direcció (assets/ineu/idle/idle_<dir>.webp): el primer fotograma del full, quan encara no ha rebut el cop, ha de fer
    la mateixa alçada que l'idle,
  · una translació rígida de tota la direcció (el primer fotograma), de manera que els peus quedin a y = 238 i el cos centrat a x = 128, i el moviment de cada fotograma es conservi,
  · el contorn negre d'1 px (eines/contorn_ineu.py).
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image
sys.path.insert(0, str(Path(__file__).resolve().parent))
from contorn_ineu import contorn

ARREL = Path(__file__).resolve().parent.parent
DIRS = ['down', 'up', 'left', 'right', 'southwest', 'southeast', 'northwest', 'northeast']
IDLE = {'down': 'idle_down', 'up': 'idle_up', 'left': 'idle_elev_left', 'right': 'idle_elev_right', 'southwest': 'idle_southwest', 'southeast': 'idle_southeast',
        'northwest': 'idle_northwest', 'northeast': 'idle_northeast'}
CEL = 256
PEUS = 238
ORIGEN = ARREL / 'art' / 'ineu' / 'cop'
DEST = ARREL / 'assets' / 'ineu' / 'cop'


def fots(path):
    im = Image.open(path).convert('RGBA')
    return [im.crop(((i % 4) * CEL, (i // 4) * CEL, (i % 4) * CEL + CEL, (i // 4) * CEL + CEL)) for i in range(16)]


def bbox(im):
    ys, xs = np.where(np.array(im.split()[3]) > 24)
    return xs.min(), xs.max(), ys.min(), ys.max()


def alt_idle(d):
    im = Image.open(ARREL / 'assets' / 'ineu' / 'idle' / (IDLE[d] + '.webp')).convert('RGBA')
    fs = [im.crop(((i % 4) * CEL, (i // 4) * CEL, (i % 4) * CEL + CEL, (i // 4) * CEL + CEL)) for i in range(16)]
    return float(np.median([bbox(f)[3] - bbox(f)[2] + 1 for f in fs])) - 2          # (-2: el contorn d'1 px, que l'idle ja porta)


def main():
    gruix = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    DEST.mkdir(parents=True, exist_ok=True)
    for d in DIRS:
        fs = fots(ORIGEN / f'{d}.png')
        b0 = bbox(fs[0]); alt0 = b0[3] - b0[2] + 1
        f = alt_idle(d) / alt0
        cx, bot = (b0[0] + b0[1]) / 2, b0[3]
        dx, dy = 128 - cx * f, PEUS - bot * f
        out = Image.new('RGBA', (4 * CEL, 4 * CEL), (0, 0, 0, 0))
        for i, im in enumerate(fs):
            g = im.resize((round(CEL * f), round(CEL * f)), Image.LANCZOS)
            cel = Image.new('RGBA', (CEL, CEL), (0, 0, 0, 0)); cel.paste(g, (round(dx), round(dy)), g)
            out.paste(cel, ((i % 4) * CEL, (i // 4) * CEL))
        contorn(out, gruix).save(DEST / f'cop_{d}.webp', 'WEBP', quality=88, alpha_quality=100, method=6)
        print(d, 'escala', round(f, 3))


if __name__ == '__main__':
    main()
