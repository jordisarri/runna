/**
 * L'OEST: Rovellonera (bosc laberint) · Ermita de Sant Gabriel (fora i dins) · Els Dipòsits · El Dolmen.
 */

// ---------------- ROVELLONERA ----------------
// Bosc laberint. Cada clariana té 4 sortides; només una porta endavant: la dels rovellons sota els pins.
// Camí correcte: S, W, S (Sant Gabriel és al sud). Sortir per una altra banda et fa tornar a la primera clariana.
const ROV_SEQ = ['S', 'W', 'S'];
const ROV_OPOSAT = { N: 'S', S: 'N', E: 'W', W: 'E' };

class ZonaRovellonera extends ZonaBase {
    constructor() {
        super('ZonaRovellonera', {
            fosca: true,
            pins: { pi: 0.6 },
            nom: 'Rovellonera',
            amplada: 1600,
            alcada: 1100,
            colorFons: '#1a3016',
            entrades: {
                cami:    { x: 1510, y: 550,  dir: 'esquerra' },
                gabriel: { x: 800,  y: 1010, dir: 'amunt' },
                ent_N:   { x: 800,  y: 90,   dir: 'avall' },
                ent_S:   { x: 800,  y: 1010, dir: 'amunt' },
                ent_E:   { x: 1510, y: 550,  dir: 'esquerra' },
                ent_W:   { x: 90,   y: 550,  dir: 'dreta' },
                portal:  { x: 1000, y: 900,  dir: 'avall' }
            }
        });
    }

    construir() {
        const ent = this.dadesEntrada.entrada;
        if (ent === 'cami') Estat.dades.rovPas = 0;
        if (ent === 'gabriel') Estat.dades.rovPas = 2;
        if (ent === 'portal') Estat.dades.rovPas = 1;
        this.pas = Math.min(Estat.dades.rovPas || 0, 2);
        const pas = this.pas;
        this.llac = this.roca2 = null;     // (l'escena es reutilitza: que no quedin els de la clariana anterior)

        this.terra('herba_fosca', 0, 0, 1600, 1100, -1100);
        this.terra('cami', 700, 0, 200, 1100).setAlpha(0.0);       // (reservat)

        // Pins al voltant, amb un buit de 220 de ample al mig de cada costat
        let llavor = 31 + pas * 17;
        const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
        for (let x = 60; x < 1560; x += 105) {
            if (Math.abs(x - 800) < 120) continue;
            this.posar(rnd() < 0.55 ? 'pi' : 'xiprer', x + rnd() * 30, 40 + rnd() * 30, { col: { w: 28, h: 14 } });
            this.posar(rnd() < 0.55 ? 'pi' : 'xiprer', x + rnd() * 30, 1060 + rnd() * 30, { col: { w: 28, h: 14 } });
        }
        for (let y = 130; y < 1000; y += 105) {
            if (Math.abs(y - 550) < 120) continue;
            this.posar(rnd() < 0.55 ? 'pi' : 'xiprer', 40 + rnd() * 30, y + rnd() * 30, { col: { w: 28, h: 14 } });
            this.posar(rnd() < 0.55 ? 'pi' : 'xiprer', 1540 + rnd() * 30, y + rnd() * 30, { col: { w: 28, h: 14 } });
        }
        // Pins soltes a l'interior, lluny del centre i dels passos
        for (let i = 0; i < 18; i++) {
            const x = 160 + rnd() * 1280, y = 160 + rnd() * 780;
            if (Phaser.Math.Distance.Between(x, y, 800, 550) < 230) continue;
            if (Math.abs(x - 800) < 140 || Math.abs(y - 550) < 140) continue;
            if (pas === 0 && Phaser.Math.Distance.Between(x, y, 1150, 300) < 230) continue;   // lloc per empènyer la roca del llaç
            this.posar(i % 3 ? 'pi' : 'arbre', x, y, { col: { w: 28, h: 14 } });
        }

        // Rovellons sota els pins, al costat de la sortida correcta
        const D = ROV_SEQ[pas];
        if (D) this.rovellons(D);
        // Cartell d'entrada (només a la primera clariana): la regla del bosc
        if (pas === 0) this.cartell(1330, 650, () => ({ pagines: [
            { qui: 'Cartell', text: "Bosc de les Rovelloneres.\n«Qui no mira a terra, es perd. Els rovellons creixen sempre vora el bon camí. Si t'equivoques, tornaràs a la primera clariana.»" }
        ] }));
        // Si l'Ineu s'ha perdut dues vegades o més, unes llumetes assenyalen la sortida bona (el bosc s'apiada)
        if (D && (Estat.dades.rovPerdut || 0) >= 2) {
            const ang = { N: -90, S: 90, W: 180, E: 0 }[D];
            this.add.particles(800, 550, 'espurna', { speed: { min: 170, max: 200 }, angle: { min: ang - 6, max: ang + 6 }, lifespan: 1500, scale: { start: 0.75, end: 0 },
                alpha: { start: 1, end: 0 }, tint: [0xffe08a, 0xfff2c0], frequency: 110, blendMode: 'ADD' }).setDepth(3000);
        }
        this.hintLlanterna = Estat.te('llanterna');

        // Sortides
        const mapaSortides = { N: [700, 0, 200, 14], S: [700, 1086, 200, 14], W: [0, 440, 14, 220], E: [1586, 440, 14, 220] };
        Object.entries(mapaSortides).forEach(([d, r]) => this.sortida(r[0], r[1], r[2], r[3], 'ZonaRovellonera', 'x_' + d));

        // Segon llaç de la Nena de les Trenes (el primer és pel camí): a la primera clariana, també sota una pedra
        if (pas === 0) {
            this.llac = this.posar('llac', 1100, 300, { fonsY: 300 });
            this.tweens.add({ targets: this.llac, y: 294, yoyo: true, repeat: -1, duration: 700 });
            this.interactiu(1100, 300, RADI_OBJECTE, DIALEGS.llac(2), { altura: 50, actiu: () => this.llac2Lliure() });
            this.roca2 = this.pedraMobil(1100, 310, 'llac2', 110, 0,
                'Una roca grossa entre els pins, coberta de molsa. Per sota en surt un tros de cinta rosa.');
        }

        // Cercle de bolets (segona clariana): portal màgic cap a la cabana de la Jaumeta, un cop descobert
        if (pas === 1) {
            this.posar('cercle_bolets', 1000, 870, { fonsY: -800 });
            this.interactiu(1000, 870, RADI_OBJECTE, DIALEGS.cercleRovellonera, {
                altura: 40,
                enTancar: () => { if (Estat.flag('portalJaumeta')) { Estat.dades.portalTorna = 'rov'; this.canviarZona('ZonaCabana', 'portal'); } }
            });
        }

        // Enemics: bolets bruts i escolopendres
        const bolets = [[[420, 380], [1200, 760]], [[500, 300], [1150, 380], [650, 850]], [[420, 420], [1100, 300], [500, 820]]][pas];
        const escolo = [[[1150, 780], [450, 780]], [[1250, 760]], [[1250, 480], [300, 560]]][pas];
        bolets.forEach(([x, y]) => this.enemic('bolet', x, y));
        escolo.forEach(([x, y]) => this.enemic('escolopendra', x, y));

        this.boira(800, 550, 700, 300, 1.2);
        this.add.rectangle(AMPLE / 2, (ALT - ALT_HUD) / 2, AMPLE / ZOOM_CAMERA + 4, (ALT - ALT_HUD) / ZOOM_CAMERA + 4, 0x1a0a30, 0.14).setScrollFactor(0).setDepth(90000);
    }

    // Grup de rovellons als peus d'una parella de pins, pegat a la sortida correcta
    rovellons(D) {
        const base = { N: [800, 190], S: [800, 910], W: [190, 550], E: [1410, 550] }[D];
        this.rovelloGrup = [];
        const halo = this.add.ellipse(base[0], base[1] + 10, 150, 60, 0xffd890, 0.22).setDepth(base[1] - 2).setBlendMode('ADD');
        this.tweens.add({ targets: halo, alpha: 0.08, yoyo: true, repeat: -1, duration: 900 });
        [[-38, 0], [38, 6], [0, 22], [-18, -16], [22, -14]].forEach(([dx, dy]) => {
            const r = this.add.image(base[0] + dx, base[1] + dy, 'rovello').setScale(0.2).setDepth(base[1] + dy).setAlpha(0.95);
            this.tweens.add({ targets: r, scale: 0.23, yoyo: true, repeat: -1, duration: 900 + dx });
            this.rovelloGrup.push(r);
        });
        this.xipresHint = [this.posar('xiprer', base[0] - 100, base[1] - 20, { col: { w: 24, h: 12 } }),
                           this.posar('xiprer', base[0] + 100, base[1] - 20, { col: { w: 24, h: 12 } })];
    }

    // Les sortides no són "zones" normals: decideixen on va l'Ineu segons el camí correcte
    canviarZona(desti, entrada) {
        if (desti === 'ZonaRovellonera' && entrada && entrada.startsWith('x_')) {
            const d = entrada[2];
            let pas = this.pas, dest = 'ZonaRovellonera', ent, perdut = false;
            if (pas === 0 && d === 'E') { dest = 'ZonaCamiRov'; ent = 'rovellonera'; }
            else if (d === ROV_SEQ[pas]) {
                pas++;
                if (pas >= 3) { dest = 'ZonaGabriel'; ent = 'rovellonera'; } else ent = 'ent_' + ROV_OPOSAT[d];
            } else if (pas > 0 && d === ROV_OPOSAT[ROV_SEQ[pas - 1]]) { pas--; ent = 'ent_' + ROV_OPOSAT[d]; }
            else { pas = 0; ent = 'ent_' + ROV_OPOSAT[d]; perdut = true; }
            Estat.dades.rovPas = pas;
            if (perdut) Estat.dades.rovPerdut = (Estat.dades.rovPerdut || 0) + 1;
            if (pas >= 3) Estat.dades.rovPerdut = 0;
            if (perdut && this.pas !== 0) this.ui().notifica('T\'has perdut entre els pins... tornes a la primera clariana' + ((Estat.dades.rovPerdut || 0) >= 2 ? ' (ara el bosc t\'assenyalarà el camí)' : ''));
            return super.canviarZona(dest, ent);
        }
        return super.canviarZona(desti, entrada);
    }

    actualitzar() {
        // Els rovellons es veuen millor amb la llanterna (revela el que la boira amaga)
        const clar = Estat.te('llanterna');
        (this.rovelloGrup || []).forEach(r => r.setAlpha(clar ? 1 : 0.35));
        if (this.llac) this.llac.setVisible(this.llac2Lliure());
    }

    llac2Lliure() { return Estat.flag('nenaVista') && !Estat.flag('llac2') && !!this.roca2 && this.roca2.mogut; }
}

// ---------------- CAMÍ DE LA ROVELLONERA ----------------
// Surt de l'Era (cap a ponent, per davant de l'era) i fa un bon tros amb corbes. A la primera corba hi ha la Nena de les Trenes.
class ZonaCamiRov extends ZonaBase {
    constructor() {
        super('ZonaCamiRov', {
            fosca: true,
            pins: { pi: 0.5 },
            nom: 'Camí de la Rovellonera',
            amplada: 2800,
            alcada: 1400,
            colorFons: '#1f3a1a',
            entrades: {
                era:         { x: 2740, y: 310,  dir: 'esquerra' },
                rovellonera: { x: 70,   y: 1230, dir: 'dreta' }
            }
        });
    }

    // Una dona sense rostre apareix a la corba; la nena hi corre i, quan s'abracen, tot es torna llum
    mareNena(fet) {
        const n = this.nena;
        if (!n) { fet(); return; }
        const mare = this.add.image(n.x - 180, n.y, 'mare_nena').setOrigin(0.5, 1).setTint(0xe8eeff).setAlpha(0).setDepth(n.y);
        mare.setScale((this.textures.get('mare_nena').customData || {}).escala || 0.5);
        this.tweens.killTweensOf([n, this.resplendorNena]);
        this.tweens.add({ targets: mare, alpha: 0.7, duration: 1200, onComplete: () => {
            this.tweens.add({ targets: [n, this.resplendorNena], x: n.x - 130, duration: 1100, ease: 'Sine.easeInOut', onComplete: () => {
                this.llum(mare.x + 20, mare.y - 80, 0xfff4e0);
                this.tweens.add({ targets: [mare, n, this.resplendorNena], alpha: 0, duration: 1600, onComplete: () => { mare.destroy(); fet(); } });
            } });
        } });
    }

    construir() {
        this.terra('herba', 0, 0, 2800, 1400, -1100);
        // Camí amb corbes: est -> oest, baixa, oest, baixa, oest
        const tram = [
            [1700, 240, 1100, 140],   // des de l'Era (est)
            [1700, 240, 160, 500],    // primera corba: baixa
            [800, 600, 1060, 140],    // cap a ponent
            [800, 600, 160, 700],     // segona corba: baixa
            [0, 1160, 960, 140]       // fins a la Rovellonera
        ];
        tram.forEach(([x, y, w, h]) => this.terra('cami', x, y, w, h));

        // Bosc a banda i banda
        let llavor = 41;
        const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
        for (let y = 60; y < 1400; y += 150) {
            for (let x = 60; x < 2800; x += 170) {
                const px = x + (rnd() - 0.5) * 80, py = y + (rnd() - 0.5) * 70;
                if (tram.some(([tx, ty, tw, th]) => px > tx - 90 && px < tx + tw + 90 && py > ty - 70 && py < ty + th + 90)) continue;
                if (Math.abs(px - 2640) < 240 && py > 330 && py < 880) continue;   // que cap arbre tapi el cartell
                if (Phaser.Math.Distance.Between(px, py, 880, 880) < 170 || Phaser.Math.Distance.Between(px, py, 1300, 830) < 120) continue;
                const tipus = rnd() < 0.6 ? 'pi' : 'arbre';                       // (es tria abans de descartar: així la resta del bosc queda igual)
                // La roca del primer llaç: cap arbre al voltant ni al davant (les copes pugen i la tapen), ni a la banda on s'empeny
                if (Math.abs(px - 1300) < 240 && py > 760 && py < 1140) continue;
                this.posar(tipus, px, py, { col: { w: 30, h: 14 } });
            }
        }
        [[2300, 460], [1500, 770], [1100, 560], [620, 1100], [500, 1330], [900, 1000]].forEach(([x, y]) => this.posar('roca', x, y, { col: { w: 70, h: 26 } }));
        this.cartell(2640, 420, () => ({ pagines: [{ qui: 'Cartell', text: '← Rovellonera\n«On hi ha rovellons, hi ha pins; on hi ha pins, hi ha camí.»' }] }));

        // La segona corba, ben endins del camí, on espera la Nena de les Trenes
        if (!Estat.flag('nenaAlliberada')) {
            this.nena = this.posar('nena_trenes', 880, 880, { fonsY: 880 }).setAlpha(0.72);
            this.resplendorNena = this.add.circle(880, 820, 90, 0xcfd8ff, 0.12).setDepth(879);
            this.tweens.add({ targets: [this.nena, this.resplendorNena], y: '-=10', yoyo: true, repeat: -1, duration: 1300, ease: 'Sine.easeInOut' });
            this.interactiu(880, 880, RADI_NPC, DIALEGS.nenaTrenes, { altura: 105 });
        }
        // Primer llaç: amagat sota una roca que cal empènyer
        this.llac = this.posar('llac', 1300, 830, { fonsY: 830 });
        this.tweens.add({ targets: this.llac, y: 824, yoyo: true, repeat: -1, duration: 700 });
        this.interactiu(1300, 830, RADI_OBJECTE, DIALEGS.llac(1), { altura: 50, actiu: () => this.llacLliure() });
        this.roca1 = this.pedraMobil(1300, 840, 'llac1', 110, 0,
            'Una roca grossa a la vora del camí, amb l\'herba aixafada al voltant. Sota seu hi brilla una cosa rosada.');

        // Animalets i bolets
        [[2400, 320], [1500, 670], [1000, 660], [450, 1210]].forEach(([x, y]) => this.enemic('escolopendra', x, y));
        [[2100, 620], [1200, 460], [700, 1060]].forEach(([x, y]) => this.enemic('bolet', x, y));

        this.boira(900, 900, 400, 160, 1);
        this.sortida(2786, 240, 14, 140, 'ZonaEra', 'rovellonera');
        this.sortida(0, 1160, 14, 140, 'ZonaRovellonera', 'cami');
        this.add.rectangle(AMPLE / 2, (ALT - ALT_HUD) / 2, AMPLE / ZOOM_CAMERA + 4, (ALT - ALT_HUD) / ZOOM_CAMERA + 4, 0x1a0a30, 0.1).setScrollFactor(0).setDepth(90000);
    }

    actualitzar() {
        if (this.llac) this.llac.setVisible(this.llacLliure());
    }

    llacLliure() { return Estat.flag('nenaVista') && !Estat.flag('llac1') && !!this.roca1 && this.roca1.mogut; }
}

// ---------------- ERMITA DE SANT GABRIEL (exterior) ----------------
// Al sud de la Rovellonera. Des d'aquí, un camí cap a l'est porta als Dipòsits.
class ZonaGabriel extends ZonaBase {
    constructor() {
        super('ZonaGabriel', {
            fosca: true,
            pins: { pinyer: 0.3 },
            nom: 'Ermita de Sant Gabriel',
            amplada: 1600,
            alcada: 1100,
            entrades: {
                rovellonera: { x: 800,  y: 80,  dir: 'avall' },
                interior:    { x: 400,  y: 700, dir: 'avall' },
                diposits:    { x: 1530, y: 715, dir: 'esquerra' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1600, 1100, -1100);
        this.terra('cami', 700, 0, 200, 660);            // des de la Rovellonera (nord)
        this.terra('cami', 300, 650, 1300, 130);         // camí davant l'ermita, cap als Dipòsits (est)

        // L'ermita, prou gran perquè la porta (d'arc rebaixat) sigui una mica més alta que l'Ineu; la porta s'obre en acostar-s'hi
        const ermita = this.edifici('ermita_gabriel', 400, 640, 520, 88, 'ZonaGabrielInt', 'porta', { alt: 90 });
        this.portaAnimada({ x: 400, top: 493, bottom: 625, ample: 88, fons: 620, unic: true, arc: 26, retall: ermita });
        this.cartell(930, 800, () => ({ pagines: [{ qui: 'Cartell', text: '→ Dipòsits\n↑ La Rovellonera' }] }));

        this.terra('cami', 220, 650, 360, 200);          // esplanada de terra seca davant l'ermita
        // (cap arbre davant la porta ni davant del cartell)
        this.arbres([[150, 200], [1050, 150], [1300, 220], [1480, 160], [50, 470], [160, 880],
                     [60, 1040], [1250, 1080], [1400, 900], [1200, 330], [1450, 420], [640, 980]]);
        // Pins joves i arbustos prims vora la capella (com a la foto): un turó obert, amb poc arbre
        [[70, 690, 0.5], [740, 560, 0.45]].forEach(([x, y, e]) => this.posar('arbre', x, y, { escala: e, col: { w: 18, h: 10 } }));
        [[400, 900], [1250, 880]].forEach(([x, y]) => this.enemic('bolet', x, y));
        [[400, 300], [1250, 300], [800, 900]].forEach(([x, y]) => this.enemic('escolopendra', x, y));

        this.sortida(700, 0, 200, 14, 'ZonaRovellonera', 'gabriel');
        this.sortida(1586, 650, 14, 130, 'ZonaDipositos', 'gabriel');
        this.add.rectangle(AMPLE / 2, (ALT - ALT_HUD) / 2, AMPLE / ZOOM_CAMERA + 4, (ALT - ALT_HUD) / ZOOM_CAMERA + 4, 0x1a0a30, 0.1).setScrollFactor(0).setDepth(90000);
    }
}

// ---------------- ERMITA DE SANT GABRIEL (interior) ----------------
// Com l'ermita de debò: una sola nau estreta, de carreus ocres, amb volta apuntada; la paret del fons, de carreus més
// vermellosos, amb l'arcàngel Gabriel de mosaic. Al davant, sobre un graó de pedra clara, l'altar de blocs amb una creu i
// dos canelobres de ferro (i el Calze de Rosada), dos testos de flors i un terra de lloses grans i gastades.
// Una espitllera a la paret de la dreta deixa entrar un raig de llum.
const GAB = { A: 720, H: 1000, x0: 170, x1: 550, fons: 300, grao: 420 };

class ZonaGabrielInt extends ZonaBase {
    constructor() {
        super('ZonaGabrielInt', {
            nom: 'Sant Gabriel',
            amplada: GAB.A,
            alcada: GAB.H,
            colorFons: '#140e0a',
            pacifica: true,
            entrades: { porta: { x: GAB.A / 2, y: GAB.H - 90, dir: 'amunt' } }
        });
    }

    construir() {
        const { A, H, x0, x1, fons, grao } = GAB, cx = A / 2;
        let sd = 7; const r = () => (sd = sd * 16807 % 2147483647) / 2147483647;
        const g = this.add.graphics().setDepth(-1000);
        const carreus = (gx, y0, y1, xa, xb, alt, colors, junta) => {          // filades de carreus desplaçades
            for (let y = y0, f = 0; y < y1; y += alt, f++) {
                for (let x = xa - (f % 2) * 22; x < xb; x += 44 + (f * 7 + x) % 12) {
                    const a = Math.max(x, xa), b = Math.min(x + 44, xb);
                    if (b - a < 4) continue;
                    gx.fillStyle(colors[Math.floor(r() * colors.length)], 1).fillRect(a + 1, y + 1, b - a - 2, Math.min(alt, y1 - y) - 2);
                }
                gx.lineStyle(1.5, junta, 0.7).lineBetween(xa, y, xb, y);
            }
        };

        // Volta (ocre) i parets dels costats, vistes de cara: carreus que s'enfosqueixen cap a les vores
        g.fillStyle(0x2a1e14, 1).fillRect(0, 0, A, H);
        carreus(g, 0, fons, 70, A - 70, 22, [0xb89a64, 0xa88a58, 0xc4a670, 0x9c8050], 0x5a4628);
        carreus(g, fons, H, 70, x0, 26, [0xa88c5a, 0x98804e, 0xb49a66], 0x5a4628);
        carreus(g, fons, H, x1, A - 70, 26, [0xa88c5a, 0x98804e, 0xb49a66], 0x5a4628);
        g.fillStyle(0x000000, 0.35).fillRect(70, 0, 30, H).fillRect(A - 100, 0, 30, H);
        g.lineStyle(4, 0x3a2a18, 1).lineBetween(x0, fons, x0, H).lineBetween(x1, fons, x1, H);
        g.fillStyle(0x000000, 0.18).fillRect(x0, fons, 14, H - fons).fillRect(x1 - 14, fons, 14, H - fons);

        // Paret del fons amb l'arc apuntat de la volta (carreus vermellosos) i les juntes de la volta que hi convergeixen
        const h = fons - 40, R = (((x1 - x0) / 2) ** 2 + h * h) / (2 * ((x1 - x0) / 2)), arc = [];   // arc apuntat: dos cercles de radi R
        for (let k = 0; k <= 20; k++) {                                       // costat esquerre: centre a la dreta
            const ax = x0 + R, a0 = Math.PI, a1 = Math.PI + Math.atan2(h, R - (x1 - x0) / 2), a = a0 + (a1 - a0) * k / 20;
            arc.push({ x: ax + Math.cos(a) * R, y: fons + Math.sin(a) * R });
        }
        for (let k = 20; k >= 0; k--) {                                       // costat dret: simètric
            const p = arc[k]; arc.push({ x: 2 * cx - p.x, y: p.y });
        }
        arc.push({ x: x1, y: fons }, { x: x0, y: fons });
        const fonsG = this.add.graphics().setDepth(-998);
        fonsG.fillStyle(0x9a5a3e, 1).fillPoints(arc, true);
        const mask = this.make.graphics({ add: false }).fillPoints(arc, true).createGeometryMask();
        const carr = this.add.graphics().setDepth(-997).setMask(mask);
        carreus(carr, 0, fons, x0, x1, 22, [0xa8644a, 0x9a5a40, 0xb47058, 0x8e5038, 0xa86a4c], 0x4a2a1a);
        fonsG.lineStyle(5, 0x5a4628, 1).strokePoints(arc.slice(0, 42), false);
        for (let k = 1; k < 20; k += 2) {                                     // juntes de la volta, radials
            [arc[k], arc[41 - k]].forEach(p => g.lineStyle(1.5, 0x5a4628, 0.6).lineBetween(p.x, p.y, p.x + (p.x - cx) * 0.35, p.y - 34));
        }
        g.fillStyle(0xffffff, 0.06).fillRect(cx - 30, 0, 60, fons);          // llum a la clau de la volta

        // L'arcàngel Gabriel de mosaic: ales obertes, aurèola, túnica i un lliri a la mà
        const gb = this.add.graphics().setDepth(-996), gx = cx, gy = 150;
        gb.fillStyle(0x6a5a40, 0.6).fillRoundedRect(gx - 52, gy - 70, 104, 150, 10);
        gb.fillStyle(0xd8d0b8, 1).fillTriangle(gx - 8, gy - 30, gx - 48, gy - 64, gx - 40, gy + 40);    // ales
        gb.fillStyle(0xc8bea4, 1).fillTriangle(gx + 8, gy - 30, gx + 46, gy - 60, gx + 36, gy + 36);
        gb.lineStyle(1.2, 0x8a7a5a, 0.8);
        for (let k = 0; k < 5; k++) { gb.lineBetween(gx - 12, gy - 26 + k * 12, gx - 44, gy - 58 + k * 20); gb.lineBetween(gx + 12, gy - 26 + k * 12, gx + 42, gy - 54 + k * 18); }
        gb.fillStyle(0xe8c860, 0.9).fillCircle(gx, gy - 44, 15);                                     // aurèola
        gb.fillStyle(0xe8c8a0, 1).fillCircle(gx, gy - 44, 9);
        gb.fillStyle(0xc8b48a, 1).fillPoints([{ x: gx - 12, y: gy - 32 }, { x: gx + 12, y: gy - 32 }, { x: gx + 20, y: gy + 62 }, { x: gx - 20, y: gy + 62 }], true);
        gb.fillStyle(0xa89060, 1).fillPoints([{ x: gx - 4, y: gy - 30 }, { x: gx + 12, y: gy - 30 }, { x: gx + 16, y: gy + 62 }, { x: gx + 2, y: gy + 62 }], true);
        gb.lineStyle(2, 0x3a5a2a, 1).lineBetween(gx + 18, gy - 20, gx + 20, gy + 60);               // la tija del lliri
        gb.fillStyle(0xf4f0e0, 1).fillCircle(gx + 18, gy - 24, 5).fillCircle(gx + 13, gy - 20, 4).fillCircle(gx + 23, gy - 20, 4);
        for (let k = 0; k < 60; k++) gb.fillStyle(0xffffff, 0.12 + r() * 0.12).fillRect(gx - 50 + r() * 100, gy - 68 + r() * 146, 2, 2);   // tessel·les

        // Espitllera a la paret de la dreta i el raig de llum que travessa la nau
        g.fillStyle(0x1a120a, 1).fillRect(x1 + 26, fons + 20, 16, 90);
        g.fillStyle(0xfff0c8, 0.85).fillRect(x1 + 30, fons + 26, 8, 78);
        const raig = this.add.graphics().setDepth(80001).setBlendMode('ADD');
        raig.fillStyle(0xfff0c8, 0.09).fillPoints([{ x: x1 + 30, y: fons + 26 }, { x: x1 + 38, y: fons + 104 }, { x: cx - 40, y: fons + 330 }, { x: cx - 120, y: fons + 250 }], true);
        this.tweens.add({ targets: raig, alpha: 0.6, yoyo: true, repeat: -1, duration: 3000, ease: 'Sine.easeInOut' });

        // Terra de lloses grans, gastades i esquerdades
        const terra = this.add.graphics().setDepth(-995);
        terra.fillStyle(0x8e8a80, 1).fillRect(x0, fons, x1 - x0, H - fons);
        for (let y = grao + 16, f = 0; y < H; f++) {
            const alt = Math.min(60 + r() * 50, H - y);
            for (let x = x0; x < x1;) {
                const amp = 70 + r() * 90, b = Math.min(x + amp, x1);
                terra.fillStyle([0xc8c4b8, 0xbab6aa, 0xd2cec2, 0xb0aca0][Math.floor(r() * 4)], 1).fillRect(x + 2, y + 2, b - x - 4, alt - 4);
                if (r() < 0.4) terra.lineStyle(1.2, 0x6a665c, 0.6).lineBetween(x + r() * (b - x), y + 4, x + r() * (b - x), y + alt - 6);
                if (r() < 0.25) terra.fillStyle(0x6a665c, 0.12).fillEllipse(x + (b - x) / 2, y + alt / 2, (b - x) * 0.6, alt * 0.4);
                x = b;
            }
            y += alt;
        }
        terra.fillStyle(0x000000, 0.18).fillRect(x0, grao, 14, H - grao).fillRect(x1 - 14, grao, 14, H - grao);   // ombra arran de les parets

        // El graó del presbiteri, de pedra clara, i l'altar de blocs
        const pr = this.add.graphics().setDepth(-994);
        pr.fillStyle(0xd8d2c2, 1).fillRect(x0, fons, x1 - x0, grao - fons);
        pr.lineStyle(1.2, 0xa8a090, 0.8);
        for (let x = x0 + 76; x < x1; x += 76) pr.lineBetween(x, fons, x, grao);
        pr.lineBetween(x0, fons + 60, x1, fons + 60);
        pr.fillStyle(0xb4ac9a, 1).fillRect(x0, grao, x1 - x0, 16);
        pr.lineStyle(2, 0x6a6458, 1).lineBetween(x0, grao, x1, grao).lineBetween(x0, grao + 16, x1, grao + 16);
        const al = this.add.graphics().setDepth(395), ay = 395;
        al.fillStyle(0x000000, 0.2).fillRect(cx - 70, ay - 2, 146, 10);
        al.fillStyle(0xe4dece, 1).fillRect(cx - 64, ay - 58, 128, 58).lineStyle(2, 0x6a6458, 1).strokeRect(cx - 64, ay - 58, 128, 58);
        al.lineStyle(1.2, 0x9a9282, 1).lineBetween(cx - 64, ay - 29, cx + 64, ay - 29).lineBetween(cx - 20, ay - 58, cx - 20, ay - 29).lineBetween(cx + 24, ay - 58, cx + 24, ay - 29).lineBetween(cx, ay - 29, cx, ay);
        al.fillStyle(0xf0ebdf, 1).fillRect(cx - 74, ay - 72, 148, 14).lineStyle(2, 0x6a6458, 1).strokeRect(cx - 74, ay - 72, 148, 14);
        // Damunt l'altar: creu i canelobres de ferro, i el calze
        al.fillStyle(0x1e1c1a, 1).fillRect(cx - 2, ay - 132, 4, 60).fillRect(cx - 16, ay - 118, 32, 4).fillRect(cx - 10, ay - 76, 20, 4);
        [-44, 44].forEach(dx => {
            al.fillStyle(0x1e1c1a, 1).fillRect(cx + dx - 1.5, ay - 94, 3, 22).fillRect(cx + dx - 8, ay - 76, 16, 4).fillRect(cx + dx - 7, ay - 96, 14, 3);
            al.fillStyle(0xf4f0e4, 1).fillRect(cx + dx - 3, ay - 112, 6, 16);
        });
        al.fillStyle(0xc8ccd4, 1).fillRect(cx - 28, ay - 84, 10, 4).fillTriangle(cx - 30, ay - 96, cx - 16, ay - 96, cx - 23, ay - 86).fillRect(cx - 24, ay - 86, 2, 4);
        [-44, 44].forEach((dx, i) => {
            const fl = this.add.ellipse(cx + dx, ay - 118, 6, 11, 0xffc860).setDepth(396);
            this.tweens.add({ targets: fl, scaleY: 1.25, alpha: 0.75, yoyo: true, repeat: -1, duration: 300 + i * 110 });
            this.add.circle(cx + dx, ay - 118, 22, 0xffc860, 0.12).setDepth(396).setBlendMode('ADD');
        });
        this.colisio(cx, ay - 20, 150, 40);
        // Dos testos de flors seques al peu del graó
        [-40, 40].forEach(dx => {
            const t = this.add.graphics().setDepth(grao + 30);
            t.fillStyle(0x2e5a22, 1).fillCircle(cx + dx - 5, grao + 14, 6).fillCircle(cx + dx + 5, grao + 12, 6).fillCircle(cx + dx, grao + 8, 6);
            [[-6, 10, 0xe8c050], [4, 6, 0xd84a3a], [7, 14, 0xe8c050], [-2, 4, 0xf4f0e0]].forEach(([fx, fy, c]) => t.fillStyle(c, 1).fillCircle(cx + dx + fx, grao + fy, 2.5));
            t.fillStyle(0xa0563a, 1).fillEllipse(cx + dx, grao + 22, 26, 10).lineStyle(1.5, 0x4a2414, 1).strokeEllipse(cx + dx, grao + 22, 26, 10);
        });
        this.interactiu(cx, grao + 40, RADI_OBJECTE, DIALEGS.altarGabriel, { altura: 140 });

        // Parets i porta
        this.colisio(x0 / 2, H / 2, x0, H);
        this.colisio((x1 + A) / 2, H / 2, A - x1, H);
        this.colisio(cx, fons / 2, x1 - x0, fons);
        this.colisio((x0 + cx - 50) / 2, H - 10, cx - 50 - x0, 20);
        this.colisio((cx + 50 + x1) / 2, H - 10, x1 - cx - 50, 20);
        this.add.rectangle(cx, H / 2, A, H, 0xffd38a, 0.05).setDepth(80000);
        this.sortida(cx - 50, H - 20, 100, 14, 'ZonaGabriel', 'interior');
    }
}

// ---------------- ELS DIPÒSITS ----------------
// Dos dipòsits d'aigua de la serra en un pla d'herba, de nit, i el mirador amb el trípode del telescopi. Mirant el cel
// (EscenaEstels) s'encén una llum a l'aigua del dipòsit de llevant: és l'Estel de Sant Llorenç. La seva llum aparta la
// boira que tapa el camí del Dolmen (a llevant).
const DIP = { estelX: 1180, estelY: 175, boiraX: 1500 };

class ZonaDipositos extends ZonaBase {
    constructor() {
        super('ZonaDipositos', {
            fosca: true,
            pins: { pi: 0.5 },
            nom: 'Els Dipòsits',
            amplada: 1600,
            alcada: 1000,
            colorFons: '#10162a',
            entrades: {
                gabriel: { x: 70,   y: 585, dir: 'dreta' },
                dolmen:  { x: 1440, y: 585, dir: 'esquerra' }
            }
        });
    }

    construir() {
        this.terra('herba_fosca', 0, 0, 1600, 1000, -1100).setTint(0x9aa8c8);
        this.terra('cami', 0, 520, 1600, 130).setTint(0xb8b8c8);

        // Dos dipòsits d'aigua, de pedra
        [[420, 330], [DIP.estelX, 330]].forEach(([x, y]) => this.posar('diposit', x, y, { col: { w: 270, h: 50 } }));
        // El mirador, entre els dos dipòsits (des del telescopi es veu caure l'estel a l'aigua): una plataforma rodona de pedra
        // amb un ampit baix, i el trípode del telescopi
        const MX = 800, MY = 440, mir = this.add.graphics().setDepth(-1000);
        mir.fillStyle(0x000000, 0.25).fillEllipse(MX + 6, MY + 8, 250, 104);
        mir.fillStyle(0x8a8478, 1).fillEllipse(MX, MY, 240, 96).lineStyle(4, 0x2a2620, 1).strokeEllipse(MX, MY, 240, 96);
        mir.fillStyle(0xa49e90, 1).fillEllipse(MX, MY - 4, 220, 82);
        for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; mir.lineStyle(1.5, 0x5a564c, 0.6).lineBetween(MX, MY - 4, MX + Math.cos(a) * 110, MY - 4 + Math.sin(a) * 41); }
        const ampit = [];                                                        // ampit baix a la meitat del fons
        for (let k = 0; k <= 20; k++) { const a = Math.PI * (1.02 + k / 20 * 0.96); ampit.push({ x: MX + Math.cos(a) * 114, y: MY - 4 + Math.sin(a) * 44 }); }
        mir.lineStyle(14, 0x4a463e, 1).strokePoints(ampit.map(p => ({ x: p.x, y: p.y - 6 })));
        mir.lineStyle(10, 0x8e887a, 1).strokePoints(ampit.map(p => ({ x: p.x, y: p.y - 8 })));
        const muntat = Estat.flag('telescopiMuntat') || Estat.flag('estelsPart1') || Estat.flag('estelLlorenc');
        this.tripode = this.posar(muntat ? 'telescopi_mon' : 'tripode', MX, MY + 10, { col: { w: 36, h: 16 } });
        this.interactiu(MX, MY + 15, RADI_OBJECTE, DIALEGS.telescopiMon, { altura: 120 });
        // Cartell a la vora del camí, sense cap arbre al davant
        this.cartell(230, 500, () => ({ pagines: [{ qui: 'Cartell', text: '→ Dolmen\n← Ermita de Sant Gabriel' }] }));

        this.arbres([[100, 150], [250, 90], [800, 100], [1450, 140], [1350, 900], [1500, 960], [660, 820]]);      // (la parada del carruatge és a baix a l'esquerra)
        [[1250, 800], [1050, 880], [900, 820]].forEach(([x, y]) => this.enemic('escolopendra', x, y));
        [[330, 440], [1290, 440]].forEach(([x, y]) => this.enemic('gripau', x, y));       // gripaus: a prop de l'aigua dels dipòsits

        // Cel de nit estrellat sobre el paisatge
        this.add.rectangle(AMPLE / 2, (ALT - ALT_HUD) / 2, AMPLE / ZOOM_CAMERA + 4, (ALT - ALT_HUD) / ZOOM_CAMERA + 4, 0x060a28, 0.30).setScrollFactor(0).setDepth(90000);
        for (let i = 0; i < 40; i++) {
            const e = this.add.circle(AMPLE / 2 + (Math.random() - 0.5) * AMPLE / ZOOM_CAMERA, -213 + Math.random() * 400, 1.5, 0xffffff, 0.8).setScrollFactor(0).setDepth(90001);
            this.tweens.add({ targets: e, alpha: 0.2, yoyo: true, repeat: -1, duration: 700 + Math.random() * 1500 });
        }

        // La llum de l'estel al dipòsit de llevant (quan s'han comptat els estels i encara no s'ha recollit)
        this.interactiu(DIP.estelX, 350, RADI_GRAN, DIALEGS.estelDiposit, { altura: 200, actiu: () => !!this.llumEstel });
        // La boira que tapa el camí del Dolmen
        if (this.boiraTapa()) this.posarBoiraDolmen();
        else this.sortida(1586, 520, 14, 130, 'ZonaDolmen', 'diposits');
        this.sortida(0, 520, 14, 130, 'ZonaGabriel', 'diposits');
    }

    boiraTapa() { return !Estat.flag('boiraDolmenNeta') && !Estat.te('runna'); }

    actualitzar() {
        const E = Estat;
        if (!this.llumEstel && !this.estelCaient && E.flag('estelsFets') && !E.te('estel_llorenc')) this.posarLlumEstel();
        if (this.llumEstel && E.te('estel_llorenc')) { this.llumEstel.forEach(o => o.destroy()); this.llumEstel = null; }
        if (!this.tripodeMuntat && (E.flag('telescopiMuntat') || E.flag('estelsPart1'))) { this.tripodeMuntat = true; this.tripode.setTexture('telescopi_mon'); }
    }

    // En sortir del telescopi amb la constel·lació feta: la càmera mira el dipòsit de llevant, l'últim estel hi cau del cel i
    // hi deixa la llum; després torna a l'Ineu. Mentrestant no es pot moure ningú
    caureEstel(fet) {
        const { estelX: x, estelY: y } = DIP, cam = this.cameras.main, ui = this.ui();
        this.estelCaient = true;
        ui.bloquejatFins = ui.time.now + 4500;
        cam.stopFollow();
        cam.pan(x - 60, y + 120, 900, 'Sine.easeInOut');
        this.esperar(1000, () => {
            const x0 = x - 300, y0 = Math.max(10, y - 420), cap = this.add.circle(x0, y0, 7, 0xffffff, 1).setDepth(90003);
            const cua = this.add.graphics().setDepth(90002).setBlendMode('ADD');
            Sfx.secret();
            this.tweens.add({ targets: cap, x, y, duration: 900, ease: 'Quad.easeIn',
                onUpdate: () => {
                    const l = Math.hypot(x - x0, y - y0), ux = (x - x0) / l, uy = (y - y0) / l;
                    cua.clear().lineStyle(4, 0xffffff, 0.35).lineBetween(cap.x, cap.y, cap.x - ux * 140, cap.y - uy * 140)
                        .lineStyle(2, 0xffffff, 0.9).lineBetween(cap.x, cap.y, cap.x - ux * 50, cap.y - uy * 50);
                },
                onComplete: () => {
                    cap.destroy(); cua.destroy();
                    cam.flash(300, 216, 232, 255);
                    const esq = this.add.particles(x, y, 'espurna', { speed: { min: 60, max: 200 }, angle: { min: 200, max: 340 }, lifespan: 900, gravityY: 300,
                        scale: { start: 0.45, end: 0 }, tint: [0xd8e8ff, 0xffffff], blendMode: 'ADD', emitting: false }).setDepth(90003);
                    esq.explode(30);
                    this.time.delayedCall(1200, () => esq.destroy());
                    this.posarLlumEstel();
                    this.esperar(1100, () => {
                        cam.pan(this.ineu.x, this.ineu.y, 800, 'Sine.easeInOut');
                        this.esperar(850, () => { cam.startFollow(this.ineu, true, 0.12, 0.12); this.estelCaient = false; if (fet) fet(); });
                    });
                } });
        });
    }

    // Una columna de llum freda baixa del cel fins a l'aigua del dipòsit, i hi queda un punt brillant amb espurnes. Va per sobre
    // del vel de nit (si no, no es veu) i té un estel que parpelleja damunt del dipòsit, perquè es vegi de lluny
    posarLlumEstel() {
        const { estelX: x, estelY: y } = DIP, D = 90002;
        const raig = this.add.rectangle(x, y, 70, 900, 0xd8e8ff, 0.2).setOrigin(0.5, 1).setDepth(D).setBlendMode('ADD');
        const nucli = this.add.rectangle(x, y, 16, 900, 0xffffff, 0.35).setOrigin(0.5, 1).setDepth(D).setBlendMode('ADD');
        const halo = this.add.ellipse(x, y, 140, 40, 0xd8e8ff, 0.6).setDepth(D).setBlendMode('ADD');
        const punt = this.add.circle(x, y, 9, 0xffffff, 1).setDepth(D + 1);
        const estel = this.add.graphics({ x, y: y - 90 }).setDepth(D + 1).setBlendMode('ADD');
        estel.fillStyle(0xffffff, 0.95).fillPoints([{ x: 0, y: -26 }, { x: 5, y: -5 }, { x: 26, y: 0 }, { x: 5, y: 5 }, { x: 0, y: 26 }, { x: -5, y: 5 }, { x: -26, y: 0 }, { x: -5, y: -5 }], true);
        estel.fillStyle(0xd8e8ff, 0.5).fillCircle(0, 0, 10);
        this.tweens.add({ targets: [raig, nucli, halo], alpha: '*=0.5', yoyo: true, repeat: -1, duration: 1300, ease: 'Sine.easeInOut' });
        this.tweens.add({ targets: punt, scale: 1.5, yoyo: true, repeat: -1, duration: 700 });
        this.tweens.add({ targets: estel, scale: { from: 0.7, to: 1.15 }, angle: 45, yoyo: true, repeat: -1, duration: 900, ease: 'Sine.easeInOut' });
        const esp = this.add.particles(x, y, 'espurna', {
            x: { min: -50, max: 50 }, y: { min: -8, max: 8 }, speedY: { min: -40, max: -10 }, lifespan: 1400,
            scale: { start: 0.35, end: 0 }, alpha: { start: 1, end: 0 }, tint: [0xd8e8ff, 0xffffff], frequency: 120, blendMode: 'ADD'
        }).setDepth(D + 2);
        this.llumEstel = [raig, nucli, halo, punt, estel, esp];
    }

    posarBoiraDolmen() {
        const X = DIP.boiraX, Y = 585;
        this.colBoira = this.colisio(X + 30, Y, 140, 240);
        this.foscBoira = this.add.ellipse(X + 40, Y, 260, 300, 0x2a3050, 0.5).setDepth(Y + 60);
        this.boiraDolmen = [-80, 0, 80].map(dy => this.boira(X + 40, Y + dy, 170, 110, 2.4, 0xc8d0ff));
        this.interactiu(X - 50, Y, RADI_GRAN, DIALEGS.boiraDolmen, {
            altura: 150, actiu: () => !!this.boiraDolmen,
            enTancar: () => { if (Estat.te('estel_llorenc')) this.esvairBoiraDolmen(); }
        });
    }

    // L'Estel de Sant Llorenç s'encén a la mà de l'Ineu i la boira s'esfilagarsa
    esvairBoiraDolmen() {
        if (!this.boiraDolmen) return;
        Estat.posaFlag('boiraDolmenNeta');
        const llum = this.add.circle(this.ineu.x, this.ineu.y - 60, 20, 0xe8f0ff, 0.9).setDepth(9000).setBlendMode('ADD');
        this.tweens.add({ targets: llum, radius: 420, alpha: 0, duration: 1600, onComplete: () => llum.destroy() });
        this.boiraDolmen.forEach(b => b.stop());
        this.boiraDolmen = null;
        this.tweens.add({ targets: this.foscBoira, alpha: 0, duration: 2200, onComplete: () => this.foscBoira.destroy() });
        this.obstacles.remove(this.colBoira, true, true);
        Sfx.secret();
        this.sortida(1586, 520, 14, 130, 'ZonaDolmen', 'diposits');
        this.missatge('El camí del Dolmen és lliure.');
        Estat.posaObjectiu(DIALEGS.objectiuRunna(Estat));
        Estat.desar();
    }
}

// ---------------- EL DOLMEN ----------------
// Escena vertical. Com que dels Dipòsits se surt per la dreta, aquí s'entra per l'esquerra, a baix: el camí fa un sol
// colze i puja recte pel bosc (conills, esquirols i ocells el creuen de tant en tant) fins a una clariana amb raigs de
// llum, falgueres, flors i una tanca vella. Al mig, el dolmen de la pantalla del títol, amb Runna clavada a dalt de la
// llosa i animalons al voltant que s'escapen quan l'Ineu s'hi acosta.
const DOL = {
    A: 900, H: 2200, sx: 450, sy: 760,                  // el dolmen (peu) al mig de la clariana
    cx: 450, ample: 150, baixY: 1980, baixH: 140,       // camí: tram que puja (centre x i amplada) i tram de baix (y i gruix)
    peuBosc: 1260                                       // on s'acaba el bosc i comença la clariana
};

class ZonaDolmen extends ZonaBase {
    constructor() {
        super('ZonaDolmen', {
            nom: 'El Dolmen',
            amplada: DOL.A,
            alcada: DOL.H,
            colorFons: '#1a2c16',              // prou clar perquè no compti com a interior: camí amb vores difuminades
            pacifica: true,
            entrades: { diposits: { x: 60, y: DOL.baixY + DOL.baixH / 2, dir: 'dreta' } }
        });
    }

    construir() {
        const { A, H, sx, sy, cx, ample, baixY, baixH, peuBosc } = DOL, x0 = cx - ample / 2, x1 = cx + ample / 2;
        let llavor = 23;
        const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
        this.terra('herba_fosca', 0, 0, A, H, -1100);
        // Clariana: herba més clara i lluminosa
        const cl = this.add.graphics().setDepth(-1090);
        cl.fillStyle(0x9ad86a, 0.22).fillEllipse(A / 2, 720, 840, 1000);
        cl.fillStyle(0xc8f08a, 0.16).fillEllipse(A / 2, 720, 560, 640);
        // Camí: entra per l'esquerra, fa un colze i puja recte fins a la clariana
        this.terra('cami', 0, baixY, x1, baixH);
        this.terra('cami', x0, 1000, ample, baixY + baixH - 1000);

        // El dolmen (amb Runna dibuixada, clavada a la llosa). S'hi puja per darrere: els esglaons no es veuen, els tapa la llosa
        this.dolmen = this.posar('dolmen_buit', sx, sy, { col: { w: 300, h: 40 } });
        // Runna és una capa a part, per davant de l'Ineu quan és damunt la llosa (sempre és darrere l'espasa)
        if (!Estat.te('runna')) this.espClavada = this.add.image(this.dolmen.x, this.dolmen.y, 'dolmen_clavada').setOrigin(0.5, 1).setScale(this.dolmen.scaleX).setDepth(sy + 8);
        const kD = this.dolmen.displayWidth / DOLMEN_DIB.W, topD = this.dolmen.y - this.dolmen.displayHeight;
        const wx = tx => this.dolmen.x + (tx - DOLMEN_DIB.W / 2) * kD, wy = ty => topD + (ty + DOLMEN_DIB.dy) * kD;
        this.espX = wx(DOLMEN_DIB.ex); this.espY = wy(DOLMEN_DIB.ey);          // on s'enfonsa la punta de la fulla
        this.resplendor = this.add.circle(this.espX, this.espY - 55, 90, 0xd8e8ff, Estat.te('runna') ? 0 : 0.12).setDepth(sy + 1).setBlendMode('ADD');
        if (!Estat.te('runna')) this.tweens.add({ targets: this.resplendor, alpha: 0.28, yoyo: true, repeat: -1, duration: 1200 });
        this.posarPujada(wy(DOLMEN_DIB.ly), kD);
        this.interactiu(sx, sy + 15, RADI_GRAN, DIALEGS.dolmenBaix, { altura: 380, actiu: () => !this.alt });
        // Damunt la llosa, darrere l'espasa: les Paraules del Saber
        this.interactiu(this.espX, this.espY - 12, RADI_OBJECTE, DIALEGS.dolmen, { altura: 150, actiu: () => this.alt && !this.cinema });
        this.margaridesPas();

        // Com a la pantalla del títol: una pedra dreta, una tanca de fusta vella, falgueres, roques i flors roses
        const det = this.add.graphics().setDepth(sy + 120);
        det.fillStyle(0x000000, 0.25).fillEllipse(200, 902, 60, 16);
        det.fillStyle(0xa49c8a, 1).fillRoundedRect(178, 760, 44, 140, 8).lineStyle(3, 0x120c08, 1).strokeRoundedRect(178, 760, 44, 140, 8);
        det.fillStyle(0x7a7466, 1).fillRect(208, 766, 12, 132);
        det.fillStyle(0x6e9a48, 0.7).fillEllipse(196, 790, 30, 12).fillEllipse(204, 880, 36, 12);
        this.colisio(200, 890, 50, 20);
        const tanca = (pals, y) => {
            const g = this.add.graphics().setDepth(y + 10);
            g.lineStyle(7, 0x120c08, 1).lineBetween(pals[0], y - 40, pals[pals.length - 1], y - 46).lineBetween(pals[0], y - 18, pals[pals.length - 1], y - 22);
            g.lineStyle(4, 0x7a5a3a, 1).lineBetween(pals[0], y - 40, pals[pals.length - 1], y - 46).lineBetween(pals[0], y - 18, pals[pals.length - 1], y - 22);
            pals.forEach((x, k) => {
                const alt = 60 + (k * 13) % 18;
                g.fillStyle(0x5a4028, 1).fillRect(x - 6, y - alt, 12, alt).lineStyle(2.5, 0x120c08, 1).strokeRect(x - 6, y - alt, 12, alt);
                g.fillStyle(0xffffff, 0.12).fillRect(x - 4, y - alt + 2, 3, alt - 4);
            });
            this.colisio((pals[0] + pals[pals.length - 1]) / 2, y - 6, pals[pals.length - 1] - pals[0] + 12, 14);
        };
        tanca([110, 170, 240, 300], 1000);
        tanca([600, 670, 740, 800], 1000);
        const falguera = (x, y, esc) => {
            const g = this.add.graphics({ x, y }).setDepth(y);
            for (let k = 0; k < 7; k++) {
                const a = -Math.PI / 2 + (k - 3) * 0.32, L = (46 - Math.abs(k - 3) * 6) * esc;
                const ex = Math.cos(a) * L, ey = Math.sin(a) * L * 0.8;
                g.lineStyle(2.5, 0x2e5a22, 1).lineBetween(0, 0, ex, ey);
                for (let f = 0.25; f < 1; f += 0.15) {
                    const px = ex * f, py = ey * f, fl = (1 - f) * 12 * esc;
                    g.lineStyle(3, k % 2 ? 0x4a8a34 : 0x3e7a2c, 1).lineBetween(px, py, px + Math.cos(a - 1) * fl, py + Math.sin(a - 1) * fl).lineBetween(px, py, px + Math.cos(a + 1) * fl, py + Math.sin(a + 1) * fl);
                }
            }
        };
        [[140, 1060, 1.2], [260, 1090, 1], [650, 1070, 1.1], [780, 1050, 1.25], [120, 820, 0.9], [790, 840, 1], [330, 960, 0.8], [580, 950, 0.85]].forEach(([x, y, e]) => falguera(x, y, e));
        [[690, 900, 0.6], [140, 640, 0.7], [800, 500, 0.55]].forEach(([x, y, e]) => this.posar('roca', x, y, { escala: e, col: { w: 50, h: 18 } }));
        for (let n = 0, i = 0; n < 34 && i < 400; i++) {
            const x = 110 + rnd() * 680, y = 520 + rnd() * 520;
            if (Math.abs(x - sx) < 190 && y < sy + 50 && y > sy - 120) continue;            // no damunt del dolmen
            if (Math.abs(x - cx) < 90 && y > 900) continue;                                 // ni al camí
            this.posar('flors', x, y, { fonsY: -800, escala: 0.4 + rnd() * 0.3 }).setTint([0xffb0d0, 0xff90c0, 0xffd0e8][n % 3]);
            n++;
        }

        // Arbres: rodegen la clariana (amb el pas obert per baix) i fan de bosc a banda i banda del camí
        for (let a = 0; a < Math.PI * 2; a += 0.3) {
            if (Math.abs(a - Math.PI / 2) < 0.4) continue;
            this.posar(rnd() < 0.5 ? 'pi' : 'arbre', A / 2 + Math.cos(a) * (430 + rnd() * 40), 740 + Math.sin(a) * (560 + rnd() * 40), { col: { w: 34, h: 16 } });
        }
        for (let y = peuBosc; y < H + 60; y += 115) {
            for (let x = 40; x < A; x += 125) {
                const px = x + (rnd() - 0.5) * 50, py = y + (rnd() - 0.5) * 40;
                if (Math.abs(px - cx) < 150) continue;                                       // el tram que puja
                if (px < x1 + 80 && py > baixY - 30 && py < baixY + baixH + 90) continue;    // el tram de baix
                this.posar(rnd() < 0.55 ? 'pi' : 'arbre', px, py, { col: { w: 34, h: 16 } });
            }
        }
        // Parets del bosc: no s'hi pot passar entre els arbres
        this.colisio((x0 - 35) / 2, (peuBosc + baixY) / 2, x0 - 35, baixY - peuBosc);                 // a l'esquerra del tram que puja
        this.colisio((x1 + 35 + A) / 2, (peuBosc + H) / 2, A - x1 - 35, H - peuBosc);                // a la dreta, fins a baix
        this.colisio((x1 + 35) / 2, (baixY + baixH + H) / 2 + 10, x1 + 35, H - baixY - baixH);       // sota el tram de baix

        // Raigs de llum que baixen entre les capçades fins a l'espasa, i pols daurada que sura
        [[-90, 0.22, 0.16], [10, 0.18, 0.2], [120, 0.24, 0.13]].forEach(([dx, ang, al], i) => {
            const r = this.add.rectangle(sx + dx, sy - 40, 70 + i * 16, 1100, 0xfff4c8, al).setOrigin(0.5, 1).setRotation(ang).setDepth(9500).setBlendMode('ADD');
            this.tweens.add({ targets: r, alpha: al * 0.4, yoyo: true, repeat: -1, duration: 2200 + i * 500, ease: 'Sine.easeInOut' });
        });
        this.add.particles(sx, sy - 200, 'espurna', {
            x: { min: -260, max: 260 }, y: { min: -260, max: 260 }, speedX: { min: -6, max: 6 }, speedY: { min: -10, max: 4 }, lifespan: 4000,
            scale: { start: 0.25, end: 0 }, alpha: { start: 0.8, end: 0 }, tint: [0xfff2b0, 0xffffff], frequency: 160, blendMode: 'ADD'
        }).setDepth(9501);
        this.boira(cx, 1700, 300, 400, 0.8);
        this.boira(200, baixY + 60, 300, 120, 0.5);

        // Animalons quiets al voltant del dolmen (s'escapen quan t'hi acostes): dos ocells damunt la llosa
        this.animals = [['conill', -170, 50, 0], ['conill', 160, 80, 0], ['esquirol', -230, 10, 0], ['esquirol', 220, 20, 0], ['ocell', -90, -200, 1], ['ocell', 110, -195, 1]]
            .map(([key, dx, dy, dalt]) => {
                const x = sx + dx, y = sy + dy, s = this.posar(key, x, y, { fonsY: dalt ? sy + 2 : y }).setFlipX(dx > 0);
                if (key !== 'ocell') this.tweens.add({ targets: s, scaleY: s.scaleY * 0.94, yoyo: true, repeat: -1, duration: 500 + Math.abs(dx) * 3 });
                return { s, x, y, key, fora: false, tornaA: 0 };
            });
        this.properCreuament = 0;

        this.sortida(0, baixY, 14, baixH, 'ZonaDipositos', 'dolmen');
        this.add.rectangle(AMPLE / 2, (ALT - ALT_HUD) / 2, AMPLE / ZOOM_CAMERA + 4, (ALT - ALT_HUD) / ZOOM_CAMERA + 4, 0x0a2010, 0.08).setScrollFactor(0).setDepth(90000);
    }

    enEntrar() {
        this.colLlosa = this.physics.add.collider(this.ineu, this.grupLlosa);
        this.alt = false; this.cinema = false;
    }

    // Mentre l'Ineu puja o baixa els esglaons amagats, el moviment el porta l'animació, no el jugador
    moure(ui, delta) { if (!this.cinema) super.moure(ui, delta); }
    sensePunts() { return !!this.cinema; }
    sincroFantasma() {
        super.sincroFantasma();
        if (this.cinema && this.fantasma) this.fantasma.setAlpha(0);       // la llosa el tapa de debò
    }

    // La llosa és una plataforma: s'hi puja i se'n baixa per darrere (P.vora: la vora de darrere de la cara de dalt). Dalt, l'Ineu
    // només camina per la franja de darrere de l'espasa. Pujar: camina cap avall per darrere i la llosa li tapa els peus; puja
    // esglaó a esglaó fins a la vora i hi entra. Baixar: camina amunt fins a la vora, s'hi enfonsa esglaó a esglaó i surt pel nord.
    actualitzarLlosa() {
        const I = this.ineu, P = this.pujada;
        if (!P || this.cinema) return;
        const vy = I.body.velocity.y, alPas = I.x >= P.x0 && I.x <= P.x1;
        if (!this.alt) {
            if (alPas && vy > 0 && I.y > P.vora - 34 && I.y < P.vora + 4) this.pujar();
            return;
        }
        if (alPas && vy < 0 && I.y < P.dalt + 6) { this.baixar(); return; }
        const dins = (x, y) => y >= P.dalt && y <= P.fins && ((x - P.cx) / P.rx) ** 2 + ((y - P.cy) / P.ry) ** 2 <= 1;
        if (!dins(I.x, I.y)) I.body.reset(this.ultimOk.x, this.ultimOk.y);
        else this.ultimOk = { x: I.x, y: I.y };
        I.setDepth(DOL.sy + 5);
        this.ombraIneu.setPosition(I.x, I.y);
    }

    // Uns quants passos sense col·lisions: [x, y, vista, ms]. Si vista és 'quiet', es queda dret mirant on mirava
    passos(llista, fet) {
        const I = this.ineu, dir4 = { up: 'amunt', down: 'avall', left: 'esquerra', right: 'dreta' };
        let i = 0;
        // les passes sonen com quan camina (una cada 300 ms, alternant el peu)
        const sona = () => { this.altrePas = !this.altrePas; Sfx.pas(this.altrePas); };
        sona();
        const so = this.time.addEvent({ delay: 300, loop: true, callback: sona });
        const seg = () => {
            if (i >= llista.length) { so.remove(); if (fet) fet(); return; }
            const [x, y, v, ms] = llista[i++];
            this.posarDireccio(dir4[v], true, v);
            this.tweens.add({ targets: I, x, y, duration: ms, ease: 'Sine.easeInOut', onComplete: seg });
        };
        seg();
    }

    començarPas() {
        const I = this.ineu;
        this.cinema = true;
        I.body.setVelocity(0); I.body.enable = false;
        this.ombraIneu.setVisible(false);
        I.setDepth(this.dolmen.depth - 1);                     // la llosa el tapa: per sota del dolmen
    }

    // Es pot començar a pujar per tota l'esquena del dolmen (no s'hi queda encallat): si és massa al costat, primer es
    // desplaça fins als esglaons
    pujar() {
        const I = this.ineu, P = this.pujada, x = Phaser.Math.Clamp(I.x, P.cx - P.esglaons, P.cx + P.esglaons);
        this.començarPas();
        const pas = (y, ms) => [x, y, 'down', ms];
        const costat = Math.abs(x - I.x) > 2 ? [[x, I.y, x < I.x ? 'left' : 'right', Math.abs(x - I.x) / VELOCITAT_INEU * 1000]] : [];
        this.passos([...costat, pas(P.vora + 26, 520),                                                 // la llosa li tapa les cames
            pas(P.vora + 16, 300), pas(P.vora + 7, 300), pas(P.vora - 2, 300)], () => {    // tres esglaons amunt
            I.setDepth(DOL.sy + 5);
            this.ombraIneu.setVisible(true).setDepth(DOL.sy + 4);
            this.passos([pas(P.dalt + 8, 260)], () => {
                this.alt = true; this.colLlosa.active = false;
                I.body.enable = true; I.body.reset(I.x, I.y);
                this.ultimOk = { x: I.x, y: I.y };
                this.posarDireccio('avall', false);
                this.cinema = false;
            });
        });
    }

    baixar() {
        const I = this.ineu, P = this.pujada, x = I.x;
        I.body.setVelocity(0); I.body.enable = false; this.cinema = true;
        I.setDepth(DOL.sy + 5);                                 // encara és damunt la llosa
        const pas = (y, ms) => [x, y, 'up', ms];
        this.passos([pas(P.vora, 220)], () => {
            this.començarPas();
            this.passos([pas(P.vora + 9, 300), pas(P.vora + 18, 300), pas(P.vora + 26, 300),     // esglaó a esglaó avall, de cara al nord
                pas(P.vora - 46, 620)], () => {                                                    // i surt per darrere del dolmen
                this.alt = false; this.colLlosa.active = true;
                I.body.enable = true; I.body.reset(I.x, I.y);
                I.setDepth(I.y);
                this.ombraIneu.setVisible(true).setDepth(-500).setPosition(I.x, I.y);
                this.posarDireccio('amunt', false);
                this.cinema = false;
            });
        });
    }

    actualitzar(ara) {
        const I = this.ineu;
        this.actualitzarLlosa();
        // Els animals del dolmen fugen quan l'Ineu s'hi acosta i tornen quan és lluny
        this.animals.forEach(a => {
            const d = Phaser.Math.Distance.Between(I.x, I.y, a.x, a.y);
            if (!a.fora && d < 230) {
                a.fora = true; a.tornaA = ara + 7000;
                const dir = a.x < I.x ? -1 : 1, vola = a.key === 'ocell';
                a.s.setFlipX(dir > 0);
                this.tweens.add({ targets: a.s, x: a.x + dir * 420, y: a.y + (vola ? -260 : 40), alpha: 0, duration: vola ? 1300 : 1600, ease: 'Quad.easeIn' });
                if (!vola) this.tweens.add({ targets: a.s, y: '-=18', yoyo: true, repeat: 4, duration: 150 });
            } else if (a.fora && ara > a.tornaA && d > 420) {
                a.fora = false;
                a.s.setPosition(a.x, a.y).setFlipX(a.x > DOL.sx);
                this.tweens.add({ targets: a.s, alpha: 1, duration: 900 });
            }
        });
        // Pel bosc, de tant en tant un animaló creua el camí davant de l'Ineu (al tram que puja, d'esquerra a dreta o al revés)
        if (I.y > DOL.peuBosc - 100 && I.y < DOL.baixY + 40 && ara > this.properCreuament) {
            this.properCreuament = ara + 2200 + Math.random() * 2600;
            this.creuaAnimal(Math.max(DOL.peuBosc, I.y - 160 - Math.random() * 260));
        }
    }

    creuaAnimal(y) {
        const tria = Math.random(), key = tria < 0.45 ? 'conill' : tria < 0.8 ? 'esquirol' : 'ocell', dreta = Math.random() < 0.5;
        const x0 = dreta ? DOL.cx - 330 : DOL.cx + 330, x1 = dreta ? DOL.cx + 330 : DOL.cx - 330;
        const s = this.posar(key, x0, y, { fonsY: y }).setFlipX(!dreta);
        if (key === 'ocell') {
            s.setDepth(9400).y -= 120;
            this.tweens.add({ targets: s, x: x1, y: s.y - 160, duration: 1500, onComplete: () => s.destroy() });
            this.tweens.add({ targets: s, scaleY: s.scaleY * 0.5, yoyo: true, repeat: 6, duration: 110 });
        } else {
            const dur = key === 'conill' ? 1900 : 1300;
            this.tweens.add({ targets: s, x: x1, duration: dur, onComplete: () => s.destroy() });
            this.tweens.add({ targets: s, y: y - (key === 'conill' ? 22 : 8), yoyo: true, repeat: Math.round(dur / (key === 'conill' ? 320 : 180)), duration: key === 'conill' ? 160 : 90 });
        }
    }

    // On es puja a la llosa (per darrere): la llosa i els pilars bloquegen fins que l'Ineu és dalt. lyMon = y del món del centre
    // de la cara de dalt de la llosa
    posarPujada(lyMon, kD) {
        const { sx, sy } = DOL, vora = lyMon - 44 * kD;
        this.grupLlosa = this.physics.add.staticGroup();
        const bloc = this.add.zone(sx, (vora - 8 + sy - 40) / 2, 352, sy - 40 - (vora - 8));
        this.physics.add.existing(bloc, true); this.grupLlosa.add(bloc);
        // vora: la vora de darrere; dalt..fins: la franja de la cara de dalt on es pot estar (darrere l'espasa); x0..x1: tota l'esquena
        // del bloc (prement cap avall s'hi comença a pujar); esglaons: fins on arriben els esglaons amagats des del mig
        this.pujada = { vora, dalt: vora + 10, fins: this.espY - 18, cx: sx, cy: lyMon, rx: 150, ry: 38, x0: sx - 176, x1: sx + 176, esglaons: 85 };
    }

    // Unes margarides a l'herba just darrere del dolmen, en semicercle al voltant d'on comencen els esglaons amagats
    margaridesPas() {
        const P = this.pujada, f = this.add.graphics().setDepth(-790);
        let sd = 11; const r = () => (sd = sd * 16807 % 2147483647) / 2147483647;
        const margarida = (x, y, e) => {
            for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; f.fillStyle(0xf4f0e0, 0.9).fillEllipse(x + Math.cos(a) * 3 * e, y + Math.sin(a) * 2 * e, 4.5 * e, 3 * e); }
            f.fillStyle(0xe8b830, 1).fillCircle(x, y, 1.6 * e);
        };
        // un semicercle obert cap a la llosa, al voltant d'on comencen els esglaons, una mica desordenat
        for (let k = 0; k <= 16; k++) {
            const a = Math.PI * (1 + k / 16) + (r() - 0.5) * 0.08, R = P.esglaons + 10 + (r() - 0.5) * 16;
            const x = P.cx + Math.cos(a) * R, y = P.vora - 6 + Math.sin(a) * R * 0.7;
            margarida(x, y, 0.8 + r() * 0.5);
            if (r() < 0.3) margarida(x + (r() - 0.5) * 16, y + (r() - 0.5) * 10, 0.7);
        }
    }

    // Les Paraules del Saber ja s'han dit: Runna surt de la pedra i és a la mà de l'Ineu, que l'alça. Raigs de llum blanca i el rètol
    // es queden fins que el jugador prem; després s'esvaeixen i l'Ineu torna a la seva pose, mirant avall
    alcarRunna(fet) {
        const I = this.ineu, cam = this.cameras.main, ui = this.ui(), { sx, sy } = DOL;
        Joc.jingle(this, 'jingle_runna');
        if (this.espClavada) { this.espClavada.destroy(); this.espClavada = null; }
        this.tweens.killTweensOf(this.resplendor); this.resplendor.setAlpha(0);
        const ESC_AIX = (this.textures.get('ineu_aixeca').customData || {}).escala || 0.5;
        I.setVisible(false); if (this.fantasma) this.fantasma.setVisible(false);
        this.ineuAlt = this.add.image(I.x, I.y + 2, 'ineu_aixeca').setOrigin(0.5, 1).setScale(ESC_AIX).setDepth(85000);
        cam.flash(700, 255, 255, 255);
        cam.shake(450, 0.008);
        const punta = { x: I.x + 7, y: I.y - 177 };
        const fosc = this.add.rectangle(sx, sy - 400, 4000, 4000, 0x06081a, 1).setDepth(sy + 4).setAlpha(0);
        this.tweens.add({ targets: fosc, alpha: 0.4, duration: 600 });
        // Línies de llum blanca que surten de la punta de l'espasa i giren a poc a poc
        const raigs = this.add.graphics({ x: punta.x, y: punta.y }).setDepth(84990).setBlendMode('ADD').setAlpha(0);
        let sd = 7; const r = () => (sd = sd * 16807 % 2147483647) / 2147483647;
        for (let k = 0; k < 28; k++) {
            const a = k / 28 * Math.PI * 2 + r() * 0.1, L = 260 + r() * 520;
            raigs.lineStyle(1.5 + r() * 3.5, 0xffffff, 0.35 + r() * 0.4).lineBetween(Math.cos(a) * 30, Math.sin(a) * 30, Math.cos(a) * L, Math.sin(a) * L);
        }
        this.tweens.add({ targets: raigs, alpha: 1, duration: 500 });
        this.tweens.add({ targets: raigs, angle: 360, duration: 40000, repeat: -1 });
        const halo = this.add.circle(punta.x, punta.y, 36, 0xffffff, 0.55).setDepth(84991).setBlendMode('ADD');
        this.tweens.add({ targets: halo, radius: 62, alpha: 0.25, yoyo: true, repeat: -1, duration: 700, ease: 'Sine.easeInOut' });
        this.llum(punta.x, punta.y, 0xffffff);
        // El rètol, sobreimprès
        const t1 = ui.add.text(AMPLE / 2, ALT * 0.3, 'RUNNA', { fontFamily: typeof FONT_TITOL !== 'undefined' ? FONT_TITOL : 'Georgia', fontSize: '96px', fontStyle: 'bold', color: '#ffe08a', stroke: '#2a1808', strokeThickness: 10 }).setOrigin(0.5).setDepth(500).setAlpha(0);
        const t2 = ui.add.text(AMPLE / 2, ALT * 0.3 + 86, "l'espasa del Miracle", estilText(36, '#f2e6c8', { fontStyle: 'italic', stroke: '#2a1808', strokeThickness: 6 })).setOrigin(0.5).setDepth(500).setAlpha(0);
        ui.tweens.add({ targets: [t1, t2], alpha: 1, duration: 700 });
        ui.tweens.add({ targets: t1, scale: { from: 0.8, to: 1 }, duration: 900, ease: 'Back.easeOut' });
        this.esperar(900, () => this.esperarClic(() => {
            const coses = [raigs, halo, fosc];
            this.tweens.killTweensOf(halo);
            this.tweens.add({ targets: coses, alpha: 0, duration: 700, onComplete: () => coses.forEach(o => o.destroy()) });
            ui.tweens.add({ targets: [t1, t2], alpha: 0, duration: 700, onComplete: () => { t1.destroy(); t2.destroy(); } });
            this.time.delayedCall(450, () => {
                this.ineuAlt.destroy(); this.ineuAlt = null;
                I.setVisible(true); if (this.fantasma) this.fantasma.setVisible(true);
                this.posarDireccio('avall', false, 'down');
                this.esperar(400, fet);
            });
        }));
    }
}
