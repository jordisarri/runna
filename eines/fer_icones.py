"""
Fa les icones de l'aplicació instal·lable (PWA) a assets/pwa/: la R del logo de Runna (art/titol/logo_runna.png) amb l'espasa (art/armes/espasa.jpg) que
l'atravessa de dalt a baix, sobre un fons càlid fosc:
    python eines/fer_icones.py
Surten: icona-192.png, icona-512.png (es veuen tal qual), icona-maskable-512.png (amb més marge: Android la retalla en cercle o en el que vulgui),
apple-touch-icon.png (180) i favicon.png (64). Cal Pillow.
"""
import os, sys
from PIL import Image, ImageDraw, ImageFilter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from treure_fons import treure_fons

ARREL = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
LOGO = os.path.join(ARREL, 'art', 'titol', 'logo_runna.png')
ESPASA = os.path.join(ARREL, 'art', 'armes', 'espasa.jpg')
SORTIDA = os.path.join(ARREL, 'assets', 'pwa')
ICONA_ART = os.path.join(ARREL, 'art', 'pwa', 'icona.png')      # si hi és (vegeu docs/PROMPTS_GRAFICS.md), es fa servir aquesta imatge en lloc de la composició
RETALL = (62, 35, 1002, 975)    # el que es queda de la imatge feta a mà (en píxels d'una de 1024 × 1024): quadrat ajustat al dibuix, amb un petit marge a l'espasa, que és el que més ocupa
R_CAIXA = (100, 120, 840, 1070)          # la R (amb els sarments) dins el logo, en píxels de l'original
# La R toca la U al logo: només es queda el que cau dins d'aquest polígon (la vora dreta passa pel buit que hi ha entre la pota de la R i la U)
R_POLIGON = [(95, 100), (648, 100), (648, 700), (690, 750), (720, 890), (775, 980), (832, 1012), (845, 1075), (95, 1075)]


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


def icona(r, espasa, mida, escala):
    """escala: 1 = la mida de la icona normal; menys, per a la «maskable» (Android la retalla i cal deixar marge)."""
    im = fons(mida).convert('RGBA')
    hr = int(mida * 0.84 * escala)
    rr = r.resize((int(r.width * hr / r.height), hr), Image.LANCZOS)
    xr, yr = (mida - rr.width) // 2 - int(mida * 0.03 * escala), (mida - hr) // 2 + int(mida * 0.01)
    ombra = Image.new('RGBA', im.size, (0, 0, 0, 0)); ombra.paste((0, 0, 0, 150), (xr + mida // 60, yr + mida // 50), rr.split()[3])
    im.alpha_composite(ombra.filter(ImageFilter.GaussianBlur(mida / 70)))
    im.alpha_composite(rr, (xr, yr))
    # L'espasa, de dalt a baix (la punta cap avall, com clavada), una mica a la dreta del centre, per damunt de la R
    he = int(mida * 0.96 * escala)
    ee = espasa.rotate(180, expand=True).resize((int(espasa.width * he / espasa.height), he), Image.LANCZOS)
    xe, ye = (mida - ee.width) // 2 + int(mida * 0.04 * escala), (mida - he) // 2
    llum = Image.new('RGBA', im.size, (0, 0, 0, 0)); llum.paste((255, 226, 150, 110), (xe, ye), ee.split()[3])
    im.alpha_composite(llum.filter(ImageFilter.GaussianBlur(mida / 28)))
    ombra = Image.new('RGBA', im.size, (0, 0, 0, 0)); ombra.paste((0, 0, 0, 170), (xe + mida // 55, ye + mida // 70), ee.split()[3])
    im.alpha_composite(ombra.filter(ImageFilter.GaussianBlur(mida / 90)))
    im.alpha_composite(ee, (xe, ye))
    return im.convert('RGB')


def icones_de_l_art():
    """Les icones a partir de la imatge feta a mà (quadrada, amb el fons inclòs). Se'n retalla el que sobra al voltant del dibuix (RETALL) perquè la R i l'espasa surtin el més grans possible
    sense tallar-se; a la «maskable», que es retalla en cercle, es fa més petita i el que l'envolta s'omple allargant la seva vora i desenfocant-la."""
    import numpy as np
    art = Image.open(ICONA_ART).convert('RGB')
    k = art.width / 1024
    art = art.crop(tuple(int(v * k) for v in RETALL))
    for nom, mida, escala in [('icona-512.png', 512, 1), ('icona-192.png', 192, 1), ('icona-maskable-512.png', 512, 0.72),
                              ('apple-touch-icon.png', 180, 1), ('favicon.png', 64, 1)]:
        petita = art.resize((int(mida * escala), int(mida * escala)), Image.LANCZOS)
        marge = (mida - petita.width) // 2
        ample = np.pad(np.array(petita), ((marge, mida - petita.height - marge), (marge, mida - petita.width - marge), (0, 0)), mode='edge')
        vora = Image.fromarray(ample).filter(ImageFilter.GaussianBlur(mida / 14))
        mascara = Image.new('L', (mida, mida), 0)
        ImageDraw.Draw(mascara).rectangle([marge + 4, marge + 4, marge + petita.width - 4, marge + petita.height - 4], fill=255)
        im = Image.composite(Image.fromarray(ample), vora, mascara.filter(ImageFilter.GaussianBlur(max(1, mida / 70))))
        im.save(os.path.join(SORTIDA, nom), optimize=True)
        print('fet', nom, '(de art/pwa/icona.png)')


if __name__ == '__main__':
    os.makedirs(SORTIDA, exist_ok=True)
    if os.path.exists(ICONA_ART):
        icones_de_l_art(); sys.exit(0)
    logo = Image.open(LOGO).convert('RGBA')
    mascara = Image.new('L', logo.size, 0); ImageDraw.Draw(mascara).polygon(R_POLIGON, fill=255)
    logo.putalpha(Image.fromarray(__import__('numpy').minimum(__import__('numpy').array(logo.split()[3]), __import__('numpy').array(mascara))))
    r = logo.crop(R_CAIXA); r = r.crop(r.getbbox())
    espasa = treure_fons(Image.open(ESPASA))
    espasa = espasa.crop(espasa.getbbox())
    for nom, mida, escala in [('icona-512.png', 512, 1), ('icona-192.png', 192, 1), ('icona-maskable-512.png', 512, 0.68),
                              ('apple-touch-icon.png', 180, 1), ('favicon.png', 64, 1)]:
        icona(r, espasa, mida, escala).save(os.path.join(SORTIDA, nom), optimize=True)
        print('fet', nom)
