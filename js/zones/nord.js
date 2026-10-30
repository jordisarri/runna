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

        const PORTA_X = 400, BASE_Y = 900, PORTA_AMPLE = 98;
        const sala = this.posar('sala_pingpong', 0, BASE_Y, { fonsY: BASE_Y - 20 });
        const mig = PORTA_X - 0.748 * sala.displayWidth;             // x de la vora esquerra de la imatge (la porta és al 74,8% de l'ample)
        sala.setX(mig + sala.displayWidth / 2);
        sala.setCrop(-mig / sala.scaleX, 0, sala.width + mig / sala.scaleX, sala.height);
        const dreta = mig + sala.displayWidth * 0.99;                 // vora dreta de la paret
        this.colisio((PORTA_X - PORTA_AMPLE / 2) / 2, BASE_Y - 45, PORTA_X - PORTA_AMPLE / 2, 90);
        this.colisio((PORTA_X + PORTA_AMPLE / 2 + dreta) / 2, BASE_Y - 45, dreta - PORTA_X - PORTA_AMPLE / 2, 90);
        this.colisio(PORTA_X, BASE_Y - 100, PORTA_AMPLE, 20);
        this.sortida(PORTA_X - PORTA_AMPLE / 2, BASE_Y - 80, PORTA_AMPLE, 76, 'ZonaPingpong', 'porta');
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
            fosca: function () { return this.nit && this.nit.visible; },
            nom: 'Les Runes',
            amplada: 1600,
            alcada: 1100,
            entrades: {
                celler:   { x: 800,  y: 1040, dir: 'amunt' },
                placa:    { x: 800,  y: 1040, dir: 'amunt' },   // (partides desades d'abans del Pati del Celler)
                pingpong: { x: 800,  y: 1040, dir: 'amunt' },
                celles:   { x: 800,  y: 70,   dir: 'avall' },
                cami:     { x: 60,   y: 915,  dir: 'dreta' },
                cementiri:{ x: 1530, y: 585,  dir: 'esquerra' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1600, 1100, -1100);
        this.terra('pedra', 150, 640, 1300, 320);       // replà de pedra
        this.terra('cami', 700, 0, 200, 660);           // cap al nord (cel·les i Til·ler)
        this.terra('cami', 700, 940, 200, 160);         // cap al Pati del Celler i la Plaça
        this.terra('cami', 0, 850, 800, 130);           // camí de la Desaparició (oest)
        this.terra('cami', 1100, 520, 500, 130);        // cap al cementiri (est, darrere el Santuari)

        // Les runes, a la dreta; el camí passa per davant
        this.terra('pedra', 900, 400, 700, 240);         // replà de pedra de les runes
        // Façana gran (760 d'ample): surt per dalt de la pantalla, no importa que no es vegi sencera
        this.posar('runes', 1300, 470, { col: { w: 640, h: 80 } });
        this.blocDarrere(1270, 660, 390);               // no es pot passar per darrere de les runes
        // Pedres caigudes davant i, a ponent, carreus escampats de l'església que mai no es va acabar
        [[950, 525, 0.6], [1570, 530, 0.5], [240, 700, 0.8], [420, 760, 0.55], [330, 1040, 0.7], [560, 640, 0.5], [130, 560, 0.65]]
            .forEach(([x, y, e]) => this.posar('roca', x, y, { escala: e, col: { w: 60 * e, h: 22 * e } }));
        // El pergamí partit entre dues pedres: s'agafa i passa al sarró
        if (!Estat.flag('fragment1')) {
            // Dins de les runes, sobre els carreus caiguts davant del portal esfondrat (per sobre de l'sprite de les runes)
            this.pergamiRunes = this.posar('pergami_partit', 1275, 452, { fonsY: 480, escala: 0.75 });
            this.pergamiBrill = this.add.circle(1275, 430, 40, 0xffe8a0, 0.2).setDepth(479).setBlendMode('ADD');
            this.tweens.add({ targets: this.pergamiBrill, alpha: 0.05, scale: 1.3, yoyo: true, repeat: -1, duration: 900 });
            this.interactiu(1275, 500, RADI_OBJECTE, DIALEGS.ruines, { altura: 60, actiu: () => !Estat.flag('fragment1') });
        } else if (!Estat.te('fragment1')) Estat.dona('fragment1');          // partides desades d'abans del pergamí físic

        // L'ombra del monjo: només es veu quan has llegit el primer fragment del pergamí
        this.apareix = 1;            // 0..1: com de present és l'ombra (la primera vegada es materialitza lentament)
        this.ombraMonjo = this.add.image(1100, 560, 'ombra_monjo').setOrigin(0.5, 1)
            .setScale((this.textures.get('ombra_monjo').customData.escala || 0.5)).setDepth(560).setAlpha(0);
        this.interactiu(1100, 600, RADI_OBJECTE, DIALEGS.ombraMonjo, { altura: 210, actiu: () => Estat.flag('fragment1'), enTancar: () => Estat.posaFlag('flauta_ombra') });
        this.llocFlauta('ombra', 1100, 610, 160, true, () => !Estat.flag('benedicioMonjo'));    // un cop t'ha beneït, ESPAI hi parla
        this.tweens.add({ targets: this.ombraMonjo, y: 564, yoyo: true, repeat: -1, duration: 2400, ease: 'Sine.easeInOut' });
        // Ambient de nit quan la llegenda s'ha començat a descobrir
        this.nit = this.add.rectangle(AMPLE / 2, (ALT - ALT_HUD) / 2, AMPLE / ZOOM_CAMERA + 4, (ALT - ALT_HUD) / ZOOM_CAMERA + 4, 0x0a0a30, 0.22).setScrollFactor(0).setDepth(89000).setVisible(false);

        this.cartell(620, 960, DIALEGS.cartellRuinesPingpong);

        this.arbres([[1530, 1020], [1100, 1030], [120, 180], [380, 120], [250, 420], [1500, 160]]);

        // Animalets del cementiri esquerdat
        this.enemic('escolopendra', 300, 600);
        this.enemic('escolopendra', 1350, 620);
        this.sortida(700, 1086, 200, 14, 'ZonaCellerFora', 'runes');
        this.sortida(700, 0, 200, 14, 'ZonaCelles', 'ruines');
        this.sortida(0, 850, 14, 130, 'ZonaCami', 'runes');
        this.sortida(1586, 520, 14, 130, 'ZonaCementiri', 'runes');
    }

    // El pergamí vola cap a l'Ineu i passa al sarró
    agafarPergamiRunes(fet) {
        const s = this.pergamiRunes;
        if (!s) { fet(); return; }
        Sfx.objecte();
        if (this.pergamiBrill) { this.pergamiBrill.destroy(); this.pergamiBrill = null; }
        this.ajupir('ineu', null, 300);
        this.tweens.add({ targets: s, x: this.ineu.x, y: this.ineu.y - 70, scale: s.scale * 0.5, alpha: 0.2, duration: 650, ease: 'Sine.easeIn', onComplete: () => {
            s.destroy(); this.pergamiRunes = null;
            Estat.dona('fragment1'); this.ui().actualitzarHUD();
            this.llum(this.ineu.x, this.ineu.y - 70, 0xffe8a0);
            this.esperar(300, fet);
        } });
    }

    // El Cant de les Pedres, tocat davant l'ombra, li desperta la memòria
    enMelodia(nom) {
        if (nom !== 'pedres' || !Estat.flag('fragment1')) return false;
        if (Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, 1100, 600) > 300) return false;
        if (Estat.flag('benedicioMonjo')) { this.missatge("L'ombra assenteix."); return true; }
        if (!['fragment1', 'fragment2', 'alcuiLlegit'].every(f => Estat.flag(f))) return false;
        this.ui().obrirDialeg(DIALEGS.benedicioMonjo(Estat), () => Estat.desar());
        return true;
    }

    // El moment en què es llegeix el primer fragment: cau la nit de cop i l'ombra del monjo es materialitza sobre el mur
    aparicioOmbra(fet) {
        this.apareix = 0; this.ombraVista = true;
        Sfx.secret && Sfx.secret();
        this.cameras.main.shake(400, 0.002);
        this.nit.setVisible(true).setAlpha(0);
        this.tweens.add({ targets: this.nit, alpha: 0.5, duration: 1600, onComplete: () => this.tweens.add({ targets: this.nit, alpha: 0.22, duration: 1600 }) });   // cau la nit de cop i s'assosseguen
        this.tweens.add({ targets: this, apareix: 1, duration: 3000, delay: 400, onStart: () => this.llum(this.ombraMonjo.x, this.ombraMonjo.y - 150, 0xd8c8ff), onComplete: () => { if (fet) fet(); } });
    }

    // L'ombra aixeca el cap i es fa més clara un moment
    ombraReacciona(fet) {
        this.ombraForta = true;
        this.tweens.add({ targets: this.ombraMonjo, scaleX: this.ombraMonjo.scaleX * 1.06, scaleY: this.ombraMonjo.scaleY * 1.06, yoyo: true, duration: 700, onComplete: () => { this.ombraForta = false; if (fet) fet(); } });
        this.llum(this.ombraMonjo.x, this.ombraMonjo.y - 150, 0xd8c8ff);
    }

    actualitzar() {
        const visible = Estat.flag('fragment1') || this.ombraVista;
        this.nit.setVisible(visible);
        // L'ombra apareix i desapareix lentament, com una respiració
        const alfa = visible ? (this.ombraForta ? 0.95 : 0.55 + 0.25 * Math.sin(this.time.now / 900)) * this.apareix : 0;
        this.ombraMonjo.setAlpha(Math.max(0, alfa));
    }
}

// ---------------- EL CELLER (interior; el ping-pong hi és una prova circumstancial) ----------------
// Una sala petita, que es veu sencera d'una ullada: l'arcada amb la roda i la porta secreta al fons, una taula de ping-pong al mig
// amb en Juli i en Frederic, i en Jusef al costat
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
        this.portaSecreta = this.portaAnimada({ x: AX, top: PY - 44, bottom: YP, ample: PR * 2, arc: 44, fons: -979, color: 0x5e574c, vora: 0x1a1612, bloq: () => !this.rodaMoguda });
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
        this.posar('taula_pp', AX, 600, { col: { w: 220, h: 40 } });
        this.npc('juli', AX - 160, 600, DIALEGS.juli);
        this.npc('frederic', AX + 160, 600, DIALEGS.frederic, { flipX: true });
        this.npc('josep', AX + 170, 740, DIALEGS.josep, { flipX: true });

        this.add.rectangle(W / 2, A / 2, AI, A, 0xffe9a8, 0.04).setDepth(80000);
        this.sortida(W / 2 - 40, A - 30, 80, 20, 'ZonaCellerFora', 'pingpong');
    }

    enEntrar() {
        this.physics.add.collider(this.ineu, this.colRoda, (ineu, zona) => {
            this.contacteRoda = this.time.now;
            this.costatRoda = ineu.x < zona.x ? 1 : -1;
        });
    }

    // L'Ineu empeny la roda si és a un costat i avança contra ella; amb els Guants de Poder es mou, sense pesa massa
    actualitzar(ara, delta) {
        if (this.rodaMoguda) return;
        const ui = this.ui(), c = this.cursors, t = this.tecles;
        const dirX = (c.right.isDown || t.D.isDown ? 1 : 0) - (c.left.isDown || t.A.isDown ? 1 : 0) || Math.sign(ui.vectorTactil.x > 0.3 ? 1 : ui.vectorTactil.x < -0.3 ? -1 : 0);
        const toca = this.time.now - this.contacteRoda < 120 && Math.abs(this.ineu.x - this.colRoda.x) > 50 && dirX === this.costatRoda;
        this.empentaMs = toca ? this.empentaMs + delta : 0;
        if (this.empentaMs < 600) return;
        this.empentaMs = 0;
        if (!Estat.te('guants')) {
            if (!this.pistaRoda) { this.pistaRoda = true; this.missatge('Pesa massa... calen unes mans més fortes.'); }
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
        this.terra('cami', 0, 640, 1800, 130);           // camí est-oest: del bosc de Sant Joan fins a Sant Benet (a l'est no hi ha res més)
        this.terra('cami', 800, 770, 200, 330);          // cap a les Runes
        this.terra('cami', 1000, 0, 140, 640);           // cap al nord, al Gran Til·ler

        // Nostra Senyora (oest, l'edifici més gran: la porta és més alta que l'Ineu) i Sant Benet (est)
        const ns = this.posar('cel_ntrasra', 520, 600, { col: { w: 840, h: 100 } });
        this.blocDarrere(520, 840, 495, Math.max(0, 600 - ns.displayHeight));
        this.interactiu(520, 625, RADI_OBJECTE, DIALEGS.cel_ntrasra, { altura: 140 });
        // Sant Benet, a la mida dels personatges (portes una mica més baixes que l'Ineu): és tan llarg que surt per la dreta de l'escena.
        // Comença passat el camí del Til·ler; només se'n veu la porta de l'esquerra (la de la dreta queda fora)
        const SB0 = 1160, sb = this.posar('cel_stbenet', SB0, 600);
        sb.setX(SB0 + sb.displayWidth / 2);
        this.colisio((SB0 + 1800) / 2, 555, 1800 - SB0, 90);
        this.blocDarrere((SB0 + 1800) / 2, 1800 - SB0, 505, Math.max(0, 600 - sb.displayHeight));
        this.interactiu(SB0 + sb.displayWidth * 0.251, 620, RADI_OBJECTE, DIALEGS.portaFlam, { altura: 140 });    // porta de l'esquerra: on dormia el Flami

        // Sant Benet (est): la Neus i el seu marit, el senyor Moliner, veïns de Sant Benet
        this.npc('neus', 1250, 680, DIALEGS.neus);
        this.npc('marit_neus', 1320, 700, DIALEGS.maritNeus);
        // Les dues Venerables Sàvies (agafades del braç, un sol gràfic): donen consells
        this.npc('venerables', 815, 700, DIALEGS.venerables, { colAmple: 100 });
        // Nostra Senyora (oest): la Carry, vídua del campaner, que busca el seu gos Pallofa (el trobaràs a Sant Antoni)
        this.npc('carry', 360, 690, DIALEGS.carry);

        // La Sansa i el seu carro de verdures: passa per aquí un sol cop, quan l'Isidre te n'ha parlat, i se'n va un cop t'ha donat la llavor
        if (Estat.flag('isidreSansa') && !Estat.flag('llavorSansa')) this.posarSansa();

        this.cartell(130, 625, () => ({ pagines: [{ qui: 'Cartell', text: '← Bosc de Sant Joan\n← Font del Bisbe\n↑ El Gran Til·ler' }] }));

        this.arbres([[260, 1000], [300, 1040],
                     [1250, 1020], [1480, 960], [1700, 1030]]);

        this.sortida(800, 1086, 200, 14, 'ZonaRuines', 'celles');
        this.sortida(0, 640, 14, 130, 'ZonaBosc', 'celles');
        // El camí del Gran Til·ler, al nord, és tapat per una boira espessa que no marxa amb el vent: la desfà el beuratge de la Jaumeta
        this.boiraTiller = null;
        if (Estat.flag('boiraTillerNeta') || Estat.flag('parlatTiler')) this.sortida(1000, 0, 140, 14, 'ZonaTiller', 'celles');
        else this.posarBoiraTiller();
    }

    posarBoiraTiller() {
        const X = 1070, Y = 300;
        this.colBoira = this.colisio(X, Y, 360, 90);
        this.fosc = this.add.ellipse(X, Y, 470, 190, 0x2a1550, 0.42).setDepth(Y + 40);
        this.boiraTiller = [-150, -50, 50, 150].map(dx => this.boira(X + dx, Y, 190, 120, 2.4));
        this.interactiu(X, Y + 80, RADI_GRAN, DIALEGS.boiraTiller, {
            altura: 150, actiu: () => !!this.boiraTiller,
            enTancar: () => { if (Estat.te('beuratge')) this.esvairBoira(); }
        });
    }

    esvairBoira() {
        if (!this.boiraTiller) return;
        Estat.posaFlag('boiraTillerNeta'); Estat.treu('beuratge');
        this.boiraTiller.forEach(b => b.stop());
        this.boiraTiller = null;
        this.tweens.add({ targets: this.fosc, alpha: 0, duration: 2600, onComplete: () => this.fosc.destroy() });
        this.obstacles.remove(this.colBoira, true, true);
        this.cameras.main.shake(400, 0.003);
        Sfx.secret();
        this.sortida(1000, 0, 140, 14, 'ZonaTiller', 'celles');
        this.missatge('El camí del Til·ler és lliure.');
        Estat.posaObjectiu("El camí al nord de les Cel·les s'ha aclarit: el Gran Til·ler hi és al capdamunt.");
        Estat.desar();
    }

    posarSansa() {
        this.carroSansa = this.posar('carro_sansa', 1060, 880);
        this.colCarro = this.colisio(1060, 855, 200, 50);
        this.sansa = this.posar('sansa', 1160, 890);
        this.colSansa = this.colisio(1160, 881, 40, 18);
        this.add.image(1160, 890, 'ombra').setScale(0.42).setDepth(-500);
        const punt = this.interactiu(1160, 880, RADI_NPC, DIALEGS.sansa, { altura: this.sansa.displayHeight + 6 });
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

// ---------------- CEL·LES DE SANT ANTONI ----------------
// A llevant del Monestir. Hi passeja el Germà Francesc, monjo del Monestir que cuida les flors del cementiri: per un favor
// (portar-hi el seu ram), et dona els Guants de Poder, els que mouen la roda del Celler. L'Huri, el primer nen desaparegut, hi venia a robar figues.
Object.assign(DIALEGS, {
    portaFlam: E => ({ pagines: [] }),
    portaUri: E => ({ pagines: [] }),
    cel_ntrasra: E => ({ pagines: [] }),
    cel_stantoni: E => ({ pagines: [] }),

    germaFrancesc: E => {
        if (E.te('guants')) return { pagines: [
            { qui: 'Germà Francesc', text: 'Els guants et queden grans, eh? Ja hi creixeràs. Fes-los servir per moure el que pesa, no per empènyer la gent.' }
        ] };
        if (E.flag('florsCreu')) return {
            pagines: [
                { qui: 'Germà Francesc', text: 'Les has deixades a l\'àngel? Que Déu t\'ho pagui, fill. Els monjos d\'abans ja deuen estar contents: algú encara se\'n recorda.' },
                { qui: 'Germà Francesc', text: 'Té. Són els guants de picapedrer dels monjos antics: amb ells van aixecar les pedres del Santuari. Jo ja no tinc força per fer-los servir, però tu sí.' },
                { avis: 'Has obtingut els GUANTS DE PODER!' },
                { qui: 'Germà Francesc', text: 'Diuen que, posats, un noi pot moure una roda de carro com si fos de suro. Jo no ho he vist mai. Però mai no havia vist una boira com aquesta, tampoc.' }
            ],
            enAcabar: () => {
                E.dona('guants');
                if (E.flag('josepVencut') && !E.flag('rodaMoguda')) E.posaObjectiu("Els Guants de Poder deuen poder amb la roda de carruatge del Celler, entre la Plaça i les Runes.");
            }
        };
        if (E.te('ram')) return { pagines: [
            { qui: 'Germà Francesc', text: 'El ram, a la tomba de l\'àngel de pedra, a la dreta del Cementiri, fill. Darrere el Monestir, camí amunt. I compte amb les bestioles.' }
        ] };
        return {
            pagines: [
                { qui: 'Germà Francesc', text: 'Ineu... Bon dia, fill. Ja et deixen créixer?' },
                { qui: 'Germà Francesc', text: 'Perdona que no camini de pressa: aquests genolls ja tenen més anys que el campanar.' },
                { qui: 'Germà Francesc', text: 'Jo visc al Monestir, però cada matí baixo a passejar fins a Sant Antoni. L\'Huri, el de Sant Benet, em venia a robar figues i jo feia veure que no el veia. Fa dos dies que la figuera és plena.' },
                { qui: 'Germà Francesc', text: 'Cada setmana porto flors a l\'àngel del Cementiri, per als monjos que hi dormen. Però amb aquesta boira no hi arribo: les cames no em responen i les bestioles no em respecten.' },
                { qui: 'Germà Francesc', text: 'Me\'n faries el favor? Deixa aquest ram als peus de l\'àngel. I torna, que tinc una cosa per a tu.' },
                { avis: 'Has obtingut un RAM DE FLORS.' }
            ],
            enAcabar: () => { E.dona('ram'); E.posaObjectiu("El ram del Germà Francesc és per a la tomba de l'àngel, al Cementiri."); }
        };
    }
});

class ZonaSantAntoni extends ZonaBase {
    constructor() {
        super('ZonaSantAntoni', {
            nom: 'Cel·les de Sant Antoni',
            amplada: 1400,
            alcada: 1100,
            entrades: { monestir: { x: 60, y: 880, dir: 'dreta' }, cela: { x: 549, y: 800, dir: 'avall' } }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1400, 1100, -1100);
        this.terra('cami', 0, 810, 1100, 130);             // des del Monestir, davant la façana
        this.terra('pedra', 420, 770, 260, 60);            // replà davant la porta

        // La casa (900 d'ample): la porta, un pèl més alta que l'Ineu, és al 33% de l'ample, a x≈545
        const sa = this.posar('cel_stantoni', 700, 760);
        this.colisio((260 + 503) / 2, 715, 503 - 260, 90);          // façana a banda i banda de la porta (503-595)
        this.colisio((595 + 1140) / 2, 715, 1140 - 595, 90);
        this.blocDarrere(700, 880, 670, Math.max(0, 760 - sa.displayHeight));
        this.sortida(503, 738, 92, 32, 'ZonaCelaStAntoni', 'porta');
        this.portaAnimada({ x: 549, top: 600, bottom: 755, ample: 92, fons: 761, color: 0x5a3a20, panell: 0x6a4628, vora: 0x2a1608, ferro: true });   // la porta de la cel·la, de fusta amb ferros

        this.npc('germa_francesc', 1010, 870, DIALEGS.germaFrancesc, { flipX: true });
        // El Pallofa, el gos de la Carry: només hi passeja un cop has parlat amb ella, fins que l'agafes
        if (Estat.flag('carryParlat') && !Estat.te('pallofa') && !Estat.flag('pallofaTornat')) this.posarPallofa();
        this.cartell(170, 800, () => ({ pagines: [{ qui: 'Cartell', text: '← El Monestir i la Plaça' }] }));
        this.arbres([[1250, 300], [1320, 560], [1340, 1060], [160, 300], [360, 220]]);   // cap arbre davant el cartell ni el Germà Francesc

        this.sortida(0, 820, 14, 140, 'ZonaMonestir', 'santantoni');   // surts per l'est del Monestir
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
        const punt = this.interactiu(g.x, g.y - 8, RADI_NPC, DIALEGS.pallofa, { altura: g.displayHeight + 6 });
        this.tweens.add({ targets: g, x: 900, duration: 6500, yoyo: true, repeat: -1, ease: 'Linear',
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
// Hi arriba el camí del sud (les cel·les). Cap a l'oest, un camí duu a la Caseta (on viu en Jordi); cap al nord-est, a la Cirosa, tancat
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
                jordi:  { x: 60,   y: 600, dir: 'dreta' }
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
        this.posar('tiller_arbre', TIL_X, TIL_Y, { col: { w: 230, h: 44 } });             // gran i solemne: ell sol, sense arbres al voltant
        this.tillerAmbCara = this.posar('tiller', TIL_X, TIL_Y).setDepth(TIL_Y + 0.1).setAlpha(this.tillerCara ? 1 : 0);
        this.interactiu(TIL_X, TIL_Y + 25, 120, E => {
            const d = DIALEGS.tiller(E);
            if (this.tillerCara || !d.pagines || !d.pagines.length) return d;
            return Object.assign({}, d, { pagines: [{ fer: (z, fet) => z.despertarTiller(fet) }, ...d.pagines] });
        }, { altura: 230 });            // el «!» a l'alçada de la cara (més amunt quedava fora de la pantalla)

        // Després del sopar queden tres espelmes vora les arrels del Til·ler
        if (Estat.flag('soparFet')) this.posarEspelmes();

        // La branca del Til·ler: el bastó
        this.branca = this.posar('branca', TIL_X + 100, TIL_Y + 110, { fonsY: TIL_Y });
        this.interactiu(TIL_X + 100, TIL_Y + 115, RADI_OBJECTE, DIALEGS.branca, { altura: 60, actiu: () => Estat.flag('tillerBranca') && !Estat.te('basto_tiller') });

        this.cartell(980, 470, DIALEGS.cartellCirosa);

        // El camí de la Cirosa: tancat per les arrels del Til·ler fins que reconeixen la seva branca
        this.arrels = [];
        if (Estat.flag('camiCirosaObert')) this.sortida(1100, 0, 140, 14, 'ZonaCamiCirosa', 'tiller');
        else this.posarArrels();

        this.arbres([[120, 870], [1320, 900]]);   // només dos arbres als cantons: el Til·ler es veu sol

        this.sortida(620, 986, 160, 14, 'ZonaCelles', 'tiller');
        this.sortida(0, 540, 14, 130, 'ZonaJordi', 'til');
    }

    // La primera vegada que l'examines: la cara es va dibuixant sobre l'escorça (un fos de transparència, lent)
    despertarTiller(fet) {
        Sfx.secret();
        this.tweens.add({ targets: this.tillerAmbCara, alpha: 1, duration: 3200, ease: 'Sine.easeInOut',
            onComplete: () => { this.tillerCara = true; Estat.posaFlag('tillerCara'); this.esperar(500, fet); } });
    }

    // Arrels del Til·ler: grans arcs nuosos que surten de terra i tanquen el camí, amb fulles de til·ler a dalt.
    // L'arbre les hi va fer créixer perquè la boira no pugés; quan hi acostes la seva branca, la reconeixen i s'enfonsen.
    posarArrels() {
        const Y = 190;                                   // prou amunt perquè no hi hagi manera de vorejar-les
        this.arrelsY = Y;
        let sd = 11; const r = () => (sd = sd * 16807 % 2147483647) / 2147483647;
        this.colArrels = this.colisio(1190, Y - 20, 440, 50);
        this.muralla(0, 150, 960, 150, 110, 'arbre', true, x => x > 230);   // fins aquí, una paret invisible tanca el pas per l'oest (arbres només al canton, perquè el Til·ler quedi sol)
        for (let i = 0; i < 11; i++) {
            const x = 990 + i * 38 + r() * 10, y = Y + (i % 2) * 10, s = i % 2 ? 1 : -1;
            const amp = 50 + r() * 40, alt = 60 + r() * 70;
            const g = this.add.graphics({ x, y }).setDepth(y);
            const pts = new Phaser.Curves.CubicBezier(new Phaser.Math.Vector2(0, 0), new Phaser.Math.Vector2(s * amp * 0.1, -alt * 1.3),
                new Phaser.Math.Vector2(s * amp * 0.9, -alt * 1.3), new Phaser.Math.Vector2(s * amp, 0)).getPoints(18);
            g.fillStyle(0x000000, 0.3).fillEllipse(0, 2, 34, 10).fillEllipse(s * amp, 2, 30, 9);   // la terra remoguda als peus
            g.lineStyle(20, 0x120c08, 1).strokePoints(pts);
            g.lineStyle(14, 0x5e3e24, 1).strokePoints(pts);
            g.lineStyle(4, 0x8a6440, 0.9).strokePoints(pts.map(p => ({ x: p.x - 3, y: p.y - 3 })));
            const cim = pts[9];                                                  // fulles de til·ler, en forma de cor
            [[-10, -6, 0x5a8a32], [8, -10, 0x6a9a3a], [2, 2, 0x4e7a2c]].forEach(([fx, fy, c]) => {
                g.fillStyle(c, 1).fillCircle(cim.x + fx - 3, cim.y + fy, 5).fillCircle(cim.x + fx + 3, cim.y + fy, 5).fillTriangle(cim.x + fx - 8, cim.y + fy + 2, cim.x + fx + 8, cim.y + fy + 2, cim.x + fx, cim.y + fy + 11);
            });
            this.arrels.push(g);
            this.tweens.add({ targets: g, scaleY: 1.04, yoyo: true, repeat: -1, duration: 1400 + i * 130, ease: 'Sine.easeInOut' });   // respiren
        }
        // Sense la branca, les arrels només es poden mirar; amb ella, es colpegen com qualsevol cosa (ESPAI)
        this.interactiu(1190, Y + 60, 130, DIALEGS.arrelsTiller, { altura: 110, actiu: () => !Estat.flag('camiCirosaObert') && !Estat.te('basto_tiller') });
    }

    // Cop de l'Ineu (combat.js) amb la branca del Til·ler a prop de les arrels
    alAtacar(jo, d) {
        if (!this.arrelsY || Estat.flag('camiCirosaObert') || !Estat.te('basto_tiller')) return;
        const px = jo.x + d.x * 60, py = jo.y + d.y * 60;
        if (Math.abs(px - 1190) > 280 || Math.abs(py - (this.arrelsY - 20)) > 110) return;
        Sfx.puf();
        this.arrels.forEach((g, i) => { this.tweens.add({ targets: g, scaleX: 1.12, yoyo: true, duration: 140, delay: i * 25 }); });
        this.cameras.main.shake(140, 0.003);
        this.impacte(px, py, d, 0);
        if (Estat.flag('bassadoriaNeta')) this.apartarArrels();
        else if (!this.avisArrels) { this.avisArrels = true; this.missatge('Les arrels s\'estremeixen en reconèixer la branca, però no cedeixen: encara esperen alguna cosa.'); }
    }

    apartarArrels() {
        if (Estat.flag('camiCirosaObert')) return;
        Estat.posaFlag('camiCirosaObert');
        this.arrels.forEach((g, i) => {
            this.tweens.killTweensOf(g);
            this.tweens.add({ targets: g, scaleY: 0, duration: 1300, delay: i * 140, ease: 'Sine.easeIn' });
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
            ['neus', 700, 1000, 300, 760], ['venerables', 700, 1050, 600, 760]                   // des de les cel·les
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

    // Una fulla daurada es desprèn de la branca més alta i cau, giravoltant, fins a l'Ineu
    fullaCau(fet) {
        const f = this.add.ellipse(TIL_X, TIL_Y - 330, 18, 28, 0xf0c040, 1).setStrokeStyle(2, 0x8a6a10).setDepth(99000);
        this.tweens.add({ targets: f, angle: 720, duration: 2400 });
        this.tweens.add({ targets: f, x: { value: this.ineu.x, ease: 'Sine.easeInOut' }, y: this.ineu.y - 70, duration: 2400, onComplete: () => {
            f.destroy(); this.llum(this.ineu.x, this.ineu.y - 70, 0xf0c040, fet);
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

    actualitzar() {
        // La branca només es veu mentre encara no l'has agafada (i després que el Til·ler te l'hagi indicat)
        this.branca.setVisible(Estat.flag('tillerBranca') && !Estat.te('basto_tiller') && !this.brancaAgafada);
    }
}

// ---------------- LA CASETA (a l'oest del Til·ler): on viu el Jordi de la Caseta ----------------
// Escenari petit: en Jordi al jardí, la seva casa (es pot entrar: només decorada) i la caseta aixecada sobre pilars
// de fusta, amb el cofre de les joguines on hi ha la maneta.
class ZonaJordi extends ZonaBase {
    constructor() {
        super('ZonaJordi', {
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

        // La casa d'en Jordi (520 d'ample): la porta del mig duu a dins
        const masiaJordi = this.edifici('masia', 380, 480, 500, 90, 'ZonaCasaJordi', 'porta', { alt: 90 });
        this.portaMasia(masiaJordi, 380, 480);
        this.npc('jordi_caseta', 560, 590, DIALEGS.jordiCaseta);

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
        this.sortida(1086, 510, 14, 130, 'ZonaTiller', 'jordi');
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

// ---------------- CASA D'EN JORDI (interior) ----------------
// Una casa de pagès endreçada i plena de vida, però buida: en Jordi és al jardí. Només es mira.
Object.assign(DIALEGS, {
    casaJordiEines: E => ({ pagines: [] }),
    casaJordiTaula: E => ({ pagines: [] }),
    casaJordiLlar: E => ({ pagines: [{ qui: 'Inscripció', text: "«A la Caseta, la porta mai no té clau.»" }] }),
    casaJordiGat: E => ({ pagines: [] })
});

class ZonaCasaJordi extends ZonaBase {
    constructor() {
        super('ZonaCasaJordi', {
            nom: "Casa d'en Jordi",
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
        this.interactiu(200, 250, RADI_OBJECTE, DIALEGS.casaJordiLlar, { altura: 90 });

        // Finestra amb un feix de llum, ristres d'alls i pebrots a la biga, i el tauler d'eines (amb el buit de la maneta)
        this.add.image(385, 178, 'finestra_cela').setOrigin(0.5, 1).setScale(1 / RES).setDepth(-990);
        const llum = this.add.graphics().setDepth(-900).setBlendMode('ADD');
        llum.fillGradientStyle(0xfff0c0, 0xfff0c0, 0xfff0c0, 0xfff0c0, 0.15, 0.15, 0, 0).fillTriangle(355, 178, 415, 178, 520, 470);
        llum.fillGradientStyle(0xfff0c0, 0xfff0c0, 0xfff0c0, 0xfff0c0, 0.15, 0, 0, 0).fillTriangle(355, 178, 520, 470, 430, 470);
        this.tweens.add({ targets: llum, alpha: 0.65, yoyo: true, repeat: -1, duration: 3600, ease: 'Sine.easeInOut' });
        this.add.image(480, 16, 'penjolls').setOrigin(0.5, 0).setScale(1 / RES).setDepth(-985);
        this.add.image(662, 40, 'tauler_eines').setOrigin(0.5, 0).setScale(1 / RES).setDepth(-985);
        this.interactiu(662, 214, RADI_OBJECTE, DIALEGS.casaJordiEines, { altura: 110 });

        // Taula de la cuina amb dues cadires, al mig
        this.add.image(450, 412, 'taula_cela').setOrigin(0.5, 1).setScale(1.3 / RES).setDepth(412);
        this.colisio(450, 390, 146, 40);
        [[362, 456, false], [538, 456, true]].forEach(([x, y, flip]) => {
            this.add.image(x, y, 'cadira_cela').setOrigin(0.5, 1).setScale(1.25 / RES).setFlipX(flip).setDepth(y);
            this.colisio(x, y - 8, 42, 16);
        });
        this.interactiu(450, 430, RADI_GRAN, DIALEGS.casaJordiTaula, { altura: 80 });

        // El llit, contra la paret de la dreta
        this.add.image(770, 440, 'llit_cela').setOrigin(0.5, 1).setScale(1.15 / RES).setDepth(440);
        this.colisio(770, 348, 130, 190);

        // El gat, adormit al cove, i un barril
        this.add.image(170, 590, 'gat_cove').setOrigin(0.5, 1).setScale(1 / RES).setDepth(590);
        this.colisio(170, 575, 96, 26);
        this.interactiu(170, 620, RADI_OBJECTE, DIALEGS.casaJordiGat, { altura: 70 });
        this.posar('barril', 790, 600, { col: { w: 46, h: 20 } });

        // Pols dins la llum de la finestra i un to càlid
        this.add.particles(0, 0, 'espurna', {
            emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(360, 200, 160, 260) },
            speedX: { min: -5, max: 5 }, speedY: { min: -6, max: 3 }, lifespan: 4200, scale: { start: 0.12, end: 0 }, alpha: { start: 0.7, end: 0 },
            tint: [0xfff0c0], frequency: 320, blendMode: 'ADD'
        }).setDepth(9000);
        this.add.rectangle(A / 2, H / 2, A, H, 0xffd38a, 0.05).setDepth(80000);
        this.sortida(410, H - 22, 80, 14, 'ZonaJordi', 'casa');
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

        // El cofre dels joguets, amb la maneta d'en Jordi a sota
        this.posar('cofre_joguines', 510, 222, { col: { w: 56, h: 20 } });
        this.interactiu(510, 225, RADI_OBJECTE, DIALEGS.cofreManeta, { altura: 80 });

        this.add.rectangle(320, 260, 640, 520, 0xffd38a, 0.05).setDepth(80000);
        this.sortida(280, 492, 80, 22, 'ZonaJordi', 'caseta');
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
        this.interactiu(910, 625, RADI_GRAN, DIALEGS.fontSJ, { altura: 170 });

        // Alzina Buida: el portal ocult cap a la cabana de la Jaumeta. És el doble de gran que els altres arbres, té la seva
        // pròpia clariana (llum verda a terra, llumenetes i pedres) i el forat del tronc fa claror: no es pot confondre amb la resta.
        const AX = 330, AY = 780;
        this.add.ellipse(AX, AY + 40, 760, 380, 0x8fe08a, 0.13).setDepth(-1090);
        this.add.ellipse(AX, AY + 40, 480, 220, 0xb8f0a0, 0.13).setDepth(-1089);
        this.alzina = this.posar('alzina_buida', AX, AY, { col: { w: 150, h: 46 } });
        this.interactiu(AX, AY + 20, 130, DIALEGS.alzinaBuida, {
            altura: 330,
            enTancar: () => { if (Estat.flag('portalJaumeta')) { Estat.dades.portalTorna = 'bosc'; this.canviarZona('ZonaCabana', 'portal'); } }
        });
        [[-250, 75, 0.7], [255, 45, 0.55], [-120, 120, 0.4]].forEach(([dx, dy, e]) => this.posar('roca', AX + dx, AY + dy, { escala: e, col: { w: 34, h: 14 } }));
        this.claror = this.add.ellipse(AX - 18, AY - 128, 78, 104, 0x6aff9a, 0.3).setDepth(AY + 1);
        this.tweens.add({ targets: this.claror, alpha: 0.12, scaleX: 1.2, scaleY: 1.12, yoyo: true, repeat: -1, duration: 1500, ease: 'Sine.easeInOut' });
        this.add.particles(AX, AY - 90, 'espurna', {
            x: { min: -230, max: 230 }, y: { min: -120, max: 60 }, speedX: { min: -8, max: 8 }, speedY: { min: -14, max: -3 }, lifespan: 3200,
            scale: { start: 0.28, end: 0 }, alpha: { start: 0.9, end: 0 }, tint: [0xbaffb0, 0xf2ffc0], frequency: 260, blendMode: 'ADD'
        }).setDepth(AY + 2);
        this.boira(AX, AY - 20, 300, 60, 0.5);

        // Herbes de la Nit de Sant Joan (la tercera ofrena de la font és una pruna de la Prunera): cal trobar-les entre els arbres. Cada una és en una clariana, més gran que abans,
        // amb un halo a terra, espurnes i una columna de llum tènue que es veu per sobre de les copes.
        this.herbes = [];
        [[1, 'herba de Sant Joan', 'herba_sj', 720, 290], [2, 'romaní', 'romani', 1380, 990]].forEach(([n, nom, key, x, y]) => {
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
            this.interactiu(x, y, RADI_OBJECTE, DIALEGS.herba(n, nom), { altura: 70, actiu: () => !Estat.flag('herba' + n) });
            this.herbes.push({ img, halo, raig, espurnes, flag: 'herba' + n });
        });

        // Bosc dens: arbres en graella amb petits desplaçaments, deixant lliures el camí i els llocs importants
        // (els arbres es dibuixen davant segons la y: una herba o un cartell queda tapat per les copes dels arbres que té al sud,
        // per això les clarianes són amples i el cartell en té una de més a sota)
        const lliure = [[200, 180, 170], [900, 650, 250], [AX, AY - 60, 330], [720, 290, 210], [1380, 990, 210], [560, 1020, 210], [1700, 700, 240], [1520, 600, 190], [1520, 830, 210]];
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
        // Amagatall tancat amb esbarzers negres (cal Runna): un cofre
        for (let i = 0; i < 6; i++) {
            const a = i / 6 * Math.PI * 2;
            this.esbarzer(200 + Math.cos(a) * 105, 190 + Math.sin(a) * 75, 'bosc' + i);
        }
        this.cofre = this.posar('cofre', 200, 200, { col: { w: 50, h: 20 } });
        this.interactiu(200, 205, RADI_OBJECTE, DIALEGS.cofreBosc, { altura: 70 });

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

    actualitzar(ara) {
        this.herbes.forEach(h => {
            const visible = !Estat.flag(h.flag);
            h.img.setVisible(visible); h.halo.setVisible(visible); h.raig.setVisible(visible);
            if (!visible && !h.apagada) { h.apagada = true; h.espurnes.stop(); }
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
