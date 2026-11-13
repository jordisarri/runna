/**
 * ELS ARCS DE LA CASA GRAN (façana, escalinata i porxo) i la SALA DEL TRESOR (passatge secret entre el Monestir i el Santuari).
 */

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
        this.reliquiari = this.posar(obert ? 'reliquiari_obert' : 'reliquiari', W / 2, YP + 34, { col: { w: 110, h: 24 }, opac: true });
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
