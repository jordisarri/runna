"""
Repara el 2n fotograma de l'atac amunt amb la branca del Til·ler (assets/ineu/atac/atac_tiller_up.webp), on la branca queda tallada pla per la vora de dalt del dibuix d'origen
(tots els fotogrames d'origen amb la branca alçada hi surten tallats: no n'hi ha cap de sencer). Es posa damunt del tall la corona de fulles del 3r fotograma (que és sencera i del
mateix dibuix), de manera que la branca acaba en un manat de fulles complet.
    python eines/fer_atac_arma.py tiller:up      (primer, genera el full)
    python eines/repara_branca_up.py             (després, repara el 2n fotograma; cal tornar-lo a executar cada cop que es regenera el full)
Només té sentit amb els fotogrames d'origen 8, 1, 10, 11, 12 (vegeu FOT_EXC a fer_atac_arma.py).
"""
from pathlib import Path
from PIL import Image

FULL = Path(__file__).resolve().parent.parent / 'assets' / 'ineu' / 'atac' / 'atac_tiller_up.webp'
CEL = 320
COSTAT = (140, 124, 200, 159)       # la corona del 3r fotograma (sense el cap: sota y=159 comença la pell)
POS = (123, 100)                    # on es posa al 2n, tapant el tall pla de la branca

im = Image.open(FULL).convert('RGBA')
cel = lambda i: im.crop((i * CEL, 0, i * CEL + CEL, CEL))
c1, corona = cel(1), cel(2).crop(COSTAT)
c1.alpha_composite(corona, POS)
im.paste(Image.new('RGBA', (CEL, CEL), (0, 0, 0, 0)), (CEL, 0))
im.alpha_composite(c1, (CEL, 0))
im.save(FULL, 'WEBP', quality=88, alpha_quality=100, method=6)
print('reparat', FULL)
