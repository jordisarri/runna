/**
 * EL CAMÍ DE LA DESAPARICIÓ I LES SEVES PARADES
 * Camí (12 columnes) → Ermita de la Desaparició (exterior i interior) → L'Era → L'Hostatgeria.
 */

// ---------------- CAMÍ DE LA DESAPARICIÓ ----------------
class ZonaCami extends ZonaBase {
    constructor() {
        super('ZonaCami', {
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

        [[700, 450], [1250, 450], [1700, 430], [2200, 450], [2500, 460]].forEach(([x, y]) => this.enemic('escolopendra', x, y));
        this.cartell(2650, 560, DIALEGS.cartellCami);
        // Mur d'arbres del nord: només a x=1380 hi ha dos arbres més separats, i per aquí es puja a la cabana (sense marcar-ho)
        this.muralla(0, 140, 1280, 140, 128);
        this.muralla(1480, 140, 2800, 140, 132);
        this.sortides.push({ r: new Phaser.Geom.Rectangle(1320, 60, 120, 52), desti: 'ZonaCabanaCami', entrada: 'porta', peu: true });   // cal travessar la fila d'arbres fins dalt de tot
        // Fila de baix: als extrems, arbres més petits (la capçada no ha de tapar les sortides de les puntes)
        this.muralla(0, 770, 2800, 770, 130);
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
        const murs = this.add.graphics().setDepth(-1000);
        murs.fillStyle(0x2a1f18, 1).fillRect(60, 0, 40, 700).fillRect(900, 0, 40, 700);
        murs.fillStyle(0x3a2c22, 1).fillRect(100, 0, 800, 70);
        this.colisio(30, 350, 60, 700);
        this.colisio(970, 350, 60, 700);
        this.colisio(500, 55, 800, 110);
        this.colisio(300, 690, 400, 20);
        this.colisio(700, 690, 400, 20);

        // Dues taules de pedra al fons, darrere l'altar
        this.posar('taula_pedra', 340, 190, { col: { w: 90, h: 20 } });
        this.interactiu(340, 210, 90, DIALEGS.taulaPedra(1), { altura: 170 });
        this.posar('taula_pedra', 660, 190, { col: { w: 90, h: 20 } });
        this.interactiu(660, 210, 90, DIALEGS.taulaPedra(2), { altura: 170 });

        // Altar
        this.posar('altar', 500, 300, { col: { w: 140, h: 36 } });
        this.interactiu(500, 330, 85, DIALEGS.altarErmita, { altura: 100 });

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
// Un gran edifici de pedra a la dreta i, enganxada al seu lateral esquerre, una pèrgola d'arcades de pedra
// i columnes (sense sostre: es veu tot l'interior). Dins hi ha la llosa del passadís secret de la masmorra;
// a l'extrem oest hi ha la Prunera Màgica, i davant l'entrada de la pèrgola, l'Isidre. El camí de l'Era
// i de la Taverna passa per davant (sud). L'id de la zona continua sent ZonaJardi (les partides desades hi compten).
class ZonaJardi extends ZonaBase {
    constructor() {
        super('ZonaJardi', {
            nom: "L'Hostatgeria",
            amplada: 1800,
            alcada: 1100,
            entrades: { era: { x: 60, y: 960, dir: 'dreta' }, taverna: { x: 1740, y: 960, dir: 'esquerra' } }
        });
    }

    construir() {
        let llavor = 5;
        const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
        this.terra('herba', 0, 0, 1800, 1100, -1100);
        this.terra('cami', 0, 880, 1800, 130);            // camí de l'Era a la Taverna, davant la pèrgola i la casa
        this.terra('pedra', 290, 630, 462, 215, -999).setTint(0xe2d6c2);    // lloses de pedra dins la pèrgola

        // --- L'Hostatgeria: edifici gran a la dreta (1100 d'ample; la paret de l'esquerra és a x≈752) ---
        // La porta (~110x150) queda a x≈1339.
        this.posar('hostatgeria', 1250, 760, { fonsY: 640 });
        this.colisio(1250, 715, 1100, 90);
        this.blocDarrere(1250, 1100, 670);
        this.interactiu(1339, 775, 90, DIALEGS.hostatgeria, { altura: 180 });

        // --- Pèrgola de pedra enganxada al lateral esquerre: dues files de columnes unides per arcades ---
        const COLS = [310, 450, 590, 730], YB = 640, YF = 840, ALT_COL = 139;
        const pedra = 0xb8b2a4, ombra = 0x6a6458;
        const arcades = this.add.graphics().setDepth(YF + 1);     // arcades del davant (per sobre de l'Ineu si és a dins)
        const darrere = this.add.graphics().setDepth(YB + 1);
        const bigues = this.add.graphics().setDepth(YB + 1);      // bigues transversals: l'Ineu hi passa per davant
        const arc = (g, x1, x2, y) => {
            const cx = (x1 + x2) / 2, y0 = y - ALT_COL, r = (x2 - x1 - 58) / 2 + 7;
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
            this.posar('columna', x, YB, { col: { w: 30, h: 14 } });
            this.posar('columna', x, YF, { col: { w: 30, h: 14 } });
        });

        // --- Vegetació només al terra: flors i plantes ---
        const flor = (x, y) => {
            const f = this.posar('flors', x, y, { fonsY: -800, escala: 0.8 + rnd() * 0.5 });
            f.setTint([0xffffff, 0xffd6e6, 0xfff2b0, 0xd6e8ff][Math.floor(rnd() * 4)]);
        };
        for (let i = 0; i < 14; i++) flor(300 + rnd() * 440, 650 + rnd() * 170);                   // entre les columnes
        for (let i = 0; i < 10; i++) flor(300 + rnd() * 440, 856 + rnd() * 14);                    // vora de la pèrgola
        for (let i = 0; i < 40; i++) flor(790 + rnd() * 950, 785 + rnd() * 80);                    // parterres davant la casa
        for (let i = 0; i < 26; i++) flor(60 + rnd() * 640, 160 + rnd() * 440);                    // prat del nord
        for (let i = 0; i < 6; i++) flor(60 + rnd() * 200, 800 + rnd() * 60);

        // La llosa secreta (passadís cap a la masmorra de l'Hostatgeria): s'obre quan hi creix la flor de lluna
        this.posar('llosa', 520, 740, { fonsY: -700 });
        this.florLluna = this.posar('flors', 520, 740, { escala: 0.8 });
        this.interactiu(520, 745, 80, DIALEGS.llosaJardi, { altura: 60 });

        // La Prunera Màgica, l'únic arbre: a l'esquerra de tot
        const PX = 120, PY = 720;
        this.posar('arbre', PX, PY, { col: { w: 40, h: 20 } }).setTint(0xcaa0f0);
        this.add.ellipse(PX, PY - 65, 150, 110, 0xb070ff, 0.22).setDepth(8000);
        this.add.particles(PX, PY - 65, 'espurna', {
            x: { min: -50, max: 50 }, y: { min: -40, max: 30 }, speed: { min: 4, max: 14 }, lifespan: 1800,
            scale: { start: 0.55, end: 0 }, tint: [0xd090ff, 0xffe08a], frequency: 220, alpha: { start: 0.9, end: 0 }
        }).setDepth(8001);
        [[-40, -90], [-10, -110], [30, -95], [50, -70], [-55, -60], [10, -70]].forEach(([dx, dy]) => this.add.circle(PX + dx, PY + dy, 7, 0x7a2aa8).setStrokeStyle(2, 0x2a0a40).setDepth(PY + 1));
        this.interactiu(PX, PY + 5, 95, DIALEGS.prunera, { altura: 250 });

        // L'Isidre, davant l'entrada de la pèrgola
        this.npc('isidre', 520, 915, DIALEGS.isidre);

        this.cartell(1500, 860, () => ({ pagines: [{ qui: '', text: '→ La Taverna i la Casa Gran\n← L\'Era' }] }));
        this.sortida(0, 900, 14, 130, 'ZonaEra', 'jardi');
        this.sortida(1786, 900, 14, 130, 'ZonaCasaGran', 'oest');
    }

    actualitzar(ara) {
        this.florLluna.setVisible(Estat.flag('llosaOberta'));
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

        // --- Parets de troncs ---
        const murs = this.add.graphics().setDepth(-990);
        const TRONCS = ['#7a4e2a', '#8a5a30', '#6e4624', '#94643a', '#80542c'];
        // Paret del fons: sis fileres de troncs horitzontals amb llum a dalt i ombra a baix
        for (let f = 0; f < 4; f++) {
            const y = f * 23, col = Phaser.Display.Color.HexStringToColor(TRONCS[f % TRONCS.length]).color;
            murs.fillStyle(0x120a04, 1).fillRoundedRect(58, y, 784, 24, 11);
            murs.fillStyle(col, 1).fillRoundedRect(60, y + 1, 780, 21, 10);
            murs.fillStyle(0xffd9a0, 0.22).fillRect(70, y + 3, 760, 3);
            murs.fillStyle(0x000000, 0.25).fillRect(70, y + 17, 760, 4);
            murs.lineStyle(1, 0x3a2010, 0.5);
            for (let k = 0; k < 6; k++) { const yy = y + 7 + (k % 3) * 4, x0 = 90 + k * 125 + f * 23; murs.lineBetween(x0, yy, x0 + 70, yy); }
        }
        murs.fillStyle(0x120a04, 1).fillRect(58, 92, 784, 6);                                  // sòcol fosc
        // Parets laterals: les puntes dels troncs, amb els seus anells
        [80, 820].forEach(x => {
            for (let y = 92, i = 0; y < 700; y += 24, i++) {
                murs.fillStyle(0x120a04, 1).fillEllipse(x, y + 12, 44, 25);
                murs.fillStyle(0x5a3a1e, 1).fillEllipse(x, y + 12, 40, 22);
                murs.fillStyle(i % 2 ? 0xc89458 : 0xd8a868, 1).fillEllipse(x, y + 12, 32, 17);
                murs.lineStyle(1, 0x7a4a20, 0.6).strokeEllipse(x, y + 12, 22, 11).strokeEllipse(x, y + 12, 11, 5);
            }
        });
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
