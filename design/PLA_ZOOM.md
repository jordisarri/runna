# Pla de zoom i càmera: ritme del joc i localitzacions

Estat: **fases 0–3 implementades** (revisió 2026-11-11), pendent de prova en joc. Decisions: interiors acollidors (1,3), camins llargs **sense canvi** (1,2), pla de situació només a zones clau, sense opció de càmera reduïda. Fases 4–5 (moments: objecte clau, descobriments, zoom punch; passada per actes) pendents.
Implementat a `js/zona_base.js`: `ZOOM_ZONES`, `ZONES_CLAU`, `entradaZoom()`, `zoomCombat` només amb mini-boss o grups ≥3, cap de conversa a 1,8; `zoomConversa` a Isílder, sacerdotesses, Meus i Pare Jordà.

## 1. Com està ara

- **Un sol zoom base per a tot el joc**: `ZOOM_CAMERA` = 1,2 (es pot canviar amb `?zoom=`, 1–1,6). `zoomZona` existeix a `ZonaBase.crear()` però **cap zona no l'ha definit mai**: places, interiors, camins i la Gàbia es veuen amb la mateixa mida.
- **Tres sistemes que mouen el zoom, independents entre ells**:
  1. `zoomCombat` (`zona_base.js`): ×1,12 mentre hi ha un enemic a prop (ara amb histèresi, abans oscil·lava).
  2. `camaraDialeg`: ×1,12 (`ZOOM_NPC`) en parlar amb un personatge; la Joaneta és la única amb ×1,6 (`zoomConversa`). També s'allunya (fins a 0,6) si l'Ineu i l'interlocutor no caben entre el HUD i la caixa de text.
  3. `enquadrar()`: plans de cinema puntuals — Pastor de Boira 1,45; Mandu 2,6; Dolmen fins a 2,4; Gàbia/Ocellaire 1,05–1,08; Pi dels Tres Cants 0,9; entrada al santuari 0,67.
- Resultat: el zoom només "parla" en els moments gran i en alguna conversa; **el ritme normal (explorar, entrar a un interior, parlar, descobrir) és pla**.
- Pantalla: 720 px d'ample i alçada variable (mòbil vertical). Amb 1,2 la vista fa 600 × ~1000 px de món. Els **interiors (640–1000 × 520–900)** són més petits que la vista i queden centrats amb marges buits.

## 2. Principis

1. **El zoom és emoció**: més a prop = intimitat, tensió, claustrofòbia; més lluny = revelació, escala, calma.
2. **Tipus de lloc → zoom base** (interior petit > interior gran > exterior > camí llarg > panoràmica). Es multiplica per la preferència de l'usuari (`ZOOM_CAMERA`), no la substitueix.
3. **Tot canvi és suau** (700–1000 ms, `Sine.easeInOut`) i mai dos efectes automàtics es poden contradir.
4. **Els moments importants es reserven**: si tot té zoom, res no destaca. Màxim un "gran gest" de càmera per escena.
5. **La lectura mana**: HUD, caixa de diàleg i símbol d'interacció sempre visibles; per sobre d'1,6 es vigila la nitidesa dels gràfics al mòbil.

## 3. Arquitectura: un sol "objectiu de zoom"

Ara cada sistema fa el seu `setZoom`. Proposta: una funció `zoomObjectiu()` a `ZonaBase` que calculi el zoom final com a producte de capes i un únic tween que hi tendeixi:

```
zoom = ZOOM_CAMERA × base_zona × (combat?) × (conversa?)      // el cinema (enquadrar) ho substitueix tot
```

- `base_zona`: nou camp `zoom` a la config de cada zona (o per tipus d'espai). Substitueix l'ús mort de `zoomZona`.
- Prioritat: cinema > diàleg > combat > base. Quan un acaba, torna al següent, sense salts.
- Així l'oscil·lació d'abans (combat vs. enemic al límit) no pot tornar a passar per una altra via.
- També decideix `setBounds` (marges centrats als interiors, ara calculats només amb el zoom de l'entrada).

## 4. Zoom base per tipus de lloc (factor sobre `ZOOM_CAMERA`)

| Tipus | Zones | Factor | Per què |
|---|---|---|---|
| **Interiors petits** | Dins la caseta (640×520), Cambra secreta, Taller del Galf, Dins la cabana, Cabana amagada, Mas de la Cirosa, Sala del Rellotge, Cripta | **1,25–1,30** | Es veu l'habitació sencera i acollidora; menys marges buits |
| **Interiors mitjans** | Taverna int., Hostatgeria int., Biblioteca, Rebedor, Casa Gran escalinata, Ermita int., Dormitori/Refetor/Capella | **1,10–1,15** | Cal veure el mobiliari i els personatges |
| **Exteriors de poble** | Plaça, Era, Jardí, Taverna, Casa Gran, Bassadòria, Celler fora | **1,00** (referència) | És el to normal |
| **Camins llargs** | Camí de la Desaparició (2800), Camí Rovellonera (2800), Camí Cirosa (alçada 2200) | **0,90–0,95** | Sentit de viatge; es veu què ve |
| **Llocs de revelació** | Gran Til·ler, Dolmen, Cirosa (Pastor), Cementiri, Runes | **0,95** + entrada lenta | Escala i solemnitat; vegeu §5 |
| **Pas tens** (Acte 3) | Galeria, Gírgoles, Passadís de tortura, Passadís secret | **1,15 → 1,25** | Pressió; cada sala una mica més a prop |
| **Sala del boss** | Gàbia | **0,95** (el cinema existent ho porta) | Es veu l'arena sencera |

> Pendent de decidir amb una prova al mòbil: el rang real depèn de la mida de la pantalla (l'alçada varia). Per això es proposen factors i no zooms absoluts.

## 4b. Interiors: el que més guanya

Ara l'Ineu es mou en una habitació petita amb marges foscos. Amb el factor de la taula:
- l'habitació omple la pantalla i l'Ineu es veu més gran i expressiu (i els seus ulls/cara, que ara són petits);
- entrar a un interior fa un **push-in** (zoom 1,0 → factor en ~900 ms) i sortir-ne un **pull-out** al nou exterior: transició sensible sense necessitat de pantalla negra més llarga;
- zones amb molt petit món (caseta 640×520, Tresor 640×760) poden anar a 1,35 i prou.

## 5. Moments (ritme)

| Moment | Gest | Quan | Notes |
|---|---|---|---|
| **Primera entrada a una zona nova** | Plano de situació: comença a base×0,9 i s'acosta fins a base en ~1,2 s | Només la 1a visita (flag per zona) | Dóna "bon dia" al lloc sense repetir-se |
| **Conversa casual** | ×1,08–1,12 (com ara) | Parlar amb NPC de passada | Mantenir |
| **Conversa important/íntima** | ×1,3–1,6 | Joaneta (ja), Isílder, Sacerdotesses, Nena de les Trenes, Meus/Molner a l'epíleg, Pare Jordà el primer cop | `zoomConversa` per NPC; cal comprovar que els dos caben |
| **Diàleg llarg** | Push-in lent addicional (+4 % al llarg del diàleg) | >6 pàgines | Evita "foto fixa"; opcional |
| **Examinar objecte** (cartell, placa, pergamí) | Acostament a l'objecte | Ja a `nord.js`; estendre als pergamins de Runes/Santuari | |
| **Obtenir objecte clau / gra de rosari** | Micro push-in (×1,06, 500 ms) + sostenir mentre surt l'avís | Gra, Runna, Llanterna, Medalló | Reforça el premi sense text; no s'ha de repetir en cofres menors |
| **Descobriment** (pedra secreta, llosa, porta de ferro, passadís, Sala del tresor) | **Pull-out** revelador (base×0,85) seguit de retorn | En obrir el passatge | Contrari a l'acostament: "hi ha més del que veies" |
| **Combat menor** | **Treure** el ×1,12 per a escolopendres i bestioles soles; només a grups de ≥3 o mini-boss | Revisar `ZOOM_COMBAT` | El zoom canviant en cada bestiola cansa, sobretot amb passejos |
| **Final de combat/boss** | Zoom punch ×1,15 en 250 ms + torna | Últim cop | Efecte "impacte" (combinat amb hit-stop si n'hi ha) |
| **Caure/ensopegar** | Cap | | No marejar |
| **Atac de l'Ineu** | Cap | | La càmera fixa ajuda a llegir el cop |

## 6. Ritme per actes

| Part | Sentiment | Zoom |
|---|---|---|
| Pròleg (quadres) | Conte | Fora del joc (no afecta) |
| **Acte 1 — El misteri** | Descoberta, poble acollidor | Interiors a 1,25 (taverna, caseta, hostatgeria): intimitat; plaça/exteriors a 1,0; entrada de zona per presentar el lloc |
| **Acte 2 — La recerca** | Viatge, obertura | Camins a 0,9–0,95; Til·ler i Dolmen amb entrada lenta; sopar del Til·ler en primer pla; Dolmen: el cinema existent (fins a 2,4) és el gran clímax |
| **Acte 3 — La Gàbia** | Tensió creixent | Casa Gran → Passadís secret → Cripta → Galeria → Gírgoles → Tortura: cada pas una mica més a prop; Gàbia: pull-out a 0,95 per mostrar l'arena |
| **Combat final** | Clímax | Cinema ja fet (1,05); afegir punch al final |
| **Epíleg — Torna el cant** | Alleujament | Pull-out lent al Santuari amb tothom; el riure dels nens, primer pla curt |

## 7. Pla de treball per fases

1. **Fase 0 (una tarda)**: unificar `zoomObjectiu()` (§3), sense canviar cap valor. Comprovar que el joc es comporta com ara.
2. **Fase 1**: `zoom` per zona segons la taula §4 (només interiors i camins primer). Prova a mòbil i escriptori; ajustar xifres.
3. **Fase 2**: entrada de zona (plano de situació) amb flag a `Estat`; push-in/pull-out als interiors.
4. **Fase 3**: converses (`zoomConversa` per NPC) i `ZOOM_COMBAT` només per grups/mini-bosses.
5. **Fase 4**: moments (obtenir objecte, descobriments, zoom punch).
6. **Fase 5**: passada de ritme per actes (§6) i opció d'accessibilitat «Moviment de càmera: complet / reduït / res» al menú de pausa.

## 8. Riscos i QA

- **Nitidesa**: per sobre de 1,6 els sprites es veuen més pixelats al mòbil; mantenir el límit o provar.
- **`ajustarSuperposicions`**: boira, vels i siluetes depenen del zoom (`ZOOM_CAMERA / cam.zoom`); cada gest nou s'ha de provar amb la boira activa.
- **Bounds**: els interiors es centren amb el zoom de l'entrada; cal recalcular-los si el zoom base canvia durant la zona.
- **Diàleg/caixa**: `camaraDialeg` comprova que els dos personatges caben; amb un zoom base més alt cal revisar que `be()` no allunyi més del compte.
- **Cinemes existents**: no toquem els que ja estan (Dolmen, Pastor, Gàbia, Pi) sinó que només hi hem d'enllaçar el retorn al zoom base nou.
- **Checklist de prova** per cada zona: entrar, sortir, parlar amb tots, obrir portes/cofres, combat, desar/carregar, mòbil vertical i escriptori.

## 9. Decisions pendents

1. Quant ha de canviar l'aspecte dels interiors? (1,15 prudent / 1,3 acollidor).
2. Els camins llargs poden anar a 0,9 o es perd massa detall de l'Ineu?
3. El "plano de situació" a cada primera visita, o només a zones clau?
4. Vols l'opció «Moviment de càmera reduït» al menú?
