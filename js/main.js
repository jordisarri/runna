/**
 * MAIN: configuració del joc, càrrega, pantalla de títol i pròleg.
 * Afegeix ?debug a l'adreça per veure les caixes de col·lisió (vermell) i sortides (blau).
 */
const Joc = {
    debug: new URLSearchParams(location.search).has('debug'),
    ZONES: ['ZonaPlaca', 'ZonaEsglesia', 'ZonaMonestir', 'ZonaCreu', 'ZonaCasaGran', 'ZonaRuines', 'ZonaPingpong',
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
        ZonaRuines: 'musica_intro', ZonaCelles: 'musica_celles', ZonaSantAntoni: 'musica_intro', ZonaTaverna: 'musica_intro', ZonaJordi: 'musica_bosc', ZonaCasetaJoc: 'musica_casa', ZonaCasaJordi: 'musica_casa', ZonaEra: 'musica_intro', ZonaJardi: 'musica_intro', ZonaCementiri: 'musica_intro',
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
        jingle_boss:       { fitxer: 'jingle_boss',  fallback: null, jingle: true }
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

    carregarMusica(scene, clau) {
        const enCua = [...scene.load.list.entries, ...scene.load.inflight.entries].some(f => f.type === 'audio' && f.key === clau);
        if (scene.cache.audio.exists(clau) || enCua) return;
        const fitxer = Joc.FITXERS_MUSICA[clau] || (Joc.MUSICA_OPCIONAL[clau] && Joc.MUSICA_OPCIONAL[clau].fitxer);
        scene.load.audio(clau, encodeURI(`assets/musica/${fitxer}.m4a`));
    },

    precarregarMusiques(scene) {
        Object.keys(Joc.FITXERS_MUSICA).forEach(clau => Joc.carregarMusica(scene, clau));
        scene.load.start();
        Joc.detectarMusica().then(() => {             // les opcionals que existeixin també es baixen en segon pla
            Object.keys(Joc.MUSICA_OPCIONAL).filter(k => Joc.musicaDisponible.has(k)).forEach(k => Joc.carregarMusica(scene, k));
            scene.load.start();
        });
    },

    iniciarMusica(scene, seek = 0, clau = 'musica_intro') {
        if (Joc.MUSICA_OPCIONAL[clau] && !Joc.musicaDeteccio) {           // encara no sabem quins fitxers hi ha: s'espera un instant
            Joc.musicaPendent = clau;
            Joc.detectarMusica().then(() => { if (Joc.musicaPendent === clau) Joc.iniciarMusica(scene, seek, clau); });
            return;
        }
        clau = Joc.resoldreMusica(clau);
        if (!scene.cache.audio.exists(clau)) {
            // Encara no s'ha baixat: es carrega ara i sona en acabar, si la zona encara la vol
            Joc.musicaPendent = clau;
            scene.load.once('filecomplete-audio-' + clau, () => { if (Joc.musicaPendent === clau) Joc.iniciarMusica(scene, seek, clau); });
            Joc.carregarMusica(scene, clau);
            scene.load.start();
            return;
        }
        Joc.musicaPendent = null;
        if (Joc.musica && Joc.musicaClau === clau && Joc.musica.isPlaying) { Joc.musica.setVolume(0.6); return; }
        Joc.aturarMusica();
        Joc.musicaClau = clau;
        Joc.musica = scene.sound.add(clau, { loop: true, volume: 0.6 });
        Joc.musica.play({ seek }); // si el navegador encara no deixa sonar, Phaser l'engega al primer clic/tecla
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
        Joc.carregarMusica(this, 'musica_intro');
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
    { text: "I cada nit falta un nen.\nL'Uri i el Flam, de Sant Benet.\nI aquesta nit... el Sardin, el nebot de les monges.", dibuix: 'nens' },
    { text: "Matí. L'Ineu, el monjo més jove del Santuari, es desperta.\nEl Pare Jordi el busca a la Plaça.", dibuix: 'mati' }
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
        if (this.quadre) { const vell = this.quadre; this.tweens.add({ targets: vell, alpha: 0, duration: 600, onComplete: () => vell.destroy() }); }
        this.quadre = this.add.container(0, 0).setAlpha(0);
        this['dibuix_' + q.dibuix](this.quadre);
        this.tweens.add({ targets: this.quadre, alpha: 1, duration: 900 });
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

    // 1. L'Ocellaire amb les seves gàbies, en un pergamí de color sèpia
    dibuix_ocellaire(c) {
        this.cel(c, 0x6a4a2a, 0x2a1a0c);
        const g = this.add.graphics(); c.add(g);
        g.fillStyle(0xd8b880, 0.15).fillCircle(AMPLE / 2, 470, 330);
        // Silueta de l'Ocellaire: barret alt, capa i un pal amb gàbies penjades
        g.fillStyle(0x140a04, 1);
        g.fillTriangle(360, 330, 250, 860, 470, 860);
        g.fillCircle(360, 320, 34);
        g.fillRect(318, 236, 84, 70).fillRect(296, 296, 128, 12);
        g.lineStyle(8, 0x140a04, 1).lineBetween(400, 470, 600, 300).lineBetween(320, 470, 120, 320);
        this.gabia(g, 600, 470, 110, 150, 0x140a04, 5);
        this.gabia(g, 120, 480, 90, 130, 0x140a04, 5);
        g.fillStyle(0xd8b060, 1).fillCircle(372, 316, 5);                        // un ull que brilla
        // Ocells que piulen dins les gàbies i en vol
        [[600, 420], [120, 440], [200, 250], [520, 220], [640, 600]].forEach(([x, y], i) => {
            const o = this.imatge(c, 'ocell', x, y, 46, 0xf2d890);
            if (o) this.tweens.add({ targets: o, y: y - 10, yoyo: true, repeat: -1, duration: 500 + i * 120 });
        });
        // Nens sense riure, petits, a baix
        [[150, 940], [230, 950], [520, 945], [600, 935]].forEach(([x, y]) => { g.fillStyle(0x2a1a0c, 1).fillRoundedRect(x - 14, y - 64, 28, 64, 10).fillCircle(x, y - 76, 15); });
    }

    // 2. La gàbia sota terra, la porta de ferro i el monjo amb Runna que la segella
    dibuix_segell(c) {
        this.cel(c, 0x0a0a1a, 0x1a1020);
        const g = this.add.graphics(); c.add(g);
        g.fillStyle(0x2a2430, 1).fillRect(0, 160, AMPLE, 760);
        g.lineStyle(1.5, 0x120e16, 0.8);
        for (let y = 190, f = 0; y < 920; y += 34, f++) { g.lineBetween(0, y, AMPLE, y); for (let x = (f % 2) * 40; x < AMPLE; x += 80) g.lineBetween(x, y, x, y - 34); }
        // Porta de ferro
        g.fillStyle(0x0a0808, 1).fillRect(170, 300, 260, 400).fillStyle(0x2a2a30, 1).fillRect(182, 312, 236, 388);
        for (let y = 330; y < 700; y += 36) for (let x = 200; x < 410; x += 36) g.fillStyle(0x4a4a52, 1).fillCircle(x, y, 5);
        // Gàbia darrere, amb una ombra d'ocell
        this.gabia(g, 300, 690, 170, 260, 0x9a50ff, 3);
        g.fillStyle(0x9a50ff, 0.25).fillEllipse(300, 600, 120, 60);
        // El monjo amb l'espasa de llum
        g.fillStyle(0x0c0806, 1).fillTriangle(560, 560, 480, 900, 640, 900).fillCircle(560, 548, 30);
        const llum = this.add.graphics().setBlendMode('ADD'); c.add(llum);
        llum.fillStyle(0xbfe0ff, 0.95).fillRect(586, 380, 10, 220);
        llum.fillStyle(0xd8eeff, 0.25).fillCircle(591, 470, 130).fillStyle(0xd8eeff, 0.18).fillCircle(591, 470, 220);
        this.tweens.add({ targets: llum, alpha: 0.6, yoyo: true, repeat: -1, duration: 900 });
        // Raigs cap a la porta
        const r = this.add.graphics().setBlendMode('ADD'); c.add(r);
        for (let k = 0; k < 6; k++) r.lineStyle(3, 0xbfe0ff, 0.25).lineBetween(591, 470, 200 + k * 45, 320 + k * 60);
    }

    // 3. El Santuari de nit, la lluna i la boira lila que puja
    dibuix_boira(c) {
        this.cel(c, 0x060818, 0x1a1438);
        this.estrelles(c, 90, 520);
        const lluna = this.add.circle(560, 210, 54, 0xf4ecd0, 1); c.add(lluna);
        c.add(this.add.circle(560, 210, 90, 0xf4ecd0, 0.08));
        const s = this.imatge(c, 'esglesia', AMPLE / 2, 900, 560, 0x2a3060);
        if (s) { const l = this.add.graphics(); c.add(l); }
        const g = this.add.graphics(); c.add(g);
        g.fillStyle(0x0a0c18, 1).fillRect(0, 890, AMPLE, 400);
        // Boira lila que puja de terra
        const boira = this.add.particles(0, 0, 'boira', {
            emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(0, 860, AMPLE, 60) },
            speedY: { min: -30, max: -10 }, speedX: { min: -10, max: 10 }, scale: { start: 1.4, end: 4 },
            alpha: { start: 0.5, end: 0 }, tint: [0x9a50ff, 0x6a3ab8], lifespan: 6000, frequency: 70
        });
        c.add(boira);
        boira.fastForward(4000);
    }

    // 4. Tres finestres que s'apaguen i l'ombra que s'endú un nen cap a la Taverna
    dibuix_nens(c) {
        this.cel(c, 0x05060f, 0x141028);
        this.estrelles(c, 50, 400);
        const g = this.add.graphics(); c.add(g);
        // Silueta del poble: tres cases amb una finestra encesa cadascuna (Sant Antoni, Sant Benet i la Taverna)
        const cases = [[130, 'Uri'], [360, 'Flam'], [590, 'Sardin']];
        c.add(this.add.circle(AMPLE / 2, 300, 260, 0x8a7ab8, 0.08));
        cases.forEach(([x]) => {
            g.fillStyle(0x1c1c36, 1).fillRect(x - 100, 470, 200, 260).fillStyle(0x3a2030, 1).fillTriangle(x - 115, 474, x + 115, 474, x, 380);
            g.lineStyle(2, 0x5a5a8a, 0.6).strokeRect(x - 100, 470, 200, 260).strokeTriangle(x - 115, 474, x + 115, 474, x, 380);
        });
        cases.forEach(([x, nom], i) => {
            const f = this.add.rectangle(x, 560, 46, 58, 0xffc860, 1); c.add(f);
            const t = this.add.text(x, 760, nom, estilText(30, '#d8c8a0', { fontStyle: 'italic' })).setOrigin(0.5); c.add(t);
            this.tweens.add({ targets: f, alpha: 0.05, delay: 900 + i * 1300, duration: 700 });
            this.tweens.add({ targets: t, alpha: 0.35, delay: 900 + i * 1300, duration: 700 });
        });
        g.fillStyle(0x10101c, 1).fillRect(0, 730, AMPLE, 220);
        c.add(this.add.ellipse(AMPLE / 2, 900, 820, 140, 0x9a50ff, 0.22));
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

    // 5. Matí al Santuari: cel de sortida de sol i l'Ineu
    dibuix_mati(c) {
        this.cel(c, 0x6a9ad0, 0xf2c890);
        const sol = this.add.circle(160, 760, 120, 0xffe8a0, 0.9); c.add(sol);
        c.add(this.add.circle(160, 760, 220, 0xffe8a0, 0.2));
        this.imatge(c, 'esglesia', AMPLE / 2 + 60, 900, 560);
        const g = this.add.graphics(); c.add(g);
        g.fillStyle(0xb8a888, 1).fillRect(0, 890, AMPLE, 400);
        const ineu = this.textures.exists('ineu_down') ? this.add.sprite(AMPLE / 2, 940, 'ineu_down', 0) : null;
        if (ineu) { ineu.setOrigin(0.5, 1).setScale(((this.textures.get('ineu_down').customData || {}).escala || 0.5) * 1.8); c.add(ineu); this.tweens.add({ targets: ineu, scaleY: ineu.scaleY * 0.97, yoyo: true, repeat: -1, duration: 900 }); }
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
            ZonaPlaca, ZonaEsglesia, ZonaMonestir, ZonaCreu, ZonaCasaGran, ZonaRuines, ZonaPingpong,
            ZonaCelles, ZonaTiller, ZonaBosc, ZonaCami, ZonaErmita, ZonaErmitaInt, ZonaEra, ZonaJardi, ZonaCamiCirosa, ZonaCirosa, ZonaMasiaCirosa, ZonaTavernaInt, ZonaSotaTaverna, ZonaGirgoles, ZonaTortura, ZonaGabia, ZonaBiblioteca, ZonaMonestirRebedor, ZonaCelaStAntoni,
            ZonaCementiri, ZonaCasaGranInt, ZonaCabana, ZonaCabanaInt, ZonaCamiRov, ZonaRovellonera, ZonaGabriel, ZonaGabrielInt, ZonaDipositos, ZonaDolmen, ZonaTresor, ZonaGolfes, ZonaPassadis, ZonaCasaTresor, ZonaCabanaCami, ZonaCasaCripta, ZonaTorre, ZonaSantAntoni, ZonaTaverna, ZonaJordi, ZonaCasaJordi, ZonaCasetaJoc, ZonaSoterraniHost, ZonaHostatgeriaInt, ZonaCambraPains, ZonaCambraPhili, ZonaCambraCharm,
            EscenaUI, EscenaMusica, EscenaEstels, EscenaPingPong, EscenaCredits]
});
