/**
 * MAIN: configuració del joc, càrrega, pantalla de títol i pròleg.
 * Afegeix ?debug a l'adreça per veure les caixes de col·lisió (vermell) i sortides (blau).
 */
const Joc = {
    debug: new URLSearchParams(location.search).has('debug'),
    ZONES: ['ZonaPlaca', 'ZonaEsglesia', 'ZonaMonestir', 'ZonaCreu', 'ZonaCasaGran', 'ZonaRuines', 'ZonaPingpong',
            'ZonaCelles', 'ZonaBosc', 'ZonaCami', 'ZonaErmita', 'ZonaErmitaInt', 'ZonaEra', 'ZonaJardi',
            'ZonaCamiCirosa', 'ZonaCirosa', 'ZonaCementiri', 'ZonaCasaGranInt', 'ZonaCabana', 'ZonaCabanaInt', 'ZonaCamiRov', 'ZonaRovellonera', 'ZonaGabriel', 'ZonaGabrielInt', 'ZonaDipositos', 'ZonaDolmen', 'ZonaTresor', 'ZonaCabanaCami', 'ZonaCasaCripta'],

    zonaActiva(scene) {
        const m = scene.game.scene;
        const key = Joc.ZONES.find(k => m.isActive(k));
        return key ? m.getScene(key) : null;
    },

    aturarTot(scene) {
        const m = scene.game.scene;
        [...Joc.ZONES, 'Titol', 'Proleg', 'Musica', 'Estels'].forEach(k => {
            if (m.isActive(k) || m.isPaused(k) || m.isSleeping(k)) m.stop(k);
        });
    },

    // Música de la intro i del títol (continua sonant del títol al pròleg)
    musica: null,

    iniciarMusica(scene, seek = 0) {
        if (!scene.cache.audio.exists('musica_intro')) return;
        if (Joc.fadeMusica) { clearInterval(Joc.fadeMusica); Joc.fadeMusica = null; }
        if (Joc.musica && Joc.musica.isPlaying) { Joc.musica.setVolume(0.6); return; }
        if (Joc.musica) Joc.musica.destroy();
        Joc.musica = scene.sound.add('musica_intro', { loop: true, volume: 0.6 });
        Joc.musica.play({ seek }); // si el navegador encara no deixa sonar, Phaser l'engega al primer clic/tecla
    },

    aturarMusica() {
        const mus = Joc.musica;
        if (!mus || Joc.fadeMusica) return;
        Joc.fadeMusica = setInterval(() => {
            mus.setVolume(Math.max(0, mus.volume - 0.04));
            if (mus.volume <= 0) {
                clearInterval(Joc.fadeMusica);
                Joc.fadeMusica = null;
                mus.stop();
            }
        }, 50);
    },

    // Comença (o reprèn) la partida que hi ha a Estat.dades
    continuar(scene) {
        const m = scene.game.scene;
        Joc.aturarMusica();
        Joc.aturarTot(scene);
        if (!m.isActive('UI')) m.start('UI');
        else m.getScene('UI').actualitzarHUD();
        const zona = Joc.ZONES.includes(Estat.dades.zona) ? Estat.dades.zona : 'ZonaPlaca';
        m.start(zona, { restaurar: true, entrada: Estat.dades.entrada });
        m.bringToTop('UI');
    },

    anarAlTitol(scene) {
        const m = scene.game.scene;
        Joc.aturarTot(scene);
        if (m.isActive('UI')) m.stop('UI');
        m.start('Titol', { mode: 'directe' });
    }
};

// ---------------- CÀRREGA ----------------
class EscenaCarrega extends Phaser.Scene {
    constructor() { super('Carrega'); }

    preload() {
        const barra = this.add.rectangle(AMPLE / 2 - 250, ALT / 2, 0, 16, 0xd4af37).setOrigin(0, 0.5);
        this.add.rectangle(AMPLE / 2, ALT / 2, 504, 20).setStrokeStyle(2, 0xd4af37);
        this.add.text(AMPLE / 2, ALT / 2 - 40, 'Carregant el Miracle...', estilText(22, '#f2e6c8')).setOrigin(0.5);
        const detall = this.add.text(AMPLE / 2, ALT / 2 + 40, '', estilText(22, '#8a8070')).setOrigin(0.5);
        this.load.on('progress', v => { barra.width = 500 * v; });
        this.load.on('fileprogress', f => detall.setText(f.key));
        this.load.on('loaderror', f => console.warn("No s'ha pogut carregar", f.key));
        Grafics.carregar(this);
        this.load.audio('musica_intro', 'assets/musica/intro_runna.mp3');
        // Vídeos de la intro (sense el seu so: sona la música del joc)
        this.load.video('video_intro', 'assets/video/intro_runna_vertical.mp4', true);
        this.load.video('video_bucle', 'assets/video/intro_runna_bucle_vertical.mp4', true);
    }

    create() {
        Grafics.preparar(this);
        // Esperem les fonts de Google (màxim 3 s) perquè el títol es dibuixi amb la lletra bona
        const fonts = document.fonts ? Promise.all([
            document.fonts.load(`900 64px ${FONT_TITOL}`),
            document.fonts.load(`700 44px ${FONT_TEXT}`),
            document.fonts.load(`italic 600 28px ${FONT_TEXT}`),
            document.fonts.load(`700 24px ${FONT_PLACA}`)
        ]) : Promise.resolve();
        Promise.race([fonts, new Promise(r => setTimeout(r, 3000))])
            .catch(() => {})
            .then(() => this.scene.start('Titol', { mode: 'intro' }));
    }
}

// ---------------- PRÒLEG: "La nit de la boira" ----------------
class EscenaProleg extends Phaser.Scene {
    constructor() { super('Proleg'); }

    create() {
        this.acabat = false;
        this.cameras.main.setBackgroundColor('#000000');
        Joc.iniciarMusica(this);

        // Plaça de nit
        const nit = this.add.container(0, 0).setAlpha(0);
        nit.add(this.add.tileSprite(0, 0, AMPLE, ALT, 'llamborda').setOrigin(0).setTileScale(1 / RES).setTint(0x2a3050));
        const esg = this.add.image(AMPLE / 2 - 40, 600, 'esglesia').setOrigin(0.5, 1).setTint(0x3a4470);
        esg.setScale((this.textures.get('esglesia').customData.escala || 0.5) * 0.8 * (700 / 1100));   // l'edifici és més gran que abans: es manté la mida del pròleg
        nit.add(esg);
        const reixa = this.add.image(250, 760, 'reixa').setScale(0.6).setTint(0x556080);
        nit.add(reixa);

        // Siluetes: una figura amb hàbit i una de petita
        const silueta = this.add.graphics();
        silueta.fillStyle(0x07060a, 1);
        silueta.fillTriangle(0, -110, -32, 0, 32, 0);
        silueta.fillCircle(0, -112, 16);
        const nen = this.add.graphics();
        nen.fillStyle(0x07060a, 1);
        nen.fillRoundedRect(-11, -50, 22, 50, 8);
        nen.fillCircle(0, -58, 11);
        const grup = this.add.container(140, 880, [silueta, nen]).setAlpha(0);
        nen.x = 60;
        nit.add(grup);

        nit.add(this.add.particles(250, 760, 'boira', {
            x: { min: -40, max: 40 }, speedX: { min: 5, max: 25 }, speedY: { min: -25, max: -5 },
            scale: { start: 1, end: 3.5 }, alpha: { start: 0.7, end: 0 }, lifespan: 5000, frequency: 90
        }));
        nit.add(this.add.rectangle(0, 0, AMPLE, ALT, 0x0a0820, 0.45).setOrigin(0));

        const text = this.add.text(AMPLE / 2, ALT / 2, '', estilText(38, '#f2e6c8', { align: 'center', fontStyle: 'italic' }))
            .setOrigin(0.5).setAlpha(0);
        const riure = this.add.text(0, 0, 'ji, ji, ji...', estilText(20, '#d8c8ff', { fontStyle: 'italic' })).setAlpha(0);

        const mostra = (t, delay, durada) => {
            this.time.delayedCall(delay, () => {
                text.setText(t);
                this.tweens.add({ targets: text, alpha: 1, duration: 700, yoyo: true, hold: durada });
            });
        };

        mostra('Santuari del Miracle.\nTercera nit de boira.', 300, 2200);
        this.time.delayedCall(4200, () => {
            this.tweens.add({ targets: nit, alpha: 1, duration: 1200 });
            this.tweens.add({ targets: grup, alpha: 1, duration: 1500 });
            this.tweens.add({ targets: grup, x: 640, duration: 6500, ease: 'Sine.easeInOut' });
        });
        this.time.delayedCall(6500, () => {
            this.tweens.add({
                targets: riure, alpha: { from: 1, to: 0 }, duration: 2600,
                onUpdate: () => riure.setPosition(grup.x + 40, grup.y - 110)
            });
        });
        this.time.delayedCall(10500, () => this.tweens.add({ targets: nit, alpha: 0, duration: 1200 }));
        mostra('Matí.', 12000, 900);
        this.time.delayedCall(14400, () => this.acabar());

        this.add.text(AMPLE - 16, ALT - 12, 'Toca per saltar', estilText(22, '#8a8070')).setOrigin(1, 1);
        this.input.keyboard.on('keydown-SPACE', () => this.acabar());
        this.input.keyboard.on('keydown-ENTER', () => this.acabar());
        this.input.on('pointerdown', () => this.acabar());
    }

    acabar() {
        if (this.acabat) return;
        this.acabat = true;
        Joc.continuar(this);
    }
}

// ---------------- JOC ----------------
const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'joc',
    width: AMPLE,
    height: ALT,
    backgroundColor: '#0d0b09',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    physics: { default: 'arcade', arcade: { debug: Joc.debug } },
    loader: { imageLoadType: 'HTMLImageElement' },
    scene: [EscenaCarrega, EscenaTitol, EscenaProleg,
            ZonaPlaca, ZonaEsglesia, ZonaMonestir, ZonaCreu, ZonaCasaGran, ZonaRuines, ZonaPingpong,
            ZonaCelles, ZonaBosc, ZonaCami, ZonaErmita, ZonaErmitaInt, ZonaEra, ZonaJardi, ZonaCamiCirosa, ZonaCirosa,
            ZonaCementiri, ZonaCasaGranInt, ZonaCabana, ZonaCabanaInt, ZonaCamiRov, ZonaRovellonera, ZonaGabriel, ZonaGabrielInt, ZonaDipositos, ZonaDolmen, ZonaTresor, ZonaCabanaCami, ZonaCasaCripta,
            EscenaUI, EscenaMusica, EscenaEstels]
});
