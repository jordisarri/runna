#!/usr/bin/env python3
"""Contorn negre d'1 px de joc a les imatges soltes de les armes (assets/armes/: bastó, branca del Til·ler, espasa de Runna).

    python3 eines/contorn_armes.py          posa el contorn (guarda abans els originals a art/armes/sense_contorn/)
    python3 eines/contorn_armes.py --treu   torna als originals

Les armes es dibuixen molt més petites que la imatge (el bastó fa 164 px i es mostra a 24 px d'ample), així que el gruix es calcula en píxels de la imatge perquè
a pantalla siguin ~1 px (gruix = amplada de la imatge / amplada de joc). Sempre es parteix de l'original sense contorn: es pot repetir sense acumular-lo.
Després cal pujar el «?v=» d'assets.js.
"""
import sys, shutil
from pathlib import Path
from PIL import Image
sys.path.insert(0, str(Path(__file__).resolve().parent))
from contorn_ineu import contorn_solt

ARREL = Path(__file__).resolve().parent.parent
ORIG = ARREL / 'art' / 'armes' / 'sense_contorn'
AMPLADA_JOC = {'basto': 24, 'branca_tiler': 28, 'espasa': 28}      # sincronitzat amb l'«amplada» de js/assets.js

def main():
    ORIG.mkdir(parents=True, exist_ok=True)
    for n, aj in AMPLADA_JOC.items():
        dest, copia = ARREL / 'assets' / 'armes' / (n + '.webp'), ORIG / (n + '.webp')
        if '--treu' in sys.argv:
            if copia.exists(): shutil.copyfile(copia, dest); print('Restaurat', n)
            continue
        if not copia.exists(): shutil.copyfile(dest, copia)
        im = Image.open(copia); g = max(1, round(im.width / aj))
        contorn_solt(im, g).save(dest, 'WEBP', quality=90, alpha_quality=100, method=6)
        print(n, 'contorn de', g, 'px de la imatge')

if __name__ == '__main__':
    main()
