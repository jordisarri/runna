/**
 * DECORACIÓ DE LA SALA DE LA GÀBIA (la zona és a js/zones/gabia.js). Tot dibuixat amb codi:
 *   - la paret del fons amb un ocell gegant gravat i gàbies petites que pengen del sostre, amb ocells morts de son a dins;
 *   - l'avenc (resplendor lila del fons, arrels i cristalls a la vora) i la plataforma (lloses de la vora, el cercle del ritual
 *     al voltant de la gàbia, plomes negres, gàbies trencades, canelobres i les joguines que hi van deixar els nens);
 *   - l'entrada: la paret de baix amb la porta, les escales amb catifa i baranes, dos brasers i dos corbs de pedra;
 *   - les columnes tallades, amb torxes;
 *   - la gàbia gran: pedestal, barrots de ferro amb reflex, anelles d'or amb reblons, cúpula amb nervis, un ocell d'or al capdamunt,
 *     la cadena fins al sostre, la porta amb el cadenat d'or i la llum dels capolls a dins.
 */
Object.assign(ZonaGabia.prototype, {
    // Un halo de llum de vores suaus (degradat radial), que se suma a la llum de sota
    halo(x, y, w, h, color, alfa, prof = 90001) {
        if (!this.textures.exists('halo_suau')) {
            const t = this.textures.createCanvas('halo_suau', 256, 256), c = t.getContext(), g = c.createRadialGradient(128, 128, 0, 128, 128, 128);
            g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.4, 'rgba(255,255,255,0.55)'); g.addColorStop(1, 'rgba(255,255,255,0)');
            c.fillStyle = g; c.fillRect(0, 0, 256, 256); t.refresh();
        }
        return this.add.image(x, y, 'halo_suau').setDisplaySize(w, h).setTint(color).setAlpha(alfa).setBlendMode('ADD').setDepth(prof);
    },
    // Passa uns dibuixos fixos (Graphics) a una sola imatge: els Graphics es tornen a calcular a cada fotograma, una imatge no
    fixar(grafics, x, y, w, h, prof) {
        const rt = this.add.renderTexture(x, y, Math.ceil(w), Math.ceil(h)).setOrigin(0).setDepth(prof !== undefined ? prof : grafics[0].depth);
        grafics.forEach(g => { rt.draw(g, -x, -y); g.destroy(); });
        return rt;
    },
    // Un foc (torxa, braser): flames d'espurnes i un halo càlid que tremola (per sobre del vel fosc de la sala)
    focSala(x, y, mida = 1, prof = y) {
        const p = this.add.particles(x, y, 'espurna', {
            speedY: { min: -80 * mida, max: -30 * mida }, speedX: { min: -14, max: 14 }, lifespan: 520, scale: { start: 0.45 * mida, end: 0 },
            alpha: { start: 0.95, end: 0 }, tint: [0xff5020, 0xff9a30, 0xffe060], blendMode: 'ADD', frequency: 55
        }).setDepth(prof + 1);
        const h = this.halo(x, y + 14 * mida, 340 * mida, 220 * mida, 0xff9a40, 0.32);
        this.tweens.add({ targets: h, alpha: 0.2, yoyo: true, repeat: -1, duration: 150 + Math.random() * 120 });
        return { p, h };
    },
    // Flameta d'espelma (sense partícules): una gota groga i un halo petit que tremola
    flamaEspelma(g, x, y) {
        g.fillStyle(0xffd060, 1).fillEllipse(x, y - 5, 7, 12).fillStyle(0xffffff, 0.9).fillEllipse(x, y - 4, 3, 5);
        const h = this.halo(x, y - 6, 60, 60, 0xffc070, 0.4);
        this.tweens.add({ targets: h, alpha: 0.22, yoyo: true, repeat: -1, duration: 120 + Math.random() * 140 });
    },
    // Una gàbia petita d'ocell (penjada o a terra), amb un ocellet adormit si cal
    gabieta(g, x, y, w, h, ocell, trencada) {
        g.fillStyle(0x000000, 0.25).fillEllipse(x, y + 3, w + 8, w * 0.3);
        g.fillStyle(0x2a2030, 1).fillEllipse(x, y, w + 4, w * 0.28);
        if (ocell) {
            g.fillStyle(0x2a3a6a, 1).fillEllipse(x, y - h * 0.28, w * 0.36, w * 0.24).fillCircle(x + w * 0.12, y - h * 0.38, w * 0.1);
            g.fillStyle(0xd8a040, 1).fillTriangle(x + w * 0.2, y - h * 0.4, x + w * 0.3, y - h * 0.37, x + w * 0.2, y - h * 0.34);
        }
        g.lineStyle(2, 0x6a5a40, 1);
        const n = 7;
        for (let k = 0; k <= n; k++) {
            if (trencada && (k === 2 || k === 3)) continue;                   // dos barrots arrencats
            const t = k / n, bx = x - w / 2 + t * w, d = Math.sqrt(Math.max(0, (w / 2) ** 2 - (bx - x) ** 2));
            g.lineBetween(bx, y - Math.sin(t * Math.PI) * 3, bx, y - h + w / 2 - d * 0.9);
        }
        g.beginPath(); g.arc(x, y - h + w / 2, w / 2, Math.PI, 0); g.strokePath();
        g.lineStyle(2, 0x8a7a50, 1).strokeEllipse(x, y - h * 0.5, w, w * 0.22).strokeCircle(x, y - h - 4, 4);
        if (trencada) { g.lineStyle(2, 0x6a5a40, 1).lineBetween(x - w * 0.2, y - h * 0.2, x - w * 0.55, y - h * 0.05); }
    },
    // Una ploma negra a terra
    ploma(g, x, y, a, mida = 1) {
        const c = Math.cos(a), s = Math.sin(a), L = 16 * mida;
        g.fillStyle(0x15101c, 0.9);
        const pts = [];
        for (let k = 0; k <= 10; k++) { const t = k / 10 * Math.PI * 2, rx = Math.cos(t) * L, ry = Math.sin(t) * L * 0.28; pts.push({ x: x + rx * c - ry * s, y: y + (rx * s + ry * c) * 0.6 }); }
        g.fillPoints(pts, true);
        g.lineStyle(1, 0x6a4a9a, 0.8).lineBetween(x - c * L * 1.2, y - s * L * 0.72, x + c * L, y + s * L * 0.6);
    },

    decorarSala() {
        const W = 1800, H = 1640, G = GABIA;
        const x0 = G.x - G.platW / 2, x1 = G.x + G.platW / 2, y0 = G.y - G.platH / 2, y1 = G.y + G.platH / 2, A = G.avenc;
        const gx = this.gx, base = this.base;
        let ll = 31; const rr = () => (ll = ll * 16807 % 2147483647) / 2147483647;

        // ---- La paret del fons (sota el sostre, darrere l'avenc) ----
        const pw = this.add.graphics().setDepth(-1075);
        pw.fillStyle(0x201828, 1).fillRect(0, 100, W, 200);
        for (let fila = 0, y = 118; y < 300; fila++, y += 34) {
            for (let x = (fila % 2) * -50; x < W; ) {
                const bw = 70 + Math.floor(rr() * 50);
                pw.fillStyle(rr() < 0.5 ? 0x2c2238 : 0x261e30, 1).fillRoundedRect(x + 2, y + 2, bw - 4, 30, 4);
                pw.lineStyle(2, 0x120c18, 0.9).strokeRoundedRect(x + 2, y + 2, bw - 4, 30, 4);
                pw.lineStyle(1, 0x3a3048, 0.6).lineBetween(x + 6, y + 5, x + bw - 8, y + 5);
                x += bw;
            }
        }
        // L'ocell gravat a la pedra, amb les ales obertes (darrere la gàbia)
        const oc = this.add.graphics().setDepth(-1074);
        const ox = gx, oy = 205;
        [-1, 1].forEach(sd => {
            oc.lineStyle(4, 0x8a60b8, 0.45);
            for (let k = 0; k < 7; k++) {
                const a = (-0.95 + k * 0.17), L = 140 + k * 36;
                oc.lineBetween(ox + sd * 26, oy + 6, ox + sd * Math.cos(a) * L, oy + Math.sin(a) * L * 0.55 + 10);
            }
            oc.lineStyle(3, 0x8a60b8, 0.35);
            oc.beginPath(); oc.moveTo(ox + sd * 26, oy - 10);
            for (let k = 0; k < 7; k++) { const a = (-0.95 + k * 0.17), L = 140 + k * 36; oc.lineTo(ox + sd * Math.cos(a) * L, oy + Math.sin(a) * L * 0.55 + 10); }
            oc.strokePath();
        });
        oc.lineStyle(4, 0x8a60b8, 0.5).strokeEllipse(ox, oy + 20, 54, 90).strokeCircle(ox, oy - 40, 22);
        oc.fillStyle(0x8a60b8, 0.45).fillTriangle(ox - 7, oy - 36, ox + 7, oy - 36, ox, oy - 14);
        [-1, 1].forEach(sd => oc.lineBetween(ox + sd * 10, oy + 62, ox + sd * 30, oy + 84));
        [-9, 9].forEach(dx => { const u = this.add.circle(ox + dx, oy - 44, 4, 0xd8a8ff, 0.8).setBlendMode('ADD').setDepth(90001); this.tweens.add({ targets: u, alpha: 0.3, yoyo: true, repeat: -1, duration: 900 }); });
        // Una franja de runes a peu de paret
        oc.lineStyle(2, 0xb89a50, 0.35);
        for (let x = 40; x < W - 40; x += 46) {
            const k = Math.floor(rr() * 4), y = 288;
            if (k === 0) oc.lineBetween(x, y - 10, x, y + 4).lineBetween(x - 6, y - 4, x + 6, y - 4);
            else if (k === 1) oc.strokeCircle(x, y - 3, 6).lineBetween(x, y - 9, x, y + 5);
            else if (k === 2) { oc.lineBetween(x - 6, y + 4, x, y - 10); oc.lineBetween(x, y - 10, x + 6, y + 4); oc.lineBetween(x - 4, y - 2, x + 4, y - 2); }
            else { oc.lineBetween(x - 6, y - 8, x + 6, y + 4); oc.lineBetween(x + 6, y - 8, x - 6, y + 4); }
        }
        // Gàbies petites penjades del sostre, amb els ocells que l'Ocellaire havia robat
        const gp = this.add.graphics().setDepth(-1070);
        [[260, 228, 1], [430, 196, 0], [580, 240, 1], [1220, 236, 1], [1370, 192, 1], [1540, 226, 0]].forEach(([x, y, ocell], i) => {
            gp.lineStyle(2, 0x3a3048, 1).lineBetween(x, 100, x, y - 64);
            this.gabieta(gp, x, y, 30 + (i % 2) * 8, 56 + (i % 3) * 6, !!ocell);
        });
        this.fixar([pw, oc, gp], 0, 96, W, 210, -1074);
        // Les parets dels costats, de roca
        const pc = this.add.graphics().setDepth(-995);
        [[0, 1], [W, -1]].forEach(([vx, sd]) => {
            const pts = [{ x: vx, y: 100 }];
            for (let y = 100; y <= H; y += 60) pts.push({ x: vx + sd * (58 + rr() * 22), y });
            pts.push({ x: vx, y: H });
            pc.fillStyle(0x1e1826, 1).fillPoints(pts, true);
            pc.lineStyle(4, 0x3a3048, 1).strokePoints(pts.slice(1, -1), false);
        });
        this.colisio(190, 210, 260, 180);
        this.colisio(1610, 210, 260, 180);
        // Estalactites amb dos tons, més llargues i desiguals
        const st = this.add.graphics().setDepth(-985);
        for (let k = 0; k < 26; k++) {
            const x = 30 + k * 69 + rr() * 30, l = 40 + rr() * 80, a = 14 + rr() * 16;
            st.fillStyle(0x2e2438, 1).fillTriangle(x - a, 112, x + a, 112, x, 112 + l);
            st.fillStyle(0x45385a, 1).fillTriangle(x - a * 0.4, 112, x, 112, x - 2, 112 + l * 0.8);
        }
        this.fixar([st], 0, 100, W, 140);

        // ---- L'avenc ----
        const av = this.add.graphics().setDepth(-1058).setBlendMode('ADD');
        [[44, 0.07], [24, 0.09], [10, 0.12]].forEach(([gr, al]) => av.lineStyle(gr, 0x7a3acf, al).strokeRoundedRect(x0 - A / 2, y0 - A / 2, G.platW + A, G.platH + A, 50));
        const ar = this.add.graphics().setDepth(-1056);
        for (let k = 0; k < 9; k++) {                                       // arrels que pengen de la vora de dalt
            const x = x0 - A + 60 + k * ((G.platW + 2 * A - 120) / 8), y = y0 - A + 6;
            ar.lineStyle(3, 0x4a3426, 0.9).beginPath(); ar.moveTo(x, y);
            for (let s = 1; s <= 5; s++) ar.lineTo(x + Math.sin(s * 1.3 + k) * 10, y + s * 16);
            ar.strokePath();
        }
        // Cristalls lila a la vora de l'avenc
        [[x0 - A + 30, y0 - 40], [x1 + A - 30, y0 + 60], [x0 - A + 40, y1 + 20], [x1 + A - 40, y1 - 80], [x0 + 120, y1 + A - 30], [x1 - 140, y1 + A - 34],
         [x0 + 180, y0 - A + 30], [x1 - 200, y0 - A + 28]].forEach(([x, y]) => {
            const cr = this.add.graphics().setDepth(y);
            [[-10, 0, 10, 34], [4, 2, 12, 46], [16, 4, 8, 26]].forEach(([dx, dy, w, h]) => {
                cr.fillStyle(0x9a6ad8, 1).fillTriangle(x + dx - w / 2, y + dy, x + dx + w / 2, y + dy, x + dx, y + dy - h);
                cr.fillStyle(0xe0c8ff, 0.9).fillTriangle(x + dx - w / 4, y + dy, x + dx, y + dy, x + dx, y + dy - h * 0.9);
                cr.lineStyle(1.5, 0x2a1840, 1).strokeTriangle(x + dx - w / 2, y + dy, x + dx + w / 2, y + dy, x + dx, y + dy - h);
            });
            const h = this.halo(x + 4, y - 20, 120, 100, 0xb88aff, 0.4);
            this.tweens.add({ targets: h, alpha: 0.18, yoyo: true, repeat: -1, duration: 1200 + rr() * 800 });
        });

        // ---- La plataforma ----
        const pv = this.add.graphics().setDepth(-1049);
        // Lloses de la vora
        for (let x = x0 + 30; x < x1 - 40; x += 64) [y0 + 8, y1 - 26].forEach(y => { pv.fillStyle(0x423a52, 1).fillRoundedRect(x, y, 58, 18, 4); pv.lineStyle(2, 0x1a1424, 1).strokeRoundedRect(x, y, 58, 18, 4); });
        for (let y = y0 + 40; y < y1 - 50; y += 64) [x0 + 8, x1 - 26].forEach(x => { pv.fillStyle(0x423a52, 1).fillRoundedRect(x, y, 18, 58, 4); pv.lineStyle(2, 0x1a1424, 1).strokeRoundedRect(x, y, 18, 58, 4); });
        // El cercle del ritual al voltant de la gàbia: dues anelles d'or amb runes i radis
        pv.lineStyle(3, 0xb89a50, 0.45).strokeEllipse(gx, base + 6, 640, 196).strokeEllipse(gx, base + 6, 540, 160);
        for (let k = 0; k < 24; k++) {
            const a = k / 24 * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
            pv.lineStyle(2, 0xb89a50, 0.4).lineBetween(gx + c * 270, base + 6 + s * 80, gx + c * 320, base + 6 + s * 98);
            if (k % 3 === 0) pv.fillStyle(0xb89a50, 0.4).fillCircle(gx + c * 295, base + 6 + s * 89, 4);
        }
        // Plomes negres per terra
        for (let k = 0; k < 34; k++) {
            const x = x0 + 50 + rr() * (G.platW - 100), y = y0 + 40 + rr() * (G.platH - 80);
            if (Math.abs(x - gx) < 200 && Math.abs(y - base) < 70) continue;
            this.ploma(pv, x, y, rr() * Math.PI * 2, 0.7 + rr() * 0.6);
        }
        // Les joguines dels nens: una baldufa i la pilota del Germà Andreu
        pv.fillStyle(0x000000, 0.25).fillEllipse(x0 + 128, y1 - 66, 30, 9);
        pv.fillStyle(0xc0402a, 1).fillTriangle(x0 + 114, y1 - 86, x0 + 142, y1 - 86, x0 + 128, y1 - 66);
        pv.fillStyle(0xe8c050, 1).fillEllipse(x0 + 128, y1 - 87, 30, 9);
        pv.lineStyle(2, 0x1a0c08, 1).strokeTriangle(x0 + 114, y1 - 86, x0 + 142, y1 - 86, x0 + 128, y1 - 66).strokeEllipse(x0 + 128, y1 - 87, 30, 9);
        pv.fillStyle(0x000000, 0.25).fillEllipse(x1 - 150, y1 - 70, 30, 9);
        pv.fillStyle(0xf2efe6, 1).fillCircle(x1 - 150, y1 - 82, 13).lineStyle(2, 0x1a0c08, 1).strokeCircle(x1 - 150, y1 - 82, 13);
        pv.fillStyle(0x1a1a1a, 1).fillCircle(x1 - 150, y1 - 82, 4).fillCircle(x1 - 159, y1 - 88, 3).fillCircle(x1 - 142, y1 - 90, 3).fillCircle(x1 - 156, y1 - 73, 3).fillCircle(x1 - 141, y1 - 75, 3);
        // Gàbies petites trencades i rovellades
        [[x0 + 90, y0 + 120, 0], [x1 - 110, y1 - 150, 1], [x0 + 210, y1 - 60, 0]].forEach(([x, y, oc]) => this.gabieta(this.add.graphics().setDepth(y), x, y, 28, 46, false, true));
        // Canelobres de ferro amb tres espelmes, al voltant de la gàbia
        [[gx - 330, base + 20], [gx + 360, base + 10], [gx - 250, base + 250], [gx + 250, base + 250]].forEach(([x, y]) => {
            const c = this.add.graphics().setDepth(y);
            c.fillStyle(0x000000, 0.3).fillEllipse(x, y + 2, 40, 12);
            c.fillStyle(0x2a2030, 1).fillTriangle(x - 16, y, x + 16, y, x, y - 14).fillRect(x - 3, y - 74, 6, 66);
            c.lineStyle(4, 0x2a2030, 1).lineBetween(x - 26, y - 70, x + 26, y - 70);
            c.lineStyle(2, 0xb89a50, 0.8).lineBetween(x - 26, y - 72, x + 26, y - 72);
            [-24, 0, 24].forEach(dx => {
                const top = y - 84 - (dx === 0 ? 10 : 0);
                c.fillStyle(0xe8dcc0, 1).fillRect(x + dx - 4, top, 8, (y - 70) - top);
                c.lineStyle(1.5, 0x5a4a30, 1).strokeRect(x + dx - 4, top, 8, (y - 70) - top);
                this.flamaEspelma(c, x + dx, top);
            });
        });

        this.fixar([pv], x0, y0, G.platW, G.platH);
        // ---- L'entrada: escales, catifa, baranes, brasers i corbs de pedra ----
        const eY0 = 1236, eY1 = 1606, ex0 = 776, ex1 = 1024;
        const es = this.add.graphics().setDepth(-1045);
        es.fillStyle(0x000000, 0.35).fillRect(ex0 - 8, eY0 - 8, ex1 - ex0 + 16, eY1 - eY0 + 16);
        for (let y = eY0, k = 0; y < eY1; y += 30, k++) {
            es.fillStyle(k % 2 ? 0x3e3650 : 0x433a56, 1).fillRect(ex0, y, ex1 - ex0, 22);
            es.fillStyle(0x221c2c, 1).fillRect(ex0, y + 22, ex1 - ex0, 8);
            es.lineStyle(2, 0x5e5476, 0.8).lineBetween(ex0, y + 1, ex1, y + 1);
            if (rr() < 0.6) { const cx = ex0 + 20 + rr() * (ex1 - ex0 - 40); es.lineStyle(1.5, 0x1a1424, 0.8).lineBetween(cx, y + 3, cx + 10 + rr() * 16, y + 14 + rr() * 6); }
        }
        // Catifa vella, de color de vi, amb vores d'or (gastada al mig)
        es.fillStyle(0x5a1828, 1).fillRect(858, eY0 - 4, 84, eY1 - eY0 + 4);
        es.lineStyle(3, 0xb89a50, 0.85).lineBetween(862, eY0 - 4, 862, eY1).lineBetween(938, eY0 - 4, 938, eY1);
        for (let y = eY0 + 22; y < eY1; y += 30) es.fillStyle(0x3a0c18, 0.8).fillRect(858, y, 84, 8);
        es.fillStyle(0x7a2a3a, 0.5).fillEllipse(900, eY0 + 160, 40, 90);
        this.fixar([es], ex0 - 10, eY0 - 10, ex1 - ex0 + 20, eY1 - eY0 + 20);
        // Baranes de pedra a banda i banda
        [ex0 - 22, ex1 + 22].forEach(bx => {
            const b = this.add.graphics().setDepth(eY1 + 4);
            b.fillStyle(0x2a2434, 1).fillRect(bx - 13, eY0 - 10, 26, eY1 - eY0 + 14);
            b.fillStyle(0x4a4258, 1).fillRect(bx - 13, eY0 - 18, 26, eY1 - eY0 + 6);
            b.lineStyle(2, 0x14101a, 1).strokeRect(bx - 13, eY0 - 18, 26, eY1 - eY0 + 6);
            for (let y = eY0 - 18; y < eY1; y += 92) { b.fillStyle(0x5a5070, 1).fillRect(bx - 17, y - 6, 34, 14); b.lineStyle(2, 0x14101a, 1).strokeRect(bx - 17, y - 6, 34, 14); }
            this.colisio(bx, (eY0 + eY1) / 2, 26, eY1 - eY0);
        });
        // Dos brasers al peu de les escales
        [ex0 - 70, ex1 + 70].forEach(x => {
            const y = 1596, b = this.add.graphics().setDepth(y);
            b.fillStyle(0x000000, 0.3).fillEllipse(x, y + 4, 70, 18);
            b.fillStyle(0x3a3248, 1).fillRect(x - 22, y - 50, 44, 50).lineStyle(2, 0x14101a, 1).strokeRect(x - 22, y - 50, 44, 50);
            b.fillStyle(0x2a2030, 1).fillEllipse(x, y - 54, 64, 22).lineStyle(3, 0xb89a50, 0.9).strokeEllipse(x, y - 54, 64, 22);
            b.fillStyle(0xff7a20, 1).fillEllipse(x, y - 57, 46, 12);
            this.colisio(x, y - 8, 50, 20);
            this.focSala(x, y - 62, 1.25, y);
        });
        // Dos corbs de pedra dalt de les escales, vigilant el pont
        [[ex0 - 72, -1], [ex1 + 72, 1]].forEach(([x, sd]) => {
            const y = 1262, c = this.add.graphics().setDepth(y);
            c.fillStyle(0x000000, 0.3).fillEllipse(x, y + 4, 70, 18);
            c.fillStyle(0x3a3248, 1).fillRect(x - 28, y - 40, 56, 40).lineStyle(2, 0x14101a, 1).strokeRect(x - 28, y - 40, 56, 40);
            c.fillStyle(0x4a4258, 1).fillRect(x - 32, y - 46, 64, 8).strokeRect(x - 32, y - 46, 64, 8);
            const cy = y - 46;
            c.fillStyle(0x5a5468, 1).fillEllipse(x, cy - 34, 44, 62).fillCircle(x - sd * 14, cy - 70, 15);
            c.fillStyle(0x4a4458, 1).fillTriangle(x + sd * 4, cy - 10, x + sd * 30, cy, x + sd * 10, cy - 50);
            c.fillStyle(0x6a6478, 1).fillTriangle(x - sd * 24, cy - 74, x - sd * 46, cy - 66, x - sd * 24, cy - 64);
            c.lineStyle(2.5, 0x14101a, 1).strokeEllipse(x, cy - 34, 44, 62).strokeCircle(x - sd * 14, cy - 70, 15);
            c.lineStyle(2, 0x2a2434, 1).lineBetween(x - 6, cy - 46, x + 10, cy - 14).lineBetween(x - 12, cy - 40, x + 4, cy - 10);
            const u = this.add.circle(x - sd * 18, cy - 73, 3, 0xd8a8ff, 0.9).setBlendMode('ADD').setDepth(90001);
            this.tweens.add({ targets: u, alpha: 0.35, yoyo: true, repeat: -1, duration: 1100 });
            this.colisio(x, y - 10, 60, 24);
        });
        // La paret de baix, amb la porta per on s'entra (es dibuixa davant de tot)
        const pb = this.add.graphics().setDepth(H + 40);
        [[60, 836], [964, W - 60]].forEach(([a, b]) => {
            pb.fillStyle(0x221a2c, 1).fillRect(a, H - 24, b - a, 24);
            pb.lineStyle(2, 0x3a3048, 1).lineBetween(a, H - 24, b, H - 24);
        });
        [826, 974].forEach(x => {
            pb.fillStyle(0x3a3248, 1).fillRect(x - 16, H - 70, 32, 70).lineStyle(2, 0x14101a, 1).strokeRect(x - 16, H - 70, 32, 70);
            pb.fillStyle(0x4a4258, 1).fillRect(x - 20, H - 78, 40, 10).strokeRect(x - 20, H - 78, 40, 10);
        });
    },

    // Un bloc de pedra del pont, amb una runa que brilla quan el Cant de les Pedres el desperta
    blocPont(x, y, w, h) {
        const g = this.add.graphics().setPosition(x, y).setDepth(-1045);
        g.fillStyle(0x1a1424, 1).fillRect(-w / 2, -h / 2 + 4, w, h);
        g.fillStyle(0x5e526e, 1).fillRect(-w / 2, -h / 2, w, h - 6);
        g.fillStyle(0x7a6c8a, 1).fillRect(-w / 2, -h / 2, w, 5);
        g.lineStyle(2, 0x1a1424, 1).strokeRect(-w / 2, -h / 2, w, h - 2);
        g.lineStyle(1.5, 0x2a2234, 0.9).lineBetween(-w * 0.3, -h / 2 + 2, -w * 0.22, h / 2 - 8).lineBetween(w * 0.25, -h / 2 + 4, w * 0.36, -2);
        g.lineStyle(2, 0xb88aff, 0.8).strokeCircle(0, -3, 7).lineBetween(-12, -3, 12, -3);
        return g;
    },

    // Una columna tallada de la cova, amb una torxa al costat que mira cap al mig
    columnaCova(x, y) {
        const c = this.add.graphics().setDepth(y), sd = x < 900 ? 1 : -1;
        c.fillStyle(0x000000, 0.3).fillEllipse(x, y + 2, 110, 26);
        c.fillStyle(0x3a3048, 1).fillRect(x - 36, y - 420, 72, 420);
        for (let k = -2; k <= 2; k++) {                                     // estries
            c.fillStyle(0x2c2438, 1).fillRect(x + k * 13 - 3, y - 396, 6, 372);
            c.fillStyle(0x4a4058, 1).fillRect(x + k * 13 + 3, y - 396, 2, 372);
        }
        c.lineStyle(3, 0x1a1424, 1).strokeRect(x - 36, y - 420, 72, 420);
        c.fillStyle(0x4a4058, 1).fillRect(x - 46, y - 24, 92, 24).fillRect(x - 50, y - 430, 100, 26);
        c.lineStyle(2, 0x1a1424, 1).strokeRect(x - 46, y - 24, 92, 24).strokeRect(x - 50, y - 430, 100, 26);
        c.lineStyle(3, 0xb89a50, 0.5).lineBetween(x - 46, y - 410, x + 46, y - 410).lineBetween(x - 36, y - 40, x + 36, y - 40);
        // Caps d'ocell al capitell
        [-1, 1].forEach(s => {
            c.fillStyle(0x5a5070, 1).fillCircle(x + s * 40, y - 418, 9);
            c.fillStyle(0x6a6080, 1).fillTriangle(x + s * 46, y - 420, x + s * 62, y - 414, x + s * 46, y - 410);
            c.lineStyle(1.5, 0x14101a, 1).strokeCircle(x + s * 40, y - 418, 9);
        });
        // La torxa
        const tx = x + sd * 44, ty = y - 230;
        c.fillStyle(0x2a2030, 1).fillRect(x + sd * 34 - (sd < 0 ? 12 : 0), ty + 14, 12, 6);
        c.fillStyle(0x5a3a1e, 1).fillRect(tx - 5, ty - 4, 10, 30).lineStyle(2, 0x1a0c08, 1).strokeRect(tx - 5, ty - 4, 10, 30);
        c.fillStyle(0x2a2030, 1).fillEllipse(tx, ty - 4, 16, 8);
        this.fixar([c], x - 70, y - 440, 140, 460);
        this.focSala(tx, ty - 10, 0.8, y);
        this.colisio(x, y - 10, 92, 30);
    },

    // La gàbia gran. El pedestal es queda a terra; la resta (this.gabiaGfx) puja i baixa amb el Cant del Miracle
    dibuixarGabia(gx, base, gw, gh, dy) {
        // Pedestal de pedra amb una anella d'or
        const pd = this.add.graphics().setDepth(-1047);
        pd.fillStyle(0x000000, 0.35).fillEllipse(gx, base + 26, 420, 120);
        pd.fillStyle(0x2a2434, 1).fillEllipse(gx, base + 18, 400, 112);
        pd.fillStyle(0x4a4258, 1).fillEllipse(gx, base + 4, 384, 100);
        pd.lineStyle(3, 0x14101a, 1).strokeEllipse(gx, base + 4, 384, 100);
        pd.lineStyle(3, 0xb89a50, 0.75).strokeEllipse(gx, base + 4, 350, 86);
        for (let k = 0; k < 20; k++) { const a = k / 20 * Math.PI * 2; pd.fillStyle(0xb89a50, 0.7).fillCircle(gx + Math.cos(a) * 175, base + 4 + Math.sin(a) * 43, 3); }
        this.fixar([pd], gx - 220, base - 60, 440, 160);

        const gb = this.add.graphics();
        const cimDome = base - gh + gw / 2;                                  // centre de la cúpula
        // Anella de la base, de ferro, amb una franja d'or i reblons
        gb.fillStyle(0x1a1020, 1).fillEllipse(gx, base, gw + 24, 62);
        gb.lineStyle(12, 0x2a2030, 1).strokeEllipse(gx, base, gw + 4, 50);
        gb.lineStyle(4, 0xb89a50, 0.95).strokeEllipse(gx, base - 4, gw + 4, 50);
        for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI; gb.fillStyle(0xe0c070, 1).fillCircle(gx + Math.cos(a) * (gw / 2 + 2), base - 4 + Math.sin(a) * 25, 3); }
        // Barrots de ferro amb un reflex
        const barrot = (x, d, t) => {
            gb.lineStyle(7, 0x2a2030, 1); gb.beginPath(); gb.moveTo(x, base - Math.sin(t * Math.PI) * 22); gb.lineTo(x, cimDome - d * 0.9); gb.strokePath();
            gb.lineStyle(2, 0x6a5a82, 0.9); gb.beginPath(); gb.moveTo(x - 2, base - Math.sin(t * Math.PI) * 22 - 4); gb.lineTo(x - 2, cimDome - d * 0.9 + 4); gb.strokePath();
        };
        for (let k = 0; k <= 12; k++) { const t = k / 12, x = gx - gw / 2 + t * gw; barrot(x, Math.sqrt(Math.max(0, (gw / 2) ** 2 - (x - gx) ** 2)), t); }
        // Nervis de la cúpula
        gb.lineStyle(10, 0x2a2030, 1); gb.beginPath(); gb.arc(gx, cimDome, gw / 2, Math.PI, 0); gb.strokePath();
        [0.35, 0.7].forEach(f => {
            const pts = [];
            for (let k = 0; k <= 16; k++) { const a = Math.PI + k / 16 * Math.PI; pts.push({ x: gx + Math.cos(a) * gw / 2 * f, y: cimDome + Math.sin(a) * gw / 2 }); }
            gb.lineStyle(5, 0x2a2030, 1).strokePoints(pts, false);
            gb.lineStyle(1.5, 0x6a5a82, 0.8).strokePoints(pts.map(p => ({ x: p.x - 2, y: p.y + 2 })), false);
        });
        gb.lineStyle(3, 0xb89a50, 0.9); gb.beginPath(); gb.arc(gx, cimDome, gw / 2 - 4, Math.PI, 0); gb.strokePath();
        // Anelles del mig i de dalt, amb franja d'or i volutes
        [[base - gh * 0.5, 46], [cimDome + 4, 40]].forEach(([y, alt]) => {
            gb.lineStyle(9, 0x2a2030, 1).strokeEllipse(gx, y, gw, alt);
            gb.lineStyle(3, 0xb89a50, 0.9).strokeEllipse(gx, y - 3, gw, alt);
        });
        [-1, 1].forEach(sd => [0.3, 0.75].forEach(f => {
            const x = gx + sd * gw * f / 2, y = base - gh * 0.5 + 18;
            gb.lineStyle(2.5, 0xe0c070, 1); gb.beginPath(); gb.arc(x - sd * 6, y, 6, 0, Math.PI * 1.5, sd < 0); gb.strokePath();
            gb.beginPath(); gb.arc(x + sd * 6, y, 6, Math.PI, Math.PI * 2.5, sd < 0); gb.strokePath();
        }));
        // La porta del davant, amb el cadenat d'or
        gb.lineStyle(8, 0x241a2c, 1).strokeRect(gx - 54, base - 214, 108, 196);
        gb.lineStyle(2, 0xb89a50, 0.8).strokeRect(gx - 50, base - 210, 100, 188);
        [base - 160, base - 70].forEach(y => gb.lineStyle(6, 0x241a2c, 1).lineBetween(gx - 54, y, gx + 54, y));
        gb.fillStyle(0xd8b050, 1).fillRoundedRect(gx - 16, base - 128, 32, 28, 5).lineStyle(2.5, 0x3a2a10, 1).strokeRoundedRect(gx - 16, base - 128, 32, 28, 5);
        gb.lineStyle(5, 0xb89a50, 1); gb.beginPath(); gb.arc(gx, base - 128, 10, Math.PI, 0); gb.strokePath();
        gb.fillStyle(0x2a1a08, 1).fillCircle(gx, base - 117, 4).fillRect(gx - 1.5, base - 116, 3, 8);
        gb.fillStyle(0xfff0c0, 0.7).fillRect(gx - 12, base - 124, 4, 10);
        // L'ocell d'or del capdamunt, l'anella i la cadena fins al sostre
        const cim = base - gh;
        gb.fillStyle(0xd8b050, 1).fillCircle(gx, cim - 4, 12).lineStyle(2, 0x3a2a10, 1).strokeCircle(gx, cim - 4, 12);
        gb.fillStyle(0xd8b050, 1).fillEllipse(gx, cim - 24, 26, 16).fillCircle(gx + 10, cim - 32, 7);
        gb.fillStyle(0xe8a040, 1).fillTriangle(gx + 16, cim - 34, gx + 24, cim - 31, gx + 16, cim - 29);
        gb.fillStyle(0xb89040, 1).fillTriangle(gx - 10, cim - 26, gx - 26, cim - 34, gx - 14, cim - 18);
        gb.lineStyle(2, 0x3a2a10, 1).strokeEllipse(gx, cim - 24, 26, 16).strokeCircle(gx + 10, cim - 32, 7);
        gb.lineStyle(5, 0x2a2030, 1).strokeCircle(gx, cim - 52, 14);
        for (let y = cim - 66, k = 0; y > cim - 1000; y -= 16, k++) {
            if (k % 2) gb.lineStyle(4, 0x2a2030, 1).lineBetween(gx, y, gx, y - 16);
            else gb.lineStyle(3, 0x3a3048, 1).strokeEllipse(gx, y - 8, 10, 18);
        }
        // Tot plegat, una sola imatge dins d'un contenidor (és el que puja i baixa)
        const cx0 = gx - gw / 2 - 40, cy0 = cim - 1010;
        const img = this.fixar([gb], cx0, cy0, gw + 80, base + 50 - cy0, 0).setPosition(cx0, cy0);
        const cont = this.add.container(0, dy, [img]).setDepth(base - 10);
        // Els barrots, quan el Cant del Miracle hi sona, brillen
        const brill = this.add.graphics().setDepth(base - 9).setBlendMode('ADD').setY(dy).setAlpha(0);
        brill.lineStyle(4, 0xffe08a, 1);
        for (let k = 0; k <= 12; k++) {
            const t = k / 12, x = gx - gw / 2 + t * gw, d = Math.sqrt(Math.max(0, (gw / 2) ** 2 - (x - gx) ** 2));
            brill.beginPath(); brill.moveTo(x, base - Math.sin(t * Math.PI) * 22); brill.lineTo(x, cimDome - d * 0.9); brill.strokePath();
        }
        brill.beginPath(); brill.arc(gx, cimDome, gw / 2, Math.PI, 0); brill.strokePath();
        brill.strokeEllipse(gx, base - gh * 0.5, gw, 46).strokeEllipse(gx, base, gw + 4, 50);
        return { gb: cont, brill };
    }
});
