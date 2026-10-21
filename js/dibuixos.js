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
    lienc(c, w, w * 0.55, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 6, W * 0.48, 8);
        ctx.lineWidth = 3; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#3a3a3e'; ctx.fillRect(14, H * 0.55, 8, H * 0.4); ctx.fillRect(W - 22, H * 0.55, 8, H * 0.4);
        ctx.fillStyle = '#1f5a8a'; ctx.beginPath(); ctx.moveTo(24, H * 0.15); ctx.lineTo(W - 24, H * 0.15); ctx.lineTo(W - 4, H * 0.6); ctx.lineTo(4, H * 0.6); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(W / 2, H * 0.15); ctx.lineTo(W / 2, H * 0.6); ctx.moveTo(14, H * 0.38); ctx.lineTo(W - 14, H * 0.38); ctx.stroke();
        ctx.strokeStyle = CONTORN; ctx.fillStyle = '#e8e8e8'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(W / 2 - 3, H * 0.4); ctx.lineTo(W / 2 - 3, H * 0.62); ctx.stroke();
    });
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
    lienc(c, w, w * 0.6, (ctx, W, H) => {
        ctx.lineWidth = 2.5; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#e8d8a8'; ctx.fillRect(6, 4, W - 12, H - 8); ctx.strokeRect(6, 4, W - 12, H - 8);
        ctx.fillStyle = '#c8a868'; ctx.beginPath(); ctx.ellipse(6, H / 2, 6, H / 2 - 2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(W - 6, H / 2, 6, H / 2 - 2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#6a4a2a'; ctx.lineWidth = 1.5;
        for (let y = 12; y < H - 8; y += 6) { ctx.beginPath(); ctx.moveTo(14, y); ctx.lineTo(W - 14, y); ctx.stroke(); }
    });
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
    lienc(c, w, w * 0.75, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 5, W * 0.45, 7);
        ctx.lineWidth = 3; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#7a4a24'; ctx.fillRect(6, H * 0.4, W - 12, H * 0.54); ctx.strokeRect(6, H * 0.4, W - 12, H * 0.54);
        ctx.fillStyle = '#8a5a2e'; ctx.beginPath(); ctx.moveTo(6, H * 0.4); ctx.quadraticCurveTo(W / 2, -H * 0.1, W - 6, H * 0.4); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#d4af37'; ctx.fillRect(6, H * 0.4, W - 12, 6); ctx.fillRect(W / 2 - 6, H * 0.4, 12, H * 0.22); ctx.strokeRect(W / 2 - 6, H * 0.4, 12, H * 0.22);
    });
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
    lienc(c, w, w * 1.0, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 6, W * 0.45, 8);
        ctx.lineWidth = 3.5; ctx.strokeStyle = CONTORN;
        // foc de sota
        const g = ctx.createRadialGradient(W / 2, H * 0.88, 2, W / 2, H * 0.88, W * 0.4);
        g.addColorStop(0, '#fff2a0'); g.addColorStop(0.5, '#ff9a30'); g.addColorStop(1, 'rgba(255,60,0,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(W / 2, H * 0.86, W * 0.4, H * 0.18, 0, 0, Math.PI * 2); ctx.fill();
        // olla panxuda
        ctx.fillStyle = '#2a2a2e'; ctx.beginPath(); ctx.ellipse(W / 2, H * 0.55, W * 0.4, H * 0.32, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#4a6a2a'; ctx.beginPath(); ctx.ellipse(W / 2, H * 0.3, W * 0.3, H * 0.09, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#a8f060'; [[0.42, 0.28], [0.58, 0.31], [0.5, 0.26]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(W * x, H * y, 4, 0, Math.PI * 2); ctx.fill(); });
    });
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
        [0.34, 0.6].forEach(cx => finestra(ctx, W * cx, H * 0.42, W * 0.06, H * 0.26, { arc: true, marc: '#b86a42', vidre: '#6a3a24' }));
        // Porta baixa amb graó
        ctx.fillStyle = '#6a4228'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
        ctx.fillRect(W * 0.46, H * 0.7, W * 0.08, H * 0.24); ctx.strokeRect(W * 0.46, H * 0.7, W * 0.08, H * 0.24);
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

// Hostatgeria (casa d'espiritualitat): gran bloc de pedra bruna amb cantoneres clares, teulada de poc pendent amb ràfec
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
