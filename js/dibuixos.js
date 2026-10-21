/**
 * DIBUIXOS PROVISIONALS (fase 1)
 * Marcadors dibuixats per codi per als personatges i elements nous.
 * Quan hi posis un PNG a assets/<nom>.png (vegeu CATALEG a assets.js) el substituirà sol.
 */

// Prepara el llenç i crida el dibuix amb les mides de disseny (w x h)
function lienc(canvas, w, h, dibuix) {
    canvas.width = w; canvas.height = Math.round(h);
    const ctx = canvas.getContext('2d');
    ctx.lineJoin = 'round';
    dibuix(ctx, w, h);
}

const CONTORN = '#120c08';

// Persona civil (no monjo). Opcions: roba, cabell, ample (1 = normal), alt, dona, ulleres, barba,
// bastoCoix, extra: 'angelets' | 'pala' | 'gorra' | 'rossa' | 'cua'
function dibuixarPersona(canvas, w, o) {
    const h = Math.round(w * 4 / 3);
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    const s = w / 96;
    ctx.scale(s, s);
    ctx.lineWidth = 3; ctx.strokeStyle = CONTORN; ctx.lineJoin = 'round';
    const alt = o.alt || 1, amp = o.ample || 1;
    const capY = 128 - 108 * alt;
    const meitat = 48, mig = 24 * amp;

    // Cabell llarg del darrere
    if (o.dona || o.extra === 'rossa') {
        ctx.fillStyle = o.cabell;
        ctx.beginPath(); ctx.roundRect(meitat - 20, capY - 2, 40, 46, 14); ctx.fill(); ctx.stroke();
    }
    if (o.isidre) dibuixarCosIsidre(ctx, meitat, capY);
    else {
    // Cos
    ctx.fillStyle = o.roba;
    ctx.beginPath();
    if (o.dona) {
        ctx.moveTo(meitat - 14 * amp, capY + 28); ctx.lineTo(meitat + 14 * amp, capY + 28);
        ctx.lineTo(meitat + mig + 10, 122); ctx.lineTo(meitat - mig - 10, 122);
    } else {
        ctx.moveTo(meitat - 16 * amp, capY + 28); ctx.lineTo(meitat + 16 * amp, capY + 28);
        ctx.lineTo(meitat + mig - 2, 90); ctx.lineTo(meitat + mig - 6, 122);
        ctx.lineTo(meitat - mig + 6, 122); ctx.lineTo(meitat - mig + 2, 90);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    if (o.extra === 'angelets') {
        ctx.fillStyle = '#ffffff';
        [[-8, 52], [8, 64], [-4, 76], [10, 86]].forEach(([dx, dy]) => {
            ctx.beginPath(); ctx.arc(meitat + dx, capY + dy, 3.2, 0, Math.PI * 2); ctx.fill();
        });
    }
    // Peus
    ctx.fillStyle = '#3b2a1e';
    ctx.fillRect(meitat - 20, 120, 14, 6); ctx.fillRect(meitat + 6, 120, 14, 6);
    }
    // Cap
    const cap = o.cap || 15;
    ctx.fillStyle = o.pell || '#e8b48a';
    ctx.beginPath(); ctx.arc(meitat, capY + 14, cap, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = o.cabell;
    if (!o.calb) { ctx.beginPath(); ctx.arc(meitat, capY + 10, cap, Math.PI * 1.05, Math.PI * 1.95); ctx.fill(); }
    if (o.extra === 'trenes') {
        ctx.lineWidth = 3;
        [-1, 1].forEach(sd => {
            ctx.strokeStyle = CONTORN; ctx.fillStyle = o.cabell;
            ctx.beginPath(); ctx.ellipse(meitat + sd * 19, capY + 34, 5, 20, sd * 0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#e07a9a'; ctx.fillRect(meitat + sd * 19 - 4, capY + 52, 8, 5);
        });
    }
    if (o.extra === 'gorra') { ctx.fillStyle = '#2d5a3a'; ctx.fillRect(meitat - 17, capY - 2, 34, 8); ctx.strokeRect(meitat - 17, capY - 2, 34, 8); }
    // Ulls
    ctx.fillStyle = CONTORN;
    ctx.fillRect(meitat - 7, capY + 14, 3, 4); ctx.fillRect(meitat + 4, capY + 14, 3, 4);
    if (o.ulleres) {
        ctx.lineWidth = 2;
        ctx.strokeRect(meitat - 11, capY + 11, 10, 9); ctx.strokeRect(meitat + 1, capY + 11, 10, 9);
        ctx.beginPath(); ctx.moveTo(meitat - 1, capY + 15); ctx.lineTo(meitat + 1, capY + 15); ctx.stroke();
    }
    if (o.barba) {
        ctx.fillStyle = o.barba;
        ctx.beginPath(); ctx.moveTo(meitat - 13, capY + 18); ctx.quadraticCurveTo(meitat, capY + 46, meitat + 13, capY + 18); ctx.fill();
    }
    if (o.bastoCoix) {
        ctx.strokeStyle = '#5b3a20'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(meitat + mig + 10, capY + 56); ctx.lineTo(meitat + mig + 14, 124); ctx.stroke();
    }
    if (o.extra === 'pala') {
        ctx.fillStyle = '#8a8a86'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(meitat + mig + 8, capY + 60, 10, 13, 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
}

// Cos de l'Isidre: camisa blanca de màniga curta, pantalons marrons, cama de fusta a la dreta i un bastó
function dibuixarCosIsidre(ctx, m, capY) {
    const PELL = '#e0a878', CAMISA = '#f4f1e8', PANTALO = '#6b4a2a', SABATA = '#3b2a1e', FUSTA = '#a8794a';
    ctx.lineWidth = 3; ctx.strokeStyle = CONTORN; ctx.lineJoin = 'round';
    const top = capY + 28, cintura = top + 34;
    // Bastó (darrere les mans)
    ctx.strokeStyle = CONTORN; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(m + 27, top + 2); ctx.lineTo(m + 27, 125); ctx.stroke();
    ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(m + 27, top + 2); ctx.lineTo(m + 27, 125); ctx.stroke();
    ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
    // Cama esquerra: pantaló marró i sabata
    ctx.fillStyle = PANTALO;
    ctx.fillRect(m - 14, cintura - 2, 12, 31); ctx.strokeRect(m - 14, cintura - 2, 12, 31);
    ctx.fillStyle = SABATA; ctx.fillRect(m - 17, 119, 17, 7); ctx.strokeRect(m - 17, 119, 17, 7);
    // Cama dreta: cuix de pantaló i cama de fusta
    ctx.fillStyle = PANTALO;
    ctx.fillRect(m + 2, cintura - 2, 12, 16); ctx.strokeRect(m + 2, cintura - 2, 12, 16);
    ctx.fillStyle = FUSTA;
    ctx.beginPath(); ctx.moveTo(m + 3, cintura + 14); ctx.lineTo(m + 13, cintura + 14); ctx.lineTo(m + 10, 124); ctx.lineTo(m + 6, 124); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#4a2e18'; ctx.fillRect(m + 2, cintura + 15, 12, 4); ctx.strokeRect(m + 2, cintura + 15, 12, 4);
    ctx.fillStyle = '#7a7a78'; ctx.fillRect(m + 5, 123, 6, 3);
    // Camisa blanca
    ctx.fillStyle = CAMISA;
    ctx.beginPath(); ctx.moveTo(m - 17, top); ctx.lineTo(m + 17, top); ctx.lineTo(m + 19, cintura); ctx.lineTo(m - 19, cintura); ctx.closePath(); ctx.fill(); ctx.stroke();
    // Cinturó
    ctx.fillStyle = '#3a2614'; ctx.fillRect(m - 19, cintura - 4, 38, 5); ctx.strokeRect(m - 19, cintura - 4, 38, 5);
    // Coll obert i botons
    ctx.fillStyle = PELL;
    ctx.beginPath(); ctx.moveTo(m - 5, top); ctx.lineTo(m + 5, top); ctx.lineTo(m, top + 9); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#c8c4b8';
    [14, 21, 28].forEach(dy => { ctx.beginPath(); ctx.arc(m, top + dy, 1.4, 0, Math.PI * 2); ctx.fill(); });
    // Màniga curta (blanca) i avantbraç nu
    [-1, 1].forEach(sd => {
        const x0 = sd < 0 ? m - 28 : m + 17;
        ctx.fillStyle = CAMISA; ctx.fillRect(x0, top + 1, 11, 14); ctx.strokeRect(x0, top + 1, 11, 14);
        ctx.fillStyle = PELL; ctx.fillRect(sd < 0 ? m - 26 : m + 19, top + 15, 8, sd < 0 ? 20 : 17); ctx.strokeRect(sd < 0 ? m - 26 : m + 19, top + 15, 8, sd < 0 ? 20 : 17);
    });
    // Mans (la dreta agafa el bastó)
    ctx.fillStyle = PELL;
    ctx.beginPath(); ctx.arc(m - 22, top + 37, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(m + 27, top + 34, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
}

// Fons bàsic de les escenes: ombra a terra per donar volum
function ombraTerra(ctx, x, y, rx, ry) {
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
}

function dibuixarRunes(c, w) {
    lienc(c, w, w * 0.78, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 8, W * 0.5, 11);
        const base = H - 8;
        let llavor = 7;
        const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
        const pedra = (poligon, color, carreus) => {
            ctx.fillStyle = color; ctx.strokeStyle = CONTORN; ctx.lineWidth = 4; ctx.lineJoin = 'round';
            ctx.beginPath(); poligon.forEach(([x, y], i) => i ? ctx.lineTo(W * x, H * y) : ctx.moveTo(W * x, H * y)); ctx.closePath(); ctx.fill(); ctx.stroke();
            if (!carreus) return;
            ctx.save(); ctx.clip();
            ctx.strokeStyle = 'rgba(60,44,26,0.32)'; ctx.lineWidth = 1.5;
            for (let r = 0, y = base; y > 0; r++, y -= H * 0.06) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
                for (let x = (r % 2) * W * 0.04; x < W; x += W * 0.08) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - H * 0.06); ctx.stroke(); }
            }
            ctx.restore();
        };
        // Mur central: la nau sense sostre, amb un gran arc de descàrrega i dues finestres
        pedra([[0.14, 1], [0.14, 0.3], [0.3, 0.2], [0.5, 0.07], [0.72, 0.16], [0.86, 0.12], [0.86, 1]], '#b99d6e', true);
        ctx.strokeStyle = 'rgba(60,44,26,0.7)'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(W * 0.24, H * 0.62); ctx.quadraticCurveTo(W * 0.5, H * 0.06, W * 0.76, H * 0.62); ctx.stroke();
        [[0.44, 0.3], [0.44, 0.5]].forEach(([fx, fy]) => {
            ctx.fillStyle = '#26303a'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
            ctx.fillRect(W * fx, H * fy, W * 0.07, H * 0.12); ctx.strokeRect(W * fx, H * fy, W * 0.07, H * 0.12);
            ctx.beginPath(); ctx.moveTo(W * (fx + 0.035), H * fy); ctx.lineTo(W * (fx + 0.035), H * (fy + 0.12)); ctx.moveTo(W * fx, H * (fy + 0.06)); ctx.lineTo(W * (fx + 0.07), H * (fy + 0.06)); ctx.stroke();
        });
        // Dos arcs oberts de les capelles laterals
        [[0.22, 0.4], [0.62, 0.78]].forEach(([a, b]) => {
            ctx.fillStyle = '#6f5a3c'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 4;
            ctx.beginPath(); ctx.moveTo(W * a, base); ctx.lineTo(W * a, H * 0.62); ctx.quadraticCurveTo(W * (a + b) / 2, H * 0.34, W * b, H * 0.62); ctx.lineTo(W * b, base); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#4c3d28';
            ctx.beginPath(); ctx.moveTo(W * (a + 0.025), base); ctx.lineTo(W * (a + 0.025), H * 0.66); ctx.quadraticCurveTo(W * (a + b) / 2, H * 0.42, W * (b - 0.025), H * 0.66); ctx.lineTo(W * (b - 0.025), base); ctx.closePath(); ctx.fill();
        });
        // Dos grans contraforts esmicolats, amb liquen
        pedra([[0.0, 1], [0.0, 0.34], [0.05, 0.3], [0.07, 0.38], [0.14, 0.34], [0.16, 0.5], [0.16, 1]], '#a58b60', true);
        pedra([[0.84, 1], [0.84, 0.22], [0.9, 0.16], [0.93, 0.24], [1.0, 0.2], [1.0, 1]], '#a58b60', true);
        // Heura al contrafort dret
        for (let i = 0; i < 40; i++) {
            ctx.fillStyle = i % 3 ? '#3f6a2a' : '#5d8f3f';
            ctx.beginPath(); ctx.ellipse(W * (0.86 + rnd() * 0.1), H * (0.3 + rnd() * 0.6), W * 0.012, H * 0.016, rnd() * 3, 0, Math.PI * 2); ctx.fill();
        }
        // Liquen clar i blocs caiguts
        for (let i = 0; i < 30; i++) {
            ctx.fillStyle = i % 2 ? 'rgba(200,205,160,0.4)' : 'rgba(235,230,210,0.35)';
            ctx.beginPath(); ctx.ellipse(W * rnd(), H * (0.3 + rnd() * 0.65), W * 0.012 + rnd() * 6, 3 + rnd() * 4, rnd() * 3, 0, Math.PI * 2); ctx.fill();
        }
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
        [[0.1, 0.96, 0.07], [0.8, 0.97, 0.06], [0.46, 0.98, 0.05], [0.3, 0.99, 0.04], [0.92, 0.99, 0.05]].forEach(([bx, by, bw]) => {
            ctx.fillStyle = '#9d8458'; ctx.fillRect(W * bx, H * by - H * 0.045, W * bw, H * 0.045); ctx.strokeRect(W * bx, H * by - H * 0.045, W * bw, H * 0.045);
        });
    });
}

function dibuixarColumna(c, w) {
    lienc(c, w, w * 2.4, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 6, W * 0.5, 7);
        ctx.lineWidth = 3; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#9a9488'; ctx.fillRect(4, H - 24, W - 8, 18); ctx.strokeRect(4, H - 24, W - 8, 18);
        ctx.fillStyle = '#b8b2a4'; ctx.fillRect(12, 18, W - 24, H - 44); ctx.strokeRect(12, 18, W - 24, H - 44);
        ctx.fillStyle = '#9a9488'; ctx.fillRect(4, 4, W - 8, 16); ctx.strokeRect(4, 4, W - 8, 16);
        // Símbol gravat
        ctx.strokeStyle = '#6a6458'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(W / 2, H * 0.4, 7, 0, Math.PI * 2); ctx.moveTo(W / 2, H * 0.4 + 7); ctx.lineTo(W / 2, H * 0.4 + 24); ctx.stroke();
    });
}

function dibuixarRoure(c, w) {
    lienc(c, w, w * 1.1, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 8, W * 0.34, 12);
        ctx.lineWidth = 4; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#5b3a20';
        ctx.beginPath(); ctx.moveTo(W * 0.42, H - 10); ctx.lineTo(W * 0.44, H * 0.45); ctx.lineTo(W * 0.56, H * 0.45); ctx.lineTo(W * 0.6, H - 10); ctx.closePath(); ctx.fill(); ctx.stroke();
        [['#3f7a35', 0.5, 0.3, 0.32], ['#468a3c', 0.28, 0.4, 0.24], ['#468a3c', 0.72, 0.4, 0.24], ['#4f9a44', 0.5, 0.18, 0.24]].forEach(([col, x, y, r]) => {
            ctx.fillStyle = col; ctx.beginPath(); ctx.arc(W * x, H * y, W * r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        });
    });
}

function dibuixarTiller(c, w) {
    lienc(c, w, w * 1.1, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 8, W * 0.36, 14);
        ctx.lineWidth = 4; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#6b4a2a';
        ctx.beginPath(); ctx.moveTo(W * 0.36, H - 8); ctx.quadraticCurveTo(W * 0.42, H * 0.5, W * 0.44, H * 0.4);
        ctx.lineTo(W * 0.58, H * 0.4); ctx.quadraticCurveTo(W * 0.6, H * 0.5, W * 0.66, H - 8); ctx.closePath(); ctx.fill(); ctx.stroke();
        [['#6fa046', 0.5, 0.26, 0.38], ['#7db553', 0.25, 0.4, 0.22], ['#7db553', 0.75, 0.4, 0.22], ['#8bc45e', 0.5, 0.15, 0.24]].forEach(([col, x, y, r]) => {
            ctx.fillStyle = col; ctx.beginPath(); ctx.arc(W * x, H * y, W * r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        });
        // Rostre antic a l'escorça
        ctx.fillStyle = CONTORN;
        ctx.fillRect(W * 0.46, H * 0.55, 8, 12); ctx.fillRect(W * 0.54, H * 0.55, 8, 12);
        ctx.fillRect(W * 0.48, H * 0.7, 14, 5);
    });
}

function dibuixarAltar(c, w) {
    lienc(c, w, w * 0.65, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 6, W * 0.5, 8);
        ctx.lineWidth = 3; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#b8b2a4'; ctx.fillRect(6, H * 0.35, W - 12, H * 0.6); ctx.strokeRect(6, H * 0.35, W - 12, H * 0.6);
        ctx.fillStyle = '#e8e0d0'; ctx.fillRect(4, H * 0.3, W - 8, 12); ctx.strokeRect(4, H * 0.3, W - 8, 12);
        // Creu
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(W / 2 - 3, H * 0.02, 6, H * 0.3); ctx.fillRect(W / 2 - 12, H * 0.1, 24, 6);
    });
}

function dibuixarTaulaPedra(c, w) {
    lienc(c, w, w * 1.4, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 6, W * 0.45, 7);
        ctx.lineWidth = 4; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#8f897c';
        ctx.beginPath(); ctx.moveTo(8, H - 8); ctx.lineTo(8, 24); ctx.quadraticCurveTo(W / 2, -8, W - 8, 24); ctx.lineTo(W - 8, H - 8); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#4a463e'; ctx.lineWidth = 2.5;
        for (let i = 0; i < 6; i++) {
            const y = 44 + i * ((H - 70) / 6);
            for (let x = 22; x < W - 28; x += 16) {
                ctx.beginPath(); ctx.arc(x + 4, y, 4, 0, Math.PI * 2); ctx.moveTo(x + 4, y + 4); ctx.lineTo(x + 4, y + 11); ctx.stroke();
            }
        }
    });
}

function dibuixarFontSJ(c, w) {
    lienc(c, w, w * 0.85, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 6, W * 0.45, 9);
        ctx.lineWidth = 3.5; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#a8a092'; ctx.beginPath(); ctx.ellipse(W / 2, H * 0.72, W * 0.44, H * 0.22, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#4a5a58'; ctx.beginPath(); ctx.ellipse(W / 2, H * 0.68, W * 0.34, H * 0.15, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#b8b2a4'; ctx.fillRect(W / 2 - 10, H * 0.15, 20, H * 0.5); ctx.strokeRect(W / 2 - 10, H * 0.15, 20, H * 0.5);
        ctx.fillRect(W / 2 - 18, H * 0.08, 36, 14); ctx.strokeRect(W / 2 - 18, H * 0.08, 36, 14);
    });
}

function dibuixarCarruatge(c, w) {
    lienc(c, w, w * 0.7, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 6, W * 0.46, 9);
        ctx.lineWidth = 3.5; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#2f6b3d'; ctx.beginPath(); ctx.roundRect(W * 0.1, H * 0.15, W * 0.8, H * 0.55, 12); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#1f4a2a'; ctx.fillRect(W * 0.1, H * 0.12, W * 0.8, 10); ctx.strokeRect(W * 0.1, H * 0.12, W * 0.8, 10);
        ctx.fillStyle = '#e8d9a0'; ctx.fillRect(W * 0.2, H * 0.28, W * 0.18, H * 0.2); ctx.strokeRect(W * 0.2, H * 0.28, W * 0.18, H * 0.2);
        ctx.fillRect(W * 0.58, H * 0.28, W * 0.18, H * 0.2); ctx.strokeRect(W * 0.58, H * 0.28, W * 0.18, H * 0.2);
        [0.25, 0.75].forEach(x => {
            ctx.fillStyle = '#5b3a20'; ctx.beginPath(); ctx.arc(W * x, H * 0.78, H * 0.17, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#c9b48a'; ctx.beginPath(); ctx.arc(W * x, H * 0.78, H * 0.05, 0, Math.PI * 2); ctx.fill();
        });
    });
}

function dibuixarCarroSansa(c, w) {
    lienc(c, w, w * 0.6, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 6, W * 0.46, 8);
        ctx.lineWidth = 3.5; ctx.strokeStyle = CONTORN;
        // Cavall
        ctx.fillStyle = '#8a5a34'; ctx.beginPath(); ctx.ellipse(W * 0.2, H * 0.55, W * 0.14, H * 0.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillRect(W * 0.08, H * 0.28, 12, 22); ctx.strokeRect(W * 0.08, H * 0.28, 12, 22);
        ctx.fillRect(W * 0.12, H * 0.7, 6, 18); ctx.fillRect(W * 0.26, H * 0.7, 6, 18);
        // Carro ple de verdura
        ctx.fillStyle = '#8b5a30'; ctx.fillRect(W * 0.42, H * 0.4, W * 0.5, H * 0.3); ctx.strokeRect(W * 0.42, H * 0.4, W * 0.5, H * 0.3);
        ['#c0392b', '#e0a020', '#4f9a44', '#8a5ac0', '#d8c8a0'].forEach((col, i) => {
            ctx.fillStyle = col; ctx.beginPath(); ctx.arc(W * (0.48 + i * 0.09), H * 0.38, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        });
        [0.55, 0.82].forEach(x => {
            ctx.fillStyle = '#5b3a20'; ctx.beginPath(); ctx.arc(W * x, H * 0.76, H * 0.14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        });
    });
}

function dibuixarPergola(c, w) {
    lienc(c, w, w * 0.8, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 6, W * 0.46, 8);
        ctx.lineWidth = 4; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#7a5030';
        ctx.fillRect(8, 24, 14, H - 30); ctx.strokeRect(8, 24, 14, H - 30);
        ctx.fillRect(W - 22, 24, 14, H - 30); ctx.strokeRect(W - 22, 24, 14, H - 30);
        ctx.fillRect(0, 8, W, 18); ctx.strokeRect(0, 8, W, 18);
        // Enfiladisses i flors
        for (let x = 6; x < W; x += 12) {
            ctx.fillStyle = '#4f9a44'; ctx.beginPath(); ctx.arc(x, 24 + (x % 3) * 4, 8, 0, Math.PI * 2); ctx.fill();
            if (x % 24 === 6) { ctx.fillStyle = ['#e06a8a', '#f0d040', '#c070e0'][(x / 12 | 0) % 3]; ctx.beginPath(); ctx.arc(x, 34, 4, 0, Math.PI * 2); ctx.fill(); }
        }
    });
}

function dibuixarFlors(c, w) {
    lienc(c, w, w * 0.7, (ctx, W, H) => {
        ctx.lineWidth = 2; ctx.strokeStyle = CONTORN;
        ['#e06a8a', '#f0d040', '#c070e0', '#ff9a40', '#ffffff'].forEach((col, i) => {
            const x = 10 + i * (W - 20) / 4, y = H * (0.45 + (i % 2) * 0.2);
            ctx.strokeStyle = '#2f6a2a'; ctx.beginPath(); ctx.moveTo(x, H - 4); ctx.lineTo(x, y); ctx.stroke();
            ctx.strokeStyle = CONTORN; ctx.fillStyle = col;
            ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        });
    });
}

function dibuixarTaulaPP(c, w) {
    const L = w / RES, H = Math.round(L * 0.55);
    lienc(c, w, H * RES, ctx => { ctx.scale(RES, RES); pintarTaulaPP(ctx, L, H); });
}

function dibuixarAlzinaBuida(c, w) {
    lienc(c, w, w * 1.2, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 8, W * 0.4, 10);
        ctx.lineWidth = 4; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#4a3220';
        ctx.beginPath(); ctx.moveTo(W * 0.28, H - 8); ctx.lineTo(W * 0.34, H * 0.4); ctx.lineTo(W * 0.66, H * 0.4); ctx.lineTo(W * 0.74, H - 8); ctx.closePath(); ctx.fill(); ctx.stroke();
        [['#2f5a2a', 0.5, 0.25, 0.4], ['#356a30', 0.3, 0.35, 0.25], ['#356a30', 0.7, 0.35, 0.25]].forEach(([col, x, y, r]) => {
            ctx.fillStyle = col; ctx.beginPath(); ctx.arc(W * x, H * y, W * r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        });
        // Forat que brilla
        const g = ctx.createRadialGradient(W / 2, H * 0.66, 2, W / 2, H * 0.66, W * 0.18);
        g.addColorStop(0, '#d8ffd0'); g.addColorStop(1, '#2a4a30');
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(W / 2, H * 0.66, W * 0.12, H * 0.16, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });
}

function dibuixarLlosa(c, w) {
    lienc(c, w, w * 0.6, (ctx, W, H) => {
        ctx.lineWidth = 3; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#8a8478'; ctx.beginPath(); ctx.ellipse(W / 2, H / 2, W * 0.44, H * 0.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#4a463e'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(W * 0.3, H * 0.5); ctx.lineTo(W * 0.7, H * 0.5); ctx.moveTo(W * 0.5, H * 0.25); ctx.lineTo(W * 0.5, H * 0.75); ctx.stroke();
    });
}

// ---------------- ENEMICS ----------------
function dibuixarEscolopendra(c, w) {
    lienc(c, w, w * 0.4, (ctx, W, H) => {
        ctx.lineWidth = 2; ctx.strokeStyle = CONTORN;
        const n = 9;
        for (let i = 0; i < n; i++) {
            const x = W * 0.1 + i * (W * 0.78 / n), y = H * 0.5 + Math.sin(i * 0.9) * 3;
            // potes
            ctx.strokeStyle = '#6a2a14'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(x, y - 12); ctx.lineTo(x - 2, y + 12); ctx.stroke();
            ctx.strokeStyle = CONTORN; ctx.lineWidth = 2;
            ctx.fillStyle = i % 2 ? '#a8481e' : '#c25a28';
            ctx.beginPath(); ctx.ellipse(x, y, W * 0.055, H * 0.3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        }
        // cap i antenes (a la dreta)
        ctx.fillStyle = '#e0a020';
        ctx.beginPath(); ctx.ellipse(W * 0.92, H * 0.5, W * 0.07, H * 0.32, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(W * 0.97, H * 0.4); ctx.lineTo(W, H * 0.15); ctx.moveTo(W * 0.97, H * 0.6); ctx.lineTo(W, H * 0.85); ctx.stroke();
        ctx.fillStyle = '#d8ffd0'; ctx.fillRect(W * 0.94, H * 0.42, 3, 3);
    });
}

function dibuixarGripau(c, w) {
    lienc(c, w, w * 0.8, (ctx, W, H) => {
        ctx.lineWidth = 3; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#4a6a4a';
        ctx.beginPath(); ctx.ellipse(W * 0.5, H * 0.62, W * 0.4, H * 0.32, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // potes del darrere
        ctx.beginPath(); ctx.ellipse(W * 0.14, H * 0.8, W * 0.12, H * 0.14, -0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(W * 0.86, H * 0.8, W * 0.12, H * 0.14, 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // berrugues liles
        ctx.fillStyle = '#7a4a9a';
        [[0.35, 0.5], [0.55, 0.45], [0.65, 0.62], [0.42, 0.68]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(W * x, H * y, 5, 0, Math.PI * 2); ctx.fill(); });
        // ulls grocs brillants
        [0.3, 0.7].forEach(x => {
            ctx.fillStyle = '#e8e060'; ctx.beginPath(); ctx.arc(W * x, H * 0.3, W * 0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = CONTORN; ctx.fillRect(W * x - 2, H * 0.24, 4, 12);
        });
        // boca
        ctx.beginPath(); ctx.moveTo(W * 0.3, H * 0.6); ctx.quadraticCurveTo(W * 0.5, H * 0.72, W * 0.7, H * 0.6); ctx.stroke();
    });
}

function dibuixarPuntSegell(c, w) {
    // petit raig d'espores/guspira per als cops
    lienc(c, w, w, (ctx, W, H) => {
        const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2);
        g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    });
}

function dibuixarEspantaocell(c, w) {
    lienc(c, w, w * 1.5, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 6, W * 0.3, 7);
        ctx.lineWidth = 3; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#6b4a2a'; ctx.fillRect(W / 2 - 4, H * 0.3, 8, H * 0.66); ctx.strokeRect(W / 2 - 4, H * 0.3, 8, H * 0.66);
        ctx.fillRect(W * 0.08, H * 0.42, W * 0.84, 8); ctx.strokeRect(W * 0.08, H * 0.42, W * 0.84, 8);
        // palla
        ctx.strokeStyle = '#d8b84a'; ctx.lineWidth = 3;
        [[0.06, 0.5], [0.94, 0.5]].forEach(([x, y]) => { for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(W * x, H * 0.44); ctx.lineTo(W * x + i * 4, H * y + 12); ctx.stroke(); } });
        // cos de sac
        ctx.strokeStyle = CONTORN; ctx.fillStyle = '#b8955a';
        ctx.beginPath(); ctx.roundRect(W * 0.28, H * 0.44, W * 0.44, H * 0.28, 8); ctx.fill(); ctx.stroke();
        // cap
        ctx.fillStyle = '#d8b878'; ctx.beginPath(); ctx.arc(W / 2, H * 0.3, W * 0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = CONTORN; ctx.fillRect(W * 0.4, H * 0.27, 5, 5); ctx.fillRect(W * 0.55, H * 0.27, 5, 5);
        ctx.beginPath(); ctx.moveTo(W * 0.4, H * 0.35); ctx.lineTo(W * 0.6, H * 0.35); ctx.stroke();
        // barret
        ctx.fillStyle = '#4a3a2a'; ctx.fillRect(W * 0.22, H * 0.15, W * 0.56, 7); ctx.strokeRect(W * 0.22, H * 0.15, W * 0.56, 7);
        ctx.fillRect(W * 0.33, H * 0.03, W * 0.34, H * 0.13); ctx.strokeRect(W * 0.33, H * 0.03, W * 0.34, H * 0.13);
    });
}

function dibuixarBranca(c, w) {
    lienc(c, w, w * 0.4, (ctx, W, H) => {
        ctx.lineWidth = 3; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#7a5230';
        ctx.beginPath(); ctx.moveTo(2, H * 0.7); ctx.lineTo(W * 0.9, H * 0.3); ctx.lineTo(W * 0.92, H * 0.45); ctx.lineTo(6, H * 0.9); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#7db553';
        [[0.7, 0.2], [0.82, 0.15], [0.55, 0.3]].forEach(([x, y]) => { ctx.beginPath(); ctx.ellipse(W * x, H * y, 8, 5, 0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    });
}

function dibuixarPergami(c, w) {
    const L = w / RES, H = Math.round(L * 0.64);
    lienc(c, w, H * RES, ctx => { ctx.scale(RES, RES); pintarPergami(ctx, L, H); });
}

// L'ombra del monjo: figura corbada amb les mans unides, com si pregués
function dibuixarOmbraMonjo(c, w) {
    lienc(c, w, w * 1.35, (ctx, W, H) => {
        ctx.shadowColor = 'rgba(150,130,255,0.9)'; ctx.shadowBlur = 22;
        ctx.fillStyle = 'rgba(14,10,34,0.92)';
        // túnica corbada
        ctx.beginPath();
        ctx.moveTo(W * 0.38, H * 0.2);
        ctx.quadraticCurveTo(W * 0.22, H * 0.34, W * 0.3, H * 0.62);
        ctx.lineTo(W * 0.2, H * 0.97); ctx.lineTo(W * 0.8, H * 0.97); ctx.lineTo(W * 0.68, H * 0.6);
        ctx.quadraticCurveTo(W * 0.7, H * 0.34, W * 0.56, H * 0.22);
        ctx.closePath(); ctx.fill();
        // caputxa abaixada
        ctx.beginPath(); ctx.arc(W * 0.5, H * 0.17, W * 0.14, 0, Math.PI * 2); ctx.fill();
        // mans unides
        ctx.beginPath(); ctx.ellipse(W * 0.6, H * 0.44, W * 0.07, W * 0.05, 0.6, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(190,175,255,0.35)';
        ctx.beginPath(); ctx.arc(W * 0.55, H * 0.45, 3, 0, Math.PI * 2); ctx.fill();
    });
}

function dibuixarOvella(c, w, boira) {
    lienc(c, w, w * 0.75, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 6, W * 0.4, 8);
        ctx.lineWidth = 3; ctx.strokeStyle = CONTORN;
        // potes
        ctx.fillStyle = '#3a2a2a';
        [0.28, 0.42, 0.6, 0.74].forEach(x => ctx.fillRect(W * x, H * 0.7, 7, H * 0.26));
        // llana
        ctx.fillStyle = boira ? '#cdbfe6' : '#f2eee4';
        [[0.5, 0.5, 0.34], [0.32, 0.5, 0.2], [0.68, 0.5, 0.2], [0.5, 0.36, 0.22], [0.4, 0.62, 0.2], [0.62, 0.62, 0.2]].forEach(([x, y, r]) => {
            ctx.beginPath(); ctx.arc(W * x, H * y, W * r * 0.7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        });
        // cap
        ctx.fillStyle = '#3a2a2a'; ctx.beginPath(); ctx.ellipse(W * 0.86, H * 0.5, W * 0.1, H * 0.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = boira ? '#e0a0ff' : '#ffffff'; ctx.fillRect(W * 0.88, H * 0.42, 5, 5);
        if (boira) {
            const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.55);
            g.addColorStop(0, 'rgba(120,60,180,0)'); g.addColorStop(1, 'rgba(120,60,180,0.4)');
            ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(W / 2, H * 0.55, W * 0.5, H * 0.45, 0, 0, Math.PI * 2); ctx.fill();
        }
    });
}

function dibuixarRoca(c, w) {
    lienc(c, w, w * 0.7, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 6, W * 0.46, 8);
        ctx.lineWidth = 3.5; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#8a867c';
        ctx.beginPath(); ctx.moveTo(6, H - 6); ctx.lineTo(W * 0.12, H * 0.4); ctx.lineTo(W * 0.4, H * 0.1); ctx.lineTo(W * 0.78, H * 0.2); ctx.lineTo(W - 6, H - 6); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#a09c90'; ctx.beginPath(); ctx.moveTo(W * 0.3, H * 0.4); ctx.lineTo(W * 0.42, H * 0.18); ctx.lineTo(W * 0.62, H * 0.28); ctx.lineTo(W * 0.5, H * 0.5); ctx.closePath(); ctx.fill();
    });
}

// El Germà Andreu convertit en Pastor de Boira: hàbit fosc, caiada i ulls lila
function afegirCaiada(c, w) {
    const ctx = c.getContext('2d');
    ctx.save();
    ctx.scale(w / 96, w / 96);
    ctx.strokeStyle = '#6b4a2a'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(84, 124); ctx.lineTo(84, 34); ctx.arc(76, 34, 8, 0, Math.PI, true); ctx.stroke();
    ctx.fillStyle = '#e0a0ff';
    ctx.fillRect(41, 38, 4, 5); ctx.fillRect(51, 38, 4, 5);
    ctx.restore();
}

function dibuixarMasia(c, w) {
    dibuixarEdifici(c, w, w * 0.55, '#e0cfa8', '#8a3a2a', 'Mas de la Cirosa');
}

function dibuixarFoc(c, w) {
    lienc(c, w, w * 0.8, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 8, W * 0.4, 8);
        ctx.lineWidth = 3; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#6b4a2a';
        ctx.save(); ctx.translate(W / 2, H * 0.78); ctx.rotate(0.35); ctx.fillRect(-W * 0.3, -5, W * 0.6, 10); ctx.strokeRect(-W * 0.3, -5, W * 0.6, 10); ctx.restore();
        ctx.save(); ctx.translate(W / 2, H * 0.78); ctx.rotate(-0.35); ctx.fillRect(-W * 0.3, -5, W * 0.6, 10); ctx.strokeRect(-W * 0.3, -5, W * 0.6, 10); ctx.restore();
        const g = ctx.createRadialGradient(W / 2, H * 0.55, 2, W / 2, H * 0.55, W * 0.32);
        g.addColorStop(0, '#fff2a0'); g.addColorStop(0.5, '#ff9a30'); g.addColorStop(1, 'rgba(255,60,0,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(W / 2, H * 0.55, W * 0.28, H * 0.42, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffd040'; ctx.beginPath(); ctx.moveTo(W * 0.42, H * 0.75); ctx.quadraticCurveTo(W * 0.5, H * 0.1, W * 0.6, H * 0.75); ctx.closePath(); ctx.fill();
    });
}

function dibuixarEspelma(c, w) {
    lienc(c, w, w * 2, (ctx, W, H) => {
        ctx.lineWidth = 2; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#f2e6c8'; ctx.fillRect(W * 0.3, H * 0.4, W * 0.4, H * 0.55); ctx.strokeRect(W * 0.3, H * 0.4, W * 0.4, H * 0.55);
        const g = ctx.createRadialGradient(W / 2, H * 0.25, 1, W / 2, H * 0.25, W * 0.5);
        g.addColorStop(0, '#fff6b0'); g.addColorStop(0.5, 'rgba(255,170,40,0.8)'); g.addColorStop(1, 'rgba(255,100,0,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(W / 2, H * 0.25, W * 0.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffd040'; ctx.beginPath(); ctx.ellipse(W / 2, H * 0.28, W * 0.1, H * 0.12, 0, 0, Math.PI * 2); ctx.fill();
    });
}

// Taula llarga del sopar: tovallola, plats, pa, vi i flors
function dibuixarTaulaSopar(c, w) {
    lienc(c, w, w * 0.32, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 4, W * 0.48, 8);
        ctx.lineWidth = 3; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#5b3a20'; ctx.fillRect(10, H * 0.55, 10, H * 0.4); ctx.fillRect(W - 20, H * 0.55, 10, H * 0.4);
        ctx.fillStyle = '#f4eadb'; ctx.fillRect(0, H * 0.2, W, H * 0.45); ctx.strokeRect(0, H * 0.2, W, H * 0.45);
        // plats, pa i copes
        for (let x = 30; x < W - 20; x += 46) {
            ctx.fillStyle = '#d8d0c0'; ctx.beginPath(); ctx.ellipse(x, H * 0.42, 14, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = ['#c07a30', '#8a2a2a', '#4f9a44'][(x / 46 | 0) % 3];
            ctx.beginPath(); ctx.arc(x, H * 0.38, 4, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = '#e06a8a'; for (let x = 70; x < W - 40; x += 120) { ctx.beginPath(); ctx.arc(x, H * 0.28, 5, 0, Math.PI * 2); ctx.fill(); }
    });
}

function dibuixarBolet(c, w) {
    lienc(c, w, w * 0.9, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 6, W * 0.36, 7);
        ctx.lineWidth = 3; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#d8c8a0'; ctx.fillRect(W * 0.38, H * 0.5, W * 0.24, H * 0.42); ctx.strokeRect(W * 0.38, H * 0.5, W * 0.24, H * 0.42);
        ctx.fillStyle = '#7a3a9a';
        ctx.beginPath(); ctx.ellipse(W / 2, H * 0.42, W * 0.46, H * 0.34, 0, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#b8e060';
        [[0.3, 0.3], [0.5, 0.2], [0.7, 0.3], [0.4, 0.36], [0.62, 0.38]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(W * x, H * y, 4, 0, Math.PI * 2); ctx.fill(); });
        ctx.fillStyle = CONTORN; ctx.fillRect(W * 0.43, H * 0.64, 4, 4); ctx.fillRect(W * 0.55, H * 0.64, 4, 4);
    });
}

function dibuixarRovello(c, w) {
    lienc(c, w, w * 0.7, (ctx, W, H) => {
        ctx.lineWidth = 2.5; ctx.strokeStyle = CONTORN;
        [[0.3, 0.95], [0.68, 1.0]].forEach(([x, s]) => {
            ctx.fillStyle = '#e8d8b0'; ctx.fillRect(W * x - 4, H * 0.5, 8, H * 0.4);
            const g = ctx.createRadialGradient(W * x, H * 0.4, 1, W * x, H * 0.4, W * 0.24);
            g.addColorStop(0, '#ffcf70'); g.addColorStop(1, '#d8782a');
            ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(W * x, H * 0.45, W * 0.22 * s, H * 0.28 * s, 0, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
        });
    });
}

function dibuixarLlac(c, w) {
    lienc(c, w, w * 0.8, (ctx, W, H) => {
        ctx.lineWidth = 2.5; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#e07a9a';
        ctx.beginPath(); ctx.moveTo(W / 2, H / 2); ctx.quadraticCurveTo(W * 0.1, H * 0.1, W * 0.1, H * 0.5); ctx.quadraticCurveTo(W * 0.1, H * 0.9, W / 2, H / 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(W / 2, H / 2); ctx.quadraticCurveTo(W * 0.9, H * 0.1, W * 0.9, H * 0.5); ctx.quadraticCurveTo(W * 0.9, H * 0.9, W / 2, H / 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#c0507a'; ctx.beginPath(); ctx.arc(W / 2, H / 2, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });
}

function dibuixarDiposit(c, w) {
    lienc(c, w, w * 0.8, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 8, W * 0.48, 12);
        ctx.lineWidth = 4; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#9a968c'; ctx.fillRect(10, H * 0.35, W - 20, H * 0.55); ctx.strokeRect(10, H * 0.35, W - 20, H * 0.55);
        ctx.beginPath(); ctx.ellipse(W / 2, H * 0.9, (W - 20) / 2, H * 0.08, 0, 0, Math.PI); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#b8b2a4'; ctx.beginPath(); ctx.ellipse(W / 2, H * 0.35, (W - 20) / 2, H * 0.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#2a4a6a'; ctx.beginPath(); ctx.ellipse(W / 2, H * 0.35, (W - 50) / 2, H * 0.15, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.arc(W * 0.4, H * 0.33, 3, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#6a665c'; ctx.lineWidth = 2;
        for (let x = 40; x < W - 30; x += 50) { ctx.beginPath(); ctx.moveTo(x, H * 0.45); ctx.lineTo(x, H * 0.85); ctx.stroke(); }
    });
}

function dibuixarTelescopiMon(c, w) {
    lienc(c, w, w * 1.6, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 6, W * 0.4, 7);
        ctx.lineWidth = 3; ctx.strokeStyle = CONTORN;
        ctx.strokeStyle = '#6b4a2a'; ctx.lineWidth = 5;
        [[0.5, 0.5, 0.15, 0.97], [0.5, 0.5, 0.85, 0.97], [0.5, 0.5, 0.5, 0.97]].forEach(([x1, y1, x2, y2]) => { ctx.beginPath(); ctx.moveTo(W * x1, H * y1); ctx.lineTo(W * x2, H * y2); ctx.stroke(); });
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
        ctx.save(); ctx.translate(W / 2, H * 0.48); ctx.rotate(-0.7);
        ctx.fillStyle = '#c8a040'; ctx.fillRect(-8, -W * 0.55, 16, W * 0.7); ctx.strokeRect(-8, -W * 0.55, 16, W * 0.7);
        ctx.fillStyle = '#e8d070'; ctx.fillRect(-11, -W * 0.6, 22, 10); ctx.strokeRect(-11, -W * 0.6, 22, 10);
        ctx.restore();
    });
}

function dibuixarRunnaPedra(c, w) {
    lienc(c, w, w * 1.3, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 8, W * 0.4, 9);
        ctx.lineWidth = 3.5; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#8a867c';
        ctx.beginPath(); ctx.moveTo(W * 0.2, H - 8); ctx.lineTo(W * 0.14, H * 0.62); ctx.lineTo(W * 0.4, H * 0.5); ctx.lineTo(W * 0.62, H * 0.52); ctx.lineTo(W * 0.86, H * 0.64); ctx.lineTo(W * 0.8, H - 8); ctx.closePath(); ctx.fill(); ctx.stroke();
        // espasa clavada
        const g = ctx.createLinearGradient(W / 2, 0, W / 2, H * 0.6);
        g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#a8c8ff');
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(W / 2 - 7, H * 0.58); ctx.lineTo(W / 2 - 7, H * 0.1); ctx.lineTo(W / 2, 4); ctx.lineTo(W / 2 + 7, H * 0.1); ctx.lineTo(W / 2 + 7, H * 0.58); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#d4af37'; ctx.fillRect(W / 2 - 22, H * 0.56, 44, 8); ctx.strokeRect(W / 2 - 22, H * 0.56, 44, 8);
    });
}

// Porxo d'arcs amb una porta de reixa (a l'oest de la plaça de l'Església)
function dibuixarPorxo(c, w) {
    lienc(c, w, w * 0.62, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 6, W * 0.48, 9);
        ctx.lineWidth = 4; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#d8c8a8'; ctx.fillRect(8, H * 0.12, W - 16, H * 0.84); ctx.strokeRect(8, H * 0.12, W - 16, H * 0.84);
        ctx.fillStyle = '#b89870'; ctx.fillRect(0, 4, W, H * 0.12); ctx.strokeRect(0, 4, W, H * 0.12);
        // arcs
        const n = 4, aw = (W - 40) / n;
        for (let i = 0; i < n; i++) {
            const x = 20 + i * aw;
            ctx.fillStyle = i === 1 ? '#2a2018' : '#4a3a2c';
            ctx.beginPath(); ctx.moveTo(x + 10, H * 0.96); ctx.lineTo(x + 10, H * 0.5); ctx.quadraticCurveTo(x + aw / 2, H * 0.14, x + aw - 10, H * 0.5); ctx.lineTo(x + aw - 10, H * 0.96); ctx.closePath(); ctx.fill(); ctx.stroke();
        }
        // reixa de la porta (segon arc)
        const gx = 20 + aw + 10;
        ctx.strokeStyle = '#7a7266'; ctx.lineWidth = 3;
        for (let x = gx + 6; x < gx + aw - 14; x += 10) { ctx.beginPath(); ctx.moveTo(x, H * 0.5); ctx.lineTo(x, H * 0.94); ctx.stroke(); }
        ctx.beginPath(); ctx.moveTo(gx, H * 0.7); ctx.lineTo(gx + aw - 20, H * 0.7); ctx.stroke();
        ctx.fillStyle = '#d4af37'; ctx.fillRect(gx + aw / 2 - 12, H * 0.76, 8, 8);
        // columnes entre arcs
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 3; ctx.fillStyle = '#c8b898';
        for (let i = 0; i <= n; i++) { const x = 20 + i * aw; ctx.fillRect(x - 6, H * 0.4, 12, H * 0.56); ctx.strokeRect(x - 6, H * 0.4, 12, H * 0.56); }
    });
}

function dibuixarEsbarzer(c, w) {
    lienc(c, w, w * 0.8, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 6, W * 0.42, 8);
        ctx.lineWidth = 3; ctx.strokeStyle = '#0a0612';
        let llavor = 5;
        const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
        for (let i = 0; i < 22; i++) {
            ctx.strokeStyle = i % 3 ? '#1a1228' : '#2a1a3a';
            ctx.beginPath();
            const x0 = W * (0.2 + rnd() * 0.6), y0 = H - 8;
            ctx.moveTo(x0, y0);
            ctx.bezierCurveTo(x0 + (rnd() - 0.5) * W * 0.6, H * 0.6, x0 + (rnd() - 0.5) * W * 0.8, H * 0.3, W * rnd(), H * (0.05 + rnd() * 0.4));
            ctx.stroke();
        }
        ctx.fillStyle = '#c070ff';
        for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(W * (0.15 + rnd() * 0.7), H * (0.1 + rnd() * 0.6), 2.5, 0, Math.PI * 2); ctx.fill(); }
    });
}

function dibuixarCofre(c, w) {
    const L = w / RES, H = Math.round(L * 0.75);
    lienc(c, w, H * RES, ctx => { ctx.scale(RES, RES); pintarCofre(ctx, L, H); });
}

function dibuixarCabana(c, w) {
    lienc(c, w, w * 0.78, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 6, W * 0.5, 10);
        ctx.lineWidth = 4; ctx.strokeStyle = CONTORN;
        // parets de fusta i fang, torçades
        ctx.fillStyle = '#6a4a2c'; ctx.beginPath(); ctx.moveTo(14, H - 8); ctx.lineTo(20, H * 0.4); ctx.lineTo(W - 22, H * 0.38); ctx.lineTo(W - 12, H - 8); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#4a3320'; ctx.lineWidth = 2;
        for (let y = H * 0.48; y < H - 14; y += 14) { ctx.beginPath(); ctx.moveTo(18, y); ctx.lineTo(W - 18, y + 2); ctx.stroke(); }
        // teulat de molsa i palla
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 4;
        ctx.fillStyle = '#4f7a38'; ctx.beginPath(); ctx.moveTo(0, H * 0.46); ctx.lineTo(W * 0.3, H * 0.06); ctx.lineTo(W * 0.74, H * 0.1); ctx.lineTo(W, H * 0.46); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#9a8a40'; ctx.fillRect(W * 0.1, H * 0.34, W * 0.2, 8); ctx.fillRect(W * 0.55, H * 0.3, W * 0.25, 8);
        // porta tort
        ctx.fillStyle = '#2a1c10'; ctx.fillRect(W * 0.42, H * 0.58, W * 0.16, H * 0.36); ctx.strokeRect(W * 0.42, H * 0.58, W * 0.16, H * 0.36);
        // xemeneia fumejant
        ctx.fillStyle = '#7a7266'; ctx.fillRect(W * 0.76, H * 0.02, 18, H * 0.24); ctx.strokeRect(W * 0.76, H * 0.02, 18, H * 0.24);
        // finestra amb llum verdosa
        ctx.fillStyle = '#c8f0a0'; ctx.fillRect(W * 0.2, H * 0.6, 22, 22); ctx.strokeRect(W * 0.2, H * 0.6, 22, 22);
    });
}

function dibuixarCercleBolets(c, w) {
    lienc(c, w, w * 0.5, (ctx, W, H) => {
        const g = ctx.createRadialGradient(W / 2, H / 2, 4, W / 2, H / 2, W * 0.5);
        g.addColorStop(0, 'rgba(200,255,180,0.45)'); g.addColorStop(1, 'rgba(120,200,120,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(W / 2, H / 2, W * 0.5, H * 0.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = 2; ctx.strokeStyle = CONTORN;
        for (let i = 0; i < 12; i++) {
            const a = i / 12 * Math.PI * 2, x = W / 2 + Math.cos(a) * W * 0.38, y = H / 2 + Math.sin(a) * H * 0.38;
            ctx.fillStyle = '#e8d8b0'; ctx.fillRect(x - 2, y, 4, 8);
            ctx.fillStyle = i % 2 ? '#c0382a' : '#e0a030'; ctx.beginPath(); ctx.ellipse(x, y, 9, 6, 0, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
        }
    });
}

function dibuixarOlla(c, w) {
    const L = w / RES;
    lienc(c, w, L * RES, ctx => { ctx.scale(RES, RES); pintarOlla(ctx, L, L); });
}

function dibuixarOcell(c, w) {
    lienc(c, w, w * 0.8, (ctx, W, H) => {
        ctx.lineWidth = 2.5; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#4a8ad4'; ctx.beginPath(); ctx.ellipse(W * 0.5, H * 0.55, W * 0.3, H * 0.28, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#6aa8f0'; ctx.beginPath(); ctx.arc(W * 0.72, H * 0.38, W * 0.16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#e8a030'; ctx.beginPath(); ctx.moveTo(W * 0.86, H * 0.38); ctx.lineTo(W * 0.98, H * 0.42); ctx.lineTo(W * 0.86, H * 0.46); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = CONTORN; ctx.fillRect(W * 0.74, H * 0.32, 3, 3);
        ctx.fillStyle = '#3a6ab0'; ctx.beginPath(); ctx.moveTo(W * 0.22, H * 0.55); ctx.lineTo(0, H * 0.4); ctx.lineTo(W * 0.2, H * 0.7); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#8a5a2a'; ctx.beginPath(); ctx.moveTo(W * 0.4, H * 0.8); ctx.lineTo(W * 0.4, H * 0.95); ctx.moveTo(W * 0.56, H * 0.8); ctx.lineTo(W * 0.56, H * 0.95); ctx.stroke();
    });
}

function dibuixarLapida(c, w) {
    lienc(c, w, w * 1.3, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 4, W * 0.45, 5);
        ctx.lineWidth = 3; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#8f8c84';
        ctx.beginPath(); ctx.moveTo(6, H - 6); ctx.lineTo(6, H * 0.35); ctx.quadraticCurveTo(W / 2, -H * 0.05, W - 6, H * 0.35); ctx.lineTo(W - 6, H - 6); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#5a5850'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(W / 2, H * 0.28); ctx.lineTo(W / 2, H * 0.62); ctx.moveTo(W * 0.32, H * 0.4); ctx.lineTo(W * 0.68, H * 0.4); ctx.stroke();
        ctx.fillStyle = '#5d8f3f'; ctx.fillRect(4, H - 10, W - 8, 6);
    });
}

function dibuixarTombaEsquerdada(c, w) {
    lienc(c, w, w * 0.55, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 5, W * 0.48, 8);
        ctx.lineWidth = 4; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#7c7870';
        ctx.beginPath(); ctx.moveTo(10, H - 8); ctx.lineTo(24, H * 0.25); ctx.lineTo(W - 24, H * 0.25); ctx.lineTo(W - 10, H - 8); ctx.closePath(); ctx.fill(); ctx.stroke();
        // esquerda amb llum lila
        const g = ctx.createLinearGradient(W * 0.45, H * 0.25, W * 0.55, H - 8);
        g.addColorStop(0, '#d8b0ff'); g.addColorStop(1, '#5a2a9a');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.moveTo(W * 0.46, H * 0.25); ctx.lineTo(W * 0.52, H * 0.5); ctx.lineTo(W * 0.47, H * 0.7); ctx.lineTo(W * 0.55, H - 10); ctx.lineTo(W * 0.58, H * 0.7); ctx.lineTo(W * 0.54, H * 0.48); ctx.lineTo(W * 0.54, H * 0.25); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#4a463e'; ctx.lineWidth = 2;
        for (let x = 40; x < W - 40; x += 18) { if (x > W * 0.4 && x < W * 0.6) continue; ctx.beginPath(); ctx.moveTo(x, H * 0.42); ctx.lineTo(x + 8, H * 0.42); ctx.stroke(); }
    });
}

// Ermita de Sant Gabriel: capella petita de pedra picada, façana amb teulada a dues aigües, espadanya, rosassa i porta d'arc
function dibuixarErmitaGabriel(c, w) {
    lienc(c, w, w * 0.92, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 6, W * 0.5, 9);
        ctx.lineWidth = 4; ctx.strokeStyle = CONTORN;
        const x0 = W * 0.06, x1 = W * 0.94, base = H - 8, cantell = H * 0.4, cim = H * 0.2;
        // Façana de pedra
        ctx.fillStyle = '#c99a5e';
        ctx.beginPath(); ctx.moveTo(x0, base); ctx.lineTo(x0, cantell); ctx.lineTo(W / 2, cim); ctx.lineTo(x1, cantell); ctx.lineTo(x1, base); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Carreus
        ctx.save(); ctx.clip();
        ctx.strokeStyle = 'rgba(70,50,30,0.35)'; ctx.lineWidth = 1.6;
        const hc = H * 0.045;
        for (let r = 0, y = base; y > cim; r++, y -= hc) {
            ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
            for (let x = x0 + (r % 2) * W * 0.05; x < x1; x += W * 0.1) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - hc); ctx.stroke(); }
        }
        ctx.restore();
        ctx.lineWidth = 4; ctx.strokeStyle = CONTORN;
        // Sòcol més clar
        ctx.fillStyle = '#d2c4a6'; ctx.fillRect(x0 - 2, base - H * 0.05, x1 - x0 + 4, H * 0.05); ctx.strokeRect(x0 - 2, base - H * 0.05, x1 - x0 + 4, H * 0.05);
        // Teulada: vora de teules a cada vessant
        ctx.fillStyle = '#b8895a';
        const vessant = (xa, ya, xb, yb) => {
            ctx.beginPath(); ctx.moveTo(xa, ya); ctx.lineTo(xb, yb); ctx.lineTo(xb, yb - H * 0.05); ctx.lineTo(xa, ya - H * 0.05); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.save(); ctx.strokeStyle = 'rgba(70,44,24,0.7)'; ctx.lineWidth = 1.6;      // dentells de la cornisa
            for (let k = 1; k < 14; k++) { const t = k / 14, px = xa + (xb - xa) * t, py = ya + (yb - ya) * t; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py - H * 0.05); ctx.stroke(); }
            ctx.restore();
        };
        vessant(x0 - W * 0.03, cantell + H * 0.015, W / 2, cim + H * 0.015);
        vessant(x1 + W * 0.03, cantell + H * 0.015, W / 2, cim + H * 0.015);
        // Espadanya amb campana
        ctx.fillStyle = '#a58c68';
        ctx.beginPath(); ctx.rect(W * 0.44, H * 0.02, W * 0.12, cim - H * 0.02); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#2a2018';
        ctx.beginPath(); ctx.moveTo(W * 0.47, H * 0.17); ctx.lineTo(W * 0.47, H * 0.08); ctx.quadraticCurveTo(W * 0.5, H * 0.03, W * 0.53, H * 0.08); ctx.lineTo(W * 0.53, H * 0.17); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#c9a53a'; ctx.beginPath(); ctx.arc(W * 0.5, H * 0.115, W * 0.014, 0, Math.PI * 2); ctx.fill();
        // Rosassa
        ctx.fillStyle = '#6a5a44'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(W / 2, H * 0.46, W * 0.06, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#c9b48a'; ctx.lineWidth = 2;
        for (let a = 0; a < 8; a++) { ctx.beginPath(); ctx.moveTo(W / 2, H * 0.46); ctx.lineTo(W / 2 + Math.cos(a * Math.PI / 4) * W * 0.05, H * 0.46 + Math.sin(a * Math.PI / 4) * W * 0.05); ctx.stroke(); }
        // Arc de descàrrega i porta
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
        const pw = W * 0.16, ph = H * 0.27, pb = base - H * 0.05;
        ctx.fillStyle = '#c4ae88';
        ctx.beginPath(); ctx.moveTo(W / 2 - pw * 0.9, pb); ctx.lineTo(W / 2 - pw * 0.9, pb - ph * 0.8); ctx.arc(W / 2, pb - ph * 0.8, pw * 0.9, Math.PI, 0); ctx.lineTo(W / 2 + pw * 0.9, pb); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#7a4a30';
        ctx.beginPath(); ctx.moveTo(W / 2 - pw / 2, pb); ctx.lineTo(W / 2 - pw / 2, pb - ph * 0.7); ctx.arc(W / 2, pb - ph * 0.7, pw / 2, Math.PI, 0); ctx.lineTo(W / 2 + pw / 2, pb); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(30,16,8,0.6)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(W / 2, pb); ctx.lineTo(W / 2, pb - ph * 0.7 - pw / 2); ctx.stroke();
    });
}

// Ermita de la Desaparició: capella petita de carreus grisos, espadanya amb creu, porta de dues fulles amb ferramenta
// d'espirals i dues finestres enreixades als costats
function dibuixarErmitaDesaparicio(c, w) {
    lienc(c, w, w * 0.74, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 6, W * 0.5, 9);
        ctx.lineWidth = 4; ctx.strokeStyle = CONTORN;
        const x0 = W * 0.06, x1 = W * 0.94, base = H - 8, cantell = H * 0.44, cim = H * 0.27;
        // Façana de carreus
        ctx.fillStyle = '#a79a82';
        ctx.beginPath(); ctx.moveTo(x0, base); ctx.lineTo(x0, cantell); ctx.lineTo(W / 2, cim); ctx.lineTo(x1, cantell); ctx.lineTo(x1, base); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.save(); ctx.clip();
        ctx.strokeStyle = 'rgba(60,48,34,0.35)'; ctx.lineWidth = 1.6;
        const hc = H * 0.075;
        for (let r = 0, y = base; y > cim; r++, y -= hc) {
            ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
            for (let x = x0 + (r % 2) * W * 0.07; x < x1; x += W * 0.14) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - hc); ctx.stroke(); }
        }
        let llavor = 11;
        const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
        for (let i = 0; i < 26; i++) {          // liquen
            ctx.fillStyle = i % 2 ? 'rgba(190,200,150,0.4)' : 'rgba(230,226,205,0.4)';
            ctx.beginPath(); ctx.ellipse(x0 + rnd() * (x1 - x0), cim + rnd() * (base - cim), 4 + rnd() * 9, 3 + rnd() * 5, rnd() * 3, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
        ctx.lineWidth = 4; ctx.strokeStyle = CONTORN;
        // Teulada: vora de teules amb ràfec
        ctx.fillStyle = '#a0623e';
        const vessant = (xa, ya, xb, yb) => {
            ctx.beginPath(); ctx.moveTo(xa, ya); ctx.lineTo(xb, yb); ctx.lineTo(xb, yb - H * 0.06); ctx.lineTo(xa, ya - H * 0.06); ctx.closePath(); ctx.fill(); ctx.stroke();
        };
        vessant(x0 - W * 0.04, cantell + H * 0.02, W / 2, cim + H * 0.02);
        vessant(x1 + W * 0.04, cantell + H * 0.02, W / 2, cim + H * 0.02);
        // Espadanya amb campana i creueta
        ctx.fillStyle = '#9a8d76';
        ctx.beginPath(); ctx.moveTo(W * 0.43, cim + H * 0.03); ctx.lineTo(W * 0.43, H * 0.1); ctx.quadraticCurveTo(W / 2, H * 0.0, W * 0.57, H * 0.1); ctx.lineTo(W * 0.57, cim + H * 0.03); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#241c14';
        ctx.beginPath(); ctx.moveTo(W * 0.465, cim); ctx.lineTo(W * 0.465, H * 0.145); ctx.quadraticCurveTo(W / 2, H * 0.075, W * 0.535, H * 0.145); ctx.lineTo(W * 0.535, cim); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#b08a2c'; ctx.beginPath(); ctx.arc(W / 2, H * 0.18, W * 0.016, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(W / 2, H * 0.05); ctx.lineTo(W / 2, -H * 0.02); ctx.moveTo(W / 2 - W * 0.025, H * 0.015); ctx.lineTo(W / 2 + W * 0.025, H * 0.015); ctx.stroke();
        // Finestres enreixades
        [W * 0.17, W * 0.71].forEach(fx => {
            const fw = W * 0.12, fy = H * 0.56, fh = H * 0.17;
            ctx.fillStyle = '#c4b8a0'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3; ctx.fillRect(fx - 4, fy - 4, fw + 8, fh + 8); ctx.strokeRect(fx - 4, fy - 4, fw + 8, fh + 8);
            ctx.fillStyle = '#1c1812'; ctx.fillRect(fx, fy, fw, fh);
            ctx.strokeStyle = '#6a6458'; ctx.lineWidth = 2;
            for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(fx + fw * k / 4, fy); ctx.lineTo(fx + fw * k / 4, fy + fh); ctx.stroke(); }
            for (let k = 1; k < 3; k++) { ctx.beginPath(); ctx.moveTo(fx, fy + fh * k / 3); ctx.lineTo(fx + fw, fy + fh * k / 3); ctx.stroke(); }
        });
        // Porta de dues fulles amb espirals de ferro
        const pw = W * 0.24, pt = H * 0.5, pb = base - H * 0.04, px = W / 2 - pw / 2;
        ctx.fillStyle = '#7a4a2e'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
        ctx.fillRect(px, pt, pw, pb - pt); ctx.strokeRect(px, pt, pw, pb - pt);
        ctx.beginPath(); ctx.moveTo(W / 2, pt); ctx.lineTo(W / 2, pb); ctx.stroke();
        ctx.strokeStyle = '#2a1a10'; ctx.lineWidth = 1.8;
        [[0.25, 0.3], [0.75, 0.3], [0.25, 0.62], [0.75, 0.62]].forEach(([ax, ay]) => {
            const cx = px + pw * ax, cy = pt + (pb - pt) * ay;
            ctx.beginPath(); ctx.arc(cx, cy, pw * 0.1, 0, Math.PI * 1.6); ctx.stroke();
            ctx.beginPath(); ctx.arc(cx, cy, pw * 0.045, 0, Math.PI * 1.4); ctx.stroke();
        });
        // Graó de la porta
        ctx.fillStyle = '#c4b8a0'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
        ctx.fillRect(px - W * 0.03, pb, pw + W * 0.06, H * 0.04); ctx.strokeRect(px - W * 0.03, pb, pw + W * 0.06, H * 0.04);
    });
}

// Creu de la Desaparició: columna de pedra sobre una base d'esglaons, amb capitell i una petita creu al cim
function dibuixarCreuDesaparicio(c, w) {
    lienc(c, w, w * 3.1, (ctx, W, H) => {
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
        const bloc = (x0, y0, x1, y1, color) => { ctx.fillStyle = color; ctx.fillRect(W * x0, H * y0, W * (x1 - x0), H * (y1 - y0)); ctx.strokeRect(W * x0, H * y0, W * (x1 - x0), H * (y1 - y0)); };
        ombraTerra(ctx, W / 2, H - 5, W * 0.5, 7);
        bloc(0.02, 0.92, 0.98, 0.985, '#9c937e');           // esglaó inferior
        bloc(0.14, 0.86, 0.86, 0.92, '#aaa28c');            // esglaó superior
        bloc(0.3, 0.7, 0.7, 0.86, '#b3ab95');               // pedestal
        bloc(0.26, 0.68, 0.74, 0.705, '#a39b85');           // motllura del pedestal
        // Fust lleugerament cònic
        ctx.fillStyle = '#b9b19b';
        ctx.beginPath(); ctx.moveTo(W * 0.4, H * 0.68); ctx.lineTo(W * 0.43, H * 0.24); ctx.lineTo(W * 0.57, H * 0.24); ctx.lineTo(W * 0.6, H * 0.68); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(60,50,38,0.35)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(W * 0.5, H * 0.26); ctx.lineTo(W * 0.5, H * 0.66); ctx.stroke();
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
        bloc(0.38, 0.6, 0.62, 0.625, '#a39b85');            // anell del fust
        // Capitell i àbac
        ctx.fillStyle = '#aaa28c';
        ctx.beginPath(); ctx.moveTo(W * 0.42, H * 0.24); ctx.lineTo(W * 0.34, H * 0.2); ctx.lineTo(W * 0.66, H * 0.2); ctx.lineTo(W * 0.58, H * 0.24); ctx.closePath(); ctx.fill(); ctx.stroke();
        bloc(0.32, 0.17, 0.68, 0.2, '#b3ab95');
        // La creu del cim
        bloc(0.46, 0.04, 0.54, 0.17, '#b9b19b');
        bloc(0.36, 0.065, 0.64, 0.105, '#b9b19b');
        // Liquen
        let llavor = 5;
        const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
        for (let i = 0; i < 16; i++) {
            ctx.fillStyle = i % 2 ? 'rgba(160,176,110,0.45)' : 'rgba(225,222,200,0.4)';
            ctx.beginPath(); ctx.ellipse(W * (0.1 + rnd() * 0.8), H * (0.25 + rnd() * 0.7), 3 + rnd() * 5, 2 + rnd() * 3, rnd() * 3, 0, Math.PI * 2); ctx.fill();
        }
    });
}

// ================= Edificis del Santuari del Miracle (provisionals, fets amb codi) =================
// Utilitats comunes: carreus amb filades i liquen dins d'un rectangle
function carreus(ctx, x, y, w, h, color, alt, ample, llavor = 3) {
    ctx.fillStyle = color; ctx.fillRect(x, y, w, h);
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.strokeStyle = 'rgba(60,44,26,0.3)'; ctx.lineWidth = 1.4;
    for (let r = 0, yy = y + h; yy > y; r++, yy -= alt) {
        ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); ctx.stroke();
        for (let xx = x + (r % 2) * ample * 0.5; xx < x + w; xx += ample) { ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx, yy - alt); ctx.stroke(); }
    }
    let l = llavor;
    const rnd = () => { l = (l * 16807) % 2147483647; return l / 2147483647; };
    for (let i = 0; i < Math.round(w * h / 9000); i++) {
        ctx.fillStyle = i % 2 ? 'rgba(190,196,150,0.28)' : 'rgba(232,226,205,0.25)';
        ctx.beginPath(); ctx.ellipse(x + rnd() * w, y + rnd() * h, 3 + rnd() * 8, 2 + rnd() * 4, rnd() * 3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
}

// Finestra amb marc de pedra i guardapols (opcional) i reixa
function finestra(ctx, x, y, w, h, o = {}) {
    ctx.lineWidth = 3; ctx.strokeStyle = CONTORN;
    if (o.guardapols) {
        ctx.fillStyle = '#b3a07a'; ctx.fillRect(x - w * 0.18, y - h * 0.2, w * 1.36, h * 0.14); ctx.strokeRect(x - w * 0.18, y - h * 0.2, w * 1.36, h * 0.14);
    }
    ctx.fillStyle = o.marc || '#c9b88f'; ctx.fillRect(x - w * 0.1, y - h * 0.06, w * 1.2, h * 1.12); ctx.strokeRect(x - w * 0.1, y - h * 0.06, w * 1.2, h * 1.12);
    ctx.fillStyle = o.vidre || '#26303a';
    if (o.arc) {
        ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x, y + h * 0.3); ctx.quadraticCurveTo(x + w / 2, y - h * 0.25, x + w, y + h * 0.3); ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill(); ctx.stroke();
    } else { ctx.fillRect(x, y, w, h); ctx.strokeRect(x, y, w, h); }
    ctx.strokeStyle = o.reixa ? '#6a6458' : '#6a4a30'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x + w / 2, y + (o.arc ? h * 0.1 : 0)); ctx.lineTo(x + w / 2, y + h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y + h * 0.55); ctx.lineTo(x + w, y + h * 0.55); ctx.stroke();
    if (o.reixa) for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(x + w * k / 4, y + h * 0.3); ctx.lineTo(x + w * k / 4, y + h); ctx.stroke(); }
}

// Teulada de teules amb pendent, vista de davant i una mica des de dalt: trapezi amb filades de teula
function teuladaTeules(ctx, W, yTop, yBase, color = '#b0714a') {
    ctx.fillStyle = color; ctx.strokeStyle = CONTORN; ctx.lineWidth = 4; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(-W * 0.012, yBase); ctx.lineTo(W * 0.07, yTop); ctx.lineTo(W * 0.93, yTop); ctx.lineTo(W * 1.012, yBase); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.save(); ctx.clip();
    ctx.strokeStyle = 'rgba(60,30,16,0.45)'; ctx.lineWidth = 1.5;
    const n = 4;
    for (let k = 1; k < n; k++) { const y = yTop + (yBase - yTop) * k / n; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    for (let k = 0; k < n; k++) for (let x = (k % 2) * 9; x < W; x += 18) { const y0 = yTop + (yBase - yTop) * k / n; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + (yBase - yTop) / n); ctx.stroke(); }
    ctx.restore();
    ctx.fillStyle = 'rgba(40,20,10,0.25)'; ctx.fillRect(0, yBase - 5, W, 5);
}

// Casa Gran: bloc de tres plantes de carreus, teulada de teules amb pendent, tres arcs de porxo a la planta baixa (a la dreta)
// amb una reixa de ferro a l'arc de l'esquerra, i una escalinata ampla al davant.
function dibuixarCasaGran(c, w) {
    lienc(c, w, w * 0.86, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 5, W * 0.5, 8);
        const wb = H * 0.9;
        ctx.lineJoin = 'round';
        carreus(ctx, 0, H * 0.07, W, wb - H * 0.07, '#b89a68', H * 0.036, W * 0.06);
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 4; ctx.strokeRect(0, H * 0.07, W, wb - H * 0.07);
        // Teulada de teules amb pendent i una petita xemeneia
        ctx.fillStyle = '#9a6a48'; ctx.fillRect(W * 0.8, -H * 0.005, W * 0.05, H * 0.07); ctx.strokeRect(W * 0.8, -H * 0.005, W * 0.05, H * 0.07);
        teuladaTeules(ctx, W, H * 0.015, H * 0.115);
        // Finestres: tres de petites a dalt, tres de grans amb marc i guardapols al pis noble
        [0.2, 0.52, 0.82].forEach(cx => finestra(ctx, W * cx - W * 0.025, H * 0.15, W * 0.05, H * 0.1));
        [0.2, 0.52, 0.82].forEach(cx => finestra(ctx, W * cx - W * 0.04, H * 0.37, W * 0.08, H * 0.2, { guardapols: true }));
        // Medalló (rellotge de sol)
        ctx.fillStyle = '#6a5a44'; ctx.beginPath(); ctx.arc(W * 0.36, H * 0.19, W * 0.022, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Finestreta enreixada de baix a la dreta
        finestra(ctx, W * 0.9 - W * 0.025, H * 0.68, W * 0.05, H * 0.1, { reixa: true });
        // Tres arcs del porxo, amb dovelles
        [0.44, 0.59, 0.74].forEach((cx, i) => {
            const aw = W * 0.062, top = H * 0.62, rad = aw;
            ctx.fillStyle = '#c7ad7c'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(W * cx - rad * 1.28, wb); ctx.lineTo(W * cx - rad * 1.28, top); ctx.arc(W * cx, top, rad * 1.28, Math.PI, 0); ctx.lineTo(W * cx + rad * 1.28, wb); ctx.closePath(); ctx.fill(); ctx.stroke();
            // Interior del porxo ben il·luminat: paret del fons clara i volta una mica més fosca
            ctx.fillStyle = '#8a7350';
            ctx.beginPath(); ctx.moveTo(W * cx - rad, wb); ctx.lineTo(W * cx - rad, top); ctx.arc(W * cx, top, rad, Math.PI, 0); ctx.lineTo(W * cx + rad, wb); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.save(); ctx.clip();
            const volta = ctx.createLinearGradient(0, top - rad, 0, top + rad * 0.8); volta.addColorStop(0, 'rgba(40,28,14,0.55)'); volta.addColorStop(1, 'rgba(40,28,14,0)');
            ctx.fillStyle = volta; ctx.fillRect(W * cx - rad, top - rad, rad * 2, rad * 2);
            ctx.restore();
            if (i === 1) {                                  // la porta de ferro del fons del porxo, que dona a l'Escalinata
                const dw = rad * 1.25, dx = W * cx - dw / 2, dt = top - rad * 0.2, db = wb - H * 0.01;
                ctx.fillStyle = '#2c2a2c'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 2.5;
                ctx.beginPath(); ctx.moveTo(dx, db); ctx.lineTo(dx, dt + dw / 2); ctx.arc(W * cx, dt + dw / 2, dw / 2, Math.PI, 0); ctx.lineTo(dx + dw, db); ctx.closePath(); ctx.fill(); ctx.stroke();
                ctx.strokeStyle = '#8e8a82'; ctx.lineWidth = 2;
                for (let x = dx + 5; x < dx + dw - 2; x += 7) { ctx.beginPath(); ctx.moveTo(x, dt + dw / 2 - 2); ctx.lineTo(x, db - 2); ctx.stroke(); }
                ctx.beginPath(); ctx.moveTo(dx, H * 0.76); ctx.lineTo(dx + dw, H * 0.76); ctx.moveTo(W * cx, dt + 4); ctx.lineTo(W * cx, db - 2); ctx.stroke();
                ctx.fillStyle = '#d4af37'; ctx.fillRect(W * cx + 3, H * 0.78, 6, 8);
            }
            ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
            ctx.fillStyle = '#3a3a3e'; ctx.fillRect(W * cx - 5, H * 0.575, 10, 14); ctx.strokeRect(W * cx - 5, H * 0.575, 10, 14);   // fanal
        });
        // Escalinata ampla davant dels arcs
        for (let k = 0; k < 4; k++) {
            const x0 = W * (0.38 - k * 0.012), x1 = W * (0.82 + k * 0.012), y = wb + k * H * 0.024;
            ctx.fillStyle = k % 2 ? '#a9a08c' : '#b8ae98'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 2.5;
            ctx.fillRect(x0, y, x1 - x0, H * 0.024); ctx.strokeRect(x0, y, x1 - x0, H * 0.024);
        }
    });
}

// Monestir: bloc llarg de carreus amb teulada de teules i finestres d'arc petites, portal d'arc central amb arquivolta i escalonada
function dibuixarMonestir(c, w) {
    lienc(c, w, w * 0.66, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 5, W * 0.5, 8);
        const wb = H * 0.9;
        ctx.lineJoin = 'round';
        carreus(ctx, 0, H * 0.08, W, wb - H * 0.08, '#c2a574', H * 0.045, W * 0.06, 9);
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 4; ctx.strokeRect(0, H * 0.08, W, wb - H * 0.08);
        teuladaTeules(ctx, W, H * 0.0, H * 0.1);
        // Finestres d'arc: sengles als costats i dobles (bífores) al mig
        [0.12, 0.26, 0.74, 0.88].forEach(cx => finestra(ctx, W * cx - W * 0.014, H * 0.2, W * 0.028, H * 0.17, { arc: true, marc: '#cdb88c' }));
        [0.38, 0.62].forEach(cx => {
            finestra(ctx, W * cx - W * 0.03, H * 0.2, W * 0.022, H * 0.17, { arc: true, marc: '#cdb88c' });
            finestra(ctx, W * cx + W * 0.008, H * 0.2, W * 0.022, H * 0.17, { arc: true, marc: '#cdb88c' });
        });
        [0.12, 0.88].forEach(cx => finestra(ctx, W * cx - W * 0.014, H * 0.55, W * 0.028, H * 0.17, { arc: true, marc: '#cdb88c' }));
        [0.3, 0.7].forEach(cx => finestra(ctx, W * cx - W * 0.014, H * 0.55, W * 0.028, H * 0.17, { arc: true, marc: '#cdb88c' }));
        // Portal central amb arquivolta
        const px = W / 2, pt = H * 0.5, rad = W * 0.04;
        ctx.fillStyle = '#d6c398'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(px - rad * 1.6, wb); ctx.lineTo(px - rad * 1.6, pt); ctx.arc(px, pt, rad * 1.6, Math.PI, 0); ctx.lineTo(px + rad * 1.6, wb); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#b89a68';
        ctx.beginPath(); ctx.moveTo(px - rad * 1.25, wb); ctx.lineTo(px - rad * 1.25, pt); ctx.arc(px, pt, rad * 1.25, Math.PI, 0); ctx.lineTo(px + rad * 1.25, wb); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#4a2c18';
        ctx.beginPath(); ctx.moveTo(px - rad * 0.85, wb); ctx.lineTo(px - rad * 0.85, pt); ctx.arc(px, pt, rad * 0.85, Math.PI, 0); ctx.lineTo(px + rad * 0.85, wb); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px, pt - rad * 0.85); ctx.lineTo(px, wb); ctx.stroke();
        for (let k = 0; k < 3; k++) {
            const x0 = px - rad * (2.4 + k * 0.4), x1 = px + rad * (2.4 + k * 0.4), y = wb + k * H * 0.028;
            ctx.fillStyle = k % 2 ? '#a9a08c' : '#b8ae98'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 2.5;
            ctx.fillRect(x0, y, x1 - x0, H * 0.028); ctx.strokeRect(x0, y, x1 - x0, H * 0.028);
        }
    });
}

// Cel·les de Nostra Senyora: gran bloc de pedra bruna amb cantoneres clares, teulada de poc pendent i finestres d'arc amb persianes
function dibuixarCelNostraSenyora(c, w) {
    lienc(c, w, w * 0.78, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 5, W * 0.5, 8);
        const wb = H - 8, roof = H * 0.2;
        ctx.lineJoin = 'round';
        carreus(ctx, W * 0.03, roof, W * 0.94, wb - roof, '#8f7650', H * 0.04, W * 0.05, 13);
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 4; ctx.strokeRect(W * 0.03, roof, W * 0.94, wb - roof);
        // Cantoneres de pedra clara
        [W * 0.03, W * 0.93].forEach(x => { ctx.fillStyle = '#c4ad82'; ctx.fillRect(x, roof, W * 0.04, wb - roof); ctx.strokeRect(x, roof, W * 0.04, wb - roof); });
        // Teulada de poc pendent amb ràfec
        ctx.fillStyle = '#b0714a';
        ctx.beginPath(); ctx.moveTo(0, roof + H * 0.03); ctx.lineTo(W * 0.1, H * 0.05); ctx.lineTo(W * 0.9, H * 0.05); ctx.lineTo(W, roof + H * 0.03); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(60,30,16,0.5)'; ctx.lineWidth = 1.5;
        for (let k = 1; k < 5; k++) { const y = H * 0.05 + (roof + H * 0.03 - H * 0.05) * k / 5; ctx.beginPath(); ctx.moveTo(W * 0.1 * (1 - k / 5), y); ctx.lineTo(W - W * 0.1 * (1 - k / 5), y); ctx.stroke(); }
        // Finestres d'arc en quadrícula (2 columnes x 3 files) amb persianes marrons; la fila de baix, enreixada
        [0.2, 0.4, 0.6, 0.8].forEach(cx => {
            [0.28, 0.5].forEach(fy => finestra(ctx, W * cx - W * 0.03, H * fy, W * 0.06, H * 0.14, { arc: true, marc: '#c4ad82', vidre: '#6a3a24' }));
            finestra(ctx, W * cx - W * 0.03, H * 0.72, W * 0.06, H * 0.14, { arc: true, marc: '#c4ad82', vidre: '#1c1812', reixa: true });
        });
        // Porta gran de fusta amb arc de pedra, al mig de la façana: més alta que l'Ineu
        const px = W * 0.45, pw = W * 0.1, pt = wb - H * 0.22;
        ctx.fillStyle = '#c4ad82'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(px - 8, wb); ctx.lineTo(px - 8, pt + pw * 0.5); ctx.arc(px + pw / 2, pt + pw * 0.5, pw / 2 + 8, Math.PI, 0); ctx.lineTo(px + pw + 8, wb); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#5a3820';
        ctx.beginPath(); ctx.moveTo(px, wb); ctx.lineTo(px, pt + pw * 0.5); ctx.arc(px + pw / 2, pt + pw * 0.5, pw / 2, Math.PI, 0); ctx.lineTo(px + pw, wb); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(20,10,4,0.55)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(px + pw / 2, pt); ctx.lineTo(px + pw / 2, wb); ctx.stroke();
        ctx.fillStyle = '#c9a54a'; ctx.beginPath(); ctx.arc(px + pw * 0.4, wb - H * 0.1, 3, 0, Math.PI * 2); ctx.arc(px + pw * 0.6, wb - H * 0.1, 3, 0, Math.PI * 2); ctx.fill();
    });
}

// Cel·les de Sant Benet: edifici més petit de pedra clara i detalls de maó, frontó esglaonat amb finestra rodona i dues finestres d'arc
function dibuixarCelSantBenet(c, w) {
    lienc(c, w, w * 0.72, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 5, W * 0.5, 8);
        const wb = H - 8, cantell = H * 0.3;
        ctx.lineJoin = 'round'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 4;
        ctx.fillStyle = '#d0a56a';
        ctx.beginPath(); ctx.moveTo(W * 0.08, wb); ctx.lineTo(W * 0.08, cantell); ctx.lineTo(W * 0.5, H * 0.1); ctx.lineTo(W * 0.92, cantell); ctx.lineTo(W * 0.92, wb); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.save(); ctx.clip();
        ctx.strokeStyle = 'rgba(100,60,30,0.3)'; ctx.lineWidth = 1.4;
        for (let y = wb; y > 0; y -= H * 0.05) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
        ctx.restore();
        // Cornisa que segueix el frontó
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 4; ctx.fillStyle = '#b98652';
        const vessant = (xa, ya, xb, yb) => { ctx.beginPath(); ctx.moveTo(xa, ya); ctx.lineTo(xb, yb); ctx.lineTo(xb, yb - H * 0.05); ctx.lineTo(xa, ya - H * 0.05); ctx.closePath(); ctx.fill(); ctx.stroke(); };
        vessant(W * 0.04, cantell + H * 0.02, W * 0.5, H * 0.1 + H * 0.02); vessant(W * 0.96, cantell + H * 0.02, W * 0.5, H * 0.1 + H * 0.02);
        // Finestra rodona al frontó
        ctx.fillStyle = '#26303a'; ctx.beginPath(); ctx.arc(W * 0.5, H * 0.27, W * 0.03, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Dues finestres d'arc amb marcs de maó
        [0.3, 0.64].forEach(cx => finestra(ctx, W * cx, H * 0.4, W * 0.06, H * 0.2, { arc: true, marc: '#b86a42', vidre: '#6a3a24' }));
        // Porta de fusta amb arc, més alta que l'Ineu
        const px = W * 0.455, pw = W * 0.09, pt = wb - H * 0.36;
        ctx.fillStyle = '#b86a42'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(px - 6, wb); ctx.lineTo(px - 6, pt + pw * 0.5); ctx.arc(px + pw / 2, pt + pw * 0.5, pw / 2 + 6, Math.PI, 0); ctx.lineTo(px + pw + 6, wb); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#6a4228';
        ctx.beginPath(); ctx.moveTo(px, wb); ctx.lineTo(px, pt + pw * 0.5); ctx.arc(px + pw / 2, pt + pw * 0.5, pw / 2, Math.PI, 0); ctx.lineTo(px + pw, wb); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(20,10,4,0.5)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(px + pw / 2, pt); ctx.lineTo(px + pw / 2, wb); ctx.stroke();
    });
}

// L'Home del Raïm: estàtua de marbre d'un home amb barba i un raïm a la mà, d'esquena (el cap girat enrere), sobre un
// pedestal alt amb un plafó octogonal i una base esglaonada
function dibuixarHomeRaimMarbre(c, w) {
    lienc(c, w, w * 2.4, (ctx, W, H) => {
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 3; ctx.lineJoin = 'round';
        ombraTerra(ctx, W / 2, H - 4, W * 0.5, 6);
        const blocP = (x0, y0, x1, y1, col) => { ctx.fillStyle = col; ctx.fillRect(W * x0, H * y0, W * (x1 - x0), H * (y1 - y0)); ctx.strokeRect(W * x0, H * y0, W * (x1 - x0), H * (y1 - y0)); };
        blocP(0.04, 0.92, 0.96, 0.99, '#8e8776'); blocP(0.12, 0.86, 0.88, 0.92, '#9d9683'); // base esglaonada
        blocP(0.2, 0.52, 0.8, 0.86, '#b9b3a2');                                            // cos del pedestal
        blocP(0.28, 0.58, 0.72, 0.8, '#a9a391');
        ctx.fillStyle = '#b9b3a2'; ctx.beginPath();                                          // plafó octogonal
        const ox = 0.5, oy = 0.69, rx = 0.16, ry = 0.09, cn = 0.05;
        ctx.moveTo(W * (ox - rx + cn), H * (oy - ry)); ctx.lineTo(W * (ox + rx - cn), H * (oy - ry)); ctx.lineTo(W * (ox + rx), H * (oy - ry + cn * 1.6));
        ctx.lineTo(W * (ox + rx), H * (oy + ry - cn * 1.6)); ctx.lineTo(W * (ox + rx - cn), H * (oy + ry)); ctx.lineTo(W * (ox - rx + cn), H * (oy + ry));
        ctx.lineTo(W * (ox - rx), H * (oy + ry - cn * 1.6)); ctx.lineTo(W * (ox - rx), H * (oy - ry + cn * 1.6)); ctx.closePath(); ctx.fill(); ctx.stroke();
        blocP(0.14, 0.47, 0.86, 0.53, '#c4beac');                                          // cornisa del pedestal
        // Estàtua de marbre
        const marbre = '#dcd7c8', ombra = '#aaa493';
        ctx.fillStyle = ombra; ctx.beginPath(); ctx.ellipse(W * 0.5, H * 0.465, W * 0.3, H * 0.02, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();   // roques als peus
        ctx.fillStyle = marbre;
        ctx.beginPath(); ctx.moveTo(W * 0.34, H * 0.45); ctx.lineTo(W * 0.3, H * 0.3); ctx.lineTo(W * 0.36, H * 0.17); ctx.lineTo(W * 0.64, H * 0.17); ctx.lineTo(W * 0.72, H * 0.3); ctx.lineTo(W * 0.68, H * 0.45); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(90,82,66,0.55)'; ctx.lineWidth = 1.8;                       // plecs del drapejat
        [[0.4, 0.28, 0.38, 0.44], [0.5, 0.3, 0.5, 0.45], [0.6, 0.28, 0.62, 0.44]].forEach(([a, b, d, e]) => { ctx.beginPath(); ctx.moveTo(W * a, H * b); ctx.quadraticCurveTo(W * (a + d) / 2 + 3, H * (b + e) / 2, W * d, H * e); ctx.stroke(); });
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
        ctx.fillStyle = marbre;                                                            // braç amb el raïm
        ctx.beginPath(); ctx.ellipse(W * 0.3, H * 0.24, W * 0.07, H * 0.045, 0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#5b2a6e'; [[0.27, 0.3], [0.31, 0.32], [0.29, 0.34], [0.33, 0.29]].forEach(([gx, gy]) => { ctx.beginPath(); ctx.arc(W * gx, H * gy, W * 0.022, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
        ctx.fillStyle = marbre;                                                            // cap (de nuca) amb cabells i barba
        ctx.beginPath(); ctx.ellipse(W * 0.5, H * 0.115, W * 0.15, H * 0.06, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = ombra; ctx.beginPath(); ctx.ellipse(W * 0.5, H * 0.105, W * 0.13, H * 0.045, 0, Math.PI, 0); ctx.fill();
        ctx.strokeStyle = 'rgba(90,82,66,0.6)'; ctx.lineWidth = 1.5;
        for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(W * (0.4 + k * 0.05), H * 0.07); ctx.lineTo(W * (0.4 + k * 0.05), H * 0.15); ctx.stroke(); }
    });
}

// ================= Creu de l'Aparició, Bassadòria i Retaule barroc =================
// Creu de l'Aparició: tambor de pedra sobre tres graons, fust llis, capitell rodó i una creu llatina al cim
function dibuixarCreuAparicio(c, w) {
    lienc(c, w, w * 2.7, (ctx, W, H) => {
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 3; ctx.lineJoin = 'round';
        const bloc = (x0, y0, x1, y1, col) => { ctx.fillStyle = col; ctx.fillRect(W * x0, H * y0, W * (x1 - x0), H * (y1 - y0)); ctx.strokeRect(W * x0, H * y0, W * (x1 - x0), H * (y1 - y0)); };
        ombraTerra(ctx, W / 2, H - 4, W * 0.5, 6);
        bloc(0.0, 0.93, 1.0, 0.995, '#938b78'); bloc(0.1, 0.875, 0.9, 0.93, '#a29a86'); bloc(0.18, 0.82, 0.82, 0.875, '#aaa28d');   // tres graons
        ctx.fillStyle = '#b3ab96';                                                         // tambor
        ctx.beginPath(); ctx.moveTo(W * 0.26, H * 0.82); ctx.lineTo(W * 0.28, H * 0.66); ctx.lineTo(W * 0.72, H * 0.66); ctx.lineTo(W * 0.74, H * 0.82); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(60,50,38,0.4)'; ctx.lineWidth = 1.5;
        [0.4, 0.5, 0.6].forEach(x => { ctx.beginPath(); ctx.moveTo(W * x, H * 0.665); ctx.lineTo(W * x, H * 0.82); ctx.stroke(); });
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
        bloc(0.22, 0.635, 0.78, 0.67, '#c0b8a2');                                          // coberta del tambor
        ctx.fillStyle = '#aea690';                                                         // fust
        ctx.beginPath(); ctx.moveTo(W * 0.42, H * 0.635); ctx.lineTo(W * 0.44, H * 0.2); ctx.lineTo(W * 0.56, H * 0.2); ctx.lineTo(W * 0.58, H * 0.635); ctx.closePath(); ctx.fill(); ctx.stroke();
        bloc(0.38, 0.17, 0.62, 0.205, '#c0b8a2');                                          // capitell rodó
        bloc(0.46, 0.03, 0.54, 0.17, '#b3ab96'); bloc(0.34, 0.065, 0.66, 0.105, '#b3ab96'); // creu llatina
        let l = 4; const rnd = () => { l = (l * 16807) % 2147483647; return l / 2147483647; };
        for (let i = 0; i < 22; i++) {
            ctx.fillStyle = i % 2 ? 'rgba(160,176,110,0.45)' : 'rgba(228,224,204,0.42)';
            ctx.beginPath(); ctx.ellipse(W * (0.05 + rnd() * 0.9), H * (0.25 + rnd() * 0.72), 3 + rnd() * 5, 2 + rnd() * 3, rnd() * 3, 0, Math.PI * 2); ctx.fill();
        }
    });
}

// Bassadòria: gran bassa ovalada de pedra amb vora baixa, barana de ferro, portal de pilars amb reixa i dos pilons laterals
function dibuixarBassadoriaReixa(c, w) {
    lienc(c, w, w * 0.62, (ctx, W, H) => {
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 3; ctx.lineJoin = 'round';
        ombraTerra(ctx, W / 2, H - 5, W * 0.5, 8);
        // Vora de pedra (dos graons) i aigua
        ctx.fillStyle = '#8f8873'; ctx.beginPath(); ctx.ellipse(W / 2, H * 0.62, W * 0.5, H * 0.34, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#a39c86'; ctx.beginPath(); ctx.ellipse(W / 2, H * 0.58, W * 0.46, H * 0.3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#4a6a49'; ctx.beginPath(); ctx.ellipse(W / 2, H * 0.55, W * 0.4, H * 0.24, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(120,70,150,0.35)'; ctx.beginPath(); ctx.ellipse(W * 0.46, H * 0.53, W * 0.26, H * 0.15, 0.1, 0, Math.PI * 2); ctx.fill();
        // Barana de ferro al voltant (mig arc de darrere)
        ctx.strokeStyle = '#1c1a18'; ctx.lineWidth = 2.2;
        for (let a = Math.PI * 1.04; a < Math.PI * 1.96; a += 0.09) {
            const x = W / 2 + Math.cos(a) * W * 0.46, y = H * 0.58 + Math.sin(a) * H * 0.3;
            ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - H * 0.13); ctx.stroke();
        }
        ctx.lineWidth = 3; ctx.beginPath();
        for (let a = Math.PI * 1.04; a <= Math.PI * 1.96; a += 0.05) { const x = W / 2 + Math.cos(a) * W * 0.46, y = H * 0.58 + Math.sin(a) * H * 0.3 - H * 0.13; a === Math.PI * 1.04 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        ctx.stroke();
        // Portal de pilars amb reixa, al davant
        ctx.lineWidth = 3; ctx.strokeStyle = CONTORN;
        const pilar = x => { ctx.fillStyle = '#a7a08b'; ctx.fillRect(W * x, H * 0.5, W * 0.045, H * 0.4); ctx.strokeRect(W * x, H * 0.5, W * 0.045, H * 0.4); ctx.fillStyle = '#b8b19c'; ctx.fillRect(W * x - 3, H * 0.46, W * 0.045 + 6, H * 0.05); ctx.strokeRect(W * x - 3, H * 0.46, W * 0.045 + 6, H * 0.05); };
        pilar(0.43); pilar(0.525);
        ctx.strokeStyle = '#1c1a18'; ctx.lineWidth = 2;
        for (let x = W * 0.48; x < W * 0.525; x += 6) { ctx.beginPath(); ctx.moveTo(x, H * 0.55); ctx.lineTo(x, H * 0.9); ctx.stroke(); }
        ctx.beginPath(); ctx.moveTo(W * 0.475, H * 0.6); ctx.lineTo(W * 0.525, H * 0.6); ctx.moveTo(W * 0.475, H * 0.82); ctx.lineTo(W * 0.525, H * 0.82); ctx.stroke();
        // Dos pilons de pedra als costats del portal
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
        [[0.08, 0.3], [0.62, 0.3]].forEach(([x, w2], i) => {
            ctx.fillStyle = '#9c957f'; ctx.fillRect(W * (i ? 0.66 : 0.1), H * 0.68, W * 0.24, H * 0.24); ctx.strokeRect(W * (i ? 0.66 : 0.1), H * 0.68, W * 0.24, H * 0.24);
            ctx.fillStyle = '#4f6a47'; ctx.fillRect(W * (i ? 0.675 : 0.115), H * 0.7, W * 0.21, H * 0.06); ctx.strokeRect(W * (i ? 0.675 : 0.115), H * 0.7, W * 0.21, H * 0.06);
            if (!i) { ctx.fillStyle = '#b8453a'; for (let k = 0; k < 7; k++) { ctx.beginPath(); ctx.arc(W * (0.13 + k * 0.03), H * 0.69, 3.2, 0, Math.PI * 2); ctx.fill(); } }
        });
    });
}

// Retaule barroc: gran retaule daurat amb columnes salomòniques, fornícules amb sants policromats, glòria amb coloma,
// predel·la amb dues portes i l'altar de marbre al davant
function dibuixarRetauleBarroc(c, w) {
    lienc(c, w, w * 1.05, (ctx, W, H) => {
        const or1 = '#e0b43a', or2 = '#f5d97a', or3 = '#9a6c14';
        ctx.lineWidth = 2.5; ctx.strokeStyle = '#3a2808'; ctx.lineJoin = 'round';
        const oro = (x0, y0, x1, y1) => { const g = ctx.createLinearGradient(W * x0, 0, W * x1, 0); g.addColorStop(0, or3); g.addColorStop(0.5, or2); g.addColorStop(1, or1); ctx.fillStyle = g; ctx.fillRect(W * x0, H * y0, W * (x1 - x0), H * (y1 - y0)); ctx.strokeRect(W * x0, H * y0, W * (x1 - x0), H * (y1 - y0)); };
        // Fons i volta de l'absis
        // Estructura: tres cossos
        oro(0.06, 0.26, 0.94, 0.9);
        ctx.fillStyle = or1; ctx.beginPath(); ctx.moveTo(W * 0.06, H * 0.26); ctx.quadraticCurveTo(W * 0.5, -H * 0.08, W * 0.94, H * 0.26); ctx.closePath(); ctx.fill(); ctx.stroke();   // arcada de coronament
        ctx.fillStyle = or2; ctx.beginPath(); ctx.moveTo(W * 0.2, H * 0.26); ctx.quadraticCurveTo(W * 0.5, H * 0.0, W * 0.8, H * 0.26); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Glòria: sol amb coloma i raigs
        ctx.fillStyle = '#fff2b0'; ctx.beginPath(); ctx.arc(W / 2, H * 0.19, W * 0.06, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = or3; ctx.lineWidth = 1.8;
        for (let a = 0; a < 16; a++) { const an = a * Math.PI / 8; ctx.beginPath(); ctx.moveTo(W / 2 + Math.cos(an) * W * 0.07, H * 0.19 + Math.sin(an) * W * 0.07); ctx.lineTo(W / 2 + Math.cos(an) * W * 0.11, H * 0.19 + Math.sin(an) * W * 0.11); ctx.stroke(); }
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.ellipse(W / 2, H * 0.19, W * 0.03, H * 0.014, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#3a2808'; ctx.lineWidth = 2.5;
        // Hornacina central i sagrari
        ctx.fillStyle = '#4a3010'; ctx.beginPath(); ctx.moveTo(W * 0.38, H * 0.78); ctx.lineTo(W * 0.38, H * 0.42); ctx.arc(W / 2, H * 0.42, W * 0.12, Math.PI, 0); ctx.lineTo(W * 0.62, H * 0.78); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fff6d0'; ctx.beginPath(); ctx.ellipse(W / 2, H * 0.55, W * 0.025, H * 0.06, 0, 0, Math.PI * 2); ctx.fill();
        oro(0.455, 0.76, 0.545, 0.86);
        // Columnes salomòniques i sants policromats
        [0.14, 0.23, 0.77, 0.86].forEach(x => {
            ctx.fillStyle = or2; ctx.fillRect(W * (x - 0.017), H * 0.36, W * 0.034, H * 0.42); ctx.strokeRect(W * (x - 0.017), H * 0.36, W * 0.034, H * 0.42);
            ctx.strokeStyle = or3; ctx.lineWidth = 1.6;
            for (let y = 0.38; y < 0.78; y += 0.04) { ctx.beginPath(); ctx.moveTo(W * (x - 0.017), H * y); ctx.lineTo(W * (x + 0.017), H * (y + 0.025)); ctx.stroke(); }
            ctx.strokeStyle = '#3a2808'; ctx.lineWidth = 2.5;
        });
        [[0.185, '#c4302c'], [0.30, '#3a6a9a'], [0.70, '#3a8a5a'], [0.815, '#c98a2c']].forEach(([x, col]) => {
            ctx.fillStyle = '#2c1c08'; ctx.fillRect(W * (x - 0.05), H * 0.44, W * 0.1, H * 0.3);
            ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(W * (x - 0.03), H * 0.72); ctx.lineTo(W * (x - 0.02), H * 0.52); ctx.lineTo(W * (x + 0.02), H * 0.52); ctx.lineTo(W * (x + 0.03), H * 0.72); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#e8b48a'; ctx.beginPath(); ctx.arc(W * x, H * 0.495, W * 0.014, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.strokeStyle = '#f2d060'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(W * x, H * 0.495, W * 0.024, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = '#3a2808'; ctx.lineWidth = 2.5;
        });
        // Cornisa intermèdia i predel·la amb dues portes
        oro(0.04, 0.34, 0.96, 0.375);
        oro(0.04, 0.855, 0.96, 0.9);
        [[0.1, 0.19], [0.71, 0.9]].forEach(([a, b]) => {
            ctx.fillStyle = '#2a1c0c'; ctx.beginPath(); ctx.moveTo(W * a, H * 0.9); ctx.lineTo(W * a, H * 0.8); ctx.arc(W * (a + b) / 2 * 0 + W * (a + 0.045), H * 0.8, W * 0.045, Math.PI, 0); ctx.lineTo(W * (a + 0.09), H * 0.9); ctx.closePath(); ctx.fill(); ctx.stroke();
        });
        ctx.fillStyle = or1; ctx.fillRect(0, H * 0.9, W, H * 0.02); ctx.strokeRect(0, H * 0.9, W, H * 0.02);
        // Altar de marbre al davant
        ctx.fillStyle = '#c99a78'; ctx.beginPath(); ctx.moveTo(W * 0.3, H * 1.0); ctx.lineTo(W * 0.34, H * 0.915); ctx.lineTo(W * 0.66, H * 0.915); ctx.lineTo(W * 0.7, H * 1.0); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#f4efe2'; ctx.fillRect(W * 0.33, H * 0.9, W * 0.34, H * 0.022); ctx.strokeRect(W * 0.33, H * 0.9, W * 0.34, H * 0.022);
    });
}

// Hostatgeria: gran bloc de pedra bruna amb cantoneres clares, teulada de poc pendent amb ràfec
// i una quadrícula de finestres petites amb persianes marrons; la porta, petita, a baix a l'esquerra del centre
function dibuixarHostatgeria(c, w) {
    lienc(c, w, w * 0.84, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 5, W * 0.5, 8);
        const wb = H - 8, roof = H * 0.17;
        ctx.lineJoin = 'round';
        carreus(ctx, W * 0.02, roof, W * 0.96, wb - roof, '#9a8260', H * 0.034, W * 0.045, 17);
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 4; ctx.strokeRect(W * 0.02, roof, W * 0.96, wb - roof);
        [W * 0.02, W * 0.94].forEach(x => { ctx.fillStyle = '#c4ad82'; ctx.fillRect(x, roof, W * 0.04, wb - roof); ctx.strokeRect(x, roof, W * 0.04, wb - roof); });
        // Teulada amb ràfec
        ctx.fillStyle = '#9a5a3a';
        ctx.beginPath(); ctx.moveTo(-W * 0.01, roof + H * 0.025); ctx.lineTo(W * 0.08, H * 0.04); ctx.lineTo(W * 0.92, H * 0.04); ctx.lineTo(W * 1.01, roof + H * 0.025); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(50,26,14,0.5)'; ctx.lineWidth = 1.5;
        for (let k = 1; k < 4; k++) { const y = H * 0.04 + (roof + H * 0.025 - H * 0.04) * k / 4; ctx.beginPath(); ctx.moveTo(W * 0.08 * (1 - k / 4), y); ctx.lineTo(W - W * 0.08 * (1 - k / 4), y); ctx.stroke(); }
        // Quadrícula de finestres amb persianes
        for (let f = 0; f < 4; f++) for (let k = 0; k < 8; k++) {
            if (f === 3 && (k === 2 || k === 3)) continue;           // espai de la porta
            const x = W * (0.1 + k * 0.105), y = H * (0.24 + f * 0.17);
            ctx.fillStyle = '#b3a07a'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 2.5; ctx.fillRect(x - 3, y - 3, W * 0.034 + 6, H * 0.095 + 6); ctx.strokeRect(x - 3, y - 3, W * 0.034 + 6, H * 0.095 + 6);
            ctx.fillStyle = '#6a3e24'; ctx.fillRect(x, y, W * 0.034, H * 0.095); ctx.strokeRect(x, y, W * 0.034, H * 0.095);
            ctx.strokeStyle = 'rgba(20,10,4,0.6)'; ctx.lineWidth = 1.2;
            for (let s = 1; s < 5; s++) { ctx.beginPath(); ctx.moveTo(x, y + H * 0.095 * s / 5); ctx.lineTo(x + W * 0.034, y + H * 0.095 * s / 5); ctx.stroke(); }
        }
        // Porta de la planta baixa, amb marc de pedra i dos fanals
        const px = W * 0.33 - W * 0.04, pt = H * 0.76, pw = W * 0.08;
        ctx.fillStyle = '#c4ad82'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3; ctx.fillRect(px - 5, pt - 6, pw + 10, wb - pt + 6); ctx.strokeRect(px - 5, pt - 6, pw + 10, wb - pt + 6);
        ctx.fillStyle = '#4a2c18'; ctx.fillRect(px, pt, pw, wb - pt); ctx.strokeRect(px, pt, pw, wb - pt);
        ctx.beginPath(); ctx.moveTo(px + pw / 2, pt); ctx.lineTo(px + pw / 2, wb); ctx.stroke();
        ctx.fillStyle = '#3a3a3e'; [px - 14, px + pw + 6].forEach(lx => { ctx.fillRect(lx, pt + 4, 8, 12); ctx.strokeRect(lx, pt + 4, 8, 12); });
    });
}

// Pilar de la processó (camí de la Desaparició): pilar baix de pedra tosca amb un plafó de rajoles ceràmiques incrustat
function dibuixarColumnaProcessio(c, w) {
    lienc(c, w, w * 2.0, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 5, W * 0.5, 6);
        ctx.lineJoin = 'round'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
        const x0 = W * 0.1, x1 = W * 0.9, base = H - 8, cim = H * 0.06;
        carreus(ctx, x0, cim, x1 - x0, base - cim, '#8f8a7c', H * 0.07, W * 0.3, 21);
        ctx.strokeRect(x0, cim, x1 - x0, base - cim);
        ctx.fillStyle = '#a8a292'; ctx.fillRect(W * 0.04, 0, W * 0.92, H * 0.06); ctx.strokeRect(W * 0.04, 0, W * 0.92, H * 0.06);   // coberta
        ctx.fillStyle = '#9a9486'; ctx.fillRect(W * 0.04, base - H * 0.05, W * 0.92, H * 0.05); ctx.strokeRect(W * 0.04, base - H * 0.05, W * 0.92, H * 0.05);   // sòcol
        // Plafó de rajoles amb vora groga i blava
        const px = W * 0.2, py = H * 0.17, pw = W * 0.6, ph = H * 0.56;
        ctx.fillStyle = '#e8b83a'; ctx.fillRect(px - 3, py - 3, pw + 6, ph + 6); ctx.strokeRect(px - 3, py - 3, pw + 6, ph + 6);
        ctx.fillStyle = '#2f5fa8'; ctx.fillRect(px, py, pw, ph);
        ctx.fillStyle = '#f2e9c8'; ctx.fillRect(px + 4, py + 4, pw - 8, ph - 8);
        ctx.fillStyle = '#7fb0d8'; ctx.beginPath(); ctx.ellipse(px + pw * 0.22, py + ph * 0.18, pw * 0.2, ph * 0.08, 0, 0, Math.PI * 2); ctx.fill();   // núvols
        ctx.beginPath(); ctx.ellipse(px + pw * 0.8, py + ph * 0.3, pw * 0.16, ph * 0.07, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#d98a2c'; ctx.beginPath(); ctx.arc(px + pw / 2, py + ph * 0.38, pw * 0.13, 0, Math.PI * 2); ctx.fill();        // pelegrí abstracte
        ctx.fillStyle = '#2f5fa8'; ctx.beginPath(); ctx.moveTo(px + pw * 0.5, py + ph * 0.5); ctx.lineTo(px + pw * 0.3, py + ph * 0.86); ctx.lineTo(px + pw * 0.7, py + ph * 0.86); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(40,40,60,0.35)'; ctx.lineWidth = 1;                                                                     // junts de rajola
        for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(px + pw * k / 4, py); ctx.lineTo(px + pw * k / 4, py + ph); ctx.moveTo(px, py + ph * k / 4); ctx.lineTo(px + pw, py + ph * k / 4); ctx.stroke(); }
    });
}

// Bastó vertical (cap a dalt) per si falta assets/basto.png
function dibuixarBastoProvisional(c, w) {
    c.width = w; c.height = Math.round(w * 4.25);
    const x = c.getContext('2d');
    x.strokeStyle = '#2a1a0e'; x.lineCap = 'round';
    x.lineWidth = w * 0.3; x.beginPath(); x.moveTo(w * 0.5, c.height); x.lineTo(w * 0.5, w * 0.6); x.stroke();
    x.strokeStyle = '#8a5a34'; x.lineWidth = w * 0.2; x.stroke();
}

// ---------------- MOBLES I OBJECTES DE FUSTA, MÉS DETALLATS ----------------
// Cada funció dibuixa en un llenç lògic w x h (ja escalat per l'amfitrió). Llum a dalt a l'esquerra.
const CONT_FUSTA = '#2a1608';

function pintarBarril(ctx, w, h) {
    ctx.lineJoin = 'round';
    const cx = w / 2, yDalt = 20, yBaix = h - 14, yMig = (yDalt + yBaix) / 2;
    const rExt = 21, rVentre = 28;
    const radi = y => { const t = (y - yMig) / ((yBaix - yDalt) / 2); return rExt + (rVentre - rExt) * (1 - t * t); };
    // Ombra del terra
    ctx.fillStyle = 'rgba(0,0,0,0.30)'; ctx.beginPath(); ctx.ellipse(cx + 3, h - 7, 29, 6, 0, 0, Math.PI * 2); ctx.fill();
    // Cos: costats bombats
    const cos = new Path2D();
    cos.moveTo(cx - rExt, yDalt); cos.quadraticCurveTo(cx - 2 * rVentre + rExt, yMig, cx - rExt, yBaix);
    cos.ellipse(cx, yBaix, rExt, 8, 0, Math.PI, 0, true);
    cos.quadraticCurveTo(cx + 2 * rVentre - rExt, yMig, cx + rExt, yDalt);
    cos.closePath();
    const g = ctx.createLinearGradient(cx - rVentre, 0, cx + rVentre, 0);
    g.addColorStop(0, '#4a2c14'); g.addColorStop(0.22, '#a8723a'); g.addColorStop(0.42, '#c89252'); g.addColorStop(0.75, '#8a5a2c'); g.addColorStop(1, '#3e2410');
    ctx.fillStyle = g; ctx.fill(cos);
    // Dogues: línies corbades de dalt a baix
    ctx.save(); ctx.clip(cos);
    for (let i = -6; i <= 6; i++) {
        const t = i / 6.4;
        ctx.strokeStyle = i % 2 ? 'rgba(40,20,6,0.55)' : 'rgba(40,20,6,0.32)'; ctx.lineWidth = i % 2 ? 1.2 : 0.8;
        ctx.beginPath(); ctx.moveTo(cx + rExt * t, yDalt); ctx.quadraticCurveTo(cx + (2 * rVentre - rExt) * t, yMig, cx + rExt * t, yBaix + 4); ctx.stroke();
    }
    // Veta de la fusta i un nus
    ctx.strokeStyle = 'rgba(255,225,170,0.25)'; ctx.lineWidth = 0.8;
    [[cx - 14, 36, cx - 12, 52], [cx - 6, 44, cx - 5, 60], [cx + 8, 32, cx + 9, 48]].forEach(([x0, y0, x1, y1]) => { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); });
    ctx.fillStyle = 'rgba(40,20,6,0.5)'; ctx.beginPath(); ctx.ellipse(cx + 12, 55, 2.4, 3.4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 2; ctx.stroke(cos);
    // Cèrcols de ferro seguint la panxa del barril
    [[yDalt + 7, 4.5], [yDalt + 19, 5], [yBaix - 19, 5], [yBaix - 6, 4.5]].forEach(([y, gruix]) => {
        const r = radi(y) - 2.2;
        ctx.strokeStyle = '#17171a'; ctx.lineWidth = gruix + 2.4;
        ctx.beginPath(); ctx.ellipse(cx, y, r, 7, 0, 0.03, Math.PI - 0.03); ctx.stroke();
        ctx.strokeStyle = '#4c4e56'; ctx.lineWidth = gruix;
        ctx.beginPath(); ctx.ellipse(cx, y, r, 7, 0, 0.05, Math.PI - 0.05); ctx.stroke();
        ctx.strokeStyle = 'rgba(210,214,224,0.65)'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.ellipse(cx, y - 0.8, r - 1.5, 7, 0, 0.5, 1.45); ctx.stroke();
        ctx.fillStyle = '#9a9ca4';
        [0.45, 1.15, 1.95, 2.65].forEach(a => { ctx.beginPath(); ctx.arc(cx + Math.cos(a) * (r - 2), y + Math.sin(a) * 6.3, 1, 0, Math.PI * 2); ctx.fill(); });
    });
    // Tapa de dalt: tauló, vora i broquet
    ctx.fillStyle = '#7a4a22'; ctx.beginPath(); ctx.ellipse(cx, yDalt, rExt + 1, 8.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 2; ctx.stroke();
    const tapa = ctx.createLinearGradient(cx - 18, yDalt - 7, cx + 18, yDalt + 7);
    tapa.addColorStop(0, '#e0b070'); tapa.addColorStop(1, '#b07a42');
    ctx.fillStyle = tapa; ctx.beginPath(); ctx.ellipse(cx, yDalt, rExt - 3, 6.3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.ellipse(cx, yDalt, rExt - 3, 6.3, 0, 0, Math.PI * 2); ctx.clip();
    ctx.strokeStyle = 'rgba(70,38,12,0.55)'; ctx.lineWidth = 1;
    for (let x = cx - 16; x <= cx + 16; x += 7) { ctx.beginPath(); ctx.moveTo(x, yDalt - 8); ctx.lineTo(x + 2, yDalt + 8); ctx.stroke(); }
    ctx.restore();
    ctx.strokeStyle = 'rgba(70,38,12,0.7)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(cx, yDalt, rExt - 3, 6.3, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#2a1608'; ctx.beginPath(); ctx.ellipse(cx + 7, yDalt + 1, 2.6, 1.4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,240,200,0.6)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(cx, yDalt, rExt - 5, 4.6, 0, 3.5, 4.5); ctx.stroke();
}

// Tronc de picar llenya amb una destral clavada, estelles i marques de cops
function pintarTroncDestral(ctx, w, h) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const cx = 44, yTop = 38, rx = 33, ry = 13, yBase = h - 12;
    ctx.fillStyle = 'rgba(0,0,0,0.30)'; ctx.beginPath(); ctx.ellipse(cx + 2, h - 7, 40, 7, 0, 0, Math.PI * 2); ctx.fill();
    // Estelles escampades
    [[8, h - 8, 0.4], [84, h - 9, -0.5], [74, h - 5, 0.9], [14, h - 4, -0.2]].forEach(([x, y, a]) => {
        ctx.save(); ctx.translate(x, y); ctx.rotate(a);
        ctx.fillStyle = '#d8a868'; ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(4, -2); ctx.lineTo(6, 1); ctx.lineTo(-3, 2); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.restore();
    });
    // Arrels que s'obren a la base
    const cos = new Path2D();
    cos.moveTo(cx - rx, yTop); cos.lineTo(cx - rx - 1, yBase - 10); cos.quadraticCurveTo(cx - rx - 9, yBase - 2, cx - rx - 12, yBase + 2);
    cos.quadraticCurveTo(cx - 20, yBase + 4, cx - 6, yBase + 3); cos.quadraticCurveTo(cx + 10, yBase + 6, cx + 24, yBase + 3);
    cos.quadraticCurveTo(cx + rx + 6, yBase + 3, cx + rx + 10, yBase + 1); cos.quadraticCurveTo(cx + rx + 6, yBase - 3, cx + rx + 1, yBase - 10);
    cos.lineTo(cx + rx, yTop); cos.closePath();
    const g = ctx.createLinearGradient(cx - rx, 0, cx + rx, 0);
    g.addColorStop(0, '#4a2c14'); g.addColorStop(0.28, '#8a5a30'); g.addColorStop(0.5, '#9a6a3a'); g.addColorStop(1, '#3e2410');
    ctx.fillStyle = g; ctx.fill(cos);
    ctx.save(); ctx.clip(cos);
    // Escorça: solcs verticals irregulars, un tros de molsa
    for (let i = 0; i < 16; i++) {
        const x = cx - rx + 4 + i * 4.2 + (i % 3);
        ctx.strokeStyle = i % 2 ? 'rgba(30,14,4,0.6)' : 'rgba(30,14,4,0.35)'; ctx.lineWidth = i % 2 ? 1.6 : 1;
        ctx.beginPath(); ctx.moveTo(x, yTop + 2); ctx.quadraticCurveTo(x + (i % 4) - 1.5, (yTop + yBase) / 2, x + (i % 3) - 1, yBase + 2); ctx.stroke();
        ctx.strokeStyle = 'rgba(210,160,100,0.18)'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(x + 2, yTop + 6); ctx.lineTo(x + 2.5, yTop + 22); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(96,140,56,0.75)';
    ctx.beginPath(); ctx.ellipse(cx - 20, yBase - 6, 8, 4, 0.2, 0, Math.PI * 2); ctx.ellipse(cx - 14, yBase - 9, 5, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 2; ctx.stroke(cos);
    // Cara de dalt, tallada: anells i escletxes radials
    ctx.fillStyle = '#7a4a22'; ctx.beginPath(); ctx.ellipse(cx, yTop, rx + 1.5, ry + 1.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 2; ctx.stroke();
    const cara = ctx.createRadialGradient(cx - 8, yTop - 3, 2, cx, yTop, rx);
    cara.addColorStop(0, '#ecc283'); cara.addColorStop(1, '#c8975a');
    ctx.fillStyle = cara; ctx.beginPath(); ctx.ellipse(cx, yTop, rx - 1.5, ry - 1.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(100,60,22,0.6)'; ctx.lineWidth = 0.9;
    for (let k = 1; k <= 5; k++) { ctx.beginPath(); ctx.ellipse(cx + 1, yTop, (rx - 2) - k * 5.6, (ry - 2) - k * 2.1, 0, 0, Math.PI * 2); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(90,50,18,0.7)'; ctx.lineWidth = 1;
    [[0.2, 28], [2.3, 22], [3.9, 25], [5.2, 20]].forEach(([a, l]) => { ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * 5, yTop + Math.sin(a) * 2); ctx.lineTo(cx + Math.cos(a) * l, yTop + Math.sin(a) * l * 0.4); ctx.stroke(); });
    // Marques de destral: tallets
    ctx.strokeStyle = 'rgba(60,32,10,0.8)'; ctx.lineWidth = 1.6;
    [[cx - 24, yTop - 3, cx - 14, yTop + 2], [cx - 20, yTop + 3, cx - 9, yTop + 6], [cx + 12, yTop + 5, cx + 24, yTop + 1]].forEach(([a, b, c, d]) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); });

    // Destral clavada a la cara: mànec de pomer amb vetes i fulla de ferro bisellada
    const mx0 = cx + 8, my0 = yTop - 2, mx1 = cx + 30, my1 = 3;
    ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(mx0, my0); ctx.quadraticCurveTo(cx + 22, 18, mx1, my1); ctx.stroke();
    ctx.strokeStyle = '#a56d36'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(mx0, my0); ctx.quadraticCurveTo(cx + 22, 18, mx1, my1); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,215,150,0.55)'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(mx0 - 1, my0 - 1); ctx.quadraticCurveTo(cx + 21, 17, mx1 - 1, my1 + 1); ctx.stroke();
    ctx.strokeStyle = 'rgba(60,30,8,0.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(mx0 + 2, my0 - 1); ctx.quadraticCurveTo(cx + 24, 19, mx1 + 1, my1 + 2); ctx.stroke();
    ctx.fillStyle = '#7a4a22'; ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(mx1, my1, 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();    // pom del mànec
    // Cap de la destral
    ctx.fillStyle = '#74787e';
    ctx.beginPath(); ctx.moveTo(cx + 3, yTop - 4); ctx.lineTo(cx + 13, yTop - 12); ctx.lineTo(cx + 17, yTop - 6); ctx.lineTo(cx + 15, yTop + 1); ctx.lineTo(cx + 6, yTop + 4); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 2; ctx.stroke();
    const fulla = ctx.createLinearGradient(cx - 6, 0, cx + 10, 0); fulla.addColorStop(0, '#d9dde4'); fulla.addColorStop(1, '#8e939c');
    ctx.fillStyle = fulla; ctx.beginPath(); ctx.moveTo(cx - 8, yTop - 14); ctx.lineTo(cx + 5, yTop - 10); ctx.lineTo(cx + 5, yTop + 3); ctx.lineTo(cx - 6, yTop + 4); ctx.quadraticCurveTo(cx - 3, yTop - 5, cx - 8, yTop - 14); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 1.8; ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(cx - 6.5, yTop - 11); ctx.quadraticCurveTo(cx - 2, yTop - 5, cx - 4.5, yTop + 2); ctx.stroke();
    ctx.fillStyle = '#4e5258'; ctx.beginPath(); ctx.arc(cx + 10, yTop - 4, 1.4, 0, Math.PI * 2); ctx.fill();
}

// Cofre de fusta amb tapa bombada, bandes de ferro, reblons i pany daurat
function pintarCofre(ctx, w, h) {
    ctx.lineJoin = 'round';
    const x0 = 5, x1 = w - 5, yCos = h * 0.46, yBaix = h - 7, yTapa = h * 0.08;
    ctx.fillStyle = 'rgba(0,0,0,0.30)'; ctx.beginPath(); ctx.ellipse(w / 2 + 2, h - 4, w * 0.46, 5, 0, 0, Math.PI * 2); ctx.fill();
    // Cos: fusta a taulons
    const g = ctx.createLinearGradient(0, yCos, 0, yBaix);
    g.addColorStop(0, '#9a6430'); g.addColorStop(1, '#6a4020');
    ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x0, yCos, x1 - x0, yBaix - yCos, 2); ctx.fill();
    ctx.strokeStyle = 'rgba(40,20,6,0.6)'; ctx.lineWidth = 1;
    const mid = (yCos + yBaix) / 2;
    ctx.beginPath(); ctx.moveTo(x0 + 1, mid); ctx.lineTo(x1 - 1, mid); ctx.stroke();
    for (let x = x0 + 12; x < x1 - 8; x += 17) { ctx.beginPath(); ctx.moveTo(x, mid - 2); ctx.lineTo(x + 6, mid - 2); ctx.moveTo(x + 8, mid + 4); ctx.lineTo(x + 14, mid + 4); ctx.stroke(); }
    ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.roundRect(x0, yCos, x1 - x0, yBaix - yCos, 2); ctx.stroke();
    // Tapa bombada
    const tapa = new Path2D();
    tapa.moveTo(x0, yCos + 1); tapa.lineTo(x0, yCos - 5); tapa.quadraticCurveTo(w / 2, yTapa - 14, x1, yCos - 5); tapa.lineTo(x1, yCos + 1); tapa.closePath();
    const gt = ctx.createLinearGradient(0, yTapa, 0, yCos);
    gt.addColorStop(0, '#d29a58'); gt.addColorStop(0.5, '#b07a42'); gt.addColorStop(1, '#8a5a2c');
    ctx.fillStyle = gt; ctx.fill(tapa);
    ctx.save(); ctx.clip(tapa);
    ctx.strokeStyle = 'rgba(50,26,8,0.5)'; ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x0, yCos - 5 - i * 5); ctx.quadraticCurveTo(w / 2, yTapa - 14 - i * 5 + 8, x1, yCos - 5 - i * 5); ctx.stroke(); }
    ctx.restore();
    ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 2.2; ctx.stroke(tapa);
    // Bandes de ferro verticals (seguint la corba de la tapa) amb reblons
    [x0 + 7, x1 - 7].forEach(x => {
        ctx.fillStyle = '#4a4c54'; ctx.fillRect(x - 4, yCos - 6, 8, yBaix - yCos + 6);
        ctx.fillStyle = '#6a6c76'; ctx.fillRect(x - 4, yCos - 6, 3, yBaix - yCos + 6);
        ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 1.6; ctx.strokeRect(x - 4, yCos - 6, 8, yBaix - yCos + 6);
        ctx.fillStyle = '#b0b2ba';
        [yCos - 2, yCos + 9, yBaix - 6].forEach(y => { ctx.beginPath(); ctx.arc(x, y, 1.3, 0, Math.PI * 2); ctx.fill(); });
    });
    ctx.fillStyle = '#3e4048'; ctx.fillRect(x0, yCos - 1, x1 - x0, 4); ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 1.4; ctx.strokeRect(x0, yCos - 1, x1 - x0, 4);
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(x0 + 1, yCos, x1 - x0 - 2, 1);
    // Pany daurat amb forat de clau
    const px = w / 2, py = yCos + 4;
    const gp = ctx.createLinearGradient(px - 7, py - 6, px + 7, py + 10); gp.addColorStop(0, '#f6dc7a'); gp.addColorStop(1, '#b8892a');
    ctx.fillStyle = gp; ctx.beginPath(); ctx.roundRect(px - 7, py - 6, 14, 17, 3); ctx.fill();
    ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 1.8; ctx.stroke();
    ctx.fillStyle = '#1c1008'; ctx.beginPath(); ctx.arc(px, py + 1.5, 2.2, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(px - 1, py + 2, 2, 5);
    ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(px - 5, py - 4.5, 5, 1.4);
}

// Gerros i pots d'argila i vidre. tipus: 0 àmfora amb nanses, 1 pot panxut amb tap, 2 ampolla de vidre amb brou verd
function pintarGerro(ctx, w, h, tipus) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const cx = w / 2;
    ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.beginPath(); ctx.ellipse(cx + 1.5, h - 3, w * 0.38, 3, 0, 0, Math.PI * 2); ctx.fill();
    if (tipus === 0) {
        const cos = new Path2D();
        cos.moveTo(cx - 4, 7); cos.quadraticCurveTo(cx - 5, 13, cx - 11, 18); cos.quadraticCurveTo(cx - 14, 30, cx - 7, h - 5);
        cos.lineTo(cx + 7, h - 5); cos.quadraticCurveTo(cx + 14, 30, cx + 11, 18); cos.quadraticCurveTo(cx + 5, 13, cx + 4, 7); cos.closePath();
        ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 3.2;
        ctx.beginPath(); ctx.moveTo(cx - 8, 14); ctx.bezierCurveTo(cx - 20, 12, cx - 20, 26, cx - 12, 24); ctx.moveTo(cx + 8, 14); ctx.bezierCurveTo(cx + 20, 12, cx + 20, 26, cx + 12, 24); ctx.stroke();
        ctx.strokeStyle = '#a05a2c'; ctx.lineWidth = 1.6; ctx.stroke();
        const g = ctx.createLinearGradient(cx - 14, 0, cx + 14, 0); g.addColorStop(0, '#8a4420'); g.addColorStop(0.35, '#d08048'); g.addColorStop(1, '#6a3016');
        ctx.fillStyle = g; ctx.fill(cos); ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 1.8; ctx.stroke(cos);
        ctx.fillStyle = '#b86a38'; ctx.beginPath(); ctx.ellipse(cx, 6, 6, 2.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#1c0e06'; ctx.beginPath(); ctx.ellipse(cx, 6, 3.8, 1.3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(40,16,4,0.55)'; ctx.lineWidth = 1.2;      // bandes decoratives
        ctx.beginPath(); ctx.moveTo(cx - 11.5, 21); ctx.quadraticCurveTo(cx, 25, cx + 11.5, 21); ctx.moveTo(cx - 11, 28); ctx.quadraticCurveTo(cx, 32, cx + 11, 28); ctx.stroke();
        ctx.fillStyle = 'rgba(255,230,190,0.5)'; ctx.beginPath(); ctx.ellipse(cx - 6, 22, 1.4, 6, 0.1, 0, Math.PI * 2); ctx.fill();
    } else if (tipus === 1) {
        const cos = new Path2D();
        cos.moveTo(cx - 6, 8); cos.lineTo(cx - 6, 11); cos.quadraticCurveTo(cx - 15, 14, cx - 14, 26); cos.quadraticCurveTo(cx - 13, h - 5, cx - 6, h - 4);
        cos.lineTo(cx + 6, h - 4); cos.quadraticCurveTo(cx + 13, h - 5, cx + 14, 26); cos.quadraticCurveTo(cx + 15, 14, cx + 6, 11); cos.lineTo(cx + 6, 8); cos.closePath();
        const g = ctx.createLinearGradient(cx - 14, 0, cx + 14, 0); g.addColorStop(0, '#5a6a40'); g.addColorStop(0.35, '#9ab070'); g.addColorStop(1, '#3e4a2a');
        ctx.fillStyle = g; ctx.fill(cos); ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 1.8; ctx.stroke(cos);
        ctx.fillStyle = '#c8b27a'; ctx.beginPath(); ctx.roundRect(cx - 5, 3, 10, 7, 2); ctx.fill(); ctx.stroke();     // tap de suro
        ctx.strokeStyle = 'rgba(90,60,20,0.6)'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(cx - 3, 4.5); ctx.lineTo(cx - 3, 8.5); ctx.moveTo(cx + 2, 4.5); ctx.lineTo(cx + 2, 8.5); ctx.stroke();
        ctx.fillStyle = '#e8dcb4'; ctx.beginPath(); ctx.roundRect(cx - 8, 20, 16, 12, 1.5); ctx.fill(); ctx.strokeStyle = '#4a3a1c'; ctx.lineWidth = 1; ctx.stroke();      // etiqueta
        ctx.strokeStyle = '#7a5a2a'; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(cx - 5.5, 24); ctx.lineTo(cx + 5.5, 24); ctx.moveTo(cx - 5.5, 27.5); ctx.lineTo(cx + 3, 27.5); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.ellipse(cx - 10, 24, 1.4, 6, 0.1, 0, Math.PI * 2); ctx.fill();
    } else {
        const cos = new Path2D();
        cos.moveTo(cx - 3, 5); cos.lineTo(cx - 3, 14); cos.quadraticCurveTo(cx - 12, 18, cx - 11, 29); cos.quadraticCurveTo(cx - 10, h - 4, cx - 5, h - 4);
        cos.lineTo(cx + 5, h - 4); cos.quadraticCurveTo(cx + 10, h - 4, cx + 11, 29); cos.quadraticCurveTo(cx + 12, 18, cx + 3, 14); cos.lineTo(cx + 3, 5); cos.closePath();
        ctx.fillStyle = 'rgba(176,222,206,0.55)'; ctx.fill(cos);
        ctx.save(); ctx.clip(cos);
        const brou = ctx.createLinearGradient(0, 22, 0, h); brou.addColorStop(0, '#9ae060'); brou.addColorStop(1, '#3c8a2c');
        ctx.fillStyle = brou; ctx.fillRect(cx - 12, 24, 24, h);
        ctx.fillStyle = 'rgba(230,255,200,0.7)'; [[cx - 3, 32, 1.6], [cx + 3, 38, 1.2], [cx, 29, 1]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); });
        ctx.restore();
        ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 1.8; ctx.stroke(cos);
        ctx.fillStyle = 'rgba(255,255,255,0.65)'; ctx.beginPath(); ctx.ellipse(cx - 7, 28, 1.3, 7, 0.1, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#b79a62'; ctx.beginPath(); ctx.roundRect(cx - 4, 1, 8, 6, 1.5); ctx.fill(); ctx.stroke();
    }
}

// Olla de ferro sobre el foc, amb un brou verd bullint
function pintarOlla(ctx, w, h) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const cx = w / 2;
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(cx, h - 6, w * 0.42, 8, 0, 0, Math.PI * 2); ctx.fill();
    // Brases i pedres del foc
    const foc = ctx.createRadialGradient(cx, h - 16, 2, cx, h - 16, w * 0.42);
    foc.addColorStop(0, 'rgba(255,240,150,0.95)'); foc.addColorStop(0.5, 'rgba(255,140,40,0.7)'); foc.addColorStop(1, 'rgba(255,60,0,0)');
    ctx.fillStyle = foc; ctx.beginPath(); ctx.ellipse(cx, h - 18, w * 0.42, h * 0.16, 0, 0, Math.PI * 2); ctx.fill();
    [[cx - 34, h - 13, 9, 6], [cx + 30, h - 13, 9, 6], [cx - 6, h - 9, 8, 5], [cx + 12, h - 10, 7, 5]].forEach(([x, y, rx, ry]) => {
        ctx.fillStyle = '#6a6862'; ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.ellipse(x - 2, y - 2, rx * 0.5, ry * 0.4, 0, 0, Math.PI * 2); ctx.fill();
    });
    // Flames
    [[cx - 24, 0.8], [cx - 8, 1.2], [cx + 10, 1], [cx + 26, 0.75]].forEach(([x, e]) => {
        ctx.fillStyle = '#ff9a30'; ctx.beginPath(); ctx.moveTo(x - 5 * e, h - 14); ctx.quadraticCurveTo(x - 6 * e, h - 26 * e, x, h - 34 * e); ctx.quadraticCurveTo(x + 6 * e, h - 24 * e, x + 5 * e, h - 14); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#ffe070'; ctx.beginPath(); ctx.moveTo(x - 2.5 * e, h - 14); ctx.quadraticCurveTo(x - 3 * e, h - 21 * e, x, h - 25 * e); ctx.quadraticCurveTo(x + 3 * e, h - 20 * e, x + 2.5 * e, h - 14); ctx.closePath(); ctx.fill();
    });
    // Cos de ferro panxut
    const yTop = h * 0.3, yMig = h * 0.52;
    const cos = new Path2D();
    cos.moveTo(cx - w * 0.36, yTop + 4); cos.bezierCurveTo(cx - w * 0.5, yMig, cx - w * 0.44, h - 26, cx - w * 0.16, h - 22);
    cos.lineTo(cx + w * 0.16, h - 22); cos.bezierCurveTo(cx + w * 0.44, h - 26, cx + w * 0.5, yMig, cx + w * 0.36, yTop + 4); cos.closePath();
    const g = ctx.createLinearGradient(cx - w * 0.5, 0, cx + w * 0.5, 0); g.addColorStop(0, '#16161a'); g.addColorStop(0.3, '#4a4c56'); g.addColorStop(0.5, '#34353c'); g.addColorStop(1, '#101014');
    ctx.fillStyle = g; ctx.fill(cos); ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 2.4; ctx.stroke(cos);
    ctx.strokeStyle = 'rgba(200,205,220,0.45)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - w * 0.32, yTop + 14); ctx.quadraticCurveTo(cx - w * 0.4, yMig + 2, cx - w * 0.28, yMig + 18); ctx.stroke();
    ctx.strokeStyle = '#2a2a2e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - w * 0.43, yMig - 8); ctx.quadraticCurveTo(cx, yMig - 3, cx + w * 0.43, yMig - 8); ctx.stroke();      // cèrcol al ventre
    // Nanses
    ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(cx - w * 0.38, yTop + 12, 6, Math.PI * 0.6, Math.PI * 1.8); ctx.moveTo(cx + w * 0.44, yTop + 8); ctx.arc(cx + w * 0.38, yTop + 12, 6, Math.PI * 1.2, Math.PI * 2.4); ctx.stroke();
    // Brou verd i vora
    ctx.fillStyle = '#1c1c20'; ctx.beginPath(); ctx.ellipse(cx, yTop + 2, w * 0.37, h * 0.1, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 2.4; ctx.stroke();
    const brou = ctx.createRadialGradient(cx - 6, yTop, 2, cx, yTop + 2, w * 0.33); brou.addColorStop(0, '#d4ff90'); brou.addColorStop(1, '#4e9a34');
    ctx.fillStyle = brou; ctx.beginPath(); ctx.ellipse(cx, yTop + 3, w * 0.32, h * 0.075, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(235,255,200,0.85)'; [[cx - 12, yTop + 1, 3], [cx + 8, yTop + 4, 2.4], [cx + 18, yTop + 1, 1.8], [cx - 2, yTop + 5, 1.6]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = 'rgba(40,90,20,0.6)'; ctx.lineWidth = 0.8; ctx.stroke(); });
    ctx.fillStyle = 'rgba(190,255,150,0.4)'; [[cx - 6, yTop - 10, 3], [cx + 6, yTop - 17, 2.4]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); });
}

// ---------------- ALTAR DE PEDRA I PERGAMÍ ----------------

// Altar de pedra amb mantell de lli, dos canelobres de llautó, un calze i un llibre obert. Vista frontal.
function pintarAltarPedra(ctx, w, h) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.translate(0, 18); h -= 18;                  // marge a dalt per a les flames
    const cx = w / 2, C = '#2a1c10';
    ctx.fillStyle = 'rgba(0,0,0,0.32)'; ctx.beginPath(); ctx.ellipse(cx + 3, h - 3, w * 0.5, 6, 0, 0, Math.PI * 2); ctx.fill();
    const pedra = (x, y, ww, hh, clar, fosc) => {
        const g = ctx.createLinearGradient(x, y, x + ww, y + hh); g.addColorStop(0, clar); g.addColorStop(1, fosc);
        ctx.fillStyle = g; ctx.fillRect(x, y, ww, hh); ctx.strokeStyle = C; ctx.lineWidth = 1.8; ctx.strokeRect(x, y, ww, hh);
    };
    // Graó del peu (dues lloses)
    pedra(6, h - 17, w - 12, 15, '#c8c0b0', '#8e877a');
    ctx.strokeStyle = 'rgba(40,34,26,0.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx, h - 17); ctx.lineTo(cx, h - 2); ctx.moveTo(6 + (w - 12) * 0.28, h - 17); ctx.lineTo(6 + (w - 12) * 0.28, h - 2); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(8, h - 16, w - 16, 2);
    // Sòcol amb motllura
    pedra(14, h - 27, w - 28, 11, '#b8b0a0', '#7e776b');
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(16, h - 26, w - 32, 1.6);
    // Cos de l'altar: carreus, amb un plafó en relleu al mig
    const x0 = 20, x1 = w - 20, yTop = 38, yBot = h - 27;
    pedra(x0, yTop, x1 - x0, yBot - yTop, '#d2cab8', '#9a9384');
    ctx.save(); ctx.beginPath(); ctx.rect(x0 + 1, yTop + 1, x1 - x0 - 2, yBot - yTop - 2); ctx.clip();
    ctx.strokeStyle = 'rgba(50,42,32,0.5)'; ctx.lineWidth = 1;
    for (let r = 0; r < 3; r++) {
        const y = yTop + 9 + r * 11; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
        for (let x = x0 + (r % 2 ? 18 : 6); x < x1; x += 24) { ctx.beginPath(); ctx.moveTo(x, y - 11); ctx.lineTo(x, y); ctx.stroke(); }
    }
    ctx.restore();
    const px0 = cx - 34, pw = 68, py0 = yTop + 5, ph = yBot - yTop - 10;
    ctx.fillStyle = '#b9b09e'; ctx.beginPath(); ctx.roundRect(px0, py0, pw, ph, 4); ctx.fill(); ctx.strokeStyle = C; ctx.lineWidth = 1.8; ctx.stroke();
    ctx.fillStyle = '#a49b88'; ctx.beginPath(); ctx.roundRect(px0 + 4, py0 + 4, pw - 8, ph - 8, 3); ctx.fill(); ctx.strokeStyle = 'rgba(40,34,26,0.7)'; ctx.lineWidth = 1.2; ctx.stroke();
    // Creu amb cercle (relleu tallat)
    const ccx = cx, ccy = py0 + ph / 2;
    ctx.strokeStyle = 'rgba(60,50,38,0.85)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ccx, ccy, 10, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ccx, ccy - 10); ctx.lineTo(ccx, ccy + 10); ctx.moveTo(ccx - 10, ccy); ctx.lineTo(ccx + 10, ccy); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ccx - 1, ccy - 9); ctx.lineTo(ccx - 1, ccy + 9); ctx.moveTo(ccx - 9, ccy - 1); ctx.lineTo(ccx + 9, ccy - 1); ctx.stroke();
    // Cornisa
    pedra(x0 - 7, yTop - 8, x1 - x0 + 14, 9, '#e0d8c6', '#a69e8e');
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(x0 - 5, yTop - 7, x1 - x0 + 10, 1.8);
    // Mantell de lli que penja pel davant, amb vora daurada i serrells
    const mx0 = cx - 38, mx1 = cx + 38, my0 = yTop - 8, my1 = yTop + 22;
    ctx.fillStyle = '#f2ecdc'; ctx.beginPath(); ctx.moveTo(mx0, my0); ctx.lineTo(mx1, my0); ctx.lineTo(mx1 + 1, my1);
    for (let i = 0; i <= 8; i++) { const x = mx1 - (mx1 - mx0) * i / 8; ctx.lineTo(x, my1 + (i % 2 ? 2.5 : 0)); }
    ctx.closePath(); ctx.fill(); ctx.strokeStyle = C; ctx.lineWidth = 1.6; ctx.stroke();
    ctx.strokeStyle = 'rgba(150,140,120,0.5)'; ctx.lineWidth = 1;
    [-18, 0, 18].forEach(dx => { ctx.beginPath(); ctx.moveTo(cx + dx, my0 + 3); ctx.quadraticCurveTo(cx + dx + 3, my0 + 14, cx + dx, my1 - 3); ctx.stroke(); });
    ctx.fillStyle = '#d4a93a'; ctx.fillRect(mx0 + 1, my1 - 6, mx1 - mx0 - 2, 3); ctx.strokeStyle = '#7a5a18'; ctx.lineWidth = 0.8; ctx.strokeRect(mx0 + 1, my1 - 6, mx1 - mx0 - 2, 3);
    ctx.fillStyle = '#b8892a'; for (let x = mx0 + 4; x < mx1; x += 5) ctx.fillRect(x, my1 + 1, 1.4, 4);
    ctx.strokeStyle = '#a02830'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, my0 + 8); ctx.lineTo(cx, my0 + 16); ctx.moveTo(cx - 4, my0 + 11); ctx.lineTo(cx + 4, my0 + 11); ctx.stroke();      // creu brodada
    // Taula de dalt (cara superior, en perspectiva)
    ctx.fillStyle = '#e8e0cc'; ctx.beginPath(); ctx.moveTo(x0 - 5, my0 - 1); ctx.lineTo(x0 + 3, my0 - 9); ctx.lineTo(x1 - 3, my0 - 9); ctx.lineTo(x1 + 5, my0 - 1); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C; ctx.lineWidth = 1.6; ctx.stroke();
    ctx.fillStyle = '#f7f2e4'; ctx.beginPath(); ctx.moveTo(x0 + 2, my0 - 2); ctx.lineTo(x0 + 8, my0 - 8); ctx.lineTo(x1 - 8, my0 - 8); ctx.lineTo(x1 - 2, my0 - 2); ctx.closePath(); ctx.fill();
    // Canelobres de llautó amb flama
    const canelobre = x => {
        const yb = my0 - 4;
        ctx.fillStyle = '#f7f0d0'; ctx.fillRect(x - 2.4, yb - 24, 4.8, 17); ctx.strokeStyle = '#8a7a50'; ctx.lineWidth = 0.9; ctx.strokeRect(x - 2.4, yb - 24, 4.8, 17);
        const g = ctx.createLinearGradient(x - 6, 0, x + 6, 0); g.addColorStop(0, '#9a7020'); g.addColorStop(0.45, '#f2d070'); g.addColorStop(1, '#7a5612');
        ctx.fillStyle = g; ctx.strokeStyle = C; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(x - 6, yb + 1); ctx.lineTo(x - 3, yb - 8); ctx.lineTo(x + 3, yb - 8); ctx.lineTo(x + 6, yb + 1); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillRect(x - 4, yb - 10, 8, 3); ctx.strokeRect(x - 4, yb - 10, 8, 3);
        const f = ctx.createRadialGradient(x, yb - 31, 0.5, x, yb - 31, 12); f.addColorStop(0, 'rgba(255,230,140,0.8)'); f.addColorStop(1, 'rgba(255,170,60,0)');
        ctx.fillStyle = f; ctx.beginPath(); ctx.arc(x, yb - 31, 12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffae38'; ctx.beginPath(); ctx.moveTo(x - 2.6, yb - 25); ctx.quadraticCurveTo(x - 3.2, yb - 31, x, yb - 37); ctx.quadraticCurveTo(x + 3.2, yb - 31, x + 2.6, yb - 25); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#fff0a0'; ctx.beginPath(); ctx.moveTo(x - 1.2, yb - 25); ctx.quadraticCurveTo(x - 1.4, yb - 29, x, yb - 33); ctx.quadraticCurveTo(x + 1.4, yb - 29, x + 1.2, yb - 25); ctx.closePath(); ctx.fill();
    };
    canelobre(cx - 46); canelobre(cx + 46);
    // Calze daurat i llibre obert
    const yb = my0 - 5;
    const gc = ctx.createLinearGradient(cx - 6, 0, cx + 6, 0); gc.addColorStop(0, '#9a7020'); gc.addColorStop(0.45, '#f6da7c'); gc.addColorStop(1, '#7a5612');
    ctx.fillStyle = gc; ctx.strokeStyle = C; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(cx - 6, yb); ctx.lineTo(cx + 6, yb); ctx.lineTo(cx + 2, yb - 5); ctx.lineTo(cx + 1.4, yb - 12); ctx.lineTo(cx - 1.4, yb - 12); ctx.lineTo(cx - 2, yb - 5); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - 7, yb - 12); ctx.quadraticCurveTo(cx - 7, yb - 21, cx, yb - 21); ctx.quadraticCurveTo(cx + 7, yb - 21, cx + 7, yb - 12); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillRect(cx - 4.6, yb - 19, 1.6, 5);
    ctx.fillStyle = '#7a1c24'; ctx.strokeStyle = C; ctx.lineWidth = 1.2; ctx.fillRect(cx + 14, yb - 4, 22, 4); ctx.strokeRect(cx + 14, yb - 4, 22, 4);      // llibre sobre un faristol baix
    ctx.fillStyle = '#efe4c0'; ctx.beginPath(); ctx.moveTo(cx + 14, yb - 4); ctx.lineTo(cx + 25, yb - 9); ctx.lineTo(cx + 36, yb - 4); ctx.closePath(); ctx.fill(); ctx.stroke();
}

// Pergamí cargolat pels dos extrems, amb text, caplletra i un segell de cera amb cinta
function pintarPergami(ctx, w, h) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const C = '#2a1608', yMig = h / 2;
    ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.beginPath(); ctx.ellipse(w / 2 + 1, h - 2, w * 0.46, 2.4, 0, 0, Math.PI * 2); ctx.fill();
    // Full: vores una mica irregulars
    const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#f2e4b4'); g.addColorStop(1, '#d8c284');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(9, 4);
    for (let x = 9; x <= w - 9; x += (w - 18) / 8) ctx.lineTo(x, 3.4 + ((x * 7) % 3) * 0.4);
    ctx.lineTo(w - 9, h - 5);
    for (let x = w - 9; x >= 9; x -= (w - 18) / 8) ctx.lineTo(x, h - 4.2 - ((x * 5) % 3) * 0.4);
    ctx.closePath(); ctx.fill(); ctx.strokeStyle = C; ctx.lineWidth = 1.3; ctx.stroke();
    ctx.fillStyle = 'rgba(120,80,30,0.18)'; ctx.fillRect(10, 4, w - 20, 3); ctx.fillRect(10, h - 8, w - 20, 3);
    // Text: línies de lletra, amb una caplletra vermella
    ctx.strokeStyle = '#4a3418'; ctx.lineWidth = 1;
    for (let r = 0; r < 4; r++) {
        const y = 8 + r * ((h - 18) / 3.2);
        ctx.beginPath(); ctx.moveTo(r === 0 ? 20 : 13, y); ctx.lineTo(w - 14 - ((r * 11) % 7), y); ctx.stroke();
    }
    ctx.fillStyle = '#a02830'; ctx.fillRect(12, 6.5, 6, 6);
    ctx.fillStyle = '#e8c860'; ctx.fillRect(13.6, 8, 2.8, 2.8);
    // Segell de cera i cinta vermella
    ctx.strokeStyle = '#9a2430'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(w - 15, h - 8); ctx.quadraticCurveTo(w - 20, h - 2, w - 24, h - 3); ctx.moveTo(w - 15, h - 8); ctx.quadraticCurveTo(w - 13, h - 1, w - 10, h - 2); ctx.stroke();
    ctx.fillStyle = '#b02a34'; ctx.beginPath(); ctx.arc(w - 15, h - 9, 3.6, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#5a1018'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = 'rgba(255,200,200,0.55)'; ctx.beginPath(); ctx.arc(w - 16, h - 10, 1.2, 0, Math.PI * 2); ctx.fill();
    // Rotlles als extrems
    [[6, 1], [w - 6, -1]].forEach(([x, s]) => {
        const r = ctx.createLinearGradient(x - 6, 0, x + 6, 0); r.addColorStop(0, s > 0 ? '#a8864a' : '#e6cf92'); r.addColorStop(0.5, '#f4e6b2'); r.addColorStop(1, s > 0 ? '#e6cf92' : '#a8864a');
        ctx.fillStyle = r; ctx.beginPath(); ctx.roundRect(x - 4.6, 1.5, 9.2, h - 3.5, 4.6); ctx.fill(); ctx.strokeStyle = C; ctx.lineWidth = 1.3; ctx.stroke();
        ctx.strokeStyle = 'rgba(110,76,30,0.7)'; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.ellipse(x - s * 1.2, yMig, 2.4, (h - 12) / 2, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#7a5a2a'; ctx.strokeStyle = C; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, 1.6, 2.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();     // pom de fusta
    });
}

// ---------------- EL CELLER: terra de ciment, paret de pedra i taules de ping-pong ----------------

// Ciment sense rajoles: soroll fi, clapes suaus i pedretes del mateix color que el terra. Es repeteix sense costures.
function pintarCiment(ctx, w, h) {
    let llavor = 41;
    const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
    ctx.fillStyle = '#8b8984'; ctx.fillRect(0, 0, w, h);
    const embolcall = (x, y, r, f) => { for (const dx of [-w, 0, w]) for (const dy of [-h, 0, h]) { const X = x + dx, Y = y + dy; if (X > -r && X < w + r && Y > -r && Y < h + r) f(X, Y); } };
    // Clapes suaus de to (ciment mullat, pols, fregats)
    for (let i = 0; i < 26; i++) {
        const x = rnd() * w, y = rnd() * h, r = 30 + rnd() * 60, clar = rnd() < 0.5;
        embolcall(x, y, r, (X, Y) => {
            const g = ctx.createRadialGradient(X, Y, 0, X, Y, r);
            g.addColorStop(0, clar ? 'rgba(255,255,255,0.07)' : 'rgba(30,28,24,0.08)'); g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g; ctx.fillRect(X - r, Y - r, r * 2, r * 2);
        });
    }
    // Gra fi
    for (let i = 0; i < 1500; i++) {
        const x = rnd() * w, y = rnd() * h, c = rnd();
        ctx.fillStyle = c < 0.5 ? 'rgba(40,38,34,0.16)' : c < 0.85 ? 'rgba(255,255,250,0.13)' : 'rgba(30,28,24,0.28)';
        ctx.fillRect(x, y, 1, 1);
    }
    // Pedretes petites, del mateix color que el terra (només una mica més clares o fosques)
    for (let i = 0; i < 70; i++) {
        const x = rnd() * w, y = rnd() * h, rx = 1.1 + rnd() * 2.2, ry = rx * (0.6 + rnd() * 0.3), a = rnd() * 3, t = rnd();
        const L = t < 0.5 ? 150 + rnd() * 18 : 118 + rnd() * 18;
        embolcall(x, y, 6, (X, Y) => {
            ctx.fillStyle = 'rgba(25,23,20,0.30)'; ctx.beginPath(); ctx.ellipse(X + 0.9, Y + 0.9, rx, ry, a, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = `rgb(${L},${L - 2},${L - 6})`; ctx.beginPath(); ctx.ellipse(X, Y, rx, ry, a, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.beginPath(); ctx.ellipse(X - rx * 0.25, Y - ry * 0.3, rx * 0.45, ry * 0.35, a, 0, Math.PI * 2); ctx.fill();
        });
    }
    // Un parell d'esquerdes fines que no toquen la vora
    ctx.strokeStyle = 'rgba(40,38,34,0.35)'; ctx.lineWidth = 1;
    [[40, 60, 110, 90, 150, 82], [170, 190, 205, 170, 232, 178]].forEach(([x0, y0, x1, y1, x2, y2]) => { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(x1, y1, x2, y2); ctx.stroke(); });
}

// Paret de carreus de pedra (filera a filera, amb morter fosc i volum a cada pedra). Es repeteix en horitzontal i en vertical.
function pintarMurPedra(ctx, w, h) {
    let llavor = 17;
    const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
    ctx.fillStyle = '#26201a'; ctx.fillRect(0, 0, w, h);
    const files = [[96, 64, 96], [64, 96, 96], [80, 96, 80], [128, 64, 64]];
    const fh = h / files.length;
    files.forEach((amples, f) => {
        let x = 0;
        amples.forEach(aw => {
            const y = f * fh, m = 1.6, v = rnd();
            const base = v < 0.33 ? [128, 119, 106] : v < 0.66 ? [116, 108, 97] : [138, 128, 113];
            const dd = (rnd() - 0.5) * 22, c = base.map(q => Math.round(q + dd));
            const g = ctx.createLinearGradient(0, y, 0, y + fh);
            g.addColorStop(0, `rgb(${c[0] + 14},${c[1] + 12},${c[2] + 10})`); g.addColorStop(0.55, `rgb(${c[0]},${c[1]},${c[2]})`); g.addColorStop(1, `rgb(${c[0] - 22},${c[1] - 20},${c[2] - 18})`);
            ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x + m, y + m, aw - 2 * m, fh - 2 * m, 3); ctx.fill();
            ctx.fillStyle = 'rgba(255,245,225,0.20)'; ctx.fillRect(x + m + 2, y + m, aw - 2 * m - 4, 1.6);              // cant de dalt
            ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(x + aw - m - 2.4, y + m + 2, 1.8, fh - 2 * m - 4);       // cantó dret en ombra
            for (let k = 0; k < 14; k++) { ctx.fillStyle = rnd() < 0.5 ? 'rgba(40,34,26,0.22)' : 'rgba(255,245,225,0.10)'; ctx.fillRect(x + m + 3 + rnd() * (aw - 8), y + m + 3 + rnd() * (fh - 8), 1 + rnd() * 2, 1); }
            if (rnd() < 0.3) { ctx.strokeStyle = 'rgba(30,26,20,0.45)'; ctx.lineWidth = 0.8; const cx = x + aw * (0.2 + rnd() * 0.6); ctx.beginPath(); ctx.moveTo(cx, y + m + 2); ctx.lineTo(cx + (rnd() - 0.5) * 8, y + fh * 0.6); ctx.stroke(); }
            x += aw;
        });
    });
}

// Taula de ping-pong verda: tauler amb línies blanques, xarxa, potes de ferro i, a sobre, dues pales i una pilota
function pintarTaulaPP(ctx, w, h) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const C = '#14201a', y0 = 18, y1 = h * 0.56, xf0 = 40, xf1 = w - 40, xn0 = 10, xn1 = w - 10, sk = 8;
    const mix = (a, b, t) => a + (b - a) * t;
    const P = (u, v) => ({ x: mix(mix(xf0, xn0, v), mix(xf1, xn1, v), u) + (v - 0.5) * 2 * sk, y: mix(y0, y1, v) });     // u: 0 esquerra -> 1 dreta; v: 0 fons -> 1 davant
    ctx.fillStyle = 'rgba(0,0,0,0.30)'; ctx.beginPath(); ctx.ellipse(w / 2 + 4, h - 8, w * 0.47, 9, 0, 0, Math.PI * 2); ctx.fill();
    // Potes de darrere (es veuen entre les de davant) i de davant, de ferro pintat de fosc
    const pota = (x, ya, yb, gruix) => {
        ctx.strokeStyle = C; ctx.lineWidth = gruix + 3; ctx.beginPath(); ctx.moveTo(x, ya); ctx.lineTo(x, yb); ctx.stroke();
        const g = ctx.createLinearGradient(x - gruix / 2, 0, x + gruix / 2, 0); g.addColorStop(0, '#2a2c32'); g.addColorStop(0.4, '#5a5e68'); g.addColorStop(1, '#202228');
        ctx.strokeStyle = g; ctx.lineWidth = gruix; ctx.beginPath(); ctx.moveTo(x, ya); ctx.lineTo(x, yb); ctx.stroke();
        ctx.fillStyle = '#101216'; ctx.beginPath(); ctx.ellipse(x, yb + 1, gruix * 0.9, 2.6, 0, 0, Math.PI * 2); ctx.fill();
    };
    pota(P(0.07, 0.1).x, y1, h - 30, 5); pota(P(0.93, 0.1).x, y1, h - 30, 5);                      // darrere
    pota(P(0.06, 1).x + 8, y1 + 8, h - 12, 7); pota(P(0.94, 1).x - 8, y1 + 8, h - 12, 7);               // davant
    ctx.strokeStyle = '#3a3d46'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(P(0.06, 1).x + 8, h - 30); ctx.lineTo(P(0.94, 1).x - 8, h - 30); ctx.stroke();       // travesser
    // Faldó frontal i cantell lateral
    ctx.fillStyle = '#0f4a2a'; ctx.beginPath(); ctx.moveTo(P(0, 1).x, y1); ctx.lineTo(P(1, 1).x, y1); ctx.lineTo(P(1, 1).x - 1, y1 + 9); ctx.lineTo(P(0, 1).x + 1, y1 + 9); ctx.closePath(); ctx.fill(); ctx.strokeStyle = C; ctx.lineWidth = 2; ctx.stroke();
    // Tauler
    const gt = ctx.createLinearGradient(0, y0, 0, y1); gt.addColorStop(0, '#2c8a52'); gt.addColorStop(1, '#1a6a3c');
    ctx.fillStyle = gt; ctx.beginPath(); [P(0, 0), P(1, 0), P(1, 1), P(0, 1)].forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C; ctx.lineWidth = 2.4; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)'; ctx.beginPath(); ctx.moveTo(P(0.03, 0.02).x, y0 + 2); ctx.lineTo(P(0.97, 0.02).x, y0 + 2); ctx.lineTo(P(0.95, 0.2).x, y0 + 12); ctx.lineTo(P(0.05, 0.2).x, y0 + 12); ctx.closePath(); ctx.fill();     // reflex
    // Línies blanques: vora interior, línia central i xarxa
    ctx.strokeStyle = 'rgba(255,255,255,0.92)'; ctx.lineWidth = 1.8;
    const a = P(0.03, 0.08), b = P(0.97, 0.08), c = P(0.97, 0.94), d = P(0.03, 0.94);
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y); ctx.closePath(); ctx.stroke();
    ctx.lineWidth = 1.2; const m0 = P(0.03, 0.5), m1 = P(0.97, 0.5); ctx.beginPath(); ctx.moveTo(m0.x, m0.y); ctx.lineTo(m1.x, m1.y); ctx.stroke();
    // Xarxa al mig (eix vertical a la pantalla): cinta blanca a dalt, malla, pals amb pinces
    const n0 = P(0.5, 0.0), n1 = P(0.5, 1.0), alt = 17;
    ctx.fillStyle = 'rgba(20,24,22,0.30)'; ctx.beginPath(); ctx.moveTo(n0.x, n0.y); ctx.lineTo(n1.x, n1.y); ctx.lineTo(n1.x + 3, n1.y + 3); ctx.lineTo(n0.x + 3, n0.y + 3); ctx.closePath(); ctx.fill();      // ombra
    ctx.fillStyle = 'rgba(235,240,235,0.20)'; ctx.beginPath(); ctx.moveTo(n0.x, n0.y); ctx.lineTo(n1.x, n1.y); ctx.lineTo(n1.x, n1.y - alt); ctx.lineTo(n0.x, n0.y - alt); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(15,20,18,0.55)'; ctx.lineWidth = 0.7;
    for (let k = 1; k < 12; k++) { const t = k / 12, x = mix(n0.x, n1.x, t), y = mix(n0.y, n1.y, t); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - alt); ctx.stroke(); }
    for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(n0.x, n0.y - alt * k / 4); ctx.lineTo(n1.x, n1.y - alt * k / 4); ctx.stroke(); }
    ctx.strokeStyle = '#f4f4ee'; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(n0.x, n0.y - alt); ctx.lineTo(n1.x, n1.y - alt); ctx.stroke();
    ctx.strokeStyle = C; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(n0.x, n0.y - alt - 1.4); ctx.lineTo(n1.x, n1.y - alt - 1.4); ctx.stroke();
    [n0, n1].forEach(p => { ctx.fillStyle = '#3a3d46'; ctx.strokeStyle = C; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.roundRect(p.x - 2.2, p.y - alt - 3, 4.4, alt + 6, 1.6); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#7a7d86'; ctx.fillRect(p.x - 4.4, p.y - 2, 8.8, 3.6); });
    // Dues pales (vermella i negra) i una pilota
    const pala = (x, y, ang, col) => {
        ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
        ctx.fillStyle = '#c89258'; ctx.strokeStyle = C; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.roundRect(-1.8, 6, 3.6, 9, 1.2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(0, 0, 8, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(-2.6, -2.2, 2.6, 1.6, -0.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    };
    pala(P(0.2, 0.74).x, P(0.2, 0.74).y, -0.5, '#b82a30'); pala(P(0.82, 0.3).x, P(0.82, 0.3).y, 0.7, '#1c1c20');
    const pl = P(0.66, 0.66);
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(pl.x + 1.4, pl.y + 1.6, 3.2, 1.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f6f0e0'; ctx.strokeStyle = '#5a5040'; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.arc(pl.x, pl.y - 1.4, 3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
}
