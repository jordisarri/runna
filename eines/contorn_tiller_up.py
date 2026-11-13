"""Posa el contorn d'1 px (el mateix dels altres atacs) al full retocat de l'atac AMUNT amb la branca del Til·ler i el desa al joc.

    art/ineu/atac_arma/tiller_up_per_editar.png  →  assets/ineu/atac/atac_tiller_up.webp

El PNG s'ha generat amb eines/fer_atac_tiller_up_editable.py (sense contorn) i s'ha retocat a mà. Cel·les de 320 px, 4 columnes.
"""
import numpy as np
from PIL import Image
import fer_atac_arma as f

ORIGEN = f.ARREL / 'art' / 'ineu' / 'atac_arma' / 'tiller_up_per_editar.png'
DEST = f.DEST / 'atac_tiller_up.webp'


def main():
    im = Image.open(ORIGEN).convert('RGBA')
    out = Image.new('RGBA', im.size, (0, 0, 0, 0))
    for y in range(0, im.size[1], f.CEL):
        for x in range(0, im.size[0], f.CEL):
            cel = im.crop((x, y, x + f.CEL, y + f.CEL))
            a = np.array(cel)
            if not (a[:, :, 3] > 0).any():
                continue
            vora = np.zeros_like(a)
            vora[:, :, 3] = (f.alfa_contorn(a[:, :, 3], f.GRUIX) * 255).astype(np.uint8)
            base = Image.fromarray(vora, 'RGBA')
            base.alpha_composite(cel)
            out.paste(base, (x, y))
    out.save(DEST, 'WEBP', quality=88, alpha_quality=100, method=6)
    print(DEST, out.size)


if __name__ == '__main__':
    main()
