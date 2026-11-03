# Música que falta

Cada cançó és **opcional**: quan el fitxer existeix a `assets/musica/`, sona; mentre no hi és, sona la de reserva. No cal tocar codi.

## Com es treballa (tu només generes)

1. Genera la peça amb el prompt de sota (Suno, Udio…, en mode **instrumental**). Si el generador et deixa triar la durada, demana'n **2-3 minuts** (3-4 per als bucles).
2. Deixa l'MP3 **tal com surt** a `art/musica/cru/` amb el nom de la taula (`boss.mp3`, `gabia.mp3`…). No cal que sigui un bucle perfecte ni que duri exacte.
3. Digues-m'ho i **jo la tallo**: busco un tros que tanqui, hi faig un fondut d'enllaç perquè el bucle no es noti, la deixo a ≈ −16 LUFS, la passo a `.m4a` (amb l'índex al principi, perquè vagi en streaming) i la provo al joc.

**Cançó adjunta.** A cada peça de sota hi diu si cal adjuntar-hi una cançó. Quan cal, és gairebé sempre **`art/musica/intro_runna.mp3`**, la primera prova, on la melodia del joc es sent més clara (la resta de músiques en són variacions). Al generador (Suno: *Upload* → *Cover*) puja-la i enganxa el prompt com a estil: així conserva la melodia i canvia l'instrumentació i l'ànim. El tema principal només surt a l'epíleg, als crèdits i al despertar de Runna: si sonés a totes les peces noves, al final ja no faria l'efecte de «torna la melodia».

Si en generes diverses versions, deixa-les totes (`boss_a.mp3`, `boss_b.mp3`) i en trio la que encaixa millor.

## Què cal, per ordre

Fetes (✔): totes les imprescindibles (`boss`, `boss_final`, `gabia`, `epileg`, `credits`, `jingle_boss`, `jingle_runna`) i `taverna`, `cirosa`, `biblioteca`, `hostatgeria`, `girgoles` i `jingle_objecte`. Falten `poble`, `santuari` i `celles`. Els originals són a `art/musica/cru/`; `jingle_runna` comença al cop fort de la cançó (9,7 s), que és quan l'Ineu alça l'espasa.

| Fitxer | On sona | Tipus | Reserva mentrestant | Prioritat |
|---|---|---|---|---|
| ✔ `boss` | Combat contra l'Ocellaire, fases 1 i 2 | bucle | masmorra | **Imprescindible** |
| ✔ `boss_final` | Combat, fase 3 (el terra crema) | bucle | `boss` | **Imprescindible** |
| ✔ `gabia` | Sala de la Gàbia, abans i després del combat | bucle | masmorra | **Imprescindible** |
| ✔ `epileg` | Alliberament dels nens i epíleg al Santuari | bucle | tema de la plaça | **Imprescindible** |
| ✔ `credits` | Crèdits | bucle | `epileg` | **Imprescindible** |
| ✔ `jingle_boss` | Quan cau l'Ocellaire | peça única | silenci | **Imprescindible** |
| ✔ `jingle_runna` | Quan Runna es desperta al Dolmen | peça única | silenci | **Imprescindible** |
| `poble` | Exteriors del poble (Plaça, Monestir, Runes, Celler, Era, Jardí, Cementiri, Sant Antoni...) | bucle | el tema del títol | **Molt recomanada** |
| `santuari` | El Santuari per dins | bucle | interiors | Recomanada |
| ✔ `taverna` | La Taverna per dins | bucle | interiors | Recomanada |
| ✔ `cirosa` | Camí de la Cirosa, pastura i Mas | bucle | bosc | Recomanada |
| ✔ `biblioteca` | Biblioteca del Monestir | bucle | interiors | Recomanada |
| ✔ `hostatgeria` | Hostatgeria i les tres cambres | bucle | interiors | Recomanada |
| ✔ `girgoles` | Sala de les Gírgoles | bucle | masmorra | Recomanada |
| `jingle_arma` | Quan l'Ineu alça una arma nova (el bastó, la branca del Til·ler) | peça única | `jingle_objecte` | **Recomanada** |
| `jingle_objecte` (no es fa servir: els objectes sonen amb `jingle_arma`) | Quan l'Ineu alça el bastó o la branca | peça única | fanfara sintetitzada | Recomanada |

`celles` (Les Cel·les) la fas tu a part; la resta de peces que ja hi ha: *The Hero's Ascension* (títol i, fins que hi hagi `poble`, el poble), *Woodland Path* (boscos, la Caseta i els Dipòsits), *Inside All* (interiors i, fins que hi hagi `santuari`, el Santuari), *Deep Dungeon Stillness* (masmorres) i *light book* (pròleg). El Celler (la sala del ping-pong) fa servir `taverna`.

Si només en fas set, que siguin les imprescindibles: el combat final i el despertar de Runna són els moments on més es nota que falta música.

## El leitmotiv (la fanfàrria d'`intro_runna`)

Do Mi Mi Mi Fa Sol Do · Do Re Mi Fa Fa Mi Re Do Re (notes i ritme a `art/musica/motiu/`; `Sfx.FANFARRA` a `js/sfx.js`). A més de sonar a les cançons, el joc el toca en moments curts:
- **Quan l'Ineu cau** i el Pare Jordà el recull: el principi, lent i suau, amb flauta.
- **El cofre de joguines de la Caseta**: una capsa de música hi toca el principi abans de treure'n la Maneta.
- **L'orgue de l'epíleg**: després del Cant del Miracle, la fanfàrria sencera amb els acords de l'original.
- **La Pianista, després del final**: si hi parles, la toca a l'orgue.

La música de fons s'abaixa mentre sona (`Joc.leitmotiv`).

## L'estil comú

Tot ha de sonar de la mateixa família que les quatre del món base: **fantasia acústica de cambra, càlida, una mica fosca, amb ànima de poble**. Flauta i flabiol, arpa, violí, violoncel, orgue d'església, cors sense paraules, tambors i campanes; acordió i tenora només a la Taverna i la Cirosa. Res de guitarres elèctriques, de bateries de rock ni de veu amb lletra. Si el generador deixa pujar una referència, puja-hi una de les quatre del món base.

Tonalitat: el tema del joc (`intro_runna.mp3`) i les variacions són en **Do major**; les fetes amb Cover d'`intro_runna` (epíleg, crèdits, Runna) també han sortit en Do. Les altres, encara que el prompt digui «E minor», poden quedar en qualsevol to: entre zones es canvia de cançó i no es nota. Només importa quan dues coses sonen alhora (un jingle damunt la música, l'orgue de l'epíleg damunt `epileg`), i això ja ho ajusto jo. Si un generador no respecta el to, no passa res; el motiu dels cants de sota és un detall que, si no surt, afegeixo jo amb una flauta.

### Els tres cants (només si el generador deixa guiar la melodia)

| Cant | Notes (Mi–Sol–Si) | On convé que s'insinuï |
|---|---|---|
| Aurora | Mi – Sol – Si | plaça, bosc, `cirosa`, final dels `credits` |
| Pedres | Si – Mi – Sol – Mi | `biblioteca`, `gabia`, `jingle_runna` |
| Miracle | Mi – Si – Sol – Si – Mi | `boss` (en menor, lent), `epileg` (en Mi major, triomfal), `credits` |

El truc de la història és que el mal fa servir el Cant del Miracle en menor i desafinat, i l'epíleg el repeteix en major: *el riure ha tornat*.

## Els prompts

Tots en anglès i **sense lletra** (afegeix «instrumental, no lyrics» si el generador té l'opció).

### Combat i final

**`boss`** (bucle, ~2 min): persecució gòtica però elegant, ritme de vals fosc, tambors de guerra. **Sense adjunt** (l'Ocellaire té música pròpia, no la de l'heroi).
> instrumental dark fantasy boss battle, gothic chamber orchestra, around 130 bpm, E minor, waltz-like triplet feel, urgent staccato strings, cello ostinato, war drums, church organ, piccolo flute birdsong trills, wordless choir, spooky but elegant, Catalan folk color, no electric guitar, no synths, no lyrics

**`boss_final`** (bucle, ~1:30): la mateixa peça en versió desesperada, més ràpida i plena. **Adjunta el teu `boss`** quan el tinguis (Cover): ha de ser la mateixa melodia, més ràpida i desesperada.
> instrumental epic final boss battle, desperate and fiery, around 150 bpm, E minor, tremolo strings, timpani and war drums, church organ at full power, wordless choir with short shouts, brass stabs, relentless, same melody as a dark gothic waltz but faster, no lyrics, no guitars

**`gabia`** (bucle, ~2 min): cova enorme sobre un avenc; sense ritme. **Sense adjunt** (ambient sense melodia).
> instrumental dark ambient fantasy cavern, very slow, E minor, deep church organ drone, detuned bells, sparse haunting flute with a simple distant melody, long reverb, sense of vast space, ominous but fragile, no drums, no lyrics

**`epileg`** (bucle, ~2:30): alleujament, un poble que canta; comença molt suau i creix. **Adjunta `art/musica/intro_runna.mp3`** (Cover): torna la melodia del joc, ara en Mi major i amb el poble cantant. És on més s'ha de reconèixer.
> instrumental warm hopeful ending theme, gentle chamber folk, around 84 bpm, E major, solo harp and flute, cello, growing into a wordless village choir and church organ, bells, joyful and tender, relief after darkness, not cheesy, Catalan village feel, no lyrics

**`credits`** (bucle, ~2:30): com un «adéu» a un viatge, més ampli i nostàlgic que `epileg`. **Adjunta `art/musica/intro_runna.mp3`** (Cover): el tema sencer, de comiat.
> instrumental nostalgic ending credits theme, slow, E major, solo flute playing three simple melodies, harp arpeggios, string ensemble swelling, soft organ pad, bells, bittersweet and thankful, cinematic but intimate, no lyrics

### Peces úniques (genera'n 20-30 s i jo n'agafo el tros bo)

**`jingle_boss`** (~8 s): l'Ocellaire cau. Un cop sec de timbal, un silenci, una resolució lenta cap a Mi major, cua de campana. Alleujament cansat, no festa. **Sense adjunt.**
> short orchestral sting, boss defeated, heavy timpani hit with a chain, a moment of silence, slow resolve from E minor to E major with harp and soft choir, single bell tail

**`jingle_runna`** (~22 s): el despertar de l'espasa. Puja des d'un drone d'orgue fins a un cop fort de timbal i cor, i acaba lluminós en Mi major amb arpa i campanes. Els temps exactes dels cops (≈ 12 s) els ajusto jo tallant i muntant, o ajusto la cinemàtica a la peça. **Adjunta `art/musica/intro_runna.mp3`** (Cover): n'agafo el tros on la melodia entra amb força, just al cop de l'espasa. Pot sortir llarga; ja la tallo jo.
> cinematic fantasy awakening sting, building from a dark organ drone and tremolo, solo flute playing a simple four-note melody, massive timpani hit and choir shout, then luminous resolution to E major with harp glissando, bells and choir, long reverb tail

**`jingle_arma`** (~5 s): l'Ineu alça una arma nova (i, de moment, també quan surt un objecte d'un cofre). La mateixa per a totes les armes. Heroica però curta: una crida que puja i un acord que ressona. En **Do major**, perquè lligui amb el tema. **Sense adjunt.** Suno en farà una peça llarga: jo n'agafo els primers segons, fins que l'acord ressona.
> short heroic fantasy fanfare for obtaining a new weapon, C major, solo trumpet and horns playing a bright rising call C–E–G–C, answered by a full orchestral C major chord with timpani roll and cymbal swell, harp glissando, sparkling bells and a wooden flute trill on top, medieval and noble, a clear ending that rings out, no drum loop, no vocals, no lyrics

**`jingle_objecte`** (~4 s): arpegi ascendent de Mi major que s'obre en un acord amb una campaneta. Petita i humil. **Sense adjunt.** Si vols que siguin les primeres notes del tema, no cal generar res: les tallo jo d'`intro_runna.mp3`.
> short fantasy item fanfare, acoustic, ascending E major arpeggio on harp and wooden flute, opens into a warm sustained chord, small bell shimmer, gentle, no drums

### Llocs (recomanades; si en falta alguna, no passa res)

**`poble`** (bucle, ~2:30): el poble de dia, on l'Ineu passa més estona. Ara hi sona la mateixa que al títol (*The Hero's Ascension*), que és massa èpica per caminar-hi hores i fa que el títol i el joc sonin igual. Ha de ser la melodia del joc, però tranquil·la, sense clímax, per sentir-la molta estona sense cansar. **Adjunta `art/musica/intro_runna.mp3`** (Cover): la melodia, però en versió de passeig.
> instrumental gentle village daytime theme, warm acoustic chamber folk, around 88 bpm, E minor with moments of G major, solo wooden flute and harp carrying the melody softly, light pizzicato strings, soft frame drum, a little accordion, peaceful with a faint hint of mystery, even dynamics, no big climax, seamless loop, no lyrics

**`santuari`** (bucle, ~2 min): el Santuari per dins, amb l'orgue que la boira ha emmudit. Recollit i una mica trist. **Sense adjunt.**
> instrumental sacred sanctuary ambience, soft wordless choir, a church organ that sounds faint and hesitant as if muted by fog, harp, distant bells, slow, E minor, reverent and a little sad, long reverb, no drums, no lyrics

**`taverna`** (~1:45): alegre però una mica forçada; la Càren dorm i hi ha un nen desaparegut. **Sense adjunt** (color propi del lloc).
> instrumental Catalan tavern folk waltz, accordion lead, village fiddle, tenora reed melody, tambourine and bass drum, A minor, cozy but slightly uneasy, no lyrics

**`cirosa`** (~2 min): pastors desterrats; flabiol, pandereta, bordó de gaita i campanes d'esquelles. **Sense adjunt** (color propi del lloc).
> instrumental shepherd folk ballad, solo wooden flabiol flute and frame drum, bagpipe drone, sheep bell chimes, slow 3/4, D minor to F major, windy and lonely, tender, no lyrics

**`biblioteca`** (~2 min): monjos que taral·legen, clavecí i un violoncel sol; pols dins la llum. **Sense adjunt** (color propi del lloc).
> instrumental quiet monastery library, soft wordless Gregorian humming, harpsichord arpeggios, solo cello, slow, E dorian, dust in sunlight, calm, no drums, no lyrics

**`hostatgeria`** (~1:45): calma, càlida i una mica còmica (tres sacerdotesses). **Sense adjunt** (color propi del lloc).
> instrumental cozy convent music, harp and flute, harmonium, small hand bell, light pizzicato strings, G major, warm and slightly humorous, no lyrics

**`girgoles`** (~2 min): cova humida i fosforescent, gotes i espores; l'única peça que admet pad sintètic. **Sense adjunt** (ambient sense melodia).
> instrumental eerie bioluminescent cave ambience, dripping water, soft marimba and vibraphone, glassy pads, very slow, E phrygian, sparse, mysterious and calm, no drums, no lyrics

## Què fa el joc amb cada peça

- Al carregar detecta quins fitxers existeixen; si en falta un, fa servir la reserva de la taula.
- `boss` arrenca quan surt l'Ocellaire; a la fase 3 canvia a `boss_final`; en caure, la música s'atura i sona `jingle_boss`.
- En obrir la gàbia arrenca `epileg` i **no es reinicia** en canviar al Santuari: és una sola peça contínua.
- `credits` sona a la pantalla de crèdits; en tornar al joc, cada zona torna a la seva música.
- `jingle_runna` sona un cop a l'inici de la cinemàtica del Dolmen, per sobre de la música de zona.
- `jingle_objecte` sona quan l'Ineu alça el bastó o la branca; la música de zona baixa de volum uns segons.
- Les cançons de fons van en streaming (no es descodifiquen senceres: al mòbil, quatre cançons descodificades eren ~280 MB). Per això el `.m4a` ha de tenir l'índex al principi; `eines/comprimir_media.sh` ja ho fa.
- Els combats ja porten un tambor sintètic (`Sfx.tambor`) per sobre; el bombo de `boss` convé que sigui net perquè no s'acumulin.
