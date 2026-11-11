/**
 * PROTOTIP 2 DEL PING-PONG: SUPERVIVÈNCIA (fora del joc principal: proves/pingpong/supervivencia.html)
 *
 * Reflexos purs, vista de dalt, un sol dit:
 *  - Arrossegues la pala (a baix) d'un costat a l'altre. La pilota rebota a les parets i en en Jusef (a dalt), que sempre la hi torna.
 *  - Cada cop d'en Jusef fa la pilota una mica més ràpida. Has d'aguantar META segons sense deixar-la passar.
 *  - On toca la pilota a la pala decideix l'angle (vora = molt en diagonal; centre = recte).
 *  - Tens 3 vides. Si la deixes passar, perds una vida i la pilota torna a sortir (una mica més lenta).
 *  - En Jusef et posa obstacles: núvols de BOIRA que desvien la pilota (ratllen la trajectòria) i, cap al final, una SEGONA pilota (el servei màgic).
 *  - Després de perdre dues vegades, s'ofereix el mode fàcil (pala més ample, pilota més lenta, menys boira).
 */
const AMPLE = 720, ALT = 1280;
const META = 45;                          // segons que cal aguantar
const T = { x0: 70, x1: 650, y0: 250, y1: 1130 };      // la taula vista de dalt
const MODES = {
    normal: { pala: 150, v0: 430, creix: 1.06, vMax: 1250, boira: [7000, 4200], vides: 3, extra: 28 },
    facil:  { pala: 210, v0: 340, creix: 1.04, vMax: 900,  boira: [11000, 5200], vides: 4, extra: 999 }
};

class Supervivencia extends Phaser.Scene {
    constructor() { super('Supervivencia'); }

    preload() {
        this.load.spritesheet('pp_drive', '../../assets/ineu/pp_drive.webp', { frameWidth: 256, frameHeight: 256 });
        this.load.image('jusef_levita', '../../assets/personatges/jusef_levita.webp');
    }

    create() {
        this.mode = 'normal'; this.derrotes = 0; this.audio = null;
        const g = this.add.graphics().setDepth(0);
        g.fillGradientStyle(0x2a1c12, 0x2a1c12, 0x120c08, 0x120c08, 1).fillRect(0, 0, AMPLE, ALT);
        g.fillStyle(0x0f3a26, 1).fillRect(T.x0 - 10, T.y0 - 10, T.x1 - T.x0 + 20, T.y1 - T.y0 + 20);
        g.fillStyle(0x1d6b46, 1).fillRect(T.x0, T.y0, T.x1 - T.x0, T.y1 - T.y0);
        g.lineStyle(5, 0xf2f2e8, 0.9).strokeRect(T.x0, T.y0, T.x1 - T.x0, T.y1 - T.y0);
        g.lineStyle(3, 0xf2f2e8, 0.5).lineBetween(T.x0, (T.y0 + T.y1) / 2, T.x1, (T.y0 + T.y1) / 2);
        g.lineStyle(3, 0xf2f2e8, 0.35).lineBetween(AMPLE / 2, T.y0, AMPLE / 2, T.y1);
        // Jusef (a dalt) i l'Ineu (a baix, com un fantasma transparent darrere la pala)
        this.jusef = this.add.image(AMPLE / 2, T.y0 - 6, 'jusef_levita').setOrigin(0.5, 1).setScale(0.5).setDepth(5);
        this.aura = this.add.ellipse(AMPLE / 2, T.y0 - 90, 140, 170, 0xb890ff, 0).setDepth(4);
        this.anims.create({ key: 'drive', frames: this.anims.generateFrameNumbers('pp_drive', { start: 4, end: 15 }), frameRate: 36 });
        this.ineu = this.add.sprite(AMPLE / 2, T.y1 + 150, 'pp_drive', 0).setOrigin(0.5, 0.94).setScale(0.9).setAlpha(0.55).setDepth(5);
        this.ineu.on('animationcomplete', () => this.ineu.setFrame(0));
        // Pales i pilota
        this.palaJ = this.add.rectangle(AMPLE / 2, T.y0 + 34, 150, 22, 0xd02a22).setStrokeStyle(4, 0x4a0e0a).setDepth(6);
        this.pala = this.add.rectangle(AMPLE / 2, T.y1 - 50, 150, 26, 0xd02a22).setStrokeStyle(4, 0x4a0e0a).setDepth(6);
        this.bolles = [];
        this.boires = [];
        this.rastres = this.add.graphics().setDepth(3);
        // Text
        const est = (m, c) => ({ fontFamily: 'Georgia, serif', fontSize: m + 'px', color: c, stroke: '#1a0e06', strokeThickness: 6, align: 'center' });
        this.est = est;
        this.txtTemps = this.add.text(30, 60, '', est(54, '#f2e6c8')).setOrigin(0, 0.5).setDepth(50);
        this.txtVides = this.add.text(30, 105, '', est(40, '#ff7a7a')).setDepth(50);
        this.txtVel = this.add.text(30, 168, '', est(24, '#c8b890')).setOrigin(0, 0.5).setDepth(50);
        this.txtAvis = this.add.text(AMPLE / 2, 640, '', est(44, '#ffd34d')).setOrigin(0.5).setDepth(50);
        this.txtAjuda = this.add.text(AMPLE / 2, ALT - 50, 'Arrossega la pala · No deixis passar la pilota!', est(22, '#c8b890')).setOrigin(0.5).setDepth(50);
        // Entrada: la pala segueix el dit / ratolí (en horitzontal)
        this.objX = AMPLE / 2;
        this.input.on('pointermove', p => { this.objX = p.x; });
        this.input.on('pointerdown', p => { this.objX = p.x; this.toc(); });
        this.tecles = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown-SPACE', () => this.toc());
        this.nouJoc();
    }
    get M() { return MODES[this.mode]; }

    // ---------------- Partida ----------------
    nouJoc() {
        if (this.capa) { this.capa.destroy(); this.capa = null; }
        this.bolles.forEach(b => b.s.destroy()); this.bolles = [];
        this.boires.forEach(b => b.s.destroy()); this.boires = [];
        this.vides = this.M.vides; this.temps = 0; this.vel = this.M.v0; this.acabat = false; this.estat = 'espera';
        this.proximaBoira = this.M.boira[0] / 1000; this.extraFet = false;
        this.pala.width = this.M.pala; this.palaJ.width = this.M.pala;
        this.actualitzaHud();
        this.avis('Toca per començar', 1500000, '#f2e6c8');
    }
    toc() {
        if (this.txtAjuda) this.txtAjuda.setAlpha(0);
        if (this.estat !== 'espera') return;
        this.txtAvis.setAlpha(0); this.tweens.killTweensOf(this.txtAvis);
        this.estat = 'joc';
        this.llancaBola(true);
    }
    actualitzaHud() {
        this.txtTemps.setText(`${Math.floor(this.temps)} / ${META} s`);
        this.txtVides.setText('♥'.repeat(Math.max(0, this.vides)) + '♡'.repeat(Math.max(0, this.M.vides - this.vides)));
        this.txtVel.setText(`velocitat ×${(this.vel / this.M.v0).toFixed(1)}`);
    }

    llancaBola(inicial, extra = false) {
        const s = this.add.circle(AMPLE / 2, T.y0 + 140, 17, extra ? 0xffb0ff : 0xfff6e0).setStrokeStyle(3, extra ? 0x8a3a8a : 0x8a7a50).setDepth(20);
        const a = Math.PI / 2 + Phaser.Math.FloatBetween(-0.5, 0.5);              // cap avall, una mica de biaix
        const v = inicial ? this.vel : this.vel * 0.85;
        const b = { s, x: s.x, y: s.y, vx: Math.cos(a) * v * (Math.random() < 0.5 ? -1 : 1), vy: Math.sin(a) * v, extra, tocaBoira: null };
        this.bolles.push(b);
        return b;
    }

    // ---------------- Bucle ----------------
    update(time, delta) {
        const dt = Math.min(0.033, delta / 1000);
        // Pala
        if (this.tecles.left.isDown) this.objX -= 900 * dt;
        if (this.tecles.right.isDown) this.objX += 900 * dt;
        this.objX = Phaser.Math.Clamp(this.objX, T.x0 + this.pala.width / 2, T.x1 - this.pala.width / 2);
        this.pala.x = this.objX;
        this.ineu.x = Phaser.Math.Linear(this.ineu.x, this.objX, 0.35);
        this.jusef.y = T.y0 - 6 + Math.sin(time / 420) * 5;
        this.aura.y = this.jusef.y - 70;
        if (this.estat !== 'joc') return;
        this.temps += dt;
        // Boira
        if (this.temps >= this.proximaBoira) { this.creaBoira(); this.proximaBoira = this.temps + this.M.boira[1] / 1000; }
        this.boires = this.boires.filter(b => { b.vida -= dt; b.s.setAlpha(Math.min(0.7, b.vida * 0.8, (b.s.alphaMax || 0.7))); b.s.scale = b.r / 70 * (1 + Math.sin(time / 300 + b.r) * 0.05); if (b.vida <= 0) { b.s.destroy(); return false; } return true; });
        // Segona pilota (el servei màgic d'en Jusef)
        if (!this.extraFet && this.temps >= this.M.extra) { this.extraFet = true; this.avis('Servei màgic: una segona pilota!', 1600, '#d8b0ff'); this.so('magia'); this.llancaBola(false, true); }
        // Pilotes
        this.rastres.clear();
        const vistes = [...this.bolles];
        vistes.forEach(b => this.mouBola(b, dt));
        // Jusef segueix la pilota que té més a prop de dalt
        const alta = this.bolles.reduce((m, b) => (!m || b.y < m.y ? b : m), null);
        if (alta) { const objJ = alta.x; this.palaJ.x += Phaser.Math.Clamp(objJ - this.palaJ.x, -this.vel * 1.05 * dt, this.vel * 1.05 * dt); this.palaJ.x = Phaser.Math.Clamp(this.palaJ.x, T.x0 + this.palaJ.width / 2, T.x1 - this.palaJ.width / 2); }
        this.jusef.x = Phaser.Math.Linear(this.jusef.x, this.palaJ.x, 0.1); this.aura.x = this.jusef.x;
        this.actualitzaHud();
        if (this.temps >= META && !this.acabat) this.final(true);
    }

    mouBola(b, dt) {
        const n = Math.ceil(Math.hypot(b.vx, b.vy) * dt / 8);
        for (let i = 0; i < n; i++) {
            b.x += b.vx * dt / n; b.y += b.vy * dt / n;
            const r = 17;
            // parets laterals
            if (b.x < T.x0 + r) { b.x = T.x0 + r; b.vx = Math.abs(b.vx); this.so('bot'); }
            if (b.x > T.x1 - r) { b.x = T.x1 - r; b.vx = -Math.abs(b.vx); this.so('bot'); }
            // pala d'en Jusef (a dalt): sempre la torna, amb un angle una mica a l'atzar; cada cop la pilota va més ràpida
            if (b.vy < 0 && b.y - r <= this.palaJ.y + 11 && b.y > this.palaJ.y - 20) {
                b.y = this.palaJ.y + 11 + r;
                this.vel = Math.min(this.M.vMax, this.vel * this.M.creix);
                const a = Phaser.Math.FloatBetween(-0.85, 0.85);
                this.fixaVelocitat(b, a, 1);
                this.so('pala'); this.tremola(0.002, 70);
            }
            // pala de l'Ineu
            if (b.vy > 0 && b.y + r >= this.pala.y - 13 && b.y - r < this.pala.y + 10 && Math.abs(b.x - this.pala.x) <= this.pala.width / 2 + r * 0.6) {
                b.y = this.pala.y - 13 - r;
                const t = Phaser.Math.Clamp((b.x - this.pala.x) / (this.pala.width / 2 + r * 0.6), -1, 1);
                this.fixaVelocitat(b, t * 1.05, -1);
                this.ineu.play('drive', true);
                this.so('pala'); this.tremola(0.003, 90);
            }
            // boira
            for (const m of this.boires) {
                if (Phaser.Math.Distance.Between(b.x, b.y, m.s.x, m.s.y) < m.r + r * 0.4 && b.tocaBoira !== m) {
                    b.tocaBoira = m;
                    const a = Math.atan2(b.y - m.s.y, b.x - m.s.x) + Phaser.Math.FloatBetween(-0.7, 0.7);
                    const v = Math.hypot(b.vx, b.vy);
                    b.vx = Math.cos(a) * v; b.vy = Math.sin(a) * v;
                    if (Math.abs(b.vy) < v * 0.3) b.vy = Math.sign(b.vy || 1) * v * 0.3;
                    this.so('boira'); m.vida = Math.min(m.vida, 0.6);
                } else if (Phaser.Math.Distance.Between(b.x, b.y, m.s.x, m.s.y) > m.r + r) { if (b.tocaBoira === m) b.tocaBoira = null; }
            }
            // la deixes passar
            if (b.y > T.y1 + 30) { this.perd(b); return; }
            if (b.y < T.y0 - 40) { b.y = T.y0 + 80; b.vy = Math.abs(b.vy); }
        }
        b.s.setPosition(b.x, b.y);
    }

    // Fixa la direcció de la pilota per un angle (0 = recte, ±1 ≈ 60° de diagonal) a velocitat 'this.vel'; dir: 1 cap avall, -1 cap amunt
    fixaVelocitat(b, a, dir) {
        const ang = Phaser.Math.Clamp(a, -1.05, 1.05) * 1.05;
        b.vx = Math.sin(ang) * this.vel; b.vy = dir * Math.cos(ang) * this.vel;
    }

    creaBoira() {
        const r = Phaser.Math.Between(55, 95);
        const x = Phaser.Math.Between(T.x0 + 120, T.x1 - 120), y = Phaser.Math.Between(T.y0 + 260, T.y1 - 360);
        const s = this.add.circle(x, y, 70, 0xcfc0ff, 0.6).setDepth(8).setScale(r / 70).setBlendMode(Phaser.BlendModes.ADD);
        this.boires.push({ s, r, vida: 5.5 });
        this.so('magia');
    }

    perd(b) {
        this.so('mal'); this.tremola(0.008, 220);
        b.s.destroy(); this.bolles = this.bolles.filter(x => x !== b);
        if (b.extra) return;                                     // la segona pilota només molesta: no costa vida
        this.vides--;
        this.bolles.forEach(x => x.s.destroy()); this.bolles = [];
        this.actualitzaHud();
        if (this.vides <= 0) { this.final(false); return; }
        this.vel = Math.max(this.M.v0, this.vel * 0.8);
        this.estat = 'pausa';
        this.avis('Una vida menys!', 900, '#ff9a7a');
        this.time.delayedCall(1100, () => { if (this.acabat) return; this.estat = 'joc'; this.llancaBola(false); if (this.temps >= this.M.extra) this.llancaBola(false, true); });
    }

    tremola(f, ms) { this.cameras.main.shake(ms, f); }
    avis(text, ms, color) {
        this.txtAvis.setText(text).setColor(color).setAlpha(1);
        this.tweens.killTweensOf(this.txtAvis);
        this.tweens.add({ targets: this.txtAvis, alpha: 0, delay: ms, duration: 300 });
    }

    // ---------------- Final ----------------
    final(guanyat) {
        this.acabat = true; this.estat = 'final';
        if (!guanyat) this.derrotes++;
        this.bolles.forEach(b => b.s.destroy()); this.bolles = [];
        const c = this.capa = this.add.container(0, 0).setDepth(100);
        c.add(this.add.rectangle(0, 0, AMPLE, ALT, 0x000000, 0.65).setOrigin(0).setInteractive());
        const est = (m, col) => ({ fontFamily: 'Georgia, serif', fontSize: m + 'px', color: col, stroke: '#1a0e06', strokeThickness: 6, align: 'center', wordWrap: { width: 600 } });
        c.add(this.add.text(AMPLE / 2, 420, guanyat ? 'Has aguantat!\nEn Jusef t\'ho reconeix.' : 'La pilota ha passat...', est(50, guanyat ? '#a0ffb0' : '#ff9a7a')).setOrigin(0.5));
        c.add(this.add.text(AMPLE / 2, 560, `${Math.floor(this.temps)} segons de ${META}`, est(38, '#f2e6c8')).setOrigin(0.5));
        const boto = (y, text, fn) => {
            const r = this.add.rectangle(AMPLE / 2, y, 460, 90, 0x6a4426, 1).setStrokeStyle(4, 0xd4af37).setInteractive({ useHandCursor: true });
            const t = this.add.text(AMPLE / 2, y, text, est(32, '#f2e6c8')).setOrigin(0.5);
            r.on('pointerdown', (p, x, y2, ev) => { ev.stopPropagation(); fn(); });
            c.add([r, t]);
        };
        if (!guanyat && this.derrotes >= 2 && this.mode !== 'facil') {
            c.add(this.add.text(AMPLE / 2, 680, 'Vols provar el mode fàcil?\n(pala més ample, pilota més lenta)', est(28, '#f2e6c8')).setOrigin(0.5));
            boto(800, 'Sí, més fàcil', () => { this.mode = 'facil'; this.nouJoc(); });
            boto(920, 'No, igual', () => this.nouJoc());
        } else {
            boto(740, 'Tornar a jugar', () => this.nouJoc());
            if (this.mode === 'facil') boto(860, 'Tornar al mode normal', () => { this.mode = 'normal'; this.nouJoc(); });
        }
    }

    // ---------------- So (WebAudio) ----------------
    so(tipus) {
        try {
            if (!this.audio) this.audio = new (window.AudioContext || window.webkitAudioContext)();
            const a = this.audio, t = a.currentTime, o = a.createOscillator(), g = a.createGain();
            const def = { bot: [900, 0.04, 'square', 0.06], pala: [520, 0.07, 'triangle', 0.22], mal: [170, 0.3, 'sine', 0.22], magia: [660, 0.5, 'sine', 0.14], boira: [330, 0.18, 'sawtooth', 0.1] }[tipus];
            if (!def) return;
            o.type = def[2]; o.frequency.setValueAtTime(def[0], t);
            if (tipus === 'magia') o.frequency.exponentialRampToValueAtTime(1320, t + def[1]);
            g.gain.setValueAtTime(def[3], t); g.gain.exponentialRampToValueAtTime(0.001, t + def[1]);
            o.connect(g).connect(a.destination); o.start(t); o.stop(t + def[1] + 0.02);
        } catch (e) { /* sense àudio */ }
    }
}

window.ppJoc = new Phaser.Game({
    type: Phaser.AUTO, parent: 'joc', width: AMPLE, height: ALT, backgroundColor: '#0d0b09',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    input: { activePointers: 2 },
    scene: [Supervivencia]
});
