"""
Torna a fer les poses del Pastor de Boira (assets/enemics/pastor_{apunta,ataca,enfadat,derrota}.webp) a DOBLE resolució (cel·la de 600 x 600 en lloc de 300 x 300),
a partir dels originals (art/enemics/pastor_<nom>.png, ja amb transparència). El dibuix queda exactament al mateix lloc i amb la mateixa proporció que a la versió de 300
(es llegeix la caixa de la pose actual i es posa l'original, reescalat, dins la mateixa caixa x2), però molt més nítid quan la càmera s'hi acosta (conversa amb el Pastor vençut).
    python eines/poses_pastor.py            (cal Pillow i numpy)
IMPORTANT: el joc suposa cel·les de 600 per a aquestes poses (vegeu animaPastor, js/combat.js): si es torna a canviar la mida, cal canviar-hi la constant.
"""
import os
from PIL import Image
import numpy as np

arrel = os.path.join(os.path.dirname(__file__), '..')
S = 2
for nom in ['apunta', 'ataca', 'enfadat', 'derrota']:
    dest = os.path.join(arrel, 'assets/enemics/pastor_%s.webp' % nom)
    art = Image.open(os.path.join(arrel, 'art/enemics/pastor_%s.png' % nom)).convert('RGBA')
    ab = art.getchannel('A').point(lambda a: 255 if a > 24 else 0).getbbox()
    cur = Image.open(dest).convert('RGBA')
    if cur.width >= 300 * S:
        print(nom, 'ja és de', cur.size); continue
    ca = np.array(cur)[:, :, 3] > 40
    ys, xs = np.where(ca)
    cb = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
    aw, ah = ab[2] - ab[0], ab[3] - ab[1]
    s = ((cb[2] - cb[0]) / aw + (cb[3] - cb[1]) / ah) / 2
    crop = art.crop(ab).resize((round(aw * s * S), round(ah * s * S)), Image.LANCZOS)
    out = Image.new('RGBA', (300 * S, 300 * S), (0, 0, 0, 0))
    out.alpha_composite(crop, (cb[0] * S, cb[1] * S))
    out.save(dest, 'WEBP', quality=88, method=6)
    print(dest, out.size)
