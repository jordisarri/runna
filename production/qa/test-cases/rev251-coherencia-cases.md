# Casos de prova MANUALS: revisió de coherència 251 (commit 0cec96f)

Joc: Runna, l'espasa del Miracle (Phaser 3). Tipus d'història: Lògica/Integració de diàlegs i flags. Evidència: prova manual documentada (aquest fitxer ple). Nivell de porta: BLOQUEJANT per als casos d'Alta, ADVISORY per a la resta (qa.level: minimal).

## Preparació (com forçar l'estat)

Confirmat al codi (`js/proves.js`):
- Obre `http://localhost:8000/?proves` (després de `python serveix.py`). Apareix el botó 🧪 a l'esquerra. La partida de proves es desa a part (clau `runna_proves`); la partida real no es toca.
- El panell llista tots els passos de `PROGRES.passos`. Triar un pas deixa fets els flags/objectes de **tots els passos anteriors** (no el triat) i porta a la zona del pas (taula `DIARI_PASSOS`, `js/diari.js`).
- Tres caselles, marcades per defecte: «missions laterals», «tot el mapa», «totes les melodies apreses». **Cal desmarcar «melodies» per provar amb `cantPedres` inactiu** (marcar-la posa els flags de totes les melodies, incloent `cantPedres`, i la tarota). Cal desmarcar «laterals» per no tenir `carryParlat`, `pallofaTornat`, etc.
- La llista inferior «O ves a una zona amb l'estat actual» permet canviar de zona sense tocar l'estat.
- Passos útils (id a `progres.js`; títol a `diari.js` quan n'hi ha): `sopar` («El sopar del Til·ler», ZonaTiller): soparObert fet, pastorsConvencuts no. `ombra` («L'ombra del monjo», ZonaRuines): fragment1, fragment2, alcuiLlegit fets; ombraDemanaCant, cantPedres, benedicioMonjo no. `segell`: runna i relTretes fets, tombaLlegida i tombaSegellada no. `soterrani` (el següent): tombaLlegida i tombaSegellada ja fets.
- El text exacte de cada botó del panell és «N. títol · zona» (N és la posició; pot variar). Cerca per títol/zona, no pel número.
- Flags a mà (consola del navegador): **NO CONFIRMAT**. El codi té `Estat.flag/posaFlag/dona/desar`, però no he verificat que `Estat` sigui accessible des de la consola (és una `const` global; hauria de funcionar a Chrome/Edge). Si no funciona, usa només el panell. No hi ha cap altra eina per posar un sol flag; el panell només permet «tot el que és abans del pas X».
- Per combinar estats que el panell no dona (p. ex. `soparObert` + `cantPedres` sense altres passos): marca «melodies» i tria `sopar`; això dona `cantPedres` amb `soparObert`.

Convencions: Resultat real i Pass/Fail en blanc. Els noms de zona de la llista desplegable són els de `Joc.ZONES` (p. ex. ZonaTiller, ZonaRuines, ZonaBiblioteca, ZonaCirosa, ZonaSantuari). El nom exacte de la zona del Santuari/Pianista i de la Cirosa: **NO CONFIRMAT** (cal mirar la llista).

---

## SESSIÓ S0: smoke

### QA-REV251-01 · Càrrega del joc sense errors de consola
**Prioritat**: Alta
**Precondicions**: servidor engegat; navegador amb consola oberta (F12).
**Passos**:
1. Executa `python serveix.py` i obre `http://localhost:8000/?proves`.
2. Espera a la pantalla de títol; comença una partida nova.
3. Obre i tanca el panell 🧪 (també amb Esc).
4. Mira la consola.
**Resultat esperat**: el joc carrega, el panell s'obre/tanca, cap `SyntaxError`/`ReferenceError`/`TypeError` a la consola (dialegs.js, progres.js, nord.js i cirosa.js carreguen).
**Resultat real**:
**Pass/Fail**:

### QA-REV251-02 · Prova automàtica de progressió
**Prioritat**: Alta
**Precondicions**: Node instal·lat.
**Passos**:
1. Des de l'arrel del projecte: `node eines/prova_progres.js`.
2. Llegeix la sortida i el codi de sortida (`echo $?`).
**Resultat esperat**: codi de sortida 0; cap error de pas fora d'ordre ni flag esperat que el codi no posi; cap flag llegit però mai posat que sigui nou respecte del que ja hi havia (`ombraDemanaCant`, `tombaLlegida`, `soparObert` han de constar com a posats).
**Resultat real**:
**Pass/Fail**:

---

## SESSIÓ S1: camí principal (canvis 1, 2, 4, 8)

### QA-REV251-03 · Pianista ensenya Vespres amb soparObert (canvi 1)
**Prioritat**: Alta
**Precondicions**: panell: desmarca «laterals» i «melodies»; tria el pas `sopar`. Estat: soparObert actiu; cantPedres, ombraDemanaCant i alcuiLlegit **inactius**; cantAurora actiu (previ). Si una altra branca anterior de la Pianista (parlatPianista/Aurora, línies ~230-240) es dispara primer, anota-ho.
**Passos**:
1. Ves a la zona de la Pianista (Santuari) amb la llista de zones.
2. Parla amb la Pianista.
3. Llegeix la pàgina de diàleg.
4. Supera la lliçó (repeteix 3-1-2-1 amb 1, 2, 3 o ← ESPAI →).
**Resultat esperat**: text «Els pastors de la Cirosa fa anys que no senten música vora el foc? ... el Cant de Vespres. Me'l va ensenyar la meva mare. Vine, escolta.»; a continuació comença la lliçó «pedres»; en acabar, `cantPedres` queda actiu (apareix «Cant de Vespres» al sarró/menú de melodies).
**Resultat real**:
**Pass/Fail**:

### QA-REV251-04 · Ombra del monjo amb cantPedres INACTIU: cadena completa (canvi 2, RISC ALT)
**Prioritat**: Alta
**Precondicions**: panell: desmarca «laterals» i «melodies»; tria el pas `ombra` (ZonaRuines). Estat: fragment1, fragment2, alcuiLlegit actius; ombraDemanaCant, cantPedres, benedicioMonjo inactius. Tarota (`flauta`) al sarró.
**Passos**:
1. A les Runes, acosta't a l'ombra (mur, ~1205,465). Pot parlar sola en acostar-t'hi (< 260 px); si no, interactua-hi.
2. Llegeix els diàlegs. Comprova l'objectiu del HUD/diari.
3. Prova de tocar Vespres (3-1-2-1) **sense** haver-lo après: apunta què passa.
4. Ves a la Pianista (Santuari) i parla-hi; aprèn el Cant de Vespres.
5. Torna a les Runes, col·loca't a ≤300 px de l'ombra i toca Vespres amb la tarota.
**Resultat esperat**: pas 2: pàgines «Fa segles que no sento parlar...» i «Qui toca l'orgue el coneix. Aprèn-lo, petit monjo, i torna a cantar-me'l aquí.»; objectiu «La Pianista, al Santuari, coneix un cant que les pedres entenen; l'ombra del monjo el voldria sentir.»; es posa ombraDemanaCant. Pas 4: la Pianista usa el text «El monjo de les Runes vol sentir el Cant de Vespres?...». Pas 5: s'obre el diàleg `benedicioMonjo`, l'ombra descansa, benedicioMonjo actiu i flauta_ombra posat. Cap bloqueig: la història avança fins al pas `saber`.
**Resultat real**:
**Pass/Fail**:

### QA-REV251-05 · Ombra del monjo amb cantPedres ACTIU: cap bloqueig (canvi 2, RISC ALT)
**Prioritat**: Alta
**Precondicions**: panell: desmarca «laterals»; **marca «melodies»**; tria el pas `ombra`. Estat: com a QA-REV251-04 però cantPedres actiu (i ombraDemanaCant inactiu).
**Passos**:
1. A les Runes, acosta't a l'ombra i deixa que parli (o interactua-hi).
2. Llegeix els diàlegs i l'objectiu.
3. Sense anar a la Pianista, toca el Cant de Vespres (3-1-2-1) a ≤300 px de l'ombra.
4. Desa i recarrega la pàgina (Continuar); torna a les Runes i comprova l'estat.
**Resultat esperat**: pas 2: pàgines «Fa segles...» i «Qui toca l'orgue el coneix, i tu ja el portes a la tarota. Canta-me'l aquí, petit monjo.»; objectiu «L'ombra del monjo vol sentir, a les Runes, el Cant de Vespres que ja saps.»; ombraDemanaCant actiu. Pas 3: arriba `benedicioMonjo`. Pas 4: l'ombra no hi és (descansa) i l'estat es manté. Sense encallament.
**Resultat real**:
**Pass/Fail**:

### QA-REV251-06 · Pastors de la Cirosa convençuts amb Vespres (canvi 4)
**Prioritat**: Alta
**Precondicions**: panell: desmarca «laterals»; **marca «melodies»**; tria el pas `sopar` (soparObert actiu, pastorsConvencuts inactiu, cantPedres actiu). Anar a ZonaCirosa (llista de zones).
**Passos**:
1. Camina fins prop del foc (280,720) dels pastors.
2. Interactua amb el foc (cercle ~120 px) i llegeix el text.
3. A ≤380 px del foc, obre la tarota i toca Vespres (3-1-2-1).
4. Llegeix el diàleg; mira l'inventari.
5. Parla amb el Til·ler (ZonaTiller) i comprova que li compta el pa dels pastors (pas `sopar`).
**Resultat esperat**: pas 2: «(El foc crepita i els pastors callen. Un cant antic vora les brases, el de Vespres, els podria obrir el cor...)». Pas 3-4: s'obre el diàleg `pastorsConvencuts`, es posa pastorsConvencuts i s'obté `pa_pastor`. Pas 5: la pista del sopar ja no demana el pa dels pastors.
**Resultat real**:
**Pass/Fail**:

### QA-REV251-07 · Pare Alcoví explica la cripta: Ineu i després Alcoví (canvi 8)
**Prioritat**: Alta
**Precondicions**: panell: desmarca «laterals»; tria el pas `segell`. Estat: runna, relTretes actius; tombaLlegida i tombaSegellada inactius. Anar a ZonaBiblioteca.
**Passos**:
1. Parla amb el Pare Alcoví.
2. Llegeix tot el diàleg (observa l'ordre dels parlants i el moviment del Pare a 812,372).
3. Comprova l'objectiu en acabar.
4. Torna a parlar amb el Pare.
**Resultat esperat**: ordre: Ineu («Pare Alcoví, he baixat a la cripta...»), Pare Alcoví («Una clau de ferro, i una tomba que no calla...»), moviment, Crònica, Pare Alcoví («La tomba és al Cementiri...»). Objectiu «La tomba esquerdada del Cementiri espera la llum de Runna.»; tombaLlegida actiu. Pas 4: no repeteix la cripta i surt el diàleg de la branca `alcuiLlegit`.
**Resultat real**:
**Pass/Fail**:

---

## SESSIÓ S2: variants negatives i límits

### QA-REV251-08 · Pianista no repeteix Vespres si cantPedres ja actiu (canvi 1)
**Prioritat**: Alta
**Precondicions**: panell: marca «melodies», desmarca «laterals»; tria el pas `sopar`. soparObert i cantPedres actius.
**Passos**:
1. Parla amb la Pianista al Santuari.
2. Anota el text i si comença cap lliçó.
**Resultat esperat**: no surt cap text de Vespres ni lliçó «pedres»; s'executa la branca següent (Miracle si runna; si no, la que correspongui). No es mostra «Els pastors de la Cirosa...».
**Resultat real**:
**Pass/Fail**:

### QA-REV251-09 · Pianista: precedència del text (ombraDemanaCant > alcuiLlegit > soparObert)
**Prioritat**: Mitjana
**Precondicions**: cantPedres inactiu. Tres estats: (a) pas `ombra` després d'haver parlat amb l'ombra (ombraDemanaCant); (b) pas `ombra` sense parlar-hi (alcuiLlegit, sense soparObert? **NO CONFIRMAT**: al pas `ombra` soparObert també és actiu per passos previs, per tant esperem el text d'alcuiLlegit); (c) pas `sopar` (només soparObert).
**Passos**:
1. Per a cada estat, parla amb la Pianista i anota la primera pàgina.
**Resultat esperat**: (a) «El monjo de les Runes vol sentir...»; (b) «Vas a veure l'ombra de les Runes? Diuen que només escolta...»; (c) «Els pastors de la Cirosa...». En tots, comença la lliçó «pedres».
**Resultat real**:
**Pass/Fail**:

### QA-REV251-10 · Cirosa: Vespres no actua fora de condició (canvi 4)
**Prioritat**: Mitjana
**Precondicions**: ZonaCirosa, foc a ≤380 px. Estats: (a) soparObert **inactiu** (panell: tria el pas `esquelles`, «melodies» marcada); (b) soparObert actiu i melodia diferent de Vespres (pas `sopar`, «melodies» marcada); (c) pastorsConvencuts actiu (tria el pas `fragment1` o posterior, «melodies» marcada).
**Passos**:
1. En cada estat, toca la melodia indicada vora el foc.
**Resultat esperat**: (a) Ineu: «Els pastors m'escolten en silenci... Encara no és el moment: primer cal parlar amb el Til·ler.»; (b) amb Aurora/Miracle: «Els pastors m'escolten, però això no els recorda casa. Un cant antic, de les esquelles: el de Vespres.»; (c) «Els pastors somriuen: aquí ja ha tornat la música.». Cap dels tres posa pastorsConvencuts de nou ni dona un segon `pa_pastor`.
**Resultat real**:
**Pass/Fail**:

### QA-REV251-11 · Cirosa: distància del foc (límit 380 px) (canvi 4)
**Prioritat**: Baixa
**Precondicions**: com QA-REV251-06.
**Passos**:
1. Toca Vespres a >380 px del foc (p. ex. a la pastura de la dreta).
2. Repeteix a ≤380 px.
**Resultat esperat**: fora de rang no passa res relacionat amb els pastors (`enMelodia` retorna false); dins de rang es convencen. El límit exacte és dependent de la posició; accepta ±20 px.
**Resultat real**:
**Pass/Fail**:

### QA-REV251-12 · Pare Alcoví: casos negatius de la cripta (canvi 8)
**Prioritat**: Alta
**Precondicions**: ZonaBiblioteca. Estats: (a) pas `soterrani` (tombaLlegida i tombaSegellada actius); (b) pas `segell` + posar tombaLlegida **sense** tombaSegellada (parla un cop amb el Pare per posar-lo, QA-REV251-07, i torna'l a provar); (c) tombaSegellada actiu però tombaLlegida inactiu (**NO CONFIRMAT** com forçar-ho: el panell sempre posa els dos junts; només possible per consola); (d) pas `raim` o `cripta` (relTretes inactiu, runna actiu).
**Passos**:
1. Per a cada estat, parla amb el Pare Alcoví.
**Resultat esperat**: no sortida del diàleg «he baixat a la cripta de la Casa Gran». (a) i (b) surt la branca `alcuiLlegit` (o la del Saber si benedicioMonjo i !saber); (d) idem. Cap pas queda bloquejat.
**Resultat real**:
**Pass/Fail**:

### QA-REV251-13 · Ombra: tocar Vespres abans que l'ombra demani el cant
**Prioritat**: Mitjana
**Precondicions**: panell: marca «melodies», desmarca «laterals»; tria el pas `ombra`. cantPedres actiu, ombraDemanaCant inactiu. **Evita** acostar-te a < 260 px sense control (l'ombra crida sola). Notar que `nord.js` `enMelodia/teEfecteMelodia` no comprova ombraDemanaCant (només fragment1, fragment2, alcuiLlegit), mentre `ombraCantOberta` sí.
**Passos**:
1. Acosta't a ≤300 px de l'ombra sense deixar que parli (si parla automàticament, anota-ho: canvi 2 passa per defecte).
2. Toca Vespres.
**Resultat esperat**: NO CONFIRMAT. Comportament desitjat per disseny: o bé l'ombra parla primer, o bé la melodia no actua fins que ombraDemanaCant sigui actiu. Si la benedició salta sense la petició de l'ombra, és un possible salt de diàleg; registra-ho com a bug (Baixa) si no trenca estat posterior.
**Resultat real**:
**Pass/Fail**:

### QA-REV251-14 · Ombra ja beneïda: sense reaparició ni repetició
**Prioritat**: Mitjana
**Precondicions**: pas `saber` (benedicioMonjo actiu), qualsevol checkbox.
**Passos**:
1. Ves a ZonaRuines i acosta't al lloc de l'ombra.
2. Toca Vespres.
**Resultat esperat**: l'ombra no és visible, no hi ha cap diàleg `ombraMonjo` ni `benedicioMonjo`; no es repeteix cap flag.
**Resultat real**:
**Pass/Fail**:

---

## SESSIÓ S2b: pistes (progres.js; canvis 3, 7, 9)

### QA-REV251-15 · Pista del sopar amb/sense Cant de Vespres (canvi 3)
**Prioritat**: Mitjana
**Precondicions**: pas `sopar`, «laterals» desmarcada. Dos estats: «melodies» desmarcada (cantPedres inactiu) i marcada.
**Passos**:
1. Parla amb les Venerables Sàvies (ZonaCelles, **NO CONFIRMAT** la zona exacta) o llegeix l'objectiu del sopar.
2. Anota el text de la pista.
**Resultat esperat**: sense cantPedres: «Al sopar del Til·ler encara hi falta: l'escudella de la Meus (a les cel·les), les flors d'Isílder (a l'Hostatgeria), el pa que pasten els pastors de la Cirosa (cal el Cant de Vespres, que ensenya la Pianista al Santuari).». Amb cantPedres: igual però sense el parèntesi.
**Resultat real**:
**Pass/Fail**:

### QA-REV251-16 · Pista del pas «pastor» (canvi 7)
**Prioritat**: Baixa
**Precondicions**: pas `pastor` («laterals» desmarcada).
**Passos**:
1. Demana la pista a les Venerables Sàvies.
**Resultat esperat**: «A la pastura de la Cirosa, el Germà Aldreu s'ha deixat dur per la boira: ara és el Pastor de Boira.»
**Resultat real**:
**Pass/Fail**:

### QA-REV251-17 · Pistes neutres: font, jaumeta, boiraTiller, benediccio, saber (canvi 9)
**Prioritat**: Baixa
**Precondicions**: per a cada pas, tria'l al panell amb «laterals» desmarcada: `font` (dos estats: sense i amb fontVista), `jaumeta` (sense/amb portalJaumeta), `boiraTiller`, `benediccio`, `saber`. Llegeix la pista amb les Venerables Sàvies.
**Passos**:
1. Per a cada pas, llegeix la pista.
**Resultat esperat**: font (sense fontVista): «La Font del Bisbe, que diuen que guaria tothom, s'ha quedat adormida. Val la pena anar-hi a mirar.»; font (amb fontVista): ofrenes n/3; jaumeta: «Ja tens l'aigua de la Font del Bisbe. L'Alzina Buida del bosc potser en sabria què fer-ne.»/«A l'altra banda de l'Alzina Buida hi ha un regal per al camí del Til·ler.»; boiraTiller: «Una boira espessa tapa un camí de les Cel·les. Un beuratge la desfaria.»; benediccio: «Ara que el Til·ler t'ha donat permís, a la Plaça et poden posar la mà al cap: la benedicció del prior.»; saber: «Ara que l'ombra t'ha parlat, a la biblioteca del Monestir hi ha paraules per a tu.». Cap pista conté spoilers de passos posteriors (revisió subjectiva: confirma amb qa-lead si se'n dubta).
**Resultat real**:
**Pass/Fail**:

### QA-REV251-18 · Pista del pas «ombra» (variants relacionades amb el canvi 2)
**Prioritat**: Mitjana
**Precondicions**: pas `ombra`, tres estats: ombraDemanaCant inactiu; ombraDemanaCant actiu i cantPedres inactiu; tots dos actius (abans de la benedicció).
**Passos**:
1. Llegeix la pista en cada estat.
**Resultat esperat**: «A les Runes, l'ombra del monjo és sobre el mur de l'església inacabada. Parla-hi.» / «L'ombra del monjo demana un cant que les pedres entenen. La Pianista, al Santuari, el coneix.» / «L'ombra del monjo, a les Runes, només escoltarà el Cant de Vespres.»
**Resultat real**:
**Pass/Fail**:

---

## SESSIÓ S3: lectura de textos (canvis 5, 6, 7, 10)

### QA-REV251-19 · Carry: «fa dues nits» (canvi 5)
**Prioritat**: Baixa
**Precondicions**: «laterals» **desmarcada**, pas `clauer` o posterior (carryParlat inactiu). Anar a Nostra Senyora (zona exacta **NO CONFIRMAT**; ha de ser la de la Carry).
**Passos**:
1. Parla amb la Carry.
2. Llegeix la tercera pàgina.
**Resultat esperat**: «... Va marxar fa dues nits, darrere el Fram, i no ha tornat.» Coherent amb la resta (el Fram és un dels nens que han desaparegut).
**Resultat real**:
**Pass/Fail**:

### QA-REV251-20 · Venerables Sàvies sobre la Carry: «fa dues nits» (canvi 5)
**Prioritat**: Baixa
**Precondicions**: carryParlat actiu: posa «laterals» marcada o parla abans amb la Carry. El text surt a la branca del consell sobre el rellotge/campanar (`consellVenerables`, línies ~26-37); les condicions exactes d'aquesta branca: **NO CONFIRMAT**.
**Passos**:
1. Parla amb les Venerables Sàvies a les Cel·les i llegeix la segona pàgina.
**Resultat esperat**: «Pobreta, no té el cap per res: fa dues nits que busca el seu gos, el Pallofa. Si el trobes i li'l portes, segur que et dona la clau.»
**Resultat real**:
**Pass/Fail**:

### QA-REV251-21 · Pilària i Dolora (canvis 6 i 10)
**Prioritat**: Baixa
**Precondicions**: a l'Hostatgeria, Dolora: lliurePains actiu i premiPains inactiu. Pilària: premiPhili inactiu (alliberada). Com forçar-ho: panell, pas `benediccioFraterna`; **NO CONFIRMAT** que l'estat posi premiPains/premiPhili (el pas els marca tots, així que els textos «primer cop» **ja no es veuran**). Cal jugar el pas a mà (llosa, esbarzers) o cercar un pas anterior (`rastell`/`tortura`) amb lliurePains posat per consola.
**Passos**:
1. Parla amb la Dolora quan ha estat desperta amb música de 3 notes.
2. Parla amb la Pilària, ja alliberada.
**Resultat esperat**: Dolora: «La boira va entrar pel soterrani fa tres nits. Vaig veure un home amb hàbit i ocells a l'espatlla que s'enduia els nens del poble, rient baixet.» Pilària: «... el Germà Aldreu... abans que la boira ens tanqués, anava moltes nits a la Porta de les Gírgoles, a l'est del Celler, i la porta se li obria sola...» Cap contradicció: la Dolora no anomena l'Aldreu; «fa tres nits» (Dolora/Pilària) vs «fa dues nits» (Carry): confirma amb disseny narratiu si és voluntari.
**Resultat real**:
**Pass/Fail**:

### QA-REV251-22 · Til·ler i pastor vell: Aldreu (canvi 7)
**Prioritat**: Baixa
**Precondicions**: Til·ler: bassadoriaNeta actiu i camiCirosaObert inactiu (pas `bardissa`, «laterals» desmarcada); la branca només surt si cap de les anteriors (soparFet, esquelles, soparObert) es compleix. Pastor vell: pastorVencut inactiu (pas `pastor`, abans del combat).
**Passos**:
1. Parla amb el Gran Til·ler (ZonaTiller) i llegeix la quarta pàgina.
2. Ves a ZonaCirosa i parla amb el pastor vell (~285,650); llegeix la primera pàgina. Atenció: l'Aldreu (boss) crida l'Ineu en acostar-s'hi; parla amb el pastor vell abans.
**Resultat esperat**: Til·ler: «I vés amb compte: el Germà Aldreu hi puja de nit per un pas que jo no vigilo, i porta la boira a dins. L'Home de la Gàbia li parla a cau d'orella, i ell l'escolta.» Pastor vell: «Fill, el Germà Aldreu feia bona cara, però això ja ho portava dins...» Cap contradicció amb «Germà Aldreu» com a boss de la Cirosa.
**Resultat real**:
**Pass/Fail**:

### QA-REV251-23 · Jusef: roda de carruatge del Celler (canvi 10)
**Prioritat**: Baixa
**Precondicions**: Jusef vençut al ping-pong per primer cop: pas `josep` o l'anterior (`cantMiracle`), «laterals» desmarcada. Anar a ZonaCeller (**NO CONFIRMAT** el nom).
**Passos**:
1. Guanya la partida de ping-pong contra en Jusef.
2. Llegeix l'última pàgina; després, mira la pista del pas `roda`.
**Resultat esperat**: «... aquella roda de carruatge del Celler no és decoració. Darrere hi ha el túnel dels monjos cap a la Casa Gran. Però pesa com un carro ple.» La pista de `roda`: «La roda de carruatge de la qual et va parlar en Jusef tapa el túnel dels monjos...» (coherent amb el text).
**Resultat real**:
**Pass/Fail**:

---

## Resum de riscos per al lead
- Risc alt de bloqueig: canvi 2 (casos 04, 05, 13). La cadena ombraDemanaCant → cantPedres → benedicioMonjo ha de funcionar amb tarota inicial amb i sense Vespres apresa.
- El panell de proves **no** permet forçar un sol flag; veure «Preparació».
