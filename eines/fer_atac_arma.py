#!/usr/bin/env python3
"""Fulls d'atac de l'Ineu amb cada arma (bastó, branca del Til·ler, espasa), 8 direccions → assets/ineu/atac_<arma>_<direccio>.webp.

    python3 eines/fer_atac_arma.py

Origen: art/ineu/atac_arma/<arma>/<direccio>.png (bastó, branca i espasa són la 2a generació; la 1a és a basto_v1/, tiller_v1/ i espasa_v1/ -l'espasa repetia el tall quatre vegades-; la branca i el bastó es tallaven a la vora: la 1a repetia el tall quatre vegades i és a espasa_v1/) (paquets isomètrics d'AutoSprite, 4x4 de 384 px, 16 fotogrames; l'arma ja hi surt a la mà).
AutoSprite no fa un cop net: afegeix preparació, repeteix el gest i es queda en pose final. Aquí es tria, per arma, només els fotogrames del cop (FOTOGRAMES), amb
l'últim repetit perquè es vegi el final del cop. Els fulls surten en cel·les de CEL px a l'escala dels fulls de caminar (reduïts: SPRITE_INEU.k), amb els peus
a la mateixa fracció de la cel·la (origen 0,5 / 0,9375, com al joc) i el contorn negre d'1 px. El joc els carrega a js/assets.js (ATAC_ARMA_FPS).
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image
sys.path.insert(0, str(Path(__file__).resolve().parent))
from contorn_ineu import alfa_contorn

ARREL = Path(__file__).resolve().parent.parent
ORIGEN = ARREL / 'art' / 'ineu' / 'atac_arma'
DEST = ARREL / 'assets' / 'ineu'
DIRS = ['down', 'up', 'left', 'right', 'southwest', 'southeast', 'northwest', 'northeast']
FOT = {'basto': [2, 3, 4, 5, 5], 'tiller': [2, 3, 4, 5, 5], 'espasa': [2, 3, 4, 5, 5]}       # fotogrames triats (de 0 a 15) per arma
SRC, CEL = 384, 320         # fotograma d'origen i cel·la de sortida (més gran que abans, perquè l'arma no es talli)
COS = 170.0                  # alçada que ha de fer el cos de l'Ineu a la cel·la (com als fulls de caminar reduïts)
K_FIXA = {'espasa': 0.612}   # (basto i tiller: es mesura, vegeu escala())   # escala fixa (el cos de l'espasa fa 277 px a l'origen; amb l'espasa avall, la mesura dels peus no val)
GRUIX = 1

def fotograma(im, i):
    return im.crop(((i % 4) * SRC, (i // 4) * SRC, (i % 4) * SRC + SRC, (i // 4) * SRC + SRC))

def peus(im, fots):
    # fila més baixa del cos (mediana dels fotogrames triats; l'arma no baixa dels peus, excepte l'espasa avall: per això mediana i no màxim)
    b = []
    for i in fots:
        ys, _ = np.where(np.array(fotograma(im, i).split()[3]) > 24)
        b.append(ys.max())
    return float(np.median(b))

def escala(im, arma):
    # Alçada del cos = dels peus al cap en els fotogrames finals (l'arma queda a l'alçada de les mans); mediana d'aquests fotogrames
    if arma in K_FIXA: return K_FIXA[arma]
    h = []
    for i in (12, 13, 14, 15):
        ys, _ = np.where(np.array(fotograma(im, i).split()[3]) > 24); h.append(ys.max() - ys.min() + 1)
    return COS / float(np.median(h))

def main():
    for arma, fots in FOT.items():
        for d in DIRS:
            im = Image.open(ORIGEN / arma / f'{d}.png').convert('RGBA')
            pf = peus(im, range(16)); K = escala(im, arma)
            n = len(fots); cols = 4; files = (n + cols - 1) // cols
            out = Image.new('RGBA', (cols * CEL, files * CEL), (0, 0, 0, 0))
            for j, i in enumerate(fots):
                g = fotograma(im, i).resize((round(SRC * K), round(SRC * K)), Image.LANCZOS)
                cel = Image.new('RGBA', (CEL, CEL), (0, 0, 0, 0))
                dx, dy = round(CEL / 2 - SRC * K / 2), round(CEL * 0.9375 - pf * K)
                cel.paste(g, (dx, dy), g)
                a = np.array(cel); vora = np.zeros_like(a); vora[:, :, 3] = (alfa_contorn(a[:, :, 3], GRUIX) * 255).astype(np.uint8)
                base = Image.fromarray(vora, 'RGBA'); base.alpha_composite(cel)
                out.paste(base, ((j % cols) * CEL, (j // cols) * CEL))
            out.save(DEST / f'atac_{arma}_{d}.webp', 'WEBP', quality=88, alpha_quality=100, method=6)
            print(arma, d, n, 'fotogrames, peus origen', round(pf), 'K', round(K, 3))

if __name__ == '__main__':
    main()
