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

        this.terra('herba_fosca', 0, 0, 1600, 1100, -1100);
        this.terra('cami', 700, 0, 200, 1100).setAlpha(0.0);       // (reservat)

        // Pins al voltant, amb un buit de 220 de ample al mig de cada costat
        let llavor = 31 + pas * 17;
        const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
        for (let x = 60; x < 1560; x += 105) {
            if (Math.abs(x - 800) < 120) continue;
            this.posar('xiprer', x + rnd() * 30, 40 + rnd() * 30, { col: { w: 28, h: 14 } });
            this.posar('xiprer', x + rnd() * 30, 1060 + rnd() * 30, { col: { w: 28, h: 14 } });
        }
        for (let y = 130; y < 1000; y += 105) {
            if (Math.abs(y - 550) < 120) continue;
            this.posar('xiprer', 40 + rnd() * 30, y + rnd() * 30, { col: { w: 28, h: 14 } });
            this.posar('xiprer', 1540 + rnd() * 30, y + rnd() * 30, { col: { w: 28, h: 14 } });
        }
        // Pins soltes a l'interior, lluny del centre i dels passos
        for (let i = 0; i < 18; i++) {
            const x = 160 + rnd() * 1280, y = 160 + rnd() * 780;
            if (Phaser.Math.Distance.Between(x, y, 800, 550) < 230) continue;
            if (Math.abs(x - 800) < 140 || Math.abs(y - 550) < 140) continue;
            this.posar(i % 3 ? 'xiprer' : 'arbre', x, y, { col: { w: 28, h: 14 } });
        }

        // Rovellons sota els pins, al costat de la sortida correcta
        const D = ROV_SEQ[pas];
        if (D) this.rovellons(D);
        this.hintLlanterna = Estat.te('llanterna');

        // Sortides
        const mapaSortides = { N: [700, 0, 200, 14], S: [700, 1086, 200, 14], W: [0, 440, 14, 220], E: [1586, 440, 14, 220] };
        Object.entries(mapaSortides).forEach(([d, r]) => this.sortida(r[0], r[1], r[2], r[3], 'ZonaRovellonera', 'x_' + d));

        // Segon llaç de la Nena de les Trenes (el primer és pel camí): a la primera clariana
        if (pas === 0) {
            this.llac = this.posar('llac', 1100, 300, { fonsY: 300 });
            this.tweens.add({ targets: this.llac, y: 294, yoyo: true, repeat: -1, duration: 700 });
            this.interactiu(1100, 300, 70, DIALEGS.llac(2), { altura: 50, actiu: () => this.llac2Lliure() });
            // Amagat darrere un arbust espès: cal tallar-lo amb el bastó
            this.arbust(1100, 335, 'llac2', 'Un arbust espès. Entre les branques hi brilla alguna cosa rosada... Necessites alguna eina per podar-lo... potser l\'Isidre, el del jardí, en sap de fer.');
        }

        // Cercle de bolets (segona clariana): portal màgic cap a la cabana de la Jaumeta, un cop descobert
        if (pas === 1) {
            this.posar('cercle_bolets', 1000, 870, { fonsY: -800 });
            this.interactiu(1000, 870, 90, DIALEGS.cercleRovellonera, {
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
        this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x1a0a30, 0.14).setScrollFactor(0).setDepth(90000);
    }

    // Grup de rovellons als peus d'una parella de pins, pegat a la sortida correcta
    rovellons(D) {
        const base = { N: [800, 190], S: [800, 910], W: [190, 550], E: [1410, 550] }[D];
        this.rovelloGrup = [];
        [[-70, 0], [70, 10], [0, 40], [-30, -30], [40, -25]].forEach(([dx, dy]) => {
            const r = this.add.image(base[0] + dx, base[1] + dy, 'rovello').setScale(0.5).setDepth(base[1] + dy).setAlpha(0.55);
            this.tweens.add({ targets: r, scale: 0.55, yoyo: true, repeat: -1, duration: 900 + dx });
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
            if (perdut && this.pas !== 0) this.ui().notifica('T\'has perdut entre els pins... tornes a la primera clariana');
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

    llac2Lliure() { return Estat.flag('nenaVista') && !Estat.flag('llac2') && Estat.flag('arb_llac2'); }
}

// ---------------- CAMÍ DE LA ROVELLONERA ----------------
// Surt de l'Era (cap a ponent, per davant de l'era) i fa un bon tros amb corbes. A la primera corba hi ha la Nena de les Trenes.
class ZonaCamiRov extends ZonaBase {
    constructor() {
        super('ZonaCamiRov', {
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
                if (Math.abs(px - 2640) < 190 && py > 380 && py < 640) continue;   // que cap arbre tapi el cartell
                if (Phaser.Math.Distance.Between(px, py, 880, 880) < 170 || Phaser.Math.Distance.Between(px, py, 1300, 830) < 120) continue;
                this.posar(rnd() < 0.5 ? 'xiprer' : 'arbre', px, py, { col: { w: 30, h: 14 } });
            }
        }
        [[2300, 460], [1500, 770], [1100, 560], [620, 1100], [500, 1330], [900, 1000]].forEach(([x, y]) => this.posar('roca', x, y, { col: { w: 70, h: 26 } }));
        this.cartell(2640, 420, () => ({ pagines: [{ qui: '', text: '← Rovellonera\n«On hi ha rovellons, hi ha pins; on hi ha pins, hi ha camí.»' }] }));

        // La segona corba, ben endins del camí, on espera la Nena de les Trenes
        if (!Estat.flag('nenaAlliberada')) {
            this.nena = this.posar('nena_trenes', 880, 880, { fonsY: 880 }).setAlpha(0.72);
            this.resplendorNena = this.add.circle(880, 820, 90, 0xcfd8ff, 0.12).setDepth(879);
            this.tweens.add({ targets: [this.nena, this.resplendorNena], y: '-=10', yoyo: true, repeat: -1, duration: 1300, ease: 'Sine.easeInOut' });
            this.interactiu(880, 880, 100, DIALEGS.nenaTrenes, { altura: 130 });
        }
        // Primer llaç: amagat sota una roca que cal empènyer
        this.llac = this.posar('llac', 1300, 830, { fonsY: 830 });
        this.tweens.add({ targets: this.llac, y: 824, yoyo: true, repeat: -1, duration: 700 });
        this.interactiu(1300, 830, 70, DIALEGS.llac(1), { altura: 50, actiu: () => this.llacLliure() });
        this.roca1 = this.pedraMobil(1300, 840, 'llac1', 110, 0,
            'Una roca grossa a la vora del camí, amb l\'herba aixafada al voltant. Sota seu hi brilla una cosa rosada.');

        // Animalets i bolets
        [[2400, 320], [1500, 670], [1000, 660], [400, 1200], [500, 1230]].forEach(([x, y]) => this.enemic('escolopendra', x, y));
        [[2100, 620], [1200, 460], [700, 1060]].forEach(([x, y]) => this.enemic('bolet', x, y));

        this.boira(900, 900, 400, 160, 1);
        this.sortida(2786, 240, 14, 140, 'ZonaEra', 'rovellonera');
        this.sortida(0, 1160, 14, 140, 'ZonaRovellonera', 'cami');
        this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x1a0a30, 0.1).setScrollFactor(0).setDepth(90000);
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
            nom: 'Ermita de Sant Gabriel',
            amplada: 1600,
            alcada: 1100,
            entrades: {
                rovellonera: { x: 800,  y: 80,  dir: 'avall' },
                interior:    { x: 420,  y: 720, dir: 'avall' },
                diposits:    { x: 1530, y: 715, dir: 'esquerra' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1600, 1100, -1100);
        this.terra('cami', 700, 0, 200, 660);            // des de la Rovellonera (nord)
        this.terra('cami', 300, 650, 1300, 130);         // camí davant l'ermita, cap als Dipòsits (est)

        this.edifici('ermita_gabriel', 420, 640, 300, 80, 'ZonaGabrielInt', 'porta', { alt: 90 });
        this.cartell(980, 790, () => ({ pagines: [{ qui: '', text: 'Ermita de Sant Gabriel.\n→ Els Dipòsits (només per a qui sap mirar el cel)\n↑ La Rovellonera' }] }));

        this.terra('cami', 240, 650, 360, 200);          // esplanada de terra seca davant l'ermita
        this.arbres([[150, 200], [320, 140], [600, 180], [1050, 150], [1300, 220], [1480, 160], [140, 520], [160, 880],
                     [420, 1020], [1100, 1020], [1400, 920], [1200, 330], [1450, 420], [600, 900]]);
        // Pins joves i arbustos prims vora la capella (com a la foto): un turó obert, amb poc arbre
        [[215, 655, 0.55], [650, 640, 0.6], [700, 590, 0.45], [110, 700, 0.5]].forEach(([x, y, e]) => this.posar('arbre', x, y, { escala: e, col: { w: 18, h: 10 } }));
        [[400, 900], [1250, 880]].forEach(([x, y]) => this.enemic('bolet', x, y));
        [[400, 300], [1250, 300], [800, 900]].forEach(([x, y]) => this.enemic('escolopendra', x, y));

        this.sortida(700, 0, 200, 14, 'ZonaRovellonera', 'gabriel');
        this.sortida(1586, 650, 14, 130, 'ZonaDipositos', 'gabriel');
        this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x1a0a30, 0.1).setScrollFactor(0).setDepth(90000);
    }
}

// ---------------- ERMITA DE SANT GABRIEL (interior) ----------------
class ZonaGabrielInt extends ZonaBase {
    constructor() {
        super('ZonaGabrielInt', {
            nom: 'Sant Gabriel',
            amplada: 900,
            alcada: 700,
            colorFons: '#140e0a',
            pacifica: true,
            entrades: { porta: { x: 450, y: 620, dir: 'amunt' } }
        });
    }

    construir() {
        this.terra('rajola', 100, 40, 700, 660, -1100);
        const murs = this.add.graphics().setDepth(-1000);
        murs.fillStyle(0x2a1f18, 1).fillRect(60, 0, 40, 700).fillRect(800, 0, 40, 700);
        murs.fillStyle(0x3a2c22, 1).fillRect(100, 0, 700, 70);
        this.colisio(30, 350, 60, 700);
        this.colisio(870, 350, 60, 700);
        this.colisio(450, 55, 700, 110);
        this.colisio(280, 690, 360, 20);
        this.colisio(620, 690, 360, 20);

        // Altar petit amb una creu i el Calze de Rosada
        this.posar('altar', 450, 260, { col: { w: 140, h: 36 } });
        [-90, 90].forEach(dx => {
            const e = this.posar('espelma', 450 + dx, 270, { fonsY: 250 });
            this.tweens.add({ targets: e, alpha: 0.75, yoyo: true, repeat: -1, duration: 350 + dx });
        });
        this.interactiu(450, 300, 90, DIALEGS.altarGabriel, { altura: 100 });
        [270, 630].forEach(x => this.posar('banc', x, 470, { col: { w: 140, h: 16 } }));

        this.add.rectangle(450, 350, 700, 700, 0xffd38a, 0.04).setDepth(80000);
        this.sortida(410, 680, 80, 14, 'ZonaGabriel', 'interior');
    }
}

// ---------------- ELS DIPÒSITS ----------------
class ZonaDipositos extends ZonaBase {
    constructor() {
        super('ZonaDipositos', {
            nom: 'Els Dipòsits',
            amplada: 1600,
            alcada: 1000,
            colorFons: '#10162a',
            entrades: {
                gabriel: { x: 70,   y: 585, dir: 'dreta' },
                dolmen:  { x: 1530, y: 585, dir: 'esquerra' }
            }
        });
    }

    construir() {
        this.terra('pedra', 0, 0, 1600, 1000, -1100).setTint(0x8890b0);
        this.terra('cami', 0, 520, 1600, 130);

        // Dos dipòsits d'aigua circulars
        [[420, 330], [1180, 330]].forEach(([x, y]) => this.posar('diposit', x, y, { col: { w: 270, h: 50 } }));
        // El mirador amb el telescopi
        this.posar('telescopi_mon', 1000, 640, { col: { w: 36, h: 16 } });
        this.interactiu(1000, 645, 95, DIALEGS.telescopiMon, { altura: 120 });
        this.cartell(240, 600, () => ({ pagines: [{ qui: '', text: 'Els Dipòsits: aigua de la serra, i el millor cel de la comarca.\n→ Camí cap al Dolmen' }] }));

        this.arbres([[100, 150], [250, 100], [800, 100], [1450, 140], [1520, 700], [1450, 900], [130, 800], [300, 940], [1300, 940]]);
        [[1250, 760], [450, 780], [900, 450]].forEach(([x, y]) => this.enemic('escolopendra', x, y));

        // Cel de nit estrellat sobre el paisatge
        this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x060a28, 0.30).setScrollFactor(0).setDepth(90000);
        for (let i = 0; i < 40; i++) {
            const e = this.add.circle(AMPLE / 2 + (Math.random() - 0.5) * AMPLE / ZOOM_CAMERA, -213 + Math.random() * 400, 1.5, 0xffffff, 0.8).setScrollFactor(0).setDepth(90001);
            this.tweens.add({ targets: e, alpha: 0.2, yoyo: true, repeat: -1, duration: 700 + Math.random() * 1500 });
        }

        this.sortida(0, 520, 14, 130, 'ZonaGabriel', 'diposits');
        this.sortida(1586, 520, 14, 130, 'ZonaDolmen', 'diposits');
    }
}

// ---------------- EL DOLMEN ----------------
class ZonaDolmen extends ZonaBase {
    constructor() {
        super('ZonaDolmen', {
            nom: 'El Dolmen',
            amplada: 1600,
            alcada: 1100,
            colorFons: '#1c2a1a',
            entrades: { diposits: { x: 70, y: 585, dir: 'dreta' } }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1600, 1100, -1100).setTint(0xa8c8a0);
        this.terra('cami', 0, 520, 800, 130);

        // Cercle de pedres grosses al voltant de la llosa on dorm Runna
        for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2 + 0.2;
            const x = 800 + Math.cos(a) * 330, y = 640 + Math.sin(a) * 200;
            if (x < 800 && Math.abs(y - 640) < 130) continue;     // deixa lliure l'entrada per l'oest
            this.posar('roca', x, y, { escala: 2.0, col: { w: 130, h: 40 } });
        }
        this.posar('llosa', 800, 700, { fonsY: 650, escala: 1.8 });
        this.runnaPedra = this.posar('runna_pedra', 800, 690, { col: { w: 50, h: 20 } });
        this.resplendor = this.add.circle(800, 600, 90, 0xd8e8ff, Estat.te('runna') ? 0 : 0.12).setDepth(689);
        if (!Estat.te('runna')) this.tweens.add({ targets: this.resplendor, alpha: 0.25, yoyo: true, repeat: -1, duration: 1200 });
        this.interactiu(800, 700, 100, () => Estat.te('runna') ? DIALEGS.dolmenBuit(Estat) : DIALEGS.dolmen(Estat), { altura: 190 });

        this.arbres([[120, 160], [300, 100], [560, 130], [1050, 120], [1300, 100], [1500, 170], [110, 560], [150, 960],
                     [450, 1020], [1150, 1030], [1470, 940], [1500, 540], [260, 380], [1350, 380]]);
        this.sortida(0, 520, 14, 130, 'ZonaDipositos', 'dolmen');
        this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x102040, 0.06).setScrollFactor(0).setDepth(90000);
    }

    // El moment èpic: es desperta Runna
    despertarRunna() {
        const cam = this.cameras.main;
        cam.shake(1500, 0.004);
        cam.flash(900, 255, 255, 255);
        const raig = this.add.rectangle(800, 0, 70, 700, 0xe8f2ff, 0.0).setOrigin(0.5, 0).setDepth(695);
        this.tweens.add({ targets: raig, alpha: 0.85, duration: 700, yoyo: true, hold: 900 });
        const p = this.add.particles(800, 690, 'espurna', {
            speedY: { min: -260, max: -90 }, speedX: { min: -70, max: 70 }, lifespan: 1500,
            scale: { start: 0.8, end: 0 }, tint: 0xd8e8ff, frequency: 40, quantity: 3
        }).setDepth(696);
        this.time.delayedCall(2600, () => { p.stop(); });
        this.time.delayedCall(4200, () => p.destroy());
        // So èpic: acord ascendent
        [1, 3, 2].forEach((n, i) => this.time.delayedCall(300 + i * 400, () => {
            const ctx = this.sound.context; if (!ctx) return;
            if (ctx.state === 'suspended') ctx.resume();
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.type = 'triangle'; o.frequency.value = [0, 330, 392, 494][n] * 1.5;
            g.gain.setValueAtTime(0.0001, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.05);
            g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);
            o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 1.9);
        }));
        this.tweens.add({ targets: this.runnaPedra, y: this.runnaPedra.y - 24, duration: 1800 });
        this.time.delayedCall(2800, () => {
            this.runnaPedra.setAlpha(0.0);
            this.resplendor.setAlpha(0);
            this.ui().obrirDialeg(DIALEGS.runnaDespertada(Estat), () => Estat.desar());
        });
    }
}
