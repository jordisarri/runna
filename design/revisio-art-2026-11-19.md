# Revisió de coherència estètica (2026-11-19)

**Abast i límits.** He vist la fulla de les 42 icones, el codi d'`js/icones.js` i `js/dibuixos.js`, i només 8 gràfics IA: `esglesia`, `arbre`, `pi`, `roca`, `carry`, `tomba_angel`, `cartell_llums`, `emblema_arbre`. Els `.webp` no els puc obrir, així que he mirat els originals d'`art/`. NO he vist renderitzats els dibuixos procedurals (`dibuixos_*.js`) ni els retrats i armes. Sobre això només puc opinar pel codi. La mostra de 30-40 gràfics no s'ha arribat a fer. Les conclusions sobre IA són de tendència, no exhaustives. Les 3 medalles (`medallo_*`) surten en blanc a la fulla perquè usen les textures `emblema_*` de Phaser. No les he valorat al sarró. L'`emblema_arbre` en si és bo.

## (a) Paràmetres comuns i els que cal fixar

**Ja es compleixen:** estil chibi/SD, siluetes arrodonides, paleta càlida terrosa (ocres, castanys, verd molsa), fons blanc aïllat i llum des de dalt-davant. Les icones i els dibuixos de codi comparteixen `CONTORN = '#120c08'` (near-black càlid) amb 3 px a 96 px.

**Desacords reals entre les peces IA** (el pitjor és que no hi ha un únic "mateix render"):
1. **Contorn.** Els personatges (`carry`) i les tombes (`tomba_angel`) tenen contorn negre gruixut i net, tal com diu `edificis.json`. En canvi `arbre`, `pi` i `roca` el tenen marró fi i irregular, i `esglesia` el té fi i gairebé invisible a l'interior. Les tres últimes són **pictòriques** (pinzellades, textura), no cel-shading net. Això contradiu "sketchiness: none".
2. **Ombrejat.** Hi ha dos mons: cel de 2 tons (`carry`, `tomba_angel`, `emblema_arbre`) i pintat amb textura (`arbre`, `pi`, `roca`). `roca` és molt més fosca i realista que la resta.
3. **Saturació.** `pi` té un tronc taronja molt saturat. `carry` i `tomba_angel` són desaturats gris-malva. `arbre` és verd oliva. Falta un rang comú.
4. **Escala del contorn.** Als gràfics IA és ~1% de l'alçada. Al codi és 3 px sobre 96 (~3%). A mida de pantalla les icones semblen "més gruixudes" que la resta.
5. **Ombra de terra.** `edificis.json` diu "cap ombra". Les icones refetes (`pallofa`, `pa_pastor`) en porten una de suau. `ombraTerra()` existeix a `dibuixos.js`. Cal decidir-ho: jo recomano ombra el·líptica suau, només a les peces de terra, no a les icones.
6. **Excepció de registre:** `cartell_llums.jpg` és en blanc i negre (còmic/fotocòpia), amb text. És una peça diegètica i pot quedar-se així, però és el més llunyà de l'estil. Convé deixar-lo com a excepció explícita.

**Valors que proposo fixar:** contorn `#120c08` a tot; gruix de contorn = 3% de l'alçada de la peça (mínim 2 px); 2 tons més un reflex suau; llum dalt-esquerra-davant (reflex dalt-esquerra, ombra baix-dreta); saturació mitjana-alta, sense gris pur ni negre pur dins de la forma; ombra de terra només en peces d'escenari.

## (b) Desviacions prioritzades

### Alta
- **Icones "pobres" del sarró** (pla, un sol to, sense degradat) davant les refetes `basto_tiller`, `pallofa` i `pa_pastor`: `clau_*` (5 claus), `fragment1`, `fragment2`, `maneta`, `ram`, `flors_isilder`, `herba_sj`, `romani`, `fulla_tiler`, `telescopi`, `cinta_nena`, `llac_nena`.
  - *Per què:* reben un color pla i un detall mínim. Les refetes tenen ombra a la meitat inferior, llum fina a dalt, contorn fosc i detalls (vetes, taques).
  - *Arreglar:*
    - Posa a cada peça un degradat lineal vertical (to base a dalt, 15-20% més fosc a baix) i una línia de llum clara a l'esquerra.
    - Fes-ne una ajuda comuna `iconaVolum(ctx, traç, base)` que ho apliqui tot.
    - Claus: afegeix gemmes o un cap de clau amb relleu (ara són tiges rectes) i un degradat metàl·lic. Distingeix-les amb forma, no només amb color: ara es diferencien només per tint (`clau_campanar` i `clau_sagrari` són gairebé iguals).
    - `maneta`: és un tub gris pla. Afegeix reflex metàl·lic i un mànec de fusta amb vetes.
- **`roca.png` i `pi.jpg`/`arbre.png`** (el contorn fi i la textura pictòrica no combinen amb `carry`/`tomba_angel`).
  - *Arreglar:* regenera amb el prompt i la imatge de referència `art/objectes/tomba_angel.jpg` (la millor de la mostra) per forçar contorn gruixut negre i cel-shading. Sinó, passa-ho per un pas de contorn: cal un `eines/` que apliqui un traç de 3 px `#120c08` a la silueta. Prioritat màxima a `roca`, que és la més fosca.
- **Dibuixos provisionals que encara substitueixen peces `file: null`:** `dibuixarRunes`, `dibuixarColumna`, `dibuixarRoure`, `dibuixarTiller`, `dibuixarAltar`, `dibuixarTaulaPedra`. Fan servir contorn de 3-4 px, però els graus de gruix varien (1.2 a 4.0 al mateix fitxer). Unifica'ls a una constant `GRUIX_CONTORN`.

### Mitjana
- **`esglesia.png` i els edificis grans** (contorn fi, planol massa fotogràfic): no són chibi (parets planes grans, balustrada molt detallada). Violen "nothing sharp/no tiny ornaments". *Arreglar:* regenerar amb un prompt que demani volums més gruixuts, un portal sobredimensionat i la meitat de detalls.
- **Mides de mostra de color:** `pi` (tronc taronja) i `arbre` (grocs naranja) tenen més saturació que la resta. Baixa la saturació un 10-15% en post-procés per a `pi*` (6 variants).
- **Icones de personatge:** `rialla` (flor amb cara) té la paleta més saturada i el contorn més fi de la fulla. Baixa el rosa fúcsia a un to més càlid.
- **`aigua_sj`, `beuratge`, `cristall_gel`, `estel_llorenc`:** ja tenen bon degradat, però els halos (`estel_llorenc`, `runna`, `llavorLluna`, `gra_rosari`) es veuen com un cercle blanc pla. Fes-los radials i del color de l'objecte, no blanc.
- **Ombra de terra** (vegeu a): decidir i aplicar de manera uniforme.

### Baixa
- `cartell_llums.jpg`: B/N amb text. Acceptar com a excepció o tintar-lo amb la paleta càlida (multiply sobre crema).
- `fragment1`/`fragment2`: dos fulls gairebé iguals. Voldrien variar la forma de la vora.
- `escudella`, `pruna`, `esquelles`: bons, només cal afegir una línia de llum més visible.
- Fulla de contactes: afegir una fila amb les 3 medalles per poder-les comparar (ara surten buides).

## (c) Normes d'estil per a icones i gràfics en codi
1. **Contorn:** `#120c08`, `lineJoin/lineCap = 'round'`, 3 px a 96 px (3%). Tot just un traç exterior; els interiors, 1-1.5 px.
2. **Dos tons més reflex:** cada forma = to base + ombra sòlida a baix-dreta (o degradat vertical suau) + una línia de llum clara (alfa 0.4-0.6) a dalt-esquerra.
3. **Llum única:** dalt-davant, lleugerament cap a l'esquerra. Mai ombres a l'esquerra.
4. **Paleta:** ocres, castanys, crema i verd molsa; un sol color saturat d'accent per objecte. Mai gris pur ni negre dins de les formes.
5. **Llegibilitat a 48 px:** 2-4 formes grans, cap detall <2 px, silueta reconeixible sense color. Els halos, del color de l'objecte i radials.

## Què cal fer primer
1. Crear l'ajuda comuna `iconaVolum` (degradat, ombra de 2 tons, llum) i passar-hi les claus, `maneta`, `fragment*`, `ram`, `flors_isilder`.
2. Fixar `GRUIX_CONTORN` i `CONTORN` en una sola constant a `dibuixos.js` i fer-la servir a `icones.js` i `dibuixos_*.js`.
3. Regenerar `roca` i els `pi*` amb `tomba_angel.jpg` com a referència (o aplicar un contorn de 3 px per post-procés).
4. Retocar els halos blancs de les icones i baixar la saturació de `rialla` i `pi`.
5. Decidir l'ombra de terra (sí/no) i l'excepció de `cartell_llums`, i escriure-ho a `docs/PROMPTS_GRAFICS.md`.
