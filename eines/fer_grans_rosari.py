#!/usr/bin/env python3
"""Els grans del rosari de vida del HUD (js/ui.js, actualitzarHUD) a partir d'UNA sola imatge de gra de fusta: art/ui/gra_rosari.png (fons blanc).

    python eines/fer_grans_rosari.py

Surten tres fitxers de 88 x 88 px (la mida dels grans del HUD a RES 2), amb el gra a dins, centrat i de 62 px de diàmetre:
  assets/ui/gra_ple.webp    el gra tal com és (vida plena)
  assets/ui/gra_mig.webp    la meitat esquerra encesa i la dreta apagada, amb una ratlla al mig (mig cor)
  assets/ui/gra_buit.webp   tot apagat (fusta fosca i seca) i esquerdat (sense vida)
El fil passa PER DARRERE dels grans (al joc, el cordó es dibuixa sota); per això els grans no porten cap forat.
Totes les boles fan servir la mateixa imatge; al HUD cada una va girada d'una manera diferent.
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, str(Path(__file__).resolve().parent))
from treure_fons import treure_fons

ARREL = Path(__file__).resolve().parent.parent
ORIGEN = ARREL / 'art' / 'ui' / 'gra_rosari.png'
DEST = ARREL / 'assets' / 'ui'
T, D = 88, 62          # mida de la textura i diàmetre del gra a dins


def apaga(im):
    """Fusta apagada: la mateixa veta i volum, però de marró fosc i sec (de #3e3126 a #6a5848, com el gra 'buit' de sempre)."""
    a = np.array(im).astype(float)
    lum = a[:, :, :3].mean(axis=2, keepdims=True)
    t = np.clip((lum - 90) / 130, 0, 1)
    fosc, clar = np.array([52, 40, 31]), np.array([112, 92, 76])
    a[:, :, :3] = fosc + (clar - fosc) * t
    return Image.fromarray(a.astype(np.uint8), 'RGBA')


def main():
    im = treure_fons(Image.open(ORIGEN).convert('RGBA'))
    bb = im.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
    gra = im.crop(bb).resize((D, D), Image.LANCZOS)
    cel = lambda g: (lambda t: (t.alpha_composite(g, ((T - D) // 2, (T - D) // 2)), t)[1])(Image.new('RGBA', (T, T), (0, 0, 0, 0)))
    ple = cel(gra)

    apagat = cel(apaga(gra))
    # mig: la meitat esquerra encesa; la dreta, apagada
    mig = apagat.copy()
    mig.alpha_composite(ple.crop((0, 0, T // 2, T)), (0, 0))
    d = ImageDraw.Draw(mig)
    d.line([(T // 2, (T - D) // 2 + 2), (T // 2, (T + D) // 2 - 2)], fill=(30, 14, 4, 190), width=2)

    # buit: apagat i esquerdat
    buit = apagat.copy()
    d = ImageDraw.Draw(buit)
    c = T // 2
    d.line([(c + 6, c - 26), (c, c - 12), (c + 8, c - 2), (c + 2, c + 10)], fill=(10, 6, 2, 215), width=3, joint='curve')
    # (les esquerdes no surten de la bola: es retalla amb la seva silueta)
    for nom, im2 in (('gra_ple', ple), ('gra_mig', mig), ('gra_buit', buit)):
        a = np.array(im2); a[:, :, 3] = np.minimum(a[:, :, 3], np.array(ple)[:, :, 3]); im2 = Image.fromarray(a, 'RGBA')
        im2.save(DEST / f'{nom}.webp', 'WEBP', quality=92, alpha_quality=100, method=6)
        print(DEST / f'{nom}.webp', im2.size)


if __name__ == '__main__':
    main()
