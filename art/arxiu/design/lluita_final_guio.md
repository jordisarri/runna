# La Sala de la Gàbia — guió i muntatge de la lluita final

Estat: PROPOSTA per aprovar (no toca codi). Font: `js/zones/gabia.js` (`iniciarCombatFinal` l.1038, `invocarOcellaire` l.1148, `començarBoss` l.1166, `ocellaireDerrotat` l.1193, `obrirGabia` l.1265, `capollTrencat` l.1308, `finalGabia` l.1325, `furiaOcellaire` l.849, `DIALEGS.aldreuGabia` l.77) i `js/combat.js` (`ocellaire` l.399). Si s'aprova, els canvis d'història (l'Aldreu trist→somrient, el «No et deixo» del Mestre) s'han de passar abans a `docs/GUIO.md` (Acte 3 punts 5-7 i Epíleg).

## 0. Convencions i regles de muntatge

- **Coordenades:** `(gx+dx, base+dy)`; `gx`=centre de la gàbia, `base`=terra sota la gàbia (gàbia 300x420: barrots de `base-420` a `base`). Entrada de l'Ineu: `ineu.y ≈ base+340`. Ocellaire apareix a `(gx, base+90)`. Aldreu de guàrdia: `(gx+230, base+60)`. Capolls: `y = base-150/-180`, `dx` de `NENS_GABIA`.
- **Pantalla:** `AMPLE=720`. Amplada visible = `720/zoom`: zoom 0.9 → 800 px (tota la sala), 1.5 → 480, 2.2 → 327 px (només una cara + espatlles).
- **`z.enquadrar(x,y,zoom,ms,fet,reserva)`** centra el punt a la zona lliure per sobre del quadre de diàleg (`reserva` per defecte 470). Mentre parla algú: `reserva` 470 (cara ben alta). Plans sense diàleg (pla general, rugits, caiguda): `reserva` 0. Tall sec (cut) = `ms` 1; moviment lent = 1100-2400; «whip»/cop de càmera = 300-450.
- **Sense barres negres:** cap `rectangle` negre. El «cinema» es fa només amb zoom, desplaçament i `cam.flash/shake`. El `fadeOut` final només al final de `finalGabia`.
- **Gaires plans per línia:** un `{fer: (z,fet)=>z.enquadrar(..., fet)}` entre dues pàgines de diàleg fa el pla/contrapla (camp-contracamp). Regla: no més de 2 línies seguides amb el mateix pla.
- **Mida (petició 1):** l'Ocellaire i el Pastor es veuen més grans per DOS camins: (a) **zoom** en tots els plans parlats (1.4-2.2), sense gràfic nou; (b) **escala del sprite**:
  - Ocellaire: `E = textures.get('ocellaire').customData.escala`. Aparició i combat a `E*1.4`. En cinemàtica, `ap.setScale(E*1.4)`; en combat, `e.spr.setScale(E*1.4)` just després de `this.enemic('ocellaire',...)` a `començarBoss`.
  - A canviar quan s'escala x1.4: `radi` 38→52, `cos` [58,26]→[80,36], `cap.r` 40→56 i `capTex.ocellaire_genolls.r` 42→59 (`combat.js` l.400-402), distància de «sura» 240→300 (l.443), `basto_ocellaire` (184 px d'ample) x1.4, `posarUlls`/`ulls.scale` x1.4, `avisAnell` radi 190/230→ es manté (és àrea de joc). Ombra `ombra: 0.8`→1.1. Cal repassar que el cap segueixi dins de pantalla a l'extrem superior de la plataforma.
  - Zoom de combat: posar `this.zoomZona = 0.92` a `començarBoss` (i restaurar el valor original a `ocellaireDerrotat` abans de `alliberarCamera`) perquè el boss més gran càpiga a pantalla. Verificar-ho jugant.
  - Pastor de Boira (`aldreu_guardia`, 85 d'ample): `ald.setScale(ald.scale*1.5)` en el pla de la transformació. Quan la boira el deixa, `desferPastor` el recrea a mida normal: **l'Aldreu s'encongeix** davant el Mestre caigut (és intencionat: torna a ser un home petit).
- **So:** només efectes existents: `Sfx.puf/carrega/rugit/xiscle/basto/talla/secret/porta/riure` i `Joc.aturarMusica/iniciarMusica/jingle`. La música: la de la cova s'abaixa a l'entrada (silenci quasi total) i `musica_boss` entra al P16 amb els tambors.

---

## (a) LLISTA DE PLANS

### A. Entrada i presentació (primera vegada; si `ocellaireVist`, vegeu A-curta)

| # | Pla | Objectiu càmera | Zoom | Moviment | Què es veu | So |
|---|---|---|---|---|---|---|
| P01 | PLA GENERAL de la sala (establishing) | `(gx, base+80)` | 0.90 | tall inicial `ms:1`, després deriva lenta a `(gx, base+40)` en 2200 ms | Plataforma, gàbia amb els 3 capolls lila a dalt, l'Ineu petit a baix que ha trepitjat l'entrada; l'Ineu es para (`ineuVa(ineu.x, base+340, null, 150)`) | `Joc.aturarMusica()`; ambient de cova, `Sfx.carrega` molt baix un cop |
| P02 | PLA MITJÀ l'Ineu (reacció) | `(ineu.x, ineu.y-70)` | 1.55 | `ms:900`, ease suau | L'Ineu de cara a la gàbia, mirada amunt (`posarDireccio('amunt', false)`) | silenci |
| P03 | PLA DETALL dels capolls (pan) | `(gx-160, base-170)` → `(gx+160, base-170)` | 1.60 | dos enquadrar encadenats: 1100 ms cada un (pan d'esquerra a dreta) | Els tres capolls que pugen i baixen, l'espurna lila | `Sfx.riure` molt fluix (riure robat, 1 sol cop al P03b) |
| P04 | APARICIÓ DE L'ALDREU (whip) | `(gx+230, base-10)` | 1.55 | `ms:350`, rapidíssim | Bafarada de `boiraPuf` i l'Aldreu apareix gran (x1.5), `aldreu_guardia` no: encara el sprite normal `germa_aldreu` | `Sfx.puf`, `cam.shake(180,0.004)` |
| P05 | CONTRAPLA l'Ineu | `(ineu.x, ineu.y-70)` | 1.50 | `ms:1` (tall) | L'Ineu respon | — |
| P06 | PRIMER PLA de l'Aldreu enfadat | `(ald.x, ald.y - 0.8*ald.displayHeight)` | 2.00 | `ms:500` (push-in) | Canvia a `pastor_enfadat`; cara, ulleres | `Sfx.xiscle` curt a «Tard, massa tard!» |
| P07 | CONTRAPICAT: la cúpula | `(gx, base-gh-40)` (≈`base-460`) | 1.15 | pujada (tilt-up) `ms:1200`, ease `Sine.easeIn` | L'Aldreu ha cridat; la càmera puja per la gàbia i la cúpula; la boira lila s'arremolina al sostre (`invocarOcellaire`: partícules ja existents) | `Sfx.carrega`, `cam.shake(1200,0.004)` |
| P08 | BAIXADA DEL MESTRE (seguiment) | de `(gx, base-gh-40)` a `(gx, base-30)` | 1.15 → 1.30 | `ms:2400`, ease `Sine.easeIn` (accelera) | `ap` (x1.4, alpha 1) baixa pel mig de la boira de `y=base-gh-140` a `y=base+90` en 2400 ms (tween `y`), escala de `E*1.9` a `E*1.4` (perspectiva: ve de dalt, gegantí); la túnica ocupa tot el quadre | `Sfx.carrega` creixent; al final `Sfx.puf` + `cam.flash(250,160,80,255)` |
| P09 | ATERRATGE | `(ap.x, ap.y-80)` | 1.20 | micro-rebot: `cam.shake(300,0.010)` | Aterra; pols de boira (`boiraPuf`) als peus; l'Aldreu fa un pas enrere | `Sfx.puf` |
| P10 | PRIMER PLA DELS ULLS LILA | `(ap.x, ap.y - 0.78*ap.displayHeight)` | 2.20 | push-in `ms:1100` | Només la cara i els dos ulls lila que s'encenen (`crearUlls()`, `ulls.setAlpha 0→1` en 600 ms; escala x1.3) | silenci absolut 600 ms; llavors baixa un to |
| P11 | PLA MITJÀ del Mestre (parla) | `(ap.x, ap.y-0.55*ap.displayHeight)` | 1.60 | `ms:700` | Cos fins a la cintura, el bàcul darrere | — |
| P12 | CONTRAPLA l'Ineu (petit contra el gegant) | `(ineu.x, ineu.y-70)` | 1.45 | tall (`ms:1`) | L'Ineu mirant amunt: aixeca la barbeta | — |
| P13 | PLA D'ESCALA (Mestre + Ineu junts) | `((ap.x+ineu.x)/2, (ap.y+ineu.y)/2 - 90)` | 0.95 | `ms:1000` | La proporció: el Mestre x1.4 vs l'Ineu | — |
| P14 | EL RUGIT (dolly-out + shake) | `(ap.x, ap.y-110)` | 2.2 → 1.00 | zoom-out ràpid `ms:380` en el moment del rugit (`reserva:0`) | `ocellaire_rugit`, ulls apagats (`ulls.setVisible(false)`), el rètol `titolBoss` | `Sfx.rugit`, `cam.shake(900,0.008)`, `cam.flash(180,255,255,255)` |
| P15 | REACCIÓ DE L'ALDREU FUGINT | `(ald.x, ald.y-110)` | 1.30 | seguiment curt, 600 ms | L'Aldreu corre cap a `(gx+330, base+40)` i s'esvaeix | — |
| P16 | PLA GENERAL DE COMBAT | l'Ineu (seguiment) | `zoomZona`=0.92 | `alliberarCamera(900)` | S'obre el joc | `Joc.iniciarMusica('musica_boss')`, `tambors(560)` |

**A-curta (si `ocellaireVist`, retry):** P01 (tall, 900 ms, sense deriva) → P04 → P11 → P08 comprimit (1400 ms) → P14 → P16. Sense P02, P03, P07, P10. Total ≈ 9 s.

### B. Canvis de fase (rugits) — dins el combat, pocs segons

Els canvis de fase són a `combat.js` l.419-428 (`estat='rugit'`, `e.fins = ara+2900`) i `furiaOcellaire` (gabia.js l.849). Cal que el jugador pugui moure's, però que el moment es senti. Proposta per al **pols de càmera** (opcional, 1 sol cop per fase):

| # | Pla | Objectiu | Zoom | Moviment | Què es veu | So |
|---|---|---|---|---|---|---|
| P20 | PUNCH-IN al rugit F2 | `(e.spr.x, e.spr.y - 0.55*e.spr.displayHeight)` | 1.55 | `enquadrar(...,300)`, manté 700 ms, `alliberarCamera(600)` | Ulls més vius (`ulls.scale 1.6`), la cova torna vermella (`furiaOcellaire`) | `Sfx.rugit`; `hitStop(160)` |
| P21 | PUNCH-IN F3 (més violent) | mateix | 1.80 | `enquadrar(...,240)`, manté 900 ms, `alliberarCamera(500)` | Cova encesa, foc que s'obre (el foc a terra arrenca amb el jugador ja de nou al pla general) | `Sfx.rugit`, `cam.shake(1800,0.012)` ja existent |

Risc: el jugador ha de veure's. El punch-in només es pot fer si `distància(Ineu, Ocellaire) < 520`; si no, no fer-lo (ja hi ha l'ona de `furiaOcellaire`). L'ona de xoc empeny l'Ineu: per això el pols dura ≤ 1,2 s i no bloqueja l'entrada.

**Veus durant el combat (no bloquegen):** `this.flotant(x, y, text, color)` sobre l'Ocellaire, color `'#d8c8ff'`; la veu de l'Aldreu des de fora de pantalla amb `flotant(gx+330, base-40, text, '#ffffff')`. Veure bloc (b-3) per als textos. Una frase per cada: canvi de fase, primera vegada que l'Ineu li pica el cap, primera vegada que l'Ineu cau (punt de control), i una barreja aleatòria cada 25-35 s de combat.

### C. Mort de l'Ocellaire (`ocellaireDerrotat`)

| # | Pla | Objectiu | Zoom | Moviment | Què es veu | So |
|---|---|---|---|---|---|---|
| P30 | EL COP FINAL (acostament) | `(e.spr.x, e.spr.y - 0.55*e.spr.displayHeight)` | 1.0 → 1.90 | ABANS del `hitStop(450)`: `enquadrar(...,420,null,0)` | El cap, l'impacte | `hitStop`, `cam.flash(700,255,255,255)`, `Sfx.rugit` |
| P31 | PLA DEL BÀCUL | `(b.g.x, c.y-10)` | 1.60 | `ms:500`, es manté 900 ms | El bàcul cau, rebota (Bounce 700 ms), es parteix | `Sfx.talla` al segon impacte |
| P32 | PRIMER PLA DEL MESTRE MORINT | `(e.spr.x, e.spr.y - 0.7*e.spr.displayHeight)` | 2.00 | `ms:900` (i 1100 per a la segona línia) | Cara, els ulls lila s'apaguen (`e.ulls` alpha → 0 en 2200 ms) | cap música; só de fons de cova |
| P33 | CONTRAPICAT: la boira cap a la gàbia | `(mx, base-gh*0.5)` | 1.05 | `ms:1400` panoràmica de l'Ocellaire cap a la gàbia, amb les partícules | Es desfà en boira que la gàbia «s'empassa» | `Sfx.puf` |
| P34 | EL FLAIX I LA BOIRA DESTÀ | `(mx, my)` | 1.05 | `cam.flash(300,160,80,255)` | Els ocells de boira cauen | — |
| P35 | PRIMER PLA DEL PASTOR QUE ES DESFÀ | `(a.x, a.y-0.75*a.displayHeight)` | 1.80 | `enquadrar(...,700)` | El Pastor (x1.5) es dissol (`desferPastor`: `boiraPuf`, `llum 0xb88aff`): l'Aldreu reapareix, **a mida normal, tot petit**, amb el cap cot | `Sfx.puf` |
| P36 | PLA GENERAL BUIT (silenci) | `(gx+60, base+60)` | 0.95 | `ms:1500`, 1,5 s de pura imatge | La sala, la llum lila apagant-se (`tornarColorCova`), l'Aldreu sol sota la gàbia | silenci 1 s; entra `musica_epileg` fluixa només a `obrirGabia` |

### D. Alliberament (`obrirGabia`)

| # | Pla | Objectiu | Zoom | Moviment | Què es veu | So |
|---|---|---|---|---|---|---|
| P40 | PLA DE L'INEU TOCANT | `(ineu.x, ineu.y-70)` | 1.5 | `ms:700` | La flauta, notes d'or (`flotant ♪`) | `Joc.iniciarMusica('musica_epileg')` |
| P41 | LA GÀBIA S'ENCÉN | `(gx, base-210)` | 1.05 | `ms:900`; tilt-up lent de `(gx, base-80)` a `(gx, base-380)` en 2400 ms mentre puja la gàbia | Barrots d'or, la gàbia puja fins al sostre | `Sfx.secret`, `cam.flash(500,255,230,160)`, `cam.shake(2200,0.004)` |
| P42 | PRIMER PLA DE L'ALDREU (cara a la llum) | `(a.x, a.y-0.8*a.displayHeight)` | 1.9 | tall des de P41, 900 ms | La llum daurada de la gàbia que puja li passa per la cara; no aixeca el cap | — |
| P43 | ELS CAPOLLS BAIXEN | `(gx, base+90)` | 1.10 | `ms:1200` cap avall (tilt-down) | Els tres capolls baixen amb 200 ms de retard; 1900 ms | — |
| P44 | `alliberarCamera(800)` | — | — | — | — | — |

### E. Final (`capollTrencat` ×3 + `finalGabia`)

| # | Pla | Objectiu | Zoom | Moviment | Què es veu | So |
|---|---|---|---|---|---|---|
| P50 | PLA MITJÀ de cada nen que riu | `(x, y-70)` | 1.5 | `ms:600` abans del diàleg | Cada capoll trencat: llum + nen | `Sfx.riure` |
| P51 | PLA GENERAL DELS NENS | `(gx, base+40)` | 1.0 | `ms:1000` | Els tres nens saltant | `Sfx.riure` |
| P52 | LLUM QUE ESCLARA LA COVA | `(gx, base-60)` | 1.05 | `ms:2000` lenta | Flaix daurat, la boira s'apaga, la cova s'aclareix | `cam.flash(900,255,240,200)` |
| P53 | PRIMER PLA DE L'ALDREU (Escena de l'Aldreu, passos F1-F9 a la secció c) | `(a.x, a.y-0.8*a.displayHeight)` | 1.9 | variant | Cara trista → somriure | — |
| P54 | CONTRAPLA l'Ineu | `(ineu.x, ineu.y-70)` | 1.5 | tall | L'Ineu convida l'Aldreu | — |
| P55 | PLA GENERAL: LA GÀBIA BAIXA | `(gx, base-200)` | 1.0 | `ms:900`, després tilt-down de 1600 ms seguint la gàbia | Cau lentament sobre l'Aldreu | `Sfx.porta` (suau; shake 0.006 en lloc de 0.012) |
| P56 | PRIMER PLA ENTRE BARROTS | `(gx, base-60)` | 1.95 | `ms:900` | L'Aldreu somriu darrere els barrots; la cova clara | silenci |
| P57 | PLA D'ESCALA FINAL (reculada) | `(gx, base-40)` | 1.95 → 0.90 | dolly-out lent `ms:3200` | La gàbia es fa petita, l'Aldreu continua somrient dins; els nens riuen lluny | `Sfx.riure` decreixent; `fadeOut(1800)` |

---

## (b) DIÀLEGS

Veus:
- **Germà Aldreu / Pastor de Boira:** servil i fanàtic (parla amb reverència: «Mestre», frases curtes i cridaneres, usa «monjo» com a insult). Quan cau: frases curtes, sense exclamacions, parla baix.
- **L'Home de la Gàbia / Ocellaire:** ominós i sedós. Mai no crida (només el rugit). Frases llargues, dolces, amb diminutius («petit», «fill»); la crueltat és la cortesia.
- **Ineu:** jove monjo, directe, sense ironia, una mica sorprès, mai heroic de pel·lícula.

Nom visible: `A='Aldreu, Pastor de Boira'`, `O="L'Home de la Gàbia"`, `'Ineu'`; després de la caiguda `'Germà Aldreu'`.

### b-1. Entrada, primera vegada (`!ocellaireVist`)

Pàgines marcades amb el pla [Pxx].

1. `[P01-P02 fer]` — _sense text_ (càmera i Ineu).
2. `[P02]` Ineu: «(Tres capolls de boira, penjats com fruites... L'Huri, el Fram, el Sardi. Dormen.)»
3. `[P03]` Ineu: «Aguanteu. Ja sóc aquí.»
4. `[P04]` Aldreu: «Silenci! Aquí no s'alça la veu, monjo. El Mestre dorm, i jo vetllo el seu son.»
5. `[P05]` Ineu: «Germà Aldreu... sóc jo. Baixeu el bastó, que els nens no són seus.»
6. `[P04]` Aldreu: «Meus, no. Del Mestre. Cada riure que li duc em diu «bon xicot, Aldreu». ¿Saps què vol dir que algú et digui pel nom?»
7. `[P06 fer: pastor_enfadat]` Aldreu: «Tu no ho saps! Per a tu sempre hi ha hagut algú que et mirés!»
8. `[P05]` Ineu: «Això no és mirar algú, Germà. És tancar-lo.»
9. `[P06]` Aldreu: «Tard, massa tard! Mestre! MESTRE, ja és aquí! El monjo que us vol prendre els nens!»
10. `[P07-P09 fer]` — la baixada del Mestre (silenci de text).
11. `[P10]` Home de la Gàbia: «Aldreu... fill meu... no cridis.»
12. `[P10]` Home de la Gàbia: «Ja l'he sentit entrar. Quin soroll més dolç fan, uns peus de monjo damunt la meva pedra.»
13. `[P12]` Ineu: «Deixeu els nens. Hi ha tres cases que us esperen... i una de les tres és la meva.» *(el «tres cases que us esperen» és veu de l'Ineu; alternativa més simple: «Deixeu els nens. Tornaran amb els seus.»)*
14. `[P11]` Home de la Gàbia: «Un nen que riu... Fa segles que no en sento cap.»
15. `[P11]` Home de la Gàbia: «La gàbia és plena de riures robats. Encara hi cap el teu.»
16. `[P12]` Ineu: «Runna us coneix. I jo us veig. No sou el que feu veure.»
17. `[P13]` Home de la Gàbia: «Runna... Quina espasa tan petita per a una sala tan gran.»
18. `[P15 fer]` Aldreu: «Deixeu-m'ho a mi, Mestre!» — Home de la Gàbia: «Aparta, Aldreu. Aquesta nit el Mestre mateix et mostrarà com es fa.»
19. `[P14 fer: rugit + titolBoss]` — rugit, sense text.
20. `[P15 fer]` Aldreu (fugint, sense quadre; `flotant`): «Sí, Mestre!»

### b-2. Entrada, retry (`ocellaireVist`)

1. `[P04]` Aldreu: «Una altra vegada, monjo? El Mestre no es cansa mai.»
2. `[P11]` Home de la Gàbia: «Torna a entrar, petit. Sempre torna, el riure.»
3. `[P14 fer: rugit]`
4. (després, sense quadre) Aldreu: «Mestre, aquesta vegada sí!»

### b-3. Veus durant el combat (`flotant`, no bloquegen)

Banc de textos; es tria a l'atzar dins el grup, sense repetir l'última. Dos bancs per a primer cop / retry (`ocellaireVist` abans d'iniciar).

**Canvi a FASE 2** (`P20`):
- Primera vegada: «Així que tens ullals, petit. Ara miraré de debò.»
- Primera vegada: «Fa mal, oi? Un riure fa més mal quan és teu que quan és d'un altre.»
- Retry: «Ja m'has vist això. Et va servir de molt?»
- Retry: «Cada vegada et fas una mica més meu.»
- Aldreu (fora de pantalla): «Així, Mestre! Així!»

**Canvi a FASE 3** (`P21`):
- «Prou de música! Que cremi tot!»
- «He tingut milers de riures. Tu només en tens un... però ja el sento tremolar.»
- Retry: «Encara hi ets? Que n'ets, de pesat.»
- Aldreu (fora): «Mestre, no us cansaríeu, oi?»

**Primer cop al cap (primera `cansat` colpejat):**
- «Ai!... ¿I això, qui t'ho ha ensenyat?»
- «Prou. Només el cap, sí? Quin monjo més llest.»

**Quan l'Ineu cau (punt de control; abans de `Joc.iniciarMusica`):**
- «Veus? Fins i tot a tu, la gàbia et crida.»
- «Descansa, petit... al fons hi ha un lloc per a tu.»
- Aldreu (fora): «Us ho deia, monjo. Ningú no li guanya.»

**Barreja d'esporàdics (cada 25-35 s, Ocellaire):**
- «Els meus ocells tenen gana.»
- «Rius poc, monjo. Tens la boca seca.»
- «Aquest cant... és massa bonic per a tu.»
- «Un nen que riu sap perdre. Tu no sap perdre?»

### b-4. Mort de l'Ocellaire (`ocellaireDerrotat`)

1. `[P30-P31 fer]` — cop final + bàcul (sense text).
2. `[P32]` Home de la Gàbia: «No... el meu riure... Els meus ocells...»
3. `[P32]` Home de la Gàbia: «Tants riures... i cap no era per a mi.»
4. `[P33 fer]` — es desfà en boira cap a la gàbia (sense text).
5. `[P35 fer]` — la boira deixa l'Aldreu (sense text; 1100 ms).
6. `[P35]` Home de la Gàbia (veu dins la boira, ja sense cos, `flotant` lila sobre la gàbia): «Aldreu... fill... a la gàbia sempre hi haurà lloc per a tu.»
7. `[P35]` Germà Aldreu: «Mestre! No em deixeu!»
8. `[P36 fer]` — ajupir 1200 ms (cap cot), `alliberarCamera`.

### b-5. Escena de l'Aldreu trist (després de la mort, la part que ja és en pau) — vegeu la secció (c) per als passos i el to. El text complet és allà.

### b-6. `DIALEGS.aldreuGabia` revisat (l.77)

```js
aldreuGabia: E => ({ pagines: E.flag('andreuTancat') ? [
    { qui: 'Germà Aldreu', text: "Estic bé, Ineu. La boira fa companyia quan ja no demana res." },
    { qui: 'Germà Aldreu', text: "Torna quan vulguis. Si mai se'm gira el cor, ja trobaré qui em pugui acompanyar..." }
] : E.flag('gabiaOberta') ? [
    { qui: 'Germà Aldreu', text: "Encara no, noi. Deixa'm sentir com riuen." }
] : E.flag('ocellaireVencut') ? [
    { qui: 'Germà Aldreu', text: "(No et mira.) Ja no em parla. Abans em parlava sempre." }
] : [
    { qui: 'Aldreu, Pastor de Boira', text: "El Mestre ve, monjo. Ja el sents?" }
] })
```

Nota: la 2a línia de `andreuTancat` pot quedar només amb la 1a si es vol més sobri; el to ha de ser serè, mai sinistre.

---

## (c) ESCENA FINAL DE L'ALDREU: TRIST → SOMRIENT

**Intenció:** una decisió pacífica i agredolça. No és condemna ni derrota: és algú que, vist per primer cop, tria quedar-se a vetllar el que el va veure, i ho fa somrient (el somriure amable de la Plaça). Cap element sinistre: llum càlida, sense so greu, la gàbia baixa suau.

**Sprite i estat:** Aldreu = `germa_aldreu` (somrient, normal) quan hi hagi somriure; per al to trist veure «Gràfics nous» (G1). **Sense G1**, la solució (fallback) és: tint `0xb8b8d0` (fred), `angle = -5` (inclinat endavant sobre els peus; origen als peus), `scaleY = 0.97` i una respiració lenta (`tweens.add({targets:a, scaleY:0.985, yoyo:true, repeat:-1, duration:2600})`), `flipX` cap a la gàbia (d'esquena a l'Ineu) i **mai cap pla de cara fins al somriure**: P36, P42 i P53-F1..F3 es fan a zoom 1.0-1.2, de tres quarts, amb la cara a l'ombra. Així el primer cop que se li veu bé la cara és el somriure (efecte narratiu intencionat, ho recomano encara que arribi G1).

### Passos

**F1 — Després de la caiguda (final de `ocellaireDerrotat`)**, `P35-P36`. Aldreu surt de la boira a mida normal, `ajupir('germa_aldreu', ..., 1200)`. Posar el sprite trist (o fallback). `npcVa('germa_aldreu', gx+90, base+60, f, 120)` lent (vel 120). Es queda de cara als barrots (`flipX` cap a la gàbia). L'Ineu no es mou: el jugador recupera el control.

**F2 — Si el jugador hi parla abans d'obrir la gàbia** (`aldreuGabia` per a `ocellaireVencut && !gabiaOberta`), 3 respostes rotatives (`sensePunts()` fals ja):
1. «(No et mira.) Ja no em parla. Abans em parlava sempre.»
2. «Fes el que has de fer, noi. Avui no et miraré.»
3. «Quan era a la Plaça, tothom em passava pel costat. Ell em va veure.»

**F3 — `obrirGabia` (P40-P44).** En P42, primer pla de l'Aldreu a l'ombra (cara de tres quarts, sense mirar). Afegir un breu diàleg just abans de començar el `seq` d'`obrirGabia`, a càmera `(a.x, a.y-0.8*a.displayHeight)` zoom 1.9:
- Ineu: «Germà Aldreu, la gàbia s'obrirà. Podeu venir amb nosaltres.»
- Germà Aldreu: «Encara no.»

Després, la gàbia puja (existent) i l'Aldreu retrocedeix a `gx+320` (ja hi és, `npcVa` vel 300 → pot passar a vel 150, més trist).

**F4 — Capolls i riures** (`capollTrencat` ×3 + `finalGabia` primer `seq`). Mentre els nens riuen, l'Aldreu s'aixeca el cap per primer cop: si G1 existeix, canvi suau a la variant «aixecant el cap» (G2, opcional) o, sense, treure `angle` i `scaleY` en 800 ms i treure el tint (`clearTint` + `tweens.add alpha`), de manera que el color torna. P53 en primer pla de l'Aldreu: ja es veu que escolta.

**F5 — La conversa** (nou, a `finalGabia` entre l'existent «La seva veu em parlava...» i «Jo em quedo amb ell»). Plans: P53 (Aldreu 1.9) ↔ P54 (Ineu 1.5). Textos:
1. `[P53]` Germà Aldreu: «La seva veu em parlava dins el cap cada nit. Era l'única que em parlava.» *(existent)*
2. `[P53]` Germà Aldreu: «Escolta'ls. Riuen tan fort... i ningú no els tanca.»
3. `[P54]` Ineu: «Veniu amb nosaltres, Germà. A la taula del refectori hi ha lloc per a tothom.»
4. `[P53 fer: aquí el somriure]` — pausa 700 ms; el sprite canvia a `germa_aldreu` (somrient); és el somriure de la Plaça: suau, humil, una mica trist als ulls. `Sfx.puf` absent. Només un petit `llum` càlid (`0xffe8a0`).
5. `[P53]` Germà Aldreu: «Ja ho sé que n'hi ha. Gràcies, Ineu.» *(primer cop que li diu pel nom, no «monjo»)*
6. `[P53]` Germà Aldreu: «El Mestre és aquí dins... *(mira la gàbia)* Algú l'ha de vetllar. Algú que sàpiga què és no ser vist.» *(substitueix «El Mestre és aquí dins...» sol)*
7. `[P53 fer: npcVa a (gx, base+10) vel 100]` Germà Aldreu: «Jo em quedo amb ell.» *(existent; es manté la frase)*
8. `[P54]` Ineu (baix): «Vindré a veure-us.» — Germà Aldreu: «Ja ho sé.»

**F6 — La gàbia baixa** (P55). Tilt-down amb la gàbia (1600 ms, `Quad.easeIn` existent). Shake més suau (0.006). No `Sfx.porta` fort: el mateix, però seguit d'1,2 s de silenci (no `boiraPuf` agressiu; només una mica de llum càlida).

**F7 — Primer pla entre barrots** (P56). `enquadrar(gx, base-60, 1.95, 900)`. L'Aldreu, dins, mira l'Ineu i somriu. Esperar 1200 ms sense cap text. Opcional: un gest lent — `npcSalta` NO; en lloc, un balanceig de 3 px (`tweens.add({targets:a, y:a.y-3, yoyo:true, duration:900})`). Els nens, davant, **saluden** (`npcSalta(k, null, 1)` suau).

**F8 — Reculada** (P57). `enquadrar(gx, base-40, 0.90, 3200)`: la gàbia es va fent petita, l'Aldreu continua somrient dins. Els nens corren cap a l'Ineu (existent). `Sfx.riure` decreixent. `fadeOut(1800)`.

**F9 — Estat posterior (epíleg i món).** L'Aldreu es queda a `(gx, base+10)` dins la gàbia, amb el sprite **somrient** (el mateix que a la Plaça), tal com ja fa `l.725`. Les seves frases a `aldreuGabia` (andreuTancat) són serenes (b-6). L'epíleg no canvia, però el Pare Jordà ja diu «la gàbia que ell mateix ha triat»: coherent amb «el somriure és una decisió».

---

## (d) GRÀFICS NOUS DEMANATS (amb alternativa sense gràfic)

Mida de llenç: Ocellaire 260x329; Aldreu: la del seu sprite normal `assets/personatges/germa_aldreu.webp` (el de camina és 180x265 per fotograma: usar el mateix llenç que l'estàtic). Estil, paleta i línia de la resta d'`art/`.

| # | Clau | Quin pla | Descripció per al prompt d'imatge | Alternativa SENSE el gràfic |
|---|---|---|---|---|
| G1 | `germa_aldreu_trist` (prioritari) | P35, P36, F1-F4 | El Germà Aldreu, mateix disseny i habit que `germa_aldreu` (cabell gris, ulleres rodones, habit fosc), dret però amb el **cap cot**, barbeta al pit, ulleres lleugerament baixes, ulls tancats o a mig tancar, **sense somriure**; espatlles caigudes, mans juntes davant, una mica encorbat; il·luminació lila apagada. Fons transparent. | Tint `0xb8b8d0`, `angle=-5`, `scaleY 0.97`, respiració lenta, d'esquena, i no fer cap primer pla de cara fins al somriure (vegeu secció c). |
| G2 | `germa_aldreu_aixeca` (opcional) | F4 | Mateix personatge, **aixecant lentament el cap**, mirada trista però oberta cap a un costat; llavis tancats, ni somriure ni plor. | Treure tint/angle en 800 ms i crossfade a `germa_aldreu`. |
| G3 | `ocellaire_alca` (opcional) | P08, P11 | L'Home de la Gàbia (260x329), **bàcul alçat amb una mà** sobre el cap, cap tirat enrere, mantell obert com ales, ulls lila encesos; actitud d'invocació. | `ocellaire_rugit` amb escala creixent de `E*1.9` a `E*1.4`, bàcul amb `gir=0.55` durant P08. |
| G4 | `ocellaire_mira_avall` (opcional) | P10, P11, P13 | L'Home de la Gàbia (260x329) **inclinat endavant, mirant cap avall** com qui contempla una criatura petita; cap lleugerament de costat, ulls lila encesos, somriure dolç i fred, bàcul penjant en una mà. | `ocellaire` base amb `ulls` (crearUlls) i zoom 1.6-2.2 des de sota (P10/P12). |
| G5 | `ocellaire_primer_pla` (opcional, alta resolució) | P10, P32 | **Primer pla** de la cara de l'Home de la Gàbia (llenç 512x512 retallat): ulls lila, plomes fosques, expressió serena i sedosa; per usar en P10 i en P32 (versió amb ulls apagats). | Ampliar `ocellaire` a zoom 2.2 (els gràfics tenen resolució de sobra). |
| G6 | `ocellaire_desfet` (opcional) | P33 | L'Ocellaire (260x329) **mig dissolt en boira lila**: la meitat inferior ja es transforma en volutes, la cara cansada, ulls apagats. | `alpha` 1→0 en 1400 ms + partícules `boira` (ja a `ocellaireDerrotat`). |
| G7 | `aldreu_pastor_crida` (opcional) | P07 | El Pastor de Boira (`aldreu_guardia`, 85 d'ample) **amb els dos braços alçats** i cap enrere cridant el Mestre; boira que li ix del cos. | `npcSalta(…,2)` + zoom 1.15 i pujada de càmera (P07). |

**Prioritat:** G1 és l'únic gràfic realment important (és l'emoció del final). La resta es poden suplir amb escala i càmera.

---

## Checklist de compatibilitat (per a qui toqui el codi)

- Cada pàgina nova `{fer:(z,fet)=>z.enquadrar(..., fet)}` no ha de deixar la càmera sense `alliberarCamera` al final; `finalGabia` i `ocellaireDerrotat` ja ho fan.
- `desferPastor` destrueix el sprite i en crea un de nou: el tint/escala/angle de F1 s'ha d'aplicar al NOU `germa_aldreu` després de la crida.
- Si s'escala l'Ocellaire x1.4, repassar `puntPlataforma`, el seu ulls (`posarUlls`), els ocells de foc (`flamaOcell`) i `colpAnell` (ona), i jugar-ho perquè l'Ineu no es quedi sense espai.
- `sensePunts()` impedeix parlar durant el combat; recordar que `bossActiu` es posa fals fins al final de `ocellaireDerrotat` (l'Aldreu és parlable només després).
- No hi ha cap canvi a `js/progres.js` (cap flag nou): tots els flags usats ja existeixen (`ocellaireVist`, `ocellaireVencut`, `gabiaOberta`, `andreuTancat`).
