# Música del joc

Cada cançó és **opcional**: quan el fitxer existeix a `assets/musica/`, sona; mentre no hi és, sona la de reserva. No cal tocar codi. Els originals (MP3 de Suno) són a `art/musica/cru/`.

## On sona cada peça

Fetes (✔): totes menys `celles` (el prompt és al final).

| Fitxer | On sona | Tipus | Reserva mentrestant | Prioritat |
|---|---|---|---|---|
| ✔ `boss` | Combat contra l'Ocellaire, fases 1 i 2 | bucle | masmorra | **Imprescindible** |
| ✔ `boss_final` | Combat, fase 3 (el terra crema) | bucle | `boss` | **Imprescindible** |
| ✔ `gabia` | Sala de la Gàbia, abans i després del combat | bucle | masmorra | **Imprescindible** |
| ✔ `epileg` | Alliberament dels nens i epíleg al Santuari | bucle | tema de la plaça | **Imprescindible** |
| ✔ `credits` | Crèdits | bucle | `epileg` | **Imprescindible** |
| ✔ `jingle_boss` | Quan cau l'Ocellaire | peça única | silenci | **Imprescindible** |
| ✔ `jingle_runna` | Quan Runna es desperta al Dolmen | peça única | silenci | **Imprescindible** |
| ✔ `poble` | Exteriors del poble (Plaça, Monestir, Runes, Celler, Era, Jardí, Cementiri, Sant Antoni...) | bucle | el tema del títol | **Molt recomanada** |
| ✔ `santuari` | El Santuari per dins | bucle | interiors | Recomanada |
| ✔ `taverna` | La Taverna per dins | bucle | interiors | Recomanada |
| ✔ `cirosa` | Camí de la Cirosa, pastura i Mas | bucle | bosc | Recomanada |
| ✔ `biblioteca` | Biblioteca del Monestir | bucle | interiors | Recomanada |
| ✔ `hostatgeria` | Hostatgeria i les tres cambres | bucle | interiors | Recomanada |
| ✔ `girgoles` | Sala de les Gírgoles | bucle | masmorra | Recomanada |
| ✔ `jingle_arma` | Quan l'Ineu alça una arma nova (el bastó, la branca del Til·ler) | peça única | `jingle_objecte` | **Recomanada** |
| `jingle_objecte` (no es fa servir: els objectes sonen amb `jingle_arma`) | Quan l'Ineu alça el bastó o la branca | peça única | fanfara sintetitzada | Recomanada |
| `celles` | Les Cel·les (Sant Benet, Nostra Senyora, Sant Antoni), exterior | bucle | el tema del poble | Recomanada |

`celles` encara no hi és (mentrestant sona `poble`); la resta de peces que ja hi ha: *The Hero's Ascension* (títol i, fins que hi hagi `poble`, el poble), *Woodland Path* (boscos, la Caseta i els Dipòsits), *Inside All* (interiors i, fins que hi hagi `santuari`, el Santuari), *Deep Dungeon Stillness* (masmorres) i *light book* (pròleg). El Celler (la sala del ping-pong) fa servir `taverna`.

## El leitmotiv (la fanfàrria d'`intro_runna`)

Do Mi Mi Mi Fa Sol Do · Do Re Mi Fa Fa Mi Re Do Re (notes i ritme a `art/musica/motiu/`; `Sfx.FANFARRA` a `js/sfx.js`). A més de sonar a les cançons, el joc el toca en moments curts:
- **Quan l'Ineu cau** i el Pare Jordà el recull: el principi, lent i suau, amb flauta.
- **El cofre de joguines de la Caseta**: una capsa de música hi toca el principi abans de treure'n la Maneta.
- **L'orgue de l'epíleg**: després del Cant del Miracle, la fanfàrria sencera amb els acords de l'original.
- **La Pianista, després del final**: si hi parles, la toca a l'orgue.

La música de fons s'abaixa mentre sona (`Joc.leitmotiv`).

## Què fa el joc amb cada peça

- Al carregar detecta quins fitxers existeixen; si en falta un, fa servir la reserva de la taula.
- `boss` arrenca quan surt l'Ocellaire; a la fase 3 canvia a `boss_final`; en caure, la música s'atura i sona `jingle_boss`.
- En obrir la gàbia arrenca `epileg` i **no es reinicia** en canviar al Santuari: és una sola peça contínua.
- `credits` sona a la pantalla de crèdits; en tornar al joc, cada zona torna a la seva música.
- `jingle_runna` sona un cop a l'inici de la cinemàtica del Dolmen, per sobre de la música de zona.
- `jingle_arma` sona quan l'Ineu alça una arma nova o surt un objecte d'un cofre (`jingle_objecte` és la reserva); la música de zona baixa de volum uns segons.
- Les cançons de fons van en streaming (no es descodifiquen senceres: al mòbil, quatre cançons descodificades eren ~280 MB). Per això el `.m4a` ha de tenir l'índex al principi; `eines/comprimir_media.sh` ja ho fa.
- Els combats ja porten un tambor sintètic (`Sfx.tambor`) per sobre; el bombo de `boss` convé que sigui net perquè no s'acumulin.

## Prompt pendent: `celles`

**`celles`** (bucle, ~2 min): les cel·les de descans del Santuari, unes cases plenes de vida: veïns que van i vénen, la Meus amb l'escudella al foc, les Venerables Sàvies xerrant, criatures corrent. Alegre i enjogassada, amb mig compàs de passeig; només una petita ombra de la boira al fons. **Sense adjunt** (color propi del lloc).
> instrumental lively village homestead theme, cheerful Catalan folk, mid-tempo around 110 bpm, G major, bright wooden flute and violin trading a playful melody, plucked harp and pizzicato strings, light frame drum and tambourine, a little accordion, small bells, bustling and warm like neighbours chatting and children playing, upbeat with a tiny hint of mystery, seamless loop, no lyrics
