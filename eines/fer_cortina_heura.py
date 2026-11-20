"""
Cortina d'heura de la pèrgola (art/objectes/cortina_heura.png, dibuix sobre fons blanc) -> assets/objectes/cortina_heura.webp, transparent i sense cap vora blanca.
A diferència de treure_fons.py (que només buida el blanc que toca les vores), aquí tot el blanc gairebé pur i sense color és fons, també el que queda tancat entre brots. Després s'afina:
es treuen els puntets, es redueix un píxel la vora i els píxels de la vora agafen el color de l'heura de dins, perquè no hi quedi cap aura blanca.
    python eines/fer_cortina_heura.py
"""
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ORIGEN, DESTI, AMPLE = 'art/objectes/cortina_heura.png', 'assets/objectes/cortina_heura.webp', 500

im = Image.open(ORIGEN).convert('RGB')
h = round(im.height * AMPLE / im.width)
im = im.resize((AMPLE * 2, h * 2), Image.LANCZOS)                 # es treballa al doble i es redueix al final (vora més neta)
a = np.asarray(im).astype(np.int16)
mn, mx = a.min(2), a.max(2)
fons = (mn >= 200) & ((mx - mn) < 42)                             # blanc o gris molt clar, sense color
dins = ~fons
dins = ndi.binary_opening(dins, iterations=1)                     # fora els puntets sols
etiq, n = ndi.label(dins)                                         # fora els trossos minúsculs
mides = ndi.sum(dins, etiq, range(1, n + 1))
dins = np.isin(etiq, [i + 1 for i, m in enumerate(mides) if m > 60])
dins = ndi.binary_fill_holes(dins) if False else dins
nucli = ndi.binary_erosion(dins, iterations=2)                    # l'heura segura (sense la vora)
# els píxels de la vora (dins, però a prop del fons) agafen el color del nucli més proper
_, (iy, ix) = ndi.distance_transform_edt(~nucli, return_indices=True)
rgb = a.copy()
vora = dins & ~nucli
rgb[vora] = a[iy[vora], ix[vora]]
alfa = ndi.gaussian_filter(ndi.binary_erosion(dins, iterations=1).astype(np.float32), 0.8)      # suavitzat de la vora
out = np.dstack([rgb.clip(0, 255).astype(np.uint8), (alfa * 255).clip(0, 255).astype(np.uint8)])
res = Image.fromarray(out, 'RGBA').resize((AMPLE, h), Image.LANCZOS)
res.save(DESTI, 'WEBP', quality=90, method=6)
print('fet', DESTI, res.size)
