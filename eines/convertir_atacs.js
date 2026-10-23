/**
 * Converteix les fulles d'atac de l'Ineu i l'espasa a WebP amb transparència i pèrdua, fent servir el Chrome del sistema
 * (sense instal·lar res). Cal tenir el joc servit (python serveix.py):  node eines/convertir_atacs.js
 *  - art/sprites_png/ineu/Ineu-iso_attack_<dir>*.png  ->  assets/sprites/ineu/atac_<dir>.webp
 *    Les fulles (4x4 fotogrames de 256, l'Ineu sense arma) es normalitzen: mateix factor d'escala per a totes les direccions
 *    (cos de ATAC_ALT píxels), centrades i amb els peus a y = PEUS, igual que les fulles de caminar.
 *  - art/fonts_png/espasa.jpg  ->  assets/armes/espasa.webp (fons blanc fet transparent, retallada i reduïda a AMPLADA_ESPASA * RES)
 */
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');

const ARREL = path.join(__dirname, '..');
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const QUALITAT = 0.9, RES = 2, CEL = 256, ATAC_ALT = 225, PEUS = 240, AMPLADA_ESPASA = 28;
const FULLES = {
    down: 'Ineu-iso_attack_down-v3.png', up: 'Ineu-iso_attack_up-v3.png', left: 'Ineu-iso_attack_left-v3.png',
    right: 'Ineu-iso_attack_right-v3.png', southwest: 'Ineu-iso_attack_southwest-v3.png',
    southeast: 'Ineu-iso_attack_southeast-v3.png', northeast: 'Ineu-iso_attack_northeast-v3.png',
    northwest: 'Ineu-iso_attack_northwest.png'
};

// Algorisme de treure el fons blanc: el mateix que fa servir el joc (js/assets.js)
const font = fs.readFileSync(path.join(ARREL, 'js/assets.js'), 'utf8');
const i0 = font.indexOf('function treureFonsBlanc');
const treureFonsBlanc = font.slice(i0, font.indexOf('// ---------- Dibuixos provisionals', i0));

// Codi que s'executa dins la pàgina (Canvas + codificador WebP del Chrome)
const pagina = `
${treureFonsBlanc}
const CEL = ${CEL}, COLS = 4, N = 16;
const mediana = v => v.slice().sort((a, b) => a - b)[Math.floor(v.length / 2)];
const carrega = async url => { const im = new Image(); im.src = url; await im.decode(); return im; };
const alWebp = async (canvas, q) => {
    const blob = await new Promise(r => canvas.toBlob(r, 'image/webp', q));
    const buf = new Uint8Array(await blob.arrayBuffer());
    let s = ''; for (let i = 0; i < buf.length; i += 32768) s += String.fromCharCode.apply(null, buf.subarray(i, i + 32768));
    return btoa(s);
};
window.fulles = async (fitxers, q) => {
    const dades = {};
    for (const [dir, f] of Object.entries(fitxers)) {
        const im = await carrega('/art/sprites_png/ineu/' + f);
        const c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
        const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0);
        const d = x.getImageData(0, 0, c.width, c.height);
        const cs = c.width / COLS, peus = [], alts = [];
        for (let i = 4; i < N; i++) {                      // sense els fotogrames d'alçar el braç: mesura el cos sol
            const cx = (i % COLS) * cs, cy = Math.floor(i / COLS) * cs;
            let dalt = cs, baix = -1;
            for (let y = 0; y < cs; y++) for (let xx = 0; xx < cs; xx++) {
                if (d.data[((cy + y) * c.width + cx + xx) * 4 + 3] > 24) { if (y < dalt) dalt = y; if (y > baix) baix = y; }
            }
            if (baix >= 0) { peus.push(baix); alts.push(baix - dalt); }
        }
        dades[dir] = { c, cs, peus: mediana(peus), alt: mediana(alts) };
    }
    const k = ${ATAC_ALT} / mediana(Object.values(dades).map(f => f.alt));    // el mateix factor per a totes les direccions
    const sortida = {}, info = {};
    for (const [dir, f] of Object.entries(dades)) {
        const out = document.createElement('canvas'); out.width = COLS * CEL; out.height = COLS * CEL;
        const o = out.getContext('2d'); o.imageSmoothingQuality = 'high';
        const e = k * CEL / f.cs;
        for (let i = 0; i < N; i++) {
            o.save(); o.beginPath(); o.rect((i % COLS) * CEL, Math.floor(i / COLS) * CEL, CEL, CEL); o.clip();
            o.drawImage(f.c, (i % COLS) * f.cs, Math.floor(i / COLS) * f.cs, f.cs, f.cs,
                (i % COLS) * CEL + CEL / 2 - f.cs * e / 2, Math.floor(i / COLS) * CEL + ${PEUS} - f.peus * e, f.cs * e, f.cs * e);
            o.restore();
        }
        sortida[dir] = await alWebp(out, q);
        info[dir] = { peus: f.peus, alt: f.alt, escala: +e.toFixed(3) };
    }
    return { sortida, info };
};
window.espasa = async (fitxer, ample, q) => {
    const im = await carrega('/art/fonts_png/' + fitxer);
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
    const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height);
    treureFonsBlanc(d.data, c.width, c.height);
    x.putImageData(d, 0, 0);
    let x0 = c.width, y0 = c.height, x1 = -1, y1 = -1;
    for (let y = 0; y < c.height; y++) for (let xx = 0; xx < c.width; xx++) {
        if (d.data[(y * c.width + xx) * 4 + 3] > 24) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    }
    const w = x1 - x0 + 1, h = y1 - y0 + 1, e = Math.min(1, ample / w);
    const out = document.createElement('canvas'); out.width = Math.round(w * e); out.height = Math.round(h * e);
    const o = out.getContext('2d'); o.imageSmoothingQuality = 'high';
    o.drawImage(c, x0, y0, w, h, 0, 0, out.width, out.height);
    return { webp: await alWebp(out, q), w: out.width, h: out.height };
};
`;

const dorm = ms => new Promise(r => setTimeout(r, ms));

(async () => {
    const port = 9500 + Math.floor(Math.random() * 400);
    const perfil = path.join(require('os').tmpdir(), 'convertir_atacs_' + port);
    const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${port}`, '--user-data-dir=' + perfil, 'about:blank'], { stdio: 'ignore' });
    try {
        let llista;
        for (let i = 0; i < 50 && !llista; i++) {
            try { const l = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (l.length) llista = l; } catch { /* encara arrenca */ }
            await dorm(300);
        }
        const ws = new WebSocket(llista.find(t => t.type === 'page').webSocketDebuggerUrl);
        await new Promise(r => { ws.onopen = r; });
        let id = 0; const pend = {};
        ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pend[d.id]) { pend[d.id](d); delete pend[d.id]; } };
        const envia = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
        const executa = async expressio => {
            const r = await envia('Runtime.evaluate', { expression: expressio, awaitPromise: true, returnByValue: true });
            if (r.result.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text);
            return r.result.result.value;
        };
        await envia('Page.navigate', { url: 'http://localhost:8000/eines/' });   // mateix origen que el joc, per poder carregar-ne les imatges
        await dorm(1000);
        await executa(pagina + ';0');

        const { sortida, info } = await executa(`window.fulles(${JSON.stringify(FULLES)}, ${QUALITAT})`);
        let total = 0;
        for (const [dir, b64] of Object.entries(sortida)) {
            const dest = path.join(ARREL, 'assets/sprites/ineu', `atac_${dir}.webp`);
            fs.writeFileSync(dest, Buffer.from(b64, 'base64'));
            const a = fs.statSync(path.join(ARREL, 'art/sprites_png/ineu', FULLES[dir])).size, d = fs.statSync(dest).size;
            total += d;
            console.log(`atac_${dir}.webp`.padEnd(24), (a / 1024).toFixed(0).padStart(5), 'KB ->', (d / 1024).toFixed(0).padStart(4), 'KB', JSON.stringify(info[dir]));
        }
        console.log('Total atacs:', (total / 1024).toFixed(0), 'KB');

        const e = await executa(`window.espasa('espasa.jpg', ${AMPLADA_ESPASA * RES}, ${QUALITAT})`);
        fs.writeFileSync(path.join(ARREL, 'assets/armes/espasa.webp'), Buffer.from(e.webp, 'base64'));
        console.log('espasa.webp', `${e.w}x${e.h}`, (fs.statSync(path.join(ARREL, 'assets/armes/espasa.webp')).size / 1024).toFixed(0), 'KB');
        ws.close();
    } finally {
        chrome.kill();
    }
    process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
