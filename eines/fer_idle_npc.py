#!/usr/bin/env python3
"""Converteix els fulls d'idle frontal dels NPC (generats amb AutoSprite, 8 fotogrames) a assets/personatges/<clau>_idle.webp.

    python3 eines/fer_idle_npc.py joaneta     (només aquests; sense arguments, tots els que hi hagi a art/personatges/idle/<clau>_idle_sheet.png)

Per cada NPC: es treu la caixa comuna del personatge a tots els fotogrames, s'escala perquè l'alçada sigui la MATEIXA que la del dibuix fix
(assets/personatges/<clau>.webp: així l'animació i el dibuix fix es veuen igual de grossos) i es deixen tots els fotogrames en una fila. Mostra
la mida de cel·la per posar-la a NPC_IDLE (js/assets.js).
"""
import sys, json
from pathlib import Path
import numpy as np
from PIL import Image

ARREL = Path(__file__).resolve().parent.parent
ENTRADA = ARREL / 'art' / 'personatges' / 'idle'
CLAUS = ['pomers', 'julius', 'jusef', 'germa_aldreu', 'pare_jorda', 'pare_daimiel', 'joaneta']
FOTOGRAMES = {'joaneta': 16}      # per defecte 8 (3 columnes); la Joaneta en té 16 (4 columnes: el full és de 1024)

def main():
    res = {}
    for k in (sys.argv[1:] or CLAUS):
        f = ENTRADA / (k + '_idle_sheet.png')
        if not f.exists(): print('Falta', f.relative_to(ARREL)); continue
        sheet = Image.open(f).convert('RGBA')
        cel = 256
        n = FOTOGRAMES.get(k, 8)
        COLS = sheet.width // cel
        fots = [sheet.crop(((i % COLS) * cel, (i // COLS) * cel, (i % COLS) * cel + cel, (i // COLS) * cel + cel)) for i in range(n)]
        bbs = [im.split()[3].point(lambda v: 255 if v > 24 else 0).getbbox() for im in fots]
        x0 = min(b[0] for b in bbs); y0 = min(b[1] for b in bbs); x1 = max(b[2] for b in bbs); y1 = max(b[3] for b in bbs)
        alt_med = float(np.median([b[3] - b[1] for b in bbs]))
        fix = Image.open(ARREL / 'assets' / 'personatges' / (k + '.webp'))
        s = fix.height / alt_med                                           # mateixa alçada de personatge que el dibuix fix
        fw, fh = round((x1 - x0) * s), round((y1 - y0) * s)
        out = Image.new('RGBA', (fw * n, fh), (0, 0, 0, 0))
        for i, im in enumerate(fots):
            c = im.crop((x0, y0, x1, y1)).resize((fw, fh), Image.LANCZOS)
            out.paste(c, (i * fw, 0))
        dest = ARREL / 'assets' / 'personatges' / (k + '_idle.webp')
        out.save(dest, 'WEBP', quality=88, alpha_quality=100, method=6)
        res[k] = {'w': fw, 'h': fh, 'n': n}
        print(k, 'cel·la', fw, 'x', fh, '(fix', fix.size, ')', dest.name)
    print(json.dumps(res))

main()
