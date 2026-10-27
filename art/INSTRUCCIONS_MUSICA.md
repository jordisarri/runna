# Instruccions per fer la música que falta

Aquest document diu **exactament** quines cançons falten, com han de ser i com es posen al joc. El joc ja està preparat: cada cançó és
**opcional**. Quan el fitxer existeix a `assets/musica/`, sona; mentre no hi és, sona la de reserva (vegeu la taula). No cal tocar cap línia de codi.

## 0. Resum: què falta i què és imprescindible

| # | Fitxer (`assets/musica/…`) | On sona | Tipus | Durada | Prioritat | Reserva mentrestant |
|---|---|---|---|---|---|---|
| 1 | `boss.m4a` | Combat contra l'Ocellaire, fases 1 i 2 | bucle | 2:00 | **Imprescindible** | masmorra |
| 2 | `boss_final.m4a` | Combat, fase 3 (foc a terra) | bucle | 1:30 | **Imprescindible** | `boss` |
| 3 | `epileg.m4a` | Alliberament dels nens + epíleg al Santuari | bucle | 2:30 | **Imprescindible** | tema de la plaça |
| 4 | `credits.m4a` | Crèdits | bucle | 2:30 | **Imprescindible** | `epileg` |
| 5 | `gabia.m4a` | Sala de la Gàbia (abans i després del combat) | bucle | 2:00 | **Imprescindible** | masmorra |
| 6 | `jingle_boss.m4a` | Quan cau l'Ocellaire | peça única | 0:08 | **Imprescindible** | silenci |
| 7 | `jingle_runna.m4a` | Quan Runna es desperta al Dolmen | peça única | 0:22 | **Imprescindible** | silenci |
| 8 | `celles.m4a` | Les Cel·les (**la fas tu**) | bucle | 2:00 | fet per tu | tema de la plaça |
| 9 | `taverna.m4a` | La Taverna per dins | bucle | 1:45 | Recomanada | interiors |
| 10 | `cirosa.m4a` | Camí de la Cirosa, pastura i Mas | bucle | 2:00 | Recomanada | bosc |
| 11 | `biblioteca.m4a` | Biblioteca del Monestir | bucle | 2:00 | Recomanada | interiors |
| 12 | `hostatgeria.m4a` | Hostatgeria i les tres cambres de les sacerdotesses | bucle | 1:45 | Recomanada | interiors |
| 13 | `girgoles.m4a` | Sala de les Gírgoles | bucle | 2:00 | Recomanada | masmorra |
| 14 | `jingle_objecte.m4a` | Quan l'Ineu alça el bastó de pelegrí o la branca del Til·ler | peça única | 0:04 | Recomanada | fanfara sintetitzada |

Les 4 que ja hi ha són el «món base»: `The Hero's Ascension` (plaça i poble), `Woodland Path` (boscos), `Inside All` (interiors) i
`Deep Dungeon Stillness` (masmorres). Les noves han de **sonar de la mateixa família**: fantasia acústica de cambra, càlida, una mica
fosca i amb ànima de poble. Si el generador deixa pujar una referència, pujeu-hi una d'aquestes quatre.

---

## 1. El llenguatge musical comú (llegiu-ho abans de fer res)

### 1.1 Els tres cants del joc són notes reals
El joc té tres melodies que el jugador toca amb la flauta (notes 1, 2 i 3 = **Mi, Sol, Si**; a la partida sonen a 330, 392 i 494 Hz).
Són el fil de tota la banda sonora; feu-les aparèixer, de forma subtil, a les peces que es diuen:

| Cant | Notes | Equival a | On ha d'aparèixer |
|---|---|---|---|
| Cant de l'Aurora | 1-2-3 | Mi – Sol – Si | plaça, bosc, `cirosa` (com a pregunta lleugera) |
| Cant de les Pedres | 3-1-2-1 | Si – Mi – Sol – Mi | `biblioteca`, `gabia`, `jingle_runna` |
| **Cant del Miracle** | 1-3-2-3-1 | **Mi – Si – Sol – Si – Mi** | `boss` (pervertit), `epileg` (triomfant), `credits` |

### 1.2 Tonalitat i mode
- **Tonalitat base: Mi menor** (el Mi–Sol–Si dels cants és l'acord de Mi menor). El món és «en menor però no trist».
- **Truc narratiu:** el mal fa servir el Cant del Miracle en **Mi menor, lent i desafinat**; l'epíleg el repeteix en **Mi major**
  (Sol♯ en lloc de Sol), ple i brillant. El jugador ho notarà sense saber per què: *el riure ha tornat*.
- Cap atonalitat ni soroll pur: la por es fa amb **silencis, harmonies buides i intervals de segona menor**, no amb brutor.

### 1.3 Paleta d'instruments (no n'afegiu de gaire diferents)
Flauta i flabiol (la flauta de canya d'en Mamet), arpa, violí de poble, violoncel, orgue d'església, veus corals (aaah/ooh, sense lletra),
bombo i tamborí, pandereta, acordió (només a la Taverna), tenora o gralla (només a la Taverna i la Cirosa, color català), campanes.
**Prohibit:** guitarres elèctriques, sintetitzadors moderns, bateries de rock, veu cantada amb paraules.

### 1.4 Tractament dels bucles (important)
- Han de **tancar-se sense salt**: l'última nota ha de portar cap al principi (acord de dominant → tònica). **Sense fade-out al final.**
- Que la cua de reverberació del final es **superposi** a l'inici (feu un «render de bucle»: copieu la cua i enganxeu-la a l'inici).
- Sense silenci ni al principi ni al final (el joc fa el bucle amb `loop: true`).
- Que no hi hagi un «clímax» tan marcat que cansi al 6è bucle: la gent estarà minuts a la mateixa zona.
- Les peces `jingle_*` **no** fan bucle: acaben amb una cua natural.

### 1.5 Volum i format
- Estèreo, 44,1 kHz. **Volum integrat ≈ −16 LUFS**, pic ≤ −1 dBTP. El joc les toca al 60% de volum; si són massa fortes no es poden compensar.
- Les peces de combat poden ser +1 LUFS més fortes que les de poble, mai més.
- Exporteu a **MP3 de 320 kbps** amb el nom exacte de la taula (minúscules, sense espais: `boss.mp3`).
- Deseu-lo a `assets/musica/` i executeu: `sh eines/comprimir_media.sh` (cal `ffmpeg`). Passa a AAC 96 kbps `.m4a` i guarda l'original a `art/musica/`.
- Recarregueu el joc **buidant la memòria cau** (Ctrl+Maj+R). A la primera càrrega el joc detecta sol els fitxers nous.

---

## 2. Les peces, una per una

> Els **prompts** són per a generadors com Suno o Udio (en anglès, perquè hi funcionen millor). Poseu «instrumental» i desactiveu la lletra.
> Si compongueu a mà, useu els camps de tempo, tonalitat i estructura.

### 2.1 `boss.m4a` — l'Ocellaire, fases 1 i 2 *(imprescindible)*
- **Quan:** de l'aparició del boss fins a vida ≤ 12. **Bucle de 2:00.**
- **Tempo:** 132 BPM, compàs 6/8 (balanceig de vals fosc) o 4/4 amb ritme en tresillos. **Mi menor.**
- **Sensació:** persecució gòtica, urgent però amb elegància; un firaire siniestre que gira un bàcul. Hi ha ocells, per tant **trinats de flauta
  piccolo i flabiol** que s'enfilen i es trenquen. Els tambors han de «tocar a guerra».
- **Estructura (64 compassos):** 8 intro rítmica (bombo sol + pizzicati) → 16 tema A (violí i violoncel en menor, el Cant del Miracle **en menor i
  lent al baix**) → 8 pont amb orgue greu → 16 tema B (les flautes fan ocells, cors «aah» en bloc) → 8 tornada al ritme del principi + dominant que
  retorna a l'inici.
- **Detall de joc:** el bombo ha de marcar un pols molt net (BUM — BUM BUM — ), perquè el joc ja en toca un per sobre en sintètic: aneu amb compte de
  no acumular. Deixeu **buits d'un compàs** cada 16 per poder sentir els avisos (el soroll de «carrega» abans dels atacs).
- **Prompt:**
  > instrumental dark fantasy boss battle, gothic chamber orchestra, 132 bpm, E minor, waltz-like triplet feel, urgent staccato strings,
  > cello ostinato, war drums, church organ pedal, piccolo flute birdsong trills, wordless male-female choir in blocks, spooky but elegant,
  > Catalan folk color, no electric guitar, no synths, seamless loop, no vocals

### 2.2 `boss_final.m4a` — fase 3: «Ara cremaràs!» *(imprescindible)*
- **Quan:** vida ≤ 12 (el terra crema). **Bucle de 1:30.** Substitueix `boss` en canviar de fase: ha de **sentir-se com la mateixa peça en
  versió desesperada**.
- **Tempo:** 152 BPM, Mi menor però amb **cadència que no es resol** (acabeu sempre en dominant). Mateix motiu del Cant del Miracle, ara
  **cridat per tot el cor i l'orgue a ple pulmó**, i el baix en octaves doblades.
- **Sensació:** tot crema. Més percussió (timbals, platets, cadena de ferro), violins en tremolo, cors cridant «ha!». Un moment de **silenci tallat
  d'un compàs** cada 16 compassos (per a les finestres del cap).
- **Estructura (48 compassos):** 4 tremolo sol → 16 tema A més ràpid → 8 pont amb orgue → 16 tema B amb cors a tot arreu → 4 «turn-around» al principi.
- **Prompt:**
  > instrumental epic final boss battle, desperate and fiery, 152 bpm, E minor, tremolo strings, timpani and war drums, chains and anvil hits,
  > church organ full power, choir shouting "ha!" and sustained aahs, brass stabs, relentless, unresolved dominant ending for looping,
  > same melody as a dark gothic waltz but faster, no vocals with words, no guitars

### 2.3 `epileg.m4a` — «Torna el cant» *(imprescindible)*
- **Quan:** el Cant del Miracle obre la gàbia, els nens riuen, la boira es desfà, es viatja al Santuari i comença l'epíleg amb l'orgue. **Bucle de 2:30.**
  Continua sense talls entre la Sala de la Gàbia i el Santuari (el joc no el reinicia).
- **Tempo:** 84 BPM, 4/4, **Mi major** (és el Cant del Miracle **resolt**: Mi – Si – Sol♯ – Si – Mi).
- **Sensació:** alleujament, calidesa, riures de nens, un poble que canta. Comença **molt suau** (arpa sola, una sola flauta, algun riure de fons
  sintetitzat que sigui ben petit) i va creixent fins a un cor de poble i l'orgue a ple.
- **Estructura (80 compassos):** 8 arpa i flauta soles → 16 entrada d'una veu coral «hmm» + violoncel → 16 tema complet amb orgue
  (el Cant del Miracle en major) → 16 cor de poble (aah, a l'unísson i en tercera) → 16 baixada tranquil·la amb campanes → 8 retorn a l'arpa (bucle).
- **Detall de joc:** hi ha una escena on **un tub de l'orgue fa una nota de pega**: això el joc ho fa amb un so propi; per tant l'orgue de la música
  ha de sonar **ben net i bonic**, sense cap «pet» fora de lloc.
- **Prompt:**
  > instrumental warm hopeful ending theme, gentle chamber folk, 84 bpm, E major, solo harp and flute, cello, growing into village choir
  > singing "aah" and a church organ, bells, joyful and tender, children's laughter feeling, relief after darkness, not cheesy,
  > Catalan village feel, seamless loop, no vocals with lyrics

### 2.4 `credits.m4a` — crèdits *(imprescindible)*
- **Bucle de 2:30**, el mateix món que `epileg` però **més ampli i nostàlgic**, com un «adéu» a un viatge.
- **Tempo:** 72 BPM, **Mi major** amb un pas a Do♯ menor a la part central. Reprèn els **tres cants en ordre** (Aurora → Pedres → Miracle),
  com un repàs del joc: un cant cada 24 compassos, cadascun orquestrat de la manera que el jugador va sentir (flauta sola, orgue i pedres, cor).
- **Final:** ha de tancar el bucle amb la melodia de l'Aurora (la de l'inici del joc), perquè en tornar a començar sigui com tornar al principi.
- **Prompt:**
  > instrumental nostalgic ending credits theme, 72 bpm, E major to C sharp minor, solo flute reprising three simple melodies,
  > harp arpeggios, string ensemble swelling, soft organ pad, bells, bittersweet and thankful, cinematic but intimate, seamless loop, no vocals

### 2.5 `gabia.m4a` — la Sala de la Gàbia *(imprescindible)*
- **Quan:** tota la sala (abans del combat, i després quan s'obre la gàbia, fins que arrenca `epileg`). **Bucle de 2:00.**
- **Tempo:** 56 BPM, lliure, **Mi menor**. Gairebé sense ritme.
- **Sensació:** cova gegant sobre un avenc; una gàbia enorme que respira; ocells de boira que volen. **Vol i espai**: reverb llarga, pad d'orgue molt
  greu, **cants d'ocells reals filtrats** i desafinats, de tant en tant la flauta fa **el Cant de les Pedres** com si fos un eco llunyà.
  Hi ha **tres pulsacions lentes** (com tres cors petits adormits) que canvien de to.
- **Estructura:** 4 seccions de 32 compassos que fan lleu «respiració» sense arribar a cap clímax. Que no sigui plana: una ona lenta de 16 en 16.
- **Prompt:**
  > instrumental dark ambient fantasy cavern, very slow 56 bpm, E minor, deep church organ drone, distant filtered birdsong, detuned bells,
  > sparse haunting flute echoing a simple melody, reverb tails, sense of vast space and a giant cage breathing, ominous but fragile, no drums, no vocals, seamless loop

### 2.6 `jingle_boss.m4a` — l'Ocellaire cau *(imprescindible)*
- **8 segons, no fa bucle.** Es toca quan el boss s'esvaeix. Comença amb un **cop sec** (timbal i una cadena que cau), un **silenci d'un
  segon**, i una **resolució lenta cap a Mi major**, com un fil de llum. Acaba amb la cua natural d'una campana. Cap melodia trepidant: és alleujament cansat.
- **Prompt:** `short 8 second orchestral sting, boss defeated, heavy timpani hit with chain, one second silence, slow resolve from E minor to E major with harp and soft choir, single bell tail, no loop`

### 2.7 `jingle_runna.m4a` — Runna es desperta *(imprescindible)*
- **22 segons, no fa bucle.** Acompanya la cinemàtica del Dolmen (l'Ineu crida la frase, el cel s'enfosqueix, raigs de llum, l'espasa s'arrenca).
  Estructura que **ha d'encaixar amb la imatge**:
  | Temps | Què passa a pantalla | Què ha de sonar |
  |---|---|---|
  | 0–5 s | el cel s'enfosqueix, el vent | drone greu d'orgue + un tremolo molt fi; pols de timbal |
  | 5–10 s | les dues frases «La foscor tem la llum... però més encara EL RIURE!» | augment lent: violoncels i **Cant de les Pedres a la flauta** |
  | 10–15 s | l'espasa s'arrenca amb pols | **un cop de timbal i acord de Mi menor fort**, crit coral |
  | 15–22 s | l'espasa baixa a la mà, flaix blanc, rètol RUNNA | **resolució lluminosa a Mi major**, arpa ascendent, campanes i cor. Cua llarga |
- **Prompt:**
  > 22 second cinematic fantasy awakening sting, building from dark organ drone and tremolo, solo flute playing a simple 4-note stone song,
  > massive timpani hit and choir shout at 12 seconds, then luminous resolution to E major with harp glissando, bells and choir, long reverb tail, no loop

### 2.8 `celles.m4a` — Les Cel·les *(la fas tu)*
Perquè encaixi amb la resta, tingues en compte: és el **lloc de descans amb famílies**; la boira ja ha entrat però la gent encara parla. Suggeriment:
**Mi menor → Sol major** (to «de poble que fa el que pot»), 92 BPM, guitarra acústica/arpa + flabiol, una veu tarareada, pandereta suau.
Ha d'estar **per sota en energia** de la peça de la plaça (és una zona de passeig, molt llarga, amb moltes converses de pistes). Pots amagar-hi un
fragment del Cant de l'Aurora a la flauta. Si és una peça diferent de la resta, ni problema: només cal que sigui un bucle net.

### 2.9 `taverna.m4a` — la Taverna per dins *(recomanada)*
- **1:45, bucle. 112 BPM, 2/4 o 6/8. La menor** (un to per sota del món base: és un lloc «de la gent»).
- **Instruments:** acordió (l'Eva en té un), violí de poble, **tenora**, bombo i tamborí, claps. Alegre però **una mica forçada**: la Carmen dorm,
  hi ha un nen desaparegut. Han de sentir-se les **veus llunyanes d'una taverna** (murmuri), molt baixet.
- **Prompt:** `instrumental Catalan tavern folk waltz, accordion lead, village fiddle, tenora reed melody, tambourine and bass drum, 112 bpm, A minor, cozy but slightly uneasy, seamless loop, no vocals`

### 2.10 `cirosa.m4a` — els pastors de la Cirosa *(recomanada)*
- **2:00, bucle. 76 BPM, 3/4 o 6/8, Re menor → Fa major.** Música de pastors desterrats: una sola **flabiol** o flauta de pastor i **pandereta**,
  un bordó de gaita o de sac de gemecs, cants de pastor, cap cosa elegant. Als pastors se'ls anima amb la flauta, així que té un punt de **balada**
  que invita a respondre-hi. Que inclogui **campanes d'esquelles** (dues notes).
- **Prompt:** `instrumental shepherd folk ballad, solo flabiol wooden flute and frame drum, bagpipe drone, sheep bell chimes, 76 bpm, D minor to F major, windy and lonely, tender, seamless loop`

### 2.11 `biblioteca.m4a` — la Biblioteca del Monestir *(recomanada)*
- **2:00, bucle. 60 BPM, 4/4, Mi menor (modal, dòric).** Silenci amb cant gregorià **sense paraules** (monjos tararejant), un clavicordi o clavecí,
  un violoncel sol. Hi apareix el **Cant de les Pedres** a l'harmònium. Que se senti la **pols dins la llum**, sense dramatisme.
- **Prompt:** `instrumental quiet monastery library, soft wordless Gregorian humming, harpsichord arpeggios, solo cello, 60 bpm, E dorian, dust in sunlight, calm, no drums, seamless loop`

### 2.12 `hostatgeria.m4a` — les sacerdotesses *(recomanada)*
- **1:45, bucle. 70 BPM, 4/4, Sol major.** Calma i **una mica càlida i còmica** (són tres sacerdotesses: la Pains, la Charm i la Phili). Arpa i flauta, un
  harmònium, campaneta de mà, pizzicato lleuger. Més lluminosa que `biblioteca`.
- **Prompt:** `instrumental cozy convent music, harp and flute, harmonium, small hand bell, light pizzicato strings, 70 bpm, G major, warm and slightly humorous, seamless loop, no vocals`

### 2.13 `girgoles.m4a` — la Sala de les Gírgoles *(recomanada)*
- **2:00, bucle. 50 BPM, lliure, sense tonalitat clara (Mi frigi).** Una cova humida i fosforescent: **gotes**, **espores que suren**, un so de **gírgoles
  que «canten»** (cada mata que s'encén fa una nota: el joc ja toca notes; deixeu **espais** perquè no es pisin). Marimba, vibràfon i pads
  verds de sintetitzador suau (és l'única peça que admet pad sintètic). Rarament una resta de flauta.
- **Prompt:** `instrumental eerie bioluminescent cave ambience, dripping water, soft marimba and vibraphone, glassy pads, slow 50 bpm, E phrygian, sparse, mysterious and calm, no drums, no vocals, seamless loop`

### 2.14 `jingle_objecte.m4a` — l'Ineu alça una arma nova *(recomanada)*
- **4 segons, no fa bucle.** Sona, sempre la mateixa, quan l'Ineu rep el bastó de pelegrí (Germà Andreu) i quan agafa la branca del Gran Til·ler:
  l'Ineu l'alça mirant amunt amb un esclat de llum. La música de fons s'abaixa mentre dura.
- Petita i lluminosa, de la família de `jingle_runna` però humil (no és l'espasa): **arpegi ascendent de Mi major** a l'arpa o la flauta,
  que s'obre en un acord sostingut amb una campaneta. Cap percussió forta.
- **Prompt:** `short 4 second fantasy item fanfare, acoustic chamber, ascending E major arpeggio on harp and wooden flute, opens into a warm sustained chord, small bell shimmer, gentle and humble, no drums, no loop`

---

## 3. Llista de comprovació abans de lliurar cada peça
- [ ] Nom de fitxer exacte (taula del punt 0), en minúscules.
- [ ] Bucle sense clic ni silenci (escolteu-lo 3 vegades seguides).
- [ ] Sense veu amb paraules; sense guitarres elèctriques ni sintetitzadors moderns (excepte `girgoles`).
- [ ] Mi menor/major o la tonalitat indicada; hi surt el motiu que toca (punt 1.1).
- [ ] Volum ≈ −16 LUFS, pic ≤ −1 dB.
- [ ] Les peces de combat tenen els buits d'un compàs que es demanen.
- [ ] `sh eines/comprimir_media.sh` executat i el `.m4a` és a `assets/musica/`.
- [ ] Provat al joc: en entrar a la zona sona la cançó nova (si sona la de reserva, el fitxer té un nom incorrecte o falta buidar la memòria cau).

## 4. Com es comporta el joc amb cada peça (perquè ho sapigueu)
- El joc **detecta** al carregar quins fitxers existeixen (una petició `HEAD` per fitxer). Si en falta un, usa la reserva de la taula.
- `boss` arrenca quan surt l'Ocellaire; en entrar a la fase 3 canvia a `boss_final`; en caure, la música s'atura i sona `jingle_boss`.
- En obrir la gàbia (Cant del Miracle) arrenca `epileg` i **no es reinicia** en canviar al Santuari: és una sola peça contínua.
- `credits` sona a la pantalla de crèdits; en tornar al joc, cada zona torna a la seva música.
- `jingle_runna` sona un cop a l'inici de la cinemàtica del Dolmen, per sobre de la música de zona.
- `jingle_objecte` sona quan l'Ineu alça el bastó o la branca; la música de zona baixa de volum uns segons i després torna.
