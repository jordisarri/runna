/**
 * CASA D'EN JORDI I LA CASETA DE JOC: gràfics de l'interior de la masia (paret emblanquinada amb sòcol de rajola, tauler d'eines,
 * penjolls d'alls i pebrots, el gat al cove) i el cofre de les joguines de la caseta. Fan servir els ajudants de dibuixos_biblio.js.
 */

// ---------- Paret de la masia: calç amb taques i esquerdes, bigues al sostre i sòcol de rajola catalana ----------
function pintarParetMasia(ctx, w, h) {
    const r = rndBib(31);
    ctx.fillStyle = gradVBib(ctx, 0, h, [[0, '#e6dcc4'], [0.7, '#efe6d2'], [1, '#d8ccb0']]); ctx.fillRect(0, 0, w, h);
    for (let k = 0; k < 40; k++) {                                   // calç irregular
        ctx.fillStyle = r() < 0.5 ? 'rgba(180,160,120,0.10)' : 'rgba(255,255,245,0.25)';
        ctx.beginPath(); ctx.ellipse(r() * w, 20 + r() * (h - 60), 20 + r() * 50, 8 + r() * 20, r() * 3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = 'rgba(120,100,70,0.35)'; ctx.lineWidth = 1;   // esquerdes fines
    for (let k = 0; k < 5; k++) {
        let x = r() * w, y = 40 + r() * 60; ctx.beginPath(); ctx.moveTo(x, y);
        for (let s = 0; s < 4; s++) { x += (r() - 0.5) * 16; y += 6 + r() * 8; ctx.lineTo(x, y); }
        ctx.stroke();
    }
    // Bigues del sostre amb els caps que sobresurten
    ctx.fillStyle = gradVBib(ctx, 0, 18, [[0, '#6a4424'], [1, '#3a2210']]); ctx.fillRect(0, 0, w, 18);
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2; ctx.strokeRect(0, 0, w, 18);
    for (let x = 50; x < w; x += 130) {
        ctx.fillStyle = gradVBib(ctx, 18, 34, [[0, '#5a3a1e'], [1, '#3a2210']]); ctx.fillRect(x - 11, 18, 22, 16); ctx.strokeRect(x - 11, 18, 22, 16);
        ctx.strokeStyle = 'rgba(255,220,170,0.25)'; ctx.beginPath(); ctx.moveTo(x - 8, 22); ctx.lineTo(x + 8, 22); ctx.stroke(); ctx.strokeStyle = BIB_CONTORN;
    }
    // Sòcol de rajola: blanc i blau amb una flor groga
    const ys = h - 44, mida = 22;
    for (let x = 0, k = 0; x < w; x += mida, k++) for (let f = 0; f < 2; f++) {
        const y = ys + f * mida;
        ctx.fillStyle = '#f2ecdc'; ctx.fillRect(x, y, mida, mida);
        ctx.fillStyle = '#2f5f9a';
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 7, y); ctx.lineTo(x, y + 7); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x + mida, y + mida); ctx.lineTo(x + mida - 7, y + mida); ctx.lineTo(x + mida, y + mida - 7); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x + mida, y); ctx.lineTo(x + mida - 7, y); ctx.lineTo(x + mida, y + 7); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x, y + mida); ctx.lineTo(x + 7, y + mida); ctx.lineTo(x, y + mida - 7); ctx.closePath(); ctx.fill();
        ctx.fillStyle = (k + f) % 2 ? '#e0a83a' : '#2f5f9a';
        for (let p = 0; p < 4; p++) { const a = p * Math.PI / 2; ctx.beginPath(); ctx.ellipse(x + mida / 2 + Math.cos(a) * 4, y + mida / 2 + Math.sin(a) * 4, 3, 2, a, 0, Math.PI * 2); ctx.fill(); }
        ctx.strokeStyle = 'rgba(60,50,40,0.35)'; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, mida - 1, mida - 1);
    }
    ctx.fillStyle = gradVBib(ctx, h - 4, h, [[0, '#6a4020'], [1, '#2e1a0c']]); ctx.fillRect(0, h - 4, w, 4);
    ctx.fillStyle = gradVBib(ctx, 0, h, [[0, 'rgba(0,0,0,0.30)'], [0.25, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.12)']]); ctx.fillRect(0, 0, w, h);
}

// ---------- Tauler d'eines: serra, martell, estenalles, falç, un rotlle de corda i el buit (amb la silueta) de la maneta ----------
function pintarTaulerEines(ctx, w, h) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.fillStyle = gradVBib(ctx, 0, h, [[0, '#8a6038'], [1, '#6a4422']]); ctx.beginPath(); ctx.roundRect(2, 2, w - 4, h - 4, 4); ctx.fill();
    ctx.strokeStyle = 'rgba(40,20,8,0.45)'; ctx.lineWidth = 1; for (let y = 14; y < h; y += 13) { ctx.beginPath(); ctx.moveTo(6, y); ctx.lineTo(w - 6, y); ctx.stroke(); }
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(2, 2, w - 4, h - 4, 4); ctx.stroke();
    const clau = (x, y) => { ctx.fillStyle = '#3a3a40'; ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill(); };
    // Serra
    ctx.fillStyle = '#b8bcc4'; ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(16, 16); ctx.lineTo(54, 16); ctx.lineTo(54, 24); ctx.lineTo(16, 34); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); for (let x = 17; x < 53; x += 4) { ctx.moveTo(x, 34 - (x - 16) * 10 / 38); ctx.lineTo(x + 2, 37 - (x - 16) * 10 / 38); } ctx.stroke();
    ctx.fillStyle = '#9a5a2a'; ctx.beginPath(); ctx.roundRect(52, 12, 14, 16, 4); ctx.fill(); ctx.stroke(); clau(34, 12);
    // Martell
    ctx.fillStyle = '#9a6a38'; ctx.fillRect(80, 20, 6, 40); ctx.strokeRect(80, 20, 6, 40);
    ctx.fillStyle = '#6a6e78'; ctx.beginPath(); ctx.roundRect(70, 13, 26, 10, 2); ctx.fill(); ctx.stroke(); clau(83, 10);
    // Estenalles
    ctx.strokeStyle = '#5a5e68'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(108, 16); ctx.lineTo(118, 40); ctx.lineTo(112, 60); ctx.moveTo(128, 16); ctx.lineTo(118, 40); ctx.lineTo(124, 60); ctx.stroke();
    ctx.strokeStyle = '#b84a2a'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(114, 48); ctx.lineTo(112, 60); ctx.moveTo(122, 48); ctx.lineTo(124, 60); ctx.stroke(); clau(118, 12);
    // El buit de la maneta: la silueta pintada de quan hi era
    ctx.setLineDash([3, 3]); ctx.strokeStyle = 'rgba(240,230,200,0.85)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(146, 18); ctx.lineTo(146, 48); ctx.lineTo(170, 48); ctx.stroke(); ctx.strokeRect(141, 12, 10, 8); ctx.strokeRect(166, 43, 14, 10);
    ctx.setLineDash([]); clau(150, 10);
    // Falç
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(206, 30, 16, Math.PI * 1.05, Math.PI * 2.1); ctx.stroke();
    ctx.strokeStyle = '#c8ccd4'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(206, 30, 16, Math.PI * 1.05, Math.PI * 2.1); ctx.stroke();
    ctx.fillStyle = '#9a6a38'; ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.roundRect(219, 32, 8, 26, 3); ctx.fill(); ctx.stroke(); clau(206, 12);
    // Rotlle de corda
    ctx.strokeStyle = '#c8a870'; ctx.lineWidth = 4; [12, 9, 6].forEach(r => { ctx.beginPath(); ctx.ellipse(250, 40, r + 4, r, 0, 0, Math.PI * 2); ctx.stroke(); });
    ctx.strokeStyle = 'rgba(80,60,30,0.6)'; ctx.lineWidth = 1; [12, 9, 6].forEach(r => { ctx.beginPath(); ctx.ellipse(250, 40, r + 4, r, 0, 0, Math.PI * 2); ctx.stroke(); }); clau(250, 22);
}

// ---------- Penjolls de la biga: dues ristres d'alls i una de pebrots vermells ----------
function pintarPenjolls(ctx, w, h) {
    const ristra = (x, alls) => {
        ctx.strokeStyle = '#a07a40'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h - 10); ctx.stroke();
        for (let k = 0; k < 6; k++) {
            const y = 14 + k * ((h - 26) / 6), dx = k % 2 ? 6 : -6;
            if (alls) {
                ctx.fillStyle = '#f4eee0'; ctx.strokeStyle = 'rgba(90,70,40,0.8)'; ctx.lineWidth = 1.2;
                ctx.beginPath(); ctx.ellipse(x + dx, y, 8, 9, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.strokeStyle = 'rgba(180,140,160,0.7)'; ctx.beginPath(); ctx.moveTo(x + dx, y - 8); ctx.lineTo(x + dx, y + 8); ctx.moveTo(x + dx - 4, y - 6); ctx.quadraticCurveTo(x + dx - 6, y, x + dx - 4, y + 6); ctx.stroke();
            } else {
                ctx.fillStyle = k % 3 ? '#c8342a' : '#a82820'; ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.2;
                ctx.beginPath(); ctx.moveTo(x + dx * 0.4, y - 6); ctx.quadraticCurveTo(x + dx * 1.6, y + 2, x + dx * 0.6, y + 14); ctx.quadraticCurveTo(x + dx * 0.2, y + 2, x + dx * 0.4, y - 6); ctx.fill(); ctx.stroke();
                ctx.fillStyle = '#4a7a2a'; ctx.beginPath(); ctx.arc(x + dx * 0.4, y - 6, 2.4, 0, Math.PI * 2); ctx.fill();
            }
        }
    };
    ristra(16, true); ristra(48, false); ristra(80, true);
}

// ---------- El gat (gris tigrat) adormit, cargolat dins un cove de vímet ----------
function pintarGatCove(ctx, w, h) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const cx = w / 2, by = h - 6;
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(cx + 3, by, w * 0.46, 6, 0, 0, Math.PI * 2); ctx.fill();
    // Cove: part de darrere
    ctx.fillStyle = '#9a6a30'; ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.ellipse(cx, by - 26, w * 0.44, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#c8a050'; ctx.beginPath(); ctx.ellipse(cx, by - 25, w * 0.39, 10, 0, 0, Math.PI * 2); ctx.fill();
    // Gat cargolat
    ctx.fillStyle = '#8a8c94'; ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.ellipse(cx - 4, by - 32, w * 0.3, 15, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#5a5c64'; ctx.lineWidth = 3;
    for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(cx - 4 + k * 10, by - 46); ctx.quadraticCurveTo(cx + k * 10, by - 36, cx - 6 + k * 10, by - 26); ctx.stroke(); }
    // Cua que li envolta el cos
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(cx - w * 0.3, by - 30); ctx.quadraticCurveTo(cx - w * 0.2, by - 16, cx + w * 0.12, by - 20); ctx.stroke();
    ctx.strokeStyle = '#8a8c94'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx - w * 0.3, by - 30); ctx.quadraticCurveTo(cx - w * 0.2, by - 16, cx + w * 0.12, by - 20); ctx.stroke();
    // Cap amb orelles, ulls tancats i el morro sobre les potes
    const hx = cx + w * 0.22, hy = by - 34;
    ctx.fillStyle = '#9a9ca4'; ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2.2;
    [[-1, 0], [1, 0]].forEach(([s]) => { ctx.beginPath(); ctx.moveTo(hx + s * 5, hy - 9); ctx.lineTo(hx + s * 12, hy - 20); ctx.lineTo(hx + s * 14, hy - 5); ctx.closePath(); ctx.fill(); ctx.stroke(); });
    ctx.beginPath(); ctx.ellipse(hx, hy, 14, 11, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#e8b8b8'; [[-1], [1]].forEach(([s]) => { ctx.beginPath(); ctx.moveTo(hx + s * 7, hy - 10); ctx.lineTo(hx + s * 11, hy - 16); ctx.lineTo(hx + s * 12, hy - 7); ctx.closePath(); ctx.fill(); });
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(hx - 5, hy - 1, 3, 0.2, Math.PI - 0.2); ctx.moveTo(hx + 8, hy - 1); ctx.arc(hx + 5, hy - 1, 3, 0.2, Math.PI - 0.2); ctx.stroke();
    ctx.fillStyle = '#d88a8a'; ctx.beginPath(); ctx.arc(hx, hy + 4, 1.8, 0, Math.PI * 2); ctx.fill();
    // Cove: vora de davant de vímet trenat
    ctx.fillStyle = '#a8763a'; ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(cx - w * 0.44, by - 26); ctx.quadraticCurveTo(cx - w * 0.44, by, cx, by); ctx.quadraticCurveTo(cx + w * 0.44, by, cx + w * 0.44, by - 26);
    ctx.quadraticCurveTo(cx, by - 12, cx - w * 0.44, by - 26); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(70,40,14,0.6)'; ctx.lineWidth = 1.2;
    for (let x = cx - w * 0.4; x < cx + w * 0.4; x += 7) { ctx.beginPath(); ctx.moveTo(x, by - 18); ctx.lineTo(x + 3, by - 4); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(255,220,160,0.4)'; ctx.beginPath(); ctx.moveTo(cx - w * 0.4, by - 22); ctx.quadraticCurveTo(cx, by - 10, cx + w * 0.4, by - 22); ctx.stroke();
}

// ---------- Cofre de les joguines de la caseta: pintat de blau amb estels i una lluna, ribets vermells, nanses de corda
//            i la tapa una mica oberta, amb les joguines que treuen el cap (una pilota, una espasa de fusta, l'orella d'un ós) ----------
function pintarCofreJoguines(ctx, w, h) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const x0 = 8, x1 = w - 8, yCos = h * 0.48, yBaix = h - 6, C = BIB_CONTORN;
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(w / 2 + 2, h - 3, w * 0.48, 5, 0, 0, Math.PI * 2); ctx.fill();
    // Les joguines dins, darrere la tapa oberta
    ctx.fillStyle = '#1e140c'; ctx.beginPath(); ctx.ellipse(w / 2, yCos - 4, (x1 - x0) / 2 - 2, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e8463a'; ctx.strokeStyle = C; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(w * 0.68, yCos - 8, 10, Math.PI, Math.PI * 2.05); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#ffe080'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(w * 0.68, yCos - 8, 6, Math.PI * 1.1, Math.PI * 1.7); ctx.stroke();
    ctx.fillStyle = '#c89a5a'; ctx.strokeStyle = C; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.rect(w * 0.36 - 2, yCos - 30, 5, 26); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.rect(w * 0.36 - 8, yCos - 12, 17, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#9a6a3a'; ctx.beginPath(); ctx.arc(w * 0.22, yCos - 6, 6, Math.PI, Math.PI * 2); ctx.fill(); ctx.stroke();
    // Cos pintat de blau, amb taulons
    const cos = new Path2D(); cos.roundRect(x0, yCos, x1 - x0, yBaix - yCos, 4);
    ctx.fillStyle = gradVBib(ctx, yCos, yBaix, [[0, '#4a7ac8'], [1, '#2a4e8a']]); ctx.fill(cos);
    ctx.save(); ctx.clip(cos);
    ctx.strokeStyle = 'rgba(16,30,60,0.45)'; ctx.lineWidth = 1.2; [0.36, 0.68].forEach(f => { const y = yCos + (yBaix - yCos) * f; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); });
    // Estels i lluna pintats
    const estel = (x, y, r) => { ctx.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * 0.45 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); };
    ctx.fillStyle = '#ffd84a'; estel(w * 0.24, yCos + 13, 6); estel(w * 0.76, yCos + 22, 5); estel(w * 0.6, yCos + 10, 3.5); estel(w * 0.36, yCos + 25, 3.5);
    ctx.beginPath(); ctx.arc(w * 0.5, yCos + 18, 7, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#3a66b0'; ctx.beginPath(); ctx.arc(w * 0.5 + 3.5, yCos + 15.5, 6, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = C; ctx.lineWidth = 2.4; ctx.stroke(cos);
    // Ribets vermells a dalt i a baix
    ctx.fillStyle = '#c8342a'; ctx.fillRect(x0, yCos, x1 - x0, 5); ctx.fillRect(x0, yBaix - 5, x1 - x0, 5);
    ctx.strokeStyle = C; ctx.lineWidth = 1.4; ctx.strokeRect(x0, yCos, x1 - x0, 5); ctx.strokeRect(x0, yBaix - 5, x1 - x0, 5);
    // Nanses de corda als costats
    ctx.strokeStyle = '#d8b878'; ctx.lineWidth = 3.5; [[x0, -1], [x1, 1]].forEach(([x, s]) => { ctx.beginPath(); ctx.arc(x + s * 1, yCos + 16, 6, s > 0 ? -Math.PI / 2 : Math.PI / 2, s > 0 ? Math.PI / 2 : Math.PI * 1.5); ctx.stroke(); });
    // Tapa oberta, inclinada cap enrere (vermella amb ratlles grogues)
    ctx.save(); ctx.translate(w / 2 - 3, yCos - 15); ctx.rotate(-0.1);          // alçada: deixa veure les joguines per l'escletxa
    const tw = (x1 - x0) / 2 + 2, tapa = new Path2D();
    tapa.moveTo(-tw, 0); tapa.lineTo(-tw, -8); tapa.quadraticCurveTo(0, -h * 0.42, tw, -8); tapa.lineTo(tw, 0); tapa.closePath();
    ctx.fillStyle = gradVBib(ctx, -h * 0.3, 0, [[0, '#e8564a'], [1, '#a82820']]); ctx.fill(tapa);
    ctx.save(); ctx.clip(tapa); ctx.strokeStyle = '#ffd84a'; ctx.lineWidth = 3;
    for (let x = -tw + 8; x < tw; x += 14) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, -h * 0.4); ctx.stroke(); }
    ctx.restore();
    ctx.strokeStyle = C; ctx.lineWidth = 2.4; ctx.stroke(tapa);
    ctx.restore();
}
