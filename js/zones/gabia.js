/**
 * SOTA LA TAVERNA: el camí fins a la Sala de la Gàbia
 *   Soterrani de la Taverna --(porta de ferro: Clau de ferro)--> Sala de les Gírgoles --> Passadís de tortura --> Sala de la Gàbia
 * Puzles:
 *   Gírgoles: cova fosca i humida. Cinc mates de gírgoles lluminoses en rotllana: en tocar-ne una, s'encén o s'apaga ella i les
 *             dues veïnes. Quan les cinc brillen, la cortina de micel·li que tapa el túnel del nord es desfà.
 *   Tortura:  un rastell rovellat barra el pas: el torn només el giren els Guants de Poder. Més amunt, un mur d'esbarzers negres (Runna).
 *   Gàbia:    la gàbia penja al mig d'un avenc. Els blocs de pedra del pont dormen al fons: el Cant de les Pedres els aixeca.
 *             Combat final contra l'Ocellaire (bàcul que gira i ocells de foc). Vençut, el Cant del Miracle aixeca la gàbia,
 *             Runna trenca els capolls dels nens i l'Andreu s'hi queda tancat. Després, l'epíleg al Santuari.
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
        { qui: 'Inscripció', text: "«Les gírgoles de la cova canten juntes o callen juntes. Toca'n una i despertaràs també les dues que té al costat. Quan cantin totes, el pas s'obre.»" }
    ] }),
    cortinaMicel: E => ({ pagines: [
    ] }),
    sacsGirgoles: E => ({ pagines: [] }),
    tornRastell: E => E.flag('rastellObert') ? { pagines: [] } : E.te('guants') ? {
        pagines: [
        ]
    } : { pagines: [
        { qui: 'Ineu', text: "(Em caldrien unes mans molt més fortes: els guants dels picapedrers del Germà Francesc.)" }
    ] },
    instrumentsTortura: n => E => ({ pagines: [] }),
    pontGabia: E => E.flag('pontGabia') ? { pagines: [] } : {
        pagines: [
            { qui: 'Inscripció', text: "Gravada a la pedra, una paraula antiga: PEDRES." },
            { qui: 'Ineu', text: E.flag('cantPedres') ? "(Les pedres... L'ombra del monjo es va despertar amb el Cant de les Pedres. Potser aquestes també: 3-1-2-1.)" : "(Pedres que dormen. Hi deu haver un cant per despertar-les.)" }
        ]
    },
    gabiaGran: E => ({ pagines: E.flag('andreuTancat') ? [
    ] : E.flag('gabiaOberta') ? [
    ] : E.flag('ocellaireVencut') ? [
        { qui: 'Ineu', text: "(Ara. El Cant del Miracle: 1-3-2-3-1.)" }
    ] : [
        { qui: 'Ineu', text: "(Els barrots no tenen pany. Només un cant els pot obrir: el Cant del Miracle.)" }
    ] }),
    capoll: nom => E => ({ pagines: [] }),
    andreuGabia: E => ({ pagines: E.flag('andreuTancat') ? [
        { qui: 'Germà Andreu', text: "Ell em va veure, saps? Tothom em passava pel costat. Ell em va veure." },
        { qui: 'Germà Andreu', text: "Deixa'm aquí. Si mai torna, que em trobi esperant-lo." }
    ] : [
        { qui: 'Germà Andreu', text: "Mestre... no em deixeu..." }
    ] }),
    gentEpileg: E => ({ pagines: [{ qui: 'Gent', text: "Avui tothom canta, encara que l'orgue faci una nota de pega." }] }),
    nenGabia: nom => E => ({ pagines: [{ qui: nom, text: {
        Huri: "Ineu! Somiava que era un ocell dins d'una gàbia... i ara tinc unes ganes de riure!",
        Flami: "On és l'home dels ocells? L'has fet fugir tu? Ha ha ha! Quina cara que feia!",
        Sardi: "Les tietes deuen estar fent un sidral... Anem a casa, Ineu?"
    }[nom] }] })
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

        // Ratpenats de boira que pengen de la volta
        [[420, 520], [980, 560], [360, 900], [1020, 980]].forEach(([x, y]) => { const e = this.enemic('ratpenat', x, y); if (e) e.estat = 'penja'; });

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
        this.missatge('Les gírgoles canten: el micel·li es desfà.');
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

        // Ferralla viva: les eines dels torturadors s'aixequen i barren el pas
        [[330, 1420], [580, 1300], [420, 860], [350, 640]].forEach(([x, y]) => this.enemic('ferralla', x, y));

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
// La gàbia és al fons d'una plataforma gran voltada per un avenc. Al davant hi ha l'espai del combat final.
const GABIA = { x: 900, y: 720, platW: 900, platH: 600, avenc: 130 };
const NENS_GABIA = [
    { id: 'Huri', key: 'nen_uri', nom: "l'Huri", flag: 'rescatUri', dx: -80 },
    { id: 'Flami', key: 'nen_flam', nom: 'el Flami', flag: 'rescatFlam', dx: 0 },
    { id: 'Sardi', key: 'nen_sardin', nom: 'el Sardi', flag: 'rescatSardin', dx: 80 }
];

class ZonaGabia extends ZonaBase {
    constructor() {
        super('ZonaGabia', {
            nom: 'Sala de la Gàbia',
            amplada: 1800,
            alcada: 1640,
            colorFons: '#06040a',
            reneix: 'tortura',            // si l'Ineu cau al combat final, torna a l'entrada de la sala
            entrades: { tortura: { x: 900, y: 1540, dir: 'amunt' } }
        });
    }

    construir() {
        const W = 1800, H = 1640, G = GABIA;
        const x0 = G.x - G.platW / 2, x1 = G.x + G.platW / 2, y0 = G.y - G.platH / 2, y1 = G.y + G.platH / 2, A = G.avenc;
        this.terra('pedra', 0, 0, W, H, -1100).setTint(0x4a4058);
        // L'avenc: un anell negre i sense fons al voltant de la plataforma, amb boira lila
        const av = this.add.graphics().setDepth(-1060);
        av.fillStyle(0x000000, 1).fillRoundedRect(x0 - A, y0 - A, G.platW + 2 * A, G.platH + 2 * A, 60);
        av.fillStyle(0x1a0a2a, 0.6).fillRoundedRect(x0 - A + 20, y0 - A + 20, G.platW + 2 * A - 40, G.platH + 2 * A - 40, 50);
        av.lineStyle(10, 0x3a3048, 1).strokeRoundedRect(x0 - A, y0 - A, G.platW + 2 * A, G.platH + 2 * A, 60);
        for (let k = 0; k < 48; k++) { const t = k / 48, per = 2 * (G.platW + G.platH + 4 * A); let d = t * per, px, py;
            const Wt = G.platW + 2 * A, Ht = G.platH + 2 * A;
            if (d < Wt) { px = x0 - A + d; py = y0 - A; } else if ((d -= Wt) < Ht) { px = x1 + A; py = y0 - A + d; } else if ((d -= Ht) < Wt) { px = x1 + A - d; py = y1 + A; } else { d -= Wt; px = x0 - A; py = y1 + A - d; }
            av.fillStyle(0x3a3048, 1).fillCircle(px, py, 12 + (k % 4) * 4); }
        this.boires = [];
        for (let k = 0; k < 12; k++) this.boires.push(this.boira(x0 - A + 60 + k * ((G.platW + 2 * A - 120) / 11), k % 2 ? y0 - A + 50 : y1 + A - 50, 90, 30, 0.6));
        // La plataforma de pedra del mig
        const pl = this.add.graphics().setDepth(-1050);
        pl.fillStyle(0x2e2838, 1).fillRoundedRect(x0, y0, G.platW, G.platH, 40);
        let ll = 9; const rr = () => (ll = ll * 16807 % 2147483647) / 2147483647;
        for (let k = 0; k < 110; k++) pl.fillStyle(rr() < 0.5 ? 0x3a3448 : 0x26202e, 1).fillRoundedRect(x0 + 20 + rr() * (G.platW - 80), y0 + 20 + rr() * (G.platH - 60), 40 + rr() * 30, 26 + rr() * 16, 6);
        pl.lineStyle(2, 0x14101a, 0.8);
        for (let k = 0; k < 14; k++) { const cx = x0 + 40 + rr() * (G.platW - 80), cy = y0 + 30 + rr() * (G.platH - 60); pl.lineBetween(cx, cy, cx + 20 + rr() * 30, cy + 10 + rr() * 20); }
        pl.lineStyle(3, 0x9a50ff, 0.35).strokeRoundedRect(x0 - 6, y0 - 6, G.platW + 12, G.platH + 12, 44);
        // Col·lisions de l'avenc (quatre franges) amb un buit a baix per al pont
        const bx = G.x, bw = 120;
        this.colisio(G.x, y0 - A / 2, G.platW + 2 * A, A);
        this.colisio(x0 - A / 2, G.y, A, G.platH + 2 * A);
        this.colisio(x1 + A / 2, G.y, A, G.platH + 2 * A);
        this.colisio((x0 - A + bx - bw / 2) / 2, y1 + A / 2, bx - bw / 2 - (x0 - A), A);
        this.colisio((bx + bw / 2 + x1 + A) / 2, y1 + A / 2, x1 + A - (bx + bw / 2), A);
        this.limits = { x0: x0 + 70, x1: x1 - 70, y0: y0 + 90, y1: y1 - 40 };

        // El pont: blocs de pedra que dormen al fons i el Cant de les Pedres aixeca
        this.blocs = [];
        for (let k = 0; k < 3; k++) {
            const b = this.add.rectangle(bx, y1 + 20 + k * 38, bw - 6, 34, 0x7a6a8a).setStrokeStyle(3, 0x2a2238).setDepth(-1045);
            this.blocs.push(b);
        }
        if (Estat.flag('pontGabia')) this.blocs.forEach(b => b.setAlpha(1).setScale(1));
        else {
            this.blocs.forEach(b => b.setAlpha(0.25).setScale(0.6));
            this.colPont = this.colisio(bx, y1 + A / 2, bw, A);
        }
        this.yPont = y1 + A + 60;
        this.interactiu(bx, this.yPont, 110, DIALEGS.pontGabia, { altura: 90, enTancar: () => Estat.posaFlag('flauta_pont') });
        this.llocFlauta('pont', bx, this.yPont, 220, true, () => !Estat.flag('pontGabia'));

        // ---- La gàbia gegant, al fons de la plataforma ----
        const gx = G.x, base = y0 + 250, gw = 300, gh = 420;
        this.gx = gx; this.base = base; this.gh = gh;
        pl.lineStyle(3, 0xb89a50, 0.6).strokeEllipse(gx, base, 420, 120);           // cercle d'or gravat on reposa la gàbia
        const oberta = Estat.flag('gabiaOberta') && !Estat.flag('andreuTancat');
        const dy = oberta ? -560 : 0;                                                 // oberta: penja enlaire, sobre la cova
        const gb = this.add.graphics().setDepth(base - 10).setY(dy);
        gb.fillStyle(0x1a1020, 1).fillEllipse(gx, base, gw + 20, 60);
        gb.lineStyle(10, 0x2a2030, 1).strokeEllipse(gx, base, gw, 50);
        gb.lineStyle(7, 0x3a2a40, 1);
        const barrots = (g) => { for (let k = 0; k <= 12; k++) {
            const t = k / 12, x = gx - gw / 2 + t * gw, d = Math.sqrt(Math.max(0, (gw / 2) ** 2 - (x - gx) ** 2));
            g.beginPath(); g.moveTo(x, base - Math.sin(t * Math.PI) * 22); g.lineTo(x, base - gh + gw / 2 - d * 0.9); g.strokePath();
        } };
        barrots(gb);
        gb.lineStyle(10, 0x2a2030, 1); gb.beginPath(); gb.arc(gx, base - gh + gw / 2, gw / 2, Math.PI, 0); gb.strokePath();
        gb.lineStyle(8, 0x2a2030, 1).strokeEllipse(gx, base - gh * 0.5, gw, 46);
        gb.lineStyle(6, 0x2a2030, 1).lineBetween(gx, base - gh, gx, base - gh - 900).strokeCircle(gx, base - gh - 20, 18);
        // Els barrots, quan el Cant del Miracle hi sona, brillen
        this.brillGabia = this.add.graphics().setDepth(base - 9).setBlendMode('ADD').setY(dy).setAlpha(0);
        this.brillGabia.lineStyle(4, 0xffe08a, 1); barrots(this.brillGabia);
        this.gabiaGfx = [gb, this.brillGabia];
        if (!oberta) this.colGabia = this.colisio(gx, base - 10, gw + 10, 50);
        this.interactiu(gx, base + 60, 160, DIALEGS.gabiaGran, { altura: 260, enTancar: () => Estat.posaFlag('flauta_gabia') });
        this.llocFlauta('gabia', gx, base + 60, 260, true, () => !Estat.flag('gabiaOberta'));

        // Els tres capolls de boira (els nens), dins la gàbia mentre no s'obre
        this.capolls = [];
        if (!Estat.flag('gabiaOberta')) NENS_GABIA.forEach((n, i) => {
            const y = base - 150 - (i % 2) * 30;
            const c = this.add.image(gx + n.dx, y, 'capoll').setDepth(base - 20);
            c.setScale(this.textures.get('capoll').customData.escala || 1 / RES);
            this.tweens.add({ targets: c, y: y - 10, yoyo: true, repeat: -1, duration: 1500 + i * 300, ease: 'Sine.easeInOut' });
            this.capolls.push(c);
        });
        // Els nens ja alliberats, al davant de la gàbia
        NENS_GABIA.forEach((n, i) => { if (Estat.flag(n.flag)) this.posarNen(n, gx - 200 + i * 200, base + 220); });

        // Ocells de boira que volen en cercles al voltant de la cúpula (fins que l'Ocellaire cau)
        this.ocellsBoira = [];
        if (!Estat.flag('ocellaireVencut')) for (let k = 0; k < 6; k++) {
            const o = this.add.image(0, 0, 'ocell').setDepth(2000).setTint(0xb88aff).setAlpha(0.7);
            o.setScale((40 / o.height));
            const r = 180 + (k % 3) * 40, v = 4200 + k * 600, f = k * 1.1;
            o.ev = this.time.addEvent({ delay: 30, loop: true, callback: () => {
                const t = this.time.now / v * Math.PI * 2 + f;
                o.setPosition(gx + Math.cos(t) * r, base - gh * 0.6 + Math.sin(t) * r * 0.35).setFlipX(Math.sin(t) > 0);
            } });
            this.ocellsBoira.push(o);
        }

        // El Germà Andreu: de guàrdia al costat de la gàbia, o tancat a dins quan tot s'ha acabat
        if (Estat.flag('andreuTancat')) this.npc('germa_andreu', gx, base - 30, DIALEGS.andreuGabia);
        else if (!Estat.flag('gabiaOberta')) this.npc('germa_andreu', gx + 230, base + 60, DIALEGS.andreuGabia, { flipX: true });
        if (Estat.flag('andreuTancat')) { const a = this.npcs.germa_andreu; a.punt.x = gx; a.punt.y = base + 60; a.setDepth(base - 15); }

        // Columnes de la cova i el sostre
        const cv = this.add.graphics().setDepth(-990);
        cv.fillStyle(0x1a1424, 1).fillRect(0, 0, W, 120);
        for (let k = 0; k < 18; k++) cv.fillStyle(0x2a2234, 1).fillTriangle(k * 100, 120, k * 100 + 50, 120, k * 100 + 25, 170 + (k % 3) * 20);
        [[150, 800], [1650, 800], [150, 1350], [1650, 1350]].forEach(([x, y]) => {
            const c = this.add.graphics().setDepth(y);
            c.fillStyle(0x3a3048, 1).fillRect(x - 36, y - 420, 72, 420).lineStyle(3, 0x1a1424, 1).strokeRect(x - 36, y - 420, 72, 420);
            c.fillStyle(0x4a4058, 1).fillRect(x - 46, y - 20, 92, 20).fillRect(x - 46, y - 420, 92, 20);
            this.colisio(x, y - 10, 92, 30);
        });
        this.colisio(W / 2, 60, W, 120);
        this.colisio(30, H / 2, 60, H);
        this.colisio(W - 30, H / 2, 60, H);
        this.colisio(420, H - 10, 840, 20);
        this.colisio(1380, H - 10, 840, 20);
        // Llum lila que puja de l'avenc (s'apaga quan la boira es desfà)
        const net = Estat.flag('andreuTancat');
        this.llumLila = this.add.ellipse(G.x, G.y, G.platW + 300, G.platH + 300, 0x9a50ff, net ? 0.02 : 0.08).setDepth(-1040).setBlendMode('ADD');
        this.espurnes = this.add.particles(0, 0, 'espurna', {
            emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(x0 - A, y0 - A, G.platW + 2 * A, G.platH + 2 * A) },
            speedY: { min: -30, max: -10 }, lifespan: 3000, scale: { start: 0.2, end: 0 }, alpha: { start: 0.8, end: 0 },
            tint: net ? [0xffe8a0, 0xffffff] : [0xb88aff, 0xe0c8ff], frequency: net ? 400 : 120, blendMode: 'ADD'
        }).setDepth(9000);
        this.velLila = this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x1a0a30, net ? 0.06 : 0.22).setScrollFactor(0).setDepth(90000);

        this.sortida(860, H - 22, 80, 14, 'ZonaTortura', 'gabia');

        // Capolls que encara no s'han trencat, si la gàbia ja és oberta (s'havia sortit a mig alliberament)
        if (Estat.flag('gabiaOberta')) NENS_GABIA.forEach((n, i) => { if (!Estat.flag(n.flag)) this.crearCapoll(n, gx - 200 + i * 200, base + 160); });
        // Tots alliberats però l'Andreu encara no s'ha tancat: es reprèn el final
        if (this.totsLliures() && !Estat.flag('andreuTancat')) this.time.delayedCall(600, () => this.finalGabia());
    }

    // ---------------- Ajudes ----------------
    centreGabia() { return { x: this.gx, y: this.base }; }
    totsLliures() { return NENS_GABIA.every(n => Estat.flag(n.flag)); }
    // Un punt de la plataforma lliure (fora de l'avenc i de la base de la gàbia)
    puntPlataforma(x, y) {
        const L = this.limits;
        x = Phaser.Math.Clamp(x, L.x0, L.x1); y = Phaser.Math.Clamp(y, L.y0, L.y1);
        if (this.colGabia && Math.abs(x - this.gx) < 230 && y < this.base + 90) y = this.base + 90;
        return { x, y };
    }
    posarNen(n, x, y) {
        const img = this.npc(n.key, x, y, DIALEGS.nenGabia(n.id));
        this.tweens.add({ targets: img, y: y - 8, yoyo: true, repeat: -1, duration: 260 + Math.random() * 120, repeatDelay: 1400 + Math.random() * 1600 });
        return img;
    }
    crearCapoll(n, x, y) {
        const e = this.enemic('capoll', x, y);
        if (!e) return null;
        e.nen = n; e.yBase = y; e.fase = Math.random() * 6;
        return e;
    }

    // El bàcul de l'Ocellaire: un pal llarg de fusta negra amb el ganxo d'or i una flama lila a cada punta
    crearBasto(e) {
        const g = this.add.graphics();
        g.fillStyle(0x2a1a14, 1).fillRoundedRect(-80, -5, 160, 10, 4);
        g.lineStyle(2, 0x0a0606, 1).strokeRoundedRect(-80, -5, 160, 10, 4);
        g.fillStyle(0xb89a50, 1).fillRect(-14, -7, 28, 14);
        g.lineStyle(6, 0xd8b860, 1); g.beginPath(); g.arc(-92, -10, 14, 0.2, Math.PI * 1.6); g.strokePath();
        g.lineStyle(6, 0xd8b860, 1); g.beginPath(); g.arc(92, 10, 14, Math.PI + 0.2, Math.PI * 2.6); g.strokePath();
        g.fillStyle(0xff9a40, 0.9).fillCircle(-92, -10, 7).fillCircle(92, 10, 7);
        g.fillStyle(0xffffff, 0.9).fillCircle(-92, -10, 3).fillCircle(92, 10, 3);
        const b = { g, x: e.spr.x, y: e.spr.y - 70, rot: 0, gir: 0.04, volant: false };
        e.basto = b;
        e.flama = this.add.particles(0, 0, 'espurna', {
            speed: { min: 10, max: 60 }, lifespan: 420, scale: { start: 0.35, end: 0 }, alpha: { start: 0.9, end: 0 },
            tint: [0xff9a40, 0xffd060, 0xff5020], blendMode: 'ADD', frequency: 40, emitting: false
        }).setDepth(99980);
        return b;
    }
    moureBasto(e) {
        const b = e.basto, c = e.spr.body.center;
        if (!b) return;
        if (!b.volant) { b.x = c.x + (e.spr.flipX ? -66 : 66); b.y = c.y - 92; }
        b.rot += b.gir;
        b.g.setPosition(b.x, b.y).setRotation(b.rot).setDepth(c.y + 2);
        // Mentre gira de pressa, les puntes deixen un rastre de foc
        if (e.flama) {
            if (b.gir > 0.2) { if (!e.flama.emitting) e.flama.start(); e.flama.setPosition(b.x + Math.cos(b.rot) * 92, b.y + Math.sin(b.rot) * 92); }
            else if (e.flama.emitting) e.flama.stop();
        }
    }
    // Els ulls lila que brillen (també a la foscor i a través de la boira): una llum que cobreix els ulls del dibuix
    crearUlls() {
        const g = this.add.container(0, 0).setDepth(99950);
        [-1, 1].forEach(sd => {
            g.add(this.add.circle(sd * 15, 0, 14, 0x9a50ff, 0.22).setBlendMode('ADD'));
            g.add(this.add.circle(sd * 15, 0, 7, 0xd8a8ff, 0.45).setBlendMode('ADD'));
        });
        this.tweens.add({ targets: g, alpha: 0.65, yoyo: true, repeat: -1, duration: 500 });
        return g;
    }
    posarUlls(u, spr, prof) {
        u.setPosition(spr.x, spr.y - spr.displayHeight * 0.5 + spr.displayHeight * 0.254).setVisible(spr.alpha > 0.3);       // els ulls són al 25% del dibuix
        if (prof) u.setDepth(prof + 1);
    }
    // Tambors de guerra mentre dura el combat (BUM · BUM BUM ·)
    tambors(ms) {
        if (this.tambor) this.tambor.remove();
        let k = 0;
        this.tambor = this.time.addEvent({ delay: ms, loop: true, callback: () => {
            const t = k++ % 4;
            if (!this.ui().dialeg && t !== 1) Sfx.tambor(t === 0);
        } });
    }
    // Segona fase: rugit, ona de xoc que empeny l'Ineu, la cova es torna vermella i els tambors s'acceleren
    furiaOcellaire(e, fase = 2) {
        const c = e.spr.body.center, cam = this.cameras.main;
        Sfx.rugit();
        cam.shake(fase === 3 ? 1800 : 1300, fase === 3 ? 0.016 : 0.012);
        cam.flash(400, 255, fase === 3 ? 140 : 60, 40);
        this.bombolla('ocellaire', fase === 3 ? 'ARA CREMARÀS!' : 'PROU JOCS!', null, 1500);
        const ona = this.add.circle(c.x, c.y - 30, 30).setStrokeStyle(10, 0xff5030, 0.9).setDepth(99960);
        this.tweens.add({ targets: ona, radius: 520, alpha: 0, duration: 900, ease: 'Cubic.out', onComplete: () => ona.destroy() });
        const jo = this.ineu.body.center, dx = jo.x - c.x, dy = jo.y - c.y, l = Math.hypot(dx, dy) || 1;
        if (l < 420) this.forcat = { vx: dx / l * 520, vy: dy / l * 520, fins: this.time.now + 260 };
        this.tweens.add({ targets: this.velLila, alpha: fase === 3 ? 0.42 : 0.32, duration: 800 });
        this.velLila.setFillStyle(fase === 3 ? 0x4a0a04 : 0x3a0610, this.velLila.alpha);
        this.llumLila.setFillStyle(fase === 3 ? 0xff7020 : 0xff3020, fase === 3 ? 0.16 : 0.1);
        this.espurnes.setParticleTint && this.espurnes.setParticleTint(0xff6040);
        if (e.ulls) this.tweens.add({ targets: e.ulls, scale: 1.6, duration: 400 });
        this.tambors(fase === 3 ? 300 : 400);
        if (fase === 3) Joc.iniciarMusica(this, 0, 'musica_boss_final');
    }

    // ---- Atacs a terra (cercle i foc): els avisos són ovals aixafats, com tot el que va a terra en aquesta vista ----
    ovalTerra(x, y, R, color, alfaOmple, gruix = 4) {
        const g = this.add.ellipse(x, y, R * 2, R * 1.1, color, alfaOmple).setStrokeStyle(gruix, color, 0.9).setDepth(y - 400);
        return g;
    }
    dinsOval(x, y, R, p) { const dx = (p.x - x) / R, dy = (p.y - y) / (R * 0.55); return dx * dx + dy * dy < 1; }

    // Cop en cercle: avís (un anell que s'omple) i, en acabar l'avís, l'ona
    avisAnell(x, y, R, ms) {
        const g = this.ovalTerra(x, y, R, 0xffb040, 0.04);
        this.tweens.add({ targets: g, fillAlpha: 0.3, duration: ms, ease: 'Quad.in' });
        this.tweens.add({ targets: g, alpha: { from: 1, to: 0.55 }, yoyo: true, repeat: -1, duration: 110 });
        (this.anellsAvis = this.anellsAvis || []).push(g);
        return g;
    }
    colpAnell(e, R) {
        const c = e.spr.body.center;
        if (e.avisCercle) { this.tweens.killTweensOf(e.avisCercle); e.avisCercle.destroy(); e.avisCercle = null; }
        Sfx.cop(true); Sfx.rugit();
        this.cameras.main.shake(260, 0.009, true);
        const ona = this.ovalTerra(c.x, c.y, R * 0.5, 0xfff0b0, 0.25, 6);
        this.tweens.add({ targets: ona, scaleX: 2.1, scaleY: 2.1, alpha: 0, duration: 420, ease: 'Cubic.out', onComplete: () => ona.destroy() });
        const jo = this.ineu.body.center;
        if (this.dinsOval(c.x, c.y, R, jo)) {
            this.ferIneu(1, { x: c.x, y: c.y });
            const dx = jo.x - c.x, dy = jo.y - c.y, l = Math.hypot(dx, dy) || 1;     // i l'empeny cap enfora
            this.forcat = { vx: dx / l * 700, vy: dy / l * 700, fins: this.time.now + 300 };
        }
    }
    // Terra en flames (fase 3): quatre zones, una on ets ara, que avisen i després cremen
    focsTerra(e) {
        const jo = this.ineu.body.center, punts = [{ x: jo.x, y: jo.y }];
        for (let k = 0; k < 3; k++) { const a = Math.random() * Math.PI * 2, d = 150 + Math.random() * 110; punts.push({ x: jo.x + Math.cos(a) * d, y: jo.y + Math.sin(a) * d * 0.6 }); }
        punts.forEach(q => { const p = this.puntPlataforma(q.x, q.y); this.focTerra(p.x, p.y, 70, 950, 3000); });
    }
    focTerra(x, y, R, avis, dura) {
        const av = this.ovalTerra(x, y, R, 0xff5020, 0.05, 3);
        this.tweens.add({ targets: av, fillAlpha: 0.32, alpha: { from: 1, to: 0.6 }, duration: avis });
        const f = { x, y, R, av, mort: false };
        (this.focs = this.focs || []).push(f);
        this.time.delayedCall(avis, () => {
            if (f.mort) return;
            Sfx.flama();
            av.setFillStyle(0xff7a20, 0.42).setStrokeStyle(4, 0xffd060, 0.95).setAlpha(1);
            this.tweens.add({ targets: av, alpha: 0.7, yoyo: true, repeat: -1, duration: 160 });
            f.flames = this.add.particles(x, y, 'espurna', {
                emitZone: { type: 'random', source: new Phaser.Geom.Ellipse(0, 0, R * 1.7, R * 0.9) },
                speedY: { min: -90, max: -30 }, lifespan: 700, scale: { start: 0.5, end: 0 }, alpha: { start: 0.95, end: 0 },
                tint: [0xff5020, 0xff9a30, 0xffe060], blendMode: 'ADD', frequency: 28
            }).setDepth(y + 300);
            const ticks = this.time.addEvent({ delay: 300, loop: true, callback: () => {
                if (f.mort) return;
                if (this.dinsOval(x, y, R, this.ineu.body.center)) this.ferIneu(1, { x, y });
            } });
            this.time.delayedCall(dura, () => { ticks.remove(); this.apagarFoc(f); });
        });
    }
    apagarFoc(f) {
        if (f.mort) return;
        f.mort = true;
        this.tweens.killTweensOf(f.av);
        this.tweens.add({ targets: f.av, alpha: 0, duration: 300, onComplete: () => f.av.destroy() });
        if (f.flames) { f.flames.stop(); this.time.delayedCall(800, () => f.flames.destroy()); }
    }
    // Neteja d'avisos i flames (canvi de fase o final del combat)
    netejarRonda(e) {
        (this.focs || []).forEach(f => this.apagarFoc(f)); this.focs = [];
        (this.anellsAvis || []).forEach(g => { if (g.active) { this.tweens.killTweensOf(g); g.destroy(); } }); this.anellsAvis = [];
        if (e) e.avisCercle = null;
    }

    // Rastre de foc d'un ocell
    flamaOcell(o) {
        o.spr.anims.play('ocell_foc_vola');
        o.spr.anims.setProgress(Math.random());                 // que no aleteixin tots alhora
        if (o.rapid) o.spr.setScale(o.escalaBase * 1.2);          // l'ocell ràpid: un punt més gran i amb rastre blanc d'escalfor
        o.flama = this.add.particles(0, 0, 'espurna', {
            follow: o.spr, speed: { min: 5, max: 40 }, lifespan: 380, scale: { start: o.rapid ? 0.45 : 0.3, end: 0 }, alpha: { start: 0.9, end: 0 },
            tint: o.rapid ? [0xffffff, 0xfff0b0, 0xffd060] : [0xff9a40, 0xffd060, 0xff5020], blendMode: 'ADD', frequency: o.rapid ? 25 : 45
        }).setDepth(99979);
        o.spr.setAlpha(0);
        this.tweens.add({ targets: o.spr, alpha: 1, duration: 200 });
    }
    // Un ocell de foc que xoca o s'esgota: s'apaga en una espurna
    apagarOcell(o) {
        if (o.mort) return;
        o.mort = true; o.spr.body.enable = false;
        Sfx.flama();
        this.impacte(o.spr.x, o.spr.y, { x: 0, y: -1 }, 0);
        this.tweens.add({ targets: o.spr, alpha: 0, scale: 0.05, duration: 220, onComplete: () => this.retirar(o) });
    }

    // ---------------- Música ----------------
    enMelodia(nom) {
        const d = (x, y) => Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, x, y);
        if (nom === 'pedres' && !Estat.flag('pontGabia') && d(GABIA.x, this.yPont) < 260) { this.aixecarPont(); return true; }
        if (nom === 'miracle' && d(this.gx, this.base + 60) < 300) {
            if (this.boss && !this.boss.mort) { this.missatge("L'Ocellaire xiula més fort que el cant."); return true; }
            if (Estat.flag('ocellaireVencut') && !Estat.flag('gabiaOberta')) { this.obrirGabia(); return true; }
        }
        return false;
    }

    aixecarPont() {
        Estat.posaFlag('pontGabia');
        Sfx.secret();
        this.cameras.main.shake(600, 0.004);
        this.blocs.forEach((b, i) => this.tweens.add({ targets: b, alpha: 1, scale: 1, delay: i * 400, duration: 700, ease: 'Back.easeOut' }));
        this.time.delayedCall(1300, () => { if (this.colPont) this.obstacles.remove(this.colPont, true, true); });
        this.missatge('Les pedres es desperten.');
        Estat.posaObjectiu('Creua el pont de pedra fins a la gàbia.');
        Estat.desar();
    }

    // ---------------- El combat final ----------------
    actualitzar() {
        // L'Ineu trepitja la plataforma: l'Andreu crida el seu Mestre
        if (!this.combatIniciat && Estat.flag('pontGabia') && !Estat.flag('ocellaireVencut') && this.ineu.y < GABIA.y + GABIA.platH / 2 - 30) {
            if (!Estat.flag('cantMiracle')) {                                         // sense el Cant del Miracle no es pot entrar al combat
                this.ineu.setY(GABIA.y + GABIA.platH / 2 - 10);
                if (this.time.now > (this.avisCant || 0)) { this.avisCant = this.time.now + 4000; this.missatge("Una força invisible no et deixa avançar: sense el Cant del Miracle els barrots de la gàbia no t'escoltaran. La Pianista, al Santuari, te l'ha d'ensenyar."); }
            } else this.iniciarCombatFinal();
        }
    }

    // Durant el combat final no es pot parlar amb ningú ni tocar la flauta
    sensePunts() { return !!this.bossActiu; }

    iniciarCombatFinal() {
        this.combatIniciat = true;
        this.bossActiu = true;
        const gx = this.gx, base = this.base, vist = Estat.flag('ocellaireVist');
        const ap = this.add.image(gx, base + 90, 'ocellaire').setAlpha(0).setDepth(base + 90);
        ap.setScale(this.textures.get('ocellaire').customData.escala || 1 / RES);
        this.npcs.ocellaire = ap;
        const cam = this.cameras.main, ui = this.ui();
        const pagines = [{ fer: (z, fet) => z.seq([
            f => { ui.franges(true); z.ineuVa(this.ineu.x, Math.max(this.ineu.y, base + 300), null, 160); cam.stopFollow(); cam.pan(gx, base + 60, 900, 'Sine.easeInOut'); z.esperar(950, f); },
            f => z.npcMira('germa_andreu', 'ineu', f),
            f => z.bombolla('germa_andreu', vist ? 'Una altra vegada?' : 'Mestre! Ja és aquí!', f, 1400),
            f => z.npcSalta('germa_andreu', f, 2),
            f => z.invocarOcellaire(ap, f),
            f => { Sfx.rugit(); cam.shake(900, 0.008); ui.titolBoss("L'OCELLAIRE", "L'Home de la Gàbia"); z.esperar(vist ? 1600 : 2600, f); },
            ...(vist ? [] : [
                f => z.bombolla('ocellaire', 'Un nen que riu...', f, 1500),
                f => z.bombolla('ocellaire', 'El teu riure també serà meu!', f, 1800)
            ]),
            f => { z.npcVa('germa_andreu', gx + 330, base + 40, null, 220); z.amagarAndreu(); cam.pan(this.ineu.x, this.ineu.y, 700, 'Sine.easeInOut', false, (cm, p) => { if (p === 1) { cam.startFollow(this.ineu, true, 0.12, 0.12); f(); } }); },
            f => { ui.franges(false); f(); }
        ], fet) }];
        this.ui().obrirDialeg({ pagines }, () => this.començarBoss(ap));
    }

    // L'Andreu fuig i s'amaga durant el combat (després torna)
    amagarAndreu() {
        const a = this.npcs.germa_andreu;
        if (!a) return;
        this.time.delayedCall(1100, () => this.tweens.add({ targets: [a, a.ombra].filter(Boolean), alpha: 0, duration: 500, onComplete: () => { if (this.bossActiu) { a.setVisible(false); if (a.ombra) a.ombra.setVisible(false); } } }));
    }
    mostrarAndreu() {
        const a = this.npcs.germa_andreu;
        if (!a) return;
        this.tweens.killTweensOf(a);
        a.setVisible(true).setAlpha(1); if (a.ombra) a.ombra.setVisible(true).setAlpha(a.ombra.alpha || 1);
    }

    // La boira baixa de la cúpula, s'arremolina i en surt l'Ocellaire
    invocarOcellaire(ap, fet) {
        Sfx.carrega();
        const p = this.add.particles(this.gx, this.base - this.gh, 'boira', {
            speedY: { min: 120, max: 260 }, speedX: { min: -40, max: 40 }, lifespan: 1300, scale: { start: 0.5, end: 1.4 },
            alpha: { start: 0.7, end: 0 }, tint: 0x9a50ff, frequency: 40
        }).setDepth(99000);
        this.cameras.main.shake(1200, 0.004);
        this.time.delayedCall(1100, () => {
            p.stop(); this.time.delayedCall(1400, () => p.destroy());
            this.boiraPuf(ap.x, ap.y - 60);
            this.cameras.main.flash(250, 160, 80, 255);
            this.tweens.add({ targets: ap, alpha: 1, duration: 500, onComplete: () => {
                ap.ulls = this.crearUlls(); this.posarUlls(ap.ulls, ap, 0);
                this.esperar(300, fet);
            } });
        });
    }

    començarBoss(ap) {
        Estat.posaFlag('ocellaireVist');
        const x = ap.x, y = ap.y;
        if (ap.ulls) ap.ulls.destroy();
        ap.destroy(); delete this.npcs.ocellaire;
        const e = this.enemic('ocellaire', x, y);
        if (!e) return;
        this.boss = e;
        this.crearBasto(e);
        e.ulls = this.crearUlls();
        // Els ulls segueixen el cap just després de la física (si no, anirien un fotograma enrere)
        this.events.on('postupdate', () => {
            if (e.ulls && e.ulls.active && e.spr.active) this.posarUlls(e.ulls, e.spr, e.spr.body.bottom + 1);
            // Un anell daurat marca el cap quan es pot colpejar (l'únic punt feble)
            if (e.diana && e.diana.active) {
                const q = this.puntsCop(e)[0], obert = !e.mort && !e.amagat && e.baixa > 0.6;
                e.diana.setVisible(obert).setPosition(q.x, q.y).setDepth(e.spr.body.bottom + 2).setAlpha(0.6 + 0.4 * Math.sin(this.time.now / 90));
            }
        });
        e.diana = this.add.circle(0, 0, 26).setStrokeStyle(3, 0xffe08a, 0.95).setVisible(false);
        this.ui().barraBoss("L'Ocellaire");
        Joc.iniciarMusica(this, 0, 'musica_boss');
        this.invulnerableFins = this.time.now + 1500;
        this.tambors(560);
        this.npcs.ocellaire = e.spr;
        this.missatge("Només el cap li fa mal: colpeja'l quan abaixi el cap.");
    }

    ocellaireDerrotat(e) {
        this.bossCaigut = e;
        const b = e.basto, c = e.spr.body.center, cam = this.cameras.main, ui = this.ui();
        if (this.tambor) { this.tambor.remove(); this.tambor = null; }
        Joc.aturarMusica(); Joc.jingle(this, 'jingle_boss');
        if (e.diana) { e.diana.destroy(); e.diana = null; }
        this.netejarRonda(e);
        ui.amagarBarraBoss();
        this.mostrarAndreu();
        // El cop final: el món gairebé s'atura, la càmera s'hi acosta i un flaix blanc ho esborra tot
        this.hitStop(450);
        cam.flash(700, 255, 255, 255);
        cam.zoomTo(cam.zoom * 1.3, 500, 'Sine.easeOut');
        Sfx.rugit();
        this.time.delayedCall(2600, () => cam.zoomTo(ZOOM_CAMERA, 900, 'Sine.easeInOut'));
        ui.franges(true);
        if (e.ulls) this.tweens.add({ targets: e.ulls, alpha: 0, duration: 2200, onComplete: () => e.ulls.destroy() });
        // Els ocells de foc s'apaguen tots alhora
        this.enemics.filter(o => o.tipus === 'ocellFoc' && !o.mort).forEach(o => this.apagarOcell(o));
        if (e.flama) { e.flama.destroy(); e.flama = null; }
        // El bàcul es parteix i cau
        this.tweens.killTweensOf(b);
        b.volant = true;
        this.tweens.add({ targets: b.g, y: c.y - 10, rotation: b.rot + 4, duration: 700, ease: 'Bounce.easeOut', onComplete: () => {
            Sfx.talla(); this.impacte(b.g.x, b.g.y, { x: 0, y: -1 }, 2);
            this.tweens.add({ targets: b.g, alpha: 0, duration: 900, delay: 500, onComplete: () => b.g.destroy() });
        } });
        this.tweens.add({ targets: e.spr, angle: { from: -6, to: 6 }, yoyo: true, repeat: 6, duration: 90 });
        this.ui().actualitzarHUD();
        this.time.delayedCall(900, () => this.ui().obrirDialeg({ pagines: [{ fer: (z, fet) => z.seq([
            f => z.bombolla('ocellaire', 'No... el meu riure...', f, 1600),
            // Es desfà en boira i la gàbia se l'empassa
            f => {
                Sfx.puf();
                const p = this.add.particles(e.spr.x, e.spr.y - 60, 'boira', { speed: { min: 30, max: 90 }, lifespan: 1200, scale: { start: 0.5, end: 1.3 }, alpha: { start: 0.7, end: 0 }, tint: 0x9a50ff, frequency: 50 }).setDepth(99000);
                this.tweens.add({ targets: [e.spr, e.ombra], alpha: 0, scaleY: e.escalaBase * 1.6, duration: 1400 });
                this.tweens.add({ targets: p, x: this.gx, y: this.base - this.gh * 0.5, duration: 1400, ease: 'Sine.easeIn', onComplete: () => {
                    p.stop(); this.time.delayedCall(1300, () => p.destroy());
                    this.retirar(e); delete this.npcs.ocellaire;
                    this.cameras.main.flash(300, 160, 80, 255);
                    this.ocellsBoira.forEach(o => { o.ev.remove(); this.tweens.add({ targets: o, alpha: 0, duration: 600, onComplete: () => o.destroy() }); });
                    f();
                } });
            },
            f => z.npcVa('germa_andreu', this.gx + 90, this.base + 60, f, 260),
            f => z.bombolla('germa_andreu', 'Mestre! No em deixeu!', f, 1500),
            f => z.ajupir('germa_andreu', f, 1500)
        ], fet) }] }, () => {
            ui.franges(false);
            this.bossActiu = false;
            this.tornarColorCova();
            Estat.posaFlag('ocellaireVencut');
            Estat.posaObjectiu("L'Ocellaire ha caigut. Toca el Cant del Miracle (1-3-2-3-1) davant la gàbia.");
            this.guardarPosicio();
            Estat.desar();
        }));
    }

    tornarColorCova() {
        this.velLila.setFillStyle(0x1a0a30, 0.22);
        this.llumLila.setFillStyle(0x9a50ff, 0.08);
    }

    // ---------------- L'alliberament ----------------
    // El Cant del Miracle: els barrots s'encenen, la gàbia s'aixeca i els capolls baixen fins a l'Ineu
    obrirGabia() {
        const gx = this.gx, base = this.base;
        Joc.iniciarMusica(this, 0, 'musica_epileg');
        this.ui().obrirDialeg({ pagines: [{ fer: (z, fet) => z.seq([
            f => {
                this.cameras.main.flash(500, 255, 230, 160);
                this.tweens.add({ targets: this.brillGabia, alpha: 1, duration: 600 });
                const ev = this.time.addEvent({ delay: 150, repeat: 14, callback: () => this.flotant(gx + Phaser.Math.Between(-150, 150), base - Phaser.Math.Between(60, 380), Phaser.Utils.Array.GetRandom(['♪', '♫', '♩']), '#ffe08a') });
                this.esperar(1400, f);
            },
            f => { z.npcVa('germa_andreu', gx + 320, base + 140, null, 300); z.bombolla('germa_andreu', '!', f, 700); },
            f => {
                Sfx.secret();
                this.cameras.main.shake(2200, 0.004);
                if (this.colGabia) { this.obstacles.remove(this.colGabia, true, true); this.colGabia = null; }
                this.tweens.add({ targets: this.gabiaGfx, y: -560, duration: 2400, ease: 'Sine.easeInOut' });
                this.tweens.add({ targets: this.brillGabia, alpha: 0, duration: 2400 });
                this.esperar(2500, f);
            },
            f => {
                // Els capolls queden lliures i baixen davant de l'Ineu
                this.capolls.forEach((c, i) => {
                    this.tweens.killTweensOf(c);
                    const n = NENS_GABIA[i], x = gx - 200 + i * 200, y = base + 160;
                    this.tweens.add({ targets: c, x, y: y - 40, duration: 1200, delay: i * 200, ease: 'Sine.easeInOut', onComplete: () => {
                        c.destroy();
                        this.crearCapoll(n, x, y);
                    } });
                });
                this.esperar(1900, f);
            }
        ], fet) }] }, () => {
            Estat.posaFlag('gabiaOberta');
            Estat.posaObjectiu('La gàbia és oberta! Trenca els tres capolls de boira amb Runna.');
            Estat.desar();
        });
    }

    // Runna trenca un capoll: el nen cau a terra, es desperta i riu
    capollTrencat(e) {
        const n = e.nen, x = e.spr.x, y = e.spr.y + 40;
        Estat.posaFlag(n.flag);
        this.tweens.add({ targets: e.spr, alpha: 0, scale: e.escalaBase * 1.6, duration: 300, onComplete: () => this.retirar(e) });
        e.ombra.setVisible(false);
        this.llum(x, y - 60, 0xffe8a0);
        const nen = this.posarNen(n, x, y);
        nen.setAlpha(0);
        this.tweens.add({ targets: [nen, nen.ombra], alpha: 1, duration: 400 });
        this.time.delayedCall(500, () => { Sfx.riure(); this.bombolla(n.key, 'Ha ha ha!', null, 1300); });
        Estat.desar();
        if (this.totsLliures()) this.time.delayedCall(2200, () => this.finalGabia());
    }

    // Els nens riuen, la boira es desfà i l'Andreu es queda amb el seu Mestre
    finalGabia() {
        if (this.finalEngegat) return;
        this.finalEngegat = true;
        const gx = this.gx, base = this.base;
        if (!this.npcs.germa_andreu) this.npc('germa_andreu', gx + 320, base + 140, DIALEGS.andreuGabia, { flipX: true });
        const nens = NENS_GABIA.map(n => n.key);
        this.ui().obrirDialeg({ pagines: [{ fer: (z, fet) => z.seq([
            f => {
                Sfx.riure();
                nens.forEach((k, i) => { z.npcSalta(k, null, 3); z.bombolla(k, ['Ha ha!', 'Ha ha ha!', 'Hi hi hi!'][i], null, 1400); });
                this.esperar(1500, f);
            },
            f => {
                // El riure desfà la boira: la cova s'aclareix
                this.cameras.main.flash(900, 255, 240, 200);
                this.boires.forEach(b => b.stop());
                this.tweens.add({ targets: this.velLila, alpha: 0.05, duration: 2000 });
                this.tweens.add({ targets: this.llumLila, alpha: 0.02, duration: 2000 });
                this.espurnes.stop();
                const llum = this.add.particles(gx, base, 'espurna', { speed: { min: 40, max: 160 }, lifespan: 1600, scale: { start: 0.4, end: 0 }, tint: [0xffe8a0, 0xffffff], blendMode: 'ADD', quantity: 40, emitting: false }).setDepth(99000);
                llum.explode(40);
                this.time.delayedCall(1800, () => llum.destroy());
                this.esperar(2000, f);
            },
            f => z.npcMira('germa_andreu', gx, f),
            f => z.bombolla('germa_andreu', 'El Mestre és aquí dins...', f, 1600),
            f => z.npcVa('germa_andreu', gx, base - 30, f, 120),
            f => z.bombolla('germa_andreu', 'Jo em quedo amb ell.', f, 1600),
            f => {
                // La gàbia baixa i el tanca
                this.tweens.add({ targets: this.gabiaGfx, y: 0, duration: 1600, ease: 'Quad.easeIn', onComplete: () => {
                    Sfx.porta(); this.cameras.main.shake(400, 0.012);
                    this.boiraPuf(gx, base);
                    this.esperar(900, f);
                } });
            },
            f => {
                nens.forEach((k, i) => z.npcVa(k, this.ineu.x - 90 + i * 90, this.ineu.y + 70, null, 200));
                this.esperar(1300, f);
            },
            f => { nens.forEach(k => z.bombolla(k, '❤', null, 1300)); this.esperar(1500, f); },
            f => { this.cameras.main.fadeOut(1200, 0, 0, 0); this.esperar(1300, f); }
        ], fet) }] }, () => {
            Estat.posaFlag('andreuTancat');
            Estat.posaFlag('epilegPendent');
            Estat.posaObjectiu('Els nens tornen a riure. Al Santuari us esperen tots.');
            Estat.dades.entrada = 'porta'; Estat.dades.x = null; Estat.dades.y = null;
            Estat.desar();
            this.canviant = true;
            this.scene.start('ZonaEsglesia', { entrada: 'porta' });
        });
    }
}
