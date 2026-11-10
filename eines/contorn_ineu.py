#!/usr/bin/env python3
"""Contorn negre (estil còmic) als fulls de caminar d'aturat (idle) i d'atac de l'Ineu, i a les imatges d'alçar l'arma (assets/ineu/). NO a la tarota (tarota.webp, tarota_gran.webp).

    python3 eines/contorn_ineu.py            posa el contorn (guarda abans els originals a art/ineu_caminar/sense_contorn/)
    python3 eines/contorn_ineu.py --treu     torna als originals sense contorn
    python3 eines/contorn_ineu.py --gruix 3  canvia el gruix (en píxels de la cel·la de 256; per defecte 1)

Sempre es parteix de l'original sense contorn, així es pot repetir amb un altre gruix sense que s'acumuli. Cada cel·la és de 256x256 i l'Ineu hi deixa
com a mínim 5 px de marge, així que fins a ~4 px de contorn cap sense tallar-se. Cal que eines/convertir_webp.js no es torni a executar sobre l'Ineu sense tornar a posar el contorn. Després cal pujar el «?v=» dels fulls a js/assets.js (i index.html si cal).
"""
import sys, shutil
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

ARREL = Path(__file__).resolve().parent.parent
FULLS = ['down', 'up', 'left', 'right', 'southwest', 'southeast', 'northwest', 'northeast',          # caminar
         'idle_down', 'idle_up', 'idle_right', 'idle_southeast', 'idle_northeast',                      # aturat
         'atac_down', 'atac_up', 'atac_left', 'atac_right', 'atac_southwest', 'atac_southeast', 'atac_northwest', 'atac_northeast']   # atac
SOLTS = ['aixeca_espasa', 'aixeca_basto', 'aixeca_buit', 'aixeca_tiler']      # imatges soltes (l'Ineu alçant l'arma): retallades justes, s'hi afegeix un marge del gruix
CEL = 256
ORIGINALS = ARREL / 'art' / 'ineu_caminar' / 'sense_contorn'

def contorn(im, gruix):
    a = np.array(im.convert('RGBA'))
    out = np.zeros_like(a)
    alfa = a[:, :, 3]
    H, W = alfa.shape
    for r in range(H // CEL):
        for c in range(W // CEL):
            ys, xs = slice(r * CEL, (r + 1) * CEL), slice(c * CEL, (c + 1) * CEL)
            cel = a[ys, xs]
            dins = cel[:, :, 3] > 24
            dist = ndimage.distance_transform_edt(~dins)                 # distància a la silueta
            fora = np.clip(gruix + 0.5 - dist, 0, 1)                      # 1 dins el gruix, vora suau d'un píxel
            vora = np.zeros_like(cel)                                     # negre (0,0,0) amb l'alfa del contorn
            vora[:, :, 3] = (fora * 255).astype(np.uint8)
            # el dibuix original per sobre (composició normal alfa)
            base = Image.fromarray(vora, 'RGBA'); top = Image.fromarray(cel, 'RGBA')
            base.alpha_composite(top)
            out[ys, xs] = np.array(base)
    return Image.fromarray(out, 'RGBA')

def contorn_solt(im, gruix):
    # una sola imatge: se li afegeix un marge del gruix a cada costat i es fa el mateix
    a = im.convert('RGBA'); g = gruix + 1
    gran = Image.new('RGBA', (a.width + 2 * g, a.height + 2 * g), (0, 0, 0, 0)); gran.alpha_composite(a, (g, g))
    arr = np.array(gran)
    dist = ndimage.distance_transform_edt(~(arr[:, :, 3] > 24))
    vora = np.zeros_like(arr); vora[:, :, 3] = (np.clip(gruix + 0.5 - dist, 0, 1) * 255).astype(np.uint8)
    base = Image.fromarray(vora, 'RGBA'); base.alpha_composite(gran)
    return base

def main():
    args = sys.argv[1:]
    gruix = int(args[args.index('--gruix') + 1]) if '--gruix' in args else 1
    ORIGINALS.mkdir(parents=True, exist_ok=True)
    for f in FULLS + SOLTS:
        dest = ARREL / 'assets' / 'ineu' / (f + '.webp')
        copia = ORIGINALS / (f + '.webp')
        if '--treu' in args:
            if not copia.exists(): print('No hi ha original guardat de', f); continue
            shutil.copyfile(copia, dest); print('Restaurat', dest.relative_to(ARREL)); continue
        if not copia.exists(): shutil.copyfile(dest, copia)                # primer cop: es guarda l'original (sense contorn)
        im = Image.open(copia)
        (contorn_solt(im, gruix) if f in SOLTS else contorn(im, gruix)).save(dest, 'WEBP', quality=88, alpha_quality=100, method=6)
        print('Contorn de', gruix, 'px a', dest.relative_to(ARREL))

main()
