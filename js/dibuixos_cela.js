/**
 * LA CEL·LA DE SANT ANTONI: gràfics de l'interior (paret de pedra, llar de foc, llit, taula, cadires, finestra, prestatge, estora...).
 * Es pinten en coordenades de disseny (ctx, w, h) i assets.js les converteix en textures. Fan servir els ajudants de dibuixos_biblio.js.
 */

// ---------- Paret del fons: pedra irregular amb pegats de calç, biga al capdamunt i sòcol fosc ----------
function pintarParetCela(ctx, w, h) {
    const r = rndBib(77);
    ctx.fillStyle = '#6a5c4a'; ctx.fillRect(0, 0, w, h);
    let y = 14;
    for (let fila = 0; y < h - 14; fila++) {
        const alt = 20 + r() * 10;
        let x = -((fila * 37) % 50);
        while (x < w) {
            const bw = 34 + r() * 46, t = 0.82 + r() * 0.3, cal = r() < 0.22;
            const c = cal ? [214, 204, 184] : [Math.round(122 * t), Math.round(108 * t), Math.round(88 * t)];
            ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
            ctx.beginPath(); ctx.roundRect(x + 1.5, y + 1.5, bw - 3, alt - 3, 5); ctx.fill();
            ctx.fillStyle = 'rgba(255,240,210,0.13)'; ctx.fillRect(x + 4, y + 3, bw - 9, 2.4);
            ctx.fillStyle = 'rgba(30,20,10,0.22)'; ctx.fillRect(x + 4, y + alt - 6, bw - 9, 3);
            ctx.strokeStyle = 'rgba(30,20,10,0.55)'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.roundRect(x + 1.5, y + 1.5, bw - 3, alt - 3, 5); ctx.stroke();
            x += bw;
        }
        y += alt;
    }
    for (let k = 0; k < 9; k++) {                                  // pegats de guix
        const x = r() * w, yy = 30 + r() * (h - 80);
        ctx.fillStyle = 'rgba(236,226,204,0.2)'; ctx.beginPath(); ctx.ellipse(x, yy, 30 + r() * 40, 14 + r() * 18, r(), 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = gradVBib(ctx, 0, h, [[0, 'rgba(0,0,0,0.55)'], [0.3, 'rgba(0,0,0,0.05)'], [0.8, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.4)']]); ctx.fillRect(0, 0, w, h);
    // Biga de dalt amb nusos
    ctx.fillStyle = gradVBib(ctx, 0, 16, [[0, '#5a3a1e'], [1, '#2e1a0c']]); ctx.fillRect(0, 0, w, 16);
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2; ctx.strokeRect(0, 0, w, 16);
    ctx.fillStyle = '#1e1008'; for (let x = 60; x < w; x += 150) { ctx.beginPath(); ctx.ellipse(x + r() * 40, 8, 6, 3, 0, 0, Math.PI * 2); ctx.fill(); }
    // Sòcol de fusta
    ctx.fillStyle = gradVBib(ctx, h - 16, h, [[0, '#6a4020'], [1, '#2e1a0c']]); ctx.fillRect(0, h - 16, w, 16);
    ctx.strokeStyle = BIB_CONTORN; ctx.strokeRect(0, h - 16, w, 16);
}

// ---------- Llar de foc de pedra amb campana, rebosts amb espelma i gerro, grua de ferro amb olla, troncs i brases ----------
function pintarLlarCela(ctx, w, h) {
    const cx = w / 2, r = rndBib(5);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2.4;
    const pedra = (x, y, ww, hh, base) => {
        const t = 0.86 + r() * 0.26;
        ctx.fillStyle = `rgb(${Math.round(base[0] * t)},${Math.round(base[1] * t)},${Math.round(base[2] * t)})`;
        ctx.beginPath(); ctx.roundRect(x, y, ww, hh, 3); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,245,215,0.16)'; ctx.fillRect(x + 2, y + 2, ww - 4, 2);
    };
    // Campana (trapezi cap amunt fins a la xemeneia)
    ctx.fillStyle = '#7a6c58';
    ctx.beginPath(); ctx.moveTo(cx - 76, 62); ctx.lineTo(cx - 28, 0); ctx.lineTo(cx + 28, 0); ctx.lineTo(cx + 76, 62); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.save(); ctx.clip();
    for (let yy = 0, f = 0; yy < 64; yy += 15, f++) for (let xx = cx - 90 + (f % 2) * 20; xx < cx + 90; xx += 40) pedra(xx, yy, 38, 14, [128, 114, 94]);
    ctx.restore();
    ctx.beginPath(); ctx.moveTo(cx - 76, 62); ctx.lineTo(cx - 28, 0); ctx.lineTo(cx + 28, 0); ctx.lineTo(cx + 76, 62); ctx.closePath(); ctx.stroke();
    // Cos de la llar
    ctx.fillStyle = '#7a6c58'; ctx.fillRect(14, 60, w - 28, h - 78); ctx.strokeRect(14, 60, w - 28, h - 78);
    ctx.save(); ctx.beginPath(); ctx.rect(14, 60, w - 28, h - 78); ctx.clip();
    for (let yy = 62, f = 0; yy < h - 18; yy += 17, f++) for (let xx = 8 + (f % 2) * 22; xx < w; xx += 44) pedra(xx, yy, 42, 16, [132, 118, 98]);
    ctx.restore();
    // Rebost (biga de fusta) amb objectes
    ctx.fillStyle = gradVBib(ctx, 50, 66, [[0, '#8a5a2c'], [1, '#4a2a14']]); ctx.fillRect(4, 50, w - 8, 14); ctx.strokeRect(4, 50, w - 8, 14);
    ctx.fillStyle = 'rgba(255,225,170,0.4)'; ctx.fillRect(5, 51, w - 10, 2);
    ctx.fillStyle = '#c8a040'; ctx.fillRect(cx - 60 - 5, 44, 10, 6); ctx.strokeRect(cx - 65, 44, 10, 6);                   // candeler
    ctx.fillStyle = '#f2e6c8'; ctx.fillRect(cx - 62.6, 30, 5.2, 14); ctx.strokeRect(cx - 62.6, 30, 5.2, 14);
    ctx.fillStyle = '#ffc040'; ctx.beginPath(); ctx.ellipse(cx - 60, 26, 2.6, 4.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = gradHBib(ctx, cx + 40, cx + 62, [[0, '#c98a4a'], [1, '#7a4a22']]);                                    // gerro
    ctx.beginPath(); ctx.ellipse(cx + 52, 40, 11, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillRect(cx + 47, 24, 10, 8); ctx.strokeRect(cx + 47, 24, 10, 8);
    ctx.fillStyle = '#3a2a1e'; ctx.fillRect(cx + 14, 32, 18, 18); ctx.strokeRect(cx + 14, 32, 18, 18);                    // petita caixa de ferro
    // Obertura amb arc
    const ox = 34, ow = w - 68, oy = 78, ob = h - 20;
    ctx.beginPath(); ctx.moveTo(ox, ob); ctx.lineTo(ox, oy + 24); ctx.quadraticCurveTo(ox, oy, cx, oy - 4); ctx.quadraticCurveTo(ox + ow, oy, ox + ow, oy + 24); ctx.lineTo(ox + ow, ob); ctx.closePath();
    ctx.fillStyle = '#0e0704'; ctx.fill(); ctx.stroke();
    ctx.save(); ctx.clip();
    const fons = ctx.createRadialGradient(cx, ob - 14, 4, cx, ob - 14, 90); fons.addColorStop(0, 'rgba(255,150,40,0.75)'); fons.addColorStop(0.5, 'rgba(160,50,10,0.35)'); fons.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = fons; ctx.fillRect(ox, oy - 6, ow, ob - oy + 6);
    ctx.restore();
    // Grua de ferro amb olla
    ctx.strokeStyle = '#1a1a1e'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ox + ow - 8, ob - 4); ctx.lineTo(ox + ow - 8, oy + 18); ctx.lineTo(cx - 10, oy + 18); ctx.stroke();
    ctx.strokeStyle = '#4a4a52'; ctx.lineWidth = 1.6; ctx.stroke();
    ctx.strokeStyle = '#1a1a1e'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(cx - 10, oy + 18); ctx.lineTo(cx - 10, oy + 36); ctx.stroke();
    ctx.fillStyle = '#26262c'; ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(cx - 10, oy + 48, 19, 15, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#3a3a42'; ctx.beginPath(); ctx.ellipse(cx - 10, oy + 36, 19, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.ellipse(cx - 17, oy + 46, 5, 8, 0.4, 0, Math.PI * 2); ctx.fill();
    // Troncs, cendra i brases
    ctx.fillStyle = '#5a3a1e'; ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2;
    [[cx - 38, ob - 12, 0.18], [cx - 6, ob - 10, -0.12], [cx + 22, ob - 12, 0.1]].forEach(([x, y, a]) => { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.beginPath(); ctx.roundRect(-22, -6, 44, 12, 5); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#c89a5a'; ctx.beginPath(); ctx.ellipse(-22, 0, 3.2, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#5a3a1e'; ctx.restore(); });
    ctx.fillStyle = 'rgba(70,64,60,0.85)'; ctx.beginPath(); ctx.ellipse(cx, ob - 3, 56, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff7a20'; for (let k = 0; k < 8; k++) { ctx.beginPath(); ctx.arc(cx - 44 + k * 12 + r() * 4, ob - 6 + r() * 4, 1.8 + r() * 1.4, 0, Math.PI * 2); ctx.fill(); }
    // Llosa del fogar i atiador
    ctx.fillStyle = gradVBib(ctx, h - 18, h, [[0, '#a89a82'], [1, '#6a5c48']]); ctx.fillRect(2, h - 18, w - 4, 18); ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2.4; ctx.strokeRect(2, h - 18, w - 4, 18);
    ctx.strokeStyle = '#1a1a1e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(24, h - 20); ctx.lineTo(34, 102); ctx.stroke();
}

// ---------- Llit de monjo: capçal i peücs de fusta, màrfega de palla, llençol, manta de llana ratllada i coixí ----------
function pintarLlitCela(ctx, w, h) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(w / 2, h - 6, w * 0.5, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2.4;
    // Potes visibles del davant
    ctx.fillStyle = gradHBib(ctx, 0, w, [[0, '#7a4a24'], [1, '#3a2010']]);
    [[8, h - 26], [w - 20, h - 26]].forEach(([x, y]) => { ctx.fillRect(x, y, 12, 24); ctx.strokeRect(x, y, 12, 24); });
    // Capçal alt
    ctx.fillStyle = gradVBib(ctx, 0, 36, [[0, '#8a5a2c'], [1, '#4a2a14']]);
    ctx.beginPath(); ctx.roundRect(2, 4, w - 4, 38, 5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#6a4020'; [10, w / 2, w - 10].forEach(x => { ctx.beginPath(); ctx.arc(x, 6, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    ctx.strokeStyle = 'rgba(30,14,4,0.5)'; ctx.lineWidth = 1.2; for (let x = 16; x < w - 12; x += 16) { ctx.beginPath(); ctx.moveTo(x, 14); ctx.lineTo(x, 36); ctx.stroke(); }
    // Marc i màrfega
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2.4;
    ctx.fillStyle = gradHBib(ctx, 0, w, [[0, '#8a5a2c'], [0.5, '#a67442'], [1, '#6a4020']]); ctx.beginPath(); ctx.roundRect(4, 34, w - 8, h - 50, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#d8c070'; ctx.beginPath(); ctx.roundRect(11, 40, w - 22, h - 64, 6); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(120,90,30,0.6)'; ctx.lineWidth = 1; for (let k = 0; k < 18; k++) { const x = 14 + (k * 53) % (w - 28), y = 44 + (k * 37) % (h - 70); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 8, y + 2); ctx.stroke(); }
    // Llençol i coixí
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2;
    ctx.fillStyle = gradVBib(ctx, 40, 70, [[0, '#f2ecdc'], [1, '#d4cab0']]); ctx.beginPath(); ctx.roundRect(13, 40, w - 26, 50, 5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = gradVBib(ctx, 44, 66, [[0, '#fbf6e8'], [1, '#d8cfb4']]); ctx.beginPath(); ctx.roundRect(22, 46, w - 44, 24, 9); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(120,100,70,0.4)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(32, 58); ctx.quadraticCurveTo(w / 2, 52, w - 32, 58); ctx.stroke();
    // Manta de llana: ratlles ocres i verdes amb serrells
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2;
    ctx.fillStyle = '#7a3a2a'; ctx.beginPath(); ctx.roundRect(11, 84, w - 22, h - 112, 5); ctx.fill(); ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.roundRect(11, 84, w - 22, h - 112, 5); ctx.clip();
    [[96, '#c8a040'], [104, '#3a5a3a'], [112, '#c8a040'], [150, '#3a5a3a'], [158, '#c8a040'], [166, '#3a5a3a']].forEach(([y, c]) => { ctx.fillStyle = c; ctx.fillRect(11, y, w - 22, 5); });
    ctx.fillStyle = gradVBib(ctx, 84, h - 28, [[0, 'rgba(255,230,190,0.2)'], [0.4, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.3)']]); ctx.fillRect(11, 84, w - 22, h - 112);
    ctx.strokeStyle = 'rgba(40,20,10,0.35)'; ctx.lineWidth = 1; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(14 + k * 22, 90); ctx.quadraticCurveTo(20 + k * 22, 130, 14 + k * 22, h - 34); ctx.stroke(); }
    ctx.restore();
    ctx.strokeStyle = '#e8d8b0'; ctx.lineWidth = 1.6; for (let x = 14; x < w - 12; x += 5) { ctx.beginPath(); ctx.moveTo(x, h - 28); ctx.lineTo(x + (x % 2 ? 1.5 : -1.5), h - 22); ctx.stroke(); }
    // Peücs
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2.4; ctx.fillStyle = gradVBib(ctx, h - 28, h - 10, [[0, '#a67442'], [1, '#5a3418']]);
    ctx.beginPath(); ctx.roundRect(2, h - 26, w - 4, 16, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,225,170,0.35)'; ctx.fillRect(4, h - 25, w - 8, 2);
}

// ---------- Taula rústica amb gerra, bol, pa, espelma, llibre i tinter ----------
function pintarTaulaCela(ctx, w, h) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(w / 2, h - 5, w * 0.48, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2;
    const pota = (x, y0, y1, ample) => {
        ctx.fillStyle = gradHBib(ctx, x, x + ample, [[0, '#8a5a2c'], [1, '#3a2010']]); ctx.fillRect(x, y0, ample, y1 - y0); ctx.strokeRect(x, y0, ample, y1 - y0);
        ctx.fillStyle = '#4a2a14'; ctx.fillRect(x - 2, y1 - 3, ample + 4, 5); ctx.strokeRect(x - 2, y1 - 3, ample + 4, 5);
    };
    pota(12, 50, h - 12, 9); pota(w - 21, 50, h - 12, 9);
    ctx.fillStyle = '#4a2a14'; ctx.fillRect(14, h - 34, w - 28, 5); ctx.strokeRect(14, h - 34, w - 28, 5);
    // Faldó i tauler
    ctx.fillStyle = gradVBib(ctx, 44, 60, [[0, '#6a4020'], [1, '#3a200e']]); ctx.fillRect(4, 44, w - 8, 16); ctx.strokeRect(4, 44, w - 8, 16);
    ctx.fillStyle = gradVBib(ctx, 0, 46, [[0, '#a67442'], [0.5, '#8e5e32'], [1, '#6e4624']]);
    ctx.beginPath(); ctx.moveTo(12, 6); ctx.lineTo(w - 12, 6); ctx.lineTo(w, 46); ctx.lineTo(0, 46); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(40,20,8,0.35)'; ctx.lineWidth = 1; [0.25, 0.5, 0.75].forEach(f => { ctx.beginPath(); ctx.moveTo(12 - 12 * f * 0 + w * f * 0.08, 6 + 40 * f); ctx.lineTo(w - 12 * (1 - f), 6 + 40 * f); ctx.stroke(); });
    ctx.fillStyle = 'rgba(255,225,170,0.35)'; ctx.fillRect(2, 44, w - 4, 2);
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.6;
    // Gerra de fang
    ctx.fillStyle = gradHBib(ctx, 18, 40, [[0, '#d8985a'], [1, '#7a4a22']]); ctx.beginPath(); ctx.ellipse(30, 24, 11, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillRect(25, 6, 10, 8); ctx.strokeRect(25, 6, 10, 8); ctx.beginPath(); ctx.arc(42, 20, 6, -1.2, 1.2); ctx.stroke();
    // Bol amb pa
    ctx.fillStyle = '#6a4220'; ctx.beginPath(); ctx.ellipse(w * 0.56, 28, 15, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#d8b068'; ctx.beginPath(); ctx.ellipse(w * 0.56, 24, 11, 8, 0, Math.PI, 0); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(100,60,20,0.7)'; ctx.lineWidth = 1; [-4, 0, 4].forEach(dx => { ctx.beginPath(); ctx.moveTo(w * 0.56 + dx - 2, 22); ctx.lineTo(w * 0.56 + dx + 2, 18); ctx.stroke(); });
    // Llibre obert i tinter
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.4;
    ctx.fillStyle = '#4a1418'; ctx.fillRect(w * 0.7, 20, 30, 18); ctx.strokeRect(w * 0.7, 20, 30, 18);
    ctx.fillStyle = '#f2e6c8'; ctx.fillRect(w * 0.7 + 2, 22, 12, 14); ctx.fillRect(w * 0.7 + 16, 22, 12, 14);
    ctx.strokeStyle = 'rgba(90,60,30,0.7)'; ctx.lineWidth = 0.7; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(w * 0.7 + 4, 26 + k * 4); ctx.lineTo(w * 0.7 + 12, 26 + k * 4); ctx.moveTo(w * 0.7 + 18, 26 + k * 4); ctx.lineTo(w * 0.7 + 26, 26 + k * 4); ctx.stroke(); }
    // Espelma en candeler
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.4; ctx.fillStyle = '#c8a040'; ctx.fillRect(w * 0.42, 30, 11, 5); ctx.strokeRect(w * 0.42, 30, 11, 5);
    ctx.fillStyle = '#f2e6c8'; ctx.fillRect(w * 0.42 + 3, 16, 5, 14); ctx.strokeRect(w * 0.42 + 3, 16, 5, 14);
    ctx.fillStyle = '#ffc040'; ctx.beginPath(); ctx.ellipse(w * 0.42 + 5.5, 11, 2.6, 4.8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff4c0'; ctx.beginPath(); ctx.ellipse(w * 0.42 + 5.5, 12, 1.1, 2.2, 0, 0, Math.PI * 2); ctx.fill();
}

// ---------- Cadira rústica de seient de boga i respatller de travessers, vista de tres quarts ----------
function pintarCadiraCela(ctx, w, h) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(w / 2, h - 5, w * 0.42, 5, 0, 0, Math.PI * 2); ctx.fill();
    const tub = (x0, y0, x1, y1, gruix) => {
        ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = gruix + 3; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
        ctx.strokeStyle = '#8a5a2c'; ctx.lineWidth = gruix; ctx.stroke();
        ctx.strokeStyle = 'rgba(255,225,170,0.4)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0 - 1, y0 + 1); ctx.lineTo(x1 - 1, y1 - 1); ctx.stroke();
    };
    tub(9, 4, 8, 44, 5); tub(w - 9, 4, w - 8, 44, 5);                                   // muntants del respatller
    [10, 20, 30].forEach(y => tub(9, y, w - 9, y, 3.4));                                // travessers
    // Seient
    ctx.fillStyle = '#c8a860'; ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(6, 42); ctx.lineTo(w - 6, 42); ctx.lineTo(w - 2, 56); ctx.lineTo(2, 56); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(120,84,30,0.7)'; ctx.lineWidth = 0.9;
    for (let k = -4; k < 8; k++) { ctx.beginPath(); ctx.moveTo(4 + k * 6, 42); ctx.lineTo(10 + k * 6 - 8, 56); ctx.stroke(); ctx.beginPath(); ctx.moveTo(4 + k * 6 + 8, 42); ctx.lineTo(10 + k * 6, 56); ctx.stroke(); }
    ctx.fillStyle = '#6a4020'; ctx.fillRect(2, 56, w - 4, 5); ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.6; ctx.strokeRect(2, 56, w - 4, 5);
    tub(7, 60, 6, h - 6, 5); tub(w - 7, 60, w - 6, h - 6, 5); tub(7, h - 18, w - 7, h - 18, 2.6);   // potes i travesser
}

// ---------- Finestra de la cel·la: arrimada de pedra, porticons de fusta (un d'obert) i vidres amb plom, amb llum de fora ----------
function pintarFinestraCela(ctx, w, h) {
    ctx.lineJoin = 'round';
    ctx.fillStyle = gradHBib(ctx, 0, w, [[0, '#b8a888'], [1, '#8a7a60']]); ctx.beginPath(); ctx.roundRect(0, 0, w, h, 6); ctx.fill();
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2.6; ctx.stroke();
    const x0 = 9, y0 = 9, ww = w - 18, hh = h - 22;
    const cel = ctx.createLinearGradient(0, y0, 0, y0 + hh); cel.addColorStop(0, '#bfe2ff'); cel.addColorStop(1, '#fdf2c8');
    ctx.fillStyle = cel; ctx.fillRect(x0, y0, ww, hh);
    ctx.fillStyle = 'rgba(80,140,70,0.75)'; ctx.beginPath(); ctx.moveTo(x0, y0 + hh); ctx.lineTo(x0, y0 + hh - 16); ctx.quadraticCurveTo(x0 + ww * 0.4, y0 + hh - 28, x0 + ww, y0 + hh - 12); ctx.lineTo(x0 + ww, y0 + hh); ctx.closePath(); ctx.fill();   // turons llunyans
    ctx.strokeStyle = '#1a1410'; ctx.lineWidth = 2.4; ctx.strokeRect(x0, y0, ww, hh);
    ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0 + ww / 2, y0); ctx.lineTo(x0 + ww / 2, y0 + hh); ctx.moveTo(x0, y0 + hh * 0.45); ctx.lineTo(x0 + ww, y0 + hh * 0.45); ctx.stroke();
    ctx.strokeStyle = 'rgba(26,20,16,0.5)'; ctx.lineWidth = 1; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(x0, y0 + hh * k / 4); ctx.lineTo(x0 + ww, y0 + hh * k / 4 - 4); ctx.stroke(); }
    // Porticó obert a la dreta i un de mig tancat a l'esquerra
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2;
    ctx.fillStyle = gradHBib(ctx, w - 12, w + 4, [[0, '#6a4020'], [1, '#3a2010']]); ctx.fillRect(w - 8, 4, 14, h - 14); ctx.strokeRect(w - 8, 4, 14, h - 14);
    ctx.fillStyle = gradHBib(ctx, -6, 10, [[0, '#3a2010'], [1, '#6a4020']]); ctx.fillRect(-6, 4, 14, h - 14); ctx.strokeRect(-6, 4, 14, h - 14);
    ctx.strokeStyle = 'rgba(20,10,4,0.6)'; ctx.lineWidth = 1; [-2, w + 0].forEach(x => { for (let y = 12; y < h - 14; y += 14) { ctx.beginPath(); ctx.moveTo(x - 2, y); ctx.lineTo(x + 8, y); ctx.stroke(); } });
    // Ampit amb una torreta de farigola
    ctx.fillStyle = gradVBib(ctx, h - 14, h, [[0, '#cdbd9c'], [1, '#7c6c52']]); ctx.fillRect(-4, h - 14, w + 8, 14); ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2; ctx.strokeRect(-4, h - 14, w + 8, 14);
    ctx.fillStyle = '#9a5a2e'; ctx.fillRect(16, h - 26, 20, 13); ctx.strokeRect(16, h - 26, 20, 13);
    ctx.fillStyle = '#3a7a3a'; [[20, h - 32], [26, h - 36], [32, h - 31]].forEach(([x, y]) => { ctx.beginPath(); ctx.ellipse(x, y, 5, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
}

// ---------- Prestatge de paret: dues baldes amb pots, ampolles, llibres, caixes i un manat d'herbes penjat ----------
function pintarPrestatgeCela(ctx, w, h) {
    ctx.lineJoin = 'round';
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2;
    // Manat d'herbes penjat
    ctx.strokeStyle = '#3a2a1a'; ctx.beginPath(); ctx.moveTo(w - 22, 0); ctx.lineTo(w - 22, 10); ctx.stroke();
    ctx.fillStyle = '#5a8a4a'; [[-6, 14], [0, 18], [6, 14]].forEach(([dx, l]) => { ctx.beginPath(); ctx.moveTo(w - 22, 10); ctx.quadraticCurveTo(w - 22 + dx * 1.5, 10 + l, w - 22 + dx, 12 + l * 1.6); ctx.quadraticCurveTo(w - 22 + dx * 0.4, 10 + l, w - 22, 10); ctx.fill(); });
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2;
    const balda = y => { ctx.fillStyle = gradVBib(ctx, y, y + 8, [[0, '#a67442'], [1, '#5a3418']]); ctx.fillRect(2, y, w - 4, 8); ctx.strokeRect(2, y, w - 4, 8); ctx.fillStyle = 'rgba(255,225,170,0.4)'; ctx.fillRect(3, y + 1, w - 6, 1.6); };
    ctx.fillStyle = '#4a2a14'; [[6, 28], [w - 12, 28]].forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(x, y + 8); ctx.lineTo(x + 6, y + 8); ctx.lineTo(x, y + 26); ctx.closePath(); ctx.fill(); ctx.stroke(); });
    balda(36); balda(h - 12);
    const pot = (x, yb, ww, hh, c) => { ctx.fillStyle = gradHBib(ctx, x, x + ww, [[0, c[0]], [1, c[1]]]); ctx.beginPath(); ctx.roundRect(x, yb - hh, ww, hh, 4); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#e8dcc0'; ctx.fillRect(x + 1, yb - hh - 4, ww - 2, 4); ctx.strokeRect(x + 1, yb - hh - 4, ww - 2, 4); ctx.fillStyle = 'rgba(240,230,200,0.85)'; ctx.fillRect(x + 3, yb - hh * 0.7, ww - 6, hh * 0.28); };
    pot(10, 36, 16, 20, ['#c98a4a', '#7a4a22']); pot(30, 36, 14, 16, ['#b87a3a', '#6a3a18']); pot(48, 36, 18, 22, ['#8a6a3a', '#4a3416']);
    ctx.fillStyle = gradHBib(ctx, 70, 80, [[0, '#6a9a5a'], [1, '#2a4a24']]); ctx.beginPath(); ctx.roundRect(70, 18, 10, 18, 3); ctx.fill(); ctx.stroke(); ctx.fillRect(73, 12, 4, 6); ctx.strokeRect(73, 12, 4, 6);   // ampolla
    [['#7a1e24', 22], ['#24467a', 26], ['#3a6a3a', 20], ['#8a6428', 24]].forEach(([c, hh], i) => { ctx.fillStyle = c; ctx.fillRect(14 + i * 9, h - 12 - hh, 8, hh); ctx.strokeRect(14 + i * 9, h - 12 - hh, 8, hh); ctx.fillStyle = 'rgba(212,166,64,0.9)'; ctx.fillRect(14 + i * 9, h - 12 - hh + 4, 8, 1.4); });
    ctx.fillStyle = '#5a3a1e'; ctx.fillRect(56, h - 12 - 18, 28, 18); ctx.strokeRect(56, h - 12 - 18, 28, 18); ctx.fillStyle = '#c8a040'; ctx.fillRect(66, h - 12 - 10, 8, 4);   // caixeta
    ctx.fillStyle = '#e8d8b0'; ctx.beginPath(); ctx.ellipse(w - 22, h - 16, 10, 4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#d8c090'; ctx.fillRect(w - 28, h - 24, 12, 8);          // pa
}

// ---------- Creu de fusta amb un Crist de llautó, petita, de paret ----------
function pintarCreuCela(ctx, w, h) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(w / 2, 2); ctx.lineTo(w / 2, h - 2); ctx.moveTo(4, h * 0.3); ctx.lineTo(w - 4, h * 0.3); ctx.stroke();
    ctx.strokeStyle = '#6a4020'; ctx.lineWidth = 6.4; ctx.stroke();
    ctx.strokeStyle = 'rgba(255,225,170,0.4)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(w / 2 - 2, 4); ctx.lineTo(w / 2 - 2, h - 4); ctx.stroke();
    ctx.fillStyle = '#d4a840'; ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(w / 2, h * 0.3 - 7, 3.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillRect(w / 2 - 2.4, h * 0.3 - 4, 4.8, 18); ctx.strokeRect(w / 2 - 2.4, h * 0.3 - 4, 4.8, 18);
    ctx.fillRect(w / 2 - 12, h * 0.3 - 2, 24, 3.4); ctx.strokeRect(w / 2 - 12, h * 0.3 - 2, 24, 3.4);
}

// ---------- Hàbit de llana penjat d'un clau de fusta, amb el cordó i un parell de sandàlies a sota ----------
function pintarHabitCela(ctx, w, h) {
    const cx = w / 2;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.fillStyle = '#4a2a14'; ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2; ctx.fillRect(cx - 24, 0, 48, 7); ctx.strokeRect(cx - 24, 0, 48, 7);
    ctx.fillStyle = '#c8a040'; ctx.beginPath(); ctx.arc(cx, 8, 3.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = gradHBib(ctx, cx - 28, cx + 28, [[0, '#5a3a22'], [0.5, '#6e4a2c'], [1, '#3e2614']]);
    ctx.beginPath(); ctx.moveTo(cx - 8, 10); ctx.quadraticCurveTo(cx, 18, cx + 8, 10); ctx.lineTo(cx + 26, 26); ctx.lineTo(cx + 30, 62); ctx.lineTo(cx + 16, 66); ctx.lineTo(cx + 15, h - 14); ctx.lineTo(cx - 15, h - 14); ctx.lineTo(cx - 16, 66); ctx.lineTo(cx - 30, 62); ctx.lineTo(cx - 26, 26); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#4a2e1a'; ctx.beginPath(); ctx.moveTo(cx - 12, 11); ctx.quadraticCurveTo(cx, 30, cx + 12, 11); ctx.quadraticCurveTo(cx, 20, cx - 12, 11); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(20,10,4,0.45)'; ctx.lineWidth = 1.2; [-8, 0, 8].forEach(dx => { ctx.beginPath(); ctx.moveTo(cx + dx, 40); ctx.quadraticCurveTo(cx + dx * 1.3, 80, cx + dx, h - 18); ctx.stroke(); });
    ctx.strokeStyle = '#e8dcc0'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - 18, 54); ctx.quadraticCurveTo(cx, 60, cx + 18, 54); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx + 6, 57); ctx.lineTo(cx + 8, 76); ctx.stroke();
    ctx.fillStyle = '#6a4020'; ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 1.6; [[cx - 14, h - 11], [cx + 4, h - 11]].forEach(([x, y]) => { ctx.beginPath(); ctx.roundRect(x, y, 12, 7, 3); ctx.fill(); ctx.stroke(); });
}

// ---------- Estora rodona de pleita: anells de colors trenats ----------
function pintarEstoraCela(ctx, w, h) {
    const cx = w / 2, cy = h / 2;
    ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.beginPath(); ctx.ellipse(cx, cy + 3, w * 0.5, h * 0.5, 0, 0, Math.PI * 2); ctx.fill();
    const anells = ['#a67442', '#7a3a2a', '#c8a860', '#3a5a3a', '#a67442', '#7a3a2a', '#c8a860'];
    anells.forEach((c, i) => {
        const f = 1 - i / anells.length;
        ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(cx, cy, w * 0.48 * f, h * 0.48 * f, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(30,14,4,0.55)'; ctx.lineWidth = 1.4; ctx.stroke();
    });
    ctx.strokeStyle = 'rgba(30,14,4,0.3)'; ctx.lineWidth = 1;
    for (let a = 0; a < Math.PI * 2; a += 0.12) { ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * w * 0.12, cy + Math.sin(a) * h * 0.12); ctx.lineTo(cx + Math.cos(a) * w * 0.47, cy + Math.sin(a) * h * 0.47); ctx.stroke(); }
}

// ---------- Cofre de fusta amb bandes i pany de ferro ----------
function pintarCofreCela(ctx, w, h) {
    ctx.lineJoin = 'round';
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(w / 2, h - 5, w * 0.5, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = BIB_CONTORN; ctx.lineWidth = 2.2;
    ctx.fillStyle = gradVBib(ctx, 20, h - 8, [[0, '#8a5a2c'], [1, '#4a2a14']]); ctx.beginPath(); ctx.roundRect(2, 22, w - 4, h - 30, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = gradVBib(ctx, 4, 24, [[0, '#a67442'], [1, '#6a4020']]); ctx.beginPath(); ctx.roundRect(0, 6, w, 20, [10, 10, 3, 3]); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#3a3a42'; [14, w - 22].forEach(x => { ctx.fillRect(x, 8, 8, h - 14); ctx.strokeRect(x, 8, 8, h - 14); });
    ctx.fillStyle = '#c8a040'; ctx.fillRect(w / 2 - 6, 20, 12, 14); ctx.strokeRect(w / 2 - 6, 20, 12, 14); ctx.fillStyle = '#1a1208'; ctx.fillRect(w / 2 - 1.4, 25, 2.8, 6);
    ctx.strokeStyle = 'rgba(40,20,8,0.4)'; ctx.lineWidth = 1; for (let y = 32; y < h - 10; y += 8) { ctx.beginPath(); ctx.moveTo(26, y); ctx.lineTo(w - 26, y); ctx.stroke(); }
}
