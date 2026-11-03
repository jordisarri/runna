/**
 * MÚSICA I MELODIES
 * La Pianista ensenya cants a l'Ineu (lliçó tipus "escolta i repeteix"). Un cop après, es poden
 * tocar amb la tarota (el medalló de la dreta o ESPAI als llocs on té efecte): 1, 2 i 3. Si estàs al lloc adequat, la melodia fa efecte
 * (la zona implementa enMelodia(nom) i retorna true si l'ha gestionada).
 */
const MELODIES = {
    aurora:  { nom: 'Cant de l\'Aurora',  notes: [1, 2, 3],       flag: 'cantAurora' },
    pedres:  { nom: 'Cant de les Pedres', notes: [3, 1, 2, 1],    flag: 'cantPedres' },
    miracle: { nom: 'Cant del Miracle',   notes: [1, 3, 2, 3, 1], flag: 'cantMiracle' }
};

const COLOR_NOTA = 0xd7ae58;
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
            ...(primera ? [
                { qui: 'La Pianista', text: 'Pren aquesta tarota. Era del Cortiner, el músic que feia sonar les representacions del Santuari. Deia que les cortines més importants no eren de vellut.' },
                { qui: 'La Pianista', text: 'La boira, les bardisses i les pedres també són vels: les notes adequades poden despertar allò que amaguen. Jo no he sabut fer-la sonar com ell. Potser a tu t\'escoltarà.' },
                { avis: 'Has obtingut LA TAROTA DEL CORTINER!' }
            ] : []),
            { qui: 'La Pianista', text: 'Toca\'l davant l\'aigua de la Bassadòria, la que surt tèrbola. Allà la boira té l\'arrel.' }
        ];
        E.posaObjectiu("La Bassadòria, al sud de la Plaça, quedarà neta amb el Cant de l'Aurora.");
    } else if (nom === 'pedres') {
        pagines = [
            { qui: 'La Pianista', text: 'El Cant de les Pedres: 3-1-2-1. Les pedres antigues sempre l\'han entès. Toca\'l davant l\'ombra del monjo.' }
        ];
        E.posaObjectiu("El Cant de les Pedres farà parlar l'ombra del monjo, a les Runes.");
    } else {
        pagines = [
            { qui: 'La Pianista', text: 'Això mateix, fill! El Cant del Miracle. Els ocells el cantaven a l\'alba, abans que l\'Ocellaire se\'l quedés i el tanqués a la seva gàbia.' },
            { qui: 'La Pianista', text: 'Diu la meva mare que aquella gàbia només s\'obre amb el cant que li van robar. Si els nens hi són a dins, toca\'l davant els barrots i no tindran més remei que obrir-se.' }
        ];
        E.posaObjectiu(!E.flag('josepVencut') ? "Al Celler, entre la Plaça i les Runes, els secrets es guanyen a la taula."
            : !E.flag('rodaMoguda') ? "La roda de carruatge del Celler amaga el túnel dels monjos." : 'Segueix el túnel dels monjos fins a la Casa Gran.');
    }
    if (ui) ui.obrirDialeg({ pagines }, () => E.desar());
}

// Mides del pergamí de la tarota (a baix de la pantalla; el joc es continua veient a sobre)
const MUS_W = 688, MUS_H = 570, MUS_T = ALT - 585;

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
        const zonaFl = Joc.zonaActiva(this);
        if (zonaFl && zonaFl.ineuFlauta) zonaFl.ineuFlauta(true);          // l'Ineu es veu de cara, tocant la flauta

        const cx = AMPLE / 2, T = MUS_T;
        this.primerPla(T);
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

        this.titol = add(this.add.text(cx, T + 40, '', { fontFamily: FONT_TITOL, fontSize: '28px', fontStyle: 'bold', color: '#6a1f12', resolution: 2 }).setOrigin(0.5));
        this.estat = add(this.add.text(cx, T + 77, '', { ...llibre, fontSize: '21px', fontStyle: 'italic', color: '#3a2412', align: 'center', wordWrap: { width: 600 } }).setOrigin(0.5));

        // Fila de notes per seguir la seqüència mentre s'escolta o es repeteix
        const nSlots = llico ? this.melodia.notes.length : Math.max(3, ...Object.values(MELODIES).filter(m => Estat.flag(m.flag)).map(m => m.notes.length));
        this.slots = [];
        for (let i = 0; i < nSlots; i++) {
            const x = cx + (i - (nSlots - 1) / 2) * 52, y = T + 129;
            const ple = add(this.add.circle(x, y, 17, 0x000000, 0.08));
            const anell = add(this.add.circle(x, y, 17).setStrokeStyle(3, 0x5a3a1a, 0.8));
            this.slots.push({ ple, anell });
        }

        // La tarota: llengüeta, cos cònic, forats i campana ampla
        const fy = T + 184, esquerra = cx - 258;
        const fl = add(this.add.graphics());
        fl.fillStyle(0x3a2412, 1);
        fl.beginPath();
        fl.moveTo(esquerra + 22, fy - 8); fl.lineTo(cx + 120, fy - 16);
        fl.lineTo(cx + 206, fy - 36); fl.lineTo(cx + 242, fy - 48);
        fl.lineTo(cx + 242, fy + 48); fl.lineTo(cx + 206, fy + 36);
        fl.lineTo(cx + 120, fy + 16); fl.lineTo(esquerra + 22, fy + 8);
        fl.closePath(); fl.fillPath();
        fl.fillStyle(0xb77b3d, 1);
        fl.beginPath();
        fl.moveTo(esquerra + 28, fy - 5); fl.lineTo(cx + 119, fy - 12);
        fl.lineTo(cx + 201, fy - 31); fl.lineTo(cx + 233, fy - 40);
        fl.lineTo(cx + 233, fy + 40); fl.lineTo(cx + 201, fy + 31);
        fl.lineTo(cx + 119, fy + 12); fl.lineTo(esquerra + 28, fy + 5);
        fl.closePath(); fl.fillPath();
        fl.fillStyle(0x70401f, 1).fillRoundedRect(esquerra - 2, fy - 6, 30, 12, 4);
        fl.fillStyle(0x24170f, 1).fillCircle(esquerra + 4, fy, 4);
        fl.lineStyle(3, 0xe3c579, 1);
        [-148, -54, 42, 133].forEach(x => fl.lineBetween(cx + x, fy - (x > 110 ? 14 : 11), cx + x, fy + (x > 110 ? 14 : 11)));
        fl.fillStyle(0x2d1b11, 1);
        [-105, -28, 48, 112].forEach(x => fl.fillEllipse(cx + x, fy - 2 - x * 0.05, 8, 5));
        fl.lineStyle(2, 0xf2d88e, 0.75).lineBetween(esquerra + 32, fy - 3, cx + 195, fy - 29);
        this.botons = [null, 1, 2, 3].map(n => {
            if (!n) return null;
            const x = cx + (n - 2) * 168, by = T + 287;
            const forat = add(this.add.circle(x, fy, 9, 0x2a1608, 1).setStrokeStyle(2, 0x5a3a14, 1));
            const halo = add(this.add.circle(x, fy, 22, COLOR_NOTA, 0).setBlendMode(Phaser.BlendModes.ADD));
            const base = add(this.add.circle(x, by, 56, 0x70451f, 1).setStrokeStyle(4, 0x3a2412, 1).setInteractive({ useHandCursor: true }));
            base.on('pointerdown', () => this.nota(n, true));
            const gemma = add(this.add.circle(x, by, 46, COLOR_NOTA, 1).setStrokeStyle(3, 0x3a2412, 1));
            add(this.add.ellipse(x - 12, by - 20, 24, 12, 0xffffff, 0.4));
            add(this.add.text(x, by + 1, String(n), { fontFamily: FONT_TITOL, fontSize: '39px', fontStyle: 'bold', color: '#3a2412', stroke: '#f5e2ad', strokeThickness: 2, resolution: 2 }).setOrigin(0.5));
            const tecla = ['', '←  /  1', 'ESPAI  /  2', '3  /  →'][n];
            const etiqueta = add(this.add.graphics());
            etiqueta.fillStyle(0xf1dfb1, 0.92).fillRoundedRect(x - 59, by + 67, 118, 27, 8);
            etiqueta.lineStyle(2, 0x79552b, 0.9).strokeRoundedRect(x - 59, by + 67, 118, 27, 8);
            add(this.add.text(x, by + 80, tecla, { ...llibre, fontSize: '17px', fontStyle: 'bold', color: '#3a2412' }).setOrigin(0.5));
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
            this.titol.setText('La tarota del Cortiner');
            this.estat.setText('Tria un cant après i toca’n la seqüència.');
            const sabudes = Object.values(MELODIES).filter(m => Estat.flag(m.flag));
            if (sabudes.length) {
                sabudes.forEach((m, i) => {
                    const y = T + 392 + i * 48, x = cx - 307;
                    const fila = add(this.add.graphics());
                    fila.fillStyle(i % 2 ? 0xe1cf9f : 0xe9d9b2, 0.88).fillRoundedRect(x, y, 614, 44, 8);
                    fila.lineStyle(1.5, 0x987244, 0.8).strokeRoundedRect(x, y, 614, 44, 8);
                    add(this.add.text(x + 14, y + 22, m.nom, { ...llibre, fontSize: '21px', color: '#3a2412' }).setOrigin(0, 0.5));
                    const inici = cx + 86;
                    m.notes.forEach((n, j) => {
                        const nx = inici + j * 42;
                        add(this.add.circle(nx, y + 22, 18, COLOR_NOTA).setStrokeStyle(2, 0x3a2412, 1));
                        add(this.add.text(nx, y + 22, String(n), { ...llibre, fontSize: '24px', fontStyle: 'bold', color: '#3a2412' }).setOrigin(0.5));
                    });
                });
            } else {
                this.estat.setText('Encara no coneixes cap cant.');
            }
            add(this.add.text(cx + MUS_W / 2 - 34, T + 40, '✕', { fontFamily: FONT_PLACA, fontSize: '30px', fontStyle: 'bold', color: '#6a1f12', padding: { x: 8, y: 4 }, resolution: 2 })
                .setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.tancar(false)));
            this.lastTime = 0;
        }
        this.tweens.add({ targets: this.panell, alpha: 1, y: 0, duration: 350, ease: 'Sine.easeOut' });
    }

    // Primer pla de l'Ineu tocant la tarota, gran i per sobre de l'escenari (el pergamí li tapa la part de baix)
    primerPla(T) {
        if (!this.textures.exists('ineu_tarota_gran') || Grafics.faltants.includes('ineu_tarota_gran')) return;
        const cx = AMPLE / 2, alt = Math.min(620, T + 60 - 205);          // el cap no queda sota la barra de dalt
        if (alt < 260) return;
        this.velPrimerPla = this.add.rectangle(cx, ALT / 2, AMPLE, ALT, 0x140c06, 0).setDepth(-2);           // l'escenari s'enfosqueix una mica
        this.auraPrimerPla = this.add.circle(cx, T + 40 - alt * 0.55, alt * 0.55, 0xffe2a0, 0).setBlendMode(Phaser.BlendModes.ADD).setDepth(-1);
        const img = this.add.image(cx, T + 60, 'ineu_tarota_gran').setOrigin(0.5, 1).setDepth(-1);
        img.setScale(alt / img.height);
        this.escPrimerPla = img.scale;
        this.imgPrimerPla = img;
        img.setAlpha(0).y += 40;
        this.tweens.add({ targets: img, alpha: 1, y: T + 60, duration: 380, ease: 'Back.easeOut' });
        this.tweens.add({ targets: this.velPrimerPla, fillAlpha: 0.38, duration: 380 });
        this.tweens.add({ targets: this.auraPrimerPla, fillAlpha: 0.16, duration: 600 });
        this.tweens.add({ targets: img, angle: { from: -1.5, to: 1.5 }, yoyo: true, repeat: -1, duration: 1600, ease: 'Sine.easeInOut' });   // es gronxa tocant
        this.posBroc = { x: cx + img.displayWidth * 0.2, y: T + 60 - alt * 0.38 };      // per on surten les notes
    }
    // Cada nota de l'Ineu: el primer pla fa un petit impuls i en surt una nota musical que puja
    impulsPrimerPla(n) {
        const img = this.imgPrimerPla;
        if (!img || !img.active) return;
        const e = this.escPrimerPla;
        this.tweens.add({ targets: img, scale: { from: e * 1.04, to: e }, duration: 260, ease: 'Back.easeOut' });
        this.tweens.add({ targets: this.auraPrimerPla, fillAlpha: { from: 0.34, to: 0.16 }, duration: 420 });
        const p = this.posBroc, x = p.x + (n - 2) * 36;
        const t = this.add.text(x, p.y, n === 2 ? '♫' : '♪', { fontFamily: FONT_TITOL, fontSize: '54px', fontStyle: 'bold', color: '#ffe08a', stroke: '#5a3410', strokeThickness: 5, resolution: 2 })
            .setOrigin(0.5).setDepth(0).setScale(0.4);
        this.tweens.add({ targets: t, y: p.y - 150 - Math.random() * 60, x: x + (n - 2) * 50 + (Math.random() - 0.5) * 40, scale: 1, angle: (Math.random() - 0.5) * 40, duration: 1300, ease: 'Sine.easeOut' });
        this.tweens.add({ targets: t, alpha: 0, delay: 800, duration: 500, onComplete: () => t.destroy() });
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
        o.connect(g); g.connect(Sfx.connect(ctx));
        o.start(); o.stop(ctx.currentTime + 0.6);
    }

    // La gemma s'encén i rebota, el forat de la tarota brilla i una ona surt del botó
    llum(n) {
        const b = this.botons[n], color = COLOR_NOTA;
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
    }

    // Fila de notes: omple cada casella amb el mateix color daurat
    pintaSlots(notes) {
        const vistes = notes.slice(-this.slots.length);
        this.slots.forEach((sl, i) => {
            const n = vistes[i];
            sl.ple.setFillStyle(n ? COLOR_NOTA : 0x000000, n ? 1 : 0.08);
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
            this.estat.setText('Ara tu! Repeteix la seqüència amb els botons o les tecles.');
        });
    }

    nota(n, humana) {
        if (this.bloquejat || this.tancat) return;
        this.llum(n);
        this.impulsPrimerPla(n);
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
        const zonaFl = Joc.zonaActiva(this);
        if (zonaFl && zonaFl.ineuFlauta) zonaFl.ineuFlauta(false);
        this.scene.stop();
        if (this.llico && exit) completarLliço(nom);
        if (melodiaTocada) {
            const zona = Joc.zonaActiva(this);
            if (zona) zona.melodiaTocada(melodiaTocada);
        }
    }
}
