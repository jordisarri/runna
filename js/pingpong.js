/**
 * EL CELLER: el partit de ping-pong contra en Josep (un sol partit, obligatori: el Frederic no parla de la roda fins que el guanyes)
 * Vista des de darrere de l'Ineu: la taula en perspectiva, en Josep a l'altra banda.
 * - Cops: la pilota ve per un dels tres carrils (esquerra, centre, dreta). Un cercle es fa petit fins a l'anell del carril:
 *   quan el toca, prem el carril bo (← ↓ →, A S D, o el botó de sota). Hi ha un marge ampli abans i després del moment exacte:
 *   perfecte = cop fort; bé = cop normal; si prems el carril del costat, la pilota es torna de rebot (cop feble). Prémer massa d'hora
 *   o el carril que no toca no es castiga: es pot rectificar fins que passa el marge. Només perds el punt si no hi arribes (la pilota
 *   segueix el seu camí i se'n va per darrere de l'Ineu).
 * - Servei màgic d'en Josep: mostra tres carrils amb calma; repeteix-los en ordre per tornar-lo (hi ha dos intents).
 * - El teu servei: qualsevol botó (↓, ESPAI o els botons de sota).
 * - Set punts; a 6-6, cal guanyar de dos. Es canvia de servei cada dos punts.
 */
const PP = {
    PUNTS: 7,
    CARRILS: 3,
    // Perspectiva: la taula va de y=330 (fons, en Josep) a y=1000 (a prop, l'Ineu)
    fonsY: 330, propY: 1000, copY: 930,
    xFons: [290, 360, 430], xProp: [170, 360, 550],
    PERFECTE: 150, BE: 330
};

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
        t.fillStyle(0x000000, 0.35).fillPoints([{ x: 250, y: 344 }, { x: 470, y: 344 }, { x: 690, y: 1030 }, { x: 30, y: 1030 }], true);
        t.fillStyle(0x1f6a46, 1).fillPoints([{ x: 260, y: PP.fonsY }, { x: 460, y: PP.fonsY }, { x: 670, y: PP.propY }, { x: 50, y: PP.propY }], true);
        t.lineStyle(5, 0xf2f2e8, 1).strokePoints([{ x: 260, y: PP.fonsY }, { x: 460, y: PP.fonsY }, { x: 670, y: PP.propY }, { x: 50, y: PP.propY }], true);
        t.lineStyle(2, 0xf2f2e8, 0.8).lineBetween(360, PP.fonsY, 360, PP.propY);
        t.fillStyle(0x134a30, 1).fillRect(50, PP.propY, 620, 22);                                 // cantell
        t.fillStyle(0x3a2a1a, 1).fillRect(80, PP.propY + 22, 18, 120).fillRect(622, PP.propY + 22, 18, 120);   // potes
        // Xarxa
        const yX = this.yPersp(0.5);
        t.fillStyle(0xe8e8e0, 0.25).fillRect(this.xVora(0.5, -1) - 6, yX - 34, this.xVora(0.5, 1) - this.xVora(0.5, -1) + 12, 34);
        t.lineStyle(2, 0xe8e8e0, 0.8);
        for (let x = this.xVora(0.5, -1); x <= this.xVora(0.5, 1); x += 12) t.lineBetween(x, yX - 34, x, yX);
        t.lineStyle(4, 0xffffff, 1).lineBetween(this.xVora(0.5, -1) - 8, yX - 34, this.xVora(0.5, 1) + 8, yX - 34);
        t.fillStyle(0x2a2a2e, 1).fillRect(this.xVora(0.5, -1) - 12, yX - 40, 6, 42).fillRect(this.xVora(0.5, 1) + 6, yX - 40, 6, 42);

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
        this.anells = PP.xProp.map(x => this.add.circle(x, PP.copY, 46).setStrokeStyle(4, 0xf2e6c8, 0.25).setDepth(3));
        this.cercle = this.add.circle(0, 0, 150).setStrokeStyle(5, 0xffd34d, 1).setDepth(4).setVisible(false);

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
    yPersp(f) { return PP.fonsY + (PP.propY - PP.fonsY) * f; }                 // f: 0 fons, 1 a prop
    xVora(f, costat) { const mig = 100 + 210 * f; return 360 + costat * mig; }
    xCarril(c, f) { return PP.xFons[c] + (PP.xProp[c] - PP.xFons[c]) * f; }

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
        this.tCop = this.t0 + this.durada;
        this.respost = false;
        this.so(1);
        this.pilota.setVisible(true); this.ombra.setVisible(true);
        this.cercle.setVisible(true).setPosition(PP.xProp[this.carril], PP.copY).setRadius(150).setStrokeStyle(5, 0xffd34d, 1);
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
                this.cop(1, false);
                this.time.delayedCall(700, () => this.copEntrant());
            }
            return;
        }
        if (this.estat !== 'cop' || this.respost) return;
        const err = this.time.now - this.tCop;
        if (Math.abs(err) > PP.BE) return;                     // encara és massa lluny: no passa res (es pot tornar a provar)
        const exacte = c === this.carril, costat = Math.abs(c - this.carril) === 1;
        if (!exacte && !costat) {                              // el carril de l'altra punta: s'avisa, però es pot rectificar
            this.avis('Aquest no és el carril!', 600, '#f2e6c8'); this.so(0);
            return;
        }
        this.respost = true;
        this.cercle.setVisible(false);
        if (!exacte) {                                         // el carril del costat: la pilota es torna de rebot, amb poca força
            this.cop(c, true);
            this.avis('De rebot!', 600, '#f2e6c8');
            this.tornada(0.5 - this.rally * 0.04, c);
            return;
        }
        const perfecte = Math.abs(err) <= PP.PERFECTE;
        this.cop(c, true);
        this.avis(perfecte ? 'PERFECTE!' : 'Bé!', 500, perfecte ? '#9fe0ff' : '#f2e6c8');
        this.tornada(perfecte ? 0.42 - this.rally * 0.06 : 0.86 - this.rally * 0.1, c);
    }

    // La pilota se'n va cap a en Josep; ell la torna o no (prob = probabilitat que la torni)
    tornada(prob, c = Phaser.Math.Between(0, 2)) {                 // c: el carril des d'on l'Ineu ha colpejat (la pilota en surt i hi torna a l'altre costat)
        this.estat = 'res';
        this.rally++;
        this.tornant = { t0: this.time.now, dur: 760, c };
        this.time.delayedCall(800, () => {
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
        // Pilota que ve: de la pala d'en Josep al carril, amb una paràbola i un bot a la meitat de l'Ineu
        if (this.estat === 'cop' && !this.respost) {
            const f = Phaser.Math.Clamp((time - this.t0) / this.durada, 0, 1.25);
            this.posarPilota(this.carril, f, true);
            const r = 46 + (150 - 46) * Math.max(0, 1 - f);
            this.cercle.setRadius(r);
            const e = Math.abs(time - this.tCop);                 // el cercle canvia de color quan és el moment: groc, verd (bé) i blau (perfecte)
            this.cercle.setStrokeStyle(5, e <= PP.PERFECTE ? 0x9fe0ff : e <= PP.BE ? 0x9fe0a0 : 0xffd34d, 1);
            if (time > this.tCop + PP.BE) {                         // no hi arribes: la pilota continua cap enrere, no desapareix de cop
                this.respost = true; this.estat = 'res';
                this.cercle.setVisible(false);
                this.fug = { t0: time, c: this.carril };
                this.avis('No hi has arribat!', 800, '#ff9a8a');
                this.time.delayedCall(950, () => { this.fug = null; if (!this.acabat) this.puntJosep('No hi has arribat!'); });
            }
        }
        if (this.fug) {                                            // la pilota passa de llarg per darrere de l'Ineu, rebota i s'esvaeix
            const f = Phaser.Math.Clamp((time - this.fug.t0) / 900, 0, 1);
            const x = this.xCarril(this.fug.c, 1) + (this.fug.c - 1) * 90 * f;
            const y = PP.copY + 40 + 190 * f - Math.abs(Math.sin(f * Math.PI * 1.5)) * 70;
            const esc = 1.5 + f * 0.5;
            this.pilota.setVisible(true).setPosition(x, y).setScale(esc).setAlpha(1 - f * 0.8);
            this.ombra.setVisible(true).setPosition(x, PP.copY + 40 + 190 * f).setScale(esc).setAlpha(1 - f);
        }
        if (this.fugJosep) {                                       // la pilota d'en Josep se'n va cap al fons, per sobre la taula
            const f = Phaser.Math.Clamp((time - this.fugJosep.t0) / 850, 0, 1);
            const x = this.xCarril(this.fugJosep.c, 0) + (this.fugJosep.c - 1) * 40 * f;
            const y = PP.fonsY - 30 - 110 * f + Math.abs(Math.sin(f * Math.PI * 2)) * 24;
            const esc = 0.7 - 0.3 * f;
            this.pilota.setVisible(true).setPosition(x, y).setScale(esc).setAlpha(1 - f * 0.8);
            this.ombra.setVisible(true).setPosition(x, PP.fonsY - 30 - 60 * f).setScale(esc).setAlpha(1 - f);
        }
        if (this.tornant) {
            const f = Phaser.Math.Clamp((time - this.tornant.t0) / this.tornant.dur, 0, 1);
            this.pilota.setVisible(true); this.ombra.setVisible(true);
            this.posarPilota(this.tornant.c, 1 - f, false);
        }
    }

    // f: 0 al costat d'en Josep, 1 al punt de cop de l'Ineu
    posarPilota(c, f, venint) {
        const fy = Phaser.Math.Clamp(f, 0, 1.2);
        const yTaula = this.yPersp(Math.min(fy, 1) * ((PP.copY - PP.fonsY) / (PP.propY - PP.fonsY)) + (fy > 1 ? (fy - 1) * 0.3 : 0));
        const x = this.xCarril(c, Math.min(fy, 1));
        // Bot a 3/4 del camí cap a qui rep
        const bot = venint ? 0.72 : 0.28;
        const alt = fy < bot ? Math.sin(fy / bot * Math.PI) * 120 : Math.sin((fy - bot) / (1 - bot) * Math.PI) * 70;
        const esc = 0.7 + 0.8 * Math.min(fy, 1);
        this.pilota.setPosition(x, yTaula - alt * esc).setScale(esc);
        this.ombra.setPosition(x, yTaula).setScale(esc);
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
