/**
 * ZONES VEÏNES DE LA PLAÇA
 * Santuari (interior), Monestir, La Bassadòria (amb la Creu de l'Aparició), Casa Gran.
 * Algunes parts encara són provisionals i es completaran als passos següents.
 */

// ---------------- ESGLÉSIA (interior) ----------------
class ZonaEsglesia extends ZonaBase {
    constructor() {
        super('ZonaEsglesia', {
            nom: 'Santuari del Miracle',
            amplada: 1280,
            alcada: 820,
            colorFons: '#140e0a',
            pacifica: true,
            entrades: { porta: { x: 640, y: 770, dir: 'amunt' }, golfes: { x: 410, y: 300, dir: 'avall' } }
        });
    }

    construir() {
        // Terra i murs (la nau va de x=240 a x=1040)
        this.terra('rajola', 240, 60, 800, 760, -1100);
        const murs = this.add.graphics().setDepth(-1000);
        murs.fillStyle(0xcdb89a, 1).fillRect(200, 0, 40, 820).fillRect(1040, 0, 40, 820);
        murs.fillStyle(0x9a2e34, 1).fillRect(240, 0, 800, 70);
        murs.fillStyle(0xe8dcc4, 1).fillRect(240, 62, 800, 8);
        this.colisio(120, 410, 240, 820);
        this.colisio(1160, 410, 240, 820);
        this.colisio(640, 120, 800, 240);
        this.colisio(420, 810, 360, 20);
        this.colisio(860, 810, 360, 20);

        // Retaule Major i orgue (la Pianista seu a l'orgue)
        this.posar('retaule', 640, 330, { fonsY: 250 });
        this.interactiu(640, 345, 110, DIALEGS.retaule, { altura: 150 });
        this.posar('orgue', 940, 380, { col: { w: 110, h: 50 } });
        this.npc('pianista', 940, 450, DIALEGS.pianista);
        // El Pare Daniel dirigeix el cor, a prop del presbiteri
        this.npc('pare_daniel', 440, 430, DIALEGS.pareDaniel, { flipX: false });

        // Passadís darrere el retaule: una porteta de fusta a l'esquerra, cap a les golfes del Santuari (rellotge i campanes)
        const porta = this.add.graphics().setDepth(245);
        porta.fillStyle(0x1a1008, 1).fillRect(378, 160, 64, 80).fillCircle(410, 160, 32);
        porta.fillStyle(0x6a4424, 1).fillRect(386, 172, 48, 68).fillCircle(410, 172, 24);
        porta.lineStyle(3, 0x2a1608, 1).strokeRect(386, 172, 48, 68);
        porta.fillStyle(0xc9a54a, 1).fillCircle(424, 208, 3);
        this.sortides.push({ r: new Phaser.Geom.Rectangle(380, 236, 60, 22), desti: 'ZonaGolfes', entrada: 'porta' });

        // Reclinatori: desar partida
        this.posar('reclinatori', 640, 390, { col: { w: 60, h: 16 } });
        this.interactiu(640, 395, 70, () => ({
            pagines: [
                { qui: '', text: 'T\'agenolles al reclinatori i resses una estona en silenci.' },
                { qui: '', text: 'Et sents en pau. (Partida desada.)' }
            ],
            enAcabar: () => { this.guardarPosicio(); Estat.desar(); this.ui().notifica('Partida desada'); }
        }), { altura: 50 });

        // Bancs
        [480, 570, 660].forEach(y => {
            this.posar('banc', 470, y, { col: { w: 140, h: 16 } });
            this.posar('banc', 810, y, { col: { w: 140, h: 16 } });
        });

        // Pergamí amb el fragment 2 de la llegenda del monjo, sobre un banc del mig (lluny del Pare Daniel)
        this.posar('pergami', 470, 552, { fonsY: 600 });
        this.interactiu(470, 585, 70, DIALEGS.pergamiEsglesia, { altura: 80 });

        // Llum de les vidrieres
        this.add.rectangle(640, 410, 800, 820, 0xffd38a, 0.05).setDepth(80000);

        this.sortida(600, 800, 80, 20, 'ZonaPlaca', 'esglesia');
    }
}

// ---------------- MONESTIR (exterior) ----------------
class ZonaMonestir extends ZonaBase {
    constructor() {
        super('ZonaMonestir', {
            nom: 'El Monestir',
            amplada: 1600,
            alcada: 1000,
            entrades: { placa: { x: 60, y: 520, dir: 'dreta' }, cementiri: { x: 1480, y: 70, dir: 'avall' } }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1600, 1000, -1100);
        this.terra('llamborda', 0, 430, 1600, 280);   // la mateixa plaça empedrada
        this.terra('cami', 1400, 0, 160, 460);          // cap al cementiri (darrere el Monestir i el Santuari)

        this.posar('monestir', 800, 440, { col: { w: 600, h: 140, dy: -10 } });
        this.blocDarrere(800, 600, 295);
        this.interactiu(800, 450, 70, DIALEGS.enConstruccio('Biblioteca del Monestir'), { altura: 90 });
        this.npc('pare_alcui', 600, 540, DIALEGS.pareAlcui);
        // Xiprers alts a l'esquerra del portal i una conífera a la dreta (com a la foto del monestir)
        [[440, 445, 1.7], [492, 452, 1.5]].forEach(([x, y, e]) => this.posar('xiprer', x, y, { escala: e, col: { w: 26, h: 12 } }));
        this.posar('xiprer', 1165, 450, { escala: 1.9, col: { w: 30, h: 12 } });

        this.cartell(1480, 450, () => ({ pagines: [{ qui: '', text: '→ Cel·les de Sant Antoni\n↑ El Cementiri (darrere el Monestir i el Santuari)' }] }));
        this.arbres([[160, 250], [330, 200], [1250, 260], [250, 720], [1250, 720]]);

        this.enemic('visitant', 1100, 700);
        this.enemic('escolopendra', 400, 700);
        this.enemic('escolopendra', 1200, 360);
        this.sortida(0, 450, 14, 140, 'ZonaPlaca', 'monestir');
        this.sortida(1400, 0, 160, 14, 'ZonaCementiri', 'monestir');
    }
}

// ---------------- CREU DE L'APARICIÓ I BASSADÒRIA ----------------
class ZonaCreu extends ZonaBase {
    constructor() {
        super('ZonaCreu', {
            nom: 'La Bassadòria',
            amplada: 1600,
            alcada: 1000,
            entrades: {
                placa:    { x: 1180, y: 70, dir: 'avall' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1600, 1000, -1100);
        this.terra('cami', 1100, 0, 160, 520);          // des de la plaça (nord)
        this.terra('cami', 300, 440, 960, 140);
        this.terra('pedra', 560, 250, 360, 190);        // replà de pedra davant la creu

        // Creu de l'Aparició (sense cap tanca ni mur al darrere)
        this.posar('creu', 740, 440, { col: { w: 56, h: 24 } });
        this.interactiu(740, 445, 85, DIALEGS.creu, { altura: 190 });
        [[470, 350], [1010, 350]].forEach(([x, y]) => this.posar('arbre', x, y, { col: { w: 34, h: 16 } }).setTint(0xcfe08a));   // plàtans

        // Bassadòria: una bassa molt gran (520 d'ample, uns quatre Ineus), sense mur al darrere; plàtans de tardor als costats
        [[700, 930], [1330, 930]].forEach(([x, y]) => this.posar('arbre', x, y, { col: { w: 34, h: 16 } }).setTint(0xe0b868));
        this.posar('bassadoria', 1010, 900, { col: { w: 470, h: 190, dy: -50 } });
        this.interactiu(1010, 755, 280, DIALEGS.bassadoria, { altura: 110, enTancar: () => Estat.posaFlag('flauta_bassadoria') });
        this.llocFlauta('bassadoria', 1010, 755, 340, true);
        if (!Estat.flag('bassadoriaNeta')) this.boiraBass = this.boira(1010, 760, 380, 110, 3.5);

        // L'Home del Carruatge Verd, a la vora del camí
        this.posar('carruatge', 330, 730, { col: { w: 190, h: 50 } });
        this.npc('home_carruatge', 440, 760, DIALEGS.homeCarruatge);

        this.cartell(1180, 480, () => ({ pagines: [{ qui: '', text: '↑ Plaça del Santuari' }] }));
        this.arbres([[150, 180], [320, 260], [1450, 220], [200, 900], [650, 940], [1300, 930], [1500, 780], [100, 520], [190, 640], [1400, 440], [1480, 600], [260, 440]]);

        this.enemic('escolopendra', 500, 300);
        // Aigua neta (després del Cant de l'Aurora)
        this.aiguaNeta = this.add.ellipse(1010, 755, 416, 130, 0x8fd0f0, 0.75).setDepth(901).setVisible(Estat.flag('bassadoriaNeta'));
        // Els gripaus corromputs surten de la Bassadòria mentre l'aigua estigui tèrbola
        this.propGripau = this.time.now + 1500;
        this.sortida(1100, 0, 160, 14, 'ZonaPlaca', 'creu');

        this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x3a1a55, 0.08).setScrollFactor(0).setDepth(90000);
    }

    // La Bassadòria reacciona al Cant de l'Aurora (només quan l'Ineu és a prop)
    enMelodia(nom) {
        if (nom !== 'aurora') return false;
        const prop = Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, 1010, 800) < 520;
        if (!prop) return false;
        if (Estat.flag('bassadoriaNeta')) { this.flotant(1010, 640, "L'aigua ja és clara", '#9fd8ff'); return true; }
        this.aiguaNeta.setVisible(true).setAlpha(0);
        this.tweens.add({ targets: this.aiguaNeta, alpha: 0.75, duration: 1500 });
        if (this.boiraBass) this.boiraBass.stop();
        this.enemics.filter(e => e.tipus === 'gripau' && !e.mort).forEach(e => {
            e.mort = true; e.spr.body.enable = false;
            this.boiraPuf(e.spr.x, e.spr.y);
            this.tweens.add({ targets: [e.spr, e.ombra], alpha: 0, duration: 600, onComplete: () => this.retirar(e) });
        });
        this.ui().obrirDialeg(DIALEGS.bassadoriaNeta(Estat), () => Estat.desar());
        return true;
    }

    actualitzar(ara) {
        if (Estat.flag('bassadoriaNeta') || ara < this.propGripau) return;
        const vius = this.enemics.filter(e => e.tipus === 'gripau' && !e.mort).length;
        this.propGripau = ara + 4500;
        if (vius < 3) this.enemic('gripau', 870 + Math.random() * 280, 870, { sortida: true });
    }
}

// ---------------- CASA GRAN, LA FONT I L'HOME DEL RAÏM ----------------
class ZonaCasaGran extends ZonaBase {
    constructor() {
        super('ZonaCasaGran', {
            nom: 'La Casa Gran i la Font',
            amplada: 1600,
            alcada: 1100,
            entrades: {
                placa:  { x: 1540, y: 930, dir: 'esquerra' },
                oest:   { x: 60,   y: 930, dir: 'dreta' },
                porxo:  { x: 700,  y: 600, dir: 'avall' }
            }
        });
    }

    construir() {
        this.terra('llamborda', 0, 0, 1600, 1100, -1100);   // tota l'escena és de pedra (la mateixa plaça empedrada), sense gespa

        // Façana gran (1250 d'ample): la reixa del porxo (arc del mig) queda a x=700, amb la base a y≈563 i ~170 d'alt
        this.posar('casa_gran', 700, 727, { fonsY: 560 });
        this.colisio(700, 528, 1180, 70);
        this.blocDarrere(700, 1180, 493);
        // La reixa del porxo, tancada des de fa generacions: per fora no hi ha manera d'entrar
        this.interactiu(700, 585, 85, DIALEGS.portaReixa, { altura: 190 });

        // Cartell a terra, a la dreta de les escales
        this.cartell(1180, 860, DIALEGS.cartellCasaGran);

        // La Font de la Mare de Déu, a la part baixa de l'escena (separada de la casa)
        this.posar('font', 250, 1040, { col: { w: 110, h: 34 } });
        this.interactiu(250, 1045, 90, DIALEGS.font, { altura: 150 });

        // Cartell que indica la Taverna, a la vora de la sortida de l'esquerra
        this.cartell(170, 880, DIALEGS.enConstruccio('← La Taverna'));

        // Arbres només a la dreta, deixant el camí lliure
        this.arbres([[1480, 300], [1530, 520], [1470, 740]]);

        // Les sortides són a sota de la casa (la façana no les tapa)
        this.sortida(1586, 880, 14, 160, 'ZonaPlaca', 'casaGran');
        this.sortida(0, 880, 14, 160, 'ZonaJardi', 'taverna');
    }
}


// ---------------- SALA DEL TRESOR (passatge secret de la cantonada Monestir-Santuari) ----------------
class ZonaTresor extends ZonaBase {
    constructor() {
        super('ZonaTresor', {
            nom: 'Passatge secret',
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

        // Tresor del monjo que va obrir aquest racó: un cofre vell entre espelmes
        this.posar('cofre', 500, 250, { col: { w: 50, h: 20 } });
        this.interactiu(500, 255, 85, DIALEGS.cofreTresor, { altura: 80 });
        [[400, 260], [600, 260]].forEach(([x, y], i) => {
            const e = this.posar('espelma', x, y, { fonsY: y });
            this.tweens.add({ targets: e, alpha: 0.7, yoyo: true, repeat: -1, duration: 350 + i * 90 });
        });
        this.add.rectangle(500, 350, 800, 700, 0xffd38a, 0.05).setDepth(80000);
        this.sortida(460, 680, 80, 14, 'ZonaPlaca', 'tresor');
    }
}
