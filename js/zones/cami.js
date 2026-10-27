/**
 * EL CAMÍ DE LA DESAPARICIÓ I LES SEVES PARADES
 * Camí (12 columnes) → Ermita de la Desaparició (exterior i interior) → L'Era → L'Hostatgeria.
 */

// ---------------- CAMÍ DE LA DESAPARICIÓ ----------------
class ZonaCami extends ZonaBase {
    constructor() {
        super('ZonaCami', {
            pins: { pinyer: 0.4 },
            nom: 'Camí de la Desaparició',
            amplada: 2800,
            alcada: 900,
            entrades: {
                runes:  { x: 2740, y: 450, dir: 'esquerra' },
                ermita: { x: 60,   y: 450, dir: 'dreta' },
                secret: { x: 1380, y: 200, dir: 'avall' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 2800, 900, -1100);
        this.terra('cami', 0, 380, 2800, 140);

        // Les 12 columnes de la processó, alternades a banda i banda del camí
        for (let i = 0; i < 12; i++) {
            const x = 2540 - i * 190, y = i % 2 === 0 ? 370 : 575;   // la columna 1 és la més propera a les Runes (est)
            this.posar('columna_proces', x, y, { col: { w: 34, h: 14 } });
            this.interactiu(x, y + 6, 85, DIALEGS.columna(i + 1), { altura: 120 });
        }

        [[700, 450], [1250, 450], [1950, 440], [2500, 460]].forEach(([x, y]) => this.enemic('escolopendra', x, y));
        this.cartell(2650, 560, DIALEGS.cartellCami);
        // Mur d'arbres del nord: només a x=1380 hi ha dos arbres més separats, i per aquí es puja a la cabana (sense marcar-ho)
        this.muralla(0, 140, 1280, 140, 128);
        this.muralla(1480, 140, 2800, 140, 132);
        this.sortides.push({ r: new Phaser.Geom.Rectangle(1320, 60, 120, 52), desti: 'ZonaCabanaCami', entrada: 'porta', peu: true });
  // cal travessar la fila d'arbres fins dalt de tot
        // Fila de baix: als extrems, arbres més petits (la capçada no ha de tapar les sortides de les puntes)
        this.muralla(0, 770, 2800, 770, 130, 'arbre', false);
        this.copes.filter(img => img.y === 770 && (img.x < 200 || img.x > 2600)).forEach(img => img.destroy());
        this.copes = this.copes.filter(img => img.active);
        [[40, 790], [170, 790], [2630, 790], [2760, 790]].forEach(([x, y]) => this.posar('arbre', x, y, { escala: 0.55, col: { w: 1, h: 1, fix: true } }));
        this.boira(900, 450, 400, 80, 1);
        this.boira(1900, 450, 400, 80, 1);

        this.sortida(2786, 380, 14, 140, 'ZonaRuines', 'cami');
        this.sortida(0, 380, 14, 140, 'ZonaErmita', 'cami');

        this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x3a1a55, 0.10).setScrollFactor(0).setDepth(90000);
    }
}

// ---------------- ERMITA DE LA DESAPARICIÓ (exterior) ----------------
class ZonaErmita extends ZonaBase {
    constructor() {
        super('ZonaErmita', {
            pins: { pinyer: 0.4 },
            nom: 'Ermita de la Desaparició',
            amplada: 1400,
            alcada: 1000,
            entrades: {
                cami:     { x: 1340, y: 705, dir: 'esquerra' },
                era:      { x: 320,  y: 940, dir: 'amunt' },
                interior: { x: 500,  y: 710, dir: 'avall' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1400, 1000, -1100);
        this.terra('cami', 400, 640, 1000, 130);
        this.terra('cami', 240, 640, 160, 360);          // baixa cap a l'Era (a la banda esquerra)

        // Ermita gran (620 d'ample): la porta fa ~177 d'alt, més que l'Ineu
        this.edifici('ermita', 500, 600, 590, 110, 'ZonaErmitaInt', 'ermita', { alt: 90 });
        this.portaAnimada({ x: 500, top: 391, bottom: 570, ample: 124, fons: 580, color: 0xa8543a, vora: 0x3a1a0c, ferro: true });   // la porta de fusta vermella, amb ferros
        // Xiprers alts als costats de l'ermita (com a la capella real)
        [[130, 600, 1.5], [870, 600, 1.5], [60, 560, 1.35], [940, 560, 1.35], [100, 500, 1.2], [900, 500, 1.2], [30, 620, 1.3], [970, 620, 1.3]].forEach(([x, y, e]) => this.posar('xiprer', x, y, { escala: e, col: { w: 26, h: 12 } }));
        this.interactiu(500, 640, 70, DIALEGS.ermitaPorta, { altura: 190, actiu: () => false });

        // Creu de la Desaparició, davant la finestra de la dreta de l'ermita i a l'altra banda del camí (no té cap paper a la trama: només es pot llegir)
        this.posar('creu_desaparicio', 660, 840, { col: { w: 46, h: 22 } });
        this.interactiu(660, 847, 80, DIALEGS.creuDesaparicio, { altura: 180 });

        this.cartell(1120, 610, DIALEGS.sortidaErmita);
        this.arbres([[120, 200], [900, 160], [1150, 240], [1300, 160], [150, 520],
                     [100, 860], [1200, 880], [1320, 480]]);
        this.muralla(0, 330, 0, 800, 100);

        this.enemic('escolopendra', 700, 800);
        this.sortida(1386, 640, 14, 130, 'ZonaCami', 'ermita');
        this.sortida(240, 986, 160, 14, 'ZonaEra', 'ermita');
    }
}

// ---------------- ERMITA DE LA DESAPARICIÓ (interior) ----------------
class ZonaErmitaInt extends ZonaBase {
    constructor() {
        super('ZonaErmitaInt', {
            nom: 'Ermita de la Desaparició',
            amplada: 1000,
            alcada: 700,
            colorFons: '#140e0a',
            pacifica: true,
            entrades: { porta: { x: 500, y: 630, dir: 'amunt' } }
        });
    }

    construir() {
        this.terra('pedra', 100, 40, 800, 660, -1100);
        // Paret del fons (amb vitrall i fornícules) i murs laterals de pedra
        this.add.image(100, 0, 'paret_ermita').setOrigin(0).setScale(1 / RES).setDepth(-995);
        this.add.image(60, 0, 'mur_ermita').setOrigin(0).setScale(1 / RES).setDepth(-995);
        this.add.image(900, 0, 'mur_ermita').setOrigin(0).setScale(1 / RES).setDepth(-995).setFlipX(true);
        // El terra s'enfosqueix cap a les parets
        const vora = this.add.graphics().setDepth(-1040);
        vora.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.45, 0, 0.45, 0).fillRect(100, 170, 110, 530);
        vora.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0.45, 0, 0.45).fillRect(790, 170, 110, 530);
        this.colisio(30, 350, 60, 700);
        this.colisio(970, 350, 60, 700);
        this.colisio(500, 85, 800, 170);
        this.colisio(300, 690, 400, 20);
        this.colisio(700, 690, 400, 20);

        // Catifa de la porta a l'altar i graons de l'altar
        this.add.image(500, 690, 'catifa_ermita').setOrigin(0.5, 1).setScale(1 / RES).setDepth(-1050);
        this.add.image(500, 262, 'graons_ermita').setOrigin(0.5, 0).setScale(1 / RES).setDepth(-990);

        // Pilastres de pedra adossades als murs laterals
        [[122, 330], [122, 520], [122, 680], [878, 330], [878, 520], [878, 680]].forEach(([x, y]) => {
            this.add.image(x, y, 'pilastra_ermita').setOrigin(0.5, 1).setScale(1 / RES).setDepth(y);
            this.colisio(x, y - 8, 40, 16);
        });
        // Bancs de fusta dels fidels
        [[260, 450], [260, 590], [740, 450], [740, 590]].forEach(([x, y]) => this.posar('banc', x, y, { col: { w: 120, h: 20 } }));

        // Dues taules de pedra al fons, darrere l'altar
        this.posar('taula_pedra', 340, 190, { col: { w: 100, h: 20 } });
        this.interactiu(340, 210, 90, DIALEGS.taulaPedra(1), { altura: 170 });
        this.posar('taula_pedra2', 660, 190, { col: { w: 100, h: 20 } });
        this.interactiu(660, 210, 90, DIALEGS.taulaPedra(2), { altura: 170 });

        // Altar (sense text: es mira) amb les ofrenes dels nens als peus i dos canelobres
        this.posar('altar', 500, 300, { col: { w: 140, h: 36 } });
        this.add.image(500, 374, 'ofrenes_ermita').setOrigin(0.5, 1).setScale(1 / RES).setDepth(374);
        [[392, 352], [608, 352]].forEach(([x, y], i) => {
            this.add.image(x, y, 'candelabre_hall').setOrigin(0.5, 1).setScale(1 / RES).setDepth(y);
            this.colisio(x, y - 8, 24, 14);
            const llum = this.add.circle(x, y - 78, 70, 0xffc060, 0.1).setDepth(y + 1);
            this.tweens.add({ targets: llum, alpha: 0.05, scale: 0.92, yoyo: true, repeat: -1, duration: 420 + i * 90 });
        });

        // Un raig de llum del vitrall cau sobre l'altar, amb pols flotant
        const raig = this.add.graphics().setDepth(79000).setBlendMode(Phaser.BlendModes.ADD);
        raig.fillStyle(0xffe6a0, 0.1).fillPoints([{ x: 462, y: 100 }, { x: 538, y: 100 }, { x: 640, y: 330 }, { x: 360, y: 330 }], true);
        this.tweens.add({ targets: raig, alpha: 0.55, yoyo: true, repeat: -1, duration: 2600, ease: 'Sine.easeInOut' });
        this.add.particles(0, 0, 'espurna', {
            x: { min: 400, max: 600 }, y: { min: 130, max: 340 }, speedX: { min: -6, max: 6 }, speedY: { min: -10, max: 2 },
            lifespan: 4200, scale: { start: 0.22, end: 0 }, alpha: { start: 0.5, end: 0 }, tint: [0xfff0c0, 0xffffff], frequency: 240, blendMode: 'ADD'
        }).setDepth(79001);

        this.add.rectangle(500, 350, 800, 700, 0xffd38a, 0.04).setDepth(80000);
        this.sortida(460, 680, 80, 14, 'ZonaErmita', 'interior');
    }
}

// ---------------- L'ERA ----------------
// Un encreuament de camins de terra (Ermita al nord, Rovellonera a ponent, Jardí a llevant) i, al sud, una gran clariana
// de gespa amb dos roures enormes i, al mig, dos bancs un davant de l'altre.
const ERA_BANC_X = 960, ERA_BANC_N = 700, ERA_BANC_S = 880;   // pujats perquè la caixa de diàleg (a baix) no tapi l'Ineu assegut

class ZonaEra extends ZonaBase {
    constructor() {
        super('ZonaEra', {
            pins: { pinyer: 0.4 },
            nom: "L'Era",
            amplada: 1800,
            alcada: 1300,
            entrades: {
                ermita: { x: 320,  y: 70,  dir: 'avall' },
                jardi:  { x: 1740, y: 565, dir: 'esquerra' },
                rovellonera: { x: 60, y: 565, dir: 'dreta' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1800, 1300, -1100);
        this.add.image(ERA_BANC_X, 800, 'clariana').setDisplaySize(1500, 900).setDepth(-1050);   // gespa tallada de l'era
        this.terra('cami', 240, 0, 160, 630);             // cap a l'Ermita (nord)
        this.terra('cami', 0, 500, 1800, 130);            // de la Rovellonera (oest) al Jardí (est)

        // Dos roures enormes amb dos bancs al mig, un davant de l'altre: el Garf seu al del nord i l'Ineu pot seure al del sud
        this.posar('roure', 520, 1080, { escala: 1.7, col: { w: 90, h: 36 } });
        this.posar('roure', 1400, 1080, { escala: 1.7, col: { w: 90, h: 36 } });
        this.posar('banc_respatller', ERA_BANC_X, ERA_BANC_N, { col: { w: 140, h: 16 } });
        this.bancSud = this.posar('banc_davant', ERA_BANC_X, ERA_BANC_S, { col: { w: 140, h: 16 } });   // sempre amb respatller (vist per darrere)

        // El Garf, savi inventor: jove, grassonet i ros, assegut al banc de dalt
        this.garf = this.npc('garf', ERA_BANC_X, ERA_BANC_N, DIALEGS.garf);
        // L'Ineu s'asseu i s'hi queda fins que es vulgui aixecar (movent-se)
        this.assegut = false;
        this.interactiu(ERA_BANC_X, ERA_BANC_S, 100, () => { this.seure(); return DIALEGS.garf(Estat); }, { altura: 150 });

        // L'Home del Carruatge Verd, a la vora sud-oest
        this.posar('carruatge', 260, 1230, { col: { w: 190, h: 50 } });
        this.npc('home_carruatge', 390, 1250, DIALEGS.homeCarruatge);

        this.cartell(470, 485, DIALEGS.cartellEra);
        this.arbres([[70, 200], [560, 150], [760, 230], [1000, 170], [1250, 230], [1500, 160], [1700, 260],
                     [600, 380], [900, 400], [1200, 390], [1550, 400], [1540, 740], [300, 800], [90, 1000],
                     [1700, 1100], [1700, 1270], [1000, 1270], [700, 1270], [120, 1280]]);

        this.sortida(240, 0, 160, 14, 'ZonaErmita', 'era');
        this.sortida(1786, 500, 14, 130, 'ZonaJardi', 'era');
        this.sortida(0, 500, 14, 130, 'ZonaCamiRov', 'era');
    }

    // L'Ineu s'asseu al banc del sud, de cara al Garf, i hi continua assegut després de parlar: només s'aixeca
    // quan el jugador es mou (vegeu ZonaBase.moure). El respatller del banc el tapa per darrere.
    seure() {
        const nou = !this.assegut;
        this.assegut = true;
        Estat.posaFlag('garfBancSegut');
        this.ineu.body.checkCollision.none = true;
        this.ineu.body.reset(ERA_BANC_X, ERA_BANC_S - 4);
        this.ombraIneu.setPosition(ERA_BANC_X, ERA_BANC_S - 4);
        this.ineu.setDepth(ERA_BANC_S - 1);                       // el banc es dibuixa per sobre: el respatller el tapa
        this.vista8Manual = true;
        this.posarDireccio('amunt', false, 'up');                 // sempre de cara al Garf, vingui d'on vingui
        if (nou) {
            this.flotant(ERA_BANC_X, ERA_BANC_S - 150, "L'Ineu s'asseu al banc", '#f2e6c8');
            this.ui().notifica("Mou-te per aixecar-te");
        }
    }

    alcar() {
        this.assegut = false;
        this.ineu.body.checkCollision.none = false;
        this.ineu.body.reset(ERA_BANC_X, ERA_BANC_S + 48);
        this.posarDireccio('avall', false);
    }
}

// ---------------- L'HOSTATGERIA ----------------
// Un gran edifici de pedra a la dreta i, enganxada al seu lateral esquerre, una pèrgola d'arcades de pedra: és un jardí
// de gespa amb flors (només allà dins n'hi ha). Les arcades del davant són a la mateixa línia que la façana de la casa i
// tan altes com la seva planta baixa, perquè la façana i la pèrgola es llegeixin com una sola obra. Dins hi ha la Prunera
// Màgica i la llosa del passadís secret de la masmorra; davant l'entrada, l'Isidre. El camí de l'Era i de la Taverna
// passa per davant (sud). L'id de la zona continua sent ZonaJardi (les partides desades hi compten).
class ZonaJardi extends ZonaBase {
    constructor() {
        super('ZonaJardi', {
            nom: "L'Hostatgeria",
            amplada: 1800,
            alcada: 1100,
            entrades: { era: { x: 60, y: 960, dir: 'dreta' }, taverna: { x: 1740, y: 960, dir: 'esquerra' }, llosa: { x: 512, y: 590, dir: 'avall' }, hostatgeria: { x: 1339, y: 800, dir: 'avall' } }
        });
    }

    construir() {
        let llavor = 5;
        const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
        this.terra('herba', 0, 0, 1800, 1100, -1100);
        this.terra('cami', 0, 880, 1800, 130);            // camí de l'Era a la Taverna, davant la pèrgola i la casa

        // --- L'Hostatgeria: edifici gran a la dreta (1100 d'ample; la paret de l'esquerra és a x≈752) ---
        // La porta (~110x150) queda a x≈1339.
        const casa = this.posar('hostatgeria', 1250, 760, { fonsY: 640 });
        // La façana, amb un forat a la porta (x 1293-1383). Un cop s'ha sortit per dins (o les monges l'han oberta), s'hi pot entrar
        if (this.dadesEntrada.entrada === 'hostatgeria') Estat.posaFlag('portaHostOberta');
        const oberta = Estat.flag('portaHostOberta') || Estat.flag('mongesTrobades');
        this.colisio((700 + 1293) / 2, 715, 1293 - 700, 90);
        this.colisio((1383 + 1800) / 2, 715, 1800 - 1383, 90);
        this.blocDarrere(1250, 1100, 670);
        if (oberta) {
            this.sortida(1295, 686, 86, 30, 'ZonaHostatgeriaInt', 'porta');
            this.portaAnimada({ x: 1338, top: 582, bottom: 719, ample: 90, fons: 640, unic: true, retall: casa });   // la mateixa porta del gràfic, que s'obre
        } else {
            this.colisio(1338, 700, 90, 40);
            this.interactiu(1339, 775, 90, DIALEGS.hostatgeria, { altura: 180 });
        }

        // --- Pèrgola de pedra enganxada al lateral esquerre: dues files de columnes unides per arcades ---
        // Fila del davant a y=760 (la base de la façana); l'alçada de les arcades és la de la planta baixa de la casa
        // (fins a la cornisa). Fila del darrere 300 més amunt: el jardí hi cap de ple.
        const COLS = [132, 284, 436, 588, 740], YB = 460, YF = 760;
        const PLANTA = Math.round(casa.displayHeight * 0.339);            // alçada de la planta baixa de la façana
        const tex = this.textures.get('columna'), escalaBase = (tex.customData && tex.customData.escala) || 1 / RES;
        const colH = tex.getSourceImage().height * escalaBase;            // alçada d'una columna sense escalar
        const ESC = 1.4, ALT_COL = Math.round(colH * ESC), COL_W = Math.round(tex.getSourceImage().width * escalaBase * ESC);
        const pedra = 0xb8b2a4, ombra = 0x6a6458;
        const arcades = this.add.graphics().setDepth(YF + 1);     // arcades del davant (per sobre de l'Ineu si és a dins)
        const darrere = this.add.graphics().setDepth(YB + 1);
        const bigues = this.add.graphics().setDepth(YB + 1);      // bigues transversals: l'Ineu hi passa per davant
        const arc = (g, x1, x2, y) => {
            const cx = (x1 + x2) / 2, y0 = y - ALT_COL, r = (x2 - x1 - COL_W) / 2 + 7;
            g.lineStyle(20, 0x120c08, 1).beginPath().arc(cx, y0, r, Math.PI, Math.PI * 2).strokePath();
            g.lineStyle(14, pedra, 1).beginPath().arc(cx, y0, r, Math.PI, Math.PI * 2).strokePath();
            g.lineStyle(3, ombra, 0.6).beginPath().arc(cx, y0, r - 4, Math.PI, Math.PI * 2).strokePath();
            g.fillStyle(0xcfc9ba, 1).fillRect(cx - 7, y0 - r - 9, 14, 16);                    // clau de l'arc
            g.lineStyle(2, 0x120c08, 1).strokeRect(cx - 7, y0 - r - 9, 14, 16);
        };
        for (let i = 0; i < COLS.length - 1; i++) { arc(arcades, COLS[i], COLS[i + 1], YF); arc(darrere, COLS[i], COLS[i + 1], YB); }
        COLS.forEach(x => {
            bigues.lineStyle(16, 0x120c08, 1).lineBetween(x, YB - ALT_COL - 4, x, YF - ALT_COL - 4);
            bigues.lineStyle(10, pedra, 1).lineBetween(x, YB - ALT_COL - 4, x, YF - ALT_COL - 4);
            this.posar('columna', x, YB, { escala: ESC, col: { w: 34, h: 14 } });
            this.posar('columna', x, YF, { escala: ESC, col: { w: 34, h: 14 } });
        });
        this.pergola = { x0: COLS[0], x1: COLS[COLS.length - 1], yb: YB, yf: YF, planta: PLANTA };

        // La Prunera Màgica, l'únic arbre: dins el jardí de la pèrgola
        const PX = 290, PY = 640;
        this.posar('arbre', PX, PY, { escala: 1.55, col: { w: 60, h: 26 } }).setTint(0xffd878);   // gran i alta: destaca sobre la pèrgola
        this.add.ellipse(PX, PY - 50, 380, 90, 0xffc850, 0.16).setDepth(-1080);
        this.add.ellipse(PX, PY - 220, 330, 240, 0xffc850, 0.18).setDepth(8000);
        this.add.particles(PX, PY - 220, 'espurna', {
            x: { min: -150, max: 150 }, y: { min: -110, max: 90 }, speed: { min: 4, max: 14 }, lifespan: 1800,
            scale: { start: 0.55, end: 0 }, tint: [0xffd060, 0xfff0b0], frequency: 220, alpha: { start: 0.9, end: 0 }
        }).setDepth(8001);
        [[-110, -190], [-60, -250], [0, -300], [70, -260], [120, -200], [-140, -140], [40, -170], [-20, -210], [100, -130], [-90, -100]].forEach(([dx, dy]) => this.add.circle(PX + dx, PY + dy, 10, 0xf0b830).setStrokeStyle(2, 0x7a5010).setDepth(PY + 1));
        this.interactiu(PX, PY + 5, 110, DIALEGS.prunera, { altura: 400 });

        // La llosa del passadís cap al soterrani de l'Hostatgeria, entre les columnes (ben visible). S'obre quan hi creix la flor de lluna
        const LX = 512, LY = 492;      // al buit entre les files de columnes: ni les arcades ni les columnes la tapen
        this.llosaPos = { x: LX, y: LY };
        this.foratLlosa = this.add.graphics().setDepth(-705);                // el forat amb l'escala, tapat per la llosa fins que s'obre
        this.dibuixaForat(LX, LY);
        this.llosa = this.posar('llosa', LX, LY, { fonsY: -700 });
        this.florLluna = this.posar('flors', LX - 66, LY + 22, { escala: 0.8 }).setVisible(false);
        this.interactiu(LX, LY + 5, 80, DIALEGS.llosaJardi, { altura: 60, actiu: () => !Estat.flag('llosaOberta') });

        // --- Gespa amb flors: només dins la pèrgola (cap flor fora). Un rectangle clar fa de gespa ben cuidada ---
        this.add.rectangle((COLS[0] + COLS[COLS.length - 1]) / 2, (YB + YF) / 2, COLS[COLS.length - 1] - COLS[0], YF - YB, 0xc4f08c, 0.14).setDepth(-1090);
        const lliure = (x, y) => Math.hypot(x - PX, (y - PY) * 1.6) > 70 && Math.hypot(x - LX, (y - LY) * 1.6) > 130 && Math.hypot(x - (LX + 84), (y - LY) * 1.6) > 70;
        for (let n = 0, intents = 0; n < 46 && intents < 600; intents++) {
            const x = COLS[0] + 20 + rnd() * (COLS[COLS.length - 1] - COLS[0] - 40), y = YB + 20 + rnd() * (YF - YB - 30);
            if (!lliure(x, y)) continue;
            const f = this.posar('flors', x, y, { fonsY: -800, escala: 0.55 + rnd() * 0.5 });
            f.setTint([0xffffff, 0xffd6e6, 0xfff2b0, 0xd6e8ff][Math.floor(rnd() * 4)]);
            n++;
        }

        // L'Isidre, davant l'entrada de la pèrgola (si la llosa ja és oberta, es queda al costat del forat)
        this.isidre = this.npc('isidre', 510, 915, DIALEGS.isidre);
        if (Estat.flag('llosaOberta')) {
            this.llosa.setPosition(LX + 84, LY + 6).setRotation(0.12);
            this.florLluna.setVisible(true);
            this.posarEntradaForat();
            this.isidre.setPosition(LX + 70, LY + 62).ombra.setPosition(LX + 70, LY + 62);
            this.isidre.punt.x = LX + 70; this.isidre.punt.y = LY + 52;
        }

        this.cartell(1500, 860, () => ({ pagines: [{ qui: '', text: '→ La Taverna\n← L\'Era' }] }));
        this.sortida(0, 900, 14, 130, 'ZonaEra', 'jardi');
        this.sortida(1786, 900, 14, 130, 'ZonaTaverna', 'jardi');
    }

    // Forat quadrat a terra amb una escala que baixa cap al nord (els graons del fons són més foscos)
    dibuixaForat(x, y) {
        const g = this.foratLlosa;
        g.clear();
        g.fillStyle(0x5a5448, 1).fillRoundedRect(x - 44, y - 34, 88, 68, 8).lineStyle(3, 0x120c08, 1).strokeRoundedRect(x - 44, y - 34, 88, 68, 8);
        g.fillStyle(0x0a0604, 1).fillRect(x - 34, y - 26, 68, 52);
        [0x14100c, 0x241c14, 0x3a2e22, 0x5a4a36, 0x7a6648, 0x9a8460].forEach((c, i) => {
            const sy = y - 26 + i * 8.6;
            g.fillStyle(c, 1).fillRect(x - 34, sy, 68, 8.6).lineStyle(1.2, 0x0a0604, 0.9).lineBetween(x - 34, sy + 8.6, x + 34, sy + 8.6);
        });
    }

    posarEntradaForat() {
        const { x, y } = this.llosaPos;
        this.sortidaEscala(x - 34, y - 26, 68, 52, 'ZonaSoterraniHost', 'entrada', y + 30);   // l'Ineu baixa l'escala abans de canviar de zona
    }

    // L'Isidre porta la llavor a la llosa, la planta, la flor creix i la llosa s'aparta i deixa veure l'escala. Tot es veu, no s'explica.
    obrirLlosa() {
        if (this.obrintLlosa || Estat.flag('llosaOberta')) return;
        this.obrintLlosa = true;
        const ui = this.ui(), cam = this.cameras.main, I = this.isidre, { x: LX, y: LY } = this.llosaPos;
        const base = I.scaleX;
        this.tweens.killTweensOf(I);
        ui.bloquejatFins = this.time.now + 16000;
        const espera = ms => new Promise(res => this.time.delayedCall(ms, res));
        const mou = (dest, ms, coix = true) => new Promise(res => {
            const balanceig = coix ? this.tweens.add({ targets: I, angle: { from: -4, to: 4 }, yoyo: true, repeat: -1, duration: 260 }) : null;
            this.tweens.add({
                targets: [I, I.ombra], ...dest, duration: ms, ease: 'Sine.easeInOut',
                onUpdate: () => { I.setDepth(I.y); I.punt.x = I.x; I.punt.y = I.y - 10; },
                onComplete: () => { if (balanceig) { balanceig.stop(); I.setAngle(0); } res(); }
            });
        });
        const pols = (x, y, tints) => { const p = this.add.particles(x, y, 'espurna', { speed: { min: 20, max: 70 }, angle: { min: 200, max: 340 }, lifespan: 600, scale: { start: 0.35, end: 0 }, tint: tints, quantity: 8, emitting: false }).setDepth(9000); p.explode(10); this.time.delayedCall(800, () => p.destroy()); };
        (async () => {
            cam.stopFollow(); cam.pan(LX, LY + 130, 700, 'Sine.easeInOut');
            await espera(750);
            await mou({ x: 512, y: 780 }, 1400);                    // surt per l'obertura de la pèrgola
            await mou({ x: LX - 14, y: LY + 66 }, 1000);            // fins a la llosa
            this.tweens.add({ targets: I, scaleY: base * 0.78, duration: 450, ease: 'Sine.easeOut' });   // s'ajup a cavar
            [0, 350, 700].forEach(t => this.time.delayedCall(t, () => pols(LX - 14, LY + 68, [0x8a6a44, 0x6a4a2c])));
            await espera(1100);
            this.florLluna.setVisible(true).setScale(0.04);          // la llavor brota
            this.tweens.add({ targets: this.florLluna, scale: 0.8, duration: 1100, ease: 'Back.easeOut' });
            const llum = this.add.particles(LX - 66, LY + 8, 'espurna', { x: { min: -20, max: 20 }, speedY: { min: -40, max: -10 }, lifespan: 1400, scale: { start: 0.4, end: 0 }, alpha: { start: 1, end: 0 }, tint: [0xbfe8ff, 0xffffff], frequency: 120, blendMode: 'ADD' }).setDepth(9000);
            await espera(1500);
            this.tweens.add({ targets: I, scaleY: base, duration: 350 });
            await mou({ x: LX + 70, y: LY + 62 }, 900);             // s'aparta cap a la dreta
            Sfx.secret(); cam.shake(500, 0.004);
            this.tweens.add({ targets: this.llosa, x: LX + 84, y: LY + 6, rotation: 0.12, duration: 1500, ease: 'Cubic.easeInOut' });   // la llosa llisca i descobreix l'escala
            pols(LX + 20, LY, [0xa89878, 0x8a8478]);
            await espera(1800);
            llum.stop(); this.time.delayedCall(1500, () => llum.destroy());
            Estat.posaFlag('llosaOberta');
            this.posarEntradaForat();
            I.punt.x = I.x; I.punt.y = I.y - 10;
            this.tweens.add({ targets: I, scaleY: base * 1.02, yoyo: true, repeat: -1, duration: 1200 });
            Estat.posaObjectiu("Baixa per l'escala oberta a la llosa del jardí: és el soterrani de l'Hostatgeria.");
            Estat.desar();
            cam.pan(this.ineu.x, this.ineu.y, 700, 'Sine.easeInOut');
            await espera(750);
            cam.startFollow(this.ineu, true, 0.12, 0.12);
            ui.bloquejatFins = 0;
            this.obrintLlosa = false;
        })();
    }
}

// ---------------- LA TAVERNA (entre l'Hostatgeria i els arcs de la Casa Gran) ----------------
// Una sola escena de poble: el camí d'est a oest passa per davant la façana de la Taverna. La porta és tancada
// (la Carmen no obre a ningú aquests dies; el pas del fons, a la banda de sota, encara no existeix).
class ZonaTaverna extends ZonaBase {
    constructor() {
        super('ZonaTaverna', {
            nom: 'La Taverna',
            amplada: 1600,
            alcada: 1100,
            entrades: { jardi: { x: 60, y: 960, dir: 'dreta' }, casagran: { x: 1540, y: 960, dir: 'esquerra' }, interior: { x: 800, y: 820, dir: 'avall' }, soterrani: { x: 1340, y: 880, dir: 'avall' } }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1600, 1100, -1100);
        this.terra('cami', 0, 880, 1600, 130);              // camí de l'Hostatgeria als arcs de la Casa Gran
        this.terra('llamborda', 320, 740, 960, 140);        // replà empedrat davant la façana

        // Façana (900 d'ample, tres plantes): la porta és l'arc del mig
        const t = this.taverna = this.posar('taverna', 800, 750, { fonsY: 640 });
        this.colisio(555, 705, 410, 90);
        this.colisio(1045, 705, 410, 90);
        this.blocDarrere(800, 900, 660, Math.max(0, 750 - t.displayHeight));
        // La porta (l'arc del mig): tancada fins que l'Eva l'obre des de dins
        this.colPorta = this.colisio(800, 705, 80, 90);
        if (Estat.flag('tavernaOberta')) { this.obrirPorta(); this.portaTavernaAnim(); }
        else this.interactiu(800, 765, 90, DIALEGS.portaTaverna, { altura: 170, actiu: () => !Estat.flag('tavernaOberta'), enTancar: () => this.obrirPorta() });

        // Barrils a la dreta, taula i banc a l'esquerra, contra la façana
        this.posar('barril', 1150, 800, { col: { w: 40, h: 16 } });
        this.posar('barril', 1200, 812, { col: { w: 40, h: 16 } });
        this.posar('banc', 520, 790, { col: { w: 130, h: 22 } });
        this.posar('taula', 400, 805, { escala: 0.7, col: { w: 110, h: 22 } });

        this.cartell(260, 860, () => ({ pagines: [{ qui: '', text: '← L\'Hostatgeria i l\'Era\n→ Els arcs de la Casa Gran' }] }));
        this.arbres([[130, 250], [200, 560], [1460, 330], [1450, 600], [60, 1070], [1180, 1050]]);   // cap arbre davant el cartell

        // La porta de ferro del soterrani, per fora, al darrere de la Taverna (a la dreta de la façana): la Clau de ferro l'obre
        this.portaSot = this.add.graphics().setDepth(780);
        this.pintarPortaSoterrani(Estat.flag('portaSoterraniOberta'));
        this.colisio(1340, 765, 130, 40);
        this.boiraSot = this.boira(1340, 790, 60, 14, 0.5);
        if (Estat.flag('portaSoterraniOberta')) this.sortida(1290, 780, 100, 30, 'ZonaSotaTaverna', 'exterior');
        else this.interactiu(1340, 830, 90, DIALEGS.portaSoterrani, { altura: 90, actiu: () => !Estat.flag('portaSoterraniOberta'), enTancar: () => this.obrirSoterrani() });

        this.sortida(0, 900, 14, 130, 'ZonaJardi', 'taverna');
        this.sortida(1586, 900, 14, 130, 'ZonaCasaGran', 'oest');
    }

    // Porta de ferro inclinada (de soterrani): dues fulles amb reblons sobre un marc de pedra; oberta, es veu l'escala
    pintarPortaSoterrani(oberta) {
        const g = this.portaSot, x = 1340, y = 790;
        g.clear();
        g.fillStyle(0x000000, 0.3).fillEllipse(x, y + 6, 170, 30);
        g.fillStyle(0x7a6a58, 1).fillRect(x - 78, y - 60, 156, 66).lineStyle(3, 0x2a1e14, 1).strokeRect(x - 78, y - 60, 156, 66);
        if (oberta) {
            g.fillStyle(0x0a0608, 1).fillRect(x - 64, y - 50, 128, 50);
            for (let k = 0; k < 4; k++) g.fillStyle(0x4a4450 - k * 0x080808, 1).fillRect(x - 54 + k * 4, y - 46 + k * 12, 108 - k * 8, 9);
            g.fillStyle(0x2a2a30, 1).fillRect(x - 96, y - 74, 30, 70).fillRect(x + 66, y - 74, 30, 70);
        } else {
            [-1, 1].forEach(s => {
                g.fillStyle(0x2a2a30, 1).fillRect(x + (s < 0 ? -64 : 0), y - 50, 64, 50).lineStyle(2, 0x111114, 1).strokeRect(x + (s < 0 ? -64 : 0), y - 50, 64, 50);
                for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) g.fillStyle(0x5a5a62, 1).fillCircle(x + (s < 0 ? -54 : 10) + c * 20, y - 42 + r * 16, 3);
            });
            g.fillStyle(0x8a7a40, 1).fillRect(x - 8, y - 32, 16, 18).fillStyle(0x0a0808, 1).fillRect(x - 3, y - 27, 6, 9);
        }
    }

    obrirSoterrani() {
        if (!Estat.flag('clauFerro') || Estat.flag('portaSoterraniOberta')) return;
        Estat.posaFlag('portaSoterraniOberta');
        Sfx.secret(); this.cameras.main.shake(300, 0.003);
        this.pintarPortaSoterrani(true);
        // Les dues fulles de ferro s'obren cap als costats (giren sobre la frontissa de fora) i descobreixen l'escala
        [-1, 1].forEach(s => {
            const f = this.add.graphics().setDepth(781).setPosition(1340 + s * 64, 790);   // l'origen és la frontissa (vora de fora)
            const x0 = s < 0 ? 0 : -64;
            f.fillStyle(0x2a2a30, 1).fillRect(x0, -50, 64, 50).lineStyle(2, 0x111114, 1).strokeRect(x0, -50, 64, 50);
            for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) f.fillStyle(0x5a5a62, 1).fillCircle(x0 + 10 + c * 20, -42 + r * 16, 3);
            this.tweens.add({ targets: f, scaleX: 0.08, duration: 900, ease: 'Sine.easeInOut', onComplete: () => f.destroy() });
        });
        this.sortida(1290, 780, 100, 30, 'ZonaSotaTaverna', 'exterior');
        Estat.posaObjectiu('Baixa al soterrani de la Taverna per la porta de ferro de fora.');
        Estat.desar();
    }

    // L'Eva treu el cap per l'aparador de l'esquerra, mira a banda i banda, i torna a dins
    evaFinestra(fet) {
        const eva = this.add.image(548, 700, 'eva').setOrigin(0.5, 1).setDepth(800).setAlpha(0);
        eva.setScale(((this.textures.get('eva').customData || {}).escala || 0.5) * 0.9);
        this.tweens.add({ targets: eva, alpha: 1, y: 690, duration: 500, onComplete: () => {
            this.tweens.add({ targets: eva, scaleX: -eva.scaleX, yoyo: true, repeat: 1, duration: 300, delay: 200, onComplete: () => {
                this.tweens.add({ targets: eva, alpha: 0, delay: 300, duration: 400, onComplete: () => { eva.destroy(); fet(); } });
            } });
        } });
    }
    // Se sent el forrellat i la porta del mig s'obre (es veu fosc a dins)
    obrirPortaAnim(fet) {
        Sfx.secret && Sfx.secret();
        const P = this.portaTavernaAnim();
        P.forcaFins = this.time.now + 1400;          // els batents s'obren sols; després segueixen l'Ineu com la resta de portes
        this.time.delayedCall(900, fet);
    }

    // L'arc del mig de la façana: els batents són el tros del mateix gràfic i giren cap endins quan l'Ineu s'hi acosta
    portaTavernaAnim() {
        return this.portaTaverna || (this.portaTaverna = this.portaAnimada({ x: 800, top: 555, bottom: 745, ample: 112, fons: 640, unic: true, arc: true, retall: this.taverna }));
    }

    obrirPorta() {
        if (!Estat.flag('tavernaOberta') || this.portaOberta) return;
        this.portaOberta = true;
        this.obstacles.remove(this.colPorta, true, true);
        this.sortida(762, 690, 76, 56, 'ZonaTavernaInt', 'porta');
    }
}

// ---------------- CABANA AMAGADA (camí secret del Camí de la Desaparició) ----------------
// Una cabana de llenyataire tota de fusta: terra de taulons, parets de troncs, una finestra, un banc, una taula
// amb tamborets, un barril, una pila de llenya i un tronc de picar amb la destral. El cofre és al fons.
class ZonaCabanaCami extends ZonaBase {
    constructor() {
        super('ZonaCabanaCami', {
            nom: 'Cabana amagada',
            amplada: 900,
            alcada: 700,
            colorFons: '#140e0a',
            pacifica: true,
            entrades: { porta: { x: 450, y: 600, dir: 'amunt' } }
        });
    }

    construir() {
        this.terra('taulons', 100, 40, 700, 660, -1100);

        // --- Parets de troncs (les mateixes que fa servir la cabana de la Jaumeta) ---
        paretsTroncs(this);
        this.colisio(30, 350, 60, 700);
        this.colisio(870, 350, 60, 700);
        this.colisio(450, 60, 800, 120);
        this.colisio(255, 690, 310, 20);                  // paret de baix, amb un buit al mig: la porta
        this.colisio(645, 690, 310, 20);

        // Finestra amb marc de fusta i la llum que n'entra
        const fin = this.add.graphics().setDepth(-980);
        fin.fillStyle(0x120a04, 1).fillRect(296, 18, 88, 64);
        fin.fillStyle(0xf0d890, 0.9).fillRect(302, 24, 76, 52);
        fin.fillStyle(0x8ec8e8, 0.35).fillRect(302, 24, 76, 20);
        fin.lineStyle(5, 0x5a3a1e, 1).strokeRect(300, 22, 80, 56).lineBetween(340, 22, 340, 78).lineBetween(300, 50, 380, 50);
        fin.fillStyle(0x7a4e2a, 1).fillRect(290, 78, 100, 8);                                  // ampit
        const llum = this.add.graphics().setDepth(-900);
        llum.fillStyle(0xffe8a0, 0.13).fillPoints([{ x: 304, y: 92 }, { x: 376, y: 92 }, { x: 430, y: 330 }, { x: 330, y: 330 }], true);
        // Prestatge amb gerros, al fons a la dreta
        const pres = this.add.graphics().setDepth(-980);
        pres.fillStyle(0x4a2c14, 1).fillRect(520, 56, 130, 8).lineStyle(2, 0x120a04, 1).strokeRect(520, 56, 130, 8);
        [[540, 0], [578, 1], [616, 2]].forEach(([x, t]) => this.posar('gerro_' + t, x, 56, { fonsY: -970 }));

        // Manats d'herbes i alls penjats de les bigues, una destral clavada a la paret i teranyines a les cantonades
        [[470, 98], [505, 100], [250, 100]].forEach(([x, y], i) => manatHerbes(this, x, y - 62, 38 + (i % 2) * 8, i === 2 ? [0xe8e0c8, 0xd8d0b0, 0xe8e0c8] : undefined));
        const destral = this.add.graphics().setDepth(-975);
        destral.fillStyle(0x6a4020, 1).fillRect(140, 30, 5, 52).lineStyle(1.5, 0x120a04, 1).strokeRect(140, 30, 5, 52);
        destral.fillStyle(0x8a8a92, 1).fillTriangle(145, 34, 172, 26, 172, 58).fillRect(145, 34, 5, 20);
        destral.lineStyle(2, 0x120a04, 1).strokeTriangle(145, 34, 172, 26, 172, 58);
        destral.fillStyle(0xffffff, 0.45).fillRect(165, 32, 2, 18);
        teranyina(this, 100, 98, 100, 150, 150, 98);
        teranyina(this, 800, 98, 800, 148, 752, 98);
        // Un fanal penjat del sostre il·lumina la taula
        const fanal = this.add.graphics().setDepth(79000);
        fanal.lineStyle(2, 0x120a04, 1).lineBetween(450, 0, 450, 98);
        fanal.fillStyle(0x3a3a40, 1).fillRect(440, 98, 20, 4).fillRect(440, 126, 20, 4);
        fanal.fillStyle(0xffd890, 0.95).fillRect(443, 102, 14, 24).lineStyle(2, 0x120a04, 1).strokeRect(443, 102, 14, 24);
        const llumFanal = this.add.circle(450, 114, 120, 0xffd38a, 0.1).setDepth(79000);
        this.tweens.add({ targets: llumFanal, alpha: 0.16, yoyo: true, repeat: -1, duration: 900 });

        // Catifa de teixit sota la taula
        const catifa = this.add.graphics().setDepth(-950);
        catifa.fillStyle(0x6a2a2a, 1).fillRoundedRect(310, 360, 280, 180, 8);
        catifa.lineStyle(3, 0xc8a050, 1).strokeRoundedRect(318, 368, 264, 164, 6);
        catifa.lineStyle(2, 0x3a1414, 1).strokeRoundedRect(310, 360, 280, 180, 8).strokeRoundedRect(332, 384, 236, 132, 4);

        // Mobles de fusta
        this.posar('banc_respatller', 400, 200, { col: { w: 140, h: 16 } });
        this.posar('barril', 150, 175, { col: { w: 50, h: 22 } });
        this.posar('barril', 205, 160, { col: { w: 50, h: 22 } });
        this.posar('taula', 450, 470, { col: { w: 160, h: 30 } });
        this.posar('tamboret', 340, 505, { col: { w: 40, h: 16 } });
        this.posar('tamboret', 565, 505, { col: { w: 40, h: 16 } });
        // El solitari del Ciscu, estirat sobre la taula, i el Ciscu (el fill de la Carmen) al costat
        const cartes = this.add.graphics().setDepth(480);
        for (let c = 0; c < 7; c++) for (let f = 0; f <= Math.min(c, 3); f++) {
            const x = 386 + c * 19, y = 418 + f * 7, tapada = f < Math.min(c, 3);
            cartes.fillStyle(tapada ? 0x8a2a2a : 0xf4ecd8, 1).fillRect(x, y, 15, 21).lineStyle(1, 0x3a2410, 1).strokeRect(x, y, 15, 21);
            if (!tapada) cartes.fillStyle([0xc8a030, 0x2a5aa0, 0xb83a3a, 0x3a8a3a][c % 4], 1).fillCircle(x + 7.5, y + 10, 3);
        }
        cartes.fillStyle(0x8a2a2a, 1).fillRect(520, 420, 15, 21).lineStyle(1, 0x3a2410, 1).strokeRect(520, 420, 15, 21);
        this.interactiu(450, 440, 70, DIALEGS.solitari, { altura: 60 });
        this.npc('ciscu', 520, 560, DIALEGS.ciscu, { flipX: true });
        this.posar('llenya', 735, 410, { col: { w: 110, h: 26 } });
        this.posar('tronc_tall', 160, 540, { col: { w: 70, h: 24 } });

        // Un cofre petit entre dues espelmes
        this.posar('cofre', 690, 250, { col: { w: 50, h: 20 } });
        this.interactiu(690, 255, 85, DIALEGS.cofreCabanaCami, { altura: 80 });
        [[630, 258], [750, 258]].forEach(([x, y], i) => {
            const e = this.posar('espelma', x, y, { fonsY: y });
            this.tweens.add({ targets: e, alpha: 0.7, yoyo: true, repeat: -1, duration: 350 + i * 90 });
        });

        this.add.rectangle(450, 350, 700, 700, 0xffd38a, 0.05).setDepth(80000);
        this.sortida(410, 672, 80, 22, 'ZonaCami', 'secret');
    }
}
