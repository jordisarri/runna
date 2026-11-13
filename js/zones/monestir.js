/**
 * EL MONESTIR (exterior): façana i porta.
 */

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
        // L'inici del joc: un pla proper de l'Ineu sortint del Monestir mentre es llegeix el primer text; en acabar-lo, la càmera s'obre al zoom normal del joc
        this.enquadrar(this.ineu.x, this.ineu.y - 50, 2.3, 0);
        this.time.delayedCall(700, () => {
            this.ui().obrirDialeg({
                pagines: [
                    { qui: 'Ineu', text: 'Una altra nit de boira... i aquest fred que no marxa. El Pare Jordà em deu estar esperant a la Plaça.' }
                ]
            }, () => { Estat.desar(); this.alliberarCamera(1800); });
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
        this.portaAnimada({ x: 800, top: 325, bottom: 435, ample: 76, fons: 335, color: 0x6a4328, panell: 0x7a5233, vora: 0x2a1608, ferro: true });   // el portal romànic: els batents de fusta s'obren cap endins
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
