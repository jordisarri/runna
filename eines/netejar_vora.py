#!/usr/bin/env python3
"""Treu la vora blanquinosa que queda al voltant d'un gràfic (i dels forats) en treure'n el fons blanc.
   python3 eines/netejar_vora.py FITXER.webp [RADI=2]
Els píxels de la vora (a menys de RADI px de la transparència) agafen el color del píxel opac més proper de l'interior;
l'alfa no es toca (la silueta queda igual). Serveix per a dibuixos pictòrics sobre fons blanc (la prunera, etc.)."""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage
f = sys.argv[1]; r = int(sys.argv[2]) if len(sys.argv) > 2 else 2
im = Image.open(f).convert('RGBA'); a = np.array(im)
opac = a[..., 3] > 200
interior = ndimage.binary_erosion(opac, iterations=r)
vora = (a[..., 3] > 0) & ~interior
idx = ndimage.distance_transform_edt(~interior, return_distances=False, return_indices=True)
nou = a.copy()
nou[vora, :3] = a[idx[0][vora], idx[1][vora], :3]
Image.fromarray(nou, 'RGBA').save(f, 'WEBP', quality=90, alpha_quality=100, method=6)
print(f, 'vora recolorada:', int(vora.sum()), 'px')
