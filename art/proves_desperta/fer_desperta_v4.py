#!/usr/bin/env python3
"""L'escena de la caiguda (js/zona_base.js, despertarCaigut), amb DOS dibuixos del Pare Jordà (braç amunt i braç avall) que s'alternen, sense moure cap braç (substitueix fer_desperta_v3.py):

    art/personatges/desperta_v4/jorda_amunt.png   el Pare Jordà amb la mà alçada
    art/personatges/desperta_v4/jorda_avall.png   el mateix amb la mà posada al front de l'Ineu
    art/personatges/ineu_inconscient.jpg          l'Ineu a terra, ulls tancats (se li treuen les estrelletes i la pols)
    art/personatges/desperta_v2/ineu.webp         l'Ineu amb els ulls entreoberts (s'alinea sobre l'anterior)

    python eines/fer_desperta_v4.py [--previsualitza sortida.png] [--escriu]

Capes (assets/personatges i assets/ineu), totes al mateix llenç:
    pare_jorda_baix     el Pare Jordà (braç avall) SENSE la caixa del braç: la resta del cos, que va per DARRERE de l'Ineu (genolls i hàbit)
    pare_jorda_avall    la caixa del braç (BRAC) del dibuix «avall»: el braç, la màniga i la mà al front, per DAMUNT de l'Ineu
    pare_jorda_amunt    la mateixa caixa del dibuix «amunt»: al joc s'alternen (una s'esvaeix i l'altra apareix)
    pare_jorda_ma_pit   la mà que descansa al pit (només la pell i el contorn), per damunt de tot: queda sobre la mà de l'Ineu
    ineu_inconscient / ineu_ulls   l'Ineu amb els ulls tancats / entreoberts
L'Ineu es posa (escala, gir i desplaçament) de manera que el seu front quedi sota la mà del Pare Jordà i la seva mà sota la mà del pit del Pare Jordà.
Cal Pillow i numpy.
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

sys.path.insert(0, str(Path(__file__).resolve().parent))
import fer_desperta_v2 as v2
import fer_desperta_v3 as v3

ARREL = Path(__file__).resolve().parent.parent
V4 = ARREL / 'art' / 'personatges' / 'desperta_v4'
LLENC = (1000, 1200)
BRAC = (150, 440, 470, 650)          # caixa on els dos dibuixos del Pare Jordà es diferencien (el braç): es treu del dibuix de darrere i es posa a les capes de davant
MA_PIT = (442, 632, 580, 738)        # la mà que descansa al pit
F_INEU = (127, 364)                  # a la imatge de l'Ineu (a mitja mida): el front, sota la mà alçada del Pare Jordà...
H_INEU = (297, 394)                  # ... i la mà de l'Ineu (al ventre)
F_LLENC = (262, 615)                 # on han de caure, al llenç: el front de l'Ineu (sota la mà del Pare Jordà)...
H_LLENC = (500, 688)                 # ... i la mà de l'Ineu (sota la mà del pit del Pare Jordà)
AMPLE_SORTIDA = 700


def gran(p):
    im = Image.open(p).convert('RGBA'); L = Image.new('RGBA', LLENC, (0, 0, 0, 0)); L.paste(im, (0, 0)); return L


def retalla(im, caixa, dins=True):
    m = np.zeros((LLENC[1], LLENC[0]), np.uint8); x0, y0, x1, y1 = caixa; m[y0:y1, x0:x1] = 255
    if not dins: m = 255 - m
    r = im.copy(); r.putalpha(Image.fromarray(np.minimum(np.array(im.getchannel('A')), m), 'L')); return r


def main():
    amunt, avall = gran(V4 / 'jorda_amunt.png'), gran(V4 / 'jorda_avall.png')
    # l'Ineu (a mitja mida), els ulls oberts alineats sobre els tancats
    tancats = v3.ineu_sol(ARREL / 'art' / 'personatges' / 'ineu_inconscient.jpg')
    oberts = v3.ineu_sol(ARREL / 'art' / 'personatges' / 'desperta_v2' / 'ineu.webp')
    bb = tancats.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
    plant = (bb[0] + 4, bb[1] + 4, bb[0] + (bb[2] - bb[0]) * 55 // 100, bb[3] - 10)
    c, s, dx, dy = v2.alinea(tancats, oberts, plant, (0.85, 1.25))
    print('ulls oberts: ncc', round(c, 3), 'escala', round(s, 2), 'dx', dx, 'dy', dy)
    r = oberts.resize((round(oberts.width * s), round(oberts.height * s)), Image.LANCZOS)
    cv = Image.new('RGBA', tancats.size, (0, 0, 0, 0)); cv.alpha_composite(r, (-dx, -dy)); oberts = cv
    # semblança (escala + gir + desplaçament) que porta F_INEU -> F_LLENC i H_INEU -> H_LLENC
    vi = np.array(H_INEU, float) - F_INEU; vl = np.array(H_LLENC, float) - F_LLENC
    k = np.hypot(*vl) / np.hypot(*vi); gir = np.degrees(np.arctan2(vl[1], vl[0]) - np.arctan2(vi[1], vi[0]))
    print('Ineu: escala', round(k, 3), 'gir', round(gir, 2), 'graus')

    def posa(im):
        g = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
        L = Image.new('RGBA', LLENC, (0, 0, 0, 0)); ox, oy = round(F_LLENC[0] - F_INEU[0] * k), round(F_LLENC[1] - F_INEU[1] * k)
        L.paste(g, (ox, oy), g)
        return L.rotate(-gir, resample=Image.BICUBIC, center=F_LLENC)          # (PIL: positiu = antihorari; a pantalla, amb la y cap avall, el gir és horari)
    ineu_t, ineu_o = posa(tancats), posa(oberts)
    # el Pare Jordà
    baix = retalla(avall, BRAC, dins=False)
    f_avall, f_amunt = retalla(avall, BRAC), retalla(amunt, BRAC)
    pit = v3_pit(avall)
    capes = {'ineu_inconscient': ineu_t, 'ineu_ulls': ineu_o, 'pare_jorda_baix': baix, 'pare_jorda_avall': f_avall, 'pare_jorda_amunt': f_amunt, 'pare_jorda_ma_pit': pit}
    for nom, ordre in (('prev_avall', ('pare_jorda_baix', 'ineu_inconscient', 'pare_jorda_avall', 'pare_jorda_ma_pit')), ('prev_amunt', ('pare_jorda_baix', 'ineu_ulls', 'pare_jorda_amunt', 'pare_jorda_ma_pit'))):
        p = Image.new('RGBA', LLENC, (140, 160, 140, 255))
        for n in ordre: p.alpha_composite(capes[n])
        if '--previsualitza' in sys.argv:
            base = Path(sys.argv[sys.argv.index('--previsualitza') + 1]); p.convert('RGB').save(base.with_name(base.stem + '_' + nom + base.suffix))
    if '--escriu' not in sys.argv: return
    uni = None
    for im in capes.values():
        b = im.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
        if b: uni = b if uni is None else (min(uni[0], b[0]), min(uni[1], b[1]), max(uni[2], b[2]), max(uni[3], b[3]))
    uni = (max(0, uni[0] - 8), max(0, uni[1] - 8), min(LLENC[0], uni[2] + 8), min(LLENC[1], uni[3] + 8))
    f = AMPLE_SORTIDA / (uni[2] - uni[0])
    dest = {'ineu_inconscient': ARREL / 'assets/ineu/ineu_inconscient.webp', 'ineu_ulls': ARREL / 'assets/ineu/ineu_ulls.webp'}
    for n, im in capes.items():
        c = im.crop(uni).resize((AMPLE_SORTIDA, round((uni[3] - uni[1]) * f)), Image.LANCZOS)
        d = dest.get(n, ARREL / 'assets/personatges' / f'{n}.webp'); c.save(d, 'WEBP', quality=90, alpha_quality=100, method=6)
        print(d.name, c.size)
    tex = lambda cx, cy: (round((cx - uni[0]) * f), round((cy - uni[1]) * f))
    # punts del joc (coordenades de la imatge de sortida): al centre de l'Ineu, damunt del seu cap, la pols, i entre els dos caps
    def ineu_a_llenc(p):
        x, y = F_LLENC[0] + (p[0] - F_INEU[0]) * k, F_LLENC[1] + (p[1] - F_INEU[1]) * k
        a = np.radians(gir); dx_, dy_ = x - F_LLENC[0], y - F_LLENC[1]
        return F_LLENC[0] + dx_ * np.cos(a) - dy_ * np.sin(a), F_LLENC[1] + dx_ * np.sin(a) + dy_ * np.cos(a)
    print('CAP (estrelles)', tex(*ineu_a_llenc((137, 340))))
    print('POLS', tex(*ineu_a_llenc((72, 452))))
    print('C0 (Ineu)', tex(*ineu_a_llenc((287, 447))))
    print('C1 (entre caps)', tex((340 + F_LLENC[0]) // 2, (380 + F_LLENC[1]) // 2))
    print('textura', c.size, 'f', round(f, 4), 'retall', uni)


def v3_pit(cos):
    """La mà del pit: només la pell i el contorn (la peça de pell més gran dins MA_PIT)."""
    from collections import deque
    x0, y0, x1, y1 = MA_PIT
    c = np.array(cos)[:, :, :3].astype(int); alc = np.array(cos.getchannel('A'))
    pell = (c[:, :, 0] > 195) & (c[:, :, 0] - c[:, :, 2] > 52) & (c[:, :, 0] - c[:, :, 1] > 45) & (c[:, :, 1] > 110) & (c[:, :, 1] < 205) & (alc > 128)
    zona = np.zeros(pell.shape, bool); zona[y0:y1, x0:x1] = True
    pz = pell & zona; et = np.zeros(pz.shape, np.int32); n = 0; mides = {}
    for yy, xx in zip(*np.where(pz)):
        if not et[yy, xx]:
            n += 1; et[yy, xx] = n; q = deque([(yy, xx)]); cnt = 0
            while q:
                y, x = q.popleft(); cnt += 1
                for y2, x2 in ((y+1, x), (y-1, x), (y, x+1), (y, x-1)):
                    if 0 <= y2 < pz.shape[0] and 0 <= x2 < pz.shape[1] and pz[y2, x2] and not et[y2, x2]: et[y2, x2] = n; q.append((y2, x2))
            mides[n] = cnt
    pz = et == max(mides, key=mides.get)
    mm = Image.fromarray((pz * 255).astype(np.uint8), 'L').filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
    mm = np.minimum(np.array(mm), (zona * 255).astype(np.uint8))
    pit = cos.copy(); pit.putalpha(Image.fromarray(np.minimum(alc, mm).astype(np.uint8), 'L')); return pit


if __name__ == '__main__':
    main()
