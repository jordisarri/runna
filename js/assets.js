/**
 * GRÀFICS
 * - CATALEG: imatges de la carpeta assets/. Si una entrada no té fitxer o no es pot carregar, es dibuixa el provisional.
 * - Els gràfics amb fons blanc es netegen; els WebP ja venen nets i retallats.
 * - Les textures es creen a resolució RES (x2) i es mostren a escala 1/RES perquè es vegin nítides.
 */
const RES = 2;

const CATALEG = [
    // Edificis
    { key: 'esglesia',     file: 'assets/edificis/esglesia.webp',     amplada: 1100 },   // gran: la porta (~165) ha de superar l'Ineu (~125); a la plaça es retalla i no es veu sencera
    { key: 'monestir',     file: 'assets/edificis/monestir.webp',     amplada: 800, provisional: (c, w) => dibuixarMonestir(c, w) },
    { key: 'cel_stantoni', file: 'assets/edificis/cel_stantoni.webp', amplada: 900, provisional: (c, w) => dibuixarCasaGran(c, w) },
    { key: 'taverna',      file: 'assets/edificis/taverna.webp',      amplada: 900, provisional: (c, w) => dibuixarTaverna(c, w) },
    { key: 'casa_gran',    file: 'assets/edificis/casa_gran.webp',    amplada: 1250, provisional: (c, w) => dibuixarCasaGran(c, w) },
    // Personatges
    { key: 'ineu_inconscient', file: 'assets/ineu/ineu_inconscient.webp', amplada: 170, cru: true, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#6a4426', cabell: '#5a4636' }) },   // l'Ineu a terra després d'una derrota (mateix retall que pare_jorda_desperta)
    { key: 'pare_jorda_desperta', file: 'assets/personatges/pare_jorda_desperta.webp', amplada: 170, cru: true, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#1d1b22', alt: 1.08, ulleres: true, cabell: '#9c9c9c' }) },   // el Pare Jordà agenollat al seu costat, despertant-lo
    { key: 'pare_jorda',   file: 'assets/personatges/pare_jorda.webp',   amplada: 90, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#1d1b22', alt: 1.08, ulleres: true, cabell: '#9c9c9c' }) },
    { key: 'germa_aldreu', file: 'assets/personatges/germa_aldreu.webp', amplada: 79, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#2a2230', cabell: '#d8d8dc', ulleres: true, pilota: true }) },
    { key: 'germa_aldreu_trist', file: 'assets/personatges/germa_aldreu_trist.webp', amplada: 79 },      // Aldreu amb el cap cot (final de la Sala de la Gàbia, abans del somriure); si no hi és, gabia.js usa germa_aldreu amb tint
    { key: 'pare_daimiel',  file: 'assets/personatges/pare_daimiel.webp',  amplada: 94, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#1d1b22', cabell: '#5a4636' }) },
    { key: 'dolora',   file: 'assets/personatges/dolora.webp', amplada: 94, cru: true, provisional: (c, w) => dibuixarMonja(c, w, { cadira: true, cabell: '#e8e8e8', ample: 0.95 }) },
    { key: 'carmelia',   file: 'assets/personatges/carmelia.webp', amplada: 116, cru: true, provisional: (c, w) => dibuixarMonja(c, w, { cabell: '#6a4a2e', ample: 1.45, alt: 0.92 }) },
    { key: 'pilaria',   file: 'assets/personatges/pilaria.webp', amplada: 111, cru: true, provisional: (c, w) => dibuixarMonja(c, w, { cabell: '#3b2a1e', ulleres: true, ample: 0.8, alt: 1.06 }) },
    { key: 'germa_franci', file: 'assets/personatges/germa_franci.webp', amplada: 78, cru: true, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#3a2c22', cabell: '#e8e8e8', alt: 1.14, prim: true, barba: '#ececec' }) },
    { key: 'pare_alcovi',   file: 'assets/personatges/pare_alcovi.webp',   amplada: 84, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#1d1b22', cabell: '#d8d8d8', llibre: true }) },
    { key: 'pare_alcovi_esquena', file: 'assets/personatges/pare_alcovi_esquena.webp', amplada: 82, cru: true, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#1d1b22', cabell: '#d8d8d8', llibre: true }) },      // d'esquena, llegint la Crònica al faristol (AutoSprite)
    // Elements
    { key: 'home_raim',    file: 'assets/enemics/home_raim.webp',    amplada: 115.5, provisional: (c, w) => dibuixarHomeRaimMarbre(c, w) },   // l'estàtua (abans del combat)
    { key: 'home_raim_desperta', file: 'assets/enemics/home_raim_desperta.webp', amplada: 115, provisional: (c, w) => dibuixarHomeRaimMarbre(c, w) },   // el guardià despert (boss de l'Escalinata)
    { key: 'home_raim_apunta', file: 'assets/enemics/home_raim_apunta.webp', amplada: 250, cru: true },   // el guardià tirat enrere amb la maça alçada (apuntant i carregant)
    { key: 'home_raim_caigut', file: 'assets/enemics/home_raim_caigut.webp', amplada: 380, cru: true },   // de morros a terra (cap a l'esquerra; es gira amb flipX): el cap és el punt feble
    { key: 'cercle_runes', file: 'assets/objectes/cercle_runes.webp', amplada: 440, cru: true },   // el cercle de runes al terra de l'Escalinata (s'encén quan es desperta el guardià)
    { key: 'home_raim_n',  file: 'assets/enemics/home_raim_n.webp', amplada: 115.5, provisional: (c, w) => dibuixarHomeRaimMarbre(c, w) },   // l'estàtua amb el cap d'esquena (inici del puzle del volant)
    { key: 'tomba_angel', file: 'assets/objectes/tomba_angel.webp', amplada: 140, provisional: (c, w) => lienc(c, w, w * 226 / 140, (ctx, W, H) => { ctx.scale(W / 140, H / 226); pintarTombaAngel(ctx, 140, 226, false); }) },   // la tomba de l'àngel, amb el ram marcit
    { key: 'tomba_angel_content', file: 'assets/objectes/tomba_angel_content.webp', amplada: 140, provisional: (c, w) => lienc(c, w, w * 226 / 140, (ctx, W, H) => { ctx.scale(W / 140, H / 226); pintarTombaAngel(ctx, 140, 226, true); }) },   // la mateixa, amb flors fresques i una espelmeta (mateixa amplada: es canvia la textura sense canviar l'escala)
    { key: 'tomba_esquerdada', file: 'assets/objectes/tomba_esquerdada.webp', amplada: 240, provisional: (c, w) => lienc(c, w, w * 0.625, (ctx, W, H) => { ctx.scale(W / 240, H / 150); pintarTombaMonjos(ctx, 240, 150, true); }) },   // la tomba dels monjos, esquerdada i oberta
    { key: 'tomba_tancada', file: 'assets/objectes/tomba_tancada.webp', amplada: 240, provisional: (c, w) => lienc(c, w, w * 0.625, (ctx, W, H) => { ctx.scale(W / 240, H / 150); pintarTombaMonjos(ctx, 240, 150, false); }) },   // la mateixa, segellada (mateixa amplada: es canvia la textura sense canviar l'escala)
    { key: 'home_raim_pedestal', file: 'assets/enemics/home_raim_pedestal.webp', amplada: 115.5, provisional: (c, w) => dibuixarHomeRaimMarbre(c, w) },   // només el pedestal (queda quan el guardià es desperta i baixa)
    { key: 'home_raim_e',  file: 'assets/enemics/home_raim_e.webp', amplada: 115.5, provisional: (c, w) => dibuixarHomeRaimMarbre(c, w) },   // l'estàtua amb el cap de perfil (tercer pas del volant)
    { key: 'home_raim_ne', file: 'assets/enemics/home_raim_ne.webp', amplada: 115.5, provisional: (c, w) => dibuixarHomeRaimMarbre(c, w) },   // l'estàtua amb el cap de tres quarts d'esquena (segon pas del volant)
    { key: 'creu',         file: 'assets/objectes/creu.webp',        amplada: 150,  provisional: (c, w) => dibuixarCreuAparicio(c, w) },
    { key: 'creu_desaparicio', file: 'assets/objectes/creu.webp', amplada: 105, provisional: (c, w) => dibuixarCreuDesaparicio(c, w) },
    // Botons del HUD (rodons, amb el marc inclòs). Mentre no hi hagi el PNG es veu el dibuix provisional (medalló + icona)
    { key: 'boto_sarro',    file: 'assets/ui/boto_sarro.webp',    amplada: 72, cru: true, provisional: (c, w) => lienc(c, w, w, (ctx, W) => pintarBoto(ctx, W, pintarIconaSarro)) },
    { key: 'boto_consells', file: 'assets/ui/boto_consells.webp', amplada: 72, cru: true, provisional: (c, w) => lienc(c, w, w, (ctx, W) => pintarBoto(ctx, W, pintarIconaConsells)) },
    { key: 'bassadoria',   file: 'assets/objectes/bassadoria.webp',   amplada: 620, cru: true, provisional: (c, w) => dibuixarBassadoriaReixa(c, w) },   // aigua neta
    { key: 'bassadoria_boira', file: 'assets/objectes/bassadoria_boira.webp', amplada: 620, cru: true, provisional: (c, w) => dibuixarBassadoriaReixa(c, w) },   // aigua tèrbola amb boira (abans del Cant de l'Aurora)
    { key: 'arbre',        file: 'assets/natura/arbre.webp',        amplada: 300, provisional: (c, w) => dibuixarArbre(c, w) },
    { key: 'pi_arrels_mortes', file: 'assets/natura/pi_arrels_mortes.webp', amplada: 149 },   // les arrels seques, mentre el pi dorm
    { key: 'placa_pi',     file: 'assets/natura/placa_pi.webp',     amplada: 100, provisional: (c, w) => lienc(c, w, Math.round(w * 0.95), (ctx, W, H) => pintarPlacaPi(ctx, W, H)) },   // la fita del Pi dels Tres Cants (docs/PROMPTS_GRAFICS.md)
    { key: 'placa_dolmen',  file: 'assets/natura/placa_dolmen.webp',     amplada: 190, provisional: (c, w) => lienc(c, w, Math.round(w * 0.95), (ctx, W, H) => pintarPlacaPi(ctx, W, H)) },   // la placa davant el Dolmen (què cal per alçar Runna); prompt a docs/PROMPTS_GRAFICS.md
    // Els tres emblemes de l'animació del Dolmen (medallons de pedra amb la talla de la placa: una fulla, un llibre i una mà). Mentre no hi hagi el PNG, es veu la icona dibuixada amb codi (js/icones.js); prompts a docs/PROMPTS_GRAFICS.md
    { key: 'emblema_arbre',     file: 'assets/ui/emblema_arbre.webp',     amplada: 110, provisional: (c, w) => lienc(c, w, w, (ctx, W) => { ctx.scale(W / 96, W / 96); ctx.lineJoin = 'round'; ctx.strokeStyle = CONTORN; ICONES_OBJECTES.fulla_tiler(ctx); }) },
    { key: 'emblema_saber',     file: 'assets/ui/emblema_saber.webp',     amplada: 110, provisional: (c, w) => lienc(c, w, w, (ctx, W) => { ctx.scale(W / 96, W / 96); ctx.lineJoin = 'round'; ctx.strokeStyle = CONTORN; ICONES_OBJECTES.saber(ctx); }) },
    { key: 'emblema_benedicio', file: 'assets/ui/emblema_benedicio.webp', amplada: 110, provisional: (c, w) => lienc(c, w, w, (ctx, W) => { ctx.scale(W / 96, W / 96); ctx.lineJoin = 'round'; ctx.strokeStyle = CONTORN; ICONES_OBJECTES.benediccio(ctx); }) },
    { key: 'pi_arrels',    file: 'assets/natura/pi_arrels.webp',    amplada: 150, provisional: (c, w) => lienc(c, w, Math.round(w * 2), (ctx, W, H) => pintarArrelsPi(ctx, W, H)) },   // la barrera d'arrels del Pi dels Tres Cants (docs/PROMPTS_GRAFICS.md)
    // Els quatre estats del pi (es retallen tots amb la mateixa caixa: en canviar de dibuix no es mouen). Un cant = una branca viva
    { key: 'pi_tres_cants_mort', file: 'assets/natura/pi_tres_cants_mort.webp', amplada: 340, provisional: (c, w) => lienc(c, w, Math.round(w * 1.53), (ctx, W, H) => pintarPiTresCants(ctx, W, H)) },   // sec, adormit
    { key: 'pi_tres_cants_esq', file: 'assets/natura/pi_tres_cants_esq.webp', amplada: 340, provisional: (c, w) => lienc(c, w, Math.round(w * 1.53), (ctx, W, H) => pintarPiTresCants(ctx, W, H)) },   // només la branca esquerra viva (després del primer cant)
    { key: 'pi_tres_cants_dos', file: 'assets/natura/pi_tres_cants_dos.webp', amplada: 340, provisional: (c, w) => lienc(c, w, Math.round(w * 1.53), (ctx, W, H) => pintarPiTresCants(ctx, W, H)) },   // la branca esquerra i la dreta vives (després del segon cant)
    { key: 'pi_tres_cants', file: 'assets/natura/pi_tres_cants.webp', amplada: 340, provisional: (c, w) => lienc(c, w, Math.round(w * 1.53), (ctx, W, H) => pintarPiTresCants(ctx, W, H)) },   // el Pi dels Tres Cants (js/zones/bosc_pi.js); prompt a docs/PROMPTS_GRAFICS.md
    { key: 'pi',           file: 'assets/natura/pi.webp',           amplada: 230, provisional: (c, w) => dibuixarPi(c, w) },
    { key: 'pi_pinyer',    file: 'assets/natura/pi_pinyer.webp',    amplada: 470, provisional: (c, w) => dibuixarPiPinyer(c, w) },
    { key: 'caseta_joc',   file: null,   amplada: 270, provisional: (c, w) => dibuixarCasetaJoc(c, w) },
    { key: 'xiprer',       file: 'assets/natura/xiprer.webp',       amplada: 80,  provisional: (c, w) => dibuixarXiprer(c, w) },
    { key: 'retaule',      file: 'assets/edificis/retaule_tancat.webp', amplada: 800, provisional: (c, w) => dibuixarRetauleBarroc(c, w) },

    // ---- Edificis nous ----
    { key: 'sala_pingpong', file: 'assets/edificis/sala_pingpong.webp', amplada: 1200, provisional: (c, w) => dibuixarEdifici(c, w, w * 0.62, '#d8c8a8', '#3a5a8a', 'Sala del Ping-pong') },
    { key: 'cel_stbenet',   file: 'assets/edificis/cel_stbenet.webp',   amplada: 1250, provisional: (c, w) => dibuixarCelSantBenet(c, w) },
    { key: 'cel_ntrasra',   file: 'assets/edificis/cel_ntrasra.webp',   amplada: 900, provisional: (c, w) => dibuixarCelNostraSenyora(c, w) },
    { key: 'ermita',        file: 'assets/edificis/ermita.webp',        amplada: 620, provisional: (c, w) => dibuixarErmitaDesaparicio(c, w) },
    { key: 'hostatgeria',    file: 'assets/edificis/hostatgeria.webp',    amplada: 1100, provisional: (c, w) => dibuixarHostatgeria(c, w) },

    // ---- Personatges nous ----
    { key: 'pianista',  file: 'assets/personatges/pianista.webp',  amplada: 92, cru: true, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#6a3a6a', cabell: '#c8c8c8', dona: true, ample: 1.45, alt: 0.9, ulleres: true }) },
    { key: 'pianista_esquena',  file: 'assets/personatges/pianista_esquena.webp',  amplada: 143, cru: true, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#6a3a6a', cabell: '#c8c8c8', dona: true, ample: 1.45, alt: 0.9, ulleres: true }) },
    { key: 'venerables', file: 'assets/personatges/venerables.webp', amplada: 147, cru: true, provisional: (c, w) => dibuixarVenerables(c, w) },   // les dues Venerables Sàvies de les Cel·les, agafades del braç (un sol gràfic)
    { key: 'mare_nena', file: 'assets/personatges/mare_nena.webp', amplada: 77, cru: true, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#cfd6ee', cabell: '#e8e8f2', dona: true, ample: 1.1, alt: 0.9 }) },   // la mare de la Nena de les Trenes (visió de llum, sense rostre)
    { key: 'meus',      file: 'assets/personatges/meus.webp',      amplada: 55,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#b03a4a', cabell: '#3b2a1e', dona: true, ample: 1.1, alt: 1.0 }) },
    { key: 'molner', file: 'assets/personatges/molner.webp', amplada: 70, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#4a6a7a', cabell: '#5a4636', alt: 0.98, calb: true }) },
    { key: 'julius',      file: 'assets/personatges/julius.webp',      amplada: 72, cru: true,  provisional: (c, w) => dibuixarNpcPingpong(c, w, 'julius') },
    { key: 'pomers',  file: 'assets/personatges/pomers.webp',  amplada: 77, cru: true,  provisional: (c, w) => dibuixarNpcPingpong(c, w, 'pomers') },
    { key: 'eloi',      file: null,      amplada: 104, provisional: (c, w) => dibuixarNpcPingpong(c, w, 'eloi') },
    { key: 'jusef',     file: 'assets/personatges/jusef.webp',     amplada: 82, cru: true,  provisional: (c, w) => dibuixarNpcPingpong(c, w, 'jusef') },
    { key: 'jusef_levita', file: 'assets/personatges/jusef_levita.webp', amplada: 134, cru: true, provisional: (c, w) => dibuixarNpcPingpong(c, w, 'jusef') },   // en Jusef levitant amb la pala (minijoc de ping-pong)
    { key: 'senyor_budo', file: 'assets/personatges/senyor_budo.webp', amplada: 78, cru: true, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#6a4a3a', cabell: '#e8e8e8', alt: 0.9, ample: 1.5, cap: 18 }) },      // el vell de la taverna, assegut
    { key: 'galf',      file: 'assets/personatges/galf.webp',      amplada: 55, cru: true,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#8a6a3a', cabell: '#d9b45a', alt: 0.92, ample: 1.35, cap: 17 }) },
    { key: 'carry',     file: 'assets/personatges/carry.webp',     amplada: 58, cru: true,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#6a5a7a', cabell: '#f0f0f0', pell: '#ece4dc', dona: true, alt: 1.0, ample: 0.7 }) },   // la Carry, anciana molt prima i pàl·lida, de cabells blancs curts i faldilla (busca el Pallofa)
    { key: 'pallofa',   file: 'assets/personatges/pallofa.webp',   amplada: 60, cru: true,  provisional: (c, w) => dibuixarGos(c, w) },   // el Pallofa, gos petit i prim, blanc amb taques marrons, borni i ple de puces
    { key: 'isilder',    file: 'assets/personatges/isilder.webp',    amplada: 93, cru: true,  provisional: (c, w) => dibuixarPersona(c, w, { isilder: true, calb: true, roba: '#f4f1e8', cabell: '#000000', alt: 0.94 }) },
    { key: 'georgi_caseta', file: 'assets/personatges/georgi_caseta.webp', amplada: 66, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#6a7a3a', cabell: '#4a3a2a', alt: 0.97, extra: 'gorra' }) },
    { key: 'rosansa',     file: 'assets/personatges/rosansa.webp',     amplada: 80,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#d8b04a', cabell: '#7a3a1e', dona: true, ample: 1.2, alt: 0.95 }) },
    { key: 'iscu',     file: 'assets/personatges/iscu.webp',    amplada: 52, cru: true, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#c8a040', cabell: '#5a3a1e', alt: 0.74, cap: 17, extra: 'gorra' }) },
    { key: 'eve',       file: 'assets/personatges/eve.webp',       amplada: 67, cru: true,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#3a7a5a', cabell: '#e8cc66', dona: true, alt: 0.95 }) },
    { key: 'follet_carro', file: 'assets/personatges/follet_carro.webp', amplada: 68, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#2f6b3d', cabell: '#222', alt: 1.04, extra: 'gorra' }) },

    // ---- Escenari nou ----
    { key: 'runes',     file: 'assets/edificis/runes.webp',     amplada: 760, provisional: (c, w) => dibuixarRunes(c, w) },
    ...Array.from({ length: 12 }, (_, k) => ({ key: 'columna_proces_' + k, file: null, amplada: 64, provisional: (c, w) => dibuixarColumnaProcessio(c, w, k) })),
    { key: 'columna',   file: null,   amplada: 58,  provisional: (c, w) => dibuixarColumna(c, w) },
    { key: 'roure',     file: 'assets/natura/roure.webp',     amplada: 420, provisional: (c, w) => dibuixarRoure(c, w) },
    { key: 'tiller_arbre', file: 'assets/personatges/tiller_arbre.webp', amplada: 540, cru: true, provisional: (c, w) => dibuixarTiller(c, w) },   // el Til·ler com un arbre qualsevol, sense cara: així el veus abans de parlar-hi (mateix recorte que `tiller`)
    { key: 'tiller',    file: 'assets/personatges/tiller.webp',    amplada: 540, cru: true, provisional: (c, w) => dibuixarTiller(c, w) },
    { key: 'arrels_tiller', file: 'assets/natura/arrels_tiller.webp', amplada: 440 },
    { key: 'orgue',     file: 'assets/objectes/orgue_petit.webp', amplada: 150, cru: true, provisional: (c, w) => lienc(c, w, Math.round(w * 1.2), (ctx, W, H) => { ctx.fillStyle = '#4a2c16'; ctx.fillRect(0, H * 0.4, W, H * 0.6); ctx.fillStyle = '#c9b48a'; for (let i = 0; i < 9; i++) ctx.fillRect(W * 0.08 + i * W * 0.1, H * 0.05, W * 0.07, H * 0.4); }) },   // l'orgue del Santuari (la Pianista hi toca d'esquena: pianista_orgue)
    { key: 'altar',     file: null,     amplada: 150, provisional: (c, w) => lienc(c, w, Math.round(w * 118 / 150), (ctx, W, H) => { ctx.scale(W / 150, H / 118); pintarAltarPedra(ctx, 150, 118, false); }) },   // l'altar de marbre rosat (Santuari i capella de l'Hostatgeria)
    { key: 'taula_pedra', file: null, amplada: 130, provisional: (c, w) => dibuixarTaulaPedra(c, w, 0) },
    { key: 'taula_pedra2', file: null, amplada: 130, provisional: (c, w) => dibuixarTaulaPedra(c, w, 6) },
    { key: 'font_sj',   file: null,   amplada: 190, provisional: (c, w) => dibuixarFontSJ(c, w) },
    { key: 'carruatge', file: 'assets/objectes/carruatge.webp', amplada: 250, provisional: (c, w) => dibuixarCarruatge(c, w) },
    { key: 'carro_rosansa', file: 'assets/objectes/carro_rosansa.webp', amplada: 280, provisional: (c, w) => dibuixarCarroRosansa(c, w) },
    { key: 'pergola',   file: null,   amplada: 260, provisional: (c, w) => dibuixarPergola(c, w) },
    { key: 'flors',     file: null,     amplada: 90,  provisional: (c, w) => dibuixarFlors(c, w) },
    { key: 'taula_pp',  file: null,  amplada: 240, provisional: (c, w) => dibuixarTaulaPP(c, w) },
    { key: 'alzina_buida', file: 'assets/natura/alzina_buida.webp', amplada: 520, provisional: (c, w) => dibuixarAlzinaBuida(c, w) },
    { key: 'llosa',     file: null,     amplada: 90,  provisional: (c, w) => dibuixarLlosa(c, w) },
    { key: 'corb_columna', file: 'assets/objectes/corb_columna.webp', amplada: 92, cru: true },      // corb de pedra sobre una columna (Sala de la Gàbia, dalt de les escales); mira cap a l'esquerra: es gira per codi

    // ---- Enemics ----
    { key: 'escolopendra', file: null, amplada: 76, fotogrames: 8, provisional: (c, w) => dibuixarEscolopendra(c, w, 8) },   // full de 8 fotogrames (caminar)
    { key: 'gripau',       file: null,       amplada: 56, provisional: (c, w) => dibuixarGripau(c, w) },
    { key: 'visitant',     file: null,     amplada: 96, provisional: (c, w) => dibuixarTurista(c, w) },
    { key: 'branca',       file: 'assets/natura/branca.webp',       amplada: 80, provisional: (c, w) => dibuixarBranca(c, w) },
    { key: 'pergami',      file: null,      amplada: 70, provisional: (c, w) => dibuixarPergami(c, w) },
    { key: 'pergami_partit', file: null, amplada: 80, provisional: (c, w) => dibuixarPergamiPartit(c, w) },
    { key: 'pergami_paret', file: null, amplada: 62, provisional: (c, w) => dibuixarPergamiParet(c, w) },   // el mateix pergamí, desplegat i clavat a la paret
    { key: 'ombra_monjo',  file: 'assets/personatges/ombra_monjo.webp', amplada: 140, cru: true },
    { key: 'ovella',         file: null,         amplada: 70, provisional: (c, w) => dibuixarOvella(c, w, false) },
    { key: 'ovella_boira',   file: null,   amplada: 76, provisional: (c, w) => dibuixarOvella(c, w, true) },
    { key: 'roca',           file: 'assets/natura/roca.webp',           amplada: 90, provisional: (c, w) => dibuixarRoca(c, w) },
    { key: 'basto_ocellaire', file: 'assets/armes/basto_ocellaire.webp', amplada: 184, cru: true },      // (art/armes/basto_ocellaire.png, sense flames: les posa el joc quan gira de pressa; la versió amb flames és basto_ocellaire_flames.png)
    { key: 'masia',          file: null,          amplada: 520, provisional: (c, w) => dibuixarMasia(c, w) },
    { key: 'pastor_a',       file: 'assets/personatges/pastor_a.webp',       amplada: 92, cru: true, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#6a5a48', cabell: '#8a7a60', alt: 0.9, ample: 0.95, calb: true }) },
    { key: 'pastor_b',       file: 'assets/personatges/pastor_b.webp',       amplada: 92, cru: true, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#5a4a58', cabell: '#7a7a7a', dona: true, alt: 0.88, ample: 0.95 }) },
    { key: 'pastor_vell',    file: 'assets/personatges/pastor_vell.webp',    amplada: 96, cru: true, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#5a5040', cabell: '#d0d0d0', barba: '#d0d0d0', alt: 0.86, bastoCoix: true }) },
    { key: 'foc',            file: null,            amplada: 80, provisional: (c, w) => dibuixarFoc(c, w) },
    { key: 'espelma',        file: null,        amplada: 20, provisional: (c, w) => dibuixarEspelma(c, w) },
    { key: 'taula_sopar',    file: null,    amplada: 380, provisional: (c, w) => dibuixarTaulaSopar(c, w) },
    { key: 'ocellaire',      file: 'assets/enemics/ocellaire.webp',     amplada: 130, cru: true, provisional: (c, w) => dibuixarOcellaire(c, w) },
    { key: 'ocellaire_idle2', file: 'assets/enemics/ocellaire_idle2.webp', amplada: 130, cru: true },      // idle: fotogrames 2 i 3 (el 1 és el sprite base); mateixa mida i recorte
    { key: 'ocellaire_idle3', file: 'assets/enemics/ocellaire_idle3.webp', amplada: 130, cru: true },
    { key: 'ocellaire_rugit', file: 'assets/enemics/ocellaire_rugit.webp', amplada: 130, cru: true },      // pose de rugit (canvis de fase), al mateix llenç de 260x329 que l'idle
    { key: 'ocellaire_cansat', file: 'assets/enemics/ocellaire_cansat.webp', amplada: 130, cru: true },
    { key: 'ocellaire_genolls', file: 'assets/enemics/ocellaire_genolls.webp', amplada: 170, cru: true },   // esgotat, de genolls i el cap avall: l'única pausa en què se li pot picar el cap (mateix llenç 260x329)
    // Poses noves (opcionals: el combat les fa servir només si existeixen; si no, el sprite base amb tint/angle). Vegeu design/lluita_final_combat.md § 8
    { key: 'ocellaire_invoca', file: 'assets/enemics/ocellaire_invoca.webp', amplada: 170, cru: true },       // canta: mà dreta alçada (sense bàcul dibuixat)
    { key: 'ocellaire_cercle', file: 'assets/enemics/ocellaire_cercle.webp', amplada: 170, cru: true },       // cop en cercle: ajupit amb els braços avall
    { key: 'ocellaire_llança', file: 'assets/enemics/ocellaire_llança.webp', amplada: 170, cru: true },       // acaba de llançar el bàcul
    { key: 'ratpenat',       file: null,       amplada: 64, provisional: (c, w) => dibuixarRatpenat(c, w) },
    { key: 'ferralla',       file: null,       amplada: 70, provisional: (c, w) => dibuixarFerralla(c, w) },
    { key: 'capoll',         file: null,         amplada: 70, provisional: (c, w) => dibuixarCapoll(c, w) },
    { key: 'nen_uri',        file: 'assets/personatges/nen_uri.webp',    amplada: 50, cru: true, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#3a7ad0', cabell: '#e8c870', alt: 0.56, cap: 17 }) },
    { key: 'nen_flam',       file: 'assets/personatges/nen_flam.webp',   amplada: 54, cru: true, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#d04a3a', cabell: '#14100c', alt: 0.64, cap: 17 }) },
    { key: 'mandu',          file: 'assets/personatges/mandu.webp',          amplada: 62, cru: true, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#d8a0c0', cabell: '#8a5a2a', dona: true, alt: 0.62, cap: 17 }) },       // la Mandu, la germana del Fram, amb la nina sencera
    { key: 'mandu_trencada', file: 'assets/personatges/mandu_trencada.webp', amplada: 62, cru: true, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#d8a0c0', cabell: '#8a5a2a', dona: true, alt: 0.62, cap: 17 }) },       // la mateixa, amb la nina sense cap (fins que el Fram torni)
    { key: 'nen_sardin',     file: 'assets/personatges/nen_sardin.webp', amplada: 59, cru: true, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#4a9a5a', cabell: '#1e1a16', alt: 0.74, cap: 17, ulleres: true }) },
    { key: 'pastor_boira',   file: 'assets/enemics/pastor_boira.webp',   amplada: 88, cru: true, provisional: (c, w) => dibuixarPastorBoira(c, w) },
    { key: 'pastor_derrota', file: 'assets/enemics/pastor_derrota.webp', amplada: 174, cru: true, provisional: (c, w) => dibuixarPastorDerrota(c, w) },
    { key: 'pastor_apunta',  file: 'assets/enemics/pastor_apunta.webp',  amplada: 174, cru: true },
    { key: 'pastor_ataca',   file: 'assets/enemics/pastor_ataca.webp',   amplada: 174, cru: true },
    { key: 'pastor_enfadat', file: 'assets/enemics/pastor_enfadat.webp', amplada: 174, cru: true },
    { key: 'aldreu_guardia', file: 'assets/personatges/aldreu_guardia.webp', amplada: 85,  cru: true, provisional: (c, w) => dibuixarPastorBoira(c, w) },
    { key: 'bolet',          file: 'assets/enemics/bolet.webp',          amplada: 58, provisional: (c, w) => dibuixarBolet(c, w) },
    { key: 'bolet_verinos',  file: 'assets/enemics/bolet_verinos.webp',  amplada: 58, provisional: (c, w) => dibuixarBolet(c, w, 'verinos') },       // guardians de la rialla
    { key: 'rovello',        file: 'assets/natura/rovello.webp',        amplada: 80, provisional: (c, w) => dibuixarRovello(c, w) },
    { key: 'llac',           file: null,           amplada: 58, provisional: (c, w) => dibuixarLlac(c, w) },
    { key: 'diposit',        file: null,        amplada: 300, provisional: (c, w) => dibuixarDiposit(c, w) },
    { key: 'telescopi_mon',  file: null,  amplada: 80, provisional: (c, w) => dibuixarTelescopiMon(c, w) },
    { key: 'tripode',        file: null,        amplada: 80, provisional: (c, w) => dibuixarTelescopiMon(c, w, false) },   // el trípode del mirador, sense el telescopi
    { key: 'dolmen',         file: null,         amplada: 380, provisional: (c, w) => dibuixarDolmen(c, w) },   // amb Runna clavada a dalt
    { key: 'dolmen_buit',    file: null,    amplada: 380, provisional: (c, w) => dibuixarDolmen(c, w, 'buit') },     // quan ja no hi ha l'espasa
    { key: 'dolmen_clavada', file: null, amplada: 380, provisional: (c, w) => dibuixarDolmen(c, w, 'clavada') },   // només Runna clavada (va per davant de l'Ineu)
    { key: 'dolmen_espasa',  file: null,  amplada: 380, provisional: (c, w) => dibuixarDolmen(c, w, 'espasa') },   // només l'espasa (s'aixeca en despertar-la)
    { key: 'conill',         file: null,         amplada: 44, provisional: (c, w) => dibuixarConill(c, w) },
    { key: 'esquirol',       file: null,       amplada: 40, provisional: (c, w) => dibuixarEsquirol(c, w) },
    { key: 'ermita_gabriel', file: 'assets/edificis/ermita_gabriel.webp', amplada: 560, provisional: (c, w) => dibuixarErmitaGabriel(c, w) },
    { key: 'nena_trenes',    file: 'assets/personatges/nena_trenes.webp',    amplada: 78, cru: true, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#e8e8f8', pell: '#dfe6ff', cabell: '#5a4636', dona: true, alt: 0.72, cap: 17, extra: 'trenes' }) },
    { key: 'porxo',          file: null,          amplada: 340, provisional: (c, w) => dibuixarPorxo(c, w) },
    { key: 'esbarzer',       file: 'assets/natura/esbarzer.webp',       amplada: 96, provisional: (c, w) => dibuixarEsbarzer(c, w) },
    { key: 'cofre',          file: null,          amplada: 70, provisional: (c, w) => dibuixarCofre(c, w) },
    { key: 'cofre_obert',    file: null,          amplada: 70, provisional: (c, w) => dibuixarCofre(c, w, true) },        // el mateix cofre, obert i buit (un cop agafat el contingut)
    { key: 'cabana',         file: null,         amplada: 400, provisional: (c, w) => dibuixarCabana(c, w) },
    { key: 'herba_sj',     file: null,     amplada: 70, provisional: (c, w) => dibuixarHerba(c, w, 'sj') },
    { key: 'romani',       file: null,       amplada: 70, provisional: (c, w) => dibuixarHerba(c, w, 'romani') },
    { key: 'farigola',     file: null,     amplada: 70, provisional: (c, w) => dibuixarHerba(c, w, 'farigola') },
    { key: 'rialla',       file: 'assets/natura/rialla.webp',       amplada: 44, provisional: (c, w) => dibuixarHerba(c, w, 'rialla') },       // l'herba del riure (Bosc del Pi dels Tres Cants)
    { key: 'olla',           file: null,           amplada: 110, provisional: (c, w) => dibuixarOlla(c, w) },
    { key: 'ocell',          file: null,          amplada: 34, provisional: (c, w) => dibuixarOcell(c, w) },
    // Ocells de colors per al Pi dels Tres Cants (provisionals: els ocells que hi tornen són tots diferents)
    { key: 'ocell_roig',     file: null, amplada: 34, provisional: (c, w) => dibuixarOcell(c, w, ['#d4473a', '#f0705a', '#a8352a']) },
    { key: 'ocell_groc',     file: null, amplada: 34, provisional: (c, w) => dibuixarOcell(c, w, ['#e8c030', '#f7e070', '#c09a20']) },
    { key: 'ocell_verd',     file: null, amplada: 34, provisional: (c, w) => dibuixarOcell(c, w, ['#4aa84a', '#7ad07a', '#388038']) },
    { key: 'ocell_lila',     file: null, amplada: 34, provisional: (c, w) => dibuixarOcell(c, w, ['#9a5ad0', '#b98af0', '#7a3ab0']) },
    { key: 'ocell_taronja',  file: null, amplada: 34, provisional: (c, w) => dibuixarOcell(c, w, ['#e8802a', '#f5a860', '#c06018']) },
    { key: 'joaneta',        file: 'assets/personatges/joaneta.webp',        amplada: 89, cru: true, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#5a6a3a', pell: '#d8a878', cabell: '#4a3a1e', dona: true, alt: 0.86, ample: 1.05, extra: 'rossa' }) },
    { key: 'arma_tiller', file: 'assets/armes/branca_tiler.webp', amplada: 28, provisional: (c, w) => dibuixarBastoProvisional(c, w) },   // la branca del Til·ler, a la mà
    { key: 'arma_basto',  file: 'assets/armes/basto.webp',       amplada: 24, provisional: (c, w) => dibuixarBastoProvisional(c, w) },
    { key: 'ineu_aixeca', file: 'assets/ineu/aixeca/aixeca_espasa.webp', amplada: 100, cru: true, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#6a4426', cabell: '#5a4636' }) },   // l'Ineu alçant Runna, mirant amunt (ja amb fons transparent)
    { key: 'ineu_aixeca_basto', file: 'assets/ineu/aixeca/aixeca_basto.webp', amplada: 83, cru: true, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#6a4426', cabell: '#5a4636' }) },   // el mateix, alçant el bastó de pelegrí que li dona el Germà Aldreu
    { key: 'ineu_aixeca_buit', file: 'assets/ineu/aixeca/aixeca_buit.webp', amplada: 85, cru: true, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#6a4426', cabell: '#5a4636' }) },   // l'Ineu alçant el braç amb la mà buida i oberta: l'objecte rebut hi surt damunt per codi (ZonaBase.ineuRep)
    { key: 'ineu_aixeca_tiler', file: 'assets/ineu/aixeca/aixeca_tiler.webp', amplada: 96, cru: true, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#6a4426', cabell: '#5a4636' }) },   // ... i alçant la branca del Gran Til·ler
    { key: 'ineu_flauta', file: 'assets/ineu/tarota.webp', amplada: 65, cru: true },   // l'Ineu tocant la tarota, de cara a la càmera
    { key: 'ineu_tarota_gran', file: 'assets/ineu/tarota_gran.webp', amplada: 420, cru: true },   // primer pla de l'Ineu tocant la tarota (pantalla de la música)
    { key: 'tarota_ui', file: 'assets/ui/tarota.webp', amplada: 520, cru: true },                 // la tarota del pergamí inferior on es toquen les notes (js/musica.js)
    { key: 'arma_espasa', file: 'assets/armes/espasa.webp',      amplada: 28, provisional: (c, w) => dibuixarEspasaProvisional(c, w) },   // l'espasa de Runna
    { key: 'cartell_llums', file: 'assets/objectes/cartell_llums.webp', amplada: 560, cru: true },            // cartell de paper (es mostra tal com és, amb el fons blanc)
    { key: 'cartell_llums_petit', file: 'assets/objectes/cartell_llums_petit.webp', amplada: 56, cru: true },   // la mateixa imatge, nítida i petita, per a la paret (en examinar-lo es mostra la gran)
    { key: 'espurna',      file: null,      amplada: 32, provisional: (c, w) => dibuixarPuntSegell(c, w) }
];

// Retrats de qui parla als diàlegs (assets/retrats/<clau>.webp: de tres quarts, amb fons transparent; es fan amb eines/convertir_retrats.js).
// Els personatges que encara no en tenen fan servir el cap retallat del sprite (retratDe, a ui.js).
['ineu', 'pare_jorda', 'germa_aldreu', 'germa_franci', 'pare_daimiel', 'pare_alcovi', 'eve', 'senyor_budo', 'jusef', 'pomers', 'julius', 'galf', 'isilder', 'pianista', 'joaneta', 'iscu',
 'nena_trenes', 'venerables', 'carry', 'carmelia', 'pilaria', 'dolora', 'pastor_vell', 'pastor_a', 'pastor_b', 'tiller', 'pastor_boira', 'follet_carro', 'georgi_caseta', 'rosansa', 'meus', 'molner', 'ombra_monjo', 'mandu', 'mandu_trencada', 'nen_uri', 'nen_flam', 'nen_sardin', 'ocellaire', 'ocellaire_derrotat']
    .forEach(k => CATALEG.push({ key: 'retratimg_' + k, file: 'assets/retrats/' + k + '.webp', amplada: 170, cru: true }));

/**
 * SPRITES DE L'INEU: 8 direccions (assets/ineu/caminar/<direccio>.webp, fons transparent).
 * Cada fulla és una quadrícula 4x4 de 16 fotogrames de 256x256 (cicle de caminar); l'idle, igual (idle_<direccio>).
 * Els originals de AutoSprite són a art/ineu/v2/ i es converteixen amb eines/fer_ineu_v2.py.
 */
const DIRS_INEU = ['down', 'up', 'left', 'right', 'southwest', 'southeast', 'northwest', 'northeast'];
// Fulls de caminar i d'idle de l'Ineu (definitius): assets/ineu/caminar/<direccio>.webp i assets/ineu/idle/idle_<direccio>.webp, 16 fotogrames (4x4) a cada direcció, generats amb AutoSprite
// (eines/fer_ineu_v2.py). Esquerra i dreta són walk_elev_/idle_elev_ (eines/fer_ineu_v2_alt.py): l'idle dret és el mirall de l'esquerre i el caminar esquerre el mirall del dret.
// Les mides dels idles s'igualen a les dels caminars amb eines/igualar_idle_ineu.py. Els fulls i els prototips anteriors són a art/ineu/arxiu/.
const rutaIneu = (dir, idle) => {
    const v = '?v=2611142600';
    if (dir === 'left' || dir === 'right') return `assets/ineu/${idle ? 'idle/idle_elev_' : 'caminar/walk_elev_'}${dir}.webp${v}`;
    return `assets/ineu/${idle ? 'idle/idle_' : 'caminar/'}${dir}.webp${v}`;
};
const IDLE_INEU = {
    down: 'down', up: 'up', left: 'left', right: 'right',
    southwest: 'southwest', southeast: 'southeast', northwest: 'northwest', northeast: 'northeast'
};
const SPRITE_INEU = {
    ample: 256, alt: 256, peus: 240,
    alcada: 142,          // alçada del fotograma en píxels de joc (el personatge fa uns 125)
    fps: 14,
    fpsAturat: 6,          // l'idle té 16 fotogrames
    // Les vistes laterals tenen 16 fotogrames; mantenim una durada de cicle semblant a les altres vistes cardinals.
    fpsVista: { down: 16, up: 16, left: 16, right: 16, southwest: 16, southeast: 16, northwest: 16, northeast: 16 },
    // Cicle de caminar escurçat (amunt, avall i les quatre diagonals; esquerra i dreta ja eren correctes): el full té 16 fotogrames però el bucle del vídeo no tanca bé (a la costura del 15 al 0 el peu fa un petit retrocés).
    // Es fa servir només un tros de 7 fotogrames (una passa amb cada peu) que tanca net; el ritme de passes és el mateix que abans (~16 fotogrames a 16 fps).
    // Per tornar al cicle sencer: cicleCurt = false (no es toca cap full).
    cicleCurt: true,
    cicle: {
        down: { frames: [9, 10, 11, 12, 13, 14, 15], fps: 18.5 }, up: { frames: [9, 10, 11, 12, 13, 14, 15], fps: 18.5 },
        southwest: { frames: [9, 10, 11, 12, 13, 14, 15], fps: 18.5 }, southeast: { frames: [8, 9, 10, 11, 12, 13, 14], fps: 18.5 },
        northwest: { frames: [8, 9, 10, 11, 12, 13, 14], fps: 18.5 }, northeast: { frames: [8, 9, 10, 11, 12, 13, 14], fps: 18.5 }
    },
    quiet: 2,             // fotograma de repòs de cada direcció
    // Memòria: les fulles de l'Ineu es redueixen en carregar a cel·les de 192.
    // Totes les mides d'aquí (i les de l'arma, atac_arma.js) continuen en píxels de la cel·la de 256; on cal píxels de la
    // textura de veritat, es multiplica per k
    k: 0.75
};
/**
 * ATACS DE L'INEU: una fulla per direcció (assets/ineu/atac/atac_<direccio>.webp, 4x4 fotogrames de 256, fons transparent).
 * Surten de eines/convertir_atacs.js: ja estan normalitzades (mateixa escala per a totes les direccions, peus a SPRITE_INEU.peus) i
 * l'Ineu hi apareix sense arma. L'arma (bastó, branca del Til·ler o espasa) s'hi afegeix com una capa que segueix la mà
 * fotograma a fotograma (taula ATAC_ARMA a js/atac_arma.js).
 */
const ATAC_INEU = {
    fotogrames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],   // els 16 de la fulla: alçada, cop, posició i tornada
    fps: 40,                                                             // 16 fotogrames a 40 fps = 0,4 s (el mateix que abans amb 10 a 28)
    fpsVista: { up: 28 },                                                // 'up' té 8 fotogrames (+ 3 de transició) a 28 fps ≈ 0,39 s
    // Vistes que tenen menys fotogrames o només fan servir una part de la fulla ('up': fulla de 8 fotogrames, 0-7, de dreta a esquerra).
    perVista: { up: [0, 1, 2, 3, 4, 5, 6, 7] },
    // Fotogrames de transició (es fabriquen en carregar, amb canvas; no hi ha cap fitxer): entre l'últim fotograma de l'atac i l'Ineu quiet, una barreja d'un i altre
    // que va passant del primer al segon, per no fer un salt en acabar el cop. Número de fotogrames per vista; 0 o treure l'entrada = sense transició.
    transicio: {}
};
/**
 * ATACS PER ARMA (definitius): un full per arma i direcció, assets/ineu/atac/atac_<arma>_<direccio>.webp (eines/fer_atac_arma.py), amb l'Ineu ja portant l'arma (bastó,
 * branca del Til·ler o espasa de Runna) i el contorn d'1 px. Cel·les de ATAC_CEL px, 4 columnes, tants fotogrames com calguin (només el cop, sense preparació). Animació 'atac_<arma>_<vista>'.
 * (El sistema antic —full sense arma + capa de l'arma que segueix la mà, ATAC_ARMA a js/atac_arma.js— només es fa servir si falta algun full.)
 */
const ATAC_ARMES = ['basto', 'tiller', 'espasa'];
const ATAC_CEL = 320;
const ATAC_ARMA_FPS = { basto: 15, tiller: 16, espasa: 16 };
const ATAC_ARMA_N = { basto: 5, tiller: 5, espasa: 5 };           // fotogrames de cada full (la graella pot tenir cel·les buides al final)
function armaAtacNom(runna, agil) { return runna ? 'espasa' : agil ? 'tiller' : 'basto'; }
function fpsAtac(vista) {
    return (ATAC_INEU.fpsVista && ATAC_INEU.fpsVista[vista]) || ATAC_INEU.fps;
}
// Els fotogrames de l'animació d'atac d'una vista: { key, frame } (els de la fulla i, si n'hi ha, els de transició)
function fotogramesAtac(vista) {
    const llista = (ATAC_INEU.perVista[vista] || ATAC_INEU.fotogrames).map(f => ({ key: 'ineu_atac_' + vista, frame: f }));
    const n = (Grafics.transicionsFetes && Grafics.transicionsFetes[vista]) || 0;
    for (let i = 0; i < n; i++) llista.push({ key: 'ineu_atac_' + vista + '_trans', frame: i });
    return llista;
}
// Octants de moviment (angle en pantalla, y cap avall) -> direcció del sprite
// Fotograma de repòs de les vistes de caminar
function quietIneu() { return SPRITE_INEU.quiet; }
const OCTANTS_INEU = ['right', 'southeast', 'down', 'southwest', 'left', 'northwest', 'up', 'northeast'];

// Fulls d'idle frontal dels NPC (eines/fer_idle_npc.py): clau → mida de cel·la i nombre de fotogrames. Es carreguen amb la resta i ZonaBase.npc() els fa servir
// en lloc del dibuix fix; si no hi són, tot es veu com abans.
const NPC_IDLE = { joaneta: { w: 262, h: 304, n: 16, fps: 8 },
    pianista: { w: 286, h: 330, n: 16, fps: 10, fix: 'pianista_esquena', alFeina: 'notes' } };      // la Pianista toca l'orgue d'esquena (eines/fer_pianista_orgue.py): només s'anima quan toca (fix: dibuix fix d'esquena; alFeina: tipus de npcFeina que l'activa)          // la Joaneta prepara pocions (idle animat); la resta d'NPC fan l'idle per codi (ZonaBase.idleCodi)

const Grafics = {
    // Avís si el navegador no deixa llegir els píxels (obert amb doble clic, file://)
    pixelsBloquejats: false,
    faltants: [],

    // ---- CÀRREGA EN DUES PARTS ----
    // 'inici': només el que fan servir la portada i el pròleg (la pantalla de càrrega és curta). 'resta': tot el joc, en segon pla
    // mentre es veuen la portada i el pròleg (EscenaCarrega es queda viva fent-ho). Abans d'entrar a jugar, Joc.esperarRecursos.
    INICIALS: ['esglesia', 'monestir', 'boto_sarro', 'boto_consells'],
    esInicial(item) { return Grafics.INICIALS.includes(item.key); },

    carregar(scene, part = 'inici') {
        if (!scene.__escoltaErrors) {
            scene.__escoltaErrors = true;
            scene.load.on('loaderror', f => {
                Grafics.faltants.push(f.key);
                // Si no hi ha el PNG, provem el mateix nom en JPG (amb una clau a part)
                if (CATALEG.some(i => i.key === f.key) && /\.(png|webp)$/.test(f.url)) scene.load.image(f.key + '__jpg', f.url.replace(/\.(png|webp)$/, '.jpg'));
            });
        }
        CATALEG.filter(item => Grafics.esInicial(item) === (part === 'inici')).forEach(item => {
            if (item.file) scene.load.image(item.key, item.file);
            else if (!Grafics.faltants.includes(item.key)) Grafics.faltants.push(item.key);
        });
        if (part === 'inici') return;
        scene.load.spritesheet('visitant_zombi', 'assets/enemics/visitant_zombi.webp', { frameWidth: 127, frameHeight: 209 });      // el visitant (turista zombi) caminant, de cara (4x4 fotogrames): serveix per a totes les direccions
        scene.load.spritesheet('pallofa_cami', 'assets/personatges/pallofa_cami.webp', { frameWidth: 135, frameHeight: 140 });      // el Pallofa caminant cap a la dreta (4x4 fotogrames); es gira per anar cap a l'esquerra
        scene.load.spritesheet('pare_jorda_camina', 'assets/personatges/pare_jorda_camina.webp', { frameWidth: 200, frameHeight: 290 });
        // Fulls d'animació del Pastor de Boira (boss de la Cirosa): quadrícula de fotogrames de 300 x 300; si no hi són, es veu el dibuix fix (vegeu docs/PROMPTS_GRAFICS.md)
        Object.keys(Grafics.PASTOR_FULLS).forEach(n => scene.load.spritesheet('pastor_' + n, `assets/enemics/pastor_${n}.webp`, { frameWidth: 300, frameHeight: 300 }));
        scene.load.spritesheet('home_raim_camina', 'assets/enemics/home_raim_camina.webp?v=2611131800', { frameWidth: 331, frameHeight: 502 });      // el Home del Raïm caminant (4 poses clau, cap a la dreta; es gira amb flipX)
        Object.entries(NPC_IDLE).forEach(([k, d]) => scene.load.spritesheet(k + '_idle', `assets/personatges/${k}_idle.webp?v=2611122055`, { frameWidth: d.w, frameHeight: d.h }));
        scene.load.spritesheet('germa_aldreu_camina', 'assets/personatges/germa_aldreu_camina.webp', { frameWidth: 180, frameHeight: 265 });
        scene.load.spritesheet('germa_aldreu_ne', 'assets/personatges/germa_aldreu_ne.webp', { frameWidth: 180, frameHeight: 265 });
        scene.load.spritesheet('jusef_camina', 'assets/personatges/jusef_camina.webp', { frameWidth: 190, frameHeight: 300 });
        scene.load.spritesheet('isilder_camina', 'assets/personatges/isilder_camina.webp', { frameWidth: 190, frameHeight: 285 });
        scene.load.spritesheet('venerables_camina', 'assets/personatges/venerables_camina.webp', { frameWidth: 266, frameHeight: 267 });       // (fer_camina_npc.py: les dues velletes agafades del braç)
        scene.load.spritesheet('mandu_camina', 'assets/personatges/mandu_camina.webp', { frameWidth: 134, frameHeight: 236 });
        DIRS_INEU.forEach(dir => {
            const mida = { frameWidth: SPRITE_INEU.ample, frameHeight: SPRITE_INEU.alt };
            scene.load.spritesheet('ineu_' + dir, rutaIneu(dir, false), mida);
            ATAC_ARMES.forEach(arma => scene.load.spritesheet(`ineu_atac_${arma}_${dir}`, `assets/ineu/atac/atac_${arma}_${dir}.webp?v=2611121800`, { frameWidth: ATAC_CEL, frameHeight: ATAC_CEL }));
        });
        [...new Set(Object.values(IDLE_INEU))].forEach(dir => {
            const mida = { frameWidth: SPRITE_INEU.ample, frameHeight: SPRITE_INEU.alt };
            scene.load.spritesheet('ineu_idle_' + dir, rutaIneu(dir, true), mida);
        });
    },

    // ---- MEMÒRIA ----
    // Un fons gran descodificat ocupa 10-16 MB (i la mateixa quantitat a la targeta gràfica). Tots junts passaven dels 300 MB i el mòbil
    // tancava la pestanya (el joc "es reiniciava"). Les textures grans es construeixen la primera vegada que algú les demana
    // (textures.get) i, en entrar a una zona, s'alliberen les que aquella zona no ha fet servir.
    perezosos: {},          // clau → { construir(tm) }
    usos: {},               // clau → època de l'última petició
    epoca: 0,               // puja cada cop que s'entra a una zona
    ocupat: false,          // mentre és true, els ganxos no fan res (les pròpies operacions no s'han de reconstruir)
    MIDA_GRAN: 1.1 * 1048576,          // (les rajoles de terra, d'1 MB, que fan servir gairebé totes les zones, es queden sempre fetes)

    fesPerezos(tm, item, img) {
        const cru = item.cru || /\.webp$/.test(item.file);       // els WebP ja venen nets i retallats (eines/convertir_webp.js)
        Grafics.ocupat = true;
        try { if (tm.list[item.key]) tm.remove(item.key); } finally { Grafics.ocupat = false; }
        Grafics.perezosos[item.key] = { construir: t => {
            t.addImage(item.key, img);
            if (cru) t.list[item.key].customData.escala = item.amplada / img.width;
            else Grafics.netejarPNG({ textures: t }, item);
        } };
    },

    // Un TileSprite fa un llenç de la seva mida que, amb WebGL, no es fa servir mai (dibuixa el patró amb fillPattern): però ocupa
    // memòria (Safari la compta tota). Amb WebGL, el llenç es queda d'1x1.
    instalarTileSpriteLleuger() {
        const TS = Phaser.GameObjects.TileSprite.prototype;
        if (TS.__lleuger) return;
        TS.__lleuger = true;
        const orig = TS.updateCanvas;
        TS.updateCanvas = function () {
            if (!(this.renderer && this.renderer.gl)) return orig.call(this);
            if (this.canvas.width !== 1 || this.canvas.height !== 1) {
                this.canvas.width = 1; this.canvas.height = 1;
                if (this.texture && this.texture.refresh) this.texture.refresh();
            }
            this.dirty = false;
        };
    },

    instalarPerezosos() {
        const TM = Phaser.Textures.TextureManager.prototype;
        if (TM.__perezosos) return;
        TM.__perezosos = true;
        const get = TM.get, exists = TM.exists, getFrame = TM.getFrame;
        TM.get = function (key) {
            if (!Grafics.ocupat && Grafics.perezosos[key]) {
                Grafics.usos[key] = Grafics.epoca;
                if (!this.list[key]) Grafics.construir(this, key);
            }
            return get.apply(this, arguments);
        };
        TM.exists = function (key) { return (!Grafics.ocupat && !!Grafics.perezosos[key]) || exists.apply(this, arguments); };
        TM.getFrame = function (key) {
            if (!Grafics.ocupat && Grafics.perezosos[key]) this.get(key);
            return getFrame.apply(this, arguments);
        };
    },

    construir(tm, key) {
        Grafics.ocupat = true;
        try { Grafics.perezosos[key].construir(tm); } finally { Grafics.ocupat = false; }
    },

    // Treu una textura de la memòria (i buida el seu canvas perquè el navegador recuperi la memòria de seguida)
    descarta(tm, key) {
        const t = tm.list[key];
        if (!t) return;
        const src = t.source && t.source[0], cv = src && src.isCanvas ? src.image : null;
        Grafics.ocupat = true;
        try { tm.remove(key); } finally { Grafics.ocupat = false; }
        if (cv) { cv.width = 0; cv.height = 0; }
    },

    // En entrar a una zona (ja construïda): fora les textures grans que no ha demanat, i els camins de les altres zones
    alliberar(tm, zona) {
        Object.keys(tm.list).forEach(k => {
            if (Grafics.perezosos[k] && Grafics.usos[k] !== Grafics.epoca) Grafics.descarta(tm, k);
            else if (k.startsWith('camins_') && !k.startsWith('camins_' + zona + '_')) Grafics.descarta(tm, k);
        });
    },

    // Processa els PNG carregats i crea marcadors/textures generades. 'inici': els inicials i les textures de codi; 'resta': la resta,
    // a trossos de pocs mil·lisegons per fotograma perquè la portada i el pròleg no s'encallin, i en acabar crida fet()
    preparar(scene, part = 'inici', fet) {
        if (part === 'inici') {
            CATALEG.filter(item => Grafics.esInicial(item)).forEach(item => Grafics.prepararItem(scene, item));
            Grafics.texturesGenerades(scene);
            Grafics.instalarPerezosos();
            Grafics.instalarTileSpriteLleuger();
            return;
        }
        const items = CATALEG.filter(item => !Grafics.esInicial(item));
        let k = 0;
        const tros = () => {
            const t0 = performance.now();
            while (k < items.length && performance.now() - t0 < 10) Grafics.prepararItem(scene, items[k++]);
            if (k < items.length) { scene.time.delayedCall(0, tros); return; }
            Grafics.reduirIneu(scene);
            Grafics.fabricarTransicions(scene);
            Grafics.atacsArma = {};
            ATAC_ARMES.forEach(arma => { Grafics.atacsArma[arma] = new Set(DIRS_INEU.filter(d => scene.textures.exists(`ineu_atac_${arma}_${d}`) && !Grafics.faltants.includes(`ineu_atac_${arma}_${d}`))); });
            Grafics.animacions(scene);
            if (fet) fet();
        };
        tros();
    },

    // Un element del catàleg ja carregat (o que no s'ha pogut carregar: el dibuix provisional)
    prepararItem(scene, item) {
        // Gràfic carregat com a JPG: passa a ser el gràfic oficial
        if (scene.textures.exists(item.key + '__jpg')) {
            if (scene.textures.exists(item.key)) scene.textures.remove(item.key);
            scene.textures.renameTexture(item.key + '__jpg', item.key);
            Grafics.faltants = Grafics.faltants.filter(k => k !== item.key);
        }
        const existeix = scene.textures.exists(item.key) && !Grafics.faltants.includes(item.key);
        if (existeix && !item.fotogrames) {                  // les imatges grans només es construeixen quan una zona les fa servir
            const img = scene.textures.get(item.key).getSourceImage();
            if (img.width * img.height * 4 >= Grafics.MIDA_GRAN) { Grafics.fesPerezos(scene.textures, item, img); return; }
        }
        if (existeix && item.cru) scene.textures.get(item.key).customData.escala = item.amplada / scene.textures.get(item.key).getSourceImage().width;      // sense treure el fons
        else if (existeix) Grafics.netejarPNG(scene, item);
        else if (item.amplada * RES >= 1400) {                // marcador gran (l'art encara no hi és): també a demanda
            Grafics.perezosos[item.key] = { construir: t => Grafics.crearProvisional({ textures: t }, item) };
            Grafics.ocupat = true; try { if (scene.textures.list[item.key]) scene.textures.remove(item.key); } finally { Grafics.ocupat = false; }
        } else {
            Grafics.crearProvisional(scene, item);
            // Si el dibuix ha sortit gran, també a demanda (es tornarà a dibuixar quan una zona el demani)
            const t = scene.textures.list[item.key], src = t && t.source[0];
            if (src && src.width * src.height * 4 >= Grafics.MIDA_GRAN) {
                Grafics.perezosos[item.key] = { construir: tm => Grafics.crearProvisional({ textures: tm }, item) };
                Grafics.descarta(scene.textures, item.key);
            }
        }
    },

    // Redueix les fulles de l'Ineu a SPRITE_INEU.k (vegeu SPRITE_INEU).
    reduirIneu(scene) {
        const tm = scene.textures, k = SPRITE_INEU.k, CEL = SPRITE_INEU.ample, C2 = Math.round(CEL * k);
        const claus = DIRS_INEU.map(dir => 'ineu_' + dir);
        [...new Set(Object.values(IDLE_INEU))].forEach(dir => claus.push('ineu_idle_' + dir));
        claus.forEach(clau => {
            if (!tm.exists(clau) || Grafics.faltants.includes(clau)) return;
            const font = tm.get(clau).getSourceImage(), cols = Math.round(font.width / CEL), files = Math.round(font.height / CEL);
            if (font.width !== cols * CEL) return; // ja reduïda, o d'una altra mida
            const cv = document.createElement('canvas');
            cv.width = cols * C2; cv.height = files * C2;
            const c = cv.getContext('2d');
            c.imageSmoothingQuality = 'high';
            c.drawImage(font, 0, 0, cv.width, cv.height);
            tm.remove(clau);
            if (font instanceof HTMLCanvasElement) { font.width = 0; font.height = 0; }
            const t = tm.addCanvas(clau, cv);
            for (let i = 0; i < cols * files; i++) t.add(i, 0, (i % cols) * C2, Math.floor(i / cols) * C2, C2, C2);
        });
    },

    // Fotogrames de transició de l'atac (ATAC_INEU.transicio): una barreja de l'últim fotograma de l'atac i de l'Ineu quiet (el primer de l'idle), amb els centres
    // dels dos cossos anant d'un a l'altre. Només es mouen i s'esvaeixen píxels (res no es deforma). Si el navegador no deixa llegir els píxels, no se'n fan.
    transicionsFetes: {},
    fabricarTransicions(scene) {
        const tm = scene.textures, C2 = Math.round(SPRITE_INEU.ample * SPRITE_INEU.k);
        Object.entries(ATAC_INEU.transicio || {}).forEach(([vista, n]) => {
            const kA = 'ineu_atac_' + vista, kB = 'ineu_idle_' + IDLE_INEU[vista], kT = kA + '_trans';
            if (!n || tm.exists(kT) || !tm.exists(kA) || !tm.exists(kB) || Grafics.faltants.includes(kA) || Grafics.faltants.includes(kB)) return;
            try {
                const ult = (ATAC_INEU.perVista[vista] || ATAC_INEU.fotogrames).slice(-1)[0];
                const llegeix = (clau, frame) => {
                    const t = tm.get(clau), f = t.get(frame), cv = document.createElement('canvas');
                    cv.width = cv.height = C2;
                    const c = cv.getContext('2d', { willReadFrequently: true });
                    c.drawImage(t.getSourceImage(), f.cutX, f.cutY, f.cutWidth, f.cutHeight, 0, 0, C2, C2);
                    return c.getImageData(0, 0, C2, C2).data;
                };
                const A = llegeix(kA, ult), B = llegeix(kB, 0);
                const centre = d => { let sx = 0, sa = 0; for (let y = 0; y < C2; y++) for (let x = 0; x < C2; x++) { const a = d[(y * C2 + x) * 4 + 3]; sx += x * a; sa += a; } return sa ? sx / sa : C2 / 2; };
                const cA = centre(A), cB = centre(B), m = (cA + cB) / 2;
                const cv = document.createElement('canvas');
                cv.width = n * C2; cv.height = C2;
                const c = cv.getContext('2d');
                for (let i = 0; i < n; i++) {
                    const w = (i + 1) / (n + 1);                                                // 0 = l'atac, 1 = l'Ineu quiet
                    const dA = Math.round((cA + (cB - cA) * w) - cA), dB = Math.round((cA + (cB - cA) * w) - cB);          // el centre de cada cos va cap al punt intermedi
                    const img = c.createImageData(C2, C2), o = img.data;
                    for (let y = 0; y < C2; y++) for (let x = 0; x < C2; x++) {
                        const xa = x - dA, xb = x - dB;
                        let ra = 0, ga = 0, ba = 0, aa = 0, rb = 0, gb = 0, bb = 0, ab = 0;
                        if (xa >= 0 && xa < C2) { const j = (y * C2 + xa) * 4; aa = A[j + 3] / 255; ra = A[j] * aa; ga = A[j + 1] * aa; ba = A[j + 2] * aa; }
                        if (xb >= 0 && xb < C2) { const j = (y * C2 + xb) * 4; ab = B[j + 3] / 255; rb = B[j] * ab; gb = B[j + 1] * ab; bb = B[j + 2] * ab; }
                        const a = aa * (1 - w) + ab * w, k = (y * C2 + x) * 4;
                        if (a > 0.003) { o[k] = (ra * (1 - w) + rb * w) / a; o[k + 1] = (ga * (1 - w) + gb * w) / a; o[k + 2] = (ba * (1 - w) + bb * w) / a; o[k + 3] = a * 255; }
                    }
                    c.putImageData(img, i * C2, 0);
                }
                const t = tm.addCanvas(kT, cv);
                for (let i = 0; i < n; i++) t.add(i, 0, i * C2, 0, C2, C2);
                Grafics.transicionsFetes[vista] = n;
            } catch (e) { /* sense píxels (file://): l'atac acaba sense transició */ }
        });
    },

    // Animacions de caminar de l'Ineu (són globals: es creen una sola vegada)
    // Gràfics del Pastor de Boira: nom -> [fotogrames, fotogrames per segon, repeticions (-1 = en bucle)]
    PASTOR_FULLS: { camina: [8, 10, -1] },        // camina: full de 8 fotogrames (les poses d'atac, derrota... són imatges soltes del catàleg: pastor_ataca, pastor_derrota...)

    animacions(scene) {
        if (scene.textures.exists('pastor_camina') && !scene.anims.exists('pastor_camina')) {
            const DIRS_PASTOR = [
                ['nw', 0], ['w', 8], ['sw', 16], ['n', 24],
                ['e', 32], ['s', 40], ['ne', 48], ['se', 56]
            ];
            DIRS_PASTOR.forEach(([d, start]) => {
                scene.anims.create({
                    key: 'pastor_camina_' + d,
                    frames: scene.anims.generateFrameNumbers('pastor_camina', { start, end: start + 7 }),
                    frameRate: 10,
                    repeat: -1
                });
            });
            scene.anims.create({
                key: 'pastor_camina',
                frames: scene.anims.generateFrameNumbers('pastor_camina', { start: 32, end: 39 }),
                frameRate: 10,
                repeat: -1
            });
        }
        Object.entries(Grafics.PASTOR_FULLS).forEach(([n, [fr, fps, rep]]) => {
            const k = 'pastor_' + n;
            if (fr > 1 && !scene.anims.exists(k) && scene.textures.exists(k) && !Grafics.faltants.includes(k) && scene.textures.get(k).frameTotal > fr)
                scene.anims.create({ key: k, frames: scene.anims.generateFrameNumbers(k, { start: 0, end: fr - 1 }), frameRate: fps, repeat: rep });
        });
        // L'escolopendra caminant (ondula el cos i les potes)
        if (!scene.anims.exists('cempeus') && scene.textures.get('escolopendra').has(0)) {
            scene.anims.create({ key: 'cempeus', frames: scene.anims.generateFrameNumbers('escolopendra', { start: 0, end: 7 }), frameRate: 16, repeat: -1 });
        }
        // El visitant (turista trastocat per la boira): cicle de caminar de 16 fotogrames, el mateix per a totes les direccions
        if (!scene.anims.exists('visitant_camina') && scene.textures.exists('visitant_zombi') && scene.textures.get('visitant_zombi').frameTotal > 2) {
            scene.anims.create({ key: 'visitant_camina', frames: scene.anims.generateFrameNumbers('visitant_zombi', { start: 0, end: 15 }), frameRate: 13, repeat: -1 });
        }
        if (!scene.anims.exists('pare_jorda_camina') && scene.textures.exists('pare_jorda_camina')) {
            scene.anims.create({ key: 'pare_jorda_camina', frames: scene.anims.generateFrameNumbers('pare_jorda_camina', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
        }
        if (!scene.anims.exists('germa_aldreu_camina') && scene.textures.exists('germa_aldreu_camina')) {
            scene.anims.create({ key: 'germa_aldreu_camina', frames: scene.anims.generateFrameNumbers('germa_aldreu_camina', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
        }
        if (!scene.anims.exists('germa_aldreu_ne') && scene.textures.exists('germa_aldreu_ne')) {
            scene.anims.create({ key: 'germa_aldreu_ne', frames: scene.anims.generateFrameNumbers('germa_aldreu_ne', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
        }
        if (!scene.anims.exists('jusef_camina') && scene.textures.exists('jusef_camina')) {
            scene.anims.create({ key: 'jusef_camina', frames: scene.anims.generateFrameNumbers('jusef_camina', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
        }
        if (!scene.anims.exists('venerables_camina') && scene.textures.exists('venerables_camina')) {
            scene.anims.create({ key: 'venerables_camina', frames: scene.anims.generateFrameNumbers('venerables_camina', { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
        }
        if (!scene.anims.exists('mandu_camina') && scene.textures.exists('mandu_camina')) {
            scene.anims.create({ key: 'mandu_camina', frames: scene.anims.generateFrameNumbers('mandu_camina', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
        }
        if (!scene.anims.exists('isilder_camina') && scene.textures.exists('isilder_camina')) {
            scene.anims.create({ key: 'isilder_camina', frames: scene.anims.generateFrameNumbers('isilder_camina', { start: 0, end: 15 }), frameRate: 12, repeat: -1 });
        }
        ATAC_ARMES.forEach(arma => ((Grafics.atacsArma && Grafics.atacsArma[arma]) || []).forEach(dir => {
            const key = `atac_${arma}_${dir}`, tex = `ineu_atac_${arma}_${dir}`;
            if (scene.anims.exists(key)) scene.anims.remove(key);
            scene.anims.create({
                key,
                frames: scene.anims.generateFrameNumbers(tex, { start: 0, end: ATAC_ARMA_N[arma] - 1 }),
                frameRate: ATAC_ARMA_FPS[arma],
                repeat: 0
            });
        }));
        DIRS_INEU.forEach(dir => {
            const key = 'caminar_' + dir;
            if (scene.anims.exists(key) || !scene.textures.exists('ineu_' + dir)) return;
            const fotogrames = scene.textures.get('ineu_' + dir).frameTotal - 1;
            const curt = SPRITE_INEU.cicleCurt && SPRITE_INEU.cicle[dir];
            scene.anims.create({
                key,
                frames: curt ? scene.anims.generateFrameNumbers('ineu_' + dir, { frames: curt.frames }) : scene.anims.generateFrameNumbers('ineu_' + dir, { start: 0, end: fotogrames - 1 }),
                frameRate: curt ? curt.fps : (SPRITE_INEU.fpsVista[dir] || SPRITE_INEU.fps),
                repeat: -1
            });
        });
        DIRS_INEU.forEach(dir => {
            const key = 'aturat_' + dir, textura = 'ineu_idle_' + IDLE_INEU[dir];
            if (scene.anims.exists(key) || !scene.textures.exists(textura)) return;
            scene.anims.create({
                key,
                frames: scene.anims.generateFrameNumbers(textura, { start: 0, end: scene.textures.get(textura).frameTotal - 2 }),
                frameRate: SPRITE_INEU.fpsAturat,
                repeat: -1
            });
        });
    },

    netejarPNG(scene, item) {
        const font = scene.textures.get(item.key).getSourceImage();
        // Retallem les vores transparents/blanques: "amplada" és l'amplada del que es veu de debò
        const r = Grafics.capsa(font);
        const escala = Math.min(1, (item.amplada * RES) / r.w);
        const w = Math.round(r.w * escala);
        const h = Math.round(r.h * escala);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(font, r.x, r.y, r.w, r.h, 0, 0, w, h);
        try {
            const img = ctx.getImageData(0, 0, w, h);
            treureFonsBlanc(img.data, w, h);
            ctx.putImageData(img, 0, 0);
        } catch (e) {
            Grafics.pixelsBloquejats = true; // es veurà amb fons blanc, però el joc continua
        }
        scene.textures.remove(item.key);
        scene.textures.addCanvas(item.key, canvas);
        // Escala que cal aplicar a la imatge per mostrar-la a "amplada" píxels de joc
        scene.textures.get(item.key).customData.escala = item.amplada / w;
    },

    // Rectangle de la imatge que té contingut (en píxels de la font)
    capsa(font) {
        const tot = { x: 0, y: 0, w: font.width, h: font.height };
        try {
            const f = Math.min(1, 400 / font.width);
            const w = Math.max(1, Math.round(font.width * f)), h = Math.max(1, Math.round(font.height * f));
            const c = document.createElement('canvas');
            c.width = w; c.height = h;
            const ctx = c.getContext('2d', { willReadFrequently: true });
            ctx.drawImage(font, 0, 0, w, h);
            const img = ctx.getImageData(0, 0, w, h);
            treureFonsBlanc(img.data, w, h);
            let x0 = w, y0 = h, x1 = -1, y1 = -1;
            for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
                if (img.data[(y * w + x) * 4 + 3] > 24) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
            }
            if (x1 < 0) return tot;
            const m = 2; // un petit marge
            x0 = Math.max(0, x0 - m); y0 = Math.max(0, y0 - m); x1 = Math.min(w - 1, x1 + m); y1 = Math.min(h - 1, y1 + m);
            return { x: Math.floor(x0 / f), y: Math.floor(y0 / f), w: Math.min(font.width, Math.ceil((x1 - x0 + 1) / f)), h: Math.min(font.height, Math.ceil((y1 - y0 + 1) / f)) };
        } catch (e) {
            return tot;
        }
    },

    crearProvisional(scene, item) {
        const w = item.amplada * RES;
        const canvas = document.createElement('canvas');
        if (item.provisional) {
            item.provisional(canvas, w);
        } else {
            canvas.width = w; canvas.height = w;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#a07050';
            ctx.fillRect(0, 0, w, w);
        }
        if (scene.textures.exists(item.key)) scene.textures.remove(item.key);
        scene.textures.addCanvas(item.key, canvas);
        const tex = scene.textures.get(item.key);
        tex.customData.escala = 1 / RES;
        // Fulls d'animació: fotogrames 0..n-1 en una fila, de l'amplada de l'element
        if (item.fotogrames) for (let i = 0; i < item.fotogrames; i++) tex.add(i, 0, i * w, 0, w, canvas.height);
    },

    // Textures que sempre es generen per codi (terra, boira, etc.)
    texturesGenerades(scene) {
        const crea = (key, w, h, dibuix) => {
            const construir = tm => {
                const canvas = document.createElement('canvas');
                canvas.width = w * RES; canvas.height = h * RES;
                const ctx = canvas.getContext('2d');
                ctx.scale(RES, RES);
                dibuix(ctx, w, h);
                tm.addCanvas(key, canvas);
                tm.list[key].customData.escala = 1 / RES;
            };
            if (w * h * RES * RES * 4 >= Grafics.MIDA_GRAN) {       // gran: es dibuixa quan una zona (o el pròleg) la demana
                Grafics.ocupat = true;
                try { if (scene.textures.list[key]) scene.textures.remove(key); } finally { Grafics.ocupat = false; }
                Grafics.perezosos[key] = { construir };
                return;
            }
            if (scene.textures.exists(key)) scene.textures.remove(key);
            construir(scene.textures);
        };

        crea('herba', 256, 256, (ctx, w, h) => textureHerba(ctx, w, h, PALETA_HERBA, 11));
        crea('llamborda', 256, 256, (ctx, w, h) => textureLloses(ctx, w, h, PALETA_LLAMBORDA, 5));
        crea('cami', 64, 64, (ctx, w, h) => {
            soroll(ctx, w, h, '#b89b6d', ['#a88b5d', '#c4a97c', '#9e8255'], 70, 1.5, 3);
            // Terra batuda: algunes pedretes clares i fosques escampades
            let llavor = 23;
            const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
            for (let i = 0; i < 22; i++) {
                ctx.fillStyle = i % 3 ? 'rgba(232,214,170,0.55)' : 'rgba(84,62,36,0.38)';
                ctx.beginPath(); ctx.ellipse(rnd() * w, rnd() * h, 0.8 + rnd() * 1.3, 0.6 + rnd() * 0.7, rnd() * 3, 0, Math.PI * 2); ctx.fill();
            }
        });
        crea('pedra', 256, 256, (ctx, w, h) => textureLloses(ctx, w, h, PALETA_PEDRA, 9));
        crea('herba_fosca', 256, 256, (ctx, w, h) => textureHerba(ctx, w, h, PALETA_HERBA_FOSCA, 23));
        crea('rajola', 64, 64, (ctx, w, h) => {
            ctx.fillStyle = '#4a4038'; ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#5a4e44'; ctx.fillRect(1, 1, 30, 30); ctx.fillRect(33, 33, 30, 30);
            ctx.fillStyle = '#524740'; ctx.fillRect(33, 1, 30, 30); ctx.fillRect(1, 33, 30, 30);
        });
        crea('ciment', 256, 256, pintarCiment);
        crea('mur_pedra', 256, 128, pintarMurPedra);
        crea('boira', 64, 64, (ctx, w, h) => {
            const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
            g.addColorStop(0, 'rgba(70,35,100,0.9)');
            g.addColorStop(0.5, 'rgba(50,25,80,0.45)');
            g.addColorStop(1, 'rgba(30,15,50,0)');
            ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
        });
        // Una bufada de fum blanc (vapor del carruatge del Follet): un núvol rodó i tou, blanc amb una ombra grisa-blavosa a sota; sempre blanc, no té res a veure amb la boira lila
        crea('fum', 64, 64, (ctx, w, h) => {
            const bola = (x, y, r, a, c0, c1) => { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${c0},${a})`); g.addColorStop(0.65, `rgba(${c1},${a * 0.7})`); g.addColorStop(1, `rgba(${c1},0)`); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); };
            bola(32, 40, 24, 0.55, '205,212,222', '190,198,210');      // ombra de sota
            [[32, 32, 22], [20, 36, 16], [44, 36, 16], [26, 24, 15], [40, 25, 14]].forEach(([x, y, r]) => bola(x, y, r, 0.95, '255,255,255', '244,247,250'));
        });
        // Un núvol de boira (blanc, per tintar-lo): moltes taques suaus encavalcades, de vora irregular. Serveix per a les parets de boira (ZonaBase.boiraParet)
        crea('boira_nuvol', 256, 256, (ctx, w, h) => {
            let s = 17; const r = () => (s = s * 16807 % 2147483647) / 2147483647;
            const taca = (x, y, rad, a) => { const g = ctx.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, `rgba(255,255,255,${a})`); g.addColorStop(0.65, `rgba(255,255,255,${a * 0.62})`); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2); };
            taca(128, 128, 126, 0.3);
            for (let k = 0; k < 18; k++) taca(128 + (r() - 0.5) * 130, 128 + (r() - 0.5) * 96, 30 + r() * 40, 0.4 + r() * 0.35);
        });
        // Una fulla d'heura (blanca, per tintar-la de verd): tres lòbuls punxeguts i les nervadures. Serveix per a la coberta de la pèrgola de l'Hostatgeria
        crea('fulla_heura', 96, 96, (ctx, w, h) => {
            ctx.translate(48, 48);
            const f = (sx, sy) => ctx.bezierCurveTo(sx[0], sx[1], sy[0], sy[1], sy[2], sy[3]);
            ctx.beginPath(); ctx.moveTo(0, 40);                                            // la punta de baix (on s'uneix al peu)
            f([-6, 30], [-40, 30, -38, 8]); f([-44, -4], [-30, -4, -26, -10]);                // lòbul esquerre
            f([-30, -24], [-14, -24, -6, -30]); f([-4, -42], [0, -46, 0, -46]);                // el lòbul de dalt, punxegut
            f([0, -46], [4, -42, 6, -30]); f([14, -24], [30, -24, 26, -10]);
            f([30, -4], [44, -4, 38, 8]); f([40, 30], [6, 30, 0, 40]);                         // lòbul dret
            ctx.closePath();
            const g = ctx.createRadialGradient(0, 0, 4, 0, 0, 46); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(235,235,235,0.9)');
            ctx.fillStyle = g; ctx.fill();
            ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(40,70,30,0.6)'; ctx.stroke();
            ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(40,70,30,0.45)';                      // nervadures
            ctx.beginPath(); ctx.moveTo(0, 38); ctx.lineTo(0, -40);
            ctx.moveTo(0, 20); ctx.lineTo(-30, 6); ctx.moveTo(0, 20); ctx.lineTo(30, 6);
            ctx.moveTo(0, 4); ctx.lineTo(-22, -10); ctx.moveTo(0, 4); ctx.lineTo(22, -10); ctx.stroke();
        });
        crea('ombra', 64, 24, (ctx, w, h) => {
            ctx.fillStyle = 'rgba(0,0,0,0.28)';
            ctx.beginPath(); ctx.ellipse(32, 12, 30, 10, 0, 0, Math.PI * 2); ctx.fill();
        });
        crea('reixa', 48, 28, (ctx, w, h) => {
            ctx.fillStyle = '#2b2622'; ctx.fillRect(0, 0, w, h);
            ctx.strokeStyle = '#6b625a'; ctx.lineWidth = 3;
            ctx.strokeRect(1.5, 1.5, w - 3, h - 3);
            for (let x = 8; x < w; x += 8) { ctx.beginPath(); ctx.moveTo(x, 2); ctx.lineTo(x, h - 2); ctx.stroke(); }
        });
        // Cartell de fusta: un sol panell llis clavat en un pal, amb línies d'escriptura que no diuen res (serveix per a tots els cartells)
        crea('cartell', 76, 86, (ctx, w, h) => {
            ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.beginPath(); ctx.ellipse(38, 82, 20, 5, 0, 0, Math.PI * 2); ctx.fill();
            // Pal: un tronc ras que puja fins darrere el panell
            const post = ctx.createLinearGradient(31, 0, 46, 0);
            post.addColorStop(0, '#6a4020'); post.addColorStop(0.45, '#a46e38'); post.addColorStop(1, '#5e3a1c');
            ctx.fillStyle = post; ctx.strokeStyle = '#2e1a0a'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(32, 80); ctx.lineTo(31.5, 40); ctx.lineTo(45.5, 40); ctx.lineTo(46, 80); ctx.quadraticCurveTo(38.5, 84, 32, 80); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.strokeStyle = 'rgba(46,26,10,0.45)'; ctx.lineWidth = 1;
            for (let y = 52; y < 78; y += 9) { ctx.beginPath(); ctx.moveTo(36, y); ctx.lineTo(37, y + 5); ctx.moveTo(42, y + 3); ctx.lineTo(41, y + 8); ctx.stroke(); }
            // Panell llis: una sola peça de fusta amb la veta, les vores gastades i un nus
            const px = 3, py = 4, pw = 70, ph = 44;
            const fusta = ctx.createLinearGradient(0, py, 0, py + ph);
            fusta.addColorStop(0, '#d29d5a'); fusta.addColorStop(0.5, '#bf8848'); fusta.addColorStop(1, '#94602c');
            ctx.fillStyle = fusta; ctx.strokeStyle = '#2e1a0a'; ctx.lineWidth = 2.2;
            ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 4); ctx.fill(); ctx.stroke();
            ctx.save(); ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 4); ctx.clip();
            ctx.strokeStyle = 'rgba(86,48,16,0.28)'; ctx.lineWidth = 1;
            [9, 17, 25, 33, 40].forEach((vy, i) => { ctx.beginPath(); ctx.moveTo(px, py + vy); ctx.bezierCurveTo(px + 20, py + vy - 2 + i % 2 * 3, px + 44, py + vy + 2 - i % 2 * 3, px + pw, py + vy + 1); ctx.stroke(); });
            ctx.fillStyle = 'rgba(86,48,16,0.35)'; ctx.beginPath(); ctx.ellipse(60, 38, 3.2, 2.2, 0.3, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = 'rgba(86,48,16,0.4)'; ctx.beginPath(); ctx.ellipse(60, 38, 5.4, 3.6, 0.3, 0, Math.PI * 2); ctx.stroke();
            ctx.fillStyle = 'rgba(255,236,190,0.4)'; ctx.fillRect(px + 3, py + 2, pw - 6, 2);                    // llum de la vora de dalt
            ctx.fillStyle = 'rgba(40,20,6,0.25)'; ctx.fillRect(px, py + ph - 4, pw, 4);                           // ombra de la vora de baix
            ctx.restore();
            // Línies escrites que no volen dir res: paraules fetes de traços i uns quants símbols
            let llavor = 5;
            const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
            ctx.strokeStyle = 'rgba(54,28,8,0.82)'; ctx.fillStyle = 'rgba(54,28,8,0.82)'; ctx.lineWidth = 1.7;
            [[15, 60], [24, 55], [33, 43]].forEach(([ly, fins], fila) => {
                let x = 11;
                while (x < fins) {
                    const llarg = Math.min(fins - x, 6 + rnd() * 11);
                    if (rnd() < 0.2) {                                                                                 // un símbol en lloc d'una paraula
                        const t = Math.floor(rnd() * 3);
                        ctx.beginPath();
                        if (t === 0) ctx.arc(x + 3, ly, 2.6, 0, Math.PI * 2);
                        else if (t === 1) { ctx.moveTo(x, ly + 3); ctx.lineTo(x + 3, ly - 3); ctx.lineTo(x + 6, ly + 3); }
                        else { ctx.moveTo(x, ly - 3); ctx.lineTo(x + 5, ly + 3); ctx.moveTo(x + 5, ly - 3); ctx.lineTo(x, ly + 3); }
                        ctx.stroke(); x += 9;
                        continue;
                    }
                    ctx.beginPath(); ctx.moveTo(x, ly); ctx.lineTo(x + llarg, ly + (rnd() - 0.5) * 0.8); ctx.stroke();
                    for (let k = x + 2; k < x + llarg - 1; k += 3 + rnd() * 2) { ctx.beginPath(); ctx.moveTo(k, ly); ctx.lineTo(k, ly - 1.5 - rnd() * 2.6); ctx.stroke(); }
                    x += llarg + 4.5;
                }
            });
            // Claus
            ctx.fillStyle = '#3a2a1a';
            [[8, 9], [68, 9], [8, 43], [68, 43]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 1.9, 0, Math.PI * 2); ctx.fill(); });
            ctx.fillStyle = 'rgba(255,230,180,0.5)'; [[7.4, 8.4], [67.4, 8.4]].forEach(([x, y]) => ctx.fillRect(x, y, 1, 1));
            // Herba al peu
            ctx.strokeStyle = '#4f7a35'; ctx.lineWidth = 2;
            [[26, 82, 22, 74], [28, 82, 28, 72], [48, 82, 52, 73], [50, 82, 55, 77]].forEach(([x1, y1, x2, y2]) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); });
        });
        // Roda de carruatge gegant (la de la Sala del Ping-pong, la que amaga el passadís): llanta de set trams de fusta amb cèrcol de ferro reblat,
        // catorze radis aprimats, un cub amb bandes de ferro i cargols, i una mica de fang i molsa; il·luminada des de dalt a l'esquerra
        crea('roda_carruatge', 140, 150, (ctx, w, h) => {
            const cx = 70, cy = 76, R = 60, O = '#1e120a';
            ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            const fusta = (x0, y0, x1, y1, a, b) => { const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, a); g.addColorStop(1, b); return g; };
            // Radis: aprimats del cub a la llanta, amb vena i llum
            const NR = 14;
            for (let i = 0; i < NR; i++) {
                const a = i * Math.PI * 2 / NR, ca = Math.cos(a), sa = Math.sin(a), px = -sa, py = ca;
                const r0 = 17, r1 = R - 7, w0 = 5.2, w1 = 3.4;
                const P = [[cx + ca * r0 + px * w0, cy + sa * r0 + py * w0], [cx + ca * r1 + px * w1, cy + sa * r1 + py * w1], [cx + ca * r1 - px * w1, cy + sa * r1 - py * w1], [cx + ca * r0 - px * w0, cy + sa * r0 - py * w0]];
                ctx.beginPath(); P.forEach(([x, y], k) => k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath();
                ctx.fillStyle = fusta(cx + px * 6, cy + py * 6, cx - px * 6, cy - py * 6, '#a8703a', '#6a4220'); ctx.fill();
                ctx.strokeStyle = O; ctx.lineWidth = 1.3; ctx.stroke();
                ctx.strokeStyle = 'rgba(255,225,170,0.4)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx + ca * (r0 + 2) + px * 2.4, cy + sa * (r0 + 2) + py * 2.4); ctx.lineTo(cx + ca * (r1 - 2) + px * 1.4, cy + sa * (r1 - 2) + py * 1.4); ctx.stroke();
            }
            // Llanta: set trams (cada un amb el seu to i les seves vetes) i les juntes entre ells
            const NT = 7, tons = ['#7a4c24', '#8a5a2c', '#744622', '#85552a', '#7e5028', '#8c5c30', '#764824'];
            ctx.strokeStyle = O; ctx.lineWidth = 19; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
            for (let t = 0; t < NT; t++) {
                const a0 = t * Math.PI * 2 / NT + 0.035, a1 = (t + 1) * Math.PI * 2 / NT - 0.035;
                ctx.strokeStyle = tons[t]; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(cx, cy, R, a0, a1); ctx.stroke();
                ctx.strokeStyle = 'rgba(255,225,170,0.22)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R - 5, a0 + 0.04, a1 - 0.04); ctx.stroke();
                ctx.strokeStyle = 'rgba(40,20,8,0.5)'; ctx.lineWidth = 0.9;
                [-3, 0.5, 3.5].forEach(d => { ctx.beginPath(); ctx.arc(cx, cy, R + d, a0 + 0.12 + 0.05 * d, a1 - 0.18 + 0.04 * d); ctx.stroke(); });
            }
            // Cèrcol de ferro reblat per fora, amb la vora de dins més fosca
            ctx.strokeStyle = O; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(cx, cy, R + 8.5, 0, Math.PI * 2); ctx.stroke();
            ctx.strokeStyle = '#43434b'; ctx.lineWidth = 5.4; ctx.beginPath(); ctx.arc(cx, cy, R + 8.5, 0, Math.PI * 2); ctx.stroke();
            ctx.strokeStyle = 'rgba(210,210,225,0.45)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, R + 10.2, Math.PI * 0.95, Math.PI * 1.65); ctx.stroke();
            ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, R + 6.6, 0, Math.PI * 2); ctx.stroke();
            for (let k = 0; k < 28; k++) { const a = k * Math.PI * 2 / 28; ctx.fillStyle = '#8a8a96'; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * (R + 8.5), cy + Math.sin(a) * (R + 8.5), 1.5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * (R + 8.5) + 0.7, cy + Math.sin(a) * (R + 8.5) + 0.7, 0.8, 0, Math.PI * 2); ctx.fill(); }
            // Cub: cos de fusta gruixut amb dues bandes de ferro, vuit cargols i la tapa de l'eix
            ctx.fillStyle = fusta(cx - 16, cy - 16, cx + 16, cy + 16, '#7a4c24', '#3c2210'); ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = O; ctx.lineWidth = 2.2; ctx.stroke();
            [[18, 3.2], [11.5, 2.6]].forEach(([r, g]) => { ctx.strokeStyle = O; ctx.lineWidth = g + 1.6; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = '#4a4a52'; ctx.lineWidth = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); });
            for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4 + 0.2, x = cx + Math.cos(a) * 14.8, y = cy + Math.sin(a) * 14.8; ctx.fillStyle = '#9a9aa6'; ctx.beginPath(); ctx.arc(x, y, 1.9, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = O; ctx.lineWidth = 0.8; ctx.stroke(); }
            const gc = ctx.createRadialGradient(cx - 2, cy - 2, 0.5, cx, cy, 8); gc.addColorStop(0, '#d8d8e4'); gc.addColorStop(0.5, '#8a8a96'); gc.addColorStop(1, '#4a4a54');
            ctx.fillStyle = gc; ctx.beginPath(); ctx.arc(cx, cy, 7.5, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = O; ctx.lineWidth = 1.4; ctx.stroke();
            ctx.fillStyle = '#16100c'; ctx.beginPath(); ctx.arc(cx, cy, 2.2, 0, Math.PI * 2); ctx.fill();
            // Esquerda a la llanta, fang a la vora de baix i una mica de molsa a dalt
            ctx.strokeStyle = 'rgba(20,10,4,0.8)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx - 46, cy - 38); ctx.lineTo(cx - 43, cy - 33); ctx.lineTo(cx - 47, cy - 29); ctx.stroke();
            ctx.fillStyle = 'rgba(70,48,26,0.55)'; [[cx + 14, cy + 66, 6, 2.6], [cx - 8, cy + 67, 8, 3], [cx + 32, cy + 60, 5, 2.4], [cx - 30, cy + 62, 5, 2.2]].forEach(([x, y, rx, ry]) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); });
            ctx.fillStyle = 'rgba(86,130,56,0.6)'; [[cx - 24, cy - 62, 5, 2.4], [cx - 14, cy - 66, 4, 2], [cx - 36, cy - 54, 4, 2.2]].forEach(([x, y, rx, ry]) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, -0.5, 0, Math.PI * 2); ctx.fill(); });
            // Llum des de dalt a l'esquerra i ombra a baix a la dreta (només sobre el que ja és dibuixat)
            ctx.globalCompositeOperation = 'source-atop';
            const ll = ctx.createLinearGradient(cx - 60, cy - 60, cx + 60, cy + 60); ll.addColorStop(0, 'rgba(255,236,190,0.22)'); ll.addColorStop(0.5, 'rgba(0,0,0,0)'); ll.addColorStop(1, 'rgba(0,0,0,0.38)');
            ctx.fillStyle = ll; ctx.fillRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'source-over';
        });
        // Grans de rosari (l'energia de l'Ineu): fusta d'olivera polida i ben encesa (ple), mig apagats (mig) o foscos i esquerdats (buit)
        const gra = (ctx, mode) => {
            const cx = 22, cy = 22, r = 15;
            const esfera = (clar, mig, fosc) => {
                const g = ctx.createRadialGradient(cx - 5, cy - 6, 1.5, cx, cy, r + 1);
                g.addColorStop(0, clar); g.addColorStop(0.45, mig); g.addColorStop(1, fosc);
                ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
            };
            const veta = alfa => {          // anells de la fusta i el canal per on passa el cordó
                ctx.strokeStyle = `rgba(60,28,8,${alfa})`; ctx.lineWidth = 1;
                [6, 10.5].forEach(ry => { ctx.beginPath(); ctx.ellipse(cx, cy, r - 1, ry, 0, 0, Math.PI * 2); ctx.stroke(); });
            };
            // apagat (base de tots tres)
            esfera('#7a6a5c', '#4a3c30', '#211810');
            veta(0.35);
            if (mode === 0) {               // esquerda
                ctx.strokeStyle = 'rgba(10,6,2,0.8)'; ctx.lineWidth = 1.4;
                ctx.beginPath(); ctx.moveTo(cx + 3, cy - 13); ctx.lineTo(cx, cy - 6); ctx.lineTo(cx + 4, cy - 1); ctx.lineTo(cx + 1, cy + 5); ctx.stroke();
            }
            if (mode > 0) {
                ctx.save();
                if (mode === 1) { ctx.beginPath(); ctx.rect(0, 0, cx, 44); ctx.clip(); }
                // halo càlid
                const h = ctx.createRadialGradient(cx, cy, r - 2, cx, cy, r + 6); h.addColorStop(0, 'rgba(255,190,90,0.55)'); h.addColorStop(1, 'rgba(255,190,90,0)');
                ctx.fillStyle = h; ctx.beginPath(); ctx.arc(cx, cy, r + 6, 0, Math.PI * 2); ctx.fill();
                esfera('#ffd894', '#c27a34', '#5a2a0e');
                veta(0.5);
                ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.beginPath(); ctx.ellipse(cx - 6, cy - 7, 4.6, 2.8, -0.6, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.arc(cx + 6, cy + 7, 1.6, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
                if (mode === 1) { ctx.strokeStyle = 'rgba(30,14,4,0.7)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(cx, cy - r + 1); ctx.lineTo(cx, cy + r - 1); ctx.stroke(); }
            }
            ctx.lineWidth = 2.4; ctx.strokeStyle = '#1e0e04'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
            ctx.fillStyle = '#1e0e04'; [cx - r + 1.2, cx + r - 1.2].forEach(x => { ctx.beginPath(); ctx.ellipse(x, cy, 1.6, 2.6, 0, 0, Math.PI * 2); ctx.fill(); });   // forats del cordó
        };
        crea('gra_ple', 44, 44, (ctx) => gra(ctx, 2));
        crea('gra_mig', 44, 44, (ctx) => gra(ctx, 1));
        crea('gra_buit', 44, 44, (ctx) => gra(ctx, 0));
        // Creueta de llautó que penja al principi del rosari
        crea('creu_rosari', 36, 28, (ctx) => {
            // Creu de fusta TUMBADA sobre una taula, en perspectiva isomètrica: el pla de la taula es veu en diagonal i la creu hi reposa en horitzontal (el braç llarg
            // va cap a baix a l'esquerra i el cap de la creu, amb l'anella del cordó, és dalt a la dreta, cap als grans), amb gruix (els costats, més foscos, es veuen per sota) i una ombra suau a la taula. Només polígons, amb la veta de la fusta.
            ctx.lineJoin = 'round';
            const model = [[-15, -3], [-10, -3], [-10, -10], [-4, -10], [-4, -3], [15, -3], [15, 3], [-4, 3], [-4, 10], [-10, 10], [-10, 3], [-15, 3]];     // (llarg, ample) sobre el pla
            const P = (u, v) => [18 - (u - v) * 0.866, 11.5 + (u + v) * 0.5];                                                                           // projecció isomètrica
            const dalt = model.map(([u, v]) => P(u, v)), GRUIX = 4;
            const baix = dalt.map(([x, y]) => [x, y + GRUIX]);
            const poli = pts => { ctx.beginPath(); pts.forEach(([x, y], k) => k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); };
            // Ombra a la taula
            poli(baix.map(([x, y]) => [x + 2.5, y + 2])); ctx.fillStyle = 'rgba(0,0,0,0.32)'; ctx.fill();
            // Costats
            ctx.strokeStyle = '#2a1608'; ctx.lineWidth = 1.5;
            for (let k = 0; k < dalt.length; k++) {
                const n = (k + 1) % dalt.length;
                poli([dalt[k], dalt[n], baix[n], baix[k]]);
                ctx.fillStyle = dalt[n][0] - dalt[k][0] < 0 ? '#6e4522' : '#573519'; ctx.fill(); ctx.stroke();
            }
            // Cara de dalt: fusta clara amb veta
            const g = ctx.createLinearGradient(4, 2, 32, 22); g.addColorStop(0, '#d9a066'); g.addColorStop(1, '#a8703a');
            poli(dalt); ctx.fillStyle = g; ctx.fill(); ctx.stroke();
            ctx.save(); poli(dalt); ctx.clip();
            ctx.strokeStyle = 'rgba(80,44,16,0.55)'; ctx.lineWidth = 0.8;
            const veta = (u1, v1, u2, v2) => { const a = P(u1, v1), b = P(u2, v2); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); };
            [-1.8, 0, 1.6].forEach(v => veta(-16, v, 16, v));                       // veta del braç llarg
            [-9, -7, -5.4].forEach(u => { veta(u, -11, u, -3.4); veta(u, 3.4, u, 11); });           // i del travesser
            ctx.restore();
            // Brillantor a la vora de dalt del braç llarg
            ctx.strokeStyle = 'rgba(255,240,200,0.65)'; ctx.lineWidth = 1;
            const a = P(-15, -3), b = P(15, -3); ctx.beginPath(); ctx.moveTo(a[0] - 0.6, a[1] + 1); ctx.lineTo(b[0] - 0.6, b[1] + 1); ctx.stroke();
            // L'anella de llautó del cap de la creu, d'on surt el cordó del rosari (cap als grans, a la dreta)
            const an = P(-15.4, 0);
            ctx.strokeStyle = '#2a1a06'; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.arc(an[0], an[1], 1.8, 0, Math.PI * 2); ctx.stroke();
            ctx.strokeStyle = '#e8c250'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(an[0], an[1], 1.8, 0, Math.PI * 2); ctx.stroke();
        });
        // Cementiri (dibuixos.js): làpides, tombes amb vorada, la creueta, la tomba de l'àngel (on el Germà Francí porta flors) i els fanalets
        crea('lapida', 56, 80, (ctx, w, h) => pintarLapidaArc(ctx, w, h, 3));
        crea('lapida_b', 56, 80, (ctx, w, h) => pintarLapidaArc(ctx, w, h, 17));
        crea('lapida_creu', 54, 90, (ctx, w, h) => pintarLapidaCreu(ctx, w, h));
        crea('lapida_ferro', 46, 84, (ctx, w, h) => pintarLapidaFerro(ctx, w, h));
        crea('tomba_grava', 110, 96, (ctx, w, h) => pintarTombaVorada(ctx, w, h, 'grava', 11));
        crea('tomba_flors', 110, 96, (ctx, w, h) => pintarTombaVorada(ctx, w, h, 'flors', 13));
        crea('tomba_herba', 110, 96, (ctx, w, h) => pintarTombaVorada(ctx, w, h, 'herba', 19));
        crea('tomba_creu', 140, 112, pintarTombaCreu);
        crea('fanalet', 24, 46, pintarFanalet);
        // Banc de fusta de jardí: tres taulons de seient, cantell frontal, potes amb travesser i ombra al terra
        const banc = (ctx, alt, respatller) => {
            const base = alt - 8;
            ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.beginPath(); ctx.ellipse(75, base + 3, 68, 6, 0, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#2a1608'; ctx.lineWidth = 2; ctx.lineJoin = 'round';
            // Potes
            [[14, 30], [118, 30]].forEach(([x]) => {
                const g = ctx.createLinearGradient(x, 0, x + 18, 0); g.addColorStop(0, '#5e3a1c'); g.addColorStop(1, '#3e2410');
                ctx.fillStyle = g; ctx.fillRect(x, base - 20, 18, 22); ctx.strokeRect(x, base - 20, 18, 22);
            });
            ctx.fillStyle = '#4a2c14'; ctx.fillRect(28, base - 12, 94, 5); ctx.strokeRect(28, base - 12, 94, 5);
            // Respatller
            if (respatller) {
                [[16, 44], [116, 44]].forEach(([x]) => { ctx.fillStyle = '#5e3a1c'; ctx.fillRect(x, 8, 18, base - 36); ctx.strokeRect(x, 8, 18, base - 36); });
                [[10, '#b07a42'], [24, '#a06c38'], [38, '#b07a42']].forEach(([y, col], i) => {
                    ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(8, y, 134, 12, 3); ctx.fill(); ctx.stroke();
                    ctx.fillStyle = 'rgba(255,230,180,0.3)'; ctx.fillRect(12, y + 2, 126, 2);
                });
            }
            // Seient: tres taulons vistos des de dalt, i cantell frontal
            const sy = base - 36;
            [[0, '#c48a4c'], [9, '#b87e42'], [18, '#c48a4c']].forEach(([dy, col]) => {
                ctx.fillStyle = col; ctx.fillRect(4, sy + dy, 142, 9); ctx.strokeRect(4, sy + dy, 142, 9);
                ctx.strokeStyle = 'rgba(70,40,14,0.45)'; ctx.lineWidth = 1;
                for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(14 + k * 40 + dy * 2, sy + dy + 4); ctx.lineTo(44 + k * 40 + dy * 2, sy + dy + 4); ctx.stroke(); }
                ctx.strokeStyle = '#2a1608'; ctx.lineWidth = 2;
            });
            ctx.fillStyle = '#8e5a2a'; ctx.fillRect(4, sy + 27, 142, 9); ctx.strokeRect(4, sy + 27, 142, 9);
            ctx.fillStyle = 'rgba(255,230,180,0.35)'; ctx.fillRect(8, sy + 1, 134, 2);
        };
        crea('banc', 150, 70, (ctx, w, h) => banc(ctx, h, false));
        crea('banc_respatller', 150, 100, (ctx, w, h) => banc(ctx, h, true));
        // Banc vist per darrere: qui hi seu mira cap amunt i el respatller li tapa l'esquena i les cames
        // Banc d'església vist per darrere: dos costats massissos en trapezi, un sol tauló ample de respatller amb
        // capçal (sense barrots) i, a baix, el genuflexori de la fila del darrere. Pel buit es veu el seient.
        crea('banc_esglesia', 150, 86, (ctx, w, h) => {
            const C = '#2a1406', base = h - 6;
            ctx.lineJoin = 'round';
            ctx.fillStyle = 'rgba(0,0,0,0.30)'; ctx.beginPath(); ctx.ellipse(w / 2 + 3, base + 1, w * 0.48, 6, 0, 0, Math.PI * 2); ctx.fill();
            const fusta = (x0, y0, x1, y1, clar, fosc) => { const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, clar); g.addColorStop(1, fosc); return g; };
            // Seient (al fons, vist pel buit de sota el respatller)
            ctx.fillStyle = fusta(0, 30, 0, 52, '#b06a30', '#6a3a16'); ctx.fillRect(18, 34, w - 36, 16);
            ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(18, 46, w - 36, 6);
            ctx.strokeStyle = C; ctx.lineWidth = 1.5; ctx.strokeRect(18, 34, w - 36, 16);
            // Genuflexori de la fila del darrere: tauló baix entre els costats, amb la cara de dalt clara
            ctx.fillStyle = fusta(0, base - 16, 0, base, '#9c5a26', '#5e3212'); ctx.fillRect(14, base - 15, w - 28, 12);
            ctx.fillStyle = '#c8823e'; ctx.fillRect(14, base - 19, w - 28, 5);
            ctx.strokeStyle = C; ctx.lineWidth = 1.6; ctx.strokeRect(14, base - 19, w - 28, 16);
            ctx.fillStyle = 'rgba(255,230,180,0.3)'; ctx.fillRect(16, base - 18, w - 32, 1.4);
            // Costats: trapezis massissos (estrets a dalt, amples a baix) amb l'arc de les potes
            [[8, 1], [w - 8, -1]].forEach(([x, s]) => {
                const dalt = 6, amp0 = 9, amp1 = 13;
                const pts = [[x - s * 0, dalt], [x + s * amp0, dalt], [x + s * amp1, base], [x + s * 4, base], [x + s * 2, base - 5], [x - s * 2, base - 5], [x - s * 4, base]];
                ctx.fillStyle = fusta(x - 6, 0, x + 14, 0, s > 0 ? '#c27a3a' : '#9a5624', s > 0 ? '#8a4c1e' : '#6a3814');
                ctx.beginPath(); pts.forEach(([px, py], i) => i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)); ctx.closePath(); ctx.fill();
                ctx.strokeStyle = C; ctx.lineWidth = 1.8; ctx.stroke();
                ctx.strokeStyle = 'rgba(60,28,8,0.35)'; ctx.lineWidth = 0.8;
                for (let k = 1; k < 3; k++) { ctx.beginPath(); ctx.moveTo(x + s * (2 + k * 3), dalt + 8); ctx.lineTo(x + s * (3 + k * 3.5), base - 8); ctx.stroke(); }
            });
            // Respatller: un sol tauló ample i, a dalt, el capçal una mica més ample
            ctx.fillStyle = fusta(0, 12, 0, 34, '#b8703a', '#7e4418'); ctx.fillRect(14, 12, w - 28, 22);
            ctx.strokeStyle = 'rgba(60,28,8,0.45)'; ctx.lineWidth = 0.9;
            [[24, 19, 70, 18], [80, 26, 128, 25], [40, 29, 66, 30]].forEach(([a, b, c, d]) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.quadraticCurveTo((a + c) / 2, b - 1.5, c, d); ctx.stroke(); });
            ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(14, 30, w - 28, 4);
            ctx.strokeStyle = C; ctx.lineWidth = 1.8; ctx.strokeRect(14, 12, w - 28, 22);
            ctx.fillStyle = fusta(0, 4, 0, 13, '#d8924e', '#a0602a'); ctx.beginPath(); ctx.roundRect(5, 4, w - 10, 9, 2); ctx.fill();
            ctx.strokeStyle = C; ctx.lineWidth = 1.8; ctx.stroke();
            ctx.fillStyle = 'rgba(255,236,200,0.45)'; ctx.fillRect(8, 5, w - 16, 1.6);
        });
        // Banc d'església ample (240 de llarg, per a dos o tres personatges), amb els contorns fins
        crea('banc_esglesia_ample', 240, 86, (ctx, w, h) => {
            const C = 'rgba(42,20,6,0.8)', sx = w / 150, base = h - 6;
            ctx.lineJoin = 'round';
            ctx.fillStyle = 'rgba(0,0,0,0.30)'; ctx.beginPath(); ctx.ellipse(w / 2 + 3, base + 1, w * 0.48, 6, 0, 0, Math.PI * 2); ctx.fill();
            const fusta = (x0, y0, x1, y1, clar, fosc) => { const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, clar); g.addColorStop(1, fosc); return g; };
            // Seient (al fons, vist pel buit de sota el respatller)
            ctx.fillStyle = fusta(0, 30, 0, 52, '#b06a30', '#6a3a16'); ctx.fillRect(18, 34, w - 36, 16);
            ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(18, 46, w - 36, 6);
            ctx.strokeStyle = C; ctx.lineWidth = 0.8; ctx.strokeRect(18, 34, w - 36, 16);
            // Genuflexori de la fila del darrere: tauló baix entre els costats, amb la cara de dalt clara
            ctx.fillStyle = fusta(0, base - 16, 0, base, '#9c5a26', '#5e3212'); ctx.fillRect(14, base - 15, w - 28, 12);
            ctx.fillStyle = '#c8823e'; ctx.fillRect(14, base - 19, w - 28, 5);
            ctx.strokeStyle = C; ctx.lineWidth = 0.9; ctx.strokeRect(14, base - 19, w - 28, 16);
            ctx.fillStyle = 'rgba(255,230,180,0.3)'; ctx.fillRect(16, base - 18, w - 32, 1.4);
            // Costats: trapezis massissos (estrets a dalt, amples a baix) amb l'arc de les potes
            [[8, 1], [w - 8, -1]].forEach(([x, s]) => {
                const dalt = 6, amp0 = 9, amp1 = 13;
                const pts = [[x - s * 0, dalt], [x + s * amp0, dalt], [x + s * amp1, base], [x + s * 4, base], [x + s * 2, base - 5], [x - s * 2, base - 5], [x - s * 4, base]];
                ctx.fillStyle = fusta(x - 6, 0, x + 14, 0, s > 0 ? '#c27a3a' : '#9a5624', s > 0 ? '#8a4c1e' : '#6a3814');
                ctx.beginPath(); pts.forEach(([px, py], i) => i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)); ctx.closePath(); ctx.fill();
                ctx.strokeStyle = C; ctx.lineWidth = 1; ctx.stroke();
                ctx.strokeStyle = 'rgba(60,28,8,0.35)'; ctx.lineWidth = 0.8;
                for (let k = 1; k < 3; k++) { ctx.beginPath(); ctx.moveTo(x + s * (2 + k * 3), dalt + 8); ctx.lineTo(x + s * (3 + k * 3.5), base - 8); ctx.stroke(); }
            });
            // Respatller: un sol tauló ample i, a dalt, el capçal una mica més ample
            ctx.fillStyle = fusta(0, 12, 0, 34, '#b8703a', '#7e4418'); ctx.fillRect(14, 12, w - 28, 22);
            ctx.strokeStyle = 'rgba(60,28,8,0.45)'; ctx.lineWidth = 0.7;
            [[24, 19, 70, 18], [80, 26, 128, 25], [40, 29, 66, 30], [96, 17, 140, 18], [12, 25, 38, 24]].forEach(([a, b, c, d]) => { a *= sx; c *= sx; ctx.beginPath(); ctx.moveTo(a, b); ctx.quadraticCurveTo((a + c) / 2, b - 1.5, c, d); ctx.stroke(); });
            ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(14, 30, w - 28, 4);
            ctx.strokeStyle = C; ctx.lineWidth = 1; ctx.strokeRect(14, 12, w - 28, 22);
            ctx.fillStyle = fusta(0, 4, 0, 13, '#d8924e', '#a0602a'); ctx.beginPath(); ctx.roundRect(5, 4, w - 10, 9, 2); ctx.fill();
            ctx.strokeStyle = C; ctx.lineWidth = 1; ctx.stroke();
            ctx.fillStyle = 'rgba(255,236,200,0.45)'; ctx.fillRect(8, 5, w - 16, 1.6);
        });
        // Atril barroc daurat i vermell, vist per darrere (el pupitre dona l'esquena al públic: no es veu el llibre): peu de trípode amb volutes, bulb i gerro d'acant,
        // tija amb anells i, a dalt, el darrere del pupitre inclinat amb vora daurada i una cartel·la tallada.
        crea('atril_barroc', 76, 150, (ctx, w, h) => {
            const cx = w / 2, O = 'rgba(70,42,4,0.85)';
            ctx.lineJoin = 'round'; ctx.lineWidth = 0.8; ctx.strokeStyle = O;
            const or = (x0, y0, x1, y1) => { const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, '#fff0a0'); g.addColorStop(0.4, '#e8b83a'); g.addColorStop(1, '#8e5e0c'); return g; };
            const vermell = (x0, y0, x1, y1) => { const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, '#a8402c'); g.addColorStop(1, '#5a1810'); return g; };
            ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(cx + 2, h - 5, 31, 5, 0, 0, Math.PI * 2); ctx.fill();
            ctx.translate(0, 11);      // (espai a dalt per al coronament)
            // peus del trípode: dues volutes als costats i una al davant
            const peu = s => {
                ctx.beginPath(); ctx.moveTo(cx + s * 4, 112);
                ctx.bezierCurveTo(cx + s * 16, 112, cx + s * 26, 118, cx + s * 30, 128);
                ctx.bezierCurveTo(cx + s * 34, 134, cx + s * 24, 135, cx + s * 22, 130);
                ctx.bezierCurveTo(cx + s * 21, 127, cx + s * 25, 126, cx + s * 26, 128);
                ctx.bezierCurveTo(cx + s * 22, 121, cx + s * 14, 119, cx + s * 4, 122); ctx.closePath();
                ctx.fillStyle = or(cx - 30, 110, cx + 30, 136); ctx.fill(); ctx.stroke();
            };
            peu(-1); peu(1);
            ctx.beginPath(); ctx.moveTo(cx - 9, 114); ctx.bezierCurveTo(cx - 12, 126, cx - 9, 134, cx, 135); ctx.bezierCurveTo(cx + 9, 134, cx + 12, 126, cx + 9, 114); ctx.closePath();
            ctx.fillStyle = or(cx - 10, 0, cx + 10, 0); ctx.fill(); ctx.stroke();
            ctx.strokeStyle = 'rgba(100,64,6,0.8)'; ctx.beginPath(); ctx.moveTo(cx, 117); ctx.quadraticCurveTo(cx - 5, 124, cx, 131); ctx.quadraticCurveTo(cx + 5, 124, cx, 117); ctx.stroke(); ctx.strokeStyle = O;
            // bloc de la base (vermell amb marc daurat)
            ctx.fillStyle = vermell(0, 104, 0, 114); ctx.beginPath(); ctx.roundRect(cx - 13, 103, 26, 11, 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = or(cx - 15, 0, cx + 15, 0); ctx.fillRect(cx - 15, 101, 30, 3); ctx.strokeRect(cx - 15, 101, 30, 3);
            // tija: perfil simètric per trams (radi segons y)
            const tram = (y0, y1, rad, fill) => {
                const dreta = [], esq = [];
                for (let y = y0; y <= y1; y += 0.5) { const r = rad((y - y0) / (y1 - y0)); dreta.push([cx + r, y]); esq.push([cx - r, y]); }
                ctx.beginPath(); dreta.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); esq.reverse().forEach(([x, y]) => ctx.lineTo(x, y)); ctx.closePath();
                ctx.fillStyle = fill; ctx.fill(); ctx.stroke();
            };
            tram(84, 101, t => 5 + 9 * Math.sin(Math.PI * t) ** 0.8, or(cx - 14, 0, cx + 14, 0));            // bulb baix
            tram(80, 84, t => 8, or(cx - 8, 0, cx + 8, 0));                                                    // anell
            tram(58, 80, t => 4 + 7 * Math.sin(Math.PI * t), or(cx - 11, 0, cx + 11, 0));                      // gerro
            tram(54, 58, t => 7.5, or(cx - 8, 0, cx + 8, 0));                                                  // collarí
            tram(40, 54, t => 5 + 5 * (1 - t) ** 1.3, or(cx - 10, 0, cx + 10, 0));                              // coll acampanat
            // talles d'acant sobre el bulb i el gerro
            ctx.strokeStyle = 'rgba(96,60,4,0.85)'; ctx.lineWidth = 1;
            [[92, 8], [69, 6]].forEach(([y, r]) => [-1, 1].forEach(sd => { ctx.beginPath(); ctx.moveTo(cx, y - 7); ctx.bezierCurveTo(cx + sd * r, y - 5, cx + sd * r, y + 3, cx + sd * 1.5, y + 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx, y - 3); ctx.bezierCurveTo(cx + sd * r * 0.6, y - 2, cx + sd * r * 0.6, y + 2, cx + sd * 1, y + 5); ctx.stroke(); }));
            ctx.strokeStyle = O; ctx.lineWidth = 0.8;
            [88, 66].forEach(y => { ctx.fillStyle = '#fff4b8'; ctx.beginPath(); ctx.ellipse(cx - 4, y, 1.6, 2.4, 0.4, 0, Math.PI * 2); ctx.fill(); });
            // darrere del pupitre: tauler vermell inclinat (vist per darrere) amb vora daurada i cartel·la al mig; el llavi superior sobresurt una mica
            ctx.fillStyle = or(cx - 30, 0, cx + 30, 0);
            ctx.beginPath(); ctx.moveTo(cx - 31, 40); ctx.lineTo(cx + 31, 40); ctx.lineTo(cx + 27, 38); ctx.lineTo(cx - 27, 38); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.fillStyle = vermell(0, 14, 0, 38);
            ctx.beginPath(); ctx.moveTo(cx - 29, 38); ctx.lineTo(cx + 29, 38); ctx.lineTo(cx + 25, 12); ctx.lineTo(cx - 25, 12); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.strokeStyle = '#e8b83a'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(cx - 26.5, 35.5); ctx.lineTo(cx + 26.5, 35.5); ctx.lineTo(cx + 23.5, 15); ctx.lineTo(cx - 23.5, 15); ctx.closePath(); ctx.stroke();
            ctx.strokeStyle = O; ctx.lineWidth = 0.8;
            ctx.fillStyle = or(cx - 25, 8, cx + 25, 15); ctx.beginPath(); ctx.moveTo(cx - 26, 12); ctx.lineTo(cx + 26, 12); ctx.lineTo(cx + 27, 9); ctx.lineTo(cx - 27, 9); ctx.closePath(); ctx.fill(); ctx.stroke();
            // cartel·la tallada al centre del tauler
            ctx.fillStyle = or(cx - 11, 18, cx + 11, 32); ctx.beginPath(); ctx.moveTo(cx, 17); ctx.bezierCurveTo(cx + 14, 19, cx + 14, 28, cx + 7, 33); ctx.bezierCurveTo(cx + 4, 31, cx - 4, 31, cx - 7, 33); ctx.bezierCurveTo(cx - 14, 28, cx - 14, 19, cx, 17); ctx.fill(); ctx.stroke();
            ctx.strokeStyle = 'rgba(96,60,4,0.8)'; ctx.beginPath(); ctx.moveTo(cx, 19); ctx.bezierCurveTo(cx + 7, 21, cx + 6, 27, cx + 1, 30); ctx.moveTo(cx, 19); ctx.bezierCurveTo(cx - 7, 21, cx - 6, 27, cx - 1, 30); ctx.stroke();
            ctx.fillStyle = '#fff4b8'; ctx.beginPath(); ctx.arc(cx, 25, 1.8, 0, Math.PI * 2); ctx.fill();
            // volutes als costats del tauler
            ctx.strokeStyle = '#d8a030'; ctx.lineWidth = 1.5;
            [-1, 1].forEach(sd => { ctx.beginPath(); ctx.moveTo(cx + sd * 22, 34); ctx.bezierCurveTo(cx + sd * 15, 36, cx + sd * 15, 28, cx + sd * 19, 28); ctx.stroke(); });
            ctx.strokeStyle = O; ctx.lineWidth = 0.8;
            // ---- Més talles i volutes ----
            const fulla = (x, y, ang, sz) => {
                ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
                ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(sz * 0.7, -sz * 0.2, sz * 0.6, -sz * 0.9, 0, -sz * 1.25); ctx.bezierCurveTo(-sz * 0.6, -sz * 0.9, -sz * 0.7, -sz * 0.2, 0, 0);
                ctx.fillStyle = or(-sz, -sz, sz, 0); ctx.fill(); ctx.stroke();
                ctx.strokeStyle = 'rgba(96,60,4,0.85)'; ctx.beginPath(); ctx.moveTo(0, -1); ctx.lineTo(0, -sz * 1.1); ctx.moveTo(0, -sz * 0.4); ctx.lineTo(sz * 0.32, -sz * 0.62); ctx.moveTo(0, -sz * 0.4); ctx.lineTo(-sz * 0.32, -sz * 0.62); ctx.moveTo(0, -sz * 0.7); ctx.lineTo(sz * 0.25, -sz * 0.9); ctx.moveTo(0, -sz * 0.7); ctx.lineTo(-sz * 0.25, -sz * 0.9); ctx.stroke();
                ctx.restore(); ctx.strokeStyle = O;
            };
            const perles = (x0, x1, y, n, r) => { for (let k = 0; k < n; k++) { const x = x0 + (x1 - x0) * (k + 0.5) / n; ctx.fillStyle = '#fff4b8'; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); } };
            const voluta = (x, y, sd, r, gruix) => {          // S amb caragol a l'extrem
                ctx.strokeStyle = '#8a5a08'; ctx.lineWidth = gruix + 1.2; ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x + sd * r * 1.6, y - r * 0.2, x + sd * r * 1.8, y + r * 1.6, x + sd * r * 0.7, y + r * 1.6); ctx.bezierCurveTo(x + sd * r * 0.1, y + r * 1.6, x + sd * r * 0.2, y + r * 0.7, x + sd * r * 0.7, y + r * 0.8); ctx.stroke();
                ctx.strokeStyle = '#f2c94a'; ctx.lineWidth = gruix; ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x + sd * r * 1.6, y - r * 0.2, x + sd * r * 1.8, y + r * 1.6, x + sd * r * 0.7, y + r * 1.6); ctx.bezierCurveTo(x + sd * r * 0.1, y + r * 1.6, x + sd * r * 0.2, y + r * 0.7, x + sd * r * 0.7, y + r * 0.8); ctx.stroke();
                ctx.strokeStyle = O; ctx.lineWidth = 0.8;
            };
            // peu: fulles i boles a les puntes
            [-1, 1].forEach(sd => { fulla(cx + sd * 15, 118, sd * 1.15, 8); fulla(cx + sd * 23, 125, sd * 1.5, 6); ctx.fillStyle = or(cx - 30, 0, cx + 30, 0); ctx.beginPath(); ctx.arc(cx + sd * 28, 132, 2.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
            fulla(cx, 128, 0, 7);
            [-1, 1].forEach(sd => fulla(cx + sd * 9, 102, sd * 0.9, 8));            // al voltant de la base
            // gallons (costelles) del bulb baix
            ctx.strokeStyle = 'rgba(96,60,4,0.8)'; ctx.lineWidth = 0.8;
            [-9, -5, 5, 9].forEach(dx => { ctx.beginPath(); ctx.moveTo(cx + dx * 0.4, 85); ctx.bezierCurveTo(cx + dx * 1.3, 90, cx + dx * 1.3, 96, cx + dx * 0.4, 100); ctx.stroke(); });
            ctx.strokeStyle = O;
            // perles als anells
            perles(cx - 7, cx + 7, 82, 5, 1.1); perles(cx - 6.5, cx + 6.5, 56, 4, 1); perles(cx - 12, cx + 12, 102.5, 6, 1.1);
            // anses de volutes al gerro i al coll
            [-1, 1].forEach(sd => { voluta(cx + sd * 8, 62, sd, 5.5, 1.5); voluta(cx + sd * 5, 47, sd, 4, 1.3); });
            // fulles d'acant que pugen pel coll fins al pupitre
            [-1, 1].forEach(sd => { fulla(cx + sd * 4, 55, sd * 0.55, 10); fulla(cx + sd * 3, 53, sd * 0.2, 9); });
            // darrere del pupitre: cordó de perles, fulles als angles i cartel·la amb volutes
            perles(cx - 22, cx + 22, 36.2, 11, 0.9); perles(cx - 21, cx + 21, 14.4, 10, 0.9);
            [-1, 1].forEach(sd => { fulla(cx + sd * 25.5, 36, sd * 0.35, 8); fulla(cx + sd * 22.5, 14, sd * 1.5, 6); voluta(cx + sd * 12, 20, sd, 3.6, 1.2); voluta(cx + sd * 12, 31, sd, 3.2, 1.1); });
            for (let k = 0; k < 3; k++) { fulla(cx - 11 + k * 11, 30, (k - 1) * 0.5, 4.5); }
            // coronament: una petxina (conquilla) daurada amb costelles, volutes als costats i una bola al capdamunt
            ctx.fillStyle = or(cx - 10, -2, cx + 10, 10);
            ctx.beginPath(); ctx.moveTo(cx - 10, 9); ctx.bezierCurveTo(cx - 12, 0, cx - 6, -5, cx, -5); ctx.bezierCurveTo(cx + 6, -5, cx + 12, 0, cx + 10, 9); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.strokeStyle = 'rgba(96,60,4,0.85)'; for (let k = -3; k <= 3; k++) { ctx.beginPath(); ctx.moveTo(cx + k * 1.2, 9); ctx.lineTo(cx + k * 2.9, -3.5 + Math.abs(k) * 0.9); ctx.stroke(); } ctx.strokeStyle = O;
            [-1, 1].forEach(sd => { voluta(cx + sd * 10, 8.5, sd, 3.6, 1.2); fulla(cx + sd * 18, 9, sd * 1.3, 5); });
            ctx.fillStyle = or(cx - 3, -10, cx + 3, -4); ctx.beginPath(); ctx.arc(cx, -8, 3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = 'rgba(255,248,200,0.45)'; ctx.fillRect(cx - 4, 56, 1.6, 22); ctx.fillRect(cx - 7, 86, 1.6, 10);
        });
        // Banc de jardí vist per darrere (qui hi seu mira cap amunt): els dos muntants pugen pel respatller i baixen com a potes, amb un travesser; el respatller és un
        // tauler de tres llistons amb el llistó de dalt més ample (se'n veu la cara de dalt), i sota seu es veu la vora del darrere del seient.
        crea('banc_davant', 150, 100, (ctx, w, h) => {
            const base = h - 8, C = '#2a1608';
            ctx.lineJoin = 'round';
            ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.beginPath(); ctx.ellipse(75, base + 3, 68, 6, 0, 0, Math.PI * 2); ctx.fill();
            // potes de darrere (sota el seient) i travesser
            [[10, 0], [124, 1]].forEach(([x]) => { const g = ctx.createLinearGradient(x, 0, x + 16, 0); g.addColorStop(0, '#5a3818'); g.addColorStop(1, '#38200c'); ctx.fillStyle = g; ctx.fillRect(x, 64, 16, base - 62); ctx.strokeStyle = C; ctx.lineWidth = 2; ctx.strokeRect(x, 64, 16, base - 62); });
            ctx.fillStyle = '#4a2c14'; ctx.fillRect(26, base - 18, 98, 6); ctx.strokeRect(26, base - 18, 98, 6);
            // vora del darrere del seient (gruixuda, a l'ombra)
            ctx.fillStyle = '#7a4c22'; ctx.fillRect(4, 56, 142, 13); ctx.strokeRect(4, 56, 142, 13);
            ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(5, 63, 140, 5);
            ctx.fillStyle = 'rgba(255,220,170,0.28)'; ctx.fillRect(6, 58, 138, 2);
            // muntants del respatller
            [8, 126].forEach(x => { const g = ctx.createLinearGradient(x, 0, x + 16, 0); g.addColorStop(0, '#6a4220'); g.addColorStop(1, '#3e2410'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x, 6, 16, 62, 4); ctx.fill(); ctx.stroke(); });
            // tauler: tres llistons amb una escletxa fosca entre cada un (pel buit s'endevina el seient)
            ctx.fillStyle = '#2e1a0a'; ctx.fillRect(22, 14, 106, 44);
            [[17, '#b07a42'], [30, '#a06c38'], [43, '#b07a42']].forEach(([y, col]) => {
                ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(20, y, 110, 11, 2); ctx.fill(); ctx.stroke();
                ctx.fillStyle = 'rgba(255,230,180,0.3)'; ctx.fillRect(24, y + 2, 102, 2);
                ctx.strokeStyle = 'rgba(70,40,14,0.45)'; ctx.lineWidth = 1;
                for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(34 + k * 32, y + 7); ctx.lineTo(58 + k * 32, y + 7); ctx.stroke(); }
                ctx.strokeStyle = C; ctx.lineWidth = 2;
            });
            // llistó de dalt, més ample, amb la cara superior més clara
            ctx.fillStyle = '#c48a4c'; ctx.beginPath(); ctx.roundRect(2, 3, 146, 14, 4); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#dca868'; ctx.fillRect(5, 4.5, 140, 4);
            ctx.fillStyle = 'rgba(70,40,14,0.35)'; ctx.fillRect(5, 12, 140, 3);
        });
        // ---- Mobiliari i terra de fusta (cabanes) ----
        const FUSTA_CONTORN = '#2a1608';
        crea('taulons', 256, 256, (ctx, w, h) => {
            // Rajola repetible sense tall: a cada fila els taulons sumen exactament l'amplada de la rajola i es dibuixen també desplaçats
            // una amplada enrere, de manera que un taulò que surt per la dreta continua per l'esquerra, amb el mateix color i la mateixa veta.
            let llavor = 61;
            const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
            const COLORS = ['#a8763f', '#9a6a36', '#b4814a', '#8e6030', '#a06e3a'];
            const FILES = 8, fh = h / FILES;
            ctx.fillStyle = '#2a1608'; ctx.fillRect(0, 0, w, h);
            for (let f = 0; f < FILES; f++) {
                const y0 = f * fh;
                // Amplades: uns 4 taulons per fila (de 44 a 84 px), escalats perquè sumin w
                const amples = [];
                let suma = 0;
                while (suma < w - 44) { const q = 44 + rnd() * 40; amples.push(q); suma += q; }
                amples.push(Math.max(30, w - suma));
                const tot = amples.reduce((u, v) => u + v, 0);
                const escala = w / tot;
                const peces = amples.map(q => {
                    const pw = q * escala, nus = rnd() < 0.3;
                    return {
                        pw, col: COLORS[Math.floor(rnd() * COLORS.length)],
                        veta: Array.from({ length: 4 }, () => [4 + rnd() * (fh - 8), (rnd() - 0.5) * 4, (rnd() - 0.5) * 4]),
                        nus: nus ? [8 + rnd() * (pw - 16), 6 + rnd() * (fh - 12)] : null
                    };
                });
                let x = rnd() * w;                                                    // cada fila comença en un lloc diferent: les juntes no s'alineen
                peces.forEach(pc => {
                    const dibuixa = xx => {
                        const pw = pc.pw;
                        ctx.fillStyle = pc.col; ctx.fillRect(xx + 1, y0 + 1, pw - 2, fh - 2);
                        const g = ctx.createLinearGradient(0, y0, 0, y0 + fh);
                        g.addColorStop(0, 'rgba(255,230,180,0.22)'); g.addColorStop(0.5, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.25)');
                        ctx.fillStyle = g; ctx.fillRect(xx + 1, y0 + 1, pw - 2, fh - 2);
                        ctx.strokeStyle = 'rgba(60,34,14,0.45)'; ctx.lineWidth = 0.8;       // veta de la fusta
                        pc.veta.forEach(([dy, c1, c2]) => {
                            const yy = y0 + dy;
                            ctx.beginPath(); ctx.moveTo(xx + 2, yy); ctx.bezierCurveTo(xx + pw * 0.3, yy + c1, xx + pw * 0.6, yy + c2, xx + pw - 2, yy); ctx.stroke();
                        });
                        if (pc.nus) {                                                        // nus
                            const kx = xx + pc.nus[0], ky = y0 + pc.nus[1];
                            ctx.fillStyle = 'rgba(50,28,10,0.55)'; ctx.beginPath(); ctx.ellipse(kx, ky, 3, 2, 0, 0, Math.PI * 2); ctx.fill();
                            ctx.strokeStyle = 'rgba(50,28,10,0.5)'; ctx.beginPath(); ctx.ellipse(kx, ky, 5.5, 3.6, 0, 0, Math.PI * 2); ctx.stroke();
                        }
                        ctx.fillStyle = 'rgba(30,18,8,0.7)';                                  // claus a les juntes
                        ctx.fillRect(xx + 3, y0 + 4, 1.5, 1.5); ctx.fillRect(xx + 3, y0 + fh - 6, 1.5, 1.5);
                    };
                    const xx = x % w;
                    dibuixa(xx);
                    if (xx + pc.pw > w) dibuixa(xx - w);                                  // la part que surt per la dreta entra per l'esquerra
                    x += pc.pw;
                });
            }
        });
        // Taula de fusta, vista de tres quarts, amb un bol i una tassa
        crea('taula', 170, 110, (ctx, w, h) => {
            ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.beginPath(); ctx.ellipse(85, h - 8, 74, 8, 0, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = FUSTA_CONTORN; ctx.lineWidth = 2; ctx.lineJoin = 'round';
            const pota = (x, y0, y1, ample) => {
                const g = ctx.createLinearGradient(x, 0, x + ample, 0); g.addColorStop(0, '#6a4220'); g.addColorStop(1, '#3e2410');
                ctx.fillStyle = g; ctx.fillRect(x, y0, ample, y1 - y0); ctx.strokeRect(x, y0, ample, y1 - y0);
            };
            pota(20, 52, 88, 10); pota(140, 52, 88, 10);                                   // potes del darrere
            pota(10, 66, h - 10, 13); pota(147, 66, h - 10, 13);                           // potes del davant
            ctx.fillStyle = '#4a2c14'; ctx.fillRect(22, 80, 126, 6); ctx.strokeRect(22, 80, 126, 6);   // travesser
            // Tauler: cara de dalt (taulons) i cantell frontal
            const taulons = ['#c48a4c', '#b87e42', '#c48a4c', '#b87e42'];
            taulons.forEach((col, i) => {
                const y = 10 + i * 11;
                ctx.fillStyle = col; ctx.fillRect(4, y, 162, 11); ctx.strokeRect(4, y, 162, 11);
                ctx.strokeStyle = 'rgba(70,40,14,0.4)'; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(20 + i * 14, y + 5.5); ctx.lineTo(70 + i * 14, y + 5.5); ctx.moveTo(100 - i * 9, y + 5.5); ctx.lineTo(150 - i * 9, y + 5.5); ctx.stroke();
                ctx.strokeStyle = FUSTA_CONTORN; ctx.lineWidth = 2;
            });
            ctx.fillStyle = '#8e5a2a'; ctx.fillRect(4, 54, 162, 12); ctx.strokeRect(4, 54, 162, 12);
            ctx.fillStyle = 'rgba(255,230,180,0.3)'; ctx.fillRect(8, 12, 154, 2);
            // Bol de fusta i tassa d'estany
            ctx.fillStyle = '#6a4220'; ctx.beginPath(); ctx.ellipse(52, 30, 15, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#e8d8a0'; ctx.beginPath(); ctx.ellipse(52, 29, 11, 4.5, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#9a9a96'; ctx.fillRect(112, 18, 12, 14); ctx.strokeRect(112, 18, 12, 14);
            ctx.fillStyle = '#6a3a1a'; ctx.beginPath(); ctx.ellipse(118, 18, 6, 2.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        });
        // Tamboret rodó de tres potes
        crea('tamboret', 58, 62, (ctx, w, h) => {
            ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.beginPath(); ctx.ellipse(29, h - 6, 24, 5, 0, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = FUSTA_CONTORN; ctx.lineWidth = 2; ctx.lineJoin = 'round';
            [[14, 28, 8, h - 8], [44, 28, 50, h - 8], [29, 36, 29, h - 4]].forEach(([x0, y0, x1, y1]) => {
                ctx.strokeStyle = FUSTA_CONTORN; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
                ctx.strokeStyle = '#5e3a1c'; ctx.lineWidth = 4.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
            });
            ctx.strokeStyle = FUSTA_CONTORN; ctx.lineWidth = 2;
            ctx.fillStyle = '#8e5a2a'; ctx.beginPath(); ctx.ellipse(29, 24, 23, 11, 0, 0, Math.PI); ctx.lineTo(6, 19); ctx.closePath(); ctx.fill(); ctx.stroke();     // gruix
            ctx.fillStyle = '#c48a4c'; ctx.beginPath(); ctx.ellipse(29, 19, 23, 11, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.strokeStyle = 'rgba(70,40,14,0.5)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.ellipse(29, 19, 15, 7, 0, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.ellipse(29, 19, 7, 3.4, 0, 0, Math.PI * 2); ctx.stroke();
        });
        // En Jusef al partit de ping-pong: el cos i el cap sense braços (els braços i la pala són a part i es mouen)
        // Biblioteca del Monestir (js/dibuixos_biblio.js)
        [['prestatge_a', 162, 4, 3], ['prestatge_b', 212, 4, 11], ['prestatge_c', 162, 4, 17]].forEach(([k, w, files, llavor]) => crea(k, w, 202, (ctx, w2, h2) => pintarPrestatgeBiblio(ctx, w2, h2, files, llavor)));
        [['prestatge_l1', 132, 31], ['prestatge_l2', 132, 37], ['prestatge_l3', 162, 41], ['prestatge_l4', 132, 43], ['prestatge_l5', 132, 47], ['prestatge_l6', 162, 53]].forEach(([k, w, llavor]) => crea(k, w, 170, (ctx, w2, h2) => pintarPrestatgeBiblio(ctx, w2, h2, 3, llavor)));
        crea('prestatge_lat_e', 40, 600, (ctx, w, h) => pintarPrestatgeLateralBiblio(ctx, w, h, 7, true));
        crea('prestatge_lat_d', 40, 600, (ctx, w, h) => pintarPrestatgeLateralBiblio(ctx, w, h, 8, false));
        [['pila_a', 4, 5], ['pila_b', 3, 6], ['pila_c', 5, 7]].forEach(([k, n, llavor]) => crea(k, 52, 12 + n * 10 + 10, (ctx, w, h) => pintarPilaBiblio(ctx, w, h, n, llavor)));
        crea('vitrall_biblio', 118, 190, pintarVitrallBiblio);
        crea('globus_biblio', 72, 108, pintarGlobusBiblio);
        crea('cadira_biblio', 54, 76, pintarCadiraBiblio);
        crea('faristol_cronica', 100, 140, pintarFaristolCronica);
        crea('escala_biblio', 76, 232, pintarEscalaBiblio);
        crea('taula_lectura', 450, 112, pintarTaulaBiblio);
        crea('catifa_biblio', 160, 640, pintarCatifaBiblio);
        crea('parquet_biblio', 64, 64, pintarParquetBiblio);
        crea('paret_biblio', 984, 214, pintarParetBiblio);
        crea('lloses_rebedor', 128, 128, pintarLosesRebedor);
        // Mobles de cel·la (js/dibuixos_cela.js), que fa servir la casa d'en Georgi
        crea('llar_cela', 200, 170, pintarLlarCela);
        crea('llit_cela', 120, 180, pintarLlitCela);
        crea('taula_cela', 120, 90, pintarTaulaCela);
        crea('cadira_cela', 48, 70, pintarCadiraCela);
        crea('finestra_cela', 80, 110, pintarFinestraCela);
        crea('estora_cela', 230, 110, pintarEstoraCela);
        // El taller del Galf, a la cel·la de Sant Antoni (js/dibuixos_taller.js)
        crea('paret_taller', 760, 200, pintarParetTaller);
        crea('caldera_taller', 200, 240, pintarCalderaTaller);
        crea('engr_gran', 100, 100, (ctx, w, h) => pintarEngranatgeTaller(ctx, w, h, 14));
        crea('engr_petit', 60, 60, (ctx, w, h) => pintarEngranatgeTaller(ctx, w, h, 9));
        crea('banc_taller', 250, 150, pintarBancTaller);
        crea('lab_taller', 230, 170, pintarLabTaller);
        crea('llit_galf', 160, 110, pintarLlitGalf);
        crea('enclusa_taller', 120, 170, pintarEnclusaTaller);
        crea('trastos_taller', 150, 90, pintarTrastosTaller);
        crea('catifa_taller', 240, 120, pintarCatifaTaller);
        // Casa d'en Georgi i la caseta de joc (js/dibuixos_georgi.js)
        crea('paret_masia', 780, 200, pintarParetMasia);
        crea('tauler_eines', 270, 72, pintarTaulerEines);
        crea('penjolls', 96, 120, pintarPenjolls);
        crea('gat_cove', 110, 80, pintarGatCove);
        crea('cofre_joguines', 96, 84, (ctx, w, h) => pintarCofreJoguines(ctx, w, h, false));
        crea('cofre_joguines_obert', 96, 84, (ctx, w, h) => pintarCofreJoguines(ctx, w, h, true));
        // L'oratori amagat de darrere la pedra que escolta (js/dibuixos_oratori.js)
        crea('paret_oratori', 640, 250, pintarParetOratori);
        crea('reliquiari', 150, 170, (ctx, w, h) => pintarReliquiari(ctx, w, h, false));
        crea('reliquiari_obert', 150, 170, (ctx, w, h) => pintarReliquiari(ctx, w, h, true));
        crea('canelobre', 44, 130, pintarCanelobre);
        crea('faristol', 80, 110, pintarFaristol);
        // Pròleg (js/dibuixos_proleg.js): els cinc quadres pintats
        crea('proleg_ocellaire', 720, 950, pintarProlegOcellaire);
        crea('proleg_segell', 720, 950, pintarProlegSegell);
        crea('proleg_boira', 720, 950, pintarProlegBoira);
        crea('proleg_nens', 720, 950, pintarProlegNens);
        crea('proleg_mati', 720, 950, pintarProlegMati);
        // Casa Gran per dins (js/dibuixos_casa.js)
        crea('paret_cripta', 740, 170, pintarParetCripta);
        crea('paret_tresor', 740, 170, pintarParetTresor);
        crea('mur_passadis', 40, 1400, pintarMurPassadis);
        crea('fons_passadis', 400, 90, pintarFonsPassadis);
        crea('costella_passadis', 400, 44, pintarCostellaPassadis);
        crea('sarcofag_cripta', 150, 110, pintarSarcofagCripta);
        crea('llosa_cripta', 200, 120, (ctx, w, h) => pintarLlosaCripta(ctx, w, h, true));
        crea('llosa_cripta_buida', 200, 120, (ctx, w, h) => pintarLlosaCripta(ctx, w, h, false));
        crea('sacs_tresor', 140, 96, pintarSacsTresor);
        crea('sac', 60, 74, pintarSac);
        crea('sac_b', 60, 74, pintarSacB);
        crea('molla_tresor', 72, 34, pintarMollaTresor);
        crea('bota_creu', 64, 84, pintarBotaCreu);
        crea('taula_llibre', 150, 100, pintarTaulaLlibre);
        crea('cofre_tresor', 110, 80, (ctx, w, h) => pintarCofre(ctx, w, h, false));
        crea('cofre_tresor_obert', 110, 80, (ctx, w, h) => pintarCofre(ctx, w, h, true));
        crea('escalinata_fons', 1140, 640, pintarEscalinata);
        // Ermita de la Desaparició (js/dibuixos_ermita.js)
        crea('paret_ermita', 800, 170, pintarParetErmita);
        crea('mur_ermita', 40, 700, pintarMurErmita);
        crea('mur_baix_sala', 740, 64, (ctx, w, h) => { carreusErmita(ctx, 0, 0, w, h, 913, [150, 136, 118], 24); ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(0, 0, w, 6); });
        crea('pilastra_ermita', 54, 170, pintarPilastraErmita);
        crea('catifa_ermita', 120, 440, pintarCatifaErmita);
        crea('graons_ermita', 380, 90, pintarGraonsErmita);
        crea('altar_ermita', 150, 118, pintarAltarAustera);
        crea('candelabre_apagat', 36, 112, pintarCandelabreApagat);
        crea('ofrenes_ermita', 130, 44, pintarOfrenesErmita);
        crea('candelabre_hall', 44, 112, pintarCandelabreHall);
        crea('banner_hall', 60, 150, pintarBannerHall);
        // Barril de fusta amb cèrcols de ferro, dogues i tapa
        crea('barril', 64, 84, pintarBarril);
        // Gerros i pots de l'estanteria: àmfora d'argila, pot amb tap de suro i ampolla de vidre
        [0, 1, 2].forEach(t => crea('gerro_' + t, 34, 46, (ctx, w, h) => pintarGerro(ctx, w, h, t)));
        // Pila de llenya (extrems dels troncs amb anells) amb un tronc a sobre
        crea('llenya', 124, 84, (ctx, w, h) => {
            ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.beginPath(); ctx.ellipse(62, h - 6, 56, 6, 0, 0, Math.PI * 2); ctx.fill();
            const tronc = (cx, cy, r, tint) => {
                ctx.strokeStyle = FUSTA_CONTORN; ctx.lineWidth = 2;
                ctx.fillStyle = '#5a3a1e'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();      // escorça
                ctx.fillStyle = tint; ctx.beginPath(); ctx.arc(cx, cy, r - 3, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = 'rgba(80,46,18,0.55)'; ctx.lineWidth = 1;
                for (let k = r - 6; k > 2; k -= 3.5) { ctx.beginPath(); ctx.arc(cx + 0.5, cy, k, 0, Math.PI * 2); ctx.stroke(); }
                ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + r - 4, cy - 2); ctx.stroke();
            };
            const tints = ['#d8a868', '#cc9a5a', '#e0b070', '#c8955a'];
            let i = 0;
            [[4, 24], [3, 38], [2, 52]].forEach(([n, y]) => {
                const r = 13, x0 = 62 - (n - 1) * r;
                for (let k = 0; k < n; k++) tronc(x0 + k * 2 * r, h - 8 - (66 - y) * 0 - r - (4 - n) * 22 + 0 * y, r, tints[i++ % 4]);
            });
        });
        // Tronc de picar llenya amb una destral clavada
        crea('tronc_tall', 96, 90, pintarTroncDestral);
        // Marcs de pergamí per als quadres de diàleg, el HUD i el menú (es fan servir amb nineslice: vegeu marcPergami a ui.js)
        crea('marc_gran', 2 * MARC_GRAN + 20, 2 * MARC_GRAN + 20, (ctx, w) => dibuixarMarc(ctx, w, MARC_GRAN, 1));
        crea('marc_peti', 2 * MARC_PETI + 20, 2 * MARC_PETI + 20, (ctx, w) => dibuixarMarc(ctx, w, MARC_PETI, 0.7));
        crea('cinta_nom', 76, 60, (ctx, w, h) => {
            const g = ctx.createLinearGradient(0, 0, 0, h);
            g.addColorStop(0, '#9a2c34'); g.addColorStop(1, '#601820');
            ctx.fillStyle = g; ctx.fillRect(0, 5, w, h - 10);
            ctx.globalCompositeOperation = 'destination-out';      // cua de cinta (tall en V) als dos extrems
            ctx.beginPath(); ctx.moveTo(-1, 4); ctx.lineTo(15, h / 2); ctx.lineTo(-1, h - 4); ctx.fill();
            ctx.beginPath(); ctx.moveTo(w + 1, 4); ctx.lineTo(w - 15, h / 2); ctx.lineTo(w + 1, h - 4); ctx.fill();
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = '#e0bd55'; ctx.lineWidth = 1.6;
            ctx.beginPath(); ctx.moveTo(20, 9); ctx.lineTo(w - 20, 9); ctx.moveTo(20, h - 9); ctx.lineTo(w - 20, h - 9); ctx.stroke();
            ctx.strokeStyle = 'rgba(30,8,10,0.75)'; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.moveTo(0, 5); ctx.lineTo(w, 5); ctx.moveTo(0, h - 5); ctx.lineTo(w, h - 5); ctx.stroke();
        });
        // Clariana de gespa tallada (vora difuminada): s'estén sobre l'herba
        crea('clariana', 256, 160, (ctx, w, h) => {
            ctx.translate(w / 2, h / 2); ctx.scale(1, h / w);
            const g = ctx.createRadialGradient(0, 0, 0, 0, 0, w / 2);
            g.addColorStop(0, 'rgba(158,212,98,0.55)'); g.addColorStop(0.6, 'rgba(158,212,98,0.4)'); g.addColorStop(1, 'rgba(158,212,98,0)');
            ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, w / 2, 0, Math.PI * 2); ctx.fill();
        });
        // Medalló d'objecte (HUD, dreta). La icona de la tarota del sarró la crea js/icones.js (clau 'icona_flauta'); aquí no s'ha de duplicar
        crea('medallo', 88, 88, pintarMedallo);
        // Icona del sarró (inventari): bossa de cuir amb solapa, sivella i corretja
        crea('icona_sarro', 64, 64, pintarIconaSarro);
        // Icona dels consells: un pergamí enrotllat amb unes línies d'escriptura
        crea('icona_consells', 64, 64, pintarIconaConsells);
        // Altar de pedra del presbiteri (desar partida i reposar)
        crea('altar', 150, 118, pintarAltarPedra);
    }
};

// ---------- Botons del HUD (medalló, sarró i consells) ----------
// Es fan servir com a dibuix provisional de `boto_sarro` i `boto_consells` (vegeu CATALEG) mentre no hi hagi el PNG definitiu.
function pintarMedallo(ctx, w) {
        const c = w / 2;
        const fusta = ctx.createLinearGradient(0, 0, w, w);
        fusta.addColorStop(0, '#6e4626'); fusta.addColorStop(1, '#3e2410');
        ctx.fillStyle = '#1e1008'; ctx.beginPath(); ctx.arc(c, c, c - 1, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = fusta; ctx.beginPath(); ctx.arc(c, c, c - 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#d9b441'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(c, c, c - 4, 0, Math.PI * 2); ctx.stroke();
        const pergami = ctx.createRadialGradient(c, c, 2, c, c, c - 10);
        pergami.addColorStop(0, '#f1e3b6'); pergami.addColorStop(1, '#d6bd82');
        ctx.fillStyle = pergami; ctx.beginPath(); ctx.arc(c, c, c - 10, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(112,72,30,0.8)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(c, c, c - 14, 0, Math.PI * 2); ctx.stroke();
}
// Icona del sarró (inventari): bossa de cuir amb solapa, sivella i corretja
function pintarIconaSarro(ctx) {
        ctx.strokeStyle = '#3a2412'; ctx.lineWidth = 2.4; ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.moveTo(18, 26); ctx.quadraticCurveTo(32, 2, 46, 26); ctx.stroke();
        ctx.fillStyle = '#9a6a3a'; ctx.beginPath(); ctx.roundRect(12, 24, 40, 32, 8); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#7a4e28'; ctx.beginPath(); ctx.moveTo(12, 30); ctx.quadraticCurveTo(12, 24, 20, 24); ctx.lineTo(44, 24);
        ctx.quadraticCurveTo(52, 24, 52, 30); ctx.lineTo(50, 40); ctx.quadraticCurveTo(32, 48, 14, 40); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#d9b441'; ctx.beginPath(); ctx.arc(32, 42, 3.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(240,210,160,0.6)'; ctx.lineWidth = 1.4; ctx.setLineDash([2, 3]);
        ctx.beginPath(); ctx.moveTo(17, 51); ctx.lineTo(47, 51); ctx.stroke(); ctx.setLineDash([]);
}
// Icona dels consells: un pergamí enrotllat amb unes línies d'escriptura
function pintarIconaConsells(ctx) {
        ctx.strokeStyle = '#3a2412'; ctx.lineWidth = 2.4; ctx.lineJoin = 'round';
        ctx.fillStyle = '#f1e3b6'; ctx.beginPath(); ctx.roundRect(16, 12, 32, 40, 4); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#d6bd82'; ctx.beginPath(); ctx.ellipse(32, 12, 18, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(32, 52, 18, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(58,36,18,0.75)'; ctx.lineWidth = 2;
        [[22, 24, 42], [22, 31, 40], [22, 38, 36]].forEach(([x, y, x2]) => { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y); ctx.stroke(); });
}
function pintarBoto(ctx, W, icona) {
    ctx.scale(W / 88, W / 88); pintarMedallo(ctx, 88); ctx.translate(12, 12); icona(ctx);
}

// ---------- Marc de pergamí ----------
// Quadrat de (2C + 20) px: les cantonades (C px) porten els ornaments i la resta es pot estirar sense que es noti.
const MARC_GRAN = 44, MARC_PETI = 30;

function dibuixarMarc(ctx, T, C, k) {
    const rr = (x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };
    // Fusta fosca amb filets d'or
    rr(0, 0, T, T, 9); ctx.fillStyle = '#1e1008'; ctx.fill();
    const fusta = ctx.createLinearGradient(0, 0, T, T);
    fusta.addColorStop(0, '#6e4626'); fusta.addColorStop(0.5, '#47290f'); fusta.addColorStop(1, '#5e3a1c');
    rr(2.5, 2.5, T - 5, T - 5, 7); ctx.fillStyle = fusta; ctx.fill();
    rr(2.5, 2.5, T - 5, T - 5, 7); ctx.strokeStyle = '#d9b441'; ctx.lineWidth = 1.6; ctx.stroke();
    rr(8.5, 8.5, T - 17, T - 17, 2); ctx.strokeStyle = '#b08a2c'; ctx.lineWidth = 1.2; ctx.stroke();

    // Pergamí amb les vores cremades
    const m = 11, pw = T - 2 * m;
    const fons = ctx.createRadialGradient(T / 2, T / 2, 0, T / 2, T / 2, T * 0.75);
    fons.addColorStop(0, '#f1e3b6'); fons.addColorStop(1, '#dcc58c');
    ctx.fillStyle = fons; ctx.fillRect(m, m, pw, pw);
    const crema = (x0, y0, x1, y1, bx, by, bw, bh) => {
        const g = ctx.createLinearGradient(x0, y0, x1, y1);
        g.addColorStop(0, 'rgba(112,64,18,0.55)'); g.addColorStop(1, 'rgba(112,64,18,0)');
        ctx.fillStyle = g; ctx.fillRect(bx, by, bw, bh);
    };
    crema(m, 0, m + 14, 0, m, m, 14, pw); crema(T - m, 0, T - m - 14, 0, T - m - 14, m, 14, pw);
    crema(0, m, 0, m + 14, m, m, pw, 14); crema(0, T - m, 0, T - m - 14, m, T - m - 14, pw, 14);
    // Taques lleugeres
    let llavor = 9;
    const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
    for (let i = 0; i < 14; i++) {
        ctx.fillStyle = 'rgba(150,100,40,' + (0.04 + rnd() * 0.05) + ')';
        ctx.beginPath(); ctx.ellipse(m + 10 + rnd() * (pw - 20), m + 10 + rnd() * (pw - 20), 3 + rnd() * 9, 2 + rnd() * 6, rnd() * 3, 0, Math.PI * 2); ctx.fill();
    }
    // Doble filet marró a dins
    ctx.strokeStyle = 'rgba(112,72,30,0.85)'; ctx.lineWidth = 1.2; ctx.strokeRect(m + 7, m + 7, pw - 14, pw - 14);
    ctx.strokeStyle = 'rgba(112,72,30,0.5)'; ctx.lineWidth = 0.6; ctx.strokeRect(m + 10, m + 10, pw - 20, pw - 20);

    // Ornaments de cantonada: rosassa daurada i dos arcs
    [[0, 0, 1, 1], [T, 0, -1, 1], [0, T, 1, -1], [T, T, -1, -1]].forEach(([x, y, sx, sy]) => {
        ctx.save(); ctx.translate(x, y); ctx.scale(sx * k, sy * k);
        ctx.strokeStyle = 'rgba(122,78,24,0.9)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(14, 14, 24, 0.12, Math.PI / 2 - 0.12); ctx.stroke();
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(14, 14, 31, 0.3, Math.PI / 2 - 0.3); ctx.stroke();
        ctx.fillStyle = '#b08a2c';
        [[40, 17], [17, 40]].forEach(([fx, fy]) => { ctx.beginPath(); ctx.ellipse(fx, fy, 3.6, 1.8, Math.atan2(fy - 14, fx - 14) + Math.PI / 2, 0, Math.PI * 2); ctx.fill(); });
        const or = ctx.createRadialGradient(12, 12, 1, 14, 14, 11);
        or.addColorStop(0, '#fff0a8'); or.addColorStop(0.6, '#d9b441'); or.addColorStop(1, '#8e6a1c');
        ctx.fillStyle = or; ctx.strokeStyle = '#2a1608'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(14, 14, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#7a1c24'; ctx.beginPath(); ctx.arc(14, 14, 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#e0bd55';
        for (let a = 0; a < 8; a++) { ctx.beginPath(); ctx.arc(14 + Math.cos(a * Math.PI / 4) * 7, 14 + Math.sin(a * Math.PI / 4) * 7, 0.9, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
    });
}

// ---------- Neteja del fons blanc ----------
// Omple des de les vores tot el blanc connectat i el fa transparent. Els blancs interiors (ulls...) es conserven.
function treureFonsBlanc(px, w, h) {
    const esFons = i => {
        const r = px[i], g = px[i + 1], b = px[i + 2];
        const mn = Math.min(r, g, b), mx = Math.max(r, g, b);
        return mn >= 228 && mx - mn < 28;
    };
    const tret = new Uint8Array(w * h);
    const pila = [];
    const prova = (x, y) => {
        const p = y * w + x;
        if (!tret[p] && esFons(p * 4)) { tret[p] = 1; pila.push(p); }
    };
    for (let x = 0; x < w; x++) { prova(x, 0); prova(x, h - 1); }
    for (let y = 0; y < h; y++) { prova(0, y); prova(w - 1, y); }
    while (pila.length) {
        const p = pila.pop(), x = p % w, y = (p / w) | 0;
        if (x > 0) prova(x - 1, y);
        if (x < w - 1) prova(x + 1, y);
        if (y > 0) prova(x, y - 1);
        if (y < h - 1) prova(x, y + 1);
    }
    for (let p = 0; p < w * h; p++) {
        if (tret[p]) { px[p * 4 + 3] = 0; continue; }
        // Suavitza la vora: píxels clars que toquen el fons es tornen semitransparents
        const x = p % w, y = (p / w) | 0;
        const veiTret = (x > 0 && tret[p - 1]) || (x < w - 1 && tret[p + 1]) || (y > 0 && tret[p - w]) || (y < h - 1 && tret[p + w]);
        if (veiTret) {
            const i = p * 4, l = Math.min(px[i], px[i + 1], px[i + 2]);
            if (l > 170) px[i + 3] = Math.max(0, Math.min(255, ((255 - l) / 85) * 255));
        }
    }
}

// ---------- Dibuixos provisionals ----------
// ---------- Textures de terra grans i sense costures ----------
// Es repeteixen cada 256 px (abans 64): la repetició gairebé no es nota. Els elements que surten per una vora
// entren per l'altra, així que el mosaic encaixa perfectament.
const PALETA_HERBA = {
    base: '#5d8f3f',
    clapes: ['#7bb353', '#4a7a33', '#6aa04a', '#437028'],
    mig: ['#68a046', '#527f37', '#73a84d', '#4f8a38'],
    fulles: ['#86c25a', '#3f6f2a', '#9bd16a', '#356326']
};
const PALETA_HERBA_FOSCA = {
    base: '#3f6a30',
    clapes: ['#52843f', '#2f5424', '#487a38', '#2a4a20'],
    mig: ['#4a7a38', '#345a28', '#52843f', '#2f5a2a'],
    fulles: ['#5f9a48', '#27481d', '#6aa850', '#1f3d17']
};
const PALETA_LLAMBORDA = {
    junta: '#6e604b', files: 10, min: 22, max: 46, musgo: 0.2, arrodoniment: 5,
    pedres: ['#c3af90', '#b5a083', '#bfaa8b', '#a89478', '#cdb998', '#b09a7c']
};
const PALETA_PEDRA = {
    junta: '#4d4a45', files: 4, min: 56, max: 100, musgo: 0.25, arrodoniment: 9,
    pedres: ['#8c8a84', '#7d7b75', '#9a988f', '#6f6d68', '#a3a198', '#85837c']
};

function llavorRnd(llavor) {
    return () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
}

// Dibuixa un element a (x, y) i, si toca una vora, també a l'altra banda
function senseCostura(w, h, x, y, r, dibuixa) {
    for (const dx of [-w, 0, w]) for (const dy of [-h, 0, h]) {
        const px = x + dx, py = y + dy;
        if (px > -r && px < w + r && py > -r && py < h + r) dibuixa(px, py);
    }
}

function textureHerba(ctx, w, h, p, llavor) {
    const rnd = llavorRnd(llavor);
    ctx.fillStyle = p.base; ctx.fillRect(0, 0, w, h);
    // Clapes grans de to, suaus: trenquen la sensació de mosaic
    for (let i = 0; i < 46; i++) {
        const x = rnd() * w, y = rnd() * h, r = 28 + rnd() * 60, col = p.clapes[i % p.clapes.length];
        senseCostura(w, h, x, y, r, (px, py) => {
            const g = ctx.createRadialGradient(px, py, 0, px, py, r);
            g.addColorStop(0, col + '66'); g.addColorStop(1, col + '00');
            ctx.fillStyle = g; ctx.fillRect(px - r, py - r, 2 * r, 2 * r);
        });
    }
    // Taques mitjanes
    for (let i = 0; i < 420; i++) {
        const x = rnd() * w, y = rnd() * h, rx = 2 + rnd() * 4, ry = 1.4 + rnd() * 2.4, a = rnd() * 3, col = p.mig[i % p.mig.length];
        senseCostura(w, h, x, y, 8, (px, py) => {
            ctx.globalAlpha = 0.55; ctx.fillStyle = col;
            ctx.beginPath(); ctx.ellipse(px, py, rx, ry, a, 0, Math.PI * 2); ctx.fill();
        });
    }
    // Pues d'herba: clars i foscos, inclinats cap amunt
    ctx.lineCap = 'round';
    for (let i = 0; i < 1500; i++) {
        const x = rnd() * w, y = rnd() * h, len = 3 + rnd() * 5, ang = -Math.PI / 2 + (rnd() - 0.5) * 1.3;
        ctx.strokeStyle = p.fulles[i % p.fulles.length]; ctx.globalAlpha = 0.35 + rnd() * 0.4; ctx.lineWidth = 0.8 + rnd() * 0.6;
        senseCostura(w, h, x, y, 8, (px, py) => {
            ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(ang) * len, py + Math.sin(ang) * len); ctx.stroke();
        });
    }
    // Mates: una ombra petita amb cinc fulles en ventall
    for (let i = 0; i < 38; i++) {
        const x = rnd() * w, y = rnd() * h;
        senseCostura(w, h, x, y, 10, (px, py) => {
            ctx.globalAlpha = 0.28; ctx.fillStyle = '#10240a';
            ctx.beginPath(); ctx.ellipse(px, py + 1, 5, 2, 0, 0, Math.PI * 2); ctx.fill();
            for (let k = 0; k < 5; k++) {
                const a = -Math.PI / 2 + (k - 2) * 0.38, l = 6 + (k % 2 ? 0 : 3);
                ctx.globalAlpha = 0.8; ctx.strokeStyle = p.fulles[(i + k) % p.fulles.length]; ctx.lineWidth = 1.1;
                ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); ctx.stroke();
            }
        });
    }
    // Detalls esparsos: florinetes, trèvols i alguna pedreta
    ctx.globalAlpha = 1;
    const flors = ['#f4f0d0', '#f6e27a', '#f2b8d0', '#ffffff'];
    for (let i = 0; i < 20; i++) {
        const x = rnd() * w, y = rnd() * h;
        senseCostura(w, h, x, y, 4, (px, py) => {
            ctx.fillStyle = flors[i % flors.length]; ctx.beginPath(); ctx.arc(px, py, 1.1 + rnd() * 0.5, 0, Math.PI * 2); ctx.fill();
        });
    }
    for (let i = 0; i < 9; i++) {
        const x = rnd() * w, y = rnd() * h;
        senseCostura(w, h, x, y, 5, (px, py) => {
            ctx.fillStyle = 'rgba(140,136,120,0.7)'; ctx.beginPath(); ctx.ellipse(px, py, 2 + rnd() * 1.5, 1.3, rnd() * 3, 0, Math.PI * 2); ctx.fill();
        });
    }
    ctx.globalAlpha = 1;
}

// Llambordes / lloses irregulars: files de pedres de mides i tons diferents, amb juntes fosques, volum, esquerdes i molsa
function textureLloses(ctx, w, h, p, llavor) {
    const rnd = llavorRnd(llavor);
    ctx.fillStyle = p.junta; ctx.fillRect(0, 0, w, h);
    const fh = h / p.files;
    for (let f = 0; f < p.files; f++) {
        const y0 = f * fh;
        let amples = [], tot = 0;
        while (tot < w - p.min) { const a = p.min + rnd() * (p.max - p.min); amples.push(a); tot += a; }
        amples = amples.map(a => a * w / tot);
        let x = rnd() * amples[0];                          // cada fila comença a un punt diferent
        amples.forEach(a => {
            const ins = 1 + rnd() * 1.2, ww = a - 2 * ins, hh = fh - 2 * ins - rnd() * 2.5, yy = y0 + ins + rnd() * 1.5;
            const col = p.pedres[Math.floor(rnd() * p.pedres.length)];
            const claror = (rnd() - 0.5) * 0.22;           // cada pedra és una mica més clara o fosca
            const forma = { x: x + ins, y: yy, w: ww, h: hh };
            const moll = rnd() < p.musgo, mx = rnd(), my = rnd(), esquerda = rnd() < 0.28, cr = [rnd(), rnd(), rnd()];
            const gran = [];
            for (let k = 0; k < 9; k++) gran.push([rnd(), rnd(), rnd() < 0.5]);
            senseCostura(w, h, forma.x + ww / 2, forma.y + hh / 2, ww, (cx, cy) => {
                const px = cx - ww / 2, py = cy - hh / 2;
                ctx.save();
                ctx.beginPath(); ctx.roundRect(px, py, ww, hh, p.arrodoniment); ctx.clip();
                ctx.fillStyle = col; ctx.fillRect(px, py, ww, hh);
                ctx.fillStyle = claror > 0 ? `rgba(255,255,255,${claror})` : `rgba(0,0,0,${-claror})`; ctx.fillRect(px, py, ww, hh);
                // Volum: llum a dalt-esquerra i ombra a baix-dreta
                const g = ctx.createLinearGradient(px + ww * 0.2, py, px + ww * 0.5, py + hh);
                g.addColorStop(0, 'rgba(255,255,255,0.22)'); g.addColorStop(0.5, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,0.28)');
                ctx.fillStyle = g; ctx.fillRect(px, py, ww, hh);
                // Gra de la pedra
                gran.forEach(([gx, gy, clar]) => {
                    ctx.fillStyle = clar ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.16)';
                    ctx.fillRect(px + gx * ww, py + gy * hh, 1.2, 1.2);
                });
                if (moll) {
                    const gm = ctx.createRadialGradient(px + mx * ww, py + (my > 0.5 ? hh : 0), 0, px + mx * ww, py + (my > 0.5 ? hh : 0), ww * 0.38);
                    gm.addColorStop(0, 'rgba(84,128,52,0.5)'); gm.addColorStop(1, 'rgba(84,128,52,0)');
                    ctx.fillStyle = gm; ctx.fillRect(px, py, ww, hh);
                }
                if (esquerda) {
                    ctx.strokeStyle = 'rgba(30,22,14,0.45)'; ctx.lineWidth = 0.8;
                    ctx.beginPath(); ctx.moveTo(px + ww * (0.1 + cr[0] * 0.6), py + hh * 0.05);
                    ctx.lineTo(px + ww * (0.15 + cr[1] * 0.7), py + hh * 0.5); ctx.lineTo(px + ww * (0.1 + cr[2] * 0.8), py + hh * 0.95); ctx.stroke();
                }
                ctx.restore();
                // Cantell clar a dalt-esquerra i fosc a baix-dreta
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'rgba(255,255,255,0.28)';
                ctx.beginPath(); ctx.moveTo(px + p.arrodoniment, py + 0.5); ctx.lineTo(px + ww - p.arrodoniment, py + 0.5); ctx.moveTo(px + 0.5, py + p.arrodoniment); ctx.lineTo(px + 0.5, py + hh - p.arrodoniment); ctx.stroke();
                ctx.strokeStyle = 'rgba(0,0,0,0.35)';
                ctx.beginPath(); ctx.moveTo(px + p.arrodoniment, py + hh - 0.5); ctx.lineTo(px + ww - p.arrodoniment, py + hh - 0.5); ctx.moveTo(px + ww - 0.5, py + p.arrodoniment); ctx.lineTo(px + ww - 0.5, py + hh - p.arrodoniment); ctx.stroke();
            });
            x += a;
        });
    }
}

function soroll(ctx, w, h, fons, colors, n, rmin, rmax) {
    ctx.fillStyle = fons; ctx.fillRect(0, 0, w, h);
    let llavor = 7;
    const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
    for (let i = 0; i < n; i++) {
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.ellipse(rnd() * w, rnd() * h, rmin + rnd() * (rmax - rmin), rmin * 0.7, rnd() * 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

function dibuixarMonjo(canvas, w, o) {
    const h = Math.round(w * 4 / 3);
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    const s = w / 96;
    ctx.scale(s, s);
    ctx.lineWidth = 3; ctx.strokeStyle = '#120c08'; ctx.lineJoin = 'round';
    const alt = o.alt || 1;
    const capY = 128 - 108 * alt;
    const X = x => 48 + (x - 48) * (o.prim ? 0.76 : 1);      // prim: l'hàbit més estret
    // Hàbit
    ctx.fillStyle = o.habit;
    ctx.beginPath();
    ctx.moveTo(48, capY + 26); ctx.lineTo(X(70), capY + 40); ctx.lineTo(X(78), 122); ctx.lineTo(X(18), 122); ctx.lineTo(X(26), capY + 40);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // Cordó
    ctx.strokeStyle = '#c9b48a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(X(28), capY + 66); ctx.lineTo(X(68), capY + 66); ctx.stroke();
    ctx.strokeStyle = '#120c08';
    // Peus
    ctx.fillStyle = '#5b3a20';
    ctx.fillRect(30, 120, 12, 6); ctx.fillRect(54, 120, 12, 6);
    // Cap
    ctx.fillStyle = '#e8b48a';
    ctx.beginPath(); ctx.arc(48, capY + 14, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = o.cabell;
    ctx.beginPath(); ctx.arc(48, capY + 10, 15, Math.PI * 1.05, Math.PI * 1.95); ctx.fill();
    // Ulls
    ctx.fillStyle = '#120c08';
    ctx.fillRect(41, capY + 14, 3, 4); ctx.fillRect(52, capY + 14, 3, 4);
    if (o.barba) {                       // barba llarga que baixa fins al cordó
        ctx.fillStyle = o.barba; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(35, capY + 18); ctx.quadraticCurveTo(36, capY + 44, 48, capY + 64);
        ctx.quadraticCurveTo(60, capY + 44, 61, capY + 18); ctx.quadraticCurveTo(48, capY + 26, 35, capY + 18);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(120,120,120,0.6)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(44, capY + 30); ctx.lineTo(46, capY + 52); ctx.moveTo(52, capY + 30); ctx.lineTo(50, capY + 52); ctx.stroke();
        ctx.strokeStyle = '#120c08';
    }
    if (o.ulleres) {
        ctx.lineWidth = 2;
        ctx.strokeRect(37, capY + 11, 10, 9); ctx.strokeRect(49, capY + 11, 10, 9);
        ctx.beginPath(); ctx.moveTo(47, capY + 15); ctx.lineTo(49, capY + 15); ctx.stroke();
    }
    if (o.pilota) {
        ctx.lineWidth = 2;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(76, capY + 70, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#a50044'; ctx.fillRect(70, capY + 66, 5, 8);
        ctx.fillStyle = '#004d98'; ctx.fillRect(77, capY + 66, 5, 8);
    }
    if (o.llibre) {
        ctx.fillStyle = '#7a1f2a'; ctx.lineWidth = 2;
        ctx.fillRect(34, capY + 46, 28, 18); ctx.strokeRect(34, capY + 46, 28, 18);
        ctx.fillStyle = '#f2e6c8'; ctx.fillRect(36, capY + 48, 24, 3);
    }
}

function dibuixarEdifici(canvas, w, h, paret, teulada, nom) {
    canvas.width = w; canvas.height = Math.round(h);
    const ctx = canvas.getContext('2d');
    const tH = h * 0.22;
    ctx.fillStyle = paret; ctx.strokeStyle = '#3a2818'; ctx.lineWidth = 6;
    ctx.fillRect(10, tH, w - 20, h - tH - 10); ctx.strokeRect(10, tH, w - 20, h - tH - 10);
    ctx.fillStyle = teulada;
    ctx.beginPath(); ctx.moveTo(0, tH + 10); ctx.lineTo(w * 0.12, 6); ctx.lineTo(w * 0.88, 6); ctx.lineTo(w, tH + 10); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#2c3a4a';
    for (let x = w * 0.12; x < w * 0.88; x += w * 0.14) {
        ctx.fillRect(x, tH + h * 0.12, w * 0.05, h * 0.12);
        ctx.fillRect(x, tH + h * 0.36, w * 0.05, h * 0.12);
    }
    ctx.fillStyle = '#4a2c16';
    ctx.fillRect(w / 2 - w * 0.05, h - 10 - h * 0.24, w * 0.1, h * 0.24);
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(w / 2 - w * 0.2, tH - h * 0.13, w * 0.4, h * 0.1);
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `bold ${Math.round(h * 0.06)}px Georgia`;
    ctx.fillText(nom + ' (provisional)', w / 2, tH - h * 0.08);
}

function dibuixarCreu(canvas, w) {
    const h = w * 2.4; canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#a89a86'; ctx.strokeStyle = '#3a3026'; ctx.lineWidth = w * 0.05;
    ctx.fillRect(w * 0.15, h * 0.8, w * 0.7, h * 0.18); ctx.strokeRect(w * 0.15, h * 0.8, w * 0.7, h * 0.18);
    ctx.fillStyle = '#cfc3ae';
    ctx.fillRect(w * 0.42, h * 0.08, w * 0.16, h * 0.74); ctx.strokeRect(w * 0.42, h * 0.08, w * 0.16, h * 0.74);
    ctx.fillRect(w * 0.18, h * 0.22, w * 0.64, w * 0.16); ctx.strokeRect(w * 0.18, h * 0.22, w * 0.64, w * 0.16);
}

function dibuixarBassadoria(canvas, w) {
    const h = w * 0.55; canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#9c8e7a'; ctx.strokeStyle = '#3a3026'; ctx.lineWidth = w * 0.015;
    ctx.beginPath(); ctx.ellipse(w / 2, h / 2, w * 0.48, h * 0.45, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#4b5a4c';
    ctx.beginPath(); ctx.ellipse(w / 2, h / 2, w * 0.40, h * 0.34, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(80,40,110,0.45)';
    ctx.beginPath(); ctx.ellipse(w * 0.45, h * 0.48, w * 0.26, h * 0.18, 0.2, 0, Math.PI * 2); ctx.fill();
}

function dibuixarHomeRaim(canvas, w) {
    const h = w * 2.2; canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#3a3026'; ctx.lineWidth = w * 0.04;
    ctx.fillStyle = '#a39888';
    ctx.fillRect(w * 0.1, h * 0.82, w * 0.8, h * 0.16); ctx.strokeRect(w * 0.1, h * 0.82, w * 0.8, h * 0.16);
    ctx.fillStyle = '#bdb2a0';
    ctx.fillRect(w * 0.28, h * 0.25, w * 0.44, h * 0.58); ctx.strokeRect(w * 0.28, h * 0.25, w * 0.44, h * 0.58);
    // Cap del revés: es veu el clatell (sense cara)
    ctx.beginPath(); ctx.arc(w / 2, h * 0.17, w * 0.17, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#8f8574';
    ctx.beginPath(); ctx.arc(w / 2, h * 0.15, w * 0.17, Math.PI, 0); ctx.fill();
    // Carràs de raïm
    ctx.fillStyle = '#5b2a6e';
    for (let i = 0; i < 6; i++) {
        const fx = w / 2 + ((i % 3) - 1) * w * 0.09, fy = h * 0.44 + Math.floor(i / 3) * w * 0.1;
        ctx.beginPath(); ctx.arc(fx, fy, w * 0.06, 0, Math.PI * 2); ctx.fill();
    }
    ctx.beginPath(); ctx.arc(w / 2, h * 0.44 + w * 0.2, w * 0.06, 0, Math.PI * 2); ctx.fill();
}

function dibuixarArbre(canvas, w) {
    const h = w * 1.15; canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#5a3a1e'; ctx.strokeStyle = '#1f140a'; ctx.lineWidth = w * 0.02;
    ctx.fillRect(w * 0.44, h * 0.55, w * 0.12, h * 0.42); ctx.strokeRect(w * 0.44, h * 0.55, w * 0.12, h * 0.42);
    const copes = [[0.5, 0.32, 0.3], [0.3, 0.45, 0.22], [0.7, 0.45, 0.22], [0.5, 0.5, 0.24]];
    ctx.fillStyle = '#3f7a34';
    copes.forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(w * x, h * y, w * r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    ctx.fillStyle = '#4f9142';
    copes.forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(w * x - w * 0.04, h * y - w * 0.05, w * r * 0.6, 0, Math.PI * 2); ctx.fill(); });
}

function dibuixarXiprer(canvas, w) {
    const h = w * 3.2; canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#5a3a1e'; ctx.fillRect(w * 0.42, h * 0.9, w * 0.16, h * 0.1);
    ctx.fillStyle = '#2f5a2a'; ctx.strokeStyle = '#13240f'; ctx.lineWidth = w * 0.04;
    ctx.beginPath(); ctx.ellipse(w / 2, h * 0.5, w * 0.45, h * 0.42, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#3d7034';
    ctx.beginPath(); ctx.ellipse(w * 0.42, h * 0.45, w * 0.2, h * 0.3, 0, 0, Math.PI * 2); ctx.fill();
}

function dibuixarRetaule(canvas, w) {
    const h = w * 0.75; canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#8a6a1c'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#d4af37';
    for (let i = 0; i < 5; i++) ctx.fillRect(w * (0.04 + i * 0.2), h * 0.05, w * 0.12, h * 0.9);
    ctx.fillStyle = '#3a2a10';
    for (let i = 0; i < 4; i++) ctx.fillRect(w * (0.17 + i * 0.2), h * 0.25, w * 0.06, h * 0.3);
    ctx.fillStyle = '#f2e6c8';
    ctx.beginPath(); ctx.arc(w / 2, h * 0.38, w * 0.05, 0, Math.PI * 2); ctx.fill();
}
