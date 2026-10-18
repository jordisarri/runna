/**
 * ZONES VEÏNES (versió provisional del Pas 1)
 * Ja es poden visitar i tenen els seus personatges, però es completaran als passos següents.
 */

// ---------------- ESGLÉSIA (interior) ----------------
class ZonaEsglesia extends ZonaBase {
    constructor() {
        super('ZonaEsglesia', {
            nom: 'Església del Miracle',
            amplada: 1280,
            alcada: 820,
            colorFons: '#140e0a',
            entrades: { porta: { x: 640, y: 770, dir: 'amunt' } }
        });
    }

    construir() {
        // Terra i murs (la nau va de x=240 a x=1040)
        this.terra('rajola', 240, 60, 800, 760, -1100);
        const murs = this.add.graphics().setDepth(-1000);
        murs.fillStyle(0x2a1f18, 1).fillRect(200, 0, 40, 820).fillRect(1040, 0, 40, 820);
        murs.fillStyle(0x3a2c22, 1).fillRect(240, 0, 800, 70);
        this.colisio(120, 410, 240, 820);
        this.colisio(1160, 410, 240, 820);
        this.colisio(640, 120, 800, 240);
        this.colisio(420, 810, 360, 20);
        this.colisio(860, 810, 360, 20);

        // Retaule Major i orgue
        this.posar('retaule', 640, 300, { fonsY: 240 });
        this.interactiu(640, 320, 100, DIALEGS.retaule, { altura: 120 });
        this.posar('orgue', 940, 380, { col: { w: 110, h: 50 } });
        this.npc('pare_daniel', 880, 440, DIALEGS.pareDaniel);

        // Reclinatori: desar partida
        this.posar('reclinatori', 640, 390, { col: { w: 60, h: 16 } });
        this.interactiu(640, 395, 70, () => ({
            pagines: [
                { qui: '', text: 'T\'agenolles al reclinatori i resses una estona en silenci.' },
                { qui: '', text: 'Et sents en pau. (Partida desada.)' }
            ],
            enAcabar: () => { this.guardarPosicio(); Estat.desar(); this.ui().notifica('Partida desada'); }
        }), { altura: 50 });

        // Bancs
        [480, 570, 660].forEach(y => {
            this.posar('banc', 470, y, { col: { w: 140, h: 16 } });
            this.posar('banc', 810, y, { col: { w: 140, h: 16 } });
        });

        // Llum de les vidrieres
        this.add.rectangle(640, 410, 800, 820, 0xffd38a, 0.05).setDepth(80000);

        this.sortida(600, 800, 80, 20, 'ZonaPlaca', 'esglesia');
    }
}

// ---------------- MONESTIR (exterior) ----------------
class ZonaMonestir extends ZonaBase {
    constructor() {
        super('ZonaMonestir', {
            nom: 'El Monestir',
            amplada: 1600,
            alcada: 1000,
            entrades: { placa: { x: 60, y: 520, dir: 'dreta' } }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1600, 1000, -1100);
        this.terra('cami', 0, 450, 1600, 140);
        this.terra('llamborda', 560, 430, 480, 80);
        // Carretera principal
        const g = this.add.graphics().setDepth(-1000);
        g.fillStyle(0x4a4a4e, 1).fillRect(0, 840, 1600, 110);
        g.fillStyle(0xe8e0c8, 1);
        for (let x = 20; x < 1600; x += 90) g.fillRect(x, 892, 46, 6);

        this.posar('monestir', 800, 440, { col: { w: 600, h: 140, dy: -10 } });
        this.interactiu(800, 450, 70, DIALEGS.enConstruccio('Biblioteca del Monestir'), { altura: 90 });
        this.npc('pare_alcui', 600, 540, DIALEGS.pareAlcui);

        this.cartell(1480, 450, DIALEGS.enConstruccio('→ Cel·les de Sant Antoni (a tocar de la carretera)'));
        [[160, 250], [330, 200], [1300, 260], [1480, 220], [250, 720], [1250, 720]].forEach(([x, y]) => {
            this.posar('arbre', x, y, { col: { w: 34, h: 16 } });
        });

        this.sortida(0, 450, 14, 140, 'ZonaPlaca', 'monestir');
    }
}

// ---------------- CASA GRAN, LA FONT I L'HOME DEL RAÏM ----------------
class ZonaCasaGran extends ZonaBase {
    constructor() {
        super('ZonaCasaGran', {
            nom: 'La Casa Gran i la Font',
            amplada: 1600,
            alcada: 1100,
            entrades: { placa: { x: 1540, y: 700, dir: 'esquerra' } }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1600, 1100, -1100);
        this.terra('cami', 0, 620, 1600, 160);
        this.terra('llamborda', 420, 500, 560, 130);

        this.posar('casa_gran', 700, 480, { col: { w: 620, h: 140, dy: -10 } });

        // Escalinates
        const esc = this.add.graphics().setDepth(-980);
        for (let i = 0; i < 4; i++) {
            esc.fillStyle(i % 2 ? 0xb3a58c : 0xc4b69c, 1).fillRect(620, 480 + i * 22, 160, 22);
        }
        this.posar('home_raim', 590, 580, { col: { w: 46, h: 18 } });
        this.interactiu(590, 585, 75, DIALEGS.homeRaim, { altura: 190 });

        this.posar('font', 1100, 610, { col: { w: 90, h: 30 } });
        this.interactiu(1100, 615, 85, DIALEGS.font, { altura: 130 });

        this.cartell(860, 600, DIALEGS.enConstruccio('↓ Celler de la Casa Gran (ping-pong)'));
        this.cartell(120, 610, DIALEGS.enConstruccio('← El Bar · l\'Hostatgeria'));

        [[150, 250], [300, 340], [1250, 260], [1450, 340], [200, 950], [700, 980], [1300, 960]].forEach(([x, y]) => {
            this.posar('arbre', x, y, { col: { w: 34, h: 16 } });
        });

        this.sortida(1586, 620, 14, 160, 'ZonaPlaca', 'casaGran');
    }
}
