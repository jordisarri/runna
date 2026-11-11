#!/usr/bin/env python3
"""Variants laterals de l'Ineu v2 (esquerra/dreta) → assets/ineu_v2/alt/<nom>.webp.

    python3 eines/fer_ineu_v2_alt.py [gruix_contorn]

Origen: art/ineu/v2/alt/<nom>.png (4x4 de 256): idle_elev_left/right (idle amb càmera elevada, coroneta visible) i perfil_left/right (caminar de perfil).
Mateixa escala i mateix criteri de peus/centre que eines/fer_ineu_v2.py, i el mateix contorn.
El joc tria la combinació amb ?lat=elev (idle elevat + caminar pseudo-isomètric, per defecte) o ?lat=perfil (idle de perfil + caminar de perfil).
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image
sys.path.insert(0, str(Path(__file__).resolve().parent))
from contorn_ineu import contorn
import fer_ineu_v2 as b

ORIGEN = b.ARREL / 'art' / 'ineu' / 'v2' / 'alt'
DEST = b.DEST / 'alt'
AMPLE_LAT = 118.0   # amplada objectiu del cos de perfil (el caminar lateral actual fa ~115)
MAX_ESTIR = 1.3

def main():
    gruix = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    DEST.mkdir(parents=True, exist_ok=True)
    for p in sorted(ORIGEN.glob('*.png')):
        fs = b.fots(p); boxes = [b.bbox(x) for x in fs]
        # Cada full es porta a la mateixa alçada que els altres (224) i, com que de perfil l'Ineu queda més prim del que toca, s'eixampla fins a ~AMPLE_LAT px (com mínim sense encongir, màxim ×MAX_ESTIR).
        f = b.ALT_VELLA / float(np.median([q[3] - q[2] + 1 for q in boxes]))
        fx = f * min(MAX_ESTIR, max(1.0, AMPLE_LAT / (float(np.median([q[1] - q[0] + 1 for q in boxes])) * f)))
        cx = float(np.median([(q[0] + q[1]) / 2 for q in boxes])); bot = float(np.median([q[3] for q in boxes]))
        dx, dy = round(128 - cx * fx), round(b.PEUS - bot * f)
        out = Image.new('RGBA', (4 * b.CEL, 4 * b.CEL), (0, 0, 0, 0))
        for i, im in enumerate(fs):
            g = im.resize((round(b.CEL * fx), round(b.CEL * f)), Image.LANCZOS)
            cel = Image.new('RGBA', (b.CEL, b.CEL), (0, 0, 0, 0)); cel.paste(g, (dx, dy), g)
            out.paste(cel, ((i % 4) * b.CEL, (i // 4) * b.CEL))
        contorn(out, gruix).save(DEST / (p.stem + '.webp'), 'WEBP', quality=88, alpha_quality=100, method=6)
        print(p.stem, 'ok')

if __name__ == '__main__':
    main()
