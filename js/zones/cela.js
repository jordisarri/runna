/**
 * EL TALLER DEL GARF (la cel·la de Sant Antoni, interior)
 * La casa del Garf, l'inventor: un taller-laboratori de llautó i coure. Caldera amb el forn encès, canonades amb manòmetres que
 * tremolen, engranatges que giren a la paret, plànols d'un telescopi, banc de treball amb un ocell mecànic a mig fer,
 * alambins que bombollegen, un telescopi i el seu llit petit. Només s'hi poden mirar els plànols (els gràfics, a js/dibuixos_taller.js).
 */

class ZonaCelaStAntoni extends ZonaBase {
    constructor() {
        super('ZonaCelaStAntoni', {
            nom: 'Taller del Garf',
            amplada: 800,
            alcada: 640,
            colorFons: '#0e0806',
            pacifica: true,
            entrades: { porta: { x: 400, y: 560, dir: 'amunt' } }
        });
    }

    construir() {
        const A = 800, H = 640, E = 1 / RES;
        this.terra('taulons', 20, 40, 760, 600, -1100).setTint(0x9a7a58);
        this.add.image(20, 0, 'paret_taller').setOrigin(0).setScale(E).setDepth(-995);
        this.add.image(400, 450, 'catifa_taller').setOrigin(0.5).setScale(E).setDepth(-1040);
        // Taques d'oli i cargols perduts pel terra
        const t = this.add.graphics().setDepth(-1039);
        [[250, 470, 26, 10], [560, 420, 18, 8], [330, 560, 14, 6], [610, 520, 22, 9]].forEach(([x, y, rx, ry]) => t.fillStyle(0x1a1006, 0.35).fillEllipse(x, y, rx * 2, ry * 2));
        [[290, 430], [520, 480], [470, 570], [230, 520], [640, 455]].forEach(([x, y]) => t.fillStyle(0x9a9aa4, 1).fillRect(x, y, 4, 3));

        // Engranatges de la paret, que giren encaixats (el petit, més de pressa i al revés)
        const eg = this.add.image(265, 108, 'engr_gran').setScale(E).setDepth(-980);
        const ep = this.add.image(318, 160, 'engr_petit').setScale(E).setDepth(-979);
        this.tweens.add({ targets: eg, angle: 360, duration: 14000, repeat: -1 });
        this.tweens.add({ targets: ep, angle: -360, duration: 14000 * 9 / 14, repeat: -1 });

        // Manòmetres de la paret: les agulles tremolen
        [[670, 120, 20], [732, 58, 16]].forEach(([x, y, r], i) => {
            const ag = this.add.graphics({ x, y }).setDepth(-978);
            ag.lineStyle(2.5, 0x1a1a1e, 1).lineBetween(0, 0, r * 0.62, 0).fillStyle(0xb02a1a, 1).fillCircle(0, 0, 3);
            ag.angle = -60 + i * 40;
            this.tweens.add({ targets: ag, angle: ag.angle + 25, yoyo: true, repeat: -1, duration: 700 + i * 300, ease: 'Sine.easeInOut' });
            this.tweens.add({ targets: ag, x: x + 0.6, yoyo: true, repeat: -1, duration: 60 });
        });

        // La caldera, amb el forn encès: resplendor que batega, flama i espurnes
        this.add.image(400, 252, 'caldera_taller').setOrigin(0.5, 1).setScale(E).setDepth(252);
        this.colisio(400, 236, 150, 34);
        const forn = this.add.circle(400, 200, 130, 0xff8a30, 0.14).setBlendMode('ADD').setDepth(253);
        this.tweens.add({ targets: forn, alpha: 0.26, scale: 1.08, yoyo: true, repeat: -1, duration: 380 });
        const brasa = this.add.ellipse(400, 196, 56, 40, 0xffd070, 0.35).setBlendMode('ADD').setDepth(254);
        this.tweens.add({ targets: brasa, alpha: 0.6, scaleY: 1.15, yoyo: true, repeat: -1, duration: 170 });
        this.add.particles(400, 176, 'espurna', { x: { min: -22, max: 22 }, speedY: { min: -50, max: -20 }, speedX: { min: -12, max: 12 }, lifespan: 900,
            scale: { start: 0.12, end: 0 }, alpha: { start: 0.9, end: 0 }, tint: [0xffa040, 0xffe080], frequency: 180, blendMode: 'ADD' }).setDepth(255);
        // Vapor: la vàlvula de la caldera i un tub de la paret treuen bufades de tant en tant
        const vapor = (x, y, angle) => this.add.particles(x, y, 'boira', { speed: { min: 20, max: 60 }, angle: { min: angle - 15, max: angle + 15 }, lifespan: 1600,
            scale: { start: 0.3, end: 1.2 }, alpha: { start: 0.5, end: 0 }, tint: 0xf0f0f0, emitting: false }).setDepth(9000);
        const v1 = vapor(450, 72, 270), v2 = vapor(716, 150, 200);
        this.time.addEvent({ delay: 2600, loop: true, callback: () => { v1.explode(10); this.time.delayedCall(900, () => v2.explode(7)); } });

        // Bombetes penjades de la biga, amb llum càlida que parpelleja
        [[150, 62], [470, 54]].forEach(([x, y], i) => {
            const g = this.add.graphics().setDepth(9001);
            g.lineStyle(2, 0x1a1a1e, 1).lineBetween(x, 0, x, y - 10).fillStyle(0x6a4a1a, 1).fillRect(x - 5, y - 12, 10, 6);
            g.fillStyle(0xfff0b0, 1).fillCircle(x, y, 7).lineStyle(1.5, 0x8a6a2a, 1).strokeCircle(x, y, 7);
            const ll = this.add.circle(x, y, 90, 0xffd890, 0.12).setBlendMode('ADD').setDepth(9002);
            this.tweens.add({ targets: ll, alpha: 0.07, yoyo: true, repeat: -1, duration: 90 + i * 70, hold: 1600 + i * 900 });
        });

        // El banc de treball, amb l'ull de l'ocell mecànic que brilla
        this.add.image(188, 362, 'banc_taller').setOrigin(0.5, 1).setScale(E).setDepth(362);
        this.colisio(188, 344, 232, 36);
        const ull = this.add.circle(199, 231, 5, 0x60f0ff, 0.9).setBlendMode('ADD').setDepth(363);
        this.tweens.add({ targets: ull, alpha: 0.25, yoyo: true, repeat: -1, duration: 900, ease: 'Sine.easeInOut' });

        // El laboratori: bombolles al matràs verd i al gerro lila
        this.add.image(612, 362, 'lab_taller').setOrigin(0.5, 1).setScale(E).setDepth(362);
        this.colisio(612, 344, 212, 36);
        [[543, 216, 0xa0ff80], [662, 236, 0xe0b0ff]].forEach(([x, y, c]) => this.add.particles(x, y, 'espurna', { x: { min: -6, max: 6 },
            speedY: { min: -26, max: -10 }, lifespan: 900, scale: { start: 0.1, end: 0.02 }, alpha: { start: 0.9, end: 0 }, tint: c, frequency: 220 }).setDepth(363));

        // El llit del Garf, el telescopi i els trastos
        this.add.image(140, 582, 'llit_garf').setOrigin(0.5, 1).setScale(E).setDepth(582);
        this.colisio(140, 545, 150, 70);
        this.add.image(662, 590, 'telescopi_taller').setOrigin(0.5, 1).setScale(E).setDepth(590);
        this.colisio(662, 578, 70, 18);
        this.add.image(540, 602, 'trastos_taller').setOrigin(0.5, 1).setScale(E).setDepth(602);
        this.colisio(540, 588, 140, 26);

        // Els plànols de la paret: l'única cosa que l'Ineu es mira
        // Es pot mirar des de davant de la taula del laboratori o des de sota mateix del plànol (entre la paret i la taula);
        // l'indicador surt sempre just a sobre dels plànols
        const planols = () => ({ pagines: [{ qui: 'Ineu', text: "(Semblen els plànols d'una mena d'artefacte per mirar les estrelles.)" }] });
        this.interactiu(582, 380, RADI_OBJECTE, planols, { altura: 356 });
        this.interactiu(582, 236, RADI_OBJECTE, planols, { altura: 212 });

        // Parets i col·lisions (obertura de sortida a baix, al mig)
        this.colisio(20, H / 2, 40, H);
        this.colisio(A - 20, H / 2, 40, H);
        this.colisio(A / 2, 100, A, 200);
        this.colisio(175, H - 10, 350, 20);
        this.colisio(625, H - 10, 350, 20);

        this.add.rectangle(A / 2, H / 2, A, H, 0xffb070, 0.06).setDepth(80000);
        this.sortida(360, H - 22, 80, 14, 'ZonaSantAntoni', 'cela');
    }
}
