/**
 * EL PRÒLEG: els cinc quadres pintats de la llegenda (720 x 950, la part de dalt de la pantalla; a sota hi ha el text).
 * Cada funció pinta el fons d'un quadre; l'escena (EscenaProleg, a main.js) hi afegeix els moviments: boira, finestres, llums.
 * Si hi ha la il·lustració definitiva a assets/proleg/<nom>.webp (vegeu CATALEG a assets.js), el joc fa servir aquella.
 * Fan servir els ajudants de dibuixos_biblio.js (rndBib, gradVBib).
 */

const PROLEG_C = '#0c0604';

// Serralada: un perfil de muntanya amb soroll, omplert fins a baix
function serraProleg(ctx, w, h, y, amp, color, llavor, pas = 24) {
    const r = rndBib(llavor);
    ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, h);
    let yy = y;
    for (let x = 0; x <= w + pas; x += pas) { yy += (r() - 0.5) * amp * 0.5; yy = Math.max(y - amp, Math.min(y + amp * 0.4, yy)); ctx.lineTo(x, yy); }
    ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
}

// Una gàbia d'ocell en forma de campana, amb l'ocell que llueix a dins
function gabiaProleg(ctx, x, y, r, llum = '#ffd870') {
    const gl = ctx.createRadialGradient(x, y, 2, x, y, r * 2.4); gl.addColorStop(0, llum + 'aa'); gl.addColorStop(1, llum + '00');
    ctx.fillStyle = gl; ctx.fillRect(x - r * 2.4, y - r * 2.4, r * 4.8, r * 4.8);
    ctx.fillStyle = llum; ctx.beginPath(); ctx.ellipse(x, y + r * 0.2, r * 0.42, r * 0.3, 0, 0, Math.PI * 2); ctx.fill();      // l'ocell
    ctx.beginPath(); ctx.arc(x + r * 0.35, y - r * 0.05, r * 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = PROLEG_C; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(x - r, y + r); ctx.lineTo(x - r, y - r * 0.2); ctx.quadraticCurveTo(x - r, y - r * 1.3, x, y - r * 1.4); ctx.quadraticCurveTo(x + r, y - r * 1.3, x + r, y - r * 0.2); ctx.lineTo(x + r, y + r); ctx.stroke();
    for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(x + k * r * 0.4, y + r); ctx.lineTo(x + k * r * 0.4, y - r * (1.3 - Math.abs(k) * 0.25)); ctx.stroke(); }
    ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - r * 1.1, y + r); ctx.lineTo(x + r * 1.1, y + r); ctx.stroke();
    ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y - r * 1.55, r * 0.18, 0, Math.PI * 2); ctx.stroke();
}

// Silueta d'un nen o una nena (d'esquena o de cara, és igual: és una ombra)
function nenProleg(ctx, x, y, alt, color) {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x, y - alt * 0.84, alt * 0.14, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - alt * 0.16, y - alt * 0.68); ctx.lineTo(x + alt * 0.16, y - alt * 0.68); ctx.lineTo(x + alt * 0.22, y - alt * 0.22); ctx.lineTo(x - alt * 0.22, y - alt * 0.22); ctx.closePath(); ctx.fill();
    ctx.fillRect(x - alt * 0.14, y - alt * 0.24, alt * 0.1, alt * 0.24); ctx.fillRect(x + alt * 0.04, y - alt * 0.24, alt * 0.1, alt * 0.24);
}

// Silueta d'un monjo amb hàbit i caputxa
function monjoProleg(ctx, x, y, alt, color) {
    ctx.fillStyle = color; ctx.beginPath();
    ctx.moveTo(x, y - alt); ctx.quadraticCurveTo(x + alt * 0.16, y - alt * 0.98, x + alt * 0.16, y - alt * 0.8);
    ctx.lineTo(x + alt * 0.3, y); ctx.lineTo(x - alt * 0.3, y); ctx.lineTo(x - alt * 0.16, y - alt * 0.8);
    ctx.quadraticCurveTo(x - alt * 0.16, y - alt * 0.98, x, y - alt); ctx.closePath(); ctx.fill();
}

// Una casa del poble: parets de pedra, teulada de teules, porta i finestra (lluminosa o no)
function casaProleg(ctx, x, y, w, h, finestra) {
    const r = rndBib(Math.round(x));
    const g = ctx.createLinearGradient(x, y - h, x + w, y); g.addColorStop(0, '#3a3450'); g.addColorStop(1, '#1c1a2c');
    ctx.fillStyle = g; ctx.fillRect(x, y - h, w, h);
    ctx.strokeStyle = 'rgba(10,8,20,0.6)'; ctx.lineWidth = 1;
    for (let yy = y - h + 14; yy < y; yy += 16) for (let xx = x + (yy % 32 ? 0 : 12); xx < x + w; xx += 26 + r() * 8) ctx.strokeRect(xx, yy - 14, 24, 14);
    ctx.fillStyle = '#4a2a30'; ctx.beginPath(); ctx.moveTo(x - 14, y - h + 4); ctx.lineTo(x + w / 2, y - h - h * 0.45); ctx.lineTo(x + w + 14, y - h + 4); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(20,8,10,0.6)'; for (let k = 1; k < 6; k++) { ctx.beginPath(); ctx.moveTo(x - 14 + k * 4, y - h + 4 - k * (h * 0.45) / 6); ctx.lineTo(x + w + 14 - k * 4, y - h + 4 - k * (h * 0.45) / 6); ctx.stroke(); }
    ctx.fillStyle = '#120e18'; ctx.fillRect(x + w * 0.62, y - h * 0.5, w * 0.22, h * 0.5);
    if (finestra) { ctx.fillStyle = finestra; ctx.fillRect(x + w * 0.16, y - h * 0.72, w * 0.26, h * 0.3); ctx.strokeStyle = '#120e18'; ctx.lineWidth = 3; ctx.strokeRect(x + w * 0.16, y - h * 0.72, w * 0.26, h * 0.3); ctx.beginPath(); ctx.moveTo(x + w * 0.29, y - h * 0.72); ctx.lineTo(x + w * 0.29, y - h * 0.42); ctx.stroke(); }
}

// Gra de pintura: punts clars i foscos per tot el quadre (perquè no sembli pla)
function graProleg(ctx, w, h, llavor, n = 1400) {
    const r = rndBib(llavor);
    for (let i = 0; i < n; i++) { ctx.fillStyle = r() < 0.5 ? 'rgba(255,240,210,0.035)' : 'rgba(0,0,0,0.05)'; ctx.fillRect(r() * w, r() * h, 2 + r() * 3, 2 + r() * 3); }
}

// Vinyeta: les vores s'enfosqueixen
function vinyetaProleg(ctx, w, h, forca = 0.75) {
    const g = ctx.createRadialGradient(w / 2, h * 0.48, h * 0.25, w / 2, h * 0.5, h * 0.75);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${forca})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
}

// ---------- 1. L'Ocellaire, a la fira del Miracle, fa tres-cents anys ----------
function pintarProlegOcellaire(ctx, w, h) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.fillStyle = gradVBib(ctx, 0, h, [[0, '#3a2440'], [0.35, '#a0503a'], [0.6, '#e09a54'], [1, '#5a3420']]); ctx.fillRect(0, 0, w, h);
    const sol = ctx.createRadialGradient(w * 0.5, h * 0.5, 10, w * 0.5, h * 0.5, 420); sol.addColorStop(0, 'rgba(255,214,140,0.85)'); sol.addColorStop(1, 'rgba(255,214,140,0)');
    ctx.fillStyle = sol; ctx.fillRect(0, 0, w, h);
    serraProleg(ctx, w, h, h * 0.5, 70, '#7a4a5a', 11, 30);
    serraProleg(ctx, w, h, h * 0.56, 50, '#5a3448', 23, 24);
    // El Santuari dalt del turó, a contrallum
    ctx.fillStyle = '#3a2030'; ctx.fillRect(w * 0.7, h * 0.42, 120, 70); ctx.fillRect(w * 0.79, h * 0.33, 34, 100);
    ctx.beginPath(); ctx.moveTo(w * 0.79 - 6, h * 0.33); ctx.lineTo(w * 0.79 + 17, h * 0.28); ctx.lineTo(w * 0.79 + 40, h * 0.33); ctx.fill();
    ctx.beginPath(); ctx.moveTo(w * 0.7 - 8, h * 0.42); ctx.lineTo(w * 0.7 + 60, h * 0.38); ctx.lineTo(w * 0.7 + 128, h * 0.42); ctx.fill();
    serraProleg(ctx, w, h, h * 0.64, 26, '#3a2228', 37, 20);
    // Parades de la fira, amb tendals de ratlles i banderetes
    [[30, 0.66, '#a0302a'], [w - 210, 0.67, '#2a5a7a']].forEach(([x, f, c]) => {
        const y = h * f;
        ctx.fillStyle = '#2a1810'; ctx.fillRect(x + 8, y, 8, 120); ctx.fillRect(x + 164, y, 8, 120); ctx.fillRect(x, y + 70, 180, 50);
        for (let k = 0; k < 6; k++) { ctx.fillStyle = k % 2 ? '#e8d8b0' : c; ctx.beginPath(); ctx.moveTo(x + k * 30, y); ctx.lineTo(x + k * 30 + 30, y); ctx.lineTo(x + k * 30 + 30, y + 26); ctx.quadraticCurveTo(x + k * 30 + 15, y + 36, x + k * 30, y + 26); ctx.closePath(); ctx.fill(); }
    });
    ctx.strokeStyle = '#2a1810'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, h * 0.6); ctx.quadraticCurveTo(w / 2, h * 0.66, w, h * 0.6); ctx.stroke();
    for (let k = 0; k < 16; k++) { const x = k * 46 + 10, y = h * 0.6 + Math.sin(k / 15 * Math.PI) * h * 0.04 + 2; ctx.fillStyle = ['#c8402a', '#e8c040', '#3a7a5a', '#3a5a9a'][k % 4]; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 16, y); ctx.lineTo(x + 8, y + 20); ctx.closePath(); ctx.fill(); }
    // Terra de la plaça
    ctx.fillStyle = gradVBib(ctx, h * 0.78, h, [[0, '#4a2e1c'], [1, '#22140c']]); ctx.fillRect(0, h * 0.78, w, h * 0.22);
    // L'Ocellaire: alt i prim, abric de plomes fins als peus, barret d'ala ampla amb plomes, i un jou amb gàbies a les espatlles
    const cx = w * 0.5, peus = h * 0.86;
    ctx.fillStyle = '#140a08';
    ctx.beginPath(); ctx.moveTo(cx - 34, peus - 400); ctx.quadraticCurveTo(cx - 80, peus - 200, cx - 120, peus);
    for (let k = 0; k <= 10; k++) ctx.lineTo(cx - 120 + k * 24, peus - (k % 2 ? 22 : 0));                 // vora de plomes
    ctx.quadraticCurveTo(cx + 80, peus - 200, cx + 34, peus - 400); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(255,170,90,0.55)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - 34, peus - 396); ctx.quadraticCurveTo(cx - 80, peus - 200, cx - 118, peus - 4); ctx.stroke();   // contrallum
    ctx.strokeStyle = 'rgba(120,70,40,0.35)'; ctx.lineWidth = 1.5;
    for (let k = 0; k < 9; k++) { const yy = peus - 360 + k * 40; ctx.beginPath(); ctx.moveTo(cx - 30 - k * 9, yy); ctx.quadraticCurveTo(cx, yy + 14, cx + 30 + k * 9, yy); ctx.stroke(); }
    ctx.fillStyle = '#140a08'; ctx.beginPath(); ctx.arc(cx, peus - 430, 34, 0, Math.PI * 2); ctx.fill();                   // cap
    ctx.beginPath(); ctx.ellipse(cx, peus - 456, 92, 16, -0.06, 0, Math.PI * 2); ctx.fill();                                  // ala del barret
    ctx.beginPath(); ctx.moveTo(cx - 40, peus - 460); ctx.lineTo(cx - 30, peus - 540); ctx.quadraticCurveTo(cx, peus - 552, cx + 34, peus - 536); ctx.lineTo(cx + 42, peus - 462); ctx.closePath(); ctx.fill();
    ['#c8402a', '#e8c040', '#3a8a6a'].forEach((c, i) => { ctx.strokeStyle = c; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx + 30, peus - 520 + i * 8); ctx.quadraticCurveTo(cx + 80 + i * 10, peus - 600 + i * 12, cx + 110 + i * 14, peus - 560 + i * 16); ctx.stroke(); });
    ctx.fillStyle = '#ffd870'; ctx.beginPath(); ctx.ellipse(cx - 12, peus - 428, 4, 2.4, 0, 0, Math.PI * 2); ctx.ellipse(cx + 12, peus - 428, 4, 2.4, 0, 0, Math.PI * 2); ctx.fill();   // ulls que brillen
    ctx.strokeStyle = 'rgba(255,216,112,0.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, peus - 412, 14, 0.25, Math.PI - 0.25); ctx.stroke();        // somriure
    // Jou i gàbies
    ctx.strokeStyle = '#2a1608'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(cx - 250, peus - 360); ctx.quadraticCurveTo(cx, peus - 400, cx + 250, peus - 360); ctx.stroke();
    [[-230, 70], [-140, 120], [140, 110], [230, 66]].forEach(([dx, cor]) => {
        const x = cx + dx, y0 = peus - 368 - (Math.abs(dx) < 200 ? 18 : 0);
        ctx.strokeStyle = '#2a1608'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + cor); ctx.stroke();
        gabiaProleg(ctx, x, y0 + cor + 36, 26);
    });
    // Els nens, sense color, i el seu riure (fils daurats) que vola cap a les gàbies
    [[110, '#5a5a6a'], [190, '#4a4a5a'], [w - 190, '#5a5a6a'], [w - 110, '#4a4a5a']].forEach(([x, c], i) => {
        nenProleg(ctx, x, h * 0.96, 120 + (i % 2) * 14, c);
        ctx.strokeStyle = 'rgba(255,220,130,0.7)'; ctx.lineWidth = 3; ctx.setLineDash([6, 8]);
        ctx.beginPath(); ctx.moveTo(x, h * 0.96 - 140); ctx.bezierCurveTo(x + (x < w / 2 ? 40 : -40), h * 0.7, cx + (x < w / 2 ? -180 : 180), h * 0.62, cx + (x < w / 2 ? -150 : 150), peus - 230); ctx.stroke();
        ctx.setLineDash([]);
    });
    graProleg(ctx, w, h, 5);
    vinyetaProleg(ctx, w, h, 0.7);
}

// ---------- 2. La gàbia sota terra: els pastors i els monjos el tanquen i un monjo segella la porta amb Runna ----------
function pintarProlegSegell(ctx, w, h) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.fillStyle = gradVBib(ctx, 0, h, [[0, '#0a0810'], [0.5, '#1c1628'], [1, '#0c0a12']]); ctx.fillRect(0, 0, w, h);
    const r = rndBib(77);
    // Volta de roca amb estalactites
    ctx.fillStyle = '#16121e'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w, 0); ctx.lineTo(w, 140);
    for (let x = w; x >= 0; x -= 30) ctx.lineTo(x, 110 + r() * 60 + (x % 90 === 0 ? 50 : 0)); ctx.closePath(); ctx.fill();
    // Resplendor lila de la gàbia, al fons
    const gl = ctx.createRadialGradient(w * 0.32, h * 0.46, 20, w * 0.32, h * 0.46, 330); gl.addColorStop(0, 'rgba(160,90,255,0.6)'); gl.addColorStop(1, 'rgba(160,90,255,0)');
    ctx.fillStyle = gl; ctx.fillRect(0, 0, w, h);
    // La gàbia gegant, amb l'Ocellaire a dins (silueta i ulls)
    const gx = w * 0.32, gb = h * 0.72, gw = 300, gh = 470;
    ctx.fillStyle = '#05030a'; monjoProleg(ctx, gx, gb - 20, 260, '#05030a');
    ctx.beginPath(); ctx.ellipse(gx, gb - 270, 70, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#d8b0ff'; ctx.beginPath(); ctx.ellipse(gx - 10, gb - 240, 4, 2.4, 0, 0, Math.PI * 2); ctx.ellipse(gx + 10, gb - 240, 4, 2.4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#2a2236'; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.ellipse(gx, gb, gw / 2, 26, 0, 0, Math.PI * 2); ctx.stroke();
    for (let k = 0; k <= 10; k++) { const x = gx - gw / 2 + k * gw / 10, d = Math.sqrt(Math.max(0, (gw / 2) ** 2 - (x - gx) ** 2)); ctx.beginPath(); ctx.moveTo(x, gb); ctx.lineTo(x, gb - gh + gw / 2 - d * 0.95); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(gx, gb - gh + gw / 2, gw / 2, Math.PI, 0); ctx.stroke();
    ctx.strokeStyle = 'rgba(200,150,255,0.35)'; ctx.lineWidth = 2;
    for (let k = 0; k <= 10; k++) { const x = gx - gw / 2 + k * gw / 10 - 3; ctx.beginPath(); ctx.moveTo(x, gb); ctx.lineTo(x, gb - 200); ctx.stroke(); }
    // Pastors amb gaiatos i monjos, a la dreta, fent força
    [[w * 0.66, 120, 'past'], [w * 0.74, 132, 'monjo'], [w * 0.83, 118, 'past']].forEach(([x, alt, t]) => {
        if (t === 'monjo') monjoProleg(ctx, x, h * 0.84, alt, '#0a0810');
        else { nenProleg(ctx, x, h * 0.84, alt, '#0a0810'); ctx.strokeStyle = '#0a0810'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x + 22, h * 0.84); ctx.lineTo(x + 22, h * 0.84 - alt * 1.1); ctx.arc(x + 32, h * 0.84 - alt * 1.1, 10, Math.PI, 0); ctx.stroke(); }
    });
    // El monjo de Runna, en primer pla, amb l'espasa de llum enlaire
    const mx = w * 0.62, my = h * 0.98;
    const llum = ctx.createRadialGradient(mx + 60, my - 520, 10, mx + 60, my - 520, 300); llum.addColorStop(0, 'rgba(210,235,255,0.75)'); llum.addColorStop(1, 'rgba(210,235,255,0)');
    ctx.fillStyle = llum; ctx.fillRect(0, 0, w, h);
    for (let k = 0; k < 7; k++) { ctx.strokeStyle = 'rgba(200,230,255,0.18)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(mx + 60, my - 520); ctx.lineTo(gx - 160 + k * 55, gb - 300 + k * 50); ctx.stroke(); }
    monjoProleg(ctx, mx, my, 360, '#030204');
    ctx.strokeStyle = 'rgba(190,220,255,0.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(mx + 6, my - 356); ctx.quadraticCurveTo(mx + 60, my - 340, mx + 104, my - 6); ctx.stroke();   // contrallum
    ctx.strokeStyle = '#030204'; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(mx + 30, my - 260); ctx.lineTo(mx + 60, my - 380); ctx.stroke();    // braç
    ctx.fillStyle = '#e8f4ff'; ctx.beginPath(); ctx.moveTo(mx + 56, my - 400); ctx.lineTo(mx + 70, my - 400); ctx.lineTo(mx + 66, my - 640); ctx.lineTo(mx + 60, my - 660); ctx.lineTo(mx + 54, my - 640); ctx.closePath(); ctx.fill();   // fulla
    ctx.fillStyle = '#c8a040'; ctx.fillRect(mx + 40, my - 404, 46, 9);
    graProleg(ctx, w, h, 9);
    vinyetaProleg(ctx, w, h, 0.8);
}

// ---------- 3. Ara: el Santuari de nit, i la boira lila que surt de terra ----------
function pintarProlegBoira(ctx, w, h) {
    ctx.fillStyle = gradVBib(ctx, 0, h, [[0, '#04060f'], [0.55, '#1a1838'], [1, '#2a1a40']]); ctx.fillRect(0, 0, w, h);
    const r = rndBib(31);
    for (let i = 0; i < 160; i++) { ctx.fillStyle = `rgba(255,255,255,${0.2 + r() * 0.7})`; const s = r() < 0.1 ? 2.4 : 1.2; ctx.fillRect(r() * w, r() * h * 0.5, s, s); }
    const ll = ctx.createRadialGradient(w * 0.78, h * 0.17, 20, w * 0.78, h * 0.17, 160); ll.addColorStop(0, 'rgba(244,236,208,0.35)'); ll.addColorStop(1, 'rgba(244,236,208,0)');
    ctx.fillStyle = ll; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#f4ecd0'; ctx.beginPath(); ctx.arc(w * 0.78, h * 0.17, 46, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(200,190,160,0.35)'; [[-12, -8, 9], [14, 10, 6], [4, -20, 5]].forEach(([dx, dy, rr]) => { ctx.beginPath(); ctx.arc(w * 0.78 + dx, h * 0.17 + dy, rr, 0, Math.PI * 2); ctx.fill(); });
    // Núvols prims davant la lluna
    ctx.fillStyle = 'rgba(80,80,130,0.35)'; [[w * 0.7, h * 0.2, 140], [w * 0.2, h * 0.12, 180]].forEach(([x, y, l]) => { ctx.beginPath(); ctx.ellipse(x, y, l, 14, 0, 0, Math.PI * 2); ctx.fill(); });
    serraProleg(ctx, w, h, h * 0.55, 60, '#141632', 13, 26);
    serraProleg(ctx, w, h, h * 0.66, 40, '#0e0e24', 29, 22);
    // Horts marcits i un arbre sec a primer pla
    ctx.fillStyle = '#0a0a18'; ctx.fillRect(0, h * 0.86, w, h * 0.14);
    ctx.strokeStyle = '#0a0a18'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(80, h); ctx.lineTo(96, h * 0.72); ctx.lineTo(60, h * 0.6); ctx.moveTo(96, h * 0.72); ctx.lineTo(150, h * 0.62); ctx.lineTo(170, h * 0.56); ctx.stroke();
    ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(150, h * 0.62); ctx.lineTo(190, h * 0.63); ctx.moveTo(60, h * 0.6); ctx.lineTo(40, h * 0.55); ctx.stroke();
    // Esquerdes a terra d'on surt la claror lila
    ctx.strokeStyle = 'rgba(180,120,255,0.75)'; ctx.lineWidth = 3;
    [[200, 0.9], [420, 0.93], [600, 0.89]].forEach(([x, f]) => { ctx.beginPath(); ctx.moveTo(x - 50, h * f); ctx.lineTo(x - 20, h * f + 6); ctx.lineTo(x + 10, h * f - 3); ctx.lineTo(x + 50, h * f + 4); ctx.stroke(); });
    const bo = ctx.createLinearGradient(0, h * 0.7, 0, h); bo.addColorStop(0, 'rgba(150,80,255,0)'); bo.addColorStop(1, 'rgba(150,80,255,0.4)');
    ctx.fillStyle = bo; ctx.fillRect(0, h * 0.7, w, h * 0.3);
    graProleg(ctx, w, h, 13);
    vinyetaProleg(ctx, w, h, 0.7);
}

// ---------- 4. Cada nit falta un nen: tres cases, tres finestres que s'apaguen ----------
function pintarProlegNens(ctx, w, h) {
    ctx.fillStyle = gradVBib(ctx, 0, h, [[0, '#05060f'], [0.6, '#141028'], [1, '#1c1430']]); ctx.fillRect(0, 0, w, h);
    const r = rndBib(53);
    for (let i = 0; i < 90; i++) { ctx.fillStyle = `rgba(255,255,255,${0.2 + r() * 0.6})`; ctx.fillRect(r() * w, r() * h * 0.4, 1.4, 1.4); }
    serraProleg(ctx, w, h, h * 0.42, 50, '#100e22', 61, 26);
    // Les tres cases (les finestres es dibuixen a part, a l'escena, perquè s'han d'apagar)
    [[40, 0.78, 200, 230], [270, 0.76, 190, 250], [490, 0.78, 200, 230]].forEach(([x, f, cw, ch]) => casaProleg(ctx, x, h * f, cw, ch, null));
    // Carrer empedrat i boira baixa
    ctx.fillStyle = gradVBib(ctx, h * 0.76, h, [[0, '#14122a'], [1, '#0a0816']]); ctx.fillRect(0, h * 0.76, w, h * 0.24);
    ctx.strokeStyle = 'rgba(60,50,90,0.5)'; ctx.lineWidth = 1;
    for (let y = h * 0.8; y < h; y += 18) for (let x = (y / 18) % 2 ? 0 : 20; x < w; x += 40) { ctx.beginPath(); ctx.ellipse(x, y, 16, 6, 0, 0, Math.PI * 2); ctx.stroke(); }
    const bo = ctx.createLinearGradient(0, h * 0.82, 0, h); bo.addColorStop(0, 'rgba(150,80,255,0)'); bo.addColorStop(1, 'rgba(150,80,255,0.35)');
    ctx.fillStyle = bo; ctx.fillRect(0, h * 0.82, w, h * 0.18);
    graProleg(ctx, w, h, 17);
    vinyetaProleg(ctx, w, h, 0.7);
}

// ---------- 5. Matí al Monestir: surt el sol entre muntanyes, i la boira encara s'arrossega per les valls ----------
function pintarProlegMati(ctx, w, h) {
    ctx.fillStyle = gradVBib(ctx, 0, h, [[0, '#4a6aa8'], [0.45, '#d8a0a0'], [0.62, '#f6c890'], [1, '#c89a6a']]); ctx.fillRect(0, 0, w, h);
    const sol = ctx.createRadialGradient(w * 0.22, h * 0.56, 10, w * 0.22, h * 0.56, 360); sol.addColorStop(0, 'rgba(255,240,180,0.95)'); sol.addColorStop(0.2, 'rgba(255,220,150,0.5)'); sol.addColorStop(1, 'rgba(255,220,150,0)');
    ctx.fillStyle = sol; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#fff4c8'; ctx.beginPath(); ctx.arc(w * 0.22, h * 0.56, 42, 0, Math.PI * 2); ctx.fill();
    // Núvols allargats tenyits de rosa
    [[w * 0.6, h * 0.18, 200], [w * 0.3, h * 0.28, 150], [w * 0.8, h * 0.36, 120]].forEach(([x, y, l]) => {
        ctx.fillStyle = 'rgba(255,210,200,0.55)'; ctx.beginPath(); ctx.ellipse(x, y, l, 16, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(160,120,160,0.35)'; ctx.beginPath(); ctx.ellipse(x + 10, y + 8, l * 0.8, 9, 0, 0, Math.PI * 2); ctx.fill();
    });
    serraProleg(ctx, w, h, h * 0.58, 70, '#8a7aa0', 71, 30);
    // Boira de les valls (encara lila, però clarejant)
    const b = ctx.createLinearGradient(0, h * 0.6, 0, h * 0.7); b.addColorStop(0, 'rgba(230,200,240,0)'); b.addColorStop(0.5, 'rgba(230,200,240,0.6)'); b.addColorStop(1, 'rgba(230,200,240,0)');
    ctx.fillStyle = b; ctx.fillRect(0, h * 0.58, w, h * 0.14);
    serraProleg(ctx, w, h, h * 0.68, 40, '#6a5a6a', 83, 24);
    // Prat i camí de terra cap al Monestir
    ctx.fillStyle = gradVBib(ctx, h * 0.74, h, [[0, '#7a8a50'], [1, '#4a5a30']]); ctx.fillRect(0, h * 0.74, w, h * 0.26);
    ctx.fillStyle = '#b8986a'; ctx.beginPath(); ctx.moveTo(w * 0.42, h); ctx.quadraticCurveTo(w * 0.5, h * 0.86, w * 0.56, h * 0.76); ctx.lineTo(w * 0.62, h * 0.76); ctx.quadraticCurveTo(w * 0.62, h * 0.88, w * 0.62, h); ctx.closePath(); ctx.fill();
    const r = rndBib(91);
    for (let i = 0; i < 260; i++) { ctx.strokeStyle = `rgba(${40 + r() * 40},${70 + r() * 40},30,0.6)`; ctx.lineWidth = 1.4; const x = r() * w, y = h * 0.76 + r() * h * 0.24; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (r() - 0.5) * 6, y - 6 - r() * 8); ctx.stroke(); }
    // Ocells que travessen el cel
    ctx.strokeStyle = 'rgba(40,30,50,0.8)'; ctx.lineWidth = 2;
    [[w * 0.55, h * 0.3], [w * 0.6, h * 0.27], [w * 0.65, h * 0.31]].forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(x - 9, y); ctx.quadraticCurveTo(x - 4, y - 5, x, y); ctx.quadraticCurveTo(x + 4, y - 5, x + 9, y); ctx.stroke(); });
    graProleg(ctx, w, h, 21);
    vinyetaProleg(ctx, w, h, 0.45);
}
