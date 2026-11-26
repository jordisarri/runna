#!/usr/bin/env python3
"""El cargol de boira: full de caminar (AutoSprite iso_walk_right, 8 fotogrames, 3 columnes de 512) i la pose tancat a la closca.

    python eines/fer_cargol.py

Llegeix art/enemics/cargol_base.png, cargol_camina_autosprite.png i cargol_closca.png i escriu a assets/enemics/:
  cargol_boira.webp   8 fotogrames en 4x2 cel·les (W x H, iguals), peus a baix, cap a la dreta (el joc el gira amb flipX)
  cargol_closca.webp  la closca, a UNA cel·la de les mateixes mides (mateixa línia de terra), perquè en canviar de textura el cos no es mogui
Els dos es redueixen a l'escala comuna (el caminar, a l'alçada de l'ocupació del dibuix base) perquè la closca faci la mateixa mida que la del cargol que camina.
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from treure_fons import treure_fons

ARREL = Path(__file__).resolve().parent.parent
ORI = ARREL / 'art' / 'enemics'
DEST = ARREL / 'assets' / 'enemics'
CEL, COLS, N = 512, 3, 8
W, H = 250, 190                  # cel·la final


def bbox(im, llindar=24):
    a = np.array(im)[:, :, 3] > llindar
    ys, xs = np.where(a)
    return xs.min(), xs.max(), ys.min(), ys.max()


def main():
    base = treure_fons(Image.open(ORI / 'cargol_base.png'))
    closca = treure_fons(Image.open(ORI / 'cargol_closca.png'))
    full = Image.open(ORI / 'cargol_camina_autosprite.png').convert('RGBA')
    frs = [full.crop(((i % COLS) * CEL, (i // COLS) * CEL, (i % COLS) * CEL + CEL, (i // COLS) * CEL + CEL)) for i in range(N)]
    boxes = [bbox(f) for f in frs]
    bb, bc = bbox(base), bbox(closca)
    # escala dels fotogrames: que càpiguen a la cel·la (la unió de tots, per no tallar res)
    x0 = min(b[0] for b in boxes); x1 = max(b[1] for b in boxes); y0 = min(b[2] for b in boxes); y1 = max(b[3] for b in boxes)
    esc = min((W - 8) / (x1 - x0 + 1), (H - 8) / (y1 - y0 + 1))
    peus = y1                                                                 # línia de terra comuna (la més baixa)
    cx = (x0 + x1) / 2
    out = Image.new('RGBA', (W * 4, H * 2), (0, 0, 0, 0))
    for k, f in enumerate(frs):
        g = f.resize((round(CEL * esc), round(CEL * esc)), Image.LANCZOS)
        cel = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        ox, oy = round(W / 2 - cx * esc), round(H - 4 - peus * esc)
        cel.alpha_composite(g, (max(0, ox), max(0, oy))) if ox >= 0 and oy >= 0 else cel.paste(g, (ox, oy), g)
        out.alpha_composite(cel, ((k % 4) * W, (k // 4) * H))
    out.save(DEST / 'cargol_boira.webp', 'WEBP', quality=90, alpha_quality=100, method=6)
    # closca: mateixa proporció respecte del dibuix base (l'alçada del cargol del full de caminar / l'alçada del dibuix base)
    alt_w = np.median([b[3] - b[2] + 1 for b in boxes]); alt_b = bb[3] - bb[2] + 1
    ec = esc * (alt_w / alt_b)
    cc = closca.crop((bc[0], bc[2], bc[1] + 1, bc[3] + 1))
    cc = cc.resize((max(1, round(cc.width * ec)), max(1, round(cc.height * ec))), Image.LANCZOS)
    cel = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    cel.alpha_composite(cc, (round(W / 2 - cc.width / 2), H - 4 - cc.height))
    cel.save(DEST / 'cargol_closca.webp', 'WEBP', quality=90, alpha_quality=100, method=6)
    print('cel·la', W, 'x', H, '| closca', cc.size, '| escala', round(esc, 3), round(ec, 3))


if __name__ == '__main__':
    main()
