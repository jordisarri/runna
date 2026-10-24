/**
 * SOTA LA TAVERNA: el camí fins a la Sala de la Gàbia
 *   Soterrani de la Taverna --(porta de ferro: Clau de ferro)--> Sala de les Gírgoles --> Passadís de tortura --> Sala de la Gàbia
 * Puzles:
 *   Gírgoles: cova fosca i humida. Cinc mates de gírgoles lluminoses en rotllana: en tocar-ne una, s'encén o s'apaga ella i les
 *             dues veïnes. Quan les cinc brillen, la cortina de micel·li que tapa el túnel del nord es desfà.
 *   Tortura:  un rastell rovellat barra el pas: el torn només el giren els Guants de Poder. Més amunt, un mur d'esbarzers negres (Runna).
 *   Gàbia:    la gàbia penja al mig d'un avenc. Els blocs de pedra del pont dormen al fons: el Cant de les Pedres els aixeca.
 *             Davant els barrots, el Cant del Miracle els fa vibrar (el combat i l'alliberament encara no són fets).
 * Els combats (ratpenats, ferralla viva, l'Andreu i l'Home de la Gàbia) i l'epíleg queden per a una fase següent.
 */

// Foscor amb forats de llum (la mateixa tècnica que el soterrani de l'Hostatgeria)
function crearFoscor(escena, W, H) {
    if (!escena.textures.exists('llum_brush')) {
        const brush = escena.textures.createCanvas('llum_brush', 512, 512);
        const bc = brush.getContext(), gr = bc.createRadialGradient(256, 256, 0, 256, 256, 256);
        gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.85)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
        bc.fillStyle = gr; bc.fillRect(0, 0, 512, 512); brush.refresh();
    }
    const f = escena.add.renderTexture(0, 0, W, H).setOrigin(0).setDepth(85000);
    const p = escena.make.image({ key: 'llum_brush', add: false }).setOrigin(0.5);
    return {
        pintar(foscor, llums) {
            f.clear(); f.fill(0x000000, foscor);
            llums.forEach(([x, y, r]) => { p.setScale(r / 256); f.erase(p, x, y); });
        }
    };
}

// Parets de cova: roca irregular a la vora (gràfic) amb una col·lisió recta per sota
function paretCova(g, punts, color = 0x2a2620, vora = 0x14120e) {
    g.fillStyle(color, 1).fillPoints(punts, true);
    g.lineStyle(4, vora, 1).strokePoints(punts, true);
}

// Una mata de gírgoles: barrets en ventall, apilats, d'un gris bru
function girgoles(g, x, y, n = 4, color = 0x9a8a78, fosc = 0x5a4e40) {
    for (let k = 0; k < n; k++) {
        const cx = x + (k % 2 ? 14 : -10) + k * 3, cy = y - k * 12, r = 20 - k * 2;
        g.fillStyle(fosc, 1).fillEllipse(cx + 2, cy + 3, r * 2.2, r * 0.9);
        g.fillStyle(color, 1).fillEllipse(cx, cy, r * 2.2, r * 0.9);
        g.lineStyle(1, fosc, 0.8);
        for (let l = -2; l <= 2; l++) g.lineBetween(cx, cy + r * 0.3, cx + l * r * 0.35, cy - r * 0.25);
    }
}

Object.assign(DIALEGS, {
    girgolesInscripcio: E => ({ pagines: [
        { qui: '', text: "A la paret, sota la molsa, una inscripció dels monjos: «Les gírgoles de la cova canten juntes o callen juntes. Toca'n una i despertaràs també les dues que té al costat. Quan cantin totes, el pas s'obre.»" }
    ] }),
    cortinaMicel: E => ({ pagines: [
        { qui: '', text: "Un tel blanc i fibrós de micel·li tapa el túnel del nord, de terra a sostre. Quan l'empenys, és tou però no cedeix. Sembla que s'alimenti de la foscor." }
    ] }),
    sacsGirgoles: E => ({ pagines: [{ qui: '', text: "Sacs de gra podrits per la humitat. D'un d'ells en surt un ocell de boira, transparent, que s'esvaeix abans de tocar el sostre." }] }),
    tornRastell: E => E.flag('rastellObert') ? { pagines: [{ qui: '', text: "El torn, falcat amb una barra. El rastell queda enlaire." }] } : E.te('guants') ? {
        pagines: [
            { qui: '', text: "Un torn de ferro rovellat, amb una cadena que puja fins al rastell. Ningú no l'ha girat en segles." },
            { qui: '', text: "Amb els Guants de Poder, el torn grinyola... i gira. La cadena s'enrotlla i el rastell puja, pam a pam, fins dalt." }
        ]
    } : { pagines: [
        { qui: '', text: "Un torn de ferro rovellat, amb una cadena que puja fins al rastell. Hi poses tot el pes del cos i no es mou ni un dit." },
        { qui: 'Ineu', text: "(Em caldrien unes mans molt més fortes: els guants dels picapedrers del Germà Francesc.)" }
    ] },
    instrumentsTortura: n => E => ({ pagines: [{ qui: '', text: [
        "Un potro de fusta negra, amb cordes podrides i manetes de ferro. Algú hi ha deixat una gàbia petita, buida, amb la porteta oberta.",
        "Una donzella de ferro, mig oberta. A dins no hi ha punxes: hi ha plomes. Centenars de plomes grises.",
        "Una roda d'esmolar enorme, amb un pedal. Al costat, un rengle d'eines rovellades: estenalles, ganxos, claus de gàbia de totes les mides.",
        "Cadenes que pengen del sostre, i, al final de cada una, una gàbia d'ocell. Totes buides. Quan passes, es gronxen soles."
    ][n] }] }),
    pontGabia: E => E.flag('pontGabia') ? { pagines: [{ qui: '', text: "Els blocs de pedra suren sobre l'avenc i formen un pont fins a la gàbia." }] } : {
        pagines: [
            { qui: '', text: "La gàbia penja al mig d'un avenc sense fons. Al marge, sobre la pedra, hi ha gravada una paraula antiga: PEDRES." },
            { qui: '', text: "Al fons de l'avenc, molt avall, s'endevinen uns blocs de pedra quadrats, com si dormissin." },
            { qui: 'Ineu', text: E.flag('cantPedres') ? "(Les pedres... L'ombra del monjo es va despertar amb el Cant de les Pedres. Potser aquestes també: 3-1-2-1.)" : "(Pedres que dormen. Hi deu haver un cant per despertar-les.)" }
        ]
    },
    gabiaGran: E => ({ pagines: E.flag('gabiaCantada') ? [
        { qui: '', text: "Els barrots encara vibren amb el Cant del Miracle. Dins la gàbia, els tres capolls de boira respiren a poc a poc: l'Uri, el Flam i el Sardin." },
        { qui: '', text: "(Aquí l'Home de la Gàbia i el Germà Andreu et barraran el pas. El combat final i l'epíleg encara s'han de fer.)" }
    ] : [
        { qui: '', text: "Una gàbia d'ocell gegant, alta com una església, de barrots negres retorçats i una cúpula rematada amb una anella. A dins, tres capolls de boira lila suren a mig aire." },
        { qui: '', text: "Dins de cada capoll s'endevina un nen adormit. L'Uri. El Flam. El Sardin. Respiren, però no somriuen." },
        { qui: 'Ineu', text: "(Els barrots no tenen pany. Només un cant els pot obrir: el Cant del Miracle, el que l'Ocellaire va robar als ocells.)" }
    ] }),
    capoll: nom => E => ({ pagines: [{ qui: '', text: `Dins del capoll lila, ${nom} dorm arraulit. Té la cara tranquil·la, però sense el somriure que tenen els nens quan dormen.` }] })
});

// ---------------- LA SALA DE LES GÍRGOLES ----------------
const GIRG_CERCLE = { x: 700, y: 640, r: 280 };

class ZonaGirgoles extends ZonaBase {
    constructor() {
        super('ZonaGirgoles', {
            nom: 'Sala de les Gírgoles',
            amplada: 1400,
            alcada: 1300,
            colorFons: '#050806',
            pacifica: true,
            entrades: { porta: { x: 700, y: 1200, dir: 'amunt' }, tortura: { x: 700, y: 230, dir: 'avall' } }
        });
    }

    construir() {
        const W = 1400, H = 1300;
        this.terra('pedra', 0, 0, W, H, -1100).setTint(0x4a5a4a);
        // Fang i bassals al terra
        const fang = this.add.graphics().setDepth(-1050);
        let l = 5; const r = () => (l = l * 16807 % 2147483647) / 2147483647;
        for (let k = 0; k < 40; k++) fang.fillStyle(0x1a2418, 0.25 + r() * 0.2).fillEllipse(100 + r() * 1200, 150 + r() * 1100, 40 + r() * 120, 14 + r() * 40);
        this.bassals = [[420, 980, 160], [1000, 900, 200], [560, 420, 120], [950, 360, 140], [300, 640, 110]].map(([x, y, w]) => {
            const b = this.add.ellipse(x, y, w, w * 0.35, 0x2a4a5a, 0.7).setDepth(-1040);
            this.add.ellipse(x - w * 0.15, y - w * 0.05, w * 0.4, w * 0.08, 0xbfe0ff, 0.25).setDepth(-1039);
            return b;
        });
        // Parets de cova (gràfic irregular) i les seves col·lisions
        const cova = this.add.graphics().setDepth(-990);
        paretCova(cova, [{ x: 0, y: 0 }, { x: 640, y: 0 }, { x: 630, y: 120 }, { x: 560, y: 170 }, { x: 420, y: 150 }, { x: 300, y: 200 }, { x: 170, y: 190 }, { x: 110, y: 300 }, { x: 0, y: 320 }]);
        paretCova(cova, [{ x: 760, y: 0 }, { x: W, y: 0 }, { x: W, y: 300 }, { x: 1300, y: 290 }, { x: 1250, y: 190 }, { x: 1100, y: 210 }, { x: 960, y: 150 }, { x: 840, y: 170 }, { x: 770, y: 120 }]);
        paretCova(cova, [{ x: 0, y: 320 }, { x: 110, y: 300 }, { x: 90, y: 600 }, { x: 130, y: 800 }, { x: 80, y: 1050 }, { x: 120, y: H }, { x: 0, y: H }]);
        paretCova(cova, [{ x: W, y: 300 }, { x: 1300, y: 290 }, { x: 1320, y: 560 }, { x: 1270, y: 820 }, { x: 1320, y: 1080 }, { x: 1280, y: H }, { x: W, y: H }]);
        // Estalactites a la volta
        for (let k = 0; k < 18; k++) { const x = 140 + k * 66 + r() * 20; if (x > 600 && x < 800) continue; const y0 = x < 640 ? 150 + r() * 40 : 160 + r() * 40; cova.fillStyle(0x3a3428, 1).fillTriangle(x - 10, y0, x + 10, y0, x + r() * 4, y0 + 30 + r() * 40); }
        this.colisio(300, 90, 600, 180);
        this.colisio(1100, 90, 600, 180);
        this.colisio(55, 800, 110, 1000);
        this.colisio(W - 55, 800, 110, 1000);
        this.colisio(320, H - 10, 640, 20);
        this.colisio(1080, H - 10, 640, 20);
        // Escala de pedra per on es baixa (a sota) i el túnel del nord (a dalt)
        const esc = this.add.graphics().setDepth(-1000);
        for (let k = 0; k < 5; k++) esc.fillStyle(0x4a4a44 + k * 0x040404, 1).fillRect(640, H - 110 + k * 22, 120, 22);
        esc.fillStyle(0x000000, 1).fillRect(650, 0, 100, 130);

        // Prestatges de troncs on creixen les gírgoles dels monjos, a banda i banda
        const prest = this.add.graphics().setDepth(400);
        [[200, 420], [200, 860], [1200, 470], [1200, 900]].forEach(([x, y]) => {
            prest.fillStyle(0x3a2412, 1).fillRect(x - 70, y - 120, 12, 120).fillRect(x + 58, y - 120, 12, 120);
            [y - 100, y - 55, y - 10].forEach(yy => {
                prest.fillStyle(0x5a3a1e, 1).fillRoundedRect(x - 72, yy - 14, 144, 22, 10);
                prest.fillStyle(0x7a5a3a, 1).fillEllipse(x - 72, yy - 3, 14, 22).fillEllipse(x + 72, yy - 3, 14, 22);
                for (let k = 0; k < 4; k++) girgoles(prest, x - 50 + k * 34, yy - 10, 2 + (k % 2));
            });
            this.colisio(x, y - 10, 150, 30);
        });
        // Sacs i botes
        const sacs = this.add.graphics().setDepth(1050);
        [[1050, 1080], [1095, 1100], [1070, 1050], [300, 1100], [340, 1120]].forEach(([x, y]) => sacs.fillStyle(0x7a6a4a, 1).fillEllipse(x, y, 66, 44).lineStyle(2, 0x3a3020, 1).strokeEllipse(x, y, 66, 44).lineStyle(2, 0x3a3020, 1).lineBetween(x - 8, y - 20, x + 8, y - 20));
        this.colisio(1075, 1090, 110, 40); this.colisio(320, 1110, 90, 30);
        this.interactiu(1075, 1140, 90, DIALEGS.sacsGirgoles, { altura: 80 });
        [[1180, 1180], [230, 1190]].forEach(([x, y]) => this.posar('barril', x, y, { col: { w: 46, h: 20 } }));

        // Gotes que cauen de la volta i fan cercles als bassals
        this.bassals.forEach((b, i) => this.time.addEvent({ delay: 900 + i * 370, loop: true, callback: () => {
            const x = b.x + (Math.random() - 0.5) * b.width * 0.5, y = b.y;
            const gota = this.add.circle(x, y - 260, 3, 0xbfe0ff, 0.9).setDepth(y);
            this.tweens.add({ targets: gota, y, duration: 520, ease: 'Quad.easeIn', onComplete: () => {
                gota.destroy();
                const ona = this.add.ellipse(x, y, 10, 4).setStrokeStyle(2, 0xbfe0ff, 0.7).setDepth(-1038);
                this.tweens.add({ targets: ona, scaleX: 6, scaleY: 6, alpha: 0, duration: 900, onComplete: () => ona.destroy() });
            } });
        } }));
        // Espores que suren
        this.add.particles(0, 0, 'espurna', {
            emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(150, 250, 1100, 950) },
            speedY: { min: -10, max: -2 }, speedX: { min: -6, max: 6 }, lifespan: 5000, scale: { start: 0.14, end: 0 },
            alpha: { start: 0.8, end: 0 }, tint: [0x9affd0, 0xd0ffe8], frequency: 140, blendMode: 'ADD'
        }).setDepth(9000);

        // Inscripció dels monjos
        this.posar('pergami_paret', 460, 230, { fonsY: 250, escala: 0.6 });
        this.interactiu(460, 270, 80, DIALEGS.girgolesInscripcio, { altura: 90 });

        // ---- El puzle: cinc mates de gírgoles lluminoses en rotllana ----
        this.mates = [];
        const resolt = Estat.flag('girgolesEnceses');
        const inici = resolt ? [1, 1, 1, 1, 1] : [1, 0, 1, 0, 0];
        for (let i = 0; i < 5; i++) {
            const a = -Math.PI / 2 + i * Math.PI * 2 / 5, x = GIRG_CERCLE.x + Math.cos(a) * GIRG_CERCLE.r, y = GIRG_CERCLE.y + Math.sin(a) * GIRG_CERCLE.r * 0.8;
            const halo = this.add.ellipse(x, y - 20, 150, 90, 0x6affc0, 0.3).setDepth(y - 2).setBlendMode('ADD');
            const g = this.add.graphics().setDepth(y);
            this.add.ellipse(x, y + 4, 90, 26, 0x000000, 0.3).setDepth(y - 3);
            g.fillStyle(0x3a2a1a, 1).fillRoundedRect(x - 40, y - 12, 80, 20, 9);                  // el tronc on creixen
            girgoles(g, x - 26, y - 6, 4, 0xd8fff0, 0x4a9a7a); girgoles(g, x + 2, y - 10, 5, 0xe8fff8, 0x4a9a7a); girgoles(g, x + 28, y - 4, 3, 0xd8fff0, 0x4a9a7a);
            const m = { i, x, y, halo, g, on: !!inici[i] };
            this.colisio(x, y - 2, 80, 22);
            this.interactiu(x, y + 30, 80, () => null, { altura: 80, actiu: () => !Estat.flag('girgolesEnceses'), enTancar: () => this.tocarMata(i) });
            this.mates.push(m);
        }
        this.pintarMates();

        // La cortina de micel·li que tapa el túnel del nord
        this.cortina = this.add.graphics().setDepth(181);
        this.cortina.fillStyle(0xe8f0e0, 0.85).fillRect(640, 120, 120, 70);
        for (let k = 0; k < 14; k++) this.cortina.lineStyle(2, 0xc8d8c0, 0.9).lineBetween(642 + k * 9, 120, 640 + k * 9 + (k % 3) * 4, 192);
        if (resolt) this.cortina.setVisible(false);
        else {
            this.colCortina = this.colisio(700, 170, 120, 40);
            this.interactiu(700, 230, 90, DIALEGS.cortinaMicel, { altura: 90, actiu: () => !Estat.flag('girgolesEnceses') });
        }

        this.foscor = crearFoscor(this, W, H);
        this.sortida(650, 130, 100, 30, 'ZonaTortura', 'girgoles');
        this.sortida(660, H - 22, 80, 14, 'ZonaSotaTaverna', 'girgoles');
    }

    tocarMata(i) {
        if (Estat.flag('girgolesEnceses')) return;
        [i, (i + 1) % 5, (i + 4) % 5].forEach(k => { this.mates[k].on = !this.mates[k].on; });
        this.so(this.mates.filter(m => m.on).length);
        this.pintarMates();
        if (this.mates.every(m => m.on)) this.obrirCortina();
    }

    pintarMates() {
        this.mates.forEach(m => {
            this.tweens.killTweensOf(m.halo);
            m.halo.setAlpha(m.on ? 0.45 : 0.04);
            m.g.setAlpha(m.on ? 1 : 0.45);
            if (m.on) this.tweens.add({ targets: m.halo, alpha: 0.25, yoyo: true, repeat: -1, duration: 900 + m.i * 130 });
        });
    }

    obrirCortina() {
        Estat.posaFlag('girgolesEnceses');
        Sfx.secret();
        this.cameras.main.shake(300, 0.003);
        if (this.colCortina) this.obstacles.remove(this.colCortina, true, true);
        this.tweens.add({ targets: this.cortina, alpha: 0, duration: 1600 });
        this.flotant(700, 260, 'Les gírgoles canten: el micel·li es desfà', '#9affd0');
        Estat.posaObjectiu('Segueix pel túnel del nord de la Sala de les Gírgoles.');
        Estat.desar();
    }

    so(n) {
        const ctx = this.sound && this.sound.context;
        if (!ctx) return;
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = 260 + n * 70;
        g.gain.setValueAtTime(0.0001, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
        o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.75);
    }

    actualitzar() {
        const t = this.time.now, resolt = Estat.flag('girgolesEnceses');
        const llums = [[this.ineu.x, this.ineu.y - 40, Estat.te('llanterna') ? 330 : 230]];
        this.mates.forEach(m => { if (m.on) llums.push([m.x, m.y - 20, 200 * (1 + 0.05 * Math.sin(t / 300 + m.i))]); });
        if (resolt) llums.push([700, 640, 520]);
        this.bassals.forEach(b => llums.push([b.x, b.y, 60]));
        this.foscor.pintar(resolt ? 0.5 : 0.88, llums);
    }
}

// ---------------- EL PASSADÍS DE TORTURA ----------------
class ZonaTortura extends ZonaBase {
    constructor() {
        super('ZonaTortura', {
            nom: 'Passadís de tortura',
            amplada: 900,
            alcada: 1900,
            colorFons: '#0a0606',
            pacifica: true,
            entrades: { girgoles: { x: 450, y: 1800, dir: 'amunt' }, gabia: { x: 450, y: 220, dir: 'avall' } }
        });
    }

    construir() {
        const W = 900, H = 1900;
        this.terra('pedra', 200, 0, 500, H, -1100).setTint(0x5a4a48);
        // Murs alts de carreus foscos amb arcs cada tram
        const m = this.add.graphics().setDepth(-990);
        m.fillStyle(0x1a1414, 1).fillRect(0, 0, 200, H).fillRect(700, 0, 200, H);
        m.fillStyle(0x3a302c, 1).fillRect(170, 0, 30, H).fillRect(700, 0, 30, H);
        m.lineStyle(1.5, 0x120c0a, 0.8);
        for (let y = 0; y < H; y += 30) { m.lineBetween(170, y, 200, y); m.lineBetween(700, y, 730, y); }
        m.fillStyle(0x0a0606, 1).fillRect(200, 0, 500, 120);
        // Arcs de pedra que travessen el passadís
        [520, 1000, 1480].forEach(y => {
            m.fillStyle(0x3a302c, 1).fillRect(200, y - 30, 40, 40).fillRect(660, y - 30, 40, 40);
            m.lineStyle(14, 0x3a302c, 1).beginPath(); m.arc(450, y + 140, 250, Math.PI * 1.18, Math.PI * 1.82); m.strokePath();
        });
        this.colisio(100, H / 2, 200, H);
        this.colisio(800, H / 2, 200, H);
        this.colisio(450, 60, 500, 120);
        this.colisio(270, H - 10, 140, 20);
        this.colisio(630, H - 10, 140, 20);

        // Torxes a les parets: llum càlida tremolosa
        [[215, 300], [685, 300], [215, 760], [685, 760], [215, 1240], [685, 1240], [215, 1700], [685, 1700]].forEach(([x, y], i) => {
            const t = this.add.graphics().setDepth(y);
            t.fillStyle(0x3a2a1a, 1).fillRect(x - 4, y - 10, 8, 30).fillStyle(0x2a2a2e, 1).fillRect(x - 8, y - 14, 16, 6);
            const fl = this.add.ellipse(x, y - 24, 14, 24, 0xffa040, 1).setDepth(y + 1);
            const ll = this.add.container(x, y - 20).setDepth(y + 2);
            [[90, 0.05], [55, 0.07], [28, 0.1]].forEach(([rr, a]) => ll.add(this.add.circle(0, 0, rr, 0xff9040, a).setBlendMode('ADD')));
            this.tweens.add({ targets: [fl, ll], scaleY: 1.15, alpha: 0.75, yoyo: true, repeat: -1, duration: 160 + i * 23 });
        });

        // Instruments de tortura
        const g = this.add.graphics();
        // Potro (tram 1)
        g.setDepth(1660);
        g.fillStyle(0x2a1a10, 1).fillRect(250, 1580, 150, 50).fillRect(258, 1630, 12, 40).fillRect(380, 1630, 12, 40);
        g.fillStyle(0x4a4a50, 1).fillCircle(250, 1605, 16).fillCircle(400, 1605, 16).lineStyle(3, 0x8a7a5a, 1).lineBetween(266, 1600, 384, 1610);
        this.colisio(325, 1620, 160, 60);
        this.interactiu(325, 1690, 90, DIALEGS.instrumentsTortura(0), { altura: 90 });
        // Donzella de ferro (tram 1, dreta)
        const dz = this.add.graphics().setDepth(1560);
        dz.fillStyle(0x3a3a40, 1).fillRoundedRect(570, 1400, 90, 160, 40).fillStyle(0x1a1a1e, 1).fillRoundedRect(582, 1414, 66, 140, 30);
        dz.fillStyle(0x9a9aa0, 1).fillCircle(615, 1440, 18).fillStyle(0x1a1a1e, 1).fillCircle(608, 1436, 3).fillCircle(622, 1436, 3);
        for (let k = 0; k < 6; k++) dz.fillStyle(0xd8d0c0, 0.8).fillEllipse(590 + k * 9, 1530 - (k % 2) * 8, 6, 14);
        this.colisio(615, 1540, 90, 30);
        this.interactiu(560, 1580, 90, DIALEGS.instrumentsTortura(1), { altura: 140 });

        // ---- Rastell rovellat amb el torn (Guants de Poder) ----
        const YR = 1180;
        this.rastell = this.add.graphics().setDepth(YR);
        this.rastell.fillStyle(0x2a2420, 1).fillRect(240, YR - 150, 420, 14);
        this.rastell.lineStyle(7, 0x5a4a40, 1);
        for (let x = 254; x <= 646; x += 28) { this.rastell.lineBetween(x, YR - 140, x, YR); this.rastell.fillStyle(0x5a4a40, 1).fillTriangle(x - 5, YR, x + 5, YR, x, YR + 14); }
        this.rastell.lineStyle(5, 0x4a3e36, 1).lineBetween(240, YR - 90, 660, YR - 90).lineBetween(240, YR - 40, 660, YR - 40);
        const torn = this.add.graphics().setDepth(YR + 60);
        torn.fillStyle(0x2a2420, 1).fillRect(640, YR + 20, 40, 40).fillStyle(0x5a4a40, 1).fillCircle(660, YR + 30, 20);
        torn.lineStyle(5, 0x8a7a5a, 1).lineBetween(660, YR + 30, 690, YR + 6);
        torn.lineStyle(2, 0x6a6a70, 1).lineBetween(660, YR + 20, 660, YR - 150);
        this.colTorn = this.colisio(660, YR + 50, 44, 20);
        if (Estat.flag('rastellObert')) this.rastell.y = -150;
        else {
            this.colRastell = this.colisio(450, YR - 10, 420, 30);
            this.interactiu(620, YR + 90, 90, DIALEGS.tornRastell, { altura: 100, actiu: () => !Estat.flag('rastellObert'), enTancar: () => { if (Estat.te('guants')) this.alcarRastell(); } });
        }

        // Roda i eines (tram 2)
        const rd = this.add.graphics().setDepth(900);
        rd.lineStyle(10, 0x4a3020, 1).strokeCircle(300, 850, 60);
        for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; rd.lineStyle(5, 0x4a3020, 1).lineBetween(300, 850, 300 + Math.cos(a) * 60, 850 + Math.sin(a) * 60); }
        rd.fillStyle(0x2a2a2e, 1).fillCircle(300, 850, 10).fillRect(296, 850, 8, 60);
        this.colisio(300, 900, 120, 26);
        this.interactiu(300, 960, 90, DIALEGS.instrumentsTortura(2), { altura: 130 });
        // Gàbies d'ocell que pengen del sostre, gronxant-se
        [[560, 640], [620, 820], [520, 900], [380, 560]].forEach(([x, y], i) => {
            const c = this.add.container(x, y).setDepth(y + 200);
            const gb = this.add.graphics();
            gb.lineStyle(2, 0x6a6a70, 1).lineBetween(0, -200, 0, -40);
            gb.lineStyle(2, 0x8a7a5a, 1).strokeEllipse(0, 0, 40, 10); gb.beginPath(); gb.arc(0, -20, 20, Math.PI, 0); gb.strokePath();
            for (let k = -2; k <= 2; k++) gb.lineBetween(k * 8, 0, k * 8, -18 + Math.abs(k) * 2);
            c.add(gb);
            this.tweens.add({ targets: c, angle: { from: -6, to: 6 }, yoyo: true, repeat: -1, duration: 1400 + i * 300, ease: 'Sine.easeInOut' });
        });
        this.interactiu(560, 700, 80, DIALEGS.instrumentsTortura(3), { altura: 80 });

        // ---- Mur d'esbarzers negres al darrer tram (cal Runna) ----
        [270, 360, 450, 540, 630].forEach((x, i) => {
            const o = this.esbarzer(x, 420, 'tortura' + i);
            if (!o) return;
            o.img.setTint(0xc8a0ff);
            o.halo = this.add.ellipse(x, 402, 96, 60, 0x9a50ff, 0.3).setDepth(419);
            this.tweens.add({ targets: o.halo, alpha: 0.1, yoyo: true, repeat: -1, duration: 900 + i * 110 });
        });
        if (this.esbarzers.length) this.interactiu(450, 470, 300, DIALEGS.murEsbarzers, { altura: 70, actiu: () => this.esbarzers.some(o => o.viu) });

        // Boira lila que baixa de la Sala de la Gàbia
        this.boira(450, 200, 260, 60, 1.2);
        this.boira(450, 700, 200, 40, 0.4);
        this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x1a0a20, 0.3).setScrollFactor(0).setDepth(90000);

        this.sortida(390, 120, 120, 30, 'ZonaGabia', 'tortura');
        this.sortida(410, H - 22, 80, 14, 'ZonaGirgoles', 'tortura');
    }

    alcarRastell() {
        if (Estat.flag('rastellObert')) return;
        Estat.posaFlag('rastellObert');
        if (this.colRastell) this.obstacles.remove(this.colRastell, true, true);
        Sfx.secret();
        this.cameras.main.shake(500, 0.004);
        this.tweens.add({ targets: this.rastell, y: -150, duration: 1800, ease: 'Sine.easeInOut' });
        Estat.desar();
    }

    actualitzar() {
        this.esbarzers.forEach(o => { if (!o.viu && o.halo) { o.halo.destroy(); o.halo = null; } });
        if (!Estat.flag('torturaNet') && this.esbarzers.length && this.esbarzers.every(o => !o.viu)) { Estat.posaFlag('torturaNet'); Estat.desar(); }
        if (!Estat.flag('torturaNet') && !this.esbarzers.length) Estat.posaFlag('torturaNet');
    }
}

// ---------------- LA SALA DE LA GÀBIA ----------------
const GABIA = { x: 700, y: 560, platW: 520, platH: 360, avenc: 130 };

class ZonaGabia extends ZonaBase {
    constructor() {
        super('ZonaGabia', {
            nom: 'Sala de la Gàbia',
            amplada: 1400,
            alcada: 1400,
            colorFons: '#06040a',
            pacifica: true,
            entrades: { tortura: { x: 700, y: 1300, dir: 'amunt' } }
        });
    }

    construir() {
        const W = 1400, H = 1400, G = GABIA;
        const x0 = G.x - G.platW / 2, x1 = G.x + G.platW / 2, y0 = G.y - G.platH / 2, y1 = G.y + G.platH / 2, A = G.avenc;
        this.terra('pedra', 0, 0, W, H, -1100).setTint(0x4a4058);
        // L'avenc: un anell negre i sense fons al voltant de la plataforma, amb boira lila
        const av = this.add.graphics().setDepth(-1060);
        av.fillStyle(0x000000, 1).fillRoundedRect(x0 - A, y0 - A, G.platW + 2 * A, G.platH + 2 * A, 60);
        av.fillStyle(0x1a0a2a, 0.6).fillRoundedRect(x0 - A + 20, y0 - A + 20, G.platW + 2 * A - 40, G.platH + 2 * A - 40, 50);
        av.lineStyle(10, 0x3a3048, 1).strokeRoundedRect(x0 - A, y0 - A, G.platW + 2 * A, G.platH + 2 * A, 60);
        for (let k = 0; k < 36; k++) { const t = k / 36, per = 2 * (G.platW + G.platH + 4 * A); let d = t * per, px, py;
            const Wt = G.platW + 2 * A, Ht = G.platH + 2 * A;
            if (d < Wt) { px = x0 - A + d; py = y0 - A; } else if ((d -= Wt) < Ht) { px = x1 + A; py = y0 - A + d; } else if ((d -= Ht) < Wt) { px = x1 + A - d; py = y1 + A; } else { d -= Wt; px = x0 - A; py = y1 + A - d; }
            av.fillStyle(0x3a3048, 1).fillCircle(px, py, 12 + (k % 4) * 4); }
        for (let k = 0; k < 10; k++) this.boira(x0 - A + 60 + k * ((G.platW + 2 * A - 120) / 9), k % 2 ? y0 - A + 50 : y1 + A - 50, 90, 30, 0.6);
        // La plataforma de pedra del mig
        const pl = this.add.graphics().setDepth(-1050);
        pl.fillStyle(0x2e2838, 1).fillRoundedRect(x0, y0, G.platW, G.platH, 40);
        let ll = 9; const rr = () => (ll = ll * 16807 % 2147483647) / 2147483647;
        for (let k = 0; k < 60; k++) pl.fillStyle(rr() < 0.5 ? 0x3a3448 : 0x26202e, 1).fillRoundedRect(x0 + 20 + rr() * (G.platW - 80), y0 + 20 + rr() * (G.platH - 60), 40 + rr() * 30, 26 + rr() * 16, 6);
        pl.lineStyle(2, 0x14101a, 0.8);
        for (let k = 0; k < 8; k++) { const cx = x0 + 40 + rr() * (G.platW - 80), cy = y0 + 30 + rr() * (G.platH - 60); pl.lineBetween(cx, cy, cx + 20 + rr() * 30, cy + 10 + rr() * 20); }
        // Cercle d'or gravat al voltant de la gàbia
        pl.lineStyle(3, 0xb89a50, 0.6).strokeEllipse(G.x, G.y + 130, 420, 120);
        // Vora de roca de la plataforma
        for (let k = 0; k < 40; k++) { const t = k / 40 * Math.PI * 2, ex = G.x + Math.cos(t) * (G.platW / 2 + 4), ey = G.y + Math.sin(t) * (G.platH / 2 + 4); pl.fillStyle(0x4a4058, 1).fillCircle(Phaser.Math.Clamp(ex, x0, x1), Phaser.Math.Clamp(ey, y0, y1), 10 + (k % 3) * 3); }
        pl.lineStyle(3, 0x9a50ff, 0.35).strokeRoundedRect(x0 - 6, y0 - 6, G.platW + 12, G.platH + 12, 44);
        // Col·lisions de l'avenc (quatre franges) amb un buit a baix per al pont
        const bx = G.x, bw = 120;
        this.colisio(G.x, y0 - A / 2, G.platW + 2 * A, A);                                         // dalt
        this.colisio(x0 - A / 2, G.y, A, G.platH + 2 * A);                                         // esquerra
        this.colisio(x1 + A / 2, G.y, A, G.platH + 2 * A);                                         // dreta
        this.colisio((x0 - A + bx - bw / 2) / 2, y1 + A / 2, bx - bw / 2 - (x0 - A), A);           // baix, a l'esquerra del pont
        this.colisio((bx + bw / 2 + x1 + A) / 2, y1 + A / 2, x1 + A - (bx + bw / 2), A);           // baix, a la dreta del pont

        // El pont: blocs de pedra que dormen al fons i el Cant de les Pedres aixeca
        this.blocs = [];
        for (let k = 0; k < 3; k++) {
            const by = y1 + 20 + k * 38;
            const b = this.add.rectangle(bx, by, bw - 6, 34, 0x7a6a8a).setStrokeStyle(3, 0x2a2238).setDepth(-1045);
            this.blocs.push(b);
        }
        if (Estat.flag('pontGabia')) this.blocs.forEach(b => b.setAlpha(1).setScale(1));
        else {
            this.blocs.forEach(b => b.setAlpha(0.25).setScale(0.6));
            this.colPont = this.colisio(bx, y1 + A / 2, bw, A);
        }
        this.interactiu(bx, y1 + A + 60, 110, DIALEGS.pontGabia, { altura: 90, enTancar: () => Estat.posaFlag('flauta_pont') });
        this.llocFlauta('pont', bx, y1 + A + 60, 220, true, () => !Estat.flag('pontGabia'));

        // ---- La gàbia gegant ----
        const gb = this.add.graphics().setDepth(G.y + 120);
        const gx = G.x, base = G.y + 130, gw = 300, gh = 420;
        gb.fillStyle(0x1a1020, 1).fillEllipse(gx, base, gw + 20, 60);
        gb.lineStyle(10, 0x2a2030, 1).strokeEllipse(gx, base, gw, 50);
        gb.lineStyle(7, 0x3a2a40, 1);
        for (let k = 0; k <= 12; k++) {
            const t = k / 12, x = gx - gw / 2 + t * gw, dy = Math.sqrt(Math.max(0, (gw / 2) ** 2 - (x - gx) ** 2));
            gb.beginPath(); gb.moveTo(x, base - Math.sin(t * Math.PI) * 22); gb.lineTo(x, base - gh + gw / 2 - dy * 0.9); gb.strokePath();
        }
        gb.lineStyle(10, 0x2a2030, 1); gb.beginPath(); gb.arc(gx, base - gh + gw / 2, gw / 2, Math.PI, 0); gb.strokePath();
        gb.lineStyle(8, 0x2a2030, 1).strokeEllipse(gx, base - gh * 0.5, gw, 46);
        gb.lineStyle(6, 0x2a2030, 1).lineBetween(gx, base - gh, gx, -40).strokeCircle(gx, base - gh - 20, 18);
        // Els barrots, quan el Cant del Miracle hi sona, brillen
        this.brillGabia = this.add.graphics().setDepth(G.y + 121).setBlendMode('ADD').setAlpha(Estat.flag('gabiaCantada') ? 0.6 : 0);
        this.brillGabia.lineStyle(4, 0xffe08a, 1);
        for (let k = 0; k <= 12; k++) { const t = k / 12, x = gx - gw / 2 + t * gw, dy = Math.sqrt(Math.max(0, (gw / 2) ** 2 - (x - gx) ** 2)); this.brillGabia.lineBetween(x, base - Math.sin(t * Math.PI) * 22, x, base - gh + gw / 2 - dy * 0.9); }
        this.colisio(gx, base - 10, gw + 10, 50);
        // Tres capolls de boira (els nens) dins la gàbia
        [["l'Uri", -80], ['el Flam', 0], ['el Sardin', 80]].forEach(([nom, dx], i) => {
            const c = this.add.ellipse(gx + dx, base - 150 - (i % 2) * 30, 60, 100, 0xb88aff, 0.55).setDepth(G.y + 110).setStrokeStyle(3, 0xe0c8ff, 0.8);
            this.add.ellipse(gx + dx, base - 150 - (i % 2) * 30, 26, 44, 0x2a1a3a, 0.6).setDepth(G.y + 111);
            this.tweens.add({ targets: c, y: c.y - 10, scaleX: 1.06, yoyo: true, repeat: -1, duration: 1500 + i * 300, ease: 'Sine.easeInOut' });
            this.interactiu(gx + dx, base + 50, 60, DIALEGS.capoll(nom), { altura: 200 });
        });
        this.interactiu(gx, base + 60, 160, DIALEGS.gabiaGran, { altura: 260, enTancar: () => Estat.posaFlag('flauta_gabia') });
        this.llocFlauta('gabia', gx, base + 60, 230, true);
        // Ocells de boira que volen en cercles al voltant de la cúpula
        for (let k = 0; k < 6; k++) {
            const o = this.add.image(0, 0, 'ocell').setDepth(2000).setTint(0xb88aff).setAlpha(0.7);
            o.setScale((40 / o.height));
            const r = 180 + (k % 3) * 40, v = 4200 + k * 600, f = k * 1.1;
            this.time.addEvent({ delay: 30, loop: true, callback: () => {
                const t = this.time.now / v * Math.PI * 2 + f;
                o.setPosition(gx + Math.cos(t) * r, base - gh * 0.6 + Math.sin(t) * r * 0.35).setFlipX(Math.sin(t) > 0);
            } });
        }

        // Columnes de la cova, cadenes i l'estrada (buida) on espera l'Home de la Gàbia
        const cv = this.add.graphics().setDepth(-990);
        cv.fillStyle(0x1a1424, 1).fillRect(0, 0, W, 120);
        for (let k = 0; k < 14; k++) cv.fillStyle(0x2a2234, 1).fillTriangle(k * 100, 120, k * 100 + 50, 120, k * 100 + 25, 170 + (k % 3) * 20);
        [[150, 700], [1250, 700], [150, 1150], [1250, 1150]].forEach(([x, y]) => {
            const c = this.add.graphics().setDepth(y);
            c.fillStyle(0x3a3048, 1).fillRect(x - 36, y - 420, 72, 420).lineStyle(3, 0x1a1424, 1).strokeRect(x - 36, y - 420, 72, 420);
            c.fillStyle(0x4a4058, 1).fillRect(x - 46, y - 20, 92, 20).fillRect(x - 46, y - 420, 92, 20);
            this.colisio(x, y - 10, 92, 30);
        });
        this.colisio(W / 2, 60, W, 120);
        this.colisio(30, H / 2, 60, H);
        this.colisio(W - 30, H / 2, 60, H);
        this.colisio(320, H - 10, 640, 20);
        this.colisio(1080, H - 10, 640, 20);
        // Llum lila que puja de l'avenc
        this.add.ellipse(G.x, G.y, G.platW + 300, G.platH + 300, 0x9a50ff, 0.08).setDepth(-1040).setBlendMode('ADD');
        this.add.particles(0, 0, 'espurna', {
            emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(x0 - A, y0 - A, G.platW + 2 * A, G.platH + 2 * A) },
            speedY: { min: -30, max: -10 }, lifespan: 3000, scale: { start: 0.2, end: 0 }, alpha: { start: 0.8, end: 0 },
            tint: [0xb88aff, 0xe0c8ff], frequency: 120, blendMode: 'ADD'
        }).setDepth(9000);
        this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x1a0a30, 0.22).setScrollFactor(0).setDepth(90000);

        this.sortida(660, H - 22, 80, 14, 'ZonaTortura', 'gabia');
    }

    enMelodia(nom) {
        const G = GABIA, d = (x, y) => Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, x, y);
        const yPont = G.y + G.platH / 2 + G.avenc + 60;
        if (nom === 'pedres' && !Estat.flag('pontGabia') && d(G.x, yPont) < 260) { this.aixecarPont(); return true; }
        if (nom === 'miracle' && d(G.x, G.y + 190) < 260) { this.cantarGabia(); return true; }
        return false;
    }

    aixecarPont() {
        Estat.posaFlag('pontGabia');
        Sfx.secret();
        this.cameras.main.shake(600, 0.004);
        this.blocs.forEach((b, i) => this.tweens.add({ targets: b, alpha: 1, scale: 1, delay: i * 400, duration: 700, ease: 'Back.easeOut' }));
        this.time.delayedCall(1300, () => { if (this.colPont) this.obstacles.remove(this.colPont, true, true); });
        this.flotant(GABIA.x, GABIA.y + 260, 'Les pedres es desperten', '#d8c8ff');
        Estat.posaObjectiu('Creua el pont de pedra fins a la gàbia.');
        Estat.desar();
    }

    cantarGabia() {
        const primera = !Estat.flag('gabiaCantada');
        Estat.posaFlag('gabiaCantada');
        this.tweens.add({ targets: this.brillGabia, alpha: { from: 1, to: 0.6 }, duration: 1500 });
        this.cameras.main.flash(500, 255, 230, 160);
        this.ui().obrirDialeg({ pagines: [
            { qui: '', text: 'Les notes del Cant del Miracle pugen per la cúpula. Els barrots, un a un, s\'encenen d\'or i comencen a vibrar, com cordes d\'una arpa gegant.' },
            { qui: '', text: 'Dins dels capolls, els tres nens es mouen. El Sardin obre una mica els ulls.' },
            { qui: '', text: '(Aquí arribaran l\'Home de la Gàbia i el Germà Andreu: el combat final, l\'alliberament i l\'epíleg encara s\'han de fer.)' }
        ] }, () => Estat.desar());
        if (primera) Estat.posaObjectiu('La gàbia respon al Cant del Miracle. (Fi del camí fet fins ara: falten el combat final i l\'epíleg.)');
    }
}
