# Pla per acabar el joc

Estat a la revisió 198. La història es pot jugar de principi a fi (la prova `eines/prova_progres.js` passa sencera). El que falta és sobretot **art, música, l'últim combat i polir**. Ordenat per prioritat dins de cada bloc.

---

## 1. Combat final: l'Ocellaire ✔ (revisió 199)

Només cau de genolls (art `ocellaire_genolls`) quan ha llançat tots els ocells o ha cremat el terra; com a molt 3 cops al cap per pausa (al tercer s'aixeca i empeny l'Ineu); 54 de vida, dues pauses per fase. Cal provar-lo a mà per afinar la durada de les pauses (2,2 / 1,9 / 1,6 s).

## 2. Música (fetes: totes)

Totes són opcionals (sona la de reserva), però les set primeres són les que més es noten. Prompts a `docs/INSTRUCCIONS_MUSICA.md`. Deixa els MP3 a `art/musica/cru/` i jo els tallo i els poso.

| Prioritat | Fitxers |
|---|---|
| **Imprescindibles** | `boss`, `boss_final`, `gabia`, `epileg`, `credits`, `jingle_boss`, `jingle_runna` |
| Recomanades | `taverna`, `cirosa`, `biblioteca`, `hostatgeria`, `girgoles`, `poble`, `santuari`, `jingle_arma`, `jingle_objecte` |

## 3. Gràfics

**Amb prompt preparat** (`docs/PROMPTS_GRAFICS.md`, secció Estat):
- `ocellaire_genolls`: **el més important ara**, lligat al combat final.
- `ineu/tarota_gran`: opcional, el retall actual ja funciona.
- `home_raim_o`: opcional, el cap girat de l'estàtua.
- `gabia`, `gabia_oberta`, `aldreu_guardia`: ara la gàbia es dibuixa amb codi i l'Aldreu fa servir el sprite de Pastor de Boira; només cal si vols un acabat millor.

**Es queden dibuixats amb codi** (decidit): escolopendra, gripau, visitant, ovelles, ratpenat, ferralla, capoll, dolmen, masia, dipòsits, la Caseta i els objectes petits.

## 4. Històries per tancar ✔ (revisió 200)

- **Epíleg:** la Meus abraça l'Huri i el Fram, les sacerdotesses el Sardi, l'Iscu hi és, la Pianista (ara al mig) dona l'entrada i l'Ineu comença el Cant del Miracle amb la tarota.
- **Després del final:** frases noves per a la Pianista, la Meus, el senyor Molner, les sacerdotesses, l'Isildren, la Jacmeta, el Galf, el Germà Francí, l'Iscu, el pastor vell, l'Eve i la Carry (aquestes dues, només si ja han fet la seva lateral).
- La Càren dorm tot el joc (decidit).

## 5. Recorregut i desplaçaments

- **Benedicció fraterna:** es manté obligatòria per creuar l'avenc (cal salvar les sacerdotesses).
- **L'Iscu:** la cabana amagada és oberta des del principi i dona la clau rovellada el primer cop que hi parles: es pot trobar quan es vulgui.
- El viatge ràpid amb el carro del Follet ja existeix. Cal comprovar que hi ha parada a prop de cada punt de l'Acte 3 (Celler, Cementiri, Sant Antoni).

## 6a. Prova automàtica de les zones ✔ (revisió 235)

`eines/prova_zones.js` carrega les 56 zones per cada entrada (131 càrregues) i `eines/informe_zones.py` en fa el resum: errors de JavaScript, sortides trencades, sortides i punts d'interacció inabastables i espai per moure's. **Resultat:** cap error de JavaScript, totes les sortides porten a una zona i entrada que existeixen, i totes les sortides i punts d'interacció són abastables amb l'estat final. Té limitacions: no veu els problemes de ritme, de pistes ni de combat. Això només ho troba una partida.

## 6. Revisió de combats i puzles

- **Pastor de Boira** (vida 24) i **Home del Raïm**: provar-los amb el bastó i amb la branca per veure si costen el mateix que l'Ocellaire nou.
- **Puzles:** gírgoles (5 mates), dotze columnes, maneta de l'estàtua, rellotge, pedra secreta, ping-pong. Fer una partida sencera seguida apuntant on s'encalla.
- **Partida automàtica.** Puc fer una prova que vagi pas a pas (amb el mode proves) per cada zona i avisi d'errors de JavaScript, NPC tapats o sortides que no porten enlloc.

## 7. Ordre proposat de feina

1. Les set músiques imprescindibles.
2. Provar a mà el combat de l'Ocellaire i afinar-lo.
3. Partida automàtica i una partida sencera a mà.
4. Música recomanada i la resta d'art (`ineu/tarota_gran`, `home_raim_o`, gàbia).
