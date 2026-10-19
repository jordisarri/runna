/**
 * LA CASA GRAN (masmorra, primera sala): l'Escalinata amb l'Home del Raïm.
 * Entrades: la porta de reixa del porxo d'arcs (oest de la plaça del Santuari), la porta de servei
 * del costat de la Taverna i la porta secreta camuflada de la Sala del Ping-pong. Totes demanen el Clauer de Novici.
 * La resta de la masmorra (Sala dels Retrats, Cuina i Rebost, Celler de les Botes, Cripta dels Monjos) arribarà en una fase propera.
 */
class ZonaCasaGranInt extends ZonaBase {
    constructor() {
        super('ZonaCasaGranInt', {
            nom: 'La Casa Gran · Escalinata',
            amplada: 1400,
            alcada: 1000,
            colorFons: '#120c08',
            pacifica: true,
            entrades: {
                porxo:   { x: 700,  y: 930, dir: 'amunt' },
                costat:  { x: 1250, y: 740, dir: 'esquerra' },
                secreta: { x: 150,  y: 740, dir: 'dreta' }
            }
        });
    }

    construir() {
        // Terra de marbre i murs
        this.terra('rajola', 130, 80, 1140, 920, -1100).setTint(0xcfc2b0);
        const murs = this.add.graphics().setDepth(-1000);
        murs.fillStyle(0x2a1f18, 1).fillRect(90, 0, 40, 1000).fillRect(1270, 0, 40, 1000);
        murs.fillStyle(0x3a2c22, 1).fillRect(130, 0, 1140, 90);
        this.colisio(50, 500, 80, 1000);
        this.colisio(1350, 500, 80, 1000);
        this.colisio(700, 80, 1140, 160);
        this.colisio(380, 990, 500, 20);
        this.colisio(1020, 990, 500, 20);

        // Gran escalinata central cap al nord, amb baranes
        const esc = this.add.graphics().setDepth(-980);
        for (let i = 0; i < 9; i++) {
            const ample = 460 - i * 14, y = 600 - i * 44;
            esc.fillStyle(i % 2 ? 0xb8a98c : 0xc9ba9d, 1).fillRect(700 - ample / 2, y, ample, 44);
            esc.lineStyle(2, 0x8a7a5e, 1).strokeRect(700 - ample / 2, y, ample, 44);
        }
        esc.fillStyle(0x7a2a2a, 1).fillRect(676, 204, 48, 440);   // catifa vermella
        this.colisio(450, 400, 24, 430);      // barana esquerra
        this.colisio(950, 400, 24, 430);      // barana dreta

        // L'Home del Raïm, al mig de l'escalinata, amb el cap girat cap enrere
        this.posar('home_raim', 700, 470, { col: { w: 46, h: 18 } });
        this.interactiu(700, 475, 85, DIALEGS.homeRaimInt, { altura: 190 });

        // Portes: dalt de l'escalinata (Sala dels Retrats), el Celler a l'esquerra, la cuina i servei a la dreta
        const porta = (x, y, w, h) => this.add.rectangle(x, y, w, h, 0x4a2c16).setStrokeStyle(4, 0x2a1a0c).setDepth(y - 60);
        porta(700, 150, 90, 120); porta(250, 330, 80, 110);
        this.interactiu(700, 215, 90, DIALEGS.portaRetrats, { altura: 120 });
        this.interactiu(250, 400, 90, DIALEGS.portaCeller, { altura: 120 });

        // Porta de servei (dreta) cap a l'exterior, porta camuflada (esquerra) cap al Ping-pong
        porta(1285, 740, 20, 110); porta(115, 740, 20, 110).setFillStyle(0x6a4a2c);
        this.sortida(1286, 690, 14, 100, 'ZonaCasaGran', 'costat');
        this.sortida(116, 690, 14, 100, 'ZonaPingpong', 'secreta');

        // Llums i detalls
        [[330, 200], [1070, 200], [330, 760], [1070, 760]].forEach(([x, y]) => {
            const e = this.posar('espelma', x, y, { fonsY: y });
            this.tweens.add({ targets: e, alpha: 0.7, yoyo: true, repeat: -1, duration: 400 + x % 200 });
        });
        this.cartell(900, 880, DIALEGS.cartellCasaGran);
        this.add.rectangle(700, 500, 1140, 1000, 0xffd38a, 0.05).setDepth(80000);
        this.sortida(640, 986, 120, 14, 'ZonaPlaca', 'porxo');
    }
}
