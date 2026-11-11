/**
 * L'HOSTATGERIA PER DINS
 * Soterrani: un laberint de passadissos foscos (només hi veus el cercle de llum de l'Ineu, les espelmes i les escales).
 * Vestíbul: la sala d'entrada de l'Hostatgeria, on s'han de trobar les sacerdotesses.
 */

const SOT = { cel: 120, cols: 13, files: 9, oy: 120 };

class ZonaSoterraniHost extends ZonaBase {
    constructor() {
        super('ZonaSoterraniHost', {
            fosca: 'total',
            nom: "Soterrani de l'Hostatgeria",
            amplada: SOT.cols * SOT.cel,
            alcada: SOT.oy + SOT.files * SOT.cel,
            colorFons: '#0a0806',
            entrades: {
                entrada: { x: 180,  y: 1000, dir: 'amunt' },        // des de l'escala de la llosa del jardí
                escala:  { x: 1380, y: 310,  dir: 'avall' }         // des del vestíbul
            }
        });
    }

    // Laberint perfecte (DFS amb llavor fixa) i alguns murs oberts perquè hi hagi més d'un camí. 1 = mur, 0 = passadís
    laberint() {
        const C = SOT.cols, F = SOT.files, g = Array.from({ length: F }, () => Array(C).fill(1));
        let sd = 7; const r = () => (sd = sd * 16807 % 2147483647) / 2147483647;
        const pila = [[1, 7]]; g[7][1] = 0;
        while (pila.length) {
            const [x, y] = pila[pila.length - 1];
            const veins = [[2, 0], [-2, 0], [0, 2], [0, -2]].filter(([dx, dy]) => { const nx = x + dx, ny = y + dy; return nx > 0 && nx < C - 1 && ny > 0 && ny < F - 1 && g[ny][nx] === 1; });
            if (!veins.length) { pila.pop(); continue; }
            const [dx, dy] = veins[Math.floor(r() * veins.length)];
            g[y + dy / 2][x + dx / 2] = 0; g[y + dy][x + dx] = 0; pila.push([x + dx, y + dy]);
        }
        for (let k = 0; k < 9; k++) {
            const x = 2 + Math.floor(r() * (C - 4)), y = 2 + Math.floor(r() * (F - 4));
            if ((x + y) % 2 === 1 && g[y][x] === 1) g[y][x] = 0;
        }
        g[8][1] = 0; g[0][11] = 0;                  // les dues escales: la de baix (entrada) i la de dalt (cap al vestíbul)
        return g;
    }

    construir() {
        const { cel, cols, files, oy } = SOT, W = cols * cel, H = oy + files * cel;
        const g = this.laberint();
        this.terra('rajola', 0, oy, W, files * cel, -1100).setTint(0x6a5a4c);
        const murs = this.add.graphics().setDepth(-900), terra = this.add.graphics().setDepth(-1090);
        const X = cx => cx * cel, Y = cy => oy + cy * cel;
        let sd0 = 17; const rr = () => (sd0 = sd0 * 16807 % 2147483647) / 2147483647;
        // Terra: lloses humides, esquerdes, bassals i alguna pedra solta
        for (let k = 0; k < 140; k++) {
            const x = rr() * W, y = oy + rr() * files * cel;
            const t = rr();
            if (t < 0.45) terra.lineStyle(1.5, 0x241c16, 0.7).lineBetween(x, y, x + (rr() - 0.5) * 40, y + (rr() - 0.5) * 24);
            else if (t < 0.7) terra.fillStyle(0x1e2a34, 0.35).fillEllipse(x, y, 30 + rr() * 30, 10 + rr() * 8);
            else if (t < 0.9) terra.fillStyle(0x5a4c40, 1).fillCircle(x, y, 2 + rr() * 3).lineStyle(1, 0x241c16, 1).strokeCircle(x, y, 3);
            else terra.fillStyle(0x3a5a2a, 0.5).fillEllipse(x, y, 14, 7);           // molsa
        }
        const pedres = [0x5c5046, 0x54483e, 0x645648, 0x4e4238];
        for (let cy = 0; cy < files; cy++) for (let cx = 0; cx < cols; cx++) {
            if (g[cy][cx] === 0) continue;
            const x = X(cx), y = Y(cy), baix = cy + 1 < files && g[cy + 1][cx] === 0, fr = baix ? 46 : 0, hd = cel - fr;
            // Cara de dalt: carreus en filades desplaçades, amb la junta fosca i una vora de llum a dalt
            murs.fillStyle(0x1a140f, 1).fillRect(x, y, cel, hd);
            for (let f = 0; f < 3; f++) {
                const fy = y + f * hd / 3, off = (f % 2) * 20;
                for (let bx = -off; bx < cel; bx += 40) {
                    const x0 = Math.max(x, x + bx), x1 = Math.min(x + cel, x + bx + 40);
                    if (x1 - x0 < 4) continue;
                    murs.fillStyle(pedres[(cx * 7 + cy * 3 + f + bx) & 3], 1).fillRect(x0 + 1.5, fy + 1.5, x1 - x0 - 3, hd / 3 - 3);
                    murs.fillStyle(0xffffff, 0.06).fillRect(x0 + 1.5, fy + 1.5, x1 - x0 - 3, 3);
                }
            }
            const dalt = cy === 0 || g[cy - 1][cx] === 0;
            if (dalt) murs.fillStyle(0xd8c8a8, 0.18).fillRect(x, y, cel, 4);            // vora il·luminada
            if (fr) {
                // Cara frontal: dues filades de carreus foscos, l'ombra al terra i, de tant en tant, una torxa o una arrel de molsa
                murs.fillStyle(0x120c08, 1).fillRect(x, y + hd, cel, fr);
                for (let f = 0; f < 2; f++) for (let bx = -(f * 26); bx < cel; bx += 52) {
                    const x0 = Math.max(x, x + bx), x1 = Math.min(x + cel, x + bx + 52);
                    if (x1 - x0 < 4) continue;
                    murs.fillStyle(f ? 0x2a2018 : 0x342820, 1).fillRect(x0 + 1.5, y + hd + f * fr / 2 + 1.5, x1 - x0 - 3, fr / 2 - 3);
                }
                murs.fillStyle(0x000000, 0.35).fillRect(x, y + cel, cel, 12);
                if (rr() < 0.25) murs.fillStyle(0x2f4a24, 0.8).fillEllipse(x + 20 + rr() * 80, y + cel - 6, 26, 10);
            }
        }
        // Torxes a les cares dels murs (punts de llum, amb flama que balla)
        this.torxes = [];
        for (let cy = 0; cy < files - 1; cy++) for (let cx = 0; cx < cols; cx++) {
            if (g[cy][cx] !== 1 || g[cy + 1][cx] !== 0 || (cx * 5 + cy * 3) % 7 !== 0) continue;
            const x = X(cx) + cel / 2, y = Y(cy) + cel - 30;
            murs.fillStyle(0x3a2a1a, 1).fillRect(x - 3, y - 4, 6, 18).fillStyle(0x6a4a2a, 1).fillRect(x - 7, y + 10, 14, 4);
            const flama = this.add.ellipse(x, y - 10, 12, 20, 0xffb040, 1).setDepth(-880);
            this.tweens.add({ targets: flama, scaleY: 1.3, scaleX: 0.8, yoyo: true, repeat: -1, duration: 160 + cx * 10 });
            this.torxes.push({ x, y: y - 10 });
        }
        // Col·lisions: una per cada tira horitzontal de murs consecutius
        for (let cy = 0; cy < files; cy++) {
            let ini = -1;
            for (let cx = 0; cx <= cols; cx++) {
                const mur = cx < cols && g[cy][cx] === 1;
                if (mur && ini < 0) ini = cx;
                if (!mur && ini >= 0) { this.colisio(X(ini) + (cx - ini) * cel / 2, Y(cy) + cel / 2, (cx - ini) * cel, cel); ini = -1; }
            }
        }

        // Escales: la de baix (entrada) i la de dalt (cap al vestíbul de l'Hostatgeria)
        const escala = (x, y, amunt) => {
            const e = this.add.graphics().setDepth(-880);
            e.fillStyle(0x120c08, 1).fillRect(x, y, cel, cel);
            for (let i = 0; i < 6; i++) {
                const sy = y + (amunt ? i : 5 - i) * (cel / 6), c = [0x2a2218, 0x3a2e22, 0x5a4a36, 0x7a6648, 0x9a8460, 0xb8a278][amunt ? 5 - i : i];
                e.fillStyle(c, 1).fillRect(x + 8, sy, cel - 16, cel / 6 - 2);
            }
        };
        escala(X(1), Y(8), false);
        escala(X(11), Y(0), true);
        this.sortida(X(1) + 10, Y(8) + 40, cel - 20, 70, 'ZonaJardi', 'llosa');
        this.sortida(X(11) + 10, Y(0) + 10, cel - 20, 60, 'ZonaHostatgeriaInt', 'soterrani');

        // Espelmes als racons (punts de llum) i bestioles escampades pel laberint
        let sd = 91; const r = () => (sd = sd * 16807 % 2147483647) / 2147483647;
        const sales = []; for (let ry = 0; ry < 4; ry++) for (let rx = 0; rx < 6; rx++) sales.push([1 + rx * 2, 1 + ry * 2]);
        this.llums = [];
        sales.filter(([sx, sy]) => !(sx === 1 && sy === 7) && !(sx === 11 && sy === 1)).forEach(([sx, sy], i) => {
            const x = X(sx) + cel / 2, y = Y(sy) + cel / 2;
            if (i % 3 === 0) {
                const e = this.posar('espelma', x + 30, y + 20, { fonsY: y + 20 });
                this.tweens.add({ targets: e, alpha: 0.75, yoyo: true, repeat: -1, duration: 300 + i * 40 });
                this.llums.push({ x: x + 30, y: y + 10, r: 150, f: i });
                this.add.circle(x + 30, y + 6, 46, 0xff9a40, 0.12).setDepth(86000);
            } else if (i % 3 === 1) this.enemic('escolopendra', x, y);
        });
        this.llums.push({ x: X(1) + cel / 2, y: Y(8) + cel / 2, r: 170, f: 0 }, { x: X(11) + cel / 2, y: Y(0) + cel / 2, r: 170, f: 3 });
        this.torxes.forEach((t, i) => this.llums.push({ x: t.x, y: t.y + 30, r: 190, f: i * 2 }));

        // La foscor: una textura negra de tota la zona on s'esborra un cercle de llum a cada font
        if (!this.textures.exists('llum_brush')) {
            const brush = this.textures.createCanvas('llum_brush', 512, 512);
            const bc = brush.getContext(), gr = bc.createRadialGradient(256, 256, 0, 256, 256, 256);
            gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.85)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
            bc.fillStyle = gr; bc.fillRect(0, 0, 512, 512); brush.refresh();
        }
        this.foscor = this.add.renderTexture(0, 0, W, H).setOrigin(0).setDepth(85000);
        this.pinzell = this.make.image({ key: 'llum_brush', add: false }).setOrigin(0.5);
        this.cartaLaberint = g;
    }

    actualitzar(ara) {
        const f = this.foscor, p = this.pinzell, t = this.time.now;
        f.clear(); f.fill(0x000000, 0.82);
        const llum = (x, y, rad) => { p.setScale(rad / 256); f.erase(p, x, y); };
        llum(this.ineu.x, this.ineu.y - 40, Estat.te('llanterna') ? 450 : 340);
        this.llums.forEach(l => llum(l.x, l.y, l.r * (1 + 0.05 * Math.sin(t / 170 + l.f))));
    }
}

// El vestíbul de l'Hostatgeria. Tres portes duen a les cambres de les sacerdotesses; cada una té el seu bloqueig:
//   esquerra (dormitori, la Dolora): oberta, però la sacerdotessa dorm dins un capoll de boira → Cant de l'Aurora (flauta)
//   mig (refetor, la Pilària): un àngel de pedra massís barra la porta → Guants de Poder (s'empeny des d'un costat)
//   dreta (capella, la Carmèlia): esbarzers negres → Runna
// En alliberar les tres, obren la porta de l'Hostatgeria per dins (al vestíbul apareix un cofre amb l'Empara Fraternal).
// On queda l'àngel de pedra un cop empès: justament fora de la porta del mig (que s'obre a 560-640) i lluny de les altres dues (a 300 i 900)
const ESTATUA_X_ESQ = 470, ESTATUA_X_DRE = 730;
class ZonaHostatgeriaInt extends ZonaCasaBase {
    constructor() {
        super('ZonaHostatgeriaInt', {
            nom: "L'Hostatgeria",
            amplada: 1200,
            alcada: 900,
            colorFons: '#0a0806',
            entrades: {
                soterrani: { x: 200, y: 760, dir: 'amunt' },
                porta:     { x: 600, y: 780, dir: 'amunt' },
                cambra1:   { x: 300, y: 220, dir: 'avall' },
                cambra2:   { x: 600, y: 220, dir: 'avall' },
                cambra3:   { x: 900, y: 220, dir: 'avall' }
            }
        });
    }

    construir() {
        const A = 1200, H = 900, PX = [300, 600, 900];
        this.terra('rajola', 130, 80, A - 260, H - 80, -1100).setTint(0x8a7a6a);
        const murs = this.add.graphics().setDepth(-1000);
        murs.fillStyle(0x2a1f18, 1).fillRect(90, 0, 40, H).fillRect(A - 130, 0, 40, H);
        // Paret del fons: pedra a dalt, sòcol de fusta a baix, finestres d'arc amb llum de lluna entre les portes i tapissos
        murs.fillStyle(0x5a4a3a, 1).fillRect(130, 0, A - 260, 120);
        for (let f = 0; f < 3; f++) for (let x = 130 + (f % 2) * 30; x < A - 130; x += 60) murs.fillStyle([0x655342, 0x5e4c3c, 0x6a5846][(x / 60 + f) % 3 | 0], 1).fillRect(x + 1, f * 26 + 1, 58, 24);
        murs.fillStyle(0x4a2e1a, 1).fillRect(130, 78, A - 260, 42);
        murs.lineStyle(2, 0x2a1a0c, 1).lineBetween(130, 78, A - 130, 78);
        for (let x = 150; x < A - 130; x += 40) murs.lineStyle(1, 0x2a1a0c, 0.8).lineBetween(x, 84, x, 116);
        [450, 750].forEach(x => {
            murs.fillStyle(0x2a2238, 1).fillRect(x - 22, 10, 44, 58).fillCircle(x, 10, 22);
            murs.fillStyle(0x7a9ac8, 0.55).fillRect(x - 17, 12, 34, 54).fillCircle(x, 12, 17);
            murs.lineStyle(3, 0x3a2a1a, 1).lineBetween(x, -10, x, 66).lineBetween(x - 17, 36, x + 17, 36);
        });
        [190, 1010].forEach(x => {                                  // tapissos vermells
            murs.fillStyle(0x7a1f2a, 1).fillRect(x - 24, 6, 48, 70).lineStyle(2, 0xd4af37, 1).strokeRect(x - 20, 10, 40, 62);
            murs.fillStyle(0xd4af37, 1).fillTriangle(x - 10, 30, x + 10, 30, x, 52);
        });
        // Catifa: de la porta de l'Hostatgeria (a baix, al mig) fins al centre, i una franja de porta a porta
        const cat = this.add.graphics().setDepth(-1050);
        cat.fillStyle(0x6a1f24, 1).fillRect(540, 300, 120, 590).fillRect(260, 230, 680, 90);
        cat.lineStyle(4, 0xc8a050, 1).strokeRect(548, 308, 104, 590).strokeRect(268, 238, 664, 74);
        // Aplics a la paret del fons, entre les portes i les finestres
        [375, 515, 685, 825].forEach((x, i) => this.aplic(x, 66, i, -990));
        // Bancs contra les parets laterals
        this.posar('banc_respatller', 200, 560, { col: { w: 140, h: 16 } });
        this.posar('banc_respatller', 1000, 300, { col: { w: 140, h: 16 } });
        this.colisio(50, H / 2, 80, H);
        this.colisio(A - 50, H / 2, 80, H);
        // Paret del fons, amb un forat de 90 a cada porta
        [[130, 255], [345, 555], [645, 855], [945, 1070]].forEach(([a, b]) => this.colisio((a + b) / 2, 85, b - a, 170));
        // Paret de baix: forat de l'escala del soterrani (140-260, al racó) i de la porta de l'Hostatgeria (540-660)
        [[0, 140], [260, 540], [660, A]].forEach(([a, b]) => this.colisio((a + b) / 2, H - 10, b - a, 20));

        // Portes del fons: d'arc, amb dos batents que s'obren cap endins quan l'Ineu s'hi acosta (com les altres portes del joc). Les bloquegen
        // la taula del refetor i els esbarzers de la capella: mentre hi són, la porta no s'obre.
        const blocs = [null, () => !Estat.flag('refetorObert'), () => (this.esbarzers || []).some(o => o.viu)];
        const fustes = [[0x6a4328, 0x7a5233], [0x5a3a20, 0x6a4628], [0x4e3030, 0x5e3c3c]];
        PX.forEach((x, i) => {
            this.portaAnimada({ x, top: 22, bottom: 124, ample: 84, arc: true, fons: -987, color: fustes[i][0], panell: fustes[i][1], vora: 0x1a0e06, ferro: true, bloq: blocs[i] });
            this.marcPorta(x);
            this.colisio(x, 50, 90, 100);                                        // dintell sobre cada porta
            this.sortida(x - 34, 110, 68, 30, ['ZonaCambraDolora', 'ZonaCambraPilaria', 'ZonaCambraCarmelia'][i], 'porta');
        });
        this.decorarVestibul(A, H);

        // Bloqueig del refetor (porta del mig): un àngel de pedra massís. Amb els Guants de Poder s'empeny des de qualsevol dels dos costats i es desplaça
        // just el necessari per deixar la porta lliure (sense arribar a les altres dues). Un cop empès, es queda al costat on l'han deixat.
        this.estatua = null; this.colEstatua = []; this.empentaMs = 0; this.pistaEstatua = 0;
        if (!Estat.flag('refetorObert')) {
            this.estatua = this.crearEstatua(600, 250);
            // Un cos sota els peus i un tros de paret al darrere: ni es pot vorejar per darrere ni passar entre l'àngel i la porta
            this.colEstatua = [this.colisio(600, 236, 100, 40), this.colisio(600, 192, 150, 36)];
            this.interactiu(600, 262, 130, DIALEGS.taulaRefetor, { altura: 200, senseMirada: true, actiu: () => !Estat.flag('refetorObert') });
        } else {
            const e = this.crearEstatua(Estat.flag('estatuaEsquerra') ? ESTATUA_X_ESQ : ESTATUA_X_DRE, 250);       // ja empès: es queda al costat
            this.colisio(e.x, 236, 100, 40);
        }
        // Bloqueig de la capella (porta de la dreta): dues mates d'esbarzers negres, i un mur invisible al darrere perquè no es pugui vorejar
        this.esbarzer(880, 215, 'host_cap1'); this.esbarzer(924, 215, 'host_cap2');
        this.colCapella = this.colisio(902, 190, 190, 50);

        // Escala que baixa al soterrani, arraconada a baix a l'esquerra, entre la paret i una barana de fusta:
        // els graons s'enfosqueixen cap a baix i no hi arriba la catifa
        const e = this.add.graphics().setDepth(-980);
        e.fillStyle(0x0a0604, 1).fillRect(140, 806, 120, 94);
        for (let i = 0; i < 6; i++) {
            const c = [0x6a5a44, 0x54463a, 0x40342a, 0x2e241c, 0x1e1812, 0x120c08][i];
            e.fillStyle(c, 1).fillRect(146, 812 + i * 14, 108, 14);
            e.lineStyle(1, 0x0a0604, 0.8).lineBetween(146, 826 + i * 14, 254, 826 + i * 14);
        }
        e.fillStyle(0x000000, 0.35).fillRect(140, 806, 120, 94);
        const barana = this.add.graphics().setDepth(900);                                   // barana del costat de la sala
        barana.fillStyle(0x2a1a0c, 1).fillRect(262, 760, 9, 140);
        barana.fillStyle(0x5a3a1e, 1).fillRect(258, 752, 17, 10).fillRect(263, 762, 4, 138);
        for (let y = 776; y < 900; y += 20) barana.fillStyle(0x3a2412, 1).fillRect(259, y, 15, 4);
        this.colisio(266, 830, 14, 140);
        this.sortida(150, 870, 100, 30, 'ZonaSoterraniHost', 'escala');
        // Porta de l'Hostatgeria, a baix al mig: tancada fins que les sacerdotesses l'obren
        this.porta(600, 884, 120, 30, 0x4a2c16);
        this.sortida(540, 872, 120, 28, 'ZonaJardi', 'hostatgeria');

        // Una taula d'infusions, de decoració; i, un cop les tres sacerdotesses són lliures, el cofre del seu premi sobre la catifa
        this.posar('taula', 1040, 560, { escala: 0.9, col: { w: 100, h: 24 } });
        if (Estat.flag('mongesTrobades')) {
            const cofreM = this.posar(Estat.flag('cofreMonges') ? 'cofre_obert' : 'cofre', 600, 520, { col: { w: 50, h: 20 } });
            this.interactiu(600, 525, RADI_OBJECTE, DIALEGS.cofreMonges, { altura: 70, enTancar: () => { if (Estat.flag('cofreMonges')) cofreM.setTexture('cofre_obert'); } });
        }
        this.boira(600, 450, 900, 260, 1.2);
        this.add.rectangle(A / 2, H / 2, A, H, 0x2a1a45, 0.1).setDepth(80000);
    }

    // Marc de pedra d'una porta d'arc: muntants, arc amb dovella central i una petita llinda de fusta
    marcPorta(x) {
        const g = this.add.graphics().setDepth(-984);
        const traç = (amp, color, alfa = 1) => {
            g.lineStyle(amp, color, alfa).beginPath().moveTo(x - 47, 128).lineTo(x - 47, 62);
            g.arc(x, 62, 47, Math.PI, Math.PI * 2, false);
            g.lineTo(x + 47, 128).strokePath();
        };
        traç(15, 0x1c120a);                  // vora fosca
        traç(11, 0x84735e);                  // pedra
        traç(3, 0xa8977c, 0.7);              // llum a la cara
        g.fillStyle(0x6a5a48, 1).fillRoundedRect(x - 8, 6, 16, 18, 3).lineStyle(2, 0x1c120a, 1).strokeRoundedRect(x - 8, 6, 16, 18, 3);       // dovella
        g.fillStyle(0x6a5a48, 1).fillRect(x - 56, 120, 18, 10).fillRect(x + 38, 120, 18, 10).lineStyle(1.5, 0x1c120a, 1).strokeRect(x - 56, 120, 18, 10).strokeRect(x + 38, 120, 18, 10);   // sòcols
        g.fillStyle(0x000000, 0.28).fillRect(x - 42, 124, 84, 6);                                // ombra del llindar
    }

    // Peces de decoració del vestíbul: paviment amb escacat i vora, catifa amb dibuixos i serrells, canelobres de peu, test de plantes i raigs de llum
    decorarVestibul(A, H) {
        // Paviment: escacat suau i una vora fosca vora les parets
        const pav = this.add.graphics().setDepth(-1060);
        for (let j = 0; j < 13; j++) for (let i = 0; i < 17; i++) if ((i + j) % 2) pav.fillStyle(0x000000, 0.1).fillRect(140 + i * 60, 170 + j * 60, 60, 60);
        pav.fillStyle(0x000000, 0.18).fillRect(130, 120, 14, H - 120).fillRect(A - 144, 120, 14, H - 120);
        pav.lineStyle(2, 0x3a2a1a, 0.5).lineBetween(144, 130, 144, H).lineBetween(A - 144, 130, A - 144, H);
        // Catifa: dibuix de rombes daurats, medalló al mig i serrells als caps
        const cat = this.add.graphics().setDepth(-1049);
        for (let y = 360; y < 880; y += 56) cat.fillStyle(0xc8a050, 0.55).fillTriangle(600, y, 584, y + 28, 616, y + 28).fillTriangle(600, y + 56, 584, y + 28, 616, y + 28);
        for (let x = 300; x < 900; x += 56) if (Math.abs(x - 600) > 60) cat.fillStyle(0xc8a050, 0.55).fillTriangle(x, 258, x - 14, 275, x + 14, 275).fillTriangle(x, 292, x - 14, 275, x + 14, 275);
        cat.fillStyle(0x3e1216, 1).fillCircle(600, 275, 36).lineStyle(3, 0xc8a050, 1).strokeCircle(600, 275, 36).strokeCircle(600, 275, 26);
        cat.fillStyle(0xc8a050, 1).fillCircle(600, 275, 7);
        cat.lineStyle(2, 0xc8a050, 0.9);
        for (let y = 236; y < 320; y += 6) { cat.lineBetween(256, y, 262, y); cat.lineBetween(938, y, 944, y); }
        for (let x = 544; x < 658; x += 6) cat.lineBetween(x, 886, x, 892);
        // Raigs de llum de lluna de les finestres
        [450, 750].forEach(x => {
            const l = this.add.graphics().setDepth(-1045).setBlendMode(Phaser.BlendModes.ADD);
            l.fillStyle(0x9ab8ff, 0.07).fillPoints([{ x: x - 22, y: 124 }, { x: x + 22, y: 124 }, { x: x + 92, y: 340 }, { x: x - 38, y: 340 }], true);
            l.fillStyle(0x9ab8ff, 0.05).fillEllipse(x + 26, 350, 130, 36);
        });
        // Canelobres de peu al llarg de la catifa
        [[510, 400], [690, 400], [510, 650], [690, 650]].forEach(([x, y], i) => this.canelobre(x, y, i));
        // Testos amb plantes als racons
        [[170, 205], [1030, 205], [1040, 790]].forEach(([x, y]) => this.testPlanta(x, y));
        // Motllura a la part alta de la paret i un crucifix de fusta entre els aplics
        const mot = this.add.graphics().setDepth(-989);
        mot.fillStyle(0x3a2412, 1).fillRect(130, 74, A - 260, 5).fillStyle(0xc8a050, 0.45).fillRect(130, 74, A - 260, 1.5);
        mot.fillStyle(0x4a2e1a, 1).fillRect(596, 28, 8, 40).fillRect(584, 38, 32, 8).lineStyle(1.5, 0x120c08, 1).strokeRect(596, 28, 8, 40).strokeRect(584, 38, 32, 8);
    }

    canelobre(x, y, i) {
        this.colisio(x, y + 8, 22, 12);
        const g = this.add.graphics().setDepth(y + 12);
        g.fillStyle(0x000000, 0.28).fillEllipse(x, y + 16, 34, 10);
        g.fillStyle(0x2a2420, 1).fillEllipse(x, y + 12, 26, 8).fillRect(x - 3, y - 36, 6, 48).fillEllipse(x, y - 36, 22, 6);
        g.lineStyle(2.5, 0x2a2420, 1).beginPath().arc(x - 9, y - 36, 9, Math.PI * 0.5, Math.PI, false).strokePath().beginPath().arc(x + 9, y - 36, 9, 0, Math.PI * 0.5, false).strokePath();
        [-9, 0, 9].forEach(dx => g.fillStyle(0xeee2c4, 1).fillRect(x + dx - 2, y - 52 - (dx === 0 ? 8 : 0), 4, 16 + (dx === 0 ? 8 : 0)));
        const llum = this.add.circle(x, y - 54, 52, 0xffc060, 0.1).setDepth(y + 13).setBlendMode(Phaser.BlendModes.ADD);
        this.tweens.add({ targets: llum, alpha: 0.18, scale: 1.1, yoyo: true, repeat: -1, duration: 600 + i * 130 });
        [-9, 0, 9].forEach((dx, k) => {
            const f = this.add.ellipse(x + dx, y - 58 - (dx === 0 ? 8 : 0), 5, 10, 0xffc860, 1).setDepth(y + 14);
            this.tweens.add({ targets: f, scaleY: 0.78, alpha: 0.8, yoyo: true, repeat: -1, duration: 260 + k * 70 + i * 40 });
        });
    }

    testPlanta(x, y) {
        this.colisio(x, y + 8, 40, 16);
        const g = this.add.graphics().setDepth(y + 14);
        g.fillStyle(0x000000, 0.25).fillEllipse(x, y + 20, 56, 12);
        g.fillStyle(0x9a5a38, 1).fillPoints([{ x: x - 22, y: y - 6 }, { x: x + 22, y: y - 6 }, { x: x + 15, y: y + 22 }, { x: x - 15, y: y + 22 }], true);
        g.lineStyle(2, 0x3a1a0c, 1).strokePoints([{ x: x - 22, y: y - 6 }, { x: x + 22, y: y - 6 }, { x: x + 15, y: y + 22 }, { x: x - 15, y: y + 22 }], true);
        g.fillStyle(0xb87048, 1).fillRect(x - 24, y - 10, 48, 8).lineStyle(2, 0x3a1a0c, 1).strokeRect(x - 24, y - 10, 48, 8);
        for (let k = -3; k <= 3; k++) {                                                                  // fulles que surten del test, en ventall
            const a = -Math.PI / 2 + k * 0.38, l = 40 + (3 - Math.abs(k)) * 7;
            g.lineStyle(7, k % 2 ? 0x3e7a42 : 0x4e9050, 1).lineBetween(x, y - 8, x + Math.cos(a) * l, y - 8 + Math.sin(a) * l);
        }
    }

    // L'àngel de pedra: una escultura de 100 px d'ample amb peanya, ales plegades, caputxa i mans juntes. (x, y) són els peus.
    crearEstatua(x, y) {
        const c = this.add.container(x, y).setDepth(y);
        const g = this.add.graphics();
        const PEDRA = 0x9a9484, MITJA = 0x7c7668, FOSCA = 0x5a5448, VORA = 0x24201a;
        g.fillStyle(0x000000, 0.3).fillEllipse(0, 6, 128, 20);
        // ales plegades al darrere
        [-1, 1].forEach(sg => {
            const ala = [{ x: sg * 12, y: -124 }, { x: sg * 54, y: -170 }, { x: sg * 66, y: -122 }, { x: sg * 52, y: -82 }, { x: sg * 28, y: -50 }];
            g.fillStyle(MITJA, 1).fillPoints(ala, true).lineStyle(2, VORA, 1).strokePoints(ala, true);
            g.lineStyle(1.5, FOSCA, 0.9);
            for (let k = 1; k <= 4; k++) g.lineBetween(sg * 14, -122 + k * 12, sg * (50 + k * 4), -150 + k * 16);
        });
        // túnica: plecs i cara d'ombra a la dreta
        const roba = [{ x: -30, y: -44 }, { x: -21, y: -122 }, { x: 21, y: -122 }, { x: 30, y: -44 }];
        g.fillStyle(PEDRA, 1).fillPoints(roba, true);
        g.fillStyle(MITJA, 1).fillPoints([{ x: 4, y: -122 }, { x: 21, y: -122 }, { x: 30, y: -44 }, { x: 10, y: -44 }], true);
        g.lineStyle(2, VORA, 1).strokePoints(roba, true);
        g.lineStyle(1.5, FOSCA, 0.85);
        [-14, -4, 8, 18].forEach(fx => g.lineBetween(fx * 0.7, -112, fx * 1.35, -46));
        g.fillStyle(FOSCA, 1).fillRect(-30, -62, 60, 4).fillRect(-4, -62, 8, 22);                    // cinta i cordó
        // mans joves en pregària
        g.fillStyle(PEDRA, 1).fillPoints([{ x: -9, y: -98 }, { x: 0, y: -116 }, { x: 9, y: -98 }, { x: 5, y: -86 }, { x: -5, y: -86 }], true).lineStyle(1.5, VORA, 1).strokePoints([{ x: -9, y: -98 }, { x: 0, y: -116 }, { x: 9, y: -98 }, { x: 5, y: -86 }, { x: -5, y: -86 }], true);
        // cap amb caputxa i aurèola de pedra
        g.fillStyle(PEDRA, 1).fillCircle(0, -136, 17).lineStyle(2, VORA, 1).strokeCircle(0, -136, 17);
        g.fillStyle(MITJA, 1).fillPoints([{ x: -19, y: -126 }, { x: -17, y: -148 }, { x: 0, y: -158 }, { x: 17, y: -148 }, { x: 19, y: -126 }, { x: 10, y: -134 }, { x: -10, y: -134 }], true);
        g.lineStyle(2, VORA, 1).strokePoints([{ x: -19, y: -126 }, { x: -17, y: -148 }, { x: 0, y: -158 }, { x: 17, y: -148 }, { x: 19, y: -126 }], false);
        g.fillStyle(FOSCA, 0.7).fillEllipse(-5, -132, 4, 3).fillEllipse(5, -132, 4, 3).fillRect(-2, -128, 4, 5);                    // ulls i nas gairebé esborrats
        g.lineStyle(3, 0xb8b09c, 0.8).strokeEllipse(0, -164, 42, 12);
        // peanya de dos graons
        g.fillStyle(MITJA, 1).fillRect(-54, -18, 108, 20).lineStyle(2, VORA, 1).strokeRect(-54, -18, 108, 20);
        g.fillStyle(PEDRA, 1).fillRect(-46, -42, 92, 26).lineStyle(2, VORA, 1).strokeRect(-46, -42, 92, 26);
        g.fillStyle(0xb4ac98, 1).fillRect(-50, -48, 100, 8).lineStyle(2, VORA, 1).strokeRect(-50, -48, 100, 8);
        g.lineStyle(1.5, FOSCA, 0.9).lineBetween(-20, -40, -14, -28).lineBetween(-14, -28, -22, -18).lineBetween(24, -16, 30, -4);       // esquerdes
        // molsa
        g.fillStyle(0x5a7a4a, 0.7).fillEllipse(-36, -6, 22, 8).fillEllipse(30, -30, 14, 6).fillEllipse(-8, -118, 10, 5);
        c.add(g);
        return c;
    }

    // L'Ineu empeny l'àngel si és a un costat, a prop, i avança contra ell (no cal cap punt exacte: qualsevol lloc del seu lateral serveix)
    actualitzar(ara, delta) {
        if (this.colCapella && this.esbarzers.every(o => !o.viu)) { this.obstacles.remove(this.colCapella, true, true); this.colCapella = null; }
        const E = this.estatua;
        if (!E || Estat.flag('refetorObert')) return;
        const ui = this.ui(), c = this.cursors, t = this.tecles, I = this.ineu;
        const dx = I.x - E.x, vora = Math.abs(dx) > 40 && Math.abs(dx) < 100 && Math.abs(I.y - 236) < 56;       // al costat (a l'alçada de la peanya)
        // Generós amb la direcció (com a les pedres mòbils): compta cap a on VOL anar el jugador, n'hi ha prou amb ~30% cap a l'àngel (també en diagonal i amb el
        // joystick) i mentre s'empeny no es llisca pels costats; si el dit tremola un instant, no es perd tot el que s'havia recolzat
        const I2 = this.intent || { x: 0, y: 0 };
        const empeny = vora && I2.x * (dx < 0 ? 1 : -1) > 0.3;                                                // vol anar cap a l'àngel
        if (empeny) I.body.setVelocityY(0);
        this.empentaMs = empeny ? this.empentaMs + delta : Math.max(0, this.empentaMs - delta * 2);
        E.x = 600 + (empeny && Estat.te('guants') ? Math.sin(ara / 45) * 1.6 : 0);                              // tremola quan s'hi fa força
        if (this.empentaMs < 450) return;
        this.empentaMs = 0;
        if (!Estat.te('guants')) {
            if (ara > this.pistaEstatua) { this.pistaEstatua = ara + 7000; this.ineuDiu("L'àngel de pedra no es belluga ni un pèl. Pesa massa: calen unes mans més fortes."); }
            return;
        }
        this.empenyEstatua(dx < 0 ? 1 : -1);
    }

    empenyEstatua(dir = 1) {
        const E = this.estatua;
        if (Estat.flag('refetorObert') || !E) return;
        Estat.posaFlag('refetorObert');
        if (dir < 0) Estat.posaFlag('estatuaEsquerra');
        this.colEstatua.forEach(z => this.obstacles.remove(z, true, true));
        this.colEstatua = [];
        Sfx.secret();
        this.cameras.main.shake(400, 0.003);
        const fi = dir < 0 ? ESTATUA_X_ESQ : ESTATUA_X_DRE;
        const pols = this.boira(E.x, 240, 110, 20, 3, 0xcfc4b0);
        this.tweens.add({ targets: E, x: fi, duration: 1700, ease: 'Sine.easeInOut', onComplete: () => {
            this.colisio(fi, 236, 100, 40);                                  // un cop al seu lloc, torna a fer de mur
            pols.stop(); this.time.delayedCall(1200, () => pols.destroy());
            this.estatua = null;
            Estat.desar();
        } });
        this.tweens.add({ targets: pols, x: fi, duration: 1700, ease: 'Sine.easeInOut' });
    }
}

// ---------------- LES TRES CAMBRES DE LES SACERDOTESSES ----------------
class CambraMonja extends ZonaCasaBase {
    constructor(clau, nomCambra, monja) {
        super(clau, { nom: nomCambra, amplada: 800, alcada: 620, colorFons: '#0a0806', entrades: { porta: { x: 400, y: 540, dir: 'amunt' } } });
        this.monja = monja;
    }

    construir() {
        const A = 800, H = 620, m = this.monja;
        this.sala(A, H, 400, m === 'dolora' ? 0x7a6a5e : m === 'carmelia' ? 0x8a7a6e : 0x8a7260);
        this.sortida(350, H - 22, 100, 14, 'ZonaHostatgeriaInt', { dolora: 'cambra1', pilaria: 'cambra2', carmelia: 'cambra3' }[m]);
        // Paret del fons: arrebossat amb taques de calç, un sòcol de fusta i dos aplics
        const paret = this.add.graphics().setDepth(-995);
        // La paret arriba fins a la cornisa (molt per sobre de la finestra): així la finestra hi és sencera i la paret no queda tallada
        const TOP = -150;
        paret.fillStyle(m === 'carmelia' ? 0x5a4a40 : 0x6a5646, 1).fillRect(130, TOP, A - 260, 90 - TOP);
        let sd = m.length * 7; const r = () => (sd = sd * 16807 % 2147483647) / 2147483647;
        for (let k = 0; k < 22; k++) paret.fillStyle(0xffffff, 0.04 + r() * 0.05).fillEllipse(150 + r() * 500, TOP + 20 + r() * (70 - TOP), 30 + r() * 50, 10 + r() * 14);
        paret.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.35, 0.35, 0, 0).fillRect(130, TOP, A - 260, 60);          // la part de dalt, a l'ombra
        paret.fillStyle(0x3a2412, 1).fillRect(122, TOP - 6, A - 244, 22).fillStyle(0x5a3a1e, 1).fillRect(122, TOP + 12, A - 244, 5);      // cornisa de fusta
        paret.fillStyle(0xffd9a0, 0.14).fillRect(122, TOP - 6, A - 244, 3);
        paret.fillStyle(0x2a1f18, 1).fillRect(90, TOP - 6, 40, -TOP + 6).fillRect(A - 130, TOP - 6, 40, -TOP + 6);        // els murs laterals pugen amb la paret
        paret.fillStyle(0x4a2e1a, 1).fillRect(130, 64, A - 260, 26);
        paret.fillStyle(0xffd9a0, 0.18).fillRect(130, 64, A - 260, 3);
        for (let x = 150; x < A - 130; x += 36) paret.lineStyle(1, 0x2a1a0c, 0.7).lineBetween(x, 68, x, 88);
        this.aplic(240, 50, 0, -990); this.aplic(560, 50, 1, -990);
        // Finestra d'arc amb llum de lluna (a la capella, un rosetó de colors)
        const fin = this.add.graphics().setDepth(-993);
        if (m === 'carmelia') {
            fin.fillStyle(0x2a1a0c, 1).fillCircle(400, 30, 26);
            [0xc84a3a, 0x3a6ac8, 0xe8c050, 0x4a9a5a, 0xa04ac0, 0x3a6ac8, 0xe8c050, 0x4a9a5a].forEach((c, i) => {
                fin.fillStyle(c, 0.9).slice(400, 30, 22, i * Math.PI / 4, (i + 1) * Math.PI / 4).fillPath();
            });
            fin.fillStyle(0xfff0c0, 1).fillCircle(400, 30, 6).lineStyle(2, 0x2a1a0c, 1).strokeCircle(400, 30, 22);
            this.add.ellipse(400, 250, 220, 90, 0xffe0a0, 0.08).setDepth(-1080);                       // claror del rosetó a terra
        } else {
            fin.fillStyle(0x2a1a0c, 1).fillRect(374, 6, 52, 52).fillCircle(400, 8, 26);
            fin.fillStyle(0x7a9ac8, 0.6).fillRect(379, 10, 42, 46).fillCircle(400, 10, 21);
            fin.lineStyle(3, 0x3a2a1a, 1).lineBetween(400, -10, 400, 56).lineBetween(379, 32, 421, 32);
            fin.fillStyle(0x4a2e1a, 1).fillRect(368, 56, 64, 6);
        }

        if (m !== 'carmelia') {                                           // raig de llum de lluna de la finestra
            const raig = this.add.graphics().setDepth(-1045).setBlendMode(Phaser.BlendModes.ADD);
            raig.fillStyle(0x9ab8ff, 0.07).fillPoints([{ x: 380, y: 92 }, { x: 420, y: 92 }, { x: 500, y: 330 }, { x: 330, y: 330 }], true);
            raig.fillStyle(0x9ab8ff, 0.05).fillEllipse(415, 340, 190, 40);
        }
        if (m === 'dolora') {                                           // dormitori: tres llits (un per germana) estrets amb capçal, coixí i flassada
            const llits = this.add.graphics().setDepth(-950);
            const flassades = [0x5a6a8e, 0x6a8a5a, 0xa0784a, 0x9a5a6a];
            const capcal = { tl: 10, tr: 10, bl: 0, br: 0 };
            [[200, 260], [420, 260], [620, 260]].forEach(([x, y], i) => {
                llits.fillStyle(0x000000, 0.25).fillRect(x - 38, y + 106, 84, 10);
                llits.fillStyle(0x4a2e18, 1).fillRoundedRect(x - 44, y - 34, 88, 26, capcal).lineStyle(2, 0x120c08, 1).strokeRoundedRect(x - 44, y - 34, 88, 26, capcal);
                llits.fillStyle(0x6a4424, 1).fillRect(x - 36, y - 28, 72, 4);
                llits.fillStyle(0x5a3a22, 1).fillRect(x - 40, y - 10, 80, 122).lineStyle(2, 0x120c08, 1).strokeRect(x - 40, y - 10, 80, 122);
                llits.fillStyle(0xe8dcc4, 1).fillRoundedRect(x - 32, y - 6, 64, 24, 8).lineStyle(1.5, 0x8a7a64, 1).strokeRoundedRect(x - 32, y - 6, 64, 24, 8);
                llits.fillStyle(0xf4ecd8, 1).fillRect(x - 36, y + 22, 72, 12);                                   // llençol girat
                llits.fillStyle(flassades[i], 1).fillRect(x - 36, y + 32, 72, 76);
                llits.lineStyle(1.5, 0xffffff, 0.25);
                for (let k = 1; k < 4; k++) llits.lineBetween(x - 36, y + 32 + k * 19, x + 36, y + 32 + k * 19).lineBetween(x - 36 + k * 18, y + 32, x - 36 + k * 18, y + 108);
                llits.lineStyle(2, 0x120c08, 1).strokeRect(x - 36, y + 22, 72, 86);
            });
            [[310, 250], [520, 250]].forEach(([x, y]) => {                                         // tauletes de nit amb un llibre i un càntir
                this.colisio(x, y + 8, 40, 20);
                const t = this.add.graphics().setDepth(y + 20);
                t.fillStyle(0x000000, 0.25).fillEllipse(x, y + 20, 46, 10);
                t.fillStyle(0x4a2e18, 1).fillRect(x - 20, y - 26, 40, 46).lineStyle(2, 0x120c08, 1).strokeRect(x - 20, y - 26, 40, 46);
                t.fillStyle(0x6a4424, 1).fillRect(x - 22, y - 30, 44, 8).strokeRect(x - 22, y - 30, 44, 8);
                t.fillStyle(0xcfb36a, 1).fillCircle(x, y - 4, 2.5);
                t.fillStyle(0x7a2a2a, 1).fillRect(x - 15, y - 38, 16, 8).strokeRect(x - 15, y - 38, 16, 8);
                t.fillStyle(0xb8a07a, 1).fillEllipse(x + 10, y - 38, 12, 18).strokeEllipse(x + 10, y - 38, 12, 18);
            });
            const cat = this.add.graphics().setDepth(-1050);                                     // estora entre els llits
            cat.fillStyle(0x8a6a3a, 1).fillRoundedRect(430, 410, 180, 120, 10).lineStyle(3, 0x5a3a1a, 1).strokeRoundedRect(438, 418, 164, 104, 8);
            this.colisio(200, 330, 80, 130); this.colisio(420, 330, 80, 130); this.colisio(620, 330, 80, 130);
            this.dolora = this.npc('dolora', 520, 470, DIALEGS.dolora, { zoomConversa: 1.2 });
            this.capoll = this.crearCapoll(this.dolora);
            this.dolora.setTint(0xd6c8ff);                                          // atrapada: es veu a través de la seda lila
            this.boiraCapoll = this.boira(this.capoll.x, this.capoll.y, this.capoll.rx * 1.4, this.capoll.ry * 1.2, 1.4);
            this.llocFlauta('dolora', 520, 480, 300, false, () => !Estat.flag('lliureDolora'));
            if (Estat.flag('lliureDolora')) this.alliberada(true);
        } else if (m === 'pilaria') {                                    // refetor: taula llarga, aparador amb plats, faristol i rastells d'alls
            this.posar('taula_sopar', 400, 330, { col: { w: 360, h: 40 } });
            [[260, 380], [540, 380], [260, 280], [540, 280]].forEach(([x, y]) => this.posar('tamboret', x, y, { col: { w: 28, h: 12 } }));
            this.posar('barril', 130 + 40, 200, { col: { w: 40, h: 18 } });
            const ap = this.add.graphics().setDepth(180);                                       // aparador contra la paret del fons, a la dreta
            ap.fillStyle(0x000000, 0.25).fillEllipse(620, 180, 100, 14);
            ap.fillStyle(0x4a2e18, 1).fillRect(578, 40, 84, 140).lineStyle(2, 0x120c08, 1).strokeRect(578, 40, 84, 140);
            ap.fillStyle(0x2a1a0c, 1).fillRect(584, 46, 72, 70);
            [66, 92].forEach(y => {
                ap.fillStyle(0x6a4424, 1).fillRect(584, y + 18, 72, 4);
                for (let k = 0; k < 4; k++) ap.fillStyle(0xe8e0cc, 1).fillCircle(594 + k * 17, y + 8, 7.5).lineStyle(1.5, 0x3a6a9a, 1).strokeCircle(594 + k * 17, y + 8, 5);
            });
            ap.fillStyle(0x5a3a22, 1).fillRect(584, 124, 34, 50).fillRect(622, 124, 34, 50).lineStyle(1.5, 0x120c08, 1).strokeRect(584, 124, 34, 50).strokeRect(622, 124, 34, 50);
            ap.fillStyle(0xcfb36a, 1).fillCircle(612, 150, 2.5).fillCircle(628, 150, 2.5);
            this.colisio(620, 168, 90, 24);
            const fa = this.add.graphics().setDepth(470);                                       // faristol amb el llibre de les lectures
            fa.fillStyle(0x000000, 0.25).fillEllipse(200, 470, 50, 10);
            fa.fillStyle(0x4a2e18, 1).fillRect(196, 410, 8, 60).fillRect(184, 466, 32, 6);
            fa.fillStyle(0x5a3a22, 1).fillPoints([{ x: 172, y: 404 }, { x: 228, y: 404 }, { x: 222, y: 386 }, { x: 178, y: 386 }], true);
            fa.fillStyle(0xf4ecd8, 1).fillRect(180, 388, 19, 14).fillRect(201, 388, 19, 14);
            fa.lineStyle(1, 0x8a7a64, 1).lineBetween(183, 392, 196, 392).lineBetween(183, 396, 196, 396).lineBetween(204, 392, 217, 392).lineBetween(204, 396, 217, 396);
            this.colisio(200, 464, 36, 14);
            const alls = this.add.graphics().setDepth(-990);                                     // rastells d'alls i un pernil a la paret
            [160, 300].forEach(x => {
                alls.lineStyle(2, 0xc9b48a, 1).lineBetween(x, 6, x, 54);
                for (let k = 0; k < 6; k++) alls.fillStyle(0xf0e8d8, 1).fillCircle(x + (k % 2 ? 5 : -5), 14 + k * 7, 5).lineStyle(1, 0x8a7a64, 1).strokeCircle(x + (k % 2 ? 5 : -5), 14 + k * 7, 5);
            });
            alls.fillStyle(0xa0503a, 1).fillEllipse(480, 36, 26, 44).lineStyle(2, 0x3a1a0c, 1).strokeEllipse(480, 36, 26, 44).lineBetween(480, 0, 480, 14);
            this.npc('pilaria', 400, 272, DIALEGS.pilaria, { radi: 190, zoomConversa: 1.2 });          // al seu lloc, darrere la taula del refetor (hi parles per sobre de la taula)
        } else {                                                       // capella: rosetó, altar, catifa fins a l'altar, bancs i dues fornícules
            const cat = this.add.graphics().setDepth(-1050);
            cat.fillStyle(0x6a1f24, 1).fillRect(360, 270, 80, 340);
            cat.lineStyle(3, 0xc8a050, 1).strokeRect(366, 276, 68, 334);
            this.posar('altar', 400, 240, { col: { w: 140, h: 36 } });
            this.posar('banc_esglesia', 270, 400, { escala: 0.8, col: { w: 110, h: 16 } });
            this.posar('banc_esglesia', 530, 400, { escala: 0.8, col: { w: 110, h: 16 } });
            const ni = this.add.graphics().setDepth(-990);                                       // fornícules amb la Mare de Déu i un sant
            [[170, 0x3a5a9a], [630, 0x8a3a3a]].forEach(([x, mant]) => {
                ni.fillStyle(0x2a1a0c, 1).fillRect(x - 18, 4, 36, 56).fillCircle(x, 6, 18);
                ni.fillStyle(0x4a3a30, 1).fillRect(x - 14, 8, 28, 50).fillCircle(x, 8, 14);
                ni.fillStyle(mant, 1).fillTriangle(x, 12, x - 10, 56, x + 10, 56);
                ni.fillStyle(0xf4ecd8, 1).fillCircle(x, 16, 4.5);
                ni.lineStyle(1.5, 0xe8c050, 0.9).strokeCircle(x, 15, 7.5);
            });
            this.npc('carmelia', 400, 340, DIALEGS.carmelia, { zoomConversa: 1.2 });
        }
        this.add.rectangle(A / 2, H / 2, A, H, 0x2a1a45, 0.08).setDepth(80100);
    }

    // El capoll de seda de boira: un ou llarg que embolcalla la sacerdotessa sencera (des dels peus fins al cap), amb meridians de fils, anells i
    // fils que l'ancoren a terra. Es mida amb el dibuix de la monja; es veu a través i batega suaument.
    crearCapoll(nun) {
        const h = nun.displayHeight, w = nun.displayWidth;
        const rx = Math.max(w * 0.72, 84), ry = h * 0.62;
        const c = this.add.container(nun.x, nun.y - h * 0.5).setDepth(nun.depth + 1);
        c.rx = rx; c.ry = ry;
        const g = this.add.graphics();
        // resplendor lila al voltant
        g.fillStyle(0xb890ff, 0.1).fillEllipse(0, 0, rx * 2.6, ry * 2.3).fillStyle(0xb890ff, 0.12).fillEllipse(0, 0, rx * 2.2, ry * 2.1);
        // fils que l'ancoren a terra i al sostre
        g.lineStyle(2, 0xe8dcff, 0.55);
        [-1, 1].forEach(s => { [0.55, 0.8].forEach(f => g.lineBetween(s * rx * 0.85, ry * 0.4, s * rx * (1 + f * 0.8), ry * 1.02)); g.lineBetween(s * rx * 0.3, -ry * 0.95, s * rx * 0.6, -ry * 1.22); });
        // cos del capoll: capes de seda translúcida
        g.fillStyle(0x8a68e0, 0.34).fillEllipse(0, 0, rx * 2, ry * 2);
        g.fillStyle(0xb89cff, 0.2).fillEllipse(0, ry * 0.08, rx * 1.7, ry * 1.8);
        g.fillStyle(0xffffff, 0.14).fillEllipse(-rx * 0.34, -ry * 0.36, rx * 0.7, ry * 0.7);                        // brillantor
        // meridians de fil: de pol a pol, passant per l'equador
        for (let k = -5; k <= 5; k++) {
            const f = k / 5, pts = [];
            for (let t = 0; t <= 24; t++) { const a = t / 24 * Math.PI; pts.push({ x: rx * f * Math.sin(a) * 0.98, y: -Math.cos(a) * ry * 0.98 }); }
            g.lineStyle(k % 2 ? 1.2 : 1.9, 0xf0e6ff, k % 2 ? 0.4 : 0.6).strokePoints(pts, false);
        }
        // anells de fils que s'hi enrotllen
        [-0.62, -0.32, 0, 0.32, 0.62].forEach(l => {
            const pts = [], ex = Math.sqrt(1 - l * l);
            for (let u = -20; u <= 20; u++) { const x = u / 20; pts.push({ x: x * rx * ex, y: l * ry + 0.09 * ry * (1 - x * x) }); }
            g.lineStyle(1.3, 0xe0d2ff, 0.5).strokePoints(pts, false);
        });
        g.lineStyle(3, 0x5a3aa0, 0.85).strokeEllipse(0, 0, rx * 2, ry * 2);
        g.lineStyle(1.5, 0xffffff, 0.35).strokeEllipse(0, 0, rx * 1.92, ry * 1.92);
        // flocs de seda que sobresurten dalt i baix
        [[0, -ry], [0, ry]].forEach(([x, y]) => { g.fillStyle(0xe8dcff, 0.8).fillEllipse(x, y, 26, 14); g.fillStyle(0x5a3aa0, 0.8).fillEllipse(x, y, 10, 6); });
        c.add(g);
        // fils solts que se separen una mica i es belluguen
        const fils = this.add.graphics();
        fils.lineStyle(1.5, 0xf4ecff, 0.6);
        for (let k = 0; k < 7; k++) {
            const a = -Math.PI * 0.9 + k * 0.5, r0 = 1.0;
            const pts = [];
            for (let t = 0; t <= 10; t++) pts.push({ x: Math.cos(a) * rx * (r0 + t * 0.018) + Math.sin(t * 0.9 + k) * 4, y: Math.sin(a) * ry * (r0 + t * 0.02) });
            fils.strokePoints(pts, false);
        }
        c.add(fils);
        this.tweens.add({ targets: c, alpha: { from: 1, to: 0.8 }, scaleX: { from: 1, to: 1.025 }, scaleY: { from: 1, to: 1.035 }, yoyo: true, repeat: -1, duration: 1500, ease: 'Sine.easeInOut' });
        this.tweens.add({ targets: fils, angle: { from: -1.2, to: 1.2 }, yoyo: true, repeat: -1, duration: 2200, ease: 'Sine.easeInOut' });
        return c;
    }

    teEfecteMelodia(nom) {
        return this.monja === 'dolora' && nom === 'aurora' && !Estat.flag('lliureDolora') && Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, 520, 460) <= 320;
    }

    // Cant de l'Aurora davant el capoll: la boira s'esvaeix i la Dolora es desperta
    enMelodia(nom) {
        if (this.monja !== 'dolora' || nom !== 'aurora') return false;
        if (Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, 520, 460) > 320) return false;
        if (Estat.flag('lliureDolora')) { this.ineuDiu('La Dolora ja és desperta.'); return true; }
        Estat.posaFlag('lliureDolora');
        this.alliberada(false);
        Sfx.secret();
        this.cameras.main.shake(300, 0.003);
        Estat.desar();
        this.time.delayedCall(1900, () => { if (!Estat.flag('premiDolora')) this.ui().obrirDialeg(DIALEGS.dolora(Estat)); });   // la Dolora es desperta i parla
        return true;
    }

    alliberada(directe) {
        if (this.boiraCapoll) this.boiraCapoll.stop();
        if (this.dolora) this.dolora.clearTint();
        if (directe) { this.tweens.killTweensOf(this.capoll); this.capoll.destroy(); return; }
        this.tweens.killTweensOf(this.capoll);
        this.tweens.add({ targets: this.capoll, alpha: 0, scaleX: 1.5, scaleY: 1.7, duration: 1800, ease: 'Sine.easeOut', onComplete: () => this.capoll.destroy() });
    }
}

class ZonaCambraDolora extends CambraMonja { constructor() { super('ZonaCambraDolora', 'Dormitori de les sacerdotesses', 'dolora'); } }
class ZonaCambraPilaria extends CambraMonja { constructor() { super('ZonaCambraPilaria', 'Refetor de les sacerdotesses', 'pilaria'); } }
class ZonaCambraCarmelia extends CambraMonja { constructor() { super('ZonaCambraCarmelia', "Capella de l'Hostatgeria", 'carmelia'); } }
