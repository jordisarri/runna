/**
 * MÚSICA I MELODIES
 * La Pianista ensenya cants a l'Ineu (lliçó tipus "escolta i repeteix"). Un cop après, es poden
 * tocar amb la flauta (el medalló de la dreta o ESPAI als llocs on té efecte): 1, 2 i 3. Si estàs al lloc adequat, la melodia fa efecte
 * (la zona implementa enMelodia(nom) i retorna true si l'ha gestionada).
 */
const MELODIES = {
    aurora:  { nom: 'Cant de l\'Aurora',  notes: [1, 2, 3],       flag: 'cantAurora' },
    pedres:  { nom: 'Cant de les Pedres', notes: [3, 1, 2, 1],    flag: 'cantPedres' },
    miracle: { nom: 'Cant del Miracle',   notes: [1, 3, 2, 3, 1], flag: 'cantMiracle' }
};

const COLORS_NOTA = [0, 0xd8434a, 0xe8c040, 0x4a8ad8];
const FREQ_NOTA = [0, 330, 392, 494];

// Posa en marxa una lliçó des d'un diàleg (la Pianista)
function iniciarLliço(nom) {
    setTimeout(() => {
        if (game.scene.isActive('Musica')) return;
        game.scene.start('Musica', { mode: 'llico', melodia: nom });
        game.scene.bringToTop('Musica');
    }, 150);
}

// Lliçó acabada amb èxit: el cant queda après
function completarLliço(nom) {
    const E = Estat, m = MELODIES[nom];
    E.posaFlag(m.flag);
    const ui = game.scene.getScene('UI');
    let pagines;
    if (nom === 'aurora') {
        const primera = !E.te('flauta');
        E.dona('flauta');
        pagines = [
            { qui: 'La Pianista', text: 'Així, així! Tens oïda, fill. El Cant de l\'Aurora: tres notes, i la boira es fa enrere.' },
            ...(primera ? [{ qui: 'La Pianista', text: 'Pren aquesta flauta de canya: és la flauta d\'en Mamet. Toca les notes 1, 2 i 3.' },
                           { qui: '', text: 'Has obtingut LA FLAUTA D\'EN MAMET!\nToca el medalló de la flauta, a la dreta de la pantalla (o ESPAI quan brilli).' }] : []),
            { qui: 'La Pianista', text: 'Toca\'l davant l\'aigua de la Bassadòria, la que surt tèrbola. Allà la boira té l\'arrel.' }
        ];
        E.posaObjectiu('Toca el Cant de l\'Aurora (1-2-3) davant la Bassadòria, a l\'oest de la Plaça.');
    } else if (nom === 'pedres') {
        pagines = [
            { qui: 'La Pianista', text: 'El Cant de les Pedres: 3-1-2-1. Les pedres antigues sempre l\'han entès. Toca\'l davant l\'ombra del monjo.' }
        ];
        E.posaObjectiu('Toca el Cant de les Pedres (3-1-2-1) davant l\'ombra del monjo, a les Runes.');
    } else {
        pagines = [
            { qui: 'La Pianista', text: 'Això mateix, fill! El Cant del Miracle. Els ocells el cantaven a l\'alba, abans que l\'Ocellaire se\'l quedés i el tanqués a la seva gàbia.' },
            { qui: 'La Pianista', text: 'Diu la meva mare que aquella gàbia només s\'obre amb el cant que li van robar. Si els nens hi són a dins, toca\'l davant els barrots i no tindran més remei que obrir-se.' }
        ];
        E.posaObjectiu('Tens el Cant del Miracle (1-3-2-3-1): obre la gàbia de l\'Ocellaire. La porta de ferro és sota la Taverna.');
    }
    if (ui) ui.obrirDialeg({ pagines }, () => E.desar());
}

class EscenaMusica extends Phaser.Scene {
    constructor() { super('Musica'); }

    init(data) { this.dades = data || { mode: 'lliure' }; }

    create() {
        const llico = this.dades.mode === 'llico';
        this.llico = llico;
        this.melodia = llico ? MELODIES[this.dades.melodia] : null;
        this.entrada = [];
        this.bloquejat = false;
        this.tancat = false;

        const cx = AMPLE / 2, cy = ALT - 130;
        this.add.rectangle(cx, ALT - 135, 680, 290, 0x120b06, 0.9).setStrokeStyle(4, 0xd4af37);
        this.titol = this.add.text(cx, ALT - 262, '', estilText(30, '#ffd34d', { fontStyle: 'bold' })).setOrigin(0.5);
        this.estat = this.add.text(cx, ALT - 222, '', estilText(24, '#f2e6c8', { fontStyle: 'italic', align: 'center', wordWrap: { width: 640 } })).setOrigin(0.5);

        this.botons = [null, 1, 2, 3].map((n, i) => {
            if (!n) return null;
            const x = cx + (n - 2) * 140;
            const cercle = this.add.circle(x, cy + 10, 52, COLORS_NOTA[n], 0.55).setStrokeStyle(4, 0xffffff, 0.7)
                .setInteractive({ useHandCursor: true }).on('pointerdown', () => this.nota(n, true));
            this.add.text(x, cy + 10, String(n), estilText(34, '#ffffff', { fontStyle: 'bold', stroke: '#000', strokeThickness: 5 })).setOrigin(0.5);
            this.add.text(x, cy - 62, ['', '←', 'ESPAI', '→'][n], estilText(20, '#f2e6c8', { stroke: '#000', strokeThickness: 3 })).setOrigin(0.5);
            return cercle;
        });
        this.punts = this.add.text(cx, ALT - 52, '', estilText(26, '#ffffff')).setOrigin(0.5);

        // Teclat: 1, 2, 3 (o el teclat numèric), o bé ← (nota 1), ESPAI (nota 2) i → (nota 3); també A, W/S i D
        const k = this.input.keyboard;
        const TECLES = { 1: ['ONE', 'NUMPAD_ONE', 'LEFT', 'A'], 2: ['TWO', 'NUMPAD_TWO', 'SPACE', 'UP', 'DOWN', 'W', 'S'], 3: ['THREE', 'NUMPAD_THREE', 'RIGHT', 'D'] };
        Object.entries(TECLES).forEach(([n, noms]) => noms.forEach(nom => k.on('keydown-' + nom, () => this.nota(Number(n), true))));
        k.on('keydown-ESC', () => this.tancar(false));

        if (llico) {
            this.titol.setText('Lliçó: ' + this.melodia.nom);
            this.time.delayedCall(500, () => this.reproduir());
        } else {
            this.titol.setText('La flauta d\'en Mamet');
            this.estat.setText('Toca les notes: 1, 2, 3 (o ← ESPAI →)');
            const sabudes = Object.values(MELODIES).filter(m => Estat.flag(m.flag));
            this.add.text(cx, ALT - 34, sabudes.length
                ? sabudes.map(m => `${m.nom}: ${m.notes.join('-')}`).join('   ·   ')
                : 'Encara no coneixes cap cant.', estilText(20, '#a89878', { align: 'center', wordWrap: { width: 650 } })).setOrigin(0.5);
            this.add.text(cx + 330, ALT - 262, 'Guardar ✕', estilText(24, '#f2e6c8', { backgroundColor: '#1a120bcc', padding: { x: 8, y: 4 } }))
                .setOrigin(1, 0.5).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.tancar(false));
            this.lastTime = 0;
        }
    }

    // ---- So i imatge de cada nota ----
    so(n) {
        const ctx = this.sound && this.sound.context;
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'triangle'; o.frequency.value = FREQ_NOTA[n];
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.55);
        o.connect(g); g.connect(ctx.destination);
        o.start(); o.stop(ctx.currentTime + 0.6);
    }

    llum(n) {
        const b = this.botons[n];
        this.so(n);
        b.setFillStyle(COLORS_NOTA[n], 1).setScale(1.12);
        this.time.delayedCall(260, () => { if (b.active) b.setFillStyle(COLORS_NOTA[n], 0.55).setScale(1); });
    }

    // ---- Lliçó: la Pianista toca i l'Ineu repeteix ----
    reproduir() {
        this.bloquejat = true;
        this.entrada = [];
        this.punts.setText('');
        this.estat.setText('Escolta la Pianista...');
        this.melodia.notes.forEach((n, i) => this.time.delayedCall(i * 650, () => this.llum(n)));
        this.time.delayedCall(this.melodia.notes.length * 650 + 300, () => {
            this.bloquejat = false;
            this.estat.setText('Ara tu! Repeteix les notes: 1, 2, 3 (o ← ESPAI →).');
        });
    }

    nota(n, humana) {
        if (this.bloquejat || this.tancat) return;
        this.llum(n);
        this.entrada.push(n);
        this.punts.setText(this.entrada.map(x => '●').join(' '));

        if (this.llico) {
            const i = this.entrada.length - 1;
            if (this.melodia.notes[i] !== n) {
                this.bloquejat = true;
                this.estat.setText('Això no era... torna a escoltar.');
                this.time.delayedCall(1000, () => this.reproduir());
            } else if (this.entrada.length === this.melodia.notes.length) {
                this.bloquejat = true;
                this.estat.setText('Perfecte!');
                this.time.delayedCall(900, () => this.tancar(true));
            }
            return;
        }

        // Mode lliure: busca un cant après al final del que s'ha tocat
        const ara = this.time.now;
        if (ara - this.lastTime > 3500) this.entrada = [n];
        this.lastTime = ara;
        this.punts.setText(this.entrada.map(() => '●').join(' '));
        for (const [clau, m] of Object.entries(MELODIES)) {
            if (!Estat.flag(m.flag)) continue;
            const l = m.notes.length, fi = this.entrada.slice(-l);
            if (fi.length === l && fi.every((x, i) => x === m.notes[i])) {
                this.bloquejat = true;
                this.estat.setText('♪ ' + m.nom);
                this.time.delayedCall(700, () => this.tancar(false, clau));
                return;
            }
        }
    }

    tancar(exit, melodiaTocada) {
        if (this.tancat) return;
        this.tancat = true;
        const ui = this.scene.get('UI');
        if (ui) ui.bloquejatFins = ui.time.now + 300;
        const nom = this.llico ? this.dades.melodia : null;
        this.scene.stop();
        if (this.llico && exit) completarLliço(nom);
        if (melodiaTocada) {
            const zona = Joc.zonaActiva(this);
            if (zona) zona.melodiaTocada(melodiaTocada);
        }
    }
}
