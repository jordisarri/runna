// Prototip de l'església en vista aèria 3/4 (estil Zelda ALttP / Runna). Fora del joc: tot dibuixat per codi.
// Unitats: tiles de 16 px. Altar a dalt (nord), entrada a baix. Els murs del nord mostren la cara (alçada);
// els murs laterals només es veuen per dalt. Les 3 arcades de cada costat són capelles encastades al mur.
const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
const T = 16;
const $ = id => document.getElementById(id);
const OPT = ['retaule', 'capelles', 'portes', 'etiq', 'bancs', 'catifa'];
const rnd = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// primitives en tiles
function R(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(x * T), Math.round(y * T), Math.round(w * T), Math.round(h * T)); }
function px(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); }
function circ(x, y, r, c) { ctx.beginPath(); ctx.arc(x * T, y * T, r, 0, 7); ctx.fillStyle = c; ctx.fill(); }
function poly(pts, fill, stroke) {
  ctx.beginPath(); pts.forEach((p, k) => k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
}
function line(a, b, col, w = 1) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke(); }
function dot(p, r, col) { ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, 7); ctx.fillStyle = col; ctx.fill(); }

// ---------- Retaule daurat, dibuixat sobre una cara (Pm(u,z) -> pantalla) ----------
function rect(Pm, u0, u1, z0, z1, c) { poly([Pm(u0, z0), Pm(u1, z0), Pm(u1, z1), Pm(u0, z1)], c); }
const ROBES = ['#a83a3a', '#3a5a9a', '#e8e0c8', '#3f7a4a', '#7a3a8a', '#c9863a'];
function figura(Pm, uc, z0, h, w, seed) {
  rect(Pm, uc - w, uc + w, z0, z0 + h * 0.62, ROBES[Math.floor(rnd(seed) * ROBES.length)]);
  const cap = Pm(uc, z0 + h * 0.78); dot(cap, 5, 'rgba(240,200,70,.9)'); dot(cap, 2.4, '#e8c9a0');
}
function niu(Pm, u0, u1, z0, z1, seed, ample) {
  rect(Pm, u0, u1, z0, z1, '#34230d');
  rect(Pm, u0 + (u1 - u0) * .08, u1 - (u1 - u0) * .08, z0 + (z1 - z0) * .05, z1 - (z1 - z0) * .05, '#4d3513');
  figura(Pm, (u0 + u1) / 2, z0 + (z1 - z0) * .1, (z1 - z0) * .8, (u1 - u0) * (ample || .16), seed);
}
function columna(Pm, u0, u1, z0, z1) {
  rect(Pm, u0, u1, z0, z1, '#f2c94a'); rect(Pm, u0, u0 + (u1 - u0) * .35, z0, z1, '#fbe27a');
  const n = Math.max(3, Math.round((z1 - z0) * 2.2));
  for (let k = 0; k < n; k++) { const z = z0 + (z1 - z0) * (k + .5) / n; line(Pm(u0, z - .12), Pm(u1, z + .12), '#a8780f'); }
}
function retaule(Pm, u0, u1, z0, z1, seed) {
  const w = u1 - u0, h = z1 - z0;
  rect(Pm, u0, u1, z0, z1 - h * .12, '#6e4d12');
  rect(Pm, u0, u1, z0, z0 + h * .09, '#d4a22a'); rect(Pm, u0 + w * .02, u1 - w * .02, z0 + h * .02, z0 + h * .07, '#9c6f14');
  const b0 = z0 + h * .09, b1 = z0 + h * .66;
  [[.045, .31], [.355, .645], [.69, .955]].forEach((n, k) => niu(Pm, u0 + w * n[0], u0 + w * n[1], b0 + .05, b1 - .05, seed + k, k === 1 ? .12 : .2));
  [[0, .045], [.31, .355], [.645, .69], [.955, 1]].forEach(c => columna(Pm, u0 + w * c[0], u0 + w * c[1], b0, b1));
  rect(Pm, u0, u1, b1, b1 + h * .05, '#ecc040'); rect(Pm, u0 - w * .01, u1 + w * .01, b1 + h * .05, b1 + h * .065, '#a8780f');
  const t0 = b1 + h * .065, t1 = z0 + h * .9, a = u0 + w * .2, b = u1 - w * .2, ww = b - a;
  niu(Pm, a + ww * .06, a + ww * .31, t0 + .05, t1 - .05, seed + 7); niu(Pm, a + ww * .36, a + ww * .64, t0 + .05, t1 - .05, seed + 8, .12); niu(Pm, a + ww * .69, a + ww * .94, t0 + .05, t1 - .05, seed + 9);
  [[0, .06], [.31, .36], [.64, .69], [.94, 1]].forEach(c => columna(Pm, a + ww * c[0], a + ww * c[1], t0, t1));
  rect(Pm, a - ww * .02, b + ww * .02, t1, t1 + h * .03, '#ecc040');
  const uc = (u0 + u1) / 2;
  poly([Pm(a + ww * .1, t1 + h * .03), Pm(b - ww * .1, t1 + h * .03), Pm(uc, z1 - h * .02)], '#d4a22a', '#8a6210');
  dot(Pm(uc, z1 - h * .05), 3, '#fff2a8');
  for (let k = 0; k < 26; k++) { const u = u0 + w * rnd(seed * 9 + k), z = z0 + h * rnd(seed * 5 + k + 40) * .88, p = Pm(u, z); px(p[0], p[1], 1, 1, 'rgba(255,240,160,.8)'); }
}

// ---------- Personatges vistos des de dalt (3/4) ----------
function persona(x, y, cos, cabell, mirant) {   // x,y = peus en tiles
  const X = x * T, Y = y * T;
  px(X - 5, Y - 1, 10, 3, 'rgba(0,0,0,.28)');
  px(X - 4, Y - 11, 8, 11, cos);
  px(X - 4, Y - 11, 2, 11, 'rgba(0,0,0,.18)');
  dot([X, Y - 14], 4, '#e8c9a0');
  px(X - 4, Y - 18, 8, mirant ? 3 : 5, cabell);
}
function assegut(x, y, cos, cabell) {   // cap i espatlles sobre el respatller
  const X = x * T, Y = y * T;
  px(X - 4, Y - 6, 8, 6, cos); dot([X, Y - 8], 3.6, '#e8c9a0'); px(X - 3.5, Y - 11.5, 7, 4, cabell);
}

// ---------- Escena ----------
function render() {
  const opt = {}; OPT.forEach(k => opt[k] = $('o_' + k).checked);
  const N = +$('r_amp').value, BAYS = 3, BL = +$('r_baia').value, FILES = +$('r_files').value, HF = +$('r_alt').value;
  $('v_files').textContent = FILES; $('v_alt').textContent = HF; $('v_amp').textContent = N; $('v_baia').textContent = BL;
  const D = 3, WT = N + 2 * D, L = BAYS * BL, PRES = 6;      // D: gruix del mur (amb capelles), L: llargada de la nau (sense presbiteri)
  const yF = 1 + HF, yB = yF + PRES + 1, yE = yB + L, TOT = yE - yF;  // yB: on comencen les arcades (just després del graó)                              // y del primer terra i de l'entrada
  cv.width = WT * T; cv.height = (yE + 1.2) * T;
  cv.style.width = cv.width * $('s_zoom').value + 'px';
  const xN0 = D, xN1 = D + N, xc = D + N / 2;
  ctx.fillStyle = '#0d0b09'; ctx.fillRect(0, 0, cv.width, cv.height);

  // --- Terra de la nau (lloses) ---
  for (let y = 0; y < TOT; y++) for (let x = 0; x < N; x++) {
    const pres = y < PRES, c = pres ? ((x + y) % 2 ? '#dcc592' : '#d3bb86') : ((x + y) % 2 ? '#cdb48a' : '#c4aa80');
    R(xN0 + x, yF + y, 1, 1, c);
    if (!pres) { px((xN0 + x) * T, (yF + y) * T, T, 1, 'rgba(60,40,20,.13)'); px((xN0 + x) * T, (yF + y) * T, 1, T, 'rgba(60,40,20,.13)'); }
  }
  // presbiteri: graons
  R(xN0, yF + PRES, N, 0.5, '#e8d6a8'); R(xN0, yF + PRES + 0.5, N, 0.5, '#8f7a52'); R(xN0, yF + PRES + 1, N, 0.15, 'rgba(0,0,0,.25)');

  // --- Mur nord (cara + coronament) ---
  R(0, 0, WT, 1, '#bba77f');                         // part de dalt del mur
  R(0, 0.75, WT, 0.25, '#8f7c55');
  R(0, 1, WT, HF, '#a3303a');                        // cara pintada de vermell
  for (let x = 0; x < WT; x++) for (let y = 0; y < HF; y += 2) px(x * T + 3, (1 + y) * T + 5, 2, 1, 'rgba(0,0,0,.08)');
  R(0, yF - 0.5, WT, 0.5, '#8a2630');                // sòcol
  R(0, 1, WT, 0.35, '#d8c8a0');                      // cornisa
  R(0, 1.35, WT, 0.12, 'rgba(0,0,0,.25)');
  R(0, 0, D, yF, '#bba77f'); R(xN1, 0, D, yF, '#bba77f');
  R(0, 1, D, HF, '#9c8a64'); R(xN1, 1, D, HF, '#9c8a64'); // els costats del nord, en pedra

  // --- Murs laterals (vistos per dalt, amb capelles) ---
  const wallTop = (x0, y0, w, h) => {
    R(x0, y0, w, h, '#bba77f');
    for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) { px((x0 + x) * T, (y0 + y) * T, T, 1, 'rgba(70,50,20,.18)'); px((x0 + x + ((y0 + y) % 2 ? .5 : 0)) * T, (y0 + y) * T, 1, T, 'rgba(70,50,20,.14)'); }
  };
  wallTop(0, yF, D, TOT); wallTop(xN1, yF, D, TOT);
  R(0, yF, 0.35, TOT, '#8f7c55'); R(WT - 0.35, yF, 0.35, TOT, '#8f7c55');
  for (const side of [0, 1]) for (let b = 0; b < BAYS; b++) {
    const by0 = yB + b * BL, y0 = by0 + 1, y1 = by0 + BL - 1, ax = side ? xN1 : 0.6, aw = D - 0.6;
    if (opt.capelles) {
      R(ax, y0 - 0.3, aw, y1 - y0 + 0.6, '#8f7c55');                       // marc de pedra
      R(ax, y0, aw, y1 - y0, '#a8905f');                                  // terra de la capella
      for (let k = 0; k < y1 - y0; k++) for (let m = 0; m < aw; m++) if ((k + Math.floor(m)) % 2) R(ax + m, y0 + k, 1, 1, '#b19966');
      R(ax, y0, aw, 1.3, '#8c2630'); R(ax, y0 + 1.1, aw, .2, '#5a1820');   // cara nord de la capella
      // altar i retaule contra el mur exterior
      const wx = side ? WT - 0.7 : 0.7, dir = side ? -1 : 1;
      R(side ? wx - 0.4 : wx - 0.1, y0 + 1.4, 0.5, y1 - y0 - 1.8, '#d4a22a');
      R(side ? wx - 0.4 : wx - 0.1, y0 + 1.4, 0.18, y1 - y0 - 1.8, '#f2c94a');
      for (let k = 0; k < 3; k++) R((side ? wx - 0.3 : wx), y0 + 1.7 + k * ((y1 - y0 - 2.2) / 3), 0.28, 0.42, '#4d3513');
      R(wx + dir * 0.55 - (side ? .6 : 0), y0 + 1.6, 0.6, y1 - y0 - 2.2, '#f2ecdc');      // altar
      R(wx + dir * 0.55 - (side ? .6 : 0), y0 + 1.6, 0.6, 0.14, '#c8962a');
      circ((wx + dir * 0.85), y0 + 2.1, 3, '#e0b030');
      R(side ? xN1 + .3 : D - 1, y1 - 0.5, 0.7, 0.4, '#7a1c24');                             // agenollador
    } else R(ax, y0, aw, y1 - y0, '#a8905f');
  }
  // pilastres
  for (let k = 0; k <= BAYS; k++) {
    const y = yB + k * BL;
    for (const x0 of [D - 0.45, xN1 - 0.1]) { R(x0, y - 0.5, 0.55, 1, '#d8c8a0'); R(x0 + (x0 < xc ? 0.4 : 0), y - 0.5, 0.15, 1, '#a8956b'); }
  }
  // portes del presbiteri: esquerra = sacristia, dreta = capella petita
  if (opt.portes) [[0, 'Sacristia'], [1, 'Capella']].forEach(([side, nom]) => {
    const y0 = yF + 2.2, h = 2, px0 = side ? xN1 : 0.35, pw = D - 0.35;
    R(px0, y0 - .25, pw, h + .5, '#8f7c55');                                     // marc de pedra
    R(px0, y0, pw, h, '#7d6a48'); R(px0, y0, pw, .5, '#4a3a22');                 // passadís cap a l'altra sala
    const dx = side ? xN1 : D - .3;
    R(dx, y0 - .1, .3, h + .2, '#6b4020'); R(dx + (side ? .1 : 0), y0 - .1, .1, h + .2, '#8a5a30');   // porta de fusta
    px(dx * T + (side ? 2 : 10), (y0 + h / 2) * T, 3, 3, '#e0b030');
    if (opt.etiq) { ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect((side ? xN1 + .2 : .8) * T, (y0 + .6) * T, 2 * T, 12); ctx.fillStyle = '#f0e6c8'; ctx.font = '9px sans-serif'; ctx.fillText(nom, (side ? xN1 + .3 : .9) * T, (y0 + .6) * T + 9); }
  });

  // --- Catifa ---
  if (opt.catifa) {
    const c0 = xc - 1, ys = yF + 1.2, ye = yE;
    R(c0, ys, 2, ye - ys, '#7a1c24'); R(c0 + .2, ys, 1.6, ye - ys, '#a82a34');
    for (let y = ys + .6; y < ye - .3; y += 1.2) { ctx.beginPath(); ctx.moveTo(xc * T, (y - .4) * T); ctx.lineTo((xc + .5) * T, y * T); ctx.lineTo(xc * T, (y + .4) * T); ctx.lineTo((xc - .5) * T, y * T); ctx.fillStyle = '#d8a64a'; ctx.fill(); }
  }

  // --- Mur sud amb porta ---
  R(0, yE, WT, 1, '#bba77f'); R(0, yE + .7, WT, .3, '#8f7c55');
  R(xc - 1.2, yE - .1, 2.4, 1.2, '#4a2a14'); R(xc - 1.2, yE - .1, 2.4, .2, '#d8c8a0');
  line([xc * T, yE * T], [xc * T, (yE + 1.1) * T], '#2a1608'); R(xc - 1.2, yE + 1, 2.4, .2, 'rgba(255,240,180,.35)');

  // --- Retaule major sobre la cara del mur nord ---
  if (opt.retaule) {
    const Pm = (u, z) => [(xN0 + u) * T, yF * T - z * T];
    retaule(Pm, 0.9, N - 0.9, 0, HF - 0.35, 3);
  }

  // --- Objectes del terra, per fondària (y) ---
  const it = []; const add = (y, fn) => it.push({ y, fn });
  const WOOD = ['#8a5a30', '#6b4020', '#5a3318'], ROPES = ['#3a3a4a', '#5a3a3a', '#7a7a8a', '#9a6a4a', '#2a4a3a', '#8a4a6a', '#c9c0a8'];

  add(yF + 2.6, () => { // altar
    const ax = xc - 2, ay = yF + 1.2;
    R(ax, ay, 4, 1.7, '#f6f0e0'); R(ax, ay + 1.45, 4, .3, '#d8cdb2'); R(ax + .1, ay + 1.45, 3.8, .12, '#c8962a');
    R(ax + 1.6, ay + .25, .8, 1, '#c8962a'); R(ax + 1.95, ay + .3, .1, .9, '#7a5a10'); R(ax + 1.75, ay + .6, .5, .1, '#7a5a10');
    for (const dx of [.3, 3.4]) { R(ax + dx, ay - .45, .3, .8, '#e0b030'); circ(ax + dx + .15, ay - .55, 2, '#fff7b0'); }
    for (const [dx, c] of [[-.35, '#d85a8a'], [-.55, '#f0f0f0'], [4.2, '#d85a8a'], [4.4, '#f0f0f0']]) { circ(ax + dx, ay + .6, 4, '#3f7a4a'); circ(ax + dx, ay + .5, 3, c); }
  });
  add(yF + 2.2, () => { R(xN0 + .6, yF + 1.2, 1.4, 1.1, '#a06a3a'); R(xN0 + .6, yF + .8, 1.4, .5, '#8a5a30'); R(xN0 + .6, yF + 2.1, 1.4, .2, '#5a3318'); }); // cadira
  add(yF + 3, () => { // ambó
    R(xN1 - 1.9, yF + 1.6, 1.3, 1.1, '#e0b030'); R(xN1 - 1.9, yF + 2.5, 1.3, .25, '#a07a14'); R(xN1 - 1.75, yF + 1.7, 1, .7, '#f2ecdc');
  });
  [[xN0 + .7, yB + .6], [xN1 - .7, yB + .6]].forEach(([x, y]) => add(y, () => {
    R(x - .35, y - .3, .7, .55, '#9a6a4a'); circ(x, y - .6, 8, '#2f6a3a'); circ(x - .1, y - .9, 6, '#3f8a4a'); circ(x + .15, y - .5, 5, '#234f2c');
  }));

  if (opt.bancs) {
    const blocks = [[xN0 + .5, xc - 1.4], [xc + 1.4, xN1 - .5]];
    for (let r = 0; r < FILES; r++) {
      const y = yB + 1.2 + r * 1.45;
      if (y + 1.1 > yE - .4) break;
      blocks.forEach(([x0, x1], bi) => add(y + 1, () => {
        R(x0, y + .55, x1 - x0, .2, '#4a2a14');                                    // genollera
        R(x0, y, x1 - x0, .55, WOOD[0]); R(x0, y + .5, x1 - x0, .1, WOOD[2]);       // seient
        R(x0, y, .12, .75, WOOD[2]); R(x1 - .12, y, .12, .75, WOOD[2]);            // costats
        R(x0, y - .32, x1 - x0, .38, WOOD[1]); R(x0, y - .32, x1 - x0, .1, WOOD[0]);   // respatller del banc de davant... (a dalt)
      }));
    }
  }
  it.sort((a, b) => a.y - b.y).forEach(o => o.fn());

  // ombres de les parets sobre el terra
  const gl = ctx.createLinearGradient(xN0 * T, 0, (xN0 + 1.2) * T, 0); gl.addColorStop(0, 'rgba(0,0,0,.28)'); gl.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gl; ctx.fillRect(xN0 * T, yF * T, 1.2 * T, TOT * T);
  const gr = ctx.createLinearGradient(xN1 * T, 0, (xN1 - 1.2) * T, 0); gr.addColorStop(0, 'rgba(0,0,0,.28)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gr; ctx.fillRect((xN1 - 1.2) * T, yF * T, 1.2 * T, TOT * T);
  const gt = ctx.createLinearGradient(0, yF * T, 0, (yF + 1.2) * T); gt.addColorStop(0, 'rgba(0,0,0,.3)'); gt.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gt; ctx.fillRect(xN0 * T, yF * T, N * T, 1.2 * T);
}

document.querySelectorAll('#ctl input, #ctl select').forEach(e => e.addEventListener('input', render));
$('b_png').onclick = () => { const a = document.createElement('a'); a.download = 'esglesia.png'; a.href = cv.toDataURL(); a.click(); };
render();
