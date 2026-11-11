/**
 * PROTOTIP DEL NOU PING-PONG (fora del joc principal: proves/pingpong/index.html)
 *
 * Ping-pong clàssic, simple (com els d'ordinador dels anys 80):
 *  - Només mous LA PALA, amb el dit o el ratolí (a la teva meitat de la taula, endavant i endarrere també). L'Ineu és transparent i et segueix: no tapa la pilota.
 *  - La pilota té física (vola, bota a la taula, té ombra). Quan el cercle de la pala la toca després del bot, la tornes sola: no cal fer cap clic.
 *  - La FORÇA del cop depèn de com de ràpid mous la pala quan la toca: lenta = pilota alta i curta (en Jusef la mata); mitjana = cop normal; ràpida = cop fort.
 *  - La DIRECCIÓ depèn d'on toca la pilota a la pala i cap on la mous (moure-la a la dreta, la hi envia).
 *  - Servei: dos cada un. El teu: toca la pantalla i la pilota surt cap a on mires. El d'en Jusef: un de cada tres és MÀGIC (ensenya tres llocs;
 *    repeteix-los tocant-los en el mateix ordre per trencar l'encanteri; si t'equivoques, és punt seu).
 *  - Partit a 5 punts (amb 2 de diferència si arriba a 4-4). Després de perdre dues vegades, s'ofereix el mode fàcil.
 * Teclat (per provar): ← → ↑ ↓ mouen la pala.
 *
 * Coordenades del món (metres): X de través (centre 0), z al llarg (0 = vora de l'Ineu, L = vora d'en Jusef), h alçada sobre la taula.
 */
const AMPLE = 720, ALT = 1280;
const T = {
    L: 2.74, W: 0.7625, NH: 0.1525,               // taula reglamentària
    F: 1236, HY: -414, K: 4299, ZN: 3.04,          // càmera darrere l'Ineu (la mateixa perspectiva que el minijoc d'ara)
    G: 9.81, REST: 0.86,                           // gravetat i rebot a la taula
    Z_INEU: -0.42, Z_JUSEF: T_L_PLUS(0.42),        // on es posen els jugadors
    Z_IDEAL: -0.08,                                // on és la pilota en el moment perfecte del cop (just passada la vora de la taula)
    PUNTS: 5
};
function T_L_PLUS(d) { return 2.74 + d; }
const MODES = {
    // pala: radi del cop (m); v: llindars de velocitat de la pala en px/s (fluix < v[0] ≤ bé < v[1] ≤ fort)
    normal: { temps: 0.92, pala: 0.24, v: [320, 1050], abastJusef: 0.48, velJusef: 1.9, fallaJusef: 0.05, fluixFalla: 0.2 },
    facil:  { temps: 0.74, pala: 0.32, v: [220, 800],  abastJusef: 0.40, velJusef: 1.5, fallaJusef: 0.12, fluixFalla: 0.0 }
};
const PALA_H = 0.16, PALA_Z0 = -0.62, PALA_Z1 = 0.95, OFFSET_DIT = 70;      // alçada de la pala; fondària mínima i màxima; quant per sobre del dit es dibuixa (perquè el dit no la tapi)

class PingPong extends Phaser.Scene {
    constructor() { super('PingPong'); }

    preload() {
        this.load.spritesheet('pp_drive', '../../assets/ineu/pp_drive.webp', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('pp_reves', '../../assets/ineu/pp_reves.webp', { frameWidth: 256, frameHeight: 256 });
        this.load.image('jusef_levita', '../../assets/personatges/jusef_levita.webp');
    }

    create() {
        this.mode = 'normal'; this.derrotes = 0;
        this.dibuixaEscenari();
        // L'Ineu (d'esquena amb la pala) i en Jusef
        this.anims.create({ key: 'drive', frames: this.anims.generateFrameNumbers('pp_drive', { start: 4, end: 15 }), frameRate: 34 });
        this.anims.create({ key: 'reves', frames: this.anims.generateFrameNumbers('pp_reves', { start: 6, end: 15 }), frameRate: 40 });
        this.spIneu = this.add.sprite(0, 0, 'pp_drive', 0).setOrigin(0.5, 0.94).setAlpha(0.3);       // transparent: no tapa la pilota
        this.spIneu.on('animationcomplete', () => this.spIneu.setFrame(0));
        this.spJusef = this.add.image(0, 0, 'jusef_levita').setOrigin(0.5, 1);
        this.auraJusef = this.add.ellipse(0, 0, 160, 190, 0xb890ff, 0).setDepth(1);
        // Pilota i ombra
        this.ombra = this.add.ellipse(0, 0, 20, 8, 0x000000, 0.35).setDepth(0.6);
        this.pilota = this.add.circle(0, 0, 14, 0xfff6e0).setStrokeStyle(3, 0x8a7a50);
        this.marcaBot = this.add.ellipse(0, 0, 40, 16).setStrokeStyle(3, 0xffd34d, 0.0).setDepth(0.55);
        // Text
        const est = (mida, color) => ({ fontFamily: 'Georgia, serif', fontSize: mida + 'px', color, stroke: '#1a0e06', strokeThickness: 6, align: 'center' });
        this.txtMarcador = this.add.text(AMPLE / 2, ALT - 110, '', est(40, '#f2e6c8')).setOrigin(0.5).setDepth(50);
        this.txtAvis = this.add.text(AMPLE / 2, 560, '', est(44, '#ffd34d')).setOrigin(0.5).setDepth(50);
        this.txtCop = this.add.text(0, 0, '', est(34, '#ffffff')).setOrigin(0.5).setDepth(50);
        this.txtMode = this.add.text(AMPLE - 20, ALT - 160, '', est(22, '#c8b890')).setOrigin(1, 0.5).setDepth(50);
        this.txtAjuda = this.add.text(AMPLE / 2, ALT - 40, 'Mou la pala amb el dit o el ratolí · Com més ràpid la mous, més fort és el cop', est(20, '#c8b890')).setOrigin(0.5).setDepth(50);
        // La pala (el que controles): un disc vermell amb mànec, a la fondària Xp/zp de la taula
        this.palaG = this.add.graphics().setDepth(30);
        this.palaX = 0; this.palaZ = 0.1; this.palaVx = 0; this.palaVy = 0; this.palaPx = { x: AMPLE / 2, y: 900 };
        // Entrada
        this.objectiuX = 0; this.objectiuZ = 0.1; this.Xi = 0; this.Xj = 0;
        this.input.on('pointermove', p => this.apunta(p));
        this.input.on('pointerdown', p => { this.apunta(p); this.toc(p); });
        this.tecles = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown-SPACE', () => this.toc(null));
        this.audio = null;
        this.nouPartit();
    }

    // ---------------- Projecció ----------------
    proj(X, z, h = 0) { const Zc = T.ZN + z; return { x: AMPLE / 2 + T.F * X / Zc, y: T.HY + (T.K - T.F * h) / Zc, k: T.F / Zc }; }
    mon(px, z) { return (px - AMPLE / 2) * (T.ZN + z) / T.F; }          // x de pantalla → X del món (a la fondària z)

    // El punter (o el dit) mana la pala: x → X del món i y → fondària (invertint la perspectiva a l'alçada de la pala)
    apunta(p) {
        const y = p.y - OFFSET_DIT;
        const z = (T.K - T.F * PALA_H) / (y - T.HY) - T.ZN;
        this.objectiuZ = Phaser.Math.Clamp(z, PALA_Z0, PALA_Z1);
        this.objectiuX = Phaser.Math.Clamp((p.x - AMPLE / 2) * (T.ZN + this.objectiuZ) / T.F, -1.05, 1.05);
    }

    pintaPala() {
        const p = this.proj(this.palaX, this.palaZ, PALA_H), r = 0.13 * p.k, g = this.palaG;
        g.clear();
        g.fillStyle(0x000000, 0.25).fillEllipse(p.x + 4, this.proj(this.palaX, this.palaZ, 0).y, r * 2, r * 0.7);        // ombra
        g.fillStyle(0x7a4a22, 1).fillRoundedRect(p.x - r * 0.12, p.y + r * 0.6, r * 0.24, r * 1.1, 4);                    // mànec
        g.fillStyle(0xd02a22, 1).fillCircle(p.x, p.y, r).lineStyle(Math.max(2, r * 0.1), 0x4a0e0a, 1).strokeCircle(p.x, p.y, r);
        g.fillStyle(0xff7a6a, 0.35).fillCircle(p.x - r * 0.3, p.y - r * 0.3, r * 0.4);
    }

    dibuixaEscenari() {
        const g = this.add.graphics().setDepth(0);
        g.fillGradientStyle(0x2a1c12, 0x2a1c12, 0x120c08, 0x120c08, 1).fillRect(0, 0, AMPLE, ALT);
        // terra
        g.fillStyle(0x3a2a1c, 1).fillRect(0, 300, AMPLE, ALT - 300);
        // taula
        const c = [this.proj(-T.W, 0), this.proj(T.W, 0), this.proj(T.W, T.L), this.proj(-T.W, T.L)];
        const gruix = [this.proj(-T.W, 0, -0.05), this.proj(T.W, 0, -0.05)];
        g.fillStyle(0x0f3a26, 1).fillPoints([c[0], c[1], gruix[1], gruix[0]], true);
        g.fillStyle(0x1d6b46, 1).fillPoints(c, true);
        g.lineStyle(4, 0xf2f2e8, 0.9).strokePoints(c, true);
        const m0 = this.proj(0, 0), m1 = this.proj(0, T.L);
        g.lineStyle(2, 0xf2f2e8, 0.6).lineBetween(m0.x, m0.y, m1.x, m1.y);
        // xarxa
        const n = [this.proj(-T.W - 0.1, T.L / 2), this.proj(T.W + 0.1, T.L / 2), this.proj(T.W + 0.1, T.L / 2, T.NH), this.proj(-T.W - 0.1, T.L / 2, T.NH)];
        const x = this.add.graphics().setDepth(10 - T.L / 2);
        x.fillStyle(0xe8e8e0, 0.25).fillPoints(n, true);
        x.lineStyle(3, 0xf2f2e8, 0.95).lineBetween(n[3].x, n[3].y, n[2].x, n[2].y);
        x.lineStyle(1, 0xf2f2e8, 0.35);
        for (let k = 0; k <= 30; k++) { const X = -T.W - 0.1 + (2 * T.W + 0.2) * k / 30, a = this.proj(X, T.L / 2), b = this.proj(X, T.L / 2, T.NH); x.lineBetween(a.x, a.y, b.x, b.y); }
        // zones del servei màgic (ocultes)
        this.zonesMagia = [-0.5, 0, 0.5].map((X, i) => {
            const p = this.proj(X, 0.6);
            return this.add.ellipse(p.x, p.y, 190, 74, [0x6ac8ff, 0xffd34d, 0xff7ad8][i], 0).setDepth(0.7);
        });
    }

    // ---------------- Partit ----------------
    nouPartit() {
        this.punts = { ineu: 0, jusef: 0 }; this.serveis = 0; this.serveisJusef = 0; this.acabat = false;
        if (this.capa) { this.capa.destroy(); this.capa = null; }
        this.txtMode.setText(this.mode === 'facil' ? 'Mode fàcil' : '');
        this.actualitzaMarcador();
        this.preparaServei();
    }
    get M() { return MODES[this.mode]; }
    actualitzaMarcador() { this.txtMarcador.setText(`Ineu  ${this.punts.ineu}  ·  ${this.punts.jusef}  Jusef`); }
    serveixIneu() { return Math.floor(this.serveis / 2) % 2 === 0; }

    preparaServei() {
        this.b = null; this.estat = 'servei'; this.rally = 0;
        this.pilota.setVisible(false); this.ombra.setVisible(false); this.marcaBot.setStrokeStyle(3, 0xffd34d, 0);
        if (this.serveixIneu()) {
            this.avis('El teu servei: toca la pantalla', 1600, '#f2e6c8');
            this.estat = 'serveiIneu';
        } else {
            this.serveisJusef++;
            this.time.delayedCall(900, () => (this.serveisJusef % 3 === 1 ? this.serveiMagic() : this.serveiJusef(false)));
        }
    }

    // El servei normal d'en Jusef (o el que ve després de trencar l'encanteri, més lent)
    serveiJusef(suau) {
        if (this.acabat) return;
        this.estat = 'joc';
        const X = Phaser.Math.FloatBetween(-0.55, 0.55);
        this.llanca('jusef', { X: this.Xj, z: T.L + 0.25, h: 0.3 }, X, Phaser.Math.FloatBetween(0.35, 0.9), suau ? 1.15 : 0.95);
    }

    // ---- Servei màgic: tres llocs que cal repetir en el mateix ordre ----
    serveiMagic() {
        if (this.acabat) return;
        this.estat = 'magiaMirant';
        this.ordre = [0, 1, 2].map(() => Phaser.Math.Between(0, 2));
        this.entrat = [];
        this.tweens.add({ targets: this.auraJusef, fillAlpha: 0.35, duration: 300 });
        this.avis('Servei màgic d\'en Jusef: memoritza!', 1300, '#d8b0ff');
        this.so('magia');
        this.ordre.forEach((z, i) => this.time.delayedCall(1300 + i * 750, () => {
            const e = this.zonesMagia[z];
            e.setFillStyle(e.fillColor, 0.75); this.so('nota', z);
            this.time.delayedCall(480, () => e.setFillStyle(e.fillColor, 0));
        }));
        this.time.delayedCall(1300 + 3 * 750 + 100, () => {
            this.estat = 'magiaEntrant';
            this.avis('Repeteix-los! Toca els tres llocs', 1400, '#d8b0ff');
            this.zonesMagia.forEach(e => e.setStrokeStyle(3, 0xd8b0ff, 0.6));
            this.limitMagia = this.time.delayedCall(5000, () => { if (this.estat === 'magiaEntrant') this.fallaMagia(); });
        });
    }
    entradaMagia(p) {
        const X = this.mon(p.x, 0.6), z = X < -0.25 ? 0 : X > 0.25 ? 2 : 1;
        const e = this.zonesMagia[z];
        e.setFillStyle(e.fillColor, 0.6); this.time.delayedCall(200, () => e.setFillStyle(e.fillColor, 0));
        this.so('nota', z);
        this.entrat.push(z);
        if (z !== this.ordre[this.entrat.length - 1]) { this.fallaMagia(); return; }
        if (this.entrat.length === 3) {
            this.estat = 'res'; if (this.limitMagia) this.limitMagia.remove();
            this.zonesMagia.forEach(e => e.setStrokeStyle(3, 0xd8b0ff, 0));
            this.tweens.add({ targets: this.auraJusef, fillAlpha: 0, duration: 400 });
            this.avis('Encanteri trencat!', 900, '#a0ffb0'); this.so('be');
            this.time.delayedCall(800, () => this.serveiJusef(true));
        }
    }
    fallaMagia() {
        if (this.limitMagia) this.limitMagia.remove();
        this.zonesMagia.forEach(e => e.setStrokeStyle(3, 0xd8b0ff, 0));
        this.tweens.add({ targets: this.auraJusef, fillAlpha: 0, duration: 400 });
        this.punt('jusef', 'L\'encanteri d\'en Jusef!');
    }

    // ---------------- Física de la pilota ----------------
    // Llança la pilota des de 'des' perquè boti a (Xt, zt) al cap de 'temps' segons (s'allarga si no passa la xarxa)
    llanca(qui, des, Xt, zt, temps) {
        let t = temps, vh;
        const vz = () => (zt - des.z) / t;
        for (let i = 0; i < 20; i++) {
            vh = (0 - des.h + 0.5 * T.G * t * t) / t;
            const tn = (T.L / 2 - des.z) / vz(), hn = des.h + vh * tn - 0.5 * T.G * tn * tn;
            if (tn < 0 || tn > t || hn > T.NH + 0.06) break;
            t += 0.06;
        }
        this.b = { X: des.X, z: des.z, h: des.h, vx: (Xt - des.X) / t, vz: vz(), vh, de: qui, bots: 0, decidit: false, morta: false, marca: { X: Xt, z: zt } };
        this.pilota.setVisible(true); this.ombra.setVisible(true);
        // la marca d'on botarà (només quan ve cap a tu)
        const pm = this.proj(Xt, zt);
        this.marcaBot.setPosition(pm.x, pm.y).setSize(46 * pm.k / 300 * 1.4, 18 * pm.k / 300 * 1.4).setStrokeStyle(3, 0xffd34d, qui === 'jusef' ? 0.75 : 0);
        this.so('pala');
    }

    update(time, delta) {
        // Pala: segueix el punter (o les fletxes) i es mesura la velocitat (px/s a la pantalla), una mica suavitzada
        const dt = Math.max(1, delta) / 1000;
        if (this.tecles.left.isDown) this.objectiuX -= 2.4 * dt;
        if (this.tecles.right.isDown) this.objectiuX += 2.4 * dt;
        if (this.tecles.up.isDown) this.objectiuZ += 1.6 * dt;
        if (this.tecles.down.isDown) this.objectiuZ -= 1.6 * dt;
        this.objectiuX = Phaser.Math.Clamp(this.objectiuX, -1.05, 1.05); this.objectiuZ = Phaser.Math.Clamp(this.objectiuZ, PALA_Z0, PALA_Z1);
        this.palaX = this.objectiuX; this.palaZ = this.objectiuZ;
        const pp = this.proj(this.palaX, this.palaZ, PALA_H);
        const vx = (pp.x - this.palaPx.x) / dt, vy = (pp.y - this.palaPx.y) / dt;
        this.palaVx = Phaser.Math.Linear(this.palaVx, vx, 0.45); this.palaVy = Phaser.Math.Linear(this.palaVy, vy, 0.45);
        this.palaPx = { x: pp.x, y: pp.y };
        this.pintaPala();
        // L'Ineu (transparent) segueix la pala per darrere
        const pasI = this.M.velIneu === undefined ? 5 : this.M.velIneu;
        this.Xi += Phaser.Math.Clamp(this.palaX - this.Xi, -6 * dt, 6 * dt);
        const pi = this.proj(this.Xi, T.Z_INEU);
        this.spIneu.setPosition(pi.x, pi.y).setScale(1.25 * pi.k / 400).setDepth(10 - T.Z_INEU);

        // Simulació de la pilota (temps del joc més lent que el real, segons el mode)
        if (this.b && !this.b.morta) this.simula(delta / 1000 * this.M.temps);
        // Jusef: va cap a on arribarà la pilota
        let objJ = 0;
        if (this.b && this.b.de === 'ineu' && !this.b.morta) objJ = this.b.marca.X + this.b.vx * 0.35;
        const pasJ = this.M.velJusef * delta / 1000;
        this.Xj += Phaser.Math.Clamp(objJ - this.Xj, -pasJ, pasJ);
        const pj = this.proj(this.Xj, T.Z_JUSEF);
        const flota = Math.sin(time / 400) * 6;
        this.spJusef.setPosition(pj.x, pj.y + flota).setScale(0.62 * pj.k / 214).setDepth(10 - T.Z_JUSEF);
        this.auraJusef.setPosition(pj.x, pj.y - 120 + flota);
        // Pilota al servei: a sobre de la pala
        if (this.estat === 'serveiIneu') {
            const p = this.proj(this.palaX, this.palaZ, PALA_H + 0.22 + Math.abs(Math.sin(time / 260)) * 0.1);
            this.pilota.setVisible(true).setPosition(p.x, p.y).setRadius(Math.max(9, 0.05 * p.k)).setDepth(10.5);
            this.ombra.setVisible(false);
        }
    }

    simula(dt) {
        const b = this.b;
        const pasos = Math.ceil(dt / 0.004);
        for (let i = 0; i < pasos && !b.morta; i++) {
            const d = dt / pasos, zAbans = b.z;
            b.X += b.vx * d; b.z += b.vz * d; b.vh -= T.G * d; b.h += b.vh * d;
            if (b.de === 'jusef' && b.bots === 1 && this.provaCop()) return;
            // xarxa
            if ((zAbans - T.L / 2) * (b.z - T.L / 2) <= 0 && b.h < T.NH && Math.abs(b.X) < T.W + 0.1) {
                b.vz = -b.vz * 0.15; b.vx *= 0.3; this.so('xarxa');
                this.finalBola(b.de === 'ineu' ? 'jusef' : 'ineu', 'A la xarxa!');
                return;
            }
            // bot a la taula, o a terra
            if (b.h <= 0 && b.vh < 0) {
                if (Math.abs(b.X) <= T.W && b.z >= 0 && b.z <= T.L) {
                    b.h = 0; b.vh = -b.vh * T.REST; b.vx *= 0.97; b.vz *= 0.97;
                    this.so('bot');
                    const banda = b.z < T.L / 2 ? 'ineu' : 'jusef';
                    if (banda === b.de) { this.finalBola(b.de === 'ineu' ? 'jusef' : 'ineu', 'Ha botat al seu camp'); return; }
                    b.bots++;
                    if (b.bots >= 2) { this.finalBola(b.de, banda === 'ineu' ? 'No hi has arribat' : 'En Jusef no hi arriba!'); return; }
                    if (banda === 'ineu') this.marcaBot.setStrokeStyle(3, 0xffd34d, 0);
                } else {
                    this.finalBola(b.bots >= 1 ? b.de : (b.de === 'ineu' ? 'jusef' : 'ineu'), b.bots >= 1 ? (b.de === 'ineu' ? 'En Jusef no hi arriba!' : 'No hi has arribat') : 'Fora!');
                    return;
                }
            }
            // En Jusef torna la pilota (quan ja ha botat al seu camp)
            if (b.de === 'ineu' && b.bots === 1 && !b.decidit && b.z > T.L + 0.05) { b.decidit = true; this.copJusef(); if (b !== this.b) return; }
            // Ha passat de llarg
            if (b.z < -1.4 || b.z > T.L + 1.5) { this.finalBola(b.bots >= 1 ? b.de : (b.de === 'ineu' ? 'jusef' : 'ineu'), b.bots >= 1 ? (b.de === 'ineu' ? 'En Jusef no hi arriba!' : 'No hi has arribat') : 'Fora!'); return; }
        }
        this.pintaPilota();
    }

    pintaPilota() {
        const b = this.b, p = this.proj(b.X, b.z, b.h), s = this.proj(b.X, b.z, 0);
        this.pilota.setPosition(p.x, p.y).setRadius(Math.max(9, 0.05 * p.k)).setDepth(b.z > T.L / 2 ? 10 - b.z + 0.01 : 20);      // a la teva banda, per sobre de l'Ineu (que no la tapi)
        const r = Math.max(7, 0.05 * s.k * 0.8);
        const sobreTaula = Math.abs(b.X) <= T.W && b.z >= 0 && b.z <= T.L;
        this.ombra.setPosition(s.x, s.y).setSize(r * 2.2, r * 0.9).setAlpha(sobreTaula ? Phaser.Math.Clamp(0.45 - b.h * 0.6, 0.12, 0.45) : 0);
    }

    copJusef() {
        const b = this.b, M = this.M;
        const dx = Math.abs(b.X - this.Xj);
        let falla = M.fallaJusef + (b.qualitat === 'perfecte' ? 0.32 : b.qualitat === 'be' ? 0.08 : 0) + this.rally * 0.012;
        if (dx > M.abastJusef) falla = 1;
        else if (dx > M.abastJusef * 0.65) falla += 0.2;
        if (Math.random() < falla) return;                       // no hi arriba: la pilota segueix i és punt de l'Ineu
        this.rally++;
        // Apunta lluny de l'Ineu sovint; si el cop de l'Ineu era fluix, en Jusef el mata (ràpid)
        const lluny = Math.random() < 0.6 ? -Math.sign(this.Xi || 1) * Phaser.Math.FloatBetween(0.25, 0.62) : Phaser.Math.FloatBetween(-0.6, 0.6);
        const temps = b.qualitat === 'fluix' ? 0.55 : Math.max(0.62, 0.95 - this.rally * 0.03);
        this.llanca('jusef', { X: b.X, z: b.z, h: Math.max(0.15, b.h) }, lluny, Phaser.Math.FloatBetween(0.3, 1.05), temps);
    }

    // ---------------- El cop de la pala ----------------
    // Cada pas de la simulació: la pilota (ja botada a la teva banda, venint cap a tu) toca la pala?
    provaCop() {
        const b = this.b;
        if (this.copFet === b || b.vz >= 0) return false;
        const R = this.M.pala;
        if (Math.abs(b.X - this.palaX) > R || Math.abs(b.z - this.palaZ) > R * 0.75 || b.h > PALA_H + 0.3 || b.h < -0.02) return false;
        this.copFet = b;
        this.copPala();
        return true;
    }

    copPala() {
        const b = this.b, M = this.M;
        const v = Math.hypot(this.palaVx, this.palaVy);                       // velocitat de la pala en px/s
        const q = v >= M.v[1] ? 'perfecte' : v >= M.v[0] ? 'be' : 'fluix';
        // Direcció: on toca a la pala (la vora dreta l'envia a l'esquerra) i cap on es mou
        const vora = Phaser.Math.Clamp((b.X - this.palaX) / M.pala, -1, 1);
        let Xt = Phaser.Math.Clamp(-vora * 0.3 + Phaser.Math.Clamp(this.palaVx / 1800, -1, 1) * 0.5 + b.X * 0.1, -0.68, 0.68);
        let zt = q === 'perfecte' ? T.L - 0.22 : q === 'be' ? T.L * 0.8 : T.L * 0.62;
        let temps = q === 'perfecte' ? 0.5 : q === 'be' ? 0.72 : 0.95;
        if (q === 'fluix' && Math.random() < M.fluixFalla) zt = T.L + 0.45;                 // un cop massa fluix pot anar-se'n fora
        this.gest(Xt >= this.palaX);
        this.llanca('ineu', { X: b.X, z: b.z, h: Math.max(0.12, b.h) }, Xt, zt, temps);
        this.b.qualitat = q;
        const bp = this.proj(b.X, b.z, b.h);
        this.txtCopa(q === 'perfecte' ? 'FORT!' : q === 'be' ? 'Bé' : 'Fluix...', q === 'perfecte' ? '#7ad8ff' : q === 'be' ? '#a0ffb0' : '#ffd34d', bp);
        if (q === 'perfecte') { this.cameras.main.shake(120, 0.004); this.so('fort'); }
    }

    // ---------------- Tocs: només el servei i el servei màgic ----------------
    toc(p) {
        if (this.acabat) return;
        if (this.txtAjuda) this.txtAjuda.setAlpha(0.0);
        if (this.estat === 'magiaEntrant') { if (p) this.entradaMagia(p); return; }
        if (this.estat === 'serveiIneu') {
            const X = Phaser.Math.Clamp(-this.palaX * 0.6 + Phaser.Math.FloatBetween(-0.3, 0.3), -0.6, 0.6);
            this.estat = 'joc'; this.serveiFet = true;
            this.gest(X >= this.palaX);
            this.llanca('ineu', { X: this.palaX, z: this.palaZ, h: PALA_H + 0.3 }, X, T.L * 0.78, 0.8);
            this.b.qualitat = 'be';
            return;
        }
    }

    gest(dreta) { this.spIneu.play(dreta ? 'drive' : 'reves', true); }
    txtCopa(t, color, p) {
        this.txtCop.setText(t).setColor(color).setPosition(p.x, p.y - 60).setAlpha(1).setScale(0.8);
        this.tweens.killTweensOf(this.txtCop);
        this.tweens.add({ targets: this.txtCop, y: p.y - 120, scale: 1.1, alpha: 0, duration: 750, ease: 'Sine.easeOut' });
    }

    // ---------------- Punts ----------------
    finalBola(guanyador, text) {
        if (!this.b || this.b.morta) return;
        this.b.morta = true;
        this.time.delayedCall(450, () => { this.pilota.setVisible(false); this.ombra.setVisible(false); });
        this.punt(guanyador, text);
    }
    punt(guanyador, text) {
        if (this.acabat) return;
        this.estat = 'punt';
        this.marcaBot.setStrokeStyle(3, 0xffd34d, 0);
        this.punts[guanyador]++;
        this.serveis++;
        this.actualitzaMarcador();
        this.so(guanyador === 'ineu' ? 'be' : 'mal');
        this.avis((guanyador === 'ineu' ? 'Punt teu! ' : 'Punt d\'en Jusef. ') + (text || ''), 1300, guanyador === 'ineu' ? '#a0ffb0' : '#ff9a7a');
        const { ineu, jusef } = this.punts;
        if ((ineu >= T.PUNTS || jusef >= T.PUNTS) && Math.abs(ineu - jusef) >= 2) { this.time.delayedCall(1400, () => this.final(ineu > jusef)); return; }
        this.time.delayedCall(1500, () => this.preparaServei());
    }

    final(guanyat) {
        this.acabat = true; this.estat = 'final';
        if (!guanyat) this.derrotes++;
        const c = this.capa = this.add.container(0, 0).setDepth(100);
        c.add(this.add.rectangle(0, 0, AMPLE, ALT, 0x000000, 0.6).setOrigin(0).setInteractive());
        const est = (m, col) => ({ fontFamily: 'Georgia, serif', fontSize: m + 'px', color: col, stroke: '#1a0e06', strokeThickness: 6, align: 'center', wordWrap: { width: 600 } });
        c.add(this.add.text(AMPLE / 2, 460, guanyat ? 'Has guanyat en Jusef!' : 'En Jusef guanya el partit', est(48, guanyat ? '#a0ffb0' : '#ff9a7a')).setOrigin(0.5));
        c.add(this.add.text(AMPLE / 2, 540, `${this.punts.ineu} - ${this.punts.jusef}`, est(40, '#f2e6c8')).setOrigin(0.5));
        const boto = (y, text, fn) => {
            const r = this.add.rectangle(AMPLE / 2, y, 440, 90, 0x6a4426, 1).setStrokeStyle(4, 0xd4af37).setInteractive({ useHandCursor: true });
            const t = this.add.text(AMPLE / 2, y, text, est(32, '#f2e6c8')).setOrigin(0.5);
            r.on('pointerdown', (p, x, y, ev) => { ev.stopPropagation(); fn(); });
            c.add([r, t]);
        };
        if (!guanyat && this.derrotes >= 2 && this.mode !== 'facil') {
            c.add(this.add.text(AMPLE / 2, 650, 'Vols tornar-ho a provar en mode fàcil?\n(pilota més lenta, més marge)', est(28, '#f2e6c8')).setOrigin(0.5));
            boto(780, 'Sí, més fàcil', () => { this.mode = 'facil'; this.nouPartit(); });
            boto(900, 'No, igual', () => this.nouPartit());
        } else {
            boto(720, 'Tornar a jugar', () => this.nouPartit());
            if (this.mode === 'facil') boto(840, 'Tornar al mode normal', () => { this.mode = 'normal'; this.nouPartit(); });
        }
    }

    avis(text, ms, color) {
        this.txtAvis.setText(text).setColor(color).setAlpha(1);
        this.tweens.killTweensOf(this.txtAvis);
        this.tweens.add({ targets: this.txtAvis, alpha: 0, delay: ms, duration: 300 });
    }

    // ---------------- So (WebAudio, sense fitxers) ----------------
    so(tipus, n = 0) {
        try {
            if (!this.audio) this.audio = new (window.AudioContext || window.webkitAudioContext)();
            const a = this.audio, t = a.currentTime, o = a.createOscillator(), g = a.createGain();
            const def = { bot: [1100, 0.05, 'square', 0.08], pala: [520, 0.07, 'triangle', 0.25], fort: [220, 0.18, 'sawtooth', 0.18], xarxa: [140, 0.2, 'triangle', 0.25],
                be: [880, 0.25, 'sine', 0.2], mal: [180, 0.3, 'sine', 0.2], magia: [660, 0.6, 'sine', 0.15], nota: [[523, 659, 784][n] || 600, 0.3, 'sine', 0.22] }[tipus];
            if (!def) return;
            o.type = def[2]; o.frequency.setValueAtTime(def[0], t);
            if (tipus === 'magia') o.frequency.exponentialRampToValueAtTime(1320, t + def[1]);
            if (tipus === 'be') o.frequency.exponentialRampToValueAtTime(1320, t + def[1]);
            g.gain.setValueAtTime(def[3], t); g.gain.exponentialRampToValueAtTime(0.001, t + def[1]);
            o.connect(g).connect(a.destination); o.start(t); o.stop(t + def[1] + 0.02);
        } catch (e) { /* sense àudio */ }
    }
}

window.ppJoc = new Phaser.Game({
    type: Phaser.AUTO, parent: 'joc', width: AMPLE, height: ALT, backgroundColor: '#0d0b09',      // (igual que el joc principal)
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    input: { activePointers: 2 },
    scene: [PingPong]
});
const reajusta = () => { try { ppJoc.scale.refresh(); } catch (e) { /* res */ } };
['resize', 'orientationchange'].forEach(ev => window.addEventListener(ev, () => setTimeout(reajusta, 120)));
if (window.visualViewport) window.visualViewport.addEventListener('resize', () => setTimeout(reajusta, 120));
setTimeout(reajusta, 300);

// Diagnòstic (afegeix ?debug a l'adreça): mostra a dalt la mida de la pantalla i del llenç
if (location.search.includes('debug')) {
    const d = document.createElement('div');
    d.style.cssText = 'position:fixed;left:0;top:0;z-index:9;background:#000a;color:#8f8;font:12px monospace;padding:4px;pointer-events:none';
    document.body.appendChild(d);
    setInterval(() => { const c = document.querySelector('canvas'); const r = c && c.getBoundingClientRect(); d.textContent = `win ${innerWidth}x${innerHeight} dpr ${devicePixelRatio} vv ${window.visualViewport ? Math.round(window.visualViewport.width) + 'x' + Math.round(window.visualViewport.height) + ' s' + window.visualViewport.scale : '-'} canvas ${r ? Math.round(r.x) + ',' + Math.round(r.y) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height) : '-'}`; }, 500);
}
