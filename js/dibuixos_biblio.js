/**
 * LA BIBLIOTECA DEL MONESTIR: gràfics de la sala (prestatges, vitralls, globus terraqüi, cadires, faristol de la Crònica,
 * escala de mà, taula de lectura, catifa, parquet i paret). Cada funció pinta en coordenades de disseny (ctx, w, h);
 * assets.js les converteix en textures amb `crea` (a RES x).
 */

const BIB_CONTORN = '#140a04';

function rndBib(llavor) { let l = (llavor | 0) || 1; return () => (l = (l * 16807) % 2147483647) / 2147483647; }
function gradVBib(ctx, y0, y1, parades) { const g = ctx.createLinearGradient(0, y0, 0, y1); parades.forEach(([o, c]) => g.addColorStop(o, c)); return g; }
function gradHBib(ctx, x0, x1, parades) { const g = ctx.createLinearGradient(x0, 0, x1, 0); parades.forEach(([o, c]) => g.addColorStop(o, c)); return g; }

// ---------- Prestatge: cornisa en graons, pilastres, baldes amb llibres de tots els colors i algun objecte ----------
const PALETA_LLIBRES_BIB = [['#7a1e24', '#44090e'], ['#24467a', '#10244a'], ['#2f6a3a', '#143820'], ['#8a6428', '#47320f'], ['#5a346a', '#2e1a3c'],
    ['#a2552a', '#582c12'], ['#3a3a3e', '#18181a'], ['#cdb58a', '#8a7248'], ['#6a2a2a', '#361212'], ['#2a5a5e', '#122f33'], ['#8a2a4a', '#481426']];

function llibreBib(ctx, x, y, w, h, c, ajagut, r) {
    ctx.fillStyle = ajagut ? gradVBib(ctx, y, y + h, [[0, c[0]], [1, c[1]]]) : gradHBib(ctx, x, x + w, [[0, c[0]], [0.55, c[0]], [1, c[1]]]);
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(255,240,200,0.22)';
    if (ajagut) ctx.fillRect(x, y, w, 1.2); else ctx.fillRect(x + 0.8, y, 1.2, h);
    if (ajagut) { ctx.fillStyle = '#e8dcc0'; ctx.fillRect(x + w - 3, y + 1, 3, h - 2); }
    else {
        if (h > 24) { ctx.fillStyle = 'rgba(212,166,64,0.9)'; ctx.fillRect(x, y + h * 0.14, w, 1.5); ctx.fillRect(x, y + h * 0.82, w, 1.5); }
        if (w > 8 && r() < 0.6) { ctx.fillStyle = r() < 0.5 ? 'rgba(235,222,190,0.85)' : 'rgba(20,10,4,0.55)'; ctx.fillRect(x + 1.5, y + h * 0.32, w - 3, h * 0.24); }
    }
    ctx.strokeStyle = 'rgba(10,5,2,0.85)'; ctx.lineWidth = 0.9; ctx.strokeRect(x, y, w, h);
}

function objecteBib(ctx, x, yb, r) {
    const tipus = Math.floor(r() * 3);
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.2;
    if (tipus === 0) {            // gerro de ceràmica
        ctx.fillStyle = gradHBib(ctx, x - 7, x + 7, [[0, '#c98a4a'], [1, '#7a4a22']]);
        ctx.beginPath(); ctx.ellipse(x, yb - 9, 7, 9, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillRect(x - 3, yb - 22, 6, 6); ctx.strokeRect(x - 3, yb - 22, 6, 6);
    } else if (tipus === 1) {     // candeler de llautó amb espelma
        ctx.fillStyle = '#c8a040'; ctx.fillRect(x - 5, yb - 4, 10, 4); ctx.fillRect(x - 2, yb - 14, 4, 11); ctx.strokeRect(x - 5, yb - 4, 10, 4);
        ctx.fillStyle = '#f2e6c8'; ctx.fillRect(x - 2.5, yb - 26, 5, 12); ctx.strokeRect(x - 2.5, yb - 26, 5, 12);
        ctx.fillStyle = '#ffc040'; ctx.beginPath(); ctx.ellipse(x, yb - 29, 2.2, 3.6, 0, 0, Math.PI * 2); ctx.fill();
    } else {                      // rellotge de sorra
        ctx.fillStyle = '#5a3418'; ctx.fillRect(x - 6, yb - 4, 12, 3); ctx.fillRect(x - 6, yb - 22, 12, 3);
        ctx.fillStyle = 'rgba(230,240,255,0.7)'; ctx.beginPath(); ctx.moveTo(x - 5, yb - 19); ctx.lineTo(x + 5, yb - 19); ctx.lineTo(x + 1, yb - 12); ctx.lineTo(x + 5, yb - 5); ctx.lineTo(x - 5, yb - 5); ctx.lineTo(x - 1, yb - 12); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#d8b050'; ctx.beginPath(); ctx.moveTo(x - 3.5, yb - 5); ctx.lineTo(x + 3.5, yb - 5); ctx.lineTo(x, yb - 9); ctx.closePath(); ctx.fill();
    }
}

function pintarPrestatgeBiblio(ctx, w, h, files, llavor) {
    const r = rndBib(llavor), cim = 26, base = 12, px = 9;
    ctx.lineJoin = 'round';
    ctx.fillStyle = gradHBib(ctx, 0, w, [[0, '#6a4020'], [0.5, '#4a2a14'], [1, '#3a2010']]);
    ctx.fillRect(0, 8, w, h - 8);
    const ix = px, iw = w - 2 * px, iy = cim, ih = h - cim - base, fila = ih / files;
    ctx.fillStyle = gradVBib(ctx, iy, iy + ih, [[0, '#1c0f07'], [1, '#0a0502']]);
    ctx.fillRect(ix, iy, iw, ih);
    for (let f = 0; f < files; f++) {
        const yb = iy + (f + 1) * fila - 4;
        ctx.fillStyle = gradVBib(ctx, yb - fila + 4, yb - fila + 16, [[0, 'rgba(0,0,0,0.55)'], [1, 'rgba(0,0,0,0)']]);
        ctx.fillRect(ix, yb - fila + 4, iw, 12);
        let bx = ix + 2;
        while (bx < ix + iw - 8) {
            const tira = r();
            if (tira < 0.06 && bx < ix + iw - 40) {                  // pila de llibres ajaguts
                const n = 2 + Math.floor(r() * 3), bw = 24 + r() * 8;
                let yy = yb;
                for (let k = 0; k < n; k++) { const bh = 6 + r() * 3; llibreBib(ctx, bx + (k % 2) * 2, yy - bh, bw, bh, PALETA_LLIBRES_BIB[Math.floor(r() * PALETA_LLIBRES_BIB.length)], true, r); yy -= bh; }
                bx += bw + 4; continue;
            }
            if (tira < 0.09 && bx < ix + iw - 30) { objecteBib(ctx, bx + 9, yb, r); bx += 20; continue; }
            const bw = 6 + r() * 7, bh = fila * (0.56 + r() * 0.3), c = PALETA_LLIBRES_BIB[Math.floor(r() * PALETA_LLIBRES_BIB.length)];
            if (r() < 0.05) {                                         // un llibre recolzat de biaix
                ctx.save(); ctx.translate(bx + bw, yb); ctx.rotate(-0.22); llibreBib(ctx, -bw, -bh, bw, bh, c, false, r); ctx.restore();
                bx += bw + bh * 0.22 + 2; continue;
            }
            llibreBib(ctx, bx, yb - bh, bw, bh, c, false, r);
            bx += bw + 0.6;
        }
        ctx.fillStyle = gradVBib(ctx, yb, yb + 7, [[0, '#b98a52'], [0.3, '#8a5a2c'], [1, '#4a2a12']]);
        ctx.fillRect(ix - 2, yb, iw + 4, 7);
        ctx.fillStyle = 'rgba(255,230,170,0.35)'; ctx.fillRect(ix - 2, yb, iw + 4, 1.5);
        ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.5; ctx.strokeRect(ix - 2, yb, iw + 4, 7);
    }
    [0, w - px].forEach((x, i) => {                                   // pilastres amb canal
        ctx.fillStyle = gradHBib(ctx, x, x + px, i ? [[0, '#5a3418'], [1, '#2e1a0c']] : [[0, '#8a5a2c'], [1, '#4a2a14']]);
        ctx.fillRect(x, cim - 4, px, h - cim - base + 4);
        ctx.strokeStyle = 'rgba(20,10,4,0.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x + px / 2, cim); ctx.lineTo(x + px / 2, h - base); ctx.stroke();
        ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2; ctx.strokeRect(x, cim - 4, px, h - cim - base + 4);
    });
    [[0, 0, w, 7, '#a77848'], [2, 7, w - 4, 6, '#8a5a2c'], [4, 13, w - 8, 5, '#6a4020'], [6, 18, w - 12, 8, '#4a2a14']].forEach(([x, y, ww, hh, c]) => {
        ctx.fillStyle = c; ctx.fillRect(x, y, ww, hh); ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.6; ctx.strokeRect(x, y, ww, hh);
    });
    ctx.fillStyle = 'rgba(255,230,170,0.35)'; ctx.fillRect(1, 1, w - 2, 1.5);
    ctx.fillStyle = '#2a1608'; for (let x = 12; x < w - 16; x += 9) ctx.fillRect(x, 19, 5, 6);      // dentellons
    ctx.fillStyle = gradVBib(ctx, h - base, h, [[0, '#6a4020'], [1, '#2a1608']]); ctx.fillRect(2, h - base, w - 4, base);
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.8; ctx.strokeRect(2, h - base, w - 4, base);
}

// Prestatgeria lateral, vista de cantó: llibres de cara amb les puntes
function pintarPrestatgeLateralBiblio(ctx, w, h, llavor, esquerra) {
    const r = rndBib(llavor);
    ctx.fillStyle = gradHBib(ctx, 0, w, esquerra ? [[0, '#2a1608'], [1, '#5a3418']] : [[0, '#5a3418'], [1, '#2a1608']]);
    ctx.fillRect(0, 0, w, h);
    for (let y = 4; y < h - 8;) {
        const hh = 9 + r() * 6, c = PALETA_LLIBRES_BIB[Math.floor(r() * PALETA_LLIBRES_BIB.length)];
        ctx.fillStyle = gradVBib(ctx, y, y + hh, [[0, c[0]], [1, c[1]]]);
        ctx.fillRect(6, y, w - 12, hh - 1);
        ctx.fillStyle = 'rgba(212,166,64,0.8)'; ctx.fillRect(6, y + hh * 0.3, w - 12, 1.2);
        ctx.strokeStyle = 'rgba(10,5,2,0.85)'; ctx.lineWidth = 0.9; ctx.strokeRect(6, y, w - 12, hh - 1);
        y += hh;
        if (r() < 0.12) { ctx.fillStyle = '#5a3418'; ctx.fillRect(2, y, w - 4, 4); ctx.strokeRect(2, y, w - 4, 4); y += 4; }   // una balda
    }
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 3; ctx.strokeRect(1.5, 1.5, w - 3, h - 3);
}

// ---------- Vitrall apuntat: marc de pedra amb dovelles, vidres amb plom i un monjo amb l'espasa de llum davant la porta de ferro ----------
function pintarVitrallBiblio(ctx, w, h) {
    const cx = w / 2, fr = 11;
    const arc = (x0, x1, yBase, yTop, apex) => {
        ctx.beginPath(); ctx.moveTo(x0, yBase); ctx.lineTo(x0, yTop + apex);
        ctx.quadraticCurveTo(x0, yTop + apex * 0.25, (x0 + x1) / 2, yTop);
        ctx.quadraticCurveTo(x1, yTop + apex * 0.25, x1, yTop + apex); ctx.lineTo(x1, yBase); ctx.closePath();
    };
    ctx.lineJoin = 'round';
    // Marc de pedra
    arc(0, w, h - 10, 0, 64);
    ctx.fillStyle = gradHBib(ctx, 0, w, [[0, '#b9a98a'], [0.5, '#a39373'], [1, '#7c6c52']]); ctx.fill();
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2.6; ctx.stroke();
    // Dovelles (línies radials del marc)
    const bez = (p0, c, p2, t) => ({ x: (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * c.x + t * t * p2.x, y: (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * c.y + t * t * p2.y });
    ctx.strokeStyle = 'rgba(40,28,14,0.55)'; ctx.lineWidth = 1.4;
    [1, -1].forEach(s => {
        const X = x => s > 0 ? x : w - x;
        for (let t = 0.08; t < 0.99; t += 0.13) {
            const o = bez({ x: X(0), y: 64 }, { x: X(0), y: 16 }, { x: cx, y: 0 }, t), i = bez({ x: X(fr), y: fr + 60 }, { x: X(fr), y: fr + 15 }, { x: cx, y: fr }, t);
            ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.lineTo(i.x, i.y); ctx.stroke();
        }
    });
    // Vidre
    ctx.save();
    arc(fr, w - fr, h - 22, fr, 60); ctx.clip();
    ctx.fillStyle = '#121a3c'; ctx.fillRect(0, 0, w, h);
    const blaus = ['#1e3a8a', '#2a5ab8', '#3a2a8a', '#2a7a9a', '#4a3a9a', '#b8801e'];
    for (let j = 0, y = 0; y < h; y += 14, j++) for (let x = (j % 2) * 8 - 8; x < w; x += 16) {
        const c = blaus[(Math.floor(x / 16) * 7 + j * 3) % blaus.length];
        ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x + 8, y); ctx.lineTo(x + 16, y + 7); ctx.lineTo(x + 8, y + 14); ctx.lineTo(x, y + 7); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#0c0c14'; ctx.lineWidth = 1.6; ctx.stroke();
    }
    // Porta de ferro al fons
    ctx.fillStyle = '#4c5c74'; ctx.beginPath(); ctx.moveTo(cx - 32, h - 22); ctx.lineTo(cx - 32, 118); ctx.quadraticCurveTo(cx - 32, 96, cx, 96); ctx.quadraticCurveTo(cx + 32, 96, cx + 32, 118); ctx.lineTo(cx + 32, h - 22); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#0c0c14'; ctx.lineWidth = 2.4; ctx.stroke();
    ctx.fillStyle = '#9aaac4'; for (let k = 0; k < 3; k++) for (let m = 0; m < 3; m++) { ctx.beginPath(); ctx.arc(cx - 20 + m * 20, 118 + k * 14, 2.2, 0, Math.PI * 2); ctx.fill(); }
    // Rosassa a la punta
    ctx.fillStyle = '#d8a030'; ctx.beginPath(); ctx.arc(cx, 30, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    for (let k = 0; k < 8; k++) {
        const a = k * Math.PI / 4;
        ctx.fillStyle = k % 2 ? '#b83a3a' : '#2a8ab8'; ctx.beginPath(); ctx.moveTo(cx, 30); ctx.arc(cx, 30, 13, a, a + Math.PI / 4); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    ctx.fillStyle = '#fff4c0'; ctx.beginPath(); ctx.arc(cx, 30, 4, 0, Math.PI * 2); ctx.fill();
    // Aura
    const au = ctx.createRadialGradient(cx, 84, 2, cx, 84, 32);
    au.addColorStop(0, 'rgba(255,244,190,0.9)'); au.addColorStop(0.5, 'rgba(255,196,80,0.7)'); au.addColorStop(1, 'rgba(255,170,40,0.1)');
    ctx.fillStyle = au; ctx.beginPath(); ctx.arc(cx, 84, 30, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#0c0c14'; ctx.lineWidth = 2; ctx.stroke();
    // Monjo
    ctx.fillStyle = '#2a3a8a'; ctx.beginPath(); ctx.moveTo(cx - 14, 98); ctx.lineTo(cx + 14, 98); ctx.lineTo(cx + 24, h - 22); ctx.lineTo(cx - 24, h - 22); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#0c0c14'; ctx.lineWidth = 1.5; [-8, 0, 8].forEach(dx => { ctx.beginPath(); ctx.moveTo(cx + dx * 0.6, 104); ctx.lineTo(cx + dx * 1.5, h - 22); ctx.stroke(); });
    ctx.fillStyle = '#d8b050'; ctx.fillRect(cx - 17, 126, 34, 3.4);
    ctx.fillStyle = '#4a2a7a'; ctx.beginPath(); ctx.arc(cx, 88, 12, Math.PI, 0); ctx.lineTo(cx + 13, 100); ctx.lineTo(cx - 13, 100); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#0c0c14'; ctx.lineWidth = 2; ctx.stroke();   // caputxa
    ctx.fillStyle = '#f2cfa0'; ctx.beginPath(); ctx.ellipse(cx, 91, 7, 8.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // Espasa de llum
    const es = ctx.createLinearGradient(0, 38, 0, 112);
    es.addColorStop(0, '#ffffff'); es.addColorStop(1, '#ffd870');
    ctx.fillStyle = es; ctx.beginPath(); ctx.moveTo(cx, 36); ctx.lineTo(cx + 3.6, 46); ctx.lineTo(cx + 3.6, 112); ctx.lineTo(cx - 3.6, 112); ctx.lineTo(cx - 3.6, 46); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#b8801e'; ctx.fillRect(cx - 11, 112, 22, 4.4); ctx.strokeRect(cx - 11, 112, 22, 4.4);
    ctx.fillStyle = '#f2cfa0'; [-6, 6].forEach(dx => { ctx.beginPath(); ctx.arc(cx + dx, 120, 3.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    // Llum que travessa el vidre
    ctx.globalCompositeOperation = 'lighter';
    const ll = ctx.createRadialGradient(cx, 80, 4, cx, 80, 90); ll.addColorStop(0, 'rgba(255,230,150,0.14)'); ll.addColorStop(1, 'rgba(255,230,150,0)');
    ctx.fillStyle = ll; ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();
    // Plom i bisell interior
    arc(fr, w - fr, h - 22, fr, 60); ctx.strokeStyle = '#0c0c14'; ctx.lineWidth = 3.4; ctx.stroke();
    arc(fr - 2, w - fr + 2, h - 20, fr - 2, 60); ctx.strokeStyle = 'rgba(70,52,30,0.7)'; ctx.lineWidth = 2.4; ctx.stroke();
    // Ampit
    ctx.fillStyle = gradVBib(ctx, h - 14, h, [[0, '#cdbd9c'], [1, '#7c6c52']]); ctx.fillRect(-2, h - 14, w + 4, 14);
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2; ctx.strokeRect(-2, h - 14, w + 4, 14);
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(0, h - 13, w, 1.6);
}

// ---------- Globus terraqüi: peu de fusta torneada de tres potes, esfera amb oceans, continents i graticula, meridià de llautó i anell d'horitzó ----------
function pintarGlobusBiblio(ctx, w, h) {
    const cx = w / 2, cy = 38, R = 29, tilt = -0.4;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(cx, h - 5, 27, 5, 0, 0, Math.PI * 2); ctx.fill();
    // Peu: tres potes i columna torneada
    [[6, h - 8], [w - 6, h - 8], [cx, h - 3]].forEach(([x1, y1]) => {
        ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(cx, 80); ctx.quadraticCurveTo((cx + x1) / 2 + (x1 < cx ? -3 : x1 > cx ? 3 : 0), 88, x1, y1); ctx.stroke();
        ctx.strokeStyle = '#7a4a24'; ctx.lineWidth = 5; ctx.stroke();
        ctx.strokeStyle = 'rgba(255,220,160,0.4)'; ctx.lineWidth = 1.2; ctx.stroke();
    });
    ctx.fillStyle = gradHBib(ctx, cx - 5, cx + 5, [[0, '#a06a34'], [1, '#4a2a14']]);
    [[68, 16, 11], [74, 8, 6], [82, 12, 9]].forEach(([y, ww, hh]) => { ctx.beginPath(); ctx.ellipse(cx, y, ww / 2, hh / 2, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.6; ctx.stroke(); });
    ctx.strokeStyle = '#8a5a2c'; ctx.lineWidth = 3.4; ctx.beginPath(); ctx.ellipse(cx, 92, 20, 5, 0, 0, Math.PI * 2); ctx.stroke();   // travesser en anell
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(cx, 92, 22, 6.4, 0, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.ellipse(cx, 92, 17.6, 3.6, 0, 0, Math.PI * 2); ctx.stroke();
    // Anell d'horitzó: meitat del darrere
    const horitzo = (davant) => {
        ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(cx, cy + 8, R + 10, 9.5, 0, davant ? 0 : Math.PI, davant ? Math.PI : Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = davant ? '#8a5a2c' : '#5a3418'; ctx.lineWidth = 4.4; ctx.stroke();
        ctx.strokeStyle = davant ? '#d8b050' : '#a88a38'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(cx, cy + 8, R + 10, 9.5, 0, davant ? 0 : Math.PI, davant ? Math.PI : Math.PI * 2); ctx.stroke();
    };
    horitzo(false);
    // Esfera
    ctx.save(); ctx.translate(cx, cy);
    ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.clip();
    const oce = ctx.createRadialGradient(-10, -12, 3, 0, 0, R * 1.1);
    oce.addColorStop(0, '#9ed4ee'); oce.addColorStop(0.35, '#4c92c4'); oce.addColorStop(0.75, '#1f4f86'); oce.addColorStop(1, '#0e2850');
    ctx.fillStyle = oce; ctx.fillRect(-R, -R, 2 * R, 2 * R);
    ctx.rotate(tilt);
    const cont = (pts, c) => { ctx.fillStyle = c; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#4a3a18'; ctx.lineWidth = 0.9; ctx.stroke(); };
    cont([[-26, -14], [-18, -22], [-10, -18], [-14, -10], [-8, -2], [-12, 6], [-9, 14], [-14, 24], [-19, 14], [-18, 4], [-24, -4]], '#c8b868');     // Amèriques
    cont([[-17, -17], [-12, -20], [-12, -14], [-16, -12]], '#6a9a4a');
    cont([[0, -22], [8, -24], [14, -19], [8, -14], [1, -14]], '#6a9a4a');                                                                              // Europa
    cont([[0, -10], [10, -11], [16, -3], [12, 10], [6, 22], [1, 12], [-1, 2]], '#d6c276');                                                          // Àfrica
    cont([[10, -20], [22, -22], [28, -12], [24, -2], [16, -4], [12, -12]], '#b8c26a');                                                              // Àsia
    cont([[16, 12], [25, 12], [26, 19], [17, 20]], '#d6b05a');                                                                                        // Oceania
    cont([[-4, 25], [6, 25], [2, 29], [-3, 29]], '#e8eef4');                                                                                          // gel
    ctx.strokeStyle = 'rgba(255,255,255,0.32)'; ctx.lineWidth = 0.7;
    [-0.66, -0.33, 0, 0.33, 0.66].forEach(l => { const y = R * l, rx = Math.sqrt(R * R - y * y); ctx.beginPath(); ctx.ellipse(0, y, rx, rx * 0.16, 0, 0, Math.PI * 2); ctx.stroke(); });
    [0.3, 0.62, 0.9].forEach(c => { ctx.beginPath(); ctx.ellipse(0, 0, R * c, R, 0, 0, Math.PI * 2); ctx.stroke(); });
    ctx.beginPath(); ctx.moveTo(0, -R); ctx.lineTo(0, R); ctx.stroke();
    ctx.rotate(-tilt);
    // Volum: ombra cap a baix-dreta i llum d'estudi
    const om = ctx.createRadialGradient(-9, -11, 6, 4, 6, R * 1.15);
    om.addColorStop(0, 'rgba(255,255,255,0.28)'); om.addColorStop(0.45, 'rgba(0,0,0,0)'); om.addColorStop(1, 'rgba(0,0,30,0.62)');
    ctx.fillStyle = om; ctx.fillRect(-R, -R, 2 * R, 2 * R);
    ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.beginPath(); ctx.ellipse(-12, -14, 6, 3.4, -0.7, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    // Meridià de llautó, inclinat amb l'eix, i els pols
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(tilt);
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 5.4; ctx.beginPath(); ctx.ellipse(0, 0, R + 3.6, R + 3.6, 0, -Math.PI * 0.46, Math.PI * 1.46); ctx.stroke();
    ctx.strokeStyle = '#d4a840'; ctx.lineWidth = 3.4; ctx.stroke();
    ctx.strokeStyle = '#fff0b0'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(-0.6, -0.6, R + 3.4, R + 3.4, 0, Math.PI * 0.95, Math.PI * 1.45); ctx.stroke();
    ctx.strokeStyle = 'rgba(70,40,8,0.8)'; ctx.lineWidth = 0.8; for (let k = 0; k < 24; k++) { const a = k * Math.PI / 12; ctx.beginPath(); ctx.moveTo(Math.cos(a) * (R + 2), Math.sin(a) * (R + 2)); ctx.lineTo(Math.cos(a) * (R + 5), Math.sin(a) * (R + 5)); ctx.stroke(); }
    [-1, 1].forEach(s => { ctx.fillStyle = '#e8c458'; ctx.beginPath(); ctx.arc(0, s * (R + 4.6), 3.2, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.2; ctx.stroke(); });
    ctx.restore();
    horitzo(true);
}

// ---------- Cadira de lectura, vista des del darrere (la taula és a davant): respatller de fusta tallada i coixí vermell ----------
function pintarCadiraBiblio(ctx, w, h) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(w / 2, h - 5, 24, 5, 0, 0, Math.PI * 2); ctx.fill();
    // Seient i coixí (darrere del respatller, més al fons)
    ctx.fillStyle = '#6a4020'; ctx.fillRect(7, 44, w - 14, 7); ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.8; ctx.strokeRect(7, 44, w - 14, 7);
    ctx.fillStyle = gradVBib(ctx, 34, 46, [[0, '#b83a3a'], [1, '#6a1a1e']]);
    ctx.beginPath(); ctx.moveTo(10, 46); ctx.quadraticCurveTo(w / 2, 28, w - 10, 46); ctx.lineTo(w - 12, 48); ctx.lineTo(12, 48); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#d8b050'; ctx.beginPath(); ctx.arc(w / 2, 40, 1.8, 0, Math.PI * 2); ctx.fill();
    // Potes del darrere
    [[9, 10], [w - 9, w - 10]].forEach(([xa, xb]) => {
        ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(xa, 8); ctx.lineTo(xb, h - 8); ctx.stroke();
        ctx.strokeStyle = gradHBib(ctx, xa - 3, xa + 3, [[0, '#9a6a38'], [1, '#5a3418']]); ctx.strokeStyle = '#7a4a24'; ctx.lineWidth = 5; ctx.stroke();
        ctx.strokeStyle = 'rgba(255,220,160,0.4)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(xa - 1.4, 10); ctx.lineTo(xb - 1.4, h - 10); ctx.stroke();
    });
    // Travesser baix
    ctx.fillStyle = '#5a3418'; ctx.fillRect(10, h - 20, w - 20, 5); ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.6; ctx.strokeRect(10, h - 20, w - 20, 5);
    // Respatller: llistons verticals i travesser de dalt amb cresta
    for (let k = 0; k < 4; k++) {
        const x = 15 + k * ((w - 30) / 3.0);
        ctx.fillStyle = gradHBib(ctx, x - 2, x + 2, [[0, '#9a6a38'], [1, '#5a3418']]); ctx.fillRect(x - 2.2, 14, 4.4, 32); ctx.strokeRect(x - 2.2, 14, 4.4, 32);
    }
    ctx.fillStyle = gradVBib(ctx, 12, 26, [[0, '#a87644'], [1, '#6a4020']]);
    ctx.beginPath(); ctx.moveTo(4, 24); ctx.quadraticCurveTo(w / 2, 4, w - 4, 24); ctx.lineTo(w - 4, 30); ctx.lineTo(4, 30); ctx.closePath(); ctx.fill(); ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#d4a840'; [[6, 10], [w - 6, 10]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y + 10, 3.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });      // pom de les puntes
    ctx.fillStyle = '#5a3418'; ctx.fillRect(10, 34, w - 20, 5); ctx.strokeRect(10, 34, w - 20, 5);
}

// ---------- Faristol amb la Crònica del Miracle: peu torneat, pupitre inclinat i un llibre enorme obert, amb capitular il·luminada i ocellet ----------
function pintarFaristolCronica(ctx, w, h) {
    const cx = w / 2;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(cx, h - 6, 38, 7, 0, 0, Math.PI * 2); ctx.fill();
    // Peu: sòcol, columna torneada i collarí
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2;
    ctx.fillStyle = gradHBib(ctx, cx - 36, cx + 36, [[0, '#7a4a24'], [1, '#3a2010']]);
    ctx.beginPath(); ctx.moveTo(cx - 36, h - 6); ctx.lineTo(cx - 28, h - 22); ctx.lineTo(cx + 28, h - 22); ctx.lineTo(cx + 36, h - 6); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = gradHBib(ctx, cx - 8, cx + 8, [[0, '#a06a34'], [0.5, '#7a4a24'], [1, '#3a2010']]);
    ctx.fillRect(cx - 7, 78, 14, h - 100); ctx.strokeRect(cx - 7, 78, 14, h - 100);
    [[h - 40, 24, 7], [h - 54, 18, 6], [h - 68, 22, 7]].forEach(([y, ww, hh]) => { ctx.beginPath(); ctx.ellipse(cx, y, ww / 2, hh / 2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    // Pupitre inclinat
    ctx.fillStyle = gradVBib(ctx, 40, 88, [[0, '#7a4a24'], [1, '#4a2a14']]);
    ctx.beginPath(); ctx.moveTo(cx - 44, 80); ctx.lineTo(cx + 44, 80); ctx.lineTo(cx + 36, 44); ctx.lineTo(cx - 36, 44); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#a77848'; ctx.fillRect(cx - 46, 80, 92, 7); ctx.strokeRect(cx - 46, 80, 92, 7);
    ctx.fillStyle = 'rgba(255,230,170,0.35)'; ctx.fillRect(cx - 45, 81, 90, 1.4);
    // Llibre: tapes de cuir vermell amb cantoneres, pàgines amb curvatura
    ctx.fillStyle = '#6a1a1e'; ctx.beginPath(); ctx.moveTo(cx - 40, 76); ctx.lineTo(cx + 40, 76); ctx.lineTo(cx + 33, 12); ctx.lineTo(cx - 33, 12); ctx.closePath(); ctx.fill(); ctx.stroke();
    const pagina = (x0, x1, y0, y1, esq) => {
        ctx.fillStyle = gradHBib(ctx, x0, x1, esq ? [[0, '#f4e8c8'], [0.7, '#fbf3dc'], [1, '#c9b68a']] : [[0, '#c9b68a'], [0.3, '#fbf3dc'], [1, '#f4e8c8']]);
        ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0 + (esq ? 3 : 0), y0); ctx.lineTo(x1 - (esq ? 0 : 3), y0); ctx.lineTo(x1, y1); ctx.closePath(); ctx.fill(); ctx.stroke();
    };
    pagina(cx - 37, cx - 1.5, 15, 73, true); pagina(cx + 1.5, cx + 37, 15, 73, false);
    ctx.strokeStyle = 'rgba(120,96,56,0.6)'; ctx.lineWidth = 0.9;                      // cantell de fulls
    for (let k = 1; k <= 3; k++) { ctx.beginPath(); ctx.moveTo(cx - 37 - k * 0.8, 73 - k); ctx.lineTo(cx - 34 - k * 0.8, 15 + k); ctx.moveTo(cx + 37 + k * 0.8, 73 - k); ctx.lineTo(cx + 34 + k * 0.8, 15 + k); ctx.stroke(); }
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(cx, 15); ctx.lineTo(cx, 73); ctx.stroke();
    // Text
    ctx.strokeStyle = 'rgba(70,40,20,0.75)'; ctx.lineWidth = 1;
    for (let k = 0; k < 9; k++) { const y = 26 + k * 5.2; ctx.beginPath(); ctx.moveTo(cx - 31, y + 1); ctx.lineTo(cx - 6, y); ctx.stroke(); if (k > 2) { ctx.beginPath(); ctx.moveTo(cx + 6, y); ctx.lineTo(cx + 32, y + 1); ctx.stroke(); } }
    ctx.fillStyle = '#b01e24'; ctx.fillRect(cx - 33, 20, 11, 11); ctx.strokeStyle = '#d4a840'; ctx.lineWidth = 1.4; ctx.strokeRect(cx - 33, 20, 11, 11);      // capitular il·luminada
    ctx.fillStyle = '#f2d890'; ctx.font = 'bold 9px serif'; ctx.fillText('A', cx - 30.5, 29);
    ctx.fillStyle = '#2a3a6a'; ctx.beginPath(); ctx.ellipse(cx + 18, 33, 8, 5, -0.2, 0, Math.PI * 2); ctx.fill();                                     // un ocell dibuixat a la dreta
    ctx.beginPath(); ctx.moveTo(cx + 10, 31); ctx.lineTo(cx + 6, 27); ctx.lineTo(cx + 12, 29); ctx.fill();
    ctx.strokeStyle = '#d4a840'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx + 18, 38); ctx.lineTo(cx + 18, 43); ctx.stroke();
    // Cantoneres de llautó, tancador i cinta vermella penjant
    ctx.fillStyle = '#d4a840'; ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.2;
    [[cx - 40, 76], [cx + 40, 76]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 3.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    ctx.fillStyle = '#c0281e'; ctx.beginPath(); ctx.moveTo(cx - 2, 70); ctx.lineTo(cx + 3, 70); ctx.lineTo(cx + 3, 94); ctx.lineTo(cx + 0.5, 91); ctx.lineTo(cx - 2, 94); ctx.closePath(); ctx.fill(); ctx.stroke();
    // Resplendor suau
    const lluent = ctx.createRadialGradient(cx, 44, 4, cx, 44, 50); lluent.addColorStop(0, 'rgba(255,230,160,0.35)'); lluent.addColorStop(1, 'rgba(255,230,160,0)');
    ctx.fillStyle = lluent; ctx.fillRect(0, 0, w, 100);
}

// ---------- Escala de mà amb ganxos de llautó a dalt i rodes a baix ----------
function pintarEscalaBiblio(ctx, w, h) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(w / 2 + 6, h - 4, 34, 5, 0, 0, Math.PI * 2); ctx.fill();
    const L = [[8, 10, 30, h - 14], [44, 10, 66, h - 14]];
    for (let k = 0; k < 9; k++) {                                                     // graons
        const t = (k + 0.7) / 9.4, x0 = L[0][0] + (L[0][2] - L[0][0]) * t, x1 = L[1][0] + (L[1][2] - L[1][0]) * t, y = 10 + (h - 24) * t;
        ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
        ctx.strokeStyle = '#a06a34'; ctx.lineWidth = 3.6; ctx.stroke();
        ctx.strokeStyle = 'rgba(255,225,170,0.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y - 1.2); ctx.lineTo(x1, y - 1.2); ctx.stroke();
    }
    L.forEach(([xa, ya, xb, yb]) => {                                                  // muntants
        ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(xa, ya); ctx.lineTo(xb, yb); ctx.stroke();
        ctx.strokeStyle = '#8a5a2c'; ctx.lineWidth = 5; ctx.stroke();
        ctx.strokeStyle = 'rgba(255,225,170,0.45)'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(xa - 1.4, ya + 2); ctx.lineTo(xb - 1.4, yb - 2); ctx.stroke();
        ctx.fillStyle = '#7a7a82'; ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(xb, yb + 4, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();       // roda
        ctx.fillStyle = '#d4a840'; ctx.beginPath(); ctx.arc(xb, yb + 4, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#d4a840'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xa, ya - 1); ctx.quadraticCurveTo(xa - 6, ya - 6, xa - 6, ya + 6); ctx.stroke();   // ganxo de llautó
        ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1; ctx.stroke();
    });
}

// ---------- Taula llarga de lectura: tauler de noguer amb filet daurat, faldó amb arquets, potes torneades, llibres oberts, tinter i rotlle ----------
function pintarTaulaBiblio(ctx, w, h) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(w / 2, h - 6, w * 0.48, 8, 0, 0, Math.PI * 2); ctx.fill();
    // Potes torneades (les del darrere, més curtes, i les del davant)
    const pota = (x, y0, y1, ample) => {
        ctx.fillStyle = gradHBib(ctx, x - ample, x + ample, [[0, '#8a5a2c'], [0.5, '#6a4020'], [1, '#32190a']]);
        ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2;
        ctx.fillRect(x - ample / 2, y0, ample, y1 - y0); ctx.strokeRect(x - ample / 2, y0, ample, y1 - y0);
        [0.3, 0.55, 0.8].forEach(f => { const y = y0 + (y1 - y0) * f; ctx.beginPath(); ctx.ellipse(x, y, ample * 0.8, 3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
        ctx.fillStyle = '#4a2a14'; ctx.fillRect(x - ample * 0.8, y1 - 2, ample * 1.6, 5); ctx.strokeRect(x - ample * 0.8, y1 - 2, ample * 1.6, 5);
    };
    pota(34, 70, h - 14, 9); pota(w - 34, 70, h - 14, 9);
    pota(14, 88, h - 4, 12); pota(w - 14, 88, h - 4, 12);
    // Faldó del davant, amb arquets tallats
    ctx.fillStyle = gradVBib(ctx, 64, 90, [[0, '#6a4020'], [1, '#3a200e']]); ctx.fillRect(0, 64, w, 24); ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2.2; ctx.strokeRect(0, 64, w, 24);
    ctx.fillStyle = '#2a1608';
    for (let x = 30; x < w - 40; x += 36) { ctx.beginPath(); ctx.moveTo(x, 86); ctx.lineTo(x, 76); ctx.quadraticCurveTo(x + 13, 64, x + 26, 76); ctx.lineTo(x + 26, 86); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    // Tauler: vora davantera amb ressalt i cara de dalt (trapezi en perspectiva)
    ctx.fillStyle = gradVBib(ctx, 0, 64, [[0, '#7a4a28'], [0.5, '#6a3e20'], [1, '#583218']]);
    ctx.beginPath(); ctx.moveTo(14, 2); ctx.lineTo(w - 14, 2); ctx.lineTo(w, 64); ctx.lineTo(0, 64); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(30,14,4,0.35)'; ctx.lineWidth = 1;                    // veta
    for (let k = 0; k < 14; k++) { const y = 6 + k * 4.2; ctx.beginPath(); ctx.moveTo(18 + k * 0.5, y); ctx.bezierCurveTo(w * 0.3, y - 3, w * 0.6, y + 3, w - 18 - k * 0.5, y - 1); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(212,168,64,0.8)'; ctx.lineWidth = 1.6;                // filet daurat
    ctx.beginPath(); ctx.moveTo(26, 8); ctx.lineTo(w - 26, 8); ctx.lineTo(w - 12, 58); ctx.lineTo(12, 58); ctx.closePath(); ctx.stroke();
    ctx.fillStyle = '#a77848'; ctx.fillRect(0, 60, w, 6); ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2; ctx.strokeRect(0, 60, w, 6);
    ctx.fillStyle = 'rgba(255,230,170,0.4)'; ctx.fillRect(1, 61, w - 2, 1.4);
    // Llibres oberts
    const obert = (x, y) => {
        ctx.fillStyle = '#4a1418'; ctx.fillRect(x - 3, y - 2, 78, 32); ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.4; ctx.strokeRect(x - 3, y - 2, 78, 32);
        [[x, x + 35], [x + 37, x + 72]].forEach(([a, b], i) => {
            ctx.fillStyle = gradHBib(ctx, a, b, i ? [[0, '#c9b68a'], [0.3, '#fbf3dc'], [1, '#f2e6c8']] : [[0, '#f2e6c8'], [0.7, '#fbf3dc'], [1, '#c9b68a']]); ctx.fillRect(a, y, 35, 28); ctx.strokeRect(a, y, 35, 28);
            ctx.strokeStyle = 'rgba(90,60,30,0.7)'; ctx.lineWidth = 0.8; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(a + 4, y + 5 + k * 4.4); ctx.lineTo(b - 4, y + 5 + k * 4.4); ctx.stroke(); }
            ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.4;
        });
        ctx.fillStyle = '#b01e24'; ctx.fillRect(x + 4, y + 4, 6, 6);
    };
    obert(w * 0.17, 14); obert(w * 0.62, 16);
    // Tinter amb ploma, rotlle amb segell i pila de llibres
    ctx.fillStyle = '#16162a'; ctx.beginPath(); ctx.arc(w * 0.46, 36, 7, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.strokeStyle = '#f2ecdc'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(w * 0.46 + 2, 32); ctx.quadraticCurveTo(w * 0.46 + 10, 20, w * 0.46 + 18, 12); ctx.stroke();
    ctx.fillStyle = '#e8d8a8'; ctx.fillRect(w * 0.37, 44, 40, 9); ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.4; ctx.strokeRect(w * 0.37, 44, 40, 9);
    ctx.fillStyle = '#b01e24'; ctx.beginPath(); ctx.arc(w * 0.37 + 38, 48.5, 3, 0, Math.PI * 2); ctx.fill();
    [['#7a1e24', 34, 16], ['#2a4a7a', 30, 12], ['#3a6a3a', 26, 8]].forEach(([c, ww, y]) => { ctx.fillStyle = c; ctx.fillRect(w * 0.85 - ww / 2, y + 34, ww, 7); ctx.strokeRect(w * 0.85 - ww / 2, y + 34, ww, 7); ctx.fillStyle = '#e8dcc0'; ctx.fillRect(w * 0.85 + ww / 2 - 4, y + 35, 4, 5); });
}

// ---------- Catifa llarga: vermell fosc, vora daurada amb cercles, losanges i serrells als extrems ----------
function pintarCatifaBiblio(ctx, w, h) {
    const r = rndBib(5);
    ctx.fillStyle = '#6a1620'; ctx.fillRect(0, 10, w, h - 20);
    for (let k = 0; k < 260; k++) { ctx.fillStyle = r() < 0.5 ? 'rgba(0,0,0,0.07)' : 'rgba(255,200,160,0.05)'; ctx.fillRect(r() * w, 10 + r() * (h - 20), 6 + r() * 20, 1.4); }
    ctx.strokeStyle = '#c9a23c'; ctx.lineWidth = 6; ctx.strokeRect(4, 14, w - 8, h - 28);
    ctx.strokeStyle = '#2a0a0e'; ctx.lineWidth = 1.4; ctx.strokeRect(10, 20, w - 20, h - 40); ctx.strokeRect(1, 11, w - 2, h - 22);
    ctx.fillStyle = '#c9a23c';
    for (let y = 30; y < h - 30; y += 14) { [18, w - 18].forEach(x => { ctx.beginPath(); ctx.arc(x, y, 3.4, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#2a0a0e'; ctx.lineWidth = 0.8; ctx.stroke(); }); }
    ctx.strokeStyle = 'rgba(201,162,60,0.5)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(30, 28); ctx.lineTo(30, h - 28); ctx.moveTo(w - 30, 28); ctx.lineTo(w - 30, h - 28); ctx.stroke();
    for (let y = 56; y < h - 50; y += 78) {                                           // medallons de losanges
        const cx = w / 2;
        ctx.fillStyle = '#c9a23c'; ctx.beginPath(); ctx.moveTo(cx, y - 22); ctx.lineTo(cx + 20, y); ctx.lineTo(cx, y + 22); ctx.lineTo(cx - 20, y); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#2a0a0e'; ctx.lineWidth = 1.4; ctx.stroke();
        ctx.fillStyle = '#7a1c28'; ctx.beginPath(); ctx.moveTo(cx, y - 14); ctx.lineTo(cx + 12, y); ctx.lineTo(cx, y + 14); ctx.lineTo(cx - 12, y); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#e8c458'; ctx.beginPath(); ctx.arc(cx, y, 3.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#c9a23c'; [-1, 1].forEach(s => { ctx.fillRect(cx + s * 32 - 3, y - 3, 6, 6); });
        if (y + 78 < h - 50) { ctx.strokeStyle = '#c9a23c'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(cx, y + 24); ctx.lineTo(cx, y + 54); ctx.stroke(); }
    }
    ctx.strokeStyle = '#d8c8a0'; ctx.lineWidth = 1.6;                                 // serrells
    for (let x = 4; x < w - 2; x += 5) { ctx.beginPath(); ctx.moveTo(x, 10); ctx.lineTo(x + (r() - 0.5) * 3, 1); ctx.moveTo(x, h - 10); ctx.lineTo(x + (r() - 0.5) * 3, h - 1); ctx.stroke(); }
}

// ---------- Parquet de taulons de roure en cistell (peça repetible 64x64) ----------
function pintarParquetBiblio(ctx, w, h) {
    const r = rndBib(21), tons = ['#94622f', '#875629', '#9e6c38', '#7c4e25', '#90602d'];
    ctx.fillStyle = '#2a1608'; ctx.fillRect(0, 0, w, h);
    for (let by = 0; by < 2; by++) for (let bx = 0; bx < 2; bx++) {
        const horitzontal = (bx + by) % 2 === 0;
        for (let k = 0; k < 4; k++) {
            const x = bx * 32 + (horitzontal ? 0 : k * 8), y = by * 32 + (horitzontal ? k * 8 : 0), pw = horitzontal ? 32 : 8, ph = horitzontal ? 8 : 32;
            ctx.fillStyle = tons[Math.floor(r() * tons.length)]; ctx.fillRect(x + 0.6, y + 0.6, pw - 1.2, ph - 1.2);
            ctx.fillStyle = 'rgba(255,225,170,0.18)'; if (horitzontal) ctx.fillRect(x + 0.6, y + 0.6, pw - 1.2, 1.2); else ctx.fillRect(x + 0.6, y + 0.6, 1.2, ph - 1.2);
            ctx.strokeStyle = 'rgba(50,24,8,0.32)'; ctx.lineWidth = 0.7; ctx.beginPath();
            if (horitzontal) { ctx.moveTo(x + 3, y + 3 + r() * 2); ctx.lineTo(x + pw - 4, y + 3 + r() * 2); } else { ctx.moveTo(x + 3 + r() * 2, y + 3); ctx.lineTo(x + 3 + r() * 2, y + ph - 4); }
            ctx.stroke();
        }
    }
}

// ---------- Paret de pedra picada amb sòcol de fusta amb plafons i cornisa ----------
function pintarParetBiblio(ctx, w, h) {
    const r = rndBib(9), soc = 40;
    ctx.fillStyle = '#6a5a48'; ctx.fillRect(0, 0, w, h);
    const alt = 26;
    for (let y = 0, f = 0; y < h - soc; y += alt, f++) for (let x = -((f % 2) * 35); x < w; x += 70) {
        const t = 0.9 + r() * 0.2;
        ctx.fillStyle = `rgb(${Math.round(112 * t)},${Math.round(98 * t)},${Math.round(78 * t)})`; ctx.fillRect(x + 1, y + 1, 68, alt - 2);
        ctx.fillStyle = 'rgba(255,240,200,0.07)'; ctx.fillRect(x + 1, y + 1, 68, 2);
        ctx.strokeStyle = 'rgba(30,20,10,0.5)'; ctx.lineWidth = 1.2; ctx.strokeRect(x + 1, y + 1, 68, alt - 2);
    }
    ctx.fillStyle = gradVBib(ctx, 0, h - soc, [[0, 'rgba(0,0,0,0.45)'], [0.35, 'rgba(0,0,0,0.05)'], [1, 'rgba(0,0,0,0.18)']]); ctx.fillRect(0, 0, w, h - soc);
    // Sòcol de fusta amb plafons
    ctx.fillStyle = gradVBib(ctx, h - soc, h, [[0, '#6a4020'], [1, '#3a200e']]); ctx.fillRect(0, h - soc, w, soc);
    ctx.fillStyle = '#a77848'; ctx.fillRect(0, h - soc - 4, w, 6); ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.8; ctx.strokeRect(0, h - soc - 4, w, 6);
    for (let x = 12; x < w - 40; x += 74) { ctx.fillStyle = '#4a2a14'; ctx.fillRect(x, h - soc + 8, 62, soc - 16); ctx.strokeRect(x, h - soc + 8, 62, soc - 16); ctx.fillStyle = 'rgba(255,225,170,0.2)'; ctx.fillRect(x, h - soc + 8, 62, 1.4); }
}

// ---------- Pila de llibres a terra ----------
function pintarPilaBiblio(ctx, w, h, n, llavor) {
    const r = rndBib(llavor);
    ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.beginPath(); ctx.ellipse(w / 2, h - 5, w * 0.46, 5, 0, 0, Math.PI * 2); ctx.fill();
    let y = h - 8;
    for (let k = 0; k < n; k++) {
        const bh = 8 + r() * 3, bw = w - 10 - r() * 10;
        llibreBib(ctx, (w - bw) / 2 + (r() - 0.5) * 5, y - bh, bw, bh, PALETA_LLIBRES_BIB[Math.floor(r() * PALETA_LLIBRES_BIB.length)], true, r);
        y -= bh;
    }
}
