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
            alcada: 1000,
            entrades: {
                runes:  { x: 2740, y: 450, dir: 'esquerra' },
                ermita: { x: 60,   y: 450, dir: 'dreta' },
                secret: { x: 1380, y: 200, dir: 'avall' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 2800, 1000, -1100);
        this.terra('cami', 0, 380, 2800, 140);

        // Les 12 columnes de la processó, alternades a banda i banda del camí
        for (let i = 0; i < 12; i++) {
            const x = 2540 - i * 190, y = i % 2 === 0 ? 370 : 575;   // la columna 1 és la més propera a les Runes (est)
            this.posar('columna_proces_' + i, x, y, { col: { w: 34, h: 14 } });
            this.interactiu(x, y + 6, RADI_OBJECTE, DIALEGS.columna(i + 1), { altura: 120 });
        }

        [[700, 450], [1250, 450], [1950, 440], [2500, 460]].forEach(([x, y]) => this.enemic('escolopendra', x, y));
        this.cartell(2650, 560, DIALEGS.cartellCami);
        // Mur d'arbres del nord: només a x=1380 hi ha dos arbres més separats, i per aquí es puja a la cabana (sense marcar-ho)
        this.muralla(0, 140, 1160, 140, 128);
        this.muralla(1600, 140, 2800, 140, 132);
        this.colisio(1230, 55, 140, 110); this.colisio(1530, 55, 140, 110);
        this.sortides.push({ r: new Phaser.Geom.Rectangle(1300, 60, 160, 52), desti: 'ZonaCabanaCami', entrada: 'porta', peu: true });
  // cal travessar la fila d'arbres fins dalt de tot
        // Fila de baix: als extrems, arbres més petits (la capçada no ha de tapar les sortides de les puntes)
        this.muralla(0, 930, 2800, 930, 130, 'arbre', false);
        this.copes.filter(img => img.y === 930 && (img.x < 200 || img.x > 2600)).forEach(img => img.destroy());
        this.copes = this.copes.filter(img => img.active);
        [[40, 950], [170, 950], [2630, 950], [2760, 950]].forEach(([x, y]) => this.posar('arbre', x, y, { escala: 0.55, col: { w: 1, h: 1, fix: true } }));
        this.boiraAmbient(900, 450, 400, 80, 1);
        this.boiraAmbient(1900, 450, 400, 80, 1);

        this.sortida(2786, 380, 14, 140, 'ZonaRuines', 'cami');
        this.sortida(0, 380, 14, 140, 'ZonaErmita', 'cami');
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
        this.edifici('ermita', 500, 600, 590, 110, 'ZonaErmitaInt', 'porta', { alt: 90 });
        this.portaAnimada({ x: 500, top: 391, bottom: 570, ample: 124, fons: 580, color: 0xa8543a, vora: 0x3a1a0c, ferro: true });   // la porta de fusta vermella, amb ferros
        // Xiprers alts als costats de l'ermita (com a la capella real)
        [[130, 600, 1.5], [870, 600, 1.5], [60, 560, 1.35], [940, 560, 1.35], [100, 500, 1.2], [900, 500, 1.2], [30, 620, 1.3], [970, 620, 1.3]].forEach(([x, y, e]) => this.posar('xiprer', x, y, { escala: e, col: { w: 26, h: 12 } }));
        this.interactiu(500, 640, RADI_OBJECTE, DIALEGS.ermitaPorta, { altura: 190, actiu: () => false });

        // Creu de la Desaparició, davant la finestra de la dreta de l'ermita i a l'altra banda del camí (no té cap paper a la trama: només es pot llegir)
        this.posar('creu_desaparicio', 660, 840, { escala: 1.9, col: { w: 70, h: 26 } });
        this.interactiu(660, 850, RADI_OBJECTE, DIALEGS.creuDesaparicio, { altura: 300 });

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
        [[260, 450], [260, 590], [740, 450], [740, 590]].forEach(([x, y]) => this.posar('banc', x, y, { col: { w: 120, h: 20 } }));

        // Dues taules de pedra al fons, darrere l'altar
        this.posar('taula_pedra', 340, 190, { col: { w: 100, h: 20 } });
        this.interactiu(340, 210, RADI_OBJECTE, DIALEGS.taulaPedra(1), { altura: 170 });
        this.posar('taula_pedra2', 660, 190, { col: { w: 100, h: 20 } });
        this.interactiu(660, 210, RADI_OBJECTE, DIALEGS.taulaPedra(2), { altura: 170 });

        // Altar de pedra nua, amb dos peus de ferro amb les espelmes apagades. Amb les dotze paraules, l'Ineu hi diu la frase i apareix un cofre
        this.posar('altar_ermita', 500, 300, { col: { w: 140, h: 36 } });
        const totes = () => Array.from({ length: 12 }, (_, i) => Estat.flag('col' + (i + 1))).every(Boolean);
        this.interactiu(500, 335, RADI_OBJECTE, DIALEGS.altarErmita, { altura: 100, actiu: () => totes() && !Estat.flag('cofreAltar') });
        if (Estat.flag('cofreAltar')) this.posarCofreAltar();
        [[392, 352], [608, 352]].forEach(([x, y]) => {          // dos peus de ferro amb l'espelma apagada
            this.add.image(x, y, 'candelabre_apagat').setOrigin(0.5, 1).setScale(1 / RES).setDepth(y);
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
        this.cofreAltar = this.posar(Estat.flag('missatgeDesxifrat') ? 'cofre_obert' : 'cofre', 500, y, { col: { w: 50, h: 20 } });      // obert i buit un cop agafada la clau
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

        // Dos roures enormes amb dos bancs al mig, un davant de l'altre: el Galf seu al del nord i l'Ineu pot seure al del sud
        // Més grans i sols a la clariana: les copes (de 800 d'ample) emmarquen els bancs i no toquen el camí (queden per sota de y 630) ni les sortides
        this.posar('roure', 480, 1130, { escala: 1.9, col: { w: 100, h: 40 } });
        this.posar('roure', 1440, 1130, { escala: 1.9, col: { w: 100, h: 40 } });
        this.bancNord = this.posar('banc_respatller', ERA_BANC_X, ERA_BANC_N, { col: { w: 140, h: 16 } });
        this.bancSud = this.posar('banc_davant', ERA_BANC_X, ERA_BANC_S, { col: { w: 140, h: 16 } });   // sempre amb respatller (vist per darrere)

        // El Galf, savi inventor: jove, grassonet i ros, assegut al banc de dalt
        this.galf = this.npc('galf', ERA_BANC_X, ERA_BANC_N, DIALEGS.galf);
        this.galf.setDepth(ERA_BANC_N + 1);                       // assegut: el banc queda darrere seu
        // L'Ineu s'asseu i s'hi queda fins que es vulgui aixecar (movent-se)
        this.assegut = false;
        const puntBanc = this.interactiu(ERA_BANC_X, ERA_BANC_S, RADI_NPC, () => { this.seure(); return DIALEGS.galf(Estat); }, { altura: 150 });
        puntBanc.npc = this.galf;
        puntBanc.cameraCossos = [this.bancNord, this.bancSud];

        // El Follet del Carro Verd i el seu carro de vapor, a la vora sud-oest: és la parada de l'Era (PARADES, js/zona_base.js)

        this.cartell(470, 485, DIALEGS.cartellEra);
        // Poca cosa més: uns quants arbres a la vora del nord, lluny de les sortides i del cartell, perquè els dos roures siguin els protagonistes
        this.arbres([[70, 200], [560, 150], [1000, 170], [1500, 160], [1700, 260], [600, 380], [1200, 390]]);

        this.sortida(240, 0, 160, 14, 'ZonaErmita', 'era');
        this.sortida(1786, 500, 14, 130, 'ZonaJardi', 'era');
        this.sortida(0, 500, 14, 130, 'ZonaCamiRov', 'era');
    }

    // L'Ineu s'asseu al banc del sud, de cara al Galf, i hi continua assegut després de parlar: només s'aixeca
    // quan el jugador es mou (vegeu ZonaBase.moure). El respatller del banc el tapa per darrere.
    seure() {
        this.assegut = true;
        Estat.posaFlag('garfBancSegut');
        this.ineu.body.checkCollision.none = true;
        this.ineu.body.reset(ERA_BANC_X, ERA_BANC_S - 4);
        this.ombraIneu.setPosition(ERA_BANC_X, ERA_BANC_S - 4);
        this.ineu.setDepth(ERA_BANC_S - 1);                       // el banc es dibuixa per sobre: el respatller el tapa
        this.vista8Manual = true;
        this.posarDireccio('amunt', false, 'up');                 // sempre de cara al Galf, vingui d'on vingui
    }

    // S'aixeca cap al costat on es mou el jugador: amunt (cap al Galf) per davant del seient, a banda i banda pels costats, i avall per darrere del respatller
    alcar(dir = 'avall') {
        this.assegut = false;
        this.ineu.body.checkCollision.none = false;
        const pos = { amunt: [ERA_BANC_X, ERA_BANC_S - 60], esquerra: [ERA_BANC_X - 110, ERA_BANC_S - 14], dreta: [ERA_BANC_X + 110, ERA_BANC_S - 14] }[dir] || [ERA_BANC_X, ERA_BANC_S + 48];
        this.ineu.body.reset(pos[0], pos[1]);
        this.posarDireccio(dir, false);
    }
}

// ---------------- L'HOSTATGERIA ----------------
// Un gran edifici de pedra a la dreta i, enganxada al seu lateral esquerre, una pèrgola d'arcades de pedra: és un jardí
// de gespa amb flors (només allà dins n'hi ha). Les arcades del davant són a la mateixa línia que la façana de la casa i
// tan altes com la seva planta baixa, perquè la façana i la pèrgola es llegeixin com una sola obra. Dins hi ha la Prunera
// Màgica i la llosa del passadís secret de la masmorra; davant l'entrada, l'Isílder. El camí de l'Era i de la Taverna
// passa per davant (sud). L'id de la zona continua sent ZonaJardi (les partides desades hi compten).
class ZonaJardi extends ZonaBase {
    constructor() {
        super('ZonaJardi', {
            nom: "L'Hostatgeria",
            amplada: 1800,
            alcada: 1100,
            entrades: { era: { x: 60, y: 960, dir: 'dreta' }, taverna: { x: 1740, y: 960, dir: 'esquerra' }, llosa: { x: 664, y: 588, dir: 'avall' }, hostatgeria: { x: 1339, y: 800, dir: 'avall' } }
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
        // La façana, amb un forat a la porta (x 1293-1383). Un cop s'ha sortit per dins (o les sacerdotesses l'han oberta), s'hi pot entrar
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
            this.interactiu(1339, 775, RADI_OBJECTE, DIALEGS.hostatgeria, { altura: 180 });
        }

        // --- Pèrgola de pedra enganxada al lateral esquerre: dues files de columnes unides per bigues d'heura ---
        // Fila del davant a y=760 (la base de la façana); fila del darrere a y=410 perquè el jardí i la llosa quedin ben deslliurats.
        const COLS = [132, 284, 436, 588, 740], YB = 410, YF = 760;
        const PLANTA = Math.round(casa.displayHeight * 0.339);            // alçada de la planta baixa de la façana
        const tex = this.textures.get('columna'), escalaBase = (tex.customData && tex.customData.escala) || 1 / RES;
        const colH = tex.getSourceImage().height * escalaBase;            // alçada d'una columna sense escalar
        const ESC = 1.4, ALT_COL = Math.round(colH * ESC), COL_W = Math.round(tex.getSourceImage().width * escalaBase * ESC);
        // Bigues de dues files de fulles d'heura (fixes, sense moviment) que uneixen les columnes pel capdamunt fins a tocar les del sud:
        // una biga al llarg de cada fila de columnes i una de travessera a cada columna, entre la fila del darrere i la del davant
        const heura = (x, y, esc, alfa, prof, ang) => {
            if (Math.hypot(x - 290, (y - 430) * 1.25) < 195 && y < 545) prof = 638;   // sota la capçada de la Prunera però per damunt de les columnes del nord
            const l = this.add.image(x, y, 'fulla_heura').setScale(esc).setAlpha(alfa).setDepth(prof).setAngle(ang);
            l.setTint([0x4f8f35, 0x6aac3e, 0x7cbc4a, 0x3f7a30, 0x92cc58][Math.floor(rnd() * 5)]);
            return l;
        };
        const yTopB = YB - ALT_COL + 10, yTopF = YF - ALT_COL + 12;               // el capdamunt (capitell) de les columnes de cada fila
        const biga = (xa, ya, xb, yb) => {                                          // biga de dues files paral·leles de fulles de (xa, ya) a (xb, yb)
            const llarg = Math.hypot(xb - xa, yb - ya), n = Math.round(llarg / 10), ang = Math.atan2(yb - ya, xb - xa);
            const nx = -Math.sin(ang), ny = Math.cos(ang), baseAng = Phaser.Math.RadToDeg(ang) + 90;
            for (let i = 0; i <= n; i++) {
                [-1, 1].forEach(s => {
                    const t = Phaser.Math.Clamp((i + (s > 0 ? 0.4 : 0)) / n, 0, 1);
                    const cx = xa + (xb - xa) * t, cy = ya + (yb - ya) * t, perp = s * 7.5 + (rnd() - 0.5) * 2.2;
                    heura(cx + nx * perp + (rnd() - 0.5) * 2.5, cy + ny * perp + (rnd() - 0.5) * 2.5, 0.16 + rnd() * 0.07, 0.9 + rnd() * 0.1, YF + 3, baseAng + s * 42 + (rnd() - 0.5) * 32);
                });
            }
        };
        biga(COLS[0], yTopB, COLS[COLS.length - 1], yTopB);                         // la biga de la fila del darrere
        biga(COLS[0], yTopF, COLS[COLS.length - 1], yTopF);                         // la biga de la fila del davant (sobre els capitells del sud)
        COLS.forEach(x => biga(x, yTopB, x, yTopF));                                // una de travessera a cada columna, de nord a sud
        COLS.forEach(x => {
            this.posar('columna', x, YB, { escala: ESC, col: { w: 34, h: 14 } });
            this.posar('columna', x, YF, { escala: ESC, col: { w: 34, h: 14 } });
            [YB, YF].forEach(y => { for (let k = 0; k < 6; k++) heura(x + (rnd() - 0.5) * 28, y - 18 - k * (ALT_COL / 7) - rnd() * 10, 0.15 + rnd() * 0.07, 0.88 + rnd() * 0.12, y + 2, (rnd() - 0.5) * 90); });   // l'heura puja per les columnes
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
        this.interactiu(PX, PY + 40, RADI_GRAN * 1.5, DIALEGS.prunera, { altura: 150, senseMirada: true }); // es pot collir la pruna des de qualsevol costat de l'arbre

        // La llosa del passadís cap al soterrani de l'Hostatgeria, entre les columnes i ben amunt perquè les columnes del sud no la tapin gens
        const LX = 664, LY = 490;
        this.llosaPos = { x: LX, y: LY };
        this.foratLlosa = this.add.graphics().setDepth(-705);                // el forat amb l'escala, tapat per la llosa fins que s'obre
        this.dibuixaForat(LX, LY);
        this.llosa = this.posar('llosa', LX, LY, { fonsY: -700 }).setOrigin(0.5, 0.5);        // centrada sobre el forat (si no, per sota se'n veurien mig forat i les escales)
        this.florLluna = this.posar('flors', LX - 66, LY + 22, { escala: 0.8 }).setVisible(false);
        this.puntLlosa = this.interactiu(LX, LY + 5, RADI_OBJECTE, DIALEGS.llosaJardi, { altura: 60, actiu: () => !Estat.flag('llosaOberta') });
        // Amb Runna (Acte 3), la llosa dels monjos s'encén: un cercle de runes de llum pàl·lida i blavosa que batega fins que s'obre
        this.brillLlosa = null;
        if (Estat.flag('runna') && !Estat.flag('llosaOberta')) this.posarBrillLlosa(LX, LY);

        // --- Gespa amb flors: només dins la pèrgola (cap flor fora). Un rectangle clar fa de gespa ben cuidada ---
        this.add.rectangle((COLS[0] + COLS[COLS.length - 1]) / 2, (YB + YF) / 2, COLS[COLS.length - 1] - COLS[0], YF - YB, 0xc4f08c, 0.14).setDepth(-1090);
        const lliure = (x, y) => Math.hypot(x - PX, (y - PY) * 1.6) > 70 && Math.hypot(x - LX, (y - LY) * 1.6) > 130 && Math.hypot(x - (LX - 92), (y - LY) * 1.6) > 70;
        // Un jardí de debò: moltes flors, de colors diferents, escampades per tota la gespa i en mates més denses a les voreres i al peu de les columnes
        const COLORS_FLORS = [0xffffff, 0xffd6e6, 0xfff2b0, 0xd6e8ff, 0xffb0c8, 0xffcf80, 0xd0b0ff, 0xff9a9a, 0xb0f0d0];
        const flor = (x, y, esc) => { const f = this.posar('flors', x, y, { fonsY: -800, escala: esc }); f.setTint(COLORS_FLORS[Math.floor(rnd() * COLORS_FLORS.length)]); };
        for (let n = 0, intents = 0; n < 130 && intents < 1500; intents++) {
            const x = COLS[0] + 20 + rnd() * (COLS[COLS.length - 1] - COLS[0] - 40), y = YB + 20 + rnd() * (YF - YB - 30);
            if (!lliure(x, y)) continue;
            flor(x, y, 0.5 + rnd() * 0.5);
            n++;
        }
        COLS.forEach(cx => [YB, YF].forEach(cy => { for (let k = 0; k < 5; k++) { const x = cx + (rnd() - 0.5) * 90, y = cy + 6 + rnd() * 26; if (lliure(x, y)) flor(x, y, 0.45 + rnd() * 0.4); } }));       // mates al peu de les columnes

        // L'Isílder, fora de la pèrgola, davant de la fila de columnes del davant i ben lluny de la Prunera (si la llosa ja és oberta, es queda al costat del forat)
        this.isilder = this.npc('isilder', 360, 840, DIALEGS.isilder, { zoomConversa: 1.3 });
        this.puntLlosa.cameraCossos = [this.isilder];                 // en examinar la llosa, el diàleg d'ella (llosaJardi) enquadra l'Isílder també
        if (Estat.flag('llosaOberta')) {
            this.llosa.setPosition(LX - 92, LY + 4).setRotation(-0.1);
            this.florLluna.setVisible(true);
            this.posarEntradaForat();
            this.isilder.setPosition(LX - 74, LY + 62).ombra.setPosition(LX - 74, LY + 62);
            this.isilder.punt.x = LX - 74; this.isilder.punt.y = LY + 52;
        }

        this.cartell(1500, 860, () => ({ pagines: [{ qui: 'Cartell', text: 'L\'Hostatgeria\n→ La Taverna\n← L\'Era' }] }));
        this.sortida(0, 900, 14, 130, 'ZonaEra', 'jardi');
        this.sortida(1786, 900, 14, 130, 'ZonaTaverna', 'jardi');
    }

    // Forat quadrat emmarcat amb carreus de pedra i una escala que baixa cap al nord (els graons del fons són més foscos)
    dibuixaForat(x, y) {
        const g = this.foratLlosa;
        g.clear();
        g.fillStyle(0x000000, 0.28).fillRoundedRect(x - 46, y - 43, 92, 92, 7);
        g.fillStyle(0x6e6658, 1).fillRoundedRect(x - 44, y - 44, 88, 88, 5).lineStyle(3, 0x18120c, 1).strokeRoundedRect(x - 44, y - 44, 88, 88, 5);
        g.lineStyle(1.4, 0x3a3228, 0.85);
        [-22, 0, 22].forEach(d => {
            g.lineBetween(x + d, y - 44, x + d, y - 36).lineBetween(x + d, y + 36, x + d, y + 44);
            g.lineBetween(x - 44, y + d, x - 36, y + d).lineBetween(x + 36, y + d, x + 44, y + d);
        });
        g.fillStyle(0x0a0604, 1).fillRect(x - 36, y - 36, 72, 72);
        [0x14100c, 0x241c14, 0x3a2e22, 0x5a4a36, 0x7a6648, 0x9a8460].forEach((c, i) => {
            const sy = y - 36 + i * 12;
            g.fillStyle(c, 1).fillRect(x - 36, sy, 72, 12).lineStyle(1.4, 0x0a0604, 0.9).lineBetween(x - 36, sy + 12, x + 36, sy + 12);
            g.fillStyle(0xffffff, 0.08).fillRect(x - 35, sy + 1, 70, 2);
        });
        g.lineStyle(2, 0x120c08, 1).strokeRect(x - 36, y - 36, 72, 72);
    }

    posarEntradaForat() {
        const { x, y } = this.llosaPos;
        this.sortidaEscala(x - 37, y - 37, 74, 74, 'ZonaSoterraniHost', 'entrada', y + 42);   // l'Ineu baixa l'escala abans de canviar de zona
    }

    // El cercle de runes de la llosa quan es desperta amb Runna (el mateix dibuix que s'encén a la seva obertura, obrirLlosa): batega suaument, amb una mica de llum i espurnes
    posarBrillLlosa(LX, LY) {
        const g = this.add.graphics().setDepth(-690);
        g.lineStyle(3, 0xbfe8ff, 1).strokeCircle(LX, LY, 34).strokeCircle(LX, LY, 22);
        for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; g.lineBetween(LX + Math.cos(a) * 22, LY + Math.sin(a) * 22, LX + Math.cos(a) * 34, LY + Math.sin(a) * 34); }
        g.fillStyle(0xbfe8ff, 0.18).fillCircle(LX, LY, 34);
        const llum = this.add.ellipse(LX, LY + 4, 150, 80, 0xbfe8ff, 0.2).setBlendMode(Phaser.BlendModes.ADD).setDepth(-689);
        const espurnes = this.add.particles(LX, LY, 'espurna', {
            x: { min: -30, max: 30 }, y: { min: -10, max: 10 }, speedY: { min: -40, max: -12 }, lifespan: 1500,
            scale: { start: 0.3, end: 0 }, alpha: { start: 0.8, end: 0 }, tint: [0xbfe8ff, 0xffffff], frequency: 380, blendMode: 'ADD'
        }).setDepth(-688);
        this.tweens.add({ targets: [g, llum], alpha: { from: 0.35, to: 1 }, yoyo: true, repeat: -1, duration: 1500, ease: 'Sine.easeInOut' });
        this.brillLlosa = { g, llum, espurnes };
    }

    // Un cop oberta la llosa, el cercle de runes ja no hi és (l'obertura en dibuixa el seu)
    treureBrillLlosa() {
        const b = this.brillLlosa;
        if (!b) return;
        [b.g, b.llum].forEach(o => this.tweens.killTweensOf(o));
        [b.g, b.llum, b.espurnes].forEach(o => o.destroy());
        this.brillLlosa = null;
    }

    // Amb Runna, en entrar al jardí, la llosa s'encén i l'Isílder ho veu (escena automàtica, un sol cop: en acabar, el flag isilderRosansa ja hi és)
    enEntrar() {
        if (Estat.flag('runna') && !Estat.flag('isilderRosansa') && !Estat.flag('llosaOberta') && !Estat.flag('llavorRosansa') && !Estat.te('llavorLluna') && !Estat.caigut) {
            this.time.delayedCall(2200, () => this.escenaLlosaRunna());
        }
    }

    escenaLlosaRunna(intents = 0) {
        if (Estat.flag('isilderRosansa') || Estat.flag('llosaOberta') || !this.isilder || !this.isilder.active || !this.sys.isActive()) return;
        const ui = this.ui();
        if (ui.dialeg || this.canviant || this.camCinema || this.ineuAlt || this.assegut || this.cinema) {           // hi ha un diàleg o una escena en marxa: espera
            if (intents < 20) this.time.delayedCall(700, () => this.escenaLlosaRunna(intents + 1));
            return;
        }
        const encenLlosa = () => {
            const b = this.brillLlosa;
            if (!b) return;                                                   // un cop de llum: la llosa s'encén de debò
            this.tweens.killTweensOf(b.llum);
            b.llum.setAlpha(0.2);
            this.tweens.add({ targets: b.llum, alpha: 1, scale: 1.5, duration: 700, yoyo: true, ease: 'Sine.easeInOut', onComplete: () => this.tweens.add({ targets: [b.g, b.llum], alpha: { from: 0.35, to: 1 }, yoyo: true, repeat: -1, duration: 1500, ease: 'Sine.easeInOut' }) });
            Sfx.to(880, 1320, 0.5, 'sine', 0.1);
        };
        // L'Ineu pot entrar al jardí molt lluny (per l'Hostatgeria o la Taverna): la càmera de diàleg normal no hi cabria amb l'Isílder, i la llosa no hi és mai. Per això l'escena
        // enquadra expressament l'Isílder i la llosa (el que s'ha de veure), amb la llosa encesa, i en acabar torna a l'Ineu.
        const I = this.isilder, { x: LX, y: LY } = this.llosaPos;
        this.puntActiu = I.punt;
        this.dialegDePunt = false;
        this.enquadrar((I.x + LX) / 2, (I.y + LY) / 2 - 20, 0.95, 1000, () => {
            encenLlosa();
            this.time.delayedCall(1100, () => {
                ui.obrirDialeg(DIALEGS.isilderRunna(Estat), () => {
                    Estat.desar();
                    this.alliberarCamera(800);
                });
            });
        });
    }

    // L'Isílder porta la llavor a la llosa: la deixa caure, hi brota una flor de lluna i una columna de llum lunar baixa fins a ella; sobre la llosa
    // s'encén un cercle de runes, tot tremola i la llosa s'alça i s'aparta, i deixa veure l'escala. Tot es veu (res no s'ajup ni es deforma).
    // fet: quan l'escena ha acabat (es crida des d'una pàgina d'acció del diàleg de l'Isílder).
    obrirLlosa(fet) {
        if (this.obrintLlosa || Estat.flag('llosaOberta')) { if (fet) fet(); return; }
        this.obrintLlosa = true;
        this.treureBrillLlosa();
        const cam = this.cameras.main, I = this.isilder, { x: LX, y: LY } = this.llosaPos;
        this.tweens.killTweensOf(I);
        const espera = ms => new Promise(res => this.time.delayedCall(ms, res));
        const mou = (dest, ms) => new Promise(res => {
            const balanceig = this.tweens.add({ targets: I, angle: { from: -4, to: 4 }, yoyo: true, repeat: -1, duration: 260 });
            this.tweens.add({
                targets: [I, I.ombra], ...dest, duration: ms, ease: 'Sine.easeInOut',
                onUpdate: () => { I.setDepth(I.y); I.punt.x = I.x; I.punt.y = I.y - 10; },
                onComplete: () => { balanceig.stop(); I.setAngle(0); res(); }
            });
        });
        const pols = (x, y, tints, n = 8) => { const p = this.add.particles(x, y, 'espurna', { speed: { min: 20, max: 70 }, angle: { min: 200, max: 340 }, lifespan: 600, scale: { start: 0.35, end: 0 }, tint: tints, quantity: n, emitting: false }).setDepth(99000); p.explode(n); this.time.delayedCall(800, () => p.destroy()); };
        const FX = LX - 66, FY = LY + 22;                                  // on creix la flor
        (async () => {
            cam.stopFollow(); cam.pan(LX - 30, LY + 110, 700, 'Sine.easeInOut');
            await espera(750);
            await mou({ x: LX, y: 780 }, 1300);                            // surt per l'obertura de la pèrgola
            await mou({ x: FX + 46, y: FY + 40 }, 1100);                   // fins al lloc de la flor
            // 1. La llavor surt de la mà de l'Isílder i cau a terra
            const icona = iconaObjecte(this, 'llavorLluna');
            const llavor = icona ? this.add.image(I.x - 12, I.y - 70, icona).setScale(0.28).setDepth(99000) : this.add.circle(I.x - 12, I.y - 70, 6, 0xe8e4f8, 1).setDepth(99000);
            await new Promise(res => { this.tweens.add({ targets: llavor, x: FX, y: FY + 6, duration: 700, ease: 'Quad.easeIn', onComplete: res }); });
            pols(FX, FY + 6, [0x8a6a44, 0x6a4a2c], 6);
            this.tweens.add({ targets: llavor, scale: 0, alpha: 0, delay: 200, duration: 400, onComplete: () => llavor.destroy() });
            await espera(700);
            // 2. Una tija verda creix i, al capdamunt, s'obre la flor de lluna
            const tija = this.add.graphics().setDepth(FY + 4), alt = { v: 0 };
            this.tweens.add({ targets: alt, v: 1, duration: 1100, ease: 'Sine.easeOut', onUpdate: () => {
                tija.clear().lineStyle(4, 0x3f7a30, 1).lineBetween(FX, FY + 8, FX + Math.sin(alt.v * 3) * 3, FY + 8 - alt.v * 34);
                if (alt.v > 0.4) tija.fillStyle(0x5aa83a, 1).fillEllipse(FX - 8, FY - 6, 12 * alt.v, 5).fillEllipse(FX + 8, FY - 14, 12 * alt.v, 5);
            } });
            await espera(1000);
            this.florLluna.setVisible(true).setScale(0.04).setPosition(FX, FY + 4).setAlpha(1);          // la flor s'obre
            this.tweens.add({ targets: this.florLluna, scale: 0.8, duration: 1300, ease: 'Back.easeOut' });
            Sfx.xiu(1.2, 0.1, 'bandpass', 900, 2200, 3); Sfx.to(880, 1320, 0.5, 'sine', 0.12);
            // 3. La llum de la lluna baixa del cel fins a la flor (una columna pàl·lida, amb borrissol de llum)
            const raig = this.add.rectangle(FX, FY - 150, 90, 340, 0xcfe4ff, 0).setBlendMode(Phaser.BlendModes.ADD).setDepth(FY + 30);
            this.tweens.add({ targets: raig, fillAlpha: 0.2, duration: 900, yoyo: false });
            const llum = this.add.particles(FX, FY - 10, 'espurna', { x: { min: -34, max: 34 }, speedY: { min: -70, max: -20 }, lifespan: 1700, scale: { start: 0.45, end: 0 }, alpha: { start: 1, end: 0 }, tint: [0xbfe8ff, 0xffffff, 0xe0d0ff], frequency: 60, blendMode: 'ADD' }).setDepth(FY + 31);
            await espera(1800);
            // 4. Sobre la llosa s'encén un cercle de runes; tot tremola
            const cercle = this.add.graphics().setDepth(LY + 6).setAlpha(0);
            cercle.lineStyle(3, 0xbfe8ff, 1).strokeCircle(LX, LY, 34).strokeCircle(LX, LY, 22);
            for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; cercle.lineBetween(LX + Math.cos(a) * 22, LY + Math.sin(a) * 22, LX + Math.cos(a) * 34, LY + Math.sin(a) * 34); }
            cercle.fillStyle(0xbfe8ff, 0.18).fillCircle(LX, LY, 34);
            this.tweens.add({ targets: cercle, alpha: 1, duration: 900 });
            this.tweens.add({ targets: this.llosa, x: { from: LX - 1.5, to: LX + 1.5 }, yoyo: true, repeat: 10, duration: 60 });
            cam.shake(1100, 0.0025); Sfx.secret();
            await espera(1300);
            // 5. La llosa s'alça una mica i llisca cap a l'esquerra, i deixa veure l'escala
            this.tweens.add({ targets: this.llosa, scale: this.llosa.scale * 1.05, duration: 350, yoyo: true });
            await espera(380);
            await mou({ x: FX + 40, y: FY + 70 }, 500);
            this.tweens.add({ targets: this.llosa, x: LX - 92, y: LY + 4, rotation: -0.1, duration: 1500, ease: 'Cubic.easeInOut' });
            cam.shake(500, 0.004); pols(LX - 20, LY, [0xa89878, 0x8a8478], 10);
            this.tweens.add({ targets: cercle, alpha: 0, duration: 1200 });
            await espera(1800);
            raig.destroy(); llum.stop(); this.time.delayedCall(1700, () => llum.destroy());
            await mou({ x: LX - 74, y: LY + 62 }, 700);                     // s'aparta cap a l'esquerra (a la dreta hi ha la paret de la casa)
            Estat.posaFlag('llosaOberta');
            this.posarEntradaForat();
            I.punt.x = I.x; I.punt.y = I.y - 10;
            tija.destroy();
            Estat.posaObjectiu("La llosa del jardí s'ha obert i deixa veure una escala cap al soterrani de l'Hostatgeria.");
            Estat.desar();
            cam.pan(this.ineu.x, this.ineu.y, 700, 'Sine.easeInOut');
            await espera(750);
            cam.startFollow(this.ineu, false, 0.12, 0.12);
            this.obrintLlosa = false;
            if (fet) fet();
        })();
    }
}

// ---------------- LA TAVERNA (entre l'Hostatgeria i els arcs de la Casa Gran) ----------------
// Una sola escena de poble: el camí d'est a oest passa per davant la façana de la Taverna. La porta és tancada
// (la Càren no obre a ningú aquests dies; el pas del fons, a la banda de sota, encara no existeix).
class ZonaTaverna extends ZonaBase {
    constructor() {
        super('ZonaTaverna', {
            nom: 'La Taverna',
            amplada: 1600,
            alcada: 1100,
            entrades: { jardi: { x: 60, y: 960, dir: 'dreta' }, casagran: { x: 1540, y: 960, dir: 'esquerra' }, interior: { x: 800, y: 820, dir: 'avall' } }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1600, 1100, -1100);
        this.terra('cami', 0, 880, 1600, 130);              // camí de l'Hostatgeria als arcs de la Casa Gran
        this.terra('llamborda', 320, 740, 960, 140);        // replà empedrat davant la façana

        // Façana (900 d'ample, tres plantes): la porta és l'arc del mig
        const t = this.taverna = this.posar('taverna', 800, 750, { fonsY: 640 });
        this.colisio(603, 705, 355, 90);
        this.colisio(1040, 705, 340, 90);
        this.blocDarrere(800, 900, 660, Math.max(0, 750 - t.displayHeight));
        // La porta (l'arc del mig): tancada fins que s'hi parla (l\'Eve l'obre des de dins)
        this.colPorta = this.colisio(825, 705, 90, 90);
        if (Estat.flag('tavernaOberta')) { this.obrirPorta(); this.portaTavernaAnim(); }
        else this.interactiu(825, 765, RADI_OBJECTE, DIALEGS.portaTaverna, { altura: 170, actiu: () => !Estat.flag('tavernaOberta'), enTancar: () => this.obrirPorta() });

        // Barrils a la dreta, taula i banc a l'esquerra, contra la façana
        this.posar('barril', 1150, 800, { col: { w: 40, h: 16 } });
        this.posar('barril', 1200, 812, { col: { w: 40, h: 16 } });
        this.posar('banc', 520, 790, { col: { w: 130, h: 22 } });
        this.posar('taula', 400, 805, { escala: 0.7, col: { w: 110, h: 22 } });
        this.enemic('visitant', 1000, 960);        // un visitant trastocat per la boira, que ha vingut a la Taverna

        this.cartell(260, 860, () => ({ pagines: [{ qui: 'Cartell', text: '← L\'Hostatgeria i l\'Era\n→ Els arcs de la Casa Gran' }] }));
        this.arbres([[130, 250], [200, 560], [1460, 330], [1450, 600], [60, 830], [1180, 1050]]);   // cap arbre davant el cartell

        this.sortida(0, 900, 14, 130, 'ZonaJardi', 'taverna');
        this.sortida(1586, 900, 14, 130, 'ZonaCasaGran', 'oest');
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
        return this.portaTaverna || (this.portaTaverna = this.portaAnimada({ x: 825, top: 590, bottom: 746, ample: 105, fons: 640, unic: true, arc: 46, retall: this.taverna }));
    }

    obrirPorta() {
        if (!Estat.flag('tavernaOberta') || this.portaOberta) return;
        this.portaOberta = true;
        this.obstacles.remove(this.colPorta, true, true);
        this.colisio(825, 660, 90, 20);      // dintell
        this.sortida(793, 680, 64, 40, 'ZonaTavernaInt', 'porta');
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

        // --- Parets de troncs (les mateixes que fa servir la cabana de la Joaneta) ---
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
        // El solitari de l'Iscu, estirat sobre la taula, i l'Iscu (el fill de la Càren) al costat
        const cartes = this.add.graphics().setDepth(480);
        for (let c = 0; c < 7; c++) for (let f = 0; f <= Math.min(c, 3); f++) {
            const x = 386 + c * 19, y = 418 + f * 7, tapada = f < Math.min(c, 3);
            cartes.fillStyle(tapada ? 0x8a2a2a : 0xf4ecd8, 1).fillRect(x, y, 15, 21).lineStyle(1, 0x3a2410, 1).strokeRect(x, y, 15, 21);
            if (!tapada) cartes.fillStyle([0xc8a030, 0x2a5aa0, 0xb83a3a, 0x3a8a3a][c % 4], 1).fillCircle(x + 7.5, y + 10, 3);
        }
        cartes.fillStyle(0x8a2a2a, 1).fillRect(520, 420, 15, 21).lineStyle(1, 0x3a2410, 1).strokeRect(520, 420, 15, 21);
        this.interactiu(450, 440, RADI_OBJECTE, DIALEGS.solitari, { altura: 60 });
        this.npc('iscu', 520, 560, DIALEGS.iscu, { flipX: true });
        this.posar('llenya', 735, 410, { col: { w: 110, h: 26 } });
        this.posar('tronc_tall', 160, 540, { col: { w: 70, h: 24 } });

        // Un cofre petit entre dues espelmes
        const cofreCab = this.posar(Estat.flag('cofreCabanaCami') ? 'cofre_obert' : 'cofre', 690, 250, { col: { w: 50, h: 20 } });
        this.interactiu(690, 255, RADI_OBJECTE, DIALEGS.cofreCabanaCami, { altura: 80, enTancar: () => { if (Estat.flag('cofreCabanaCami')) cofreCab.setTexture('cofre_obert'); } });
        [[630, 258], [750, 258]].forEach(([x, y], i) => {
            const e = this.posar('espelma', x, y, { fonsY: y });
            this.tweens.add({ targets: e, alpha: 0.7, yoyo: true, repeat: -1, duration: 350 + i * 90 });
        });

        this.add.rectangle(450, 350, 700, 700, 0xffd38a, 0.05).setDepth(80000);
        this.sortida(410, 672, 80, 22, 'ZonaCami', 'secret');
    }
}
