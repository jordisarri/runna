/**
 * ZONES VEÏNES DE LA PLAÇA
 * Santuari (interior), Monestir, La Bassadòria (amb la Creu de l'Aparició), Casa Gran.
 * Algunes parts encara són provisionals i es completaran als passos següents.
 */

// ---------------- ESGLÉSIA (interior) ----------------
// La nau fa 800 d'ample (x 240-1040). El retaule ocupa tot l'ample i es veu sencer (800 x 990); al seu peu hi ha dues
// portes: la de la dreta duu a la torre de l'escala (ZonaTorre) i d'allà a les golfes del rellotge.
const ESG = { alcada: 1640, retY: 1010, retBaix: 24, retTop: 20, sostre: 1000, portaDx: 870, portaEsq: 408 };

class ZonaEsglesia extends ZonaBase {
    constructor() {
        super('ZonaEsglesia', {
            nom: 'Santuari del Miracle',
            amplada: 1280,
            alcada: ESG.alcada,
            colorFons: '#140e0a',
            pacifica: true,
            entrades: { porta: { x: 640, y: ESG.alcada - 50, dir: 'amunt' }, golfes: { x: ESG.portaDx, y: ESG.retY + 40, dir: 'avall' } }
        });
    }

    construir() {
        const A = ESG.alcada;
        this.epileg = false; this.epilegEngegat = false;          // (l'escena es reaprofita: l'epíleg d'una altra partida no compta)
        // Terra i murs
        this.terra('rajola', 240, 0, 800, A, -1100);
        const murs = this.add.graphics().setDepth(-1000);
        murs.fillStyle(0x4a1e22, 1).fillRect(240, 0, 800, ESG.retY);                 // paret del fons, darrere el retaule
        murs.fillStyle(0x2e1216, 1).fillRect(240, ESG.retY - 8, 800, 8);            // sòcol fosc (si el retaule no el tapa del tot, no es veu cap línia clara)
        murs.fillStyle(0xcdb89a, 1).fillRect(200, 0, 40, A).fillRect(1040, 0, 40, A);
        this.colisio(120, A / 2, 240, A);
        this.colisio(1160, A / 2, 240, A);
        this.colisio(640, ESG.sostre / 2, 800, ESG.sostre);
        this.colisio(420, A - 10, 360, 20);
        this.colisio(860, A - 10, 360, 20);

        // Retaule Major (tot l'ample de la nau, sencer) i, al davant, l'altar de pedra
        this.retaule = this.posar('retaule', 640, ESG.retY + ESG.retBaix, { fonsY: 900 });   // una mica més avall: les bases tapen el sòcol
        // La porta de la dreta del peu del retaule: la mateixa del gràfic, que s'obre cap endins (amb la clau del campanar) i duu a la torre
        this.portaRetaule = this.portaAnimada({ x: 872, top: 868, bottom: 1021, ample: 83, fons: 900, unic: true, arc: true, retall: this.retaule, bloq: () => !this.portaRellotge });
        this.interactiu(640, ESG.retY + 36, 130, DIALEGS.sagrari, { altura: 170, actiu: () => !Estat.flag('fragment2') });     // el sagrari, al mig del retaule (fragment 2)
        this.posar('altar', 640, ESG.retY + 128, { col: { w: 130, h: 30 } });

        // Portes del peu del retaule: totes dues tancades. Quan el Pare Daimiel diu que el rellotge s'ha aturat (rellotgeDit)
        // s'obre la de la dreta, que duu a la torre i a la Sala del Rellotge. L'esquerra continua tancada.
        this.portaRellotge = false;
        this.obrirPortaRellotge(false);
        this.interactiu(ESG.portaEsq, ESG.retY + 50, RADI_OBJECTE, () => ({
            pagines: [{ qui: 'Ineu', text: 'Tancada amb clau.' }]
        }), { altura: 150 });
        this.interactiu(ESG.portaDx, ESG.retY + 50, RADI_OBJECTE, () => Estat.te('clau_campanar') ? ({
            pagines: [{ qui: 'Ineu', text: 'La clau del campanar encaixa al pany. La porta s\'obre.' }],
            enAcabar: () => { Estat.posaFlag('portaCampanarOberta'); Sfx.secret(); this.obrirPortaRellotge(false); }
        }) : ({
            pagines: [{ qui: 'Ineu', text: 'Tancada amb clau.' }]
        }), { altura: 150, actiu: () => !this.portaRellotge });

        // Orgue (la Pianista seu a l'orgue) i el Pare Daimiel, que dirigeix el cor
        const epileg = Estat.flag('epilegPendent') && !Estat.flag('epilegFet');          // a l'epíleg, la Pianista i el Pare Daimiel es posen amb la resta
        if (!epileg) this.orgue = this.posar('orgue', 975, ESG.retY + 250, { col: { w: 110, h: 50 } });
        if (!epileg) this.npc('pianista', 975, ESG.retY + 320, DIALEGS.pianista, { flipX: true, radi: RADI_NPC });
        if (!epileg) this.npc('pare_daniel', 360, ESG.retY + 190, DIALEGS.pareDaniel, { flipX: false });

        // Bancs, vistos per darrere (amb respatller), mirant cap a l'altar (a l'epíleg es retiren perquè tothom tingui lloc sense tapar-se)
        if (!epileg) {
            const bancs = [ESG.retY + 230, ESG.retY + 380, ESG.retY + 530];
            bancs.forEach(y => {
                this.posar('banc_esglesia', 470, y, { col: { w: 140, h: 16 } });
                this.posar('banc_esglesia', 810, y, { col: { w: 140, h: 16 } });
            });
        }

        // Llum de les vidrieres
        this.add.rectangle(640, A / 2, 800, A, 0xffd38a, 0.05).setDepth(80000);

        this.sortida(600, A - 20, 80, 20, 'ZonaPlaca', 'esglesia');
        if (Estat.flag('epilegPendent') && !Estat.flag('epilegFet')) this.prepararEpileg();
    }

    // ---------------- EPÍLEG: «Torna el cant» ----------------
    // Tothom és al Santuari, ben distribuït per la nau sense bancs ni orgue perquè ningú es tapi:
    // els nens davant l'altar, la Pianista i el Pare Jordà a banda i banda, i el poble repartit en files
    // deixant un passadís ample al mig per on puja l'Ineu, que es queda mirant de cara a la càmera.
    prepararEpileg() {
        this.epileg = true;
        const R = ESG.retY;
        [['nen_uri', 575, R + 168], ['nen_flam', 640, R + 180], ['nen_sardin', 705, R + 168],
         ['pianista', 450, R + 205], ['pare_jordi', 830, R + 205],
         ['marit_neus', 380, R + 290], ['neus', 450, R + 290], ['ciscu', 520, R + 290],
         ['pare_daniel', 760, R + 290], ['monja_charm', 830, R + 290], ['monja_phili', 900, R + 290],
         ['carry', 380, R + 410], ['pare_alcui', 450, R + 410], ['eva', 520, R + 410],
         ['venerables', 770, R + 410], ['monja_pains', 850, R + 410],
         ['mandu', 485, R + 350],
         ['frederic', 380, R + 530], ['josep', 450, R + 530], ['germa_francesc', 520, R + 530],
         ['jaumeta', 760, R + 530], ['galf', 830, R + 530], ['isidre', 900, R + 530]
        ].forEach(([k, x, y]) => {
            if (k === 'mandu' && !Estat.flag('manduNinaTrencada')) return;      // la Mandu només hi és si l'Ineu hi va parlar durant el joc (la nina trencada que el Fram cus)
            if (this.textures.exists(k) && !(this.npcs && this.npcs[k])) this.npc(k, x, y, DIALEGS.gentEpileg, { flipX: x > 640 });
        });
        if (this.npcs && this.npcs.mandu && Estat.flag('manduNinaTrencada')) this.npcs.mandu.setTexture('mandu_trencada');            // la nina, encara sense cap
        this.direccio = 'avall';
        if (this.ineu) this.posarDireccio('avall', false);
        // Enquadra tot el Santuari (del retaule i els nens fins a l'últim grup i les parets laterals)
        // per damunt del quadre de diàleg i el retrat, de manera que tothom es vegi sencer i ningú quedi tallat
        this.enquadrar(640, R + 340, 0.67, 0);
        this.cameras.main.fadeIn(1200, 0, 0, 0);
    }

    actualitzar() {
        this.obrirPortaRellotge(true);
        if (this.epileg && !this.epilegEngegat) {
            this.epilegEngegat = true;
            if (this.ineu) this.posarDireccio('avall', false);
            this.time.delayedCall(900, () => this.ferEpileg());
        }
    }

    // El Fram cus el cap de la nina de la Mandu: una brillantor daurada i la nina torna a estar sencera
    arreglaNina(fet) {
        const m = this.npcs.mandu, f = this.npcs.nen_flam;
        if (!m) { fet(); return; }
        if (f) this.npcSalta('nen_flam', null, 1);
        Sfx.objecte();
        this.llum(m.x, m.y - m.displayHeight * 0.4, 0xffe8a0);
        this.esperar(500, () => { m.setTexture('mandu'); this.npcSalta('mandu', null, 1); this.esperar(900, fet); });
    }

    ferEpileg() {
        const R = ESG.retY, nens = ['nen_uri', 'nen_flam', 'nen_sardin'];
        const gent = Object.keys(this.npcs).filter(k => !nens.includes(k) && k !== 'pianista' && k !== 'pare_jordi');
        const tots = Object.keys(this.npcs);
        const hi = k => !!this.npcs[k];
        const riure = (llista, f) => { Sfx.riure(); llista.filter(hi).forEach(k => this.npcSalta(k, null, 2)); this.esperar(1500, f); };
        const accio = pas => ({ fer: (z, fet) => z.seq(pas(z), fet) });
        this.ui().obrirDialeg({ pagines: [
            accio(z => [
                f => z.ineuVa(640, R + 330, () => {
                    z.posarDireccio('avall', false);
                    f();
                }, 150),
                f => {
                    z.posarDireccio('avall', false);
                    riure(nens, f);
                }
            ]),
            // La Meus corre a buscar l'Huri i el Fram
            accio(z => [f => z.npcVa('neus', 600, R + 225, f, 190), f => z.npcMira('neus', 575, f), f => z.bombolla('neus', '♥', f, 900),
                        f => { z.npcSalta('nen_uri', null, 2); z.npcSalta('nen_flam', f, 2); }]),
            { qui: 'Meus', text: "Huri! Fram! Bruts com dos esquirols i amb cara de no haver dormit en tres nits... Veniu aquí, que no us deixo anar mai més!" },
            { qui: 'Senyor Molner', text: 'Ja són aquí, Meus. Ja són aquí.' },
            { qui: 'Meus', text: "I tu, Ineu, no et pensis que t'escapes de l'abraçada." },
            // La Mandu corre cap al seu germà amb la nina sense cap: el Fram l'hi cus (només ell la sap arreglar)
            ...(hi('mandu') && Estat.flag('manduNinaTrencada') ? [
                accio(z => [f => z.npcVa('mandu', 610, R + 232, f, 190), f => z.npcMira('mandu', 640, f)]),
                { qui: 'Fram', text: "Mandu! Què li ha passat a la nina? Dona-me-la, que només jo sé cosir caps de nina." },
                { fer: (z, fet) => z.arreglaNina(fet) },
                { qui: 'Mandu', text: "Gràcies, Fram! Ja torna a tenir cap... i tu ja no te n'aniràs mai més, oi?" }
            ] : []),
            // Les sacerdotesses i el seu protegit
            accio(z => [f => { z.npcVa('monja_phili', 770, R + 232, null, 170); z.npcVa('monja_charm', 735, R + 222, f, 170); },
                        f => z.npcMira('monja_charm', 705, f), f => z.bombolla('monja_charm', '♥', f, 900), f => z.npcSalta('nen_sardin', f, 2)]),
            { qui: 'Carmèlia', text: 'Sardi! Tres nits sense dormir, les tres. La Dolora ha resat tants rosaris que ja no li queden dits.' },
            { qui: 'Dolora', text: 'I els tornaria a resar tots. Gràcies, Ineu.' },
            { qui: 'Sardi', text: 'Pilària, Pilària! He volat amb ocells de foc!' },
            { qui: 'Pilària', text: "Doncs ara aterraràs a la banyera, que fas olor de gàbia." },
            // L'Isílder, el pare del Sardi, hi corre i l'abraça
            ...(hi('isidre') ? [
                accio(z => [f => z.npcVa('isidre', 735, R + 195, f, 200), f => z.npcMira('isidre', 705, f), f => z.bombolla('isidre', '♥', f, 900), f => z.npcSalta('nen_sardin', f, 2)]),
                { qui: 'Isílder', text: "Sardi! Fill meu... Tres nits sense saber de tu." },
                { qui: 'Sardi', text: "Pare! Has regat la prunera?" },
                { qui: 'Isílder', text: "Cada dia, fill. Cada dia. Així, quan tornessis, ho trobaves tot com ho havies deixat." }
            ] : []),
            // L'Iscu, que avui no ha de fregar gots
            ...(hi('ciscu') ? [accio(z => [f => z.npcSalta('ciscu', f, 2)]),
                { qui: 'Iscu', text: "Avui no frego ni un got! La mare dorm i ningú no m'ho pot manar. Festa grossa!" }] : []),
            // La Pianista dona l'entrada: l'Ineu comença el Cant del Miracle amb la tarota i l'orgue el segueix
            accio(z => [f => z.npcVa('pianista', 545, R + 245, f, 140), f => z.npcMira('pianista', 'ineu', f)]),
            { qui: 'La Pianista', text: "Ara sí. Ineu, la tarota: avui el Cant del Miracle el comences tu, i l'orgue et seguirà." },
            accio(z => [
                f => {
                    z.ineuFlauta(true);
                    MELODIES.miracle.notes.forEach((n, i) => this.time.delayedCall(i * 420, () => { Sfx.to(FREQ_NOTA[n], FREQ_NOTA[n], 0.38, 'square', 0.05); z.bombolla('ineu', '♪', null, 380); }));
                    this.esperar(MELODIES.miracle.notes.length * 420 + 300, f);
                },
                f => {
                    // L'orgue torna a sonar: la fanfàrria del joc sencera, amb els acords, i tothom canta
                    const d = Joc.leitmotiv(this, 'orgue') || 4;
                    z.npcFeina('pianista', d * 1000, 'notes');
                    gent.forEach(k => z.npcFeina(k, d * 1000 - 400, 'notes'));
                    this.esperar(d * 1000 + 300, f);
                },
                f => {
                    z.ineuFlauta(false);
                    z.posarDireccio('avall', false);
                    riure(tots, f);
                },
                f => z.npcVa('pare_jordi', 740, R + 330, f, 120),
                f => z.npcMira('pare_jordi', 'ineu', f)
            ]),
            // Només si l'Ineu va fer caminar el rellotge (missió lateral): el campanar torna a tocar les hores
            ...(Estat.flag('rellotgeReparat') ? [
                { fer: (z, fet) => { [0, 1, 2].forEach(k => z.time.delayedCall(k * 850, () => Sfx.campana())); z.esperar(3000, fet); } },
                { qui: 'Pare Daimiel', text: "Sents el campanar, Ineu? Torna a tocar les hores! Fa tres nits que el temps no passava, i l'has tornat a posar en marxa tu." },
                ...(hi('carry') ? [{ qui: 'Carry', text: "El meu home ho hauria sentit des de lluny, aquest so. Gràcies, fill." }] : [])
            ] : []),
            { qui: 'Pare Jordà', text: 'Benvingut a casa, Ineu.' },
            { fer: (z, fet) => {
                z.posarDireccio('avall', false);
                z.seq([
                    f => riure(tots, f),
                    f => { this.cameras.main.fadeOut(1800, 0, 0, 0); this.esperar(1900, f); }
                ], fet);
            } }] }, () => {
            Estat.posaFlag('epilegFet');
            Estat.posaFlag('epilegPendent', false);
            Estat.dades.zona = 'ZonaEsglesia'; Estat.dades.entrada = 'porta'; Estat.dades.x = null; Estat.dades.y = null;
            Estat.posaObjectiu("El Santuari torna a cantar.");
            Estat.desar();
            this.canviant = true;
            Joc.aturarTot(this);
            this.scene.stop('UI');
            this.scene.start('Credits');
        });
    }

    // Venint de la torre, l'Ineu surt per la porta del peu del retaule: comença darrere el retaule (tapat per ell) i camina cap avall fins
    // passar-ne la vora, i només llavors es dibuixa davant. Així no se li superposa el retaule.
    enEntrar() {
        if (this.dadesEntrada.entrada !== 'golfes' || this.dadesEntrada.restaurar) return;
        this.entradaPropia = true;
        const I = this.ineu, x = ESG.portaDx, y0 = ESG.retY - 10, y1 = ESG.retY + 110, darrere = this.retaule.depth + 1.5;      // dins del forat de la porta: sobre la foscor, sota el batent
        this.canviant = true;
        this.portaRetaule.forcaFins = this.time.now + 1800;                                                                       // la porta s'obre per deixar-lo sortir
        I.body.checkCollision.none = true;
        I.setPosition(x, y0).setDepth(darrere);
        this.ombraIneu.setVisible(false);
        if (this.fantasma) this.fantasma.setVisible(false);
        this.posarDireccio('avall', true);
        this.tweens.addCounter({
            from: 0, to: 1, duration: 900, delay: 150,
            onUpdate: tw => {
                const y = y0 + (y1 - y0) * tw.getValue(), fora = y > ESG.retY + 34;
                I.setPosition(x, y).setDepth(fora ? y : darrere);
                this.ombraIneu.setPosition(x, y).setVisible(fora);
            },
            onComplete: () => {
                I.body.checkCollision.none = false;
                if (this.fantasma) this.fantasma.setVisible(true);
                this.canviant = false;
                this.posarDireccio('avall', false);
            }
        });
    }

    // Obre la porta de la dreta del retaule si el Pare Daimiel ja ha parlat del rellotge (també a mitja visita)
    obrirPortaRellotge(avis) {
        if (this.portaRellotge || !(Estat.flag('portaCampanarOberta') || Estat.flag('rellotgeReparat') || Estat.flag('visitada_ZonaTorre'))) return;   // (partides velles: ja hi havien pujat)
        this.portaRellotge = true;                // el batent de la porta (portaRetaule) ja no queda bloquejat: s'obre quan l'Ineu s'hi acosta
        this.sortida(ESG.portaDx - 30, ESG.retY - 20, 60, 18, 'ZonaTorre', 'baix');
        if (avis) {
            Sfx.secret();
            this.ineuDiu('La porta de la dreta del retaule ja és oberta.');
        }
    }
}

// ---------------- MONESTIR (exterior) ----------------
const MONESTIR_DY = 150;      // tot l'escenari baixa perquè la façana del Monestir es vegi sencera, de dalt a baix

class ZonaMonestir extends ZonaBase {
    constructor() {
        const D = MONESTIR_DY;
        super('ZonaMonestir', {
            pins: { pinyer: 0.35 },
            nom: 'El Monestir',
            densitatBoira: 1.8,                // la boira del Miracle és més espessa aquí, a prop d'on neix
            amplada: 1600,
            alcada: 800 + D,
            entrades: { placa: { x: 60, y: 520 + D, dir: 'dreta' }, rebedor: { x: 800, y: 494, dir: 'avall' }, inici: { x: 800, y: 540, dir: 'avall' }, cementiri: { x: 1480, y: 70, dir: 'avall' }, santantoni: { x: 1530, y: 560 + D, dir: 'esquerra' } }
        });
    }

    // La partida comença aquí, davant la porta del Monestir: l'Ineu n'acaba de sortir i ha d'anar cap a la Plaça
    enEntrar() {
        if (Estat.flag('introVista')) return;
        Estat.posaFlag('introVista');
        this.time.delayedCall(700, () => {
            this.ui().obrirDialeg({
                pagines: [
                    { qui: 'Ineu', text: 'Una altra nit de boira... i aquest fred que no marxa. El Pare Jordà em deu estar esperant a la Plaça.' }
                ]
            }, () => Estat.desar());
        });
    }

    construir() {
        const D = MONESTIR_DY;
        this.terra('herba', 0, 0, 1600, 800 + D, -1100);
        this.terra('llamborda', 0, 430 + D, 1600, 370);  // la mateixa plaça empedrada, fins a baix de tot
        this.terra('cami', 1400, 0, 160, 460 + D);         // cap al cementiri (darrere el Monestir i el Santuari)

        // 800 d'ample: la façana surt per dalt de la pantalla i només es veu a partir de les últimes fileres de teula
        // La façana: el portal del mig duu a la biblioteca (on treballa el Pare Alcoví)
        // La imatge va al fons (fonsY): l'Ineu puja l'escalinata per davant i arriba a la porta, que es veu obrir-se i el duu al Rebedor
        this.posar('monestir', 800, 440 + D, { fonsY: 330 });
        // Murs de la façana: als costats de l'escalinata la paret arriba fins a y=535; dalt de l'escalinata el mur i la porta són a y=438
        this.colisio(531, 267.5, 238, 535);
        this.colisio(1069, 267.5, 238, 535);
        this.colisio(704, 219, 108, 438);
        this.colisio(896, 219, 108, 438);
        this.colisio(800, 208, 84, 416);
        // Baranes de pedra en pendent als dos costats de l'escalinata (de y=438 a y=588)
        for (let i = 0; i < 6; i++) {
            const cy = 450.5 + i * 25, t = (i + 0.5) / 6;
            const lx0 = Math.round(655 + (552 - 655) * t), lx1 = Math.round(695 + (592 - 695) * t), w = lx1 - lx0, cx = (lx0 + lx1) / 2;
            this.colisio(cx, cy, w, 25);
            this.colisio(1600 - cx, cy, w, 25);
        }
        this.sortida(764, 416, 72, 14, 'ZonaMonestirRebedor', 'porta');
        this.portaAnimada({ x: 800, top: 344, bottom: 435, ample: 74, fons: 335, color: 0x6a4328, panell: 0x7a5233, vora: 0x2a1608, ferro: true });   // el portal romànic: els batents de fusta s'obren cap endins
        // Xiprers alts a l'esquerra del portal i una conífera a la dreta (al peu de la façana, y=535)
        [[440, 392, 1.7], [492, 398, 1.5]].forEach(([x, y, e]) => this.posar('xiprer', x, y + D, { escala: e, col: { w: 26, h: 12 } }));
        this.posar('xiprer', 1165, 395 + D, { escala: 1.9, col: { w: 30, h: 12 } });

        this.cartell(1368, 450 + D, () => ({ pagines: [{ qui: 'Cartell', text: '→ Cel·les de Sant Antoni\n↑ El Cementiri' }] }));
        this.arbres([[160, 250], [330, 200], [1250, 260], [250, 720], [1250, 720], [420, 770], [1090, 770], [750, 780]].map(([x, y]) => [x, y + D]));

        // La boira violeta que surt de sota terra jeu a la plaça, davant del Monestir i al peu de l'escalinata (vegeu posarBoiraGeneral):
        // aquí és on és més espessa, i va marxant a mesura que es resolen les missions
        if (!Estat.flag('ocellaireVencut')) {
            const nivell = () => nivellBoira();
            const vel = this.add.graphics().setDepth(5000);
            vel.fillGradientStyle(0x9a5ae8, 0x9a5ae8, 0x9a5ae8, 0x9a5ae8, 0, 0, 0.5, 0.5).fillRect(0, 440 + D, 1600, 800);
            this.tweens.add({ targets: vel, alpha: 0.65 * nivell(), yoyo: true, repeat: -1, duration: 3600, ease: 'Sine.easeInOut' });
            [[800, 590, 1500, 110, 4], [800, 530, 760, 90, 3.2], [420, 660, 800, 120, 3], [1180, 660, 800, 120, 3], [800, 730, 1500, 100, 3]].forEach(([x, y, w, h, q]) => {
                const f = this.boira(x, y + D, w, h, q * nivell());
                f.setDepth(5100);
            });
        }

        this.enemic('visitant', 1100, 700 + D);
        this.enemic('escolopendra', 400, 700 + D);
        this.sortida(0, 450 + D, 14, 140, 'ZonaPlaca', 'monestir');
        this.sortida(1400, 0, 160, 14, 'ZonaCementiri', 'monestir');
        this.sortida(1586, 490 + D, 14, 140, 'ZonaSantAntoni', 'monestir');
    }
}

// ---------------- CREU DE L'APARICIÓ I BASSADÒRIA ----------------
class ZonaCreu extends ZonaBase {
    constructor() {
        super('ZonaCreu', {
            nom: 'La Bassadòria',
            amplada: 1600,
            alcada: 1000,
            entrades: {
                placa:    { x: 1180, y: 70, dir: 'avall' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1600, 1000, -1100);
        this.terra('cami', 1100, 0, 160, 720);          // des de la plaça (nord)
        this.terra('cami', 300, 600, 960, 140);
        this.terra('pedra', 830, 710, 360, 190);        // replà de pedra davant la creu

        // Creu de l'Aparició (sense cap tanca ni mur al darrere)
        this.posar('creu', 1010, 900, { col: { w: 56, h: 24 } });
        this.interactiu(1010, 905, RADI_OBJECTE, DIALEGS.creu, { altura: 400 });
        [[760, 860], [1260, 860]].forEach(([x, y]) => this.posar('arbre', x, y, { col: { w: 34, h: 16 } }).setTint(0xcfe08a));   // plàtans

        // Bassadòria: una bassa molt gran (520 d'ample, uns quatre Ineus), sense mur al darrere; plàtans de tardor als costats
        [[330, 560]].forEach(([x, y]) => this.posar('arbre', x, y, { col: { w: 34, h: 16 } }).setTint(0xe0b868));
        // Dos dibuixos de la mateixa bassa: tèrbola i amb boira, i neta (després del Cant de l'Aurora)
        this.bassa = this.posar(Estat.flag('bassadoriaNeta') ? 'bassadoria' : 'bassadoria_boira', 700, 560, { fonsY: 300 });   // profunditat de la vora del fons: els gripaus de dins l'aigua es veuen
        this.colisio(700, 400, 600, 170);             // l'anella de pedra (una el·lipse feta de tres franges)
        this.colisio(700, 290, 430, 60);
        this.colisio(705, 515, 390, 80);              // portella, jardinera i abeurador
        this.interactiu(700, 480, 260, DIALEGS.bassadoria, { altura: 110, enTancar: () => Estat.posaFlag('flauta_bassadoria') });    // la tarota s'obre sola en acabar el text (zona_base: tarotaDespresDeText)
        this.llocFlauta('bassadoria', 700, 470, 340, true, () => !Estat.flag('bassadoriaNeta'));
        if (!Estat.flag('bassadoriaNeta')) this.boiraBass = this.boira(700, 360, 480, 120, 3.5);

        this.cartell(1065, 440, () => ({ pagines: [{ qui: 'Cartell', text: '↑ Plaça del Santuari' }] }));      // a la vora esquerra del camí, no al mig
        this.arbres([[150, 180], [320, 260], [1450, 220], [1500, 780], [100, 520], [190, 640], [1400, 440], [1480, 600], [260, 440]]);

        this.enemic('escolopendra', 1350, 300);
        // Els gripaus corromputs s'escapen de la Bassadòria: n'hi ha per tota l'escena i, a mesura que en caiguin,
        // en surten de nous de la bassa. Quan la boira se'n va (aigua neta) ja no en surten més.
        this.propGripau = this.time.now + 2500;
        if (!Estat.flag('bassadoriaNeta')) {
            [[560, 600], [1330, 620], [800, 860], [1180, 300]].forEach(([x, y]) => this.enemic('gripau', x, y));
        }
        this.sortida(1100, 0, 160, 14, 'ZonaPlaca', 'creu');
    }

    teEfecteMelodia(nom) {
        return nom === 'aurora' && !Estat.flag('bassadoriaNeta') && Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, 700, 470) < 520;
    }

    // Efecte clàssic de deformació d'ones sinusoïdals per línies d'escaneig (raster / sine-wave de SNES)
    // durant la transformació de la Bassadòria tèrbola a neta
    transicioBassadoriaSNES(enAcabar) {
        const texBoira = this.textures.get('bassadoria_boira');
        const texNeta = this.textures.get('bassadoria');
        const imgBoira = texBoira ? texBoira.getSourceImage() : null;
        const imgNeta = texNeta ? texNeta.getSourceImage() : null;

        if (!imgBoira || !imgNeta) {
            // Reserva per si no s'han pogut llegir les imatges d'origen
            const neta = this.posar('bassadoria', 700, 560).setDepth(this.bassa.depth + 0.5).setAlpha(0);
            this.tweens.add({ targets: neta, alpha: 1, duration: 2200, onComplete: () => {
                this.bassa.destroy(); this.bassa = neta;
                if (enAcabar) enAcabar();
            } });
            return;
        }

        const W_DISP = 620;
        const H_DISP = (this.bassa && this.bassa.displayHeight) ? Math.round(this.bassa.displayHeight) : 384;
        const MARGIN = 48;
        const CANVAS_W = W_DISP + MARGIN * 2;
        const CANVAS_H = H_DISP;

        const canvas = document.createElement('canvas');
        canvas.width = CANVAS_W;
        canvas.height = CANVAS_H;
        const ctx = canvas.getContext('2d');

        const texKey = 'transicio_bassa_' + Date.now();
        this.textures.addCanvas(texKey, canvas);

        const sprTrans = this.add.image(700, 560, texKey)
            .setOrigin(0.5, 1)
            .setDepth(this.bassa.depth + 0.1);
        this.bassa.setVisible(false);

        // Màscara ovalada que s'ajusta exactament a la silueta de la Bassadòria:
        // impedeix que cap píxel ni vora quadrada pugui sortir fora de l'oval
        const mascG = this.make.graphics({ x: 0, y: 0, add: false });
        mascG.fillStyle(0xffffff, 1).fillEllipse(700, 560 - H_DISP * 0.46, W_DISP * 0.96, H_DISP * 0.88);
        sprTrans.setMask(mascG.createGeometryMask());

        // Espurnes de llum mística sobre la làmina d'aigua ovalada de la bassa
        const espurnes = this.add.particles(700, 420, 'espurna', {
            emitZone: { type: 'random', source: new Phaser.Geom.Ellipse(0, 0, 360, 120) },
            speed: { min: 20, max: 80 },
            scale: { start: 0.32, end: 0.05 },
            alpha: { start: 0.9, end: 0 },
            tint: [0xffea88, 0x7ae8ff, 0xffffff],
            lifespan: 1100,
            frequency: 45,
            blendMode: 'ADD'
        }).setDepth(this.bassa.depth + 0.5);

        this.time.delayedCall(2500, () => {
            espurnes.stop();
            this.time.delayedCall(1200, () => espurnes.destroy());
        });

        const swBoira = imgBoira.width, shBoira = imgBoira.height;
        const swNeta = imgNeta.width, shNeta = imgNeta.height;
        const pas = 2; // línies de 2px: màxima resolució i sensació d'efecte de línies d'escaneig SNES pur

        const anim = { prog: 0, fase: 0 };
        this.tweens.add({
            targets: anim,
            prog: 1,
            fase: Math.PI * 7,
            duration: 2600,
            ease: 'Linear',
            onUpdate: () => {
                ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
                ctx.save();
                // Retalla estrictament a l'oval de la bassadòria: elimina qualsevol caixa o vora quadrada
                ctx.beginPath();
                ctx.ellipse(CANVAS_W / 2, CANVAS_H * 0.54, W_DISP * 0.48, H_DISP * 0.44, 0, 0, Math.PI * 2);
                ctx.clip();

                const k = anim.prog;
                // Amplitud d'ona sinusoïdal: arrenca a 0, arriba a ~26px al punt central i decau a 0
                const amp = Math.sin(k * Math.PI) * 26;
                const freq = 0.052;
                const fase = anim.fase;

                // Fosa creuada de la corrupció cap a l'aigua neta
                const aBoira = Math.max(0, Math.min(1, (0.6 - k) / 0.35));
                const aNeta = Math.max(0, Math.min(1, (k - 0.35) / 0.35));

                for (let y = 0; y < H_DISP; y += pas) {
                    // La base de la bassa toca a terra i queda fixa; el cos i l'aigua de la bassa s'ondulen
                    const factorFix = Math.min(1, Math.max(0, (H_DISP - 8 - y) / 45));
                    const dx = MARGIN + (Math.sin(y * freq + fase) * amp
                                      + Math.cos(y * freq * 0.45 - fase * 0.8) * (amp * 0.35)) * factorFix;
                    const syB = (y / H_DISP) * shBoira;
                    const syN = (y / H_DISP) * shNeta;
                    const sHB = (pas / H_DISP) * shBoira;
                    const sHN = (pas / H_DISP) * shNeta;

                    if (aBoira > 0) {
                        ctx.globalAlpha = aBoira;
                        ctx.drawImage(imgBoira, 0, syB, swBoira, sHB, dx, y, W_DISP, pas);
                    }
                    if (aNeta > 0) {
                        ctx.globalAlpha = aNeta;
                        ctx.drawImage(imgNeta, 0, syN, swNeta, sHN, dx, y, W_DISP, pas);
                    }
                }
                ctx.restore();
                ctx.globalAlpha = 1.0;
                this.textures.get(texKey).refresh();
            },
            onComplete: () => {
                sprTrans.destroy();
                this.textures.remove(texKey);
                this.bassa.destroy();
                this.bassa = this.posar('bassadoria', 700, 560, { fonsY: 300 });
                if (enAcabar) enAcabar();
            }
        });
    }

    // La Bassadòria reacciona al Cant de l'Aurora (només quan l'Ineu és a prop)
    enMelodia(nom) {
        if (nom !== 'aurora') return false;
        const prop = Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, 700, 470) < 520;
        if (!prop) return false;
        if (Estat.flag('bassadoriaNeta')) { this.ineuDiu("L'aigua ja és clara."); return true; }

        if (this.boiraBass) this.boiraBass.stop();
        this.enemics.filter(e => e.tipus === 'gripau' && !e.mort).forEach(e => {
            e.mort = true; e.spr.body.enable = false;
            this.boiraPuf(e.spr.x, e.spr.y);
            this.tweens.add({ targets: [e.spr, e.ombra], alpha: 0, duration: 600, onComplete: () => this.retirar(e) });
        });

        // Efecte de transició amb deformació d'ones estil SNES JRPG
        this.transicioBassadoriaSNES(() => {
            this.ui().obrirDialeg(DIALEGS.bassadoriaNeta(Estat), () => Estat.desar());
        });
        return true;
    }

    actualitzar(ara) {
        if (Estat.flag('bassadoriaNeta') || ara < this.propGripau) return;
        const vius = this.enemics.filter(e => e.tipus === 'gripau' && !e.mort).length;
        if (vius >= 5) return;
        this.propGripau = ara + 3800;
        // Surt de la bassa d'un salt i s'escampa per l'escena
        const sx = 820 + Math.random() * 380, sy = 720;
        let dx, dy, intents = 0;
        do { dx = 150 + Math.random() * 1300; dy = 280 + Math.random() * 600; intents++; }
        while (intents < 12 && (dx > 680 && dx < 1340 && dy > 560 && dy < 920));       // no tornar a caure a la bassa
        this.enemic('gripau', sx, sy, { sortida: true, salt: { x: dx, y: dy } });
    }
}

// ---------------- ELS ARCS DE LA CASA GRAN (façana, escalinata i porxo d'arcs) ----------------
class ZonaCasaGran extends ZonaBase {
    constructor() {
        super('ZonaCasaGran', {
            nom: 'Els arcs de la Casa Gran',
            amplada: 1600,
            alcada: 1100,
            entrades: {
                placa:  { x: 1540, y: 930, dir: 'esquerra' },
                oest:   { x: 60,   y: 930, dir: 'dreta' },
                porxo:  { x: 700,  y: 600 + 70, dir: 'avall' }
            }
        });
    }

    construir() {
        const D = 70;       // la façana (i tot el que hi va lligat) baixa una mica perquè les arcades no quedin tallades per dalt
        this.terra('llamborda', 0, 0, 1600, 1100, -1100);   // tota l'escena és de pedra (la mateixa plaça empedrada), sense gespa

        // Façana gran (1250 d'ample): la reixa del porxo (arc del mig) queda a x=700, amb la base a y≈563 i ~170 d'alt
        const facana = this.posar('casa_gran', 700, 727 + D, { fonsY: 560 + D });
        // Parets: tot el que és darrere el terra de les arcades (y<572) és mur; les piles i els sòcols laterals també.
        // Només es pot pujar per l'escalinata (x 355-1050) i entrar a les arcades pels buits entre piles.
        this.blocDarrere(362, 575, 572 + D);                                                               // paret darrere l'arcada esquerra
        this.blocDarrere(1037, 575, 572 + D);                                                              // paret darrere l'arcada dreta
        this.blocDarrere(700, 100, 544 + D);                                                               // dintell sobre la reixa del porxo
        this.colisio(227, 650 + D, 305, 156);     // mur lateral esquerre recte, sense graons al hitbox
        this.colisio(1172, 650 + D, 305, 156);    // mur lateral dret recte
        this.colisio(585, 592 + D, 60, 40);         // pila entre l'arc esquerre i el del mig
        this.colisio(817, 592 + D, 55, 40);         // pila entre l'arc del mig i el dret
        // La reixa del porxo, tancada des de fa generacions: per fora no hi ha manera d'entrar
        if (Estat.flag('reixaObertaDins') || Estat.flag('ocellaireVencut')) {
            // Un cop s'ha aixecat la barra per dins, la reixa queda oberta (els batents giren en acostar-s'hi) i es pot entrar a la Casa Gran
            this.portaReixaFora = this.portaAnimada({ x: 700, top: 400 + D, bottom: 573 + D, ample: 107, fons: 560 + D, arc: true, retall: facana });
            this.sortida(658, 548 + D, 84, 16, 'ZonaCasaGranInt', 'porxo');
        } else this.interactiu(700, 585 + D, RADI_OBJECTE, DIALEGS.portaReixa, { altura: 190 });

        // Cartell que indica la Taverna, a la vora de la sortida de l'esquerra
        this.cartell(170, 880, () => ({ pagines: [{ qui: 'Cartell', text: '← La Taverna i l\'Hostatgeria\n→ La Plaça del Santuari' }] }));

        // Arbres només a la dreta, deixant el camí lliure
        this.arbres([[1480, 300], [1530, 520], [1470, 740]]);

        // Les sortides són a sota de la casa (la façana no les tapa)
        this.sortida(1586, 880, 14, 160, 'ZonaPlaca', 'casaGran');
        this.sortida(0, 880, 14, 160, 'ZonaTaverna', 'casagran');
    }
}


// ---------------- SALA DEL TRESOR (passatge secret de la cantonada Monestir-Santuari) ----------------
class ZonaTresor extends ZonaBase {
    constructor() {
        super('ZonaTresor', {
            nom: 'L\'oratori amagat',
            amplada: 640,
            alcada: 760,
            colorFons: '#140e0a',
            pacifica: true,
            entrades: { porta: { x: 320, y: 690, dir: 'amunt' } }
        });
    }

    // Un oratori petit dels monjos, amagat darrere la pedra que escolta: absis amb el relleu de les pedres que escolten, la
    // tarima amb l'arqueta-reliquiari entre dos canelobres, un raig de llum que hi cau, un mosaic rodó al terra i un faristol
    construir() {
        const W = 640, H = 760, M = 40, YP = 250;
        this.terra('pedra', M, YP - 10, W - 2 * M, H - YP + 10, -1100).setTint(0xa89480);
        this.add.image(0, 0, 'paret_oratori').setOrigin(0).setScale(1 / RES).setDepth(-995);
        const murs = this.add.graphics().setDepth(-990);
        murs.fillStyle(0x2a1f18, 1).fillRect(0, YP, M, H - YP).fillRect(W - M, YP, M, H - YP);
        murs.fillStyle(0x000000, 0.35).fillRect(M, YP, 14, H - YP).fillRect(W - M - 14, YP, 14, H - YP);      // ombra dels murs al terra
        this.colisio(M / 2, H / 2, M, H);
        this.colisio(W - M / 2, H / 2, M, H);
        this.colisio(W / 2, (YP + 10) / 2, W, YP + 10);
        this.colisio((M + W / 2 - 50) / 2, H - 6, W / 2 - 50 - M, 12);
        this.colisio((W / 2 + 50 + W - M) / 2, H - 6, W / 2 - 50 - M, 12);

        // Mosaic rodó al terra: anells de tessel·les, com les ones del relleu
        const mo = this.add.graphics().setDepth(-1050), MX = W / 2, MY = 470;
        [[118, 0x6a5240], [104, 0xb89a6a], [86, 0x3a4a5a], [70, 0xc8b088], [52, 0x8a4a30], [36, 0xd8c8a0], [18, 0x3a4a5a]].forEach(([r, c]) => {
            mo.fillStyle(c, 0.9).fillEllipse(MX, MY, r * 2, r * 1.2);
        });
        for (let k = 0; k < 48; k++) { const a = k / 48 * Math.PI * 2; mo.lineStyle(1.2, 0x2a1c10, 0.35).lineBetween(MX + Math.cos(a) * 36, MY + Math.sin(a) * 21.6, MX + Math.cos(a) * 118, MY + Math.sin(a) * 70.8); }
        mo.lineStyle(3, 0x2a1c10, 0.6).strokeEllipse(MX, MY, 236, 141.6);

        // Tarima de dos graons davant l'absis
        const t = this.add.graphics().setDepth(-1000);
        [[YP, 340, 0xb8aa90], [YP + 26, 380, 0x9a8c74]].forEach(([y, a, c]) => {
            t.fillStyle(c, 1).fillRect(W / 2 - a / 2, y, a, 26).lineStyle(2, 0x1c1610, 1).strokeRect(W / 2 - a / 2, y, a, 26);
            t.fillStyle(0xfff0d8, 0.3).fillRect(W / 2 - a / 2 + 2, y + 2, a - 4, 3);
        });
        // L'arqueta-reliquiari, al mig de la tarima
        const obert = Estat.flag('cofreTresor');
        this.reliquiari = this.posar(obert ? 'reliquiari_obert' : 'reliquiari', W / 2, YP + 34, { col: { w: 110, h: 24 } });
        this.interactiu(W / 2, YP + 44, RADI_OBJECTE, DIALEGS.cofreTresor, { altura: 120 });
        // El raig de llum de la finestreta de l'absis, fins a l'arqueta, amb pols que sura
        const raig = this.add.graphics().setDepth(79000).setBlendMode('ADD');
        raig.fillStyle(0xfff0c0, 0.09).fillPoints([{ x: W / 2 - 4, y: 30 }, { x: W / 2 + 4, y: 30 }, { x: W / 2 + 70, y: YP + 40 }, { x: W / 2 - 70, y: YP + 40 }], true);
        raig.fillStyle(0xfff0c0, 0.07).fillPoints([{ x: W / 2 - 2, y: 30 }, { x: W / 2 + 2, y: 30 }, { x: W / 2 + 36, y: YP + 40 }, { x: W / 2 - 36, y: YP + 40 }], true);
        this.tweens.add({ targets: raig, alpha: 0.65, yoyo: true, repeat: -1, duration: 2200, ease: 'Sine.easeInOut' });
        this.add.particles(W / 2, 150, 'espurna', { x: { min: -50, max: 50 }, y: { min: -90, max: 120 }, speedY: { min: -6, max: 6 }, speedX: { min: -5, max: 5 }, lifespan: 3500,
            scale: { start: 0.2, end: 0 }, alpha: { start: 0.7, end: 0 }, tint: 0xfff2c8, frequency: 220, blendMode: 'ADD' }).setDepth(79001);

        // Canelobres a banda i banda de la tarima, amb la claror de les espelmes
        [W / 2 - 150, W / 2 + 150].forEach((x, i) => {
            this.posar('canelobre', x, YP + 60, { col: { w: 30, h: 14 } });
            const llum = this.add.circle(x, YP + 60 - 100, 70, 0xffb050, 0.12).setDepth(YP + 59).setBlendMode('ADD');
            this.tweens.add({ targets: llum, alpha: 0.2, scale: 1.08, yoyo: true, repeat: -1, duration: 320 + i * 90, ease: 'Sine.easeInOut' });
        });
        // Faristol amb el llibre obert, a la dreta
        this.posar('faristol', W - 120, 470, { col: { w: 50, h: 16 } });
        this.interactiu(W - 120, 480, RADI_OBJECTE, DIALEGS.faristolOratori, { altura: 120 });
        // Un banc de pedra a l'esquerra i unes pedres caigudes al racó
        const banc = this.add.graphics().setDepth(560);
        banc.fillStyle(0x000000, 0.3).fillEllipse(110, 562, 120, 14);
        banc.fillStyle(0x9a8c74, 1).fillRect(56, 520, 110, 22).lineStyle(2, 0x1c1610, 1).strokeRect(56, 520, 110, 22);
        banc.fillStyle(0x7a6c58, 1).fillRect(62, 542, 14, 18).fillRect(146, 542, 14, 18).strokeRect(62, 542, 14, 18).strokeRect(146, 542, 14, 18);
        banc.fillStyle(0xfff0d8, 0.3).fillRect(58, 522, 106, 3);
        this.colisio(111, 548, 116, 26);
        [[560, 660, 0.45], [584, 676, 0.35], [80, 690, 0.4]].forEach(([x, y, e]) => this.posar('roca', x, y, { escala: e, col: { w: 40 * e * 2, h: 14 } }));

        // L'escala d'entrada, amb la claror de la plaça que baixa
        const esc = this.add.graphics().setDepth(H);
        [0, 1, 2].forEach(k => {
            const y = H - 14 - k * 12;
            esc.fillStyle([0xc8b898, 0xb8a888, 0xa89878][k], 1).fillRect(W / 2 - 50 + k * 4, y, 100 - k * 8, 12).lineStyle(1.5, 0x1c1610, 1).strokeRect(W / 2 - 50 + k * 4, y, 100 - k * 8, 12);
        });
        const dia = this.add.graphics().setDepth(H - 1).setBlendMode('ADD');
        dia.fillStyle(0xfff0c0, 0.08).fillPoints([{ x: W / 2 - 50, y: H }, { x: W / 2 + 50, y: H }, { x: W / 2 + 120, y: H - 200 }, { x: W / 2 - 120, y: H - 200 }], true);

        this.add.rectangle(W / 2, H / 2, W, H, 0x1a0c04, 0.12).setDepth(80000);
        this.sortida(W / 2 - 40, H - 14, 80, 14, 'ZonaPlaca', 'tresor');
    }

    // L'arqueta s'obre: la tapa s'aixeca amb un esclat de llum daurada (l'Ineu no fa res)
    obrirReliquiari(fet) {
        const r = this.reliquiari;
        Sfx.secret();
        this.cameras.main.shake(200, 0.002);
        const nova = this.add.image(r.x, r.y, 'reliquiari_obert').setOrigin(r.originX, r.originY).setScale(r.scaleX).setDepth(r.depth + 1).setAlpha(0);
        this.tweens.add({ targets: nova, alpha: 1, duration: 450, onComplete: () => { r.setTexture('reliquiari_obert'); nova.destroy(); } });
        this.llum(r.x, r.y - 70, 0xffe08a);
        this.esperar(900, fet);
    }
}
