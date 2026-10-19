/**
 * LA CASA GRAN (masmorra): cinc sales.
 *   Entrades: la reixa del porxo d'arcs (plaça) -> Escalinata · la porta de servei (costat de la Taverna) -> Cuina ·
 *             la porta secreta de la Sala del Ping-pong (darrere la roda de carruatge) -> Escalinata.
 *   Escalinata: l'Home del Raïm (puzle del cap girat). Portes: Retrats (dalt), Celler (esquerra), Cuina (dreta, tancada per aquest costat).
 *   Retrats: puzle cronològic (cal la llanterna) -> clau de la Cuina i la pista de la combinació del Raïm.
 *   Cuina i Rebost: criats de boira; el Rebost és tancat per esbarzers negres (Foc de la Jaumeta) -> Palanca + Calze dels Monjos.
 *   Celler de les Botes: rates de boira i dues relíquies amagades dins de botes.
 *   Cripta dels Monjos: s'obre quan l'Home del Raïm ha girat el cap tres vegades bé. Boss: el Cellerer de Boira.
 * Les quatre relíquies es porten a la tomba esquerdada del Cementiri (flag relIquiesRetornades).
 */

// ---------------- DIÀLEGS DE LA CASA GRAN ----------------
const RELIQUIES = ['calze_monjos', 'creu_monjos', 'anell_monjos', 'breviari_monjos'];
const SEQ_RAIM = [1, 2, 1];                    // direccions (0 N, 1 E, 2 S, 3 O): llevant, migdia, llevant
const NOMS_DIR = ["cap al nord (cap a l'escala)", "cap a llevant (E)", "cap a migdia (S)", "cap a ponent (O)"];
const RETRATS = [
    { x: 340, nom: 'Gaspar Vilella', any: 1659, roba: 0x2a4a7a, text: 'Vinyater de Ríder. Va ampliar el celler.' },
    { x: 520, nom: 'Bernat Ríder', any: 1612, roba: 0x7a2a2a, text: 'El fundador. Va comprar les primeres vinyes.' },
    { x: 760, nom: 'Jaume Bonet', any: 1688, roba: 0x2a6a3a, text: 'Va tapiar la cripta. Mirada cobejosa.' },
    { x: 940, nom: 'Elisenda Ferrer', any: 1634, roba: 0x6a2a6a, text: 'Va pagar la segona església. Mirada severa.' }
];
const ORDRE_RETRATS = [1, 3, 0, 2];            // índexs de RETRATS, del més antic al més nou

Object.assign(DIALEGS, {
    portaServei: E => ({
        pagines: E.te('clauer') ? [
            { qui: '', text: "La porta de servei de la Casa Gran, a prop de la Taverna. Obres amb el clauer de novici: del fons puja olor de fum, de greix vell i de ferro." }
        ] : [
            { qui: '', text: "Una petita porta de servei, tancada amb clau. Fa olor de vi i de fusta humida." }
        ]
    }),

    portaCuinaEscalinata: E => ({
        pagines: (E.flag('cuinaOberta') || E.te('clau_cuina')) ? [
            { qui: '', text: "La porta de la cuina. Hi encaixes la clau que has trobat als Retrats: gira sense fer soroll." }
        ] : [
            { qui: '', text: "La porta que dóna a la cuina. És tancada amb clau per aquest costat. Algú ha clavat un paper: «La clau és amb els qui miren des de la paret.»" },
            { qui: 'Ineu', text: "Els qui miren des de la paret... Els retrats! Dalt de l'escalinata hi ha la Sala dels Retrats. (O, si trobo la porta de servei, hi puc entrar per l'altre costat.)" }
        ]
    }),

    portaRetrats: E => ({
        pagines: E.te('clauer') ? [
            { qui: '', text: "Dalt de l'escalinata, una porta de doble batent. El clauer de novici la fa cedir: davant teu s'estén la Sala dels Retrats." }
        ] : [
            { qui: '', text: "Dalt de l'escalinata, una porta de doble batent, tancada amb clau." }
        ]
    }),

    portaCeller: E => ({
        pagines: E.te('clauer') ? [
            { qui: '', text: "Una porta baixa, de ferro, sota el pas de l'escala. El clauer de novici l'obre. Un aire fred i dolç puja per l'escala: vi vell." }
        ] : [
            { qui: '', text: "Una porta baixa, de ferro, amb un pany antic. Del forat de la pany surt aire fred." }
        ]
    }),

    homeRaimInt: E => {
        if (E.flag('raimResolt')) {
            return { pagines: [{ qui: '', text: "L'Home del Raïm té el cap girat cap a llevant i el carràs de marbre buit. Als seus peus, la trapa de la cripta és oberta." }] };
        }
        if (!E.te('palanca')) {
            return {
                pagines: [
                    { qui: '', text: "Al mig de la gran escalinata, l'Home del Raïm: una escultura de pedra gairebé tan alta com dos homes, amb un carràs de raïm de marbre a les mans." },
                    { qui: 'Ineu', text: "Té el cap girat cap enrere, com si vigilés una cosa de sota l'escala. A la base hi ha un forat quadrat, com per una palanca..." },
                    { qui: 'Ineu', text: "I a terra, davant seu, una rosa dels vents de pedra. Algú volia que aquest cap girés a poc a poc." }
                ]
            };
        }
        return null;
    },

    retratsResolt: { pagines: [
        { qui: '', text: "Els quatre retrats s'ennuvolen alhora, com si respiressin, i giren els ulls cap a l'escriptori. Se sent un clic." },
        { qui: '', text: "El calaix s'obre. Dins hi ha una clau de ferro negre (LA CLAU DE LA CUINA) i un full amb lletra d'home de comptes:" },
        { qui: '', text: "«Tres cops cal que mire l'Home del Raïm: primer cap a on neix el sol, després cap a on és més alt, i que torni on neix. Posa'l ben bé i prem-li el raïm.»" },
        { qui: 'Ineu', text: "Llevant, migdia i llevant. E, S, E. Cal que me'n recordi (el full se'm queda a la butxaca)." }
    ] },

    escriptoriRetrats: E => E.flag('retratsResolts') ? {
        pagines: [{ qui: '', text: "El full del Cellerer, desat al calaix: «Tres cops cal que mire l'Home del Raïm: llevant (E), migdia (S) i llevant (E). Posa'l ben bé i prem-li el raïm.»" }]
    } : {
        pagines: [
            { qui: '', text: "Un escriptori amb un calaix amb quatre forats petits, en fila, com quatre dits que haguessin de prémer." },
            { qui: 'Ineu', text: "Els quatre retrats de la paret... Potser s'han de prémer en l'ordre en què aquesta gent va viure aquí. Amb la llanterna se'n veuen les plaques." }
        ]
    },

    rebostCofre: E => E.flag('rebostObert') ? {
        pagines: [{ qui: '', text: "El cofre del rebost, buit. Les cendres dels esbarzers encara són tèbies." }]
    } : {
        pagines: [
            { qui: '', text: "Entre sacs de farina vella, un cofre de ferro. No té pany: l'han tancat només amb esbarzers negres." },
            { qui: '', text: "A dins hi ha una palanca de ferro, llarga i pesada, amb una mica de rovell, i un calze petit d'argent, embolicat en un drap." },
            { qui: 'Ineu', text: "Aquest calze no és de cuina: té una creu gravada. Deu ser una relíquia dels monjos que va robar el Cellerer." },
            { qui: '', text: "Has obtingut la PALANCA i el CALZE DELS MONJOS." }
        ],
        enAcabar: () => {
            E.dona('palanca'); E.posaFlag('palanca'); E.dona('calze_monjos'); E.posaFlag('rebostObert');
            E.posaObjectiu("Porta la palanca a l'Home del Raïm, al mig de l'escalinata de la Casa Gran. (Pista: als Retrats hi ha una nota.)");
        }
    },

    esbarzersRebost: E => ({
        pagines: E.te('foc_jaumeta') ? [
            { qui: '', text: "Els esbarzers negres tapen l'entrada del rebost. Amb el Foc de la Jaumeta (tecla F) els faràs cendra." }
        ] : [
            { qui: '', text: "Uns esbarzers negres, espessos i brillants, tapen l'entrada del rebost. Ni el bastó ni les tisores hi poden: se't reten les mans." },
            { qui: 'Ineu', text: "Només el foc els faria res. La Jaumeta, del bosc, en sap, de fer foc amb els dits." }
        ]
    }),

    cartellCuina: E => ({ pagines: [{ qui: '', text: "«Cuina. Prohibit entrar als nens, als gats i al Cellerer en dejú.»\nUn altre cartell, més nou: «Els criats no paren de fer el mateix. No els parlis: no et sentiran.»" }] }),

    barrilCeller: n => E => ({
        pagines: [{ qui: '', text: [
            "Una bota buida. Dins, només una aranya vella i el seu somni de vi.",
            "Una bota plena de vinagre. Fa tanta olor que et plora un ull.",
            "Una bota amb una etiqueta: «1649, per a Ríder». Quin tresor... per als qui els agradi el vinagre.",
            "Una bota esfondrada, amb un nus de cadenes a dins. Res més.",
            "Una bota tancada. Hi has picat i ha respost un eco molt llarg."
        ][n % 5] }]
    }),

    barrilCreu: E => E.flag('creuMonjos') ? { pagines: [{ qui: '', text: "La bota on hi havia la creu, buida." }] } : {
        pagines: [
            { qui: '', text: "Aquesta bota sona diferent. Hi ha un doble fons, forçat amb ganivet fa temps." },
            { qui: '', text: "Entre palla enganxosa, una creu de fusta i plata, petita, amb una inscripció: «Per als qui tanquen la porta.»" },
            { qui: '', text: "Has obtingut la CREU DELS MONJOS." }
        ],
        enAcabar: () => { E.dona('creu_monjos'); E.posaFlag('creuMonjos'); }
    },

    barrilAnell: E => E.flag('anellMonjos') ? { pagines: [{ qui: '', text: "La bota de l'anell, buida." }] } : {
        pagines: [
            { qui: '', text: "Una bota amb un bony a la tapa. Quan la mous, alguna cosa petita fa «clinc» a dins." },
            { qui: '', text: "Dins la palla, un anell de plata gruixut, amb el segell d'un monjo. Té una gota d'ambre mig oculta." },
            { qui: '', text: "Has obtingut l'ANELL DELS MONJOS." }
        ],
        enAcabar: () => { E.dona('anell_monjos'); E.posaFlag('anellMonjos'); }
    },

    trapaCripta: E => ({
        pagines: [{ qui: '', text: "La trapa de pedra, oberta sota l'Home del Raïm. Una escala estreta baixa a la foscor, i de dins puja un ressò de cadenes." }]
    }),

    criptaAvis: E => ({
        pagines: [
            { qui: '', text: "Al fons de la cripta, entre sarcòfags buits, es mou una cosa enorme: un gegant fet de botes, cadenes i boira, amb la mirada fixa en tu." },
            { qui: 'Cellerer de Boira', text: "Això... és... MEU. Les copes. Les creus. TOT. Ningú no se les endurà." },
            ...(Estat.flag('combatActiu') ? [] : [{ qui: 'Ineu', text: "Sense el bastó no el podré aturar. Hauria de tornar quan l'hagi aconseguit (el Til·ler en dóna un)." }])
        ]
    }),

    cellererDerrotat: E => ({
        pagines: [
            { qui: '', text: "El Cellerer de Boira es desfà com un barril que es desplomés: botes, cadenes i, al final, un fum lila que s'escola per les juntes de la pedra." },
            { qui: 'Cellerer', text: "Les... meves... relíquies... No eren meves, oi? Perdó... diguin als monjos... que perdó." },
            { qui: '', text: "On era, ara hi ha un cofre petit, obert. Una cosa antiga, vermella i or, reposa dins." },
            { qui: '', text: "Notes com el cor se't fa més ample. +1 COR MÀXIM i vida plena." }
        ]
    }),

    cofreCripta: E => E.flag('breviariMonjos') ? { pagines: [{ qui: '', text: "El cofre de la cripta, buit i tranquil." }] } : {
        pagines: [
            { qui: '', text: "Dins el cofre hi ha un breviari de cuir vermell, amb lletres daurades i un marcador de seda. És el BREVIARI DELS MONJOS." },
            { qui: 'Ineu', text: "Ja les tinc totes quatre: el calze, la creu, l'anell i el breviari. Les he de portar al Cementiri, a la tomba esquerdada dels monjos primers." }
        ],
        enAcabar: () => {
            E.dona('breviari_monjos'); E.posaFlag('breviariMonjos');
            E.posaObjectiu("Porta les quatre relíquies a la tomba esquerdada del Cementiri (darrere el Santuari i el Monestir).");
        }
    },

    // La tomba del Cementiri: amb les quatre relíquies, l'esquerda es tanca
    tombaMonjos: E => {
        if (E.flag('relIquiesRetornades')) {
            return { pagines: [{ qui: '', text: "La llosa de la tomba dels monjos primers, tancada de nou. Les relíquies reposen a sota, i només un fil de llum tèbia surt de l'esquerda." }] };
        }
        if (RELIQUIES.every(r => E.te(r))) {
            return {
                pagines: [
                    { qui: '', text: "Davant la llosa esquerdada, l'Ineu posa a terra, una a una, el calze, la creu, l'anell i el breviari." },
                    { qui: '', text: "La boira lila s'atura, com si algú hagués deixat de respirar. L'esquerda es tanca amb un so de pedra que es perdona." },
                    { qui: 'Ineu', text: "Ja podeu descansar, germans." },
                    { qui: '', text: "(La boira del cementiri s'afebleix. Per desgràcia, el segell més gran continua trencat: l'Ocellaire encara és sota la Taverna.)" }
                ],
                enAcabar: () => {
                    RELIQUIES.forEach(r => E.treu(r));
                    E.posaFlag('relIquiesRetornades');
                    E.posaObjectiu("Troba la manera d'arribar a la Sala de les Gírgoles, sota la Taverna. (Clau del Celler Vell.)");
                }
            };
        }
        const n = RELIQUIES.filter(r => E.te(r)).length;
        return {
            pagines: [
                { qui: '', text: "Una gran llosa esquerdada al mig del replà, amb lletres antigues gairebé esborrades: «Ací reposen els qui van tancar la porta.»" },
                { qui: '', text: "De l'esquerda surt una boira lila, freda, que sembla respirar. Al seu voltant, la terra és plena d'animalets que no haurien de sortir." },
                { qui: 'Ineu', text: "Aquí és, doncs, el cementiri vell dels monjos del segle XV. L'esquerda del segell... Si algú els tornés el que els van prendre..." },
                { qui: '', text: n ? "(Portes " + n + " de 4 relíquies. Encara en falten: la Casa Gran n'amaga més.)" : "(Les relíquies robades són a la Casa Gran. Quan les portis aquí, l'esquerda es tancarà.)" }
            ],
            enAcabar: () => E.posaFlag('tombaVista')
        };
    }
});

// ---------------- BOSS: EL CELLERER DE BOIRA ----------------
ENEMICS.cellerer = {
    tex: 'pastor_boira', vida: 14, vel: 300, mal: 1, radi: 30, cos: [52, 26], ombra: 0.6,
    monedes: [1, 20, 20], cor: 0, robust: true,
    perill: e => e.estat === 'carrega',
    ia(z, e, ara) {
        const jo = z.ineu.body.center, c = e.spr.body.center;
        const dist = Phaser.Math.Distance.Between(c.x, c.y, jo.x, jo.y);
        const fase2 = e.vida <= 7;
        if (!e.proxCrida) { e.proxCrida = ara + 3000; e.proxCarrega = ara + 3500; }
        const cap = Math.atan2(jo.y - c.y, jo.x - c.x);
        if (e.estat === 'apunta') {
            e.spr.body.setVelocity(0);
            if (ara > e.fins) { e.estat = 'carrega'; e.fins = ara + 360; e.spr.clearTint(); e.spr.body.setVelocity(Math.cos(e.ang) * this.vel, Math.sin(e.ang) * this.vel); }
        } else if (e.estat === 'carrega') {
            if (ara > e.fins) { e.estat = 'cansat'; e.fins = ara + (fase2 ? 750 : 1150); e.spr.body.setVelocity(0); e.proxCarrega = ara + (fase2 ? 2300 : 3500); }
        } else if (e.estat === 'cansat') {
            e.spr.body.setVelocity(0);
            if (ara > e.fins) e.estat = 'camina';
        } else {
            e.estat = 'camina';
            const v = dist > 130 ? 46 : 0;
            e.spr.body.setVelocity(Math.cos(cap) * v, Math.sin(cap) * v);
            e.spr.setFlipX(Math.cos(cap) < 0);
            if (ara > e.proxCrida) {
                e.proxCrida = ara + (fase2 ? 4500 : 7000);
                const vius = z.enemics.filter(x => x.tipus === 'escolopendra' && !x.mort).length;
                if (vius < 3) {
                    z.flotant(c.x, c.y - 120, 'Les meves... botes!', '#e0a0ff');
                    [-1, 1].forEach(s => { const o = z.enemic('escolopendra', c.x + s * 140, c.y + 70); if (o) { z.boiraPuf(o.spr.x, o.spr.y); o.fins = ara + 800; } });
                }
            } else if (ara > e.proxCarrega && dist < 460) {
                e.estat = 'apunta'; e.fins = ara + (fase2 ? 480 : 720); e.ang = cap;
                e.spr.setTint(0xff8080);
            }
        }
    },
    alDerrotar(z, e) { z.cellererDerrotat(e); }
};

// ---------------- BASE DE LES SALES ----------------
class ZonaCasaBase extends ZonaBase {
    // Sala amb terra de marbre, murs i, si portaX no és null, una obertura de 120 al mig de la paret de sota
    sala(amp, alt, portaX, tint = 0xcfc2b0) {
        this.terra('rajola', 130, 80, amp - 260, alt - 80, -1100).setTint(tint);
        const murs = this.add.graphics().setDepth(-1000);
        murs.fillStyle(0x2a1f18, 1).fillRect(90, 0, 40, alt).fillRect(amp - 130, 0, 40, alt);
        murs.fillStyle(0x3a2c22, 1).fillRect(130, 0, amp - 260, 90);
        this.colisio(50, alt / 2, 80, alt);
        this.colisio(amp - 50, alt / 2, 80, alt);
        this.colisio(amp / 2, 80, amp - 260, 160);
        if (portaX === null) {
            this.colisio(amp / 2, alt - 10, amp, 20);
        } else {
            this.colisio((portaX - 60) / 2, alt - 10, portaX - 60, 20);
            this.colisio((portaX + 60 + amp) / 2, alt - 10, amp - portaX - 60, 20);
        }
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

// ---------------- 1. L'ESCALINATA ----------------
class ZonaCasaGranInt extends ZonaCasaBase {
    constructor() {
        super('ZonaCasaGranInt', {
            nom: 'La Casa Gran · Escalinata',
            amplada: 1400,
            alcada: 1000,
            colorFons: '#120c08',
            pacifica: true,
            entrades: {
                porxo:   { x: 700,  y: 930, dir: 'amunt' },
                costat:  { x: 1215, y: 740, dir: 'esquerra' },
                secreta: { x: 170,  y: 740, dir: 'dreta' },
                retrats: { x: 700,  y: 250, dir: 'avall' },
                celler:  { x: 250,  y: 410, dir: 'avall' },
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

        // Portes: dalt (Retrats), esquerra (Celler), dreta (Cuina), camuflada a baix a l'esquerra (Ping-pong)
        this.porta(700, 150, 90, 120);
        this.interactiu(700, 215, 90, DIALEGS.portaRetrats, {
            altura: 120, enTancar: () => { if (Estat.te('clauer')) this.canviarZona('ZonaCasaRetrats', 'porta'); }
        });
        this.porta(250, 330, 80, 110);
        this.interactiu(250, 400, 90, DIALEGS.portaCeller, {
            altura: 120, enTancar: () => { if (Estat.te('clauer')) this.canviarZona('ZonaCasaCeller', 'porta'); }
        });
        this.porta(1285, 740, 20, 110);
        this.interactiu(1235, 740, 70, DIALEGS.portaCuinaEscalinata, {
            altura: 100,
            enTancar: () => { if (Estat.flag('cuinaOberta') || Estat.te('clau_cuina')) { Estat.posaFlag('cuinaOberta'); this.canviarZona('ZonaCasaCuina', 'escalinata'); } }
        });
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
        this.raimPas = 0;
        const resolt = Estat.flag('raimResolt');

        // Rosa dels vents de pedra, a terra davant l'estàtua
        const cx = 700, cy = 560;
        const rosa = this.add.graphics().setDepth(-960);
        rosa.fillStyle(0x6a5a46, 0.55).fillEllipse(cx, cy, 160, 66);
        rosa.lineStyle(3, 0x2a1f18, 1).strokeEllipse(cx, cy, 160, 66);
        rosa.lineStyle(2, 0x2a1f18, 1).lineBetween(cx - 80, cy, cx + 80, cy).lineBetween(cx, cy - 33, cx, cy + 33);
        this.posRosa = [[cx, cy - 22], [cx + 56, cy], [cx, cy + 22], [cx - 56, cy]];
        [['N', cx, cy - 46], ['E', cx + 96, cy], ['S', cx, cy + 46], ['O', cx - 96, cy]].forEach(([t, x, y]) => {
            this.add.text(x, y, t, estilText(16, '#f2e6c8', { stroke: '#000', strokeThickness: 3, fontStyle: 'bold' })).setOrigin(0.5).setDepth(-955);
        });
        this.marcaRaim = this.add.circle(0, 0, 9, 0xffd34d).setStrokeStyle(2, 0x2a1f18).setDepth(-950);
        this.tweens.add({ targets: this.marcaRaim, scale: 1.4, yoyo: true, repeat: -1, duration: 500 });
        this.puntsRaim = [0, 1, 2].map(i => this.add.circle(cx - 24 + i * 24, cy + 74, 7, 0x2a1f18).setStrokeStyle(2, 0xc9b48a).setDepth(-950));
        this.actualitzarRaim();

        // L'Home del Raïm
        this.posar('home_raim', 700, 470, { col: { w: 46, h: 18 } });
        // Prémer el raïm de marbre: confirma la direcció
        this.interactiu(700, 478, 55, E => {
            const d = DIALEGS.homeRaimInt(E);
            if (d) return d;
            return this.confirmarRaim();
        }, { altura: 190 });
        // Forat quadrat de la base: aquí s'encaixa la palanca
        this.add.rectangle(618, 500, 26, 22, 0x1a1410).setStrokeStyle(3, 0x8a7a5e).setDepth(500);
        this.interactiu(618, 505, 50, E => {
            if (Estat.flag('raimResolt')) return { pagines: [{ qui: '', text: "El forat de la palanca. El mecanisme ja ha fet la seva feina." }] };
            if (!E.te('palanca')) return { pagines: [{ qui: '', text: "Un forat quadrat a la base de l'estàtua, com per encaixar-hi una palanca." }] };
            this.raimDir = (this.raimDir + 1) % 4;
            this.actualitzarRaim();
            return { pagines: [{ qui: '', text: "Encaixes la palanca i la gires un quart de volta. A dalt, el cap de pedra grinyola i mira " + NOMS_DIR[this.raimDir] + "." }] };
        }, { altura: 90 });

        // Trapa de la cripta, sota l'estàtua, un cop resolt el puzle
        this.trapa = this.add.graphics().setDepth(-958);
        this.trapa.fillStyle(0x0a0705, 1).fillRect(650, 616, 100, 46).lineStyle(4, 0x8a7a5e, 1).strokeRect(650, 616, 100, 46);
        this.trapa.fillStyle(0x3a2c22, 1).fillRect(654, 624, 92, 8).fillRect(654, 640, 92, 8);
        this.trapa.setVisible(resolt);
        this.interactiu(700, 670, 75, DIALEGS.trapaCripta, {
            altura: 60, actiu: () => Estat.flag('raimResolt'),
            enTancar: () => this.canviarZona('ZonaCasaCripta', 'porta')
        });
        if (resolt) { this.raimDir = 1; this.raimPas = 3; this.actualitzarRaim(); }
    }

    actualitzarRaim() {
        const p = this.posRosa[this.raimDir];
        this.marcaRaim.setPosition(p[0], p[1]);
        this.puntsRaim.forEach((c, i) => c.setFillStyle(i < this.raimPas ? 0xffd34d : 0x2a1f18));
    }

    confirmarRaim() {
        const t = (txt) => ({ pagines: [{ qui: '', text: txt }] });
        if (this.raimDir === SEQ_RAIM[this.raimPas]) {
            this.raimPas++;
            this.actualitzarRaim();
            if (this.raimPas < SEQ_RAIM.length) {
                return t("Prems el raïm de marbre. Clic! Un engranatge cedeix a dins de l'estàtua. (" + this.raimPas + " de 3)");
            }
            Estat.posaFlag('raimResolt');
            this.trapa.setVisible(true);
            this.cameras.main.shake(700, 0.005);
            return {
                pagines: [
                    { qui: '', text: "Prems el raïm de marbre per tercera vegada. Tota l'estàtua tremola, una cosa gran fa clic a dins, i el carràs es desprèn de les seves mans." },
                    { qui: '', text: "Del raïm de marbre cau una clau antiga, feta de ferro vell i brillant de pols de vi: LA CLAU DEL CELLER VELL." },
                    { qui: '', text: "Als peus de l'Home del Raïm una llosa s'enfonsa i mostra una trapa amb una escala: la Cripta dels Monjos." }
                ],
                enAcabar: () => {
                    Estat.dona('clau_celler_vell'); Estat.posaFlag('clauCellerVell');
                    Estat.posaObjectiu("Baixa a la Cripta dels Monjos, sota l'Home del Raïm: recupera les relíquies robades.");
                }
            };
        }
        if (this.raimPas > 0) {
            this.raimPas = 0;
            this.actualitzarRaim();
            return t("Prems el raïm, però el cap mira cap a un altre lloc. L'engranatge grinyola i tot torna al principi. (0 de 3)");
        }
        return t("Prems el raïm de marbre, però no passa res: el cap no mira bé. (0 de 3)");
    }
}

// ---------------- 2. SALA DELS RETRATS ----------------
class ZonaCasaRetrats extends ZonaCasaBase {
    constructor() {
        super('ZonaCasaRetrats', {
            nom: 'Casa Gran · Sala dels Retrats',
            amplada: 1280,
            alcada: 820,
            colorFons: '#120c08',
            pacifica: true,
            entrades: { porta: { x: 640, y: 760, dir: 'amunt' } }
        });
    }

    construir() {
        this.sala(1280, 820, 640, 0xb8a890);
        this.premuts = [];
        this.nuvols = [];

        // Quatre retrats a la paret
        RETRATS.forEach((r, i) => {
            const g = this.add.graphics().setDepth(5);
            const x = r.x, y = 76;
            g.fillStyle(0x6a4a22, 1).fillRect(x - 48, y - 62, 96, 124).lineStyle(3, 0x2a1a0c, 1).strokeRect(x - 48, y - 62, 96, 124);
            g.fillStyle(0x2a1f18, 1).fillRect(x - 40, y - 54, 80, 108);
            g.fillStyle(r.roba, 1).fillRect(x - 28, y + 8, 56, 46);
            g.fillStyle(0xe8b48a, 1).fillCircle(x, y - 14, 20).lineStyle(2, 0x2a1a0c, 1).strokeCircle(x, y - 14, 20);
            g.fillStyle(0x1a1410, 1).fillRect(x - 20, y - 38, 40, 10).fillRect(x - 8, y - 18, 4, 5).fillRect(x + 4, y - 18, 4, 5);
            g.fillStyle(0xc9b48a, 1).fillRect(x - 24, y + 42, 48, 10);
            // Amb la llanterna, els retrats s'ennuvolen
            const nuvol = this.add.ellipse(x, y - 10, 70, 80, 0xb0b0d0, 0).setDepth(6);
            this.nuvols.push(nuvol);
            this.interactiu(x, 205, 70, () => this.llegirRetrat(i), {
                altura: 130, enTancar: () => this.premerRetrat(i)
            });
        });

        // Escriptori amb el calaix dels quatre forats
        const esc = this.add.graphics().setDepth(330);
        esc.fillStyle(0x5a3a1c, 1).fillRect(580, 262, 120, 68).lineStyle(3, 0x2a1a0c, 1).strokeRect(580, 262, 120, 68);
        esc.fillStyle(0x7a5430, 1).fillRect(574, 252, 132, 16).lineStyle(3, 0x2a1a0c, 1).strokeRect(574, 252, 132, 16);
        esc.fillStyle(0x3a2412, 1).fillRect(592, 282, 96, 32).lineStyle(2, 0xc9b48a, 1).strokeRect(592, 282, 96, 32);
        [604, 622, 640, 658].forEach(x => esc.fillStyle(0xc9b48a, 1).fillCircle(x + 6, 298, 3));
        this.colisio(640, 318, 120, 24);
        this.interactiu(640, 360, 85, DIALEGS.escriptoriRetrats, { altura: 100 });

        // Quadre buit al mig, mobles i espelmes
        this.espelmes([[220, 260], [1060, 260], [220, 620], [1060, 620]]);
        this.posar('banc', 400, 560, { col: { w: 140, h: 16 } });
        this.posar('banc', 880, 560, { col: { w: 140, h: 16 } });
        this.sortida(600, 800, 80, 20, 'ZonaCasaGranInt', 'retrats');
    }

    llegirRetrat(i) {
        const r = RETRATS[i];
        if (Estat.flag('retratsResolts')) {
            return { pagines: [{ qui: '', text: r.nom + " (" + r.any + "). " + r.text + " Els ulls del retrat ja no es mouen." }] };
        }
        if (!Estat.te('llanterna')) {
            return { pagines: [{ qui: '', text: "Un retrat antic, cobert de pols i d'ombres. La placa de sota no es pot llegir." }, { qui: 'Ineu', text: "Hi veuria millor amb una llum que revelés el que la boira amaga..." }] };
        }
        return { pagines: [
            { qui: '', text: "Amb la llum de la llanterna el retrat s'ennuvola i els ulls es giren cap a tu. A la placa: «" + r.nom + ", " + r.any + "».\n" + r.text },
            { qui: '', text: "(Prems el marc: el calaix de l'escriptori té quatre forats.)" }
        ] };
    }

    premerRetrat(i) {
        if (Estat.flag('retratsResolts') || !Estat.te('llanterna')) return;
        const esperat = ORDRE_RETRATS[this.premuts.length];
        if (i !== esperat) {
            if (this.premuts.length) this.flotant(640, 250, 'Els retrats tremolen... i tot torna a començar', '#d8c8ff');
            this.premuts = [];
            return;
        }
        this.premuts.push(i);
        this.flotant(RETRATS[i].x, 200, this.premuts.length + ' / 4', '#ffd34d');
        if (this.premuts.length === 4) {
            Estat.posaFlag('retratsResolts');
            Estat.dona('clau_cuina');
            Estat.posaObjectiu("Porta la palanca a l'Home del Raïm. (Cal trobar-la: potser a la cuina, al rebost.)");
            this.time.delayedCall(500, () => this.ui().obrirDialeg(DIALEGS.retratsResolt, () => Estat.desar()));
        }
    }

    actualitzar(ara) {
        const llum = Estat.te('llanterna') && !Estat.flag('retratsResolts');
        this.nuvols.forEach((n, i) => n.setFillStyle(0xb0b0d0, llum ? 0.15 + 0.12 * Math.sin(ara / 400 + i) : 0));
    }
}

// ---------------- 3. CUINA I REBOST ----------------
class ZonaCasaCuina extends ZonaCasaBase {
    constructor() {
        super('ZonaCasaCuina', {
            nom: 'Casa Gran · Cuina i Rebost',
            amplada: 1500,
            alcada: 1000,
            colorFons: '#120c08',
            entrades: {
                servei:     { x: 750, y: 930, dir: 'amunt' },
                escalinata: { x: 190, y: 740, dir: 'dreta' }
            }
        });
    }

    construir() {
        this.sala(1500, 1000, 750, 0xa89880);

        // Forn i taula llarga
        this.posar('foc', 330, 260, { col: { w: 90, h: 30 } });
        this.add.circle(330, 220, 150, 0xff8030, 0.10).setDepth(300);
        this.posar('taula_sopar', 700, 560, { col: { w: 360, h: 40 } });
        this.espelmes([[560, 540], [840, 540], [180, 880], [1320, 880]]);
        this.cartell(900, 880, DIALEGS.cartellCuina);

        // Rebost (cantonada nord-est): entrada tapada per esbarzers negres
        const rebost = this.add.graphics().setDepth(-990);
        rebost.fillStyle(0x6a5a46, 1).fillRect(1100, 90, 270, 250);
        rebost.lineStyle(4, 0x2a1f18, 1).strokeRect(1100, 90, 270, 250);
        this.colisio(1095, 215, 20, 250);
        this.esb = [1150, 1230, 1310].map((x, i) => this.esbarzer(x, 355, 'cuina' + i));
        this.interactiu(1230, 410, 110, DIALEGS.esbarzersRebost, { altura: 80, actiu: () => this.esb.some(o => o && o.viu) });
        this.posar('cofre', 1240, 200, { col: { w: 50, h: 20 } });
        this.interactiu(1240, 250, 80, DIALEGS.rebostCofre, { altura: 80, actiu: () => this.esb.every(o => !o || !o.viu) });

        // Criats de boira: repeteixen sempre la mateixa tasca (ara, perseguint l'Ineu)
        [[520, 420], [1000, 760]].forEach(([x, y]) => {
            const e = this.enemic('visitant', x, y);
            if (e) e.spr.setTint(0xb8b8d8);
        });

        this.porta(115, 740, 20, 110);
        this.sortida(116, 690, 14, 100, 'ZonaCasaGranInt', 'costat');
        this.sortida(690, 986, 120, 14, 'ZonaCasaGran', 'costat');
    }

    // Sortir cap a l'escalinata des d'aquest costat obre la porta per sempre
    canviarZona(desti, entrada) {
        if (desti === 'ZonaCasaGranInt') Estat.posaFlag('cuinaOberta');
        super.canviarZona(desti, entrada);
    }
}

// ---------------- 4. CELLER DE LES BOTES ----------------
class ZonaCasaCeller extends ZonaCasaBase {
    constructor() {
        super('ZonaCasaCeller', {
            nom: 'Casa Gran · Celler de les Botes',
            amplada: 1400,
            alcada: 1000,
            colorFons: '#0c0806',
            entrades: { porta: { x: 700, y: 930, dir: 'amunt' } }
        });
    }

    construir() {
        this.sala(1400, 1000, 700, 0x8a7a68);
        // Botes: [x, y, contingut] (c = creu, a = anell, n = normal)
        const botes = [[330, 330, 'n'], [520, 330, 'c'], [880, 330, 'n'], [1070, 330, 'n'], [330, 580, 'n'], [1070, 580, 'a'],
                       [520, 760, 'n'], [880, 760, 'n'], [700, 500, 'n']];
        botes.forEach(([x, y, t], i) => {
            const g = this.add.graphics().setDepth(y);
            g.fillStyle(0x6a4424, 1).fillRoundedRect(x - 36, y - 78, 72, 80, 14).lineStyle(3, 0x2a1a0c, 1).strokeRoundedRect(x - 36, y - 78, 72, 80, 14);
            g.lineStyle(5, 0x3a3a40, 1).lineBetween(x - 36, y - 56, x + 36, y - 56).lineBetween(x - 36, y - 20, x + 36, y - 20);
            g.fillStyle(0x7a5430, 1).fillEllipse(x, y - 78, 70, 20).lineStyle(3, 0x2a1a0c, 1).strokeEllipse(x, y - 78, 70, 20);
            this.colisio(x, y - 12, 70, 26);
            const dialeg = t === 'c' ? DIALEGS.barrilCreu : t === 'a' ? DIALEGS.barrilAnell : DIALEGS.barrilCeller(i);
            this.interactiu(x, y + 14, 65, dialeg, { altura: 90 });
        });
        this.espelmes([[200, 300], [1200, 300], [200, 800], [1200, 800]]);
        this.add.rectangle(700, 500, 1400, 1000, 0x000000, 0.25).setDepth(80100);

        // Rates de boira
        [[420, 450], [980, 460], [700, 700]].forEach(([x, y]) => this.enemic('escolopendra', x, y));
        this.sortida(640, 986, 120, 14, 'ZonaCasaGranInt', 'celler');
    }
}

// ---------------- 5. CRIPTA DELS MONJOS ----------------
class ZonaCasaCripta extends ZonaCasaBase {
    constructor() {
        super('ZonaCasaCripta', {
            nom: 'Casa Gran · Cripta dels Monjos',
            amplada: 1200,
            alcada: 900,
            colorFons: '#0a0806',
            entrades: { porta: { x: 600, y: 830, dir: 'amunt' } }
        });
    }

    construir() {
        this.sala(1200, 900, 600, 0x7a7068);
        // Sarcòfags buits i columnes
        [[330, 300], [870, 300], [330, 560], [870, 560]].forEach(([x, y]) => {
            const g = this.add.graphics().setDepth(y);
            g.fillStyle(0x8a8478, 1).fillRect(x - 60, y - 36, 120, 46).lineStyle(3, 0x2a1f18, 1).strokeRect(x - 60, y - 36, 120, 46);
            g.fillStyle(0x6a6458, 1).fillRect(x - 56, y - 52, 112, 18);
            this.colisio(x, y - 14, 120, 40);
            this.posar('columna', x + (x < 600 ? 90 : -90), y - 10, { col: { w: 30, h: 14 } });
        });
        this.espelmes([[480, 200], [720, 200], [480, 700], [720, 700]]);
        this.add.rectangle(600, 450, 1200, 900, 0x100820, 0.2).setDepth(80100);

        // Cofre de les relíquies: només accessible un cop derrotat el Cellerer
        this.posar('cofre', 600, 190, { col: { w: 50, h: 20 } });
        this.interactiu(600, 240, 85, DIALEGS.cofreCripta, { altura: 80, actiu: () => Estat.flag('criptaNetejada') });

        if (!Estat.flag('criptaNetejada')) {
            this.boss = this.enemic('cellerer', 600, 400);
            this.time.delayedCall(700, () => this.ui().obrirDialeg(DIALEGS.criptaAvis(Estat)));
        }
        this.sortida(560, 886, 80, 14, 'ZonaCasaGranInt', 'cripta');
    }

    cellererDerrotat(e) {
        const c = e.spr.body.center;
        Estat.posaFlag('criptaNetejada');
        Estat.dades.corsMax += 1;
        Estat.dades.vida = Estat.dades.corsMax * 2;
        Estat.dades.monedes += 20;
        this.flotant(c.x, c.y - 60, '+20 ●', '#ffd34d');
        this.enemics.filter(x => x.tipus === 'escolopendra' && !x.mort).forEach(o => {
            o.mort = true; o.spr.body.enable = false; this.boiraPuf(o.spr.x, o.spr.y);
            this.tweens.add({ targets: [o.spr, o.ombra], alpha: 0, duration: 500, onComplete: () => this.retirar(o) });
        });
        this.ui().actualitzarHUD();
        this.time.delayedCall(900, () => this.ui().obrirDialeg(DIALEGS.cellererDerrotat(Estat), () => {
            this.tweens.add({ targets: [e.spr, e.ombra], alpha: 0, duration: 800, onComplete: () => this.retirar(e) });
            Estat.desar();
        }));
    }
}
