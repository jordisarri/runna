# Prompts per als gràfics que falten

Cada gràfic va a `assets/<nom>.png`. Si el fitxer no hi és, el joc fa servir un dibuix provisional fet amb codi
(vegeu `CATALEG` a `js/assets.js`). Quan hi poses el PNG, apareix sol: no cal tocar res més.

**Cada prompt és complet:** porta l'estil base, la descripció i la perspectiva. Només cal copiar el bloc (a GitHub hi ha un
botó de copiar a dalt a la dreta de cada bloc) i enganxar-lo al generador.

**Com es processen:** el joc retalla els marges, treu el fons blanc connectat a les vores i redueix la imatge a l'amplada
indicada. Per això: fons blanc pur i res de blanc a la vora de l'objecte.

**Referències ja fetes** (si el generador admet imatge de referència, pujeu-la i digueu "same art style"):
`assets/esglesia.png` (edifici), `assets/roure.png` (arbre), `assets/sprites/ineu/down.png` (personatge).

**Perspectiva:** els **edificis** es veuen com a *A Link to the Past*: façana de cara i teulada visible des de dalt, sense parets laterals. La resta d'objectes, vista 3/4 des de dalt (uns 30°) i de cara a la càmera.
Els objectes plans (taules, basses, lloses) es veuen des d'uns 45°. Ja està inclòs a cada prompt.

---

## Edificis

### `casa_gran.png` (amplada 620) *(Casa Gran del Miracle (referència: les fotos de la Casa Gran). Els tres arcs del porxo són oberts i clars; la porta de ferro és a l'arc del MIG, al fons del porxo, i dona a l'Escalinata. Ja no es fa servir l'arcada solta (porxo).)*

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. The front facade of a massive three-storey stately house built of warm ochre-brown squared sandstone ashlar in regular courses, a pitched (sloped) terracotta tile roof with a stone eave and a small brick chimney at the top right; on the ground floor, in the right-center part, a porch of THREE large round arches with lighter stone voussoirs, open and well lit inside so the back wall of the porch is clearly visible (warm light stone, a slightly shaded vault, NOT black and NOT dark), and set at the back of the MIDDLE arch a black wrought-iron gate-door with a small gold lock, clearly visible, recessed deep inside the porch (the left and right arches are open with no gate), two small iron wall lanterns above the arches; a wide flight of four shallow stone steps spreads in front of the arches; the middle floor has three large windows with moulded stone frames, cornice hoods and sills; the top floor has three smaller plain windows and a small round sundial medallion; a small barred window with an ornate stone frame at the lower right. About 1.15:1 width to height. Camera angle like The Legend of Zelda: A Link to the Past, classic 3/4 top-down, camera looking down at about 35-40 degrees: the main facade faces the viewer straight on and is clearly visible, and ABOVE it the roof is visible from above, with the roof planes sloping away from the viewer in perspective (you can see the roof surface and ridge). EVERY roof is a pitched, sloped roof covered with visible rows of terracotta clay tiles, NEVER a flat roof. Strictly NO side walls visible, the building is symmetrical left to right, not rotated, not isometric, a flat ground line along the bottom edge of the image.
```

### `ermita.png` (amplada 300) *(Ermita de la Desaparició (referència: les fotos de la capella del Miracle). A l'escena es posen xiprers alts als dos costats: no els incloeu a la imatge.)*

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A tiny old Catalan roadside chapel, front facade only, of squared grey-ochre sandstone ashlar blocks with pale lichen patches; a low gable with a small bell gable (espadanya) on top of the ridge, an arched opening with a small dark bell and a tiny stone cross at the very top; a gently sloped roof of old terracotta tiles with slightly projecting eaves; in the center a large double wooden door in reddish-brown planks with wrought-iron spiral scroll ornaments; on each side of the door one small square window with a stone frame and an iron grille; a low flat stone threshold step in front of the door. Quiet, foggy and slightly eerie. About 1.35:1 width to height. Camera angle like The Legend of Zelda: A Link to the Past, classic 3/4 top-down, camera looking down at about 35-40 degrees: the main facade faces the viewer straight on and is clearly visible, and ABOVE it the roof is visible from above, with the roof planes sloping away from the viewer in perspective (you can see the roof surface and ridge). EVERY roof is a pitched, sloped roof covered with visible rows of terracotta clay tiles, NEVER a flat roof. Strictly NO side walls visible, the building is symmetrical left to right, not rotated, not isometric, a flat ground line along the bottom edge of the image.
```

### `ermita_gabriel.png` (amplada 300) *(Ermita de Sant Gabriel (referència: la foto de l'ermita de Sant Gabriel). Sense cap creu. A l'escena es posen pins joves vora la capella: no els incloeu a la imatge.)*

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A small rustic Romanesque chapel, front facade only, built of warm ochre-orange squared sandstone ashlar blocks in regular courses; a low-pitched gable roof whose edge is a decorated cornice of old terracotta tiles with small tooth-like dentil moulding; a small bell gable (espadanya) rising from the ridge with a single arched opening and a small dark bell; in the middle of the facade a round rose window in a stone ring with carved geometric tracery; below it a small round-arched door of reddish-brown wooden planks, framed by a much wider semicircular relieving arch in lighter stone; a low pale stone plinth along the whole base. Quiet and sunlit. About 1.15:1 width to height. Camera angle like The Legend of Zelda: A Link to the Past, classic 3/4 top-down, camera looking down at about 35-40 degrees: the main facade faces the viewer straight on and is clearly visible, and ABOVE it the roof is visible from above, with the roof planes sloping away from the viewer in perspective (you can see the roof surface and ridge). EVERY roof is a pitched, sloped roof covered with visible rows of terracotta clay tiles, NEVER a flat roof. Strictly NO side walls visible, the building is symmetrical left to right, not rotated, not isometric, a flat ground line along the bottom edge of the image.
```

### `runes.png` (amplada 420) *(Runes de l'església inacabada (referència: les fotos de les runes). A l'escena es posa un xiprer al costat: no l'inclogueu a la imatge.)*

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. The ruins of an unfinished stone church, front elevation: massive warm brown-ochre sandstone ashlar walls with pale lichen patches; a tall central nave wall with no roof, a huge round relieving arch outlined on its face and two small square windows with wooden frames; on the left and right two enormous broken buttress pillars of stacked blocks with jagged crumbling tops; between them two open round arches leading into dark roofless side chapels; a patch of dark green ivy climbing one pillar; a few fallen carved stone blocks and rubble at the foot. Silent, weathered, slightly eerie. About 1.3:1 width to height. Camera angle like The Legend of Zelda: A Link to the Past, classic 3/4 top-down, camera looking down at about 35-40 degrees: the main facade faces the viewer straight on and is clearly visible, and ABOVE it the roof is visible from above, with the roof planes sloping away from the viewer in perspective (you can see the roof surface and ridge). EVERY roof is a pitched, sloped roof covered with visible rows of terracotta clay tiles, NEVER a flat roof. Strictly NO side walls visible, the building is symmetrical left to right, not rotated, not isometric, a flat ground line along the bottom edge of the image.
```

### `esglesia.png` (amplada 700) *(Façana del Santuari del Miracle (referència: la foto de la façana). Ja en tens una versió en 3/4 a assets/esglesia.png; aquesta és la versió frontal, per si la voleu canviar. Els dos xiprers de la dreta ja són a l'escena: no els incloeu. Després caldrà reajustar la porta (a l'esquerra) i les col·lisions.)*

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. The front facade of a large Baroque sanctuary built of massive warm sandstone ashlar blocks, very wide and tall with a long pitched terracotta tile roof under a plain stone eave; the upper floor is an open loggia of four large round arches with stone balustrades and dark timber ceilings inside; below it a smooth wall with a row of small square windows with wooden frames and stone sills; on the far LEFT a Baroque stone portal with two stout columns, a curved scrolled pediment with a small statue niche, and a large dark double door with a small iron grille; to the right of the portal, in the lower wall, three barred windows with stepped stone-block surrounds; faint damp streaks on the stone, a stone corner finial on the upper right. Calm and monumental. About 1.35:1 width to height. Camera angle like The Legend of Zelda: A Link to the Past, classic 3/4 top-down, camera looking down at about 35-40 degrees: the main facade faces the viewer straight on and is clearly visible, and ABOVE it the roof is visible from above, with the roof planes sloping away from the viewer in perspective (you can see the roof surface and ridge). EVERY roof is a pitched, sloped roof covered with visible rows of terracotta clay tiles, NEVER a flat roof. Strictly NO side walls visible, the building is symmetrical left to right, not rotated, not isometric, a flat ground line along the bottom edge of the image.
```

### `monestir.png` (amplada 620) *(Monestir (referència: la foto de la façana del monestir). Els xiprers de l'esquerra i la conífera de la dreta ja són a l'escena: no els incloeu.)*

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. The front facade of a large plain monastery wing built of warm sandstone ashlar blocks, a long pitched terracotta tile roof with a simple stone eave, very sober with no decoration; two floors of small narrow round-arched windows with light stone frames (single arched windows near the ends and twin arched windows near the middle), in the center a round-arched portal with a stone archivolt and a dark wooden double door, reached by a short wide flight of stone steps. About 1.5:1 width to height. Camera angle like The Legend of Zelda: A Link to the Past, classic 3/4 top-down, camera looking down at about 35-40 degrees: the main facade faces the viewer straight on and is clearly visible, and ABOVE it the roof is visible from above, with the roof planes sloping away from the viewer in perspective (you can see the roof surface and ridge). EVERY roof is a pitched, sloped roof covered with visible rows of terracotta clay tiles, NEVER a flat roof. Strictly NO side walls visible, the building is symmetrical left to right, not rotated, not isometric, a flat ground line along the bottom edge of the image.
```

### `sala_pingpong.png` (amplada 340)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A modest outbuilding turned into a recreation hall: whitewashed and ochre walls, a low tiled roof, a wide double wooden door, two shuttered windows, a hand-painted blue sign with a small ping-pong paddle over the door. Camera angle like The Legend of Zelda: A Link to the Past, classic 3/4 top-down, camera looking down at about 35-40 degrees: the main facade faces the viewer straight on and is clearly visible, and ABOVE it the roof is visible from above, with the roof planes sloping away from the viewer in perspective (you can see the roof surface and ridge). EVERY roof is a pitched, sloped roof covered with visible rows of terracotta clay tiles, NEVER a flat roof. Strictly NO side walls visible, the building is symmetrical left to right, not rotated, not isometric, a flat ground line along the bottom edge of the image.
```

### `hospederia.png` (amplada 560) *(Casa d'espiritualitat / Hostatgeria (referència: les fotos de la casa d'espiritualitat). La jardinera rodona de flors blanques del costat ja és a l'escena: no la inclogueu.)*

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. The front facade of a very large four-storey guest house built of rough warm grey-brown fieldstone masonry with pale stone corner quoins, a low-pitched roof of old terracotta tiles with a wide overhanging eave; the facade is a regular grid of small rectangular windows (eight columns by four rows) each with a light stone frame and closed brown wooden louvre shutters; a small plain wooden door with a stone frame and two small wall lanterns at the ground floor, a little left of the center; sober, austere and quiet. About 1.2:1 width to height. Camera angle like The Legend of Zelda: A Link to the Past, classic 3/4 top-down, camera looking down at about 35-40 degrees: the main facade faces the viewer straight on and is clearly visible, and ABOVE it the roof is visible from above, with the roof planes sloping away from the viewer in perspective (you can see the roof surface and ridge). EVERY roof is a pitched, sloped roof covered with visible rows of terracotta clay tiles, NEVER a flat roof. Strictly NO side walls visible, the building is symmetrical left to right, not rotated, not isometric, a flat ground line along the bottom edge of the image.
```

### `cel_stbenet.png` (amplada 420) *(Cel·les de Sant Benet (referència: la foto de Sant Benet). Edifici petit.)*

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. The front facade of a small plain sandstone residence building in warm ochre stone with orange brick details: a gabled front with a stepped cornice, a small round window in the gable, two tall round-arched windows with brick-orange frames and dark shutters, a small low wooden door; modest, simple and calm. About 1.4:1 width to height. Camera angle like The Legend of Zelda: A Link to the Past, classic 3/4 top-down, camera looking down at about 35-40 degrees: the main facade faces the viewer straight on and is clearly visible, and ABOVE it the roof is visible from above, with the roof planes sloping away from the viewer in perspective (you can see the roof surface and ridge). EVERY roof is a pitched, sloped roof covered with visible rows of terracotta clay tiles, NEVER a flat roof. Strictly NO side walls visible, the building is symmetrical left to right, not rotated, not isometric, a flat ground line along the bottom edge of the image.
```

### `cel_ntrasra.png` (amplada 560) *(Cel·les de Nostra Senyora (referència: les fotos de Nostra Senyora). És l'edifici GRAN, i Sant Benet és el petit que té al costat.)*

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. The front facade of a large three-storey rectangular block of rough brown fieldstone masonry with pale stone corner quoins, a low-pitched roof of orange terracotta tiles with slightly projecting eaves; regular grid of round-arched windows (four columns by three rows), each with a light stone frame and brown wooden shutters, the bottom row with black iron grilles; austere and quiet. About 1.3:1 width to height. Camera angle like The Legend of Zelda: A Link to the Past, classic 3/4 top-down, camera looking down at about 35-40 degrees: the main facade faces the viewer straight on and is clearly visible, and ABOVE it the roof is visible from above, with the roof planes sloping away from the viewer in perspective (you can see the roof surface and ridge). EVERY roof is a pitched, sloped roof covered with visible rows of terracotta clay tiles, NEVER a flat roof. Strictly NO side walls visible, the building is symmetrical left to right, not rotated, not isometric, a flat ground line along the bottom edge of the image.
```

### `masia.png` (amplada 520)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A Catalan masia farmhouse, wide stone walls, a low gabled roof, an arched doorway, an outdoor stone bench. Camera angle like The Legend of Zelda: A Link to the Past, classic 3/4 top-down, camera looking down at about 35-40 degrees: the main facade faces the viewer straight on and is clearly visible, and ABOVE it the roof is visible from above, with the roof planes sloping away from the viewer in perspective (you can see the roof surface and ridge). EVERY roof is a pitched, sloped roof covered with visible rows of terracotta clay tiles, NEVER a flat roof. Strictly NO side walls visible, the building is symmetrical left to right, not rotated, not isometric, a flat ground line along the bottom edge of the image.
```

### `cabana.png` (amplada 330)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A small dry-stone shepherd's hut with a flat stone roof, a wooden door, a bundle of firewood. Camera angle like The Legend of Zelda: A Link to the Past, classic 3/4 top-down, camera looking down at about 35-40 degrees: the main facade faces the viewer straight on and is clearly visible, and ABOVE it the roof is visible from above, with the roof planes sloping away from the viewer in perspective (you can see the roof surface and ridge). EVERY roof is a pitched, sloped roof covered with visible rows of terracotta clay tiles, NEVER a flat roof. Strictly NO side walls visible, the building is symmetrical left to right, not rotated, not isometric, a flat ground line along the bottom edge of the image.
```

### `diposit.png` (amplada 300)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A round stone water tank (cistern) with a domed top, a rusty iron hatch and a pipe. Camera angle like The Legend of Zelda: A Link to the Past, classic 3/4 top-down, camera looking down at about 35-40 degrees: the main facade faces the viewer straight on and is clearly visible, and ABOVE it the roof is visible from above, with the roof planes sloping away from the viewer in perspective (you can see the roof surface and ridge). EVERY roof is a pitched, sloped roof covered with visible rows of terracotta clay tiles, NEVER a flat roof. Strictly NO side walls visible, the building is symmetrical left to right, not rotated, not isometric, a flat ground line along the bottom edge of the image.
```

---

## Elements d'escenari

### `creu.png` (amplada 80) *(Creu de l'Aparició (referència: la foto de la creu commemorativa). Els arbustos i el mur de pedra seca de darrere ja són a l'escena: no els incloeu.)*

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A tall stone cross monument: three wide square stone steps at the bottom, on top of them a round drum-shaped plinth with a moulded cap, then a slender smooth round column and a plain round capital disc carrying a Latin stone cross at the very top; weathered grey stone with pale lichen patches; calm and old. About 1:2.7 width to height. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `bassadoria.png` (amplada 260) *(Bassadòria (referència: les fotos de la bassa). Els plàtans i el mur de pedra seca de darrere ja són a l'escena: no els incloeu.)*

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A large oval stone pool (the old village washing pool): a low rim of two stepped courses of grey stone around murky green water with a faint purple mist; a black wrought-iron railing with vertical bars running around the back half of the rim; at the front center two square stone gate pillars with caps and a small iron gate between them; on each side of the gate a rectangular stone trough, the left one with red flowers. About 1.6:1 width to height. Camera angle: classic JRPG 3/4 top-down, seen from about 45 degrees above, the top surface clearly visible, not isometric, no strong perspective distortion.
```

### `font.png` (amplada 110)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A small stone wall fountain with a carved spout and a shallow basin, clear cold water falling. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `font_sj.png` (amplada 130)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A rustic woodland spring: mossy rocks, a stone trough, a crystal-clear stream, faint icy blue glow. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `home_raim.png` (amplada 110) *(L'Home del Raïm (referència: les fotos de l'estàtua). Estàtua de marbre amb el cap girat enrere (es veu la nuca).)*

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A tall Baroque white-grey marble statue of a bearded man in classical drapery standing on a small rock base, seen from the FRONT of the pedestal but with his HEAD TURNED COMPLETELY BACKWARDS over the shoulder so we see the back of his head and hair instead of the face, one arm folded across the chest holding a bunch of dark purple grapes; the statue stands on a tall stone pedestal with a stepped moulded base, an octagonal recessed panel on the die and a projecting cornice. Weathered cool marble with soft grey shadows. About 1:2.4 width to height. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `columna_proces.png` (amplada 64) *(Columna de la processó del camí de la Desaparició (referència: la foto del camí). Una de sola, serveix per a les 12: el signe de cada una es mostra al quadre de diàleg. Es fa servir a les 12 columnes del camí de la Desaparició.)*

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A short wayside shrine pillar of rough grey fieldstone masonry with a slightly crooked, hand-built look, lichen and moss on the stone, a flat stone cap on top; on its front face a rectangular ceramic tile panel (azulejo) set into the stone with a thin yellow-ochre and blue border, painted in warm folk-art colours (cobalt blue, mustard yellow, terracotta) showing a simple abstract pilgrim sign in the middle; the panel is slightly weathered. About 1:2 width to height. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `columna.png` (amplada 58) *(Columna de la pèrgola del Jardí (columna esvelta de pedra; no és la del camí de la Desaparició). Es fa servir a les dues files de la pèrgola.)*

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A slender stone column for a garden pergola: a square plinth, a smooth round shaft slightly tapered, a simple moulded capital supporting a flat stone abacus, pale warm grey sandstone with a little moss at the base and a few leaves of climbing ivy wrapped around the shaft. About 1:2.4 width to height. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `altar.png` (amplada 150)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A bare rough stone altar with an old iron cross, candle stubs and small children's offerings (pebbles, feathers). Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `taula_pedra.png` (amplada 110)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A large standing stone tablet with rows of carved mysterious symbols. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `retaule.png` (amplada 300) *(Retaule barroc del Santuari (referència: les fotos del retaule). Es veu de cara, amb l'altar de marbre al davant.)*

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A monumental Baroque altarpiece seen straight on, covered in rich gold leaf: a tall central arched niche with a small radiant glory, a dove inside a golden sunburst at the top, twisted Solomonic columns on both sides, two niches on each side with polychrome saints in red, blue, green and ochre robes and golden halos, a crowning arch with scrolls and angels, a lower predella with two small arched doors and a central golden tabernacle, and a pinkish marble altar table with a white cloth in front. Warm glittering gold, red and blue accents. About 1:1 width to height. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `carruatge.png` (amplada 230)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A green traveling wagon with large wooden wheels, a canvas roof and a lantern. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `carro_sansa.png` (amplada 220)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A small market cart with baskets of vegetables and a striped awning. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `pergola.png` (amplada 260)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A stone pergola with round columns and a roof woven with ivy. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `taula_pp.png` (amplada 240)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A ping-pong table, dark green, with a net, paddles and a white ball. Camera angle: classic JRPG 3/4 top-down, seen from about 45 degrees above, the top surface clearly visible, not isometric, no strong perspective distortion.
```

### `tiller.png` (amplada 340)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A huge ancient linden (til·ler) with a thick twisted trunk and wide light-green foliage. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `llosa.png` (amplada 90)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A square stone slab set in the ground with a hidden-flower carving. Camera angle: classic JRPG 3/4 top-down, seen from about 45 degrees above, the top surface clearly visible, not isometric, no strong perspective distortion.
```

### `telescopi_mon.png` (amplada 80)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A brass telescope on a wooden tripod, pointing to the sky. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `runna_pedra.png` (amplada 110)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A pale stone with a legendary sword stuck in it, soft glow. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `espelma.png` (amplada 20)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A single lit candle in a small iron holder. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `taula_sopar.png` (amplada 380)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A long rustic dining table with plates, bread, jugs and candles. Camera angle: classic JRPG 3/4 top-down, seen from about 45 degrees above, the top surface clearly visible, not isometric, no strong perspective distortion.
```

### `cofre.png` (amplada 70)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A wooden treasure chest with iron bands and a gold lock. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `olla.png` (amplada 110)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A big black iron pot on a small campfire, steam rising. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `foc.png` (amplada 80)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A crackling campfire with logs and sparks. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `pergami.png` (amplada 44)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A small rolled parchment tied with a red ribbon. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `lapida.png` (amplada 40)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A small mossy gravestone with a tiny cross. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `tomba_esquerdada.png` (amplada 240)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A large stone tomb with a deep diagonal crack and a faint purple glow inside. Camera angle: classic JRPG 3/4 top-down, seen from about 45 degrees above, the top surface clearly visible, not isometric, no strong perspective distortion.
```

### `ocell.png` (amplada 34)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A small brown bird. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `llac.png` (amplada 36)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A small crystal lake stone / ice shard. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

---

## Personatges

### `pare_jordi.png` (amplada 96)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Elderly monk, grey hair, round glasses, black habit. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `germa_andreu.png` (amplada 96)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Young monk with dark hair, black habit, holding a football (Barça colors). Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `pare_daniel.png` (amplada 96)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Middle-aged monk, brown hair, black habit, choir director. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `pare_alcui.png` (amplada 96)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Very old monk with white hair, black habit, carrying a thick red book. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `pianista.png` (amplada 100)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Short stout older woman with glasses, grey hair, purple dress. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `tieta.png` (amplada 96)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Elderly aunt with grey hair, in a blue dress. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `tieta2.png` (amplada 96)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Elderly aunt with grey hair and glasses, in a dusty rose dress. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `neus.png` (amplada 96)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A woman with dark hair in a red dress. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `marit_neus.png` (amplada 96)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A man in a teal shirt, her husband, dark hair. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `yordi.png` (amplada 96)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A man in a green jacket. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `judit.png` (amplada 96)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A woman in a mustard dress. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `daniel_t.png` (amplada 96)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A man in a purple-blue shirt. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `turbo.png` (amplada 80)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Small boy, orange t-shirt, very energetic. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `juli.png` (amplada 96)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Boy in a pale blue outfit with small angel wings and glasses. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `frederic.png` (amplada 96)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Old bearded man in grey clothes holding a shovel. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `eloi.png` (amplada 110)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Big strong man in a red shirt. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `josep.png` (amplada 96)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Man in dark clothes and a flat cap. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `garf.png` (amplada 96)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Young chubby blond inventor in a brown tunic, goggles on the head. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `isidre.png` (amplada 96)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Gardener with a limp, a walking stick, green clothes and a cap. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `jordi_caseta.png` (amplada 96)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Man in olive clothes and a cap. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `sansa.png` (amplada 96)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Woman with auburn hair in a golden dress. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `home_carruatge.png` (amplada 96)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Man in a green uniform and a cap, the wagon driver. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `nena_trenes.png` (amplada 80)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Small girl with long braids in a pale lavender dress, ghostly pale skin. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `jaumeta.png` (amplada 96)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Young woman in an olive dress, a red rose in her hair, fingers ready to snap. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `pastor_a.png` (amplada 96)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A shepherd man in a brown wool vest. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `pastor_b.png` (amplada 96)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A shepherd woman in a plum shawl. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `pastor_vell.png` (amplada 96)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. An old bearded shepherd with a cane. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `pastor_boira.png` (amplada 110)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A tall shepherd in a dark purple cloak, covered in violet mist. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

### `ombra_monjo.png` (amplada 150)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A translucent ghost of an old monk in dark blue light. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
```

---

## Enemics

### `escolopendra.png` (amplada 64)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A large red-brown centipede, segmented, many legs. Camera angle: classic JRPG 3/4 top-down, seen from slightly above, whole creature visible, thick dark-brown outline, a single creature.
```

### `gripau.png` (amplada 56)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A swollen toad with purple-green skin and glowing eyes. Camera angle: classic JRPG 3/4 top-down, seen from slightly above, whole creature visible, thick dark-brown outline, a single creature.
```

### `visitant.png` (amplada 96)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A tourist corrupted by mist: orange shirt, grey-green skin, cap and glasses. Camera angle: classic JRPG 3/4 top-down, seen from slightly above, whole creature visible, thick dark-brown outline, a single creature.
```

### `espantaocell.png` (amplada 70)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A straw scarecrow in a ragged coat. Camera angle: classic JRPG 3/4 top-down, seen from slightly above, whole creature visible, thick dark-brown outline, a single creature.
```

### `ovella.png` (amplada 70)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A fluffy sheep. Camera angle: classic JRPG 3/4 top-down, seen from slightly above, whole creature visible, thick dark-brown outline, a single creature.
```

### `ovella_boira.png` (amplada 76)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A fluffy sheep with violet glowing eyes, wrapped in a faint violet mist. Camera angle: classic JRPG 3/4 top-down, seen from slightly above, whole creature visible, thick dark-brown outline, a single creature.
```

---

## Consells
- Genereu cada gràfic **a part**, amb fons blanc pur; el joc ja treu el fons.
- Si una imatge surt amb fons de quadrícula o degradat, afegiu "plain pure white #FFFFFF background".
- Els edificis es dibuixen amb els peus (la base) a la part de baix de la imatge; el joc els posa per la base.
- Ja existeixen `arbre`, `xiprer`, `roure`, `roca`, `esbarzer`, `flors`, `bolet`, `branca`, `cercle_bolets`, `pinassa`, `rovello` i `alzina_buida`.
- Quan en tingueu un, dieu-m'ho i comprovo la mida, les portes i les col·lisions (issue "Ajustar portes i col·lisions").
