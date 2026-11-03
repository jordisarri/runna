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

- [x] `arrels_tiller`

- [x] `basto_ocellaire`

- [x] `ocellaire_cansat`

- [x] `neus` (Meus) i `marit_neus` (senyor Molner)

- [x] `carro_sansa` (Rosansa)

- [x] `sansa` (Rosansa) i el seu retrat

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



**Pendents** (el joc fa servir el dibuix provisional o el recurs alternatiu): `ocellaire_genolls`, `ineu/tarota_gran`, `andreu_guardia`, `gabia`, `gabia_oberta`, `home_raim_o`.



**Nous, encara sense ús al joc** (preparats per a quan s’implementin): `andreu_guardia`, `gabia`, `gabia_oberta`.



Els prompts de sota són només dels pendents i dels nous (els fets només es llisten dalt de tot).



---



## Elements d'escenari

## Personatges



### `ineu/tarota_gran.png` → `assets/ineu/tarota_gran.webp` (amplada 420) *(Primer pla gran de l'Ineu tocant la tarota, que surt per sobre de l'escenari mentre és obert el pergamí de la música. Puja com a referència `art/ineu/tarota.png`. La part de baix queda tapada pel pergamí: no cal que s'hi vegin les mans senceres, però sí la tarota fins a la campana. Fins que no hi sigui, el joc fa servir un retall ampliat de `art/ineu/tarota.png`, que ja queda prou bé.)*

```
Charming 2D cartoon illustration in exactly the same style as the attached reference image of the monk (bold clean dark outline, soft cel shading, warm earthy colours, chibi features). A CLOSE-UP, half-length portrait of the SAME monk character (same face, same tonsured brown hair, same brown hooded habit and wooden rosary), seen from the front, from the top of his head down to his waist, the head big and filling the upper half of the image. He is playing a TAROTA, the traditional Catalan double-reed shawm: a long straight conical wooden pipe of dark turned boxwood, about as long as the monk's forearm and hand together, narrow at the top and gradually widening downwards, with a few thin decorative turned rings, seven finger holes in a line on the front, ending at the bottom in a wide flared trumpet-like bell; at the top a short thin brass tube (staple) carries a tiny flat double reed made of cane, and ONLY that small reed goes between his lips. It is held pointing DOWN and forward at about 45 degrees (never sideways like a transverse flute), with the left hand on the upper holes and the right hand on the lower holes, fingers covering the holes. It is NOT a recorder, NOT a tin whistle, NOT a flute, NOT a clarinet: it is clearly longer, darker and conical with a big flared bell. Eyes closed, eyebrows lifted with feeling, cheeks puffed, completely absorbed in the music, a slight tilt of the head. The bell of the tarota reaches the lower right part of the image. A few small golden music notes come out of the bell. Single character, centered, isolated on a pure white background (#FFFFFF), no scenery, no text, no frame, no cast shadow. Portrait format (about 4:5).
```

### `ocellaire_genolls.png` → `assets/enemics/ocellaire_genolls.webp` (amplada 90) *(L'Ocellaire **de genolls**, esgotat, amb el cap ben avall: és l'únic moment del combat en què se li pot colpejar el cap. Puja com a referència `art/enemics/ocellaire_cansat.png` (ha de sortir al mateix llenç: mateixa mida d'imatge, mateix enquadrament, el personatge centrat i la base on ara té els peus). Si l'aixeca massa, repeteix-ho afegint: «the top of his head must be at the middle of the image height».)*

```
Edit the attached reference image of this character. Keep EXACTLY the same character: the same big bald pale head with pointed ears, the same violet glowing eyes, the same black feather costume, the same broken iron shackles and chains on both wrists, the same golden padlock on his chest, the same rope belt with the small golden birdcage, the same chibi proportions, the same bold outline and cel colouring, the same front-facing view seen slightly from above, the same image size and framing, centered, and the same pure white background (#FFFFFF), no text. Change ONLY the pose: he has fallen to his KNEES, exhausted and defeated for a moment. Both knees on the ground at the bottom of the image (where his feet were in the reference), the feathered robe spread out on the floor around his knees like a dark puddle of feathers, his body bent forward, both pale hands flat on the ground in front of his knees supporting him, the chains lying slack on the floor. His big bald head hangs down low and forward between his shoulders, so we clearly see the TOP of his bald head: the top of his head is at about the middle of the image height, the whole figure much lower and wider than in the reference. His face looks down, the violet eyes dim and half-closed, mouth open, gasping for breath. The feathers of his collar droop, a thin wisp of weak purple mist rises from his back. A single character, whole body visible, nothing cropped.
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
