# Lluita final: llegibilitat del combat contra l'Ocellaire

Estat: PROPOSTA per revisar (no s'ha tocat codi ni guió). Abast: `js/combat.js` (def `ocellaire`, `atacar`, `comprovarCop`, `puntsCop`, `copRebutjat`), `js/zones/gabia.js` (`genollsOcellaire`, `aixecaOcellaire`, `moureBasto`, `focsTerra`, `tambors`...), `docs/GUIO.md` Acte 3 punt 6 (cal canviar «sense cap pista ni marca» quan s'aprovi).

Pilar de disseny: el jugador ha de saber en tot moment **quan** pot ferir-lo i **per què** un cop no compta (competència, SDT; feedback < 0,5 s). Llenguatge de colors del combat: **or = ara pots picar**, **taronja/vermell = perill**, **gris = immune**.

---------------------------------------------------------------------

## 1. Diagnòstic (comprovat al codi i als dibuixos)

| # | Problema | Evidència |
|---|---|---|
| D1 | Finestra massa curta i sense pista | `pausa` = 2200 / 1900 / 1600 ms (combat.js l.410). Sense halo, text ni so propis: només un `puf` + sacsejada de 120 ms (gabia.js l.883-891). |
| D2 | Zero marge de cops | Vida 54, Runna fa **3** de dany (combat.js l.873) = **18 cops**; `copsPausa` 3 x 6 pauses (2 per fase) = **18**. Cada cop fallat obliga a un cicle extra (~6,8 s) sense explicació. |
| D3 | L'autoapuntat apunta al cos, no al cap | `atacar()` l.858 tria el punt de `puntsCop` **més proper** a l'Ineu: gairebé sempre el cercle dels peus. Si l'Ineu és als flancs (dy ~ 0) el cop va horitzontal i el cap (a ~102 px per sobre del centre del cos) queda fora del marge lateral (r+ample = 42+34 = 76) -> `copRebutjat`, sense cap explicació. **És la causa principal de "pico el cap i no passa res".** |
| D4 | El dibuix de genolls no es distingeix de l'idle | `art/enemics/ocellaire_genolls.png`: el cap només baixa de ~0,19 a ~0,32 de l'alçada (uns 21 px a pantalla) i el cos és gairebé el mateix; el prompt demanava el cim del cap a mitja alçada i no s'ha complert. Els ulls lila s'amaguen (gabia.js l.1181), però res més canvia. |
| D5 | El bàcul no marca res | A `cansat` el bàcul només frena (`gir*0.94`) i **continua surant a l'alçada del cap** (c.y-92), al costat. Sembla que encara "treballa". |
| D6 | Contacte fa mal a la pausa | `perill` és cert a `cansat`: a menys de `radi+20` = 58 px del centre del cos, `ferIneu`. Ensenya a no acostar-s'hi justament quan cal. |
| D7 | Els ocells es llancen durant la pausa | `llançar = ara+250+i*380` (f1), `+i*220` (f2), parelles cada 450 ms (f3): l'Ineu ha de picar i tallar ocells alhora, sense haver-ho après. |
| D8 | Foc a terra obre la pausa de la fase 3 | `foc` acaba -> `genollsOcellaire`, però les 4 zones tarden 950 ms a avisar i cremen 3000 ms: la finestra s'obre amb foc als voltants (1 zona on és l'Ineu, 3 a 150-260 px). |
| D9 | `ocellaire_cansat` és un asset mort | `teGenollsOcellaire` té prioritat (combat.js l.414-415); el dibuix dret i esgotat no s'usa mai. |
| D10 | 5 dels 8 estats comparteixen sprite | Només `sura` cicla idle; `invoca`, `cercle`, `llança`, `esvaeix`, `apareix` usen `ocellaire` estàtic (l.413-416): es diferencien només pel bàcul. |

---------------------------------------------------------------------

## 2. Taula estat -> sprite -> durada -> vulnerabilitat

Durades del codi actual (columna "ara") i proposta (columna "nou"). Fase = F1/F2/F3.

| Estat | Sprite ara | Durada ara | Durada nou | Bàcul | Vulnerable | Perill per a l'Ineu |
|---|---|---|---|---|---|---|
| `sura` | `ocellaire` / `idle2` / `ocellaire` / `idle3` (260 ms cadascun, cicle 1040 ms) | fins `proxAtac`: 1800 inicial; després de pausa 1800/1300/900; després de cercle 1000/700; després de llançar 700 | igual (curt a F3 és intencionat) | gir 0,04 a la mà | NO (cos i cap rebutgen) | no (contacte si t'hi acostes: radi 58) |
| `rugit` (canvi de fase) | `ocellaire_rugit` | 2900 | igual | gir 0,5 | NO | ona de xoc que empeny (sense dany) |
| `invoca` | `ocellaire` estàtic | 1900 / 1500 / 1300 (després de `apareix`: 1400; després de rugit F2: 1500) | igual | gir fins 0,55 + flames; fa mal a <95 px | NO | bàcul que gira (1 dany); ocells d'orbita |
| `cercle` | `ocellaire` estàtic | 850 (anell d'avís) | igual | gir fins 0,6 | NO | ona final radi 190 (F2) / 230 (F3): 1 dany + empenta |
| `llança` | `ocellaire` + tint 0xffb070 els primers 400 ms | 400 + 650x2 (anada i tornada) = ~1700 | igual | volant, gir 0,6 | NO | bàcul volant (1 dany, <70 px) |
| `esvaeix` | `ocellaire`, alpha 1->0 | 500 | igual | alpha 0 | NO (`amagat`) | cap |
| `apareix` | `ocellaire`, alpha 0->1 | 500 | igual | torna | NO (`perill` fals) | cap |
| `foc` (F3) | `ocellaire_rugit` | 950 (1350 si ve de rugit) | igual | gir 0,6 | NO | 4 zones: avís 950 + crema 3000 (1 dany/300 ms) |
| `cansat` | `ocellaire_genolls` (si no, `ocellaire_cansat`) | **2200 / 1900 / 1600** o 3 cops (llavors +120 ms) | **3200 / 2800 / 2400 + 300 de "puja"**; 1a de la baralla 4200; 3 cops tanquen a +450 | frena i **cau a terra** (nou) | **NOMES EL CAP** | cap (nou: `perill` fals); ona de `aixeca` sense dany |
| `puja` (nou, 300 ms) | `ocellaire_cansat` (reutilitza l'asset mort) | -- | 300 | torna a la mà | NO | -- |

Quan s'obre la pausa: només després de `invoca` completa (F1: 2 de cada 3 atacs; F2: `invoca` i `esvaeix->apareix->invoca`; F3: `foc` i `invoca`). `cercle` i `llança` **mai** cansen: això s'ha de poder aprendre; la taula de patrons és la pista de fons ("després de cantar, cau").

### Cadència real (cicle de F1 = 13,6 s per 2 pauses)
sura 1800 + invoca 1900 + pausa 2200 + sura 1800 + cercle 850 + sura 1000 + invoca 1900 + pausa 2200 = 13 650 ms. Amb les durades noves (+1000 ms per pausa) el cicle de F1 passa a ~15,7 s; F2/F3 queden a ~12-13 s per la velocitat 1,5x/1,9x i els atacs curts.

---------------------------------------------------------------------

## 3. Equilibri: vida, dany, cops

**Fórmules reals:** `dany` = 3 (Runna), 2 (Til·ler), 1 (bastó) -- però `arma: 'runna'` rebutja tot el que no sigui Runna, de manera que només compten els 3. Cops per fase = (54/3)/3 = 6 (fases a vida 36 i 18; `vida <= vida/3`, `<= 2*vida/3`). Pauses mínimes per fase = 6/3 = 2.

| Magnitud | Valor actual | Comentari |
|---|---|---|
| Cops totals per vèncer | 18 | exactament 6 pauses x 3 cops: **marge 0** |
| Cadència màxima de l'Ineu | 270 ms/cop (Runna `agil`) | 3 cops = 540 ms + 120 de tancament |
| Temps teòric mínim d'una pausa (jugador expert) | ~1,6 s (reacció 250 + desplaçament 500 + 3 cops 540 + aprox. 300) | la pausa actual de F3 (1600) és el límit teòric |
| Duració ideal del combat | ~13,6 + 2x(2,9 rugit) + ~11 (F2) + ~11 (F3) = **~45-60 s** | molt curt si tot encaixa; la longitud real depèn dels cicles perduts |
| Cost d'un cop fallat | un cicle de pausa sencer (~6-7 s) | sense feedback, és frustració pura |

**Recomanació (decisió de l'usuari, 3 opcions):**

- **A (recomanada): mantenir vida 54 / dany 3 / `copsPausa` 3** i comprar tolerància amb finestres llargues + pistes. Raó: la boss és curta si es juga bé; no cal escurçar-la més. La barra baixa 1/6 per pausa completa: afegir marques a 1/6 (barraBoss rep ara `[1/3, 2/3]`; passar `[1/6,1/3,1/2,2/3,5/6]` o fer que només s'ompli una marca per pausa) perquè el progrés es llegeixi.
- B: vida 45 (15 cops, 5 per fase, les fronteres 30 i 15 són exactes). Marge del 17 % (6 cops possibles per cada 5 necessaris). Menys durada si es vol un final més àgil.
- C: vida 54 i `copsPausa` 4 a F1 (3 a F2-F3): només si es veu que F1 frustra. No recomanat: trenca la regla senzilla "3 cops = 3 llumetes".

**Mesura de validació (playtest):** % de pauses amb 3 cops (objectiu: >= 70 % a F1, >= 55 % a F3 un cop après); pauses perdudes per cap (rebots abans del primer cop encertat) <= 1 de mitjana per jugador després de la primera pausa; durada total 1:30-4:00.

---------------------------------------------------------------------

## 4. Telegrafia d'obertura de la finestra (`genollsOcellaire`)

Cronologia (t = 0 és quan acaba `invoca`/`foc` i comença `cansat`). Cap element nou bloqueja el joc (res de quadres de diàleg).

| t (ms) | Acció | Valors |
|---|---|---|
| -120 | **Preavís**: el bàcul s'esmorteeix: `b.gir` cau a 0,1 i les flames paren (`e.flama.stop()`) | només ja existent |
| 0 | `setTexture('ocellaire_genolls')` + flaix blanc 80 ms (`setTintFill(0xffffff)` i `clearTint`) | no escalar/aixafar el sprite (guió: "no s'aixafa amb codi") |
| 0 | **Hit-stop** `this.hitStop(90)` i `cameras.main.shake(180, 0.004, true)` (ara 120/0,003) | |
| 0 | **So d'esgotament** `Sfx.esgotat()` (nou): sinus greu 150->50 Hz, 0,55 s, vol 0,28 + `puf` | veu de l'Ocellaire que s'aclofa |
| 0-260 | **El bàcul cau**: `b.lliure = true`; tween `x = c.x +/- 95`, `y = c.y + 12`, `rot` -> 1,35 rad (de pla), `ease: 'Bounce.easeOut'`, 260 ms; `b.g.setTint(0x8a8a8a)`, `b.gir = 0`; depth `c.y + 30` | `Sfx.bastoCau()` (nou): triangle 260->90 Hz 0,18 s + clank 1500->900 Hz quadrada 0,1 s vol 0,06 |
| 0 | **Tambors callen** `this.tamborsCallats = true` (a `tambors()` saltar `Sfx.tambor`) fins al tancament | el silenci és la pista sonora més barata: contrast amb BUM-BUM |
| 0 | **Halo daurat sobre el cap**: el·lipse `r = cap.r + 12` (~66 px) a `puntsCop(e)[0]`, contorn 5 px `0xffd860` alfa 0,55<->1 (Sine yoyo, 350 ms), farciment `0xfff0b0` alfa 0,18 `blendMode ADD`; depth **99955** | segueix el cap cada fotograma (afegir a `seguir` de `començarBoss`, gabia.js l.1177) |
| 0 | **Fletxa** daurada (triangle `0xffd860`, contorn negre 3 px, 22 px d'ample) a `cap.y - r - 34`, rebotant +/-10 px a 300 ms; depth 99956 | llenguatge visual sense text |
| 0 | **Tres llumetes** (cercles r=7) en arc sobre l'halo a -150/-90/-30 graus, color `0xffe08a`; cada cop encertat n'apaga una (`0x555566` + pop de 120 ms); depth 99957 | explica "3 cops" i enllaça amb la barra |
| 0 | **Anell de pica a terra**: `ovalTerra(c.x, c.y, 85, 0xffe9a0, 0.08, 3)` (depth `y-400`); no es confon amb els anells de perill (`0xffb040`, `0xff5020`) | radi recomanat per a l'Ineu: 85 (veure § 6) |
| 0 | **Cansat visual**: `e.spr.setTint(0xb8b0c8)` (fred i apagat), ombra `0.8 -> 0.6`, ulls ocults | contrast amb el to càlid dels atacs |
| 0 | **Text «Ara!»** flotant `'#ffe9a0'`, 34 px, a `cap.y - r - 56`, només les **2 primeres finestres de la baralla** (`this.nFinestres < 2`) | `flotant()` ja existent (combat.js l.830); afegir paràmetre de mida |
| 0 | **Ralentí** (només la 1a finestra): `cameras.main.zoomTo(1.07, 250)` i tornada a 1,0 als 1500 ms | opcional; si el zoom molesta amb la UI, saltar-lo |
| 0 | Ocells: **primer llançament a +600 ms** (+1200 a la 1a pausa de la baralla); espaiat F1 300 / F2 200 / F3 parelles a 350 | `e.llançar = ara + 600 + ...` (combat.js l.477) |

### Durada i tancament

| Fase | Finestra total (ms) | Dels quals "avís" | Puja | Cops màx. |
|---|---|---|---|---|
| 1a de la baralla | 4200 | 700 | 300 | 3 |
| F1 | 3200 | 700 | 300 | 3 |
| F2 | 2800 | 700 | 300 | 3 |
| F3 | 2400 | 700 | 300 | 3 |

Racional: jugador mitjà = reacció 400 + moure's 700 + 3 cops 800 = 1900 ms; x1,5 de marge = 2800. L'Ineu ja no té el contacte ni, quasi, els ocells a la primera meitat. La reducció entre fases (400 ms) manté la pujada de dificultat (dents de serra) sense deixar de ser generosa.

**Avís de tancament (ara = `fins - 700`):**
1. Halo i fletxa **parpellegen** (alfa 1 / 0,15 cada 90 ms). Llumetes que queden: parpelleig.
2. `Sfx.tic()` (nou) x3 a `-700, -450, -200` ms: quadrada 1200 Hz, 0,04 s, vol 0,08.
3. A `-250`: el bàcul **s'alça** (tween a la mà, 250 ms) amb `Sfx.carrega()` invertit/curt.
4. A 0: halo desapareix de cop (sense fade), tambors tornen **amb un cop fort** (`Sfx.tambor(true)`), `ocellaire_cansat` 300 ms (puja), tint net, ulls tornen, `aixecaOcellaire` (ja existent) al final dels 300 ms.

**Tancament per 3 cops (a `comprovarCop` l.976):** en lloc de `e.fins = now + 120`: halo es trenca en espurnes blanques (6 partícules, `0xffffff`), llumetes apagades, `e.fins = now + 450` (en comptes de 120) i els cops posteriors **rebotaran** (comprovació `copsRebuts >= copsPausa` a l.973). Així es llegeix "he fet els 3 cops, torn tancat" i no "m'han buidat el torn".

---------------------------------------------------------------------

## 5. Feedback de cop rebutjat (`copRebutjat`, combat.js l.1060)

Distingir dos casos:

| Cas | Condició | Feedback |
|---|---|---|
| **A. Fora de finestra** (cos o cap, `estat !== 'cansat'`) | `e.def.cap` i no `cansat` | `Sfx.rebot()` (nou, metàl·lic: quadrada 1500->600 Hz 0,09 s vol 0,12 + soroll bandpass 3500 Hz 0,05 s); espurnes grises `[0xb8b8c8, 0x8a8a9a, 0xffffff]` (6, `speed 120-300`, 220 ms); anell gris petit (r 18 -> 40, 140 ms, `0x8a8a9a`); **sense** sacsejada de càmera (ara 70 ms/0,0015: se sent com un cop encertat -> posar 0 o 0,0008 de 40 ms) ni hit-stop; el sprite **no parpelleja** |
| **B. Dins la finestra, però al cos** | `estat === 'cansat'` i el cop no toca cap `c.cap` | el mateix so/espurnes + text flotant **«Al cap!»** (`'#ffe9a0'`, 26 px) i la fletxa de l'halo fa un pols (escala 1,4, 120 ms) |

**Pensament de l'Ineu**, només en el cas A, sense bloquejar el joc: **no** fer servir `missatge()` ni `obrirDialeg` (bloquegen: ui.js l.622). Nou helper `pensamentIneu(text)` (gabia.js): text cursiu 22 px `'#e8e0ff'`, contorn negre 4, sobre el cap de l'Ineu (`ineu.y - 100`), 2300 ms, depth 99999, sense pausar res.
- Text: **«(Només el cap, i només quan baixa el bàcul.)»**
- Regles: es mostra al **1r** rebot de cada intent de combat i al **3r**; màxim 2 per intent; mai a menys de 8 s de l'anterior; mai durant `cansat`; després de `Estat.flag('ocellaireVencut')` no. Comptador a l'escena (`this.rebotsFora`), no cal desar-lo a la partida.
- Opcional (decisió): flag `ocellaireConsellVist` perquè, després de caure i reprendre, només es mostri 1 vegada.

---------------------------------------------------------------------

## 6. Posició de l'Ineu i garantia d'abast

**Mides** (suposant escala 0,5, `amplada: 130` sobre llenç 260x329 -> `displayHeight` ~164; verificar `customData.escala`/`RES`): el centre del cos `c` és ~69 px per sobre... és a dir, `c.y = s.y + 69`; el cap dret és a **c.y - 120** (r 40); el cap de genolls és a **c.y - 102** i **+/-16 px** cap al costat on mira (r 42).

**Per què el cop falla ara:**
- Condició d'abast: `t <= L + r + extra` (L = 135 amb Runna; extra = 75 només si `d.y < -0.4`) i `lat < r + 34`.
- Ineu al sud del cap a distància d: `t = d + 102`. Sense extra: `d <= 135+42-102 = 75`. Amb extra: `d <= 150`.
- Ineu als flancs (dy 0): l'autoapuntat vol el cercle dels peus, `d.y ~ 0` -> no hi ha extra i `lat = 102 > 76` -> **rebot**.
- Radi de contacte: 58 px des del centre del cos.

**Posició recomanada: 85 px del centre del cos (marge 70-110), a la banda sud o als flancs davanters.** Fora dels 58 de contacte (+27) i el cap queda a ~130-190 px de l'Ineu (dins l'abast amb extra). El cercle daurat a terra de 85 de radi (§ 4) ho ensenya sense paraules.

**Canvis que asseguren el cop (a `combat.js`):**
1. `atacar()` l.858: si `e.def.cap && e.estat === 'cansat'`, l'objectiu d'autoapuntat és **`puntsCop(e)[0]` (el cap)**, no el punt més proper. (Aquest és el canvi que més guanya.) Ajustar el filtre `dist > L + c.r + 30` perquè accepti el cap: usar `L + c.r + 110`.
2. `comprovarCop` l.963: `extra = c.cap && d.y < -0.2 ? (e.estat === 'cansat' ? 110 : 75) : 0`. (Llindar de -0,4 a -0,2 i 110 de reserva durant la finestra.)
3. `cap.r`: 40 -> 48 (dret) i `capTex.ocellaire_genolls.r`: 42 -> 54 durant la finestra. El marge lateral passa de 76 a 88.
4. `perill: e => !e.amagat && e.estat !== 'apareix' && e.estat !== 'cansat'`: a la pausa no fa mal tocar-lo.
5. `puntsCop` / `capDe`: quan es redibuixi `ocellaire_genolls`, **remesurar** `y`, `x` del cap sobre el dibuix definitiu (el cap anirà molt més avall: veure G1).
6. Foc a terra (`focsTerra`, gabia.js l.920): les 3 zones aleatòries a >= **180 px** del centre del cos (70 de radi de foc + 85 de l'anell + 25 de marge) i la de l'Ineu desplaçada fora dels 180 si hi cau a dins. Evita el cas D8.

---------------------------------------------------------------------

## 7. Alternatives sense gràfic nou (per estat)

Només transformacions **uniformes** (cap aixafament no uniforme, per la regla del guió).

| Estat | Tint / color | Escala / angle | Ombra | Partícules / altres |
|---|---|---|---|---|
| `sura` | cap | idle actual | `ombra` 0,8 | bàcul fosc (gir 0,04) |
| `invoca` | cap | `angle` sinusoïdal +/-0,8 a 25 Hz (tremolor del cant) | pulsa 0,8<->0,95 a 3 Hz | ulls `scale` 1,25 i `alpha` 1; columna d'espurnes `0xff9a40` al voltant del bàcul; so `Sfx.basto()` ja hi és |
| `cercle` | `0xffd9a0` els últims 300 ms | angle -4 gr durant 550 ms (cap al costat del bàcul) i +6 gr al cop; escala uniforme 1,04 al cop | ombra a 1,1 al cop | anell d'avís (ja hi és); pols blanc a l'impacte |
| `llança` | `0xffb070` (ja hi és) | -- | -- | imatge residual del bàcul (3 còpies alfa 0,3/0,2/0,1 cada 60 ms) |
| `esvaeix` | `setTintFill(0xb090ff)` progressiu | -- | ombra 0 | `boiraPuf` (ja hi és) |
| `foc` (F3) | -- (ja `rugit`) | -- | -- | brases al terra: espurnes `0xff5020` ascendents |
| `cansat` | `0xb8b0c8` | -- | 0,6 | halo, fletxa, llumetes, anell a terra, bàcul a terra |

---------------------------------------------------------------------

## 8. Gràfics nous demanats (llenç 260x329, mateix enquadrament que `ocellaire.webp`)

Prioritat: **G1 imprescindible**, G2-G3 molt recomanats, G4 recomanat, G5 opcional.

Nota: l'art real a `art/enemics/` és més estret (~9:16); els prompts demanen "same image size and framing as the reference". Com a la resta de sprites: fons blanc pur (el treu l'eina), personatge centrat, peus a la mateixa base.

| Clau | Estat | Per què |
|---|---|---|
| G1 `ocellaire_genolls` **(refer)** | `cansat` | D4: ara es confon amb l'idle |
| G2 `ocellaire_invoca` | `invoca`, `rugit` opcional | cada estat ha de llegir-se diferent |
| G3 `ocellaire_cercle` | `cercle` (últims 300 ms) | el cop en cercle ara no es veu al sprite |
| G4 `ocellaire_llança` | `llança` | un braç estès que es llegeixi com a llançament |
| G5 `halo_cap` (opcional) | `cansat` | halo de 200x120 transparent, només si no es vol dibuixar amb codi (ADD) |

Mapatge al joc (`combat.js` l.413-417, afegir al catàleg `js/assets.js`, línies 135-140): `invoca` -> G2; `cercle` -> G3 (3a de `cercle`: 550 ms `ocellaire` + 300 ms G3); `llança` -> G4 (a partir dels 400 ms); `cansat` -> G1; `puja` -> `ocellaire_cansat` (reutilitzat).

### Prompts (anglès, estil `docs/PROMPTS_GRAFICS.md`)

**G1 `ocellaire_genolls.png` (refer)**
```
Edit the attached reference image (the standing Ocellaire). Keep EXACTLY the same character: the same big bald pale head with pointed ears, the same black feather costume, broken iron shackles and chains on both wrists, the same golden padlock on his chest, the same rope belt with the small golden birdcage, the same chibi proportions, bold outline and cel colouring, the same image size and framing, centered, and the same pure white background (#FFFFFF), no text. Change ONLY the pose: he has collapsed onto BOTH KNEES and his hands, completely exhausted. His whole body is MUCH LOWER than in the reference: the feathered robe pools on the floor around his knees like a dark puddle of feathers, his back is hunched, both pale hands flat on the ground in front of him. His huge bald head hangs low between his shoulders, nearly touching the ground, so we mainly see the big round TOP of his bald head and part of his face looking down: the highest point of the whole figure is the top of his head, at about 45 percent of the image height measured from the top (the upper half of the image is EMPTY white background). Eyes shut or dim and half-closed (NO bright glow), mouth open gasping, a thin wisp of weak grey-purple mist rising from his back. No staff in his hands. A single character, whole figure visible, nothing cropped, same ground line as the reference.
```
**G2 `ocellaire_invoca.png`**
```
Edit the attached reference image (the standing Ocellaire). Keep EXACTLY the same character, costume, chibi proportions, outline, colouring, image size, framing and pure white background (#FFFFFF), no text. Change ONLY the pose: he is chanting a spell. His RIGHT hand (on the right side of the image) is raised high and open at about 35 percent of the image height from the top, at the very right edge of the figure, fingers curled as if gripping a staff that is NOT drawn (leave the hand empty and open so a separate staff image can be placed there). His left arm is pulled back with the chain taut. Head tilted slightly up, mouth wide open chanting, eyes wide with bright violet glow, the feathers of his collar and shoulders flared outwards as if blown by wind. Weight on the front foot. Whole figure visible, centered, same ground line.
```
**G3 `ocellaire_cercle.png`**
```
Edit the attached reference image (the standing Ocellaire). Keep EXACTLY the same character, costume, proportions, outline, colouring, image size, framing and pure white background (#FFFFFF), no text. Change ONLY the pose: a violent slam. He is crouched forward with knees bent, shoulders hunched, BOTH arms thrust down and out to the sides with the fists near the ground and the chains swinging, the wings and feathers flared wide like a burst, the head thrust forward with bared teeth and wide glowing violet eyes. No staff drawn. Whole figure visible, centered, same ground line.
```
**G4 `ocellaire_llança.png`**
```
Edit the attached reference image (the standing Ocellaire). Keep EXACTLY the same character, costume, proportions, outline, colouring, image size, framing and pure white background (#FFFFFF), no text. Change ONLY the pose: he has just THROWN something. His RIGHT arm (right side of the image) is fully extended forward and slightly upward with the hand open, palm out; his body twisted, left shoulder back, left arm bent with the chain trailing. Fierce focused face, glowing violet eyes, the feathers swept back by the motion. Nothing in his hand. Whole figure visible, centered, same ground line.
```

---------------------------------------------------------------------

## 9. Funcions a tocar (resum per a l'implementador)

| Fitxer | Funció / lloc | Canvi |
|---|---|---|
| combat.js l.399-406 | def `ocellaire` | `cap.r` 48; `capTex.genolls.r` 54 (i `y/x` remesurats); `perill` exclou `cansat`; (opció B: `vida: 45`); constants de sintonia en un objecte `AJUST_OCELLAIRE` a l'inici |
| combat.js l.410 | `pausa` | 3200/2800/2400 + `e.nFinestres` (4200 a la 1a) |
| combat.js l.413-417 | `clauIdle` | afegir `e.puja > ara` -> `ocellaire_cansat`; claus de G2-G4 per estat |
| combat.js l.462-480 | `invoca` | ocells a `+600` (`+1200` 1a finestra) |
| combat.js l.524-531 | branca `cansat` | seqüència d'avís a `fins-700`, `puja` 300 ms, bàcul a terra / de tornada |
| combat.js l.856-864 | `atacar` | autoapuntat al cap durant `cansat` |
| combat.js l.963, 973, 976 | `comprovarCop` | extra 110, tancament per cops (450 ms) i rebot posterior |
| combat.js l.1060 | `copRebutjat` | casos A/B, sense sacsejada, `Sfx.rebot`, espurnes grises, pensament |
| gabia.js l.813 | `moureBasto` | respectar `b.lliure` (no reposicionar quan és a terra) |
| gabia.js l.840 | `tambors` | silenci amb `this.tamborsCallats` |
| gabia.js l.883 | `genollsOcellaire` | obertura (§ 4); neteja a `netejarRonda` i `ocellaireDerrotat` (halo, fletxa, llumetes, anell) |
| gabia.js l.893 | `aixecaOcellaire` | sense canvis (ja és l'avís del torn tancat); cridar-la a la fi de la `puja` |
| gabia.js l.920 | `focsTerra` | distància mínima 180 px al cos |
| gabia.js l.1177 | `seguir` (postupdate) | moure halo/fletxa/llumetes amb el cap |
| gabia.js (nou) | `pensamentIneu`, `obrirFinestraOcellaire`, `avisTancarOcellaire`, `tancarFinestraOcellaire` | helpers sense bloqueig |
| sfx.js | `esgotat`, `bastoCau`, `rebot`, `tic` | 4 sons nous (veure § 4-5) |
| docs/GUIO.md Acte 3 punt 6 | text | substituir «sense cap pista ni marca» per la descripció de § 4 (halo daurat, bàcul a terra, tambors callats, «Ara!» a les 2 primeres) |

**Depths:** halo 99955, fletxa 99956, llumetes 99957, text flotant 99999, anell de pica `y-400` (com `ovalTerra`), bàcul a terra `c.y+30`.
**Colors:** or finestra `0xffd860` / `0xffe08a` / `0xfff0b0` / text `#ffe9a0`; cansat `0xb8b0c8`; bàcul apagat `0x8a8a8a`; rebot `0xb8b8c8` `0x8a8a9a`; perill `0xffb040` `0xff5020` (sense canvis).

## 10. Casos límit

- **Mort de l'Ineu durant la finestra:** `netejarRonda` + destruir halo/fletxa/llumetes/anell; reiniciar `nFinestres` només si es torna a començar el combat des de zero (sí: es reinicia l'escena).
- **Canvi de fase just després del tercer cop:** `rugit` (2900 ms) comença a l'estat següent; assegurar que l'avís/halo ja s'ha desmuntat abans (ordre: tancar finestra -> `puja` -> rugit). Cal que el rugit esperi els 300+ ms de `puja`.
- **Cop a un ocell dins la finestra:** el cop pot encertar alhora un ocell i el cap; cada enemic compta un cop per atac, sense dany doble.
- **`ocellaire_genolls` ausent (`Grafics.faltants`):** fa servir `ocellaire_cansat`; l'halo i la resta de pistes igualment funcionen (per això s'implementen per codi, no per dibuix).
- **Tint `setTint` només enfosqueix:** per il·luminar usar `blendMode ADD` o `setTintFill`.
- **`hitStop` + tween de bàcul:** els tweens segueixen el temps de l'escena; verificar que `hitStop(90)` no deixa el bàcul a mig camí (és curt).
- **Degenerat:** quedar-se enganxat al cercle de 85 px durant tot el combat? No: fora de la finestra el cos rebutja i `cercle`/ocells castiguen; el cercle d'or només existeix durant la finestra.

## 11. Acceptació

Funcional: (1) en obrir-se la pausa apareixen halo + bàcul a terra + tambors callats en <= 100 ms; (2) a l'avís (700 ms) l'halo parpelleja i sonen 3 tics; (3) un cop al cap des de qualsevol punt del radi 70-110 al sud o flancs **sempre** compta; (4) els cops fora de finestra no sacsegen la pantalla; (5) 3 cops -> halo es trenca i la finestra tanca.
Experiencial (playtest, 5 persones que no han vist el combat): >= 4 identifiquen sense ajuda "quan es pot picar" abans de la 3a pausa; cap diu "no sé per què no li faig mal"; temps total 1:30-4:00.

## 12. Preguntes obertes per a l'usuari

1. Vida: A (54, recomanat), B (45) o C?
2. Es vol el zoom de la 1a finestra (ralentí)?
3. El pensament de l'Ineu: 2 per intent o només 1 per partida?
4. Es demanen G1-G4 tots alhora o es comença per G1 i es tanca la resta amb alternatives de codi?
5. Es dona permís per canviar el guió (punt 6) i registrar-ho abans a `docs/GUIO.md`?
