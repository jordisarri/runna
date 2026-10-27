/**
 * LA TAVERNA PER DINS i el SOTERRANI DE LA PORTA DE FERRO
 * La Carmen (mandrosa) dorm darrere el taulell; l'Eva (amiga fidel) obre la porta a l'Ineu i li explica què passa de nit.
 * Des de dins NO es pot baixar al soterrani: s'hi entra per la porta de ferro exterior, al darrere de la Taverna (la que fa servir
 * el Germà Andreu cada nit), que s'obre amb la Clau de ferro. Al soterrani, una segona porta de ferro, de pany petit, baixa a la
 * Sala de les Gírgoles: l'obre la clau rovellada que el Siscu va trobar (al Germà Andreu li va caure).
 */

Object.assign(DIALEGS, {
    // La porta de la Taverna (des de fora): la primera vegada, l'Eva obre d'amagat
    portaTaverna: E => E.flag('tavernaOberta') ? { pagines: [{ qui: '', text: "La porta de la Taverna, ajustada. L'Eva l'ha deixat oberta per a tu." }] } : {
        pagines: [
            { qui: '', text: 'La porta de la Taverna és tancada amb pany i clau. Al vidre hi ha un paper clavat amb xinxetes: «Avui no servim. — Carmen».' },
            { qui: 'Ineu', text: 'Des de dins se sent un fil de música d\'acordió, molt baixet... i una olor de fregit.' },
            { fer: (z, fet) => z.evaFinestra ? z.evaFinestra(fet) : fet() },
            { qui: 'Eva', text: 'Psst! Tu ets l\'Ineu, oi? El monjo que pregunta pels nens. Entra, de pressa, que la Carmen dorm i no vull que ens vegin.' },
            { fer: (z, fet) => z.obrirPortaAnim ? z.obrirPortaAnim(fet) : fet() }
        ],
        enAcabar: () => { E.posaFlag('tavernaOberta'); E.desar(); }
    },

    eva: E => {
        if (!E.flag('evaParlat')) return {
            pagines: [
                { qui: 'Eva', text: 'Sóc l\'Eva. Ajudo la Carmen... bé, faig la feina de la Carmen. Ella dorm des que va arribar la boira. Diu que és cansament. Jo crec que és la boira.' },
                { qui: 'Eva', text: 'T\'he fet entrar per una cosa. Cada nit, quan tot és tancat, el Germà Andreu pica tres cops a la porta de ferro de fora, la del darrere de la Taverna, i la porta s\'obre sola. Baixa al soterrani. Diu que va a buscar vi. Mai no puja amb cap ampolla.' },
                { qui: 'Eva', text: 'Des d\'aquí dins no s\'hi pot baixar: el soterrani només té aquella porta de fora. I a baix, diuen, n\'hi ha una altra de ferro, molt vella, que ningú no ha obert mai. D\'allà surt la boira. I de nit... se senten ocells. Sota terra, Ineu. Ocells.' },
                { qui: 'Eva', text: 'I el Siscu, el fill de la Carmen, fa dos dies que s\'escapa: diu que va a jugar a cartes on ningú no el molesta. Aquest no l\'ha pres la boira: l\'ha pres la mandra de fregar gots.' },
                { qui: 'Eva', text: 'Sempre surt pel camí de la Desaparició. Una vegada em va dir, rient, que hi ha un forat entre els arbres «per on els grans no hi caben».' },
                { qui: 'Eva', text: 'El Sardin hi venia cada tarda a berenar pa amb xocolata. Fa una nit que no ve.' },
            ],
            enAcabar: () => { E.posaFlag('evaParlat'); E.posaObjectiu(E.flag('clauFerro') ? 'La porta de ferro del darrere de la Taverna (per fora) baixa al soterrani: la Clau de ferro l\'obre.' : E.dades.objectiu); }
        };
        if (E.flag('clauFerro')) return { pagines: [
            { qui: 'Eva', text: 'Aquesta clau... és de ferro vell, com la porta de fora, la del soterrani! L\'has trobada a la Casa Gran? Surt i dona la volta a la Taverna: és a la dreta, de cara al camí.' },
            { qui: 'Eva', text: E.flag('cantMiracle') ? 'I la Pianista t\'ha ensenyat el cant. Vés amb compte, allà baix.' : 'Abans de baixar, passa pel Santuari: la Pianista sempre diu que hi ha un cant per a cada porta.' }
        ] };
        if (E.flag('runna')) return { pagines: [
            { qui: 'Eva', text: 'Aquesta espasa brilla com si estigués contenta. Amb això potser obriríem la porta... però el pany és de clau. Una clau de ferro, grossa.' },
            { qui: 'Eva', text: 'L\'Isidre diu que els monjos ho amagaven tot a la Casa Gran. Potser la clau també.' }
        ] };
        return { pagines: [
            { qui: 'Eva', text: 'No et puc ajudar a obrir la porta de ferro: no té pany per a cap clau que hi hagi a la Taverna. Diuen que els monjos la van tancar amb una espasa que brilla.' },
            { qui: 'Eva', text: 'Busca aquesta espasa, Ineu. Jo em quedo aquí, fent veure que treballo.' }
        ] };
    },

    rebostTaverna: E => ({ pagines: [{ qui: '', text: "La porta del rebost, tancada amb forrellat. D'aquí no es baixa al soterrani." }] }),

    // La porta de ferro de fora, al darrere de la Taverna: la del soterrani, que el Germà Andreu tanca amb clau cada nit
    portaSoterrani: E => E.flag('clauFerro') ? { pagines: [
        { qui: '', text: "La Clau de ferro gira al pany amb un gemec. La porta s'obre sobre una escala que baixa al soterrani." }
    ] } : { pagines: [
        { qui: '', text: "Una porta de ferro baixa, mig enterrada al costat de la Taverna, tancada amb clau. Per sota s'escola boira lila. Al fang, petjades de sandàlia." },
        { qui: 'Ineu', text: "(Tancada amb clau. Per aquí deu baixar el Germà Andreu cada nit. Em caldria una clau de ferro, de les velles.)" }
    ] },

    acordio: E => ({ pagines: [{ qui: '', text: "Un acordió vell sobre una cadira, amb una cinta vermella. L'Eva el toca quan la Carmen dorm: diu que així la boira no entra." }] }),
    taulellTaverna: E => ({ pagines: [{ qui: '', text: "El taulell de la Taverna, de marbre gastat. Gots del revés, una gerra de vi del Solsonès i un plat de coca amb sucre que ningú no ha tastat." }] }),

    portaFerro: E => {
        if (E.flag('portaFerroOberta')) return { pagines: [{ qui: '', text: "La porta de ferro, oberta de bat a bat. Una escala humida baixa cap a la foscor, i d'allà puja olor de bolets i de terra mullada." }] };
        if (E.te('clau_girgoles') && !E.flag('cantMiracle')) return { pagines: [
            { qui: 'Ineu', text: '(Tinc la clau, però allà baix només un cant em serveix: els barrots de la gàbia només escolten el Cant del Miracle. Primer l\'he d\'aprendre: la Pianista, al Santuari, me l\'ensenyarà.)' }
        ] };
        if (E.te('clau_girgoles')) return { pagines: [
            { qui: '', text: 'La clau rovellada del Siscu gira al pany petit. La porta s\'obre i, molt avall, se senten ocells.' },
            { qui: 'Ineu', text: '(Tinc Runna i el Cant del Miracle. Endavant.)' }
        ] };
        return { pagines: [
            { qui: '', text: 'Una segona porta de ferro, amb un pany petit, molt diferent del de la porta de fora. Per sota surt boira lila.' },
            { qui: '', text: 'A la fusta del marc, algú hi va gravar fa segles una espasa i una gàbia. A dins, molt lluny, se sent piular.' },
            { qui: 'Ineu', text: E.flag('clauFerro') ? '(La Clau de ferro dels monjos no hi entra: és massa grossa. El Germà Andreu en deu tenir una altra, de petita. Algú l\'ha vist entrar de nit?)' : '(Aquí és d\'on surt tot. Em falta l\'espasa que la va segellar... i una clau.)' }
        ] };
    }
});

// ---------------- LA TAVERNA PER DINS ----------------
class ZonaTavernaInt extends ZonaBase {
    constructor() {
        super('ZonaTavernaInt', {
            nom: 'La Taverna',
            amplada: 1000,
            alcada: 800,
            colorFons: '#140e0a',
            pacifica: true,
            entrades: { porta: { x: 500, y: 700, dir: 'amunt' } }
        });
    }

    construir() {
        const A = 1000, H = 800;
        this.terra('taulons', 100, 40, 800, 760, -1100).setTint(0xb08a5a);
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
        this.colisio(A / 2, 70, A - 120, 140);
        this.colisio(265, H - 10, 330, 20);
        this.colisio(735, H - 10, 330, 20);

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

        // El taulell (llarg, de fusta amb sobre de marbre) i la Carmen dormint al darrere
        const t = this.add.graphics().setDepth(250);
        t.fillStyle(0x000000, 0.25).fillRect(110, 248, 400, 14);
        t.fillStyle(0x6a4224, 1).fillRect(110, 180, 400, 70);
        for (let x = 130; x < 500; x += 46) t.fillStyle(0x5a361c, 1).fillRect(x, 192, 30, 48);
        t.fillStyle(0xe0d8c8, 1).fillRect(104, 168, 412, 16).lineStyle(2, 0x1a1008, 1).strokeRect(104, 168, 412, 16).strokeRect(110, 184, 400, 66);
        [[170, 160], [230, 158], [400, 160]].forEach(([x, y]) => t.fillStyle(0xd8e8f0, 0.8).fillRect(x, y, 14, 18).lineStyle(1, 0x5a6a7a, 1).strokeRect(x, y, 14, 18));
        t.fillStyle(0xc87a3a, 1).fillEllipse(320, 166, 50, 14);                                   // plat de coca
        this.colisio(310, 215, 410, 70);
        this.interactiu(310, 270, 90, DIALEGS.taulellTaverna, { altura: 90 });
        const zz = this.add.text(330, 70, 'z z Z', estilText(26, '#f2e6c8', { fontStyle: 'italic' })).setDepth(400);
        this.tweens.add({ targets: zz, y: 50, alpha: 0.2, yoyo: true, repeat: -1, duration: 1400 });

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
            this.posar('taula', x, y, { escala: 0.8, col: { w: 130, h: 26 } });
            [[-70, 20], [70, 20]].forEach(([dx, dy]) => this.posar('tamboret', x + dx, y + dy, { escala: 0.8, col: { w: 30, h: 12 } }));
            const e = this.posar('espelma', x, y - 50, { fonsY: y + 2 });
            this.tweens.add({ targets: e, alpha: 0.7, yoyo: true, repeat: -1, duration: 330 + i * 80 });
        });
        // Barrils de vi, apilats a la dreta, i l'acordió
        [[860, 470], [900, 500], [880, 440]].forEach(([x, y]) => this.posar('barril', x, y, { col: { w: 46, h: 20 } }));
        this.posar('tamboret', 150, 400, { col: { w: 36, h: 14 } });
        const ac = this.add.graphics().setDepth(390);
        ac.fillStyle(0x8a1a1a, 1).fillRoundedRect(130, 360, 40, 30, 4);
        for (let k = 0; k < 5; k++) ac.fillStyle(k % 2 ? 0xf2ecdc : 0x2a2a2a, 1).fillRect(134 + k * 7, 362, 5, 26);
        this.interactiu(150, 410, 70, DIALEGS.acordio, { altura: 60 });

        // L'Eva, al costat de la llar
        this.npc('eva', 650, 290, DIALEGS.eva, { flipX: true });

        // La porta del rebost, a la paret del fons a la dreta: tancada (des d'aquí no es baixa al soterrani)
        const pf = this.add.graphics().setDepth(-950);
        pf.fillStyle(0x120a04, 1).fillRect(812, 30, 96, 106);
        pf.fillStyle(0x5a3a1e, 1).fillRect(818, 36, 84, 100);
        for (let k = 1; k < 4; k++) pf.lineStyle(2, 0x2a1608, 1).lineBetween(818 + k * 21, 36, 818 + k * 21, 136);
        pf.fillStyle(0x2a2a2e, 1).fillRect(830, 82, 60, 8).fillCircle(892, 92, 4);
        this.interactiu(860, 175, 70, DIALEGS.rebostTaverna, { altura: 90 });

        this.add.rectangle(A / 2, H / 2, A, H, 0xffc070, 0.07).setDepth(80000);
        this.sortida(460, H - 22, 80, 14, 'ZonaTaverna', 'interior');
    }
}

// ---------------- EL SOTERRANI DE LA TAVERNA (la porta de ferro) ----------------
class ZonaSotaTaverna extends ZonaBase {
    constructor() {
        super('ZonaSotaTaverna', {
            nom: 'Soterrani de la Taverna',
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
        this.colisio(A / 2, 90, A, 180);
        this.colisio(220, H - 10, 280, 20);
        this.colisio(580, H - 10, 280, 20);

        // La porta de ferro, al mig de la paret del fons, amb boira lila que en surt
        const pf = this.add.graphics().setDepth(-950);
        pf.fillStyle(0x0a0808, 1).fillRect(300, 10, 200, 150);
        pf.fillStyle(0x2a2a30, 1).fillRect(310, 18, 180, 142);
        for (let y = 30; y < 160; y += 26) for (let x = 322; x < 490; x += 28) pf.fillStyle(0x4a4a52, 1).fillCircle(x, y, 4);
        pf.fillStyle(0x1a1a1e, 1).fillRect(310, 82, 180, 10).fillRect(310, 128, 180, 10);
        pf.fillStyle(0x8a7a40, 1).fillRect(460, 88, 18, 26).fillStyle(0x0a0808, 1).fillRect(466, 96, 6, 12);
        // Espasa i gàbia gravades al marc
        pf.lineStyle(3, 0x7a6a8a, 0.8).lineBetween(282, 30, 282, 120).lineBetween(272, 50, 292, 50);
        pf.strokeRect(508, 60, 24, 34).lineBetween(514, 60, 514, 94).lineBetween(520, 60, 520, 94).lineBetween(526, 60, 526, 94);
        const resplendor = this.add.ellipse(400, 170, 320, 70, 0x9a50ff, 0.25).setDepth(-940);
        this.tweens.add({ targets: resplendor, alpha: 0.08, scaleX: 1.15, yoyo: true, repeat: -1, duration: 1600 });
        this.boira(400, 170, 220, 40, 1.2);
        this.boira(300, 420, 160, 40, 0.5);
        this.boira(520, 600, 160, 40, 0.5);
        this.fullaPorta = pf;
        this.interactiu(400, 220, 120, DIALEGS.portaFerro, { altura: 170, actiu: () => !Estat.flag('portaFerroOberta'), enTancar: () => { if (Estat.te('clau_girgoles') && Estat.flag('cantMiracle')) this.obrirPortaFerro(); } });
        if (Estat.flag('portaFerroOberta')) this.obrirPortaFerro(true);

        // Sacs i botes de vi, i petjades a la pols
        [[150, 300], [180, 350], [640, 320]].forEach(([x, y]) => this.posar('barril', x, y, { col: { w: 46, h: 20 } }));
        const sacs = this.add.graphics().setDepth(520);
        [[620, 520], [660, 545], [140, 560]].forEach(([x, y]) => sacs.fillStyle(0x8a7a5a, 1).fillEllipse(x, y, 60, 40).lineStyle(2, 0x3a3020, 1).strokeEllipse(x, y, 60, 40));
        const pj = this.add.graphics().setDepth(-1000);
        for (let k = 0; k < 9; k++) pj.fillStyle(0x2a2430, 0.6).fillEllipse(380 + (k % 2) * 30, 740 - k * 60, 14, 22);

        // Escala que puja (sortida), a baix
        const esc = this.add.graphics().setDepth(-1000);
        for (let k = 0; k < 5; k++) esc.fillStyle(0x4a4450 + k * 0x050505, 1).fillRect(340, H - 100 + k * 20, 120, 20);
        this.add.rectangle(A / 2, H / 2, A, H, 0x1a0a30, 0.25).setDepth(80000);
        this.sortida(360, H - 22, 80, 14, 'ZonaTaverna', 'soterrani');                 // l'escala puja a la porta de ferro de fora
    }

    // La Clau de ferro obre la porta: s'hi veu l'escala que baixa a la Sala de les Gírgoles
    obrirPortaFerro(ja = false) {
        if (this.portaOberta) return;
        this.portaOberta = true;
        if (!ja) { Estat.posaFlag('portaFerroOberta'); Sfx.secret(); this.cameras.main.shake(400, 0.004); Estat.posaObjectiu('Baixa per la porta de ferro, al soterrani de la Taverna.'); Estat.desar(); }
        const forat = this.add.graphics().setDepth(-945);
        forat.fillStyle(0x000000, 1).fillRect(312, 20, 176, 140);
        for (let k = 0; k < 5; k++) forat.fillStyle(0x2a2430 - k * 0x040404, 1).fillRect(330 + k * 6, 40 + k * 22, 140 - k * 12, 18);
        forat.fillStyle(0x2a2a30, 1).fillRect(470, 18, 30, 142);
        // La fulla de ferro gira sobre la frontissa de l'esquerra i es queda oberta, de cantó
        const f = this.add.graphics().setDepth(-944).setPosition(310, 18);
        f.fillStyle(0x2a2a30, 1).fillRect(0, 0, 180, 142).lineStyle(2, 0x111114, 1).strokeRect(0, 0, 180, 142);
        for (let y = 12; y < 142; y += 26) for (let x = 12; x < 180; x += 28) f.fillStyle(0x4a4a52, 1).fillCircle(x, y, 4);
        f.fillStyle(0x1a1a1e, 1).fillRect(0, 64, 180, 10).fillRect(0, 110, 180, 10);
        f.fillStyle(0x8a7a40, 1).fillRect(150, 70, 18, 26).fillStyle(0x0a0808, 1).fillRect(156, 78, 6, 12);
        if (ja) f.scaleX = 0.1;
        else this.tweens.add({ targets: f, scaleX: 0.1, duration: 1100, ease: 'Sine.easeInOut' });
        this.sortida(340, 170, 120, 30, 'ZonaGirgoles', 'porta');
    }
}
