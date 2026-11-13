/**
 * EL CAMÍ DE LA DESAPARICIÓ (les 12 columnes del missatge). Continua a ermita.js, era.js i jardi.js.
 */

// ---------------- CAMÍ DE LA DESAPARICIÓ ----------------
class ZonaCami extends ZonaBase {
    constructor() {
        super('ZonaCami', {
            pins: { pinyer: 0.4 },
            nom: 'Camí de la Desaparició',
            amplada: 2800,
            alcada: 1000,
            entrades: {
                runes:  { x: 2740, y: 450, dir: 'esquerra' },
                ermita: { x: 60,   y: 450, dir: 'dreta' },
                secret: { x: 1380, y: 200, dir: 'avall' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 2800, 1000, -1100);
        this.terra('cami', 0, 380, 2800, 140);

        // Les 12 columnes de la processó, alternades a banda i banda del camí
        for (let i = 0; i < 12; i++) {
            const x = 2540 - i * 190, y = i % 2 === 0 ? 370 : 575;   // la columna 1 és la més propera a les Runes (est)
            this.posar('columna_proces_' + i, x, y, { col: { w: 34, h: 14 }, opac: true });
            this.interactiu(x, y + 6, RADI_OBJECTE, DIALEGS.columna(i + 1), { altura: 120 });
        }

        [[700, 450], [1250, 450], [1950, 440], [2500, 460]].forEach(([x, y]) => this.enemic('escolopendra', x, y));
        this.cartell(2650, 560, DIALEGS.cartellCami);
        // Mur d'arbres del nord: només a x=1380 hi ha dos arbres més separats, i per aquí es puja a la cabana (sense marcar-ho)
        this.muralla(0, 140, 1160, 140, 128);
        this.muralla(1600, 140, 2800, 140, 132);
        this.colisio(1230, 55, 140, 110); this.colisio(1530, 55, 140, 110);
        this.sortides.push({ r: new Phaser.Geom.Rectangle(1300, 60, 160, 52), desti: 'ZonaCabanaCami', entrada: 'porta', peu: true });
  // cal travessar la fila d'arbres fins dalt de tot
        // Fila de baix: als extrems, arbres més petits (la capçada no ha de tapar les sortides de les puntes)
        this.muralla(0, 930, 2800, 930, 130, 'arbre', false);
        this.copes.filter(img => img.y === 930 && (img.x < 200 || img.x > 2600)).forEach(img => img.destroy());
        this.copes = this.copes.filter(img => img.active);
        [[40, 950], [170, 950], [2630, 950], [2760, 950]].forEach(([x, y]) => this.posar('arbre', x, y, { escala: 0.55, col: { w: 1, h: 1, fix: true } }));
        this.boiraAmbient(900, 450, 400, 80, 1);
        this.boiraAmbient(1900, 450, 400, 80, 1);

        this.sortida(2786, 380, 14, 140, 'ZonaRuines', 'cami');
        this.sortida(0, 380, 14, 140, 'ZonaErmita', 'cami');
    }
}
