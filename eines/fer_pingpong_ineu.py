#!/usr/bin/env python3
"""Converteix els fulls de l'Ineu del ping-pong (generats amb AutoSprite, d'esquena) a assets/ineu/pp_drive.webp i pp_reves.webp.

    python3 eines/fer_pingpong_ineu.py && python3 eines/contorn_ineu.py

Origen: art/ineu/pingpong/drive_esquena_sheet.png (cops des del carril del mig i de la dreta) i reves_esquena_sheet.png (carril de l'esquerra).
Són quadrícules 4x4 de fotogrames de 256 amb fons transparent. El segon pas (contorn_ineu.py) hi posa el contorn negre d'1 px i guarda l'original
sense contorn a art/ineu_caminar/sense_contorn/. Fotograma 0 = a punt; el cop de la pala és cap al fotograma 4.
"""
from pathlib import Path
from PIL import Image

ARREL = Path(__file__).resolve().parent.parent
PARELLS = [('drive_esquena_sheet.png', 'pp_drive'), ('reves_esquena_sheet.png', 'pp_reves')]
for origen, nom in PARELLS:
    f = ARREL / 'art' / 'ineu' / 'pingpong' / origen
    if not f.exists():
        print('Falta', f.relative_to(ARREL)); continue
    dest = ARREL / 'assets' / 'ineu' / (nom + '.webp')
    Image.open(f).convert('RGBA').save(dest, 'WEBP', quality=90, alpha_quality=100, method=6)
    # l'original sense contorn es guarda de nou (si no, contorn_ineu.py faria servir una còpia antiga)
    (ARREL / 'art' / 'ineu_caminar' / 'sense_contorn').mkdir(parents=True, exist_ok=True)
    (ARREL / 'art' / 'ineu_caminar' / 'sense_contorn' / (nom + '.webp')).write_bytes(dest.read_bytes())
    print('Escrit', dest.relative_to(ARREL))
