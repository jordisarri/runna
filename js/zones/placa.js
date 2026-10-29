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
            densitatBoira: 1.8,                // la boira del Miracle és més espessa aquí, a prop d'on neix
            amplada: 1600,
            alcada: 1200,
            entrades: {
                inici:    { x: 1240, y: 820, dir: 'esquerra' },
                casaGran: { x: 50,   y: 565, dir: 'dreta' },
                creu:     { x: 840,  y: 1120, dir: 'amunt' },
                ruines:   { x: 390,  y: 150, dir: 'avall' },
                tresor:   { x: 1535, y: 490, dir: 'avall' },
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
        this.portaAnimada({ x: 683, top: 291, bottom: 450, ample: 90, fons: 452, color: 0x2c524a, panell: 0x3a6a5e, vora: 0x0f1e1a, finestra: true });   // la porta verda del Santuari
        this.posar('xiprer', 1285, 455, { col: { w: 24, h: 12 } });
        this.posar('xiprer', 1305, 490, { col: { w: 24, h: 12 } });

        // Pedra que no encaixa amb la resta de la façana del Santuari: amaga un passatge (cal una palanca)
        // Darrere la pedra, un forat fosc amb graons que només es veu quan la pedra s'aparta
        this.forat = this.add.graphics().setDepth(459).setAlpha(0);
        const PX = 1535;                                  // la pedra, a la cantonada de la dreta de tot de la façana
        this.forat.fillStyle(0x07040c, 1).fillRoundedRect(PX - 24, 384, 48, 42, 4).lineStyle(3, 0x2a1c10, 1).strokeRoundedRect(PX - 24, 384, 48, 42, 4);
        [0, 1, 2].forEach(k => this.forat.fillStyle(0x3a2c4a, 1 - k * 0.25).fillRect(PX - 20 + k * 3, 410 + k * 5 - 8, 40 - k * 6, 4));
        this.forat.fillStyle(0xa070ff, 0.18).fillEllipse(PX, 405, 60, 52);
        this.pedraSecreta = this.add.rectangle(PX, 405, 44, 34, 0x9a7a54).setStrokeStyle(3, 0x4a3420).setDepth(460);
        this.interactiu(PX, 480, RADI_OBJECTE, DIALEGS.pedraSecreta, {
            altura: 90,
            actiu: () => Estat.flag('tresorObert'),
            enTancar: () => this.canviarZona('ZonaTresor', 'porta')
        });
        this.llocFlauta('pedra', PX, 480, 150);

        // --- Reixes del terra per on surt la boira ---
        [[600, 625], [1080, 650], [870, 975]].forEach(([x, y]) => {
            this.posar('reixa', x, y, { fonsY: -900 });
            this.boira(x, y - 14, 40, 10, 0.8);
        });

        // --- Personatges ---
        this.npc('pare_jordi', 700, 770, DIALEGS.pareJordi);
        if (!Estat.flag('camiCirosaObert') && !Estat.flag('pastorVencut')) this.andreu = this.npc('germa_andreu', 1020, 585, DIALEGS.germaAndreu, { flipX: true });

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
        this.sortida(330, 0, 130, 14, 'ZonaCellerFora', 'placa');
        this.sortida(1586, 530, 14, 150, 'ZonaMonestir', 'placa');

        // Visitants corromputs per la boira
        this.enemic('visitant', 700, 930);
        this.enemic('escolopendra', 1450, 800);
    }

    // El Cant de les Pedres, tocat davant la pedra de la cantonada, la fa girar
    enMelodia(nom) {
        if (nom !== 'pedres') return false;
        if (Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, 1535, 480) > 260) return false;
        if (Estat.flag('tresorObert')) { this.missatge('El passatge ja és obert.'); return true; }
        Estat.posaFlag('tresorObert');
        this.cameras.main.shake(500, 0.004);
        Sfx.secret();
        this.obrirPedra(true);
        this.ui().obrirDialeg(DIALEGS.pedraSecretaOberta, () => Estat.desar());
        return true;
    }

    // La pedra s'aixeca i s'enfila cap amunt, deixant a la vista el forat
    obrirPedra(animat) {
        if (!animat) { this.pedraSecreta.setAlpha(0).setY(370); this.forat.setAlpha(1); return; }
        const pols = this.add.particles(1535, 405, 'espurna', { x: { min: -26, max: 26 }, speedY: { min: -40, max: 10 }, speedX: { min: -30, max: 30 }, lifespan: 900, scale: { start: 0.5, end: 0 }, tint: [0xb8a080, 0x8a7a68], frequency: 40 }).setDepth(461);
        this.time.delayedCall(1300, () => pols.destroy());
        this.tweens.add({ targets: this.forat, alpha: 1, duration: 600, delay: 300 });
        this.tweens.add({ targets: this.pedraSecreta, y: 360, alpha: 0, duration: 1100, ease: 'Sine.easeInOut' });
    }

    enEntrar() {
        if (Estat.flag('tresorObert')) this.obrirPedra(false);
    }
}
