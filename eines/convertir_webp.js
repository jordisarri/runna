/**
 * Converteix els PNG del catàleg (js/assets.js) a WebP amb pèrdua i transparència.
 *   node eines/convertir_webp.js [clau]     (cal tenir "sharp" instal·lat; amb clau, només aquella imatge)
 * Per a cada imatge: treu el fons blanc (el mateix algorisme que el joc), retalla les vores buides i
 * redueix a l'amplada que el joc usa de debò (amplada * RES). També converteix les fulles de caminar i d'aturat de l'Ineu.
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
    for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
        const p = path.join(ARREL, 'art', stem + '.' + ext);
        if (fs.existsSync(p)) return p;
    }
    return null;
};

const mb = n => (n / 1048576).toFixed(2) + ' MB';
let abans = 0, despres = 0;
const mediana = valors => {
    const ordenats = valors.slice().sort((a, b) => a - b);
    const mig = Math.floor(ordenats.length / 2);
    return ordenats.length % 2 ? ordenats[mig] : (ordenats[mig - 1] + ordenats[mig]) / 2;
};

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

const caminarIneu = {
    down: 'Ineu-avall2',
    up: 'Ineu-amunt2',
    left: 'Ineu-esquerra2',
    right: 'Ineu-dreta2',
    southwest: 'Ineu-diagonal-avall-esquerra2',
    southeast: 'Ineu-diagonal-avall-dreta2',
    northwest: 'Ineu-diagonal-amunt-esquerra2',
    northeast: 'Ineu-diagonal-amunt-dreta2'
};

async function dadesFulla(rel, dest, indicis, files) {
    const src = path.join(ARREL, rel), buffer = fs.readFileSync(src);
    const { width, height } = await sharp(buffer).metadata();
    const cel = 256;
    if (width !== cel * 4 || height !== cel * files) throw new Error(`Mida inesperada per ${rel}: ${width}x${height}`);
    const { data: pixels } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const fotogrames = [];
    for (const index of indicis) {
        const esquerra = (index % 4) * cel, dalt = Math.floor(index / 4) * cel;
        let x0 = cel, y0 = cel, x1 = -1, y1 = -1;
        for (let y = 0; y < cel; y++) for (let x = 0; x < cel; x++) {
            if (pixels[((dalt + y) * width + esquerra + x) * 4 + 3] > 24) {
                if (x < x0) x0 = x;
                if (y < y0) y0 = y;
                if (x > x1) x1 = x;
                if (y > y1) y1 = y;
            }
        }
        if (x1 < 0) throw new Error(`Fotograma transparent: ${rel} #${index}`);
        fotogrames.push({
            index, centreX: (x0 + x1 + 1) / 2, peusY: y1 + 1, altura: y1 - y0 + 1
        });
    }
    return { rel, src, dest, buffer, cel, fotogrames };
}

async function normalitzarFulles(dades, qualitat, alturaObjectiu) {
    const cel = 256, padding = 64, peusObjectiu = 240;
    const escala = alturaObjectiu / mediana(dades.flatMap(f => f.fotogrames.map(frame => frame.altura)));
    const midaEscalada = Math.round((cel + padding * 2) * escala);
    const escalaReal = midaEscalada / (cel + padding * 2);
    for (const fulla of dades) {
        const centreX = mediana(fulla.fotogrames.map(f => f.centreX));
        const peusY = mediana(fulla.fotogrames.map(f => f.peusY));
        const retallX = Math.round((centreX + padding) * escalaReal - cel / 2);
        const retallY = Math.round((peusY + padding) * escalaReal - peusObjectiu);
        const composicio = [];
        for (let i = 0; i < fulla.fotogrames.length; i++) {
            const index = fulla.fotogrames[i].index, x = index % 4, y = Math.floor(index / 4);
            const escalat = await sharp(fulla.buffer)
                .extract({ left: x * cel, top: y * cel, width: cel, height: cel })
                .extend({ top: padding, bottom: padding, left: padding, right: padding, background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .resize(midaEscalada, midaEscalada, { fit: 'fill' })
                .png().toBuffer();
            const frame = await sharp(escalat).extract({ left: retallX, top: retallY, width: cel, height: cel }).png().toBuffer();
            composicio.push({ input: frame, left: (i % 4) * cel, top: Math.floor(i / 4) * cel });
        }
        const resultat = await sharp({
            create: { width: cel * 4, height: cel * 2, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
        }).composite(composicio).webp({ quality: qualitat, alphaQuality: 100, effort: 6 }).toFile(fulla.dest);
        const bytes = fs.statSync(fulla.src).size;
        abans += bytes;
        despres += resultat.size;
        console.log(`${path.basename(fulla.dest)} (${escala.toFixed(3)}x)`.padEnd(34), mb(bytes).padStart(9), '->', mb(resultat.size).padStart(9));
    }
}

async function fullesCaminar(qualitat) {
    const dades = [];
    for (const [dir, nom] of Object.entries(caminarIneu)) {
        dades.push(await dadesFulla(`art/ineu_caminar/${nom}.png`, path.join(ARREL, `assets/ineu/${dir}.webp`), [0, 1, 2, 3, 4, 5, 6, 7], 2));
    }
    await normalitzarFulles(dades, qualitat, 225);
}

async function fullesCostat() {
    const cel = 256, files = 4;
    const fotogrames = [];
    for (let i = 1; i <= 16; i++) {
        const src = path.join(ARREL, 'art', 'ineu_caminar', 'costat', `costat${i}.png`);
        const mida = await sharp(src).metadata();
        if (mida.width !== cel || mida.height !== cel) throw new Error(`Mida inesperada per ${src}: ${mida.width}x${mida.height}`);
        fotogrames.push(await sharp(src).png().toBuffer());
    }

    for (const [dir, mirall] of [['right', false], ['left', true]]) {
        const composicio = await Promise.all(fotogrames.map(async (fotograma, i) => ({
            input: mirall ? await sharp(fotograma).flop().png().toBuffer() : fotograma,
            left: (i % 4) * cel,
            top: Math.floor(i / 4) * cel
        })));
        const dest = path.join(ARREL, `assets/ineu/${dir}.webp`);
        const resultat = await sharp({
            create: { width: cel * 4, height: cel * files, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
        }).composite(composicio).webp({ lossless: true, effort: 6 }).toFile(dest);
        console.log(`${path.basename(dest)} (16 fotogrames, ${mirall ? 'emmirallat' : 'original'})`, mb(resultat.size));
    }
}

const idleIneu = {
    down: 'Ineu-iso_idle_down-v2',
    up: 'Ineu-iso_idle_up-v2',
    right: 'Ineu-iso_idle_right-v2',
    southeast: 'Ineu-iso_idle_southeast-v2',
    northeast: 'Ineu-iso_idle_northeast-v2'
};

(async () => {
    const nomes = process.argv[2];      // opcional: només aquesta clau del catàleg (p. ex. taverna)
    for (const it of items) if (!nomes || it.key === nomes) await catalog(it);
    if (nomes) return;
    await fullesCaminar(85);
    await fullesCostat();
    const idle = [];
    for (const [dir, nom] of Object.entries(idleIneu)) {
        idle.push(await dadesFulla(`art/ineu_idle/${nom}.png`, path.join(ARREL, `assets/ineu/idle_${dir}.webp`), [0, 2, 4, 6, 8, 10, 12, 14], 4));
    }
    await normalitzarFulles(idle, 90, 225);
    console.log('TOTAL', mb(abans), '->', mb(despres));
})();
