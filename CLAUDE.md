# Runna: l'espasa del Miracle

Joc web en català fet amb **Phaser 3** (HTML + JS, sense motor ni bundler). Per provar-lo: `python serveix.py` i obre `http://localhost:8000/`.

## Fonts de veritat
- Guió i història: `docs/GUIO.md` (qualsevol canvi d'història es fa primer allà).
- Pla i prompts: `docs/PLA_FINAL.md`, `docs/PROMPTS_GRAFICS.md`.
- Estructura de carpetes: `README.md`.
- Codi: `js/` (una escena per lloc a `js/zones/`, catàleg d'imatges a `js/assets.js`, diàlegs a `js/dialegs.js`).
- `art/` són els originals; `assets/` el que carrega el joc. No editar `assets/` a mà (vegeu `eines/`).

## Convencions
- Textos del joc i del guió en català.
- No hi ha motor Godot/Unity/Unreal: ignora els agents i skills específics d'aquests motors.
- Els documents de disseny que generin les skills van a `design/`; els informes de QA a `production/qa/`.
- Aquest projecte només usa una part de "Claude Code Game Studios" (agents i skills de disseny, narrativa, nivells i QA). No hi ha hooks de commit/push activats.
