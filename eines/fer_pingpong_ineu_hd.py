#!/usr/bin/env python3
"""Fulls de l'Ineu d'esquena del ping-pong NOU en alta resolució (512 px per fotograma, 4x4) → assets/ineu/pingpong/ineu_<cop>.webp, amb contorn negre.

    python3 eines/fer_pingpong_ineu_hd.py

Origen: art/pingpong2/ineu_drive_512.png, ineu_reves_512.png i ineu_servei_512.png (regenerats gratis a AutoSprite a partir dels mateixos vídeos, frameSize 512).
Al cop de dret i de revés es treuen les restes blanques del treure-fons (el personatge no té blanc d'esquena); al servei no (hi ha la pilota blanca).
Per defecte SENSE contorn (al minijoc, gran i a primer pla, el contorn fa lleig); amb l'argument --contorn 2 s'hi posa el negre de 2 px (= 1 px dels fulls de 256).

    python3 eines/fer_pingpong_ineu_hd.py [--contorn N]
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage
sys.path.insert(0, str(Path(__file__).resolve().parent))
from contorn_ineu import alfa_contorn

ARREL = Path(__file__).resolve().parent.parent
CEL = 512

def main():
    gruix = int(sys.argv[sys.argv.index('--contorn') + 1]) if '--contorn' in sys.argv else 0
    for nom, netejar in (('drive', True), ('reves', True), ('servei', False)):
        f = ARREL / 'art' / 'pingpong2' / f'ineu_{nom}_512.png'
        if not f.exists(): print('Falta', f.name); continue
        a = np.array(Image.open(f).convert('RGBA'))
        if netejar:
            blanc = (a[:, :, :3].min(axis=2) >= 225) & (a[:, :, 3] > 0)
            et, n = ndimage.label(blanc, structure=np.ones((3, 3)))
            for i in range(1, n + 1):
                m = et == i
                if m.sum() < 1600: a[m, 3] = 0
        out = np.zeros_like(a)
        H, W = a.shape[:2]
        for r in range(H // CEL):
            for c in range(W // CEL):
                ys, xs = slice(r * CEL, (r + 1) * CEL), slice(c * CEL, (c + 1) * CEL)
                cel = a[ys, xs]
                if gruix:
                    vora = np.zeros_like(cel); vora[:, :, 3] = (alfa_contorn(cel[:, :, 3], gruix) * 255).astype(np.uint8)
                    base = Image.fromarray(vora, 'RGBA'); base.alpha_composite(Image.fromarray(cel, 'RGBA'))
                    out[ys, xs] = np.array(base)
                else:
                    out[ys, xs] = cel
        (ARREL / 'assets' / 'ineu' / 'pingpong').mkdir(parents=True, exist_ok=True)
        Image.fromarray(out, 'RGBA').save(ARREL / 'assets' / 'ineu' / 'pingpong' / f'ineu_{nom}.webp', 'WEBP', quality=90, alpha_quality=100, method=6)
        print('ok', nom, W, H)

if __name__ == '__main__':
    main()
