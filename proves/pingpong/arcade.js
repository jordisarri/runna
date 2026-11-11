/**
 * PROTOTIP 5 DEL PING-PONG: ESTIL ARCADE «THREEPON» (fora del joc principal: proves/pingpong/arcade.html)
 *
 * Un sol gest, sense botons ni joystick. L'Ineu CORRE SOL cap a la pilota (una marca groga t'ensenya on botarà); tu només LLISCES el dit cap amunt per colpejar:
 *    · la DIRECCIÓ del lliscament apunta (cap a l'esquerra o la dreta)
 *    · la LLARGADA decideix la profunditat (curt = cop curt cap a la xarxa; llarg = fins al fons de la taula)
 *    · la VELOCITAT decideix la força (ràpid = cop fort i difícil de tornar, però més arriscat)
 *    · el MOMENT en què ho fas: un anell a la pilota es posa VERD quan ja és a la pala. Si lliscs en verd, és PERFECTE (precís i difícil per a en Jusef);
 *      si és una mica abans o després, és BÉ (amb una mica d'error); molt abans: «Massa aviat»; si la pilota ja ha passat: «Massa tard» (punt d'en Jusef).
 *  El lliscament es veu com una estela lluminosa. Sense lliscar, l'Ineu no colpeja (cal estar atent!).
 *  Servei (com a la realitat): la pilota bota PRIMER al camp de qui serveix i després passa la xarxa. El teu: llisca cap amunt (apuntes igual).
 *  El d'en Jusef: un de cada tres és MÀGIC: la pilota encantada fa zigzags i només un cop PERFECTE trenca l'encanteri (llavors en Jusef no la pot tornar);
 *  si el cop no és perfecte, l'encanteri resisteix i la pilota torna fluixa.
 *  Partit a 5 punts. Després de dues derrotes, s'ofereix el mode fàcil (anell verd més llarg, en Jusef falla més). Càmera mòbil.
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
    // finestra: segons (reals) abans d'arribar la pilota en què lliscar és PERFECTE · bona: fins on és «bé» · abast: fins on arriba l'Ineu (m)
    normal: { temps: 0.92, finestra: 0.26, bona: 0.75, abast: 0.45, abastJusef: 0.48, velJusef: 1.9, fallaJusef: 0.05 },
    facil:  { temps: 0.74, finestra: 0.36, bona: 1.0,  abast: 0.65, abastJusef: 0.40, velJusef: 1.5, fallaJusef: 0.12 }
};
const Z_COP = 0.05;           // fondària on l'Ineu colpeja la pilota

class Arcade extends Phaser.Scene {
    constructor() { super('Arcade'); }

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
        this.txtAjuda = this.ui(this.add.text(AMPLE / 2, ALT - 40, 'Llisca cap amunt quan l\'anell és verd · direcció = apunta · llargada = fondària · velocitat = força', est(19, '#c8b890')).setOrigin(0.5).setDepth(50));
        this.estelaG = this.ui(this.add.graphics().setDepth(48));
        // Estat
        this.Xi = 0; this.Xj = 0; this.lent = 1; this.zoomExtra = 0; this.punxo = null; this.traç = [];
        this.input.on('pointerdown', p => this.alPrimer(p));
        this.input.on('pointermove', p => this.alMoure(p));
        this.input.on('pointerup', p => this.alSoltar(p));
        // Teclat (per provar): ESPAI/amunt = cop recte; ←/→ = cop cap a aquell costat; (la força és la normal)
        this.input.keyboard.on('keydown-SPACE', () => this.gestura(0, -300, 300, 1.0));
        this.input.keyboard.on('keydown-UP', () => this.gestura(0, -300, 300, 1.0));
        this.input.keyboard.on('keydown-LEFT', () => this.gestura(-150, -260, 300, 1.0));
        this.input.keyboard.on('keydown-RIGHT', () => this.gestura(150, -260, 300, 1.0));
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
        this.serveix('jusef', { X: this.Xj, z: T.L + 0.25, h: 0.3 }, X, Phaser.Math.FloatBetween(0.35, 0.9), suau ? 1.15 : 0.95);
    }

    // ---- Servei màgic: la pilota encantada fa zigzags; només un cop PERFECTE trenca l'encanteri (i llavors en Jusef no la pot tornar) ----
    serveiMagic() {
        if (this.acabat) return;
        this.estat = 'res';
        this.tweens.add({ targets: this.auraJusef, fillAlpha: 0.4, duration: 300, yoyo: true, hold: 900 });
        this.avis('Servei màgic! Només un cop PERFECTE trenca l\'encanteri', 1700, '#d8b0ff');
        this.so('magia');
        this.time.delayedCall(1500, () => {
            if (this.acabat) return;
            this.estat = 'joc';
            const X = Phaser.Math.FloatBetween(-0.5, 0.5) || 0.3;
            this.serveix('jusef', { X: this.Xj, z: T.L + 0.25, h: 0.3 }, X, Phaser.Math.FloatBetween(0.35, 0.75), 0.85, true);
        });
    }

    // ---------------- Física de la pilota ----------------
    // Llança la pilota des de 'des' perquè boti a (Xt, zt) al cap de 'temps' segons (s'allarga si no passa la xarxa)
    // Velocitats per anar des de 'des' fins a botar a (Xt, zt) al cap de 'temps' segons (s'allarga si no passa la xarxa)
    vel(des, Xt, zt, temps) {
        let t = temps, vh;
        const vz = () => (zt - des.z) / t;
        for (let i = 0; i < 20; i++) {
            vh = (0 - des.h + 0.5 * T.G * t * t) / t;
            const tn = (T.L / 2 - des.z) / vz(), hn = des.h + vh * tn - 0.5 * T.G * tn * tn;
            if (tn < 0 || tn > t || hn > T.NH + 0.06) break;
            t += 0.06;
        }
        return { vx: (Xt - des.X) / t, vz: vz(), vh, t };
    }

    // SERVEI: la pilota ha de botar PRIMER al camp de qui serveix i després passar la xarxa i botar a l'altre camp
    serveix(qui, des, Xt, zt, temps, magica = false) {
        const z1 = qui === 'ineu' ? 0.55 : T.L - 0.55;
        const v = this.vel(des, des.X + (Xt - des.X) * 0.25, z1, 0.4);
        this.b = { X: des.X, z: des.z, h: des.h, vx: v.vx, vz: v.vz, vh: v.vh, de: qui, bots: 0, decidit: false, morta: false, marca: { X: Xt, z: zt },
                   serveix: { Xt, zt, t: temps }, magica, t0: Math.random() * 6.28 };
        this.pilota.setVisible(true).setFillStyle(magica ? 0xe0b8ff : 0xfff6e0).setStrokeStyle(3, magica ? 0x7a3aa8 : 0x8a7a50); this.ombra.setVisible(true);
        const pm = this.proj(Xt, zt);
        this.marcaBot.setPosition(pm.x, pm.y).setSize(46 * pm.k / 300 * 1.4, 18 * pm.k / 300 * 1.4).setStrokeStyle(3, magica ? 0xd8b0ff : 0xffd34d, qui === 'jusef' ? 0.75 : 0);
        this.so('pala');
    }

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
        this.pilota.setVisible(true).setFillStyle(0xfff6e0).setStrokeStyle(3, 0x8a7a50); this.ombra.setVisible(true);
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
        if (b && !b.morta && b.de === 'jusef' && b.serveix) objI = b.serveix.Xt;
        else if (b && !b.morta && b.de === 'jusef' && b.vz < 0) { const t = Math.max(0, (b.z - Z_COP) / -b.vz); objI = Phaser.Math.Clamp(b.X + b.vx * t, -0.72, 0.72); }
        else if (b && !b.morta && b.de === 'jusef') objI = b.marca.X;
        this.Xi += Phaser.Math.Clamp(objI - this.Xi, -7.5 * dt, 7.5 * dt);
        const pi = this.proj(this.Xi, T.Z_INEU);
        this.spIneu.setPosition(pi.x, pi.y).setScale(1.5 * pi.k / 400).setDepth(10 - T.Z_INEU);
        // Simulació de la pilota (el temps del joc va més lent que el real, segons el mode i el cop màgic)
        if (b && !b.morta) this.simula(dt * this.M.temps * this.lent);
        // Jusef: va cap a on arribarà la pilota
        let objJ = 0;
        if (this.b && this.b.de === 'ineu' && !this.b.morta) objJ = this.b.marca.X + this.b.vx * 0.35;
        const pasJ = this.M.velJusef * dt;
        this.Xj += Phaser.Math.Clamp(objJ - this.Xj, -pasJ, pasJ);
        const pj = this.proj(this.Xj, T.Z_JUSEF);
        const flota = Math.sin(time / 400) * 6;
        this.spJusef.setPosition(pj.x, pj.y + flota).setScale(0.74 * pj.k / 214).setDepth(10 - T.Z_JUSEF);
        this.auraJusef.setPosition(pj.x, pj.y - 120 + flota);
        if (this.estat === 'serveiIneu') {            // la pilota a la mà de l'Ineu
            const p = this.proj(this.Xi + 0.18, -0.15, 0.32 + Math.abs(Math.sin(time / 260)) * 0.12);
            this.pilota.setVisible(true).setPosition(p.x, p.y).setRadius(Math.max(9, 0.05 * p.k)).setDepth(21);
            this.ombra.setVisible(false);
        }
        this.pintaAnell();
        this.pintaEstela();
        this.movCamera(dt);
    }

    // L'anell que es posa VERD quan toca lliscar: es veu a la pilota que arriba i passa de gris (lluny) a groc (a prop) a verd (ara!)
    pintaAnell() {
        const g = this.anell, b = this.b; g.clear();
        if (!b || b.morta || b.de !== 'jusef' || b.bots !== 1 || this.copFet === b) return;
        const eta = this.eta(b), F = this.M.finestra, B = this.M.bona, p = this.proj(this.visX(b), b.z, b.h);
        const r = Math.max(22, 0.05 * p.k * 2.4);
        if (eta <= B) {
            g.lineStyle(7, 0x58ff8a, 1).strokeCircle(p.x, p.y, r);                                                   // verd: ja pots lliscar
            if (eta <= F) g.lineStyle(6, 0xffffff, 1).strokeCircle(p.x, p.y, r * 0.66).lineStyle(3, 0x7ad8ff, 0.9).strokeCircle(p.x, p.y, r * 1.18);     // moment perfecte
        }
        else if (eta <= B * 2.2) g.lineStyle(5, 0xffd34d, 0.85).strokeCircle(p.x, p.y, r * (1 + Math.min(1, (eta - B) / (B * 1.2)) * 0.8));
        else g.lineStyle(3, 0xffffff, 0.3).strokeCircle(p.x, p.y, r * 1.8);
    }
    // posició X que es dibuixa (la pilota encantada fa zigzags, però la física i els cops fan servir b.X)
    visX(b) {
        if (!b.magica) return b.X;
        const env = b.bots === 0 ? 1 : Phaser.Math.Clamp((b.z - 0.35) / 1.1, 0, 1);
        return b.X + Math.sin(b.z * 8.5 + b.t0) * 0.3 * env;
    }

    // segons REALS que falten perquè la pilota arribi a l'Ineu
    eta(b) { return b.vz < 0 ? Math.max(0, (b.z - Z_COP) / -b.vz) / (this.M.temps * this.lent) : 99; }

    // L'estela lluminosa del lliscament
    pintaEstela() {
        const g = this.estelaG; g.clear();
        const t = this.traç; if (!t.length) return;
        const ara = this.time.now;
        while (t.length && ara - t[0].t > 700) t.shift();
        for (let i = 1; i < t.length; i++) { const a = 1 - (ara - t[i].t) / 700; g.lineStyle(14 * a + 3, 0xfff0a0, Math.max(0.1, a)).lineBetween(t[i - 1].x, t[i - 1].y, t[i].x, t[i].y); }
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
            if (b.de === 'jusef' && b.bots === 1 && this.copFet !== b && b.vz < 0 && b.z <= Z_COP - 0.12) { this.copFet = b; this.txtCopa('Massa tard!', '#ff9a7a', this.proj(b.X, b.z, b.h)); this.so('mal'); }
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
                    if (banda === b.de) {
                        if (b.serveix) { const sv = b.serveix; b.serveix = null; const v = this.vel({ X: b.X, z: b.z, h: 0 }, sv.Xt, sv.zt, sv.t); b.vx = v.vx; b.vz = v.vz; b.vh = v.vh; continue; }     // servei: primer bot al seu camp
                        this.finalBola(b.de === 'ineu' ? 'jusef' : 'ineu', 'Ha botat al seu camp'); return;
                    }
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
        const b = this.b, p = this.proj(this.visX(b), b.z, b.h), s = this.proj(b.X, b.z, 0);
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

    // ---------------- El gest: un lliscament cap amunt ----------------
    alPrimer(p) {
        this.punxo = { x: p.x, y: p.y, t: this.time.now }; this.traç = [{ x: p.x, y: p.y, t: this.time.now }];
    }
    alMoure(p) { if (this.punxo) this.traç.push({ x: p.x, y: p.y, t: this.time.now }); }
    alSoltar(p) {
        if (!this.punxo || this.acabat) { this.punxo = null; return; }
        const ini = this.punxo; this.punxo = null;
        const dx = p.x - ini.x, dy = p.y - ini.y, len = Math.hypot(dx, dy), ms = Math.max(30, this.time.now - ini.t);
        this.gestura(dx, dy, len, len / ms);
    }
    gestura(dx, dy, len, vel) {
        if (this.acabat) return;
        if (this.txtAjuda) this.txtAjuda.setAlpha(0);
        if (len < 40 || dy > -20) { this.avisCurt('Llisca cap amunt!'); return; }                       // un toc o un lliscament cap avall no és un cop
        // Paràmetres del cop: direcció (aim), profunditat (0..1) i força (0..1)
        const aim = Phaser.Math.Clamp(dx / Math.max(60, -dy), -1, 1) * 0.66;
        const prof = Phaser.Math.Clamp((len - 70) / 360, 0, 1);
        const forca = Phaser.Math.Clamp((vel - 0.35) / 1.5, 0, 1);               // vel en px/ms
        if (this.estat === 'serveiIneu') {
            this.estat = 'joc';
            this.gest(aim >= this.Xi);
            this.serveix('ineu', { X: this.Xi + 0.18, z: -0.15, h: 0.3 }, Phaser.Math.Clamp(aim, -0.62, 0.62), T.L * (0.62 + 0.3 * prof), 0.95 - 0.2 * forca);
            this.b.qualitat = 'be'; this.b.tipus = 'normal';
            return;
        }
        const b = this.b;
        if (this.estat !== 'joc' || !b || b.morta || b.de !== 'jusef') return;
        if (b.bots < 1) { this.avisCurt('Massa aviat'); return; }
        const eta = this.eta(b);
        if (this.copFet === b) return;
        if (eta > this.M.bona) { this.avisCurt('Massa aviat'); return; }                   // encara no: es pot tornar a intentar
        this.copFet = b;
        this.copIneu(aim, prof, forca, eta);
    }
    avisCurt(t) { const bp = this.b && !this.b.morta ? this.proj(this.b.X, this.b.z, this.b.h) : { x: AMPLE / 2, y: 900 }; this.txtCopa(t, '#ffd34d', bp); }

    // El cop de l'Ineu, amb el que ha fet el dit
    copIneu(aim, prof, forca, eta) {
        const b = this.b, M = this.M;
        if (Math.abs(b.X - this.Xi) > M.abast) { this.txtCopa('Massa lluny!', '#ff9a7a', this.proj(b.X, b.z, b.h)); this.b.bots = 2; this.finalBola('jusef', 'No hi has arribat'); return; }
        const q = eta <= M.finestra ? 'perfecte' : 'be';
        // Errada: un cop perfecte és exacte; un de bé té un petit error (més gran com més fort i més lluny)
        const err = q === 'perfecte' ? 0 : (0.07 + 0.16 * forca);
        const Xt = Phaser.Math.Clamp(aim + Phaser.Math.FloatBetween(-err, err), -0.78, 0.78);
        let zt = T.L * 0.5 + 0.3 + prof * (T.L * 0.5 - 0.35) + (q === 'perfecte' ? 0 : Phaser.Math.FloatBetween(-err, err * 1.5));
        const temps = 1.0 - 0.52 * forca;
        this.gest(Xt >= this.Xi);
        this.llanca('ineu', { X: b.X, z: b.z, h: Math.max(0.12, b.h) }, Xt, zt, temps);
        this.b.qualitat = forca > 0.65 ? 'perfecte' : q; this.b.tipus = forca > 0.65 ? 'fort' : prof < 0.3 ? 'tallat' : 'normal';
        const noms = { normal: 'Bé', fort: 'FORT!', tallat: 'Tallat!' };
        const bp = this.proj(b.X, b.z, b.h);
        if (b.magica) {
            if (q === 'perfecte') { this.b.tipus = 'magic'; this.b.qualitat = 'perfecte'; this.txtCopa('ENCANTERI TRENCAT!', '#d8b0ff', bp); this.so('magia'); this.zoomExtra = 0.1; }
            else { this.b.qualitat = 'fluix'; this.b.tipus = 'normal'; this.txtCopa('L\'encanteri resisteix...', '#ff9a7a', bp); }
        } else
        this.txtCopa(q === 'perfecte' ? 'PERFECTE ' + noms[this.b.tipus] : noms[this.b.tipus], q === 'perfecte' ? '#7ad8ff' : '#a0ffb0', bp);
        if (q === 'perfecte' || forca > 0.65) { this.cameras.main.shake(130, 0.005); this.zoomExtra = 0.07; this.so('fort'); }
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
    scene: [Arcade]
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
