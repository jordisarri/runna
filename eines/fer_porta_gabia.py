#!/usr/bin/env python3
"""Full de la porta de barrots del darrere del carruatge (cinemàtica final de l'Era): 12 fotogrames d'una porta que s'obre cap a fora.

Parteix de la fulla de barrots (art/objectes/porta_gabia/origen2.png, generada a AutoSprite/Runware, fons blanc) i la gira per codi, així cada fotograma queda net i transparent:
la porta del darrere es veu de costat, per tant tancada és gairebé una ratlla (de perfil) i, en girar sobre la frontissa (a l'esquerra, a la vora del carro), s'obre cap a la dreta
fins a mostrar-se de cara. L'amplada projectada és sin(angle); la vora lliure és més a prop (una mica més alta) mentre l'angle és petit (perspectiva).

    python eines/fer_porta_gabia.py
"""
import math
from pathlib import Path
import numpy as np
from PIL import Image

ARREL = Path(__file__).resolve().parent.parent
ORIGEN = ARREL / 'art' / 'objectes' / 'porta_gabia' / 'origen2.png'
DEST = ARREL / 'assets' / 'objectes' / 'porta_gabia.webp'
N, COLS = 12, 4
H, FW = 214, 164               # alçada de la fulla (px, a 2x) i amplada de cada fotograma
FH = int(H * 1.25)             # (el fotograma és una mica més alt, per a la perspectiva)

def sense_fons(im):
    a = np.array(im.convert('RGB')).astype(float)
    mn = a.min(axis=2)
    alfa = np.clip((245 - mn) / 25.0, 0, 1)                         # el blanc -> transparent (també el dels buits entre barrots)
    g = a.mean(axis=2, keepdims=True)
    a = (g + (a - g) * 0.55) * np.array([0.66, 0.62, 0.55])          # barrots més apagats (menys saturats i foscos), com els de la gàbia del carro
    rgba = np.dstack([np.clip(a, 0, 255), alfa * 255]).astype(np.uint8)
    out = Image.fromarray(rgba, 'RGBA')
    return out.crop(out.getbbox())

def coefs(sortida, entrada):
    A, B = [], []
    for (x, y), (u, v) in zip(sortida, entrada):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); B.append(u)
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y]); B.append(v)
    return np.linalg.solve(np.array(A, float), np.array(B, float))

def main():
    leaf = sense_fons(Image.open(ORIGEN))
    leaf = leaf.resize((int(leaf.width * H / leaf.height), H), Image.LANCZOS)
    w, h = leaf.size
    out = Image.new('RGBA', (FW * COLS, FH * ((N + COLS - 1) // COLS)), (0, 0, 0, 0))
    for i in range(N):
        t = i / (N - 1)
        e = t * t * (3 - 2 * t)                                          # entra i surt suaument
        ang = math.radians(6 + e * 94)                                   # de 6 graus (de perfil) a 100 (oberta, una mica passada)
        ample = max(3.0, FW * 0 + w * abs(math.sin(ang)))
        ample = min(ample, FW - 2)
        prox = 1 + 0.16 * max(0, math.cos(ang))                          # la vora lliure, més propera mentre és tancada
        h2 = h * prox
        cy = FH / 2
        # quadrilàter de sortida: vora esquerra (frontissa) alçada h, vora dreta alçada h2
        sort = [(0, cy - h / 2), (ample, cy - h2 / 2), (ample, cy + h2 / 2), (0, cy + h / 2)]
        entr = [(0, 0), (w, 0), (w, h), (0, h)]
        c = coefs(sort, entr)
        fr = leaf.transform((FW, FH), Image.PERSPECTIVE, tuple(c), Image.BICUBIC)
        out.paste(fr, ((i % COLS) * FW, (i // COLS) * FH))
    out.save(DEST, 'WEBP', quality=92, alpha_quality=100, method=6)
    print('Desat', DEST.relative_to(ARREL), out.size, 'fotograma', FW, 'x', FH, 'fulla', w, 'x', h)

if __name__ == '__main__':
    main()
