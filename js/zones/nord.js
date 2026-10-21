/**
 * ZONES DEL NORD I L'OEST DE LA PLAÇA
 * Les Runes (nus), Sala del Ping-pong, Cel·les i Til·ler, Bosc de Sant Joan.
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
                cami:     { x: 60,   y: 585,  dir: 'dreta' },
                cementiri:{ x: 1530, y: 585,  dir: 'esquerra' },
                pingpong: { x: 330,  y: 965,  dir: 'avall' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1600, 1100, -1100);
        this.terra('pedra', 150, 640, 1300, 320);       // replà de pedra
        this.terra('cami', 700, 0, 200, 660);           // cap al nord (cel·les i Til·ler)
        this.terra('cami', 700, 940, 200, 160);         // cap a la Plaça
        this.terra('cami', 0, 520, 800, 130);           // camí de la Desaparició (oest): surt de davant les runes
        this.terra('cami', 1100, 520, 500, 130);        // cap al cementiri (est, darrere el Santuari)

        // Les runes, a la dreta; el camí passa per davant
        this.terra('pedra', 980, 90, 520, 330);          // replà de pedra de les runes
        this.posar('runes', 1270, 330, { col: { w: 360, h: 60 } });
        // Un xiprer alt a l'esquerra de les runes (com a les fotos) i pedres caigudes davant
        this.posar('xiprer', 1030, 330, { escala: 1.5, col: { w: 26, h: 12 } });
        [[1110, 345, 0.6], [1440, 350, 0.5]].forEach(([x, y, e]) => this.posar('roca', x, y, { escala: e, col: { w: 30, h: 14 } }));
        this.interactiu(1260, 370, 110, DIALEGS.ruines, { altura: 140 });

        // Porta del Ping-pong, a baix
        this.edifici('sala_pingpong', 330, 900, 340, 80, 'ZonaPingpong', 'ruines', { alt: 90 });

        // L'ombra del monjo: només es veu quan has llegit el primer fragment del pergamí
        this.ombraMonjo = this.add.image(1130, 340, 'ombra_monjo').setOrigin(0.5, 1)
            .setScale((this.textures.get('ombra_monjo').customData.escala || 0.5)).setDepth(340).setAlpha(0);
        this.interactiu(1130, 380, 95, DIALEGS.ombraMonjo, { altura: 210, actiu: () => Estat.flag('fragment1'), enTancar: () => Estat.posaFlag('flauta_ombra') });
        this.llocFlauta('ombra', 1130, 390, 160, true);
        this.tweens.add({ targets: this.ombraMonjo, y: 344, yoyo: true, repeat: -1, duration: 2400, ease: 'Sine.easeInOut' });
        // Ambient de nit quan la llegenda s'ha començat a descobrir
        this.nit = this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x0a0a30, 0.22).setScrollFactor(0).setDepth(89000).setVisible(false);

        this.cartell(640, 700, DIALEGS.cartellRuinesPingpong);

        this.arbres([[100, 150], [260, 90], [420, 190], [560, 80], [900, 130], [940, 300], [1560, 100],
                     [1540, 330], [90, 480], [180, 580], [1480, 420], [60, 1000], [1530, 1020],
                     [1100, 1030], [520, 1040]]);

        // Animalets del cementiri esquerdat
        this.enemic('escolopendra', 400, 420);
        this.enemic('escolopendra', 1000, 330);
        this.enemic('escolopendra', 1300, 800);
        this.sortida(700, 1086, 200, 14, 'ZonaPlaca', 'ruines');
        this.sortida(700, 0, 200, 14, 'ZonaCelles', 'ruines');
        this.sortida(0, 520, 14, 130, 'ZonaCami', 'runes');
        this.sortida(1586, 520, 14, 130, 'ZonaCementiri', 'runes');
    }

    // El Cant de les Pedres, tocat davant l'ombra, li desperta la memòria
    enMelodia(nom) {
        if (nom !== 'pedres' || !Estat.flag('fragment1')) return false;
        if (Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, 1130, 360) > 300) return false;
        if (Estat.flag('benedicioMonjo')) { this.flotant(1130, 200, "L'ombra assenteix", '#d8c8ff'); return true; }
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

// ---------------- SALA DEL PING-PONG (interior) ----------------
class ZonaPingpong extends ZonaBase {
    constructor() {
        super('ZonaPingpong', {
            nom: 'Sala del Ping-pong',
            amplada: 1280,
            alcada: 820,
            colorFons: '#140e0a',
            pacifica: true,
            entrades: { porta: { x: 640, y: 740, dir: 'amunt' }, secreta: { x: 210, y: 320, dir: 'dreta' } }
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

        // Porta secreta camuflada darrere d'una roda de carruatge gegant penjada a la paret (cap a la Casa Gran)
        const roda = this.add.graphics().setDepth(5);
        const rx = 700, ry = 158, rr = 62;
        roda.fillStyle(0x000000, 0.25).fillCircle(rx + 6, ry + 8, rr + 4);
        roda.lineStyle(12, 0x6a4424, 1).strokeCircle(rx, ry, rr);
        roda.lineStyle(4, 0x2a1a0c, 1).strokeCircle(rx, ry, rr + 6).strokeCircle(rx, ry, rr - 6);
        roda.lineStyle(7, 0x7a5230, 1);
        for (let i = 0; i < 12; i++) {
            const a = i * Math.PI / 6;
            roda.lineBetween(rx + Math.cos(a) * 14, ry + Math.sin(a) * 14, rx + Math.cos(a) * (rr - 4), ry + Math.sin(a) * (rr - 4));
        }
        roda.fillStyle(0x4a2c16, 1).fillCircle(rx, ry, 17).lineStyle(4, 0x2a1a0c, 1).strokeCircle(rx, ry, 17);
        roda.fillStyle(0x8a8a8a, 1).fillCircle(rx, ry, 6);
        this.interactiu(700, 225, 100, DIALEGS.posterSecret, {
            altura: 120,
            enTancar: () => { if (Estat.flag('portaSecretaPP') && Estat.te('clauer')) this.canviarZona('ZonaCasaGranInt', 'secreta'); }
        });

        // Jugadors
        this.npc('juli', 300, 500, DIALEGS.juli);
        this.npc('frederic', 1040, 250, DIALEGS.frederic, { flipX: true });
        this.npc('eloi', 560, 520, DIALEGS.eloi);
        this.npc('josep', 860, 520, DIALEGS.josep);

        this.add.rectangle(640, 410, 1080, 820, 0xffe9a8, 0.04).setDepth(80000);
        this.sortida(600, 790, 80, 20, 'ZonaRuines', 'pingpong');
    }
}

// ---------------- CEL·LES I TIL·LER ----------------
class ZonaCelles extends ZonaBase {
    constructor() {
        super('ZonaCelles', {
            nom: 'Cel·les i Gran Til·ler',
            amplada: 1800,
            alcada: 1100,
            entrades: {
                ruines: { x: 900, y: 1040, dir: 'amunt' },
                bosc:   { x: 60,  y: 705,  dir: 'dreta' },
                cirosa: { x: 1070, y: 90,  dir: 'avall' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1800, 1100, -1100);
        this.terra('cami', 0, 640, 1800, 130);           // camí est-oest (bosc de Sant Joan)
        this.terra('cami', 800, 770, 200, 330);          // cap a les Runes
        this.terra('cami', 1000, 120, 140, 520);         // cap a la Cirosa

        // Nostra Senyora (oest, l'edifici més gran) i Sant Benet (est), com al mapa
        this.posar('cel_ntrasra', 450, 600, { col: { w: 520, h: 100 } });
        this.interactiu(450, 620, 90, DIALEGS.cel_ntrasra, { altura: 140 });
        this.posar('cel_stbenet', 1380, 600, { col: { w: 380, h: 90 } });
        this.interactiu(1380, 620, 80, DIALEGS.cel_stbenet, { altura: 140 });

        // Arbres joves i prims plantats vora el camí, com a la foto de les cel·les
        [[250, 632, 0.42], [570, 748, 0.38], [1180, 752, 0.38], [1480, 640, 0.42], [680, 560, 0.36]].forEach(([x, y, e]) => this.posar('arbre', x, y, { escala: e, col: { w: 14, h: 8 } }));

        // El Gran Til·ler
        this.posar('tiller', 900, 600, { col: { w: 110, h: 40 } });
        this.interactiu(900, 625, 100, DIALEGS.tiller, { altura: 280 });

        // Després del sopar queden quatre espelmes vora les arrels del Til·ler
        if (Estat.flag('soparFet')) this.posarEspelmes();

        // Tutorial del bastó: la branca del Til·ler i els espantaocells de pràctica
        this.branca = this.posar('branca', 990, 700, { fonsY: 600 });
        this.interactiu(990, 705, 70, DIALEGS.branca, { altura: 60, actiu: () => Estat.flag('tillerBranca') && !Estat.te('basto') });
        this.cartell(560, 860, DIALEGS.espantaocellsCartell);
        this.enemic('espantaocell', 640, 930);
        this.enemic('espantaocell', 740, 960);

        // La Caseta d'en Jordi, darrere el Til·ler (nord): el pagès eixerit que dóna la palanca
        this.posar('masia', 640, 380, { escala: 0.55, col: { w: 240, h: 60 } });
        this.npc('jordi_caseta', 830, 430, DIALEGS.jordiCaseta);

        // Sant Benet (est): la Neus i el seu marit
        this.npc('neus', 1250, 680, DIALEGS.neus);
        this.npc('marit_neus', 1320, 700, DIALEGS.maritNeus);
        // Les Tietes, vora el Til·ler: donen consells
        this.npc('tieta', 780, 690, DIALEGS.tieta1);
        this.npc('tieta2', 850, 710, DIALEGS.tieta2, { flipX: true });
        // Nostra Senyora (oest): en Yordi i la Judit (testimonials)
        this.npc('yordi', 330, 680, DIALEGS.yordi);
        this.npc('judit', 400, 700, DIALEGS.judit);
        // En Daniel i el seu nebot Turbo
        this.npc('daniel_t', 1560, 690, DIALEGS.danielT);
        this.npc('turbo', 1630, 720, DIALEGS.turbo);

        // La Sansa i el seu carro: no sempre és aquí
        if (Math.random() < 0.5) {
            this.posar('carro_sansa', 1060, 880, { col: { w: 200, h: 50 } });
            this.npc('sansa', 1160, 890, DIALEGS.sansa);
        }

        this.cartell(1070, 420, DIALEGS.cartellCirosa);
        this.cartell(130, 625, () => ({ pagines: [{ qui: '', text: '← Bosc de Sant Joan i la seva font' }] }));

        // Arbres: tanquen el camí de la Cirosa de moment i emmarquen la pantalla
        if (Estat.flag('camiCirosaObert')) {
            this.terra('cami', 1000, 0, 140, 130);
            this.sortida(1000, 0, 140, 14, 'ZonaCamiCirosa', 'celles');
        } else {
            this.muralla(1000, 110, 1140, 110, 70);
        }
        this.arbres([[80, 160], [220, 260], [150, 420], [1700, 220], [1640, 420], [1750, 540], [100, 960], [300, 1040],
                     [560, 1000], [1250, 1020], [1480, 960], [1700, 1030], [700, 200], [820, 120], [1300, 220], [1450, 160]]);

        this.enemic('escolopendra', 600, 900);
        this.enemic('escolopendra', 1500, 880);
        this.sortida(800, 1086, 200, 14, 'ZonaRuines', 'celles');
        this.sortida(0, 640, 14, 130, 'ZonaBosc', 'celles');
    }

    posarEspelmes() {
        [840, 885, 930, 975].forEach((x, i) => {
            const e = this.posar('espelma', x, 668 + (i % 2) * 6, { fonsY: 600 });
            this.tweens.add({ targets: e, alpha: 0.8, yoyo: true, repeat: -1, duration: 300 + i * 70, delay: i * 90 });
        });
        this.interactiu(910, 675, 110, DIALEGS.espelmesTiller, { altura: 90 });
    }

    // Escena del sopar del Til·ler: taula, pastors i ritual de les quatre espelmes
    fesSopar() {
        const cam = this.cameras.main;
        const vel = this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x2a1000, 1).setScrollFactor(0).setDepth(89500).setAlpha(0);
        this.tweens.add({ targets: vel, alpha: 0.38, duration: 1600 });
        const taula = this.posar('taula_sopar', 910, 800, { fonsY: 790 });
        const pastors = ['pastor_a', 'pastor_b', 'pastor_vell'].map((k, i) => this.posar(k, 800 + i * 110, 870 + (i % 2) * 14, { fonsY: 880 }));
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
        this.branca.setVisible(Estat.flag('tillerBranca') && !Estat.te('basto'));
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
        // Amagatall tancat amb esbarzers negres (cal foc o Runna): un cofre
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
