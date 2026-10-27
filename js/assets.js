/**
 * GRÀFICS
 * - CATALEG: PNG que el joc intenta carregar de la carpeta assets/.
 *   Si un PNG no hi és, es dibuixa un marcador provisional (funció `provisional`).
 *   Quan hi posis el PNG definitiu (encara que tingui fons blanc), apareixerà sol.
 * - Els PNG es redueixen a la mida de joc i se'ls treu el fons blanc automàticament.
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
    { key: 'pare_jordi',   file: 'assets/personatges/pare_jordi.webp',   amplada: 76, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#1d1b22', alt: 1.08, ulleres: true, cabell: '#9c9c9c' }) },
    { key: 'germa_andreu', file: 'assets/personatges/germa_andreu.webp', amplada: 84, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#2a2230', cabell: '#d8d8dc', ulleres: true, pilota: true }) },
    { key: 'pare_daniel',  file: 'assets/personatges/pare_daniel.webp',  amplada: 120, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#1d1b22', cabell: '#5a4636' }) },
    { key: 'monja_pains',   file: 'assets/personatges/monja_pains.png',   amplada: 110, provisional: (c, w) => dibuixarMonja(c, w, { cadira: true, cabell: '#e8e8e8', ample: 0.95 }) },
    { key: 'monja_charm',   file: 'assets/personatges/monja_charm.png',   amplada: 110, provisional: (c, w) => dibuixarMonja(c, w, { cabell: '#6a4a2e', ample: 1.45, alt: 0.92 }) },
    { key: 'monja_phili',   file: 'assets/personatges/monja_phili.png',   amplada: 96,  provisional: (c, w) => dibuixarMonja(c, w, { cabell: '#3b2a1e', ulleres: true, ample: 0.8, alt: 1.06 }) },
    { key: 'germa_francesc', file: 'assets/personatges/germa_francesc.webp', amplada: 78, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#3a2c22', cabell: '#e8e8e8', alt: 1.14, prim: true, barba: '#ececec' }) },
    { key: 'pare_alcui',   file: 'assets/personatges/pare_alcui.webp',   amplada: 81, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#1d1b22', cabell: '#d8d8d8', llibre: true }) },
    // Elements
    { key: 'home_raim',    file: 'assets/personatges/home_raim.png',    amplada: 110, provisional: (c, w) => dibuixarHomeRaimMarbre(c, w) },
    { key: 'creu',         file: 'assets/objectes/creu.webp',        amplada: 150,  provisional: (c, w) => dibuixarCreuAparicio(c, w) },
    { key: 'creu_desaparicio', file: 'assets/objectes/creu.webp', amplada: 105, provisional: (c, w) => dibuixarCreuDesaparicio(c, w) },
    { key: 'bassadoria',   file: 'assets/objectes/bassadoria.png',   amplada: 520, provisional: (c, w) => dibuixarBassadoriaReixa(c, w) },
    { key: 'arbre',        file: 'assets/natura/arbre.webp',        amplada: 300, provisional: (c, w) => dibuixarArbre(c, w) },
    { key: 'pi',           file: 'assets/natura/pi.webp',           amplada: 230, provisional: (c, w) => dibuixarPi(c, w) },
    { key: 'pi_pinyer',    file: 'assets/natura/pi_pinyer.webp',    amplada: 470, provisional: (c, w) => dibuixarPiPinyer(c, w) },
    { key: 'caseta_joc',   file: 'assets/edificis/caseta_joc.png',   amplada: 270, provisional: (c, w) => dibuixarCasetaJoc(c, w) },
    { key: 'xiprer',       file: 'assets/natura/xiprer.webp',       amplada: 80,  provisional: (c, w) => dibuixarXiprer(c, w) },
    { key: 'retaule',      file: 'assets/edificis/retaule_tancat.webp', amplada: 800, provisional: (c, w) => dibuixarRetauleBarroc(c, w) },
    { key: 'retaule_obert', file: 'assets/edificis/retaule_obert.webp', amplada: 800, provisional: (c, w) => dibuixarRetauleBarroc(c, w) },   // porta de la dreta oberta (torre del rellotge)

    // ---- Edificis nous ----
    { key: 'sala_pingpong', file: 'assets/edificis/sala_pingpong.webp', amplada: 1200, provisional: (c, w) => dibuixarEdifici(c, w, w * 0.62, '#d8c8a8', '#3a5a8a', 'Sala del Ping-pong') },
    { key: 'cel_stbenet',   file: 'assets/edificis/cel_stbenet.png',   amplada: 560, provisional: (c, w) => dibuixarCelSantBenet(c, w) },
    { key: 'cel_ntrasra',   file: 'assets/edificis/cel_ntrasra.png',   amplada: 900, provisional: (c, w) => dibuixarCelNostraSenyora(c, w) },
    { key: 'ermita',        file: 'assets/edificis/ermita.webp',        amplada: 620, provisional: (c, w) => dibuixarErmitaDesaparicio(c, w) },
    { key: 'hostatgeria',    file: 'assets/edificis/hostatgeria.webp',    amplada: 1100, provisional: (c, w) => dibuixarHostatgeria(c, w) },

    // ---- Personatges nous ----
    { key: 'pianista',  file: 'assets/personatges/pianista.png',  amplada: 100, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#6a3a6a', cabell: '#c8c8c8', dona: true, ample: 1.45, alt: 0.9, ulleres: true }) },
    { key: 'tieta',     file: 'assets/personatges/tieta.png',     amplada: 96,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#4a5a7a', cabell: '#d8d8d8', dona: true, ample: 1.1, alt: 0.88 }) },
    { key: 'tieta2',    file: 'assets/personatges/tieta2.png',    amplada: 96,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#7a4a4a', cabell: '#bcbcbc', dona: true, ample: 1.2, alt: 0.86, ulleres: true }) },
    { key: 'neus',      file: 'assets/personatges/neus.png',      amplada: 96,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#b03a4a', cabell: '#3b2a1e', dona: true, ample: 1.1, alt: 1.0 }) },
    { key: 'marit_neus', file: 'assets/personatges/marit_neus.png', amplada: 96, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#4a6a7a', cabell: '#5a4636', alt: 0.98, calb: true }) },
    { key: 'yordi',     file: 'assets/personatges/yordi.png',     amplada: 96,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#3a7a5a', cabell: '#3b2a1e', alt: 0.96 }) },
    { key: 'judit',     file: 'assets/personatges/judit.png',     amplada: 96,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#d09a3a', cabell: '#6a3a1e', dona: true, alt: 0.92 }) },
    { key: 'daniel_t',  file: 'assets/personatges/daniel_t.png',  amplada: 96,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#5a5a8a', cabell: '#2a2a2a', alt: 1.02, ample: 1.05 }) },
    { key: 'turbo',     file: 'assets/personatges/turbo.png',     amplada: 80,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#e05a2a', cabell: '#3b2a1e', alt: 0.7, cap: 17 }) },
    { key: 'juli',      file: 'assets/personatges/juli.png',      amplada: 92,  provisional: (c, w) => dibuixarNpcPingpong(c, w, 'juli') },
    { key: 'frederic',  file: 'assets/personatges/frederic.png',  amplada: 100,  provisional: (c, w) => dibuixarNpcPingpong(c, w, 'frederic') },
    { key: 'eloi',      file: 'assets/personatges/eloi.png',      amplada: 104, provisional: (c, w) => dibuixarNpcPingpong(c, w, 'eloi') },
    { key: 'josep',     file: 'assets/personatges/josep.png',     amplada: 98,  provisional: (c, w) => dibuixarNpcPingpong(c, w, 'josep') },
    { key: 'garf',      file: 'assets/personatges/garf.png',      amplada: 96,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#8a6a3a', cabell: '#d9b45a', alt: 0.92, ample: 1.35, cap: 17 }) },
    { key: 'isidre',    file: 'assets/personatges/isidre.png',    amplada: 96,  provisional: (c, w) => dibuixarPersona(c, w, { isidre: true, calb: true, roba: '#f4f1e8', cabell: '#000000', alt: 0.94 }) },
    { key: 'jordi_caseta', file: 'assets/personatges/jordi_caseta.png', amplada: 96, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#6a7a3a', cabell: '#4a3a2a', alt: 0.97, extra: 'gorra' }) },
    { key: 'sansa',     file: 'assets/personatges/sansa.png',     amplada: 96,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#d8b04a', cabell: '#7a3a1e', dona: true, ample: 1.2, alt: 0.95 }) },
    { key: 'ciscu',     file: 'assets/personatges/ciscu.png',     amplada: 80,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#c8a040', cabell: '#5a3a1e', alt: 0.74, cap: 17, extra: 'gorra' }) },
    { key: 'carmen',    file: 'assets/personatges/carmen.png',    amplada: 96,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#7a3a5a', cabell: '#2a1a10', dona: true, ample: 1.25, alt: 0.98 }) },
    { key: 'eva',       file: 'assets/personatges/eva.png',       amplada: 96,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#3a7a5a', cabell: '#c8862a', dona: true, alt: 0.95, extra: 'cua' }) },
    { key: 'home_carruatge', file: 'assets/personatges/home_carruatge.png', amplada: 96, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#2f6b3d', cabell: '#222', alt: 1.04, extra: 'gorra' }) },

    // ---- Escenari nou ----
    { key: 'runes',     file: 'assets/edificis/runes.webp',     amplada: 760, provisional: (c, w) => dibuixarRunes(c, w) },
    ...Array.from({ length: 12 }, (_, k) => ({ key: 'columna_proces_' + k, file: 'assets/objectes/columna_proces_' + k + '.png', amplada: 64, provisional: (c, w) => dibuixarColumnaProcessio(c, w, k) })),
    { key: 'columna',   file: 'assets/objectes/columna.png',   amplada: 58,  provisional: (c, w) => dibuixarColumna(c, w) },
    { key: 'roure',     file: 'assets/natura/roure.webp',     amplada: 420, provisional: (c, w) => dibuixarRoure(c, w) },
    { key: 'tiller',    file: 'assets/personatges/tiller.png',    amplada: 340, provisional: (c, w) => dibuixarTiller(c, w) },
    { key: 'altar',     file: 'assets/objectes/altar.png',     amplada: 150, provisional: (c, w) => dibuixarAltar(c, w) },
    { key: 'taula_pedra', file: 'assets/objectes/taula_pedra.png', amplada: 130, provisional: (c, w) => dibuixarTaulaPedra(c, w, 0) },
    { key: 'taula_pedra2', file: 'assets/objectes/taula_pedra2.png', amplada: 130, provisional: (c, w) => dibuixarTaulaPedra(c, w, 6) },
    { key: 'font_sj',   file: 'assets/objectes/font_sj.png',   amplada: 190, provisional: (c, w) => dibuixarFontSJ(c, w) },
    { key: 'carruatge', file: 'assets/objectes/carruatge.png', amplada: 230, provisional: (c, w) => dibuixarCarruatge(c, w) },
    { key: 'carro_sansa', file: 'assets/objectes/carro_sansa.png', amplada: 220, provisional: (c, w) => dibuixarCarroSansa(c, w) },
    { key: 'pergola',   file: 'assets/edificis/pergola.png',   amplada: 260, provisional: (c, w) => dibuixarPergola(c, w) },
    { key: 'flors',     file: 'assets/natura/flors.png',     amplada: 90,  provisional: (c, w) => dibuixarFlors(c, w) },
    { key: 'taula_pp',  file: 'assets/objectes/taula_pp.png',  amplada: 240, provisional: (c, w) => dibuixarTaulaPP(c, w) },
    { key: 'alzina_buida', file: 'assets/natura/alzina_buida.webp', amplada: 520, provisional: (c, w) => dibuixarAlzinaBuida(c, w) },
    { key: 'llosa',     file: 'assets/objectes/llosa.png',     amplada: 90,  provisional: (c, w) => dibuixarLlosa(c, w) },

    // ---- Enemics ----
    { key: 'escolopendra', file: 'assets/enemics/escolopendra.png', amplada: 76, fotogrames: 8, provisional: (c, w) => dibuixarEscolopendra(c, w, 8) },   // full de 8 fotogrames (caminar)
    { key: 'gripau',       file: 'assets/enemics/gripau.png',       amplada: 56, provisional: (c, w) => dibuixarGripau(c, w) },
    { key: 'visitant',     file: 'assets/enemics/visitant.png',     amplada: 96, provisional: (c, w) => dibuixarTurista(c, w) },
    { key: 'branca',       file: 'assets/natura/branca.webp',       amplada: 80, provisional: (c, w) => dibuixarBranca(c, w) },
    { key: 'pergami',      file: 'assets/objectes/pergami.png',      amplada: 70, provisional: (c, w) => dibuixarPergami(c, w) },
    { key: 'pergami_partit', file: 'assets/objectes/pergami_partit.png', amplada: 80, provisional: (c, w) => dibuixarPergamiPartit(c, w) },
    { key: 'pergami_paret', file: 'assets/objectes/pergami_paret.png', amplada: 62, provisional: (c, w) => dibuixarPergamiParet(c, w) },   // el mateix pergamí, desplegat i clavat a la paret
    { key: 'ombra_monjo',  file: 'assets/enemics/ombra_monjo.png',  amplada: 150, provisional: (c, w) => dibuixarOmbraMonjo(c, w) },
    { key: 'ovella',         file: 'assets/enemics/ovella.png',         amplada: 70, provisional: (c, w) => dibuixarOvella(c, w, false) },
    { key: 'ovella_boira',   file: 'assets/enemics/ovella_boira.png',   amplada: 76, provisional: (c, w) => dibuixarOvella(c, w, true) },
    { key: 'roca',           file: 'assets/natura/roca.webp',           amplada: 90, provisional: (c, w) => dibuixarRoca(c, w) },
    { key: 'masia',          file: 'assets/edificis/masia.png',          amplada: 520, provisional: (c, w) => dibuixarMasia(c, w) },
    { key: 'pastor_a',       file: 'assets/personatges/pastor_a.png',       amplada: 96, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#6a5a48', cabell: '#8a7a60', alt: 0.9, ample: 0.95, calb: true }) },
    { key: 'pastor_b',       file: 'assets/personatges/pastor_b.png',       amplada: 96, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#5a4a58', cabell: '#7a7a7a', dona: true, alt: 0.88, ample: 0.95 }) },
    { key: 'pastor_vell',    file: 'assets/personatges/pastor_vell.png',    amplada: 96, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#5a5040', cabell: '#d0d0d0', barba: '#d0d0d0', alt: 0.86, bastoCoix: true }) },
    { key: 'foc',            file: 'assets/objectes/foc.png',            amplada: 80, provisional: (c, w) => dibuixarFoc(c, w) },
    { key: 'espelma',        file: 'assets/objectes/espelma.png',        amplada: 20, provisional: (c, w) => dibuixarEspelma(c, w) },
    { key: 'taula_sopar',    file: 'assets/objectes/taula_sopar.png',    amplada: 380, provisional: (c, w) => dibuixarTaulaSopar(c, w) },
    { key: 'ocellaire',      file: 'assets/enemics/ocellaire.webp',     amplada: 115, provisional: (c, w) => dibuixarOcellaire(c, w) },
    { key: 'ratpenat',       file: 'assets/enemics/ratpenat.png',       amplada: 64, provisional: (c, w) => dibuixarRatpenat(c, w) },
    { key: 'ferralla',       file: 'assets/enemics/ferralla.png',       amplada: 70, provisional: (c, w) => dibuixarFerralla(c, w) },
    { key: 'capoll',         file: 'assets/enemics/capoll.png',         amplada: 70, provisional: (c, w) => dibuixarCapoll(c, w) },
    { key: 'nen_uri',        file: 'assets/personatges/nen_uri.png',    amplada: 112, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#3a7ad0', cabell: '#3a2a1a', alt: 0.66, cap: 17 }) },
    { key: 'nen_flam',       file: 'assets/personatges/nen_flam.png',   amplada: 112, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#d04a3a', cabell: '#d08a30', alt: 0.62, cap: 17 }) },
    { key: 'nen_sardin',     file: 'assets/personatges/nen_sardin.png', amplada: 112, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#4a9a5a', cabell: '#1e1a16', alt: 0.6, cap: 17, extra: 'gorra' }) },
    { key: 'pastor_boira',   file: 'assets/enemics/pastor_boira.webp',   amplada: 88, provisional: (c, w) => dibuixarPastorBoira(c, w) },
    { key: 'bolet',          file: 'assets/enemics/bolet.webp',          amplada: 58, provisional: (c, w) => dibuixarBolet(c, w) },
    { key: 'rovello',        file: 'assets/natura/rovello.webp',        amplada: 80, provisional: (c, w) => dibuixarRovello(c, w) },
    { key: 'llac',           file: 'assets/natura/llac.png',           amplada: 58, provisional: (c, w) => dibuixarLlac(c, w) },
    { key: 'diposit',        file: 'assets/edificis/diposit.png',        amplada: 300, provisional: (c, w) => dibuixarDiposit(c, w) },
    { key: 'telescopi_mon',  file: 'assets/objectes/telescopi_mon.png',  amplada: 80, provisional: (c, w) => dibuixarTelescopiMon(c, w) },
    { key: 'tripode',        file: 'assets/objectes/tripode.png',        amplada: 80, provisional: (c, w) => dibuixarTelescopiMon(c, w, false) },   // el trípode del mirador, sense el telescopi
    { key: 'dolmen',         file: 'assets/edificis/dolmen.png',         amplada: 380, provisional: (c, w) => dibuixarDolmen(c, w) },   // amb Runna clavada a dalt
    { key: 'dolmen_buit',    file: 'assets/edificis/dolmen_buit.png',    amplada: 380, provisional: (c, w) => dibuixarDolmen(c, w, 'buit') },     // quan ja no hi ha l'espasa
    { key: 'dolmen_clavada', file: 'assets/edificis/dolmen_clavada.png', amplada: 380, provisional: (c, w) => dibuixarDolmen(c, w, 'clavada') },   // només Runna clavada (va per davant de l'Ineu)
    { key: 'dolmen_espasa',  file: 'assets/edificis/dolmen_espasa.png',  amplada: 380, provisional: (c, w) => dibuixarDolmen(c, w, 'espasa') },   // només l'espasa (s'aixeca en despertar-la)
    { key: 'conill',         file: 'assets/natura/conill.png',         amplada: 44, provisional: (c, w) => dibuixarConill(c, w) },
    { key: 'esquirol',       file: 'assets/natura/esquirol.png',       amplada: 40, provisional: (c, w) => dibuixarEsquirol(c, w) },
    { key: 'ermita_gabriel', file: 'assets/edificis/ermita_gabriel.webp', amplada: 560, provisional: (c, w) => dibuixarErmitaGabriel(c, w) },
    { key: 'nena_trenes',    file: 'assets/personatges/nena_trenes.png',    amplada: 80, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#e8e8f8', pell: '#dfe6ff', cabell: '#5a4636', dona: true, alt: 0.72, cap: 17, extra: 'trenes' }) },
    { key: 'porxo',          file: 'assets/edificis/porxo.png',          amplada: 340, provisional: (c, w) => dibuixarPorxo(c, w) },
    { key: 'esbarzer',       file: 'assets/natura/esbarzer.webp',       amplada: 96, provisional: (c, w) => dibuixarEsbarzer(c, w) },
    { key: 'cofre',          file: 'assets/objectes/cofre.png',          amplada: 70, provisional: (c, w) => dibuixarCofre(c, w) },
    { key: 'cabana',         file: 'assets/edificis/cabana.png',         amplada: 400, provisional: (c, w) => dibuixarCabana(c, w) },
    { key: 'herba_sj',     file: 'assets/natura/herba_sj.png',     amplada: 70, provisional: (c, w) => dibuixarHerba(c, w, 'sj') },
    { key: 'romani',       file: 'assets/natura/romani.png',       amplada: 70, provisional: (c, w) => dibuixarHerba(c, w, 'romani') },
    { key: 'farigola',     file: 'assets/natura/farigola.png',     amplada: 70, provisional: (c, w) => dibuixarHerba(c, w, 'farigola') },
    { key: 'cercle_bolets',  file: 'assets/natura/cercle_bolets.webp',  amplada: 150, provisional: (c, w) => dibuixarCercleBolets(c, w) },
    { key: 'olla',           file: 'assets/objectes/olla.png',           amplada: 110, provisional: (c, w) => dibuixarOlla(c, w) },
    { key: 'ocell',          file: 'assets/natura/ocell.png',          amplada: 34, provisional: (c, w) => dibuixarOcell(c, w) },
    { key: 'jaumeta',        file: 'assets/personatges/jaumeta.png',        amplada: 96, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#5a6a3a', pell: '#d8a878', cabell: '#4a3a1e', dona: true, alt: 0.86, ample: 1.05, extra: 'rossa' }) },
    { key: 'arma_tiller', file: 'assets/armes/branca_tiler.webp', amplada: 28, provisional: (c, w) => dibuixarBastoProvisional(c, w) },   // la branca del Til·ler, a la mà
    { key: 'arma_basto',  file: 'assets/armes/basto.webp',       amplada: 24, provisional: (c, w) => dibuixarBastoProvisional(c, w) },
    { key: 'espasa_dib', file: 'assets/armes/espasa_dib.webp', amplada: 17, provisional: (c, w) => dibuixarEspasaSola(c, w) },   // Runna dibuixada a mà (la mateixa que va clavada al dolmen), per quan vola
    { key: 'ineu_aixeca', file: 'assets/personatges/ineu_aixeca_espasa.webp', amplada: 85, cru: true, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#6a4426', cabell: '#5a4636' }) },   // l'Ineu alçant Runna, mirant amunt (ja amb fons transparent)
    { key: 'arma_espasa', file: 'assets/armes/espasa.webp',      amplada: 28, provisional: (c, w) => dibuixarEspasaProvisional(c, w) },   // l'espasa de Runna
    { key: 'cartell_llums', file: 'assets/objectes/cartell_llums.webp', amplada: 560, cru: true },            // cartell de paper (es mostra tal com és, amb el fons blanc)
    { key: 'cartell_llums_borros', file: 'assets/objectes/cartell_llums_borros.webp', amplada: 56, cru: true },   // la mateixa imatge, borrosa i petita, per a la paret
    { key: 'espurna',      file: 'assets/objectes/espurna.png',      amplada: 32, provisional: (c, w) => dibuixarPuntSegell(c, w) }
];

/**
 * SPRITES DE L'INEU: 8 direccions (assets/sprites/ineu/<direccio>.png, fons transparent).
 * Cada fulla és una quadrícula 4x4 de 16 fotogrames de 256x256 (cicle de caminar) amb els peus a y~240.
 * Els originals (Ineu-iso_walk_<dir>-v1.png, amb fons blanc) es van processar amb eines/netejar_ineu.js.
 */
const DIRS_INEU = ['down', 'up', 'left', 'right', 'southwest', 'southeast', 'northwest', 'northeast'];
const SPRITE_INEU = {
    ample: 256, alt: 256, peus: 240,
    alcada: 142,          // alçada del fotograma en píxels de joc (el personatge fa uns 125)
    fps: 14,
    // Les vistes cardinals tenen més passos dins els 16 fotogrames i amb 14 fps les cames fan passetes curtes i ràpides: van més lentes
    fpsVista: { down: 8, up: 8, left: 8, right: 8 },
    quiet: 2              // fotograma de repòs de cada direcció
};
/**
 * ATACS DE L'INEU: una fulla per direcció (assets/sprites/ineu/atac_<direccio>.webp, 4x4 fotogrames de 256, fons transparent).
 * Surten de eines/convertir_atacs.js: ja estan normalitzades (mateixa escala per a totes les direccions, peus a SPRITE_INEU.peus) i
 * l'Ineu hi apareix sense arma. L'arma (bastó, branca del Til·ler o espasa) s'hi afegeix com una capa que segueix la mà
 * fotograma a fotograma (taula ATAC_ARMA a js/atac_arma.js).
 */
const ATAC_INEU = {
    fotogrames: [0, 1, 2, 3, 4, 5, 12, 13, 14, 15],   // alçada, cop, posició i tornada (els 6-11 són gairebé repòs)
    fps: 28
};
// Octants de moviment (angle en pantalla, y cap avall) -> direcció del sprite
// Fotograma de repòs d'una vista (a la fulla de perfil és el de les cames més juntes, calculat en carregar-la)
function quietIneu(vista) { return (vista === 'left' || vista === 'right') && Grafics.perfilNou ? Grafics.quietPerfil : SPRITE_INEU.quiet; }
const OCTANTS_INEU = ['right', 'southeast', 'down', 'southwest', 'left', 'northwest', 'up', 'northeast'];

const Grafics = {
    // Avís si el navegador no deixa llegir els píxels (obert amb doble clic, file://)
    pixelsBloquejats: false,
    faltants: [],

    carregar(scene) {
        scene.load.on('loaderror', f => {
            Grafics.faltants.push(f.key);
            // Si no hi ha el PNG, provem el mateix nom en JPG (amb una clau a part)
            if (CATALEG.some(i => i.key === f.key) && /\.(png|webp)$/.test(f.url)) scene.load.image(f.key + '__jpg', f.url.replace(/\.(png|webp)$/, '.jpg'));
        });
        CATALEG.forEach(item => scene.load.image(item.key, item.file));
        scene.load.image('ineu_perfil_font', 'assets/sprites/Ineu-walk-v1.webp');
        DIRS_INEU.forEach(dir => {
            const mida = { frameWidth: SPRITE_INEU.ample, frameHeight: SPRITE_INEU.alt };
            scene.load.spritesheet('ineu_' + dir, `assets/sprites/ineu/${dir}.webp`, mida);
            scene.load.spritesheet('ineu_atac_' + dir, `assets/sprites/ineu/atac_${dir}.webp`, mida);
        });
    },

    // Processa tots els PNG carregats i crea marcadors/textures generades
    preparar(scene) {
        CATALEG.forEach(item => {
            // Gràfic carregat com a JPG: passa a ser el gràfic oficial
            if (scene.textures.exists(item.key + '__jpg')) {
                if (scene.textures.exists(item.key)) scene.textures.remove(item.key);
                scene.textures.renameTexture(item.key + '__jpg', item.key);
                Grafics.faltants = Grafics.faltants.filter(k => k !== item.key);
            }
            const existeix = scene.textures.exists(item.key) && !Grafics.faltants.includes(item.key);
            if (existeix && item.cru) scene.textures.get(item.key).customData.escala = item.amplada / scene.textures.get(item.key).getSourceImage().width;      // sense treure el fons
            else if (existeix) Grafics.netejarPNG(scene, item);
            else Grafics.crearProvisional(scene, item);
        });
        Grafics.texturesGenerades(scene);
        Grafics.perfilIneu(scene);
        Grafics.atacsVista = new Set(DIRS_INEU.filter(d => scene.textures.exists('ineu_atac_' + d) && !Grafics.faltants.includes('ineu_atac_' + d)));
        Grafics.animacions(scene);
    },

    // Caminar cap a l'esquerra i la dreta: una sola fulla (Ineu-walk-v1.png: 16 fotogrames en 4x4, mirant a la dreta, fons blanc).
    // Es neteja, s'escala i es centra com les altres fulles (cel·les de 256, peus a y=240) i se'n fa el mirall per a l'esquerra.
    perfilIneu(scene) {
        Grafics.perfilNou = false;
        if (!scene.textures.exists('ineu_perfil_font') || Grafics.faltants.includes('ineu_perfil_font')) return;
        try {
            const font = scene.textures.get('ineu_perfil_font').getSourceImage();
            const CEL = 256, COLS = 4, N = 16;
            const c0 = document.createElement('canvas');
            c0.width = font.width; c0.height = font.height;
            const x0 = c0.getContext('2d', { willReadFrequently: true });
            x0.drawImage(font, 0, 0);
            const img = x0.getImageData(0, 0, c0.width, c0.height);
            treureFonsBlanc(img.data, c0.width, c0.height);
            x0.putImageData(img, 0, 0);

            // Caixa del personatge a cada fotograma
            const caixes = [];
            for (let i = 0; i < N; i++) {
                const cx = (i % COLS) * CEL, cy = Math.floor(i / COLS) * CEL;
                let ax = CEL, ay = CEL, bx = -1, by = -1;
                for (let y = 0; y < CEL; y++) for (let x = 0; x < CEL; x++) {
                    if (img.data[((cy + y) * c0.width + cx + x) * 4 + 3] > 24) { if (x < ax) ax = x; if (x > bx) bx = x; if (y < ay) ay = y; if (y > by) by = y; }
                }
                caixes.push({ ax, ay, bx, by });
            }
            // Els fotogrames originals no estan ben alineats entre ells: el cap puja i baixa sense ordre (fins a 4 px)
            // i l'alçada del cos varia (159-164 px). Es mesura cada fotograma per separat (vores amb cobertura, no un
            // sol píxel solt, i centre del cap ponderat per l'alfa) i es redibuixa perquè el cap i els peus quedin
            // sempre a la mateixa alçada i el cap a la mateixa x. Així al caminar no tremola.
            const mides = [];
            for (let i = 0; i < N; i++) {
                const cx = (i % COLS) * CEL, cy = Math.floor(i / COLS) * CEL;
                const fila = [];
                for (let y = 0; y < CEL; y++) {
                    let s = 0;
                    for (let x = 0; x < CEL; x++) s += img.data[((cy + y) * c0.width + cx + x) * 4 + 3];
                    fila.push(s / 255);
                }
                const dalt = fila.findIndex(v => v >= 10);
                let baix = CEL - 1;
                while (baix > dalt && fila[baix] < 10) baix--;
                let sx = 0, sa = 0;
                for (let y = dalt; y < dalt + 35; y++) for (let x = 0; x < CEL; x++) {
                    const a = img.data[((cy + y) * c0.width + cx + x) * 4 + 3];
                    sx += x * a; sa += a;
                }
                mides.push({ dalt, baix, cap: sx / sa });
            }
            const mediana = v => v.slice().sort((a, b) => a - b)[Math.floor(v.length / 2)];
            const alt = mediana(mides.map(m => m.baix - m.dalt));
            const centre = caixes.reduce((t, c) => t + (c.ax + c.bx) / 2, 0) / N;
            const desvCap = centre - mides.reduce((t, m) => t + m.cap, 0) / N;      // el cos queda on era abans
            const e = (SPRITE_INEU.peus - 8) / alt;      // mateixa alçada que les altres fulles (~225 de 256)
            // Fotograma de repòs: aquell en què les cames estan més juntes (caixa més estreta)
            Grafics.quietPerfil = caixes.reduce((m, c, i) => (c.bx - c.ax < caixes[m].bx - caixes[m].ax ? i : m), 0);

            const fes = mirall => {
                const out = document.createElement('canvas');
                out.width = COLS * CEL; out.height = Math.ceil(N / COLS) * CEL;
                const o = out.getContext('2d');
                o.imageSmoothingQuality = 'high';
                for (let i = 0; i < N; i++) {
                    const cel = document.createElement('canvas');
                    cel.width = CEL; cel.height = CEL;
                    const m = mides[i], ey = e * alt / (m.baix - m.dalt);      // escala vertical pròpia: cap i peus a lloc
                    const cc = cel.getContext('2d');
                    cc.imageSmoothingQuality = 'high';
                    cc.drawImage(c0, (i % COLS) * CEL, Math.floor(i / COLS) * CEL, CEL, CEL,
                        CEL / 2 - (m.cap + desvCap) * e, SPRITE_INEU.peus - m.baix * ey, CEL * e, CEL * ey);
                    const dx = (i % COLS) * CEL, dy = Math.floor(i / COLS) * CEL;
                    if (mirall) { o.save(); o.translate(dx + CEL, dy); o.scale(-1, 1); o.drawImage(cel, 0, 0); o.restore(); }
                    else o.drawImage(cel, dx, dy);
                }
                return out;
            };
            [['ineu_right', false], ['ineu_left', true]].forEach(([clau, mirall]) => {
                if (scene.textures.exists(clau)) scene.textures.remove(clau);
                const t = scene.textures.addCanvas(clau, fes(mirall));
                for (let i = 0; i < N; i++) t.add(i, 0, (i % COLS) * CEL, Math.floor(i / COLS) * CEL, CEL, CEL);
            });
            Grafics.perfilNou = true;
        } catch (e) {
            Grafics.pixelsBloquejats = true;      // sense lectura de píxels: es queden les fulles antigues
        }
    },

    // Animacions de caminar de l'Ineu (són globals: es creen una sola vegada)
    animacions(scene) {
        // L'escolopendra caminant (ondula el cos i les potes)
        if (!scene.anims.exists('cempeus') && scene.textures.get('escolopendra').has(0)) {
            scene.anims.create({ key: 'cempeus', frames: scene.anims.generateFrameNumbers('escolopendra', { start: 0, end: 7 }), frameRate: 16, repeat: -1 });
        }
        (Grafics.atacsVista || []).forEach(dir => {
            const key = 'atac_' + dir;
            if (scene.anims.exists(key)) scene.anims.remove(key);
            scene.anims.create({
                key,
                frames: ATAC_INEU.fotogrames.map(f => ({ key: 'ineu_atac_' + dir, frame: f })),
                frameRate: ATAC_INEU.fps,
                repeat: 0
            });
        });
        DIRS_INEU.forEach(dir => {
            const key = 'caminar_' + dir;
            if (scene.anims.exists(key) || !scene.textures.exists('ineu_' + dir)) return;
            scene.anims.create({
                key,
                frames: scene.anims.generateFrameNumbers('ineu_' + dir, { start: 0, end: 15 }),
                frameRate: SPRITE_INEU.fpsVista[dir] || SPRITE_INEU.fps,
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
            const canvas = document.createElement('canvas');
            canvas.width = w * RES; canvas.height = h * RES;
            const ctx = canvas.getContext('2d');
            ctx.scale(RES, RES);
            dibuix(ctx, w, h);
            if (scene.textures.exists(key)) scene.textures.remove(key);
            scene.textures.addCanvas(key, canvas);
            scene.textures.get(key).customData.escala = 1 / RES;
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
        // Roda de carruatge gegant (la de la Sala del Ping-pong, la que amaga el passadís)
        crea('roda_carruatge', 140, 150, (ctx, w, h) => {
            const cx = 70, cy = 76, R = 62;
            ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(cx, 144, 44, 6, 0, 0, Math.PI * 2); ctx.fill();
            ctx.lineCap = 'round';
            // Radis
            ctx.strokeStyle = '#2a1a0c'; ctx.lineWidth = 11;
            for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * 12, cy + Math.sin(a) * 12); ctx.lineTo(cx + Math.cos(a) * (R - 6), cy + Math.sin(a) * (R - 6)); ctx.stroke(); }
            ctx.strokeStyle = '#8a5a30'; ctx.lineWidth = 7;
            for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * 12, cy + Math.sin(a) * 12); ctx.lineTo(cx + Math.cos(a) * (R - 6), cy + Math.sin(a) * (R - 6)); ctx.stroke(); }
            // Llanta de fusta i cèrcol de ferro
            ctx.strokeStyle = '#2a1a0c'; ctx.lineWidth = 18; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
            ctx.strokeStyle = '#7a4e26'; ctx.lineWidth = 13; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
            ctx.strokeStyle = '#3a3a40'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, R + 7, 0, Math.PI * 2); ctx.stroke();
            ctx.strokeStyle = 'rgba(255,225,170,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R - 3, Math.PI * 1.1, Math.PI * 1.6); ctx.stroke();
            // Cub
            ctx.fillStyle = '#4a2c16'; ctx.strokeStyle = '#2a1a0c'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(cx, cy, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#8a8a90'; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();
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
        crea('creu_rosari', 28, 40, (ctx) => {
            ctx.lineJoin = 'round';
            const g = ctx.createLinearGradient(6, 0, 22, 0); g.addColorStop(0, '#8a6a20'); g.addColorStop(0.45, '#f4d77c'); g.addColorStop(1, '#7a5a16');
            ctx.fillStyle = g; ctx.strokeStyle = '#2a1a06'; ctx.lineWidth = 1.8;
            ctx.beginPath(); ctx.moveTo(11, 3); ctx.lineTo(17, 3); ctx.lineTo(17, 11); ctx.lineTo(25, 11); ctx.lineTo(25, 17); ctx.lineTo(17, 17); ctx.lineTo(17, 37); ctx.lineTo(11, 37); ctx.lineTo(11, 17); ctx.lineTo(3, 17); ctx.lineTo(3, 11); ctx.lineTo(11, 11); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillRect(12.5, 5, 1.6, 30); ctx.fillRect(5, 12.5, 18, 1.4);
        });
        // Cementiri (dibuixos.js): làpides, tombes amb vorada, la creueta, la tomba de l'àngel (on el Germà Francesc porta flors) i els fanalets
        crea('lapida', 56, 80, (ctx, w, h) => pintarLapidaArc(ctx, w, h, 3));
        crea('lapida_b', 56, 80, (ctx, w, h) => pintarLapidaArc(ctx, w, h, 17));
        crea('lapida_creu', 54, 90, (ctx, w, h) => pintarLapidaCreu(ctx, w, h));
        crea('lapida_ferro', 46, 84, (ctx, w, h) => pintarLapidaFerro(ctx, w, h));
        crea('tomba_grava', 110, 96, (ctx, w, h) => pintarTombaVorada(ctx, w, h, 'grava', 11));
        crea('tomba_flors', 110, 96, (ctx, w, h) => pintarTombaVorada(ctx, w, h, 'flors', 13));
        crea('tomba_herba', 110, 96, (ctx, w, h) => pintarTombaVorada(ctx, w, h, 'herba', 19));
        crea('tomba_creu', 140, 112, pintarTombaCreu);
        crea('tomba_angel', 140, 226, (ctx, w, h) => pintarTombaAngel(ctx, w, h, false));
        crea('tomba_angel_flors', 140, 226, (ctx, w, h) => pintarTombaAngel(ctx, w, h, true));
        crea('tomba_esquerdada', 240, 150, (ctx, w, h) => pintarTombaMonjos(ctx, w, h, true));
        crea('tomba_tancada', 240, 150, (ctx, w, h) => pintarTombaMonjos(ctx, w, h, false));
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
        crea('banc_davant', 150, 100, (ctx, w, h) => {
            const base = h - 8;
            ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.beginPath(); ctx.ellipse(75, base + 3, 68, 6, 0, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#2a1608'; ctx.lineWidth = 2; ctx.lineJoin = 'round';
            [[8, 20], [124, 20]].forEach(([x]) => {          // muntants
                const g = ctx.createLinearGradient(x, 0, x + 18, 0); g.addColorStop(0, '#6a4220'); g.addColorStop(1, '#3e2410');
                ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x, 8, 18, base - 8 + 2, 4); ctx.fill(); ctx.stroke();
            });
            [[22, '#b07a42'], [38, '#a06c38'], [54, '#b07a42'], [70, '#a06c38']].forEach(([y, col]) => {    // taulons del respatller
                ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(4, y, 142, 14, 3); ctx.fill(); ctx.stroke();
                ctx.fillStyle = 'rgba(255,230,180,0.3)'; ctx.fillRect(8, y + 2, 134, 2);
                ctx.strokeStyle = 'rgba(70,40,14,0.4)'; ctx.lineWidth = 1;
                for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(24 + k * 40, y + 8); ctx.lineTo(56 + k * 40, y + 8); ctx.stroke(); }
                ctx.strokeStyle = '#2a1608'; ctx.lineWidth = 2;
            });
            ctx.fillStyle = '#c48a4c'; ctx.beginPath(); ctx.roundRect(2, 4, 146, 11, 3); ctx.fill(); ctx.stroke();   // llistó superior
            ctx.fillStyle = 'rgba(255,230,180,0.35)'; ctx.fillRect(6, 6, 138, 2);
        });
        // ---- Mobiliari i terra de fusta (cabanes) ----
        const FUSTA_CONTORN = '#2a1608';
        crea('taulons', 256, 256, (ctx, w, h) => {
            let llavor = 61;
            const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
            const COLORS = ['#a8763f', '#9a6a36', '#b4814a', '#8e6030', '#a06e3a'];
            const FILES = 8, fh = h / FILES;
            ctx.fillStyle = '#2a1608'; ctx.fillRect(0, 0, w, h);
            for (let f = 0; f < FILES; f++) {
                let x = -rnd() * 60;
                while (x < w) {
                    const pw = 50 + rnd() * 50, y0 = f * fh;
                    const col = COLORS[Math.floor(rnd() * COLORS.length)];
                    ctx.fillStyle = col; ctx.fillRect(x + 1, y0 + 1, pw - 2, fh - 2);
                    const g = ctx.createLinearGradient(0, y0, 0, y0 + fh);
                    g.addColorStop(0, 'rgba(255,230,180,0.22)'); g.addColorStop(0.5, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.25)');
                    ctx.fillStyle = g; ctx.fillRect(x + 1, y0 + 1, pw - 2, fh - 2);
                    ctx.strokeStyle = 'rgba(60,34,14,0.45)'; ctx.lineWidth = 0.8;       // veta de la fusta
                    for (let k = 0; k < 4; k++) {
                        const yy = y0 + 4 + rnd() * (fh - 8);
                        ctx.beginPath(); ctx.moveTo(x + 2, yy); ctx.bezierCurveTo(x + pw * 0.3, yy + (rnd() - 0.5) * 4, x + pw * 0.6, yy + (rnd() - 0.5) * 4, x + pw - 2, yy); ctx.stroke();
                    }
                    if (rnd() < 0.3) {                                                   // nus
                        const kx = x + 8 + rnd() * (pw - 16), ky = y0 + 6 + rnd() * (fh - 12);
                        ctx.fillStyle = 'rgba(50,28,10,0.55)'; ctx.beginPath(); ctx.ellipse(kx, ky, 3, 2, 0, 0, Math.PI * 2); ctx.fill();
                        ctx.strokeStyle = 'rgba(50,28,10,0.5)'; ctx.beginPath(); ctx.ellipse(kx, ky, 5.5, 3.6, 0, 0, Math.PI * 2); ctx.stroke();
                    }
                    ctx.fillStyle = 'rgba(30,18,8,0.7)';                                  // claus a les juntes
                    ctx.fillRect(x + 3, y0 + 4, 1.5, 1.5); ctx.fillRect(x + 3, y0 + fh - 6, 1.5, 1.5);
                    x += pw;
                }
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
        // En Josep al partit de ping-pong: el cos i el cap sense braços (els braços i la pala són a part i es mouen)
        crea('josep_maniga', 28, 40, pintarManigaJosep); crea('josep_man', 20, 18, pintarManTancadaJosep);
        crea('josep_man_oberta', 20, 22, pintarManObertaJosep); crea('josep_pala', 28, 71, pintarPalaJosep);
        crea('josep_pp', 98, 149, (ctx, w) => { ctx.scale(w / 100, w / 100); PP_FN.josep(ctx, 100, 152, { senseBraços: true }); });
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
        // Cel·la de Sant Antoni (js/dibuixos_cela.js)
        crea('paret_cela', 760, 200, pintarParetCela);
        crea('llar_cela', 200, 170, pintarLlarCela);
        crea('llit_cela', 120, 180, pintarLlitCela);
        crea('taula_cela', 120, 90, pintarTaulaCela);
        crea('cadira_cela', 48, 70, pintarCadiraCela);
        crea('finestra_cela', 80, 110, pintarFinestraCela);
        crea('prestatge_cela', 130, 100, pintarPrestatgeCela);
        crea('creu_cela', 36, 60, pintarCreuCela);
        crea('habit_cela', 60, 110, pintarHabitCela);
        crea('estora_cela', 230, 110, pintarEstoraCela);
        crea('cofre_cela', 90, 56, pintarCofreCela);
        // Casa Gran per dins (js/dibuixos_casa.js)
        crea('paret_cripta', 740, 170, pintarParetCripta);
        crea('paret_tresor', 740, 170, pintarParetTresor);
        crea('mur_passadis', 40, 1400, pintarMurPassadis);
        crea('fons_passadis', 400, 90, pintarFonsPassadis);
        crea('costella_passadis', 400, 44, pintarCostellaPassadis);
        crea('sarcofag_cripta', 150, 110, pintarSarcofagCripta);
        crea('llosa_cripta', 200, 120, (ctx, w, h) => pintarLlosaCripta(ctx, w, h, true));
        crea('llosa_cripta_buida', 200, 120, (ctx, w, h) => pintarLlosaCripta(ctx, w, h, false));
        crea('sacs_tresor', 140, 90, pintarSacsTresor);
        crea('monedes_tresor', 110, 50, pintarMonedesTresor);
        crea('bota_creu', 64, 84, pintarBotaCreu);
        crea('cofre_tresor', 110, 80, pintarCofreTresor);
        crea('rosa_vents', 380, 200, pintarRosaVents);
        crea('fletxa_raim', 90, 90, pintarFletxaRaim);
        // Ermita de la Desaparició (js/dibuixos_ermita.js)
        crea('paret_ermita', 800, 170, pintarParetErmita);
        crea('mur_ermita', 40, 700, pintarMurErmita);
        crea('pilastra_ermita', 54, 170, pintarPilastraErmita);
        crea('catifa_ermita', 120, 440, pintarCatifaErmita);
        crea('graons_ermita', 380, 90, pintarGraonsErmita);
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
        // Medalló d'objecte (HUD, dreta) i la seva icona de flauta
        crea('medallo', 88, 88, (ctx, w) => {
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
        });
        crea('icona_flauta', 64, 64, (ctx, w) => {
            ctx.save(); ctx.translate(w / 2, w / 2); ctx.rotate(-Math.PI / 4);
            ctx.fillStyle = '#b9854a'; ctx.strokeStyle = '#3a2412'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.roundRect(-26, -5, 52, 10, 5); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#d6aa6a'; ctx.fillRect(-24, -3, 48, 3);
            ctx.fillStyle = '#3a2412';
            [-12, -3, 6, 15].forEach(x => { ctx.beginPath(); ctx.arc(x, 1, 2, 0, Math.PI * 2); ctx.fill(); });
            ctx.strokeStyle = '#7a1c24'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-17, -5); ctx.lineTo(-17, 5); ctx.stroke();
            ctx.restore();
            ctx.fillStyle = '#7a1c24';
            ctx.beginPath(); ctx.ellipse(w * 0.74, w * 0.2, 3.4, 2.6, -0.4, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#7a1c24'; ctx.lineWidth = 1.8;
            ctx.beginPath(); ctx.moveTo(w * 0.74 + 3, w * 0.2); ctx.lineTo(w * 0.74 + 3, w * 0.06); ctx.stroke();
        });
        // Icona del sarró (inventari): bossa de cuir amb solapa, sivella i corretja
        crea('icona_sarro', 64, 64, ctx => {
            ctx.strokeStyle = '#3a2412'; ctx.lineWidth = 2.4; ctx.lineJoin = 'round';
            ctx.beginPath(); ctx.moveTo(18, 26); ctx.quadraticCurveTo(32, 2, 46, 26); ctx.stroke();
            ctx.fillStyle = '#9a6a3a'; ctx.beginPath(); ctx.roundRect(12, 24, 40, 32, 8); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#7a4e28'; ctx.beginPath(); ctx.moveTo(12, 30); ctx.quadraticCurveTo(12, 24, 20, 24); ctx.lineTo(44, 24);
            ctx.quadraticCurveTo(52, 24, 52, 30); ctx.lineTo(50, 40); ctx.quadraticCurveTo(32, 48, 14, 40); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#d9b441'; ctx.beginPath(); ctx.arc(32, 42, 3.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.strokeStyle = 'rgba(240,210,160,0.6)'; ctx.lineWidth = 1.4; ctx.setLineDash([2, 3]);
            ctx.beginPath(); ctx.moveTo(17, 51); ctx.lineTo(47, 51); ctx.stroke(); ctx.setLineDash([]);
        });
        // Altar de pedra del presbiteri (desar partida i reposar)
        crea('altar', 150, 118, pintarAltarPedra);
        crea('orgue', 120, 150, (ctx, w, h) => {
            ctx.fillStyle = '#4a2c16'; ctx.fillRect(0, 60, w, 90);
            for (let i = 0; i < 9; i++) {
                const ph = 50 + Math.abs(4 - i) * -8 + 40;
                ctx.fillStyle = '#c9b48a'; ctx.fillRect(6 + i * 12, 70 - ph + 40, 9, ph);
                ctx.fillStyle = '#8e7a52'; ctx.fillRect(6 + i * 12 + 6, 70 - ph + 40, 3, ph);
            }
            ctx.fillStyle = '#eee'; ctx.fillRect(10, 112, 100, 10);
        });
    }
};

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
