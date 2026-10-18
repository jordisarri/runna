/**
 * ZONA 1: LA PLAÇA DEL SANTUARI (punt d'inici)
 * Nord: Església i Ruïnes de l'Església Inacabada · Oest: Creu de l'Aparició i Bassadòria,
 * i el camí cap a la Casa Gran · Est: camí cap al Monestir i les cel·les de Sant Antoni.
 */
class ZonaPlaca extends ZonaBase {
    constructor() {
        super('ZonaPlaca', {
            nom: 'Plaça del Santuari',
            amplada: 1600,
            alcada: 1200,
            entrades: {
                inici:    { x: 1240, y: 820, dir: 'esquerra' },
                casaGran: { x: 50,   y: 565, dir: 'dreta' },
                monestir: { x: 1550, y: 815, dir: 'esquerra' },
                esglesia: { x: 689,  y: 510, dir: 'avall' }
            }
        });
    }

    construir() {
        // --- Terra ---
        this.terra('herba', 0, 0, 1600, 1200, -1100);
        this.terra('cami', 0, 470, 380, 190);            // cap a la Casa Gran (oest)
        this.terra('cami', 1300, 740, 300, 150);         // cap al Monestir (est)
        this.terra('llamborda', 360, 420, 960, 590);     // la plaça
        const vora = this.add.graphics().setDepth(-990);
        vora.lineStyle(4, 0x8a7658, 1).strokeRect(360, 420, 960, 590);

        // --- Església i Ruïnes (nord) ---
        this.posar('esglesia', 800, 540, { fonsY: 452, col: { w: 630, h: 150, dx: -18, dy: -88 } });
        this.sortida(664, 440, 50, 22, 'ZonaEsglesia', 'porta');
        this.interactiu(530, 470, 80, DIALEGS.ruines, { altura: 110 });
        this.posar('xiprer', 1195, 470, { col: { w: 24, h: 12 } });
        this.posar('xiprer', 1245, 488, { col: { w: 24, h: 12 } });

        // --- Creu de l'Aparició i la Bassadòria (oest de la plaça) ---
        this.posar('creu', 365, 830, { col: { w: 46, h: 22 } });
        this.interactiu(365, 830, 75, DIALEGS.creu, { altura: 180 });
        this.posar('bassadoria', 545, 870, { col: { w: 236, h: 92, dy: -26 } });
        this.interactiu(545, 800, 150, DIALEGS.bassadoria, { altura: 110 });
        this.boira(545, 800, 190, 60, 2.2);

        // --- Reixes del terra per on surt la boira ---
        [[600, 625], [1080, 650], [870, 975]].forEach(([x, y]) => {
            this.posar('reixa', x, y, { fonsY: -900 });
            this.interactiu(x, y - 10, 45, DIALEGS.reixa, { altura: 40 });
            this.boira(x, y - 14, 40, 10, 0.8);
        });

        // --- Personatges ---
        this.npc('pare_jordi', 1000, 770, DIALEGS.pareJordi);
        this.andreu = this.npc('germa_andreu', 1180, 940, DIALEGS.germaAndreu, { flipX: true });

        // --- Cartells ---
        this.cartell(300, 465, DIALEGS.cartellOest);
        this.cartell(1345, 735, DIALEGS.cartellEst);

        // --- Arbres ---
        [[110, 250], [230, 340], [140, 980], [300, 1110], [640, 1130], [1040, 1110],
         [1420, 1110], [1540, 980], [1500, 560], [1420, 300], [1540, 380]].forEach(([x, y]) => {
            this.posar('arbre', x, y, { col: { w: 34, h: 16 } });
        });

        // --- Sortides ---
        this.sortida(0, 470, 14, 190, 'ZonaCasaGran', 'placa');
        this.sortida(1586, 740, 14, 150, 'ZonaMonestir', 'placa');

        // Vel lila: el santuari està tocat per la boira
        this.add.rectangle(0, 0, AMPLE, ALT, 0x3a1a55, 0.10).setOrigin(0).setScrollFactor(0).setDepth(90000);
    }

    enEntrar() {
        if (Estat.flag('introVista')) return;
        Estat.posaFlag('introVista');
        this.time.delayedCall(700, () => {
            this.ui().obrirDialeg({
                pagines: [
                    { qui: '', text: 'Santuari del Miracle. Matí.' },
                    { qui: 'Ineu', text: 'Una altra nit de boira... i aquest fred que no marxa. El Pare Jordi em deu estar esperant a la plaça.' },
                    { qui: '', text: 'Mou l\'Ineu amb les fletxes o WASD (o el joystick tàctil).\nPrem ESPAI quan vegis un  !  per parlar o mirar.' }
                ]
            }, () => Estat.desar());
        });
    }
}
