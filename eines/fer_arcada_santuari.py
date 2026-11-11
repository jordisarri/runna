#!/usr/bin/env python3
"""Arcada lateral del Santuari (arcs i piles en perspectiva) → assets/objectes/arcada_santuari.webp.

    python3 eines/fer_arcada_santuari.py

Origen: art/objectes/arcada_santuari.png (generada amb AutoSprite: una arcada de quatre arcs que s'allunya cap a la dreta, sobre fons blanc).
Es treu el fons i s'hi aplica una transformació afí (cisallament) perquè l'arcada s'allunyi cap AMUNT i una mica cap al centre de la nau, amb les piles sempre verticals:
    x' = C * x      y' = y - K * x
(C < 1 aprima el dibuix en horitzontal; K fa pujar les parts llunyanes). Després s'escala a la mida del joc (RES = 2 píxels per píxel de joc).
Imprimeix la mida i la posició de la base de cada pila (en píxels de joc, des de l'angle superior esquerre de la imatge) per al JS (ESG.arcada a provisionals.js).
A la dreta del Santuari es fa servir la mateixa imatge girada (flipX).
"""
import sys, json
from pathlib import Path
from PIL import Image
sys.path.insert(0, str(Path(__file__).resolve().parent))
import treure_fons as TF

ARREL = Path(__file__).resolve().parent.parent
C, K, ESC, RES = 0.40, 0.46, 0.46, 2           # ESC: píxels de joc per píxel d'origen (alçada de les piles ≈ 0,46 x 800 ≈ 370)
# base de cada pila a l'original 1024x1024 (x del centre, y de la base): mesurades a ull sobre la imatge
PILES = [(91, 933), (421, 876), (683, 842), (842, 819), (974, 796)]

def main():
    im = Image.open(ARREL / 'art' / 'objectes' / 'arcada_santuari.png')
    net = TF.treure_fons(im, forats=400)
    bb = net.getbbox(); net = net.crop(bb); W, H = net.size
    nw, nh = int(C * W) + 2, int(H + K * W) + 2
    out = net.transform((nw, nh), Image.AFFINE, (1 / C, 0, 0, K / C, 1, -K * W), resample=Image.BICUBIC)
    f = ESC * RES
    out = out.resize((round(nw * f), round(nh * f)), Image.LANCZOS)
    out.save(ARREL / 'assets' / 'objectes' / 'arcada_santuari.webp', 'WEBP', quality=90, alpha_quality=100, method=6)
    out.transpose(Image.FLIP_LEFT_RIGHT).save(ARREL / 'assets' / 'objectes' / 'arcada_santuari_d.webp', 'WEBP', quality=90, alpha_quality=100, method=6)       # la de la dreta: girada
    bases = []
    for (x, y) in PILES:
        xx, yy = x - bb[0], y - bb[1]
        bases.append([round(C * xx * ESC, 1), round((yy - K * xx + K * W) * ESC, 1)])
    print(json.dumps({'amplada_joc': round(out.width / RES, 1), 'alcada_joc': round(out.height / RES, 1), 'bases': bases}))

main()
