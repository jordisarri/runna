/**
 * En Jusef és dretà (la raqueta a la mà dreta = a l'esquerra de la pantalla quan mira de cara), però els fulls frontals d'AutoSprite el feien esquerrà.
 * Aquest script emmiralla CADA fotograma (256x256) dels fulls frontals de art/pingpong2/ i els deixa a assets/pingpong2/ (sense tocar els originals):
 *   node eines/emmirallar_jusef.js
 * També deixa a art/pingpong2/tmp/ els dos fotogrames emmirallats que serveixen de pose a AutoSprite per generar els girs.
 */
const sharp = require('sharp'), fs = require('fs'), path = require('path');
const A = path.join(__dirname, '..', 'art', 'pingpong2'), S = path.join(__dirname, '..', 'assets', 'pingpong2');
async function emmirallaFull(entrada, sortida, mida = 256) {
  const { data, info } = await sharp(entrada).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const n = info.width / mida, comp = [];
  for (let f = 0; f < n * n; f++) {
    const cel = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).extract({ left: (f % n) * mida, top: Math.floor(f / n) * mida, width: mida, height: mida }).flop().png().toBuffer();
    comp.push({ input: cel, left: (f % n) * mida, top: Math.floor(f / n) * mida });
  }
  await sharp({ create: { width: info.width, height: info.height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(comp).webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile(sortida);
}
async function fotograma(entrada, f, sortida, mirall) {
  let im = sharp(entrada).ensureAlpha().extract({ left: (f % 4) * 256, top: Math.floor(f / 4) * 256, width: 256, height: 256 });
  if (mirall) im = im.flop();
  await im.png().toFile(sortida);
}
(async () => {
  const tmp = path.join(A, 'tmp'); fs.mkdirSync(tmp, { recursive: true });
  if (process.argv[2] === 'poses') {
    await fotograma(path.join(A, 'jusef_dret.png'), 0, path.join(tmp, 'frontal_mirall.png'), true);
    await fotograma(path.join(A, 'jusef_dret_3q.png'), 2, path.join(tmp, 'perfil_drive_mirall.png'), true);
    console.log('poses a', tmp); return;
  }
  for (const n of ['jusef_dret', 'jusef_revers', 'jusef_servei']) { await emmirallaFull(path.join(A, n + '.png'), path.join(S, n + '.webp')); console.log(n); }
})();
