/**
 * EL CAMÍ DE LA DESAPARICIÓ I LES SEVES PARADES
 * Camí (12 columnes) → Ermita de la Desaparició (exterior i interior) → L'Era → Jardí pergolat.
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
        this.sortides.push({ r: new Phaser.Geom.Rectangle(1320, 96, 120, 40), desti: 'ZonaCabanaCami', entrada: 'porta' });
        this.muralla(0, 770, 2800, 770, 130);
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

        // Creu de la Desaparició, davant l'ermita i a l'altra banda del camí (no té cap paper a la trama: només es pot llegir)
        this.posar('creu_desaparicio', 500, 840, { col: { w: 46, h: 22 } });
        this.interactiu(500, 847, 80, DIALEGS.creuDesaparicio, { altura: 180 });

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
const ERA_BANC_X = 960, ERA_BANC_N = 670, ERA_BANC_S = 870;   // pujats perquè la caixa de diàleg (a baix) no tapi l'Ineu assegut

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
        this.add.image(ERA_BANC_X, 920, 'clariana').setDisplaySize(1500, 900).setDepth(-1050);   // gespa tallada de l'era
        this.terra('cami', 240, 0, 160, 630);             // cap a l'Ermita (nord)
        this.terra('cami', 0, 500, 1800, 130);            // de la Rovellonera (oest) al Jardí (est)

        // Dos roures enormes amb dos bancs al mig, un davant de l'altre: el Garf seu al del nord i l'Ineu pot seure al del sud
        this.posar('roure', 560, 1080, { escala: 1.7, col: { w: 90, h: 36 } });
        this.posar('roure', 1360, 1080, { escala: 1.7, col: { w: 90, h: 36 } });
        this.posar('banc', ERA_BANC_X, ERA_BANC_N, { col: { w: 140, h: 16 } });
        this.posar('banc', ERA_BANC_X, ERA_BANC_S, { col: { w: 140, h: 16 } });

        // El Garf, savi inventor: jove, grassonet i ros, assegut al banc de dalt
        this.garf = this.npc('garf', ERA_BANC_X, ERA_BANC_N, DIALEGS.garf);
        this.interactiu(ERA_BANC_X, ERA_BANC_S, 100, () => { this.seure(); return DIALEGS.garf(Estat); }, {
            altura: 150, enTancar: () => this.alcar()
        });

        // L'Home del Carruatge Verd, a la vora sud-oest
        this.posar('carruatge', 260, 1230, { col: { w: 190, h: 50 } });
        this.npc('home_carruatge', 390, 1250, DIALEGS.homeCarruatge);

        this.cartell(450, 665, DIALEGS.cartellEra);
        this.arbres([[120, 200], [560, 150], [760, 230], [1000, 170], [1250, 230], [1500, 160], [1700, 260],
                     [600, 380], [900, 400], [1200, 390], [1550, 400], [1700, 720], [100, 780], [90, 1000],
                     [1700, 1100], [1700, 1270], [1000, 1270], [700, 1270], [120, 1280]]);

        this.sortida(240, 0, 160, 14, 'ZonaErmita', 'era');
        this.sortida(1786, 500, 14, 130, 'ZonaJardi', 'era');
        this.sortida(0, 500, 14, 130, 'ZonaCamiRov', 'era');
    }

    // L'Ineu s'asseu al banc del sud, de cara al Garf (sense col·lisions mentre dura la conversa)
    seure() {
        this.ineu.body.checkCollision.none = true;
        this.ineu.body.reset(ERA_BANC_X, ERA_BANC_S - 4);
        this.ombraIneu.setPosition(ERA_BANC_X, ERA_BANC_S - 4);
        this.ineu.setDepth(ERA_BANC_S + 1);
        this.vista8Manual = true;
        this.posarDireccio('amunt', false, 'up');   // sempre de cara al Garf, vingui d'on vingui
        this.flotant(ERA_BANC_X, ERA_BANC_S - 136, "L'Ineu s'asseu al banc", '#f2e6c8');
    }

    alcar() {
        this.ineu.body.checkCollision.none = false;
        this.ineu.body.reset(ERA_BANC_X, ERA_BANC_S + 48);
        this.posarDireccio('amunt', false, 'up');
    }
}

// ---------------- JARDÍ PERGOLAT ----------------
// Una pèrgola de pedra, amb columnes i sostre d'heura, enganxada a l'Hospederia (casa d'espiritualitat):
// comuniquen. Dins hi ha un jardí de flors, l'Isidre, la llosa del passadís secret de la masmorra i, al fons
// (a l'oest de tot), la Prunera Màgica. El camí de l'Era i de la Taverna passa per davant (sud).
class ZonaJardi extends ZonaBase {
    constructor() {
        super('ZonaJardi', {
            nom: 'Jardí pergolat',
            amplada: 1600,
            alcada: 1000,
            entrades: { era: { x: 60, y: 840, dir: 'dreta' }, taverna: { x: 1540, y: 840, dir: 'esquerra' } }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1600, 1000, -1100);
        this.terra('cami', 0, 780, 1600, 130);            // camí de l'Era a la Taverna, davant la pèrgola
        this.terra('cami', 740, 690, 150, 100);           // entrada a la pèrgola (buit de la fila de columnes)
        this.terra('cami', 1095, 690, 120, 100);          // porta de l'Hospederia, a l'alçada de l'entrada de la pèrgola
        this.terra('pedra', 300, 470, 700, 100);          // passadís de pedra dins la pèrgola

        // --- Pèrgola de pedra: dues files de columnes ---
        const X0 = 320, X1 = 980, PAS = 110;
        for (let x = X0; x <= X1; x += PAS) {
            this.posar('columna', x, 330, { col: { w: 30, h: 14 } });
            if (x < 740 || x > 890) this.posar('columna', x, 690, { col: { w: 30, h: 14 } });
        }
        // Parets baixes entre columnes (el jardí només s'entra pel buit del davant o per l'Hospederia)
        this.colisio(650, 318, 720, 30);
        this.colisio(520, 690, 440, 18);
        this.colisio(940, 690, 120, 18);
        this.colisio(1005, 520, 20, 400);
        this.colisio(290, 520, 20, 400);

        // Sostre d'heura (per sobre de tot, translúcid: es veu què hi ha a sota)
        const sostre = this.add.graphics().setDepth(85000);
        sostre.fillStyle(0x2c5a2a, 0.5).fillRect(300, 190, 710, 380);
        sostre.lineStyle(10, 0x4a3a28, 0.7);
        for (let x = 320; x <= 980; x += PAS) sostre.lineBetween(x, 190, x, 570);
        sostre.lineBetween(300, 380, 1010, 380);
        let llavor = 5;
        const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
        for (let i = 0; i < 150; i++) {
            sostre.fillStyle(i % 3 ? 0x3f7a3a : 0x6aa04a, 0.55).fillCircle(300 + rnd() * 710, 190 + rnd() * 380, 10 + rnd() * 14);
        }
        for (let x = 310; x < 1010; x += 28) sostre.fillStyle(0x3f7a3a, 0.7).fillCircle(x, 572 + rnd() * 10, 11);

        // --- Jardí de flors dins la pèrgola i voltants ---
        for (let i = 0; i < 48; i++) {
            const x = 350 + rnd() * 610, y = 360 + rnd() * 310;
            if (y > 460 && y < 580) continue;                 // passadís
            if (Math.hypot(x - 520, y - 640) < 70) continue;  // llosa
            this.posar('flors', x, y, { fonsY: -800 });
        }
        for (let i = 0; i < 14; i++) this.posar('flors', 60 + rnd() * 1500, 700 + rnd() * 60 * (i % 2 ? 1 : -1) + 70, { fonsY: -800 });

        // La llosa secreta (passadís cap a la masmorra de l'Hospederia): s'obre quan hi creix la flor de lluna
        this.posar('llosa', 520, 640, { fonsY: -700 });
        this.florLluna = this.posar('flors', 520, 640, { escala: 0.8 });
        this.interactiu(520, 645, 80, DIALEGS.llosaJardi, { altura: 60 });

        // L'Isidre, coix i entranyable, dins la pèrgola
        this.npc('isidre', 780, 530, DIALEGS.isidre);

        // La Prunera Màgica, al fons de la pèrgola (oest)
        const prunera = this.posar('arbre', 345, 540, { col: { w: 40, h: 20 } }).setTint(0xcaa0f0);
        this.add.ellipse(345, 470, 150, 110, 0xb070ff, 0.22).setDepth(8000);
        const prunes = this.add.particles(345, 470, 'espurna', {
            x: { min: -50, max: 50 }, y: { min: -40, max: 30 }, speed: { min: 4, max: 14 }, lifespan: 1800,
            scale: { start: 0.55, end: 0 }, tint: [0xd090ff, 0xffe08a], frequency: 220, alpha: { start: 0.9, end: 0 }
        }).setDepth(8001);
        [[-40, -90], [-10, -110], [30, -95], [50, -70], [-55, -60], [10, -70]].forEach(([dx, dy]) => this.add.circle(345 + dx, 540 + dy, 7, 0x7a2aa8).setStrokeStyle(2, 0x2a0a40).setDepth(541));
        this.interactiu(345, 545, 95, DIALEGS.prunera, { altura: 250 });

        // L'Hospederia, adossada a la pèrgola (a llevant)
        // Façana gran (1100 d'ample), retallada per l'esquerra (a x=1020) i per dalt: la porta (~134x165) queda a x=1155,
        // a l'alçada de l'entrada de la pèrgola (y=690)
        const casa = this.posar('hospederia', 0, 690, { fonsY: 670 });
        const esq = 1155 - 0.581 * casa.displayWidth;                 // vora esquerra de la imatge (la porta és al 58,1% de l'ample)
        casa.setX(esq + casa.displayWidth / 2);
        casa.setCrop((1020 - esq) / casa.scaleX, 0, casa.width - (1020 - esq) / casa.scaleX, casa.height);
        this.colisio(1310, 645, 580, 90);
        this.interactiu(1155, 725, 90, DIALEGS.hospederia, { altura: 150 });

        this.arbres([[1500, 980], [1250, 960], [700, 960], [300, 960], [130, 950], [130, 650], [180, 430],
                     [130, 120], [320, 90], [600, 110], [850, 100]]);

        this.cartell(1100, 840, () => ({ pagines: [{ qui: '', text: '→ La Taverna i la Casa Gran\n← L\'Era' }] }));
        this.sortida(0, 780, 14, 130, 'ZonaEra', 'jardi');
        this.sortida(1586, 780, 14, 130, 'ZonaCasaGran', 'oest');
    }

    actualitzar(ara) {
        this.florLluna.setVisible(Estat.flag('llosaOberta'));
    }
}

// ---------------- CABANA AMAGADA (camí secret del Camí de la Desaparició) ----------------
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
        this.terra('cami', 100, 40, 700, 660, -1100).setTint(0x8a7a60);
        const murs = this.add.graphics().setDepth(-1000);
        murs.fillStyle(0x3a2a1c, 1).fillRect(60, 0, 40, 700).fillRect(800, 0, 40, 700).fillRect(100, 0, 700, 80);
        this.colisio(30, 350, 60, 700);
        this.colisio(870, 350, 60, 700);
        this.colisio(450, 60, 700, 120);
        this.colisio(280, 690, 360, 20);
        this.colisio(620, 690, 360, 20);

        // Un cofre petit entre dues espelmes, i quatre andròmines de llenyataire
        this.posar('cofre', 450, 250, { col: { w: 50, h: 20 } });
        this.interactiu(450, 255, 85, DIALEGS.cofreCabanaCami, { altura: 80 });
        [[360, 260], [540, 260]].forEach(([x, y], i) => {
            const e = this.posar('espelma', x, y, { fonsY: y });
            this.tweens.add({ targets: e, alpha: 0.7, yoyo: true, repeat: -1, duration: 350 + i * 90 });
        });
        [[220, 460], [690, 430]].forEach(([x, y]) => this.posar('roca', x, y, { escala: 0.6, col: { w: 40, h: 16 } }));
        [[230, 200], [680, 520], [330, 540]].forEach(([x, y]) => this.posar('flors', x, y, { fonsY: y - 30 }));

        this.add.rectangle(450, 350, 700, 700, 0xffd38a, 0.05).setDepth(80000);
        this.sortida(410, 680, 80, 14, 'ZonaCami', 'secret');
    }
}
