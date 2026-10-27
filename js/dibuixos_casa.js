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

// ---------- Llosa de la cripta amb les relíquies (drap de lli, calze, creu de plata, anell i breviari) o buida ----------
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
    // Drap de lli i les relíquies
    ctx.fillStyle = '#f0e8d4'; ctx.beginPath(); ctx.moveTo(14, h * 0.36); ctx.lineTo(w - 14, h * 0.36); ctx.lineTo(w - 8, h * 0.5); ctx.lineTo(8, h * 0.5); ctx.closePath(); ctx.fill(); ctx.strokeStyle = CASA_C; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.fillStyle = '#9a2a1a'; ctx.fillRect(w * 0.64, h * 0.1, 30, 24); ctx.strokeRect(w * 0.64, h * 0.1, 30, 24); ctx.fillStyle = '#e0b83a'; ctx.fillRect(w * 0.64 + 12, h * 0.1 + 6, 6, 12);   // breviari
    ctx.fillStyle = '#c0c8d0'; ctx.fillRect(w * 0.12 + 6, h * 0.06, 6, 30); ctx.fillRect(w * 0.12 - 4, h * 0.06 + 8, 26, 6); ctx.strokeRect(w * 0.12 + 6, h * 0.06, 6, 30); ctx.strokeRect(w * 0.12 - 4, h * 0.06 + 8, 26, 6);   // creu de plata
    ctx.fillStyle = '#e0b83a'; ctx.beginPath(); ctx.moveTo(w * 0.4, h * 0.08); ctx.lineTo(w * 0.52, h * 0.08); ctx.lineTo(w * 0.5, h * 0.2); ctx.lineTo(w * 0.46 + 4, h * 0.26); ctx.lineTo(w * 0.46 + 4, h * 0.31); ctx.lineTo(w * 0.52, h * 0.34); ctx.lineTo(w * 0.4, h * 0.34); ctx.lineTo(w * 0.46, h * 0.31); ctx.lineTo(w * 0.46, h * 0.26); ctx.lineTo(w * 0.42, h * 0.2); ctx.closePath(); ctx.fill(); ctx.stroke();   // calze
    ctx.fillStyle = '#c87a1a'; ctx.beginPath(); ctx.arc(w * 0.84, h * 0.32, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();                                                       // anell
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
// Cofre del tresor: gran, de fusta fosca amb ferros daurats, damunt una estora
function pintarCofreTresor(ctx, w, h) {
    ctx.lineJoin = 'round';
    ctx.fillStyle = 'rgba(0,0,0,0.32)'; ctx.beginPath(); ctx.ellipse(w / 2, h - 5, w * 0.5, 6, 0, 0, Math.PI * 2); ctx.fill();
    const gf = ctx.createLinearGradient(0, h * 0.35, 0, h - 8); gf.addColorStop(0, '#6a3e1a'); gf.addColorStop(1, '#3a200c');
    ctx.fillStyle = gf; ctx.fillRect(6, h * 0.38, w - 12, h * 0.55); ctx.strokeStyle = CASA_C; ctx.lineWidth = 2.4; ctx.strokeRect(6, h * 0.38, w - 12, h * 0.55);
    const gt = ctx.createLinearGradient(0, 4, 0, h * 0.4); gt.addColorStop(0, '#8a5a2a'); gt.addColorStop(1, '#5a3418');
    ctx.fillStyle = gt; ctx.beginPath(); ctx.moveTo(6, h * 0.4); ctx.quadraticCurveTo(6, 6, w / 2, 6); ctx.quadraticCurveTo(w - 6, 6, w - 6, h * 0.4); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#d4a93a'; [w * 0.2, w * 0.8 - 8].forEach(x => { ctx.fillRect(x, 8, 8, h * 0.85); ctx.strokeRect(x, 8, 8, h * 0.85); });
    ctx.fillRect(4, h * 0.36, w - 8, 8); ctx.strokeRect(4, h * 0.36, w - 8, 8);
    ctx.fillStyle = '#e8c040'; ctx.beginPath(); ctx.rect(w / 2 - 9, h * 0.34, 18, 22); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#2a1608'; ctx.beginPath(); ctx.arc(w / 2, h * 0.5, 3.4, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(w / 2 - 1.4, h * 0.5, 2.8, 8);
    ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.fillRect(10, h * 0.4, w - 20, 2);
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
