/**
 * LA CABANA DE LA JAUMETA: molt lluny, al mig del bosc. Només s'hi arriba per un portal màgic:
 * l'Alzina Buida del Bosc de Sant Joan (cal portar-hi aigua de la font) o el cercle de bolets de la Rovellonera.
 */
class ZonaCabana extends ZonaBase {
    constructor() {
        super('ZonaCabana', {
            pins: { pi: 0.3 },
            nom: 'La cabana de la Jaumeta',
            amplada: 1400,
            alcada: 1000,
            colorFons: '#14301a',
            entrades: {
                portal:   { x: 320, y: 840, dir: 'dreta' },
                interior: { x: 800, y: 640, dir: 'avall' }
            }
        });
    }

    construir() {
        this.terra('herba_fosca', 0, 0, 1400, 1000, -1100).setTint(0xb8e0a8);
        this.terra('cami', 760, 620, 90, 380).setAlpha(0.8);

        // La cabana, bruta i deixada
        this.edifici('cabana', 800, 590, 300, 70, 'ZonaCabanaInt', 'porta', { alt: 80 });
        this.posar('olla', 1000, 660, { col: { w: 50, h: 20 } });
        this.add.circle(1000, 600, 55, 0x9ae060, 0.12).setDepth(660);
        this.boira(790, 300, 140, 60, 0.5);

        // Cercle de bolets: el portal de tornada
        this.cercle = this.posar('cercle_bolets', 320, 880, { fonsY: -800 });
        this.resplandor = this.add.circle(320, 860, 90, 0xb0ffb0, 0.12).setDepth(861);
        this.tweens.add({ targets: this.resplandor, alpha: 0.28, yoyo: true, repeat: -1, duration: 900 });
        this.interactiu(320, 870, 90, DIALEGS.portalTornada, {
            altura: 40,
            enTancar: () => {
                const rov = Estat.dades.portalTorna === 'rov';
                this.canviarZona(rov ? 'ZonaRovellonera' : 'ZonaBosc', 'portal');
            }
        });

        // Ocells als arbres (la Jaumeta hi parla)
        [[560, 280], [1180, 360], [380, 430], [1100, 760], [650, 860]].forEach(([x, y], i) => {
            const o = this.posar('ocell', x, y, { fonsY: y });
            this.tweens.add({ targets: o, y: y - 6, yoyo: true, repeat: -1, duration: 600 + i * 90, delay: i * 130 });
        });

        // Roba estesa, sacs, calaixos... tot abandonat
        [[560, 640], [620, 700], [1120, 520], [480, 560]].forEach(([x, y]) => this.posar('flors', x, y, { fonsY: y - 20 }));
        [[1100, 780], [540, 780]].forEach(([x, y]) => this.posar('roca', x, y, { col: { w: 60, h: 24 } }));

        this.arbres([[120, 150], [300, 90], [520, 130], [820, 90], [1050, 130], [1280, 160], [90, 520], [140, 800],
                     [400, 980], [1000, 980], [1280, 880], [1300, 560], [200, 340], [1180, 280]]);
        // Les bestioles no arriben tan lluny: només algun bolet mal-humorat
        this.enemic('bolet', 1150, 880);
        this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x0a3010, 0.12).setScrollFactor(0).setDepth(90000);
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
        this.terra('cami', 100, 40, 700, 660, -1100).setTint(0x8a7a60);
        const murs = this.add.graphics().setDepth(-1000);
        murs.fillStyle(0x3a2a1c, 1).fillRect(60, 0, 40, 700).fillRect(800, 0, 40, 700).fillRect(100, 0, 700, 80);
        this.colisio(30, 350, 60, 700);
        this.colisio(870, 350, 60, 700);
        this.colisio(450, 60, 700, 120);
        this.colisio(280, 690, 360, 20);
        this.colisio(620, 690, 360, 20);

        // Olla al foc, jaç de palla, prestatges... tot enrenou
        this.posar('olla', 450, 300, { col: { w: 60, h: 24 } });
        this.add.circle(450, 240, 70, 0x9ae060, 0.12).setDepth(300);
        const llit = this.add.graphics().setDepth(-950);
        llit.fillStyle(0xb09a50, 1).fillRoundedRect(140, 120, 150, 90, 14).lineStyle(3, 0x4a3a18, 1).strokeRoundedRect(140, 120, 150, 90, 14);
        for (let i = 0; i < 16; i++) llit.lineStyle(2, 0x8a7430, 1).lineBetween(150 + i * 8, 130, 156 + i * 8, 200);
        this.colisio(215, 165, 150, 80);
        [[620, 130], [670, 130], [720, 130]].forEach(([x, y]) => this.posar('flors', x, y, { fonsY: y }));
        [[190, 480], [330, 560], [700, 420], [610, 560], [250, 330]].forEach(([x, y], i) => this.posar(i % 2 ? 'pergami' : 'flors', x, y, { fonsY: y - 30 }));
        [[160, 330], [700, 250]].forEach(([x, y]) => this.posar('roca', x, y, { escala: 0.6, col: { w: 40, h: 16 } }));
        [[250, 110], [560, 100], [680, 110]].forEach(([x, y], i) => {
            const o = this.posar('ocell', x, y, { fonsY: y });
            this.tweens.add({ targets: o, y: y - 5, yoyo: true, repeat: -1, duration: 700 + i * 150 });
        });
        this.boira(450, 200, 100, 40, 0.3);

        this.npc('jaumeta', 560, 420, DIALEGS.jaumeta);

        this.add.rectangle(450, 350, 700, 700, 0xa0e070, 0.05).setDepth(80000);
        this.sortida(410, 680, 80, 14, 'ZonaCabana', 'interior');
    }
}
