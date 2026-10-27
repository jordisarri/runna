# Prompts per als gràfics que falten

## Gràfics fets

- [x] `alzina_buida`
- [x] `arbre`
- [x] `arma_basto`
- [x] `arma_tiller`
- [x] `bassadoria`
- [x] `bolet`
- [x] `branca`
- [x] `casa_gran`
- [x] `cel_stantoni`
- [x] `cercle_bolets`
- [x] `creu`
- [x] `creu_desaparicio`
- [x] `ermita`
- [x] `ermita_gabriel`
- [x] `esbarzer`
- [x] `esglesia`
- [x] `frederic`
- [x] `germa_andreu`
- [x] `germa_francesc`
- [x] `hostatgeria`
- [x] `isidre`
- [x] `josep`
- [x] `juli`
- [x] `monestir`
- [x] `nena_trenes`
- [x] `ocellaire`
- [x] `pare_alcui`
- [x] `pare_daniel`
- [x] `pare_jordi`
- [x] `pastor_boira`
- [x] `pi`
- [x] `pi_pinyer`
- [x] `pianista`
- [x] `retaule`
- [x] `retaule_obert`
- [x] `roca`
- [x] `roure`
- [x] `rovello`
- [x] `runes`
- [x] `sala_pingpong`
- [x] `tiller`
- [x] `proleg/ocellaire`
- [x] `xiprer`

Cada gràfic va a `assets/<carpeta>/<nom>.png` (carpetes: `edificis`, `personatges`, `enemics`, `natura`, `objectes`, `armes`; la carpeta de cada
gràfic es veu a `CATALEG`, a `js/assets.js`). Si el fitxer no hi és, el joc fa servir un dibuix provisional fet amb codi
(vegeu `CATALEG` a `js/assets.js`). Quan hi poses el PNG, apareix sol: no cal tocar res més.

**Cada prompt és complet:** porta l'estil base, la descripció i la perspectiva. Només cal copiar el bloc (a GitHub hi ha un
botó de copiar a dalt a la dreta de cada bloc) i enganxar-lo al generador.

**Com es processen:** el joc retalla els marges, treu el fons blanc connectat a les vores i redueix la imatge a l'amplada
indicada. Per això: fons blanc pur i res de blanc a la vora de l'objecte.

**Referències ja fetes** (si el generador admet imatge de referència, pujeu-la i digueu "same art style"):
`assets/edificis/esglesia.png` (edifici), `assets/natura/roure.png` (arbre), `assets/sprites/ineu/down.png` (personatge), i `art/monjo aventurer.png` (referència d'estil per a tot).

**Estil gràfic:** tots els prompts (menys els del Pròleg) estan adaptats a l'estil de `art/monjo aventurer.png`: il·lustració de conte *cartoon* rodona i grassoneta, contorn marró fosc gruixut i uniforme, ombrejat tipus *cel-shading* suau amb una mica de gra, paleta càlida i saturada de marrons, crema i ocres. **Pugeu sempre aquesta imatge com a referència** i digueu «same art style as the reference image».

**Perspectiva:** els **edificis** es veuen com a *A Link to the Past*: façana de cara i teulada visible des de dalt, sense parets laterals. La resta d'objectes, vista 3/4 des de dalt (uns 30°) i de cara a la càmera.
Els objectes plans (taules, basses, lloses) es veuen des d'uns 45°. Ja està inclòs a cada prompt.

## Estat

**Pendents** (el joc encara fa servir el dibuix provisional): `altar`, `cabana`, `carro_sansa`, `carruatge`, `caseta_joc`, `cel_ntrasra`, `cel_stbenet`, `cofre`, `columna`, `columna_proces`, `daniel_t`, `diposit`, `eloi`, `escolopendra`, `espelma`, `farigola`, `flors`, `foc`, `font_sj`, `garf`, `gripau`, `herba_sj`, `home_carruatge`, `home_raim`, `jaumeta`, `jordi_caseta`, `judit`, `lapida`, `llac`, `llosa`, `marit_neus`, `masia`, `monja_charm`, `monja_pains`, `monja_phili`, `neus`, `ocell`, `olla`, `ombra_monjo`, `ovella`, `ovella_boira`, `pastor_a`, `pastor_b`, `pastor_vell`, `pergami`, `pergola`, `porxo`, `romani`, `runna_pedra`, `sansa`, `taula_pedra`, `taula_pp`, `taula_sopar`, `taverna`, `telescopi_mon`, `tieta`, `tieta2`, `tomba_esquerdada`, `turbo`, `visitant`, `yordi`.

**Nous, encara sense ús al joc** (preparats per a quan es facin): `andreu_guardia`, `arbre_sec`, `ferralla`, `gabia`, `gabia_oberta`, `guants_poder`, `home_raim_desperta`, `ocell_boira`, `ram_flors`, `ratpenat_boira`, `runes_ombra`.

Els prompts de sota són només dels pendents i dels nous (els fets només es llisten dalt de tot).

---

## Edificis

### `taverna.png` (amplada 640) *(La Taverna, entre l'Hostatgeria i els arcs de la Casa Gran. Edifici de poble de dues plantes, amb una ensenya de ferro. La porta és tancada: la Carmen no obre. El joc l'espera a `assets/edificis/taverna.webp`; si el poses com a PNG, passa'l amb eines/convertir_webp.js.)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. The front facade of an old village tavern with two floors: ground floor of rough ochre sandstone blocks with two small barred windows on each side, a central round-arched wooden door with a stone frame and a small iron lantern, a wrought-iron bracket sign hanging to the right of the door showing a golden beer mug on a cream disc (no text); the upper floor in warm cream plaster with five windows with open green wooden shutters and warm light inside; stone corner quoins, a wooden beam cornice with visible beam ends under a low pitched roof of terracotta tiles. A couple of wooden barrels stacked beside the door. Cozy, slightly weathered. About 1.6:1 width to height. Camera angle like The Legend of Zelda: A Link to the Past, classic 3/4 top-down, camera looking down at about 35-40 degrees: the main facade faces the viewer straight on and is clearly visible, and ABOVE it the roof is visible from above, with the roof planes sloping away from the viewer in perspective (you can see the roof surface and ridge). EVERY roof is a pitched, sloped roof covered with visible rows of terracotta clay tiles, NEVER a flat roof. Strictly NO side walls visible, the building is symmetrical left to right, not rotated, not isometric, a flat ground line along the bottom edge of the image.
```

### `cel_stbenet.png` (amplada 420) *(Cel·les de Sant Benet (referència: la foto de Sant Benet). Edifici petit.)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. The front facade of a small plain sandstone residence building in warm ochre stone with orange brick details: a gabled front with a stepped cornice, a small round window in the gable, two tall round-arched windows with brick-orange frames and dark shutters, a small low wooden door; modest, simple and calm. About 1.4:1 width to height. Camera angle like The Legend of Zelda: A Link to the Past, classic 3/4 top-down, camera looking down at about 35-40 degrees: the main facade faces the viewer straight on and is clearly visible, and ABOVE it the roof is visible from above, with the roof planes sloping away from the viewer in perspective (you can see the roof surface and ridge). EVERY roof is a pitched, sloped roof covered with visible rows of terracotta clay tiles, NEVER a flat roof. Strictly NO side walls visible, the building is symmetrical left to right, not rotated, not isometric, a flat ground line along the bottom edge of the image.
```

### `cel_ntrasra.png` (amplada 560) *(Cel·les de Nostra Senyora (referència: les fotos de Nostra Senyora). És l'edifici GRAN, i Sant Benet és el petit que té al costat.)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. The front facade of a large three-storey rectangular block of rough brown fieldstone masonry with pale stone corner quoins, a low-pitched roof of orange terracotta tiles with slightly projecting eaves; regular grid of round-arched windows (four columns by three rows), each with a light stone frame and brown wooden shutters, the bottom row with black iron grilles; austere and quiet. About 1.3:1 width to height. Camera angle like The Legend of Zelda: A Link to the Past, classic 3/4 top-down, camera looking down at about 35-40 degrees: the main facade faces the viewer straight on and is clearly visible, and ABOVE it the roof is visible from above, with the roof planes sloping away from the viewer in perspective (you can see the roof surface and ridge). EVERY roof is a pitched, sloped roof covered with visible rows of terracotta clay tiles, NEVER a flat roof. Strictly NO side walls visible, the building is symmetrical left to right, not rotated, not isometric, a flat ground line along the bottom edge of the image.
```

### `runes_ombra.png` (amplada 760) *(Les Runes amb l'ombra del monjo ja projectada al mur. És l'edició del gràfic `runes` que ja tens: puja'l al generador com a imatge de referència i demana aquest canvi. Surt a `assets/edificis/runes_ombra.png`; el joc el mostrarà superposat a `runes` i li farà «respirar» l'opacitat.)*

**Com ha de ser l'ombra (perquè sigui convincent):**
- **On:** al llenç llis de pedra a l'ESQUERRA de la porta fosca d'arc (entre l'arc lateral amb el xiprer i la porta), aproximadament entre el 36% i el 47% de l'ample i entre el 52% i el 78% de l'alçada. Així no tapa la porta, ni les finestres, ni s'enfonsa a la zona que ja és d'ombra natural a la dreta de la porta (allà no es llegiria).
- **Què:** un monjo encaputxat, de perfil cap a la porta, agenollat i corbat endavant amb les mans unides, com si pregués. Silueta clara i llegible d'un cop d'ull (la caputxa punxeguda i les mans unides són el que la fa «monjo»).
- **Mida:** uns 28% de l'alçada de la imatge (una mica més que l'Ineu en pantalla).
- **Com és d'«ombra de mur»:** els carreus la «trenquen» (la silueta fa un petit salt a les juntes de les pedres) i les línies de pedra es continuen veient a través; vora suau però definida; color índigo-violeta profund translúcid (≈55% d'opacitat), mai negre pla. Una molt tènue llum violeta a la vora la fa sobrenatural: **no hi ha cap objecte que la projecti** (la llum de l'escena ve de dalt a l'esquerra, i aquesta ombra no hi obeeix).
- **Estil:** el mateix d'aquest gràfic (pintat a mà, cel·shading suau); l'ombra no té contorn marró.

```
Use the attached image of the ruined church facade as the exact base (image-to-image edit). Keep EVERYTHING identical: same canvas size and aspect ratio, same composition, the same lines, colors, outlines, lighting, vegetation and the plain pure white background. Do not redraw, crop, shift, rescale or restyle anything. Change only one thing: add the cast shadow of a praying monk on the large flat sandstone wall to the LEFT of the dark arched doorway (between the left arched side-vault with the cypress and the doorway), spanning roughly 36%-47% of the image width and 52%-78% of its height, clearly clear of the doorway and the windows. The shadow is the silhouette of a hooded monk in a long habit seen in profile facing the doorway, kneeling and bowed forward with his hands joined in prayer, pointed hood, about 28% of the image height tall. Make it look truly cast on the wall: it breaks slightly at the joints of the stone blocks and the stone lines stay visible through it, soft but defined edges, translucent deep indigo-violet at about 55% opacity (never flat black), no brown outline, with a very faint violet glow along its edge so that it feels uncanny, as if nothing is casting it. Same flat hand-painted cel-shaded storybook style as the base image. No extra characters, no text, no light rays, no changes anywhere else.
```

**Variant per superposar amb animació (opcional, millor per al joc):** si prefereixes tenir l'ombra com a capa a part (així el joc la pot fer aparèixer, desaparèixer i respirar sense duplicar tot el gràfic), demana això després de l'anterior:

```
Using the previous result, output a second image with the EXACT same canvas size, aspect ratio and framing, containing ONLY the monk's shadow, at exactly the same position and size, on a plain pure white (#FFFFFF) background: no wall, no building, no ground, no other elements. Keep the shadow's translucent deep indigo-violet color, its soft edges and its faint violet glow. Do not move or resize it.
```

### `caseta_joc.png` (amplada 240) *(Caseta de joc del jardí de la masia d'en Jordi. Dins hi ha la palanca. Ja té un dibuix provisional al joc.)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. The front facade of a small wooden playhouse for children in a farm garden: walls of vertical planks painted warm yellow with a red painted base strip, a small round window with a cross-shaped frame, a small arched red wooden door with a golden knob, a little pitched roof of blue-painted wooden shingles, a tiny red pennant flag on the ridge, a toy blue bucket and a small wooden spade leaning at the side; cozy, a bit worn, child-sized (looks only slightly taller than a person). About 1.05:1 width to height. Camera angle like The Legend of Zelda: A Link to the Past, classic 3/4 top-down, camera looking down at about 35-40 degrees: the main facade faces the viewer straight on and is clearly visible, and ABOVE it the roof is visible from above. Strictly NO side walls visible, symmetrical left to right, not rotated, not isometric, a flat ground line along the bottom edge of the image.
```

### `masia.png` (amplada 520)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A Catalan masia farmhouse, wide stone walls, a low gabled roof, an arched doorway, an outdoor stone bench. Camera angle like The Legend of Zelda: A Link to the Past, classic 3/4 top-down, camera looking down at about 35-40 degrees: the main facade faces the viewer straight on and is clearly visible, and ABOVE it the roof is visible from above, with the roof planes sloping away from the viewer in perspective (you can see the roof surface and ridge). EVERY roof is a pitched, sloped roof covered with visible rows of terracotta clay tiles, NEVER a flat roof. Strictly NO side walls visible, the building is symmetrical left to right, not rotated, not isometric, a flat ground line along the bottom edge of the image.
```

### `cabana.png` (amplada 330)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A small dry-stone shepherd's hut with a flat stone roof, a wooden door, a bundle of firewood. Camera angle like The Legend of Zelda: A Link to the Past, classic 3/4 top-down, camera looking down at about 35-40 degrees: the main facade faces the viewer straight on and is clearly visible, and ABOVE it the roof is visible from above, with the roof planes sloping away from the viewer in perspective (you can see the roof surface and ridge). EVERY roof is a pitched, sloped roof covered with visible rows of terracotta clay tiles, NEVER a flat roof. Strictly NO side walls visible, the building is symmetrical left to right, not rotated, not isometric, a flat ground line along the bottom edge of the image.
```

### `diposit.png` (amplada 300)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A round stone water tank (cistern) with a domed top, a rusty iron hatch and a pipe. Camera angle like The Legend of Zelda: A Link to the Past, classic 3/4 top-down, camera looking down at about 35-40 degrees: the main facade faces the viewer straight on and is clearly visible, and ABOVE it the roof is visible from above, with the roof planes sloping away from the viewer in perspective (you can see the roof surface and ridge). EVERY roof is a pitched, sloped roof covered with visible rows of terracotta clay tiles, NEVER a flat roof. Strictly NO side walls visible, the building is symmetrical left to right, not rotated, not isometric, a flat ground line along the bottom edge of the image.
```

---

## Elements d'escenari

### `font_sj.png` (amplada 190) *(Font del Bisbe, al Bosc de Sant Joan: centre de la clariana. Antiga font de pedra adormida, que torna a rajar quan es fa la missió de les herbes)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. An old ornate stone fountain, the 'Bishop's Fountain', centered and symmetric, built in warm pale grey sandstone: two wide round stepped tiers at the base, a large round basin with a thick carved rim and, on the front of the basin, a bishop's mitre carved in relief; the basin holds dark murky still water with a faint lilac tint and a few ripples; from the middle of the basin rises a fluted stone pedestal carrying a smaller upper bowl, topped by a small finial with a mitre and a cross; the fountain is dry and neglected: green moss on the steps and rim, ivy climbing the pedestal, small cracks in the stone, a few drifting wisps of violet mist at its base. Rich craftsmanship, readable at small size, about 1:1 width to height. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `herba_sj.png` (amplada 70) *(Herba de Sant Joan (hipèric): la primera de les tres herbes de la font del bosc. Es veu des de lluny: ha de ser clara i vistosa)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A small clump of Saint John's wort (hypericum): six slender green stems fanning out with small oval opposite leaves and, at the tip of each stem, a bright golden-yellow five-petal flower with orange stamens; fresh and lively, slightly luminous, very readable at small size, about 1:1.1 width to height. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `romani.png` (amplada 70) *(Romaní: substitueix la ruda com a segona herba de la font)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A small bushy sprig of rosemary: several woody brown stems rising with dense narrow dark-green needle-like leaves along them and clusters of tiny pale blue-lilac flowers near the tips; aromatic, silvery-green tones, very readable at small size, about 1:1.1 width to height. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `farigola.png` (amplada 70) *(Farigola: la tercera herba de la font)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A low round cushion of wild thyme: a dense dome of tiny grey-green round leaves covered in small pink-lilac flowers, a few thin woody stems at the base; compact, soft, very readable at small size, about 1.4:1 width to height. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```
### `columna_proces.png` (amplada 64) *(Columna de la processó del camí de la Desaparició (referència: la foto del camí). Una de sola, serveix per a les 12: el signe de cada una es mostra al quadre de diàleg. Es fa servir a les 12 columnes del camí de la Desaparició.)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A short wayside shrine pillar of rough grey fieldstone masonry with a slightly crooked, hand-built look, lichen and moss on the stone, a flat stone cap on top; on its front face a rectangular ceramic tile panel (azulejo) set into the stone with a thin yellow-ochre and blue border, painted in warm folk-art colours (cobalt blue, mustard yellow, terracotta) showing a simple abstract pilgrim sign in the middle; the panel is slightly weathered. About 1:2 width to height. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `columna.png` (amplada 58) *(Columna de la pèrgola del Jardí de l'Hostatgeria (esvelta, de pedra; no és la del camí de la Desaparició). Es fa servir a les dues files de la pèrgola, escalada ×1,4: ha de ser ALTA i estreta, perquè les arcades arribin a l'alçada de la planta baixa de la casa.)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A tall slender round stone column of pale grey sandstone seen from the front: a square plinth base, a smooth shaft with subtle vertical shading and a bit of moss near the bottom, and a plain square capital with a small cornice on top, ready to carry an arch on both sides. Height about 2.4 times its width, symmetric, the base sits flat at the bottom of the image. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```
### `altar.png` (amplada 150)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A bare rough stone altar with an old iron cross, candle stubs and small children's offerings (pebbles, feathers). Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `taula_pedra.png` (amplada 110)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A large standing stone tablet with rows of carved mysterious symbols. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `carruatge.png` (amplada 230)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A green traveling wagon with large wooden wheels, a canvas roof and a lantern. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `carro_sansa.png` (amplada 220)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A small market cart with baskets of vegetables and a striped awning. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `pergola.png` (amplada 260)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A stone pergola with round columns and a roof woven with ivy. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `taula_pp.png` (amplada 240)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A ping-pong table, dark green, with a net, paddles and a white ball. Camera angle: classic JRPG 3/4 top-down, seen from about 45 degrees above, the top surface clearly visible, not isometric, no strong perspective distortion.
```

### `llosa.png` (amplada 90)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A square stone slab set in the ground with a hidden-flower carving. Camera angle: classic JRPG 3/4 top-down, seen from about 45 degrees above, the top surface clearly visible, not isometric, no strong perspective distortion.
```

### `telescopi_mon.png` (amplada 80)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A brass telescope on a wooden tripod, pointing to the sky. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `runna_pedra.png` (amplada 110)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A pale stone with a legendary sword stuck in it, soft glow. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `espelma.png` (amplada 20)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A single lit candle in a small iron holder. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `taula_sopar.png` (amplada 380)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A long rustic dining table with plates, bread, jugs and candles. Camera angle: classic JRPG 3/4 top-down, seen from about 45 degrees above, the top surface clearly visible, not isometric, no strong perspective distortion.
```

### `cofre.png` (amplada 70)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A wooden treasure chest with iron bands and a gold lock. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `olla.png` (amplada 110)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A big black iron pot on a small campfire, steam rising. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `foc.png` (amplada 80)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A crackling campfire with logs and sparks. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `pergami.png` (amplada 70) *(Rotlle tancat, LLARG i estret, amb lacre vermell i cinteta. És l'objecte dels fragments de la crònica del monjo.)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A long closed parchment scroll lying slightly diagonal, clearly LONGER than it is thick (about 2.3:1 length to thickness): a thin rolled sheet of cream-and-ochre vellum, the right end showing the visible spiral of the rolled layers, the left end slightly frayed and curling, a few faint brown age stains; a narrow crimson silk ribbon wraps once around the middle and is tied in a small bow, with two ribbon tails hanging down; on top of the ribbon a round blob of melted red sealing wax with uneven dripping edges, a small cross pressed into it and a glossy highlight. Rich detail but very clear shapes. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```
### `lapida.png` (amplada 40)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A small mossy gravestone with a tiny cross. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `tomba_esquerdada.png` (amplada 240)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A large stone tomb with a deep diagonal crack and a faint purple glow inside. Camera angle: classic JRPG 3/4 top-down, seen from about 45 degrees above, the top surface clearly visible, not isometric, no strong perspective distortion.
```


### `guants_poder.png` (amplada 40) *(Guants de Poder del Germà Francesc (objecte; també serveix d'icona). Permeten moure la roda del Celler.)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A pair of old heavy stonemason work gloves made of thick worn brown leather, reinforced with riveted iron plates on the knuckles and a broad cuff, a faint warm golden glow around them as if they held ancient strength, lying one over the other. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `ram_flors.png` (amplada 34) *(El ram que el Germà Francesc demana portar a la creu del Cementiri.)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A small hand-tied bunch of wild mountain flowers (white daisies, lilac thyme, yellow broom and a red poppy) wrapped with a piece of twine. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `flors.png` (amplada 90) *(Mata de flors decorativa (es repeteix per l'escenari).)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A small low clump of wild flowers in the grass: white daisies, lilac thyme and yellow broom, with a few green leaves, no pot. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `porxo.png` (amplada 340) *(Porxo de la Casa Gran amb la reixa tancada.)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. The front of a rustic stone porch of a big old manor house: two thick stone pillars with a wooden beam and a small terracotta tiled roof above, an iron gate between the pillars closed with a wooden bar. About 1.5:1 width to height. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```
### `ocell.png` (amplada 34)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A small brown bird. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `llac.png` (amplada 36)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A small crystal lake stone / ice shard. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

---

## Personatges

### `monja_pains.png` (amplada 110) *(La Pains, la velleta de l'Hostatgeria. Va en CADIRA DE RODES: el sprite ha de ser un personatge assegut a la cadira (no cal vista de la resta))*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A tiny very old nun in a WHEELCHAIR: frail, wrinkled kind face, white hair under a short white coif, dark blue-grey habit with a white bib, a red wool blanket over her knees, a rosary in her lap, a large old wooden wheelchair with two big spoked wheels, gentle sweet smile. Shown seated in the wheelchair, whole chair visible. Chunky chibi proportions like the reference monk (big round head with a friendly expressive face, short plump body, small hands and feet), thick dark-brown outline, cloth with soft worn texture and visible folds, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `monja_charm.png` (amplada 110) *(La Charm, gran sacerdotessa de l'Hostatgeria. Grassoneta, cabells curts)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A plump, round, cheerful mother superior nun: wide friendly face with rosy cheeks, SHORT brown hair showing at the temples under a white coif and short veil, a dark blue-grey habit with a white bib and a big wooden cross on a cord, a heavy rosary belt, warm authoritative smile. Chunky chibi proportions like the reference monk (big round head with a friendly expressive face, short plump body, small hands and feet), thick dark-brown outline, cloth with soft worn texture and visible folds, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `monja_phili.png` (amplada 96) *(La Phili, sacerdotessa de l'Hostatgeria. Prima, espavilada, amb ulleres i cabells curts)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A thin, tall, quick-witted young nun: narrow alert face, round wire glasses, SHORT dark hair showing at the temples under a white coif and short veil, a dark blue-grey habit with a white bib, arms slightly raised as if about to speak, a sharp little grin, energetic stance. Chunky chibi proportions like the reference monk (big round head with a friendly expressive face, short plump body, small hands and feet), thick dark-brown outline, cloth with soft worn texture and visible folds, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```
### `tieta.png` (amplada 96)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Elderly aunt with grey hair, in a blue dress. Chunky chibi proportions like the reference monk (big round head with a friendly expressive face, short plump body, small hands and feet), thick dark-brown outline, cloth with soft worn texture and visible folds, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `tieta2.png` (amplada 96)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Elderly aunt with grey hair and glasses, in a dusty rose dress. Chunky chibi proportions like the reference monk (big round head with a friendly expressive face, short plump body, small hands and feet), thick dark-brown outline, cloth with soft worn texture and visible folds, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `neus.png` (amplada 96)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A woman with dark hair in a red dress. Chunky chibi proportions like the reference monk (big round head with a friendly expressive face, short plump body, small hands and feet), thick dark-brown outline, cloth with soft worn texture and visible folds, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `marit_neus.png` (amplada 96)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A man in a teal shirt, her husband, dark hair. Chunky chibi proportions like the reference monk (big round head with a friendly expressive face, short plump body, small hands and feet), thick dark-brown outline, cloth with soft worn texture and visible folds, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `yordi.png` (amplada 96)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A man in a green jacket. Chunky chibi proportions like the reference monk (big round head with a friendly expressive face, short plump body, small hands and feet), thick dark-brown outline, cloth with soft worn texture and visible folds, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `judit.png` (amplada 96)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A woman in a mustard dress. Chunky chibi proportions like the reference monk (big round head with a friendly expressive face, short plump body, small hands and feet), thick dark-brown outline, cloth with soft worn texture and visible folds, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `daniel_t.png` (amplada 96)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A man in a purple-blue shirt. Chunky chibi proportions like the reference monk (big round head with a friendly expressive face, short plump body, small hands and feet), thick dark-brown outline, cloth with soft worn texture and visible folds, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `turbo.png` (amplada 80)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Small boy, orange t-shirt, very energetic. Chunky chibi proportions like the reference monk (big round head with a friendly expressive face, short plump body, small hands and feet), thick dark-brown outline, cloth with soft worn texture and visible folds, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `eloi.png` (amplada 110)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Big strong man in a red shirt. Chunky chibi proportions like the reference monk (big round head with a friendly expressive face, short plump body, small hands and feet), thick dark-brown outline, cloth with soft worn texture and visible folds, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `garf.png` (amplada 96)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Young chubby blond inventor in a brown tunic, goggles on the head. Chunky chibi proportions like the reference monk (big round head with a friendly expressive face, short plump body, small hands and feet), thick dark-brown outline, cloth with soft worn texture and visible folds, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `jordi_caseta.png` (amplada 96)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Man in olive clothes and a cap. Chunky chibi proportions like the reference monk (big round head with a friendly expressive face, short plump body, small hands and feet), thick dark-brown outline, cloth with soft worn texture and visible folds, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `sansa.png` (amplada 96)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Woman with auburn hair in a golden dress. Chunky chibi proportions like the reference monk (big round head with a friendly expressive face, short plump body, small hands and feet), thick dark-brown outline, cloth with soft worn texture and visible folds, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `home_carruatge.png` (amplada 96)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Man in a green uniform and a cap, the wagon driver. Chunky chibi proportions like the reference monk (big round head with a friendly expressive face, short plump body, small hands and feet), thick dark-brown outline, cloth with soft worn texture and visible folds, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `jaumeta.png` (amplada 96)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Young woman in an olive dress, a red rose in her hair, fingers ready to snap. Chunky chibi proportions like the reference monk (big round head with a friendly expressive face, short plump body, small hands and feet), thick dark-brown outline, cloth with soft worn texture and visible folds, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `pastor_a.png` (amplada 96)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A shepherd man in a brown wool vest. Chunky chibi proportions like the reference monk (big round head with a friendly expressive face, short plump body, small hands and feet), thick dark-brown outline, cloth with soft worn texture and visible folds, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `pastor_b.png` (amplada 96)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A shepherd woman in a plum shawl. Chunky chibi proportions like the reference monk (big round head with a friendly expressive face, short plump body, small hands and feet), thick dark-brown outline, cloth with soft worn texture and visible folds, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `pastor_vell.png` (amplada 96)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. An old bearded shepherd with a cane. Chunky chibi proportions like the reference monk (big round head with a friendly expressive face, short plump body, small hands and feet), thick dark-brown outline, cloth with soft worn texture and visible folds, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `ombra_monjo.png` (amplada 150)

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A translucent ghost of an old monk in dark blue light. Chunky chibi proportions like the reference monk (big round head with a friendly expressive face, short plump body, small hands and feet), thick dark-brown outline, cloth with soft worn texture and visible folds, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

---

## Enemics

Tots els enemics són bestioles o persones **corrompudes per la boira lila**: han de llegir-se bé a mida petita (uns 60-110 px al joc), amb una silueta clara i ulls que brillen.

### `escolopendra.png` (amplada 64) *(Escolopendra: erràtica, surt de l'esquerda del Cementiri. Camins, Runes, Passadís, Cementiri, Bosc.)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A large giant centipede the length of a forearm, glossy segmented reddish-brown armored body with darker bands, many thin orange legs, two long curved antennae and sharp yellow pincers raised in a threatening S-curve pose, faint lilac mist trailing from its joints, small glowing violet eyes. Game enemy sprite, readable silhouette at small size, menacing but not gory (family-friendly), the corruption of the mist shown as wisps of violet-lilac fog and softly glowing violet eyes. Seen from slightly above (classic JRPG 3/4 top-down), whole creature visible, facing the camera or three-quarter to the left, feet/base at the bottom of the image, thick dark-brown outline, a single creature, no background, no ground.
```

### `gripau.png` (amplada 56) *(Gripau corromput: salta i només fa mal mentre salta. Bassadòria.)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A swollen corrupted toad, warty olive-green skin turning sickly purple on the back, puffed throat sac, crouched ready to leap, big glowing violet eyes, a few drops of murky water and lilac mist dripping from it. Game enemy sprite, readable silhouette at small size, menacing but not gory (family-friendly), the corruption of the mist shown as wisps of violet-lilac fog and softly glowing violet eyes. Seen from slightly above (classic JRPG 3/4 top-down), whole creature visible, facing the camera or three-quarter to the left, feet/base at the bottom of the image, thick dark-brown outline, a single creature, no background, no ground.
```

### `visitant.png` (amplada 96) *(Visitant: lent i adormit; en vèncer-lo cau dormint. Plaça, Monestir.)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A sleepwalking day-tripper tourist possessed by the mist: orange short-sleeved shirt, beige shorts, baseball cap, round glasses, camera on a strap, grey-green skin, arms stretched forward like a zombie but comical, half-closed glowing violet eyes, mouth open in a yawn, wisps of lilac mist around the feet. Chibi proportions like the other characters. Game enemy sprite, readable silhouette at small size, menacing but not gory (family-friendly), the corruption of the mist shown as wisps of violet-lilac fog and softly glowing violet eyes. Seen from slightly above (classic JRPG 3/4 top-down), whole creature visible, facing the camera or three-quarter to the left, feet/base at the bottom of the image, thick dark-brown outline, a single creature, no background, no ground.
```

### `ovella_boira.png` (amplada 76) *(Ovella de boira: embesteix i queda cansada. Camí de la Cirosa.)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A sheep possessed by the mist: thick dirty-grey wool with lilac smoky tips, black face with angry lowered head ready to charge, small curled horns, glowing violet eyes, hooves scraping the ground, violet fog leaking from the wool. Game enemy sprite, readable silhouette at small size, menacing but not gory (family-friendly), the corruption of the mist shown as wisps of violet-lilac fog and softly glowing violet eyes. Seen from slightly above (classic JRPG 3/4 top-down), whole creature visible, facing the camera or three-quarter to the left, feet/base at the bottom of the image, thick dark-brown outline, a single creature, no background, no ground.
```

### `ovella.png` (amplada 70) *(Ovella normal (sense boira).)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A fluffy friendly white mountain sheep with a black face and legs, calm pose. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `home_raim.png` (amplada 110) *(L'Home del Raïm com a estàtua (abans del combat).)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A white marble statue of a bearded man carrying a big bunch of grapes on his shoulder, head turned back over his shoulder, on a low square pedestal, veins of grey in the marble, calm and still. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `home_raim_desperta.png` (amplada 120) *(L'Home del Raïm despert (boss de l'Escalinata).)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Boss: the same marble statue of the grape man come to life, cracked marble skin with violet light glowing through the cracks, two burning red eyes, swinging the heavy marble bunch of grapes like a club, small pieces of marble falling off. Game enemy sprite, readable silhouette at small size, menacing but not gory (family-friendly), the corruption of the mist shown as wisps of violet-lilac fog and softly glowing violet eyes. Seen from slightly above (classic JRPG 3/4 top-down), whole creature visible, facing the camera or three-quarter to the left, feet/base at the bottom of the image, thick dark-brown outline, a single creature, no background, no ground.
```

### Enemics futurs (Acte 3)

### `ratpenat_boira.png` (amplada 60) *(Ratpenat de boira: Sala de les Gírgoles, sota la Taverna.)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A bat made of dark violet mist with leathery wings spread wide, small fangs, glowing violet eyes, the edges of the wings dissolving into smoke. Game enemy sprite, readable silhouette at small size, menacing but not gory (family-friendly), the corruption of the mist shown as wisps of violet-lilac fog and softly glowing violet eyes. Seen from slightly above (classic JRPG 3/4 top-down), whole creature visible, facing the camera or three-quarter to the left, feet/base at the bottom of the image, thick dark-brown outline, a single creature, no background, no ground.
```

### `ocell_boira.png` (amplada 50) *(Ocell de boira: fase 1 del combat final (els ocells robats per l'Ocellaire).)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A small songbird made of grey-violet fog, sharp beak, ragged smoky feathers, glowing violet eyes, diving pose. Game enemy sprite, readable silhouette at small size, menacing but not gory (family-friendly), the corruption of the mist shown as wisps of violet-lilac fog and softly glowing violet eyes. Seen from slightly above (classic JRPG 3/4 top-down), whole creature visible, facing the camera or three-quarter to the left, feet/base at the bottom of the image, thick dark-brown outline, a single creature, no background, no ground.
```

### `ferralla.png` (amplada 90) *(Ferralla viva: passadís sota la Taverna.)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A clanking creature assembled from rusty old iron tools (chains, pincers, a cogwheel, hooks) animated by violet mist, two glowing violet eyes in an iron pot used as a head, menacing but not gory. Game enemy sprite, readable silhouette at small size, menacing but not gory (family-friendly), the corruption of the mist shown as wisps of violet-lilac fog and softly glowing violet eyes. Seen from slightly above (classic JRPG 3/4 top-down), whole creature visible, facing the camera or three-quarter to the left, feet/base at the bottom of the image, thick dark-brown outline, a single creature, no background, no ground.
```

### `andreu_guardia.png` (amplada 96) *(El Germà Andreu fent de guàrdia de la Gàbia (segon combat).)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A young monk with dark hair, black habit with violet mist clinging to it, holding a wooden staff like a guard, smug smile, faintly glowing violet eyes. Game enemy sprite, readable silhouette at small size, menacing but not gory (family-friendly), the corruption of the mist shown as wisps of violet-lilac fog and softly glowing violet eyes. Seen from slightly above (classic JRPG 3/4 top-down), whole creature visible, facing the camera or three-quarter to the left, feet/base at the bottom of the image, thick dark-brown outline, a single creature, no background, no ground.
```

### `basto_ocellaire.png` (amplada 180) *(Bàcul de l'Ocellaire com a imatge: `assets/armes/basto_ocellaire.png`; ara el joc el dibuixa amb codi.)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline, soft cel-shaded colouring with a subtle worn grain, warm saturated earthy palette, single object centered, isolated on a plain pure white background, no shadow, no text. A long horizontal sinister staff of black twisted wood with a golden band in the middle, and at EACH END a curled golden hook holding a small glowing orange flame with a white core (so it looks the same when it spins). Violet wisps curl around the wood. Seen flat from the side, perfectly horizontal and symmetrical left-right, aspect ratio about 12:1.
```

### `gabia.png` (amplada 220) *(La Gàbia de l'Ocellaire: només s'obre amb el Cant del Miracle.)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A huge old wrought-iron birdcage big enough for children, domed top with a ring, thick curved bars wrapped in violet mist, a heavy padlock, three sleeping children inside wrapped in soft cocoons of lilac fog. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `gabia_oberta.png` (amplada 220) *(La Gàbia oberta (després del Cant del Miracle).)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. The same huge wrought-iron birdcage with its door swung wide open and the bars bent outward, the mist gone, warm morning light, empty inside. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

---

## Arbre mort

Els pins ja són fets (`pi`, `pi_pinyer`). Falta aquest, que encara no s'usa:

### `arbre_sec.png` (amplada 220) *(Arbre mort)*

```
Charming 2D cartoon game asset in the exact art style of the attached reference image (the adventurer monk): chunky hand-inked storybook cartoon illustration, thick clean dark-brown outline of even weight, soft cel-shaded colouring with gentle gradients and a subtle worn paper grain, warm saturated earthy palette (chocolate and chestnut browns, cream, ochre, moss green, slate blue), rounded friendly shapes with a hint of eerie Catalan mountain-village mood, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A dead old tree: a gnarled twisted grey trunk and a few bare crooked branches, a few last dry brown leaves hanging, peeling bark, a small hole in the trunk. About 1:1.2 width to height. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the whole tree facing the camera straight on, trunk base and roots visible at the bottom of the image, no ground, no grass, no cast shadow, not isometric, a single tree, same art style, line weight and color treatment as the existing `arbre` and `roure` trees.
```

---

## Consells
- Genereu cada gràfic **a part**, amb fons blanc pur; el joc ja treu el fons.
- Si una imatge surt amb fons de quadrícula o degradat, afegiu "plain pure white #FFFFFF background".
- Els edificis es dibuixen amb els peus (la base) a la part de baix de la imatge; el joc els posa per la base.
- Quan en tingueu un, dieu-m'ho i comprovo la mida, les portes i les col·lisions (issue "Ajustar portes i col·lisions").

---

## Pròleg

Cinc quadres de la intro, tots **vitralls de catedral medieval vistos dins la seva finestra**, a la paret de pedra d'una catedral gòtica.
Cada un va a `assets/proleg/<nom>.webp`, **vertical 9:16** (idealment 1536 × 2752; el joc la redueix a 1152 d'ample), imatge **sencera, sense retallar**.

**Com es veuen al joc:** no hi ha cap quadre que avanci sol. La imatge omple la pantalla i fa un **zoom enrere (Ken Burns, uns 8 s)**: comença a sobre l'escena del vitrall, centrada a la part de dalt, i s'allunya fins a mostrar tota la finestra de la catedral (el **text** es posa a sobre, al quart de baix). Per això:
- **El vitrall ha d'estar al centre exacte de la imatge** (centre del vidre a ~50 % de l'ample i ~50 % de l'alçada), i ocupar uns **36 % de l'ample i 44 % de l'alçada** de la imatge, igual que `art/intro_ocellaire.jpg`. Així el zoom sempre el mostra sencer.
- Al voltant, **pedra de catedral gòtica** (carreus vells d'arenisca, arc apuntat, traceria, una mica de columna als costats), amb llum tènue i ambient. La finestra ha de ser **clarament una finestra de catedral**, però pot ser d'un **tipus diferent** a cada quadre (llançada, doble, romànica…): és el que s'indica a cada prompt.
- **Dins del vitrall, l'escena sencera ha de quedar-hi i ser molt simple i reconeixible** (poques figures grans, siluetes clares).
- **Res d'animació ni de text pintat:** el joc només mou la càmera.

**Referència d'estil (obligatòria):** pugeu `art/intro_ocellaire.jpg` al generador i digueu «same stained-glass style, same cathedral wall and lighting as the reference image, but a different window and scene». És el vitrall bo: vidres plans de colors joia, línies de plom negres i gruixudes, figures de dibuix net i cares mínimes.

**Bloc d'estil del vitrall (és el primer paràgraf de cada prompt):** vidres de colors saturats (blau cobalt, vermell rubí, groc d'or, verd maragda, violeta ametista), plom negre gruixut, formes grans i simples, una mica de textura de vidre i de resplendor com si la llum el travessés.

### `proleg/ocellaire.webp` — 1. L'Ocellaire a la fira, amb els nens — **FET** (`art/intro_ocellaire.jpg`, ja a `assets/proleg/ocellaire.webp`)

### `proleg/segell.webp` — 2. Sota terra: el tanquen a la gàbia i un monjo segella la porta amb Runna *(finestra: llançada alta d'arc apuntat amb un petit òcul rodó a sobre)*

```
Photograph of the interior of a medieval Gothic cathedral, vertical portrait 9:16: a weathered sandstone wall with slim columns at the sides and, exactly in the centre of the image, a tall narrow lancet window with a simple pointed arch and a small round oculus above it, dim moody light. The stained-glass panel fills the window and is centred in the image, about 36% of the image width and 44% of its height, fully visible. Same stained-glass style, same cathedral wall and lighting as the reference image.
The stained glass itself: flat saturated jewel-coloured glass panes (deep indigo, violet, black, a little ruby and orange) separated by thick black lead lines, simple bold shapes, a few large panes per figure, slight glass texture, no fine detail, minimal faces. Scene, very simple: an underground cave of dark indigo and violet glass with a few triangular stalactites at the top. On the left, a big bell-shaped black iron cage drawn with thick bars over a glowing violet background, inside it the dark silhouette of a tall gaunt man in a feather coat and wide-brimmed hat with two glowing amber eyes. On the right, a heavy iron door in the rock wall, with two brown-robed monks and a shepherd with a crook pushing it shut. In the foreground, centre, a young hooded monk seen from behind, raising a short sword high: the sword is a bright white-blue glass shape, with white and pale-yellow rays crossing the door and glowing white runes sealing it. Mood: solemn, tense. Palette: indigo, violet, black, icy white-blue, a few small orange lantern accents.
```

### `proleg/boira.webp` — 3. Ara: el Monestir de nit i la boira lila que surt de terra *(finestra: doble llançada amb un trèvol a sobre, separada per un muntant de pedra)*

```
Photograph of the interior of a medieval Gothic cathedral, vertical portrait 9:16: a weathered sandstone wall and, exactly in the centre of the image, a tall twin-lancet window (two pointed arches side by side separated by a slim stone mullion, a quatrefoil tracery opening above them), dim moody light. The stained-glass panel fills both lancets, with the picture continuing across the thin mullion, centred in the image, about 36% of the image width and 44% of its height, fully visible. Same stained-glass style, same cathedral wall and lighting as the reference image.
The stained glass itself: flat saturated jewel-coloured glass panes (midnight blue, indigo, amethyst, lilac, moon-cream) separated by thick black lead lines, simple bold shapes, a few large panes per object, slight glass texture, no fine detail. Scene, very simple: a Romanesque monastery at night seen from the front, centred: a plain rectangular two-storey building in blue-grey and dull ochre glass, low red-brown gable roof, a round-arched portal with a dark door, a staircase of grey panes leading up to it, a few tall narrow arched windows, ALL of them dark blue glass. On each side, one round dark-green tree and a tall dark cypress. From the ground and from under the trees, a cold lilac-violet fog made of wavy amethyst and lilac panes creeps up the staircase and the foot of the walls, with a few thin glowing violet cracks on the ground. Sky: deep midnight-blue glass, a big pale cream moon with concentric halo rings at upper right, a few small yellow diamond-shaped stars, dark violet mountains behind the roof. Mood: silent, ominous, beautiful.
```

### `proleg/nens.webp` — 4. Cada nit falta un nen: tres cases i un nen que se l'endú una ombra *(finestra: arc de mig punt romànic, gruixut i sense traceria)*

```
Photograph of the interior of an old Romanesque-Gothic cathedral, vertical portrait 9:16: a weathered sandstone wall and, exactly in the centre of the image, a tall round-arched (semicircular) window with a thick stone frame and no tracery, dim moody light. The stained-glass panel fills the window, centred in the image, about 36% of the image width and 44% of its height, fully visible. Same stained-glass style, same cathedral wall and lighting as the reference image.
The stained glass itself: flat saturated jewel-coloured glass panes (midnight blue, indigo, lilac, stone grey, a little warm amber and red) separated by thick black lead lines, simple bold shapes, a few large panes per object, slight glass texture, no fine detail, minimal faces. Scene, very simple: a quiet village street at night. Three small stone houses side by side in a row, each a simple shape with a red-brown tiled roof, a wooden door and one window: the first two windows are dark dark-blue glass, the third one still glows warm amber. In the street in front, on the right, a tall dark hooded figure in a monk's habit, in black and violet glass with no face, walks away holding the hand of a small child in a pale tunic, both walking toward the right edge into a low bank of lilac fog glass. Behind the houses a round dark tree and two tall cypresses; high on the hill a small ochre monastery with dark windows; midnight-blue sky with a pale moon and a few yellow diamond stars. Mood: a village holding its breath.
```

### `proleg/mati.webp` — 5. Matí: surt el sol darrere del Monestir i la boira lila s'esvaeix *(finestra: llançada alta amb una gran rosassa a sobre)*

```
Photograph of the interior of a medieval Gothic cathedral, vertical portrait 9:16: a weathered sandstone wall and, exactly in the centre of the image, a tall lancet window with a pointed arch and a round rose window above it, warm morning light. The stained-glass panel fills the lancet, centred in the image, about 36% of the image width and 44% of its height, fully visible. Same stained-glass style, same cathedral wall and lighting as the reference image.
The stained glass itself: flat saturated jewel-coloured glass panes (golden yellow, orange, rose, sky blue, emerald green, a little ruby) separated by thick black lead lines, simple bold shapes, a few large panes per object, slight glass texture, no fine detail, minimal faces. Scene, very simple, with NO people: the Romanesque monastery seen from the front, centred, a plain rectangular two-storey building in honey-ochre glass with a low red roof, a round-arched portal with a closed dark door, a staircase of beige panes, a few tall narrow arched windows. A big golden sun rising exactly behind the roof, half hidden by the building, with long straight yellow and orange rays fanning across a pale blue-pink sky, and two blue-violet mountains at the sides. Thin wavy lilac fog glass lies low around the foot of the monastery and in the valleys, thinning out and pale where the sun touches it. Mood: hopeful, gentle, the dawn after the dark nights.
```
