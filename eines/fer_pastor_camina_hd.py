#!/usr/bin/env python3
"""Full de caminar del Pastor de la Boira en ALTA RESOLUCIÓ → assets/enemics/pastor_camina.webp (8 direccions x 8 fotogrames, cel·les de 384 px; abans 300 px, ampliats d'uns de 256).
    python3 eines/fer_pastor_camina_hd.py

Origen: art/enemics/pastor_camina_hd/<direccio>.png (AutoSprite, caminar isomètric, 4x4 fotogrames de 512; regenerats GRATIS a partir del vídeo amb regenerate_spritesheet,
frameSize 512, maxFrames 16, personatge «Pastor de la boira»). Es fan servir 8 dels 16 fotogrames (un de cada dos). UN SOL factor d'escala per a tots (el que fa càbrer el més
gran dins de la cel·la), els peus (el punt més baix) sempre a PEUS i el cos centrat al centre mig de la caixa de l'animació (no fotograma a fotograma: no tremola).
Ordre de les files (el que espera Grafics.animacions): nw, w, sw, n, e, s, ne, se.
IMPORTANT: el joc suposa cel·les de 384 (CEL_PASTOR, js/combat.js) i els peus a 275/300 de l'alçada de la cel·la.
"""
import os
import numpy as np
from PIL import Image
ARREL = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
ORIGEN = os.path.join(ARREL, 'art', 'enemics', 'pastor_camina_hd')
CEL, PEUS, MARGE = 384, round(384 * 275 / 300), 10
FILES = ['northwest', 'left', 'southwest', 'up', 'right', 'down', 'northeast', 'southeast']
FOTOGRAMES = list(range(0, 16, 2))
H = 512

quadres = {}
for d in FILES:
    im = Image.open(os.path.join(ORIGEN, d + '.png')).convert('RGBA')
    llista = []
    for f in FOTOGRAMES:
        r, c = divmod(f, 4)
        fr = im.crop((c * H, r * H, (c + 1) * H, (r + 1) * H))
        a = np.array(fr)[:, :, 3]
        a[a < 24] = 0
        fr.putalpha(Image.fromarray(a))
        llista.append((fr, fr.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()))
    quadres[d] = llista
amples = [b[2] - b[0] for q in quadres.values() for _, b in q]
altes = [b[3] - b[1] for q in quadres.values() for _, b in q]
f = min((CEL - 2 * MARGE) / max(amples), (PEUS - MARGE) / max(altes))
print('factor', round(f, 3), 'caixa max', max(amples), 'x', max(altes))
out = Image.new('RGBA', (8 * CEL, 8 * CEL), (0, 0, 0, 0))
for fila, d in enumerate(FILES):
    cx = np.median([(b[0] + b[2]) / 2 for _, b in quadres[d]])               # centre mig de l'animació
    for k, (fr, b) in enumerate(quadres[d]):
        s = fr.resize((round(H * f), round(H * f)), Image.LANCZOS)
        x = round(CEL / 2 - cx * f)
        y = PEUS - round(b[3] * f)                                          # els peus (el punt més baix de CADA fotograma) a PEUS
        out.alpha_composite(s, (k * CEL + x, fila * CEL + y)) if False else None
        # (es posa dins la cel·la retallant el que en sobri)
        cel = Image.new('RGBA', (CEL, CEL), (0, 0, 0, 0)); cel.alpha_composite(s, (x, y)) if (x >= 0 and y >= 0) else cel.paste(s, (x, y), s)
        out.alpha_composite(cel, (k * CEL, fila * CEL))
dest = os.path.join(ARREL, 'assets', 'enemics', 'pastor_camina.webp')
out.save(dest, 'WEBP', quality=88, alpha_quality=100, method=6)
print(dest, out.size, os.path.getsize(dest) // 1024, 'KB')
