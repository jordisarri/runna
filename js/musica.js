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
                           { avis: 'Has obtingut LA FLAUTA D\'EN MAMET!' }] : []),
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
        E.posaObjectiu(!E.flag('josepVencut') ? 'Ves al Celler (entre la Plaça i les Runes) i guanya en Jusef a ping-pong: allà els secrets es guanyen a la taula.'
            : !E.flag('rodaMoguda') ? 'Empeny amb els Guants la roda de carruatge del Celler: amaga el túnel dels monjos.' : 'Segueix el túnel dels monjos fins a la Casa Gran.');
    }
    if (ui) ui.obrirDialeg({ pagines }, () => E.desar());
}

// Mides del pergamí de la flauta (a baix de la pantalla; el joc es continua veient a sobre)
const MUS_W = 680, MUS_H = 440, MUS_T = ALT - 455;

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

        const cx = AMPLE / 2, T = MUS_T;
        const llibre = { fontFamily: FONT_LLIBRE, resolution: 2 };
        this.panell = this.add.container(0, 30).setAlpha(0);
        const add = o => { this.panell.add(o); return o; };

        // Pergamí amb marc de fusta
        const g = add(this.add.graphics());
        g.fillStyle(0x000000, 0.35).fillRoundedRect(cx - MUS_W / 2 + 6, T + 10, MUS_W, MUS_H, 22);                    // ombra
        g.fillStyle(0x4a2c14, 1).fillRoundedRect(cx - MUS_W / 2, T, MUS_W, MUS_H, 22);                                // fusta
        g.lineStyle(3, 0xd4af37, 0.9).strokeRoundedRect(cx - MUS_W / 2 + 2, T + 2, MUS_W - 4, MUS_H - 4, 21);
        g.fillStyle(0xe4cf9c, 1).fillRoundedRect(cx - MUS_W / 2 + 14, T + 14, MUS_W - 28, MUS_H - 28, 12);            // paper
        let s = 11;
        const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
        for (let i = 0; i < 26; i++) {                                                                                 // taques del paper
            g.fillStyle(r() < 0.5 ? 0xc9a868 : 0xf2e2b0, 0.22).fillCircle(cx - MUS_W / 2 + 30 + r() * (MUS_W - 60), T + 30 + r() * (MUS_H - 60), 12 + r() * 34);
        }
        g.lineStyle(2, 0x7a2818, 0.5).strokeRoundedRect(cx - MUS_W / 2 + 24, T + 24, MUS_W - 48, MUS_H - 48, 8);       // filet vermell
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => g.fillStyle(0xd4af37, 1).fillCircle(cx + sx * (MUS_W / 2 - 12), T + (sy < 0 ? 12 : MUS_H - 12), 5));

        this.titol = add(this.add.text(cx, T + 46, '', { fontFamily: FONT_TITOL, fontSize: '28px', fontStyle: 'bold', color: '#6a1f12', resolution: 2 }).setOrigin(0.5));
        this.estat = add(this.add.text(cx, T + 86, '', { ...llibre, fontSize: '25px', fontStyle: 'italic', color: '#3a2412', align: 'center', wordWrap: { width: 580 } }).setOrigin(0.5));

        // Fila de notes (es van omplint amb el color de cada nota)
        // En mode lliure, tantes caselles com notes té el cant més llarg que coneixes (3 si encara no en coneixes cap: només hi ha tres notes)
        const nSlots = llico ? this.melodia.notes.length : Math.max(3, ...Object.values(MELODIES).filter(m => Estat.flag(m.flag)).map(m => m.notes.length));
        this.slots = [];
        for (let i = 0; i < nSlots; i++) {
            const x = cx + (i - (nSlots - 1) / 2) * 44, y = T + 128;
            const ple = add(this.add.circle(x, y, 14, 0x000000, 0.08));
            const anell = add(this.add.circle(x, y, 14).setStrokeStyle(3, 0x5a3a1a, 0.8));
            this.slots.push({ ple, anell });
        }

        // La flauta: una canya amb tres forats, damunt dels botons
        const fy = T + 168;
        const fl = add(this.add.graphics());
        fl.fillStyle(0x6a4a1c, 1).fillRoundedRect(cx - 262, fy - 17, 524, 34, 16);
        fl.fillStyle(0xd8b866, 1).fillRoundedRect(cx - 258, fy - 13, 516, 26, 13);
        fl.fillStyle(0xf2dc96, 0.7).fillRoundedRect(cx - 250, fy - 10, 500, 8, 4);                                    // llum a la canya
        [-150, -60, 40, 150].forEach(x => fl.lineStyle(3, 0x7a5420, 0.9).lineBetween(cx + x, fy - 13, cx + x, fy + 13));   // nusos
        fl.fillStyle(0x3a2412, 1).fillRoundedRect(cx - 262, fy - 17, 26, 34, 10);                                     // broquet
        this.botons = [null, 1, 2, 3].map(n => {
            if (!n) return null;
            const x = cx + (n - 2) * 140;
            const forat = add(this.add.circle(x, fy, 9, 0x2a1608, 1).setStrokeStyle(2, 0x5a3a14, 1));
            const halo = add(this.add.circle(x, fy, 22, COLORS_NOTA[n], 0).setBlendMode(Phaser.BlendModes.ADD));
            // Botó: disc de fusta amb una gemma del color de la nota
            const by = T + 250;
            const base = add(this.add.circle(x, by, 56, 0x3a2412, 1).setStrokeStyle(4, 0xd4af37, 0.9).setInteractive({ useHandCursor: true }));
            base.on('pointerdown', () => this.nota(n, true));
            const gemma = add(this.add.circle(x, by, 46, COLORS_NOTA[n], 0.7));
            add(this.add.circle(x, by, 46).setStrokeStyle(3, 0x000000, 0.35));
            add(this.add.ellipse(x - 14, by - 20, 26, 14, 0xffffff, 0.35));                                           // reflex
            add(this.add.text(x, by + 2, String(n), { fontFamily: FONT_TITOL, fontSize: '40px', fontStyle: 'bold', color: '#ffffff', stroke: '#2a1608', strokeThickness: 6, resolution: 2 }).setOrigin(0.5));
            add(this.add.text(x, by + 74, ['', '←', 'ESPAI', '→'][n], { ...llibre, fontSize: '20px', color: '#5a3a1a' }).setOrigin(0.5));
            return { x, by, base, gemma, forat, halo };
        });

        // Teclat: 1, 2, 3 (o el teclat numèric), o bé ← (nota 1), ESPAI (nota 2) i → (nota 3); també A, W/S i D
        const k = this.input.keyboard;
        const TECLES = { 1: ['ONE', 'NUMPAD_ONE', 'LEFT', 'A'], 2: ['TWO', 'NUMPAD_TWO', 'SPACE', 'UP', 'DOWN', 'W', 'S'], 3: ['THREE', 'NUMPAD_THREE', 'RIGHT', 'D'] };
        Object.entries(TECLES).forEach(([n, noms]) => noms.forEach(nom => k.on('keydown-' + nom, () => this.nota(Number(n), true))));
        k.on('keydown-ESC', () => this.tancar(false));

        if (llico) {
            this.titol.setText('Lliçó: ' + this.melodia.nom);
            this.time.delayedCall(700, () => this.reproduir());
        } else {
            this.titol.setText('La flauta d\'en Mamet');
            this.estat.setText('Toca les notes: 1, 2, 3 (o ← ESPAI →)');
            const sabudes = Object.values(MELODIES).filter(m => Estat.flag(m.flag));
            // Els cants que coneixes, un per línia (en una sola línia s'enrotllaven i es trepitjaven amb les etiquetes dels botons)
            const llista = sabudes.length ? sabudes.map(m => `${m.nom}: ${m.notes.join('-')}`) : ['Encara no coneixes cap cant.'];
            llista.forEach((t, i) => add(this.add.text(cx, T + 356 + i * 26, t, { ...llibre, fontSize: '20px', fontStyle: 'italic', color: '#6a4a28', align: 'center' }).setOrigin(0.5)));
            add(this.add.text(cx + MUS_W / 2 - 34, T + 40, '✕', { fontFamily: FONT_PLACA, fontSize: '30px', fontStyle: 'bold', color: '#6a1f12', padding: { x: 8, y: 4 }, resolution: 2 })
                .setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.tancar(false)));
            this.lastTime = 0;
        }
        this.tweens.add({ targets: this.panell, alpha: 1, y: 0, duration: 350, ease: 'Sine.easeOut' });
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

    // La gemma s'encén i rebota, el forat de la flauta brilla, una ona surt del botó i una nota musical puja
    llum(n) {
        const b = this.botons[n], color = COLORS_NOTA[n];
        this.so(n);
        b.gemma.setFillStyle(color, 1);
        this.tweens.add({ targets: [b.base, b.gemma], scale: { from: 1.14, to: 1 }, duration: 260, ease: 'Back.easeOut' });
        this.time.delayedCall(280, () => { if (b.gemma.active) b.gemma.setFillStyle(color, 0.7); });
        b.forat.setFillStyle(color, 1);
        b.halo.setAlpha(0.85);
        this.tweens.add({ targets: b.halo, alpha: 0, scale: { from: 1, to: 1.8 }, duration: 520 });
        this.time.delayedCall(320, () => { if (b.forat.active) b.forat.setFillStyle(0x2a1608, 1); });
        const ona = this.add.circle(b.x, b.by, 56).setStrokeStyle(4, color, 0.9);
        this.panell.add(ona);
        this.tweens.add({ targets: ona, scale: 1.7, alpha: 0, duration: 520, onComplete: () => ona.destroy() });
        const nota = this.add.text(b.x + Phaser.Math.Between(-14, 14), b.by - 66, ['♪', '♫'][Phaser.Math.Between(0, 1)],
            { fontFamily: 'Georgia, serif', fontSize: '34px', color: '#' + color.toString(16).padStart(6, '0'), stroke: '#2a1608', strokeThickness: 4, resolution: 2 }).setOrigin(0.5);
        this.panell.add(nota);
        this.tweens.add({ targets: nota, y: nota.y - 150, x: nota.x + Phaser.Math.Between(-30, 30), alpha: 0, angle: Phaser.Math.Between(-18, 18), duration: 1100, ease: 'Sine.easeOut', onComplete: () => nota.destroy() });
    }

    // Fila de notes: omple cada casella amb el color de la nota tocada (en mode lliure, les últimes cinc)
    pintaSlots(notes) {
        const vistes = notes.slice(-this.slots.length);
        this.slots.forEach((sl, i) => {
            const n = vistes[i];
            sl.ple.setFillStyle(n ? COLORS_NOTA[n] : 0x000000, n ? 1 : 0.08);
            sl.anell.setStrokeStyle(3, n ? 0x3a2412 : 0x5a3a1a, n ? 1 : 0.8);
            if (n) this.tweens.add({ targets: [sl.ple, sl.anell], scale: { from: 1.35, to: 1 }, duration: 220, ease: 'Back.easeOut' });
        });
    }
    flaixSlots(color) {
        this.slots.forEach(sl => { sl.ple.setFillStyle(color, 1); this.tweens.add({ targets: [sl.ple, sl.anell], scale: { from: 1.25, to: 1 }, duration: 300, ease: 'Back.easeOut' }); });
    }

    // ---- Lliçó: la Pianista toca i l'Ineu repeteix ----
    reproduir() {
        this.bloquejat = true;
        this.entrada = [];
        this.pintaSlots([]);
        this.estat.setText('Escolta la Pianista...');
        this.melodia.notes.forEach((n, i) => this.time.delayedCall(i * 650, () => { this.llum(n); this.pintaSlots(this.melodia.notes.slice(0, i + 1)); }));
        this.time.delayedCall(this.melodia.notes.length * 650 + 300, () => {
            this.bloquejat = false;
            this.entrada = [];
            this.pintaSlots([]);
            this.estat.setText('Ara tu! Repeteix les notes: 1, 2, 3 (o ← ESPAI →).');
        });
    }

    nota(n, humana) {
        if (this.bloquejat || this.tancat) return;
        this.llum(n);
        this.entrada.push(n);

        if (this.llico) {
            this.pintaSlots(this.entrada);
            const i = this.entrada.length - 1;
            if (this.melodia.notes[i] !== n) {
                this.bloquejat = true;
                this.flaixSlots(0xb03030);
                this.estat.setText('Això no era... torna a escoltar.');
                this.time.delayedCall(1000, () => this.reproduir());
            } else if (this.entrada.length === this.melodia.notes.length) {
                this.bloquejat = true;
                this.flaixSlots(0xe8c040);
                this.estat.setText('Perfecte!');
                this.time.delayedCall(900, () => this.tancar(true));
            }
            return;
        }

        // Mode lliure: busca un cant après al final del que s'ha tocat
        const ara = this.time.now;
        if (ara - this.lastTime > 3500) this.entrada = [n];
        this.lastTime = ara;
        this.pintaSlots(this.entrada);
        for (const [clau, m] of Object.entries(MELODIES)) {
            if (!Estat.flag(m.flag)) continue;
            const l = m.notes.length, fi = this.entrada.slice(-l);
            if (fi.length === l && fi.every((x, i) => x === m.notes[i])) {
                this.bloquejat = true;
                this.flaixSlots(0xe8c040);
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
