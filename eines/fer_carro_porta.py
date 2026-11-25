#!/usr/bin/env python3
"""Full del carruatge del Follet amb la porta de barrots del darrere que s'obre (cinemàtica final de l'Era).

Origen: AutoSprite (create_asset + animate_asset, 4 s, 16 fotogrames de 512x512) a art/objectes/carruatge_porta/sheet.png.
Es queden els fotogrames 0-11 (la porta ja és del tot oberta al 9-11), retallats a la caixa comuna (497x450) i desats com a full de 4x3 a
assets/objectes/carruatge_porta.webp. El vídeo estira el carro en vertical (497x450 en lloc de 598x411): el joc el torna a la mida del
carruatge estàtic escalant X i Y per separat (vegeu parada() a js/zona_base.js).

    python eines/fer_carro_porta.py
"""
from pathlib import Path
from PIL import Image

ARREL = Path(__file__).resolve().parent.parent
ORIGEN = ARREL / 'art' / 'objectes' / 'carruatge_porta' / 'sheet.png'
DEST = ARREL / 'assets' / 'objectes' / 'carruatge_porta.webp'
CEL, COLS, N = 512, 4, 12
CAIXA = (4, 60, 508, 512)          # x0, y0, x1, y1 comuns a tots els fotogrames

im = Image.open(ORIGEN).convert('RGBA')
w, h = CAIXA[2] - CAIXA[0], CAIXA[3] - CAIXA[1]
out = Image.new('RGBA', (w * 4, h * 3), (0, 0, 0, 0))
for i in range(N):
    c, r = i % COLS, i // COLS
    fr = im.crop((c * CEL + CAIXA[0], r * CEL + CAIXA[1], c * CEL + CAIXA[2], r * CEL + CAIXA[3]))
    out.paste(fr, ((i % 4) * w, (i // 4) * h))
out.save(DEST, 'WEBP', quality=90, alpha_quality=100, method=6)
print('Desat', DEST.relative_to(ARREL), out.size, 'fotograma', w, 'x', h)
