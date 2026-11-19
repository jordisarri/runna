const { obre } = require('./lib');
(async () => {
  const { b, p, errs } = await obre();
  const anar = async z => { await p.evaluate(z => Proves.anar(z, undefined), z); for (let k = 0; k < 40; k++) { await p.waitForTimeout(300); if (await p.evaluate(z => { const s = game.scene.getScene(z); return !!(s && s.ineu && s.ineu.active && game.scene.isActive(z)); }, z)) break; } await p.waitForTimeout(1500); };
  await p.evaluate(() => { Proves.estatFins(30, false, true, true); });
  await anar('ZonaHostatgeriaInt');
  await p.evaluate(() => { const s = game.scene.getScenes(true).find(q => !['UI', 'Carrega'].includes(q.scene.key)); s.ineu.body.reset(s.estatua.x - 70, 136); });
  await p.keyboard.down('ArrowRight');
  for (let i = 0; i < 6; i++) { await p.waitForTimeout(700); console.log(JSON.stringify(await p.evaluate(() => { const s = game.scene.getScenes(true).find(q => !['UI', 'Carrega'].includes(q.scene.key)); const u = game.scene.getScene('UI'); return { ex: s.estatua && s.estatua.x, empentaMs: Math.round(s.empentaMs), dir: s.dirEstatua, fet: s.fetEstatua, intent: s.intent, ix: Math.round(s.ineu.x), iy: Math.round(s.ineu.y), guants: Estat.te('guants'), dlg: !!u.dialeg, vx: s.ineu.body.velocity.x, bloq: !!(s.cinema || s.canviant), refet: Estat.flag('refetorObert') }; }))); }
  await p.keyboard.up('ArrowRight');
  await b.close();
})();
