#!/usr/bin/env python3
"""(El contorn es va descartar: només queda la baixada de saturació.) Contorn fosc (#120c08) i saturació més baixa per als gràfics pictòrics de natura (arbre, pi*) i rialla.
   python3 eines/contorn_natura.py
Igual que eines/contorn_armes.py: la 1a vegada copia l'actual assets/natura/<nom>.webp a art/natura/sense_contorn/<nom>.webp
(la versió «sense contorn», que és la font) i escriu el resultat a assets/natura/<nom>.webp. Es pot repetir sense acumular.
Si es torna a convertir un d'aquests gràfics amb convertir_webp.js, esborra art/natura/sense_contorn/<nom>.webp i torna a passar l'eina.
L'església i la resta d'edificis NO en duen (decisió de l'autor)."""
import os, colorsys
import numpy as np
from PIL import Image
from scipy import ndimage
ARREL = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
NOMS = ['arbre', 'pi', 'pi_arrels', 'pi_arrels_mortes', 'pi_pinyer', 'pi_tres_cants', 'pi_tres_cants_dos', 'pi_tres_cants_esq', 'pi_tres_cants_mort']
CONTORN = (0x12, 0x0c, 0x08)
GRUIX = 4            # px del webp (el joc el mostra a la meitat: ~2 px, com les roques noves)
GRUIX_FI = 3         # per als pins sense fulles (branques fines)
SAT = 0.88           # -12% de saturació (el tronc taronja de pi i els grocs d'arbre)

def satura(rgb, f, nomes_magenta=False):
    a = rgb.astype(np.float32) / 255
    mitja = a.mean(2, keepdims=True)
    magenta = ((a[..., 0] > a[..., 1] + 0.25) & (a[..., 2] > a[..., 1] + 0.12))[..., None]
    k = np.where(magenta, f, 1.0) if nomes_magenta else f
    res = mitja + (a - mitja) * k            # escala la distància al gris: baixa la saturació sense moure el to
    if nomes_magenta:                        # i el fúcsia, una mica més càlid (cap a rosa-coral)
        res[..., 1] = np.where(magenta[..., 0], np.minimum(1, res[..., 1] + 0.06), res[..., 1])
    return (np.clip(res, 0, 1) * 255).astype(np.uint8)

def contorn(im, r):
    im = im.convert('RGBA')
    pad = r + 1
    arr = np.pad(np.array(im), ((pad, pad), (pad, pad), (0, 0)))
    a = arr[..., 3] > 40
    dist = ndimage.distance_transform_edt(~a)
    anell = np.clip(r + 0.5 - dist, 0, 1)                 # 1 dins del radi, vora suavitzada
    alfa_orig = arr[..., 3] / 255.0
    out = np.zeros_like(arr, dtype=np.float32)
    sota = np.maximum(anell, alfa_orig)                   # el contorn cobreix fins on arriba la silueta
    for c in range(3): out[..., c] = CONTORN[c]
    res = out.copy()
    for c in range(3): res[..., c] = CONTORN[c] * (1 - alfa_orig) + arr[..., c] * alfa_orig
    res[..., 3] = sota * 255
    return Image.fromarray(np.clip(res, 0, 255).astype(np.uint8), 'RGBA')

def procesa(nom, nomes_magenta=False, amb_contorn=True):
    dest = os.path.join(ARREL, 'assets', 'natura', nom + '.webp')
    font = os.path.join(ARREL, 'art', 'natura', 'sense_contorn', nom + '.webp')
    if not os.path.exists(font):
        os.makedirs(os.path.dirname(font), exist_ok=True)
        Image.open(dest).save(font, 'WEBP', quality=90, method=6, lossless=False, exact=True)
    im = Image.open(font).convert('RGBA')
    a = np.array(im); a[..., :3] = satura(a[..., :3], SAT if not nomes_magenta else 0.9, nomes_magenta)
    im = Image.fromarray(a, 'RGBA')
    if amb_contorn: im = contorn(im, GRUIX_FI if 'tres_cants' in nom else GRUIX)
    im.save(dest, 'WEBP', quality=85, method=6, exact=True)
    print(nom, Image.open(font).size, '->', im.size, os.path.getsize(dest) // 1024, 'KB')

if __name__ == '__main__':
    for n in NOMS: procesa(n, amb_contorn=False)   # el contorn es va provar i es va descartar (queda malament als arbres); només es baixa la saturació
    procesa('rialla', nomes_magenta=True, amb_contorn=False)
