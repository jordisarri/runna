/**
 * EL CEMENTIRI (darrere el Santuari i el Monestir, on s'ajunten).
 * S'hi arriba des de les Runes (est) o des del Monestir (nord). Hi reposen els monjos del Santuari
 * i, en una tomba esquerdada, els monjos primers del segle XV, el cementiri que els obrers van profanar.
 * De la fesomia esquerdada surt la boira i els animalets del cementiri.
 */
class ZonaCementiri extends ZonaBase {
    constructor() {
        super('ZonaCementiri', {
            nom: 'El Cementiri',
            amplada: 1600,
            alcada: 1100,
            colorFons: '#1a2a1a',
            entrades: {
                runes:    { x: 70,   y: 585,  dir: 'dreta' },
                monestir: { x: 1085, y: 1040, dir: 'amunt' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1600, 1100, -1100).setTint(0xa0b898);
        this.terra('cami', 0, 520, 1160, 130);           // des de les Runes
        this.terra('cami', 1010, 520, 150, 580);         // cap al Monestir (sud)
        this.terra('pedra', 560, 260, 280, 250);         // replà davant la tomba esquerdada

        // La tomba esquerdada dels monjos primers: surt boira lila de l'esquerda
        this.posar('tomba_esquerdada', 700, 400, { col: { w: 200, h: 50 } });
        this.interactiu(700, 430, 120, DIALEGS.tombaMonjos, { altura: 110 });
        this.boira(700, 360, 150, 60, 1.6);
        this.add.circle(700, 380, 110, 0xa070ff, 0.10).setDepth(390);
        // Creu de pedra gran, al fons
        this.posar('creu', 700, 230, { col: { w: 46, h: 22 } });
        this.interactiu(700, 235, 80, DIALEGS.creuCementiri, { altura: 180 });

        // Làpides: files a banda i banda del camí (algunes interactives, amb mots dels monjos i veïns)
        const files = [[170, 190], [170, 330], [980, 190], [980, 330], [170, 740], [170, 890], [440, 740], [440, 890], [720, 780], [720, 930]];
        let n = 0;
        files.forEach(([x0, y]) => {
            for (let i = 0; i < 5; i++) {
                const x = x0 + i * 82;
                if (x > 540 && x < 880 && y < 450) continue;       // no tapar el replà de la tomba
                if (x > 960 && x < 1180 && y > 520) continue;      // ni el camí del sud
                this.posar('lapida', x, y, { col: { w: 30, h: 12 } });
                if (n % 7 === 3) this.interactiu(x, y + 8, 55, DIALEGS.lapida(n), { altura: 80 });
                n++;
            }
        });

        this.cartell(120, 600, () => ({ pagines: [{ qui: '', text: 'El Cementiri.\n← Les Runes · ↓ El Monestir\n«Aquí reposen els qui ja no necessiten cap dia.»' }] }));

        // Xiprers al voltant
        this.muralla(0, 40, 1600, 40, 100, 'xiprer');
        this.arbres([[60, 520], [60, 700], [60, 330], [1520, 300], [1520, 520], [1520, 760], [1400, 960], [300, 1040], [900, 1050], [1250, 1050]], 'xiprer');

        // Animalets que surten de la terra esquerdada
        [[420, 420], [900, 440], [600, 700], [1200, 400], [300, 900]].forEach(([x, y]) => this.enemic('escolopendra', x, y));
        this.enemic('visitant', 1100, 800);

        this.sortida(0, 520, 14, 130, 'ZonaRuines', 'cementiri');
        this.sortida(1010, 1086, 150, 14, 'ZonaMonestir', 'cementiri');
        this.add.rectangle(0, 0, AMPLE, ALT, 0x201040, 0.14).setOrigin(0).setScrollFactor(0).setDepth(90000);
    }
}
