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
const ALCADA_CELLER = 1100;

class ZonaPingpong extends ZonaBase {
    constructor() {
        super('ZonaPingpong', {
            nom: 'El Celler',
            amplada: 1280,
            alcada: ALCADA_CELLER,
            colorFons: '#140e0a',
            pacifica: true,
            entrades: { porta: { x: 640, y: ALCADA_CELLER - 80, dir: 'amunt' }, passadis: { x: 640, y: 392, dir: 'avall' } }
        });
    }

    construir() {
        const A = ALCADA_CELLER, YP = 300;                 // YP: peu de la paret del fons (arcada i porta)
        // ---- Terra de ciment i parets de pedra ----
        this.terra('ciment', 100, YP, 1080, A - YP, -1100);
        this.add.tileSprite(100, 0, 1080, YP, 'mur_pedra').setOrigin(0).setTileScale(1 / RES).setDepth(-1000);
        this.add.tileSprite(60, 0, 40, A, 'mur_pedra').setOrigin(0).setTileScale(1 / RES).setDepth(-1000).setTint(0x8a8078);
        this.add.tileSprite(1180, 0, 40, A, 'mur_pedra').setOrigin(0).setTileScale(1 / RES).setDepth(-1000).setTint(0x8a8078);
        const mur = this.add.graphics().setDepth(-995);
        mur.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.65, 0.65, 0, 0).fillRect(100, 0, 1080, 130);       // la volta s'enfosqueix a dalt
        mur.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0, 0.45, 0.45).fillRect(100, YP - 34, 1080, 34);  // ombra al peu de la paret
        mur.fillStyle(0x6a6054, 1).fillRect(100, YP - 14, 1080, 14);                                                           // sòcol de pedra
        mur.fillStyle(0xcfc4ae, 0.55).fillRect(100, YP - 14, 1080, 2);
        mur.lineStyle(2, 0x1c1610, 1).strokeRect(100, YP - 14, 1080, 14);
        mur.fillStyle(0x000000, 0.35).fillRect(60, 0, 8, A).fillRect(1172, 0, 8, A);                                           // els costats, en ombra
        this.colisio(30, A / 2, 60, A);
        this.colisio(1250, A / 2, 60, A);
        this.colisio(640, (YP + 20) / 2, 1080, YP + 20);
        this.colisio(340, A - 10, 500, 20);
        this.colisio(940, A - 10, 500, 20);

        // ---- Gran arcada del fons: pilars, dovelles i una fornícula fosca amb la porta tapada ----
        const AX = 640, AY = 170, AR = 150;                // centre de la volta, y de naixement i radi
        const buit = this.make.graphics({ x: 0, y: 0, add: false });
        buit.fillStyle(0xffffff, 1).beginPath().arc(AX, AY, AR, Math.PI, 0, false).lineTo(AX + AR, YP).lineTo(AX - AR, YP).closePath().fillPath();
        const fons = this.add.tileSprite(AX - AR, AY - AR, AR * 2, YP - AY + AR, 'mur_pedra').setOrigin(0).setTileScale(1 / RES).setDepth(-990).setTint(0x4c443b);
        fons.setMask(buit.createGeometryMask());
        const arc = this.add.graphics().setDepth(-985);
        arc.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.7, 0.7, 0.1, 0.1).fillRect(AX - AR, AY - AR, AR * 2, YP - AY + AR);   // fondària de la fornícula
        // dovelles (pedres de l'arc) i clau
        const N = 13;
        for (let i = 0; i < N; i++) {
            const a0 = Math.PI + i * Math.PI / N, a1 = Math.PI + (i + 1) * Math.PI / N, r0 = AR, r1 = AR + 34;
            const pts = [[r0, a0], [r1, a0], [r1, a1], [r0, a1]].map(([r, a]) => ({ x: AX + Math.cos(a) * r, y: AY + Math.sin(a) * r }));
            const clau = i === (N - 1) / 2;
            arc.fillStyle(clau ? 0xd8ceb8 : i % 2 ? 0xa89c86 : 0xbcb09a, 1).fillPoints(pts, true);
            arc.lineStyle(2, 0x1c1610, 1).strokePoints(pts, true);
            if (clau) { arc.fillStyle(0xe8dfca, 0.55).fillRect(AX - 6, AY - r1 + 2, 12, 5); }
        }
        // pilars amb cimaci i base
        [AX - AR - 30, AX + AR].forEach(x => {
            arc.fillStyle(0xb4a892, 1).fillRect(x, AY - 8, 30, YP - AY + 8).lineStyle(2, 0x1c1610, 1).strokeRect(x, AY - 8, 30, YP - AY + 8);
            arc.fillStyle(0xffffff, 0.22).fillRect(x + 2, AY - 6, 5, YP - AY);
            arc.fillStyle(0x000000, 0.22).fillRect(x + 22, AY - 6, 6, YP - AY);
            arc.fillStyle(0xcdc1ab, 1).fillRect(x - 5, AY - 20, 40, 14).lineStyle(2, 0x1c1610, 1).strokeRect(x - 5, AY - 20, 40, 14);         // cimaci
            arc.fillStyle(0xcdc1ab, 1).fillRect(x - 4, YP - 12, 38, 12).lineStyle(2, 0x1c1610, 1).strokeRect(x - 4, YP - 12, 38, 12);        // base
            for (let k = 1; k < 5; k++) arc.lineStyle(1, 0x1c1610, 0.35).lineBetween(x + 1, AY - 8 + k * 26, x + 29, AY - 8 + k * 26);
        });
        // porta tapada: fusta de dues fulles amb bandes de ferro i taulons clavats en creu
        const pt = this.add.graphics().setDepth(-980);
        const PX0 = AX - 82, PX1 = AX + 82, PY = 210;
        const portaForma = [{ x: PX0, y: YP }, { x: PX0, y: PY }];
        for (let k = 1; k <= 10; k++) { const a = Math.PI + k / 10 * Math.PI; portaForma.push({ x: AX + Math.cos(a) * 82, y: PY + Math.sin(a) * 48 }); }
        portaForma.push({ x: PX1, y: PY }, { x: PX1, y: YP });
        pt.fillStyle(0x1b1109, 1).fillPoints(portaForma.map(p => ({ x: p.x + (p.x < AX ? -5 : 5), y: p.y })), true);
        pt.fillStyle(0x5c3b1e, 1).fillPoints(portaForma, true);
        for (let k = 1; k < 8; k++) pt.lineStyle(2, 0x2a1608, 0.9).lineBetween(PX0 + k * 164 / 8, PY - 40, PX0 + k * 164 / 8, YP);
        pt.lineStyle(3, 0x120a04, 1).lineBetween(AX, PY - 48, AX, YP);
        [PY + 12, PY + 52].forEach(y => { pt.fillStyle(0x34363c, 1).fillRect(PX0, y, 164, 8).lineStyle(1.5, 0x101216, 1).strokeRect(PX0, y, 164, 8); for (let x = PX0 + 8; x < PX1; x += 22) { pt.fillStyle(0x9a9ca6, 1).fillCircle(x, y + 4, 1.6); } });
        [[AX - 40, PY + 6, -0.14], [AX + 34, PY + 34, 0.12], [AX - 30, PY + 58, 0.1]].forEach(([x, y, a]) => {       // taulons clavats
            const lx = Math.cos(a) * 62, ly = Math.sin(a) * 62;
            pt.lineStyle(14, 0x120a04, 1).lineBetween(x - lx, y - ly, x + lx, y + ly);
            pt.lineStyle(10, 0x8a5c30, 1).lineBetween(x - lx, y - ly, x + lx, y + ly);
            pt.lineStyle(2, 0xd9a868, 0.5).lineBetween(x - lx, y - ly - 3, x + lx, y + ly - 3);
            pt.fillStyle(0x2a2c32, 1).fillCircle(x - lx * 0.85, y - ly * 0.85, 2.4).fillCircle(x + lx * 0.85, y + ly * 0.85, 2.4);
        });
        // fanals a banda i banda de l'arcada (flama que tremola)
        [AX - AR - 110, AX + AR + 110].forEach((x, k) => {
            const y = 150, f = this.add.graphics().setDepth(-975);
            f.fillStyle(0x2a2118, 1).fillRect(x - 6, y, 12, 26).fillStyle(0x4a3a24, 1).fillRect(x - 11, y - 2, 22, 6).lineStyle(1.5, 0x120a04, 1).strokeRect(x - 11, y - 2, 22, 6);
            const flama = this.add.graphics().setDepth(-974);
            flama.fillStyle(0xff9a2a, 1).fillPoints([{ x: x - 7, y: y - 2 }, { x, y: y - 26 }, { x: x + 7, y: y - 2 }], true);
            flama.fillStyle(0xffe080, 1).fillPoints([{ x: x - 3.5, y: y - 2 }, { x, y: y - 15 }, { x: x + 3.5, y: y - 2 }], true);
            const resp = this.add.graphics().setDepth(-973).setBlendMode(Phaser.BlendModes.ADD);
            for (let q = 0; q < 7; q++) resp.fillStyle(0xffa040, 0.05 + q * 0.01).fillCircle(x, y - 10, 130 * (1 - q / 7));
            this.tweens.add({ targets: [flama, resp], alpha: 0.62, scaleY: 0.96, yoyo: true, repeat: -1, duration: 260 + k * 70, ease: 'Sine.easeInOut' });
        });
        // fornícules amb prestatges i gerros, a la paret dels costats
        [250, 1030].forEach(x => {
            const nx = this.add.graphics().setDepth(-990);
            const forma = [{ x: x - 62, y: YP - 20 }, { x: x - 62, y: 170 }];
            for (let k = 1; k <= 8; k++) { const a = Math.PI + k / 8 * Math.PI; forma.push({ x: x + Math.cos(a) * 62, y: 170 + Math.sin(a) * 38 }); }
            forma.push({ x: x + 62, y: 170 }, { x: x + 62, y: YP - 20 });
            nx.fillStyle(0xb4a892, 1).fillPoints(forma.map(p => ({ x: x + (p.x - x) * 1.12, y: p.y - (p.y < 170 ? 4 : 0) })), true);
            nx.fillStyle(0x15100c, 1).fillPoints(forma, true);
            nx.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.6, 0.6, 0, 0).fillRect(x - 62, 132, 124, 60);
            [YP - 66, YP - 124].forEach(y => { nx.fillStyle(0x5a3a1e, 1).fillRect(x - 62, y, 124, 7).lineStyle(1.5, 0x120a04, 1).strokeRect(x - 62, y, 124, 7); });
            [[-38, 0], [0, 1], [38, 2]].forEach(([dx, t], k) => { this.posar('gerro_' + t, x + dx, YP - 66, { fonsY: -985 }); this.posar('gerro_' + ((t + k + 1) % 3), x + dx + 6, YP - 124 + (k % 2 ? 0 : 0), { fonsY: -985, escala: 0.8 }); });
        });

        // ---- La roda de carruatge davant la porta (s'empeny des d'un costat; cal Runna) ----
        this.rodaX = Estat.dades.flags.rodaX || AX;
        this.rodaMoguda = Estat.flag('rodaMoguda');
        this.roda = this.posar('roda_carruatge', this.rodaX, YP + 52, { fonsY: YP + 56 });
        this.colRoda = this.add.zone(this.rodaX, YP + 36, 110, 30);
        this.physics.add.existing(this.colRoda, true);
        if (this.rodaMoguda) this.roda.setAngle(this.rodaX > AX ? 180 : -180);
        this.empentaMs = 0; this.contacteRoda = 0; this.costatRoda = 1; this.pistaRoda = false;
        this.interactiu(AX, YP + 100, 100, DIALEGS.posterSecret, { altura: 150, actiu: () => !this.rodaMoguda });
        if (this.rodaMoguda) this.obrirPassadis();

        // ---- Mobiliari del celler ----
        // Barrils contra la paret, a banda i banda
        [[150, YP + 44], [206, YP + 56], [1130, YP + 44], [1074, YP + 56]].forEach(([x, y]) => this.posar('barril', x, y, { col: { w: 50, h: 22 } }));
        // Una taula de fusta amb tamborets a l'esquerra i una altra amb un banc a la dreta (taules que no són de ping-pong)
        this.posar('taula', 205, 520, { col: { w: 160, h: 30 } });
        this.posar('tamboret', 150, 590, { col: { w: 40, h: 16 } });
        this.posar('tamboret', 262, 590, { col: { w: 40, h: 16 } });
        this.posar('taula', 1075, 520, { col: { w: 160, h: 30 } });
        this.posar('banc', 1075, 612, { col: { w: 140, h: 16 } });
        [[205, 480], [1075, 480]].forEach(([x, y], k) => {
            const e = this.posar('espelma', x, y, { fonsY: y + 30 });
            this.tweens.add({ targets: e, alpha: 0.7, yoyo: true, repeat: -1, duration: 330 + k * 80 });
        });
        // Bancs per seure al fons de la sala
        this.posar('banc_davant', 320, 1030, { col: { w: 140, h: 16 } });
        this.posar('banc_davant', 960, 1030, { col: { w: 140, h: 16 } });
        [[132, 1050], [1148, 1050]].forEach(([x, y]) => this.posar('barril', x, y, { col: { w: 50, h: 22 } }));

        // ---- Taules de ping-pong (verdes), ben separades de la roda ----
        this.posar('taula_pp', 410, 760, { col: { w: 220, h: 40 } });
        this.posar('taula_pp', 870, 760, { col: { w: 220, h: 40 } });
        this.interactiu(410, 790, 120, DIALEGS.taulaPP, { altura: 100 });

        // ---- Jugadors ----
        this.npc('juli', 262, 760, DIALEGS.juli);
        this.npc('frederic', 1030, 760, DIALEGS.frederic, { flipX: true });
        this.npc('eloi', 600, 780, DIALEGS.eloi);
        this.npc('josep', 690, 780, DIALEGS.josep);

        this.add.rectangle(640, A / 2, 1080, A, 0xffe9a8, 0.04).setDepth(80000);
        this.sortida(600, A - 30, 80, 20, 'ZonaRuines', 'pingpong');
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
        const x = this.roda.x + dir * 190;
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
        this.sortides.push({ r: new Phaser.Geom.Rectangle(590, 318, 100, 32), desti: 'ZonaPassadis', entrada: 'porta' });
        this.tweens.add({ targets: this.add.circle(640, 260, 80, 0xa070ff, 0.12).setDepth(-970), alpha: 0.03, yoyo: true, repeat: -1, duration: 900 });
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

        this.arbres([[1700, 220], [1640, 420], [1750, 540], [260, 1000], [300, 1040],
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
        const lliure = [[200, 180, 160], [900, 650, 240], [300, 560, 150], [430, 280, 110], [1380, 990, 110], [560, 1010, 110], [120, 700, 110], [1700, 700, 230]];
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
