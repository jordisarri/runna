/**
 * LA TORRE DEL CAMPANAR: sala de transició entre el Santuari i la Sala del Rellotge.
 * Una escala de cargol vista des del centre de la torre, amb un efecte pseudo-3D a l'estil de Nebulus/Castelian:
 * l'Ineu es queda al mig de la pantalla i, a mesura que puja, la paret rodona gira al seu voltant i els graons
 * van passant per sota els seus peus. Tot es dibuixa per codi a cada fotograma (no hi ha cap imatge).
 *
 * Geometria: cada punt de la paret és (angle, alçada). Vist des del centre, l'angle relatiu a la vista (alfa) dóna
 *   X = cx + r * sin(alfa)         (r = radi: R a la paret, menys cap al centre)
 *   Y = yBase - h + (R - r * cos(alfa)) * inclinacio     (el que és més a prop del mirador cau cap avall: paret còncava)
 */
const TORRE = {
    graons: 26,            // graons de cargol (més un replà a baix i un de dalt)
    perVolta: 13,          // graons per volta completa
    alt: 56,               // alçada d'un graó (px)
    R: 330,                // radi de la paret (px)
    fons: 90,              // quant surt un graó de la paret cap al centre
    inclinacio: 0.5,
    velocitat: 2.3,        // graons per segon
    peuY: 800,             // y de pantalla (dins la vista) on l'Ineu té els peus
    escalaIneu: 1.5        // l'Ineu es veu més gran que a les zones (si no, quedava minúscul entre els graons)
};

class ZonaTorre extends Phaser.Scene {
    constructor() {
        super('ZonaTorre');
        this.config = { nom: 'Torre del campanar', colorFons: '#0a0806', pacifica: true };
    }

    init(dades) { this.entrada = (dades && dades.entrada) || 'baix'; }

    create() {
        const T = TORRE;
        Estat.dades.zona = 'ZonaEsglesia';       // si es desa aquí, es continua a l'església, davant la porta
        Estat.dades.entrada = 'golfes';
        Estat.dades.x = null; Estat.dades.y = null;
        Estat.posaFlag('visitada_ZonaTorre');
        Joc.musicaZona(this);

        this.dtheta = Math.PI * 2 / T.perVolta;
        this.p = this.entrada === 'dalt' ? T.graons + 0.35 : -0.7;       // progrés: a l'enter n-èsim es és al graó n
        this.canviant = false;
        this.proxPas = 0; this.altrePas = false;
        this.W = AMPLE; this.H = ALT - ALT_HUD; this.cx = this.W / 2;

        const cam = this.cameras.main;
        cam.setViewport(0, ALT_HUD, AMPLE, ALT - ALT_HUD);
        cam.setBackgroundColor('#0a0806');
        cam.fadeIn(350, 0, 0, 0);

        this.g = this.add.graphics().setDepth(0);
        this.llum = this.add.graphics().setDepth(6).setBlendMode(Phaser.BlendModes.ADD);

        const S = SPRITE_INEU;
        this.ombra = this.add.image(this.cx, T.peuY, 'ombra').setScale(0.42 * T.escalaIneu).setDepth(4);
        this.ineu = this.add.sprite(this.cx, T.peuY, 'ineu_right', quietIneu()).setOrigin(0.5, S.peus / S.alt).setScale(S.alcada / (S.alt * S.k) * T.escalaIneu).setDepth(5);
        if (this.anims.exists('aturat_right')) this.ineu.anims.play('aturat_right', true);
        this.dirVista = 1;

        // Pols en suspensió, a la llum de les finestres
        this.add.particles(0, 0, 'espurna', {
            x: { min: 40, max: this.W - 40 }, y: { min: 200, max: this.H },
            speedY: { min: -12, max: -3 }, speedX: { min: -6, max: 6 },
            lifespan: 5000, scale: { start: 0.07, end: 0.02 }, alpha: { start: 0, end: 0.45 },
            tint: 0xffe6b0, frequency: 220, blendMode: 'ADD'
        }).setDepth(7);

        // Vinyeta a dalt i a baix perquè l'escala se senti fosca i tancada
        const v = this.add.graphics().setDepth(20);
        v.fillGradientStyle(0x050403, 0x050403, 0x050403, 0x050403, 0.85, 0.85, 0, 0).fillRect(0, 0, this.W, 190);
        v.fillGradientStyle(0x050403, 0x050403, 0x050403, 0x050403, 0, 0, 0.8, 0.8).fillRect(0, this.H - 150, this.W, 150);
        v.fillGradientStyle(0x050403, 0x050403, 0x050403, 0x050403, 0.7, 0, 0.7, 0).fillRect(0, 0, 90, this.H);
        v.fillGradientStyle(0x050403, 0x050403, 0x050403, 0x050403, 0, 0.7, 0, 0.7).fillRect(this.W - 90, 0, 90, this.H);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.tecles = this.input.keyboard.addKeys('W,A,S,D');
        fixarDecorat(this);                                 // el decorat fix, a una imatge (js/zona_base.js)

        const ui = this.ui();
        ui.actualitzarHUD();
        ui.mostrarZona('Torre del campanar');
        Estat.desar();
    }

    ui() { return this.scene.get('UI'); }
    flautaActiva() { return false; }
    guardarPosicio() { Estat.dades.zona = 'ZonaEsglesia'; Estat.dades.entrada = 'golfes'; Estat.dades.x = null; Estat.dades.y = null; }

    // ---------- geometria ----------
    // alçada dels graons: -1 (terra) -> 0; graó i -> (i+1)*alt; els dos replans de dalt a l'alçada final
    cim(i) { return i < 0 ? 0 : (Math.min(i, TORRE.graons) + 1) * TORRE.alt; }

    alturaIneu() {
        const T = TORRE, i = Math.floor(this.p), f = this.p - i;
        // Pujada contínua i suau (el graó de davant canvia a f = 0.5; abans el salt era de cop al final i tota l'escena «vibrava» i l'Ineu quedava per sota del graó)
        const t = Math.max(0, Math.min(1, (f - 0.1) / 0.8));
        return this.cim(i) + (this.cim(i + 1) - this.cim(i)) * (t * t * (3 - 2 * t));
    }

    // Les finestres i les torxes no poden quedar tapades pels graons: si el seu angle (absolut) coincideix amb el d'un graó i l'alçada també, es desplacen en alçada
    // fins a un lloc lliure. alt0..alt1: el tros que ocupen respecte a h; tolA: tolerància d'angle; el graó tapa la paret des de 60 px per sota del seu cim fins a 16 per sobre.
    lliure(aAbs, hIni, alt0, alt1, tolA) {
        const T = TORRE, dos = Math.PI * 2, dif = (x, y) => { let d = (x - y) % dos; if (d < -Math.PI) d += dos; if (d > Math.PI) d -= dos; return Math.abs(d); };
        let h = hIni;
        for (let pas = 0; pas < 3; pas++) {
            let mogut = false;
            for (let i = 0; i <= T.graons + 1; i++) {
                if (dif(aAbs, (i + 0.5) * this.dtheta) > this.dtheta / 2 + tolA) continue;
                const c = this.cim(i), lo = c - 60, hi = c + 16;
                if (h + alt1 < lo || h + alt0 > hi) continue;
                const amunt = hi - (h + alt0), avall = (h + alt1) - lo;
                h += amunt <= avall ? amunt + 4 : -(avall + 4); mogut = true;
            }
            if (!mogut) break;
        }
        return h;
    }

    pt(alfa, r, h) {
        const T = TORRE;
        return { x: this.cx + r * Math.sin(alfa), y: this.yBase - h + (T.R - r * Math.cos(alfa)) * T.inclinacio };
    }

    // Resplendor suau: cercles concèntrics de poca opacitat (cap vora dura)
    resplendor(x, y, r, color, alfa) {
        for (let k = 0; k < 7; k++) this.llum.fillStyle(color, alfa / 7 * (1 + k * 0.15)).fillCircle(x, y, r * (1 - k / 7));
    }

    ombrejat(color, alfa, extra = 1) {
        const s = Math.max(0.18, Math.cos(alfa)) ** 0.9 * 0.78 + 0.22;
        const r = (color >> 16) & 255, gg = (color >> 8) & 255, b = color & 255;
        const k = s * extra;
        return (Math.min(255, r * k) << 16) | (Math.min(255, gg * k) << 8) | Math.min(255, b * k);
    }

    // ---------- bucle ----------
    update(time, delta) {
        const T = TORRE, ui = this.ui();
        ui.consumirAccioTactil();
        let dir = 0;
        if (!this.canviant && !ui.bloquejat) {
            const c = this.cursors, t = this.tecles, v = ui.vectorTactil;
            const amunt = c.up.isDown || c.right.isDown || t.W.isDown || t.D.isDown || v.y < -0.3 || v.x > 0.3;
            const avall = c.down.isDown || c.left.isDown || t.S.isDown || t.A.isDown || v.y > 0.3 || v.x < -0.3;
            dir = amunt && !avall ? 1 : avall && !amunt ? -1 : 0;
        }
        if (dir) {
            this.ineu.setFlipX(false);
            const graoAbans = Math.floor(this.p + 0.2);
            this.p += dir * T.velocitat * delta / 1000;
            this.dirVista = dir;
            if (Math.floor(this.p + 0.2) !== graoAbans) Sfx.escala(dir > 0);          // un tap a cada graó (quan hi posa el peu, cap al final de la pujada del graó), en pujar i en baixar
            this.ineu.anims.play(dir > 0 ? 'caminar_right' : 'caminar_left', true);
        } else {
            const quiet = 'aturat_' + (this.dirVista > 0 ? 'right' : 'left');
            if (this.anims.exists(quiet)) {
                this.ineu.setFlipX(this.dirVista < 0);
                if (!this.ineu.anims.isPlaying || !this.ineu.anims.currentAnim || this.ineu.anims.currentAnim.key !== quiet) {
                    this.ineu.anims.play(quiet, true);
                }
            } else if (this.ineu.anims.isPlaying) {
                this.ineu.setFlipX(false);
                this.ineu.anims.stop();
                this.ineu.setTexture(this.dirVista > 0 ? 'ineu_right' : 'ineu_left', quietIneu());
            }
        }
        if (!this.canviant) {
            if (this.p > T.graons + 0.6) this.sortir('ZonaGolfes', 'porta');
            else if (this.p < -0.95) this.sortir('ZonaEsglesia', 'golfes');
        }
        this.p = Math.max(-1, Math.min(T.graons + 0.7, this.p));
        this.dibuixa(time);
    }

    sortir(desti, entrada) {
        this.canviant = true;
        Sfx.porta();
        Estat.dades.entrada = entrada;
        this.ineu.anims.stop();
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start(desti, { entrada }));
    }

    // ---------- dibuix ----------
    dibuixa(time) {
        const T = TORRE, g = this.g, ll = this.llum, W = this.W, H = this.H, dth = this.dtheta;
        const hP = this.alturaIneu();
        this.yBase = T.peuY + hP - T.fons * 0.5 * T.inclinacio;       // l'Ineu és sempre al mateix lloc de la pantalla
        const rot = (this.p + 0.5) * dth;                              // angle de la vista
        const norm = a => { a = (a + Math.PI) % (Math.PI * 2); if (a < 0) a += Math.PI * 2; return a - Math.PI; };
        const hTop = this.cim(T.graons + 1) + 300;                     // sostre
        g.clear(); ll.clear();

        // fons de morter
        g.fillStyle(0x1b1713, 1).fillRect(0, 0, W, H);

        // ---- paret: carreus per files (alineades amb els graons) i columnes angulars ----
        const rowH = T.alt, beta = dth / 2;
        const hMinVis = this.yBase - H - 20, hMaxVis = this.yBase + T.R * T.inclinacio + 20;
        const j0 = Math.max(0, Math.floor(hMinVis / rowH)), j1 = Math.min(Math.ceil(hTop / rowH), Math.ceil(hMaxVis / rowH));
        const k0 = Math.floor((rot - Math.PI / 2) / beta) - 1, k1 = Math.ceil((rot + Math.PI / 2) / beta) + 1;
        for (let j = j0; j < j1; j++) {
            for (let k = k0; k <= k1; k++) {
                const a0 = k * beta + (j & 1) * beta / 2 - rot, a1 = a0 + beta;
                if (a1 < -Math.PI / 2 - 0.02 || a0 > Math.PI / 2 + 0.02) continue;
                const lo = Math.max(a0, -Math.PI / 2), hi = Math.min(a1, Math.PI / 2);
                if (hi - lo < 0.01) continue;
                const h0 = j * rowH, h1 = h0 + rowH, m = 0.012;
                const hash = ((k * 73856093) ^ (j * 19349663)) >>> 0, v = (hash % 100) / 100;
                const base = v < 0.3 ? 0x8a8070 : v < 0.65 ? 0x7c7366 : v < 0.9 ? 0x6f6659 : 0x948a78;
                const col = this.ombrejat(base, (lo + hi) / 2);
                const p = [this.pt(lo + m, T.R, h0 + 2), this.pt(hi - m, T.R, h0 + 2), this.pt(hi - m, T.R, h1 - 2), this.pt(lo + m, T.R, h1 - 2)];
                g.fillStyle(col, 1).fillPoints(p, true);
                g.fillStyle(0xffffff, 0.07).fillPoints([p[2], p[3], { x: p[3].x, y: p[3].y + 5 }, { x: p[2].x, y: p[2].y + 5 }], true);   // llum de dalt
            }
        }

        // ---- terra (baix) i sostre (dalt) ----
        const costat = (h, ys) => {
            const pts = [];
            for (let a = -Math.PI / 2; a <= Math.PI / 2 + 0.001; a += 0.15) pts.push(this.pt(a, T.R, h));
            return pts;
        };
        const base = costat(0);
        g.fillStyle(0x3b352c, 1).fillPoints([...base, { x: this.pt(Math.PI / 2, T.R, 0).x, y: H + 5 }, { x: this.pt(-Math.PI / 2, T.R, 0).x, y: H + 5 }], true);
        g.lineStyle(3, 0x1b1713, 1).strokePoints(base, false);
        const cel = costat(hTop);
        g.fillStyle(0x0d0b09, 1).fillPoints([...cel, { x: this.pt(Math.PI / 2, T.R, hTop).x, y: -5 }, { x: this.pt(-Math.PI / 2, T.R, hTop).x, y: -5 }], true);

        // ---- portes (a baix, entrada del Santuari; a dalt, cap a la Sala del Rellotge) ----
        const porta = (theta, h, ample, alt, ambLlum) => {
            const a = norm(theta - rot);
            if (Math.abs(a) > Math.PI / 2 + ample) return;
            const aL = a - ample / 2, aR = a + ample / 2, fusta = this.ombrejat(0x5a3a1e, a), pedra = this.ombrejat(0xaaa08c, a);
            const arc = r => { const pts = []; for (let k = 0; k <= 8; k++) { const t = Math.PI - k / 8 * Math.PI, ai = a + Math.cos(t) * (ample / 2) * r; pts.push(this.pt(ai, T.R, h + alt - 30 * r + Math.sin(t) * 34 * r)); } return pts; };
            const marc = [this.pt(aL - 0.05, T.R, h), ...arc(1.35), this.pt(aR + 0.05, T.R, h)];
            // Les portes del retaule: marc daurat amb moldures, columnes salomòniques als costats, capitells i un coronament de raigs amb una creu
            const or = this.ombrejat(0xd8a830, a, 1.05), orFosc = this.ombrejat(0x8a5e10, a), orClar = this.ombrejat(0xf4d870, a, 1.1), vora = this.ombrejat(0x4a2a08, a);
            g.fillStyle(or, 1).fillPoints(marc, true);
            g.lineStyle(2, vora, 1).strokePoints(marc, true);
            g.lineStyle(2, orClar, 0.9).strokePoints([this.pt(aL - 0.025, T.R, h + 4), ...arc(1.2).slice(0), this.pt(aR + 0.025, T.R, h + 4)], false);          // moldura interior clara
            [-1, 1].forEach(sd => {                                                                                                                             // columnes salomòniques
                const c0 = sd < 0 ? aL - 0.135 : aR + 0.065, c1 = c0 + 0.07, hc = h + alt - 44;
                const col = [this.pt(c0, T.R, h), this.pt(c1, T.R, h), this.pt(c1, T.R, hc), this.pt(c0, T.R, hc)];
                g.fillStyle(or, 1).fillPoints(col, true); g.lineStyle(1.5, vora, 1).strokePoints(col, true);
                for (let y = h + 6; y < hc - 4; y += 12) g.lineStyle(2, orFosc, 0.9).lineBetween(this.pt(c0, T.R, y), this.pt(c1, T.R, y + 7));
                g.fillStyle(orClar, 0.5).fillPoints([this.pt(c0, T.R, h), this.pt(c0 + 0.015, T.R, h), this.pt(c0 + 0.015, T.R, hc), this.pt(c0, T.R, hc)], true);
                const cap = [this.pt(c0 - 0.012, T.R, hc), this.pt(c1 + 0.012, T.R, hc), this.pt(c1 + 0.008, T.R, hc + 10), this.pt(c0 - 0.008, T.R, hc + 10)];       // capitell
                g.fillStyle(orClar, 1).fillPoints(cap, true); g.lineStyle(1.5, vora, 1).strokePoints(cap, true);
                const bas = [this.pt(c0 - 0.012, T.R, h), this.pt(c1 + 0.012, T.R, h), this.pt(c1 + 0.012, T.R, h + 8), this.pt(c0 - 0.012, T.R, h + 8)];            // base
                g.fillStyle(orClar, 1).fillPoints(bas, true); g.lineStyle(1.5, vora, 1).strokePoints(bas, true);
            });
            { const cim = h + alt + 8;                                                                                                                              // coronament: raigs i creu
                for (let k = -3; k <= 3; k++) g.fillStyle(k % 2 ? orClar : or, 1).fillPoints([this.pt(a, T.R, cim - 6), this.pt(a + k * 0.038 - 0.014, T.R, cim + 26 - Math.abs(k) * 3), this.pt(a + k * 0.038 + 0.014, T.R, cim + 26 - Math.abs(k) * 3)], true);
                g.lineStyle(1.5, vora, 1).strokePoints([this.pt(a - 0.12, T.R, cim - 6), this.pt(a - 0.1, T.R, cim + 20), this.pt(a, T.R, cim + 30), this.pt(a + 0.1, T.R, cim + 20), this.pt(a + 0.12, T.R, cim - 6)], false);
                g.fillStyle(orClar, 1).fillPoints([this.pt(a - 0.004, T.R, cim + 28), this.pt(a + 0.004, T.R, cim + 28), this.pt(a + 0.004, T.R, cim + 50), this.pt(a - 0.004, T.R, cim + 50)], true);
                g.fillStyle(orClar, 1).fillPoints([this.pt(a - 0.02, T.R, cim + 40), this.pt(a + 0.02, T.R, cim + 40), this.pt(a + 0.02, T.R, cim + 44), this.pt(a - 0.02, T.R, cim + 44)], true);
            }
            const porta = [this.pt(aL, T.R, h), ...arc(1), this.pt(aR, T.R, h)];
            g.fillStyle(0x0c0806, 1).fillPoints(porta, true);
            // porta oberta: el forat fosc amb la claror de l'altra banda, i el batent girat cap endins, arran del brancal esquerre
            g.fillStyle(0x3a2a18, 0.8).fillPoints([this.pt(aL + 0.06, T.R, h), ...arc(0.7), this.pt(aR - 0.06, T.R, h)], true);
            const fulla = [this.pt(aL + 0.015, T.R, h), this.pt(aL + 0.015, T.R, h + alt - 26), this.pt(aL + ample * 0.2, T.R - 28, h + alt - 34), this.pt(aL + ample * 0.2, T.R - 28, h + 2)];
            g.fillStyle(fusta, 1).fillPoints(fulla, true);
            g.lineStyle(2, this.ombrejat(0x2a1608, a), 1).strokePoints(fulla, true);
            g.lineStyle(2, or, 1).strokePoints([this.pt(aL + 0.03, T.R - 3, h + 10), this.pt(aL + 0.03, T.R - 3, h + alt - 34), this.pt(aL + ample * 0.2 - 0.02, T.R - 26, h + alt - 42), this.pt(aL + ample * 0.2 - 0.02, T.R - 26, h + 10)], true);       // bordura daurada
            { const mc = this.pt(aL + ample * 0.11, T.R - 14, h + alt * 0.5), dm = 11;                                                                                                          // medalló daurat
                g.fillStyle(or, 1).fillPoints([{ x: mc.x, y: mc.y - dm }, { x: mc.x + dm * 0.6, y: mc.y }, { x: mc.x, y: mc.y + dm }, { x: mc.x - dm * 0.6, y: mc.y }], true);
                g.lineStyle(1.5, vora, 1).strokePoints([{ x: mc.x, y: mc.y - dm }, { x: mc.x + dm * 0.6, y: mc.y }, { x: mc.x, y: mc.y + dm }, { x: mc.x - dm * 0.6, y: mc.y }], true); g.fillStyle(orClar, 1).fillCircle(mc.x, mc.y, 2.5); }
            if (ambLlum) { const c = this.pt(a, T.R - 24, h + alt * 0.4); this.resplendor(c.x, c.y, 100, 0xffd38a, 0.3); }
        };
        porta(-0.5 * dth, 0, 0.42, 250, true);
        porta((T.graons + 1.1) * dth, this.cim(T.graons), 0.42, 250, true);

        // ---- finestres de sageta i torxes a la paret ----
        for (let k = 0; k < 11; k++) {
            const a = norm(2.05 * k + 0.35 - rot), hw = this.lliure(2.05 * k + 0.35, 150 + k * 125, -4, 78, 0.2);
            if (Math.abs(a) < Math.PI / 2 - 0.1 && hw < hTop - 120) {
                const ap = 0.11;
                const forma = (e, h0, h1) => { const pts = [this.pt(a - ap * e, T.R, h0), this.pt(a - ap * e, T.R, h1)]; for (let q = 1; q < 6; q++) { const t = Math.PI - q / 6 * Math.PI; pts.push(this.pt(a + Math.cos(t) * ap * e, T.R, h1 + Math.sin(t) * 22 * e)); } pts.push(this.pt(a + ap * e, T.R, h1), this.pt(a + ap * e, T.R, h0)); return pts; };
                g.fillStyle(this.ombrejat(0xb3a88f, a), 1).fillPoints(forma(1.5, hw - 4, hw + 78), true);
                g.fillStyle(0xbfd4e4, 1).fillPoints(forma(1, hw, hw + 74), true);
                g.fillStyle(0xffffff, 0.35).fillPoints(forma(0.45, hw + 4, hw + 70), true);
                // Marc de fusta amb muntant i dues travesses, finestrons oberts a banda i banda (amb frontisses) i un ampit de pedra
                const R = T.R, fusta = this.ombrejat(0x5a3a1e, a), clara = this.ombrejat(0x8a5a30, a), fosca = this.ombrejat(0x2a1608, a);
                g.lineStyle(3.5, fusta, 1).strokePoints(forma(1, hw, hw + 74), true);
                g.lineStyle(2.5, fusta, 1).lineBetween(this.pt(a, R, hw), this.pt(a, R, hw + 96));
                [hw + 26, hw + 52].forEach(y => g.lineStyle(2.5, fusta, 1).lineBetween(this.pt(a - ap, R, y), this.pt(a + ap, R, y)));
                [-1, 1].forEach(sd => {
                    const a0 = a + sd * ap * 1.15, a1 = a + sd * ap * 2.3, q = [this.pt(a0, R, hw - 2), this.pt(a1, R, hw + 4), this.pt(a1, R, hw + 72), this.pt(a0, R, hw + 78)];
                    g.fillStyle(this.ombrejat(0x6a4524, a), 1).fillPoints(q, true);
                    g.lineStyle(1.5, fosca, 0.9).strokePoints(q, true);
                    for (let m = 1; m < 3; m++) { const am = a0 + (a1 - a0) * m / 3; g.lineStyle(1, fosca, 0.6).lineBetween(this.pt(am, R, hw + 2), this.pt(am, R, hw + 74)); }          // taulons
                    [hw + 10, hw + 62].forEach(y => g.fillStyle(0x23232a, 1).fillPoints([this.pt(a0, R, y - 3), this.pt(a0 + (a1 - a0) * 0.45, R, y - 2), this.pt(a0 + (a1 - a0) * 0.45, R, y + 2), this.pt(a0, R, y + 3)], true));      // frontisses
                    g.fillStyle(clara, 0.35).fillPoints([this.pt(a0, R, hw + 70), this.pt(a1, R, hw + 70), this.pt(a1, R, hw + 72), this.pt(a0, R, hw + 76)], true);
                });
                g.fillStyle(this.ombrejat(0xcbc1ac, a, 1.1), 1).fillPoints([this.pt(a - ap * 2.0, R, hw - 10), this.pt(a + ap * 2.0, R, hw - 10), this.pt(a + ap * 1.7, R, hw - 3), this.pt(a - ap * 1.7, R, hw - 3)], true);          // ampit de pedra
                g.lineStyle(1.5, fosca, 0.8).strokePoints([this.pt(a - ap * 2.0, R, hw - 10), this.pt(a + ap * 2.0, R, hw - 10), this.pt(a + ap * 1.7, R, hw - 3), this.pt(a - ap * 1.7, R, hw - 3)], true);
                const c = this.pt(a, T.R - 40, hw + 40);
                this.resplendor(c.x, c.y, 130, 0x9cc4e4, 0.2 * Math.cos(a));
            }
            const b = norm(2.05 * k + 1.3 - rot), ht = this.lliure(2.05 * k + 1.3, 80 + k * 125 + 60, -30, 8, 0.1);
            if (Math.abs(b) < Math.PI / 2 - 0.1 && ht < hTop - 60) {
                const s = this.pt(b, T.R, ht), f = 1 + 0.18 * Math.sin(time / 90 + k * 3) + 0.1 * Math.sin(time / 37 + k);
                g.fillStyle(0x2a2118, 1).fillRect(s.x - 5, s.y - 6, 10, 22);
                g.fillStyle(0x4a3a24, 1).fillRect(s.x - 8, s.y + 2, 16, 5);
                g.fillStyle(0xff9a2a, 1).fillPoints([{ x: s.x - 6, y: s.y - 6 }, { x: s.x, y: s.y - 6 - 22 * f }, { x: s.x + 6, y: s.y - 6 }], true);
                g.fillStyle(0xffe080, 1).fillPoints([{ x: s.x - 3, y: s.y - 6 }, { x: s.x, y: s.y - 6 - 13 * f }, { x: s.x + 3, y: s.y - 6 }], true);
                this.resplendor(s.x, s.y - 14, 110, 0xffa040, 0.26 * Math.cos(b) * f);
            }
        }

        // ---- graons de pedra: cim i cara frontal, més clars a prop de l'Ineu ----
        for (let i = 0; i <= T.graons + 1; i++) {
            const a = norm((i + 0.5) * dth - rot), h = this.cim(i);
            if (Math.abs(a) > Math.PI / 2 + dth) continue;
            const a0 = a - dth / 2, a1 = a + dth / 2, rr = T.R - T.fons;
            const aa = Math.max(-Math.PI / 2, a0), bb = Math.min(Math.PI / 2, a1);
            if (bb - aa < 0.02) continue;
            const wide = i >= T.graons;                                  // replà de dalt: dos graons units
            const A0 = this.pt(aa, T.R, h), A1 = this.pt(bb, T.R, h), B1 = this.pt(bb, rr, h), B0 = this.pt(aa, rr, h);
            // ombra a la paret, sota el graó
            g.fillStyle(0x000000, 0.28).fillPoints([A0, A1, { x: A1.x, y: A1.y + 22 }, { x: A0.x, y: A0.y + 22 }], true);
            // cara lateral (el tall radial de l'extrem del graó): a l'esquerra de la vista es veu la de l'inici, a la dreta la del final
            const lateral = (al, P, Q) => {
                const D = [P, Q, { x: Q.x, y: Q.y + T.alt }, { x: P.x, y: P.y + T.alt }];
                g.fillStyle(this.ombrejat(0x6f6658, al, 0.85), 1).fillPoints(D, true);
                g.lineStyle(1.5, this.ombrejat(0x2a1c10, al), 0.9).strokePoints(D, true);
            };
            if (aa === a0 && Math.sin(a0) < 0) lateral(a0, A0, B0);
            if (bb === a1 && Math.sin(a1) > 0) lateral(a1, A1, B1);
            // cim
            g.fillStyle(this.ombrejat(0xcbc1ac, a, 1.12), 1).fillPoints([A0, A1, B1, B0], true);
            g.lineStyle(1.5, this.ombrejat(0x2a1c10, a), 0.9).strokePoints([A0, A1, B1, B0], true);
            // cara frontal
            const F0 = { x: B0.x, y: B0.y + T.alt }, F1 = { x: B1.x, y: B1.y + T.alt };
            g.fillStyle(this.ombrejat(0x8c8272, a, 0.95), 1).fillPoints([B0, B1, F1, F0], true);
            g.fillStyle(0x000000, 0.18).fillRect(Math.min(F0.x, F1.x), Math.min(F0.y, F1.y) - 5, Math.abs(F1.x - F0.x), 5);
            g.lineStyle(1.5, this.ombrejat(0x2a1c10, a), 0.9).strokePoints([B0, B1, F1, F0], true);
            g.lineStyle(2, 0xfff2d8, 0.55 * Math.cos(a)).lineBetween(B0.x, B0.y, B1.x, B1.y);
            // juntes dels carreus de la cara
            if (!wide) g.lineStyle(1, this.ombrejat(0x2a1c10, a), 0.5).lineBetween((B0.x + B1.x) / 2, B0.y + 1, (F0.x + F1.x) / 2, F0.y);
        }

        // ---- l'Ineu: ombra als peus i un lleuger balanceig en pujar ----
        const pas = this.ineu.anims.isPlaying ? Math.abs(Math.sin(time / 130)) * 2 : 0;
        this.ineu.y = T.peuY - pas * 0.4;
        this.ombra.setPosition(this.cx, T.peuY);
        this.ineu.setFlipX(false);
    }
}
