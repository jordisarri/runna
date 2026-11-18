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
        // La plaça: arriba fins a la vora est, davant del Monestir. Perquè no sigui un rectangle dur clavat a l'herba i als camins: una orla de terra (de vora suau, com els camins) li fa de
        // transició, i el tros empedrat té les cantonades de l'oest arrodonides (amb una vora fina i fosca), de manera que els camins del nord i de l'oest hi entren de manera natural.
        this.terra('cami', 336, 396, 1280, 638);
        const llam = this.terra('llamborda', 360, 420, 1240, 590);
        const forma = { tl: 80, bl: 80, tr: 0, br: 0 };
        llam.setMask(this.make.graphics({ add: false }).fillStyle(0xffffff, 1).fillRoundedRect(360, 420, 1240, 590, forma).createGeometryMask());
        const vora = this.add.graphics().setDepth(-990);
        vora.lineStyle(3, 0x7a6648, 0.55).strokeRoundedRect(360, 420, 1240, 590, forma);
        // Llambordes soltes a l'orla de terra, escampades de manera irregular: desfan la línia recta entre l'empedrat i la terra
        let llavor = 91; const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
        for (let k = 0; k < 70; k++) {
            const costat = rnd(), t = rnd();
            let x, y;
            if (costat < 0.62) { x = 372 - rnd() * 34; y = 500 + t * 500; }                 // vora de l'oest
            else if (costat < 0.82) { x = 440 + t * 1100; y = 1004 + rnd() * 24; }          // vora del sud
            else { x = 372 - rnd() * 40 + t * 70; y = 424 - rnd() * 22; }                  // vora del nord, tocant el camí
            const g = rnd() < 0.5 ? 0x8f8a7e : 0x7a756a;
            vora.fillStyle(0x000000, 0.18).fillEllipse(x + 1, y + 3, 11 + rnd() * 9, 5 + rnd() * 3);
            vora.fillStyle(g, 1).fillEllipse(x, y, 10 + rnd() * 9, 6 + rnd() * 3).lineStyle(1.3, 0x3a3228, 0.7).strokeEllipse(x, y, 10 + rnd() * 9, 6 + rnd() * 3);
        }

        // --- Santuari i Runes (nord) ---
        // Façana gran (1100 d'ample) que acaba a la vora est del món: la porta, a x=683, fa ~165 d'alt (l'Ineu ~125)
        // i el cap de l'edifici surt per dalt de la pantalla.
        this.posar('esglesia', 1050, 463, { fonsY: 452 });
        this.colisio(569, 380, 138, 150);                                                                                       // paret esquerra de la façana
        this.colisio(1164, 380, 872, 150);                                                                                      // paret dreta de la façana
        this.colisio(683, 345, 90, 80);                                                                                         // dintell sobre la porta
        this.blocDarrere(1050, 1100, 300);
        this.sortida(644, 420, 78, 16, 'ZonaEsglesia', 'porta');
        this.portaAnimada({ x: 683, top: 291, bottom: 450, ample: 90, fons: 452, color: 0x2c524a, panell: 0x3a6a5e, vora: 0x0f1e1a, finestra: true, bloq: () => !this.iniciObert() });   // la porta verda del Santuari (tancada fins que s'obre el camí)
        this.posar('xiprer', 1285, 455, { col: { w: 24, h: 12 } });
        this.posar('xiprer', 1305, 490, { col: { w: 24, h: 12 } });

        // Pedra que no encaixa amb la resta de la façana del Santuari: amaga un passatge (cal una palanca)
        // Darrere la pedra, un forat fosc amb graons que només es veu quan la pedra s'aparta
        this.forat = this.add.graphics().setDepth(459).setAlpha(0);
        const PX = 1535;                                  // la pedra, a la cantonada de la dreta de tot de la façana
        this.forat.fillStyle(0x07040c, 1).fillRoundedRect(PX - 24, 384, 48, 42, 4).lineStyle(3, 0x2a1c10, 1).strokeRoundedRect(PX - 24, 384, 48, 42, 4);
        [0, 1, 2].forEach(k => this.forat.fillStyle(0x3a2c4a, 1 - k * 0.25).fillRect(PX - 20 + k * 3, 410 + k * 5 - 8, 40 - k * 6, 4));
        this.forat.fillStyle(0xa070ff, 0.18).fillEllipse(PX, 405, 60, 52);
        this.pedraSecreta = this.add.image(PX, 405, 'pedra_escolta').setScale(this.textures.get('pedra_escolta').customData && this.textures.get('pedra_escolta').customData.escala || 1 / RES).setDepth(460);
        this.interactiu(PX, 480, RADI_OBJECTE, DIALEGS.pedraSecreta, {
            altura: 90,
            actiu: () => Estat.flag('tresorObert'),
            enTancar: () => this.canviarZona('ZonaTresor', 'porta')
        });
        // Abans d'obrir-la, la pedra es pot mirar (té el seu «!»); després de mirar-la, ESPAI hi toca la flauta
        const puntPedra = this.interactiu(PX, 480, RADI_OBJECTE, DIALEGS.pedraEscolta, {
            altura: 90, actiu: () => !Estat.flag('tresorObert'),
            enTancar: () => Estat.posaFlag('flauta_pedra')
        });
        this.brilloImatge(this.pedraSecreta, { punt: puntPedra, actiu: () => !Estat.flag('tresorObert') });          // la pedra que no encaixa brilla fins que s'obre
        this.llocFlauta('pedra', PX, 480, 150, true, () => !Estat.flag('tresorObert'), false, ['pedres']);    // un cop oberta, ESPAI hi entra

        // --- Reixes del terra per on surt la boira ---
        [[600, 625], [870, 975]].forEach(([x, y]) => {          // (la de davant del Germà Aldreu s'ha tret)
            this.posar('reixa', x, y, { fonsY: -900 });
            this.boiraAmbient(x, y - 14, 40, 10, 0.8);
        });

        // --- Personatges ---
        this.npc('pare_jorda', 700, 770, DIALEGS.pareJorda, { zoomConversa: 1.5 });
        if (!Estat.flag('camiCirosaObert') && !Estat.flag('pastorVencut')) this.aldreu = this.npc('germa_aldreu', 1020, 585, DIALEGS.germaAldreu, { flipX: true });

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

    teEfecteMelodia(nom) {
        return nom === 'pedres' && !Estat.flag('tresorObert') && Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, 1535, 480) <= 260;
    }

    // El Cant de Vespres, tocat davant la pedra de la cantonada, la fa girar
    enMelodia(nom) {
        if (nom !== 'pedres') return false;
        if (Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, 1535, 480) > 260) return false;
        if (Estat.flag('tresorObert')) { this.ineuDiu('El passatge ja és obert.'); return true; }
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
