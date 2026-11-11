#!/usr/bin/env python3
"""La Pianista tocant l'orgue, d'esquena (AutoSprite) → assets/personatges/pianista_idle.webp (full 4x4) i pianista_esquena.webp (dibuix fix = fotograma 0).

    python3 eines/fer_pianista_orgue.py [ALÇADA_JOC]

Origen: art/personatges/idle/pianista_orgue_sheet.png (4x4 de 512, 16 fotogrames). Es retalla a la caixa comuna de tots els fotogrames i s'escala perquè la figura
(amb el banc) faci ALÇADA_JOC px de joc (per defecte 150; el joc va a RES=2 píxels per píxel de joc). Mostra la mida de cel·la per posar-la a NPC_IDLE (js/assets.js).
"""
import sys, json
from pathlib import Path
from PIL import Image

ARREL = Path(__file__).resolve().parent.parent
RES = 2
CORT = 372      # y (a la cel·la de 512) a partir de la qual s'esborra el banc

def main():
    alt_joc = float(sys.argv[1]) if len(sys.argv) > 1 else 150
    sheet = Image.open(ARREL / 'art' / 'personatges' / 'idle' / 'pianista_orgue_sheet.png').convert('RGBA')
    cel, n, cols = 512, 16, 4
    fots = [sheet.crop(((i % cols) * cel, (i // cols) * cel, (i % cols) * cel + cel, (i // cols) * cel + cel)) for i in range(n)]
    # Es treu el banc del dibuix (la Pianista seu al banc de l'orgue del joc): es talla just per sota de les cames, a la vora de dalt del seient
    for f in fots: f.paste((0, 0, 0, 0), (0, CORT, cel, cel))
    bbs = [f.split()[3].point(lambda v: 255 if v > 24 else 0).getbbox() for f in fots]
    x0 = min(b[0] for b in bbs); y0 = min(b[1] for b in bbs); x1 = max(b[2] for b in bbs); y1 = max(b[3] for b in bbs)
    s = alt_joc * RES / (y1 - y0)
    fw, fh = round((x1 - x0) * s), round((y1 - y0) * s)
    out = Image.new('RGBA', (fw * cols, fh * (n // cols)), (0, 0, 0, 0))
    petits = []
    for i, f in enumerate(fots):
        c = f.crop((x0, y0, x1, y1)).resize((fw, fh), Image.LANCZOS)
        petits.append(c)
        out.paste(c, ((i % cols) * fw, (i // cols) * fh))
    out.save(ARREL / 'assets' / 'personatges' / 'pianista_idle.webp', 'WEBP', quality=88, alpha_quality=100, method=6)
    petits[0].save(ARREL / 'assets' / 'personatges' / 'pianista_esquena.webp', 'WEBP', quality=90, alpha_quality=100, method=6)
    print(json.dumps({'w': fw, 'h': fh, 'n': n, 'amplada_joc': fw / RES}))

main()
