# Pla per acabar el joc

Estat a la revisió 198. La història es pot jugar de principi a fi (la prova `eines/prova_progres.js` passa sencera). El que falta és sobretot **art, música, l'últim combat i polir**. Ordenat per prioritat dins de cada bloc.

---

## 1. Combat final: l'Ocellaire (massa fàcil i ràpid)

**Com és ara.** Ja només se li pot fer mal al cap i només quan està cansat. El problema és que es cansa **després de cada atac** (també del cop en cercle), cada pausa dura 1,5–2,6 s, i en aquesta estona l'Ineu pot clavar-li tants cops com vulgui. Amb Runna (3 de mal), 45 de vida són 15 cops, és a dir 3 o 4 pauses: menys d'un minut.

**Proposta** (pendent que diguis sí):
1. **Només es cansa al final d'una ronda sencera.** Després del cercle, del bàcul llançat o de l'esvaïment, torna a surar sense pausa. Només cau **de genolls** quan ha llançat tots els ocells de foc (i a la fase 3, també després del foc a terra). Una ronda = sobreviure a tots els ocells.
2. **De genolls amb l'art nou** (`ocellaire_genolls`, prompt fet). Mentre no hi sigui, es manté el sprite de cansat.
3. **Màxim 3 cops per pausa.** Al tercer cop (o en acabar el temps) s'aixeca d'un salt i fa una ona curta que empeny l'Ineu. Així no es pot «buidar» en una sola pausa.
4. **Vida 45 → 54** (6 pauses de 3 cops amb Runna, 2 per fase). Pauses de 2,2 s / 1,9 s / 1,6 s segons la fase.
5. Resultat esperat: 2–3 minuts de combat, amb 6 moments clars de «ara!».

## 2. Música (no n'hi ha cap de nova encara)

Totes són opcionals (sona la de reserva), però les set primeres són les que més es noten. Prompts a `docs/INSTRUCCIONS_MUSICA.md`. Deixa els MP3 a `art/musica/cru/` i jo els tallo i els poso.

| Prioritat | Fitxers |
|---|---|
| **Imprescindibles** | `boss`, `boss_final`, `gabia`, `epileg`, `credits`, `jingle_boss`, `jingle_runna` |
| Recomanades | `taverna`, `cirosa`, `biblioteca`, `hostatgeria`, `girgoles`, `jingle_objecte` |
| La fas tu | `celles` |

## 3. Gràfics

**Amb prompt preparat** (`docs/PROMPTS_GRAFICS.md`, secció Estat):
- `ocellaire_genolls`: **el més important ara**, lligat al combat final.
- `ineu/tarota_gran`: opcional, el retall actual ja funciona.
- `home_raim_o`: opcional, el cap girat de l'estàtua.
- `gabia`, `gabia_oberta`, `andreu_guardia`: ara la gàbia es dibuixa amb codi i l'Andreu fa servir el sprite de Pastor de Boira; només cal si vols un acabat millor.

**Encara dibuixats amb codi** (cap prompt fet; et preparo els que vulguis):
- **Enemics, els que més es veuen:** escolopendra, gripau, visitant, ovella i ovella de boira, ratpenat, ferralla viva, capoll de boira.
- **Llocs clau de la història:** dolmen (4 estats: amb boira, espasa clavada, brillant, buit), masia de la Cirosa, dipòsits, llac, caseta del joc (la Caseta), font de Sant Joan, taula del sopar, altar i columnes de la Desaparició, taules de pedra.
- **Objectes petits** (es veuen poc; poden quedar així): cofre, espelma, foc, olla, pergamins, llosa, telescopi i trípode, taula de ping-pong, pèrgola, porxo, cabana, herbes, flors, conill, esquirol, ocell.
- `eloi`: és al catàleg però el joc no el fa servir enlloc. Es pot treure.

## 4. Històries per tancar

1. **El món després del final.** En acabar l'epíleg es continua jugant, però gairebé ningú reacciona: només el Follet del Carro Verd i l'Andreu a la gàbia. Proposo una línia nova per a cada personatge important després de l'epíleg (`epilegFet`).
2. **La Meus i el senyor Molner** (els veïns de Sant Benet d'on falten l'Huri i el Fram) no surten a l'epíleg. Haurien de ser al Santuari, i la Meus hauria d'abraçar els nens: és qui més els ha reclamat.
3. **Les sacerdotesses i el Sardi** (el seu nebot): ja són a l'epíleg, però no hi tenen cap moment propi. N'hi hauria prou amb una frase o un gest.
4. **L'Eve i la Karen** (la Taverna): la Karen dorm tot el joc. Que es desperti al final, o que l'Eve en digui alguna cosa.
5. **La Carry, la Rosansa i l'Iscu** no surten a l'epíleg. Proposo afegir la Carry i l'Iscu; la Rosansa és de pas i pot quedar així.

## 5. Recorregut i desplaçaments

- **Benedicció fraterna obligatòria just abans del final.** Per creuar l'avenc cal la Benedicció fraterna, que és el premi d'una missió llarga (llosa, Rosansa, tres cambres). Fer-la obligatòria al final de tot pot semblar un mur. **Opció:** que el pont el faci el Cant de les Pedres (com ja diu el guió) i la Benedicció quedi com a ajuda opcional per al combat.
- **Acte 3, molt d'anar i venir:** Santuari → Celler → Sant Antoni → Cementiri → Sant Antoni → Celler → Casa Gran → Biblioteca → Cementiri → Pati del Celler → Desaparició (l'Iscu) → Taverna. **Opció:** que l'Iscu doni la clau rovellada abans, quan se'l troba al camí de la Desaparició (Acte 2), i així s'estalvia un viatge sencer.
- El viatge ràpid amb el carro del Follet ja existeix. Cal comprovar que hi ha parada a prop de cada punt de l'Acte 3 (Celler, Cementiri, Sant Antoni).

## 6. Revisió de combats i puzles

- **Pastor de Boira** (vida 24) i **Home del Raïm**: provar-los amb el bastó i amb la branca per veure si costen el mateix que l'Ocellaire nou.
- **Puzles:** gírgoles (5 mates), dotze columnes, maneta de l'estàtua, rellotge, pedra secreta, ping-pong. Fer una partida sencera seguida apuntant on s'encalla.
- **Partida automàtica.** Puc fer una prova que vagi pas a pas (amb el mode proves) per cada zona i avisi d'errors de JavaScript, NPC tapats o sortides que no porten enlloc.

## 7. Ordre proposat de feina

1. Combat de l'Ocellaire (codi) + `ocellaire_genolls` (art).
2. Les set músiques imprescindibles.
3. Epíleg complet (Meus i Molner, Carry, Iscu, Karen) i reaccions després del final.
4. Benedicció fraterna i clau de l'Iscu (decidir les opcions del punt 5).
5. Art dels enemics comuns i del dolmen.
6. Partida automàtica i una partida sencera a mà.
7. Música recomanada i la resta d'art.
