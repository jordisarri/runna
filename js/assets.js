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
    { key: 'esglesia',     file: 'assets/esglesia.png',     amplada: 700 },
    { key: 'monestir',     file: 'assets/monestir.png',     amplada: 620, provisional: (c, w) => dibuixarEdifici(c, w, w * 0.62, '#cdb08a', '#7a4a2a', 'Monestir') },
    { key: 'casa_gran',    file: 'assets/casa_gran.png',    amplada: 640, provisional: (c, w) => dibuixarEdifici(c, w, w * 0.6, '#e2cfa8', '#9a5a32', 'Casa Gran') },
    // Personatges
    { key: 'pare_jordi',   file: 'assets/pare_jordi.png',   amplada: 96, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#1d1b22', alt: 1.08, ulleres: true, cabell: '#9c9c9c' }) },
    { key: 'germa_andreu', file: 'assets/germa_andreu.png', amplada: 96, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#2a2230', cabell: '#3b2a1e', pilota: true }) },
    { key: 'pare_daniel',  file: 'assets/pare_daniel.png',  amplada: 96, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#1d1b22', cabell: '#5a4636' }) },
    { key: 'pare_alcui',   file: 'assets/pare_alcui.png',   amplada: 96, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#1d1b22', cabell: '#d8d8d8', llibre: true }) },
    // Elements
    { key: 'home_raim',    file: 'assets/home_raim.png',    amplada: 80,  provisional: (c, w) => dibuixarHomeRaim(c, w) },
    { key: 'creu',         file: 'assets/creu.png',         amplada: 70,  provisional: (c, w) => dibuixarCreu(c, w) },
    { key: 'bassadoria',   file: 'assets/bassadoria.png',   amplada: 260, provisional: (c, w) => dibuixarBassadoria(c, w) },
    { key: 'font',         file: 'assets/font.png',         amplada: 110, provisional: (c, w) => dibuixarFont(c, w) },
    { key: 'arbre',        file: 'assets/arbre.png',        amplada: 240, provisional: (c, w) => dibuixarArbre(c, w) },
    { key: 'xiprer',       file: 'assets/xiprer.png',       amplada: 80,  provisional: (c, w) => dibuixarXiprer(c, w) },
    { key: 'retaule',      file: 'assets/retaule.png',      amplada: 360, provisional: (c, w) => dibuixarRetaule(c, w) },

    // ---- Edificis nous ----
    { key: 'sala_pingpong', file: 'assets/sala_pingpong.png', amplada: 340, provisional: (c, w) => dibuixarEdifici(c, w, w * 0.62, '#d8c8a8', '#3a5a8a', 'Sala del Ping-pong') },
    { key: 'cel_stbenet',   file: 'assets/cel_stbenet.png',   amplada: 420, provisional: (c, w) => dibuixarEdifici(c, w, w * 0.6, '#e6d6b0', '#8a4a2a', 'Sant Benet') },
    { key: 'cel_ntrasra',   file: 'assets/cel_ntrasra.png',   amplada: 560, provisional: (c, w) => dibuixarEdifici(c, w, w * 0.55, '#ddc9a4', '#7a3a2a', 'Nostra Senyora') },
    { key: 'ermita',        file: 'assets/ermita.png',        amplada: 300, provisional: (c, w) => dibuixarEdifici(c, w, w * 0.7, '#b8b2a4', '#6a5a4a', 'Ermita de la Desaparició') },
    { key: 'hospederia',    file: 'assets/hospederia.png',    amplada: 560, provisional: (c, w) => dibuixarEdifici(c, w, w * 0.6, '#e2d2b0', '#7a4030', 'Hospederia') },

    // ---- Personatges nous ----
    { key: 'pianista',  file: 'assets/pianista.png',  amplada: 100, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#6a3a6a', cabell: '#c8c8c8', dona: true, ample: 1.45, alt: 0.9, ulleres: true }) },
    { key: 'tieta',     file: 'assets/tieta.png',     amplada: 96,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#4a5a7a', cabell: '#d8d8d8', dona: true, ample: 1.1, alt: 0.88 }) },
    { key: 'tieta2',    file: 'assets/tieta2.png',    amplada: 96,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#7a4a4a', cabell: '#bcbcbc', dona: true, ample: 1.2, alt: 0.86, ulleres: true }) },
    { key: 'neus',      file: 'assets/neus.png',      amplada: 96,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#b03a4a', cabell: '#3b2a1e', dona: true, ample: 1.1, alt: 1.0 }) },
    { key: 'marit_neus', file: 'assets/marit_neus.png', amplada: 96, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#4a6a7a', cabell: '#5a4636', alt: 0.98, calb: true }) },
    { key: 'yordi',     file: 'assets/yordi.png',     amplada: 96,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#3a7a5a', cabell: '#3b2a1e', alt: 0.96 }) },
    { key: 'judit',     file: 'assets/judit.png',     amplada: 96,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#d09a3a', cabell: '#6a3a1e', dona: true, alt: 0.92 }) },
    { key: 'daniel_t',  file: 'assets/daniel_t.png',  amplada: 96,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#5a5a8a', cabell: '#2a2a2a', alt: 1.02, ample: 1.05 }) },
    { key: 'turbo',     file: 'assets/turbo.png',     amplada: 80,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#e05a2a', cabell: '#3b2a1e', alt: 0.7, cap: 17 }) },
    { key: 'juli',      file: 'assets/juli.png',      amplada: 96,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#8ec8f0', cabell: '#3b2a1e', alt: 0.9, cap: 20, ulleres: true, extra: 'angelets' }) },
    { key: 'frederic',  file: 'assets/frederic.png',  amplada: 96,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#7a7a6a', cabell: '#e0e0e0', alt: 0.92, barba: '#e0e0e0', extra: 'pala' }) },
    { key: 'eloi',      file: 'assets/eloi.png',      amplada: 110, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#b03030', cabell: '#2a2a2a', alt: 1.1, ample: 1.4 }) },
    { key: 'josep',     file: 'assets/josep.png',     amplada: 96,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#2a2a3a', cabell: '#1a1a1a', alt: 1.02, extra: 'gorra' }) },
    { key: 'garf',      file: 'assets/garf.png',      amplada: 96,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#8a6a3a', cabell: '#d9b45a', alt: 0.92, ample: 1.35, cap: 17 }) },
    { key: 'isidre',    file: 'assets/isidre.png',    amplada: 96,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#4a7a3a', cabell: '#6a5a3a', alt: 0.94, bastoCoix: true, extra: 'gorra' }) },
    { key: 'jordi_caseta', file: 'assets/jordi_caseta.png', amplada: 96, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#6a7a3a', cabell: '#4a3a2a', alt: 0.97, extra: 'gorra' }) },
    { key: 'sansa',     file: 'assets/sansa.png',     amplada: 96,  provisional: (c, w) => dibuixarPersona(c, w, { roba: '#d8b04a', cabell: '#7a3a1e', dona: true, ample: 1.2, alt: 0.95 }) },
    { key: 'home_carruatge', file: 'assets/home_carruatge.png', amplada: 96, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#2f6b3d', cabell: '#222', alt: 1.04, extra: 'gorra' }) },

    // ---- Escenari nou ----
    { key: 'runes',     file: 'assets/runes.png',     amplada: 300, provisional: (c, w) => dibuixarRunes(c, w) },
    { key: 'columna',   file: 'assets/columna.png',   amplada: 58,  provisional: (c, w) => dibuixarColumna(c, w) },
    { key: 'roure',     file: 'assets/roure.png',     amplada: 420, provisional: (c, w) => dibuixarRoure(c, w) },
    { key: 'tiller',    file: 'assets/tiller.png',    amplada: 340, provisional: (c, w) => dibuixarTiller(c, w) },
    { key: 'altar',     file: 'assets/altar.png',     amplada: 150, provisional: (c, w) => dibuixarAltar(c, w) },
    { key: 'taula_pedra', file: 'assets/taula_pedra.png', amplada: 110, provisional: (c, w) => dibuixarTaulaPedra(c, w) },
    { key: 'font_sj',   file: 'assets/font_sj.png',   amplada: 130, provisional: (c, w) => dibuixarFontSJ(c, w) },
    { key: 'carruatge', file: 'assets/carruatge.png', amplada: 230, provisional: (c, w) => dibuixarCarruatge(c, w) },
    { key: 'carro_sansa', file: 'assets/carro_sansa.png', amplada: 220, provisional: (c, w) => dibuixarCarroSansa(c, w) },
    { key: 'pergola',   file: 'assets/pergola.png',   amplada: 260, provisional: (c, w) => dibuixarPergola(c, w) },
    { key: 'flors',     file: 'assets/flors.png',     amplada: 90,  provisional: (c, w) => dibuixarFlors(c, w) },
    { key: 'taula_pp',  file: 'assets/taula_pp.png',  amplada: 240, provisional: (c, w) => dibuixarTaulaPP(c, w) },
    { key: 'alzina_buida', file: 'assets/alzina_buida.png', amplada: 280, provisional: (c, w) => dibuixarAlzinaBuida(c, w) },
    { key: 'llosa',     file: 'assets/llosa.png',     amplada: 90,  provisional: (c, w) => dibuixarLlosa(c, w) },

    // ---- Enemics ----
    { key: 'escolopendra', file: 'assets/escolopendra.png', amplada: 64, provisional: (c, w) => dibuixarEscolopendra(c, w) },
    { key: 'gripau',       file: 'assets/gripau.png',       amplada: 56, provisional: (c, w) => dibuixarGripau(c, w) },
    { key: 'visitant',     file: 'assets/visitant.png',     amplada: 96, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#e0a040', pell: '#9ab080', cabell: '#5a4a3a', alt: 0.98, extra: 'gorra', ulleres: true }) },
    { key: 'espantaocell', file: 'assets/espantaocell.png', amplada: 70, provisional: (c, w) => dibuixarEspantaocell(c, w) },
    { key: 'branca',       file: 'assets/branca.png',       amplada: 80, provisional: (c, w) => dibuixarBranca(c, w) },
    { key: 'pergami',      file: 'assets/pergami.png',      amplada: 44, provisional: (c, w) => dibuixarPergami(c, w) },
    { key: 'ombra_monjo',  file: 'assets/ombra_monjo.png',  amplada: 150, provisional: (c, w) => dibuixarOmbraMonjo(c, w) },
    { key: 'ovella',         file: 'assets/ovella.png',         amplada: 70, provisional: (c, w) => dibuixarOvella(c, w, false) },
    { key: 'ovella_boira',   file: 'assets/ovella_boira.png',   amplada: 76, provisional: (c, w) => dibuixarOvella(c, w, true) },
    { key: 'roca',           file: 'assets/roca.png',           amplada: 90, provisional: (c, w) => dibuixarRoca(c, w) },
    { key: 'masia',          file: 'assets/masia.png',          amplada: 520, provisional: (c, w) => dibuixarMasia(c, w) },
    { key: 'pastor_a',       file: 'assets/pastor_a.png',       amplada: 96, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#6a5a48', cabell: '#8a7a60', alt: 0.9, ample: 0.95, calb: true }) },
    { key: 'pastor_b',       file: 'assets/pastor_b.png',       amplada: 96, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#5a4a58', cabell: '#7a7a7a', dona: true, alt: 0.88, ample: 0.95 }) },
    { key: 'pastor_vell',    file: 'assets/pastor_vell.png',    amplada: 96, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#5a5040', cabell: '#d0d0d0', barba: '#d0d0d0', alt: 0.86, bastoCoix: true }) },
    { key: 'foc',            file: 'assets/foc.png',            amplada: 80, provisional: (c, w) => dibuixarFoc(c, w) },
    { key: 'espelma',        file: 'assets/espelma.png',        amplada: 20, provisional: (c, w) => dibuixarEspelma(c, w) },
    { key: 'taula_sopar',    file: 'assets/taula_sopar.png',    amplada: 380, provisional: (c, w) => dibuixarTaulaSopar(c, w) },
    { key: 'pastor_boira',   file: 'assets/pastor_boira.png',   amplada: 110, provisional: (c, w) => { dibuixarMonjo(c, w, { habit: '#2a1f3a', cabell: '#3b2a1e', alt: 1.1 }); afegirCaiada(c, w); } },
    { key: 'bolet',          file: 'assets/bolet.png',          amplada: 58, provisional: (c, w) => dibuixarBolet(c, w) },
    { key: 'rovello',        file: 'assets/rovello.png',        amplada: 80, provisional: (c, w) => dibuixarRovello(c, w) },
    { key: 'llac',           file: 'assets/llac.png',           amplada: 36, provisional: (c, w) => dibuixarLlac(c, w) },
    { key: 'diposit',        file: 'assets/diposit.png',        amplada: 300, provisional: (c, w) => dibuixarDiposit(c, w) },
    { key: 'telescopi_mon',  file: 'assets/telescopi_mon.png',  amplada: 80, provisional: (c, w) => dibuixarTelescopiMon(c, w) },
    { key: 'runna_pedra',    file: 'assets/runna_pedra.png',    amplada: 110, provisional: (c, w) => dibuixarRunnaPedra(c, w) },
    { key: 'ermita_gabriel', file: 'assets/ermita_gabriel.png', amplada: 300, provisional: (c, w) => dibuixarErmitaGabriel(c, w) },
    { key: 'nena_trenes',    file: 'assets/nena_trenes.png',    amplada: 80, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#e8e8f8', pell: '#dfe6ff', cabell: '#5a4636', dona: true, alt: 0.72, cap: 17, extra: 'trenes' }) },
    { key: 'porxo',          file: 'assets/porxo.png',          amplada: 340, provisional: (c, w) => dibuixarPorxo(c, w) },
    { key: 'esbarzer',       file: 'assets/esbarzer.png',       amplada: 96, provisional: (c, w) => dibuixarEsbarzer(c, w) },
    { key: 'cofre',          file: 'assets/cofre.png',          amplada: 70, provisional: (c, w) => dibuixarCofre(c, w) },
    { key: 'cabana',         file: 'assets/cabana.png',         amplada: 330, provisional: (c, w) => dibuixarCabana(c, w) },
    { key: 'cercle_bolets',  file: 'assets/cercle_bolets.png',  amplada: 150, provisional: (c, w) => dibuixarCercleBolets(c, w) },
    { key: 'olla',           file: 'assets/olla.png',           amplada: 110, provisional: (c, w) => dibuixarOlla(c, w) },
    { key: 'ocell',          file: 'assets/ocell.png',          amplada: 34, provisional: (c, w) => dibuixarOcell(c, w) },
    { key: 'jaumeta',        file: 'assets/jaumeta.png',        amplada: 96, provisional: (c, w) => dibuixarPersona(c, w, { roba: '#5a6a3a', pell: '#d8a878', cabell: '#4a3a1e', dona: true, alt: 0.86, ample: 1.05, extra: 'rossa' }) },
    { key: 'lapida',           file: 'assets/lapida.png',           amplada: 40,  provisional: (c, w) => dibuixarLapida(c, w) },
    { key: 'tomba_esquerdada', file: 'assets/tomba_esquerdada.png', amplada: 240, provisional: (c, w) => dibuixarTombaEsquerdada(c, w) },
    { key: 'espurna',      file: 'assets/espurna.png',      amplada: 32, provisional: (c, w) => dibuixarPuntSegell(c, w) }
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
    quiet: 2              // fotograma de repòs de cada direcció
};
// Octants de moviment (angle en pantalla, y cap avall) -> direcció del sprite
// Fotograma de repòs d'una vista (la fulla de perfil té 10 fotogrames i el de repòs és l'1)
function quietIneu(vista) { return (vista === 'left' || vista === 'right') && Grafics.perfilNou ? 1 : SPRITE_INEU.quiet; }
const OCTANTS_INEU = ['right', 'southeast', 'down', 'southwest', 'left', 'northwest', 'up', 'northeast'];

const Grafics = {
    // Avís si el navegador no deixa llegir els píxels (obert amb doble clic, file://)
    pixelsBloquejats: false,
    faltants: [],

    carregar(scene) {
        scene.load.on('loaderror', f => {
            Grafics.faltants.push(f.key);
            // Si no hi ha el PNG, provem el mateix nom en JPG (amb una clau a part)
            if (CATALEG.some(i => i.key === f.key) && /\.png$/.test(f.url)) scene.load.image(f.key + '__jpg', f.url.replace(/\.png$/, '.jpg'));
        });
        CATALEG.forEach(item => scene.load.image(item.key, item.file));
        scene.load.image('ineu_perfil_font', 'assets/sprites/Ineu-walk-trimmed.png');
        DIRS_INEU.forEach(dir => scene.load.spritesheet('ineu_' + dir, `assets/sprites/ineu/${dir}.png`,
            { frameWidth: SPRITE_INEU.ample, frameHeight: SPRITE_INEU.alt }));
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
            if (existeix) Grafics.netejarPNG(scene, item);
            else Grafics.crearProvisional(scene, item);
        });
        Grafics.texturesGenerades(scene);
        Grafics.perfilIneu(scene);
        Grafics.animacions(scene);
    },

    // Caminar cap a l'esquerra i la dreta: una sola fulla (10 fotogrames, mirant a la dreta, fons blanc).
    // Es neteja, s'escala i es centra com les altres fulles (cel·les de 256, peus a y=240) i se'n fa el mirall per a l'esquerra.
    perfilIneu(scene) {
        Grafics.perfilNou = false;
        if (!scene.textures.exists('ineu_perfil_font') || Grafics.faltants.includes('ineu_perfil_font')) return;
        try {
            const font = scene.textures.get('ineu_perfil_font').getSourceImage();
            const CEL = 256, COLS = 4, N = 10;
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
            const mediana = v => v.slice().sort((a, b) => a - b)[Math.floor(v.length / 2)];
            const alt = mediana(caixes.map(c => c.by - c.ay)), peus = mediana(caixes.map(c => c.by));
            const centre = caixes.reduce((t, c) => t + (c.ax + c.bx) / 2, 0) / N;
            const e = (SPRITE_INEU.peus - 8) / alt;      // mateixa alçada que les altres fulles (~225 de 256)

            const fes = mirall => {
                const out = document.createElement('canvas');
                out.width = COLS * CEL; out.height = 3 * CEL;
                const o = out.getContext('2d');
                o.imageSmoothingQuality = 'high';
                for (let i = 0; i < N; i++) {
                    const cel = document.createElement('canvas');
                    cel.width = CEL; cel.height = CEL;
                    cel.getContext('2d').drawImage(c0, (i % COLS) * CEL, Math.floor(i / COLS) * CEL, CEL, CEL,
                        CEL / 2 - centre * e, SPRITE_INEU.peus - peus * e, CEL * e, CEL * e);
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
        DIRS_INEU.forEach(dir => {
            const key = 'caminar_' + dir;
            if (scene.anims.exists(key) || !scene.textures.exists('ineu_' + dir)) return;
            scene.anims.create({
                key,
                frames: scene.anims.generateFrameNumbers('ineu_' + dir, { start: 0, end: (dir === 'left' || dir === 'right') && Grafics.perfilNou ? 9 : 15 }),
                frameRate: SPRITE_INEU.fps,
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
        scene.textures.get(item.key).customData.escala = 1 / RES;
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

        crea('herba', 64, 64, (ctx, w, h) => soroll(ctx, w, h, '#5d8f3f', ['#68a046', '#527f37', '#73a84d'], 90, 2, 3));
        crea('llamborda', 64, 64, (ctx, w, h) => {
            ctx.fillStyle = '#b9a588'; ctx.fillRect(0, 0, w, h);
            ctx.strokeStyle = '#9a8668'; ctx.lineWidth = 1.5;
            for (let fila = 0; fila < 4; fila++) {
                const y = fila * 16, desp = (fila % 2) * 12;
                for (let x = -24; x < w + 24; x += 24) {
                    ctx.fillStyle = ['#c3af90', '#b5a083', '#bfaa8b'][(x / 24 + fila + 3) % 3 | 0];
                    ctx.fillRect(x + desp + 1, y + 1, 22, 14);
                    ctx.strokeRect(x + desp + 1, y + 1, 22, 14);
                }
            }
        });
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
        crea('pedra', 64, 64, (ctx, w, h) => soroll(ctx, w, h, '#8c8a84', ['#7a7872', '#9c9a92', '#6e6c66'], 60, 2, 5));
        crea('herba_fosca', 64, 64, (ctx, w, h) => soroll(ctx, w, h, '#3f6a30', ['#4a7a38', '#345a28', '#52843f'], 100, 2, 3));
        crea('rajola', 64, 64, (ctx, w, h) => {
            ctx.fillStyle = '#4a4038'; ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#5a4e44'; ctx.fillRect(1, 1, 30, 30); ctx.fillRect(33, 33, 30, 30);
            ctx.fillStyle = '#524740'; ctx.fillRect(33, 1, 30, 30); ctx.fillRect(1, 33, 30, 30);
        });
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
        crea('cartell', 56, 64, (ctx, w, h) => {
            ctx.fillStyle = '#5a3a1e'; ctx.fillRect(25, 26, 6, 38);
            ctx.fillStyle = '#9c6b3c'; ctx.strokeStyle = '#3d2610'; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.roundRect(3, 4, 50, 28, 4); ctx.fill(); ctx.stroke();
            ctx.strokeStyle = '#6e4622'; ctx.lineWidth = 1.5;
            for (let y = 12; y < 30; y += 7) { ctx.beginPath(); ctx.moveTo(10, y); ctx.lineTo(46, y); ctx.stroke(); }
        });
        crea('banc', 140, 34, (ctx, w, h) => {
            ctx.fillStyle = '#5b3a20'; ctx.fillRect(0, 0, w, 12);
            ctx.fillStyle = '#7a5030'; ctx.fillRect(0, 12, w, 14);
            ctx.fillStyle = '#3e2714'; ctx.fillRect(4, 26, 8, 8); ctx.fillRect(w - 12, 26, 8, 8);
        });
        // Marcs de pergamí per als quadres de diàleg, el HUD i el menú (es fan servir amb nineslice: vegeu marcPergami a ui.js)
        crea('marc_gran', 2 * MARC_GRAN + 20, 2 * MARC_GRAN + 20, (ctx, w) => dibuixarMarc(ctx, w, MARC_GRAN, 1));
        crea('marc_peti', 2 * MARC_PETI + 20, 2 * MARC_PETI + 20, (ctx, w) => dibuixarMarc(ctx, w, MARC_PETI, 0.7));
        crea('cinta_nom', 56, 40, (ctx, w, h) => {
            const g = ctx.createLinearGradient(0, 0, 0, h);
            g.addColorStop(0, '#9a2c34'); g.addColorStop(1, '#601820');
            ctx.fillStyle = g; ctx.fillRect(0, 5, w, h - 10);
            ctx.globalCompositeOperation = 'destination-out';      // cua de cinta (tall en V) als dos extrems
            ctx.beginPath(); ctx.moveTo(-1, 4); ctx.lineTo(11, h / 2); ctx.lineTo(-1, h - 4); ctx.fill();
            ctx.beginPath(); ctx.moveTo(w + 1, 4); ctx.lineTo(w - 11, h / 2); ctx.lineTo(w + 1, h - 4); ctx.fill();
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = '#e0bd55'; ctx.lineWidth = 1.6;
            ctx.beginPath(); ctx.moveTo(14, 8.5); ctx.lineTo(w - 14, 8.5); ctx.moveTo(14, h - 8.5); ctx.lineTo(w - 14, h - 8.5); ctx.stroke();
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
        crea('reclinatori', 60, 34, (ctx, w, h) => {
            ctx.fillStyle = '#7a1f2a'; ctx.fillRect(4, 18, 52, 12);
            ctx.fillStyle = '#5b3a20'; ctx.fillRect(0, 0, w, 16);
            ctx.fillStyle = '#d4af37'; ctx.fillRect(26, 4, 8, 8);
        });
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
    // Hàbit
    ctx.fillStyle = o.habit;
    ctx.beginPath();
    ctx.moveTo(48, capY + 26); ctx.lineTo(70, capY + 40); ctx.lineTo(78, 122); ctx.lineTo(18, 122); ctx.lineTo(26, capY + 40);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // Cordó
    ctx.strokeStyle = '#c9b48a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(28, capY + 66); ctx.lineTo(68, capY + 66); ctx.stroke();
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

function dibuixarFont(canvas, w) {
    const h = w * 1.1; canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#3a3026'; ctx.lineWidth = w * 0.03;
    ctx.fillStyle = '#b8aa94';
    ctx.fillRect(w * 0.25, h * 0.05, w * 0.5, h * 0.6); ctx.strokeRect(w * 0.25, h * 0.05, w * 0.5, h * 0.6);
    ctx.fillStyle = '#6a8fa8';
    ctx.fillRect(w * 0.47, h * 0.4, w * 0.06, h * 0.35);
    ctx.fillStyle = '#9c8e7a';
    ctx.beginPath(); ctx.ellipse(w / 2, h * 0.82, w * 0.46, h * 0.14, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#6a8fa8';
    ctx.beginPath(); ctx.ellipse(w / 2, h * 0.82, w * 0.36, h * 0.08, 0, 0, Math.PI * 2); ctx.fill();
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
