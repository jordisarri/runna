/**
 * LA CASA GRAN (masmorra): l'Escalinata i una petita cripta.
 *   Entrades: la reixa del porxo d'arcs (plaça) · la porta de servei (costat de la Taverna) · la porta secreta
 *             de la Sala del Ping-pong (darrere la roda de carruatge). Totes tres donen a l'Escalinata i demanen el Clauer.
 *   Escalinata: l'Home del Raïm. Amb la Palanca (la dóna en Jordi de la Caseta) es gira el cap cap a llevant i es prem el raïm:
 *               l'estàtua cobra vida (BOSS). Derrotada, s'obre la trapa de la cripta.
 *   Cripta: les relíquies robades als monjos (cal portar-les a la tomba esquerdada del Cementiri) i la Clau del Celler Vell,
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
            { qui: 'Ineu', text: "Les relíquies dels monjos del segle XV! Els obrers les van robar quan van profanar el cementiri, i algú les va amagar aquí. Aquesta és l'esquerda del segell." },
            { qui: '', text: "Penjada d'un clau, una gran clau de ferro negre, i un paper: «Qui vulgui entrar on mai no s'ha d'entrar, que passi per sota la Taverna.»" },
            { qui: '', text: "Has obtingut les RELÍQUIES DELS MONJOS i la CLAU DEL CELLER VELL." }
        ],
        enAcabar: () => {
            E.dona('reliquies_monjos'); E.dona('clau_celler_vell'); E.posaFlag('relTretes'); E.posaFlag('clauCellerVell');
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
                { qui: '', text: "(Les relíquies robades són a la Casa Gran. Quan les portis aquí, l'esquerda es tancarà.)" }
            ],
            enAcabar: () => E.posaFlag('tombaVista')
        };
    },

    // En Jordi de la Caseta, rere el Til·ler
    jordiCaseta: E => {
        if (E.te('palanca') || E.flag('palanca')) {
            return { pagines: [{ qui: 'Jordi', text: "Fes-ne bon ús, monjo! I vigila, que les coses de pedra no sempre s'estan quietes." }] };
        }
        return {
            pagines: [
                { qui: 'Jordi', text: "Ei, monjo! Em dic Jordi, el de la Caseta. Conec cada drecera del Miracle, i les eines, encara millor." },
                { qui: 'Ineu', text: "Jordi, a la Casa Gran hi ha un Home del Raïm amb un forat a la base. Necessito una palanca." },
                { qui: 'Jordi', text: "Una palanca! Aquí en tinc una de ferro, de les bones. Per moure roques, per obrir reixes... i, si cal, per girar el cap a una estàtua tossuda. Agafa-la." },
                { qui: '', text: "Has obtingut la PALANCA." }
            ],
            enAcabar: () => {
                E.dona('palanca'); E.posaFlag('palanca');
                E.posaObjectiu("Porta la palanca a l'Home del Raïm, al mig de l'escalinata de la Casa Gran.");
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
                costat:  { x: 1215, y: 740, dir: 'esquerra' },
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
            esc.fillStyle(i % 2 ? 0xb8a98c : 0xc9ba9d, 1).fillRect(700 - ample / 2, y, ample, 44);
            esc.lineStyle(2, 0x8a7a5e, 1).strokeRect(700 - ample / 2, y, ample, 44);
        }
        esc.fillStyle(0x7a2a2a, 1).fillRect(676, 204, 48, 440);   // catifa vermella
        this.colisio(450, 400, 24, 430);
        this.colisio(950, 400, 24, 430);

        // Portes: servei (dreta, cap a fora) i camuflada (esquerra, cap al Ping-pong)
        this.porta(1285, 740, 20, 110);
        this.sortida(1286, 690, 14, 100, 'ZonaCasaGran', 'costat');
        this.porta(115, 740, 20, 110, 0x6a4a2c);
        this.sortida(116, 690, 14, 100, 'ZonaPingpong', 'secreta');

        this.espelmes([[330, 200], [1070, 200], [330, 760], [1070, 760]]);
        this.cartell(900, 880, DIALEGS.cartellCasaGran);
        this.sortida(640, 986, 120, 14, 'ZonaPlaca', 'porxo');

        this.puzleRaim();
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
        Estat.dades.monedes += 20;
        this.flotant(c.x, c.y - 60, '+20 ●', '#ffd34d');
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
