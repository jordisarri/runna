/**
 * MÚSICA I MELODIES
 * La Pianista ensenya cants a l'Ineu (lliçó tipus "escolta i repeteix"). Un cop après, es poden
 * tocar amb la tarota (el medalló de la dreta o ESPAI als llocs on té efecte): 1, 2 i 3. Si estàs al lloc adequat, la melodia fa efecte
 * (la zona implementa enMelodia(nom) i retorna true si l'ha gestionada).
 */
const MELODIES = {
    aurora:  { nom: 'Cant de l\'Aurora',  notes: [1, 2, 3],       flag: 'cantAurora', bpm: 108 },
    pedres:  { nom: 'Cant de Vespres', notes: [3, 1, 2, 1],    flag: 'cantPedres', bpm: 80 },
    miracle: { nom: 'Cant del Miracle',   notes: [1, 2, 2, 2, 3, 1], flag: 'cantMiracle', bpm: 92 }
};

// LA PEÇA COMPLETA de cada cant: el jugador toca només la «clau» (les notes de dalt) i la tarota segueix tota sola amb la resta, mentre l'Ineu toca en
// primer pla; l'efecte del lloc arriba en acabar (només si el cant té efecte allà: zona.teEfecteMelodia). [nota, durada en temps]. Les notes
// que no són dels tres botons (Re, Fa, La, Si, Do agut, Sol/La greus) només les toca la tarota.
const NOTES_FREQ = { Sol3: 196, La3: 220, Do: 262, Re: 294, Mi: 330, Fa: 349, Sol: 392, La: 440, Si: 494, Do2: 523 };
MELODIES.aurora.peca = [['Do', 1], ['Mi', 1], ['Sol', 2], ['Do2', 1], ['Si', 1], ['Sol', 1], ['La', 1], ['Sol', 2], ['Mi', 1], ['Re', 1], ['Do', 4]];
MELODIES.pedres.peca = [['Sol', 1], ['Do', 1], ['Mi', 1], ['Do', 2], ['Re', 1], ['Mi', 1], ['Re', 1], ['Do', 2], ['La3', 1], ['Do', 1], ['La3', 1], ['Sol3', 4]];
MELODIES.miracle.peca = [['Do', 1], ['Mi', 0.5], ['Mi', 0.5], ['Mi', 1], ['Sol', 1], ['Do', 2], ['Mi', 1], ['Fa', 1], ['Sol', 1], ['La', 1], ['Sol', 1], ['Do2', 4]];
// Quin dels tres botons s'il·lumina per a cada altura
const BOTO_DE = f => f <= 262 ? 1 : f <= 349 ? 2 : 3;

const COLOR_NOTA = 0xd7ae58;
// Les tres notes són Do, Mi i Sol (Do major, com el tema principal): el Cant del Miracle (Do Mi Mi Mi Sol Do) imita l'obertura del leitmotiv
// (Do Mi Mi Mi Fa Sol Do), amb un Sol on hi hauria el Fa perquè la tarota només té tres notes.
const FREQ_NOTA = [0, 262, 330, 392];

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
                { avis: 'Has obtingut LA TAROTA DEL CORTINER!', obj: 'flauta' }
            ] : []),
            { qui: 'La Pianista', text: 'Toca\'l davant l\'aigua de la Bassadòria, la que surt tèrbola. Allà la boira té l\'arrel.' }
        ];
        E.posaObjectiu("La Bassadòria quedarà neta amb el Cant de l'Aurora.");
    } else if (nom === 'pedres') {
        pagines = [
            { qui: 'La Pianista', text: E.flag('ombraDemanaCant')
                ? 'El Cant de Vespres: 3-1-2-1. Si aquest monjo l\'espera, toca\'l davant seu: les pedres antigues sempre l\'han entès.'
                : (E.flag('soparObert') && !E.flag('pastorsConvencuts'))
                    ? 'El Cant de Vespres: 3-1-2-1. Toca\'l vora el foc dels pastors: un cant tan vell potser els recorda casa.'
                    : 'El Cant de Vespres: 3-1-2-1. És molt vell: les pedres antigues sempre l\'han entès.' }
        ];
        E.posaObjectiu(E.flag('ombraDemanaCant') ? "El Cant de Vespres farà parlar l'ombra del monjo, a les Runes." : "Toca el Cant de Vespres vora el foc dels pastors, a la Cirosa.");
    } else {
        pagines = [
            { qui: 'La Pianista', text: 'Això mateix, fill! El Cant del Miracle. Els ocells el cantaven a l\'alba, abans que l\'Ocellaire se\'l quedés i el tanqués a la seva gàbia.' },
            { qui: 'La Pianista', text: 'Diu la meva mare que aquella gàbia només s\'obre amb el cant que li van robar. Si els nens hi són a dins, toca\'l davant els barrots i no tindran més remei que obrir-se.' }
        ];
        E.posaObjectiu(!E.flag('josepVencut') ? "Al Celler, els secrets es guanyen a la taula."
            : !E.flag('rodaMoguda') ? "La roda de carruatge del Celler amaga el túnel dels monjos." : 'Segueix el túnel dels monjos fins a la Casa Gran.');
    }
    if (ui) ui.obrirDialeg({ pagines }, () => E.desar());
}

// Mides del pergamí de la tarota (a baix de la pantalla; el joc es continua veient a sobre)
const MUS_W = 688, MUS_H = 420, MUS_T = ALT - 435;

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
        this.actuant = null; this.alFinalActuacio = null; this.slots = null;       // (l'escena es reaprofita: res de l'altra vegada; si actuant quedés posat, ESC donaria l'efecte sense tocar)
        // La música de fons gairebé s'apaga mentre sona la tarota (i torna al volum de sempre en tancar-la), perquè no se sobreposin
        const mFons = Joc.musica;
        if (mFons && mFons.isPlaying) {
            mFons.setVolume(0.05);
            this.events.once('shutdown', () => { if (Joc.musica === mFons && mFons.isPlaying) mFons.setVolume(0.6); });
        }
        const zonaFl = Joc.zonaActiva(this);
        if (zonaFl && zonaFl.ineuFlauta) zonaFl.ineuFlauta(true);          // l'Ineu es veu de cara, tocant la flauta

        const cx = AMPLE / 2, T = MUS_T;
        // En pantalles baixes (ALT petit) el pergamí es fa una mica més petit (ancorat a baix) perquè sobri lloc per al primer pla de l'Ineu tocant
        const f = Math.min(1, (ALT - 440) / 435);
        this.escPergami = f;
        this.primerPla(ALT - 435 * f);
        const llibre = { fontFamily: FONT_LLIBRE, resolution: 2 };
        this.panell = this.add.container(AMPLE / 2 * (1 - f), ALT * (1 - f) + 30).setScale(f).setAlpha(0);
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
        this.creaSlots(llico ? this.melodia.notes.length : Math.max(3, ...Object.values(MELODIES).filter(m => Estat.flag(m.flag)).map(m => m.notes.length)));

        // La tarota al pergamí inferior (assets/ui/tarota.webp)
        const fy = T + 184, teImgTarota = this.textures.exists('tarota_ui') && !Grafics.faltants.includes('tarota_ui');
        let tw = 520, th = 102;
        if (teImgTarota) {
            const imT = add(this.add.image(cx, fy, 'tarota_ui'));
            imT.setScale(this.textures.get('tarota_ui').customData.escala || 1 / RES);
            tw = imT.displayWidth; th = imT.displayHeight;
        } else {
            const esquerra = cx - 258, fl = add(this.add.graphics());
            fl.fillStyle(0x3a2412, 1).beginPath();
            fl.moveTo(esquerra + 22, fy - 8); fl.lineTo(cx + 120, fy - 16); fl.lineTo(cx + 206, fy - 36); fl.lineTo(cx + 242, fy - 48);
            fl.lineTo(cx + 242, fy + 48); fl.lineTo(cx + 206, fy + 36); fl.lineTo(cx + 120, fy + 16); fl.lineTo(esquerra + 22, fy + 8);
            fl.closePath(); fl.fillPath();
        }
        // Posició dels forats 1r, 3r i 5è sobre la imatge de la tarota (o alineats amb els botons si no hi ha imatge)
        const FORATS_DX = [0, -0.0838, 0.0348, 0.1547], FORATS_DY = [0, -0.0374, -0.0329, -0.0299];
        this.botons = [null, 1, 2, 3].map(n => {
            if (!n) return null;
            const x = cx + (n - 2) * 168, by = T + 287;
            const fx = teImgTarota ? cx + FORATS_DX[n] * tw : x, fyForat = teImgTarota ? fy + FORATS_DY[n] * th : fy;
            const forat = add(this.add.circle(fx, fyForat, 7.5, COLOR_NOTA, 0));
            const halo = add(this.add.circle(fx, fyForat, 20, COLOR_NOTA, 0).setBlendMode(Phaser.BlendModes.ADD));
            const base = add(this.add.circle(x, by, 56, 0x70451f, 1).setStrokeStyle(4, 0x3a2412, 1).setInteractive({ useHandCursor: true }));
            base.on('pointerdown', () => this.nota(n, true));
            const gemma = add(this.add.circle(x, by, 46, COLOR_NOTA, 1).setStrokeStyle(3, 0x3a2412, 1));
            add(this.add.ellipse(x - 12, by - 20, 24, 12, 0xffffff, 0.4));
            add(this.add.text(x, by + 1, String(n), { fontFamily: FONT_TITOL, fontSize: '39px', fontStyle: 'bold', color: '#3a2412', stroke: '#f5e2ad', strokeThickness: 2, resolution: 2 }).setOrigin(0.5));
            const tecla = ['', '1', '2', '3'][n];
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
        k.on('keydown-ESC', () => { if (this.capaPerSobre()) return; if (this.llico && this.actuant) this.tancar(true); else this.tancar(false, this.actuant || undefined); });       // durant la peça completa, ESC la salta i l'efecte es dóna igual

        if (llico) {
            this.titol.setText('Lliçó: ' + this.melodia.nom);
            this.time.delayedCall(700, () => this.reproduir());
        } else {
            this.titol.setText('La tarota del Cortiner');
            this.estat.setText('Toca un cant que recordis (les notes són al Diari).');
            if (!Object.values(MELODIES).some(m => Estat.flag(m.flag))) {
                this.estat.setText('Encara no coneixes cap cant.');
            }
            add(this.add.text(cx + MUS_W / 2 - 34, T + 40, '✕', { fontFamily: FONT_PLACA, fontSize: '30px', fontStyle: 'bold', color: '#6a1f12', padding: { x: 8, y: 4 }, resolution: 2 })
                .setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerdown', () => { if (!this.capaPerSobre()) this.tancar(false); }));
            this.lastTime = 0;
        }
        this.tweens.add({ targets: this.panell, alpha: 1, y: ALT * (1 - this.escPergami), duration: 350, ease: 'Sine.easeOut' });
    }

    // Hi ha el menú, el diari o l'objectiu oberts a sobre (o s'acaben de tancar): la tarota no ha de rebre ni tecles ni clics
    capaPerSobre() {
        const ui = this.scene.get('UI');
        return !!ui && (ui.capaOberta || ui.time.now < ui.bloquejatFins);
    }

    // Fila de caselles de notes (es refà quan en cal més: la peça completa en té fins a 12)
    creaSlots(nSlots) {
        if (this.slots) this.slots.forEach(sl => { sl.ple.destroy(); sl.anell.destroy(); });
        const cx = AMPLE / 2, T = MUS_T, pas = nSlots > 10 ? 46 : 52;
        this.slots = [];
        for (let i = 0; i < nSlots; i++) {
            const x = cx + (i - (nSlots - 1) / 2) * pas, y = T + 129;
            const ple = this.add.circle(x, y, 17, 0x000000, 0.08);
            const anell = this.add.circle(x, y, 17).setStrokeStyle(3, 0x5a3a1a, 0.8);
            this.panell.add([ple, anell]);
            this.slots.push({ ple, anell });
        }
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
        this.posBroc = { x: cx + img.displayWidth * 0.38, y: T + 60 - alt * 0.19 };      // per on surten les notes: la campana de la tarota (a baix a la dreta), no els forats que tapen els dits
        const zonaPla = Joc.zonaActiva(this);
        if (zonaPla && zonaPla.amagarIneuFlauta) zonaPla.amagarIneuFlauta();           // l'Ineu de l'escenari desapareix mentre surt aquest
    }
    // Cada nota de l'Ineu: el primer pla fa un petit impuls i en surt una nota musical que puja
    impulsPrimerPla(n) {
        const img = this.imgPrimerPla;
        if (!img || !img.active) return;
        const e = this.escPrimerPla;
        this.tweens.add({ targets: img, scale: { from: e * 1.04, to: e }, duration: 260, ease: 'Back.easeOut' });
        this.tweens.add({ targets: this.auraPrimerPla, fillAlpha: { from: 0.34, to: 0.16 }, duration: 420 });
        const p = this.posBroc, x = p.x + (n - 2) * 18;
        const t = this.add.text(x, p.y, n === 2 ? '♫' : '♪', { fontFamily: FONT_TITOL, fontSize: '54px', fontStyle: 'bold', color: '#ffe08a', stroke: '#5a3410', strokeThickness: 5, resolution: 2 })
            .setOrigin(0.5).setDepth(0).setScale(0.4);
        this.tweens.add({ targets: t, y: p.y - 150 - Math.random() * 60, x: x + 25 + Math.random() * 45, scale: 1, angle: (Math.random() - 0.5) * 40, duration: 1300, ease: 'Sine.easeOut' });
        this.tweens.add({ targets: t, alpha: 0, delay: 800, duration: 500, onComplete: () => t.destroy() });
    }

    // ---- So i imatge de cada nota ----
    so(n, freq, dur = 0.55) {
        const ctx = this.sound && this.sound.context;
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume();
        // El so de la tarota: una ocarina suau (Sfx.ocarina), no una ona electrònica. Les tres notes pròpies de la tarota sonen una octava amunt, on l'ocarina és més dolça.
        Sfx.ocarina(freq || FREQ_NOTA[n] * 2, Math.max(0.55, dur), 0.26);
    }

    // La gemma s'encén i rebota, el forat de la tarota brilla i una ona surt del botó
    llum(n, freq, dur) {
        const b = this.botons[n], color = COLOR_NOTA;
        this.so(n, freq, dur);
        b.gemma.setFillStyle(color, 1);
        this.tweens.add({ targets: [b.base, b.gemma], scale: { from: 1.14, to: 1 }, duration: 260, ease: 'Back.easeOut' });
        this.time.delayedCall(280, () => { if (b.gemma.active) b.gemma.setFillStyle(color, 0.7); });
        b.forat.setFillStyle(color, 0.95);
        b.halo.setAlpha(0.85);
        this.tweens.add({ targets: b.halo, alpha: 0, scale: { from: 1, to: 1.8 }, duration: 520 });
        this.time.delayedCall(320, () => { if (b.forat.active) b.forat.setFillStyle(color, 0); });
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
        if (this.bloquejat || this.tancat || this.capaPerSobre()) return;
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
                // Després de la clau, la tarota continua tota sola i sona el cant sencer (com al joc); en acabar (o amb ESC), la lliçó queda apresa
                if (this.melodia.peca) this.time.delayedCall(900, () => this.actuacio(this.dades.melodia, this.melodia, () => this.tancar(true)));
                else this.time.delayedCall(900, () => this.tancar(true));
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
                const zona = Joc.zonaActiva(this);
                if (m.peca && zona && zona.teEfecteMelodia && zona.teEfecteMelodia(clau)) this.time.delayedCall(700, () => this.actuacio(clau, m));
                else this.time.delayedCall(700, () => this.tancar(false, clau));
                return;
            }
        }
    }

    // La peça completa: la tarota toca tota sola (clau + continuació) i, en acabar, el lloc reacciona (ESC la salta)
    actuacio(clau, m, fi) {
        if (this.tancat) return;
        this.actuant = clau;
        this.alFinalActuacio = fi || null;
        const temps = 60000 / m.bpm;
        this.creaSlots(m.peca.length);
        this.pintaSlots([]);
        this.estat.setText('♪ ' + m.nom + (fi ? ', sencer' : '') + '');
        let t = 250;
        m.peca.forEach(([nota, durada], i) => {
            const f = NOTES_FREQ[nota], boto = BOTO_DE(f);
            this.time.delayedCall(t, () => {
                if (this.tancat) return;
                this.llum(boto, f, durada * temps / 1000);
                this.impulsPrimerPla(boto);
                this.pintaSlots(m.peca.slice(0, i + 1).map(() => 1));
            });
            t += durada * temps;
        });
        this.time.delayedCall(t + 500, () => { if (!this.tancat) (fi ? fi() : this.tancar(false, clau)); });
    }

    tancar(exit, melodiaTocada) {
        if (this.tancat) return;
        this.tancat = true;
        const nom = this.llico ? this.dades.melodia : null;
        const zonaFl = Joc.zonaActiva(this);
        const acabar = () => {
            const ui = this.scene.get('UI');
            if (ui) ui.bloquejatFins = ui.time.now + 300;
            if (zonaFl && zonaFl.ineuFlauta) zonaFl.ineuFlauta(false);          // l'Ineu de l'escenari torna (amb un fade in si s'havia amagat)
            this.scene.stop();
            if (this.llico && exit) completarLliço(nom);
            if (melodiaTocada) {
                const zona = Joc.zonaActiva(this);
                if (zona) zona.melodiaTocada(melodiaTocada);
            }
        };
        if (this.imgPrimerPla && this.imgPrimerPla.active) {                     // el primer pla s'esvaeix abans de tancar
            const fons = [this.imgPrimerPla, this.velPrimerPla, this.auraPrimerPla].filter(o => o && o.active);
            fons.forEach(o => this.tweens.killTweensOf(o));
            this.tweens.add({ targets: fons, alpha: 0, duration: 260 });
            this.time.delayedCall(280, acabar);
        } else acabar();
    }
}
