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
        this.interactiu(640, ESG.retY + 36, 130, DIALEGS.sagrari, { altura: 170 });     // el sagrari, al mig del retaule (fragment 2)
        this.posar('altar', 640, ESG.retY + 128, { col: { w: 130, h: 30 } });
        this.interactiu(640, ESG.retY + 140, 90, () => this.rezar(), { altura: 100 });

        // Portes del peu del retaule: totes dues tancades. Quan el Pare Daniel diu que el rellotge s'ha aturat (rellotgeDit)
        // s'obre la de la dreta, que duu a la torre i a la Sala del Rellotge. L'esquerra continua tancada.
        this.portaRellotge = false;
        this.obrirPortaRellotge(false);
        this.interactiu(ESG.portaEsq, ESG.retY + 50, 90, () => ({
            pagines: [{ qui: '', text: 'La porta de l\'esquerra del retaule és tancada amb clau. Fa olor de cera vella i de pols.' }]
        }), { altura: 150 });
        this.interactiu(ESG.portaDx, ESG.retY + 50, 90, () => ({
            pagines: [{ qui: '', text: 'La porta de la dreta del retaule és tancada amb clau. Per sota s\'escola un corrent d\'aire fred, com si pugés d\'una escala.' }]
        }), { altura: 150, actiu: () => !this.portaRellotge });

        // Orgue (la Pianista seu a l'orgue) i el Pare Daniel, que dirigeix el cor
        this.orgue = this.posar('orgue', 950, ESG.retY + 330, { col: { w: 110, h: 50 } });
        this.npc('pianista', 950, ESG.retY + 400, DIALEGS.pianista);
        this.npc('pare_daniel', 360, ESG.retY + 190, DIALEGS.pareDaniel, { flipX: false });

        // Bancs, vistos per darrere (amb respatller), mirant cap a l'altar
        // (files ben separades: entre banc i banc es veu el terra i s'hi pot passar)
        const bancs = [ESG.retY + 230, ESG.retY + 380, ESG.retY + 530];
        bancs.forEach(y => {
            this.posar('banc_esglesia', 470, y, { col: { w: 140, h: 16 } });
            this.posar('banc_esglesia', 810, y, { col: { w: 140, h: 16 } });
        });

        // Llum de les vidrieres
        this.add.rectangle(640, A / 2, 800, A, 0xffd38a, 0.05).setDepth(80000);

        this.sortida(600, A - 20, 80, 20, 'ZonaPlaca', 'esglesia');
        if (Estat.flag('epilegPendent') && !Estat.flag('epilegFet')) this.prepararEpileg();
    }

    // ---------------- EPÍLEG: «Torna el cant» ----------------
    // Tothom és al Santuari: els nens riuen, l'orgue torna a sonar, el poble canta... i un tub de l'orgue salta.
    prepararEpileg() {
        this.epileg = true;
        const R = ESG.retY;
        [['nen_uri', 560, R + 160], ['nen_flam', 640, R + 175], ['nen_sardin', 720, R + 160],
         ['pare_jordi', 800, R + 200], ['germa_francesc', 470, R + 205], ['pare_alcui', 400, R + 270],
         ['monja_pains', 420, R + 360], ['monja_phili', 520, R + 360], ['monja_charm', 470, R + 300],
         ['tieta', 760, R + 360], ['tieta2', 860, R + 360], ['frederic', 420, R + 510], ['josep', 520, R + 510],
         ['garf', 760, R + 510], ['isidre', 860, R + 510], ['jaumeta', 1000, R + 520]
        ].forEach(([k, x, y]) => { if (this.textures.exists(k) && !(this.npcs && this.npcs[k])) this.npc(k, x, y, DIALEGS.gentEpileg, { flipX: x > 640 }); });
        this.cameras.main.fadeIn(1200, 0, 0, 0);
    }

    actualitzar() {
        this.obrirPortaRellotge(true);
        if (this.epileg && !this.epilegEngegat) { this.epilegEngegat = true; this.time.delayedCall(900, () => this.ferEpileg()); }
    }

    ferEpileg() {
        const R = ESG.retY, nens = ['nen_uri', 'nen_flam', 'nen_sardin'];
        const gent = Object.keys(this.npcs).filter(k => !nens.includes(k) && k !== 'pianista' && k !== 'pare_jordi');
        const tots = Object.keys(this.npcs).filter(k => k !== 'pianista');
        const riure = (llista, f) => { Sfx.riure(); llista.forEach((k, i) => { this.npcSalta(k, null, 2); this.bombolla(k, ['Ha ha!', 'Ha ha ha!', 'Hi hi!'][i % 3], null, 1300); }); this.esperar(1500, f); };
        this.ui().obrirDialeg({ pagines: [{ fer: (z, fet) => z.seq([
            f => z.ineuVa(640, R + 330, f, 150),
            f => riure(nens, f),
            // L'orgue torna a sonar (el Cant del Miracle) i tothom canta
            f => {
                z.npcFeina('pianista', 4200, 'notes');
                gent.forEach(k => z.npcFeina(k, 3800, 'notes'));
                const acords = [[330, 415, 494], [494, 622, 740], [392, 494, 587], [494, 622, 740], [330, 415, 494]];
                acords.forEach((a, i) => this.time.delayedCall(i * 750, () => Sfx.orgue(a, 0.9)));
                this.esperar(4400, f);
            },
            // ... i un tub fa una nota de pega i surt disparat
            f => {
                Sfx.pet();
                this.cameras.main.shake(300, 0.006);
                const o = this.orgue, x0 = o.x + 30, y0 = o.y - o.displayHeight + 10;
                const tub = this.add.rectangle(x0, y0, 12, 46, 0xd8b860).setStrokeStyle(2, 0x5a4020).setDepth(99000);
                this.boiraPuf(x0, y0);
                this.tweens.add({ targets: tub, x: 700, duration: 1100, ease: 'Linear' });
                this.tweens.add({ targets: tub, y: y0 - 160, duration: 450, ease: 'Quad.easeOut', yoyo: false, onComplete: () => {
                    this.tweens.add({ targets: tub, y: R + 340, duration: 650, ease: 'Bounce.easeOut', onComplete: () => { Sfx.cop(false); this.tub = tub; } });
                } });
                this.tweens.add({ targets: tub, angle: 540, duration: 1100 });
                tots.forEach(k => this.bombolla(k, '!', null, 900));
                this.esperar(1700, f);
            },
            f => riure(tots, f),
            f => z.npcVa('pare_jordi', 720, R + 330, f, 120),
            f => z.npcMira('pare_jordi', 'ineu', f),
            f => z.bombolla('pare_jordi', 'Començaràs reparant-lo.', f, 2600),
            f => z.bombolla('ineu', '...!', f, 1000),
            f => riure(tots, f),
            f => { this.cameras.main.fadeOut(1800, 0, 0, 0); this.esperar(1900, f); }
        ], fet) }] }, () => {
            Estat.posaFlag('epilegFet');
            Estat.posaFlag('epilegPendent', false);
            Estat.dades.zona = 'ZonaEsglesia'; Estat.dades.entrada = 'porta'; Estat.dades.x = null; Estat.dades.y = null;
            Estat.posaObjectiu("El Santuari torna a cantar. (I l'orgue té un tub de menys.)");
            Estat.desar();
            this.canviant = true;
            Joc.aturarTot(this);
            this.scene.stop('UI');
            this.scene.start('Credits');
        });
    }

    // Obre la porta de la dreta del retaule si el Pare Daniel ja ha parlat del rellotge (també a mitja visita)
    obrirPortaRellotge(avis) {
        if (this.portaRellotge || !(Estat.flag('rellotgeDit') || Estat.flag('rellotgeReparat'))) return;   // (partides velles: ja hi havien pujat)
        this.portaRellotge = true;
        if (!Estat.flag('rellotgeReparat')) {                       // una llum daurada i unes espurnes assenyalen la porta de la torre
            const x = ESG.portaDx, y = ESG.retY + 50;
            this.cuaRellotge = this.add.ellipse(x, y - 40, 150, 210, 0xffd060, 0.34).setDepth(ESG.retY + 90).setBlendMode('ADD');
            this.tweens.add({ targets: this.cuaRellotge, alpha: 0.04, yoyo: true, repeat: -1, duration: 1000, ease: 'Sine.easeInOut' });
            this.add.particles(x, y - 60, 'espurna', { x: { min: -40, max: 40 }, speedY: { min: -40, max: -14 }, lifespan: 1700, scale: { start: 0.32, end: 0 },
                alpha: { start: 0.9, end: 0 }, tint: [0xffe08a, 0xffffff], frequency: 380, blendMode: 'ADD' }).setDepth(ESG.retY + 91);
        }
        this.retaule.setTexture('retaule_obert').setScale(this.textures.get('retaule_obert').customData.escala || 1 / RES);   // el gràfic amb la porta oberta
        this.sortida(ESG.portaDx - 36, ESG.retY - 14, 72, 20, 'ZonaTorre', 'baix');
        if (avis) {
            Sfx.secret();
            this.flotant(ESG.portaDx, ESG.retY - 170, 'La porta de la dreta del retaule ja és oberta', '#ffe9a8');
        }
    }


    // Altar de pedra: l'Ineu s'agenolla, reposa (els grans del rosari tornen a brillar) i la partida es desa
    rezar() {
        const i = this.ineu, base = i.scaleY;
        this.tweens.add({ targets: i, scaleY: base * 0.82, duration: 500, ease: 'Sine.easeOut' });
        return {
            pagines: [
                { qui: '', text: 'Una calma tèbia et puja pel pit. Els grans del teu rosari tornen a brillar i la partida queda desada.' }
            ],
            enAcabar: () => {
                this.tweens.add({ targets: i, scaleY: base, duration: 400, ease: 'Sine.easeInOut' });
                Estat.dades.vida = Estat.dades.corsMax * 2;
                this.ui().actualitzarHUD();
                this.guardarPosicio();
                this.ui().notifica('Partida desada');
                Estat.desar();
                const p = this.add.particles(i.x, i.y - 60, 'espurna', {
                    speed: { min: 20, max: 90 }, angle: { min: 230, max: 310 }, lifespan: 1100,
                    scale: { start: 0.3, end: 0 }, alpha: { start: 0.9, end: 0 }, tint: [0xffe6a8, 0xf8c060], blendMode: 'ADD', quantity: 18, emitting: false
                }).setDepth(i.depth + 1);
                p.explode(18);
                this.time.delayedCall(1300, () => p.destroy());
            }
        };
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
            amplada: 1600,
            alcada: 800 + D,
            entrades: { placa: { x: 60, y: 520 + D, dir: 'dreta' }, rebedor: { x: 800, y: 494, dir: 'avall' }, cementiri: { x: 1480, y: 70, dir: 'avall' }, santantoni: { x: 1530, y: 560 + D, dir: 'esquerra' } }
        });
    }

    construir() {
        const D = MONESTIR_DY;
        this.terra('herba', 0, 0, 1600, 800 + D, -1100);
        this.terra('llamborda', 0, 430 + D, 1600, 370);  // la mateixa plaça empedrada, fins a baix de tot
        this.terra('cami', 1400, 0, 160, 460 + D);         // cap al cementiri (darrere el Monestir i el Santuari)

        // 800 d'ample: la façana surt per dalt de la pantalla i només es veu a partir de les últimes fileres de teula
        // La façana: el portal del mig duu a la biblioteca (on treballa el Pare Alcuí)
        // La imatge va al fons (fonsY): l'Ineu puja l'escalinata per davant i arriba a la porta, que es veu obrir-se i el duu al Rebedor
        this.posar('monestir', 800, 440 + D, { fonsY: 330 });
        this.colisio(577, 387, 354, 115);
        this.colisio(1023, 387, 354, 115);
        this.blocDarrere(800, 790, 405);
        this.sortida(754, 440, 92, 30, 'ZonaMonestirRebedor', 'porta');
        this.portaAnimada({ x: 800, top: 325, bottom: 435, ample: 74, fons: 335, color: 0x6a4328, panell: 0x7a5233, vora: 0x2a1608, ferro: true });   // el portal romànic: els batents de fusta s'obren cap endins
        // Xiprers alts a l'esquerra del portal i una conífera a la dreta (com a la foto del monestir)
        [[440, 445, 1.7], [492, 452, 1.5]].forEach(([x, y, e]) => this.posar('xiprer', x, y + D, { escala: e, col: { w: 26, h: 12 } }));
        this.posar('xiprer', 1165, 450 + D, { escala: 1.9, col: { w: 30, h: 12 } });

        this.cartell(1368, 450 + D, () => ({ pagines: [{ qui: '', text: '→ Cel·les de Sant Antoni\n↑ El Cementiri (darrere el Monestir i el Santuari)' }] }));
        this.arbres([[160, 250], [330, 200], [1250, 260], [250, 720], [1250, 720], [420, 770], [1520, 760], [1090, 770], [750, 780]].map(([x, y]) => [x, y + D]));

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
        this.terra('cami', 1100, 0, 160, 520);          // des de la plaça (nord)
        this.terra('cami', 300, 440, 960, 140);
        this.terra('pedra', 560, 250, 360, 190);        // replà de pedra davant la creu

        // Creu de l'Aparició (sense cap tanca ni mur al darrere)
        this.posar('creu', 740, 440, { col: { w: 56, h: 24 } });
        this.interactiu(740, 445, 95, DIALEGS.creu, { altura: 400 });
        [[470, 350], [940, 350]].forEach(([x, y]) => this.posar('arbre', x, y, { col: { w: 34, h: 16 } }).setTint(0xcfe08a));   // plàtans

        // Bassadòria: una bassa molt gran (520 d'ample, uns quatre Ineus), sense mur al darrere; plàtans de tardor als costats
        [[700, 930], [1330, 930]].forEach(([x, y]) => this.posar('arbre', x, y, { col: { w: 34, h: 16 } }).setTint(0xe0b868));
        this.posar('bassadoria', 1010, 900, { col: { w: 470, h: 190, dy: -50 } });
        this.interactiu(1010, 755, 280, DIALEGS.bassadoria, { altura: 110, enTancar: () => Estat.posaFlag('flauta_bassadoria') });
        this.llocFlauta('bassadoria', 1010, 755, 340, true, () => !Estat.flag('bassadoriaNeta'));
        if (!Estat.flag('bassadoriaNeta')) this.boiraBass = this.boira(1010, 760, 380, 110, 3.5);

        // L'Home del Carruatge Verd, a la vora del camí
        this.posar('carruatge', 330, 730, { col: { w: 190, h: 50 } });
        this.npc('home_carruatge', 440, 760, DIALEGS.homeCarruatge);

        this.cartell(1180, 480, () => ({ pagines: [{ qui: '', text: '↑ Plaça del Santuari' }] }));
        this.arbres([[150, 180], [320, 260], [1450, 220], [200, 900], [650, 940], [1300, 930], [1500, 780], [100, 520], [190, 640], [1400, 440], [1480, 600], [260, 440]]);

        this.enemic('escolopendra', 500, 300);
        // Aigua neta (després del Cant de l'Aurora)
        this.aiguaNeta = this.add.ellipse(1010, 755, 416, 130, 0x8fd0f0, 0.75).setDepth(901).setVisible(Estat.flag('bassadoriaNeta'));
        // Els gripaus corromputs s'escapen de la Bassadòria: n'hi ha per tota l'escena i, a mesura que en caiguin,
        // en surten de nous de la bassa. Quan la boira se'n va (aigua neta) ja no en surten més.
        this.propGripau = this.time.now + 2500;
        if (!Estat.flag('bassadoriaNeta')) {
            [[560, 600], [1330, 620], [640, 830], [1180, 300]].forEach(([x, y]) => this.enemic('gripau', x, y));
        }
        this.sortida(1100, 0, 160, 14, 'ZonaPlaca', 'creu');

        this.add.rectangle(AMPLE / 2, ALT / 2, AMPLE / ZOOM_CAMERA + 4, ALT / ZOOM_CAMERA + 4, 0x3a1a55, 0.08).setScrollFactor(0).setDepth(90000);
    }

    // La Bassadòria reacciona al Cant de l'Aurora (només quan l'Ineu és a prop)
    enMelodia(nom) {
        if (nom !== 'aurora') return false;
        const prop = Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, 1010, 800) < 520;
        if (!prop) return false;
        if (Estat.flag('bassadoriaNeta')) { this.flotant(1010, 640, "L'aigua ja és clara", '#9fd8ff'); return true; }
        this.aiguaNeta.setVisible(true).setAlpha(0);
        this.tweens.add({ targets: this.aiguaNeta, alpha: 0.75, duration: 1500 });
        if (this.boiraBass) this.boiraBass.stop();
        this.enemics.filter(e => e.tipus === 'gripau' && !e.mort).forEach(e => {
            e.mort = true; e.spr.body.enable = false;
            this.boiraPuf(e.spr.x, e.spr.y);
            this.tweens.add({ targets: [e.spr, e.ombra], alpha: 0, duration: 600, onComplete: () => this.retirar(e) });
        });
        this.ui().obrirDialeg(DIALEGS.bassadoriaNeta(Estat), () => Estat.desar());
        return true;
    }

    actualitzar(ara) {
        if (Estat.flag('bassadoriaNeta') || ara < this.propGripau) return;
        const vius = this.enemics.filter(e => e.tipus === 'gripau' && !e.mort).length;
        if (vius >= 5) return;
        this.propGripau = ara + 3800;
        // Surt de la bassa d'un salt i s'escampa per l'escena
        const sx = 880 + Math.random() * 260, sy = 850;
        let dx, dy, intents = 0;
        do { dx = 150 + Math.random() * 1300; dy = 280 + Math.random() * 600; intents++; }
        while (intents < 12 && (dx > 740 && dx < 1280 && dy > 640 && dy < 880));       // no tornar a caure a la bassa
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
                porxo:  { x: 700,  y: 600, dir: 'avall' }
            }
        });
    }

    construir() {
        this.terra('llamborda', 0, 0, 1600, 1100, -1100);   // tota l'escena és de pedra (la mateixa plaça empedrada), sense gespa

        // Façana gran (1250 d'ample): la reixa del porxo (arc del mig) queda a x=700, amb la base a y≈563 i ~170 d'alt
        this.posar('casa_gran', 700, 727, { fonsY: 560 });
        // Parets: tot el que és darrere el terra de les arcades (y<572) és mur; les piles i els sòcols laterals també.
        // Només es pot pujar per l'escalinata (x 355-1050) i entrar a les arcades pels buits entre piles.
        this.blocDarrere(700, 1250, 572);
        this.colisio(227, 592, 305, 40);        // mur esquerre + pila exterior (arcades)
        this.colisio(1172, 592, 305, 40);       // mur dret + pila exterior
        this.colisio(585, 592, 60, 40);         // pila entre l'arc esquerre i el del mig
        this.colisio(817, 592, 55, 40);         // pila entre l'arc del mig i el dret
        this.colisio(215, 641, 280, 58);        // sòcol de pedra a l'esquerra de l'escalinata
        this.colisio(1190, 641, 270, 58);       // sòcol a la dreta
        this.colisio(170, 699, 190, 58);        // part baixa del sòcol (l'escalinata s'eixampla)
        this.colisio(1230, 699, 190, 58);
        // La reixa del porxo, tancada des de fa generacions: per fora no hi ha manera d'entrar
        this.interactiu(700, 585, 85, DIALEGS.portaReixa, { altura: 190 });

        // Cartell que indica la Taverna, a la vora de la sortida de l'esquerra
        this.cartell(170, 880, () => ({ pagines: [{ qui: '', text: '← La Taverna i l\'Hostatgeria\n→ La Plaça del Santuari' }] }));

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
            nom: 'Passatge secret',
            amplada: 1000,
            alcada: 700,
            colorFons: '#140e0a',
            pacifica: true,
            entrades: { porta: { x: 500, y: 630, dir: 'amunt' } }
        });
    }

    construir() {
        this.terra('pedra', 100, 40, 800, 660, -1100);
        const murs = this.add.graphics().setDepth(-1000);
        murs.fillStyle(0x2a1f18, 1).fillRect(60, 0, 40, 700).fillRect(900, 0, 40, 700);
        murs.fillStyle(0x3a2c22, 1).fillRect(100, 0, 800, 70);
        this.colisio(30, 350, 60, 700);
        this.colisio(970, 350, 60, 700);
        this.colisio(500, 55, 800, 110);
        this.colisio(300, 690, 400, 20);
        this.colisio(700, 690, 400, 20);

        // Tresor del monjo que va obrir aquest racó: un cofre vell entre espelmes
        this.posar('cofre', 500, 250, { col: { w: 50, h: 20 } });
        this.interactiu(500, 255, 85, DIALEGS.cofreTresor, { altura: 80 });
        [[400, 260], [600, 260]].forEach(([x, y], i) => {
            const e = this.posar('espelma', x, y, { fonsY: y });
            this.tweens.add({ targets: e, alpha: 0.7, yoyo: true, repeat: -1, duration: 350 + i * 90 });
        });
        this.add.rectangle(500, 350, 800, 700, 0xffd38a, 0.05).setDepth(80000);
        this.sortida(460, 680, 80, 14, 'ZonaPlaca', 'tresor');
    }
}
