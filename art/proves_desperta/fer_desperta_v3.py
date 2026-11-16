#!/usr/bin/env python3
"""L'escena de la caiguda (js/zona_base.js, despertarCaigut) feta amb capes que es mouen per separat (substitueix eines/fer_desperta_v2.py):

    ineu_inconscient.webp   l'Ineu a terra amb els ulls tancats (art/personatges/ineu_inconscient.jpg), sense estrelletes ni pols (es fan amb codi)
    ineu_ulls.webp          el mateix Ineu amb els ulls entreoberts (art/personatges/desperta_v2/ineu.webp), alineat amb l'anterior: es fonen un amb l'altre
    pare_jorda_cos.webp     el Pare Jordà agenollat, sense el braç que acarona (art/personatges/desperta_v3/jorda_cos.png)
    pare_jorda_ma_pit.webp  el tros del cos on la seva altra mà descansa sobre el pit de l'Ineu: va per DAMUNT de l'Ineu (la resta del Pare Jordà va per darrere)
    pare_jorda_bras.webp    el braç que es belluga (art/personatges/desperta_v3/jorda_bras.png): per damunt de l'Ineu i per DARRERE de la part alta del Pare Jordà
    pare_jorda_cos_dalt.webp  cap, capucha, espatlla i estola del Pare Jordà (el mateix dibuix del cos, tallat a Y_DALT): va per damunt del braç i li tapa l'arrencada

    python eines/fer_desperta_v3.py

Totes surten en el MATEIX llenç (RODA x ALT) i amb la mateixa posició a dins: al joc es posen totes a la mateixa (x, y) i el braç gira al voltant del PIVOT (l'espatlla). Cal Pillow i numpy.
Els paràmetres de col·locació (ESC_INEU, POS_INEU, DESP_BRAS...) són a dalt de tot: es retoquen mirant la previsualització (--previsualitza surt.png).
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

sys.path.insert(0, str(Path(__file__).resolve().parent))
from treure_fons import treure_fons
import fer_desperta_v2 as v2

ARREL = Path(__file__).resolve().parent.parent
V3 = ARREL / 'art' / 'personatges' / 'desperta_v3'
LLENC = (1000, 1200)                 # el llenç comú (el del Pare Jordà i el seu braç, 896 x 1195, ampliat a la dreta perquè hi càpiga l'Ineu)
ESC_INEU = 0.705                      # mida de l'Ineu respecte a l'original (1086 d'ample) dins el llenç
POS_INEU = (46, 127)                # on cau la cantonada superior esquerra de l'Ineu al llenç (px)
DESP_BRAS = (0, 0)                   # desplaçament del braç respecte al seu dibuix original (px)
DESP_JORDA = (-40, 0)               # el Pare Jordà (cos, mà del pit i espatlla) s'acosta això a l'Ineu
PIVOT = (460, 270)                   # l'espatlla: on gira el braç (al llenç)
Y_DALT = 600                          # la part alta del Pare Jordà (cap, capucha, espatlla i estola) va per DAMUNT del braç: el braç li surt de darrere; la mà, en canvi, per davant de l'Ineu        # el tros del cos (capucha i estola) que tapa l'arrencada del braç: va per DAMUNT del braç
MA_PIT = (402, 632, 540, 738)        # on la mà del Pare Jordà descansa sobre l'Ineu (al llenç): se'n fa la capa de davant
PALMA_BRAS = (230, 570)             # el centre de la palma al dibuix del braç
FRONT = (252, 595)                   # on ha d'acabar la palma: el front de l'Ineu (al llenç)
ESC_BRAS = 0.93                      # el braç s'engrandeix una mica (la mà és 12 % més gran) perquè arribi de l'espatlla al front
GIR_BRAS = -8.4                      # graus (PIL: negatiu = en sentit horari) que es gira el braç al voltant de la palma, perquè l'arrencada caigui a PIVOT
MANS_ALT = (232, 460)                # (ja no es fa servir)
AMPLE_SORTIDA = 700                  # px de la imatge de sortida (retallada)


def ineu_sol(cami, ample=1086):
    o = Image.open(cami).convert('RGB')
    o = o.resize((ample, round(o.height * ample / o.width)), Image.LANCZOS)
    m = o.resize((o.width // 2, o.height // 2), Image.LANCZOS)
    im = v2.sol_el_cos(treure_fons(m, forats=600))          # a mitja mida (543 d'ample)
    # la taca blanca tancada entre els peus: un forat petit de fons que no ha tret la neteja (blanc gairebé pur, de menys de 150 px, a la part baixa)
    a = np.array(im); blanc = (a[:, :, :3].min(axis=2) >= 225) & (a[:, :, 3] > 24)
    from collections import deque
    h, w = blanc.shape; vist = np.zeros_like(blanc)
    for y0 in range(int(h * 0.55), h):
        for x0 in range(w):
            if blanc[y0, x0] and not vist[y0, x0]:
                q = deque([(y0, x0)]); vist[y0, x0] = True; pts = []
                while q:
                    y, x = q.popleft(); pts.append((y, x))
                    for yy, xx in ((y+1, x), (y-1, x), (y, x+1), (y, x-1)):
                        if 0 <= yy < h and 0 <= xx < w and blanc[yy, xx] and not vist[yy, xx]: vist[yy, xx] = True; q.append((yy, xx))
                if len(pts) < 150:
                    for y, x in pts: a[y, x, 3] = 0
    return Image.fromarray(a, 'RGBA')


def main():
    tancats = ineu_sol(ARREL / 'art' / 'personatges' / 'ineu_inconscient.jpg')
    oberts = ineu_sol(ARREL / 'art' / 'personatges' / 'desperta_v2' / 'ineu.webp')
    # alinea els ulls oberts sobre els tancats (el cos i les sandàlies)
    bb = tancats.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
    plant = (bb[0] + 4, bb[1] + 4, bb[0] + (bb[2] - bb[0]) * 55 // 100, bb[3] - 10)          # el cap i el tors (l'Ineu ha de tenir el cap al mateix lloc: la mà del Pare Jordà hi descansa)
    c, s, dx, dy = v2.alinea(tancats, oberts, plant, (0.85, 1.25))
    print('ulls oberts: ncc', round(c, 3), 'escala', round(s, 2), 'dx', dx, 'dy', dy)
    r = oberts.resize((round(oberts.width * s), round(oberts.height * s)), Image.LANCZOS)
    cv = Image.new('RGBA', tancats.size, (0, 0, 0, 0)); cv.alpha_composite(r, (-dx, -dy))
    oberts = cv
    # col·loca l'Ineu al llenç (mitja mida -> escala ESC_INEU respecte a 1086 d'ample)
    k = ESC_INEU * 2

    def al_llenc(im, pos=POS_INEU):
        g = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
        L = Image.new('RGBA', LLENC, (0, 0, 0, 0)); L.alpha_composite(g, (pos[0], pos[1])) if pos[0] >= 0 and pos[1] >= 0 else L.paste(g, pos, g); return L
    ineu_t, ineu_o = al_llenc(tancats), al_llenc(oberts)
    def al_llenc_gran(p):
        im = Image.open(p).convert('RGBA'); L = Image.new('RGBA', LLENC, (0, 0, 0, 0)); L.paste(im, (0, 0)); return L
    cos = al_llenc_gran(V3 / 'jorda_cos.png')
    cs = Image.new('RGBA', LLENC, (0, 0, 0, 0)); cs.paste(cos, DESP_JORDA, cos); cos = cs
    bras = al_llenc_gran(V3 / 'jorda_bras.png')
    # el braç: es gira al voltant de la palma i es porta de manera que la palma quedi al front de l'Ineu
    gb = bras.resize((round(bras.width * ESC_BRAS), round(bras.height * ESC_BRAS)), Image.LANCZOS); pc = (PALMA_BRAS[0] * ESC_BRAS, PALMA_BRAS[1] * ESC_BRAS)
    g = gb.rotate(GIR_BRAS, resample=Image.BICUBIC, center=pc)
    b2 = Image.new('RGBA', LLENC, (0, 0, 0, 0)); b2.paste(g, (round(FRONT[0] - pc[0]), round(FRONT[1] - pc[1])), g); bras = b2
    ang = np.radians(-GIR_BRAS)
    arrencada = (170 + 270, 590 - 120)            # (l'arrencada de la màniga al dibuix original: (440, 470))
    print('arrencada del braç al llenç (aprox.)', round(FRONT[0] + ESC_BRAS * ((440 - PALMA_BRAS[0]) * np.cos(ang) - (470 - PALMA_BRAS[1]) * np.sin(ang))), round(FRONT[1] + ESC_BRAS * ((440 - PALMA_BRAS[0]) * np.sin(ang) + (470 - PALMA_BRAS[1]) * np.cos(ang))))
    # la capa de davant: la mà que descansa al pit (només la pell i el contorn de la mà: l'hàbit i l'estola de darrere no han de tapar l'Ineu)
    x0, y0, x1, y1 = MA_PIT
    c = np.array(cos)[:, :, :3].astype(int); alc = np.array(cos.getchannel('A'))
    pell = (c[:, :, 0] > 195) & (c[:, :, 0] - c[:, :, 2] > 52) & (c[:, :, 0] - c[:, :, 1] > 45) & (c[:, :, 1] > 110) & (c[:, :, 1] < 205) & (alc > 128)
    zona = np.zeros(pell.shape, bool); zona[y0:y1, x0:x1] = True
    # (només la peça de pell més gran de la zona: la mà; els reflexos de l'hàbit que s'hi assemblen queden fora)
    from collections import deque
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
    pit = cos.copy(); pit.putalpha(Image.fromarray(np.minimum(alc, mm).astype(np.uint8), 'L'))
    yy = np.arange(LLENC[1])[:, None]
    mt = np.clip((Y_DALT - yy) / 14.0, 0, 1) * np.ones((1, LLENC[0]))
    esp = cos.copy(); esp.putalpha(Image.fromarray((np.array(cos.getchannel('A')) * mt).astype(np.uint8), 'L'))
    capes = {'ineu_inconscient': ineu_t, 'ineu_ulls': ineu_o, 'pare_jorda_cos': cos, 'pare_jorda_ma_pit': pit, 'pare_jorda_bras': bras, 'pare_jorda_cos_dalt': esp}
    # previsualització (ordre de dalt a baix: braç, mà del pit, Ineu, Pare Jordà)
    prev = Image.new('RGBA', LLENC, (140, 160, 140, 255))
    for n in ('pare_jorda_cos', 'ineu_inconscient', 'pare_jorda_ma_pit', 'pare_jorda_bras', 'pare_jorda_cos_dalt'): prev.alpha_composite(capes[n])
    if '--previsualitza' in sys.argv:
        prev.convert('RGB').save(sys.argv[sys.argv.index('--previsualitza') + 1])
    if '--escriu' not in sys.argv: return
    # retall comú
    uni = None
    for im in capes.values():
        b = im.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
        if b: uni = b if uni is None else (min(uni[0], b[0]), min(uni[1], b[1]), max(uni[2], b[2]), max(uni[3], b[3]))
    uni = (max(0, uni[0] - 8), max(0, uni[1] - 8), min(LLENC[0], uni[2] + 8), min(LLENC[1], uni[3] + 8))
    print('retall', uni, 'pivot al retall', (PIVOT[0] - uni[0], PIVOT[1] - uni[1]), 'mida', uni[2] - uni[0], uni[3] - uni[1])
    f = AMPLE_SORTIDA / (uni[2] - uni[0])
    dest = {'ineu_inconscient': ARREL / 'assets/ineu/ineu_inconscient.webp', 'ineu_ulls': ARREL / 'assets/ineu/ineu_ulls.webp'}
    for n, im in capes.items():
        c = im.crop(uni).resize((AMPLE_SORTIDA, round((uni[3] - uni[1]) * f)), Image.LANCZOS)
        d = dest.get(n, ARREL / 'assets/personatges' / f'{n}.webp')
        c.save(d, 'WEBP', quality=90, alpha_quality=100, method=6); print(d.name, c.size)
    print('f', f)


if __name__ == '__main__':
    main()
