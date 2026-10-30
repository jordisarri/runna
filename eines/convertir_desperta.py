"""
Passa a WebP transparent la parella ineu_inconscient / jordi_desperta (art/personatges -> assets/personatges).
Totes dues surten amb el MATEIX retall (el del conjunt amb el Pare Jordi), perquè l'Ineu quedi exactament al mateix lloc
i el canvi d'una imatge a l'altra no faci cap salt.   python eines/convertir_desperta.py   (cal Pillow)
"""
from pathlib import Path
from collections import deque
from PIL import Image, ImageFilter

ARREL = Path(__file__).resolve().parent.parent
AMPLADA = 115 * 2
LLINDAR = 228
BLANC_PUR = 238          # forats tancats: blanc gairebé pur
FORAT_MIN = 2500         # i prou grans (en píxels de l'original), perquè no es buidin els reflexos

def treure_fons(im):
    im = im.convert('RGBA'); w, h = im.size; px = im.load()
    fons = bytearray(w * h)
    blanc = lambda x, y: min(px[x, y][:3]) >= LLINDAR
    q = deque((x, y) for x in range(w) for y in (0, h - 1) if blanc(x, y))
    q.extend((x, y) for y in range(h) for x in (0, w - 1) if blanc(x, y))
    for x, y in q: fons[y * w + x] = 1
    while q:
        x, y = q.popleft()
        for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
            if 0 <= nx < w and 0 <= ny < h and not fons[ny*w+nx] and blanc(nx, ny):
                fons[ny*w+nx] = 1; q.append((nx, ny))
    # Forats blancs tancats (entre un braç i el cos...): el fons no hi arriba des de les vores. Les taques de blanc gairebé pur
    # prou grans també són fons (l'hàbit del Pare Jordi és crema i no hi entra)
    vist = bytearray(w * h)
    for y0 in range(h):
        for x0 in range(w):
            k = y0 * w + x0
            if fons[k] or vist[k] or min(px[x0, y0][:3]) < BLANC_PUR: continue
            comp, q = [k], deque([(x0, y0)]); vist[k] = 1
            while q:
                x, y = q.popleft()
                for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
                    if 0 <= nx < w and 0 <= ny < h:
                        kk = ny * w + nx
                        if not vist[kk] and not fons[kk] and min(px[nx, ny][:3]) >= BLANC_PUR:
                            vist[kk] = 1; comp.append(kk); q.append((nx, ny))
            if len(comp) >= FORAT_MIN:
                for kk in comp: fons[kk] = 1
    mask = Image.frombytes('L', (w, h), bytes(0 if f else 255 for f in fons)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    im.putalpha(mask)
    return im

jordi = treure_fons(Image.open(ARREL / 'art/personatges/jordi_desperta.jpg'))
caixa = jordi.getchannel('A').point(lambda a: 255 if a > 24 else 0).getbbox()
for nom, im in (('jordi_desperta', jordi), ('ineu_inconscient', treure_fons(Image.open(ARREL / 'art/personatges/ineu_inconscient.jpg')))):
    r = im.crop(caixa)
    r = r.resize((AMPLADA, round(r.height * AMPLADA / r.width)), Image.LANCZOS)
    dest = ARREL / f'assets/personatges/{nom}.webp'
    r.save(dest, 'WEBP', quality=85, method=6)
    print(nom, r.size, dest.stat().st_size, 'caixa', caixa)
