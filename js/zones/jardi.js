/**
 * EL JARDÍ DE L'HOSTATGERIA (ZonaJardi): pèrgola de pedra, Prunera Màgica, llosa del passadís secret i l'Isílder.
 */

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
        this.isilder = this.npc('isilder', 360, 840, DIALEGS.isilder, { zoomConversa: 1.5 });
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

    // Falta que l'Isílder expliqui què fer amb la llosa? (amb Runna, abans de saber res de la Rosansa)
    llosaCal() {
        return !!(Estat.flag('runna') && !Estat.flag('isilderRosansa') && !Estat.flag('llosaOberta') && !Estat.flag('llavorRosansa') && !Estat.te('llavorLluna'));
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
