/**
 * ELS PERSONATGES DEL CELLER (ping-pong): Frederic, Eloi, Josep i Juli, tots en estil xibi (cap gran, cos petit) i amb molt de detall.
 *  - Frederic: senyor gras d'uns 50 anys, amb ulleres i la pala de pedra.
 *  - Eloi: atleta alt i musculós.
 *  - Josep: una mena de gurú amb ulleres, barba i cabell pèl-roig.
 *  - Juli: cap enorme, ulleres i molt prim; porta la samarreta dels angelets.
 * Cada funció pinta en un llenç de 100 unitats d'ample (ctx ja escalat); dibuixarNpcPingpong ho prepara per al catàleg d'assets.
 */

const PP_PROPORCIO = { frederic: 1.32, eloi: 1.58, josep: 1.38, juli: 1.44 };

function dibuixarNpcPingpong(c, w, qui) {
    const asp = PP_PROPORCIO[qui];
    c.width = w; c.height = Math.round(w * asp);
    const ctx = c.getContext('2d');
    ctx.scale(w / 100, w / 100);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    PP_FN[qui](ctx, 100, 100 * asp);
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

// FREDERIC: senyor gras d'uns 50 anys, ulleres rectangulars, cabell gris escàs, jersei i tirants, pala de pedra
PP_FN.frederic = (ctx, W, H) => {
    ppOmbraTerra(ctx, 50, H - 6, 34);
    // peus i cames
    [[34, '#4a4a54'], [66, '#4a4a54']].forEach(([x, c]) => { ppRect(ctx, x - 9, H - 38, 18, 26, ppGradH(ctx, x - 9, x + 9, '#5a5a66', '#34343c'), 4); });
    [[34], [66]].forEach(([x]) => ppEl(ctx, x + (x < 50 ? -1 : 1), H - 9, 12, 6, '#6a4220'));
    // cos: jersei de ratlles amb pançó, tirants i camisa blanca
    const cos = new Path2D(); cos.moveTo(22, 62); cos.quadraticCurveTo(10, 94, 16, H - 36); cos.lineTo(84, H - 36); cos.quadraticCurveTo(90, 94, 78, 62); cos.closePath();
    ctx.fillStyle = ppGradH(ctx, 14, 86, '#6a8a9a', '#4a6a7a', '#7a9aaa'); ctx.fill(cos); ctx.strokeStyle = PP_C; ctx.lineWidth = 2.4; ctx.stroke(cos);
    ctx.save(); ctx.clip(cos); ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 3; for (let y = 70; y < H - 36; y += 9) { ctx.beginPath(); ctx.moveTo(10, y); ctx.quadraticCurveTo(50, y + 6, 90, y); ctx.stroke(); } ctx.restore();
    ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.beginPath(); ctx.ellipse(50, 98, 30, 14, 0, 0, Math.PI); ctx.fill();       // volum de la panxa
    ctx.fillStyle = '#f2ecdc'; ctx.beginPath(); ctx.moveTo(40, 60); ctx.lineTo(50, 74); ctx.lineTo(60, 60); ctx.closePath(); ctx.fill(); ctx.strokeStyle = PP_C; ctx.lineWidth = 2; ctx.stroke();   // coll de la camisa
    ctx.strokeStyle = '#8a2a2a'; ctx.lineWidth = 4; [-17, 17].forEach(dx => { ctx.beginPath(); ctx.moveTo(50 + dx, 64); ctx.lineTo(50 + dx * 1.15, H - 36); ctx.stroke(); });
    ctx.fillStyle = '#d4a840'; [-17, 17].forEach(dx => { ppEl(ctx, 50 + dx * 1.15, H - 40, 2.4, 2.4, '#d4a840'); });
    // braços (màniques arremangades blanques) i mans
    ppRect(ctx, 4, 64, 17, 34, ppGradH(ctx, 4, 21, '#f2ecdc', '#c8c0aa'), 8); ppMans(ctx, 12, 102, 5.4);
    ppRect(ctx, 79, 64, 17, 34, ppGradH(ctx, 79, 96, '#f2ecdc', '#c8c0aa'), 8); ppMans(ctx, 88, 100, 5.4);
    // pala de pedra a la mà dreta (el mànec és de fusta)
    ctx.save(); ctx.translate(90, 98); ctx.rotate(-0.18);
    ppRect(ctx, -3, -4, 6, 26, ppGradH(ctx, -3, 3, '#a67442', '#5a3418'), 2);
    ctx.fillStyle = ppGradV(ctx, -44, -4, '#b8b8b0', '#7a7a74'); ctx.beginPath(); ctx.ellipse(0, -24, 15, 19, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = PP_C; ctx.lineWidth = 2.4; ctx.stroke();
    ctx.strokeStyle = 'rgba(60,60,56,0.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-8, -34); ctx.lineTo(-2, -26); ctx.lineTo(-6, -18); ctx.moveTo(6, -30); ctx.lineTo(10, -22); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(-5, -32, 4, 7, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(16, 90, 4, 3);
    // coll papallona
    ppEl(ctx, 50, 62, 12, 5, '#d8b8a0', false);
    // cap
    ppCap(ctx, 50, 38, 29, 26);
    ppEl(ctx, 50, 60, 18, 6, 'rgba(210,150,120,0.55)', false);                                   // papada
    // cabell gris escàs: serrell als costats i una vora fina al clatell
    ctx.fillStyle = '#a8a8ae'; ctx.strokeStyle = PP_C; ctx.lineWidth = 2;
    [-1, 1].forEach(s => { ctx.beginPath(); ctx.moveTo(50 + s * 27, 44); ctx.quadraticCurveTo(50 + s * 33, 26, 50 + s * 22, 17); ctx.quadraticCurveTo(50 + s * 27, 30, 50 + s * 22, 42); ctx.closePath(); ctx.fill(); ctx.stroke(); });
    ctx.beginPath(); ctx.moveTo(30, 18); ctx.quadraticCurveTo(50, 8, 70, 18); ctx.quadraticCurveTo(50, 14, 30, 18); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(34, 18); ctx.quadraticCurveTo(50, 11, 66, 18); ctx.stroke();
    // cara
    ppRubor(ctx, 35, 52, 6, 3.6); ppRubor(ctx, 65, 52, 6, 3.6);
    ppUll(ctx, 41, 43, 4.4, 4.8, '#5a3a22', 0.4); ppUll(ctx, 59, 43, 4.4, 4.8, '#5a3a22', -0.4);
    ppCella(ctx, 34, 35, 47, 34, '#8a8a90', 2.8); ppCella(ctx, 53, 34, 66, 35, '#8a8a90', 2.8);
    ppEl(ctx, 50, 52, 4.6, 3.8, '#eab090');
    ctx.strokeStyle = '#8a8a90'; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(44, 57); ctx.quadraticCurveTo(50, 54, 56, 57); ctx.stroke();                                              // bigoti gris
    ctx.strokeStyle = PP_C; ctx.lineWidth = 2; ctx.fillStyle = '#7a2a2a'; ctx.beginPath(); ctx.moveTo(41, 59); ctx.quadraticCurveTo(50, 68, 59, 59); ctx.quadraticCurveTo(50, 61, 41, 59); ctx.fill(); ctx.stroke();   // somriure
    // ulleres rectangulars de muntura bruna
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

// JOSEP: gurú tranquil, cabell llarg pèl-roig, barba frondosa, ulleres rodones, túnica porpra, collaret de boles i una pilota que levita
PP_FN.josep = (ctx, W, H) => {
    // halo suau
    const halo = ctx.createRadialGradient(50, 38, 8, 50, 38, 48); halo.addColorStop(0, 'rgba(255,226,150,0.36)'); halo.addColorStop(1, 'rgba(255,226,150,0)');
    ctx.fillStyle = halo; ctx.fillRect(0, 0, W, 90);
    ppOmbraTerra(ctx, 50, H - 6, 32);
    // cabell llarg del darrere
    ctx.fillStyle = ppGradV(ctx, 20, 90, '#d8662a', '#8a3a14'); ctx.strokeStyle = PP_C; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(22, 34); ctx.quadraticCurveTo(10, 70, 18, 90); ctx.quadraticCurveTo(30, 84, 34, 70); ctx.lineTo(66, 70); ctx.quadraticCurveTo(70, 84, 82, 90); ctx.quadraticCurveTo(90, 70, 78, 34); ctx.closePath(); ctx.fill(); ctx.stroke();
    // túnica llarga porpra amb vora daurada i mànigues amples
    const roba = new Path2D(); roba.moveTo(28, 62); roba.quadraticCurveTo(50, 56, 72, 62); roba.lineTo(84, H - 10); roba.quadraticCurveTo(50, H - 4, 16, H - 10); roba.closePath();
    ctx.fillStyle = ppGradH(ctx, 16, 84, '#5a2a6a', '#3a1a4a', '#7a3a8a'); ctx.fill(roba); ctx.strokeStyle = PP_C; ctx.lineWidth = 2.4; ctx.stroke(roba);
    ctx.save(); ctx.clip(roba); ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 1.4; [-20, -9, 0, 9, 20].forEach(dx => { ctx.beginPath(); ctx.moveTo(50 + dx * 0.4, 70); ctx.quadraticCurveTo(50 + dx * 1.1, 100, 50 + dx * 1.5, H - 8); ctx.stroke(); }); ctx.restore();
    ctx.strokeStyle = '#d4a840'; ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(16, H - 12); ctx.quadraticCurveTo(50, H - 6, 84, H - 12); ctx.stroke();
    ctx.strokeStyle = '#d4a840'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(50, 62); ctx.lineTo(50, H - 8); ctx.stroke();
    // cinturó de tela
    ppRect(ctx, 30, 94, 40, 6, '#e8c860', 2);
    // mànigues amples, i mans juntes davant (gest tranquil) amb la pilota que levita
    [[-1], [1]].forEach(([s]) => {
        ctx.fillStyle = ppGradH(ctx, 50 + s * 20, 50 + s * 42, '#4a2258', '#6a3278'); ctx.strokeStyle = PP_C; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(50 + s * 22, 64); ctx.quadraticCurveTo(50 + s * 46, 74, 50 + s * 38, 96); ctx.lineTo(50 + s * 12, 94); ctx.quadraticCurveTo(50 + s * 18, 76, 50 + s * 22, 64); ctx.closePath(); ctx.fill(); ctx.stroke();
    });
    ppMans(ctx, 46, 92, 4.6); ppMans(ctx, 54, 92, 4.6);
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#ffd870'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(50, 82, 4.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,230,140,0.4)'; ctx.beginPath(); ctx.arc(50, 82, 9, 0, Math.PI * 2); ctx.fill();
    // sandàlies
    [[38], [62]].forEach(([x]) => ppRect(ctx, x - 9, H - 10, 18, 8, '#8a5a2c', 4));
    // collaret de boles de fusta (mala) fins a la panxa
    for (let k = 0; k < 15; k++) { const t = k / 14, x = 38 + t * 24, y = 62 + 6 + Math.sin(t * Math.PI) * 22; ppEl(ctx, x, y, 2.4, 2.4, k % 5 === 0 ? '#d4a840' : '#7a4a22'); }
    // cap
    ppCap(ctx, 50, 38, 25, 23);
    // barba pèl-roja frondosa amb ondulacions
    ctx.fillStyle = ppGradV(ctx, 46, 82, '#e2742e', '#9a4616'); ctx.strokeStyle = PP_C; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(28, 46); ctx.quadraticCurveTo(26, 66, 38, 74); ctx.quadraticCurveTo(44, 86, 50, 82); ctx.quadraticCurveTo(56, 86, 62, 74); ctx.quadraticCurveTo(74, 66, 72, 46);
    ctx.quadraticCurveTo(62, 56, 50, 54); ctx.quadraticCurveTo(38, 56, 28, 46); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,200,130,0.55)'; ctx.lineWidth = 1.2; [-12, -4, 4, 12].forEach(dx => { ctx.beginPath(); ctx.moveTo(50 + dx, 58); ctx.quadraticCurveTo(50 + dx * 1.2, 70, 50 + dx * 0.8, 78); ctx.stroke(); });
    // bigoti i boca serena
    ctx.fillStyle = '#e2742e'; ctx.strokeStyle = PP_C; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(50, 53); ctx.quadraticCurveTo(38, 50, 34, 58); ctx.quadraticCurveTo(44, 58, 50, 56); ctx.quadraticCurveTo(56, 58, 66, 58); ctx.quadraticCurveTo(62, 50, 50, 53); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#7a2a1a'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(45, 61); ctx.quadraticCurveTo(50, 64, 55, 61); ctx.stroke();
    // cabell del davant i monyo
    ctx.fillStyle = '#d8662a'; ctx.strokeStyle = PP_C; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(25, 36); ctx.quadraticCurveTo(26, 14, 50, 12); ctx.quadraticCurveTo(74, 14, 75, 36); ctx.quadraticCurveTo(66, 24, 50, 26); ctx.quadraticCurveTo(34, 24, 25, 36); ctx.closePath(); ctx.fill(); ctx.stroke();
    ppEl(ctx, 50, 8, 9, 7, '#d8662a');
    ctx.strokeStyle = 'rgba(255,210,150,0.6)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(34, 24); ctx.quadraticCurveTo(50, 16, 66, 24); ctx.stroke();
    // ulls plàcids (parpelles mig caigudes), celles roges, ulleres rodones de filferro daurat
    [[41], [59]].forEach(([x]) => { ppUll(ctx, x, 40, 4.4, 4.6, '#3a5a3a', 0); ctx.fillStyle = PP_PELL; ctx.beginPath(); ctx.ellipse(x, 36.6, 4.9, 2.6, 0, Math.PI, 0); ctx.fill(); ctx.strokeStyle = PP_C; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x - 4.6, 37.6); ctx.lineTo(x + 4.6, 37.6); ctx.stroke(); });
    ppCella(ctx, 34, 32, 47, 31.5, '#c0521e', 3); ppCella(ctx, 53, 31.5, 66, 32, '#c0521e', 3);
    ctx.strokeStyle = '#d4a840'; ctx.lineWidth = 2.2; ctx.fillStyle = 'rgba(220,240,255,0.2)';
    [[41], [59]].forEach(([x]) => { ctx.beginPath(); ctx.arc(x, 40, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    ctx.beginPath(); ctx.moveTo(49, 39); ctx.lineTo(51, 39); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.beginPath(); ctx.arc(37.5, 36.5, 1.8, 0, Math.PI * 2); ctx.arc(55.5, 36.5, 1.8, 0, Math.PI * 2); ctx.fill();
    ppEl(ctx, 50, 47, 3.2, 2.6, '#eab090');
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
    // cabell fosc, esbullat, amb remolins
    ctx.fillStyle = '#3a2a24'; ctx.strokeStyle = PP_C; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(14, 38); ctx.quadraticCurveTo(10, 10, 36, 6); ctx.quadraticCurveTo(44, 0, 52, 5); ctx.quadraticCurveTo(66, 0, 76, 8); ctx.quadraticCurveTo(92, 14, 86, 38);
    ctx.quadraticCurveTo(80, 22, 68, 22); ctx.lineTo(62, 14); ctx.lineTo(54, 24); ctx.lineTo(44, 14); ctx.lineTo(36, 24); ctx.quadraticCurveTo(22, 22, 14, 38); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(26, 14); ctx.quadraticCurveTo(40, 8, 56, 10); ctx.stroke();
    // ulleres rodones gegants (muntura negra gruixuda)
    ctx.strokeStyle = '#1a1a22'; ctx.lineWidth = 3.6; ctx.fillStyle = 'rgba(200,232,255,0.3)';
    [[34], [66]].forEach(([x]) => { ctx.beginPath(); ctx.arc(x, 40, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(47, 38); ctx.lineTo(53, 38); ctx.moveTo(21, 38); ctx.lineTo(14, 36); ctx.moveTo(79, 38); ctx.lineTo(86, 36); ctx.stroke();
    // ulls grossos i expressius, celles alçades
    ppUll(ctx, 34, 41, 6.6, 7.4, '#2a4a7a', 0.6); ppUll(ctx, 66, 41, 6.6, 7.4, '#2a4a7a', -0.6);
    ppCella(ctx, 24, 24, 42, 24, '#2a1a14', 3); ppCella(ctx, 58, 24, 76, 24, '#2a1a14', 3);
    ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.beginPath(); ctx.ellipse(28, 32, 3.4, 1.6, -0.7, 0, Math.PI * 2); ctx.ellipse(60, 32, 3.4, 1.6, -0.7, 0, Math.PI * 2); ctx.fill();
    // nas petit, pigues i boca oberta d'entusiasme
    ppEl(ctx, 50, 52, 3.4, 2.8, '#eab090');
    ctx.fillStyle = 'rgba(190,100,70,0.5)'; [[40, 54], [43, 56.4], [37, 56.4], [60, 54], [57, 56.4], [63, 56.4]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 0.9, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = '#7a2a2a'; ctx.strokeStyle = PP_C; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(40, 59); ctx.quadraticCurveTo(50, 72, 60, 59); ctx.quadraticCurveTo(50, 61, 40, 59); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(42, 60); ctx.quadraticCurveTo(50, 63, 58, 60); ctx.lineTo(57, 62.4); ctx.quadraticCurveTo(50, 65, 43, 62.4); ctx.closePath(); ctx.fill();
    ppRubor(ctx, 24, 56, 5, 3); ppRubor(ctx, 76, 56, 5, 3);
};
