/**
 * MAIN: configuració del joc, càrrega, pantalla de títol i pròleg.
 * Afegeix ?debug a l'adreça per veure les caixes de col·lisió (vermell) i sortides (blau).
 */
const Joc = {
    debug: new URLSearchParams(location.search).has('debug'),
    ZONES: ['ZonaPlaca', 'ZonaEsglesia', 'ZonaMonestir', 'ZonaCasaGran'],

    zonaActiva(scene) {
        const m = scene.game.scene;
        const key = Joc.ZONES.find(k => m.isActive(k));
        return key ? m.getScene(key) : null;
    },

    aturarTot(scene) {
        const m = scene.game.scene;
        [...Joc.ZONES, 'Titol', 'Proleg'].forEach(k => {
            if (m.isActive(k) || m.isPaused(k) || m.isSleeping(k)) m.stop(k);
        });
    },

    // Música de la intro i del títol (continua sonant del títol al pròleg)
    musica: null,

    iniciarMusica(scene) {
        if (!scene.cache.audio.exists('musica_intro')) return;
        if (Joc.fadeMusica) { clearInterval(Joc.fadeMusica); Joc.fadeMusica = null; }
        if (Joc.musica && Joc.musica.isPlaying) { Joc.musica.setVolume(0.6); return; }
        if (Joc.musica) Joc.musica.destroy();
        Joc.musica = scene.sound.add('musica_intro', { loop: true, volume: 0.6 });
        Joc.musica.play(); // si el navegador encara no deixa sonar, Phaser l'engega al primer clic/tecla
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
        m.start('Titol');
    }
};

// ---------------- CÀRREGA ----------------
class EscenaCarrega extends Phaser.Scene {
    constructor() { super('Carrega'); }

    preload() {
        const barra = this.add.rectangle(AMPLE / 2 - 250, ALT / 2, 0, 16, 0xd4af37).setOrigin(0, 0.5);
        this.add.rectangle(AMPLE / 2, ALT / 2, 504, 20).setStrokeStyle(2, 0xd4af37);
        this.add.text(AMPLE / 2, ALT / 2 - 40, 'Carregant el Miracle...', estilText(22, '#f2e6c8')).setOrigin(0.5);
        this.load.on('progress', v => { barra.width = 500 * v; });
        Grafics.carregar(this);
        this.load.audio('musica_intro', 'assets/musica/intro_runna.mp3');
    }

    create() {
        Grafics.preparar(this);
        this.scene.start('Titol');
    }
}

// ---------------- TÍTOL ----------------
class EscenaTitol extends Phaser.Scene {
    constructor() { super('Titol'); }

    create() {
        this.add.tileSprite(0, 0, AMPLE, ALT, 'herba').setOrigin(0).setTileScale(1 / RES);
        const esg = this.add.image(AMPLE / 2, 470, 'esglesia').setOrigin(0.5, 1);
        esg.setScale((this.textures.get('esglesia').customData.escala || 0.5) * 0.85);
        this.add.particles(AMPLE / 2, 520, 'boira', {
            x: { min: -600, max: 600 }, y: { min: -30, max: 60 },
            speedX: { min: -10, max: 10 }, speedY: { min: -15, max: -4 },
            scale: { start: 1.2, end: 3 }, alpha: { start: 0.5, end: 0 },
            lifespan: 5000, frequency: 120
        });
        this.add.rectangle(0, 0, AMPLE, ALT, 0x0d0b09, 0.45).setOrigin(0);
        Joc.iniciarMusica(this);

        this.add.text(AMPLE / 2, 120, 'RUNNA', estilText(96, '#ffd34d', { fontStyle: 'bold', stroke: '#1a120b', strokeThickness: 10 })).setOrigin(0.5);
        this.add.text(AMPLE / 2, 195, 'l\'espasa del Miracle', estilText(36, '#f2e6c8', { fontStyle: 'italic', stroke: '#1a120b', strokeThickness: 6 })).setOrigin(0.5);

        const hiHa = Estat.hiHaPartida();
        this.opcions = [];
        if (hiHa) this.opcions.push({ text: 'Continuar', fn: () => { if (Estat.carregar()) Joc.continuar(this); } });
        this.opcions.push({ text: 'Nova partida', fn: () => this.novaPartida(hiHa) });
        this.opcions.push({ text: 'Carregar codi de partida', fn: () => this.carregarCodi() });

        this.textOpcions = this.opcions.map((o, i) =>
            this.add.text(AMPLE / 2, 450 + i * 62, o.text, estilText(30, '#f2e6c8', { stroke: '#1a120b', strokeThickness: 6 }))
                .setOrigin(0.5).setInteractive({ useHandCursor: true })
                .on('pointerover', () => { this.seleccio = i; this.pintar(); })
                .on('pointerdown', () => o.fn()));
        this.seleccio = 0;
        this.pintar();

        this.input.keyboard.on('keydown-UP', () => { this.seleccio = (this.seleccio + this.opcions.length - 1) % this.opcions.length; this.pintar(); });
        this.input.keyboard.on('keydown-DOWN', () => { this.seleccio = (this.seleccio + 1) % this.opcions.length; this.pintar(); });
        this.input.keyboard.on('keydown-ENTER', () => this.opcions[this.seleccio].fn());
        this.input.keyboard.on('keydown-SPACE', () => this.opcions[this.seleccio].fn());

        if (location.protocol === 'file:' || Grafics.pixelsBloquejats) {
            this.add.text(AMPLE / 2, ALT - 40,
                'Atenció: has obert el joc amb doble clic. Per veure bé els dibuixos, obre\'l amb un servidor local (Live Server de VS Code).',
                estilText(16, '#ffb0a0', { backgroundColor: '#1a120bcc', padding: { x: 10, y: 6 }, wordWrap: { width: 1100 }, align: 'center' })).setOrigin(0.5);
        }
        this.cameras.main.fadeIn(500);
    }

    pintar() {
        this.textOpcions.forEach((t, i) => {
            t.setColor(i === this.seleccio ? '#ffd34d' : '#f2e6c8');
            t.setText((i === this.seleccio ? '▸ ' : '') + this.opcions[i].text);
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
        const esg = this.add.image(AMPLE / 2 - 120, 430, 'esglesia').setOrigin(0.5, 1).setTint(0x3a4470);
        esg.setScale((this.textures.get('esglesia').customData.escala || 0.5) * 0.8);
        nit.add(esg);
        const reixa = this.add.image(380, 560, 'reixa').setScale(0.6).setTint(0x556080);
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
        const grup = this.add.container(260, 640, [silueta, nen]).setAlpha(0);
        nen.x = 60;
        nit.add(grup);

        nit.add(this.add.particles(380, 560, 'boira', {
            x: { min: -40, max: 40 }, speedX: { min: 5, max: 25 }, speedY: { min: -25, max: -5 },
            scale: { start: 1, end: 3.5 }, alpha: { start: 0.7, end: 0 }, lifespan: 5000, frequency: 90
        }));
        nit.add(this.add.rectangle(0, 0, AMPLE, ALT, 0x0a0820, 0.45).setOrigin(0));

        const text = this.add.text(AMPLE / 2, ALT / 2, '', estilText(34, '#f2e6c8', { align: 'center', fontStyle: 'italic' }))
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
            this.tweens.add({ targets: grup, x: 1150, duration: 6500, ease: 'Sine.easeInOut' });
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

        this.add.text(AMPLE - 16, ALT - 12, 'ESPAI / clic: saltar', estilText(14, '#8a8070')).setOrigin(1, 1);
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
    scene: [EscenaCarrega, EscenaTitol, EscenaProleg, ZonaPlaca, ZonaEsglesia, ZonaMonestir, ZonaCasaGran, EscenaUI]
});
