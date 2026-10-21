/**
 * ZONES VEÏNES DE LA PLAÇA
 * Santuari (interior), Monestir, Creu de l'Aparició i Bassadòria, Casa Gran.
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
            entrades: { porta: { x: 640, y: 770, dir: 'amunt' } }
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

        // Pergamí amb el fragment 2 de la llegenda del monjo, sobre un banc
        this.posar('pergami', 470, 470, { fonsY: 560 });
        this.interactiu(470, 500, 75, DIALEGS.pergamiEsglesia, { altura: 80 });

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
        this.terra('cami', 0, 450, 1600, 140);
        this.terra('cami', 1400, 0, 160, 460);          // cap al cementiri (darrere el Monestir i el Santuari)
        this.terra('llamborda', 560, 430, 480, 80);

        this.posar('monestir', 800, 440, { col: { w: 600, h: 140, dy: -10 } });
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
            nom: 'Creu de l\'Aparició',
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

        // Creu de l'Aparició
        const verd = this.add.graphics().setDepth(330);       // tanca d'arbust fosc i mur de pedra seca darrere la creu
        for (let x = 520; x <= 960; x += 40) verd.fillStyle(x % 80 ? 0x2c5a2a : 0x3a6e34, 1).fillEllipse(x, 318, 80, 70);
        verd.fillStyle(0x8a8068, 1).fillRect(500, 352, 480, 34).lineStyle(3, 0x2a241a, 1).strokeRect(500, 352, 480, 34);
        verd.lineStyle(1.5, 0x4a4234, 0.8);
        for (let x = 500; x < 980; x += 40) verd.lineBetween(x, 352, x, 386);
        verd.lineBetween(500, 369, 980, 369);
        this.posar('creu', 740, 440, { col: { w: 56, h: 24 } });
        this.interactiu(740, 445, 85, DIALEGS.creu, { altura: 190 });
        [[470, 350], [1010, 350]].forEach(([x, y]) => this.posar('arbre', x, y, { col: { w: 34, h: 16 } }).setTint(0xcfe08a));   // plàtans

        // Bassadòria
        const mur = this.add.graphics().setDepth(640);        // mur de pedra seca darrere la bassa i plàtans de tardor
        mur.fillStyle(0x8a8068, 1).fillRect(860, 610, 420, 40).lineStyle(3, 0x2a241a, 1).strokeRect(860, 610, 420, 40);
        mur.lineStyle(1.5, 0x4a4234, 0.8);
        for (let x = 860; x < 1280; x += 36) mur.lineBetween(x, 610, x, 650);
        mur.lineBetween(860, 630, 1280, 630);
        [[850, 640], [1290, 650]].forEach(([x, y]) => this.posar('arbre', x, y, { col: { w: 34, h: 16 } }).setTint(0xe0b868));
        this.posar('bassadoria', 1010, 770, { col: { w: 236, h: 92, dy: -26 } });
        this.interactiu(1010, 700, 150, DIALEGS.bassadoria, { altura: 110, enTancar: () => Estat.posaFlag('flauta_bassadoria') });
        this.llocFlauta('bassadoria', 1010, 740, 220, true);
        if (!Estat.flag('bassadoriaNeta')) this.boiraBass = this.boira(1010, 700, 190, 60, 2.2);

        // L'Home del Carruatge Verd, a la vora del camí
        this.posar('carruatge', 330, 730, { col: { w: 190, h: 50 } });
        this.npc('home_carruatge', 440, 760, DIALEGS.homeCarruatge);

        this.cartell(1000, 330, () => ({ pagines: [{ qui: '', text: '↑ Plaça del Santuari' }] }));
        this.arbres([[150, 180], [320, 260], [1450, 220], [200, 900], [650, 940], [1300, 930], [1500, 780], [100, 520], [190, 640], [1400, 440], [1480, 600], [260, 440]]);

        this.enemic('escolopendra', 500, 300);
        // Aigua neta (després del Cant de l'Aurora)
        this.aiguaNeta = this.add.ellipse(1010, 703, 205, 60, 0x8fd0f0, 0.75).setDepth(771).setVisible(Estat.flag('bassadoriaNeta'));
        // Els gripaus corromputs surten de la Bassadòria mentre l'aigua estigui tèrbola
        this.propGripau = this.time.now + 1500;
        this.sortida(1100, 0, 160, 14, 'ZonaPlaca', 'creu');

        this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x3a1a55, 0.08).setScrollFactor(0).setDepth(90000);
    }

    // La Bassadòria reacciona al Cant de l'Aurora (només quan l'Ineu és a prop)
    enMelodia(nom) {
        if (nom !== 'aurora') return false;
        const prop = Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, 1010, 770) < 380;
        if (!prop) return false;
        if (Estat.flag('bassadoriaNeta')) { this.flotant(1010, 700, "L'aigua ja és clara", '#9fd8ff'); return true; }
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
        if (vius < 3) this.enemic('gripau', 960 + Math.random() * 100, 800, { sortida: true });
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
                placa:  { x: 1540, y: 700, dir: 'esquerra' },
                oest:   { x: 60,   y: 700, dir: 'dreta' },
                costat: { x: 930,  y: 560, dir: 'avall' },
                porxo:  { x: 756,  y: 580, dir: 'avall' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1600, 1100, -1100);
        this.terra('cami', 0, 620, 1600, 160);
        this.terra('llamborda', 420, 560, 560, 60);

        // La Casa Gran, amb els tres arcs del porxo; la porta de ferro del fons del porxo (arc del mig) s'obre amb el clauer de novici
        this.posar('casa_gran', 700, 600, { fonsY: 560 });
        this.colisio(700, 510, 610, 70);
        this.interactiu(756, 570, 85, DIALEGS.portaReixa, {
            altura: 130,
            enTancar: () => { if (Estat.te('clauer')) this.canviarZona('ZonaCasaGranInt', 'porxo'); }
        });

        // Porta de servei del costat de la Taverna: una altra entrada a la Casa Gran
        this.add.rectangle(988, 510, 36, 64, 0x4a2c16).setStrokeStyle(3, 0x2a1a0c).setDepth(561);
        this.interactiu(988, 572, 80, DIALEGS.portaServei, {
            altura: 100,
            enTancar: () => { if (Estat.te('clauer')) this.canviarZona('ZonaCasaGranInt', 'costat'); }
        });

        this.posar('font', 250, 590, { col: { w: 90, h: 30 } });
        this.interactiu(250, 595, 85, DIALEGS.font, { altura: 130 });

        this.cartell(930, 625, DIALEGS.cartellCasaGran);
        this.cartell(180, 600, DIALEGS.enConstruccio('← La Taverna i l\'Hospederia (per ara, el camí et porta fins al Jardí pergolat)'));

        this.arbres([[150, 250], [300, 340], [1250, 260], [1450, 340], [200, 950], [700, 980], [1300, 960]]);

        this.sortida(1586, 620, 14, 160, 'ZonaPlaca', 'casaGran');
        this.sortida(0, 620, 14, 160, 'ZonaJardi', 'taverna');
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
