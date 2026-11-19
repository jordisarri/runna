const { obre } = require('./lib');
const fs = require('fs');
(async () => {
  const { b, p, errs } = await obre();
  await p.evaluate(() => { Proves.estatFins(10, false, true, true); });
  await p.addScriptTag({ content: fs.readFileSync('C:/Users/jordi/runna/production/qa/bot_combat.js', 'utf8') });
  const run = async (nom, expr, tm = 900000) => {
    const t0 = Date.now();
    const r = await p.evaluate(async e => { const x = await eval(e); return x; }, expr);
    console.log(nom, JSON.stringify(r).slice(0, 600), Math.round((Date.now() - t0) / 1000) + 's');
    return r;
  };
  const res = {};
  const jobs = process.argv.slice(2);
  const defs = {
    pastor3: `batch('Pastor 3 cors', () => FF.ESC.pastor(3, 0), 16)`,
    pastor3ing: `batch('Pastor 3 cors ingenu', () => FF.ESC.pastor(3, 0), 6, { ingenu: true })`,
    raim5: `batch('Raim 5 cors', () => FF.ESC.raim(5, 0), 16)`,
    raim5ing: `batch('Raim 5 cors ingenu', () => FF.ESC.raim(5, 0), 6, { ingenu: true })`,
    oce5: `batch('Ocellaire 5 cors', () => FF.ESC.ocellaire(5, 0), 16)`,
    oce6: `batch('Ocellaire 6 cors', () => FF.ESC.ocellaire(6, 0), 16)`,
    oce5ing: `batch('Ocellaire 5 cors ingenu', () => FF.ESC.ocellaire(5, 0), 6, { ingenu: true })`,
  };
  for (const j of jobs) { try { res[j] = await run(j, defs[j]); } catch (e) { console.log(j, 'ERR', e.message.slice(0, 300)); res[j] = { err: e.message }; } }
  fs.writeFileSync('C:/tmp/pw/out/combat_' + jobs.join('_') + '.json', JSON.stringify({ res, errs }, null, 1));
  console.log('errs', errs.length, errs.slice(0, 4));
  await b.close();
})();
