# Informe de QA: recorregut i ritme de la història (2026-11-18)

Prova automatitzada de només lectura (cap canvi al codi del joc, cap commit). Navegador integrat sobre `http://localhost:8000/?proves`; partida de proves a `localStorage` (clau `runna_proves`).

## 1. Resum executiu

- **No s'ha trobat cap pas bloquejat ni cap flag orfe.** Els 48 passos de `PROGRES.passos` i les 6 laterals són realitzables: `node eines/prova_progres.js` surt amb «Tot correcte», i al navegador cada pas, amb `Proves.estatFins(i, false, true, true)`, és el «següent» just quan toca (cap pas ja és fet abans d'hora) i la seva zona té els punts d'interacció esperats.
- **Mapa:** les 57 zones de `Joc.ZONES` es carreguen sense errors de JS ni de consola. Cap sortida porta a una zona o entrada inexistent (el laberint de la Rovellonera usa entrades virtuals `x_N/x_S/x_W/x_E`, resoltes per `ZonaRovellonera.canviarZona`; és correcte).
- **Ritme:** el camí principal dura unes **3 h 25 min** per a un jugador nou, sense viatge ràpid i sense laterals (la taula de la secció 4 explica el model). Amb les laterals, **unes 4 h**, per sota de les «~5 h» del guió.
- **El repartiment dels actes no és el del guió.** Acte 1 ≈ 11 min (5 %; el guió diu ~1 h), Acte 2 ≈ 97 min (47 %; guió 2,5 h), Acte 3 ≈ 99 min (48 %; guió 1,5 h).
- **Trams crítics:** quatre trams amb molta caminada i anada i tornada (`font`, `sopar`, `telescopi`, `benediccioFraterna`; 3-3,5 min de camí ideal cadascun) i un salt de dificultat precoç a `font` (13 enemics més 3 bolets amb 3 cors i el bastó).
- **Text:** no n'hi ha massa. El diàleg més llarg fa 1.220 caràcters (~90 s) i cap tram obliga a llegir més de ~4 min seguits.
- **Problemes trobats:** 0 de greus, 5 de mitjans (pistes incompletes i dependències amagades, secció 2) i diversos de baixos (incoherències de text i de documentació).

## 2. Problemes, per gravetat

### Greus
Cap.

### Mitjans

**M1. La pista del pas `font` no diu com arribar al Bosc del Pi (la «rialla»).**
- On: `js/progres.js:26-29`. La rialla és a `ZonaBoscPi` (`js/zones/bosc_pi.js:259-263`, `PI3.rialla` x=2060).
- Per què importa: `ZonaBoscPi` només té dues sortides, a Sant Antoni (`js/zones/nord.js:820`) i al Dolmen. Des del Dolmen no és accessible (el camí s'acaba contra el pi), així que cal anar Plaça → Monestir → Sant Antoni → sortida sud. La pista només diu «al Bosc del Pi dels Tres Cants, guardada per bolets verinosos».
- Reproducció: `Proves.estatFins(4, false, true, true)`, llegir `PROGRES.pista(Estat)` amb `fontVista`.
- Proposta: afegir «(al sud de Sant Antoni, darrere el Monestir)» al text.
- Agreujant: és el primer tram de l'Acte 2 amb molta caminada (209 s de camí ideal) i amb enemics (Bosc 6, Bosc del Pi 7 + 3 bolets).

**M2. El pas `telescopi` obliga a passar per la lateral de la Taverna sense dir-ho.**
- On: `js/progres.js:85-86`, `js/dialegs.js:1014` (`senyorBudo`), `js/zones/taverna.js:310` (Buidor és a `ZonaTavernaInt`), `taverna.js:31,82-89` (la porta està tancada fins que es truca).
- Per què importa: la pista diu «la clau la té el senyor Buidor, a la Taverna», però la Taverna és tancada. Cal trucar (`portaTaverna` posa `tavernaOberta`); la lateral `taverna` sembla opcional i de fet és obligatòria.
- No bloqueja (la porta s'obre des del principi), però la pista és incompleta.
- Proposta: «truca a la porta de la Taverna».

**M3. Trams amb molt de vaivé (anar i tornar per tot el mapa).**
- Dades: camí ideal (230 px/s, sense viatge ràpid) de la ruta més curta pel graf de sortides.
  - `sopar` (pas 13): 175 s, 5 destinacions (Meus a les Cel·les → Isílder a l'Hostatgeria → Pianista al Santuari → Cirosa → Til·ler).
  - `telescopi` (22): 193 s.
  - `benediccioFraterna` (30): 202 s, 8 parades.
  - `font` (4): 209 s.
- Mitigació existent: el Carro Verd (`PARADES`, `js/zona_base.js:120`) té aturades a l'Era, Bassadòria, Cel·les, Cirosa, Sant Antoni i Sant Gabriel. Cap pista no el recorda i no es va comprovar quan es desbloqueja.
- Proposta: que la pista de `sopar` i `benediccioFraterna` mencioni el carro i el Follet, o que `PROGRES.pista` el nomeni quan el pas següent és a més de N zones.

**M4. El laberint de la Rovellonera es repeteix 4 o més cops a l'Acte 2C.**
- On: `js/zones/oest.js:33-36,113-131`. Entrar per `cami` reinicia `rovPas=0`, i cada trajecte (anada i tornada) exigeix la seqüència de 3 clarianes; un error torna a la primera clariana.
- Recorregut a l'Acte 2C: Era → Gabriel (cristall), Gabriel → Era (Galf), Era → Dipòsits (estels), Dipòsits/Dolmen → Era. Cada trajecte són 3 clarianes amb 4 enemics cadascuna, ~16 s ideals més els combats.
- Mitigació: parada `diposits` del carro (Sant Gabriel).
- Proposta: guardar «laberint resolt» (`rovResolt`) i deixar passar directe un cop completat, o recordar el carro.

**M5. La pista del pas `clauIscu` és massa vaga.**
- On: `js/progres.js:141-143`. Diu «s'amaga pel camí de la Desaparició».
- Per què importa: el camí fa 2.800 px amb 13 punts d'interacció i 4 enemics, i l'entrada a la cabana amagada (`ZonaCabanaCami`, sortida `Cami → CabanaCami/porta`) és un buit al muret d'arbres.
- Proposta: «un buit entre els arbres, al nord del camí de la Desaparició».

### Baixos

**B1. Pianista: la conversa de les esquelles surt fora d'ordre.**
- On: `js/dialegs.js:308-315`. La branca de les esquelles (`esquelles && !esquellesVistes`) té prioritat més baixa que la del Cant de Vespres (`:285`), però només es posa `esquellesVistes` dins de la primera.
- Efecte: en l'ordre canònic, el Til·ler envia l'Ineu a la Pianista (`soparObert`), ella ensenya Vespres, i en una visita posterior diu «Ai, mare de Déu, les esquelles dels pastors!…» com si fos la primera vegada.
- Reproducció: `Proves.estatFins(20, false, true, true)` i `DIALEGS.pianista(Estat)`.
- Proposta: posar `esquellesVistes` a l'`enAcabar` de la branca de Vespres.

**B2. Branques de pista pràcticament inabastables en l'ordre canònic.**
- On: `js/progres.js:72-75` (pas `ombra`, branca `!cantPedres`) i `js/dialegs.js:289-295` (`perOmbra`).
- Detall: en l'ordre de `PROGRES`, el Cant de Vespres s'aprèn al `sopar` (pas 13), abans de l'ombra (pas 19), de manera que «el cant que demana l'ombra» ja el saps. Només es veu si el jugador fa Jusef i les Runes abans del sopar (possible, perquè el Celler està obert des del principi).
- El guió (`docs/GUIO.md:342-346`) descriu el flux «l'ombra el demana → Pianista el dona». No és un error, però cal decidir quin és el flux canònic.

**B3. `Proves.estatFins` deixa a la motxilla objectes que el joc consumeix.**
- On: `js/progres.js:23,31,104`. `obj:aigua_sj` i `obj:beuratge` es treuen a `dialegs.js:1651` i `nord.js:698`; `obj:ram` a `dialegs.js:1738`.
- Efecte: només al mode de proves (`?proves`), que mostra el Sarró amb objectes que la partida real ja hauria gastat; pot canviar branques que miren `te('ram')`.
- Proposta: eliminar-los a `estatFins` quan el pas següent al seu consum és fet (o llistar-los com a `obj:` només fins que s'usen).

**B4. `DIARI_LATERALS.pi` és codi mort.**
- On: `js/diari.js:44`. El Pi dels Tres Cants ja és un pas obligatori de `PROGRES.passos` (`id: 'pi'`), no una lateral; l'entrada no es fa servir.

**B5. Documentació desfasada a `eines/guio_ruta.md`** (font de `fer_guio_complet.py`).
- L184 diu que el Galf dona la clau de Sant Gabriel; en realitat és el senyor Buidor (`docs/GUIO.md:22,277` ja ho diu bé).
- L126 diu que cal el romaní; el joc demana la rialla del Bosc del Pi.
- L166 posa el Cant de Vespres com a 3-1-2-1; al codi (`js/musica.js:13`) és 5-4-3-1.
- L81 i L264 tracten el Pi dels Tres Cants com a lateral.
- `docs/GUIO.md:330,430` donen «Acte 1 ~1 h, Acte 2 ~2,5 h, Acte 3 ~1,5 h = ~5 h», que no coincideix amb el ritme mesurat (secció 4).

**B6. Altres detalls menors.**
- Flag escrit `garfBancSegut` (no `galf`): coherent a tot el codi (`progres.js:81`, `dialegs.js:997,1014,1487`, `era.js:60`), només un nom estrany.
- `ZonaTorre` no té `config.nom` ni `sortides` (surt amb `sortir(...)`, `torre.js:167`): fa que l'«Anar» de proves i el mapa en mostrin la clau.
- La pista de `basto` diu «vora els xiprers»; l'Aldreu és a (1020,585) i els xiprers a (1285,455) (`placa.js:46-47,78`), a ~265 px.

## 3. Cobertura de progressió (pas a pas)

Mètode: anàlisi estàtica (`prova_progres.js` + lectura de `progres.js`, `dialegs.js` i zones) i, al navegador, `Proves.estatFins(i, false, true, true)` seguit de `Proves.anar(zonaDelPas, primeraEntrada)` per als 48 passos.

| Comprovació | Resultat |
|---|---|
| `PROGRES.seguent(Estat)` coincideix amb el pas esperat en cada estat | Sí, 48/48 |
| Cap pas posterior ja és «fet» en l'estat d'un altre pas | Sí |
| Cada `marca` (flag o `obj:`) la posa algun `posaFlag`/`dona` del codi | Sí (`prova_progres.js`) |
| Flags que es llegeixen però mai es posen | Cap |
| La zona del pas (`DIARI_PASSOS`) es carrega i té interactius | Sí, 48/48 |
| Zones amb interactius actius = 0 | `ZonaDolmen` al pas `runna` (la placa només s'activa quan l'Ineu hi és davant), `ZonaPassadis` (cambra), `ZonaTortura` (`tortura`) i `ZonaGabia` (`nens`): són zones d'enemics, esbarzers o cinemàtica, no un error |
| Pistes que no concorden amb la realitat | Només les incompletes de M1, M2 i M5 |

Notes per pas:

- **Pas 5 `font`:** les tres ofrenes són a llocs que existeixen. La herba és a `ZonaBosc` (`nord.js:1415`), la rialla a `ZonaBoscPi` i la pruna al jardí. La pruna es guarda «de record» (`dialegs.js:817`), no es consumeix.
- **Passos 29-30 `pi` i `benediccioFraterna`:** el Pi és obligatori a `PROGRES` però l'anomenen «lateral» a documents (B5). La porta de ferro (`taverna.js:364`) exigeix `clau_girgoles` + `cantMiracle` + `benedicio_fraterna`, i la pista (`progres.js:145`) ho diu bé.
- **Vigilant → soterrani → Iscu → porta de ferro:** l'ordre de `PROGRES` coincideix amb el que exigeix el codi (`taverna.js:487,502,571`; `dialegs.js:644-657`).
- **Laterals:** `taverna` i `carry` s'obren al pas 2 (`clauerNovici`), `tresor` quan es sap Vespres (al `sopar`), `carruatge` a l'epíleg. Totes tenen pista.

## 4. Mapa de zones

- Les 57 zones de `Joc.ZONES` es carreguen (`Proves.anar`) sense errors de JS (`window.onerror`, `unhandledrejection`, `console.error/warn` enganxats) ni errors a la consola del navegador. L'excepció és `ZonaTorre`, que no té Ineu ni `sortides` per disseny.
- Cap zona queda sense cap sortida. Sortides que apunten a zona o entrada inexistent: cap.
- Zones no arribables per sortides «estàtiques» des de la Plaça, totes per mecanismes condicionals (no són un error):
  - `Cabana` i `CabanaInt`: portal de l'Alzina Buida (flag `portalJoaneta`).
  - `GabrielInt`: porta de l'ermita (cal `clau_gabriel`).
  - `Tresor`: pedra secreta de la façana.
  - `Golfes` i `Torre`: porta del retaule del Santuari.
  - `CasaCripta`: trapa sota l'escalinata.
- Entrades que cap sortida no fa servir: les d'inici, les de la Rovellonera (`ent_*`), els portals i les portes de les zones condicionals. Es van carregar per entrada (nou casos que semblaven «néixer dins una sortida», p. ex. `Monestir/cementiri`, `Creu/placa`, `Ruines/celles`) i en tots l'Ineu es manté a la zona, sense rebot.
- **Només s'ha provat la primera entrada de cada zona** (i els casos anteriors). Per al recorregut complet per entrada, cal `eines/prova_zones.js` (necessita `playwright`; no disponible).

## 5. Ritme (dades)

### 5.1 Model

- Velocitat de l'Ineu: 230 px/s (`VELOCITAT_INEU`, `zona_base.js:48`).
- Camí: ruta més curta pel graf de sortides, des de l'entrada fins al centre de cada parada, ×1,3 per girs i ×1,6 més per a un jugador nou. Sense viatge ràpid del Carro Verd.
- Text: caràcters de les pàgines (`text` i `avis`) de cada diàleg obligatori, avaluat amb l'`Estat` just abans del pas, a 13,5 car/s més 1,5 s per pàgina.
- «Extra» (minuts): combat, trencaclosques, cinemàtiques, aprenentatge de cants i errors típics d'un jugador nou. **És una estimació meva, no una mesura**; és la part més incerta.
- Els diàlegs de cinemàtica (`fer:`) i locals de zona que no són a `DIALEGS` no compten com a text; l'«extra» els absorbeix.

### 5.2 Resum per acte i tram

| Acte / tram | Passos | Camí ideal (min) | Text (car / pàg) | Text (min) | Extra (min) | **Total (min)** |
|---|---|---|---|---|---|---|
| **Acte 1** (clauer → bassadoria) | 4 | 0,5 | 1.679 / 17 | 2,5 | 8,0 | **11** |
| Acte 2a: Til·ler (font → sopar) | 10 | 7,9 | 7.479 / 69 | 11,0 | 17,5 | **41** |
| Acte 2b: Saber (jusef → benediccio) | 8 | 3,9 | 5.505 / 45 | 8,0 | 17,5 | **32** |
| Acte 2c: Dolmen (telescopi → runna) | 4 | 4,3 | 1.946 / 19 | 3,0 | 14,5 | **24** |
| **Total Acte 2** | 22 | 16,1 | 14.930 / 133 | 22,0 | 49,5 | **97** |
| Acte 3a: Runna → Pi (segell → pi) | 4 | 2,9 | 2.806 / 24 | 4,1 | 10,5 | **19** |
| Acte 3b: Empara i Casa Gran (benediccioFraterna → cripta) | 6 | 6,2 | 4.408 / 41 | 6,5 | 23,0 | **39** |
| Acte 3c: Accés a les Gírgoles (vigilant → portaFerro) | 4 | 1,4 | 1.305 / 13 | 2,0 | 4,5 | **9** |
| Acte 3d: Gírgoles → final (girgoles → final) | 8 | 1,5 | 511 / 7 | 0,8 | 28,5 | **32** |
| **Total Acte 3** | 22 | 12,0 | 9.030 / 85 | 13,4 | 66,5 | **99** |
| **Total camí principal** | 48 | 28,6 | 25.639 / 235 | ~38 | | **~207 (3 h 27 min)** |

(El camí ideal del total de passos és de ~29 min; el model aplica ×1,6 al sumar el temps total.)

Comparació amb el guió (`docs/GUIO.md:430`):

| Acte | Guió | Mesurat (camí principal) | Amb laterals (+~30 min en conjunt) |
|---|---|---|---|
| Acte 1 | ~60 min | ~11 min | ~25 min (Taverna, Carry/Pallofa, Cel·les) |
| Acte 2 | ~150 min | ~97 min | ~115 min (Nena, rellotge, pedra, etc.) |
| Acte 3 | ~90 min | ~99 min | ~99 min |
| **Total** | **~300 min** | **~207 min** | **~240 min** |

### 5.3 Taula per pas (camí ideal en min / caràcters / pàgines / text en min / extra / total)

| # | Pas | Camí | Car | Pàg | Text | Extra | **Total** | Observacions |
|---|---|---|---|---|---|---|---|---|
| 0 | clauer | 0,1 | 516 | 4 | 0,7 | 2,5 | **3,3** | Pròleg + primeres passes |
| 1 | basto | 0 | 280 | 4 | 0,4 | 1,5 | **1,9** | Aprèn el combat (2 enemics a la Plaça) |
| 2 | cantAurora | 0,1 | 851 | 8 | 1,3 | 2 | **3,5** | Primer cant amb la tarota |
| 3 | bassadoria | 0,3 | 32 | 1 | 0,1 | 2 | **2,5** | Fi de l'Acte 1: sense més guia |
| 4 | font | 3,5 | 747 | 6 | 1,1 | 3 | **9,6** | **Tram llarg**: 4 parades, M1 |
| 5 | joaneta | 0,6 | 884 | 8 | 1,3 | 2 | **4,2** | Portal i cinemàtica |
| 6 | boiraTiller | 0 | 93 | 2 | 0,2 | 0,5 | **0,7** | |
| 7 | tiller | 0,1 | 580 | 5 | 0,8 | 0,5 | **1,5** | |
| 8 | branca | 0 | 35 | 1 | 0,1 | 0,5 | **0,6** | |
| 9 | bardissa | 0 | 0 | 0 | 0 | 0,5 | **0,5** | Sense text |
| 10 | pastor | 0,4 | 1.292 | 15 | 2 | 4 | **6,6** | Primer mini-boss (bastó/branca) |
| 11 | esquelles | 0 | 278 | 3 | 0,4 | 1 | **1,4** | |
| 12 | soparObert | 0,4 | 1.095 | 6 | 1,5 | 0,5 | **2,6** | Diàleg llarg (1.095 car) |
| 13 | sopar | 2,9 | 2.475 | 23 | 3,6 | 5 | **13,3** | **Tram més carregat de l'Acte 2a**: M3 |
| 14 | jusef | 0,5 | 852 | 8 | 1,3 | 6 | **8,0** | Ping-pong obligatori (variable) |
| 15 | fragment1 | 0,2 | 760 | 5 | 1,1 | 1,5 | **2,9** | |
| 16 | clauSagrari | 0,5 | 218 | 3 | 0,3 | 5 | **6,2** | 12 columnes + frase: tasca de memòria |
| 17 | fragment2 | 0,8 | 1.020 | 8 | 1,5 | 1,5 | **4,2** | Torna al Santuari (48 s) |
| 18 | alcoviLlegit | 0,5 | 555 | 3 | 0,8 | 0,5 | **2,0** | |
| 19 | ombra | 0,7 | 840 | 8 | 1,2 | 1,5 | **3,8** | |
| 20 | saber | 0,4 | 774 | 5 | 1,1 | 0,5 | **2,3** | |
| 21 | benediccio | 0,3 | 486 | 5 | 0,7 | 1 | **2,3** | |
| 22 | telescopi | 3,2 | 920 | 9 | 1,4 | 6 | **12,5** | **Tram llarg**: M2, M4 |
| 23 | estels | 0,9 | 182 | 2 | 0,3 | 4 | **5,7** | Laberint de nou |
| 24 | estelLlorenc | 0 | 182 | 2 | 0,3 | 1,5 | **1,8** | |
| 25 | runna | 0,2 | 662 | 6 | 1 | 3 | **4,3** | Cinemàtica llarga (Dolmen) |
| 26 | segell | 1,3 | 563 | 7 | 0,9 | 3 | **6,0** | |
| 27 | cantMiracle | 0,5 | 276 | 2 | 0,4 | 1,5 | **2,6** | |
| 28 | guants | 0,9 | 669 | 7 | 1 | 2 | **4,5** | |
| 29 | pi | 0,2 | 1.298 | 8 | 1,8 | 4 | **6,1** | Lore de 1.220 car (`piHistoria`) |
| 30 | benediccioFraterna | 3,4 | 2.751 | 23 | 4 | 9 | **18,4** | **El tram més llarg de tot el joc** |
| 31 | roda | 0,7 | 0 | 0 | 0 | 0,5 | **1,6** | |
| 32 | cambra | 0,2 | 543 | 4 | 0,8 | 4,5 | **5,6** | Passadís amb esbarzers (Runna) |
| 33 | maneta | 1 | 275 | 4 | 0,4 | 2 | **4,0** | |
| 34 | raim | 0,8 | 809 | 9 | 1,2 | 6 | **8,5** | Boss (30 de vida) |
| 35 | cripta | 0,1 | 30 | 1 | 0,1 | 1 | **1,2** | |
| 36 | vigilant | 0,5 | 325 | 3 | 0,5 | 0,5 | **1,7** | |
| 37 | soterrani | 0 | 0 | 0 | 0 | 0,5 | **0,5** | |
| 38 | clauIscu | 0,4 | 864 | 9 | 1,3 | 3 | **5,0** | M5 |
| 39 | portaFerro | 0,5 | 116 | 1 | 0,2 | 0,5 | **1,5** | |
| 40 | girgoles | 0,1 | 148 | 1 | 0,2 | 3,5 | **3,9** | Trencaclosques de mates + ratpenats |
| 41 | rastell | 0,1 | 0 | 0 | 0 | 2 | **2,2** | |
| 42 | tortura | 0 | 0 | 0 | 0 | 1,5 | **1,5** | Gàbies vives + esbarzers |
| 43 | pont | 0,3 | 152 | 2 | 0,2 | 1,5 | **2,2** | |
| 44 | ocellaire | 0 | 111 | 2 | 0,2 | 11 | **11,2** | Boss final (54 de vida, 3 fases) |
| 45 | gabia | 0 | 40 | 1 | 0,1 | 1,5 | **1,6** | |
| 46 | nens | 0 | 0 | 0 | 0 | 2,5 | **2,5** | |
| 47 | final | 1 | 60 | 1 | 0,1 | 5 | **6,7** | Epíleg + crèdits |

### 5.4 Observacions de ritme

- **Trams llargs amb poc de nou:** `font` (4), `sopar` (13), `telescopi` (22) i `benediccioFraterna` (30) són els quatre amb més camí (3-3,5 min ideals i 8-18 min per a un jugador nou). Són recaptes de 3 coses escampades pel mapa; en tots convé recordar el Carro Verd (M3).
- **Distribució de camí:** la resta de passos tenen menys d'1 minut de camí. Entre les Runes, l'ermita, el Santuari i la Biblioteca (passos 15-20) hi ha 3,5 min ideals de vaivé (Ruines → Ermita → Santuari → Biblioteca → Ruines → Biblioteca → Plaça).
- **Massa text seguit:** no. El màxim és `piHistoria` (7 pàg, 1.220 car, ~90 s), seguit de `tillerSoparIntro` (1.095 car) i `tillerSoparRitual` (8 pàg, 1.017 car). Cap tram passa de ~4 min de lectura obligatòria (`benediccioFraterna`, 2.751 car en 23 pàg repartides en 8 diàlegs). Els passos amb més pàgines seguides són `sopar` (23 pàg) i `benediccioFraterna` (23 pàg), però en diàlegs separats.
- **Acte 1 massa curt:** 4 passos en ~11 min (3-4 min de text pur). Si es vol complir el guió (~1 h), caldria reorientar-lo cap a les laterals (Cel·les, Taverna, Carry) o actualitzar el guió.
- **Combat i dificultat:**
  - El primer combat real és a `basto` (2 enemics a la Plaça). Fins al pas 3 hi ha poc risc; **a `font` el jugador passa de 2 enemics per zona a Bosc (6), Bosc del Pi (7 + 3 bolets), Cementiri i Monestir amb 3 cors i bastó** (dany 1): salt precoç.
  - Entre el Pastor de Boira (pas 10) i l'Home del Raïm (pas 34) hi ha **~24 passos (~1 h 50 min) sense cap boss**, només bestioles; els cors pugen de 4 a 5 (3 de base + Pastor + Monges; el 6è/7è arriben amb la cofre de la cabana, pas 38, i la sala del tresor, opcional).
  - El pic de dificultat de trash és a l'Acte 2c (Camí Rov 7 + Rovellonera 4 per clariana + Gabriel 5 + Dipòsits 5, amb branca de dany 2).
  - Salt de boss: Raïm 30 de vida → Ocellaire 54 (només amb Runna, dany 3). No hi ha cap boss intermedi.
  - L'Acte 3d (girgoles → final) té ~28 min d'«extra» (trencaclosques, tortura, pont i boss) amb pràcticament cap guia de camí, perquè el camí és lineal.
- **Punts de repòs:** només es recupera energia a llocs concrets (Prunera, altar del Santuari, i amb l'Empara als llocs sagrats; `docs/GUIO.md`, apartat A7). L'últim tram (Gírgoles → Tortura → Gàbia) no té cap punt de repòs; no s'ha pogut provar com afecta un jugador amb pocs cors.

## 6. Què no s'ha pogut comprovar (i per què)

- **Joc manual de cap tram complet:** no he mogut l'Ineu ni lluitat; tot és estàtic o amb estat injectat. Els temps d'«extra» (combat, trencaclosques, cinemàtiques, errors d'un jugador nou) són estimacions i són la part més incerta del 5.
- **Ping-pong (Jusef), puzles (columnes de la Desaparició, mates de les Gírgoles, volant del Raïm, llosa i sacerdotesses), boss (Pastor, Raïm, Ocellaire):** només comprovat que els punts d'interacció i les zones existeixen. No s'han jugat; no sé si la dificultat és raonable.
- **Text de cinemàtiques i diàlegs locals de zona** (entrada del boss final, despertar de Runna, epíleg, columnes): no són a `DIALEGS` i no s'han comptat (només el que sí hi és); els hi he afegit temps com a «extra».
- **Carro Verd (`PARADES`):** no he comprovat quan es desbloqueja cada aturada en una partida real (a proves es posen totes), ni el seu cost. Per això el model sense viatge ràpid és un límit superior.
- **Totes les entrades de cada zona:** només la primera entrada (més nou casos concrets). `eines/prova_zones.js` ho fa, però necessita `playwright`, que no hi ha.
- **Camí i detalls en una partida de veritat:** la distància és un graf de sortides amb punts d'objectiu al centre de la zona; no es té en compte col·lisions ni obstacles, ni els salts de `ampliarSud` (franja sud desplaçada).
- **Conflictes amb l'ordre lliure:** `PROGRES` descriu un ordre canònic, però el joc deixa fer coses en altre ordre (p. ex. Jusef i les Runes abans del sopar). Només he comprovat l'ordre canònic i les pistes que en surten.
- **Audio i música:** fora de l'abast.
