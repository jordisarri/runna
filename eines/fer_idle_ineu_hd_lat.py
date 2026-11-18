#!/usr/bin/env python3
"""Idle de l'Ineu en ALTA RESOLUCIÓ, vistes esquerra i dreta → assets/ineu/idle/idle_elev_left.webp i idle_elev_right.webp (cel·les de 288 px, sense reduir al carregar).

    python3 eines/fer_idle_ineu_hd_lat.py

Complement d'eines/fer_idle_ineu_hd.py (que fa les altres sis direccions). Origen: art/ineu/v2/zip_idle_hd/idle_elev_left.png (AutoSprite, 4x4 de 512, regenerat gratis del mateix
vídeo que l'antic de 256: art/ineu/v2/alt/idle_elev_left.png). El dret és el mirall de l'esquerre. Mateix càlcul que eines/fer_ineu_v2_alt.py (escala, eixamplament lateral, peus i
centre), mesurat sobre el full de 256 i aplicat als píxels de 512 en una cel·la de 288; contorn a doble mida (gruix 3) i es baixa a 288.
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageOps
sys.path.insert(0, str(Path(__file__).resolve().parent))
from contorn_ineu import contorn
import fer_ineu_v2 as b
import fer_ineu_v2_alt as alt

HD = 512
CEL_HD = 288
R = CEL_HD / 256


def main():
    src = Image.open(b.ARREL / 'art' / 'ineu' / 'v2' / 'zip_idle_hd' / 'idle_elev_left.png').convert('RGBA')
    assert src.size == (4 * HD, 4 * HD), src.size
    hd_l = [src.crop(((q % 4) * HD, (q // 4) * HD, (q % 4) * HD + HD, (q // 4) * HD + HD)) for q in range(16)]
    hd_r = [ImageOps.mirror(c) for c in hd_l]
    for nom, fs_hd in (('idle_elev_left', hd_l), ('idle_elev_right', hd_r)):
        fs = b.fots(alt.ORIGEN / (nom + '.png'))                                  # el full de 256 que es va fer servir fins ara (per al càlcul)
        boxes = [b.bbox(x) for x in fs]
        f = b.ALT_VELLA / float(np.median([q[3] - q[2] + 1 for q in boxes]))
        fx = f * min(alt.MAX_ESTIR, max(1.0, alt.AMPLE_LAT / (float(np.median([q[1] - q[0] + 1 for q in boxes])) * f)))
        cx = float(np.median([(q[0] + q[1]) / 2 for q in boxes])); bot = float(np.median([q[3] for q in boxes]))
        dx, dy = round(128 - cx * fx), round(b.PEUS - bot * f)
        nx, ny = round(HD * fx * R / 2 * 2), round(HD * f * R / 2 * 2)             # mida de cada fotograma a doble resolució
        out = Image.new('RGBA', (4 * 2 * CEL_HD, 4 * 2 * CEL_HD), (0, 0, 0, 0))
        for q, im in enumerate(fs_hd):
            g = im.resize((nx, ny), Image.LANCZOS)
            cel = Image.new('RGBA', (2 * CEL_HD, 2 * CEL_HD), (0, 0, 0, 0))
            cel.paste(g, (round(dx * R * 2), round(dy * R * 2)), g)
            out.paste(cel, ((q % 4) * 2 * CEL_HD, (q // 4) * 2 * CEL_HD))
        out = contorn(out, 3).resize((4 * CEL_HD, 4 * CEL_HD), Image.LANCZOS)
        dest = b.DEST / 'idle' / (nom + '.webp')
        out.save(dest, 'WEBP', quality=90, alpha_quality=100, method=6)
        print(nom, 'f', round(f, 3), 'fx', round(fx, 3), '->', dest.name, out.size)


if __name__ == '__main__':
    main()
