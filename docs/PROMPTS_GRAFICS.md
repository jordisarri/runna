# Prompts per als gràfics que falten



## Gràfics fets



- [x] `alzina_buida`

- [x] `rialla` (fet: `art/natura/rialla.png`, amb el fons i les ombres netejats; el prompt és sota, a Elements d'escenari)

- [x] `arbre`

- [x] `arma_basto`

- [x] `arma_tiller`

- [x] `bassadoria`

- [x] `bolet`

- [x] `font_sj` i `font_sj_neta` (la Font del Bisbe, adormida i neta: `art/objectes/font_sj.png` i `font_sj_neta.png`)

- [x] `bolet_verinos` (fet: `art/enemics/bolet_verinos.jpg`; el prompt és sota, a Enemics)

- [x] `branca`

- [x] `carruatge`

- [x] `casa_gran`

- [x] `cel_ntrasra`

- [x] `cel_stantoni`

- [x] `cel_stbenet`

- [x] `cercle_bolets`

- [x] `creu`

- [x] `creu_desaparicio`

- [x] `ermita`

- [x] `ermita_gabriel`

- [x] `esbarzer`

- [x] `esglesia`

- [x] `eve`

- [x] `flauta` → `ineu/tarota`

- [x] `pomers`

- [x] `arrels_tiller`

- [x] `basto_ocellaire`

- [x] `ocellaire_cansat`

- [x] `meus` (Meus) i `molner` (senyor Llaminer)

- [x] `carro_rosansa` (Rosansa)

- [x] `rosansa` (Rosansa) i el seu retrat

- [x] `galf`

- [x] `germa_aldreu`

- [x] `germa_franci`

- [x] `follet_carro`

- [x] `home_raim`

- [x] `home_raim_desperta`

- [x] `home_raim_n`

- [x] `home_raim_ne`

- [x] `home_raim_e`

- [x] `hostatgeria`

- [x] `ineu_inconscient`

- [x] `isilder`

- [x] `joaneta`

- [x] `georgi_caseta`

- [x] `pare_jorda_desperta`

- [x] `jusef`

- [x] `julius`

- [x] `mandu`

- [x] `mandu_trencada`

- [x] `mare_nena`

- [x] `monestir`

- [x] `carmelia`

- [x] `dolora`

- [x] `pilaria`

- [x] `nen_flam`

- [x] `nen_sardin`

- [x] `nen_uri`

- [x] `nena_trenes`

- [x] `ocellaire`

- [x] `ocellaire_idle2`

- [x] `ocellaire_idle3`

- [x] `ocellaire_rugit`

- [x] `ombra_monjo`

- [x] `pallofa`

- [x] `pare_alcovi`

- [x] `pare_daimiel`

- [x] `pare_jorda`

- [x] `pastor_a`

- [x] `pastor_b`

- [x] `pastor_boira`

- [x] `aldreu_guardia`

- [x] `pastor_derrota`

- [x] `pastor_camina`

- [x] `pastor_apunta`

- [x] `pastor_ataca`

- [x] `pastor_enfadat`

- [x] `pastor_vell`

- [x] `pi`

- [x] `pi_tres_cants` (viu), `pi_tres_cants_mort` (sec, adormit) i `pi_arrels` (la barrera): el pi es transforma del sec al viu quan es desperta

- [x] `pi_pinyer`

- [x] `pianista`

- [x] `proleg/boira`

- [x] `proleg/mati`

- [x] `proleg/nens`

- [x] `proleg/ocellaire`

- [x] `proleg/segell`

- [x] `retaule`

- [x] `retaule_obert`

- [x] `roca`

- [x] `roure`

- [x] `rovello`

- [x] `runes`

- [x] `sala_pingpong`

- [x] `taverna`

- [x] `tiller`

- [x] `tomba_angel`

- [x] `tomba_angel_content`

- [x] `tomba_esquerdada`

- [x] `tomba_tancada`

- [x] `venerables`

- [x] `visitant_zombi`

- [x] `xiprer`



- [x] `pi_arrels`, `rialla`, `placa_pi`, `placa_dolmen` i els tres emblemes del Dolmen (`emblema_arbre`, `emblema_saber`, `emblema_benedicio`)
- [x] `ineu/aixeca_buit`, `ineu/tarota_gran` i `ocellaire_genolls`
- [x] Retrats: `mandu`, `mandu_trencada`, `nen_uri`, `nen_flam`, `nen_sardin`, `ocellaire` i `ocellaire_derrotat`
- [x] `creu` i `creu_desaparicio` (refets en vista frontal 3/4, `art/objectes/creu.png`)
- [x] `home_raim_caigut` i `home_raim_apunta` (fets amb AutoSprite a partir de `home_raim_desperta`), pedestal refet
- [x] `boto_sarro`, `boto_consells` i la icona de l'aplicació (`pwa/icona`)


Cada gràfic va a `assets/<carpeta>/<nom>.png` (carpetes: `edificis`, `personatges`, `enemics`, `natura`, `objectes`, `armes`; la carpeta de cada

gràfic es veu a `CATALEG`, a `js/assets.js`). Si el fitxer no hi és, el joc fa servir un dibuix provisional fet amb codi

(vegeu `CATALEG` a `js/assets.js`). Quan hi poses el PNG, apareix sol: no cal tocar res més.



**Cada prompt és complet:** porta l'estil base, la descripció i la perspectiva. Només cal copiar el bloc (a GitHub hi ha un

botó de copiar a dalt a la dreta de cada bloc) i enganxar-lo al generador.



**Com es processen:** el joc retalla els marges, treu el fons blanc connectat a les vores i redueix la imatge a l'amplada

indicada. Per això: fons blanc pur i res de blanc a la vora de l'objecte.



**Referències d'estil** (pugeu-les al generador i digueu «same art style as the reference image»):

- **Personatges i enemics:** qualsevol dels chibis fets, p. ex. `art/personatges/isilder.jpg` o `art/personatges/pare_jorda.jpg`.

- **Edificis, natura i objectes:** un d'ja fet, p. ex. `art/edificis/esglesia.png` (edifici) o `art/natura/roure.png` (arbre).

- **L'Ineu** té el seu propi estil (`art/ineu/monjo aventurer.png`): no és la referència dels altres.



**Estil gràfic:** tot el joc comparteix un mateix render: contorn **negre** gruixut i net, *cel-shading* a dos tons (color base + ombra plana) amb punts de llum suaus, colors saturats però terrosos, llum de dalt-davant, fons blanc pur i **cap ombra projectada**. Està definit a dos fitxers JSON:

- `eines/personatges.json` («Chibi Adventure Sprite»): personatges i enemics (proporcions chibi, de cara, cos sencer).

- `eines/edificis.json` («Chibi Adventure Environment»): edificis, natura i objectes (formes rodones i grassonetes, mateixa pell).



Els prompts d'aquest document són aquests dos JSON passats a text: **si canvieu l'estil, canvieu-lo als JSON i regenereu el bloc d'estil dels prompts**. Si el generador admet JSON, també es pot enganxar tal qual i afegir-hi la descripció del que es vol dibuixar.



**Perspectiva:** els **edificis** es veuen com a *A Link to the Past*: façana de cara i teulada visible des de dalt, sense parets laterals. La resta d'objectes, vista 3/4 des de dalt (uns 30°) i de cara a la càmera.

Els objectes plans (taules, basses, lloses) es veuen des d'uns 45°. Ja està inclòs a cada prompt.




---

## Estat

Tots els gràfics de dalt són fets i connectats (els seus prompts s'han esborrat d'aquest document).

**Pendents:** `cercle_runes` (el cercle de runes del terra de l'Escalinata; ara es dibuixa amb codi).

---

## Pendent

### `masia_cirosa.png` i `masia_georgi.png` → `assets/edificis/masia_cirosa.webp` i `masia_georgi.webp` (amplada 520 cadascun) *(Les dues masies de l'exterior: la **masia dels pastors de la Cirosa** (`ZonaCirosa`, `js/zones/cirosa.js`; gràfic `masia`) i la **masia d'en Jorgi** (`ZonaGeorgi`, `js/zones/nord.js`; gràfic `masia_georgi`). Ara el joc les dibuixa amb codi (`dibuixarMasia` i `dibuixarMasiaGeorgi`, a `js/dibuixos.js`) i no agraden: es volen generar. Han de ser **diferents** entre elles. Les dues, **vistes de front**, amb l'edifici ocupant TOTA l'amplada de la imatge de punta a punta (sense sòl ni lloses més amples que la façana, sense parets laterals), la base de la façana tocant la vora de baix, **fons blanc pur (#FFFFFF)** (el trec jo), **sense persones, plantes, barrils ni text**. **Porta al MIG de l'amplada, amb la part de dalt a 0,56 de l'alçada de la imatge i uns 0,15 de l'amplada de la imatge d'ample** (el joc hi posa la porta animada i la sortida): és l'única restricció de composició. Proporció: Cirosa 1,6:1 (més ampla que alta), Jorgi 1,28:1.)*

**Estil comú (afegiu-ho davant de cada prompt, o doneu com a referència la roca de `art/objectes/font_sj.png` i `art/natura/arbre.png`):** *chunky hand-painted 2D game asset, thick bevelled stones and planks like a stylised cartoon-3D look, bold clean dark-brown outline (#3b2412), warm saturated colours, two-tone cel shading with soft highlights on the top-left edges, matching the style of a charming chibi fantasy adventure game.*

**1. `masia_cirosa.png` (la casa pobra però neta dels pastors desterrats):**

```
A single rustic shepherds' stone farmhouse seen straight on from the front, one storey plus a steep roof, in a chunky hand-painted 2D game style with thick bevelled stones and planks, bold dark-brown outline, warm saturated colours, two-tone cel shading with soft highlights on the upper-left edges. The walls are made of chunky rounded grey fieldstone blocks of different sizes with dark mortar lines, bevelled with light tops and darker bottoms. A cobbled stone plinth runs along the base. The roof is covered with big terracotta-orange rounded tiles in offset rows, with a thick wooden ridge beam on top held by three grey stone clamps, a small pointed wooden dormer window with a stone cap on the left, and a chunky grey stone chimney with a flat stone slab on the right. In the exact centre, a tall round-arched doorway: a thick arch of large bevelled grey voussoir stones with a bigger keystone carved with a small cross, and a heavy dark-wood plank door with three iron straps and studs and an iron ring handle, two stone steps in front. Four small windows with grey stone frames and stone lintels, dark glass, and old brown wooden shutters opened flat against the wall, two on each side of the door. The building fills the whole width of the image from edge to edge (no ground slab wider than the facade, no side walls). No plants, no barrels, no people, no text, no watermark. Isolated on a pure white background (#FFFFFF). The door is centred, about 15% of the image width, with its top at about 56% of the image height. Image proportions about 1.6:1 (wider than tall).
```

**2. `masia_georgi.png` (la casa de pagès càlida d'en Jorgi, de pedra ocre i fusta clara, per fer-la ben diferent de la de la Cirosa):**

```
A single warm Catalan stone farmhouse (masia) seen straight on from the front, two storeys, in a chunky hand-painted 2D game style with thick bevelled stones and planks, bold dark-brown outline, warm saturated colours, two-tone cel shading with soft highlights on the upper-left edges. The walls are rough exposed ashlar made of chunky rounded sandstone blocks in warm ochre, sand, honey and slightly reddish tones, with pale mortar lines and a few small patches of lime plaster between the stones. A low terracotta tile roof with a thick wooden eaves beam and a small stone chimney at the right end. On the upper floor, two windows with light orange pine-wood frames and dark blue-green glass reflecting tree tops: the left one bigger, the right one smaller and a little lower, each with a stone sill. In the exact centre of the ground floor, a rectangular doorway of light yellow-orange pine wood with a tall narrow glass panel, under a pale grey stone lintel with a small old iron lantern above it, and two large old dark-brown wooden shutters with vertical planks, crossbars and black iron hinges folded open flat against the wall on both sides of the door, one flat stone step in front. The building fills the whole width of the image from edge to edge (no ground slab wider than the facade, no side walls). No plants, no barrels, no people, no text, no watermark. Isolated on a pure white background (#FFFFFF). The door is centred, about 15% of the image width, with its top at about 56% of the image height. Image proportions about 1.28:1 (wider than tall).
```

(Referència d'estil: la teva imatge de la casa de pedra gris, per al to de les pedres i la teulada, **només com a inspiració**: no la feu servir com a font ni com a imatge de base, perquè porta marca d'aigua. Quan tingueu les imatges, passeu-me-les: les converteixo a `assets/edificis/`, poso `file:` a `masia` i `masia_georgi` de `js/assets.js` i comprovo la porta animada, la sortida i les col·lisions.)

---

### `senyor_budo.png` → `assets/personatges/senyor_budo.webp` (amplada 78) *(El **senyor Buidor**, el vell assegut a la taula de l'esquerra de tot de la Taverna (`ZonaTavernaInt`, `js/zones/taverna.js`), assaborint l'anís escarxat que li ha preparat l'Eve. NPC només de conversa (`DIALEGS.senyorBudo`). Ara el joc el dibuixa amb un placeholder. Imatge **de cos sencer, ASSEGUT en un tamboret, de cara a la càmera**, fons blanc pur (el trec jo); la taula del joc li tapa les cames, així que cal que tingui les cames i el tamboret dibuixats igualment.)*

```
A chubby, jovial, grumpy-looking old man, seen from the front in a high three-quarter view, SITTING on a small round wooden tavern stool, full body visible (stool and legs included), calm and relaxed, savouring a drink. Chibi proportions like the reference image (large head, small body). He has a BIG round bulbous nose (red-ish at the tip), round wire-rimmed spectacles, small squinting happy eyes, white eyebrows, a very sparse amount of white hair (not bald: just a few thin white wisps around the sides and a little on top), rosy cheeks, a soft double chin and a big round belly. He wears a worn brown woollen waistcoat over a cream-coloured shirt with rolled-up sleeves, dark baggy trousers, and old leather shoes. In one hand, held up in front of his chest, he holds a small glass of milky cloudy white-yellow aniseed liqueur (anís escarxat) with a small piece of ice; the other hand rests on his knee. A relaxed contented face, eyes half closed as he savours the drink. 2D charming game character in the same art style as the reference image: bold clean dark outline, rich saturated warm colours, two-tone cel shading, hand-painted look. Isolated on a pure white background (#FFFFFF), no ground, no table, no shadow, no text.
```

(Referència d'estil: `assets/personatges/galf.webp` o `assets/personatges/pomers.webp`. Si també vols el **retrat** de diàleg: mateix personatge, de cara i de tres quarts, fins a les espatlles, `assets/retrats/senyor_budo.webp`; mentrestant el joc fa servir el cap retallat de l'sprite.)

---

### `cercle_runes.png` → `assets/objectes/cercle_runes.webp` (amplada 440) *(El **cercle de runes** gravat a terra al voltant del pedestal de l'Home del Raïm, que s'encén en lila quan el guardià es desperta (`cercleRunes`, `js/zones/casa.js`). Ara el joc el dibuixa amb codi; quan hi hagi el PNG, el substitueix. Imatge **apaïsada, 2,7:1** (el joc la fa servir a uns 440 × 163), fons blanc pur (el trec jo).)*

```
A magical rune circle engraved into a stone floor, seen from a high three-quarter top-down view as a flat ELLIPSE (about 2.7 times wider than tall), perfectly centred. Two concentric thin ellipses of carved stone grooves with a ring of twelve distinct ancient runes carved between them (simple angular symbols: crosses, triangles, bars, circles), the grooves glowing a soft lilac-violet light as if filled with magic mist, with small wisps of lilac mist rising from some of the runes and a few tiny chips of stone. 2D charming game asset in the same art style as the reference image: bold clean dark outline, rich saturated colours, two-tone cel shading, hand-painted look. Only the circle itself, isolated on a pure white background (#FFFFFF), no floor tiles, no shadow, no text, no frame, no pedestal in the middle (the centre is empty).
```

(Referència d'estil: `art/enemics/home_raim_apunta.png` per al lila de la boira i `art/objectes/creu.png` per al contorn.)

---

## Consells

- Genereu cada gràfic **a part**, amb fons blanc pur; el joc ja treu el fons.

- Si una imatge surt amb fons de quadrícula o degradat, afegiu "plain pure white #FFFFFF background".

- Els edificis es dibuixen amb els peus (la base) a la part de baix de la imatge; el joc els posa per la base.

- Quan en tingueu un, dieu-m'ho i comprovo la mida, les portes i les col·lisions (issue "Ajustar portes i col·lisions").



---


