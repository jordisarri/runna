/**
 * Converteix les fulles de l'Ineu amb fons blanc (art/ineu/caminar/Ineu-iso_walk_<dir>-v1.png)
 * en PNG amb fons transparent a art/ineu/caminar/transparents/<dir>.png.
 * Cal tenir el joc servit (python serveix.py) i puppeteer-core:  node eines/netejar_ineu.js
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const src = fs.readFileSync(root + '/js/assets.js', 'utf8');
const i0 = src.indexOf('function treureFonsBlanc');
const m = src.slice(i0, src.indexOf('// ---------- Dibuixos provisionals', i0));
const noms = ['down', 'up', 'left', 'right', 'southwest', 'southeast', 'northwest', 'northeast'];
(async () => {
    const exe = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
    const b = await puppeteer.launch({ executablePath: exe, headless: 'new', args: ['--no-sandbox'] });
    const p = await b.newPage();
    await p.goto('http://localhost:8000/index.html');
    await p.evaluate(m);
    fs.mkdirSync(root + '/art/ineu/caminar/transparents', { recursive: true });
    for (const n of noms) {
        const url = await p.evaluate(async (n) => {
            const img = new Image(); img.src = `/art/ineu/caminar/Ineu-iso_walk_${n}-v1.png`;
            await img.decode();
            const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
            const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
            const d = ctx.getImageData(0, 0, c.width, c.height);
            treureFonsBlanc(d.data, c.width, c.height);
            ctx.putImageData(d, 0, 0);
            return c.toDataURL('image/png');
        }, n);
        fs.writeFileSync(`${root}/art/ineu/caminar/transparents/${n}.png`, Buffer.from(url.split(',')[1], 'base64'));
        console.log('ok', n);
    }
    await b.close();
})();
