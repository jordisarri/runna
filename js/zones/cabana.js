/**
 * LA CABANA DE LA JOANETA: molt lluny, al mig del bosc. Només s'hi arriba pel portal màgic
 * de l'Alzina Buida del Bosc de Sant Joan (cal portar-hi aigua de la font).
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

// Ocells decoratius que no es deixen atrapar: quan l'Ineu s'hi acosta, fugen donant saltets (i es tornen a posar una mica més enllà) o volant
// (s'esvaeixen cap amunt i tornen al seu lloc quan l'Ineu ja és lluny). punts: [[x, y], ...]; lim: {x0, x1, y0, y1} on poden saltar.
function ocellsFugitius(escena, punts, escala, lim) {
    const radi = 150;
    const ocells = punts.map(([x, y], i) => {
        const img = escena.posar('ocell', x, y, { fonsY: y, escala });
        return { img, hx: x, hy: y, bx: x, by: y, estat: 'quiet', i, fins: 0, base: img.depth };
    });
    const f = () => {
        const I = escena.ineu, ara = escena.time.now;
        if (!I) return;
        ocells.forEach(o => {
            const im = o.img, d = Phaser.Math.Distance.Between(I.x, I.y, im.x, im.y);
            if (o.estat === 'quiet') {
                im.y = o.by - 2.5 * (1 + Math.sin(ara / (260 + o.i * 40) + o.i));                         // piula quiet: un balanceig petit
                if (d < radi && ara > o.fins) {
                    let ax = im.x - I.x, ay = im.y - I.y; const l = Math.hypot(ax, ay) || 1; ax /= l; ay /= l;
                    const tx = Phaser.Math.Clamp(im.x + ax * 130, lim.x0, lim.x1), ty = Phaser.Math.Clamp(im.y + ay * 70, lim.y0, lim.y1);
                    const dirX = Math.sign(tx - im.x) || (ax >= 0 ? 1 : -1);
                    const arraconat = Math.hypot(tx - im.x, ty - im.y) < 50;                                 // no té lloc per saltar: vola
                    im.setFlipX(dirX < 0);
                    if (!arraconat && Math.random() < 0.65) {                                                 // saltets
                        o.estat = 'salta'; const N = 5, dur = 120;
                        escena.tweens.add({ targets: im, x: tx, duration: N * dur * 2, ease: 'Linear' });
                        escena.tweens.add({ targets: im, y: { from: im.y, to: ty }, duration: N * dur * 2, ease: 'Linear' });
                        escena.tweens.add({ targets: im, scaleY: im.scaleY * 1.18, yoyo: true, repeat: N - 1, duration: dur, ease: 'Quad.easeOut' });
                        escena.time.delayedCall(N * dur * 2 + 20, () => { o.bx = im.x; o.by = im.y; o.estat = 'quiet'; o.fins = escena.time.now + 700; im.setDepth(im.y); });
                        const h = { v: 0 };
                        escena.tweens.add({ targets: h, v: 1, duration: N * dur * 2, onUpdate: () => im.setDepth(im.y) });
                    } else {                                                                                  // vola
                        o.estat = 'vola'; im.setDepth(9400);
                        escena.tweens.add({ targets: im, x: im.x + dirX * 380, y: im.y - 240, alpha: 0, duration: 1100, ease: 'Quad.easeIn', onComplete: () => { im.setVisible(false); o.estat = 'fora'; o.fins = escena.time.now + 6000; } });
                        escena.tweens.add({ targets: im, scaleY: im.scaleY * 0.5, yoyo: true, repeat: 5, duration: 90 });
                    }
                }
            } else if (o.estat === 'fora' && ara > o.fins && Phaser.Math.Distance.Between(I.x, I.y, o.hx, o.hy) > 330) {
                o.estat = 'quiet'; o.bx = o.hx; o.by = o.hy; o.fins = ara + 400;
                im.setPosition(o.hx, o.hy).setDepth(o.base).setVisible(true).setAlpha(0).setFlipX(false);
                escena.tweens.add({ targets: im, alpha: 1, duration: 800 });
            }
        });
    };
    escena.events.on('update', f);
    escena.events.once('shutdown', () => escena.events.off('update', f));
    return ocells;
}

class ZonaCabana extends ZonaBase {
    constructor() {
        super('ZonaCabana', {
            pins: { pi: 0.3 },
            nom: 'La cabana de la Joaneta',
            amplada: 1400,
            alcada: 1000,
            colorFons: '#14301a',
            entrades: {
                portal:   { x: 330, y: 975, dir: 'avall' },
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

        // La cabana, bruta i deixada
        const cabana = this.edifici('cabana', 800, 590, 360, 92, 'ZonaCabanaInt', 'porta', { alt: 95 });
        const cT = 590 - cabana.displayHeight;
        this.portaMasia(cabana, 800, 590, false, { cx: 0.5197, w: 0.1767, top: 0.5887, bottom: 0.9518 });          // (la porta del gràfic generat)   // la porta de taulons del gràfic, que s'obre
        this.posar('olla', 1000, 660, { col: { w: 50, h: 20 } });
        this.add.circle(1000, 600, 55, 0x9ae060, 0.12).setDepth(660);
        this.boiraAmbient(790, 300, 140, 60, 0.5);
        this.add.circle(740, 620, 40, 0xc6f090, 0.1).setDepth(595);          // la llum del farol de la porta

        // Llenya, barrils d'aigua de pluja i el tronc de picar, a prop de la façana
        this.posar('llenya', 925, 600, { col: { w: 110, h: 26 } });
        this.barril(600, 600, 50, 22);
        this.sacs(682, 604, 'duo');
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

        // L'Alzina Buida, la mateixa del bosc: el portal de tornada (amb la seva clariana verda, claror al forat i llumenetes)
        const AX = 330, AY = 905;
        // (sense clariana verda: l'alzina només té el brillo al forat)
        this.alzina = this.posarAlzinaPortal(AX, AY, 'ZonaBosc', 'portal', true);          // el portal de tornada: s'hi entra caminant pel forat del tronc

        this.brillo(AX - 15, AY - 126, 54, 86, { arc: true });          // el forat del tronc brilla sempre

        // Ocells: no es deixen atrapar, fugen saltant o volant quan l'Ineu s'hi acosta
        ocellsFugitius(this, [[560, 280], [1180, 360], [380, 430], [1100, 760], [650, 860]], 1, { x0: 60, x1: 1340, y0: 60, y1: 950 });

        // Roba estesa, sacs, calaixos... tot abandonat
        [[1120, 520], [480, 560], [700, 780]].forEach(([x, y]) => this.posar('flors', x, y, { fonsY: y - 20, col: { w: 40, h: 14 } }));
        [[1100, 880], [400, 780]].forEach(([x, y]) => this.posar('roca', x, y, { col: { w: 60, h: 24 } }));

        this.arbres([[120, 150], [300, 90], [520, 130], [820, 90], [1050, 130], [1280, 160], [90, 520],
                     [1280, 880], [1300, 560], [200, 340], [1180, 280]]);
        // Les bestioles no arriben tan lluny: només algun bolet mal-humorat
        this.enemic('bolet', 1150, 880);

        // Lluernes verdes que voleien per davant de la cabana
        for (let i = 0; i < 14; i++) {
            const x = 520 + Math.random() * 640, y = 520 + Math.random() * 360;
            const l = this.add.circle(x, y, 2.4, 0xd8ff7a, 0.9).setDepth(85000);
            this.tweens.add({ targets: l, x: x + (Math.random() - 0.5) * 120, y: y + (Math.random() - 0.5) * 90, alpha: 0.15, yoyo: true, repeat: -1, duration: 1800 + Math.random() * 1800, delay: Math.random() * 1500, ease: 'Sine.easeInOut' });
        }
        this.add.rectangle(AMPLE / 2, (ALT - ALT_HUD) / 2, AMPLE / ZOOM_CAMERA + 4, (ALT - ALT_HUD) / ZOOM_CAMERA + 4, 0x0a3010, 0.12).setScrollFactor(0).setDepth(90000);
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

        // Prestatges atapeïts de pocions, i manats d'herbes penjats de les bigues
        const pres = this.add.graphics().setDepth(-980);
        pres.fillStyle(0x4a2c14, 1).fillRect(540, 56, 190, 8).lineStyle(2, 0x120a04, 1).strokeRect(540, 56, 190, 8);
        pres.fillStyle(0x3a220e, 1).fillRect(552, 64, 6, 10).fillRect(712, 64, 6, 10);
        [[565, 0], [600, 1], [635, 2], [670, 0], [705, 1]].forEach(([x, t]) => this.posar('gerro_' + t, x, 56, { fonsY: -970 }));
        pres.fillStyle(0x4a2c14, 1).fillRect(548, 174, 226, 8).lineStyle(2, 0x120a04, 1).strokeRect(548, 174, 226, 8);
        pres.fillStyle(0x3a220e, 1).fillRect(558, 182, 6, 12).fillRect(758, 182, 6, 12);
        [[570, 2], [606, 1], [642, 0], [678, 2], [714, 1], [750, 0]].forEach(([x, t], i) => this.posar('gerro_' + t, x, 174, { fonsY: -960, escala: 0.82 + (i % 2) * 0.08 }));
        [[320, 38], [370, 46], [420, 36], [470, 44]].forEach(([x, y], i) => manatHerbes(this, x, y, 34 + (i % 2) * 8, [[0x5f9a3a, 0x7a5ab0, 0x4c8430], [0xc86a3a, 0x8a9a3a, 0xd8b84a]][i % 2]));
        teranyina(this, 100, 92, 100, 140, 150, 92);
        teranyina(this, 800, 92, 800, 138, 752, 92);

        // Olla al foc al mig, jaç de palla amb manta, catifa i prou mobles... tot enrenou
        const catifa = this.add.graphics().setDepth(-950);
        catifa.fillStyle(0x3a5a2a, 1).fillEllipse(430, 330, 270, 130).lineStyle(3, 0xc8a050, 1).strokeEllipse(430, 330, 252, 114);
        catifa.lineStyle(2, 0x1a2e12, 1).strokeEllipse(430, 330, 270, 130).strokeEllipse(430, 330, 200, 84);
        [[-70, 0x8a3a3a], [0, 0xc8a050], [70, 0x8a3a3a]].forEach(([dx, col]) => { catifa.fillStyle(col, 0.6).fillCircle(430 + dx, 330, 9); });
        this.posar('olla', 450, 300, { col: { w: 60, h: 24 } });
        this.add.circle(450, 240, 70, 0x9ae060, 0.12).setDepth(300);
        this.add.particles(450, 255, 'espurna', {
            speedX: { min: -8, max: 8 }, speedY: { min: -30, max: -12 }, lifespan: 1000,
            scale: { start: 0.35, end: 0 }, alpha: { start: 0.85, end: 0 },
            tint: [0x9ae060, 0xc86aff, 0xd8b84a], frequency: 320, blendMode: 'ADD'
        }).setDepth(305);

        const llit = this.add.graphics().setDepth(-950);
        llit.fillStyle(0x2a1608, 1).fillRoundedRect(130, 110, 170, 108, 12);
        llit.fillStyle(0x5a3a1e, 1).fillRoundedRect(134, 114, 162, 100, 10);
        llit.fillStyle(0xc8b060, 1).fillRoundedRect(142, 122, 146, 84, 10);
        for (let i = 0; i < 16; i++) llit.lineStyle(2, 0x8a7430, 1).lineBetween(150 + i * 8, 128, 156 + i * 8, 200);
        llit.fillStyle(0x6a8a4a, 1).fillRoundedRect(172, 124, 116, 80, 8).lineStyle(2, 0x1a2e12, 1).strokeRoundedRect(172, 124, 116, 80, 8);     // manta de retalls
        [[0, 0, 0x8a3a3a], [1, 1, 0xc8a050], [2, 0, 0x4a6aa0], [0, 1, 0xc8a050], [1, 0, 0x8a3a3a], [2, 1, 0x6a8a4a]].forEach(([c, f, col]) => llit.fillStyle(col, 0.9).fillRect(178 + c * 36, 130 + f * 36, 34, 34));
        llit.fillStyle(0xf2ecdc, 1).fillRoundedRect(144, 128, 32, 70, 8).lineStyle(2, 0x6a5a3a, 1).strokeRoundedRect(144, 128, 32, 70, 8);       // coixí
        this.colisio(215, 165, 170, 90);
        [[620, 160], [700, 150]].forEach(([x, y]) => this.posar('flors', x, y, { fonsY: y, col: { w: 40, h: 14 } }));
        this.posar('taula', 680, 330, { col: { w: 160, h: 30 } });
        this.posar('tamboret', 600, 355, { col: { w: 40, h: 16 } });
        this.barril(130, 560, 50, 22);
        this.barril(185, 545, 50, 22);
        this.sacs(262, 572, 'un');
        this.posar('llenya', 730, 610, { col: { w: 110, h: 26 } });
        [[300, 520], [350, 580], [250, 470]].forEach(([x, y]) => this.posar('flors', x, y, { fonsY: y - 10, col: { w: 40, h: 14 } }));
        this.posar('roca', 160, 330, { escala: 0.6, col: { w: 40, h: 16 } });          // (la pedra de darrere la taula, a 700, 250, s'ha tret: quedava tapada a mitges)
        ocellsFugitius(this, [[250, 170], [430, 145], [565, 155], [660, 185], [710, 245]], 1.5, { x0: 120, x1: 780, y0: 130, y1: 650 });
        const gat = this.add.image(660, 560, 'gat_cove').setOrigin(0.5, 1).setScale(0.65 / RES).setDepth(560);
        this.colisio(gat.x, gat.y - 10, 48, 16);
        [[650, 300], [715, 305]].forEach(([x, y], i) => {
            const e = this.posar('espelma', x, y, { fonsY: y + 20 });
            this.tweens.add({ targets: e, alpha: 0.7, yoyo: true, repeat: -1, duration: 350 + i * 90 });
        });
        this.boira(450, 200, 100, 40, 0.3);

        this.npc('joaneta', 560, 420, DIALEGS.joaneta, { zoomConversa: 1.6 });

        this.add.rectangle(450, 350, 700, 700, 0xa0e070, 0.05).setDepth(80000);
        this.sortida(410, 680, 80, 14, 'ZonaCabana', 'interior');
    }
}


// ---------------- CABANA AMAGADA (camí secret del Camí de la Desaparició) ----------------
// Una cabana de llenyataire tota de fusta: terra de taulons, parets de troncs, una finestra, un banc, una taula
// amb tamborets, un barril, una pila de llenya i un tronc de picar amb la destral. El cofre és al fons.
class ZonaCabanaCami extends ZonaBase {
    constructor() {
        super('ZonaCabanaCami', {
            nom: 'Cabana amagada',
            amplada: 900,
            alcada: 700,
            colorFons: '#140e0a',
            pacifica: true,
            entrades: { porta: { x: 450, y: 600, dir: 'amunt' } }
        });
    }

    construir() {
        this.terra('taulons', 100, 40, 700, 660, -1100);

        // --- Parets de troncs (les mateixes que fa servir la cabana de la Joaneta) ---
        paretsTroncs(this);
        this.colisio(30, 350, 60, 700);
        this.colisio(870, 350, 60, 700);
        this.colisio(450, 60, 800, 120);
        this.colisio(255, 690, 310, 20);                  // paret de baix, amb un buit al mig: la porta
        this.colisio(645, 690, 310, 20);

        // Finestra amb marc de fusta i la llum que n'entra
        const fin = this.add.graphics().setDepth(-980);
        fin.fillStyle(0x120a04, 1).fillRect(296, 18, 88, 64);
        fin.fillStyle(0xf0d890, 0.9).fillRect(302, 24, 76, 52);
        fin.fillStyle(0x8ec8e8, 0.35).fillRect(302, 24, 76, 20);
        fin.lineStyle(5, 0x5a3a1e, 1).strokeRect(300, 22, 80, 56).lineBetween(340, 22, 340, 78).lineBetween(300, 50, 380, 50);
        fin.fillStyle(0x7a4e2a, 1).fillRect(290, 78, 100, 8);                                  // ampit
        const llum = this.add.graphics().setDepth(-900);
        llum.fillStyle(0xffe8a0, 0.13).fillPoints([{ x: 304, y: 92 }, { x: 376, y: 92 }, { x: 430, y: 330 }, { x: 330, y: 330 }], true);
        // Prestatge amb gerros, al fons a la dreta
        const pres = this.add.graphics().setDepth(-980);
        pres.fillStyle(0x4a2c14, 1).fillRect(520, 56, 130, 8).lineStyle(2, 0x120a04, 1).strokeRect(520, 56, 130, 8);
        [[540, 0], [578, 1], [616, 2]].forEach(([x, t]) => this.posar('gerro_' + t, x, 56, { fonsY: -970 }));

        // Manats d'herbes i alls penjats de les bigues, una destral clavada a la paret i teranyines a les cantonades
        [[470, 98], [505, 100], [250, 100]].forEach(([x, y], i) => manatHerbes(this, x, y - 62, 38 + (i % 2) * 8, i === 2 ? [0xe8e0c8, 0xd8d0b0, 0xe8e0c8] : undefined));
        const destral = this.add.graphics().setDepth(-975);
        destral.fillStyle(0x6a4020, 1).fillRect(140, 30, 5, 52).lineStyle(1.5, 0x120a04, 1).strokeRect(140, 30, 5, 52);
        destral.fillStyle(0x8a8a92, 1).fillTriangle(145, 34, 172, 26, 172, 58).fillRect(145, 34, 5, 20);
        destral.lineStyle(2, 0x120a04, 1).strokeTriangle(145, 34, 172, 26, 172, 58);
        destral.fillStyle(0xffffff, 0.45).fillRect(165, 32, 2, 18);
        teranyina(this, 100, 98, 100, 150, 150, 98);
        teranyina(this, 800, 98, 800, 148, 752, 98);
        // Un fanal penjat del sostre il·lumina la taula
        const fanal = this.add.graphics().setDepth(79000);
        fanal.lineStyle(2, 0x120a04, 1).lineBetween(450, 0, 450, 98);
        fanal.fillStyle(0x3a3a40, 1).fillRect(440, 98, 20, 4).fillRect(440, 126, 20, 4);
        fanal.fillStyle(0xffd890, 0.95).fillRect(443, 102, 14, 24).lineStyle(2, 0x120a04, 1).strokeRect(443, 102, 14, 24);
        const llumFanal = this.add.circle(450, 114, 120, 0xffd38a, 0.1).setDepth(79000);
        this.tweens.add({ targets: llumFanal, alpha: 0.16, yoyo: true, repeat: -1, duration: 900 });

        // Catifa de teixit sota la taula
        const catifa = this.add.graphics().setDepth(-950);
        catifa.fillStyle(0x6a2a2a, 1).fillRoundedRect(310, 360, 280, 180, 8);
        catifa.lineStyle(3, 0xc8a050, 1).strokeRoundedRect(318, 368, 264, 164, 6);
        catifa.lineStyle(2, 0x3a1414, 1).strokeRoundedRect(310, 360, 280, 180, 8).strokeRoundedRect(332, 384, 236, 132, 4);

        // Mobles de fusta
        this.posarBanc(400, 200, 140);
        this.barril(150, 175, 50, 22);
        this.barril(205, 160, 50, 22);
        this.sacs(290, 182, 'tres');
        this.posar('taula_buida', 450, 470, { col: { w: 160, h: 30 } });      // (sense bol ni tassa: el tauler és ple de cartes)
        this.posar('tamboret', 340, 505, { col: { w: 40, h: 16 } });
        this.posar('tamboret', 565, 505, { col: { w: 40, h: 16 } });
        // El solitari de l'Iscu, estirat sobre la taula, i l'Iscu (el fill de la Càren) al costat
        const cartes = this.add.graphics().setDepth(480);
        for (let c = 0; c < 7; c++) for (let f = 0; f <= Math.min(c, 3); f++) {
            const x = 378 + c * 18, y = 375 + f * 5, tapada = f < Math.min(c, 3);
            cartes.fillStyle(tapada ? 0x8a2a2a : 0xf4ecd8, 1).fillRect(x, y, 15, 21).lineStyle(1, 0x3a2410, 1).strokeRect(x, y, 15, 21);
            if (!tapada) cartes.fillStyle([0xc8a030, 0x2a5aa0, 0xb83a3a, 0x3a8a3a][c % 4], 1).fillCircle(x + 7.5, y + 10, 3);
        }
        cartes.fillStyle(0x8a2a2a, 1).fillRect(508, 378, 15, 21).lineStyle(1, 0x3a2410, 1).strokeRect(508, 378, 15, 21);
        this.interactiu(450, 440, RADI_OBJECTE, DIALEGS.solitari, { altura: 60 });
        this.npc('iscu', 520, 560, DIALEGS.iscu, { flipX: true });
        this.posar('llenya', 735, 410, { col: { w: 110, h: 26 } });
        this.posar('tronc_tall', 160, 540, { col: { w: 70, h: 24 } });

        // Un cofre petit entre dues espelmes
        const cofreCab = this.posar(Estat.flag('cofreCabanaCami') ? 'cofre_obert' : 'cofre', 690, 250, { col: { w: 50, h: 20 }, opac: true });
        this.interactiu(690, 255, RADI_OBJECTE, DIALEGS.cofreCabanaCami, { altura: 80, actiu: () => !Estat.flag('cofreCabanaCami'), enTancar: () => { if (Estat.flag('cofreCabanaCami')) cofreCab.setTexture('cofre_obert'); } });
        [[630, 258], [750, 258]].forEach(([x, y], i) => {
            const e = this.posar('espelma', x, y, { fonsY: y });
            this.tweens.add({ targets: e, alpha: 0.7, yoyo: true, repeat: -1, duration: 350 + i * 90 });
        });

        this.add.rectangle(450, 350, 700, 700, 0xffd38a, 0.05).setDepth(80000);
        this.sortida(410, 672, 80, 22, 'ZonaCami', 'secret');
    }
}
