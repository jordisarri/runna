#!/usr/bin/env python3
"""Full de l'Ineu bevent un got de llet (de perfil, mirant a la dreta) → assets/ineu/llet/beu_llet.webp.

    python3 eines/fer_beu_llet_ineu.py

Origen: art/ineu/llet/beu_llet_dreta_512.png (AutoSprite, animació «Beu un got de llet», 4x4 de 512, 16 fotogrames, feta a AutoSprite per l'autor a partir del primer fotograma de l'idle de perfil dret).
Hi afegeix el contorn negre (com eines/contorn_ineu.py, que porta la resta d'animacions de l'Ineu).
Es fa servir a la Taverna (l'Eve ofereix un got de llet): vegeu ZonaBase.beureLlet.
"""
from pathlib import Path
import sys
import numpy as np
from PIL import Image

ARREL = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
from contorn_ineu import alfa_contorn

CEL = 512
GRUIX = 2          # px de la cel·la de 512 (≈ 1 px de joc a l'escala de l'animació, com el contorn de les altres animacions de l'Ineu)


def main():
    im = Image.open(ARREL / 'art' / 'ineu' / 'llet' / 'beu_llet_dreta_512.png').convert('RGBA')
    a = np.array(im)
    for r in range(im.height // CEL):
        for c in range(im.width // CEL):
            ys, xs = slice(r * CEL, (r + 1) * CEL), slice(c * CEL, (c + 1) * CEL)
            cel = a[ys, xs]
            vora = np.zeros_like(cel); vora[:, :, 3] = (alfa_contorn(cel[:, :, 3], GRUIX) * 255).astype(np.uint8)
            base = Image.fromarray(vora, 'RGBA'); base.alpha_composite(Image.fromarray(cel, 'RGBA'))
            a[ys, xs] = np.array(base)
    im = Image.fromarray(a, 'RGBA')
    dest = ARREL / 'assets' / 'ineu' / 'llet'
    dest.mkdir(parents=True, exist_ok=True)
    im.save(dest / 'beu_llet.webp', 'WEBP', quality=90, alpha_quality=100, method=6)
    print('ok', im.size)


if __name__ == '__main__':
    main()
