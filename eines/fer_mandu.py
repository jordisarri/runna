"""
Passa els dibuixos de la Mandu a webp:
  - art/personatges/mandu.jpg i mandu_trencada.jpg  -> assets/personatges/*.webp (el personatge cos sencer, 52 px de joc)
  - art/retrats/mandu_retrat.jpg i mandu_trencada_retrat.jpg -> assets/retrats/mandu.webp i mandu_trencada.webp (els retrats dels diàlegs, 340 px)
    python eines/fer_mandu.py
Treu el fons blanc, neteja les escletxes blanques que queden entre els cabells i el contorn (zones ZONES_BLANC, en píxels de l'original de 687 × 1024),
i els deixa AL MATEIX llenç i a la mateixa escala (la unió dels dos), perquè en canviar de l'un a l'altre la nena no salti. Amplada de la Mandu al joc: 52 px (× 2).
"""
import os, sys
import numpy as np
from PIL import Image, ImageFilter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from treure_fons import treure_fons

ARREL = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
AMPLADA = 52
# (x0, y0, x1, y1): zones on el blanc clar que queda és de fons (entre els cabells i la vora), no del dibuix
ZONES_BLANC = [(40, 330, 135, 640), (535, 300, 600, 470)]


def neteja(im):
    a = np.array(im)
    rgb = a[:, :, :3].astype(int)
    clar = (rgb.min(axis=2) >= 188) & ((rgb.max(axis=2) - rgb.min(axis=2)) <= 28)
    zona = np.zeros(clar.shape, bool)
    for x0, y0, x1, y1 in ZONES_BLANC:
        zona[y0:y1, x0:x1] = True
    esborra = clar & zona
    # una mica més, per agafar la vora suau del que s'esborra
    from scipy import ndimage
    esborra = ndimage.binary_dilation(esborra, iterations=1) & (rgb.min(axis=2) >= 150) & zona
    a[:, :, 3] = np.where(esborra, 0, a[:, :, 3])
    return Image.fromarray(a)


# Zones de cada retrat (píxels de l'original de 1024 × 1024) on el blanc clar entre els cabells i la vora és de fons
ZONES_RETRAT = [(150, 520, 225, 800), (840, 470, 885, 640)]


def fer_retrats():
    imatges = {}
    for n, f in [('mandu', 'mandu_retrat'), ('mandu_trencada', 'mandu_trencada_retrat')]:
        im = treure_fons(Image.open(os.path.join(ARREL, 'art', 'retrats', f + '.jpg')).convert('RGB'))
        a = np.array(im)
        rgb = a[:, :, :3].astype(int)
        from scipy import ndimage
        zona = np.zeros(rgb.shape[:2], bool)
        for x0, y0, x1, y1 in ZONES_RETRAT:
            zona[y0:y1, x0:x1] = True
        clar = (rgb.min(axis=2) >= 188) & ((rgb.max(axis=2) - rgb.min(axis=2)) <= 30) & zona
        clar = ndimage.binary_dilation(clar, iterations=1) & (rgb.min(axis=2) >= 150) & zona
        a[:, :, 3] = np.where(clar, 0, a[:, :, 3])
        imatges[n] = Image.fromarray(a)
    caixes = [i.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox() for i in imatges.values()]
    unio = (min(c[0] for c in caixes), min(c[1] for c in caixes), max(c[2] for c in caixes), max(c[3] for c in caixes))
    k = 340 / max(unio[2] - unio[0], unio[3] - unio[1])               # placeholder
    return imatges, unio, k


if __name__ == '__main__':
    imatges, unio_r, k_r = fer_retrats()
    for n, im in imatges.items():
        c = im.crop(unio_r)
        c = c.resize((round(c.width * k_r), round(c.height * k_r)), Image.LANCZOS)
        c.save(os.path.join(ARREL, 'assets', 'retrats', n + '.webp'), 'WEBP', quality=88, method=6)
        print('retrat', n, c.size)
    imatges = {}
    for n in ['mandu', 'mandu_trencada']:
        imatges[n] = neteja(treure_fons(Image.open(os.path.join(ARREL, 'art', 'personatges', n + '.jpg')).convert('RGB')))
    caixes = [i.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox() for i in imatges.values()]
    unio = (min(c[0] for c in caixes), min(c[1] for c in caixes), max(c[2] for c in caixes), max(c[3] for c in caixes))
    ba = caixes[0]
    k = AMPLADA * 2 / (ba[2] - ba[0])                                  # l'escala la marca la nena sencera
    for n, im in imatges.items():
        c = im.crop(unio)
        c = c.resize((round(c.width * k), round(c.height * k)), Image.LANCZOS)
        c.save(os.path.join(ARREL, 'assets', 'personatges', n + '.webp'), 'WEBP', quality=85, method=6)
        print(n, c.size)
