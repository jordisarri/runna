const { obre } = require('./lib');
const fs = require('fs');
(async () => {
  const { b, p, errs } = await obre();
  await p.evaluate(() => Proves.estatFins(60, true, true, true));
  const zs = await p.evaluate(() => Joc.ZONES.slice());
  const out = [];
  for (const z of zs) {
    await p.evaluate(z => Proves.anar(z, undefined), z);
    for (let k = 0; k < 40; k++) { await p.waitForTimeout(300); if (await p.evaluate(z => { const s = game.scene.getScene(z); return !!(s && s.ineu && s.ineu.active && game.scene.isActive(z)); }, z)) break; }
    await p.waitForTimeout(800);
    const r = await p.evaluate(() => { try {
      const s = game.scene.getScenes(true).find(q => !['UI', 'Carrega'].includes(q.scene.key));
      const I = s.ineu, W = s.physics.world.bounds, C = 12, bw = I.body.width, bh = I.body.height;
      const obs = [];
      s.obstacles.getChildren().forEach(o => { const bd = o.body; if (bd && bd.enable !== false) obs.push([bd.x, bd.y, bd.x + bd.width, bd.y + bd.height]); });
      const ok = (cx, cy) => {
        const x0 = cx - bw / 2, y0 = cy - bh / 2, x1 = cx + bw / 2, y1 = cy + bh / 2;
        if (x0 < W.x || y0 < W.y || x1 > W.right || y1 > W.bottom) return false;
        for (const o of obs) if (x0 < o[2] && x1 > o[0] && y0 < o[3] && y1 > o[1]) return false;
        return true;
      };
      const nx = Math.ceil(W.width / C), ny = Math.ceil(W.height / C);
      const vis = new Uint8Array(nx * ny);
      const sx = Math.round((I.body.center.x - W.x) / C), sy = Math.round((I.body.center.y - W.y) / C);
      if (sx < 0 || sy < 0 || sx >= nx || sy >= ny) return { err: 'spawn fora' };
      const cua = [sy * nx + sx]; vis[cua[0]] = 1; let n = 0, spawnOk = ok(I.body.center.x, I.body.center.y);
      while (cua.length) { const c = cua.pop(); n++; const cx = c % nx, cy = (c / nx) | 0;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const X = cx + dx, Y = cy + dy; if (X < 0 || Y < 0 || X >= nx || Y >= ny) continue; const k = Y * nx + X; if (vis[k]) continue; if (!ok(X * C + W.x, Y * C + W.y)) continue; vis[k] = 1; cua.push(k); } }
      const toca = (rect) => { for (let y = Math.max(0, ((rect.y - bh - W.y) / C) | 0); y <= Math.min(ny - 1, ((rect.bottom + bh - W.y) / C) | 0); y++) for (let x = Math.max(0, ((rect.x - bw - W.x) / C) | 0); x <= Math.min(nx - 1, ((rect.right + bw - W.x) / C) | 0); x++) { if (!vis[y * nx + x]) continue; const px = x * C + W.x, py = y * C + W.y; if (px + bw / 2 > rect.x && px - bw / 2 < rect.right && py + bh / 2 > rect.y && py - bh / 2 < rect.bottom) return true; } return false; };
      const prop = (px, py, rad) => { for (let y = Math.max(0, ((py - rad - W.y) / C) | 0); y <= Math.min(ny - 1, ((py + rad - W.y) / C) | 0); y++) for (let x = Math.max(0, ((px - rad - W.x) / C) | 0); x <= Math.min(nx - 1, ((px + rad - W.x) / C) | 0); x++) { if (!vis[y * nx + x]) continue; if (Math.hypot(x * C + W.x - px, y * C + W.y - py) <= rad) return true; } return false; };
      const malSort = [], malPunts = [];
      (s.sortides || []).forEach((q, i) => { if (q.desarmada) return; if (!toca(q.r)) malSort.push(`${q.desti}/${q.entrada} @${Math.round(q.r.x)},${Math.round(q.r.y)} ${Math.round(q.r.width)}x${Math.round(q.r.height)}`); });
      (s.interactius || []).forEach(q => { if (q.actiu && !q.actiu()) return; if (!prop(q.x, q.y, Math.max(q.radi || 60, 40))) malPunts.push(`@${Math.round(q.x)},${Math.round(q.y)} r${q.radi}`); });
      return { cel: n, spawnOk, malSort, malPunts, nSort: (s.sortides || []).length, nPunts: (s.interactius || []).length, nObs: obs.length };
    } catch (e) { return { err: String(e.message) }; } });
    out.push({ z, r });
    if (r.err || !r.spawnOk || (r.malSort && r.malSort.length) || (r.malPunts && r.malPunts.length)) console.log(z, JSON.stringify(r));
  }
  fs.writeFileSync('C:/tmp/pw/out/abast.json', JSON.stringify(out, null, 1));
  console.log('fet', out.length, 'errs', errs.length);
  await b.close();
})();
