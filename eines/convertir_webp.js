/**
 * Converteix els PNG del catàleg (js/assets.js) a WebP amb pèrdua i transparència.
 *   node eines/convertir_webp.js [clau]     (cal tenir "sharp" instal·lat; amb clau, només aquella imatge)
 * Per a cada imatge: treu el fons blanc (el mateix algorisme que el joc), retalla les vores buides i
 * redueix a l'amplada que el joc usa de debò (amplada * RES). També passa a WebP les fulles de l'Ineu.
 */
const fs = require('fs'), path = require('path'), vm = require('vm');
const sharp = require('sharp');

const ARREL = path.join(__dirname, '..');
const RES = 2, QUALITAT = 85;
const font = fs.readFileSync(path.join(ARREL, 'js/assets.js'), 'utf8');
const ctx = {};
vm.runInNewContext(font.slice(font.indexOf('function treureFonsBlanc'), font.indexOf('// ---------- Dibuixos provisionals')) + '; this.f = treureFonsBlanc;', ctx);
const treureFonsBlanc = ctx.f;

const items = [...font.matchAll(/key:\s*'(\w+)',\s*file:\s*'([^']+)',\s*amplada:\s*(\d+)/g)].map(m => ({ key: m[1], file: m[2], amplada: +m[3] }));

// Cerca l'origen d'una imatge a art/<categoria>/<nom>.(png|jpg|jpeg|webp)
const fontArt = (categoria, stem) => {
    for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
        const p = path.join(ARREL, 'art', categoria, stem + '.' + ext);
        if (fs.existsSync(p)) return p;
    }
    return null;
};

const mb = n => (n / 1048576).toFixed(2) + ' MB';
let abans = 0, despres = 0;

async function catalog(it) {
    const stem = path.basename(it.file).replace(/\.\w+$/, '');
    const src = fontArt(path.dirname(it.file).replace(/^assets\//, ''), stem);       // l'origen és a art/<categoria>/ (mirall d'assets/)
    if (!src) return;
    const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    treureFonsBlanc(data, info.width, info.height);
    // Caixa del contingut
    let x0 = info.width, y0 = info.height, x1 = -1, y1 = -1;
    for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
        if (data[(y * info.width + x) * 4 + 3] > 24) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    }
    if (x1 < 0) { x0 = 0; y0 = 0; x1 = info.width - 1; y1 = info.height - 1; }
    x0 = Math.max(0, x0 - 2); y0 = Math.max(0, y0 - 2); x1 = Math.min(info.width - 1, x1 + 2); y1 = Math.min(info.height - 1, y1 + 2);
    const w = x1 - x0 + 1, h = y1 - y0 + 1;
    let img = sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).extract({ left: x0, top: y0, width: w, height: h });
    const objectiu = it.amplada * RES;
    if (w > objectiu) img = img.resize({ width: objectiu, kernel: 'lanczos3' });
    const dest = path.join(ARREL, it.file.replace(/\.\w+$/, '.webp'));
    const r = await img.webp({ quality: QUALITAT, alphaQuality: 100, effort: 6, smartSubsample: true }).toFile(dest);
    const a = fs.statSync(src).size;
    abans += a; despres += r.size;
    console.log(it.key.padEnd(16), mb(a).padStart(9), '->', mb(r.size).padStart(9), `${info.width}x${info.height} -> ${r.width}x${r.height}`);
}

// Fulles de l'Ineu: mateixa mida i quadrícula, només canvia el format
async function fulla(rel, dest, qualitat) {
    const src = path.join(ARREL, rel);
    dest = path.join(ARREL, dest);
    const r = await sharp(src).webp({ quality: qualitat, alphaQuality: 100, effort: 6 }).toFile(dest);
    const a = fs.statSync(src).size;
    abans += a; despres += r.size;
    console.log(rel.padEnd(34), mb(a).padStart(9), '->', mb(r.size).padStart(9));
}

// La fulla de l'esquerra és sempre el mirall de la de la dreta (fotograma a fotograma, cel·les de 256): el mateix caminar per als dos costats
async function fullaMirall(rel, dest, qualitat) {
    const CEL = 256, N = 4;
    const src = path.join(ARREL, rel);
    const parts = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        parts.push({ input: await sharp(src).extract({ left: c * CEL, top: r * CEL, width: CEL, height: CEL }).flop().png().toBuffer(), left: c * CEL, top: r * CEL });
    }
    const out = await sharp({ create: { width: CEL * N, height: CEL * N, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(parts)
        .webp({ quality: qualitat, alphaQuality: 100, effort: 6 }).toFile(path.join(ARREL, dest));
    console.log(`${rel} (mirall)`.padEnd(34), mb(out.size).padStart(9));
}

(async () => {
    const nomes = process.argv[2];      // opcional: només aquesta clau del catàleg (p. ex. taverna)
    for (const it of items) if (!nomes || it.key === nomes) await catalog(it);
    if (nomes) return;
    for (const d of ['down', 'up', 'right', 'southwest', 'southeast', 'northwest', 'northeast']) await fulla(`art/ineu/caminar/transparents/${d}.png`, `assets/ineu/${d}.webp`, 90);
    await fullaMirall('art/ineu/caminar/transparents/right.png', 'assets/ineu/left.webp', 90);
    await fulla('art/ineu/caminar/Ineu-iso_walk_right-v2.png', 'assets/ineu/costat.webp', 95);   // té fons blanc: el joc el treu en carregar-la
    console.log('TOTAL', mb(abans), '->', mb(despres));
})();
