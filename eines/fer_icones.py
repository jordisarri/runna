"""
Fa les icones de l'aplicació instal·lable (PWA) a assets/pwa/ a partir del retrat de l'Ineu (art/retrats/ineu_retrat.jpg):
    python eines/fer_icones.py
Surten: icona-192.png, icona-512.png (es veuen tal qual), icona-maskable-512.png (amb més marge: Android la retalla en cercle o en el que vulgui),
apple-touch-icon.png (180) i favicon.png (64). Cal Pillow.
"""
import os, sys
from PIL import Image, ImageDraw, ImageFilter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from treure_fons import treure_fons

ARREL = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
ORIGEN = os.path.join(ARREL, 'art', 'retrats', 'ineu_retrat.jpg')
SORTIDA = os.path.join(ARREL, 'assets', 'pwa')


def fons(mida):
    """Un degradat radial càlid (pergamí fosc, com el joc) amb una vora d'ombra."""
    g = Image.new('RGB', (mida, mida), (16, 12, 9))
    d = ImageDraw.Draw(g)
    c = mida / 2
    for r in range(int(mida * 0.75), 0, -2):
        t = r / (mida * 0.75)
        col = (int(74 - 58 * t), int(46 - 34 * t), int(26 - 17 * t))
        d.ellipse([c - r, c - r * 0.95, c + r, c + r * 1.05], fill=col)
    return g.filter(ImageFilter.GaussianBlur(mida / 60))


def icona(ineu, mida, alcada):
    im = fons(mida).convert('RGBA')
    h = int(mida * alcada)
    w = int(ineu.width * h / ineu.height)
    r = ineu.resize((w, h), Image.LANCZOS)
    ombra = Image.new('RGBA', im.size, (0, 0, 0, 0))
    ombra.paste((0, 0, 0, 120), ((mida - w) // 2 + mida // 60, (mida - h) // 2 + mida // 40 + mida // 25), r.split()[3])
    im.alpha_composite(ombra.filter(ImageFilter.GaussianBlur(mida / 50)))
    im.alpha_composite(r, ((mida - w) // 2, (mida - h) // 2 + mida // 25))
    return im.convert('RGB')


if __name__ == '__main__':
    os.makedirs(SORTIDA, exist_ok=True)
    ineu = treure_fons(Image.open(ORIGEN))
    caixa = ineu.getbbox()
    ineu = ineu.crop(caixa)
    for nom, mida, alcada in [('icona-512.png', 512, 0.78), ('icona-192.png', 192, 0.78), ('icona-maskable-512.png', 512, 0.58),
                              ('apple-touch-icon.png', 180, 0.78), ('favicon.png', 64, 0.82)]:
        icona(ineu, mida, alcada).save(os.path.join(SORTIDA, nom), optimize=True)
        print('fet', nom)
