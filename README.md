# Runna

Joc web fet amb Phaser 3. Per provar-lo en local: `python serveix.py` i obre `http://localhost:8000/`.

## Estructura

| Carpeta | Què hi ha |
|---|---|
| `index.html`, `js/` | El joc. `js/zones/` té una escena per cada lloc; `js/assets.js` és el catàleg d'imatges. |
| `assets/` | El que carrega el joc (WebP, M4A, MP4), ja comprimit. |
| `art/` | Els originals (JPG/PNG/MP3/MP4) a resolució completa. **No es carrega al joc.** |
| `docs/` | Guió (`GUIO.md`), prompts dels gràfics i instruccions de la música. |
| `eines/` | Scripts per passar `art/` a `assets/` (vegeu més avall). |

`art/` fa de mirall d'`assets/`: cada imatge és a la mateixa subcarpeta als dos llocs (`art/natura/arbre.png` → `assets/natura/arbre.webp`).

| Subcarpeta | Contingut |
|---|---|
| `personatges/` | Personatges i NPC (un fitxer per personatge, mateix nom que la clau del catàleg). |
| `edificis/` | Edificis i interiors grans (església, retaule, Monestir…). |
| `natura/` | Arbres, roques, plantes. |
| `objectes/` | Cartells, creu, bassadòria, mobles i objectes. |
| `enemics/` | Enemics i *bosses*. |
| `armes/` | Bastó, branca del Til·ler, espasa Runna. |
| `ineu/` | Tot l'Ineu (vegeu sota). |
| `proleg/` | Els cinc vitralls del pròleg. |
| `musica/` | Cançons: a `art/` els MP3 originals, a `assets/` els M4A. |
| `video/` | Vídeos de la portada. A `art/video/antics/`, versions descartades. |
| `titol/`, `mapa/` | (només a `art/`) logo, portada i esbós del mapa. |

### L'Ineu

- `art/ineu/monjo aventurer.png` és la **referència d'estil** per a tots els gràfics; `fitxa_personatge.png` és la fitxa original.
- `art/ineu/caminar/` (fulles originals amb fons blanc) i `caminar/transparents/` (netejades); `atac/`, `aixeca/` (quan alça el bastó/branca/espasa) i `antics/` (versions descartades).
- `assets/ineu/`: `<direcció>.webp` (caminar), `atac_<direcció>.webp`, `aixeca_<arma>.webp` i `costat.webp`.

## Eines (`eines/`)

- `convertir_webp.js`: passa a WebP les imatges del catàleg (`art/<carpeta>/<nom>` → `assets/<carpeta>/<nom>.webp`). Cal `sharp`.
- `convertir_atacs.js`: fulles d'atac de l'Ineu i espasa. Cal servir el joc i tenir Chrome.
- `comprimir_media.sh`: vídeos i música (cal `ffmpeg`).
- `personatges.json` i `edificis.json`: l'estil gràfic del joc (personatges/enemics i edificis/natura/objectes). Els prompts de `docs/PROMPTS_GRAFICS.md` en deriven.
- `generar_sprites.html`, `ajust_arma.html`, `netejar_ineu.js`, `prova_progres.js`: utilitats de desenvolupament.

Per afegir un gràfic: deixa l'original a `art/<carpeta>/<nom>.png|jpg`, afegeix-lo a `js/assets.js` i executa `node eines/convertir_webp.js`.

**Mode de proves:** obre `http://localhost:8000/?proves`. El botó 🧪 (a l'esquerra) permet començar just abans de qualsevol pas de la història, amb tot l'anterior fet (Runna, objectes, flags), o anar a qualsevol zona. Aquesta partida es desa a part i no toca la partida de veritat.
