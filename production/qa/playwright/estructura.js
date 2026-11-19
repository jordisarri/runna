const { obre } = require('./lib');
const fs = require('fs');
(async () => {
  const { b, p, errs } = await obre();
  const out = {};
  // 1) coherència passos: fet/marca i pistes
  out.passos = await p.evaluate(() => {
    const r = [];
    const n = PROGRES.passos.length;
    for (let i = 0; i <= n; i++) {
      Proves.estatFins(i, false, true, true);
      const E = Estat;
      const fets = PROGRES.passos.map(q => { try { return !!q.fet(E); } catch (e) { return 'ERR ' + e.message; } });
      const mal = [];
      PROGRES.passos.forEach((q, k) => { if (k < i && fets[k] !== true) mal.push('pas ' + k + ' ' + q.id + ' hauria de ser fet'); if (k === i && fets[k] === true) mal.push('pas ' + k + ' ' + q.id + ' ja fet'); if (typeof fets[k] === 'string') mal.push(q.id + ' ' + fets[k]); });
      let pista = null, err = null; try { pista = PROGRES.pista ? PROGRES.pista(E) : (PROGRES.passos[i] && PROGRES.passos[i].pista(E)); } catch (e) { err = e.message; }
      r.push({ i, id: (PROGRES.passos[i] || {}).id, mal, pista: pista && pista.slice(0, 160), err, objectiu: E.objectiu && E.objectiu() && E.objectiu().slice(0, 100) });
    }
    return r;
  });
  // 2) sortides de totes les zones
  out.sortides = await p.evaluate(async () => {
    Proves.estatFins(60, true, true, true);
    const mal = [], zs = Joc.ZONES.slice();
    for (const z of zs) {
      Proves.anar(z, undefined);
      for (let k = 0; k < 40; k++) { await new Promise(r => setTimeout(r, 250)); const s = game.scene.getScene(z); if (s && s.ineu && s.ineu.active && game.scene.isActive(z)) break; }
      const s = game.scene.getScene(z); if (!s) { mal.push(z + ' sense escena'); continue; }
      (s.sortides || []).forEach(q => {
        const d = q.desti; if (!d) return;
        if (!zs.includes(d)) { mal.push(z + ' -> ' + d + ' (zona inexistent)'); return; }
        const t = game.scene.getScene(d); const ent = t && t.config && t.config.entrades;
        if (q.entrada && ent && !(q.entrada in ent) && !/^x_|^ent_/.test(q.entrada)) mal.push(z + ' -> ' + d + ' entrada «' + q.entrada + '» no existeix');
      });
    }
    return mal;
  });
  // 3) connectivitat del graf
  out.graf = await p.evaluate(() => {
    const E = MAPA.enllacos, ids = new Set(Joc.ZONES), adj = {};
    E.forEach(e => { (adj[e[0]] = adj[e[0]] || []).push(e[1]); (adj[e[1]] = adj[e[1]] || []).push(e[0]); });
    const vist = new Set(['ZonaPlaca']), cua = ['ZonaPlaca'];
    while (cua.length) { const x = cua.pop(); (adj[x] || []).forEach(y => { if (!vist.has(y)) { vist.add(y); cua.push(y); } }); }
    return { zonesAmbEnllac: Object.keys(adj).length, noAbastables: [...ids].filter(z => !vist.has(z)) };
  });
  out.errs = errs;
  fs.writeFileSync('C:/tmp/pw/out/estructura.json', JSON.stringify(out, null, 1));
  console.log(JSON.stringify({ passosMal: out.passos.filter(x => x.mal.length || x.err), sortides: out.sortides, graf: out.graf, errs: errs.slice(0, 5) }, null, 1));
  await b.close();
})();
