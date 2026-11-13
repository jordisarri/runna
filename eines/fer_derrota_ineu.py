#!/usr/bin/env python3
"""Full de la derrota de l'Ineu (perdre el partit de ping-pong) → assets/ineu/pingpong/ineu_derrota.webp.

    python3 eines/fer_derrota_ineu.py

Origen: art/pingpong2/ineu_derrota_512.png (AutoSprite, 4x4 de 512, 16 fotogrames): de la pose «cap cot» (art/pingpong2/derrota_A.png)
a la de genolls plorant (derrota_B.png). Es fa servir a partir del fotograma 3.
"""
from pathlib import Path
from PIL import Image

ARREL = Path(__file__).resolve().parent.parent

def main():
    im = Image.open(ARREL / 'art' / 'pingpong2' / 'ineu_derrota_512.png').convert('RGBA')
    im.save(ARREL / 'assets' / 'ineu' / 'pingpong' / 'ineu_derrota.webp', 'WEBP', quality=90, alpha_quality=100, method=6)
    print('ok', im.size)

if __name__ == '__main__':
    main()
