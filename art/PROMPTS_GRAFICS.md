# Prompts per als gràfics que falten

Cada gràfic va a `assets/<nom>.png`. Si el fitxer no hi és, el joc fa servir un dibuix provisional fet amb codi
(vegeu `CATALEG` a `js/assets.js`). Quan hi poses el PNG, apareix sol: no cal tocar res més.

**Com es processen:** el joc retalla els marges, treu el fons blanc connectat a les vores i redueix la imatge a l'amplada
indicada. Per això: fons blanc pur, sense ombres llargues sobre el fons, i res de blanc a la vora de l'objecte.

## Estil base (enganxeu-lo al principi de tots els prompts)

> Hand-painted detailed pixel-art-like illustration for a top-down 3/4 view adventure game, warm Mediterranean palette
> (sandstone ochre, terracotta roof tiles, olive and cypress greens, brown wood), soft light from the upper left,
> clean crisp outlines, rich texture, no text, no watermark, isolated object on a pure white background, no ground
> shadow beyond a tiny contact shadow, slight overhead camera angle (about 35 degrees), same style as a medieval
> monastery in the Catalan countryside.

**Referències ja fetes** (per dir-li a la IA "mateix estil que"): `assets/esglesia.png` (edifici), `assets/roure.png` (arbre),
`assets/sprites/ineu/down.png` (personatge: línia fosca gruixuda, cap gran, hàbit marró, cordó de corda, creu de fusta).

**Personatges:** vista de davant lleugerament des de dalt, cos sencer, proporcions "xibi" (cap gran, cos baix i rodó),
contorn marró fosc gruixut, una sola figura, peus a la part de baix de la imatge.

---

## Edificis

### `porxo.png` — Porxo d'arcades de la Casa Gran (amplada 340; al joc es dibuixa x1,9)
> [Estil base] A long Renaissance stone arcade (porxo) with four round arches resting on slender columns, warm sandstone
> blocks, a tiled shed roof, shadowy interior behind the arches. The SECOND arch from the left holds a closed wrought-iron
> gate (reixa) with a small gold lock. Low plinth at the base, a few ivy leaves. Front view, slightly from above, about
> 1.6:1 width to height.

### `casa_gran.png` — Casa Gran (amplada 640) *(ara no es fa servir: la façana és el porxo)*
> [Estil base] A big old monastery guest house, two floors of sandstone ashlar, small windows with iron bars, wooden door,
> terracotta tiled roof, a stone chimney, ivy on one side. 3/4 view from the front-left.

### `ermita.png` — Ermita de la Desaparició (amplada 300)
> [Estil base] A tiny old roadside hermitage chapel, rough grey-brown stone, low gable roof of weathered tiles, a small
> round-arched wooden door left open, a tiny cross on the roof ridge, moss in the base stones, slightly eerie and abandoned,
> faint cool mist at the foot. Front view.

### `ermita_gabriel.png` — Ermita de Sant Gabriel (amplada 300) · **referència: la foto que vau enviar**
> [Estil base] A small rustic Romanesque chapel in the countryside, front facade only: cut sandstone ashlar blocks in
> warm brown, steep gable roof with brown clay tiles and a stepped edge, a simple bell gable (espadanya) with one arched
> opening and a small bell on top, a round rose window with stone tracery above the door, a round-arched wooden door in
> reddish-brown planks framed by a wider relieving arch, a lighter stone plinth along the base. Dry earth at the foot.
> No cross anywhere. Front view, slight overhead angle, about 1.1:1 height to width.

### `monestir.png` — Monestir (amplada 620)
> [Estil base] A large Catalan monastery wing with a cloister gallery of round arches on the ground floor, upper floor
> with rows of small windows, sandstone walls, terracotta tiled roof, a small bell tower at the right end, a wooden
> double door in the center. 3/4 view from the front-left.

### `sala_pingpong.png` — Sala del Ping-pong (amplada 340)
> [Estil base] A modest outbuilding turned into a recreation hall: whitewashed and ochre walls, a low tiled roof, a wide
> double wooden door, two shuttered windows, a hand-painted blue sign with a small ping-pong paddle over the door.

### `hospederia.png` — Hospederia (amplada 560)
> [Estil base] A long two-storey guest house of a monastery, pale sandstone and whitewash, green wooden shutters,
> terracotta roof, a small iron balcony, a stone porch at the left, climbing vine on the facade.

### `cel_stbenet.png` (420) · `cel_ntrasra.png` (560) — Cel·les
> [Estil base] A monk's cell house in stone with a tiled roof, a small chimney, one wooden door and two small windows, a
> little carved name plaque above the door. Variation A: simple and low (Sant Benet). Variation B: wider, with a small
> chapel bell gable (Nostra Senyora).

### `masia.png` (520) · `cabana.png` (330) · `diposit.png` (300)
> **masia:** a Catalan masia farmhouse, wide stone walls, a low gabled roof, an arched doorway, an outdoor stone bench.
> **cabana:** a small dry-stone shepherd's hut with a flat stone roof, wooden door, a bundle of firewood.
> **diposit:** a round stone water tank (cistern) with a domed top, a rusty iron hatch and a pipe.

---

## Elements d'escenari

| Fitxer | Amplada | Prompt (després de l'estil base) |
|---|---|---|
| `creu.png` | 70 | A tall slim stone cross on a square stepped plinth, worn by wind, weathered grey stone, a bunch of fresh flowers at the base. |
| `bassadoria.png` | 260 | An oval stone basin (old washing pool) full of murky greenish water with a purple mist, mossy stone rim. |
| `font.png` | 110 | A small stone wall fountain with a carved spout and a shallow basin, clear cold water falling. |
| `font_sj.png` | 130 | A rustic woodland spring: mossy rocks, a stone trough, a crystal-clear stream, faint icy blue glow. |
| `runes.png` | 300 | Ruins of an unfinished church: broken sandstone arches and pillars, ivy, scattered fallen blocks. |
| `columna.png` | 58 | A single weathered stone column with a simple capital and engraved signs, half covered in moss. |
| `altar.png` | 150 | A bare rough stone altar with an old iron cross, candle stubs and small children's offerings (pebbles, feathers). |
| `taula_pedra.png` | 110 | A large standing stone tablet with rows of carved mysterious symbols. |
| `retaule.png` | 360 | A golden Baroque altarpiece with columns, saints in niches, rich gilt carving. |
| `carruatge.png` | 230 | A green traveling wagon with large wooden wheels, a canvas roof and a lantern. |
| `carro_sansa.png` | 220 | A small market cart with baskets of vegetables and a striped awning. |
| `pergola.png` | 260 | A stone pergola with round columns and a roof woven with ivy. |
| `taula_pp.png` | 240 | A ping-pong table, dark green, with a net, paddles and a white ball. |
| `tiller.png` | 340 | A huge ancient linden (til·ler) with a thick twisted trunk and wide light-green foliage. |
| `alzina_buida.png` | 280 | (ja existeix) |
| `llosa.png` | 90 | A square stone slab set in the ground with a hidden-flower carving. |
| `reixa.png` | 48 | (generat per codi; opcional) A square iron grate on the ground with faint mist. |
| `telescopi_mon.png` | 80 | A brass telescope on a wooden tripod, pointing to the sky. |
| `runna_pedra.png` | 110 | A pale stone with a legendary sword stuck in it, soft glow. |
| `espelma.png` | 20 | A single lit candle in a small iron holder. |
| `taula_sopar.png` | 380 | A long rustic dining table with plates, bread, jugs and candles. |
| `cofre.png` | 70 | A wooden treasure chest with iron bands and a gold lock. |
| `olla.png` | 110 | A big black iron pot on a small campfire, steam rising. |
| `foc.png` | 80 | A crackling campfire with logs and sparks. |
| `pergami.png` | 44 | A small rolled parchment tied with a red ribbon. |
| `lapida.png` | 40 | A small mossy gravestone with a tiny cross. |
| `tomba_esquerdada.png` | 240 | A large stone tomb with a deep diagonal crack and a faint purple glow inside. |
| `ocell.png` | 34 | A small brown bird. |
| `llac.png` | 36 | A small crystal lake stone / ice shard. |

---

## Personatges (amplada 96 si no s'indica) — estil del bloc de personatges

Un prompt per personatge: *"[Estil base] [Personatge], chibi proportions, thick dark brown outline, full body, front view, pure white background."*

| Fitxer | Descripció |
|---|---|
| `pare_jordi.png` | Elderly monk, grey hair, round glasses, black habit. |
| `germa_andreu.png` | Young monk with dark hair, black habit, holding a football (Barça colors). |
| `pare_daniel.png` | Middle-aged monk, brown hair, black habit, choir director. |
| `pare_alcui.png` | Very old monk with white hair, black habit, carrying a thick red book. |
| `pianista.png` (100) | Short stout older woman with glasses, grey hair, purple dress. |
| `tieta.png` / `tieta2.png` | Two elderly aunts with grey hair, one in blue, one in dusty rose with glasses. |
| `neus.png` / `marit_neus.png` | A woman with dark hair in a red dress; her husband in a teal shirt. |
| `yordi.png` / `judit.png` / `daniel_t.png` | A man in a green jacket; a woman in a mustard dress; a man in a purple-blue shirt. |
| `turbo.png` (80) | Small boy, orange t-shirt, very energetic. |
| `juli.png` | Boy in a pale blue outfit with small angel wings and glasses. |
| `frederic.png` | Old bearded man in grey clothes holding a shovel. |
| `eloi.png` (110) | Big strong man in a red shirt. |
| `josep.png` | Man in dark clothes and a flat cap. |
| `garf.png` | Young chubby blond inventor in a brown tunic, goggles on the head. |
| `isidre.png` | Gardener with a limp, a walking stick, green clothes and a cap. |
| `jordi_caseta.png` | Man in olive clothes and a cap. |
| `sansa.png` | Woman with auburn hair in a golden dress. |
| `home_carruatge.png` | Man in a green uniform and a cap, the wagon driver. |
| `nena_trenes.png` (80) | Small girl with long braids in a pale lavender dress, ghostly pale skin. |
| `jaumeta.png` | Young woman in an olive dress, a red rose in her hair, fingers ready to snap. |
| `home_raim.png` (80) | A tall stone statue of a man whose head is turned backwards, carrying a bunch of grapes. |
| `pastor_a.png` / `pastor_b.png` / `pastor_vell.png` | Three shepherds: a man in a brown wool vest, a woman in a plum shawl, an old bearded man with a cane. |
| `pastor_boira.png` (110) | A tall shepherd in a dark purple cloak, covered in violet mist. |
| `ombra_monjo.png` (150) | A translucent ghost of an old monk in dark blue light. |

## Enemics

| Fitxer | Descripció |
|---|---|
| `escolopendra.png` (64) | A large red-brown centipede, segmented, many legs, seen from above. |
| `gripau.png` (56) | A swollen toad with purple-green skin and glowing eyes. |
| `visitant.png` | A tourist corrupted by mist: orange shirt, grey-green skin, cap and glasses. |
| `espantaocell.png` (70) | A straw scarecrow in a ragged coat. |
| `ovella.png` / `ovella_boira.png` | A fluffy sheep; the second one with violet glowing eyes and mist. |
| `bolet.png` | (ja existeix) |

---

## Consells
- Genereu cada gràfic **a part**, amb fons blanc pur; el joc ja treu el fons.
- Si una imatge surt amb fons de quadrícula o degradat, demaneu "plain pure white #FFFFFF background".
- Per mantenir l'estil, pugeu `assets/esglesia.png` com a imatge de referència i digueu "same art style".
- Els edificis es dibuixen amb els peus (la base) a la part de baix de la imatge; el joc els posa per la base.
- Quan en tingueu un, dieu-m'ho i comprovo la mida, les portes i les col·lisions (issue "Ajustar portes i col·lisions").
