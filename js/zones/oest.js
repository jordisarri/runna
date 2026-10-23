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
            this.posar(i % 3 ? 'pi' : 'arbre', x, y, { col: { w: 28, h: 14 } });
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
                this.posar(rnd() < 0.6 ? 'pi' : 'arbre', px, py, { col: { w: 30, h: 14 } });
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
        this.cartell(930, 800, () => ({ pagines: [{ qui: '', text: 'Ermita de Sant Gabriel.\n→ Els Dipòsits (només per a qui sap mirar el cel)\n↑ La Rovellonera' }] }));

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
// Dos dipòsits d'aigua de la serra en un pla d'herba, de nit, i el mirador amb el trípode del telescopi. Mirant el cel
// (EscenaEstels) s'encén una llum a l'aigua del dipòsit de llevant: és l'Estel de Sant Llorenç. La seva llum aparta la
// boira que tapa el camí del Dolmen (a llevant).
const DIP = { estelX: 1180, estelY: 175, boiraX: 1500 };

class ZonaDipositos extends ZonaBase {
    constructor() {
        super('ZonaDipositos', {
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
        // El mirador: una plataforma rodona de pedra amb un ampit baix, i el trípode del telescopi
        const MX = 1000, MY = 760, mir = this.add.graphics().setDepth(-1000);
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
        this.interactiu(MX, MY + 15, 95, DIALEGS.telescopiMon, { altura: 120 });
        // Cartell a la vora del camí, sense cap arbre al davant
        this.cartell(230, 500, () => ({ pagines: [{ qui: '', text: 'Els Dipòsits: aigua de la serra, i el millor cel de la comarca.\n→ Camí cap al Dolmen' }] }));

        this.arbres([[100, 150], [250, 90], [800, 100], [1450, 140], [1350, 900], [1500, 960], [120, 960], [560, 960], [660, 820]]);
        [[1250, 800], [450, 800], [800, 440]].forEach(([x, y]) => this.enemic('escolopendra', x, y));

        // Cel de nit estrellat sobre el paisatge
        this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x060a28, 0.30).setScrollFactor(0).setDepth(90000);
        for (let i = 0; i < 40; i++) {
            const e = this.add.circle(AMPLE / 2 + (Math.random() - 0.5) * AMPLE / ZOOM_CAMERA, -213 + Math.random() * 400, 1.5, 0xffffff, 0.8).setScrollFactor(0).setDepth(90001);
            this.tweens.add({ targets: e, alpha: 0.2, yoyo: true, repeat: -1, duration: 700 + Math.random() * 1500 });
        }

        // La llum de l'estel al dipòsit de llevant (quan s'han comptat els estels i encara no s'ha recollit)
        this.interactiu(DIP.estelX, 350, 120, DIALEGS.estelDiposit, { altura: 200, actiu: () => !!this.llumEstel });
        // La boira que tapa el camí del Dolmen
        if (this.boiraTapa()) this.posarBoiraDolmen();
        else this.sortida(1586, 520, 14, 130, 'ZonaDolmen', 'diposits');
        this.sortida(0, 520, 14, 130, 'ZonaGabriel', 'diposits');
    }

    boiraTapa() { return !Estat.flag('boiraDolmenNeta') && !Estat.te('runna'); }

    actualitzar() {
        const E = Estat;
        if (!this.llumEstel && E.flag('estelsFets') && !E.te('estel_llorenc')) this.posarLlumEstel();
        if (this.llumEstel && E.te('estel_llorenc')) { this.llumEstel.forEach(o => o.destroy()); this.llumEstel = null; }
        if (!this.tripodeMuntat && (E.flag('telescopiMuntat') || E.flag('estelsPart1'))) { this.tripodeMuntat = true; this.tripode.setTexture('telescopi_mon'); }
    }

    // Una columna de llum freda baixa del cel fins a l'aigua del dipòsit, i hi queda un punt brillant amb espurnes
    posarLlumEstel() {
        const { estelX: x, estelY: y } = DIP;
        const raig = this.add.rectangle(x, y, 60, 900, 0xd8e8ff, 0.12).setOrigin(0.5, 1).setDepth(400).setBlendMode('ADD');
        const halo = this.add.ellipse(x, y, 120, 34, 0xd8e8ff, 0.5).setDepth(400).setBlendMode('ADD');
        const punt = this.add.circle(x, y, 8, 0xffffff, 1).setDepth(401);
        this.tweens.add({ targets: [raig, halo], alpha: '*=0.4', yoyo: true, repeat: -1, duration: 1300, ease: 'Sine.easeInOut' });
        this.tweens.add({ targets: punt, scale: 1.5, yoyo: true, repeat: -1, duration: 700 });
        const esp = this.add.particles(x, y, 'espurna', {
            x: { min: -50, max: 50 }, y: { min: -8, max: 8 }, speedY: { min: -40, max: -10 }, lifespan: 1400,
            scale: { start: 0.35, end: 0 }, alpha: { start: 1, end: 0 }, tint: [0xd8e8ff, 0xffffff], frequency: 120, blendMode: 'ADD'
        }).setDepth(402);
        this.llumEstel = [raig, halo, punt, esp];
    }

    posarBoiraDolmen() {
        const X = DIP.boiraX, Y = 585;
        this.colBoira = this.colisio(X + 30, Y, 140, 240);
        this.foscBoira = this.add.ellipse(X + 40, Y, 260, 300, 0x2a3050, 0.5).setDepth(Y + 60);
        this.boiraDolmen = [-80, 0, 80].map(dy => this.boira(X + 40, Y + dy, 170, 110, 2.4, 0xc8d0ff));
        this.interactiu(X - 50, Y, 110, DIALEGS.boiraDolmen, {
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
        this.flotant(DIP.boiraX, 470, 'El camí del Dolmen és lliure', '#d8e0ff');
        Estat.posaObjectiu(DIALEGS.objectiuRunna(Estat));
        Estat.desar();
    }
}

// ---------------- EL DOLMEN ----------------
// Escena vertical, com el bosc de l'Espasa Mestra: s'hi entra per baix i un camí puja serpentejant entre arbres atapeïts
// (conills, esquirols i ocells el creuen de tant en tant) fins a una clariana amb raigs de llum, un cercle de pedres,
// una era de lloses gravada i, al fons, el dolmen. Davant del dolmen, Runna clavada a la pedra, amb animalons al voltant
// que s'escapen quan l'Ineu s'hi acosta.
const DOL = { A: 900, H: 2400, sx: 450, sy: 720, peuBosc: 1450 };
const camiDolmen = y => DOL.A / 2 + 110 * Math.sin((DOL.H - y) / 280);       // el centre del camí del bosc a cada alçada

class ZonaDolmen extends ZonaBase {
    constructor() {
        super('ZonaDolmen', {
            nom: 'El Dolmen',
            amplada: DOL.A,
            alcada: DOL.H,
            colorFons: '#13200f',
            pacifica: true,
            entrades: { diposits: { x: camiDolmen(DOL.H - 80), y: DOL.H - 80, dir: 'amunt' } }
        });
    }

    construir() {
        const { A, H, sx, sy } = DOL;
        let llavor = 23;
        const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
        this.terra('herba_fosca', 0, 0, A, H, -1100);
        // Clariana: herba més clara i lluminosa
        const cl = this.add.graphics().setDepth(-1090);
        cl.fillStyle(0x9ad86a, 0.22).fillEllipse(A / 2, 760, 820, 1060);
        cl.fillStyle(0xc8f08a, 0.16).fillEllipse(A / 2, 760, 560, 720);
        // Camí de terra que puja serpentejant pel bosc i s'obre a la clariana
        for (let y = DOL.peuBosc - 140; y < H; y += 16) this.terra('cami', camiDolmen(y) - 75, y, 150, 20).setDepth(-1080);
        // Era de lloses al voltant de l'espasa: anells de pedra i un trisquel gravat
        const era = this.add.graphics().setDepth(-1070);
        era.fillStyle(0x000000, 0.18).fillEllipse(sx + 6, sy + 30, 470, 300);
        era.fillStyle(0x9a9482, 1).fillEllipse(sx, sy + 24, 460, 290).lineStyle(4, 0x4a463c, 1).strokeEllipse(sx, sy + 24, 460, 290);
        era.fillStyle(0xb2ac98, 1).fillEllipse(sx, sy + 24, 380, 236);
        [[300, 186], [200, 124]].forEach(([w, h]) => era.lineStyle(3, 0x6e6858, 0.9).strokeEllipse(sx, sy + 24, w, h));
        for (let k = 0; k < 16; k++) {
            const a = k / 16 * Math.PI * 2;
            era.lineStyle(2, 0x6e6858, 0.7).lineBetween(sx + Math.cos(a) * 150, sy + 24 + Math.sin(a) * 93, sx + Math.cos(a) * 230, sy + 24 + Math.sin(a) * 145);
        }
        era.lineStyle(4, 0x5a8ab8, 0.8);                                       // trisquel gravat davant l'espasa
        for (let k = 0; k < 3; k++) {
            const a0 = k * Math.PI * 2 / 3 - Math.PI / 2;
            era.beginPath();
            for (let t = 0; t <= 1.001; t += 0.05) {
                const r = 6 + t * 34, a = a0 + t * Math.PI * 1.4;
                const x = sx + Math.cos(a) * r, y = sy + 70 + Math.sin(a) * r * 0.62;
                t ? era.lineTo(x, y) : era.moveTo(x, y);
            }
            era.strokePath();
        }

        // El dolmen, al fons de la clariana, i Runna clavada a la pedra al davant
        this.posar('dolmen', sx, sy - 90, { col: { w: 300, h: 50 } });
        this.runnaPedra = this.posar(Estat.te('runna') ? 'runna_pedra_buida' : 'runna_pedra', sx, sy, { col: { w: 70, h: 24 } });
        this.resplendor = this.add.circle(sx, sy - 70, 90, 0xd8e8ff, Estat.te('runna') ? 0 : 0.12).setDepth(sy - 1);
        if (!Estat.te('runna')) this.tweens.add({ targets: this.resplendor, alpha: 0.25, yoyo: true, repeat: -1, duration: 1200 });
        this.interactiu(sx, sy + 10, 100, () => Estat.te('runna') ? DIALEGS.dolmenBuit(Estat) : DIALEGS.dolmen(Estat), { altura: 190 });

        // Cercle de pedres dretes al voltant de l'era (obert per baix, per on s'arriba)
        for (let i = 0; i < 9; i++) {
            const a = Math.PI / 2 + 0.55 + i * (Math.PI * 2 - 1.1) / 8;
            this.posar('roca', sx + Math.cos(a) * 300, sy + 30 + Math.sin(a) * 200, { escala: 0.9, col: { w: 60, h: 22 } });
        }
        // Arbres atapeïts: rodegen la clariana i fan de bosc a banda i banda del camí
        for (let a = 0; a < Math.PI * 2; a += 0.3) {
            if (Math.abs(a - Math.PI / 2) < 0.42) continue;                    // l'entrada de la clariana, a baix
            this.posar(rnd() < 0.5 ? 'pi' : 'arbre', A / 2 + Math.cos(a) * (430 + rnd() * 40), 790 + Math.sin(a) * (600 + rnd() * 40), { col: { w: 34, h: 16 } });
        }
        for (let y = DOL.peuBosc - 40; y < H + 40; y += 115) {
            for (let x = 40; x < A; x += 125) {
                const px = x + (rnd() - 0.5) * 50, py = y + (rnd() - 0.5) * 40;
                if (Math.abs(px - camiDolmen(py)) < 175) continue;
                this.posar(rnd() < 0.55 ? 'pi' : 'arbre', px, py, { col: { w: 34, h: 16 } });
            }
        }
        // Parets invisibles a banda i banda del camí del bosc (els arbres no deixen cap pas)
        for (let y = DOL.peuBosc; y < H; y += 40) {
            const c = camiDolmen(y);
            this.colisio((c - 110) / 2, y + 20, c - 110, 40);
            this.colisio((c + 110 + A) / 2, y + 20, A - c - 110, 40);
        }

        // Raigs de llum que baixen entre les capçades fins a l'espasa, i pols daurada que sura
        [[-90, 0.22, 0.16], [10, 0.18, 0.2], [120, 0.24, 0.13]].forEach(([dx, ang, al], i) => {
            const r = this.add.rectangle(sx + dx, sy - 40, 70 + i * 16, 1100, 0xfff4c8, al).setOrigin(0.5, 1).setRotation(ang).setDepth(9500).setBlendMode('ADD');
            this.tweens.add({ targets: r, alpha: al * 0.4, yoyo: true, repeat: -1, duration: 2200 + i * 500, ease: 'Sine.easeInOut' });
        });
        this.add.particles(sx, sy - 200, 'espurna', {
            x: { min: -260, max: 260 }, y: { min: -260, max: 260 }, speedX: { min: -6, max: 6 }, speedY: { min: -10, max: 4 }, lifespan: 4000,
            scale: { start: 0.25, end: 0 }, alpha: { start: 0.8, end: 0 }, tint: [0xfff2b0, 0xffffff], frequency: 160, blendMode: 'ADD'
        }).setDepth(9501);
        this.boira(camiDolmen(1900), 1900, 400, 300, 0.8);
        this.boira(camiDolmen(2200), 2200, 400, 200, 0.6);

        // Animalons quiets al voltant de l'espasa (s'escapen quan t'hi acostes) i els que creuen el camí del bosc
        this.animals = [['conill', -150, 40], ['conill', 140, 70], ['esquirol', -100, -20], ['esquirol', 170, 0], ['ocell', -60, -230], ['ocell', 70, -245]]
            .map(([key, dx, dy]) => {
                const x = sx + dx, y = sy + dy, s = this.posar(key, x, y, { fonsY: key === 'ocell' ? sy - 60 : y }).setFlipX(dx > 0);   // els ocells, damunt la llosa del dolmen
                if (key !== 'ocell') this.tweens.add({ targets: s, scaleY: s.scaleY * 0.94, yoyo: true, repeat: -1, duration: 500 + Math.abs(dx) * 3 });
                return { s, x, y, key, fora: false, tornaA: 0 };
            });
        this.properCreuament = 0;

        this.sortida(camiDolmen(H) - 75, H - 14, 150, 14, 'ZonaDipositos', 'dolmen');
        this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x0a2010, 0.08).setScrollFactor(0).setDepth(90000);
    }

    actualitzar(ara) {
        const I = this.ineu;
        // Els animals de l'era fugen quan l'Ineu s'hi acosta i tornen quan és lluny
        this.animals.forEach(a => {
            const d = Phaser.Math.Distance.Between(I.x, I.y, a.x, a.y);
            if (!a.fora && d < 230) {
                a.fora = true; a.tornaA = ara + 7000;
                const dir = a.x < I.x ? -1 : 1, vola = a.key === 'ocell';
                a.s.setFlipX(dir > 0 ? false : true);
                this.tweens.add({ targets: a.s, x: a.x + dir * 420, y: a.y + (vola ? -260 : 40), alpha: 0, duration: vola ? 1300 : 1600, ease: 'Quad.easeIn' });
                if (!vola) this.tweens.add({ targets: a.s, y: '-=18', yoyo: true, repeat: 4, duration: 150 });
            } else if (a.fora && ara > a.tornaA && d > 420) {
                a.fora = false;
                a.s.setPosition(a.x, a.y).setFlipX(a.x > DOL.sx);
                this.tweens.add({ targets: a.s, alpha: 1, duration: 900 });
            }
        });
        // Pel bosc, de tant en tant un animaló creua el camí davant de l'Ineu
        if (I.y > DOL.peuBosc - 200 && ara > this.properCreuament) {
            this.properCreuament = ara + 2200 + Math.random() * 2600;
            this.creuaAnimal(I.y - 160 - Math.random() * 260);
        }
    }

    creuaAnimal(y) {
        const tria = Math.random(), key = tria < 0.45 ? 'conill' : tria < 0.8 ? 'esquirol' : 'ocell', dreta = Math.random() < 0.5;
        const c = camiDolmen(y), x0 = dreta ? c - 330 : c + 330, x1 = dreta ? c + 330 : c - 330;
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

    // El moment èpic: es desperta Runna
    despertarRunna() {
        const { sx, sy } = DOL, cam = this.cameras.main;
        cam.shake(1500, 0.004);
        cam.flash(900, 255, 255, 255);
        const raig = this.add.rectangle(sx, 0, 70, sy - 10, 0xe8f2ff, 0.0).setOrigin(0.5, 0).setDepth(sy + 5);
        this.tweens.add({ targets: raig, alpha: 0.85, duration: 700, yoyo: true, hold: 900 });
        const p = this.add.particles(sx, sy - 10, 'espurna', {
            speedY: { min: -260, max: -90 }, speedX: { min: -70, max: 70 }, lifespan: 1500,
            scale: { start: 0.8, end: 0 }, tint: 0xd8e8ff, frequency: 40, quantity: 3
        }).setDepth(sy + 6);
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
        const espasa = this.add.image(this.runnaPedra.x, this.runnaPedra.y, 'runna_espasa').setOrigin(0.5, 1).setScale(this.runnaPedra.scaleX).setDepth(sy + 1);
        this.runnaPedra.setTexture('runna_pedra_buida');
        this.tweens.add({ targets: espasa, y: espasa.y - 30, duration: 1800 });
        this.time.delayedCall(2800, () => {
            espasa.destroy();
            this.resplendor.setAlpha(0);
            this.ui().obrirDialeg(DIALEGS.runnaDespertada(Estat), () => Estat.desar());
        });
    }
}
