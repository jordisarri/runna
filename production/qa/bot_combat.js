/* BOT DE COMBAT I BANC DE PROVES (QA, 2026-11-18). No forma part del joc: es carrega a ma des de la consola del navegador
 * (fetch('/production/qa/bot_combat.js').then(r=>r.text()).then(eval)) amb http://localhost:8000/?proves.
 *
 * - FF: avanç ràpid del joc. Adorm el bucle real (el navegador integrat va a ~1 fps pel WebGL per programari) i fa avançar
 *   Phaser a mà amb game.headlessStep(t, 16,67 ms) amb temps sintètic (60 fps exactes, sense dibuixar). El temps que es mesura
 *   és sempre temps de joc. hitStop (que fa servir performance.now/setTimeout) es reimplementa amb el rellotge sintètic.
 * - Bot: cada fotograma tria una direcció (ui.vectorTactil, com el joystick del mòbil) simulant 0,6 s endavant contra «perills»
 *   (cercles mòbils o el·lipses amb finestra de temps, deduïts de l'estat de cada enemic) i tria el que més s'acosta al seu
 *   objectiu; ataca amb z.atacar() (el mateix que fa la tecla J) quan l'objectiu és a l'abast i és segur quedar-se quiet 0,45 s.
 */
(function () {
    if (window.FF && window.FF._v === 22) { return; }
    const FF = window.FF = { _v: 22, dt: 1000 / 60, t: 0, hits: [], swings: 0, dmgDone: [], rebots: 0, dead: false, deaths: 0 };
    const Z = () => Proves.zonaActiva();
    // Els tweens de Phaser 3.80 (TweenManager.getDelta) compten amb Date.now(), no amb el rellotge de l'escena: es fa que Date.now() segueixi el temps sintètic.
    FF.start = () => {
        const z = Z(); game.loop.sleep(); FF.t = z ? z.time.now : performance.now();
        if (!FF._dn) { FF._dn = Date.now.bind(Date); FF._d0 = FF._dn(); FF._t0 = FF.t; Date.now = () => FF._d0 + (FF.t - FF._t0); }
    };
    FF.end = () => { game.loop.wake(); if (FF._dn) { Date.now = FF._dn; FF._dn = null; } };

    // ---- instrumentació (no canvia el comportament, només hi afegeix mesures) ----
    const ZP = ZonaBase.prototype;
    if (!ZP.__orig) {
        ZP.__orig = { ferIneu: ZP.ferIneu, caure: ZP.caure, hitStop: ZP.hitStop, colpejar: ZP.colpejar, copRebutjat: ZP.copRebutjat, atacar: ZP.atacar };
    }
    const O = ZP.__orig;
    ZP.ferIneu = function (mal, des) {
        const abans = Estat.dades.vida, ara = this.time.now, inv = ara < (this.invulnerableFins || 0);
        O.ferIneu.call(this, mal, des);
        if (Estat.dades.vida < abans) {
            FF.hits.push({ t: Math.round(ara), vida: Estat.dades.vida, foes: (this.enemics || []).filter(e => !e.mort).map(e => e.tipus + ':' + (e.estat || '')).slice(0, 8).join(','), des: [Math.round(des.x), Math.round(des.y)] });
        } else if (!inv) FF.hits.push({ t: Math.round(ara), vida: Estat.dades.vida, absorbit: true });
    };
    ZP.caure = function () { FF.dead = true; FF.deaths++; this.caient = true; this.ineu.body.setVelocity(0); };       // no fa la transició (fade + canvi d'escena)
    ZP.hitStop = function (ms) {                                                                                       // com l'original, però amb el rellotge de FF
        if (!this.physics || !this.physics.world) return;
        const fins = FF.t + ms;
        if (this.hitStopFins && fins <= this.hitStopFins) return;
        const nou = !this.hitStopFins;
        this.hitStopFins = fins;
        if (nou) { this.physics.world.pause(); this.anims.pauseAll(); this.tweens.timeScale = 0.04; }
    };
    ZP.colpejar = function (e, dany, d) { const v0 = e.vida; O.colpejar.call(this, e, dany, d); FF.dmgDone.push({ t: Math.round(this.time.now), tipus: e.tipus, dany: v0 - e.vida, vida: e.vida }); };
    ZP.copRebutjat = function (e, d) { FF.rebots++; return O.copRebutjat.call(this, e, d); };
    ZP.atacar = function () { const a = this.atacFins || 0; O.atacar.call(this); if ((this.atacFins || 0) !== a) FF.swings++; };

    FF.postHS = () => {
        const z = Z();
        if (z && z.hitStopFins && FF.t >= z.hitStopFins) {
            z.hitStopFins = 0; z.anims.resumeAll();
            if (z.sys && z.sys.settings && z.sys.settings.status <= Phaser.Scenes.RUNNING) { z.physics.world.resume(); z.tweens.timeScale = 1; }
        }
    };
    FF.step = (n, bot) => {
        for (let i = 0; i < n; i++) {
            const z = Z();
            if (bot && z && z.ineu && z.ineu.body && !FF.dead && !z.canviant) bot(z);
            FF.t += FF.dt; game.headlessStep(FF.t, FF.dt); FF.postHS();
        }
    };
    FF.reset = () => { FF.hits = []; FF.swings = 0; FF.dmgDone = []; FF.rebots = 0; FF.dead = false; };

    // ---- el bot ----
    const Bot = FF.Bot = { prev: new Map(), hist: [], margin: 14, trace: [], opts: { riscFinestra: 0.3, ruido: 0 } };
    const dist = (a, b, c, d) => Math.hypot(a - c, b - d);
    function facing(z) {
        const v8 = { right: [1, 0], southeast: [1, 1], down: [0, 1], southwest: [-1, 1], left: [-1, 0], northwest: [-1, -1], up: [0, -1], northeast: [1, -1] }[z.vista8];
        return v8 ? Math.atan2(v8[1], v8[0]) : Math.atan2((DIRS[z.direccio] || DIRS.avall).y, (DIRS[z.direccio] || DIRS.avall).x);
    }
    // Perills: { x,y,vx,vy (px/s), r (o rx,ry), t0,t1 (ms des d'ara) }
    function perills(z, now, J, view) {
        const H = [], M = Bot.margin;
        view.forEach(e => {
            if (e.real.mort || e.amagat) return;
            const d = e.def, c = { x: e.cx, y: e.cy }, T = e.tipus, st = e.estat, r = d.radi + 20 + M;
            const vx = e.vx, vy = e.vy;
            const resta = Math.max(0, (e.fins || 0) - now);
            const disc = (x, y, vx2, vy2, rr, t0, t1) => H.push({ x, y, vx: vx2, vy: vy2, r: rr, t0, t1 });
            const dir = (x, y) => { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; };
            if (e.atorditFins > now && T !== 'raim' && T !== 'ocellaire') { /* aturdit: no actua encara */ }
            switch (T) {
                case 'escolopendra': case 'visitant': disc(c.x, c.y, vx, vy, r, 0, 700); break;
                case 'gripau': {
                    if (st === 'salt') disc(c.x, c.y, vx, vy, r, 0, resta);
                    else if (st === 'repos' || !st) { const [ux, uy] = dir(J.x - c.x, J.y - c.y), dd = dist(c.x, c.y, J.x, J.y); disc(c.x, c.y, ux * (dd < 340 ? 250 : 110), uy * (dd < 340 ? 250 : 110), r, resta, resta + 450); }
                    break; }
                case 'ovella': {
                    if (st === 'apunta') disc(c.x, c.y, Math.cos(e.ang) * 290, Math.sin(e.ang) * 290, r, resta, resta + 520);
                    else if (st === 'carrega') disc(c.x, c.y, vx, vy, r, 0, resta);
                    else if (st === 'vaga' && dist(c.x, c.y, J.x, J.y) < 380) disc(c.x, c.y, 0, 0, r + 25, 0, 800);
                    break; }
                case 'ferralla': {
                    const [ux, uy] = dir(J.x - c.x, J.y - c.y);
                    if (st === 'apunta') disc(c.x, c.y, ux * 230, uy * 230, r, resta, resta + 330);
                    else if (st === 'salta') disc(c.x, c.y, vx, vy, r, 0, resta);
                    else if (dist(c.x, c.y, J.x, J.y) < 420) disc(c.x, c.y, ux * 230, uy * 230, r, resta + 380, resta + 710);
                    break; }
                case 'ratpenat': disc(c.x, c.y, vx, vy, r + (st === 'ataca' ? 30 : 10), 0, st === 'ataca' ? 600 : 300); break;
                case 'ocellFoc': case 'ocellGabia': {
                    if (T === 'ocellFoc' && st === 'orbita' && isFinite(e.llançar)) { const [ux, uy] = dir(J.x - c.x, J.y - c.y), t0 = Math.max(0, e.llançar - now), vv = e.rapid ? 470 : 300; disc(c.x, c.y, ux * vv, uy * vv, r + 14, t0, t0 + 1100); disc(c.x, c.y, vx, vy, r, 0, 300); break; }
                    if (T === 'ocellGabia' && st === 'surt') { const [ux, uy] = dir(J.x - c.x, J.y - c.y); disc(c.x, c.y, ux * 300, uy * 300, r, resta, resta + 950); }
                    else disc(c.x, c.y, vx, vy, r + 12, 0, 800);
                    break; }
                case 'bolet': if (e.carregant) disc(c.x, c.y, 0, 0, 115 + 8, Math.max(0, resta - 120), resta + 120); break;
                case 'bolet_verinos': if (e.apuntant) disc(e.objX, e.objY, 0, 0, 62 + M, resta + 520, resta + 740); break;
                case 'pastor': {
                    const f2 = e.vida <= d.vida / 2;
                    if (st === 'apunta') disc(c.x, c.y, Math.cos(e.ang) * d.vel, Math.sin(e.ang) * d.vel, r, resta, resta + (f2 ? 560 : 480));
                    else if (st === 'carrega') disc(c.x, c.y, vx, vy, r, 0, resta);
                    else if (st === 'bat') H.push({ x: c.x, y: c.y, vx: 0, vy: 0, rx: 140 + M, ry: 77 + M, t0: Math.max(0, resta - 80), t1: resta + 80 });
                    break; }
                case 'raim': {
                    const f2 = e.vida <= 14;
                    if (st === 'apunta') disc(c.x, c.y, Math.cos(e.ang) * d.vel, Math.sin(e.ang) * d.vel, r, resta, resta + (f2 ? 460 : 400));
                    else if (st === 'carrega') disc(c.x, c.y, vx, vy, r, 0, resta + 20);
                    else if (st === 'maza') disc(e.mx, e.my, 0, 0, 100 + M, Math.max(0, resta - 80), resta + 80);
                    else if (st === 'cansat') {
                        const entra = e.fins - (f2 ? 1550 : 2100);
                        if (now < entra + 520) { const qp = ENEMICS.raim.capPrevist(z, e.real); disc(qp.x, qp.y + 30 * K_RAIM, 0, 0, 70 * K_RAIM + M, Math.max(0, entra + 340 - now), Math.max(0, entra + 520 - now)); }
                    }
                    break; }
                case 'ocellaire': {
                    const b2 = e.basto, K = K_OCELLAIRE;
                    if (st === 'invoca') { disc(b2.x, b2.y + 40, 0, 0, 95 * K + 20 + M, 0, 1500); disc(c.x, c.y - 20, 0, 0, Bot.opts.rInvoca || 215, 0, 1500); }      // el bàcul que gira + els ocells que volten
                    else if (st === 'cercle') H.push({ x: c.x, y: c.y, vx: 0, vy: 0, rx: e.radiCercle + 20, ry: e.radiCercle * 0.55 + 20, t0: Math.max(0, resta - 100), t1: resta + 100 });
                    else if (st === 'llança') {
                        if (b2.volant && !Bot.desti) Bot.desti = { x: J.x, y: J.y - 10, x0: b2.x, y0: b2.y };
                        if (!b2.volant) Bot.desti = null;
                        const A = Bot.desti || { x: J.x, y: J.y - 10, x0: c.x, y0: c.y - 60 };
                        for (let k = 0; k <= 5; k++) disc(A.x0 + (A.x - A.x0) * k / 5, A.y0 + (A.y - A.y0) * k / 5 + 20, 0, 0, 70 * K + 14 + 8, 0, 1400);
                    }
                    else if (st === 'sura' || st === 'rugit' || st === 'apareix' || st === 'esvaeix' || st === 'foc') disc(c.x, c.y, vx, vy, r + 20, 0, 700);
                    break; }
            }
        });
        (z.focs || []).forEach(f => { if (!f.mort) H.push({ x: f.x, y: f.y, vx: 0, vy: 0, rx: f.R + 16, ry: f.R * 0.55 + 12, t0: 0, t1: 4000 }); });
        return H;
    }
    function pen(h, px, py, t) {
        const hx = h.x + h.vx * t / 1000, hy = h.y + h.vy * t / 1000;
        if (h.rx) { const q = Math.hypot((px - hx) / h.rx, (py - hy) / h.ry); return q < 1 ? (1 - q) * h.rx : 0; }
        return Math.max(0, h.r - dist(px, py, hx, hy));
    }
    function costeMoviment(H, J, vx, vy, sc = 1) {
        let c = 0;
        for (let t = 50; t <= 600; t += 50) {
            const px = J.x + vx * t / 1000, py = J.y + vy * t / 1000;
            for (const h of H) { if (t < h.t0 - 60 || t > h.t1 + 60) continue; const p = pen(h, px, py, t); if (p > 0) c += (600 + p * 12) * (t < 300 ? 2 : 1) * sc; }
        }
        return c;
    }
    function segur(H, J, ms) {      // quedar-se quiet ms: cap perill hi arriba
        for (let t = 0; t <= ms; t += 50) for (const h of H) { if (t < h.t0 - 60 || t > h.t1 + 60) continue; if (pen(h, J.x, J.y, t) > 0) return false; }
        return true;
    }

    // Objectiu: { x, y (punt de cop), r (radi), stand (distància a la qual col·locar-se), cap:boolean } o null (només esquivar / esperar)
    function triaObjectiu(z, J, now) {
        const armaL = (Estat.te('runna') || Estat.te('basto_tiller')) ? 135 : 118;
        let millor = null, md = 1e9;
        const vius = z.enemics.filter(e => !e.mort && !e.amagat);
        const boss = vius.find(e => e.def.barra);
        if (boss) {
            const T = boss.tipus, c = boss.spr.body.center;
            if (T === 'raim' || T === 'ocellaire') {
                const q = z.puntsCop(boss)[0];
                const ocells = vius.filter(e => e.tipus === 'ocellFoc' && e.estat === 'vola' && dist(e.spr.body.center.x, e.spr.body.center.y, J.x, J.y) < (boss.estat === 'cansat' && (boss.copsRebuts || 0) < 3 ? 95 : armaL + 18 + 14)).sort((a, b) => dist(a.spr.body.center.x, a.spr.body.center.y, J.x, J.y) - dist(b.spr.body.center.x, b.spr.body.center.y, J.x, J.y));
                if (Bot.opts.tallaOcells !== false && ocells.length) { const e = ocells[0], cc = e.spr.body.center; return { x: cc.x, y: cc.y, r: e.def.radi, stand: 0, e, ocell: true }; }
                const obert = boss.estat === 'cansat' && (boss.copsRebuts || 0) < boss.def.copsPausa && (T === 'ocellaire' || now > boss.fins - (boss.vida <= 14 ? 1550 : 2100) + 440);
                if (obert) return { x: q.x, y: q.y, r: q.r, stand: armaL - 28, cap: true, e: boss, ref: [c.x, c.y] };
                // fora de la finestra: es manté a distància segura (i, si hi ha ocells o ovelles a l'abast, els talla)
                const alt = vius.filter(e => !e.def.barra && e.tipus !== 'bolet' && dist(e.spr.body.center.x, e.spr.body.center.y, J.x, J.y) < armaL + 20);
                if (alt.length) { const e = alt[0], cc = e.spr.body.center; return { x: cc.x, y: cc.y, r: e.def.radi, stand: armaL - 40, e }; }
                const D = T === 'ocellaire' ? (Bot.opts.dEspera || 235) : 320;
                const a = Math.atan2(J.y - c.y, J.x - c.x);
                return { x: c.x + Math.cos(a) * D, y: c.y + Math.sin(a) * D, r: 0, stand: 0, espera: true, e: boss };
            }
        }
        vius.forEach(e => {
            if (e.def.barra && (e.tipus === 'raim' || e.tipus === 'ocellaire')) return;
            const c = e.spr.body.center, d = dist(c.x, c.y, J.x, J.y);
            if (e.tipus === 'capoll') return;
            if (d < md) { md = d; millor = e; }
        });
        if (!millor) return null;
        const c = millor.spr.body.center, T = millor.tipus, r = millor.def.radi;
        let stand = armaL - 28;
        if (T === 'bolet') stand = Math.min(armaL + r - 8, armaL + r - 8); else if (T === 'bolet_verinos') stand = armaL - 20;
        else if (T === 'gabiaViva') stand = armaL - 10;
        else stand = armaL + r - 52;        // cos a cos a ~ 52 px de marge del radi de contacte
        stand = Math.max(stand, 60);
        return { x: c.x, y: c.y, r, stand, e: millor };
    }

    Bot.tick = function (z) {
        const ui = z.ui(), J = z.ineu.body.center, now = z.time.now;
        if (z.caient || ui.dialeg || ui.bloquejat) { ui.vectorTactil = { x: 0, y: 0 }; return; }
        if (Bot.opts.trace) { (FF.poslog = FF.poslog || []).push([Math.round(now), J.x | 0, J.y | 0]); if (FF.poslog.length > 400) FF.poslog.shift(); }
        const snaps = z.enemics.filter(e => !e.mort).map(e => {
            const c = e.spr.body.center, pv = Bot.prev.get(e);
            const f = Object.assign({}, e, { real: e, cx: c.x, cy: c.y, vx: pv ? (c.x - pv.x) / (FF.dt / 1000) : 0, vy: pv ? (c.y - pv.y) / (FF.dt / 1000) : 0 });
            Bot.prev.set(e, { x: c.x, y: c.y }); return f;
        });
        const reac = Math.round((Bot.opts.reaccio || 0) / FF.dt);
        Bot.hist.push(snaps); while (Bot.hist.length > reac + 1) Bot.hist.shift();
        const view = Bot.hist[0].filter(s => !s.real.mort);
        const H = Bot.opts.ingenu ? [] : perills(z, now, J, view);
        const obj = triaObjectiu(z, J, now);
        // objectiu de moviment
        let gx = J.x, gy = J.y;
        if (obj) {
            const a = Math.atan2(J.y - obj.y, J.x - obj.x), d = dist(J.x, J.y, obj.x, obj.y);
            if (obj.ocell) { /* es queda on és */ }
            else if (obj.espera) { gx = obj.x; gy = obj.y; }
            else { const s = obj.stand; if (d > s) { gx = obj.x + Math.cos(a) * s; gy = obj.y + Math.sin(a) * s; } else if (d < s - 40) { gx = obj.x + Math.cos(a) * (s - 15); gy = obj.y + Math.sin(a) * (s - 15); } }
        }
        // candidats
        let bestC = 1e18, bv = [0, 0];
        const cands = [[0, 0]];
        for (let k = 0; k < 16; k++) { const a = k * Math.PI / 8; cands.push([Math.cos(a) * 230, Math.sin(a) * 230]); if (k % 2 === 0) { cands.push([Math.cos(a) * 115, Math.sin(a) * 115]); cands.push([Math.cos(a) * 40, Math.sin(a) * 40]); } }
        cands.forEach(([vx, vy]) => {
            let c = costeMoviment(H, J, vx, vy, obj && obj.cap ? Bot.opts.riscFinestra : 1);
            const ex = J.x + vx * 0.3, ey = J.y + vy * 0.3;
            c += dist(ex, ey, gx, gy) * (obj && obj.cap ? 2.5 : 1.0);
            if (vx === 0 && vy === 0) c += 4;
            if (Bot.last && (Bot.last[0] !== vx || Bot.last[1] !== vy)) c += 10;
            if (Bot.opts.ruido) c += Math.random() * Bot.opts.ruido;
            if (c < bestC) { bestC = c; bv = [vx, vy]; }
        });
        Bot.last = bv;
        let ax = bv[0] / 230, ay = bv[1] / 230;
        // atac
        if (obj && !obj.espera && z.teArma() && now >= (z.atacFins || 0) && !z.caient) {
            const d = dist(J.x, J.y, obj.x, obj.y), L = (Estat.te('runna') || Estat.te('basto_tiller')) ? 135 : 118;
            const alcanca = d <= L + obj.r - 4;
            const ang = Math.atan2(obj.y - J.y, obj.x - J.x), dif = Math.abs(Phaser.Math.Angle.Wrap(ang - facing(z)));
            if (alcanca && z.atacantFins !== undefined) {
                if (dif < 0.85) { if (segur(H, J, Bot.opts.commit || 420) || obj.cap || obj.ocell) { z.atacar(); ax = ay = 0; } }
                else if (Math.hypot(ax, ay) < 0.1) { ax = Math.cos(ang) * 0.2; ay = Math.sin(ang) * 0.2; }       // gira cap a l'objectiu
            }
        }
        ui.vectorTactil = { x: ax, y: ay };
    };
    Bot.fn = z => Bot.tick(z);
    // Estat net abans d'un intent
    Bot.net = () => { Bot.prev.clear(); Bot.hist = []; };

    // ---- ajudants de prova ----
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    FF.run = (z, fet, maxMs, bot) => { const t0 = z.time.now; let n = 0; while (n * FF.dt < maxMs && !fet() && !FF.dead) { FF.step(3, bot); n += 3; } return z.time.now - t0; };
    // Prepara l'estat (Proves.estatFins) i porta l'Ineu a la zona. o: { estat, zona, entrada, cors, vida, treu:[flags], posa:[flags] }
    FF.setup = async o => {
        if (!FF._dn) FF.start();
        Estat.caigut = false; Proves.estatFins(o.estat, false, true, true);
        if (o.cors) Estat.dades.corsMax = o.cors;
        Estat.dades.vida = o.vida != null ? o.vida : Estat.dades.corsMax * 2;
        (o.treu || []).forEach(f => Proves.treuFlag(f)); (o.posa || []).forEach(f => Estat.posaFlag(f));
        const z0 = Z(); if (z0) FF.t = Math.max(FF.t, z0.time.now);
        { const dest = game.scene.getScene(o.zona); if (dest && dest.ineu && (!dest.ineu.body || dest.ineu.y > 935)) dest.ineu = null; }       // (evita el fragment fràgil de casa.js:686, vegeu l'informe)
        Proves.anar(o.zona, o.entrada);
        const t0 = performance.now();
        while (performance.now() - t0 < 20000) {
            { const u = game.scene.getScene('UI'); if (u) u.vectorTactil = { x: 0, y: 0 }; }
            FF.step(20); await sleep(15);
            const z = Z();
            if (z && z.scene.key === o.zona && z.ineu && z.ineu.body && !z.canviant && !(z.cameras.main.fadeEffect && z.cameras.main.fadeEffect.isRunning)) break;
        }
        FF.step(90); FF.reset(); Bot.net();
        const z = Z();
        z.invulnerableFins = 0; z.cintaGastada = true;                // sense el Llaç de la Nena (no es té a les proves) ni invulnerabilitat de l'entrada
        return z;
    };

    // ---- proves (intents) ----
    // sc: { setup:{estat,zona,entrada,cors,vida}, start(z)->{} , fet(z)->bool, maxMs, reaccio }
    FF.trial = async sc => {
        const z = await FF.setup(sc.setup);
        Bot.opts.reaccio = sc.reaccio || 0; Bot.opts.commit = sc.commit;
        const ctx = (sc.start && sc.start(z)) || {};
        FF.step(15); FF.reset(); FF.hits = [];
        const vida0 = Estat.dades.vida, t0 = z.time.now;
        const fet = sc.fet ? () => sc.fet(z, ctx) : () => !z.enemics.some(e => !e.mort && !e.def.neutral);
        const fuig = () => Z() !== z;                      // l'Ineu ha sortit de la zona (fugida pel forat, vegeu l'informe)
        FF.run(z, () => fet() || fuig(), sc.maxMs || 120000, Bot.fn);
        const hits = FF.hits.filter(h => !h.absorbit);
        return { fuita: fuig(), guanya: !FF.dead && !fuig() && fet(), mort: FF.dead, tms: Math.round(z.time.now - t0), perduda: vida0 - Estat.dades.vida, hits: hits.length, swings: FF.swings, dany: FF.dmgDone.length, rebots: FF.rebots,
                 ult: hits.slice(-1).map(h => h.foes + '@' + h.des).join(''), ctx };
    };
    const anell = (z, llista, R = 330) => {           // enemics en cercle al voltant de l'Ineu
        const J = z.ineu.body.center; z.enemics.slice().forEach(e => z.retirar(e));
        return llista.map((t, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / llista.length + 0.4; const e = z.enemic(t, J.x + Math.cos(a) * R, J.y + Math.sin(a) * R * 0.8); if (e && t === 'ratpenat') e.estat = 'penja'; return e; }).filter(Boolean);
    };
    FF.anell = anell;
    FF.ESC = {
        placa: (estat, llista, o = {}) => ({ setup: { estat, zona: 'ZonaPlaca', entrada: 'inici', cors: o.cors }, start: z => ({ en: anell(z, llista, o.R || 330) }), maxMs: 90000, reaccio: o.reaccio || 0 }),
        pastor: (cors, reaccio, tipus = 'cors') => ({ setup: { estat: 10, zona: 'ZonaCirosa', entrada: 'cami', cors },
            start: z => { z.ineu.body.reset(1250, 850); z.ineu.setPosition(1250, 850); z.iniciarBoss(); return { boss: null }; }, reaccio, maxMs: 240000,
            fet: z => { const b = z.enemics.find(e => e.tipus === 'pastor'); return !!(b && b.mort); } }),
        raim: (cors, reaccio) => ({ setup: { estat: 34, zona: 'ZonaCasaGranInt', entrada: 'porxo', cors, posa: ['raimDesperta'], treu: ['raimDerrotat'] },
            start: z => { if (!z.enemics.some(e => e.tipus === 'raim')) z.despertarRaim(true); return { n: z.enemics.filter(e => e.tipus === 'raim').length }; }, reaccio, maxMs: 300000,
            fet: z => { const b = z.enemics.find(e => e.tipus === 'raim'); return !!(b && b.mort); } }),
        ocellaire: (cors, reaccio) => ({ setup: { estat: 44, zona: 'ZonaGabia', entrada: 'tortura', cors },
            start: z => { z.combatIniciat = true; z.bossActiu = true; z.tancarSalaCombat(true); const ap = z.add.image(z.gx, z.base + 90, 'ocellaire'); z.ineu.body.reset(z.gx, z.base + 420); z.començarBoss(ap); return {}; }, reaccio, maxMs: 360000,
            fet: z => { const b = z.enemics.find(e => e.tipus === 'ocellaire'); return !!(b && b.mort); } })
    };

    // n intents d'un escenari; bopts: opcions del bot ({reaccio, riscFinestra, ruido, ingenu...})
    window.batch = FF.batch = async (nom, mk, n, bopts = {}) => {
        let w = 0, deaths = 0, fu = 0, ts = [], hs = [], sw = [], last = [];
        for (let i = 0; i < n; i++) {
            Object.assign(Bot.opts, { riscFinestra: 0.3, ruido: 25, tallaOcells: true, ingenu: false }, bopts);
            const x = await FF.trial(mk());
            if (x.fuita) fu++; if (x.guanya) { w++; ts.push(x.tms); } if (x.mort) { deaths++; last.push(x.ult.slice(0, 70)); }
            hs.push(x.hits); sw.push(x.swings);
        }
        const avg = a => a.length ? Math.round(a.reduce((p, c) => p + c, 0) / a.length) : null;
        return { nom, n, wins: w, fuites: fu, deaths, tGuanyaMs: avg(ts), tMin: ts.length ? Math.min(...ts) : null, tMax: ts.length ? Math.max(...ts) : null, hitsMig: +(hs.reduce((p, c) => p + c, 0) / n).toFixed(1), hitsMax: Math.max(...hs), swings: avg(sw), mortPer: last.slice(0, 2) };
    };
    window.fmt = FF.fmt = R => R.map(x => x.nom + ' | win ' + x.wins + '/' + x.n + ' mort ' + x.deaths + ' fuita ' + x.fuites + ' | t ' + x.tGuanyaMs + ' (' + x.tMin + '-' + x.tMax + ') | hits mig ' + x.hitsMig + ' max ' + x.hitsMax + ' | sw ' + x.swings + ' | ' + x.mortPer.join(';')).join('\n');
    FF.estat = () => { const z = Z(); return { vida: Estat.dades.vida, max: Estat.dades.corsMax * 2, hits: FF.hits.length, swings: FF.swings, dead: FF.dead, t: Math.round(z.time.now), ineu: [z.ineu.x | 0, z.ineu.y | 0] }; };
})();
