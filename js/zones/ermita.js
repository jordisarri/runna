/**
 * L'ERMITA DE LA DESAPARICIÓ (exterior i interior).
 */

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
        this.edifici('ermita', 500, 600, 590, 110, 'ZonaErmitaInt', 'porta', { alt: 90 });
        this.portaAnimada({ x: 500, top: 391, bottom: 570, ample: 124, fons: 580, color: 0xa8543a, vora: 0x3a1a0c, ferro: true });   // la porta de fusta vermella, amb ferros
        // Xiprers alts als costats de l'ermita (com a la capella real)
        [[130, 600, 1.5], [870, 600, 1.5], [60, 560, 1.35], [940, 560, 1.35], [100, 500, 1.2], [900, 500, 1.2], [30, 620, 1.3], [970, 620, 1.3]].forEach(([x, y, e]) => this.posar('xiprer', x, y, { escala: e, col: { w: 26, h: 12 } }));
        this.interactiu(500, 640, RADI_OBJECTE, DIALEGS.ermitaPorta, { altura: 190, actiu: () => false });

        // Creu de la Desaparició, davant la finestra de la dreta de l'ermita i a l'altra banda del camí (no té cap paper a la trama: només es pot llegir)
        this.posar('creu_desaparicio', 660, 895, { escala: 1.5, col: { w: 60, h: 24 }, opac: true });
        this.interactiu(660, 905, RADI_OBJECTE, DIALEGS.creuDesaparicio, { altura: 300 });

        this.cartell(1120, 610, DIALEGS.sortidaErmita);
        this.arbres([[120, 200], [900, 160], [1150, 240], [1300, 160], [150, 520],
                     [100, 860], [1320, 480]]);
        this.posar('xiprer', 1260, 900, { escala: 1.2, col: { w: 26, h: 12 } });       // (abans hi havia un pi pinyer ample que tapava el cartell i el camí)
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
        this.add.image(500, 262, 'graons_ermita').setOrigin(0.5, 0).setScale(1 / RES).setDepth(-990);
        this.registraGraons(310, 690, [[334, 352], [302, 322]]);          // els dos graons de l'altar: frenada i un tap a cada un

        // Pilastres de pedra adossades als murs laterals
        [[122, 330], [122, 520], [122, 680], [878, 330], [878, 520], [878, 680]].forEach(([x, y]) => {
            this.add.image(x, y, 'pilastra_ermita').setOrigin(0.5, 1).setScale(1 / RES).setDepth(y);
            this.colisio(x, y - 8, 40, 16);
        });
        // Bancs de fusta dels fidels
        [[260, 450], [260, 590], [740, 450], [740, 590]].forEach(([x, y]) => this.posarBanc(x, y, 120));

        // Dues taules de pedra al fons, darrere l'altar
        this.posar('taula_pedra', 340, 190, { col: { w: 100, h: 20 } });
        this.interactiu(340, 210, RADI_OBJECTE, DIALEGS.taulaPedra(1), { altura: 170 });
        this.posar('taula_pedra2', 660, 190, { col: { w: 100, h: 20 } });
        this.interactiu(660, 210, RADI_OBJECTE, DIALEGS.taulaPedra(2), { altura: 170 });

        // Altar de pedra nua, amb dos peus de ferro amb les espelmes apagades. Amb les dotze paraules, l'Ineu hi diu la frase i apareix un cofre
        this.posar('altar_ermita', 500, 300, { col: { w: 140, h: 36 }, opac: true });
        const totes = () => Array.from({ length: 12 }, (_, i) => Estat.flag('col' + (i + 1))).every(Boolean);
        this.interactiu(500, 335, RADI_OBJECTE, DIALEGS.altarErmita, { altura: 100, actiu: () => totes() && !Estat.flag('cofreAltar') });
        if (Estat.flag('cofreAltar')) this.posarCofreAltar();
        [[392, 352], [608, 352]].forEach(([x, y]) => {          // dos peus de ferro amb l'espelma apagada
            (this.opacs = this.opacs || []).push(this.add.image(x, y, 'candelabre_apagat').setOrigin(0.5, 1).setScale(1 / RES).setDepth(y));
            this.colisio(x, y - 8, 20, 14);
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

    // El cofre de la clau del sagrari, davant els graons de l'altar
    posarCofreAltar(y = 420) {
        this.cofreAltar = this.posar(Estat.flag('missatgeDesxifrat') ? 'cofre_obert' : 'cofre', 500, y, { col: { w: 50, h: 20 }, opac: true });      // obert i buit un cop agafada la clau
        this.interactiu(500, y + 6, RADI_OBJECTE, DIALEGS.cofreAltar, { altura: 80, actiu: () => !Estat.flag('missatgeDesxifrat'),
            enTancar: () => { if (Estat.flag('missatgeDesxifrat')) this.cofreAltar.setTexture('cofre_obert'); } });
    }

    apareixCofreAltar(fet) {
        Estat.posaFlag('cofreAltar');
        Sfx.secret();
        this.llum(500, 330, 0xffe8a0);
        this.cameras.main.shake(250, 0.002);
        this.time.delayedCall(500, () => {
            this.posarCofreAltar(420);
            const c = this.cofreAltar, y1 = c.y;
            c.y = y1 - 160; c.alpha = 0;
            this.tweens.add({ targets: c, y: y1, alpha: 1, duration: 650, ease: 'Bounce.easeOut', onComplete: () => { this.llum(500, y1 - 20, 0xfff2c0); Estat.desar(); if (fet) fet(); } });
        });
    }
}
