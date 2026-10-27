/**
 * L'ERMITA DE LA DESAPARICIÓ (interior): paret del fons amb vitrall i fornícules, murs laterals i pilastres de pedra, catifa gastada,
 * graons de l'altar i les ofrenes dels nens. Es pinten en coordenades de disseny (ctx, w, h) i assets.js les converteix en textures.
 * Fan servir els ajudants de dibuixos_biblio.js (rndBib, gradVBib, gradHBib, BIB_CONTORN).
 */

// Una filera de carreus irregulars, amb llum a dalt i ombra a baix; tint: to base [r,g,b]
function carreusErmita(ctx, x0, y0, w, h, llavor, base = [120, 108, 94], altMin = 26) {
    const r = rndBib(llavor);
    ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.clip();
    ctx.fillStyle = `rgb(${base[0] - 30},${base[1] - 30},${base[2] - 28})`; ctx.fillRect(x0, y0, w, h);
    let y = y0;
    for (let fila = 0; y < y0 + h; fila++) {
        const alt = altMin + r() * 9;
        let x = x0 - ((fila * 41) % 60);
        while (x < x0 + w) {
            const bw = 44 + r() * 50, t = 0.8 + r() * 0.36;
            ctx.fillStyle = `rgb(${Math.round(base[0] * t)},${Math.round(base[1] * t)},${Math.round(base[2] * t)})`;
            ctx.beginPath(); ctx.roundRect(x + 1.5, y + 1.5, bw - 3, alt - 3, 5); ctx.fill();
            ctx.fillStyle = 'rgba(255,240,210,0.14)'; ctx.fillRect(x + 4, y + 3, bw - 9, 2.4);
            ctx.fillStyle = 'rgba(20,12,6,0.25)'; ctx.fillRect(x + 4, y + alt - 6, bw - 9, 3);
            if (r() < 0.18) {                                      // esquerda
                ctx.strokeStyle = 'rgba(25,16,8,0.5)'; ctx.lineWidth = 1.1; ctx.beginPath();
                const cx = x + 8 + r() * (bw - 16); ctx.moveTo(cx, y + 3); ctx.lineTo(cx + 5, y + alt * 0.5); ctx.lineTo(cx - 2, y + alt - 4); ctx.stroke();
            }
            ctx.strokeStyle = 'rgba(25,16,8,0.6)'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.roundRect(x + 1.5, y + 1.5, bw - 3, alt - 3, 5); ctx.stroke();
            x += bw;
        }
        y += alt;
    }
    ctx.restore();
}

// Vitrall apuntat amb plom i vidres blaus, ambre, vermells i verds; una creu de plom al mig
function vitrallErmita(ctx, cx, y0, w, h) {
    const r = rndBib(9), x0 = cx - w / 2;
    const arc = () => { ctx.beginPath(); ctx.moveTo(x0, y0 + h); ctx.lineTo(x0, y0 + w * 0.8); ctx.quadraticCurveTo(x0, y0 + 4, cx, y0); ctx.quadraticCurveTo(x0 + w, y0 + 4, x0 + w, y0 + w * 0.8); ctx.lineTo(x0 + w, y0 + h); ctx.closePath(); };
    // Resplendor de fora
    const g = ctx.createRadialGradient(cx, y0 + h * 0.45, 4, cx, y0 + h * 0.45, h * 0.9);
    g.addColorStop(0, 'rgba(255,236,170,0.5)'); g.addColorStop(1, 'rgba(255,236,170,0)');
    ctx.fillStyle = g; ctx.fillRect(cx - h, y0 - 20, 2 * h, h * 1.6);
    // Marc de pedra
    ctx.save(); ctx.translate(0, 0); ctx.lineWidth = 8; ctx.strokeStyle = '#a89e8a'; arc(); ctx.stroke(); ctx.restore();
    ctx.lineWidth = 2; ctx.strokeStyle = BIB_CONTORN; arc(); ctx.stroke();
    ctx.save(); arc(); ctx.clip();
    const colors = ['#2a4a8a', '#c88a24', '#a02a2a', '#2a7a5a', '#3a6aaa', '#e0a838'];
    const nc = 3, nf = 7, cw = w / nc, ch = h / nf;
    for (let i = 0; i < nc; i++) for (let j = 0; j < nf; j++) {
        ctx.fillStyle = colors[Math.floor(r() * colors.length)]; ctx.fillRect(x0 + i * cw, y0 + j * ch, cw, ch);
        ctx.fillStyle = 'rgba(255,255,255,0.16)'; ctx.fillRect(x0 + i * cw + 2, y0 + j * ch + 2, cw * 0.45, ch * 0.4);
    }
    ctx.strokeStyle = '#1a1410'; ctx.lineWidth = 2.2;
    for (let i = 1; i < nc; i++) { ctx.beginPath(); ctx.moveTo(x0 + i * cw, y0); ctx.lineTo(x0 + i * cw, y0 + h); ctx.stroke(); }
    for (let j = 1; j < nf; j++) { ctx.beginPath(); ctx.moveTo(x0, y0 + j * ch); ctx.lineTo(x0 + w, y0 + j * ch); ctx.stroke(); }
    ctx.lineWidth = 3.2; ctx.beginPath(); ctx.moveTo(cx, y0 + 6); ctx.lineTo(cx, y0 + h); ctx.moveTo(x0, y0 + h * 0.38); ctx.lineTo(x0 + w, y0 + h * 0.38); ctx.stroke();
    ctx.restore();
    ctx.lineWidth = 2; ctx.strokeStyle = BIB_CONTORN; arc(); ctx.stroke();
    // Ampit de pedra
    ctx.fillStyle = '#b4aa94'; ctx.fillRect(x0 - 6, y0 + h, w + 12, 7); ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.6; ctx.strokeRect(x0 - 6, y0 + h, w + 12, 7);
}

// Fornícula amb un cantó d'arc i una espelma petita
function fornaculaErmita(ctx, cx, y0, w, h) {
    const x0 = cx - w / 2;
    const arc = () => { ctx.beginPath(); ctx.moveTo(x0, y0 + h); ctx.lineTo(x0, y0 + w / 2); ctx.arc(cx, y0 + w / 2, w / 2, Math.PI, 0); ctx.lineTo(x0 + w, y0 + h); ctx.closePath(); };
    ctx.lineWidth = 6; ctx.strokeStyle = '#9a9080'; arc(); ctx.stroke();
    const g = ctx.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, '#0e0a06'); g.addColorStop(1, '#2a2014');
    ctx.fillStyle = g; arc(); ctx.fill(); ctx.lineWidth = 1.8; ctx.strokeStyle = BIB_CONTORN; arc(); ctx.stroke();
    ctx.fillStyle = '#8a8070'; ctx.fillRect(x0 - 3, y0 + h - 8, w + 6, 8); ctx.strokeRect(x0 - 3, y0 + h - 8, w + 6, 8);
    // Espelma i resplendor
    const gl = ctx.createRadialGradient(cx, y0 + h - 24, 1, cx, y0 + h - 24, 26); gl.addColorStop(0, 'rgba(255,200,100,0.55)'); gl.addColorStop(1, 'rgba(255,200,100,0)');
    ctx.fillStyle = gl; ctx.fillRect(cx - 30, y0 + h - 54, 60, 60);
    ctx.fillStyle = '#f0e4c0'; ctx.fillRect(cx - 3, y0 + h - 22, 6, 14); ctx.strokeRect(cx - 3, y0 + h - 22, 6, 14);
    ctx.fillStyle = '#ffb030'; ctx.beginPath(); ctx.ellipse(cx, y0 + h - 28, 2.6, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff2b0'; ctx.beginPath(); ctx.ellipse(cx, y0 + h - 27, 1.2, 2.6, 0, 0, Math.PI * 2); ctx.fill();
}

// ---------- Paret del fons: carreus, vitrall al mig, dues fornícules, cornisa i teranyines ----------
function pintarParetErmita(ctx, w, h) {
    ctx.lineJoin = 'round';
    carreusErmita(ctx, 0, 0, w, h, 131);
    const r = rndBib(5);
    for (let k = 0; k < 8; k++) {                                  // taques d'humitat i molsa
        const x = r() * w, y = 20 + r() * (h - 50);
        ctx.fillStyle = k % 2 ? 'rgba(70,96,50,0.18)' : 'rgba(30,24,18,0.2)';
        ctx.beginPath(); ctx.ellipse(x, y, 20 + r() * 40, 10 + r() * 20, r(), 0, Math.PI * 2); ctx.fill();
    }
    vitrallErmita(ctx, w / 2, 14, 84, 108);
    fornaculaErmita(ctx, 150, 38, 46, 84);
    fornaculaErmita(ctx, w - 150, 38, 46, 84);
    // Cornisa i sòcol
    ctx.fillStyle = gradVBib(ctx, h - 14, h, [[0, '#a8a090'], [1, '#6a6254']]); ctx.fillRect(0, h - 14, w, 14);
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(0, h - 14, w, 2);
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.8; ctx.strokeRect(0, h - 14, w, 14);
    // Teranyines als racons
    ctx.strokeStyle = 'rgba(240,236,224,0.4)'; ctx.lineWidth = 0.9;
    [[0, 0, 1], [w, 0, -1]].forEach(([x, y, d]) => {
        for (let i = 1; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(x, y + i * 12); ctx.quadraticCurveTo(x + d * i * 7, y + i * 7, x + d * i * 12, y); ctx.stroke(); }
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + d * 50, y + 50); ctx.moveTo(x + d * 25, y); ctx.lineTo(x, y + 25); ctx.stroke();
    });
    // Ombra de dalt i dels costats
    ctx.fillStyle = gradVBib(ctx, 0, h, [[0, 'rgba(0,0,0,0.5)'], [0.3, 'rgba(0,0,0,0.02)'], [0.85, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.3)']]); ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = gradHBib(ctx, 0, w, [[0, 'rgba(0,0,0,0.4)'], [0.12, 'rgba(0,0,0,0)'], [0.88, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.4)']]); ctx.fillRect(0, 0, w, h);
}

// ---------- Mur lateral (vist de costat): carreus més foscos ----------
function pintarMurErmita(ctx, w, h) {
    carreusErmita(ctx, 0, 0, w, h, 311, [96, 86, 74], 30);
    ctx.fillStyle = gradHBib(ctx, 0, w, [[0, 'rgba(0,0,0,0.5)'], [0.7, 'rgba(0,0,0,0.1)'], [1, 'rgba(0,0,0,0.5)']]); ctx.fillRect(0, 0, w, h);
}

// ---------- Pilastra de pedra adossada a la paret: base, fust amb estries i capitell ----------
function pintarPilastraErmita(ctx, w, h) {
    ctx.lineJoin = 'round';
    const cx = w / 2;
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(cx, h - 3, w * 0.5, 5, 0, 0, Math.PI * 2); ctx.fill();
    const pesa = (x, y, ww, hh, clar, fosc) => {
        const g = ctx.createLinearGradient(x, 0, x + ww, 0); g.addColorStop(0, clar); g.addColorStop(1, fosc);
        ctx.fillStyle = g; ctx.fillRect(x, y, ww, hh); ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.8; ctx.strokeRect(x, y, ww, hh);
    };
    pesa(2, h - 20, w - 4, 18, '#b4ac9a', '#7c7466');                // base
    pesa(7, h - 34, w - 14, 15, '#c0b8a6', '#847c6e');
    pesa(11, 28, w - 22, h - 60, '#c8c0ae', '#8a8272');               // fust
    ctx.strokeStyle = 'rgba(50,42,32,0.45)'; ctx.lineWidth = 1;
    for (let x = 17; x < w - 14; x += 7) { ctx.beginPath(); ctx.moveTo(x, 32); ctx.lineTo(x, h - 38); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,255,255,0.28)'; ctx.fillRect(13, 30, 3, h - 66);
    pesa(5, 14, w - 10, 14, '#d2cab8', '#948c7c');                    // capitell
    pesa(1, 2, w - 2, 14, '#dcd4c2', '#9a9282');
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(3, 3, w - 6, 2);
    const r = rndBib(21);                                           // molsa a la base
    ctx.fillStyle = 'rgba(70,100,50,0.4)'; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.ellipse(8 + r() * (w - 16), h - 22 + r() * 14, 4 + r() * 5, 2 + r() * 3, 0, 0, Math.PI * 2); ctx.fill(); }
}

// ---------- Catifa gastada que va de la porta a l'altar ----------
function pintarCatifaErmita(ctx, w, h) {
    ctx.lineJoin = 'round';
    const r = rndBib(61), fr = 7;
    ctx.fillStyle = gradHBib(ctx, 0, w, [[0, '#5a1a1c'], [0.5, '#7a2426'], [1, '#5a1a1c']]); ctx.fillRect(0, fr, w, h - 2 * fr);
    // Vores d'or gastat
    ctx.strokeStyle = '#b8902c'; ctx.lineWidth = 3; ctx.strokeRect(6, fr + 6, w - 12, h - 2 * fr - 12);
    ctx.strokeStyle = '#d8b050'; ctx.lineWidth = 1; ctx.strokeRect(11, fr + 11, w - 22, h - 2 * fr - 22);
    // Rombes al mig
    for (let y = 40; y < h - 40; y += 54) {
        ctx.fillStyle = '#a07424'; ctx.beginPath(); ctx.moveTo(w / 2, y - 22); ctx.lineTo(w / 2 + 24, y); ctx.lineTo(w / 2, y + 22); ctx.lineTo(w / 2 - 24, y); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#3a1214'; ctx.beginPath(); ctx.moveTo(w / 2, y - 13); ctx.lineTo(w / 2 + 14, y); ctx.lineTo(w / 2, y + 13); ctx.lineTo(w / 2 - 14, y); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#d8b050'; ctx.beginPath(); ctx.arc(w / 2, y, 3.2, 0, Math.PI * 2); ctx.fill();
    }
    // Desgast: zones clares, pegots i taques
    for (let k = 0; k < 60; k++) { ctx.fillStyle = `rgba(210,170,130,${0.04 + r() * 0.1})`; ctx.beginPath(); ctx.ellipse(r() * w, r() * h, 3 + r() * 14, 2 + r() * 8, r() * 3, 0, Math.PI * 2); ctx.fill(); }
    for (let k = 0; k < 5; k++) { ctx.fillStyle = 'rgba(20,8,6,0.3)'; ctx.beginPath(); ctx.ellipse(r() * w, r() * h, 6 + r() * 12, 4 + r() * 8, r() * 3, 0, Math.PI * 2); ctx.fill(); }
    // Serrells als extrems
    ctx.strokeStyle = '#c8b078'; ctx.lineWidth = 1.4;
    for (let x = 3; x < w; x += 4) { ctx.beginPath(); ctx.moveTo(x, fr); ctx.lineTo(x + (r() - 0.5) * 2, 0); ctx.moveTo(x, h - fr); ctx.lineTo(x + (r() - 0.5) * 2, h); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(20,10,6,0.8)'; ctx.lineWidth = 1.6; ctx.strokeRect(0, fr, w, h - 2 * fr);
}

// ---------- Graons de l'altar (el de dalt és ample: l'altar hi descansa) ----------
function pintarGraonsErmita(ctx, w, h) {
    ctx.lineJoin = 'round';
    const C = BIB_CONTORN;
    const cara = (x, y, ww, hh, clar, fosc, llavor) => {
        ctx.fillStyle = gradVBib(ctx, y, y + hh, [[0, clar], [1, fosc]]); ctx.fillRect(x, y, ww, hh);
        const r = rndBib(llavor); ctx.strokeStyle = 'rgba(30,22,14,0.5)'; ctx.lineWidth = 1;
        for (let bx = x + 30 + r() * 20; bx < x + ww - 10; bx += 46 + r() * 30) { ctx.beginPath(); ctx.moveTo(bx, y); ctx.lineTo(bx, y + hh); ctx.stroke(); }
        ctx.strokeStyle = C; ctx.lineWidth = 1.8; ctx.strokeRect(x, y, ww, hh);
    };
    cara(36, 0, w - 72, 40, '#aaa294', '#8e8678', 3);                 // cara superior del graó de dalt
    ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(38, 2, w - 76, 3);
    cara(30, 40, w - 60, 20, '#cdc5b3', '#948c7c', 4);                // front
    cara(0, 60, w, 12, '#9a9284', '#86806f', 5);                      // cara superior del graó de baix
    cara(0, 72, w, h - 72, '#c0b8a6', '#847c6e', 6);                  // front
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(32, 41, w - 64, 2); ctx.fillRect(2, 73, w - 4, 2);
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(2, 60, w - 4, 3);
}

// ---------- Ofrenes dels nens: pedretes, plomes, una trompeta de llauna, cera i espelmes curtes ----------
function pintarOfrenesErmita(ctx, w, h) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const r = rndBib(17), C = '#2a1c10';
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(w / 2, h - 6, w * 0.46, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(240,226,190,0.8)'; ctx.beginPath(); ctx.ellipse(24, h - 8, 14, 4, 0, 0, Math.PI * 2); ctx.fill();      // cera vella
    ctx.beginPath(); ctx.ellipse(w - 30, h - 7, 11, 3.4, 0, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 9; i++) {                                    // pedretes
        const x = 30 + r() * (w - 60), y = h - 14 + r() * 6, rx = 3.5 + r() * 3, c = 150 + Math.round(r() * 60);
        ctx.fillStyle = `rgb(${c},${c - 6},${c - 16})`; ctx.beginPath(); ctx.ellipse(x, y, rx, rx * 0.7, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = C; ctx.lineWidth = 1; ctx.stroke();
    }
    [[44, '#f4f0e6'], [w - 46, '#c8c0b0'], [w / 2 + 6, '#e8e2d2']].forEach(([x, c], i) => {   // plomes
        ctx.strokeStyle = C; ctx.lineWidth = 3.2; ctx.beginPath(); ctx.moveTo(x, h - 8); ctx.quadraticCurveTo(x + 8 * (i - 1), h - 20, x + 14 * (i - 1), h - 30); ctx.stroke();
        ctx.strokeStyle = c; ctx.lineWidth = 1.8; ctx.stroke();
    });
    // Trompeta de llauna
    ctx.save(); ctx.translate(w / 2 - 20, h - 16); ctx.rotate(-0.25);
    ctx.fillStyle = '#c8cfd8'; ctx.beginPath(); ctx.moveTo(0, -3); ctx.lineTo(24, -3); ctx.lineTo(34, -9); ctx.lineTo(34, 9); ctx.lineTo(24, 3); ctx.lineTo(0, 3); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C; ctx.lineWidth = 1.3; ctx.stroke();
    ctx.fillStyle = '#d0402c'; ctx.fillRect(10, -3, 4, 6); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(1, -2.4, 22, 1.6);
    ctx.restore();
    // Espelmes curtes amb flama
    [[w - 14, 16], [w * 0.62, 12]].forEach(([x, alt]) => {
        ctx.fillStyle = '#f0e4c0'; ctx.fillRect(x - 3, h - 8 - alt, 6, alt); ctx.strokeStyle = C; ctx.lineWidth = 1.1; ctx.strokeRect(x - 3, h - 8 - alt, 6, alt);
        ctx.fillStyle = '#ffb030'; ctx.beginPath(); ctx.ellipse(x, h - 14 - alt, 2.4, 4.6, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff2b0'; ctx.beginPath(); ctx.ellipse(x, h - 13 - alt, 1.1, 2.4, 0, 0, Math.PI * 2); ctx.fill();
    });
}

// ---------- Signes gravats a les taules de pedra (12 runes diferents, una per cada columna del camí) ----------
function runaErmita(ctx, k, x, y, s) {
    const traca = (dx, dy, col, ample) => {
        ctx.save(); ctx.translate(x + dx, y + dy); ctx.strokeStyle = col; ctx.lineWidth = ample; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        const u = s / 2;
        ctx.beginPath();
        switch (k % 12) {
            case 0: ctx.arc(0, 0, u, 0, Math.PI * 2); ctx.moveTo(0.4, 0); ctx.arc(0, 0, 0.4, 0, Math.PI * 2); break;                     // sol
            case 1: ctx.arc(0, 0, u, -1.2, 1.2); ctx.arc(u * 0.55, 0, u * 0.8, 1.2, -1.2, true); break;                                 // lluna
            case 2: ctx.moveTo(0, -u); ctx.lineTo(u * 0.3, -u * 0.3); ctx.lineTo(u, 0); ctx.lineTo(u * 0.3, u * 0.3); ctx.lineTo(0, u); ctx.lineTo(-u * 0.3, u * 0.3); ctx.lineTo(-u, 0); ctx.lineTo(-u * 0.3, -u * 0.3); ctx.closePath(); break;   // estel
            case 3: ctx.moveTo(0, -u); ctx.lineTo(0, u); ctx.moveTo(-u * 0.8, -u * 0.6); ctx.quadraticCurveTo(-u * 0.8, u * 0.2, 0, u * 0.2); ctx.quadraticCurveTo(u * 0.8, u * 0.2, u * 0.8, -u * 0.6); break;   // trident
            case 4: ctx.arc(0, -u * 0.35, u * 0.5, 0, Math.PI * 2); ctx.moveTo(0, u * 0.15); ctx.lineTo(0, u); ctx.moveTo(-u * 0.4, u * 0.6); ctx.lineTo(u * 0.4, u * 0.6); break;   // forat de clau
            case 5: ctx.arc(0, -u * 0.1, u * 0.4, 0, Math.PI * 2); ctx.moveTo(-u * 0.6, -u); ctx.quadraticCurveTo(0, -u * 0.5, u * 0.6, -u); ctx.moveTo(0, u * 0.3); ctx.lineTo(0, u); ctx.moveTo(-u * 0.4, u * 0.65); ctx.lineTo(u * 0.4, u * 0.65); break;   // mercuri
            case 6: ctx.moveTo(-u * 0.3, -u); ctx.lineTo(-u * 0.3, u * 0.4); ctx.moveTo(-u * 0.7, -u * 0.5); ctx.lineTo(u * 0.1, -u * 0.5); ctx.moveTo(-u * 0.3, 0); ctx.quadraticCurveTo(u * 0.9, -u * 0.4, u * 0.5, u * 0.5); ctx.quadraticCurveTo(u * 0.3, u, 0, u * 0.8); break;   // saturn
            case 7: ctx.moveTo(-u * 0.7, -u); ctx.lineTo(-u * 0.7, u * 0.2); ctx.lineTo(u * 0.6, u * 0.2); ctx.moveTo(u * 0.3, -u); ctx.lineTo(u * 0.3, u); break;   // quatre
            case 8: for (let a = 0; a < 14; a += 0.3) { const rr = u * a / 14 + 0.3; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } break;   // espiral
            case 9: ctx.moveTo(0, -u); ctx.lineTo(u, u * 0.8); ctx.lineTo(-u, u * 0.8); ctx.closePath(); ctx.moveTo(0.4, u * 0.2); ctx.arc(0, u * 0.2, 0.4, 0, Math.PI * 2); break;   // triangle
            case 10: ctx.moveTo(0, 0); ctx.bezierCurveTo(u, -u, u, u, 0, 0); ctx.bezierCurveTo(-u, -u, -u, u, 0, 0); break;   // llaç doble
            default: ctx.arc(0, -u * 0.55, u * 0.4, 0, Math.PI * 2); ctx.moveTo(0, -u * 0.15); ctx.lineTo(0, u); ctx.moveTo(0, u * 0.35); ctx.lineTo(u * 0.4, u * 0.35); ctx.moveTo(0, u); ctx.lineTo(u * 0.4, u); break;   // clau
        }
        ctx.stroke(); ctx.restore();
    };
    traca(0.9, 1, 'rgba(255,255,255,0.28)', 1.5);
    traca(0, 0, '#34302a', 1.7);
}
