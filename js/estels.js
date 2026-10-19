/**
 * ELS DIPÒSITS: "Les Llàgrimes de Sant Llorenç"
 * Mirant pel telescopi del Garf. Part 1: compta 7 estels fugaços (apunta amb el cursor i prem ESPAI o clic).
 * Part 2: uneix els 7 punts en ordre i apareix la constel·lació amagada: un ocell sortint d'una gàbia oberta.
 * Controls: ratolí o fletxes/WASD per moure el cercle; ESPAI/ENTER/clic per triar; ESC per sortir (es desa el progrés).
 */
const ESTELS_PUNTS = [
    [640, 520], [640, 410], [640, 320], [540, 380], [450, 320], [740, 380], [830, 320]
];
const ESTELS_LINIES = [[1, 2], [2, 3], [2, 4], [4, 5], [2, 6], [6, 7]];

// Final de la missió: l'Ineu té l'Estel de Sant Llorenç
function completarEstels() {
    const E = Estat;
    E.posaFlag("estelLlorenc"); E.dona("estel_llorenc");
    const ui = game.scene.getScene("UI");
    E.posaObjectiu("L'estel apunta al sud-est: el Dolmen, passats els Dipòsits. Allà dorm Runna.");
    if (ui) ui.obrirDialeg({ pagines: [
        { qui: "Ineu", text: "Set estels... i un ocell que s'enlaira d'una gàbia oberta. És la nit de les llàgrimes de Sant Llorenç!" },
        { qui: "", text: "Un dels estels fugaços es desprèn del cel i cau, lentíssim, fins a les teves mans: una gota de llum freda.\nHas obtingut l'ESTEL DE SANT LLORENÇ." },
        { qui: "Ineu", text: "Apunta cap al sud-est. Passats els Dipòsits... el Dolmen." }
    ] }, () => E.desar());
}

class EscenaEstels extends Phaser.Scene {
    constructor() { super("Estels"); }

    create() {
        const F = Estat.dades.flags;
        this.part = F.estelsPart1 ? 2 : 1;
        this.compte = F.estelsCompt || 0;
        this.seguent = 1;
        this.estrelles = [];
        this.tancat = false;
        this.punts = [];

        // Cel de nit amb estrelles fixes que parpellegen
        this.add.rectangle(0, 0, AMPLE, ALT, 0x050818, 1).setOrigin(0);
        for (let i = 0; i < 140; i++) {
            const e = this.add.circle(Math.random() * AMPLE, Math.random() * ALT, Math.random() < 0.15 ? 2 : 1, 0xffffff, 0.3 + Math.random() * 0.5);
            this.tweens.add({ targets: e, alpha: 0.1, yoyo: true, repeat: -1, duration: 600 + Math.random() * 1800, delay: Math.random() * 1500 });
        }
        this.cel = this.add.graphics();
        this.fletxa = this.add.graphics();

        this.titol = this.add.text(AMPLE / 2, 28, "Telescopi del Garf", estilText(22, "#ffd34d", { fontStyle: "bold" })).setOrigin(0.5);
        this.info = this.add.text(AMPLE / 2, 62, "", estilText(17, "#d8e0ff", { fontStyle: "italic" })).setOrigin(0.5);
        this.missatge = this.add.text(AMPLE / 2, ALT - 40, "ESC: deixar el telescopi (el progrés es desa)", estilText(14, "#8a90b0")).setOrigin(0.5);

        // Cercle d'apuntar
        this.rx = AMPLE / 2; this.ry = ALT / 2;
        this.cursor = this.add.circle(this.rx, this.ry, 34).setStrokeStyle(3, 0xffd34d, 0.95);
        this.cursor.setDepth(10);
        this.keys = this.input.keyboard.addKeys("W,A,S,D,SPACE,ENTER,ESC,UP,DOWN,LEFT,RIGHT");
        this.input.on("pointermove", p => { this.rx = p.x; this.ry = p.y; });
        this.input.on("pointerdown", p => { this.rx = p.x; this.ry = p.y; this.triar(); });
        this.keys.SPACE.on("down", () => this.triar());
        this.keys.ENTER.on("down", () => this.triar());
        this.keys.ESC.on("down", () => this.tancar(false));

        if (this.part === 1) this.iniciarPart1(); else this.iniciarPart2();
    }

    // ---------- Part 1: estels fugaços ----------
    iniciarPart1() {
        this.info.setText(`Compta els estels fugaços: apunta i prem ESPAI quan en creuï un.   ${this.compte}/7`);
        this.propEstrella = this.time.now + 900;
    }

    nouEstel() {
        const a = 0.35 + Math.random() * 0.4, v = 360 + Math.random() * 120;
        this.estrelles.push({ x: -40 + Math.random() * 500, y: -30 + Math.random() * 220, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vida: 1900 });
    }

    // ---------- Part 2: constel·lació ----------
    iniciarPart2() {
        this.info.setText("Les llàgrimes dibuixen alguna cosa... Uneix els 7 punts en ordre (1 a 7).");
        ESTELS_PUNTS.forEach(([x, y], i) => {
            const c = this.add.circle(x, y, 9, 0xaac8ff, 0.7);
            this.tweens.add({ targets: c, alpha: 0.35, yoyo: true, repeat: -1, duration: 700 + i * 90 });
            const n = this.add.text(x + 16, y - 24, String(i + 1), estilText(18, "#aac8ff"));
            this.punts.push({ x, y, c, n });
        });
    }

    triar() {
        if (this.tancat) return;
        if (this.part === 1) {
            const e = this.estrelles.find(s => Phaser.Math.Distance.Between(s.x, s.y, this.rx, this.ry) < 80);
            if (e) {
                e.vida = 0;
                this.compte++;
                Estat.dades.flags.estelsCompt = this.compte;
                const flaix = this.add.circle(e.x, e.y, 10, 0xffffff, 0.9);
                this.tweens.add({ targets: flaix, radius: 70, alpha: 0, duration: 450, onComplete: () => flaix.destroy() });
                this.so(this.compte);
                this.info.setText(`Compta els estels fugaços: apunta i prem ESPAI quan en creuï un.   ${this.compte}/7`);
                if (this.compte >= 7) {
                    Estat.posaFlag("estelsPart1");
                    this.estrelles = [];
                    this.info.setText("Set estels! Ara, mira bé el cel...");
                    this.time.delayedCall(1800, () => { this.part = 2; this.iniciarPart2(); });
                }
            } else {
                this.missatge.setText("Hi era... un moment abans. Torna a provar-ho.");
            }
            return;
        }
        // Part 2
        const p = this.punts.findIndex(q => Phaser.Math.Distance.Between(q.x, q.y, this.rx, this.ry) < 55);
        if (p < 0) return;
        if (p + 1 !== this.seguent) {
            this.missatge.setText("No és aquest: continua pel " + this.seguent + ".");
            this.cameras.main.shake(100, 0.004);
            return;
        }
        this.so(p + 1);
        this.punts[p].c.setFillStyle(0xffe08a, 1).setScale(1.5);
        this.punts[p].n.setColor("#ffe08a");
        ESTELS_LINIES.filter(([a, b]) => Math.max(a, b) === this.seguent).forEach(([a, b]) => {
            this.fletxa.lineStyle(3, 0xffe08a, 0.9).lineBetween(ESTELS_PUNTS[a - 1][0], ESTELS_PUNTS[a - 1][1], ESTELS_PUNTS[b - 1][0], ESTELS_PUNTS[b - 1][1]);
        });
        this.seguent++;
        if (this.seguent > 7) this.completar();
    }

    completar() {
        this.tancat = true;
        // Gàbia oberta al voltant de l'ocell
        const g = this.fletxa;
        g.lineStyle(3, 0xd4af37, 0.9);
        for (let x = 410; x <= 870; x += 60) g.lineBetween(x, 560, x, 280);
        g.lineBetween(410, 560, 870, 560);
        g.beginPath().arc(640, 280, 230, Math.PI, Math.PI * 1.45).strokePath();   // el sostre queda obert per un costat
        this.info.setText("Un ocell que s'enlaira d'una gàbia oberta... i una fletxa cap al sud-est.");
        const fletxa = this.add.text(980, 600, "⬊", estilText(70, "#ffe08a"));
        this.tweens.add({ targets: fletxa, x: 1040, y: 640, yoyo: true, repeat: -1, duration: 600 });
        [1, 3, 2].forEach((n, i) => this.time.delayedCall(i * 350, () => this.so(n + 1)));
        this.time.delayedCall(3500, () => this.tancar(true));
    }

    so(n) {
        const ctx = this.sound && this.sound.context;
        if (!ctx) return;
        if (ctx.state === "suspended") ctx.resume();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine"; o.frequency.value = 330 + n * 60;
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
        o.connect(g); g.connect(ctx.destination);
        o.start(); o.stop(ctx.currentTime + 0.65);
    }

    update(time, delta) {
        if (this.tancat && this.part === 1) return;
        // moviment del cercle amb teclat
        const k = this.keys, v = 480 * delta / 1000;
        if (k.LEFT.isDown || k.A.isDown) this.rx -= v;
        if (k.RIGHT.isDown || k.D.isDown) this.rx += v;
        if (k.UP.isDown || k.W.isDown) this.ry -= v;
        if (k.DOWN.isDown || k.S.isDown) this.ry += v;
        this.rx = Phaser.Math.Clamp(this.rx, 0, AMPLE); this.ry = Phaser.Math.Clamp(this.ry, 0, ALT);
        this.cursor.setPosition(this.rx, this.ry);

        if (this.part === 1) {
            if (this.time.now > this.propEstrella) {
                this.nouEstel();
                this.propEstrella = this.time.now + 1100 + Math.random() * 900;
            }
            this.cel.clear();
            this.estrelles.forEach(s => {
                s.x += s.vx * delta / 1000; s.y += s.vy * delta / 1000; s.vida -= delta;
                const l = Math.hypot(s.vx, s.vy);
                this.cel.lineStyle(3, 0xffffff, 0.35).lineBetween(s.x, s.y, s.x - s.vx / l * 110, s.y - s.vy / l * 110);
                this.cel.lineStyle(2, 0xffffff, 0.8).lineBetween(s.x, s.y, s.x - s.vx / l * 40, s.y - s.vy / l * 40);
                this.cel.fillStyle(0xffffff, 1).fillCircle(s.x, s.y, 4);
            });
            this.estrelles = this.estrelles.filter(s => s.vida > 0);
        }
    }

    tancar(exit) {
        if (this.scene.isActive("Estels") === false) return;
        const ui = this.scene.get("UI");
        if (ui) ui.bloquejatFins = ui.time.now + 300;
        Estat.desar();
        this.scene.stop();
        if (exit) completarEstels();
    }
}
