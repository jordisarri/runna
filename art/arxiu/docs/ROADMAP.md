# Roadmap: què queda per fer a Runna

Cada punt té un **codi** (R1, R2…), què hi ha ara, **la meva proposta** i el que costa. Per decidir només cal respondre amb el codi:
- «**R4 sí**» = faig el que proposo.
- «**R4: <prompt>**» = ho canvio com tu diguis (o «R4 no», si ho vols descartar).
- «**tots els P1 sí**» també val.

Prioritat: **P1** = abans de ensenyar-lo a gent · **P2** = quan es pugui · **P3** = només si sobra temps.
Estat de partida: la història es pot jugar de principi a fi (`node eines/prova_progres.js` passa) i la música és tota feta. Reflecteix `docs/PLA_FINAL.md`, `docs/PROMPTS_GRAFICS.md` i els 6 issues oberts de GitHub (#2, #4, #5, #7, #13, #14).

---

## A. Publicar i provar

| Codi | Pri. | Què hi ha ara | La meva proposta | Cost |
|---|---|---|---|---|
| **R1** | P1 | La publicació a GitHub Pages es queda penjada a `deploy-pages` (`syncing_files`); la pàgina és despublicada. Les curses de fa dues nits van anar bé. | Tornar a llançar el workflow quan portis ≥1 h; si falla, un workflow que publiqui a la branca `gh-pages` (sense `deploy-pages@v4`). Si també falla, Cloudflare Pages (arrossegar la carpeta). | 30 min |
| **R2** | P1 | Issue #7: no s'ha provat en un mòbil real des de les últimes revisions (9:16, zones segures d'iOS, controls «Mà»). | Una sessió de 20 min amb un guió curt (inici → plaça → combat → diàleg → tarota → tancar i tornar a obrir) i anotar-ho a `production/qa/`. Jo preparo la llista de proves; tu la passes al telèfon. | 1 h teva |
| **R3** | P1 | Issues #13 (Cant del Miracle a la Pianista i la Joaneta de vident) i #14 (canvis del 24/10) pendents de provar a mà. | Provar-los en la mateixa sessió que R2 i tancar els issues. | dins de R2 |
| **R4** | P2 | La PWA (`sw.js`) està en versió `runna-4`; cada canvi d'àudio o vídeo demana pujar-la a mà. | Que el `sw.js` agafi la versió del `?v=` d'`index.html` automàticament, perquè no es pugui oblidar. | 30 min |

## B. Combat

| Codi | Pri. | Què hi ha ara | La meva proposta | Cost |
|---|---|---|---|---|
| **R5** | P1 | L'Ocellaire: pauses de 2,2 / 1,9 / 1,6 s, no provades a mà. El Pastor de Boira té poses noves més grans i zoom de combat (×1,12). | Jugar-los tu una vegada i dir-me «massa fàcil / massa difícil»; jo ajusto les pauses i la vida. Mentrestant, deixo el que hi ha. | 15 min + ajust |
| **R6** | P2 | Enemics amb art provisional dibuixat amb codi (escolopendra, gripau, visitant, ovelles, ratpenat, ferralla, capoll). Decidit que es queden així. | Mantenir la decisió. Només afegiria el mateix contorn negre d'1 px que l'Ineu si després vols coherència (R9). | 0 |

## C. Art

| Codi | Pri. | Què hi ha ara | La meva proposta | Cost |
|---|---|---|---|---|
| **R7** | P1 | `ocellaire_genolls` va fer-se; queda pendent confirmar-lo al joc. A `PROMPTS_GRAFICS` encara consta com a pendent. | Revisar-lo al combat i actualitzar la llista de pendents. Si no l'has fet, el prompt ja és a `docs/PROMPTS_GRAFICS.md`. | 15 min |
| **R8** | P2 | Pendents amb prompt: `ineu/tarota_gran`, `home_raim_o`, `home_raim_caigut`, `gabia`, `gabia_oberta`, fulls del Pastor (`pastor_camina`, `pastor_atac`, `pastor_cau`). Alguns ja són integrats i la llista és antiga. | Que jo revisi quins són de debò pendents i deixi la llista de `PROMPTS_GRAFICS.md` neta, només amb els que fan falta. | 30 min |
| **R9** | P2 | L'Ineu ja té contorn negre d'1 px (caminar, idle, atac, alçar l'arma); els NPC i enemics no. | Provar-lo al mòbil (R2). Si t'agrada, aplicar-lo als NPC principals amb el mateix script; si es veu massa fi, passar-lo a 2 px. | 1 h |
| **R10** | P3 | Issue #4: la vora de la plaça empedrada. Issue #5: revisar els fons de les zones amb l'estil nou. | Fer una passada per les zones amb una captura de cada una i proposar-te les 5-6 pitjors; no redibuixar-ne cap sense que les triïs. | 1 h |

## D. Joc i escenes

| Codi | Pri. | Què hi ha ara | La meva proposta | Cost |
|---|---|---|---|---|
| **R11** | P1 | Issue #2: portes i col·lisions als gràfics definitius. Ja he revisat les portes tancades (totes bloquegen) i he arreglat Sant Gabriel i la roca del Dolmen. | Una passada «caminar contra tot»: per cada zona, un script que mou l'Ineu a les vores dels edificis i avisa dels llocs on es queda encallat o entra on no toca. Genera un informe a `production/qa/`. | 2 h |
| **R12** | P2 | Escena de Runna al Dolmen: ara té zoom, raigs, silenci després de la fanfàrria, Ineu més petit. | Afegir un petit moment en acabar: la llum s'esvaeix i l'Ineu mira l'espasa un segon abans de tornar el control. I que el rètol quedi lligat a la durada de la fanfàrria. | 1 h |
| **R13** | P2 | El «suc» en agafar una arma (zoom, llums, flaix) existeix per al bastó i la branca del Til·ler; Runna té la seva escena pròpia. | Afegir un so d'objecte diferent per a cada arma i el mateix efecte als objectes clau (la tarota, les claus de les portes). | 1 h |
| **R14** | P3 | Els textos de l'epíleg i els diàlegs «després del final» estan fets. | Una última lectura completa del guió (`GUIO.md` contra `dialegs.js`) per cercar incoherències; ja hi ha un informe a `production/narrative/`. | 1 h |

## E. Tècnica

| Codi | Pri. | Què hi ha ara | La meva proposta | Cost |
|---|---|---|---|---|
| **R15** | P2 | Memòria i càrrega: les fulles de l'Ineu es redueixen en carregar; hi ha textures grans (aixeca a 500 px, terres). Mòbils antics poden patir. | Mesurar la memòria de textures a 3 zones pesades en un mòbil i, si passa de ~250 MB, reduir les textures més grans. | 1 h |
| **R16** | P3 | El teclat i el ratolí funcionen però no hi ha cap indicació a la pantalla (decidit). | Mantenir-ho tal com és. | 0 |
| **R17** | P3 | Un `README` amb com treballar des de Windows (clonar a `C:\Users\...`, Claude Code, sincronitzar amb GitHub). | Afegir-ho a `README.md` perquè no es perdi. | 20 min |

---

### Ordre que proposo si acceptes tot
1. R1 (publicar) → R2 + R3 (provar al mòbil) → R5 (ajustar combats) → R11 (passada de col·lisions) → R7.
2. Després, P2: R4, R8, R9, R12, R13, R15.
3. I P3 només si sobra temps: R10, R14, R17.

Quan em diguis quins accepto o canvio, actualitzo aquest document (marco el que és fet) i començo pel primer.
