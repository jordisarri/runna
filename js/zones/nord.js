/**
 * ZONES DEL NORD I L'OEST DE LA PLAÇA
 * Les Runes (nus), El Celler (on es juga a ping-pong), Cel·les, Gran Til·ler, Bosc de Sant Joan.
 */

// ---------------- RUÏNES DE L'ESGLÉSIA ANTIGA (nus) ----------------
// Porta del Ping-pong a baix, les runes a dalt a la dreta (sobre un replà de pedra; el camí de la Desaparició surt cap a l'oest),
// i camí cap al nord per anar a les cel·les i al Til·ler.
class ZonaRuines extends ZonaBase {
    constructor() {
        super('ZonaRuines', {
            nom: 'Les Runes',
            amplada: 1600,
            alcada: 1100,
            entrades: {
                placa:    { x: 800,  y: 1040, dir: 'amunt' },
                celles:   { x: 800,  y: 70,   dir: 'avall' },
                cami:     { x: 60,   y: 915,  dir: 'dreta' },
                cementiri:{ x: 1530, y: 585,  dir: 'esquerra' },
                pingpong: { x: 400,  y: 960,  dir: 'avall' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1600, 1100, -1100);
        this.terra('pedra', 150, 640, 1300, 320);       // replà de pedra
        this.terra('cami', 700, 0, 200, 660);           // cap al nord (cel·les i Til·ler)
        this.terra('cami', 700, 940, 200, 160);         // cap a la Plaça
        this.terra('cami', 0, 850, 800, 130);           // camí de la Desaparició (oest): a l'alçada de la porta del Ping-pong
        this.terra('cami', 1100, 520, 500, 130);        // cap al cementiri (est, darrere el Santuari)

        // Les runes, a la dreta; el camí passa per davant
        this.terra('pedra', 900, 400, 700, 240);         // replà de pedra de les runes
        // Façana gran (760 d'ample): surt per dalt de la pantalla, no importa que no es vegi sencera
        this.posar('runes', 1300, 470, { col: { w: 640, h: 80 } });
        this.blocDarrere(1270, 660, 390);               // no es pot passar per darrere de les runes
        // Pedres caigudes davant
        [[950, 525, 0.6], [1570, 530, 0.5]].forEach(([x, y, e]) => this.posar('roca', x, y, { escala: e, col: { w: 30, h: 14 } }));
        this.interactiu(1310, 540, 110, DIALEGS.ruines, { altura: 140 });

        // El Celler (ping-pong): és la Casa Gran vista per darrere. Només importa la porta (a baix, prou gran perquè hi passi
        // l'Ineu): l'edifici surt per l'esquerra de la pantalla i es retalla a la vora del món.
        const PORTA_X = 400, BASE_Y = 900, PORTA_AMPLE = 98;
        const sala = this.posar('sala_pingpong', 0, BASE_Y, { fonsY: BASE_Y - 20 });
        const mig = PORTA_X - 0.748 * sala.displayWidth;             // x de la vora esquerra de la imatge (la porta és al 74,8% de l'ample)
        sala.setX(mig + sala.displayWidth / 2);
        sala.setCrop(-mig / sala.scaleX, 0, sala.width + mig / sala.scaleX, sala.height);
        const dreta = mig + sala.displayWidth * 0.99;                 // vora dreta de la paret
        this.colisio((PORTA_X - PORTA_AMPLE / 2) / 2, BASE_Y - 45, PORTA_X - PORTA_AMPLE / 2, 90);
        this.colisio((PORTA_X + PORTA_AMPLE / 2 + dreta) / 2, BASE_Y - 45, dreta - PORTA_X - PORTA_AMPLE / 2, 90);
        this.colisio(PORTA_X, BASE_Y - 100, PORTA_AMPLE, 20);
        this.sortida(PORTA_X - PORTA_AMPLE / 2, BASE_Y - 80, PORTA_AMPLE, 76, 'ZonaPingpong', 'ruines');
        this.blocDarrere((0 + dreta) / 2, dreta, BASE_Y - 110);   // ni darrere de l'edifici

        // L'ombra del monjo: només es veu quan has llegit el primer fragment del pergamí
        this.ombraMonjo = this.add.image(1100, 560, 'ombra_monjo').setOrigin(0.5, 1)
            .setScale((this.textures.get('ombra_monjo').customData.escala || 0.5)).setDepth(560).setAlpha(0);
        this.interactiu(1100, 600, 95, DIALEGS.ombraMonjo, { altura: 210, actiu: () => Estat.flag('fragment1'), enTancar: () => Estat.posaFlag('flauta_ombra') });
        this.llocFlauta('ombra', 1100, 610, 160, true);
        this.tweens.add({ targets: this.ombraMonjo, y: 564, yoyo: true, repeat: -1, duration: 2400, ease: 'Sine.easeInOut' });
        // Ambient de nit quan la llegenda s'ha començat a descobrir
        this.nit = this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x0a0a30, 0.22).setScrollFactor(0).setDepth(89000).setVisible(false);

        this.cartell(620, 960, DIALEGS.cartellRuinesPingpong);

        this.arbres([[1530, 1020], [1100, 1030]]);

        // Animalets del cementiri esquerdat
        this.enemic('escolopendra', 300, 1010);
        this.enemic('escolopendra', 1350, 620);
        this.enemic('escolopendra', 1300, 800);
        this.sortida(700, 1086, 200, 14, 'ZonaPlaca', 'ruines');
        this.sortida(700, 0, 200, 14, 'ZonaCelles', 'ruines');
        this.sortida(0, 850, 14, 130, 'ZonaCami', 'runes');
        this.sortida(1586, 520, 14, 130, 'ZonaCementiri', 'runes');
    }

    // El Cant de les Pedres, tocat davant l'ombra, li desperta la memòria
    enMelodia(nom) {
        if (nom !== 'pedres' || !Estat.flag('fragment1')) return false;
        if (Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, 1100, 600) > 300) return false;
        if (Estat.flag('benedicioMonjo')) { this.flotant(1100, 440, "L'ombra assenteix", '#d8c8ff'); return true; }
        if (!['fragment1', 'fragment2', 'fragment3'].every(f => Estat.flag(f))) return false;
        this.ui().obrirDialeg(DIALEGS.benedicioMonjo(Estat), () => Estat.desar());
        return true;
    }

    actualitzar() {
        const visible = Estat.flag('fragment1');
        this.nit.setVisible(visible);
        // L'ombra apareix i desapareix lentament, com una respiració
        const alfa = visible ? 0.55 + 0.25 * Math.sin(this.time.now / 900) : 0;
        this.ombraMonjo.setAlpha(Math.max(0, alfa));
    }
}

// ---------------- EL CELLER (interior; el ping-pong hi és una prova circumstancial) ----------------
class ZonaPingpong extends ZonaBase {
    constructor() {
        super('ZonaPingpong', {
            nom: 'El Celler',
            amplada: 1280,
            alcada: 820,
            colorFons: '#140e0a',
            pacifica: true,
            entrades: { porta: { x: 640, y: 740, dir: 'amunt' }, passadis: { x: 700, y: 262, dir: 'avall' } }
        });
    }

    construir() {
        this.terra('rajola', 100, 60, 1080, 760, -1100);
        const murs = this.add.graphics().setDepth(-1000);
        murs.fillStyle(0x2a1f18, 1).fillRect(60, 0, 40, 820).fillRect(1180, 0, 40, 820);
        murs.fillStyle(0x3a2c22, 1).fillRect(100, 0, 1080, 70);
        this.colisio(30, 410, 60, 820);
        this.colisio(1250, 410, 60, 820);
        this.colisio(640, 80, 1080, 160);
        this.colisio(340, 810, 500, 20);
        this.colisio(940, 810, 500, 20);

        // Taules de ping-pong
        this.posar('taula_pp', 420, 360, { col: { w: 220, h: 40 } });
        this.posar('taula_pp', 860, 360, { col: { w: 220, h: 40 } });
        this.interactiu(420, 380, 120, DIALEGS.taulaPP, { altura: 100 });

        // L'entrada secreta de la Casa Gran: una roda de carruatge gegant al davant d'un forat de la paret. S'empeny des d'un costat
        // caminant contra ella (cal Runna: encara no s'obre abans de l'Acte 3) i rodola, descobrint un passadís.
        const forat = this.add.graphics().setDepth(-980);
        forat.fillStyle(0x3a2c22, 1).fillRect(632, 84, 136, 156);
        forat.fillStyle(0x050403, 1).fillRect(646, 98, 108, 142).fillCircle(700, 98, 54);
        forat.lineStyle(5, 0x6a5a46, 1).strokeRect(646, 98, 108, 142);
        this.rodaX = Estat.dades.flags.rodaX || 700;
        this.rodaMoguda = Estat.flag('rodaMoguda');
        this.roda = this.posar('roda_carruatge', this.rodaX, 236, { fonsY: 240 });
        this.colRoda = this.add.zone(this.rodaX, 221, 110, 30);
        this.physics.add.existing(this.colRoda, true);
        if (this.rodaMoguda) this.roda.setAngle(this.rodaX > 700 ? 180 : -180);
        this.empentaMs = 0; this.contacteRoda = 0; this.costatRoda = 1; this.pistaRoda = false;
        this.interactiu(700, 270, 90, DIALEGS.posterSecret, { altura: 150, actiu: () => !this.rodaMoguda });
        if (this.rodaMoguda) this.obrirPassadis();

        // Jugadors
        this.npc('juli', 300, 500, DIALEGS.juli);
        this.npc('frederic', 1040, 250, DIALEGS.frederic, { flipX: true });
        this.npc('eloi', 560, 520, DIALEGS.eloi);
        this.npc('josep', 860, 520, DIALEGS.josep);

        this.add.rectangle(640, 410, 1080, 820, 0xffe9a8, 0.04).setDepth(80000);
        this.sortida(600, 790, 80, 20, 'ZonaRuines', 'pingpong');
    }

    enEntrar() {
        this.physics.add.collider(this.ineu, this.colRoda, (ineu, zona) => {
            this.contacteRoda = this.time.now;
            this.costatRoda = ineu.x < zona.x ? 1 : -1;
        });
    }

    // L'Ineu empeny la roda si és a un costat i avança contra ella; amb Runna es mou, sense Runna pesa massa
    actualitzar(ara, delta) {
        if (this.rodaMoguda) return;
        const ui = this.ui(), c = this.cursors, t = this.tecles;
        const dirX = (c.right.isDown || t.D.isDown ? 1 : 0) - (c.left.isDown || t.A.isDown ? 1 : 0) || Math.sign(ui.vectorTactil.x > 0.3 ? 1 : ui.vectorTactil.x < -0.3 ? -1 : 0);
        const toca = this.time.now - this.contacteRoda < 120 && Math.abs(this.ineu.x - this.colRoda.x) > 50 && dirX === this.costatRoda;
        this.empentaMs = toca ? this.empentaMs + delta : 0;
        if (this.empentaMs < 600) return;
        this.empentaMs = 0;
        if (!Estat.te('runna')) {
            if (!this.pistaRoda) { this.pistaRoda = true; this.flotant(this.roda.x, this.roda.y - 160, 'Pesa massa... i la corrent ve del darrere', '#f2e6c8'); }
            return;
        }
        this.mouRoda(this.costatRoda);
    }

    mouRoda(dir) {
        this.rodaMoguda = true;
        const x = this.roda.x + dir * 150;
        Estat.posaFlag('rodaMoguda');
        Estat.dades.flags.rodaX = x;
        this.cameras.main.shake(350, 0.003);
        this.tweens.add({
            targets: this.roda, x, angle: dir * 180, duration: 900, ease: 'Sine.easeInOut',
            onUpdate: () => { this.colRoda.x = this.roda.x; this.colRoda.body.updateFromGameObject(); },
            onComplete: () => { this.flotant(700, 200, 'Un passadís!', '#d8c8ff'); this.obrirPassadis(); Estat.desar(); }
        });
    }

    // L'obertura de la paret descoberta: porta al passadís (sortida sense llum ni fletxa, perquè és una troballa)
    obrirPassadis() {
        this.sortides.push({ r: new Phaser.Geom.Rectangle(650, 170, 100, 40), desti: 'ZonaPassadis', entrada: 'porta' });
        this.tweens.add({ targets: this.add.circle(700, 190, 70, 0xa070ff, 0.10).setDepth(-970), alpha: 0.03, yoyo: true, repeat: -1, duration: 900 });
    }
}

// ---------------- CEL·LES ----------------
// Nostra Senyora (oest, la més gran) i Sant Benet (est). El camí del nord puja al Gran Til·ler; a l'est no hi ha res.
class ZonaCelles extends ZonaBase {
    constructor() {
        super('ZonaCelles', {
            nom: 'Les Cel·les',
            amplada: 1800,
            alcada: 1100,
            entrades: {
                ruines: { x: 900, y: 1040, dir: 'amunt' },
                bosc:   { x: 60,  y: 705,  dir: 'dreta' },
                tiller: { x: 1070, y: 90,  dir: 'avall' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1800, 1100, -1100);
        this.terra('cami', 0, 640, 1500, 130);           // camí est-oest: del bosc de Sant Joan fins a Sant Benet (a l'est no hi ha res més)
        this.terra('cami', 800, 770, 200, 330);          // cap a les Runes
        this.terra('cami', 1000, 0, 140, 640);           // cap al nord, al Gran Til·ler

        // Nostra Senyora (oest, l'edifici més gran: la porta és més alta que l'Ineu) i Sant Benet (est)
        const ns = this.posar('cel_ntrasra', 520, 600, { col: { w: 840, h: 100 } });
        this.blocDarrere(520, 840, 495, Math.max(0, 600 - ns.displayHeight));
        this.interactiu(520, 625, 90, DIALEGS.cel_ntrasra, { altura: 140 });
        const sb = this.posar('cel_stbenet', 1380, 600, { col: { w: 520, h: 90 } });
        this.blocDarrere(1380, 520, 505, Math.max(0, 600 - sb.displayHeight));
        this.interactiu(1380, 620, 80, DIALEGS.cel_stbenet, { altura: 140 });

        // Sant Benet (est): la Neus i el seu marit, el senyor Moliner
        this.npc('neus', 1250, 680, DIALEGS.neus);
        this.npc('marit_neus', 1320, 700, DIALEGS.maritNeus);
        // Les Tietes, Enriqueta i Lola: donen consells
        this.npc('tieta', 780, 690, DIALEGS.tieta1);
        this.npc('tieta2', 850, 710, DIALEGS.tieta2, { flipX: true });
        // Nostra Senyora (oest): en Yordi i la Judit (testimonials)
        this.npc('yordi', 330, 680, DIALEGS.yordi);
        this.npc('judit', 400, 700, DIALEGS.judit);
        // En Daniel i el seu nebot Turbo
        this.npc('daniel_t', 1560, 690, DIALEGS.danielT);
        this.npc('turbo', 1630, 720, DIALEGS.turbo);

        // La Sansa i el seu carro de verdures: passa per aquí un sol cop, quan l'Isidre te n'ha parlat, i se'n va un cop t'ha donat la llavor
        if (Estat.flag('isidreSansa') && !Estat.flag('llavorSansa')) this.posarSansa();

        this.cartell(130, 625, () => ({ pagines: [{ qui: '', text: '← Bosc de Sant Joan i la seva font\n↑ El Gran Til·ler' }] }));

        this.arbres([[1700, 220], [1640, 420], [1750, 540], [100, 960], [300, 1040],
                     [560, 1000], [1250, 1020], [1480, 960], [1700, 1030]]);

        this.enemic('escolopendra', 600, 900);
        this.enemic('escolopendra', 1500, 880);
        this.sortida(800, 1086, 200, 14, 'ZonaRuines', 'celles');
        this.sortida(0, 640, 14, 130, 'ZonaBosc', 'celles');
        this.sortida(1000, 0, 140, 14, 'ZonaTiller', 'celles');
    }

    posarSansa() {
        this.carroSansa = this.posar('carro_sansa', 1060, 880);
        this.colCarro = this.colisio(1060, 855, 200, 50);
        this.sansa = this.posar('sansa', 1160, 890);
        this.colSansa = this.colisio(1160, 881, 40, 18);
        this.add.image(1160, 890, 'ombra').setScale(0.42).setDepth(-500);
        const punt = this.interactiu(1160, 880, 85, DIALEGS.sansa, { altura: this.sansa.displayHeight + 6 });
        punt.enTancar = () => this.marxaSansa(punt);
    }

    marxaSansa(punt) {
        punt.actiu = () => false;
        this.obstacles.remove(this.colCarro, true, true);
        this.obstacles.remove(this.colSansa, true, true);
        this.tweens.add({ targets: [this.sansa, this.carroSansa], alpha: 0, x: '+=140', duration: 1800, ease: 'Sine.easeIn',
            onComplete: () => { this.sansa.destroy(); this.carroSansa.destroy(); } });
    }
}

// ---------------- EL GRAN TIL·LER (escenari per a ell sol) ----------------
// Hi arriba el camí del sud (les cel·les); del revolt, un camí puja a dalt a la dreta cap a la Cirosa.
class ZonaTiller extends ZonaBase {
    constructor() {
        super('ZonaTiller', {
            nom: 'El Gran Til·ler',
            amplada: 1600,
            alcada: 1100,
            entrades: {
                celles: { x: 840,  y: 1040, dir: 'amunt' },
                cirosa: { x: 1390, y: 90,   dir: 'avall' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1600, 1100, -1100);
        this.terra('cami', 760, 560, 160, 540);           // des de les cel·les (sud)
        this.terra('cami', 760, 560, 700, 170);           // el revolt cap a llevant
        this.terra('cami', 1320, 0, 140, 730);            // cap a dalt a la dreta: la Cirosa

        // El Gran Til·ler
        this.posar('tiller', 560, 580, { col: { w: 110, h: 40 } });
        this.interactiu(560, 605, 100, DIALEGS.tiller, { altura: 280 });

        // Després del sopar queden quatre espelmes vora les arrels del Til·ler
        if (Estat.flag('soparFet')) this.posarEspelmes();

        // La branca del Til·ler: el bastó
        this.branca = this.posar('branca', 650, 680, { fonsY: 580 });
        this.interactiu(650, 685, 70, DIALEGS.branca, { altura: 60, actiu: () => Estat.flag('tillerBranca') && !Estat.te('basto_tiller') });

        // La Caseta d'en Jordi, a la vora (nord-oest): el pagès eixerit que dóna la palanca
        this.posar('masia', 260, 330, { escala: 0.55, col: { w: 240, h: 60 } });
        this.npc('jordi_caseta', 260, 440, DIALEGS.jordiCaseta);

        this.cartell(1200, 790, DIALEGS.cartellCirosa);

        // El camí de la Cirosa: tancat amb arbres fins que el Til·ler l'obre
        if (Estat.flag('camiCirosaObert')) {
            this.sortida(1320, 0, 140, 14, 'ZonaCamiCirosa', 'tiller');
        } else {
            this.muralla(1320, 110, 1460, 110, 70);
        }
        this.arbres([[100, 150], [450, 90], [1000, 120], [1100, 330], [150, 880], [300, 1020], [1150, 1000], [1450, 950], [1540, 520]]);

        this.sortida(760, 1086, 160, 14, 'ZonaCelles', 'tiller');
    }

    posarEspelmes() {
        [500, 545, 590, 635].forEach((x, i) => {
            const e = this.posar('espelma', x, 648 + (i % 2) * 6, { fonsY: 600 });
            this.tweens.add({ targets: e, alpha: 0.8, yoyo: true, repeat: -1, duration: 300 + i * 70, delay: i * 90 });
        });
        this.interactiu(570, 655, 110, DIALEGS.espelmesTiller, { altura: 90 });
    }

    // Escena del sopar del Til·ler: taula, pastors i ritual de les quatre espelmes
    fesSopar() {
        const vel = this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x2a1000, 1).setScrollFactor(0).setDepth(89500).setAlpha(0);
        this.tweens.add({ targets: vel, alpha: 0.38, duration: 1600 });
        const taula = this.posar('taula_sopar', 640, 880, { fonsY: 870 });
        const pastors = ['pastor_a', 'pastor_b', 'pastor_vell'].map((k, i) => this.posar(k, 520 + i * 110, 950 + (i % 2) * 14, { fonsY: 960 }));
        this.time.delayedCall(1800, () => {
            this.ui().obrirDialeg(DIALEGS.tillerSoparRitual(Estat), () => Estat.desar());
        });
        this.sopar = { vel, taula, pastors };
    }

    acabarSopar() {
        if (!this.sopar) { this.posarEspelmes(); return; }
        const { vel, taula, pastors } = this.sopar;
        this.time.delayedCall(800, () => {
            this.tweens.add({ targets: [vel, taula, ...pastors], alpha: 0, duration: 2200, onComplete: () => { [taula, ...pastors].forEach(o => o.destroy()); vel.destroy(); } });
            this.posarEspelmes();
        });
        this.sopar = null;
    }

    actualitzar() {
        // La branca només es veu mentre encara no l'has agafada (i després que el Til·ler te l'hagi indicat)
        this.branca.setVisible(Estat.flag('tillerBranca') && !Estat.te('basto_tiller'));
    }
}

// ---------------- BOSC DE SANT JOAN ----------------
class ZonaBosc extends ZonaBase {
    constructor() {
        super('ZonaBosc', {
            nom: 'Bosc de Sant Joan',
            amplada: 1800,
            alcada: 1200,
            colorFons: '#1f3a1a',
            entrades: { celles: { x: 1740, y: 705, dir: 'esquerra' }, portal: { x: 300, y: 650, dir: 'avall' } }
        });
    }

    construir() {
        this.terra('herba_fosca', 0, 0, 1800, 1200, -1100);
        this.terra('cami', 880, 640, 920, 130);          // camí des de les cel·les fins a la font
        this.terra('pedra', 780, 520, 260, 230);         // clariana de pedra de la font

        // Font del Bisbe (missió de la font)
        this.posar('font_sj', 910, 610, { col: { w: 110, h: 40 } });
        this.interactiu(910, 625, 100, DIALEGS.fontSJ, { altura: 130 });

        // Alzina Buida: el portal ocult cap a la cabana de la Jaumeta
        this.posar('alzina_buida', 300, 560, { col: { w: 90, h: 36 } });
        this.interactiu(300, 575, 100, DIALEGS.alzinaBuida, {
            altura: 220,
            enTancar: () => { if (Estat.flag('portalJaumeta')) { Estat.dades.portalTorna = 'bosc'; this.canviarZona('ZonaCabana', 'portal'); } }
        });
        this.boira(300, 520, 70, 40, 0.5);

        // Herbes de Sant Joan: apareixen fins que les agafes
        this.herbes = [];
        [[1, 'herba de Sant Joan', 430, 280], [2, 'ruda', 1380, 990], [3, 'farigola', 560, 1010]].forEach(([n, nom, x, y]) => {
            const img = this.posar('flors', x, y);
            this.tweens.add({ targets: img, scaleY: img.scaleY * 1.06, yoyo: true, repeat: -1, duration: 900 });
            this.interactiu(x, y, 70, DIALEGS.herba(n, nom), { altura: 60, actiu: () => !Estat.flag('herba' + n) });
            this.herbes.push({ img, flag: 'herba' + n });
        });

        // Bosc dens: arbres en graella amb petits desplaçaments, deixant lliures el camí i els llocs importants
        const lliure = [[200, 180, 160], [900, 650, 240], [300, 560, 150], [430, 280, 110], [1380, 990, 110], [560, 1010, 110], [120, 700, 110]];
        let llavor = 11;
        const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
        for (let y = 80; y < 1180; y += 150) {
            for (let x = 70; x < 1760; x += 170) {
                const px = x + (rnd() - 0.5) * 90, py = y + (rnd() - 0.5) * 70;
                if (py > 600 && py < 790 && px > 880) continue;                              // camí
                if (lliure.some(([lx, ly, r]) => Math.hypot(px - lx, py - ly) < r)) continue;
                this.posar('arbre', px, py, { col: { w: 34, h: 16 } });
            }
        }

        [[600, 400], [1300, 300], [1200, 900], [450, 850], [1550, 560]].forEach(([x, y]) => this.enemic('escolopendra', x, y));
        // Amagatall tancat amb esbarzers negres (cal Runna): un cofre
        for (let i = 0; i < 6; i++) {
            const a = i / 6 * Math.PI * 2;
            this.esbarzer(200 + Math.cos(a) * 105, 190 + Math.sin(a) * 75, 'bosc' + i);
        }
        this.cofre = this.posar('cofre', 200, 200, { col: { w: 50, h: 20 } });
        this.interactiu(200, 205, 80, DIALEGS.cofreBosc, { altura: 70 });

        this.cartell(120, 700, DIALEGS.cartellBosc);
        this.sortida(1786, 640, 14, 130, 'ZonaCelles', 'bosc');

        this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x102810, 0.18).setScrollFactor(0).setDepth(90000);
    }

    actualitzar(ara) {
        this.herbes.forEach(h => h.img.setVisible(!Estat.flag(h.flag)));
    }
}
