/**
 * INTRO I PANTALLA DE TÍTOL (sobre una foto, sense vídeo)
 *   1. Portada "prem una tecla" (cal un gest perquè el navegador deixi sonar la música)
 *   2. Desplaçament de 10 s sobre assets/video/intro.webp (sol → espasa → foto sencera), amb la música del joc
 *   3. La foto sencera amb el logo (assets/video/logo_runna.webp) i el menú a sobre; la vegetació i la boira es mouen per codi
 * Qualsevol tecla o clic durant la intro salta directament al bucle i al menú.
 */
const FONT_TITOL = '"Cinzel Decorative", Georgia, serif';
const FONT_TEXT = '"Cormorant Garamond", Georgia, "Times New Roman", serif';   // serifa elegant (portada)
const FONT_LLIBRE = '"IM Fell English", "Cormorant Garamond", Georgia, serif';             // text de llibre antic (pròleg)
const FONT_PLACA = '"Cinzel", Georgia, serif';                                   // noms i títols a la interfície

// The Hero's Ascension: la fanfarria comença al segon 17 de la cançó. La música arrenca d'aquí, des del primer segon de la intro.
const MUSICA_FANFARRIA = 17;
// L'ease «ease-in-out» del CSS: cubic-bezier(.42, 0, .58, 1)
const EASE_CSS = (() => {
    const bx = t => 3 * (1 - t) * (1 - t) * t * 0.42 + 3 * (1 - t) * t * t * 0.58 + t * t * t;
    const by = t => 3 * (1 - t) * t * t + t * t * t;                       // els punts de control en y són 0 i 1
    return x => { let a = 0, b = 1; for (let i = 0; i < 24; i++) { const m = (a + b) / 2; if (bx(m) < x) a = m; else b = m; } return by((a + b) / 2); };
})();
const FADE_MUSICA = 1200;     // la música entra progressivament, perquè no se senti la nota d'abans de la fanfàrria
const FOSA_TITOL = 900;       // la foto sencera es fon cap al títol amb el logo

class EscenaTitol extends Phaser.Scene {
    constructor() { super('Titol'); }

    init(data) {
        this.mode = (data && data.mode) || 'directe';
    }

    create() {
        this.fase = 'espera';
        this.cameras.main.setBackgroundColor('#000000');

        this.construirMon();
        this.construirMenu();
        Sfx.init();
        Joc.precarregarMusiques(this);       // la resta de cançons, en segon pla mentre es mira la intro

        this.input.keyboard.on('keydown', e => this.tecla(e));
        this.input.on('pointerdown', (p, objs) => { if (!objs.length) this.tecla(null); });

        if (this.mode === 'intro') {
            this.construirPortada();
        } else {
            Joc.iniciarMusica(this, MUSICA_FANFARRIA, 'musica_intro', FADE_MUSICA);
            this.anarAlBucle(false);
            this.cameras.main.fadeIn(600);
        }
    }

    // Foto quadrada que cobreix tota la pantalla (mai hi ha franges negres): omple l'alçada i es retalla pels costats, o al revés
    escalaVertical(w, h) { return Math.max(AMPLE / w, ALT / h); }

    // El món de la portada: la foto fixa dins d'un contenidor, que és el que fa el zoom.
    construirMon() {
        const foto = this.add.image(0, 0, 'portada_intro');
        const W = this.fw = foto.width, H = this.fh = foto.height;
        this.mon = this.add.container(AMPLE / 2, ALT / 2, [foto]).setDepth(1).setVisible(false);

        // Boirina transparent que passa per sobre de la foto: dues capes suaus que avancen en sentits oposats (dins del contenidor, fan el zoom)
        if (!this.textures.exists('boira_intro')) {
            const cv = this.textures.createCanvas('boira_intro', 512, 256), c = cv.getContext(), r = (n => () => (n = (n * 16807) % 2147483647) / 2147483647)(5);
            for (let k = 0; k < 26; k++) {
                const x = r() * 512, y = 40 + r() * 176, rx = 60 + r() * 90, ry = 18 + r() * 36;
                for (const dx of [-512, 0, 512]) {                                     // repetit a banda i banda: la textura encaixa en horitzontal
                    c.save(); c.translate(x + dx, y); c.scale(rx / ry, 1);
                    const g = c.createRadialGradient(0, 0, 0, 0, 0, ry);
                    g.addColorStop(0, 'rgba(255,255,255,0.55)'); g.addColorStop(1, 'rgba(255,255,255,0)');
                    c.fillStyle = g; c.beginPath(); c.arc(0, 0, ry, 0, Math.PI * 2); c.fill(); c.restore();
                }
            }
            cv.refresh();
        }
        this.boires = [[0.50, 0.30, 0.42, 30, 0xffd6a0], [0.38, 0.22, 0.32, -20, 0xffc890], [0.66, 0.22, 0.24, 14, 0xffe0b8]].map(([cy, alt, alfa, vel, tint]) => {
            const t = this.add.tileSprite(0, (cy - 0.5) * H, W, alt * H, 'boira_intro').setBlendMode('ADD').setAlpha(alfa).setTint(tint).setTileScale(W / 512 * 0.9, alt * H / 256);
            this.mon.add(t);
            return { t, vel };
        });

        // El logo, per codi, a sobre de la foto (surt en acabar la intro)
        this.logo = this.add.image(AMPLE / 2, ALT * 0.06, 'logo_runna').setOrigin(0.5, 0).setDepth(5).setAlpha(0);
        this.logo.setScale(AMPLE * 0.62 / this.logo.width);           // centrat, amb marges als costats i a dalt
        this.c = { z: 1, x: 0.5, y: 0.5 };
        this.posaMon();
    }

    // Posa el contenidor segons el zoom i el punt enfocat (fraccions de la foto); mai no es veuen les vores
    posaMon() {
        const c = this.c, sc = this.escalaVertical(this.fw, this.fh) * c.z, dw = this.fw * sc, dh = this.fh * sc;
        const centra = (f, dim, pant) => dim <= pant ? pant / 2 : Phaser.Math.Clamp(pant / 2 - (f - 0.5) * dim, pant - dim / 2, dim / 2);
        this.mon.setScale(sc).setPosition(centra(c.x, dw, AMPLE), centra(c.y, dh, ALT));
    }

    // ---------- Portada ----------
    construirPortada() {
        this.portada = this.add.container(0, 0).setDepth(2000);
        const fons = this.add.rectangle(0, 0, AMPLE, ALT, 0x000000).setOrigin(0);
        const t = this.add.text(AMPLE / 2, ALT / 2, 'Toca la pantalla per començar',
            { fontFamily: FONT_TEXT, fontSize: '44px', fontStyle: 'bold', color: '#e8d9b0', resolution: 2 }).setOrigin(0.5);
        const so = this.add.text(AMPLE / 2 + 18, ALT * 0.68, '',
            { fontFamily: FONT_TEXT, fontSize: '28px', fontStyle: 'italic', color: '#c4b38f', resolution: 2 })
            .setOrigin(0.5).setInteractive({ useHandCursor: true });
        const iconaSo = Sfx.crearIconaAltaveu(this, AMPLE / 2 - 132, ALT * 0.68, 0xc4b38f);
        const actualitzarSo = () => {
            so.setText(Sfx.silenciat ? 'Àudio desactivat' : 'Àudio activat');
            Sfx.actualitzarIconaAltaveu(iconaSo, AMPLE / 2 - 132, ALT * 0.68, 0xc4b38f);
        };
        iconaSo.setInteractive(new Phaser.Geom.Rectangle(AMPLE / 2 - 152, ALT * 0.68 - 20, 40, 40), Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', (pointer, x, y, event) => { event.stopPropagation(); Sfx.commutarSilenci(); actualitzarSo(); });
        so.on('pointerdown', () => { Sfx.commutarSilenci(); actualitzarSo(); });
        actualitzarSo();
        this.tweens.add({ targets: t, alpha: 0.35, yoyo: true, repeat: -1, duration: 1100, ease: 'Sine.easeInOut' });
        this.portada.add([fons, t, iconaSo, so]);
    }

    tecla(e) {
        if (this.fase === 'espera' && this.mode === 'intro') {
            this.fase = 'intro';
            this.portada.destroy();
            // Tot dins del gest de l'usuari: el mòbil bloqueja play() si s'espera al desbloqueig de l'àudio
            Joc.iniciarMusica(this, MUSICA_FANFARRIA, 'musica_intro', FADE_MUSICA);
            this.comencaDesplacament();
            return;
        }
        if (this.fase === 'intro') { this.anarAlBucle(true); return; }
        if (this.fase === 'menu' && e) {
            const k = e.key;
            if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'a' || k === 'A' || k === 'w' || k === 'W') this.moure(-1);
            else if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'd' || k === 'D' || k === 's' || k === 'S') this.moure(1);
            else if ((k === 'Enter' || k === ' ') && this.menu.alpha > 0.6) { Sfx.tria(); this.opcions[this.seleccio].fn(); }
        }
    }

    // Acaba (o salta) la intro: la foto s'obre del tot, el logo hi surt a sobre, el menú apareix. La intro mai es queda ni congelada ni esperant.
    anarAlBucle(fosa) {
        if (this.fase === 'menu') return;
        this.fase = 'menu';
        this.mon.setVisible(true);
        if (this.cinta) { this.cinta.remove ? this.cinta.remove() : this.cinta.stop(); this.cinta = null; }
        if (fosa && (this.c.z > 1.001)) this.tweens.add({ targets: this.c, z: 1, x: 0.5, y: 0.5, duration: 800, ease: 'Sine.easeInOut', onUpdate: () => this.posaMon() });
        else { this.c.z = 1; this.c.x = this.c.y = 0.5; this.posaMon(); }
        this.tweens.add({ targets: this.logo, alpha: 1, duration: fosa ? 1100 : 500, delay: fosa ? 500 : 0 });
        this.mostrarMenu(fosa ? 900 : 0);
    }

    // Intro, com una animació CSS «scale(10) translate(-17%, 16%) → scale(1)» de 5 s amb ease-in-out: comença enfocant només el sol, molt
    // gran, i s'allunya fins a la foto sencera. El zoom és lineal (no logarítmic) i l'ease és el cubic-bezier(.42, 0, .58, 1) del CSS.
    comencaDesplacament() {
        const z0 = 8, x0 = 0.627, y0 = 0.34;               // el sol de la foto quadrada
        Object.assign(this.c, { z: z0, x: x0, y: y0 });
        this.posaMon();
        this.mon.setAlpha(1).setVisible(true);
        this.cameras.main.fadeIn(1200, 255, 236, 190);                                  // el sol enlluernant
        const p = { v: 0 };
        this.cinta = this.tweens.add({ targets: p, v: 1, delay: 1200, duration: 5000, ease: EASE_CSS,
            onUpdate: () => { this.c.z = z0 + (1 - z0) * p.v; const m = p.v * p.v * p.v; this.c.x = x0 + (0.5 - x0) * m; this.c.y = y0 + (0.5 - y0) * m; this.posaMon(); },
            onComplete: () => { this.cinta = null; this.anarAlBucle(true); } });
    }

    mostrarMenu(retard = 0) {
        if (this.menuMostrat) return;
        this.menuMostrat = true;
        this.tweens.add({ targets: this.menu, alpha: 1, duration: 900, delay: retard });
    }

    update(temps, dt) {
        if (this.boires && this.mon.visible) for (const b of this.boires) b.t.tilePositionX += b.vel * dt / 1000 * 3;
    }

    // ---------- Menú (a baix, per no tapar el títol del vídeo) ----------
    construirMenu() {
        this.menu = this.add.container(0, 0).setDepth(30).setAlpha(0);
        const banda = this.add.graphics();
        banda.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0, 0.75, 0.75);
        banda.fillRect(0, ALT - 300, AMPLE, 300);
        this.menu.add(banda);

        const hiHa = Estat.hiHaPartida();
        this.opcions = [];
        if (hiHa) this.opcions.push({ text: 'Continuar', fn: () => { if (Estat.carregar()) Joc.continuar(this); } });
        this.opcions.push({ text: 'Nova partida', fn: () => this.novaPartida(hiHa) });

        const separacio = 72;
        const y0 = ALT - 70 - (this.opcions.length - 1) * separacio;
        this.textOpcions = this.opcions.map((o, i) => {
            const t = this.add.text(AMPLE / 2, y0 + i * separacio, o.text, {
                fontFamily: FONT_TITOL, fontSize: '34px', fontStyle: 'bold', color: '#f2e6c8',
                stroke: '#1a120b', strokeThickness: 6, resolution: 2
            }).setOrigin(0.5).setInteractive({ useHandCursor: true })
                .on('pointerover', () => { this.seleccio = i; this.pintar(); })
                .on('pointerdown', () => { if (this.fase === 'menu' && this.menu.alpha > 0.6) o.fn(); });
            this.menu.add(t);
            return t;
        });
        this.seleccio = 0;
        this.pintar();

        if (location.protocol === 'file:' || Grafics.pixelsBloquejats) {
            this.menu.add(this.add.text(AMPLE / 2, 16,
                'Atenció: obre el joc amb un servidor local (Live Server de VS Code) perquè tot funcioni bé.',
                estilText(20, '#ffb0a0', { backgroundColor: '#1a120bcc', padding: { x: 10, y: 5 }, wordWrap: { width: 660 } })).setOrigin(0.5, 0));
        }
    }

    moure(d) {
        this.seleccio = (this.seleccio + d + this.opcions.length) % this.opcions.length;
        Sfx.menu();
        this.pintar();
    }

    pintar() {
        this.textOpcions.forEach((t, i) => {
            t.setColor(i === this.seleccio ? '#ffd34d' : '#f2e6c8');
            t.setText(i === this.seleccio ? `✦ ${this.opcions[i].text} ✦` : this.opcions[i].text);
        });
    }

    novaPartida(hiHa) {
        if (hiHa && !window.confirm('Començar una partida nova? Es perdrà la partida desada.')) return;
        Estat.nova();
        Estat.desar();
        this.scene.start('Proleg');
    }
}
