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

- [x] `galf`

- [x] `germa_aldreu`

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



**Pendents** (el joc fa servir el dibuix provisional o el recurs alternatiu): `placa_dolmen`, `ocellaire_genolls`, `ineu/tarota_gran`, `aldreu_guardia`, `gabia`, `gabia_oberta`, `home_raim_o`.



**Nous, encara sense ús al joc** (preparats per a quan s’implementin): `aldreu_guardia`, `gabia`, `gabia_oberta`.



Els prompts de sota són només dels pendents i dels nous (els fets només es llisten dalt de tot).



---



## Elements d'escenari



### `pi_tres_cants.png` → `assets/natura/pi_tres_cants.webp` (amplada 340) *(El Pi dels Tres Cants, al mig de la clariana del Bosc del Pi dels Tres Cants (`js/zones/bosc_pi.js`). Està inspirat en el **Pi de les Tres Branques**: el tronc es parteix en **tres soques que se separen des de baix**, gairebé des del terra, i cada una puja pel seu compte amb la seva copa. Puja com a referència `art/natura/pi.jpg` (el pinastre del joc) i, si pots, la foto del Pi de les Tres Branques del Museu Etnològic (<https://www.barcelona.cat/museu-etnologic-culturesmon/sites/default/files/wp-images/Pi%20de%20les%20tres%20branques%2001%20x600.jpg>). Imatge **vertical, 2:3** (el joc la fa servir a 340 × 520). El joc hi posa una llum a la copa de cada soca quan sona el seu cant, així que cada copa ha d'estar ben definida i sense res a sobre (ni ocells, ni llums, ni text). Mentre no hi sigui, el joc fa servir un dibuix provisional fet amb codi.)*



```

Charming 2D cartoon game scenery asset in the same art style as the attached reference image (hand-painted cartoon pine tree): bold clean consistent dark outline around the whole silhouette with medium-to-fine clean inner lines, no sketchy pencil texture, rich saturated yet earthy palette in distinct colour blocks, two-tone cel shading (base tone plus solid shadow plane) with subtle smooth gradient highlights, clean light from the top-front, centered, isolated on a pure white background (#FFFFFF), no cast shadow, no ground shadow, no text, vertical composition with a 2:3 aspect ratio. A single very old, majestic red pine in the shape of the famous 'three-branched pine' (Pi de les Tres Branques): a short, wide, gnarled common base that flares into thick roots on the ground, and from the very bottom of the tree (at about 20% of the image height above the ground) the trunk splits into THREE separate thick trunks that spread apart from each other like the three prongs of a trident: the middle trunk grows straight up and is the tallest, the left trunk and the right trunk lean outward and are a little shorter. Each of the three trunks is a tall reddish-orange trunk with scaly bark, and each one carries its own separate, round, well-defined crown of blue-green needle clouds at the top (the left crown at about 20% of the image height, the middle crown at about 10%, the right crown at about 20%), with clear white space between the three crowns and nothing else around them. The whole tree fills most of the image width, the roots touch the bottom edge of the image. A calm, wise, slightly magical old tree, but no glow, no light effects, no birds, no faces, no symbols. Camera angle: classic JRPG 3/4 view, camera tilted about 30 degrees looking down, the tree facing the camera straight on, not isometric, no strong perspective distortion, the base of the tree sits flat at the bottom of the image.

```



**Ajust:** si les tres soques surten massa juntes o es fusionen més amunt, afegeix: «the three trunks separate right at the bottom, close to the ground, and stay clearly apart all the way up». Si les copes es toquen: «there must be white space between the three crowns».


### `pi_arrels.png` → `assets/natura/pi_arrels.webp` (amplada 150) *(La barrera del camí del Bosc del Pi dels Tres Cants: les arrels del pi, ben tupides, que tanquen el pas. Són les mateixes del Til·ler (`art/natura/arrels_tiller.png`, que has de pujar com a referència), però **en vertical**: una paret estreta i alta, perquè el camí és horitzontal i la barrera el creua d'una banda a l'altra. Imatge **vertical, 1:2** (el joc la fa servir a 150 × 300). El joc l'aixeca i l'esvaeix quan s'obre el pi. Mentre no hi sigui, el joc fa servir un dibuix provisional fet amb codi.)*



```

Charming 2D cartoon game scenery asset in the same art style as the attached reference image (the tangled roots of the old tree): bold clean consistent dark outline around the whole silhouette with medium-to-fine clean inner lines, no sketchy pencil texture, rich saturated yet earthy palette in distinct colour blocks, two-tone cel shading (base tone plus solid shadow plane) with subtle smooth gradient highlights, clean light from the top-front, centered, isolated on a pure white background (#FFFFFF), no cast shadow, no ground shadow, no text, vertical composition with a 1:2 aspect ratio (twice as tall as wide). A tall, narrow, dense wall of thick, twisted, interwoven reddish-brown tree roots, exactly in the style of the reference roots but standing upright like a living gate: many thick roots rise from the ground and weave over and under each other, so the whole shape is a tall, slim, slightly rounded mass that completely fills a narrow vertical rectangle with no gaps to see through, a few patches of green moss, a few small green leaves and some loose soil crumbs at the base. The base is wider than the top, the sides are irregular with a few root tips sticking out, and the bottom touches the bottom edge of the image. It must clearly read as an impassable barrier made by a huge old pine, not as a bush or a fence. Camera angle: classic JRPG 3/4 view, camera tilted about 30 degrees looking down, the object facing the camera straight on, not isometric, no strong perspective distortion, the base of the object sits flat at the bottom of the image.

```


### `placa_pi.png` → `assets/natura/placa_pi.webp` (amplada 70) *(La placa del Pi dels Tres Cants: una **fita de pedra petita i baixa** davant el pi, que explica que cal un cant per cada branca. **No ha de semblar una làpida**: sense creu, sense cap arrodonit, sense lletres ni flors. Ha d'estar vista **completament de cara** (alçat frontal, sense cap perspectiva lateral ni cara de dalt visible): una peça plana, com un rectangle de pedra, a la qual es veu només la cara de davant. Mida al joc: uns 70 × 70 (arriba aproximadament a la cintura de l'Ineu). Mentre no hi sigui, el joc fa servir un dibuix provisional fet amb codi.)*



```

Charming 2D cartoon game scenery asset in the same art style as the attached reference image (hand-painted cartoon stone object): bold clean consistent dark outline around the whole silhouette with medium-to-fine clean inner lines, no sketchy pencil texture, rich saturated yet earthy palette in distinct colour blocks, two-tone cel shading (base tone plus solid shadow plane) with subtle smooth gradient highlights, clean light from the top-front, centered, isolated on a pure white background (#FFFFFF), no cast shadow, no ground shadow, no text, no letters, no numbers. A small, low, squat stone waymarker shown in a strictly FRONTAL elevation view, exactly head-on, like a flat 2D front drawing: absolutely no side view, no three-quarter view, no perspective, no visible top surface and no visible sides, only the flat front face of the stone is seen. It is a single wide rectangular block of weathered grey stone, a little wider than it is tall (about 1.1 times as wide as high, only about waist-high to a child), with a flat straight top edge and slightly chipped corners, resting on a wide flat low base slab. It is clearly NOT a gravestone: no cross, no rounded or arched top, no epitaph, no flowers, no cemetery feeling. Carved in shallow relief on the upper part of the front face, centered: a small pine tree seen from the front whose single thick trunk starts at the bottom of the carving and, a little above its base, divides into THREE separate trunks that spread apart as they rise, like a trident or the letter Y with three prongs (the three trunks are joined together at the bottom and separate going upwards, never joined at the top), each of the three trunks ending in its own small round crown. Carved below it, in a horizontal row on the same front face: three small circles, the first with one dot inside, the second with two dots and the third with three dots (three notes). A few patches of green moss on the top edge and the base, a few small grass tufts at the foot. The object sits flat at the bottom of the image.

```






### `placa_dolmen.png` → `assets/natura/placa_dolmen.webp` (amplada 100) *(La placa de pedra **davant el Dolmen** (`js/zones/oest.js`, `ZonaDolmen`): diu què cal per alçar Runna: el permís de l'arbre sagrat, les paraules del saber i la benedicció divina. És germana de la placa del Pi dels Tres Cants: **puja-hi `art/natura/placa_pi.png` com a referència** (la mateixa fita de pedra, vista de cara, amb el mateix gruix i la mateixa base), però amb una talla diferent: l'espasa dalt i tres medallons a baix (una fulla, un llibre amb una ploma i una mà que beneeix). Imatge **apaïsada, uns 1,1:1** (el joc la fa servir a uns 100 px d'ample). Desa-la com `art/natura/placa_dolmen.png` i passa-la amb `node eines/convertir_webp.js placa_dolmen`. Mentre no hi sigui, el joc fa servir el dibuix provisional de la placa del Pi.)*



```

Charming 2D cartoon game scenery asset in the same art style as the attached reference image (hand-painted cartoon stone object): bold clean consistent dark outline around the whole silhouette with medium-to-fine clean inner lines, no sketchy pencil texture, rich saturated yet earthy palette in distinct colour blocks, two-tone cel shading (base tone plus solid shadow plane) with subtle smooth gradient highlights, clean light from the top-front, centered, isolated on a pure white background (#FFFFFF), no cast shadow, no ground shadow, no text, no letters, no numbers. A small, low, squat stone waymarker shown in a strictly FRONTAL elevation view, exactly head-on, like a flat 2D front drawing: absolutely no side view, no three-quarter view, no perspective, no visible top surface and no visible sides, only the flat front face of the stone is seen. It is a single wide rectangular block of weathered grey stone, a little wider than it is tall (about 1.1 times as wide as high, only about waist-high to a child), with a flat straight top edge and slightly chipped corners, resting on a wide flat low base slab. It is clearly NOT a gravestone: no cross, no rounded or arched top, no epitaph, no flowers, no cemetery feeling. Carved in shallow relief on the front face, centered, on two levels. On the upper part: a single small straight sword seen from the front, upright, with its point at the bottom thrust into a small simple rock, and three short straight rays of light carved around its hilt (the legendary sword waiting to be raised). Below it, in a horizontal row on the same front face: three small equal carved circles (medallions), evenly spaced, each with one simple bold symbol carved inside. The first medallion holds a single large oak leaf on a short stem (the permission of the sacred tree). The second holds a small open book seen from the front with a tiny feather quill leaning on it, the pages showing only wavy lines, never letters (the words of wisdom). The third holds an open hand raised in blessing, seen from the front, with three short rays above the fingers (the divine blessing). The three symbols are large, simple and bold enough to read clearly when the whole image is shown at only 100 pixels wide. A few patches of green moss on the top edge and the base, a few small grass tufts at the foot. The object sits flat at the bottom of the image.

```

**Ajust:** si els tres medallons es llegeixen malament, afegeix: «each medallion is a large deep-carved circle with one big simple symbol, no tiny details». Si hi surt text, repeteix amb: «the pages of the book show only abstract wavy lines, never letters». Si l'espasa surt massa petita, afegeix: «the sword takes up about a third of the height of the front face».



## Personatges

### `ineu/aixeca_buit.png` → `assets/ineu/aixeca_buit.webp` (amplada 84) *(L'Ineu **alçant el braç amb la mà buida**, per als moments en què algú li dona un objecte que no és una arma (el ram de flors, els Guants de Poder, una clau, una carta...). És la mateixa pose que `aixeca_basto` i `aixeca_espasa`, però sense res a la mà: el joc hi posa l'objecte per codi, damunt la mà, amb una llum i la fanfara. **Puja dues referències, en aquest ordre:** 1) `art/ineu/aixeca/aixeca_basto.jpg` (la pose i l'enquadrament exactes) i 2) `art/ineu/aixeca/aixeca_espasa.jpg` (el mateix personatge, amb el braç més alt). Format vertical, **mateix llenç i mateixa mida que la primera** (uns 166 × 365, relació 0,45), fons blanc pur (el trec jo), cos sencer amb els peus a la mateixa alçada que a la referència: així, en canviar de dibuix, l'Ineu no salta de lloc. Deixa lliure l'aire damunt la mà (res a sobre, ni llums, ni estrelles, ni text), perquè l'objecte hi surti. Desa'l com `art/ineu/aixeca/aixeca_buit.jpg`. Quan hi sigui, ho connecto a `ineuAixeca` i a les pàgines «Has obtingut…» (ram, guants i la resta).)*

```
Redraw the first attached image of the SAME little monk in exactly the same pose, framing and canvas size, but with NOTHING in his raised hand: remove the staff completely. Same cartoon style as the attached images (bold clean dark outline, soft cel shading, warm earthy palette, chibi proportions). Keep the same face, the same short brown hair with the round bald tonsure, the same wide happy eyes looking UP at his raised hand with a delighted, amazed smile, the same brown hooded habit with the rope belt and tassels, the wooden rosary with the little cross, the small pouch on the belt and the sandals. His right arm (on the left side of the image) is stretched UP and slightly outward exactly like in the first image, at the same height as the hand that held the staff (a little lower than the top of his head's height line, beside the face), but now the hand is EMPTY: an open hand with the palm facing up and the fingers gently curled, as if he were about to receive or lift a small object that is not there. No staff, no sword, no stick, no object, no sparkles, no glow, no text, no shadow on the ground; leave the space above and around the hand completely empty. His other arm hangs relaxed at his side, as in the first image. Full body, feet at the same place as in the first image, pure white background. The second attached image is only a reference for the same character with the arm raised higher: keep the hand height of the FIRST image.
```



### `ineu/tarota_gran.png` → `assets/ineu/tarota_gran.webp` (amplada 420) *(Primer pla gran de l'Ineu tocant la tarota, que surt per sobre de l'escenari mentre és obert el pergamí de la música. **Puja dues referències:** 1) `art/ineu/tarota.png` (el personatge i **la mateixa tarota**) i 2) `art/retrats/ineu_retrat.jpg` (l'estil de primer pla de la cara). Format vertical 4:5, fons blanc pur (el trec jo). El pergamí tapa uns 10% de baix: el cap i la tarota fins a la campana han de ser sencers i res d'important ha d'anar a la franja de baix. Fins que no hi sigui, el joc fa servir un retall ampliat d'`art/ineu/tarota.png`, que ja queda prou bé. Si surt una flauta, afegeix al final: «the instrument must be the same dark wooden conical pipe with silver keys and a wide flared bell as in the first image».)*

```
Redraw the first attached image as a CLOSE-UP, half-length portrait of the SAME monk, in exactly the same cartoon style as the first image (bold clean dark outline, soft cel shading, warm earthy palette, chibi proportions); use the second attached image only as a reference for how big and expressive the face is in a close-up. Keep the same face, the same short brown hair with the round bald tonsure, the same closed eyes with slightly lifted eyebrows, the same puffed rosy cheeks, the same brown hooded habit with the rope belt and the wooden rosary with the little cross. Camera: front view turned slightly to his left, very close: the head is HUGE and fills the upper half of the image; the shoulders, the arms and the hands come down to the bottom, cropped at the waist. He is playing THE SAME TAROTA as in the first image: a long slim conical pipe of dark chestnut-brown wood with a few silver key bands and small keys along its body, a thin reed tip between his lips, and a wide flared dark bell at the lower right; he holds it pointing down and to the right at about 45 degrees, both hands on the pipe with the fingers over the holes. It is NOT a flute, NOT a recorder. He is completely absorbed in the music, peaceful and a little emotional. A few small golden music notes float to the right of the bell. Single character, centered, isolated on a pure white background (#FFFFFF), no scenery, no ground, no frame, no text, no cast shadow. Portrait format 4:5.
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



### `aldreu_guardia.png` (amplada 96) *(El Germà Aldreu fent de guàrdia de la Gàbia (segon combat).)*



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



## Interfície (HUD)


Els dos botons rodons de dalt a la dreta de la pantalla (el sarró i els consells). **Cada gràfic és el botó sencer: el marc rodó i el dibuix a dins**, tot en una sola imatge quadrada (1:1) amb el cercle tocant les quatre vores. El joc els mostra a **72 px** de joc (uns 48 px en un mòbil estret): si el dibuix té massa detall, no es llegirà. Després de generar-los, comprova que es reconeixen reduïts a 72 px.


**Referència d'estil:** puja `art/objectes/creu.jpg` o `art/objectes/cartell.png` (objectes ja fets, amb el mateix contorn i l'ombreig a dos tons) i digues «same art style as the reference image». El marc ha de lligar amb la resta de la interfície (caixes de diàleg i menús amb vores de fusta fosca i daurat), però el botó és rodó.


**On desar-los:** `art/ui/boto_sarro.png` i `art/ui/boto_consells.png` (la carpeta `art/ui/` és nova). Després, `node eines/convertir_webp.js boto_sarro` i `node eines/convertir_webp.js boto_consells` els treuen el fons blanc i els passen a `assets/ui/*.webp`. Mentre no hi siguin, el joc fa servir el dibuix provisional d'ara (medalló més icona fets amb codi). No cal tocar res més: apareixen sols.


### `boto_sarro.png` → `assets/ui/boto_sarro.webp` (amplada 72) *(El botó del sarró (l'inventari i el Diari de l'Ineu; tecla I): un medalló rodó amb una bossa de cuir de monjo a dins.)*


```

Charming 2D cartoon game UI button in the same art style as the attached reference image (hand-painted cartoon game object): bold clean consistent dark outline around the whole silhouette with medium-to-fine clean inner lines, no sketchy pencil texture, rich saturated yet earthy palette in distinct colour blocks (chocolate and chestnut browns, cream parchment, ochre, antique gold), two-tone cel shading (base tone plus solid shadow plane) with subtle smooth gradient highlights, clean light from the top-front, centered, isolated on a pure white background (#FFFFFF), no cast shadow, no ground shadow, no text, no letters, square image with a 1:1 aspect ratio, the whole button is a perfect circle that touches the four edges of the image. The button is a round medallion seen straight from the front (flat, no perspective): a thick rim of dark chestnut wood with a thin antique-gold ring inside it, and inside the ring a disc of warm cream parchment with a slightly darker ochre edge, like an old Catalan monastery manuscript. Chunky, rounded, slightly squashed chibi shapes; simplified details that stay readable when the image is shown at only 72 pixels wide: few large shapes, no tiny ornaments, no fine texture. The drawing sits in the centre of the parchment disc and fills about 65% of it, with clear empty parchment all around it. Warm Catalan mountain village mood with a hint of eerie mist; never grim, never realistic. In the centre of the parchment disc: a small chunky leather satchel (a monk's shoulder bag) seen from the front: a rounded tan-brown leather bag with a big rounded flap that folds over the top, a round antique-gold buckle in the middle of the flap, a short stitched seam along the flap edge, and a thick leather strap that loops over the top of the bag like a handle. Two-tone leather (light tan and darker brown). No glow, no light effects, no symbols, no hands.

```


**Ajust:** si la bossa surt massa petita dins del disc, afegeix: «the satchel fills about 70% of the parchment disc». Si el marc surt massa gruixut o amb ornaments, afegeix: «the rim is a plain smooth wooden ring with no carvings and no gems».


### `boto_consells.png` → `assets/ui/boto_consells.webp` (amplada 72) *(El botó de consells (l'objectiu actual; tecla O): un medalló rodó amb un pergamí enrotllat a dins.)*


```

Charming 2D cartoon game UI button in the same art style as the attached reference image (hand-painted cartoon game object): bold clean consistent dark outline around the whole silhouette with medium-to-fine clean inner lines, no sketchy pencil texture, rich saturated yet earthy palette in distinct colour blocks (chocolate and chestnut browns, cream parchment, ochre, antique gold), two-tone cel shading (base tone plus solid shadow plane) with subtle smooth gradient highlights, clean light from the top-front, centered, isolated on a pure white background (#FFFFFF), no cast shadow, no ground shadow, no text, no letters, square image with a 1:1 aspect ratio, the whole button is a perfect circle that touches the four edges of the image. The button is a round medallion seen straight from the front (flat, no perspective): a thick rim of dark chestnut wood with a thin antique-gold ring inside it, and inside the ring a disc of warm cream parchment with a slightly darker ochre edge, like an old Catalan monastery manuscript. Chunky, rounded, slightly squashed chibi shapes; simplified details that stay readable when the image is shown at only 72 pixels wide: few large shapes, no tiny ornaments, no fine texture. The drawing sits in the centre of the parchment disc and fills about 65% of it, with clear empty parchment all around it. Warm Catalan mountain village mood with a hint of eerie mist; never grim, never realistic. In the centre of the parchment disc: a rolled-up old parchment scroll lying slightly tilted, seen from the front: a cream sheet partly unrolled with a rounded roll at the top and another at the bottom, tied with a short thin red ribbon with a small bow around the middle, and three short wavy dark-brown ink lines on the sheet as if it were handwriting (no real letters, no words). Optionally a tiny goose feather quill leaning on the right side. No glow, no light effects, no symbols, no hands.

```


**Ajust:** si el pergamí es confon amb la bossa a mida petita, afegeix: «make the scroll tall and thin, clearly different from a bag, with the red ribbon as the only bright colour». Si surt text real, repeteix amb: «the lines on the scroll are only abstract wavy strokes, never letters».


---


## Consells

- Genereu cada gràfic **a part**, amb fons blanc pur; el joc ja treu el fons.

- Si una imatge surt amb fons de quadrícula o degradat, afegiu "plain pure white #FFFFFF background".

- Els edificis es dibuixen amb els peus (la base) a la part de baix de la imatge; el joc els posa per la base.

- Quan en tingueu un, dieu-m'ho i comprovo la mida, les portes i les col·lisions (issue "Ajustar portes i col·lisions").



---
