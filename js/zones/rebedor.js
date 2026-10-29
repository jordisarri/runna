/**
 * EL REBEDOR DEL MONESTIR
 * Sala d'entrada del Monestir: lloses de pedra en damer, catifa fins al portal d'arc del fons (la porta de la Biblioteca), dos vitralls,
 * penons vermells, candelabres i bancs contra les parets. No hi ha res per llegir ni per tocar: és un lloc de pas.
 */

class ZonaMonestirRebedor extends ZonaBase {
    constructor() {
        super('ZonaMonestirRebedor', {
            nom: 'Rebedor del Monestir',
            amplada: 1100,
            alcada: 900,
            colorFons: '#100a06',
            pacifica: true,
            entrades: { porta: { x: 550, y: 800, dir: 'amunt' }, biblioteca: { x: 550, y: 300, dir: 'avall' }, inici: { x: 550, y: 560, dir: 'avall' } }      // «inici»: partides començades quan s'hi començava
        });
    }

    construir() {
        const A = 1100, H = 900, CX = 550;
        this.terra('lloses_rebedor', 100, 40, 900, 860, -1100);
        this.add.image(CX - 492, 0, 'paret_biblio').setOrigin(0).setScale(1 / RES).setDepth(-995);
        this.add.image(470, 230, 'catifa_biblio').setOrigin(0).setScale(1 / RES).setDepth(-1050);

        // Portal d'arc de pedra al fons: duu a la Biblioteca. Les fulles de fusta s'obren cap endins quan l'Ineu s'hi acosta.
        const marc = this.add.graphics().setDepth(-993);
        const forma = (r) => { marc.beginPath(); marc.moveTo(CX - r, 214); marc.lineTo(CX - r, 120); marc.arc(CX, 120, r, Math.PI, 0, false); marc.lineTo(CX + r, 214); marc.closePath(); };
        marc.fillStyle(0x120a04, 1); forma(86); marc.fillPath();
        marc.fillStyle(0xa39373, 1); forma(82); marc.fillPath();
        marc.fillStyle(0x7c6c52, 1); forma(66); marc.fillPath();                             // sotabisell
        marc.lineStyle(1.6, 0x3a2a14, 0.7);
        for (let k = 1; k < 9; k++) { const a = Math.PI + k * Math.PI / 9; marc.lineBetween(CX + Math.cos(a) * 62, 120 + Math.sin(a) * 62, CX + Math.cos(a) * 82, 120 + Math.sin(a) * 82); }
        for (let y = 140; y < 214; y += 24) { marc.lineBetween(CX - 82, y, CX - 66, y); marc.lineBetween(CX + 66, y, CX + 82, y); }
        marc.lineStyle(3, 0x120a04, 1); forma(82); marc.strokePath(); forma(66); marc.strokePath();
        marc.fillStyle(0xcdbd9c, 1).fillRect(CX - 96, 206, 192, 10).lineStyle(2, 0x120a04, 1).strokeRect(CX - 96, 206, 192, 10);    // llinda de pedra al terra
        this.portaAnimada({ x: CX, top: 60, bottom: 212, ample: 120, arc: true, fons: -991, color: 0x6a4328, panell: 0x7a5233, vora: 0x2a1608, ferro: true });
        this.sortida(CX - 60, 222, 120, 14, 'ZonaBiblioteca', 'porta');      // just al peu del portal (el buit real): s'hi entra en tocar-lo, no abans

        // Vitralls a banda i banda i els seus feixos de llum
        [250, 850].forEach((cx, i) => {
            this.add.image(cx, 194, 'vitrall_biblio').setOrigin(0.5, 1).setScale(1 / RES).setDepth(-990);
            const f = this.add.graphics().setDepth(-900).setBlendMode('ADD');
            [[0x2a5ab8, -30], [0xd8a030, 0], [0xb83a3a, 30]].forEach(([c, dx]) => {
                f.fillGradientStyle(c, c, c, c, 0.1, 0.1, 0, 0).fillTriangle(cx + dx - 20, 175, cx + dx + 20, 175, cx + dx + (i ? -70 : 70), 560);
                f.fillGradientStyle(c, c, c, c, 0.1, 0, 0, 0).fillTriangle(cx + dx - 20, 175, cx + dx + (i ? -70 : 70), 560, cx + dx + (i ? -30 : 30), 560);
            });
            this.tweens.add({ targets: f, alpha: 0.6, yoyo: true, repeat: -1, duration: 3200 + i * 800, ease: 'Sine.easeInOut' });
        });
        // Penons vermells a banda i banda del portal
        [380, 720].forEach(x => this.add.image(x, 14, 'banner_hall').setOrigin(0.5, 0).setScale(1 / RES).setDepth(-985));

        // Pols dins la llum
        this.add.particles(0, 0, 'espurna', {
            emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(160, 220, 780, 420) },
            speedX: { min: -6, max: 6 }, speedY: { min: -8, max: 4 }, lifespan: 4000,
            scale: { start: 0.12, end: 0 }, alpha: { start: 0.7, end: 0 }, tint: [0xfff0c0, 0xd8e0ff], frequency: 200, blendMode: 'ADD'
        }).setDepth(9000);

        // Candelabres amb flama viva a banda i banda de la catifa, i bancs de fusta contra les parets
        [[445, 340], [655, 340], [445, 640], [655, 640]].forEach(([x, y], i) => {
            const c = this.add.image(x, y, 'candelabre_hall').setOrigin(0.5, 1).setScale(1 / RES).setDepth(y);
            this.colisio(x, y - 8, 24, 14);
            const llum = this.add.circle(x, y - 78, 70, 0xffc060, 0.1).setDepth(y + 1);
            this.tweens.add({ targets: llum, alpha: 0.05, scale: 0.92, yoyo: true, repeat: -1, duration: 420 + i * 90 });
        });
        [[190, 430], [190, 660], [910, 430], [910, 660]].forEach(([x, y]) => {
            this.posar('banc', x, y, { col: { w: 120, h: 20 } });
        });

        // Parets i col·lisions (obertura de sortida a baix, al mig)
        this.colisio(50, H / 2, 100, H);
        this.colisio(A - 50, H / 2, 100, H);
        this.colisio(A / 2, 110, A, 220);
        this.colisio(285, H - 10, 370, 20);
        this.colisio(815, H - 10, 370, 20);

        this.add.rectangle(A / 2, H / 2, A, H, 0xffd38a, 0.06).setDepth(80000);
        this.sortida(510, H - 22, 80, 14, 'ZonaMonestir', 'rebedor');
    }
}
