/**
 * LA CASA GRAN (masmorra): l'Escalinata i una petita cripta.
 *   Entrada: només la secreta, des d'El Celler (el ping-pong; darrere la roda de carruatge, amb Runna): passadís amb escolopendres
 *            i un esbarzer negre, sala del tresor (la cambra secreta dels monjos) i una porta cap a l'Escalinata. La reixa del porxo
 *            (plaça) és tancada des de fora; només es pot obrir per dins, com a drecera de tornada.
 *   Escalinata: l'Home del Raïm. Amb la Palanca (és a la caseta d'en Jordi, a la Caseta) es gira el cap cap a llevant:
 *               l'estàtua cobra vida (BOSS). Derrotada, s'obre la trapa de la cripta.
 *   Cripta: la Clau de ferro (i un paper: la llum de Runna segella la tomba esquerdada del Cementiri),
 *           que obre la porta de ferro de la Sala de les Gírgoles (a sota de la Taverna, no pas des d'aquí).
 */

// ---------------- DIÀLEGS ----------------
const NOMS_DIR = ["cap al nord (cap a l'escala)", "cap a llevant (E)", "cap a migdia (S)", "cap a ponent (O)"];

Object.assign(DIALEGS, {
    homeRaimInt: E => {
        if (E.flag('raimDerrotat')) {
            return { pagines: [] };
        }
        return {
            pagines: [
                { qui: 'Ineu', text: "Té el cap girat cap enrere, com si vigilés una cosa de sota l'escala. A la base hi ha un forat quadrat, com per encaixar-hi una palanca... En Jordi, a la Caseta, sempre porta eines." }
            ]
        };
    },

    rosaVents: E => ({
        pagines: [
            { qui: 'Ineu', text: "«On neix el sol, el raïm madura.» A la E hi ha tallats un sol que neix i un raïm. L'Home del Raïm hauria de mirar cap a llevant: la fletxa de pedra de la seva base em dirà cap on mira ara." }
        ]
    }),

    raimDesperta: {
        pagines: [
            { qui: 'Home del Raïm', text: "NINGÚ... NO... BAIXA... A LA... PORTA." },
            { qui: 'Ineu', text: "Un guardià! És ell, el que vigila la cripta. Haig d'aturar-lo!" }
        ]
    },

    raimSenseArma: {
        pagines: [
            { qui: 'Ineu', text: "Si això desperta alguna cosa, no tinc res amb què defensar-me. Millor tornar amb el bastó." }
        ]
    },

    raimDerrotat: {
        pagines: [
            { qui: 'Home del Raïm', text: "Ja... us... podeu... ... endur-les." },
        ]
    },

    trapaCripta: E => ({
        pagines: []
    }),

    cofreCripta: E => E.flag('relTretes') ? {
        pagines: []
    } : {
        pagines: [
            { avis: "Has obtingut la CLAU DE FERRO." }
        ],
        enAcabar: () => {
            E.dona('clau_ferro'); E.posaFlag('relTretes'); E.posaFlag('clauFerro');
            E.posaObjectiu(E.flag('tombaSegellada') ? "Troba la porta de ferro de la Sala de les Gírgoles, a l'est del Pati del Celler."
                                                   : "Porta la Clau de ferro al Pare Alcuí, a la Biblioteca: la Crònica deu dir què fer amb la tomba dels monjos.");
        }
    },

    // El Jordi de la Caseta (a l'oest del Til·ler): diu on té la palanca, dins la caseta aixecada del jardí
    jordiCaseta: E => {
        if (E.te('palanca') || E.flag('palanca')) {
            return { pagines: [{ qui: 'Jordi', text: "Fes-ne bon ús, monjo! I vigila, que les coses de pedra no sempre s'estan quietes." }] };
        }
        if (E.flag('jordiPalanca')) {
            return { pagines: [{ qui: 'Jordi', text: "La caseta és aquí al costat: puja per l'escala. Al cofre de les joguines, la palanca és a sota. Que no se't cansi el braç!" }] };
        }
        return {
            pagines: [
                { qui: 'Jordi', text: "Ei, monjo! Sóc en Jordi, el de la Caseta. Conec cada drecera del Miracle, i les eines, encara millor." },
                { qui: 'Ineu', text: "Jordi, em diuen que en saps, d'eines. De vegades cal moure una cosa pesada i no hi ha manera." },
                { qui: 'Jordi', text: "Una palanca! En tinc una de ferro, de les bones. Per moure roques, per obrir reixes... i, si cal, per girar el cap a una estàtua tossuda." },
                { qui: 'Jordi', text: "Però la vaig amagar dalt de la caseta dels nens, la que està aixecada sobre pals, al cofre de les joguines: ningú no la hi buscarà. Puja per l'escala, que la porta no té clau, i agafa-la." }
            ],
            enAcabar: () => {
                E.posaFlag('jordiPalanca');
                E.posaObjectiu("Agafa la palanca d'en Jordi: és al cofre de les joguines, dalt de la caseta aixecada sobre pals (a la Caseta).");
            }
        };
    }
});

// ---------------- BOSS: L'HOME DEL RAÏM VIU ----------------
ENEMICS.raim = {
    tex: 'home_raim', vida: 16, vel: 300, mal: 1, radi: 30, cos: [50, 24], ombra: 0.5,
    robust: true,
    perill: e => e.estat === 'carrega',
    ia(z, e, ara) {
        const jo = z.ineu.body.center, c = e.spr.body.center;
        const dist = Phaser.Math.Distance.Between(c.x, c.y, jo.x, jo.y);
        const fase2 = e.vida <= 6;
        if (!e.proxCarrega) e.proxCarrega = ara + 2500;
        const cap = Math.atan2(jo.y - c.y, jo.x - c.x);
        if (e.estat === 'apunta') {
            e.spr.body.setVelocity(0);
            if (ara > e.fins) { e.estat = 'carrega'; e.fins = ara + 380; e.spr.clearTint(); e.spr.body.setVelocity(Math.cos(e.ang) * this.vel, Math.sin(e.ang) * this.vel); }
        } else if (e.estat === 'carrega') {
            if (ara > e.fins) {
                e.estat = 'cansat'; e.fins = ara + (fase2 ? 700 : 1100); e.spr.body.setVelocity(0);
                e.proxCarrega = ara + (fase2 ? 1900 : 3200);
                z.cameras.main.shake(180, 0.004);          // el pes de la pedra
            }
        } else if (e.estat === 'cansat') {
            e.spr.body.setVelocity(0);
            if (ara > e.fins) e.estat = 'camina';
        } else {
            e.estat = 'camina';
            const v = dist > 120 ? (fase2 ? 70 : 48) : 0;
            e.spr.body.setVelocity(Math.cos(cap) * v, Math.sin(cap) * v);
            e.spr.setFlipX(Math.cos(cap) < 0);
            if (ara > e.proxCarrega && dist < 460) {
                e.estat = 'apunta'; e.fins = ara + (fase2 ? 450 : 700); e.ang = cap;
                e.spr.setTint(0xff8080);
            }
        }
    },
    alDerrotar(z, e) { z.raimDerrotat(e); }
};

// ---------------- BASE DE LES SALES ----------------
class ZonaCasaBase extends ZonaBase {
    // Sala amb terra de marbre, murs i una obertura de 120 al mig de la paret de sota
    sala(amp, alt, portaX, tint = 0xcfc2b0) {
        this.terra('rajola', 130, 80, amp - 260, alt - 80, -1100).setTint(tint);
        const murs = this.add.graphics().setDepth(-1000);
        murs.fillStyle(0x2a1f18, 1).fillRect(90, 0, 40, alt).fillRect(amp - 130, 0, 40, alt);
        murs.fillStyle(0x3a2c22, 1).fillRect(130, 0, amp - 260, 90);
        this.colisio(50, alt / 2, 80, alt);
        this.colisio(amp - 50, alt / 2, 80, alt);
        this.colisio(amp / 2, 80, amp - 260, 160);
        this.colisio((portaX - 60) / 2, alt - 10, portaX - 60, 20);
        this.colisio((portaX + 60 + amp) / 2, alt - 10, amp - portaX - 60, 20);
        this.add.rectangle(amp / 2, alt / 2, amp, alt, 0xffd38a, 0.05).setDepth(80000);
    }

    // Sala de pedra amb els gràfics de dibuixos_casa.js: paret del fons (textura), murs laterals, vora fosca al terra i parets de col·lisió.
    // forats: [[x0, x1], ...] trams de la paret del fons que queden oberts (per a una porta).
    salaPedra(amp, alt, portaX, o = {}) {
        this.terra('rajola', 130, 80, amp - 260, alt - 80, -1100).setTint(o.tint || 0x8a7a68);
        this.add.image(130, 0, o.paret).setOrigin(0).setScale(1 / RES).setDepth(-995);
        this.add.image(90, 0, 'mur_ermita').setOrigin(0).setScale(1 / RES).setDepth(-995);
        this.add.image(amp - 130, 0, 'mur_ermita').setOrigin(0).setScale(1 / RES).setDepth(-995).setFlipX(true);
        const vora = this.add.graphics().setDepth(-1040);
        vora.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.45, 0, 0.45, 0).fillRect(130, 170, 110, alt - 170);
        vora.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0.45, 0, 0.45).fillRect(amp - 240, 170, 110, alt - 170);
        this.colisio(50, alt / 2, 80, alt);
        this.colisio(amp - 50, alt / 2, 80, alt);
        let x = 130;
        [...(o.forats || []), [amp - 130, amp - 130]].forEach(([a, b]) => { if (a > x) this.colisio((x + a) / 2, 85, a - x, 170); x = Math.max(x, b); });
        this.colisio((portaX - 60) / 2, alt - 10, portaX - 60, 20);
        this.colisio((portaX + 60 + amp) / 2, alt - 10, amp - portaX - 60, 20);
        this.add.rectangle(amp / 2, alt / 2, amp, alt, 0xffd38a, 0.05).setDepth(80000);
    }

    porta(x, y, w, h, color = 0x4a2c16) {
        return this.add.rectangle(x, y, w, h, color).setStrokeStyle(4, 0x2a1a0c).setDepth(y - 60);
    }

    // Aplic de ferro clavat a la paret: placa, volutes que aguanten el platet, espelma i flama. (x, y) és el platet.
    aplic(x, y, i = 0, fons = -930) {
        const ap = this.add.graphics().setDepth(fons);
        ap.fillStyle(0xffc060, 0.08).fillCircle(x, y - 34, 46).fillStyle(0xffc060, 0.08).fillCircle(x, y - 34, 26);   // claror a la paret
        ap.fillStyle(0x000000, 0.3).fillRoundedRect(x - 7, y - 4, 16, 34, 4);
        ap.fillStyle(0x1e1a18, 1).fillRoundedRect(x - 8, y - 6, 16, 34, 4);
        ap.fillStyle(0x4a4440, 1).fillCircle(x, y + 3, 2.2).fillCircle(x, y + 19, 2.2);
        [-1, 1].forEach(s => {
            ap.lineStyle(3.5, 0x1e1a18, 1).beginPath(); ap.arc(x + s * 8, y + 6, 8, Math.PI * 1.5, Math.PI * 0.5, s < 0); ap.strokePath();
        });
        ap.fillStyle(0x1e1a18, 1).fillEllipse(x, y - 3, 26, 7);
        ap.fillStyle(0x5a524c, 1).fillEllipse(x, y - 4.5, 22, 3);
        ap.fillStyle(0xeee2c4, 1).fillRect(x - 4, y - 30, 8, 26);
        ap.fillStyle(0xc8b896, 1).fillRect(x + 1, y - 30, 3, 26);
        ap.fillStyle(0xeee2c4, 1).fillEllipse(x - 4, y - 18, 3, 9);                                                         // regalim de cera
        ap.lineStyle(1.5, 0x2a1608, 1).lineBetween(x, y - 30, x, y - 34);
        const flama = this.add.graphics({ x, y: y - 34 }).setDepth(fons + 1);
        flama.fillStyle(0xffb040, 0.35).fillCircle(0, -3, 9);
        flama.fillStyle(0xffc860, 1).fillEllipse(0, -5, 8, 15);
        flama.fillStyle(0xfff4c0, 1).fillEllipse(0, -3, 4, 8);
        this.tweens.add({ targets: flama, alpha: 0.75, scaleY: 0.88, yoyo: true, repeat: -1, duration: 350 + i * 90 });
    }

    espelmes(llista) {
        llista.forEach(([x, y], i) => {
            const e = this.posar('espelma', x, y, { fonsY: y });
            this.tweens.add({ targets: e, alpha: 0.7, yoyo: true, repeat: -1, duration: 350 + i * 90 });
        });
    }
}

// ---------------- L'ESCALINATA ----------------
class ZonaCasaGranInt extends ZonaCasaBase {
    constructor() {
        super('ZonaCasaGranInt', {
            nom: 'La Casa Gran · Escalinata',
            amplada: 1400,
            alcada: 1000,
            colorFons: '#120c08',
            entrades: {
                porxo:   { x: 700,  y: 930, dir: 'amunt' },
                secreta: { x: 170,  y: 740, dir: 'dreta' },
                cripta:  { x: 700,  y: 700, dir: 'avall' }
            }
        });
    }

    construir() {
        this.sala(1400, 1000, 700);

        // Gran escalinata central cap al nord, amb baranes
        const esc = this.add.graphics().setDepth(-980);
        for (let i = 0; i < 9; i++) {
            const ample = 460 - i * 14, y = 600 - i * 44;
            esc.fillStyle(i % 2 ? 0xa9906a : 0xb89f78, 1).fillRect(700 - ample / 2, y, ample, 44);
            esc.lineStyle(2, 0x6e5a3a, 1).strokeRect(700 - ample / 2, y, ample, 44);
        }
        // Al fons, un balcó de pedra clara amb dues columnes esvelta de capitell, sota una gran volta de carreus
        const balco = this.add.graphics().setDepth(-985);
        balco.fillStyle(0x4a3a26, 1).fillEllipse(700, 215, 520, 250);
        balco.lineStyle(5, 0x8a7448, 1).strokeEllipse(700, 215, 520, 250);
        balco.fillStyle(0xd8d0bc, 1).fillRect(560, 196, 280, 26).lineStyle(3, 0x6e5a3a, 1).strokeRect(560, 196, 280, 26);
        [640, 760].forEach(x => {
            balco.fillStyle(0xe6dfcc, 1).fillRect(x - 9, 98, 18, 100).lineStyle(2, 0x8a7a5e, 1).strokeRect(x - 9, 98, 18, 100);
            balco.fillStyle(0xcfc6ae, 1).fillRect(x - 16, 88, 32, 12).strokeRect(x - 16, 88, 32, 12);
        });
        this.colisio(450, 400, 24, 430);
        this.colisio(950, 400, 24, 430);

        // Porta camuflada (esquerra): torna a la sala del tresor
        this.porta(115, 740, 20, 110, 0x6a4a2c);
        this.sortida(116, 690, 14, 100, 'ZonaCasaTresor', 'escala');

        this.espelmes([[330, 200], [1070, 200], [330, 760], [1070, 760]]);
        this.reixaPorxo();

        this.puzleRaim();
    }

    // La reixa del porxo vista per dins: tancada amb una barra; aixecant-la es pot sortir a la plaça (de fora no s'obre)
    reixaPorxo() {
        const oberta = Estat.flag('reixaObertaDins') || Estat.flag('ocellaireVencut');
        this.reixa = this.add.graphics().setDepth(960);
        this.reixa.fillStyle(0x16100a, 1).fillRect(640, 962, 120, 38).lineStyle(4, 0x6a625a, 1);
        for (let x = 648; x <= 752; x += 16) this.reixa.lineBetween(x, 962, x, 1000);
        this.reixa.lineStyle(7, 0x3a3834, 1).lineBetween(640, 982, 760, 982);
        if (oberta) { this.reixa.setAlpha(0.45); this.sortida(640, 986, 120, 14, 'ZonaCasaGran', 'porxo'); return; }
        this.colReixa = this.colisio(700, 990, 120, 26);
        this.interactiu(700, 940, RADI_OBJECTE, DIALEGS.reixaDins, {
            altura: 120, actiu: () => !Estat.flag('reixaObertaDins'),
            enTancar: () => {
                this.obstacles.remove(this.colReixa, true, true);
                this.reixa.setAlpha(0.45);
                this.sortida(640, 986, 120, 14, 'ZonaCasaGran', 'porxo');
            }
        });
    }

    // ---- L'Home del Raïm i la rosa dels vents ----
    // El cap de pedra mira cap a una direcció (la fletxa de pedra del costat de l'estàtua ho mostra). La palanca, al forat de la base, el gira un quart de volta
    // cada cop. Quan mira a llevant (E, on neix el sol), el guardià es desperta.
    puzleRaim() {
        this.raimDir = 3;      // comença girat cap a ponent (el cap "girat enrere")
        const derrotat = Estat.flag('raimDerrotat');
        const desperta = Estat.flag('raimDesperta');

        // Rosa dels vents de pedra, gran, a terra davant l'estàtua: amb el sol que neix i el raïm a l'est
        const cx = 700, cy = 590;
        this.add.image(cx, cy, 'rosa_vents').setScale(1 / RES).setDepth(-960);
        this.interactiu(cx, cy + 50, RADI_OBJECTE, DIALEGS.rosaVents, { altura: 70, actiu: () => !Estat.flag('raimDesperta') });

        // La fletxa de pedra: indica cap on mira el cap de l'estàtua
        this.fletxa = this.add.image(618, 452, 'fletxa_raim').setScale(1 / RES * 0.9).setDepth(515);
        this.fletxa.setAngle(this.raimDir * 90);
        this.fletxa.setVisible(!derrotat);
        this.actualitzarRaim();

        // L'estàtua (o, si ja ha estat vençuda, un munt de pedres)
        this.estatua = null;
        if (derrotat) {
            this.runes();
        } else {
            this.estatua = this.posar('home_raim', 700, 470);
            this.colEstatua = this.colisio(700, 461, 46, 18);
        }
        // Mirar l'estàtua només fa falta si encara no tens la palanca: et diu on és
        this.interactiu(700, 478, 75, DIALEGS.homeRaimInt, { altura: 190, actiu: () => !Estat.flag('raimDesperta') && !Estat.te('palanca') });

        // Forat quadrat de la base: aquí s'encaixa la palanca i es gira el cap
        if (!derrotat) this.add.rectangle(618, 505, 26, 22, 0x1a1410).setStrokeStyle(3, 0x8a7a5e).setDepth(500);
        this.interactiu(618, 505, 75, E => {
            if (!E.te('palanca')) return { pagines: [] };
            this.raimDir = (this.raimDir + 1) % 4;
            this.actualitzarRaim(true);
            const llevant = this.raimDir === 1;
            this.volDespertar = llevant && this.teArma();
            return { pagines: [{ avis: llevant ? "El cap de pedra mira a llevant." : "El cap de pedra mira " + NOMS_DIR[this.raimDir] + "." }] };
        }, { altura: 90, actiu: () => !Estat.flag('raimDesperta'),
             enTancar: () => { if (this.volDespertar) { this.volDespertar = false; this.ui().obrirDialeg(DIALEGS.raimDesperta, () => this.despertarRaim()); } } });

        // Trapa de la cripta, a sota de l'escalinata, un cop vençut el guardià
        this.trapa = this.add.graphics().setDepth(-958);
        this.trapa.fillStyle(0x0a0705, 1).fillRect(650, 676, 100, 46).lineStyle(4, 0x8a7a5e, 1).strokeRect(650, 676, 100, 46);
        this.trapa.fillStyle(0x3a2c22, 1).fillRect(654, 684, 92, 8).fillRect(654, 700, 92, 8);
        this.trapa.setVisible(derrotat);
        this.interactiu(700, 730, RADI_OBJECTE, DIALEGS.trapaCripta, {
            altura: 60, actiu: () => Estat.flag('raimDerrotat'),
            enTancar: () => this.canviarZona('ZonaCasaCripta', 'porta')
        });

        // Si el guardià ja estava despert (has sortit i tornat), segueix aquí
        if (desperta && !derrotat) this.despertarRaim(true);
    }

    runes() {
        [[670, 468], [730, 472], [700, 458]].forEach(([x, y]) => this.posar('roca', x, y, { col: { w: 50, h: 20 } }));
        this.raimDir = 1;
        if (this.fletxa) this.fletxa.setVisible(false);
    }

    // Gira la fletxa de pedra fins a la direcció actual (animada si es pot)
    actualitzarRaim(animat) {
        const ang = this.raimDir * 90;
        if (!this.fletxa) return;
        if (!animat) { this.fletxa.setAngle(ang); return; }
        Sfx.porta();
        this.cameras.main.shake(120, 0.002);
        const des = Phaser.Math.Angle.ShortestBetween(this.fletxa.angle, ang);
        this.tweens.add({ targets: this.fletxa, angle: this.fletxa.angle + des, duration: 420, ease: 'Back.easeOut',
            onComplete: () => { this.fletxa.setAngle(ang); if (this.raimDir === 1) this.llum(this.fletxa.x, this.fletxa.y, 0xffe08a); } });
    }

    // L'estàtua cobra vida
    despertarRaim(sense = false) {
        if (!sense) Estat.posaFlag('raimDesperta');
        const boss = this.enemic('raim', 700, 470);
        if (!boss) return;
        this.boss = boss;
        if (this.estatua) this.estatua.setVisible(false);
        if (this.colEstatua) { this.obstacles.remove(this.colEstatua, true, true); this.colEstatua = null; }
        this.cameras.main.shake(500, 0.006);
    }

    raimDerrotat(e) {
        const c = e.spr.body.center;
        Estat.posaFlag('raimDerrotat');
        this.ui().actualitzarHUD();
        this.tweens.add({ targets: e.spr, angle: 70, duration: 400 });
        this.time.delayedCall(900, () => this.ui().obrirDialeg(DIALEGS.raimDerrotat, () => {
            this.tweens.add({ targets: [e.spr, e.ombra], alpha: 0, duration: 800, onComplete: () => this.retirar(e) });
            this.runes();
            this.trapa.setVisible(true);
            Estat.posaObjectiu("Baixa per la trapa de sota l'escalinata, a la cripta dels monjos.");
            Estat.desar();
        }));
    }
}

// ---------------- LA CRIPTA ----------------
class ZonaCasaCripta extends ZonaCasaBase {
    constructor() {
        super('ZonaCasaCripta', {
            nom: 'Casa Gran · Cripta',
            amplada: 1000,
            alcada: 700,
            colorFons: '#0a0806',
            pacifica: true,
            entrades: { porta: { x: 500, y: 620, dir: 'amunt' } }
        });
    }

    construir() {
        this.salaPedra(1000, 700, 500, { paret: 'paret_cripta', tint: 0x6a6a72 });
        // Sarcòfags dels monjos, tres a cada banda, amb les piles que aguanten les voltes entre ells
        [[230, 330], [230, 470], [230, 610], [770, 330], [770, 470], [770, 610]].forEach(([x, y], i) => {
            this.add.image(x, y, 'sarcofag_cripta').setOrigin(0.5, 1).setScale(1 / RES).setDepth(y);
            this.colisio(x, y - 22, 140, 36);
        });
        [[345, 300], [655, 300], [345, 560], [655, 560]].forEach(([x, y]) => {
            this.add.image(x, y, 'pilastra_ermita').setOrigin(0.5, 1).setScale(1 / RES).setDepth(y);
            this.colisio(x, y - 8, 40, 16);
        });
        // Llosa amb la clau de ferro sota un raig de llum tènue, i dos candelabres
        this.llosaCripta = this.add.image(500, 340, Estat.flag('relTretes') ? 'llosa_cripta_buida' : 'llosa_cripta').setOrigin(0.5, 1).setScale(1 / RES).setDepth(340);
        this.colisio(500, 316, 180, 36);
        this.interactiu(500, 372, RADI_OBJECTE, DIALEGS.cofreCripta, { altura: 130, enTancar: () => { if (Estat.flag('relTretes')) this.llosaCripta.setTexture('llosa_cripta_buida'); } });
        [[400, 360], [600, 360]].forEach(([x, y], i) => {
            this.add.image(x, y, 'candelabre_hall').setOrigin(0.5, 1).setScale(1 / RES).setDepth(y);
            this.colisio(x, y - 8, 24, 14);
            const llum = this.add.circle(x, y - 78, 80, 0xffc060, 0.1).setDepth(y + 1);
            this.tweens.add({ targets: llum, alpha: 0.05, scale: 0.92, yoyo: true, repeat: -1, duration: 420 + i * 90 });
        });
        const raig = this.add.graphics().setDepth(79000).setBlendMode(Phaser.BlendModes.ADD);
        raig.fillStyle(0xcfd8ff, 0.07).fillPoints([{ x: 450, y: 0 }, { x: 550, y: 0 }, { x: 600, y: 330 }, { x: 400, y: 330 }], true);
        this.add.particles(0, 0, 'espurna', { x: { min: 420, max: 580 }, y: { min: 120, max: 340 }, speedY: { min: -8, max: 2 }, lifespan: 4000, scale: { start: 0.2, end: 0 }, alpha: { start: 0.45, end: 0 }, tint: 0xdfe6ff, frequency: 300, blendMode: 'ADD' }).setDepth(79001);
        this.add.rectangle(500, 350, 1000, 700, 0x100820, 0.18).setDepth(80100);
        this.sortida(460, 680, 80, 14, 'ZonaCasaGranInt', 'cripta');
    }
}

// ---------------- EL PASSADÍS SECRET (de la Sala del Ping-pong a la sala del tresor) ----------------
// El túnel dels monjos (des del celler de la Casa Gran): fosc, amb escolopendres i un mur d'esbarzers negres que només Runna talla.
class ZonaPassadis extends ZonaCasaBase {
    constructor() {
        super('ZonaPassadis', {
            nom: 'Passadís secret',
            amplada: 800,
            alcada: 1400,
            colorFons: '#0a0806',
            entrades: {
                porta:  { x: 400, y: 1320, dir: 'amunt' },
                tresor: { x: 400, y: 200,  dir: 'avall' }
            }
        });
    }

    construir() {
        this.terra('pedra', 200, 100, 400, 1300, -1100).setTint(0x6a6058);
        this.add.image(160, 0, 'mur_passadis').setOrigin(0).setScale(1 / RES).setDepth(-995);
        this.add.image(600, 0, 'mur_passadis').setOrigin(0).setScale(1 / RES).setDepth(-995).setFlipX(true);
        this.add.image(200, 0, 'fons_passadis').setOrigin(0).setScale(1 / RES).setDepth(-994);
        [300, 640, 980, 1290].forEach(y => this.add.image(200, y, 'costella_passadis').setOrigin(0).setScale(1 / RES).setDepth(79000).setAlpha(0.5));      // costelles de la volta, per damunt
        // La porta del fons, que s'obre en acostar-s'hi: porta a la cambra del tresor
        this.portaFons = this.portaAnimada({ x: 400, top: 14, bottom: 92, ample: 96, fons: -990, arc: true, unic: true, color: 0x4a3a2a, vora: 0x140a04, ferro: true });
        this.colisio(100, 700, 200, 1400);
        this.colisio(700, 700, 200, 1400);
        this.colisio(270, 60, 140, 120);
        this.colisio(530, 60, 140, 120);
        this.colisio(270, 1395, 140, 30);
        this.colisio(530, 1395, 140, 30);

        this.espelmes([[230, 1250], [570, 1250], [230, 820], [570, 820], [230, 360], [570, 360]]);

        // Un mur d'esbarzers negres a mig passadís: només es talla amb Runna. Fosc sobre pedra fosca no es veuria: llueixen violeta
        // i hi ha dues espelmes a cada costat perquè es vegin de lluny.
        this.espelmes([[225, 770], [575, 770]]);
        [240, 320, 400, 480, 560].forEach((x, i) => {
            const o = this.esbarzer(x, 740, 'passadis' + i);
            if (!o) return;
            o.img.setTint(0xc8a0ff);
            const halo = this.add.ellipse(x, 722, 96, 60, 0x9a50ff, 0.32).setDepth(739);
            this.tweens.add({ targets: halo, alpha: 0.1, scale: 1.2, yoyo: true, repeat: -1, duration: 900 + i * 110 });
            o.halo = halo;
        });

        // Els animalets del cementiri esquerdat, abans i després del mur
        if (!Estat.flag('passadisNet')) {
            [[330, 1150], [470, 1000], [350, 880], [440, 520], [340, 330]].forEach(([x, y]) => this.enemic('escolopendra', x, y));
        }

        this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x000018, 0.32).setScrollFactor(0).setDepth(80000);
        this.sortida(340, 1386, 120, 14, 'ZonaPingpong', 'passadis');
        this.sortida(340, 92, 120, 40, 'ZonaCasaTresor', 'porta');
    }

    actualitzar() {
        this.esbarzers.forEach(o => { if (!o.viu && o.halo) { o.halo.destroy(); o.halo = null; } });
        if (Estat.flag('passadisNet')) return;
        if (this.enemics.every(e => e.mort) && this.esbarzers.every(o => !o.viu)) Estat.posaFlag('passadisNet');
    }
}

// ---------------- LA CAMBRA SECRETA (sala del tresor) ----------------
// Una cambra dels monjos: prestatgeries amb mercaderia, sacs, botes i, sobre una tarima, el cofre amb el pergamí. La porta de sortida (al fons, a la dreta)
// és tancada: s'obre alçant la bóta marcada amb una creu vermella, que el pergamí del monjo assenyala.
class ZonaCasaTresor extends ZonaCasaBase {
    constructor() {
        super('ZonaCasaTresor', {
            nom: 'Cambra secreta',
            amplada: 1000,
            alcada: 700,
            colorFons: '#0a0806',
            pacifica: true,
            entrades: { porta: { x: 500, y: 620, dir: 'amunt' }, escala: { x: 760, y: 215, dir: 'avall' } }
        });
    }

    construir() {
        this.salaPedra(1000, 700, 500, { paret: 'paret_tresor', tint: 0x8a7a68, forats: [[715, 805]] });
        // Estora, tarima del cofre i el cofre
        this.add.image(500, 690, 'catifa_ermita').setOrigin(0.5, 1).setScale(1 / RES).setDepth(-1050);
        this.add.image(500, 178, 'graons_ermita').setOrigin(0.5, 0).setScale(1 / RES).setDepth(-990);
        this.cofre = this.add.image(500, 218, 'cofre_tresor').setOrigin(0.5, 1).setScale(1 / RES).setDepth(218);
        this.colisio(500, 205, 100, 24);
        this.interactiu(500, 262, RADI_OBJECTE, DIALEGS.cofreCambra, { altura: 110 });
        [[390, 262], [610, 262]].forEach(([x, y], i) => {
            this.add.image(x, y, 'candelabre_hall').setOrigin(0.5, 1).setScale(1 / RES).setDepth(y);
            this.colisio(x, y - 8, 24, 14);
            const llum = this.add.circle(x, y - 78, 70, 0xffc060, 0.1).setDepth(y + 1);
            this.tweens.add({ targets: llum, alpha: 0.05, scale: 0.92, yoyo: true, repeat: -1, duration: 420 + i * 90 });
        });
        // Sacs, or, botes i prestatges
        [[190, 330, 'sacs_tresor', 130, 24], [200, 560, 'sacs_tresor', 130, 24], [800, 600, 'monedes_tresor', 90, 20]].forEach(([x, y, k, w, h]) => {
            this.add.image(x, y, k).setOrigin(0.5, 1).setScale(1 / RES).setDepth(y);
            this.colisio(x, y - h / 2, w, h);
        });
        [[190, 215], [190, 450], [250, 215]].forEach(([x, y]) => this.posar('barril', x, y, { col: { w: 50, h: 22 } }));
        [[810, 300], [810, 484], [750, 215]].forEach(([x, y]) => this.posar('barril', x, y, { col: { w: 50, h: 22 } }));

        // La bóta de la creu vermella: s'alça i, a sota, hi ha l'anella que obre la porta del fons
        const jaOberta = Estat.flag('portaTresorOberta');
        this.bota = this.posar('bota_creu', jaOberta ? 880 : 810, jaOberta ? 392 : 392, { col: { w: 50, h: 22 } });
        this.colBota = this.obstacles.getChildren()[this.obstacles.getChildren().length - 1];
        this.anella = this.add.graphics().setDepth(391);
        this.anella.fillStyle(0x1a1008, 1).fillEllipse(810, 392, 46, 16).lineStyle(4, 0x8a8478, 1).strokeCircle(810, 391, 8).lineStyle(3, 0x5a554c, 1).lineBetween(810, 399, 810, 405);
        this.anella.setVisible(jaOberta);
        this.interactiu(810, 424, RADI_OBJECTE, DIALEGS.botaTresor, { altura: 90, actiu: () => !Estat.flag('portaTresorOberta'), enTancar: () => { if (Estat.flag('botaAlcada')) this.alcarBota(); } });

        // La porta del fons, a la dreta: de pedra amb ferros; no s'obre fins que no s'ha estirat l'anella
        this.portaFons = this.portaAnimada({ x: 760, top: 20, bottom: 162, ample: 92, fons: -990, arc: true, unic: true, color: 0x5a4a38, vora: 0x140a04, ferro: true, bloq: () => !Estat.flag('portaTresorOberta') });
        this.sortida(716, 150, 88, 26, 'ZonaCasaGranInt', 'secreta');
        if (jaOberta) this.portaFons.forcaFins = this.time.now + 1500;
    }

    // Alça la bóta de la creu: es trasllada, deixa l'anella a la vista i, en estirar-la, s'obre la porta del fons
    alcarBota() {
        if (Estat.flag('portaTresorOberta')) return;
        Estat.posaFlag('portaTresorOberta'); Estat.desar();
        this.obstacles.remove(this.colBota, true, true);
        this.anella.setVisible(true);
        this.tweens.add({ targets: this.bota, y: this.bota.y - 38, duration: 380, ease: 'Sine.easeOut', yoyo: true, hold: 200,
            onComplete: () => this.tweens.add({ targets: this.bota, x: 880, duration: 500, ease: 'Sine.easeInOut', onComplete: () => {
                Sfx.secret(); this.cameras.main.shake(400, 0.004);
                this.portaFons.forcaFins = this.time.now + 3500;
            } }) });
    }
}

// ---------------- LA SALA DEL RELLOTGE (el rellotge del campanar, dalt de la torre del Santuari) ----------------
// El rellotge és aturat a un quart de quatre (l'hora que va arribar la boira). Puzle: posar tres engranatges a la mida correcta
// perquè torni a caminar. Arreglar-lo dóna +1 gra al rosari.
const GOLFES_SOLUCIO = [0, 2, 1];      // 0 petit, 1 mitjà, 2 gran: «el petit va primer, el gran al mig i el mitjà darrere»
const GOLFES_DENTS = [18, 24, 30];     // radi primitiu = dents * 1.5: totes les rodes tenen el mateix pas de dent i poden engranar
const GOLFES_NOM = ['petit', 'mitjà', 'gran'];
// Els engranatges són en un bastidor dret a terra, a l'esquerra (lluny del rellotge, que té el seu punt propi a la paret).
// Els eixos estan a la distància justa perquè, amb la solució, les dents de cada roda encaixin amb les de la veïna.
const GOLFES_ENG_X = [222, 222 + 27 + 45, 222 + 27 + 45 + 45 + 36];
const GOLFES_ENG_Y = 524;
const GOLFES_BASTIDOR = 604;       // peus del bastidor dels engranatges
const GOLFES_PARET = 446;          // fins on arriba la paret del fons (a sota, el terra)
const radiEng = mida => GOLFES_DENTS[mida] * 1.5;

Object.assign(DIALEGS, {
    golfesRellotge: E => ({ pagines: E.flag('rellotgeReparat') ? [
    ] : [
        { qui: 'Ineu', text: "El mecanisme és al bastidor de fusta de l'esquerra: tres engranatges a les posicions I, II i III. Cada cop que en toco un canvia de mida: petit, mitjà, gran." }
    ] }),

    golfesNota: E => ({ pagines: [
        { qui: 'Ineu', text: "«Nota del campaner. El rellotge només camina si els engranatges hi van en ordre: el petit primer, el gran al mig, i el mitjà darrere.»" }
    ] }),

    golfesPendol: E => ({ pagines: [] }),

    golfesPremi: {
        pagines: [
            { avis: "+1 GRA AL ROSARI i rosari ple." }
        ]
    }
});

// Roda dentada de llautó dibuixada al voltant de (0, 0). R = radi primitiu (on engranen les dents).
// Dents trapezoïdals (una centrada a l'angle 0), corona, radis buidats, cub amb cargols i forat de l'eix.
// La llum (lluïssor a dalt a l'esquerra, ombra a baix a la dreta) va a part a llumEngranatge, perquè no giri amb la roda.
function pintaEngranatge(g, R, dents, color = 0xc8a64a) {
    const m = 2 * R / dents, cap = R + m, peu = R - 1.25 * m, pas = Math.PI * 2 / dents;
    const fosc = 0x2a1608, buit = 0x3a2410, ombra = 0x8a6a28;
    const p = [];
    for (let k = 0; k < dents; k++) {
        const c = k * pas;
        [[-0.3, peu], [-0.17, cap], [0.17, cap], [0.3, peu]].forEach(([f, rr]) => p.push({ x: Math.cos(c + f * pas) * rr, y: Math.sin(c + f * pas) * rr }));
    }
    g.fillStyle(color, 1).fillPoints(p, true);
    g.lineStyle(2.5, fosc, 1).strokePoints(p, true);
    // Corona: una línia fosca marca on comencen les dents i una de clara el cantell de la corona
    const corona = peu - Math.max(3, R * 0.16);
    g.lineStyle(1.5, ombra, 0.9).strokeCircle(0, 0, peu - 1.5);
    // Buit entre la corona i el cub, amb els radis
    g.fillStyle(buit, 1).fillCircle(0, 0, corona);
    const nRadis = dents >= 28 ? 6 : dents >= 20 ? 5 : 4, ampleRadi = Math.max(3, R * 0.13), cub = Math.max(7, R * 0.3);
    for (let k = 0; k < nRadis; k++) {
        const a = k * Math.PI * 2 / nRadis + pas / 2, ca = Math.cos(a), sa = Math.sin(a), nx = -sa, ny = ca;
        const rp = [
            { x: ca * cub * 0.6 + nx * ampleRadi * 1.3, y: sa * cub * 0.6 + ny * ampleRadi * 1.3 },
            { x: ca * (corona + 1) + nx * ampleRadi, y: sa * (corona + 1) + ny * ampleRadi },
            { x: ca * (corona + 1) - nx * ampleRadi, y: sa * (corona + 1) - ny * ampleRadi },
            { x: ca * cub * 0.6 - nx * ampleRadi * 1.3, y: sa * cub * 0.6 - ny * ampleRadi * 1.3 }
        ];
        g.fillStyle(color, 1).fillPoints(rp, true);
        g.lineStyle(1.2, fosc, 0.9).lineBetween(rp[0].x, rp[0].y, rp[1].x, rp[1].y).lineBetween(rp[2].x, rp[2].y, rp[3].x, rp[3].y);
    }
    g.lineStyle(2, fosc, 1).strokeCircle(0, 0, corona);
    // Cub: anell, cargols i forat de l'eix amb el xaveter
    g.fillStyle(color, 1).fillCircle(0, 0, cub);
    g.lineStyle(2, fosc, 1).strokeCircle(0, 0, cub);
    g.lineStyle(1.2, ombra, 1).strokeCircle(0, 0, cub * 0.72);
    if (cub >= 9) for (let k = 0; k < 3; k++) {
        const a = k * Math.PI * 2 / 3 + 0.5;
        g.fillStyle(fosc, 1).fillCircle(Math.cos(a) * cub * 0.72, Math.sin(a) * cub * 0.72, 1.6);
    }
    g.fillStyle(0x1a0c04, 1).fillCircle(0, 0, cub * 0.34);
    g.fillRect(-1.5, -cub * 0.34 - 2, 3, 3);
}

// Llum fixa sobre una roda dentada (no gira): reflex de metall a dalt a l'esquerra i ombra a baix a la dreta
function llumEngranatge(g, R, dents) {
    const m = 2 * R / dents, cap = R + m, peu = R - 1.25 * m;
    g.lineStyle(Math.max(2, m * 0.8), 0xfff0b0, 0.45).beginPath(); g.arc(0, 0, peu - m * 0.6, Math.PI * 1.05, Math.PI * 1.5); g.strokePath();
    g.lineStyle(1.5, 0xfff8d8, 0.5).beginPath(); g.arc(0, 0, R * 0.3 - 1, Math.PI * 1.1, Math.PI * 1.45); g.strokePath();
    g.lineStyle(Math.max(2, m * 0.8), 0x1a0c04, 0.28).beginPath(); g.arc(0, 0, peu - m * 0.6, Math.PI * 0.05, Math.PI * 0.5); g.strokePath();
    g.lineStyle(2, 0x000000, 0.18).beginPath(); g.arc(0, 0, cap, Math.PI * 0.1, Math.PI * 0.45); g.strokePath();
}

class ZonaGolfes extends ZonaCasaBase {
    constructor() {
        super('ZonaGolfes', {
            nom: 'Sala del Rellotge',
            amplada: 1000,
            alcada: 700,
            colorFons: '#0a0806',
            pacifica: true,
            entrades: { porta: { x: 500, y: 620, dir: 'amunt' } }
        });
    }

    construir() {
        this.sala(1000, 700, 500, 0x8a6a48);
        // Paret del fons de fusta, amb sòcol, i unes bigues robustes al sostre
        const paret = this.add.graphics().setDepth(-995);
        paret.fillStyle(0x4a2e18, 1).fillRect(130, 0, 740, GOLFES_PARET);
        for (let x = 130; x < 870; x += 46) {
            paret.fillStyle(x / 46 % 2 ? 0x54341c : 0x4a2e18, 1).fillRect(x, 0, 46, GOLFES_PARET);
            paret.lineStyle(2, 0x2a1608, 0.8).lineBetween(x, 0, x, GOLFES_PARET);
            paret.lineStyle(1, 0x2a1608, 0.35).lineBetween(x + 14, 30, x + 16, GOLFES_PARET - 40).lineBetween(x + 31, 50, x + 29, GOLFES_PARET - 30);
        }
        paret.fillStyle(0x2a1608, 1).fillRect(130, GOLFES_PARET - 10, 740, 12);
        paret.fillStyle(0xffd9a0, 0.14).fillRect(130, GOLFES_PARET + 2, 740, 3);
        this.colisio(500, (160 + GOLFES_PARET) / 2, 740, GOLFES_PARET - 160);                                                           // la paret del fons, fins al sòcol
        const bigues = this.add.graphics().setDepth(-990);
        for (let x = 200; x <= 800; x += 120) {
            bigues.fillStyle(0x2a1608, 1).fillRect(x - 7, 0, 14, 160);
            bigues.fillStyle(0x4a2c14, 1).fillRect(x - 5, 0, 10, 160);
            bigues.fillStyle(0xffd9a0, 0.18).fillRect(x - 5, 0, 2, 160);
        }
        bigues.fillStyle(0x2a1608, 1).fillRect(130, 140, 740, 20);
        bigues.fillStyle(0x4a2c14, 1).fillRect(130, 142, 740, 14);
        bigues.fillStyle(0xffd9a0, 0.2).fillRect(130, 142, 740, 2);

        // Rodes dentades decoratives (no fan res) a la paret, a banda i banda
        [[205, 200, 27, 14, 0x9a8650], [800, 205, 33, 18, 0x9a8650], [200, 250, 15, 8, 0xb59a52]].forEach(([x, y, r, d, col]) => {
            const g = this.add.graphics({ x, y }).setDepth(-960);
            pintaEngranatge(g, r, d, col);
            llumEngranatge(g, r, d);
        });
        // Cadenes amb contrapesos de pedra, a cada costat del rellotge
        const cad = this.add.graphics().setDepth(-940);
        [240, 760].forEach(x => {
            cad.lineStyle(3, 0x2a1608, 1);
            for (let y = 164; y < 288; y += 11) cad.strokeEllipse(x, y + 5, 7, 11);
            cad.fillStyle(0x6a6862, 1).lineStyle(3, 0x1a1008, 1);
            cad.fillRoundedRect(x - 14, 288, 28, 52, 6).strokeRoundedRect(x - 14, 288, 28, 52, 6);
            cad.lineStyle(1.5, 0x2a2824, 0.7).lineBetween(x - 14, 304, x + 14, 304).lineBetween(x - 14, 322, x + 14, 322);
            cad.fillStyle(0xffffff, 0.22).fillRect(x - 11, 291, 4, 46);
        });

        // El rellotge gran, a la paret del fons: aturat a les 3:15 fins que s'arregla
        const cx = 500, cy = 196;
        const cara = this.add.graphics().setDepth(-900);
        cara.fillStyle(0x000000, 0.3).fillCircle(cx + 4, cy + 6, 116);
        cara.fillStyle(0x2a1608, 1).fillCircle(cx, cy, 114);
        cara.fillStyle(0xb58a3a, 1).fillCircle(cx, cy, 109);
        cara.fillStyle(0xe0b857, 1).fillCircle(cx, cy, 104);
        cara.lineStyle(2, 0x2a1608, 1).strokeCircle(cx, cy, 104).strokeCircle(cx, cy, 98);
        cara.fillStyle(0xf0e6cc, 1).fillCircle(cx, cy, 96);
        cara.fillStyle(0xd8c8a0, 0.6).fillCircle(cx + 18, cy + 30, 52);                            // taques d'humitat
        cara.fillStyle(0xc8b488, 0.5).fillCircle(cx - 38, cy - 24, 26);
        cara.lineStyle(3, 0x3a2412, 1).strokeCircle(cx, cy, 96).strokeCircle(cx, cy, 62);
        cara.lineStyle(1, 0x3a2412, 0.5).strokeCircle(cx, cy, 90);
        for (let i = 0; i < 60; i++) {
            const a = i * Math.PI / 30, gran = i % 5 === 0;
            cara.lineStyle(gran ? 4 : 1.5, 0x3a2412, 1).lineBetween(cx + Math.sin(a) * (gran ? 78 : 83), cy - Math.cos(a) * (gran ? 78 : 83), cx + Math.sin(a) * 90, cy - Math.cos(a) * 90);
        }
        for (let i = 0; i < 12; i++) {                                                           // reblons del bisell
            const a = i * Math.PI / 6;
            cara.fillStyle(0x6a4a18, 1).fillCircle(cx + Math.sin(a) * 101, cy - Math.cos(a) * 101, 2.4);
            cara.fillStyle(0xfff0b0, 0.7).fillCircle(cx + Math.sin(a) * 101 - 0.7, cy - Math.cos(a) * 101 - 0.7, 0.9);
        }
        ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'].forEach((n, i) => {
            const a = i * Math.PI / 6;
            this.add.text(cx + Math.sin(a) * 68, cy - Math.cos(a) * 68, n, estilText(i % 3 === 0 ? 17 : 13, '#3a2412', { fontStyle: 'bold' })).setOrigin(0.5).setDepth(-895);
        });
        this.agullaMinuts = this.add.graphics({ x: cx, y: cy }).setDepth(-880);
        this.agullaMinuts.fillStyle(0x2a1608, 1).fillPoints([{ x: -3.5, y: 8 }, { x: -1.6, y: -78 }, { x: 0, y: -86 }, { x: 1.6, y: -78 }, { x: 3.5, y: 8 }], true);
        this.agullaHores = this.add.graphics({ x: cx, y: cy }).setDepth(-879);
        this.agullaHores.fillStyle(0x2a1608, 1).fillPoints([{ x: -5, y: 8 }, { x: -3.5, y: -26 }, { x: 0, y: -33 }, { x: 3.5, y: -26 }, { x: 5, y: 8 }], true);
        this.agullaHores.fillPoints([{ x: -2, y: -33 }, { x: 0, y: -52 }, { x: 2, y: -33 }], true);
        this.add.circle(cx, cy, 9, 0xb58a3a).setStrokeStyle(2, 0x2a1608).setDepth(-870);
        this.add.circle(cx, cy, 3, 0x2a1608).setDepth(-869);
        this.agullaMinuts.rotation = Math.PI / 2;           // 3:15
        this.agullaHores.rotation = Math.PI / 2 + 0.13;
        this.interactiu(500, GOLFES_PARET + 10, RADI_OBJECTE, DIALEGS.golfesRellotge, { altura: 170 });

        // Mecanisme: un bastidor de fusta dret a terra, a l'esquerra, amb tres engranatges (cada interacció en canvia la mida).
        // Està separat de la paret perquè el rellotge i cada engranatge tinguin el seu punt d'ESPAI.
        this.reparat = Estat.flag('rellotgeReparat');
        this.mides = this.reparat ? GOLFES_SOLUCIO.slice() : [1, 1, 1];
        const B = GOLFES_BASTIDOR, bx0 = 156, bx1 = 442, dalt = 448, D = B;           // dalt: travesser de dalt (on van els llums)
        const bast = this.add.graphics().setDepth(D);
        bast.fillStyle(0x000000, 0.3).fillEllipse((bx0 + bx1) / 2, B + 2, bx1 - bx0 + 30, 20);
        bast.fillStyle(0x2a1608, 1).fillRoundedRect(bx0 + 6, dalt + 10, bx1 - bx0 - 12, B - dalt - 26, 4);                // tauler del fons
        for (let x = bx0 + 8; x < bx1 - 10; x += 26) {
            bast.fillStyle(x / 26 % 2 < 1 ? 0x4a2c14 : 0x442812, 1).fillRect(x, dalt + 12, Math.min(26, bx1 - 8 - x), B - dalt - 30);
            bast.lineStyle(1, 0x1a0c04, 0.6).lineBetween(x, dalt + 12, x, B - 18);
        }
        bast.fillStyle(0x000000, 0.25).fillRect(bx0 + 8, dalt + 12, bx1 - bx0 - 16, 8);                                     // ombra del travesser
        [bx0, bx1 - 18].forEach(x => {                                                                                       // muntants
            bast.fillStyle(0x2a1608, 1).fillRect(x - 2, dalt - 4, 22, B - dalt + 6);
            bast.fillStyle(0x6a4424, 1).fillRect(x, dalt - 2, 18, B - dalt + 2);
            bast.fillStyle(0xffd9a0, 0.18).fillRect(x + 2, dalt - 2, 3, B - dalt + 2);
            bast.fillStyle(0x2a1608, 1).fillRect(x - 6, B - 8, 30, 10);                                                       // peus
        });
        bast.fillStyle(0x2a1608, 1).fillRect(bx0 - 4, dalt - 8, bx1 - bx0 + 8, 22);                                        // travesser de dalt
        bast.fillStyle(0x6a4424, 1).fillRect(bx0 - 2, dalt - 6, bx1 - bx0 + 4, 18);
        bast.fillStyle(0xffd9a0, 0.2).fillRect(bx0 - 2, dalt - 6, bx1 - bx0 + 4, 3);
        bast.fillStyle(0x2a1608, 1).fillRect(bx0, B - 26, bx1 - bx0, 14);                                                  // travesser de baix
        bast.fillStyle(0x5a3a1e, 1).fillRect(bx0 + 2, B - 24, bx1 - bx0 - 4, 10);
        [[bx0 + 9, dalt + 3], [bx1 - 9, dalt + 3], [bx0 + 9, B - 19], [bx1 - 9, B - 19]].forEach(([x, y]) => {
            bast.fillStyle(0x8a8a90, 1).fillCircle(x, y, 3.5); bast.fillStyle(0x2a1608, 1).fillRect(x - 2.5, y - 0.7, 5, 1.4);
        });
        GOLFES_ENG_X.forEach(x => {                                                                                         // suports dels eixos
            bast.fillStyle(0x1a0c04, 1).fillRect(x - 5, GOLFES_ENG_Y, 10, B - 26 - GOLFES_ENG_Y);
            bast.fillStyle(0x5a5a60, 1).fillRect(x - 3, GOLFES_ENG_Y, 6, B - 26 - GOLFES_ENG_Y);
        });
        this.colisio((bx0 + bx1) / 2, B - 12, bx1 - bx0 + 8, 24);
        // Cada engranatge: ombra al tauler (fixa), la roda (gira) i la llum (fixa). El del mig va per darrere dels dos veïns.
        this.engranatges = GOLFES_ENG_X.map((x, i) => ({
            ombra: this.add.graphics({ x: x + 4, y: GOLFES_ENG_Y + 5 }).setDepth(D + 1),
            roda: this.add.graphics({ x, y: GOLFES_ENG_Y }).setDepth(D + (i === 1 ? 2 : 4)),
            llum: this.add.graphics({ x, y: GOLFES_ENG_Y }).setDepth(D + (i === 1 ? 3 : 5))
        }));
        GOLFES_ENG_X.forEach((x, i) => {
            this.dibuixaEngranatge(i);
            this.interactiu(x, B + 26, 64, () => this.girarEngranatge(i), { altura: 190, actiu: () => !this.reparat });
        });
        if (this.reparat) this.encaixaEngranatges();
        // Plaques de posició (I, II, III) al travesser de baix. Cap llum ni avís: el puzle només es resol quan tots tres són bons.
        GOLFES_ENG_X.forEach((x, i) => {
            this.add.rectangle(x, B - 19, 30, 14, 0x3a2412).setStrokeStyle(1.5, 0xb58a3a).setDepth(D + 6);
            this.add.text(x, B - 19, ['I', 'II', 'III'][i], estilText(11, '#f2e6c8', { fontStyle: 'bold' })).setOrigin(0.5).setDepth(D + 7);
        });

        // Nota del campaner (la pista del puzle), clavada a la paret de l'esquerra: pergamí desplegat i gastat
        this.posar('pergami_paret', 175, 360, { fonsY: -850, escala: 1.15 });
        this.interactiu(175, GOLFES_PARET + 10, RADI_OBJECTE, DIALEGS.golfesNota, { altura: 90 });

        // Caixa del pèndol, al costat dret: el pèndol batega quan el rellotge camina
        const caixa = this.add.graphics().setDepth(522);
        caixa.fillStyle(0x000000, 0.28).fillEllipse(810, 530, 120, 18);
        caixa.fillStyle(0x2a1608, 1).fillRoundedRect(766, 360, 88, 168, 6);
        caixa.fillStyle(0x5a3a1e, 1).fillRoundedRect(770, 364, 80, 160, 5);
        caixa.fillStyle(0x140a04, 1).fillRoundedRect(780, 380, 60, 124, 3);
        caixa.fillStyle(0x7a5a30, 1).fillRect(760, 354, 100, 12).fillRect(764, 520, 92, 10);
        caixa.lineStyle(2, 0x2a1608, 1).strokeRect(760, 354, 100, 12).strokeRect(764, 520, 92, 10);
        this.pendol = this.add.graphics({ x: 810, y: 386 }).setDepth(523);
        this.pendol.lineStyle(3, 0x8a6a28, 1).lineBetween(0, 0, 0, 92);
        this.pendol.fillStyle(0xb58a3a, 1).fillCircle(0, 98, 17).lineStyle(2.5, 0x2a1608, 1).strokeCircle(0, 98, 17);
        this.pendol.fillStyle(0xfff0b0, 0.55).fillCircle(-5, 92, 4);
        this.pendol.fillStyle(0x6a4a18, 1).fillCircle(0, 0, 4);
        const vidre = this.add.graphics().setDepth(524);
        vidre.fillStyle(0xbfe6ff, 0.1).fillRoundedRect(780, 380, 60, 124, 3);
        vidre.fillStyle(0xffffff, 0.14).fillPoints([{ x: 784, y: 384 }, { x: 800, y: 384 }, { x: 784, y: 440 }], true);
        this.colisio(810, 516, 96, 22);
        this.interactiu(810, 545, RADI_OBJECTE, DIALEGS.golfesPendol, { altura: 100 });

        this.aplic(320, 290, 0); this.aplic(680, 290, 1);           // dos aplics a la paret, entre les cadenes i el rellotge
        this.sortida(440, 686, 120, 14, 'ZonaTorre', 'dalt');
        if (this.reparat) this.agullaMinuts.rotation = 0;
        this.objectiuGolfes();
    }

    // L'objectiu diu què toca fer a la sala
    objectiuGolfes() {
        const E = Estat;
        if (this.reparat) return;
        E.posaObjectiu("Posa els engranatges del rellotge en ordre.");
        const ui = this.ui(); if (ui && ui.actualitzarHUD) ui.actualitzarHUD();
    }

    dibuixaEngranatge(i) {
        const e = this.engranatges[i], dents = GOLFES_DENTS[this.mides[i]], R = radiEng(this.mides[i]);
        e.ombra.clear().fillStyle(0x000000, 0.35).fillCircle(0, 0, R + 2 * R / dents);
        e.roda.clear(); pintaEngranatge(e.roda, R, dents);
        e.llum.clear(); llumEngranatge(e.llum, R, dents);
    }

    // Gira cada roda perquè les dents encaixin amb les de la veïna (una dent davant d'un forat al punt de contacte).
    // f: fracció del pas de dent que la roda té al punt de contacte (0 = centre d'una dent, 0.5 = centre d'un forat);
    // dues rodes engranades sumen sempre 0.5 i, si giren a la velocitat que toca, la suma es manté.
    encaixaEngranatges() {
        let f = 0;
        this.engranatges.forEach((e, i) => {
            const pas = Math.PI * 2 / GOLFES_DENTS[this.mides[i]];
            if (i === 0) { e.roda.rotation = 0; return; }
            const fi = ((0.5 - f) % 1 + 1) % 1;                  // fracció que necessita a l'angle PI (de cara a la roda d'abans)
            e.roda.rotation = Math.PI - fi * pas;
            f = (((-e.roda.rotation) / pas) % 1 + 1) % 1;        // fracció que té a l'angle 0 (de cara a la roda següent)
        });
    }

    girarEngranatge(i) {
        this.mides[i] = (this.mides[i] + 1) % 3;
        this.dibuixaEngranatge(i);
        const roda = this.engranatges[i].roda;
        this.tweens.add({ targets: roda, scale: { from: 0.86, to: 1 }, duration: 220, ease: 'Back.Out' });
        Sfx.menu();
        const bé = this.mides.every((m, k) => m === GOLFES_SOLUCIO[k]);
        if (!bé) return null;
        return {
            pagines: DIALEGS.golfesPremi.pagines,
            enAcabar: () => {
                this.reparat = true; Estat.posaFlag('rellotgeReparat');
                this.encaixaEngranatges();
                this.cameras.main.shake(300, 0.003); Sfx.secret();
                const E = Estat;
                E.dades.corsMax += 1; E.dades.vida = E.dades.corsMax * 2;
                E.posaObjectiu('El rellotge del Santuari torna a caminar. Explica-ho al Pare Daniel.');
                this.ui().actualitzarHUD();
                E.desar();
            }
        };
    }

    actualitzar(ara, delta) {
        if (!this.reparat) return;
        // Amb el rellotge en marxa: agulles, engranatges (cadascun en sentit contrari al del veí) i pèndol
        this.agullaMinuts.rotation += delta * 0.0006;
        this.agullaHores.rotation += delta * 0.00005;
        // Velocitat inversa al nombre de dents: així les dents de les rodes veïnes continuen encaixades
        this.engranatges.forEach((e, i) => { e.roda.rotation += delta * 0.0009 * (i % 2 ? -1 : 1) * GOLFES_DENTS[this.mides[0]] / GOLFES_DENTS[this.mides[i]]; });
        this.pendol.rotation = Math.sin(ara / 520) * 0.32;
    }
}
