# RUNNA: L'ESPASA DEL MIRACLE — Guió complet i ruta pas a pas

Document només de text, per llegir la història de principi a fi (com un guió de teatre) i comprovar que no hi ha forats.
Té dues parts:

1. **La ruta**: la història en ordre, amb on anar, qui parla amb qui, què s'aconsegueix i per a què serveix (sortida de `js/progres.js` i `docs/GUIO.md`).
2. **L'annex**: TOTS els diàlegs del joc, conversa per conversa, extrets del codi, amb les variants segons el progrés. Cada pas de la ruta cita entre `claudàtors` el nom de la conversa de l'annex (p. ex. `pareJorda`) perquè la trobis ràpid.

Aquest fitxer es genera amb `python eines/fer_guio_complet.py` (la ruta és a `eines/guio_ruta.md`; l'annex surt del codi).

---

## 0. En dues frases

L'**Ineu**, un jove monjo del Santuari del Miracle, desperta un matí amb tres nens desapareguts (l'Huri, el Fram i el Sardi) i una boira violeta que surt de sota terra i fa callar l'orgue. Ha de trobar **Runna, l'espasa del Miracle** (adormida al Dolmen), baixar a la **Sala de la Gàbia** (fons de les Gírgoles), vèncer l'**Ocellaire** (l'Home de la Gàbia) i tornar el cant i el riure al poble.

**La llegenda.** Fa segles, un firaire (l'Ocellaire) venia ocells en gàbies i, amb els anys, va començar a robar el riure dels nens. Pastors i monjos el van tancar dins la seva pròpia gàbia gegant, sota terra. Un monjo va segellar la porta de ferro amb la llum de Runna, va deixar l'espasa dormint al Dolmen i va amagar la clau. La tomba dels monjos del Cementiri s'ha esquerdat: d'allà surt la boira (l'alè de l'Ocellaire) i els escolopendres. El Germà Aldreu, que admira l'Ocellaire, li ha obert la porta.

## 0b. Qui és qui

| Personatge | On | Paper |
|---|---|---|
| **Ineu** | — | Protagonista, jove monjo. |
| **Pare Jordà** | Plaça / Monestir | Prior. Encarrega la missió i dona la Benedicció. |
| **Pare Alcoví** | Biblioteca (Monestir) | Llegeix els pergamins; dona el Saber. |
| **La Pianista** | Santuari | Ensenya els tres cants (Aurora, Vespres, Miracle) i dona la tarota. |
| **Pare Daimiel** | Santuari | Dirigeix el cor. |
| **Germà Francí** | Monestir / Sant Antoni | Monjo vell; dona els Guants de Poder. |
| **Germà Aldreu** | Plaça, Cirosa, Gàbia | Antagonista simpàtic: servent de l'Ocellaire (el «Pastor de Boira»). |
| **L'Ocellaire (L'Home de la Gàbia)** | Sala de la Gàbia | Boss final. |
| **Meus i senyor Molner** | Sant Benet | Matrimoni veí dels nens; la Meus fa l'escudella del sopar. |
| **Mandu** | Sant Benet | Nena petita, germana del Fram. |
| **Venerables Sàvies** | Cel·les | Donen la pista del moment. |
| **Carry** | Nostra Senyora | Vídua del campaner; busca el gos Pallofa. |
| **Rosansa** | Cel·les (un sol cop, **només a l'Acte 3**) | Dona la Llavor de Lluna. |
| **Càren, Eve, Iscu** | Taverna / cabana amagada | L'Eve obre la Taverna; l'Iscu té la clau rovellada. |
| **Julius, Senyor Pomers, Eloi, Jusef** | El Celler | Ping-pong; en Jusef és el repte. |
| **Isílder** | Hostatgeria (jardí) | Pare del Sardi; cuida les flors. |
| **Les sacerdotesses** Dolora, Pilària, Carmèlia | Hostatgeria | Protectores del Sardi; atrapades al soterrani. |
| **Galf** | L'Era | Inventor del telescopi. |
| **Georgi** | La Caseta | Nen que guarda la Maneta. |
| **La Joaneta** | Cabana del bosc | Bruixa-vident; dona el beuratge. |
| **El Gran Til·ler** | Gran Til·ler | Esperit savi; dona la branca i la Fulla. |
| **Pastors de la Cirosa** (el pastor vell) | Cirosa | Desterrats; guarden les Esquelles. |
| **Nena de les Trenes** | Camí de la Rovellonera | Esperit: cal tornar-li dos llaços. |
| **Follet del Carro Verd** | L'Era (i altres parades) | Carro de vapor (viatge ràpid). |
| **L'ombra del monjo** | Runes | Aliat: el monjo que va segellar la porta. |

## 0c. Els objectes que s'aconsegueixen (resum)

*Noms dins el joc: la «Llanterna» és el **Llum d'en Mamet**; la «Fulla del Til·ler» és el **Medalló de l'Arbre** (el flag intern es diu `fullaTiler`); la «clau petita» és la **clau del sagrari**.*

| Objecte | On / de qui | Serveix per a |
|---|---|---|
| Bastó de pelegrí | Germà Aldreu (Plaça), al començament | Atac bàsic. |
| Tarota del Cortiner | La Pianista (Santuari) | Tocar els cants (notes 1-2-3). |
| Cant de l'Aurora | Pianista | Neteja la Bassadòria; allibera Dolora. |
| Aigua de la Font del Bisbe | Font del Bisbe (bosc de Sant Joan) | Obre el portal de la Joaneta. |
| Beuratge | La Joaneta | Esvaeix la boira del camí del Gran Til·ler. |
| Branca del Til·ler | Gran Til·ler | Atac millor; enfonsa les arrels que barren la Cirosa. |
| Esquelles dels pastors | Pastor vell (Cirosa) | Trama del sopar. |
| Escudella / Flors d'Isílder / Pa dels pastors | Meus / Isílder / pastors | Les tres coses del sopar del Til·ler. |
| Medalló de l'Arbre (la «Fulla del Til·ler» al guió) | Sopar del Til·ler (★ «Has obtingut el MEDALLÓ DE L'ARBRE!») | Permís per al Dolmen. |
| Clau del sagrari | Ermita de la Desaparició (missatge de les 12 columnes) | Obre el sagrari del Santuari. |
| Fragments 1 i 2 | Runes / sagrari del Santuari | Pista per a l'Alcoví. |
| Cant de Vespres | Pianista | Desperta l'ombra, la pedra secreta i el pont de la Gàbia. |
| Medalló del Saber | Pare Alcoví | Placa del Dolmen. |
| Medalló de la Benedicció | Pare Jordà | Placa del Dolmen. |
| Clau de Sant Gabriel / Cristall de Gel | Galf / cofre de l'ermita de Sant Gabriel | Telescopi. |
| Telescopi / Estel de Sant Llorenç | Galf / Dipòsits | Aparta la boira del camí del Dolmen. |
| **Runna** | El Dolmen | Dany 3; talla els esbarzers negres. |
| Cant del Miracle | Pianista (després de Runna) | Obre els barrots de la gàbia. |
| Llanterna (Llum d'en Mamet) | Jusef (en guanyar-lo a ping-pong, **a l'Acte 2, abans del fragment 1**) | **Imprescindible a les Runes** (sense llum no es veu el pergamí del forat); eixampla la llum als llocs foscos. |
| Ram / Guants de Poder | Germà Francí | Mouen la roda del Celler, el rastell i l'àngel de pedra. |
| Maneta | Cofre de joguines de la Caseta (en Georgi) | Fa girar el cap de l'Home del Raïm. |
| Pergamí del monjo | Cambra secreta (Casa Gran) | Pista del puzle del Raïm. |
| Clau de ferro | Cripta de la Casa Gran | Obre la porta de ferro exterior (Pati del Celler). |
| Clau rovellada | L'Iscu (cabana amagada) | Obre la porta de ferro del fons de la galeria. |
| Llavor de Lluna | Rosansa (**només a l'Acte 3**) | L'Isílder la planta: s'obre la llosa de l'Hostatgeria. |
| Empara Fraternal | Cofre del vestíbul de l'Hostatgeria | Dissipa la boira verinosa abans de la Gàbia. |
| Carta del Cortiner | Pi dels Tres Cants (lateral) | Història dels tres cants. |
| Cors extra (+1 cada un) | Pastor de Boira vençut, les 3 sacerdotesses, cofre de la Cambra del Santuari / sala del tresor, cofre de la cabana de l'Iscu | Vida màxima (màxim 7). |

---

# PART 1 — LA RUTA PAS A PAS

## PRÒLEG — «Tres nits de boira» (cinc quadres amb text)

1. L'Ocellaire amb les seves gàbies; els nens que es queden sense riure.
2. Pastors i monjos el tanquen sota terra; un monjo segella la porta de ferro amb la llum de Runna.
3. El Santuari de nit: fa tres nits que puja una boira lila que emmudeix l'orgue.
4. Cada nit falta un nen: l'Huri i el Fram (de Sant Benet) i, aquesta nit, el Sardi, el protegit de les sacerdotesses. Una ombra amb hàbit se l'endú dins la boira cap a les Gírgoles.
5. Matí: l'Ineu es desperta i el Pare Jordà el busca.

(Els textos exactes són al codi: `js/main.js`, `PROLEG_QUADRES`.) Quan comença el joc, els tres nens ja falten.

## ACTE 1 — «El misteri»

**Pas 1 · Plaça del Santuari — Pare Jordà** `pareJorda`
L'Ineu parla amb el prior: li explica la desaparició dels nens i li demana que parli amb tothom. *(Posa el flag `clauerNovici`.)*

**Pas 2 · Plaça — Germà Aldreu, vora els xiprers** `germaAldreu`
Simpàtic i rialler (parla de cromos i del Barça), li dona el **bastó de pelegrí**. *Atenció a la lectura: aquest és el futur Pastor de Boira; a la Plaça sembla inofensiu.*

**Pas 3 · Santuari (interior) — la Pianista** `pianista`
L'orgue no sona. Ensenya el **Cant de l'Aurora** i dona la **tarota del Cortiner**. Així s'aprèn a tocar els cants (tecles 1-2-3 o ← ESPAI →; al mòbil, tres cercles). També hi és el Pare Daimiel `pareDaimiel` (cor i rellotge aturat).

**Pas 4 · La Bassadòria (sud de la Plaça) — netejar l'aigua** `bassadoria` `bassadoriaNeta`
Amb la tarota, el Cant de l'Aurora neteja l'aigua tèrbola (en surten gripaus enverinats i boira). La Creu de l'Aparició reacciona `creu`.

**Pas 5 · Cel·les (Sant Benet, Nostra Senyora, Sant Antoni)** *(es pot fer ara o quan toqui)*
- **Meus i senyor Molner** `meus` `molner`; **Mandu** `mandu` (nena petita, germana del Fram).
- **Venerables Sàvies** `venerables`: donen la pista del moment si vas perdut.
- **Carry** `carry`: busca el seu gos (lateral, vegeu més avall).
- El camí del nord, cap al Gran Til·ler, és tapat per una **boira espessa**.

**Pas 6 · Taverna (lateral des de l'inici)** `eve` `portaTaverna`
La porta és tancada («Avui no servim — Càren»). Truca: l'**Eve** obre per la finestra, explica que el Germà Aldreu va cada nit a la Porta de les Gírgoles i que d'allà se senten ocells, i que el Sardi hi berenava. A la galeria hi ha una **porta de ferro** d'on surt boira (tancada amb clau).

## ACTE 2 — «La recerca de Runna»

### 2A · El camí del Til·ler

**Pas 7 · Bosc de Sant Joan — Font del Bisbe** `fontSJ` `herba`
La font és adormida i el bosc és ple de boira lila. Calen **tres ofrenes**: l'**herba de Sant Joan** (brilla en una clariana del bosc), la **rialla** (l'«herba del riure», una planta que brilla en una clariana del Bosc del Pi dels Tres Cants, guardada per tres bolets verinosos; no hi és fins que la font la demana) i una **pruna** de la **Prunera Màgica**, al jardí de l'Hostatgeria `prunera`. En tirar-les-hi, la font es desperta (+ **aigua de la Font del Bisbe**).

**Pas 8 · L'Alzina Buida i la Joaneta** `alzinaBuida` `joaneta`
L'Alzina Buida (el doble de gran que la resta d'arbres) és un portal a la **Cabana de la Joaneta**: la bruixa-vident remena l'olla i dona el **beuratge**. Torna pel portal `portalTornada`.

**Pas 9 · Cel·les, camí del nord — la boira del Til·ler** `boiraTiller`
El beuratge esvaeix la boira espessa i s'obre el camí cap al Gran Til·ler.

**Pas 10 · Gran Til·ler** `tiller` `branca`
L'arbre parla de la terra esquerdada i demana que es torni la vida a la terra («Et donaré el permís quan hagis tornat la vida a la terra»). Al peu cau la **branca del Til·ler** (atac més ràpid i amb més abast).

**Pas 11 · Arrels del Til·ler (nord-est) — camí de la Cirosa** `arrelsTiller`
Només amb la branca **i la Bassadòria neta** les arrels s'enfonsen i s'obre el camí de la Cirosa.
*(Branca lateral: a l'oest del Til·ler hi ha **La Caseta** (vegeu «Maneta», pas 25).)*

**Pas 12 · La Cirosa — Pastor de Boira** `aldreuPastor` `aldreuDerrotat`
Camí llarg amb ovelles de boira, un banc de pedra (desa la partida), la masia (Mas de la Cirosa, amb el **Llibre del Ramat** `masiaLlibre`) i els pastors `pastorA` `pastorB`. El Germà Aldreu, convertit en **Pastor de Boira**, és un mini-boss. En vèncer-lo no es penedeix: diu que el Mestre ja és despert al fons de les Gírgoles i marxa rient camí avall. (+1 cor.)

**Pas 13 · Cirosa — el pastor vell** `pastorVell`
Vora el foc, el pastor vell dona les **Esquelles** dels seus avis.

**Pas 14 · Sopar del Til·ler** `tillerSoparIntro` `tillerSoparFalta` `tillerSoparPreparat` `tillerSoparRitual` `espelmesTiller`
Amb les esquelles, el Til·ler parla d'un sopar. Calen tres coses:
1. **L'escudella de la Meus** (Cel·les, Sant Benet) `meus`.
2. **Les flors d'Isílder** (jardí de l'Hostatgeria) `isilderBase`.
3. **El pa dels pastors**: els pastors el pasten ells, però necessiten una música antiga vora el foc. La Pianista ensenya el **Cant de Vespres** (veure pas 17) i, tocat vora el foc de la Cirosa, convenç els pastors `pastorsConvencuts`.
Ritual de tres espelmes (una per cada nen: l'Huri, el Fram i el Sardi): cau la **Fulla del Til·ler**: en objecte, el **Medalló de l'Arbre** i el **medalló de l'Arbre**.

### 2B · El Saber i les benediccions

**Pas 14b · El Celler — partit de ping-pong contra en Jusef: la Llanterna** `jusef` `jusefRegles` `jusefGuanyat` `jusefPerdut` `julius` `pomers`
Cal guanyar en **Jusef** (set punts; Julius i Senyor Pomers donen consells, l'Eloi és arrogant i no cal vèncer-lo). En guanyar, dona el **Llum d'en Mamet** (Llanterna) i revela que la **roda de carruatge** del Celler amaga el túnel dels monjos, però pesa massa per a uns braços sols (això s'aprofitarà a l'Acte 3). Sense la Llanterna, a les Runes l'Ineu diu «Sense llum no s'hi veu res»: la pista de les Venerables envia aquí.

**Pas 15 · Runes — fragment 1 i l'ombra** `ruines`
L'Ineu llegeix el pergamí entre dues pedres; la llum s'apaga i **apareix l'ombra del monjo** sobre el mur `ombraMonjo`. (A les Runes també hi ha l'esquerda i un cartell `cartellRuinesPingpong`.)

**Pas 16 · Camí de la Desaparició → Ermita de la Desaparició — la clau del sagrari** `taulaPedra` `creuDesaparicio` `altarErmita` `cofreAltar`
Per tot el camí hi ha **12 columnes** que «parlen»: cada una dona una paraula. La frase completa és: *«Quan la boira cobreixi el Miracle, els passos dels absents tornaran amb l'alba.»* A l'ermita, les taules de pedra demanen que algú la digui davant l'altar: premi, la **clau del sagrari**. (Al muret d'arbres del nord del camí hi ha un forat més ample cap a la **cabana amagada** de l'Iscu: vegeu el pas 31.)

**Pas 17 · Santuari — fragment 2 (sagrari) i Cant de Vespres** `sagrari` `pareDaimiel` `pianista`
El Pare Daimiel només parla del sagrari quan l'Ineu ja té el primer pergamí. La clau petita obre el sagrari del retaule: **fragment 2**. La Pianista ensenya el **Cant de Vespres** (3-1-2-1) un cop l'ombra el demana; el mateix cant desperta la **pedra secreta** de la façana del Santuari (sala del tresor: +1 cor, `pedraEscolta` `cofreTresor`).

**Pas 18 · Biblioteca — Pare Alcoví** `pareAlcovi`
Llegeix els fragments i els compara amb la Crònica: en un marge hi diu que l'ombra apareix a les Runes. Activa el fragment 3 i demana a l'Ineu que hi parli.

**Pas 19 · Runes — l'ombra i el Cant de Vespres** `ombraMonjo` `benedicioMonjo`
- Sense els fragments llegits: l'ombra només el mira i li diu quants fragments li falten.
- Amb els fragments llegits: demana el **Cant de Vespres**. Quan l'Ineu li el toca, l'ombra explica qui era i que el segell es va esquerdar quan van obrir el cementiri, i dona la **Paraula de l'Ombra**: li diu on dorm Runna (sud-est, entre pedres, on el sol s'atura: el Dolmen) i la frase que només l'Alcoví sabrà entendre. Després s'enlaira i es desfà en llum.

**Pas 20 · Biblioteca — el Saber** `pareAlcovi`
Amb el que l'Ineu li explica, l'Alcoví entén la paraula esborrada de la Crònica: *«La foscor tem la llum, però més encara el riure».* Això és el **Saber** (+ medalló).

**Pas 21 · Plaça — la Benedicció** `pareJorda`
Només amb la Fulla del Til·ler: el Pare Jordà beneeix l'Ineu (animació) i li dona el **medalló de la Benedicció**.

### 2C · El camí del Dolmen

**Pas 22 · L'Era — Galf** `galf` `cofreGabriel`
Seu al banc del Galf. Demana un **cristall de gel** i et dona la **clau de Sant Gabriel**. A l'**ermita de Sant Gabriel** (camí de la Rovellonera) hi ha el cofre amb el **Cristall de Gel** (només hi és un cop el Galf n'ha parlat). Torna al Galf: construeix el **telescopi** (`telescopiMon`).

**Pas 23 · Dipòsits — estels** `estelDiposit` `telescopiMon`
Al mirador dels Dipòsits, el telescopi mostra estels; l'últim, l'**Estel de Sant Llorenç**, cau a l'aigua del dipòsit: cal pujar-hi a collir-ne la llum.

**Pas 24 · Camí del Dolmen — la boira** `boiraDolmen`
L'Estel de Sant Llorenç aparta la boira que tapa el camí.

**Pas 25 · Dolmen — Runna** `dolmen` `dolmenBaix` `placaDolmen` `faltaRunna` `objectiuRunna`
Cal posar a la placa els **tres medallons** (Arbre, Saber, Benedicció) i dir la frase del monjo. La pedra s'obre i **Runna** baixa a la mà de l'Ineu (l'espasa no parla). *Dany 3; talla esbarzers negres.*

## ACTE 3 — «La Sala de la Gàbia»

**Pas 26 · Santuari — Cant del Miracle** `pianista`
Just després de Runna. És el cant que l'Ocellaire va robar als ocells: obre els barrots de la gàbia.

**Pas 27 · El Celler — la roda (ja se sap des del pas 14b)** `jusef`
En Jusef ja va revelar al pas 14b que la **roda de carruatge** del Celler amaga el túnel dels monjos, però pesa massa per a uns braços sols: cal arribar-hi amb els Guants de Poder (pas 28).

**Pas 28 · Sant Antoni → Cementiri → Sant Antoni — els Guants de Poder** `germa_franci` `germaFranci`
El Germà Francí demana que portis el seu **ram** a la tomba de l'àngel del Cementiri `creuCementiri`; en tornar, et dona els **Guants de Poder**. Amb ells la roda cedeix.

**Pas 29 · Casa Gran per dins: passadís, cambra, cofre** `cofreCambra` `homeRaimInt` `botaTresor`
Roda → **Passadís secret** (escolopendres i un mur de cinc esbarzers negres: Runna) → **Cambra secreta** (cofre: el **pergamí del monjo**; la porta del fons és una llosa sense pany: la bóta de la creu rodola, deixa veure una anella, i una cadena fa girar la politja i puja la llosa).

**Pas 30 · La Caseta — la Maneta** `georgiCaseta` `cofreManeta`
A l'oest del Gran Til·ler, en Georgi (que crida «MAI! MAI!») guarda la **Maneta** al cofre de les joguines de la caseta aixecada sobre pals; per una cosa seriosa, la hi deixa agafar.

**Pas 31 · Escalinata de la Casa Gran — Home del Raïm i Cripta** `homeRaim` `raimDesperta` `raimDerrotat` `tombaMonjos`
La Maneta s'encaixa al volant de ferro del pedestal: tres voltes i el cap girat el mira de cara → **boss**. Vençut, la trapa de sota l'escalinata duu a la **Cripta** dels monjos: la **Clau de ferro**.

**Pas 32 · Cementiri — segellar la tomba** `creuCementiri` `tombaMonjos` `pareAlcovi`
El Pare Alcoví llegeix a la Crònica que la llum de Runna tanca la tomba. Un cop de **Runna** a la tomba esquerdada la segella i la boira s'esvaeix.

**Pas 33 · Pati del Celler — porta de ferro exterior** `cartellCeller` `cartellGirgoles`
La Clau de ferro obre la **porta de les Gírgoles**, a l'est del Pati del Celler (la que visitava l'Aldreu): duu a la **Galeria de la Porta de Ferro** i al fons hi ha una segona porta de pany petit.

**Pas 34 · Cabana amagada (camí de la Desaparició) — l'Iscu** `iscu`
El fill de la Càren s'amaga allà fent solitaris. Ha vist l'Aldreu picar tres cops de nit a la porta de ferro i té la **clau rovellada** (cofre: +1 cor).

**Pas 35 · Sala de les Gírgoles — puzle de les mates** `girgolesInscripcio`
Cinc mates de gírgoles lluminoses en rotllana: en tocar-ne una, canvien ella i les dues veïnes. Quan brillen les cinc, es desfà la cortina de micel·li del túnel nord.

**Pas 36 · Passadís de tortura** 
Un **rastell** rovellat només s'aixeca amb els **Guants de Poder**; un mur d'esbarzers negres, només amb **Runna**.

**Pas 37 · Hostatgeria — sacerdotesses i Empara Fraternal (lateral obligatòria per passar la boira)** `rosansa` `llosaJardi` `dolora` `pilaria` `carmelia` `cofreMonges` `isilderBase`
Sense l'**Empara Fraternal** la boira verinosa de la galeria final fa tossir l'Ineu i el fa fer enrere. Camí:
0. **Només a l'Acte 3 (amb Runna):** fins aleshores l'Isílder només parla del jardí i del Sardi, i ningú esmenta la llosa ni la Rosansa. Un cop tens Runna, l'**Isílder** t'explica que el jardí amaga una llosa que només s'obre amb una flor de lluna, i que la **Rosansa** ha tornat a passar per les cel·les; les **Venerables Sàvies** també t'ho recorden.
1. **Rosansa** (Cel·les, només a partir de l'Acte 3) dona la **Llavor de Lluna**; l'Isílder la planta i s'obre la **llosa** del jardí.
2. Soterrani de l'Hostatgeria (laberint fosc): vestíbul amb tres portes.
3. **Dolora** (dormitori, en un capoll de boira): Cant de l'Aurora. **Pilària** (refetor): un àngel de pedra barra la porta; s'empeny amb els Guants. **Carmèlia** (capella): esbarzers negres; Runna.
4. En lliurar-les totes tres: +1 cor (la tercera), s'obre la porta de l'Hostatgeria per dins i al vestíbul apareix el **cofre amb l'Empara Fraternal**. Carmèlia diu que el Cant del Miracle obre la gàbia; la Pilària va veure el Germà Aldreu anar a la Porta de les Gírgoles moltes nits.

**Pas 38 · Sala de la Gàbia — el pont** `pontGabia`
Al marge de l'avenc, el **Cant de Vespres** aixeca els blocs del fons i fa un pont.

**Pas 39 · Combat final contra l'Ocellaire** `aldreuGabia` `ocellaireDerrotat`
L'Aldreu (encara Pastor de Boira) hi fa de guàrdia i, quan l'Ineu trepitja la plataforma, crida el seu Mestre: la boira baixa de la cúpula i surt l'**Ocellaire** (rètol «L'HOME DE LA GÀBIA»). Tres fases (54 de vida): ocells de foc, cop de bàcul en cercle, bàcul llançat, foc a terra; només el cap és vulnerable quan cau de genolls. Si l'Ineu cau, torna a l'entrada. Vençut, el bàcul es parteix, ell es desfà en boira i l'Aldreu torna a ser el Germà Aldreu i s'agenolla davant els barrots.

**Pas 40 · Alliberament** `finalGabia`
El **Cant del Miracle** davant els barrots fa brillar la gàbia, que s'aixeca fins al sostre. Els tres capolls baixen davant l'Ineu i **Runna els trenca** un a un: l'Huri, el Fram i el Sardi es desperten rient.

## EPÍLEG — «Torna el cant» `ferEpileg` `gentEpileg`

A la Gàbia, els nens riuen i el riure desfà la boira. L'Aldreu («El Mestre és aquí dins... Jo em quedo amb ell») es posa sota la gàbia, que baixa i el tanca. Al **Santuari** hi és tothom: la Meus abraça l'Huri i el Fram, les sacerdotesses el Sardi, l'Iscu hi ha escapat de la Taverna. La Pianista dona l'entrada: l'Ineu comença el Cant del Miracle amb la tarota, l'orgue el segueix i el poble canta. Si el rellotge del campanar funciona, toca tres campanades. El Pare Jordà: «Benvingut a casa, Ineu.» **Crèdits** i es pot continuar jugant (la gent té frases noves: vegeu `DIALEGS_FINAL` a l'annex).

---

# MISSIONS SECUNDÀRIES (laterals)

Les Venerables Sàvies recorden una lateral quan la història principal és aturada. Compten un 30 % del «joc completat».

| Lateral | Com començar-la | Què cal fer | Resultat |
|---|---|---|---|
| **Taverna i l'Eve** | Des de l'inici: truca a la Taverna | Parla amb l'Eve (`eve`) | Pistes sobre l'Aldreu i les Gírgoles. |
| **Carry i el Pallofa** | Parla amb la Carry (Nostra Senyora) `carry` `pallofa` | Troba el gos **Pallofa** a Sant Antoni i porta-l'hi | **Clau del campanar**. |
| **Rellotge del campanar** | Amb la clau del campanar; el Pare Daimiel obre la porta de la dreta del retaule | Torre → Sala del Rellotge: tres engranatges (petit, gran, mitjà, segons la nota del campaner) | El rellotge camina; a l'epíleg toca tres campanades. |
| **Tresor del Santuari** | Després del Cant de Vespres `pedraEscolta` | Tocar el Cant de Vespres davant la pedra de la façana | Sala del tresor: +1 cor. |
| **Nena de les Trenes** | Camí de la Rovellonera `nenaTrenes` | Recupera dos llaços: un pel camí de la Rovellonera i l'altre a la primera clariana | S'allibera l'esperit. |
| **Pi dels Tres Cants** | Després del Cant del Miracle; al sud de Sant Antoni, entrant per llevant (bosc llarg) | Toca els tres cants davant el pi | Les branques reviscolen; **Carta del Cortiner**. |
| **Llosa i sacerdotesses** | Vegeu pas 37 | Llavor de Lluna, Guants, Runna | Empara Fraternal (necessària). |
| **Follet del Carro Verd** | Parla-hi a cada parada (Era, Bassadòria, Cel·les, Cirosa, Sant Antoni, Dipòsits) | Després de l'epíleg, a l'Era `carruatge` | Obre el carro i deixa anar els ocells; només el final. |

---

# PREGUNTES PER CAÇAR FORATS DE GUIÓ (mentre llegeixes l'annex)

- Cada nen desaparegut (Huri, Fram, Sardi): qui n'explica la desaparició i quan? Ho expliquen igual la Carry, la Meus, les sacerdotesses i l'Aldreu?
- El Germà Aldreu: a la Plaça diu «el Mestre»? Hi ha prou pistes abans del Pastor de Boira?
- Qui dona el Cant de Vespres i quan? (Pianista, però el demana l'ombra: el sopar del Til·ler també el necessita per al pa dels pastors.)
- Les pistes de les Venerables Sàvies i el Pare Jordà (surten de `js/progres.js`) han de coincidir amb el que diuen els personatges concrets.
- Després de l'epíleg: tothom té frase nova? Falta algú (Nena de les Trenes, Galf, Follet, Georgi, Mandu)?
- Els diàlegs amb variant «Si: ...» (annex): n'hi ha cap condició que no es pugui complir mai o que repeteixi el mateix text?

---

# ANNEX — Tots els diàlegs del joc

Extrets automàticament del codi (`js/dialegs.js` i `js/zones/`). Cada bloc és una conversa; quan una conversa té variants segons el progrés, es marquen amb *Si …* (nom dels flags i objectes del joc; «té X» = l'Ineu porta l'objecte X). Les línies amb ★ són els avisos d'objectes que s'obtenen. Els `[…]` són parts del text que el joc calcula (noms, pistes dinàmiques).


## Pròleg «Tres nits de boira» (cinc quadres, `js/main.js`)

**Quadre 1.** Fa tres segles, quan el món encara tremolava de pregàries, un firaire de capa negra pujava cada primavera al Miracle amb gàbies d'ocells que cantaven amb veu de persona: l'Ocellaire. I els nens que l'escoltaven perdien el riure per sempre.

**Quadre 2.** Pastors i monjos s'alçaren contra ell i el van tancar dins la seva pròpia gàbia, al més profund de la terra. Els monjos van segellar la porta de ferro amb la llum de Runna, l'espasa del Miracle, i la van fer dormir entre pedres, a l'espera del dia en què la foscor tornés.

**Quadre 3.** Però la foscor no oblida. Fa tres nits, una boira violeta i glaçada s'ha alçat de sota terra: marceix els horts, enterboleix les aigües i ha fet emmudir l'orgue sagrat del Santuari.

**Quadre 4.** I cada nit, la boira reclama un nen. / Primer l'Huri i el Fram, a Sant Benet. / I ara, en aquesta nit maleïda... el Sardi.

**Quadre 5.** Quan l'alba torna a incendiar el cel del Miracle, un jove monjo desperta al Monestir: l'Ineu. / El destí l'ha triat, encara que ell no ho sàpiga. El Pare Jordà l'espera a la Plaça.


## Índex: personatge → converses

- **Aldreu, Pastor de Boira**: `aldreuPastor`, `aldreuDerrotat`, `aldreuGabia`, `iniciarCombatFinal`
- **Carmèlia**: `hostatgeria`, `carmelia`, `carmelia`, `ferEpileg`
- **Carry**: `carry`, `ferEpileg`
- **Carta del Cortiner**: `piHistoria`
- **Cartell**: `cartellPlaca`, `cartellRuinesPingpong`, `cartellCeller`, `cartellGirgoles`, `cartellBosc`, `cartellCirosa`, `cartellCami`, `sortidaErmita`, `cartellEra`, `construir`, `construir`, `construir`, `construir`, `construir`
- **Crònica**: `pareAlcovi`
- **Dolora**: `dolora`, `dolora`, `ferEpileg`
- **El Gran Til·ler**: `tiller`, `tillerSoparIntro`, `tillerSoparFalta`, `tillerSoparPreparat`, `tillerSoparRitual`
- **Eve**: `eve`, `portaTaverna`, `eve`
- **Follet del Carro Verd**: `cotxer`
- **Fram**: `nenGabia`, `ferEpileg`
- **Galf**: `galf`
- **Gent**: `gentEpileg`
- **Georgi**: `georgiCaseta`
- **Germà Aldreu**: `germaAldreu`, `aldreuGabia`, `ocellaireDerrotat`, `finalGabia`
- **Germà Francí**: `germa_franci`, `germaFranci`
- **Home del Raïm**: `raimDesperta`, `raimDerrotat`
- **Huri**: `nenGabia`
- **Ineu**: `bassadoria`, `creu`, `pedraEscolta`, `pedraSecretaOberta`, `faristolOratori`, `pianista`, `pareDaimiel`, `sagrari`, `homeRaim`, `ruines`, `pareAlcovi`, `ombraMonjo`, `bassadoriaNeta`, `fontSJ`, `alzinaBuida`, `columna`, `taulaPedra`, `altarErmita`, `cofreAltar`, `isilderBase`, `rosansa`, `llosaJardi`, `hostatgeria`, `taulaRefetor`, `dolora`, `pastorVell`, `aldreuPastor`, `aldreuDerrotat`, `mandu`, `nenaTrenes`, `cofreGabriel`, `telescopiMon`, `estelDiposit`, `boiraDolmen`, `dolmenBaix`, `placaDolmen`, `portaReixa`, `reixaDins`, `cofreCambra`, `botaTresor`, `homeRaimInt`, `joaneta`, `boiraTiller`, `arrelsTiller`, `cofreManeta`, `tombaMonjos`, `creuCementiri`, `piOest`, `piPlaca`, `piTresCants`, `piHistoria`, `homeRaimInt`, `raimDesperta`, `raimSenseArma`, `georgiCaseta`, `mecanismePorta`, `golfesRellotge`, `golfesNota`, `golfesReparat`, `construir`, `alAtacar`, `masiaTaula`, `masiaEsquelles`, `construir`, `tornRastell`, `pontGabia`, `gabiaGran`, `actualitzar`, `enMelodia`, `iniciarCombatFinal`, `construir`, `construir`, `ferEpileg`, `enEntrar`, `portaTaverna`, `portaSoterrani`, `portaFerro`
- **Inscripció**: `taulaPedra`, `creuDesaparicio`, `girgolesInscripcio`, `pontGabia`
- **Iscu**: `iscu`, `ferEpileg`
- **Isílder**: `isilderBase`, `prunera`, `tillerSoparRitual`, `isilder`, `ferEpileg`
- **Julius**: `julius`
- **Jusef**: `jusef`, `jusefRegles`, `jusefGuanyat`, `jusefPerdut`
- **L'Home de la Gàbia**: `iniciarCombatFinal`, `ocellaireDerrotat`
- **La Joaneta**: `joaneta`
- **La Pianista**: `pianista`, `ferEpileg`
- **La placa**: `piPlaca`
- **Les Venerables Sàvies**: `avisRosansa`, `consellVenerables`, `tillerSoparRitual`
- **Llibre**: `masiaLlibre`
- **Làpida**: `lapida`
- **Mandu**: `mandu`, `ferEpileg`
- **Meus**: `meus`, `tillerSoparRitual`, `ferEpileg`
- **Monjo**: `ombraMonjo`, `benedicioMonjo`
- **Nena de les Trenes**: `nenaTrenes`
- **Nota**: `cofreTresor`, `cofreCabanaCami`, `cofreMonges`, `portaTaverna`
- **Pare Alcoví**: `pareAlcovi`
- **Pare Daimiel**: `pareDaimiel`, `ferEpileg`
- **Pare Jordà**: `pareJorda`, `ferEpileg`
- **Pastor**: `pastorA`
- **Pastor vell**: `pastorVell`, `pastorsConvencuts`, `tillerSoparRitual`, `pastor_vell`
- **Pastora**: `pastorB`, `pastorsConvencuts`
- **Pergamí**: `sagrari`, `ruines`
- **Pilària**: `pilaria`, `pilaria`, `ferEpileg`
- **Placa**: `placaDolmen`
- **Rosansa**: `rosansa`
- **Sardi**: `nenGabia`, `ferEpileg`
- **Senyor Molner**: `meus`, `molner`, `molner`, `ferEpileg`
- **Senyor Pomers**: `pomers`
- **Veu del bosc**: `alzinaBuida`



## Diàlegs generals


### avisRosansa



**Les Venerables Sàvies:** I una cosa més: la Rosansa, la venedora de verdures, ha tornat a passar per les cel·les amb el carro. Si algun dia busques una llavor estranya, ja saps a qui preguntar.


### consellVenerables


*Si: senseClauCampanar(E*

**Les Venerables Sàvies:** Ai, fill, has vist que el rellotge del campanar s'ha aturat? La porta del retaule que duu a la torre fa anys que és tancada: des que el campaner se'n va, la clau la guarda la seva vídua, la Carry, aquí a Nostra Senyora.


*Si: senseClauCampanar(E ; carryParlat*

**Les Venerables Sàvies:** Pobreta, no té el cap per res: fa dues nits que busca el seu gos, el Pallofa. Si el trobes i li'l portes, segur que et dona la clau.


*Si: senseClauCampanar(E ; NO carryParlat*

**Les Venerables Sàvies:** Parla-hi, però amb paciència: la pobreta no és la mateixa des que va pujar la boira. Potser et pot necessitar.


*Altrament (per defecte):*

**Les Venerables Sàvies:** Ai, fill, torna a seure. A veure... [pista del pas següent de la història: vegeu la Ruta]


### premiMonja


*Si: premiDolora i premiPilaria i premiCarmelia ; ui*

★ Has obtingut un GRA DEL ROSARI: la llum de les tres germanes (+1 cor).


### pareJorda


*Si: NO clauerNovici*

**Pare Jordà:** Ineu, bon dia. Que bé que hagis sortit, et buscava.

**Pare Jordà:** No et vull espantar. Fa tres nits que una boira violeta surt de sota terra, i cada nit falta un nen: l'Huri i el Fram, de les cel·les de Sant Benet, porta amb porta; i aquesta nit, el Sardi, el protegit de les sacerdotesses de l'Hostatgeria.

**Pare Jordà:** Ningú no els ha vist marxar. Els llits són desfets i les finestres, tancades per dins. Només queda una olor de terra mullada.

**Pare Jordà:** Tu tens bons ulls i bon cor. Parla amb tothom i explica-m'ho tot. Ves amb compte pels camins, Ineu.


*Si: fullaTiler i NO benediccio*

**Pare Jordà:** Ineu! Ho he sentit: el Til·ler t'ha donat el seu permís. Aquell arbre no en dóna ni a mi.

**Pare Jordà:** Mira, fill: jo no soc valent com tu, però sí que sé una cosa. Una benedicció no és una paraula màgica, és voler bé de debò. Ajup el cap.

**Pare Jordà:** No vas sol, Ineu. Vas amb tot el Miracle darrere teu.

**Pare Jordà:** I pren això. És un medalló de pedra, amb una mà oberta tallada, que ha passat de mà en mà per les generacions de priors del Miracle. Ara ha de ser teu: duu-lo a la placa del Dolmen.

★ Has obtingut el MEDALLÓ DE LA BENEDICCIÓ!


*Si: té basto_tiller i NO runna*

**Pare Jordà:** Ineu, la gent diu que has parlat amb el Gran Til·ler. Per despertar Runna et calen tres coses: el permís de l'arbre (el seu medalló), les Paraules del Saber del Pare Alcoví i la meva benedicció.

**Pare Jordà:** [pista del pas següent de la història: vegeu la Ruta]


*Si: combatActiu*

**Pare Jordà:** Les bestioles han sortit pels camins, Ineu. Fins i tot alguns visitants, que pujaven al Miracle a fer fotos, vagaregen amb la pell verdosa i la mirada perduda: la boira els ha trastocat i no saben ni qui són. Si en veus pel Santuari o pel Cementiri, no t'espantis.

**Pare Jordà:** No són dolents, pobrets: només fes-los dormir i es despertaran sense recordar res. Quan la boira se'n vagi, tornaran a ser turistes.

**Pare Jordà:** I torna abans que es faci fosc.


*Altrament (per defecte):*

**Pare Jordà:** Parla amb la gent: les famílies de les cel·les, els germans, la Pianista... Algú haurà vist alguna cosa.

**Pare Jordà:** Si et perds, les Venerables Sàvies de les cel·les sempre tenen un bon consell.


### germaAldreu


*Si: NO bastoObtingut*

**Germà Aldreu:** Ineu! Quin drama, oi? Tothom corrent amunt i avall... Segur que els nens s'han amagat per jugar.

**Germà Aldreu:** Ets del Barça, tu? Tinc uns cromos que els nens es moren per tenir. Ells sí que m'escolten.

**Germà Aldreu:** Ei, pren aquest bastó de pelegrí. Era d'un vell que ja no el vol.

★ Has obtingut el BASTÓ DE PELEGRÍ!


*Altrament (per defecte):*

**Germà Aldreu:** Avui no tinc temps, Ineu. Tinc... coses a fer.

**Germà Aldreu:** Ei, no sents res? Com una veu molt fluixeta que em crida de sota terra... Deu ser el vent. Força Barça!


### bassadoria



**Ineu:** L'aigua ja és neta: torna a ser clara i tranquil·la, i la boira violeta s'ha esvaït.

**Ineu:** L'aigua sempre ha estat clara... Ara és tèrbola i fa olor de soterrani. I en surten aquests gripaus enverinats i una boira violeta, a glopades.


### creu


*Si: bassadoriaNeta*

**Ineu:** Les flors del peu de la creu s'han redreçat. Ara que l'aigua torna a ser clara, també elles tornen a tenir color.


*Si: NO bassadoriaNeta*

**Ineu:** Avui les flors estan pansides. Com si la boira se'n begués el color.


### cartellPlaca



**Cartell:** ↑ El Celler i les Runes
← Casa Gran
↓ La Bassadòria


### pedraEscolta


*Si: cantPedres*

**Ineu:** (Aquesta pedra no lliga amb la resta de la façana. Hi poso l'orella i sembla que escolti... Potser vol sentir el Cant de Vespres.)


*Si: NO cantPedres*

**Ineu:** (Aquesta pedra no lliga amb la resta de la façana. Hi poso l'orella i sembla que escolti... però no sé què vol sentir.)


### pedraSecretaOberta



**Ineu:** Un passatge entre el Monestir i el Santuari! Els monjos antics sí que en sabien, d'amagar coses.


### faristolOratori



**Ineu:** «Les pedres guarden el que se'ls diu. Qui calla prou estona, les sent respondre.»


### cofreTresor



**Nota:** «Per al qui sap escoltar les pedres.»


### iscu



**Iscu:** Ei, espera. Tinc una cosa que potser et va bé. Una nit, passant per davant la porta de ferro de les Gírgoles, vaig veure una clau a terra: li havia caigut al Germà Aldreu i ni se'n va adonar.

**Iscu:** És rovellada, però encara gira. Te la dono: jo no tinc res a obrir.

★ Has obtingut la CLAU ROVELLADA

**Iscu:** Crec que és per a la porta petita del fons, la del pany petit. I tu no m'has vist, eh?


*Si: NO iscuTrobat*

**Iscu:** Xxt! Baixa la veu! Si la mare em troba, em fa fregar gots fins a Nadal.

**Iscu:** Em dic Iscu. Vaig trobar el forat entre els arbres «per on els grans no hi caben» i aquesta cabana. Ningú més no la coneix: aquí ningú em mana res!

**Iscu:** Hi havia una baralla vella damunt la taula, i m'encanta fer solitaris amb les cartes. Més val això que fregar gots!


*Altrament (per defecte):*

**Iscu:** Em passaria tot el dia fent solitaris amb aquestes cartes. I aquí, almenys, no hi ha gots per fregar.

**Iscu:** M'ha sortit el solitari! M'encanta això de les cartes. Ara ja no cal que m'amagui tant...


### cofreCabanaCami



**Nota:** «Per a qui es perd pel camí i el troba.»


### pianista


*Si: NO cantAurora*

**La Pianista:** Ai, Ineu, fill... Passa, passa. Perdona que no et miri, no puc deixar l'orgue.

**La Pianista:** Fa quaranta anys que toco cada dia i mai no m'havia faltat el so. Ara els dits es mouen per les tecles, però de l'orgue no en surt ni una nota.

**La Pianista:** Des que va arribar la boira, fa tres nits, el Santuari s'ha quedat mut. Em fa por que s'estigui empassant tota la música.

**La Pianista:** Ho tornem a provar, fill? Escolta bé les tres notes.

**La Pianista:** Però hi ha un cant que encara em surt, perquè la boira no se'l pot empassar: el Cant de l'Aurora. Te l'ensenyaré. Escolta'm i repeteix les notes amb 1, 2 i 3 (o amb ← ESPAI →).


*Si: ombraDemanaCant o soparObert) i NO cantPedres ; perOmbra*

**Ineu:** Una ombra de monjo, a les Runes, diu que vostè coneix un cant que les pedres entenen.


*Si: ombraDemanaCant o soparObert) i NO cantPedres ; NO perOmbra*

**Ineu:** Els pastors de la Cirosa fa anys que no senten música vora el foc. El Gran Til·ler diu que vostè guarda un cant tan vell com ells.


*Si: ombraDemanaCant o soparObert) i NO cantPedres ; perOmbra*

**La Pianista:** Un cant que les pedres entenen? Ai, fill... Potser és el de Vespres: és molt vell, me'l va ensenyar la meva mare. Vine, escolta.


*Si: ombraDemanaCant o soparObert) i NO cantPedres ; NO perOmbra*

**La Pianista:** Un cant tan vell com ells? Tinc el de Vespres, fill: molt vell, me'l va ensenyar la meva mare. Potser els recorda casa. Vine, escolta.


*Si: runna i NO cantMiracle*

**La Pianista:** Ai, Ineu, fill, portes Runna! Se't nota a la mirada. Aleshores t'he d'ensenyar l'últim cant, el que l'Ocellaire va robar als ocells: el Cant del Miracle.

**La Pianista:** Jo me'n recordo perquè el cantava la meva mare. Escolta'm i repeteix les notes amb 1, 2 i 3 (o amb ← ESPAI →). Et farà falta allà baix.


*Si: esquelles i NO esquellesVistes*

**La Pianista:** Ai, mare de Déu, les esquelles dels pastors! Fa vint anys que no en sentia el so. Deixa-me-les tocar un instant...

**La Pianista:** Duen una música antiga. Amb la tarota, els cants antics encara desperten allò que dorm sota la boira. Vés amb compte, que amb aquesta força la boira no et perdonarà.


*Si: bassadoriaNeta*

**La Pianista:** La bassadòria ja és neta, fill. Ho has aconseguit. Torna a veure'm quan tinguis un altre cant per aprendre.


*Si: NO bassadoriaNeta*

**La Pianista:** Si trobes la manera de tornar la música, porta-me-la. Jo no em moc d'aquest banc, ni que s'acabi el món. Toca el cant amb la tarota quan siguis al lloc on cal.


*Altrament (per defecte):*

**La Pianista:** Has sentit l'orgue? Encara li falla el re, però canta. Escolta.

**La Pianista:** I tu, fill, no deixis mai la tarota al calaix.


### pareDaimiel



**Ineu:** Pare Daimiel, el pergamí que he trobat a les Runes diu que l'altra meitat és al sagrari. Sap on és la clau?

**Pare Daimiel:** El sagrari? Hi guardo quatre papers vells dels monjos, perquè la humitat no se'ls mengi. Si el Pare Alcoví els busca, ja era hora que algú els llegís!

**Pare Daimiel:** Però la clau, ai, fa anys que no sé on para: una de petita, que sembla de joguina. Els monjos antics deixaven les seves coses a l'ermita de la Desaparició. Potser és allà.


*Si: NO parlatDaimiel*

**Pare Daimiel:** Ineu! Quina alegria de veure't! Vine, que necessito veus noves per al cor.

**Pare Daimiel:** La Pianista i jo som amics de tota la vida. Ella toca com ningú, i jo dirigeixo els cants. Però la música es queda sense orgue, ja ho veus.

**Pare Daimiel:** No et preocupis: si la música s'ha amagat, la cantarem perquè torni! Riure és la primera pregària.

**Pare Daimiel:** Ah, i una cosa que em preocupa: el rellotge del campanar s'ha aturat a un quart de quatre, la nit que va arribar la boira.

**Pare Daimiel:** La porta de la dreta del retaule puja per la torre fins a la Sala del Rellotge, però és tancada amb clau, i la clau la guarda la Carry, la vídua del campaner, a Nostra Senyora. Jo ja no tinc l'esquena per a tants graons, però tu... mira què hi passa.


*Si: sagrari*

**Pare Daimiel:** I no t'oblidis del rellotge, Ineu. [text calculat pel joc: textRellotge]


*Si: NO rellotgeReparat ; té clau_campanar o portaCampanarOberta*

**Pare Daimiel:** La Sala del Rellotge, fill: la porta de la dreta del retaule, i torre amunt. Si algú el fa caminar de nou, potser la boira s'ho pensarà dues vegades.


*Si: NO rellotgeReparat ; NO té clau_campanar o portaCampanarOberta*

**Pare Daimiel:** La porta de la dreta del retaule és tancada, fill: la clau la guarda la Carry, la vídua del campaner, a Nostra Senyora. Si algú fa caminar el rellotge, potser la boira s'ho pensarà dues vegades.


*Si: NO rellotgeExplicat*

**Pare Daimiel:** Sents el rellotge, Ineu? Torna a caminar! Fa tres nits que no el sentia. Els nens em diuen que canto massa fort, però avui no cal: ho fa ell per mi!


*Si: NO rellotgeExplicat ; encarrec*

**Pare Daimiel:** I ara que el temps torna a passar, t'explico una cosa que m'ha dit la gent mentre era aturat:


*Si: NO rellotgeExplicat ; NO encarrec*

**Pare Daimiel:** I ara que el temps torna a passar...


*Si: NO rellotgeExplicat*

**Pare Daimiel:** Doncs res, fill: tu ja ho saps tot. Jo continuaré cantant, que el rellotge ja em porta el compàs. […]


*Altrament (per defecte):*

**Pare Daimiel:** Doncs res, fill: tu ja ho saps tot. Jo continuaré cantant, que el rellotge ja em porta el compàs. […]


### sagrari


*Si: NO té clau_sagrari*

**Ineu:** El sagrari és tancat amb una clau molt petita.


*Altrament (per defecte):*

**Pergamí:** Fragment 2 de 2:
«El monjo va guardar el segell fins al darrer dia. Des d'aleshores la seva ombra torna cada nit al mur de les Runes a vigilar. La clau de ferro és on ell la va deixar, amb els seus germans, sota la mirada d'un guardià de pedra.»

**Pergamí:** «Qui busqui la clau, que no oblidi mai on neix el sol.»


### homeRaim



**Ineu:** Té el cap posat del revés. Sembla que vigili alguna cosa a la seva esquena.


### ruines


*Si: NO pedraRunes*

**Ineu:** (Una pedra grossa, enfonsada a terra just al peu del mur. Sota seu hi ha alguna cosa: se n'ha escapat un corrent d'aire fred. Potser la puc empènyer.)


*Si: NO pedraRunes ; té llanterna*

**Ineu:** (Un forat fosc! Amb el Llum d'en Mamet s'hi veu alguna cosa...)


*Si: NO pedraRunes ; NO té llanterna*

**Ineu:** (Hi ha un forat negre, fonda i espessa. Sense llum no s'hi veu res: hauré de tornar amb alguna cosa que il·lumini.)


*Altrament (per defecte):*

**Ineu:** (El forat és tan negre que no s'hi distingeix res. Em cal una llum.)

**Ineu:** El Llum d'en Mamet forada la tenebra del forat... Al fons hi ha un full amagat!

**Pergamí:** Un pergamí esquinçat (fragment 1 de 2):
«Quan l'Ocellaire va ser tancat a la seva gàbia, un monjo va segellar la porta de ferro amb la llum de l'espasa Runna i la va deixar dormint a la pedra. Després va amagar la clau de la porta allà on ningú no la trobés.
L'altra meitat d'aquesta crònica la deixo sota clau, al sagrari de l'església.»

**Ineu:** El pergamí s'acaba aquí, però diu que l'altra meitat és sota clau, al sagrari de l'església. I cada nit, diuen, a aquest mur s'hi veu l'ombra d'un monjo.

**Ineu:** Ha aparegut en llegir el pergamí... És el monjo del segell? Quan tingui l'altre fragment, el Pare Alcoví sabrà llegir-los junts.


### cartellRuinesPingpong



**Cartell:** ← Camí de la Desaparició
→ Cementiri
↑ Cel·les
↓ El Celler i la Plaça


### cartellCeller



**Cartell:** ← El Celler (ping-pong)
→ Sala de les Gírgoles
↑ Les Runes
↓ Plaça


### cartellGirgoles



**Cartell:** Porta de les Gírgoles


### julius



**Julius:** Ei, Ineu! El repte més gran del Miracle és derrotar el Jusef i el seu servei màgic. T'hi atreveixes?

**Julius:** El Senyor Pomers juga amb una pala de pedra. De pedra! I tot i així, em guanya fàcilment.


### pomers



**Senyor Pomers:** Calma, noi. La pilota no s'ha de perseguir, s'ha d'esperar.

**Senyor Pomers:** Jo jugo amb una pala de pedra. De pedra, sí: pesa com un maó i no té goma ni res. Quan jugueu a la taula, no em veuràs ni a mi ni la pala; no cal.

**Senyor Pomers:** Perquè amb què es juga és igual. La pala només és una extensió de l'ànima. El que compta és l'esperit del joc, la màgia que portes dins.


### jusef



**Jusef:** La taula és teva quan vulguis, noi. Vols provar de tornar-me el servei un altre cop?

**Jusef:** Benvingut al Celler, viatger. Les pales i la pilota només són l'escorça: el que jo practico aquí és màgia blanca.

**Jusef:** Aquest és el meu servei màgic. La pilota desprèn tres llums que s'encenen una a una. Fins ara ningú ha aconseguit aturar-lo.

**Jusef:** Vols provar-ho? Una partida, a set punts.

**Jusef:** Com vulguis. La taula ja no se'n va enlloc.


### jusefRegles



**Jusef:** Mira per on ve la pilota: quan el cercle es posi verd, prem el seu carril (← ↓ → o els botons) i la tornaràs.

**Jusef:** I quan jo faci el servei màgic, mira els tres signes i repeteix-los en el mateix ordre.


### jusefGuanyat



**Jusef:** M'has tornat a derrotar, has entès perfectament la màgia del meu servei. Quan vulguis, tornem-hi.

**Jusef:** M'has... m'has vençut... El meu servei màgic, per primer cop... M'has vençut amb tota justícia.

**Jusef:** Això és per a tu: el Llum d'en Mamet. En Mamet era un vell ermità del Miracle que coneixia tots els passos subterranis i les escletxes dels murs.

**Jusef:** La seva flama s'alimenta d'un oli antic que mai no s'apaga. Als passadissos tenebrosos i a la foscor de les pedres velles, la seva claror et farà visible allò que sembla ocult.

★ Has obtingut el LLUM D'EN MAMET.

**Jusef:** I un secret, per qui sap tornar un servei: aquella roda de carruatge del Celler no és decoració. Darrere hi ha el túnel dels monjos cap a la Casa Gran. Però pesa com un carro ple.


### jusefPerdut


*Si: abandonat*

**Jusef:** Ja te'n vas? La taula no fuig. Torna quan vulguis.


*Si: NO abandonat*

**Jusef:** Bona partida, monjo. Però el servei encara és meu. Torna-hi quan vulguis: el Julius diu que la segona vegada sempre surt millor.


### meus


*Si: soparObert i NO escudella*

**Meus:** El sopar del Til·ler? Ai, Ineu, i qui té ganes de taula, aquest any! Amb tres nens que falten...

**Meus:** ...Però el Til·ler té raó, maleït sigui. No es pot deixar de fer el que s'ha fet sempre, ni quan el cor fa mal. Pren l'escudella, i no la vessis!

**Meus:** És l'escudella de cada any, la de les nostres àvies, però enguany té un gust que no voldria explicar. Tu tingues-ne cura de portar-la sencera.

★ Has obtingut L'ESCUDELLA DE LA MEUS.


*Altrament (per defecte):*

**Meus:** Ineu, fill, no t'hi quedis plantat! L'Huri i el Fram dormien aquí mateix, a Sant Benet, porta amb porta, i ara no hi són. I ningú no fa res!

**Senyor Molner:** Meus, deixa'l respirar...

**Meus:** Tu calla, que ets tan pesat com el cafè d'ahir. Ineu, busca'ls.

**Meus:** Ja els tinc a casa, i ja els he renyat tres vegades. Dues més i potser els deixo sortir a jugar.

**Meus:** Gràcies, Ineu. No ho diré gaires cops, així que escolta'm bé: gràcies.


### molner



**Senyor Molner:** Sí, Meus. No, Meus. Ara vinc, Meus.

**Senyor Molner:** ...Ah, Ineu. Ets tu. Fes cas del que digui ella. Sempre té raó. Sempre.


### carry



**Carry:** El Pallofa no em deixa ni a sol ni a ombra, ara. Gràcies, Ineu. I no t'oblidis del rellotge: sense hora, tot es fa més llarg.


*Si: té pallofa*

**Carry:** Pallofa! Pallofa meu! On t'havies ficat, bestiola? Mira't: més prim que jo i ple de puces.

**Carry:** Gràcies, Ineu, gràcies. Diners no en tinc, però et dec una cosa. Aquelles nits vaig veure, des de la finestra, el que no hauria de veure ningú.

**Carry:** L'Huri, el petit de la porta de la dreta de Sant Benet, va ser el primer. El seu llit va quedar buit i la finestra, tancada per dins. Ell no sortia mai sol de nit: li feia por la fosca.

**Carry:** La nit següent va ser el Fram, el de la porta de l'esquerra. El Pallofa va lladrar a la boira, com si veiés algú que jo no veia, i va marxar darrere seu. Per això he tingut tanta por.

**Carry:** El meu home era el campaner. Des que se'n va, la clau de la torre la guardo jo, i fa anys que ningú no hi puja. Pren-la. Aquell rellotge s'ha aturat a un quart de quatre, i ningú no s'ha adonat que el temps ja no passa.

★ Has obtingut la CLAU DEL CAMPANAR.


*Altrament (per defecte):*

**Carry:** Encara no l'has vist? És petitó, prim i borni, i no sap estar-se quiet. Diuen que passeja per Sant Antoni. Agafa'l amb compte: està ple de puces.

**Carry:** Ai, Ineu... no, no t'has de preocupar per mi. Bé, sí. Busco el Pallofa, el meu gos.

**Carry:** És petit i prim, blanc amb taques marrons, i li falta un ull: diuen que se'l va menjar un gat. Va marxar fa dues nits, darrere el Fram, i no ha tornat.

**Carry:** A ell li agrada passejar. Si el trobes, porta-me'l. Diners no en tinc, però a casa guardo una cosa que potser et farà falta.

**Carry:** El Pallofa ja no s'escapa: des que no hi ha boira, no té res a perseguir.


### pallofa



**(narrador):** Un gos petit, prim i borni, ple de puces, et mira amb l'únic ull que li queda. Al collaret de cuir hi ha una placa: «PALLOFA».

★ Has agafat el PALLOFA. Duu-lo a la Carry.


### tiller


*Si: NO parlatTiler*

**El Gran Til·ler:** Fa tres-cents anys vaig veure aquella gàbia baixar a la foscor, petit monjo. I des d'aleshores no he tancat mai els ulls.

**El Gran Til·ler:** Ara sento la terra esquerdar-se sota les meves arrels. Els vells cementiris s'obren, i en surt tot allò que hi dormia: no ve amb bones intencions.

**El Gran Til·ler:** El teu bastó de pelegrí és bo per a un camí tranquil. Aquest ja no ho és. Alça els ulls, petit monjo.

**El Gran Til·ler:** Una branca meva, enfortida per tres segles de vent i de pena. Agafa-la: serà més àgil i més viva que cap bastó.

**El Gran Til·ler:** L'arbre que dona una branca no mor. Va créixer per a aquest dia: que et guardi com m'ha guardat a mi.


*Si: NO té basto_tiller*

**El Gran Til·ler:** La branca és a terra, a prop de les meves arrels. Agafa-la, petit monjo.


*Si: soparFet ; pas*

**El Gran Til·ler:** El permís és teu, petit monjo, i les espelmes continuen enceses. Recorda a taula qui hi falta.


*Si: soparFet ; NO pas*

**El Gran Til·ler:** El permís és teu, petit monjo, i les espelmes continuen enceses. Recorda a taula qui hi falta. Que Runna et sigui lleu.


*Si: soparFet*

**El Gran Til·ler:** Ara, per despertar l'espasa: [text calculat pel joc: pas]


*Si: bassadoriaNeta i NO camiCirosaObert*

**El Gran Til·ler:** Sento l'aigua cantar de lluny... La Bassadòria és neta. Has fet bé, petit monjo.

**El Gran Til·ler:** El camí del nord-est cap a la Cirosa el vaig tancar jo amb les meves arrels, perquè la boira no hi pugés. Ara que l'aigua respira, pots passar: les arrels només reconeixen la meva branca. Colpeja-les amb ella i s'enfonsaran.

**El Gran Til·ler:** A la Cirosa viuen uns pastors desterrats que guarden les esquelles dels seus avis: amb elles es van afinar els cants antics. Tracta'ls amb dolçor, que ja han patit prou.

**El Gran Til·ler:** I vés amb compte: el Germà Aldreu hi puja de nit per un pas que jo no vigilo, i porta la boira a dins. L'Home de la Gàbia li parla a cau d'orella, i ell l'escolta.


*Altrament (per defecte):*

**El Gran Til·ler:** Et donaré el meu permís quan hagis tornat la vida a la terra que la boira ha emmalaltit. Has tornat l'aigua: encara en falta, de terra.


### branca



★ Has obtingut la BRANCA DEL TIL·LER!


### pareAlcovi


*Si: placaDolmen i NO alcoviPlacaDita i DIALEGS.faltaRunna(E).length === 3*

**Ineu:** Pare Alcoví, a la placa del Dolmen hi diu que només podrà alçar Runna qui posseeixi el permís de l'arbre sagrat, les paraules del saber i la benedicció divina. Què vol dir?

**Pare Alcoví:** Això ho tinc a la Crònica, fill. Deixa'm que t'ho llegeixi.

**Crònica:** «Per alçar l'espasa calen tres coses: el permís de l'arbre més vell, que seu a taula amb tothom; les paraules que el monjo va deixar, que només entén qui ha parlat amb la seva ombra; i la benedicció del prior, que és la de Déu passada per les mans dels homes.»

**Pare Alcoví:** L'arbre sagrat és el Gran Til·ler, el de les cel·les: el seu medalló és el permís. Les paraules les guarda l'ombra del monjo, a les Runes, i només jo sabré entendre-les quan te les digui. I la benedicció divina és la del Pare Jordà, el prior.

**Pare Alcoví:** I ara, el que et toca: [text calculat pel joc: pas]


*Si: runna i relTretes i NO tombaSegellada i NO tombaLlegida*

**Ineu:** Pare Alcoví, he baixat a la cripta de la Casa Gran. Hi havia una clau de ferro, i la tomba dels monjos no para de treure boira.

**Pare Alcoví:** Una clau de ferro, i una tomba que no calla... Deixa'm mirar la Crònica.

**Crònica:** «Amb la llum de Runna van tancar la porta, i amb la mateixa llum van tancar la seva tomba. Mentre l'esquerda treu boira, la porta no és del tot closa.»

**Pare Alcoví:** La tomba és al Cementiri, darrere del Santuari i el Monestir. Colpeja l'esquerda amb Runna, fill.


*Si: alcoviLlegit i benedicioMonjo i NO saber*

**Pare Alcoví:** Has parlat amb l'ombra, oi? Fa temps que ho sospitava. A la Crònica hi ha un marge que no vaig saber llegir: una paraula esborrada, de la mateixa mà que va escriure els fragments.

**Pare Alcoví:** Amb la paraula que t'ha donat, ara ho entenc. «La foscor tem la llum, però més encara el riure.» Aquestes són les paraules que desperten Runna, fill: no és un conjur, és una veritat. Digues-les davant l'espasa, senceres i amb tot el cor.

**Pare Alcoví:** I una cosa més, fill. Fa anys, a la biblioteca, vaig trobar un compartiment secret dins el llibre més antic de tots, i hi havia això: un medalló de pedra amb un llibre obert tallat. Té centenars d'anys.

**Pare Alcoví:** No sabia per a què servia. Ara sí: porta'l a la placa del Dolmen, i guarda les paraules dins teu per al moment de dir-les.

★ Has obtingut el MEDALLÓ DEL SABER!


*Si: alcoviLlegit ; saber*

**Pare Alcoví:** Ja saps les paraules, fill. Ara només cal que arribi el dia de cridar-les.


*Si: alcoviLlegit ; NO saber*

**Pare Alcoví:** Els dos fragments expliquen el mateix, fill: algú vigila el segell des de fa segles. Ves a les Runes i no tinguis por de l'ombra. […]


*Si: f1 i f2*

**Pare Alcoví:** Has trobat els dos fragments! Deixa'm llegir-los... Sí. Ho explica la Crònica que guardo a la biblioteca: un monjo va segellar la foscor amb la llum de l'espasa Runna.

**Crònica:** «Des que la tercera església va quedar inacabada, l'ombra del monjo es veu clarament sobre el mur de les Runes: mig corbat, amb les mans unides, com si pregués. Apareix cada nit.»

**Pare Alcoví:** L'ombra del monjo... No fa mal a ningú, Ineu. Crec que és el monjo que va segellar la foscor amb la llum de Runna. Ves a les Runes, passat el Pati del Celler: és sobre el mur de l'església inacabada. Parla-hi.


*Altrament (per defecte):*

**Pare Alcoví:** Ineu, fill. Aquesta boira no és natural. Les boires d'aquí baixen de les muntanyes; aquesta puja de sota terra.

**Pare Alcoví:** Diuen que cada nit apareix l'ombra d'un monjo a les Runes. Hi ha dos fragments d'una crònica antiga escampats pel Santuari: un a les Runes i un altre al sagrari de l'església. Porta-me'ls i els llegirem junts.


### ombraMonjo


*Si: NO ombraDemanaCant*

**Monjo:** Fa segles que no sento parlar cap llengua que no siguin les pedres. Només el cant de les pedres em desperta del tot.


*Si: NO ombraDemanaCant ; cantPedres*

**Monjo:** Qui toca l'orgue el coneix, i tu ja el portes a la tarota. Canta-me'l aquí, petit monjo.


*Si: NO ombraDemanaCant ; NO cantPedres*

**Monjo:** Qui toca l'orgue el coneix. Aprèn-lo, petit monjo, i torna a cantar-me'l aquí.


*Altrament (per defecte):*

**Ineu:** Toca el Cant de Vespres amb la tarota: 3-1-2-1.


### benedicioMonjo



**Monjo:** Jo era el qui va tancar la porta. Quan van obrir el cementiri, rient, els meus germans van deixar de descansar i el segell es va esquerdar.

**Monjo:** Sota terra hi ha una gàbia, petit monjo, i una cosa que no ha oblidat cap cant ni cap nen. Jo només puc vigilar. Tu pots tornar a tancar-ho.

**Monjo:** L'espasa dorm al sud-est, entre pedres, allà on el sol s'atura. Rep la meva paraula, que no pesa ni es veu, i recorda: la foscor tem la llum, però més encara el riure.

**Monjo:** Jo només puc dir-te les paraules; el Pare Alcoví sabrà entendre-les. Quan les cridis davant l'espasa, la meva paraula farà que et reconegui.

**Monjo:** Ara ja puc descansar en pau.

★ Has rebut la PARAULA DE L'OMBRA.


### bassadoriaNeta



**Ineu:** Ha funcionat! L'aigua és neta...


### fontSJ


*Si: herbes === 3*

**Ineu:** Ha funcionat! L'aigua de la pica torna a ser clara com el vidre.

★ Has obtingut l'AIGUA DE LA FONT DEL BISBE.


*Altrament (per defecte):*

**Ineu:** Les Venerables Sàvies diuen que la nit de Sant Joan aquesta aigua guaria. Ara està morta... Hi ha unes lletres gravades a la pica: «Herba de Sant Joan, rialla i el fruit de l'arbre d'or.»

**Ineu:** Rialla... Això no és cap rialla de riure: és una PLANTA! Les Venerables Sàvies parlaven d'una flor que creix envoltada de bolets verinosos, al Bosc del Pi dels Tres Cants.

**Ineu:** L'herba de Sant Joan fa llum, sempre en una clariana: en deu haver-n'hi per aquí, en aquest mateix bosc. I l'arbre d'or... és la Prunera Màgica, al jardí de l'Hostatgeria! Una pruna.


### alzinaBuida


*Si: té aigua_sj*

**Ineu:** Duc aigua de la Font del Bisbe. Potser...

**Veu del bosc:** ...Qui ens porta... l'aigua... bona... Passa, passa, fill... Només la Joaneta... sap on acabes.


*Altrament (per defecte):*

**Ineu:** Sento una veu allà dins... «Aigua... aigua de la Font del Bisbe...» Potser necessito l'aigua de la font d'aquí a prop.


### cartellBosc



**Cartell:** Bosc de Sant Joan.
«Qui busca la font, que segueixi l'aigua... i qui no, que no es perdi.»


### cartellCirosa


*Si: camiCirosaObert*

**Cartell:** ↑ La Cirosa (camí llarg, tot el camí amunt)
← La Caseta
↓ Les Cel·les


*Si: NO camiCirosaObert*

**Cartell:** ↑ La Cirosa
← La Caseta


### cotxer


*Si: id === 'era' i epilegFet i NO carruatgeObert*

**Follet del Carro Verd:** La boira se n'ha anat del tot, monjo. Abans de tornar a la carretera, deixa'm obrir la gàbia del darrere.

**Follet del Carro Verd:** Hi porto els ocells que l'Ocellaire va tancar fa segles. Els meus avis els van recollir i els hem guardat de pare a fill, perquè amb la boira no volien cantar.

**Follet del Carro Verd:** Ja poden cantar. Gràcies per tornar-los el cant.


*Si: NO E.flag('parada_' + id ; conegudes*

**Follet del Carro Verd:** Mira qui hi ha! Ara ja saps que també paro aquí. Recorda: només puc parar allà on ja ens hàgim trobat.


*Si: NO E.flag('parada_' + id ; NO conegudes*

**Follet del Carro Verd:** Eh, monjo! Aquest trasto me'l va fer el Galf: va amb vapor i no es cansa mai. Si has d'anar lluny, puja. Això sí: només paro allà on ja m'hagis trobat.


*Altrament (per defecte):*

**Follet del Carro Verd:** De moment només conec aquest lloc, monjo. Quan em trobis en un altre, t'hi portaré.

**Follet del Carro Verd:** On anem? Recorda que només puc parar allà on ja ens hàgim trobat.


### columna


*Si: E.flag('col' + n*

**Ineu:** Columna ${n} de 12: ${signe} vol dir «${paraula}». Ja ho tenia apuntat (${total()}/12).


*Si: NO E.flag('col' + n*

**Ineu:** Columna ${n} de 12. Sota el signe ${signe}, amb lletra petita: «${paraula}». Ho apunto (${total() + 1}/12).


### cartellCami



**Cartell:** Camí de la Desaparició.
"Qui segueix els passos, no torna sol."


### taulaPedra



**Inscripció:** Taula de pedra ${part} de 2:

${mots.join('   ')}


*Si: totes ; missatgeDesxifrat*

**Ineu:** Quan la boira cobreixi el Miracle, els passos dels absents tornaran amb l'alba.


*Si: totes ; NO missatgeDesxifrat*

**Ineu:** Ja ho tinc sencer. Això són paraules per dir en veu alta... davant l'altar.


*Si: altrament*

**Ineu:** Només entenc les paraules que he apuntat al camí. Els signes que em falten... són a les columnes.


### altarErmita



**Ineu:** «Quan la boira cobreixi el Miracle, els passos dels absents tornaran amb l'alba.»


### cofreAltar



★ Has obtingut la CLAU DEL SAGRARI.

**Ineu:** La clau del sagrari del Santuari! Els monjos la van deixar aquí. Amb això obriré el sagrari del retaule.


### sortidaErmita



**Cartell:** ← L'Era
→ Camí de la Desaparició


### creuDesaparicio



**Inscripció:** «Dotze paraules guarda el camí. Qui les escolti, trobarà el nom dels que callen.»


### galf


*Si: telescopi*

**Galf:** Mira bé les estrelles amb el telescopi, noi. Els Dipòsits són el millor mirador de la comarca... quan hi puguis arribar.


*Si: cristallGel*

**Galf:** Un cristall de gel de debò! Fa anys que en buscava un. Dóna'm una estona.

**Galf:** Un telescopi! Amb això veuràs coses que cap monjo no ha vist. Perquè no se't perdi: les estrelles fan camí.

★ Has obtingut el TELESCOPI DEL GALF.


*Si: NO garfBancSegut*

**Galf:** Mmm? Ah, un monjo! Seu, seu al banc de davant, que per xerrar s'hi està millor.


*Altrament (per defecte):*

**Galf:** Torna quan tinguis el cristall de gel, noi. L'ermita de Sant Gabriel s'obre amb la clau que t'he donat.

**Galf:** Així sí. Soc el Galf, inventor. Visc a la cel·la de Sant Antoni, però vinc aquí cada dia: és l'únic racó on cap teulada no em tapa el cel. Tinc idees que ni jo entenc.

**Galf:** Si em portes un cristall de gel, et construiré un telescopi per mirar el cel. N'hi ha un a l'ermita de Sant Gabriel.

**Galf:** Però l'ermita és tancada, i la clau la guardo jo des que el sagristà va marxar. Té: no te la deixis perdre.

★ Has obtingut la CLAU DE SANT GABRIEL.

**Galf:** Des del telescopi es veu tot el poble, i aquesta nit no hi ha ni un fil de boira.


### cartellEra



**Cartell:** ↑ Ermita de la Desaparició
→ Hostatgeria
← Rovellonera


### isilderBase


*Si: soparObert i NO floresIsilder*

**Isílder:** Sopar del Til·ler, eh? La gent només pensa en el menjar i s'obliden de les flors. Jo hi fico flors des que era jove.

**Isílder:** Les flors de lluna són pels que falten. Posa-les al mig de la taula; jo també vindré a seure-hi.

★ Has obtingut les FLORS D'ISÍLDER.


*Si: mongesTrobades i NO isilderSap*

**Isílder:** He sentit com s'obria la porta de l'Hostatgeria. Són elles, oi? La Dolora, la Pilària, la Carmèlia... les sacerdotesses de la nostra casa.

**Isílder:** Tres nits tancades a vint passes de mi, i jo aquí amb les flors, sense saber-ne res. La seva pregària sempre ha mantingut la pau a aquesta terra.

**Isílder:** I el Sardi... el meu fill Sardi. Té set anys, monjo. Cada tarda s'enfilava a la prunera i es manxava de prunes fins a no poder dir ni mu. Si el trobes, digues-li que el seu pare no ha deixat de regar la prunera.


*Si: llosaOberta*

**Isílder:** La flor de lluna ja ha florit sobre la llosa. No deixaré de cuidar-la.


*Si: té llavorLluna*

**Ineu:** Isílder, mira què duc. La Rosansa me l'ha donada: diu que és una Llavor de Lluna.

**Isílder:** Una Llavor de Lluna! Fa trenta anys que no en veia cap. Floreix de nit, amb la llum de la lluna, i només si la planta algú que no ha perdut l'esperança.

**Isílder:** El meu Sardi s'asseia aquí a esperar que s'obrissin, i deia que les flors de lluna canten quan floreixen. Deixa-me-la, monjo: encara sé cavar un clot. I mira bé.

**Isílder:** La llosa s'ha apartat... Sota hi ha el camí que els monjos feien servir per portar menjar a les cel·les del soterrani de la casa. Fa segles que ningú no el trepitja.

**Isílder:** Baixa-hi amb compte, fill. I si trobes el meu Sardi... digue-li que les flors de lluna han tornat a obrir-se.


*Altrament (per defecte):*

**Isílder:** Bon dia, monjo! Aquesta pèrgola de pedra és més vella que el monestir: les columnes, els arcs... i l'Hostatgeria, aquí al costat, que s'hi aguanta al darrere.

**Isílder:** Portes l'espasa dels monjos, oi? Doncs mira aquesta llosa: aquest jardí en amaga una que ningú no ha aixecat mai. Els vells diuen que només s'obre amb una flor de lluna, i que sota hi ha el camí dels monjos fins al soterrani de la casa.

**Isílder:** De llavors de lluna ja no en queden. Però la Rosansa, la venedora de verdures, ha tornat a passar per les cel·les, i fa anys que porta al carro una llavor estranya que ningú no sap què és. Pregunta-li.

**Isílder:** No et sorprenguis si em veus aquí cada dia, ni amb pluja. Aquest jardí, el Sardi el cuidava molt. Des que la boira se'l va endur, el cuido jo perquè, quan torni, ho trobi tot tal com ho va deixar.


### rosansa



**Rosansa:** Verdures fresques, fruita de la rodalia! Cebes, raves, cols... Què et poso, monjo?

**Ineu:** Res de menjar, gràcies. Busco una llavor: la d'una flor de lluna, per a la llosa del jardí de l'Hostatgeria.

**Rosansa:** Una flor de lluna? Mmm... Fa anys que porto una llavor estranya al fons del carro, entre les cebes. Ningú no sap què és, ni jo.

**Rosansa:** Tingues, és teva. Que floreixi a qui sàpiga cuidar-la.

★ Has obtingut la LLAVOR DE LLUNA.

**Rosansa:** Ara me n'he d'anar, que avui encara em queden tres pobles per davant. Adéu, monjo!


### llosaJardi


*Si: té llavorLluna*

**Ineu:** Una llosa de pedra amb una creu gravada. La Llavor de Lluna voldria terra aquí vora, però cal algú que conegui el jardí: l'Isílder.


*Si: NO té llavorLluna → isilderRosansa*

**Ineu:** Una llosa de pedra amb una creu gravada, ben encaixada a terra. Cal la llavor d'una flor de lluna: la venedora de verdures en deu tenir.


*Si: NO té llavorLluna → NO isilderRosansa*

**Ineu:** Una llosa de pedra amb una creu gravada, ben encaixada a terra. No es mou ni un pam.


### prunera



**Isílder:** No te'n facis un fart, monjo! Són prunes daurades, màgiques: una sola et deixa com nou. El meu Sardi en menjava deu cada tarda i no n'hi tenia mai prou...

★ Has obtingut una PRUNA DAURADA.


### hostatgeria



**Carmèlia:** Entra, fill: aquesta casa torna a ser teva.

**Ineu:** La porta està tancada per dins.


### taulaRefetor



**Ineu:** Un àngel de pedra massís barra la porta del mig. Amb els Guants de Poder el podré empènyer: només cal posar-me a un costat i fer força contra ell.

**Ineu:** Un àngel de pedra massís barra la porta del mig. Des de l'altra banda, una veu fina i enrabiada colpeja la fusta.

**Ineu:** No el puc moure amb les mans soles. Ni dues persones... Necessito molta més força.


### dolora



**Ineu:** Una música lleugera, de tres notes, potser la desperta.


*Si: NO premiDolora*

**Dolora:** Oh, jove monjo! Quin cant més bonic... fa seixanta anys que no el sentia així. Jo sóc la Dolora.

**Dolora:** La boira va entrar pel soterrani fa tres nits. Vaig veure un germà amb hàbit que xiulava com els ocells i s'enduia el Sardi dins la boira, rient baixet.

**Dolora:** Si passes pel jardí, saluda l'Isílder, el jardiner d'aquesta casa. Un bon home, amb el cor malmès des que van desaparèixer les criatures.


*Si: NO premiDolora ; té runna*

**Dolora:** La Carmèlia, la nostra gran sacerdotessa, és tancada a la capella del fons. Uns esbarzers negres li tapen la porta: d'aquests que no els talla ni la falç. Diuen que només cedeixen davant d'una espasa de llum. Aquesta espasa que portes, fill, brilla com la que diuen. Prova-ho.


*Si: NO premiDolora ; NO té runna*

**Dolora:** La Carmèlia, la nostra gran sacerdotessa, és tancada a la capella del fons. Uns esbarzers negres li tapen la porta: d'aquests que no els talla ni la falç. Diuen que només cedeixen davant d'una espasa de llum.


*Si: NO premiDolora*

**Dolora:** Vés amb compte, fill. Entre les tres germanes guardem l'Empara d'aquesta casa. Quan siguem lliures les tres, serà teva.


*Altrament (per defecte):*

**Dolora:** Vés amb Déu, fill. La cadira em fa mal als ossos, però encara tinc bones orelles.


### pilaria


*Si: NO premiPilaria*

**Pilària:** Per fi! Tres nits que colpejo aquesta porta! Soc la Pilària, i no, no m'he estat quieta ni un minut.

**Pilària:** T'ho dic perquè ho vaig veure: el Germà Aldreu, aquell pesat que sempre anava jugant amb els nens, abans que la boira ens tanqués, anava moltes nits a la Porta de les Gírgoles, a l'est del Celler, i la porta se li obria sola, com si la boira l'obeís. Mai no li he cregut el somriure.

**Pilària:** Tots aquests nens innocents segrestats per aquesta maleïda boira... Troba'ls, monjo! Salva'ls a tots!

**Pilària:** Gràcies pel teu coratge! Que no se t'acabin les forces!


*Altrament (per defecte):*

**Pilària:** Si necessites algú que miri amb els ulls ben oberts, ja saps on trobar-me.


### carmelia


*Si: NO premiCarmelia*

**Carmèlia:** Benvingut, fill de Déu. Sóc la Carmèlia, la gran sacerdotessa d'aquesta casa. Havíem perdut l'esperança, però no la pregària.

**Carmèlia:** Els infants d'aquesta terra han estat arrossegats a la foscor d'un avenc profund. La nit que la boira ens va tancar a les cambres, els seus llits van quedar buits. Salva'ls, fill: porta a casa tots els nens segrestats.


*Si: NO premiCarmelia ; cantMiracle*

**Carmèlia:** Als llibres d'aquesta casa he llegit que l'Ocellaire va robar el cant dels ocells, i que només aquest mateix cant obre la seva gàbia. El que has après amb la Pianista, fill, és el que ell va robar. No el deixis anar.


*Si: NO premiCarmelia ; NO cantMiracle*

**Carmèlia:** Als llibres d'aquesta casa he llegit que l'Ocellaire va robar el cant dels ocells, i que només aquest mateix cant obre la seva gàbia. Tu l'aprendràs: la Pianista el recorda.


*Si: NO premiCarmelia*

**Carmèlia:** Que la paciència t'acompanyi, fill.


*Altrament (per defecte):*

**Carmèlia:** Que la llum del Miracle t'acompanyi, fill.


### cofreMonges



**Nota:** «Per a qui ha tornat la llum a aquesta casa. Al fons de les Gírgoles, abans d'arribar a la gàbia, hi ha una boira que crema: la nostra empara l'esvairà al teu pas.» — Dolora, Pilària i Carmèlia

★ Has obtingut l'EMPARA FRATERNAL: et protegeix de la boira verinosa que barra el camí de la Sala de la Gàbia.


### pastorA



**Pastor:** M'han assegut a taula... M'han passat el pa. Fa cinquanta anys que ningú no em passava el pa.

**Pastor:** El ramat és de nou al corral. No sé com agrair-t'ho, monjo. Nosaltres només volem una mica de pau, i un racó on no ens miri ningú malament.

**Pastor:** No s'acosti gaire, pare, que la gent diu que portem mala sort. Només tenim el ramat... i el Germà Aldreu, aquell monjo pesat que sempre jugava amb els nens, ens l'ha pres. Ara es fa dir el Pastor de Boira.


### pastorB



**Pastora:** Hi havia flors a la taula. Feia tant de temps que no veia flors a una taula.

**Pastora:** Teníem terres a la plana, i pous, i una casa amb llar de foc. Ho vam perdre tot, i el poble ens va girar l'esquena. Aquí dalt, almenys, no ens esquiven.

**Pastora:** No fem mal a ningú. Només intentem refer el que ens queda.


### pastorVell


*Si: NO pastorVencut*

**Pastor vell:** Fill, el Germà Aldreu feia bona cara, però això ja ho portava dins. L'Ocellaire, l'Home de la Gàbia, només li va prometre que tothom el seguiria, i ell se'l va creure.

**Pastor vell:** I no només les ovelles. Fa unes nits el vam veure baixar cap al poble amb un nen adormit als braços. Els nens que falten, fill, se'ls ha endut ell.

**Pastor vell:** Els nostres avis van tancar aquella gàbia sota terra fa segles, i el poble ens va pagar amb oblit.

**Pastor vell:** Si trobes la manera de treure-li aquesta cosa, ho agrairem. Hi ha unes esquelles que van ser dels nostres avis: te les donarem, però el ramat és a la pastura, i ell hi és.


*Si: NO té esquelles) { // (també si el senyal hi és però l'objecte no: es tornen a donar*

**Pastor vell:** Has tornat el ramat. El Germà Aldreu ha baixat camí avall rient: encara porta la boira a dins, pobre home. Que Déu t'ho pagui, monjo.

**Pastor vell:** Aquí tens les esquelles dels nostres avis. Que sonin amb la teva tarota, i que els cants antics et guiïn.

★ Has obtingut les ESQUELLES DELS PASTORS!


*Si: soparFet*

**Pastor vell:** Vam plorar a taula, monjo. Vam plorar com nens. Que l'arbre us beneeixi a tots, també als que no tenim nom.


*Si: soparObert i NO pastorsConvencuts*

**Pastor vell:** Un sopar, dius? Al Til·ler? Amb els de les cel·les?... No, fill. Nosaltres no som gent per a asseure's amb la gent.

**Pastor vell:** Fa anys que no sentim música vora el foc, ni pastem el pa que fèiem per a les festes. Si algú en toqués... potser ens recordaria que encara som persones.

**Ineu:** Tinc la tarota. Les esquelles dels seus avis van afinar els cants antics... El Cant de Vespres, 3-1-2-1: el tocaré vora el foc, i que sigui el que Déu vulgui.

**Ineu:** Tinc la tarota, però només sé uns pocs cants. Els vells els coneixen tots: potser la Pianista, al Santuari, en sap algun que els faci recordar casa.


*Altrament (per defecte):*

**Pastor vell:** Aquesta pastura torna a ser un lloc tranquil. Gràcies per això.


### pastorsConvencuts



**Pastora:** Havia oblidat que existia això...

**Pastor vell:** Fa cinquanta anys que ningú no ens convidava enlloc, monjo. Ni a una missa, ni a una taula. I tu ens parles amb música.

**Pastor vell:** Mira: el forn encara és calent. Aquest pa el pastem nosaltres, amb aquestes mans, com abans. Porta'l al teu arbre. I vindrem: no direm gaire cosa, perquè no sabem com es fa, però el pa és el que sabem fer.

★ Has obtingut el PA DELS PASTORS.


### tillerSoparIntro



**El Gran Til·ler:** Has portat música al lloc on feia anys que no n'hi havia. Això em fa pensar en el sopar.

**El Gran Til·ler:** Un cop l'any, a la tardor, la gent de les cel·les s'asseu sota les meves branques i menja plegada. Ho anomeneu el sopar del Til·ler. Jo no menjo, però escolto. Tota la saviesa d'un arbre és escoltar la gent que menja junta.

**El Gran Til·ler:** Aquest any ningú no té ganes de taula: tres cadires buides, i el poble amb por. La boira s'alimenta de la solitud, petit monjo. I no val a mitges: la taula ha d'estar plena.

**El Gran Til·ler:** Fa tres-cents anys, quan van tancar la gàbia, els pastors de la Cirosa s'asseien aquí amb els monjos i els pelegrins. Després els van foragitar, i van oblidar que també eren de la casa. Que vingui el menjar de cada llar, també el seu. I que hi hagi flors.

**El Gran Til·ler:** Porta l'escudella de la Meus, les flors d'Isílder i el pa que els pastors de la Cirosa pasten amb les seves mans. Llavors, i només llavors, et donaré el meu permís.

**El Gran Til·ler:** Però els pastors no s'asseuran a taula només amb paraules: fa anys que no senten música vora el foc. Abans de tornar-hi, ves a veure la Pianista del Santuari: guarda un cant tan vell com ells.


### tillerSoparFalta



**El Gran Til·ler:** La taula encara no és plena, petit monjo. Menjar sol és només alimentar-se; per això hem de ser tots.


### tillerSoparPreparat



**El Gran Til·ler:** Ho has portat tot. Que es faci el sopar.


### tillerSoparRitual



**Meus:** Aquest any l'escudella té gust de poc, fill: hi falta l'alegria de tres nens. Que ens ho perdonin els tres, allà on siguin.

**Isílder:** He posat les flors de lluna al mig, com cada any. Aquest cop són per l'Huri, pel Fram... i pel meu Sardi.

**Les Venerables Sàvies:** Sempre fem el mateix, fill: una espelma per cada cadira buida a la taula. Enguany en són tres: l'Huri, el Fram i el Sardi. Encén-les tu: ets tu en qui tenim les nostres esperances posades.

**Pastor vell:** Fa molts anys que a nosaltres ningú no ens guardava cap cadira a cap taula. Gràcies per asseure'ns, fill.

**El Gran Til·ler:** Aquesta és la saviesa que et volia donar, petit monjo: ningú no es perd del tot mentre algú el recorda a taula. La gàbia de l'Ocellaire només s'omple de qui s'ha quedat sol.

**El Gran Til·ler:** Rep el meu permís. Que et sigui lleu, i que no et faci oblidar mai que vas menjar amb tots.

**El Gran Til·ler:** Entre les meves branques hi custodio, des de temps immemorials, un medalló de pedra amb una fulla tallada: el permís de l'arbre. Fa segles que espera algú que s'assegui a taula amb tothom. Agafa'l.

★ Has obtingut el MEDALLÓ DE L'ARBRE!


### aldreuPastor



**Aldreu, Pastor de Boira:** Ineu!

**Ineu:** Germà Aldreu?!

**Aldreu, Pastor de Boira:** L'Aldreu era un monjo que ningú no mirava. Ara sóc el Pastor de Boira. Mira'ls, com em segueixen. Ningú no m'havia seguit mai.

**Aldreu, Pastor de Boira:** Des que va pujar la boira, una veu em parla dins el cap, baixeta, només per a mi. Ella em va veure quan ningú més no ho feia. És la veu del Mestre.

**Ineu:** Una veu dins el teu cap... Aldreu, és la de l'Home de la Gàbia. L'Ocellaire parla per la teva boca.

**Aldreu, Pastor de Boira:** L'Home de la Gàbia, sí! El Mestre m'ho va prometre: «Tots els que tinguin por et seguiran.» Jo no el trobo a faltar: l'admiro. I ara sóc el seu pastor. El PASTOR!

**Ineu:** On són l'Huri, el Fram i el Sardi?

**Aldreu, Pastor de Boira:** Dormen. Els vaig portar jo al Mestre, un per un, de nit. Allà dins ja no tenen por de res.

**Ineu:** Aldreu, això que et parla no és bo. Encara pots tornar enrere.

**Aldreu, Pastor de Boira:** Tornar enrere? Mai! El Mestre em va veure, quan ningú més no ho feia. Calla! Be-e-e!


### aldreuDerrotat



**Aldreu, Pastor de Boira:** Has guanyat aquesta, monjo... Fa trenta anys que ningú no em mirava, i ell sí. Mai no li fallaré.

**Aldreu, Pastor de Boira:** El Mestre és al fons de les Gírgoles, i ja és despert: la seva veu em crida des d'allà baix i no calla mai. Vine, si goses: els nens ja són seus, i jo només sóc el primer dels seus ocells.

**Aldreu, Pastor de Boira:** Je, je, je... Ens veurem allà baix, monjo.

**Ineu:** («Al fons de les Gírgoles»... Ara ja sé on mirar.)

**Ineu:** (I el pastor vell em va prometre les esquelles dels seus avis. Aniré a veure'l vora el foc.)


### mandu


*Si: manduNinaTrencada*

**Mandu:** Mira la nina! El Fram li ha cosit el cap i diu que ara és una nina valenta. I jo ja no el deixo marxar enlloc!


*Si: NO manduNinaTrencada*

**Mandu:** El Fram ha tornat! Ja no he d'esperar sola davant la porta. Avui jugarem tot el dia!


*Altrament (per defecte):*

**Mandu:** No la toquis, eh? Li he arrencat el cap perquè estava enfadada, i només el Fram sap cosir-lo.

**Mandu:** La nina espera. Jo també espero.

**Mandu:** Zuuum! La nina vola per sobre dels núvols... i aterra a la lluna! Ui... un monjo.

**Ineu:** Hola. Jo sóc l'Ineu. Com et dius?

**Mandu:** Mandu. I ella és la nina. Sempre juguem aquí, davant la porta, esperant el Fram.

**Ineu:** El Fram és el teu germà?

**Mandu:** Sí. Dormíem a la mateixa habitació. Una nit em vaig adormir amb ell al costat, i al matí el seu llit era buit. Sempre em diu on va, i aquesta vegada...

**Mandu:** La Meus diu que la boira se l'ha endut. Però jo li vaig dir que no se n'anés! Li ho vaig dir! I ell se n'ha anat igualment! PER QUÈ NO TORNA?!

**Mandu:** Ja n'hi ha prou! LI HE ARRENCAT EL CAP A LA NINA! I m'és igual: així el Fram haurà de tornar per cosir-lo!

**Ineu:** Tranquil·la, Mandu. Deixa'm veure-la: potser el puc cosir.

**Mandu:** No! No la toquis! Només el Fram sap cosir caps de nina: ell m'arregla tot el que es trenca.

**Ineu:** Doncs el trobaré i te'l portaré. I et cosirà la nina.

**Mandu:** ...Promès?

**Ineu:** Promès.


### nenaTrenes


*Si: NO nenaVista*

**Nena de les Trenes:** No fugis, si us plau. Tothom que em veu surt corrent. Només voldria parlar amb algú.

**Nena de les Trenes:** Vaig venir a collir rovellons amb la mare. Ella sempre deia: «On hi ha rovellons, hi ha pins; on hi ha pins, hi ha camí.» Però jo només mirava els rovellons, i em vaig oblidar del camí.

**Nena de les Trenes:** La mare m'havia lligat les trenes amb dos llaços rosa. Quan em vaig adonar que m'havia perdut, vaig córrer, i els llaços van caure pel bosc. Fa molts, molts anys d'això.

**Nena de les Trenes:** Un el vaig perdre pel camí de la Rovellonera, i l'altre a la primera clariana. Sense ells no puc sentir les mans de la mare. Si me'ls portessis...

**Ineu:** Els trobaré. No et quedaràs sola, t'ho prometo.


*Altrament (per defecte):*

**Nena de les Trenes:** Els tens... els dos? Oh, monjo...

**Nena de les Trenes:** Els sento... són les mans de la mare lligant-me'ls. Mare...? Mare, ets tu? M'has trobat?

**Nena de les Trenes:** Ja no tinc por. Gràcies, monjo. Et deixo un dels llaços: guarda'l, que protegeix els qui es perden.

★ Has obtingut el LLAÇ DE LA NENA.

**Nena de les Trenes:** La mare me'l va lligar perquè res de dolent no em fes mal. Ara et servirà a tu: cada vegada que entris a un lloc nou, el llaç aguantarà el primer cop que rebis, i no et farà mal.

**Nena de les Trenes:** Només aguanta un cop per lloc. Quan surtis i tornis a entrar en un altre, el llaç es renova.


### llac



★ Has trobat un llaç de la nena (


### cofreGabriel



**Ineu:** Un cofre petit, tan fred que em fa mal a les mans. El pany és ple de gel i cedeix en tocar-lo. A la tapa hi ha gravat: «La rosada de l'alba no es fon ni a l'estiu.»

★ Has obtingut el CRISTALL DE GEL.


### telescopiMon


*Si: estelsFets*

**Ineu:** L'últim estel s'ha apagat damunt del dipòsit de llevant. Hi ha una llum a l'aigua: he d'anar-hi.


*Si: NO té telescopi*

**Ineu:** (Un peu amb tres potes, plantat al mig del mirador. Sembla fet per aguantar alguna cosa... com una mena de trípode.)


*Si: NO té telescopi ; garfBancSegut*

**Ineu:** (Potser el telescopi del qual m'ha parlat el Galf encaixaria aquí. Cal que me'l construeixi.)


*Si: NO té telescopi ; NO garfBancSegut*

**Ineu:** (Algú que entengui d'enginys sabria dir per a què serveix. El Galf, l'inventor de l'Era, potser en sap alguna cosa.)


*Altrament (per defecte):*

**Ineu:** Diuen que per Sant Llorenç el cel plora. Compta les llàgrimes... i potser et mostraran alguna cosa.


### estelDiposit



★ Has obtingut l'ESTEL DE SANT LLORENÇ.

**Ineu:** Fa la mateixa claror que els set estels... Diuen que la boira no gosa tocar la llum de Sant Llorenç. El camí del Dolmen, a llevant, n'és ple.


### boiraDolmen



**Ineu:** Aquí no s'hi veu res. Em caldria una llum que la boira no pogués apagar...


### dolmenBaix



**Ineu:** (Runna és dalt de la llosa. Potser s'hi pot pujar per darrere.)


### placaDolmen



**Placa:** Només podrà alçar Runna qui posseeixi el permís de l'arbre sagrat, les paraules del saber i la benedicció divina.

**Ineu:** (El medalló [text calculat pel joc: nom]. [text calculat pel joc: text])


*Si: NO totsPlacats i portats.length ; aviat === 1*

**Ineu:** (Encara em falta un medalló per omplir la placa.)


*Si: NO totsPlacats i portats.length ; NO aviat === 1*

**Ineu:** (Encara em falta [text calculat pel joc: aviat] medallons per omplir la placa.)


*Si: té runna o runna*

**Ineu:** (Els tres medallons continuen al seu lloc, a la placa. L'espasa ja és meva: Runna.)


*Si: placaCompleta*

**Ineu:** (Els tres medallons són al seu lloc. Només em falta alçar l'espasa.)


*Si: altrament*

**Ineu:** (El permís de l'arbre sagrat... les paraules del saber... la benedicció divina. Què voldrà dir tot això? El Pare Alcoví deu saber-ho: ho tindrà escrit a la Crònica.)

**Ineu:** (Tres cercles buits: un per a cada medalló. Em falta: ,  […].)


### portaReixa



**Ineu:** Fa generacions que ningú no obre això. Haurà d'haver-hi una altra manera d'entrar-hi.


### reixaDins



**Ineu:** (La barra fora: ara puc entrar i sortir per la plaça.)


### cofreCambra



★ Has obtingut el PERGAMÍ DEL MONJO.

**Ineu:** «La clau de ferro és sota l'escala, murada amb els meus germans. Un guardià de pedra la vigila d'esquena: ningú no hi baixa fins que no et mira a la cara.»

**Ineu:** I al revers, amb una altra lletra: «Qui busqui sortida, que trenqui la bóta marcada amb la creu.»


### botaTresor



**Ineu:** (Una bóta amb una creu vermella. Sona buida, i la fusta és fina... Amb un cop d'arma es trencaria.)


### homeRaimInt



**Ineu:** Mira cap amunt i de costat, com si vigilés el balcó de sobre l'escala. Sembla que guardi alguna cosa.


### joaneta


*Si: NO joanetaVista*

**La Joaneta:** Ei! Tu! Qui coi t'ha dit que podies entrar? Els frares no veniu mai per aquí! Fot el camp o et faig créixer bolets a les orelles!

**Ineu:** Perdoni... He arribat per l'alzina. Duc aigua de la Font del Bisbe.

**La Joaneta:** Aigua... de la Font del Bisbe?! Dona'm aixòooo! Fa trenta anys que no en tinc ni una gota neta.

**La Joaneta:** Mmm... collonut. Ets tonto, xaval, però ets bo. Els ocells i les guineus xerren, i jo ho sento tot: busques el Gran Til·ler, oi? No és al nord de sempre, com et diuen: és al nord de les Cel·les, i han tapat el camí amb una boira que no marxa amb el vent.

**La Joaneta:** Mira, he barrejat l'aigua que queda amb rialla, herba de Sant Joan i una mica de pruna daurada. Aquest beuratge fa fugir la boira dolenta. No te'l beguis, eh! Aboca'l sobre la boira i prou, que si no et sortiran bolets.

★ Has obtingut el BEURATGE DE LA JAUNETA.


*Altrament (per defecte):*

**La Joaneta:** Ja tornes, xaval? Els ocells m'ho diuen tot. Escolta: [text calculat pel joc: pista]

**La Joaneta:** Ara fot el camp, que tinc feina amb la sopa. I no li diguis a ningú on visc, o et converteixo en bolet.

**La Joaneta:** L'olla ja no fa bombolles liles. Ara fa olor de farigola, com ha de ser.


### boiraTiller



**Ineu:** Provaré amb el beuratge de la Joaneta.

**Ineu:** Ha funcionat! El camí del Gran Til·ler torna a ser net.

**Ineu:** No hi puc passar. Aquesta boira no és de les que marxen amb el vent: per desfer-la em caldria algun líquid, una poció... alguna cosa que no tinc.


### arrelsTiller


*Si: NO té basto_tiller*

**Ineu:** Són les arrels del Gran Til·ler. El bastó de pelegrí no les mourà... però potser reconeixerien una branca del mateix arbre.


*Si: NO bassadoriaNeta*

**Ineu:** Les arrels s'han estremit en reconèixer la branca, però no s'enfonsen. Sembla que esperen alguna cosa: potser que l'aigua clara de la Bassadòria torni a respirar.


### cofreManeta


*Si: NO georgiManeta*

**Ineu:** No és meva... Millor preguntar a en Georgi abans d'agafar-la.


*Altrament (per defecte):*

★ Has obtingut la MANETA D'ENGRANATGE.


### tombaMonjos



**Ineu:** «Aquí reposen els qui van tancar la porta.»


### creuCementiri



**Ineu:** «Els monjos del Miracle, d'ara i d'abans.»


*Si: té ram*

**Ineu:** Aquest ram és del Germà Francí, per als monjos que dormen aquí. El deixo als peus de l'àngel.

**Ineu:** (Els pètals tremolen, com si algú respirés a prop. L'àngel, que mirava a terra, alça la cara al cel i somriu: ja no plora sol.)

**Ineu:** El Germà Francí es posarà content. Va dir que, en tornar, tindria alguna cosa per a mi a Sant Antoni.

★ Has deixat el RAM DE FLORS als peus de l'àngel.


### lapida



**Làpida:** [text calculat pel joc: mots[n % mots.length]]


### molner



**Senyor Molner:** Des que han tornat els nens, la Meus canta mentre renta. Desafina, però canta.

**Senyor Molner:** No li diguis que t'ho he dit.


### dolora



**Dolora:** El Sardi ja torna a robar galetes del rebost. Senyal que està bé del tot.


### pilaria



**Pilària:** Hem posat una espelma per tu a cada cambra, Ineu. I una altra per si de cas.


### carmelia



**Carmèlia:** Les tres te'n devem una. I nosaltres sempre paguem els deutes... amb pastissos.


### isilder



**Isílder:** Les flors de lluna ja s'obren de dia. Diria que és el riure dels nens, que les enganya.


### germa_franci



**Germà Francí:** La tomba de l'àngel té flors noves cada dia. No sóc jo qui les hi porta... i no em preguntis qui.


### eve



**Eve:** El Sardi ja torna a berenar aquí cada tarda. La Càren encara dorm, però ronca més contenta.


### pastor_vell



**Pastor vell:** Les ovelles tornen a ser blanques. Alguna encara té les orelles una mica liles, però ja li passarà.



## Escena bosc_pi


### piOest



**Ineu:** (Unes branques molt baixes, i gruixudes com troncs, baixen fins a terra i barren el camí. Per aquí no hi ha manera de passar.)

**Ineu:** (Totes miren cap a llevant, cap on neix l'alba, i al fons es veu una clariana amb un pi enorme. Si el pi escolta algú, ha de ser pel cantó d'allà. Hauré d'arribar-hi per l'altre costat: per Sant Antoni, potser.)


### piPlaca



**Ineu:** (Davant el pi, una pedra de fita baixa, gastada i coberta de molsa. Hi ha gravat un pi de tres soques i, a sota, tres notes.)

**La placa:** Tres branques té el vell pi,
tres cants li cal sentir.
Un cant per cada branca:
sols així s'obrirà el camí.

**Ineu:** (Un cant per cada branca... Em falta aprendre'n algun amb la Pianista abans de poder-ho provar.)


*Si: n > 0*

**Ineu:** ([text calculat pel joc: n] de les tres branques ja brillen. Falta que cantin les altres.)


*Si: NO n > 0*

**Ineu:** (Tres cants, tres branques. Ho provaré amb la tarota, aquí mateix.)


*Altrament (per defecte):*

**Ineu:** (Necessitaré la tarota per respondre-li.)


### piTresCants


*Si: piObert i NO té carta_cortiner) { // (partides que ja havien obert el pi abans de la carta: encara la poden trobar*

**Ineu:** (Entre dues arrels del tronc hi ha un plec de paper, guardat com un tresor.)


*Altrament (per defecte):*

**Ineu:** (Els ocells piulen entre les branques i el pi es mou una mica, com si respirés. Sembla content.)

**Ineu:** (Un pi vell, amb tres soques que s'obren com tres braços. Sembla que escolta.)


### piHistoria



★ Has trobat la CARTA DEL CORTINER.

**Carta del Cortiner:** «A qui sigui que torni a sentir aquest pi respirar:

Abans de la boira, els ocells dormien en els pins d'aquest bosc. A l'alba cantaven tots alhora, i aquell cant feia viure la terra: el Cant del Miracle.»

**Carta del Cortiner:** «Un home sol, l'Ocellaire, el va voler per a ell. Va tancar els ocells en una gàbia i se'n va endur el cant. I amb el cant se'n va anar l'alba, i va començar la boira.»

**Carta del Cortiner:** «Hi havia dos cants més, germans d'aquell: el de l'Aurora, que fa fugir la boira, i el de Vespres, que la terra escolta. Van tenir por que també se'ls emportés, i van venir a amagar-se aquí, a les branques d'aquest pi: un a cada una. Muts, com un nen que guarda un secret.»

**Carta del Cortiner:** «Una tarda, cansat, em vaig asseure sota seu. Els vaig escoltar i els vaig escriure en tres sons: un, dos i tres. Són els de la tarota. Cada nota és una de les branques.»

**Carta del Cortiner:** «El pi només deixa passar qui porta els tres cants, perquè només qui els porta els pot tornar als ocells. Quan la boira se'n vagi del tot, que els qui guarden els ocells robats vinguin aquí. Aquest bosc és casa seva.

— El Cortiner»

**Ineu:** (Les arrels s'han enfonsat a terra com un respir llarg, i els ocells han tornat a les branques. El camí d'aquí al Dolmen ha quedat lliure.)



## Escena cami


### construir



**Cartell:** L'Hostatgeria
→ La Taverna
← L'Era

**Cartell:** ← L'Hostatgeria i l'Era
→ Els arcs de la Casa Gran



## Escena casa


### homeRaimInt



**Ineu:** L'estàtua té el cap completament girat d'esquena, mirant la paret. A la base del pedestal hi ha un volant de ferro amb engranatges, però li falta la maneta per poder-lo fer girar.


### raimDesperta



**Home del Raïm:** La boira... m'ha despertat. Tants anys mirant la paret, i ara em deixen anar. Algú ho pagarà.

**Ineu:** S'ha mogut! La boira lila li ha donat vida!

**Home del Raïm:** Vols la cripta? Ni tu ni cap altre no hi passareu. Us esclafaré com raïms.


### raimSenseArma



**Ineu:** Si això desperta el guardià de pedra, no podré resistir la seva maça amb les mans nues. Caldrà tornar amb una arma.


### raimDerrotat



**Home del Raïm:** La boira se'n va... torno a sentir la pedra. Així acaba: segles guardant el que ells no van tenir ganes de mirar.

**Home del Raïm:** Ells em van deixar aquí, i el teu Home de la Gàbia m'ha despertat només perquè em matessin.

**Home del Raïm:** Baixa, si vols. Allà sota ningú no et perdonarà, com ningú no em va perdonar a mi.

**Home del Raïm:** Torno al pedestal. És l'únic que em van deixar.

*(Fase 2, al quadre de diàleg:)* Aquesta boira em crida... vol que us esclafi a tots. Que així sigui.

*(Quan és a punt de caure, al quadre de diàleg:)* Em van deixar aquí... i ara tu vens a acabar la feina.


### cofreCripta



★ Has obtingut la CLAU DE FERRO.


### georgiCaseta


*Si: té maneta o maneta*

**Georgi:** Fes-ne bon ús, monjo! I vigila, que les coses de pedra no sempre s'estan quietes.


*Si: NO raimVolantVist*

**Georgi:** Ei, monjo! Sóc en Georgi de la Caseta. Conec cada drecera del Miracle, i les eines, encara millor.

**Ineu:** M'anirà bé saber-ho. De moment només passava a saludar.

**Georgi:** Doncs ja saps on trobar-me si algun dia et cal un cop de mà.


*Si: georgiManeta*

**Georgi:** La caseta és aquí al costat: puja per l'escala. Al cofre de les meves joguines, la maneta és a sota. Que no se't cansi el braç!


*Altrament (per defecte):*

**Georgi:** Ei, monjo! Sóc en Georgi de la Caseta. Conec cada drecera del Miracle, i les eines, encara millor.

**Ineu:** Georgi, em diuen que en saps, d'eines. Hi ha un volant de ferro vell que no té maneta, i sense no hi ha manera de fer-lo girar.

**Georgi:** Una maneta! En tinc una de ferro, de les bones. Encaixa en rodes de pou, en premses... i, si cal, en el volant d'una estàtua tossuda.

**Georgi:** Però la vaig amagar dalt de la meva caseta, la que està aixecada sobre pals, al cofre de les meves joguines. Ningú no s'atreveix a tocar-les, perquè jo no deixo que ningú hi posi les mans. MAI! MAI!

**Georgi:** Però tu vens per una cosa seriosa, així que per aquesta vegada et deixo. Puja per l'escala, que la porta no té clau, i agafa-la.


### mecanismePorta


*Si: botaAlcada*

**Ineu:** (La llosa no té pany ni maneta. La cadena de la politja hi està lligada: l'anella de terra la deu fer pujar.)


*Si: NO botaAlcada → cofreCambra*

**Ineu:** (Una llosa de pedra sense pany ni maneta. No cedeix gens. «Qui busqui sortida, que trenqui la bóta marcada amb la creu»...)


*Si: NO botaAlcada → NO cofreCambra*

**Ineu:** (Una llosa de pedra sense pany ni maneta. No cedeix gens: s'ha d'obrir d'una altra manera.)


### golfesRellotge



**Ineu:** El mecanisme és al bastidor de fusta de l'esquerra: tres engranatges a les posicions I, II i III. Cada cop que en toco un canvia de mida: petit, mitjà, gran.


### golfesNota



**Ineu:** «Nota del campaner. El rellotge només camina si els engranatges hi van en ordre: el petit primer, el gran al mig, i el mitjà darrere.»


### golfesReparat



**Ineu:** (Torna a caminar! Ara se sentirà per tot el poble.)



## Escena cela


### construir



**Ineu:** (Semblen els plànols d'una mena d'artefacte per mirar les estrelles.)



## Escena cementiri


### construir



**Cartell:** ← Les Runes
↓ El Monestir


### alAtacar



**Ineu:** (L'esquerda s'ha tancat i la boira ja no puja a la superfície. Els qui van tancar la porta tornen a descansar.)

**Ineu:** (Sense la boira que sortia d'aquí, la veu de l'Home de la Gàbia ja no arriba tan lluny, i les portes que ella obria soles ja no s'obriran. Però la boira que ja s'ha acumulat sota terra, a les Gírgoles, hi continua tancada.)



## Escena cirosa


### masiaTaula



**Ineu:** (Per als que no tenen nom. Algú se n'ha recordat.)


### masiaLlibre



**Llibre:** «L'Ocellaire baixava cada primavera amb els seus ocells engabiats. Els nens reien amb ells; després ja no reien amb res. Hi va haver anys de plors a les cases.»

**Llibre:** «Els pastors i els monjos el vam tancar dins la seva gàbia, sota terra, i un monjo va segellar la porta amb la llum de l'espasa. El poble va estar content tres dies. Després va voler algú a qui culpar, i ens va culpar a nosaltres.»

**Llibre:** «Que qui trobi això no ens oblidi: vam obrir els ulls abans que ningú. Només vam fer el que calia.»


### masiaEsquelles



**Ineu:** (El pastor vell les té. Li he de parlar vora el foc.)

**Ineu:** (Qui sap on són ara. Potser els pastors les guarden.)


### construir


*Si: cantPedres*

**Ineu:** (El foc crepita i els pastors callen. Un cant antic vora les brases, el de Vespres, els podria obrir el cor...)


*Si: NO cantPedres*

**Ineu:** (El foc crepita i els pastors callen. Una música antiga vora les brases els podria obrir el cor... Potser la Pianista, al Santuari, en coneix alguna.)



## Escena gabia


### girgolesInscripcio



**Inscripció:** «Les gírgoles de la cova canten juntes o callen juntes. Toca'n una i despertaràs també les dues que té al costat. Quan cantin totes, el pas s'obre.»


### tornRastell



**Ineu:** (Em caldrien unes mans molt més fortes: els guants dels picapedrers del Germà Francí.)


### pontGabia



**Inscripció:** Gravada a la pedra, una paraula antiga: PEDRES.


*Si: cantPedres*

**Ineu:** (Les pedres... L'ombra del monjo es va despertar amb el Cant de Vespres. Potser aquestes també: 3-1-2-1.)


*Si: NO cantPedres*

**Ineu:** (Pedres que dormen. Hi deu haver un cant per despertar-les.)


### gabiaGran



**Ineu:** (Ara. El Cant del Miracle: 1-2-2-2-3-1.)

**Ineu:** (Els barrots no tenen pany. Només un cant els pot obrir: el Cant del Miracle.)


### aldreuGabia



**Germà Aldreu:** Ell em va veure, saps? Tothom em passava pel costat. Ell em va veure.

**Germà Aldreu:** Deixa'm aquí. Si mai torna, que em trobi esperant-lo.

**Germà Aldreu:** Mestre... no em deixeu...

**Aldreu, Pastor de Boira:** El Mestre ve, monjo. Ja el sents?


### gentEpileg



**Gent:** Avui tothom canta, encara que l'orgue faci una nota de pega.


### nenGabia



**Huri:** Ineu! Somiava que era un ocell dins d'una gàbia... i ara tinc unes ganes de riure!

**Fram:** On és l'home dels ocells? L'has fet fugir tu? Ha ha ha! Quina cara que feia!

**Sardi:** El pare deu estar amoïnat regant la prunera... Anem a casa, Ineu?


### actualitzar


*Si: this.time.now > (this.avisBoira o 0*

**Ineu:** (Aquesta boira crema la gola... Sense l'Empara Fraternal de les sacerdotesses de l'Hostatgeria no la podré travessar.)


*Si: NO this.combatIniciat i pontGabia i NO ocellaireVencut i this.ineu.y < GABIA.y + GABIA.platH / 2 - 30*

**Ineu:** (Una força invisible no em deixa passar. Sense el Cant del Miracle, els barrots no m'escoltaran. La Pianista, al Santuari, me l'ha d'ensenyar.)


### enMelodia


*Si: nom === 'miracle' i d(this.gx, this.base + 60) < 300*

**Ineu:** (L'Home de la Gàbia xiula més fort que el cant.)


### iniciarCombatFinal



**Aldreu, Pastor de Boira:** Una altra vegada, monjo? El Mestre no es cansa mai.

**Aldreu, Pastor de Boira:** Qui t'ha donat permís per trepitjar aquesta sala, monjo?!

**Ineu:** Germà Aldreu! Deixeu anar els nens, tot això s'ha d'acabar!

**Aldreu, Pastor de Boira:** Tard, massa tard! Mestre! Mestre, ja és aquí! El monjo que us vol prendre els nens!

**L'Home de la Gàbia:** Un nen que riu... Fa segles que no en sento cap.

**L'Home de la Gàbia:** La gàbia és plena de riures robats. Encara hi cap el teu.


### ocellaireDerrotat



**L'Home de la Gàbia:** No... el meu riure... Els meus ocells...

**Germà Aldreu:** Mestre! No em deixeu!


### finalGabia



**Germà Aldreu:** La seva veu em parlava dins el cap cada nit. Era l'única que em parlava.

**Germà Aldreu:** El Mestre és aquí dins...

**Germà Aldreu:** Jo em quedo amb ell.



## Escena nord


### construir



**Cartell:** ← Bosc de Sant Joan
← Font del Bisbe
↑ El Gran Til·ler
↓ Les Runes
→ Sant Benet

**Cartell:** ← El Monestir i la Plaça

**Cartell:** La Caseta
→ El Gran Til·ler


### germaFranci



**Germà Francí:** Els guants et queden grans, eh? Ja hi creixeràs. Fes-los servir per moure el que pesa, no per empènyer la gent.


*Si: florsCreu*

**Germà Francí:** Les has deixades a l'àngel? Que Déu t'ho pagui, fill. Els monjos d'abans ja deuen estar contents: algú encara se'n recorda.

**Germà Francí:** Té. Són els guants de picapedrer dels monjos antics: amb ells van aixecar les pedres del Santuari. Jo ja no tinc força per fer-los servir, però tu sí.

★ Has obtingut els GUANTS DE PODER!

**Germà Francí:** Diuen que, posats, un noi pot moure una roda de carro com si fos de suro. Jo no ho he vist mai. Però mai no havia vist una boira com aquesta, tampoc.


*Altrament (per defecte):*

**Germà Francí:** El ram, a la tomba de l'àngel de pedra, a la dreta del Cementiri, fill. Darrere el Monestir, camí amunt. I compte amb les bestioles.

**Germà Francí:** Ineu... Bon dia, fill. Ja et deixen créixer?

**Germà Francí:** Perdona que no camini de pressa: aquests genolls ja tenen més anys que el campanar.

**Germà Francí:** Jo visc al Monestir, però cada matí baixo a passejar fins a Sant Antoni. L'Huri, el de Sant Benet, em venia a robar figues i jo feia veure que no el veia. Fa dos dies que la figuera és plena.

**Germà Francí:** Cada setmana porto flors a l'àngel del Cementiri, per als monjos que hi dormen. Però amb aquesta boira no hi arribo: les cames no em responen i les bestioles no em respecten.

**Germà Francí:** Me'n faries el favor? Deixa aquest ram als peus de l'àngel. I torna, que tinc una cosa per a tu.

★ Has obtingut un RAM DE FLORS.



## Escena oest


### construir



**Cartell:** Bosc de les Rovelloneres.
«Qui no mira a terra, es perd. Els rovellons creixen sempre vora el bon camí. Si t'equivoques, tornaràs a la primera clariana.»

**Cartell:** ← Rovellonera
«On hi ha rovellons, hi ha pins; on hi ha pins, hi ha camí.»

**Ineu:** La clau del Galf encaixa al pany. La porta de l'ermita s'obre.

**Ineu:** L'ermita de Sant Gabriel és tancada amb clau.

**Cartell:** → Dipòsits
↑ La Rovellonera

**Cartell:** → Dolmen
← Ermita de Sant Gabriel



## Escena provisionals


### construir



**Ineu:** Tancada amb clau.

**Ineu:** La clau del campanar encaixa al pany. La porta s'obre.

**Ineu:** Tancada amb clau.

**Cartell:** → Cel·les de Sant Antoni
↑ El Cementiri

**Cartell:** ↑ Plaça del Santuari

**Cartell:** ← La Taverna i l'Hostatgeria
→ La Plaça del Santuari


### ferEpileg



**Meus:** Huri! Fram! Bruts com dos esquirols i amb cara de no haver dormit en tres nits... Veniu aquí, que no us deixo anar mai més!

**Senyor Molner:** Ja són aquí, Meus. Ja són aquí.

**Meus:** I tu, Ineu, no et pensis que t'escapes de l'abraçada.

**Fram:** Mandu! Què li ha passat a la nina? Dona-me-la, que només jo sé cosir caps de nina.

**Mandu:** Gràcies, Fram! Ja torna a tenir cap... i tu ja no te n'aniràs mai més, oi?

**Carmèlia:** Sardi! Tres nits sense dormir, les tres. La Dolora ha resat tants rosaris que ja no li queden dits.

**Dolora:** I els tornaria a resar tots. Gràcies, Ineu.

**Sardi:** Pilària, Pilària! He volat amb ocells de foc!

**Pilària:** Doncs ara aterraràs a la banyera, que fas olor de gàbia.

**Isílder:** Sardi! Fill meu... Tres nits sense saber de tu.

**Sardi:** Pare! Has regat la prunera?

**Isílder:** Cada dia, fill. Cada dia. Així, quan tornessis, ho trobaves tot com ho havies deixat.

**Iscu:** Avui no frego ni un got! La mare dorm i ningú no m'ho pot manar. Festa grossa!

**La Pianista:** Ara sí. Ineu, la tarota: avui el Cant del Miracle el comences tu, i l'orgue et seguirà.

**Pare Daimiel:** Sents el campanar, Ineu? Torna a tocar les hores! Fa tres nits que el temps no passava, i l'has tornat a posar en marxa tu.

**Carry:** El meu home ho hauria sentit des de lluny, aquest so. Gràcies, fill.

**Ineu:** Pare Jordà... el Germà Aldreu no ha tornat. Es va quedar amb el Mestre, sota terra, i la gàbia se'l va tancar a dins.

**Pare Jordà:** L'Aldreu... dins la gàbia?

**Pare Jordà:** Quan un home busca l'admiració a la foscor perquè no sap trobar l'amor entre els seus germans, acaba sent el seu propi carceller.

**Pare Jordà:** Haurà de respondre davant de Déu i davant nostre per cada llàgrima dels infants. Però la gàbia que ell mateix ha triat tancar... és on la seva boira ja no farà mal a ningú més.

**Pare Jordà:** Ara mira al teu voltant, Ineu: els nens riuen i el Santuari canta. Que la seva tristor no ens robi la llum que has tornat al Miracle. Benvingut a casa, fill.


### enEntrar



**Ineu:** Una altra nit de boira... i aquest fred que no marxa. El Pare Jordà em deu estar esperant a la Plaça.



## Escena taverna


### portaTaverna



**Nota:** «Avui no servim. — Càren»

**Ineu:** Des de dins se sent un fil de música d'acordió, molt baixet... i una olor de fregit.

**Eve:** Psst! Tu ets l'Ineu, oi? El monjo que pregunta pels nens. Entra, de pressa, que la Càren dorm i no vull que ens vegin.


### eve


*Si: NO eveParlat*

**Eve:** Sóc l'Eve. Ajudo la Càren... bé, faig la feina de la Càren. Ella dorm des que va arribar la boira. Diu que és cansament. Jo crec que és la boira.

**Eve:** T'he fet entrar per una cosa. Cada nit, quan tot és tancat, el Germà Aldreu pica tres cops a la Porta de les Gírgoles, al camí de l'est del Pati del Celler, i la porta s'obre sola, com si la boira l'obeís. Entra. Diu que va a buscar vi, però a la Taverna mai no ha faltat cap ampolla. I no en torna amb cap.

**Eve:** A dins, diuen, n'hi ha una altra de ferro, molt vella, que ningú no ha obert mai. D'allà surt la boira. I de nit... se senten ocells. Ocells, Ineu.

**Eve:** I l'Iscu, el fill de la Càren, fa dos dies que s'escapa: diu que va a jugar a cartes on ningú no el molesta. Aquest no l'ha pres la boira: l'ha pres la mandra de fregar gots.

**Eve:** Sempre surt pel camí de la Desaparició. Una vegada em va dir, rient, que hi ha un forat entre els arbres «per on els grans no hi caben».

**Eve:** El Sardi hi venia cada tarda a berenar pa amb xocolata. Fa una nit que no ve.


*Altrament (per defecte):*

**Eve:** L'Iscu? Ja t'ho vaig dir: surt pel camí de la Desaparició, a l'oest de les Runes, i s'amaga per un forat entre els arbres «per on els grans no hi caben». Si el trobes, digues-li que torni a sopar.

**Eve:** Aquesta clau... és de ferro vell, com la porta de fora, la de la Porta de les Gírgoles! L'has trobada a la Casa Gran? La porta és a la Sala de les Gírgoles: des del Pati del Celler, el camí de l'est, entre els arbres.


*Si: cantMiracle*

**Eve:** I la Pianista t'ha ensenyat el cant. Vés amb compte, allà dins.


*Si: NO cantMiracle*

**Eve:** Abans d'entrar-hi, passa pel Santuari: la Pianista sempre diu que hi ha un cant per a cada porta.


*Altrament (per defecte):*

**Eve:** Aquesta espasa brilla com si estigués contenta. Amb això potser obriríem la porta... però el pany és de clau. Una clau de ferro, grossa.

**Eve:** L'Isílder diu que els monjos ho amagaven tot a la Casa Gran. Potser la clau també.

**Eve:** No et puc ajudar a obrir la porta de ferro: no té pany per a cap clau que hi hagi a la Taverna. Diuen que els monjos la van tancar amb una espasa que brilla.

**Eve:** Busca aquesta espasa, Ineu. Jo em quedo aquí, fent veure que treballo.


### portaSoterrani



**Ineu:** (Tancada amb clau. A l'Aldreu se li obria sola perquè la boira que sortia de la tomba obeïa la veu del Mestre... però la tomba és segellada i la boira ja no puja: ara la porta no s'obre per a ningú. Em cal la clau dels monjos.)

**Ineu:** (Tancada amb clau. Diuen que a l'Aldreu se li obre sola: la boira l'obeeix. A mi, no.)


### portaFerro



**Ineu:** (Tinc la clau, però allà baix només un cant em serveix: els barrots de la gàbia només escolten el Cant del Miracle. Primer l'he d'aprendre: la Pianista, al Santuari, me l'ensenyarà.)

**Ineu:** (Tinc Runna i el Cant del Miracle. Endavant.)

**Ineu:** (Aquí és d'on surt tot. Em falta l'espasa que la va segellar... i una clau.)

**Ineu:** (La Clau de ferro no hi entra: aquest pany és molt més petit. El Germà Aldreu en deu tenir una altra.)

**Ineu:** (Algú l'hauria d'haver vist anar-hi de nit... L'Iscu, el fill de la Càren! L'Eve va dir que s'escapa pel camí de la Desaparició, per un forat entre els arbres.)
