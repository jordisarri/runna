const { obre } = require('./lib');
const fs = require('fs');
(async () => {
  const { b, p, errs } = await obre({ viewport: { width: 375, height: 812 }, mobile: true, touch: true });
  const R = {};
  await p.evaluate(() => { Proves.estatFins(12, false, true, true); });
  await p.evaluate(() => Proves.anar('ZonaPlaca', undefined));
  await p.waitForTimeout(6000);
  R.canvas = await p.evaluate(() => { const c = document.querySelector('canvas'); const r = c.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y), vw: innerWidth, vh: innerHeight, scrollX: document.documentElement.scrollWidth > innerWidth }; });
  await p.screenshot({ path: 'C:/tmp/pw/out/mob_joc.png' });
  // obre el pergami d'objectiu amb toc
  R.consells = await p.evaluate(() => { const u = game.scene.getScene('UI'); u.obrirConsells(); return !!u.consellsObert; });
  await p.waitForTimeout(800);
  await p.screenshot({ path: 'C:/tmp/pw/out/mob_consells.png' });
  R.scroll = await p.evaluate(async () => { const u = game.scene.getScene('UI'); const a = u.scrollConsells; u.scrollConsells += 80; return { max: Math.round(u.maxScrollConsells), abans: a }; });
  await p.evaluate(() => { game.scene.getScene('UI').tancarConsells(); });
  // conversa: pare Jorda i zoom
  await p.evaluate(() => { const z = Proves.zonaActiva(); const pt = z.interactius.find(q => q.dialeg); });
  R.errs = errs.filter(e => !/gabia/.test(e));
  console.log(JSON.stringify(R));
  await b.close();
})();
