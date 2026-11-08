# Runna

Joc web fet amb Phaser 3. Per provar-lo en local: `python serveix.py` i obre `http://localhost:8000/`.

## Estructura

| Carpeta | Què hi ha |
|---|---|
| `index.html`, `manifest.json`, `sw.js`, `js/` | El joc (i l'aplicació instal·lable: `manifest.json`, el service worker `sw.js` i les icones d'`assets/pwa/`, que fa `eines/fer_icones.py`). `js/zones/` té una escena per cada lloc; `js/assets.js` és el catàleg d'imatges. |
| `assets/` | El que carrega el joc (WebP, M4A, MP4), ja comprimit. |
| `art/` | Els originals (JPG/PNG/MP3/MP4) a resolució completa. **No es carrega al joc.** |
| `docs/` | Guió (`GUIO.md`), prompts dels gràfics i instruccions de la música. |
| `eines/` | Scripts per passar `art/` a `assets/` (vegeu més avall). |

`art/` fa de mirall d'`assets/`: cada imatge és a la mateixa subcarpeta als dos llocs (`art/natura/arbre.png` → `assets/natura/arbre.webp`).

| Subcarpeta | Contingut |
|---|---|
| `personatges/` | Personatges i NPC (un fitxer per personatge, mateix nom que la clau del catàleg); `caminar/` desa els spritesheets de caminar. |
| `edificis/` | Edificis i interiors grans (església, retaule, Monestir…); `antics/` conserva composicions descartades. |
| `natura/` | Arbres, roques, plantes. |
| `objectes/` | Cartells, creu, bassadòria, mobles i objectes. |
| `enemics/` | Enemics i *bosses*; també les referències de l'ombra del monjo. |
| `armes/` | Bastó, branca del Til·ler, espasa Runna. |
| `ineu/` | Tot l'Ineu (vegeu sota). |
| `proleg/` | Els cinc vitralls del pròleg. |
| `musica/` | Cançons: a `art/` els MP3 originals, a `assets/` els M4A. |
| `video/` | Vídeos de la portada. A `art/video/antics/`, versions descartades. |
| `titol/`, `mapa/` | (només a `art/`) logo, portada i esbós del mapa. |

### L'Ineu

- `art/ineu/monjo aventurer.png` és la **referència d'estil** per a tots els gràfics; `fitxa_personatge.png` és la fitxa original.
- `art/ineu/flauta.jpg` és l'original de la postura tocant la flauta; `art/enemics/ombra_monjo_ref.jpg` i `art/edificis/antics/runes_amb_ombra.jpg` són referències visuals, no recursos carregats directament pel joc.
- `art/ineu_caminar/` conté els spritesheets de caminar (8 fotogrames, graella 4x2) i `costat/` els 16 fotogrames originals de costat; aquests es munten sense reescalar ni moure'ls en fulles 4x4 de 16 fotogrames per a dreta i esquerra (emmirallada). La resta de fulls usa una escala comuna per a totes les direccions i el mateix pivot a tots els fotogrames d'una fulla, sense retallar-los individualment. `art/ineu/caminar/` conserva els originals anteriors i les versions netejades. `art/ineu/atac/` i `aixeca/` són els atacs i les postures d'armes.
- `art/ineu_idle/` conté els originals de les postures d'aturat (16 fotogrames, graella 4x4); els fulls del joc en conserven un de cada dos (8 fotogrames, graella 4x2) i comparteixen escala per a totes les direccions, sense ajustar fotogrames individualment. Les tres orientacions que falten es reflecteixen en temps d'execució.
- `assets/ineu/`: `<direcció>.webp` (caminar), els cinc fulls base `idle_<direcció>.webp`, `atac_<direcció>.webp` i `aixeca_<arma>.webp`. `assets/ineu/antics/` desa els sprites de caminar anteriors per poder-los recuperar.

## Eines (`eines/`)

- `convertir_webp.js`: passa a WebP les imatges del catàleg (`art/<carpeta>/<nom>` → `assets/<carpeta>/<nom>.webp`) i els sprites de caminar d'`art/ineu_caminar/`, inclosos els fotogrames originals de `costat/`. Cal `sharp`.
- `convertir_atacs.js`: fulles d'atac de l'Ineu i espasa. Rebaixa una mica la saturació dels marrons de l'hàbit perquè coincideixin amb caminar/idle; les fulles d'abans de l'ajust es conserven a `art/ineu/atac/atac_<direcció>-abans-colors.webp`, inclosa la fulla d'atac amunt retocada a mà. Cal servir el joc i tenir Chrome.
- `comprimir_media.sh`: vídeos i música (cal `ffmpeg`).
- `personatges.json` i `edificis.json`: l'estil gràfic del joc (personatges/enemics i edificis/natura/objectes). Els prompts de `docs/PROMPTS_GRAFICS.md` en deriven.
- `generar_sprites.html`, `ajust_arma.html`, `netejar_ineu.js`, `prova_progres.js`: utilitats de desenvolupament.

Per afegir un gràfic: deixa l'original a `art/<carpeta>/<nom>.png|jpg`, afegeix-lo a `js/assets.js` i executa `node eines/convertir_webp.js`.

**Mode de proves:** obre `http://localhost:8000/?proves`. El botó 🧪 (a l'esquerra) permet començar just abans de qualsevol pas de la història, amb tot l'anterior fet (Runna, objectes, flags), o anar a qualsevol zona. Aquesta partida es desa a part i no toca la partida de veritat.
