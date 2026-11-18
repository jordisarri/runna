"""
Genera js/sombra_ineu.js: per a cada fotograma de l'idle (alta resolució) i dels atacs de l'Ineu, on són els peus respecte del punt d'ancoratge del sprite
(origen = centre de la cel·la en x, i la fila dels peus de la cel·la en y), en píxels de la fulla. El joc hi posa l'ombra (ombraIneu) a sota dels peus de veritat
i no al punt d'ancoratge: en diagonals i atacs (sobretot la branca i l'espasa cap a les diagonals) els peus queden uns quants píxels a un costat.
    python3 eines/fer_sombra_ineu.py
"""
import numpy as np, json, os
from PIL import Image
ARREL = os.path.join(os.path.dirname(__file__), '..')
PEUS = 240 / 256          # fracció de la cel·la on és l'origen en y (SPRITE_INEU.peus / alt)

def mesura(fr, cel):
    ys, xs = np.where(fr)
    if len(ys) < 200: return None
    h = ys.max() - ys.min()
    pe = ys > ys.max() - max(6, 0.12 * h)               # el tros de baix de tot: els peus
    return round(float(xs[pe].mean() - cel / 2), 1), round(float(ys.max() - cel * PEUS), 1)

def fulla(path, cel):
    im = np.array(Image.open(os.path.join(ARREL, path)).convert('RGBA'))
    H, W = im.shape[:2]; cols = W // cel; out = []
    for f in range((H // cel) * cols):
        r, c = divmod(f, cols)
        m = mesura(im[r*cel:(r+1)*cel, c*cel:(c+1)*cel, 3] > 40, cel)
        out.append(m or [0, 0])
    return out

dades = {}
for d, fitxer in [('down','idle_down'),('up','idle_up'),('left','idle_elev_left'),('right','idle_elev_right'),('northeast','idle_northeast'),('northwest','idle_northwest'),('southeast','idle_southeast'),('southwest','idle_southwest')]:
    dades['ineu_idle_' + d] = fulla(f'assets/ineu/idle/{fitxer}.webp', 288)
for arma in ['basto', 'tiller', 'espasa']:
    for d in ['down','up','left','right','northeast','northwest','southeast','southwest']:
        p = f'assets/ineu/atac/atac_{arma}_{d}.webp'
        if os.path.exists(os.path.join(ARREL, p)):
            dades[f'ineu_atac_{arma}_{d}'] = fulla(p, 480 if (arma, d) == ('basto', 'up') else 320)
with open(os.path.join(ARREL, 'js/sombra_ineu.js'), 'w', encoding='utf-8') as f:
    f.write("// Generat per eines/fer_sombra_ineu.py (no s'edita a mà): per a cada fotograma, [dx, dy] dels peus de l'Ineu respecte del punt d'ancoratge, en píxels de la fulla\n")
    f.write('const SOMBRA_INEU = ' + json.dumps(dades, separators=(',', ':')) + ';\n')
print(len(dades), 'fulles')
