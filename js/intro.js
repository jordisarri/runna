/**
 * INTRO I PANTALLA DE TÍTOL (amb vídeo)
 *   1. Portada "prem una tecla" (cal un gest perquè el navegador deixi sonar la música)
 *   2. assets/video/intro_runna.mp4 (20 s), sense el so del vídeo: sona la música del joc
 *   3. assets/video/intro_runna_bucle.mp4 en bucle, amb el menú a sobre
 * Qualsevol tecla o clic durant la intro salta directament al bucle i al menú.
 */
const FONT_TITOL = '"Cinzel Decorative", Georgia, serif';
const FONT_CAL = '"Great Vibes", "Brush Script MT", cursive';

// La música té 3,5 s de silenci al principi: la fem començar on ja sona
const MUSICA_INICI_INTRO = 3.5;
const FOSA_BUCLE = 500;
// Els primers fotogrames d'intro_runna.mp4 són una imatge del dolmen que sobra: els saltem
const INICI_VIDEO_INTRO = 0.25;
const VIDEO_VISIBLE = 0.76;   // part de l'amplada del vídeo que es veu (el títol hi cap amb una mica d'aire)

class EscenaTitol extends Phaser.Scene {
    constructor() { super('Titol'); }

    init(data) {
        this.mode = (data && data.mode) || 'directe';
    }

    create() {
        this.fase = 'espera';
        this.cameras.main.setBackgroundColor('#000000');

        this.videoBucle = this.crearVideo('video_bucle', 0).setVisible(false);
        this.videoIntro = this.crearVideo('video_intro', 1).setVisible(false);
        this.construirMenu();

        this.input.keyboard.on('keydown', e => this.tecla(e));
        this.input.on('pointerdown', (p, objs) => { if (!objs.length) this.tecla(null); });

        if (this.mode === 'intro') {
            this.construirPortada();
        } else {
            Joc.iniciarMusica(this, MUSICA_INICI_INTRO);
            this.videoIntro.setVisible(false);
            this.anarAlBucle(false);
            this.cameras.main.fadeIn(600);
        }
    }

    // Vídeo a pantalla completa (s'adapta a la mida quan el vídeo ja té dimensions)
    crearVideo(key, profunditat) {
        const v = this.add.video(AMPLE / 2, ALT / 2, key).setOrigin(0.5).setDepth(profunditat);
        v.setMute(true);
        // El vídeo és horitzontal: es mostra només la franja central (títol amb una mica d'aire als costats)
        const ajusta = () => { if (v.width > 0) { const f = AMPLE / (v.width * VIDEO_VISIBLE); v.setDisplaySize(v.width * f, v.height * f); } };
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
        const t = this.add.text(AMPLE / 2, ALT / 2, 'Toca la pantalla\nper començar',
            { fontFamily: FONT_CAL, fontSize: '36px', color: '#e8d9b0', resolution: 2 }).setOrigin(0.5);
        const so = this.add.text(AMPLE / 2, ALT / 2 + 60, '♪ amb so', estilText(16, '#8a8070')).setOrigin(0.5);
        this.tweens.add({ targets: t, alpha: 0.35, yoyo: true, repeat: -1, duration: 1100, ease: 'Sine.easeInOut' });
        this.portada.add([fons, t, so]);
    }

    tecla(e) {
        if (this.fase === 'espera' && this.mode === 'intro') {
            this.fase = 'intro';
            this.portada.destroy();
            const comencar = () => {
                Joc.iniciarMusica(this, MUSICA_INICI_INTRO);
                // El vídeo queda amagat (pantalla negra) fins que reprodueix des del punt bo
                this.videoIntro.setVisible(false);
                if (this.videoIntro.video) this.videoIntro.video.currentTime = INICI_VIDEO_INTRO;
                this.videoIntro.play(false);
            };
            if (this.sound.locked) this.sound.once('unlocked', comencar); else comencar();
            return;
        }
        if (this.fase === 'intro') { this.anarAlBucle(true); return; }
        if (this.fase === 'menu' && e) {
            const k = e.key;
            if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'a' || k === 'A' || k === 'w' || k === 'W') this.moure(-1);
            else if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'd' || k === 'D' || k === 's' || k === 'S') this.moure(1);
            else if (k === 'Enter' || k === ' ') this.opcions[this.seleccio].fn();
        }
    }

    anarAlBucle(fosa) {
        if (this.fase === 'menu') return;
        this.fase = 'menu';
        if (this.videoBucle.video) this.videoBucle.video.currentTime = 0;
        this.videoBucle.setVisible(true);
        this.videoBucle.play(true);
        if (fosa && this.videoIntro.visible) {
            // L'últim fotograma de la intro es fon sobre el bucle
            if (this.videoIntro.video) this.videoIntro.video.pause();
            this.tweens.add({
                targets: this.videoIntro, alpha: 0, duration: FOSA_BUCLE,
                onComplete: () => this.videoIntro.setVisible(false)
            });
        } else {
            this.videoIntro.stop();
            this.videoIntro.setVisible(false);
        }
        this.tweens.add({ targets: this.menu, alpha: 1, duration: 900, delay: fosa ? FOSA_BUCLE : 0 });
    }

    // Quan la intro arriba al final, passem al bucle
    update() {
        const v = this.videoIntro.video;
        if (this.fase === 'espera') {
            // Phaser a vegades engega els vídeos sols: mentre som a la portada, quiets
            [v, this.videoBucle.video].forEach(e => { if (e && !e.paused) { e.pause(); e.currentTime = 0; } });
            return;
        }
        if (this.fase !== 'intro' || !v) return;
        if (!this.videoIntro.visible) {
            if (!v.seeking && !v.paused && v.currentTime >= INICI_VIDEO_INTRO + 0.08 && v.currentTime < 2) this.videoIntro.setVisible(true);
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
        this.opcions.push({ text: 'Carregar codi', fn: () => this.carregarCodi() });

        const separacio = 72;
        const y0 = ALT - 70 - (this.opcions.length - 1) * separacio;
        this.textOpcions = this.opcions.map((o, i) => {
            const t = this.add.text(AMPLE / 2, y0 + i * separacio, o.text, {
                fontFamily: FONT_TITOL, fontSize: '34px', fontStyle: 'bold', color: '#f2e6c8',
                stroke: '#1a120b', strokeThickness: 6, resolution: 2
            }).setOrigin(0.5).setInteractive({ useHandCursor: true })
                .on('pointerover', () => { this.seleccio = i; this.pintar(); })
                .on('pointerdown', () => { if (this.fase === 'menu') o.fn(); });
            this.menu.add(t);
            return t;
        });
        this.seleccio = 0;
        this.pintar();

        if (location.protocol === 'file:' || Grafics.pixelsBloquejats) {
            this.menu.add(this.add.text(AMPLE / 2, 16,
                'Atenció: obre el joc amb un servidor local (Live Server de VS Code) perquè tot funcioni bé.',
                estilText(13, '#ffb0a0', { backgroundColor: '#1a120bcc', padding: { x: 10, y: 5 }, wordWrap: { width: 660 } })).setOrigin(0.5, 0));
        }
    }

    moure(d) {
        this.seleccio = (this.seleccio + d + this.opcions.length) % this.opcions.length;
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

    carregarCodi() {
        const codi = window.prompt('Enganxa el teu codi de partida:');
        if (!codi) return;
        if (Estat.importarCodi(codi)) Joc.continuar(this);
        else window.alert('Aquest codi no és vàlid.');
    }
}
