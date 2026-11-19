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

---

# Addenda: verificació amb els `.webp` reals i coherència de `art/` (2026-11-19)

**Mètode.** Converteixo els `.webp` d'`assets/` a una fulla de contactes i els miro (l'agent no podia). Després creuo `art/` amb `assets/` per nom de fitxer. Els scripts i resultats són reproduïbles (mateix nom = mateixa peça).

## 1. El que l'informe deia i ara està confirmat (o matisat) amb el render real
- **Confirmat:** `arbre`, `pi`, `pi_arrels`, `pi_tres_cants_mort`, `roca` i `esglesia` són **pictòrics**: contorn fi o inexistent i textura. En canvi `roca_mobil`, `roca_petita`, `roca_molsa`, `placa_pi`, `placa_dolmen`, `columna_heura`, `rialla` i `carry` tenen contorn negre gruixut i cel-shading net. Dos mons a la mateixa pantalla.
- **Matís important:** `roca.webp` (la fosca i realista) és ara la **peça més dissonant**, però les roques ja tenen una família coherent (`roca_mobil`/`roca_petita`/`roca_molsa`). El pas més barat és **substituir `roca` per `roca_molsa`/`roca_mobil` als llocs on només és decoració** (o regenerar-la amb el prompt de `roca_molsa`), no tocar l'estil de res més.
- **Matís:** `hostatgeria.webp` és molt més a prop del xibi que `esglesia.webp` (volums plans, finestres amb persianes, contorn fosc fi). La inconsistència d'edificis es concentra a `esglesia`.
- **Matís:** `cartell_llums` és B/N amb text, però ja es llegeix com a peça diegètica. Es pot deixar com a excepció (decisió registrada).
- **Matís:** el color de `pi` (tronc taronja) és coherent amb una llum de capvespre, però és el més saturat de la fulla; amb un –10 % de saturació queda al nivell d'`arbre`.

## 2. Incoherències a `art/` (mateix nom, fitxers diferents) — ordenades per risc
La font de cada `.webp` s'ha determinat comparant-ne la imatge amb cada candidata (mitjana de diferència en 48×48 px: <3 = és aquesta).

| Peça | Fitxers | Quin és l'origen del webp | Risc |
|---|---|---|---|
| `tarota` | `art/ui/tarota.png` (1024×571) i `art/ineu/tarota.png` (687×1024) | **Són dues imatges diferents amb el mateix nom.** `assets/ui/tarota.webp` ve d'`ui/`; `assets/ineu/tarota.webp` (clau `ineu_flauta`) ve d'`ineu/`. | **Alt**: qui en retoqui «la tarota» pot canviar la que no és. Cal reanomenar `art/ineu/tarota.png` → `ineu_tarota.png`. |
| `ocellaire` | `art/proleg/ocellaire.jpg` (1536×2752) i `art/enemics/ocellaire.jpg` (1536×2722) | `assets/enemics/ocellaire.webp` ve d'`enemics/`. El de `proleg/` és el **retrat** (`assets/retrats/ocellaire.webp`), no coincideix. | **Alt**: nom idèntic, ús diferent. Reanomenar el de `proleg/` → `ocellaire_proleg.jpg`. |
| `logo_runna` | `.jpg` (771 KB) i `.png` (3,6 MB), 2752×1536 | El `.png` (diferència 0,6) | Mitjà: el `.jpg` és un residu; el compressor ja treballa des del `.png`. |
| `bolet_verinos` | `.jpg` (1984×2144) i `.png` (1206×1305) | El `.png` (1,9) | Mitjà: el `.jpg` no coincideix amb el joc; si algú regenera des d'ell canvia la peça. |
| `joaneta` | `personatges/joaneta.png` i `personatges/antics/joaneta.jpg` | El `.png` (0,3) | Baix: l'antic ja és a `antics/`. |
| `pi_tres_cants_mort` | `natura/…png` i `natura/antics/…jpg` | El `.png` (0,1) | Baix: idem. |
| `aixeca_tiler` | `ineu/aixeca_tiler.png` (192×422) i `ineu/aixeca/aixeca_tiler.jpg` (926×2000) | Cal comprovar-ho a mà (el `.png` és ja la versió petita) | Mitjà: dos formats, mides ×5 diferents. |
| `icona_runna` | `pwa/` i `pwa/antics/` | – | Baix: l'antic ja és a `antics/`. |
| `espasa`, `branca_tiler` | `armes/*.jpg|png` i `armes/sense_contorn/*.webp` | **El webp d'`assets/armes/` no coincideix amb cap dels dos** (diferència ≈20): hi ha un tercer pas (`eines/contorn_armes.py` posa contorn). | Baix, però convé que `LLEGEIX.md` ho digui: l'original sense contorn és `sense_contorn/`, i el joc usa la versió amb contorn generada. |
| frames d'Ineu (`down.png`, `up.png`, `left.png`…) | Fins a **19 fitxers amb el mateix nom** a `ineu/atac_arma/*`, `ineu/cop/`, `ineu/v2/zip_*`, `ineu/caminar/transparents`, `ineu/no_usats/tiller_up_v5…v8_proves` | Cada carpeta és un conjunt diferent | **Alt per a les eines i els humans**: cap nom permet saber el conjunt sense la ruta. Les carpetes `_v1`, `_v4`, `_v5` i `no_usats/*_proves` haurien de moure's a `art/arxiu/`. |
| `Ineu-iso_attack_*-v3` | `ineu/atac/` (png) i `ineu/antics/` (png, webp i jpg) | – | Baix: còpia del mateix conjunt en 3 formats. |
| `columna_heura.webp` | A `art/objectes/` hi ha un **`.webp` com a original**, no un `png|jpg` | – | Mitjà: l'original perd qualitat (és ja un webp 1024×1536); convindria guardar-hi el PNG/JPG d'origen. |

## 3. Altres incoherències entre `art/` i `assets/` (sense `.webp` equivalent, o al revés)
- **Webp sense original a `art/`** (no es poden regenerar): `assets/objectes/cartell_llums_petit`, `orgue_petit`, `pergola_grao`, `tarota_gran`, `ocellaire_llança`, `visitant_zombi`, `home_raim_camina|mira|horitzo`, `ombra_monjo` (**duplicat** a `personatges/` i `retrats/`) i tots els frames d'Ineu d'`atac/`, `cop/`, `pingpong/`. Els derivats de fulles d'`eines/fer_*.py` són coherents; els dits «sense original» són els que cal rastrejar (cap script els genera).
- **Relació d'aspecte** original ↔ webp: la majoria de personatges (carry, dolora, eve…) passen d'~0,75 a ~0,4 perquè s'ha retallat el marge (normal). Surten **sospitosos** només: `home_raim.jpg` (1312×3200) → `retrats/home_raim.webp` (340×340, és un retrat retallat: acceptable), `pastor_camina` (630×1024 → 2400×2400 és una **fulla de frames**) i `intro.png` 1920×1080 → `intro.webp` 2048×2048 (fulla de vídeo).
- Cap referència a `js/` apunta a un fitxer inexistent, i només tres `.webp` d'`assets/` no surten citats a `js/` (`joaneta_idle`, `ineu_reves`, `ineu_drive`; es carreguen per nom construït, no són orfes).

## 4. Pla millorat (ordre proposat, de menys a més decisió estètica)
1. **Neteja de noms a `art/` (sense risc, no toca el joc):** reanomenar `ineu/tarota.png` i `proleg/ocellaire.jpg`; moure els `.jpg` residuals (`logo_runna.jpg`, `bolet_verinos.jpg`) i les carpetes de proves d'Ineu a `art/arxiu/`; guardar l'original PNG de `columna_heura`. Afegir a `art/LLEGEIX.md` la taula de «peça → webp d'`assets/`» (la pot generar un script).
2. **Eina de comprovació** (`eines/auditar_art.py`): el que he fet avui, executable: webp sense original, noms duplicats a `art/`, relació d'aspecte i referències de `js/` a fitxers inexistents. Es pot passar abans de cada publicació.
3. **Unificar la mida del contorn al codi:** una sola constant `CONTORN`/`GRUIX_CONTORN` a `js/dibuixos.js` (com diu l'informe) i la funció `iconaVolum` per a les 14 icones planes.
4. **Roques:** usar la família `roca_molsa`/`roca_mobil` en comptes de `roca.webp` (o regenerar-la). És el canvi amb més efecte visual per menys feina.
5. **Contorn gruixut als gràfics pictòrics** (`arbre`, `pi*`, `esglesia`): és decisió **teva**. Opcions: (a) regenerar amb referència `tomba_angel`/`roca_mobil`; (b) post-procés `eines/contorn_*.py` (traç de 3 px `#120c08`); (c) deixar-los pictòrics com a «fons» i acceptar que els objectes interactius són més gràfics (un contrast que pot ajudar al jugador a distingir què és interactiu).
6. Baixar un 10 % la saturació de `pi*` i `rialla`; halos radials del color de l'objecte.

**Límits d'aquesta revisió.** He vist el render de 17 gràfics d'`assets/` (fulla de dalt) i la taula de duplicats és exhaustiva per nom, però la de «quin és l'origen» és aproximada (comparació en 48 px). No he vist els personatges NPC ni els retrats al detall.

## 5. Rectificació i què s'ha executat (2026-11-19)
- **Rectificació:** `art/` fa de mirall d'`assets/` per carpeta (README). Per això `art/ui/tarota.png` ↔ `art/ineu/tarota.png` i `art/proleg/ocellaire.jpg` ↔ `art/enemics/ocellaire.jpg` **no són conflictes** (cada un és l'origen d'un webp d'una carpeta diferent). Tampoc s'han mogut les carpetes `_v1`, `espasa_up_v4`, `tiller_up_v5`: les usen `fer_atac_arma.py` i `fer_atac_tiller_up_editable.py`. `columna_heura` només existeix com a `.webp` d'origen; no es pot recuperar el PNG.
- **Neteja:** `logo_runna.jpg` → `art/titol/antics/`; `bolet_verinos.jpg` → `art/enemics/antics/`; `roca.png` → `art/natura/no_usats/` i `assets/natura/roca.webp` eliminat (ja no es feia servir: la clau `roca` és `roca_petita.webp`; el pas 4 ja era fet).
- **`eines/auditar_art.py`:** webp sense original, formats duplicats a la mateixa carpeta, referències de `js/` a fitxers inexistents i relació d'aspecte. Ara surt net (només avisos d'aspecte, que són retalls normals).
- **`GRUIX_CONTORN`** (3) a `js/dibuixos.js`, usat als traços de contorn de `dibuixos*.js`.
- **`iconaVolum`** (`js/icones.js`): ombra suau a baix i llum a dalt-esquerra sobre 17 icones planes. Les 5 claus tenen cap diferent (anell, rombe, trèvol, quadrat, creu) i llum a la tija.
- **Halos:** `llavorLluna` (lila radial) i `benedicio_fraterna` (daurat radial) ja no són un cercle pla; `estel_llorenc`, `runna` i `gra_rosari` ja eren radials.
- **`eines/contorn_natura.py`:** es va provar un contorn fosc a `arbre` i `pi*` i **es va descartar** (queda malament). Només queda la baixada de saturació (–12 %; `rialla` –10 % al fúcsia). La font és a `art/natura/sense_contorn/`.
- **Decisions d'estil registrades:** ombra de terra només a peces d'escenari; `cartell_llums` queda com a excepció B/N.
