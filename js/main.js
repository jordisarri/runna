/**
 * MAIN: configuració del joc, càrrega, pantalla de títol i pròleg.
 * Afegeix ?debug a l'adreça per veure les caixes de col·lisió (vermell) i sortides (blau).
 */
// Una cançó de fons en streaming: un <audio> que passa pel context d'àudio de Phaser (el volum es porta amb un GainNode, que també va a l'iPhone).
// Phaser descodifica les cançons senceres a memòria (unes 4 cançons = ~280 MB) i el mòbil acabava tancant la pestanya.
class MusicaStream {
    constructor(fitxer, volum, seek = 0) {
        this.volum = volum; this.destruida = false; this.gest = null;
        const a = this.el = new Audio();
        a.loop = true; a.preload = 'auto';
        a.src = encodeURI(`assets/musica/${fitxer}.m4a`);
        if (seek) a.addEventListener('loadedmetadata', () => { try { a.currentTime = seek; } catch (e) {} }, { once: true });
        const ctx = game.sound && game.sound.context;
        if (ctx) {
            try {
                this.gain = ctx.createGain(); this.gain.gain.value = volum;
                ctx.createMediaElementSource(a).connect(this.gain); this.gain.connect(ctx.destination);
            } catch (e) { this.gain = null; }
        }
        if (!this.gain) a.volume = Math.min(1, volum);
        this.engega();
    }
    get volume() { return this.volum; }
    get isPlaying() { return !this.destruida; }
    setVolume(v) {
        this.volum = v;
        if (this.gain) this.gain.gain.value = v; else this.el.volume = Math.min(1, Math.max(0, v));
    }
    // El navegador no deixa sonar fins que l'usuari toca alguna cosa: s'hi torna a provar al primer toc o tecla
    engega() {
        if (this.destruida) return;
        const ctx = this.gain && this.gain.context;
        if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
        const p = this.el.play();
        if (p && p.catch) p.catch(() => this.esperaGest());
    }
    esperaGest() {
        if (this.gest || this.destruida) return;
        const evs = ['pointerdown', 'touchend', 'mousedown', 'keydown'];
        this.gest = () => { evs.forEach(e => window.removeEventListener(e, this.gest, true)); this.gest = null; this.engega(); };
        evs.forEach(e => window.addEventListener(e, this.gest, true));
    }
    pausa() { if (!this.destruida) this.el.pause(); }
    destroy() {
        if (this.destruida) return;
        this.destruida = true;
        if (this.gest) ['pointerdown', 'touchend', 'mousedown', 'keydown'].forEach(e => window.removeEventListener(e, this.gest, true));
        this.el.pause(); this.el.removeAttribute('src'); this.el.load();       // allibera el que s'ha baixat
        try { if (this.gain) this.gain.disconnect(); } catch (e) {}
    }
}
document.addEventListener('visibilitychange', () => {       // amb la pestanya amagada la música no ha de seguir baixant ni sonant
    const m = Joc.musica;
    if (m && m.pausa) { if (document.hidden) m.pausa(); else m.engega(); }
});

const Joc = {
    debug: new URLSearchParams(location.search).has('debug'),
    ZONES: ['ZonaPlaca', 'ZonaEsglesia', 'ZonaMonestir', 'ZonaCreu', 'ZonaCasaGran', 'ZonaRuines', 'ZonaCellerFora', 'ZonaPingpong',
            'ZonaCelles', 'ZonaTiller', 'ZonaBosc', 'ZonaCami', 'ZonaErmita', 'ZonaErmitaInt', 'ZonaEra', 'ZonaJardi',
            'ZonaCamiCirosa', 'ZonaCirosa', 'ZonaMasiaCirosa', 'ZonaTavernaInt', 'ZonaSotaTaverna', 'ZonaGirgoles', 'ZonaTortura', 'ZonaGabia', 'ZonaBiblioteca', 'ZonaMonestirRebedor', 'ZonaCelaStAntoni', 'ZonaCementiri', 'ZonaCasaGranInt', 'ZonaCabana', 'ZonaCabanaInt', 'ZonaCamiRov', 'ZonaRovellonera', 'ZonaGabriel', 'ZonaGabrielInt', 'ZonaDipositos', 'ZonaDolmen', 'ZonaTresor', 'ZonaGolfes', 'ZonaPassadis', 'ZonaCasaTresor', 'ZonaCabanaCami', 'ZonaCasaCripta', 'ZonaTorre', 'ZonaSantAntoni', 'ZonaTaverna', 'ZonaJordi', 'ZonaCasaJordi', 'ZonaCasetaJoc', 'ZonaSoterraniHost', 'ZonaHostatgeriaInt', 'ZonaCambraPains', 'ZonaCambraPhili', 'ZonaCambraCharm'],

    zonaActiva(scene) {
        const m = scene.game.scene;
        const key = Joc.ZONES.find(k => m.isActive(k));
        return key ? m.getScene(key) : null;
    },

    aturarTot(scene) {
        const m = scene.game.scene;
        [...Joc.ZONES, 'Titol', 'Proleg', 'Musica', 'Estels', 'PingPong', 'Credits'].forEach(k => {
            if (m.isActive(k) || m.isPaused(k) || m.isSleeping(k)) m.stop(k);
        });
    },

    // Música: 'musica_intro' (overworld: intro, títol i exteriors) i 'musica_bosc' (parts de bosc)
    musica: null,
    musicaClau: null,
    // Cançó de cada zona (les que no hi són, queden en silenci)
    MUSICA_ZONES: {
        // Bosc i camins
        ZonaCami: 'musica_bosc', ZonaCamiRov: 'musica_bosc', ZonaRovellonera: 'musica_bosc', ZonaErmita: 'musica_bosc',
        ZonaGabriel: 'musica_bosc', ZonaBosc: 'musica_bosc', ZonaCamiCirosa: 'musica_bosc', ZonaCirosa: 'musica_cirosa', ZonaMasiaCirosa: 'musica_cirosa', ZonaTavernaInt: 'musica_taverna', ZonaSotaTaverna: 'musica_masmorra', ZonaGirgoles: 'musica_girgoles', ZonaTortura: 'musica_masmorra', ZonaGabia: 'musica_gabia', ZonaBiblioteca: 'musica_biblioteca', ZonaMonestirRebedor: 'musica_biblioteca', ZonaCelaStAntoni: 'musica_casa',
        ZonaDolmen: 'musica_bosc', ZonaTiller: 'musica_bosc', ZonaCabana: 'musica_bosc',
        // Exteriors (overworld)
        ZonaPlaca: 'musica_intro', ZonaMonestir: 'musica_intro', ZonaCreu: 'musica_intro', ZonaCasaGran: 'musica_intro',
        ZonaRuines: 'musica_intro', ZonaCellerFora: 'musica_intro', ZonaCelles: 'musica_celles', ZonaSantAntoni: 'musica_intro', ZonaTaverna: 'musica_intro', ZonaJordi: 'musica_bosc', ZonaCasetaJoc: 'musica_casa', ZonaCasaJordi: 'musica_casa', ZonaEra: 'musica_intro', ZonaJardi: 'musica_intro', ZonaCementiri: 'musica_intro',
        // Interiors de cases
        ZonaEsglesia: 'musica_casa', ZonaErmitaInt: 'musica_casa', ZonaGabrielInt: 'musica_casa', ZonaCabanaInt: 'musica_casa',
        ZonaCabanaCami: 'musica_casa', ZonaGolfes: 'musica_casa', ZonaTorre: 'musica_casa',
        // Masmorres
        ZonaCasaGranInt: 'musica_masmorra', ZonaPingpong: 'musica_masmorra', ZonaCasaCripta: 'musica_masmorra', ZonaPassadis: 'musica_masmorra',
        ZonaCasaTresor: 'musica_masmorra', ZonaSoterraniHost: 'musica_masmorra', ZonaHostatgeriaInt: 'musica_hostatgeria', ZonaCambraPains: 'musica_hostatgeria', ZonaCambraPhili: 'musica_hostatgeria', ZonaCambraCharm: 'musica_hostatgeria', ZonaTresor: 'musica_masmorra', ZonaDipositos: 'musica_masmorra'
    },

    // Fitxers de cada cançó (AAC .m4a, comprimides amb eines/comprimir_media.sh). Només 'musica_intro' es carrega
    // a la pantalla de càrrega; la resta es baixen en segon pla des del títol, o quan una zona les demana.
    FITXERS_MUSICA: {
        musica_intro: "The Hero's Ascension", musica_casa: 'Inside All',
        musica_masmorra: 'Deep Dungeon Stillness', musica_bosc: 'Woodland Path'
    },

    // Músiques opcionals: es fan servir si el fitxer assets/musica/<fitxer>.m4a existeix; si no, sona la de reserva ('fallback').
    // Així es poden anar afegint cançons una a una sense tocar res més (vegeu art/INSTRUCCIONS_MUSICA.md).
    MUSICA_OPCIONAL: {
        musica_celles:     { fitxer: 'celles',     fallback: 'musica_intro' },
        musica_taverna:    { fitxer: 'taverna',    fallback: 'musica_casa' },
        musica_cirosa:     { fitxer: 'cirosa',     fallback: 'musica_bosc' },
        musica_biblioteca: { fitxer: 'biblioteca', fallback: 'musica_casa' },
        musica_hostatgeria: { fitxer: 'hostatgeria', fallback: 'musica_casa' },
        musica_girgoles:   { fitxer: 'girgoles',   fallback: 'musica_masmorra' },
        musica_gabia:      { fitxer: 'gabia',      fallback: 'musica_masmorra' },
        musica_boss:       { fitxer: 'boss',       fallback: 'musica_masmorra' },
        musica_boss_final: { fitxer: 'boss_final', fallback: 'musica_boss' },
        musica_epileg:     { fitxer: 'epileg',     fallback: 'musica_intro' },
        musica_credits:    { fitxer: 'credits',    fallback: 'musica_epileg' },
        jingle_runna:      { fitxer: 'jingle_runna', fallback: null, jingle: true },
        jingle_boss:       { fitxer: 'jingle_boss',  fallback: null, jingle: true },
        jingle_objecte:    { fitxer: 'jingle_objecte', fallback: null, jingle: true }
    },
    musicaDisponible: new Set(),
    musicaDeteccio: null,
    // Mira (una sola vegada) quins fitxers opcionals hi ha realment, amb una petició HEAD per a cadascun
    detectarMusica() {
        if (!Joc.musicaDeteccio) {
            Joc.musicaDeteccio = Promise.all(Object.entries(Joc.MUSICA_OPCIONAL).map(([clau, o]) =>
                fetch(encodeURI(`assets/musica/${o.fitxer}.m4a`), { method: 'HEAD' })
                    .then(r => { if (r.ok && /audio|mp4|mpeg|octet/i.test(r.headers.get('content-type') || 'audio')) Joc.musicaDisponible.add(clau); })
                    .catch(() => {})));
        }
        return Joc.musicaDeteccio;
    },
    // La cançó que sonarà de debò: la demanada, o la de reserva si el fitxer encara no existeix
    resoldreMusica(clau) {
        let k = clau;
        while (Joc.MUSICA_OPCIONAL[k] && !Joc.musicaDisponible.has(k)) k = Joc.MUSICA_OPCIONAL[k].fallback;
        return k;
    },
    // Una peça curta que sona una sola vegada per sobre de tot (no talla la música de fons)
    jingle(scene, clau) {
        Joc.detectarMusica().then(() => {
            if (!Joc.musicaDisponible.has(clau)) return;
            const play = () => { const s = scene.sound.add(clau, { volume: 0.9 }); s.once('complete', () => s.destroy()); s.play(); };
            if (scene.cache.audio.exists(clau)) play();
            else { scene.load.once('filecomplete-audio-' + clau, play); Joc.carregarMusica(scene, clau); scene.load.start(); }
        });
    },

    // L'Ineu alça una arma nova (el bastó, la branca del Til·ler): sempre la mateixa fanfara. La música de fons s'abaixa mentre sona.
    // Si encara no hi ha el fitxer jingle_objecte.m4a, sona una fanfara sintetitzada.
    fanfaraObjecte(scene) {
        const m = Joc.musica;
        if (m && m.isPlaying) { m.setVolume(0.2); scene.time.delayedCall(2600, () => { if (Joc.musica === m) m.setVolume(0.6); }); }
        Joc.detectarMusica().then(() => { if (Joc.musicaDisponible.has('jingle_objecte')) Joc.jingle(scene, 'jingle_objecte'); else Sfx.fanfara(); });
    },

    carregarMusica(scene, clau) {
        const enCua = [...scene.load.list.entries, ...scene.load.inflight.entries].some(f => f.type === 'audio' && f.key === clau);
        if (scene.cache.audio.exists(clau) || enCua) return;
        const fitxer = Joc.FITXERS_MUSICA[clau] || (Joc.MUSICA_OPCIONAL[clau] && Joc.MUSICA_OPCIONAL[clau].fitxer);
        scene.load.audio(clau, encodeURI(`assets/musica/${fitxer}.m4a`));
    },

    // Les cançons de fons van en streaming (MusicaStream); només les peces curtes (jingles) passen per Phaser
    precarregarMusiques() {},

    iniciarMusica(scene, seek = 0, clau = 'musica_intro') {
        if (Joc.MUSICA_OPCIONAL[clau] && !Joc.musicaDeteccio) {           // encara no sabem quins fitxers hi ha: s'espera un instant
            Joc.musicaPendent = clau;
            Joc.detectarMusica().then(() => { if (Joc.musicaPendent === clau) Joc.iniciarMusica(scene, seek, clau); });
            return;
        }
        clau = Joc.resoldreMusica(clau);
        Joc.musicaPendent = null;
        if (Joc.musica && Joc.musicaClau === clau && Joc.musica.isPlaying) { Joc.musica.setVolume(0.6); return; }
        const fitxer = Joc.FITXERS_MUSICA[clau] || (Joc.MUSICA_OPCIONAL[clau] && Joc.MUSICA_OPCIONAL[clau].fitxer);
        Joc.aturarMusica();
        if (!fitxer) return;
        Joc.musicaClau = clau;
        Joc.musica = new MusicaStream(fitxer, 0.6, seek);       // en streaming: no es carrega a memòria
    },

    // Cada zona demana la seva música; els interiors queden en silenci
    musicaZona(scene) {
        let clau = Joc.MUSICA_ZONES[scene.scene.key];
        if (scene.scene.key === 'ZonaEsglesia' && Estat.flag('epilegPendent') && !Estat.flag('epilegFet')) clau = 'musica_epileg';   // l'epíleg té el seu tema
        if (clau) Joc.iniciarMusica(scene, 0, clau);
        else { Joc.musicaPendent = null; Joc.aturarMusica(); }
    },

    // Esvaeix la cançó que sona (cada cançó té el seu propi fade)
    aturarMusica() {
        const mus = Joc.musica;
        Joc.musica = null;
        Joc.musicaClau = null;
        if (!mus) return;
        const fade = setInterval(() => {
            mus.setVolume(Math.max(0, mus.volume - 0.04));
            if (mus.volume <= 0) { clearInterval(fade); mus.destroy(); }
        }, 50);
    },

    // Comença (o reprèn) la partida que hi ha a Estat.dades
    continuar(scene) {
        const m = scene.game.scene;
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
        // Vídeos de la intro (sense el seu so: sona la música del joc)
        this.load.video('video_intro', 'assets/video/intro_runna_vertical.mp4', true);
        this.load.video('video_bucle', 'assets/video/intro_runna_bucle_vertical.mp4', true);
    }

    create() {
        Grafics.preparar(this);
        // Esperem les fonts de Google (màxim 3 s) perquè el títol es dibuixi amb la lletra bona
        const fonts = document.fonts ? Promise.all([
            document.fonts.load(`900 64px ${FONT_TITOL}`),
            document.fonts.load(`700 34px ${FONT_TITOL}`),
            document.fonts.load(`700 44px ${FONT_TEXT}`),
            document.fonts.load(`600 28px ${FONT_TEXT}`),
            document.fonts.load(`italic 600 28px ${FONT_TEXT}`),
            document.fonts.load(`600 24px ${FONT_PLACA}`),
            document.fonts.load(`700 24px ${FONT_PLACA}`)
        ]) : Promise.resolve();
        Promise.race([fonts, new Promise(r => setTimeout(r, 3000))])
            .catch(() => {})
            .then(() => this.scene.start('Titol', { mode: 'intro' }));
    }
}

// ---------------- PRÒLEG: la llegenda i les tres nits de boira ----------------
// Cinc quadres il·lustrats amb un text a sota. Tocar (o ESPAI) passa al següent; «Saltar» ho salta tot.
const PROLEG_QUADRES = [
    { text: "Fa tres-cents anys, un firaire pujava cada primavera al Miracle amb gàbies plenes d'ocells que cantaven com persones: Mestre Gaspar, l'Ocellaire.\nEls nens que l'escoltaven es quedaven sense riure.", dibuix: 'ocellaire' },
    { text: "Els pastors de la Cirosa i els monjos el van tancar dins la seva pròpia gàbia, sota terra. Un monjo va segellar la porta de ferro amb la llum de Runna, l'espasa del Miracle, i la va deixar dormint entre pedres.", dibuix: 'segell' },
    { text: "Ara, fa tres nits, una boira freda i lila surt de sota terra. Marceix els horts, entela l'aigua i fa callar l'orgue del Santuari.", dibuix: 'boira' },
    { text: "I cada nit falta un nen.\nL'Uri i el Flam, de Sant Benet.\nI aquesta nit... el Sardin, el nebot de les sacerdotesses.", dibuix: 'nens' },
    { text: "Matí. Al Monestir, l'Ineu, el monjo més jove, es desperta.\nEl Pare Jordi el busca a la Plaça.", dibuix: 'mati' }
];

class EscenaProleg extends Phaser.Scene {
    constructor() { super('Proleg'); }

    create() {
        this.acabat = false;
        this.index = -1;
        this.cameras.main.setBackgroundColor('#000000');
        Joc.iniciarMusica(this);

        // Marc de pergamí per al text
        this.caixa = this.add.graphics().setDepth(50);
        this.caixa.fillStyle(0x1a120b, 0.88).fillRoundedRect(30, ALT - 330, AMPLE - 60, 250, 18);
        this.caixa.lineStyle(3, 0xd4af37, 0.9).strokeRoundedRect(30, ALT - 330, AMPLE - 60, 250, 18);
        this.text = this.add.text(AMPLE / 2, ALT - 205, '', estilText(30, '#f2e6c8', { align: 'center', fontStyle: 'italic', wordWrap: { width: AMPLE - 120 }, lineSpacing: 6 })).setOrigin(0.5).setDepth(51);
        this.punts = this.add.text(AMPLE / 2, ALT - 60, '', estilText(26, '#d4af37')).setOrigin(0.5).setDepth(51);
        this.add.text(AMPLE - 20, 20, 'Saltar ⏭', estilText(26, '#f2e6c8', { backgroundColor: '#1a120bcc', padding: { x: 14, y: 8 } }))
            .setOrigin(1, 0).setDepth(60).setInteractive({ useHandCursor: true })
            .on('pointerdown', (p, x, y, ev) => { if (ev) ev.stopPropagation(); this.acabar(); });
        this.add.text(30, ALT - 22, 'Toca per continuar', estilText(20, '#8a8070')).setOrigin(0, 1).setDepth(60);

        this.input.keyboard.on('keydown-SPACE', () => this.seguent());
        this.input.keyboard.on('keydown-ENTER', () => this.seguent());
        this.input.keyboard.on('keydown-ESC', () => this.acabar());
        this.input.on('pointerdown', (p, sobre) => { if (!sobre.length) this.seguent(); });
        this.seguent();
    }

    // Passa al quadre següent (o acaba d'escriure el text si encara s'escriu)
    seguent() {
        if (this.acabat) return;
        if (this.escrivint) { this.escrivint.remove(); this.escrivint = null; this.text.setText(this.complet); this.programarAuto(); return; }
        this.index++;
        if (this.index >= PROLEG_QUADRES.length) return this.acabar();
        const q = PROLEG_QUADRES[this.index];
        if (this.quadre) {
            const vell = this.quadre, clauVella = 'proleg_' + PROLEG_QUADRES[this.index - 1].dibuix;
            this.tweens.add({ targets: vell, alpha: 0, duration: 600, onComplete: () => { vell.destroy(); Grafics.descarta(this.textures, clauVella); } });
        }
        this.quadre = this.add.container(0, 0).setAlpha(0);
        this['dibuix_' + q.dibuix](this.quadre);
        this.tweens.add({ targets: this.quadre, alpha: 1, duration: 900 });
        const seg = PROLEG_QUADRES[this.index + 1];             // el quadre següent es dibuixa mentre es llegeix aquest (només n'hi ha dos a memòria)
        if (seg) this.time.delayedCall(1500, () => { if (!this.acabat) this.textures.get('proleg_' + seg.dibuix); });
        this.punts.setText(PROLEG_QUADRES.map((_, i) => i === this.index ? '●' : '○').join('  '));
        // Text lletra a lletra
        this.complet = q.text; let n = 0;
        this.text.setText('');
        if (this.auto) this.auto.remove();
        const ev = this.escrivint = this.time.addEvent({ delay: 28, loop: true, callback: () => {
            if (this.escrivint !== ev) return;
            n++; this.text.setText(this.complet.slice(0, n));
            if (n >= this.complet.length) { ev.remove(); this.escrivint = null; this.programarAuto(); }
        } });
    }

    programarAuto() {
        if (this.auto) this.auto.remove();
        this.auto = this.time.delayedCall(5500, () => this.seguent());
    }

    // ---------------- Il·lustracions ----------------
    cel(c, dalt, baix) {
        const g = this.add.graphics();
        const a = Phaser.Display.Color.IntegerToColor(dalt), b = Phaser.Display.Color.IntegerToColor(baix);
        for (let i = 0; i < 40; i++) {
            const k = Phaser.Display.Color.Interpolate.ColorWithColor(a, b, 39, i);
            g.fillStyle(Phaser.Display.Color.GetColor(k.r, k.g, k.b), 1).fillRect(0, i * ALT / 40, AMPLE, ALT / 40 + 1);
        }
        c.add(g);
        return g;
    }
    estrelles(c, n = 70, fins = 700) {
        for (let i = 0; i < n; i++) {
            const e = this.add.circle(Math.random() * AMPLE, Math.random() * fins, Math.random() < 0.2 ? 2 : 1, 0xffffff, 0.3 + Math.random() * 0.6);
            this.tweens.add({ targets: e, alpha: 0.1, yoyo: true, repeat: -1, duration: 700 + Math.random() * 1600 });
            c.add(e);
        }
    }
    imatge(c, key, x, y, alt, tint) {
        if (!this.textures.exists(key)) return null;
        const im = this.add.image(x, y, key).setOrigin(0.5, 1);
        im.setScale(alt / im.height);
        if (tint !== undefined) im.setTint(tint);
        c.add(im);
        return im;
    }
    gabia(g, cx, base, w, h, color, gruix = 4) {
        g.lineStyle(gruix, color, 1);
        g.strokeEllipse(cx, base, w, w * 0.22);
        g.beginPath(); g.arc(cx, base - h + w / 2, w / 2, Math.PI, 0); g.strokePath();
        for (let k = 0; k <= 8; k++) { const x = cx - w / 2 + k * w / 8; const dy = Math.sqrt(Math.max(0, (w / 2) ** 2 - (x - cx) ** 2)); g.lineBetween(x, base, x, base - h + w / 2 - dy * 0.98); }
        g.lineBetween(cx, base - h, cx, base - h - 30); g.strokeCircle(cx, base - h - 40, 10);
    }

    // Fons pintat del quadre (js/dibuixos_proleg.js), a sobre de la caixa del text
    fons(c, key) {
        const im = this.add.image(0, 0, key).setOrigin(0).setScale(1 / RES);
        c.add(im);
        return im;
    }

    // 1. Mestre Gaspar, l'Ocellaire, a la fira del Miracle: les gàbies brillen i el riure dels nens hi vola
    dibuix_ocellaire(c) {
        this.fons(c, 'proleg_ocellaire');
        const p = this.add.particles(0, 0, 'espurna', { x: { min: 60, max: 660 }, y: { min: 560, max: 900 }, speedY: { min: -40, max: -15 }, speedX: { min: -12, max: 12 },
            lifespan: 3200, scale: { start: 0.35, end: 0 }, alpha: { start: 0.8, end: 0 }, tint: [0xffe08a, 0xfff2c0], frequency: 140, blendMode: 'ADD' });
        c.add(p);
        [[130, 552], [220, 602], [500, 594], [590, 548]].forEach(([x, y], i) => {
            const l = this.add.circle(x, y, 34, 0xffd870, 0.25).setBlendMode(Phaser.BlendModes.ADD); c.add(l);
            this.tweens.add({ targets: l, alpha: 0.08, scale: 1.3, yoyo: true, repeat: -1, duration: 700 + i * 150 });
        });
    }

    // 2. Sota terra: la gàbia, els pastors i els monjos, i el monjo que segella la porta amb la llum de Runna
    dibuix_segell(c) {
        this.fons(c, 'proleg_segell');
        const l = this.add.circle(506, 300, 46, 0xd8eeff, 0.14).setBlendMode(Phaser.BlendModes.ADD); c.add(l);
        this.tweens.add({ targets: l, alpha: 0.05, scale: 1.4, yoyo: true, repeat: -1, duration: 900 });
        const g = this.add.circle(230, 470, 120, 0xa060ff, 0.12).setBlendMode(Phaser.BlendModes.ADD); c.add(g);
        this.tweens.add({ targets: g, alpha: 0.04, yoyo: true, repeat: -1, duration: 1400 });
    }

    // 3. Ara: el Santuari de nit i la boira lila que surt de les esquerdes
    dibuix_boira(c) {
        this.fons(c, 'proleg_boira');
        this.imatge(c, 'esglesia', AMPLE / 2 + 40, 830, 460, 0x2a3060);
        const boira = this.add.particles(0, 0, 'boira', {
            emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(0, 820, AMPLE, 80) },
            speedY: { min: -30, max: -10 }, speedX: { min: -10, max: 10 }, scale: { start: 1.4, end: 4 },
            alpha: { start: 0.5, end: 0 }, tint: [0x9a50ff, 0x6a3ab8], lifespan: 6000, frequency: 70
        });
        c.add(boira);
        boira.fastForward(4000);
    }

    // 4. Tres finestres que s'apaguen i l'ombra que s'endú un nen cap a la Taverna
    dibuix_nens(c) {
        this.fons(c, 'proleg_nens');
        const cases = [[40, 741, 200, 230, 'Uri'], [270, 722, 190, 250, 'Flam'], [490, 741, 200, 230, 'Sardin']];
        cases.forEach(([x, y, w, h, nom], i) => {
            const f = this.add.rectangle(x + w * 0.29, y - h * 0.57, w * 0.26 - 4, h * 0.3 - 4, 0xffc860, 1); c.add(f);
            const llum = this.add.circle(x + w * 0.29, y - h * 0.57, 60, 0xffc860, 0.18).setBlendMode(Phaser.BlendModes.ADD); c.add(llum);
            const t = this.add.text(x + w / 2, y + 36, nom, estilText(30, '#d8c8a0', { fontStyle: 'italic', stroke: '#0a0816', strokeThickness: 5 })).setOrigin(0.5); c.add(t);
            this.tweens.add({ targets: [f, llum], alpha: 0.03, delay: 900 + i * 1300, duration: 700 });
            this.tweens.add({ targets: t, alpha: 0.35, delay: 900 + i * 1300, duration: 700 });
        });
        // L'ombra amb hàbit i el nen, caminant cap a la Taverna dins la boira
        const sil = this.add.graphics();
        sil.fillStyle(0x000000, 1).fillTriangle(0, -150, -42, 0, 42, 0).fillCircle(0, -152, 22);
        sil.lineStyle(2, 0xb88aff, 0.7).strokeTriangle(0, -150, -42, 0, 42, 0).strokeCircle(0, -152, 22).strokeCircle(60, -78, 14);
        sil.fillRoundedRect(46, -66, 28, 66, 10).fillCircle(60, -78, 14);
        sil.lineStyle(5, 0x000000, 1).lineBetween(26, -80, 50, -50);
        const grup = this.add.container(-60, 900, [sil]); c.add(grup);
        this.tweens.add({ targets: grup, x: 560, duration: 9000, delay: 4400, ease: 'Sine.easeInOut' });
        const riure = this.add.text(0, 0, 'ji, ji, ji...', estilText(24, '#d8c8ff', { fontStyle: 'italic' })).setAlpha(0); c.add(riure);
        this.time.delayedCall(6500, () => this.tweens.add({ targets: riure, alpha: { from: 1, to: 0 }, duration: 2600, onUpdate: () => riure.setPosition(grup.x + 50, grup.y - 200) }));
        const boira = this.add.particles(0, 0, 'boira', {
            emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(0, 860, AMPLE, 60) },
            speedX: { min: 5, max: 25 }, speedY: { min: -20, max: -5 }, scale: { start: 1, end: 3.5 },
            alpha: { start: 0.45, end: 0 }, tint: [0x9a50ff, 0x6a3ab8], lifespan: 5000, frequency: 90
        });
        c.add(boira);
    }

    // 5. Matí al Monestir: el sol surt entre muntanyes i la boira s'arrossega per les valls
    dibuix_mati(c) {
        this.fons(c, 'proleg_mati');
        this.imatge(c, 'monestir', AMPLE / 2 + 60, 760, 380);
        const boira = this.add.particles(0, 0, 'boira', {
            emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(0, 600, AMPLE, 60) },
            speedX: { min: 4, max: 14 }, speedY: { min: -4, max: 2 }, scale: { start: 1.6, end: 3.6 },
            alpha: { start: 0.35, end: 0 }, tint: [0xe8c8f0, 0xd0b8e8], lifespan: 7000, frequency: 160
        });
        c.add(boira);
        boira.fastForward(5000);
    }

    acabar() {
        if (this.acabat) return;
        this.acabat = true;
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.time.delayedCall(520, () => Joc.continuar(this));
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
            ZonaPlaca, ZonaEsglesia, ZonaMonestir, ZonaCreu, ZonaCasaGran, ZonaRuines, ZonaCellerFora, ZonaPingpong,
            ZonaCelles, ZonaTiller, ZonaBosc, ZonaCami, ZonaErmita, ZonaErmitaInt, ZonaEra, ZonaJardi, ZonaCamiCirosa, ZonaCirosa, ZonaMasiaCirosa, ZonaTavernaInt, ZonaSotaTaverna, ZonaGirgoles, ZonaTortura, ZonaGabia, ZonaBiblioteca, ZonaMonestirRebedor, ZonaCelaStAntoni,
            ZonaCementiri, ZonaCasaGranInt, ZonaCabana, ZonaCabanaInt, ZonaCamiRov, ZonaRovellonera, ZonaGabriel, ZonaGabrielInt, ZonaDipositos, ZonaDolmen, ZonaTresor, ZonaGolfes, ZonaPassadis, ZonaCasaTresor, ZonaCabanaCami, ZonaCasaCripta, ZonaTorre, ZonaSantAntoni, ZonaTaverna, ZonaJordi, ZonaCasaJordi, ZonaCasetaJoc, ZonaSoterraniHost, ZonaHostatgeriaInt, ZonaCambraPains, ZonaCambraPhili, ZonaCambraCharm,
            EscenaUI, EscenaMusica, EscenaEstels, EscenaPingPong, EscenaCredits]
});
