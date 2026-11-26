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
                rovellonera: { x: 60, y: 565, dir: 'dreta' },
                final: { x: 300, y: 1335, dir: 'esquerra' }          // la cinemàtica final (només després de l'epíleg): l'Ineu arriba al carro del Follet
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1800, 1300, -1100);
        // (abans hi havia una clariana de gespa més clara sobre l'herba: dos tons; ara tot és un sol to d'herba)
        if (this.dadesEntrada && this.dadesEntrada.entrada === 'final') {          // escena final (el Follet allibera els ocells): només herba i uns quants arbres, sense camins, bancs ni Galf
            this.bancsEsg = []; this.assegut = false;
            this.cinemaCel();
            this.posar('roure', 760, 1660, { escala: 1.7, col: { w: 100, h: 40 } });
            this.arbres([[30, 1190], [1000, 1700], [1220, 1640], [470, 1680]]);          // (només el de l'esquerra queda a l'altura dels personatges; els altres, a la part baixa, on el diàleg els pot tapar)
            return;
        }
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
        // Enemics a l'herba del nord, lluny dels bancs i de les sortides: una escolopendra i un cargol
        this.enemic('escolopendra', 700, 300);
        this.enemic('cargol', 1300, 330);

        this.sortida(240, 0, 160, 14, 'ZonaErmita', 'era');
        this.sortida(1786, 500, 14, 130, 'ZonaJardi', 'era');
        this.sortida(0, 500, 14, 130, 'ZonaCamiRov', 'era');
    }

    // CINEMÀTICA FINAL, just abans dels crèdits (venim de l'epíleg del Santuari): l'alba a l'Era, el Follet del Carro Verd obre la gàbia del darrere i en surten els ocells que els seus avis
    // van guardar quan van tancar l'Ocellaire; tot s'enfosqueix i comencen els crèdits. (Mai no es desa res: Estat.acabada.)
    enEntrar() {
        if (this.dadesEntrada.entrada !== 'final') return;
        Estat.acabada = true;
        this.cinema = true; this.canviant = true;
        const dep = () => { if (this.ineu && this.ineu.active) this.ineu.setDepth(this.ineu.y); };          // (a la cinemàtica la profunditat no s'actualitza: sense això el carro tapava l'Ineu)
        this.events.on('update', dep); this.events.once('shutdown', () => this.events.off('update', dep));
        const cam = this.cameras.main;
        cam.fadeIn(2200, 0, 0, 0);
        this.pcFinal = { x: 262, y: 1085, z: 1.3 };
        this.enquadrar(this.pcFinal.x, this.pcFinal.y, this.pcFinal.z, 1, null, 300);          // Follet i Ineu en primer pla, amb una mica del carro al darrere
        this.terra("herba", -1500, -1500, 4800, 4400, -1101);          // herba també fora del món: la càmera cinematogràfica en veu més que el mapa
        this.add.rectangle(900, 650, 4800, 4400, 0xffc47a, 0.14).setBlendMode('ADD').setDepth(99950);          // la llum rosada de l'alba
        this.time.delayedCall(900, () => this.posarDireccio('esquerra', false));          // l'Ineu mira el Follet (que és a l'esquerra), no d'esquena
        this.time.delayedCall(2600, () => {
            const ui = this.ui();
            if (!ui) return;
            ui.obrirDialeg(DIALEGS.follet_final(Estat), () => {
                cam.fadeOut(2400, 0, 0, 0);
                cam.once('camerafadeoutcomplete', () => { Joc.aturarTot(this); this.scene.stop('UI'); this.scene.start('Credits'); });
            });
        });
    }

    // El lloc de la cinemàtica final: gespa i arbres a baix, un muret baix de pedra (el de la pèrgola del jardí, sense columnes) i, al darrere, el cel de la pèrgola amb el seu núvol en cargol
    cinemaCel() {
        const HOR = 1140;                                          // la base del muret (l'horitzó)
        const cel = this.add.graphics().setDepth(-1050);
        cel.fillGradientStyle(0x62a8e0, 0x62a8e0, 0xb4daf2, 0xb4daf2, 1).fillRect(-1500, HOR - 1500, 4800, 1500 - 30);
        // el mateix núvol i el mateix moviment que a la pèrgola: va lent d'esquerra a dreta, «respira» i torna a entrar per l'esquerra
        const ample = 320, vel = 12, g = this.add.image(170, HOR - 190, 'nuvol').setOrigin(0.5, 0.5).setDepth(-1045).setAlpha(0.95).setFlipX(true);
        const E0 = ample / g.width; g.setScale(E0);
        this.tweens.add({ targets: g, scaleY: E0 * 0.84, scaleX: E0 * 1.03, duration: 2300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        const FI = 1400 + ample, INICI = -700 - ample;
        const anar = x => { g.x = x; this.tweens.add({ targets: g, x: FI, duration: (FI - x) / vel * 1000, ease: 'Linear', onComplete: () => anar(INICI) }); };
        anar(170);
        // el muret: la textura de la pèrgola repetida, d'una punta a l'altra
        const tx = this.textures.get('muret_textura').getSourceImage(), TW = 182, sg = TW / tx.width;
        const yTop = HOR - (tx.height - 15) * sg;                 // (la vora de baix del cos del mur, a la fila 325)
        for (let x = -1500; x < 3300; x += TW) this.add.image(x, yTop, 'muret_textura').setOrigin(0, 0).setScale(sg).setDepth(HOR - 2).setTint(0xe8e8e0);
        this.add.rectangle(900, HOR - 3, 4800, 14, 0x1c3a12, 0.28).setDepth(HOR - 1);          // l'ombra del muret sobre la gespa: l'arrela al terra
    }

    // ---------- Cinemàtica final: el Follet obre l'última gàbia i volen molts ocells de colors ----------
    // Geometria de la gàbia (el carro sense girar: la gàbia és a la dreta del dibuix de 598x411)
    gabiaCarro() {
        const c = this.carroParada; if (!c) return null;
        const W = c.displayWidth, H = c.displayHeight, x0 = c.x - W / 2, y0 = c.y - H, k = W / 598;
        return { x: x0 + 440 * k, xd: x0 + 590 * k, y: y0 + 95 * k, yb: y0 + 215 * k, py: y0 + 30 * k, pyb: y0 + 300 * k, k };
    }
    // El Follet (amb el seu full de caminar) va, pel davant del carro, fins a la part del darrere (on hi ha la porta de barrots de la gàbia)
    folletVaDarrere(fet) {
        const g = this.gabiaCarro(), f = this.npcs && this.npcs.follet_carro;
        if (!g || !f) { if (fet) fet(); return; }
        // l'Ineu es gira cap a la dreta just quan el Follet li passa pel darrere (no abans)
        const gira = () => { if (f.x >= this.ineu.x - 6) { this.posarDireccio('dreta', false); this.events.off('update', gira); } };
        this.events.on('update', gira); this.events.once('shutdown', () => this.events.off('update', gira));
        this.pcFinal = { x: 350, y: 1085, z: 1.3 };
        this.npcVa('follet_carro', g.xd + 50, this.carroParada.y + 14, () => this.npcPerfil('follet_carro', g.xd - 40, fet), 85);
        this.enquadrar(this.pcFinal.x, this.pcFinal.y, this.pcFinal.z, 3200, null, 300);          // sense allunyar: només es desplaça (i s'aproxima una mica) cap al pla proper de la frase següent, seguint el Follet
    }

    // La porta de barrots del darrere del carro s'obre cap enrere: vista de costat, tancada és gairebé de perfil (una ratlla) i en girar sobre la frontissa (a la vora del carro) es mostra de cara cap a la dreta
    obrirPortaDarrere(fet) {
        const c = this.carroParada;
        if (!c || !this.textures.exists('porta_gabia')) { if (fet) fet(); return; }
        const W = c.displayWidth, H = c.displayHeight, k = W / 598;
        const porta = this.add.sprite(c.x + W / 2 - 17 * k, c.y - H + 148 * k, 'porta_gabia', 0).setOrigin(0, 0.5).setScale(0.5).setDepth(c.depth - 0.05)          // enganxada al carro i una mica tapada per la part del darrere;
        this.portaGabia = porta;
        if (Sfx.porta) Sfx.porta();
        let n = 0;
        const t = this.time.addEvent({ delay: 95, repeat: 10, callback: () => { n++; porta.setFrame(n); if (n >= 11) { t.remove(); if (fet) fet(); } } });
    }
    // Textures dels ocells (de perfil, mirant a la dreta, amb dos fotogrames d'ales: amunt i avall)
    texturesOcells() {
        const PAL = [
            { c: '#d8322e', a: '#9c1c20', v: '#ee7a5e', b: '#f2b13a' }, { c: '#3a78d8', a: '#1f4a98', v: '#eaf0fa', b: '#2c2c2c' },
            { c: '#f6d43a', a: '#d49a18', v: '#fff3a8', b: '#f08a2a' }, { c: '#3fb04a', a: '#1c7a38', v: '#a6e07a', b: '#f2b13a', h: '#e23b3b' },
            { c: '#f08a26', a: '#2c2c34', v: '#ffc778', b: '#333' }, { c: '#8a4fd0', a: '#58289c', v: '#dcc0f6', b: '#f2b13a' },
            { c: '#25b8b0', a: '#16807c', v: '#aaeee8', b: '#f08a2a' }, { c: '#f27fb0', a: '#cc4a84', v: '#ffc8de', b: '#444' }
        ];
        PAL.forEach((p, i) => ['a', 'b'].forEach(fr => {
            const key = 'ocell_' + i + '_' + fr;
            if (this.textures.exists(key)) return;
            const t = this.textures.createCanvas(key, 160, 120), c = t.getContext();
            c.lineJoin = 'round'; c.lineWidth = 4; c.strokeStyle = '#2a1a10';
            const el = (x, y, rx, ry, col) => { c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 6.3); c.fillStyle = col; c.fill(); c.stroke(); };
            c.beginPath(); c.moveTo(52, 70); c.lineTo(8, 58); c.lineTo(14, 82); c.lineTo(8, 92); c.closePath(); c.fillStyle = p.a; c.fill(); c.stroke();
            const ala = (rot, col) => { c.save(); c.translate(72, 62); c.rotate(rot); c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-14, -34, -56, -34); c.quadraticCurveTo(-46, -12, -30, 4); c.closePath(); c.fillStyle = col; c.fill(); c.stroke(); c.restore(); };
            el(80, 72, 36, 23, p.c);
            c.beginPath(); c.ellipse(84, 80, 28, 13, 0, 0, 6.3); c.fillStyle = p.v; c.fill();
            el(112, 52, 18, 17, p.h || p.c);
            c.beginPath(); c.moveTo(127, 47); c.lineTo(148, 55); c.lineTo(127, 61); c.closePath(); c.fillStyle = p.b; c.fill(); c.stroke();
            c.beginPath(); c.arc(117, 49, 5.5, 0, 6.3); c.fillStyle = '#fff'; c.fill(); c.lineWidth = 2.5; c.stroke(); c.beginPath(); c.arc(119, 49, 2.8, 0, 6.3); c.fillStyle = '#111'; c.fill();
            c.lineWidth = 4;
            if (fr === 'a') ala(-0.9, p.a); else { c.save(); c.scale(1, -1); c.translate(0, -124); ala(-0.55, p.a); c.restore(); }
            t.refresh();
        }));
        return PAL.length;
    }
    // Els ocells surten volant de la gàbia: molts, de colors, cap amunt en totes direccions, i s'allunyen
    ocellsVolen(fet) {
        const g = this.gabiaCarro(); if (!g || this.ocellsFets) { if (fet) fet(); return; }
        this.ocellsFets = true;          // (si el pas es dispara dues vegades, no es dupliquen els ocells)
        const NP = this.texturesOcells(), N = 162, sy = (g.y + g.yb) / 2, cDep = this.carroParada.depth;
        this.obrirPortaDarrere(() => {});
        const vius = [];
        for (let i = 0; i < N; i++) this.time.delayedCall(900 + i * 22 + Math.random() * 20, () => {
            const pal = i % NP;
            const b = this.add.image(g.x + 10 + Math.random() * (g.xd - g.x - 30), sy + (Math.random() - 0.4) * 50, 'ocell_' + pal + '_a').setDepth(cDep - 0.5).setAlpha(1);          // dins del carro: el carro els tapa fins que passen per la porta
            const ang = Phaser.Math.DegToRad(-165 + Math.random() * 150);
            const dir = { x: Math.cos(ang) + 0.25, y: Math.sin(ang) };
            const dist = 650 + Math.random() * 600, s0 = 0.22 + Math.random() * 0.12, fase = Math.random() * 6.3, amp = 18 + Math.random() * 30, f = 0.7 + Math.random() * 0.6;
            const x0 = b.x, y0 = b.y, esq = dir.x < 0, xs = g.xd + 70, ys = g.y + 10 + Math.random() * (g.yb - g.y - 20);
            b.setFlipX(esq); b.setScale(s0);
            const o = { b, pal, fase, p: 0 };
            vius.push(o);
            this.tweens.add({ targets: o, p: 1, duration: 3600 + Math.random() * 1400, ease: 'Sine.easeIn',
                onUpdate: () => {
                    const p = o.p, e = p * p * 0.6 + p * 0.4, nx = -dir.y, ny = dir.x;
                    const w = Math.sin(p * 9 * f + fase) * amp * (0.3 + p);
                    const q = Math.min(1, p / 0.2), sq = Math.sin(q * Math.PI / 2);          // primer, cap a la porta del darrere
                    b.setPosition(x0 + (xs - x0) * sq + dir.x * dist * e + nx * w, y0 + (ys - y0) * sq + dir.y * dist * e + ny * w);
                    if (!o.pas && b.x > g.xd + 4) { o.pas = true; b.setDepth(cDep - 0.1); }          // ha passat la vora del carro: la porta (oberta cap a nosaltres, amb la frontissa a la vora) li queda al davant
                    if (!o.fora && b.x > g.xd + 74) { o.fora = true; b.setDepth(90000); }          // ja ha passat per darrere de la fulla (la vora lliure de la porta): es veu per sobre de tot          // ja ha sortit del carro: es veu per sobre de tot
                    b.setScale(s0 * (1 - 0.4 * p)); b.setAlpha(p > 0.78 ? (1 - p) / 0.22 : 1);
                    const rot = Math.atan2(dir.y, esq ? -dir.x : dir.x) * 0.5; b.setRotation(esq ? -rot : rot);
                },
                onComplete: () => { b.destroy(); o.mort = true; } });
        });
        const bat = () => { const t = this.time.now; vius.forEach(o => { if (!o.mort && o.b.active) o.b.setTexture('ocell_' + o.pal + '_' + (Math.floor(t / 85 + o.fase * 3) % 2 ? 'a' : 'b')); }); };
        this.events.on('update', bat); this.events.once('shutdown', () => this.events.off('update', bat));
        this.enquadrar(g.xd - 20, sy + 10, 1.3, 1000, null, 0);
        this.time.delayedCall(2600, () => this.enquadrar(g.xd + 40, sy - 170, 0.98, 3800, null, 0));
        this.time.delayedCall(8200, () => {
            this.events.off('update', bat);
            this.enquadrar(this.pcFinal.x, this.pcFinal.y, this.pcFinal.z, 1500, () => { if (fet) fet(); }, 300);          // de nou pla proper: Follet i Ineu, per a les frases que queden
        });
    }

    // Quan l'Ineu s'asseu al banc (vigilaBancs / seureBanc, comuns amb l'església), el Galf li parla: ja és assegut, així que passa directe a la conversa
    enSeureBanc() {
        Estat.posaFlag('garfBancSegut');
        this.time.delayedCall(350, () => { if (this.assegut && !this.ui().dialeg) this.interactuar(this.puntGalf); });
    }
}
