/**
 * LA CASA GRAN (masmorra): l'Escalinata i una petita cripta.
 *   Entrada: només la secreta, des d'El Celler (el ping-pong; darrere la roda de carruatge, amb Runna): passadís amb escolopendres
 *            i un esbarzer negre, sala del tresor (la cambra secreta dels monjos) i una porta cap a l'Escalinata. La reixa del porxo
 *            (plaça) és tancada des de fora; només es pot obrir per dins, com a drecera de tornada.
 *   Escalinata: l'Home del Raïm. Amb la Palanca (la dóna en Jordi de la Caseta) es gira el cap cap a llevant i es prem el raïm:
 *               l'estàtua cobra vida (BOSS). Derrotada, s'obre la trapa de la cripta.
 *   Cripta: les relíquies robades als monjos (cal portar-les a la tomba esquerdada del Cementiri) i la Clau de ferro,
 *           que obre la porta de ferro de la Sala de les Gírgoles (a sota de la Taverna, no pas des d'aquí).
 */

// ---------------- DIÀLEGS ----------------
const NOMS_DIR = ["cap al nord (cap a l'escala)", "cap a llevant (E)", "cap a migdia (S)", "cap a ponent (O)"];

Object.assign(DIALEGS, {
    homeRaimInt: E => {
        if (E.flag('raimDerrotat')) {
            return { pagines: [{ qui: '', text: "Un munt de pedres, un carràs de marbre trencat i pols de segles. Al mig, la trapa de la cripta és oberta." }] };
        }
        if (!E.te('palanca')) {
            return {
                pagines: [
                    { qui: '', text: "Al mig de la gran escalinata, l'Home del Raïm: una escultura de pedra gairebé tan alta com dos homes, amb un carràs de raïm de marbre a les mans." },
                    { qui: 'Ineu', text: "Té el cap girat cap enrere, com si vigilés una cosa de sota l'escala. A la base hi ha un forat quadrat, com per encaixar-hi una palanca..." },
                    { qui: 'Ineu', text: "En Jordi de la Caseta, el pagès que viu darrere el Til·ler, sempre porta eines. Potser ell en té una." }
                ]
            };
        }
        return null;
    },

    rosaVents: E => ({
        pagines: [
            { qui: '', text: "Una rosa dels vents de pedra, gravada a terra davant l'estàtua. Al costat de la E hi ha tallat un sol que neix i, sota, un raïm." },
            { qui: '', text: "Una inscripció gairebé esborrada: «On neix el sol, el raïm madura.»" },
            { qui: 'Ineu', text: "Llevant... L'est. Potser cal que l'Home del Raïm miri cap allà, i llavors prémer-li el raïm." }
        ]
    }),

    raimDesperta: {
        pagines: [
            { qui: '', text: "Prems el raïm de marbre. Clic! Dins l'estàtua una cosa gran cedeix, i el cap de pedra gira, lentament, cap a llevant." },
            { qui: '', text: "Els ulls de l'Home del Raïm s'obren. Dues llums vermelles com el most. Els peus de pedra es mouen, rascant els graons." },
            { qui: 'Home del Raïm', text: "NINGÚ... NO... BAIXA... A LA... PORTA." },
            { qui: 'Ineu', text: "Un guardià! És ell, el que vigila la cripta. Haig d'aturar-lo!" }
        ]
    },

    raimSenseArma: {
        pagines: [
            { qui: '', text: "Estàs a punt de prémer el raïm de marbre, però un calfred et recorre l'esquena." },
            { qui: 'Ineu', text: "Si això desperta alguna cosa, no tinc res amb què defensar-me. Millor tornar amb el bastó." }
        ]
    },

    raimDerrotat: {
        pagines: [
            { qui: '', text: "L'Home del Raïm vacil·la, s'esquerda de dalt a baix i es desfà en un munt de pedres. El carràs de marbre rebota per l'escalinata com una pilota." },
            { qui: 'Home del Raïm', text: "Ja... us... podeu... ... endur-les." },
            { qui: '', text: "Allà on era, una llosa s'ha enfonsat i mostra una trapa amb una escala estreta que baixa a la foscor: la cripta." }
        ]
    },

    trapaCripta: E => ({
        pagines: [{ qui: '', text: "La trapa oberta sota l'escalinata. De baix en puja una olor de pedra freda i d'encens vell." }]
    }),

    cofreCripta: E => E.flag('relTretes') ? {
        pagines: [{ qui: '', text: "La cripta és buida. Sobre la llosa, només el drap de lli plegat." }]
    } : {
        pagines: [
            { qui: '', text: "Una cambra petita, tapiada fa segles. Sobre una llosa, un drap de lli embolcalla un calze, una creu de plata, un anell amb ambre i un breviari de cuir vermell." },
            { qui: 'Ineu', text: "Les relíquies dels monjos! El monjo de Runna les va amagar aquí perquè ningú no les toqués, i sense elles la tomba del cementiri s'ha esquerdat. Aquesta és l'esquerda del segell." },
            { qui: '', text: "Penjada d'un clau, una gran clau de ferro negre, i un paper: «Qui vulgui entrar on mai no s'ha d'entrar, que passi per sota la Taverna.»" },
            { qui: '', text: "Has obtingut les RELÍQUIES DELS MONJOS i la CLAU DE FERRO." }
        ],
        enAcabar: () => {
            E.dona('reliquies_monjos'); E.dona('clau_ferro'); E.posaFlag('relTretes'); E.posaFlag('clauFerro');
            E.posaObjectiu("Porta les relíquies a la tomba esquerdada del Cementiri (darrere el Santuari i el Monestir).");
        }
    },

    // La tomba del Cementiri: amb les relíquies, l'esquerda es tanca
    tombaMonjos: E => {
        if (E.flag('relIquiesRetornades')) {
            return { pagines: [{ qui: '', text: "La llosa de la tomba dels monjos primers, tancada de nou. Les relíquies reposen a sota, i només un fil de llum tèbia surt de l'esquerda." }] };
        }
        if (E.te('reliquies_monjos')) {
            return {
                pagines: [
                    { qui: '', text: "Davant la llosa esquerdada, l'Ineu posa a terra, una a una, el calze, la creu, l'anell i el breviari." },
                    { qui: '', text: "La boira lila s'atura, com si algú hagués deixat de respirar. L'esquerda es tanca amb un so de pedra que perdona." },
                    { qui: 'Ineu', text: "Ja podeu descansar, germans." },
                    { qui: '', text: "(La boira del cementiri s'afebleix. Però el segell més gran continua trencat: l'Ocellaire és sota la Taverna.)" }
                ],
                enAcabar: () => {
                    E.treu('reliquies_monjos');
                    E.posaFlag('relIquiesRetornades');
                    E.posaObjectiu("Troba la porta de ferro, darrere de la Taverna, a la part de sota: és l'entrada a la Sala de les Gírgoles.");
                }
            };
        }
        return {
            pagines: [
                { qui: '', text: "Una gran llosa esquerdada al mig del replà, amb lletres antigues gairebé esborrades: «Ací reposen els qui van tancar la porta.»" },
                { qui: '', text: "De l'esquerda surt una boira lila, freda, que sembla respirar. Al seu voltant, la terra és plena d'animalets que no haurien de sortir." },
                { qui: 'Ineu', text: "Aquí és, doncs, el cementiri vell dels monjos del segle XV. L'esquerda del segell... Si algú els tornés el que els van prendre..." },
                { qui: '', text: "(El monjo les va amagar a la Casa Gran perquè ningú no les robés. Quan les portis aquí, l'esquerda es tancarà.)" }
            ],
            enAcabar: () => E.posaFlag('tombaVista')
        };
    },

    // En Jordi de la Caseta, rere el Til·ler (la palanca és d'Acte 2; l'Home del Raïm ja no es veu fins a l'Acte 3)
    jordiCaseta: E => {
        if (E.te('palanca') || E.flag('palanca')) {
            return { pagines: [{ qui: 'Jordi', text: "Fes-ne bon ús, monjo! I vigila, que les coses de pedra no sempre s'estan quietes." }] };
        }
        return {
            pagines: [
                { qui: 'Jordi', text: "Ei, monjo! Em dic Jordi, el de la Caseta. Conec cada drecera del Miracle, i les eines, encara millor." },
                { qui: 'Ineu', text: "Jordi, les cel·les em diuen que en saps, d'eines. De vegades cal moure una cosa pesada i no hi ha manera." },
                { qui: 'Jordi', text: "Una palanca! Aquí en tinc una de ferro, de les bones. Per moure roques, per obrir reixes... i, si cal, per girar el cap a una estàtua tossuda. Agafa-la, que mai se sap." },
                { qui: '', text: "Has obtingut la PALANCA." }
            ],
            enAcabar: () => {
                E.dona('palanca'); E.posaFlag('palanca');
                if (E.flag('cofreCambra')) E.posaObjectiu("Porta la palanca a l'Home del Raïm, al mig de l'escalinata de la Casa Gran.");
            }
        };
    }
});

// ---------------- BOSS: L'HOME DEL RAÏM VIU ----------------
ENEMICS.raim = {
    tex: 'home_raim', vida: 12, vel: 300, mal: 1, radi: 30, cos: [50, 24], ombra: 0.5,
    monedes: [1, 20, 20], cor: 0, robust: true,
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

    porta(x, y, w, h, color = 0x4a2c16) {
        return this.add.rectangle(x, y, w, h, color).setStrokeStyle(4, 0x2a1a0c).setDepth(y - 60);
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
        this.cartell(900, 880, DIALEGS.cartellCasaGran);
        this.reixaPorxo();

        this.puzleRaim();
    }

    // La reixa del porxo vista per dins: tancada amb una barra; aixecant-la es pot sortir a la plaça (de fora no s'obre)
    reixaPorxo() {
        const oberta = Estat.flag('reixaObertaDins');
        this.reixa = this.add.graphics().setDepth(960);
        this.reixa.fillStyle(0x16100a, 1).fillRect(640, 962, 120, 38).lineStyle(4, 0x6a625a, 1);
        for (let x = 648; x <= 752; x += 16) this.reixa.lineBetween(x, 962, x, 1000);
        this.reixa.lineStyle(7, 0x3a3834, 1).lineBetween(640, 982, 760, 982);
        if (oberta) { this.reixa.setAlpha(0.45); this.sortida(640, 986, 120, 14, 'ZonaCasaGran', 'porxo'); return; }
        this.colReixa = this.colisio(700, 990, 120, 26);
        this.interactiu(700, 940, 90, DIALEGS.reixaDins, {
            altura: 120, actiu: () => !Estat.flag('reixaObertaDins'),
            enTancar: () => {
                this.obstacles.remove(this.colReixa, true, true);
                this.reixa.setAlpha(0.45);
                this.sortida(640, 986, 120, 14, 'ZonaCasaGran', 'porxo');
            }
        });
    }

    // ---- L'Home del Raïm i la rosa dels vents ----
    puzleRaim() {
        this.raimDir = 3;      // comença girat cap a ponent (el cap "girat enrere")
        const derrotat = Estat.flag('raimDerrotat');
        const desperta = Estat.flag('raimDesperta');

        // Rosa dels vents de pedra, a terra davant l'estàtua
        const cx = 700, cy = 560;
        const rosa = this.add.graphics().setDepth(-960);
        rosa.fillStyle(0x6a5a46, 0.55).fillEllipse(cx, cy, 160, 66);
        rosa.lineStyle(3, 0x2a1f18, 1).strokeEllipse(cx, cy, 160, 66);
        rosa.lineStyle(2, 0x2a1f18, 1).lineBetween(cx - 80, cy, cx + 80, cy).lineBetween(cx, cy - 33, cx, cy + 33);
        this.posRosa = [[cx, cy - 22], [cx + 56, cy], [cx, cy + 22], [cx - 56, cy]];
        [['N', cx, cy - 46], ['E', cx + 96, cy], ['S', cx, cy + 46], ['O', cx - 96, cy]].forEach(([t, x, y]) => {
            this.add.text(x, y, t, estilText(22, '#f2e6c8', { stroke: '#000', strokeThickness: 3, fontStyle: 'bold' })).setOrigin(0.5).setDepth(-955);
        });
        this.marcaRaim = this.add.circle(0, 0, 9, 0xffd34d).setStrokeStyle(2, 0x2a1f18).setDepth(-950);
        this.tweens.add({ targets: this.marcaRaim, scale: 1.4, yoyo: true, repeat: -1, duration: 500 });
        this.actualitzarRaim();
        this.interactiu(cx, cy + 40, 45, DIALEGS.rosaVents, { altura: 60, actiu: () => !Estat.flag('raimDesperta') });

        // L'estàtua (o, si ja ha estat vençuda, un munt de pedres)
        this.estatua = null;
        if (derrotat) {
            this.runes();
        } else {
            this.estatua = this.posar('home_raim', 700, 470);
            this.colEstatua = this.colisio(700, 461, 46, 18);
        }
        // Prémer el raïm de marbre: confirma la direcció
        this.interactiu(700, 478, 55, E => {
            const d = DIALEGS.homeRaimInt(E);
            return d || this.confirmarRaim();
        }, {
            altura: 190, actiu: () => !Estat.flag('raimDesperta') || Estat.flag('raimDerrotat'),
            enTancar: () => { if (this.volDespertar) { this.volDespertar = false; this.despertarRaim(); } }
        });
        // Forat quadrat de la base: aquí s'encaixa la palanca
        if (!derrotat) this.add.rectangle(618, 500, 26, 22, 0x1a1410).setStrokeStyle(3, 0x8a7a5e).setDepth(500);
        this.interactiu(618, 505, 50, E => {
            if (!E.te('palanca')) return { pagines: [{ qui: '', text: "Un forat quadrat a la base de l'estàtua, com per encaixar-hi una palanca." }] };
            this.raimDir = (this.raimDir + 1) % 4;
            this.actualitzarRaim();
            return { pagines: [{ qui: '', text: "Encaixes la palanca i la gires un quart de volta. A dalt, el cap de pedra grinyola i mira " + NOMS_DIR[this.raimDir] + "." }] };
        }, { altura: 90, actiu: () => !Estat.flag('raimDesperta') });

        // Trapa de la cripta, a sota de l'escalinata, un cop vençut el guardià
        this.trapa = this.add.graphics().setDepth(-958);
        this.trapa.fillStyle(0x0a0705, 1).fillRect(650, 616, 100, 46).lineStyle(4, 0x8a7a5e, 1).strokeRect(650, 616, 100, 46);
        this.trapa.fillStyle(0x3a2c22, 1).fillRect(654, 624, 92, 8).fillRect(654, 640, 92, 8);
        this.trapa.setVisible(derrotat);
        this.interactiu(700, 670, 75, DIALEGS.trapaCripta, {
            altura: 60, actiu: () => Estat.flag('raimDerrotat'),
            enTancar: () => this.canviarZona('ZonaCasaCripta', 'porta')
        });

        // Si el guardià ja estava despert (has sortit i tornat), segueix aquí
        if (desperta && !derrotat) this.despertarRaim(true);
    }

    runes() {
        [[670, 468], [730, 472], [700, 458]].forEach(([x, y]) => this.posar('roca', x, y, { col: { w: 50, h: 20 } }));
        this.raimDir = 1;
        this.actualitzarRaim();
    }

    actualitzarRaim() {
        const p = this.posRosa[this.raimDir];
        this.marcaRaim.setPosition(p[0], p[1]);
    }

    confirmarRaim() {
        if (this.raimDir !== 1) {
            return { pagines: [{ qui: '', text: "Prems el raïm de marbre, però no passa res: el cap de pedra no mira bé." }] };
        }
        if (!this.teArma()) return DIALEGS.raimSenseArma;
        this.volDespertar = true;
        return DIALEGS.raimDesperta;
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
        this.sala(1000, 700, 500, 0x7a7068);
        this.posar('altar', 500, 300, { col: { w: 140, h: 36 } });
        this.interactiu(500, 335, 90, DIALEGS.cofreCripta, { altura: 100 });
        this.espelmes([[360, 290], [640, 290]]);
        this.add.rectangle(500, 350, 1000, 700, 0x100820, 0.2).setDepth(80100);
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
        const murs = this.add.graphics().setDepth(-1000);
        murs.fillStyle(0x2a1f18, 1).fillRect(160, 0, 40, 1400).fillRect(600, 0, 40, 1400).fillRect(200, 0, 400, 90);
        this.colisio(100, 700, 200, 1400);
        this.colisio(700, 700, 200, 1400);
        this.colisio(270, 60, 140, 120);
        this.colisio(530, 60, 140, 120);
        this.colisio(270, 1395, 140, 30);
        this.colisio(530, 1395, 140, 30);

        this.espelmes([[230, 1250], [570, 1250], [230, 820], [570, 820], [230, 360], [570, 360]]);

        // Un mur d'esbarzers negres a mig passadís: només es talla amb Runna
        [240, 320, 400, 480, 560].forEach((x, i) => this.esbarzer(x, 740, 'passadis' + i));

        // Els animalets del cementiri esquerdat, abans i després del mur
        if (!Estat.flag('passadisNet')) {
            [[330, 1150], [470, 1000], [350, 880], [440, 520], [340, 330]].forEach(([x, y]) => this.enemic('escolopendra', x, y));
        }

        this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x000018, 0.32).setScrollFactor(0).setDepth(80000);
        this.sortida(340, 1386, 120, 14, 'ZonaPingpong', 'passadis');
        this.sortida(340, 92, 120, 40, 'ZonaCasaTresor', 'porta');
    }

    actualitzar() {
        if (Estat.flag('passadisNet')) return;
        if (this.enemics.every(e => e.mort) && this.esbarzers.every(o => !o.viu)) Estat.posaFlag('passadisNet');
    }
}

// ---------------- LA CAMBRA SECRETA (sala del tresor) ----------------
class ZonaCasaTresor extends ZonaCasaBase {
    constructor() {
        super('ZonaCasaTresor', {
            nom: 'Cambra secreta',
            amplada: 1000,
            alcada: 700,
            colorFons: '#0a0806',
            pacifica: true,
            entrades: { porta: { x: 500, y: 620, dir: 'amunt' }, escala: { x: 850, y: 330, dir: 'esquerra' } }
        });
    }

    construir() {
        this.sala(1000, 700, 500, 0x8a7a68);
        // Botes dels monjos, a les parets
        [[190, 170], [190, 250], [250, 170], [810, 170], [810, 250], [750, 170], [200, 520], [800, 520]].forEach(([x, y]) => {
            const b = this.add.graphics().setDepth(y);
            b.fillStyle(0x6a4424, 1).fillEllipse(x, y + 4, 56, 18).fillRect(x - 28, y - 40, 56, 44).fillEllipse(x, y - 40, 56, 18);
            b.lineStyle(3, 0x2a1a0c, 1).strokeEllipse(x, y - 40, 56, 18).lineBetween(x - 28, y - 40, x - 28, y + 4).lineBetween(x + 28, y - 40, x + 28, y + 4);
            b.fillStyle(0x3a3a40, 1).fillRect(x - 28, y - 26, 56, 5).fillRect(x - 28, y - 8, 56, 5);
            this.colisio(x, y - 6, 52, 18);
        });
        // El cofre dels monjos, entre dues espelmes
        this.posar('cofre', 500, 250, { col: { w: 50, h: 20 } });
        this.interactiu(500, 255, 85, DIALEGS.cofreCambra, { altura: 80, enTancar: () => this.obrirPorta() });
        this.espelmes([[400, 260], [600, 260]]);

        // La porta cap a l'escalinata (a la paret de la dreta): només s'obre quan s'ha agafat el tresor
        this.portaEscala = this.porta(925, 330, 20, 110);
        this.obrirPorta(Estat.flag('cofreCambra'));
        this.add.rectangle(500, 350, 1000, 700, 0xffd38a, 0.05).setDepth(80000);
        this.sortida(440, 686, 120, 14, 'ZonaPassadis', 'tresor');
    }

    obrirPorta(ja = true) {
        if (!ja || !Estat.flag('cofreCambra') || this.portaOberta) return;
        this.portaOberta = true;
        this.portaEscala.setFillStyle(0x1a1008);
        this.sortides.push({ r: new Phaser.Geom.Rectangle(896, 280, 20, 100), desti: 'ZonaCasaGranInt', entrada: 'secreta' });
        this.marcarSortida(new Phaser.Geom.Rectangle(896, 280, 20, 100));
    }
}

// ---------------- LES GOLFES DEL SANTUARI (rellotge i campanes) ----------------
// El rellotge és aturat a les tres i quart (l'hora que va arribar la boira) i les campanes són mudes. Puzle: posar tres engranatges
// a la mida correcta i, amb el rellotge en marxa, tocar el Cant de l'Aurora davant les campanes.
const GOLFES_SOLUCIO = [0, 2, 1];      // 0 petit, 1 mitjà, 2 gran: «el petit va primer, el gran al mig i el mitjà darrere»
const GOLFES_RADI = [24, 34, 44];
const GOLFES_NOM = ['petit', 'mitjà', 'gran'];

Object.assign(DIALEGS, {
    golfesRellotge: E => ({ pagines: E.flag('rellotgeReparat') ? [
        { qui: '', text: "El rellotge gran del Santuari torna a caminar. Es poden sentir el tic-tac i el soroll tranquil dels engranatges." }
    ] : [
        { qui: '', text: "El rellotge del Santuari, aturat a les tres i quart. Fa tres nits que no es mou: va ser quan va arribar la boira." },
        { qui: 'Ineu', text: "Sota l'esfera hi ha tres engranatges fora de lloc. Si els poso a la mida que toca... Deu haver-hi alguna nota d'un campaner." }
    ] }),

    golfesNota: E => ({ pagines: [
        { qui: '', text: "Una nota de fusta clavada a una biga, amb lletra de campaner:" },
        { qui: 'Nota del campaner', text: "«El rellotge només camina si els engranatges hi van en ordre: el petit primer, el gran al mig i el mitjà darrere. I les tres campanes, que són els tres sons del primer cant, no sonen si el rellotge és mut.»" }
    ] }),

    golfesCampanes: E => ({ pagines: E.flag('campanesRepicades') ? [
        { qui: '', text: "Les tres campanes pengen en silenci, netes i quietes. Han sonat." }
    ] : E.flag('rellotgeReparat') ? [
        { qui: '', text: "Tres campanes de bronze, penjades d'una biga: una de petita, una de mitjana i una de gran. Estan afinades: fan les notes 1, 2 i 3." },
        { qui: 'Ineu', text: "Amb el rellotge en marxa, potser el Cant de l'Aurora les farà sonar. (Flauta: 1-2-3.)" }
    ] : [
        { qui: '', text: "Tres campanes de bronze, mudes. Per més que les toques, no fan so: com si la boira se'ls hagués menjat el so." },
        { qui: 'Ineu', text: "Primer cal arreglar el rellotge que les governa." }
    ] }),

    golfesCampanesSonen: {
        pagines: [
            { qui: '', text: "El Cant de l'Aurora puja entre les bigues. Les tres campanes responen, una a una, i el so s'escampa per sobre del Santuari: DONG, DONG, DONG." },
            { qui: '', text: "A baix, a la nau, l'orgue sona un instant tot sol. La boira recula per les finestres, com si algú hagués obert una porta." },
            { qui: '', text: "Has trobat, a la caixa de les campanes, un flascó de líquid daurat.\n+1 COR MÀXIM i vida plena." }
        ]
    }
});

class ZonaGolfes extends ZonaCasaBase {
    constructor() {
        super('ZonaGolfes', {
            nom: 'Golfes del Santuari',
            amplada: 1000,
            alcada: 700,
            colorFons: '#0a0806',
            pacifica: true,
            entrades: { porta: { x: 500, y: 620, dir: 'amunt' } }
        });
    }

    construir() {
        this.sala(1000, 700, 500, 0x8a6a48);
        // Bigues i teulada de fusta
        const bigues = this.add.graphics().setDepth(-990);
        bigues.lineStyle(10, 0x3a2412, 1);
        for (let x = 200; x <= 800; x += 120) bigues.lineBetween(x, 80, x, 150);
        bigues.lineBetween(130, 150, 870, 150);

        // El rellotge gran, a la paret del fons: aturat a les 3:15 fins que s'arregla
        const cara = this.add.graphics().setDepth(-900);
        cara.fillStyle(0x3a2412, 1).fillCircle(500, 215, 108);
        cara.fillStyle(0xe8dcc0, 1).fillCircle(500, 215, 96);
        cara.lineStyle(3, 0x3a2412, 1).strokeCircle(500, 215, 96);
        for (let i = 0; i < 12; i++) {
            const a = i * Math.PI / 6;
            cara.lineStyle(i % 3 === 0 ? 6 : 3, 0x3a2412, 1).lineBetween(500 + Math.sin(a) * 78, 215 - Math.cos(a) * 78, 500 + Math.sin(a) * 90, 215 - Math.cos(a) * 90);
        }
        this.agullaMinuts = this.add.graphics({ x: 500, y: 215 }).setDepth(-880);
        this.agullaMinuts.lineStyle(6, 0x2a1608, 1).lineBetween(0, 0, 0, -76);
        this.agullaHores = this.add.graphics({ x: 500, y: 215 }).setDepth(-879);
        this.agullaHores.lineStyle(9, 0x2a1608, 1).lineBetween(0, 0, 0, -50);
        this.agullaMinuts.rotation = Math.PI / 2;           // 3:15
        this.agullaHores.rotation = Math.PI / 2 + 0.13;
        this.interactiu(500, 330, 70, DIALEGS.golfesRellotge, { altura: 170 });

        // Mecanisme: tres engranatges sota el rellotge (cada interacció els fa girar de mida)
        this.reparat = Estat.flag('rellotgeReparat');
        this.mides = this.reparat ? GOLFES_SOLUCIO.slice() : [2, 2, 2];
        this.engranatges = [0, 1, 2].map(i => this.add.graphics().setDepth(-870));
        [330, 500, 670].forEach((x, i) => {
            this.dibuixaEngranatge(i);
            this.interactiu(x, 395, 52, () => this.girarEngranatge(i), { altura: 90, actiu: () => !this.reparat });
        });
        this.add.rectangle(500, 340, 420, 14, 0x3a2412).setDepth(-880);

        // Nota del campaner (la pista del puzle), clavada a una biga de l'esquerra
        this.posar('pergami', 190, 340, { fonsY: 340 });
        this.interactiu(190, 360, 70, DIALEGS.golfesNota, { altura: 70 });

        // Les tres campanes (petita, mitjana i gran), penjades d'una biga davant
        this.campanes = [0, 1, 2].map(i => {
            const x = 380 + i * 120, h = 56 + i * 12, amplada = 40 + i * 12;
            const c = this.add.graphics({ x, y: 430 }).setDepth(480);
            c.fillStyle(0xb58a3a, 1).lineStyle(3, 0x2a1608, 1);
            const w2 = amplada / 2;                      // contorn de la campana (Graphics no té corbes: es fa amb punts)
            const punts = [[-w2, h], [-w2 * 0.92, h * 0.6], [-w2 * 0.7, h * 0.28], [-w2 * 0.35, 6], [0, 0], [w2 * 0.35, 6], [w2 * 0.7, h * 0.28], [w2 * 0.92, h * 0.6], [w2, h]].map(([px, py]) => new Phaser.Geom.Point(px, py));
            c.fillPoints(punts, true); c.strokePoints(punts, true);
            c.fillStyle(0x6a4a18, 1).fillCircle(0, h + 4, 5);
            return c;
        });
        const beta = this.add.graphics().setDepth(470);
        beta.fillStyle(0x3a2412, 1).fillRect(330, 418, 340, 14);
        this.colisio(500, 440, 360, 24);
        this.interactiu(500, 505, 90, DIALEGS.golfesCampanes, { altura: 120 });
        this.llocFlauta('campanes', 500, 520, 230, false);

        this.espelmes([[230, 560], [770, 560]]);
        this.add.rectangle(500, 350, 1000, 700, 0xffd38a, 0.05).setDepth(80000);
        this.sortida(440, 686, 120, 14, 'ZonaTorre', 'dalt');
        if (this.reparat) this.agullaMinuts.rotation = 0;
    }

    dibuixaEngranatge(i) {
        const g = this.engranatges[i], x = 330 + i * 170, r = GOLFES_RADI[this.mides[i]];
        g.clear();
        g.fillStyle(0xb5a273, 1).lineStyle(3, 0x2a1608, 1);
        const dents = 10 + this.mides[i] * 3;
        g.beginPath();
        for (let k = 0; k < dents * 2; k++) {
            const a = k * Math.PI / dents, rr = k % 2 ? r : r + 7;
            const px = x + Math.cos(a) * rr, py = 340 + Math.sin(a) * rr;
            k ? g.lineTo(px, py) : g.moveTo(px, py);
        }
        g.closePath(); g.fillPath(); g.strokePath();
        g.fillStyle(0x3a2412, 1).fillCircle(x, 340, 6);
    }

    girarEngranatge(i) {
        this.mides[i] = (this.mides[i] + 1) % 3;
        this.dibuixaEngranatge(i);
        const bé = this.mides.every((m, k) => m === GOLFES_SOLUCIO[k]);
        if (!bé) return { pagines: [{ qui: '', text: "Gires l'engranatge i encaixa un altre cop. Ara és " + GOLFES_NOM[this.mides[i]] + "." }] };
        return {
            pagines: [
                { qui: '', text: "Els tres engranatges encaixen en ordre: petit, gran i mitjà. Una cosa dins la paret fa clac." },
                { qui: '', text: "L'agulla dels minuts es mou. El rellotge del Santuari torna a caminar, tic-tac, tic-tac." }
            ],
            enAcabar: () => { this.reparat = true; Estat.posaFlag('rellotgeReparat'); this.cameras.main.shake(300, 0.003); Estat.desar(); }
        };
    }

    // Cant de l'Aurora davant les campanes: amb el rellotge en marxa, sonen
    enMelodia(nom) {
        if (nom !== 'aurora') return false;
        if (Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, 500, 520) > 280) return false;
        if (!this.reparat) { this.flotant(500, 440, 'Les campanes no ressonen: el rellotge és aturat', '#d8c8ff'); return true; }
        if (Estat.flag('campanesRepicades')) { this.flotant(500, 440, 'Les campanes ja han sonat', '#d8c8ff'); return true; }
        this.repicar();
        return true;
    }

    repicar() {
        Estat.posaFlag('campanesRepicades');
        [0, 1, 2].forEach(i => this.time.delayedCall(i * 600, () => {
            this.so(i + 1);
            this.tweens.add({ targets: this.campanes[i], rotation: { from: -0.3, to: 0.3 }, yoyo: true, repeat: 3, duration: 180 });
        }));
        this.time.delayedCall(2400, () => this.ui().obrirDialeg(DIALEGS.golfesCampanesSonen, () => {
            const E = Estat;
            E.dades.corsMax += 1; E.dades.vida = E.dades.corsMax * 2;
            this.ui().actualitzarHUD();
            E.desar();
        }));
    }

    so(n) {
        const ctx = this.sound && this.sound.context;
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = [0, 262, 330, 392][n];
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);
        o.connect(g); g.connect(ctx.destination);
        o.start(); o.stop(ctx.currentTime + 1.9);
    }

    actualitzar(ara, delta) {
        if (!this.reparat) return;
        this.agullaMinuts.rotation += delta * 0.0006;
        this.agullaHores.rotation += delta * 0.00005;
    }
}
