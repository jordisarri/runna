/**
 * Converteix les dues Fonts del Bisbe (art/objectes/font_sj.png i font_sj_neta.png) a WebP amb el MATEIX retall i la mateixa escala,
 * perquè en canviar de l'una a l'altra (transicioFont, js/zones/nord.js) la roca i la pica no es moguin ni canviïn de mida.
 *   node eines/convertir_font_sj.js     (cal "sharp")
 */
const fs = require('fs'), path = require('path'), vm = require('vm');
const sharp = require('sharp');
const ARREL = path.join(__dirname, '..');
const font = fs.readFileSync(path.join(ARREL, 'js/assets.js'), 'utf8');
const ctx = {};
vm.runInNewContext(font.slice(font.indexOf('function treureFonsBlanc'), font.indexOf('// ---------- Dibuixos provisionals')) + '; this.f = treureFonsBlanc;', ctx);

(async () => {
    const dades = [];
    for (const nom of ['font_sj', 'font_sj_neta']) {
        const { data, info } = await sharp(path.join(ARREL, 'art/objectes', nom + '.png')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
        ctx.f(data, info.width, info.height);
        let x0 = info.width, y0 = info.height, x1 = -1, y1 = -1;
        for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) if (data[(y * info.width + x) * 4 + 3] > 24) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
        dades.push({ nom, data, info, x0, y0, x1, y1 });
    }
    // Caixa comuna (unió dels dos contorns), amb 2 px de marge
    const X0 = Math.min(...dades.map(d => d.x0)) - 2, Y0 = Math.min(...dades.map(d => d.y0)) - 2;
    const X1 = Math.max(...dades.map(d => d.x1)) + 2, Y1 = Math.max(...dades.map(d => d.y1)) + 2;
    const w = X1 - X0 + 1, h = Y1 - Y0 + 1, AMPLE = 190 * 2;
    console.log('caixa comuna', X0, Y0, w, h, 'escala', AMPLE / w);
    for (const d of dades) {
        const r = await sharp(d.data, { raw: { width: d.info.width, height: d.info.height, channels: 4 } }).extract({ left: X0, top: Y0, width: w, height: h })
            .resize({ width: AMPLE, kernel: 'lanczos3' }).webp({ quality: 85, alphaQuality: 100, effort: 6, smartSubsample: true }).toFile(path.join(ARREL, 'assets/objectes', d.nom + '.webp'));
        console.log(d.nom, r.width + 'x' + r.height);
    }
})();
