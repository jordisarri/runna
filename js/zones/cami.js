/**
 * EL CAMÍ DE LA DESAPARICIÓ I LES SEVES PARADES
 * Camí (12 columnes) → Ermita de la Desaparició (exterior i interior) → L'Era → Jardí pergolat.
 */

// ---------------- CAMÍ DE LA DESAPARICIÓ ----------------
class ZonaCami extends ZonaBase {
    constructor() {
        super('ZonaCami', {
            nom: 'Camí de la Desaparició',
            amplada: 2800,
            alcada: 900,
            entrades: {
                runes:  { x: 2740, y: 450, dir: 'esquerra' },
                ermita: { x: 60,   y: 450, dir: 'dreta' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 2800, 900, -1100);
        this.terra('cami', 0, 380, 2800, 140);

        // Les 12 columnes de la processó, alternades a banda i banda del camí
        for (let i = 0; i < 12; i++) {
            const x = 2540 - i * 190, y = i % 2 === 0 ? 370 : 575;   // la columna 1 és la més propera a les Runes (est)
            this.posar('columna', x, y, { col: { w: 30, h: 14 } });
            this.interactiu(x, y + 6, 85, DIALEGS.columna(i + 1), { altura: 150 });
        }

        [[700, 450], [1250, 450], [1700, 430], [2200, 450], [2500, 460]].forEach(([x, y]) => this.enemic('escolopendra', x, y));
        this.cartell(2650, 560, DIALEGS.cartellCami);
        this.muralla(0, 140, 2800, 140, 130);
        this.muralla(0, 770, 2800, 770, 130);
        this.boira(900, 450, 400, 80, 1);
        this.boira(1900, 450, 400, 80, 1);

        this.sortida(2786, 380, 14, 140, 'ZonaRuines', 'cami');
        this.sortida(0, 380, 14, 140, 'ZonaErmita', 'cami');

        this.add.rectangle(0, 0, AMPLE, ALT, 0x3a1a55, 0.10).setOrigin(0).setScrollFactor(0).setDepth(90000);
    }
}

// ---------------- ERMITA DE LA DESAPARICIÓ (exterior) ----------------
class ZonaErmita extends ZonaBase {
    constructor() {
        super('ZonaErmita', {
            nom: 'Ermita de la Desaparició',
            amplada: 1400,
            alcada: 1000,
            entrades: {
                cami:     { x: 1340, y: 705, dir: 'esquerra' },
                era:      { x: 960,  y: 940, dir: 'amunt' },
                interior: { x: 500,  y: 710, dir: 'avall' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1400, 1000, -1100);
        this.terra('cami', 400, 640, 1000, 130);
        this.terra('cami', 880, 640, 160, 360);

        this.edifici('ermita', 500, 600, 300, 80, 'ZonaErmitaInt', 'ermita', { alt: 90 });
        this.interactiu(500, 640, 70, DIALEGS.ermitaPorta, { altura: 190, actiu: () => false });

        this.cartell(1120, 610, DIALEGS.sortidaErmita);
        this.arbres([[120, 200], [300, 150], [700, 220], [900, 160], [1150, 240], [1300, 160], [150, 520],
                     [180, 820], [420, 900], [720, 900], [1200, 880], [1320, 480]]);
        this.muralla(0, 330, 0, 800, 100);

        this.enemic('escolopendra', 700, 800);
        this.sortida(1386, 640, 14, 130, 'ZonaCami', 'ermita');
        this.sortida(880, 986, 160, 14, 'ZonaEra', 'ermita');
    }
}

// ---------------- ERMITA DE LA DESAPARICIÓ (interior) ----------------
class ZonaErmitaInt extends ZonaBase {
    constructor() {
        super('ZonaErmitaInt', {
            nom: 'Ermita de la Desaparició',
            amplada: 1000,
            alcada: 700,
            colorFons: '#140e0a',
            pacifica: true,
            entrades: { porta: { x: 500, y: 630, dir: 'amunt' } }
        });
    }

    construir() {
        this.terra('pedra', 100, 40, 800, 660, -1100);
        const murs = this.add.graphics().setDepth(-1000);
        murs.fillStyle(0x2a1f18, 1).fillRect(60, 0, 40, 700).fillRect(900, 0, 40, 700);
        murs.fillStyle(0x3a2c22, 1).fillRect(100, 0, 800, 70);
        this.colisio(30, 350, 60, 700);
        this.colisio(970, 350, 60, 700);
        this.colisio(500, 55, 800, 110);
        this.colisio(300, 690, 400, 20);
        this.colisio(700, 690, 400, 20);

        // Dues taules de pedra al fons, darrere l'altar
        this.posar('taula_pedra', 340, 190, { col: { w: 90, h: 20 } });
        this.interactiu(340, 210, 90, DIALEGS.taulaPedra(1), { altura: 170 });
        this.posar('taula_pedra', 660, 190, { col: { w: 90, h: 20 } });
        this.interactiu(660, 210, 90, DIALEGS.taulaPedra(2), { altura: 170 });

        // Altar
        this.posar('altar', 500, 300, { col: { w: 140, h: 36 } });
        this.interactiu(500, 330, 85, DIALEGS.altarErmita, { altura: 100 });

        this.add.rectangle(500, 350, 800, 700, 0xffd38a, 0.04).setDepth(80000);
        this.sortida(460, 680, 80, 14, 'ZonaErmita', 'interior');
    }
}

// ---------------- L'ERA ----------------
class ZonaEra extends ZonaBase {
    constructor() {
        super('ZonaEra', {
            nom: 'L\'Era',
            amplada: 1600,
            alcada: 1000,
            entrades: {
                ermita: { x: 960,  y: 70,  dir: 'avall' },
                jardi:  { x: 1540, y: 565, dir: 'esquerra' },
                rovellonera: { x: 60, y: 765, dir: 'dreta' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1600, 1000, -1100);
        this.terra('cami', 880, 0, 160, 540);
        this.terra('cami', 880, 500, 720, 130);
        this.terra('cami', 880, 500, 160, 330);          // baixa cap al camí de la Rovellonera
        this.terra('cami', 0, 700, 1040, 130);           // camí cap a ponent, per davant de l'era
        this.terra('pedra', 340, 520, 360, 170);          // l'era: replà empedrat

        // Dos roures enormes amb dos bancs al mig, mirant l'horitzó (nord)
        this.posar('roure', 300, 520, { col: { w: 60, h: 30 } });
        this.posar('roure', 760, 520, { col: { w: 60, h: 30 } });
        this.posar('banc', 470, 580, { col: { w: 140, h: 16 } });
        this.posar('banc', 610, 580, { col: { w: 140, h: 16 } });

        // El Garf, savi inventor
        this.npc('garf', 540, 660, DIALEGS.garf);

        // L'Home del Carruatge Verd, més al sud
        this.posar('carruatge', 1180, 820, { col: { w: 190, h: 50 } });
        this.npc('home_carruatge', 1300, 850, DIALEGS.homeCarruatge);

        this.cartell(850, 600, DIALEGS.cartellEra);
        this.arbres([[120, 200], [300, 130], [520, 190], [700, 130], [1150, 150], [1350, 240], [1500, 150],
                     [320, 930], [700, 930], [1000, 940], [1500, 900], [1500, 760]]);

        this.sortida(880, 0, 160, 14, 'ZonaErmita', 'era');
        this.sortida(1586, 500, 14, 130, 'ZonaJardi', 'era');
        this.sortida(0, 700, 14, 130, 'ZonaCamiRov', 'era');
    }
}

// ---------------- JARDÍ PERGOLAT ----------------
class ZonaJardi extends ZonaBase {
    constructor() {
        super('ZonaJardi', {
            nom: 'Jardí pergolat',
            amplada: 1600,
            alcada: 1000,
            entrades: { era: { x: 60, y: 565, dir: 'dreta' }, taverna: { x: 1540, y: 565, dir: 'esquerra' } }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1600, 1000, -1100);
        this.terra('cami', 0, 500, 1600, 130);
        this.terra('llamborda', 800, 640, 220, 200);

        // Pergoles sobre el camí (decoratives: l'Ineu hi passa per sota)
        [380, 640].forEach(x => this.posar('pergola', x, 520, { fonsY: -900 }));
        // Parterres de flors a banda i banda
        let llavor = 5;
        const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
        for (let i = 0; i < 34; i++) {
            const y = i % 2 ? 150 + rnd() * 270 : 680 + rnd() * 260;
            this.posar('flors', 120 + rnd() * 820, y, { fonsY: -800 });
        }

        // La llosa secreta: s'obre quan hi creix la flor de lluna
        this.posar('llosa', 910, 760, { fonsY: -700 });
        this.florLluna = this.posar('flors', 910, 760, { escala: 0.8 });
        this.interactiu(910, 765, 80, DIALEGS.llosaJardi, { altura: 60 });

        // L'Isidre, coix i entranyable
        this.npc('isidre', 740, 720, DIALEGS.isidre);

        // L'Hospederia, adossada al jardí
        this.posar('hospederia', 1250, 440, { col: { w: 520, h: 110 } });
        this.interactiu(1250, 460, 90, DIALEGS.hospederia, { altura: 120 });

        this.arbres([[1300, 700], [1380, 860], [1150, 900], [1500, 900],
                     [130, 120], [320, 90], [600, 120], [850, 100], [1100, 100], [1350, 100], [1520, 160],
                     [130, 920], [400, 940], [650, 960]]);

        this.cartell(1420, 480, () => ({ pagines: [{ qui: '', text: '→ La Taverna i la Casa Gran\n← L\'Era' }] }));
        this.sortida(0, 500, 14, 130, 'ZonaEra', 'jardi');
        this.sortida(1586, 500, 14, 130, 'ZonaCasaGran', 'oest');
    }

    actualitzar(ara) {
        this.florLluna.setVisible(Estat.flag('llosaOberta'));
    }
}
