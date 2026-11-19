const { obre } = require('./lib');
const fs = require('fs');
(async () => {
  const { b, p, errs } = await obre();
  const R = {};
  const anar = async (z, ent) => { await p.evaluate(([z, e]) => { const u = game.scene.getScene('UI'); if (u && u.tancarDialeg) try { u.tancarDialeg(); } catch (x) {} Proves.anar(z, e); }, [z, ent]); for (let k = 0; k < 50; k++) { await p.waitForTimeout(300); if (await p.evaluate(z => { const s = game.scene.getScene(z); return !!(s && s.ineu && s.ineu.active && game.scene.isActive(z)); }, z)) break; } await p.waitForTimeout(1500); };
  const sc = () => p.evaluate(() => { const s = game.scene.getScenes(true).find(q => !['UI', 'Carrega'].includes(q.scene.key)); return s ? { z: s.scene.key, x: Math.round(s.ineu.x), y: Math.round(s.ineu.y), simple: s.simple, nSort: (s.sortides || []).length } : null; });
  const prem = async (t, ms) => { await p.keyboard.down(t); await p.waitForTimeout(ms); await p.keyboard.up(t); };
  // A) Rovellonera simplificada
  await p.evaluate(() => { Proves.estatFins(40, true, true, true); Estat.posaFlag('rovResolt'); Estat.posaFlag('llac2'); });
  await anar('ZonaRovellonera', 'cami');
  R.rovSimple = await sc();
  await p.evaluate(() => { const s = game.scene.getScenes(true).find(q => !['UI', 'Carrega'].includes(q.scene.key)); s.ineu.body.reset(800, 950); });
  await prem('ArrowDown', 2500); await p.waitForTimeout(3500);
  R.sortidaBaix = await sc();
  await anar('ZonaRovellonera', 'cami');
  await p.evaluate(() => { const s = game.scene.getScenes(true).find(q => !['UI', 'Carrega'].includes(q.scene.key)); s.ineu.body.reset(1450, 550); });
  await prem('ArrowRight', 2500); await p.waitForTimeout(3500);
  R.sortidaDreta = await sc();
  // sense llac2 -> laberint complet
  await p.evaluate(() => { Proves.estatFins(40, false, true, true); Estat.posaFlag('rovResolt'); Estat.dades.flags && delete Estat.dades.flags.llac2; });
  await anar('ZonaRovellonera', 'cami');
  R.rovSenseLlac = await sc();
  // B) Cartell dialeg: text de la pagina de l'Ineu
  await p.evaluate(() => { Proves.estatFins(40, true, true, true); Estat.posaFlag('rovResolt'); Estat.posaFlag('llac2'); });
  await anar('ZonaRovellonera', 'cami');
  R.cartell = await p.evaluate(() => { const s = game.scene.getScenes(true).find(q => !['UI', 'Carrega'].includes(q.scene.key)); const pt = s.interactius.find(q => Math.abs(q.x - 1330) < 5); if (!pt) return 'sense punt'; const d = typeof pt.dialeg === 'function' ? pt.dialeg(Estat) : pt.dialeg; return d.pagines.map(x => x.qui + ': ' + x.text.slice(0, 90)); });
  // C) Idle HD: mida constant caminant -> aturat, 8 direccions
  await anar('ZonaPlaca', 'inici');
  await p.evaluate(() => { window._mal = []; window._tex = {}; const s = game.scene.getScenes(true).find(q => !['UI', 'Carrega'].includes(q.scene.key)); const S = SPRITE_INEU; game.events.on('prerender', () => { const i = s.ineu; if (!i || !i.active) return; const hd = /^ineu_idle_/.test(i.texture.key) && S.idleHD.dirs.includes(i.texture.key.slice(10)); const e = (S.alcada / (S.alt * S.k)) * (hd ? S.escalaIdleHD : 1); window._tex[i.texture.key] = 1; if (Math.abs(i.scaleX - e) > 1e-4) window._mal.push(i.texture.key + ' ' + i.scaleX.toFixed(3)); }); });
  for (const t of ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']) { await prem(t, 700); await p.waitForTimeout(500); await prem(t, 400); await p.waitForTimeout(400); }
  R.idleHD = await p.evaluate(() => ({ mal: window._mal.length, ex: window._mal.slice(0, 3), textures: Object.keys(window._tex) }));
  // D) Cant del Miracle
  R.cantMiracle = await p.evaluate(() => MELODIES.miracle.notes.join(''));
  R.errs = errs.filter(e => !/gabia\.m4a/.test(e));
  fs.writeFileSync('C:/tmp/pw/out/regress.json', JSON.stringify(R, null, 1));
  console.log(JSON.stringify(R, null, 1));
  await b.close();
})();
