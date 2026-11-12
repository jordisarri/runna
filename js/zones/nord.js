/**
 * ZONES DEL NORD I L'OEST DE LA PLAÇA
 * Les Runes (nus), El Celler (on es juga a ping-pong), Cel·les, Gran Til·ler, Bosc de Sant Joan.
 */

// ---------------- EL PATI DEL CELLER ----------------
// Entre la Plaça (sud) i les Runes (nord). A l'esquerra, el Celler, on es juga a ping-pong: és la Casa Gran vista per darrere.
// Només importa la porta (prou gran perquè hi passi l'Ineu): l'edifici surt per l'esquerra i es retalla a la vora del món.
class ZonaCellerFora extends ZonaBase {
    constructor() {
        super('ZonaCellerFora', {
            nom: 'Pati del Celler',
            amplada: 1600,
            alcada: 1100,
            entrades: {
                placa:    { x: 800, y: 1040, dir: 'amunt' },
                runes:    { x: 800, y: 70,   dir: 'avall' },
                pingpong: { x: 400, y: 960,  dir: 'avall' },
                girgoles: { x: 1530, y: 505, dir: 'esquerra' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1600, 1100, -1100);
        this.terra('cami', 700, 0, 200, 1100);          // de la Plaça (sud) a les Runes (nord)
        this.terra('pedra', 150, 900, 640, 120);        // esplanada de pedra davant la porta del Celler
        this.terra('cami', 900, 440, 700, 130);         // el camí cap a l'est, entre els arbres: duu a la Sala de les Gírgoles

        const PORTA_X = 400, BASE_Y = 900, PORTA_AMPLE = 98, ALT_PARET = 90;
        const sala = this.posar('sala_pingpong', 0, BASE_Y, { fonsY: BASE_Y - 20 });
        const mig = PORTA_X - 0.748 * sala.displayWidth;             // x de la vora esquerra de la imatge (la porta és al 74,8% de l'ample)
        sala.setX(mig + sala.displayWidth / 2);
        sala.setCrop(-mig / sala.scaleX, 0, sala.width + mig / sala.scaleX, sala.height);
        const dreta = mig + sala.displayWidth;                       // vora dreta del gràfic
        this.colisio((PORTA_X - PORTA_AMPLE / 2) / 2, BASE_Y - ALT_PARET / 2, PORTA_X - PORTA_AMPLE / 2, ALT_PARET);
        this.colisio((PORTA_X + PORTA_AMPLE / 2 + dreta) / 2, BASE_Y - ALT_PARET / 2, dreta - PORTA_X - PORTA_AMPLE / 2, ALT_PARET);
        this.colisio(PORTA_X, BASE_Y - 100, PORTA_AMPLE, 20);
        this.sortida(PORTA_X - PORTA_AMPLE / 2 + 6, BASE_Y - 80, PORTA_AMPLE - 12, 56, 'ZonaPingpong', 'porta');
        this.portaAnimada({ x: 404, top: 703, bottom: 862, ample: 102, fons: BASE_Y - 20, arc: true, color: 0xa84a30, vora: 0x3a1408 });   // la porta d'arc del Celler
        this.blocDarrere((0 + dreta) / 2, dreta, BASE_Y - 110);   // ni darrere de l'edifici

        // Barrils i una bóta vella vora la porta; a l'altra banda del camí, un pati d'herba amb arbres
        [[560, 930], [612, 948], [190, 940]].forEach(([x, y]) => this.posar('barril', x, y, { col: { w: 50, h: 22 } }));
        this.cartell(960, 640, DIALEGS.cartellCeller);
        this.arbres([[1100, 200], [1350, 120], [1500, 380], [1150, 690], [1450, 700], [1250, 900], [1520, 1020], [1050, 1040]]);
        [[1300, 420], [1180, 820]].forEach(([x, y]) => this.posar('flors', x, y, { fonsY: -800, escala: 0.6 }));

        this.enemic('escolopendra', 1300, 600);
        this.enemic('visitant', 1000, 700);        // un visitant trastocat per la boira, que ha pujat a veure el Celler
        this.sortida(700, 1086, 200, 14, 'ZonaPlaca', 'ruines');
        this.sortida(700, 0, 200, 14, 'ZonaRuines', 'celler');
        this.sortida(1586, 440, 14, 130, 'ZonaGirgolesFora', 'celler');
    }
}

// ---------------- RUÏNES DE L'ESGLÉSIA ANTIGA (nus) ----------------
// Les runes a la dreta (sobre un replà de pedra) amb l'ombra del monjo; el camí de la Desaparició surt cap a l'oest, el del
// Cementiri cap a l'est, i el del nord va a les cel·les i al Til·ler. Al sud, el Pati del Celler.
class ZonaRuines extends ZonaBase {
    constructor() {
        super('ZonaRuines', {
            nom: 'Les Runes',
            amplada: 1300,
            alcada: 1100,
            entrades: {
                celler:   { x: 500,  y: 1040, dir: 'amunt' },
                placa:    { x: 500,  y: 1040, dir: 'amunt' },   // (partides desades d'abans del Pati del Celler)
                pingpong: { x: 500,  y: 1040, dir: 'amunt' },
                celles:   { x: 500,  y: 70,   dir: 'avall' },
                cami:     { x: 60,   y: 915,  dir: 'dreta' },
                cementiri:{ x: 1230, y: 710,  dir: 'esquerra' }
            }
        });
    }

    construir() {
        // L'escena és ara més estreta (1300 en lloc de 1600: s'ha tret la part de ponent, que era buida) i la façana de les runes i el camí de l'est
        // han baixat 125 px perquè la façana es vegi sencera (abans sortia per dalt del món)
        this.terra('herba', 0, 0, 1300, 1100, -1100);
        this.terra('pedra', 0, 640, 1150, 320);         // replà de pedra
        this.terra('cami', 400, 0, 200, 660);           // cap al nord (cel·les i Til·ler)
        this.terra('cami', 400, 940, 200, 160);         // cap al Pati del Celler i la Plaça
        this.terra('cami', 0, 850, 500, 130);           // camí de la Desaparició (oest)
        this.terra('cami', 800, 645, 500, 130);         // cap al cementiri (est, darrere el Santuari)

        // Les runes, a la dreta; el camí passa per davant
        this.terra('pedra', 600, 525, 700, 240);         // replà de pedra de les runes
        // Façana gran (760 d'ample i 575 d'alt): la base és a y=595, així que la part de dalt (y=20) es veu sencera
        this.posar('runes', 920, 595, { col: { w: 640, h: 80 } });
        this.blocDarrere(890, 660, 515);                // no es pot passar per darrere de les runes
        // Pedres caigudes davant i, a ponent, carreus escampats de l'església que mai no es va acabar
        [[570, 650, 0.6], [1190, 655, 0.5], [90, 700, 0.8], [120, 760, 0.55], [60, 1040, 0.7], [260, 640, 0.5], [60, 560, 0.65]]
            .forEach(([x, y, e]) => this.posar('roca', x, y, { escala: e, col: { w: 60 * e, h: 22 * e } }));
        // Una pedra grossa a terra, al peu del mur: tapa un forat. S'empeny de debò (sense guants), des de qualsevol dels quatre costats, caminant-hi
        // contra: la pedra va davant de l'Ineu mentre l'empeny i es queda on la deixa. Quan el forat queda a la vista s'hi veu un pou fosc; el pergamí partit
        // només s'hi veu amb el Llum d'en Mamet.
        const HX = 1000, HY = 606, mogutR = Estat.flag('pedraRunes');
        this.HX = HX; this.HY = HY;
        this.dibuixarForat(HX, HY);
        let px = HX, py = HY + 24;
        const guardada = String(Estat.dades.flags.pedraRunesPos || '').split(',').map(Number);
        if (guardada.length === 2 && guardada.every(Number.isFinite)) { px = guardada[0]; py = guardada[1]; }
        else if (mogutR) { px = HX + 100; }                                          // partides velles: la pedra era a la dreta
        this.pedraForat = this.posar('roca', px, py, { escala: 1 });
        this.colPedraForat = this.colisio(px, py - 13, 80, 26);
        this.pedraEmpenta = 0; this.pedraDir = null;
        if (!Estat.flag('fragment1')) {
            this.crearBoiraForat();
            // (La pedra no té cap punt d'interacció: només s'empeny. El forat, un cop destapat, en té un.)
            this.interactiu(HX + 6, HY + 46, RADI_OBJECTE + 10, DIALEGS.ruines, { altura: 70, actiu: () => Estat.flag('pedraRunes') && !Estat.flag('fragment1') });
        } else if (!Estat.te('fragment1')) Estat.dona('fragment1');          // partides desades d'abans del pergamí físic

        // L'ombra del monjo: projectada al mur a l'esquerra del portal de les runes (dividida en franges horitzontals per a l'efecte d'ondulació espectral)
        this.apareix = 1;            // 0..1: com de present és l'ombra (la primera vegada es materialitza lentament)
        this.onaSortida = 0;         // 0..1: amplitud extra quan l'ombra s'enlaira i es desfà
        const texOmbra = this.textures.get('ombra_monjo'), frOmbra = texOmbra.get();
        const tw = frOmbra.cutWidth || frOmbra.width, th = frOmbra.cutHeight || frOmbra.height, nFranges = 40;
        this.frangesOmbra = [];
        for (let k = 0; k < nFranges; k++) {
            const y0 = Math.floor(k * th / nFranges), y1 = Math.floor((k + 1) * th / nFranges);
            const im = this.add.image(0, 0, 'ombra_monjo').setOrigin(0.5, 1).setCrop(0, y0, tw, Math.max(1, y1 - y0));
            this.frangesOmbra.push(im);
        }
        this.ombraMonjo = this.add.container(825, 550, this.frangesOmbra)
            .setScale((texOmbra.customData && texOmbra.customData.escala) || 0.5).setDepth(596).setAlpha(0);
        this.puntOmbra = this.interactiu(825, 590, RADI_OBJECTE, DIALEGS.ombraMonjo, { altura: 140, actiu: () => ['fragment1', 'fragment2', 'alcoviLlegit'].every(f => Estat.flag(f)) && !Estat.flag('benedicioMonjo'), enTancar: () => { if (this.ombraCantOberta()) Estat.posaFlag('flauta_ombra'); } });
        this.ombraHaCridat = false;
        this.llocFlauta('ombra', 825, 600, 160, true, () => this.ombraCantOberta() && !Estat.flag('benedicioMonjo'));      // la tarota només es pot tocar quan ja s'han llegit els dos pergamins i l'ombra ha demanat el cant
        this.tweens.add({ targets: this.ombraMonjo, y: 553, yoyo: true, repeat: -1, duration: 2400, ease: 'Sine.easeInOut' });
        this.ombraVista = false; this.ombraMarxa = false;

        this.cartell(320, 960, DIALEGS.cartellRuinesPingpong);

        this.arbres([[1230, 1020], [800, 1030], [80, 150], [1200, 160], [100, 430]]);

        // Animalets del cementiri esquerdat
        this.enemic('escolopendra', 150, 600);
        this.enemic('escolopendra', 1050, 745);
        this.sortida(400, 1086, 200, 14, 'ZonaCellerFora', 'runes');
        this.sortida(400, 0, 200, 14, 'ZonaCelles', 'ruines');
        this.sortida(0, 850, 14, 130, 'ZonaCami', 'runes');
        this.sortida(1286, 645, 14, 130, 'ZonaCementiri', 'runes');
    }

    // El forat: una boca fosca a terra, amb vora de terra i pedretes, la paret del fons il·luminada una mica i el fons negre. (Per sobre del terra, per sota de tot.)
    dibuixarForat(HX, HY) {
        const g = this.add.graphics().setDepth(-880);
        g.fillStyle(0x000000, 0.28).fillEllipse(HX, HY + 5, 90, 38);                         // pessigada d'ombra al voltant
        g.fillStyle(0x5a4a38, 1).fillEllipse(HX, HY, 88, 38);                                 // vora de terra trepitjada
        g.fillStyle(0x7a6a52, 1).fillEllipse(HX, HY - 3, 82, 30);                             // cara de dalt de la vora, més clara
        g.fillStyle(0x3a2e22, 1).fillEllipse(HX, HY + 1, 68, 27);                             // paret del pou
        g.fillStyle(0x241b13, 1).fillEllipse(HX, HY + 4, 60, 21);
        g.fillStyle(0x0a0705, 1).fillEllipse(HX, HY + 6, 50, 15);                             // fons
        g.fillStyle(0x000000, 1).fillEllipse(HX, HY + 7, 38, 9);
        g.lineStyle(2, 0x2a2016, 1).strokeEllipse(HX, HY, 88, 38);
        g.lineStyle(1.5, 0x15100b, 0.9).strokeEllipse(HX, HY + 1, 68, 27);
        // pedretes i terrossos a la vora
        [[-40, 2, 9, 6, 0x8a8a84], [-30, -12, 8, 5, 0x77776f], [-8, -17, 10, 6, 0x908f88], [18, -15, 9, 6, 0x7d7c75], [38, -3, 9, 6, 0x8a8a84],
         [35, 12, 8, 5, 0x6d6c66], [-34, 12, 7, 4, 0x6d6c66], [4, 19, 8, 4, 0x77776f]].forEach(([dx, dy, w, h, c]) => {
            g.fillStyle(0x1c150e, 0.55).fillEllipse(HX + dx + 1, HY + dy + 2, w + 2, h);
            g.fillStyle(c, 1).fillEllipse(HX + dx, HY + dy, w, h);
            g.fillStyle(0xffffff, 0.18).fillEllipse(HX + dx - 1, HY + dy - 1, w * 0.5, h * 0.4);
        });
        return g;
    }

    // Cada fotograma: la pedra s'empeny com la resta de pedres del joc (a tocar, des de qualsevol costat, avançant cap a ella), però aquí no té destí fix:
    // va cap a on s'empeny, al ritme de l'Ineu, i no relliscar-hi pels costats. S'atura contra qualsevol obstacle. Quan el forat queda a la vista, el pou es revela.
    actualitzarPedres(delta) {
        super.actualitzarPedres(delta);
        this.actualitzaBoiraForat(delta);
        const r = this.pedraForat, col = this.colPedraForat;
        if (!r || !col || !this.ineu || Estat.flag('pedraRunes')) return;          // un cop destapat el forat, la pedra ja no es mou més
        const b = this.ineu.body, I = this.intent || { x: 0, y: 0 }, c = col.body, M = 14, MARGE = 0.3, MANTENIR = 0.12;
        const entreY = b.bottom > c.top - 10 && b.top < c.bottom + 10, entreX = b.right > c.left - 14 && b.left < c.right + 14;
        const costats = [
            { x: 1, y: 0, toca: entreY && Math.abs(b.right - c.left) < M, comp: I.x, c: 'E' },
            { x: -1, y: 0, toca: entreY && Math.abs(b.left - c.right) < M, comp: -I.x, c: 'O' },
            { x: 0, y: 1, toca: entreX && Math.abs(b.bottom - c.top) < M, comp: I.y, c: 'S' },
            { x: 0, y: -1, toca: entreX && Math.abs(b.top - c.bottom) < M, comp: -I.y, c: 'N' }
        ];
        let dir = null;
        if (this.pedraDir) { const k = costats.find(q => q.c === this.pedraDir.c); if (k && k.toca && k.comp > MANTENIR) dir = this.pedraDir; }
        else dir = costats.filter(q => q.toca && q.comp > MARGE).sort((p, q) => q.comp - p.comp)[0] || null;
        this.pedraEmpenta = dir ? this.pedraEmpenta + delta : Math.max(0, this.pedraEmpenta - delta * 3);
        if (!dir) {
            if (this.pedraDir) { this.pedraDir = null; Estat.posaFlag('pedraRunesPos', Math.round(r.x) + ',' + Math.round(r.y)); Estat.desar(); }
            return;
        }
        if (dir.x) b.setVelocityY(0); else b.setVelocityX(0);                               // no es llisca pels costats de la pedra
        if (this.pedraEmpenta < 90) return;                                                  // un instant de recolzar-s'hi
        this.pedraDir = dir;
        const VEL = 120, pas = VEL * delta / 1000;
        const nx = r.x + dir.x * pas, ny = r.y + dir.y * pas;
        if (!this.pedraLliure(nx, ny)) { b.setVelocity(0, 0); return; }
        r.x = nx; r.y = ny; r.setDepth(ny);
        col.setPosition(nx, ny - 13); c.updateFromGameObject();
        b.setVelocity(dir.x * VEL, dir.y * VEL);                                             // l'Ineu avança amb la pedra: no es queda enrere ni la deixa anar
        if (this.time.now > (this.pedraSo || 0)) { this.pedraSo = this.time.now + 300; Sfx.pas(true); this.cameras.main.shake(70, 0.0012); }
        if (!Estat.flag('pedraRunes') && !this.foratTapat(nx, ny)) this.revelaForat();
    }

    // Cap a on pot anar la pedra: dins la zona, sense xocar amb res més i, un cop descobert, sense tornar a tapar el forat
    pedraLliure(x, y) {
        if (x < 130 || x > 1160 || y < 560 || y > 900) return false;
        const e = x - 40, d = x + 40, t = y - 26, f = y;
        const col = this.colPedraForat;
        for (const o of this.obstacles.getChildren()) {
            if (o === col || !o.body) continue;
            const q = o.body;
            if (e < q.right && d > q.left && t < q.bottom && f > q.top) return false;
        }
        return true;
    }

    // Tapa la pedra el forat? (el dibuix de la pedra contra la boca del pou)
    foratTapat(x, y) {
        const HX = this.HX, HY = this.HY;                       // (la pedra fa 90 d'ample i 61 d'alt, amb els peus a y; el pou és l'el·lipse del centre del forat)
        return x + 45 > HX - 34 && x - 45 < HX + 34 && y > HY - 12 && y - 61 < HY + 14;
    }

    // El forat queda a la vista: pols, clic de pedra i, amb el Llum d'en Mamet, es veu el pergamí
    revelaForat() {
        Estat.posaFlag('pedraRunes');
        Estat.posaFlag('pedraRunesPos', Math.round(this.pedraForat.x) + ',' + Math.round(this.pedraForat.y));
        const HX = this.HX, HY = this.HY;
        Sfx.secret();
        this.pedraDir = null; this.ineu.body.setVelocity(0, 0);
        (this.nuvolsForat || []).forEach(n => n.setDepth(HY + 12)); if (this.fumForat) this.fumForat.setDepth(HY + 14);      // ara la boira surt per davant
        const pols = this.boira(HX, HY, 60, 12, 3, 0xcfc4b0);
        this.time.delayedCall(900, () => { pols.stop(); this.time.delayedCall(1200, () => pols.destroy()); });
        Estat.desar();
    }

    // Del forat en surt una boira lila que el tapa del tot: no s'hi veu res. Amb el Llum d'en Mamet, quan l'Ineu s'hi acosta la boira s'aparta i s'entreveu el
    // pergamí al fons, petit i apagat; si s'allunya, la boira torna a tancar-se. (La boira surt ja de sota la pedra, abans de destapar el forat.)
    crearBoiraForat() {
        const HX = this.HX, HY = this.HY;
        this.apartForat = 0;
        this.llumNinxol = this.add.circle(HX, HY + 4, 30, 0xffd270, 1).setAlpha(0).setDepth(-870).setBlendMode('ADD');
        this.pergamiRunes = this.posar('pergami_partit', HX, HY + 5, { fonsY: -869, escala: 0.4 });
        this.pergamiRunes.setAlpha(0).setTint(0xb0a088);
        this.pergamiBrill = this.add.circle(HX, HY + 2, 18, 0xffe8a0, 1).setAlpha(0).setDepth(-868).setBlendMode('ADD');
        const tons = [0xcdb4f0, 0xb99be6, 0xe2d2ff, 0xa88adc];
        this.nuvolsForat = [];
        const prof = Estat.flag('pedraRunes') ? HY + 12 : 600;                              // abans de destapar-lo, la pedra (a davant) tapa la boira: només n'esguita per les vores
        for (let i = 0; i < 14; i++) {
            const e = (0.1 + Math.random() * 0.1), x = HX + (Math.random() - 0.5) * 44, y = HY + 2 + (Math.random() - 0.5) * 10;
            const im = this.add.image(x, y, 'boira_nuvol').setTint(tons[i % 4]).setScale(e * 1.25, e * 0.9).setAngle(Math.random() * 360).setDepth(prof);
            im.base = 0.5 + Math.random() * 0.3; im.setAlpha(im.base);
            this.tweens.add({ targets: im, x: x + (Math.random() - 0.5) * 36, y: y + (Math.random() - 0.5) * 10, angle: im.angle + (Math.random() < 0.5 ? 70 : -70), duration: 2000 + Math.random() * 1600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
            this.nuvolsForat.push(im);
        }
        // La boira només és DINS del forat: es retalla amb la boca del pou (la vora, les pedretes i la terra es veuen)
        const retall = this.make.graphics({ x: 0, y: 0, add: false }); retall.fillStyle(0xffffff, 1).fillEllipse(HX, HY + 2, 64, 24);
        this.maskForat = retall.createGeometryMask();
        this.nuvolsForat.forEach(n => n.setMask(this.maskForat));
        // Fum lila transparent que s'enlaira del forat, ondulant, i s'esvaeix a poca alçada (no es retalla: surt per sobre de la boca)
        this.fumForat = this.add.particles(HX, HY - 2, 'boira_nuvol', {
            tint: [0xe2d2ff, 0xcdb4f0, 0xf0e4ff], x: { min: -18, max: 18 }, y: { min: -2, max: 6 }, speedY: { min: -22, max: -10 }, speedX: { min: -3, max: 3 },
            scale: { start: 0.05, end: 0.14 }, alpha: { start: 0.3, end: 0 }, lifespan: { min: 1500, max: 2300 }, frequency: 180, rotate: { min: 0, max: 360 },
            emitCallback: q => { q.onda = Math.random() * 6.28; }
        }).setDepth(prof + 2);
        this.fumOnda = this.time.addEvent({ delay: 60, loop: true, callback: () => { if (this.fumForat) this.fumForat.forEachAlive(q => { q.x += Math.sin(this.time.now / 380 + (q.onda || 0)) * 0.35; }); } });
    }

    // Cada fotograma: la boira del forat s'aparta (només amb la llum i a prop) i deixa veure el pergamí; si no, es tanca
    actualitzaBoiraForat(delta) {
        if (!this.nuvolsForat || !this.ineu) return;
        const HX = this.HX, HY = this.HY, I = this.ineu;
        const aprop = Estat.flag('pedraRunes') && Estat.te('llanterna') && Phaser.Math.Distance.Between(I.x, I.y, HX, HY) < 150;
        this.apartForat += ((aprop ? 1 : 0) - this.apartForat) * Math.min(1, delta / 350);
        const t = this.apartForat;
        this.nuvolsForat.forEach(n => n.setAlpha(n.base * (1 - 0.88 * t)));
        if (this.fumForat) this.fumForat.setAlpha(1 - 0.85 * t);
        if (this.pergamiRunes) this.pergamiRunes.setAlpha(0.6 * t);
        if (this.llumNinxol) this.llumNinxol.setAlpha(0.12 * t);
        if (this.pergamiBrill) this.pergamiBrill.setAlpha(t * (0.12 + 0.05 * Math.sin(this.time.now / 300)));
    }

    // Es treu la boira del forat (el pergamí ja és a l'Ineu)
    treuBoiraForat() {
        (this.nuvolsForat || []).forEach(n => { this.tweens.killTweensOf(n); this.tweens.add({ targets: n, alpha: 0, duration: 900, onComplete: () => n.destroy() }); });
        this.nuvolsForat = null;
        if (this.fumOnda) { this.fumOnda.remove(); this.fumOnda = null; }
        if (this.fumForat) { this.fumForat.stop(); const f = this.fumForat; this.time.delayedCall(4500, () => f.destroy()); this.fumForat = null; }
    }

    agafarPergamiRunes(fet) {
        const s = this.pergamiRunes;
        if (!s) { fet(); return; }
        Sfx.objecte();
        if (this.pergamiBrill) { this.pergamiBrill.destroy(); this.pergamiBrill = null; }
        if (this.llumNinxol) { this.llumNinxol.destroy(); this.llumNinxol = null; }
        this.treuBoiraForat();
        this.ajupir('ineu', null, 300);
        this.tweens.add({ targets: s, x: this.ineu.x, y: this.ineu.y - 70, scale: s.scale * 0.5, alpha: 0.2, duration: 650, ease: 'Sine.easeIn', onComplete: () => {
            s.destroy(); this.pergamiRunes = null;
            Estat.dona('fragment1'); this.ui().actualitzarHUD();
            this.llum(this.ineu.x, this.ineu.y - 70, 0xffe8a0);
            this.esperar(300, fet);
        } });
    }

    // Ja es pot tocar davant l'ombra: els dos fragments són al sarró, el Pare Alcoví els ha llegit i l'ombra ha demanat el cant
    ombraCantOberta() { return ['fragment1', 'fragment2', 'alcoviLlegit', 'ombraDemanaCant'].every(f => Estat.flag(f)); }

    teEfecteMelodia(nom) {
        return nom === 'pedres' && Estat.flag('fragment1') && !Estat.flag('benedicioMonjo') && ['fragment1', 'fragment2', 'alcoviLlegit'].every(f => Estat.flag(f)) &&
            Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, this.puntOmbra.x, this.puntOmbra.y) <= 300;
    }

    // El Cant de Vespres, tocat davant l'ombra, li desperta la memòria
    enMelodia(nom) {
        if (nom !== 'pedres' || !Estat.flag('fragment1')) return false;
        if (Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, this.puntOmbra.x, this.puntOmbra.y) > 300) return false;
        if (Estat.flag('benedicioMonjo')) return false;                 // ja descansa
        if (!['fragment1', 'fragment2', 'alcoviLlegit'].every(f => Estat.flag(f))) return false;
        this.ui().obrirDialeg(DIALEGS.benedicioMonjo(Estat), () => Estat.desar());
        return true;
    }

    // El moment en què es troba el primer fragment: l'ombra del monjo es materialitza sobre el mur
    aparicioOmbra(fet) {
        this.apareix = 0; this.ombraVista = true;
        Sfx.secret && Sfx.secret();
        this.cameras.main.shake(400, 0.002);
        // (passa dins d'un diàleg, quan el cicle de la zona no corre: l'ombra s'actualitza aquí mateix)
        this.tweens.add({ targets: this, apareix: 1, duration: 3000, delay: 400, onStart: () => this.llum(this.ombraMonjo.x, this.ombraMonjo.y - 150, 0xd8c8ff),
            onUpdate: () => this.pintarOmbra(), onComplete: () => { this.pintarOmbra(); if (fet) fet(); } });
    }
    // Ha fet el seu paper: l'ombra s'enlaira, es desfà en llum i descansa en pau
    ombraDescansa(fet) {
        this.ombraMarxa = true; this.onaSortida = 0;
        Sfx.secret && Sfx.secret();
        this.tweens.killTweensOf(this.ombraMonjo);
        this.llum(this.ombraMonjo.x, this.ombraMonjo.y - 150, 0xfff0d0);
        const p = this.add.particles(this.ombraMonjo.x, this.ombraMonjo.y - 120, 'espurna', { speedY: { min: -90, max: -30 }, speedX: { min: -20, max: 20 }, lifespan: 1600,
            scale: { start: 0.35, end: 0 }, alpha: { start: 0.9, end: 0 }, tint: [0xfff0d0, 0xd8c8ff, 0xffffff], blendMode: 'ADD', frequency: 40 }).setDepth(9000);
        this.tweens.add({ targets: this, onaSortida: 1, duration: 2600, ease: 'Sine.easeIn', onUpdate: () => this.ondularOmbra() });
        this.tweens.add({ targets: this.ombraMonjo, y: this.ombraMonjo.y - 90, alpha: 0, duration: 2600, ease: 'Sine.easeIn', onComplete: () => {
            p.stop(); this.time.delayedCall(1700, () => p.destroy());
            this.ombraMonjo.setVisible(false);
            this.esperar(400, fet);
        } });
    }

    // L'ombra aixeca el cap i es fa més clara un moment
    ombraReacciona(fet) {
        this.ombraForta = true;
        this.tweens.add({ targets: this.ombraMonjo, scaleX: this.ombraMonjo.scaleX * 1.06, scaleY: this.ombraMonjo.scaleY * 1.06, yoyo: true, duration: 700, onUpdate: () => this.pintarOmbra(), onComplete: () => { this.ombraForta = false; this.pintarOmbra(); if (fet) fet(); } });
        this.llum(this.ombraMonjo.x, this.ombraMonjo.y - 150, 0xd8c8ff);
    }

    actualitzar() {
        // Quan el Pare Alcoví ja ha llegit els fragments, l'ombra parla a l'Ineu el primer cop que s'hi acosta (li diu què vol sentir)
        if (!this.ombraHaCridat && Estat.flag('alcoviLlegit') && Estat.flag('fragment2') && !Estat.flag('ombraDemanaCant')
            && Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, this.puntOmbra.x, this.puntOmbra.y) < 260 && !this.ui().dialeg) {
            this.ombraHaCridat = true;
            this.ineu.body.setVelocity(0);
            this.interactuar(this.puntOmbra);
        }
        this.pintarOmbra();
    }

    // Ondulació per línies d'escaneig (wave distortion): forta en aparèixer o desfer-se, i molt subtil mentre reposa al mur
    ondularOmbra() {
        if (!this.frangesOmbra) return;
        const t = this.time.now / 180;
        const amp = (1 - (this.apareix ?? 1)) * 55 + (this.onaSortida || 0) * 65 + (this.ombraForta ? 14 : 3.2);
        this.frangesOmbra.forEach((im, k) => {
            im.x = Math.sin(t + k * 0.45) * amp + Math.cos(t * 1.7 - k * 0.25) * (amp * 0.35);
        });
    }

    // Com de visible és l'ombra (també es crida des de l'aparició, que passa dins d'un diàleg)
    pintarOmbra() {
        this.ondularOmbra();
        if (this.ombraMarxa) return;                                        // se'n va (ombraDescansa porta l'alfa)
        const visible = (Estat.flag('fragment1') || this.ombraVista) && !Estat.flag('benedicioMonjo');
        // L'ombra apareix i desapareix lentament, com una respiració
        const alfa = visible ? (this.ombraForta ? 1 : 0.8 + 0.1 * Math.sin(this.time.now / 900)) * this.apareix : 0;
        this.ombraMonjo.setAlpha(Math.max(0, alfa));
    }
}

// ---------------- EL CELLER (interior; el ping-pong hi és una prova circumstancial) ----------------
// Una sala petita, que es veu sencera d'una ullada: l'arcada amb la roda i la porta secreta al fons, una taula de ping-pong al mig
// amb en Julius i en Pomers, i en Jusef al costat
const ALCADA_CELLER = 900, AMPLE_CELLER = 600;

class ZonaPingpong extends ZonaBase {
    constructor() {
        super('ZonaPingpong', {
            nom: 'El Celler',
            amplada: AMPLE_CELLER,
            alcada: ALCADA_CELLER,
            colorFons: '#140e0a',
            pacifica: true,
            entrades: { porta: { x: AMPLE_CELLER / 2, y: ALCADA_CELLER - 80, dir: 'amunt' }, passadis: { x: AMPLE_CELLER / 2, y: 352, dir: 'avall' } }
        });
    }

    construir() {
        const A = ALCADA_CELLER, W = AMPLE_CELLER, M = 28, YP = 260;    // M: gruix de les parets dels costats; YP: peu de la paret del fons
        const X0 = M, X1 = W - M, AI = X1 - X0;                         // l'interior
        // ---- Terra de ciment i parets de pedra ----
        this.terra('ciment', X0, YP, AI, A - YP, -1100);
        this.add.tileSprite(X0, 0, AI, YP, 'mur_pedra').setOrigin(0).setTileScale(1 / RES).setDepth(-1000);
        this.add.tileSprite(0, 0, M, A, 'mur_pedra').setOrigin(0).setTileScale(1 / RES).setDepth(-1000).setTint(0x8a8078);
        this.add.tileSprite(X1, 0, M, A, 'mur_pedra').setOrigin(0).setTileScale(1 / RES).setDepth(-1000).setTint(0x8a8078);
        const mur = this.add.graphics().setDepth(-995);
        mur.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.65, 0.65, 0, 0).fillRect(X0, 0, AI, 110);         // la volta s'enfosqueix a dalt
        mur.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0, 0.45, 0.45).fillRect(X0, YP - 34, AI, 34);    // ombra al peu de la paret
        mur.fillStyle(0x6a6054, 1).fillRect(X0, YP - 14, AI, 14);                                                          // sòcol de pedra
        mur.fillStyle(0xcfc4ae, 0.55).fillRect(X0, YP - 14, AI, 2);
        mur.lineStyle(2, 0x1c1610, 1).strokeRect(X0, YP - 14, AI, 14);
        mur.fillStyle(0x000000, 0.35).fillRect(0, 0, 8, A).fillRect(X1 - 8, 0, 8, A);                                     // els costats, en ombra
        this.colisio(M / 2, A / 2, M, A);
        this.colisio(W - M / 2, A / 2, M, A);
        this.colisio(W / 2, (YP + 20) / 2, AI, YP + 20);
        this.colisio((X0 + W / 2 - 40) / 2, A - 10, W / 2 - 40 - X0, 20);
        this.colisio((W / 2 + 40 + X1) / 2, A - 10, X1 - W / 2 - 40, 20);

        // ---- Arcada del fons: pilars, dovelles i una fornícula fosca amb la porta tapada ----
        const AX = W / 2, AR = 120, AY = YP - 100;          // centre de la volta, radi i y de naixement
        this.AX = AX; this.YP = YP;
        const buit = this.make.graphics({ x: 0, y: 0, add: false });
        buit.fillStyle(0xffffff, 1).beginPath().arc(AX, AY, AR, Math.PI, 0, false).lineTo(AX + AR, YP).lineTo(AX - AR, YP).closePath().fillPath();
        const fons = this.add.tileSprite(AX - AR, AY - AR, AR * 2, YP - AY + AR, 'mur_pedra').setOrigin(0).setTileScale(1 / RES).setDepth(-990).setTint(0x4c443b);
        fons.setMask(buit.createGeometryMask());
        const arc = this.add.graphics().setDepth(-985);
        arc.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.7, 0.7, 0.1, 0.1).fillRect(AX - AR, AY - AR, AR * 2, YP - AY + AR);   // fondària de la fornícula
        // dovelles (pedres de l'arc) i clau
        const N = 11;
        for (let i = 0; i < N; i++) {
            const a0 = Math.PI + i * Math.PI / N, a1 = Math.PI + (i + 1) * Math.PI / N, r0 = AR, r1 = AR + 30;
            const pts = [[r0, a0], [r1, a0], [r1, a1], [r0, a1]].map(([r, a]) => ({ x: AX + Math.cos(a) * r, y: AY + Math.sin(a) * r }));
            const clau = i === (N - 1) / 2;
            arc.fillStyle(clau ? 0xd8ceb8 : i % 2 ? 0xa89c86 : 0xbcb09a, 1).fillPoints(pts, true);
            arc.lineStyle(2, 0x1c1610, 1).strokePoints(pts, true);
            if (clau) { arc.fillStyle(0xe8dfca, 0.55).fillRect(AX - 6, AY - r1 + 2, 12, 5); }
        }
        // pilars amb cimaci i base
        [AX - AR - 26, AX + AR].forEach(x => {
            arc.fillStyle(0xb4a892, 1).fillRect(x, AY - 8, 26, YP - AY + 8).lineStyle(2, 0x1c1610, 1).strokeRect(x, AY - 8, 26, YP - AY + 8);
            arc.fillStyle(0xffffff, 0.22).fillRect(x + 2, AY - 6, 5, YP - AY);
            arc.fillStyle(0x000000, 0.22).fillRect(x + 19, AY - 6, 5, YP - AY);
            arc.fillStyle(0xcdc1ab, 1).fillRect(x - 5, AY - 20, 36, 14).lineStyle(2, 0x1c1610, 1).strokeRect(x - 5, AY - 20, 36, 14);         // cimaci
            arc.fillStyle(0xcdc1ab, 1).fillRect(x - 4, YP - 12, 34, 12).lineStyle(2, 0x1c1610, 1).strokeRect(x - 4, YP - 12, 34, 12);        // base
            for (let k = 1; k < 4; k++) arc.lineStyle(1, 0x1c1610, 0.35).lineBetween(x + 1, AY - 8 + k * 26, x + 25, AY - 8 + k * 26);
        });
        // porta secreta: una porta de pedra que es confon amb la paret de la fornícula; només es veuen unes juntes molt fines. Quan la roda
        // ja no la tapa, les juntes s'il·luminen i la porta s'obre amb animació cada cop que l'Ineu s'hi acosta.
        const PR = 72, PX0 = AX - PR, PX1 = AX + PR, PY = YP - 70;
        const juntes = this.add.graphics().setDepth(-981);
        const forma = [{ x: PX0, y: YP }, { x: PX0, y: PY }];
        for (let k = 1; k <= 10; k++) { const a = Math.PI + k / 10 * Math.PI; forma.push({ x: AX + Math.cos(a) * PR, y: PY + Math.sin(a) * 44 }); }
        forma.push({ x: PX1, y: PY }, { x: PX1, y: YP });
        juntes.lineStyle(2, 0x0a0806, 0.5).strokePoints(forma, false).lineBetween(AX, PY - 44, AX, YP);
        juntes.lineStyle(1.5, 0x8a8070, 0.18).strokePoints(forma.map(p => ({ x: p.x + 2, y: p.y + 1 })), false);
        this.juntesPorta = juntes;
        this.portaSecreta = this.portaAnimada({ x: AX, top: PY - 44, bottom: YP, ample: PR * 2, arc: 44, fons: -979, color: 0x4a3a28, vora: 0x1a1612, panell: 0x3a2c1c, ferro: true, vell: true, bloq: () => !this.rodaMoguda });
        // un fanal a l'esquerra de l'arcada (flama que tremola)
        [X0 + 92].forEach((x, k) => {
            const y = 130, f = this.add.graphics().setDepth(-975);
            f.fillStyle(0x2a2118, 1).fillRect(x - 6, y, 12, 26).fillStyle(0x4a3a24, 1).fillRect(x - 11, y - 2, 22, 6).lineStyle(1.5, 0x120a04, 1).strokeRect(x - 11, y - 2, 22, 6);
            const flama = this.add.graphics().setDepth(-974);
            flama.fillStyle(0xff9a2a, 1).fillPoints([{ x: x - 7, y: y - 2 }, { x, y: y - 26 }, { x: x + 7, y: y - 2 }], true);
            flama.fillStyle(0xffe080, 1).fillPoints([{ x: x - 3.5, y: y - 2 }, { x, y: y - 15 }, { x: x + 3.5, y: y - 2 }], true);
            const resp = this.add.graphics().setDepth(-973).setBlendMode(Phaser.BlendModes.ADD);
            for (let q = 0; q < 7; q++) resp.fillStyle(0xffa040, 0.05 + q * 0.01).fillCircle(x, y - 10, 120 * (1 - q / 7));
            this.tweens.add({ targets: [flama, resp], alpha: 0.62, scaleY: 0.96, yoyo: true, repeat: -1, duration: 260 + k * 70, ease: 'Sine.easeInOut' });
        });
        // una fornícula amb prestatges i gerros a la dreta de l'arcada
        [X1 - 62].forEach(x => {
            const R = 44, T = 150, nx = this.add.graphics().setDepth(-990);
            const forma = [{ x: x - R, y: YP - 20 }, { x: x - R, y: T }];
            for (let k = 1; k <= 8; k++) { const a = Math.PI + k / 8 * Math.PI; forma.push({ x: x + Math.cos(a) * R, y: T + Math.sin(a) * 30 }); }
            forma.push({ x: x + R, y: T }, { x: x + R, y: YP - 20 });
            nx.fillStyle(0xb4a892, 1).fillPoints(forma.map(p => ({ x: x + (p.x - x) * 1.14, y: p.y - (p.y < T ? 4 : 0) })), true);
            nx.fillStyle(0x15100c, 1).fillPoints(forma, true);
            nx.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.6, 0.6, 0, 0).fillRect(x - R, T - 30, R * 2, 50);
            [YP - 60, YP - 106].forEach(y => { nx.fillStyle(0x5a3a1e, 1).fillRect(x - R, y, R * 2, 7).lineStyle(1.5, 0x120a04, 1).strokeRect(x - R, y, R * 2, 7); });
            [[-20, 0], [20, 1]].forEach(([dx, t], k) => { this.posar('gerro_' + t, x + dx, YP - 60, { fonsY: -985, escala: 0.85 }); this.posar('gerro_' + ((t + k + 1) % 3), x + dx, YP - 106, { fonsY: -985, escala: 0.7 }); });
        });

        // Un cartell de paper clavat a la paret (esquerra): es veu nítid a la paret; en examinar-lo, el zoom automàtic només el fa més gran
        const CX = X0 + 36, cp = this.add.image(CX, YP - 30, 'cartell_llums_petit').setOrigin(0.5, 1).setDepth(-960);
        cp.setScale(48 / this.textures.get('cartell_llums_petit').getSourceImage().width);
        this.add.rectangle(CX, YP - 28, cp.displayWidth + 8, 5, 0x000000, 0.25).setDepth(-961);
        this.interactiu(CX + 10, YP + 30, RADI_OBJECTE, () => ({ pagines: [{ fer: (z, fet) => z.mostrarImatge('cartell_llums', CX, YP - 30 - cp.displayHeight / 2, cp.displayWidth, null, fet) }] }), { altura: 110 });

        // ---- La roda de carruatge davant la porta (s'empeny des d'un costat; cal Runna) ----
        let rx = Estat.dades.flags.rodaX;
        if (rx === 450 || rx === 830) rx = Estat.dades.flags.rodaX = AX + Math.sign(rx - 640) * 150;     // partides desades amb el celler gran
        this.rodaX = rx || AX;
        this.rodaMoguda = Estat.flag('rodaMoguda');
        this.roda = this.posar('roda_carruatge', this.rodaX, YP + 24, { fonsY: YP + 28 });   // recolzada a la paret, just davant del sòcol
        this.roda.setOrigin(0.5, 0.5).setY(YP + 24 - this.roda.displayHeight / 2);          // gira sobre el seu centre (si no, en rodar quedaria separada de la paret)
        this.colRoda = this.add.zone(this.rodaX, YP + 22, 110, 28);
        this.physics.add.existing(this.colRoda, true);
        if (this.rodaMoguda) this.roda.setAngle(this.rodaX > AX ? 180 : -180);
        this.empentaMs = 0; this.contacteRoda = 0; this.costatRoda = 1; this.pistaRoda = false;
        if (this.rodaMoguda) this.obrirPassadis();

        // ---- Mobiliari del celler ----
        [[X1 - 40, 470], [X1 - 44, 525], [X0 + 42, A - 70]].forEach(([x, y]) => this.posar('barril', x, y, { col: { w: 50, h: 22 } }));

        // ---- La taula de ping-pong (verda) al mig, i els jugadors ----
        // En Jusef queda a la part nord de la taula; Julius i Pomers als costats de la taula
        this.npc('jusef', AX, 540, DIALEGS.jusef);
        this.posar('taula_pp', AX, 680, { col: { w: 220, h: 40 } });
        this.npc('julius', AX - 160, 680, DIALEGS.julius);
        this.npc('pomers', AX + 160, 680, DIALEGS.pomers, { flipX: true });

        this.add.rectangle(W / 2, A / 2, AI, A, 0xffe9a8, 0.04).setDepth(80000);
        this.sortida(W / 2 - 40, A - 30, 80, 20, 'ZonaCellerFora', 'pingpong');
    }

    enEntrar() {
        this.physics.add.collider(this.ineu, this.colRoda, (ineu, zona) => {
            this.contacteRoda = this.time.now;
            this.costatRoda = ineu.x < zona.x ? 1 : -1;
        });
    }

    // L'Ineu empeny la roda si és a un costat i avança cap a ella; amb els Guants de Poder es mou, sense pesa massa.
    // Igual que amb les pedres mòbils: compta cap a on VOL anar el jugador (n'hi ha prou amb ~30% cap a la roda, també amb el joystick en diagonal),
    // basta estar-hi a tocar (no cal xocar-hi exactament) i mentre s'empeny no es llisca pels costats.
    actualitzar(ara, delta) {
        if (this.rodaMoguda) return;
        const b = this.ineu.body, c = this.colRoda.body, I = this.intent || { x: 0, y: 0 };
        const costat = this.ineu.x < this.colRoda.x ? 1 : -1;
        const entreY = b.bottom > c.top - 10 && b.top < c.bottom + 10;
        const buit = costat > 0 ? c.left - b.right : b.left - c.right;                       // la distància que queda fins a la roda
        const toca = entreY && buit > -6 && buit < 14 && Math.abs(this.ineu.x - this.colRoda.x) > 50 && I.x * costat > 0.3;
        if (toca) { b.setVelocityY(0); this.costatRoda = costat; }
        this.empentaMs = toca ? this.empentaMs + delta : Math.max(0, this.empentaMs - delta * 2);
        if (this.empentaMs < 600) return;
        this.empentaMs = 0;
        if (!Estat.te('guants')) {
            if (!this.pistaRoda) { this.pistaRoda = true; this.ineuDiu('Pesa massa... calen unes mans més fortes.'); }
            return;
        }
        this.mouRoda(this.costatRoda);
    }

    mouRoda(dir) {
        this.rodaMoguda = true;
        const x = this.roda.x + dir * 150;              // (la sala fa 600: la roda queda a 150 o a 450, sense tapar el cartell)
        Estat.posaFlag('rodaMoguda');
        Estat.dades.flags.rodaX = x;
        this.cameras.main.shake(350, 0.003);
        Sfx.porta();
        this.tweens.add({
            targets: this.roda, x, angle: dir * 180, duration: 900, ease: 'Sine.easeInOut',
            onUpdate: () => { this.colRoda.x = this.roda.x; this.colRoda.body.updateFromGameObject(); },
            onComplete: () => {
                Sfx.secret(); this.obrirPassadis(); Estat.desar();
                // La porta secreta es descobreix: les juntes s'il·luminen i s'obre un moment per ensenyar el passadís (després s'obre en acostar-s'hi)
                this.tweens.add({ targets: this.juntesPorta, alpha: 0.4, yoyo: true, repeat: 2, duration: 220 });
                this.portaSecreta.forcaFins = this.time.now + 2200;
            }
        });
    }

    // L'obertura de la paret descoberta: porta al passadís (sortida sense llum ni fletxa, perquè és una troballa)
    obrirPassadis() {

        this.sortides.push({ r: new Phaser.Geom.Rectangle(this.AX - 50, this.YP + 18, 100, 32), desti: 'ZonaPassadis', entrada: 'porta' });
        this.tweens.add({ targets: this.add.circle(this.AX, this.YP - 40, 70, 0xa070ff, 0.12).setDepth(-970), alpha: 0.03, yoyo: true, repeat: -1, duration: 900 });
    }
}

// ---------------- CEL·LES ----------------
// Nostra Senyora (oest, la més gran) i Sant Benet (est). El camí del nord puja al Gran Til·ler; a l'est no hi ha res.
class ZonaCelles extends ZonaBase {
    constructor() {
        super('ZonaCelles', {
            pins: { pinyer: 0.3 },
            nom: 'Les Cel·les',
            amplada: 2440,
            alcada: 1100,
            entrades: {
                ruines: { x: 1070, y: 1040, dir: 'amunt' },
                bosc:   { x: 60,  y: 705,  dir: 'dreta' },
                tiller: { x: 1070, y: 90,  dir: 'avall' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 2440, 1100, -1100);
        this.terra('cami', 0, 640, 2200, 130);           // camí est-oest: del bosc de Sant Joan fins a la porta de la Mandu, on s'acaba (no segueix més a l'est)
        this.terra('cami', 1000, 770, 140, 330);         // cap a les Runes (just sota del camí del Til·ler: un encreuament recte)
        this.terra('cami', 1000, 0, 140, 640);           // cap al nord, al Gran Til·ler

        // Nostra Senyora (oest, l'edifici més gran: la porta és més alta que l'Ineu) i Sant Benet (est)
        const ns = this.posar('cel_ntrasra', 520, 600, { col: { w: 840, h: 100 } });
        this.blocDarrere(520, 840, 495, Math.max(0, 600 - ns.displayHeight));
        this.interactiu(520, 625, RADI_OBJECTE, DIALEGS.cel_ntrasra, { altura: 140 });
        // Sant Benet, a la mida dels personatges (portes una mica més baixes que l'Ineu): és molt llarg, i l'escena s'allarga cap a la dreta perquè càpiga sencer.
        // Comença passat el camí del Til·ler; té dues portes: la de l'esquerra (on dormia el Fram) i la de la dreta
        const SB0 = 1160, sb = this.posar('cel_stbenet', SB0, 600);
        sb.setX(SB0 + sb.displayWidth / 2);
        this.colisio((SB0 + 2440) / 2, 555, 2440 - SB0, 90);
        this.blocDarrere((SB0 + 2440) / 2, 2440 - SB0, 505, Math.max(0, 600 - sb.displayHeight));
        this.interactiu(SB0 + sb.displayWidth * 0.251, 620, RADI_OBJECTE, DIALEGS.portaFlam, { altura: 140 });    // porta de l'esquerra: on dormia el Fram

        // La porta de la dreta de Sant Benet: la Mandu, la germana petita del Fram, juga amb una nina. Quan en parla, se li trenca el cap de la nina (de ràbia
        // i de pena) i la nina es queda així fins a l'epíleg, quan el Fram li la cus (només ell la pot arreglar: no deixa que ningú la toqui).
        const PDX = SB0 + sb.displayWidth * 0.754;
        this.manduY = 692;
        this.mandu = this.npc('mandu', PDX, this.manduY, DIALEGS.mandu);
        // El camí s'acaba a la porta de la Mandu. Decoració mínima i amb intenció: dues petites jardineres que abracen la porta (vora la paret), unes quantes
        // taques de flors a l'herba del sud que menen la vista cap al final del camí, i dos arbres baixos que tanquen el final (no sembla que continuï).
        let sd = 19; const rn = () => (sd = sd * 16807 % 2147483647) / 2147483647;
        const TINTS = [0xffffff, 0xffd6e6, 0xfff2b0, 0xd6e8ff];
        const taca = (cx, cy, n, r) => { for (let k = 0; k < n; k++) { const a = rn() * Math.PI * 2, d = Math.sqrt(rn()) * r; this.posar('flors', cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.6, { fonsY: -800, escala: 0.4 + rn() * 0.3 }).setTint(TINTS[Math.floor(rn() * 4)]); } };
        taca(PDX - 62, 626, 6, 22); taca(PDX + 62, 626, 6, 22);                          // les jardineres, a banda i banda de la porta
        taca(1990, 900, 8, 38); taca(2120, 960, 8, 38); taca(2270, 905, 7, 34);          // taques de flors a l'herba del sud
        [[2285, 700, 0.58], [2345, 810, 0.5]].forEach(([x, y, e]) => this.posar('arbre', x, y, { escala: e, col: { w: 22, h: 12 } }));          // els dos arbres que tanquen el final
        this.colisio(2350, 780, 190, 360);                                                // ... i no es pot passar més enllà
        if (Estat.flag('manduNinaTrencada') && !Estat.flag('epilegFet')) this.mandu.setTexture('mandu_trencada');
        else this.jugaMandu();

        // Sant Benet (est): la Meus i el seu marit, el senyor Molner, veïns de Sant Benet
        this.npc('meus', 1250, 680, DIALEGS.meus, { zoomConversa: 1.3 });
        this.npc('molner', 1320, 700, DIALEGS.molner);
        // Les dues Venerables Sàvies (agafades del braç, un sol gràfic): donen consells
        this.npc('venerables', 815, 700, DIALEGS.venerables, { colAmple: 100 });
        // Nostra Senyora (oest): la Carry, vídua del campaner, que busca el seu gos Pallofa (el trobaràs a Sant Antoni)
        this.npc('carry', 360, 690, DIALEGS.carry);

        // La Rosansa i el seu carro de verdures: només passen per les cel·les a l'Acte 3 (quan l'Ineu ja té Runna), fins que et dona la llavor i se'n va
        if (Estat.flag('runna') && !Estat.flag('llavorRosansa')) this.posarRosansa();

        this.cartell(958, 830, () => ({ pagines: [{ qui: 'Cartell', text: '← Bosc de Sant Joan\n← Font del Bisbe\n↑ El Gran Til·ler\n↓ Les Runes\n→ Sant Benet' }] }));       // vora l'encreuament (a la cantonada sud-oest)

        this.arbres([[230, 1010]]);
        // Els tres de l'est, més petits i més al sud, perquè no tapin la Rosansa (ni el carro) ni el camí per on se'n va
        [[1400, 1070, 0.62], [1730, 1075, 0.6], [1990, 1060, 0.62]].forEach(([x, y, e]) => this.posar('arbre', x, y, { escala: e, col: { w: 34, h: 16 } }));      // ben repartits: un a l'oest i tres al sud, davant la porta de la Meus i de Sant Benet (abans, tres junts a l'oest i l'espai buit)      // (el de l'est del camí de les Runes es queda lluny: hi para el carro de la Rosansa)

        this.sortida(1000, 1086, 140, 14, 'ZonaRuines', 'celles');
        this.sortida(0, 640, 14, 130, 'ZonaBosc', 'celles');
        // El camí del Gran Til·ler, al nord, és tapat per una boira espessa que no marxa amb el vent: la desfà el beuratge de la Joaneta
        this.boiraTiller = null;
        if (Estat.flag('boiraTillerNeta') || Estat.flag('parlatTiler')) this.sortida(1000, 0, 140, 14, 'ZonaTiller', 'celles');
        else this.posarBoiraTiller();
    }

    // La Mandu juga amb la nina: la fa ballar, es gronxa i hi parla (un lleuger vaivé)
    jugaMandu() {
        const m = this.mandu;
        this.manduJoc = this.tweens.add({ targets: m, angle: { from: -3, to: 3 }, y: this.manduY - 3, yoyo: true, repeat: -1, duration: 520, ease: 'Sine.easeInOut' });
    }

    // La Mandu, enrabiada, arrenca el cap a la nina: trencall, cotó pels aires i la nina es queda sense cap (queda així fins a l'epíleg)
    // Un primer pla per veure bé el dibuix: la càmera s'acosta a la Mandu des d'abans que arrenqui el cap i hi és fins que acaba la conversa (enTancar del seu punt)
    enquadrarMandu(fet) {
        const m = this.mandu;
        this.manduCam = true;
        this.mandu.punt.enTancar = () => { if (this.manduCam) { this.manduCam = false; this.alliberarCamera(900); } };
        this.enquadrar(m.x, m.y - m.displayHeight * 0.48, 2.6, 900, fet);
    }

    manduTrencaNina(fet) {
        const m = this.mandu;
        if (this.manduJoc) { this.manduJoc.stop(); this.manduJoc = null; }
        this.tweens.killTweensOf(m); m.setAngle(0); m.y = this.manduY;
        Sfx.talla(); this.cameras.main.shake(160, 0.003);
        const p = this.add.particles(m.x, m.y - m.displayHeight * 0.4, 'espurna', { speed: { min: 40, max: 150 }, angle: { min: 180, max: 360 }, gravityY: 320, lifespan: 750, scale: { start: 0.55, end: 0 }, tint: [0xffffff, 0xf2e8d2, 0xe8d8b8], quantity: 16, emitting: false }).setDepth(99000);
        p.explode(16); this.time.delayedCall(900, () => p.destroy());
        m.setTexture('mandu_trencada');
        this.tweens.add({ targets: m, x: m.x + 3, yoyo: true, repeat: 5, duration: 40 });
        Estat.posaFlag('manduNinaTrencada');
        this.esperar(800, fet);
    }

    posarBoiraTiller() {
        const X = 1070, Y = 300;
        this.colBoira = this.colisio(X, Y, 360, 90);
        this.boiraTiller = this.boiraParet(X, Y, 400, 170);
        // El punt d'interacció és a la boira mateixa: sense el beuratge diu que hi falta alguna cosa; amb ell, l'Ineu l'aboca i la boira s'esvaeix
        this.interactiu(X, Y + 70, RADI_GRAN, DIALEGS.boiraTiller, { altura: 150, actiu: () => !!this.boiraTiller });
    }

    // fet: quan la boira ja s'ha esvaït del tot (l'anim. és llarga: s'esfilagarsa a poc a poc)
    esvairBoira(fet) {
        if (!this.boiraTiller) { if (fet) fet(); return; }
        Estat.posaFlag('boiraTillerNeta'); Estat.treu('beuratge');
        const b = this.boiraTiller;
        this.boiraTiller = null;
        this.obstacles.remove(this.colBoira, true, true);
        this.cameras.main.shake(400, 0.003);
        Sfx.secret();
        b.dissipar(() => {
            this.sortida(1000, 0, 140, 14, 'ZonaTiller', 'celles');
            Estat.posaObjectiu("El camí de les Cel·les s'ha aclarit: el Gran Til·ler hi és al capdamunt.");
            Estat.desar();
            if (fet) fet();
        });
    }

    posarRosansa() {
        // Els braços del carro miren a l'est. La Rosansa és una mica més a l'est, davant del carro: quan ha parlat s'hi acosta, agafa els braços, es gira cap a l'est i se l'enduu
        this.carroRosansa = this.posar('carro_rosansa', 1300, 880).setFlipX(true);
        this.colCarro = this.colisio(1240, 855, 160, 50);
        this.rosansa = this.posar('rosansa', 1550, 892);
        this.idleCodi(this.rosansa);                              // respira i es balanceja una mica mentre espera
        this.colRosansa = this.colisio(1550, 883, 40, 18);
        this.ombraRosansa = this.add.image(1550, 892, 'ombra').setScale(0.42).setDepth(-500);
        const punt = this.interactiu(1550, 882, RADI_NPC, DIALEGS.rosansa, { altura: this.rosansa.displayHeight + 6 });
        punt.enTancar = () => this.marxaRosansa(punt);
    }

    // Se'n va: s'apropa al carro mirant a l'oest, s'ajup a agafar els braços, es gira cap a l'est (la direcció del camí) i tibant se l'enduu
    marxaRosansa(punt) {
        punt.actiu = () => false;
        this.obstacles.remove(this.colCarro, true, true);
        this.obstacles.remove(this.colRosansa, true, true);
        const s = this.rosansa, c = this.carroRosansa, o = this.ombraRosansa, y0 = s.y;
        this.aturaIdleCodi(s);
        const pas = (dur, n) => this.tweens.add({ targets: s, y: y0 - 4, duration: dur, yoyo: true, repeat: n });
        const seq = [
            f => { pas(180, 5); s.setFlipX(false); this.tweens.add({ targets: [s, o], x: 1468, duration: 1100, ease: 'Sine.easeInOut', onComplete: () => f() }); }, // camina cap a l'oest cap als braços del carro (mirant a l'oest)
            f => { this.tweens.add({ targets: s, y: y0 + 5, duration: 260, yoyo: true, hold: 300, onComplete: () => f() }); },                                        // s'ajupa per agafar els braços
            f => { s.setFlipX(true); this.esperar(400, f); },                                                                                                            // es gira cap a l'est (cap on marxarà)
            f => {                                                                                                                                                       // marxen cap a l'est, amb la Rosansa caminant endavant (mirant a l'est)
                pas(220, 14);
                this.tweens.add({ targets: [s, o, c], x: '+=520', duration: 3600, ease: 'Sine.easeIn' });
                this.tweens.add({ targets: [s, o, c], alpha: 0, delay: 2200, duration: 1400, onComplete: () => { this.aturaIdleCodi(s); s.destroy(); c.destroy(); o.destroy(); f(); } });
            }
        ];
        this.seq(seq);
    }
}

// ---------------- CEL·LES DE SANT ANTONI ----------------
// A llevant del Monestir. Hi passeja el Germà Francí, monjo del Monestir que cuida les flors del cementiri: per un favor
// (portar-hi el seu ram), et dona els Guants de Poder, els que mouen la roda del Celler. L'Huri, el primer nen desaparegut, hi venia a robar figues.
Object.assign(DIALEGS, {
    portaFlam: E => ({ pagines: [] }),
    portaUri: E => ({ pagines: [] }),
    cel_ntrasra: E => ({ pagines: [] }),
    cel_stantoni: E => ({ pagines: [] }),

    germaFranci: E => {
        if (E.te('guants')) return { pagines: [
            { qui: 'Germà Francí', text: 'Els guants et queden grans, eh? Ja hi creixeràs. Fes-los servir per moure el que pesa, no per empènyer la gent.' }
        ] };
        if (E.flag('florsCreu')) return {
            pagines: [
                { qui: 'Germà Francí', text: 'Les has deixades a l\'àngel? Que Déu t\'ho pagui, fill. Els monjos d\'abans ja deuen estar contents: algú encara se\'n recorda.' },
                { qui: 'Germà Francí', text: 'Té. Són els guants de picapedrer dels monjos antics: amb ells van aixecar les pedres del Santuari. Jo ja no tinc força per fer-los servir, però tu sí.' },
                { avis: 'Has obtingut els GUANTS DE PODER!', obj: 'guants' },
                { qui: 'Germà Francí', text: 'Diuen que, posats, un noi pot moure una roda de carro com si fos de suro. Jo no ho he vist mai. Però mai no havia vist una boira com aquesta, tampoc.' }
            ],
            enAcabar: () => {
                E.dona('guants');
                E.posaObjectiu(PROGRES.pista(E));                       // el primer pas de la història que encara falta, en ordre (no se salta cap)
            }
        };
        if (E.te('ram')) return { pagines: [
            { qui: 'Germà Francí', text: 'El ram, a la tomba de l\'àngel de pedra, a la dreta del Cementiri, fill. Darrere el Monestir, camí amunt. I compte amb les bestioles.' }
        ] };
        return {
            pagines: [
                { qui: 'Germà Francí', text: 'Ineu... Bon dia, fill. Ja et deixen créixer?' },
                { qui: 'Germà Francí', text: 'Perdona que no camini de pressa: aquests genolls ja tenen més anys que el campanar.' },
                { qui: 'Germà Francí', text: 'Jo visc al Monestir, però cada matí baixo a passejar fins a Sant Antoni. L\'Huri, el de Sant Benet, em venia a robar figues i jo feia veure que no el veia. Fa dos dies que la figuera és plena.' },
                { qui: 'Germà Francí', text: 'Cada setmana porto flors a l\'àngel del Cementiri, per als monjos que hi dormen. Però amb aquesta boira no hi arribo: les cames no em responen i les bestioles no em respecten.' },
                { qui: 'Germà Francí', text: 'Me\'n faries el favor? Deixa aquest ram als peus de l\'àngel. I torna, que tinc una cosa per a tu.' },
                { avis: 'Has obtingut un RAM DE FLORS.', obj: 'ram' }
            ],
            enAcabar: () => { E.dona('ram'); E.posaObjectiu("El ram del Germà Francí és per a la tomba de l'àngel, al Cementiri."); }
        };
    }
});

class ZonaSantAntoni extends ZonaBase {
    constructor() {
        super('ZonaSantAntoni', {
            nom: 'Cel·les de Sant Antoni',
            amplada: 1400,
            alcada: 1100,
            entrades: { monestir: { x: 60, y: 880, dir: 'dreta' }, cela: { x: 549, y: 800, dir: 'avall' }, bosc: { x: 1065, y: 1010, dir: 'amunt' } }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1400, 1100, -1100);
        this.terra('cami', 0, 810, 1100, 130);             // des del Monestir, davant la façana
        this.terra('pedra', 420, 770, 260, 60);            // replà davant la porta
        this.terra('cami', 1000, 900, 130, 200);           // el camí gira cap al sud: duu al Bosc del Pi dels Tres Cants

        // La casa (900 d'ample): la porta, un pèl més alta que l'Ineu, és al 33% de l'ample, a x≈545
        const sa = this.posar('cel_stantoni', 700, 760);
        this.colisio((260 + 503) / 2, 715, 503 - 260, 90);          // façana a banda i banda de la porta (503-595)
        this.colisio((595 + 1140) / 2, 715, 1140 - 595, 90);
        this.blocDarrere(700, 880, 670, Math.max(0, 760 - sa.displayHeight));
        this.sortida(509, 730, 80, 16, 'ZonaCelaStAntoni', 'porta');
        this.portaAnimada({ x: 549, top: 600, bottom: 755, ample: 92, fons: 761, color: 0x5a3a20, panell: 0x6a4628, vora: 0x2a1608, ferro: true });   // la porta de la cel·la, de fusta amb ferros

        this.npc('germa_franci', 1010, 870, DIALEGS.germaFranci, { flipX: true });
        // El Pallofa, el gos de la Carry: només hi passeja un cop has parlat amb ella, fins que l'agafes
        if (Estat.flag('carryParlat') && !Estat.te('pallofa') && !Estat.flag('pallofaTornat')) this.posarPallofa();
        this.cartell(170, 800, () => ({ pagines: [{ qui: 'Cartell', text: '← El Monestir i la Plaça' }] }));
        this.arbres([[1250, 300], [1320, 560], [1340, 1060], [160, 300], [360, 220]]);   // cap arbre davant el cartell ni el Germà Francí

        this.sortida(0, 820, 14, 140, 'ZonaMonestir', 'santantoni');   // surts per l'est del Monestir
        this.sortida(1000, 1086, 130, 14, 'ZonaBoscPi', 'santantoni');   // i, al sud, el camí del bosc
    }

    // Va i ve pel camí caminant (full de 16 fotogrames cap a la dreta; es gira per tornar); en agafar-lo, passa al sarró
    posarPallofa() {
        const animat = this.textures.exists('pallofa_cami') && this.textures.get('pallofa_cami').frameTotal > 2;
        let g;
        if (animat) {
            if (!this.anims.exists('pallofa_camina')) this.anims.create({ key: 'pallofa_camina', frames: this.anims.generateFrameNumbers('pallofa_cami', { start: 0, end: 15 }), frameRate: 14, repeat: -1 });
            g = this.add.sprite(420, 905, 'pallofa_cami', 0).setOrigin(0.5, 1).setScale(1 / RES).setDepth(905);
            g.play('pallofa_camina');
        } else g = this.posar('pallofa', 420, 905);
        const ombra = this.add.image(g.x, g.y, 'ombra').setScale(0.2).setDepth(-500);
        let tw;
        const punt = this.interactiu(g.x, g.y - 8, RADI_NPC, () => {
            if (tw) tw.pause();
            if (g.anims) { g.anims.stop(); if (g.setFrame) g.setFrame(0); }
            if (this.ineu) g.setFlipX(this.ineu.x < g.x);
            return DIALEGS.pallofa(Estat);
        }, { altura: g.displayHeight + 6 });
        tw = this.tweens.add({ targets: g, x: 900, duration: 6500, yoyo: true, repeat: -1, ease: 'Linear',
            onYoyo: () => g.setFlipX(true), onRepeat: () => g.setFlipX(false),
            onUpdate: () => { ombra.x = g.x; punt.x = g.x; } });
        punt.enTancar = () => {
            punt.actiu = () => false;
            this.tweens.killTweensOf(g);
            if (g.anims) g.anims.stop();
            this.tweens.add({ targets: [g, ombra], alpha: 0, duration: 400, onComplete: () => { g.destroy(); ombra.destroy(); } });
        };
    }
}

// ---------------- EL GRAN TIL·LER (escenari petit: només l'arbre amb qui es parla) ----------------
// Hi arriba el camí del sud (les cel·les). Cap a l'oest, un camí duu a la Caseta (on viu en Georgi); cap al nord-est, a la Cirosa, tancat
// per les arrels del Til·ler, que només s'enfonsen davant la seva branca.
const TIL_X = 520, TIL_Y = 510;

class ZonaTiller extends ZonaBase {
    constructor() {
        super('ZonaTiller', {
            pins: { pi: 0.3 },
            nom: 'El Gran Til·ler',
            amplada: 1400,
            alcada: 1000,
            entrades: {
                celles: { x: 700,  y: 940, dir: 'amunt' },
                cirosa: { x: 1170, y: 140, dir: 'avall' },
                georgi:  { x: 60,   y: 600, dir: 'dreta' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1400, 1000, -1100);
        this.terra('cami', 620, 520, 160, 480);           // des de les cel·les (sud)
        this.terra('cami', 0, 520, 1240, 150);            // d'oest a est: la Caseta i el camí de la Cirosa
        this.terra('cami', 1100, 0, 140, 670);            // cap a dalt a la dreta: la Cirosa

        // El Gran Til·ler
        // Fins que l'Ineu hi parla per primer cop és un arbre qualsevol, sense cara; la cara (el mateix dibuix, amb el mateix recorte) apareix a poc a poc
        this.tillerCara = Estat.flag('tillerCara') || Estat.flag('parlatTiler');          // les partides velles ja el coneixen
        this.posar('tiller_arbre', TIL_X, TIL_Y, { col: { w: 230, h: 44 } });
        this.tillerAmbCara = this.posar('tiller', TIL_X, TIL_Y).setDepth(TIL_Y + 0.1).setAlpha(this.tillerCara ? 1 : 0);
        const puntTiller = this.interactiu(TIL_X, TIL_Y + 25, 120, E => {
            const d = DIALEGS.tiller(E);
            if (this.tillerCara || !d.pagines || !d.pagines.length) return d;
            return Object.assign({}, d, { pagines: [{ fer: (z, fet) => z.despertarTiller(fet) }, ...d.pagines] });
        }, { altura: 230 });            // el «!» a l'alçada de la cara (més amunt quedava fora de la pantalla)
        puntTiller.cameraCossos = [this.tillerAmbCara];

        // Després del sopar queden tres espelmes vora les arrels del Til·ler
        if (Estat.flag('soparFet')) this.posarEspelmes();

        // La branca del Til·ler: el bastó
        this.branca = this.posar('arma_tiller', TIL_X + 100, TIL_Y + 110, { fonsY: TIL_Y });
        this.branca.setOrigin(0.5, 0.5).setAngle(68).setTint(0xffe8b0).setScale(this.branca.scaleX * 1.18);
        this.brancaAura = this.add.ellipse(this.branca.x, this.branca.y, 100, 24, 0xffd060, 0.25)
            .setAngle(this.branca.angle).setDepth(TIL_Y - 1);
        this.tweens.add({ targets: this.brancaAura, alpha: { from: 0.15, to: 0.38 }, scaleX: { from: 0.85, to: 1.15 }, yoyo: true, repeat: -1, duration: 900, ease: 'Sine.easeInOut' });
        this.tweens.add({ targets: this.branca, alpha: { from: 0.65, to: 1 }, yoyo: true, repeat: -1, duration: 800, ease: 'Sine.easeInOut' });
        this.interactiu(TIL_X + 100, TIL_Y + 115, RADI_OBJECTE, DIALEGS.branca, { altura: 60, actiu: () => Estat.flag('tillerBranca') && !Estat.te('basto_tiller') });
        // (només es veu un cop ha caigut: si no, en entrar es veuria un instant abans que el primer fotograma l'amagués)
        const brancaVisible = Estat.flag('tillerBranca') && !Estat.te('basto_tiller');
        this.branca.setVisible(brancaVisible); this.brancaAura.setVisible(brancaVisible);

        this.cartell(980, 470, DIALEGS.cartellCirosa);

        // El camí de la Cirosa: tancat per les arrels del Til·ler fins que reconeixen la seva branca
        this.arrels = [];
        if (Estat.flag('camiCirosaObert')) this.sortida(1100, 0, 140, 14, 'ZonaCamiCirosa', 'tiller');
        else this.posarArrels();

        this.arbres([[120, 870], [1320, 900]]);   // només dos arbres als cantons: el Til·ler es veu sol

        this.sortida(620, 986, 160, 14, 'ZonaCelles', 'tiller');
        this.sortida(0, 540, 14, 130, 'ZonaGeorgi', 'til');
    }

    // La primera vegada que l'examines: la cara es va dibuixant sobre l'escorça (un fos de transparència, lent)
    // La branca es desprèn de les capçades i cau: el Til·ler cruix, plouen fulles, la branca gira en l'aire, rebota a terra i s'hi queda amb una claror
    brancaCau(fet) {
        const x1 = this.branca.x, y1 = this.branca.y, x0 = TIL_X + 150, y0 = TIL_Y - 390;
        this.brancaCaient = true;
        const b = this.add.image(x0, y0, 'arma_tiller').setScale(this.branca.scaleX).setTint(0xffe8b0).setAngle(-30).setDepth(99000);
        // El cruixit de les capçades
        Sfx.xiu(1.6, 0.18, 'bandpass', 380, 1400, 1.4);
        this.cameras.main.shake(1100, 0.0022);
        for (let i = 0; i < 14; i++) {                                       // pluja de fulles
            const f = this.add.ellipse(TIL_X + (Math.random() - 0.5) * 260, TIL_Y - 340 + Math.random() * 60, 12, 20, i % 3 ? 0x6a9a3a : 0xe0b840, 1).setStrokeStyle(1.5, 0x4a5a1a).setDepth(99000).setAngle(Math.random() * 360);
            this.tweens.add({ targets: f, y: TIL_Y + 60 + Math.random() * 160, angle: f.angle + 360 + Math.random() * 360, duration: 1800 + Math.random() * 1400, delay: Math.random() * 900, ease: 'Sine.easeIn' });
            this.tweens.add({ targets: f, x: f.x + (Math.random() - 0.5) * 140, duration: 900, yoyo: true, repeat: 3, delay: Math.random() * 900, ease: 'Sine.easeInOut' });
            this.tweens.add({ targets: f, alpha: 0, delay: 2400 + Math.random() * 800, duration: 700, onComplete: () => f.destroy() });
        }
        this.time.delayedCall(1000, () => {
            Sfx.to(950, 160, 0.14, 'square', 0.22);                          // crac: la branca es trenca
            this.tweens.add({ targets: b, angle: { from: -30, to: 68 + 360 }, duration: 1150, ease: 'Quad.easeIn' });
            this.tweens.add({ targets: b, x: { from: x0, to: x1 }, duration: 1150, ease: 'Sine.easeOut' });
            this.tweens.add({ targets: b, y: y1, duration: 1150, ease: 'Quad.easeIn', onComplete: () => {
                Sfx.cop(true);                                                // impacte
                this.cameras.main.shake(260, 0.004);
                for (let k = 0; k < 7; k++) {                                // pols
                    const d = this.add.circle(x1 + (Math.random() - 0.5) * 60, y1 + 6, 10 + Math.random() * 8, 0xc8b890, 0.5).setDepth(y1 + 5);
                    this.tweens.add({ targets: d, x: d.x + (Math.random() - 0.5) * 120, y: d.y - 18 - Math.random() * 26, scale: 2.4, alpha: 0, duration: 900, onComplete: () => d.destroy() });
                }
                this.tweens.add({ targets: b, y: y1 - 34, angle: b.angle + 18, duration: 170, yoyo: true, ease: 'Sine.easeOut', onComplete: () => {
                    this.llum(x1, y1 - 14, 0xffe090);
                    Estat.posaFlag('tillerBranca');                          // ara ja hi és: es mostra la branca de terra (amb la seva claror) i es treu la que ha caigut
                    this.brancaCaient = false;
                    this.actualitzar();
                    b.destroy();
                    this.esperar(900, fet);
                } });
            } });
        });
    }

    despertarTiller(fet) {
        Sfx.secret();
        this.tweens.add({ targets: this.tillerAmbCara, alpha: 1, duration: 3200, ease: 'Sine.easeInOut',
            onComplete: () => { this.tillerCara = true; Estat.posaFlag('tillerCara'); this.esperar(500, fet); } });
    }

    // Arrels del Til·ler: grans arcs nuosos que surten de terra i tanquen el camí, amb fulles de til·ler a dalt.
    // L'arbre les hi va fer créixer perquè la boira no pugés; quan hi acostes la seva branca, la reconeixen i s'enfonsen.
    posarArrels() {
        const Y = 214;                                   // a dalt de tot: la part de dalt de les arrels toca la vora del món i tapa la sortida
        this.arrelsY = Y;
        let sd = 11; const r = () => (sd = sd * 16807 % 2147483647) / 2147483647;
        // Tota la mata d'arrels és sòlida (i arriba fins a la paret d'arbres de l'oest): no es pot passar per darrere
        this.colArrels = this.colisio(1140, Y - 67, 520, 144);
        this.muralla(0, 150, 960, 150, 110, 'arbre', true, x => x > 230);   // fins aquí, una paret invisible tanca el pas per l'oest (arbres només al canton, perquè el Til·ler quedi sol)
        if (this.textures.exists('arrels_tiller') && !Grafics.faltants.includes('arrels_tiller')) {
            const imatge = this.posar('arrels_tiller', 1180, Y);            // (de 960 a 1400: sencera dins l'escena i tapant tot el camí)
            this.arrels.push(imatge);
            this.tweens.add({ targets: imatge, scaleY: imatge.scaleY * 1.04, yoyo: true, repeat: -1, duration: 1600, ease: 'Sine.easeInOut' });
        } else {
            for (let i = 0; i < 11; i++) {
                const x = 1020 + i * 31 + r() * 10, y = Y + (i % 2) * 10, s = i % 2 ? 1 : -1;
                const amp = Math.min(50 + r() * 25, s > 0 ? 1380 - x : x - 980), alt = 60 + r() * 70;
                const g = this.add.graphics({ x, y }).setDepth(y);
                const pts = new Phaser.Curves.CubicBezier(new Phaser.Math.Vector2(0, 0), new Phaser.Math.Vector2(s * amp * 0.1, -alt * 1.3),
                    new Phaser.Math.Vector2(s * amp * 0.9, -alt * 1.3), new Phaser.Math.Vector2(s * amp, 0)).getPoints(18);
                g.fillStyle(0x000000, 0.3).fillEllipse(0, 2, 34, 10).fillEllipse(s * amp, 2, 30, 9);
                g.lineStyle(20, 0x120c08, 1).strokePoints(pts);
                g.lineStyle(14, 0x5e3e24, 1).strokePoints(pts);
                g.lineStyle(4, 0x8a6440, 0.9).strokePoints(pts.map(p => ({ x: p.x - 3, y: p.y - 3 })));
                const cim = pts[9];
                [[-10, -6, 0x5a8a32], [8, -10, 0x6a9a3a], [2, 2, 0x4e7a2c]].forEach(([fx, fy, c]) => {
                    g.fillStyle(c, 1).fillCircle(cim.x + fx - 3, cim.y + fy, 5).fillCircle(cim.x + fx + 3, cim.y + fy, 5).fillTriangle(cim.x + fx - 8, cim.y + fy + 2, cim.x + fx + 8, cim.y + fy + 2, cim.x + fx, cim.y + fy + 11);
                });
                this.arrels.push(g);
                this.tweens.add({ targets: g, scaleY: 1.04, yoyo: true, repeat: -1, duration: 1400 + i * 130, ease: 'Sine.easeInOut' });
            }
        }
        // Sense la branca, les arrels només es poden mirar; amb ella, es colpegen com qualsevol cosa (ESPAI)
        this.interactiu(1170, Y + 25, 130, DIALEGS.arrelsTiller, { altura: 150, actiu: () => !Estat.flag('camiCirosaObert') && !Estat.te('basto_tiller') });
    }

    // Cop de l'Ineu (combat.js) amb la branca del Til·ler a prop de les arrels
    alAtacar(jo, d) {
        if (!this.arrelsY || Estat.flag('camiCirosaObert') || !Estat.te('basto_tiller')) return;
        const px = jo.x + d.x * 60, py = jo.y + d.y * 60;
        if (Math.abs(px - 1180) > 280 || Math.abs(py - (this.arrelsY - 20)) > 110) return;
        Sfx.puf();
        this.arrels.forEach((g, i) => { this.tweens.add({ targets: g, scaleX: 1.12, yoyo: true, duration: 140, delay: i * 25 }); });
        this.cameras.main.shake(140, 0.003);
        this.impacte(px, py, d, 0);
        if (Estat.flag('bassadoriaNeta')) this.apartarArrels();
        else if (!this.avisArrels) { this.avisArrels = true; this.ui().obrirDialeg({ pagines: [DIALEGS.arrelsTiller(Estat).pagines[1]] }); }       // (s'estremeixen però no cedeixen: l'Ineu ho diu)
    }

    apartarArrels() {
        if (Estat.flag('camiCirosaObert')) return;
        Estat.posaFlag('camiCirosaObert');
        this.arrels.forEach((g, i) => {
            this.tweens.killTweensOf(g);
            if (g.setCrop) {
                // S'enfonsen de debò: la imatge baixa i la part que queda sota la línia de terra es retalla
                const Y = g.y, H = g.frame.height, esc = g.scaleY;
                g.setScale(g.scaleX, esc);
                const v = { t: 0 };
                this.tweens.add({ targets: v, t: 1, duration: 1800, delay: i * 140, ease: 'Sine.easeIn',
                    onUpdate: () => { g.setCrop(0, 0, g.frame.width, H * (1 - v.t)); g.y = Y + H * esc * v.t; },
                    onComplete: () => g.setVisible(false) });
                this.tweens.add({ targets: g, x: { from: g.x - 3, to: g.x + 3 }, yoyo: true, repeat: 8, duration: 90 });   // tremolen mentre baixen
            } else this.tweens.add({ targets: g, scaleY: 0, duration: 1300, delay: i * 140, ease: 'Sine.easeIn' });
        });
        const terra = this.add.particles(1190, this.arrelsY, 'espurna', {
            x: { min: -120, max: 120 }, speedY: { min: -80, max: -20 }, speedX: { min: -30, max: 30 }, lifespan: 700,
            scale: { start: 0.6, end: 0 }, tint: [0x5e3e24, 0x8a6440, 0x6a9a3a], frequency: 40
        }).setDepth(260);
        this.time.delayedCall(2200, () => terra.destroy());
        this.obstacles.remove(this.colArrels, true, true);
        Sfx.secret();
        this.cameras.main.shake(1200, 0.004);
        this.sortida(1100, 0, 140, 14, 'ZonaCamiCirosa', 'tiller');
        Estat.posaObjectiu("Els pastors desterrats de la Cirosa, pel camí del nord-est, guarden les esquelles dels seus avis.");
        Estat.desar();
    }

    posarEspelmes() {
        [TIL_X - 40, TIL_X + 15, TIL_X + 70].forEach((x, i) => {
            const e = this.posar('espelma', x, TIL_Y + 68 + (i % 2) * 6, { fonsY: TIL_Y + 20 });
            this.tweens.add({ targets: e, alpha: 0.8, yoyo: true, repeat: -1, duration: 300 + i * 70, delay: i * 90 });
        });
        this.interactiu(TIL_X + 10, TIL_Y + 75, RADI_GRAN, DIALEGS.espelmesTiller, { altura: 90 });
    }

    // Escena del sopar del Til·ler: cau el dia, la gent de les cel·les puja del sud i els pastors baixen del camí de la Cirosa
    fesSopar() {
        const vel = this.add.rectangle(AMPLE / 2, (ALT - ALT_HUD) / 2, AMPLE / ZOOM_CAMERA + 4, (ALT - ALT_HUD) / ZOOM_CAMERA + 4, 0x2a1000, 1).setScrollFactor(0).setDepth(89500).setAlpha(0);
        this.tweens.add({ targets: vel, alpha: 0.38, duration: 1600 });
        const taula = this.posar('taula_sopar', 400, 810, { fonsY: 800 }).setAlpha(0);
        this.tweens.add({ targets: taula, alpha: 1, duration: 1200 });
        this.npcs = this.npcs || {};
        const gent = [
            ['pastor_a', 1170, 60, 290, 880], ['pastor_b', 1170, 20, 400, 894], ['pastor_vell', 1170, -20, 510, 880],      // pel camí de la Cirosa
            ['meus', 700, 1000, 300, 760], ['venerables', 700, 1050, 600, 760], ['isilder', 700, 1100, 450, 764]                   // des de les cel·les (l'Isílder també hi és)
        ];
        const imatges = gent.map(([k, x0, y0, x, y], i) => {
            const img = this.posar(k, x0, y0, { fonsY: y0 });
            img.ombra = null;
            this.npcs['sopar_' + k] = img;
            this.time.delayedCall(400 + i * 350, () => this.npcVa('sopar_' + k, x, y, null, 170));
            return img;
        });
        this.time.delayedCall(4600, () => {
            this.ui().obrirDialeg(DIALEGS.tillerSoparRitual(Estat), () => Estat.desar());
        });
        this.sopar = { vel, taula, pastors: imatges, espelmes: [] };
    }

    // L'Ineu encén les espelmes (índexs 0-2) una a una, sobre la taula
    encendreEspelmes(llista, fet) {
        if (!this.sopar) { fet(); return; }
        this.seq(llista.map(i => c => {
            const x = 330 + i * 50, y = 790;
            const e = this.posar('espelma', x, y, { fonsY: 820 }).setAlpha(0);
            this.sopar.espelmes.push(e);
            this.tweens.add({ targets: e, alpha: 1, duration: 300 });
            this.llum(x, y - 30, 0xffd890);
            this.esperar(700, c);
        }), fet);
    }

    // El medalló de pedra que el Til·ler custodiava entre les branques cau de la capçada, giravoltant, fins a l'Ineu
    fullaCau(fet) {
        const clau = this.textures.exists('emblema_arbre') ? 'emblema_arbre' : null;
        const f = clau ? this.add.image(TIL_X, TIL_Y - 330, clau).setDisplaySize(52, 52).setDepth(99000) : this.add.circle(TIL_X, TIL_Y - 330, 18, 0xb8b2a4, 1).setDepth(99000);
        Sfx.xiu(1.0, 0.12, 'bandpass', 500, 1600, 1.4); this.cameras.main.shake(500, 0.0015);
        const cua = this.add.particles(0, 0, 'espurna', { follow: f, speed: { min: 5, max: 25 }, lifespan: 600, scale: { start: 0.35, end: 0 }, alpha: { start: 0.8, end: 0 }, tint: [0xd8f0a0, 0xffffff], frequency: 40, blendMode: 'ADD' }).setDepth(98999);
        this.tweens.add({ targets: f, angle: 720, duration: 2400 });
        this.tweens.add({ targets: f, x: { value: this.ineu.x, ease: 'Sine.easeInOut' }, y: this.ineu.y - 70, duration: 2400, ease: 'Quad.easeIn', onComplete: () => {
            f.destroy(); cua.stop(); this.time.delayedCall(700, () => cua.destroy()); Sfx.cop(false); this.llum(this.ineu.x, this.ineu.y - 70, 0xd8f0a0, fet);
        } });
    }

    acabarSopar() {
        if (!this.sopar) { this.posarEspelmes(); return; }
        const { vel, taula, pastors, espelmes } = this.sopar;
        this.time.delayedCall(800, () => {
            this.tweens.add({ targets: [vel, taula, ...pastors, ...espelmes], alpha: 0, duration: 2200, onComplete: () => { [taula, ...pastors, ...espelmes].forEach(o => o.destroy()); vel.destroy(); } });
            this.posarEspelmes();
        });
        this.sopar = null;
    }

    sincroFantasma() {
        if (this.fantasma) this.fantasma.setVisible(false);
    }

    actualitzar() {
        // La branca només es veu mentre encara no l'has agafada (i després que el Til·ler te l'hagi indicat)
        const visible = Estat.flag('tillerBranca') && !Estat.te('basto_tiller') && !this.brancaAgafada && !this.brancaCaient;
        this.branca.setVisible(visible);
        this.brancaAura.setVisible(visible);
    }
}

// ---------------- LA CASETA (a l'oest del Til·ler): on viu el Georgi de la Caseta ----------------
// Escenari petit: en Georgi al jardí, la seva casa (es pot entrar: només decorada) i la caseta aixecada sobre pilars
// de fusta, amb el cofre de les joguines on hi ha la maneta.
class ZonaGeorgi extends ZonaBase {
    constructor() {
        super('ZonaGeorgi', {
            pins: { pi: 0.25 },
            nom: 'La Caseta',
            amplada: 1100,
            alcada: 800,
            entrades: { til: { x: 1040, y: 580, dir: 'esquerra' }, caseta: { x: 860, y: 560, dir: 'avall' }, casa: { x: 380, y: 560, dir: 'avall' } }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1100, 800, -1100);
        this.terra('cami', 330, 500, 770, 150);            // del Til·ler (est) a la porta de la casa

        // La casa d'en Georgi (520 d'ample): la porta del mig duu a dins
        const masiaGeorgi = this.edifici('masia', 380, 480, 500, 76, 'ZonaCasaGeorgi', 'porta', { alt: 90 });
        this.portaMasia(masiaGeorgi, 380, 480);
        this.npc('georgi_caseta', 560, 590, DIALEGS.georgiCaseta);

        // La caseta, aixecada sobre pilars de fusta: s'hi puja per l'escala del mig (la maneta és a dins)
        // L'escala es puja caminant (paret a banda i banda i el dintell dalt, a l'altura de la terrassa); l'entrada a l'interior és dalt,
        // davant de la porta, no al peu de l'escala: allà és on hi ha la llum de la sortida
        const caseta = this.edifici('caseta_joc', 860, 500, 250, 64, null, null, { alt: 140 });
        this.sortida(860 - 32, 370, 64, 26, 'ZonaCasetaJoc', 'porta');
        const kT = 500 - caseta.displayHeight;      // la porta és a la terrassa, damunt dels pilars: s'obre quan l'Ineu s'acosta a l'escala
        this.portaAnimada({ x: 860, top: kT + caseta.displayHeight * 0.27 + 10, bottom: kT + caseta.displayHeight * 0.6 - 5, ample: caseta.displayWidth * 0.18, fons: 480, unic: true, retall: caseta });

        // Detalls de jardí
        this.posar('barril', 1010, 470, { col: { w: 40, h: 16 } });
        this.posar('llenya', 690, 470, { escala: 0.7, col: { w: 80, h: 20 } });
        this.posar('banc', 560, 720, { col: { w: 130, h: 22 } });
        [[650, 700], [720, 740], [140, 600]].forEach(([x, y]) => this.posar('flors', x, y, { fonsY: y - 10 }));
        this.cartell(1000, 720, () => ({ pagines: [{ qui: 'Cartell', text: 'La Caseta\n→ El Gran Til·ler' }] }));

        this.arbres([[80, 180], [250, 120], [600, 100], [1040, 160], [90, 680], [250, 760], [850, 760], [1040, 760]]);
        this.sortida(1086, 510, 14, 130, 'ZonaTiller', 'georgi');
    }

    // A l'escala de la caseta l'Ineu es veu per sobre de la façana (si no, el gràfic el tapa mentre puja)
    actualitzar() {
        const I = this.ineu;
        this.enEscala = !!I && I.x > 826 && I.x < 894 && I.y < 504 && I.y > 360;
        if (this.enEscala) { I.setDepth(481); if (this.ombraIneu) this.ombraIneu.setDepth(480.5); }
    }
    sincroFantasma() {
        super.sincroFantasma();
        if (this.enEscala && this.fantasma) this.fantasma.setAlpha(0);        // a l'escala es veu de debò, no per transparència
    }
}

// ---------------- CASA D'EN GEORGI (interior) ----------------
// Una casa de pagès endreçada i plena de vida, però buida: en Georgi és al jardí. Només es mira.
Object.assign(DIALEGS, {
    casaGeorgiEines: E => ({ pagines: [] }),
    casaGeorgiTaula: E => ({ pagines: [] }),
    casaGeorgiGat: E => ({ pagines: [] })
});

class ZonaCasaGeorgi extends ZonaBase {
    constructor() {
        super('ZonaCasaGeorgi', {
            nom: "Masia d'en Georgi",
            amplada: 900,
            alcada: 700,
            colorFons: '#140e0a',
            pacifica: true,
            entrades: { porta: { x: 450, y: 600, dir: 'amunt' } }
        });
    }

    construir() {
        const A = 900, H = 700;
        this.terra('rajola', 60, 40, 780, 660, -1100).setTint(0xc89a6a);
        // Paret de la masia: calç, bigues i sòcol de rajola blava i groga
        this.add.image(60, 0, 'paret_masia').setOrigin(0).setScale(1 / RES).setDepth(-995);
        const lat = this.add.graphics().setDepth(-990);
        lat.fillStyle(0x3a2412, 1).fillRect(30, 0, 30, H).fillRect(840, 0, 30, H);
        lat.fillStyle(0x000000, 0.25).fillRect(60, 200, 24, H - 200).fillRect(816, 200, 24, H - 200);
        this.colisio(30, H / 2, 60, H);
        this.colisio(A - 30, H / 2, 60, H);
        this.colisio(A / 2, 100, A - 120, 200);
        this.colisio(270, H - 10, 340, 20);
        this.colisio(630, H - 10, 340, 20);
        this.add.image(450, 470, 'estora_cela').setOrigin(0.5).setScale(1.2 / RES).setDepth(-1040);

        // Llar de foc de pedra amb l'olla, a l'esquerra, i la seva resplendor
        this.add.image(200, 214, 'llar_cela').setOrigin(0.5, 1).setScale(1.1 / RES).setDepth(-960);
        const foc = this.posar('foc', 200, 198, { fonsY: 212 });
        this.tweens.add({ targets: foc, scaleY: foc.scaleY * 1.1, scaleX: foc.scaleX * 0.94, yoyo: true, repeat: -1, duration: 260 });
        const resplendor = this.add.circle(200, 222, 170, 0xff9a30, 0.13).setDepth(300);
        this.tweens.add({ targets: resplendor, alpha: 0.22, scale: 1.05, yoyo: true, repeat: -1, duration: 430 });
        // Finestra amb un feix de llum, ristres d'alls i pebrots a la biga, i el tauler d'eines (amb el buit de la maneta)
        this.add.image(385, 178, 'finestra_cela').setOrigin(0.5, 1).setScale(1 / RES).setDepth(-990);
        const llum = this.add.graphics().setDepth(-900).setBlendMode('ADD');
        llum.fillGradientStyle(0xfff0c0, 0xfff0c0, 0xfff0c0, 0xfff0c0, 0.15, 0.15, 0, 0).fillTriangle(355, 178, 415, 178, 520, 470);
        llum.fillGradientStyle(0xfff0c0, 0xfff0c0, 0xfff0c0, 0xfff0c0, 0.15, 0, 0, 0).fillTriangle(355, 178, 520, 470, 430, 470);
        this.tweens.add({ targets: llum, alpha: 0.65, yoyo: true, repeat: -1, duration: 3600, ease: 'Sine.easeInOut' });
        this.add.image(480, 16, 'penjolls').setOrigin(0.5, 0).setScale(1 / RES).setDepth(-985);
        this.add.image(662, 40, 'tauler_eines').setOrigin(0.5, 0).setScale(1 / RES).setDepth(-985);
        this.interactiu(662, 214, RADI_OBJECTE, DIALEGS.casaGeorgiEines, { altura: 110 });

        // Taula de la cuina amb dues cadires, al mig
        this.add.image(450, 412, 'taula_cela').setOrigin(0.5, 1).setScale(1.3 / RES).setDepth(412);
        this.colisio(450, 390, 146, 40);
        [[362, 456, false], [538, 456, true]].forEach(([x, y, flip]) => {
            this.add.image(x, y, 'cadira_cela').setOrigin(0.5, 1).setScale(1.25 / RES).setFlipX(flip).setDepth(y);
            this.colisio(x, y - 8, 42, 16);
        });
        this.interactiu(450, 430, RADI_GRAN, DIALEGS.casaGeorgiTaula, { altura: 80 });

        // El llit, contra la paret de la dreta
        this.add.image(770, 440, 'llit_cela').setOrigin(0.5, 1).setScale(1.15 / RES).setDepth(440);
        this.colisio(770, 348, 130, 190);

        // El gat, adormit al cove, i un barril
        this.add.image(170, 590, 'gat_cove').setOrigin(0.5, 1).setScale(1 / RES).setDepth(590);
        this.colisio(170, 575, 96, 26);
        this.interactiu(170, 620, RADI_OBJECTE, DIALEGS.casaGeorgiGat, { altura: 70 });
        this.posar('barril', 790, 600, { col: { w: 46, h: 20 } });

        // Pols dins la llum de la finestra i un to càlid
        this.add.particles(0, 0, 'espurna', {
            emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(360, 200, 160, 260) },
            speedX: { min: -5, max: 5 }, speedY: { min: -6, max: 3 }, lifespan: 4200, scale: { start: 0.12, end: 0 }, alpha: { start: 0.7, end: 0 },
            tint: [0xfff0c0], frequency: 320, blendMode: 'ADD'
        }).setDepth(9000);
        this.add.rectangle(A / 2, H / 2, A, H, 0xffd38a, 0.05).setDepth(80000);
        this.sortida(410, H - 22, 80, 14, 'ZonaGeorgi', 'casa');
    }
}

// ---------------- LA CASETA DE JOC (interior) ----------------
class ZonaCasetaJoc extends ZonaBase {
    constructor() {
        super('ZonaCasetaJoc', {
            nom: 'Dins la caseta',
            amplada: 640,
            alcada: 520,
            colorFons: '#140e0a',
            pacifica: true,
            entrades: { porta: { x: 320, y: 440, dir: 'amunt' } }
        });
    }

    construir() {
        this.terra('taulons', 60, 40, 520, 440, -1100);
        // Parets de llistons pintats, amb franja de colors
        const murs = this.add.graphics().setDepth(-990);
        murs.fillStyle(0xe8c860, 1).fillRect(60, 0, 520, 130);
        murs.lineStyle(2, 0x8a5a20, 0.5); for (let x = 74; x < 580; x += 16) murs.lineBetween(x, 6, x, 124);
        murs.fillStyle(0xd86a5a, 1).fillRect(60, 124, 520, 10);
        murs.fillStyle(0x4a7a98, 1).fillRect(30, 0, 30, 520).fillRect(580, 0, 30, 520);
        // Paret de baix amb la porta al mig (x 280-360): el terra acaba a y 480 i la paret es veu i es toca des d'allà
        murs.fillStyle(0xe8c860, 1).fillRect(60, 480, 520, 40);
        murs.lineStyle(2, 0x8a5a20, 0.5); for (let x = 74; x < 580; x += 16) murs.lineBetween(x, 484, x, 518);
        murs.fillStyle(0xd86a5a, 1).fillRect(60, 480, 520, 6);
        murs.fillStyle(0x2a1a0c, 1).fillRect(280, 480, 80, 40);                                   // la porta, oberta
        murs.fillStyle(0xffd38a, 0.35).fillRect(284, 486, 72, 34);
        murs.lineStyle(5, 0x5a3a1e, 1).strokeRect(280, 480, 80, 40);
        this.colisio(30, 260, 60, 520);
        this.colisio(610, 260, 60, 520);
        this.colisio(320, 65, 640, 130);                                                          // la paret del fons (pintada fins a y 130)
        this.colisio(170, 500, 220, 40);
        this.colisio(470, 500, 220, 40);

        // Dos dibuixos d'infant penjats a la paret, a banda i banda de la finestreta, fets amb ceres: la família davant de casa i un arc de Sant Martí
        const paper = (x, y, w, h, rot, pinta) => {
            const g = this.add.graphics().setDepth(-980).setPosition(x + w / 2, y + h / 2).setRotation(rot);
            g.fillStyle(0xfff6e0, 1).fillRect(-w / 2, -h / 2, w, h).lineStyle(2, 0x3a2410, 1).strokeRect(-w / 2, -h / 2, w, h);
            g.fillStyle(0xe8c8a0, 0.9).fillRect(-9, -h / 2 - 4, 18, 9).fillRect(-9, h / 2 - 5, 18, 9);       // cinta adhesiva
            pinta(g, w, h);
        };
        const cera = (g, col, gruix) => g.lineStyle(gruix, col, 1);
        // 1. «La meva família»: sol amb cara, casa de teulada vermella, tres figures de pals de mides diferents, herba i una flor
        paper(112, 14, 78, 62, -0.04, (g, w, h) => {
            g.fillStyle(0xffd23a, 1).fillCircle(-24, -16, 9);
            cera(g, 0xffa81a, 2); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; g.lineBetween(-24 + Math.cos(a) * 12, -16 + Math.sin(a) * 12, -24 + Math.cos(a) * 18, -16 + Math.sin(a) * 18); }
            g.fillStyle(0x3a2410, 1).fillCircle(-27, -18, 1.2).fillCircle(-21, -18, 1.2); cera(g, 0x3a2410, 1.2); g.beginPath(); g.arc(-24, -14, 4, 0.2, Math.PI - 0.2); g.strokePath();
            g.fillStyle(0xe8603a, 1).fillRect(2, -2, 22, 18).fillStyle(0x9a3a2a, 1).fillTriangle(0, -2, 26, -2, 13, -16);
            g.fillStyle(0x4aa0d0, 1).fillRect(6, 3, 6, 6).fillStyle(0x7a4a2a, 1).fillRect(15, 7, 5, 9);
            g.fillStyle(0x6ab04a, 1).fillRect(-w / 2 + 3, h / 2 - 14, w - 6, 11);
            [[-28, 4, 1], [-16, 6, 0.8], [-4, 8, 0.55]].forEach(([x, y, e]) => {                              // pare, mare i nen (de pals)
                cera(g, 0x2a2a6a, 1.6); g.strokeCircle(x, y - 14 * e, 4 * e); g.lineBetween(x, y - 10 * e, x, y + 4 * e);
                g.lineBetween(x - 6 * e, y - 5 * e, x + 6 * e, y - 5 * e); g.lineBetween(x, y + 4 * e, x - 4 * e, y + 12 * e); g.lineBetween(x, y + 4 * e, x + 4 * e, y + 12 * e);
            });
            g.fillStyle(0xe84a8a, 1).fillCircle(28, h / 2 - 10, 3).lineStyle(1.5, 0x3a7a2a, 1).lineBetween(28, h / 2 - 7, 28, h / 2 - 2);
        });
        // 2. «El meu gat al Sant Martí»: un arc de set colors (el nen no sap comptar-los i en fa cinc), un núvol i un gat taronja amb bigotis
        paper(448, 18, 78, 62, 0.05, (g, w, h) => {
            ['#e8463a', '#f08a2a', '#ffd23a', '#6ab04a', '#4aa0d0'].forEach((c, i) => {
                g.lineStyle(3, Phaser.Display.Color.HexStringToColor(c).color, 1); g.beginPath(); g.arc(0, 10, 28 - i * 4, Math.PI, 0); g.strokePath();
            });
            g.fillStyle(0xffffff, 1).lineStyle(1.6, 0x6a8ab0, 1);
            [[-30, 10, 8], [-23, 8, 6], [-35, 12, 5]].forEach(([x, y, r]) => { g.fillCircle(x, y, r); g.strokeCircle(x, y, r); });
            [[30, 10, 8], [23, 8, 6], [35, 12, 5]].forEach(([x, y, r]) => { g.fillCircle(x, y, r); g.strokeCircle(x, y, r); });
            g.fillStyle(0xf0902a, 1).fillCircle(0, 16, 9).fillTriangle(-9, 10, -4, 3, -2, 10).fillTriangle(9, 10, 4, 3, 2, 10);      // el gat: cap amb dues orelles
            g.fillStyle(0x3a2410, 1).fillCircle(-3.5, 15, 1.3).fillCircle(3.5, 15, 1.3).fillStyle(0xe8607a, 1).fillCircle(0, 18, 1.2);
            cera(g, 0x3a2410, 1); g.lineBetween(-5, 18, -13, 16).lineBetween(-5, 19, -13, 20).lineBetween(5, 18, 13, 16).lineBetween(5, 19, 13, 20);
            g.fillStyle(0xffd23a, 1); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3 - Math.PI / 2; g.fillTriangle(0, -26, 4, -22, -4, -22); }   // un estel gran a dalt
        });
        const fin = this.add.graphics().setDepth(-980);
        fin.fillStyle(0x9ad0e8, 1).fillRect(290, 22, 60, 50).lineStyle(4, 0x5a3a1e, 1).strokeRect(290, 22, 60, 50).lineBetween(320, 22, 320, 72);

        // Catifa i joguines: taula i tamborets de la mida d'un nen, un cavallet i el cofre dels tresors
        const catifa = this.add.graphics().setDepth(-950);
        catifa.fillStyle(0x4a7a98, 1).fillRoundedRect(190, 250, 260, 150, 10);
        catifa.lineStyle(3, 0xf0d060, 1).strokeRoundedRect(198, 258, 244, 134, 8);
        this.posar('taula', 320, 330, { escala: 0.7, col: { w: 110, h: 22 } });
        this.posar('tamboret', 240, 360, { escala: 0.7, col: { w: 28, h: 12 } });
        this.posar('tamboret', 400, 360, { escala: 0.7, col: { w: 28, h: 12 } });

        // El cofre dels joguets, amb la maneta d'en Georgi a sota
        const maneta = () => Estat.te('maneta') || Estat.flag('maneta');
        const cofreJ = this.posar(maneta() ? 'cofre_joguines_obert' : 'cofre_joguines', 510, 222, { col: { w: 56, h: 20 } });       // tancat fins que se'n treu la maneta
        this.interactiu(510, 225, RADI_OBJECTE, DIALEGS.cofreManeta, { altura: 80, enTancar: () => { if (maneta()) cofreJ.setTexture('cofre_joguines_obert'); } });

        this.add.rectangle(320, 260, 640, 520, 0xffd38a, 0.05).setDepth(80000);
        this.sortida(280, 492, 80, 22, 'ZonaGeorgi', 'caseta');
    }
}

// ---------------- BOSC DE SANT JOAN ----------------
class ZonaBosc extends ZonaBase {
    constructor() {
        super('ZonaBosc', {
            fosca: true,
            nom: 'Bosc de Sant Joan',
            amplada: 1800,
            alcada: 1200,
            colorFons: '#1f3a1a',
            entrades: { celles: { x: 1740, y: 705, dir: 'esquerra' }, portal: { x: 330, y: 870, dir: 'avall' } }
        });
    }

    construir() {
        let llavor = 11;
        const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
        this.terra('herba_fosca', 0, 0, 1800, 1200, -1100);
        this.terra('cami', 880, 640, 920, 130);          // camí des de les cel·les fins a la font
        this.terra('pedra', 780, 520, 260, 230);         // clariana de pedra de la font

        // Font del Bisbe (missió de la font)
        this.posar('font_sj', 910, 610, { col: { w: 150, h: 50 } });
        this.interactiu(910, 625, RADI_GRAN * 1.5, DIALEGS.fontSJ, { altura: 170 });

        // Alzina Buida: el portal ocult cap a la cabana de la Joaneta. És el doble de gran que els altres arbres, té la seva
        // pròpia clariana (llum verda a terra, llumenetes i pedres) i el forat del tronc fa claror: no es pot confondre amb la resta.
        const AX = 330, AY = 780;
        this.add.ellipse(AX, AY + 40, 760, 380, 0x8fe08a, 0.13).setDepth(-1090);
        this.add.ellipse(AX, AY + 40, 480, 220, 0xb8f0a0, 0.13).setDepth(-1089);
        this.alzina = this.posar('alzina_buida', AX, AY, { col: { w: 150, h: 46 } });
        // El punt d'interacció és el forat del tronc (la «!» surt just damunt seu); el radi permet tocar-lo des del peu de l'alzina
        this.interactiu(AX - 18, AY - 128, 235, DIALEGS.alzinaBuida, {
            altura: 56,
            enTancar: () => { if (Estat.flag('portalJoaneta')) this.canviarZona('ZonaCabana', 'portal'); }
        });
        [[-250, 75, 0.7], [255, 45, 0.55], [-120, 120, 0.4]].forEach(([dx, dy, e]) => this.posar('roca', AX + dx, AY + dy, { escala: e, col: { w: 34, h: 14 } }));
        this.claror = this.add.ellipse(AX - 18, AY - 128, 78, 104, 0x6aff9a, 0.45).setDepth(AY + 1);
        this.tweens.add({ targets: this.claror, alpha: 0.18, scaleX: 1.2, scaleY: 1.12, yoyo: true, repeat: -1, duration: 1500, ease: 'Sine.easeInOut' });
        // Halo que batega al voltant del forat: crida l'atenció sense tapar el dibuix
        const halo = this.add.circle(AX - 18, AY - 128, 70, 0xb8ffc0, 0).setStrokeStyle(4, 0xd8ffd0, 0.8).setBlendMode(Phaser.BlendModes.ADD).setDepth(AY + 2);
        this.tweens.add({ targets: halo, scale: { from: 0.55, to: 1.5 }, alpha: { from: 0.9, to: 0 }, repeat: -1, duration: 1900, ease: 'Sine.easeOut' });
        this.add.particles(AX, AY - 90, 'espurna', {
            x: { min: -230, max: 230 }, y: { min: -120, max: 60 }, speedX: { min: -8, max: 8 }, speedY: { min: -14, max: -3 }, lifespan: 3200,
            scale: { start: 0.28, end: 0 }, alpha: { start: 0.9, end: 0 }, tint: [0xbaffb0, 0xf2ffc0], frequency: 260, blendMode: 'ADD'
        }).setDepth(AY + 2);
        this.boiraAmbient(AX, AY - 20, 300, 60, 0.5);

        // Herbes de la Nit de Sant Joan (les altres dues ofrenes de la font: el romaní, al Bosc del Pi dels Tres Cants, i una pruna de la Prunera): cal trobar-la entre els arbres. És en una clariana, més gran que abans,
        // amb un halo a terra, espurnes i una columna de llum tènue que es veu per sobre de les copes.
        this.herbes = [];
        // (el romaní, ara, és al Bosc del Pi dels Tres Cants: bosc_pi.js)
        [[1, 'herba de Sant Joan', 'herba_sj', 720, 290]].forEach(([n, nom, key, x, y]) => {
            const halo = this.add.ellipse(x, y - 10, 96, 44, 0xfff0a0, 0.3).setDepth(y - 1);
            this.tweens.add({ targets: halo, alpha: 0.08, scale: 1.35, yoyo: true, repeat: -1, duration: 1100 });
            const raig = this.add.rectangle(x, y - 110, 30, 220, 0xfff4b0, 0.12).setDepth(9500);
            this.tweens.add({ targets: raig, alpha: 0.04, yoyo: true, repeat: -1, duration: 1400 });
            const img = this.posar(key, x, y);
            this.tweens.add({ targets: img, scaleY: img.scaleY * 1.05, yoyo: true, repeat: -1, duration: 900 });
            const espurnes = this.add.particles(x, y - 14, 'espurna', {
                x: { min: -30, max: 30 }, y: { min: -10, max: 10 }, speedY: { min: -46, max: -16 }, lifespan: 1600,
                scale: { start: 0.38, end: 0 }, alpha: { start: 1, end: 0 }, tint: [0xfff2a0, 0xffffff], frequency: 260, blendMode: 'ADD'
            }).setDepth(9501);
            // Fins que no es llegeix la font (fontVista) no se sap què cal portar-hi: ni es veuen les herbes ni s'hi pot interactuar
            espurnes.stop();
            this.interactiu(x, y, RADI_OBJECTE, DIALEGS.herba(n, nom, key), { altura: 70, actiu: () => !Estat.flag('herba' + n) && Estat.flag('fontVista') });
            this.herbes.push({ img, halo, raig, espurnes, flag: 'herba' + n });
        });

        // Bosc dens: arbres en graella amb petits desplaçaments, deixant lliures el camí i els llocs importants
        // (els arbres es dibuixen davant segons la y: una herba o un cartell queda tapat per les copes dels arbres que té al sud,
        // per això les clarianes són amples i el cartell en té una de més a sota)
        const lliure = [[200, 180, 170], [900, 650, 250], [AX, AY - 40, 480], [720, 290, 210], [560, 1020, 210], [1700, 700, 240], [1520, 600, 190], [1520, 830, 210]];
        for (let y = 80; y < 1180; y += 150) {
            for (let x = 70; x < 1760; x += 170) {
                const px = x + (rnd() - 0.5) * 90, py = y + (rnd() - 0.5) * 70;
                if (py > 600 && py < 790 && px > 880) continue;                              // camí
                if (lliure.some(([lx, ly, r]) => Math.hypot(px - lx, py - ly) < r)) continue;
                this.posar('arbre', px, py, { col: { w: 34, h: 16 } });
            }
        }

        [[600, 400], [1300, 300], [1200, 900], [1550, 450]].forEach(([x, y]) => this.enemic('escolopendra', x, y));
        [[450, 720], [1400, 720]].forEach(([x, y]) => this.enemic('bolet', x, y));        // bolets: al bosc
        // El cartell, a la vora del camí d'entrada, en una zona sense arbres que el tapin
        this.cartell(1520, 600, DIALEGS.cartellBosc);
        this.sortida(1786, 640, 14, 130, 'ZonaCelles', 'bosc');

        // La boira lila del mal: cobreix tot el bosc mentre la Font del Bisbe estigui adormida; en netejar-la, se'n va
        this.boires = [];
        if (!Estat.flag('fontNeta')) {
            for (let gy = 140; gy < 1200; gy += 250) for (let gx = 140; gx < 1800; gx += 290) {
                if (Math.hypot(gx - AX, gy - AY) < 260) continue;                            // l'Alzina Buida és un lloc a part: aire net
                this.boires.push(this.boira(gx + rnd() * 120, gy + rnd() * 90, 260, 110, 0.8));
            }
            this.llumLila = this.add.rectangle(AMPLE / 2, (ALT - ALT_HUD) / 2, AMPLE / ZOOM_CAMERA + 4, (ALT - ALT_HUD) / ZOOM_CAMERA + 4, 0x3a1a55, 0.17).setScrollFactor(0).setDepth(90001);
        }
        this.add.rectangle(AMPLE / 2, (ALT - ALT_HUD) / 2, AMPLE / ZOOM_CAMERA + 4, (ALT - ALT_HUD) / ZOOM_CAMERA + 4, 0x102810, 0.18).setScrollFactor(0).setDepth(90000);
    }

    // L'Ineu acaba de collir l'herba n: el seu dibuix desapareix del terra a l'instant (la icona que s'alça en passa a ser l'única)
    herbaAgafada(n) {
        const h = this.herbes.find(q => q.flag === 'herba' + n);
        if (!h) return;
        h.agafada = true;
        h.img.setVisible(false); h.halo.setVisible(false); h.raig.setVisible(false); h.espurnes.stop();
    }

    actualitzar(ara) {
        this.herbes.forEach(h => {
            const visible = !Estat.flag(h.flag) && Estat.flag('fontVista') && !h.agafada;
            h.img.setVisible(visible); h.halo.setVisible(visible); h.raig.setVisible(visible);
            if (visible && !h.encesa) { h.encesa = true; h.espurnes.start(); }
            if (!visible && h.encesa && !h.apagada) { h.apagada = true; h.espurnes.stop(); }
        });
        // La font s'ha netejat: la boira lila se'n va (deixa de néixer i el to lila s'esvaeix)
        if (Estat.flag('fontNeta') && this.boires.length) {
            this.boires.forEach(b => b.stop());
            this.boires = [];
            if (this.llumLila) this.tweens.add({ targets: this.llumLila, alpha: 0, duration: 3500 });
        }
        // I l'aigua de la font brilla
        if (Estat.flag('fontNeta') && !this.fontBrilla) {
            this.fontBrilla = this.add.particles(910, 575, 'espurna', {
                x: { min: -45, max: 45 }, y: { min: -10, max: 10 }, speedY: { min: -22, max: -6 }, lifespan: 1500,
                scale: { start: 0.3, end: 0 }, alpha: { start: 0.9, end: 0 }, tint: [0xbfe8ff, 0xffffff], frequency: 280, blendMode: 'ADD'
            }).setDepth(700);
        }
    }
}
