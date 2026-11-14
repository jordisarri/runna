#!/usr/bin/env python3
"""Fulls d'atac de l'Ineu amb cada arma (bastó, branca del Til·ler, espasa), 8 direccions → assets/ineu/atac/atac_<arma>_<direccio>.webp.

    python3 eines/fer_atac_arma.py

Origen: art/ineu/atac_arma/<arma>/<direccio>.png (bastó, branca i espasa són la 2a generació; la 1a és a basto_v1/, tiller_v1/ i espasa_v1/ -l'espasa repetia el tall quatre vegades-; la branca i el bastó es tallaven a la vora: la 1a repetia el tall quatre vegades i és a espasa_v1/) (paquets isomètrics d'AutoSprite, 4x4 de 384 px, 16 fotogrames; l'arma ja hi surt a la mà).
AutoSprite no fa un cop net: afegeix preparació, repeteix el gest i es queda en pose final. Aquí es tria, per arma, només els fotogrames del cop (FOTOGRAMES), amb
l'últim repetit perquè es vegi el final del cop. Els fulls surten en cel·les de CEL px a l'escala dels fulls de caminar (reduïts: SPRITE_INEU.k), amb els peus
a la mateixa fracció de la cel·la (origen 0,5 / 0,9375, com al joc) i el contorn negre d'1 px. El joc els carrega a js/assets.js (ATAC_ARMA_FPS).
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image
sys.path.insert(0, str(Path(__file__).resolve().parent))
from contorn_ineu import alfa_contorn

ARREL = Path(__file__).resolve().parent.parent
ORIGEN = ARREL / 'art' / 'ineu' / 'atac_arma'
DEST = ARREL / 'assets' / 'ineu' / 'atac'
DIRS = ['down', 'up', 'left', 'right', 'southwest', 'southeast', 'northwest', 'northeast']
FOT = {'basto': [2, 3, 4, 5, 5], 'tiller': [2, 3, 4, 5, 5], 'espasa': [2, 3, 4, 5, 5]}       # fotogrames triats (de 0 a 15) per arma
# Excepcions per (arma, direcció): full d'origen i fotogrames propis. A la vista d'esquena ('up') de la 2a generació l'arma queda amagada darrere el cap o tallada per la vora
# del fotograma (la branca només es veu en un fotograma, després només una corona de fulles sobre el cap): la branca fa servir la 1a generació (tiller_v1), on la branca balla
# ben visible i sencera de dreta a esquerra (fotogrames 2: dreta, 8, 4 i 5: a l'esquerra, 3: tot a l'esquerra).
# L'espasa 'up' (vista d'esquena): el full de 2a generació l'amagava i el de la 3a (espasa_up_v3) sortia amb l'hàbit massa fosc i l'espasa a l'esquena. Es fa servir un full triat
# a mà (espasa_up_v4): només els tres primers fotogrames, els únics on surt l'espasa (0: baixa al costat, 1 i 2: alçada), i la tornada per completar els 5 del joc.
# El bastó 'up' també fa servir la 1a generació (basto_v1): a la 2a el bastó només surt als dos primers fotogrames i a la resta s'amaga darrere el cap. A basto_v1 surt a tots els 16.
# Els fotogrames 3, 2, 4, 5 donen un gir continu de la punta del bastó, de dreta a esquerra (angle de la vara: ~-10°, 15°, 37°, 67°), amb el bastó visible a tots; l'últim es repeteix (el 0 té la punta tallada per la vora de l'original).
ORIGEN_EXC = {('tiller', 'up'): 'tiller_v1', ('espasa', 'up'): 'espasa_up_v4', ('basto', 'up'): 'basto_v1'}
FOT_EXC = {('tiller', 'up'): [2, 8, 4, 5, 3], ('espasa', 'up'): [0, 1, 2, 1, 0], ('basto', 'up'): [3, 2, 4, 5, 5]}
# Fotogrames amb què es mesura l'alçada del cos (per defecte 12-15, on l'arma és a les mans). A basto_v1 'up' la gafa del bastó sobresurt per sobre del cap en aquests: es mesura amb el 3 i el 4.
ESCALA_FOTS = {('basto', 'up'): (3, 4)}
CENTRAL = set()        # direccions on l'escala del cos es mesura només amb les columnes del cap (quan l'arma sobresurt per sobre del cap)
SRC, CEL = 384, 320         # fotograma d'origen i cel·la de sortida (més gran que abans, perquè l'arma no es talli)
COS = 170.0                  # alçada que ha de fer el cos de l'Ineu a la cel·la (com als fulls de caminar reduïts)
GRUIX = 1
AMB_REF = {(arma, d) for arma in ('tiller', 'espasa', 'basto') for d in ('southeast', 'southwest', 'northeast', 'northwest')}
IDLE = ARREL / 'assets' / 'ineu' / 'idle'

def peus_idle(d):
    # Centre horitzontal dels peus a l'idle d'aquesta direcció (fotograma de repòs, cel·la de 256): als idles no són al mig de la cel·la (en diagonal, fins a ~28 px),
    # i si l'atac té els peus al mig, l'Ineu fa un salt en començar-lo. Els peus de l'atac es posen on són els de l'idle.
    a = np.array(Image.open(IDLE / f'idle_{d}.webp').convert('RGBA'))[:, :, 3] > 24
    w = a.shape[1] // 4
    c = a[(2 // 4) * w:(2 // 4 + 1) * w, (2 % 4) * w:(2 % 4 + 1) * w]
    ys, _ = np.where(c)
    _, xs = np.where(c[ys.max() - 12:ys.max() + 1])
    return float(xs.min() + xs.max()) / 2 - w / 2

def fotograma(im, i):
    return im.crop(((i % 4) * SRC, (i // 4) * SRC, (i % 4) * SRC + SRC, (i // 4) * SRC + SRC))

def peus(im, fots):
    # fila més baixa del cos (mediana dels fotogrames triats; l'arma no baixa dels peus, excepte l'espasa avall: per això mediana i no màxim)
    b = []
    for i in fots:
        ys, _ = np.where(np.array(fotograma(im, i).split()[3]) > 24)
        b.append(ys.max())
    return float(np.median(b))

def centre_peus(fot, ref=None, antic=False):
    # Centre horitzontal dels peus (les 24 files de més avall del cos): el cos es mou dins la cel·la durant el cop; es fixa als peus perquè l'Ineu no es desplaci (retrocés)
    # Si l'arma (la fulla) baixa fins a l'alçada dels peus, la banda en té dos grups separats: es tria el més proper a `ref` (centre dels peus del primer fotograma,
    # on l'arma és alta) o, sense ref, el de més massa, perquè la fulla no s'emporti el cos (el cos es desplaçava molt en atacar en diagonal avall).
    a = np.array(fot.split()[3]) > 24
    ys, _ = np.where(a)
    banda = a[max(0, ys.max() - 24):ys.max() + 1]
    cols = np.where(banda.any(axis=0))[0]
    if not len(cols): return SRC / 2
    grups, ini = [], cols[0]
    for p, q in zip(cols[:-1], cols[1:]):
        if q - p > 14: grups.append((ini, p)); ini = q
    grups.append((ini, cols[-1]))
    if antic or len(grups) == 1: return float(cols[0] + cols[-1]) / 2 if antic else float(grups[0][0] + grups[0][1]) / 2
    if ref is not None: g = min(grups, key=lambda g: abs((g[0] + g[1]) / 2 - ref))
    else: g = max(grups, key=lambda g: banda[:, g[0]:g[1] + 1].sum())
    return float(g[0] + g[1]) / 2

def escala(im, arma, central=False, fots=(12, 13, 14, 15)):
    # Alçada del cos = dels peus (mediana de la fila més baixa) al cap (mediana de la fila més alta dels fotogrames finals, on l'arma és a l'alçada de les mans o avall).
    # Cada generació de AutoSprite fa el personatge d'una mida diferent (l'espasa, ~310 px; el bastó i la branca, 250-270), per això es mesura a cada full.
    tops = []
    for i in fots:
        al = np.array(fotograma(im, i).split()[3]) > 24
        if central:
            cx = np.where(al[-60:].any(axis=0))[0]; c = (cx.min() + cx.max()) // 2        # centre dels peus
            al = al[:, max(0, c - 40):c + 40]
        ys, _ = np.where(al); tops.append(ys.min())
    return COS / (peus(im, range(16)) - float(np.median(tops)))

def main():
    filtre = sys.argv[1:]            # opcional: 'tiller:up' ... només aquests fulls
    for arma, fots0 in FOT.items():
        for d in DIRS:
            if filtre and f'{arma}:{d}' not in filtre: continue
            fots = FOT_EXC.get((arma, d), fots0)
            im = Image.open(ORIGEN / ORIGEN_EXC.get((arma, d), arma) / f'{d}.png').convert('RGBA')
            pf = peus(im, range(16)); K = escala(im, arma, (arma, d) in CENTRAL, ESCALA_FOTS.get((arma, d), (12, 13, 14, 15)))
            n = len(fots); cols = 4; files = (n + cols - 1) // cols
            out = Image.new('RGBA', (cols * CEL, files * CEL), (0, 0, 0, 0))
            # només a la branca en diagonal avall: la fulla baixa fins als peus (a les altres, el càlcul antic ja anava bé)
            ref = centre_peus(fotograma(im, fots[0])) if (arma, d) in AMB_REF else None
            antic = ref is None
            desp = peus_idle(d) if not antic else 0.0       # desplaçament dels peus de l'idle respecte al mig de la cel·la
            for j, i in enumerate(fots):
                fo = fotograma(im, i)
                g = fo.resize((round(SRC * K), round(SRC * K)), Image.LANCZOS)
                cel = Image.new('RGBA', (CEL, CEL), (0, 0, 0, 0))
                dx, dy = round(CEL / 2 + desp - centre_peus(fo, ref, antic) * K), round(CEL * 0.9375 - pf * K)
                cel.paste(g, (dx, dy), g)
                a = np.array(cel); vora = np.zeros_like(a); vora[:, :, 3] = (alfa_contorn(a[:, :, 3], GRUIX) * 255).astype(np.uint8)
                base = Image.fromarray(vora, 'RGBA'); base.alpha_composite(cel)
                out.paste(base, ((j % cols) * CEL, (j // cols) * CEL))
            out.save(DEST / f'atac_{arma}_{d}.webp', 'WEBP', quality=88, alpha_quality=100, method=6)
            print(arma, d, n, 'fotogrames, peus origen', round(pf), 'K', round(K, 3))

if __name__ == '__main__':
    main()
