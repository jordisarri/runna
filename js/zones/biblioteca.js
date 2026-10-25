/**
 * LA BIBLIOTECA DEL MONESTIR
 * Sala alta de prestatgeries fins al sostre, dos vitralls que tenyeixen el terra de colors, pols que balla dins la llum,
 * una taula llarga de lectura amb espelmes, el faristol amb la Crònica, un globus terraqüi i una escala de mà.
 * Hi treballa el Pare Alcuí, que llegeix els fragments i dona el Saber.
 */

Object.assign(DIALEGS, {
    cronica: E => ({ pagines: [
        { qui: '', text: 'Sobre el faristol, la Crònica del Miracle: un llibre enorme de pergamí, amb tancadors de llautó i les vores menjades per segles de dits.' },
        { qui: 'Crònica', text: '«Any de la gran fira. Va pujar al Miracle un firaire amb gàbies de canya plenes d\'ocells que cantaven com persones: Mestre Gaspar, l\'Ocellaire. On ell passava, els nens reien... i l\'endemà ja no reien amb res.»' },
        { qui: 'Crònica', text: E.flag('fragment3')
            ? '«Els pastors de la Cirosa i els germans del Miracle el tancaren dins la seva gàbia, sota terra. Un germà segellà la porta amb la llum de l\'espasa i l\'adormí entre pedres, a migdia.» (Al marge, una paraula esborrada.)'
            : '(La pàgina següent és arrencada. Al marge, algú hi ha escrit amb lletra petita: «la resta, a les Runes i al sagrari».)' }
    ] }),
    prestatgesBiblio: n => E => ({ pagines: [{ qui: '', text: [
        'Llibres de lloms gastats: «Herbari del Solsonès», «Tractat de les abelles», «Cants de l\'orgue, volum III»... i un «Manual de ping-pong per a monjos», amb anotacions del Juli als marges.',
        'Una filera de lligalls lligats amb cordill: comptes del Monestir des de fa tres-cents anys. Algú hi ha deixat una fulla de til·ler de punt de llibre.',
        'Rotllos de pergamí dins de caselles de fusta. N\'hi ha un amb el dibuix d\'una gàbia, i al costat, ratllat amb força: «NO».',
        'Una secció sencera de «Vides de sants», en vint volums. Un d\'ells té els marges plens de gats dibuixats per algun novici avorrit.',
        'Manuscrits il·luminats dins de caixes de fusta: el «Salteri del Miracle», amb una orla de cargols i d\'ocells. Molts ocells.',
        'Llibres de comptes de la vinya, de les abelles i del refetor. Algú hi ha subratllat: «el vi és sempre més car al setembre».'
    ][n] }] }),
    globusBiblio: E => ({ pagines: [{ qui: '', text: 'Un globus terraqüi vell, amb mars plens de monstres. Al lloc on hauria de ser el Miracle, algú hi ha dibuixat una creueta i un ocell petit.' }] }),
    vitrallBiblio: E => ({ pagines: [{ qui: '', text: 'El vitrall mostra un monjo amb una espasa de llum davant d\'una porta de ferro. La llum que hi passa pinta el terra de blau i d\'or.' }] })
});

class ZonaBiblioteca extends ZonaBase {
    constructor() {
        super('ZonaBiblioteca', {
            nom: 'Biblioteca del Monestir',
            amplada: 1100,
            alcada: 900,
            colorFons: '#100a06',
            pacifica: true,
            entrades: { porta: { x: 550, y: 800, dir: 'amunt' } }
        });
    }

    construir() {
        const A = 1100, H = 900;
        // Terra de rajola de fang i catifa llarga
        this.terra('rajola', 100, 40, 900, 860, -1100).setTint(0xb87a50);
        const cat = this.add.graphics().setDepth(-1050);
        cat.fillStyle(0x7a1e24, 1).fillRect(470, 230, 160, 640);
        cat.lineStyle(4, 0xd4a640, 1).strokeRect(478, 238, 144, 624);
        for (let y = 270; y < 860; y += 60) cat.fillStyle(0xd4a640, 0.6).fillPoints([{ x: 550, y }, { x: 566, y: y + 16 }, { x: 550, y: y + 32 }, { x: 534, y: y + 16 }], true);

        // Paret del fons: pedra amb dos vitralls apuntats i una prestatgeria a cada banda
        const m = this.add.graphics().setDepth(-995);
        m.fillStyle(0x120a04, 1).fillRect(58, 0, 984, 214);
        m.fillStyle(0x6a5a48, 1).fillRect(60, 0, 980, 210);
        m.lineStyle(1.2, 0x2a2014, 0.45);
        for (let y = 26, f = 0; y < 210; y += 26, f++) { m.lineBetween(60, y, 1040, y); for (let x = 60 + (f % 2) * 35; x < 1040; x += 70) m.lineBetween(x, y, x, y - 26); }
        m.fillStyle(0x3a2412, 1).fillRect(60, 196, 980, 18);
        // Vitralls (arc apuntat amb plom i vidres de colors)
        const vitrall = (cx) => {
            const w = 110, top = 18, base = 170;
            const forma = [{ x: cx - w / 2, y: base }, { x: cx - w / 2, y: top + 50 }, { x: cx, y: top }, { x: cx + w / 2, y: top + 50 }, { x: cx + w / 2, y: base }];
            m.fillStyle(0x120a04, 1).fillPoints(forma.map(p => ({ x: p.x + (p.x < cx ? -8 : p.x > cx ? 8 : 0), y: p.y + (p.y === base ? 6 : -6) })), true);
            const cols = [0x2a5ab8, 0xd8a030, 0xb83a3a, 0x3a9a5a, 0x7a4ab8, 0x2a8ab8];
            for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) {
                const x = cx - w / 2 + c * w / 4, y = top + 30 + r * 24;
                m.fillStyle(cols[(r + c * 2) % cols.length], 0.95).fillRect(x + 2, y, w / 4 - 4, 22);
            }
            m.fillStyle(0xd8a030, 1).fillCircle(cx, top + 40, 14).fillStyle(0xfff4c0, 1).fillCircle(cx, top + 40, 7);
            m.lineStyle(3, 0x1a1008, 1).strokePoints(forma, true);
        };
        vitrall(330); vitrall(770);
        this.interactiu(330, 240, 70, DIALEGS.vitrallBiblio, { altura: 200 });
        this.interactiu(770, 240, 70, DIALEGS.vitrallBiblio, { altura: 200 });
        // Feixos de llum de colors que baixen fins al terra
        [330, 770].forEach((cx, i) => {
            const f = this.add.graphics().setDepth(-900).setBlendMode('ADD');
            [[0x2a5ab8, -30], [0xd8a030, 0], [0xb83a3a, 30]].forEach(([c, dx]) => f.fillStyle(c, 0.07).fillPoints([{ x: cx + dx - 20, y: 175 }, { x: cx + dx + 20, y: 175 }, { x: cx + dx + 70, y: 560 }, { x: cx + dx - 10, y: 560 }], true));
            this.tweens.add({ targets: f, alpha: 0.65, yoyo: true, repeat: -1, duration: 3000 + i * 700, ease: 'Sine.easeInOut' });
        });
        // Pols que balla dins la llum
        this.add.particles(0, 0, 'espurna', {
            emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(260, 200, 600, 380) },
            speedX: { min: -6, max: 6 }, speedY: { min: -8, max: 4 }, lifespan: 4000,
            scale: { start: 0.12, end: 0 }, alpha: { start: 0.7, end: 0 }, tint: [0xfff0c0, 0xd8e0ff], frequency: 180, blendMode: 'ADD'
        }).setDepth(9000);

        // Prestatgeries plenes de llibres de colors (paret del fons i laterals)
        const llibres = (g, x, y, w, files, llavor) => {
            let l = llavor; const r = () => (l = l * 16807 % 2147483647) / 2147483647;
            const cols = [0x7a1e24, 0x2a4a7a, 0x3a6a3a, 0x8a6a2a, 0x5a3a6a, 0x9a5a2a, 0x2a2a2a, 0xc8b080];
            g.fillStyle(0x2a1608, 1).fillRect(x - 6, y - 6, w + 12, files * 46 + 12);
            for (let f = 0; f < files; f++) {
                const yb = y + f * 46 + 40;
                g.fillStyle(0x4a2c14, 1).fillRect(x - 6, yb, w + 12, 6);
                g.fillStyle(0x140a04, 1).fillRect(x, yb - 40, w, 40);
                for (let bx = x + 2; bx < x + w - 8;) {
                    const bw = 7 + r() * 9, bh = 26 + r() * 13, c = cols[Math.floor(r() * cols.length)];
                    if (r() < 0.08) { g.fillStyle(c, 1).fillRect(bx, yb - 10, 26, 10); bx += 28; continue; }      // un llibre ajagut
                    g.fillStyle(c, 1).fillRect(bx, yb - bh, bw, bh);
                    g.fillStyle(0xd4a640, 0.7).fillRect(bx + 1, yb - bh + 5, bw - 2, 2).fillRect(bx + 1, yb - 8, bw - 2, 2);
                    bx += bw + 1;
                }
            }
        };
        const pres = this.add.graphics().setDepth(-985);
        llibres(pres, 110, 14, 150, 4, 3);
        llibres(pres, 450, 14, 200, 3, 11);
        llibres(pres, 880, 14, 150, 4, 17);
        this.interactiu(185, 240, 80, DIALEGS.prestatgesBiblio(0), { altura: 200 });
        this.interactiu(550, 240, 80, DIALEGS.prestatgesBiblio(1), { altura: 200 });
        this.interactiu(955, 240, 80, DIALEGS.prestatgesBiblio(2), { altura: 200 });
        // Prestatgeries laterals (de cantó), amb llibres vistos des de dalt
        const lat = this.add.graphics().setDepth(-980);
        [[60, 1], [1000, -1]].forEach(([x], s) => {
            lat.fillStyle(0x2a1608, 1).fillRect(x, 220, 40, 600);
            for (let y = 230; y < 810; y += 14) lat.fillStyle([0x7a1e24, 0x2a4a7a, 0x3a6a3a, 0x8a6a2a, 0x5a3a6a][(y / 14 + s) % 5 | 0], 1).fillRect(x + 6, y, 28, 11);
        });
        // Prestatgeries lliures de terra a sostre, en dues files, que formen passadissos: la biblioteca és enorme
        const prestatge = (x, base, w, files, llavor, n) => {
            const alt = files * 46 + 6, y = base - alt;
            const g = this.add.graphics().setDepth(base);
            g.fillStyle(0x000000, 0.28).fillEllipse(x + w / 2, base + 4, w + 26, 16);
            llibres(g, x, y, w, files, llavor);
            g.fillStyle(0x4a2c14, 1).fillRect(x - 10, y - 14, w + 20, 10).lineStyle(2, 0x1a0c04, 1).strokeRect(x - 10, y - 14, w + 20, 10);
            g.fillStyle(0x6a4224, 1).fillRect(x - 10, y - 14, w + 20, 3);
            this.colisio(x + w / 2, base - 12, w + 12, 24);
            this.interactiu(x + w / 2, base + 22, 70, DIALEGS.prestatgesBiblio(n), { altura: alt });
        };
        [[110, 540, 120, 31, 3], [880, 540, 110, 37, 4], [110, 700, 150, 41, 5], [280, 700, 120, 43, 3], [700, 700, 120, 47, 4], [850, 700, 150, 53, 5]].forEach(([x, base, w, llavor, n]) => prestatge(x, base, w, 3, llavor, n));
        // Columnes de pedra que aguanten les voltes, a banda i banda de la catifa
        const columna = (x, base) => {
            const g = this.add.graphics().setDepth(base);
            g.fillStyle(0x000000, 0.25).fillEllipse(x, base + 2, 70, 16);
            g.fillStyle(0x9a8a70, 1).fillRect(x - 22, base - 16, 44, 16).fillRect(x - 15, base - 200, 30, 186).fillRect(x - 24, base - 214, 48, 16);
            g.fillStyle(0xb8a888, 1).fillRect(x - 15, base - 200, 12, 186).fillRect(x - 24, base - 214, 48, 6);
            g.fillStyle(0x6a5a44, 1).fillRect(x + 8, base - 200, 7, 186);
            g.lineStyle(2.5, 0x1a1008, 1).strokeRect(x - 22, base - 16, 44, 16).strokeRect(x - 15, base - 200, 30, 186).strokeRect(x - 24, base - 214, 48, 16);
            this.colisio(x, base - 8, 40, 18);
        };
        columna(430, 330); columna(670, 330); columna(440, 650); columna(660, 650);
        // Arc apuntat de pedra entre les dues columnes del fons: el cor de la nau
        const arc = this.add.graphics().setDepth(120);
        const punts = [];
        for (let k = 0; k <= 24; k++) { const t = k / 24, a2 = Math.PI * (1 - t) * 0.5; punts.push({ x: 430 + 120 * (1 - Math.cos(a2)) * 1 + 0, y: 118 - 100 * Math.sin(a2) * (1) }); }
        const dreta = punts.map(q => ({ x: 1100 - q.x, y: q.y })).reverse();
        const mig = punts.concat(dreta);
        arc.lineStyle(14, 0x6a5a44, 1).strokePoints(mig, false);
        arc.lineStyle(8, 0x9a8a70, 1).strokePoints(mig, false);
        arc.lineStyle(2.5, 0x1a1008, 1).strokePoints(mig.map(q => ({ x: q.x, y: q.y - 7 })), false).strokePoints(mig.map(q => ({ x: q.x, y: q.y + 7 })), false);
        // Piles de llibres a terra i dos faristols petits de lectura, amb la seva espelma
        const pila = (x, y, n) => {
            const g = this.add.graphics().setDepth(y), cols = [0x7a1e24, 0x2a4a7a, 0x3a6a3a, 0x8a6a2a, 0x5a3a6a];
            g.fillStyle(0x000000, 0.25).fillEllipse(x, y + 2, 60, 12);
            for (let k = 0; k < n; k++) g.fillStyle(cols[k % 5], 1).fillRect(x - 24 + (k % 2) * 4, y - 10 - k * 10, 46 - (k % 3) * 4, 10).lineStyle(1.5, 0x1a1008, 1).strokeRect(x - 24 + (k % 2) * 4, y - 10 - k * 10, 46 - (k % 3) * 4, 10);
            this.colisio(x, y - 6, 48, 16);
        };
        pila(140, 800, 4); pila(960, 800, 5); pila(330, 590, 3); pila(780, 590, 4); pila(1000 - 40, 330, 3);
        [[160, 480], [940, 650]].forEach(([x, y]) => {
            const g = this.add.graphics().setDepth(y);
            g.fillStyle(0x000000, 0.25).fillEllipse(x, y + 2, 56, 12);
            g.fillStyle(0x4a2c14, 1).fillRect(x - 5, y - 40, 10, 40).fillStyle(0x5a3a1e, 1).fillPoints([{ x: x - 28, y: y - 36 }, { x: x + 28, y: y - 36 }, { x: x + 20, y: y - 58 }, { x: x - 20, y: y - 58 }], true);
            g.fillStyle(0xf2e6c8, 1).fillRect(x - 24, y - 56, 22, 18).fillRect(x + 2, y - 56, 22, 18);
            this.colisio(x, y - 8, 40, 14);
            this.posar('espelma', x + 34, y - 4, { fonsY: y + 1 });
        });

        // Escala de mà recolzada a la prestatgeria de l'esquerra
        const esc = this.add.graphics().setDepth(230);
        esc.lineStyle(6, 0x6a4224, 1).lineBetween(270, 20, 300, 230).lineBetween(310, 20, 340, 230);
        for (let k = 0; k < 7; k++) esc.lineStyle(4, 0x8a5a30, 1).lineBetween(274 + k * 4, 40 + k * 28, 314 + k * 4, 40 + k * 28);

        // Parets i col·lisions
        this.colisio(50, H / 2, 100, H);
        this.colisio(A - 50, H / 2, 100, H);
        this.colisio(A / 2, 110, A, 220);
        this.colisio(285, H - 10, 370, 20);
        this.colisio(815, H - 10, 370, 20);

        // Taula llarga de lectura amb llibres oberts, espelmes i un tinter
        const t = this.add.graphics().setDepth(470);
        t.fillStyle(0x000000, 0.25).fillEllipse(550, 478, 440, 30);
        t.fillStyle(0x5a3a1e, 1).fillRect(340, 400, 420, 66).fillStyle(0x4a2c14, 1).fillRect(340, 466, 420, 14);
        t.fillStyle(0x3a2412, 1).fillRect(350, 480, 14, 10).fillRect(736, 480, 14, 10);
        [[400, 418], [600, 420]].forEach(([x, y]) => {                 // llibres oberts
            t.fillStyle(0xf2e6c8, 1).fillRect(x, y, 34, 26).fillRect(x + 36, y, 34, 26);
            t.lineStyle(1, 0x5a4a30, 0.7); for (let k = 0; k < 5; k++) { t.lineBetween(x + 4, y + 5 + k * 4, x + 30, y + 5 + k * 4); t.lineBetween(x + 40, y + 5 + k * 4, x + 66, y + 5 + k * 4); }
        });
        t.fillStyle(0x1a1a2a, 1).fillCircle(520, 440, 7).lineStyle(2, 0xf2ecdc, 1).lineBetween(522, 438, 534, 420);   // tinter i ploma
        t.fillStyle(0x7a1e24, 1).fillRect(690, 430, 40, 12).fillStyle(0x2a4a7a, 1).fillRect(694, 420, 34, 10);    // pila de llibres
        this.colisio(550, 440, 420, 80);
        [[370, 405], [730, 405], [550, 405]].forEach(([x, y], i) => {
            const e = this.posar('espelma', x, y, { fonsY: 480 });
            this.tweens.add({ targets: e, alpha: 0.7, yoyo: true, repeat: -1, duration: 320 + i * 90 });
            this.add.circle(x, y - 40, 60, 0xffc060, 0.08).setDepth(480);
        });
        [[400, 520], [550, 525], [700, 520]].forEach(([x, y]) => this.posar('tamboret', x, y, { col: { w: 34, h: 14 } }));

        // El faristol amb la Crònica, a la dreta de la catifa
        const f = this.add.graphics().setDepth(330);
        f.fillStyle(0x4a2c14, 1).fillRect(836, 270, 12, 60).fillRect(812, 326, 60, 8);
        f.fillStyle(0x5a3a1e, 1).fillPoints([{ x: 800, y: 270 }, { x: 884, y: 270 }, { x: 874, y: 240 }, { x: 810, y: 240 }], true);
        f.fillStyle(0xf2e6c8, 1).fillRect(812, 238, 30, 26).fillRect(844, 238, 30, 26);
        f.fillStyle(0xb83a3a, 1).fillRect(840, 236, 6, 34);
        this.colisio(842, 318, 70, 20);
        this.interactiu(842, 350, 80, DIALEGS.cronica, { altura: 120 });

        // Globus terraqüi a l'esquerra
        const gl = this.add.graphics().setDepth(340);
        gl.fillStyle(0x4a2c14, 1).fillRect(242, 300, 8, 36).fillRect(224, 334, 44, 6);
        gl.fillStyle(0x3a6a9a, 1).fillCircle(246, 278, 30).fillStyle(0xc8b070, 1).fillEllipse(238, 270, 24, 16).fillEllipse(258, 292, 16, 10);
        gl.lineStyle(3, 0xd4a640, 1).strokeCircle(246, 278, 34);
        this.colisio(246, 330, 50, 16);
        this.interactiu(246, 360, 70, DIALEGS.globusBiblio, { altura: 90 });

        // Llum d'aranya penjada del sostre
        const ar = this.add.graphics().setDepth(90000 - 1);
        ar.lineStyle(2, 0x2a2a2a, 0.8).lineBetween(550, 0, 550, 60);
        ar.lineStyle(4, 0x3a3030, 1).strokeEllipse(550, 70, 160, 26);
        [-70, -35, 0, 35, 70].forEach(dx => ar.fillStyle(0xfff0c0, 1).fillRect(550 + dx - 3, 56, 6, 12).fillStyle(0xffc060, 0.5).fillCircle(550 + dx, 52, 8));

        // El Pare Alcuí, entre la taula i el faristol
        this.npc('pare_alcui', 760, 330, DIALEGS.pareAlcui, { flipX: true });

        this.add.rectangle(A / 2, H / 2, A, H, 0xffd38a, 0.06).setDepth(80000);
        this.sortida(510, H - 22, 80, 14, 'ZonaMonestir', 'biblioteca');
    }
}
