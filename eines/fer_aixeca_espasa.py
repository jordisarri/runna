#!/usr/bin/env python3
"""Refà el gràfic de l'Ineu alçant l'espasa (assets/ineu/aixeca_espasa.webp) a partir de l'original art/ineu/aixeca/aixeca_espasa.jpg.

El fons blanc es treu emplenant des de les vores, però el reflex clar de la fulla (el brillant de l'acer, gairebé blanc) NO és fons: abans el
reflex tocava el fons per un canal fi i es treia també (la fulla quedava transparent). Aquí només es treu el fons de debò: el que queda separat del dibuix
per una franja més ampla que RADI px (els canals estrets no compten).

    python3 eines/fer_aixeca_espasa.py [amplada_en_pixels]       (per defecte 500: es mostra a l'escena del Dolmen a 112 px d'ample, vegeu AMPLE_AIXECA a js/zones/oest.js)

Escriu la versió SENSE contorn a art/ineu_caminar/sense_contorn/aixeca_espasa.webp; després cal passar eines/contorn_ineu.py (que la torna a escriure a assets/ineu/ amb contorn).
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

ARREL = Path(__file__).resolve().parent.parent
FONT = ARREL / 'art' / 'ineu' / 'aixeca' / 'aixeca_espasa.jpg'
DEST = ARREL / 'art' / 'ineu_caminar' / 'sense_contorn' / 'aixeca_espasa.webp'
RADI = 14

def main():
    ample = int(sys.argv[1]) if len(sys.argv) > 1 else 500
    rgb = np.array(Image.open(FONT).convert('RGB')).astype(np.int16)
    mn, mx = rgb.min(axis=2), rgb.max(axis=2)
    blanc = (mn >= 228) & ((mx - mn) < 28)
    etiq, n = ndimage.label(blanc)
    vora = set(etiq[0, :]) | set(etiq[-1, :]) | set(etiq[:, 0]) | set(etiq[:, -1]); vora.discard(0)
    fons0 = np.isin(etiq, list(vora))
    # només el fons ample: s'erosiona i es torna a fer créixer dins del fons original (els canals fins cap al reflex de la fulla desapareixen)
    nucli = ndimage.binary_erosion(fons0, iterations=RADI)
    fons = ndimage.binary_dilation(nucli, iterations=RADI + 1) & fons0
    # forats petits dins el dibuix (espurnes del reflex) no són fons: es tapen; i només es conserva la peça gran (res de taques soltes)
    et2, n2 = ndimage.label(fons)
    mides = ndimage.sum(fons, et2, range(1, n2 + 1))
    fons = np.isin(et2, [i + 1 for i, m in enumerate(mides) if m > 4000])
    et3, n3 = ndimage.label(~fons)
    mides3 = ndimage.sum(~fons, et3, range(1, n3 + 1))
    fons = ~np.isin(et3, [int(np.argmax(mides3)) + 1])
    alfa = np.where(fons, 0, 255).astype(np.uint8)
    # vora suau: píxels clars que toquen el fons es tornen semitransparents (com treureFonsBlanc del joc)
    toca = ndimage.binary_dilation(fons, structure=np.ones((3, 3))) & ~fons
    l = mn
    suau = np.clip((255 - l) / 85 * 255, 0, 255).astype(np.uint8)
    alfa = np.where(toca & (l > 170), suau, alfa)
    img = np.dstack([rgb.astype(np.uint8), alfa])
    ys, xs = np.where(alfa > 24)
    y0, y1, x0, x1 = max(0, ys.min() - 2), min(img.shape[0], ys.max() + 3), max(0, xs.min() - 2), min(img.shape[1], xs.max() + 3)
    im = Image.fromarray(img[y0:y1, x0:x1], 'RGBA')
    h = round(im.height * ample / im.width)
    im = im.resize((ample, h), Image.LANCZOS)
    DEST.parent.mkdir(parents=True, exist_ok=True)
    im.save(DEST, 'WEBP', quality=90, alpha_quality=100, method=6)
    print('Escrit', DEST.relative_to(ARREL), im.size)

main()
