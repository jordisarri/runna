#!/usr/bin/env python3
"""Passa a WebP transparent un dibuix (núvol, etc.) fet sobre un cel blau amb degradat: l'alfa surt de com de lluny és cada píxel del blau del fons (estimat per files a partir de les vores).
   python3 eines/treure_cel.py ORIGEN DESTÍ AMPLADA
Es treu també el blau que hi ha barrejat a les vores (descontaminació), perquè el núvol no quedi amb una aura blava sobre un altre cel."""
import sys
import numpy as np
from PIL import Image
src, dst, ample = sys.argv[1], sys.argv[2], int(sys.argv[3])
a = np.array(Image.open(src).convert('RGB')).astype(float)
H, W, _ = a.shape
# blau del fons per fila: mitjana de les dues vores laterals (24 px), que no toquen el núvol
bg = np.concatenate([a[:, :24], a[:, -24:]], axis=1).mean(axis=1)            # (H, 3)
bg = bg[:, None, :]
blanc = np.array([255., 252., 240.])
# alfa a partir del canal vermell, que és el que més separa el blau del blanc
al = np.clip((a[..., 0] - bg[..., 0]) / (blanc[0] - bg[..., 0] + 1e-6), 0, 1)
al = np.clip((al - 0.04) / 0.96, 0, 1)
al3 = np.maximum(al, 1e-3)[..., None]
col = np.clip((a - (1 - al3) * bg) / al3, 0, 255)
out = np.dstack([col, al * 255]).astype(np.uint8)
im = Image.fromarray(out, 'RGBA')
bb = im.getchannel('A').point(lambda v: 255 if v > 10 else 0).getbbox()
im = im.crop(bb)
h = round(im.height * ample / im.width)
im.resize((ample, h), Image.LANCZOS).save(dst, 'WEBP', quality=88, alpha_quality=100, method=6)
print(dst, im.size, '->', (ample, h))
