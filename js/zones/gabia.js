/**
 * LES GÍRGOLES (a l'est del Celler): el camí fins a la Sala de la Gàbia
 *   Galeria de la Porta de Ferro --(porta de ferro: Clau de ferro)--> Sala de les Gírgoles --> Passadís de tortura --> Sala de la Gàbia
 * Puzles:
 *   Gírgoles: cova fosca i humida. Cinc mates de gírgoles lluminoses en rotllana: en tocar-ne una, s'encén o s'apaga ella i les
 *             dues veïnes. Quan les cinc brillen, la cortina de micel·li que tapa el túnel del nord es desfà.
 *   Tortura:  un rastell rovellat barra el pas: el torn només el giren els Guants de Poder. Més amunt, un mur d'esbarzers negres (Runna).
 *   Gàbia:    la gàbia penja al mig d'un avenc. Els blocs de pedra del pont dormen al fons: el Cant de Vespres els aixeca.
 *             Combat final contra l'Ocellaire (bàcul que gira i ocells de foc). Vençut, el Cant del Miracle aixeca la gàbia,
 *             Runna trenca els capolls dels nens i l'Aldreu s'hi queda tancat. Després, l'epíleg al Santuari.
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
        { qui: 'Ineu', text: "(Em caldrien unes mans molt més fortes: els guants dels picapedrers del Germà Francí.)" }
    ] },
    pontGabia: E => E.flag('pontGabia') ? { pagines: [] } : {
        pagines: [
            { qui: 'Inscripció', text: "Gravada a la pedra, una paraula antiga: PEDRES." },
            { qui: 'Ineu', text: E.flag('cantPedres')
                    ? "(Les pedres... L'ombra del monjo es va despertar amb el Cant de Vespres. Potser aquestes també: 5-4-3-1.)"
                    : "(Pedres que dormen. Hi deu haver un cant per despertar-les.)" }
        ]
    },
    gabiaGran: E => ({ pagines: E.flag('andreuTancat') ? [
    ] : E.flag('gabiaOberta') ? [
    ] : E.flag('ocellaireVencut') ? [
        { qui: 'Ineu', text: "(Ara. El Cant del Miracle: 1-2-2-2-3-1.)" }
    ] : [
        { qui: 'Ineu', text: "(Els barrots no tenen pany. Només un cant els pot obrir: el Cant del Miracle.)" }
    ] }),
    capoll: nom => E => ({ pagines: [] }),
    aldreuGabia: E => ({ pagines: E.flag('andreuTancat') ? [
        { qui: 'Germà Aldreu', text: "Estic bé, Ineu. La boira fa companyia quan ja no demana res." },
        { qui: 'Germà Aldreu', text: "Torna quan vulguis. Si mai se'm gira el cor, ja trobaré qui em pugui acompanyar..." }
    ] : E.flag('gabiaOberta') ? [
        { qui: 'Germà Aldreu', text: "Encara no, noi. Deixa'm sentir com riuen." }
    ] : E.flag('ocellaireVencut') ? [{ qui: 'Germà Aldreu', text: [
        "(No et mira.) Ja no em parla. Abans em parlava sempre.",
        "Fes el que has de fer, noi. Avui no et miraré.",
        "Quan era a la Plaça, tothom em passava pel costat. Ell em va veure."
    ][(DIALEGS._rotAldreu = ((DIALEGS._rotAldreu || 0) + 1) % 3)] }] : [
        { qui: 'Aldreu, Pastor de Boira', text: "El Mestre ve, monjo. Ja el sents?" }
    ] }),
    gentEpileg: E => ({ pagines: [{ qui: 'Gent', text: "Avui tothom canta, encara que l'orgue faci una nota de pega." }] }),
    nenGabia: nom => E => ({ pagines: [{ qui: nom, text: {
        Huri: "Ineu! Somiava que era un ocell dins d'una gàbia... i ara tinc unes ganes de riure!",
        Fram: "On és l'home dels ocells? L'has fet fugir tu? Ha ha ha! Quina cara que feia!",
        Sardi: "El pare deu estar amoïnat regant la prunera... Anem a casa, Ineu?"
    }[nom] }] })
});

// ---------------- LA SALA DE LES GÍRGOLES ----------------
const GIRG_CERCLE = { x: 700, y: 640, r: 280 };

class ZonaGirgoles extends ZonaBase {
    constructor() {
        super('ZonaGirgoles', {
            fosca: true,
            nom: 'Sala de les Gírgoles',
            amplada: 1400,
            alcada: 1300,
            colorFons: '#050806',
            entrades: { porta: { x: 700, y: 1200, dir: 'amunt' }, tortura: { x: 700, y: 230, dir: 'avall' } }
        });
    }

    construir() {
        const W = 1400, H = 1300;
        const resolt = Estat.flag('girgolesEnceses');
        this.terra('pedra', 0, 0, W, H, -1100).setTint(0x4a5a4a);

        // Fang, molsa humida, esquerdes, còdols i venes de micel·li al terra
        const fang = this.add.graphics().setDepth(-1050);
        let l = 5; const r = () => (l = l * 16807 % 2147483647) / 2147483647;
        for (let k = 0; k < 45; k++) {
            fang.fillStyle(k % 3 === 0 ? 0x1e3622 : 0x162216, 0.24 + r() * 0.22)
                .fillEllipse(100 + r() * 1200, 150 + r() * 1100, 40 + r() * 130, 16 + r() * 44);
        }
        // Esquerdes de la roca i pedruscall
        fang.lineStyle(1.5, 0x0e1610, 0.45);
        for (let k = 0; k < 22; k++) {
            const cx = 160 + r() * 1080, cy = 220 + r() * 980, a = r() * Math.PI;
            fang.lineBetween(cx, cy, cx + Math.cos(a) * (35 + r() * 55), cy + Math.sin(a) * (18 + r() * 30));
        }
        for (let k = 0; k < 55; k++) {
            const px = 130 + r() * 1140, py = 200 + r() * 1020, pr = 3 + r() * 5;
            fang.fillStyle(k % 2 ? 0x2c382c : 0x3d4a3d, 0.7).fillEllipse(px, py, pr * 2, pr * 1.2);
        }
        // Filaments de micel·li al terra que connecten les cinc mates en pentàgon i pugen cap a la cortina del nord
        fang.lineStyle(2, 0x7adbb0, 0.22);
        for (let i = 0; i < 5; i++) {
            const a0 = -Math.PI / 2 + i * Math.PI * 2 / 5, a1 = -Math.PI / 2 + ((i + 1) % 5) * Math.PI * 2 / 5;
            const x0 = GIRG_CERCLE.x + Math.cos(a0) * GIRG_CERCLE.r, y0 = GIRG_CERCLE.y + Math.sin(a0) * GIRG_CERCLE.r * 0.8;
            const x1 = GIRG_CERCLE.x + Math.cos(a1) * GIRG_CERCLE.r, y1 = GIRG_CERCLE.y + Math.sin(a1) * GIRG_CERCLE.r * 0.8;
            const mx = (x0 + x1) / 2 + (GIRG_CERCLE.x - (x0 + x1) / 2) * 0.18, my = (y0 + y1) / 2 + (GIRG_CERCLE.y - (y0 + y1) / 2) * 0.18;
            fang.beginPath(); fang.moveTo(x0, y0); fang.lineTo(mx, my); fang.lineTo(x1, y1); fang.strokePath();
        }
        fang.lineBetween(GIRG_CERCLE.x, GIRG_CERCLE.y - GIRG_CERCLE.r * 0.8, 700, 185);

        // Bassals detallats amb vorera de fang, reflexos d'aigua i còdols
        const bGfx = this.add.graphics().setDepth(-1041);
        this.bassals = [[420, 980, 175], [1000, 900, 210], [550, 420, 135], [950, 360, 150], [290, 640, 125], [1090, 670, 130], [690, 1050, 145]].map(([x, y, w]) => {
            const h = w * 0.36;
            bGfx.fillStyle(0x12201a, 0.55).fillEllipse(x, y + 2, w + 18, h + 10);
            bGfx.fillStyle(0x1b3848, 0.82).fillEllipse(x, y, w + 6, h + 3);
            const b = this.add.ellipse(x, y, w, h, 0x2a5266, 0.75).setDepth(-1040);
            this.add.ellipse(x - w * 0.06, y - h * 0.06, w * 0.68, h * 0.58, 0x3e748c, 0.38).setDepth(-1039);
            this.add.ellipse(x - w * 0.16, y - h * 0.12, w * 0.36, h * 0.2, 0xc8e8ff, 0.32).setDepth(-1039);
            this.add.ellipse(x + w * 0.18, y + h * 0.1, w * 0.18, h * 0.1, 0xc8e8ff, 0.2).setDepth(-1039);
            bGfx.lineStyle(1.5, 0x588ca0, 0.35).strokeEllipse(x, y, w, h);
            bGfx.fillStyle(0x3a4a44, 0.85).fillEllipse(x - w * 0.44, y + h * 0.22, 12, 7).fillEllipse(x + w * 0.42, y - h * 0.18, 9, 5);
            return b;
        });

        // Parets de cova amb estrats de roca, relleu i les seves col·lisions
        const cova = this.add.graphics().setDepth(-990);
        paretCova(cova, [{ x: 0, y: 0 }, { x: 640, y: 0 }, { x: 635, y: 135 }, { x: 565, y: 185 }, { x: 420, y: 168 }, { x: 300, y: 215 }, { x: 175, y: 205 }, { x: 120, y: 310 }, { x: 0, y: 330 }], 0x1a1814, 0x0e0c0a);
        paretCova(cova, [{ x: 760, y: 0 }, { x: W, y: 0 }, { x: W, y: 310 }, { x: 1290, y: 300 }, { x: 1240, y: 205 }, { x: 1095, y: 225 }, { x: 960, y: 165 }, { x: 835, y: 185 }, { x: 765, y: 135 }], 0x1a1814, 0x0e0c0a);
        paretCova(cova, [{ x: 0, y: 0 }, { x: 640, y: 0 }, { x: 630, y: 120 }, { x: 560, y: 170 }, { x: 420, y: 150 }, { x: 300, y: 200 }, { x: 170, y: 190 }, { x: 110, y: 300 }, { x: 0, y: 320 }], 0x2e2a22, 0x14120e);
        paretCova(cova, [{ x: 760, y: 0 }, { x: W, y: 0 }, { x: W, y: 300 }, { x: 1300, y: 290 }, { x: 1250, y: 190 }, { x: 1100, y: 210 }, { x: 960, y: 150 }, { x: 840, y: 170 }, { x: 770, y: 120 }], 0x2e2a22, 0x14120e);
        paretCova(cova, [{ x: 0, y: 320 }, { x: 110, y: 300 }, { x: 90, y: 600 }, { x: 130, y: 800 }, { x: 80, y: 1050 }, { x: 120, y: H }, { x: 0, y: H }], 0x2a2620, 0x14120e);
        paretCova(cova, [{ x: W, y: 300 }, { x: 1300, y: 290 }, { x: 1320, y: 560 }, { x: 1270, y: 820 }, { x: 1320, y: 1080 }, { x: 1280, y: H }, { x: W, y: H }], 0x2a2620, 0x14120e);
        // Facetes de roca i verdet humit a les parets
        cova.lineStyle(2, 0x3e3a30, 0.65);
        [[140, 120, 260, 145], [320, 95, 440, 115], [850, 110, 980, 100], [1060, 130, 1200, 115], [40, 480, 75, 560], [1335, 460, 1310, 540], [50, 860, 85, 940], [1320, 870, 1350, 960]]
            .forEach(([a, b, c, d]) => cova.lineBetween(a, b, c, d));

        // Estalactites de dos tons amb punta humida a la volta i a les vores
        const estalactita = (x, y0, amp, llarg) => {
            cova.fillStyle(0x26221b, 1).fillTriangle(x - amp, y0, x + amp, y0, x + 2, y0 + llarg);
            cova.fillStyle(0x3e382e, 1).fillTriangle(x - amp * 0.85, y0, x + amp * 0.1, y0, x, y0 + llarg * 0.88);
            cova.lineStyle(1.8, 0x12100c, 0.9).strokeTriangle(x - amp, y0, x + amp, y0, x + 2, y0 + llarg);
            cova.fillStyle(0x9ad8d0, 0.75).fillCircle(x + 2, y0 + llarg, 2.2);
        };
        for (let k = 0; k < 28; k++) {
            const x = 75 + k * 46 + r() * 18;
            if (x > 610 && x < 790) continue;
            const y0 = x < 160 || x > 1240 ? 185 + r() * 50 : 125 + r() * 45;
            estalactita(x, y0, 8 + r() * 9, 32 + r() * 62);
        }
        // Estalagmites de roca que s'alcen a les vores de la cova
        const estg = this.add.graphics().setDepth(360);
        [[145, 345, 1.1], [270, 235, 0.85], [1145, 240, 1.0], [1255, 345, 0.95], [135, 690, 0.9], [1265, 710, 1.0], [140, 1020, 0.85], [1255, 1030, 0.9]].forEach(([sx, sy, esc]) => {
            const w = 18 * esc, h = 54 * esc;
            estg.fillStyle(0x000000, 0.35).fillEllipse(sx, sy + 2, w * 2.4, 12 * esc);
            estg.fillStyle(0x2c2820, 1).fillTriangle(sx - w, sy, sx + w, sy, sx, sy - h);
            estg.fillStyle(0x464034, 1).fillTriangle(sx - w * 0.85, sy, sx + w * 0.1, sy, sx - 1, sy - h * 0.92);
            estg.lineStyle(2, 0x14120e, 1).strokeTriangle(sx - w, sy, sx + w, sy, sx, sy - h);
            estg.fillStyle(0x88c8b8, 0.5).fillCircle(sx, sy - h + 2, 2.5);
        });

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
        this.interactiu(1075, 1140, RADI_OBJECTE, DIALEGS.sacsGirgoles, { altura: 80 });
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

        // Inscripció dels monjos: pergamí gran sobre una llosa clavada a la paret, il·luminat per bolets de llum
        const PX = 470, PY = 228;
        const marcP = this.add.graphics().setDepth(248);
        marcP.fillStyle(0x000000, 0.4).fillRoundedRect(PX - 58, PY - 134, 116, 142, 8);
        marcP.fillStyle(0x3a3228, 1).fillRoundedRect(PX - 54, PY - 132, 108, 136, 6);
        marcP.lineStyle(2.5, 0x1a1410, 1).strokeRoundedRect(PX - 54, PY - 132, 108, 136, 6);
        girgoles(marcP, PX - 56, PY - 18, 3, 0xb8ffe0, 0x3a8868);
        girgoles(marcP, PX + 52, PY - 22, 3, 0xb8ffe0, 0x3a8868);
        const haloPerg = this.add.ellipse(PX, PY - 64, 150, 160, 0xffe8a8, 0.22).setDepth(249).setBlendMode('ADD');
        this.tweens.add({ targets: haloPerg, alpha: 0.1, yoyo: true, repeat: -1, duration: 1200 });
        this.posar('pergami_paret', PX, PY, { fonsY: 250, escala: 1.55 });
        this.interactiu(PX, PY + 28, RADI_GRAN, DIALEGS.girgolesInscripcio, { altura: 135 });

        // ---- El puzle: cinc mates de gírgoles lluminoses en rotllana ----
        this.mates = [];
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
            this.interactiu(x, y + 30, RADI_OBJECTE, () => null, { altura: 80, actiu: () => !Estat.flag('girgolesEnceses'), enTancar: () => this.tocarMata(i) });
            this.mates.push(m);
        }
        this.pintarMates();

        // La cortina de micel·li que tapa el túnel del nord
        this.cortina = this.add.graphics().setDepth(181);
        this.cortina.fillStyle(0xd8ecd8, 0.82).fillRect(640, 118, 120, 72);
        for (let k = 0; k < 16; k++) {
            const xk = 642 + k * 7.5;
            this.cortina.lineStyle(2.5, k % 2 ? 0xf0fff4 : 0xa8ccb0, 0.92).lineBetween(xk, 118, xk + ((k % 3) - 1) * 5, 192);
        }
        this.cortina.lineStyle(2, 0xd8ffe8, 0.65).lineBetween(640, 142, 760, 146).lineBetween(642, 168, 758, 164);
        if (resolt) this.cortina.setVisible(false);
        else {
            this.colCortina = this.colisio(700, 170, 120, 40);
            this.interactiu(700, 230, RADI_OBJECTE, DIALEGS.cortinaMicel, { altura: 90, actiu: () => !Estat.flag('girgolesEnceses') });
        }

        // Ratpenats de boira que pengen de la volta
        [[420, 520], [980, 560], [360, 900], [1020, 980]].forEach(([x, y]) => { const e = this.enemic('ratpenat', x, y); if (e) e.estat = 'penja'; });

        this.foscor = crearFoscor(this, W, H);
        // La sortida del nord (i les seves llumetes) només s'activa quan el puzle de les gírgoles ja és resolt
        if (resolt) this.sortida(656, 130, 88, 24, 'ZonaTortura', 'girgoles');
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
        this.sortida(656, 130, 88, 24, 'ZonaTortura', 'girgoles');
        this.ineuDiu('Les gírgoles canten: el micel·li es desfà!');
        Estat.posaObjectiu('Segueix pel túnel del nord de la Sala de les Gírgoles.');
        Estat.desar();
    }

    so(n) {
        const ctx = this.sound && this.sound.context;
        if (!ctx) return;
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = 260 + n * 70;
        g.gain.setValueAtTime(0.0001, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
        o.connect(g); g.connect(Sfx.connect(ctx)); o.start(); o.stop(ctx.currentTime + 0.75);
    }

    actualitzar() {
        const t = this.time.now, resolt = Estat.flag('girgolesEnceses');
        const llums = [
            [this.ineu.x, this.ineu.y - 40, Estat.te('llanterna') ? 450 : 330],
            [470, 190, 210]
        ];
        this.mates.forEach(m => { if (m.on) llums.push([m.x, m.y - 20, 200 * (1 + 0.05 * Math.sin(t / 300 + m.i))]); });
        if (resolt) llums.push([700, 640, 520]);
        this.bassals.forEach(b => llums.push([b.x, b.y, 65]));
        this.foscor.pintar(resolt ? 0.3 : 0.72, llums);
    }
}

// ---------------- EL PASSADÍS DE TORTURA ----------------
class ZonaTortura extends ZonaBase {
    constructor() {
        super('ZonaTortura', {
            fosca: true,
            nom: 'Passadís de tortura',
            amplada: 900,
            alcada: 1900,
            colorFons: '#0a0606',
            entrades: { girgoles: { x: 450, y: 1800, dir: 'amunt' }, gabia: { x: 450, y: 220, dir: 'avall' } }
        });
    }

    construir() {
        const W = 900, H = 1900;
        this.terra('pedra', 200, 0, 500, H, -1100).setTint(0x9a8a86);        // més clara: les ferralles i els esbarzers hi contrasten
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
        this.colisio(295, 60, 190, 120);                                              // paret nord esquerra
        this.colisio(605, 60, 190, 120);                                              // paret nord dreta
        this.colisio(450, 45, 120, 90);                                               // dintell sobre l'obertura del nord
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

        // ---- Rastell rovellat amb el torn (Guants de Poder) ----
        const YR = 1180;
        this.rastell = this.add.graphics().setDepth(YR);
        this.rastell.fillStyle(0x2a2420, 1).fillRect(240, YR - 150, 420, 14);
        this.rastell.lineStyle(7, 0x5a4a40, 1);
        for (let x = 254; x <= 646; x += 28) { this.rastell.lineBetween(x, YR - 140, x, YR); this.rastell.fillStyle(0x5a4a40, 1).fillTriangle(x - 5, YR, x + 5, YR, x, YR + 14); }
        this.rastell.lineStyle(5, 0x4a3e36, 1).lineBetween(240, YR - 90, 660, YR - 90).lineBetween(240, YR - 40, 660, YR - 40);
        // El torn: un bastidor de fusta amb un tambor on s'enrotlla la corda del rastell i una maneta de ferro
        const torn = this.add.graphics().setDepth(YR + 60);
        torn.lineStyle(3, 0xc8b890, 1).lineBetween(662, YR + 14, 662, YR - 150);                                        // la corda, fins al rastell
        torn.fillStyle(0x000000, 0.35).fillEllipse(662, YR + 62, 76, 16);
        torn.fillStyle(0x6a4424, 1).fillRect(628, YR + 6, 10, 54).fillRect(686, YR + 6, 10, 54).lineStyle(2, 0x1a0c04, 1).strokeRect(628, YR + 6, 10, 54).strokeRect(686, YR + 6, 10, 54);
        torn.fillStyle(0x9a7040, 1).fillRoundedRect(636, YR + 10, 52, 30, 8).lineStyle(2.5, 0x1a0c04, 1).strokeRoundedRect(636, YR + 10, 52, 30, 8);   // tambor
        torn.fillStyle(0xc8b890, 1); for (let k = 0; k < 5; k++) torn.fillRect(642 + k * 9, YR + 12, 4, 26);                            // voltes de corda
        torn.fillStyle(0x4a4a52, 1).fillCircle(700, YR + 25, 7).lineStyle(2, 0x111114, 1).strokeCircle(700, YR + 25, 7);
        torn.lineStyle(6, 0x111114, 1).lineBetween(700, YR + 25, 716, YR + 2).lineStyle(4, 0x8a8a94, 1).lineBetween(700, YR + 25, 716, YR + 2);    // maneta
        torn.fillStyle(0x7a4a24, 1).fillRoundedRect(711, YR - 8, 12, 14, 3).lineStyle(2, 0x1a0c04, 1).strokeRoundedRect(711, YR - 8, 12, 14, 3);
        const llumTorn = this.add.circle(670, YR + 26, 60, 0xffb060, 0.12).setDepth(YR + 59).setBlendMode('ADD');
        if (!Estat.flag('rastellObert')) this.tweens.add({ targets: llumTorn, alpha: 0.04, yoyo: true, repeat: -1, duration: 1100 });
        else llumTorn.setVisible(false);
        this.colTorn = this.colisio(662, YR + 52, 72, 20);
        if (Estat.flag('rastellObert')) this.rastell.y = -150;
        else {
            this.colRastell = this.colisio(450, YR - 10, 420, 30);
            this.interactiu(650, YR + 92, RADI_OBJECTE, DIALEGS.tornRastell, { altura: 110, actiu: () => !Estat.flag('rastellObert'), enTancar: () => { if (Estat.te('guants')) this.alcarRastell(); } });
        }

        // Roda i eines (tram 2)
        const rd = this.add.graphics().setDepth(900);
        rd.lineStyle(10, 0x4a3020, 1).strokeCircle(300, 850, 60);
        for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; rd.lineStyle(5, 0x4a3020, 1).lineBetween(300, 850, 300 + Math.cos(a) * 60, 850 + Math.sin(a) * 60); }
        rd.fillStyle(0x2a2a2e, 1).fillCircle(300, 850, 10).fillRect(296, 850, 8, 60);
        this.colisio(300, 900, 120, 26);
        // ---- Mur d'esbarzers negres al darrer tram (cal Runna) ----
        [270, 360, 450, 540, 630].forEach((x, i) => {
            const o = this.esbarzer(x, 420, 'tortura' + i);
            if (!o) return;
            o.img.setTint(0xc8a0ff);
            o.halo = this.add.ellipse(x, 402, 110, 70, 0xb070ff, 0.5).setDepth(419).setBlendMode('ADD');
            this.tweens.add({ targets: o.halo, alpha: 0.1, yoyo: true, repeat: -1, duration: 900 + i * 110 });
        });

        // Boira lila que baixa de la Sala de la Gàbia
        this.boira(450, 200, 260, 60, 1.2);
        this.boira(450, 700, 200, 40, 0.4);
        this.add.rectangle(AMPLE / 2, (ALT - ALT_HUD) / 2, AMPLE / ZOOM_CAMERA + 4, (ALT - ALT_HUD) / ZOOM_CAMERA + 4, 0x1a0a20, 0.1).setScrollFactor(0).setDepth(90000);

        // Gàbies vives: pengen del sostre i, quan passes, deixen anar un ocell de boira
        [[560, 1430], [340, 1300], [580, 800], [330, 660]].forEach(([x, y]) => this.enemic('gabiaViva', x, y));

        this.sortida(398, 94, 104, 16, 'ZonaBoira', 'tortura');
        this.sortida(410, H - 22, 80, 14, 'ZonaGirgoles', 'tortura');
    }

    // En entrar, l'objectiu diu què toca fer al passadís (el rastell, i després els esbarzers)
    enEntrar() {
        if (!Estat.flag('torturaNet')) Estat.posaObjectiu(PROGRES.pista(Estat));
    }

    alcarRastell() {
        if (Estat.flag('rastellObert')) return;
        Estat.posaFlag('rastellObert');
        if (this.colRastell) this.obstacles.remove(this.colRastell, true, true);
        Estat.posaObjectiu(PROGRES.pista(Estat));
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

// ---------------- LA GALERIA DE LA BOIRA VERINOSA ----------------
// Entre el passadís de tortura i la Sala de la Gàbia: una galeria llarga, mig enfonsada, plena d'una boira verda i lila que crema.
// Només l'Empara Fraternal de les tres sacerdotesses la dissipa; sense, l'Ineu no hi pot entrar.
const BOIRA_V = { y0: 360, y1: 940 };
class ZonaBoira extends ZonaBase {
    constructor() {
        super('ZonaBoira', {
            fosca: true,
            nom: 'Galeria de la boira',
            amplada: 900,
            alcada: 1400,
            colorFons: '#070608',
            entrades: { tortura: { x: 450, y: 1300, dir: 'amunt' }, gabia: { x: 450, y: 220, dir: 'avall' } }
        });
    }

    construir() {
        const W = 900, H = 1400, B = BOIRA_V;
        this.terra('pedra', 200, 0, 500, H, -1100).setTint(0x7a8478);
        const m = this.add.graphics().setDepth(-990);
        m.fillStyle(0x141816, 1).fillRect(0, 0, 200, H).fillRect(700, 0, 200, H);
        m.fillStyle(0x2c3430, 1).fillRect(170, 0, 30, H).fillRect(700, 0, 30, H);
        m.lineStyle(1.5, 0x0c100e, 0.8);
        for (let y = 0; y < H; y += 30) { m.lineBetween(170, y, 200, y); m.lineBetween(700, y, 730, y); }
        m.fillStyle(0x070608, 1).fillRect(200, 0, 500, 120);
        // Esquerdes del terra per on puja la boira, i ossos d'ocell escampats
        m.lineStyle(3, 0x2a3a28, 0.9);
        [[300, 520, 380, 600], [520, 700, 600, 640], [380, 820, 440, 900], [560, 450, 500, 520]].forEach(([a, b, c, d]) => m.lineBetween(a, b, c, d));
        m.fillStyle(0xd8d0c0, 0.5);
        [[260, 1100], [620, 1180], [330, 300], [600, 260]].forEach(([x, y]) => m.fillEllipse(x, y, 14, 4).fillEllipse(x + 8, y + 4, 10, 3));
        [[700, 760], [200, 760]].forEach(([x, y]) => { m.fillStyle(0x2c3430, 1).fillRect(x - (x > 400 ? 0 : 40), y - 30, 40, 40); });
        m.lineStyle(14, 0x2c3430, 1).beginPath(); m.arc(450, 1100 + 140, 250, Math.PI * 1.18, Math.PI * 1.82); m.strokePath();
        this.colisio(100, H / 2, 200, H);
        this.colisio(800, H / 2, 200, H);
        this.colisio(295, 60, 190, 120);                                              // paret nord esquerra
        this.colisio(605, 60, 190, 120);                                              // paret nord dreta
        this.colisio(450, 45, 120, 90);                                               // dintell sobre l'obertura del nord
        this.colisio(270, H - 10, 140, 20);
        this.colisio(630, H - 10, 140, 20);
        // Torxes a l'entrada, que la boira apaga més amunt
        [[215, 1180], [685, 1180], [215, 240], [685, 240]].forEach(([x, y], i) => {
            const t = this.add.graphics().setDepth(y);
            t.fillStyle(0x3a2a1a, 1).fillRect(x - 4, y - 10, 8, 30).fillStyle(0x2a2a2e, 1).fillRect(x - 8, y - 14, 16, 6);
            const fl = this.add.ellipse(x, y - 24, 14, 24, 0xffa040, 1).setDepth(y + 1);
            const ll = this.add.container(x, y - 20).setDepth(y + 2);
            [[90, 0.05], [55, 0.07], [28, 0.1]].forEach(([rr, a]) => ll.add(this.add.circle(0, 0, rr, 0xff9040, a).setBlendMode('ADD')));
            this.tweens.add({ targets: [fl, ll], scaleY: 1.15, alpha: 0.75, yoyo: true, repeat: -1, duration: 170 + i * 29 });
        });

        // La boira verinosa: capes de boira verda i lila que es mouen i fumegen per les esquerdes
        this.boiraV = [];
        const obert = Estat.flag('boiraVerinosaOberta');
        if (!obert) {
            if (!this.textures.exists('boira_suau')) {                 // una taca rodona i difuminada, per tenyir
                const c = this.textures.createCanvas('boira_suau', 256, 256), ctx = c.getContext();
                const gr = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
                gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.fillStyle = gr; ctx.fillRect(0, 0, 256, 256); c.refresh();
            }
            for (let k = 0; k < 14; k++) {
                const y = B.y0 + (B.y1 - B.y0) * (k / 13), x = 280 + ((k * 137) % 340);
                const e = this.add.image(x, y, 'boira_suau').setTint(k % 2 ? 0x7ab050 : 0x8a58c0).setAlpha(0.42).setDepth(90010);     // per sobre de la foscor
                e.setScale((300 + (k % 3) * 80) / e.width, (140 + (k % 4) * 30) / e.height);
                this.tweens.add({ targets: e, x: x + (k % 2 ? 60 : -60), scaleX: e.scaleX * 1.15, alpha: 0.26, yoyo: true, repeat: -1, duration: 2600 + k * 170, ease: 'Sine.easeInOut' });
                this.boiraV.push(e);
            }
            // Fumeroles que pugen de les esquerdes del terra, verdes i liles
            [[340, 560], [560, 670], [410, 860], [530, 480], [300, 760], [600, 860]].forEach(([x, y], i) => {
                const pr = this.add.particles(x, y, 'boira_suau', {
                    x: { min: -40, max: 40 }, speedY: { min: -38, max: -14 }, speedX: { min: -10, max: 10 },
                    scale: { start: 0.25, end: 1.1 }, alpha: { start: 0.45, end: 0 }, lifespan: { min: 2600, max: 4200 },
                    tint: i % 2 ? [0x9ad070, 0x7ab050] : [0xb080e0, 0x8a58c0], frequency: 220
                }).setDepth(90011);
                this.boiraV.push(pr);
            });
            // Bombolles verinoses que creixen a les esquerdes i esclaten
            this.bombollesV = this.time.addEvent({ delay: 380, loop: true, callback: () => {
                const x = 260 + Math.random() * 380, y = B.y0 + 40 + Math.random() * (B.y1 - B.y0 - 40);
                const b = this.add.circle(x, y, 4, 0xb8f080, 0.8).setStrokeStyle(1.5, 0xe0ffc0, 0.9).setDepth(90012);
                this.tweens.add({ targets: b, scale: 2.6, y: y - 8, duration: 700 + Math.random() * 500, ease: 'Sine.easeOut', onComplete: () => {
                    this.tweens.add({ targets: b, scale: 3.4, alpha: 0, duration: 140, onComplete: () => b.destroy() });
                } });
            } });
            // Un vel verdós a ras de terra, que fa la zona més densa
            const vel = this.add.image(450, (B.y0 + B.y1) / 2, 'boira_suau').setTint(0x5a8a3a).setAlpha(0.35).setDepth(90009);
            vel.setScale(620 / vel.width, (B.y1 - B.y0 + 200) / vel.height);
            this.tweens.add({ targets: vel, alpha: 0.22, yoyo: true, repeat: -1, duration: 3000, ease: 'Sine.easeInOut' });
            this.boiraV.push(vel);
            this.colBoira = this.colisio(450, B.y1 + 40, 500, 20);
        }
        this.boira(450, 180, 260, 60, 0.8);                    // la boira lila de la Sala de la Gàbia, que baixa per dalt

        this.sortida(398, 94, 104, 16, 'ZonaGabia', 'tortura');
        this.sortida(410, H - 22, 80, 14, 'ZonaTortura', 'gabia');
    }

    enEntrar() {
        if (!Estat.flag('boiraVerinosaOberta')) Estat.posaObjectiu(Estat.te('benedicio_fraterna')
            ? "L'Empara Fraternal et protegeix: travessa la boira verinosa fins a la Sala de la Gàbia."
            : PROGRES.pista(Estat));
    }

    actualitzar() {
        if (Estat.flag('boiraVerinosaOberta') || this.canviant) return;
        if (this.ineu.y > BOIRA_V.y1 + 110) return;
        if (Estat.te('benedicio_fraterna')) { this.obrirBoira(); return; }
        // Sense la Benedicció, la boira crema: l'Ineu tus i es fa enrere
        this.ineu.body.setVelocity(0, 260);
        this.forcat = { vx: 0, vy: 420, fins: this.time.now + 260 };
        if (this.time.now > (this.avisBoira || 0)) {
            this.avisBoira = this.time.now + 5000;
            Sfx.puf();
            this.ui().obrirDialeg({ pagines: [{ qui: 'Ineu', text: "(Aquesta boira crema la gola... Sense l'Empara Fraternal de les sacerdotesses de l'Hostatgeria no la podré travessar.)" }] });
        }
    }

    // L'Empara Fraternal s'encén al voltant de l'Ineu i la boira s'aparta i s'esvaeix
    obrirBoira() {
        Estat.posaFlag('boiraVerinosaOberta');
        const I = this.ineu;
        I.body.setVelocity(0);
        Sfx.secret();
        this.cameras.main.flash(500, 255, 240, 200);
        const aura = this.add.circle(I.x, I.y - 50, 40, 0xffe8a0, 0.5).setBlendMode('ADD').setDepth(99000);
        this.tweens.add({ targets: aura, radius: 420, alpha: 0, duration: 1800, ease: 'Cubic.out', onComplete: () => aura.destroy() });
        if (this.bombollesV) { this.bombollesV.remove(); this.bombollesV = null; }
        this.boiraV.forEach(o => {
            this.tweens.killTweensOf(o);
            if (o.stop) { o.stop(); this.time.delayedCall(4500, () => o.destroy()); }
            else this.tweens.add({ targets: o, alpha: 0, scaleX: 1.6, scaleY: 1.4, duration: 2200, delay: Math.random() * 500, onComplete: () => o.destroy() });
        });
        if (this.colBoira) { this.obstacles.remove(this.colBoira, true, true); this.colBoira = null; }
        Estat.posaObjectiu("La boira s'ha esvaït. Més amunt, la Sala de la Gàbia.");
        Estat.desar();
    }
}

// ---------------- LA SALA DE LA GÀBIA ----------------
// La gàbia és al fons d'una plataforma gran voltada per un avenc. Al davant hi ha l'espai del combat final.
// Frases flotants (sobreimpressions) durant el combat: apagades a petició (desconcentren)
const FRASES_FLOTANTS_COMBAT = false;
const GABIA = { x: 900, y: 800, platW: 1100, platH: 840, avenc: 130 };
const NENS_GABIA = [
    { id: 'Huri', key: 'nen_uri', nom: "l'Huri", flag: 'rescatUri', dx: -80 },
    { id: 'Fram', key: 'nen_flam', nom: 'el Fram', flag: 'rescatFlam', dx: 0 },
    { id: 'Sardi', key: 'nen_sardin', nom: 'el Sardi', flag: 'rescatSardin', dx: 80 }
];

class ZonaGabia extends ZonaBase {
    constructor() {
        super('ZonaGabia', {
            nom: 'Sala de la Gàbia',
            amplada: 1800,
            alcada: 1840,
            colorFons: '#06040a',
            reneix: 'tortura',            // si l'Ineu cau al combat final, torna a l'entrada de la sala
            entrades: { tortura: { x: 900, y: 1740, dir: 'amunt' } }
        });
    }

    construir() {
        // L'escena es reaprofita a cada visita: si l'Ineu va caure lluitant, el combat ha de tornar a començar de zero
        this.combatIniciat = false; this.bossActiu = false; this.boss = null; this.bossCaigut = null; this.finalEngegat = false;
        this.tambor = null; this.avisCant = 0; this.anellsAvis = []; this.focs = []; this.colCombatPont = null;
        const W = 1800, H = 1840, G = GABIA;
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
        for (let k = 0; k < 150; k++) pl.fillStyle(rr() < 0.5 ? 0x3a3448 : 0x26202e, 1).fillRoundedRect(x0 + 20 + rr() * (G.platW - 80), y0 + 20 + rr() * (G.platH - 60), 40 + rr() * 30, 26 + rr() * 16, 6);
        pl.lineStyle(2, 0x14101a, 0.8);
        for (let k = 0; k < 20; k++) { const cx = x0 + 40 + rr() * (G.platW - 80), cy = y0 + 30 + rr() * (G.platH - 60); pl.lineBetween(cx, cy, cx + 20 + rr() * 30, cy + 10 + rr() * 20); }
        pl.lineStyle(3, 0x9a50ff, 0.35).strokeRoundedRect(x0 - 6, y0 - 6, G.platW + 12, G.platH + 12, 44);
        this.fixar([av], x0 - A - 30, y0 - A - 30, G.platW + 2 * A + 60, G.platH + 2 * A + 60);           // (dibuixos fixos: una sola imatge)
        this.fixar([pl], x0 - 10, y0 - 10, G.platW + 20, G.platH + 20);
        // Col·lisions de l'avenc (quatre franges) amb un buit a baix per al pont
        const bx = G.x, bw = 120;
        this.colisio(G.x, y0 - A / 2, G.platW + 2 * A, A);
        this.colisio(x0 - A / 2, G.y, A, G.platH + 2 * A);
        this.colisio(x1 + A / 2, G.y, A, G.platH + 2 * A);
        this.colisio((x0 - A + bx - bw / 2) / 2, y1 + A / 2, bx - bw / 2 - (x0 - A), A);
        this.colisio((bx + bw / 2 + x1 + A) / 2, y1 + A / 2, x1 + A - (bx + bw / 2), A);
        this.limits = { x0: x0 + 70, x1: x1 - 70, y0: y0 + 90, y1: y1 - 45 };

        // El pont: blocs de pedra que dormen al fons i el Cant de Vespres aixeca
        this.blocs = [];
        for (let k = 0; k < 3; k++) {
            const b = this.blocPont(bx, y1 + 20 + k * 38, bw - 6, 34);              // (js/zones/gabia_decor.js)
            this.blocs.push(b);
        }
        if (Estat.flag('pontGabia')) this.blocs.forEach(b => b.setAlpha(1).setScale(1));
        else {
            this.blocs.forEach(b => b.setAlpha(0.25).setScale(0.6));
            this.colPont = this.colisio(bx, y1 + A / 2, bw, A);
        }
        this.yPont = y1 + A + 60;
        // Radi ampli i sense haver de mirar-lo: la icona es manté mentre s'és davant del pont (abans només sortia en un punt molt concret i desapareixia en seguir caminant)
        this.interactiu(bx, this.yPont, 340, DIALEGS.pontGabia, { altura: 90, senseMirada: true, actiu: () => !Estat.flag('pontGabia'), enTancar: () => Estat.posaFlag('flauta_pont') });
        this.llocFlauta('pont', bx, this.yPont, 300, true, () => !Estat.flag('pontGabia'), false, ['pedres']);

        // ---- La gàbia gegant, al fons de la plataforma ----
        const gx = G.x, base = y0 + 260, gw = 300, gh = 420;
        this.gx = gx; this.base = base; this.gh = gh;
        const oberta = Estat.flag('gabiaOberta') && !Estat.flag('andreuTancat');
        const dy = oberta ? -560 : 0;                                                 // oberta: penja enlaire, sobre la cova
        const { gb, gbPost, brill } = this.dibuixarGabia(gx, base, gw, gh, dy);      // (js/zones/gabia_decor.js)
        this.brillGabia = brill;
        this.gabiaGfx = [gb, gbPost, this.brillGabia].filter(Boolean);
        if (!oberta) this.colGabia = this.colisio(gx, base - 10, gw + 10, 50);
        this.interactiu(gx, base + 60, 160, DIALEGS.gabiaGran, { altura: 260, actiu: () => !Estat.flag('gabiaOberta'), enTancar: () => Estat.posaFlag('flauta_gabia') });
        this.llocFlauta('gabia', gx, base + 60, 260, true, () => !Estat.flag('gabiaOberta'), false, ['miracle']);

        // Els tres capolls de boira (els nens), dins la gàbia mentre no s'obre
        this.capolls = [];
        if (!Estat.flag('gabiaOberta')) NENS_GABIA.forEach((n, i) => {
            const y = base - 150 - (i % 2) * 30;
            const c = this.add.image(gx + n.dx, y, 'capoll').setDepth(base - 20);
            c.setScale(this.textures.get('capoll').customData.escala || 1 / RES);
            this.tweens.add({ targets: c, y: y - 10, yoyo: true, repeat: -1, duration: 1500 + i * 300, ease: 'Sine.easeInOut' });
            this.capolls.push(c);
        });
        if (!Estat.flag('gabiaOberta')) {
            // La llum lila que fan els capolls a dins de la gàbia, i unes espurnes que hi suren
            this.llumCapolls = this.halo(gx, base - 160, 360, 380, 0xb88aff, 0.5, base - 21);
            this.tweens.add({ targets: this.llumCapolls, alpha: 0.28, yoyo: true, repeat: -1, duration: 1400, ease: 'Sine.easeInOut' });
            this.espurnesCapolls = this.add.particles(gx, base - 160, 'espurna', {
                emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(-120, -110, 240, 220) },
                speedY: { min: -26, max: -8 }, lifespan: 1800, scale: { start: 0.18, end: 0 }, alpha: { start: 0.9, end: 0 },
                tint: [0xe0c8ff, 0xffffff], blendMode: 'ADD', frequency: 140
            }).setDepth(base - 19);
        }
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

        // El Germà Aldreu: abans del combat no és visible (apareix de cop quan l'Ineu entra a la plataforma);
        // un cop vençut el Mestre, queda com a Germà Aldreu, i al final resta tancat dins la gàbia.
        if (Estat.flag('andreuTancat')) this.npc('germa_aldreu', gx, base + 10, DIALEGS.aldreuGabia);
        else if (!Estat.flag('gabiaOberta')) {
            if (Estat.flag('ocellaireVencut')) this.npc('germa_aldreu', gx + 230, base + 60, DIALEGS.aldreuGabia, { flipX: true });
            else {
                const a = this.npcs.germa_aldreu = this.npc('aldreu_guardia', gx + 230, base + 60, DIALEGS.aldreuGabia, { flipX: true });
                a.setVisible(false).setAlpha(0);
                if (a.ombra) a.ombra.setVisible(false).setAlpha(0);
                if (a.col) a.col.body.enable = false;
                if (a.punt) a.punt.actiu = () => false;
            }
        }
        if (Estat.flag('andreuTancat')) { const a = this.npcs.germa_aldreu; a.punt.x = gx; a.punt.y = base + 60; a.setDepth(base - 15); }

        // Columnes de la cova i el sostre
        const cv = this.add.graphics().setDepth(-990);
        cv.fillStyle(0x1a1424, 1).fillRect(0, 0, W, 120);
        for (let k = 0; k < 18; k++) cv.fillStyle(0x2a2234, 1).fillTriangle(k * 100, 120, k * 100 + 50, 120, k * 100 + 25, 170 + (k % 3) * 20);
        [[135, 820], [1665, 820], [135, 1480], [1665, 1480]].forEach(([x, y]) => this.columnaCova(x, y));
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
        this.velLila = this.add.rectangle(AMPLE / 2, (ALT - ALT_HUD) / 2, AMPLE / ZOOM_CAMERA + 4, (ALT - ALT_HUD) / ZOOM_CAMERA + 4, 0x1a0a30, net ? 0.06 : 0.22).setScrollFactor(0).setDepth(90000);

        this.decorarSala();                                                           // (js/zones/gabia_decor.js)
        this.sortida(860, H - 22, 80, 14, 'ZonaBoira', 'gabia');

        // Capolls que encara no s'han trencat, si la gàbia ja és oberta (s'havia sortit a mig alliberament)
        if (Estat.flag('gabiaOberta')) NENS_GABIA.forEach((n, i) => { if (!Estat.flag(n.flag)) this.crearCapoll(n, gx - 200 + i * 200, base + 160); });
        // Tots alliberats però l'Aldreu encara no s'ha tancat: es reprèn el final
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

    // El bàcul de l'Ocellaire: la imatge (assets/armes/basto_ocellaire.webp) té els ganxos daurats; les flames de les puntes, quan gira de pressa, són partícules.
    crearBasto(e) {
        let g;
        if (this.textures.exists('basto_ocellaire') && !Grafics.faltants.includes('basto_ocellaire')) {
            g = this.add.image(0, 0, 'basto_ocellaire');
            g.setDisplaySize(184 * K_OCELLAIRE, 184 * K_OCELLAIRE * g.height / g.width);                    // de punta a punta, ±92 x K (on surten les flames)
        } else {
            g = this.add.graphics();
            g.fillStyle(0x2a1a14, 1).fillRoundedRect(-80, -5, 160, 10, 4);
            g.lineStyle(2, 0x0a0606, 1).strokeRoundedRect(-80, -5, 160, 10, 4);
            g.fillStyle(0xb89a50, 1).fillRect(-14, -7, 28, 14);
            g.lineStyle(6, 0xd8b860, 1); g.beginPath(); g.arc(-92, -10, 14, 0.2, Math.PI * 1.6); g.strokePath();
            g.lineStyle(6, 0xd8b860, 1); g.beginPath(); g.arc(92, 10, 14, Math.PI + 0.2, Math.PI * 2.6); g.strokePath();
            g.fillStyle(0xff9a40, 0.9).fillCircle(-92, -10, 7).fillCircle(92, 10, 7);
            g.fillStyle(0xffffff, 0.9).fillCircle(-92, -10, 3).fillCircle(92, 10, 3);
            g.setScale(K_OCELLAIRE);
        }
        const b = { g, x: e.spr.x, y: e.spr.y - 70 * K_OCELLAIRE, rot: 0, gir: 0.04, volant: false, lliure: false };
        e.basto = b;
        // Comptadors per intent (la mateixa escena pot reiniciar el combat)
        this.rebotsFora = 0; this.pensamentsFets = 0; this.ultimPensament = 0; this.tamborsCallats = false;
        e.flama = this.add.particles(0, 0, 'espurna', {
            speed: { min: 10, max: 60 }, lifespan: 420, scale: { start: 0.35, end: 0 }, alpha: { start: 0.9, end: 0 },
            tint: [0xff9a40, 0xffd060, 0xff5020], blendMode: 'ADD', frequency: 40, emitting: false
        }).setDepth(99980);
        return b;
    }
    moureBasto(e) {
        const b = e.basto, c = e.spr.body.center;
        if (!b) return;
        const K = K_OCELLAIRE;
        if (b.lliure) {          // a la pausa el bàcul és a terra (tween des de genollsOcellaire): ni segueix la mà ni gira
            b.g.setPosition(b.x, b.y).setRotation(b.rot).setDepth(b.depth || c.y + 30);
            if (e.flama && e.flama.emitting) e.flama.stop();
            return;
        }
        if (!b.volant) {
            // Al dibuix d'invocar la mà alçada és a l'altre costat (a l'esquerra del dibuix, i més amunt) que al dibuix base: el bàcul hi segueix
            if (e.spr.texture.key === 'ocellaire_invoca') { b.x = c.x + (e.spr.flipX ? 101 : -101) * (K / 1.4); b.y = c.y - 178 * (K / 1.4); }
            else { b.x = c.x + (e.spr.flipX ? -66 : 66) * K; b.y = c.y - 92 * K; }
        }
        b.rot += b.gir;
        b.g.setPosition(b.x, b.y).setRotation(b.rot).setDepth(c.y + 2);
        // Mentre gira de pressa, les puntes deixen un rastre de foc
        if (e.flama) {
            if (b.gir > 0.2) { if (!e.flama.emitting) e.flama.start(); e.flama.setPosition(b.x + Math.cos(b.rot) * 92 * K, b.y + Math.sin(b.rot) * 92 * K); }
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
        g.setScale(K_OCELLAIRE);
        this.tweens.add({ targets: g, alpha: 0.65, yoyo: true, repeat: -1, duration: 500 });
        return g;
    }
    posarUlls(u, spr, prof) {
        u.setPosition(spr.x, spr.y - spr.displayHeight * 0.5 + spr.displayHeight * 0.254).setVisible(spr.alpha > 0.3 && !spr.senseUlls);       // els ulls són al 25% del dibuix (senseUlls: de genolls s'apaguen)
        if (prof) u.setDepth(prof + 1);
    }
    // Tambors de guerra mentre dura el combat (BUM · BUM BUM ·)
    tambors(ms) {
        if (this.tambor) this.tambor.remove();
        let k = 0;
        this.tamborsCallats = false;
        this.tambor = this.time.addEvent({ delay: ms, loop: true, callback: () => {
            const t = k++ % 4;
            if (!this.ui().dialeg && t !== 1 && !this.tamborsCallats) Sfx.tambor(t === 0);       // callen mentre dura la pausa de l'Ocellaire
        } });
    }
    // Segona fase: rugit, ona de xoc que empeny l'Ineu, la cova es torna vermella i els tambors s'acceleren
    furiaOcellaire(e, fase = 2) {
        const c = e.spr.body.center, cam = this.cameras.main;
        Sfx.rugit();
        cam.shake(fase === 3 ? 1800 : 1300, fase === 3 ? 0.012 : 0.009);
        cam.flash(220, 255, fase === 3 ? 140 : 60, 40);
        this.punchFase(fase);          // punch-in de càmera + frase de la fase (vegeu punchFase)
        const ona = this.add.circle(c.x, c.y - 30, 30).setStrokeStyle(10, 0xff5030, 0.9).setDepth(99960);
        this.tweens.add({ targets: ona, radius: 520, alpha: 0, duration: 900, ease: 'Cubic.out', onComplete: () => ona.destroy() });
        const jo = this.ineu.body.center, dx = jo.x - c.x, dy = jo.y - c.y, l = Math.hypot(dx, dy) || 1;
        if (l < 420) this.forcat = { vx: dx / l * 520, vy: dy / l * 520, fins: this.time.now + 260 };
        this.tweens.add({ targets: this.velLila, alpha: fase === 3 ? 0.42 : 0.32, duration: 800 });
        this.velLila.setFillStyle(fase === 3 ? 0x4a0a04 : 0x3a0610, this.velLila.alpha);
        this.llumLila.setFillStyle(fase === 3 ? 0xff7020 : 0xff3020, fase === 3 ? 0.16 : 0.1);
        this.espurnes.setParticleTint && this.espurnes.setParticleTint(0xff6040);
        if (e.ulls) this.tweens.add({ targets: e.ulls, scale: 1.6 * K_OCELLAIRE, duration: 400 });
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
    // L'Ocellaire cau de genolls (el bàcul buit): comença la pausa en què se li pot picar el cap
    // Llenguatge de la pausa: or = ara pots picar. Halo daurat sobre el cap, fletxa, tres llumetes (una per cop), anell d'or a terra,
    // bàcul a terra i tambors callats; «Ara!» a les dues primeres. Tot per codi i sense bloquejar res (design/lluita_final_combat.md § 4).
    genollsOcellaire(e, ms) {
        const ara = this.time.now, K = K_OCELLAIRE, b = e.basto, cam = this.cameras.main;
        if (e.finestra) this.tancarFinestraOcellaire(e);
        const n = e.nFinestres = (e.nFinestres || 0) + 1;
        e.estat = 'cansat'; e.fins = ara + ms; e.copsRebuts = 0;
        const clau = clauSpriteOcellaire(this, e, ara);
        if (e.spr.texture.key !== clau) e.spr.setTexture(clau);          // de cop, sense passar pel sprite dret
        e.spr.senseUlls = true;
        e.spr.setTintFill(0xffffff);                                        // flaix blanc de 80 ms (després, el tint fred de la ia)
        this.time.delayedCall(80, () => { if (e.spr.active) e.spr.clearTint(); });
        const c = e.spr.body.center;
        Sfx.esgotat(); Sfx.puf();
        this.hitStop(90);
        cam.shake(180, 0.004, true);
        const pols = this.ovalTerra(c.x, c.y, 50 * K, 0x9a7acf, 0.35, 4);
        this.tweens.add({ targets: pols, scaleX: 2, scaleY: 2, alpha: 0, duration: 500, ease: 'Cubic.out', onComplete: () => pols.destroy() });
        this.tamborsCallats = true;                                         // el silenci és la pista: contrasta amb el BUM-BUM
        // El bàcul cau a terra, apagat
        if (b) {
            this.tweens.killTweensOf(b);
            b.lliure = true; b.volant = false; b.gir = 0; b.rot = Phaser.Math.Angle.Wrap(b.rot); b.depth = c.y + 30;
            if (b.g.setTint) b.g.setTint(0x8a8a8a);
            const sg = e.spr.flipX ? -1 : 1;
            this.tweens.add({ targets: b, x: c.x + sg * 95 * K, y: c.y + 12 * K, rot: 1.35, duration: 260, ease: 'Bounce.easeOut' });
            this.time.delayedCall(140, () => Sfx.bastoCau());
        }
        // Halo, fletxa, llumetes i anell
        const q0 = this.puntsCop(e)[0], R = q0.r + 12;
        const f = e.finestra = { off: { v: 0 }, llums: [], apagades: 0, tics: 0, alcat: false, tancada: false };
        f.halo = this.add.ellipse(q0.x, q0.y, R * 2, R * 2, 0xfff0b0, 0.18).setStrokeStyle(5, 0xffd860, 0.9).setBlendMode('ADD').setDepth(99955);
        this.tweens.add({ targets: f.halo, alpha: { from: 0.55, to: 1 }, yoyo: true, repeat: -1, duration: 350, ease: 'Sine.inOut' });
        // (Només el cercle al cap: abans també hi havia fletxa, llumetes, anell a terra i el text «Ara!»; era massa i desconcentrava)
        f.seguir = () => {       // halo, fletxa i llumetes segueixen el cap cada fotograma
            if (!e.spr.active || e.mort) return;
            const q = this.puntsCop(e)[0], r = q.r + 12;
            if (f.halo) f.halo.setPosition(q.x, q.y);
            if (f.fletxa) f.fletxa.setPosition(q.x, q.y - r - 40 + f.off.v);
            f.llums.forEach((l, i) => { const a = Phaser.Math.DegToRad(-150 + i * 60); l.setPosition(q.x + Math.cos(a) * (r + 16), q.y + Math.sin(a) * (r + 16)); });
        };
        f.seguir();
        this.events.on('postupdate', f.seguir);
        f.net = () => this.events.off('postupdate', f.seguir);
        this.events.once('shutdown', f.net);
    }
    // Cada fotograma de la pausa: avís de tancament (700 ms: parpelleig + tres «tic») i el bàcul que s'alça (250 ms abans)
    avisFinestraOcellaire(e, ara) {
        const f = e.finestra;
        if (!f) return;
        const rest = e.fins - ara, K = K_OCELLAIRE, b = e.basto, c = e.spr.body.center;
        if (!f.tancada && rest < AJUST_OCELLAIRE.avis) {
            if (f.tics === 0) { if (f.halo) this.tweens.killTweensOf(f.halo); }
            while (f.tics < 3 && rest <= AJUST_OCELLAIRE.avis - f.tics * 250) { Sfx.tic(); f.tics++; }
            const alfa = Math.floor(ara / 90) % 2 === 0 ? 1 : 0.15;
            if (f.halo) f.halo.setAlpha(alfa);
            if (f.fletxa) f.fletxa.setAlpha(alfa);
            f.llums.forEach((l, i) => { if (i >= f.apagades) l.setAlpha(alfa); });
        }
        if (!f.alcat && rest < 250 && b) {
            f.alcat = true;
            Sfx.carrega();
            this.tweens.killTweensOf(b);
            const sg = e.spr.flipX ? -1 : 1;
            this.tweens.add({ targets: b, x: c.x + sg * 66 * K, y: c.y - 92 * K, duration: 250, ease: 'Sine.inOut', onComplete: () => { b.lliure = false; b.gir = 0.04; if (b.g.clearTint) b.g.clearTint(); } });
        }
    }
    // Un cop encertat a la pausa: s'apaga una llumeta; al tercer, el halo es trenca en espurnes i la pausa es tanca
    copFinestraOcellaire(e, tanca) {
        const f = e.finestra;
        if (!f) return;
        const l = f.llums[f.apagades++];
        if (l) { l.setFillStyle(0x555566).setAlpha(1); this.tweens.add({ targets: l, scale: 1.6, yoyo: true, duration: 60 }); }
        if (tanca && !f.tancada) {
            f.tancada = true;
            const q = this.puntsCop(e)[0];
            const p = this.add.particles(q.x, q.y, 'espurna', { speed: { min: 120, max: 320 }, lifespan: 450, scale: { start: 0.35, end: 0 }, tint: 0xffffff, quantity: 6, emitting: false }).setDepth(99958);
            p.explode(6);
            this.time.delayedCall(600, () => p.destroy());
            [f.halo, f.fletxa, ...f.llums].forEach(o => { if (o) o.setVisible(false); });
        }
    }
    // Desmunta la pausa (fi de temps, canvi de fase, mort): neteja els marcadors, torna el bàcul a la mà i els tambors
    tancarFinestraOcellaire(e) {
        const f = e.finestra;
        if (!f) return;
        e.finestra = null;
        [f.halo, f.fletxa, f.anell, ...f.llums].forEach(o => { if (o) { this.tweens.killTweensOf(o); o.destroy(); } });
        this.tweens.killTweensOf(f.off);
        if (f.net) { f.net(); this.events.off('shutdown', f.net); }
        this.tamborsCallats = false;
        if (e.spr.active) { e.spr.senseUlls = false; e.spr.clearTint(); }
        const b = e.basto;
        if (b && b.lliure && !e.mort) {
            this.tweens.killTweensOf(b);
            const c = e.spr.body.center;
            b.x = c.x + (e.spr.flipX ? -66 : 66) * K_OCELLAIRE; b.y = c.y - 92 * K_OCELLAIRE; b.lliure = false; b.gir = 0.04;
            if (b.g.clearTint) b.g.clearTint();
        } else if (b && b.lliure) b.lliure = false;
        if (!e.mort) Sfx.tambor(true);                                       // tornen els tambors amb un cop fort
    }
    // S'aixeca d'una revolada després de tres cops al cap: una ona curta que empeny l'Ineu (sense fer-li mal)
    aixecaOcellaire(e) {
        const c = e.spr.body.center, R = 170;
        Sfx.rugit();
        this.cameras.main.shake(180, 0.006, true);
        const ona = this.ovalTerra(c.x, c.y, R * 0.5, 0xc8a8ff, 0.3, 5);
        this.tweens.add({ targets: ona, scaleX: 2.1, scaleY: 2.1, alpha: 0, duration: 380, ease: 'Cubic.out', onComplete: () => ona.destroy() });
        const jo = this.ineu.body.center;
        if (this.dinsOval(c.x, c.y, R, jo)) {
            const dx = jo.x - c.x, dy = jo.y - c.y, l = Math.hypot(dx, dy) || 1;
            this.forcat = { vx: dx / l * 600, vy: dy / l * 600, fins: this.time.now + 260 };
        }
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
        const jo = this.ineu.body.center, c = e.spr.body.center, MIN = AJUST_OCELLAIRE.focDistMin, punts = [{ x: jo.x, y: jo.y }];
        for (let k = 0; k < 3; k++) { const a = Math.random() * Math.PI * 2, d = 150 + Math.random() * 110; punts.push({ x: jo.x + Math.cos(a) * d, y: jo.y + Math.sin(a) * d * 0.6 }); }
        punts.forEach(q => {
            // Cap zona de foc a menys de 180 px del cos de l'Ocellaire (la pausa que ve després no pot obrir-se entre flames):
            // si hi cau, s'empeny cap enfora i, si la vora de la plataforma ho impedeix, es proven altres direccions
            let p = this.puntPlataforma(q.x, q.y);
            if (Phaser.Math.Distance.Between(p.x, p.y, c.x, c.y) < MIN) {
                const a0 = Math.atan2(q.y - c.y, q.x - c.x) || Math.random() * Math.PI * 2;
                for (let k = 0; k < 8; k++) {
                    const a = a0 + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * Math.PI / 4;
                    const t = this.puntPlataforma(c.x + Math.cos(a) * MIN, c.y + Math.sin(a) * MIN);
                    p = t;
                    if (Phaser.Math.Distance.Between(t.x, t.y, c.x, c.y) >= MIN - 1) break;
                }
            }
            this.focTerra(p.x, p.y, 70, 950, 3000);
        });
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
        if (e) { e.avisCercle = null; if (e.finestra) this.tancarFinestraOcellaire(e); }
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
        this.tweens.add({ targets: o.spr, alpha: 0, duration: 220, onComplete: () => this.retirar(o) });
    }

    // ---------------- Música ----------------
    teEfecteMelodia(nom) {
        const d = (x, y) => Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, x, y);
        if (nom === 'pedres') return !Estat.flag('pontGabia') && d(GABIA.x, this.yPont) < 260;
        return nom === 'miracle' && d(this.gx, this.base + 60) < 300 && !(this.boss && !this.boss.mort) && Estat.flag('ocellaireVencut') && !Estat.flag('gabiaOberta');
    }

    enMelodia(nom) {
        const d = (x, y) => Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, x, y);
        if (nom === 'pedres' && !Estat.flag('pontGabia') && d(GABIA.x, this.yPont) < 260) { this.aixecarPont(); return true; }
        if (nom === 'miracle' && d(this.gx, this.base + 60) < 300) {
            if (this.boss && !this.boss.mort) { this.ui().obrirDialeg({ pagines: [{ qui: 'Ineu', text: "(L'Home de la Gàbia xiula més fort que el cant.)" }] }); return true; }
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
        Estat.posaObjectiu("El pont de pedra porta fins a la gàbia.");
        Estat.desar();
    }

    // ---------------- El combat final ----------------
    actualitzar() {
        // L'Ineu trepitja la plataforma: l'Aldreu crida el seu Mestre
        if (!this.combatIniciat && Estat.flag('pontGabia') && !Estat.flag('ocellaireVencut') && this.ineu.y < GABIA.y + GABIA.platH / 2 - 30) {
            if (!Estat.flag('cantMiracle')) {                                         // sense el Cant del Miracle no es pot entrar al combat
                this.ineu.setY(GABIA.y + GABIA.platH / 2 - 10);
                if (this.time.now > (this.avisCant || 0)) { this.avisCant = this.time.now + 4000; this.ui().obrirDialeg({ pagines: [{ qui: 'Ineu', text: "(Una força invisible no em deixa passar. Sense el Cant del Miracle, els barrots no m'escoltaran. La Pianista, al Santuari, me l'ha d'ensenyar.)" }] }); }
            } else this.iniciarCombatFinal();
        }
    }

    // Durant el combat final no es pot parlar amb ningú ni tocar la flauta
    sensePunts() { return !!this.bossActiu; }

    // Tanca (o allibera) la càmera i el pas del pont perquè tot el combat tingui lloc estrictament dins la Sala de la Gàbia,
    // sense que es vegin mai ni el pont ni les escales d'entrada
    tancarSalaCombat(actiu) {
        const G = GABIA, y1 = G.y + G.platH / 2, cam = this.cameras.main;
        if (actiu) {
            if (!this.colCombatPont) this.colCombatPont = this.colisio(G.x, y1 + G.avenc / 2, 140, G.avenc);
            const x0 = G.x - G.platW / 2 - 40, w = G.platW + 80;
            cam.setBounds(x0, 96, w, y1 - 96);
            this.boundsCamOrig = null;
        } else {
            if (this.colCombatPont) { this.obstacles.remove(this.colCombatPont, true, true); this.colCombatPont = null; }
            cam.setBounds(0, 0, this.config.amplada, this.config.alcada);
        }
    }

    // ---------- Lluita final: ajudes de muntatge (guió: design/lluita_final_guio.md) ----------
    // Una textura opcional només compta si s'ha carregat de debò (si falta el fitxer, el catàleg en fa un marcador)
    teTextura(k) {
        return this.textures.exists(k) && !(typeof Grafics !== 'undefined' && Grafics.faltants && Grafics.faltants.includes(k));
    }
    escalaTextura(a, k) {
        const t = this.textures.get(k);
        if (t && t.customData && t.customData.escala) a.setScale(t.customData.escala);
        a.escalaBase = a.scaleY;
    }
    // Bancs de frases de combat (no bloquegen: z.flotant). nou = primera vegada, retry = si ja havia vist l'Ocellaire; ald = l'Aldreu des de fora
    bancsFrases() {
        return {
            fase2: {
                nou: ["Així que tens ullals, petit. Ara miraré de debò.", "Fa mal, oi? Un riure fa més mal quan és teu que quan és d'un altre."],
                retry: ["Ja m'has vist això. Et va servir de molt?", "Cada vegada et fas una mica més meu."],
                ald: ["Així, Mestre! Així!"]
            },
            fase3: {
                nou: ["Prou de música! Que cremi tot!", "He tingut milers de riures. Tu només en tens un... però ja el sento tremolar."],
                retry: ["Encara hi ets? Que n'ets, de pesat.", "Prou de música! Que cremi tot!"],
                ald: ["Mestre, no us cansaríeu, oi?"]
            },
            cap: { nou: ["Ai!... I això, qui t'ho ha ensenyat?", "Prou. Només el cap, sí? Quin monjo més llest."] },
            caiguda: {
                nou: ["Veus? Fins i tot a tu, la gàbia et crida.", "Descansa, petit... al fons hi ha un lloc per a tu."],
                ald: ["Us ho deia, monjo. Ningú no li guanya."]
            },
            espor: { nou: ["Els meus ocells tenen gana.", "Rius poc, monjo. Tens la boca seca.", "Aquest cant... és massa bonic per a tu.", "Un nen que riu sap perdre. Tu no sap perdre?"] }
        };
    }
    triaFrase(clau, llista) {
        this.ultFrase = this.ultFrase || {};
        let i = Phaser.Math.Between(0, llista.length - 1);
        if (llista.length > 1 && i === this.ultFrase[clau]) i = (i + 1) % llista.length;
        this.ultFrase[clau] = i;
        return llista[i];
    }
    partirFrase(t) {                          // dues línies si és llarga (el text flotant no es parteix sol)
        if (t.length <= 30) return t;
        const m = Math.floor(t.length / 2);
        let i = t.indexOf(' ', m), j = t.lastIndexOf(' ', m);
        if (i < 0 || (j >= 0 && m - j < i - m)) i = j;
        return i < 0 ? t : t.slice(0, i) + '\n' + t.slice(i + 1);
    }
    // Frase de combat sense bloquejar. clau: 'fase2' | 'fase3' | 'cap' (primer cop al cap) | 'caiguda' (l'Ineu cau) | 'espor'.
    // punchFase ja la crida per a les fases; 'cap' i 'caiguda' les ha de cridar qui detecta el fet (combat.js).
    dirFrase(clau) {
        if (!FRASES_FLOTANTS_COMBAT) return;        // desactivades: les sobreimpressions desconcentraven (les frases de l'Aldreu i del Mestre van als quadres de diàleg)
        const b = this.bancsFrases()[clau], e = this.boss;
        if (!b || !e || !e.spr || !e.spr.active || this.bossCaigut) return;
        const llista = (this.combatVist && b.retry) ? b.retry : b.nou;
        this.flotant(e.spr.x, e.spr.y - e.spr.displayHeight - 8, this.partirFrase(this.triaFrase(clau + 'o', llista)), '#d8c8ff');
        if (b.ald) {
            const ta = this.triaFrase(clau + 'a', b.ald);
            this.time.delayedCall(1800, () => { if (this.bossActiu && !this.bossCaigut) this.flotant(this.gx + 330, this.base - 40, this.partirFrase(ta), '#ffffff'); });
        }
    }
    // Una frase esporàdica cada 25-35 s de combat
    iniciarVeus() {
        const torn = () => this.time.delayedCall(Phaser.Math.Between(25000, 35000), () => {
            if (!this.bossActiu || !this.boss || this.bossCaigut) return;
            this.dirFrase('espor'); torn();
        });
        torn();
    }
    // PUNCH-IN DE CÀMERA en un canvi de fase (P20/P21). L'ha de cridar qui detecta el rugit: this.punchFase(2) o this.punchFase(3).
    // Fa també la frase de la fase. El zoom només si l'Ineu és a menys de 520 px de l'Ocellaire; dura <= 1,2 s i torna a seguir l'Ineu.
    punchFase(f) {
        const e = this.boss;
        if (!e || !e.spr || !e.spr.active || !this.bossActiu || this.bossCaigut) return;
        this.dirFrase(f >= 3 ? 'fase3' : 'fase2');
        if (this.punchOcupat) return;
        const I = this.ineu;
        if (Phaser.Math.Distance.Between(I.x, I.y, e.spr.x, e.spr.y) >= 520) return;
        const f3 = f >= 3;
        this.punchOcupat = true;
        if (!f3) this.hitStop(160);
        this.enquadrar(e.spr.x, e.spr.y - 0.55 * e.spr.displayHeight, f3 ? 1.8 : 1.55, f3 ? 240 : 300, null, 0);
        this.time.delayedCall((f3 ? 240 : 300) + (f3 ? 900 : 700), () => {
            if (!this.bossActiu || this.bossCaigut) { this.punchOcupat = false; return; }
            this.alliberarCamera(f3 ? 500 : 600, () => { this.punchOcupat = false; });
        });
    }
    // El Pastor (guàrdia) es veu x1.5. clau: nova textura opcional
    granPastor(a, clau) {
        if (!a) return;
        if (a.respira) { a.respira.stop(); a.respira = null; }
        if (a.balanceig) { a.balanceig.stop(); a.balanceig = null; }
        if (clau) a.setTexture(clau);
        a.clauPastor = a.texture.key;                          // npcVa/npcSalta/tornaIdleNpc el mantenen amb aquest dibuix (no torna a ser el monjo fins a desferPastor)
        const t = this.textures.get(a.texture.key);
        const e = (t && t.customData && t.customData.escala) || 1 / RES;
        a.setScale(e * 1.5); a.escalaBase = a.scaleY;
        if (a.ombra) a.ombra.setScale(0.42 * 1.5);
        this.idleCodi(a, true);
    }
    // ---------- L'Aldreu final: trist (cap cot) -> aixeca el cap -> somriu ----------
    aldreuTrist(a) {
        if (!a || !a.active) return;
        this.aldreuEstat = 'trist';
        if (a.respira) { a.respira.stop(); a.respira = null; }
        if (a.balanceig) { a.balanceig.stop(); a.balanceig = null; }
        if (a.respiraTrist) a.respiraTrist.stop();
        if (this.teTextura('germa_aldreu_trist')) {
            a.setTexture('germa_aldreu_trist'); this.escalaTextura(a, 'germa_aldreu_trist');
            a.clearTint(); a.setAngle(0);
        } else {
            a.setTint(0xb8b8d0); a.setAngle(-5); a.setScale(a.scaleX, (a.escalaBase || a.scaleY) * 0.97);
        }
        a.setFlipX(true);                                     // de cara als barrots (d'esquena a l'Ineu)
        const s = a.scaleY;
        a.respiraTrist = this.tweens.add({ targets: a, scaleY: s * 1.015, yoyo: true, repeat: -1, duration: 2600, ease: 'Sine.easeInOut' });
    }
    // Camina fins a (x, y); si encara és trist, recupera la postura en arribar (npcVa la reinicia)
    aldreuVa(x, y, fet, vel) {
        this.npcVa('germa_aldreu', x, y, () => { if (this.aldreuEstat === 'trist') this.aldreuTrist(this.npcs.germa_aldreu); if (fet) fet(); }, vel);
    }
    aldreuAixeca(a) {
        if (!a || !a.active || this.aldreuEstat !== 'trist') return;
        if (a.respiraTrist) { a.respiraTrist.stop(); a.respiraTrist = null; }
        this.aldreuEstat = 'aixeca';
        if (this.teTextura('germa_aldreu_aixeca')) { a.setTexture('germa_aldreu_aixeca'); this.escalaTextura(a, 'germa_aldreu_aixeca'); return; }
        if (this.teTextura('germa_aldreu_trist')) return;          // sense variant: el cap cot es manté fins al somriure
        this.tweens.add({ targets: a, angle: 0, scaleY: a.escalaBase, duration: 800, ease: 'Sine.easeInOut', onComplete: () => a.clearTint() });
    }
    // El somriure de la Plaça: l'sprite normal 'germa_aldreu', que és el que es queda a la gàbia
    aldreuSomriu(a) {
        if (!a || !a.active) return;
        this.aldreuEstat = 'somriu';
        if (a.respiraTrist) { a.respiraTrist.stop(); a.respiraTrist = null; }
        this.tweens.killTweensOf(a);
        a.clearTint(); a.setAngle(0);
        a.setTexture('germa_aldreu'); this.escalaTextura(a, 'germa_aldreu');
        this.idleCodi(a, true);
        this.llum(a.x, a.y - 0.7 * a.displayHeight, 0xffe8a0);
    }

    iniciarCombatFinal() {
        window.RETRAT_OCELLAIRE_DERROTAT = false;
        this.combatIniciat = true;
        this.bossActiu = true;
        this.tancarSalaCombat(true);
        const gx = this.gx, base = this.base, vist = Estat.flag('ocellaireVist');
        this.combatVist = vist;
        const KO = (typeof K_OCELLAIRE !== 'undefined' ? K_OCELLAIRE : 1.4);
        const ap = this.add.image(gx, base + 90, 'ocellaire').setAlpha(0).setDepth(base + 90);
        ap.escalaFi = (this.textures.get('ocellaire').customData.escala || 1 / RES) * KO;
        ap.setScale(ap.escalaFi);
        this.npcs.ocellaire = ap;
        const cam = this.cameras.main, ui = this.ui(), I = this.ineu, A = 'Aldreu, Pastor de Boira', O = "L'Home de la Gàbia";
        // Plans (sense barres negres: només zoom i desplaçament). pla(objectiu, zoom, ms, reserva)
        const pla = (obj, zoom, ms, reserva) => ({ fer: (z, fet) => { const p = obj(); z.enquadrar(p[0], p[1], zoom, ms, fet, reserva); } });
        const pIneu = () => [I.x, I.y - 70];
        const pAld = k => () => { const a = this.npcs.germa_aldreu; return a ? [a.x, a.y - k * a.displayHeight] : pIneu(); };
        const pMestre = k => () => [ap.x, ap.y - k * ap.displayHeight];
        const pDos = () => [(ap.x + I.x) / 2, ((ap.y - ap.displayHeight) + I.y) / 2];       // els dos alhora: l'Ocellaire (gegant) sencer i l'Ineu
        const aparicioAldreu = f => {
            // El Germà Aldreu (Pastor de Boira) apareix de cop entre una bafarada de boira, gran (x1.5)
            const ald = this.npcs.germa_aldreu;
            if (ald) {
                Sfx.puf();
                this.boiraPuf(ald.x, ald.y - 50);
                cam.shake(180, 0.004);
                this.granPastor(ald);
                ald.setVisible(true).setAlpha(1);
                if (ald.ombra) ald.ombra.setVisible(true).setAlpha(0.42);
                if (ald.col) ald.col.body.enable = true;
            }
            this.npcMira('germa_aldreu', 'ineu');
            // L'Ineu es gira de tres quarts cap a l'Aldreu (abans es quedava mirant cap amunt, d'esquena a la càmera, durant tota l'escena)
            this.vista8Manual = true; this.posarDireccio('dreta', false, 'right');         // de perfil: l'Aldreu és a la seva dreta
            this.enquadrar(gx + 230, base - 10, 1.55, 350, () => this.esperar(250, f));
        };
        const transformacio = (z, fet) => z.seq([
            f => {
                const ald = z.npcs.germa_aldreu;
                if (ald && ald.anims) { ald.anims.stop(); ald.idleClau = null; }          // deixa l'idle: passa a ser el Guàrdia / el Pastor
                if (ald && z.teTextura('aldreu_pastor_crida')) z.granPastor(ald, 'aldreu_pastor_crida');
                else if (ald && z.textures.exists('aldreu_guardia')) z.granPastor(ald, 'aldreu_guardia');
                else if (ald && z.textures.exists('pastor_boira')) { ald.setTexture('pastor_boira'); ald.setScale(0.5 * 1.5); }
                z.npcSalta('germa_aldreu', f, 2);
            },
            f => { z.vista8Manual = true; z.posarDireccio('dreta', false, 'northeast'); z.invocarOcellaire(ap, f, vist); }        // amb el Mestre al davant, de tres quarts
        ], fet);
        const rugit = (z, fet) => {
            // P14: el rugit (dolly-out + shake)
            z.enquadrar(ap.x, ap.y - 110, 2.2, 1, () => {
                if (z.textures.exists('ocellaire_rugit')) { ap.setTexture('ocellaire_rugit'); if (ap.ulls) ap.ulls.setVisible(false); }
                Sfx.titolBoss(); cam.shake(900, 0.008); cam.flash(180, 255, 255, 255);
                ui.titolBoss("L'HOME DE LA GÀBIA", "L'Ocellaire");
                z.enquadrar(ap.x, ap.y - 110, 1.0, 380, null, 0);
                z.esperar(vist ? 2200 : 3200, () => { ap.setTexture('ocellaire'); if (ap.ulls) ap.ulls.setVisible(true); fet(); });
            }, 0);
        };
        const fuig = (z, fet) => {
            // P15: l'Aldreu fuig i crida des de lluny; P16: s'obre el joc
            const ald = z.npcs.germa_aldreu;
            if (ald) z.enquadrar(ald.x, ald.y - 110, 1.3, 600, null, 0);
            z.npcVa('germa_aldreu', gx + 330, base + 40, null, 220); z.amagarAldreu();
            z.esperar(900, () => z.alliberarCamera(900, fet));
        };
        const pagines = [
            { fer: (z, fet) => {
                Joc.aturarMusica();
                // L'Ineu CAMINA fins a la seva posició (amb l'animació de caminar fins que arriba; només llavors es queda quiet mirant amunt) mentre el pla general fa la seva deriva
                let pend = 2; const llest = () => { if (--pend === 0) fet(); };
                z.ineuVa(I.x, Math.min(I.y, base + 340), () => { z.posarDireccio('amunt', false); llest(); }, 150);
                // P01: pla general (tall) i deriva lenta
                z.enquadrar(gx, base + 80, 0.9, 1, () => {
                    if (vist) { z.esperar(900, llest); return; }
                    Sfx.carrega();
                    z.enquadrar(gx, base + 40, 0.9, 2200, llest, 0);
                }, 0);
            } },
            ...(vist ? [
                { fer: (z, fet) => aparicioAldreu(fet) },
                { qui: A, text: "Una altra vegada, monjo? El Mestre no es cansa mai." },
                { fer: (z, fet) => transformacio(z, fet) },
                pla(pMestre(0.55), 1.6, 1),
                { qui: O, text: "Torna a entrar, petit. Sempre torna, el riure." },
                { qui: A, text: "Mestre, aquesta vegada sí!" },
                { fer: (z, fet) => rugit(z, fet) },
                { fer: (z, fet) => fuig(z, fet) }
            ] : [
                pla(pIneu, 1.55, 900),
                { qui: 'Ineu', text: "(Tres capolls de boira, penjats com fruites... L'Huri, el Fram, el Sardi. Dormen.)" },
                { fer: (z, fet) => z.enquadrar(gx - 160, base - 170, 1.6, 1100, () => { Sfx.riure(); z.enquadrar(gx + 160, base - 170, 1.6, 1100, fet); }) },
                { qui: 'Ineu', text: "Aguanteu. Ja sóc aquí." },
                { fer: (z, fet) => aparicioAldreu(fet) },
                { qui: A, text: "Silenci! Aquí no s'alça la veu, monjo. El Mestre dorm, i jo vetllo el seu son." },
                pla(pIneu, 1.5, 1),
                { qui: 'Ineu', text: "Germà Aldreu... sóc jo. Baixeu el bastó, que els nens no són seus." },
                pla(pAld(0.8), 1.55, 1),
                { qui: A, text: "Meus, no. Del Mestre. Cada riure que li duc em diu «bon xicot, Aldreu». ¿Saps què vol dir que algú et digui pel nom?" },
                { fer: (z, fet) => {
                    const ald = z.npcs.germa_aldreu;
                    if (ald && z.textures.exists('pastor_enfadat')) z.granPastor(ald, 'pastor_enfadat');
                    if (Sfx.xiscle) Sfx.xiscle();
                    const p = pAld(0.8)(); z.enquadrar(p[0], p[1], 2.0, 500, fet);
                } },
                { qui: A, text: "Tu no ho saps! Per a tu sempre hi ha hagut algú que et mirés!" },
                pla(pIneu, 1.5, 1),
                { qui: 'Ineu', text: "Això no és mirar algú, Germà. És tancar-lo." },
                pla(pAld(0.8), 2.0, 500),
                { qui: A, text: "Tard, massa tard! Mestre! MESTRE, ja és aquí! El monjo que us vol prendre els nens!" },
                { fer: (z, fet) => transformacio(z, fet) },
                { qui: O, text: "Aldreu... fill meu... no cridis." },
                { qui: O, text: "Ja l'he sentit entrar. Quin soroll més dolç fan, uns peus de monjo damunt la meva pedra." },
                pla(pDos, 0.82, 700),
                { qui: 'Ineu', text: "Deixeu els nens. Tornaran amb els seus." },
                pla(pMestre(0.55), 1.6, 700),
                { qui: O, text: "Un nen que riu... Fa segles que no en sento cap." },
                { qui: O, text: "La gàbia és plena de riures robats. Encara hi cap el teu." },
                pla(pDos, 0.82, 700),
                { qui: 'Ineu', text: "Runna us coneix. I jo us veig. No sou el que feu veure." },
                pla(() => [(ap.x + I.x) / 2, (ap.y + I.y) / 2 - 90], 0.95, 1000),
                { qui: O, text: "Runna... Quina espasa tan petita per a una sala tan gran." },
                pla(pAld(0.8), 1.3, 500),
                { qui: A, text: "Deixeu-m'ho a mi, Mestre!" },
                { qui: O, text: "Aparta, Aldreu. Aquesta nit el Mestre mateix et mostrarà com es fa." },
                { qui: A, text: "Sí, Mestre..." },
                { fer: (z, fet) => rugit(z, fet) },
                { fer: (z, fet) => fuig(z, fet) }
            ])
        ];
        this.ui().obrirDialeg({ pagines }, () => this.començarBoss(ap));
    }

    // L'Aldreu fuig i s'amaga durant el combat (després torna)
    amagarAldreu() {
        const a = this.npcs.germa_aldreu;
        if (!a) return;
        this.time.delayedCall(1100, () => this.tweens.add({ targets: [a, a.ombra].filter(Boolean), alpha: 0, duration: 500, onComplete: () => { if (this.bossActiu) { a.setVisible(false); if (a.ombra) a.ombra.setVisible(false); } } }));
    }
    mostrarAldreu() {
        const a = this.npcs.germa_aldreu;
        if (!a) return;
        this.tweens.killTweensOf(a);
        a.setVisible(true).setAlpha(1); if (a.ombra) a.ombra.setVisible(true).setAlpha(a.ombra.alpha || 1);
    }
    // Quan el Mestre cau, la boira deixa l'Aldreu: el Pastor de Boira torna a ser el Germà Aldreu (a mida normal, trist)
    desferPastor() {
        const a = this.npcs.germa_aldreu;
        if (!a) return null;          // (no mira la textura: en caminar, npcVa li torna el dibuix normal, i la boira ha de deixar-lo igualment)
        const x = a.x, y = a.y, flip = a.flipX;
        Sfx.puf();
        this.boiraPuf(x, y - 60);
        this.llum(x, y - 70, 0xb88aff);
        if (a.col) this.obstacles.remove(a.col, true, true);
        if (a.punt) a.punt.actiu = () => false;
        if (a.respira) a.respira.stop();
        if (a.balanceig) a.balanceig.stop();
        this.tweens.killTweensOf(a);
        if (a.ombra) a.ombra.destroy();
        a.destroy();
        delete this.npcs.pastor_boira; delete this.npcs.germa_aldreu; delete this.npcs.aldreu_guardia;
        const n = this.npc('germa_aldreu', x, y, DIALEGS.aldreuGabia, { flipX: flip });
        this.aldreuEstat = 'trist';
        if (!this.teTextura('germa_aldreu_trist')) n.setTint(0xb8b8d0);            // (la postura completa s'aplica en arribar: aldreuTrist)
        return n;
    }

    // La boira baixa de la cúpula, s'arremolina i en surt l'Ocellaire gegant que aterra (P07-P11). curta = versió de retry
    invocarOcellaire(ap, fet, curta) {
        const gx = this.gx, base = this.base, cam = this.cameras.main;
        const yTop = base - this.gh - 140, yFi = base + 90, sFi = ap.escalaFi || ap.scaleX, durB = curta ? 1400 : 2400;
        let p = null;
        this.seq([
            f => {                                              // P07: contrapicat, la càmera puja per la gàbia
                Sfx.carrega();
                p = this.add.particles(gx, base - this.gh, 'boira', {
                    speedY: { min: 120, max: 260 }, speedX: { min: -40, max: 40 }, lifespan: 1300, scale: { start: 0.5, end: 1.4 },
                    alpha: { start: 0.5, end: 0 }, tint: 0x9a50ff, frequency: 40
                }).setDepth(ap.depth - 0.5);                       // darrere el Mestre: la boira l'envolta però no li tapa la cara
                cam.shake(1200, 0.004);
                ap.setPosition(gx, yTop).setScale(sFi * 1.36).setAlpha(0);
                this.enquadrar(gx, base - this.gh - 40, 1.15, curta ? 500 : 1200, f, 0);
            },
            f => {                                              // P08: baixada del Mestre (gegantí, ve de dalt)
                Sfx.carrega();
                if (this.teTextura('ocellaire_alca')) ap.setTexture('ocellaire_alca');
                this.tweens.add({ targets: ap, alpha: 1, duration: 500 });
                this.tweens.add({ targets: ap, y: yFi, scale: sFi, duration: durB, ease: 'Sine.easeIn',
                    onUpdate: () => { if (p) p.setPosition(gx, ap.y - 60); }, onComplete: f });
                this.enquadrar(gx, base - 30, 1.3, durB, null, 0);
            },
            f => {                                              // P09: aterratge
                p.stop(); this.time.delayedCall(1400, () => p.destroy());
                Sfx.puf(); this.boiraPuf(ap.x, ap.y - 14);       // el pols de boira, als peus (no a la cara)
                cam.flash(250, 160, 80, 255); cam.shake(300, 0.010);
                ap.setTexture(this.teTextura('ocellaire_mira_avall') ? 'ocellaire_mira_avall' : 'ocellaire');
                if (!curta) this.npcVa('germa_aldreu', gx + 260, base + 60, null, 160);
                this.enquadrar(ap.x, ap.y - 80, 1.2, 300, f, 0);
            },
            f => {                                              // P10: els ulls lila s'encenen (retry: pla mitjà del Mestre)
                ap.ulls = this.crearUlls(); this.posarUlls(ap.ulls, ap, 0);
                ap.ulls.setAlpha(0);
                this.tweens.add({ targets: ap.ulls, alpha: 1, duration: 600 });
                if (curta) this.enquadrar(ap.x, ap.y - 0.55 * ap.displayHeight, 1.6, 600, f);
                else this.enquadrar(ap.x, ap.y - 0.78 * ap.displayHeight, 2.2, 1100, () => this.esperar(300, f));
            }
        ], fet);
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
        // Els ulls segueixen el cap just després de la física (si no, anirien un fotograma enrere). Ajupit, el dibuix ja porta els seus.
        const seguir = () => {
            if (e.ulls && e.ulls.active && e.spr.active) {
                this.posarUlls(e.ulls, e.spr, e.spr.body.bottom + 1);
                const k = e.spr.texture.key;
                if (k === 'ocellaire_cansat' || k === 'ocellaire_genolls' || k === 'ocellaire_rugit') e.ulls.setVisible(false);
            }
        };
        this.events.on('postupdate', seguir);
        this.events.once('shutdown', () => this.events.off('postupdate', seguir));
        this.ui().barraBoss("L'Home de la Gàbia", [1 / 3, 2 / 3]);            // els canvis de fase
        Joc.iniciarMusica(this, 0, 'musica_boss');
        this.invulnerableFins = this.time.now + 1500;
        this.tambors(560);
        this.npcs.ocellaire = e.spr;
        this.iniciarVeus();
    }

    ocellaireDerrotat(e) {
        this.bossCaigut = e;
        window.RETRAT_OCELLAIRE_DERROTAT = true;               // el retrat del diàleg passa a ser el derrotat
        const b = e.basto, c = e.spr.body.center, cam = this.cameras.main, ui = this.ui(), O = "L'Home de la Gàbia", gx = this.gx, base = this.base;
        if (this.tambor) { this.tambor.remove(); this.tambor = null; }
        Joc.aturarMusica(); Joc.jingle(this, 'jingle_boss');
        this.netejarRonda(e);
        ui.amagarBarraBoss();
        this.mostrarAldreu();
        // Derrotat: de genolls, esgotat i amb el cap avall (abans es quedava amb el dibuix base, somrient, mentre deia «no... el meu riure»)
        const clauMort = ['ocellaire_genolls', 'ocellaire_cansat'].find(k => this.teTextura(k)) || 'ocellaire';
        if (e.spr.texture.key !== clauMort) e.spr.setTexture(clauMort);
        e.spr.setFlipX(false);
        // P30: el cop final: la càmera s'acosta al cap, el món gairebé s'atura i un flaix blanc ho esborra tot
        this.enquadrar(e.spr.x, e.spr.y - 0.45 * e.spr.displayHeight, 1.9, 420, null, 0);
        this.hitStop(450);
        cam.flash(700, 255, 255, 255);
        Sfx.rugit();
        if (e.ulls) this.tweens.add({ targets: e.ulls, alpha: 0, duration: 2200, onComplete: () => e.ulls.destroy() });
        // Els ocells de foc s'apaguen tots alhora
        this.enemics.filter(o => o.tipus === 'ocellFoc' && !o.mort).forEach(o => this.apagarOcell(o));
        if (e.flama) { e.flama.destroy(); e.flama = null; }
        // El bàcul es parteix i cau (P31: la càmera el segueix)
        this.tweens.killTweensOf(b);
        b.volant = true;
        this.time.delayedCall(500, () => { if (b.g && b.g.active) this.enquadrar(b.g.x, c.y - 10, 1.6, 500, null, 0); });
        this.tweens.add({ targets: b.g, y: c.y - 10, rotation: b.rot + 4, duration: 700, ease: 'Bounce.easeOut', onComplete: () => {
            Sfx.talla(); this.impacte(b.g.x, b.g.y, { x: 0, y: -1 }, 2);
            this.tweens.add({ targets: b.g, alpha: 0, duration: 900, delay: 500, onComplete: () => b.g.destroy() });
        } });
        this.tweens.add({ targets: e.spr, angle: { from: -6, to: 6 }, yoyo: true, repeat: 6, duration: 90 });
        this.ui().actualitzarHUD();
        const mx = (e.spr.x + gx) / 2, my = Math.min(e.spr.y, base + 220) - 80;
        const lila = '#d8c8ff';
        this.time.delayedCall(1400, () => this.ui().obrirDialeg({ pagines: [
            // P32: primer pla del Mestre morint
            { fer: (z, fet) => z.enquadrar(e.spr.x, e.spr.y - 0.45 * e.spr.displayHeight, 2.0, 900, fet) },
            { qui: O, text: "No... el meu riure... Els meus ocells..." },
            { fer: (z, fet) => z.enquadrar(e.spr.x, e.spr.y - 0.45 * e.spr.displayHeight, 2.0, 1100, fet) },
            { qui: O, text: "Tants riures... i cap no era per a mi." },
            { fer: (z, fet) => z.seq([
                // P33-P34: es desfà en boira i la gàbia se l'empassa
                f => {
                    Sfx.puf();
                    const p = this.add.particles(e.spr.x, e.spr.y - 60, 'boira', { speed: { min: 30, max: 90 }, lifespan: 1200, scale: { start: 0.5, end: 1.3 }, alpha: { start: 0.7, end: 0 }, tint: 0x9a50ff, frequency: 50 }).setDepth(99000);
                    this.tweens.add({ targets: [e.spr, e.ombra], alpha: 0, duration: 1400 });
                    z.enquadrar(mx, base - this.gh * 0.5, 1.05, 1400, null, 0);
                    this.tweens.add({ targets: p, x: gx, y: base - this.gh * 0.5, duration: 1400, ease: 'Sine.easeIn', onComplete: () => {
                        p.stop(); this.time.delayedCall(1300, () => p.destroy());
                        this.retirar(e); delete this.npcs.ocellaire;
                        this.cameras.main.flash(300, 160, 80, 255);
                        this.ocellsBoira.forEach(o => { o.ev.remove(); this.tweens.add({ targets: o, alpha: 0, duration: 600, onComplete: () => o.destroy() }); });
                        f();
                    } });
                },
                // P35: la boira deixa l'Aldreu (a mida normal, tot petit), que es queda trist; la veu del Mestre, ja sense cos
                f => {
                    const n = z.desferPastor() || z.npcs.germa_aldreu;
                    if (n) z.enquadrar(n.x - 20, n.y - 0.6 * n.displayHeight, 1.2, 700, null);
                    z.esperar(1100, f);
                },
                f => {
                    this.flotant(gx, base - 200, "Aldreu... fill...\na la gàbia sempre hi haurà lloc per a tu.", lila);
                    z.esperar(2200, f);
                },
                f => {
                    this.tornarColorCova();
                    z.aldreuVa(gx + 90, base + 60, null, 120);
                    z.enquadrar(gx + 60, base - 10, 1.1, 1500, f);
                }
            ], fet) },
            { qui: 'Germà Aldreu', text: "Mestre! No em deixeu!" },
            // P36: pla general buit, en silenci
            { fer: (z, fet) => z.seq([
                f => { z.ajupir('germa_aldreu', null, 1200); z.enquadrar(gx + 60, base + 60, 0.95, 1500, f, 0); },
                f => z.esperar(1000, f),
                f => z.alliberarCamera(800, f)
            ], fet) }
        ] }, () => {
            this.bossActiu = false;
            this.tancarSalaCombat(false);
            this.tornarColorCova();
            Estat.posaFlag('ocellaireVencut');
            Estat.posaObjectiu("L'Home de la Gàbia ha caigut. Els barrots de la gàbia només escolten el Cant del Miracle.");
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
        const gx = this.gx, base = this.base, I = this.ineu;
        Joc.iniciarMusica(this, 0, 'musica_epileg');
        const pAld = () => { const a = this.npcs.germa_aldreu; return a ? [a.x, a.y - 0.6 * a.displayHeight] : [I.x, I.y - 70]; };
        this.ui().obrirDialeg({ pagines: [
            // P40: l'Ineu toca la flauta
            { fer: (z, fet) => {
                z.enquadrar(I.x, I.y - 70, 1.5, 700, null);
                this.time.addEvent({ delay: 200, repeat: 3, callback: () => this.flotant(I.x + Phaser.Math.Between(-30, 30), I.y - 90, Phaser.Utils.Array.GetRandom(['♪', '♫', '♩']), '#ffe08a') });
                z.esperar(1200, fet);
            } },
            // Abans d'obrir: l'Ineu convida l'Aldreu (que encara no, de cap cot i sense mirar)
            { fer: (z, fet) => { const p = pAld(); z.enquadrar(p[0], p[1], 1.35, 900, fet); } },
            { qui: 'Ineu', text: "Germà Aldreu, la gàbia s'obrirà. Podeu venir amb nosaltres." },
            { qui: 'Germà Aldreu', text: "Encara no." },
            { fer: (z, fet) => z.seq([
            f => {
                z.enquadrar(gx, base - 80, 1.05, 900, null);          // P41
                this.cameras.main.flash(500, 255, 230, 160);
                this.tweens.add({ targets: this.brillGabia, alpha: 1, duration: 600 });
                this.time.addEvent({ delay: 150, repeat: 14, callback: () => this.flotant(gx + Phaser.Math.Between(-150, 150), base - Phaser.Math.Between(60, 380), Phaser.Utils.Array.GetRandom(['♪', '♫', '♩']), '#ffe08a') });
                this.esperar(1400, f);
            },
            f => z.aldreuVa(gx + 320, base + 140, f, 150),
            f => {
                Sfx.secret();
                this.cameras.main.shake(2200, 0.004);
                z.enquadrar(gx, base - 380, 1.05, 2400, null, 0);     // tilt-up lent mentre puja la gàbia
                if (this.colGabia) { this.obstacles.remove(this.colGabia, true, true); this.colGabia = null; }
                this.tweens.add({ targets: this.gabiaGfx, y: -560, duration: 2400, ease: 'Sine.easeInOut' });
                this.tweens.add({ targets: this.brillGabia, alpha: 0, duration: 2400 });
                if (this.llumCapolls) { this.tweens.killTweensOf(this.llumCapolls); this.tweens.add({ targets: this.llumCapolls, alpha: 0, duration: 1600 }); }
                if (this.espurnesCapolls) this.espurnesCapolls.stop();
                this.esperar(2500, f);
            },
            f => {
                // P43: els capolls queden lliures i baixen davant de l'Ineu (tilt-down)
                z.enquadrar(gx, base + 90, 1.10, 1200, null, 0);
                this.capolls.forEach((c, i) => {
                    this.tweens.killTweensOf(c);
                    const n = NENS_GABIA[i], x = gx - 200 + i * 200, y = base + 160;
                    this.tweens.add({ targets: c, x, y: y - 40, duration: 1200, delay: i * 200, ease: 'Sine.easeInOut', onComplete: () => {
                        c.destroy();
                        this.crearCapoll(n, x, y);
                    } });
                });
                this.esperar(1900, f);
            },
            f => z.alliberarCamera(800, f)
        ], fet) }] }, () => {
            Estat.posaFlag('gabiaOberta');
            Estat.posaObjectiu("La gàbia és oberta! Als capolls de boira hi dormen els tres nens.");
            Estat.desar();
        });
    }

    // Runna trenca un capoll: el nen cau a terra, es desperta i riu (P50: pla mitjà del nen)
    capollTrencat(e) {
        const n = e.nen, x = e.spr.x, y = e.spr.y + 40;
        Estat.posaFlag(n.flag);
        this.tweens.add({ targets: e.spr, alpha: 0, duration: 300, onComplete: () => this.retirar(e) });
        e.ombra.setVisible(false);
        this.llum(x, y - 60, 0xffe8a0);
        const nen = this.posarNen(n, x, y);
        nen.setAlpha(0);
        this.tweens.add({ targets: [nen, nen.ombra], alpha: 1, duration: 400 });
        Estat.desar();
        this.enquadrar(x, y - 70, 1.5, 600, null);
        this.time.delayedCall(700, () => {
            Sfx.riure();
            this.ui().obrirDialeg(DIALEGS.nenGabia(n.id)(Estat), () => {
                if (this.totsLliures()) this.time.delayedCall(500, () => this.finalGabia());
                else this.alliberarCamera(600);
            });
        });
    }

    // Els nens riuen, la boira es desfà i l'Aldreu (trist -> somrient) tria quedar-se amb el seu Mestre
    finalGabia() {
        if (this.finalEngegat) return;
        this.finalEngegat = true;
        const gx = this.gx, base = this.base, I = this.ineu;
        if (!this.npcs.germa_aldreu) this.npc('germa_aldreu', gx + 320, base + 140, DIALEGS.aldreuGabia, { flipX: true });
        if (!this.aldreuEstat) this.aldreuTrist(this.npcs.germa_aldreu);
        const nens = NENS_GABIA.map(n => n.key);
        const pAld = () => { const a = this.npcs.germa_aldreu; return a ? [a.x, a.y - 0.8 * a.displayHeight] : [gx, base - 60]; };
        const pla = (obj, zoom, ms) => ({ fer: (z, fet) => { const p = obj(); z.enquadrar(p[0], p[1], zoom, ms, fet); } });
        this.ui().obrirDialeg({ pagines: [
            { fer: (z, fet) => z.seq([
                f => {                                                 // P51: pla general dels nens
                    let pend = 2; const llest = () => { if (--pend === 0) f(); };
                    z.ineuVa(gx - 60, base + 330, () => { z.posarDireccio('amunt', false); llest(); }, 210);
                    z.enquadrar(gx, base + 40, 1.0, 1000, llest);
                },
                f => {
                    Sfx.riure();
                    nens.forEach(k => z.npcSalta(k, null, 3));
                    this.time.delayedCall(500, () => z.aldreuAixeca(z.npcs.germa_aldreu));           // F4: per primer cop s'aixeca el cap
                    this.esperar(1300, f);
                },
                f => {
                    // P52: el riure desfà la boira: la cova s'aclareix
                    z.enquadrar(gx, base - 60, 1.05, 2000, null, 0);
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
                f => z.npcMira('germa_aldreu', gx, f)
            ], fet) },
            pla(pAld, 1.9, 900),                                       // P53: l'Aldreu escolta
            { qui: 'Germà Aldreu', text: "La seva veu em parlava dins el cap cada nit. Era l'única que em parlava." },
            { qui: 'Germà Aldreu', text: "Escolta'ls. Riuen tan fort... i ningú no els tanca." },
            pla(() => [I.x, I.y - 70], 1.5, 1),                        // P54
            { qui: 'Ineu', text: "Veniu amb nosaltres, Germà. A la taula del refectori hi ha lloc per a tothom." },
            // El somriure (el de la Plaça): suau, humil, una mica trist als ulls
            { fer: (z, fet) => { const p = pAld(); z.enquadrar(p[0], p[1], 1.9, 600, () => { z.esperar(700, () => { z.aldreuSomriu(z.npcs.germa_aldreu); z.esperar(600, fet); }); }); } },
            { qui: 'Germà Aldreu', text: "Ja ho sé que n'hi ha. Gràcies, Ineu." },
            { qui: 'Germà Aldreu', text: "El Mestre és aquí dins... Algú l'ha de vetllar. Algú que sàpiga què és no ser vist." },
            { fer: (z, fet) => { z.npcVa('germa_aldreu', gx, base + 10, null, 100); const a = z.npcs.germa_aldreu; z.enquadrar(gx, base + 10 - 0.8 * (a ? a.displayHeight : 100), 1.9, 1600, fet); } },
            { qui: 'Germà Aldreu', text: "Jo em quedo amb ell." },
            pla(() => [I.x, I.y - 70], 1.5, 1),
            { qui: 'Ineu', text: "Vindré a veure-us." },
            { qui: 'Germà Aldreu', text: "Ja ho sé." },
            { fer: (z, fet) => z.seq([
                f => {
                    // P55: la gàbia baixa, suau (tilt-down amb ella) i el tanca
                    z.enquadrar(gx, base - 200, 1.0, 900, () => {
                        z.enquadrar(gx, base - 60, 1.0, 1600, null, 0);
                        this.tweens.add({ targets: this.gabiaGfx, y: 0, duration: 1600, ease: 'Quad.easeIn', onComplete: () => {
                            Sfx.porta(); this.cameras.main.shake(400, 0.006);
                            this.llum(gx, base - 60, 0xffe8a0);
                            this.esperar(1200, f);
                        } });
                    }, 0);
                },
                f => {
                    // P56: primer pla entre barrots: l'Aldreu somriu, els nens saluden
                    z.enquadrar(gx, base - 60, 1.95, 900, null);
                    const a = z.npcs.germa_aldreu;
                    if (a) z.tweens.add({ targets: a, y: a.y - 3, yoyo: true, duration: 900 });
                    nens.forEach(k => z.npcSalta(k, null, 1));
                    this.esperar(1200 + 900, f);
                },
                f => {
                    // P57: reculada lenta, els nens corren cap a l'Ineu; el fosc només al final
                    z.enquadrar(gx, base - 40, 0.9, 3200, null, 0);
                    nens.forEach((k, i) => z.npcVa(k, this.ineu.x - 90 + i * 90, this.ineu.y + 70, null, 200));
                    this.esperar(1400, () => { Sfx.riure(); nens.forEach(k => z.npcSalta(k, null, 2)); });
                    this.esperar(2600, () => { this.cameras.main.fadeOut(1800, 0, 0, 0); this.esperar(1900, f); });
                }
            ], fet) }
        ] }, () => {
            Estat.posaFlag('andreuTancat');
            Estat.posaFlag('epilegPendent');
            Estat.posaObjectiu('Els nens tornen a riure. Al Santuari us esperen tots.');
            Estat.dades.zona = 'ZonaEsglesia'; Estat.dades.entrada = 'porta'; Estat.dades.x = null; Estat.dades.y = null;
            Estat.desar();
            this.canviant = true;
            this.scene.start('ZonaEsglesia', { entrada: 'porta' });
        });
    }
}
