#!/usr/bin/env python3
"""Treu les taques blanques de fons que queden dins del gràfic de l'Ineu alçant Runna (assets/ineu/aixeca/aixeca_espasa.webp): el fons blanc de l'original no s'havia tret d'uns
forats entre el puny, la guarda i la màniga (queden tancats pel contorn fosc i no toquen la vora). Només es buiden les taques gairebé blanques que són dins de les caixes
TAQUES (mesurades sobre el gràfic de 506 d'ample); el reflex de la fulla, els ulls i el coll de la camisa no es toquen.

    python3 eines/netejar_aixeca.py
"""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

ARREL = Path(__file__).resolve().parent.parent
FITXER = ARREL / 'assets' / 'ineu' / 'aixeca' / 'aixeca_espasa.webp'
TAQUES = [(36, 62, 428, 490), (68, 80, 334, 344), (122, 132, 364, 376)]        # (x0, x1, y0, y1): la falca entre la màniga i l'empunyadura, i dues escletxes entre el puny i la guarda
BLANC = 218

def main():
    im = Image.open(FITXER).convert('RGBA'); a = np.array(im)
    mn, mx = a[:, :, :3].min(axis=2), a[:, :, :3].max(axis=2)
    blanc = (a[:, :, 3] > 20) & (mn >= BLANC) & ((mx.astype(int) - mn) < 36)
    zona = np.zeros_like(blanc)
    for x0, x1, y0, y1 in TAQUES: zona[y0:y1 + 1, x0:x1 + 1] = True
    cand = blanc & zona
    cand = ndimage.binary_dilation(cand, iterations=2) & (mn >= 150) & ((mx.astype(int) - mn) < 60)      # la vora suau del blanc, sense menjar-se el contorn fosc
    cand &= ndimage.binary_dilation(zona, iterations=3)
    a[cand, 3] = 0
    print('píxels buidats:', int(cand.sum()))
    Image.fromarray(a, 'RGBA').save(FITXER, 'WEBP', quality=90, alpha_quality=100, method=6)

if __name__ == '__main__':
    main()
