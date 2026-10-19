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
    lienc(c, w, w * 0.7, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 10, W * 0.46, 12);
        ctx.lineWidth = 4; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#a8a092';
        // Murs baixos
        ctx.fillRect(10, H - 70, 70, 60); ctx.strokeRect(10, H - 70, 70, 60);
        ctx.fillRect(W - 90, H - 100, 80, 90); ctx.strokeRect(W - 90, H - 100, 80, 90);
        // Arc trencat
        ctx.fillRect(W * 0.3, H * 0.25, 30, H * 0.65); ctx.strokeRect(W * 0.3, H * 0.25, 30, H * 0.65);
        ctx.fillRect(W * 0.6, H * 0.12, 30, H * 0.78); ctx.strokeRect(W * 0.6, H * 0.12, 30, H * 0.78);
        ctx.beginPath(); ctx.moveTo(W * 0.3, H * 0.28); ctx.quadraticCurveTo(W * 0.45, H * 0.0, W * 0.48, H * 0.2);
        ctx.lineTo(W * 0.42, H * 0.3); ctx.quadraticCurveTo(W * 0.4, H * 0.12, W * 0.3 + 30, H * 0.3); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Herba entre les pedres
        ctx.fillStyle = '#5d8f3f';
        for (let x = 20; x < W - 20; x += 22) ctx.fillRect(x, H - 14, 8, 8);
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
