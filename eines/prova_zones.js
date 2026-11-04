// PROVA DE FUM DE TOTES LES ZONES. Carrega cada zona del joc per cada una de les seves entrades i comprova:
//   · que no hi ha errors de JavaScript ni recursos que falten,
//   · que cada sortida porta a una zona i entrada que existeixen,
//   · que des de l'entrada es pot arribar a totes les sortides i punts d'interacció (flood-fill sobre els obstacles),
//   · quin espai té l'Ineu per moure's.
// Ús (cal tenir un servidor del joc al port 8000 i el paquet «playwright»):
//     python3 -m http.server 8000 &            (des de l'arrel del repositori)
//     NODE_PATH=<carpeta amb node_modules> node eines/prova_zones.js fi      (estat: tot fet) o  inici  (principi del joc)
//     python3 eines/informe_zones.py smoke_fi.json
// Limitacions: ZonaTorre (la torre de caragol) no té l'Ineu i no es pot analitzar; algunes entrades només tenen sentit quan una porta
// és oberta (arrels, reixa, boira...), i en l'estat «inici» s'hi surt encallat: no és un error. Els gràfics «faltants» són els que es
// dibuixen amb codi (decidit).
// Prova de fum: carrega cada zona (per cada entrada), recull errors i comprova sortides, punts d'interacció i que no s'hi pot quedar encallat.
const { chromium } = require('playwright'); const fs = require('fs');
const ESTAT = process.argv[2] || 'fi', SORTIDA = process.argv[3] || (process.cwd() + '/smoke_' + ESTAT + '.json');
const ANALISI = (zonaKey) => {
    const z = game.scene.getScene(zonaKey), I = z.ineu, b = I.body, r = {};
    const obs = z.obstacles.getChildren().filter(o => o.body).map(o => ({ x: o.body.x, y: o.body.y, w: o.body.width, h: o.body.height }));
    const bw = b.width, bh = b.height, offx = I.x - b.center.x, offy = I.y - b.center.y;
    const W = z.physics.world.bounds, STEP = 10;
    const bloc = (cx, cy) => {
        if (cx - bw / 2 < W.x || cy - bh / 2 < W.y || cx + bw / 2 > W.right || cy + bh / 2 > W.bottom) return true;
        const x0 = cx - bw / 2, y0 = cy - bh / 2, x1 = cx + bw / 2, y1 = cy + bh / 2;
        for (const o of obs) if (x0 < o.x + o.w && x1 > o.x && y0 < o.y + o.h && y1 > o.y) return true;
        return false;
    };
    const sx = b.center.x, sy = b.center.y;
    r.encallatAlInici = bloc(sx, sy);
    r.mon = [Math.round(W.width), Math.round(W.height)];
    // flood fill
    const nx = Math.ceil(W.width / STEP), ny = Math.ceil(W.height / STEP), vist = new Uint8Array(nx * ny);
    const idx = (cx, cy) => Math.floor((cy - W.y) / STEP) * nx + Math.floor((cx - W.x) / STEP);
    const cua = [[sx, sy]]; vist[idx(sx, sy)] = 1; let n = 0;
    while (cua.length) {
        const [cx, cy] = cua.pop(); n++;
        for (const [dx, dy] of [[STEP, 0], [-STEP, 0], [0, STEP], [0, -STEP]]) {
            const x = cx + dx, y = cy + dy;
            if (x < W.x || y < W.y || x > W.right || y > W.bottom) continue;
            const k = idx(x, y); if (vist[k]) continue; vist[k] = 1;
            if (!bloc(x, y)) cua.push([x, y]); else vist[k] = 2;
        }
    }
    r.cellesAbastables = n;
    const abastable = (px, py, radi, esFeet) => {              // hi ha alguna cel·la abastable amb els peus a < radi del punt?
        const ox = esFeet ? offx : 0, oy = esFeet ? offy : 0;
        for (let y = py - radi; y <= py + radi; y += STEP) for (let x = px - radi; x <= px + radi; x += STEP) {
            const cx = x - ox, cy = y - oy; if (cx < W.x || cy < W.y || cx > W.right || cy > W.bottom) continue;
            if (vist[idx(cx, cy)] === 1 && Math.hypot(x - px, y - py) <= radi) return true;
        }
        return false;
    };
    // sortides
    r.sortides = z.sortides.map(s => {
        const R = s.r; let ok = false;
        for (let x = R.x - 20; x <= R.right + 20 && !ok; x += STEP) for (let y = R.y - 20; y <= R.bottom + 20 && !ok; y += STEP) {
            if (x < W.x || y < W.y || x > W.right || y > W.bottom) continue;
            if (vist[idx(x, y)] === 1 && Phaser.Geom.Intersects.RectangleToRectangle(new Phaser.Geom.Rectangle(x - bw / 2, y - bh / 2, bw, bh), R)) ok = true;
        }
        const dst = game.scene.getScene(s.desti), e = dst && dst.config && dst.config.entrades;
        return { a: s.desti, entrada: s.entrada, abastable: ok, destiExisteix: !!dst, entradaExisteix: !!(e && e[s.entrada]), tancada: !!s.pendentLlum };
    });
    // punts d'interacció
    r.punts = z.interactius.map(p => {
        let actiu = true; try { actiu = !p.actiu || !!p.actiu(); } catch (e) { actiu = 'ERR'; }
        let buit = false; try { buit = !p.enTancar && esDialegBuit(p.dialeg); } catch (e) {}
        return { x: Math.round(p.x), y: Math.round(p.y), radi: p.radi, actiu, buit, abastable: abastable(p.x, p.y, p.radi * 0.8, true) };
    });
    r.punts = r.punts.filter(p => p.actiu !== false && !p.buit);
    r.faltants = (Grafics.faltants || []).slice();
    return r;
};
(async () => {
    const b = await chromium.launch(); let p, errors = [], zonaAra = '';
    const obrir = async () => {
        p = await b.newPage({ viewport: { width: 540, height: 960 } });
        p.on('pageerror', e => errors.push({ zona: zonaAra, tipus: 'pageerror', msg: e.message.slice(0, 200) }));
        p.on('console', m => { if (m.type() === 'error') errors.push({ zona: zonaAra, tipus: 'console', msg: m.text().slice(0, 200) }); });
        await p.route('**/phaser.min.js*', r => r.fulfill({ path: __dirname + '/../js/lib/phaser.min.js', contentType: 'application/javascript' }));
        await p.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
        await p.goto('http://localhost:8000/?proves&nc=' + Date.now());
        await p.waitForFunction(() => typeof game !== 'undefined' && game.scene.isActive('Titol'), null, { timeout: 120000 });
    };
    await obrir();
    const zones = await p.evaluate(() => Joc.ZONES.map(k => [k, Object.keys((game.scene.getScene(k).config || {}).entrades || {})]));
    const res = [];
    for (const [zona, entrades] of zones) {
        for (const entrada of (entrades.length ? entrades : [undefined])) {
            zonaAra = zona + (entrada ? '/' + entrada : '');
            const t0 = Date.now(); let fila = { zona, entrada };
            try {
                await p.evaluate(([zona, entrada, estat]) => {
                    if (estat === 'fi') Proves.estatFins(PROGRES.passos.length, true); else Proves.estatFins(0);
                    Proves.anar(zona, entrada);
                }, [zona, entrada, ESTAT]);
                await p.waitForFunction(z => { const s = game.scene.getScene(z); return s && s.sys.isActive() && s.ineu && s.ineu.body; }, zona, { timeout: 30000 });
                await p.waitForTimeout(1200);
                fila = Object.assign(fila, await p.evaluate(ANALISI, zona));
                fila.ms = Date.now() - t0;
            } catch (e) {
                fila.error = 'no carrega: ' + e.message.split('\n')[0].slice(0, 120);
                console.log('FALLA', zonaAra, fila.error);
                try { await p.close(); } catch (x) {} await obrir();
            }
            res.push(fila);
            console.log('ok', zonaAra, fila.ms || '', fila.encallatAlInici ? 'ENCALLAT' : '');
            fs.writeFileSync(SORTIDA, JSON.stringify({ estat: ESTAT, res, errors }, null, 1));
        }
    }
    console.log('FET', res.length, 'carregues;', errors.length, 'errors');
    await b.close();
})();
