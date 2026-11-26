#!/usr/bin/env python3
"""Full de caminar de la visitant (turista zombi dona) a partir del full d'AutoSprite (iso_walk_down, 16 fotogrames).

    python eines/fer_visitanta.py FULL.png [COLS] [CEL]

Surt assets/enemics/visitanta_zombi.webp: 16 fotogrames en 4x4 cel·les de 127x209 (com el visitant), de cara. Cada fotograma es retalla al cos de la
visitant i es posa al mateix lloc de la cel·la (els peus a baix), amb l'escala comuna perquè faci la mateixa alçada que el visitant zombi.
Els originals són a art/enemics/. COLS i CEL: columnes del full i mida de cel·la d'AutoSprite (per defecte 4 i 512).
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image

ARREL = Path(__file__).resolve().parent.parent
CW, CH, N = 127, 209, 16
ALT_CORS = 176          # alçada del cos dins la cel·la (el visitant fa uns 200)


def main():
    full = sys.argv[1]
    cols = int(sys.argv[2]) if len(sys.argv) > 2 else 4
    cel = int(sys.argv[3]) if len(sys.argv) > 3 else 512
    im = Image.open(full).convert('RGBA')
    frs = [im.crop(((i % cols) * cel, (i // cols) * cel, (i % cols) * cel + cel, (i // cols) * cel + cel)) for i in range(N)]
    boxes = []
    for f in frs:
        a = np.array(f)[:, :, 3] > 24
        ys, xs = np.where(a)
        boxes.append((xs.min(), xs.max(), ys.min(), ys.max()))
    alt = float(np.median([b[3] - b[2] + 1 for b in boxes]))
    esc = ALT_CORS / alt
    peus = float(np.median([b[3] for b in boxes]))
    cx = float(np.median([(b[0] + b[1]) / 2 for b in boxes]))
    out = Image.new('RGBA', (CW * 4, CH * 4), (0, 0, 0, 0))
    for k, f in enumerate(frs):
        g = f.resize((round(cel * esc), round(cel * esc)), Image.LANCZOS)
        cel_im = Image.new('RGBA', (CW, CH), (0, 0, 0, 0))
        ox = round(CW / 2 - cx * esc)                         # el centre del cos (mediana) al mig de la cel·la
        oy = round(CH - 6 - peus * esc)                       # els peus (mediana) a 6 px de baix; el rebot del caminar es manté
        cel_im.alpha_composite(g, (ox, oy)) if ox >= 0 and oy >= 0 else cel_im.paste(g, (ox, oy), g)
        out.alpha_composite(cel_im, ((k % 4) * CW, (k // 4) * CH))
    dest = ARREL / 'assets' / 'enemics' / 'visitanta_zombi.webp'
    out.save(dest, 'WEBP', quality=90, alpha_quality=100, method=6)
    print('->', dest, out.size)


if __name__ == '__main__':
    main()
