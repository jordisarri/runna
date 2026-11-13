/**
 * L'ERA: encreuament de camins, dos roures i els bancs on seu l'Ineu amb el Galf.
 */

// ---------------- L'ERA ----------------
// Un encreuament de camins de terra (Ermita al nord, Rovellonera a ponent, Jardí a llevant) i, al sud, una gran clariana
// de gespa amb dos roures enormes i, al mig, dos bancs un davant de l'altre.
const ERA_BANC_X = 960, ERA_BANC_N = 700, ERA_BANC_S = 880;   // pujats perquè la caixa de diàleg (a baix) no tapi l'Ineu assegut

class ZonaEra extends ZonaBase {
    constructor() {
        super('ZonaEra', {
            pins: { pinyer: 0.4 },
            nom: "L'Era",
            amplada: 1800,
            alcada: 1300,
            entrades: {
                ermita: { x: 320,  y: 70,  dir: 'avall' },
                jardi:  { x: 1740, y: 565, dir: 'esquerra' },
                rovellonera: { x: 60, y: 565, dir: 'dreta' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1800, 1300, -1100);
        this.add.image(ERA_BANC_X, 800, 'clariana').setDisplaySize(1500, 900).setDepth(-1050);   // gespa tallada de l'era
        this.terra('cami', 240, 0, 160, 630);             // cap a l'Ermita (nord)
        this.terra('cami', 0, 500, 1800, 130);            // de la Rovellonera (oest) al Jardí (est)

        // Dos roures enormes amb dos bancs al mig, un davant de l'altre: el Galf seu al del nord i l'Ineu pot seure al del sud
        // Més grans i sols a la clariana: les copes (de 800 d'ample) emmarquen els bancs i no toquen el camí (queden per sota de y 630) ni les sortides
        this.posar('roure', 480, 1130, { escala: 1.9, col: { w: 100, h: 40 } });
        this.posar('roure', 1440, 1130, { escala: 1.9, col: { w: 100, h: 40 } });
        this.bancNord = this.posar('banc_respatller', ERA_BANC_X, ERA_BANC_N, { col: { w: 140, h: 16 } });
        this.bancSud = this.posar('banc_davant', ERA_BANC_X, ERA_BANC_S, { col: { w: 140, h: 16 } });   // sempre amb respatller (vist per darrere)

        // El Galf, savi inventor: jove, grassonet i ros, assegut al banc de dalt
        this.galf = this.npc('galf', ERA_BANC_X, ERA_BANC_N, DIALEGS.galf);
        this.galf.setDepth(ERA_BANC_N + 1);                       // assegut: el banc queda darrere seu
        // L'Ineu s'asseu i s'hi queda fins que es vulgui aixecar (movent-se)
        // Sense punt d'interacció: l'Ineu s'asseu al banc del sud caminant-hi des del davant (com als de l'església) i llavors el Galf li parla
        this.assegut = false;
        this.bancsEsg = [{ x: ERA_BANC_X, y: ERA_BANC_S, w: 140, cara: 'amunt' }];
        this.puntGalf = { x: ERA_BANC_X, y: ERA_BANC_S, radi: RADI_NPC, altura: 150, npc: this.galf, cameraCossos: [this.bancNord, this.bancSud], dialeg: () => DIALEGS.galf(Estat) };

        // El Follet del Carro Verd i el seu carro de vapor, a la vora sud-oest: és la parada de l'Era (PARADES, js/zona_base.js)

        this.cartell(470, 485, DIALEGS.cartellEra);
        // Poca cosa més: uns quants arbres a la vora del nord, lluny de les sortides i del cartell, perquè els dos roures siguin els protagonistes
        this.arbres([[70, 200], [560, 150], [1000, 170], [1500, 160], [1700, 260], [600, 380], [1200, 390]]);

        this.sortida(240, 0, 160, 14, 'ZonaErmita', 'era');
        this.sortida(1786, 500, 14, 130, 'ZonaJardi', 'era');
        this.sortida(0, 500, 14, 130, 'ZonaCamiRov', 'era');
    }

    // Quan l'Ineu s'asseu al banc (vigilaBancs / seureBanc, comuns amb l'església), el Galf li parla: ja és assegut, així que passa directe a la conversa
    enSeureBanc() {
        Estat.posaFlag('garfBancSegut');
        this.time.delayedCall(350, () => { if (this.assegut && !this.ui().dialeg) this.interactuar(this.puntGalf); });
    }
}
