#!/usr/bin/env python3
"""Fulls de caminar dels NPC (cap a la dreta; el joc els gira amb flipX) a partir dels fulls d'AutoSprite (iso_walk_right: cel·les de 320, 3 columnes, 8 fotogrames).

    python eines/fer_camina_npc.py FULL.png NOM [--parella]

Surt assets/personatges/<NOM>_camina.webp: 8 fotogrames en 4 columnes x 2 files, tots de la mateixa mida (la dels peus a baix, que és l'origen dels NPC). El personatge es redueix
fins que fa la MATEIXA alçada que el seu dibuix estàtic (assets/personatges/<NOM>.webp), perquè en canviar de l'estàtic al caminar no canviï de mida (npcVa fa servir l'escala de l'estàtic).
--parella: les Venerables Sàvies són dues velletes agafades del braç i AutoSprite només en fa una (la del vestit blau): la segona es fa de la mateixa caminada, desfasada mig cicle,
amb el vestit burgundy i el cabell blanc, una mica més baixa, i s'enganxen de braç.
Els originals dels fulls són a art/personatges/caminar/.
"""
import sys
import colorsys
from pathlib import Path
import numpy as np
from PIL import Image

ARREL = Path(__file__).resolve().parent.parent
CEL, COLS, N = 320, 3, 8

def fotogrames(path):
    im = Image.open(path).convert('RGBA')
    return [im.crop(((i % COLS) * CEL, (i // COLS) * CEL, (i % COLS) * CEL + CEL, (i // COLS) * CEL + CEL)) for i in range(N)]

def bbox(im):
    a = np.array(im)[:, :, 3] > 24
    ys, xs = np.where(a)
    return xs.min(), xs.max(), ys.min(), ys.max()

def recolora(im):
    """Vestit blau-gris -> burgundy, cabell gris -> blanc (només a la part alta)."""
    a = np.array(im).astype(float) / 255
    h, w = a.shape[:2]
    x0, x1, y0, y1 = bbox(im)
    hsv = np.zeros((h, w, 3))
    for y in range(h):
        for x in range(w):
            if a[y, x, 3] > 0.1:
                hsv[y, x] = colorsys.rgb_to_hsv(*a[y, x, :3])
    out = a.copy()
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            if a[y, x, 3] <= 0.1:
                continue
            hh, ss, vv = hsv[y, x]
            if 0.5 < hh < 0.72 and ss > 0.08:                       # blau-gris del vestit
                r, g, b = colorsys.hsv_to_rgb(0.985, min(1, 0.45 + ss), min(1, vv * 1.05 + 0.1))
                out[y, x, :3] = (r, g, b)
            elif ss < 0.14 and 0.4 < vv < 0.92 and y < y0 + (y1 - y0) * 0.3:   # cabell gris
                out[y, x, :3] = np.clip(0.88 + (vv - 0.65) * 0.3, 0.8, 0.97)             # blanc lluent (amb una mica d'ombra), sense el soroll de la trama grisa
    return Image.fromarray((out * 255).astype(np.uint8))

def main():
    args = [x for x in sys.argv[1:] if not x.startswith('--')]
    segona = next((x.split('=', 1)[1] for x in sys.argv if x.startswith('--segona=')), None)        # full d'AutoSprite de la segona veneranda (si no, es recolora la primera)
    parella = '--parella' in sys.argv or segona is not None
    full, nom = args[0], args[1]
    est = Image.open(ARREL / 'assets' / 'personatges' / f'{nom}.webp').convert('RGBA')
    ea = np.array(est)[:, :, 3] > 10
    ys, xs = np.where(ea)
    alt_est, ample_est = ys.max() - ys.min() + 1, xs.max() - xs.min() + 1
    frs = fotogrames(full)
    boxes = [bbox(f) for f in frs]
    alt_f = float(np.median([b[3] - b[2] + 1 for b in boxes]))
    esc = alt_est / alt_f if not parella else alt_est / alt_f                  # la veneranda de blau fa tota l'alçada de l'estàtic
    # retalla cada fotograma al seu cos i escala; la línia de peus (mediana) es manté perquè el rebot del caminar es vegi
    cos = []
    for f, b in zip(frs, boxes):
        c = f.crop((b[0], b[2], b[1] + 1, b[3] + 1))
        cos.append((c.resize((max(1, round(c.width * esc)), max(1, round(c.height * esc))), Image.LANCZOS), b))
    peus_med = float(np.median([b[3] for b in boxes])) * esc
    cx_med = float(np.median([(b[0] + b[1]) / 2 for b in boxes])) * esc
    if parella:
        if segona:
            frs2 = fotogrames(segona); boxes2 = [bbox(f) for f in frs2]
            alt2 = float(np.median([b[3] - b[2] + 1 for b in boxes2]))
            esc2 = alt_est / alt2                                               # (la segona veneranda es normalitza a la mateixa alçada i després es fa una mica més baixa)
            rec = frs2
        else:
            rec = [recolora(f) for f in frs]; boxes2 = boxes; esc2 = esc
        cos2 = []
        for k in range(N):
            f2 = rec[(k + N // 2) % N]; b2 = boxes2[(k + N // 2) % N]
            c = f2.crop((b2[0], b2[2], b2[1] + 1, b2[3] + 1))
            e2 = esc2 * 0.92                                                   # la de vermell és una mica més baixa
            cos2.append((c.resize((max(1, round(c.width * e2)), max(1, round(c.height * e2))), Image.LANCZOS), b2))
    # mida de la cel·la
    amples = []
    for k, (c, b) in enumerate(cos):
        w = c.width
        if parella: w = c.width + cos2[k][0].width - round(0.16 * c.width)
        amples.append(w)
    W = int(max(amples)) + 6
    H = int(round(alt_est)) + 10
    out = Image.new('RGBA', (W * 4, H * 2), (0, 0, 0, 0))
    for k, (c, b) in enumerate(cos):
        cel = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        base_y = H - 1 - round(peus_med - (b[3] * esc))                         # peus d'aquest fotograma respecte la línia comuna
        if not parella:
            x = round(W / 2 - c.width / 2 - (cx_med - (b[0] + b[1]) / 2 * esc) * 0 )
            cel.alpha_composite(c, (max(0, x), max(0, base_y - c.height + 1)))
        else:
            c2 = cos2[k][0]
            tot = c.width + c2.width - round(0.16 * c.width)
            x0 = (W - tot) // 2
            cel.alpha_composite(c, (x0, max(0, base_y - c.height + 1)))
            cel.alpha_composite(c2, (x0 + c.width - round(0.16 * c.width), max(0, base_y - c2.height + 1)))
        out.alpha_composite(cel, ((k % 4) * W, (k // 4) * H))
    dest = ARREL / 'assets' / 'personatges' / f'{nom}_camina.webp'
    out.save(dest, 'WEBP', quality=90, alpha_quality=100, method=6)
    print(nom, 'cel·la', W, 'x', H, 'estàtic', ample_est, 'x', alt_est, '->', dest.name)

if __name__ == '__main__':
    main()
