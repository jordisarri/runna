/**
 * ESGLÉSIA NOVA (prototip jugable, apart de la ZonaEsglesia de la història).
 * Disseny de proves/esglesia/ passat al joc: vista aèria 3/4, presbiteri elevat amb retaule, altar, orgue (Pianista) i el Pare Nadiel;
 * a esquerra la capella petita i a dreta la sacristia (cadascuna ocupa tota la llargada del presbiteri, amb porta a la nau);
 * des del graó, 3 arcades-capella a cada costat; 4 files de bancs i catifa central.
 * Entrada de proves: http://localhost:8000/?esglesia   (o ?proves -> 🧪 -> zona EsglesiaNova)
 */
const ENV = (() => {
    const yF = 1190, PRES = 480, BL = 480, BAYS = 3, T = 80;
    const ySt = yF + PRES, yB = ySt + T, yE = yB + BL * BAYS;
    return { T, W: 1920, yF, PRES, BL, BAYS, ySt, yB, yE, A: yE + 60, xN0: 400, xN1: 1520, xc: 960, yM: yF + 260 };
})();

class ZonaEsglesiaNova extends ZonaBase {
    constructor() {
        super('ZonaEsglesiaNova', {
            nom: 'Santuari (nou)', amplada: ENV.W, alcada: ENV.A, colorFons: '#140e0a', pacifica: true,
            entrades: { porta: { x: ENV.xc, y: ENV.A - 50, dir: 'amunt' } }
        });
    }

    construir() {
        const E = ENV, { T, yF, ySt, yB, yE, A, xN0, xN1, xc, yM, BL } = E;
        const g = this.add.graphics().setDepth(-1100);          // pedra de base (parets)
        const f = this.add.graphics().setDepth(-1085);          // terres i detalls plans
        const rc = (gr, x, y, w, h, c, a = 1) => gr.fillStyle(c, a).fillRect(x, y, w, h);

        // ---- Pedra de base amb junts, i parets nord (cara pintada) ----
        rc(g, 0, 0, E.W, A, 0xb8a47c);
        g.lineStyle(2, 0x6a5430, 0.22);
        for (let y = 0; y < A; y += T) { g.lineBetween(0, y, E.W, y); for (let x = ((y / T) % 2) * T / 2; x < E.W; x += T) g.lineBetween(x, y, x, y + T); }
        rc(g, 0, 0, E.W, 70, 0x9c8a64);                                                 // coronament del mur del fons
        rc(g, 40, yF - 230, 320, 230, 0x8c2630); rc(g, 1560, yF - 230, 320, 230, 0x9a7a4a);   // cares nord de la capella (vermella) i la sacristia (guix ocre)
        rc(g, xN0, 70, xN1 - xN0, yF - 70, 0x6a2028);                                    // paret darrere el retaule
        rc(g, xN0, yF - 16, xN1 - xN0, 16, 0x2e1216);                                    // sòcol
        rc(g, 0, yF - 230, 400, 14, 0xd8c8a0); rc(g, 1520, yF - 230, 400, 14, 0xd8c8a0);   // cornises de les sales laterals

        // ---- Terra de la nau i del presbiteri ----
        this.terra('rajola', xN0, yF, xN1 - xN0, A - yF, -1090);
        rc(f, xN0, yF, xN1 - xN0, E.PRES, 0xffe2a0, 0.14);                              // presbiteri, una mica més clar
        rc(f, xN0, ySt, xN1 - xN0, 40, 0xe8d6a8); rc(f, xN0, ySt + 40, xN1 - xN0, 40, 0x8f7a52); rc(f, xN0, ySt + 80, xN1 - xN0, 10, 0x000000, 0.22);   // graons
        // catifa central
        const cx0 = xc - 80, cy0 = yF + 250;
        rc(f, cx0, cy0, 160, A - cy0 - 40, 0x7a1c24); rc(f, cx0 + 14, cy0, 132, A - cy0 - 40, 0xa82a34);
        for (let y = cy0 + 50; y < A - 80; y += 96) f.fillStyle(0xd8a64a, 1).fillPoints([{ x: xc, y: y - 30 }, { x: xc + 36, y }, { x: xc, y: y + 30 }, { x: xc - 36, y }], true);

        // ---- Sales laterals: capella petita (esquerra) i sacristia (dreta), a tota la llargada del presbiteri ----
        rc(f, 40, yF, 320, E.PRES, 0xc9b78d); for (let i = 0; i < 4; i++) for (let j = 0; j < 6; j++) if ((i + j) % 2) rc(f, 40 + i * 80, yF + j * 80, 80, 80, 0xbfab80);
        rc(f, 1560, yF, 320, E.PRES, 0x8a6a40); for (let j = 0; j < 6; j++) { f.lineStyle(2, 0x5a3d1e, 0.5).lineBetween(1560, yF + j * 80, 1880, yF + j * 80); }
        [[360, 'capella'], [1520, 'sacristia']].forEach(([x]) => {       // porta (pas obert al mur divisori) i marc de fusta
            rc(f, x, yM - 70, 40, 140, x < xc ? 0xc9b78d : 0x8a6a40);
            rc(f, x, yM - 84, 40, 16, 0x4a2c14); rc(f, x, yM + 68, 40, 16, 0x4a2c14);
        });
        rc(f, 40, ySt + 0, 320, 6, 0x000000, 0.0);

        // ---- Arcades-capella (3 a cada costat), des del graó ----
        const alcoves = [];
        for (const side of [0, 1]) for (let b = 0; b < E.BAYS; b++) {
            const ax0 = side ? xN1 : 160, y0 = yB + b * BL + T, y1 = yB + (b + 1) * BL - T, h = y1 - y0;
            rc(f, ax0 - 6, y0 - 6, 252, h + 12, 0x8f7c55);                               // marc de pedra
            rc(f, ax0, y0, 240, h, 0xa8905f);
            for (let i = 0; i < 3; i++) for (let j = 0; j * T < h; j++) if ((i + j) % 2) rc(f, ax0 + i * T, y0 + j * T, T, Math.min(T, h - j * T), 0xb19966);
            rc(f, ax0, y0, 240, 110, 0x8c2630); rc(f, ax0, y0 + 100, 240, 10, 0x5a1820);   // cara nord de la capella
            const ox = side ? ax0 + 194 : ax0, ol = side ? ax0 + 144 : ax0 + 46;            // retaule (a tocar del mur exterior) i altar
            const ya = y0 + 130, hh = h - 160;
            rc(f, ox, ya, 46, hh, 0xd4a22a); rc(f, ox + (side ? 30 : 0), ya, 16, hh, 0xf2c94a);
            for (let k = 0; k < 3; k++) rc(f, ox + 10, ya + 14 + k * (hh / 3), 26, hh / 3 - 28, 0x4d3513);
            rc(f, ol, ya + 20, 50, hh - 40, 0xf2ecdc); rc(f, ol, ya + 20, 50, 8, 0xc8962a);
            for (const dy of [28, hh - 34]) f.fillStyle(0xfff2a8, 1).fillCircle(ol + 25, ya + dy, 6);
            this.colisio(side ? ax0 + 240 - 52 - 1 : ax0 + 50, ya + hh / 2, 100, hh);
            rc(f, side ? ax0 + 20 : ax0 + 170, y1 - 52, 50, 28, 0x7a1c24);                 // agenollador
            const nom = ['Capella del Roser', 'Capella de Sant Antoni', 'Capella del Santíssim'][b];
            alcoves.push({ x: ax0 + 120, y: y1 - 80, nom: nom + (side ? ' (dreta)' : ' (esquerra)') });
        }
        alcoves.forEach(a => this.interactiu(a.x, a.y, 90, () => ({ pagines: [{ qui: 'Ineu', text: a.nom + ': un altaret daurat, amb una espelma encesa i la cera encara tèbia. Algú hi ha resat fa poc.' }] }), { altura: 80 }));

        // ---- Murs: col·lisions ----
        const bl = (x0, y0, x1, y1) => this.colisio((x0 + x1) / 2, (y0 + y1) / 2, x1 - x0, y1 - y0);
        bl(0, 0, E.W, yF + 24);                                   // mur del fons (retaule inclòs)
        bl(0, 0, 40, A); bl(E.W - 40, 0, E.W, A);                  // parets exteriors
        for (const [xa, xb] of [[0, 400], [1520, E.W]]) {          // costats: sala del presbiteri, mur sud d'aquesta i pilars entre capelles
            bl(xa, ySt, xb, yB + T);
            for (let k = 1; k < E.BAYS; k++) bl(xa, yB + k * BL - T, xb, yB + k * BL + T);
            bl(xa, yE - T, xb, A);
            bl(xa === 0 ? 0 : 1760, yB, xa === 0 ? 160 : E.W, yE);
        }
        bl(360, yF, 400, yM - 70); bl(360, yM + 70, 400, ySt);       // mur entre capella i presbiteri (amb porta)
        bl(1520, yF, 1560, yM - 70); bl(1520, yM + 70, 1560, ySt);   // mur entre presbiteri i sacristia (amb porta)
        bl(xN0, A - 20, 920, A); bl(1000, A - 20, xN1, A);         // peu de la nau, amb el pas de la porta

        // ---- Retaule major (el que ja tenim), sagrari i altar ----
        this.retaule = this.posar('retaule', xc, yF + 24, { fonsY: yF - 110, escala: 1.2 });
        this.interactiu(xc, yF + 42, 140, DIALEGS.sagrari, { altura: 170, actiu: () => !Estat.flag('fragment2') });
        this.posar('altar', xc, yF + 190, { col: { w: 190, h: 34 }, escala: 1.3, opac: true });

        // ---- Orgue, Pianista i Pare Nadiel ----
        this.orgue = this.posar('orgue', 1300, yF + 330, { col: { w: 110, h: 50 }, opac: true });
        const pia = this.npc('pianista', this.orgue.x, this.orgue.y + 24, DIALEGS.pianista, { flipX: true, radi: RADI_NPC });
        pia.setDepth(this.orgue.y + 1);
        [pia.respira, pia.balanceig].forEach(t => t && t.remove()); pia.respira = pia.balanceig = null; pia.setAngle(0);
        pia.punt.npc = null;
        this.npc('pare_daimiel', 650, yF + 300, DIALEGS.pareDaimiel, { flipX: false });
        this.time.delayedCall(50, () => this.pianistaToca(true));        // toca l'orgue d'esquena

        // ---- Capella petita (esquerra): retaule menut, altar, agenollador ----
        const cap = this.add.graphics().setDepth(yF - 100);
        rc(cap, 90, yF - 215, 220, 215, 0x6e4d12); rc(cap, 90, yF - 215, 220, 30, 0xd4a22a);
        [110, 170, 230].forEach((x, k) => { rc(cap, x, yF - 170, 56, 110, 0x34230d); rc(cap, x + 18, yF - 140, 20, 60, [0xa83a3a, 0x3a5a9a, 0x3f7a4a][k]); cap.fillStyle(0xf0c840, 1).fillCircle(x + 28, yF - 150, 9); });
        [100, 160, 220, 280].forEach(x => rc(cap, x, yF - 170, 10, 110, 0xf2c94a));
        rc(cap, 90, yF - 60, 220, 30, 0xd4a22a);
        rc(this.add.graphics().setDepth(yF + 70), 120, yF + 40, 160, 62, 0xf6f0e0); rc(this.add.graphics().setDepth(yF + 100), 120, yF + 84, 160, 18, 0xc8962a);
        [135, 255].forEach(x => { rc(this.add.graphics().setDepth(yF + 40), x, yF + 8, 10, 34, 0xe0b030); this.add.circle(x + 5, yF + 4, 5, 0xfff2a8).setDepth(yF + 41); });
        this.colisio(200, yF + 70, 170, 40);
        rc(f, 150, yF + 300, 100, 36, 0x7a1c24); rc(f, 150, yF + 300, 100, 6, 0xa82a34);       // agenollador
        this.add.rectangle(200, yF + 240, 90, 90, 0xffe8a0, 0.10).setDepth(80000);                // llum d'una finestra
        this.interactiu(200, yF + 130, 100, () => ({ pagines: [{ qui: 'Ineu', text: 'La capelleta petita: un altaret, un retaule menut i un agenollador. Se sent la pau fins a la nau.' }] }), { altura: 80 });
        this.interactiu(200, yF + 340, 80, () => ({ pagines: [{ qui: 'Ineu', text: "(M'agenollo un moment. El silenci aquí dins és el més net del Santuari.)" }] }), { altura: 60 });

        // ---- Sacristia (dreta): armari, taula amb calze, cadira, penjador ----
        const sac = this.add.graphics().setDepth(yF - 100);
        rc(sac, 1590, yF - 215, 150, 215, 0x5a3318); rc(sac, 1590, yF - 215, 150, 14, 0x8a5a30); rc(sac, 1664, yF - 200, 4, 200, 0x2e1c10); rc(sac, 1596, yF - 215 + 90, 138, 4, 0x2e1c10);
        rc(sac, 1700, yF - 130, 10, 14, 0xe0b030); rc(sac, 1650, yF - 130, 10, 14, 0xe0b030);
        rc(sac, 1780, yF - 190, 6, 170, 0x5a3318); rc(sac, 1780, yF - 190, 70, 6, 0x5a3318);       // penjador amb vestits litúrgics
        [[1792, 0xf2ecdc], [1814, 0x3a5a9a], [1836, 0xa83a3a]].forEach(([x, c]) => rc(sac, x, yF - 184, 20, 120, c));
        this.colisio(1665, yF + 20, 150, 40);
        const mob = this.add.graphics().setDepth(yF + 200);
        rc(mob, 1650, yF + 150, 170, 74, 0x7a4a28); rc(mob, 1650, yF + 150, 170, 10, 0xa06a3a); rc(mob, 1660, yF + 224, 14, 22, 0x4a2c14); rc(mob, 1796, yF + 224, 14, 22, 0x4a2c14);
        rc(mob, 1722, yF + 128, 22, 24, 0xe0b030); rc(mob, 1714, yF + 148, 38, 6, 0xc8962a);   // calze
        this.colisio(1735, yF + 190, 170, 50);
        const cad = this.add.graphics().setDepth(yF + 340);
        rc(cad, 1810, yF + 300, 56, 50, 0x8a5a30); rc(cad, 1810, yF + 262, 56, 40, 0x6b4020);
        rc(f, 1600, yF + 340, 110, 80, 0x7a1c24, 0.7); rc(f, 1608, yF + 348, 94, 64, 0xa82a34, 0.7);   // estora
        this.interactiu(1665, yF + 70, 100, () => ({ pagines: [{ qui: 'Ineu', text: "L'armari de la sacristia: casulles, albes i estoles planxades. Fa olor de lavanda i de cera." }] }), { altura: 80 });
        this.interactiu(1735, yF + 255, 100, () => ({ pagines: [{ qui: 'Ineu', text: 'La taula de la sacristia: un calze, uns tovallons i el llibre dels oficis, tot ben posat. El Pare Nadiel és un home ordenat.' }] }), { altura: 80 });

        // ---- Pilastres de la nau i plantes ----
        const pil = this.add.graphics().setDepth(yB);
        for (let k = 0; k <= E.BAYS; k++) { const y = yB + k * BL; for (const x of [xN0, xN1 - 36]) { rc(pil, x, y - 40, 36, 80, 0xd8c8a0); rc(pil, x + (x === xN0 ? 28 : 0), y - 40, 8, 80, 0xa8956b); } }
        [[xN0 + 60, yB + 40], [xN1 - 60, yB + 40]].forEach(([x, y]) => {
            this.add.rectangle(x, y - 14, 44, 28, 0x9a6a4a).setDepth(y); this.add.circle(x, y - 54, 34, 0x2f6a3a).setDepth(y + 1);
            this.add.circle(x - 10, y - 74, 24, 0x3f8a4a).setDepth(y + 2); this.add.circle(x + 14, y - 46, 20, 0x234f2c).setDepth(y + 2);
            this.colisio(x, y - 8, 44, 18);
        });

        // ---- 4 files de bancs, vists per darrere, mirant l'altar ----
        this.bancsEsg = []; this.assegut = false;          // l'Ineu s'hi asseu caminant-hi des del davant (com a la ZonaEsglesia)
        for (let r = 0; r < 4; r++) {
            const y = yB + 240 + r * 220;
            [560, 790, 1130, 1360].forEach(x => { this.posar('banc_esglesia', x, y, { col: { w: 190, h: 18 }, escala: 1.45, opac: true }); this.bancsEsg.push({ x, y, w: 190, cara: 'amunt' }); });
        }

        this.add.rectangle(xc, A / 2, xN1 - xN0, A, 0xffd38a, 0.05).setDepth(80000);       // llum de les vidrieres
        this.sortida(xc, A - 20, 80, 20, 'ZonaPlaca', 'esglesia');
    }
}
// els mateixos moviments de la Pianista que a la ZonaEsglesia de la història
ZonaEsglesiaNova.prototype.pianistaToca = ZonaEsglesia.prototype.pianistaToca;
ZonaEsglesiaNova.prototype.pianistaCara = ZonaEsglesia.prototype.pianistaCara;

