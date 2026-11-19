const { obre } = require('./lib');
const fs = require('fs');
(async () => {
  const { b, p, errs } = await obre();
  await p.evaluate(() => { Proves.estatFins(60, true, true, true); });
  const zones = await p.evaluate(() => Joc.ZONES.slice());
  const res = [];
  for (const z of zones) {
    const n0 = errs.length;
    const t0 = Date.now();
    await p.evaluate(z => { Proves.anar(z, undefined); }, z);
    let ok = false;
    for (let i = 0; i < 40; i++) {
      await p.waitForTimeout(500);
      ok = await p.evaluate(z => { const s = game.scene.getScenes(true).find(s => s.scene.key === z); return !!(s && s.ineu && s.ineu.active); }, z);
      if (ok) break;
    }
    await p.waitForTimeout(1200);
    const info = await p.evaluate(z => {
      const s = game.scene.getScene(z); if (!s || !s.ineu) return null;
      const i = s.ineu, W = s.physics.world.bounds;
      let dins = 0;
      try { (s.obstacles && s.obstacles.getChildren ? s.obstacles.getChildren() : []).forEach(o => { if (o.body && Phaser.Geom.Intersects.RectangleToRectangle(new Phaser.Geom.Rectangle(i.body.x, i.body.y, i.body.width, i.body.height), new Phaser.Geom.Rectangle(o.body.x, o.body.y, o.body.width, o.body.height))) dins++; }); } catch (e) {}
      return { x: Math.round(i.x), y: Math.round(i.y), mon: [W.width, W.height], dins, tex: i.texture.key, nEnemics: (s.enemics || []).length, falt: Grafics.faltants.length };
    }, z);
    await p.screenshot({ path: `/tmp/pw/out/z_${z}.png` });
    res.push({ z, ok, ms: Date.now() - t0, info, errs: errs.slice(n0) });
    console.log(z, ok, JSON.stringify(info), errs.length - n0);
  }
  fs.writeFileSync('/tmp/pw/out/fumada.json', JSON.stringify({ res, errsTotal: errs }, null, 1));
  const f = await p.evaluate(() => Grafics.faltants);
  console.log('FALTANTS', JSON.stringify(f));
  await b.close();
})();
