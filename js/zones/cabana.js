/**
 * LA CABANA DE LA JAUMETA: molt lluny, al mig del bosc. Només s'hi arriba per un portal màgic:
 * l'Alzina Buida del Bosc de Sant Joan (cal portar-hi aigua de la font) o el cercle de bolets de la Rovellonera.
 */

// Parets de troncs d'un interior petit (900x700): al fons quatre fileres de troncs horitzontals i als costats les puntes
// dels troncs, amb els seus anells. També les fa servir la cabana amagada del Camí de la Desaparició.
function paretsTroncs(escena) {
    const murs = escena.add.graphics().setDepth(-990);
    const TRONCS = ['#7a4e2a', '#8a5a30', '#6e4624', '#94643a', '#80542c'];
    for (let f = 0; f < 4; f++) {
        const y = f * 23, col = Phaser.Display.Color.HexStringToColor(TRONCS[f % TRONCS.length]).color;
        murs.fillStyle(0x120a04, 1).fillRoundedRect(58, y, 784, 24, 11);
        murs.fillStyle(col, 1).fillRoundedRect(60, y + 1, 780, 21, 10);
        murs.fillStyle(0xffd9a0, 0.22).fillRect(70, y + 3, 760, 3);
        murs.fillStyle(0x000000, 0.25).fillRect(70, y + 17, 760, 4);
        murs.lineStyle(1, 0x3a2010, 0.5);
        for (let k = 0; k < 6; k++) { const yy = y + 7 + (k % 3) * 4, x0 = 90 + k * 125 + f * 23; murs.lineBetween(x0, yy, x0 + 70, yy); }
    }
    murs.fillStyle(0x120a04, 1).fillRect(58, 92, 784, 6);                                  // sòcol fosc
    [80, 820].forEach(x => {
        for (let y = 92, i = 0; y < 700; y += 24, i++) {
            murs.fillStyle(0x120a04, 1).fillEllipse(x, y + 12, 44, 25);
            murs.fillStyle(0x5a3a1e, 1).fillEllipse(x, y + 12, 40, 22);
            murs.fillStyle(i % 2 ? 0xc89458 : 0xd8a868, 1).fillEllipse(x, y + 12, 32, 17);
            murs.lineStyle(1, 0x7a4a20, 0.6).strokeEllipse(x, y + 12, 22, 11).strokeEllipse(x, y + 12, 11, 5);
        }
    });
    return murs;
}

// Manat d'herbes penjat d'una corda (de x, y cap avall)
function manatHerbes(escena, x, y, llarg = 44, colors = [0x5f9a3a, 0x7a5ab0, 0x4c8430]) {
    const g = escena.add.graphics().setDepth(-940);
    g.lineStyle(2, 0x3a2410, 1).lineBetween(x, y, x, y + 10);
    colors.forEach((col, k) => {
        const dx = (k - 1) * 6;
        g.fillStyle(col, 1).lineStyle(1.2, 0x1e3a12, 1);
        g.fillTriangle(x, y + 9, x + dx - 4, y + llarg - 4 * (k % 2), x + dx + 4, y + llarg - 4 * ((k + 1) % 2));
        g.strokeTriangle(x, y + 9, x + dx - 4, y + llarg - 4 * (k % 2), x + dx + 4, y + llarg - 4 * ((k + 1) % 2));
    });
    g.fillStyle(0xc8a050, 1).fillRect(x - 4, y + 8, 8, 3);
    return g;
}

// Teranyina a una cantonada: fils des del vèrtex (x, y) cap a (sx, sy) i (sx2, sy2), amb arcs entremig
function teranyina(escena, x, y, sx, sy, sx2, sy2) {
    const g = escena.add.graphics().setDepth(-930).lineStyle(1, 0xe8e8e0, 0.45);
    g.lineBetween(x, y, sx, sy); g.lineBetween(x, y, sx2, sy2); g.lineBetween(x, y, (sx + sx2) / 2, (sy + sy2) / 2);
    for (let k = 1; k <= 4; k++) {
        const f = k / 4.5;
        g.lineBetween(x + (sx - x) * f, y + (sy - y) * f, x + (sx2 - x) * f, y + (sy2 - y) * f);
    }
    return g;
}

class ZonaCabana extends ZonaBase {
    constructor() {
        super('ZonaCabana', {
            pins: { pi: 0.3 },
            nom: 'La cabana de la Jaumeta',
            amplada: 1400,
            alcada: 1000,
            colorFons: '#14301a',
            entrades: {
                portal:   { x: 320, y: 840, dir: 'dreta' },
                interior: { x: 800, y: 640, dir: 'avall' }
            }
        });
    }

    // Tanca de pals i dues travesses entre dos punts (només decorativa; la col·lisió la posa qui la crida)
    tanca(x1, y1, x2, y2) {
        const g = this.add.graphics().setDepth(Math.max(y1, y2));
        const n = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / 26));
        [-22, -11].forEach(dy => g.lineStyle(4, 0x2a1608, 1).lineBetween(x1, y1 + dy, x2, y2 + dy).lineStyle(2.4, 0x9a6a3a, 1).lineBetween(x1, y1 + dy, x2, y2 + dy));
        for (let i = 0; i <= n; i++) {
            const x = x1 + (x2 - x1) * i / n, y = y1 + (y2 - y1) * i / n + (i % 3) * 1.5;
            g.fillStyle(0x2a1608, 1).fillRect(x - 4, y - 30, 8, 32);
            g.fillStyle(i % 2 ? 0x8a5a2e : 0x9a6a3a, 1).fillRect(x - 3, y - 29, 6, 30);
            g.fillStyle(0xffe0a0, 0.3).fillRect(x - 3, y - 29, 1.6, 30);
        }
        return g;
    }

    construir() {
        this.terra('herba_fosca', 0, 0, 1400, 1000, -1100).setTint(0xb8e0a8);
        this.terra('cami', 760, 620, 90, 380).setAlpha(0.8);

        // Pedres planes al llindar i vora del camí
        const pedres = this.add.graphics().setDepth(-1000);
        [[775, 650, 22, 9], [832, 664, 20, 8], [790, 700, 24, 9], [818, 756, 18, 8], [770, 820, 22, 9], [840, 880, 20, 8]].forEach(([x, y, rx, ry]) => {
            pedres.fillStyle(0x8c8a82, 1).fillEllipse(x, y, rx * 2, ry * 2).lineStyle(2, 0x2a2824, 0.8).strokeEllipse(x, y, rx * 2, ry * 2);
            pedres.fillStyle(0xffffff, 0.18).fillEllipse(x - 4, y - 2, rx, ry * 0.7);
        });

        // La cabana, bruta i deixada
        const cabana = this.edifici('cabana', 800, 590, 360, 80, 'ZonaCabanaInt', 'porta', { alt: 95 });
        const cT = 590 - cabana.displayHeight;
        this.portaAnimada({ x: 800, top: cT + cabana.displayHeight * 0.58, bottom: 590 - 11, ample: 76, fons: 570, unic: true, retall: cabana });   // la porta de taulons del gràfic, que s'obre
        this.posar('olla', 1000, 660, { col: { w: 50, h: 20 } });
        this.add.circle(1000, 600, 55, 0x9ae060, 0.12).setDepth(660);
        this.boira(790, 300, 140, 60, 0.5);
        this.add.circle(740, 620, 40, 0xc6f090, 0.1).setDepth(595);          // la llum del farol de la porta

        // Llenya, barrils d'aigua de pluja i el tronc de picar, a prop de la façana
        this.posar('llenya', 925, 600, { col: { w: 110, h: 26 } });
        this.posar('barril', 600, 600, { col: { w: 50, h: 22 } });
        this.posar('tronc_tall', 640, 690, { col: { w: 70, h: 24 } });

        // Hortet d'herbes tancat amb una tanca de pals
        const hort = this.add.graphics().setDepth(-900);
        hort.fillStyle(0x4a3220, 1).fillRoundedRect(475, 740, 180, 70, 8);
        for (let r = 0; r < 4; r++) hort.fillStyle(0x3a2616, 1).fillRect(485, 748 + r * 15, 160, 6);
        [['romani', 505], ['farigola', 545], ['herba_sj', 585], ['romani', 625]].forEach(([k, x], i) => this.posar(k, x, 770 + (i % 2) * 22, { fonsY: 800, escala: 0.55 }));
        this.tanca(470, 800, 660, 800); this.tanca(470, 800, 470, 735); this.tanca(660, 800, 660, 735);
        this.colisio(565, 765, 200, 80);

        // Estenedor amb roba vella entre dos pals, a la dreta
        const est = this.add.graphics().setDepth(715);
        [[1110, 715], [1260, 720]].forEach(([x, y]) => { est.fillStyle(0x2a1608, 1).fillRect(x - 5, y - 90, 10, 92); est.fillStyle(0x8a5a2e, 1).fillRect(x - 3.5, y - 89, 7, 90); });
        est.lineStyle(2, 0xd8d0b8, 1).beginPath(); est.moveTo(1110, 632); est.lineTo(1185, 646); est.lineTo(1260, 634); est.strokePath();
        [[1136, 640, 0x6a8a3a], [1176, 646, 0xb8a46a], [1220, 645, 0x8a5a6a]].forEach(([x, y, col]) => {
            est.fillStyle(col, 1).lineStyle(1.6, 0x2a1608, 0.9).fillRect(x - 12, y, 24, 34).strokeRect(x - 12, y, 24, 34);
            est.fillStyle(0xffffff, 0.2).fillRect(x - 10, y + 2, 5, 28);
        });
        this.colisio(1110, 712, 16, 10); this.colisio(1260, 717, 16, 10);

        // Cercle de bolets: el portal de tornada
        this.cercle = this.posar('cercle_bolets', 320, 880, { fonsY: -800 });
        this.resplandor = this.add.circle(320, 860, 90, 0xb0ffb0, 0.12).setDepth(861);
        this.tweens.add({ targets: this.resplandor, alpha: 0.28, yoyo: true, repeat: -1, duration: 900 });
        this.interactiu(320, 870, 90, DIALEGS.portalTornada, {
            altura: 40,
            enTancar: () => {
                const rov = Estat.dades.portalTorna === 'rov';
                this.canviarZona(rov ? 'ZonaRovellonera' : 'ZonaBosc', 'portal');
            }
        });

        // Ocells als arbres (la Jaumeta hi parla)
        [[560, 280], [1180, 360], [380, 430], [1100, 760], [650, 860]].forEach(([x, y], i) => {
            const o = this.posar('ocell', x, y, { fonsY: y });
            this.tweens.add({ targets: o, y: y - 6, yoyo: true, repeat: -1, duration: 600 + i * 90, delay: i * 130 });
        });

        // Roba estesa, sacs, calaixos... tot abandonat
        [[1120, 520], [480, 560], [700, 780]].forEach(([x, y]) => this.posar('flors', x, y, { fonsY: y - 20 }));
        [[1100, 880], [400, 780]].forEach(([x, y]) => this.posar('roca', x, y, { col: { w: 60, h: 24 } }));

        this.arbres([[120, 150], [300, 90], [520, 130], [820, 90], [1050, 130], [1280, 160], [90, 520], [140, 800],
                     [400, 980], [1000, 980], [1280, 880], [1300, 560], [200, 340], [1180, 280]]);
        // Les bestioles no arriben tan lluny: només algun bolet mal-humorat
        this.enemic('bolet', 1150, 880);

        // Lluernes verdes que voleien per davant de la cabana
        for (let i = 0; i < 14; i++) {
            const x = 520 + Math.random() * 640, y = 520 + Math.random() * 360;
            const l = this.add.circle(x, y, 2.4, 0xd8ff7a, 0.9).setDepth(85000);
            this.tweens.add({ targets: l, x: x + (Math.random() - 0.5) * 120, y: y + (Math.random() - 0.5) * 90, alpha: 0.15, yoyo: true, repeat: -1, duration: 1800 + Math.random() * 1800, delay: Math.random() * 1500, ease: 'Sine.easeInOut' });
        }
        this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x0a3010, 0.12).setScrollFactor(0).setDepth(90000);
    }
}

class ZonaCabanaInt extends ZonaBase {
    constructor() {
        super('ZonaCabanaInt', {
            nom: 'Dins la cabana',
            amplada: 900,
            alcada: 700,
            colorFons: '#140e0a',
            pacifica: true,
            entrades: { porta: { x: 450, y: 600, dir: 'amunt' } }
        });
    }

    construir() {
        this.terra('taulons', 100, 40, 700, 660, -1100).setTint(0xa8a070);
        paretsTroncs(this);
        // Molsa a les juntes de la paret del fons
        const molsa = this.add.graphics().setDepth(-985);
        [[120, 90, 60], [300, 92, 40], [610, 90, 80], [760, 92, 44]].forEach(([x, y, r]) => { molsa.fillStyle(0x4f8a34, 0.7).fillEllipse(x, y, r, 10); molsa.fillStyle(0x7ab652, 0.5).fillEllipse(x + 4, y - 2, r * 0.6, 6); });
        this.colisio(30, 350, 60, 700);
        this.colisio(870, 350, 60, 700);
        this.colisio(450, 60, 700, 120);
        this.colisio(280, 690, 360, 20);
        this.colisio(620, 690, 360, 20);

        // Finestra amb marc de fusta, llum verdosa i un feix que arriba a terra
        const fin = this.add.graphics().setDepth(-980);
        fin.fillStyle(0x120a04, 1).fillRect(176, 14, 84, 66);
        fin.fillStyle(0xc8f0a0, 0.95).fillRect(182, 20, 72, 54);
        fin.fillStyle(0x8ec8e8, 0.25).fillRect(182, 20, 72, 18);
        fin.lineStyle(5, 0x5a3a1e, 1).strokeRect(180, 18, 76, 58).lineBetween(218, 18, 218, 76).lineBetween(180, 47, 256, 47);
        fin.fillStyle(0x7a4e2a, 1).fillRect(170, 76, 96, 8);
        const feix = this.add.graphics().setDepth(-900);
        feix.fillStyle(0xc6f090, 0.12).fillPoints([{ x: 186, y: 92 }, { x: 252, y: 92 }, { x: 330, y: 330 }, { x: 230, y: 330 }], true);

        // Prestatge amb pots i ampolles, a la dreta del fons, i manats d'herbes penjats de les bigues
        const pres = this.add.graphics().setDepth(-980);
        pres.fillStyle(0x4a2c14, 1).fillRect(540, 56, 190, 8).lineStyle(2, 0x120a04, 1).strokeRect(540, 56, 190, 8);
        pres.fillStyle(0x3a220e, 1).fillRect(552, 64, 6, 10).fillRect(712, 64, 6, 10);
        [[565, 0], [600, 1], [635, 2], [670, 0], [705, 1]].forEach(([x, t]) => this.posar('gerro_' + t, x, 56, { fonsY: -970 }));
        [[320, 38], [370, 46], [420, 36], [470, 44]].forEach(([x, y], i) => manatHerbes(this, x, y, 34 + (i % 2) * 8, [[0x5f9a3a, 0x7a5ab0, 0x4c8430], [0xc86a3a, 0x8a9a3a, 0xd8b84a]][i % 2]));
        this.posar('pergami_paret', 770, 118, { fonsY: -900, escala: 0.62 });                   // una nota clavada a la paret
        teranyina(this, 100, 92, 100, 140, 150, 92);
        teranyina(this, 800, 92, 800, 138, 752, 92);

        // Olla al foc al mig, jaç de palla amb manta, catifa i prou mobles... tot enrenou
        const catifa = this.add.graphics().setDepth(-950);
        catifa.fillStyle(0x3a5a2a, 1).fillEllipse(430, 330, 270, 130).lineStyle(3, 0xc8a050, 1).strokeEllipse(430, 330, 252, 114);
        catifa.lineStyle(2, 0x1a2e12, 1).strokeEllipse(430, 330, 270, 130).strokeEllipse(430, 330, 200, 84);
        [[-70, 0x8a3a3a], [0, 0xc8a050], [70, 0x8a3a3a]].forEach(([dx, col]) => { catifa.fillStyle(col, 0.6).fillCircle(430 + dx, 330, 9); });
        this.posar('olla', 450, 300, { col: { w: 60, h: 24 } });
        this.add.circle(450, 240, 70, 0x9ae060, 0.12).setDepth(300);

        const llit = this.add.graphics().setDepth(-950);
        llit.fillStyle(0x2a1608, 1).fillRoundedRect(130, 110, 170, 108, 12);
        llit.fillStyle(0x5a3a1e, 1).fillRoundedRect(134, 114, 162, 100, 10);
        llit.fillStyle(0xc8b060, 1).fillRoundedRect(142, 122, 146, 84, 10);
        for (let i = 0; i < 16; i++) llit.lineStyle(2, 0x8a7430, 1).lineBetween(150 + i * 8, 128, 156 + i * 8, 200);
        llit.fillStyle(0x6a8a4a, 1).fillRoundedRect(172, 124, 116, 80, 8).lineStyle(2, 0x1a2e12, 1).strokeRoundedRect(172, 124, 116, 80, 8);     // manta de retalls
        [[0, 0, 0x8a3a3a], [1, 1, 0xc8a050], [2, 0, 0x4a6aa0], [0, 1, 0xc8a050], [1, 0, 0x8a3a3a], [2, 1, 0x6a8a4a]].forEach(([c, f, col]) => llit.fillStyle(col, 0.9).fillRect(178 + c * 36, 130 + f * 36, 34, 34));
        llit.fillStyle(0xf2ecdc, 1).fillRoundedRect(144, 128, 32, 70, 8).lineStyle(2, 0x6a5a3a, 1).strokeRoundedRect(144, 128, 32, 70, 8);       // coixí
        this.colisio(215, 165, 170, 90);
        [[620, 160], [700, 150]].forEach(([x, y]) => this.posar('flors', x, y, { fonsY: y }));
        this.posar('taula', 680, 330, { col: { w: 160, h: 30 } });
        this.posar('tamboret', 600, 355, { col: { w: 40, h: 16 } });
        this.posar('barril', 130, 560, { col: { w: 50, h: 22 } });
        this.posar('barril', 185, 545, { col: { w: 50, h: 22 } });
        this.posar('llenya', 730, 610, { col: { w: 110, h: 26 } });
        [[300, 520], [350, 580], [250, 470]].forEach(([x, y]) => this.posar('flors', x, y, { fonsY: y - 10 }));
        [[160, 330], [700, 250]].forEach(([x, y]) => this.posar('roca', x, y, { escala: 0.6, col: { w: 40, h: 16 } }));
        [[250, 110], [560, 100], [680, 110]].forEach(([x, y], i) => {
            const o = this.posar('ocell', x, y, { fonsY: y });
            this.tweens.add({ targets: o, y: y - 5, yoyo: true, repeat: -1, duration: 700 + i * 150 });
        });
        [[650, 300], [715, 305]].forEach(([x, y], i) => {
            const e = this.posar('espelma', x, y, { fonsY: y + 20 });
            this.tweens.add({ targets: e, alpha: 0.7, yoyo: true, repeat: -1, duration: 350 + i * 90 });
        });
        this.boira(450, 200, 100, 40, 0.3);

        this.npc('jaumeta', 560, 420, DIALEGS.jaumeta);

        this.add.rectangle(450, 350, 700, 700, 0xa0e070, 0.05).setDepth(80000);
        this.sortida(410, 680, 80, 14, 'ZonaCabana', 'interior');
    }
}
