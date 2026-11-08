# Revisió de coherència narrativa — Runna, l'espasa del Miracle

Auditoria de només lectura (cap fitxer del joc modificat). Canon: `docs/GUIO.md`. Text del joc llegit: `js/dialegs.js` (sencer), `js/progres.js` (sencer), `js/zones/taverna.js` (1-110), `js/zones/gabia.js` (40-91 i 1060-1220), `js/main.js` (pròleg, 377-387) i les línies de diàleg de `js/zones/provisionals.js`.
**Cobertura parcial**: l'informe es va tallar per límit de torns. Vegeu «Sense verificar» al final.

## Taula resum

| # | Gravetat | Troballa | On |
|---|---|---|---|
| 1 | Alta | Al sopar del Til·ler l'Ineu toca el Cant de Vespres, que encara no pot saber | dialegs.js:1098 vs progres.js (ordre) i dialegs.js:242 |
| 2 | Alta | El Sardi: fill de l'Isílder (codi) vs «protegit, cap parentiu» (guió, rev. 201) | dialegs.js:915, 1144, 937; gabia.js:89 vs GUIO rev. 201, A3 |
| 3 | Mitjana | On és el Mestre/la gàbia: Taverna (A2, A6 Acte 2, A5 Pilària, pròleg) vs Gírgoles (codi) | GUIO A2/A5/A6; dialegs.js:1186; main.js:604 |
| 4 | Mitjana | Pilària diu que ha vist l'Aldreu cada nit estant tancada tres nits | dialegs.js:1005-1006 |
| 5 | Mitjana | Carry: el Pallofa marxa «fa tres nits» però va darrere del segrest del Fram (2a nit) | dialegs.js:510 vs 490 |
| 6 | Mitjana | Bastó de pelegrí: el guió A7 diu Pare Jordà; el joc usa l'Aldreu | GUIO A7 vs dialegs.js:127 |
| 7 | Mitjana | Dany de les armes: A4 (1/2) vs A7 i rev. 186 (1/2/3) | GUIO A4 l.50, 58 vs A7 |
| 8 | Mitjana | Guants de Poder: A3 (Francí) vs A5 (Refetor) vs ús al codi | GUIO A3 l.26, A5 l.86 |
| 9 | Mitjana | L'Aldreu a la Cirosa mentre les arrels tanquen el camí i és a la Plaça de dia | dialegs.js:559, 1071 vs GUIO A6 l.118 |
| 10 | Mitjana | Pistes de `progres.js` tractades com a víctima («la boira s'ha endut l'Aldreu») vs «dolent de debò» | progres.js:44; GUIO A3 l.29 |
| 11 | Baixa | «Home amb abric d'ocells» (Dolora) vs Ocellaire de hàbit negre / ombra amb hàbit | dialegs.js:991 vs GUIO A3 l.30, A6 l.115 |
| 12 | Baixa | Pistes dites per un personatge en tercera persona sobre ell mateix | progres.js:26, 34, 36; dialegs.js:37, 1420 |
| 13 | Baixa | Pistes de pas futur dites per Jordà/Alcoví/Til·ler si l'ordre no és el del guió | dialegs.js:103, 545, 608 |
| 14 | Baixa | Guió intern: «Runes de nit» (A5, A6 l.128) vs rev. 188 | GUIO |
| 15 | Baixa | Guió intern: Galf «asseguda» (A3) vs «noi», masculí al codi | GUIO A3 l.40 vs dialegs.js:865 |
| 16 | Baixa | Jusef: «roda de carruatge del pati» vs roda dins el Celler (A5) | dialegs.js:428 vs GUIO A5 l.90 |
| 17 | Baixa | Nom «Empara Fraternal» vs «Benedicció Fraterna» (rev. 216) | GUIO rev. 216 vs A4/dialegs.js:1039 |
| 18 | Baixa | Germans monjos «murats a la cripta» vs tomba al Cementiri | dialegs.js:1375 vs 666, 591 |
| 19 | Baixa | Pare Alcoví sap que has baixat a la cripta sense que ningú li ho digui | dialegs.js:589 |

## Confirmacions de pistes del coordinador (versió que usa el joc)

- **Bastó**: el joc usa el **Germà Aldreu** (`dialegs.js:127`, `progres.js:17`). L'error és només a A7.
- **Mestre**: el codi diu **«al fons de les Gírgoles»** (`dialegs.js:1186`, Eve, Pilària, Iscu). Vegeu #3.
- **Cant del Miracle**: la Pianista l'ensenya només amb `runna && !cantMiracle` (`dialegs.js:252`). La Carmèlia en parla amb dues versions segons `cantMiracle` (`dialegs.js:1020-1022`): **sense contradicció**, perquè només es pot alliberar amb Runna. Descartat com a error.
- **Ordre de nits**: Huri, Fram, Sardi és coherent entre Jordà (`:78`), pròleg (`main.js:385`), Meus i Carry. L'única fissura és #5.

## Detall — gravetat ALTA

### 1. El Cant de Vespres al sopar del Til·ler
- **On**: `dialegs.js:1098`, l'Ineu davant el pastor vell: «Tinc la tarota... El Cant de Vespres, 3-1-2-1: el tocaré vora el foc».
- **Contradicció**: a `progres.js` el sopar és abans del fragment 1 i de l'ombra. La Pianista només ensenya Vespres si `ombraDemanaCant || alcuiLlegit` (`dialegs.js:242`). Al sopar l'Ineu només sap l'Aurora. L'Ineu anomena un cant que encara no coneix.
- **Proposta mínima**: a `dialegs.js:1098` canviar «El Cant de Vespres, 3-1-2-1» per una referència al cant que sí que sap en aquell moment (Aurora). Cal comprovar què exigeix la foguera a `js/zones/cirosa.js` (no llegit).

### 2. El Sardi, fill de l'Isílder
- **On**: Isílder «el meu fill Sardi. Té set anys» (`dialegs.js:915`) i «pel meu Sardi» (`:1144`). Sardi alliberat: «El pare deu estar amoïnat regant la prunera» (`gabia.js:89`). Guió: rev. 201 «cap parentiu»; A3 l.41 i A6 «protegit de les sacerdotesses»; però A3 l.38 diu «el seu fill, el Sardi».
- **Contradicció**: el codi i A3 l.38 diuen fill; rev. 201, Jordà (`dialegs.js:78`) i A3 l.41 diuen protegit sense parentiu. El joc ha usat «fill».
- **Proposta mínima**: decidir amb narrative-director. Si el fill és canònic, corregir la rev. 201 i A3 l.41 (el Sardi és fill de l'Isílder i viu protegit a l'Hostatgeria). Si no, canviar les 4 línies del codi.

## Detall — gravetat MITJANA

### 3. Taverna vs Gírgoles
- **Guió**: A2 «sota terra (on ara hi ha la Taverna)»; A6 Acte 2 «el Mestre ja és despert sota la Taverna»; A5 l.86 «el Germà Aldreu baixar a la Taverna». Rev. 109 diu «La gàbia continua sent sota la Taverna». La secció Coherència diu «al fons de les Gírgoles».
- **Codi**: Aldreu «El Mestre és al fons de les Gírgoles» (`dialegs.js:1186`). Eve i Pilària diuen «Porta de les Gírgoles» (`taverna.js:25`; `dialegs.js:1006`). Però el pròleg dibuixa l'ombra que s'endú el nen «cap a la Taverna» (`main.js:604` i `:615`, comentaris del codi; el text del quadre 4 no la nomena).
- **Proposta mínima**: A2, A5 l.86 i A6 Acte 2 → «al fons de les Gírgoles»; revisar la imatge/comentari del pròleg.

### 4. Pilària tancada que ho ha vist tot
- **On**: `dialegs.js:1005` «Tres nits que colpejo aquesta porta!» i `:1006` «anava cada nit a la Porta de les Gírgoles... ho vaig veure».
- **Contradicció**: no pot haver vist cada nit un lloc exterior estant tancada des de la primera nit. Només és possible per nits anteriors a la boira.
- **Proposta mínima**: a `:1006` canviar «cada nit» per «moltes nits, abans que pugés la boira».

### 5. Carry: «fa tres nits»
- **On**: `dialegs.js:510` «Va marxar fa tres nits, quan va pujar la boira» (la primera nit) i `:490` «La nit següent va ser el Fram... el Pallofa va lladrar... i va marxar darrere seu» (la segona). Les Venerables (`:32`) repeteixen «fa tres nits».
- **Proposta mínima**: a `:510` i `:32` canviar «fa tres nits» per «fa dues nits».

### 6. Qui dona el bastó
- A7 «en parlar amb el Pare Jordà, que et dona el bastó de pelegrí». Canon A3/A4/A6 i codi: Aldreu. **Proposta**: A7, canviar «Pare Jordà» per «Germà Aldreu».

### 7. Dany de les armes
- A4 l.50 «Branca... 1 de dany», l.58 «Runna... Dany 2». A7 i rev. 186: bastó 1, branca 2, Runna 3. **Proposta**: corregir A4 a branca = 2 i Runna = 3. El valor del codi no s'ha comprovat (vegeu «Sense verificar»).

### 8. Guants de Poder
- A3 l.26: Francí els dona. A5 l.86: «Refetor... àngel de pedra → Guants de Poder». El codi usa Francí: `progres.js:95-98`, `gabia.js:59`. L'àngel del Refetor s'empeny **amb** els guants (`dialegs.js:978-979`). A5 és el que falla. **Proposta**: A5 l.86, canviar «→ Guants de Poder» per «(s'empeny amb els Guants de Poder)».
- El «rastell amb els Guants» és coherent amb el codi (ús, no font).

### 9. L'Aldreu a la Cirosa
- El Til·ler diu que l'Aldreu «hi ha pujat aquests dies» (`dialegs.js:559`) i el pastor vell que el van veure baixar de nit amb un nen (`:1071`). Però el Til·ler ha tancat el camí amb arrels (`:557`) i A6 l.118 l'ubica a la Plaça de dia.
- **Proposta mínima**: afegir al Til·ler (`:559`) que només «les arrels reconeixen la meva branca», per deixar clar que el pas és tancat per a mortals i no per a ell. Plausible, a decidir.

### 10. Pistes que fan de l'Aldreu una víctima
- `progres.js:44` «la boira s'ha endut el Germà Aldreu» i `dialegs.js:1070` el pastor vell «no era mala persona»; A3/A2 l'han definit «dolent de debò (no una víctima)». La rev. 176 diu «encegat».
- **Proposta**: a `progres.js:44` canviar per «el Germà Aldreu ha pujat a la Cirosa amb la boira a dins: ara és el Pastor de Boira».

## Detall — gravetat BAIXA

11. `dialegs.js:991` Dolora: «un home amb abric d'ocells». Pròleg: «ombra amb hàbit»; Ocellaire: hàbit negre. Proposta: «un home amb hàbit i ocells a l'espatlla» (PLAUSIBLE: pot ser la visió de la Dolora).
12. `progres.js:26` («les Venerables Sàvies diuen»), `:34`/`:36` («la vident») dits per elles mateixes. Proposta: reescriure aquestes tres pistes en neutre.
13. Si l'ordre real difereix, `pistaRunna` posa a boca de Jordà/Alcoví/Til·ler pistes d'altres passos (p. ex. «El Pare Jordà, a la Plaça, voldria...», `progres.js:77`). Proposta: guardar-ho només si ho vols; el cas normal es cobreix amb els `if` previs.
14. A5/A6 l.128 «la zona es queda de nit» vs rev. 188 «ja no es fan de nit». Proposta: actualitzar A5/A6.
15. A3 l.40 «asseguda» vs «noi», «Soc el Galf, inventor» (`dialegs.js:865-888`). Proposta: decidir gènere i uniformar.
16. `dialegs.js:428` «roda de carruatge del pati» vs A5 l.90 (Celler interior). Proposta: «del Celler».
17. Rev. 216 «Benedicció Fraterna»; A4 i text «Empara Fraternal». Proposta: la rev. 216 → «Empara».
18. `dialegs.js:1375` «murada amb els meus germans» a la cripta vs tomba del Cementiri (`:666`). Plausible (dos llocs); aclarir al guió.
19. `dialegs.js:589`: Alcoví sap de la cripta i la clau. Plausible (rumor); proposar que l'Ineu li ho digui.

## Sense verificar (no confirmades ni descartades)

- Restes de noms vells (Andreu, Garf, Perers): no s'ha pogut fer la cerca a `js/` ni `docs/` (l'últim grep va fallar per la ruta). Només s'ha vist que els flags interns es mantenen a propòsit (`andreuTancat`, `parlatAndreu`, `garfBancSegut`).
- Valors de dany reals al codi (`combat.js`): no llegit.
- Rosansa: A3 la posa a les Cel·les, rev. 195 al camí de les Runes; no s'ha mirat la zona.
- Diari (`js/diari.js`) i `js/credits.js`: no llegits; cal revisar pistes i noms.
- Diàlegs a `js/zones/*.js` (nord, oest, cirosa, casa, cela, cementiri, bosc_pi): no llegits. Això inclou el Germà Francí, en Georgi i la foguera dels pastors.
- Resta de «Taverna» als textos: només s'ha vist `main.js:604`, `:615` i `cirosa.js:256` (comentaris).
- Eve «tres cops» i Iscu (A3): l'Iscu no ho diu al codi; l'Eve sí (`taverna.js:25`). Menor.
