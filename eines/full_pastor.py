"""
Converteix un full d'animació del Pastor de Boira (art/enemics/pastor_<nom>.png, fons blanc) al WebP transparent del joc
(assets/enemics/pastor_<nom>.webp): una quadrícula de fotogrames de 300 x 300 (4 columnes).
    python eines/full_pastor.py <nom> [columnes_origen] [files_origen]
nom: idle (4 fotogrames), camina (8), apunta (4), carrega (6), bat (6), crida (6), cau (6) o aixeca (6).
columnes_origen / files_origen: la quadrícula de la imatge original (per defecte 4 columnes i les files que calguin).
Cada fotograma se separa, se li treu el fons blanc, i es fa servir UN SOL factor d'escala per a tots (el que fa càbrer el més gran
dins de 300 x 300 amb marge): així el personatge no canvia de mida entre fotogrames. Els peus (la vora de baix del dibuix) queden
sempre a la mateixa alçada i el cos, centrat. Cal Pillow.
"""
import os, sys
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
from treure_fons import treure_fons

FOTOGRAMES = {'idle': 4, 'camina': 8, 'apunta': 4, 'carrega': 6, 'bat': 6, 'crida': 6, 'cau': 6, 'aixeca': 6}
CEL, COLS, PEUS, MARGE = 300, 4, 276, 12

nom = sys.argv[1]
n = FOTOGRAMES[nom]
cols_o = int(sys.argv[2]) if len(sys.argv) > 2 else COLS
files_o = int(sys.argv[3]) if len(sys.argv) > 3 else -(-n // cols_o)
arrel = os.path.join(os.path.dirname(__file__), '..')
im = Image.open(os.path.join(arrel, 'art/enemics/pastor_%s.png' % nom)).convert('RGB')
cw, ch = im.width // cols_o, im.height // files_o
quadres = []
for i in range(n):
    c = im.crop(((i % cols_o) * cw, (i // cols_o) * ch, (i % cols_o + 1) * cw, (i // cols_o + 1) * ch))
    c = treure_fons(c)
    caixa = c.getchannel('A').point(lambda a: 255 if a > 24 else 0).getbbox()
    quadres.append(c.crop(caixa) if caixa else c)
f = min((CEL - 2 * MARGE) / max(q.width for q in quadres), (PEUS - MARGE) / max(q.height for q in quadres))
files = -(-n // COLS)
sortida = Image.new('RGBA', (COLS * CEL, files * CEL), (0, 0, 0, 0))
for i, q in enumerate(quadres):
    q = q.resize((max(1, round(q.width * f)), max(1, round(q.height * f))), Image.LANCZOS)
    x = (i % COLS) * CEL + (CEL - q.width) // 2
    y = (i // COLS) * CEL + PEUS - q.height
    sortida.alpha_composite(q, (x, y))
dest = os.path.join(arrel, 'assets/enemics/pastor_%s.webp' % nom)
sortida.save(dest, 'WEBP', quality=85, method=6)
print(dest, sortida.size, 'factor', round(f, 3))
