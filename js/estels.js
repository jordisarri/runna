/**
 * ELS DIPÒSITS: "Les Llàgrimes de Sant Llorenç"
 * Mirant pel telescopi del Galf. Part 1: compta 7 estels fugaços blancs, les llàgrimes (apunta amb el cursor i prem ESPAI o clic);
 * en cauen també de blaus i daurats, que no ho són: tocar-ne un en resta un del compte.
 * Part 2: uneix els 7 punts en ordre i apareix la constel·lació amagada: un ocell que s'escapa d'una gàbia oberta
 * (la gàbia són uns altres estels, més febles, que ja hi són; en acabar s'uneixen sols).
 * Controls: ratolí o fletxes/WASD per moure el cercle; ESPAI/ENTER/clic per triar; ESC per sortir (no es desa cap progrés: o es fa sencer o no es fa).
 */
// L'ocell (els 7 punts que s'uneixen): cua, cos, ala esquerra, coll, ala dreta, cap i bec. Vola amunt i a la dreta.
const ESTELS_PUNTS = [[360, 760], [440, 680], [370, 500], [560, 610], [530, 420], [615, 572], [672, 556]];
const ESTELS_LINIES = [[1, 2], [2, 3], [3, 4], [2, 4], [4, 5], [2, 5], [4, 6], [6, 7]];
// La gàbia (estels febles), a baix a l'esquerra: base, costats, cúpula i la porteta oberta cap a fora
const ESTELS_GABIA = { a: [90, 1000], b: [270, 1000], c: [90, 820], d: [270, 820], e: [180, 735], f: [270, 885], g: [345, 945] };
const ESTELS_GABIA_LINIES = [['a', 'b'], ['a', 'c'], ['c', 'e'], ['e', 'd'], ['d', 'f'], ['b', 'g']];

// Final de la constel·lació: l'últim estel s'apaga damunt del dipòsit de llevant i hi deixa una llum a l'aigua
// (la zona dels Dipòsits la mostra; recollir-la dona la Llàgrima de Sant Llorenç)
function completarEstels() {
    const E = Estat;
    E.posaFlag("estelsFets");
    const ui = game.scene.getScene("UI"), z = game.scene.getScene("ZonaDipositos");
    E.posaObjectiu("S'ha encès una llum a l'aigua del dipòsit de llevant.");
    const dialeg = () => { if (ui) ui.obrirDialeg({ pagines: [
        { qui: "Ineu", text: "Set estels... i un ocell que s'escapa d'una gàbia oberta. És la nit de les llàgrimes de Sant Llorenç!" },
    ] }, () => E.desar()); };
    if (z && z.scene.isActive() && z.caureEstel) z.caureEstel(dialeg); else dialeg();
}

class EscenaEstels extends Phaser.Scene {
    constructor() { super("Estels"); }

    create() {
        // El minijoc és complet o no és: no es desa cap progrés a mig fer (si surts, tornes a començar des de la primera part)
        delete Estat.dades.flags.estelsCompt;
        this.part = 1;
        this.compte = 0;
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

        this.titol = this.add.text(AMPLE / 2, 92, "Les Llàgrimes de Sant Llorenç", estilText(36, "#ffd34d", { fontStyle: "bold" })).setOrigin(0.5).setDepth(12);
        // Quadre d'informació: vora daurada doble, cantonades rodones i degradat nocturn; el text hi queda ben endins dels marges
        const q = this.add.graphics().setDepth(11), QX = 50, QY = 140, QW = AMPLE - 100, QH = 150;
        q.fillStyle(0x000000, 0.35).fillRoundedRect(QX + 4, QY + 6, QW, QH, 24);
        q.fillStyle(0x101a4a, 0.94).fillRoundedRect(QX, QY, QW, QH, 24);
        q.fillStyle(0x2a3a84, 0.35).fillRoundedRect(QX + 8, QY + 8, QW - 16, QH / 2 - 8, { tl: 16, tr: 16, bl: 4, br: 4 });
        q.lineStyle(4, 0xd4af37, 0.95).strokeRoundedRect(QX, QY, QW, QH, 24);
        q.lineStyle(1.5, 0xfff0b0, 0.45).strokeRoundedRect(QX + 8, QY + 8, QW - 16, QH - 16, 18);
        this.info = this.add.text(AMPLE / 2, QY + 48, "", estilText(32, "#eef2ff", { align: "center", wordWrap: { width: QW - 90 } })).setOrigin(0.5).setDepth(12);
        this.fonsMissatge = this.add.rectangle(AMPLE / 2, ALT - 150, AMPLE - 60, 96, 0x1a0a14, 0.9).setDepth(18).setStrokeStyle(3, 0xff9a9a, 0.9).setAlpha(0);
        this.missatge = this.add.text(AMPLE / 2, ALT - 150, "", estilText(32, "#ffd0d0", { fontStyle: "bold", align: "center", wordWrap: { width: 640 } })).setOrigin(0.5).setDepth(19).setAlpha(0);
        this.punters = [];             // les set llàgrimes del comptador
        const sortir = this.add.text(AMPLE - 16, ALT - 100, "Sortir ✕", estilText(28, "#f2e6c8", { backgroundColor: "#1a120bcc", padding: { x: 14, y: 8 } }))
            .setOrigin(1, 0).setDepth(20).setInteractive({ useHandCursor: true }).on("pointerdown", (p, x, y, ev) => { if (ev) ev.stopPropagation(); this.tancar(false); });
        this.sortirBtn = sortir;
        let midaTitol = 36;
        while (this.titol.getBounds().width > AMPLE - 40 && midaTitol > 18) this.titol.setFontSize(--midaTitol);

        // Cercle d'apuntar
        this.rx = AMPLE / 2; this.ry = ALT / 2;
        this.cursor = this.add.circle(this.rx, this.ry, 34).setStrokeStyle(3, 0xffd34d, 0.95);
        this.cursor.setDepth(10).setVisible(false);          // el cercle només es veu quan es mou amb el teclat; al toc/clic només surt un anell que s'esvaeix
        this.cursorFins = 0;
        this.keys = this.input.keyboard.addKeys("W,A,S,D,SPACE,ENTER,ESC,UP,DOWN,LEFT,RIGHT");
        this.input.on("pointermove", p => { this.rx = p.x; this.ry = p.y; });
        this.input.on("pointerdown", p => {
            this.rx = p.x; this.ry = p.y; this.triar();
            const anell = this.add.circle(p.x, p.y, 34).setStrokeStyle(4, 0xffd34d, 0.95).setDepth(10);
            this.tweens.add({ targets: anell, scale: 1.7, alpha: 0, duration: 380, onComplete: () => anell.destroy() });
        });
        this.keys.SPACE.on("down", () => { this.cursorFins = this.time.now + 1500; this.triar(); });
        this.keys.ENTER.on("down", () => { this.cursorFins = this.time.now + 1500; this.triar(); });
        this.keys.ESC.on("down", () => this.tancar(false));

        // Abans de començar, una pantalla que explica què s'ha de fer (cada part la seva); el joc no comença fins que es prem «Comença»
        this.instruccions(() => { if (this.part === 1) this.iniciarPart1(); else this.iniciarPart2(); });
    }

    // Missatge de retorn gran i amb fons, que es queda prou estona per poder-lo llegir
    dir(text, color = "#ffd0d0", ms = 3200) {
        this.missatge.setText(text).setColor(color);
        this.tweens.killTweensOf([this.missatge, this.fonsMissatge]);
        this.missatge.setAlpha(1); this.fonsMissatge.setAlpha(1);
        this.tweens.add({ targets: [this.missatge, this.fonsMissatge], alpha: 0, delay: ms, duration: 600 });
    }

    // Sense pantalla d'instruccions: un sol missatge curt i gran en començar (el joc ja arrenca) i la franja de dalt ho recorda tota l'estona
    instruccions(fet) {
        this.dir(this.part === 1 ? "Toca els estels BLANCS: són les llàgrimes" : "Uneix els punts en ordre: 1, 2, 3...", "#eef2ff", 4500);
        fet();
    }

    // Part 2: un anell que pulsa marca sempre el següent punt (així no cal explicar res)
    posaGuia() {
        if (this.guia) { this.tweens.killTweensOf(this.guia); this.guia.destroy(); this.guia = null; }
        const q = this.punts[this.seguent - 1];
        if (!q) return;
        this.guia = this.add.circle(q.x, q.y, 26).setStrokeStyle(4, 0xffe08a, 1).setDepth(8);
        this.tweens.add({ targets: this.guia, scale: { from: 0.8, to: 1.5 }, alpha: { from: 1, to: 0.15 }, repeat: -1, duration: 900 });
    }

    // ---------- Part 1: estels fugaços ----------
    iniciarPart1() {
        this.textCompte();
        this.propEstrella = this.time.now + 900;
    }

    textCompte() {
        this.info.setText(`Toca només els estels BLANCS\nLlàgrimes: ${this.compte} de 7`);
        if (!this.punters.length) for (let i = 0; i < 7; i++) this.punters.push(this.add.circle(AMPLE / 2 + (i - 3) * 46, 255, 14, 0xffffff, 0.15).setStrokeStyle(2, 0xffffff, 0.8).setDepth(12));
        this.punters.forEach((c, i) => { c.setFillStyle(0xffffff, i < this.compte ? 1 : 0.12); });
    }

    // Cada estel fugaç neix en un punt qualsevol del cel (no sempre al mateix racó) i cau en diagonal cap a un costat o l'altre.
    // Un de cada tres és blau o daurat: no és una llàgrima
    nouEstel() {
        const esquerra = Math.random() < 0.5, a0 = 0.3 + Math.random() * 0.45, a = esquerra ? Math.PI - a0 : a0, v = 380 + Math.random() * 150;
        const x = esquerra ? AMPLE * (0.3 + Math.random() * 0.75) : AMPLE * (-0.05 + Math.random() * 0.75);
        const color = Math.random() < 0.34 ? (Math.random() < 0.5 ? 0x7fb0ff : 0xffc840) : 0xffffff;
        this.estrelles.push({ x, y: 300 + Math.random() * ALT * 0.5, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vida: 1900 + Math.random() * 600, color });
    }

    // ---------- Part 2: constel·lació ----------
    iniciarPart2() {
        this.info.setText("Toca els set punts en ordre, de l'1 al 7");
        this.info.setY(215);          // (una sola línia: centrada al quadre)
        Object.values(ESTELS_GABIA).forEach(([x, y], i) => {                 // els estels febles de la gàbia
            const c = this.add.circle(x, y, 4, 0xd8c890, 0.55);
            this.tweens.add({ targets: c, alpha: 0.25, yoyo: true, repeat: -1, duration: 900 + i * 130 });
        });
        ESTELS_PUNTS.forEach(([x, y], i) => {
            const c = this.add.circle(x, y, 14, 0xaac8ff, 0.8);
            this.tweens.add({ targets: c, alpha: 0.35, yoyo: true, repeat: -1, duration: 700 + i * 90 });
            const n = this.add.text(x + 20, y - 36, String(i + 1), estilText(34, "#cfe0ff", { fontStyle: "bold" }));
            this.punts.push({ x, y, c, n });
        });
        this.posaGuia();
    }

    triar() {
        if (this.tancat) return;
        if (this.part === 1) {
            const d = s => Phaser.Math.Distance.Between(s.x, s.y, this.rx, this.ry);
            const e = this.estrelles.filter(s => d(s) < 85).sort((p, q) => d(p) - d(q))[0];
            if (e && e.color !== 0xffffff) {                     // no és una llàgrima: en resta una
                e.vida = 0;
                this.compte = Math.max(0, this.compte - 1);
                const flaix = this.add.circle(e.x, e.y, 10, e.color, 0.9);
                this.tweens.add({ targets: flaix, radius: 50, alpha: 0, duration: 350, onComplete: () => flaix.destroy() });
                this.cameras.main.shake(120, 0.004);
                this.dir("Aquest no és una llàgrima: en perds una.", "#ffd0d0");
                this.textCompte();
                return;
            }
            if (e) {
                e.vida = 0;
                this.compte++;
                const flaix = this.add.circle(e.x, e.y, 10, 0xffffff, 0.9);
                this.tweens.add({ targets: flaix, radius: 70, alpha: 0, duration: 450, onComplete: () => flaix.destroy() });
                this.so(this.compte);
                this.dir(this.compte >= 7 ? "Set llàgrimes!" : `Una llàgrima! Te'n ${7 - this.compte === 1 ? "falta 1" : "falten " + (7 - this.compte)}.`, "#d0ffd8", 1800);
                this.textCompte();
                if (this.compte >= 7) {
                    this.estrelles = [];
                    this.info.setText("Set llàgrimes! Ara, mira bé el cel...");
                    this.info.setY(215);
                    this.time.delayedCall(1800, () => { this.part = 2; this.iniciarPart2(); });
                }
            } else {
                this.dir("No has tocat cap estel. Posa el cercle groc sobre un estel BLANC i toca.", "#ffe8b0");
            }
            return;
        }
        // Part 2
        let p = -1, millor = 70;
        this.punts.forEach((q, i) => { const d = Phaser.Math.Distance.Between(q.x, q.y, this.rx, this.ry); if (d < millor) { millor = d; p = i; } });
        if (p < 0) return;
        if (p + 1 !== this.seguent) {
            this.dir("No és aquest: toca el número " + this.seguent + ".", "#ffe8b0");
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
        if (this.seguent > 7) { if (this.guia) this.guia.destroy(); this.completar(); } else this.posaGuia();
    }

    completar() {
        this.tancat = true;
        // La gàbia s'uneix sola: base, costats, cúpula rodona amb l'anella de penjar, barrots i la porteta oberta
        const G = ESTELS_GABIA, OR = 0xd4af37, g = this.add.graphics().setAlpha(0);
        const cupula = [];
        for (let t = 0; t <= 1.001; t += 0.05) cupula.push({
            x: Phaser.Math.Interpolation.QuadraticBezier(t, G.c[0], G.e[0], G.d[0]),
            y: Phaser.Math.Interpolation.QuadraticBezier(t, G.c[1], 2 * G.e[1] - (G.c[1] + G.d[1]) / 2, G.d[1])
        });
        g.lineStyle(3, OR, 0.85).strokePoints(cupula);
        ESTELS_GABIA_LINIES.filter(([p, q]) => !(p === 'c' && q === 'e') && !(p === 'e' && q === 'd')).forEach(([p, q]) => g.lineBetween(G[p][0], G[p][1], G[q][0], G[q][1]));
        g.strokeCircle(G.e[0], G.e[1] - 12, 9);
        g.lineStyle(2, OR, 0.45);
        [120, 150, 180, 210, 240].forEach(x => {                                // barrots fins a la cúpula
            const p = cupula.reduce((m, q) => Math.abs(q.x - x) < Math.abs(m.x - x) ? q : m);
            g.lineBetween(x, G.a[1], x, p.y);
        });
        g.lineBetween(G.c[0], G.c[1] + 60, G.d[0], G.d[1] + 60);
        // L'ocell, dibuixat sobre els 7 estels: cua en ventall, cos, dues ales amb plomes, cap i bec
        const P = i => ({ x: ESTELS_PUNTS[i - 1][0], y: ESTELS_PUNTS[i - 1][1] }), o = this.add.graphics().setAlpha(0);
        const ple = (pts, a = 0.35) => { o.fillStyle(0xffe08a, a).fillPoints(pts, true); o.lineStyle(2.5, 0xffe08a, 0.9).strokePoints(pts, true); };
        const p1 = P(1), p2 = P(2), p4 = P(4), ang = Math.atan2(p4.y - p2.y, p4.x - p2.x), nx = -Math.sin(ang), ny = Math.cos(ang);
        ple([p2, { x: p1.x + nx * 22, y: p1.y + ny * 22 }, { x: p1.x - 8 * Math.cos(ang), y: p1.y - 8 * Math.sin(ang) }, { x: p1.x - nx * 22, y: p1.y - ny * 22 }]);   // cua
        const cos = [], mx = (p2.x + p4.x) / 2, my = (p2.y + p4.y) / 2, ea = Math.hypot(p4.x - p2.x, p4.y - p2.y) / 2 + 16;
        for (let k = 0; k < 24; k++) { const t = k / 24 * Math.PI * 2, ex = Math.cos(t) * ea, ey = Math.sin(t) * 17; cos.push({ x: mx + ex * Math.cos(ang) - ey * Math.sin(ang), y: my + ex * Math.sin(ang) + ey * Math.cos(ang) }); }
        ple(cos, 0.45);
        [3, 5].forEach(n => {                                                   // ala: vora de davant corbada i plomes a la de darrere
            const T = P(n), arrel = { x: mx + (p4.x - mx) * 0.4, y: my + (p4.y - my) * 0.4 }, cua = { x: mx + (p2.x - mx) * 0.6, y: my + (p2.y - my) * 0.6 };
            const pts = [arrel];
            for (let t = 0.1; t <= 1.001; t += 0.1) pts.push({ x: Phaser.Math.Interpolation.QuadraticBezier(t, arrel.x, (arrel.x + T.x) / 2 + 20, T.x), y: Phaser.Math.Interpolation.QuadraticBezier(t, arrel.y, (arrel.y + T.y) / 2 - 20, T.y) });
            for (let k = 1; k <= 4; k++) {
                const f = k / 4, bx = T.x + (cua.x - T.x) * f, by = T.y + (cua.y - T.y) * f;
                pts.push({ x: bx - 6, y: by + 14 }, { x: bx + (cua.x - T.x) / 8, y: by + (cua.y - T.y) / 8 });
            }
            ple(pts, 0.3);
        });
        const p6 = P(6), p7 = P(7), ab = Math.atan2(p7.y - p6.y, p7.x - p6.x);
        ple([{ x: p6.x + Math.cos(ab) * 14 - Math.sin(ab) * 6, y: p6.y + Math.sin(ab) * 14 + Math.cos(ab) * 6 }, p7, { x: p6.x + Math.cos(ab) * 14 + Math.sin(ab) * 6, y: p6.y + Math.sin(ab) * 14 - Math.cos(ab) * 6 }], 0.6);   // bec
        o.fillStyle(0xffe08a, 0.5).fillCircle(p6.x, p6.y, 16).lineStyle(2.5, 0xffe08a, 0.9).strokeCircle(p6.x, p6.y, 16);
        o.fillStyle(0x050818, 1).fillCircle(p6.x + 5, p6.y - 4, 3);              // ull
        // Rastre de punts de la porteta fins a la cua: l'ocell s'ha escapat
        for (let t = 0.08; t < 0.95; t += 0.09) {
            const x = Phaser.Math.Interpolation.QuadraticBezier(t, G.g[0], G.g[0] + 60, p1.x), y = Phaser.Math.Interpolation.QuadraticBezier(t, G.g[1], p1.y + 120, p1.y);
            o.fillStyle(0xffe08a, 0.8).fillCircle(x, y, 3);
        }
        this.fletxa.setAlpha(0.35);                                             // les línies d'unir els punts queden de fons
        this.tweens.add({ targets: [g, o], alpha: 1, duration: 1400 });
        this.info.setText("Un ocell que s'escapa d'una gàbia oberta...");
        this.info.setFontSize(30).setWordWrapWidth(520).setY(215);          // (text llarg: més petit i amb marge als costats del quadre)
        [1, 3, 2].forEach((n, i) => this.time.delayedCall(i * 350, () => this.so(n + 1)));
        this.time.delayedCall(6500, () => this.tancar(true));          // (més estona per poder llegir el missatge)
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
        o.connect(g); g.connect(Sfx.connect(ctx));
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
        if (k.LEFT.isDown || k.RIGHT.isDown || k.UP.isDown || k.DOWN.isDown || k.A.isDown || k.D.isDown || k.W.isDown || k.S.isDown) this.cursorFins = this.time.now + 1500;
        this.cursor.setVisible(this.time.now < this.cursorFins);

        if (this.part === 1) {
            if (this.time.now > this.propEstrella) {
                this.nouEstel();
                this.propEstrella = this.time.now + 1300 + Math.random() * 900;
            }
            this.cel.clear();
            this.estrelles.forEach(s => {
                s.x += s.vx * delta / 1000; s.y += s.vy * delta / 1000; s.vida -= delta;
                const l = Math.hypot(s.vx, s.vy);
                this.cel.lineStyle(3, s.color, 0.35).lineBetween(s.x, s.y, s.x - s.vx / l * 110, s.y - s.vy / l * 110);
                this.cel.lineStyle(2, s.color, 0.8).lineBetween(s.x, s.y, s.x - s.vx / l * 40, s.y - s.vy / l * 40);
                this.cel.fillStyle(s.color, 1).fillCircle(s.x, s.y, 8);
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
