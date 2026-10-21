# Prompts per als gràfics que falten

Cada gràfic va a `assets/<nom>.png`. Si el fitxer no hi és, el joc fa servir un dibuix provisional fet amb codi
(vegeu `CATALEG` a `js/assets.js`). Quan hi poses el PNG, apareix sol: no cal tocar res més.

**Cada prompt és complet:** porta l'estil base, la descripció i la perspectiva. Només cal copiar el bloc (a GitHub hi ha un
botó de copiar a dalt a la dreta de cada bloc) i enganxar-lo al generador.

**Com es processen:** el joc retalla els marges, treu el fons blanc connectat a les vores i redueix la imatge a l'amplada
indicada. Per això: fons blanc pur i res de blanc a la vora de l'objecte.

**Referències ja fetes** (si el generador admet imatge de referència, pujeu-la i digueu "same art style"):
`assets/esglesia.png` (edifici), `assets/roure.png` (arbre), `assets/sprites/ineu/down.png` (personatge).

**Perspectiva:** vista 3/4 des de dalt (uns 30°), l'objecte de cara a la càmera: es veu la façana i una mica del sostre.
Els objectes plans (taules, basses, lloses) es veuen des d'uns 45°. Ja està inclòs a cada prompt.

---

## Edificis

### `porxo.png` (amplada 340) *(Es dibuixa x1,9 a la Casa Gran. Relació ~1,6:1 d'ample a alt.)*

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A long Renaissance stone arcade (porxo) with four round arches resting on slender columns, warm sandstone blocks, a tiled shed roof, shadowy interior behind the arches. The SECOND arch from the left holds a closed wrought-iron gate (reixa) with a small gold lock. Low plinth at the base, a few ivy leaves. About 1.6:1 width to height. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the building facing the camera straight on (front elevation with the roof slightly visible), not isometric, no strong perspective distortion, no side walls visible, the base of the building sits flat at the bottom of the image.
```

### `casa_gran.png` (amplada 640) *(Ara no es fa servir: la façana de la Casa Gran és el porxo.)*

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A big old monastery guest house, two floors of sandstone ashlar, small windows with iron bars, wooden door, terracotta tiled roof, a stone chimney, ivy on one side. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the building facing the camera straight on (front elevation with the roof slightly visible), not isometric, no strong perspective distortion, no side walls visible, the base of the building sits flat at the bottom of the image.
```

### `ermita.png` (amplada 300) *(Ermita de la Desaparició.)*

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A tiny old roadside hermitage chapel, rough grey-brown stone, low gable roof of weathered tiles, a small round-arched wooden door left open, a tiny cross on the roof ridge, moss in the base stones, slightly eerie and abandoned, faint cool mist at the foot. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the building facing the camera straight on (front elevation with the roof slightly visible), not isometric, no strong perspective distortion, no side walls visible, the base of the building sits flat at the bottom of the image.
```

### `ermita_gabriel.png` (amplada 300) *(Ermita de Sant Gabriel (referència: la foto que vau enviar). Sense cap creu.)*

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A small rustic Romanesque chapel in the countryside, front facade only: cut sandstone ashlar blocks in warm brown, steep gable roof with brown clay tiles and a stepped edge, a simple bell gable (espadanya) with one arched opening and a small bell on top, a round rose window with stone tracery above the door, a round-arched wooden door in reddish-brown planks framed by a wider relieving arch, a lighter stone plinth along the base. Dry earth at the foot. No cross anywhere. About 1.1:1 height to width. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the building facing the camera straight on (front elevation with the roof slightly visible), not isometric, no strong perspective distortion, no side walls visible, the base of the building sits flat at the bottom of the image.
```

### `monestir.png` (amplada 620)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A large Catalan monastery wing with a cloister gallery of round arches on the ground floor, upper floor with rows of small windows, sandstone walls, terracotta tiled roof, a small bell tower at the right end, a wooden double door in the center. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the building facing the camera straight on (front elevation with the roof slightly visible), not isometric, no strong perspective distortion, no side walls visible, the base of the building sits flat at the bottom of the image.
```

### `sala_pingpong.png` (amplada 340)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A modest outbuilding turned into a recreation hall: whitewashed and ochre walls, a low tiled roof, a wide double wooden door, two shuttered windows, a hand-painted blue sign with a small ping-pong paddle over the door. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the building facing the camera straight on (front elevation with the roof slightly visible), not isometric, no strong perspective distortion, no side walls visible, the base of the building sits flat at the bottom of the image.
```

### `hospederia.png` (amplada 560)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A long two-storey guest house of a monastery, pale sandstone and whitewash, green wooden shutters, terracotta roof, a small iron balcony, a stone porch at the left, climbing vine on the facade. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the building facing the camera straight on (front elevation with the roof slightly visible), not isometric, no strong perspective distortion, no side walls visible, the base of the building sits flat at the bottom of the image.
```

### `cel_stbenet.png` (amplada 420) *(Cel·la de Sant Benet: simple i baixa.)*

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A simple low monk's cell house in stone with a tiled roof, a small chimney, one wooden door and two small windows, a little carved name plaque above the door. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the building facing the camera straight on (front elevation with the roof slightly visible), not isometric, no strong perspective distortion, no side walls visible, the base of the building sits flat at the bottom of the image.
```

### `cel_ntrasra.png` (amplada 560) *(Cel·la de Nostra Senyora: més ampla.)*

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A wider monk's cell house in stone with a tiled roof, a small chimney, one wooden door and two small windows, a little carved name plaque above the door, and a small chapel bell gable on the roof. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the building facing the camera straight on (front elevation with the roof slightly visible), not isometric, no strong perspective distortion, no side walls visible, the base of the building sits flat at the bottom of the image.
```

### `masia.png` (amplada 520)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A Catalan masia farmhouse, wide stone walls, a low gabled roof, an arched doorway, an outdoor stone bench. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the building facing the camera straight on (front elevation with the roof slightly visible), not isometric, no strong perspective distortion, no side walls visible, the base of the building sits flat at the bottom of the image.
```

### `cabana.png` (amplada 330)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A small dry-stone shepherd's hut with a flat stone roof, a wooden door, a bundle of firewood. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the building facing the camera straight on (front elevation with the roof slightly visible), not isometric, no strong perspective distortion, no side walls visible, the base of the building sits flat at the bottom of the image.
```

### `diposit.png` (amplada 300)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A round stone water tank (cistern) with a domed top, a rusty iron hatch and a pipe. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the building facing the camera straight on (front elevation with the roof slightly visible), not isometric, no strong perspective distortion, no side walls visible, the base of the building sits flat at the bottom of the image.
```

---

## Elements d'escenari

### `creu.png` (amplada 70)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A tall slim stone cross on a square stepped plinth, worn by wind, weathered grey stone, a bunch of fresh flowers at the base. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `bassadoria.png` (amplada 260)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. An oval stone basin (old washing pool) full of murky greenish water with a purple mist, mossy stone rim. Camera angle: classic JRPG 3/4 top-down, seen from about 45 degrees above, the top surface clearly visible, not isometric, no strong perspective distortion.
```

### `font.png` (amplada 110)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A small stone wall fountain with a carved spout and a shallow basin, clear cold water falling. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `font_sj.png` (amplada 130)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A rustic woodland spring: mossy rocks, a stone trough, a crystal-clear stream, faint icy blue glow. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `runes.png` (amplada 300)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. Ruins of an unfinished church: broken sandstone arches and pillars, ivy, scattered fallen blocks. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the building facing the camera straight on (front elevation with the roof slightly visible), not isometric, no strong perspective distortion, no side walls visible, the base of the building sits flat at the bottom of the image.
```

### `columna.png` (amplada 58)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A single weathered stone column with a simple capital and engraved signs, half covered in moss. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `altar.png` (amplada 150)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A bare rough stone altar with an old iron cross, candle stubs and small children's offerings (pebbles, feathers). Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `taula_pedra.png` (amplada 110)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A large standing stone tablet with rows of carved mysterious symbols. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
```

### `retaule.png` (amplada 360)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A golden Baroque altarpiece with columns, saints in niches, rich gilt carving. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.
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

### `home_raim.png` (amplada 80)

```
Hand-painted 2D game asset, warm storybook fantasy with a slightly eerie Catalan mountain-village mood, soft painterly shading, muted earthy palette (ochre, moss green, slate blue, stone grey), clean dark-brown outline, light from the upper left, single object centered, isolated on a plain pure white background, no ground shadow, no text, 3/4 top-down view like a classic JRPG. A tall stone statue of a man whose head is turned backwards, carrying a bunch of grapes. Chibi proportions (big head, short round body), thick dark-brown outline, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.
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
