#!/usr/bin/env python3
"""Iguala la mida de cada idle de l'Ineu v2 a la del seu caminar (perquè en aturar-se no «creixi»).

    python3 eines/igualar_idle_ineu.py [gruix_contorn]

Executar-lo DESPRÉS de fer_ineu_v2.py i fer_ineu_v2_alt.py (llegeix les versions sense contorn d'art/ineu/v2/sense_contorn/).
Per cada direcció (excepte left/right: allà l'idle és la referència), es mesura (mediana dels 16 fotogrames) l'alçada, la superfície total i la superfície del cap (el 30 % de dalt) del caminar i de l'idle;
l'idle es reescala (peus a y=238, centrat a x=128) pel mig dels tres quocients i es torna a posar el contorn. Els caminars no es toquen.
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image
sys.path.insert(0, str(Path(__file__).resolve().parent))
from contorn_ineu import contorn
import fer_ineu_v2 as b

CEL, PEUS = b.CEL, b.PEUS
SENSE = b.SENSE
DIRS = b.DIRS
# Les vistes cap al nord es veien més petites que les altres (el cap i la massa del cos: 4-6 %), i el canvi des d'un costat era brusc: s'hi aplica un factor (caminar i idle). Màxim ~1,06: més amunt es tallaria el cap a dalt de la cel·la.
FACTOR_DIR = {'up': 1.05, 'northwest': 1.06, 'northeast': 1.06}

def mesura(im):
    R = []
    for i in range(16):
        a = np.array(im.crop(((i % 4) * CEL, (i // 4) * CEL, (i % 4) * CEL + CEL, (i // 4) * CEL + CEL)).split()[3]) > 24
        ys, xs = np.where(a); y0, y1 = ys.min(), ys.max(); h = y1 - y0 + 1
        R.append((h, a.sum(), a[y0:y0 + int(h * .3)].sum()))
    return np.median(np.array(R, float), 0)

def escala(im, k):
    out = Image.new('RGBA', im.size, (0, 0, 0, 0))
    for i in range(16):
        bx = ((i % 4) * CEL, (i // 4) * CEL)
        c = im.crop((bx[0], bx[1], bx[0] + CEL, bx[1] + CEL)); n = round(CEL * k)
        g = c.resize((n, n), Image.LANCZOS)
        cel = Image.new('RGBA', (CEL, CEL), (0, 0, 0, 0))
        ox, oy = round(128 - 128 * k), round(PEUS - PEUS * k)
        cel.paste(g, (ox, oy), g)
        out.paste(cel, bx)
    return out

def main():
    gruix = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    parelles = []
    pw_dest = {d: b.DEST / f'{d}.webp' for d in DIRS}
    for d in DIRS:
        if d in ('left', 'right'):
            continue        # als laterals l'idle és la referència: és el caminar el que s'ajusta (AJUST_CAMINAR a fer_ineu_v2_alt.py)
        parelles.append((d, SENSE / f'{d}.webp', SENSE / f'idle_{d}.webp', b.DEST / f'idle_{d}.webp'))
    for d, pw, pi, dest in parelles:
        w, i = Image.open(pw).convert('RGBA'), Image.open(pi).convert('RGBA')
        mw, mi = mesura(w), mesura(i)
        q = (mw[0] / mi[0], (mw[1] / mi[1]) ** .5, (mw[2] / mi[2]) ** .5)
        k = float(np.mean(q))
        f = FACTOR_DIR.get(d, 1.0)
        if f != 1.0:      # el caminar també s'engrandeix (des de la versió sense contorn) i es torna a posar el contorn
            contorn(escala(w, f), gruix).save(pw_dest[d], 'WEBP', quality=88, alpha_quality=100, method=6)
        contorn(escala(i, k * f), gruix).save(dest, 'WEBP', quality=88, alpha_quality=100, method=6)
        print(d.ljust(10), 'quocients alçada/superfície/cap', [round(x, 3) for x in q], '→ escala', round(k, 3), 'factor', f)

if __name__ == '__main__':
    main()
