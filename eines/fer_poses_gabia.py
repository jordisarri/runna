#!/usr/bin/env python3
"""Poses noves de la lluita final (generades amb AutoSprite a partir de les imatges de referència) -> assets/ (WebP transparent).

    python eines/fer_poses_gabia.py

Ocellaire: art/enemics/ocellaire_{invoca,cercle,llanca,genolls_v2}.png -> assets/enemics/ocellaire_{invoca,cercle,llança,genolls}.webp
  Mateixa escala per a totes (la dels dibuixos dempeus: 322 px d'alçada de figura), peus a y=322 d'un llenç de 340x329 i centrat al cos (mitjana de l'alfa).
  Els llenços són més amples que els de l'idle (260) perquè les poses obertes (cercle, genolls) no es tallin: a js/assets.js l'amplada és 170 (= 340/2, mateix 0,5 de sempre).
  combat.js recentra la caixa de col·lisió en canviar de textura.
Germà Aldreu trist: art/personatges/germa_aldreu_trist.png -> assets/personatges/germa_aldreu_trist.webp (llenç de 158x255, com germa_aldreu, figura alta 255).
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image
sys.path.insert(0, str(Path(__file__).resolve().parent))
from treure_fons import treure_fons

ARREL = Path(__file__).resolve().parent.parent
W, H, PEUS, ESC = 340, 329, 322, 0.3276

def bbox(im):
    a = np.array(im)[:, :, 3] > 10; ys, xs = np.where(a)
    return xs.min(), xs.max(), ys.min(), ys.max()

def ocellaire(src, dst):
    im = treure_fons(Image.open(ARREL / src), forats=1500); x0, x1, y0, y1 = bbox(im)
    im = im.crop((x0, y0, x1 + 1, y1 + 1))
    g = im.resize((max(1, round(im.width * ESC)), max(1, round(im.height * ESC))), Image.LANCZOS)
    a = np.array(g)[:, :, 3] > 10; ys, xs = np.where(a)
    cx = float(xs[ys > g.height * 0.4].mean())              # centre del cos (sense el braç alçat)
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ox, oy = round(W / 2 - cx), PEUS + 1 - g.height
    out.alpha_composite(g, (max(0, ox), max(0, oy))) if ox >= 0 and oy >= 0 else out.paste(g, (ox, oy), g)
    out.save(ARREL / dst, 'WEBP', quality=90, alpha_quality=100, method=6)
    # cap: centre dels píxels de pell (clars, rosats) a la part de dalt de la figura, en fraccions del llenç
    arr = np.array(out).astype(int); r, gg, b, al = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    pell = (al > 200) & (r > 200) & (gg > 140) & (gg < 205) & (b > 110) & (b < 190)
    ys, xs = np.where(pell); top = np.where(al > 10)[0].min()
    sel = ys < top + (PEUS - top) * 0.55
    print(dst, 'figura', g.size, 'cap (x,y)=', round((xs[sel].mean() - W / 2) / W, 3), round(ys[sel].mean() / H, 3), 'cim', round(top / H, 3))

def aldreu():
    im = treure_fons(Image.open(ARREL / 'art/personatges/germa_aldreu_trist.png')); x0, x1, y0, y1 = bbox(im)
    im = im.crop((x0, y0, x1 + 1, y1 + 1)); h = 255; w = round(im.width * h / im.height)
    g = im.resize((w, h), Image.LANCZOS); out = Image.new('RGBA', (158, 255), (0, 0, 0, 0)); out.alpha_composite(g, ((158 - w) // 2, 0))
    out.save(ARREL / 'assets/personatges/germa_aldreu_trist.webp', 'WEBP', quality=90, alpha_quality=100, method=6); print('aldreu trist', g.size)

if __name__ == '__main__':
    for n, d in [('invoca', 'invoca'), ('cercle', 'cercle'), ('llanca', 'llança'), ('genolls_v2', 'genolls')]:
        ocellaire(f'art/enemics/ocellaire_{n}.png', f'assets/enemics/ocellaire_{d}.webp')
    aldreu()
