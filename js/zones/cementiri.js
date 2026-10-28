/**
 * EL CEMENTIRI (darrere el Santuari i el Monestir, on s'ajunten).
 * S'hi arriba des de les Runes (est) o des del Monestir (nord). Hi reposen els monjos del Santuari
 * i, en una tomba esquerdada, els monjos primers.
 * De la fesomia esquerdada surt la boira i els animalets del cementiri.
 * Els gràfics (làpides, tombes, àngel, fanalets) són de dibuixos.js.
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
        const tancada = Estat.flag('tombaSegellada');
        this.terra('herba', 0, 0, 1600, 1100, -1100).setTint(0xa0b898);
        this.terra('cami', 0, 520, 1160, 130);           // des de les Runes
        this.terra('cami', 1010, 520, 150, 580);         // cap al Monestir (sud)
        this.terra('pedra', 560, 270, 280, 250);         // replà davant la tomba esquerdada
        this.terra('cami', 1160, 545, 110, 80);          // ramal cap a la tomba de l'àngel
        this.terra('pedra', 1240, 400, 260, 230);        // replà de l'àngel

        // La tomba dels monjos primers: un sarcòfag sobre graons. Mentre és oberta, en surt boira lila de l'esquerda
        this.tomba = this.posar(tancada ? 'tomba_tancada' : 'tomba_esquerdada', 700, 470, { col: { w: 210, h: 60 } });
        // Amb Runna a la mà, ESPAI ja no llegeix la làpida: colpeja (i segella) la tomba
        this.interactiu(700, 480, 130, DIALEGS.tombaMonjos, { altura: 150, actiu: () => !Estat.te('runna') || Estat.flag('tombaSegellada') });
        if (!tancada) {
            this.boiraTomba = this.boira(712, 360, 90, 40, 1.6);
            this.llumTomba = this.add.circle(712, 380, 120, 0xa070ff, 0.10).setDepth(390);
        }
        this.fanalet(585, 500); this.fanalet(818, 500);

        // La tomba de l'àngel, on el Germà Francesc porta flors: l'àngel que plora al cap i un gerro als peus
        this.tombaAngel = this.posar(Estat.flag('florsCreu') ? 'tomba_angel_flors' : 'tomba_angel', 1370, 600, { col: { w: 124, h: 44 } });
        this.interactiu(1370, 615, 110, DIALEGS.creuCementiri, { altura: 230, enTancar: () => this.posarRam() });
        this.fanalet(1285, 600); this.fanalet(1455, 600);
        this.arbres([[1250, 470], [1495, 470]], 'xiprer');            // dos xiprers emmarquen l'àngel

        // Tombes en quatre quarters, a banda i banda dels camins. Cada fila és simètrica i centrada en el seu quarter,
        // i les files alternen làpides i tombes amb vorada perquè el conjunt respiri
        const AMPLADA = { lapida: 56, lapida_b: 56, lapida_creu: 54, lapida_ferro: 46, tomba_grava: 110, tomba_flors: 110, tomba_herba: 110, tomba_creu: 140 };
        const L = 'lapida', B = 'lapida_b', C = 'lapida_creu', F = 'lapida_ferro', G = 'tomba_grava', FL = 'tomba_flors', H = 'tomba_herba', CR = 'tomba_creu';
        const files = [
            [100, 530, 240, [L, F, H, F, L]],  [100, 530, 410, [G, C, G]],            // quarter de dalt a l'esquerra
            [870, 1210, 240, [B, CR, B]],      [870, 1210, 410, [C, L, F, L, C]],     // quarter de dalt al mig
            [100, 980, 800, [C, G, C, H, C, G, C]],                                   // quarter de baix a l'esquerra
            [100, 980, 970, [L, F, B, F, L, F, B, F, L]],
            [1210, 1520, 820, [F, FL, F]],     [1210, 1520, 990, [B, C, L, C, B]]     // quarter de baix a la dreta
        ];
        let n = 0;
        files.forEach(([x0, x1, y, fila]) => {
            const total = fila.reduce((t, k) => t + AMPLADA[k], 0);
            const pas = Math.min(40, (x1 - x0 - total) / (fila.length - 1));
            let x = (x0 + x1) / 2 - (total + pas * (fila.length - 1)) / 2;
            fila.forEach(key => {
                const w = AMPLADA[key], cx = x + w / 2, tomba = key.startsWith('tomba');
                this.posar(key, cx, y, { col: tomba ? { w: w - 14, h: 40 } : { w: w - 16, h: 14 } });
                if (n % 3 === 1) this.interactiu(cx, y + 6, tomba ? 75 : 55, DIALEGS.lapida(n), { altura: tomba ? 100 : 90 });
                n++;
                x += w + pas;
            });
        });
        this.cartell(940, 512, () => ({ pagines: [{ qui: 'Cartell', text: '← Les Runes\n↓ El Monestir' }] }));

        // Xiprers: la tanca de dalt, els límits i avingudes regulars al llarg dels camins
        this.muralla(0, 40, 1600, 40, 100, 'xiprer');
        this.arbres([[60, 330], [60, 760], [1550, 300], [1555, 660], [1560, 900], [560, 230], [840, 230]], 'xiprer');
        [150, 320, 490].forEach(x => this.arbres([[x, 508]], 'xiprer'));             // avinguda des de les Runes
        [180, 310, 440, 640, 770, 900].forEach(x => this.arbres([[x, 702]], 'xiprer'));
        [740, 900, 1060].forEach(y => this.arbres([[992, y], [1178, y]], 'xiprer'));  // avinguda cap al Monestir
        this.arbres([[200, 1070], [440, 1070], [640, 1070], [860, 1070], [1300, 1070], [1460, 1070]], 'xiprer');

        // Boira baixa entre les tombes i cuques de llum
        [[320, 840], [640, 300], [1300, 900], [480, 260]].forEach(([x, y]) => this.boira(x, y, 260, 50, 0.35));
        this.cuquesLlum(14);

        // Animalets que surten de la terra esquerdada
        if (!tancada) {
            [[420, 450], [900, 450], [1200, 470], [300, 870]].forEach(([x, y]) => this.enemic('escolopendra', x, y));
            this.enemic('visitant', 1100, 800);
        }

        this.sortida(0, 520, 14, 130, 'ZonaRuines', 'cementiri');
        this.sortida(1010, 1086, 150, 14, 'ZonaMonestir', 'cementiri');
        this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x201040, 0.14).setScrollFactor(0).setDepth(90000);
    }

    // Fanalet de tomba amb la flama que tremola
    fanalet(x, y) {
        this.posar('fanalet', x, y);
        const llum = this.add.circle(x, y - 22, 46, 0xffc070, 0.13).setDepth(y + 1).setBlendMode(Phaser.BlendModes.ADD);
        this.tweens.add({ targets: llum, alpha: 0.2, scale: 1.1, yoyo: true, repeat: -1, duration: 300 + Math.random() * 250, ease: 'Sine.easeInOut' });
    }

    // Un cop de Runna a la tomba esquerdada: la llum que va tancar la porta tanca també l'esquerda i la boira s'esvaeix
    alAtacar(jo, d) {
        if (!Estat.te('runna') || Estat.flag('tombaSegellada')) return;
        const px = jo.x + d.x * 60, py = jo.y + d.y * 60;
        if (Math.abs(px - 700) > 140 || Math.abs(py - 440) > 110) return;
        Estat.posaFlag('tombaSegellada');
        Sfx.secret();
        this.cameras.main.shake(600, 0.004);
        const esq = this.add.graphics().setDepth(this.tomba.depth + 1).setBlendMode('ADD');
        esq.lineStyle(6, 0xcfe0ff, 1).beginPath(); esq.moveTo(650, 420); esq.lineTo(690, 432); esq.lineTo(705, 418); esq.lineTo(745, 430); esq.strokePath();
        esq.setAlpha(0);
        this.tweens.add({ targets: esq, alpha: 1, duration: 300, yoyo: true, hold: 500, onComplete: () => esq.destroy() });
        this.llum(700, 410, 0xd8e8ff);
        this.time.delayedCall(700, () => {
            const nova = this.add.image(this.tomba.x, this.tomba.y, 'tomba_tancada').setOrigin(0.5, 1).setScale(this.tomba.scaleX).setDepth(this.tomba.depth + 1).setAlpha(0);
            this.tweens.add({ targets: nova, alpha: 1, duration: 900, onComplete: () => { this.tomba.setTexture('tomba_tancada'); nova.destroy(); } });
            if (this.boiraTomba) { this.boiraTomba.stop(); this.time.delayedCall(1800, () => this.boiraTomba && this.boiraTomba.destroy()); }
            if (this.llumTomba) this.tweens.add({ targets: this.llumTomba, alpha: 0, duration: 1200 });
        });
        Estat.posaObjectiu(Estat.te('clau_ferro') ? "Troba la porta de ferro de la Sala de les Gírgoles, a l'est del Pati del Celler."
                                                 : "La tomba descansa. A la Casa Gran, sota l'escalinata, hi ha la Clau de ferro dels monjos.");
        Estat.desar();
    }

    // Quan el ram del Germà Francesc ja és als peus de l'àngel, la tomba canvia de gràfic amb un fos
    posarRam() {
        if (!Estat.flag('florsCreu') || this.tombaAngel.texture.key === 'tomba_angel_flors') return;
        const nova = this.add.image(this.tombaAngel.x, this.tombaAngel.y, 'tomba_angel_flors').setOrigin(0.5, 1)
            .setScale(this.tombaAngel.scaleX).setDepth(this.tombaAngel.depth + 1).setAlpha(0);
        this.tweens.add({ targets: nova, alpha: 1, duration: 900, onComplete: () => { this.tombaAngel.setTexture('tomba_angel_flors'); nova.destroy(); } });
    }

    // Puntets de llum que suren i s'encenen i s'apaguen entre les tombes
    cuquesLlum(n) {
        for (let i = 0; i < n; i++) {
            const x = 120 + Math.random() * 1380, y = 160 + Math.random() * 880;
            const c = this.add.circle(x, y, 2.2, 0xfff2a0, 0).setDepth(y + 60).setBlendMode(Phaser.BlendModes.ADD);
            this.tweens.add({ targets: c, x: x + (Math.random() - 0.5) * 120, y: y - 20 - Math.random() * 50, yoyo: true, repeat: -1, duration: 3000 + Math.random() * 3000, ease: 'Sine.easeInOut' });
            this.tweens.add({ targets: c, alpha: 0.9, yoyo: true, repeat: -1, duration: 900 + Math.random() * 900, delay: Math.random() * 2000, hold: 400 });
        }
    }
}
