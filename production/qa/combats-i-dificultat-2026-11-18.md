# Informe de QA: combats i dificultat (2026-11-18)

Prova automatitzada sense cap canvi al codi del joc (només s'han afegit fitxers a `production/qa/`). Navegador integrat sobre `http://localhost:8000/?proves`. Banc de proves i bot: `production/qa/bot_combat.js` (es carrega des de la consola amb `fetch('/production/qa/bot_combat.js').then(r=>r.text()).then(eval)`).

## 1. Resum executiu

- **Els combats són fàcils fins al Raïm i el pic és el final.** Els enemics comuns no suposen cap risc: un jugador que s'hi llança sense esquivar rep de mitjana 0-1,3 cops (de 6 a 10 mitjos cors) per grup, i el Pastor de Boira es guanya sempre amb 3 cors (rep 2-4 cops de 6). L'Home del Raïm demana 11 cops de Runna i el bot en rep 2-4 de 10. L'Ocellaire (54 de vida, 18 cops de Runna) és l'únic que castiga: el bot amb esquiva en rep 7-8 de 12 (guanya 6-9 de 10) i amb 8/10 de vida guanya 1 de 10.
- **Cap dany es duplica.** La invulnerabilitat de 1.100 ms funciona (separació mínima entre cops rebuts: 1.100-1.200 ms en 90 combats). Tots els enemics fan 1 de mal (mig cor); un cos a cos amb un boss costa un mig cor cada 1,1 s com a màxim.
- **Cap boss es pot fer trampa quedant-se quiet:** el jugador quiet a un racó mor en tots els bosses (Pastor 12-18 s, Raïm 38-88 s, Ocellaire 48-65 s).
- **Dues anomalies reals a l'Escalinata del Raïm** (casa.js): (1) hi ha un forat de ~25 px a la porta camuflada (y 800-825) per on l'Ineu surt de la sala en ple combat i el boss es restableix (el bot ho va fer sense voler en 7 de 70 combats del Raïm); (2) si l'Ineu mor o surt amb `y > 935` (racó inferior esquerre, x≈149) i torna a entrar amb el guardià despert, `construir()` peta a `casa.js:686` i l'escena es queda a mig crear (pantalla negra fins que es recarrega el joc).
- **L'Ocellaire té un pic a la fase 2** (4-7 dels 4-8 cops rebuts) i una fase 3 anticlimàtica (8-15 s, 0-2 cops). Els ocells de foc llançats durant la pausa de genolls causen el ~75-80% del dany.
- **No hi ha cap boss entre el Pastor (pas 10) i el Raïm (pas 34)** i el combat comú no fa cap pujada: cal alguna cosa a l'Acte 2c (propostes a la secció 7). El «salt de dificultat precoç a `font`» de l'informe de ritme no es confirma: 4 escolopendres + 3 bolets amb bastó i 3 cors costen 0-0,4 cops.
- **Documentació desfasada:** el Raïm té 33 de vida i fase 2 a 14 al codi (`casa.js:116,280`), però `docs/GUIO.md:417` diu 30/11, `GUIO.md:463` diu 24 i l'informe de ritme diu 30. La ferralla viva (`ENEMICS.ferralla`) no es col·loca enlloc.

## 2. Mètode i límits

- **Per què un banc propi:** el navegador integrat va a ~1,2 fotogrames per segon (WebGL per programari), inútil per mesurar combats. `FF` adorm el bucle real i fa avançar Phaser amb `game.headlessStep(t, 16,67 ms)` amb temps sintètic (60 fps exactes, sense dibuixar): 300 fotogrames costen ~16 ms. Totes les mesures són **temps de joc**.
- **Dues peces que he hagut de reimplementar perquè el temps sintètic no les trenqués:** `Date.now()` (el `TweenManager` de Phaser 3.80 la fa servir i, sense això, els tweens quasi no avancen i, per exemple, el bàcul de l'Ocellaire es queda «volant» per sempre: era un artefacte meu, no un error del joc) i `hitStop` (fa servir `performance.now`/`setTimeout`).
- **Instrumentació sense canviar la lògica:** embolcalls de `ferIneu`, `colpejar`, `copRebutjat`, `atacar` (només compten) i `caure` (no fa la transició de 900 ms: només registra la mort).
- **Bot:** a cada fotograma tria una direcció (`ui.vectorTactil`, com el joystick del mòbil) simulant 0,6 s endavant contra «perills» deduïts de l'estat de cada enemic (cercles mòbils i el·lipses amb finestra de temps, p. ex. l'envestida del Pastor, la maça del Raïm, l'anell de l'Ocellaire, les zones de foc). S'acosta a l'objectiu a la distància que li permet l'arma i ataca amb `z.atacar()` (el mateix que la tecla J). Contra els bosses del cap només ataca durant la pausa. Opcions: `reaccio` (retard de percepció en ms: 0 = perfecte, 230 = humà ràpid, 400 = humà lent), `ingenu` (no esquiva res, només corre a l'objectiu), `ruido` (variació aleatòria).
- **Els bosses s'han posat en marxa pel mateix camí que el joc** (`iniciarBoss`, `despertarRaim(true)`, `començarBoss`), amb l'estat que dona `Proves.estatFins`: Pastor pas 10 (3 cors, branca), Raïm pas 34 (5 cors, Runna), Ocellaire pas 44 (5 cors: 6 si s'ha obert el cofre de la cabana, `cofreCabanaCami`, que `estatFins` no compta perquè no és a cap `marca`; 7 amb el cofre de la Cambra).
- **Límit principal:** un bot no és una persona. L'«esquivador» està massa informat (llegeix l'estat intern dels enemics, no el dibuix) i alhora és matusser contra els ocells; l'«ingenu» no mira res. Tracteu els dos com a cota alta i cota baixa, no com a taxa de victòria humana.

## 3. Taula de dades (estàtica)

Arma del jugador (`combat.js:915-960`): bastó 1 de dany, abast 118, cadència 380 ms; branca del Til·ler 2, abast 135, 270 ms; Runna 3, abast 135, 270 ms. L'animació d'atac dura ~0,4 s i immobilitza l'Ineu. Vida en mitjos cors: **3 grans = 6**, 4 = 8, 5 = 10, 6 = 12, 7 = 14. Tot mal és 1 (mig cor). Invulnerabilitat després d'un cop: 1.100 ms (`combat.js:1529`); retrocés 340 px/s durant 420 ms.

Grans del rosari (`progres.js`, `proves.js:76`, `dialegs.js:82-89,216,255`): 3 de base; +1 Pastor (després de vèncer-lo), +1 les sacerdotesses (obligatòries: formen part del pas `benediccioFraterna`, malgrat que GUIO A12 les marca com a opcionals), +1 cofre de la cabana (pas `clauIscu`, després del Raïm), +1 cofre de la Cambra del Santuari (opcional).

### 3.1 Enemics comuns

«Contacte» = `radi + 20` (`combat.js:1610`); només fa mal quan `perill(e)` és cert. Cops per vèncer: bastó / branca / Runna. Temps teòric = (cops − 1) × cadència, sense comptar el desplaçament.

| Enemic | Vida | Vel. (px/s) | Contacte (px) | Patró i cadència | Sòlid | Cors / arma típics | Cops (bastó/branca/Runna) | Temps teòric | Cops que pot rebre l'Ineu |
|---|---|---|---|---|---|---|---|---|---|
| Escolopendra | 2 | 95 | 40, sempre | Erràtica: canvia de rumb cada 0,25-0,7 s; 25% s'atura 0,3-0,6 s; si és a <240 px, el 50% de cops s'hi apunta | sí | 3 cors, bastó | 2/1/1 | 0,4 s | 6 |
| Gripau | 2 | 250 salt (430 ms ≈ 107 px) o 110 erràtic | 42, només saltant | Salta si és a <340 px, repòs 1.150 ms | sí | 3 cors, bastó | 2/1/1 | 0,4 s | 6 |
| Bolet | 2 | 0 | cap (no té contacte) | Espores: càrrega 750 ms (cercle verd R 110), mal si dist <115; cada 2,6 s | no | 3 cors, bastó | 2/1/1 | 0,4 s | 6 |
| Bolet verinós | 3 | 0 | cap | Marca el terra (750 ms), bola en arc (620 ms), esquitxa R 62; cada 2,4-3,8 s; dist <480 | no | 3 cors, bastó | 3/2/1 | 0,8 s | 6 |
| Ovella de boira | 3 | 290 | 44 només carregant | Apunta 800 ms, carrega 520 ms (150 px), cansada 1.000 ms; dist <380 | sí | 3-4 cors, branca | 3/2/1 | 0,5 s | 6-8 |
| Visitant | 4 | 58 | 48, sempre | Persegueix a <380 px; lent | sí | 3-4 cors, bastó/branca | 4/2/2 | 0,5 s | 6-8 |
| Ratpenat | 2 | 215 (165 fugint) | 42 només atacant | Es desperta a <300 px (240 ms), ziga-zaga 1.500 ms, fuig 850 ms | no | 5 cors, Runna | 2/1/1 | 0 | 10 |
| Gàbia viva | 3 (robust) | 0 | cap | Obre a <340 px, surt un ocell de boira (vida 1, 300 px/s, 650+950 ms) | no | 5 cors, Runna | 3/2/1 | 0 | 10 |
| Ferralla | 4 | 230 salt (330 ms) | 46 només saltant | Apunta 380 ms, repòs 0,65-1,05 s | sí | **no es col·loca enlloc** (codi mort) | 4/2/2 | – | – |
| Ocell de foc | 1 | 300 (470 el ràpid) | 38 | Orbita, es llança, 2,6 s de vida | no | 5-7 cors, Runna | 1/1/1 | – | – |

### 3.2 Bosses

| | Pastor de Boira | Home del Raïm | Ocellaire (Home de la Gàbia) |
|---|---|---|---|
| Fitxer | `combat.js:365` | `casa.js:114` | `combat.js:443`, `gabia.js` |
| Vida | 28 | 33 (fase 2 a ≤14) | 54 (fases a ≤36 i ≤18) |
| Arma que li fa mal | només branca (rebota amb altres) | només Runna | només Runna (cap i només a la pausa) |
| Cors típics | **3** (el gra el guanya en vèncer-lo) | **5** (3 + Pastor + sacerdotesses) | **5-6** (7 amb el cofre de la Cambra) |
| Mitjos cors | 6 | 10 | 10-12 |
| Dany/cop del jugador | 2 (i 440 ms d'immunitat del boss: només s'encerta un de cada dos cops, ≈ cada 540 ms) | 3 | 3 |
| Cops per vèncer | 14 | 11 (mínim 4 pauses de 3 cops) | 18 (mínim 6 pauses de 3 cops) |
| Vel. | camina 95/125; envestida 430 | camina 100/135; envestida 340 | 70, 105, 133 (fases); ocells 300/470 |
| Atacs | envestida (apunta 620/430 ms, carrega 480/560 ms, cansat 950/650); cop de caiada oval R 140 (avís 560/380 ms); crida 2-3 ovelles | envestida (avís 600/390 ms, 400/460 ms; a la fase 2, 70% d'una segona envestida); maça R 100 (avís 800 ms); cop de cap quan cau (R 62, 420 ms) | cop de bàcul en cercle (oval R 190/230, 850 ms); bàcul llançat (400 ms + 650 ms d'anada i tornada); ocells de foc 4/6/6 (orbita 1,5-1,9 s, surten 0,6 s després de la pausa, 1,2 s a la primera); terra en flames (4 zones R 70, 3 s, fase 3); esvaïment |
| Finestra de dany | sempre (immunitat de 440 ms) | 3 cops en 2.100/1.550 ms quan cau de morros | 3 cops en 4.200 ms (primera) / 3.200 / 2.800 / 2.400 ms |
| Contacte | 50 (només envestint) | 53 (només envestint) | 73 (qualsevol estat menys la pausa) |
| Temps teòric per vèncer | 7 s de cops + desplaçament ≈ **8-10 s** | 4 cicles de ~3,7-4,2 s ≈ **15-18 s** | 6 pauses de 7,2/6/5 s + 2 rugits de 2,9 s ≈ **40-50 s** |
| Marge d'errors (cops que pot rebre) | 6 | 10 | 10-12 |
| Consum de marge observat (bot, 230 ms) | 2,4 (40%) | 3,8 (38%) | 7,6-8,3 (63-70%) |

Comparació amb la progressió: la vida puja 28 → 33 → 54 (×1,2 i ×1,6) i el dany del jugador 2 → 3 → 3; el nombre de cops útils necessaris puja 14 → 11 → 18 i el marge 6 → 10 → 10-12. És a dir, el Raïm és *més fàcil de matar* que el Pastor (menys cops) i la corba del Pastor al Raïm és plana o descendent; l'Ocellaire és el primer salt real.

## 4. Resultats del bot (dinàmic)

Totes les xifres són temps de joc. «Cops» = mitjos cors perduts. Win = el boss/els enemics moren. «Mort» = vida 0 (no s'ha fet la transició de `caure`). «Fugida» = l'Ineu va sortir de l'escena en ple combat (anomalia A1).

### 4.1 Enemics comuns sols (bastó, 3 cors, n=5 per fila, esquiva amb retard 0 i 230 ms)

Tots guanyen 5/5, **0 cops rebuts**, 0 reinicis: escolopendra 1,4-1,8 s; gripau 1,8-2,4 s; bolet 2,7 s; bolet verinós 3,2 s; ovella 3,3 s; visitant 2,2 s; ratpenat 1,1-1,4 s; ferralla 3,9-4,2 s; gàbia viva 1,4-1,5 s.

### 4.2 Grups (equivalents als de les zones; n=5-8)

Primera fila: enemics a 330-380 px, l'esquivador. Segona fila: enemics a 90-100 px (en contacte), jugador ingenu (només ataca) i jugador esquivador.

| Grup (arma, cors) | Distància 330-380 (esquivador): win, cops, temps | Contacte (ingenu): cops mig/màx | Contacte (esquivador): win, cops mig/màx |
|---|---|---|---|
| Plaça: visitant + escolopendra (bastó, 3) | 5/5, 0/0, 5,0 s | 0/0 | 4/8, 1,3/5 (1 mort: el bot s'encalla a la vora) |
| Bosc del Pi: 4 escolopendres + 3 bolets (bastó, 3) | 5/5, 0/0, 16-17 s | 0,4/2 | 8/8, 0/0 |
| Bassadòria: 4 gripaus (bastó, 3) | 5/5, 0/0, 8 s | 1,3/2 | 8/8, 1,5/3 |
| Cementiri: 4 escolopendres + visitant (branca, 4) | 5/5, 0/0, 7-10 s | 0,8/1 | 6/8, 1,1/8 (1 mort: bot encallat) |
| Camí de la Cirosa: 3 ovelles + 3 escolopendres (branca, 3) | 5/5, 0/0, 9-11 s | 0,3/1 | 8/8, 0,1/1 |
| Camí Rov: 4 esc. + 3 bolets (branca, 4) | 5/5, 0/0, 9 s | – | – |
| Dipòsits: 3 esc. + 2 gripaus (branca, 4) | 5/5, 0/0, 7 s | – | – |
| Gírgoles: 4 ratpenats (Runna, 5) | 5/5, 0/0, 3,6 s | 1,1/2 | 8/8, 1/1 |
| Passadís de tortura: 4 gàbies vives (Runna, 5) | 5/5, 0/0, 4,7 s | 0/0 | 8/8, 0,4/1 |
| Bassadòria, flux continu 120 s (surt un gripau cada 3,8 s, màx. 5) | – | 0 cops en 5/5 | 0-3 cops en 120 s |

Un grup comú costa com a màxim 1-2 mitjos cors a un jugador que ataca sense pensar; cap grup posa en perill 3 cors. (La xifra màxima de l'esquivador és d'encallaments seus, no de l'enemic.)

### 4.3 Bosses (n = intents per fila)

| Prova | n | Guanya | Morts | Fugides | Temps (guanyats) | Cops rebuts mig/màx | On es va morint |
|---|---|---|---|---|---|---|---|
| **Pastor, 3 cors, retard 0** | 8 | 8 | 0 | – | 9,8 s (9,3-10,9) | 0,1/1 | – |
| Pastor, 3 cors, retard 230 | 8 | 8 | 0 | – | 9,9 s | 2,4/4 | – |
| Pastor, 3 cors, retard 400 | 8 | 8 | 0 | – | 9,8 s | 3,9/4 | – |
| Pastor, ingenu | 8 | 8 | 0 | – | 8,4 s | 2,3/4 | – |
| **Pastor, 1 cor de vida (vida=2), retard 230** | 8 | 4 | 4 | – | 9,2 s | 1,5/2 | envestida amb ovelles a prop |
| Pastor, 1 cor de vida, ingenu | 8 | 0 | 8 | – | – | 2/2 | cop de caiada (`bat`) |
| **Raïm, 5 cors, retard 0** | 10 | 10 | 0 | 0 | 18,6 s (13,9-21,8) | 2,4/6 | – |
| Raïm, 5 cors, retard 230 | 10 | 8 | 0 | 2 | 17,6 s | 3,8/5 | – |
| Raïm, 5 cors, retard 400 | 10 | 7 | 0 | 3 | 18,7 s | 2,4/4 | – |
| Raïm, 5 cors, ingenu | 10 | 9 | 1 | 0 | 15,8 s | 6,8/10 | maça |
| **Raïm, 3 cors, retard 230** | 10 | 10 | 0 | 0 | 17,7 s | 2,9/4 | – |
| Raïm, 7 cors, retard 230 | 10 | 9 | 0 | 1 | 17,2 s | 4,1/5 | – |
| **Raïm, 2 cors de vida (vida=4), retard 230** | 10 | 3 | 6 | 1 | 17,8 s | 3,3/4 | envestida (`carrega`) |
| **Ocellaire, 5 cors, retard 0** | 10 | 6 | 4 | – | 77 s (52-95) | 8,3/10 | pausa (`cansat`) amb ocells en vol |
| Ocellaire, 5 cors, retard 230 | 10 | 6 | 4 | – | 65 s (38-92) | 7,6/10 | idem |
| **Ocellaire, 6 cors, retard 0** | 10 | 8 | 2 | – | 80 s (43-134) | 7,9/12 | pausa amb ocells |
| Ocellaire, 6 cors, retard 230 | 10 | 8 | 2 | – | 88 s (60-122) | 8,3/12 | `invoca`, `llança` |
| Ocellaire, 6 cors, retard 400 | 10 | 9 | 1 | – | 75 s (38-112) | 7,1/12 | `invoca` |
| Ocellaire, 7 cors, retard 0 | 10 | 5 | 5 | – | 110 s (81-140) | 11,7/14 | pausa amb ocells |
| Ocellaire, 7 cors, retard 230 | 10 | 9 | 1 | – | 65 s (37-94) | 7,6/14 | pausa amb ocells |
| Ocellaire, 6 cors, ingenu | 6 | 6 | 0 | – | 38,6 s (35-48) | 4,5/6 | – |
| **Ocellaire, 5 cors i 8/10 de vida, retard 230** | 10 | 1 | 9 | – | 66 s | 7,8/8 | pausa amb ocells |
| Ocellaire, 5 cors i 4/10 de vida | 10 | 0 | 10 | – | – | 4/4 | pausa amb ocells |

Notes:
- «Quantes vegades cal tornar a començar» (intents fins guanyar): Pastor 1 amb 3 cors i 1-2 amb 1 cor; Raïm 1 (9/10 primers intents amb 5 cors); Ocellaire 1,2-1,7 amb 5-6 cors i 8/10 de vida: 10.
- Les victòries tenen la mateixa durada de ~9 s, 18 s i 40-90 s: el límit del temps el posa el boss (cicles i pauses), no la vida del jugador.
- Taula per fases de l'Ocellaire (8 intents, 6 cors, retard 230, tots guanyats, 65-91 s): fase 1 = 14-40 s i 0-6 cops; fase 2 = 30-58 s i 4-7 cops; fase 3 = 8-15 s i 0-2 cops. El bot gasta 9-13 pauses per fer-ne 6 de útils.
- La mortalitat de l'Ocellaire amb l'esquivador **no creix amb els cors** (5 cors 4 morts, 6 cors 2, 7 cors 1-5): és soroll de n=10. La xifra robusta és el consum: 7-8 cops de 10-14.
- Idle (sense fer res) a quatre racons de cada arena durant 90 s: Pastor mort en 12-18 s (sempre 6 cops), Raïm mort en 38-88 s, Ocellaire mort en 48-65 s. **Cap racó segur.**
- L'esquivador és pitjor que l'ingenu a l'Ocellaire (7,9 contra 4,5 cops): vol esquivar els ocells i perd finestres. La lectura de disseny és que **córrer al cap a cada pausa i tallar els ocells que arriben és l'estratègia òptima** i dona pocs cops rebuts; l'esquiva excessiva és l'error.

### 4.4 Què no ha estat bo del bot (ha de llegir-se amb cautela)

- A l'Ocellaire es perd bastants pauses (9-13 per fer-ne 6) per l'esquiva de les parelles d'ocells de la fase 2; tots els models són aproximacions.
- No esquiva obstacles de l'escenari (parets), de manera que a les arenes petites (Plaça) pot quedar-se encallat: les 1-2 «morts» dels grups en contacte són del bot, no del joc.
- No sap atacar els ocells de la fase 3 a la vegada que el cap; en general el bot no fa servir l'autoapuntat (`combat.js:930-941`) de manera deliberada.

## 5. Valoració de la corba de dificultat

| Moment | Enemic/boss | Cors | Cops rebuts típics | Valoració |
|---|---|---|---|---|
| Passos 1-9 | Visitant, escolopendres, gripaus, bolets, ovelles | 3 | 0-1,3 per grup | **Massa fàcil**, sobretot en comparació amb l'ordre del guió. |
| Pas 10 | Pastor de Boira | 3 | 2-4 de 6 | **Adequat** per a un primer boss, però lleugerament llarg de «mala lectura»: la immunitat de 440 ms fa que un de cada dos cops no compti sense avisar. |
| Passos 11-33 | Trash (Rov, Rovellonera, Gabriel, Dipòsits) | 4-5 | 0-1,3 per grup | **Massa fàcil durant ~1 h 50 min.** Amb branca/Runna els enemics (vida 2-4) cauen d'un o dos cops. |
| Pas 34 | Home del Raïm | 5 | 2,4-4 de 10 | **Adequat/fàcil**: 11 cops, ritme predictible, bon avís de cada atac. Es pot superar fins i tot amb només 3 cors (el bot en perd 2,9 de mitjana de 6). |
| Pas 44 | Ocellaire | 5-6 | 7-8 de 10-12 | **Difícil però just**: només aquí el marge és real. Amb 80% de vida (8/10) el bot guanya 1 de 10. |

Diagnòstic:
- **Massa fàcil:** tot el combat comú i el Pastor (si arribes sa). El trash no fa res a partir de l'Acte 2b; l'únic que fa por és el temps de caminar.
- **Massa difícil:** només l'Ocellaire si s'hi arriba ferit i sense saber que cal córrer al cap; no hi ha cap punt de recàrrega dins de la sala.
- **On falta marge:** l'Ocellaire amb 5 cors; el Pastor amb 1 cor (50% de morts: però es pot arribar a l'arena amb poca vida des de la Cirosa, i a l'arena no es pot sortir fins que cau, vegeu `cirosa.js:293`).
- **Salt Raïm → Ocellaire:** la vida puja ×1,6 i el boss afegeix ocells, bàcul llançat, terra en flames i canvis de fase; el Raïm no dona cap gra. És el salt més gran de la corba i és ben absent una escala intermèdia.
- **Fase 3 de l'Ocellaire:** és un anticlímax (8-15 s). La fase 2 concentra 4-7 cops.

## 6. Economia de vida

Llocs on es recupera vida (totes les curacions són **totals**):

| Font | On | Condicions |
|---|---|---|
| Prunera Màgica | Jardí de l'Hostatgeria (`dialegs.js:1118`, `jardi.js:91`) | Il·limitada (la pruna torna a créixer); cura 100% |
| Altar del Santuari | `esglesia.js:98` | S'hi agenolla; cura 100% (omple un gran cada 420 ms) i desa |
| Altar de l'Ermita de la Desaparició | `ermita.js:101` (`ZonaErmitaInt`) | Quan no toca dir la frase |
| Altar de Sant Gabriel | `oest.js:557` (`ZonaGabrielInt`) | Cura 100% |
| Altar de la capella de la Carmèlia | `hostatgeria.js:555` | Cura 100% |
| Gra del rosari | Pastor, sacerdotesses, cofre cabana, cofre Cambra (`afegirGra`, `partida.js:92`) | Cura 100% + 1 cor |
| Caure | `combat.js:1580` | Cura 100%; torna a la Plaça (o a l'entrada de la sala de l'Ocellaire: `reneix: 'tortura'`, `gabia.js:643`) |
| Proves | botó ✚ | només mode proves |

- **L'Empara Fraternal no cura** (GUIO.md:404 diu que «en entrar als llocs sagrats» recupera energia; al codi no hi ha cap cosa així: `grep benedicio_fraterna` només la fa servir per obrir la boira i la porta de ferro).
- **Cap enemic no deixa botí** (`combat.js:1305`).
- **Tram més llarg sense recàrrega (en zones):** de les Gírgoles a la Sala de la Gàbia (ratpenats + gàbies vives + esbarzers, i després el boss final): ~4 zones i ~10 minuts sense cap altar ni Prunera; l'altar més proper és molt enrere (Plaça-Hostatgeria). El cost real és baix perquè (a) els ratpenats i les gàbies costen ~1 mig cor per grup i (b) **morir a la Sala de la Gàbia retorna al passadís de tortura amb tota la vida** (el boss torna a 54 de vida i la presentació torna a començar, en versió curta). Per tant la «tensió d'arribar ferit» és sobretot un cost de temps, no de progrés.
- **Tram amb poc marge:** l'Acte 2c (Camí Rov 4+3, Rovellonera 3 clarianes de 4+, Gabriel 5, Dipòsits 5) amb 4 cors (8 mitjos): un jugador que ataqui sense esquivar perdria ~5-7 mitjos cors al llarg de tot el tram; l'altar de Sant Gabriel a mig camí ho resol. És el tram on cal recordar l'altar.
- **Pastor → Raïm:** a l'arena del Pastor (3 cors) no es pot sortir fins que cau (`tancarArena`, `cirosa.js:293`), no hi ha cap altar a prop i una derrota porta a la Plaça. El risc és baix (2-4 cops de 6).
- **Morir no té cost:** vida plena i, en bosses sense punt de control propi (Pastor, Raïm), el trajecte de tornada (el Raïm és a 2 zones de la Plaça; la Cirosa és molt més lluny). És una decisió de disseny, però fa que la dificultat «real» sigui només temps.

## 7. Anomalies

### A1. Forat a la porta camuflada de l'Escalinata: es pot fugir del Raïm i el boss es restableix (mitjana)
- On: `js/zones/casa.js:697` (`this.colSecreta = this.colisio(121, 740, 24, 120)` → cobreix y 680-800) contra la sortida `js/zones/casa.js:553` (`sortida(116, 656, 14, 168, 'ZonaCasaTresor', 'escala')` → y 572-740) i la paret `casa.js:531` (`colisio(110, 912, 40, 176)` → comença a y 824). Entre y 800 i 824 hi ha un forat que dona a la sortida.
- Reproducció: `Proves.estatFins(34,false,true,true)`; `Proves.anar('ZonaCasaGranInt','porxo')`; amb el guardià despert, teletransportar l'Ineu a (210, 820) i caminar cap a l'esquerra: surt a `ZonaCasaTresor/escala`. Provat per y = 806, 810, 816 (no passa) i 820, 824 (passa). El bot va fugir sense voler en 7 de 70 combats (fins a 3 de 10 amb retard 400).
- Efecte: es pot abandonar el combat quan es vol (potser és una escapatòria desitjada, però el guardià torna a 33 de vida en tornar, i la música/la barra queden desfetes); la sala de la Cripta queda accessible també amb el guardià viu només des del Tresor.
- Proposta: `colisio(121, 752, 24, 150)` (cobreix y 677-827) o baixar la sortida.

### A2. Entrar a l'Escalinata amb el Raïm despert i un `this.ineu` vell amb `y > 935` penja la càrrega (alta si passa; poc probable)
- On: `js/zones/casa.js:686` (`if (this.ineu && this.ineu.y > 935) this.ineu.body.reset(700, 900)` a `tancarReixa`, cridat durant `construir()` (`casa.js:565`, `puzleRaim` → `despertarRaim(true)` `782,1065`), quan l'Ineu de la visita anterior ja és destruït i no té `body`).
- Error: `TypeError: Cannot read properties of undefined (reading 'reset')`; l'escena es queda a l'estat «creant» (`sys.settings.status = 4`) i només queda la UI: pantalla negra fins a recarregar.
- Reproducció (sense canvis de codi): combat actiu a `ZonaCasaGranInt`, teletransportar l'Ineu a (149, 946) (és un racó accessible: el bot hi va arribar sol), `Proves.anar('ZonaPlaca','inici')` i, un cop a la Plaça, `Proves.anar('ZonaCasaGranInt','porxo')` amb `raimDesperta` i sense `raimDerrotat`. Passa també si l'Ineu hi va morir, ja que el fade-out porta a la Plaça i s'hi torna.
- Proposta: `if (this.ineu && this.ineu.body && this.ineu.y > 935) ...` (i, al principi de `construir`, `this.ineu = null`).

### A3. Immunitat del Pastor: un de cada dos cops s'esbrina i no compta (baixa)
- On: `combat.js:366` (`immune: 440`) i `combat.js:1194`. La cadència de la branca és 270 ms (`combat.js:923`), de manera que el segon cop sempre cau dins la immunitat i només fa `Sfx.escut()`. A l'esquivador li costa 25 cops per fer-ne 14.
- Proposta: `immune: 270` o `immune: 0` amb vida 28 → 24. O avisar-ne amb el dibuix.

### A4. L'Ocellaire té els cops de les parelles d'ocells de la fase 3 que surten alhora i no es poden tallar a la vegada que el cap (baixa)
- Mesura: 155 de 208 cops rebuts del bot a l'Ocellaire (75%) van ser durant la pausa, amb algun ocell en vol. La pausa és el moment en què l'Ineu és més a prop del boss i amb els ocells darrere. El disseny ho vol així (`gabia`: «Runna els talla»), però l'autoapuntat tria el *més proper* i pot canviar de l'objectiu al cap a un ocell (`combat.js:930-941`).
- Proposta: dins la pausa, que l'autoapuntat prefereixi el cap sempre (ja ho fa per al punt del cos, però l'ocell proper el supera); o retardar els primers ocells 200 ms més (`AJUST_OCELLAIRE.ocellsRetard` 600 → 800; `ocellsRetardPrimera` 1200).

### A5. Documentació i codi mort (baixa)
- `docs/GUIO.md:417` diu que el Raïm té «30 de vida; fase 2 a les 11»; `GUIO.md:463` diu «12 → 24»; `casa.js:116,280` i `casa.js:1057` són 33/14. L'informe de ritme (`recorregut-i-ritme-2026-11-18.md:197,222`) també diu 30. Cal actualitzar el guió.
- `GUIO.md:404-415,462` descriu «ferralles» al passadís de tortura; ara hi ha gàbies vives. `ENEMICS.ferralla` (`combat.js:769`) no es col·loca a cap zona (només és a `BESTIOLES_FOSQUES`, `zona_base.js:115`).
- `GUIO.md:404` diu que l'Empara Fraternal recupera energia; no és així.
- `GUIO.md:458-459` marca les sacerdotesses com a opcionals; a `progres.js:114` són obligatòries (la porta de ferro demana l'Empara).
- `proves.js:76`: `estatFins` compta `cofreCabanaCami` i `cofreTresor` només si el flag ja existia, de manera que a l'Ocellaire dona 5 cors i no 6.

### A6. Comprovacions que no han donat res
- **Dany doble:** cap cas (separació mínima 1.100-1.200 ms entre cops rebuts, 91 cops en 18 combats de bosses). `comprovarCop` només toca cada enemic un cop per atac (`k.tocats`).
- **Enemics encallats:** cap en els enemics comuns. L'única aturada va ser un artefacte del temps sintètic (veure secció 2).
- **Hitboxes injustes:** cap. Els contactes són `radi + 20` i totes les envestides tenen avís de 380-800 ms. Només el bolet té un marge estret de 25 px entre l'abast del bastó (140) i les espores (115).
- **Invulnerabilitat massa llarga:** 1.100 ms és generosa (un boss pot treure com a màxim 1 mig cor cada 1,1 s); no demana canvi. Un cop absorbit per el Llaç de la Nena dona també 1.100 ms.

## 8. Propostes d'ajust (valors numèrics)

Principi: el combat comú és massa fàcil i els bosses estan bé o lleugerament fàcils fins a l'Ocellaire. Si es vol mantenir el to relaxat, només cal corregir A1/A2; si es vol una corba de veritat:

1. **Tapar el forat** (A1): `casa.js:697` → `this.colisio(121, 752, 24, 150)`. **Arreglar A2**: `casa.js:686` → comprovar `this.ineu.body`.
2. **Pastor:** `immune: 440` → `270` (o 0 amb `vida: 28` → `24`). Els marge d'errors (6 mitjos cors) és adequat, però amb 1 cor de vida l'arena és letal (50% de morts): afegir una Prunera o un altar a la Cirosa no és necessari si es deixa que `tancarArena` es pugui sortir per dalt amb un cost.
3. **Entre el Pastor i el Raïm falta un obstacle:** afegir a l'Acte 2c un mini-boss opcional o fer servir la **ferralla** (ja implementada, 4 de vida, 230 de velocitat) a les clarianes de la Rovellonera i als Dipòsits: 1 per clariana (4 de vida, branca 2 de dany). O pujar `ovella` a 4 de vida i el visitant a 5 a partir del pas 22.
4. **Ocellaire fase 3:** és curta. Passar el llindar de fase 3 de `vida ≤ 18` (1/3) a `vida ≤ 24` (`combat.js:455`) perquè sigui una pausa més (3 pauses) i pujar `ocellsEspai[3]` 350 → 300 ms; a canvi baixar la fase 2: `max` d'ocells `6` → `5` (`combat.js:525`) i `ocellsRetard` 600 → 750 ms.
5. **Punt de recàrrega a l'entrada de la Sala de la Gàbia o al passadís de tortura** (un altar tipus `altarRepos`) o, si es vol sense afegir, deixar clar a la pista de l'Ocellaire que morir porta a l'entrada amb tota la vida.
6. **Dany de 2 a algun enemic comú** (`mal: 2` a ovella o ratpenat) a partir del pas 22, perquè 5 cors (10 mitjos) importin: avui no importen a cap enemic comú.
7. **Raïm:** deixar-lo així; si se'l vol més exigent, `copsPausa: 3 → 2` (6 pauses en lloc de 4) i finestra 2.100 → 1.700 ms a la fase 1.
8. **Documentar** el Raïm 33/14 i que l'Empara no cura (A5).

## 9. Què no s'ha pogut comprovar (i per què)

- **Jugadors reals:** només un bot. El que «esquiva» fa servir l'estat intern (no la imatge) i no té por; el que «ho fa tot a l'enfonsada» ho resol gairebé tot. Les xifres reals són entre els dos.
- **La Cirosa/el Raïm/la Sala de la Gàbia des del joc:** els bosses s'han engegat amb les mateixes funcions que fa servir el joc, però **sense** les cinemàtiques d'entrada (el diàleg del Pastor, el gir del volant, la presentació de l'Ocellaire) ni la música; el temps d'espera de les cinemàtiques no hi és. A l'Ocellaire l'Ineu comença al peu de la plataforma, no a la posició exacta de la cinemàtica.
- **Transició de `caure`:** (fade de 900 ms, torna a la Plaça/entrada): substituïda per un marcador, de manera que no s'han mesurat els intents posteriors d'una derrota ni el cost de recórrer fins al boss.
- **Gripaus de la Bassadòria (fluxe), Rovellonera, Gabriel, Dipòsits, camí Rov:** s'han reproduït amb els mateixos tipus i nombres però en una arena oberta (Plaça), no amb la geometria real de cada zona; les parets poden pesar a favor o en contra.
- **Autoapuntat amb enemics propers:** no s'ha forçat cap cas on triï un ocell en comptes del cap; només es dedueix de `combat.js:930-941`.
- **Llaç de la Nena** (absorbeix un cop per zona): desactivat a les proves (`cintaGastada`), de manera que el marge real és +1 mig cor per zona per als qui el tinguin.
- **Joc en temps real al navegador integrat:** impossible (1,2 fps); no s'ha comprovat si a un mòbil lent els tweens o `hitStop` canvien la sensació.
- **Taxes de victòria de l'Ocellaire:** n=10 per fila; la diferència entre 5, 6 i 7 cors és dins del soroll.
