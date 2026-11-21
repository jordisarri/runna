#!/usr/bin/env python3
"""Fulls de caminar del Germà Aldreu monjo en ALTA RESOLUCIÓ → assets/personatges/germa_aldreu_camina.webp (cap a la dreta) i germa_aldreu_ne.webp (cap al nord-est).
    python3 eines/fer_aldreu_camina_hd.py
Origen: art/personatges/aldreu_camina_hd/{right,northeast}.png (AutoSprite, caminar isomètric del personatge «Germà Aldreu monjo», 4x4 fotogrames de 512; es fan servir 8 dels 16).
Mida: escala ESC (0,65): el personatge hi fa uns 266 px d'alt, igual que el dibuix quiet un cop carregat (amplada 133 x RES), de manera que el joc, que posa als fulls de caminar l'escala del dibuix quiet, el veu igual de gran.
Els peus (el punt més baix de cada fotograma) sempre a CEL_ALT - 6 i el cos centrat al centre mig de l'animació.
IMPORTANT: el joc suposa cel·les de CEL_AMPLE x CEL_ALT (frameWidth/frameHeight a js/assets.js).
"""
import os
import numpy as np
from PIL import Image
ARREL = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
ORIGEN = os.path.join(ARREL, 'art', 'personatges', 'aldreu_camina_hd')
ESC = 0.65                      # el joc posa als fulls de caminar l'escala del dibuix quiet, que es carrega a 266 px d'alt (amplada 133 en joc x RES 2); el personatge fa uns 410 px a l'original: 266/410
CEL_AMPLE, CEL_ALT, H = round(300 * ESC), round(432 * ESC), 512
for nom, dest in (('right', 'germa_aldreu_camina'), ('northeast', 'germa_aldreu_ne')):
    im = Image.open(os.path.join(ORIGEN, nom + '.png')).convert('RGBA')
    quadres = []
    for k in range(0, 16, 2):
        r, c = divmod(k, 4)
        fr = im.crop((c * H, r * H, (c + 1) * H, (r + 1) * H))
        a = np.array(fr)[:, :, 3]; a[a < 24] = 0
        fr.putalpha(Image.fromarray(a))
        bb = fr.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
        quadres.append((fr, bb))
    cx = float(np.median([(b[0] + b[2]) / 2 for _, b in quadres]))
    out = Image.new('RGBA', (8 * CEL_AMPLE, CEL_ALT), (0, 0, 0, 0))
    for i, (fr, bb) in enumerate(quadres):
        fr = fr.resize((round(H * ESC), round(H * ESC)), Image.LANCZOS)
        cel = Image.new('RGBA', (CEL_AMPLE, CEL_ALT), (0, 0, 0, 0))
        x = round(CEL_AMPLE / 2 - cx * ESC); y = CEL_ALT - 4 - round(bb[3] * ESC)
        cel.paste(fr, (x, y), fr)
        out.alpha_composite(cel, (i * CEL_AMPLE, 0))
    p = os.path.join(ARREL, 'assets', 'personatges', dest + '.webp')
    out.save(p, 'WEBP', quality=88, alpha_quality=100, method=6)
    print(p, out.size, os.path.getsize(p) // 1024, 'KB')
