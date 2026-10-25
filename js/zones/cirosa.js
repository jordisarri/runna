/**
 * LA CIROSA (extrem nord-est)
 * Camí llarg que puja des de les cel·les + la masia amb la pastura on espera el Pastor de Boira + l'interior del mas.
 */

// Diàlegs propis de la Cirosa
Object.assign(DIALEGS, {
    bancCami: E => ({ pagines: [{ qui: '', text: "Un banc de pedra a la vora del camí, amb una creu petita gravada al respatller: «Descansa, pelegrí.» Hi seus una estona i els peus et ho agraeixen." }],
        enAcabar: () => game.scene.getScene('ZonaCamiCirosa').descansar() }),

    masiaTaula: E => ({ pagines: E.flag('soparFet') ? [
        { qui: '', text: "La taula dels pastors. Hi ha tres plats d'escudella neta i un quart plat, a l'extrem, sense cullera." },
        { qui: 'Ineu', text: "(Per als que no tenen nom. Algú se n'ha recordat.)" }
    ] : [
        { qui: '', text: "Una taula llarga de pi, amb tres plats d'estany i un pa dur, mig rosegat. Tot és net i ordenat, com fan els qui no tenen res més que això." }
    ] }),

    masiaLlibre: E => ({ pagines: [
        { qui: '', text: "Un llibre de comptes de tapes de cuir ratllades, obert sobre un prestatge. La lletra és tremolosa i antiga: «Llibre del Ramat de la Cirosa»." },
        { qui: 'Llibre', text: "«El Mestre Gaspar baixava cada primavera amb els seus ocells enjaulats. Els nens reien amb ells; després ja no reien amb res. Hi va haver anys de plors a les cases.»" },
        { qui: 'Llibre', text: "«Els pastors i els monjos el vam tancar dins la seva gàbia, sota terra, i un monjo va segellar la porta amb la llum de l'espasa. El poble va estar content tres dies. Després va voler algú a qui culpar, i ens va culpar a nosaltres.»" },
        { qui: 'Llibre', text: "«Que qui trobi això no ens oblidi: vam obrir els ulls abans que ningú. Només vam fer el que calia.»" }
    ] }),

    masiaEsquelles: E => ({ pagines: E.te('esquelles') ? [
        { qui: '', text: "Una biga de la paret amb ganxos de ferro. Les esquelles que penjaven aquí són ara al teu sarró; només en queda la marca, més neta, a la fusta." }
    ] : E.flag('pastorVencut') ? [
        { qui: '', text: "Una biga de la paret amb ganxos de ferro, buits. A la fusta es veu, més neta, la marca de cada esquella que hi va penjar durant segles." },
        { qui: 'Ineu', text: "(El pastor vell les té. Li he de parlar vora el foc.)" }
    ] : [
        { qui: '', text: "Una biga de la paret amb ganxos de ferro, buits. A la fusta es veu, més neta, la marca de cada esquella que hi va penjar durant segles." },
        { qui: 'Ineu', text: "(Qui sap on són ara. Potser els pastors les guarden.)" }
    ] }),

    masiaLlar: E => ({ pagines: [
        { qui: '', text: "Una llar gran de pedra, amb un foc petit que mai no s'apaga del tot. Penja una olla fumejant d'un ganxo i a prop hi ha un bagul de llenya tallada." },
        { fer: (z, fet) => { z.ajupir('ineu', null, 900); z.llum(z.ineu.x, z.ineu.y - 60, 0xffb060, fet); } },
    ], enAcabar: () => game.scene.getScene('ZonaMasiaCirosa').descansar() })
});

// ---------------- CAMÍ DE LA CIROSA ----------------
class ZonaCamiCirosa extends ZonaBase {
    constructor() {
        super('ZonaCamiCirosa', {
            pins: { pi: 0.5 },
            nom: 'Camí de la Cirosa',
            amplada: 1400,
            alcada: 2200,
            colorFons: '#1f3a1a',
            entrades: {
                tiller: { x: 700, y: 2130, dir: 'amunt' },
                cirosa: { x: 580, y: 80,   dir: 'avall' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1400, 2200, -1100);
        // Camí en zig-zag (rectangles de terra; l'Ineu puja de baix a dalt)
        const tram = [
            [620, 1750, 160, 450],   // des de les cel·les
            [300, 1750, 480, 150],
            [300, 1250, 160, 650],
            [300, 1250, 700, 150],
            [860, 700, 160, 700],
            [500, 700, 520, 150],
            [500, 0, 160, 850]       // cap a la Cirosa
        ];
        tram.forEach(([x, y, w, h]) => this.terra('cami', x, y, w, h));

        // Bosc a banda i banda: arbres en graella, deixant lliure el camí
        let llavor = 23;
        const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
        for (let y = 60; y < 2200; y += 150) {
            for (let x = 60; x < 1400; x += 170) {
                const px = x + (rnd() - 0.5) * 80, py = y + (rnd() - 0.5) * 70;
                if (tram.some(([tx, ty, tw, th]) => px > tx - 90 && px < tx + tw + 90 && py > ty - 70 && py < ty + th + 90)) continue;
                this.posar('arbre', px, py, { col: { w: 34, h: 16 } });
            }
        }
        // Roques al marge del camí (de moment només decoració)
        [[560, 1980], [880, 2050], [270, 1600], [480, 1330], [930, 1100], [1060, 800], [440, 760], [700, 300]].forEach(([x, y]) => this.posar('roca', x, y, { col: { w: 70, h: 26 } }));

        // Cartells a cada tram del camí i un banc de pedra a mig pujar (hi reposes i es desa la partida)
        this.posar('banc', 560, 1228, { col: { w: 130, h: 22 } });
        this.interactiu(560, 1238, 95, DIALEGS.bancCami, { altura: 70 });

        // Ramat: de boira i hostil fins que el Pastor cau; després, ovelles blanques que pasturen tranquil·les
        const net = Estat.flag('pastorVencut');
        [[420, 1830], [750, 1550], [380, 1330], [930, 1000], [700, 770], [580, 400]].forEach(([x, y], i) => {
            if (!net) { this.enemic('ovella', x, y); return; }
            const o = this.posar('ovella', x, y, { fonsY: y });
            this.pasturar(o, 80);
        });
        [[700, 2000], [330, 1500], [560, 560]].forEach(([x, y]) => this.enemic('escolopendra', x, y));
        // Flors de pastura i pedres a la vora del camí
        [[640, 1990], [340, 1650], [940, 1330], [440, 1180], [1000, 650], [560, 620], [430, 250], [640, 150]].forEach(([x, y]) => this.posar('flors', x, y, { fonsY: y - 10 }));

        this.boira(700, 1400, 500, 120, 0.8);
        this.sortida(620, 2186, 160, 14, 'ZonaTiller', 'cirosa');
        this.sortida(500, 0, 160, 14, 'ZonaCirosa', 'cami');
        this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x3a1a55, net ? 0 : 0.09).setScrollFactor(0).setDepth(90000);
    }

    // Repòs al banc: es cura i es desa la partida
    descansar() {
        Estat.dades.vida = Estat.dades.corsMax * 2;
        this.ui().actualitzarHUD(); this.guardarPosicio(); Estat.desar();
        this.ui().notifica('Partida desada');
    }
}

// ---------------- LA CIROSA (masia i pastura) ----------------
class ZonaCirosa extends ZonaBase {
    constructor() {
        super('ZonaCirosa', {
            pins: { pi: 0.45 },
            nom: 'La Cirosa',
            amplada: 1800,
            alcada: 1200,
            entrades: { cami: { x: 580, y: 1120, dir: 'amunt' }, masia: { x: 380, y: 600, dir: 'avall' } }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1800, 1200, -1100);
        this.terra('cami', 500, 500, 160, 700);           // des del camí llarg
        this.terra('cami', 200, 500, 800, 140);           // davant la masia i cap a la pastura

        // La masia (mas vell i descurat) amb la porta que duu a dins
        const masia = this.edifici('masia', 380, 520, 520, 90, 'ZonaMasiaCirosa', 'porta', { alt: 110 }).setTint(0xc8b8a0);
        this.portaMasia(masia, 380, 520);
        this.posar('barril', 830, 570, { col: { w: 40, h: 16 } });
        this.posar('barril', 875, 580, { col: { w: 40, h: 16 } });
        this.posar('llenya', 110, 580, { col: { w: 90, h: 22 } });
        this.posar('banc', 560, 570, { col: { w: 110, h: 20 } });
        // El pou, a la vora de la masia
        this.pou(790, 440);
        // Bales de palla a la vora de la tanca, dins la pastura
        [[1080, 240], [1120, 250], [1100, 215], [1110, 960], [1150, 980]].forEach(([x, y]) => this.bala(x, y));

        // Els pastors desterrats (sense nom), al voltant d'un foc a l'esquerra del camí
        this.foc = this.posar('foc', 280, 720, { col: { w: 40, h: 16 } });
        this.tweens.add({ targets: this.foc, scaleY: this.foc.scaleY * 1.08, yoyo: true, repeat: -1, duration: 260 });
        this.resplendor = this.add.circle(280, 680, 130, 0xff9a30, 0.12).setDepth(940);
        this.tweens.add({ targets: this.resplendor, alpha: 0.2, yoyo: true, repeat: -1, duration: 400 });
        this.llocFlauta('foc', 280, 715, 200, false, () => Estat.flag('soparObert') && !Estat.flag('pastorsConvencuts'), true);   // només quan toca convèncer els pastors; passa davant d'ells   // música vora el foc dels pastors
        this.npc('pastor_a', 200, 740, DIALEGS.pastorA, { flipX: false });
        this.npc('pastor_b', 370, 755, DIALEGS.pastorB, { flipX: true });
        this.npc('pastor_vell', 285, 650, DIALEGS.pastorVell);

        // La pastura de la dreta: oberta del tot. Només es tanca amb unes tanques de fusta quan comença el combat contra el Pastor
        this.terra('herba', 1032, 160, 740, 860, -1050).setTint(0xcdeaa0);

        // Ovelles del ramat (decoratives): lila i adormides mentre el Pastor hi és
        const lila = !Estat.flag('pastorVencut');
        [[1200, 330], [1500, 420], [1650, 700], [1350, 880], [1580, 930], [1250, 560], [1700, 300], [1100, 840]].forEach(([x, y]) => {
            const o = this.posar('ovella', x, y, { fonsY: y });
            if (lila) o.setTint(0xcdb8e8);
            else this.pasturar(o, 90);
        });

        // El Germà Andreu, de Pastor de Boira, al mig de la pastura
        if (lila) {
            // (sense col·lisió: el boss hi apareixerà al mateix lloc)
            this.andreuNpc = this.posar('pastor_boira', 1400, 640);
            this.andreuOmbra = this.add.image(1400, 640, 'ombra').setScale(0.5).setDepth(-500);
            this.andreuNpc.ombra = this.andreuOmbra;
            (this.npcs = this.npcs || {}).andreu = this.andreuNpc;
            this.interactiu(1400, 630, 95, DIALEGS.andreuPastor, { altura: this.andreuNpc.displayHeight + 6, actiu: () => !this.bossIniciat });
        }

        this.arbres([[100, 150], [260, 90], [500, 120], [800, 100], [900, 280], [140, 420], [40, 1100], [820, 1100],
                     [900, 950], [940, 480], [1760, 120], [1760, 1100], [1100, 1120], [1400, 1130]]);
        this.muralla(0, 1186, 460, 1186, 90, 'arbre', false);
        this.muralla(700, 1186, 1020, 1186, 90, 'arbre', false);

        this.sortida(500, 1186, 160, 14, 'ZonaCamiCirosa', 'cirosa');
        this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x3a1a55, lila ? 0.12 : 0).setScrollFactor(0).setDepth(90000);
    }

    // Pou de pedra baix, amb corriola de fusta
    pou(x, y) {
        const g = this.add.graphics().setDepth(y);
        g.fillStyle(0x000000, 0.25).fillEllipse(x, y + 4, 90, 24);
        g.fillStyle(0x6a6458, 1).fillRect(x - 36, y - 38, 72, 40).fillStyle(0x8a8478, 1).fillEllipse(x, y - 38, 72, 24);
        g.fillStyle(0x151a22, 1).fillEllipse(x, y - 38, 52, 14);
        g.lineStyle(2, 0x2a2620, 0.6); for (let r = 0; r < 3; r++) g.lineBetween(x - 36, y - 26 + r * 12, x + 36, y - 26 + r * 12);
        g.fillStyle(0x5a3a1e, 1).fillRect(x - 36, y - 98, 6, 62).fillRect(x + 30, y - 98, 6, 62).fillRect(x - 38, y - 100, 76, 6);
        g.fillStyle(0x4a2c14, 1).fillRect(x - 3, y - 94, 6, 26).fillRect(x - 6, y - 70, 12, 10);
        this.colisio(x, y - 10, 80, 26);
    }

    // Bala de palla rodona
    bala(x, y) {
        const g = this.add.graphics().setDepth(y);
        g.fillStyle(0x000000, 0.2).fillEllipse(x, y + 4, 60, 14);
        g.fillStyle(0xcaa84a, 1).fillCircle(x, y - 18, 22);
        g.lineStyle(2, 0x8a6a28, 0.8).strokeCircle(x, y - 18, 22).strokeCircle(x, y - 18, 14).strokeCircle(x, y - 18, 6);
        this.colisio(x, y - 8, 40, 18);
    }

    // Els pastors escolten música vora el foc: es convencen d'anar al sopar del Til·ler
    enMelodia(nom) {
        if (Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, 280, 720) > 380) return false;
        if (!Estat.flag('soparObert')) {
            this.flotant(280, 580, 'Els pastors t\'escolten en silenci... (encara no és el moment: parla amb el Til·ler)', '#ffd9a0');
            return true;
        }
        if (Estat.flag('pastorsConvencuts')) { this.flotant(280, 580, 'Els pastors somriuen', '#ffd9a0'); return true; }
        this.ui().obrirDialeg(DIALEGS.pastorsConvencuts(Estat), () => Estat.desar());
        return true;
    }

    // Vençut, el Pastor cau de genolls i la boira li surt del cos
    andreuAgenollat(fet) {
        const e = this.bossCaigut;
        if (!e || !e.spr.active) { fet(); return; }
        this.tweens.add({ targets: e.spr, angle: 0, scaleY: e.spr.scaleY * 0.78, duration: 500 });
        const p = this.add.particles(e.spr.x, e.spr.y - 60, 'boira', { speed: { min: 20, max: 70 }, lifespan: 1600, scale: { start: 0.8, end: 2.5 }, alpha: { start: 0.6, end: 0 }, tint: [0x9a50ff, 0xb88aff], quantity: 2, frequency: 60 }).setDepth(e.spr.depth + 1);
        this.time.delayedCall(1500, () => { p.stop(); this.time.delayedCall(1600, () => p.destroy()); fet(); });
    }
    // S'aixeca, riu i se'n va camí avall, cap a la Taverna
    andreuMarxa(fet) {
        const e = this.bossCaigut;
        if (!e || !e.spr.active) { fet(); return; }
        this.tweens.add({ targets: e.spr, scaleY: e.spr.scaleY / 0.78, duration: 400, onComplete: () => {
            this.flotant(e.spr.x, e.spr.y - 160, 'je, je, je...', '#d8c8ff');
            if (e.spr.body) e.spr.body.enable = false;
            this.tweens.add({ targets: e.spr, angle: { from: -4, to: 4 }, yoyo: true, repeat: -1, duration: 160 });
            this.tweens.add({ targets: [e.spr, e.ombra].filter(Boolean), x: 580, y: 1150, duration: 2600, onComplete: () => {
                this.tweens.add({ targets: [e.spr, e.ombra].filter(Boolean), alpha: 0, duration: 400, onComplete: fet });
            } });
        } });
    }

    // Tanques de fusta que apareixen al voltant de la pastura quan comença el combat: no es pot sortir de l'arena fins que el Pastor cau
    tancarArena() {
        if (this.tanques) return;
        const A = { x0: 1040, y0: 170, x1: 1780, y1: 1010 }, T = 60, peces = [], cols = [];
        const peca = (px, py, vertical) => {
            const g = this.add.graphics().setDepth(py + 2).setAlpha(0);
            g.fillStyle(0x000000, 0.22).fillEllipse(px, py + 2, 22, 8);
            g.fillStyle(0x7a5430, 1).lineStyle(2, 0x2a1a0c, 1);
            if (vertical) g.fillRect(px - 3, py - 22, 6, T).strokeRect(px - 3, py - 22, 6, T).fillRect(px - 3, py - 10, 6, T).strokeRect(px - 3, py - 10, 6, T);
            else g.fillRect(px, py - 28, T, 6).strokeRect(px, py - 28, T, 6).fillRect(px, py - 14, T, 6).strokeRect(px, py - 14, T, 6);
            g.fillStyle(0x5a3a1e, 1).fillRect(px - 6, py - 38, 12, 42).strokeRect(px - 6, py - 38, 12, 42);
            g.fillStyle(0x9a7040, 1).fillRect(px - 6, py - 38, 12, 6);
            peces.push(g);
        };
        for (let x = A.x0; x <= A.x1; x += T) { peca(x, A.y0, false); peca(x, A.y1, false); }
        for (let y = A.y0 + T; y < A.y1; y += T) { peca(A.x0, y, true); peca(A.x1, y, true); }
        const gruix = 22;
        [[(A.x0 + A.x1) / 2, A.y0 - 12, A.x1 - A.x0 + T, gruix], [(A.x0 + A.x1) / 2, A.y1 - 12, A.x1 - A.x0 + T, gruix],
         [A.x0, (A.y0 + A.y1) / 2, gruix, A.y1 - A.y0], [A.x1, (A.y0 + A.y1) / 2, gruix, A.y1 - A.y0]].forEach(([x, y, w, h]) => cols.push(this.colisio(x, y, w, h)));
        this.tanques = { peces, cols };
        this.tweens.add({ targets: peces, alpha: 1, duration: 500 });
        Sfx.porta();
    }

    treureTanques() {
        const T = this.tanques;
        if (!T) return;
        this.tanques = null;
        T.cols.forEach(c => this.obstacles.remove(c, true, true));
        this.tweens.add({ targets: T.peces, alpha: 0, duration: 600, onComplete: () => T.peces.forEach(g => g.destroy()) });
    }

    // El Pastor de Boira es posa en marxa després del diàleg
    iniciarBoss() {
        if (this.bossIniciat) return;
        this.bossIniciat = true;
        this.andreuNpc.setVisible(false); this.andreuOmbra.setVisible(false);
        const e = this.enemic('pastor', 1400, 570);
        if (!e) { this.bossIniciat = false; this.andreuNpc.setVisible(true); this.andreuOmbra.setVisible(true); return; }
        this.cameras.main.shake(300, 0.005);
        this.tancarArena();
        this.flotant(1400, 520, 'Be-e-e-e!', '#e0a0ff');
        this.ui().notifica('Pastor de Boira: allunya\'t de les envestides i colpeja quan quedi cansat');
    }
}

// ---------------- EL MAS DE LA CIROSA (interior) ----------------
// La casa dels pastors desterrats: pobra però neta. Hi ha la llar (hi reposes), un llibre de comptes amb la història de la gàbia i la biga buida de les esquelles.
class ZonaMasiaCirosa extends ZonaBase {
    constructor() {
        super('ZonaMasiaCirosa', {
            nom: 'El Mas de la Cirosa',
            amplada: 900,
            alcada: 700,
            colorFons: '#140e0a',
            pacifica: true,
            entrades: { porta: { x: 450, y: 600, dir: 'amunt' } }
        });
    }

    construir() {
        this.terra('taulons', 100, 40, 700, 660, -1100).setTint(0x8a7a5a);
        // Parets de pedra a l'estil del país, amb sòcol fosc i una biga
        const murs = this.add.graphics().setDepth(-990);
        murs.fillStyle(0x120a04, 1).fillRect(58, 0, 784, 100);
        murs.fillStyle(0x6a5c48, 1).fillRect(60, 0, 780, 96);
        murs.lineStyle(1.5, 0x2a2014, 0.45);
        for (let y = 20, r = 0; y < 96; y += 22, r++) { murs.lineBetween(60, y, 840, y); for (let x = 60 + (r % 2) * 40; x < 840; x += 80) murs.lineBetween(x, y, x, y - 22); }
        murs.fillStyle(0x3a2412, 1).fillRect(58, 92, 784, 10);
        murs.fillStyle(0x4a3018, 1).fillRect(30, 0, 30, 700).fillRect(840, 0, 30, 700);
        this.colisio(30, 350, 60, 700);
        this.colisio(870, 350, 60, 700);
        this.colisio(450, 60, 700, 120);
        this.colisio(280, 690, 360, 20);
        this.colisio(620, 690, 360, 20);

        // Finestreta amb un feix de llum
        const fin = this.add.graphics().setDepth(-980);
        fin.fillStyle(0x120a04, 1).fillRect(176, 16, 70, 60);
        fin.fillStyle(0xd8e0f0, 0.9).fillRect(182, 22, 58, 48);
        fin.lineStyle(5, 0x5a3a1e, 1).strokeRect(180, 20, 62, 52).lineBetween(211, 20, 211, 72).lineBetween(180, 46, 242, 46);
        this.add.graphics().setDepth(-900).fillStyle(0xe8f0ff, 0.1).fillPoints([{ x: 182, y: 90 }, { x: 240, y: 90 }, { x: 320, y: 320 }, { x: 220, y: 320 }], true);

        // La llar, al mig de la paret del fons: arc de pedra, foc i olla
        const llar = this.add.graphics().setDepth(-960);
        llar.fillStyle(0x120a04, 1).fillRect(364, 30, 172, 120);
        llar.fillStyle(0x4a4034, 1).fillRect(370, 36, 160, 110);
        llar.fillStyle(0x0c0806, 1).fillRect(388, 60, 124, 86);
        llar.lineStyle(3, 0x120a04, 1).strokeRect(370, 36, 160, 110);
        this.foc = this.posar('foc', 450, 126, { fonsY: 126, col: { w: 60, h: 16 } });
        this.tweens.add({ targets: this.foc, scaleY: this.foc.scaleY * 1.08, yoyo: true, repeat: -1, duration: 260 });
        this.add.circle(450, 150, 140, 0xff9a30, 0.12).setDepth(300);
        this.interactiu(450, 170, 100, DIALEGS.masiaLlar, { altura: 100 });
        this.posar('olla', 560, 170, { col: { w: 56, h: 22 } });

        // Biga amb ganxos buits (per les esquelles) a la paret de la dreta
        const biga = this.add.graphics().setDepth(-940);
        biga.fillStyle(0x3a2412, 1).fillRect(600, 58, 200, 10).lineStyle(2, 0x120a04, 1).strokeRect(600, 58, 200, 10);
        [630, 670, 710, 750, 780].forEach(x => biga.lineStyle(3, 0x2a2a2e, 1).lineBetween(x, 68, x, 78).strokeCircle(x, 82, 4));
        this.interactiu(700, 100, 100, DIALEGS.masiaEsquelles, { altura: 60 });

        // El llibre del ramat, sobre un prestatge, a l'esquerra
        const pres = this.add.graphics().setDepth(-940);
        pres.fillStyle(0x4a2c14, 1).fillRect(110, 56, 150, 8).lineStyle(2, 0x120a04, 1).strokeRect(110, 56, 150, 8);
        pres.fillStyle(0x7a2a1a, 1).fillRect(132, 34, 38, 22).fillStyle(0x3a4a6a, 1).fillRect(176, 28, 22, 28).fillStyle(0x5a3a1e, 1).fillRect(204, 38, 44, 18);
        this.interactiu(180, 100, 90, DIALEGS.masiaLlibre, { altura: 60 });

        // Taula llarga i tamborets
        this.posar('taula', 330, 330, { col: { w: 170, h: 30 } });
        [[270, 370], [330, 372], [390, 370]].forEach(([x, y]) => this.posar('tamboret', x, y, { col: { w: 36, h: 14 } }));
        this.interactiu(330, 345, 110, DIALEGS.masiaTaula, { altura: 60 });

        // Jaços de palla amb manta, a la dreta
        [[690, 300], [690, 440]].forEach(([x, y], i) => {
            const j = this.add.graphics().setDepth(y);
            j.fillStyle(0x2a1608, 1).fillRoundedRect(x - 90, y - 40, 180, 76, 10);
            j.fillStyle(0xc8b060, 1).fillRoundedRect(x - 84, y - 34, 168, 64, 8);
            for (let k = 0; k < 18; k++) j.lineStyle(2, 0x8a7430, 1).lineBetween(x - 78 + k * 9, y - 28, x - 72 + k * 9, y + 24);
            j.fillStyle(i ? 0x6a8a4a : 0x8a3a3a, 1).fillRoundedRect(x - 40, y - 30, 116, 56, 6).lineStyle(2, 0x1a1008, 1).strokeRoundedRect(x - 40, y - 30, 116, 56, 6);
            j.fillStyle(0xf2ecdc, 1).fillRoundedRect(x - 76, y - 28, 30, 48, 8);
            this.colisio(x, y - 2, 176, 62);
        });
        // Barrils i llenya
        this.posar('barril', 130, 560, { col: { w: 50, h: 22 } });
        this.posar('barril', 185, 545, { col: { w: 50, h: 22 } });
        this.posar('llenya', 740, 600, { col: { w: 100, h: 24 } });
        [[300, 470], [380, 500]].forEach(([x, y]) => this.posar('flors', x, y, { fonsY: y - 10 }));

        this.add.rectangle(450, 350, 700, 700, 0xffd38a, 0.06).setDepth(80000);
        this.sortida(410, 672, 80, 22, 'ZonaCirosa', 'masia');
    }

    // Repòs vora la llar: es cura i es desa la partida
    descansar() {
        Estat.dades.vida = Estat.dades.corsMax * 2;
        this.ui().actualitzarHUD(); this.guardarPosicio(); Estat.desar();
        this.ui().notifica('Partida desada');
    }
}
