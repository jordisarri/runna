# Música que falta

Cada cançó és **opcional**: quan el fitxer existeix a `assets/musica/`, sona; mentre no hi és, sona la de reserva. No cal tocar codi.

## Com es treballa (tu només generes)

1. Genera la peça amb el prompt de sota (Suno, Udio…, en mode **instrumental**). Si el generador et deixa triar la durada, demana'n **2-3 minuts** (3-4 per als bucles).
2. Deixa l'MP3 **tal com surt** a `art/musica/cru/` amb el nom de la taula (`boss.mp3`, `gabia.mp3`…). No cal que sigui un bucle perfecte ni que duri exacte.
3. Digues-m'ho i **jo la tallo**: busco un tros que tanqui, hi faig un fondut d'enllaç perquè el bucle no es noti, la deixo a ≈ −16 LUFS, la passo a `.m4a` (amb l'índex al principi, perquè vagi en streaming) i la provo al joc.

Si en generes diverses versions, deixa-les totes (`boss_a.mp3`, `boss_b.mp3`) i en trio la que encaixa millor.

## Què cal, per ordre

| Fitxer | On sona | Tipus | Reserva mentrestant | Prioritat |
|---|---|---|---|---|
| `boss` | Combat contra l'Ocellaire, fases 1 i 2 | bucle | masmorra | **Imprescindible** |
| `boss_final` | Combat, fase 3 (el terra crema) | bucle | `boss` | **Imprescindible** |
| `gabia` | Sala de la Gàbia, abans i després del combat | bucle | masmorra | **Imprescindible** |
| `epileg` | Alliberament dels nens i epíleg al Santuari | bucle | tema de la plaça | **Imprescindible** |
| `credits` | Crèdits | bucle | `epileg` | **Imprescindible** |
| `jingle_boss` | Quan cau l'Ocellaire | peça única | silenci | **Imprescindible** |
| `jingle_runna` | Quan Runna es desperta al Dolmen | peça única | silenci | **Imprescindible** |
| `taverna` | La Taverna per dins | bucle | interiors | Recomanada |
| `cirosa` | Camí de la Cirosa, pastura i Mas | bucle | bosc | Recomanada |
| `biblioteca` | Biblioteca del Monestir | bucle | interiors | Recomanada |
| `hostatgeria` | Hostatgeria i les tres cambres | bucle | interiors | Recomanada |
| `girgoles` | Sala de les Gírgoles | bucle | masmorra | Recomanada |
| `jingle_objecte` | Quan l'Ineu alça el bastó o la branca | peça única | fanfara sintetitzada | Recomanada |

`celles` (Les Cel·les) la fas tu a part; la resta de peces que ja hi ha: *The Hero's Ascension* (plaça i poble), *Woodland Path* (boscos), *Inside All* (interiors), *Deep Dungeon Stillness* (masmorres) i *light book*.

Si només en fas set, que siguin les imprescindibles: el combat final i el despertar de Runna són els moments on més es nota que falta música.

## L'estil comú

Tot ha de sonar de la mateixa família que les quatre del món base: **fantasia acústica de cambra, càlida, una mica fosca, amb ànima de poble**. Flauta i flabiol, arpa, violí, violoncel, orgue d'església, cors sense paraules, tambors i campanes; acordió i tenora només a la Taverna i la Cirosa. Res de guitarres elèctriques, de bateries de rock ni de veu amb lletra. Si el generador deixa pujar una referència, puja-hi una de les quatre del món base.

Tonalitat base: **Mi menor**. Si un generador no respecta el to, no passa res; el motiu dels cants de sota és un detall que, si no surt, afegeixo jo amb una flauta.

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

**`boss`** (bucle, ~2 min): persecució gòtica però elegant, ritme de vals fosc, tambors de guerra.
> instrumental dark fantasy boss battle, gothic chamber orchestra, around 130 bpm, E minor, waltz-like triplet feel, urgent staccato strings, cello ostinato, war drums, church organ, piccolo flute birdsong trills, wordless choir, spooky but elegant, Catalan folk color, no electric guitar, no synths, no lyrics

**`boss_final`** (bucle, ~1:30): la mateixa peça en versió desesperada, més ràpida i plena.
> instrumental epic final boss battle, desperate and fiery, around 150 bpm, E minor, tremolo strings, timpani and war drums, church organ at full power, wordless choir with short shouts, brass stabs, relentless, same melody as a dark gothic waltz but faster, no lyrics, no guitars

**`gabia`** (bucle, ~2 min): cova enorme sobre un avenc; sense ritme.
> instrumental dark ambient fantasy cavern, very slow, E minor, deep church organ drone, detuned bells, sparse haunting flute with a simple distant melody, long reverb, sense of vast space, ominous but fragile, no drums, no lyrics

**`epileg`** (bucle, ~2:30): alleujament, un poble que canta; comença molt suau i creix.
> instrumental warm hopeful ending theme, gentle chamber folk, around 84 bpm, E major, solo harp and flute, cello, growing into a wordless village choir and church organ, bells, joyful and tender, relief after darkness, not cheesy, Catalan village feel, no lyrics

**`credits`** (bucle, ~2:30): com un «adéu» a un viatge, més ampli i nostàlgic que `epileg`.
> instrumental nostalgic ending credits theme, slow, E major, solo flute playing three simple melodies, harp arpeggios, string ensemble swelling, soft organ pad, bells, bittersweet and thankful, cinematic but intimate, no lyrics

### Peces úniques (genera'n 20-30 s i jo n'agafo el tros bo)

**`jingle_boss`** (~8 s): l'Ocellaire cau. Un cop sec de timbal, un silenci, una resolució lenta cap a Mi major, cua de campana. Alleujament cansat, no festa.
> short orchestral sting, boss defeated, heavy timpani hit with a chain, a moment of silence, slow resolve from E minor to E major with harp and soft choir, single bell tail

**`jingle_runna`** (~22 s): el despertar de l'espasa. Puja des d'un drone d'orgue fins a un cop fort de timbal i cor, i acaba lluminós en Mi major amb arpa i campanes. Els temps exactes dels cops (≈ 12 s) els ajusto jo tallant i muntant, o ajusto la cinemàtica a la peça.
> cinematic fantasy awakening sting, building from a dark organ drone and tremolo, solo flute playing a simple four-note melody, massive timpani hit and choir shout, then luminous resolution to E major with harp glissando, bells and choir, long reverb tail

**`jingle_objecte`** (~4 s): arpegi ascendent de Mi major que s'obre en un acord amb una campaneta. Petita i humil.
> short fantasy item fanfare, acoustic, ascending E major arpeggio on harp and wooden flute, opens into a warm sustained chord, small bell shimmer, gentle, no drums

### Llocs (recomanades; si en falta alguna, no passa res)

**`taverna`** (~1:45): alegre però una mica forçada; la Carmen dorm i hi ha un nen desaparegut.
> instrumental Catalan tavern folk waltz, accordion lead, village fiddle, tenora reed melody, tambourine and bass drum, A minor, cozy but slightly uneasy, no lyrics

**`cirosa`** (~2 min): pastors desterrats; flabiol, pandereta, bordó de gaita i campanes d'esquelles.
> instrumental shepherd folk ballad, solo wooden flabiol flute and frame drum, bagpipe drone, sheep bell chimes, slow 3/4, D minor to F major, windy and lonely, tender, no lyrics

**`biblioteca`** (~2 min): monjos que taral·legen, clavecí i un violoncel sol; pols dins la llum.
> instrumental quiet monastery library, soft wordless Gregorian humming, harpsichord arpeggios, solo cello, slow, E dorian, dust in sunlight, calm, no drums, no lyrics

**`hostatgeria`** (~1:45): calma, càlida i una mica còmica (tres sacerdotesses).
> instrumental cozy convent music, harp and flute, harmonium, small hand bell, light pizzicato strings, G major, warm and slightly humorous, no lyrics

**`girgoles`** (~2 min): cova humida i fosforescent, gotes i espores; l'única peça que admet pad sintètic.
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
