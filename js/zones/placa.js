/**
 * ZONA 1: LA PLAÇA DEL SANTUARI (punt d'inici)
 * Nord: Santuari · Nord-oest (a l'esquerra del Santuari): camí cap a les Runes, el Ping-pong i les Cel·les ·
 * Oest (més avall): camí cap a la Casa Gran i els porxos · Sud: La Bassadòria · Est: Monestir.
 * La façana del Santuari amaga una pedra que obre una sala del tresor.
 */
class ZonaPlaca extends ZonaBase {
    constructor() {
        super('ZonaPlaca', {
            nom: 'Plaça del Santuari',
            amplada: 1600,
            alcada: 1200,
            entrades: {
                inici:    { x: 1240, y: 820, dir: 'esquerra' },
                casaGran: { x: 50,   y: 565, dir: 'dreta' },
                creu:     { x: 840,  y: 1120, dir: 'amunt' },
                ruines:   { x: 390,  y: 150, dir: 'avall' },
                tresor:   { x: 1190, y: 490, dir: 'avall' },
                monestir: { x: 1550, y: 600, dir: 'esquerra' },
                esglesia: { x: 661,  y: 510, dir: 'avall' }
            }
        });
    }

    construir() {
        // --- Terra ---
        this.terra('herba', 0, 0, 1600, 1200, -1100);
        this.terra('cami', 0, 470, 380, 190);            // cap a la Casa Gran (oest)
        this.terra('cami', 760, 1000, 160, 200);         // cap a la Creu i la Bassadòria (sud)
        this.terra('cami', 330, 0, 130, 440);            // cap a les Runes (nord, a l'esquerra del Santuari)
        this.terra('llamborda', 360, 420, 1240, 590);    // la plaça: arriba fins a la vora est, davant del Monestir
        const vora = this.add.graphics().setDepth(-990);
        vora.lineStyle(4, 0x8a7658, 1).strokeRect(360, 420, 1240, 590);

        // --- Santuari i Runes (nord) ---
        // Façana gran (1100 d'ample) que acaba a la vora est del món: la porta, a x=661, fa ~165 d'alt (l'Ineu ~125)
        // i el cap de l'edifici surt per dalt de la pantalla.
        this.posar('esglesia', 1050, 463, { fonsY: 452, col: { w: 1100, h: 150, dy: -8 } });
        this.blocDarrere(1050, 1100, 300);
        this.sortida(612, 440, 98, 22, 'ZonaEsglesia', 'porta');
        this.posar('xiprer', 1285, 455, { col: { w: 24, h: 12 } });
        this.posar('xiprer', 1305, 490, { col: { w: 24, h: 12 } });

        // Pedra que no encaixa amb la resta de la façana del Santuari: amaga un passatge (cal una palanca)
        this.pedraSecreta = this.add.rectangle(1190, 405, 44, 34, 0x9a7a54).setStrokeStyle(3, 0x4a3420).setDepth(460);
        this.interactiu(1190, 480, 85, DIALEGS.pedraSecreta, {
            altura: 90,
            enTancar: () => {
                Estat.posaFlag('flauta_pedra');
                if (Estat.flag('tresorObert')) this.canviarZona('ZonaTresor', 'porta');
            }
        });
        this.llocFlauta('pedra', 1190, 480, 150, true);

        // --- Reixes del terra per on surt la boira ---
        [[600, 625], [1080, 650], [870, 975]].forEach(([x, y]) => {
            this.posar('reixa', x, y, { fonsY: -900 });
            this.interactiu(x, y - 10, 45, DIALEGS.reixa, { altura: 40 });
            this.boira(x, y - 14, 40, 10, 0.8);
        });

        // --- Personatges ---
        this.npc('pare_jordi', 1000, 770, DIALEGS.pareJordi);
        if (!Estat.flag('pastorVencut')) this.andreu = this.npc('germa_andreu', 1350, 505, DIALEGS.germaAndreu, { flipX: true });

        // --- Cartells ---
        this.cartell(300, 465, DIALEGS.cartellPlaca);

        // --- Arbres ---
        [[110, 250], [140, 980], [300, 1110], [640, 1130], [1040, 1110],
         [1420, 1110], [1540, 980], [170, 130]].forEach(([x, y]) => {
            this.posar('arbre', x, y, { col: { w: 34, h: 16 } });
        });

        // --- Sortides ---
        this.sortida(0, 470, 14, 190, 'ZonaCasaGran', 'placa');
        this.sortida(760, 1186, 160, 14, 'ZonaCreu', 'placa');
        this.sortida(330, 0, 130, 14, 'ZonaRuines', 'placa');
        this.sortida(1586, 530, 14, 150, 'ZonaMonestir', 'placa');

        // Visitants corromputs per la boira
        this.enemic('visitant', 520, 900);
        this.enemic('visitant', 880, 960);
        this.enemic('escolopendra', 1450, 800);

        // Vel lila: el santuari està tocat per la boira
        this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x3a1a55, 0.10).setScrollFactor(0).setDepth(90000);
    }

    // El Cant de les Pedres, tocat davant la pedra de la cantonada, la fa girar
    enMelodia(nom) {
        if (nom !== 'pedres') return false;
        if (Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, 1190, 480) > 260) return false;
        if (Estat.flag('tresorObert')) { this.flotant(1190, 360, 'El passatge ja és obert', '#d8c8ff'); return true; }
        Estat.posaFlag('tresorObert');
        this.cameras.main.shake(500, 0.004);
        Sfx.secret();
        this.tweens.add({ targets: this.pedraSecreta, alpha: 0.15, scaleY: 0.2, duration: 900 });
        this.ui().obrirDialeg(DIALEGS.pedraSecretaOberta, () => Estat.desar());
        return true;
    }

    enEntrar() {
        if (Estat.flag('tresorObert')) this.pedraSecreta.setAlpha(0.15).setScale(1, 0.2);
        if (Estat.flag('introVista')) return;
        Estat.posaFlag('introVista');
        this.time.delayedCall(700, () => {
            this.ui().obrirDialeg({
                pagines: [
                    { qui: '', text: 'Santuari del Miracle. Matí.' },
                    { qui: 'Ineu', text: 'Una altra nit de boira... i aquest fred que no marxa. El Pare Jordi em deu estar esperant a la plaça.' },
                    { qui: '', text: 'Mou l\'Ineu amb les fletxes o WASD (o el joystick tàctil).\nPrem ESPAI quan vegis un  !  per parlar o mirar.' }
                ]
            }, () => Estat.desar());
        });
    }
}
