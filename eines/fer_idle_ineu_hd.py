#!/usr/bin/env python3
"""Idle de l'Ineu en ALTA RESOLUCIÓ (sis direccions: down, up i les quatre diagonals) → assets/ineu/idle/idle_<direccio>.webp, cel·les de 288 px (abans, 256 reduïts a 192 al carregar-los).

    python3 eines/fer_idle_ineu_hd.py

Origen: art/ineu/v2/zip_idle_hd/<dir>.png (AutoSprite, 4x4 fotogrames de 512, regenerats gratis a partir del mateix vídeo de cada direcció: eines/README.md del Diari d'Ineu).
Es fa EXACTAMENT la mateixa transformació que a eines/fer_ineu_v2.py + eines/igualar_idle_ineu.py (mateixa escala, mateixos peus i centre, mateixa igualació amb el caminar), però sobre els píxels
de 512 i en una cel·la de 288 (= 256 · 1,125): així l'Ineu aturat fa la mateixa alçada a la pantalla que sempre, però amb 1,5 vegades més detall que a l'antic (192 px per cel·la, vegeu
SPRITE_INEU.k a js/assets.js). El contorn es fa a doble mida (576) amb gruix 3 i es baixa a 288 (≈ 1,5 px).
Les vistes esquerra i dreta (idle_elev_*) no es toquen: venen d'un altre vídeo (càmera elevada).
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image
sys.path.insert(0, str(Path(__file__).resolve().parent))
from contorn_ineu import contorn
import fer_ineu_v2 as b
import igualar_idle_ineu as g

HD = 512
CEL_HD = 288
R = CEL_HD / 256
DIRS_HD = ['down', 'up', 'southwest', 'southeast', 'northwest', 'northeast']
ORIGEN = b.ARREL / 'art' / 'ineu' / 'v2' / 'zip_idle_hd'


def main():
    # escala f de fer_ineu_v2 (mediana de les alçades de tots els fulls de 256)
    tots = {(t, d): b.fots(b.ARREL / 'art' / 'ineu' / 'v2' / f'zip_{t}' / f'{d}.png') for t in ('walk', 'idle') for d in b.DIRS}
    f = b.ALT_VELLA / float(np.median([b.bbox(x)[3] - b.bbox(x)[2] + 1 for fs in tots.values() for x in fs]))
    for d in DIRS_HD:
        fs = tots[('idle', d)]
        boxes = [b.bbox(x) for x in fs]
        cx = float(np.median([(q[0] + q[1]) / 2 for q in boxes])); bot = float(np.median([q[3] for q in boxes]))
        dx, dy = 128 - cx * f, b.PEUS - bot * f
        # factor d'igualació amb el caminar (igualar_idle_ineu.py), mesurat sobre les versions sense contorn de 256
        w, i = Image.open(b.SENSE / f'{d}.webp').convert('RGBA'), Image.open(b.SENSE / f'idle_{d}.webp').convert('RGBA')
        mw, mi = g.mesura(w), g.mesura(i)
        k = float(np.mean((mw[0] / mi[0], (mw[1] / mi[1]) ** .5, (mw[2] / mi[2]) ** .5))) * g.FACTOR_DIR.get(d, 1.0)
        # transformació total 256 → cel·la final: x = (128 - 128k) + k·(dx + u·f)   (u en píxels de la font de 256)
        sc = f * k * R / 2                              # per cada píxel de la font HD (512)
        ox, oy = (128 - 128 * k + k * dx) * R, (b.PEUS - b.PEUS * k + k * dy) * R
        src = Image.open(ORIGEN / f'{d}.png').convert('RGBA')
        assert src.size == (4 * HD, 4 * HD), src.size
        out = Image.new('RGBA', (4 * 2 * CEL_HD, 4 * 2 * CEL_HD), (0, 0, 0, 0))            # a doble mida, per al contorn
        n = round(HD * sc * 2)
        for q in range(16):
            fr = src.crop(((q % 4) * HD, (q // 4) * HD, (q % 4) * HD + HD, (q // 4) * HD + HD)).resize((n, n), Image.LANCZOS)
            cel = Image.new('RGBA', (2 * CEL_HD, 2 * CEL_HD), (0, 0, 0, 0))
            px, py = round(ox * 2), round(oy * 2)
            cel.paste(fr, (px, py), fr)
            out.paste(cel, ((q % 4) * 2 * CEL_HD, (q // 4) * 2 * CEL_HD))
        out = contorn(out, 3).resize((4 * CEL_HD, 4 * CEL_HD), Image.LANCZOS)
        dest = b.DEST / 'idle' / f'idle_{d}.webp'
        out.save(dest, 'WEBP', quality=90, alpha_quality=100, method=6)
        print(d.ljust(10), 'f', round(f, 3), 'k', round(k, 3), 'escala HD', round(sc, 4), '->', dest.name, out.size)


if __name__ == '__main__':
    main()
