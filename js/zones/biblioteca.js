/**
 * LA BIBLIOTECA DEL MONESTIR
 * Sala alta de prestatgeries fins al sostre, dos vitralls que tenyeixen el terra de colors, pols que balla dins la llum,
 * una taula llarga de lectura amb espelmes, el faristol amb la Crònica, un globus terraqüi i una escala de mà.
 * Hi treballa el Pare Alcuí, que llegeix els fragments i dona el Saber.
 */

class ZonaBiblioteca extends ZonaBase {
    constructor() {
        super('ZonaBiblioteca', {
            nom: 'Biblioteca del Monestir',
            amplada: 1100,
            alcada: 900,
            colorFons: '#100a06',
            pacifica: true,
            entrades: { porta: { x: 550, y: 800, dir: 'amunt' } }
        });
    }

    construir() {
        const A = 1100, H = 900;
        // Parquet de roure en cistell i catifa llarga
        this.terra('parquet_biblio', 100, 40, 900, 860, -1100);
        this.add.image(470, 230, 'catifa_biblio').setOrigin(0).setScale(1 / RES).setDepth(-1050);

        // Paret del fons: pedra picada amb sòcol de fusta, dos vitralls apuntats i una prestatgeria a cada banda
        this.add.image(58, 0, 'paret_biblio').setOrigin(0).setScale(1 / RES).setDepth(-995);
        [330, 770].forEach(cx => {
            this.add.image(cx, 194, 'vitrall_biblio').setOrigin(0.5, 1).setScale(1 / RES).setDepth(-990);
        });
        // Feixos de llum de colors que baixen fins al terra
        [330, 770].forEach((cx, i) => {
            const f = this.add.graphics().setDepth(-900).setBlendMode('ADD');
            [[0x2a5ab8, -30], [0xd8a030, 0], [0xb83a3a, 30]].forEach(([c, dx]) => {          // cada feix s'esvaeix cap al terra
                f.fillGradientStyle(c, c, c, c, 0.1, 0.1, 0, 0).fillTriangle(cx + dx - 20, 175, cx + dx + 20, 175, cx + dx + 70, 560);
                f.fillGradientStyle(c, c, c, c, 0.1, 0, 0, 0).fillTriangle(cx + dx - 20, 175, cx + dx + 70, 560, cx + dx + 30, 560);
            });
            this.tweens.add({ targets: f, alpha: 0.65, yoyo: true, repeat: -1, duration: 3000 + i * 700, ease: 'Sine.easeInOut' });
        });
        // Pols que balla dins la llum
        this.add.particles(0, 0, 'espurna', {
            emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(260, 200, 600, 380) },
            speedX: { min: -6, max: 6 }, speedY: { min: -8, max: 4 }, lifespan: 4000,
            scale: { start: 0.12, end: 0 }, alpha: { start: 0.7, end: 0 }, tint: [0xfff0c0, 0xd8e0ff], frequency: 180, blendMode: 'ADD'
        }).setDepth(9000);

        // Prestatgeries del fons: quatre estants de llibres fins al sostre
        [['prestatge_a', 185, 0], ['prestatge_b', 550, 1], ['prestatge_c', 955, 2]].forEach(([k, x, n]) => {
            this.add.image(x, 206, k).setOrigin(0.5, 1).setScale(1 / RES).setDepth(-985);
        });
        // Prestatgeries laterals (de cantó), pegades a les parets
        this.add.image(60, 220, 'prestatge_lat_e').setOrigin(0).setScale(1 / RES).setDepth(-980);
        this.add.image(1000, 220, 'prestatge_lat_d').setOrigin(0).setScale(1 / RES).setDepth(-980);

        // Prestatgeries lliures de terra a sostre, en dues files, que formen passadissos: la biblioteca és enorme
        [['prestatge_l3', 185, 740, 5], ['prestatge_l4', 336, 740, 3],
         ['prestatge_l5', 768, 740, 4], ['prestatge_l6', 915, 740, 5]].forEach(([k, x, base, n]) => {
            const g = this.add.image(x, base, k).setOrigin(0.5, 1).setScale(1 / RES).setDepth(base);
            this.add.ellipse(x, base + 2, g.displayWidth + 24, 14, 0x000000, 0.28).setDepth(base - 1);
            this.colisio(x, base - 12, g.displayWidth, 24);
        });
        // Piles de llibres a terra
        [['pila_a', 140, 810], ['pila_b', 960, 810]].forEach(([k, x, y]) => {
            this.add.image(x, y, k).setOrigin(0.5, 1).setScale(1 / RES).setDepth(y);
            this.colisio(x, y - 6, 44, 16);
        });

        // Escala de mà recolzada a la prestatgeria de l'esquerra
        this.add.image(160, 238, 'escala_biblio').setOrigin(0.5, 1).setScale(1 / RES).setDepth(230);

        // Parets i col·lisions
        this.colisio(50, H / 2, 100, H);
        this.colisio(A - 50, H / 2, 100, H);
        this.colisio(A / 2, 110, A, 220);
        this.colisio(285, H - 10, 370, 20);
        this.colisio(815, H - 10, 370, 20);

        // Taula llarga de lectura amb llibres oberts, espelmes i un tinter, i una cadira a cada lloc
        this.add.image(550, 502, 'taula_lectura').setOrigin(0.5, 1).setScale(1 / RES).setDepth(479);
        this.colisio(550, 440, 420, 80);
        [[370, 405], [730, 405], [550, 405]].forEach(([x, y], i) => {
            const e = this.posar('espelma', x, y, { fonsY: 480 });
            this.tweens.add({ targets: e, alpha: 0.7, yoyo: true, repeat: -1, duration: 320 + i * 90 });
            this.add.circle(x, y - 40, 60, 0xffc060, 0.08).setDepth(480);
        });
        [[432, 548], [550, 553], [668, 548]].forEach(([x, y]) => {
            this.add.image(x, y, 'cadira_biblio').setOrigin(0.5, 1).setScale(1.15 / RES).setDepth(y);
            this.colisio(x, y - 8, 34, 14);
        });

        // El faristol amb la Crònica, a la dreta de la catifa
        this.add.image(842, 338, 'faristol_cronica').setOrigin(0.5, 1).setScale(1 / RES).setDepth(330);
        this.colisio(842, 318, 70, 20);

        // Globus terraqüi a l'esquerra
        this.add.image(246, 344, 'globus_biblio').setOrigin(0.5, 1).setScale(1 / RES).setDepth(340);
        this.colisio(246, 330, 50, 16);

        // Llum d'aranya penjada del sostre: dos anells de llautó, cadenes i dotze espelmes amb flama
        const ar = this.add.graphics().setDepth(90000 - 1);
        ar.lineStyle(2, 0x2a2a2a, 0.9).lineBetween(550, 0, 550, 44).lineBetween(550, 44, 484, 72).lineBetween(550, 44, 616, 72);
        [[170, 28, 0x6a4a14], [120, 20, 0xc8a040]].forEach(([wd, ht, c], i) => {
            ar.lineStyle(i ? 3 : 6, 0x1a1008, 1).strokeEllipse(550, 76 - i * 2, wd, ht);
            ar.lineStyle(i ? 1.6 : 4, c, 1).strokeEllipse(550, 76 - i * 2, wd, ht);
        });
        [-72, -48, -24, 0, 24, 48, 72].forEach(dx => {
            const dy = 76 - Math.sqrt(Math.max(0, 1 - (dx / 85) * (dx / 85))) * -14 * -1;
            ar.fillStyle(0xf2e6c8, 1).fillRect(550 + dx - 2.5, 58, 5, 14).lineStyle(1, 0x3a2a14, 1).strokeRect(550 + dx - 2.5, 58, 5, 14);
            ar.fillStyle(0xffc040, 0.9).fillEllipse(550 + dx, 55, 5, 8).fillStyle(0xffe890, 0.5).fillCircle(550 + dx, 55, 10);
        });

        // El Pare Alcuí, entre la taula i el faristol
        this.npc('pare_alcui', 760, 330, DIALEGS.pareAlcui, { flipX: true });

        this.add.rectangle(A / 2, H / 2, A, H, 0xffd38a, 0.06).setDepth(80000);
        this.sortida(510, H - 22, 80, 14, 'ZonaMonestirRebedor', 'biblioteca');
    }
}
