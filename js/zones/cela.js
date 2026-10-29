/**
 * LA CEL·LA DE SANT ANTONI (interior)
 * Una cel·la de monjo, buida però ben cuidada: llar de foc amb olla penjada, llit amb manta de llana, taula amb cadires, finestra amb porticons,
 * prestatge, creu i hàbit penjat de la paret i estora. Ningú no hi viu ara (han baixat a ajudar a buscar els nens): és un lloc per mirar.
 */

class ZonaCelaStAntoni extends ZonaBase {
    constructor() {
        super('ZonaCelaStAntoni', {
            nom: 'Cel·la de Sant Antoni',
            amplada: 800,
            alcada: 640,
            colorFons: '#100a06',
            pacifica: true,
            entrades: { porta: { x: 400, y: 560, dir: 'amunt' } }
        });
    }

    construir() {
        const A = 800, H = 640;
        this.terra('taulons', 20, 40, 760, 600, -1100).setTint(0xb89a70);
        this.add.image(20, 0, 'paret_cela').setOrigin(0).setScale(1 / RES).setDepth(-995);
        this.add.image(400, 470, 'estora_cela').setOrigin(0.5).setScale(1 / RES).setDepth(-1040);

        // Llar de foc al mig de la paret del fons, amb flama viva i resplendor
        this.add.image(400, 212, 'llar_cela').setOrigin(0.5, 1).setScale(1.15 / RES).setDepth(-960);
        this.foc = this.posar('foc', 400, 196, { fonsY: 210 });
        this.tweens.add({ targets: this.foc, scaleY: this.foc.scaleY * 1.1, scaleX: this.foc.scaleX * 0.94, yoyo: true, repeat: -1, duration: 240 });
        const resplendor = this.add.circle(400, 220, 190, 0xff9a30, 0.14).setDepth(300);
        this.tweens.add({ targets: resplendor, alpha: 0.24, scale: 1.06, yoyo: true, repeat: -1, duration: 420 });
        this.add.particles(400, 168, 'espurna', { speedY: { min: -60, max: -20 }, speedX: { min: -14, max: 14 }, lifespan: 1400, scale: { start: 0.14, end: 0 }, alpha: { start: 0.8, end: 0 }, tint: [0xffa040, 0xffe080], frequency: 260, blendMode: 'ADD' }).setDepth(250);

        // Finestra amb un feix de llum, creu, prestatge i hàbit penjat a la paret
        this.add.image(150, 176, 'finestra_cela').setOrigin(0.5, 1).setScale(1 / RES).setDepth(-990);
        const f = this.add.graphics().setDepth(-900).setBlendMode('ADD');
        f.fillGradientStyle(0xfff0c0, 0xfff0c0, 0xfff0c0, 0xfff0c0, 0.16, 0.16, 0, 0).fillTriangle(120, 176, 182, 176, 270, 470);
        f.fillGradientStyle(0xfff0c0, 0xfff0c0, 0xfff0c0, 0xfff0c0, 0.16, 0, 0, 0).fillTriangle(120, 176, 270, 470, 190, 470);
        this.tweens.add({ targets: f, alpha: 0.65, yoyo: true, repeat: -1, duration: 3600, ease: 'Sine.easeInOut' });
        this.add.image(268, 34, 'creu_cela').setOrigin(0.5, 0).setScale(1 / RES).setDepth(-985);
        this.add.image(548, 44, 'prestatge_cela').setOrigin(0.5, 0).setScale(1 / RES).setDepth(-985);
        this.add.image(676, 40, 'habit_cela').setOrigin(0.5, 0).setScale(1 / RES).setDepth(-985);

        // El llit contra la paret de l'esquerra
        this.add.image(112, 414, 'llit_cela').setOrigin(0.5, 1).setScale(1.15 / RES).setDepth(414);
        this.colisio(112, 322, 130, 190);

        // Taula amb dues cadires, a la dreta
        this.add.image(560, 406, 'taula_cela').setOrigin(0.5, 1).setScale(1.3 / RES).setDepth(406);
        this.colisio(560, 384, 146, 40);
        [[470, 450, false], [650, 450, true]].forEach(([x, y, flip]) => {
            this.add.image(x, y, 'cadira_cela').setOrigin(0.5, 1).setScale(1.25 / RES).setFlipX(flip).setDepth(y);
            this.colisio(x, y - 8, 42, 16);
        });
        const espelma = this.add.circle(536, 326, 80, 0xffc060, 0.1).setDepth(407);
        this.tweens.add({ targets: espelma, alpha: 0.05, yoyo: true, repeat: -1, duration: 380 });

        // Un barril de vi i uns sacs a l'angle del fons
        this.posar('barril', 730, 262, { col: { w: 44, h: 18 } });

        // Pols dins la llum de la finestra
        this.add.particles(0, 0, 'espurna', {
            emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(120, 200, 200, 260) },
            speedX: { min: -5, max: 5 }, speedY: { min: -6, max: 3 }, lifespan: 4200, scale: { start: 0.12, end: 0 }, alpha: { start: 0.7, end: 0 },
            tint: [0xfff0c0], frequency: 300, blendMode: 'ADD'
        }).setDepth(9000);

        // Parets i col·lisions (obertura de sortida a baix, al mig)
        this.colisio(20, H / 2, 40, H);
        this.colisio(A - 20, H / 2, 40, H);
        this.colisio(A / 2, 100, A, 200);
        this.colisio(175, H - 10, 350, 20);
        this.colisio(625, H - 10, 350, 20);

        this.add.rectangle(A / 2, H / 2, A, H, 0xffd38a, 0.07).setDepth(80000);
        this.sortida(360, H - 22, 80, 14, 'ZonaSantAntoni', 'cela');
    }
}
