/**
 * EL TALLER DEL GARF (la cel·la de Sant Antoni): un taller-laboratori de llautó i coure, amb vapor, engranatges i plànols.
 * Es pinten en coordenades de disseny (ctx, w, h) i assets.js les converteix en textures. Fan servir els ajudants de dibuixos_biblio.js.
 */
const TALLER_CONTORN = '#1e1206';

function llautoTaller(ctx, x0, y0, x1, y1) {
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, '#6a4410'); g.addColorStop(0.3, '#f4d68a'); g.addColorStop(0.55, '#c8902e'); g.addColorStop(1, '#4e3006');
    return g;
}
function coureTaller(ctx, x0, y0, x1, y1) {
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, '#5a220c'); g.addColorStop(0.32, '#f0a070'); g.addColorStop(0.55, '#b85a2a'); g.addColorStop(1, '#3e1606');
    return g;
}
function rebloTaller(ctx, x, y, r = 2.6) {
    ctx.fillStyle = '#3a2008'; ctx.beginPath(); ctx.arc(x + 0.6, y + 0.8, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f2d080'; ctx.beginPath(); ctx.arc(x, y, r * 0.8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,230,0.8)'; ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.3, 0, Math.PI * 2); ctx.fill();
}
// Un tub de coure (horitzontal o vertical) amb brides reblonades
function tubTaller(ctx, x0, y0, x1, y1, g = 12) {
    const hor = Math.abs(x1 - x0) > Math.abs(y1 - y0);
    ctx.fillStyle = hor ? coureTaller(ctx, 0, y0 - g / 2, 0, y0 + g / 2) : coureTaller(ctx, x0 - g / 2, 0, x0 + g / 2, 0);
    ctx.strokeStyle = TALLER_CONTORN; ctx.lineWidth = 2;
    if (hor) { ctx.fillRect(Math.min(x0, x1), y0 - g / 2, Math.abs(x1 - x0), g); ctx.strokeRect(Math.min(x0, x1), y0 - g / 2, Math.abs(x1 - x0), g); }
    else { ctx.fillRect(x0 - g / 2, Math.min(y0, y1), g, Math.abs(y1 - y0)); ctx.strokeRect(x0 - g / 2, Math.min(y0, y1), g, Math.abs(y1 - y0)); }
    const L = hor ? Math.abs(x1 - x0) : Math.abs(y1 - y0);
    for (let d = 40; d < L - 10; d += 90) {
        const bx = hor ? Math.min(x0, x1) + d : x0, by = hor ? y0 : Math.min(y0, y1) + d;
        ctx.fillStyle = hor ? llautoTaller(ctx, 0, by - g, 0, by + g) : llautoTaller(ctx, bx - g, 0, bx + g, 0);
        if (hor) { ctx.fillRect(bx - 4, by - g / 2 - 3, 8, g + 6); ctx.strokeRect(bx - 4, by - g / 2 - 3, 8, g + 6); }
        else { ctx.fillRect(bx - g / 2 - 3, by - 4, g + 6, 8); ctx.strokeRect(bx - g / 2 - 3, by - 4, g + 6, 8); }
    }
}
// La cara d'un manòmetre (l'agulla la posa el joc, perquè tremoli)
function manometreTaller(ctx, x, y, r) {
    ctx.fillStyle = llautoTaller(ctx, x - r, y - r, x + r, y + r); ctx.strokeStyle = TALLER_CONTORN; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f4ecd4'; ctx.beginPath(); ctx.arc(x, y, r * 0.78, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 1.2;
    for (let k = 0; k <= 10; k++) { const a = Math.PI * 0.75 + k / 10 * Math.PI * 1.5, r1 = r * 0.7, r0 = k % 5 ? r * 0.6 : r * 0.52;
        ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); }
    ctx.strokeStyle = '#b02a1a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r * 0.66, Math.PI * 1.95, Math.PI * 2.25); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(x - r * 0.3, y - r * 0.35, r * 0.35, r * 0.18, -0.5, 0, Math.PI * 2); ctx.fill();
}

// ---------- Paret del fons: maó fosc, biga, canonades de coure, tauler d'eines, plànols i manòmetres ----------
function pintarParetTaller(ctx, w, h) {
    const r = rndBib(31);
    ctx.fillStyle = '#3a2218'; ctx.fillRect(0, 0, w, h);
    for (let y = 8, fila = 0; y < h; y += 16, fila++) {                  // maons
        for (let x = (fila % 2) * -22; x < w; x += 44) {
            const t = 0.8 + r() * 0.35;
            ctx.fillStyle = `rgb(${Math.round(120 * t)},${Math.round(62 * t)},${Math.round(44 * t)})`;
            ctx.fillRect(x + 1.5, y + 1.5, 41, 13);
            ctx.fillStyle = 'rgba(255,220,190,0.1)'; ctx.fillRect(x + 3, y + 2.5, 37, 2);
        }
    }
    for (let k = 0; k < 12; k++) { ctx.fillStyle = 'rgba(20,10,4,0.25)'; ctx.beginPath(); ctx.ellipse(r() * w, 40 + r() * (h - 60), 18 + r() * 30, 8 + r() * 14, 0, 0, Math.PI * 2); ctx.fill(); }   // sutge
    // Biga de dalt
    ctx.fillStyle = gradVBib(ctx, 0, 16, [[0, '#6a4426'], [1, '#3a2210']]); ctx.fillRect(0, 0, w, 16);
    ctx.strokeStyle = TALLER_CONTORN; ctx.lineWidth = 2; ctx.strokeRect(-2, 0, w + 4, 16);
    // Tauler d'eines (esquerra): fusta foradada amb eines penjades
    ctx.fillStyle = '#8a6a44'; ctx.fillRect(22, 40, 170, 104); ctx.strokeRect(22, 40, 170, 104);
    ctx.fillStyle = '#4a3420'; for (let y = 50; y < 140; y += 12) for (let x = 32; x < 186; x += 12) ctx.fillRect(x, y, 2.2, 2.2);
    const eina = (x, y, l, ang, col, g) => { ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.fillStyle = col; ctx.strokeStyle = TALLER_CONTORN; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.roundRect(-g / 2, 0, g, l, 2); ctx.fill(); ctx.stroke(); ctx.restore(); };
    eina(46, 52, 70, 0, '#9aa0aa', 6); ctx.fillStyle = '#9aa0aa'; ctx.beginPath(); ctx.arc(46, 54, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#8a6a44'; ctx.beginPath(); ctx.arc(46, 50, 4, 0, Math.PI * 2); ctx.fill();   // clau anglesa
    eina(74, 52, 46, 0, '#7a4a20', 7); ctx.fillStyle = '#6a6e78'; ctx.fillRect(64, 50, 20, 12); ctx.strokeRect(64, 50, 20, 12);   // martell
    eina(98, 54, 60, 0, '#c8902e', 4); eina(98, 54, 22, 0, '#b02a1a', 8);                                                        // tornavís
    eina(122, 52, 58, 0.06, '#9aa0aa', 4); eina(132, 52, 58, -0.06, '#9aa0aa', 4); ctx.fillStyle = '#b02a1a'; ctx.fillRect(118, 88, 8, 22); ctx.fillRect(130, 88, 8, 22);   // alicates
    ctx.strokeStyle = '#c8902e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(166, 76, 14, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(166, 76, 7, 0, Math.PI * 2); ctx.stroke();   // un rotlle de fil
    for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; ctx.fillStyle = '#c8902e'; ctx.fillRect(166 + Math.cos(a) * 15 - 2, 76 + Math.sin(a) * 15 - 2, 4, 4); }
    // Plànols blaus clavats a la paret (el carro de vapor del Follet)
    const px = 500, py = 30, pw = 124, ph = 92;
    ctx.save(); ctx.translate(px + pw / 2, py + ph / 2); ctx.rotate(-0.03); ctx.translate(-pw / 2, -ph / 2);
    ctx.fillStyle = '#244a8a'; ctx.fillRect(0, 0, pw, ph); ctx.strokeStyle = '#0e1e3e'; ctx.lineWidth = 2; ctx.strokeRect(0, 0, pw, ph);
    ctx.strokeStyle = 'rgba(200,220,255,0.18)'; ctx.lineWidth = 0.8; for (let x = 8; x < pw; x += 8) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ph); ctx.stroke(); } for (let y = 8; y < ph; y += 8) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(pw, y); ctx.stroke(); }
    ctx.strokeStyle = '#e8f0ff'; ctx.lineWidth = 1.4;
    ctx.strokeRect(18, 30, 62, 28); ctx.beginPath(); ctx.arc(32, 64, 10, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(70, 64, 10, 0, Math.PI * 2); ctx.stroke();   // el carro
    ctx.strokeRect(60, 16, 8, 14); ctx.beginPath(); ctx.moveTo(80, 44); ctx.lineTo(102, 44); ctx.stroke();
    ctx.beginPath(); ctx.arc(100, 22, 9, 0, Math.PI * 2); ctx.stroke(); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; ctx.beginPath(); ctx.moveTo(100 + Math.cos(a) * 9, 22 + Math.sin(a) * 9); ctx.lineTo(100 + Math.cos(a) * 12, 22 + Math.sin(a) * 12); ctx.stroke(); }
    ctx.setLineDash([3, 2]); ctx.beginPath(); ctx.moveTo(18, 82); ctx.lineTo(80, 82); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#e8f0ff'; ctx.font = 'italic 8px serif'; ctx.fillText('carro de vapor', 70, 86);
    [[2, 2], [pw - 6, 2], [2, ph - 6], [pw - 6, ph - 6]].forEach(([x, y]) => { ctx.fillStyle = '#c8302a'; ctx.beginPath(); ctx.arc(x + 2, y + 2, 2.6, 0, Math.PI * 2); ctx.fill(); });
    ctx.restore();
    // Canonades de coure: una de llarga a dalt, que baixa a la caldera i als manòmetres
    tubTaller(ctx, 0, 28, w, 28, 12);
    tubTaller(ctx, 300, 150, w, 150, 14);
    tubTaller(ctx, 676, 28, 676, 150, 12);
    tubTaller(ctx, 210, 28, 210, 180, 10);
    // Vàlvules: volants vermells
    [[300, 150, 12], [676, 92, 10]].forEach(([x, y, rr]) => {
        ctx.strokeStyle = TALLER_CONTORN; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x, y, rr, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = '#c8302a'; ctx.lineWidth = 3.5; ctx.stroke();
        for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + 0.4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); ctx.stroke(); }
        rebloTaller(ctx, x, y, 3);
    });
    // Manòmetres (les agulles les posa el joc)
    manometreTaller(ctx, 650, 120, 20);
    manometreTaller(ctx, 712, 58, 16);
    // Penombra a dalt i al sòcol
    ctx.fillStyle = gradVBib(ctx, 0, h, [[0, 'rgba(0,0,0,0.45)'], [0.25, 'rgba(0,0,0,0)'], [0.85, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.5)']]); ctx.fillRect(0, 0, w, h);
}

// ---------- La caldera: un cilindre de coure reblonat, cúpula, xemeneia i la porta del forn ----------
function pintarCalderaTaller(ctx, w, h) {
    const cx = w / 2, x0 = 30, x1 = w - 30, top = 70, base = h - 18;
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(cx, base + 6, (x1 - x0) / 2 + 14, 12, 0, 0, Math.PI * 2); ctx.fill();
    // Xemeneia
    ctx.fillStyle = coureTaller(ctx, cx - 12, 0, cx + 12, 0); ctx.strokeStyle = TALLER_CONTORN; ctx.lineWidth = 2.5;
    ctx.fillRect(cx - 11, 0, 22, top - 20); ctx.strokeRect(cx - 11, 0, 22, top - 20);
    ctx.fillStyle = llautoTaller(ctx, cx - 16, 0, cx + 16, 0); ctx.fillRect(cx - 16, 20, 32, 7); ctx.strokeRect(cx - 16, 20, 32, 7);
    // Cúpula
    ctx.fillStyle = coureTaller(ctx, x0, 0, x1, 0);
    ctx.beginPath(); ctx.moveTo(x0, top + 10); ctx.quadraticCurveTo(x0, top - 30, cx, top - 34); ctx.quadraticCurveTo(x1, top - 30, x1, top + 10); ctx.closePath(); ctx.fill(); ctx.stroke();
    // Cos
    ctx.fillStyle = coureTaller(ctx, x0, 0, x1, 0); ctx.fillRect(x0, top + 10, x1 - x0, base - top - 10); ctx.strokeRect(x0, top + 10, x1 - x0, base - top - 10);
    // Cèrcols de llautó amb reblons
    [top + 12, top + 70, base - 14].forEach(y => {
        ctx.fillStyle = llautoTaller(ctx, x0, 0, x1, 0); ctx.fillRect(x0 - 4, y - 5, x1 - x0 + 8, 10); ctx.strokeRect(x0 - 4, y - 5, x1 - x0 + 8, 10);
        for (let x = x0 + 6; x < x1; x += 14) rebloTaller(ctx, x, y, 2.2);
    });
    // Porta del forn: ferro amb reixa (la llum de dins la posa el joc)
    const fx = cx - 34, fy = top + 92, fw = 68, fh = 58;
    ctx.fillStyle = '#2a2a30'; ctx.beginPath(); ctx.roundRect(fx - 6, fy - 6, fw + 12, fh + 12, 10); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff9a30'; ctx.beginPath(); ctx.roundRect(fx, fy, fw, fh, 8); ctx.fill();
    const gf = ctx.createRadialGradient(cx, fy + fh * 0.7, 2, cx, fy + fh * 0.7, fw * 0.6); gf.addColorStop(0, '#fff6c0'); gf.addColorStop(0.4, '#ffb040'); gf.addColorStop(1, '#a02a08');
    ctx.fillStyle = gf; ctx.beginPath(); ctx.roundRect(fx, fy, fw, fh, 8); ctx.fill();
    ctx.strokeStyle = '#1a1a1e'; ctx.lineWidth = 4; for (let x = fx + 10; x < fx + fw; x += 12) { ctx.beginPath(); ctx.moveTo(x, fy); ctx.lineTo(x, fy + fh); ctx.stroke(); }
    ctx.fillStyle = llautoTaller(ctx, fx + fw - 4, 0, fx + fw + 10, 0); ctx.fillRect(fx + fw + 2, fy + fh / 2 - 4, 12, 8);
    // Un manòmetre gran a la cúpula i una vàlvula de vapor
    manometreTaller(ctx, x0 + 26, top + 40, 15);
    ctx.fillStyle = llautoTaller(ctx, x1 - 30, 0, x1 - 10, 0); ctx.strokeStyle = TALLER_CONTORN; ctx.lineWidth = 2;
    ctx.fillRect(x1 - 26, top - 6, 12, 22); ctx.strokeRect(x1 - 26, top - 6, 12, 22);
    ctx.beginPath(); ctx.arc(x1 - 20, top - 10, 9, Math.PI, 0); ctx.fill(); ctx.stroke();
    // Llums i potes
    ctx.fillStyle = 'rgba(255,230,190,0.35)'; ctx.fillRect(x0 + 18, top + 16, 8, base - top - 40);
    ctx.fillStyle = '#2a2a30'; [x0 + 8, x1 - 20].forEach(x => { ctx.fillRect(x, base - 4, 12, 18); ctx.strokeRect(x, base - 4, 12, 18); });
}

// ---------- Engranatges de llautó (es fan girar al joc) ----------
function pintarEngranatgeTaller(ctx, w, h, dents) {
    const cx = w / 2, cy = h / 2, R = w / 2 - 2, Ri = R - 8;
    ctx.fillStyle = llautoTaller(ctx, 0, 0, w, h); ctx.strokeStyle = TALLER_CONTORN; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let k = 0; k < dents; k++) {
        const a0 = k / dents * Math.PI * 2, a1 = a0 + Math.PI / dents * 0.5, a2 = a0 + Math.PI / dents, a3 = a0 + Math.PI / dents * 1.5;
        ctx.lineTo(cx + Math.cos(a0) * Ri, cy + Math.sin(a0) * Ri); ctx.lineTo(cx + Math.cos(a1) * R, cy + Math.sin(a1) * R);
        ctx.lineTo(cx + Math.cos(a2) * R, cy + Math.sin(a2) * R); ctx.lineTo(cx + Math.cos(a3) * Ri, cy + Math.sin(a3) * Ri);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#3a2410';                                                  // forats entre els radis
    for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2 + 0.3; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * Ri * 0.55, cy + Math.sin(a) * Ri * 0.55, Ri * 0.2, 0, Math.PI * 2); ctx.fill(); }
    ctx.strokeStyle = 'rgba(80,50,10,0.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, Ri - 4, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = llautoTaller(ctx, cx - 10, cy - 10, cx + 10, cy + 10); ctx.beginPath(); ctx.arc(cx, cy, Ri * 0.22, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = TALLER_CONTORN; ctx.stroke();
    ctx.fillStyle = '#1a1006'; ctx.beginPath(); ctx.arc(cx, cy, Ri * 0.08, 0, Math.PI * 2); ctx.fill();
}

// ---------- El banc de treball: fusta gastada, cargol de banc, eines, peces i un ocell mecànic a mig fer ----------
function pintarBancTaller(ctx, w, h) {
    const top = 52;
    ctx.fillStyle = 'rgba(0,0,0,0.32)'; ctx.beginPath(); ctx.ellipse(w / 2, h - 6, w / 2 - 6, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = TALLER_CONTORN; ctx.lineWidth = 2.5;
    ctx.fillStyle = '#2a2a30'; [[14, top + 18], [w - 26, top + 18]].forEach(([x, y]) => { ctx.fillRect(x, y, 12, h - y - 6); ctx.strokeRect(x, y, 12, h - y - 6); });   // potes de ferro
    ctx.fillStyle = '#5a3a1e'; ctx.fillRect(18, h - 34, w - 36, 8); ctx.strokeRect(18, h - 34, w - 36, 8);                                                        // travesser
    // Taulell
    ctx.fillStyle = gradVBib(ctx, top, top + 22, [[0, '#a07444'], [1, '#6a4422']]); ctx.fillRect(4, top, w - 8, 22); ctx.strokeRect(4, top, w - 8, 22);
    ctx.strokeStyle = 'rgba(40,20,6,0.5)'; ctx.lineWidth = 1; for (let x = 40; x < w; x += 46) { ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, top + 22); ctx.stroke(); }
    ctx.fillStyle = 'rgba(20,10,0,0.35)'; ctx.beginPath(); ctx.ellipse(w * 0.62, top + 10, 18, 5, 0, 0, Math.PI * 2); ctx.fill();          // taca d'oli
    // Cargol de banc (esquerra)
    ctx.strokeStyle = TALLER_CONTORN; ctx.lineWidth = 2;
    ctx.fillStyle = '#5a6a7a'; ctx.fillRect(12, top - 22, 34, 22); ctx.strokeRect(12, top - 22, 34, 22); ctx.fillRect(46, top - 16, 10, 16); ctx.strokeRect(46, top - 16, 10, 16);
    ctx.strokeStyle = '#8a9aaa'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(56, top - 8); ctx.lineTo(72, top - 8); ctx.stroke(); ctx.beginPath(); ctx.moveTo(72, top - 18); ctx.lineTo(72, top + 2); ctx.stroke();
    // Un ocell mecànic a mig fer: cos de llautó, ales de làmines, ull que brilla (la brillantor la posa el joc)
    const ox = w * 0.45, oy = top - 20;
    ctx.fillStyle = llautoTaller(ctx, ox - 22, oy - 14, ox + 22, oy + 14); ctx.strokeStyle = TALLER_CONTORN; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(ox, oy, 22, 13, -0.15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(ox + 22, oy - 10, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#c8902e'; ctx.beginPath(); ctx.moveTo(ox + 30, oy - 12); ctx.lineTo(ox + 42, oy - 9); ctx.lineTo(ox + 30, oy - 6); ctx.closePath(); ctx.fill(); ctx.stroke();
    for (let k = 0; k < 4; k++) { ctx.fillStyle = k % 2 ? '#d8b060' : '#b08038'; ctx.beginPath(); ctx.moveTo(ox - 6, oy - 4); ctx.lineTo(ox - 30 - k * 4, oy - 26 - k * 6); ctx.lineTo(ox - 20 - k * 3, oy - 22 - k * 6); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    for (let k = 0; k < 3; k++) rebloTaller(ctx, ox - 10 + k * 9, oy + 2, 1.8);
    ctx.strokeStyle = '#6a6a72'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ox - 6, oy + 12); ctx.lineTo(ox - 8, top); ctx.moveTo(ox + 6, oy + 12); ctx.lineTo(ox + 8, top); ctx.stroke();
    // Peces escampades: engranatges petits, cargols, una clau i un llum d'oli
    [[w * 0.72, top - 4, 9], [w * 0.8, top - 3, 6], [w * 0.66, top - 2, 5]].forEach(([x, y, rr]) => {
        ctx.fillStyle = llautoTaller(ctx, x - rr, y - rr, x + rr, y + rr); ctx.strokeStyle = TALLER_CONTORN; ctx.lineWidth = 1.5;
        ctx.beginPath(); for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2, rr2 = k % 2 ? rr : rr * 0.78; ctx.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2 * 0.5); } ctx.closePath(); ctx.fill(); ctx.stroke();
    });
    ctx.fillStyle = '#8a8a94'; for (let k = 0; k < 6; k++) ctx.fillRect(w * 0.56 + k * 5, top - 3 + (k % 2), 3, 3);
    const lx = w - 34, ly = top - 30;                                                                          // llum d'oli
    ctx.fillStyle = llautoTaller(ctx, lx - 10, 0, lx + 10, 0); ctx.strokeStyle = TALLER_CONTORN; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(lx, top - 4, 12, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,240,200,0.55)'; ctx.beginPath(); ctx.ellipse(lx, ly + 12, 9, 15, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffd060'; ctx.beginPath(); ctx.ellipse(lx, ly + 16, 3, 6, 0, 0, Math.PI * 2); ctx.fill();
}

// ---------- El laboratori: taula amb alambí, matrassos de colors, un serpentí i un cremador ----------
function pintarLabTaller(ctx, w, h) {
    const top = 70;
    ctx.fillStyle = 'rgba(0,0,0,0.32)'; ctx.beginPath(); ctx.ellipse(w / 2, h - 6, w / 2 - 6, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = TALLER_CONTORN; ctx.lineWidth = 2.5;
    ctx.fillStyle = '#4a2e18'; [[14, top + 16], [w - 26, top + 16]].forEach(([x, y]) => { ctx.fillRect(x, y, 12, h - y - 6); ctx.strokeRect(x, y, 12, h - y - 6); });
    ctx.fillStyle = gradVBib(ctx, top, top + 18, [[0, '#8a6038'], [1, '#5a381c']]); ctx.fillRect(4, top, w - 8, 18); ctx.strokeRect(4, top, w - 8, 18);
    const vidre = (fn, liquid) => { ctx.save(); fn(); ctx.clip(); ctx.fillStyle = liquid[0]; ctx.fillRect(0, liquid[1], w, h); ctx.restore(); fn(); ctx.fillStyle = 'rgba(220,240,255,0.18)'; ctx.fill(); ctx.strokeStyle = 'rgba(30,40,50,0.9)'; ctx.lineWidth = 2; ctx.stroke(); };
    // Matràs rodó verd sobre un cremador
    const mx = 46, my = top - 30;
    ctx.fillStyle = '#2a2a30'; ctx.fillRect(mx - 14, top - 10, 28, 10); ctx.strokeRect(mx - 14, top - 10, 28, 10);
    ctx.fillStyle = '#4a8aff'; ctx.beginPath(); ctx.moveTo(mx - 5, top - 10); ctx.quadraticCurveTo(mx, top - 22, mx + 5, top - 10); ctx.fill();
    vidre(() => { ctx.beginPath(); ctx.arc(mx, my, 20, Math.PI * 0.62, Math.PI * 2.38); ctx.lineTo(mx + 6, my - 40); ctx.lineTo(mx - 6, my - 40); ctx.closePath(); }, ['#6ad050', my - 4]);
    // Tub que va a l'alambí
    ctx.strokeStyle = 'rgba(200,230,255,0.8)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(mx, my - 40); ctx.quadraticCurveTo(mx + 30, my - 66, 96, my - 52); ctx.stroke();
    // Alambí de coure
    const ax = 106, ay = top - 30;
    ctx.fillStyle = coureTaller(ctx, ax - 22, 0, ax + 22, 0); ctx.strokeStyle = TALLER_CONTORN; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(ax, ay, 22, 26, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ax - 8, ay - 24); ctx.quadraticCurveTo(ax, ay - 44, ax + 8, ay - 24); ctx.fill(); ctx.stroke();
    for (let k = 0; k < 5; k++) rebloTaller(ctx, ax - 16 + k * 8, ay + 8, 1.6);
    // Serpentí i gerro
    ctx.strokeStyle = coureTaller(ctx, 130, 0, 170, 0); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(ax + 8, ay - 34); ctx.lineTo(150, ay - 40);
    for (let k = 0; k < 4; k++) { ctx.lineTo(166, ay - 32 + k * 9); ctx.lineTo(148, ay - 28 + k * 9); } ctx.stroke();
    vidre(() => { ctx.beginPath(); ctx.moveTo(148, top - 2); ctx.lineTo(144, top - 26); ctx.lineTo(176, top - 26); ctx.lineTo(172, top - 2); ctx.closePath(); }, ['#b070e0', top - 14]);
    // Matràs cònic ambre i un tub d'assaig a la gradeta
    vidre(() => { ctx.beginPath(); ctx.moveTo(w - 66, top - 2); ctx.lineTo(w - 52, top - 34); ctx.lineTo(w - 52, top - 48); ctx.lineTo(w - 44, top - 48); ctx.lineTo(w - 44, top - 34); ctx.lineTo(w - 30, top - 2); ctx.closePath(); }, ['#e0a030', top - 16]);
    ctx.fillStyle = '#6a4422'; ctx.fillRect(w - 26, top - 16, 22, 6); ctx.strokeStyle = TALLER_CONTORN; ctx.strokeRect(w - 26, top - 16, 22, 6);
    [['#e04848', w - 22], ['#48c0e0', w - 13]].forEach(([c, x]) => vidre(() => { ctx.beginPath(); ctx.roundRect(x - 3, top - 36, 6, 34, 3); }, [c, top - 20]));
}

// ---------- El llit del Garf: una màrfega petita amb un edredó de retalls i un llibre ----------
function pintarLlitGarf(ctx, w, h) {
    const r = rndBib(9);
    ctx.fillStyle = 'rgba(0,0,0,0.32)'; ctx.beginPath(); ctx.ellipse(w / 2, h - 5, w / 2 - 4, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = TALLER_CONTORN; ctx.lineWidth = 2.5;
    ctx.fillStyle = '#5a3a1e'; ctx.fillRect(6, 20, w - 12, h - 30); ctx.strokeRect(6, 20, w - 12, h - 30);                     // estructura
    ctx.fillStyle = '#e8dcc0'; ctx.beginPath(); ctx.roundRect(12, 24, 40, 28, 8); ctx.fill(); ctx.stroke();                       // coixí
    const cols = ['#b04a3a', '#3a6a8a', '#d8a83a', '#5a8a4a', '#8a5a9a', '#c87a3a'];
    for (let y = 30; y < h - 16; y += 14) for (let x = 56; x < w - 10; x += 16) { ctx.fillStyle = cols[Math.floor(r() * cols.length)]; ctx.fillRect(x, y, 16, 14); }
    ctx.strokeStyle = 'rgba(255,240,210,0.5)'; ctx.lineWidth = 1; ctx.setLineDash([2, 2]);
    for (let y = 30; y < h - 16; y += 14) { ctx.beginPath(); ctx.moveTo(56, y); ctx.lineTo(w - 10, y); ctx.stroke(); }
    for (let x = 56; x < w - 10; x += 16) { ctx.beginPath(); ctx.moveTo(x, 30); ctx.lineTo(x, h - 16); ctx.stroke(); }
    ctx.setLineDash([]); ctx.strokeStyle = TALLER_CONTORN; ctx.lineWidth = 2; ctx.strokeRect(56, 30, w - 66, h - 46);
    ctx.fillStyle = '#7a2a20'; ctx.fillRect(20, h - 26, 26, 18); ctx.strokeRect(20, h - 26, 26, 18); ctx.fillStyle = '#f0e6c8'; ctx.fillRect(22, h - 24, 22, 3);   // llibre
}

// ---------- Un telescopi de llautó sobre un trípode de fusta ----------
function pintarTelescopiTaller(ctx, w, h) {
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(w / 2, h - 6, 40, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = TALLER_CONTORN; ctx.lineWidth = 3;
    const cx = w / 2, cy = h * 0.42;
    [[cx - 34, h - 6], [cx + 34, h - 6], [cx + 4, h - 2]].forEach(([x, y]) => { ctx.strokeStyle = TALLER_CONTORN; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(cx, cy + 8); ctx.lineTo(x, y); ctx.stroke(); ctx.strokeStyle = '#8a5a2e'; ctx.lineWidth = 4; ctx.stroke(); });
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.55);
    ctx.fillStyle = llautoTaller(ctx, 0, -12, 0, 12); ctx.strokeStyle = TALLER_CONTORN; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-40, -8); ctx.lineTo(44, -13); ctx.lineTo(44, 13); ctx.lineTo(-40, 8); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#5a3a1e'; ctx.fillRect(-10, -10, 14, 20); ctx.strokeRect(-10, -10, 14, 20);
    ctx.fillStyle = llautoTaller(ctx, 0, -16, 0, 16); ctx.fillRect(40, -16, 10, 32); ctx.strokeRect(40, -16, 10, 32);
    ctx.fillStyle = '#a8d0ff'; ctx.beginPath(); ctx.ellipse(50, 0, 3, 13, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2a2a30'; ctx.fillRect(-50, -5, 10, 10); ctx.strokeRect(-50, -5, 10, 10);
    ctx.restore();
    rebloTaller(ctx, cx, cy + 6, 4);
}

// ---------- Trastos: una caixa d'eines, una caixa de fusta i un munt d'engranatges ----------
function pintarTrastosTaller(ctx, w, h) {
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(w / 2, h - 5, w / 2 - 4, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = TALLER_CONTORN; ctx.lineWidth = 2.5;
    // Caixa de fusta
    ctx.fillStyle = '#9a7040'; ctx.fillRect(6, 24, 70, h - 32); ctx.strokeRect(6, 24, 70, h - 32);
    ctx.strokeStyle = '#5a3a1e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(6, 24); ctx.lineTo(76, h - 8); ctx.moveTo(76, 24); ctx.lineTo(6, h - 8); ctx.stroke();
    ctx.strokeStyle = TALLER_CONTORN; ctx.lineWidth = 2.5; ctx.strokeRect(6, 24, 70, h - 32);
    // Caixa d'eines vermella
    ctx.fillStyle = '#b0302a'; ctx.fillRect(82, h - 40, 60, 32); ctx.strokeRect(82, h - 40, 60, 32);
    ctx.fillStyle = '#8a8a94'; ctx.fillRect(100, h - 50, 24, 6); ctx.strokeRect(100, h - 50, 24, 6);
    ctx.fillStyle = '#d8b060'; ctx.fillRect(108, h - 28, 8, 6);
    // Engranatges apilats damunt la caixa
    [[30, 18, 13], [52, 14, 9], [42, 6, 7]].forEach(([x, y, rr]) => {
        ctx.fillStyle = llautoTaller(ctx, x - rr, y - rr, x + rr, y + rr); ctx.lineWidth = 1.6;
        ctx.beginPath(); for (let k = 0; k < 20; k++) { const a = k / 20 * Math.PI * 2, r2 = k % 2 ? rr : rr * 0.8; ctx.lineTo(x + Math.cos(a) * r2, y + Math.sin(a) * r2 * 0.6); } ctx.closePath(); ctx.fill(); ctx.stroke();
    });
}

// ---------- Catifa gastada, amb taques d'oli ----------
function pintarCatifaTaller(ctx, w, h) {
    ctx.fillStyle = '#6a2a24'; ctx.beginPath(); ctx.roundRect(4, 4, w - 8, h - 8, 10); ctx.fill();
    ctx.strokeStyle = '#d8a83a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(14, 14, w - 28, h - 28, 8); ctx.stroke();
    ctx.strokeStyle = 'rgba(216,168,58,0.6)'; ctx.lineWidth = 1.5;
    for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.ellipse(w / 2, h / 2, 30 + k * 18, 14 + k * 9, 0, 0, Math.PI * 2); ctx.stroke(); }
    ctx.fillStyle = 'rgba(10,6,2,0.35)'; ctx.beginPath(); ctx.ellipse(w * 0.3, h * 0.6, 22, 10, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(10,6,2,0.25)'; ctx.beginPath(); ctx.ellipse(w * 0.75, h * 0.35, 14, 7, 0, 0, Math.PI * 2); ctx.fill();
}
