/**
 * LA CASA GRAN PER DINS: passadís secret, cambra del tresor, cripta i rosa dels vents de l'Home del Raïm.
 * Es pinten en coordenades de disseny (ctx, w, h) i assets.js les converteix en textures.
 * Fan servir carreusErmita (dibuixos_ermita.js) i els ajudants de dibuixos_biblio.js.
 */

const CASA_C = '#140a04';

// Una fornícula d'arc de mig punt amb fons fosc
function nixolCasa(ctx, x, y, w, h, fons = ['#0c0806', '#241a12']) {
    const arc = () => { ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x, y + w / 2); ctx.arc(x + w / 2, y + w / 2, w / 2, Math.PI, 0); ctx.lineTo(x + w, y + h); ctx.closePath(); };
    ctx.lineWidth = 6; ctx.strokeStyle = '#8a8070'; arc(); ctx.stroke();
    const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, fons[0]); g.addColorStop(1, fons[1]);
    ctx.fillStyle = g; arc(); ctx.fill(); ctx.lineWidth = 1.8; ctx.strokeStyle = CASA_C; arc(); ctx.stroke();
}

function teranyinaCasa(ctx, x, y, d, r = 46) {
    ctx.strokeStyle = 'rgba(240,236,224,0.38)'; ctx.lineWidth = 0.9;
    for (let i = 1; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(x, y + i * r / 4); ctx.quadraticCurveTo(x + d * i * r / 7, y + i * r / 7, x + d * i * r / 4, y); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + d * r, y + r); ctx.moveTo(x + d * r / 2, y); ctx.lineTo(x, y + r / 2); ctx.stroke();
}

// ---------- Paret del fons de la cripta: carreus freds, sis nínxols amb làpides amb creu, volta d'arcs i teranyines ----------
function pintarParetCripta(ctx, w, h) {
    ctx.lineJoin = 'round';
    carreusErmita(ctx, 0, 0, w, h, 417, [96, 98, 104], 24);
    for (let i = 0; i < 5; i++) {
        const x = 40 + i * 140, y = 22;
        nixolCasa(ctx, x, y, 70, 118);
        // Làpida que tanca el nínxol, amb una creu gravada i una placa
        ctx.fillStyle = '#9a9488'; ctx.fillRect(x + 6, y + 56, 58, 60); ctx.strokeStyle = CASA_C; ctx.lineWidth = 1.6; ctx.strokeRect(x + 6, y + 56, 58, 60);
        ctx.strokeStyle = 'rgba(40,34,26,0.75)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 35, y + 64); ctx.lineTo(x + 35, y + 96); ctx.moveTo(x + 23, y + 74); ctx.lineTo(x + 47, y + 74); ctx.stroke();
        ctx.fillStyle = '#6a645a'; ctx.fillRect(x + 16, y + 102, 38, 8); ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(x + 8, y + 58, 54, 2);
        // Una espelma curta davant de dos nínxols
        if (i % 2 === 0) { ctx.fillStyle = '#f0e4c0'; ctx.fillRect(x + 32, y + 40, 6, 14); ctx.fillStyle = '#ffb030'; ctx.beginPath(); ctx.ellipse(x + 35, y + 36, 2.4, 5, 0, 0, Math.PI * 2); ctx.fill(); }
    }
    // Costelles de la volta a dalt
    ctx.strokeStyle = '#7a7466'; ctx.lineWidth = 8; ctx.beginPath(); for (let i = 0; i < 6; i++) { const x = i * 148; ctx.moveTo(x, 0); ctx.quadraticCurveTo(x + 74, 38, x + 148, 0); } ctx.stroke();
    ctx.strokeStyle = CASA_C; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.fillStyle = gradVBib(ctx, h - 14, h, [[0, '#8a8272'], [1, '#5a5448']]); ctx.fillRect(0, h - 14, w, 14);
    ctx.strokeStyle = CASA_C; ctx.lineWidth = 1.8; ctx.strokeRect(0, h - 14, w, 14);
    teranyinaCasa(ctx, 0, 0, 1, 56); teranyinaCasa(ctx, w, 0, -1, 56);
    ctx.fillStyle = gradVBib(ctx, 0, h, [[0, 'rgba(0,0,0,0.5)'], [0.35, 'rgba(0,0,0,0.05)'], [1, 'rgba(0,0,0,0.3)']]); ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = gradHBib(ctx, 0, w, [[0, 'rgba(0,0,0,0.4)'], [0.1, 'rgba(0,0,0,0)'], [0.9, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.4)']]); ctx.fillRect(0, 0, w, h);
}

// ---------- Paret del fons de la cambra del tresor: tres alcoves amb prestatges, gerros, pergamins i or ----------
function pintarParetTresor(ctx, w, h) {
    ctx.lineJoin = 'round';
    carreusErmita(ctx, 0, 0, w, h, 733, [128, 112, 92], 26);
    const r = rndBib(41);
    [[60, 150], [250, 150], [440, 150]].forEach(([x], i) => {
        const wA = 150, yA = 18, hA = 124;
        nixolCasa(ctx, x, yA, wA, hA, ['#120c08', '#2e2216']);
        ctx.save(); ctx.beginPath(); ctx.rect(x + 3, yA + 3, wA - 6, hA - 6); ctx.clip();
        // Dos prestatges de fusta amb la seva mercaderia
        [yA + 70, yA + 112].forEach((ys, k) => {
            ctx.fillStyle = '#6a4424'; ctx.fillRect(x + 4, ys, wA - 8, 7); ctx.strokeStyle = CASA_C; ctx.lineWidth = 1.4; ctx.strokeRect(x + 4, ys, wA - 8, 7);
            for (let j = 0; j < 5; j++) {
                const px = x + 16 + j * 27 + r() * 6, tipus = (i + j + k) % 3;
                if (tipus === 0) { ctx.fillStyle = '#a8683a'; ctx.beginPath(); ctx.ellipse(px, ys - 12, 8, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#6a3a1a'; ctx.fillRect(px - 3, ys - 26, 6, 6); }       // gerro
                else if (tipus === 1) { ctx.fillStyle = 'rgba(90,150,90,0.8)'; ctx.fillRect(px - 5, ys - 24, 10, 24); ctx.strokeRect(px - 5, ys - 24, 10, 24); ctx.fillStyle = '#d8c8a0'; ctx.fillRect(px - 2, ys - 28, 4, 5); }   // ampolla
                else { ctx.fillStyle = '#e8d8a8'; ctx.fillRect(px - 9, ys - 12, 18, 12); ctx.strokeRect(px - 9, ys - 12, 18, 12); ctx.fillStyle = '#9a2a1a'; ctx.beginPath(); ctx.arc(px, ys - 6, 3, 0, Math.PI * 2); ctx.fill(); }   // pergamí amb segell
            }
        });
        // Una piloteta d'or al terra de l'alcova del mig
        if (i === 1) { for (let c = 0; c < 14; c++) { ctx.fillStyle = c % 3 ? '#e8c040' : '#c89a28'; ctx.beginPath(); ctx.ellipse(x + 60 + r() * 30, yA + hA - 12 - r() * 8, 5, 2.4, 0, 0, Math.PI * 2); ctx.fill(); } }
        ctx.restore();
    });
    // Llanterna penjada, volta i cornisa
    ctx.strokeStyle = '#7a7466'; ctx.lineWidth = 8; ctx.beginPath(); for (let i = 0; i < 5; i++) { const x = i * 190; ctx.moveTo(x, 0); ctx.quadraticCurveTo(x + 95, 30, x + 190, 0); } ctx.stroke();
    ctx.strokeStyle = CASA_C; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.fillStyle = gradVBib(ctx, h - 14, h, [[0, '#a89a82'], [1, '#6a604e']]); ctx.fillRect(0, h - 14, w, h);
    ctx.strokeStyle = CASA_C; ctx.lineWidth = 1.8; ctx.strokeRect(0, h - 14, w, 14);
    teranyinaCasa(ctx, 0, 0, 1, 50); teranyinaCasa(ctx, w, 0, -1, 50);
    ctx.fillStyle = gradVBib(ctx, 0, h, [[0, 'rgba(0,0,0,0.5)'], [0.3, 'rgba(0,0,0,0.04)'], [1, 'rgba(0,0,0,0.28)']]); ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = gradHBib(ctx, 0, w, [[0, 'rgba(0,0,0,0.4)'], [0.1, 'rgba(0,0,0,0)'], [0.9, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.4)']]); ctx.fillRect(0, 0, w, h);
}

// ---------- Passadís secret: mur lateral (molt llarg), fons amb l'arc de la porta i costella de la volta ----------
function pintarMurPassadis(ctx, w, h) {
    carreusErmita(ctx, 0, 0, w, h, 911, [88, 80, 70], 30);
    const r = rndBib(3);
    for (let k = 0; k < 30; k++) { ctx.fillStyle = k % 2 ? 'rgba(60,92,46,0.2)' : 'rgba(20,14,8,0.22)'; ctx.beginPath(); ctx.ellipse(r() * w, r() * h, 8 + r() * 14, 16 + r() * 30, r(), 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = gradHBib(ctx, 0, w, [[0, 'rgba(0,0,0,0.5)'], [0.7, 'rgba(0,0,0,0.12)'], [1, 'rgba(0,0,0,0.5)']]); ctx.fillRect(0, 0, w, h);
}
function pintarFonsPassadis(ctx, w, h) {
    ctx.lineJoin = 'round';
    carreusErmita(ctx, 0, 0, w, h, 929, [92, 84, 74], 24);
    const cx = w / 2;
    // Gran arc de pedra amb dovelles, on s'encaixa la porta
    ctx.lineWidth = 12; ctx.strokeStyle = '#a89e8a'; ctx.beginPath(); ctx.moveTo(cx - 62, h); ctx.lineTo(cx - 62, 62); ctx.arc(cx, 62, 62, Math.PI, 0); ctx.lineTo(cx + 62, h); ctx.stroke();
    ctx.lineWidth = 2; ctx.strokeStyle = CASA_C; ctx.stroke();
    ctx.strokeStyle = 'rgba(40,32,22,0.7)'; ctx.lineWidth = 1.4; for (let a = 0; a <= 8; a++) { const an = Math.PI + a / 8 * Math.PI; ctx.beginPath(); ctx.moveTo(cx + Math.cos(an) * 56, 62 + Math.sin(an) * 56); ctx.lineTo(cx + Math.cos(an) * 68, 62 + Math.sin(an) * 68); ctx.stroke(); }
    ctx.fillStyle = gradVBib(ctx, 0, h, [[0, 'rgba(0,0,0,0.5)'], [0.5, 'rgba(0,0,0,0.05)'], [1, 'rgba(0,0,0,0.2)']]); ctx.fillRect(0, 0, w, h);
}
function pintarCostellaPassadis(ctx, w, h) {
    ctx.lineJoin = 'round';
    const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#6a6256'); g.addColorStop(1, '#3a342c');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w, 0); ctx.lineTo(w, h * 0.55); ctx.quadraticCurveTo(w / 2, h * 1.35, 0, h * 0.55); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = CASA_C; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(2, 2, w - 4, 3);
}

// ---------- Sarcòfag de pedra d'un monjo, amb l'efígie de mans creuades i una creu ----------
function pintarSarcofagCripta(ctx, w, h) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(w / 2, h - 5, w * 0.48, 6, 0, 0, Math.PI * 2); ctx.fill();
    const pesa = (x, y, ww, hh, c1, c2) => { const g = ctx.createLinearGradient(0, y, 0, y + hh); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(x, y, ww, hh); ctx.strokeStyle = CASA_C; ctx.lineWidth = 2; ctx.strokeRect(x, y, ww, hh); };
    pesa(6, h * 0.42, w - 12, h * 0.5, '#a49c8c', '#6e685c');                    // caixa
    for (let x = 22; x < w - 14; x += 34) { ctx.strokeStyle = 'rgba(30,24,16,0.55)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x, h * 0.46); ctx.lineTo(x, h * 0.9); ctx.stroke(); }
    pesa(2, h * 0.22, w - 4, h * 0.22, '#c4bcaa', '#8a8374');                      // tapa
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(4, h * 0.23, w - 8, 2);
    // Efígie: cap amb caputxa i mans creuades sobre el pit, i una creu
    ctx.fillStyle = '#b4ac9a'; ctx.beginPath(); ctx.ellipse(w * 0.2, h * 0.33, 9, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = CASA_C; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(w * 0.55, h * 0.33, w * 0.26, 6, 0, 0, Math.PI * 2); ctx.fillStyle = '#a89f8d'; ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(40,32,22,0.8)'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(w * 0.5, h * 0.27); ctx.lineTo(w * 0.7, h * 0.39); ctx.moveTo(w * 0.5, h * 0.39); ctx.lineTo(w * 0.7, h * 0.27); ctx.stroke();
    const r = rndBib(w); ctx.fillStyle = 'rgba(70,100,50,0.4)'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(10 + r() * (w - 20), h * 0.9, 4 + r() * 5, 2 + r() * 2, 0, 0, Math.PI * 2); ctx.fill(); }
    teranyinaCasa(ctx, 4, h * 0.2, 1, 22);
}

// ---------- Llosa de la cripta amb la clau de ferro i el paper dels monjos, o buida ----------
function pintarLlosaCripta(ctx, w, h, plena) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(w / 2, h - 5, w * 0.5, 6, 0, 0, Math.PI * 2); ctx.fill();
    const pesa = (x, y, ww, hh, c1, c2) => { const g = ctx.createLinearGradient(0, y, 0, y + hh); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(x, y, ww, hh); ctx.strokeStyle = CASA_C; ctx.lineWidth = 2; ctx.strokeRect(x, y, ww, hh); };
    pesa(8, h - 20, w - 16, 16, '#9a9284', '#6a645a');                             // peu
    pesa(18, h * 0.5, w - 36, h * 0.5 - 18, '#b0a898', '#7a7466');                  // cos
    pesa(0, h * 0.34, w, h * 0.18, '#d0c8b6', '#948c7c');                          // llosa
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(2, h * 0.355, w - 4, 2);
    ctx.strokeStyle = 'rgba(40,32,22,0.7)'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(w / 2, h * 0.58); ctx.lineTo(w / 2, h * 0.8); ctx.moveTo(w / 2 - 10, h * 0.66); ctx.lineTo(w / 2 + 10, h * 0.66); ctx.stroke();
    if (!plena) return;
    // Drap de lli, la clau de ferro negre i el paper plegat
    ctx.fillStyle = '#f0e8d4'; ctx.beginPath(); ctx.moveTo(14, h * 0.36); ctx.lineTo(w - 14, h * 0.36); ctx.lineTo(w - 8, h * 0.5); ctx.lineTo(8, h * 0.5); ctx.closePath(); ctx.fill(); ctx.strokeStyle = CASA_C; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.save(); ctx.translate(w * 0.42, h * 0.27); ctx.rotate(-0.12);
    ctx.strokeStyle = CASA_C; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(-28, 0, 11, 0, Math.PI * 2); ctx.moveTo(-17, 0); ctx.lineTo(36, 0); ctx.moveTo(26, 0); ctx.lineTo(26, 12); ctx.moveTo(34, 0); ctx.lineTo(34, 9); ctx.stroke();
    ctx.strokeStyle = '#3a3a40'; ctx.lineWidth = 4; ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-14, -1.5); ctx.lineTo(34, -1.5); ctx.stroke();
    ctx.restore();
    ctx.fillStyle = '#e8dcb4'; ctx.save(); ctx.translate(w * 0.8, h * 0.28); ctx.rotate(0.2); ctx.fillRect(-12, -9, 24, 18); ctx.strokeStyle = CASA_C; ctx.lineWidth = 1.2; ctx.strokeRect(-12, -9, 24, 18);
    ctx.strokeStyle = '#6a4a2a'; ctx.lineWidth = 1; [-3, 2].forEach(y => { ctx.beginPath(); ctx.moveTo(-8, y); ctx.lineTo(8, y); ctx.stroke(); }); ctx.restore();
}

// ---------- Prestatge de la cambra del tresor ----------
function pintarSacsTresor(ctx, w, h) {
    ctx.lineJoin = 'round';
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(w / 2, h - 5, w * 0.48, 6, 0, 0, Math.PI * 2); ctx.fill();
    [[0.28, 0.62, 30, '#b89a68'], [0.62, 0.66, 32, '#a88a58'], [0.45, 0.4, 28, '#c4a874']].forEach(([fx, fy, r, c]) => {
        const x = w * fx, y = h * fy;
        ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x - r * 0.9, y + r * 0.8); ctx.quadraticCurveTo(x - r * 1.2, y - r * 0.2, x - r * 0.35, y - r * 0.7); ctx.lineTo(x + r * 0.35, y - r * 0.7); ctx.quadraticCurveTo(x + r * 1.2, y - r * 0.2, x + r * 0.9, y + r * 0.8); ctx.closePath(); ctx.fill(); ctx.strokeStyle = CASA_C; ctx.lineWidth = 2; ctx.stroke();
        ctx.strokeStyle = '#6a4a2a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - r * 0.35, y - r * 0.6); ctx.lineTo(x + r * 0.35, y - r * 0.6); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.ellipse(x - r * 0.4, y, r * 0.18, r * 0.4, 0, 0, Math.PI * 2); ctx.fill();
    });
}
function pintarMonedesTresor(ctx, w, h) {
    ctx.lineJoin = 'round';
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(w / 2, h - 4, w * 0.45, 5, 0, 0, Math.PI * 2); ctx.fill();
    const r = rndBib(12);
    for (let i = 0; i < 46; i++) {
        const x = w / 2 + (r() - 0.5) * w * 0.8 * (1 - i / 80), y = h - 10 - i * 0.6 - r() * 6;
        ctx.fillStyle = i % 3 ? '#e8c040' : '#c89a28'; ctx.beginPath(); ctx.ellipse(x, y, 7, 3.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#6a4a0a'; ctx.lineWidth = 0.9; ctx.stroke();
    }
}
// Bóta de vi amb una creu vermella pintada: la que s'aixeca per obrir la porta
function pintarBotaCreu(ctx, w, h) {
    pintarBarril(ctx, w, h);
    ctx.strokeStyle = '#b02a22'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(w / 2, h * 0.34); ctx.lineTo(w / 2, h * 0.7); ctx.moveTo(w / 2 - 12, h * 0.46); ctx.lineTo(w / 2 + 12, h * 0.46); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,200,170,0.5)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(w / 2 - 1.5, h * 0.35); ctx.lineTo(w / 2 - 1.5, h * 0.68); ctx.stroke();
}
// ---------- Rosa dels vents de pedra (davant l'Home del Raïm): mosaic amb estrella de vuit puntes i els quatre punts cardinals ----------
function pintarRosaVents(ctx, w, h) {
    ctx.lineJoin = 'round';
    const cx = w / 2, cy = h / 2;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(1, h / w);                         // perspectiva: cercle aixafat
    const R = w / 2 - 6;
    const g = ctx.createRadialGradient(0, 0, 4, 0, 0, R); g.addColorStop(0, '#b4a88c'); g.addColorStop(1, '#7e725a');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = CASA_C; ctx.stroke();
    ctx.lineWidth = 3; ctx.strokeStyle = '#3a2c1a'; ctx.beginPath(); ctx.arc(0, 0, R * 0.82, 0, Math.PI * 2); ctx.stroke();
    // Estrella: quatre puntes llargues (cardinals) i quatre de curtes
    for (let k = 0; k < 8; k++) {
        const an = k * Math.PI / 4 - Math.PI / 2, long = k % 2 === 0, rr = long ? R * 0.8 : R * 0.5;
        ctx.fillStyle = long ? (k === 2 ? '#e0b83a' : '#d8cdb0') : '#a89c80';
        ctx.beginPath(); ctx.moveTo(Math.cos(an) * rr, Math.sin(an) * rr); ctx.lineTo(Math.cos(an + 0.3) * R * 0.2, Math.sin(an + 0.3) * R * 0.2); ctx.lineTo(Math.cos(an - 0.3) * R * 0.2, Math.sin(an - 0.3) * R * 0.2); ctx.closePath(); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = CASA_C; ctx.stroke();
    }
    ctx.fillStyle = '#3a2c1a'; ctx.beginPath(); ctx.arc(0, 0, R * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    // Lletres dels punts cardinals i, a l'est, un sol que neix i un raïm
    ctx.font = `bold ${Math.round(h * 0.17)}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 4; ctx.strokeStyle = '#1a0e06'; ctx.fillStyle = '#f2e6c8';
    [['N', cx, h * 0.06], ['E', w - 16, cy], ['S', cx, h * 0.94], ['O', 16, cy]].forEach(([t, x, y]) => { ctx.strokeText(t, x, y); ctx.fillText(t, x, y); });
    const sx = w - 44, sy = cy - 24;
    ctx.fillStyle = '#e8b830'; ctx.strokeStyle = '#6a3a0a'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(sx, sy, 8, Math.PI, 0); ctx.fill(); ctx.stroke();
    for (let a = 0; a < 5; a++) { const an = Math.PI + a / 4 * Math.PI; ctx.beginPath(); ctx.moveTo(sx + Math.cos(an) * 11, sy + Math.sin(an) * 11); ctx.lineTo(sx + Math.cos(an) * 17, sy + Math.sin(an) * 17); ctx.stroke(); }
    [[sx - 6, sy + 18], [sx + 6, sy + 18], [sx, sy + 26]].forEach(([x, y]) => { ctx.fillStyle = '#7a3a9a'; ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
}

// ---------- Fletxa de pedra amb daurats que indica cap on mira l'Home del Raïm (apunta cap amunt; es gira amb l'angle) ----------
function pintarFletxaRaim(ctx, w, h) {
    ctx.lineJoin = 'round';
    const cx = w / 2, cy = h / 2;
    const gl = ctx.createRadialGradient(cx, cy, 4, cx, cy, w / 2); gl.addColorStop(0, 'rgba(255,224,140,0.55)'); gl.addColorStop(1, 'rgba(255,224,140,0)');
    ctx.fillStyle = gl; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#6a604e'; ctx.beginPath(); ctx.arc(cx, cy, w * 0.34, 0, Math.PI * 2); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = CASA_C; ctx.stroke();
    ctx.fillStyle = '#e8c040'; ctx.beginPath(); ctx.moveTo(cx, cy - w * 0.3); ctx.lineTo(cx + w * 0.17, cy + w * 0.02); ctx.lineTo(cx + w * 0.06, cy + w * 0.02); ctx.lineTo(cx + w * 0.06, cy + w * 0.26); ctx.lineTo(cx - w * 0.06, cy + w * 0.26); ctx.lineTo(cx - w * 0.06, cy + w * 0.02); ctx.lineTo(cx - w * 0.17, cy + w * 0.02); ctx.closePath(); ctx.fill(); ctx.lineWidth = 2.4; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fillRect(cx - w * 0.04, cy - w * 0.08, 3, w * 0.28);
}

// ---------- Escalinata de la Casa Gran (fons de 1140x640): a partir de les fotos de l'Home del Raïm real ----------
// Una volta d'arc rebaixat amb nervis i un balcó amb dues columnes estriades de capitell corinti; a l'esquerra, l'escala de pedra
// que puja amb la seva barana massissa; a la dreta, un mur de carreus amb una porta oberta a la claror; al mig, el paviment de lloses.
function pintarEscalinata(ctx, w, h) {
    ctx.lineJoin = 'round';
    const r = rndBib(77);
    const cx = 570, rx = 250;
    carreusErmita(ctx, 0, 0, w, h, 901, [158, 138, 108], 32);

    // Volta: un arc gran, fosc per dins, amb dovelles, nervis i una claror que entra per dalt
    const arc = () => { ctx.beginPath(); ctx.moveTo(cx - rx, 344); ctx.lineTo(cx - rx, 150); ctx.ellipse(cx, 150, rx, 150, 0, Math.PI, 0); ctx.lineTo(cx + rx, 344); ctx.closePath(); };
    ctx.fillStyle = gradVBib(ctx, 0, 344, [[0, '#0d0907'], [0.5, '#2a1f15'], [1, '#4a3a28']]); arc(); ctx.fill();
    ctx.save(); arc(); ctx.clip();
    const lluna = ctx.createRadialGradient(cx + 40, 0, 10, cx + 40, 0, 200); lluna.addColorStop(0, 'rgba(255,248,220,0.6)'); lluna.addColorStop(1, 'rgba(255,248,220,0)');
    ctx.fillStyle = lluna; ctx.fillRect(cx - rx, 0, rx * 2, 344);
    ctx.strokeStyle = '#6b5c44'; ctx.lineWidth = 6;                                          // nervis de la volta
    ctx.beginPath(); ctx.moveTo(cx - rx + 8, 170); ctx.quadraticCurveTo(cx - 70, 30, cx, 12); ctx.quadraticCurveTo(cx + 70, 30, cx + rx - 8, 170); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - 60, 176); ctx.quadraticCurveTo(cx - 36, 70, cx, 12); ctx.moveTo(cx + 60, 176); ctx.quadraticCurveTo(cx + 36, 70, cx, 12); ctx.stroke();
    [[cx - 168, 70], [cx + 134, 70]].forEach(([x, y]) => {                                  // dues espitlleres fosques
        ctx.fillStyle = '#0a0705'; ctx.fillRect(x, y, 34, 66); ctx.strokeStyle = '#8a7e66'; ctx.lineWidth = 4; ctx.strokeRect(x, y, 34, 66);
    });
    ctx.restore();
    ctx.strokeStyle = '#d2c7a8'; ctx.lineWidth = 20; arc(); ctx.stroke();                    // anell de dovelles
    ctx.strokeStyle = CASA_C; ctx.lineWidth = 1.6; arc(); ctx.stroke();
    for (let k = 0; k <= 16; k++) {
        const a = Math.PI + k / 16 * Math.PI, c = Math.cos(a), s = Math.sin(a);
        ctx.beginPath(); ctx.moveTo(cx + c * (rx - 10), 150 + s * 140); ctx.lineTo(cx + c * (rx + 10), 150 + s * 160); ctx.stroke();
    }

    // Dues columnes estriades amb capitell, sobre el balcó
    [cx - 60, cx + 60].forEach(x => {
        ctx.fillStyle = gradHBib(ctx, x - 12, x + 12, [[0, '#cfc6ae'], [0.45, '#f0e9d4'], [1, '#a99f86']]); ctx.fillRect(x - 12, 66, 24, 120);
        ctx.strokeStyle = CASA_C; ctx.lineWidth = 1.6; ctx.strokeRect(x - 12, 66, 24, 120);
        ctx.strokeStyle = 'rgba(110,98,76,0.55)'; ctx.lineWidth = 1.2;
        [-6, 0, 6].forEach(d => { ctx.beginPath(); ctx.moveTo(x + d, 70); ctx.lineTo(x + d, 182); ctx.stroke(); });
        ctx.fillStyle = '#e4dcc4'; ctx.strokeStyle = CASA_C; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(x - 12, 66); ctx.lineTo(x - 22, 40); ctx.lineTo(x + 22, 40); ctx.lineTo(x + 12, 66); ctx.closePath(); ctx.fill(); ctx.stroke();           // capitell
        ctx.fillStyle = '#cfc6ae'; ctx.fillRect(x - 25, 32, 50, 10); ctx.strokeRect(x - 25, 32, 50, 10);
        [-18, 18].forEach(d => { ctx.fillStyle = '#d8cfb6'; ctx.beginPath(); ctx.arc(x + d, 52, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });                          // volutes
    });
    // Balcó: llosa clara, barana amb plafons i mènsules
    ctx.fillStyle = '#ddd3b8'; ctx.fillRect(cx - 200, 178, 400, 26); ctx.strokeStyle = CASA_C; ctx.lineWidth = 2; ctx.strokeRect(cx - 200, 178, 400, 26);
    ctx.fillStyle = '#bdb296'; ctx.fillRect(cx - 190, 204, 380, 40); ctx.strokeRect(cx - 190, 204, 380, 40);
    for (let i = 0; i < 5; i++) { ctx.fillStyle = '#a89d83'; ctx.fillRect(cx - 176 + i * 74, 212, 56, 24); ctx.strokeStyle = 'rgba(20,10,4,0.6)'; ctx.lineWidth = 1.4; ctx.strokeRect(cx - 176 + i * 74, 212, 56, 24); }
    [cx - 190, cx - 60, cx + 60, cx + 190 - 32].forEach(x => { ctx.fillStyle = '#cfc4a8'; ctx.beginPath(); ctx.moveTo(x, 244); ctx.lineTo(x + 32, 244); ctx.lineTo(x + 24, 272); ctx.lineTo(x + 8, 272); ctx.closePath(); ctx.fill(); ctx.strokeStyle = CASA_C; ctx.lineWidth = 1.6; ctx.stroke(); });
    ctx.fillStyle = gradVBib(ctx, 244, 300, [[0, 'rgba(0,0,0,0.5)'], [1, 'rgba(0,0,0,0)']]); ctx.fillRect(cx - 190, 244, 380, 56);

    // Escala de pedra de l'esquerra (puja cap al nord) amb la barana massissa
    ctx.save(); ctx.beginPath(); ctx.rect(0, 190, 322, 450); ctx.clip();
    ctx.fillStyle = '#6f624c'; ctx.fillRect(0, 190, 322, 450);
    for (let i = 0; i < 9; i++) {
        const y = 640 - (i + 1) * 50, f = 1 - i * 0.045;
        ctx.fillStyle = `rgb(${Math.round(207 * f)},${Math.round(195 * f)},${Math.round(164 * f)})`; ctx.fillRect(0, y, 322, 32);
        ctx.fillStyle = `rgb(${Math.round(141 * f)},${Math.round(127 * f)},${Math.round(102 * f)})`; ctx.fillRect(0, y + 32, 322, 18);
        ctx.fillStyle = 'rgba(255,248,224,0.35)'; ctx.fillRect(0, y, 322, 3);
        ctx.strokeStyle = 'rgba(25,16,8,0.6)'; ctx.lineWidth = 1.6; ctx.strokeRect(0, y, 322, 50);
        for (let k = 0; k < 3; k++) { ctx.fillStyle = 'rgba(20,12,6,0.18)'; ctx.fillRect(r() * 300, y + 8 + r() * 18, 14 + r() * 20, 3); }                        // picats de la pedra
    }
    ctx.fillStyle = gradVBib(ctx, 190, 290, [[0, 'rgba(10,6,3,0.9)'], [1, 'rgba(10,6,3,0)']]); ctx.fillRect(0, 190, 322, 100);                                // la volta fa ombra
    ctx.restore();
    ctx.fillStyle = '#a89c80'; ctx.fillRect(310, 196, 26, 444); ctx.strokeStyle = CASA_C; ctx.lineWidth = 2; ctx.strokeRect(310, 196, 26, 444);                // barana
    ctx.fillStyle = 'rgba(255,248,224,0.4)'; ctx.fillRect(312, 198, 4, 440);
    ctx.strokeStyle = 'rgba(25,16,8,0.5)'; ctx.lineWidth = 1.4; for (let y = 240; y < 640; y += 48) { ctx.beginPath(); ctx.moveTo(310, y); ctx.lineTo(336, y); ctx.stroke(); }
    ctx.fillStyle = '#c9bf9f'; ctx.fillRect(306, 190, 34, 10); ctx.strokeStyle = CASA_C; ctx.strokeRect(306, 190, 34, 10);

    // Mur de carreus de la dreta amb una porta oberta a la claror
    carreusErmita(ctx, 830, 190, 310, 450, 311, [122, 106, 84], 30);
    ctx.fillStyle = gradVBib(ctx, 190, 290, [[0, 'rgba(10,6,3,0.9)'], [1, 'rgba(10,6,3,0)']]); ctx.fillRect(830, 190, 310, 100);
    const pX = 930, pY = 372, pW = 100, pH = 230;
    const porta = () => { ctx.beginPath(); ctx.moveTo(pX, pY + pH); ctx.lineTo(pX, pY + pW / 2); ctx.arc(pX + pW / 2, pY + pW / 2, pW / 2, Math.PI, 0); ctx.lineTo(pX + pW, pY + pH); ctx.closePath(); };
    ctx.strokeStyle = '#cdbf9c'; ctx.lineWidth = 14; porta(); ctx.stroke();
    ctx.fillStyle = gradVBib(ctx, pY, pY + pH, [[0, '#fff6d8'], [1, '#e2c887']]); porta(); ctx.fill();
    ctx.strokeStyle = CASA_C; ctx.lineWidth = 2; porta(); ctx.stroke();
    ctx.fillStyle = '#6a5d48'; ctx.fillRect(830, 620, 310, 20); ctx.strokeRect(830, 620, 310, 20);
    ctx.fillStyle = gradHBib(ctx, 830, 880, [[0, 'rgba(0,0,0,0.5)'], [1, 'rgba(0,0,0,0)']]); ctx.fillRect(830, 190, 50, 450);

    // Terra de lloses grans i el seu llindar de paret
    ctx.save(); ctx.beginPath(); ctx.rect(336, 344, 494, 296); ctx.clip();
    ctx.fillStyle = '#a89d86'; ctx.fillRect(336, 344, 494, 296);
    for (let fila = 0, y = 358; y < 640; fila++, y += 60) {
        for (let x = 336 - (fila % 2) * 60; x < 830; x += 120) {
            const t = 0.9 + r() * 0.2;
            ctx.fillStyle = `rgb(${Math.round(176 * t)},${Math.round(165 * t)},${Math.round(138 * t)})`; ctx.fillRect(x + 1.5, y + 1.5, 117, 57);
            ctx.fillStyle = 'rgba(255,248,224,0.16)'; ctx.fillRect(x + 4, y + 3, 110, 2.6);
            ctx.strokeStyle = 'rgba(25,16,8,0.55)'; ctx.lineWidth = 1.5; ctx.strokeRect(x + 1.5, y + 1.5, 117, 57);
        }
    }
    const llum = ctx.createRadialGradient(cx, 470, 20, cx, 470, 230); llum.addColorStop(0, 'rgba(255,246,214,0.3)'); llum.addColorStop(1, 'rgba(255,246,214,0)');
    ctx.fillStyle = llum; ctx.fillRect(336, 344, 494, 296);
    ctx.fillStyle = gradVBib(ctx, 344, 430, [[0, 'rgba(10,6,3,0.55)'], [1, 'rgba(10,6,3,0)']]); ctx.fillRect(336, 344, 494, 86);
    ctx.fillStyle = gradHBib(ctx, 336, 400, [[0, 'rgba(10,6,3,0.4)'], [1, 'rgba(10,6,3,0)']]); ctx.fillRect(336, 344, 64, 296);
    ctx.fillStyle = gradHBib(ctx, 780, 830, [[0, 'rgba(10,6,3,0)'], [1, 'rgba(10,6,3,0.4)']]); ctx.fillRect(780, 344, 50, 296);
    ctx.fillStyle = 'rgba(255,240,190,0.18)'; ctx.beginPath(); ctx.moveTo(830, 560); ctx.lineTo(830, 640); ctx.lineTo(640, 640); ctx.lineTo(720, 560); ctx.closePath(); ctx.fill();   // claror de la porta
    ctx.restore();
    ctx.fillStyle = '#6a5d48'; ctx.fillRect(320, 330, 510, 14); ctx.strokeStyle = CASA_C; ctx.lineWidth = 1.6; ctx.strokeRect(320, 330, 510, 14);

    // El terra del mig es fon amb el de la sala de sota
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = gradVBib(ctx, 592, 640, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,1)']]); ctx.fillRect(336, 592, 494, 48);
    ctx.globalCompositeOperation = 'source-over';
}
