/**
 * ELS PERSONATGES DEL CELLER (ping-pong): Frederic, Eloi, Josep i Juli, tots en estil xibi (cap gran, cos petit) i amb molt de detall.
 *  - Frederic: senyor alt i panxut d'uns 50 anys, amb molt de cabell, ulleres i la pala de pedra.
 *  - Eloi: atleta alt i musculós.
 *  - Josep: una mena de gurú alt i prim, amb ulleres, cabell curt i barba taronges.
 *  - Juli: cap enorme, ulleres i molt prim; porta la samarreta dels angelets.
 * Cada funció pinta en un llenç de 100 unitats d'ample (ctx ja escalat); dibuixarNpcPingpong ho prepara per al catàleg d'assets.
 */

const PP_PROPORCIO = { frederic: 1.54, eloi: 1.58, josep: 1.52, juli: 1.44 };

function dibuixarNpcPingpong(c, w, qui, opts) {
    const asp = PP_PROPORCIO[qui];
    c.width = w; c.height = Math.round(w * asp);
    const ctx = c.getContext('2d');
    ctx.scale(w / 100, w / 100);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    PP_FN[qui](ctx, 100, 100 * asp, opts);
}

const PP_C = '#140a04';
const PP_PELL = '#f4cba2', PP_PELL_OMBRA = '#dba378';

function ppEl(ctx, x, y, rx, ry, fill, traç = true, rot = 0) {
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (traç) { ctx.strokeStyle = PP_C; ctx.lineWidth = 2.2; ctx.stroke(); }
}
function ppRect(ctx, x, y, w, h, fill, r = 3, traç = true) {
    ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (traç) { ctx.strokeStyle = PP_C; ctx.lineWidth = 2.2; ctx.stroke(); }
}
function ppOmbraTerra(ctx, x, y, rx) { ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.beginPath(); ctx.ellipse(x, y, rx, rx * 0.17, 0, 0, Math.PI * 2); ctx.fill(); }
function ppGradV(ctx, y0, y1, a, b) { const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, a); g.addColorStop(1, b); return g; }
function ppGradH(ctx, x0, x1, a, b, m) { const g = ctx.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, a); if (m) g.addColorStop(0.5, m); g.addColorStop(1, b); return g; }

// Ull gran de dibuix animat: escleròtica, iris, pupil i dos reflexos
function ppUll(ctx, x, y, rx, ry, iris = '#3a2a1e', mirada = 0) {
    ppEl(ctx, x, y, rx, ry, '#ffffff');
    ctx.fillStyle = iris; ctx.beginPath(); ctx.ellipse(x + mirada, y + 0.4, rx * 0.62, ry * 0.78, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0c0806'; ctx.beginPath(); ctx.ellipse(x + mirada, y + 0.6, rx * 0.36, ry * 0.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x + mirada - rx * 0.22, y - ry * 0.3, rx * 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + mirada + rx * 0.2, y + ry * 0.25, rx * 0.1, 0, Math.PI * 2); ctx.fill();
}
function ppCella(ctx, x0, y0, x1, y1, color, gruix = 2.6) {
    ctx.strokeStyle = color; ctx.lineWidth = gruix; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2, Math.min(y0, y1) - 2, x1, y1); ctx.stroke();
}
function ppMans(ctx, x, y, r = 4.6) { ppEl(ctx, x, y, r, r * 1.05, PP_PELL); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.3, 0, Math.PI * 2); ctx.fill(); }
function ppRubor(ctx, x, y, rx, ry) { ctx.fillStyle = 'rgba(232,110,100,0.32)'; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); }
function ppCap(ctx, cx, cy, rx, ry, extra = {}) {            // cap de pell amb ombra suau i orelles
    [-1, 1].forEach(s => { ppEl(ctx, cx + s * (rx - 1), cy + 2, 5, 7, PP_PELL); ctx.strokeStyle = 'rgba(180,100,80,0.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx + s * (rx - 1), cy + 2, 2.2, 0, Math.PI * 2); ctx.stroke(); });
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    const g = ctx.createRadialGradient(cx - rx * 0.3, cy - ry * 0.4, 3, cx, cy, Math.max(rx, ry) * 1.05); g.addColorStop(0, '#fbdcb8'); g.addColorStop(0.7, PP_PELL); g.addColorStop(1, PP_PELL_OMBRA);
    ctx.fillStyle = extra.fons || g; ctx.fill(); ctx.strokeStyle = PP_C; ctx.lineWidth = 2.4; ctx.stroke();
}

// ---------------------------------------------------------------------------------------------
const PP_FN = {};

// FREDERIC: senyor alt i ben panxut d'uns 50 anys, amb molt de cabell gris, ulleres rectangulars, jersei de ratlles, tirants i pala de pedra
PP_FN.frederic = (ctx, W, H) => {
    ppOmbraTerra(ctx, 50, H - 6, 34);
    // cames llargues de pantaló gris i sabates
    [[37], [63]].forEach(([x]) => { ppRect(ctx, x - 8.5, H - 62, 17, 50, ppGradH(ctx, x - 8.5, x + 8.5, '#5a5a66', '#34343c'), 4); ppEl(ctx, x + (x < 50 ? -1 : 1), H - 9, 12, 6, '#6a4220'); });
    // cos: jersei de ratlles amb una panxa ben rodona que penja sobre el cinturó
    const cos = new Path2D(); cos.moveTo(23, 62); cos.quadraticCurveTo(7, 90, 13, 106); cos.quadraticCurveTo(19, 128, 50, 129); cos.quadraticCurveTo(81, 128, 87, 106); cos.quadraticCurveTo(93, 90, 77, 62); cos.closePath();
    ctx.fillStyle = ppGradH(ctx, 12, 88, '#6a8a9a', '#4a6a7a', '#7a9aaa'); ctx.fill(cos); ctx.strokeStyle = PP_C; ctx.lineWidth = 2.4; ctx.stroke(cos);
    ctx.save(); ctx.clip(cos); ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 3; for (let y = 70; y < 130; y += 9) { ctx.beginPath(); ctx.moveTo(8, y); ctx.quadraticCurveTo(50, y + 8, 92, y); ctx.stroke(); }
    ctx.fillStyle = 'rgba(0,0,0,0.13)'; ctx.beginPath(); ctx.ellipse(50, 116, 34, 14, 0, 0, Math.PI); ctx.fill();               // ombra sota la panxa
    ctx.fillStyle = 'rgba(255,255,255,0.14)'; ctx.beginPath(); ctx.ellipse(36, 98, 8, 16, 0.3, 0, Math.PI * 2); ctx.fill(); ctx.restore();   // llum a la panxa
    ctx.fillStyle = '#f2ecdc'; ctx.beginPath(); ctx.moveTo(40, 60); ctx.lineTo(50, 74); ctx.lineTo(60, 60); ctx.closePath(); ctx.fill(); ctx.strokeStyle = PP_C; ctx.lineWidth = 2; ctx.stroke();   // coll de la camisa
    ctx.strokeStyle = '#8a2a2a'; ctx.lineWidth = 4; [-18, 18].forEach(dx => { ctx.beginPath(); ctx.moveTo(50 + dx, 64); ctx.quadraticCurveTo(50 + dx * 1.5, 96, 50 + dx * 1.3, 119); ctx.stroke(); });
    [-18, 18].forEach(dx => ppEl(ctx, 50 + dx * 1.3, 119, 2.6, 2.6, '#d4a840'));
    ppRect(ctx, 30, 121, 40, 5, '#3a2a1a', 2);                                                                                   // cinturó
    // braços (màniques arremangades) i mans; la dreta duu la pala de pedra
    ppRect(ctx, 3, 64, 17, 36, ppGradH(ctx, 3, 20, '#f2ecdc', '#c8c0aa'), 8); ppMans(ctx, 11, 106, 5.6);
    ppRect(ctx, 80, 64, 17, 36, ppGradH(ctx, 80, 97, '#f2ecdc', '#c8c0aa'), 8);
    ctx.save(); ctx.translate(90, 100); ctx.rotate(-0.16);
    ppRect(ctx, -3, -4, 6, 26, ppGradH(ctx, -3, 3, '#a67442', '#5a3418'), 2);
    ctx.fillStyle = ppGradV(ctx, -44, -4, '#b8b8b0', '#7a7a74'); ctx.beginPath(); ctx.ellipse(0, -24, 15, 19, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = PP_C; ctx.lineWidth = 2.4; ctx.stroke();
    ctx.strokeStyle = 'rgba(60,60,56,0.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-8, -34); ctx.lineTo(-2, -26); ctx.lineTo(-6, -18); ctx.moveTo(6, -30); ctx.lineTo(10, -22); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(-5, -32, 4, 7, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ppMans(ctx, 89, 102, 5.6);
    // cap rodó amb papada
    ppCap(ctx, 50, 38, 29, 26);
    ppEl(ctx, 50, 60, 18, 6, 'rgba(210,150,120,0.55)', false);
    // cabellera gris abundant: monyo de voluta al damunt, serrell ondulat i patilles
    ctx.fillStyle = '#b6b6bc'; ctx.strokeStyle = PP_C; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(21, 42); ctx.quadraticCurveTo(14, 18, 30, 8); ctx.quadraticCurveTo(40, -1, 52, 3); ctx.quadraticCurveTo(66, -2, 74, 9); ctx.quadraticCurveTo(88, 18, 79, 42);
    ctx.quadraticCurveTo(78, 30, 70, 24); ctx.quadraticCurveTo(62, 28, 56, 22); ctx.quadraticCurveTo(46, 28, 38, 22); ctx.quadraticCurveTo(28, 28, 26, 36); ctx.quadraticCurveTo(22, 36, 21, 42); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 1.4; [[28, 14, 40, 8], [44, 8, 58, 6], [60, 8, 72, 12]].forEach(([a, b, c2, d]) => { ctx.beginPath(); ctx.moveTo(a, b + 6); ctx.quadraticCurveTo((a + c2) / 2, d - 4, c2, d + 5); ctx.stroke(); });
    ctx.strokeStyle = 'rgba(90,90,100,0.5)'; ctx.lineWidth = 1; [[24, 20], [34, 14], [50, 10], [66, 14], [76, 20]].forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 2, y + 8, x - 1, y + 14); ctx.stroke(); });
    // cara
    ppRubor(ctx, 35, 52, 6, 3.6); ppRubor(ctx, 65, 52, 6, 3.6);
    ppUll(ctx, 41, 43, 4.4, 4.8, '#5a3a22', 0.4); ppUll(ctx, 59, 43, 4.4, 4.8, '#5a3a22', -0.4);
    ppCella(ctx, 34, 35, 47, 34, '#8a8a90', 3.2); ppCella(ctx, 53, 34, 66, 35, '#8a8a90', 3.2);
    ppEl(ctx, 50, 52, 4.6, 3.8, '#eab090');
    ctx.strokeStyle = '#9a9aa0'; ctx.lineWidth = 2.8; ctx.beginPath(); ctx.moveTo(44, 57); ctx.quadraticCurveTo(50, 54, 56, 57); ctx.stroke();                                              // bigoti gris
    ctx.strokeStyle = PP_C; ctx.lineWidth = 2; ctx.fillStyle = '#7a2a2a'; ctx.beginPath(); ctx.moveTo(41, 59); ctx.quadraticCurveTo(50, 68, 59, 59); ctx.quadraticCurveTo(50, 61, 41, 59); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#4a2a14'; ctx.lineWidth = 2.6; ctx.fillStyle = 'rgba(190,225,255,0.22)';
    [[30, 36], [52, 36]].forEach(([x, y]) => { ctx.beginPath(); ctx.roundRect(x, y, 19, 14, 3); ctx.fill(); ctx.stroke(); });
    ctx.beginPath(); ctx.moveTo(49, 42); ctx.lineTo(52, 42); ctx.stroke(); ctx.beginPath(); ctx.moveTo(30, 41); ctx.lineTo(23, 39); ctx.moveTo(71, 41); ctx.lineTo(77, 39); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(33, 38, 4, 2); ctx.fillRect(55, 38, 4, 2);
};

// ELOI: atleta alt i musculós; esquena ampla, bíceps grossos, samarreta de tirants vermella, diadema i vambraces
PP_FN.eloi = (ctx, W, H) => {
    ppOmbraTerra(ctx, 50, H - 6, 36);
    // cames musculoses (pantorrilles) i sabatilles
    [[36], [64]].forEach(([x]) => {
        ppRect(ctx, x - 8, H - 50, 16, 40, ppGradH(ctx, x - 8, x + 8, '#f0bf92', '#c88a5e', '#f8cfa4'), 6);
        ppEl(ctx, x + (x < 50 ? -3 : 3), H - 32, 7.4, 8, 'rgba(180,100,60,0.3)', false);
        ppRect(ctx, x - 8, H - 24, 16, 8, '#f2f2f2', 3);
        ppRect(ctx, x - 12, H - 14, 24, 11, ppGradV(ctx, H - 14, H - 3, '#ffffff', '#c8c8d0'), 5);
        ctx.fillStyle = '#c02828'; ctx.fillRect(x - 10, H - 9, 20, 3);
    });
    // pantaló curt negre amb franges
    ctx.fillStyle = ppGradV(ctx, 96, H - 52, '#2a2a34', '#14141a'); ctx.strokeStyle = PP_C; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(30, 98); ctx.lineTo(70, 98); ctx.lineTo(76, H - 50); ctx.lineTo(54, H - 50); ctx.lineTo(50, 112); ctx.lineTo(46, H - 50); ctx.lineTo(24, H - 50); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#c02828'; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(27, 102); ctx.lineTo(25, H - 52); ctx.moveTo(73, 102); ctx.lineTo(75, H - 52); ctx.stroke();
    // tors en V: espatlles amples i cintura estreta
    const tors = new Path2D(); tors.moveTo(14, 58); tors.quadraticCurveTo(50, 50, 86, 58); tors.lineTo(70, 102); tors.lineTo(30, 102); tors.closePath();
    ctx.fillStyle = ppGradH(ctx, 14, 86, '#d82e2e', '#9a1a1a', '#ee4040'); ctx.fill(tors); ctx.strokeStyle = PP_C; ctx.lineWidth = 2.4; ctx.stroke(tors);
    ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.moveTo(40, 80); ctx.quadraticCurveTo(50, 90, 60, 80); ctx.lineTo(58, 102); ctx.lineTo(42, 102); ctx.closePath(); ctx.fill();   // volum d'abdominals
    ctx.fillStyle = '#f2f2f2'; ctx.beginPath(); ctx.moveTo(34, 56); ctx.quadraticCurveTo(50, 70, 66, 56); ctx.lineTo(62, 54); ctx.quadraticCurveTo(50, 62, 38, 54); ctx.closePath(); ctx.fill(); ctx.strokeStyle = PP_C; ctx.lineWidth = 1.6; ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 3; ctx.font = 'bold 14px sans-serif'; ctx.fillStyle = '#f8f8f8'; ctx.textAlign = 'center'; ctx.fillText('7', 50, 86); ctx.textAlign = 'start';
    // colls de pectorals i espatlles (pell)
    ppEl(ctx, 50, 52, 9, 7, PP_PELL, false);
    // braços: bíceps enormes i avantbraços amb vambraces
    [[-1], [1]].forEach(([s]) => {
        const x = 50 + s * 36;
        ppEl(ctx, x, 70, 10, 18, ppGradH(ctx, x - 11, x + 11, '#f6c89c', '#c88a5e', '#fbd6ae'));
        ppEl(ctx, x - s * 2, 66, 6.5, 8, 'rgba(255,255,255,0.22)', false);           // llum al bíceps
        ctx.strokeStyle = 'rgba(160,90,60,0.6)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x - 5, 76); ctx.quadraticCurveTo(x, 80, x + 5, 76); ctx.stroke();
        ppRect(ctx, x - 7, 82, 14, 18, ppGradH(ctx, x - 7, x + 7, '#f0bf92', '#c88a5e'), 6);
        ppRect(ctx, x - 8, 94, 16, 7, '#f2f2f2', 3);                                    // vambrace
        ppMans(ctx, x, 106, 6);
    });
    // pala de ping-pong a la mà dreta
    ctx.save(); ctx.translate(88, 106); ctx.rotate(0.12);
    ppRect(ctx, -2.4, -2, 5, 16, '#a67442', 2);
    ctx.fillStyle = ppGradV(ctx, -32, -2, '#d83a3a', '#8a1a1a'); ctx.beginPath(); ctx.ellipse(0, -16, 9, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = PP_C; ctx.lineWidth = 2.2; ctx.stroke();
    ctx.restore();
    // coll gruixut i cap més petit (és alt), mandíbula quadrada
    ppRect(ctx, 41, 46, 18, 12, PP_PELL_OMBRA, 4);
    ppCap(ctx, 50, 30, 21, 20);
    ctx.fillStyle = 'rgba(214,150,110,0.45)'; ctx.beginPath(); ctx.moveTo(32, 38); ctx.quadraticCurveTo(50, 56, 68, 38); ctx.quadraticCurveTo(50, 44, 32, 38); ctx.fill();   // mandíbula
    // cabell negre curt i punxós + diadema blanca i vermella
    ctx.fillStyle = '#1e1a1e'; ctx.strokeStyle = PP_C; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(29, 28); ctx.lineTo(30, 14); ctx.lineTo(35, 17); ctx.lineTo(38, 8); ctx.lineTo(44, 14); ctx.lineTo(50, 6); ctx.lineTo(56, 14); ctx.lineTo(62, 8); ctx.lineTo(65, 17); ctx.lineTo(70, 14); ctx.lineTo(71, 28); ctx.quadraticCurveTo(50, 18, 29, 28); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f2f2f2'; ctx.beginPath(); ctx.moveTo(29, 27); ctx.quadraticCurveTo(50, 17, 71, 27); ctx.lineTo(71, 32); ctx.quadraticCurveTo(50, 22, 29, 32); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#c02828'; ctx.beginPath(); ctx.moveTo(29, 29); ctx.quadraticCurveTo(50, 19, 71, 29); ctx.lineTo(71, 30.5); ctx.quadraticCurveTo(50, 20.5, 29, 30.5); ctx.closePath(); ctx.fill();
    // cara decidida: celles gruixudes, ulls petits, somriure ample amb dents
    ppUll(ctx, 42, 34, 3.4, 3.8, '#2a2a3a', 0.3); ppUll(ctx, 58, 34, 3.4, 3.8, '#2a2a3a', -0.3);
    ctx.strokeStyle = '#1e1a1e'; ctx.lineWidth = 3.2; ctx.beginPath(); ctx.moveTo(36, 30); ctx.lineTo(46, 31); ctx.moveTo(54, 31); ctx.lineTo(64, 30); ctx.stroke();
    ppEl(ctx, 50, 40, 3, 2.4, '#e6a47e');
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = PP_C; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(40, 44); ctx.quadraticCurveTo(50, 53, 60, 44); ctx.quadraticCurveTo(50, 46, 40, 44); ctx.fill(); ctx.stroke();
    ppRubor(ctx, 34, 40, 4.4, 2.8); ppRubor(ctx, 66, 40, 4.4, 2.8);
};

// JOSEP: gurú tranquil, alt i prim; cabell curt i barba taronges, ulleres rodones, túnica porpra estreta, collaret de boles i una pilota que levita
PP_FN.josep = (ctx, W, H, opts = {}) => {
    const halo = ctx.createRadialGradient(50, 36, 6, 50, 36, 44); halo.addColorStop(0, 'rgba(255,226,150,0.36)'); halo.addColorStop(1, 'rgba(255,226,150,0)');
    ctx.fillStyle = halo; ctx.fillRect(0, 0, W, 90);
    ppOmbraTerra(ctx, 50, H - 6, 28);
    const NAR = '#d8662a';
    // túnica llarga i estreta, amb vora daurada i plecs
    const roba = new Path2D(); roba.moveTo(36, 66); roba.quadraticCurveTo(50, 60, 64, 66); roba.lineTo(72, H - 10); roba.quadraticCurveTo(50, H - 4, 28, H - 10); roba.closePath();
    ctx.fillStyle = ppGradH(ctx, 28, 72, '#5a2a6a', '#3a1a4a', '#7a3a8a'); ctx.fill(roba); ctx.strokeStyle = PP_C; ctx.lineWidth = 2.4; ctx.stroke(roba);
    ctx.save(); ctx.clip(roba); ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 1.4; [-12, -5, 0, 5, 12].forEach(dx => { ctx.beginPath(); ctx.moveTo(50 + dx * 0.4, 72); ctx.quadraticCurveTo(50 + dx * 1.1, 110, 50 + dx * 1.6, H - 8); ctx.stroke(); }); ctx.restore();
    ctx.strokeStyle = '#d4a840'; ctx.lineWidth = 3.2; ctx.beginPath(); ctx.moveTo(28, H - 12); ctx.quadraticCurveTo(50, H - 6, 72, H - 12); ctx.stroke();
    ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(50, 64); ctx.lineTo(50, H - 8); ctx.stroke();
    ppRect(ctx, 38, 98, 24, 5, '#e8c860', 2);                                  // cinturó de tela
    // sandàlies
    [[41], [59]].forEach(([x]) => ppRect(ctx, x - 7, H - 10, 14, 7, '#8a5a2c', 3));
    if (!opts.senseBraços) {                                                   // (al partit els braços i la pala es dibuixen a part i es mouen)
    // mànigues estretes i mans juntes davant amb la pilota que levita
    [[-1], [1]].forEach(([s]) => {
        ctx.fillStyle = ppGradH(ctx, 50 + s * 6, 50 + s * 24, '#4a2258', '#6a3278'); ctx.strokeStyle = PP_C; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(50 + s * 14, 68); ctx.quadraticCurveTo(50 + s * 28, 82, 50 + s * 12, 106); ctx.lineTo(50 + s * 3, 104); ctx.quadraticCurveTo(50 + s * 16, 82, 50 + s * 11, 69); ctx.closePath(); ctx.fill(); ctx.stroke();
    });
    ppMans(ctx, 46, 106, 4.2); ppMans(ctx, 54, 106, 4.2);
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#ffd870'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(50, 94, 4.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,230,140,0.4)'; ctx.beginPath(); ctx.arc(50, 94, 8.6, 0, Math.PI * 2); ctx.fill();
    }
    // collaret de boles de fusta (mala)
    for (let k = 0; k < 13; k++) { const t = k / 12, x = 41 + t * 18, y = 67 + Math.sin(t * Math.PI) * 20; ppEl(ctx, x, y, 2.2, 2.2, k % 4 === 0 ? '#d4a840' : '#7a4a22'); }
    // coll prim i cap (una mica més petit que el d'un xibi del tot, perquè és alt)
    ppRect(ctx, 45, 56, 10, 12, PP_PELL_OMBRA, 2);
    ppCap(ctx, 50, 38, 23, 21);
    // cabell curt taronja amb serrell i patilles
    ctx.fillStyle = NAR; ctx.strokeStyle = PP_C; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(26, 40); ctx.quadraticCurveTo(24, 14, 50, 12); ctx.quadraticCurveTo(76, 14, 74, 40); ctx.quadraticCurveTo(72, 30, 66, 26); ctx.quadraticCurveTo(50, 20, 34, 26); ctx.quadraticCurveTo(28, 30, 26, 40); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,210,150,0.6)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(34, 20); ctx.quadraticCurveTo(50, 14, 66, 20); ctx.stroke();
    // barba taronja, més curta i ben cuidada
    ctx.fillStyle = ppGradV(ctx, 46, 74, '#e2742e', '#a04a18'); ctx.strokeStyle = PP_C; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(28, 44); ctx.quadraticCurveTo(27, 62, 38, 66); ctx.quadraticCurveTo(46, 76, 50, 74); ctx.quadraticCurveTo(54, 76, 62, 66); ctx.quadraticCurveTo(73, 62, 72, 44);
    ctx.quadraticCurveTo(62, 52, 50, 50); ctx.quadraticCurveTo(38, 52, 28, 44); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,200,130,0.55)'; ctx.lineWidth = 1.2; [-9, -3, 3, 9].forEach(dx => { ctx.beginPath(); ctx.moveTo(50 + dx, 56); ctx.quadraticCurveTo(50 + dx * 1.2, 64, 50 + dx * 0.8, 70); ctx.stroke(); });
    // bigoti i boca serena
    ctx.fillStyle = NAR; ctx.strokeStyle = PP_C; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(50, 50); ctx.quadraticCurveTo(38, 48, 35, 55); ctx.quadraticCurveTo(44, 55, 50, 53); ctx.quadraticCurveTo(56, 55, 65, 55); ctx.quadraticCurveTo(62, 48, 50, 50); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#7a2a1a'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(45, 58); ctx.quadraticCurveTo(50, 61, 55, 58); ctx.stroke();
    // ulls plàcids (parpelles mig caigudes), celles taronges, ulleres rodones de filferro daurat
    [[42], [58]].forEach(([x]) => { ppUll(ctx, x, 39, 4, 4.4, '#3a5a3a', 0); ctx.fillStyle = PP_PELL; ctx.beginPath(); ctx.ellipse(x, 35.8, 4.5, 2.4, 0, Math.PI, 0); ctx.fill(); ctx.strokeStyle = PP_C; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x - 4.2, 36.8); ctx.lineTo(x + 4.2, 36.8); ctx.stroke(); });
    ppCella(ctx, 35, 31, 47, 30.6, '#c0521e', 2.8); ppCella(ctx, 53, 30.6, 65, 31, '#c0521e', 2.8);
    ctx.strokeStyle = '#d4a840'; ctx.lineWidth = 2.2; ctx.fillStyle = 'rgba(220,240,255,0.2)';
    [[42], [58]].forEach(([x]) => { ctx.beginPath(); ctx.arc(x, 39, 7.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    ctx.beginPath(); ctx.moveTo(49.6, 38); ctx.lineTo(50.4, 38); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.beginPath(); ctx.arc(38.6, 35.6, 1.7, 0, Math.PI * 2); ctx.arc(54.6, 35.6, 1.7, 0, Math.PI * 2); ctx.fill();
    ppEl(ctx, 50, 46, 3, 2.4, '#eab090');
};

// JULI: cap enorme, ulleres grosses, molt prim; samarreta blava amb un angelet, texans i sabatilles gegants
PP_FN.juli = (ctx, W, H) => {
    ppOmbraTerra(ctx, 50, H - 6, 28);
    // cames primes de texans i sabatilles grosses taronja
    [[41], [59]].forEach(([x]) => {
        ppRect(ctx, x - 4.4, H - 46, 8.8, 36, ppGradH(ctx, x - 4.4, x + 4.4, '#4a6aaa', '#2a3a6a'), 3);
        ppEl(ctx, x + (x < 50 ? -3 : 3), H - 8, 11, 6, ppGradV(ctx, H - 14, H - 2, '#f08a2a', '#b05a10'));
        ctx.fillStyle = '#ffffff'; ctx.fillRect(x + (x < 50 ? -8 : -2), H - 7, 10, 2.6);
    });
    // cos escarransit: samarreta ampla (queda gran), amb angelet estampat
    const cos = new Path2D(); cos.moveTo(34, 78); cos.quadraticCurveTo(50, 74, 66, 78); cos.lineTo(68, H - 40); cos.lineTo(32, H - 40); cos.closePath();
    ctx.fillStyle = ppGradH(ctx, 32, 68, '#9ad4f6', '#6ab0dc', '#b4e2fa'); ctx.fill(cos); ctx.strokeStyle = PP_C; ctx.lineWidth = 2.4; ctx.stroke(cos);
    ctx.strokeStyle = 'rgba(30,70,110,0.35)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(38, 94); ctx.quadraticCurveTo(44, 100, 40, 108); ctx.moveTo(62, 92); ctx.quadraticCurveTo(58, 100, 63, 108); ctx.stroke();
    // angelet: cap rosat, ales, halo i arc
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#3a3a5a'; ctx.lineWidth = 1.2;
    [-1, 1].forEach(s => { ctx.beginPath(); ctx.ellipse(50 + s * 7, 94, 5.6, 3.4, s * -0.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    ppEl(ctx, 50, 97, 3.4, 4, '#ffd0b8', true); ctx.lineWidth = 1.2; ppEl(ctx, 50, 91, 3.6, 3.6, '#ffd0b8', true);
    ctx.strokeStyle = '#e8c040'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(50, 86.8, 3.6, 1.2, 0, 0, Math.PI * 2); ctx.stroke();
    // coll de la samarreta i colze
    ppEl(ctx, 50, 78, 8, 3.4, '#7ac0e8', true);
    // braços prims com pals, i mans; la dreta duu una pala petita
    ctx.strokeStyle = PP_C; ctx.lineWidth = 6.6; ctx.beginPath(); ctx.moveTo(34, 80); ctx.lineTo(24, 98); ctx.moveTo(66, 80); ctx.lineTo(78, 94); ctx.stroke();
    ctx.strokeStyle = PP_PELL; ctx.lineWidth = 3.6; ctx.beginPath(); ctx.moveTo(34, 80); ctx.lineTo(24, 98); ctx.moveTo(66, 80); ctx.lineTo(78, 94); ctx.stroke();
    [[34, 80, 5], [66, 80, 5]].forEach(([x, y, r]) => { ctx.fillStyle = '#9ad4f6'; ctx.strokeStyle = PP_C; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    ppMans(ctx, 23, 100, 4.2); ppMans(ctx, 79, 96, 4.2);
    ctx.save(); ctx.translate(82, 92); ctx.rotate(0.25);
    ppRect(ctx, -1.8, -2, 3.6, 12, '#a67442', 1.6);
    ctx.fillStyle = '#2a8ab8'; ctx.beginPath(); ctx.ellipse(0, -11, 8, 10, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = PP_C; ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
    // coll prim i cap ENORME
    ppRect(ctx, 46, 66, 8, 12, PP_PELL_OMBRA, 2);
    ppCap(ctx, 50, 38, 37, 31);
    // cabell taronja, esbullat, amb remolins
    ctx.fillStyle = '#e8741c'; ctx.strokeStyle = PP_C; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(14, 38); ctx.quadraticCurveTo(10, 10, 36, 6); ctx.quadraticCurveTo(44, 0, 52, 5); ctx.quadraticCurveTo(66, 0, 76, 8); ctx.quadraticCurveTo(92, 14, 86, 38);
    ctx.quadraticCurveTo(80, 22, 68, 22); ctx.lineTo(62, 14); ctx.lineTo(54, 24); ctx.lineTo(44, 14); ctx.lineTo(36, 24); ctx.quadraticCurveTo(22, 22, 14, 38); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,230,170,0.5)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(26, 14); ctx.quadraticCurveTo(40, 8, 56, 10); ctx.stroke();
    // ulleres rodones gegants (muntura negra gruixuda)
    ctx.strokeStyle = '#1a1a22'; ctx.lineWidth = 3.6; ctx.fillStyle = 'rgba(200,232,255,0.3)';
    [[34], [66]].forEach(([x]) => { ctx.beginPath(); ctx.arc(x, 40, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(47, 38); ctx.lineTo(53, 38); ctx.moveTo(21, 38); ctx.lineTo(14, 36); ctx.moveTo(79, 38); ctx.lineTo(86, 36); ctx.stroke();
    // ulls grossos i expressius, celles alçades
    ppUll(ctx, 34, 41, 6.6, 7.4, '#2a4a7a', 0.6); ppUll(ctx, 66, 41, 6.6, 7.4, '#2a4a7a', -0.6);
    ppCella(ctx, 24, 24, 42, 24, '#b04a10', 3); ppCella(ctx, 58, 24, 76, 24, '#b04a10', 3);
    ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.beginPath(); ctx.ellipse(28, 32, 3.4, 1.6, -0.7, 0, Math.PI * 2); ctx.ellipse(60, 32, 3.4, 1.6, -0.7, 0, Math.PI * 2); ctx.fill();
    // nas petit, pigues i boca oberta d'entusiasme
    // nas aguileny: pont convex i punta ganxuda cap avall
    ctx.fillStyle = '#eab090'; ctx.strokeStyle = PP_C; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(47, 42); ctx.quadraticCurveTo(56, 47, 57, 55); ctx.quadraticCurveTo(58, 61, 52, 61); ctx.quadraticCurveTo(47, 61, 48, 58); ctx.quadraticCurveTo(52, 57, 51.5, 54); ctx.quadraticCurveTo(50, 48, 47, 42); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.beginPath(); ctx.ellipse(52, 48, 1.4, 3, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(120,50,30,0.7)'; ctx.beginPath(); ctx.ellipse(51, 59.4, 1.5, 0.9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(190,100,70,0.5)'; [[38, 54], [41, 56.4], [35, 56.4], [64, 54], [61, 56.4], [67, 56.4]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 0.9, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = '#7a2a2a'; ctx.strokeStyle = PP_C; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(40, 62); ctx.quadraticCurveTo(50, 74, 60, 62); ctx.quadraticCurveTo(50, 64, 40, 62); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(42, 63); ctx.quadraticCurveTo(50, 66, 58, 63); ctx.lineTo(57, 65.4); ctx.quadraticCurveTo(50, 68, 43, 65.4); ctx.closePath(); ctx.fill();
    ppRubor(ctx, 24, 56, 5, 3); ppRubor(ctx, 76, 56, 5, 3);
};
