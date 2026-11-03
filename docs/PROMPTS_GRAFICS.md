# Prompts per als gràfics que falten



## Gràfics fets



- [x] `alzina_buida`

- [x] `arbre`

- [x] `arma_basto`

- [x] `arma_tiller`

- [x] `bassadoria`

- [x] `bolet`

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

- [x] `eva`

- [x] `flauta` → `ineu/tarota`

- [x] `frederic`

- [x] `carro_sansa` (Rosansa)

- [x] `sansa` (Rosansa)

- [x] `garf`

- [x] `germa_andreu`

- [x] `germa_francesc`

- [x] `home_carruatge`

- [x] `home_raim`

- [x] `home_raim_desperta`

- [x] `home_raim_n`

- [x] `home_raim_ne`

- [x] `home_raim_e`

- [x] `hostatgeria`

- [x] `ineu_inconscient`

- [x] `isidre`

- [x] `jaumeta`

- [x] `jordi_caseta`

- [x] `jordi_desperta`

- [x] `josep`

- [x] `juli`

- [x] `mare_nena`

- [x] `monestir`

- [x] `monja_charm`

- [x] `monja_pains`

- [x] `monja_phili`

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

- [x] `pare_alcui`

- [x] `pare_daniel`

- [x] `pare_jordi`

- [x] `pastor_a`

- [x] `pastor_b`

- [x] `pastor_boira`

- [x] `pastor_vell`

- [x] `pi`

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

- [x] `tomba_angel_flors`

- [x] `tomba_esquerdada`

- [x] `tomba_tancada`

- [x] `venerables`

- [x] `visitant_zombi`

- [x] `xiprer`



Cada gràfic va a `assets/<carpeta>/<nom>.png` (carpetes: `edificis`, `personatges`, `enemics`, `natura`, `objectes`, `armes`; la carpeta de cada

gràfic es veu a `CATALEG`, a `js/assets.js`). Si el fitxer no hi és, el joc fa servir un dibuix provisional fet amb codi

(vegeu `CATALEG` a `js/assets.js`). Quan hi poses el PNG, apareix sol: no cal tocar res més.



**Cada prompt és complet:** porta l'estil base, la descripció i la perspectiva. Només cal copiar el bloc (a GitHub hi ha un

botó de copiar a dalt a la dreta de cada bloc) i enganxar-lo al generador.



**Com es processen:** el joc retalla els marges, treu el fons blanc connectat a les vores i redueix la imatge a l'amplada

indicada. Per això: fons blanc pur i res de blanc a la vora de l'objecte.



**Referències d'estil** (pugeu-les al generador i digueu «same art style as the reference image»):

- **Personatges i enemics:** qualsevol dels chibis fets, p. ex. `art/personatges/isidre.jpg` o `art/personatges/pare_jordi.jpg`.

- **Edificis, natura i objectes:** un d'ja fet, p. ex. `art/edificis/esglesia.png` (edifici) o `art/natura/roure.png` (arbre).

- **L'Ineu** té el seu propi estil (`art/ineu/monjo aventurer.png`): no és la referència dels altres.



**Estil gràfic:** tot el joc comparteix un mateix render: contorn **negre** gruixut i net, *cel-shading* a dos tons (color base + ombra plana) amb punts de llum suaus, colors saturats però terrosos, llum de dalt-davant, fons blanc pur i **cap ombra projectada**. Està definit a dos fitxers JSON:

- `eines/personatges.json` («Chibi Adventure Sprite»): personatges i enemics (proporcions chibi, de cara, cos sencer).

- `eines/edificis.json` («Chibi Adventure Environment»): edificis, natura i objectes (formes rodones i grassonetes, mateixa pell).



Els prompts d'aquest document són aquests dos JSON passats a text: **si canvieu l'estil, canvieu-lo als JSON i regenereu el bloc d'estil dels prompts**. Si el generador admet JSON, també es pot enganxar tal qual i afegir-hi la descripció del que es vol dibuixar.



**Perspectiva:** els **edificis** es veuen com a *A Link to the Past*: façana de cara i teulada visible des de dalt, sense parets laterals. La resta d'objectes, vista 3/4 des de dalt (uns 30°) i de cara a la càmera.

Els objectes plans (taules, basses, lloses) es veuen des d'uns 45°. Ja està inclòs a cada prompt.



## Estat



**Pendents** (el joc fa servir el dibuix provisional o el recurs alternatiu): `ineu/tarota_gran`, `andreu_guardia`, `arrels_tiller`, `basto_ocellaire`, `gabia`, `gabia_oberta`, `home_raim_o`, `marit_neus`, `neus`, `ocellaire_cansat`, `retrat_rosansa`.



**Nous, encara sense ús al joc** (preparats per a quan s’implementin): `andreu_guardia`, `gabia`, `gabia_oberta`.



Els prompts de sota són només dels pendents i dels nous (els fets només es llisten dalt de tot).



---



## Elements d'escenari

### `arrels_tiller.png` (amplada 440)

```

Charming 2D cartoon game environment asset in the 'Chibi Adventure Environment' style, matching the attached reference images: crisp vector-like illustration with bold clean dark-brown outlines, soft cel shading, rich earthy colors, and the same 3/4 top-down JRPG camera. Create ONE wide, irregular cluster of ancient living roots from a huge linden tree, viewed from slightly above. The roots have thick twisted trunks and smaller branching roots, deep bark grooves, moss, a few heart-shaped linden leaves, and clumps of disturbed earth at their bases. They rise from the ground and interlock into a dense natural barrier that completely blocks a woodland path; the silhouette is broad and low (about 2.5 times wider than tall), with uneven root tips and visible gaps only between the upper branches, not enough to walk through at ground level. The roots should look old, powerful, magical, and organic, not like a fence, a wall, a hedge, or a bundle of thin sticks. Match the game's existing trees and forest palette. Single centered object, full silhouette visible, isolated on a pure white background (#FFFFFF) for automatic background removal; no scenery, no path, no characters, no text, no cast shadow.

```

## Personatges



### `ineu/tarota_gran.png` → `assets/ineu/tarota_gran.webp` (amplada 420) *(Primer pla gran de l'Ineu tocant la tarota, que surt per sobre de l'escenari mentre és obert el pergamí de la música. Puja com a referència `art/ineu/tarota.png`. La part de baix queda tapada pel pergamí: no cal que s'hi vegin les mans senceres, però sí la tarota fins a la campana. Fins que no hi sigui, el joc fa servir un retall ampliat de `art/ineu/tarota.png`, que ja queda prou bé.)*

```
Charming 2D cartoon illustration in exactly the same style as the attached reference image of the monk (bold clean dark outline, soft cel shading, warm earthy colours, chibi features). A CLOSE-UP, half-length portrait of the SAME monk character (same face, same tonsured brown hair, same brown hooded habit and wooden rosary), seen from the front, from the top of his head down to his waist, the head big and filling the upper half of the image. He is playing a TAROTA, the traditional Catalan double-reed shawm: a long straight conical wooden pipe of dark turned boxwood, about as long as the monk's forearm and hand together, narrow at the top and gradually widening downwards, with a few thin decorative turned rings, seven finger holes in a line on the front, ending at the bottom in a wide flared trumpet-like bell; at the top a short thin brass tube (staple) carries a tiny flat double reed made of cane, and ONLY that small reed goes between his lips. It is held pointing DOWN and forward at about 45 degrees (never sideways like a transverse flute), with the left hand on the upper holes and the right hand on the lower holes, fingers covering the holes. It is NOT a recorder, NOT a tin whistle, NOT a flute, NOT a clarinet: it is clearly longer, darker and conical with a big flared bell. Eyes closed, eyebrows lifted with feeling, cheeks puffed, completely absorbed in the music, a slight tilt of the head. The bell of the tarota reaches the lower right part of the image. A few small golden music notes come out of the bell. Single character, centered, isolated on a pure white background (#FFFFFF), no scenery, no text, no frame, no cast shadow. Portrait format (about 4:5).
```

### `ocellaire_cansat.png` (amplada 110) *(L'Ocellaire cansat i ajupit: el moment del combat en què se li pot colpejar el cap. Ara el joc no l'aixafa amb codi: mentre no hi hagi aquest dibuix, es veu el sprite base i només baixa la zona del cap. Surt a `assets/enemics/ocellaire_cansat.webp`, al mateix llenç que l'idle i el rugit (180x329, peus al mateix lloc). Puja el sprite base de l'Ocellaire com a referència.)*



```

Edit the attached reference image of the Ocellaire. Keep EXACTLY the same character, the same bald head with no hat or hood, the same black feather costume, the same chains, padlock and small golden cage, the same chibi proportions, the same outline and colouring, the same front-facing 3/4 top-down view, the same image size and framing with the feet at exactly the same place at the bottom, and the same pure white background (#FFFFFF), no text. Change ONLY the pose: he is EXHAUSTED after an attack, crouching low and bent forward, knees bent, both pale hands resting on his knees, shoulders dropped, panting. His big bald head hangs low and forward: the TOP of his head is at about 35% of the image height from the top, and the centre of his head at about 45%, so the whole figure is much lower than in the reference. His violet eyes are dim and half-closed, his mouth open, gasping. The feathers of his collar and sleeves droop down, the broken chains hang limp, the purple mist at his feet is small and weak. A single character, full body, whole body visible.

```



### `neus.png` (amplada 96)



```

Charming 2D cartoon game character sprite in the 'Chibi Adventure Sprite' style, matching the attached reference image: chibi super-deformed proportions (head to body about 1:2 to 1:2.5, enlarged rounded head with soft cheeks, compact slightly stocky torso, short stout limbs, simplified hands, rounded shoes), large expressive glossy eyes with a dark outline and detailed irises, warm friendly expression, minimalist facial lines (age shown through hair colour and shape, glasses and subtle folds, never deep wrinkles), bold clean consistent black outline around the whole silhouette with medium-to-fine clean dark inner lines, no sketchy pencil texture, rich saturated yet earthy palette in distinct solid colour blocks per garment, two-tone cel shading (base tone plus solid shadow plane) with subtle smooth gradient highlights, clean light from the top-front, strictly front-facing eye-level view, full body standing centered, ground-planted, isolated on a pure white background (#FFFFFF), no cast shadow, no ground shadow, no text. A woman with dark hair in a red dress. Chunky chibi proportions like the reference image (big round head with a friendly expressive face, short plump body, small hands and feet), thick dark-brown outline, cloth with soft worn texture and visible folds, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.

```



### `marit_neus.png` (amplada 96)



```

Charming 2D cartoon game character sprite in the 'Chibi Adventure Sprite' style, matching the attached reference image: chibi super-deformed proportions (head to body about 1:2 to 1:2.5, enlarged rounded head with soft cheeks, compact slightly stocky torso, short stout limbs, simplified hands, rounded shoes), large expressive glossy eyes with a dark outline and detailed irises, warm friendly expression, minimalist facial lines (age shown through hair colour and shape, glasses and subtle folds, never deep wrinkles), bold clean consistent black outline around the whole silhouette with medium-to-fine clean dark inner lines, no sketchy pencil texture, rich saturated yet earthy palette in distinct solid colour blocks per garment, two-tone cel shading (base tone plus solid shadow plane) with subtle smooth gradient highlights, clean light from the top-front, strictly front-facing eye-level view, full body standing centered, ground-planted, isolated on a pure white background (#FFFFFF), no cast shadow, no ground shadow, no text. A man in a teal shirt, her husband, dark hair. Chunky chibi proportions like the reference image (big round head with a friendly expressive face, short plump body, small hands and feet), thick dark-brown outline, cloth with soft worn texture and visible folds, full body, front-facing standing pose, seen from slightly above (classic JRPG 3/4 top-down), whole body visible, feet at the bottom of the image, a single character.

```



### Retrat de la Rosansa: `retrats/sansa_retrat.jpg` (als diàlegs) *(Puja com a referències `art/personatges/sansa.png` i un retrat fet, p. ex. `art/retrats/eva_retrat.jpg`. Xat nou i sense noms. Es converteix amb `eines/convertir_retrats.js sansa`. Ara hi ha un retrat provisional retallat del sprite.)*

```
Charming 2D cartoon character PORTRAIT for the dialogue box of a game, in exactly the same style as the attached reference portrait (bold clean black outline, soft cel shading with subtle gradient highlights, warm earthy colours, slightly chibi rounded features, big expressive glossy eyes). Draw the SAME woman as in the attached full-body character image: a cheerful middle-aged travelling market vendor with a round rosy face, big warm brown eyes, a wide friendly smile, soft smile lines, dark brown hair in a thick braid over one shoulder, a green-and-white checked headscarf tied at the nape, a moss-green wool dress and a brown knitted shawl over the shoulders. Head and shoulders only (bust, cut just below the shoulders like the reference portrait), head turned three-quarters towards the RIGHT, looking at someone she is talking to, lively and kind expression, mouth slightly open as if chatting. Single character, centered, isolated on a pure white background (#FFFFFF), no hands, no basket, no text, no frame, no cast shadow. Square format.
```



## Enemics



Tots els enemics són bestioles o persones **corrompudes per la boira lila**: han de llegir-se bé a mida petita (uns 60-110 px al joc), amb una silueta clara i ulls que brillen.



### Cap girat de l'estàtua: `home_raim_o.png` (amplada 78) *(Opcional: el puzle gira el cap de l'estàtua amb cada volta de la palanca. Les variants nord, nord-est i est ja estan fetes; el sud és `home_raim.png`. Si no hi ha aquesta variant, l'estàtua no canvia de cap i només es mou la fletxa.)*



#### `home_raim_o.png` — cap cap al ponent (esquerra)



```

Edit the attached image: keep the statue, the rocky lump, the pedestal, the pose of the body and arms, the cloth, the grapes, the colours, the outline style, the image size and the exact position and size of every part IDENTICAL, pixel for pixel; change ONLY the direction the head (face and curly hair) is turned. Isolated on a pure white background (#FFFFFF), no text, no shadow. The statue now has the head turned in pure profile to the viewer's left, looking to the left, a little upwards, the curly hair, the nose and the beard in profile.

```





### Enemics futurs (Acte 3)



### `andreu_guardia.png` (amplada 96) *(El Germà Andreu fent de guàrdia de la Gàbia (segon combat).)*



```

Charming 2D cartoon game creature sprite in the 'Chibi Adventure Sprite' style, matching the attached reference image: chibi super-deformed proportions (enlarged rounded head or body, compact stocky build, short stout limbs), big expressive glossy eyes, cute but slightly uncanny, bold clean consistent black outline around the whole silhouette with medium-to-fine clean dark inner lines, no sketchy pencil texture, rich saturated yet earthy palette in distinct solid colour blocks, two-tone cel shading (base tone plus solid shadow plane) with subtle smooth gradient highlights, clean light from the top-front, front-facing eye-level view, centered, isolated on a pure white background (#FFFFFF), no cast shadow, no ground shadow, no text. A young monk with dark hair, black habit with violet mist clinging to it, holding a wooden staff like a guard, smug smile, faintly glowing violet eyes. Game enemy sprite, readable silhouette at small size, menacing but not gory (family-friendly), the corruption of the mist shown as wisps of violet-lilac fog and softly glowing violet eyes. Seen from slightly above (classic JRPG 3/4 top-down), whole creature visible, facing the camera or three-quarter to the left, feet/base at the bottom of the image, thick dark-brown outline, a single creature, no background, no ground.

```



### `basto_ocellaire.png` (amplada 180) *(Bàcul de l'Ocellaire com a imatge: `assets/armes/basto_ocellaire.png`; ara el joc el dibuixa amb codi.)*



```

Charming 2D cartoon game creature sprite in the 'Chibi Adventure Sprite' style, matching the attached reference image: chibi super-deformed proportions (enlarged rounded head or body, compact stocky build, short stout limbs), big expressive glossy eyes, cute but slightly uncanny, bold clean consistent black outline around the whole silhouette with medium-to-fine clean dark inner lines, no sketchy pencil texture, rich saturated yet earthy palette in distinct solid colour blocks, two-tone cel shading (base tone plus solid shadow plane) with subtle smooth gradient highlights, clean light from the top-front, front-facing eye-level view, centered, isolated on a pure white background (#FFFFFF), no cast shadow, no ground shadow, no text. A long horizontal sinister staff of black twisted wood with a golden band in the middle, and at EACH END a curled golden hook holding a small glowing orange flame with a white core (so it looks the same when it spins). Violet wisps curl around the wood. Seen flat from the side, perfectly horizontal and symmetrical left-right, aspect ratio about 12:1.

```



### `gabia.png` (amplada 220) *(La Gàbia de l'Ocellaire: només s'obre amb el Cant del Miracle.)*



```

Charming 2D cartoon game creature sprite in the 'Chibi Adventure Sprite' style, matching the attached reference image: chibi super-deformed proportions (enlarged rounded head or body, compact stocky build, short stout limbs), big expressive glossy eyes, cute but slightly uncanny, bold clean consistent black outline around the whole silhouette with medium-to-fine clean dark inner lines, no sketchy pencil texture, rich saturated yet earthy palette in distinct solid colour blocks, two-tone cel shading (base tone plus solid shadow plane) with subtle smooth gradient highlights, clean light from the top-front, front-facing eye-level view, centered, isolated on a pure white background (#FFFFFF), no cast shadow, no ground shadow, no text. A huge old wrought-iron birdcage big enough for children, domed top with a ring, thick curved bars wrapped in violet mist, a heavy padlock, three sleeping children inside wrapped in soft cocoons of lilac fog. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.

```



### `gabia_oberta.png` (amplada 220) *(La Gàbia oberta (després del Cant del Miracle).)*



```

Charming 2D cartoon game creature sprite in the 'Chibi Adventure Sprite' style, matching the attached reference image: chibi super-deformed proportions (enlarged rounded head or body, compact stocky build, short stout limbs), big expressive glossy eyes, cute but slightly uncanny, bold clean consistent black outline around the whole silhouette with medium-to-fine clean dark inner lines, no sketchy pencil texture, rich saturated yet earthy palette in distinct solid colour blocks, two-tone cel shading (base tone plus solid shadow plane) with subtle smooth gradient highlights, clean light from the top-front, front-facing eye-level view, centered, isolated on a pure white background (#FFFFFF), no cast shadow, no ground shadow, no text. The same huge wrought-iron birdcage with its door swung wide open and the bars bent outward, the mist gone, warm morning light, empty inside. Camera angle: classic JRPG 3/4 top-down, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.

```



---



## Consells

- Genereu cada gràfic **a part**, amb fons blanc pur; el joc ja treu el fons.

- Si una imatge surt amb fons de quadrícula o degradat, afegiu "plain pure white #FFFFFF background".

- Els edificis es dibuixen amb els peus (la base) a la part de baix de la imatge; el joc els posa per la base.

- Quan en tingueu un, dieu-m'ho i comprovo la mida, les portes i les col·lisions (issue "Ajustar portes i col·lisions").



---
