#!/usr/bin/env python3
"""L'escena de la caiguda (js/zona_base.js, despertarCaigut) a partir de l'spritesheet fet a mà art/personatges/desperta_v5/sheet2.webp (4 x 2 fotogrames de 500 px amb fons transparent; sheet.webp és el 3 x 3 anterior):
el Pare Jordà acaricia el front de l'Ineu, que té els ulls oberts. Surt:

    assets/personatges/ineu_desperta.webp   l'spritesheet, 4 x 2 cel·les de 342 px (el joc el carrega com a 'ineu_desperta')
    assets/ineu/ineu_inconscient.webp       l'Ineu a terra amb els ulls TANCATS (art/personatges/ineu_inconscient.jpg, sense estrelletes ni pols: es fan amb codi),
                                            de 342 x 342 i alineat sobre l'Ineu del primer fotograma, perquè el canvi de l'un a l'altre no faci cap salt

    python eines/fer_desperta_v5.py

Cal Pillow i numpy. (Les proves anteriors són a art/proves_desperta/.)
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
ARREL = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ARREL / 'art' / 'proves_desperta'))
import fer_desperta_v2 as v2
from contorn_ineu import alfa_contorn
import fer_desperta_v3 as v3

CEL = 342
AMPLE_INEU = 420          # l'Ineu tancat té les cames més llargues que el del full: la imatge és més ampla (alineada per l'esquerra, com el full) i al joc es posa amb l'origen a x = 171


def buida_blanc_tancat(f, y_min=215, x_min=240, mida_max=400):
    """Treu el blanc que queda tancat entre els peus (només a la zona dels peus: a dreta i a baix, per no buidar el blanc dels ulls): blanc gairebé pur, opac, en peces de menys de `mida_max` px."""
    from collections import deque
    a = np.array(f); blanc = (a[:, :, :3].min(axis=2) >= 222) & (a[:, :, 3] > 24)
    h, w = blanc.shape; vist = np.zeros_like(blanc)
    for y0 in range(y_min, h):
        for x0 in range(x_min, w):
            if blanc[y0, x0] and not vist[y0, x0]:
                q = deque([(y0, x0)]); vist[y0, x0] = True; pts = []
                while q:
                    y, x = q.popleft(); pts.append((y, x))
                    for yy, xx in ((y+1, x), (y-1, x), (y, x+1), (y, x-1)):
                        if 0 <= yy < h and 0 <= xx < w and blanc[yy, xx] and not vist[yy, xx]: vist[yy, xx] = True; q.append((yy, xx))
                if len(pts) < mida_max:
                    for y, x in pts: a[y, x, 3] = 0
    return Image.fromarray(a, 'RGBA')


def amb_contorn(f, gruix=1):
    """El contorn negre d'1 px de tots els personatges del joc (el mateix de contorn_ineu.py)."""
    a = np.array(f); vora = np.zeros_like(a); vora[:, :, 3] = (alfa_contorn(a[:, :, 3], gruix) * 255).astype(np.uint8)
    base = Image.fromarray(vora, 'RGBA'); base.alpha_composite(f); return base


def main():
    full = Image.open(ARREL / 'art' / 'personatges' / 'desperta_v5' / 'sheet2.webp').convert('RGBA')
    COLS, FILES, CELL_ORIGEN = 4, 2, 500
    out = Image.new('RGBA', (CEL * COLS, CEL * FILES), (0, 0, 0, 0))
    frames = []
    for r in range(FILES):
        for c in range(COLS):
            x0, y0 = c * CELL_ORIGEN + 86, r * CELL_ORIGEN + 80          # (cada cel·la de 500 té el dibuix a 108-425 x 102-400: es retalla a 342 x 342 amb el mateix marge de sempre)
            f = buida_blanc_tancat(full.crop((x0, y0, x0 + CEL, y0 + CEL))); frames.append(f); out.paste(f, (c * CEL, r * CEL))          # (sense contorn: amb el d'1 px es veia malament; amb_contorn() hi és per si es vol tornar a provar)
    out.save(ARREL / 'assets' / 'personatges' / 'ineu_desperta.webp', 'WEBP', quality=92, alpha_quality=100, method=6)
    print('ineu_desperta.webp', out.size)
    # l'Ineu tancat: a mitja mida, escalat perquè faci aprox. com el del primer fotograma, i alineat sobre aquest
    cl = v3.ineu_sol(ARREL / 'art' / 'personatges' / 'ineu_inconscient.jpg')
    bb = cl.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
    ref = Image.new('RGBA', (AMPLE_INEU, CEL), (0, 0, 0, 0)); ref.alpha_composite(frames[0])
    rb = ref.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
    s0 = (rb[2] - rb[0]) * 0.96 / (bb[2] - bb[0])
    g = cl.crop(bb).resize((round((bb[2] - bb[0]) * s0), round((bb[3] - bb[1]) * s0)), Image.LANCZOS)
    cv = Image.new('RGBA', (AMPLE_INEU, CEL), (0, 0, 0, 0)); ox, oy = rb[0], rb[3] - g.height; cv.alpha_composite(g, (ox, oy))
    c, s, dx, dy = v2.alinea(ref, cv, (25, 150, 215, 330), (0.80, 1.10))          # (el cap i el tors: és el que ha de coincidir)
    print('Ineu tancat sobre el del fotograma 0: ncc', round(c, 3), 'escala', round(s, 3), 'dx', dx, 'dy', dy)
    r2 = cv.resize((round(AMPLE_INEU * s), round(CEL * s)), Image.LANCZOS)
    res = Image.new('RGBA', (AMPLE_INEU, CEL), (0, 0, 0, 0)); res.alpha_composite(r2, (-dx, -dy))
    res.save(ARREL / 'assets' / 'ineu' / 'ineu_inconscient.webp', 'WEBP', quality=92, alpha_quality=100, method=6)
    # punts d'interès (a la cel·la de 342): cap de l'Ineu (damunt del cabell) i pols
    def a_cel(px, py):          # (px, py) de la imatge a mitja mida de l'Ineu -> cel·la
        x, y = ox + (px - bb[0]) * s0, oy + (py - bb[1]) * s0
        return round((x * s) - dx), round((y * s) - dy)
    print('CAP', a_cel(137, 330), 'POLS', a_cel(70, 440))
    ys, xs = np.where(np.array(res.getchannel('A')) > 24); print('Ineu tancat bbox', xs.min(), ys.min(), xs.max(), ys.max())


if __name__ == '__main__':
    main()
