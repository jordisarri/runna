"""Full de l'atac AMUNT amb la branca del Til·ler, SENSE contorn, per retocar-lo a mà (Photoshop) abans de passar-lo al joc.

Agafa uns fotogrames escollits (comptant des de 1) de l'original art/ineu/atac_arma/tiller_v1/up.png (4x4 de 384) i els col·loca amb la mateixa escala i els mateixos
peus que fa servir eines/fer_atac_arma.py, a cel·les de 320 px (4 columnes, 5 fotogrames), SENSE el contorn d'1 px.

    python eines/fer_atac_tiller_up_editable.py [fotogrames comptats des de 1, ex.: 5 2 1 7 10]
Escriu art/ineu/atac_arma/tiller_up_per_editar.png (RGBA, 1280x640). Un cop retocat, cal posar-hi el contorn i convertir-lo a assets/ineu/atac/atac_tiller_up.webp
(vegeu eines/contorn_tiller_up.py).
"""
import sys
import numpy as np
from PIL import Image
import fer_atac_arma as f

FOTS_DEFECTE = [5, 2, 1, 7, 10]        # comptats des de 1
SORTIDA = f.ARREL / 'art' / 'ineu' / 'atac_arma' / 'tiller_up_per_editar.png'


def main():
    fots = [int(x) - 1 for x in (sys.argv[1:] or FOTS_DEFECTE)]
    im = Image.open(f.ORIGEN / 'tiller_v1' / 'up.png').convert('RGBA')
    pf = f.peus(im, range(16))
    K = f.escala(im, 'tiller', False)
    n = len(fots); cols = 4; files = (n + cols - 1) // cols
    out = Image.new('RGBA', (cols * f.CEL, files * f.CEL), (0, 0, 0, 0))
    for j, i in enumerate(fots):
        fo = f.fotograma(im, i)
        g = fo.resize((round(f.SRC * K), round(f.SRC * K)), Image.LANCZOS)
        cel = Image.new('RGBA', (f.CEL, f.CEL), (0, 0, 0, 0))
        dx, dy = round(f.CEL / 2 - f.centre_peus(fo, None, True) * K), round(f.CEL * 0.9375 - pf * K)
        cel.paste(g, (dx, dy), g)
        out.paste(cel, ((j % cols) * f.CEL, (j // cols) * f.CEL))
    SORTIDA.parent.mkdir(parents=True, exist_ok=True)
    out.save(SORTIDA)
    print(SORTIDA, out.size, 'fotogrames (des de 1):', [i + 1 for i in fots], 'K', round(K, 3))


if __name__ == '__main__':
    main()
