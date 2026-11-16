#!/usr/bin/env python3
"""Les imatges de l'escena de la caiguda (js/zona_base.js, despertarCaigut), a partir de 4 originals de la mateixa generació (art/personatges/desperta_v2/):

    jorda_a.webp   el Pare Jordà amb la mà al front de l'Ineu (la imatge «de repòs» del gest)
    jorda_b.webp   la mà alçada un pèl per sobre del front
    jorda_c.webp   la mà a la tempia, als cabells
    (l'Ineu sol és art/personatges/ineu_inconscient.jpg, el de sempre, amb els ulls tancats; se li treuen les estrelletes i la pols, que es fan amb codi a l'escena)

    python eines/fer_desperta_v2.py

Les imatges no estan alineades (el generador mou una mica el cos a cada una), i per això se n'alineen les sandàlies de l'Ineu amb les de jorda_a (translació i escala) abans de retallar-les
totes amb el MATEIX retall: així, en passar d'una a l'altra, l'Ineu no fa cap salt i només es belluga la mà. Surten (a assets/ineu i assets/personatges, amb fons transparent):
    ineu_inconscient.webp, pare_jorda_desperta.webp (A), pare_jorda_desperta_b.webp, pare_jorda_desperta_c.webp
Cal Pillow i numpy.
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from treure_fons import treure_fons

ARREL = Path(__file__).resolve().parent.parent
ORIGEN = ARREL / 'art' / 'personatges' / 'desperta_v2'
AMPLE_SORTIDA = 680          # px de la imatge de sortida (al joc fa 170 de món: RES 2... i el doble de definició)
MITJA = 0.5                  # es treballa a mitja mida (l'original fa 1086 x 1448)
PLANTILLA = {'jorda': (60, 50, 520, 560), 'ineu': (200, 380, 530, 565)}    # zona que s'alinea a jorda_a (a mitja mida): els dos personatges (menys la mà no hi ha canvis grans) o, per a l'Ineu sol, el cos i les sandàlies


def gris_blanc(im):
    f = Image.new('RGBA', im.size, (255, 255, 255, 255)); f.alpha_composite(im)
    return np.array(f.convert('L'), dtype=np.float32)


def ncc(a, b):
    a = a - a.mean(); b = b - b.mean()
    d = np.sqrt((a * a).sum() * (b * b).sum())
    return float((a * b).sum() / d) if d else -1


def alinea(ref, im, plantilla, escales=(0.90, 1.101)):
    """(escala, dx, dy) que posen `im` sobre `ref`, mirant només les sandàlies."""
    x0, y0, x1, y1 = plantilla
    T = gris_blanc(ref)[y0:y1, x0:x1]
    millor = (-2, 1.0, 0, 0)
    for s in np.arange(escales[0], escales[1], 0.02):
        s = float(s)
        r = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        G = gris_blanc(r)
        for dy in range(-90, 91, 3):
            for dx in range(-90, 91, 3):
                xa, ya = x0 + dx, y0 + dy
                if xa < 0 or ya < 0 or xa + T.shape[1] > G.shape[1] or ya + T.shape[0] > G.shape[0]: continue
                c = ncc(T, G[ya:ya + T.shape[0], xa:xa + T.shape[1]])
                if c > millor[0]: millor = (c, float(s), dx, dy)
    c, s, dx, dy = millor
    # afinat (passos d'1 px) al voltant del millor
    r = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS); G = gris_blanc(r)
    for ddy in range(-3, 4):
        for ddx in range(-3, 4):
            xa, ya = x0 + dx + ddx, y0 + dy + ddy
            if xa < 0 or ya < 0 or xa + T.shape[1] > G.shape[1] or ya + T.shape[0] > G.shape[0]: continue
            cc = ncc(T, G[ya:ya + T.shape[0], xa:xa + T.shape[1]])
            if cc > c: c, bx, by = cc, dx + ddx, dy + ddy
    try: dx, dy = bx, by
    except NameError: pass
    return c, s, dx, dy


def sol_el_cos(im):
    """Treu d'una imatge transparent tot el que no és la peça més gran (les estrelletes de mareig i la pols, que són a part)."""
    from collections import deque
    a = np.array(im.getchannel('A')) > 24
    h, w = a.shape; etiq = np.zeros((h, w), np.int32); n = 0; mides = {}
    for y0 in range(h):
        for x0 in range(w):
            if a[y0, x0] and not etiq[y0, x0]:
                n += 1; etiq[y0, x0] = n; q = deque([(y0, x0)]); c = 0
                while q:
                    y, x = q.popleft(); c += 1
                    for yy, xx in ((y+1, x), (y-1, x), (y, x+1), (y, x-1)):
                        if 0 <= yy < h and 0 <= xx < w and a[yy, xx] and not etiq[yy, xx]: etiq[yy, xx] = n; q.append((yy, xx))
                mides[n] = c
    gran = max(mides, key=mides.get)
    # (un halo d'1-2 px al voltant del cos també queda: la peça gran el du enganxat; les petites, a part, es buiden amb un marge)
    from PIL import ImageFilter
    fora = Image.fromarray(((etiq != gran) & (etiq > 0)).astype(np.uint8) * 255, 'L').filter(ImageFilter.MaxFilter(5))
    r = np.array(im); r[:, :, 3] = np.where(np.array(fora) > 0, 0, r[:, :, 3]); return Image.fromarray(r, 'RGBA')


def main():
    noms = ['jorda_a', 'jorda_b', 'jorda_c', 'ineu']
    ims = {}
    for n in noms:
        o = Image.open(ORIGEN / f'{n}.webp' if n != 'ineu' else ARREL / 'art' / 'personatges' / 'ineu_inconscient.jpg').convert('RGB')
        if n == 'ineu': o = o.resize((1086, round(o.height * 1086 / o.width)), Image.LANCZOS)
        o = o.resize((round(o.width * MITJA), round(o.height * MITJA)), Image.LANCZOS)
        ims[n] = treure_fons(o, forats=600)
        if n == 'ineu': ims[n] = sol_el_cos(ims[n])
        print(n, ims[n].size)
    ref = ims['jorda_a']
    W, H = ref.size
    llenc = {}
    for n in noms:
        if n == 'jorda_a': llenc[n] = ref; continue
        c, s, dx, dy = alinea(ref, ims[n], PLANTILLA['ineu' if n == 'ineu' else 'jorda'], (0.95, 1.30) if n == 'ineu' else (0.90, 1.101))
        print(n, 'ncc', round(c, 3), 'escala', round(s, 2), 'dx', dx, 'dy', dy)
        r = ims[n].resize((round(ims[n].width * s), round(ims[n].height * s)), Image.LANCZOS)
        cv = Image.new('RGBA', (W, H), (0, 0, 0, 0)); cv.alpha_composite(r, (-dx, -dy)) if (dx or dy) else cv.alpha_composite(r)
        llenc[n] = cv
    # retall comú: la unió de tots els fotogrames
    uni = None
    for cv in llenc.values():
        b = cv.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
        uni = b if uni is None else (min(uni[0], b[0]), min(uni[1], b[1]), max(uni[2], b[2]), max(uni[3], b[3]))
    pad = 6
    uni = (max(0, uni[0] - pad), max(0, uni[1] - pad), min(W, uni[2] + pad), min(H, uni[3] + pad))
    print('retall', uni, 'mida', uni[2] - uni[0], uni[3] - uni[1])
    k = AMPLE_SORTIDA / (uni[2] - uni[0])
    sortida = {'ineu': ARREL / 'assets/ineu/ineu_inconscient.webp', 'jorda_a': ARREL / 'assets/personatges/pare_jorda_desperta.webp',
               'jorda_b': ARREL / 'assets/personatges/pare_jorda_desperta_b.webp', 'jorda_c': ARREL / 'assets/personatges/pare_jorda_desperta_c.webp'}
    for n, dest in sortida.items():
        c = llenc[n].crop(uni)
        c = c.resize((AMPLE_SORTIDA, round(c.height * k)), Image.LANCZOS)
        c.save(dest, 'WEBP', quality=90, alpha_quality=100, method=6)
        print(dest.name, c.size)


if __name__ == '__main__':
    main()
