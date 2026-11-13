#!/usr/bin/env python3
"""Full de la celebració de l'Ineu (guanyar el partit de ping-pong) → assets/ineu/pingpong/ineu_celebracio.webp.

    python3 eines/fer_celebracio_ineu.py

Origen: art/pingpong2/ineu_celebracio_512.png (AutoSprite, 4x4 de 512, 16 fotogrames, generat entre la pose «a mig aixecar» i el salt exagerat).
Correcció d'un sol fotograma: al 8 (el punt més alt del salt) la punta de la pala quedava tallada per la vora de la cel·la; se substitueix pel 9 (gairebé el mateix moment, amb la pala sencera).
"""
from pathlib import Path
from PIL import Image

ARREL = Path(__file__).resolve().parent.parent
CEL = 512
SUBSTITUCIONS = {8: 9}          # fotograma tallat → fotograma que el substitueix

def main():
    im = Image.open(ARREL / 'art' / 'pingpong2' / 'ineu_celebracio_512.png').convert('RGBA')
    cel = lambda k: ((k % 4) * CEL, (k // 4) * CEL, (k % 4) * CEL + CEL, (k // 4) * CEL + CEL)
    for dest, font in SUBSTITUCIONS.items():
        im.paste(im.crop(cel(font)), cel(dest)[:2])
    im.save(ARREL / 'assets' / 'ineu' / 'pingpong' / 'ineu_celebracio.webp', 'WEBP', quality=90, alpha_quality=100, method=6)
    print('ok', SUBSTITUCIONS)

if __name__ == '__main__':
    main()
