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
        f.clear(); f.fill(0x000000, 0.96);
        const llum = (x, y, rad) => { p.setScale(rad / 256); f.erase(p, x, y); };
        llum(this.ineu.x, this.ineu.y - 40, Estat.te('llanterna') ? 340 : 240);
        this.llums.forEach(l => llum(l.x, l.y, l.r * (1 + 0.05 * Math.sin(t / 170 + l.f))));
    }
}

// El vestíbul de l'Hostatgeria. Tres portes duen a les cambres de les sacerdotesses; cada una té el seu bloqueig:
//   esquerra (dormitori, la Pains): oberta, però la sacerdotessa dorm dins un capoll de boira → Cant de l'Aurora (flauta)
//   mig (refetor, la Phili): una taula pesadíssima barra la porta → Guants de Poder
//   dreta (capella, la Charm): esbarzers negres → Runna
// En alliberar les tres, obren la porta de l'Hostatgeria per dins (el vestíbul esdevé un lloc de repòs).
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

        // Portes del fons: l'obertura s'omple amb la porta de fusta; la de les cambres és la sortida
        PX.forEach((x, i) => {
            this.porta(x, 78, 90, 120, i === 0 ? 0x4a2c16 : 0x3a2412);
            this.sortida(x - 40, 120, 80, 40, ['ZonaCambraPains', 'ZonaCambraPhili', 'ZonaCambraCharm'][i], 'porta');
        });

        // Bloqueig del refetor (porta del mig): una taula enorme de roure; amb els Guants de Poder s'empeny cap al costat
        this.taulaPorta = null;
        if (!Estat.flag('refetorObert')) {
            this.taulaPorta = this.posar('taula', 600, 232, { escala: 1.5, col: { w: 150, h: 36 } });
            this.colTaula = this.obstacles.getChildren()[this.obstacles.getChildren().length - 1];
            this.obstacles.remove(this.colTaula);          // el bloqueig de la taula té el seu propi col·lisionador, que avisa quan l'Ineu hi empeny
            // Entre la taula i la paret no s'hi pot passar: només es pot obrir la porta empenyent la taula des d'un costat
            this.colDarrereTaula = this.colisio(600, 182, 200, 30);
            this.empentaMs = 0; this.contacteTaula = 0; this.costatTaula = 1; this.pistaTaula = false;
        }
        // Bloqueig de la capella (porta de la dreta): dues mates d'esbarzers negres, i un mur invisible al darrere perquè no es pugui vorejar
        this.esbarzer(880, 215, 'host_cap1'); this.esbarzer(924, 215, 'host_cap2');
        this.colCapella = this.colisio(902, 190, 190, 50);
        this.interactiu(900, 255, RADI_OBJECTE, DIALEGS.esbarzersCapella, { altura: 90, actiu: () => this.esbarzers.some(o => o.viu) });

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

        // Una taula d'infusions: lloc de repòs un cop les sacerdotesses són lliures
        this.posar('taula', 1040, 560, { escala: 0.9, col: { w: 100, h: 24 } });
        this.interactiu(1040, 590, RADI_OBJECTE, () => this.descans(), { altura: 90, actiu: () => Estat.flag('mongesTrobades') });
        this.boira(600, 450, 900, 260, 1.2);
        this.add.rectangle(A / 2, H / 2, A, H, 0x2a1a45, 0.1).setDepth(80000);
    }

    enEntrar() {
        if (this.taulaPorta) this.colliderTaula = this.physics.add.collider(this.ineu, this.colTaula, (ineu, t) => { this.contacteTaula = this.time.now; this.costatTaula = ineu.x < t.x ? 1 : -1; });
    }

    // L'Ineu empeny la taula si és a un costat i avança contra ella; amb els Guants de Poder es mou
    actualitzar(ara, delta) {
        if (this.colCapella && this.esbarzers.every(o => !o.viu)) { this.obstacles.remove(this.colCapella, true, true); this.colCapella = null; }
        if (!this.taulaPorta || Estat.flag('refetorObert')) return;
        const ui = this.ui(), c = this.cursors, t = this.tecles;
        const dirX = (c.right.isDown || t.D.isDown ? 1 : 0) - (c.left.isDown || t.A.isDown ? 1 : 0) || Math.sign(ui.vectorTactil.x > 0.3 ? 1 : ui.vectorTactil.x < -0.3 ? -1 : 0);
        const toca = this.time.now - this.contacteTaula < 120 && Math.abs(this.ineu.x - this.taulaPorta.x) > 70 && dirX === this.costatTaula;
        this.empentaMs = toca ? this.empentaMs + delta : 0;
        if (this.empentaMs < 600) return;
        this.empentaMs = 0;
        if (!Estat.te('guants')) {
            if (!this.pistaTaula) { this.pistaTaula = true; this.missatge('Una taula de roure massissa barra la porta del mig. Des de l\'altra banda, una veu fina i enrabiada colpeja la fusta. Pesa massa: calen unes mans més fortes.'); }
            return;
        }
        this.empenyTaula(this.costatTaula);
    }

    empenyTaula(dir = 1) {
        if (Estat.flag('refetorObert') || !this.taulaPorta) return;
        Estat.posaFlag('refetorObert');
        if (this.colliderTaula) this.colliderTaula.destroy();
        this.colTaula.destroy();
        if (this.colDarrereTaula) { this.obstacles.remove(this.colDarrereTaula, true, true); this.colDarrereTaula = null; }
        Sfx.secret();
        this.cameras.main.shake(300, 0.003);
        this.tweens.add({ targets: this.taulaPorta, x: this.taulaPorta.x + dir * 200, duration: 1400, ease: 'Sine.easeInOut', onComplete: () => Estat.desar() });
    }

    descans() {
        return {
            pagines: [{ qui: 'Charm', text: 'Seu, fill, que et prepararem una infusió de farigola. Aquí dins no entra la boira.' }],
            enAcabar: () => {
                Estat.dades.vida = Estat.dades.corsMax * 2;
                this.ui().actualitzarHUD(); this.guardarPosicio(); Estat.desar();
            }
        };
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
        this.sala(A, H, 400, m === 'pains' ? 0x7a6a5e : m === 'charm' ? 0x8a7a6e : 0x8a7260);
        this.sortida(350, H - 22, 100, 14, 'ZonaHostatgeriaInt', { pains: 'cambra1', phili: 'cambra2', charm: 'cambra3' }[m]);
        // Paret del fons: arrebossat amb taques de calç, un sòcol de fusta i dos aplics
        const paret = this.add.graphics().setDepth(-995);
        paret.fillStyle(m === 'charm' ? 0x5a4a40 : 0x6a5646, 1).fillRect(130, 0, A - 260, 90);
        let sd = m.length * 7; const r = () => (sd = sd * 16807 % 2147483647) / 2147483647;
        for (let k = 0; k < 14; k++) paret.fillStyle(0xffffff, 0.04 + r() * 0.05).fillEllipse(150 + r() * 500, 8 + r() * 50, 30 + r() * 50, 10 + r() * 14);
        paret.fillStyle(0x4a2e1a, 1).fillRect(130, 64, A - 260, 26);
        paret.fillStyle(0xffd9a0, 0.18).fillRect(130, 64, A - 260, 3);
        for (let x = 150; x < A - 130; x += 36) paret.lineStyle(1, 0x2a1a0c, 0.7).lineBetween(x, 68, x, 88);
        this.aplic(240, 50, 0, -990); this.aplic(560, 50, 1, -990);
        // Finestra d'arc amb llum de lluna (a la capella, un rosetó de colors)
        const fin = this.add.graphics().setDepth(-993);
        if (m === 'charm') {
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

        if (m === 'pains') {                                           // dormitori: quatre llits estrets amb capçal, coixí i flassada
            const llits = this.add.graphics().setDepth(-950);
            const flassades = [0x5a6a8e, 0x6a8a5a, 0xa0784a, 0x9a5a6a];
            const capcal = { tl: 10, tr: 10, bl: 0, br: 0 };
            [[200, 260], [420, 260], [620, 260], [200, 430]].forEach(([x, y], i) => {
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
            this.colisio(200, 330, 80, 130); this.colisio(420, 330, 80, 130); this.colisio(620, 330, 80, 130); this.colisio(200, 500, 80, 130);
            this.pains = this.npc('monja_pains', 520, 470, DIALEGS.monjaPains);
            this.capoll = this.add.ellipse(520, 420, 130, 150, 0xa070ff, 0.5).setDepth(9000).setStrokeStyle(3, 0x6a40b0, 0.8);
            this.tweens.add({ targets: this.capoll, alpha: 0.28, scaleX: 1.08, scaleY: 1.06, yoyo: true, repeat: -1, duration: 1300, ease: 'Sine.easeInOut' });
            this.boiraCapoll = this.boira(520, 430, 120, 110, 1.4);
            this.llocFlauta('pains', 520, 480, 300, false, () => !Estat.flag('lliurePains'));
            if (Estat.flag('lliurePains')) this.alliberada(true);
        } else if (m === 'phili') {                                    // refetor: taula llarga, aparador amb plats, faristol i rastells d'alls
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
            this.npc('monja_phili', 400, 470, DIALEGS.monjaPhili);
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
            this.npc('monja_charm', 400, 340, DIALEGS.monjaCharm);
        }
        this.add.rectangle(A / 2, H / 2, A, H, 0x2a1a45, 0.08).setDepth(80100);
    }

    // Cant de l'Aurora davant el capoll: la boira s'esvaeix i la Pains es desperta
    enMelodia(nom) {
        if (this.monja !== 'pains' || nom !== 'aurora') return false;
        if (Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, 520, 460) > 320) return false;
        if (Estat.flag('lliurePains')) { this.missatge('La Pains ja és desperta.'); return true; }
        Estat.posaFlag('lliurePains');
        this.alliberada(false);
        Sfx.secret();
        this.cameras.main.shake(300, 0.003);
        Estat.desar();
        this.time.delayedCall(1900, () => { if (!Estat.flag('premiPains')) this.ui().obrirDialeg(DIALEGS.monjaPains(Estat)); });   // la Pains es desperta i parla
        return true;
    }

    alliberada(directe) {
        if (this.boiraCapoll) this.boiraCapoll.stop();
        if (directe) { this.capoll.destroy(); return; }
        this.tweens.add({ targets: this.capoll, alpha: 0, scale: 1.7, duration: 1800, onComplete: () => this.capoll.destroy() });
    }
}

class ZonaCambraPains extends CambraMonja { constructor() { super('ZonaCambraPains', 'Dormitori de les sacerdotesses', 'pains'); } }
class ZonaCambraPhili extends CambraMonja { constructor() { super('ZonaCambraPhili', 'Refetor de les sacerdotesses', 'phili'); } }
class ZonaCambraCharm extends CambraMonja { constructor() { super('ZonaCambraCharm', "Capella de l'Hostatgeria", 'charm'); } }
