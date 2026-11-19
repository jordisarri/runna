const { chromium } = require('playwright');
async function obre(opts = {}) {
  const b = await chromium.launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: opts.viewport || { width: 800, height: 600 }, deviceScaleFactor: 1, hasTouch: !!opts.touch, isMobile: !!opts.mobile });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text().slice(0, 300)); });
  p.on('requestfailed', r => errs.push('REQFAIL ' + r.url().slice(-80)));
  p.on('response', r => { if (r.status() >= 400) errs.push('HTTP' + r.status() + ' ' + r.url().slice(-80)); });
  await p.goto('http://localhost:8000/?proves', { waitUntil: 'load' });
  await p.waitForFunction(() => window.game && game.scene && game.scene.getScenes(true).some(s => s.scene.key !== 'Carrega') || (window.Proves && document.body.innerText.includes('Toca')), null, { timeout: 90000 }).catch(() => {});
  await p.waitForTimeout(1500);
  await p.mouse.click(400, 300);
  await p.waitForTimeout(2500);
  return { b, ctx, p, errs };
}
module.exports = { obre };
