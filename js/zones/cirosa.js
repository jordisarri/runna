/**
 * LA CIROSA (extrem nord-est)
 * Camí llarg que puja des de les cel·les + la masia amb la pastura on espera el Pastor de Boira.
 */

// ---------------- CAMÍ DE LA CIROSA ----------------
class ZonaCamiCirosa extends ZonaBase {
    constructor() {
        super('ZonaCamiCirosa', {
            nom: 'Camí de la Cirosa',
            amplada: 1400,
            alcada: 2200,
            colorFons: '#1f3a1a',
            entrades: {
                tiller: { x: 700, y: 2130, dir: 'amunt' },
                cirosa: { x: 580, y: 80,   dir: 'avall' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1400, 2200, -1100);
        // Camí en zig-zag (rectangles de terra; l'Ineu puja de baix a dalt)
        const tram = [
            [620, 1750, 160, 450],   // des de les cel·les
            [300, 1750, 480, 150],
            [300, 1250, 160, 650],
            [300, 1250, 700, 150],
            [860, 700, 160, 700],
            [500, 700, 520, 150],
            [500, 0, 160, 850]       // cap a la Cirosa
        ];
        tram.forEach(([x, y, w, h]) => this.terra('cami', x, y, w, h));

        // Bosc a banda i banda: arbres en graella, deixant lliure el camí
        let llavor = 23;
        const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
        for (let y = 60; y < 2200; y += 150) {
            for (let x = 60; x < 1400; x += 170) {
                const px = x + (rnd() - 0.5) * 80, py = y + (rnd() - 0.5) * 70;
                if (tram.some(([tx, ty, tw, th]) => px > tx - 90 && px < tx + tw + 90 && py > ty - 70 && py < ty + th + 90)) continue;
                this.posar('arbre', px, py, { col: { w: 34, h: 16 } });
            }
        }
        // Roques al marge del camí (de moment només decoració)
        [[560, 1980], [880, 2050], [270, 1600], [480, 1330], [930, 1100], [1060, 800], [440, 760], [700, 300]].forEach(([x, y]) => this.posar('roca', x, y, { col: { w: 70, h: 26 } }));

        this.cartell(780, 2090, () => ({ pagines: [{ qui: '', text: 'La Cirosa, a dalt. Camí llarg: porta aigua i no et fiïs de les ovelles que no bessen.' }] }));

        // Ramat de boira i animalets
        [[420, 1830], [750, 1550], [380, 1330], [930, 1000], [700, 770], [580, 400]].forEach(([x, y]) => this.enemic('ovella', x, y));
        [[700, 2000], [330, 1500], [900, 1200], [560, 560]].forEach(([x, y]) => this.enemic('escolopendra', x, y));

        this.boira(700, 1400, 500, 120, 0.8);
        this.sortida(620, 2186, 160, 14, 'ZonaTiller', 'cirosa');
        this.sortida(500, 0, 160, 14, 'ZonaCirosa', 'cami');
        this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x3a1a55, 0.09).setScrollFactor(0).setDepth(90000);
    }
}

// ---------------- LA CIROSA (masia i pastura) ----------------
class ZonaCirosa extends ZonaBase {
    constructor() {
        super('ZonaCirosa', {
            nom: 'La Cirosa',
            amplada: 1800,
            alcada: 1200,
            entrades: { cami: { x: 580, y: 1120, dir: 'amunt' } }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1800, 1200, -1100);
        this.terra('cami', 500, 620, 160, 580);           // des del camí llarg
        this.terra('cami', 200, 620, 800, 140);           // davant la masia i cap a la pastura

        // La masia
        this.posar('masia', 380, 640, { col: { w: 520, h: 110 } }).setTint(0xc8b8a0);   // mas vell i descurat
        this.interactiu(380, 660, 90, DIALEGS.enConstruccio('Interior del Mas de la Cirosa'), { altura: 150 });

        // Els pastors desterrats (sense nom), al voltant d'un foc a l'esquerra del camí
        this.foc = this.posar('foc', 280, 940, { col: { w: 40, h: 16 } });
        this.tweens.add({ targets: this.foc, scaleY: this.foc.scaleY * 1.08, yoyo: true, repeat: -1, duration: 260 });
        this.resplendor = this.add.circle(280, 900, 130, 0xff9a30, 0.12).setDepth(940);
        this.tweens.add({ targets: this.resplendor, alpha: 0.2, yoyo: true, repeat: -1, duration: 400 });
        this.llocFlauta('foc', 280, 935, 170);   // música vora el foc dels pastors
        this.npc('pastor_a', 200, 960, DIALEGS.pastorA, { flipX: false });
        this.npc('pastor_b', 370, 975, DIALEGS.pastorB, { flipX: true });
        this.npc('pastor_vell', 285, 870, DIALEGS.pastorVell);

        // Corral/pastura a la dreta: tanca amb una porta oberta davant el camí
        const g = this.add.graphics().setDepth(-900);
        g.fillStyle(0x6b4a2a, 1);
        const posts = [];
        for (let y = 180; y <= 1000; y += 40) if (y < 600 || y > 780) posts.push(y);
        posts.forEach(y => g.fillRect(1020, y, 10, 30));
        g.fillRect(1018, 180, 14, 420).fillRect(1018, 780, 14, 220);
        this.colisio(1025, 390, 14, 420);
        this.colisio(1025, 890, 14, 220);
        this.terra('herba', 1032, 160, 740, 860, -1050).setTint(0xcdeaa0);

        // Ovelles del ramat (decoratives): lila i adormides mentre el Pastor hi és
        const lila = !Estat.flag('pastorVencut');
        [[1200, 330], [1500, 420], [1650, 700], [1350, 880], [1580, 930], [1250, 560], [1700, 300], [1100, 840]].forEach(([x, y]) => {
            const o = this.posar('ovella', x, y, { fonsY: y });
            if (lila) o.setTint(0xcdb8e8);
            else this.tweens.add({ targets: o, y: y - 6, yoyo: true, repeat: -1, duration: 700 + Math.random() * 500, delay: Math.random() * 600 });
        });

        // El Germà Andreu, de Pastor de Boira, al mig de la pastura
        if (lila) {
            // (sense col·lisió: el boss hi apareixerà al mateix lloc)
            this.andreuNpc = this.posar('pastor_boira', 1400, 640);
            this.andreuOmbra = this.add.image(1400, 640, 'ombra').setScale(0.5).setDepth(-500);
            this.interactiu(1400, 630, 95, DIALEGS.andreuPastor, { altura: this.andreuNpc.displayHeight + 6, actiu: () => !this.bossIniciat });
        } else {
            this.posar('cartell', 1030, 710, { col: { w: 20, h: 10 } });
        }

        this.cartell(700, 700, () => ({ pagines: [{ qui: '', text: 'La Cirosa. Algú ha clavat un cartell amb lletra tremolosa:\n«Aquí només volem viure en pau.»' }] }));
        this.arbres([[100, 150], [260, 90], [500, 120], [800, 100], [900, 280], [140, 420], [100, 980], [330, 1090], [820, 1100],
                     [900, 950], [940, 480], [1760, 120], [1760, 1100], [1100, 1120], [1400, 1130]]);
        this.muralla(0, 1186, 460, 1186, 90);
        this.muralla(700, 1186, 1020, 1186, 90);

        this.sortida(500, 1186, 160, 14, 'ZonaCamiCirosa', 'cirosa');
        this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x3a1a55, lila ? 0.12 : 0).setScrollFactor(0).setDepth(90000);
    }

    // Els pastors escolten música vora el foc: es convencen d'anar al sopar del Til·ler
    enMelodia(nom) {
        if (Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, 280, 940) > 380) return false;
        if (!Estat.flag('soparObert')) {
            this.flotant(280, 800, 'Els pastors t\'escolten en silenci', '#ffd9a0');
            return true;
        }
        if (Estat.flag('pastorsConvencuts')) { this.flotant(280, 800, 'Els pastors somriuen', '#ffd9a0'); return true; }
        this.ui().obrirDialeg(DIALEGS.pastorsConvencuts(Estat), () => Estat.desar());
        return true;
    }

    // El Pastor de Boira es posa en marxa després del diàleg
    iniciarBoss() {
        if (this.bossIniciat) return;
        this.bossIniciat = true;
        this.andreuNpc.setVisible(false); this.andreuOmbra.setVisible(false);
        const e = this.enemic('pastor', 1400, 570);
        if (!e) { this.bossIniciat = false; this.andreuNpc.setVisible(true); this.andreuOmbra.setVisible(true); return; }
        this.cameras.main.shake(300, 0.005);
        this.flotant(1400, 520, 'Be-e-e-e!', '#e0a0ff');
        this.ui().notifica('Pastor de Boira: allunya\'t de les envestides i colpeja quan quedi cansat');
    }
}
