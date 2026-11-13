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
| **Pare Nadiel** | Santuari | Dirigeix el cor. |
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
| **Jorgi** | La Caseta | Nen que guarda la Maneta. |
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
| Maneta | Cofre de joguines de la Caseta (en Jorgi) | Fa girar el cap de l'Home del Raïm. |
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
L'orgue no sona. Ensenya el **Cant de l'Aurora** i dona la **tarota del Cortiner**. Així s'aprèn a tocar els cants (tecles 1-2-3 o ← ESPAI →; al mòbil, tres cercles). També hi és el Pare Nadiel `pareDaimiel` (cor i rellotge aturat).

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
La font és adormida i el bosc és ple de boira lila. Calen **tres ofrenes**: l'**herba de Sant Joan** i el **romaní** (brillen en dues clarianes del bosc) i una **pruna** de la **Prunera Màgica**, al jardí de l'Hostatgeria `prunera`. En tirar-les-hi, la font es desperta (+ **aigua de la Font del Bisbe**).

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
El Pare Nadiel només parla del sagrari quan l'Ineu ja té el primer pergamí. La clau petita obre el sagrari del retaule: **fragment 2**. La Pianista ensenya el **Cant de Vespres** (3-1-2-1) un cop l'ombra el demana; el mateix cant desperta la **pedra secreta** de la façana del Santuari (sala del tresor: +1 cor, `pedraEscolta` `cofreTresor`).

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
A l'oest del Gran Til·ler, en Jorgi (que crida «MAI! MAI!») guarda la **Maneta** al cofre de les joguines de la caseta aixecada sobre pals; per una cosa seriosa, la hi deixa agafar.

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
| **Rellotge del campanar** | Amb la clau del campanar; el Pare Nadiel obre la porta de la dreta del retaule | Torre → Sala del Rellotge: tres engranatges (petit, gran, mitjà, segons la nota del campaner) | El rellotge camina; a l'epíleg toca tres campanades. |
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
- Després de l'epíleg: tothom té frase nova? Falta algú (Nena de les Trenes, Galf, Follet, Jorgi, Mandu)?
- Els diàlegs amb variant «Si: ...» (annex): n'hi ha cap condició que no es pugui complir mai o que repeteixi el mateix text?
