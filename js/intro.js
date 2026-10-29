/**
 * INTRO I PANTALLA DE TÍTOL (amb vídeo)
 *   1. Portada "prem una tecla" (cal un gest perquè el navegador deixi sonar la música)
 *   2. assets/video/intro_runna_vertical.mp4 (10 s), sense el so del vídeo: sona la música del joc
 *   3. assets/video/intro_runna_bucle_vertical.mp4 en bucle, amb el menú a sobre
 * Qualsevol tecla o clic durant la intro salta directament al bucle i al menú.
 */
const FONT_TITOL = '"Cinzel Decorative", Georgia, serif';
const FONT_TEXT = '"Cormorant Garamond", Georgia, "Times New Roman", serif';   // serifa elegant (portada)
const FONT_LLIBRE = '"IM Fell English", "Cormorant Garamond", Georgia, serif';             // text de llibre antic (pròleg)
const FONT_PLACA = '"Cinzel", Georgia, serif';                                   // noms i títols a la interfície

// The Hero's Ascension: la fanfarria comença al segon 17 de la cançó. La música arrenca d'aquí, des del primer segon de la intro.
const MUSICA_FANFARRIA = 17;
const FOSA_BUCLE = 500;
// Si el vídeo no avança en aquest temps (el mòbil l'ha bloquejat), passem directament al bucle
const ESPERA_VIDEO = 5000;

class EscenaTitol extends Phaser.Scene {
    constructor() { super('Titol'); }

    init(data) {
        this.mode = (data && data.mode) || 'directe';
    }

    create() {
        this.fase = 'espera';
        this.cameras.main.setBackgroundColor('#000000');

        // El títol (primer fotograma del bucle) com a imatge: es veu sempre, encara que el mòbil no engegui el vídeo
        this.portadaTitol = this.add.image(AMPLE / 2, ALT / 2, 'titol_portada').setDepth(-1).setVisible(false);
        this.portadaTitol.setScale(this.escalaVertical(this.portadaTitol.width, this.portadaTitol.height));
        this.videoBucle = this.crearVideo('video_bucle', 0).setVisible(false);
        this.videoIntro = this.crearVideo('video_intro', 1).setVisible(false);
        this.construirMenu();
        Joc.precarregarMusiques(this);       // la resta de cançons, en segon pla mentre es mira la intro

        this.input.keyboard.on('keydown', e => this.tecla(e));
        this.input.on('pointerdown', (p, objs) => {
            // Menú sobre la intro congelada: un toc és un gest nou, reintentem engegar el bucle
            if (this.fase === 'menu' && this.videoBucle.video && this.videoBucle.video.paused) this.videoBucle.play(true);
            if (!objs.length) this.tecla(null);
        });

        if (this.mode === 'intro') {
            this.construirPortada();
        } else {
            Joc.iniciarMusica(this, MUSICA_FANFARRIA);
            this.videoIntro.setVisible(false);
            this.anarAlBucle(false);
            this.cameras.main.fadeIn(600);
        }
    }

    // Vídeos i portada (9:16) a pantalla completa. Si la pantalla és una mica més baixa que el vídeo, es retalla una franja a dalt i a baix
    // en lloc de deixar barres negres als costats; només si ho és molt (tauleta), es redueix sencer perquè no es talli el títol
    escalaVertical(w, h) {
        const alt = h * AMPLE / w;                       // alçada del vídeo ajustat a l'ample
        if (ALT >= alt) return ALT / h;                  // pantalla més llarga: omple l'alçada (es retalla pels costats)
        return ALT >= alt * 0.88 ? AMPLE / w : Math.min(AMPLE / w, ALT / h);
    }

    // Vídeo a pantalla completa (s'adapta a la mida quan el vídeo ja té dimensions)
    crearVideo(key, profunditat) {
        const v = this.add.video(AMPLE / 2, ALT / 2, key).setOrigin(0.5).setDepth(profunditat);
        v.setMute(true);
        // Els vídeos són verticals (9:16): mai s'estiren. Si la pantalla és més baixa (PC) es veuen sencers amb barres;
        // si és més alta (mòbil llarg) omplen l'alçada i es retallen una mica els costats
        const ajusta = () => { if (v.width > 0) v.setScale(this.escalaVertical(v.width, v.height)); };
        v.on('created', ajusta);
        v.on('playing', ajusta);
        ajusta();
        // Phaser engega sol els vídeos de la memòria cau: els aturem i rebobinem fins que toqui
        if (v.video) { v.video.pause(); v.video.currentTime = 0; }
        return v;
    }

    // ---------- Portada ----------
    construirPortada() {
        this.portada = this.add.container(0, 0).setDepth(2000);
        const fons = this.add.rectangle(0, 0, AMPLE, ALT, 0x000000).setOrigin(0);
        const t = this.add.text(AMPLE / 2, ALT / 2, 'Toca la pantalla per començar',
            { fontFamily: FONT_TEXT, fontSize: '44px', fontStyle: 'bold', color: '#e8d9b0', resolution: 2 }).setOrigin(0.5);
        const so = this.add.text(AMPLE / 2, ALT / 2 + 56, '♪ amb so',
            { fontFamily: FONT_TEXT, fontSize: '28px', fontStyle: 'italic', color: '#8a8070', resolution: 2 }).setOrigin(0.5);
        this.tweens.add({ targets: t, alpha: 0.35, yoyo: true, repeat: -1, duration: 1100, ease: 'Sine.easeInOut' });
        this.portada.add([fons, t, so]);
    }

    tecla(e) {
        if (this.fase === 'espera' && this.mode === 'intro') {
            this.fase = 'intro';
            this.portada.destroy();
            // Tot dins del gest de l'usuari: el mòbil bloqueja play() si s'espera al desbloqueig de l'àudio
            Joc.iniciarMusica(this, MUSICA_FANFARRIA);
            const v = this.videoIntro;
            v.setVisible(true);
            if (v.video) v.video.currentTime = 0;
            v.play(false);
            // Només corre la intro: dos vídeos alhora ofegaven el mòbil (la intro s'encallava). El bucle arrenca en acabar-la o en saltar-la
            this.iniciIntro = this.time.now;
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

    // Salta (o acaba) la intro: el títol (imatge del primer fotograma del bucle) es veu a l'instant, el menú hi surt a sobre i el
    // bucle en vídeo hi apareix quan el navegador el deixa córrer (amb un toc es reintenta). La intro mai es queda ni congelada ni esperant.
    anarAlBucle(fosa) {
        if (this.fase === 'menu') return;
        this.fase = 'menu';
        const b = this.videoBucle.video;
        const corria = this.bucleCorre();
        this.portadaTitol.setVisible(true);
        if (!corria) {
            this.videoBucle.setVisible(false);                  // sense fotogrames: el títol en imatge fa de fons
            if (!b || b.paused) this.videoBucle.play(true);     // dins del gest de l'usuari quan ve d'un toc
        }
        if (this.videoIntro.visible) {
            if (fosa && corria) {                                // el bucle ja corre sota la intro: es fonen
                this.tweens.add({ targets: this.videoIntro, alpha: 0, duration: FOSA_BUCLE, onComplete: () => { this.videoIntro.stop(); this.videoIntro.setVisible(false); } });
            } else { this.videoIntro.stop(); this.videoIntro.setVisible(false); }
        }
        this.esperaBucle = !corria;
        this.mostrarMenu(fosa && corria ? FOSA_BUCLE : 0);
    }

    bucleCorre() { const b = this.videoBucle.video; return !!b && !b.paused && b.readyState >= 2 && b.currentTime > 0.05; }

    mostrarMenu(retard = 0) {
        if (this.menuMostrat) return;
        this.menuMostrat = true;
        this.tweens.add({ targets: this.menu, alpha: 1, duration: 900, delay: retard });
    }

    // Quan la intro arriba al final, passem al bucle
    update() {
        const v = this.videoIntro.video;
        if (this.esperaBucle && this.bucleCorre()) {             // el bucle ha arrencat: apareix sobre el títol en imatge
            this.esperaBucle = false;
            this.videoBucle.setAlpha(0).setVisible(true);
            this.tweens.add({ targets: this.videoBucle, alpha: 1, duration: 400 });
        }
        if (this.fase === 'espera') {
            // Phaser a vegades engega els vídeos sols: mentre som a la portada, quiets
            [v, this.videoBucle.video].forEach(e => { if (e && !e.paused) { e.pause(); e.currentTime = 0; } });
            return;
        }
        if (this.fase !== 'intro' || !v) return;
        // Vídeo bloquejat pel navegador: reintentem i, si no hi ha manera, anem al bucle
        if (!v.ended && (v.paused || v.currentTime < 0.05) && this.time.now - this.iniciIntro > ESPERA_VIDEO) {
            if (!this.reintentat) { this.reintentat = true; this.iniciIntro = this.time.now; this.videoIntro.play(false); }
            else this.anarAlBucle(false);
            return;
        }
        if (v.ended || (v.duration && v.currentTime >= v.duration - 0.08)) this.anarAlBucle(true);
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
