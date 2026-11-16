/**
 * PROTOTIP 3 DEL PING-PONG: ESTIL «ROCKSTAR» (fora del joc principal: proves/pingpong/rockstar.html)
 *
 * L'Ineu ARRIBA SOL a la pilota (una marca groga t'ensenya on botarà); tu només decideixes COM la colpeja, LLISCANT el dit per la pantalla:
 *    · TOC (sense lliscar) ........ cop normal, el més segur
 *    · LLISCAR CAP AMUNT .......... cop FORT amb efecte: ràpid i profund, però arriscat si el fas fora de temps
 *    · LLISCAR CAP AVALL .......... cop TALLAT: curt i baix, enganya en Jusef (que ha de córrer)
 *    · LLISCAR A UN COSTAT ........ cop normal cap aquell costat (també es pot combinar: amunt-dreta, avall-esquerra...)
 *  El MOMENT compta: quan un anell al voltant de la pilota es posa VERD, lliscar és PERFECTE (en Jusef gairebé no hi arriba i s'omple la barra de concentració).
 *  Si no lliscs a temps, l'Ineu torna la pilota sol amb un cop fluix: sempre es pot seguir jugant.
 *  BARRA DE CONCENTRACIÓ: s'omple amb bons cops; quan és plena, el següent cop FORT és el COP MÀGIC (càmera lenta; en Jusef no el pot tornar).
 *  Servei: toca (o llisca cap a un costat). El d'en Jusef: un de cada tres és MÀGIC (repeteix tres llocs tocant-los en ordre).
 *  Partit a 5 punts. Després de dues derrotes, s'ofereix el mode fàcil. CÀMERA mòbil: segueix la pilota, s'acosta als cops forts i s'inclina una mica.
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
    // finestra: segons (reals) abans que la pilota arribi dins els quals lliscar és PERFECTE · abast: fins on arriba l'Ineu (m)
    normal: { temps: 0.92, finestra: 0.42, abast: 0.4, abastJusef: 0.48, velJusef: 1.9, fallaJusef: 0.05, fortFora: 0.28 },
    facil:  { temps: 0.74, finestra: 0.62, abast: 0.6, abastJusef: 0.40, velJusef: 1.5, fallaJusef: 0.12, fortFora: 0.05 }
};
const Z_COP = 0.05;           // fondària on l'Ineu colpeja la pilota

class Rockstar extends Phaser.Scene {
    constructor() { super('Rockstar'); }

    preload() {
        this.load.spritesheet('pp_drive', '../../assets/ineu/pp_drive.webp', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('pp_reves', '../../assets/ineu/pp_reves.webp', { frameWidth: 256, frameHeight: 256 });
        this.load.image('jusef_levita', '../../assets/personatges/jusef_levita.webp');
    }

    create() {
        this.mode = 'normal'; this.derrotes = 0; this.uiLlista = [];
        this.dibuixaEscenari();
        this.anims.create({ key: 'drive', frames: this.anims.generateFrameNumbers('pp_drive', { start: 4, end: 15 }), frameRate: 34 });
        this.anims.create({ key: 'reves', frames: this.anims.generateFrameNumbers('pp_reves', { start: 6, end: 15 }), frameRate: 40 });
        this.spIneu = this.add.sprite(0, 0, 'pp_drive', 0).setOrigin(0.5, 0.94);
        this.spIneu.on('animationcomplete', () => this.spIneu.setFrame(0));
        this.spJusef = this.add.image(0, 0, 'jusef_levita').setOrigin(0.5, 1);
        this.auraJusef = this.add.ellipse(0, 0, 160, 190, 0xb890ff, 0).setDepth(1);
        this.ombra = this.add.ellipse(0, 0, 20, 8, 0x000000, 0.35).setDepth(0.6);
        this.pilota = this.add.circle(0, 0, 14, 0xfff6e0).setStrokeStyle(3, 0x8a7a50);
        this.marcaBot = this.add.ellipse(0, 0, 40, 16).setStrokeStyle(3, 0xffd34d, 0.0).setDepth(0.55);
        this.anell = this.add.graphics().setDepth(21);                         // l'anell que es posa verd quan toca lliscar
        this.estela = this.add.graphics().setDepth(19);                        // estela del cop màgic
        // Interfície (a una càmera a part, perquè no es mogui amb la càmera del joc)
        const est = (mida, color) => ({ fontFamily: 'Georgia, serif', fontSize: mida + 'px', color, stroke: '#1a0e06', strokeThickness: 6, align: 'center' });
        this.estUI = est;
        this.txtMarcador = this.ui(this.add.text(AMPLE / 2, ALT - 110, '', est(40, '#f2e6c8')).setOrigin(0.5).setDepth(50));
        this.txtAvis = this.ui(this.add.text(AMPLE / 2, 520, '', est(44, '#ffd34d')).setOrigin(0.5).setDepth(50));
        this.txtCop = this.ui(this.add.text(0, 0, '', est(40, '#ffffff')).setOrigin(0.5).setDepth(50));
        this.txtMode = this.ui(this.add.text(AMPLE - 20, ALT - 160, '', est(22, '#c8b890')).setOrigin(1, 0.5).setDepth(50));
        this.txtAjuda = this.ui(this.add.text(AMPLE / 2, ALT - 40, 'Llisca el dit quan l\'anell és verd · amunt = fort · avall = tallat · als costats = apunta', est(19, '#c8b890')).setOrigin(0.5).setDepth(50));
        this.barraG = this.ui(this.add.graphics().setDepth(50));
        this.txtFocus = this.ui(this.add.text(AMPLE / 2, ALT - 222, '', est(30, '#7ad8ff')).setOrigin(0.5).setDepth(50));
        // Estat
        this.Xi = 0; this.Xj = 0; this.focus = 0; this.lent = 1; this.zoomExtra = 0; this.gestBuf = null; this.punxo = null;
        this.input.on('pointerdown', p => this.alPrimer(p));
        this.input.on('pointerup', p => this.alSoltar(p));
        this.input.keyboard.on('keydown-SPACE', () => this.gestura(0, 0));
        this.input.keyboard.on('keydown-UP', () => this.gestura(0, -100));
        this.input.keyboard.on('keydown-DOWN', () => this.gestura(0, 100));
        this.input.keyboard.on('keydown-LEFT', () => this.gestura(-100, 0));
        this.input.keyboard.on('keydown-RIGHT', () => this.gestura(100, 0));
        this.audio = null;
        // Càmera del joc (mòbil) i càmera de la interfície
        this.cameras.main.setBackgroundColor('#0d0b09');
        this.camUI = this.cameras.add(0, 0, AMPLE, ALT);
        this.camUI.ignore(this.children.list.filter(o => !this.uiLlista.includes(o)));
        this.cameras.main.ignore(this.uiLlista);
        this.nouPartit();
    }
    ui(o) { this.uiLlista.push(o); return o; }
    // posició del món a la pantalla (per posar els textos flotants sobre la pilota, malgrat la càmera)
    mundAPantalla(x, y) { const c = this.cameras.main; return { x: (x - c.midPoint.x) * c.zoom + AMPLE / 2, y: (y - c.midPoint.y) * c.zoom + ALT / 2 }; }

    // ---------------- Projecció ----------------
    proj(X, z, h = 0) { const Zc = T.ZN + z; return { x: AMPLE / 2 + T.F * X / Zc, y: T.HY + (T.K - T.F * h) / Zc, k: T.F / Zc }; }
    mon(px, z) { return (px - AMPLE / 2) * (T.ZN + z) / T.F; }          // x de pantalla → X del món (a la fondària z)

    dibuixaEscenari() {
        const g = this.add.graphics().setDepth(0);
        g.fillGradientStyle(0x2a1c12, 0x2a1c12, 0x120c08, 0x120c08, 1).fillRect(-400, -400, AMPLE + 800, ALT + 800);
        // terra
        g.fillStyle(0x3a2a1c, 1).fillRect(-400, 300, AMPLE + 800, ALT + 400);
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
        this.txtMode.setText(this.mode === 'facil' ? 'Mode fàcil' : ''); this.focus = 0;
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
            this.gestBuf = null;
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
        const dt = Math.max(1, delta) / 1000, b = this.b;
        // Càmera lenta (cop màgic): es recupera sola
        this.lent = Phaser.Math.Linear(this.lent, this.lentObj === undefined ? 1 : this.lentObj, 0.12);
        // L'Ineu ARRIBA SOL a la pilota: va cap a on arribarà (la marca groga); si no hi ha pilota, al mig
        let objI = 0;
        if (b && !b.morta && b.de === 'jusef' && b.vz < 0) { const t = Math.max(0, (b.z - Z_COP) / -b.vz); objI = Phaser.Math.Clamp(b.X + b.vx * t, -0.85, 0.85); }
        else if (b && !b.morta && b.de === 'jusef') objI = b.marca.X;
        this.Xi += Phaser.Math.Clamp(objI - this.Xi, -7.5 * dt, 7.5 * dt);
        const pi = this.proj(this.Xi, T.Z_INEU);
        this.spIneu.setPosition(pi.x, pi.y).setScale(1.25 * pi.k / 400).setDepth(10 - T.Z_INEU);
        // Simulació de la pilota (el temps del joc va més lent que el real, segons el mode i el cop màgic)
        if (b && !b.morta) this.simula(dt * this.M.temps * this.lent);
        // Jusef: va cap a on arribarà la pilota
        let objJ = 0;
        if (this.b && this.b.de === 'ineu' && !this.b.morta) objJ = this.b.marca.X + this.b.vx * 0.35;
        const pasJ = this.M.velJusef * dt;
        this.Xj += Phaser.Math.Clamp(objJ - this.Xj, -pasJ, pasJ);
        const pj = this.proj(this.Xj, T.Z_JUSEF);
        const flota = Math.sin(time / 400) * 6;
        this.spJusef.setPosition(pj.x, pj.y + flota).setScale(0.62 * pj.k / 214).setDepth(10 - T.Z_JUSEF);
        this.auraJusef.setPosition(pj.x, pj.y - 120 + flota);
        if (this.estat === 'serveiIneu') {            // la pilota a la mà de l'Ineu
            const p = this.proj(this.Xi + 0.18, -0.15, 0.32 + Math.abs(Math.sin(time / 260)) * 0.12);
            this.pilota.setVisible(true).setPosition(p.x, p.y).setRadius(Math.max(9, 0.05 * p.k)).setDepth(21);
            this.ombra.setVisible(false);
        }
        this.pintaAnell();
        this.pintaBarra();
        this.movCamera(dt);
    }

    // L'anell que es posa VERD quan toca lliscar: es veu a la pilota que arriba i passa de gris (lluny) a groc (a prop) a verd (ara!)
    pintaAnell() {
        const g = this.anell, b = this.b; g.clear();
        if (!b || b.morta || b.de !== 'jusef' || b.bots !== 1 || this.copFet === b) return;
        const eta = this.eta(b), F = this.M.finestra, p = this.proj(b.X, b.z, b.h);
        const r = Math.max(22, 0.05 * p.k * 2.4);
        if (eta <= F && eta >= 0) { g.lineStyle(7, 0x58ff8a, 1).strokeCircle(p.x, p.y, r); g.lineStyle(3, 0xffffff, 0.8).strokeCircle(p.x, p.y, r * 0.72); }
        else if (eta <= F * 2.6) { g.lineStyle(5, 0xffd34d, 0.85).strokeCircle(p.x, p.y, r * (1 + Math.min(1, (eta - F) / (F * 1.6)) * 0.8)); }
        else g.lineStyle(3, 0xffffff, 0.3).strokeCircle(p.x, p.y, r * 1.8);
    }
    // segons REALS que falten perquè la pilota arribi a l'Ineu
    eta(b) { return b.vz < 0 ? Math.max(0, (b.z - Z_COP) / -b.vz) / (this.M.temps * this.lent) : 99; }

    pintaBarra() {
        const g = this.barraG; g.clear();
        const w = 300, x = AMPLE / 2 - w / 2, y = ALT - 190;
        g.fillStyle(0x000000, 0.45).fillRoundedRect(x - 4, y - 4, w + 8, 26, 10);
        g.fillStyle(this.focus >= 1 ? 0x7ad8ff : 0x4aa8d8, 1).fillRoundedRect(x, y, Math.max(8, w * this.focus), 18, 8);
        if (this.focus >= 1) { g.lineStyle(3, 0xffffff, 0.6 + 0.4 * Math.sin(this.time.now / 110)).strokeRoundedRect(x - 4, y - 4, w + 8, 26, 10); }
        this.txtFocus.setText(this.focus >= 1 ? 'COP MÀGIC! Llisca cap amunt' : '');
    }

    // Càmera mòbil: segueix la pilota una mica, s'acosta quan ve cap a tu, s'inclina lleugerament i fa «cop de zoom» en els cops forts
    movCamera(dt) {
        const c = this.cameras.main, b = this.b;
        let cx = AMPLE / 2, cy = ALT / 2, z = 1.0, rot = 0;
        if (b && !b.morta) {
            const p = this.proj(b.X, b.z, b.h);
            cx += (p.x - AMPLE / 2) * 0.2; cy += (p.y - ALT / 2) * 0.12 + 20;
            rot = Phaser.Math.Clamp((p.x - AMPLE / 2) / AMPLE, -0.5, 0.5) * 0.03;
            if (b.de === 'jusef' && b.bots === 1) z += 0.05 * (1 - Phaser.Math.Clamp(b.z / T.L, 0, 1));         // s'acosta quan ve cap a tu
        }
        z += this.zoomExtra; this.zoomExtra *= Math.pow(0.002, dt);
        if (this.lent < 0.8) z += 0.1;                                                                         // cop màgic
        c.setZoom(Phaser.Math.Linear(c.zoom, z, 0.1));
        c.setRotation(Phaser.Math.Linear(c.rotation, rot, 0.08));
        c.centerOn(Phaser.Math.Linear(c.midPoint.x, cx, 0.1), Phaser.Math.Linear(c.midPoint.y, cy, 0.1));
    }

    simula(dt) {
        const b = this.b;
        const pasos = Math.ceil(dt / 0.004);
        for (let i = 0; i < pasos && !b.morta; i++) {
            const d = dt / pasos, zAbans = b.z;
            b.X += b.vx * d; b.z += b.vz * d; b.vh -= T.G * d; b.h += b.vh * d;
            if (b.de === 'jusef' && b.bots === 1 && this.copFet !== b && b.vz < 0 && b.z <= Z_COP) { this.copFet = b; this.copIneu(); return; }
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
        let falla = M.fallaJusef + (b.qualitat === 'perfecte' ? 0.3 : b.qualitat === 'be' ? 0.07 : 0) + this.rally * 0.01;
        if (b.tipus === 'fort') falla += 0.12;
        if (b.tipus === 'tallat') falla += 0.28;                              // el cop tallat és curt: ha de córrer cap a la xarxa
        if (b.tipus === 'magic') falla = 1;                                    // no es pot tornar
        if (dx > M.abastJusef) falla = 1;
        else if (dx > M.abastJusef * 0.65) falla += 0.2;
        if (Math.random() < falla) return;                                     // no hi arriba: la pilota segueix i és punt de l'Ineu
        this.rally++;
        const lluny = Math.random() < 0.6 ? -Math.sign(this.Xi || 1) * Phaser.Math.FloatBetween(0.25, 0.62) : Phaser.Math.FloatBetween(-0.6, 0.6);
        const temps = b.qualitat === 'fluix' ? 0.55 : Math.max(0.62, 0.95 - this.rally * 0.03);
        this.llanca('jusef', { X: b.X, z: b.z, h: Math.max(0.15, b.h) }, lluny, Phaser.Math.FloatBetween(0.3, 1.05), temps);
    }

    // ---------------- Els gestos del jugador ----------------
    alPrimer(p) {
        this.punxo = { x: p.x, y: p.y, t: this.time.now };
        if (this.estat === 'magiaEntrant' && !this.acabat) this.entradaMagia(p);          // al servei màgic, el toc es nota a l'instant
    }
    alSoltar(p) {
        if (!this.punxo || this.acabat) { this.punxo = null; return; }
        const dx = p.x - this.punxo.x, dy = p.y - this.punxo.y; this.punxo = null;
        if (this.estat === 'magiaEntrant') return;
        this.gestura(dx, dy);
    }
    // dx, dy: el lliscament en píxels (0, 0 = toc). Es guarda; el cop es fa quan l'Ineu arriba a la pilota
    gestura(dx, dy) {
        if (this.acabat) return;
        if (this.txtAjuda) this.txtAjuda.setAlpha(0);
        const len = Math.hypot(dx, dy);
        let tipus = 'normal', aim = 0;
        if (len >= 28) {
            if (Math.abs(dy) > Math.abs(dx) * 0.8) tipus = dy < 0 ? 'fort' : 'tallat';
            aim = Phaser.Math.Clamp(dx / 130, -1, 1) * 0.62;
        }
        if (this.estat === 'serveiIneu') {
            this.estat = 'joc';
            const Xt = Phaser.Math.Clamp(aim + Phaser.Math.FloatBetween(-0.15, 0.15), -0.62, 0.62);
            this.gest(Xt >= this.Xi);
            this.llanca('ineu', { X: this.Xi + 0.18, z: -0.15, h: 0.3 }, Xt, T.L * 0.78, 0.8);
            this.b.qualitat = 'be'; this.b.tipus = 'normal';
            return;
        }
        const b = this.b;
        if (this.estat !== 'joc' || !b || b.morta || b.de !== 'jusef') return;
        this.gestBuf = { tipus, aim, eta: this.eta(b), b };
        // retorn visual: un petit toc a l'anell
        const bp = this.proj(b.X, b.z, b.h);
        this.puntGesture = bp;
    }

    // El cop de l'Ineu: es fa en arribar la pilota, segons el gest que s'ha guardat
    copIneu() {
        const b = this.b, M = this.M;
        const buf = this.gestBuf && this.gestBuf.b === b ? this.gestBuf : null;
        this.gestBuf = null;
        if (Math.abs(b.X - this.Xi) > M.abast) { this.txtCopa('Massa lluny!', '#ff9a7a', this.proj(b.X, b.z, b.h)); this.b.bots = 2; this.finalBola('jusef', 'No hi has arribat'); return; }
        let tipus = buf ? buf.tipus : 'normal', aim = buf ? buf.aim : Phaser.Math.FloatBetween(-0.2, 0.2);
        let q = !buf ? 'fluix' : buf.eta <= M.finestra ? 'perfecte' : 'be';
        let Xt = Phaser.Math.Clamp(aim + b.X * 0.1, -0.68, 0.68), zt, temps;
        // COP MÀGIC: barra plena + cop fort
        const magic = this.focus >= 1 && tipus === 'fort' && !!buf;
        if (magic) { tipus = 'magic'; q = 'perfecte'; Xt = Phaser.Math.Clamp(Xt === 0 ? (Math.random() < 0.5 ? -0.6 : 0.6) : Math.sign(Xt) * 0.66, -0.68, 0.68); this.focus = 0; }
        if (tipus === 'magic') { zt = T.L - 0.08; temps = 0.4; }
        else if (tipus === 'fort') { zt = T.L - 0.2; temps = q === 'perfecte' ? 0.5 : 0.58; if (q !== 'perfecte' && Math.random() < M.fortFora) zt = T.L + 0.5; }       // fort fora de temps: pot anar-se'n fora
        else if (tipus === 'tallat') { zt = T.L / 2 + 0.36; temps = 0.95; if (q === 'fluix') temps = 1.1; }
        else { zt = q === 'fluix' ? T.L * 0.62 : T.L * 0.8; temps = q === 'fluix' ? 0.95 : 0.72; }
        this.gest(Xt >= this.Xi);
        this.llanca('ineu', { X: b.X, z: b.z, h: Math.max(0.12, b.h) }, Xt, zt, temps);
        this.b.qualitat = q; this.b.tipus = tipus;
        const bp = this.proj(b.X, b.z, b.h);
        const noms = { normal: 'Bé', fort: 'FORT!', tallat: 'Tallat!', magic: 'COP MÀGIC!' };
        this.txtCopa(q === 'fluix' ? 'Fluix...' : q === 'perfecte' && tipus !== 'magic' ? 'PERFECTE ' + noms[tipus] : noms[tipus], tipus === 'magic' ? '#c8a0ff' : q === 'perfecte' ? '#7ad8ff' : q === 'be' ? '#a0ffb0' : '#ffd34d', bp);
        // barra de concentració i càmera
        if (!magic) this.focus = Phaser.Math.Clamp(this.focus + (q === 'perfecte' ? 0.34 : q === 'be' ? 0.13 : 0), 0, 1);
        if (q === 'perfecte' || tipus === 'fort') { this.cameras.main.shake(130, 0.005); this.zoomExtra = 0.07; this.so('fort'); }
        if (tipus === 'magic') { this.lentObj = 0.35; this.zoomExtra = 0.12; this.so('magia'); this.time.delayedCall(1100, () => { this.lentObj = 1; }); }
    }

    gest(dreta) { this.spIneu.play(dreta ? 'drive' : 'reves', true); }
    txtCopa(t, color, p) {
        const q = this.mundAPantalla(p.x, p.y);
        this.txtCop.setText(t).setColor(color).setPosition(q.x, q.y - 70).setAlpha(1).setScale(0.8);
        this.tweens.killTweensOf(this.txtCop);
        this.tweens.add({ targets: this.txtCop, y: q.y - 140, scale: 1.15, alpha: 0, duration: 850, ease: 'Sine.easeOut' });
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
        this.lentObj = 1;
        if (guanyador === 'jusef') this.focus = Math.max(0, this.focus - 0.2);
        this.actualitzaMarcador();
        this.so(guanyador === 'ineu' ? 'be' : 'mal');
        this.avis((guanyador === 'ineu' ? 'Punt teu! ' : 'Punt d\'en Jusef. ') + (text || ''), 1300, guanyador === 'ineu' ? '#a0ffb0' : '#ff9a7a');
        const { ineu, jusef } = this.punts;
        if ((ineu >= T.PUNTS || jusef >= T.PUNTS) && Math.abs(ineu - jusef) >= 2) { this.time.delayedCall(1400, () => this.final(ineu > jusef)); return; }
        this.time.delayedCall(1500, () => this.preparaServei());
    }

    final(guanyat) {
        this.acabat = true; this.estat = 'final'; this.txtAvis.setAlpha(0); this.tweens.killTweensOf(this.txtAvis);
        if (!guanyat) this.derrotes++;
        const c = this.capa = this.add.container(0, 0).setDepth(100); this.cameras.main.ignore(c);
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
    scene: [Rockstar]
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
