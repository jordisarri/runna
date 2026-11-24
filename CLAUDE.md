# Runna: l'espasa del Miracle

Joc web en català fet amb **Phaser 3** (HTML + JS, sense motor ni bundler). Per provar-lo: `python serveix.py` i obre `http://localhost:8000/`.

## Fonts de veritat
- Guió i història: `docs/GUIO.md` (qualsevol canvi d'història es fa primer allà).
- Prompts dels gràfics: `docs/PROMPTS_GRAFICS.md`. Textos numerats del joc: `docs/TEXTS.md`. Documents antics (roadmap, pla final, guió complet; pla de zoom i guió/combat de la lluita final, ja implementats): `art/arxiu/docs/` i `art/arxiu/design/` (només consulta; ja no s'actualitzen). `design/game-brief.md` és el resum del joc que llegeixen les skills.
- Estructura de carpetes: `README.md`.
- Codi: `js/` (una escena per lloc a `js/zones/`, catàleg d'imatges a `js/assets.js`, diàlegs a `js/dialegs.js`).
- `art/` són els originals; `assets/` el que carrega el joc. No editar `assets/` a mà (vegeu `eines/`).

## Convencions
- **Textos numerats:** `docs/TEXTS.md` recull TOTES les frases del joc amb qui les diu, numerades i en ordre cronològic aproximat (el jugador/autor hi corregeix dient «al text 45 canvia...»). Cada cop que canvia qualsevol text del joc (diàlegs, avisos, pensaments de l'Ineu, cartells, pròleg), cal executar `python3 eines/fer_textos.py` i desar `docs/TEXTS.md` i `docs/textos_ids.json` (el registre que manté els números estables). Si surt una conversa nova «sense classificar», afegeix-la a `SECCIONS` d'`eines/fer_textos.py`. Per trobar el text *N*, mira'l a `docs/textos_ids.json` (fitxer i línia) o cerca'n el text al codi. **Si l'autor edita directament `docs/TEXTS.md`** (canviant el text o el personatge d'una frase numerada), executa `python3 eines/aplica_textos.py` (amb `--prova` primer): passa els canvis al codi, comprova la sintaxi i torna a generar el document; avisa dels textos que no es poden canviar automàticament (els calculats amb […]) i els fa a mà. No afegeix ni treu frases.
- **Cada cop que canviï codi de `js/`, cal pujar el número `?v=` d'`index.html`** (p. ex. `sed -i 's/2611162600/<nou>/g' index.html`, amb la data i l'hora: AAMMDDHHMM): el service worker (`sw.js`) guarda el codi per adreça i, si no canvia, el mòbil segueix veient la versió vella.
- **Qualitat dels sprites en passar-los a WebP:** no reduir mai la resolució dels originals sense necessitat. Un personatge que es veu gran (combats, converses amb zoom) ha de tenir prou píxels per a la mida a què es dibuixa amb el zoom de càmera i la densitat de píxels del mòbil (×2–×3): comprova-ho amb una captura a `deviceScaleFactor: 2` i zoom de càmera 2, i si es veu borrós, torna a muntar el WebP des de l'original a més resolució (cel·les més grans, o regenerar el full a AutoSprite a 512 amb `regenerate_spritesheet`, que és gratis), no ampliïs un full petit. Exemple: `eines/fer_pastor_camina_hd.py`.
- **Idiomes (castellà, francès, anglès):** el joc s'escriu en català i `js/idioma.js` tradueix cada text en posar-lo a la pantalla (intercepta `Text.setText` de Phaser), buscant el text català exacte a `js/textos/<idioma>.js`. Aquests fitxers NO s'editen a mà: les traduccions són a `docs/traduccions/<idioma>.json` (`textos` per número de `TEXTS.md`, `interficie` per text català; els textos que es construeixen amb trossos van amb `{0}`) i es generen amb `python3 eines/fer_traduccions.py` (diu quants en falten i quines traduccions cal revisar perquè el català ha canviat; `--pendents es` fa la llista dels que falten). Al joc, `Idioma.mostraPendents()` a la consola llista els textos vistos sense traducció. Idioma: menú del títol o `?idioma=es`.
- Textos del joc i del guió en català.
- No hi ha motor Godot/Unity/Unreal: ignora els agents i skills específics d'aquests motors.
- Els documents de disseny que generin les skills van a `design/`; els informes de QA a `production/qa/`.
- Aquest projecte només usa una part de "Claude Code Game Studios" (agents i skills de disseny, narrativa, nivells i QA). No hi ha hooks de commit/push activats.
