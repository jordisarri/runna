"""
Passa a WebP transparent una imatge de fons blanc (art/... -> assets/...), a l'amplada que el joc farà servir (amplada * 2).
Treu el blanc que toca les vores i, si es demana, també els forats blancs tancats prou grans (entre radis de rodes, barrots...).
    python eines/treure_fons.py ORIGEN DESTÍ AMPLADA [--forats MIDA_MIN] [--respecta y0,y1,x0,x1]
--forats: buida les taques de blanc gairebé pur tancades de com a mínim MIDA_MIN píxels (de l'original).
--respecta: fraccions (0-1) d'una zona on els blancs són del dibuix i no s'han de buidar (p. ex. un núvol de vapor).
Cal Pillow.
"""
import sys
from collections import deque
from PIL import Image, ImageFilter

LLINDAR = 228          # blanc del fons (des de les vores)
BLANC_PUR = 238        # forats tancats


def treure_fons(im, forats=0, respecta=None):
    im = im.convert('RGBA'); w, h = im.size; px = im.load()
    fons = bytearray(w * h)
    blanc = lambda x, y, ll: min(px[x, y][:3]) >= ll
    q = deque((x, y) for x in range(w) for y in (0, h - 1) if blanc(x, y, LLINDAR))
    q.extend((x, y) for y in range(h) for x in (0, w - 1) if blanc(x, y, LLINDAR))
    for x, y in q: fons[y * w + x] = 1
    while q:
        x, y = q.popleft()
        for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
            if 0 <= nx < w and 0 <= ny < h and not fons[ny*w+nx] and blanc(nx, ny, LLINDAR):
                fons[ny*w+nx] = 1; q.append((nx, ny))
    if forats:
        vist = bytearray(w * h)
        for y0 in range(h):
            for x0 in range(w):
                k = y0 * w + x0
                if fons[k] or vist[k] or not blanc(x0, y0, BLANC_PUR): continue
                comp, q = [k], deque([(x0, y0)]); vist[k] = 1
                while q:
                    x, y = q.popleft()
                    for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
                        if 0 <= nx < w and 0 <= ny < h:
                            kk = ny * w + nx
                            if not vist[kk] and not fons[kk] and blanc(nx, ny, BLANC_PUR):
                                vist[kk] = 1; comp.append(kk); q.append((nx, ny))
                if len(comp) < forats: continue
                if respecta:
                    cy = sum(k // w for k in comp) / len(comp) / h; cx = sum(k % w for k in comp) / len(comp) / w
                    if respecta[0] <= cy <= respecta[1] and respecta[2] <= cx <= respecta[3]: continue
                for kk in comp: fons[kk] = 1
    mask = Image.frombytes('L', (w, h), bytes(0 if f else 255 for f in fons)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    im.putalpha(mask)
    return im


if __name__ == '__main__':
    args = sys.argv[1:]
    forats = int(args[args.index('--forats') + 1]) if '--forats' in args else 0
    respecta = [float(v) for v in args[args.index('--respecta') + 1].split(',')] if '--respecta' in args else None
    origen, desti, amplada = args[0], args[1], int(args[2])
    im = treure_fons(Image.open(origen), forats, respecta)
    caixa = im.getchannel('A').point(lambda a: 255 if a > 24 else 0).getbbox()
    im = im.crop(caixa)
    im = im.resize((amplada * 2, round(im.height * amplada * 2 / im.width)), Image.LANCZOS)
    im.save(desti, 'WEBP', quality=85, method=6)
    print(desti, im.size)
