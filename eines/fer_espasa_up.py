#!/usr/bin/env python3
"""Full font de l'atac d'espasa cap amunt (vista d'esquena) amb la fulla sencera: art/ineu/atac_arma/espasa_up_fix/up.png.

    python eines/fer_espasa_up.py && python eines/fer_atac_arma.py espasa:up

A la 2a generació d'AutoSprite l'espasa d'esquena queda amagada o tallada per la vora del fotograma (la fulla surt de la cel·la). Aquí es parteix del fotograma 2 (braç alçat,
fulla ben visible), s'esborra la fulla (píxels d'acer) i es redibuixa amb l'art real (art/armes/sense_contorn/espasa.webp), girant-la al voltant de la mà de dreta a esquerra
(cinc posicions). El cos es redueix perquè hi hagi lloc per la fulla; la fulla va DARRERE del cos (el cop va cap endavant, cap a dins de la pantalla).
Els fotogrames 5-15 són el cos sense espasa (només serveixen perquè eines/fer_atac_arma.py en mesura l'escala).
"""
from pathlib import Path
import numpy as np
from PIL import Image

ARREL = Path(__file__).resolve().parent.parent
SRC = 384
REDUCCIO = 0.78                    # el cos es fa més petit dins del fotograma per deixar lloc a la fulla
LLARG = 150                        # llargada de la fulla en píxels del fotograma
ANGLES = [-25, -62, -100, -138, -165]    # direcció de la fulla (graus, 0 = dreta, -90 = amunt): de dreta a esquerra sobre el cap

def fot(im, i): return im.crop(((i % 4) * SRC, (i // 4) * SRC, (i % 4) * SRC + SRC, (i // 4) * SRC + SRC))

def acer(f):
    a = np.array(f).astype(int); r, g, b, al = a[:, :, 0], a[:, :, 1], a[:, :, 2], a[:, :, 3]
    mx = np.maximum(np.maximum(r, g), b); mn = np.minimum(np.minimum(r, g), b)
    return (al > 200) & ((mx - mn) < 60) & (b >= r - 4) & (mx > 110)

def dilata(m, n=2):
    for _ in range(n):
        p = np.pad(m, 1); m = m | p[:-2, 1:-1] | p[2:, 1:-1] | p[1:-1, :-2] | p[1:-1, 2:]
    return m

def fulla_art():
    a = Image.open(ARREL / 'art/armes/sense_contorn/espasa.webp').convert('RGBA')
    ample = (np.array(a)[:, :, 3] > 10).sum(axis=1)
    yg = next(y for y in range(len(ample)) if ample[y] > 30)          # primera fila de la guarda: per sobre és la fulla
    return a.crop((0, 0, a.width, yg + 4))

def main():
    im = Image.open(ARREL / 'art/ineu/atac_arma/espasa/up.png').convert('RGBA')
    base = fot(im, 2); m = acer(base); ys, xs = np.where(m)
    # extrem de la mà (el de més a la dreta) i punta (el més a l'esquerra) de la fulla vista
    mà = (xs.max(), ys[xs == xs.max()].mean()); punta = (xs.min(), ys[xs == xs.min()].mean())
    cos = np.array(base); cos[dilata(m, 2)] = 0
    # també el contorn fosc de la fulla (no és d'acer): tot el que cau en un passadís al voltant de la fulla, llevat dels 30 px del costat de la mà (guarda i mà)
    v = np.array([punta[0] - mà[0], punta[1] - mà[1]], float); llarg = np.hypot(*v); v /= llarg
    yy, xx = np.mgrid[0:SRC, 0:SRC]; rx, ry = xx - mà[0], yy - mà[1]
    t = rx * v[0] + ry * v[1]; dist = np.abs(rx * v[1] - ry * v[0])
    cos[((t > 36) & (t < llarg + 14) & (dist < 6.5)) | ((t > 100) & (t < llarg + 16) & (dist < 13))] = 0       # a la punta (lluny del cap) el passadís és més ample
    cos = Image.fromarray(cos)
    art = fulla_art(); k = LLARG / art.height; art = art.resize((max(1, round(art.width * k)), LLARG), Image.LANCZOS)
    cos_net = fot(im, 12)
    def situa(fotograma):
        s = fotograma.resize((round(SRC * REDUCCIO), round(SRC * REDUCCIO)), Image.LANCZOS)
        c = Image.new('RGBA', (SRC, SRC), (0, 0, 0, 0)); dx, dy = (SRC - s.width) // 2, SRC - s.height - 4
        c.alpha_composite(s, (dx, dy)); return c, dx, dy
    out = Image.new('RGBA', (SRC * 4, SRC * 4), (0, 0, 0, 0))
    for i in range(16):
        if i < len(ANGLES):
            c, dx, dy = situa(cos)
            px, py = dx + mà[0] * REDUCCIO, dy + mà[1] * REDUCCIO                       # pivot (la mà) al fotograma nou
            big = Image.new('RGBA', (2 * LLARG + 80, 2 * LLARG + 80), (0, 0, 0, 0)); cx = cy = LLARG + 40
            big.alpha_composite(art, (cx - art.width // 2, cy - art.height))              # base de la fulla al centre, apuntant amunt
            big = big.rotate(-90 - ANGLES[i], resample=Image.BICUBIC)                  # PIL gira en sentit antihorari
            capa = Image.new('RGBA', (SRC, SRC), (0, 0, 0, 0)); capa.paste(big, (round(px - cx), round(py - cy)), big)
            capa.alpha_composite(c); fr = capa                                          # fulla darrere, cos al davant
        else:
            fr, _, _ = situa(cos_net)
        out.alpha_composite(fr, ((i % 4) * SRC, (i // 4) * SRC))
    d = ARREL / 'art/ineu/atac_arma/espasa_up_fix'; d.mkdir(exist_ok=True); out.save(d / 'up.png')
    print('mà', mà, 'punta', punta, '->', d / 'up.png')

if __name__ == '__main__':
    main()
