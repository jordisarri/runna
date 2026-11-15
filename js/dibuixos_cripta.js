/**
 * DIBUIXOS DE LA CRIPTA (Casa Gran): braser de ferro, munts de calaveres, àmfora, estora, espelmes i teranyines.
 * Mateix estil que la resta d'objectes de la Casa: contorn fosc, llums càlides i ombres suaus. (crea(...) a js/assets.js)
 */
const CRIPTA_CONTORN = '#1c120a';

function pintarBraserCripta(ctx, w, h) {
    const cx = w / 2;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.fillStyle = 'rgba(0,0,0,0.34)'; ctx.beginPath(); ctx.ellipse(cx, h - 6, 24, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = CRIPTA_CONTORN; ctx.lineWidth = 2.2;
    // trespeus de ferro
    ctx.fillStyle = '#3a3a42';
    [[-18, -8], [18, 8], [0, 0]].forEach(([dx]) => {
        ctx.beginPath(); ctx.moveTo(cx + dx * 0.4, h - 52); ctx.lineTo(cx + dx * 1.2, h - 8); ctx.lineTo(cx + dx * 1.2 + 5, h - 8); ctx.lineTo(cx + dx * 0.4 + 4, h - 52); ctx.closePath(); ctx.fill(); ctx.stroke();
    });
    ctx.fillStyle = '#4a4a54'; ctx.fillRect(cx - 17, h - 34, 34, 4); ctx.strokeRect(cx - 17, h - 34, 34, 4);        // anell de reforç
    // coll i cubeta
    const g = ctx.createLinearGradient(cx - 26, 0, cx + 26, 0); g.addColorStop(0, '#5a5a66'); g.addColorStop(0.5, '#3a3a44'); g.addColorStop(1, '#1e1e24');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(cx - 26, h - 62); ctx.quadraticCurveTo(cx - 24, h - 40, cx - 8, h - 38); ctx.lineTo(cx + 8, h - 38); ctx.quadraticCurveTo(cx + 24, h - 40, cx + 26, h - 62); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#6a6a76'; ctx.beginPath(); ctx.ellipse(cx, h - 62, 27, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();          // vora
    ctx.fillStyle = '#2a0e06'; ctx.beginPath(); ctx.ellipse(cx, h - 62, 22, 5.5, 0, 0, Math.PI * 2); ctx.fill();                       // l'interior fosc
    // brases i flama
    ctx.fillStyle = '#e0561a'; [[-12, 2], [-3, 4], [8, 1], [14, 3], [2, 0]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.ellipse(cx + dx, h - 62 + dy, 4.5, 2.4, 0, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = '#ff9a2a'; ctx.beginPath(); ctx.moveTo(cx - 16, h - 62); ctx.quadraticCurveTo(cx - 14, h - 84, cx - 6, h - 92); ctx.quadraticCurveTo(cx - 5, h - 76, cx, h - 70); ctx.quadraticCurveTo(cx + 6, h - 100, cx + 10, h - 104); ctx.quadraticCurveTo(cx + 16, h - 84, cx + 16, h - 62); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffd860'; ctx.beginPath(); ctx.moveTo(cx - 8, h - 62); ctx.quadraticCurveTo(cx - 6, h - 80, cx, h - 84); ctx.quadraticCurveTo(cx + 8, h - 76, cx + 8, h - 62); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff4c0'; ctx.beginPath(); ctx.ellipse(cx, h - 66, 3, 6, 0, 0, Math.PI * 2); ctx.fill();
}

function pintarCalaveresCripta(ctx, w, h) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.fillStyle = 'rgba(0,0,0,0.32)'; ctx.beginPath(); ctx.ellipse(w / 2, h - 6, w / 2 - 6, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = CRIPTA_CONTORN; ctx.lineWidth = 2;
    // ossos creuats a sota
    ctx.fillStyle = '#d8ccb0';
    [[-1, 1], [1, 1]].forEach(([s]) => {
        ctx.save(); ctx.translate(w / 2, h - 14); ctx.rotate(s * 0.25);
        ctx.beginPath(); ctx.roundRect(-34, -3.5, 68, 7, 3.5); ctx.fill(); ctx.stroke();
        [[-34, -4], [-34, 4], [34, -4], [34, 4]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
        ctx.restore();
    });
    // calaveres apilades (3 a baix, 2 al mig, 1 a dalt)
    const calavera = (x, y, r) => {
        const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.4, 1, x, y, r * 1.1); g.addColorStop(0, '#f2e8d0'); g.addColorStop(1, '#b8a888');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.roundRect(x - r * 0.55, y + r * 0.6, r * 1.1, r * 0.7, 2); ctx.fill(); ctx.stroke();                 // mandíbula
        ctx.fillStyle = '#1a1210'; [-0.38, 0.38].forEach(dx => { ctx.beginPath(); ctx.ellipse(x + dx * r, y - r * 0.05, r * 0.24, r * 0.3, 0, 0, Math.PI * 2); ctx.fill(); });
        ctx.beginPath(); ctx.moveTo(x, y + r * 0.2); ctx.lineTo(x - r * 0.1, y + r * 0.45); ctx.lineTo(x + r * 0.1, y + r * 0.45); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#6a5a40'; ctx.lineWidth = 1; [-0.25, 0, 0.25].forEach(dx => { ctx.beginPath(); ctx.moveTo(x + dx * r, y + r * 0.7); ctx.lineTo(x + dx * r, y + r * 1.2); ctx.stroke(); }); ctx.strokeStyle = CRIPTA_CONTORN; ctx.lineWidth = 2;
    };
    [[w / 2 - 22, h - 20], [w / 2 + 2, h - 18], [w / 2 + 26, h - 21], [w / 2 - 10, h - 36], [w / 2 + 14, h - 38], [w / 2 + 2, h - 52]].forEach(([x, y], i) => calavera(x, y, 11 - (i > 2 ? 0 : 0)));
}

function pintarAmforaCripta(ctx, w, h) {
    const cx = w / 2;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(cx, h - 5, 17, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = CRIPTA_CONTORN; ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#4a2a14'; ctx.lineWidth = 4;                                                                              // nanses
    [-1, 1].forEach(s => { ctx.beginPath(); ctx.moveTo(cx + s * 7, 18); ctx.bezierCurveTo(cx + s * 24, 14, cx + s * 24, 40, cx + s * 16, 44); ctx.stroke(); });
    ctx.strokeStyle = CRIPTA_CONTORN; ctx.lineWidth = 2.2;
    const g = ctx.createLinearGradient(cx - 18, 0, cx + 18, 0); g.addColorStop(0, '#c98a54'); g.addColorStop(0.5, '#a8683a'); g.addColorStop(1, '#6a3a1c');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(cx - 6, 10); ctx.lineTo(cx - 6, 22); ctx.bezierCurveTo(cx - 24, 30, cx - 22, 56, cx - 10, h - 8); ctx.lineTo(cx + 10, h - 8); ctx.bezierCurveTo(cx + 22, 56, cx + 24, 30, cx + 6, 22); ctx.lineTo(cx + 6, 10); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#a8683a'; ctx.beginPath(); ctx.ellipse(cx, 10, 9, 3.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#1a0e06'; ctx.beginPath(); ctx.ellipse(cx, 10, 6, 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#4a2410'; ctx.lineWidth = 2; [34, 40, 58].forEach(y => { ctx.beginPath(); ctx.moveTo(cx - 17 + (y > 50 ? 5 : 0), y); ctx.quadraticCurveTo(cx, y + 5, cx + 17 - (y > 50 ? 5 : 0), y); ctx.stroke(); });   // bandes pintades
    ctx.strokeStyle = 'rgba(255,230,190,0.5)'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(cx - 13, 38); ctx.quadraticCurveTo(cx - 17, 56, cx - 9, 72); ctx.stroke();      // reflex
}

function pintarEspelmaCripta(ctx, w, h) {
    const cx = w / 2;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = CRIPTA_CONTORN; ctx.lineWidth = 1.8;
    ctx.fillStyle = '#6a4e14'; ctx.beginPath(); ctx.ellipse(cx, h - 3, 9, 3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();           // platet
    ctx.fillStyle = '#e8dcb8'; ctx.beginPath(); ctx.roundRect(cx - 4, h - 20, 8, 17, 1.5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#c8b890'; ctx.fillRect(cx - 3, h - 12, 2, 8);                                                                  // regalims de cera
    ctx.fillStyle = '#ffa030'; ctx.beginPath(); ctx.ellipse(cx, h - 25, 3, 5.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff0a0'; ctx.beginPath(); ctx.ellipse(cx, h - 24, 1.3, 2.8, 0, 0, Math.PI * 2); ctx.fill();
}

function pintarEstoraCripta(ctx, w, h) {
    ctx.fillStyle = '#4a1418'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#5e1c20'; ctx.fillRect(6, 6, w - 12, h - 12);
    ctx.strokeStyle = '#b08a3a'; ctx.lineWidth = 2.5; ctx.strokeRect(4, 4, w - 8, h - 8);
    ctx.lineWidth = 1.2; ctx.strokeRect(10, 10, w - 20, h - 20);
    ctx.fillStyle = 'rgba(176,138,58,0.55)';                                                                                          // rombes daurats al llarg del mig
    for (let y = 40; y < h - 30; y += 46) { ctx.beginPath(); ctx.moveTo(w / 2, y - 14); ctx.lineTo(w / 2 + 12, y); ctx.lineTo(w / 2, y + 14); ctx.lineTo(w / 2 - 12, y); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = 'rgba(0,0,0,0.28)'; for (let i = 0; i < 90; i++) ctx.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 1.5);   // desgast
    ctx.fillStyle = '#d8c89a'; for (let x = 4; x < w - 2; x += 5) { ctx.fillRect(x, -2 + h - 4, 2, 6); }                                       // serrells a baix
}

function pintarTeranyinaCripta(ctx, w, h) {
    ctx.strokeStyle = 'rgba(230,230,240,0.55)'; ctx.lineWidth = 1; ctx.lineCap = 'round';
    const n = 6;
    for (let k = 0; k <= n; k++) { const a = k / n * Math.PI / 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * w, Math.sin(a) * h); ctx.stroke(); }
    for (let r = 0.22; r <= 1; r += 0.2) { ctx.beginPath(); for (let k = 0; k <= n; k++) { const a = k / n * Math.PI / 2, rr = r * (k % 2 ? 0.9 : 1); const x = Math.cos(a) * w * rr, y = Math.sin(a) * h * rr; if (k) ctx.quadraticCurveTo((x + px) / 2 * 0.86, (y + py) / 2 * 0.86, x, y); else ctx.moveTo(x, y); var px = x, py = y; } ctx.stroke(); }
}

// L'esllavissada de l'escalinata de la Casa Gran: un munt de blocs grossos de pedra de la mateixa escala i de la volta (de to càlid, diferents de les roques
// fosques dels camins), lloses trencades, un biga de fusta i una cua de graves que s'escampa pels graons de sota.
function pintarEsllavissadaEscalinata(ctx, w, h) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    let llavor = 29; const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
    const C = '#140a04';
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();         // res no surt de l'amplada de l'escala (la barana queda lliure)
    const bloc = (cx, cy, r, tons) => {
        const n = 7, pts = [];
        for (let k = 0; k < n; k++) { const a = k / n * Math.PI * 2 + rnd() * 0.3, rr = r * (0.72 + rnd() * 0.3); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.82]); }
        ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.beginPath(); ctx.ellipse(cx + r * 0.1, cy + r * 0.7, r * 0.95, r * 0.28, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath();
        const g = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r); g.addColorStop(0, tons[0]); g.addColorStop(0.55, tons[1]); g.addColorStop(1, tons[2]);
        ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = C; ctx.lineWidth = r < 14 ? 0.8 : 1.8; ctx.stroke();
        ctx.strokeStyle = 'rgba(255,240,210,0.35)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(pts[5][0], pts[5][1]); ctx.lineTo(pts[6][0], pts[6][1]); ctx.lineTo(pts[0][0], pts[0][1]); ctx.stroke();
        ctx.strokeStyle = 'rgba(30,20,10,0.5)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(cx - r * 0.2, cy - r * 0.1); ctx.lineTo(cx + r * 0.1, cy + r * 0.25); ctx.stroke();
    };
    const TONS = [['#b8a888', '#9e8a6c', '#6a5c46'], ['#a8987c', '#8e7c60', '#605340'], ['#d2c7a8', '#a8987c', '#6a5c46']];
    // files de blocs de dalt (fons) a baix (davant): omplen tota l'alçada, sense cap llençol de fons
    // disposició caòtica: pedres de mides molt diferents escampades a l'atzar (més denses al mig i a dalt), ordenades de dalt a baix perquè s'encavalquin
    const llista = [];
    for (let n = 0; n < 190; n++) {
        const x = 4 + rnd() * (w - 8), y = 30 + Math.pow(rnd(), 0.8) * (h - 50);
        const gran = rnd() < 0.18 ? 1 : 0;
        llista.push([x, y, gran ? 40 + rnd() * 26 : 9 + rnd() * 30, n]);
    }
    llista.sort((p, q) => p[1] - q[1]).forEach(([x, y, r, n]) => {
        ctx.save(); ctx.translate(x, y); ctx.rotate((rnd() - 0.5) * 1.6); ctx.scale(0.8 + rnd() * 0.7, 0.75 + rnd() * 0.4); bloc(0, 0, r, TONS[n % 3]); ctx.restore();
    });
    // llosa trencada i biga de fusta
    ctx.save(); ctx.translate(w * 0.38, h * 0.58); ctx.rotate(-0.7); ctx.fillStyle = '#b8a888'; ctx.strokeStyle = C; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.roundRect(-46, -9, 92, 18, 3); ctx.fill(); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(-44, -7, 88, 3); ctx.restore();
    ctx.save(); ctx.translate(w * 0.7, h * 0.3); ctx.rotate(1.1); ctx.fillStyle = '#6a4424'; ctx.strokeStyle = C; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(-52, -7, 104, 14, 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#9a6a3a'; ctx.fillRect(-50, -5, 100, 3); ctx.restore();
    // cua de pedres petites i graves a baix
    for (let j = 0; j < 60; j++) bloc(8 + rnd() * (w - 16), h - 40 + rnd() * 34, 5 + rnd() * 11, TONS[j % 3]);
    ctx.restore();
}

// Mur de pedra irregular (40 x 1000): filades de pedres tallades i ben encaixades de mides diferents (una o dues per filada, mai talls a mitges), amb morter fosc a les juntes,
// vores arrodonides, llum a dalt-esquerra i ombra a baix-dreta; el desplaçament de les juntes canvia a cada filada. Retallat net als costats.
function pintarMurPedraIrregular(ctx, w, h) {
    let llavor = 91; const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
    ctx.fillStyle = '#140a04'; ctx.fillRect(0, 0, w, h);                                             // morter
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
    const TONS = [['#b8a888', '#9e8a6c', '#6a5c46'], ['#a8987c', '#8e7c60', '#605340'], ['#b8a888', '#988468', '#6a5c46'], ['#d2c7a8', '#a8987c', '#6a5c46']];       // paleta única de pedra de la sala
    const pedra = (x0, y0, x1, y1, t) => {
        const m = 1.4, a = x0 + m, b = y0 + m, c = x1 - m, d = y1 - m, r = Math.min(3, (c - a) * 0.3, (d - b) * 0.3);
        const j = () => (rnd() - 0.5) * 2;
        ctx.beginPath();
        ctx.moveTo(a + r + j(), b + j() * 0.6); ctx.lineTo(c - r + j(), b + j() * 0.6); ctx.quadraticCurveTo(c + j(), b, c + j() * 0.6, b + r);
        ctx.lineTo(c + j() * 0.6, d - r); ctx.quadraticCurveTo(c, d + j(), c - r, d + j() * 0.6); ctx.lineTo(a + r, d + j() * 0.6); ctx.quadraticCurveTo(a + j(), d, a, d - r);
        ctx.lineTo(a + j() * 0.6, b + r); ctx.quadraticCurveTo(a, b, a + r, b); ctx.closePath();
        const g = ctx.createLinearGradient(a, b, c, d); g.addColorStop(0, t[0]); g.addColorStop(0.55, t[1]); g.addColorStop(1, t[2]);
        ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#140a04'; ctx.lineWidth = 1.6; ctx.lineJoin = 'round'; ctx.stroke();
        ctx.strokeStyle = 'rgba(255,238,205,0.34)'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(a + 2, d - 4); ctx.lineTo(a + 2, b + 3); ctx.lineTo(c - 4, b + 3); ctx.stroke();
        ctx.strokeStyle = 'rgba(20,12,6,0.32)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(c - 2, b + 4); ctx.lineTo(c - 2, d - 2); ctx.lineTo(a + 4, d - 2); ctx.stroke();
        for (let k = 0; k < 5; k++) { ctx.fillStyle = 'rgba(25,15,8,0.28)'; ctx.fillRect(a + 3 + rnd() * (c - a - 6), b + 3 + rnd() * (d - b - 6), 1 + rnd() * 2, 1 + rnd() * 1.5); }
        if (rnd() < 0.3) { ctx.strokeStyle = 'rgba(25,15,8,0.45)'; ctx.lineWidth = 1; ctx.beginPath(); const sx = a + (c - a) * (0.3 + rnd() * 0.4); ctx.moveTo(sx, b + 2); ctx.lineTo(sx + (rnd() - 0.5) * 8, b + (d - b) * 0.55); ctx.stroke(); }          // esquerda
    };
    let y = 0, f = 0;
    while (y < h) {
        const alt = 29 + ((rnd() * 7) | 0);
        const talls = rnd() < 0.55 ? [-4 + rnd() * 4, 14 + rnd() * 14, w + 4] : [-4, w + 4];          // una o dues pedres per filada
        if (talls.length === 3 && talls[1] < 12) talls[1] = 14;
        for (let k = 0; k < talls.length - 1; k++) pedra(talls[k], y, talls[k + 1], y + alt, TONS[(rnd() * TONS.length) | 0]);
        y += alt; f++;
    }
    ctx.restore();
}

// El mateix mur de pedra, en horitzontal (per a la paret de baix de la sala de l'Escalinata): w llarg x h gruix
function pintarMurPedraHoritzontal(ctx, w, h) {
    ctx.save(); ctx.translate(0, h); ctx.rotate(-Math.PI / 2);
    pintarMurPedraIrregular(ctx, h, w);
    ctx.restore();
}
