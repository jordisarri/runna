/**
 * EL CELLER: el partit de ping-pong contra en Josep (un sol partit, obligatori: el Frederic no parla de la roda fins que el guanyes)
 * Vista des de darrere de l'Ineu: la taula en perspectiva, en Josep a l'altra banda.
 * - Cops: la pilota ve per un dels tres carrils (esquerra, centre, dreta). Un cercle es fa petit fins a l'anell del carril:
 *   quan el toca (és el moment en què la pilota, després del bot a la taula, arriba al punt més alt), prem el carril bo (← ↓ →, A S D,
 *   o el botó de sota). Hi ha un marge ampli abans i després: perfecte = cop fort; bé = cop normal. Només el carril de la pilota
 *   la toca: un altre carril fa que l'Ineu hi vagi i faci el gest en fals (un instant d'espera). Només perds el punt si no hi arribes.
 * - Servei màgic d'en Josep: mostra tres carrils amb calma; repeteix-los en ordre per tornar-lo (hi ha dos intents).
 * - El teu servei: qualsevol botó (↓, ESPAI o els botons de sota).
 * - Set punts; a 6-6, cal guanyar de dos. Es canvia de servei cada dos punts.
 */
const PP = {
    PUNTS: 7,
    CARRILS: 3,
    // Càmera de perspectiva (pinhole) darrere l'Ineu, mirant la taula: x = 360 + F·X/Z, y = HY + (K − F·alçada)/Z (X, Z i alçada en metres)
    F: 1236, HY: -414, K: 4299, ZN: 3.04, L: 2.74, AMPLE_TAULA: 0.7625,
    LANE: [-0.5, 0, 0.5],                    // X (m) del centre de cada carril
    FA: 0.94, FB: 0.68,                      // posició (0 fons d'en Josep, 1 vora de l'Ineu) on la pilota fa l'ALÇADA MÀXIMA després del bot (el moment del cop) i on bota
    PERFECTE: 150, BE: 330
};
PP.ZF = PP.ZN + PP.L;
PP.fonsY = PP.HY + PP.K / PP.ZF; PP.propY = PP.HY + PP.K / PP.ZN;
PP.copY = PP.HY + PP.K / (PP.ZF - PP.FA * PP.L);
PP.xProp = PP.LANE.map(X => 360 + PP.F * X / (PP.ZF - PP.FA * PP.L));

class EscenaPingPong extends Phaser.Scene {
    constructor() { super('PingPong'); }

    create() {
        this.scene.bringToTop();                // per sobre del HUD
        // La zona i el HUD dormen mentre es juga (no es veuen i no gasten); en acabar es desperten
        this.zona = Joc.zonaActiva(this);
        if (this.zona) this.scene.sleep(this.zona.scene.key);
        this.scene.sleep('UI');
        this.ineu = 0; this.josep = 0;
        this.estat = 'res';
        this.rally = 0;
        this.acabat = false;

        // ---- Escenari: la paret de pedra del celler, llum de les espelmes i la taula verda en perspectiva ----
        this.add.rectangle(0, 0, AMPLE, ALT, 0x140e0a, 1).setOrigin(0);
        if (this.textures.exists('mur_pedra')) this.add.tileSprite(0, 0, AMPLE, 300, 'mur_pedra').setOrigin(0).setTileScale(1 / RES).setTint(0x8a7a6a);
        this.add.rectangle(0, 300, AMPLE, ALT - 300, 0x2a221c, 1).setOrigin(0);
        const llum = this.add.graphics();
        llum.fillStyle(0xffd38a, 0.06).fillEllipse(AMPLE / 2, 640, 900, 900);
        llum.fillStyle(0xffd38a, 0.05).fillEllipse(AMPLE / 2, 640, 600, 600);
        const t = this.add.graphics();
        const Pt = (X, f, h = 0) => this.proj(X, f, h), W = PP.AMPLE_TAULA, ALT_PATA = 0.76;
        const poli = (pts, c, a) => t.fillStyle(c, a).fillPoints(pts.map(q => ({ x: q.x, y: q.y })), true);
        // ombra de la taula al terra (la mateixa taula, projectada a l'alçada del terra)
        poli([Pt(-W, 0, -ALT_PATA), Pt(W, 0, -ALT_PATA), Pt(W, 1, -ALT_PATA), Pt(-W, 1, -ALT_PATA)], 0x000000, 0.3);
        // potes (les del fons es veuen entre la taula i el terra; les de davant, a prop)
        const pota = (X, f) => { const a = Pt(X, f, 0), b = Pt(X, f, -ALT_PATA), k = a.k * 0.06; t.fillStyle(0x3a2a1a, 1).fillRect(a.x - k, a.y, 2 * k, b.y - a.y).lineStyle(2, 0x1a0e06, 1).strokeRect(a.x - k, a.y, 2 * k, b.y - a.y); };
        pota(-W + 0.1, 0.03); pota(W - 0.1, 0.03); pota(-W + 0.1, 0.97); pota(W - 0.1, 0.97);
        // llosa de la taula: gruix visible (vora de davant i vora lateral) i cara de dalt
        const gr = 0.05;
        poli([Pt(-W, 1, 0), Pt(W, 1, 0), Pt(W, 1, -gr), Pt(-W, 1, -gr)], 0x134a30, 1);                                    // cantell de davant
        poli([Pt(-W, 0, 0), Pt(-W, 1, 0), Pt(-W, 1, -gr), Pt(-W, 0, -gr)], 0x0f3a26, 1);                                   // cantell de l'esquerra
        poli([Pt(W, 0, 0), Pt(W, 1, 0), Pt(W, 1, -gr), Pt(W, 0, -gr)], 0x0f3a26, 1);                                       // cantell de la dreta
        const cara = [Pt(-W, 0), Pt(W, 0), Pt(W, 1), Pt(-W, 1)];
        poli(cara, 0x1f6a46, 1);
        // lleugera degradació de llum cap al fons de la taula
        t.fillGradientStyle(0x3a9a6a, 0x3a9a6a, 0x1f6a46, 0x1f6a46, 0.22, 0.22, 0, 0).fillPoints(cara.map(q => ({ x: q.x, y: q.y })), true);
        t.lineStyle(5, 0xf2f2e8, 1).strokePoints(cara.map(q => ({ x: q.x, y: q.y })), true);
        t.lineStyle(2, 0xf2f2e8, 0.8).lineBetween(Pt(0, 0).x, Pt(0, 0).y, Pt(0, 1).x, Pt(0, 1).y);
        // Xarxa: a la meitat de la taula (no a la meitat de la pantalla), amb alçada de veritat
        const NH = 0.1525, a1 = Pt(-W, 0.5, 0), a2 = Pt(W, 0.5, 0), b1 = Pt(-W, 0.5, NH), b2 = Pt(W, 0.5, NH);
        t.fillStyle(0xe8e8e0, 0.22).fillPoints([a1, a2, b2, b1].map(q => ({ x: q.x, y: q.y })), true);
        t.lineStyle(2, 0xe8e8e0, 0.75); for (let k = 0; k <= 28; k++) { const X = -W + 2 * W * k / 28, u = Pt(X, 0.5, 0), v = Pt(X, 0.5, NH); t.lineBetween(u.x, u.y, v.x, v.y); }
        for (let k = 1; k < 4; k++) { const u = Pt(-W, 0.5, NH * k / 4), v = Pt(W, 0.5, NH * k / 4); t.lineBetween(u.x, u.y, v.x, v.y); }
        t.lineStyle(5, 0xffffff, 1).lineBetween(b1.x, b1.y, b2.x, b2.y);
        [[-1, a1, b1], [1, a2, b2]].forEach(([sg, a, b]) => { t.lineStyle(7, 0x2a2a2e, 1).lineBetween(a.x + sg * 8, a.y, b.x + sg * 8, b.y - 8); });

        // ---- Jugadors ----
        this.spJosep = this.add.image(360, 335, 'josep').setOrigin(0.5, 1);
        this.spJosep.setScale(((this.textures.get('josep').customData || {}).escala || 0.5) * 2.2);
        // Darrere la taula només es veu de cintura cap amunt: es retalla el gràfic i es baixa perquè la cintura quedi a la vora del fons de la taula
        const FR = 0.7;                                            // fracció del gràfic (de dalt a baix) que arriba a la cintura
        this.spJosep.setCrop(0, 0, this.spJosep.width, this.spJosep.height * FR);
        this.spJosep.setY(PP.fonsY + 6 + this.spJosep.displayHeight * (1 - FR));
        const ineuTex = this.textures.exists('ineu_up') ? 'ineu_up' : 'ineu_avall';
        this.spIneu = this.add.sprite(360, ALT - 100, ineuTex, 0).setOrigin(0.5, 1).setDepth(5);
        this.spIneu.setScale(((this.textures.get(ineuTex).customData || {}).escala || 0.5) * 1.6);
        // La pala a la mà de l'Ineu: gira cap al carril on colpeja. El pivot és la mà (el mànec cap avall).
        this.pala = this.add.container(360 + 46, ALT - 150).setDepth(6).setAngle(20);
        const gp = this.add.graphics();
        gp.fillStyle(0x5a3a1e, 1).fillRoundedRect(-4, -34, 8, 40, 3).lineStyle(2, 0x1a0e06, 1).strokeRoundedRect(-4, -34, 8, 40, 3);
        gp.fillStyle(0x8a1a1a, 1).fillEllipse(0, -62, 52, 62).lineStyle(3, 0x1a0e06, 1).strokeEllipse(0, -62, 52, 62);
        gp.fillStyle(0xd83a3a, 1).fillEllipse(0, -64, 44, 54).fillStyle(0xffffff, 0.22).fillEllipse(-9, -74, 12, 22);
        this.pala.add(gp);
        this.impacte = this.add.circle(0, 0, 30).setStrokeStyle(5, 0xffffff, 0.9).setDepth(8).setVisible(false);

        // ---- Anells dels carrils i el cercle que es fa petit ----
        this.anells = PP.xProp.map(x => this.add.circle(x, PP.copY, 46).setStrokeStyle(4, 0xf2e6c8, 0.25).setDepth(3).setScale(1, 0.73));      // els cercles són sobre la taula: escurçats per la perspectiva
        this.cercle = this.add.circle(0, 0, 150).setStrokeStyle(5, 0xffd34d, 1).setDepth(4).setScale(1, 0.73).setVisible(false);

        // ---- Pilota amb ombra ----
        this.ombra = this.add.ellipse(0, 0, 22, 8, 0x000000, 0.35).setDepth(2).setVisible(false);
        this.pilota = this.add.circle(0, 0, 10, 0xfff6e0, 1).setStrokeStyle(2, 0xd8c8a0).setDepth(7).setVisible(false);

        // ---- Marcador, missatges i servei màgic ----
        this.add.rectangle(AMPLE / 2, 58, 460, 84, 0x1a120b, 0.85).setStrokeStyle(3, 0xd4af37);
        this.marcador = this.add.text(AMPLE / 2, 40, '', estilText(34, '#f2e6c8', { fontStyle: 'bold' })).setOrigin(0.5);
        this.servei = this.add.text(AMPLE / 2, 80, '', estilText(20, '#d8c8a0', { fontStyle: 'italic' })).setOrigin(0.5);
        this.missatge = this.add.text(AMPLE / 2, 470, '', estilText(30, '#ffd34d', { fontStyle: 'bold', align: 'center', stroke: '#1a120b', strokeThickness: 6, wordWrap: { width: 640 } })).setOrigin(0.5).setDepth(20);
        this.seq = this.add.text(AMPLE / 2, 640, '', estilText(84, '#d8b0ff', { fontStyle: 'bold', stroke: '#1a0a2a', strokeThickness: 10 })).setOrigin(0.5).setDepth(20);

        // ---- Controls: tecles i tres botons tàctils ----
        const k = this.input.keyboard.addKeys('LEFT,DOWN,RIGHT,A,S,D,SPACE,ESC');
        [['LEFT', 0], ['A', 0], ['DOWN', 1], ['S', 1], ['SPACE', 1], ['RIGHT', 2], ['D', 2]].forEach(([tecla, c]) => k[tecla].on('down', () => this.entrada(c)));
        k.ESC.on('down', () => this.sortir());
        this.botons = ['◀', '●', '▶'].map((s, c) => {
            const x = PP.xProp[c], y = ALT - 60;
            const b = this.add.circle(x, y, 52, 0x1a120b, 0.8).setStrokeStyle(3, 0xd4af37).setDepth(30).setInteractive({ useHandCursor: true });
            this.add.text(x, y, s, estilText(40, '#f2e6c8')).setOrigin(0.5).setDepth(31);
            b.setInteractive(new Phaser.Geom.Circle(52, 52, 92), Phaser.Geom.Circle.Contains);   // zona de toc generosa, més gran que el botó
            b.on('pointerdown', () => { b.setFillStyle(0x4a3a20, 0.95); this.entrada(c); });
            b.on('pointerup', () => b.setFillStyle(0x1a120b, 0.8));
            b.on('pointerout', () => b.setFillStyle(0x1a120b, 0.8));
            return b;
        });
        this.add.text(AMPLE - 16, 120, 'Sortir ✕', estilText(26, '#f2e6c8', { backgroundColor: '#1a120bcc', padding: { x: 12, y: 6 } }))
            .setOrigin(1, 0).setDepth(30).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.sortir());

        this.actualitzarMarcador();
        this.avis('En Josep contra l\'Ineu\nA set punts', 1600);
        this.time.delayedCall(1800, () => this.seguentPunt());
    }

    // ---------------- Perspectiva ----------------
    // f: 0 vora d'en Josep, 1 vora de l'Ineu (es compta en metres de taula); X: metres a banda i banda del centre; h: alçada sobre la taula
    proj(X, f, h = 0) { const Z = PP.ZF - f * PP.L; return { x: 360 + PP.F * X / Z, y: PP.HY + (PP.K - PP.F * h) / Z, k: PP.F / Z }; }
    // Col·loca la pilota (i la seva ombra sobre la taula) amb la mida que toca pel seu lloc en la perspectiva
    posaPilota(X, f, h, alfa = 1) {
        const p = this.proj(X, f, h), g = this.proj(X, f, 0);
        this.pilota.setVisible(true).setPosition(p.x, p.y).setScale(p.k * 0.05 / 10).setAlpha(alfa);
        this.ombra.setVisible(true).setPosition(g.x, g.y).setScale(p.k * 0.07 / 11 * (1 - Math.min(0.5, h * 0.6)), p.k * 0.07 / 11 * 0.45).setAlpha(alfa * (h > -0.02 ? 1 : 0.2));
    }
    // Pilota que ve cap a l'Ineu pel carril c: baixa des d'en Josep, BOTA a la taula (FB) i s'enlaira fins a l'alçada màxima (FA), que és el moment del cop
    pilotaEntrant(c, t, tA) {
        const tb = tA * PP.FB / PP.FA, fr = PP.FA * t / tA;
        let h;
        if (t < tb) { const s = t / tb; h = 0.45 * (1 - s * s) + 0.22 * Math.sin(Math.PI * s); }
        else { const s2 = (t - tb) / (tA - tb); h = 0.30 * (2 * s2 - s2 * s2); }
        return { X: PP.LANE[c] * (0.3 + 0.7 * Math.min(fr / PP.FA, 1.4)), f: fr, h };
    }
    // Pilota que torna cap a en Josep, des del carril c: passa per damunt la xarxa, bota a la meitat d'en Josep i hi arriba
    pilotaTornant(c, u) {
        const fr = PP.FA - (PP.FA - 0.02) * u, ub = (PP.FA - 0.32) / (PP.FA - 0.02);
        let h;
        if (u < ub) { const v = u / ub; h = 0.30 * (1 - v) + 0.30 * Math.sin(Math.PI * v); }
        else { const w = (u - ub) / (1 - ub); h = 0.28 * Math.sin(Math.PI * w * 0.85); }
        return { X: PP.LANE[c] * (0.3 + 0.7 * fr / PP.FA), f: fr, h };
    }

    // ---------------- Marcador i servei ----------------
    serveixIneu() { return Math.floor((this.ineu + this.josep) / 2) % 2 === 0; }
    actualitzarMarcador() {
        this.marcador.setText(`Ineu  ${this.ineu}  –  ${this.josep}  Josep`);
        this.servei.setText(this.serveixIneu() ? 'Serveixes tu' : 'Serveix en Josep');
    }
    avis(text, ms = 1100, color = '#ffd34d') {
        this.missatge.setText(text).setColor(color).setAlpha(1).setScale(1);
        this.tweens.killTweensOf(this.missatge);
        this.tweens.add({ targets: this.missatge, scale: { from: 1.25, to: 1 }, duration: 220 });
        this.tweens.add({ targets: this.missatge, alpha: 0, delay: ms, duration: 300 });
    }

    seguentPunt() {
        if (this.acabat) return;
        this.rally = 0;
        this.tweens.add({ targets: this.spIneu, x: 360, duration: 350, ease: 'Sine.easeInOut' });
        this.tweens.add({ targets: this.pala, x: 360 + 46, duration: 350, ease: 'Sine.easeInOut' });
        this.actualitzarMarcador();
        if (this.serveixIneu()) {
            this.estat = 'serveiIneu';
            this.avis('El teu servei: prem qualsevol botó (↓ o ESPAI)', 1800, '#f2e6c8');
            this.anells[1].setStrokeStyle(5, 0xffd34d, 0.9);
        } else {
            this.serveiMagic();
        }
    }

    // ---------------- Servei màgic d'en Josep: tres carrils que s'han de repetir ----------------
    serveiMagic() {
        this.intents = 2;
        this.ordre = Array.from({ length: 3 }, () => Phaser.Math.Between(0, 2));
        this.avis('Servei màgic d\'en Josep: memoritza!', 1200, '#d8b0ff');
        this.mostrarOrdre(900);
    }

    // Mostra els tres carrils, un a un i sense pressa; després cal repetir-los
    mostrarOrdre(retard) {
        this.estat = 'mirant';
        this.entrat = [];
        const n = this.ordre.length, ms = Math.max(620, 880 - (this.ineu + this.josep) * 14);
        this.ordre.forEach((c, i) => this.time.delayedCall(retard + i * ms, () => {
            if (this.acabat) return;
            this.seq.setText(['◀', '●', '▶'][c]).setAlpha(1).setX(PP.xProp[c]);
            this.so(3 + c);
            this.tweens.add({ targets: this.seq, alpha: 0, delay: ms * 0.6, duration: ms * 0.3 });
        }));
        this.time.delayedCall(retard + n * ms + 150, () => {
            if (this.acabat) return;
            this.estat = 'repetint';
            this.avis('Repeteix-los en ordre!', 1400, '#d8b0ff');
            if (this.limitServei) this.limitServei.remove();
            this.limitServei = this.time.delayedCall(7000, () => { if (this.estat === 'repetint') this.puntJosep('El servei passa de llarg...'); });
        });
    }

    // ---------------- Cop que ve cap a l'Ineu ----------------
    copEntrant() {
        if (this.acabat) return;
        this.estat = 'cop';
        this.carril = Phaser.Math.Between(0, 2);
        this.durada = Math.max(1050, 1800 - this.rally * 45 - (this.ineu + this.josep) * 10);       // el cop arriba amb calma i s'accelera molt poc a poc
        this.t0 = this.time.now;
        this.tCop = this.t0 + this.durada;               // el moment del cop = l'alçada màxima de la pilota després del bot
        this.respost = false;
        this.so(1);
        this.pilota.setVisible(true); this.ombra.setVisible(true);
        this.cercle.setVisible(true).setPosition(PP.xProp[this.carril], PP.copY).setRadius(150).setStrokeStyle(5, 0xffd34d, 1);
        this.posaPilota(...Object.values(this.pilotaEntrant(this.carril, 0, this.durada)));
        this.anells.forEach((a, i) => a.setStrokeStyle(i === this.carril ? 5 : 4, 0xf2e6c8, i === this.carril ? 0.9 : 0.25));
    }

    entrada(c) {
        if (this.acabat) return;
        if (this.estat === 'serveiIneu') {
            this.anells[1].setStrokeStyle(4, 0xf2e6c8, 0.25);
            this.cop(1, true);
            this.tornada(0.8, 1);
            return;
        }
        if (this.estat === 'repetint') {
            this.entrat.push(c);
            this.so(3 + c);
            this.cop(c, false);                                          // l'Ineu es mou al carril i hi fa el gest amb la pala
            this.botons[c].setFillStyle(0x4a3a20, 0.95);
            this.time.delayedCall(120, () => this.botons[c].setFillStyle(0x1a120b, 0.8));
            const i = this.entrat.length - 1;
            if (this.entrat[i] !== this.ordre[i]) {
                if (this.limitServei) this.limitServei.remove();
                this.intents--;
                if (this.intents <= 0) { this.puntJosep('No era aquest ordre!'); return; }
                this.estat = 'mirant';
                this.avis('No era aquest ordre. Mira-ho un cop més!', 1300, '#d8b0ff');
                this.mostrarOrdre(1400);
                return;
            }
            if (this.entrat.length === this.ordre.length) {
                if (this.limitServei) this.limitServei.remove();
                this.estat = 'res';
                this.avis('Servei màgic tornat!', 900, '#9fe0a0');
                this.time.delayedCall(260, () => { this.cop(c, true); this.tornada(1, c); });      // la pilota màgica es veu sortir cap a en Josep, que la torna
            }
            return;
        }
        if (this.estat !== 'cop' || this.respost) return;
        if (this.time.now < (this.bloqFins || 0)) return;               // després d'un gest en fals, un instant d'espera
        const err = this.time.now - this.tCop;
        if (c !== this.carril || Math.abs(err) > PP.BE) {               // carril equivocat o massa d'hora: l'Ineu hi va, fa el gest en l'aire i no passa res més
            this.bloqFins = this.time.now + 320;
            this.cop(c, false);
            if (c !== this.carril) { this.avis('Aquest no és el carril!', 650, '#f2e6c8'); this.so(0); }
            return;
        }
        this.respost = true;
        this.cercle.setVisible(false);
        const perfecte = Math.abs(err) <= PP.PERFECTE;
        this.cop(c, true);
        this.avis(perfecte ? 'PERFECTE!' : 'Bé!', 500, perfecte ? '#9fe0ff' : '#f2e6c8');
        this.tornada(perfecte ? 0.42 - this.rally * 0.06 : 0.86 - this.rally * 0.1, c);
    }

    // La pilota se'n va cap a en Josep; ell la torna o no (prob = probabilitat que la torni)
    tornada(prob, c = Phaser.Math.Between(0, 2)) {                 // c: el carril des d'on l'Ineu ha colpejat: la pilota en surt
        this.estat = 'res';
        this.rally++;
        this.tornant = { t0: this.time.now, dur: 900, c };
        this.time.delayedCall(940, () => {
            this.tornant = null;
            if (this.acabat) return;
            if (Math.random() < Math.max(0.15, prob)) { this.so(2); this.copEntrant(); }
            else {                                                      // en Josep no la torna: la pilota se'n va per darrere seu
                this.fugJosep = { t0: this.time.now, c };
                this.time.delayedCall(850, () => { this.fugJosep = null; if (!this.acabat) this.puntIneu(Math.random() < 0.5 ? 'En Josep no hi arriba!' : 'La pilota toca la xarxa!'); });
            }
        });
    }

    // L'Ineu es desplaça fins al carril i hi fa el cop amb la pala; la pilota en surt des d'aquest mateix carril
    cop(c, encert) {
        const x = PP.xProp[c];
        this.tweens.killTweensOf(this.spIneu); this.tweens.killTweensOf(this.pala);
        this.tweens.add({ targets: this.spIneu, x, duration: 150, ease: 'Sine.easeOut' });
        const repos = 20, colp = c === 0 ? -75 : c === 2 ? 75 : -35;
        this.pala.setAngle(repos + (c === 0 ? 40 : c === 2 ? -40 : 0));
        this.tweens.add({ targets: this.pala, x: x + 46, angle: colp, duration: 130, ease: 'Quad.easeOut',
            onComplete: () => this.tweens.add({ targets: this.pala, angle: repos, duration: 260, ease: 'Sine.easeInOut' }) });
        if (encert) {
            this.impacte.setPosition(x, PP.copY).setVisible(true).setScale(0.6).setAlpha(1);
            this.tweens.add({ targets: this.impacte, scale: 1.8, alpha: 0, duration: 320, onComplete: () => this.impacte.setVisible(false) });
            this.so(2);
        }
    }

    puntIneu(text) { this.ineu++; this.finalPunt(text, '#9fe0a0'); }
    puntJosep(text) { this.josep++; this.finalPunt(text, '#ff9a8a'); }

    finalPunt(text, color) {
        this.estat = 'res';
        this.cercle.setVisible(false);
        this.pilota.setVisible(false).setAlpha(1); this.ombra.setVisible(false).setAlpha(1);
        this.anells.forEach(a => a.setStrokeStyle(4, 0xf2e6c8, 0.25));
        this.actualitzarMarcador();
        this.avis(text, 900, color);
        const guanya = (a, b) => a >= PP.PUNTS && a - b >= 2;
        if (guanya(this.ineu, this.josep)) return this.final(true);
        if (guanya(this.josep, this.ineu)) return this.final(false);
        this.time.delayedCall(1300, () => this.seguentPunt());
    }

    update(time) {
        // Pilota que ve: bota a la meitat de l'Ineu i s'enlaira; al punt més alt és el moment del cop
        if (this.estat === 'cop' && !this.respost) {
            const t = time - this.t0, f = t / this.durada;
            const q = this.pilotaEntrant(this.carril, t, this.durada);
            this.posaPilota(q.X, q.f, q.h);
            const r = 46 + (150 - 46) * Math.max(0, 1 - f);
            this.cercle.setRadius(r);
            const e = Math.abs(time - this.tCop);                 // el cercle canvia de color al punt més alt de la pilota: groc, verd (bé) i blau (perfecte)
            this.cercle.setStrokeStyle(5, e <= PP.PERFECTE ? 0x9fe0ff : e <= PP.BE ? 0x9fe0a0 : 0xffd34d, 1);
            if (time > this.tCop + PP.BE) {                         // no hi arribes: la pilota continua el seu camí, no desapareix de cop
                this.respost = true; this.estat = 'res';
                this.cercle.setVisible(false);
                this.fug = { t0: this.t0, c: this.carril, tA: this.durada };
                this.avis('No hi has arribat!', 800, '#ff9a8a');
                this.time.delayedCall(1000, () => { this.fug = null; if (!this.acabat) this.puntJosep('No hi has arribat!'); });
            }
        }
        if (this.fug) {                                            // la pilota passa de llarg: segueix la seva paràbola, cau al terra i s'esvaeix
            const t = time - this.fug.t0, q = this.pilotaEntrant(this.fug.c, t, this.fug.tA);
            const fade = 1 - Phaser.Math.Clamp((t - this.fug.tA - 350) / 650, 0, 1);
            this.posaPilota(q.X, q.f, q.h, fade);
        }
        if (this.tornant) {
            const u = Phaser.Math.Clamp((time - this.tornant.t0) / this.tornant.dur, 0, 1), q = this.pilotaTornant(this.tornant.c, u);
            this.posaPilota(q.X, q.f, q.h);
        }
        if (this.fugJosep) {                                       // en Josep no hi arriba: la pilota segueix cap al fons, baixa i s'esvaeix
            const u = Phaser.Math.Clamp((time - this.fugJosep.t0) / 850, 0, 1);
            const q = this.pilotaTornant(this.fugJosep.c, 1);
            this.posaPilota(q.X * (1 + 0.5 * u), q.f - 0.16 * u, q.h * (1 - u) - 0.5 * u * u, 1 - u * 0.9);
        }
    }

    final(guanyat) {
        this.acabat = true;
        this.estat = 'res';
        this.avis(guanyat ? 'Has guanyat en Josep!' : 'En Josep guanya el partit', 2400, guanyat ? '#9fe0a0' : '#ff9a8a');
        if (guanyat) [1, 3, 5].forEach((n, i) => this.time.delayedCall(i * 220, () => this.so(n)));
        this.time.delayedCall(2600, () => this.tancar(guanyat));
    }

    sortir() {
        if (this.acabat) return;
        this.acabat = true;
        this.tancar(false, true);
    }

    tancar(guanyat, abandonat = false) {
        if (this.zona) this.scene.wake(this.zona.scene.key);
        this.scene.wake('UI');
        const ui = this.scene.get('UI');
        if (ui) ui.bloquejatFins = ui.time.now + 300;
        this.scene.stop();
        if (ui) ui.obrirDialeg(guanyat ? DIALEGS.josepGuanyat(Estat) : DIALEGS.josepPerdut(Estat, abandonat), () => Estat.desar());
    }

    so(n) {
        const ctx = this.sound && this.sound.context;
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = n <= 2 ? 'triangle' : 'sine';
        o.frequency.value = n <= 2 ? 520 + n * 80 : 300 + n * 70;
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (n <= 2 ? 0.12 : 0.4));
        o.connect(g); g.connect(ctx.destination);
        o.start(); o.stop(ctx.currentTime + 0.45);
    }
}
