# Informe de QA amb Playwright (2026-11-19)

Proves automàtiques amb Chromium sense finestra (Playwright) sobre `http://localhost:8000/?proves`, a la versió `2611196000` (després de baixar els 59 commits de l'altra sessió). **Cap canvi al codi del joc.** Scripts a `production/qa/playwright/`.

## 1. Resum

- **Càrrega:** les 57 zones carreguen i l'Ineu hi apareix, sense errors de pàgina, de consola ni de xarxa (llevat de l'àudio, vegeu §5) i sense cap Ineu dins d'un obstacle.
- **Història:** els 47 passos de `PROGRES` són coherents (en saltar al pas *i*, tots els anteriors són fets i el *i* no ho és; cap pista buida ni amb error). Totes les sortides de totes les zones porten a una zona i una entrada que existeixen. Tots els punts d'interacció actius són accessibles.
- **Combat:** un sol problema real: **el Pastor de Boira s'ha fet trivial** (efecte d'A3: vegeu §3.1). L'Ocellaire continua sent el pic de dificultat.
- **Canvis recents (idle HD, Rovellonera d'una sola clariana, Cant del Miracle):** funcionen.
- **Mòbil (375x812, tàctil):** el canvas s'ajusta sense scroll horitzontal; el pergamí d'objectiu s'obre i es veu bé.

## 2. Estructura

| Prova | Resultat |
|---|---|
| Fumada de 57 zones (`fumada.js`) | 57/57 OK, 0 errors |
| Coherència dels 47 passos (`estructura.js`) | 0 incoherències |
| Sortides (destí i entrada existents) | 0 errors |
| Graf `MAPA.enllacos` | 4 zones sense enllaç al mapa (ZonaBoira, ZonaGabrielInt, ZonaTresor, ZonaTorre): són interiors o especials, a les quals s'arriba per sortides de zona; sense importància |
| Abast per quadrícula (`abast.js`) | Tots els punts d'interacció, accessibles. 4 sortides marcades (Església→Torre, Tortura→Boira, Boira→Gàbia, Passadís→Casa del Tresor): **falsos positius**, comprovat caminant (les 4 funcionen) |

«Faltants» (57 imatges): són objectes dibuixats per codi (`file: null`, dibuix provisional), no imatges que falten.

## 3. Combats (bot, 16 intents per escenari)

| Escenari | Victòries | Morts | Temps | Cops rebuts (mitjana) |
|---|---|---|---|---|
| Pastor, 3 cors | 16/16 | 0 | 5,6 s | **0** |
| Pastor, ingenu | 6/6 | 0 | 4,6 s | 0 |
| Raïm, 5 cors | 16/16 (directe, 12/12) | 0 | ~20 s | 2,2 (màx. 5) |
| Raïm, ingenu | 6/6 | 0 | 14,6 s | 6,3 |
| Ocellaire, 5 cors | 11/16 | 5 | 68 s | 6,9 (màx. 10) |
| Ocellaire, 6 cors | 10/16 | 6 | 83 s | 9,5 (màx. 12) |
| Ocellaire, 5 cors, ingenu | 6/6 | 0 | 35 s | 3,7 |

### 3.1. El Pastor de Boira ja no fa res (nou, gravetat baixa-mitjana)
El Pastor mor en 5-6 s i el bot no rep cap cop (abans de la revisió d'A3, 12-18 s i 2-4 cops de 6). La causa és la combinació de dues coses: **A3** (immunitat 440 → 270 ms, així cada cop de la branca compta: 14 cops en uns 4 s) i que té **28 de vida**. Ja no hi ha temps perquè faci el seu patró (apunta 800 ms + envestida). **Proposta:** pujar la vida de 28 a 40-44 (uns 20-22 cops, 6-7 s de lluita real), o deixar la immunitat com està i fer-lo més agressiu. A decidir.

### 3.2. L'Ocellaire
Amb el bot esquivador guanya 11/16 (5 cors) i 10/16 (6 cors); abans de les fases intercanviades i d'A4: 6/10 i 8/10. És de la mateixa mida: no es veu cap empitjorament clar. Les morts són gairebé sempre durant la pausa de l'Ocellaire (`cansat`) amb ocells de foc en vol, com ja deia l'informe anterior. El bot ingenu (que no esquiva) guanya 6/6 amb 3,7 cops: el combat **es pot passar sense esquivar res**, i els que més s'ho miren reben més cops. Convé jugar-lo amb una persona real.

### 3.3. Raïm: «fuites» al banc
El banc de proves (`FF.batch`) va donar 6 «fuites» (l'Ineu surt de la zona) de 16 intents. Executat directament (sense el banc) són 12/12 victòries sense cap sortida de zona, de manera que és molt probable un artefacte del banc (la comprovació `Z() !== z` en reaprofitar l'escena). No s'ha confirmat del tot; si el forat A1 hagués reaparegut s'hauria vist al recorregut directe.

## 4. Regressions i comprovacions funcionals

- **Rovellonera d'una sola clariana:** amb `rovResolt` i `llac2`: 2 sortides (E i baix); anar baix porta a Gabriel; anar a la dreta, al Camí. Sense `llac2`: laberint complet (4 sortides). El cartell mostra la pàgina de l'Ineu: «(El camí ara és més senzill…)». ✔
- **Idle d'alta resolució:** durant caminar → aturar-se en les 4 direccions amb el teclat, 0 fotogrames amb l'escala errònia (textures `ineu_idle_*` de 288 px i `ineu_*` alternades). ✔
- **Cant del Miracle:** notes 3-3-4-5-1. ✔
- **Mussol de pedra de l'Hostatgeria:** sense Guants, l'Ineu diu que li cal ser més fort; amb Guants el mussol es mou i en ~1,3 s arriba al seu lloc i queda `refetorObert`. ✔

## 5. Limitacions i coses a saber

- **Àudio:** `assets/musica/gabia.m4a` surt com a petició fallida al Chromium sense finestra (no porta còdecs propietaris com l'AAC). No és un error del joc, i no he pogut provar sons ni música.
- **Un bot no és una persona:** no es mesura si és divertit, l'estil visual, ni si un diàleg o la càmera «se senten bé». Les captures de les zones noves (Hostatgeria, Jardí, Gàbia, Galeria de la boira, Tortura, Refetor) es veuen coherents, però cal que les miri algú.
- **Cinemàtiques i diàlegs llargs:** el recorregut complet de la història jugant (parlant amb tothom, cinemàtiques, minijocs) no s'ha automatitzat; s'ha validat l'estructura (passos, pistes, sortides, abast) i les peces concretes de §4.
- **Banc de proves:** `Proves.anar` no tanca un diàleg obert; si es canvia de zona amb un diàleg obert, l'entrada queda bloquejada (artefacte de prova, no del joc).
- Només s'ha usat un navegador alhora: el servidor `serveix.py` és d'un sol fil i en refusa connexions si n'hi ha 3 en paral·lel.
