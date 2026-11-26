/**
 * LA TAVERNA: façana (exterior), interior, i la galeria de la porta de ferro (Gírgoles).
 */

// ---------------- LA TAVERNA (entre l'Hostatgeria i els arcs de la Casa Gran) ----------------
// Una sola escena de poble: el camí d'est a oest passa per davant la façana de la Taverna. La porta és tancada
// (la Càren no obre a ningú aquests dies; el pas del fons, a la banda de sota, encara no existeix).
class ZonaTaverna extends ZonaBase {
    constructor() {
        super('ZonaTaverna', {
            nom: 'La Taverna',
            amplada: 1600,
            alcada: 1100,
            entrades: { jardi: { x: 60, y: 960, dir: 'dreta' }, casagran: { x: 1540, y: 960, dir: 'esquerra' }, interior: { x: 831, y: 775, dir: 'avall' } }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1600, 1100, -1100);
        this.terra('cami', 0, 880, 1600, 130);              // camí de l'Hostatgeria als arcs de la Casa Gran
        this.terra('llamborda', 0, 740, 1600, 140);          // replà empedrat davant la façana, de vora a vora (d'est a oest)

        // Façana (900 d'ample, tres plantes): la porta és l'arc del mig
        const t = this.taverna = this.posar('taverna', 800, 750, { fonsY: 640 });
        this.colisio(603, 705, 355, 90);
        this.colisio(1040, 705, 340, 90);
        this.blocDarrere(800, 900, 660, Math.max(0, 750 - t.displayHeight));
        // La porta (l'arc del mig): tancada fins que s'hi parla (l\'Eve l'obre des de dins)
        this.colPorta = this.colisio(831, 705, 90, 90);
        if (Estat.flag('tavernaOberta')) { this.obrirPorta(); this.portaTavernaAnim(); }
        else { this.interactiu(831, 765, RADI_OBJECTE, DIALEGS.portaTaverna, { altura: 170, actiu: () => !Estat.flag('tavernaOberta'), enTancar: () => this.obrirPorta() }); }

        // Barrils de debò (es trenquen) a la dreta de la porta, on els tenia dibuixats la façana (mai apilats: si en trenques un, l'altre es quedaria flotant)
        this.barril(944, 757, 40, 16); this.barril(992, 762, 40, 16); this.barril(1038, 756, 40, 16);
        // Barrils a la dreta, taula i banc a l'esquerra, contra la façana
        this.barril(1150, 800, 40, 16);
        this.barril(1200, 812, 40, 16);
        this.posarBanc(520, 790, 130);
        this.posar('taula_buida', 400, 805, { escala: 0.7, col: { w: 110, h: 22 } });
        this.enemic('visitant', 1000, 960);        // un visitant trastocat per la boira, que ha vingut a la Taverna

        this.cartell(260, 860, () => ({ pagines: [{ qui: 'Cartell', text: '← L\'Hostatgeria i l\'Era\n→ Els arcs de la Casa Gran' }] }));
        this.arbres([[130, 250], [200, 560], [1460, 330], [1450, 600], [60, 830], [1180, 1050]]);   // cap arbre davant el cartell

        this.sortida(0, 900, 14, 130, 'ZonaJardi', 'taverna');
        this.sortida(1586, 900, 14, 130, 'ZonaCasaGran', 'oest');
    }

    // Se sent el forrellat i la porta del mig s'obre (es veu fosc a dins)
    obrirPortaAnim(fet) {
        Sfx.secret && Sfx.secret();
        const P = this.portaTavernaAnim();
        P.forcaFins = this.time.now + 1400;          // els batents s'obren sols; després segueixen l'Ineu com la resta de portes
        this.time.delayedCall(900, fet);
    }

    // L'arc del mig de la façana: els batents són el tros del mateix gràfic i giren cap endins quan l'Ineu s'hi acosta
    portaTavernaAnim() {
        return this.portaTaverna || (this.portaTaverna = this.portaAnimada({ x: 831, top: 590, bottom: 746, ample: 107, fons: 640, unic: true, arc: 46, retall: this.taverna }));
    }

    obrirPorta() {
        if (!Estat.flag('tavernaOberta') || this.portaOberta) return;
        this.portaOberta = true;
        this.obstacles.remove(this.colPorta, true, true);
        this.colisio(831, 660, 90, 20);      // dintell
        this.sortida(799, 700, 64, 42, 'ZonaTavernaInt', 'porta');          // la sortida arriba fins a la base de la porta (746-4): abans era 60 px més amunt i l'Ineu caminava massa dins de la porta abans d'entrar
    }
}


/**
 * LA TAVERNA PER DINS i la GALERIA DE LA PORTA DE FERRO (l'entrada de les Gírgoles, a l'est del Celler: res a veure amb la Taverna)
 * La Càren (mandrosa) dorm darrere el taulell; l'Eve (amiga fidel) obre la porta a l'Ineu i li explica què passa de nit.
 * La galeria s'entra per la porta de ferro exterior de la Sala de les Gírgoles, a l'est del Pati del Celler (la que fa servir
 * el Germà Aleu cada nit), que s'obre amb la Clau de ferro. Al fons de la galeria, una segona porta de ferro, de pany petit, dona a la
 * Sala de les Gírgoles: l'obre la clau rovellada que l\'Iscu va trobar (al Germà Aleu li va caure).
 */

Object.assign(DIALEGS, {
    // La porta de la Taverna (des de fora): la primera vegada, l\'Eve obre d'amagat
    portaTaverna: E => E.flag('tavernaOberta') ? { pagines: [] } : {
        pagines: [
            { qui: 'Nota', text: '«Avui no servim. — Càren»' },
            { qui: 'Ineu', text: 'Des de dins se sent un fil de música d\'acordió, molt baixet... i una olor de fregit.' },
            { qui: 'Eve', text: 'Psst! Tu ets l\'Ineu, oi? El monjo que pregunta pels nens. Entra, de pressa, que la Càren dorm i no vull que ens vegin.' },
            { fer: (z, fet) => z.obrirPortaAnim ? z.obrirPortaAnim(fet) : fet() }
        ],
        enAcabar: () => { E.posaFlag('tavernaOberta'); E.desar(); }
    },

    eveBase: E => {
        if (!E.flag('eveParlat')) return {
            pagines: [
                { qui: 'Eve', text: 'Sóc l\'Eve. Faig la feina de la Càren, que dorm des que va arribar la boira. T\'he fet entrar per una cosa: cada nit, quan tot és tancat, el Germà Aleu pica tres cops a la Porta de les Gírgoles, i la porta s\'obre sola. A dins, diuen, n\'hi ha una altra de ferro, molt vella, que ningú no ha obert mai.' },
                { qui: 'Eve', text: 'I l\'Iscu, el fill de la Càren, fa dos dies que s\'escapa pel camí de la Desaparició: diu que hi ha un forat entre els arbres «per on els grans no hi caben». Aquest no l\'ha pres la boira, sinó la mandra: des que la seva mare dorm, els gots els frego jo, i ell s\'esfuma. Si el trobes, digues-li que torni a sopar... i a fregar.' },
                { qui: 'Eve', text: 'El Sardi, en canvi, ve cada tarda a berenar pa amb xocolata. Ahir no va venir.' },
            ],
            enAcabar: () => { E.posaFlag('eveParlat'); E.posaObjectiu(E.flag('clauFerro') ? 'La Porta de les Gírgoles duu a l\'entrada de les Gírgoles: la Clau de ferro l\'obre.' : E.dades.objectiu); }
        };
        if (E.flag('portaPetitaVista') && !E.flag('iscuTrobat')) return { pagines: [
            { qui: 'Eve', text: 'L\'Iscu? Ja t\'ho vaig dir: surt pel camí de la Desaparició, a l\'oest de les Runes, i s\'amaga per un forat entre els arbres «per on els grans no hi caben». Si el trobes, digues-li que torni a sopar.' }
        ] };
        if (E.flag('clauFerro')) return { pagines: [
            { qui: 'Eve', text: 'Aquesta clau... és de ferro vell, com la porta de fora, la de la Porta de les Gírgoles! L\'has trobada a la Casa Gran? La porta és a la Sala de les Gírgoles: des del Pati del Celler, el camí de l\'est, entre els arbres.' },
            { qui: 'Eve', text: E.flag('cantMiracle') ? 'I la Pianista t\'ha ensenyat el cant. Vés amb compte, allà dins.' : 'Abans d\'entrar-hi, passa pel Santuari: la Pianista sempre diu que hi ha un cant per a cada porta.' }
        ] };
        if (E.flag('runna')) return { pagines: [
            { qui: 'Eve', text: 'Aquesta espasa brilla com si estigués contenta. Amb això potser obriríem la porta... però el pany és de clau. Una clau de ferro, grossa.' },
            { qui: 'Eve', text: 'L\'Isílder diu que els monjos ho amagaven tot a la Casa Gran. Potser la clau també.' }
        ] };
        return { pagines: [
            { qui: 'Eve', text: 'No et puc ajudar a obrir la porta de ferro: no té pany per a cap clau que hi hagi a la Taverna. Diuen que els monjos la van tancar amb una espasa que brilla.' },
            { qui: 'Eve', text: 'Busca aquesta espasa, Ineu. Jo em quedo aquí, fent veure que treballo.' }
        ] };
    },


    // La Porta de les Gírgoles (a l'est del Pati del Celler): la de la galeria, que s'obria sola per al Germà Aleu mentre la boira obeïa la veu del Mestre
    portaSoterrani: E => E.flag('clauFerro') ? { pagines: [
    ] } : E.flag('tombaSegellada') ? { pagines: [
        { qui: 'Ineu', text: "(Tancada amb clau. A l'Aleu se li obria sola perquè la boira que sortia de la tomba obeïa la veu del Mestre... però la tomba és segellada i la boira ja no puja: ara la porta no s'obre per a ningú. Em cal la clau dels monjos.)" }
    ] } : { pagines: [
        { qui: 'Ineu', text: "(Tancada amb clau. Diuen que a l'Aleu se li obre sola: la boira l'obeeix. A mi, no.)" }
    ] },

    acordio: E => ({ pagines: [] }),
    taulellTaverna: E => ({ pagines: [] }),

    portaFerro: E => {
        if (E.flag('portaFerroOberta')) return { pagines: [] };
        if (!E.flag('clauFerro')) return { pagines: [
            { qui: 'Ineu', text: '(Aquí és d\'on surt tot. Em falta l\'espasa que la va segellar... i una clau.)' }
        ] };
        const clau = E.te('clau_girgoles'), cant = E.flag('cantMiracle'), empara = E.te('benedicio_fraterna');
        // Sense la clau petita: l'Ineu recorda qui s'escapa de nit (l'Iscu) i l'objectiu l'hi porta
        if (!clau) return { pagines: [
            { qui: 'Ineu', text: '(La Clau de ferro no hi entra: aquest pany és molt més petit. El Germà Aleu en deu tenir una altra.)' },
            { qui: 'Ineu', text: '(Algú l\'hauria d\'haver vist anar-hi de nit... L\'Iscu, el fill de la Càren! L\'Eve va dir que s\'escapa pel camí de la Desaparició, per un forat entre els arbres.)' }
        ], enAcabar: () => { E.posaFlag('portaPetitaVista'); E.posaObjectiu(PROGRES.pista(E)); } };
        if (cant && empara) return { pagines: [
            { qui: 'Ineu', text: "(Tinc la clau, el Cant del Miracle i l'Empara: les dues proves de què parlava la Crònica del Pare Alberic. Endavant.)" }
        ] };
        // Tot el que falta, d'una vegada (la clau ja la té)
        const falta = [];
        if (!cant) falta.push("el Cant del Miracle (la Pianista, al Santuari, me l'ensenyarà un cop tingui Runna)");
        if (!empara) falta.push("l'Empara de les sacerdotesses de l'Hostatgeria (contra la boira que crema)");
        return { pagines: [
            { qui: 'Ineu', text: "(Tinc la clau petita, però la Crònica del Pare Alberic deia que, per baixar, em cal passar dues proves. Encara em falta " + falta.join(' i ') + '.)' }
        ] };
    }
});

// L'Eve acaba cada conversa oferint un got de llet calenta (Sí / No amb el mateix ui.triar que en Jusef): si es diu que sí, l'Ineu se'l beu i recupera tots els grans del rosari.
// Com que la Taverna no té cap altre premi, també fa de lloc de repòs.
DIALEGS.eve = E => {
    const d = DIALEGS.eveBase(E), ferit = E.dades.vida < E.dades.corsMax * 2;
    const enAcabarBase = d.enAcabar;
    return {
        pagines: [
            ...d.pagines,
            { qui: 'Eve', text: ferit ? 'Per cert, tens mala cara. Vols un got de llet calenta?' : 'Per cert, vols un got de llet calenta?' },
            { fer: (z, fet) => z.ui().triar(['Sí', 'No'], i => { DIALEGS._triaLlet = i; fet(); }) },
            { fer: (z, fet) => DIALEGS._triaLlet === 0 ? z.beureLlet(fet, z.eve) : fet() }
        ],
        enAcabar: () => {
            if (enAcabarBase) enAcabarBase();
            const triat = DIALEGS._triaLlet; DIALEGS._triaLlet = null;
            const ui = game.scene.getScene('UI');
            if (triat === 0) {
                E.dades.vida = E.dades.corsMax * 2;
                if (ui) { ui.actualitzarHUD(); ui.obrirDialeg({ pagines: [{ qui: 'Eve', text: ferit ? 'Té. Ara tens més color. Que et faci bon profit, monjo.' : 'Que et faci bon profit, monjo.' }] }); }
                E.desar();
            } else if (ui) ui.obrirDialeg({ pagines: [{ qui: 'Eve', text: 'Com vulguis.' }] });
        }
    };
};


// ---------------- LA TAVERNA PER DINS ----------------
// Escala de pedra que BAIXA cap a la foscor, vista de front des de dalt: el primer graó (el de la porta) és el més ample, clar i baix a la pantalla; cada graó següent
// és més estret, més fosc i més amunt (és més lluny i més avall), fins a perdre's en la negror. Només es veuen els plans dels graons (les contrahuelles miren cap a dins)
// amb una vora de llum al davant de cada un i l'ombra del salt, i els murs laterals en fuga cap al fons.
// cx, yBaix: centre i vora de baix (el llindar); ample: amplada del primer graó; yDalt: on s'acaba la fuga; n: graons.
function dibuixarEscalaBaixa(g, cx, yBaix, ample, yDalt, n = 8) {
    const mescla = (a, b, t) => { const ar = a >> 16 & 255, ag = a >> 8 & 255, ab = a & 255, br = b >> 16 & 255, bg = b >> 8 & 255, bb = b & 255;
        return (Math.round(ar + (br - ar) * t) << 16) | (Math.round(ag + (bg - ag) * t) << 8) | Math.round(ab + (bb - ab) * t); };
    const alt = yBaix - yDalt, f = 0.9;                           // cada graó és un 90% del de davant (en alçada i en amplada)
    const suma = (1 - Math.pow(f, n)) / (1 - f), h0 = alt / suma;
    // Murs laterals: trapezis que es van tancant cap al fons
    const wFons = ample * Math.pow(f, n);
    [-1, 1].forEach(sg => {
        g.fillStyle(0x3a3640, 1).fillPoints([{ x: cx + sg * ample / 2, y: yBaix }, { x: cx + sg * ample / 2 + sg * 14, y: yBaix }, { x: cx + sg * wFons / 2 + sg * 14, y: yDalt }, { x: cx + sg * wFons / 2, y: yDalt }], true);
        g.fillStyle(0x24202a, 1).fillPoints([{ x: cx + sg * ample / 2, y: yBaix }, { x: cx + sg * ample / 2 + sg * 5, y: yBaix }, { x: cx + sg * wFons / 2 + sg * 5, y: yDalt }, { x: cx + sg * wFons / 2, y: yDalt }], true);
    });
    let y = yBaix;
    for (let i = 0; i < n; i++) {
        const w = ample * Math.pow(f, i), w2 = ample * Math.pow(f, i + 1), h = h0 * Math.pow(f, i), fosc = Math.min(1, i / (n - 0.5));
        const tread = mescla(0x8a8478, 0x0c0a10, Math.pow(fosc, 0.8)), edge = mescla(0xc4bcac, 0x14121a, Math.pow(fosc, 0.7)), drop = mescla(0x1a1620, 0x000000, fosc);
        const yt = y - h;
        g.fillStyle(drop, 1).fillRect(cx - w2 / 2, yt - h * 0.22, w2, h * 0.22 + 1);                     // el salt cap al graó següent (ombra)
        g.fillStyle(tread, 1).fillRect(cx - w / 2, yt + h * 0.12, w, h * 0.88);                            // el pla del graó
        g.fillStyle(edge, 1).fillRect(cx - w / 2, y - h * 0.18, w, Math.max(1.5, h * 0.18));            // la vora de davant, il·luminada
        g.lineStyle(1, 0x000000, 0.35 + 0.4 * fosc).lineBetween(cx - w / 2, yt + h * 0.12, cx + w / 2, yt + h * 0.12);
        y = yt;
    }
    g.fillStyle(0x000000, 1).fillRect(cx - wFons / 2, yDalt - 4, wFons, 6);
}

class ZonaTavernaInt extends ZonaBase {
    constructor() {
        super('ZonaTavernaInt', {
            nom: 'La Taverna',
            amplada: 1000,
            alcada: 800,
            colorFons: '#140e0a',
            pacifica: true,
            entrades: { porta: { x: 500, y: 752, dir: 'amunt' } }
        });
    }

    construir() {
        const A = 1000, H = 800;
        this.terra('taulons', 60, 40, 880, 760, -1100).setTint(0xb08a5a);
        // Paret del fons: arrebossat càlid, sòcol de rajola i bigues
        const p = this.add.graphics().setDepth(-990);
        p.fillStyle(0x120a04, 1).fillRect(58, 0, 884, 130);
        p.fillStyle(0xc8a878, 1).fillRect(60, 0, 880, 126);
        let l = 7; const r = () => (l = l * 16807 % 2147483647) / 2147483647;
        for (let k = 0; k < 22; k++) p.fillStyle(0x7a5a3a, 0.06 + r() * 0.06).fillEllipse(80 + r() * 840, 10 + r() * 80, 30 + r() * 70, 8 + r() * 16);
        for (let x = 60; x < 940; x += 28) { p.fillStyle((x / 28) % 2 ? 0x2a6a8a : 0xe8e0c8, 1).fillRect(x, 96, 28, 30); }    // sòcol de rajola blava i blanca
        p.lineStyle(1, 0x1a1008, 0.5).strokeRect(60, 96, 880, 30);
        p.fillStyle(0x4a2c14, 1).fillRect(60, 0, 880, 12);
        [200, 420, 640, 860].forEach(x => p.fillStyle(0x4a2c14, 1).fillRect(x - 8, 0, 16, 30));
        p.fillStyle(0x4a3018, 1).fillRect(30, 0, 30, H).fillRect(940, 0, 30, H);
        this.colisio(30, H / 2, 60, H);
        this.colisio(A - 30, H / 2, 60, H);
        this.colisio(A / 2, 65, A - 120, 130);
        this.colisio(245, H - 10, 370, 20);
        this.colisio(755, H - 10, 370, 20);

        // Prestatgeria d'ampolles darrere el taulell i un rellotge de paret
        const pr = this.add.graphics().setDepth(-980);
        [28, 62].forEach(y => pr.fillStyle(0x4a2c14, 1).fillRect(120, y, 360, 8));
        const colors = [0x3a7a3a, 0x7a2a2a, 0xc8a050, 0x2a4a7a, 0x5a3a6a];
        for (let k = 0; k < 18; k++) {
            const x = 132 + (k % 9) * 38, y = k < 9 ? 28 : 62, c = colors[k % colors.length];
            pr.fillStyle(c, 0.95).fillRoundedRect(x, y - 24, 14, 24, 3).fillRect(x + 4, y - 32, 6, 9);
            pr.fillStyle(0xffffff, 0.25).fillRect(x + 2, y - 20, 3, 14);
        }
        pr.fillStyle(0x5a3a1e, 1).fillCircle(560, 50, 26).fillStyle(0xf2ecdc, 1).fillCircle(560, 50, 20);
        pr.lineStyle(2, 0x1a1008, 1).lineBetween(560, 50, 560, 36).lineBetween(560, 50, 570, 54);

        // El taulell (llarg, de fusta amb sobre de marbre) i la Càren dormint al darrere: frontal de plafons amb motllures, reposapeus de llautó, i a sobre tot el que hi ha en una taverna
        const t = this.add.graphics().setDepth(250);
        t.fillStyle(0x000000, 0.28).fillEllipse(310, 256, 430, 20);
        t.fillStyle(0x4a2c14, 1).fillRect(106, 184, 408, 68);
        t.fillStyle(0x6a4224, 1).fillRect(110, 188, 400, 60);
        for (let x = 118; x < 500; x += 48) {
            t.fillStyle(0x4e2e16, 1).fillRect(x, 194, 38, 44);
            t.lineStyle(1.5, 0x2a160a, 1).strokeRect(x, 194, 38, 44);
            t.lineStyle(1, 0x9a6a3c, 0.6).lineBetween(x + 2, 196, x + 36, 196).lineBetween(x + 2, 196, x + 2, 236);
            t.fillStyle(0x3a200e, 0.5).fillRect(x + 5, 202, 28, 28);
            t.lineStyle(1, 0x2a160a, 0.7).strokeRect(x + 5, 202, 28, 28);
        }
        for (let k = 0; k < 30; k++) { const gx = 114 + (k * 37) % 392; t.lineStyle(1, 0x2a160a, 0.22).lineBetween(gx, 190 + (k * 13) % 30, gx + 1, 200 + (k * 13) % 40); }
        t.fillStyle(0x3a200e, 1).fillRect(106, 240, 408, 10);
        t.fillStyle(0xb8903a, 1).fillRect(108, 244, 404, 4).fillStyle(0xf0d070, 0.8).fillRect(108, 244, 404, 1.5);          // reposapeus de llautó
        [140, 310, 480].forEach(x => t.fillStyle(0xb8903a, 1).fillRect(x - 2, 240, 4, 12).fillStyle(0xf0d070, 0.7).fillRect(x - 2, 240, 1.5, 12));
        t.fillStyle(0xe0d8c8, 1).fillRect(102, 166, 416, 20);                                                                // sobre de marbre
        t.fillStyle(0xf4eee0, 1).fillRect(102, 166, 416, 5);
        t.fillStyle(0xb8b0a0, 1).fillRect(102, 182, 416, 4);
        for (let k = 0; k < 9; k++) t.lineStyle(1, 0x8a8478, 0.35).lineBetween(116 + k * 46, 172, 124 + k * 46, 180);
        t.lineStyle(2, 0x1a1008, 1).strokeRect(102, 166, 416, 20).strokeRect(106, 184, 408, 68);
        // Damunt del taulell, només: una ampolla, una tassa de fang i dos gots
        const g = this.add.graphics().setDepth(251);
        const got = (x, y, buit) => {                                                                   // got de vidre gruixut, de pafegir vi: base gruixuda i parets que s'obren
            g.fillStyle(0x000000, 0.25).fillEllipse(x + 1, y + 1, 16, 5);
            g.fillStyle(0xcfe4ee, 0.55).fillPoints([{ x: x - 7, y: y - 17 }, { x: x + 7, y: y - 17 }, { x: x + 5, y: y - 2 }, { x: x - 5, y: y - 2 }], true);
            if (!buit) g.fillStyle(0x8a1e2a, 0.85).fillPoints([{ x: x - 6, y: y - 10 }, { x: x + 6, y: y - 10 }, { x: x + 5, y: y - 2 }, { x: x - 5, y: y - 2 }], true);
            g.fillStyle(0xe8f4fa, 0.9).fillRect(x - 5, y - 3, 10, 2.5);
            g.lineStyle(1.2, 0x6a7e8a, 0.95).strokePoints([{ x: x - 7, y: y - 17 }, { x: x - 5, y: y - 2 }, { x: x + 5, y: y - 2 }, { x: x + 7, y: y - 17 }], false);
            g.fillStyle(0xffffff, 0.7).fillRect(x - 5, y - 15, 1.5, 9);
        };
        const tassa = (x, y) => {                                                                       // tassa de fang vidriat amb nansa i escuma
            g.fillStyle(0x000000, 0.25).fillEllipse(x + 1, y + 1, 22, 6);
            g.lineStyle(3.5, 0x7a4a2a, 1).strokeCircle(x + 10, y - 9, 5);
            g.fillStyle(0x9a6038, 1).fillRoundedRect(x - 9, y - 18, 18, 18, 3).fillStyle(0xc88a58, 0.55).fillRect(x - 6, y - 16, 3, 13).fillStyle(0x6a3e22, 1).fillRect(x - 9, y - 6, 18, 2);
            g.fillStyle(0xf4ecd0, 1).fillEllipse(x, y - 18, 18, 6).fillStyle(0xffffff, 0.6).fillCircle(x - 3, y - 19, 2);
            g.lineStyle(1.2, 0x3a200e, 1).strokeRoundedRect(x - 9, y - 18, 18, 18, 3);
        };
        const ampolla = (x, y) => {                                                                     // ampolla verda de coll llarg, amb etiqueta i tap de suro
            g.fillStyle(0x000000, 0.25).fillEllipse(x + 1, y + 1, 18, 5);
            g.fillStyle(0x2c6a3a, 1).fillRoundedRect(x - 7, y - 24, 14, 24, 3).fillRect(x - 3, y - 38, 6, 16);
            g.fillStyle(0x9a6a3a, 1).fillRect(x - 3, y - 41, 6, 4);
            g.fillStyle(0xeadcb4, 1).fillRect(x - 6, y - 17, 12, 9).lineStyle(1, 0x5a4a30, 0.8).strokeRect(x - 6, y - 17, 12, 9);
            g.fillStyle(0xffffff, 0.35).fillRect(x - 5, y - 24, 2, 16);
            g.lineStyle(1.2, 0x143a1e, 1).strokeRoundedRect(x - 7, y - 24, 14, 24, 3);
        };
        ampolla(190, 171); tassa(300, 170); got(380, 171, false); got(406, 170, true);
        this.colisio(310, 215, 410, 70);
        this.interactiu(310, 270, RADI_OBJECTE, DIALEGS.taulellTaverna, { altura: 90 });

        // Llar de foc a la dreta
        const llar = this.add.graphics().setDepth(-960);
        llar.fillStyle(0x120a04, 1).fillRect(612, 20, 156, 110);
        llar.fillStyle(0x5a4a3a, 1).fillRect(618, 26, 144, 100);
        llar.fillStyle(0x0c0806, 1).fillRect(636, 52, 108, 74);
        this.foc = this.posar('foc', 690, 120, { fonsY: 120 });
        this.tweens.add({ targets: this.foc, scaleY: this.foc.scaleY * 1.08, yoyo: true, repeat: -1, duration: 280 });
        this.add.circle(690, 150, 170, 0xff9a30, 0.1).setDepth(300);

        // Taules amb tamborets i espelmes
        [[260, 470], [520, 430], [700, 560], [330, 620]].forEach(([x, y], i) => {
            this.posar('taula_buida', x, y, { escala: 0.8, col: { w: 130, h: 26 } });
            // (a la primera taula, el senyor Buidor ocupa el lloc de la dreta, amb el seu propi tamboret dibuixat)
            [[-70, 20], [70, 20]].forEach(([dx, dy], k) => { if (!(i === 0 && k === 1)) this.posar('tamboret', x + dx, y + dy, { escala: 0.8, col: { w: 30, h: 12 } }); });
            if (i !== 0) return;                                          // (només la taula del senyor Buidor té res a sobre)
            // el senyor Buidor hi té el seu anís en un got de peu, un platet amb unes olives i l'espelma
            const m = this.add.graphics().setDepth(y + 1);
            m.fillStyle(0x000000, 0.22).fillEllipse(x + 30, y - 58, 16, 5);
            m.fillStyle(0xd8ecf4, 0.6).fillPoints([{ x: x + 24, y: y - 74 }, { x: x + 36, y: y - 74 }, { x: x + 33, y: y - 64 }, { x: x + 27, y: y - 64 }], true).fillRect(x + 29, y - 64, 2, 6).fillRect(x + 25, y - 58, 10, 2);
            m.fillStyle(0xe8e4c8, 0.85).fillPoints([{ x: x + 25, y: y - 69 }, { x: x + 35, y: y - 69 }, { x: x + 33, y: y - 64 }, { x: x + 27, y: y - 64 }], true);
            m.lineStyle(1, 0x5a6e7a, 0.9).strokePoints([{ x: x + 24, y: y - 74 }, { x: x + 27, y: y - 64 }, { x: x + 33, y: y - 64 }, { x: x + 36, y: y - 74 }], false);
            m.fillStyle(0xeee4cc, 1).fillEllipse(x - 28, y - 62, 24, 8).lineStyle(1, 0x8a7a5a, 1).strokeEllipse(x - 28, y - 62, 24, 8);
            [[-33, -62], [-28, -64], [-23, -61]].forEach(([dx, dy]) => m.fillStyle(0x4a5a2a, 1).fillEllipse(x + dx, y + dy, 5, 3.5));
            const e = this.posar('espelma', x, y - 50, { fonsY: y + 2 });
            this.tweens.add({ targets: e, alpha: 0.7, yoyo: true, repeat: -1, duration: 330 + i * 80 });
        });
        // Barrils de vi, apilats a la dreta, i l'acordió
        [[860, 470], [900, 500], [880, 440]].forEach(([x, y]) => this.barril(x, y, 46, 20));
        // L\'Eve, al costat de la llar
        this.eve = this.npc('eve', 650, 350, DIALEGS.eve, { flipX: true });

        // El senyor Buidor, assegut al costat dret de la taula de l'esquerra de tot (sencer, sense que la taula el tapi), assaborint l'anís escarxat que li ha preparat l'Eve
        this.npc('senyor_budo', 352, 492, DIALEGS.senyorBudo, { colAmple: 50 });

        this.add.rectangle(A / 2, H / 2, A, H, 0xffc070, 0.07).setDepth(80000);
        this.sortida(460, H - 22, 80, 14, 'ZonaTaverna', 'interior');
    }
}

// ---------------- EL SOTERRANI DE LA TAVERNA (la porta de ferro) ----------------
class ZonaSotaTaverna extends ZonaBase {
    constructor() {
        super('ZonaSotaTaverna', {
            nom: 'Galeria de la Porta de Ferro',
            amplada: 800,
            alcada: 900,
            colorFons: '#08060a',
            pacifica: true,
            entrades: { exterior: { x: 400, y: 790, dir: 'amunt' }, girgoles: { x: 400, y: 280, dir: 'avall' } }
        });
    }

    construir() {
        const A = 800, H = 900;
        this.terra('pedra', 100, 60, 600, 840, -1100).setTint(0x6a6070);
        const m = this.add.graphics().setDepth(-990);
        m.fillStyle(0x2a2430, 1).fillRect(60, 0, 680, 150);
        m.lineStyle(1.5, 0x120e16, 0.7);
        for (let y = 24, f = 0; y < 150; y += 26, f++) { m.lineBetween(60, y, 740, y); for (let x = 60 + (f % 2) * 30; x < 740; x += 60) m.lineBetween(x, y, x, y - 26); }
        m.fillStyle(0x1a1620, 1).fillRect(30, 0, 70, H).fillRect(700, 0, 70, H);
        this.colisio(50, H / 2, 100, H);
        this.colisio(A - 50, H / 2, 100, H);
        this.colisio(155, 90, 310, 180);                                                 // paret nord esquerra
        this.colisio(645, 90, 310, 180);                                                 // paret nord dreta
        this.colisio(400, 70, 180, 140);                                                 // dintell sobre la porta de ferro
        this.colisio(220, H - 10, 280, 20);
        this.colisio(580, H - 10, 280, 20);

        // La porta de ferro, al mig de la paret del fons: marc de pedra amb dovelles, fulla de ferro amb tres bandes reblades, un pany petit (el de la clau rovellada) i una anella,
        // amb l'espasa i la gàbia gravades al marc (el segell dels monjos) i, per sota, la boira lila que s'escola per la ranura
        const pf = this.add.graphics().setDepth(-950);
        pf.fillStyle(0x0a0808, 1).fillRect(286, 4, 228, 160);                                                     // el buit del marc
        for (let y = 4, f = 0; y < 164; y += 20, f++) {                                                           // brancals de pedra (carreus)
            [[286, 22], [492, 22]].forEach(([x, w], j) => { pf.fillStyle([0x4a4452, 0x3e3846, 0x544e5c][(f + j) % 3], 1).fillRect(x, y, w, 19).lineStyle(1.5, 0x120e16, 1).strokeRect(x, y, w, 19); });
        }
        for (let x = 286, k = 0; x < 514; x += 38, k++) pf.fillStyle([0x544e5c, 0x4a4452, 0x5e5866][k % 3], 1).fillRect(x, 0, 38, 20).lineStyle(1.5, 0x120e16, 1).strokeRect(x, 0, 38, 20);   // llinda
        this.fulla(pf, 310, 20, 180, 142);
        // Espasa i gàbia gravades als brancals
        pf.lineStyle(3, 0x8a7aa0, 0.85).lineBetween(297, 40, 297, 110).lineBetween(289, 56, 305, 56).lineBetween(297, 110, 297, 118);
        pf.strokeRect(500, 62, 10, 34).lineBetween(503, 62, 503, 96).lineBetween(507, 62, 507, 96);
        const resplendor = this.add.ellipse(400, 170, 320, 70, 0x9a50ff, 0.25).setDepth(-940);
        this.tweens.add({ targets: resplendor, alpha: 0.08, scaleX: 1.15, yoyo: true, repeat: -1, duration: 1600 });
        this.boira(400, 170, 220, 40, 1.2);
        this.boira(300, 420, 160, 40, 0.5);
        this.boira(520, 600, 160, 40, 0.5);
        this.fullaPorta = pf;
        this.interactiu(400, 220, RADI_GRAN, DIALEGS.portaFerro, { altura: 170, actiu: () => !Estat.flag('portaFerroOberta'), enTancar: () => { if (Estat.te('clau_girgoles') && Estat.flag('cantMiracle') && Estat.te('benedicio_fraterna')) this.obrirPortaFerro(); } });
        if (Estat.flag('portaFerroOberta')) this.obrirPortaFerro(true);

        // Botes i sacs de gra de les provisions dels monjos (es poden trencar)
        [[150, 300], [180, 350], [640, 320]].forEach(([x, y]) => this.barril(x, y, 46, 20));
        this.sacs(640, 540, 'duo'); this.sacs(150, 580, 'un');
        // Les petjades a la pols: un rastre de botes que puja de l'escala fins a la porta de ferro i s'hi atura (són les del Germà Aleu, que hi pica cada nit); les més properes a la porta, més fosques i amb boira
        const pj = this.add.graphics().setDepth(-1000);
        for (let k = 0; k < 13; k++) {
            const y = 760 - k * 42, x = 400 + (k % 2 ? 16 : -16) + Math.sin(k * 0.9) * 6, f = 1 - k / 18;
            pj.fillStyle(0x15111a, 0.45 * f + 0.15).fillEllipse(x, y, 15, 23).fillEllipse(x + (k % 2 ? 1 : -1), y + 15, 11, 9);
            pj.fillStyle(0x6a6070, 0.2).fillEllipse(x - 2, y - 3, 5, 9);
        }
        // La claror de l'escala (el Celler de dalt) cau en un con suau sobre el terra, davant l'arc de sortida
        const con = this.add.graphics().setDepth(-995).setBlendMode('ADD');
        con.fillStyle(0xffe8c0, 0.05).fillPoints([{ x: 360, y: H - 12 }, { x: 440, y: H - 12 }, { x: 520, y: H - 330 }, { x: 280, y: H - 330 }], true);
        con.fillStyle(0xffe8c0, 0.06).fillPoints([{ x: 372, y: H - 12 }, { x: 428, y: H - 12 }, { x: 468, y: H - 200 }, { x: 332, y: H - 200 }], true);
        // Dues torxes de paret, a banda i banda de la porta, amb la seva claror càlida
        [236, 564].forEach((x, i) => {
            const t = this.add.graphics().setDepth(-940);
            t.fillStyle(0x3a2a1a, 1).fillRect(x - 3, 96, 6, 34).lineStyle(2, 0x120c06, 1).strokeRect(x - 3, 96, 6, 34);
            t.fillStyle(0x24242a, 1).fillRect(x - 8, 92, 16, 6).fillRect(x - 5, 130, 10, 5);
            const flama = this.add.ellipse(x, 84, 12, 20, 0xffa030, 0.95).setDepth(-939);
            const nucli = this.add.ellipse(x, 87, 6, 11, 0xfff0b0, 1).setDepth(-938);
            this.tweens.add({ targets: [flama, nucli], scaleY: { from: 0.85, to: 1.2 }, scaleX: { from: 1.05, to: 0.85 }, yoyo: true, repeat: -1, duration: 260 + i * 70, ease: 'Sine.easeInOut' });
            const halo = this.add.circle(x, 90, 90, 0xff9a40, 0.12).setDepth(-960).setBlendMode('ADD');
            this.tweens.add({ targets: halo, alpha: 0.2, scale: 1.08, yoyo: true, repeat: -1, duration: 380 + i * 90 });
        });
        this.add.rectangle(A / 2, H / 2, A, H, 0x1a0a30, 0.25).setDepth(80000);
        this.sortida(360, H - 22, 80, 14, 'ZonaGirgolesFora', 'porta');                 // l'escala puja a la porta de ferro de fora
    }

    // La fulla de la porta de ferro (g, a (x, y), de w x h): dues meitats de planxa amb tres bandes de ferro, reblons només a les bandes, anella i un pany petit
    fulla(g, x, y, w, h) {
        g.fillStyle(0x2c2c33, 1).fillRect(x, y, w, h);
        g.fillStyle(0x38383f, 1).fillRect(x + 3, y + 3, w / 2 - 5, h - 6).fillRect(x + w / 2 + 2, y + 3, w / 2 - 5, h - 6);        // les dues meitats de la planxa
        g.fillStyle(0x4a4a52, 0.35).fillRect(x + 6, y + 5, 3, h - 10).fillRect(x + w / 2 + 5, y + 5, 3, h - 10);                    // llum a l'esquerra de cada meitat
        g.fillStyle(0x15151a, 1).fillRect(x + w / 2 - 1, y, 2, h);                                                                 // la juntura del mig
        [0.16, 0.5, 0.84].forEach(f => {                                                                                            // bandes de ferro
            const yy = y + h * f - 6;
            g.fillStyle(0x1c1c22, 1).fillRect(x, yy, w, 12).lineStyle(1.5, 0x0c0c10, 1).strokeRect(x, yy, w, 12);
            g.fillStyle(0x6a6a74, 0.5).fillRect(x + 1, yy + 1, w - 2, 2);
            for (let xx = x + 10; xx < x + w - 6; xx += 22) g.fillStyle(0x8a8a94, 1).fillCircle(xx, yy + 6, 2.2).fillStyle(0x0c0c10, 0.6).fillCircle(xx + 0.7, yy + 6.7, 1);     // reblons
        });
        g.lineStyle(1, 0x7a3a10, 0.5); [[0.3, 0.2], [0.7, 0.7], [0.45, 0.35]].forEach(([fx, fy]) => g.lineBetween(x + w * fx, y + h * fy, x + w * fx + 2, y + h * fy + 14));          // regalims de rovell
        g.lineStyle(3, 0x14141a, 1).strokeCircle(x + w - 28, y + h * 0.5 + 24, 7);                                                   // anella
        g.fillStyle(0x8a7a40, 1).fillRect(x + w - 24, y + h * 0.5 - 30, 14, 20).fillStyle(0x0a0808, 1).fillRect(x + w - 19, y + h * 0.5 - 24, 4, 9);      // el pany petit (el de la clau rovellada)
        g.fillStyle(0x7a5a2a, 1).fillRect(x + w - 24, y + h * 0.5 - 30, 14, 3);
    }

    // La Clau de ferro obre la porta: s'hi veu l'escala que baixa a la Sala de les Gírgoles
    obrirPortaFerro(ja = false) {
        if (this.portaOberta) return;
        this.portaOberta = true;
        if (!ja) { Estat.posaFlag('portaFerroOberta'); Sfx.secret(); this.cameras.main.shake(400, 0.004); Estat.posaObjectiu("La porta de ferro del fons de la galeria dona a la Sala de les Gírgoles."); Estat.desar(); }
        const forat = this.add.graphics().setDepth(-945);
        forat.fillStyle(0x000000, 1).fillRect(312, 20, 176, 140);
        dibuixarEscalaBaixa(forat, 400, 156, 150, 34, 8);
        forat.fillStyle(0x2a2a30, 1).fillRect(470, 18, 30, 142);
        // La fulla de ferro gira sobre la frontissa de l'esquerra i es queda oberta, de cantó
        const f = this.add.graphics().setDepth(-944).setPosition(310, 18);
        this.fulla(f, 0, 0, 180, 142);
        if (ja) f.scaleX = 0.1;
        else this.tweens.add({ targets: f, scaleX: 0.1, duration: 1100, ease: 'Sine.easeInOut' });
        this.sortida(346, 146, 108, 20, 'ZonaGirgoles', 'porta');
    }
}


// ---------------- L'ENTRADA DE LA SALA DE LES GÍRGOLES ----------------
// A l'est del Pati del Celler, seguint el camí que creua els arbres: una plaça de terra rodona amb arbres i, al fons, l'edifici
// amb la porta de ferro (l'escala de la galeria hi puja).
// La porta és visible tot el joc, tancada fins a tenir la Clau de ferro; el camí s'acaba allà.
class ZonaGirgolesFora extends ZonaBase {
    constructor() {
        super('ZonaGirgolesFora', {
            nom: 'Porta de les Gírgoles',
            amplada: 800,
            alcada: 1100,
            entrades: { celler: { x: 60, y: 620, dir: 'dreta' }, porta: { x: 400, y: 360, dir: 'avall' } }
        });
    }

    construir() {
        const PX = 400, BASE = 300, CX = 400, CY = 620, R = 200, A = 800;
        this.PX = PX; this.BASE = BASE;
        this.terra('herba', 0, 0, A, 1100, -1100);
        // La plaça de terra rodona: franges d'amplada decreixent (el difuminat dels camins les arrodoneix)
        for (let dy = -R; dy < R; dy += 20) {
            const m = dy + 10, w = 2 * Math.sqrt(R * R - m * m);
            this.terra('cami', CX - w / 2, CY + dy, w, 20);
        }
        this.terra('cami', 0, 570, 260, 100);                               // el camí des del Pati del Celler (oest)
        this.terra('cami', PX - 75, BASE, 150, CY - R - BASE + 40);         // de la plaça a la porta

        // L'edifici, de vora a vora de la pantalla: paret de carreus amb la teulada a dalt, soc de pedra i dues reixes de ventilació
        const e = this.add.graphics().setDepth(-950);
        e.fillStyle(0x7d7466, 1).fillRect(0, 0, A, BASE);
        e.lineStyle(1.5, 0x3a342c, 0.55);
        for (let y = 70, f = 0; y < BASE; y += 30, f++) { e.lineBetween(0, y, A, y); for (let x = (f % 2) * 36; x < A; x += 72) e.lineBetween(x, y, x, y + 30); }
        e.fillStyle(0x4a3a34, 1).fillRect(0, 0, A, 70);
        e.lineStyle(1.5, 0x241812, 0.6);
        for (let y = 14, f = 0; y < 70; y += 14, f++) { e.lineBetween(0, y, A, y); for (let x = (f % 2) * 20; x < A; x += 40) e.lineBetween(x, y, x, y + 14); }
        e.fillStyle(0x4a443a, 1).fillRect(0, BASE - 24, A, 24);
        e.fillStyle(0x000000, 0.25).fillRect(0, BASE, A, 10);
        [120, 680].forEach(x => {
            e.fillStyle(0x0a0608, 1).fillRect(x - 28, 150, 56, 70).lineStyle(3, 0x2a241c, 1).strokeRect(x - 28, 150, 56, 70);
            e.lineStyle(3, 0x3a3a42, 1);
            for (let k = 1; k < 4; k++) e.lineBetween(x - 28 + k * 14, 150, x - 28 + k * 14, 220);
        });

        // La porta de ferro (marc de pedra amb arc), sempre visible
        this.portaG = this.add.graphics().setDepth(-940);
        const oberta = Estat.flag('portaSoterraniOberta');
        this.pintarPorta(oberta);
        this.colisio((PX - 80) / 2, BASE / 2, PX - 80, BASE);                // paret a banda i banda de la porta
        this.colisio((PX + 80 + A) / 2, BASE / 2, A - PX - 80, BASE);
        this.colisio(PX, 205, 160, 20);                                      // res no passa per darrere de l'obertura
        this.cartell(PX - 130, 345, DIALEGS.cartellGirgoles);
        if (oberta) this.sortida(PX - 72, 230, 144, 52, 'ZonaSotaTaverna', 'exterior');
        else {
            this.colPorta = this.colisio(PX, 200, 160, 200);
            this.boiraPorta = this.boira(PX, BASE - 8, 140, 14, 0.6);
            this.interactiu(PX, 340, RADI_OBJECTE, DIALEGS.portaSoterrani, { altura: 120, actiu: () => !Estat.flag('portaSoterraniOberta'), enTancar: () => this.obrirPorta() });
        }

        this.posarVigilant(PX);

        // Pocs arbres i escampats amb naturalitat: cap no arriba a tocar l'edifici (les capçades fan uns 280 d'alt: els de dalt, més petits)
        [[62, 520, 0.7], [735, 545, 0.75], [70, 880], [150, 1060, 0.9], [340, 1085], [600, 1070, 0.85], [740, 950]]
            .forEach(([x, y, esc]) => this.posar('arbre', x, y, esc ? { escala: esc } : {}));

        this.sortida(0, 560, 14, 120, 'ZonaCellerFora', 'girgoles');
    }

    // El Pare Xèvius barra el camí de la porta amb una tanca de fusta, de vora a vora, i una barrera al mig: no deixa passar fins que veu la Carta del Cortiner
    posarVigilant(PX) {
        const YT = 385, A = 800, GAP = 70;
        if (Estat.flag('portaSoterraniOberta')) Estat.posaFlag('vigilantObert');             // partides velles: la porta ja és oberta
        const obert = Estat.flag('vigilantObert');
        if (!obert) {
            this.tanca = this.add.graphics().setDepth(YT);
            const t = this.tanca, fusta = 0x6b4a2c, ombra = 0x3a2616;
            [[0, PX - GAP], [PX + GAP, A]].forEach(([x0, x1]) => {
                t.fillStyle(ombra, 1).fillRect(x0, YT - 38, x1 - x0, 5).fillRect(x0, YT - 20, x1 - x0, 5);
                t.fillStyle(fusta, 1).fillRect(x0, YT - 40, x1 - x0, 5).fillRect(x0, YT - 22, x1 - x0, 5);
                for (let x = x0 + 8; x < x1; x += 46) t.fillStyle(fusta, 1).fillRect(x - 5, YT - 56, 10, 62).fillStyle(ombra, 1).fillRect(x + 2, YT - 56, 3, 62);
            });
            this.colTancaE = this.colisio((PX - GAP) / 2, YT, PX - GAP, 14);
            this.colTancaD = this.colisio((PX + GAP + A) / 2, YT, A - PX - GAP, 14);
            this.colBarrera = this.colisio(PX, YT, GAP * 2, 14);
            // La barrera del mig: dues fulles que s'obren
            this.barrera = this.add.graphics().setDepth(YT);
            const b = this.barrera;
            b.fillStyle(0x7a5632, 1).fillRect(PX - GAP, YT - 44, GAP * 2, 6).fillRect(PX - GAP, YT - 26, GAP * 2, 6).fillRect(PX - GAP, YT - 6, GAP * 2, 6);
            b.fillStyle(0x5a3a1e, 1).fillRect(PX - 3, YT - 48, 6, 52);
            b.fillStyle(0x3a2616, 1).fillRect(PX - GAP - 5, YT - 58, 10, 66).fillRect(PX + GAP - 5, YT - 58, 10, 66);
        }
        const x = obert ? PX + 150 : PX, y = obert ? 372 : 430;
        this.vigilant = this.npc('pare_xevius', x, y, DIALEGS.xevius, { quiet: false, zoomConversa: 1.9 });
        if (!obert) this.vigilant.punt.enTancar = () => {};                  // (la porta s'obre al diàleg, vegeu obrirVigilant)
        this.vigilant.punt.altura = this.vigilant.displayHeight + 6;
        // Mentre no s'ha obert el camí, la porta no es pot fer servir (hi ha la tanca pel mig)
    }

    // Quan el Pare Xèvius veu la carta: s'aparta i s'obre la barrera
    obrirVigilant(fet) {
        const PX = this.PX, v = this.vigilant;
        Sfx.secret();
        this.tweens.add({ targets: this.barrera, alpha: 0, duration: 900, onComplete: () => { this.barrera.destroy(); this.barrera = null; } });
        if (this.colBarrera) { this.obstacles.remove(this.colBarrera, true, true); this.colBarrera = null; }
        if (v.col) { this.obstacles.remove(v.col, true, true); v.col = null; }
        const nx = PX + 150;
        this.tweens.add({ targets: [v, v.ombra], x: nx, duration: 1400, ease: 'Sine.easeInOut', onComplete: () => {
            v.col = this.colisio(nx, v.y - 9, 40, 18);
            if (v.punt) v.punt.x = nx;
            fet();
        } });
    }

    // Porta de ferro en un marc de pedra amb arc: dues fulles amb reblons; oberta, es veu l'escala que baixa
    pintarPorta(oberta) {
        const g = this.portaG, x = this.PX, b = this.BASE;
        g.clear();
        g.fillStyle(0xa09484, 1).fillRect(x - 100, b - 190, 200, 190).fillEllipse(x, b - 190, 200, 90);
        g.lineStyle(3, 0x2a241c, 1).strokeRect(x - 100, b - 190, 200, 190);
        g.fillStyle(0x0a0608, 1).fillRect(x - 80, b - 175, 160, 175).fillEllipse(x, b - 175, 160, 70);
        if (oberta) {
            dibuixarEscalaBaixa(g, x, b - 4, 150, b - 168, 8);
            g.fillStyle(0x2a2a30, 1).fillRect(x - 80, b - 175, 8, 175).fillRect(x + 72, b - 175, 8, 175);
            return;
        }
        // La part de dalt de l'arc, enreixada
        g.lineStyle(3, 0x7a2620, 1);
        for (let dx = -60; dx <= 60; dx += 20) g.lineBetween(x + dx, b - 175 - 35 * Math.sqrt(1 - (dx / 80) ** 2), x + dx, b - 175);
        [-1, 1].forEach(sg => {
            const x0 = sg < 0 ? x - 80 : x;
            g.fillStyle(0x9a2e26, 1).fillRect(x0, b - 175, 80, 175).lineStyle(2, 0x3a0e0a, 1).strokeRect(x0, b - 175, 80, 175);
            g.fillStyle(0xc04a3a, 0.35).fillRect(x0 + 3, b - 172, 6, 169);                   // un filet de llum al ferro vermell
            for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) g.fillStyle(0xd88a6a, 1).fillCircle(x0 + 16 + c * 24, b - 150 + r * 40, 3.5);
            g.fillStyle(0x5a1812, 1).fillRect(x0, b - 120, 80, 8).fillRect(x0, b - 50, 80, 8);
        });
        g.fillStyle(0x8a7a40, 1).fillRect(x - 10, b - 95, 20, 28).fillStyle(0x0a0808, 1).fillRect(x - 3, b - 88, 6, 12);
    }

    // La Clau de ferro obre les dues fulles, que giren sobre les frontisses de fora i descobreixen l'escala
    obrirPorta() {
        if (!Estat.flag('clauFerro') || Estat.flag('portaSoterraniOberta')) return;
        const x = this.PX, b = this.BASE;
        Estat.posaFlag('portaSoterraniOberta');
        Estat.posaObjectiu("La galeria de la Sala de les Gírgoles s'obre rere la porta de ferro.");
        Sfx.secret(); this.cameras.main.shake(300, 0.003);
        this.pintarPorta(true);
        [-1, 1].forEach(sg => {
            const f = this.add.graphics().setDepth(-939).setPosition(x + sg * 80, b);
            const x0 = sg < 0 ? 0 : -80;
            f.fillStyle(0x2a2a30, 1).fillRect(x0, -175, 80, 175).lineStyle(2, 0x111114, 1).strokeRect(x0, -175, 80, 175);
            for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) f.fillStyle(0x5a5a62, 1).fillCircle(x0 + 16 + c * 24, -150 + r * 40, 3.5);
            this.tweens.add({ targets: f, scaleX: 0.08, duration: 900, ease: 'Sine.easeInOut', onComplete: () => f.destroy() });
        });
        if (this.colPorta) { this.obstacles.remove(this.colPorta, true, true); this.colPorta = null; }
        if (this.boiraPorta) { this.boiraPorta.stop(); this.time.delayedCall(1800, () => this.boiraPorta && this.boiraPorta.destroy()); }
        this.sortida(x - 72, 230, 144, 52, 'ZonaSotaTaverna', 'exterior');
        Estat.posaObjectiu("La porta de ferro oberta porta a la Sala de les Gírgoles.");
        Estat.desar();
    }
}
