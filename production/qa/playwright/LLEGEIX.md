# Proves amb Playwright (headless)

Scripts de QA que fan servir Playwright (Chromium sense finestra) contra `http://localhost:8000/?proves`. No formen part del joc.

Preparació (una vegada): `npm i playwright && npx playwright install chromium` en una carpeta de treball (els scripts hi fan `require('playwright')`), copiar-hi aquests fitxers i engegar el servidor del joc (`python serveix.py`).
Els scripts escriuen captures i JSON a `C:/tmp/pw/out/` (cal crear-la) i llegeixen `production/qa/bot_combat.js` per ruta absoluta: ajusteu-ho si la carpeta del projecte canvia.

- `lib.js`: obre el joc, espera la càrrega i toca la pantalla per començar; recull errors de pàgina, de consola i de xarxa.
- `fumada.js`: entra a totes les zones (`Proves.anar`), mira errors, que l'Ineu aparegui i no estigui dins d'un obstacle, i fa una captura de cada una.
- `estructura.js`: coherència de `PROGRES` (fet/marca/pista de cada pas), sortides de totes les zones (destí i entrada existents) i connectivitat del graf.
- `abast.js`: BFS sobre la quadrícula de col·lisions: sortides i punts d'interacció als quals no s'arriba (poden ser falsos positius en sortides primes: verifiqueu-ho caminant).
- `combat.js <feines>`: bot de combat (`bot_combat.js`) amb `pastor3`, `raim5`, `oce5`, `oce6` i variants `ing` (bot ingenu).
- `regress.js`: Rovellonera d'una sola clariana, cartell, mida de l'Ineu entre caminar i idle, Cant del Miracle.
- `mobil.js`: 375x812 amb tàctil: mida del canvas i pergamí d'objectiu.
- `mussol2.js`: l'escultura del mussol de l'Hostatgeria (empenta amb els Guants).

Atenció: no feu servir més d'un navegador alhora: el servidor de `serveix.py` és d'un sol fil i comença a refusar connexions.
