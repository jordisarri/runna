# Textos del joc (numerats)

Tot el que diuen els personatges, en ordre aproximadament cronològic, amb el **número** de cada frase entre claudàtors: per corregir, digues «al text 45 canvia ...».

- Els números són **estables**: una frase conserva el seu número encara que se'n corregeixi el text; les noves reben el número següent; les esborrades desapareixen d'aquí (queden al registre `docs/textos_ids.json`).
- *Si: ...* indica en quin moment de la partida es diu una variant (en català; «(depèn d'un càlcul del joc)» vol dir que la condició la decideix el programa i no es pot resumir). Els `[…]` són parts del text que el joc calcula.
- Les línies amb ★ són els avisos d'objectes que s'obtenen. Aquest document es genera amb `python3 eines/fer_textos.py` (vegeu `CLAUDE.md`).

---

## Pròleg «Tres nits de boira»

### proleg  <sub>(js/main.js)</sub>

**[1] (narrador):** Fa tres segles, quan el món encara tremolava de pregàries, un firaire de capa negra pujava cada primavera al Miracle amb gàbies d'ocells que cantaven amb veu de persona: l'Ocellaire. Els nens que l'escoltaven perdien el riure per sempre.

**[2] (narrador):** Pastors i monjos s'alçaren contra ell i el tancaren dins la seva pròpia gàbia, al més profund de la terra. Els monjos van segellar la porta de ferro amb la llum de l'espasa del Miracle, Runna. La van fer dormir entre pedres, a l'espera del dia en què la foscor tornés.

**[3] (narrador):** Però la foscor no oblida. Fa tres nits, una boira violeta i glaçada s'ha alçat de sota terra: marceix els horts, enterboleix les aigües i ha fet emmudir l'orgue sagrat del Santuari.

**[4] (narrador):** I cada nit, la boira reclama un nen. / Un llit buit a Sant Benet, i després un altre. / I aquesta nit maleïda... un tercer bressol s'ha quedat fred.

**[5] (narrador):** Quan l'alba torna a incendiar el cel del Miracle, un jove monjo desperta al Monestir: l'Ineu. / El destí l'ha triat, encara que ell no ho sàpiga. El Pare Jordà l'espera a la Plaça.

---

## Inici: el Monestir i la Plaça

### despertarCaigut  <sub>(js/zona_base.js:375)</sub>

**[6] Pare Jordà:** Ineu! Què fas a terra? Respira, fill! Encara prendràs mal. Ja estàs bé?

### enEntrar  <sub>(js/zones/monestir.js:30)</sub>

**[7] Ineu:** Una altra nit de boira... i aquest fred que no marxa. El Pare Jordà em deu estar esperant a la Plaça.

### construir  <sub>(js/zones/monestir.js:65)</sub>

**[8] Cartell:** → Cel·les de Sant Antoni / ↑ El Cementiri

### pareJorda  <sub>(js/dialegs.js:107)</sub>

*Si: encara no ha parlat per primer cop amb el Pare Jordà (l'encàrrec inicial)*

**[9] Pare Jordà:** Ineu, bon dia. Que bé que hagis sortit, et buscava.

**[10] Pare Jordà:** No et vull espantar. Fa tres nits que una boira violeta surt de sota terra, i cada nit falta un nen: l'Huri i el Fram, de les cel·les de Sant Benet, porta amb porta; i aquesta nit, el Sardi, el protegit de les sacerdotesses de l'Hostatgeria.

**[11] Pare Jordà:** Ningú no els ha vist marxar. Els llits són desfets, i les finestres tancades per dins. Només queda una olor de terra mullada.

**[12] Pare Jordà:** Tu tens bons ulls i bon cor. Parla amb tothom i explica-m'ho tot. Ves amb compte pels camins, Ineu.

*Si: té la fulla del Til·ler i encara no ha rebut la benedicció del prior*

**[13] Pare Jordà:** Ineu! Ho he sentit: el Til·ler t'ha donat el seu permís. Aquell arbre no en dóna a qualsevol.

**[14] Pare Jordà:** Mira, fill: jo no soc valent com tu, però sí que sé una cosa. Una benedicció no és una paraula màgica, és l'autèntica bona voluntat. Ajup el cap.

**[15] Pare Jordà:** No vas sol, Ineu. T'acompanya tot el Miracle.

**[16] Pare Jordà:** I pren això. És un medalló de pedra, amb una mà oberta tallada, que han guardat totes les generacions de priors del Miracle. Ara ha de ser teu: porta'l al Dolmen.

**[17]** ★ Has obtingut el MEDALLÓ DE LA BENEDICCIÓ!

*Si: porta el bastó del Til·ler i encara no ha aconseguit Runna*

**[18] Pare Jordà:** Ineu, la gent diu que has parlat amb el Gran Til·ler. Per despertar Runna et calen tres coses: el permís de l'arbre (el seu medalló), les Paraules del Saber del Pare Alcoví i la meva benedicció.

**[19] Pare Jordà:** [pista del pas següent de la història: vegeu la Ruta]

*Si: (depèn d'un càlcul del joc)*

**[20] Pare Jordà:** Les bestioles han sortit pels camins, Ineu. Fins i tot alguns visitants, que pujaven al Miracle a fer fotos, vagaregen amb la pell verdosa i la mirada perduda: la boira els ha trastocat i no saben ni qui són. Si en veus pel Santuari o pel Cementiri, no t'espantis.

**[21] Pare Jordà:** No són dolents, pobrets: només fes-los dormir i es despertaran sense recordar res. Quan la boira se'n vagi, tornaran a ser turistes.

**[22] Pare Jordà:** I torna abans que es faci fosc.

*Altrament (per defecte):*

**[23] Pare Jordà:** Parla amb la gent: les famílies de les cel·les, els germans, la Pianista... Algú haurà vist alguna cosa.

**[24] Pare Jordà:** Si et perds, les Venerables Sàvies de les cel·les sempre tenen un bon consell.

### cartellPlaca  <sub>(js/dialegs.js:194)</sub>

**[25] Cartell:** ↑ El Celler i les Runes / ← Casa Gran / ↓ La Bassadòria

### germaAldreu  <sub>(js/dialegs.js:156)</sub>

*Si: encara no porta el bastó*

**[26] Germà Aldreu:** Ineu! Quin drama, oi? Tothom corrent amunt i avall... Segur que els nens s'han amagat per jugar.

**[27] Germà Aldreu:** Ets del Barça, tu? Tinc uns cromos que els nens es moren per tenir. Ells sí que m'escolten.

**[28] Germà Aldreu:** Tinc aquest bastó de pelegrí. És perillós anar sol. Agafa'l.

**[29]** ★ Has obtingut el BASTÓ DE PELEGRÍ!

*Altrament (per defecte):*

**[30] Germà Aldreu:** Avui no tinc temps, Ineu. Tinc... coses a fer.

**[31] Germà Aldreu:** Ei, no sents res? Com una veu molt fluixeta que em crida de sota terra... Deu ser el vent. Força Barça!

### creu  <sub>(js/dialegs.js:188)</sub>

*Si: ha netejat la Bassadòria*

**[32] Ineu:** Les flors del peu de la creu s'han redreçat. Ara que l'aigua torna a ser clara, també elles tornen a tenir color.

*Si: encara no ha netejat la Bassadòria*

**[33] Ineu:** Avui les flors estan pansides. Com si la boira se'n begués el color.

### avisRosansa  <sub>(js/dialegs.js:28)</sub>

**[34] Les Venerables Sàvies:** I una cosa més: la Rosansa, la venedora de verdures, ha tornat a passar per les cel·les amb el carro. Si algun dia busques una llavor estranya, ja saps a qui preguntar.

---

## El Santuari: la Pianista i els cants

### pianista  <sub>(js/dialegs.js:264)</sub>

*Si: encara no sap el Cant de l'Aurora ; (depèn d'un càlcul del joc)*

**[35] La Pianista:** Ho tornem a provar, fill? Escolta bé les notes.

*Si: encara no sap el Cant de l'Aurora*

**[36] La Pianista:** Ai, Ineu, fill... Passa, passa. Perdona que no et miri, no puc deixar l'orgue.

**[37] La Pianista:** Fa quaranta anys que toco cada dia i mai no m'havia faltat el so. Ara els dits es mouen per les tecles, però de l'orgue no en surt ni una nota.

**[38] La Pianista:** Des que va arribar la boira, fa tres nits, el Santuari s'ha quedat mut. Em fa por que s'estigui empassant tota la música.

**[39] La Pianista:** Però hi ha un cant que la boira no es pot empassar: el Cant de l'Aurora. Només que tu no tens res amb què tocar-lo.

**[40] La Pianista:** Deixa'm que t'expliqui d'on ve això. Fa molts anys, el Cortiner posava la música a les representacions del Santuari, i tenia una tarota.

**[41] La Pianista:** Deia que les cortines que de debò importen no són de vellut, sinó la boira, les bardisses i les pedres, i que les notes justes les poden apartar.

**[42] La Pianista:** Jo mai no he sabut fer-la sonar com ell. Pren-la, fill: potser a tu t'obeeix.

**[43]** ★ Has obtingut LA TAROTA DEL CORTINER!

*Si: porta les esquelles i encara no ha vist les esquelles*

**[692] La Pianista:** Ai, mare de Déu, les esquelles dels pastors! Fa vint anys que no en sentia el so. Deixa-me-les tocar un instant...

**[693] La Pianista:** Duen una música antiga. Amb la tarota, els cants antics encara desperten allò que dorm sota la boira. Vés amb compte, que amb aquesta força la boira no et perdonarà.

*Si: ha sentit que l'ombra del monjo demana un cant o ha sentit parlar del sopar del Til·ler i encara no sap el Cant de Vespres (el de les pedres) ; parla amb l'ombra del monjo*

**[44] Ineu:** Una ombra de monjo, a les Runes, diu que vostè coneix un cant que les pedres entenen.

*Si: ha sentit que l'ombra del monjo demana un cant o ha sentit parlar del sopar del Til·ler i encara no sap el Cant de Vespres (el de les pedres) ; encara no parla amb l'ombra del monjo*

**[45] Ineu:** Els pastors de la Cirosa fa anys que no senten música vora el foc. El Gran Til·ler diu que vostè guarda un cant tan vell com ells.

*Si: ha sentit que l'ombra del monjo demana un cant o ha sentit parlar del sopar del Til·ler i encara no sap el Cant de Vespres (el de les pedres) ; parla amb l'ombra del monjo*

**[46] La Pianista:** Un cant que les pedres entenen? Ai, fill... Potser és el de Vespres: és molt vell, me'l va ensenyar la meva mare. Vine, escolta.

*Si: ha sentit que l'ombra del monjo demana un cant o ha sentit parlar del sopar del Til·ler i encara no sap el Cant de Vespres (el de les pedres) ; encara no parla amb l'ombra del monjo*

**[47] La Pianista:** Un cant tan vell com ells? Tinc el de Vespres, fill: molt vell, me'l va ensenyar la meva mare. Potser els recorda casa. Vine, escolta.

*Si: ha aconseguit Runna i encara no sap el Cant del Miracle*

**[48] La Pianista:** Ai, Ineu, fill, portes Runna! Se't nota a la mirada. Aleshores t'he d'ensenyar l'últim cant, el que l'Ocellaire va robar als ocells: el Cant del Miracle.

**[49] La Pianista:** Jo me'n recordo perquè el cantava la meva mare. Escolta'm i repeteix el que et toqui. Aprèn-lo bé: et farà falta allà baix.

*Si: ha netejat la Bassadòria*

**[52] La Pianista:** La bassadòria ja és neta, fill. Ho has aconseguit. Torna a veure'm quan tinguis un altre cant per aprendre.

*Si: encara no ha netejat la Bassadòria*

**[53] La Pianista:** Si trobes la manera de tornar la música, porta-me-la. Jo no em moc d'aquest banc, ni que s'acabi el món. Toca el cant amb la tarota quan siguis al lloc on cal.

*Altrament (per defecte):*

**[54] La Pianista:** Has sentit l'orgue? Encara li falla el re, però canta. Escolta.

**[55] La Pianista:** I tu, fill, no deixis mai la tarota al calaix.

### completarLliço  <sub>(js/musica.js:59)</sub>

*Si: (depèn d'un càlcul del joc)*

**[56] La Pianista:** Així, així! Tens oïda, fill. El Cant de l'Aurora: tres notes, i la boira es fa enrere.

**[57] La Pianista:** Pren aquesta tarota. Era del Cortiner, el músic que feia sonar les representacions del Santuari. Deia que les cortines més importants no eren de vellut.

**[58] La Pianista:** La boira, les bardisses i les pedres també són vels: les notes adequades poden despertar allò que amaguen. Jo no he sabut fer-la sonar com ell. Potser a tu t'escoltarà.

**[59]** ★ Has obtingut LA TAROTA DEL CORTINER!

**[60] La Pianista:** Toca'l davant l'aigua de la Bassadòria, la que surt tèrbola. Allà la boira té l'arrel.

*Si: (depèn d'un càlcul del joc) ; ha sentit que l'ombra del monjo demana un cant*

**[61] La Pianista:** El Cant de Vespres: 5-4-3-1. Si aquest monjo l'espera, toca'l davant seu: les pedres antigues sempre l'han entès.

*Si: (depèn d'un càlcul del joc) ; encara no ha sentit que l'ombra del monjo demana un cant → ha sentit parlar del sopar del Til·ler i encara no ha convençut els pastors de la Cirosa*

**[62] La Pianista:** El Cant de Vespres: 5-4-3-1. Toca'l vora el foc dels pastors: un cant tan vell potser els recorda casa.

*Si: (depèn d'un càlcul del joc) ; encara no ha sentit que l'ombra del monjo demana un cant → encara no ha sentit parlar del sopar del Til·ler i encara no ha convençut els pastors de la Cirosa*

**[63] La Pianista:** El Cant de Vespres: 5-4-3-1. És molt vell: les pedres antigues sempre l'han entès.

*Si: altrament*

**[64] La Pianista:** Això mateix, fill! El Cant del Miracle. Els ocells el cantaven a l'alba, abans que l'Ocellaire se'l quedés i el tanqués a la seva gàbia.

**[65] La Pianista:** Diu la meva mare que aquella gàbia només s'obre amb el cant que li van robar. Si els nens hi són a dins, toca'l davant els barrots i no tindran més remei que obrir-se.

### pareDaimiel  <sub>(js/dialegs.js:328)</sub>

**[66] Ineu:** Pare Nadiel, el pergamí que he trobat a les Runes diu que l'altra meitat és al sagrari. Sap on és la clau?

**[67] Pare Nadiel:** El sagrari? Hi guardo quatre papers vells dels monjos, perquè la humitat no se'ls mengi. Si el Pare Alcoví els busca, ja era hora que algú els llegís!

**[68] Pare Nadiel:** Però la clau, ai, fa anys que no sé on para: una de petita, que sembla de joguina. Els monjos antics deixaven les seves coses a l'ermita de la Desaparició. Potser és allà.

*Si: encara no ha parlat amb el Pare Nadiel*

**[69] Pare Nadiel:** Ineu! Quina alegria de veure't! Vine, que necessito veus noves per al cor.

**[70] Pare Nadiel:** La Pianista i jo som amics de tota la vida. Ella toca com ningú, i jo dirigeixo els cants. Però la música es queda sense orgue, ja ho veus.

**[71] Pare Nadiel:** No et preocupis: si la música s'ha amagat, la cantarem perquè torni! Riure és la primera pregària.

**[72] Pare Nadiel:** Ah, i una cosa que em preocupa: el rellotge de la torre s'ha aturat a un quart de quatre, la nit que va arribar la boira.

**[73] Pare Nadiel:** La porta de la dreta del retaule puja per la torre fins a la Sala del Rellotge, però és tancada amb clau, i la clau la guarda la Carry, la vídua del rellotger, a Nostra Senyora. Jo ja no tinc l'esquena per a tants graons, però tu... mira què hi passa.

*Si: ha obert el sagrari*

**[74] Pare Nadiel:** I no t'oblidis del rellotge, Ineu. [text calculat pel joc: textRellotge]

*Si: encara no ha reparat el rellotge de la torre ; porta la clau del campanar o ha obert la porta del campanar*

**[75] Pare Nadiel:** La Sala del Rellotge, fill: la porta de la dreta del retaule, i torre amunt. Si algú el fa caminar de nou, potser la boira s'ho pensarà dues vegades.

*Si: encara no ha reparat el rellotge de la torre ; encara no porta la clau del campanar o ha obert la porta del campanar*

**[76] Pare Nadiel:** La porta de la dreta del retaule és tancada, fill: la clau la guarda la Carry, la vídua del rellotger, a Nostra Senyora. Si algú fa caminar el rellotge, potser la boira s'ho pensarà dues vegades.

*Si: encara no ha sentit l'explicació del rellotge del Santuari*

**[77] Pare Nadiel:** Sents el rellotge, Ineu? Torna a caminar! Fa tres nits que no el sentia. Els nens em diuen que canto massa fort, però avui no cal: ho fa ell per mi!

*Si: encara no ha sentit l'explicació del rellotge del Santuari ; (depèn d'un càlcul del joc)*

**[78] Pare Nadiel:** I ara que el temps torna a passar, t'explico una cosa que m'ha dit la gent mentre era aturat:

**[79] Pare Nadiel:** I ara que el temps torna a passar...

*Si: encara no ha sentit l'explicació del rellotge del Santuari*

**[80] Pare Nadiel:** Doncs res, fill: tu ja ho saps tot. Jo continuaré cantant, que el rellotge ja em porta el compàs. […]

*Altrament (per defecte):*

**[81] Pare Nadiel:** Doncs res, fill: tu ja ho saps tot. Jo continuaré cantant, que el rellotge ja em porta el compàs. […]

### faristolOratori  <sub>(js/dialegs.js:206)</sub>

**[82] Ineu:** «Les pedres guarden el que se'ls diu. Qui calla prou estona, les sent respondre.»

### pedraEscolta  <sub>(js/dialegs.js:198)</sub>

*Si: sap el Cant de Vespres (el de les pedres)*

**[83] Ineu:** (Aquesta pedra no lliga amb la resta de la façana. Hi poso l'orella i sembla que escolti... Potser vol sentir el Cant de Vespres.)

*Si: encara no sap el Cant de Vespres (el de les pedres)*

**[84] Ineu:** (Aquesta pedra no lliga amb la resta de la façana. Hi poso l'orella i sembla que escolti... però no sé què vol sentir.)

### pedraSecretaOberta  <sub>(js/dialegs.js:203)</sub>

**[85] Ineu:** Un passatge entre el Monestir i el Santuari! Els monjos antics sí que en sabien, d'amagar coses.

### cofreTresor  <sub>(js/dialegs.js:213)</sub>

**[86] Nota:** «Per al qui sap escoltar les pedres.»

### sagrari  <sub>(js/dialegs.js:384)</sub>

*Si: encara no porta la clau del sagrari*

**[87] Ineu:** El sagrari és tancat amb una clau molt petita.

*Altrament (per defecte):*

**[88]** ★ Has obtingut el PERGAMÍ PARTIT (2/2).

**[89] Pergamí:** Fragment 2 de 2: / «El monjo va guardar el segell fins al darrer dia. Des d'aleshores la seva ombra torna cada nit al mur de les Runes a vigilar. La clau de ferro és on ell la va deixar, amb els seus germans, sota la mirada d'un guardià de pedra.»

**[90] Pergamí:** «Qui busqui la clau, que no oblidi mai on neix el sol.»

### construir  <sub>(js/zones/esglesia.js:105)</sub>

**[91] Ineu:** La clau de la torre del rellotge encaixa al pany. La porta s'obre.

**[92] Ineu:** Tancada amb clau.

---

## La Bassadòria (el Cant de l'Aurora)

### bassadoria  <sub>(js/dialegs.js:179)</sub>

**[93] Ineu:** L'aigua ja és neta: torna a ser clara i tranquil·la, i la boira violeta s'ha esvaït.

**[94] Ineu:** L'aigua sempre ha estat clara... Ara és tèrbola i fa olor de soterrani. I en surten aquests gripaus enverinats i una boira violeta, a glopades.

### construir  <sub>(js/zones/bassadoria.js:42)</sub>

**[95] Cartell:** ↑ Plaça del Santuari

### bassadoriaNeta  <sub>(js/dialegs.js:796)</sub>

**[96] Ineu:** Ha funcionat! L'aigua és neta...

---

## El bosc de Sant Joan: la Font, la Joaneta i l'Alzina Buida

### fontSJ  <sub>(js/dialegs.js:814)</sub>

*Si: (depèn d'un càlcul del joc)*

**[97] Ineu:** Ha funcionat! L'aigua de la pica torna a ser clara com el vidre.

**[98]** ★ Has obtingut l'AIGUA DE LA FONT DEL BISBE.

*Altrament (per defecte):*

**[99] Ineu:** Les Venerables Sàvies diuen que la nit de Sant Joan aquesta aigua guaria. Ara està morta... Hi ha unes lletres gravades a la pica: «Herba de Sant Joan, rialla i el fruit de l'arbre d'or.»

**[100] Ineu:** Rialla... Això no és cap rialla de riure: és una PLANTA! Les Venerables Sàvies parlaven d'una flor que creix envoltada de bolets verinosos, al Bosc del Pi dels Tres Cants.

**[101] Ineu:** L'herba de Sant Joan fa llum, sempre en una clariana: en deu haver-n'hi per aquí, en aquest mateix bosc. I l'arbre d'or... és la Prunera Màgica, al jardí de l'Hostatgeria! Una pruna.

### joaneta  <sub>(js/dialegs.js:1638)</sub>

*Si: encara no ha vist la Joaneta*

**[102] La Joaneta:** Ei! Tu! Qui coi t'ha dit que podies entrar? Els frares no veniu mai per aquí! Fot el camp o et faig créixer bolets a les orelles!

**[103] Ineu:** Perdoni... He arribat per l'alzina. Duc aigua de la Font del Bisbe.

**[104] La Joaneta:** Aigua... de la Font del Bisbe?! Dona'm aixòooo! Fa trenta anys que no en tinc ni una gota neta.

**[105] La Joaneta:** Mmm... collonut. Ets tonto, xaval, però ets bo. Els ocells i les guineus xerren, i jo ho sento tot: busques el Gran Til·ler, oi? Han tapat el camí que hi porta amb una boira que no marxa amb el vent.

**[106] La Joaneta:** Mira, he barrejat l'aigua que queda amb rialla, herba de Sant Joan i una mica de pruna daurada. Aquest beuratge fa fugir la boira dolenta. No te'l beguis, eh! Aboca'l sobre la boira i prou, que si no et sortiran bolets.

**[107]** ★ Has obtingut el BEURATGE DE LA JOANETA.

*Altrament (per defecte):*

**[108] La Joaneta:** Ja tornes, xaval? Els ocells m'ho diuen tot. Escolta: [text calculat pel joc: pista]

**[109] La Joaneta:** Ara fot el camp, que tinc feina amb la sopa. I no li diguis a ningú on visc, o et converteixo en bolet.

**[110] La Joaneta:** L'olla ja no fa bombolles liles. Ara fa olor de farigola, com ha de ser.

### alzinaBuida  <sub>(js/dialegs.js:853)</sub>

*Si: porta l'aigua de Sant Joan*

**[111] Ineu:** Duc aigua de la Font del Bisbe. Potser...

**[112] Veu del bosc:** ...Qui ens porta... l'aigua... bona... Passa, passa, fill... Només la Joaneta... sap on acabes.

*Altrament (per defecte):*

**[113] Ineu:** Sento una veu allà dins... «Aigua... aigua de la Font del Bisbe...» Potser necessito l'aigua de la font d'aquí a prop.

### cartellBosc  <sub>(js/dialegs.js:865)</sub>

**[114] Cartell:** Bosc de Sant Joan. / «Qui busca la font, que segueixi l'aigua... i qui no, que no es perdi.»

### cofreCabanaCami  <sub>(js/dialegs.js:252)</sub>

**[115] Nota:** «Per a qui es perd pel camí i el troba.»

### construir  <sub>(js/zones/nord.js:645)</sub>

**[116] Cartell:** ← Bosc de Sant Joan / ← Font del Bisbe / ↑ El Gran Til·ler / ↓ Les Runes / → Sant Benet

**[117] Cartell:** ← El Monestir i la Plaça / ↓ El Bosc del Pi dels Tres Cants

**[118] Cartell:** La Caseta / → El Gran Til·ler

### prunera  <sub>(js/dialegs.js:1121)</sub>

**[119] Isílder:** No te'n facis un fart, monjo! Són prunes daurades, màgiques: una sola et deixa com nou. El meu Sardi en menjava deu cada tarda i no n'hi tenia mai prou...

**[120]** ★ Has obtingut una PRUNA DAURADA.

---

## El Gran Til·ler, la Cirosa i els pastors

### boiraTiller  <sub>(js/dialegs.js:1661)</sub>

**[121] Ineu:** Provaré amb el beuratge de la Joaneta.

**[122] Ineu:** Ha funcionat! El camí del Gran Til·ler torna a ser net.

**[123] Ineu:** No hi puc passar. Aquesta boira no és de les que marxen amb el vent: per desfer-la em caldria algun líquid, una poció... alguna cosa que no tinc.

### tiller  <sub>(js/dialegs.js:585)</sub>

*Si: encara no ha parlat amb el Gran Til·ler*

**[124] El Gran Til·ler:** Fa tres-cents anys vaig veure aquella gàbia baixar a la foscor, petit monjo. I des d'aleshores no he tancat mai els ulls.

**[125] El Gran Til·ler:** Ara sento la terra esquerdar-se sota les meves arrels. Els vells cementiris s'obren, i en surt tot allò que hi dormia: no ve amb bones intencions.

**[126] El Gran Til·ler:** El teu bastó de pelegrí és bo per a un camí tranquil. Aquest ja no ho és. Alça els ulls, petit monjo.

**[127] El Gran Til·ler:** Una branca meva, enfortida per tres segles de vent i de pena. Agafa-la: serà més àgil i més viva que cap bastó.

**[128] El Gran Til·ler:** L'arbre que dona una branca no mor. Va créixer per a aquest dia: que et guardi com m'ha guardat a mi.

*Si: encara no porta el bastó del Til·ler*

**[129] El Gran Til·ler:** La branca és a terra, a prop de les meves arrels. Agafa-la, petit monjo.

*Si: ha fet el sopar del Til·ler ; (depèn d'un càlcul del joc)*

**[130] El Gran Til·ler:** El permís és teu, petit monjo, i les espelmes continuen enceses. Recorda a taula qui hi falta.

**[131] El Gran Til·ler:** El permís és teu, petit monjo, i les espelmes continuen enceses. Recorda a taula qui hi falta. Que Runna et sigui lleu.

*Si: ha fet el sopar del Til·ler*

**[132] El Gran Til·ler:** Ara, per despertar l'espasa: [text calculat pel joc: pas]

*Si: ha netejat la Bassadòria i encara no ha obert el camí de la Cirosa*

**[133] El Gran Til·ler:** Sento l'aigua cantar de lluny... La Bassadòria és neta. Has fet bé, petit monjo.

**[134] El Gran Til·ler:** El camí del nord-est cap a la Cirosa el vaig tancar jo amb les meves arrels, perquè la boira no hi pugés. Ara que l'aigua respira, pots passar: les arrels només reconeixen la meva branca. Colpeja-les amb ella i s'enfonsaran.

**[135] El Gran Til·ler:** A la Cirosa viuen uns pastors desterrats que guarden les esquelles dels seus avis: amb elles es van afinar els cants antics. Tracta'ls amb dolçor, que ja han patit prou.

**[136] El Gran Til·ler:** I vés amb compte: el Germà Aldreu hi puja de nit per un pas que jo no vigilo, i porta la boira a dins. L'Home de la Gàbia li parla a cau d'orella, i ell l'escolta.

*Altrament (per defecte):*

**[137] El Gran Til·ler:** Et donaré el meu permís quan hagis tornat la vida a la terra que la boira ha emmalaltit. Has tornat l'aigua: encara en falta, de terra.

### branca  <sub>(js/dialegs.js:633)</sub>

**[138]** ★ Has obtingut la BRANCA DEL TIL·LER!

### arrelsTiller  <sub>(js/dialegs.js:1675)</sub>

*Si: encara no porta el bastó del Til·ler*

**[139] Ineu:** Són les arrels del Gran Til·ler. El bastó de pelegrí no les mourà... però potser reconeixerien una branca del mateix arbre.

*Si: encara no ha netejat la Bassadòria*

**[140] Ineu:** Les arrels s'han estremit en reconèixer la branca, però no s'enfonsen. Sembla que esperen alguna cosa: potser que l'aigua clara de la Bassadòria torni a respirar.

### cartellCirosa  <sub>(js/dialegs.js:866)</sub>

*Si: ha obert el camí de la Cirosa*

**[141] Cartell:** ↑ La Cirosa (camí llarg, tot el camí amunt) / ← La Caseta / ↓ Les Cel·les

*Si: encara no ha obert el camí de la Cirosa*

**[142] Cartell:** ↑ La Cirosa / ← La Caseta

### pastorA  <sub>(js/dialegs.js:1204)</sub>

**[143] Pastor:** M'han assegut a taula... M'han passat el pa. Fa cinquanta anys que ningú no em passava el pa.

**[144] Pastor:** El ramat és de nou al corral. No sé com agrair-t'ho, monjo. Nosaltres només volem una mica de pau, i un racó on no ens miri ningú malament.

**[145] Pastor:** No s'acosti gaire, pare, que la gent diu que portem mala sort. Només tenim el ramat... i el Germà Aldreu, aquell monjo pesat que sempre jugava amb els nens, ens l'ha pres. Ara es fa dir el Pastor de Boira.

### pastorB  <sub>(js/dialegs.js:1214)</sub>

**[146] Pastora:** Hi havia flors a la taula. Feia tant de temps que no veia flors a una taula.

**[147] Pastora:** Teníem terres a la plana, i pous, i una casa amb llar de foc. Ho vam perdre tot, i el poble ens va girar l'esquena. Aquí dalt, almenys, no ens esquiven.

**[148] Pastora:** No fem mal a ningú. Només intentem refer el que ens queda.

### pastorVell  <sub>(js/dialegs.js:1225)</sub>

*Si: encara no ha vençut el Pastor de Boira*

**[149] Pastor vell:** Fill, el Germà Aldreu feia bona cara, però això ja ho portava dins. L'Ocellaire, l'Home de la Gàbia, només li va prometre que tothom el seguiria, i ell se'l va creure.

**[150] Pastor vell:** I no només les ovelles. Fa unes nits el vam veure baixar cap al poble amb un nen adormit als braços. Els nens que falten, fill, se'ls ha endut ell.

**[151] Pastor vell:** Els nostres avis van tancar aquella gàbia sota terra fa segles, i el poble ens va pagar amb oblit.

**[152] Pastor vell:** Si trobes la manera de treure-li aquesta cosa, ho agrairem. Hi ha unes esquelles que van ser dels nostres avis: te les donarem, però el ramat és a la pastura, i ell hi és.

*Si: encara no porta les esquelles*

**[153] Pastor vell:** Has tornat el ramat. El Germà Aldreu ha baixat camí avall rient: encara porta la boira a dins, pobre home. Que Déu t'ho pagui, monjo.

**[154] Pastor vell:** Aquí tens les esquelles dels nostres avis. Que sonin amb la teva tarota, i que els cants antics et guiïn.

**[155]** ★ Has obtingut les ESQUELLES DELS PASTORS!

*Si: ha fet el sopar del Til·ler*

**[156] Pastor vell:** Vam plorar a taula, monjo. Vam plorar com nens. Que l'arbre us beneeixi a tots, també als que no tenim nom.

*Si: ha sentit parlar del sopar del Til·ler i encara no ha convençut els pastors de la Cirosa*

**[157] Pastor vell:** Un sopar, dius? Al Til·ler? Amb els de les cel·les?... No, fill. Nosaltres no som gent per a asseure's amb la gent.

**[158] Pastor vell:** Fa anys que no sentim música vora el foc, ni pastem el pa que fèiem per a les festes. Si algú en toqués... potser ens recordaria que encara som persones.

**[159] Ineu:** Tinc la tarota. Les esquelles dels seus avis van afinar els cants antics... El Cant de Vespres, 5-4-3-1: el tocaré vora el foc, i que sigui el que Déu vulgui.

**[160] Ineu:** Tinc la tarota, però només sé uns pocs cants. Els vells els coneixen tots: potser la Pianista, al Santuari, en sap algun que els faci recordar casa.

*Altrament (per defecte):*

**[161] Pastor vell:** Aquesta pastura torna a ser un lloc tranquil. Gràcies per això.

### pastor_vell  <sub>(js/dialegs.js:1777)</sub>

**[162] Pastor vell:** Les ovelles tornen a ser blanques. Alguna encara té les orelles una mica liles, però ja li passarà.

### pastorsConvencuts  <sub>(js/dialegs.js:1265)</sub>

**[163] Pastora:** Havia oblidat que existia això...

**[164] Pastor vell:** Fa cinquanta anys que ningú no ens convidava enlloc, monjo. Ni a una missa, ni a una taula. I tu ens parles amb música.

**[165] Pastor vell:** Mira: el forn encara és calent. Aquest pa el pastem nosaltres, amb aquestes mans, com abans. Porta'l al teu arbre. I vindrem: no direm gaire cosa, perquè no sabem com es fa, però el pa és el que sabem fer.

**[166]** ★ Has obtingut el PA DELS PASTORS.

### construir  <sub>(js/zones/cirosa.js:132)</sub>

*Si: sap el Cant de Vespres (el de les pedres)*

**[167] Ineu:** (El foc crepita i els pastors callen. Un cant antic vora les brases, el de Vespres, els podria obrir el cor...)

*Si: encara no sap el Cant de Vespres (el de les pedres)*

**[168] Ineu:** (El foc crepita i els pastors callen. Una música antiga vora les brases els podria obrir el cor... Potser la Pianista, al Santuari, en coneix alguna.)

### masiaTaula  <sub>(js/zones/cirosa.js:9)</sub>

**[169] Ineu:** (Per als que no tenen nom. Algú se n'ha recordat.)

### masiaLlibre  <sub>(js/zones/cirosa.js:14)</sub>

**[170] Llibre:** «L'Ocellaire baixava cada primavera amb els seus ocells engabiats. Els nens reien amb ells; després ja no reien amb res. Hi va haver anys de plors a les cases.»

**[171] Llibre:** «Els pastors i els monjos el vam tancar dins la seva gàbia, sota terra, i un monjo va segellar la porta amb la llum de l'espasa. El poble va estar content tres dies. Després va voler algú a qui culpar, i ens va culpar a nosaltres.»

**[172] Llibre:** «Que qui trobi això no ens oblidi: vam obrir els ulls abans que ningú. Només vam fer el que calia.»

### masiaEsquelles  <sub>(js/zones/cirosa.js:21)</sub>

**[173] Ineu:** (El pastor vell les té. Li he de parlar vora el foc.)

**[174] Ineu:** (Qui sap on són ara. Potser els pastors les guarden.)

### aldreuPastor  <sub>(js/dialegs.js:1330)</sub>

**[175] Aldreu, Pastor de Boira:** Ineu!

**[176] Ineu:** Germà Aldreu?!

**[177] Aldreu, Pastor de Boira:** L'Aldreu era un monjo que ningú no mirava. Ara sóc el Pastor de Boira. Mira'ls, com em segueixen. Ningú no m'havia seguit mai.

**[178] Aldreu, Pastor de Boira:** Des que va pujar la boira, una veu em parla dins el cap, baixeta, només per a mi. Ella em va veure quan ningú més no ho feia. És la veu del Mestre.

**[179] Ineu:** Una veu dins el teu cap... Aldreu, és la de l'Home de la Gàbia. L'Ocellaire parla per la teva boca.

**[180] Aldreu, Pastor de Boira:** L'Home de la Gàbia, sí! El Mestre m'ho va prometre: «Tots els que tinguin por et seguiran.» Jo no el trobo a faltar: l'admiro. I ara sóc el seu pastor. El PASTOR!

**[181] Ineu:** On són l'Huri, el Fram i el Sardi?

**[182] Aldreu, Pastor de Boira:** Dormen. Els vaig portar jo al Mestre, un per un, de nit. Allà dins ja no tenen por de res.

**[183] Ineu:** Aldreu, això que et parla no és bo. Encara pots tornar enrere.

**[184] Aldreu, Pastor de Boira:** Tornar enrere? Mai! El Mestre em va veure, quan ningú més no ho feia. Calla! Be-e-e!

### aldreuDerrotat  <sub>(js/dialegs.js:1347)</sub>

**[185] Aldreu, Pastor de Boira:** Has guanyat aquesta, monjo... Fa trenta anys que ningú no em mirava, i ell sí. Mai no li fallaré.

**[186] Aldreu, Pastor de Boira:** El Mestre és al fons de les Gírgoles, i ja és despert: la seva veu em crida des d'allà baix i no calla mai. Vine, si goses: els nens ja són seus, i jo només sóc el primer dels seus ocells.

**[187] Aldreu, Pastor de Boira:** Je, je, je... Ens veurem allà baix, monjo.

**[188] Ineu:** («Al fons de les Gírgoles»... Ara ja sé on mirar.)

**[189] Ineu:** (I el pastor vell em va prometre les esquelles dels seus avis. Aniré a veure'l vora el foc.)

### tillerSoparIntro  <sub>(js/dialegs.js:1276)</sub>

**[190] El Gran Til·ler:** Has portat música al lloc on feia anys que no n'hi havia. Això em fa pensar en el sopar.

**[191] El Gran Til·ler:** Un cop l'any, a la tardor, la gent de les cel·les s'asseu sota les meves branques i menja plegada. Ho anomeneu el sopar del Til·ler. Jo no menjo, però escolto. Tota la saviesa d'un arbre és escoltar la gent que menja junta.

**[192] El Gran Til·ler:** Aquest any ningú no té ganes de taula: tres cadires buides, i el poble amb por. La boira s'alimenta de la solitud, petit monjo. I no val a mitges: la taula ha d'estar plena.

**[193] El Gran Til·ler:** Fa tres-cents anys, quan van tancar la gàbia, els pastors de la Cirosa s'asseien aquí amb els monjos i els pelegrins. Després els van foragitar, i van oblidar que també eren de la casa. Que vingui el menjar de cada llar, també el seu. I que hi hagi flors.

**[194] El Gran Til·ler:** Porta l'escudella de la Meus, les flors d'Isílder i el pa que els pastors de la Cirosa pasten amb les seves mans. Llavors, i només llavors, et donaré el meu permís.

**[195] El Gran Til·ler:** Però els pastors no s'asseuran a taula només amb paraules: fa anys que no senten música vora el foc. Abans de tornar-hi, ves a veure la Pianista del Santuari: guarda un cant tan vell com ells.

### tillerSoparFalta  <sub>(js/dialegs.js:1287)</sub>

**[196] El Gran Til·ler:** La taula encara no és plena, petit monjo. Menjar sol és només alimentar-se; per això hem de ser tots.

### tillerSoparPreparat  <sub>(js/dialegs.js:1293)</sub>

**[197] El Gran Til·ler:** Ho has portat tot. Que es faci el sopar.

### tillerSoparRitual  <sub>(js/dialegs.js:1301)</sub>

**[198] Meus:** Aquest any l'escudella té gust de poc, fill: hi falta l'alegria de tres nens. Que ens ho perdonin els tres, allà on siguin.

**[199] Isílder:** He posat les flors de lluna al mig, com cada any. Aquest cop són per l'Huri, pel Fram... i pel meu Sardi.

**[200] Les Venerables Sàvies:** Sempre fem el mateix, fill: una espelma per cada cadira buida a la taula. Enguany en són tres: l'Huri, el Fram i el Sardi. Encén-les tu: ets tu en qui tenim les nostres esperances posades.

**[201] Pastor vell:** Fa molts anys que a nosaltres ningú no ens guardava cap cadira a cap taula. Gràcies per asseure'ns, fill.

**[202] El Gran Til·ler:** Aquesta és la saviesa que et volia donar, petit monjo: ningú no es perd del tot mentre algú el recorda a taula. La gàbia de l'Ocellaire només s'omple de qui s'ha quedat sol.

**[203] El Gran Til·ler:** Rep el meu permís. Que et sigui lleu, i que no et faci oblidar mai que vas menjar amb tots.

**[204] El Gran Til·ler:** Entre les meves branques hi custodio, des de temps immemorials, un medalló de pedra amb una fulla tallada: el permís de l'arbre. Fa segles que espera algú que s'assegui a taula amb tothom. Agafa'l.

**[205]** ★ Has obtingut el MEDALLÓ DE L'ARBRE!

---

## Les Cel·les: la Meus, el senyor Llaminer, les Venerables i la Carry

### construir  <sub>(js/zones/cela.js:92)</sub>

**[206] Ineu:** (Semblen els plànols d'una mena d'artefacte per mirar les estrelles.)

### meus  <sub>(js/dialegs.js:507)</sub>

*Si: ha sentit parlar del sopar del Til·ler i encara no té l'escudella de la Meus*

**[207] Meus:** El sopar del Til·ler? Ai, Ineu, i qui té ganes de taula, aquest any! Amb tres nens que falten...

**[208] Meus:** ...Però el Til·ler té raó, maleït sigui. No es pot deixar de fer el que s'ha fet sempre, ni quan el cor fa mal. Pren l'escudella, i no la vessis!

**[209] Meus:** És l'escudella de cada any, la de les nostres àvies, però enguany té un gust que no voldria explicar. Tu tingues-ne cura de portar-la sencera.

**[210]** ★ Has obtingut L'ESCUDELLA DE LA MEUS.

*Altrament (per defecte):*

**[211] Meus:** Ineu, fill, no t'hi quedis plantat! L'Huri i el Fram dormien aquí mateix, a Sant Benet, porta amb porta, i ara no hi són. I ningú no fa res!

**[212] Senyor Llaminer:** Meus, deixa'l respirar...

**[213] Meus:** Tu calla, que ets tan pesat com el cafè d'ahir. Ineu, busca'ls.

**[214] Meus:** Ja els tinc a casa, i ja els he renyat tres vegades. Dues més i potser els deixo sortir a jugar.

**[215] Meus:** Gràcies, Ineu. No ho diré gaires cops, així que escolta'm bé: gràcies.

### molner  <sub>(js/dialegs.js:527)</sub>

**[216] Senyor Llaminer:** Sí, Meus. No, Meus. Ara vinc, Meus.

**[217] Senyor Llaminer:** ...Ah, Ineu. Ets tu. Fes cas del que digui ella. Sempre té raó. Sempre.

**[218] Senyor Llaminer:** Des que han tornat els nens, la Meus canta mentre renta. Desafina, però canta.

**[219] Senyor Llaminer:** No li diguis que t'ho he dit.

### consellVenerables  <sub>(js/dialegs.js:40)</sub>

*Si: encara no té la clau del campanar*

**[220] Les Venerables Sàvies:** Ai, fill, has vist que el rellotge de la torre s'ha aturat? La porta del retaule que duu a la torre fa anys que és tancada: des que el rellotger se'n va anar, la clau la guarda la seva vídua, la Carry, aquí a Nostra Senyora.

*Si: encara no té la clau del campanar ; ha parlat amb la Carry*

**[221] Les Venerables Sàvies:** Pobreta, no té el cap per res: fa dues nits que busca el seu gos, el Pallofa. Si el trobes i li'l portes, segur que et dona la clau.

*Si: encara no té la clau del campanar ; encara no ha parlat amb la Carry*

**[222] Les Venerables Sàvies:** Parla-hi, però amb paciència: la pobreta no és la mateixa des que va pujar la boira. Potser et pot necessitar.

*Altrament (per defecte):*

**[223] Les Venerables Sàvies:** Ai, fill, torna a seure. A veure... [pista del pas següent de la història: vegeu la Ruta]

### premiMonja  <sub>(js/dialegs.js:79)</sub>

*Si: ha rebut el premi de la Dolora i ha rebut el premi de la Pilària i ha rebut el premi de la Carmèlia ; (depèn d'un càlcul del joc)*

**[224]** ★ Has obtingut un GRA DEL ROSARI: la llum de les tres germanes.

### carry  <sub>(js/dialegs.js:538)</sub>

**[225] Carry:** El Pallofa no em deixa ni a sol ni a ombra, ara. Gràcies, Ineu. I no t'oblidis del rellotge: sense hora, tot es fa més llarg.

*Si: porta l'encàrrec del Pallofa*

**[226] Carry:** Pallofa! Pallofa meu! On t'havies ficat, bestiola? Mira't: més prim que jo i ple de puces.

**[227] Carry:** Gràcies, Ineu, gràcies. Diners no en tinc, però et dec una cosa. Aquelles nits vaig veure, des de la finestra, el que no hauria de veure ningú.

**[228] Carry:** L'Huri, el petit de la porta de la dreta de Sant Benet, va ser el primer. El seu llit va quedar buit i la finestra, tancada per dins. Ell no sortia mai sol de nit: li feia por la fosca.

**[229] Carry:** La nit següent va ser el Fram, el de la porta de l'esquerra. El Pallofa va lladrar a la boira, com si veiés algú que jo no veia, i va marxar darrere seu. Per això he tingut tanta por.

**[230] Carry:** El meu home era el rellotger, l'encarregat del rellotge. Des que se'n va anar, la clau de la torre la guardo jo, i fa anys que ningú no hi puja. Pren-la. Aquell rellotge s'ha aturat a un quart de quatre, i ningú no s'ha adonat que el temps ja no passa.

**[231]** ★ Has obtingut la CLAU DE LA TORRE DEL RELLOTGE.

*Altrament (per defecte):*

**[232] Carry:** Encara no l'has vist? És petitó, prim i borni, i no sap estar-se quiet. Diuen que passeja per Sant Antoni. Agafa'l amb compte: està ple de puces.

**[233] Carry:** Ai, Ineu... no, no t'has de preocupar per mi. Bé, sí. Busco el Pallofa, el meu gos.

**[234] Carry:** És petit i prim, blanc amb taques marrons, i li falta un ull: diuen que se'l va menjar un gat. Va marxar fa dues nits, darrere el Fram, i no ha tornat.

**[235] Carry:** A ell li agrada passejar. Si el trobes, porta-me'l. Diners no en tinc, però a casa guardo una cosa que potser et farà falta.

**[236] Carry:** El Pallofa ja no s'escapa: des que no hi ha boira, no té res a perseguir.

### pallofa  <sub>(js/dialegs.js:574)</sub>

**[237] (narrador):** Un gos petit, prim i borni, ple de puces, et mira amb l'únic ull que li queda. Al collaret de cuir hi ha una placa: «PALLOFA».

**[238]** ★ Has agafat el PALLOFA. Duu-lo a la Carry.

### llac  <sub>(js/dialegs.js:1450)</sub>

**[239]** ★ Has trobat un llaç de la nena (

---

## La Taverna: l'Eve, el senyor Buidor i l'Iscu

### construir  <sub>(js/zones/taverna.js:42)</sub>

**[240] Cartell:** ← L'Hostatgeria i l'Era / → Els arcs de la Casa Gran

### portaTaverna  <sub>(js/zones/taverna.js:84)</sub>

**[241] Nota:** «Avui no servim. — Càren»

**[242] Ineu:** Des de dins se sent un fil de música d'acordió, molt baixet... i una olor de fregit.

**[243] Eve:** Psst! Tu ets l'Ineu, oi? El monjo que pregunta pels nens. Entra, de pressa, que la Càren dorm i no vull que ens vegin.

### eve  <sub>(js/zones/taverna.js:95)</sub>

*Si: encara no ha parlat amb l'Eve*

**[244] Eve:** Sóc l'Eve. Faig la feina de la Càren, que dorm des que va arribar la boira. T'he fet entrar per una cosa: cada nit, quan tot és tancat, el Germà Aldreu pica tres cops a la Porta de les Gírgoles, i la porta s'obre sola. A dins, diuen, n'hi ha una altra de ferro, molt vella, que ningú no ha obert mai.

**[245] Eve:** I l'Iscu, el fill de la Càren, fa dos dies que s'escapa pel camí de la Desaparició: diu que hi ha un forat entre els arbres «per on els grans no hi caben». Aquest no l'ha pres la boira, sinó la mandra: des que la seva mare dorm, els gots els frego jo, i ell s'esfuma. Si el trobes, digues-li que torni a sopar... i a fregar.

**[246] Eve:** El Sardi, en canvi, ve cada tarda a berenar pa amb xocolata. Ahir no va venir.

*Altrament (per defecte):*

**[247] Eve:** L'Iscu? Ja t'ho vaig dir: surt pel camí de la Desaparició, a l'oest de les Runes, i s'amaga per un forat entre els arbres «per on els grans no hi caben». Si el trobes, digues-li que torni a sopar.

**[248] Eve:** Aquesta clau... és de ferro vell, com la porta de fora, la de la Porta de les Gírgoles! L'has trobada a la Casa Gran? La porta és a la Sala de les Gírgoles: des del Pati del Celler, el camí de l'est, entre els arbres.

*Si: sap el Cant del Miracle*

**[249] Eve:** I la Pianista t'ha ensenyat el cant. Vés amb compte, allà dins.

*Si: encara no sap el Cant del Miracle*

**[250] Eve:** Abans d'entrar-hi, passa pel Santuari: la Pianista sempre diu que hi ha un cant per a cada porta.

*Altrament (per defecte):*

**[251] Eve:** Aquesta espasa brilla com si estigués contenta. Amb això potser obriríem la porta... però el pany és de clau. Una clau de ferro, grossa.

**[252] Eve:** L'Isílder diu que els monjos ho amagaven tot a la Casa Gran. Potser la clau també.

**[253] Eve:** No et puc ajudar a obrir la porta de ferro: no té pany per a cap clau que hi hagi a la Taverna. Diuen que els monjos la van tancar amb una espasa que brilla.

**[254] Eve:** Busca aquesta espasa, Ineu. Jo em quedo aquí, fent veure que treballo.

### eve  <sub>(js/dialegs.js:1775)</sub>

**[255] Eve:** El Sardi ja torna a berenar aquí cada tarda. La Càren encara dorm, però ronca més contenta.

### senyorBudo  <sub>(js/dialegs.js:1017)</sub>

**[256] Senyor Buidor:** Xxt... ¿El Galf? Ah, sí. Vol el cristall de gel de l'ermita de Sant Gabriel, oi? Sempre ha tingut ganes de mirar el cel.

**[257] Senyor Buidor:** Jo hi vaig ser sagristà molts anys, fins que ja no vaig poder amb els graons. Tinc la clau a la butxaca des d'aleshores: ningú no me l'ha demanada mai.

**[258] Senyor Buidor:** Té. Però tanca bé, que el pany és vell. I no t'enduguis res més que el cristall.

**[259]** ★ Has obtingut la CLAU DE SANT GABRIEL.

**[260] Senyor Buidor:** Xxt... baixa la veu, noi, que m'estic fotent un anís escarxat. Me l'ha preparat l'Eve, i això no es beu: s'assaboreix.

**[261] Senyor Buidor:** Una mica de gel, un raig d'aigua, i deixar-lo fer. Les coses bones no tenen pressa. Jo en sé, d'esperar: fa seixanta anys que m'assec en aquesta taula.

**[262] Senyor Buidor:** Des que la Càren dorm, l'Eve porta la taverna sola i no es queixa mai. Això és de gent de molt bona fusta.

**[263] Senyor Buidor:** Ara calla, noi, que se m'acaba l'anís.

### iscu  <sub>(js/dialegs.js:224)</sub>

**[264] Iscu:** Ei, espera. Tinc una cosa que potser et va bé. Una nit, passant per davant la porta de ferro de les Gírgoles, vaig veure una clau a terra: li havia caigut al Germà Aldreu i ni se'n va adonar.

**[265] Iscu:** És rovellada, però encara gira. Te la dono: jo no tinc res a obrir.

**[266]** ★ Has obtingut la CLAU ROVELLADA

**[267] Iscu:** Crec que és per a la porta petita del fons, la del pany petit. Allà baix, diuen, hi ha una boira que cou: les sacerdotesses de l'Hostatgeria en saben. I tu no m'has vist, eh?

*Si: encara no ha trobat l'Iscu*

**[268] Iscu:** Xxt! Baixa la veu! Si l'Eve em troba, em fa fregar gots fins a Nadal.

**[269] Iscu:** Em dic Iscu. Vaig trobar el forat entre els arbres «per on els grans no hi caben» i aquesta cabana. Ningú més no la coneix: aquí ningú em mana res!

**[270] Iscu:** Hi havia una baralla vella damunt la taula, i m'encanta fer solitaris amb les cartes. Més val això que fregar gots!

*Altrament (per defecte):*

**[271] Iscu:** Em passaria tot el dia fent solitaris amb aquestes cartes. I aquí, almenys, no hi ha gots per fregar.

**[272] Iscu:** M'ha sortit el solitari! M'encanta això de les cartes. Ara ja no cal que m'amagui tant...

---

## Acte 2: el Celler i en Jusef

### cartellRuinesPingpong  <sub>(js/dialegs.js:423)</sub>

**[273] Cartell:** ← Camí de la Desaparició / → Cementiri / ↑ Cel·les / ↓ El Celler i la Plaça

### cartellCeller  <sub>(js/dialegs.js:424)</sub>

**[274] Cartell:** ← El Celler (ping-pong) / → Sala de les Gírgoles / ↑ Les Runes / ↓ Plaça

### julius  <sub>(js/dialegs.js:431)</sub>

**[275] Julius:** Ei, Ineu! El repte més gran del Miracle és derrotar el Jusef i el seu servei màgic. T'hi atreveixes?

**[276] Julius:** El Senyor Pomers juga amb una pala de pedra. De pedra! I tot i així, em guanya fàcilment.

### pomers  <sub>(js/dialegs.js:441)</sub>

**[277] Senyor Pomers:** Calma, noi. La pilota no s'ha de perseguir, s'ha d'esperar.

**[278] Senyor Pomers:** Jo jugo amb una pala de pedra. De pedra, sí: pesa com un maó i no té goma ni res. Quan jugueu a la taula, no em veuràs ni a mi ni la pala; no cal.

**[279] Senyor Pomers:** Perquè amb què es juga és igual. La pala només és una extensió de l'ànima. El que compta és l'esperit del joc, la màgia que portes dins.

### jusef  <sub>(js/dialegs.js:450)</sub>

**[280] Jusef:** La taula és teva quan vulguis, noi. Vols provar de tornar-me el servei un altre cop?

**[281] Jusef:** Benvingut al Celler, viatger. Les pales i la pilota només són l'escorça: el que jo practico aquí és màgia blanca.

**[282] Jusef:** Aquest és el meu servei màgic. Fins ara ningú ha aconseguit aturar-lo.

**[283] Jusef:** Vols provar-ho? Una partida, a onze punts.

**[284] Jusef:** Com vulguis. La taula ja no se'n va enlloc.

### jusefGuanyat  <sub>(js/dialegs.js:471)</sub>

**[285] Jusef:** M'has tornat a derrotar, has entès perfectament la màgia del meu servei. Quan vulguis, tornem-hi.

**[286] Jusef:** M'has... m'has vençut... El meu servei màgic, per primer cop... M'has vençut amb tota justícia.

**[287] Jusef:** Això és per a tu: el Llum d'en Mamet. En Mamet era un vell ermità del Miracle que coneixia tots els passos subterranis i les escletxes dels murs.

**[288] Jusef:** La seva flama s'alimenta d'un oli antic que mai no s'apaga. Als passadissos tenebrosos i a la foscor de les pedres velles, la seva claror et farà visible allò que sembla ocult.

**[289]** ★ Has obtingut el LLUM D'EN MAMET.

**[290] Jusef:** I un secret, per qui sap tornar un servei: aquella roda de carruatge del Celler no és decoració. Darrere hi ha el túnel dels monjos cap a la Casa Gran. Però pesa com un carro ple.

### jusefPerdut  <sub>(js/dialegs.js:497)</sub>

*Si: (depèn d'un càlcul del joc)*

**[291] Jusef:** Ja te'n vas? La taula no fuig. Torna quan vulguis.

**[292] Jusef:** Bona partida, monjo. Però el servei encara és meu. Torna-hi quan vulguis: el Julius diu que la segona vegada sempre surt millor.

---

## Acte 2: les Runes, l'ombra del monjo i el Saber

### ruines  <sub>(js/dialegs.js:408)</sub>

**[293] Ineu:** (Hi ha massa boira al forat com per veure-hi res... Em cal una llum.)

**[294] Ineu:** (El Llum d'en Mamet forada una mica la tenebra... Al fons hi ha un full clar, amagat!)

**[295]** ★ Has obtingut el PERGAMÍ PARTIT (1/2).

**[296] Pergamí:** Un pergamí esquinçat (fragment 1 de 2): / «Quan l'Ocellaire va ser tancat a la seva gàbia, un monjo va segellar la porta de ferro amb la llum de l'espasa Runna i la va deixar dormint a la pedra. Després va amagar la clau de la porta allà on ningú no la trobés. / L'altra meitat d'aquesta crònica la deixo sota clau, al sagrari de l'església.»

**[297] Ineu:** El pergamí s'acaba aquí, però diu que l'altra meitat és sota clau, al sagrari de l'església. I cada nit, diuen, a aquest mur s'hi veu l'ombra d'un monjo.

**[298] Ineu:** L'ombra del monjo ha aparegut en llegir el pergamí... És el monjo del segell? Quan tingui l'altre fragment, el Pare Alcoví sabrà llegir-los junts.

### pedraMobil  <sub>(js/zona_base.js:1885)</sub>

*Si: (depèn d'un càlcul del joc)*

**[299] Ineu:** [text calculat pel joc: textPista]

### ombraMonjo  <sub>(js/dialegs.js:759)</sub>

*Si: encara no ha sentit que l'ombra del monjo demana un cant*

**[300] Monjo:** Fa segles que no sento parlar cap llengua que no siguin les pedres. Només el cant de les pedres em desperta del tot.

*Si: encara no ha sentit que l'ombra del monjo demana un cant ; sap el Cant de Vespres (el de les pedres)*

**[301] Monjo:** Qui toca l'orgue el coneix, i tu ja el portes a la tarota. Canta-me'l aquí, petit monjo.

*Si: encara no ha sentit que l'ombra del monjo demana un cant ; encara no sap el Cant de Vespres (el de les pedres)*

**[302] Monjo:** Qui toca l'orgue el coneix. Aprèn-lo, petit monjo, i torna a cantar-me'l aquí.

*Altrament (per defecte):*

**[303] Ineu:** Toca el Cant de Vespres amb la tarota: 5-4-3-1.

### benedicioMonjo  <sub>(js/dialegs.js:779)</sub>

**[304] Monjo:** Jo era el qui va tancar la porta. Quan van obrir el cementiri, rient, els meus germans van deixar de descansar i el segell es va esquerdar.

**[305] Monjo:** Sota terra hi ha una gàbia, petit monjo, i una cosa que no ha oblidat cap cant ni cap nen. Jo només puc vigilar. Tu pots tornar a tancar-ho.

**[306] Monjo:** L'espasa dorm al sud-est, entre pedres, allà on el sol s'atura. Rep la meva paraula, que no pesa ni es veu, i recorda: la foscor tem la llum, però més encara el riure.

**[307] Monjo:** Jo només puc dir-te les paraules; el Pare Alcoví sabrà entendre-les. Quan les cridis davant l'espasa, la meva paraula farà que et reconegui.

**[308] Monjo:** Ara ja puc descansar en pau.

**[309]** ★ Has rebut la PARAULA DE L'OMBRA.

### pareAlcovi  <sub>(js/dialegs.js:667)</sub>

*Si: (depèn d'un càlcul del joc)*

**[310] Ineu:** Pare Alcoví, a la placa del Dolmen hi diu que només podrà alçar Runna qui posseeixi el permís de l'arbre sagrat, les paraules del saber i la benedicció divina. Què vol dir?

**[311] Pare Alcoví:** Això ho tinc a la Crònica, fill. Deixa'm que t'ho llegeixi.

**[312] Crònica:** «Per alçar l'espasa calen tres coses: el permís de l'arbre més vell, que seu a taula amb tothom; les paraules que el monjo va deixar, que només entén qui ha parlat amb la seva ombra; i la benedicció del prior, que és la de Déu passada per les mans dels homes.»

**[313] Pare Alcoví:** L'arbre sagrat és el Gran Til·ler, el de les cel·les: el seu medalló és el permís. Les paraules les guarda l'ombra del monjo, a les Runes, i només jo sabré entendre-les quan te les digui. I la benedicció divina és la del Pare Jordà, el prior.

**[314] Pare Alcoví:** I ara, el que et toca: [text calculat pel joc: pas]

*Si: ha aconseguit Runna i encara no ha trobat segellada la tomba de l'Ocellaire*

**[685] Pare Alcoví:** La tomba, fill. Mentre l'esquerda del Cementiri treu boira no et puc llegir la resta de la Crònica. Colpeja-la amb Runna i torna.

**[686] Ineu:** Pare Alcoví, ja tinc Runna. Ara, què més diu la Crònica?

**[687] Pare Alcoví:** Deixa'm mirar-ho un cop més.

**[317] Crònica:** «Amb la llum de Runna van tancar la porta, i amb la mateixa llum van tancar la seva tomba. Mentre l'esquerda treu boira, la porta no és del tot closa.»

**[318] Pare Alcoví:** La tomba és al Cementiri, darrere del Santuari i el Monestir, i treu boira per l'esquerda. Fins que no sigui tancada no et puc llegir la resta: la boira esborra les paraules que et caldran.

**[688] Pare Alcoví:** Colpeja l'esquerda amb Runna, fill, i torna a veure'm.

*Si: ha aconseguit Runna i ha trobat segellada la tomba de l'Ocellaire i encara no ha llegit la tomba dels monjos*

**[689] Ineu:** Pare Alcoví, he segellat la tomba amb Runna: la boira ja no puja.

**[690] Pare Alcoví:** Ho has fet bé, fill. Amb la llum de Runna van tancar la porta, i amb la mateixa llum, la tomba. Ara ja et puc dir la resta.

**[674] Pare Alcoví:** I una cosa més, fill, que no és de la Crònica sinó d'un amic. Al Pare Xèvius, el vigilant de la porta de les Gírgoles, el conec de fa quaranta anys: no és dolent, sinó escarmentat. Fa trenta anys l'Aldreu el va enganyar amb bones paraules, i des d'aleshores no es fia de ningú. Entén-lo, i no t'ho prenguis a mal.

**[675] Pare Alcoví:** No et deixarà passar sense una prova de bona voluntat, i res no el convenç com la Carta del Cortiner, que reposa al tronc del Pi dels Tres Cants. Hauràs de despertar el pi amb els tres cants: Aurora, Vespres i Miracle. Fes-ho abans d'anar a la porta, que després no hi ha manera de tornar enrere.

**[673] Pare Alcoví:** Ja a dins, hi ha dues proves més: la boira que crema, que només la travessa qui duu l'Empara de les sacerdotesses de l'Hostatgeria (els guants del Germà Francí t'ajudaran a guanyar-te-la), i la gàbia, els barrots de la qual només escolten el Cant del Miracle. No baixis sense tot plegat.

*Si: ha fet llegir els pergamins al Pare Alcoví i ha rebut la benedicció de l'ombra del monjo i encara no ha rebut el Saber (les paraules del monjo)*

**[319] Pare Alcoví:** Has parlat amb l'ombra, oi? Fa temps que ho sospitava. A la Crònica hi ha un marge que no vaig saber llegir: una paraula esborrada, de la mateixa mà que va escriure els fragments.

**[320] Pare Alcoví:** Amb la paraula que t'ha donat, ara ho entenc. «La foscor tem la llum, però més encara el riure.» Aquestes són les paraules que desperten Runna, fill: no és un conjur, és una veritat. Digues-les davant l'espasa, senceres i amb tot el cor.

**[321] Pare Alcoví:** I una cosa més, fill. Fa anys, a la biblioteca, vaig trobar un compartiment secret dins el llibre més antic de tots, i hi havia això: un medalló de pedra amb un llibre obert tallat. Té centenars d'anys.

**[322] Pare Alcoví:** No sabia per a què servia. Ara sí: porta'l a la placa del Dolmen, i guarda les paraules dins teu per al moment de dir-les.

**[323]** ★ Has obtingut el MEDALLÓ DEL SABER!

*Si: ha fet llegir els pergamins al Pare Alcoví ; ha rebut el Saber (les paraules del monjo)*

**[324] Pare Alcoví:** Ja saps les paraules, fill. Ara només cal que arribi el dia de cridar-les.

*Si: ha fet llegir els pergamins al Pare Alcoví ; encara no ha rebut el Saber (les paraules del monjo)*

**[325] Pare Alcoví:** Els dos fragments expliquen el mateix, fill: algú vigila el segell des de fa segles. Ves a les Runes i no tinguis por de l'ombra. […]

*Si: (depèn d'un càlcul del joc)*

**[326] Pare Alcoví:** Has trobat els dos fragments! Deixa'm llegir-los... Sí. Ho explica la Crònica que guardo a la biblioteca: un monjo va segellar la foscor amb la llum de l'espasa Runna.

**[327] Crònica:** «Des que la tercera església va quedar inacabada, l'ombra del monjo es veu clarament sobre el mur de les Runes: mig corbat, amb les mans unides, com si pregués. Apareix cada nit.»

**[328] Pare Alcoví:** L'ombra del monjo... No fa mal a ningú, Ineu. Crec que és el monjo que va segellar la foscor amb la llum de Runna. Ves a les Runes, passat el Pati del Celler: és sobre el mur de l'església inacabada. Parla-hi.

*Altrament (per defecte):*

**[329] Pare Alcoví:** Ineu, fill. Aquesta boira no és natural. Les boires d'aquí baixen de les muntanyes; aquesta puja de sota terra.

**[330] Pare Alcoví:** Diuen que cada nit apareix l'ombra d'un monjo a les Runes. Hi ha dos fragments d'una crònica antiga escampats pel Santuari: un a les Runes i un altre al sagrari de l'església. Porta-me'ls i els llegirem junts.

### construir  <sub>(js/zones/cementiri.js:74)</sub>

**[331] Cartell:** ← Les Runes / ↓ El Monestir

### alAtacar  <sub>(js/zones/cementiri.js:139)</sub>

**[332] Ineu:** (L'esquerda s'ha tancat i la boira ja no puja a la superfície. Els qui van tancar la porta tornen a descansar.)

**[333] Ineu:** (Sense la boira que sortia d'aquí, la veu de l'Home de la Gàbia ja no arriba tan lluny, i les portes que ella obria soles ja no s'obriran. Però la boira que ja s'ha acumulat sota terra, a les Gírgoles, hi continua tancada.)

### creuCementiri  <sub>(js/dialegs.js:1725)</sub>

**[334] Ineu:** «Els monjos del Miracle, d'ara i d'abans.»

*Si: porta el ram*

**[335] Ineu:** Aquest ram és del Germà Francí, per als monjos que dormen aquí. El deixo als peus de l'àngel.

**[336] Ineu:** (Els pètals tremolen, com si algú respirés a prop. L'àngel, que mirava a terra, alça la cara al cel i somriu: ja no plora sol.)

**[337] Ineu:** El Germà Francí es posarà content. Va dir que, en tornar, tindria alguna cosa per a mi a Sant Antoni.

**[338]** ★ Has deixat el RAM DE FLORS als peus de l'àngel.

### lapida  <sub>(js/dialegs.js:1749)</sub>

**[339] Làpida:** [text calculat pel joc: mots[n % mots.length]]

### tombaMonjos  <sub>(js/dialegs.js:1720)</sub>

**[340] Ineu:** «Aquí reposen els qui van tancar la porta.»

---

## Acte 2: l'ermita de la Desaparició i la clau del sagrari

### cartellCami  <sub>(js/dialegs.js:930)</sub>

**[341] Cartell:** Camí de la Desaparició. / "Qui segueix els passos, no torna sol."

### sortidaErmita  <sub>(js/dialegs.js:971)</sub>

**[342] Cartell:** ← L'Era / → Camí de la Desaparició

### columna  <sub>(js/dialegs.js:918)</sub>

*Si: (depèn d'un càlcul del joc)*

**[343] Ineu:** Columna ${n} de 12: ${signe} vol dir «${paraula}». Ja ho tenia apuntat (${total()}/12).

**[344] Ineu:** Columna ${n} de 12. Sota el signe ${signe}, amb lletra petita: «${paraula}». Ho apunto (${total() + 1}/12).

### creuDesaparicio  <sub>(js/dialegs.js:974)</sub>

**[345] Inscripció:** «Dotze paraules guarda el camí. Qui les escolti, trobarà el nom dels que callen.»

### taulaPedra  <sub>(js/dialegs.js:939)</sub>

**[346] Inscripció:** Taula de pedra ${part} de 2: /  / ${mots.join('   ')}

*Si: ha llegit totes les columnes ; ha desxifrat el missatge de les dotze columnes*

**[347] Ineu:** Quan la boira cobreixi el Miracle, els passos dels absents tornaran amb l'alba.

*Si: ha llegit totes les columnes ; encara no ha desxifrat el missatge de les dotze columnes*

**[348] Ineu:** Ja ho tinc sencer. Això són paraules per dir en veu alta... davant l'altar.

*Si: altrament*

**[349] Ineu:** Només entenc les paraules que he apuntat al camí. Els signes que em falten... són a les columnes.

### altarErmita  <sub>(js/dialegs.js:956)</sub>

**[350] Ineu:** «Quan la boira cobreixi el Miracle, els passos dels absents tornaran amb l'alba.»

### cofreAltar  <sub>(js/dialegs.js:962)</sub>

**[351]** ★ Has obtingut la CLAU DEL SAGRARI.

**[352] Ineu:** La clau del sagrari del Santuari! Els monjos la van deixar aquí. Amb això obriré el sagrari del retaule.

### construir  <sub>(js/zones/oest.js:82)</sub>

**[353] Cartell:** Bosc de les Rovelloneres. / «Qui no mira a terra, es perd. Els rovellons creixen sempre vora el bon camí. Si t'equivoques, tornaràs a la primera clariana.»

**[691] Ineu:** (El camí ara és més senzill: només he de seguir els rovellons. Ja no cal que recordi les pistes.)

**[354] Cartell:** ← Rovellonera / «On hi ha rovellons, hi ha pins; on hi ha pins, hi ha camí.»

**[355] Ineu:** La clau del senyor Buidor encaixa al pany. La porta de l'ermita s'obre.

**[356] Ineu:** L'ermita de Sant Gabriel és tancada amb clau.

**[357] Cartell:** → Dipòsits / ↑ La Rovellonera

**[358] Cartell:** → Dolmen / ← Ermita de Sant Gabriel

---

## Acte 2: l'Era, el Galf i el telescopi

### cartellEra  <sub>(js/dialegs.js:1011)</sub>

**[359] Cartell:** ↑ Ermita de la Desaparició / → Hostatgeria / ← Rovellonera

### galf  <sub>(js/dialegs.js:981)</sub>

*Si: té el telescopi*

**[360] Galf:** Mira bé les estrelles amb el telescopi, noi. Els Dipòsits són el millor mirador de la comarca... quan hi puguis arribar.

*Si: ha trobat el cristall de gel*

**[361] Galf:** Un cristall de gel de debò! Fa anys que en buscava un. Dóna'm una estona.

**[362] Galf:** Un telescopi! Amb això veuràs coses que cap monjo no ha vist. Perquè no se't perdi: les estrelles fan camí.

**[363]** ★ Has obtingut el TELESCOPI DEL GALF.

*Si: encara no s'ha assegut al banc del Galf*

**[364] Galf:** Mmm? Ah, un monjo! Seu, seu al banc de davant, que per xerrar s'hi està millor.

*Altrament (per defecte):*

**[365] Galf:** Torna quan tinguis el cristall de gel, noi. L'ermita de Sant Gabriel s'obre amb la clau del senyor Buidor.

**[366] Galf:** Ja t'ho he dit, noi: la clau de l'ermita la té el senyor Buidor, a la Taverna. Va ser el sagristà. Demana-la-hi.

**[367] Galf:** Així sí. Soc el Galf, inventor. Visc a la cel·la de Sant Antoni, però vinc aquí cada dia: és l'únic racó on cap teulada no em tapa el cel. Tinc idees que ni jo entenc.

**[368] Galf:** Si em portes un cristall de gel, et construiré un telescopi per mirar el cel. N'hi ha un a l'ermita de Sant Gabriel.

**[369] Galf:** Però l'ermita és tancada. La clau la tenia el sagristà, el senyor Buidor, que va plegar fa anys i ara es passa els dies a la Taverna. Demana-la-hi de part meva.

**[370] Galf:** Des del telescopi es veu tot el poble, i aquesta nit no hi ha ni un fil de boira.

### cofreGabriel  <sub>(js/dialegs.js:1462)</sub>

**[371] Ineu:** Un cofre petit, tan fred que em fa mal a les mans. El pany és ple de gel i cedeix en tocar-lo. A la tapa hi ha gravat: «La rosada de l'alba no es fon ni a l'estiu.»

**[372]** ★ Has obtingut el CRISTALL DE GEL.

### telescopiMon  <sub>(js/dialegs.js:1473)</sub>

*Si: ha vist tots els estels*

**[373] Ineu:** L'últim estel s'ha apagat damunt del dipòsit de llevant. Hi ha una llum a l'aigua: he d'anar-hi.

*Si: encara no porta el telescopi*

**[374] Ineu:** (Un peu amb tres potes, plantat al mig del mirador. Sembla fet per aguantar alguna cosa... com una mena de trípode.)

*Si: encara no porta el telescopi ; s'ha assegut al banc del Galf*

**[375] Ineu:** (Potser el telescopi del qual m'ha parlat el Galf encaixaria aquí. Cal que me'l construeixi.)

*Si: encara no porta el telescopi ; encara no s'ha assegut al banc del Galf*

**[376] Ineu:** (Algú que entengui d'enginys sabria dir per a què serveix. El Galf, l'inventor de l'Era, potser en sap alguna cosa.)

*Altrament (per defecte):*

**[377] Ineu:** Diuen que per Sant Llorenç el cel plora. Compta les llàgrimes... i potser et mostraran alguna cosa.

### estelDiposit  <sub>(js/dialegs.js:1501)</sub>

**[378]** ★ Has obtingut la LLÀGRIMA DE SANT LLORENÇ.

**[379] Ineu:** Fa la mateixa claror que els set estels... Diuen que la boira no gosa tocar la llum de Sant Llorenç. El camí del Dolmen, a llevant, n'és ple.

### cotxer  <sub>(js/dialegs.js:877)</sub>

*Si: (depèn d'un càlcul del joc)*

**[380] Follet del Carro Verd:** La boira se n'ha anat del tot, monjo. Abans de tornar a la carretera, deixa'm obrir la gàbia del darrere.

**[381] Follet del Carro Verd:** Hi porto els ocells que l'Ocellaire va tancar fa segles. Els meus avis els van recollir i els hem guardat de pare a fill, perquè amb la boira no volien cantar.

**[382] Follet del Carro Verd:** Ja poden cantar. Gràcies per tornar-los el cant.

*Si: (depèn d'un càlcul del joc) ; (depèn d'un càlcul del joc)*

**[383] Follet del Carro Verd:** Mira qui hi ha! Ara ja saps que també paro aquí. Recorda: només puc parar allà on ja ens hàgim trobat.

**[384] Follet del Carro Verd:** Eh, monjo! Aquest trasto me'l va fer el Galf: va amb vapor i no es cansa mai. Si has d'anar lluny, puja. Això sí: només paro allà on ja m'hagis trobat.

*Altrament (per defecte):*

**[385] Follet del Carro Verd:** De moment només conec aquest lloc, monjo. Quan em trobis en un altre, t'hi portaré.

**[386] Follet del Carro Verd:** On anem? Recorda que només puc parar allà on ja ens hàgim trobat.

---

## Acte 2: el Dolmen i Runna

### completarEstels  <sub>(js/estels.js:24)</sub>

**[387] Ineu:** Set estels... i un ocell que s'escapa d'una gàbia oberta. És la nit de les llàgrimes de Sant Llorenç!

### boiraDolmen  <sub>(js/dialegs.js:1514)</sub>

**[660] Ineu:** La Llàgrima de Sant Llorenç fa la claror dels estels. Diuen que la boira no gosa tocar-la... Provem-ho.

**[661] Ineu:** Ha funcionat! La llum de la Llàgrima ha desfet la boira: el camí del Dolmen és lliure.

**[388] Ineu:** Aquí no s'hi veu res. Em caldria una llum que la boira no pogués apagar...

### dolmenBaix  <sub>(js/dialegs.js:1543)</sub>

**[389] Ineu:** (Runna és dalt de la llosa. Potser s'hi pot pujar per darrere.)

### placaDolmen  <sub>(js/dialegs.js:1554)</sub>

**[390] Placa:** Només podrà alçar Runna qui posseeixi el permís de l'arbre sagrat, les paraules del saber i la benedicció divina.

**[391] Ineu:** (El medalló [text calculat pel joc: nom]. [text calculat pel joc: text])

*Si: (depèn d'un càlcul del joc) ; (depèn d'un càlcul del joc)*

**[392] Ineu:** (Encara em falta un medalló per omplir la placa.)

**[393] Ineu:** (Encara em falta [text calculat pel joc: aviat] medallons per omplir la placa.)

*Si: porta l'espasa Runna o ha aconseguit Runna*

**[394] Ineu:** (Els tres medallons continuen al seu lloc, a la placa. L'espasa ja és meva: Runna.)

*Si: altrament*

**[395] Ineu:** (El permís de l'arbre sagrat... les paraules del saber... la benedicció divina. Què voldrà dir tot això? El Pare Alcoví deu saber-ho: ho tindrà escrit a la Crònica.)

**[396] Ineu:** (Tres cercles buits: un per a cada medalló. Em falta: ,  […].)

---

## El pi dels tres cants i la Nena de les Trenes

### piOest  <sub>(js/zones/bosc_pi.js:372)</sub>

**[397] Ineu:** (Unes branques molt baixes, i gruixudes com troncs, baixen fins a terra i barren el camí. Per aquí no hi ha manera de passar.)

**[398] Ineu:** (Totes miren cap a llevant, cap on neix l'alba, i al fons es veu una clariana amb un pi enorme. Si el pi escolta algú, ha de ser pel cantó d'allà. Hauré d'arribar-hi per l'altre costat: per Sant Antoni, potser.)

### piPlaca  <sub>(js/zones/bosc_pi.js:383)</sub>

**[399] Ineu:** (Davant el pi, una pedra de fita baixa, gastada i coberta de molsa. Hi ha gravat un pi de tres soques i, a sota, tres notes.)

**[400] La placa:** Tres branques té el vell pi, / tres cants li cal sentir. / Un cant per cada branca: / sols així s'obrirà el camí.

**[401] Ineu:** (Un cant per cada branca... Em falta aprendre'n algun amb la Pianista abans de poder-ho provar.)

*Si: (depèn d'un càlcul del joc)*

**[402] Ineu:** ([text calculat pel joc: n] de les tres branques ja brillen. Falta que cantin les altres.)

**[403] Ineu:** (Tres cants, tres branques. Ho provaré amb la tarota, aquí mateix.)

*Altrament (per defecte):*

**[404] Ineu:** (Necessitaré la tarota per respondre-li.)

### piTresCants  <sub>(js/zones/bosc_pi.js:398)</sub>

*Si: ha obert el pi dels tres cants i encara no porta la carta del Cortiner*

**[405] Ineu:** (Entre dues arrels del tronc hi ha un plec de paper, guardat com un tresor.)

*Altrament (per defecte):*

**[406] Ineu:** (Els ocells piulen entre les branques i el pi es mou una mica, com si respirés. Sembla content.)

**[407] Ineu:** (Un pi vell, amb tres soques que s'obren com tres braços. Sembla que escolta.)

### piHistoria  <sub>(js/zones/bosc_pi.js:407)</sub>

**[408]** ★ Has trobat la CARTA DEL CORTINER.

**[409] Carta del Cortiner:** «A qui sigui que torni a sentir aquest pi respirar: /  / Abans de la boira, els ocells dormien en els pins d'aquest bosc. A l'alba cantaven tots alhora, i aquell cant feia viure la terra: el Cant del Miracle.»

**[410] Carta del Cortiner:** «Un home sol, l'Ocellaire, el va voler per a ell. Va tancar els ocells en una gàbia i se'n va endur el cant. I amb el cant se'n va anar l'alba, i va començar la boira.»

**[411] Carta del Cortiner:** «Hi havia dos cants més, germans d'aquell: el de l'Aurora, que fa fugir la boira, i el de Vespres, que la terra escolta. Van tenir por que també se'ls emportés, i van venir a amagar-se aquí, a les branques d'aquest pi: un a cada una. Muts, com un nen que guarda un secret.»

**[412] Carta del Cortiner:** «Una tarda, cansat, em vaig asseure sota seu. Els vaig escoltar i els vaig escriure en tres sons: un, dos i tres. Són els de la tarota. Cada nota és una de les branques.»

**[413] Carta del Cortiner:** «El pi només deixa passar qui porta els tres cants, perquè només qui els porta els pot tornar als ocells. Quan la boira se'n vagi del tot, que els qui guarden els ocells robats vinguin aquí. Aquest bosc és casa seva. /  / — El Cortiner»

**[414] Ineu:** (Les arrels s'han enfonsat a terra com un respir llarg, i els ocells han tornat a les branques. El camí d'aquí al Dolmen ha quedat lliure.)

### nenaTrenes  <sub>(js/dialegs.js:1402)</sub>

*Si: encara no ha vist la Nena de les Trenes*

**[415] Nena de les Trenes:** No fugis, si us plau. Tothom que em veu surt corrent. Només voldria parlar amb algú.

**[416] Nena de les Trenes:** Vaig venir a collir rovellons amb la mare. Ella sempre deia: «On hi ha rovellons, hi ha pins; on hi ha pins, hi ha camí.» Però jo només mirava els rovellons, i em vaig oblidar del camí.

**[417] Nena de les Trenes:** La mare m'havia lligat les trenes amb dos llaços rosa. Quan em vaig adonar que m'havia perdut, vaig córrer, i els llaços van caure pel bosc. Fa molts, molts anys d'això.

**[418] Nena de les Trenes:** Un el vaig perdre pel camí de la Rovellonera, i l'altre en una clariana del mig del bosc de la Rovellonera. Sense ells no puc sentir les mans de la mare. Si me'ls portessis...

**[419] Ineu:** Els trobaré. No et quedaràs sola, t'ho prometo.

*Altrament (per defecte):*

**[420] Nena de les Trenes:** Els tens... els dos? Oh, monjo...

**[421] Nena de les Trenes:** Els sento... són les mans de la mare lligant-me'ls. Mare...?

**[422] La mare:** Ja t'he trobat, filla. Perdona que hagi trigat tant.

**[423] Nena de les Trenes:** Ja no tinc por. M'ha lligat les trenes, com abans. Gràcies, monjo.

**[424] Nena de les Trenes:** L'altre llaç és per a tu. Guarda'l: protegeix els qui es perden.

**[425]** ★ Has obtingut el LLAÇ DE LA NENA.

**[426] Nena de les Trenes:** Aguantarà el primer cop que rebis a cada lloc nou. Ara ja no et quedaràs sol.

**[427] Ineu:** Ni tu. Ja no estaràs mai més sola.

**[428] Nena de les Trenes:** Mare, anem a casa?

**[429] La mare:** Anem, filla.

**[430] Nena de les Trenes:** Adéu, monjo. Canta fort.

### nenaEpileg  <sub>(js/dialegs.js:1447)</sub>

**[431] Nena de les Trenes:** Gràcies per portar-me a casa, monjo.

### mandu  <sub>(js/dialegs.js:1366)</sub>

*Si: s'ha trencat la nina de la Mandu*

**[432] Mandu:** Mira la nina! El Fram li ha cosit el cap i diu que ara és una nina valenta. I jo ja no el deixo marxar enlloc!

*Si: encara no s'ha trencat la nina de la Mandu*

**[433] Mandu:** El Fram ha tornat! Ja no he d'esperar sola davant la porta. Avui jugarem tot el dia!

*Altrament (per defecte):*

**[434] Mandu:** No la toquis, eh? Li he arrencat el cap perquè estava enfadada, i només el Fram sap cosir-lo.

**[435] Mandu:** La nina espera. Jo també espero.

**[436] Mandu:** Zuuum! La nina vola per sobre dels núvols... i aterra a la lluna! Ui... un monjo.

**[437] Ineu:** Hola. Jo sóc l'Ineu. Com et dius?

**[438] Mandu:** Mandu. I ella és la nina. Sempre juguem aquí, davant la porta, esperant el Fram.

**[439] Ineu:** El Fram és el teu germà?

**[440] Mandu:** Sí. Dormíem a la mateixa habitació. Una nit em vaig adormir amb ell al costat, i al matí el seu llit era buit. Sempre em diu on va, i aquesta vegada...

**[441] Mandu:** La Meus diu que la boira se l'ha endut. Però jo li vaig dir que no se n'anés! Li ho vaig dir! I ell se n'ha anat igualment! PER QUÈ NO TORNA?!

**[442] Mandu:** Ja n'hi ha prou! LI HE ARRENCAT EL CAP A LA NINA! I m'és igual: així el Fram haurà de tornar per cosir-lo!

**[443] Ineu:** Tranquil·la, Mandu. Deixa'm veure-la: potser el puc cosir.

**[444] Mandu:** No! No la toquis! Només el Fram sap cosir caps de nina: ell m'arregla tot el que es trenca.

**[445] Ineu:** Doncs el trobaré i te'l portaré. I et cosirà la nina.

**[446] Mandu:** ...Promès?

**[447] Ineu:** Promès.

---

## Acte 3: els Guants de Poder i la roda de carruatge

### germa_franci  <sub>(js/dialegs.js:1773)</sub>

**[448] Germà Francí:** La tomba de l'àngel té flors noves cada dia. No sóc jo qui les hi porta... i no em preguntis qui.

### germaFranci  <sub>(js/zones/nord.js:757)</sub>

**[449] Germà Francí:** Els guants et queden grans, eh? Ja hi creixeràs. Fes-los servir per moure el que pesa, no per empènyer la gent.

*Si: ha deixat flors a la creu*

**[450] Germà Francí:** Les has deixades a l'àngel? Que Déu t'ho pagui, fill. Els monjos d'abans ja deuen estar contents: algú encara se'n recorda.

**[451] Germà Francí:** Té. Són els guants de picapedrer dels monjos antics: amb ells van aixecar les pedres del Santuari. Jo ja no tinc força per fer-los servir, però tu sí.

**[452]** ★ Has obtingut els GUANTS DE PODER!

**[453] Germà Francí:** Diuen que, posats, un noi pot moure una roda de carro com si fos de suro. Jo no ho he vist mai. Però mai no havia vist una boira com aquesta, tampoc.

**[663] Germà Francí:** I una altra cosa, fill: a l'Hostatgeria hi ha un mussol de pedra que no es deixa moure per ningú. Amb aquests guants, potser sí. Les sacerdotesses de dins guarden una Empara contra les boires que cremen: no baixis al fons sense ella.

*Altrament (per defecte):*

**[454] Germà Francí:** El ram, a la tomba de l'àngel de pedra, a la dreta del Cementiri, fill. Darrere el Monestir, camí amunt. I compte amb les bestioles.

**[455] Germà Francí:** Ineu... Bon dia, fill. Ja et deixen créixer?

**[456] Germà Francí:** Perdona que no camini de pressa: aquests genolls ja tenen més anys que la torre del rellotge.

**[457] Germà Francí:** Jo visc al Monestir, però cada matí baixo a passejar fins a Sant Antoni. L'Huri, el de Sant Benet, em venia a robar figues i jo feia veure que no el veia. Fa dos dies que la figuera és plena.

**[458] Germà Francí:** Cada setmana porto flors a l'àngel del Cementiri, per als monjos que hi dormen. Però amb aquesta boira no hi arribo: les cames no em responen i les bestioles no em respecten.

**[459] Germà Francí:** Me'n faries el favor? Deixa aquest ram als peus de l'àngel. I torna, que tinc una cosa per a tu.

**[460]** ★ Has obtingut un RAM DE FLORS.

---

## Acte 3: el passadís secret, la cambra i la maneta (en Jorgi)

### georgiCaseta  <sub>(js/zones/casa.js:78)</sub>

*Si: porta la maneta o porta la maneta*

**[461] Jorgi:** Fes-ne bon ús, monjo! I vigila, que les coses de pedra no sempre s'estan quietes.

*Si: encara no ha vist el volant del Raïm*

**[462] Jorgi:** Ei, monjo! Sóc en Jorgi de la Caseta. Conec cada drecera del Miracle, i les eines, encara millor.

**[463] Ineu:** M'anirà bé saber-ho. De moment només passava a saludar.

**[464] Jorgi:** Doncs ja saps on trobar-me si algun dia et cal un cop de mà.

*Si: ha parlat amb en Jorgi de la maneta*

**[465] Jorgi:** La caseta és aquí al costat: puja per l'escala. Al cofre de les meves joguines, la maneta és a sota. Que no se't cansi el braç!

*Altrament (per defecte):*

**[466] Jorgi:** Ei, monjo! Sóc en Jorgi de la Caseta. Conec cada drecera del Miracle, i les eines, encara millor.

**[467] Ineu:** Jorgi, em diuen que en saps, d'eines. Hi ha un volant de ferro vell que no té maneta, i sense no hi ha manera de fer-lo girar.

**[468] Jorgi:** Una maneta! En tinc una de ferro, de les bones. Encaixa en rodes de pou, en premses... i, si cal, en el volant d'una estàtua tossuda.

**[469] Jorgi:** Però la vaig amagar dalt de la meva caseta, la que està aixecada sobre pals, al cofre de les meves joguines. Ningú no s'atreveix a tocar-les, perquè jo no deixo que ningú hi posi les mans. MAI! MAI!

**[470] Jorgi:** Però tu vens per una cosa seriosa, així que per aquesta vegada et deixo. Puja per l'escala, que la porta no té clau, i agafa-la.

### llibreCambra  <sub>(js/dialegs.js:1622)</sub>

**[471] Ineu:** Un llibre gros, obert sobre la taula, amb lletra de monjo. Diu a dalt de la pàgina: «Del càstig del germà bodeguer».

**[472] Llibre:** «El germà bodeguer es bevia el vi de la sagristia, bóta rere bóta, i després jurava que s'havia evaporat.»

**[473] Llibre:** «Quan ho vam descobrir, el Prior no el va foragitar: el va fer petrificar i el va posar a vigilar la cripta fins que el vi es torni vinagre. A la cripta mai no es torna vinagre.»

**[474] Llibre:** «Per això li diuen l'Home del Raïm. Dorm de cara a la paret, com un nen castigat, i només es desperta si algú el fa girar i el mira a la cara.»

### cofreManeta  <sub>(js/dialegs.js:1699)</sub>

*Si: encara no ha parlat amb en Jorgi de la maneta ; encara no ha vist el volant del Raïm*

**[659] Ineu:** Un cofre de joguines d'infant. No és meu: millor no remenar-lo.

*Si: encara no ha parlat amb en Jorgi de la maneta*

**[475] Ineu:** No és meva... Millor preguntar a en Jorgi abans d'agafar-la.

*Altrament (per defecte):*

**[476]** ★ Has obtingut la MANETA D'ENGRANATGE.

### golfesRellotge  <sub>(js/zones/casa.js:1563)</sub>

**[477] Ineu:** El mecanisme és al bastidor de fusta de l'esquerra: tres engranatges a les posicions I, II i III. Cada cop que en toco un canvia de mida: petit, mitjà, gran.

### golfesNota  <sub>(js/zones/casa.js:1567)</sub>

**[478] Ineu:** «Nota del rellotger. El rellotge només camina si els engranatges hi van en ordre: el petit primer, el mitjà al mig, i el gran darrere.»

### golfesReparat  <sub>(js/zones/casa.js:1576)</sub>

**[479] Ineu:** (Torna a caminar! Ara se sentirà per tot el poble.)

---

## Acte 3: la Casa Gran, la cripta i l'Home del Raïm

### portaReixa  <sub>(js/dialegs.js:1606)</sub>

**[480] Ineu:** Fa generacions que ningú no obre això. Haurà d'haver-hi una altra manera d'entrar-hi.

### reixaDins  <sub>(js/dialegs.js:1614)</sub>

**[481] Ineu:** (La barra fora: ara puc entrar i sortir per la plaça.)

### homeRaim  <sub>(js/dialegs.js:402)</sub>

**[482] Ineu:** Té el cap posat del revés. Sembla que vigili alguna cosa a la seva esquena.

### homeRaimInt  <sub>(js/zones/casa.js:21)</sub>

**[483] Ineu:** L'estàtua té el cap completament girat d'esquena, mirant la paret. A la base del pedestal hi ha un volant de ferro amb engranatges, però li falta la maneta per poder-lo fer girar.

**[662] Ineu:** En Jorgi de la Caseta segur que me'n pot deixar una, és un expert en tot tipus d'eines.

### raimDesperta  <sub>(js/zones/casa.js:30)</sub>

**[484] Home del Raïm:** La boira... m'ha despertat. Tants anys mirant la paret, i ara em deixen anar. Algú ho pagarà.

**[485] Ineu:** S'ha mogut! La boira lila li ha donat vida!

**[486] Home del Raïm:** Vols la cripta? Ni tu ni cap altre no hi passareu. Us esclafaré com raïms.

### raimSenseArma  <sub>(js/zones/casa.js:38)</sub>

**[487] Ineu:** Si això desperta el guardià de pedra, no podré resistir la seva maça amb les mans nues. Caldrà tornar amb una arma.

### raimDerrotat  <sub>(js/zones/casa.js:44)</sub>

**[488] Home del Raïm:** La boira se'n va... torno a sentir la pedra. Així acaba: segles guardant el que ells no van tenir ganes de mirar.

**[489] Home del Raïm:** Ells em van deixar aquí, i el teu Home de la Gàbia m'ha despertat només perquè em matessin.

**[490] Home del Raïm:** Baixa, si vols. Allà sota ningú no et perdonarà, com ningú no em va perdonar a mi.

**[491] Home del Raïm:** Torno al pedestal. És l'únic que em van deixar.

### raimEstatuaFinal  <sub>(js/zones/casa.js:54)</sub>

**[492] Ineu:** L'Home del Raïm descansa per sempre.

### cofreCripta  <sub>(js/zones/casa.js:66)</sub>

**[493]** ★ Has obtingut la CLAU DE FERRO.

### puzleRaim  <sub>(js/zones/casa.js:768)</sub>

**[494] Ineu:** (Ara em mira de cara. No m'agrada gens.)

**[495] Ineu:** [text calculat pel joc: frases[this.raimPas - 1]]

### mecanismePorta  <sub>(js/zones/casa.js:1468)</sub>

*Si: ha fet servir la bota d'alçada*

**[496] Ineu:** (La llosa no té pany ni maneta. La cadena de la politja hi està lligada: el mecanisme de terra deu fer-la pujar.)

*Si: encara no ha fet servir la bota d'alçada*

**[497] Ineu:** (Una llosa de pedra sense pany ni maneta. No cedeix gens: s'ha d'obrir d'una altra manera.)

### construir  <sub>(js/zones/casa_gran.js:43)</sub>

**[498] Cartell:** ← La Taverna i l'Hostatgeria / → La Plaça del Santuari

---

## Acte 3: l'Hostatgeria, les sacerdotesses i la llosa del jardí

### isilderBase  <sub>(js/dialegs.js:1034)</sub>

*Si: ha sentit parlar del sopar del Til·ler i encara no té les flors de l'Isílder*

**[499] Isílder:** Sopar del Til·ler, eh? La gent només pensa en el menjar i s'obliden de les flors. Jo hi fico flors des que era jove.

**[500] Isílder:** Les flors de lluna són pels que falten. Posa-les al mig de la taula; jo també vindré a seure-hi.

**[501]** ★ Has obtingut les FLORS D'ISÍLDER.

*Si: ha trobat les sacerdotesses i encara no ha avisat l'Isílder*

**[502] Isílder:** He sentit com s'obria la porta de l'Hostatgeria. Són elles, oi? La Dolora, la Pilària, la Carmèlia... les sacerdotesses de la nostra casa.

**[503] Isílder:** Tres nits tancades a vint passes de mi, i jo aquí amb les flors, sense saber-ne res. La seva pregària sempre ha mantingut la pau a aquesta terra.

**[504] Isílder:** I el Sardi... el meu fill Sardi. Té set anys, monjo. Cada tarda s'enfilava a la prunera i es manxava de prunes fins a no poder dir ni mu. Si el trobes, digues-li que el seu pare no ha deixat de regar la prunera.

*Si: ha obert la llosa del jardí*

**[505] Isílder:** La flor de lluna ja ha florit sobre la llosa. No deixaré de cuidar-la.

*Si: porta la llavor de lluna*

**[506] Ineu:** Isílder, mira què duc. La Rosansa me l'ha donada: diu que és una Llavor de Lluna.

**[507] Isílder:** Una Llavor de Lluna! Fa trenta anys que no en veia cap. Floreix de nit, amb la llum de la lluna, i només si la planta algú que no ha perdut l'esperança.

**[508] Isílder:** El meu Sardi s'asseia aquí a esperar que s'obrissin, i deia que les flors de lluna canten quan floreixen. Deixa-me-la, monjo: encara sé cavar un clot. I mira bé.

**[509] Isílder:** La llosa s'ha apartat... Sota hi ha el camí que els monjos feien servir per portar menjar a les cel·les del soterrani de la casa. Fa segles que ningú no el trepitja.

**[510] Isílder:** Baixa-hi amb compte, fill. I si trobes el meu Sardi... digue-li que les flors de lluna han tornat a obrir-se.

*Altrament (per defecte):*

**[511] Isílder:** Bon dia, monjo! Aquesta pèrgola de pedra és més vella que el monestir: les columnes, els arcs... i l'Hostatgeria, aquí al costat, que s'hi aguanta al darrere.

**[512] Isílder:** La llosa encara s'encén amb la llum de la teva espasa. Ja ho saps: la Rosansa, a les cel·les, i aquella llavor estranya que porta al carro.

**[513] Isílder:** No et sorprenguis si em veus aquí cada dia, ni amb pluja. Aquest jardí, el Sardi el cuidava molt. Des que la boira se'l va endur, el cuido jo perquè, quan torni, ho trobi tot tal com ho va deixar.

**[514] Isílder:** I la llosa d'aquí al mig, si t'hi has fixat: no s'ha bellugat mai. Entre tres homes i una palanca, res. Pensa que potser la Rosansa, la venedora de verdures, porta al carro una llavor estranya que hi podria fer alguna cosa.

### isilderRunna  <sub>(js/dialegs.js:1090)</sub>

**[515] Isílder:** Monjo, espera! Mira la llosa: s'ha encès. Fa anys que la veig cada dia i no havia fet mai res així.

**[516] Ineu:** Deu ser per Runna. La llosa brilla al mateix ritme que l'espasa.

**[517] Isílder:** Aquesta llum pàl·lida i blavosa... Me'n recordo d'una de semblant: la que desprenen les llavors de lluna quan floreixen de nit. Potser una flor de lluna ajudaria la llosa a entendre què li demanes.

**[518] Isílder:** De llavors de lluna ja no en queden. Però la Rosansa, la venedora de verdures, ha tornat a passar per les cel·les, i fa anys que porta al carro una llavor estranya que ningú no sap què és. Pregunta-li.

### isilder  <sub>(js/dialegs.js:1770)</sub>

**[519] Isílder:** Les flors de lluna ja s'obren de dia. Diria que és el riure dels nens, que les enganya.

### llosaJardi  <sub>(js/dialegs.js:1112)</sub>

**[520] Ineu:** Una llosa de pedra amb una creu gravada. La Llavor de Lluna voldria terra aquí vora, però cal algú que conegui el jardí: l'Isílder.

**[521] Ineu:** Una llosa de pedra amb una creu gravada, ben encaixada a terra. L'Isílder diu que potser la venedora de verdures té la llavor que cal per obrir-la.

**[522] Ineu:** Una llosa de pedra amb una creu gravada, ben encaixada a terra. No es mou ni un pam, però s'ha de poder obrir d'alguna manera. Potser el senyor de la pèrgola, l'Isílder, ens pot ajudar.

### construir  <sub>(js/zones/jardi.js:131)</sub>

**[523] Cartell:** L'Hostatgeria / → La Taverna / ← L'Era

### rosansa  <sub>(js/dialegs.js:1101)</sub>

**[524] Rosansa:** Verdures fresques, fruita de la rodalia! Cebes, raves, cols... Què et poso, monjo?

**[525] Ineu:** Res de menjar, gràcies. Busco una llavor: la d'una flor de lluna, per a la llosa del jardí de l'Hostatgeria.

**[526] Rosansa:** Una flor de lluna? Mmm... Fa anys que porto una llavor estranya al fons del carro, entre les cebes. Ningú no sap què és, ni jo.

**[527] Rosansa:** Tingues, és teva. Que floreixi a qui sàpiga cuidar-la.

**[528]** ★ Has obtingut la LLAVOR DE LLUNA.

**[529] Rosansa:** Ara me n'he d'anar, que avui encara em queden tres pobles per davant. Adéu, monjo!

### avisLlosa  <sub>(js/dialegs.js:32)</sub>

*Si: ha aconseguit Runna*

**[530] Les Venerables Sàvies:** I la llosa del jardí de l'Hostatgeria? És obra dels monjos antics: la van tancar amb la mateixa llum de Runna que va segellar la porta de ferro. Ara que l'espasa és desperta, la pedra torna a respondre a la seva llum.

*Si: encara no ha aconseguit Runna*

**[531] Les Venerables Sàvies:** I la llosa del jardí de l'Hostatgeria? És obra dels monjos antics: la van tancar amb la mateixa llum de Runna que va segellar la porta de ferro. Mentre l'espasa dormi, la llosa dormirà amb ella.

### hostatgeria  <sub>(js/dialegs.js:1135)</sub>

**[532] Carmèlia:** Entra, fill: aquesta casa torna a ser teva.

**[533] Ineu:** La porta està tancada per dins.

### dolora  <sub>(js/dialegs.js:1142)</sub>

**[537] Ineu:** Una música lleugera, de tres notes, potser la desperta.

*Si: encara no ha rebut el premi de la Dolora*

**[538] Dolora:** Oh, jove monjo! Quin cant més bonic... fa seixanta anys que no el sentia així. Jo sóc la Dolora.

**[539] Dolora:** La boira va entrar pel soterrani fa tres nits. Vaig veure un germà amb hàbit que xiulava com els ocells i s'enduia el Sardi dins la boira, rient baixet.

**[540] Dolora:** Si passes pel jardí, saluda l'Isílder, el jardiner d'aquesta casa. Un bon home, amb el cor malmès des que van desaparèixer les criatures.

*Si: encara no ha rebut el premi de la Dolora ; porta l'espasa Runna*

**[541] Dolora:** La Carmèlia, la nostra gran sacerdotessa, és tancada a la capella del fons. Uns esbarzers negres li tapen la porta: d'aquests que no els talla ni la falç. Diuen que només cedeixen davant d'una espasa de llum. Aquesta espasa que portes, fill, brilla com la que diuen. Prova-ho.

*Si: encara no ha rebut el premi de la Dolora ; encara no porta l'espasa Runna*

**[542] Dolora:** La Carmèlia, la nostra gran sacerdotessa, és tancada a la capella del fons. Uns esbarzers negres li tapen la porta: d'aquests que no els talla ni la falç. Diuen que només cedeixen davant d'una espasa de llum.

*Si: encara no ha rebut el premi de la Dolora*

**[543] Dolora:** Vés amb compte, fill. Entre les tres germanes guardem l'Empara d'aquesta casa. Quan siguem lliures les tres, serà teva.

*Altrament (per defecte):*

**[544] Dolora:** Vés amb Déu, fill. La cadira em fa mal als ossos, però encara tinc bones orelles.

**[545] Dolora:** El Sardi ja torna a robar galetes del rebost. Senyal que està bé del tot.

### pilaria  <sub>(js/dialegs.js:1160)</sub>

*Si: encara no ha rebut el premi de la Pilària*

**[546] Pilària:** Per fi! Tres nits que colpejo aquesta porta! Soc la Pilària, i no, no m'he estat quieta ni un minut.

**[547] Pilària:** T'ho dic perquè ho vaig veure: el Germà Aldreu, aquell pesat que sempre anava jugant amb els nens, anava moltes nits a la Porta de les Gírgoles, i la porta se li obria sola, com si la boira l'obeís. Mai no li he cregut el somriure.

**[548] Pilària:** Tots aquests nens innocents segrestats per aquesta maleïda boira... Troba'ls, monjo! Salva'ls a tots!

**[549] Pilària:** Gràcies pel teu coratge! Que no se t'acabin les forces!

*Altrament (per defecte):*

**[550] Pilària:** Si necessites algú que miri amb els ulls ben oberts, ja saps on trobar-me.

**[551] Pilària:** Hem posat una espelma per tu a cada cambra, Ineu. I una altra per si de cas.

### carmelia  <sub>(js/dialegs.js:1173)</sub>

*Si: encara no ha rebut el premi de la Carmèlia*

**[552] Carmèlia:** Benvingut, fill de Déu. Sóc la Carmèlia, la gran sacerdotessa d'aquesta casa. Havíem perdut l'esperança, però no la pregària.

**[553] Carmèlia:** Els infants d'aquesta terra han estat arrossegats a la foscor d'un abisme profund. La nit que la boira ens va tancar a les cambres, els seus llits van quedar buits. Salva'ls, fill: porta a casa tots els nens segrestats.

*Si: encara no ha rebut el premi de la Carmèlia ; sap el Cant del Miracle*

**[554] Carmèlia:** Als llibres d'aquesta casa he llegit que l'Ocellaire va robar el cant dels ocells, i que només aquest mateix cant obre la seva gàbia. El que has après amb la Pianista, fill, és el que ell va robar. No el deixis anar.

*Si: encara no ha rebut el premi de la Carmèlia ; encara no sap el Cant del Miracle*

**[555] Carmèlia:** Als llibres d'aquesta casa he llegit que l'Ocellaire va robar el cant dels ocells, i que només aquest mateix cant obre la seva gàbia. Tu l'aprendràs: la Pianista el recorda.

*Si: encara no ha rebut el premi de la Carmèlia*

**[556] Carmèlia:** Que la paciència t'acompanyi, fill.

*Altrament (per defecte):*

**[557] Carmèlia:** Que la llum del Miracle t'acompanyi, fill.

**[558] Carmèlia:** Les tres te'n devem una. I nosaltres sempre paguem els deutes... amb pastissos.

### cofreMonges  <sub>(js/dialegs.js:1193)</sub>

**[559] Nota:** «Per a qui ha tornat la llum a aquesta casa. Al fons de les Gírgoles, abans d'arribar a la gàbia, hi ha una boira que crema: la nostra empara l'esvairà al teu pas.» — Dolora, Pilària i Carmèlia

**[560]** ★ Has obtingut l'EMPARA FRATERNAL: et protegeix de la boira verinosa que barra el camí de la Sala de la Gàbia.

---

## La porta de ferro i les Gírgoles

### portaSoterrani  <sub>(js/zones/taverna.js:122)</sub>

**[561] Ineu:** (Tancada amb clau. A l'Aldreu se li obria sola perquè la boira que sortia de la tomba obeïa la veu del Mestre... però la tomba és segellada i la boira ja no puja: ara la porta no s'obre per a ningú. Em cal la clau dels monjos.)

**[562] Ineu:** (Tancada amb clau. Diuen que a l'Aldreu se li obre sola: la boira l'obeeix. A mi, no.)

### xevius  <sub>(js/dialegs.js:646)</sub>

**[676] Pare Xèvius:** Passa, fill, passa. Que la llum de Runna t'acompanyi: allà baix en tindràs ben bé necessitat.

**[677] Pare Xèvius:** Alto, noi. No passes. Fa trenta anys un monjo de bona cara va picar a aquesta porta, va dir tres paraules dolces... i el meu predecessor li va obrir.

**[678] Pare Xèvius:** Des d'aleshores, qui vol passar m'ha de demostrar la bona voluntat. No amb paraules, fill: amb fets.

**[679] Ineu:** (Quina prova se li pot demostrar? Potser el Pare Alcoví, a la Biblioteca, ho sap: ho deu tenir a la Crònica.)

**[680] Ineu:** Pare Xèvius, porto això: la Carta del Cortiner. Era al tronc del Pi dels Tres Cants. Els ocells hi han tornat.

**[681] Pare Xèvius:** La lletra del Cortiner... i el sagell blau, intacte. Només qui fa tornar els ocells al pi té un cor així.

**[682] Pare Xèvius:** Perdona'm, fill. Les males experiències deixen ferides. Obre bé els ulls allà baix: l'Aldreu no és el que era.

### portaFerro  <sub>(js/zones/taverna.js:133)</sub>

**[565] Ineu:** (Aquí és d'on surt tot. Em falta l'espasa que la va segellar... i una clau.)

**[566] Ineu:** (La Clau de ferro no hi entra: aquest pany és molt més petit. El Germà Aldreu en deu tenir una altra.)

**[567] Ineu:** (Algú l'hauria d'haver vist anar-hi de nit... L'Iscu, el fill de la Càren! L'Eve va dir que s'escapa pel camí de la Desaparició, per un forat entre els arbres.)

**[667] Ineu:** (Tinc la clau, el Cant del Miracle i l'Empara: les dues proves de què parlava la Crònica del Pare Alcoví. Endavant.)

**[668] Ineu:** (Tinc la clau petita, però la Crònica del Pare Alcoví deia que, per baixar, em cal passar dues proves. Encara em falta  i  […].)

### cartellGirgoles  <sub>(js/dialegs.js:425)</sub>

**[568] Cartell:** Porta de les Gírgoles

### girgolesInscripcio  <sub>(js/zones/gabia.js:60)</sub>

**[569] Inscripció:** «Les gírgoles de la cova canten juntes o callen juntes. Toca'n una i despertaràs també les dues que té al costat. Quan cantin totes, el pas s'obre.»

---

## La Gàbia i l'Ocellaire

### pontGabia  <sub>(js/zones/gabia.js:68)</sub>

**[573] Ineu:** (Els blocs de pedra dormen. Potser la tarota els pot despertar.)

### gabiaGran  <sub>(js/zones/gabia.js:74)</sub>

**[574] Ineu:** (Ara. El Cant del Miracle.)

**[575] Ineu:** (Els barrots no tenen pany. Només un cant els pot obrir: el Cant del Miracle.)

### aldreuGabia  <sub>(js/zones/gabia.js:80)</sub>

**[576] Germà Aldreu:** Estic bé, Ineu. La boira fa companyia quan ja no demana res.

**[577] Germà Aldreu:** Torna quan vulguis. Si mai se'm gira el cor, ja trobaré qui em pugui acompanyar...

**[578] Germà Aldreu:** Encara no, noi. Deixa'm sentir com riuen.

**[579] Germà Aldreu:** (No et mira.) Ja no em parla. Abans em parlava sempre.Fes el que has de fer, noi. Avui no et miraré.Quan era a la Plaça, tothom em passava pel costat. Ell em va veure. […]

**[580] Aldreu, Pastor de Boira:** El Mestre ve, monjo. Ja el sents?

### nenGabia  <sub>(js/zones/gabia.js:92)</sub>

**[581] Huri:** Ineu! Somiava que era un ocell dins d'una gàbia... i ara tinc unes ganes de riure!

**[582] Fram:** On és l'home dels ocells? L'has fet fugir tu? Ha ha ha! Quina cara que feia!

**[583] Sardi:** El pare deu estar amoïnat regant la prunera... Anem a casa, Ineu?

### actualitzar  <sub>(js/zones/gabia.js:664)</sub>

*Si: (depèn d'un càlcul del joc)*

**[584] Ineu:** (Aquesta boira crema la gola... Sense l'Empara de les sacerdotesses de l'Hostatgeria no la podré travessar.)

**[585] Ineu:** (Una força invisible no em deixa passar. Sense el Cant del Miracle, els barrots no m'escoltaran. La Pianista, al Santuari, me l'ha d'ensenyar.)

### enMelodia  <sub>(js/zones/gabia.js:1273)</sub>

*Si: (depèn d'un càlcul del joc)*

**[586] Ineu:** (L'Home de la Gàbia xiula més fort que el cant.)

### iniciarCombatFinal  <sub>(js/zones/gabia.js:1555)</sub>

**[587] Aldreu, Pastor de Boira:** Una altra vegada, monjo? El Mestre no es cansa mai.

**[588] L'Home de la Gàbia:** Torna a entrar, petit. Sempre torna, el riure.

**[589] Aldreu, Pastor de Boira:** Mestre, aquesta vegada sí!

**[590] Ineu:** (Tres capolls de boira, penjats com llonganisses... L'Huri, el Fram, el Sardi. Dormen.)

**[591] Ineu:** Aguanteu. Ja sóc aquí.

**[592] Aldreu, Pastor de Boira:** Silenci! Aquí no s'alça la veu, monjo. El Mestre dorm, i jo vetllo el seu son.

**[593] Ineu:** Germà Aldreu, sóc jo. Baixeu la veu.

**[594] Aldreu, Pastor de Boira:** Per cada riure que li duc, em gratifica amb un «bon minyó, Aldreu». No pots entendre què vol dir per a mi que algú tan poderós conegui el meu nom.

**[595] Aldreu, Pastor de Boira:** Tu sempre has tingut el favor de tothom, nen mimat!

**[596] Ineu:** Això no és admirar algú, Aldreu, és engabiar-se.

**[597] Aldreu, Pastor de Boira:** Tard, massa tard! Mestre! MESTRE, ja és aquí! El monjo que us vol prendre els nens!

**[598] L'Home de la Gàbia:** Aldreu, fill meu, no cal que cridis.

**[599] L'Home de la Gàbia:** Uns peus de monjo jove damunt la meva pedra.

**[600] Ineu:** Deixeu que els nens tornin amb els seus!

**[601] L'Home de la Gàbia:** Un nen que riu... feia segles que no en sentia cap.

**[602] L'Home de la Gàbia:** La gàbia és plena de riures robats. Encara hi cap el teu.

**[603] Ineu:** Ja coneixeu Runna. I ara em coneixereu a mi!

**[604] L'Home de la Gàbia:** Runna... Quina espasa tan petita per a una sala tan gran.

**[605] Aldreu, Pastor de Boira:** Deixeu-me'l a mi, Mestre, aquest cop l'esclafaré!

**[606] L'Home de la Gàbia:** Aparta, Aldreu. Aquesta nit el Mestre mateix et mostrarà com es fa.

**[607] Aldreu, Pastor de Boira:** Sí, Mestre...

### ocellaireDerrotat  <sub>(js/zones/gabia.js:1750)</sub>

**[608] L'Home de la Gàbia:** No... els meus riures... els meus ocells...

**[609] L'Home de la Gàbia:** Tantes rialles, i cap no era per a mi.

**[610] Germà Aldreu:** Mestre! No em deixeu!

### obrirGabia  <sub>(js/zones/gabia.js:1818)</sub>

**[611] Ineu:** Germà Aldreu, la gàbia s'obrirà. Podeu venir amb nosaltres.

**[612] Germà Aldreu:** Encara no.

### finalGabia  <sub>(js/zones/gabia.js:1920)</sub>

**[613] Germà Aldreu:** La seva veu em parlava dins el cap cada nit. Era l'única que em parlava.

**[614] Germà Aldreu:** Escolta'ls, riuen tan fort que no es poden engabiar.

**[615] Ineu:** Veniu amb nosaltres, Germà. A la taula del refectori hi ha lloc per a tothom.

**[616] Germà Aldreu:** Ja ho sé que n'hi ha. Gràcies, Ineu.

**[617] Germà Aldreu:** El Mestre és aquí dins... Algú l'ha de vetllar. Algú que sàpiga què és no ser vist.

**[618] Germà Aldreu:** Jo em quedo amb ell.

**[619] Ineu:** Vindré a veure-us.

**[620] Germà Aldreu:** Ja ho sé.

---

## Epíleg: després del final

### ferEpileg  <sub>(js/zones/esglesia.js:287)</sub>

**[621] Les Venerables Sàvies:** Huri, no hem dubtat ni per un instant que l'Ineu et salvaria. El seu destí estava escrit a la crònica del Miracle.

**[622] Fram:** Mandu! Què li ha passat a la nina? Dona-me-la, que només jo sé cosir caps de nina.

**[623] Mandu:** Gràcies, Fram! Ja torna a tenir cap... i tu ja no te n'aniràs mai més, oi?

**[624] Mandu:** Fram! Ja has tornat! I tu ja no te n'aniràs mai més, oi?

**[625] Fram:** Mai més, Mandu. T'ho prometo.

**[626] Isílder:** Sardi! Fill meu... Tres nits sense saber de tu.

**[627] Sardi:** Pare! Has regat la prunera?

**[628] Isílder:** Cada dia, fill. Cada dia. Així, quan tornessis, ho trobaves tot com ho havies deixat.

**[629] Iscu:** Avui no frego ni un got! Festa grossa: els nens són a casa!

**[630] Eve:** Avui, sí. Demà et guardo la pila sencera.

**[631] La Pianista:** Ara sí. Ineu, la tarota: avui el Cant del Miracle el comences tu, i l'orgue et seguirà.

**[632] Nena de les Trenes:** La mare i jo ho hem sentit des de lluny. Cantes molt bé, monjo.

**[633] Nena de les Trenes:** Gràcies per portar-me a casa.

**[634] Pare Nadiel:** Sents la torre del rellotge, Ineu? Torna a tocar les hores! Fa tres nits que el temps no passava, i l'has tornat a posar en marxa tu.

**[635] Carry:** El meu home ho hauria sentit des de lluny, aquest so. Gràcies, fill.

**[636] Ineu:** Pare Jordà... el Germà Aldreu no ha tornat. Es va quedar amb el Mestre, sota terra, i la gàbia se'l va tancar a dins.

**[637] Pare Jordà:** L'Aldreu... dins la gàbia?

**[638] Pare Jordà:** Quan un home busca l'admiració a la foscor perquè no sap trobar l'amor entre els seus germans, acaba sent el seu propi carceller.

**[639] Pare Jordà:** Haurà de respondre davant de Déu i davant nostre per cada llàgrima dels infants. Però la gàbia que ell mateix ha triat tancar... és on la seva boira ja no farà mal a ningú més.

**[640] Pare Jordà:** Ara mira al teu voltant, Ineu: els nens riuen i el Santuari canta. Que la seva tristor no ens robi la llum que has tornat al Miracle. Benvingut a casa, fill.

### gentEpileg  <sub>(js/zones/gabia.js:91)</sub>

**[641] Gent:** Avui tothom canta, encara que l'orgue faci una nota de pega.

---

## Pensaments i avisos curts de l'Ineu (ineuDiu)

### pensament a enMelodia  <sub>(js/zones/bassadoria.js:192)</sub>

**[642] Ineu:** L'aigua ja és clara.

### pensament a enMelodia  <sub>(js/zones/cirosa.js:229)</sub>

*Si: sap el Cant de Vespres (el de les pedres)*

**[643] Ineu:** Els pastors m'escolten, però això no els recorda casa. Un cant antic, de les esquelles: el de Vespres.

*Si: encara no sap el Cant de Vespres (el de les pedres)*

**[644] Ineu:** Els pastors m'escolten, però això no els recorda casa. Hauria de ser un cant més antic: potser la Pianista en coneix algun.

*Si: encara no ha sentit parlar del sopar del Til·ler*

**[645] Ineu:** Els pastors m'escolten en silenci... Encara no és el moment: primer cal parlar amb el Til·ler.

*Altrament (per defecte):*

**[646] Ineu:** Els pastors somriuen: aquí ja ha tornat la música.

### pensament a obrirPortaRellotge  <sub>(js/zones/esglesia.js:441)</sub>

*Si: (depèn d'un càlcul del joc)*

**[647] Ineu:** La porta de la dreta del retaule ja és oberta.

### pensament a avisFoscor  <sub>(js/zones/gabia.js:20)</sub>

**[648] Ineu:** Està massa fosc... Només hi veig a un pas. Jusef, al Celler, guardava una llum.

### pensament a obrirCortina  <sub>(js/zones/gabia.js:323)</sub>

**[649] Ineu:** Les gírgoles canten: el micel·li es desfà!

### pensament a obrirBoira  <sub>(js/zones/gabia.js:687)</sub>

**[694] Ineu:** L'Empara de les sacerdotesses m'embolcalla d'una llum càlida, i la boira que cremava s'aparta davant seu. Puc passar.

### pensament a actualitzar  <sub>(js/zones/hostatgeria.js:393)</sub>

*Si: encara no porta els Guants de Poder*

**[650] Ineu:** El mussol de pedra no es belluga ni un pèl. Necessito ser molt més fort per moure'l.

### pensament a enMelodia  <sub>(js/zones/hostatgeria.js:615)</sub>

**[651] Ineu:** La Dolora ja és desperta.

### pensament a actualitzar  <sub>(js/zones/nord.js:547)</sub>

*Si: encara no porta els Guants de Poder*

**[652] Ineu:** Pesa massa... calen unes mans més fortes.

### pensament a enMelodia  <sub>(js/zones/placa.js:125)</sub>

**[654] Ineu:** El passatge ja és obert.

### pensament a ineuDiu  <sub>(js/zona_base.js:471)</sub>

**[655] Ineu:** [text calculat pel joc: text]

*Si: (depèn d'un càlcul del joc)*

**[656] Ineu:** [text calculat pel joc: text]

### pensament a triarViatge  <sub>(js/zona_base.js:529)</sub>

**[657] Ineu:** Ara no: hi ha bèsties a prop.

### pensament a melodiaTocada  <sub>(js/zona_base.js:2141)</sub>

*Si: (depèn d'un càlcul del joc)*

**[658] Ineu:** He tocat el [text calculat pel joc: MELODIES[nom].nom], però aquí no passa res...
