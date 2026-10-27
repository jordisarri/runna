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

// Sacerdotessa de l'Hostatgeria: vel negre i toca blanca que emmarquen la cara, gorgera blanca, hàbit amb plecs i escapulari,
// mànigues amples amb les mans juntes i un rosari al cordó. Opcions: cabell (el serrell que treu sota la toca), ample, alt,
// ulleres, cadira (asseguda en una cadira de rodes, amb una manta)
function dibuixarMonja(canvas, w, o) {
    const h = Math.round(w * 4 / 3);
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.scale(w / 96, w / 96);
    ctx.lineWidth = 3; ctx.strokeStyle = CONTORN; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const alt = o.alt || 1, amp = o.ample || 1, capY = o.cadira ? 128 - 96 * alt : 128 - 108 * alt, m = 48;
    const HABIT = '#2c2c3e', CLAR = '#424258', FOSC = '#1a1a26', TOCA = '#f4f1e8', VEL = '#15151c', PELL = '#e8b48a';
    const forma = (pts, fill, stroke = true) => {
        ctx.fillStyle = fill; ctx.beginPath(); pts(); ctx.closePath(); ctx.fill(); if (stroke) ctx.stroke();
    };
    const gradHabit = (x0, x1) => { const g = ctx.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, CLAR); g.addColorStop(0.55, HABIT); g.addColorStop(1, FOSC); return g; };
    const roda = (x, y, r) => {
        ctx.fillStyle = '#8a8a8a'; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#e8d8b0'; ctx.beginPath(); ctx.arc(x, y, r - 4, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = 1.4; for (let q = 0; q < 6; q++) { const a = q / 6 * Math.PI * 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * (r - 4), y + Math.sin(a) * (r - 4)); ctx.stroke(); }
        ctx.lineWidth = 3; ctx.fillStyle = '#3a3a3a'; ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
    };
    const espatlla = 15 * amp, baix = o.cadira ? capY + 66 : 121;

    // Vel del darrere: cau per l'esquena fins sota les espatlles
    forma(() => { ctx.moveTo(m - 19, capY + 10); ctx.quadraticCurveTo(m - 24, capY + 40, m - espatlla - 6, capY + 50); ctx.lineTo(m + espatlla + 6, capY + 50); ctx.quadraticCurveTo(m + 24, capY + 40, m + 19, capY + 10); }, VEL);

    if (o.cadira) {
        // Cadira de rodes: respatller (el seient queda tapat per la manta)
        ctx.fillStyle = '#6a4a2e'; ctx.fillRect(m - 27, capY + 34, 7, 44); ctx.strokeRect(m - 27, capY + 34, 7, 44);
        ctx.fillStyle = '#8a5a34'; ctx.fillRect(m - 30, capY + 30, 13, 6); ctx.strokeRect(m - 30, capY + 30, 13, 6);           // agafador
        roda(m - 18, 108, 18);
    }
    // Hàbit: de les espatlles fins a terra (dreta) o fins al seient (asseguda), amb plecs i l'escapulari al davant
    forma(() => {
        ctx.moveTo(m - espatlla, capY + 30); ctx.lineTo(m + espatlla, capY + 30);
        if (o.cadira) { ctx.quadraticCurveTo(m + espatlla + 6, capY + 50, m + espatlla + 4, baix); ctx.lineTo(m - espatlla - 4, baix); ctx.quadraticCurveTo(m - espatlla - 6, capY + 50, m - espatlla, capY + 30); }
        else {
            ctx.quadraticCurveTo(m + 22 * amp + 4, capY + 70, m + 24 * amp + 7, baix);
            ctx.quadraticCurveTo(m, baix + 4, m - 24 * amp - 7, baix);
            ctx.quadraticCurveTo(m - 22 * amp - 4, capY + 70, m - espatlla, capY + 30);
        }
    }, gradHabit(m - 30 * amp, m + 30 * amp));
    ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(m - 7 * amp, capY + 40, 14 * amp, baix - capY - 44);                  // escapulari
    ctx.strokeStyle = FOSC; ctx.lineWidth = 1.6;
    if (!o.cadira) [[-1, 9], [1, 9], [-1, 17], [1, 17]].forEach(([sg, d]) => {
        ctx.beginPath(); ctx.moveTo(m + sg * d * amp * 0.7, capY + 70); ctx.quadraticCurveTo(m + sg * (d + 2) * amp, capY + 96, m + sg * (d + 4) * amp, baix - 1); ctx.stroke();
    });
    ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
    if (o.cadira) {
        // Manta de quadres sobre la falda, que cau fins als peus, i les rodes
        forma(() => { ctx.moveTo(m - 22, capY + 60); ctx.lineTo(m + 30, capY + 60); ctx.quadraticCurveTo(m + 36, capY + 74, m + 32, capY + 90); ctx.lineTo(m - 18, capY + 88); ctx.quadraticCurveTo(m - 24, capY + 74, m - 22, capY + 60); }, '#a05a4a');
        ctx.strokeStyle = 'rgba(240,220,180,0.55)'; ctx.lineWidth = 1.5;
        for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(m - 18 + k * 11, capY + 62); ctx.lineTo(m - 16 + k * 11, capY + 88); ctx.stroke(); }
        [capY + 70, capY + 80].forEach(y => { ctx.beginPath(); ctx.moveTo(m - 20, y); ctx.lineTo(m + 32, y); ctx.stroke(); });
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
        ctx.fillStyle = '#2a1e16'; ctx.fillRect(m + 14, capY + 89, 14, 6); ctx.strokeRect(m + 14, capY + 89, 14, 6);           // sabates al reposapeus
        roda(m + 26, 117, 9);                                                                                              // roda petita del davant
    } else {
        ctx.fillStyle = '#2a1e16';
        [-1, 1].forEach(sg => { ctx.beginPath(); ctx.ellipse(m + sg * 9, 123, 8, 3.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    }
    // Cordó a la cintura, amb el rosari penjant a la dreta
    const cint = capY + (o.cadira ? 56 : 64);
    ctx.strokeStyle = '#c9b48a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(m - espatlla - 2, cint); ctx.quadraticCurveTo(m, cint + 3, m + espatlla + 2, cint); ctx.stroke();
    ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
    if (!o.cadira) {
        ctx.fillStyle = '#5a3a20';
        for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.arc(m + 12 * amp + Math.sin(k * 0.5) * 2, cint + 4 + k * 3.6, 1.7, 0, Math.PI * 2); ctx.fill(); }
        const cy = cint + 24;
        ctx.fillStyle = '#cfb36a'; ctx.fillRect(m + 12 * amp - 1.2, cy, 2.4, 9); ctx.fillRect(m + 12 * amp - 3.5, cy + 2.5, 7, 2.4);
    }
    // Gorgera blanca sobre les espatlles
    forma(() => { ctx.ellipse(m, capY + 28, espatlla + 2, 14, 0, 0, Math.PI); }, TOCA);
    // Mànigues amples i les mans juntes al davant
    const mans = o.cadira ? capY + 58 : capY + 56;
    [-1, 1].forEach(sg => forma(() => {
        ctx.moveTo(m + sg * (espatlla + 1), capY + 33);
        ctx.quadraticCurveTo(m + sg * (espatlla + 7), mans - 6, m + sg * 13, mans + 6);
        ctx.lineTo(m + sg * 3, mans + 3);
        ctx.quadraticCurveTo(m + sg * (espatlla - 4), mans - 10, m + sg * (espatlla - 4), capY + 40);
    }, sg < 0 ? CLAR : HABIT));
    ctx.lineWidth = 2;
    [-1, 1].forEach(sg => forma(() => { ctx.ellipse(m + sg * 2.2, mans, 3.4, 6.5, sg * 0.35, 0, Math.PI * 2); }, PELL));   // mans juntes, resant
    ctx.lineWidth = 3;
    // Cap: toca blanca, la cara, un serrell de cabell i el vel negre fent de caputxa
    forma(() => { ctx.arc(m, capY + 13, 15, 0, Math.PI * 2); }, TOCA);
    forma(() => { ctx.ellipse(m, capY + 16, 11, 12, 0, 0, Math.PI * 2); }, PELL, false);
    ctx.fillStyle = o.cabell; ctx.beginPath(); ctx.ellipse(m, capY + 6, 9, 3.2, 0, Math.PI, Math.PI * 2); ctx.fill();
    forma(() => {
        ctx.moveTo(m - 20, capY + 31); ctx.lineTo(m - 20, capY + 12); ctx.arc(m, capY + 12, 20, Math.PI, Math.PI * 2);
        ctx.lineTo(m + 20, capY + 31); ctx.lineTo(m + 15, capY + 31); ctx.lineTo(m + 15, capY + 13); ctx.arc(m, capY + 13, 15, 0, Math.PI, true); ctx.lineTo(m - 15, capY + 31);
    }, VEL);
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(m, capY + 12, 17.5, Math.PI * 1.15, Math.PI * 1.45); ctx.stroke();
    ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
    // Ulls, galtes i somriure
    ctx.fillStyle = CONTORN;
    [-1, 1].forEach(sg => { ctx.beginPath(); ctx.ellipse(m + sg * 4.5, capY + 15, 1.6, 2.2, 0, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = 'rgba(220,110,110,0.35)'; [-1, 1].forEach(sg => { ctx.beginPath(); ctx.arc(m + sg * 7, capY + 20, 2.6, 0, Math.PI * 2); ctx.fill(); });
    if (o.ulleres) {
        ctx.lineWidth = 1.6; ctx.strokeStyle = '#3a2a1e';
        [-1, 1].forEach(sg => { ctx.beginPath(); ctx.arc(m + sg * 4.8, capY + 15, 4, 0, Math.PI * 2); ctx.stroke(); });
        ctx.beginPath(); ctx.moveTo(m - 1, capY + 14.5); ctx.lineTo(m + 1, capY + 14.5); ctx.stroke(); ctx.strokeStyle = CONTORN;
    }
    ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(m, capY + 20.5, 3.2, 0.25, Math.PI - 0.25); ctx.stroke();
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

// Taula de pedra de l'ermita: llosa alta d'arc rodó, amb marc cisellat, sis files de signes gravats, molsa i esquerdes.
// part: 0 per a la primera (signes 1-6), 6 per a la segona (7-12)
function dibuixarTaulaPedra(c, w, part = 0) {
    lienc(c, w, w * 1.4, (ctx, W, H) => {
        const r = rndBib(77 + part);
        ombraTerra(ctx, W / 2, H - 5, W * 0.5, 7);
        const C = CONTORN;
        // Sòcol
        let g = ctx.createLinearGradient(0, H - 22, 0, H - 4); g.addColorStop(0, '#a8a090'); g.addColorStop(1, '#6e6859');
        ctx.fillStyle = g; ctx.fillRect(3, H - 22, W - 6, 18); ctx.lineWidth = 3; ctx.strokeStyle = C; ctx.strokeRect(3, H - 22, W - 6, 18);
        ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(5, H - 20, W - 10, 2);
        // Llosa amb el cap arrodonit
        const cos = (m) => { ctx.beginPath(); ctx.moveTo(8 + m, H - 22); ctx.lineTo(8 + m, 46 + m); ctx.quadraticCurveTo(8 + m, 6 + m, W / 2, 4 + m); ctx.quadraticCurveTo(W - 8 - m, 6 + m, W - 8 - m, 46 + m); ctx.lineTo(W - 8 - m, H - 22); ctx.closePath(); };
        g = ctx.createLinearGradient(8, 0, W - 8, 0); g.addColorStop(0, '#b4ac9a'); g.addColorStop(0.5, '#9a9382'); g.addColorStop(1, '#7c7666');
        ctx.fillStyle = g; cos(0); ctx.fill(); ctx.lineWidth = 3.4; ctx.strokeStyle = C; ctx.stroke();
        // Marc cisellat: filet clar i filet fosc
        ctx.lineWidth = 1.6; ctx.strokeStyle = 'rgba(255,255,255,0.4)'; cos(5); ctx.stroke();
        ctx.strokeStyle = 'rgba(40,34,26,0.7)'; cos(8); ctx.stroke();
        // Plafó interior enfonsat
        g = ctx.createLinearGradient(0, 18, 0, H - 26); g.addColorStop(0, '#7e786a'); g.addColorStop(1, '#8c8575');
        ctx.fillStyle = g; cos(12); ctx.fill(); ctx.strokeStyle = 'rgba(30,24,16,0.85)'; ctx.lineWidth = 2; ctx.stroke();
        ctx.save(); cos(12); ctx.clip();
        ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(0, 0, W, 30);                              // ombra interior de dalt
        ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(0, 0, 8, H);
        // Textura de gra
        for (let i = 0; i < 70; i++) { ctx.fillStyle = r() < 0.5 ? 'rgba(255,255,255,0.05)' : 'rgba(20,14,8,0.07)'; ctx.fillRect(r() * W, r() * H, 1 + r() * 3, 1 + r() * 2); }
        // Línia de separació i sis files de signes: un de cada columna (els importants) + dos de farciment
        const y0 = 36, pas = (H - 34 - y0 - 6) / 6;
        ctx.strokeStyle = 'rgba(30,24,16,0.55)'; ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.moveTo(22, 25); ctx.lineTo(W - 22, 25); ctx.stroke();
        for (let i = 0; i < 6; i++) {
            const y = y0 + i * pas + pas / 2;
            runaErmita(ctx, part + i, 25, y, 12);
            const n = 2 + Math.floor(r() * 3);
            for (let j = 0; j < n; j++) runaErmita(ctx, Math.floor(r() * 12), 42 + j * 15, y, 8);
        }
        // Esquerdes i molsa
        ctx.strokeStyle = 'rgba(25,18,10,0.65)'; ctx.lineWidth = 1.3; ctx.beginPath();
        const ex = 16 + r() * (W - 32); ctx.moveTo(ex, 20); ctx.lineTo(ex + 6, 42); ctx.lineTo(ex - 3, 60); ctx.lineTo(ex + 4, 76); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = 'rgba(72,104,52,0.5)';
        for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.ellipse(10 + r() * (W - 20), H - 24 - r() * 12, 4 + r() * 6, 2 + r() * 3.5, 0, 0, Math.PI * 2); ctx.fill(); }
        // Esquerda de la vora i resplendor al cantell esquerre
        ctx.fillStyle = 'rgba(255,255,255,0.28)'; ctx.fillRect(10, 50, 2.4, H - 80);
    });
}

// Font del Bisbe: font de pedra de dues graderies i una pica rodona amb una mitra gravada al brocal, un pedestal estriat amb
// una copa petita i un coronament, molsa i heura, l'aigua morta (tèrbola i lila) i volves de boira. Seca i abandonada.
function dibuixarFontSJ(c, w) {
    lienc(c, w, w * 0.95, (ctx, W, H) => {
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        let sd = 13; const r = () => (sd = sd * 16807 % 2147483647) / 2147483647;
        const lat = (cx, rx, a, b, d) => { const g = ctx.createLinearGradient(cx - rx, 0, cx + rx, 0); g.addColorStop(0, a); g.addColorStop(0.42, b); g.addColorStop(1, d); return g; };
        // Cilindre de pedra: cos amb llum a l'esquerra, junts verticals i la tapa el·líptica
        const cil = (cx, y0, y1, rx0, rx1, ry, cTop, a, b, d) => {
            ctx.fillStyle = lat(cx, Math.max(rx0, rx1), a, b, d); ctx.strokeStyle = CONTORN; ctx.lineWidth = 3.5;
            ctx.beginPath(); ctx.moveTo(cx - rx0, y0); ctx.lineTo(cx - rx1, y1); ctx.ellipse(cx, y1, rx1, ry * rx1 / rx0, 0, Math.PI, 0, true); ctx.lineTo(cx + rx0, y0); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.strokeStyle = 'rgba(40,30,20,0.35)'; ctx.lineWidth = 1.4;
            for (let k = -3; k <= 3; k++) { const f = k / 3.4; ctx.beginPath(); ctx.moveTo(cx + rx0 * f, y0 + ry * Math.sqrt(Math.max(0, 1 - f * f))); ctx.lineTo(cx + rx1 * f, y1 + ry * (rx1 / rx0) * Math.sqrt(Math.max(0, 1 - f * f))); ctx.stroke(); }
            ctx.fillStyle = cTop; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.ellipse(cx, y0, rx0, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        };
        const cx = W / 2;
        ombraTerra(ctx, cx, H - 7, W * 0.47, 11);
        // Dues graderies de pedra
        cil(cx, H * 0.77, H * 0.92, W * 0.46, W * 0.46, H * 0.085, '#bcb4a4', '#a39c8c', '#c2baaa', '#7a7466');
        cil(cx, H * 0.66, H * 0.78, W * 0.37, W * 0.37, H * 0.07, '#c8c0b0', '#aaa393', '#cdc5b4', '#807a6c');
        // Pica: brocal ample, cos que s'estreny cap avall
        cil(cx, H * 0.50, H * 0.67, W * 0.33, W * 0.27, H * 0.09, '#d2cab8', '#b0a999', '#d6cebd', '#847e70');
        // Aigua morta: tèrbola, entre verd fosc i lila, amb anells
        const ag = ctx.createRadialGradient(cx - W * 0.06, H * 0.49, 2, cx, H * 0.5, W * 0.3);
        ag.addColorStop(0, '#6a6f78'); ag.addColorStop(0.6, '#4b4f5e'); ag.addColorStop(1, '#3a3446');
        ctx.fillStyle = ag; ctx.beginPath(); ctx.ellipse(cx, H * 0.505, W * 0.285, H * 0.068, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(180,150,230,0.35)'; ctx.lineWidth = 1.3;
        [[0.2, 0.045], [0.12, 0.028]].forEach(([rx, ry]) => { ctx.beginPath(); ctx.ellipse(cx + W * 0.03, H * 0.505, W * rx, H * ry, 0, 0, Math.PI * 2); ctx.stroke(); });
        // Mitra gravada al brocal: dues puntes, cinta i dues llaçades
        ctx.save(); ctx.translate(cx, H * 0.605);
        ctx.fillStyle = '#e4dccb'; ctx.strokeStyle = '#4a4234'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-W * 0.07, W * 0.045); ctx.quadraticCurveTo(-W * 0.085, -W * 0.03, -W * 0.02, -W * 0.075); ctx.lineTo(0, -W * 0.095); ctx.lineTo(W * 0.02, -W * 0.075);
        ctx.quadraticCurveTo(W * 0.085, -W * 0.03, W * 0.07, W * 0.045); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-W * 0.07, W * 0.025); ctx.lineTo(W * 0.07, W * 0.025); ctx.moveTo(0, -W * 0.075); ctx.lineTo(0, W * 0.025); ctx.stroke();
        ctx.strokeStyle = '#4a4234'; ctx.beginPath(); ctx.moveTo(-W * 0.03, W * 0.045); ctx.lineTo(-W * 0.06, W * 0.085); ctx.moveTo(W * 0.03, W * 0.045); ctx.lineTo(W * 0.06, W * 0.085); ctx.stroke();
        ctx.restore();
        // Pedestal estriat amb la copa petita
        cil(cx, H * 0.18, H * 0.52, W * 0.075, W * 0.095, H * 0.02, '#cfc7b6', '#aaa393', '#d0c8b7', '#7e786a');
        ctx.strokeStyle = 'rgba(60,50,38,0.4)'; ctx.lineWidth = 1.2;
        [-0.04, 0, 0.04].forEach(dx => { ctx.beginPath(); ctx.moveTo(cx + W * dx, H * 0.22); ctx.lineTo(cx + W * dx * 1.2, H * 0.5); ctx.stroke(); });
        cil(cx, H * 0.17, H * 0.2, W * 0.17, W * 0.09, H * 0.045, '#d6cebd', '#b6af9f', '#d8d0bf', '#868072');
        ctx.fillStyle = '#4a5260'; ctx.beginPath(); ctx.ellipse(cx, H * 0.172, W * 0.145, H * 0.032, 0, 0, Math.PI * 2); ctx.fill();
        // Coronament: bolla i una petita mitra
        cil(cx, H * 0.1, H * 0.17, W * 0.03, W * 0.05, H * 0.012, '#d6cebd', '#b0a999', '#d4ccbb', '#827c6e');
        ctx.fillStyle = '#d6cebd'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, H * 0.075, W * 0.03, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, H * 0.045); ctx.lineTo(cx, H * 0.005); ctx.moveTo(cx - W * 0.025, H * 0.02); ctx.lineTo(cx + W * 0.025, H * 0.02); ctx.stroke();
        // Gota d'aigua que no cau (la font és seca) i una esquerda
        ctx.strokeStyle = 'rgba(30,22,14,0.7)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(W * 0.78, H * 0.62); ctx.lineTo(W * 0.74, H * 0.66); ctx.lineTo(W * 0.76, H * 0.7); ctx.stroke();
        // Molsa a les graderies i heura al pedestal
        ctx.lineWidth = 1.6; ctx.strokeStyle = '#26361e';
        for (let k = 0; k < 26; k++) { const a = r() * Math.PI * 2, rr = 0.22 + r() * 0.2, x = cx + Math.cos(a) * W * rr, y = H * (0.86 + Math.sin(a) * 0.04 * (r() > 0.5 ? 1 : 0.6)); ctx.fillStyle = ['#4a7a34', '#5a8c3e', '#3a6a2a'][k % 3]; ctx.beginPath(); ctx.arc(x, y, W * (0.012 + r() * 0.016), 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
        for (let k = 0; k < 14; k++) { const y = H * (0.26 + k * 0.022), x = cx - W * 0.075 + Math.sin(k * 1.7) * W * 0.03; ctx.fillStyle = ['#3f7a32', '#4f8c3a'][k % 2]; ctx.beginPath(); ctx.ellipse(x, y, W * 0.022, W * 0.013, 0.7 * (k % 2 ? 1 : -1), 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
        // Volves de boira lila vora la base
        for (let k = 0; k < 5; k++) { ctx.fillStyle = `rgba(170,140,220,${0.22 - k * 0.02})`; ctx.beginPath(); ctx.ellipse(W * (0.18 + k * 0.17), H * (0.9 + (k % 2) * 0.03), W * 0.12, H * 0.035, 0, 0, Math.PI * 2); ctx.fill(); }
    });
}

// Herbes de la Nit de Sant Joan que cal trobar al bosc (herba de Sant Joan, romaní i farigola)
function dibuixarHerba(c, w, tipus) {
    lienc(c, w, w * 1.1, (ctx, W, H) => {
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        let sd = tipus === 'sj' ? 5 : tipus === 'romani' ? 9 : 17; const r = () => (sd = sd * 16807 % 2147483647) / 2147483647;
        ombraTerra(ctx, W / 2, H - 5, W * 0.38, 6);
        const base = H - 8;
        const flor = (x, y, rr, pet, cen, vora) => {
            ctx.fillStyle = pet; ctx.strokeStyle = vora; ctx.lineWidth = 1.5;
            for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2 - Math.PI / 2; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * rr * 0.7, y + Math.sin(a) * rr * 0.7, rr * 0.62, rr * 0.42, a, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
            ctx.fillStyle = cen; ctx.beginPath(); ctx.arc(x, y, rr * 0.38, 0, Math.PI * 2); ctx.fill();
        };
        if (tipus === 'sj') {                  // hipèric: tiges primes amb fulles ovalades i flors grogues
            for (let k = 0; k < 6; k++) {
                const x1 = W * (0.5 + (k - 2.5) * 0.12), y1 = H * (0.22 + (k % 3) * 0.08);
                ctx.strokeStyle = '#2c4a22'; ctx.lineWidth = 4.2; ctx.beginPath(); ctx.moveTo(W * 0.5 + (k - 2.5) * 3, base); ctx.quadraticCurveTo(x1 - 4 * (k - 2.5), H * 0.6, x1, y1); ctx.stroke();
                ctx.strokeStyle = '#6fa04a'; ctx.lineWidth = 2; ctx.stroke();
                for (let q = 1; q < 5; q++) { const t = q / 5, lx = W * 0.5 + (x1 - W * 0.5) * t, ly = base + (y1 - base) * t; ctx.fillStyle = '#5f9a3e'; ctx.strokeStyle = '#26361e'; ctx.lineWidth = 1.2; [-1, 1].forEach(sg => { ctx.beginPath(); ctx.ellipse(lx + sg * 6, ly, 6, 3, sg * 0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }); }
                flor(x1, y1, W * 0.085, '#ffd21f', '#e08a10', '#8a5a08');
            }
        } else if (tipus === 'romani') {      // romaní: tiges llenyoses amb fulles d'agulla i floretes blavoses
            for (let k = 0; k < 5; k++) {
                const x1 = W * (0.5 + (k - 2) * 0.13), y1 = H * (0.12 + (k % 2) * 0.12);
                ctx.strokeStyle = '#4a3220'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(W * 0.5 + (k - 2) * 4, base); ctx.quadraticCurveTo(x1, H * 0.55, x1, y1); ctx.stroke();
                for (let q = 0; q < 16; q++) { const t = 0.15 + q / 16 * 0.85, lx = W * 0.5 + (x1 - W * 0.5) * t + ((q % 2) ? 5 : -5), ly = base + (y1 - base) * t; ctx.strokeStyle = q % 3 ? '#2f5a34' : '#3d7040'; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(lx - ((q % 2) ? 3 : -3), ly + 2); ctx.lineTo(lx + ((q % 2) ? 7 : -7), ly - 7); ctx.stroke(); }
                if (k % 2 === 0) for (let q = 0; q < 3; q++) { ctx.fillStyle = '#9ab8f0'; ctx.strokeStyle = '#3a4a8a'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(x1 + (q - 1) * 5, y1 + 3 + (q % 2) * 7, 3.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
            }
        } else {                               // farigola: coixinet baix de fulletes grisenques amb flors lila rosades
            ctx.strokeStyle = '#26361e'; ctx.lineWidth = 1.5;
            for (let k = 0; k < 44; k++) { const a = r() * Math.PI, rr = r(); const x = W * 0.5 + Math.cos(a) * W * 0.4 * rr * (r() > 0.5 ? 1 : -1), y = base - Math.sin(a) * H * 0.36 * (0.2 + rr * 0.8) - 6; ctx.fillStyle = ['#6f8a5a', '#7e9a68', '#5f7a4e'][k % 3]; ctx.beginPath(); ctx.arc(x, y, 4.5 + r() * 3, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
            for (let k = 0; k < 14; k++) { const a = r() * Math.PI, rr = r(); const x = W * 0.5 + Math.cos(a) * W * 0.33 * rr * (r() > 0.5 ? 1 : -1), y = base - Math.sin(a) * H * 0.34 * (0.3 + rr * 0.7) - 10; ctx.fillStyle = ['#d78ac8', '#c070e0', '#f0a0d0'][k % 3]; ctx.strokeStyle = '#5a2a5a'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(x, y, 3.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
        }
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
// Escolopendra (centpeus) vista de dalt, mirant a la dreta: un full de n fotogrames d'amplada w. El cos de segments
// ondula (l'ona va del cap a la cua), cada segment té un parell de potes que es mouen en onada, i té el cap amb
// antenes i pinces i els dos apèndixs llargs de la cua
function dibuixarEscolopendra(c, w, n = 8) {
    const fh = Math.round(w * 0.64);
    c.width = w * n; c.height = fh;
    const ctx = c.getContext('2d');
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const u = w / 200, N = 15;
    for (let f = 0; f < n; f++) {
        ctx.save(); ctx.translate(f * w, 0); ctx.scale(u, u);
        const fase = f / n * Math.PI * 2, H = fh / u, mig = H / 2;
        // Punts del cos (de la cua al cap), la seva direcció i la normal
        const P = [];
        for (let i = 0; i < N; i++) {
            const t = i / (N - 1), x = 24 + t * 140;
            const y = mig + Math.sin(t * Math.PI * 3 - fase) * 21 * (1 - 0.45 * t);   // l'ona viatja pel cos: s'enrosca i serpenteja
            P.push({ x, y });
        }
        P.forEach((p, i) => {
            const a = P[Math.max(0, i - 1)], b = P[Math.min(N - 1, i + 1)], l = Math.hypot(b.x - a.x, b.y - a.y);
            p.tx = (b.x - a.x) / l; p.ty = (b.y - a.y) / l; p.nx = -p.ty; p.ny = p.tx;
        });
        // Ombra arran del cos (l'insecte és pla i enganxat a terra: l'ombra en segueix la forma, una mica desplaçada)
        ctx.save(); ctx.translate(2, 4);
        ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 24;
        ctx.beginPath(); P.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.lineTo(P[N - 1].x + P[N - 1].tx * 10, P[N - 1].y + P[N - 1].ty * 10); ctx.stroke();
        ctx.restore();
        // Potes: un parell per segment, amb genoll, que es mouen endavant i enrere en onada
        P.forEach((p, i) => {
            if (i === 0 || i === N - 1) return;
            [-1, 1].forEach(s => {
                const sw = Math.sin(fase - i * 0.9 + (s > 0 ? Math.PI : 0)) * 0.75;
                const kx = p.x + p.nx * s * 20 + p.tx * sw * 8, ky = p.y + p.ny * s * 20 + p.ty * sw * 8;
                const fx = kx + p.nx * s * 14 + p.tx * (sw * 14 - 7), fy = ky + p.ny * s * 14 + p.ty * (sw * 14 - 7);
                ctx.strokeStyle = '#2a1206'; ctx.lineWidth = 4.2;
                ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(kx, ky); ctx.lineTo(fx, fy); ctx.stroke();
                ctx.strokeStyle = '#f0a83a'; ctx.lineWidth = 2.2;
                ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(kx, ky); ctx.lineTo(fx, fy); ctx.stroke();
            });
        });
        // Apèndixs de la cua, llargs i una mica oberts
        const q = P[0];
        [-1, 1].forEach(s => {
            const ex = q.x - q.tx * 26 + q.nx * s * 10, ey = q.y - q.ty * 26 + q.ny * s * 10;
            ctx.strokeStyle = '#2a1206'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.quadraticCurveTo(q.x - q.tx * 14, q.y - q.ty * 14 + s * 2, ex, ey); ctx.stroke();
            ctx.strokeStyle = '#e07a2a'; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.quadraticCurveTo(q.x - q.tx * 14, q.y - q.ty * 14 + s * 2, ex, ey); ctx.stroke();
        });
        // Segments del cos: plaques fosques amb la vora taronja i una ratlla clara al mig
        P.forEach((p, i) => {
            const amp = i === 0 ? 7 : 10 + Math.sin(i / (N - 1) * Math.PI) * 1.5;
            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.atan2(p.ty, p.tx));
            ctx.fillStyle = '#1e0e08'; ctx.beginPath(); ctx.ellipse(0, 0, 7.4, amp + 1.6, 0, 0, Math.PI * 2); ctx.fill();
            const g = ctx.createLinearGradient(0, -amp, 0, amp);
            g.addColorStop(0, '#b84e1c'); g.addColorStop(0.35, '#6a2412'); g.addColorStop(0.65, '#4a180c'); g.addColorStop(1, '#a0441a');
            ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, 6.2, amp, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(255,200,140,0.35)'; ctx.fillRect(-4, -1.2, 8, 2.4);
            ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.ellipse(-1, -amp * 0.5, 3, 2, 0, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        });
        // Cap: pinces (forcípules), antenes que es belluguen, ulls
        const h = P[N - 1], hx = h.x + h.tx * 9, hy = h.y + h.ty * 9, ha = Math.atan2(h.ty, h.tx);
        ctx.save(); ctx.translate(hx, hy); ctx.rotate(ha);
        [-1, 1].forEach(s => {
            const ant = Math.sin(fase * 2 + s) * 4;
            ctx.strokeStyle = '#2a1206'; ctx.lineWidth = 3.4;
            ctx.beginPath(); ctx.moveTo(6, s * 4); ctx.quadraticCurveTo(20, s * (10 + ant), 32, s * (20 + ant)); ctx.stroke();
            ctx.strokeStyle = '#d88a34'; ctx.lineWidth = 1.6;
            ctx.beginPath(); ctx.moveTo(6, s * 4); ctx.quadraticCurveTo(20, s * (10 + ant), 32, s * (20 + ant)); ctx.stroke();
            ctx.strokeStyle = '#1e0e08'; ctx.lineWidth = 4;
            ctx.beginPath(); ctx.moveTo(2, s * 7); ctx.quadraticCurveTo(12, s * 10, 12, s * 2); ctx.stroke();
            ctx.strokeStyle = '#8a2a12'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(2, s * 7); ctx.quadraticCurveTo(12, s * 10, 12, s * 2); ctx.stroke();
        });
        ctx.fillStyle = '#1e0e08'; ctx.beginPath(); ctx.ellipse(0, 0, 9.5, 10, 0, 0, Math.PI * 2); ctx.fill();
        const gc = ctx.createRadialGradient(-2, -3, 1, 0, 0, 10);
        gc.addColorStop(0, '#f0a040'); gc.addColorStop(1, '#a84a14');
        ctx.fillStyle = gc; ctx.beginPath(); ctx.ellipse(0, 0, 8.2, 8.8, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1a0a04'; [-1, 1].forEach(s => { ctx.beginPath(); ctx.arc(3.5, s * 4, 1.6, 0, Math.PI * 2); ctx.fill(); });
        ctx.restore();
        ctx.restore();
    }
}

function dibuixarGripau(c, w) {
    lienc(c, w, w * 0.8, (ctx, W, H) => {
        const L = W / 30;
        ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.lineWidth = L; ctx.strokeStyle = CONTORN;
        ombraTerra(ctx, W * 0.5, H * 0.93, W * 0.42, H * 0.07);
        // boira lila que l'embolcalla
        let g = ctx.createRadialGradient(W * 0.5, H * 0.55, W * 0.1, W * 0.5, H * 0.55, W * 0.58);
        g.addColorStop(0, 'rgba(154,80,255,0.30)'); g.addColorStop(1, 'rgba(154,80,255,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        const pell = (x0, y0, x1, y1) => { const q = ctx.createLinearGradient(x0, y0, x1, y1); q.addColorStop(0, '#8aa84e'); q.addColorStop(0.55, '#5a7a3a'); q.addColorStop(1, '#3a5230'); return q; };
        const el = (x, y, rx, ry, rot, fons) => { ctx.fillStyle = fons; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); };
        // cuixes del darrere (plegades) i peus palmats
        [-1, 1].forEach(sd => {
            const x = W * (0.5 + sd * 0.34);
            el(x, H * 0.7, W * 0.16, H * 0.22, sd * 0.55, pell(x - W * 0.1, H * 0.5, x + W * 0.1, H * 0.9));
            el(x + sd * W * 0.05, H * 0.9, W * 0.15, H * 0.06, sd * 0.1, '#4a6234');
            [-0.07, 0, 0.07].forEach(d => { ctx.beginPath(); ctx.arc(x + sd * W * (0.14 + d), H * 0.92, W * 0.025, 0, Math.PI * 2); ctx.fillStyle = '#6a8a44'; ctx.fill(); ctx.stroke(); });
        });
        // cos
        el(W * 0.5, H * 0.62, W * 0.34, H * 0.29, 0, pell(W * 0.3, H * 0.35, W * 0.7, H * 0.9));
        // panxa i sac gular clars
        g = ctx.createRadialGradient(W * 0.5, H * 0.7, 2, W * 0.5, H * 0.7, W * 0.22);
        g.addColorStop(0, '#f0e8a0'); g.addColorStop(1, '#b8a860');
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(W * 0.5, H * 0.72, W * 0.21, H * 0.16, 0, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = L * 0.5; ctx.strokeStyle = 'rgba(80,60,20,0.5)'; ctx.stroke(); ctx.lineWidth = L; ctx.strokeStyle = CONTORN;
        // braços i mans amb dits
        [-1, 1].forEach(sd => {
            const x = W * (0.5 + sd * 0.2);
            el(x, H * 0.82, W * 0.06, H * 0.12, sd * -0.25, pell(x, H * 0.7, x, H * 0.95));
            [-1, 0, 1].forEach(d => { ctx.fillStyle = '#6a8a44'; ctx.beginPath(); ctx.arc(x + sd * W * 0.01 + d * W * 0.045, H * 0.93, W * 0.028, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
        });
        // berrugues liles amb llum
        [[0.34, 0.55], [0.46, 0.5], [0.6, 0.53], [0.7, 0.62], [0.28, 0.66], [0.52, 0.62], [0.4, 0.62]].forEach(([x, y], k) => {
            const r = W * (0.028 + (k % 3) * 0.006);
            ctx.fillStyle = '#8a5aae'; ctx.beginPath(); ctx.arc(W * x, H * y, r, 0, Math.PI * 2); ctx.fill();
            ctx.lineWidth = L * 0.4; ctx.strokeStyle = 'rgba(40,10,60,0.7)'; ctx.stroke();
            ctx.fillStyle = 'rgba(255,230,255,0.7)'; ctx.beginPath(); ctx.arc(W * x - r * 0.3, H * y - r * 0.3, r * 0.3, 0, Math.PI * 2); ctx.fill();
        });
        ctx.lineWidth = L; ctx.strokeStyle = CONTORN;
        // cap ample, ulls sortints i boca
        el(W * 0.5, H * 0.4, W * 0.3, H * 0.2, 0, pell(W * 0.3, H * 0.2, W * 0.7, H * 0.55));
        ctx.beginPath(); ctx.moveTo(W * 0.24, H * 0.46); ctx.quadraticCurveTo(W * 0.5, H * 0.6, W * 0.76, H * 0.46); ctx.stroke();
        [0.3, 0.7].forEach(x => {
            el(W * x, H * 0.24, W * 0.115, W * 0.115, 0, pell(W * x, H * 0.1, W * x, H * 0.35));
            ctx.save(); ctx.shadowColor = '#c080ff'; ctx.shadowBlur = W * 0.08;
            g = ctx.createRadialGradient(W * x - 2, H * 0.22, 1, W * x, H * 0.24, W * 0.085);
            g.addColorStop(0, '#fff6a0'); g.addColorStop(1, '#e0b020');
            ctx.fillStyle = g; ctx.beginPath(); ctx.arc(W * x, H * 0.24, W * 0.085, 0, Math.PI * 2); ctx.fill(); ctx.restore();
            ctx.lineWidth = L * 0.6; ctx.stroke();
            ctx.fillStyle = '#20100a'; ctx.beginPath(); ctx.ellipse(W * x, H * 0.24, W * 0.016, W * 0.06, 0, 0, Math.PI * 2); ctx.fill();   // pupil·la vertical
            ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.arc(W * x - W * 0.03, H * 0.2, W * 0.015, 0, Math.PI * 2); ctx.fill();
            ctx.lineWidth = L; ctx.strokeStyle = CONTORN;
        });
        [0.46, 0.54].forEach(x => { ctx.fillStyle = '#1e1a10'; ctx.beginPath(); ctx.arc(W * x, H * 0.34, W * 0.012, 0, Math.PI * 2); ctx.fill(); });   // narius
        // brillantor humida al llom
        ctx.fillStyle = 'rgba(255,255,255,0.28)'; ctx.beginPath(); ctx.ellipse(W * 0.4, H * 0.4, W * 0.1, H * 0.035, -0.2, 0, Math.PI * 2); ctx.fill();
        // volutes de boira que pugen
        ctx.strokeStyle = 'rgba(190,150,255,0.55)'; ctx.lineWidth = L * 0.8;
        [[0.22, 0.2], [0.8, 0.28]].forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(W * x, H * y); ctx.bezierCurveTo(W * (x + 0.06), H * (y - 0.08), W * (x - 0.05), H * (y - 0.12), W * x, H * (y - 0.2)); ctx.stroke(); });
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
    const L = w / RES, H = Math.round(L * 0.46);
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
        const L = W / 30;
        ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = CONTORN; ctx.lineWidth = L;
        ombraTerra(ctx, W * 0.46, H * 0.93, W * 0.4, H * 0.06);
        const clar = boira ? '#e6dcf8' : '#fbf8ee', mig = boira ? '#bcaee0' : '#e6dfcc', fosc = boira ? '#8c78b8' : '#bdb49c';
        const pata = (x, d, ombra) => {                       // pota fina fosca amb peülla
            ctx.fillStyle = ombra ? '#2a1e22' : '#3a2a2e';
            ctx.beginPath(); ctx.roundRect(W * x, H * 0.66, W * 0.052, H * 0.26, 3); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#16100e'; ctx.fillRect(W * x - 1, H * 0.9, W * 0.052 + 2, H * 0.04);
        };
        pata(0.27, 0, true); pata(0.58, 0, true); pata(0.35, 0, false); pata(0.66, 0, false);
        // la llana: núvol de flocs; primer el contorn (només es veu la silueta) i després el farciment amb volum
        const flocs = [[0.46, 0.46, 0.22], [0.28, 0.5, 0.16], [0.64, 0.48, 0.17], [0.4, 0.3, 0.16], [0.55, 0.3, 0.15], [0.25, 0.36, 0.11], [0.7, 0.34, 0.11],
                       [0.34, 0.63, 0.12], [0.5, 0.64, 0.13], [0.62, 0.62, 0.11], [0.2, 0.55, 0.09]];
        ctx.lineWidth = L * 2;
        flocs.forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(W * x, H * y, W * r, 0, Math.PI * 2); ctx.stroke(); });
        flocs.forEach(([x, y, r]) => {
            const g = ctx.createRadialGradient(W * (x - r * 0.35), H * (y - r * 0.5), 1, W * x, H * y, W * r * 1.05);
            g.addColorStop(0, clar); g.addColorStop(0.65, mig); g.addColorStop(1, fosc);
            ctx.fillStyle = g; ctx.beginPath(); ctx.arc(W * x, H * y, W * r, 0, Math.PI * 2); ctx.fill();
        });
        ctx.lineWidth = L * 0.45; ctx.strokeStyle = 'rgba(60,40,70,0.28)';
        [[0.36, 0.5], [0.52, 0.46], [0.46, 0.62], [0.6, 0.36], [0.3, 0.42]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(W * x, H * y, W * 0.05, 0.3, 2.6); ctx.stroke(); });   // rinxols
        ctx.strokeStyle = CONTORN; ctx.lineWidth = L;
        // cua petita
        ctx.fillStyle = clar; ctx.beginPath(); ctx.arc(W * 0.14, H * 0.5, W * 0.045, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // coll de llana i cap fosc, de perfil cap a la dreta
        ctx.fillStyle = '#3a2a2e';
        ctx.beginPath(); ctx.ellipse(W * 0.84, H * 0.5, W * 0.09, H * 0.2, 0.15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#4a383c'; ctx.beginPath(); ctx.ellipse(W * 0.9, H * 0.58, W * 0.05, H * 0.1, 0.25, 0, Math.PI * 2); ctx.fill(); ctx.stroke();   // morro
        ctx.fillStyle = '#1a1214'; ctx.beginPath(); ctx.arc(W * 0.93, H * 0.56, W * 0.012, 0, Math.PI * 2); ctx.fill();
        // orella caiguda
        ctx.fillStyle = '#2e2024'; ctx.beginPath(); ctx.ellipse(W * 0.76, H * 0.5, W * 0.07, H * 0.06, -0.55, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // serrell de llana al front
        ctx.fillStyle = clar; ctx.beginPath(); ctx.arc(W * 0.8, H * 0.33, W * 0.05, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(W * 0.86, H * 0.33, W * 0.04, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // ull
        if (boira) {
            ctx.save(); ctx.shadowColor = '#d890ff'; ctx.shadowBlur = W * 0.06;
            ctx.fillStyle = '#f0b8ff'; ctx.beginPath(); ctx.arc(W * 0.86, H * 0.46, W * 0.03, 0, Math.PI * 2); ctx.fill(); ctx.restore();
            ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(W * 0.86, H * 0.46, W * 0.012, 0, Math.PI * 2); ctx.fill();
            // boira que ho amara tot
            const g = ctx.createRadialGradient(W / 2, H * 0.55, W * 0.15, W / 2, H * 0.55, W * 0.6);
            g.addColorStop(0, 'rgba(140,80,200,0)'); g.addColorStop(1, 'rgba(140,80,200,0.38)');
            ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(W / 2, H * 0.58, W * 0.52, H * 0.46, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(190,150,255,0.35)';
            [[0.24, 0.92, 0.14], [0.52, 0.94, 0.17], [0.76, 0.92, 0.12]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.ellipse(W * x, H * y, W * r, H * 0.05, 0, 0, Math.PI * 2); ctx.fill(); });
        } else {
            ctx.fillStyle = '#fff6d8'; ctx.beginPath(); ctx.arc(W * 0.865, H * 0.46, W * 0.016, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#1a1214'; ctx.beginPath(); ctx.arc(W * 0.87, H * 0.46, W * 0.009, 0, Math.PI * 2); ctx.fill();
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

// Masia de pagès: planta baixa de pedra amb el portal d'arc al mig, dues finestres per banda, teulada de teules amb xemeneia fumant
function dibuixarMasia(c, w) {
    lienc(c, w, w * 0.62, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 6, W * 0.52, 9);
        const base = H - 8, sostre = H * 0.4;
        // Xemeneia (darrere la teulada) amb un tall de fum
        carreus(ctx, W * 0.74, H * 0.0, W * 0.07, H * 0.26, '#9a8a6c', H * 0.04, W * 0.035, 5);
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 3; ctx.strokeRect(W * 0.74, H * 0.0, W * 0.07, H * 0.26);
        ctx.fillStyle = '#6a5c48'; ctx.fillRect(W * 0.725, H * 0.0, W * 0.10, H * 0.025); ctx.strokeRect(W * 0.725, H * 0.0, W * 0.10, H * 0.025);
        // Paret de carreus, amb sòcol més fosc
        carreus(ctx, 0, sostre, W, base - sostre, '#d6c298', H * 0.05, W * 0.07, 11);
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 4; ctx.strokeRect(0, sostre, W, base - sostre);
        ctx.fillStyle = 'rgba(60,44,26,0.28)'; ctx.fillRect(0, base - H * 0.07, W, H * 0.07);
        // Cantonades de pedra picada
        ctx.fillStyle = '#b3a07a';
        for (let y = sostre + 6; y < base - 14; y += H * 0.1) { ctx.fillRect(0, y, W * 0.035, H * 0.07); ctx.strokeRect(0, y, W * 0.035, H * 0.07); ctx.fillRect(W * 0.965, y, W * 0.035, H * 0.07); ctx.strokeRect(W * 0.965, y, W * 0.035, H * 0.07); }
        // Finestres
        const fw = W * 0.075, fh = H * 0.2, fy = sostre + H * 0.12;
        [W * 0.1, W * 0.26, W * 0.665, W * 0.825].forEach(x => finestra(ctx, x, fy, fw, fh, { guardapols: false, marc: '#b3a07a', vidre: '#2c3640' }));
        // Portal d'arc de fusta amb ferratges, al mig
        const pw = W * 0.15, px = W / 2 - pw / 2, py = sostre + H * 0.16;
        ctx.fillStyle = '#b3a07a'; ctx.beginPath(); ctx.moveTo(px - 7, base); ctx.lineTo(px - 7, py + pw * 0.5); ctx.arc(W / 2, py + pw * 0.5, pw / 2 + 7, Math.PI, 0); ctx.lineTo(px + pw + 7, base); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#5a3a20'; ctx.beginPath(); ctx.moveTo(px, base); ctx.lineTo(px, py + pw * 0.5); ctx.arc(W / 2, py + pw * 0.5, pw / 2, Math.PI, 0); ctx.lineTo(px + pw, base); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#2a1a0c'; ctx.lineWidth = 2;
        for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(px + pw * k / 4, py + pw * 0.2); ctx.lineTo(px + pw * k / 4, base); ctx.stroke(); }
        ctx.strokeStyle = '#3a3a40'; ctx.lineWidth = 4;
        [0.18, 0.38].forEach(f => { ctx.beginPath(); ctx.moveTo(px, py + pw * 0.5 + (base - py) * f); ctx.lineTo(px + pw, py + pw * 0.5 + (base - py) * f); ctx.stroke(); });
        ctx.fillStyle = '#d8b050'; ctx.beginPath(); ctx.arc(px + pw * 0.8, base - H * 0.14, 3.5, 0, Math.PI * 2); ctx.fill();
        // Teulada
        teuladaTeules(ctx, W, H * 0.2, sostre + 4, '#a85c3a');
        // Un manat de pebrots i un cove penjats a la façana, a l'esquerra del portal
        ctx.strokeStyle = '#4a3a24'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W * 0.4, sostre + H * 0.04); ctx.lineTo(W * 0.4, sostre + H * 0.1); ctx.stroke();
        ctx.fillStyle = '#b8402e'; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.ellipse(W * 0.4 + (k % 2 ? 4 : -4), sostre + H * 0.12 + k * 5, 2.6, 6, 0, 0, Math.PI * 2); ctx.fill(); }
    });
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
    // Un llaç de debò: dues gases amb el plec interior, el nus al mig i dues cues que pengen acabades en punta de cua d'oreneta
    lienc(c, w, w * 0.9, (ctx, W, H) => {
        const u = W / 56, cx = W / 2, cy = H * 0.36;
        ctx.lineWidth = 2.2 * u; ctx.strokeStyle = CONTORN;
        [-1, 1].forEach(s => {
            ctx.fillStyle = '#cc6088';
            ctx.beginPath(); ctx.moveTo(cx - s * u, cy + 2 * u); ctx.lineTo(cx + s * 5 * u, cy + 2 * u);
            ctx.lineTo(cx + s * 16 * u, H * 0.95); ctx.lineTo(cx + s * 11 * u, H * 0.86); ctx.lineTo(cx + s * 6 * u, H * 0.95);
            ctx.closePath(); ctx.fill(); ctx.stroke();
        });
        [-1, 1].forEach(s => {
            ctx.fillStyle = '#ec8cae';
            ctx.beginPath(); ctx.moveTo(cx, cy);
            ctx.bezierCurveTo(cx + s * 9 * u, cy - 21 * u, cx + s * 27 * u, cy - 19 * u, cx + s * 26 * u, cy);
            ctx.bezierCurveTo(cx + s * 26 * u, cy + 17 * u, cx + s * 9 * u, cy + 15 * u, cx, cy);
            ctx.fill(); ctx.stroke();
            ctx.fillStyle = 'rgba(150,40,90,0.45)';                       // el plec de dins de la gasa
            ctx.beginPath(); ctx.moveTo(cx + s * 4 * u, cy);
            ctx.bezierCurveTo(cx + s * 10 * u, cy - 9 * u, cx + s * 17 * u, cy - 7 * u, cx + s * 17 * u, cy);
            ctx.bezierCurveTo(cx + s * 16 * u, cy + 5 * u, cx + s * 9 * u, cy + 5 * u, cx + s * 4 * u, cy);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 1.6 * u;   // lluentor
            ctx.beginPath(); ctx.moveTo(cx + s * 9 * u, cy - 10 * u); ctx.quadraticCurveTo(cx + s * 17 * u, cy - 15 * u, cx + s * 22 * u, cy - 8 * u); ctx.stroke();
            ctx.strokeStyle = CONTORN; ctx.lineWidth = 2.2 * u;
        });
        ctx.fillStyle = '#c0507a';
        ctx.beginPath(); ctx.roundRect(cx - 5 * u, cy - 6.5 * u, 10 * u, 13 * u, 3 * u); ctx.fill(); ctx.stroke();
    });
}

// Dipòsit d'aigua de la serra: un cilindre de pedra mig colgat, amb el coronament, l'aigua fosca amb el reflex de la
// lluna, filades de carreus, regalims d'humitat, molsa al peu, una escala de ferro i una vàlvula
function dibuixarDiposit(c, w) {
    lienc(c, w, w * 0.8, (ctx, W, H) => {
        const u = W / 300, cx = W / 2, rx = W * 0.44, ry = H * 0.15, dalt = H * 0.3, baix = H * 0.8, alt = baix - dalt;
        ombraTerra(ctx, cx + 10 * u, baix + 8 * u, rx + 18 * u, ry * 0.95);
        ctx.lineWidth = 3.5 * u; ctx.strokeStyle = CONTORN; ctx.lineCap = 'round';
        // Paret: de la llum (esquerra) a l'ombra (dreta)
        const g = ctx.createLinearGradient(cx - rx, 0, cx + rx, 0);
        g.addColorStop(0, '#bdb4a2'); g.addColorStop(0.3, '#a89e8a'); g.addColorStop(0.75, '#7a7264'); g.addColorStop(1, '#55504a');
        const paret = () => { ctx.beginPath(); ctx.moveTo(cx - rx, dalt); ctx.lineTo(cx - rx, baix); ctx.ellipse(cx, baix, rx, ry, 0, Math.PI, 0, true); ctx.lineTo(cx + rx, dalt); ctx.closePath(); };
        ctx.fillStyle = g; paret(); ctx.fill();
        ctx.save(); paret(); ctx.clip();
        // Filades de carreus que segueixen la corba del cilindre, amb les juntes verticals alternades
        const n = 5, hf = alt / n;
        for (let i = 0; i <= n; i++) {
            ctx.strokeStyle = 'rgba(40,32,24,0.45)'; ctx.lineWidth = 1.6 * u;
            ctx.beginPath(); ctx.ellipse(cx, dalt + i * hf, rx, ry, 0, 0, Math.PI); ctx.stroke();
            if (i === n) break;
            for (let j = 0; j < 8; j++) {
                const t = (j + (i % 2) * 0.5 + 0.25) / 8 * Math.PI, x = cx + rx * Math.cos(t), y = dalt + i * hf + ry * Math.sin(t);
                ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + hf); ctx.stroke();
            }
        }
        // Regalims d'humitat i molsa al peu
        [0.18, 0.42, 0.66, 0.83].forEach((f, k) => {
            const x = cx - rx + f * rx * 2, gr = ctx.createLinearGradient(0, dalt, 0, baix);
            gr.addColorStop(0, 'rgba(30,40,40,0.35)'); gr.addColorStop(1, 'rgba(30,40,40,0)');
            ctx.fillStyle = gr; ctx.fillRect(x, dalt + ry * 0.6, (6 + k * 2) * u, alt * (0.5 + 0.12 * k));
        });
        for (let k = 0; k < 26; k++) {
            const t = k / 25 * Math.PI, x = cx + rx * Math.cos(t), y = baix + ry * Math.sin(t) - (4 + (k * 7) % 9) * u;
            ctx.fillStyle = k % 3 ? 'rgba(70,110,50,0.75)' : 'rgba(110,150,70,0.7)';
            ctx.beginPath(); ctx.ellipse(x, y, (10 + (k * 5) % 8) * u, (5 + (k * 3) % 4) * u, 0, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 3.5 * u; paret(); ctx.stroke();
        // Coronament: anell de pedra clara, la paret de dins (fosca) i l'aigua una mica més avall
        ctx.fillStyle = '#d2cab8'; ctx.beginPath(); ctx.ellipse(cx, dalt, rx + 7 * u, ry + 6 * u, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#e6dfcf'; ctx.beginPath(); ctx.ellipse(cx, dalt - 1.5 * u, rx + 2 * u, ry + 2 * u, 0, Math.PI * 1.05, Math.PI * 1.6); ctx.lineTo(cx, dalt); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#3e3a34'; ctx.beginPath(); ctx.ellipse(cx, dalt, rx - 8 * u, ry - 6 * u, 0, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = 2 * u; ctx.stroke();
        const ai = ctx.createRadialGradient(cx - rx * 0.2, dalt + 2 * u, 4 * u, cx, dalt + 6 * u, rx);
        ai.addColorStop(0, '#2c5478'); ai.addColorStop(1, '#0e1e34');
        ctx.fillStyle = ai; ctx.beginPath(); ctx.ellipse(cx, dalt + 6 * u, rx - 12 * u, ry - 10 * u, 0, 0, Math.PI * 2); ctx.fill();
        // Ones i el reflex de la lluna
        ctx.strokeStyle = 'rgba(160,200,240,0.35)'; ctx.lineWidth = 1.5 * u;
        [[-0.4, 2], [0.1, 9], [-0.15, -3], [0.45, 4]].forEach(([f, dy]) => { ctx.beginPath(); ctx.ellipse(cx + f * rx, dalt + 6 * u + dy * u, 18 * u, 2.5 * u, 0, 0, Math.PI); ctx.stroke(); });
        const ll = ctx.createRadialGradient(cx + rx * 0.28, dalt + 5 * u, 0, cx + rx * 0.28, dalt + 5 * u, 26 * u);
        ll.addColorStop(0, 'rgba(255,250,215,0.95)'); ll.addColorStop(0.35, 'rgba(255,240,190,0.45)'); ll.addColorStop(1, 'rgba(255,240,190,0)');
        ctx.fillStyle = ll; ctx.beginPath(); ctx.ellipse(cx + rx * 0.28, dalt + 5 * u, 26 * u, 7 * u, 0, 0, Math.PI * 2); ctx.fill();
        // Escala de ferro, a la dreta, des del coronament fins a terra
        const ex = cx + rx * 0.5, ey0 = dalt + ry * 0.75, ey1 = baix + ry * Math.sin(Math.acos(0.5)) - 4 * u;
        ctx.strokeStyle = '#1e1c1a'; ctx.lineWidth = 3 * u;
        [-7, 7].forEach(d => { ctx.beginPath(); ctx.moveTo(ex + d * u, ey0 - 14 * u); ctx.quadraticCurveTo(ex + d * u, ey0 - 22 * u, ex + d * u - 6 * u, ey0 - 22 * u); ctx.moveTo(ex + d * u, ey0 - 14 * u); ctx.lineTo(ex + d * u, ey1); ctx.stroke(); });
        ctx.lineWidth = 2.2 * u;
        for (let y = ey0 - 8 * u; y < ey1 - 4 * u; y += 11 * u) { ctx.beginPath(); ctx.moveTo(ex - 7 * u, y); ctx.lineTo(ex + 7 * u, y); ctx.stroke(); }
        ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1 * u;
        ctx.beginPath(); ctx.moveTo(ex - 8 * u, ey0 - 12 * u); ctx.lineTo(ex - 8 * u, ey1); ctx.stroke();
        // Tub de sortida amb la vàlvula, a l'esquerra del peu
        const vx = cx - rx * 0.5, vy = baix + ry * 0.75;
        ctx.fillStyle = '#4a4a4c'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 2.5 * u;
        ctx.fillRect(vx - 6 * u, vy - 16 * u, 12 * u, 18 * u); ctx.strokeRect(vx - 6 * u, vy - 16 * u, 12 * u, 18 * u);
        ctx.strokeStyle = '#9a2a20'; ctx.lineWidth = 3 * u; ctx.beginPath(); ctx.arc(vx, vy - 20 * u, 8 * u, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(vx - 8 * u, vy - 20 * u); ctx.lineTo(vx + 8 * u, vy - 20 * u); ctx.moveTo(vx, vy - 28 * u); ctx.lineTo(vx, vy - 12 * u); ctx.stroke();
    });
}

// Trípode de fusta del mirador dels Dipòsits, amb abraçadores de llautó. ambTub: amb el telescopi del Garf muntat
function dibuixarTelescopiMon(c, w, ambTub = true) {
    lienc(c, w, w * 1.6, (ctx, W, H) => {
        const u = W / 80, cx = W / 2, cap = H * 0.46, peu = H - 8 * u;
        ombraTerra(ctx, cx, peu + 2 * u, W * 0.44, 6 * u);
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        const pota = (x2, y2, clar) => {
            ctx.strokeStyle = CONTORN; ctx.lineWidth = 7 * u; ctx.beginPath(); ctx.moveTo(cx, cap); ctx.lineTo(x2, y2); ctx.stroke();
            ctx.strokeStyle = clar ? '#a8743e' : '#6e4a28'; ctx.lineWidth = 4.2 * u; ctx.beginPath(); ctx.moveTo(cx, cap); ctx.lineTo(x2, y2); ctx.stroke();
            ctx.strokeStyle = clar ? 'rgba(255,220,160,0.5)' : 'rgba(255,220,160,0.2)'; ctx.lineWidth = 1.2 * u;
            ctx.beginPath(); ctx.moveTo(cx - 1.2 * u, cap + 4 * u); ctx.lineTo(x2 - 1.2 * u, y2 - 2 * u); ctx.stroke();
            const mx = cx + (x2 - cx) * 0.55, my = cap + (y2 - cap) * 0.55;
            ctx.fillStyle = '#d8b04a'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 1.5 * u;
            ctx.beginPath(); ctx.arc(mx, my, 3.2 * u, 0, Math.PI * 2); ctx.fill(); ctx.stroke();                 // abraçadora
            ctx.fillStyle = '#2a2622'; ctx.beginPath(); ctx.arc(x2, y2, 2.6 * u, 0, Math.PI * 2); ctx.fill();   // contera
        };
        pota(cx + 5 * u, peu - 12 * u, false);
        // Corda tensora entre les potes
        ctx.strokeStyle = '#c8b48a'; ctx.lineWidth = 1.4 * u;
        ctx.beginPath(); ctx.moveTo(cx - W * 0.26, cap + (peu - cap) * 0.66); ctx.lineTo(cx + 4 * u, cap + (peu - cap) * 0.62); ctx.lineTo(cx + W * 0.26, cap + (peu - cap) * 0.66); ctx.stroke();
        pota(cx - W * 0.4, peu, true);
        pota(cx + W * 0.4, peu, true);
        // Capçal de llautó
        ctx.fillStyle = '#c89a3a'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 2 * u;
        ctx.beginPath(); ctx.ellipse(cx, cap, 9 * u, 4 * u, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillRect(cx - 3 * u, cap - 12 * u, 6 * u, 10 * u); ctx.strokeRect(cx - 3 * u, cap - 12 * u, 6 * u, 10 * u);
        if (!ambTub) {
            ctx.fillStyle = '#c89a3a'; ctx.beginPath(); ctx.arc(cx, cap - 14 * u, 4.5 * u, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
            return;
        }
        // El telescopi: tub de llautó que s'eixampla cap a l'objectiu, amb una faixa de cuir, l'ocular i un reflex al vidre
        ctx.save(); ctx.translate(cx, cap - 14 * u); ctx.rotate(-0.62);
        const tg = ctx.createLinearGradient(0, -7 * u, 0, 7 * u);
        tg.addColorStop(0, '#f6dc86'); tg.addColorStop(0.45, '#d4a840'); tg.addColorStop(1, '#8a6420');
        ctx.fillStyle = tg; ctx.strokeStyle = CONTORN; ctx.lineWidth = 2 * u;
        ctx.beginPath(); ctx.moveTo(-26 * u, -4 * u); ctx.lineTo(30 * u, -7 * u); ctx.lineTo(30 * u, 7 * u); ctx.lineTo(-26 * u, 4 * u); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillRect(28 * u, -9 * u, 8 * u, 18 * u); ctx.strokeRect(28 * u, -9 * u, 8 * u, 18 * u);              // para-sol de l'objectiu
        ctx.fillStyle = '#7a2a1c'; ctx.fillRect(-2 * u, -5.6 * u, 9 * u, 11.2 * u); ctx.strokeRect(-2 * u, -5.6 * u, 9 * u, 11.2 * u);   // faixa de cuir
        ctx.fillStyle = '#d4a840'; ctx.fillRect(-34 * u, -2.8 * u, 9 * u, 5.6 * u); ctx.strokeRect(-34 * u, -2.8 * u, 9 * u, 5.6 * u);   // ocular
        ctx.fillStyle = '#16243a'; ctx.beginPath(); ctx.ellipse(36 * u, 0, 2.2 * u, 8 * u, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(200,230,255,0.85)'; ctx.beginPath(); ctx.ellipse(36.5 * u, -3.5 * u, 1 * u, 2.2 * u, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    });
}

// Runna dibuixada a mà, com la del joc: fulla recta d'acer blavós amb canal central, creuera de bronze corbada cap a la
// fulla, empunyadura de cuir negre amb anelles i pom arrodonit. La punta és a (0, 0) i l'espasa puja cap a -y; s = mida
// (1 = 255 unitats de llarg). u = píxels per unitat.
function traceEspasa(ctx, u, s) {
    const k = u * s, Y = v => -v * k, X = v => v * k;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = CONTORN; ctx.lineWidth = Math.max(1.6, 2.2 * k);
    // Fulla
    const bl = ctx.createLinearGradient(X(-7.6), 0, X(7.6), 0);
    bl.addColorStop(0, '#e2eaf6'); bl.addColorStop(0.3, '#aebfdc'); bl.addColorStop(0.7, '#7f9bc4'); bl.addColorStop(1, '#556e98');
    ctx.fillStyle = bl; ctx.beginPath();
    ctx.moveTo(0, 0); ctx.quadraticCurveTo(X(-3.4), Y(8), X(-6.6), Y(34)); ctx.lineTo(X(-7.4), Y(188)); ctx.lineTo(X(-8.2), Y(193)); ctx.lineTo(X(-7.6), Y(200));
    ctx.lineTo(X(7.6), Y(200)); ctx.lineTo(X(8.2), Y(193)); ctx.lineTo(X(7.4), Y(188)); ctx.lineTo(X(6.6), Y(34)); ctx.quadraticCurveTo(X(3.4), Y(8), 0, 0);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(60,84,130,0.7)'; ctx.lineWidth = Math.max(1, 1.8 * k); ctx.beginPath(); ctx.moveTo(0, Y(16)); ctx.lineTo(0, Y(192)); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.65)'; ctx.lineWidth = Math.max(1, 1.5 * k); ctx.beginPath(); ctx.moveTo(X(-4.4), Y(40)); ctx.lineTo(X(-4.6), Y(186)); ctx.stroke();
    ctx.strokeStyle = CONTORN; ctx.lineWidth = Math.max(1.6, 2.2 * k);
    // Empunyadura i pom
    ctx.fillStyle = '#26251f'; ctx.beginPath(); ctx.rect(X(-3.4), Y(238), X(6.8), -Y(238) + Y(204)); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(112,108,84,0.8)'; ctx.lineWidth = Math.max(1, 1.4 * k);
    for (let v = 208; v < 236; v += 5) { ctx.beginPath(); ctx.moveTo(X(-3.4), Y(v)); ctx.lineTo(X(3.4), Y(v + 3)); ctx.stroke(); }
    ctx.strokeStyle = CONTORN; ctx.lineWidth = Math.max(1.6, 2.2 * k);
    const bronze = ctx.createLinearGradient(0, Y(256), 0, Y(196)); bronze.addColorStop(0, '#e2bc6a'); bronze.addColorStop(1, '#8a6430');
    ctx.fillStyle = bronze;
    [222, 232].forEach(v => { ctx.beginPath(); ctx.rect(X(-4.2), Y(v + 2), X(8.4), -Y(v + 2) + Y(v - 1)); ctx.fill(); ctx.stroke(); });
    ctx.beginPath(); ctx.ellipse(0, Y(246), X(6.4), 9 * k, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // Creuera: corba, amb els braços cap a la fulla
    ctx.fillStyle = bronze; ctx.beginPath();
    ctx.moveTo(X(-17.5), Y(196)); ctx.quadraticCurveTo(X(-15), Y(206), 0, Y(209)); ctx.quadraticCurveTo(X(15), Y(206), X(17.5), Y(196));
    ctx.lineTo(X(14.5), Y(197)); ctx.quadraticCurveTo(X(12), Y(201), 0, Y(203)); ctx.quadraticCurveTo(X(-12), Y(201), X(-14.5), Y(197)); ctx.closePath(); ctx.fill(); ctx.stroke();
}

// Dolmen del Santuari del Miracle (Roc de la Mare de Déu): una llosa de calcària ovalada, grossa i gruixuda, amb la
// superfície rugosa i plena de liquen blanc i ocre, damunt de dos pilars de blocs de pedra. És un sol cos arrodonit: la
// cara de dalt es fon amb el cantell i no té cap segon contorn. Runna no hi és: és un sprite a part (arma_espasa) clavat al
// punt DOLMEN_DIB.ex/ey. 'buit' i 'espasa' donen el mateix dibuix (el dolmen ja no porta l'espasa).
const DOLMEN_DIB = { W: 380, H: 456, dy: 95, ly: 172, ex: 206, ey: 178, esp: 0.5, ent: 40 };   // dy: espai afegit a dalt per a l'espasa; esp: mida de l'espasa (1 = 255 de llarg), ent: unitats de fulla enfonsades a la pedra     // ly: centre de la cara de dalt; ex, ey: on entra la fulla

// mode: 'tot' (dolmen amb l'espasa), 'buit' (sense), 'clavada' (només l'espasa clavada, per dibuixar-la per davant de l'Ineu) o
// 'espasa' (només l'espasa sencera, per quan s'arrenca)
function dibuixarDolmen(c, w, mode = 'tot') {
    lienc(c, w, w * DOLMEN_DIB.H / DOLMEN_DIB.W, (ctx, W, H) => {
        const u = W / 380, peu = 349 * u, ly = DOLMEN_DIB.ly * u, cx = W / 2;
        ctx.translate(0, DOLMEN_DIB.dy * u);
        const RX = 172 * u, RY = 44 * u, T = 50 * u;                       // semieixos de la cara de dalt i gruix del cantell
        let sd = 31; const r = () => (sd = sd * 16807 % 2147483647) / 2147483647;
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        const cos = () => {
        // Només l'ombra normal del terra (cap foscor negra sota la llosa)
        ombraTerra(ctx, cx + 14 * u, peu - 4 * u, W * 0.46, 16 * u);

        // Un bloc de pedra tallat: cara del davant, cara de la dreta i cara de dalt (si es veu)
        const bloc = (x, y, bw, bh, dpt, [cf, cd, cs], cima = true) => {
            ctx.lineWidth = 3 * u; ctx.strokeStyle = CONTORN;
            const ox = dpt, oy = dpt * 0.55;
            ctx.fillStyle = cd; ctx.beginPath(); ctx.moveTo(x + bw, y); ctx.lineTo(x + bw + ox, y - oy); ctx.lineTo(x + bw + ox, y + bh - oy); ctx.lineTo(x + bw, y + bh); ctx.closePath(); ctx.fill(); ctx.stroke();
            const g = ctx.createLinearGradient(x, 0, x + bw, 0); g.addColorStop(0, cf); g.addColorStop(1, cd);
            ctx.fillStyle = g; ctx.beginPath(); ctx.rect(x, y, bw, bh); ctx.fill(); ctx.stroke();
            if (cima) { ctx.fillStyle = cs; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + ox, y - oy); ctx.lineTo(x + bw + ox, y - oy); ctx.lineTo(x + bw, y); ctx.closePath(); ctx.fill(); ctx.stroke(); }
            // Picat i vetes de la pedra
            ctx.save(); ctx.beginPath(); ctx.rect(x, y, bw, bh); ctx.clip();
            for (let k = 0; k < bw * bh / (90 * u * u); k++) { ctx.fillStyle = r() < 0.5 ? 'rgba(50,42,32,0.28)' : 'rgba(255,250,235,0.22)'; ctx.fillRect(x + r() * bw, y + r() * bh, (1 + r() * 2) * u, (1 + r() * 2) * u); }
            ctx.strokeStyle = 'rgba(40,32,24,0.4)'; ctx.lineWidth = 1.4 * u;
            ctx.beginPath(); ctx.moveTo(x + bw * (0.2 + r() * 0.5), y + 2 * u); ctx.lineTo(x + bw * (0.3 + r() * 0.4), y + bh * 0.55); ctx.stroke();
            ctx.restore();
        };
        // Els dos pilars quadrats de sempre, amb la cara del davant i la del costat (no han canviat)
        ctx.lineWidth = 3.5 * u; ctx.strokeStyle = CONTORN;
        const pilar = (x, y0, amp, alt, prof) => {
            ctx.fillStyle = '#9a9282'; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x + amp, y0); ctx.lineTo(x + amp, y0 + alt); ctx.lineTo(x, y0 + alt); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#6e685c'; ctx.beginPath(); ctx.moveTo(x + amp, y0); ctx.lineTo(x + amp + prof, y0 - prof * 0.5); ctx.lineTo(x + amp + prof, y0 + alt - prof * 0.5); ctx.lineTo(x + amp, y0 + alt); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.strokeStyle = 'rgba(40,32,24,0.45)'; ctx.lineWidth = 1.5 * u;
            ctx.beginPath(); ctx.moveTo(x + amp * 0.3, y0 + 8 * u); ctx.lineTo(x + amp * 0.42, y0 + alt * 0.5); ctx.moveTo(x + 6 * u, y0 + alt * 0.62); ctx.lineTo(x + amp - 8 * u, y0 + alt * 0.66); ctx.stroke();
            ctx.fillStyle = 'rgba(96,140,64,0.75)'; ctx.beginPath(); ctx.ellipse(x + amp * 0.5, y0 + alt - 4 * u, amp * 0.55, 6 * u, 0, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = CONTORN; ctx.lineWidth = 3.5 * u;
        };
        pilar(236 * u, 220 * u, 58 * u, peu - 220 * u - 6 * u, 16 * u);           // el del fons, a la dreta
        pilar(92 * u, 226 * u, 74 * u, peu - 226 * u, 18 * u);                     // el del davant, a l'esquerra

        // Ombra de la llosa damunt els pilars
        [[92, 74], [236, 58]].forEach(([x, bw]) => { const sg = ctx.createLinearGradient(0, ly + T + 4 * u, 0, ly + T + 34 * u); sg.addColorStop(0, 'rgba(10,8,6,0.55)'); sg.addColorStop(1, 'rgba(10,8,6,0)'); ctx.fillStyle = sg; ctx.fillRect(x * u, ly + T + 4 * u, bw * u, 30 * u); });

        // La llosa: una sola silueta (la meitat de dalt de l'el·lipse de la cara + la meitat de baix de la del cantell)
        const N = 64, rad = t => 1 + 0.03 * Math.sin(t * 5 + 1) + 0.022 * Math.cos(t * 3) + 0.012 * Math.sin(t * 9);
        const sil = () => {
            ctx.beginPath();
            for (let k = 0; k <= N; k++) { const t = Math.PI + k / N * Math.PI, q = rad(t); const x = cx + Math.cos(t) * RX * q * (1 + 0.04 * Math.cos(t)), y = ly + Math.sin(t) * RY * q; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
            for (let k = 0; k <= N; k++) { const t = k / N * Math.PI, q = rad(t); ctx.lineTo(cx + Math.cos(t) * RX * q * (1 + 0.04 * Math.cos(t)), ly + T * (0.5 + 0.5 * Math.sin(t)) + Math.sin(t) * RY * q * 0.96); }
            ctx.closePath();
        };
        // Un sol degradat vertical: la cara de dalt clara, l'arrodoniment del cantell i la part de sota a l'ombra
        const g = ctx.createLinearGradient(0, ly - RY, 0, ly + T + RY);
        g.addColorStop(0, '#ded8c6'); g.addColorStop(0.3, '#d2cbb7'); g.addColorStop(0.5, '#c0b8a2'); g.addColorStop(0.62, '#a39b86'); g.addColorStop(0.8, '#7c7464'); g.addColorStop(1, '#4e483e');
        ctx.fillStyle = g; sil(); ctx.fill();
        ctx.save(); sil(); ctx.clip();
        // Llum càlida del capvespre a l'esquerra i ombra a la dreta
        const l = ctx.createLinearGradient(cx - RX, 0, cx + RX, 0);
        l.addColorStop(0, 'rgba(255,236,190,0.28)'); l.addColorStop(0.5, 'rgba(255,255,255,0)'); l.addColorStop(1, 'rgba(30,24,40,0.3)');
        ctx.fillStyle = l; ctx.fillRect(0, 0, W, H);
        // Pigues fosques i grans de la pedra
        for (let k = 0; k < 420; k++) {
            const x = cx + (r() - 0.5) * 2 * RX, y = ly - RY + r() * (2 * RY + T);
            ctx.fillStyle = r() < 0.55 ? 'rgba(56,48,38,0.38)' : 'rgba(255,255,255,0.3)';
            ctx.beginPath(); ctx.arc(x, y, (0.5 + r() * 1.0) * u, 0, Math.PI * 2); ctx.fill();
        }
        // Clapes de liquen: blanc-crema, ocre i verd grisenc; cada clapa és un munt de cercles petits
        const clapa = (x, y, rr, col, n) => { ctx.fillStyle = col; for (let k = 0; k < n; k++) { const a = r() * 6.28, d = Math.sqrt(r()) * rr; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.45, (1.6 + r() * 3.4) * u, (1 + r() * 2) * u, r(), 0, Math.PI * 2); ctx.fill(); } };
        for (let k = 0; k < 20; k++) {
            const x = cx + (r() - 0.5) * 2 * RX * 0.9, y = ly + (r() - 0.45) * RY * 1.5 + (r() < 0.25 ? T * 0.5 : 0), rr = (12 + r() * 22) * u;
            clapa(x, y, rr, 'rgba(240,236,218,0.6)', 46);
            if (r() < 0.55) clapa(x + 4 * u, y, rr * 0.6, 'rgba(176,160,104,0.34)', 14);
            if (r() < 0.35) clapa(x - 3 * u, y + 2 * u, rr * 0.5, 'rgba(128,142,108,0.4)', 12);
        }
        // Esquerdes fines
        ctx.strokeStyle = 'rgba(46,38,30,0.55)'; ctx.lineWidth = 1.5 * u;
        [[-110, -6], [90, -14], [30, 40], [-40, 36]].forEach(([dx, dy]) => { let x = cx + dx * u, y = ly + dy * u; ctx.beginPath(); ctx.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (r() - 0.3) * 14 * u; y += (4 + r() * 9) * u; ctx.lineTo(x, y); } ctx.stroke(); });
        // Lluïssor a l'aresta de dalt
        ctx.strokeStyle = 'rgba(255,252,236,0.5)'; ctx.lineWidth = 3 * u; ctx.beginPath(); ctx.ellipse(cx, ly + 1 * u, RX * 0.96, RY * 0.9, 0, Math.PI * 1.05, Math.PI * 1.9); ctx.stroke();
        ctx.restore();
        // Un únic contorn, el de la silueta
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 3.6 * u; sil(); ctx.stroke();
        // El tall on s'enfonsa la fulla
        ctx.fillStyle = '#1e1a14'; ctx.beginPath(); ctx.ellipse(DOLMEN_DIB.ex * u, DOLMEN_DIB.ey * u, 8 * u, 2.8 * u, 0, 0, Math.PI * 2); ctx.fill();
        };
        if (mode !== 'espasa' && mode !== 'clavada') cos();
        // Runna clavada a la llosa, una mica decantada: la punta és dins la pedra
        if (mode !== 'buit') {
            const exu = DOLMEN_DIB.ex * u, eyu = DOLMEN_DIB.ey * u, ent = DOLMEN_DIB.ent * DOLMEN_DIB.esp * u;
            ctx.save();
            if (mode === 'tot' || mode === 'clavada') { ctx.beginPath(); ctx.rect(-W, -H, 3 * W, H + eyu + 2 * u); ctx.clip(); }      // la part enfonsada a la llosa no es veu
            ctx.translate(exu, eyu); ctx.rotate(0.14); ctx.translate(0, ent);                                   // la punta, dins la pedra
            traceEspasa(ctx, u, DOLMEN_DIB.esp);
            ctx.restore();
            if (mode === 'tot' || mode === 'clavada') {                                                         // vora de davant de la ranura, per sobre la fulla
                ctx.fillStyle = '#1e1a14'; ctx.beginPath(); ctx.ellipse(exu, eyu, 9 * u, 3 * u, 0, 0, Math.PI); ctx.fill();
                ctx.strokeStyle = 'rgba(244,238,214,0.7)'; ctx.lineWidth = 1.6 * u; ctx.beginPath(); ctx.ellipse(exu, eyu + 0.6 * u, 9.6 * u, 3.4 * u, 0, 0.15, Math.PI - 0.15); ctx.stroke();
            }
        }
    });
}

// L'espasa sola, dreta (la punta a dalt), per quan vola: mateix dibuix que la del dolmen
function dibuixarEspasaSola(c, w) {
    lienc(c, w, w * 255 / 34, (ctx, W, H) => {
        ctx.translate(W / 2, 2); ctx.scale(1, -1);
        traceEspasa(ctx, W / 34, 1);
    });
}

// Conill de bosc vist de costat (mira a la dreta)
function dibuixarConill(c, w) {
    lienc(c, w, w * 0.8, (ctx, W, H) => {
        const u = W / 50;
        ctx.lineWidth = 2 * u; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#9a8268';
        ctx.beginPath(); ctx.ellipse(33 * u, 8 * u, 3 * u, 9 * u, 0.25, 0, Math.PI * 2); ctx.fill(); ctx.stroke();          // orella del darrere
        ctx.beginPath(); ctx.ellipse(21 * u, 26 * u, 15 * u, 10 * u, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();          // cos
        ctx.beginPath(); ctx.ellipse(13 * u, 31 * u, 7 * u, 6 * u, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();            // cuixa
        ctx.beginPath(); ctx.arc(36 * u, 20 * u, 8 * u, 0, Math.PI * 2); ctx.fill(); ctx.stroke();                           // cap
        ctx.beginPath(); ctx.ellipse(37 * u, 7 * u, 3.2 * u, 9 * u, 0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();          // orella
        ctx.fillStyle = '#e8b0a8'; ctx.beginPath(); ctx.ellipse(37 * u, 7 * u, 1.4 * u, 6 * u, 0.1, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f4f0e8'; ctx.beginPath(); ctx.arc(6 * u, 24 * u, 4.5 * u, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); // cua
        ctx.fillStyle = CONTORN; ctx.beginPath(); ctx.arc(39 * u, 18 * u, 1.6 * u, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#c86a6a'; ctx.beginPath(); ctx.arc(43.5 * u, 21 * u, 1.2 * u, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#86705a'; ctx.fillRect(26 * u, 33 * u, 4 * u, 6 * u); ctx.strokeRect(26 * u, 33 * u, 4 * u, 6 * u);
    });
}

// Esquirol vist de costat (mira a la dreta), amb la cua gran i arrissada
function dibuixarEsquirol(c, w) {
    lienc(c, w, w * 0.9, (ctx, W, H) => {
        const u = W / 50;
        ctx.lineWidth = 2 * u; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#b05a26';
        ctx.beginPath(); ctx.moveTo(18 * u, 36 * u); ctx.bezierCurveTo(-2 * u, 34 * u, -2 * u, 6 * u, 12 * u, 4 * u); ctx.bezierCurveTo(22 * u, 3 * u, 22 * u, 16 * u, 14 * u, 16 * u);
        ctx.bezierCurveTo(10 * u, 18 * u, 12 * u, 28 * u, 22 * u, 30 * u); ctx.closePath(); ctx.fill(); ctx.stroke();        // cua
        ctx.fillStyle = '#c86e32';
        ctx.beginPath(); ctx.ellipse(27 * u, 32 * u, 10 * u, 8 * u, -0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();          // cos
        ctx.beginPath(); ctx.arc(37 * u, 22 * u, 7 * u, 0, Math.PI * 2); ctx.fill(); ctx.stroke();                            // cap
        ctx.beginPath(); ctx.moveTo(33 * u, 17 * u); ctx.lineTo(34 * u, 9 * u); ctx.lineTo(38 * u, 15 * u); ctx.closePath(); ctx.fill(); ctx.stroke();   // orella
        ctx.fillStyle = '#f2dcb8'; ctx.beginPath(); ctx.ellipse(31 * u, 35 * u, 4 * u, 5 * u, -0.3, 0, Math.PI * 2); ctx.fill();   // panxa
        ctx.fillStyle = CONTORN; ctx.beginPath(); ctx.arc(39.5 * u, 21 * u, 1.5 * u, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(44 * u, 24 * u, 1.1 * u, 0, Math.PI * 2); ctx.fill();
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
    const L = w / RES, H = Math.round(L * 0.8);
    lienc(c, w, H * RES, ctx => { ctx.scale(RES, RES); pintarCabana(ctx, L, H); });
}

// Cabana de la Jaumeta: parets de troncs amb fang, teulat de palla amb molsa i bolets, xemeneia de pedra, porta amb ferros,
// finestra amb porticons i llum verdosa, pila de llenya, farol i manats d'herbes penjats
function pintarCabana(ctx, W, H) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    let llavor = 31;
    const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
    const base = H - 8, x0 = W * 0.08, x1 = W * 0.92, yTop = H * 0.44;
    ombraTerra(ctx, W / 2, H - 5, W * 0.55, 10);
    // Xemeneia de pedra (darrere el teulat)
    const cx0 = W * 0.7, cx1 = W * 0.8;
    ctx.fillStyle = '#8a8478'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
    ctx.fillRect(cx0, H * 0.08, cx1 - cx0, H * 0.3); ctx.strokeRect(cx0, H * 0.08, cx1 - cx0, H * 0.3);
    ctx.strokeStyle = 'rgba(40,36,30,0.55)'; ctx.lineWidth = 1.3;
    for (let y = H * 0.12, r = 0; y < H * 0.38; y += H * 0.055, r++) {
        ctx.beginPath(); ctx.moveTo(cx0, y); ctx.lineTo(cx1, y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx0 + (r % 2 ? 6 : 14), y - H * 0.055); ctx.lineTo(cx0 + (r % 2 ? 6 : 14), y); ctx.moveTo(cx1 - (r % 2 ? 9 : 4), y - H * 0.055); ctx.lineTo(cx1 - (r % 2 ? 9 : 4), y); ctx.stroke();
    }
    ctx.fillStyle = '#5e594f'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 2.5; ctx.fillRect(cx0 - 3, H * 0.055, cx1 - cx0 + 6, 7); ctx.strokeRect(cx0 - 3, H * 0.055, cx1 - cx0 + 6, 7);
    ctx.fillStyle = 'rgba(180,230,140,0.3)';                         // fum verdós
    [[(cx0 + cx1) / 2, H * 0.035, 5], [(cx0 + cx1) / 2 + 6, H * 0.0, 4]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); });

    // Parets de troncs horitzontals, uns sobresortint dels altres a les cantonades
    const files = 7, hT = (base - yTop) / files;
    ctx.fillStyle = '#4d3a26'; ctx.fillRect(x0, yTop, x1 - x0, base - yTop);
    const COL = ['#8e5e32', '#7a4e28', '#9a683a', '#6c4424'];
    for (let i = 0; i < files; i++) {
        const y = yTop + i * hT, xa = x0 - 4 - (i % 2) * 6, xb = x1 + 4 + ((i + 1) % 2) * 6;
        const g = ctx.createLinearGradient(0, y, 0, y + hT);
        g.addColorStop(0, '#b27c46'); g.addColorStop(0.35, COL[i % 4]); g.addColorStop(1, '#3e2812');
        ctx.fillStyle = g; ctx.strokeStyle = CONTORN; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.roundRect(xa, y + 0.6, xb - xa, hT - 1.2, hT * 0.42); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(52,30,12,0.5)'; ctx.lineWidth = 1;
        for (let k = 0; k < 4; k++) { const gx = xa + 14 + rnd() * (xb - xa - 50); ctx.beginPath(); ctx.moveTo(gx, y + hT * (0.35 + rnd() * 0.3)); ctx.lineTo(gx + 20 + rnd() * 22, y + hT * (0.4 + rnd() * 0.25)); ctx.stroke(); }
        [xa + hT * 0.45, xb - hT * 0.45].forEach(ex => {                // cercles dels troncs a les puntes
            ctx.fillStyle = i % 2 ? '#d6a972' : '#c89a62'; ctx.strokeStyle = 'rgba(40,22,8,0.8)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.ellipse(ex, y + hT / 2, hT * 0.24, hT * 0.36, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.beginPath(); ctx.ellipse(ex, y + hT / 2, hT * 0.1, hT * 0.17, 0, 0, Math.PI * 2); ctx.stroke();
        });
        ctx.fillStyle = 'rgba(190,172,128,0.55)'; ctx.fillRect(xa + hT * 0.8, y + hT - 2.6, xb - xa - hT * 1.6, 1.8);      // fang entre troncs
    }
    // Sòcol de pedres
    for (let x = x0 - 8; x < x1 + 8; x += 17 + rnd() * 5) {
        const rx = 9 + rnd() * 4, ry = 5.5 + rnd() * 2;
        ctx.fillStyle = rnd() < 0.5 ? '#8c8a82' : '#76746c'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(x, base - 1, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.beginPath(); ctx.ellipse(x - 2, base - 4, rx * 0.5, ry * 0.35, 0, 0, Math.PI * 2); ctx.fill();
    }
    // Heura que puja per l'esquerra
    ctx.strokeStyle = '#3f6a2c'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x0 + 6, base - 4); ctx.bezierCurveTo(x0 - 4, base - 30, x0 + 16, base - 50, x0 + 4, yTop + 12); ctx.stroke();
    [[x0 + 2, base - 20], [x0 + 12, base - 38], [x0 + 6, base - 52], [x0 + 2, base - 66], [x0 + 12, base - 28]].forEach(([x, y], i) => {
        ctx.fillStyle = i % 2 ? '#5f9a3a' : '#4c8430'; ctx.strokeStyle = '#1e3a12'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(x, y, 5.5, 3.2, i * 0.9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });

    // Finestra amb porticons oberts, marc, travesser i llum verdosa
    const fx = W * 0.2, fy = H * 0.6, fw = 28, fh = 28;
    const lluna = ctx.createRadialGradient(fx + fw / 2, fy + fh / 2, 2, fx + fw / 2, fy + fh / 2, 46);
    lluna.addColorStop(0, 'rgba(190,255,140,0.38)'); lluna.addColorStop(1, 'rgba(190,255,140,0)');
    ctx.fillStyle = lluna; ctx.fillRect(fx - 40, fy - 36, fw + 80, fh + 72);
    ctx.fillStyle = '#1c1208'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3; ctx.fillRect(fx - 3, fy - 3, fw + 6, fh + 6); ctx.strokeRect(fx - 3, fy - 3, fw + 6, fh + 6);
    const vidre = ctx.createLinearGradient(fx, fy, fx + fw, fy + fh);
    vidre.addColorStop(0, '#e2ffb4'); vidre.addColorStop(1, '#a6e070');
    ctx.fillStyle = vidre; ctx.fillRect(fx, fy, fw, fh);
    ctx.strokeStyle = '#4a3018'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(fx + fw / 2, fy); ctx.lineTo(fx + fw / 2, fy + fh); ctx.moveTo(fx, fy + fh / 2); ctx.lineTo(fx + fw, fy + fh / 2); ctx.stroke();
    ctx.strokeRect(fx, fy, fw, fh);
    [[-1, fx - 3], [1, fx + fw + 3]].forEach(([s, bx]) => {            // porticons una mica penjats
        ctx.fillStyle = s < 0 ? '#6a4224' : '#5c3a1e'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(bx, fy - 3); ctx.lineTo(bx + s * 13, fy - 1 + (s < 0 ? 0 : 2)); ctx.lineTo(bx + s * 13, fy + fh + 3 + (s < 0 ? 2 : 0)); ctx.lineTo(bx, fy + fh + 3); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(30,16,6,0.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(bx + s * 6, fy); ctx.lineTo(bx + s * 6, fy + fh + 2); ctx.stroke();
    });
    ctx.fillStyle = '#5a3a1e'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 2;                                         // jardinera amb flors
    ctx.fillRect(fx - 6, fy + fh + 4, fw + 12, 7); ctx.strokeRect(fx - 6, fy + fh + 4, fw + 12, 7);
    [[0, '#d8506a'], [8, '#e8c040'], [16, '#b070e0'], [24, '#d8506a'], [32, '#e8c040']].forEach(([dx, col], i) => {
        ctx.fillStyle = '#3f6a2c'; ctx.fillRect(fx - 3 + dx, fy + fh - 1 - (i % 2) * 3, 1.6, 6);
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(fx - 2.2 + dx, fy + fh - 2 - (i % 2) * 3, 2.6, 0, Math.PI * 2); ctx.fill();
    });

    // Porta tortuga de taulons, amb frontisses i travesser de ferro
    const pw = W * 0.19, px = W / 2 - pw / 2, pt = H * 0.58, pb = base - 3;
    ctx.fillStyle = '#2a1c10'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3.5;
    ctx.fillRect(px - 5, pt - 4, pw + 10, pb - pt + 4); ctx.strokeRect(px - 5, pt - 4, pw + 10, pb - pt + 4);
    ctx.save(); ctx.beginPath(); ctx.rect(px, pt, pw, pb - pt); ctx.clip();
    for (let k = 0; k < 4; k++) {
        const bx = px + pw * k / 4, g = ctx.createLinearGradient(bx, 0, bx + pw / 4, 0);
        g.addColorStop(0, '#74482a'); g.addColorStop(0.5, '#8a5a34'); g.addColorStop(1, '#5e3a20');
        ctx.fillStyle = g; ctx.fillRect(bx, pt + (k % 2) * 1.5, pw / 4 - 1.2, pb - pt);
    }
    ctx.restore();
    ctx.strokeStyle = CONTORN; ctx.lineWidth = 1.6; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(px + pw * k / 4 - 0.6, pt); ctx.lineTo(px + pw * k / 4 - 0.6, pb); ctx.stroke(); }
    ctx.strokeStyle = '#2c2c32'; ctx.lineWidth = 3;
    [pt + (pb - pt) * 0.18, pt + (pb - pt) * 0.72].forEach(y => { ctx.beginPath(); ctx.moveTo(px, y); ctx.lineTo(px + pw * 0.8, y + 1); ctx.stroke(); ctx.fillStyle = '#2c2c32'; ctx.beginPath(); ctx.arc(px + pw * 0.8, y + 1, 3, 0, Math.PI * 2); ctx.fill(); });
    ctx.strokeStyle = CONTORN; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(px + pw * 0.82, pt + (pb - pt) * 0.5, 3.4, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#8a8a90'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 1.5; ctx.fillRect(px - 8, pb - 1, pw + 16, 6); ctx.strokeRect(px - 8, pb - 1, pw + 16, 6);   // graó de pedra
    // Farol penjat al costat de la porta, amb llum verda
    const lx = px - 22, ly = pt + 6;
    const glow = ctx.createRadialGradient(lx, ly + 8, 1, lx, ly + 8, 26);
    glow.addColorStop(0, 'rgba(190,255,130,0.55)'); glow.addColorStop(1, 'rgba(190,255,130,0)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(lx, ly + 8, 26, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = CONTORN; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx, ly - 12); ctx.lineTo(lx, ly); ctx.stroke();
    ctx.fillStyle = '#3a3a40'; ctx.fillRect(lx - 6, ly - 1, 12, 3); ctx.fillRect(lx - 6, ly + 15, 12, 3);
    ctx.fillStyle = '#c6f090'; ctx.fillRect(lx - 4.5, ly + 2, 9, 13); ctx.strokeStyle = CONTORN; ctx.lineWidth = 1.5; ctx.strokeRect(lx - 4.5, ly + 2, 9, 13);
    // Manats d'herbes penjats a la dreta de la porta
    [[px + pw + 16, 0], [px + pw + 28, 1]].forEach(([hx, i]) => {
        const hy = pt - 2 + i * 6;
        ctx.strokeStyle = '#3a2410'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(hx, hy - 6); ctx.lineTo(hx, hy + 4); ctx.stroke();
        [['#5f9a3a', -5], ['#7a5ab0', 0], ['#4c8430', 5]].forEach(([col, dx], k) => {
            ctx.fillStyle = col; ctx.strokeStyle = '#1e3a12'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(hx, hy + 3); ctx.quadraticCurveTo(hx + dx * 2.2, hy + 12, hx + dx * 1.2, hy + 20 + k * 2); ctx.quadraticCurveTo(hx + dx * 0.2, hy + 12, hx, hy + 3); ctx.fill(); ctx.stroke();
        });
    });
    // Pila de llenya a la dreta, sota la façana
    for (let r = 0; r < 3; r++) for (let k = 0; k < 4 - r; k++) {
        const lx2 = x1 - 30 + k * 11 + r * 5.5, ly2 = base - 5 - r * 9;
        ctx.fillStyle = '#9a6a3a'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(lx2, ly2, 5.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#d8ae78'; ctx.beginPath(); ctx.arc(lx2, ly2, 3.2, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(90,56,24,0.7)'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(lx2, ly2, 1.4, 0, Math.PI * 2); ctx.stroke();
    }

    // Teulat de palla i molsa, gruixut, amb serrells a l'ràfec
    const ra = [[-4, H * 0.5], [W * 0.25, H * 0.16], [W * 0.76, H * 0.18], [W + 4, H * 0.5]];
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(x0 - 2, H * 0.5, x1 - x0 + 4, 10);          // ombra del ràfec sobre la paret
    const traçaTeulat = () => { ctx.beginPath(); ra.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); };
    const palla = ctx.createLinearGradient(0, H * 0.16, 0, H * 0.5);
    palla.addColorStop(0, '#6a8a3a'); palla.addColorStop(0.55, '#8a9444'); palla.addColorStop(1, '#a89a50');
    ctx.fillStyle = palla; traçaTeulat(); ctx.fill();
    ctx.save(); traçaTeulat(); ctx.clip();
    for (let i = 0; i < 520; i++) {                                                           // brins de palla
        const x = rnd() * W, y = H * 0.14 + rnd() * H * 0.38, l = 9 + rnd() * 8;
        ctx.strokeStyle = ['#c0a858', '#8ca048', '#5e7e30', '#d2bc6c', '#7a8c3c'][i % 5]; ctx.lineWidth = 1 + rnd() * 0.8;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (x - W / 2) * 0.05 - 2, y + l); ctx.stroke();
    }
    [[W * 0.2, H * 0.4, 30, 9], [W * 0.5, H * 0.26, 36, 10], [W * 0.82, H * 0.38, 28, 8], [W * 0.36, H * 0.3, 20, 6]].forEach(([x, y, rx, ry]) => {   // molsa
        ctx.fillStyle = '#4f8a34'; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, -0.1, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#7ab652'; for (let k = 0; k < 9; k++) { ctx.beginPath(); ctx.arc(x - rx * 0.8 + rnd() * rx * 1.6, y - ry * 0.5 + rnd() * ry, 1.8 + rnd() * 1.6, 0, Math.PI * 2); ctx.fill(); }
    });
    ctx.restore();
    ctx.strokeStyle = CONTORN; ctx.lineWidth = 3.5; traçaTeulat(); ctx.stroke();
    for (let x = 2; x < W - 2; x += 6.5) {                                                    // serrells de palla pel ràfec
        const l = 5 + rnd() * 7, yb = H * 0.5 - 1;
        ctx.strokeStyle = ['#a89a50', '#8a9444', '#c0a858'][Math.floor(rnd() * 3)]; ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.moveTo(x, yb); ctx.lineTo(x + (rnd() - 0.5) * 3, yb + l); ctx.stroke();
    }
    // Cresta del teulat: un feix de palla lligat, i bolets
    ctx.strokeStyle = CONTORN; ctx.lineWidth = 3; ctx.fillStyle = '#b09a4a';
    ctx.beginPath(); ctx.roundRect(W * 0.25 - 3, H * 0.145, W * 0.51 + 6, 9, 4.5); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(70,52,20,0.7)'; ctx.lineWidth = 1.3; for (let x = W * 0.3; x < W * 0.74; x += 15) { ctx.beginPath(); ctx.moveTo(x, H * 0.145); ctx.lineTo(x + 2, H * 0.145 + 9); ctx.stroke(); }
    [[W * 0.36, H * 0.15, 1], [W * 0.44, H * 0.15, 0.7], [W * 0.63, H * 0.17, 0.85]].forEach(([x, y, e]) => {
        ctx.fillStyle = '#e8d8b0'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 1.4; ctx.fillRect(x - 1.8 * e, y - 6 * e, 3.6 * e, 6 * e);
        ctx.fillStyle = e > 0.9 ? '#c0382a' : '#e0a030'; ctx.beginPath(); ctx.ellipse(x, y - 6 * e, 7 * e, 4.6 * e, 0, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fff2d0'; ctx.beginPath(); ctx.arc(x - 2 * e, y - 8 * e, 1 * e, 0, Math.PI * 2); ctx.arc(x + 2.4 * e, y - 7.4 * e, 0.8 * e, 0, Math.PI * 2); ctx.fill();
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

// Cel·les de Sant Benet (com la foto): edifici llarg de dues plantes, de pedra i maó ocre, teulada de quatre aigües de teula clara.
// La façana és el costat llarg, amb una filera de finestres d'arc de maó a cada planta i dues portes (esquerra i dreta).
// A l'esquerra es veu, de biaix, el capçal: un frontó de maó més alt que la teulada, amb un ull de bou i dues finestres.
function dibuixarCelSantBenet(c, w) {
    lienc(c, w, w * 0.62, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 5, W * 0.52, 8);
        ctx.lineJoin = 'round'; ctx.strokeStyle = CONTORN;
        const wb = H - 8, ras = H * 0.34, xc = W * 0.02;           // ras: on comença la teulada de la façana; xc: on comença la façana (sense cap edifici adjunt a l'esquerra)
        // Façana llarga: carreus ocres
        carreus(ctx, xc, ras, W - xc - W * 0.02, wb - ras, '#c8955a', H * 0.04, W * 0.05, 17);
        ctx.lineWidth = 4; ctx.strokeRect(xc, ras, W - xc - W * 0.02, wb - ras);
        ctx.fillStyle = '#b5824a'; ctx.fillRect(xc, (ras + wb) / 2 - 3, W - xc - W * 0.02, 7);   // imposta entre plantes
        // Teulada de quatre aigües, de teula clara
        ctx.fillStyle = '#c99a72'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(xc - W * 0.01, ras + 4); ctx.lineTo(xc + W * 0.06, H * 0.16); ctx.lineTo(W * 0.92, H * 0.16); ctx.lineTo(W, ras + 4); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(110,60,30,0.35)'; ctx.lineWidth = 1.3;
        for (let k = 1; k < 4; k++) { const y = H * 0.16 + (ras + 4 - H * 0.16) * k / 4; ctx.beginPath(); ctx.moveTo(xc + W * 0.06 * (1 - k / 4), y); ctx.lineTo(W - W * 0.08 * (1 - k / 4), y); ctx.stroke(); }
        // Finestres d'arc amb marc de maó: set a dalt; a baix, cinc i dues portes
        const fin = (x, y, fw, fh) => finestra(ctx, x - fw / 2, y, fw, fh, { arc: true, marc: '#a8603a', vidre: '#3a2a20' });
        const cols = [0.1, 0.19, 0.28, 0.37, 0.45, 0.54, 0.63, 0.71, 0.8, 0.89];
        cols.forEach(cx => fin(W * cx, ras + H * 0.06, W * 0.035, H * 0.15));
        [0.1, 0.19, 0.28, 0.37, 0.54, 0.63, 0.89].forEach(cx => fin(W * cx, (ras + wb) / 2 + H * 0.05, W * 0.035, H * 0.15));
        // Dues portes de fusta amb arc de maó, més altes que l'Ineu
        [0.45, 0.78].forEach(cx => {
            const pw = W * 0.065, px = W * cx - pw / 2, pt = wb - H * 0.3;
            ctx.fillStyle = '#a8603a'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(px - 6, wb); ctx.lineTo(px - 6, pt + pw * 0.5); ctx.arc(px + pw / 2, pt + pw * 0.5, pw / 2 + 6, Math.PI, 0); ctx.lineTo(px + pw + 6, wb); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#5a3a20';
            ctx.beginPath(); ctx.moveTo(px, wb); ctx.lineTo(px, pt + pw * 0.5); ctx.arc(px + pw / 2, pt + pw * 0.5, pw / 2, Math.PI, 0); ctx.lineTo(px + pw, wb); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.strokeStyle = 'rgba(20,10,4,0.5)'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(px + pw / 2, pt + 4); ctx.lineTo(px + pw / 2, wb); ctx.stroke();
        });
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

// Taverna: façana de cara amb la teulada vista des de dalt (com els altres edificis). Planta baixa de carreus,
// pis de guix clar amb persianes verdes, porta d'arc amb marc de pedra, barra d'una ensenya de ferro i barrils al costat.
// La Taverna: casa gran de tres plantes de pedra, teulada de teula a dues aigües amb dues xemeneies, un balcó corregut
// de ferro al primer pis, finestres amb persianes verdes, tres arcs a la planta baixa (porta al mig) i l'ensenya penjada.
function dibuixarTaverna(c, w) {
    lienc(c, w, w * 0.74, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 5, W * 0.5, 9);
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        const wb = H - 8, roof = H * 0.22, x0 = W * 0.03, x1 = W * 0.97, p1 = H * 0.46, p0 = H * 0.68;
        // Xemeneies (darrere la teulada)
        [[W * 0.2, 0.06], [W * 0.76, 0.05]].forEach(([x, ww]) => {
            carreus(ctx, x, H * 0.02, W * ww, roof - H * 0.02, '#9a8a6c', H * 0.03, W * 0.03, 7);
            ctx.strokeStyle = CONTORN; ctx.lineWidth = 3; ctx.strokeRect(x, H * 0.02, W * ww, roof - H * 0.02);
            ctx.fillStyle = '#6a5c48'; ctx.fillRect(x - 4, H * 0.01, W * ww + 8, H * 0.02); ctx.strokeRect(x - 4, H * 0.01, W * ww + 8, H * 0.02);
        });
        // Paret: dos pisos arrebossats sobre una planta baixa de carreus
        ctx.fillStyle = '#e2d0a6'; ctx.fillRect(x0, roof, x1 - x0, p0 - roof);
        carreus(ctx, x0, p0, x1 - x0, wb - p0, '#a89270', H * 0.045, W * 0.05, 31);
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 4; ctx.strokeRect(x0, roof, x1 - x0, wb - roof);
        [p1, p0].forEach(y => { ctx.fillStyle = '#c9b48c'; ctx.fillRect(x0 - 3, y - 4, x1 - x0 + 6, 8); ctx.strokeRect(x0 - 3, y - 4, x1 - x0 + 6, 8); });   // cornises
        ctx.fillStyle = '#c4ad82';
        for (let y = roof + 4; y < wb - 10; y += H * 0.06) [x0, x1 - W * 0.03].forEach(x => { ctx.fillRect(x, y, W * 0.03, H * 0.045); ctx.strokeRect(x, y, W * 0.03, H * 0.045); });   // cantoneres de pedra
        // Teulada
        teuladaTeules(ctx, W, H * 0.045, roof + 4, '#b0573a');
        ctx.fillStyle = '#6a4228'; ctx.lineWidth = 2;
        for (let k = 0; k < 18; k++) { const x = W * 0.04 + k * (W * 0.92 / 17); ctx.fillRect(x - 4, roof + 4, 9, 10); ctx.strokeRect(x - 4, roof + 4, 9, 10); }   // caps de biga
        // Finestra amb persianes (pis)
        const fin = (x, y, fw, fh, llum) => {
            ctx.fillStyle = '#c4ad82'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 2.5; ctx.fillRect(x - 4, y - 4, fw + 8, fh + 8); ctx.strokeRect(x - 4, y - 4, fw + 8, fh + 8);
            ctx.fillStyle = '#2c3140'; ctx.fillRect(x, y, fw, fh); ctx.strokeRect(x, y, fw, fh);
            if (llum) { ctx.fillStyle = 'rgba(255,200,110,0.5)'; ctx.fillRect(x + 3, y + 3, fw - 6, fh * 0.4); }
            ctx.fillStyle = '#4f7a4a'; [x - fw * 0.34, x + fw].forEach(sx => { ctx.fillRect(sx, y, fw * 0.34, fh); ctx.strokeRect(sx, y, fw * 0.34, fh); });
        };
        const cols = [0.1, 0.25, 0.4, 0.555, 0.705, 0.855];
        // Segon pis: finestres petites
        cols.forEach((fx, k) => fin(W * fx, roof + H * 0.055, W * 0.05, H * 0.1, k % 2 === 0));
        // Primer pis: balconeres i un balcó corregut de ferro
        cols.forEach((fx, k) => fin(W * fx - W * 0.005, p1 + H * 0.03, W * 0.06, H * 0.155, k === 2 || k === 3));
        const by = p0 - H * 0.03;
        ctx.fillStyle = '#8a7a64'; ctx.fillRect(W * 0.07, by, W * 0.86, H * 0.014); ctx.strokeStyle = CONTORN; ctx.lineWidth = 2.5; ctx.strokeRect(W * 0.07, by, W * 0.86, H * 0.014);
        ctx.strokeStyle = '#26262a'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(W * 0.07, by - H * 0.06); ctx.lineTo(W * 0.93, by - H * 0.06); ctx.stroke();
        ctx.lineWidth = 1.6;
        for (let x = W * 0.075; x < W * 0.93; x += W * 0.012) { ctx.beginPath(); ctx.moveTo(x, by - H * 0.06); ctx.lineTo(x, by); ctx.stroke(); }
        // Testos de geranis al balcó
        [0.17, 0.48, 0.79].forEach(fx => {
            ctx.fillStyle = '#a8502e'; ctx.fillRect(W * fx, by - H * 0.035, W * 0.03, H * 0.03); ctx.strokeStyle = CONTORN; ctx.lineWidth = 1.5; ctx.strokeRect(W * fx, by - H * 0.035, W * 0.03, H * 0.03);
            ctx.fillStyle = '#4f8a3a'; ctx.beginPath(); ctx.ellipse(W * fx + W * 0.015, by - H * 0.045, W * 0.024, H * 0.018, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#d8344a'; [-0.01, 0, 0.01].forEach(d => { ctx.beginPath(); ctx.arc(W * (fx + 0.015 + d), by - H * 0.052, 3, 0, Math.PI * 2); ctx.fill(); });
        });
        // Planta baixa: tres arcs de pedra; el del mig és la porta, els dels costats, aparadors amb reixa
        const arc = (cx, aw, top, porta) => {
            const ax = cx - aw / 2;
            ctx.fillStyle = '#d4c19a'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(ax - 9, wb); ctx.lineTo(ax - 9, top + aw * 0.5); ctx.arc(cx, top + aw * 0.5, aw / 2 + 9, Math.PI, 0); ctx.lineTo(ax + aw + 9, wb); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.fillStyle = porta ? '#4a2c16' : '#26222a';
            ctx.beginPath(); ctx.moveTo(ax, wb); ctx.lineTo(ax, top + aw * 0.5); ctx.arc(cx, top + aw * 0.5, aw / 2, Math.PI, 0); ctx.lineTo(ax + aw, wb); ctx.closePath(); ctx.fill(); ctx.stroke();
            if (porta) {
                ctx.strokeStyle = 'rgba(20,10,4,0.65)'; ctx.lineWidth = 1.5;
                for (let r = 1; r < 4; r++) { ctx.beginPath(); ctx.moveTo(ax + aw * r / 4, top + aw * 0.42); ctx.lineTo(ax + aw * r / 4, wb); ctx.stroke(); }
                ctx.fillStyle = '#d4af37'; ctx.beginPath(); ctx.arc(ax + aw * 0.8, top + aw * 1.15, 3, 0, Math.PI * 2); ctx.fill();
            } else {
                ctx.fillStyle = 'rgba(255,200,110,0.35)'; ctx.fillRect(ax + 4, top + aw * 0.5, aw - 8, (wb - top) * 0.35);
                ctx.strokeStyle = '#6a6a70'; ctx.lineWidth = 1.8;
                for (let r = 1; r < 5; r++) { ctx.beginPath(); ctx.moveTo(ax + aw * r / 5, top + aw * 0.12); ctx.lineTo(ax + aw * r / 5, wb); ctx.stroke(); }
                ctx.fillStyle = '#5a3a20'; ctx.fillRect(ax, wb - (wb - top) * 0.28, aw, (wb - top) * 0.28); ctx.strokeStyle = CONTORN; ctx.strokeRect(ax, wb - (wb - top) * 0.28, aw, (wb - top) * 0.28);
            }
        };
        arc(W * 0.22, W * 0.14, p0 + H * 0.05, false);
        arc(W * 0.5, W * 0.12, p0 + H * 0.03, true);
        arc(W * 0.78, W * 0.14, p0 + H * 0.05, false);
        // Ensenya de ferro penjada a la dreta de la porta: una gerra
        const sx = W * 0.585, sy = p0 + H * 0.02;
        ctx.strokeStyle = '#2a2a2e'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + W * 0.1, sy); ctx.stroke();
        ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(sx + W * 0.02, sy); ctx.lineTo(sx + W * 0.02, sy + H * 0.025); ctx.moveTo(sx + W * 0.085, sy); ctx.lineTo(sx + W * 0.085, sy + H * 0.025); ctx.stroke();
        ctx.fillStyle = '#e8d8a8'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(sx + W * 0.008, sy + H * 0.025, W * 0.09, H * 0.08, 6); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#b8862a'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 2;
        ctx.fillRect(sx + W * 0.035, sy + H * 0.042, W * 0.03, H * 0.045); ctx.strokeRect(sx + W * 0.035, sy + H * 0.042, W * 0.03, H * 0.045);
        ctx.beginPath(); ctx.arc(sx + W * 0.068, sy + H * 0.064, H * 0.013, -Math.PI / 2, Math.PI / 2); ctx.stroke();
        // Rètol pintat sobre la porta
        ctx.fillStyle = '#5a3a20'; ctx.fillRect(W * 0.41, p0 + H * 0.003, W * 0.18, H * 0.022);
        ctx.fillStyle = '#f2e6c8'; ctx.font = `bold ${Math.round(H * 0.018)}px Georgia, serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('TAVERNA', W * 0.5, p0 + H * 0.015);
    });
}

// Pi roig (pinastre): tronc alt i recte de color de teula amb escates, branques curtes i copa irregular de núvols d'agulles blaves
function dibuixarPi(c, w) {
    lienc(c, w, w * 1.75, (ctx, W, H) => {
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        let sd = 21; const r = () => (sd = sd * 16807 % 2147483647) / 2147483647;
        ombraTerra(ctx, W / 2, H - 8, W * 0.26, 9);
        const cx = y => W * 0.5 + (H - y) * 0.03 + Math.sin(y * 0.02) * W * 0.012;     // lleugera inclinació
        const amp = y => W * (0.032 + 0.05 * (y / H));                                   // el tronc s'eixampla cap a baix
        // Branques cap als núvols
        const nuv = [[0.5, 0.11, 0.27, 0.07], [0.3, 0.2, 0.22, 0.06], [0.72, 0.22, 0.2, 0.06], [0.46, 0.3, 0.26, 0.065], [0.66, 0.4, 0.16, 0.05], [0.3, 0.43, 0.15, 0.045]];
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 6;
        nuv.forEach(([nx, ny]) => { const y0 = H * (ny + 0.1); ctx.beginPath(); ctx.moveTo(cx(y0), y0 + 12); ctx.quadraticCurveTo((cx(y0) + W * nx) / 2, y0 - 4, W * nx, H * ny); ctx.stroke(); });
        ctx.strokeStyle = '#7a3a22'; ctx.lineWidth = 3.2;
        nuv.forEach(([nx, ny]) => { const y0 = H * (ny + 0.1); ctx.beginPath(); ctx.moveTo(cx(y0), y0 + 12); ctx.quadraticCurveTo((cx(y0) + W * nx) / 2, y0 - 4, W * nx, H * ny); ctx.stroke(); });
        // Tronc
        const g = ctx.createLinearGradient(W * 0.4, 0, W * 0.62, 0); g.addColorStop(0, '#c26a3e'); g.addColorStop(0.5, '#9a4a2a'); g.addColorStop(1, '#63291a');
        ctx.fillStyle = g; ctx.strokeStyle = CONTORN; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(cx(H - 10) - amp(H) * 1.5, H - 8);
        for (let y = H - 12; y >= H * 0.1; y -= 12) ctx.lineTo(cx(y) - amp(y), y);
        for (let y = H * 0.1; y <= H - 12; y += 12) ctx.lineTo(cx(y) + amp(y), y);
        ctx.lineTo(cx(H - 10) + amp(H) * 1.5, H - 8); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Escates de l'escorça
        ctx.strokeStyle = 'rgba(58,22,10,0.6)'; ctx.lineWidth = 1.6;
        for (let k = 0; k < 90; k++) { const y = H * (0.15 + r() * 0.8), x = cx(y) + (r() - 0.5) * amp(y) * 1.7; ctx.beginPath(); ctx.moveTo(x - 4, y); ctx.quadraticCurveTo(x, y + 4, x + 5, y); ctx.stroke(); }
        ctx.strokeStyle = 'rgba(240,170,110,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx(H * 0.9) - amp(H * 0.9) * 0.6, H * 0.9); ctx.lineTo(cx(H * 0.2) - amp(H * 0.2) * 0.6, H * 0.2); ctx.stroke();
        // Núvols d'agulles
        nuv.forEach(([nx, ny, rx, ry], i) => {
            const x = W * nx, y = H * ny, a = W * rx, b = H * ry;
            ctx.fillStyle = '#2c5646'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3.5;
            ctx.beginPath(); ctx.ellipse(x, y + b * 0.25, a, b, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#4a7c64'; ctx.beginPath(); ctx.ellipse(x - a * 0.05, y - b * 0.1, a * 0.86, b * 0.72, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#6d9c7e'; ctx.beginPath(); ctx.ellipse(x - a * 0.18, y - b * 0.38, a * 0.5, b * 0.34, 0, 0, Math.PI * 2); ctx.fill();
            ctx.lineWidth = 1.5;
            for (let k = 0; k < 46; k++) { const px = x + (r() - 0.5) * a * 1.8, py = y + (r() - 0.45) * b * 1.5; ctx.strokeStyle = k % 3 ? '#1f4034' : '#86b090'; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + (r() - 0.5) * 12, py + 5 + r() * 5); ctx.stroke(); }
            if (i % 2 === 0) { ctx.fillStyle = '#a8552a'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(x + a * 0.5, y + b * 0.9, 5, 7, 0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }     // una pinya
        });
        // Arrels que s'obren a la base
        ctx.fillStyle = '#7a3a22'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
        [[-1, 0.12], [1, 0.14]].forEach(([sg, l]) => { ctx.beginPath(); ctx.moveTo(cx(H - 20) + sg * amp(H) * 0.8, H - 30); ctx.quadraticCurveTo(cx(H) + sg * W * l * 0.8, H - 18, cx(H) + sg * W * l, H - 6); ctx.lineTo(cx(H) + sg * W * 0.03, H - 6); ctx.closePath(); ctx.fill(); ctx.stroke(); });
    });
}

// Pi pinyer: tronc gruixut i corbat que es parteix en poques branques i porta una copa ampla en forma de para-sol
function dibuixarPiPinyer(c, w) {
    lienc(c, w, w * 0.95, (ctx, W, H) => {
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        let sd = 33; const r = () => (sd = sd * 16807 % 2147483647) / 2147483647;
        ombraTerra(ctx, W / 2, H - 8, W * 0.3, 10);
        const tronc = (x0, y0, x1, y1, a0, a1, col) => {
            ctx.fillStyle = col; ctx.strokeStyle = CONTORN; ctx.lineWidth = 4;
            ctx.beginPath(); ctx.moveTo(x0 - a0, y0); ctx.quadraticCurveTo(x0 - a0, (y0 + y1) / 2, x1 - a1, y1); ctx.lineTo(x1 + a1, y1); ctx.quadraticCurveTo(x0 + a0, (y0 + y1) / 2, x0 + a0, y0); ctx.closePath(); ctx.fill(); ctx.stroke();
        };
        // Branques (dins la copa) i tronc principal, corbat
        [[0.3, 0.3], [0.5, 0.2], [0.7, 0.3], [0.4, 0.32], [0.62, 0.34]].forEach(([bx, by]) => tronc(W * 0.47, H * 0.58, W * bx, H * by, W * 0.025, W * 0.012, '#7a4a2e'));
        const g = ctx.createLinearGradient(W * 0.4, 0, W * 0.6, 0); g.addColorStop(0, '#a8643a'); g.addColorStop(0.5, '#86492a'); g.addColorStop(1, '#5a2c1a');
        tronc(W * 0.5, H - 10, W * 0.46, H * 0.55, W * 0.075, W * 0.045, g);
        ctx.strokeStyle = 'rgba(52,22,10,0.6)'; ctx.lineWidth = 1.6;
        for (let k = 0; k < 40; k++) { const y = H * (0.6 + r() * 0.36), x = W * 0.49 + (r() - 0.5) * W * 0.11; ctx.beginPath(); ctx.moveTo(x - 4, y); ctx.quadraticCurveTo(x, y + 4, x + 5, y); ctx.stroke(); }
        // Copa en para-sol: núvols aplanats escampats pel cim
        const nuv = [[0.12, 0.36, 0.14, 0.09], [0.28, 0.24, 0.17, 0.1], [0.5, 0.18, 0.18, 0.1], [0.72, 0.24, 0.17, 0.1], [0.88, 0.36, 0.14, 0.09], [0.36, 0.38, 0.17, 0.09], [0.64, 0.38, 0.17, 0.09], [0.5, 0.32, 0.18, 0.09]];
        nuv.forEach(([nx, ny, rx, ry], i) => {
            const x = W * nx, y = H * ny, a = W * rx, b = H * ry;
            ctx.fillStyle = '#2a5030'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3.5;
            ctx.beginPath(); ctx.ellipse(x, y + b * 0.2, a, b, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#4a8044'; ctx.beginPath(); ctx.ellipse(x - a * 0.05, y - b * 0.12, a * 0.86, b * 0.7, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#74ac62'; ctx.beginPath(); ctx.ellipse(x - a * 0.2, y - b * 0.4, a * 0.5, b * 0.32, 0, 0, Math.PI * 2); ctx.fill();
            ctx.lineWidth = 1.4;
            for (let k = 0; k < 40; k++) { const px = x + (r() - 0.5) * a * 1.8, py = y + (r() - 0.45) * b * 1.5; ctx.strokeStyle = k % 3 ? '#1c3a22' : '#98c68a'; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + (r() - 0.5) * 11, py + 5 + r() * 4); ctx.stroke(); }
            if (i % 3 === 1) { ctx.fillStyle = '#9a6a38'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.ellipse(x + a * 0.2, y + b * 1.05, 8, 10, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }     // pinya
        });
    });
}

// La Caseta: una cabana de fusta aixecada sobre pilars de fusta (com una cabana d'arbre, però sense arbre), amb una terrassa
// amb barana, la porta al mig i una escala de fusta que baixa fins a terra
function dibuixarCasetaJoc(c, w) {
    lienc(c, w, w * 1.22, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 6, W * 0.46, 9);
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        const terra = H - 8, plat = H * 0.6, x0 = W * 0.12, x1 = W * 0.88, sostre = H * 0.27;
        const fusta = '#8a5a30', fosca = '#5a3a1e';
        // Pilars i creus de reforç (darrere l'escala)
        [W * 0.16, W * 0.38, W * 0.62, W * 0.84].forEach(x => {
            ctx.fillStyle = fosca; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
            ctx.fillRect(x - 9, plat, 18, terra - plat); ctx.strokeRect(x - 9, plat, 18, terra - plat);
            ctx.strokeStyle = 'rgba(30,16,6,0.5)'; ctx.lineWidth = 1.2; for (let y = plat + 10; y < terra; y += 16) { ctx.beginPath(); ctx.moveTo(x - 6, y); ctx.lineTo(x + 5, y + 6); ctx.stroke(); }
        });
        ctx.strokeStyle = fosca; ctx.lineWidth = 7;
        [[0.16, 0.38], [0.62, 0.84]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(W * a, plat + 10); ctx.lineTo(W * b, terra - 12); ctx.moveTo(W * b, plat + 10); ctx.lineTo(W * a, terra - 12); ctx.stroke(); });
        // Plataforma de taulons
        ctx.fillStyle = '#9a6a3a'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3.5;
        ctx.fillRect(W * 0.04, plat - 10, W * 0.92, 22); ctx.strokeRect(W * 0.04, plat - 10, W * 0.92, 22);
        ctx.strokeStyle = 'rgba(40,20,8,0.55)'; ctx.lineWidth = 1.4; for (let x = W * 0.08; x < W * 0.96; x += W * 0.06) { ctx.beginPath(); ctx.moveTo(x, plat - 8); ctx.lineTo(x, plat + 10); ctx.stroke(); }
        // Parets de troncs horitzontals
        for (let y = sostre + 4, k = 0; y < plat - 10; y += 15, k++) {
            ctx.fillStyle = k % 2 ? '#a0703c' : '#94643a'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.roundRect(x0, y, x1 - x0, 15, 7); ctx.fill(); ctx.stroke();
        }
        [x0 - 4, x1 - 6].forEach(x => { ctx.fillStyle = '#c89a5a'; for (let y = sostre + 4; y < plat - 10; y += 15) { ctx.beginPath(); ctx.arc(x + 5, y + 7.5, 6.5, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = CONTORN; ctx.lineWidth = 1.5; ctx.stroke(); } });
        // Teulada de dues aigües de taulons, amb ràfec
        ctx.fillStyle = '#6a4224'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(W * 0.02, sostre + 14); ctx.lineTo(W * 0.5, H * 0.03); ctx.lineTo(W * 0.98, sostre + 14); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(20,10,4,0.5)'; ctx.lineWidth = 1.5;
        for (let k = 1; k < 7; k++) { const f = k / 7; ctx.beginPath(); ctx.moveTo(W * 0.5 - (W * 0.48) * f, H * 0.03 + (sostre + 14 - H * 0.03) * f); ctx.lineTo(W * 0.5 + (W * 0.48) * f, H * 0.03 + (sostre + 14 - H * 0.03) * f); ctx.stroke(); }
        // Finestra amb porticons i un test de flors
        const fx = W * 0.2, fy = sostre + 24, fw = W * 0.14, fh = W * 0.12;
        ctx.fillStyle = '#f2d890'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3; ctx.fillRect(fx, fy, fw, fh); ctx.strokeRect(fx, fy, fw, fh);
        ctx.beginPath(); ctx.moveTo(fx + fw / 2, fy); ctx.lineTo(fx + fw / 2, fy + fh); ctx.moveTo(fx, fy + fh / 2); ctx.lineTo(fx + fw, fy + fh / 2); ctx.stroke();
        ctx.fillStyle = '#4a7a98'; ctx.fillRect(fx - fw * 0.4, fy, fw * 0.38, fh); ctx.strokeRect(fx - fw * 0.4, fy, fw * 0.38, fh);
        ctx.fillStyle = '#b8502e'; ctx.fillRect(fx + 4, fy + fh + 2, fw - 8, 10); ctx.fillStyle = '#d8434a'; [0.25, 0.5, 0.75].forEach(f => { ctx.beginPath(); ctx.arc(fx + fw * f, fy + fh, 4, 0, Math.PI * 2); ctx.fill(); });
        // Porta al mig, de taulons, amb un cor tallat
        const pw = W * 0.18, px = W / 2 - pw / 2, pt = sostre + 20;
        ctx.fillStyle = '#5a3a1e'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3; ctx.fillRect(px, pt, pw, plat - 10 - pt); ctx.strokeRect(px, pt, pw, plat - 10 - pt);
        ctx.strokeStyle = 'rgba(20,10,4,0.6)'; ctx.lineWidth = 1.4; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(px + pw * k / 4, pt); ctx.lineTo(px + pw * k / 4, plat - 10); ctx.stroke(); }
        ctx.fillStyle = '#1a0e06'; ctx.beginPath(); ctx.moveTo(W / 2, pt + 24); ctx.bezierCurveTo(W / 2 - 12, pt + 12, W / 2 - 6, pt + 4, W / 2, pt + 12); ctx.bezierCurveTo(W / 2 + 6, pt + 4, W / 2 + 12, pt + 12, W / 2, pt + 24); ctx.fill();
        // Barana de la terrassa (a banda i banda de la porta)
        ctx.strokeStyle = '#c89a5a'; ctx.lineWidth = 4;
        [[W * 0.05, px - 6], [px + pw + 6, W * 0.95]].forEach(([a, b]) => {
            ctx.beginPath(); ctx.moveTo(a, plat - 34); ctx.lineTo(b, plat - 34); ctx.stroke();
            for (let x = a; x <= b; x += 14) { ctx.beginPath(); ctx.moveTo(x, plat - 34); ctx.lineTo(x, plat - 10); ctx.stroke(); }
        });
        // Escala de fusta: de la porta fins a terra
        const ex0 = W / 2 - W * 0.11, ex1 = W / 2 + W * 0.11;
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 3; ctx.fillStyle = '#7a4e28';
        ctx.fillRect(ex0 - 6, plat - 6, 10, terra - plat + 4); ctx.strokeRect(ex0 - 6, plat - 6, 10, terra - plat + 4);
        ctx.fillRect(ex1 - 4, plat - 6, 10, terra - plat + 4); ctx.strokeRect(ex1 - 4, plat - 6, 10, terra - plat + 4);
        for (let y = plat + 10; y < terra - 2; y += 18) { ctx.fillStyle = '#b07a42'; ctx.fillRect(ex0, y, ex1 - ex0, 8); ctx.strokeRect(ex0, y, ex1 - ex0, 8); }
        // Una corda amb un cubell, penjada d'una biga
        ctx.strokeStyle = '#c8b080'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W * 0.86, sostre + 16); ctx.lineTo(W * 0.86, plat + 60); ctx.stroke();
        ctx.fillStyle = '#4aa0d0'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(W * 0.82, plat + 60); ctx.lineTo(W * 0.9, plat + 60); ctx.lineTo(W * 0.885, plat + 82); ctx.lineTo(W * 0.835, plat + 82); ctx.closePath(); ctx.fill(); ctx.stroke();
    });
}

// Pilar de la processó (camí de la Desaparició): pilar baix de pedra tosca amb un plafó de rajoles ceràmiques incrustat
// Emblemes medievals i religiosos, un per columna del camí: crismó, calze, coloma, anyell, peix, claus, flor de lis, campana, llibre, sol, espasa i escut, raïm
function emblemaColumna(ctx, k, cx, cy, u) {
    ctx.save(); ctx.translate(cx, cy); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const C = '#2a1c10';
    const traca = (w, col = C) => { ctx.lineWidth = w; ctx.strokeStyle = col; ctx.stroke(); };
    const omple = (col, w = 1.6) => { ctx.fillStyle = col; ctx.fill(); traca(w); };
    switch (k % 12) {
        case 0:   // crismó (Chi-Rho)
            ctx.beginPath(); ctx.arc(0, 0, u * 1.05, 0, Math.PI * 2); omple('#f6e7b0');
            ctx.beginPath(); ctx.moveTo(0, -u * 0.9); ctx.lineTo(0, u * 0.9); traca(4.2, '#8a1c18');
            ctx.beginPath(); ctx.arc(u * 0.22, -u * 0.5, u * 0.34, -Math.PI / 2, Math.PI / 2); traca(3.6, '#8a1c18');
            ctx.beginPath(); ctx.moveTo(-u * 0.6, -u * 0.15); ctx.lineTo(u * 0.6, u * 0.75); ctx.moveTo(u * 0.6, -u * 0.15); ctx.lineTo(-u * 0.6, u * 0.75); traca(3.6, '#8a1c18'); break;
        case 1:   // calze
            ctx.beginPath(); ctx.moveTo(-u * 0.75, -u * 0.8); ctx.lineTo(u * 0.75, -u * 0.8); ctx.quadraticCurveTo(u * 0.7, u * 0.1, 0, u * 0.1); ctx.quadraticCurveTo(-u * 0.7, u * 0.1, -u * 0.75, -u * 0.8); omple('#e0b83a', 2);
            ctx.beginPath(); ctx.rect(-u * 0.12, u * 0.1, u * 0.24, u * 0.6); omple('#c89a28', 1.6);
            ctx.beginPath(); ctx.ellipse(0, u * 0.82, u * 0.6, u * 0.2, 0, 0, Math.PI * 2); omple('#e0b83a', 1.8);
            ctx.beginPath(); ctx.ellipse(0, -u * 0.8, u * 0.75, u * 0.14, 0, 0, Math.PI * 2); omple('#8a1c18', 1.6); break;
        case 2:   // coloma amb una branca d'olivera
            ctx.beginPath(); ctx.ellipse(0, u * 0.1, u * 0.8, u * 0.45, -0.2, 0, Math.PI * 2); omple('#f6f2ea', 1.8);
            ctx.beginPath(); ctx.moveTo(-u * 0.1, -u * 0.1); ctx.quadraticCurveTo(-u * 0.9, -u * 1.1, -u * 0.2, -u * 0.9); ctx.quadraticCurveTo(u * 0.2, -u * 0.6, u * 0.3, -u * 0.1); omple('#dcd6c8', 1.6);
            ctx.beginPath(); ctx.arc(u * 0.8, -u * 0.25, u * 0.28, 0, Math.PI * 2); omple('#f6f2ea', 1.6);
            ctx.beginPath(); ctx.moveTo(u * 1.05, -u * 0.25); ctx.lineTo(u * 1.4, -u * 0.18); ctx.lineTo(u * 1.05, -u * 0.1); omple('#d89a28', 1.2);
            ctx.beginPath(); ctx.moveTo(u * 0.5, u * 0.55); ctx.quadraticCurveTo(u * 1.1, u * 0.9, u * 1.3, u * 0.3); traca(2, '#3a6a2a');
            ctx.beginPath(); ctx.ellipse(u * 1.0, u * 0.7, u * 0.22, u * 0.1, -0.6, 0, Math.PI * 2); omple('#5a9a3a', 1); break;
        case 3:   // anyell de Déu amb el penó de la creu
            [[-0.5, 0.1], [0, -0.1], [0.45, 0.1], [-0.2, 0.3], [0.2, 0.3]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.arc(dx * u, dy * u, u * 0.42, 0, Math.PI * 2); omple('#f4efe4', 1.4); });
            ctx.beginPath(); ctx.arc(u * 0.95, -u * 0.1, u * 0.28, 0, Math.PI * 2); omple('#3a2c22', 1.4);
            [-0.5, -0.1, 0.35, 0.65].forEach(dx => { ctx.beginPath(); ctx.moveTo(dx * u, u * 0.55); ctx.lineTo(dx * u, u * 1.0); traca(2.4, '#3a2c22'); });
            ctx.beginPath(); ctx.moveTo(-u * 0.1, -u * 0.5); ctx.lineTo(-u * 0.1, -u * 1.3); traca(1.8, '#6a4a2a');
            ctx.beginPath(); ctx.rect(-u * 0.1, -u * 1.3, u * 0.7, u * 0.4); omple('#f6f2ea', 1.2);
            ctx.beginPath(); ctx.moveTo(u * 0.25, -u * 1.25); ctx.lineTo(u * 0.25, -u * 0.95); ctx.moveTo(u * 0.1, -u * 1.1); ctx.lineTo(u * 0.4, -u * 1.1); traca(1.6, '#8a1c18'); break;
        case 4:   // peix (ichthys)
            ctx.beginPath(); ctx.moveTo(-u * 1.0, 0); ctx.quadraticCurveTo(0, -u * 1.0, u * 0.7, 0); ctx.quadraticCurveTo(0, u * 1.0, -u * 1.0, 0); omple('#5a8ac8', 2);
            ctx.beginPath(); ctx.moveTo(u * 0.6, 0); ctx.lineTo(u * 1.3, -u * 0.55); ctx.lineTo(u * 1.3, u * 0.55); ctx.closePath(); omple('#3a68a8', 1.8);
            ctx.beginPath(); ctx.arc(-u * 0.6, -u * 0.12, u * 0.1, 0, Math.PI * 2); ctx.fillStyle = '#f6f2ea'; ctx.fill();
            ctx.beginPath(); ctx.moveTo(-u * 0.2, -u * 0.4); ctx.quadraticCurveTo(0, 0, -u * 0.2, u * 0.4); traca(1.5, 'rgba(255,255,255,0.7)'); break;
        case 5:   // claus de Sant Pere, encreuades
            [-1, 1].forEach(sg => {
                ctx.save(); ctx.rotate(sg * 0.6);
                ctx.beginPath(); ctx.moveTo(0, -u * 0.5); ctx.lineTo(0, u * 1.1); traca(4.2, C); ctx.beginPath(); ctx.moveTo(0, -u * 0.5); ctx.lineTo(0, u * 1.1); traca(2.6, '#e0b83a');
                ctx.beginPath(); ctx.arc(0, -u * 0.8, u * 0.34, 0, Math.PI * 2); traca(4.2, C); ctx.beginPath(); ctx.arc(0, -u * 0.8, u * 0.34, 0, Math.PI * 2); traca(2.4, '#e0b83a');
                ctx.beginPath(); ctx.rect(0, u * 0.6, u * 0.42, u * 0.18); omple('#e0b83a', 1.4); ctx.beginPath(); ctx.rect(0, u * 0.9, u * 0.32, u * 0.16); omple('#e0b83a', 1.4);
                ctx.restore();
            }); break;
        case 6:   // flor de lis
            ctx.beginPath(); ctx.moveTo(0, -u * 1.1); ctx.quadraticCurveTo(u * 0.55, -u * 0.5, u * 0.18, u * 0.35); ctx.lineTo(-u * 0.18, u * 0.35); ctx.quadraticCurveTo(-u * 0.55, -u * 0.5, 0, -u * 1.1); omple('#2f5fa8', 2);
            [-1, 1].forEach(sg => { ctx.beginPath(); ctx.moveTo(sg * u * 0.15, u * 0.2); ctx.quadraticCurveTo(sg * u * 1.3, -u * 0.5, sg * u * 1.0, u * 0.3); ctx.quadraticCurveTo(sg * u * 0.7, u * 0.55, sg * u * 0.2, u * 0.45); omple('#2f5fa8', 2); });
            ctx.beginPath(); ctx.rect(-u * 0.7, u * 0.45, u * 1.4, u * 0.2); omple('#e0b83a', 1.6);
            ctx.beginPath(); ctx.moveTo(-u * 0.2, u * 0.65); ctx.lineTo(-u * 0.3, u * 1.1); ctx.moveTo(u * 0.2, u * 0.65); ctx.lineTo(u * 0.3, u * 1.1); traca(2.2, '#2f5fa8'); break;
        case 7:   // campana
            ctx.beginPath(); ctx.moveTo(-u * 0.25, -u * 0.95); ctx.quadraticCurveTo(0, -u * 1.25, u * 0.25, -u * 0.95); traca(2.4, C);
            ctx.beginPath(); ctx.moveTo(-u * 0.4, -u * 0.8); ctx.quadraticCurveTo(-u * 0.5, u * 0.3, -u * 0.95, u * 0.65); ctx.lineTo(u * 0.95, u * 0.65); ctx.quadraticCurveTo(u * 0.5, u * 0.3, u * 0.4, -u * 0.8); ctx.closePath(); omple('#d8a82c', 2);
            ctx.beginPath(); ctx.moveTo(-u * 0.7, u * 0.4); ctx.lineTo(u * 0.7, u * 0.4); traca(1.6, 'rgba(60,30,6,0.7)');
            ctx.beginPath(); ctx.arc(0, u * 0.95, u * 0.2, 0, Math.PI * 2); omple('#6a4a1c', 1.4); break;
        case 8:   // llibre obert amb una creu
            ctx.beginPath(); ctx.moveTo(0, -u * 0.5); ctx.quadraticCurveTo(-u * 0.6, -u * 0.8, -u * 1.2, -u * 0.55); ctx.lineTo(-u * 1.2, u * 0.7); ctx.quadraticCurveTo(-u * 0.6, u * 0.45, 0, u * 0.75); ctx.closePath(); omple('#f6ecd0', 2);
            ctx.beginPath(); ctx.moveTo(0, -u * 0.5); ctx.quadraticCurveTo(u * 0.6, -u * 0.8, u * 1.2, -u * 0.55); ctx.lineTo(u * 1.2, u * 0.7); ctx.quadraticCurveTo(u * 0.6, u * 0.45, 0, u * 0.75); ctx.closePath(); omple('#fbf4de', 2);
            ctx.beginPath(); ctx.moveTo(-u * 0.6, -u * 0.25); ctx.lineTo(-u * 0.6, u * 0.35); ctx.moveTo(-u * 0.85, 0); ctx.lineTo(-u * 0.35, 0); traca(2.4, '#8a1c18');
            [-0.05, 0.2, 0.45].forEach(dy => { ctx.beginPath(); ctx.moveTo(u * 0.25, dy * u); ctx.lineTo(u * 1.0, (dy - 0.05) * u); traca(1.2, '#6a4a2a'); }); break;
        case 9:   // sol amb el monograma IHS
            for (let a = 0; a < 16; a++) { const an = a / 16 * Math.PI * 2; ctx.beginPath(); ctx.moveTo(Math.cos(an) * u * 0.8, Math.sin(an) * u * 0.8); ctx.lineTo(Math.cos(an) * u * (a % 2 ? 1.15 : 1.4), Math.sin(an) * u * (a % 2 ? 1.15 : 1.4)); traca(a % 2 ? 2 : 2.8, '#c8901c'); }
            ctx.beginPath(); ctx.arc(0, 0, u * 0.82, 0, Math.PI * 2); omple('#f0c850', 2);
            ctx.fillStyle = '#6a1c14'; ctx.font = `bold ${Math.round(u * 0.75)}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('IHS', 0, u * 0.05); break;
        case 10:  // escut amb creu i espasa al darrere
            ctx.beginPath(); ctx.moveTo(0, -u * 1.35); ctx.lineTo(0, u * 1.2); traca(5, C); ctx.beginPath(); ctx.moveTo(0, -u * 1.35); ctx.lineTo(0, u * 1.2); traca(3, '#c8ccd4');
            ctx.beginPath(); ctx.moveTo(-u * 0.45, -u * 0.3); ctx.lineTo(u * 0.45, -u * 0.3); traca(5, C); ctx.beginPath(); ctx.moveTo(-u * 0.45, -u * 0.3); ctx.lineTo(u * 0.45, -u * 0.3); traca(3, '#a8782a');
            ctx.beginPath(); ctx.moveTo(-u * 0.85, -u * 0.7); ctx.lineTo(u * 0.85, -u * 0.7); ctx.lineTo(u * 0.85, u * 0.1); ctx.quadraticCurveTo(u * 0.85, u * 0.85, 0, u * 1.1); ctx.quadraticCurveTo(-u * 0.85, u * 0.85, -u * 0.85, u * 0.1); ctx.closePath(); omple('#f6f2ea', 2);
            ctx.beginPath(); ctx.moveTo(0, -u * 0.55); ctx.lineTo(0, u * 0.85); ctx.moveTo(-u * 0.55, -u * 0.05); ctx.lineTo(u * 0.55, -u * 0.05); traca(4.4, '#8a1c18'); break;
        default:  // raïm amb fulla i espiga
            ctx.beginPath(); ctx.moveTo(0, -u * 0.7); ctx.quadraticCurveTo(u * 0.5, -u * 1.1, u * 0.9, -u * 0.8); ctx.quadraticCurveTo(u * 0.8, -u * 0.3, u * 0.1, -u * 0.5); omple('#4a8a34', 1.6);
            ctx.beginPath(); ctx.moveTo(0, -u * 0.7); ctx.lineTo(0, -u * 0.35); traca(2.2, '#5a3a1c');
            [[-0.55, -0.2], [0, -0.2], [0.55, -0.2], [-0.28, 0.25], [0.28, 0.25], [0, 0.7]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.arc(dx * u, dy * u, u * 0.32, 0, Math.PI * 2); omple('#6a3a8a', 1.4); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.arc(dx * u - u * 0.1, dy * u - u * 0.1, u * 0.08, 0, Math.PI * 2); ctx.fill(); });
    }
    ctx.restore();
}

function dibuixarColumnaProcessio(c, w, k = 0) {
    lienc(c, w, w * 2.0, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H - 5, W * 0.5, 6);
        ctx.lineJoin = 'round'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
        const x0 = W * 0.1, x1 = W * 0.9, base = H - 8, cim = H * 0.06;
        carreus(ctx, x0, cim, x1 - x0, base - cim, '#8f8a7c', H * 0.07, W * 0.3, 21);
        ctx.strokeRect(x0, cim, x1 - x0, base - cim);
        ctx.fillStyle = '#a8a292'; ctx.fillRect(W * 0.04, 0, W * 0.92, H * 0.06); ctx.strokeRect(W * 0.04, 0, W * 0.92, H * 0.06);   // coberta
        ctx.fillStyle = '#9a9486'; ctx.fillRect(W * 0.04, base - H * 0.05, W * 0.92, H * 0.05); ctx.strokeRect(W * 0.04, base - H * 0.05, W * 0.92, H * 0.05);   // sòcol
        // Plafó amb vora d'or i fons de pergamí, amb l'emblema d'aquesta columna
        const px = W * 0.2, py = H * 0.17, pw = W * 0.6, ph = H * 0.56;
        ctx.fillStyle = '#e8b83a'; ctx.fillRect(px - 3, py - 3, pw + 6, ph + 6); ctx.strokeRect(px - 3, py - 3, pw + 6, ph + 6);
        ctx.fillStyle = '#2f5fa8'; ctx.fillRect(px, py, pw, ph);
        ctx.fillStyle = '#f2e9c8'; ctx.fillRect(px + 3, py + 3, pw - 6, ph - 6);
        emblemaColumna(ctx, k, px + pw / 2, py + ph * 0.46, pw * 0.31);
        ctx.fillStyle = '#2f5fa8'; ctx.font = `bold ${Math.round(W * 0.15)}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][k % 12], W / 2, py + ph - 8);   // número romà
    });
}

// Bastó vertical (cap a dalt) per si falta assets/armes/basto.png
function dibuixarBastoProvisional(c, w) {
    c.width = w; c.height = Math.round(w * 4.25);
    const x = c.getContext('2d');
    x.strokeStyle = '#2a1a0e'; x.lineCap = 'round';
    x.lineWidth = w * 0.3; x.beginPath(); x.moveTo(w * 0.5, c.height); x.lineTo(w * 0.5, w * 0.6); x.stroke();
    x.strokeStyle = '#8a5a34'; x.lineWidth = w * 0.2; x.stroke();
}

// Espasa provisional (si falta assets/armes/espasa.webp): vertical, punta cap amunt, empunyadura a baix
function dibuixarEspasaProvisional(c, w) {
    c.width = w; c.height = Math.round(w * 4.55);
    const x = c.getContext('2d'), h = c.height;
    x.lineJoin = 'round'; x.lineWidth = Math.max(1.5, w * 0.06); x.strokeStyle = '#2a1a0e';
    x.fillStyle = '#5a3a22'; x.fillRect(w * 0.42, h * 0.78, w * 0.16, h * 0.18); x.strokeRect(w * 0.42, h * 0.78, w * 0.16, h * 0.18);
    x.fillStyle = '#e0b84a'; x.fillRect(w * 0.1, h * 0.72, w * 0.8, h * 0.06); x.strokeRect(w * 0.1, h * 0.72, w * 0.8, h * 0.06);
    x.beginPath(); x.arc(w * 0.5, h * 0.97, w * 0.1, 0, Math.PI * 2); x.fill(); x.stroke();
    x.fillStyle = '#dfe8f0'; x.beginPath(); x.moveTo(w * 0.34, h * 0.72); x.lineTo(w * 0.36, h * 0.12); x.lineTo(w * 0.5, 0); x.lineTo(w * 0.64, h * 0.12); x.lineTo(w * 0.66, h * 0.72); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = 'rgba(255,255,255,0.8)'; x.fillRect(w * 0.47, h * 0.1, w * 0.04, h * 0.6);
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
    // Rotlle de pergamí tancat, una mica inclinat: cilindre amb l'espiral a la punta, cinteta vermella amb llaç i lacre
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const C = '#2a1608', cy = h * 0.46, r = h * 0.27, x0 = w * 0.12, x1 = w * 0.86, xc = w * 0.47;
    ctx.fillStyle = 'rgba(0,0,0,0.26)'; ctx.beginPath(); ctx.ellipse(w / 2, h - 3, w * 0.42, 2.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.translate(w / 2, cy); ctx.rotate(-0.13); ctx.translate(-w / 2, -cy);
    // Cos del rotlle: llum a dalt, ombra a baix
    const g = ctx.createLinearGradient(0, cy - r, 0, cy + r);
    g.addColorStop(0, '#d9c08a'); g.addColorStop(0.22, '#f7ebc4'); g.addColorStop(0.55, '#e6d19c'); g.addColorStop(1, '#a8874f');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x0, cy - r);
    for (let k = 1; k <= 6; k++) ctx.lineTo(x0 + (x1 - x0) * k / 6, cy - r + ((k * 7) % 3) * 0.25);
    ctx.ellipse(x1, cy, r * 0.42, r, 0, -Math.PI / 2, Math.PI / 2);
    for (let k = 5; k >= 0; k--) ctx.lineTo(x0 + (x1 - x0) * k / 6, cy + r - ((k * 5) % 3) * 0.25);
    ctx.ellipse(x0, cy, r * 0.42, r, 0, Math.PI / 2, Math.PI * 1.5);
    ctx.closePath(); ctx.fill(); ctx.strokeStyle = C; ctx.lineWidth = 1.2; ctx.stroke();
    // Vora del full que fa la volta (la darrera capa), taques i fibres
    ctx.strokeStyle = 'rgba(110,76,30,0.55)'; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(x0 + 3, cy + r * 0.55); ctx.lineTo(xc - 6, cy + r * 0.62); ctx.moveTo(xc + 7, cy + r * 0.66); ctx.lineTo(x1 - 2, cy + r * 0.5); ctx.stroke();
    ctx.fillStyle = 'rgba(140,96,40,0.22)';
    [[0.24, -0.2, 2.2], [0.66, 0.25, 1.6], [0.78, -0.35, 1.2], [0.33, 0.35, 1.3]].forEach(([fx, fy, rr]) => { ctx.beginPath(); ctx.arc(w * fx, cy + r * fy, rr, 0, Math.PI * 2); ctx.fill(); });
    ctx.strokeStyle = 'rgba(255,250,230,0.7)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0 + 2, cy - r * 0.6); ctx.lineTo(x1 - 3, cy - r * 0.62); ctx.stroke();
    // Punta de la dreta: l'espiral del rotlle
    const e = ctx.createRadialGradient(x1, cy, 0.5, x1, cy, r);
    e.addColorStop(0, '#8a6a36'); e.addColorStop(0.5, '#e8d4a0'); e.addColorStop(1, '#c8aa6e');
    ctx.fillStyle = e; ctx.beginPath(); ctx.ellipse(x1, cy, r * 0.42, r, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = C; ctx.lineWidth = 1.1; ctx.stroke();
    ctx.strokeStyle = 'rgba(90,60,24,0.85)'; ctx.lineWidth = 0.7; ctx.beginPath();
    for (let t = 0; t < Math.PI * 5; t += 0.25) { const q = 1 - t / (Math.PI * 5.4); const px = x1 + Math.cos(t) * r * 0.36 * q, py = cy + Math.sin(t) * r * 0.86 * q; t ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.stroke();
    // Punta de l'esquerra: el full que sobresurt una mica, esfilagarsat
    ctx.fillStyle = '#efdfae'; ctx.beginPath();
    ctx.moveTo(x0, cy - r * 0.8); ctx.lineTo(x0 - 4, cy - r * 0.5); ctx.lineTo(x0 - 2.5, cy - r * 0.15); ctx.lineTo(x0 - 4.5, cy + r * 0.2); ctx.lineTo(x0 - 2, cy + r * 0.55); ctx.lineTo(x0, cy + r * 0.8);
    ctx.closePath(); ctx.fill(); ctx.strokeStyle = C; ctx.lineWidth = 1; ctx.stroke();
    // Cinteta vermella que fa la volta al rotlle
    const cinta = ctx.createLinearGradient(xc - 3, 0, xc + 3, 0);
    cinta.addColorStop(0, '#7a1620'); cinta.addColorStop(0.45, '#d0404a'); cinta.addColorStop(1, '#8a1c26');
    ctx.fillStyle = cinta; ctx.beginPath();
    ctx.moveTo(xc - 2.6, cy - r - 0.6); ctx.quadraticCurveTo(xc - 3.4, cy, xc - 2.6, cy + r + 0.6);
    ctx.lineTo(xc + 2.6, cy + r + 0.6); ctx.quadraticCurveTo(xc + 1.8, cy, xc + 2.6, cy - r - 0.6); ctx.closePath();
    ctx.fill(); ctx.strokeStyle = '#4a0c12'; ctx.lineWidth = 0.9; ctx.stroke();
    // Les dues puntes de la cinta, penjant per sota
    [[-1, 5.5], [1, 4.5]].forEach(([s, llarg]) => {
        ctx.fillStyle = s < 0 ? '#b8323c' : '#9a2430'; ctx.beginPath();
        ctx.moveTo(xc + s * 0.5, cy + r * 0.2); ctx.quadraticCurveTo(xc + s * 4, cy + r + 2, xc + s * 5.5, cy + r + llarg);
        ctx.lineTo(xc + s * 3.2, cy + r + llarg - 1.2); ctx.lineTo(xc + s * 2.6, cy + r + llarg + 0.6);
        ctx.quadraticCurveTo(xc + s * 1.6, cy + r + 1, xc - s * 1.2, cy + r * 0.3); ctx.closePath();
        ctx.fill(); ctx.strokeStyle = '#4a0c12'; ctx.lineWidth = 0.8; ctx.stroke();
    });
    // Llaç: dues baules a dalt del lacre
    [-1, 1].forEach(s => {
        ctx.fillStyle = '#c23a44'; ctx.beginPath();
        ctx.moveTo(xc, cy - r * 0.35); ctx.bezierCurveTo(xc + s * 7, cy - r * 1.35, xc + s * 9, cy - r * 0.1, xc, cy - r * 0.2);
        ctx.fill(); ctx.strokeStyle = '#4a0c12'; ctx.lineWidth = 0.8; ctx.stroke();
        ctx.strokeStyle = 'rgba(255,190,190,0.6)'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(xc + s * 2, cy - r * 0.6); ctx.quadraticCurveTo(xc + s * 4.5, cy - r * 0.95, xc + s * 6, cy - r * 0.6); ctx.stroke();
    });
    // Lacre: gota de cera vermella fosa, amb la vora irregular, una creu en relleu i lluentor
    ctx.fillStyle = '#a3202c'; ctx.beginPath();
    for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2, rr = 4.6 + ((k * 5) % 3) * 0.45; const px = xc + Math.cos(a) * rr, py = cy + 0.5 + Math.sin(a) * rr * 0.92; k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#4a0810'; ctx.lineWidth = 0.9; ctx.stroke();
    ctx.fillStyle = '#c8333f'; ctx.beginPath(); ctx.arc(xc, cy + 0.5, 3.1, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#6a0e18'; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(xc, cy - 1.6); ctx.lineTo(xc, cy + 2.6); ctx.moveTo(xc - 1.6, cy + 0.2); ctx.lineTo(xc + 1.6, cy + 0.2); ctx.stroke();
    ctx.fillStyle = 'rgba(255,215,215,0.75)'; ctx.beginPath(); ctx.ellipse(xc - 1.6, cy - 1.4, 1.1, 0.7, -0.6, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
}

// Pergamí desplegat i clavat a la paret: full gastat, doblegat en quatre, amb les vores cremades, una cantonada girada, línies d'escriptura i tres claus
function dibuixarPergamiParet(c, w) {
    const L = w / RES, H = Math.round(L * 1.28);
    lienc(c, w, H * RES, ctx => { ctx.scale(RES, RES); pintarPergamiParet(ctx, L, H); });
}

function pintarPergamiParet(ctx, w, h) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    let llavor = 17;
    const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
    const C = '#2a1608', x0 = 5, x1 = w - 5, y0 = 5, y1 = h - 7;
    // Contorn irregular del full: vores esquinçades i una mossa a la cantonada de dalt a l'esquerra
    const vora = [];
    const costat = (xa, ya, xb, yb, n, amp) => { for (let k = 0; k < n; k++) { const t = k / n; vora.push([xa + (xb - xa) * t + (rnd() - 0.5) * amp, ya + (yb - ya) * t + (rnd() - 0.5) * amp]); } };
    costat(x0 + 7, y0, x1, y0 + 1, 9, 2.4); costat(x1, y0 + 1, x1 - 2, y1, 12, 2.6); costat(x1 - 2, y1, x0 + 1, y1 - 1, 9, 2.4); costat(x0 + 1, y1 - 1, x0, y0 + 9, 12, 2.6);
    vora.push([x0 + 2, y0 + 7], [x0 + 5, y0 + 4]);
    const trac = () => { ctx.beginPath(); vora.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); };
    // Ombra damunt la paret
    ctx.save(); ctx.translate(2.5, 3); ctx.fillStyle = 'rgba(0,0,0,0.32)'; trac(); ctx.fill(); ctx.restore();
    // Paper
    const g = ctx.createLinearGradient(0, y0, w, y1);
    g.addColorStop(0, '#eadbab'); g.addColorStop(0.5, '#dcc690'); g.addColorStop(1, '#c4a768');
    ctx.fillStyle = g; trac(); ctx.fill();
    ctx.save(); trac(); ctx.clip();
    // Taques d'humitat i de fum
    for (let i = 0; i < 9; i++) {
        const x = x0 + rnd() * (x1 - x0), y = y0 + rnd() * (y1 - y0), r = 5 + rnd() * 11;
        const m = ctx.createRadialGradient(x, y, 0, x, y, r);
        m.addColorStop(0, i % 3 ? 'rgba(140,100,40,0.26)' : 'rgba(90,60,24,0.2)'); m.addColorStop(1, 'rgba(140,100,40,0)');
        ctx.fillStyle = m; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    // Vores cremades i fosques
    const cremat = ctx.createLinearGradient(0, 0, 0, h);
    cremat.addColorStop(0, 'rgba(70,40,14,0.55)'); cremat.addColorStop(0.1, 'rgba(70,40,14,0)'); cremat.addColorStop(0.9, 'rgba(70,40,14,0)'); cremat.addColorStop(1, 'rgba(70,40,14,0.6)');
    ctx.fillStyle = cremat; ctx.fillRect(0, 0, w, h);
    const lateral = ctx.createLinearGradient(0, 0, w, 0);
    lateral.addColorStop(0, 'rgba(70,40,14,0.5)'); lateral.addColorStop(0.1, 'rgba(70,40,14,0)'); lateral.addColorStop(0.9, 'rgba(70,40,14,0)'); lateral.addColorStop(1, 'rgba(70,40,14,0.5)');
    ctx.fillStyle = lateral; ctx.fillRect(0, 0, w, h);
    // Línies d'escriptura sense sentit: una caplletra gran i després línies de paraules fetes de traços
    ctx.strokeStyle = 'rgba(52,28,8,0.78)'; ctx.fillStyle = 'rgba(52,28,8,0.78)';
    ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(x0 + 12, y0 + 18, 6.5, 0.4, Math.PI * 1.8); ctx.stroke();
    ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x0 + 13, y0 + 14); ctx.lineTo(x0 + 13, y0 + 23); ctx.stroke();
    ctx.lineWidth = 1.2;
    const fil = (ya, xa, xb) => {
        let x = xa;
        while (x < xb) {
            const llarg = Math.min(xb - x, 5 + rnd() * 10);
            ctx.beginPath(); ctx.moveTo(x, ya); ctx.lineTo(x + llarg, ya + (rnd() - 0.5) * 0.6); ctx.stroke();
            for (let k = x + 1.5; k < x + llarg - 1; k += 2.6 + rnd() * 1.6) { ctx.beginPath(); ctx.moveTo(k, ya); ctx.lineTo(k, ya - 1.2 - rnd() * 2); ctx.stroke(); }
            x += llarg + 3.6;
        }
    };
    fil(y0 + 14, x0 + 22, x1 - 6); fil(y0 + 21, x0 + 22, x1 - 10);
    for (let ly = y0 + 31; ly < y1 - 10; ly += 7.5) {
        if (ly > y0 + 62 && ly < y0 + 70) continue;
        fil(ly, x0 + 6, x1 - 6 - rnd() * (ly > y1 - 20 ? 22 : 6));
    }
    // Un segell petit i esvaït al peu
    ctx.fillStyle = 'rgba(150,40,40,0.45)'; ctx.beginPath(); ctx.arc(w - 17, y1 - 11, 5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(100,20,24,0.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(w - 17, y1 - 14); ctx.lineTo(w - 17, y1 - 8); ctx.moveTo(w - 20, y1 - 11); ctx.lineTo(w - 14, y1 - 11); ctx.stroke();
    // Doblecs: una creu de plecs (un vertical i dos horitzontals) amb la banda de llum i la d'ombra de cada plec
    const plec = (xa, ya, xb, yb) => {
        const nx = -(yb - ya), ny = xb - xa, n = Math.hypot(nx, ny), dx = nx / n * 1.6, dy = ny / n * 1.6;
        ctx.strokeStyle = 'rgba(60,34,10,0.55)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(xa, ya); ctx.lineTo(xb, yb); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,246,214,0.55)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(xa - dx, ya - dy); ctx.lineTo(xb - dx, yb - dy); ctx.stroke();
        ctx.strokeStyle = 'rgba(60,34,10,0.22)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xa + dx * 1.6, ya + dy * 1.6); ctx.lineTo(xb + dx * 1.6, yb + dy * 1.6); ctx.stroke();
    };
    plec(w * 0.5, y0, w * 0.52, y1);
    plec(x0, h * 0.35, x1, h * 0.37);
    plec(x0, h * 0.68, x1, h * 0.66);
    ctx.restore();
    ctx.strokeStyle = C; ctx.lineWidth = 1.4; trac(); ctx.stroke();
    // Cantonada de baix a la dreta girada cap endavant, amb la seva ombra
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.moveTo(x1 - 14, y1 - 1); ctx.lineTo(x1 - 2, y1 - 13); ctx.lineTo(x1 - 1, y1 + 1); ctx.closePath(); ctx.fill();
    const gir = ctx.createLinearGradient(x1 - 14, y1 - 13, x1 - 2, y1);
    gir.addColorStop(0, '#a58650'); gir.addColorStop(1, '#cfb67c');
    ctx.fillStyle = gir; ctx.beginPath(); ctx.moveTo(x1 - 14, y1 - 2); ctx.lineTo(x1 - 3, y1 - 13); ctx.lineTo(x1 - 14, y1 - 12); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C; ctx.lineWidth = 1; ctx.stroke();
    // Estrip a la vora de l'esquerra
    ctx.strokeStyle = C; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, h * 0.55); ctx.lineTo(x0 + 9, h * 0.57); ctx.lineTo(x0 + 6, h * 0.6); ctx.stroke();
    // Tres claus de ferro que el subjecten a la paret, una a cada cantonada de dalt i una a baix
    [[x0 + 11, y0 + 3.5], [x1 - 6, y0 + 4.5], [x0 + 6, y1 - 6]].forEach(([x, y]) => {
        ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.arc(x + 1, y + 1.2, 2.4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#4a4a50'; ctx.strokeStyle = C; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, 2.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fillRect(x - 1, y - 1.2, 1, 1);
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

// ---------- Cementiri ----------
// Tots es dibuixen en unitats de disseny (texturesGenerades hi aplica RES). La base de cada peça és a baix de tot, al mig.

const PEDRA_TOMBA = { clar: '#c4c0b2', mig: '#a19d90', fosc: '#77736a', ombra: '#57544d', molsa: '#5f8036', molsaClar: '#86a650', linia: '#2a2620' };

function rndTomba(llavor) {
    return () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
}

// Taques de molsa i líquens (dins d'un retall ja posat)
function molsaTomba(ctx, rnd, x0, y0, x1, y1, n, mida = 3) {
    for (let i = 0; i < n; i++) {
        const x = x0 + rnd() * (x1 - x0), y = y0 + rnd() * (y1 - y0), r = mida * (0.5 + rnd());
        ctx.fillStyle = rnd() < 0.7 ? PEDRA_TOMBA.molsa : PEDRA_TOMBA.molsaClar;
        ctx.globalAlpha = 0.55 + rnd() * 0.4;
        ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.7, rnd() * 3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    for (let i = 0; i < n / 2; i++) {                                    // líquens grocs i grisos
        ctx.fillStyle = rnd() < 0.5 ? 'rgba(214,196,110,0.55)' : 'rgba(225,225,210,0.5)';
        ctx.beginPath(); ctx.arc(x0 + rnd() * (x1 - x0), y0 + rnd() * (y1 - y0), 0.8 + rnd() * 1.4, 0, Math.PI * 2); ctx.fill();
    }
}

// Mates d'herba als peus d'una peça
function herbaTomba(ctx, rnd, x0, x1, y, n, alt = 7) {
    ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) {
        const x = x0 + rnd() * (x1 - x0);
        for (let k = 0; k < 4; k++) {
            ctx.strokeStyle = ['#3f6a2a', '#5a8a36', '#77a548'][Math.floor(rnd() * 3)]; ctx.lineWidth = 1.3;
            const a = -Math.PI / 2 + (rnd() - 0.5) * 1.1, l = alt * (0.5 + rnd() * 0.7);
            ctx.beginPath(); ctx.moveTo(x + k - 1.5, y); ctx.quadraticCurveTo(x + k - 1.5 + Math.cos(a) * l * 0.3, y - l * 0.6, x + k - 1.5 + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke();
        }
    }
    ctx.lineCap = 'butt';
}

// Gradient de pedra d'esquerra (llum) a dreta
function pedraGrad(ctx, x0, x1, clar = PEDRA_TOMBA.clar, fosc = PEDRA_TOMBA.fosc) {
    const g = ctx.createLinearGradient(x0, 0, x1, 0);
    g.addColorStop(0, clar); g.addColorStop(0.55, PEDRA_TOMBA.mig); g.addColorStop(1, fosc);
    return g;
}

// Sòcol de pedra en 3/4: cara de dalt clara, cantell dret i cara del davant
function socolTomba(ctx, x0, x1, y, alt, fons) {
    ctx.fillStyle = PEDRA_TOMBA.clar; ctx.beginPath(); ctx.moveTo(x0 + 3, y - alt - fons); ctx.lineTo(x1 + 3, y - alt - fons); ctx.lineTo(x1, y - alt); ctx.lineTo(x0, y - alt); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = PEDRA_TOMBA.ombra; ctx.beginPath(); ctx.moveTo(x1, y - alt); ctx.lineTo(x1 + 3, y - alt - fons); ctx.lineTo(x1 + 3, y - fons); ctx.lineTo(x1, y); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = pedraGrad(ctx, x0, x1); ctx.fillRect(x0, y - alt, x1 - x0, alt); ctx.strokeRect(x0, y - alt, x1 - x0, alt);
}

// Creu llatina de pedra (contorn), amb el peu a (cx, top)
function formaCreuPedra(ctx, cx, top, b, braca, alt, dx = 0, dy = 0) {
    const yb1 = top - alt * 0.57, yb2 = top - alt * 0.77;
    ctx.beginPath();
    ctx.moveTo(cx - b + dx, top + dy); ctx.lineTo(cx - b + dx, yb1 + dy); ctx.lineTo(cx - braca + dx, yb1 + dy); ctx.lineTo(cx - braca + dx, yb2 + dy);
    ctx.lineTo(cx - b + dx, yb2 + dy); ctx.lineTo(cx - b + dx, top - alt + dy); ctx.lineTo(cx + b + dx, top - alt + dy); ctx.lineTo(cx + b + dx, yb2 + dy);
    ctx.lineTo(cx + braca + dx, yb2 + dy); ctx.lineTo(cx + braca + dx, yb1 + dy); ctx.lineTo(cx + b + dx, yb1 + dy); ctx.lineTo(cx + b + dx, top + dy); ctx.closePath();
}

// Creu de pedra amb gruix, molsa i llum a la vora esquerra
function creuPedra(ctx, rnd, cx, top, b, braca, alt) {
    ctx.strokeStyle = PEDRA_TOMBA.linia; ctx.lineWidth = 1.6;
    ctx.fillStyle = PEDRA_TOMBA.ombra; formaCreuPedra(ctx, cx, top, b, braca, alt, 3.5, -2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = pedraGrad(ctx, cx - braca, cx + braca); formaCreuPedra(ctx, cx, top, b, braca, alt); ctx.fill();
    ctx.save(); formaCreuPedra(ctx, cx, top, b, braca, alt); ctx.clip();
    molsaTomba(ctx, rnd, cx - braca, top - alt, cx + braca, top, 9, 2.2);
    ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.fillRect(cx - b, top - alt, 2, alt); ctx.fillRect(cx - braca, top - alt * 0.77, braca * 2, 1.6);
    ctx.restore();
    formaCreuPedra(ctx, cx, top, b, braca, alt); ctx.stroke();
}

// Làpida d'arc (56 x 80): pedra gastada amb vora, creu gravada, inscripció i molsa
function pintarLapidaArc(ctx, W, H, llavor = 3) {
    const rnd = rndTomba(llavor), base = H - 4;
    ombraTerra(ctx, W / 2 + 3, base - 1, W * 0.44, 4.5);
    ctx.lineJoin = 'round'; ctx.strokeStyle = PEDRA_TOMBA.linia; ctx.lineWidth = 1.6;
    socolTomba(ctx, 7, W - 9, base, 8, 3);
    const x0 = 12, x1 = W - 14, cim = 20, r = (x1 - x0) / 2, top = base - 8;
    const forma = (dx, dy) => { ctx.beginPath(); ctx.moveTo(x0 + dx, top + dy); ctx.lineTo(x0 + dx, cim + r + dy); ctx.arc((x0 + x1) / 2 + dx, cim + r + dy, r, Math.PI, 0); ctx.lineTo(x1 + dx, top + dy); ctx.closePath(); };
    ctx.fillStyle = PEDRA_TOMBA.ombra; forma(3.5, -2); ctx.fill(); ctx.stroke();       // gruix (cantell dret)
    ctx.fillStyle = pedraGrad(ctx, x0, x1); forma(0, 0); ctx.fill();
    ctx.save(); forma(0, 0); ctx.clip();
    molsaTomba(ctx, rnd, x0, top - 10, x1, top, 9, 2.6);
    molsaTomba(ctx, rnd, x0, cim, x0 + 12, cim + 14, 4, 2.2);
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(x0, cim, 3, top - cim);
    ctx.restore();
    ctx.strokeStyle = PEDRA_TOMBA.linia; ctx.lineWidth = 1.6; forma(0, 0); ctx.stroke();
    // Vora gravada
    ctx.strokeStyle = 'rgba(60,56,48,0.55)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x0 + 4, top - 4); ctx.lineTo(x0 + 4, cim + r); ctx.arc((x0 + x1) / 2, cim + r, r - 4, Math.PI, 0); ctx.lineTo(x1 - 4, top - 4); ctx.stroke();
    // Creu gravada (solc fosc amb la llum a sota)
    const cx = (x0 + x1) / 2, cy = cim + 15;
    ['rgba(255,255,255,0.35)', 'rgba(40,36,30,0.75)'].forEach((c, i) => {
        ctx.strokeStyle = c; ctx.lineWidth = 2; const d = i ? 0 : 0.8;
        ctx.beginPath(); ctx.moveTo(cx + d, cy - 9 + d); ctx.lineTo(cx + d, cy + 9 + d); ctx.moveTo(cx - 6 + d, cy - 3 + d); ctx.lineTo(cx + 6 + d, cy - 3 + d); ctx.stroke();
    });
    // Inscripció
    ctx.strokeStyle = 'rgba(40,36,30,0.55)'; ctx.lineWidth = 1.1;
    [[cy + 16, 0.7], [cy + 21, 0.5], [cy + 26, 0.6]].forEach(([y, f]) => { ctx.beginPath(); ctx.moveTo(cx - r * f, y); ctx.lineTo(cx + r * f, y); ctx.stroke(); });
    // Esquerda fina
    ctx.strokeStyle = 'rgba(30,26,20,0.6)'; ctx.lineWidth = 0.9;
    ctx.beginPath(); ctx.moveTo(x1 - 3, cim + r + 4); ctx.lineTo(x1 - 8, cim + r + 10); ctx.lineTo(x1 - 6, cim + r + 16); ctx.stroke();
    herbaTomba(ctx, rnd, 4, W - 6, base, 6);
}

// Creu de pedra sobre un sòcol de dos graons (54 x 90)
function pintarLapidaCreu(ctx, W, H, llavor = 5) {
    const rnd = rndTomba(llavor), base = H - 4, cx = W / 2 - 1;
    ombraTerra(ctx, cx + 3, base - 1, W * 0.42, 4.5);
    ctx.lineJoin = 'round'; ctx.strokeStyle = PEDRA_TOMBA.linia; ctx.lineWidth = 1.6;
    socolTomba(ctx, cx - 18, cx + 18, base, 6, 3);
    socolTomba(ctx, cx - 11, cx + 11, base - 6, 9, 2);
    const top = base - 15, alt = 62;
    creuPedra(ctx, rnd, cx, top, 5.5, 17, alt);
    ctx.fillStyle = 'rgba(40,36,30,0.6)'; ctx.beginPath(); ctx.arc(cx, top - alt * 0.67, 2.2, 0, Math.PI * 2); ctx.fill();   // rosetó del mig
    herbaTomba(ctx, rnd, cx - 20, cx + 20, base, 5);
}

// Creu de ferro forjat amb volutes i plaqueta (46 x 84), una mica tòrcida, clavada en un dau de pedra
function pintarLapidaFerro(ctx, W, H, llavor = 7) {
    const rnd = rndTomba(llavor), base = H - 4, cx = W / 2;
    ombraTerra(ctx, cx + 2, base - 1, W * 0.36, 4);
    ctx.lineJoin = 'round'; ctx.strokeStyle = PEDRA_TOMBA.linia; ctx.lineWidth = 1.5;
    socolTomba(ctx, cx - 11, cx + 11, base, 9, 3);
    ctx.save(); ctx.translate(cx, base - 9); ctx.rotate(0.07);
    const ferro = (lw, c) => {
        ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -64); ctx.moveTo(-17, -46); ctx.lineTo(17, -46); ctx.stroke();
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { ctx.beginPath(); ctx.arc(sx * 6.5, -46 + sy * 6.5, 3.2, Math.PI * 0.2, Math.PI * 1.6); ctx.stroke(); });   // volutes
        [[0, -66], [-19, -46], [19, -46]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2); ctx.stroke(); });                           // trèvols
    };
    ferro(4, '#0e0c0a'); ferro(2, '#3a3632');
    ctx.strokeStyle = 'rgba(160,150,140,0.5)'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(-1, -2); ctx.lineTo(-1, -62); ctx.stroke();
    ctx.strokeStyle = 'rgba(150,70,30,0.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(0, -14); ctx.stroke();   // rovell
    // Plaqueta esmaltada
    ctx.fillStyle = '#e8e2cc'; ctx.strokeStyle = '#1a1612'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.ellipse(0, -30, 7, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(40,36,30,0.6)'; ctx.lineWidth = 0.8; [-31.5, -28.5].forEach(y => { ctx.beginPath(); ctx.moveTo(-4, y); ctx.lineTo(4, y); ctx.stroke(); });
    ctx.restore();
    ctx.lineCap = 'butt';
    herbaTomba(ctx, rnd, cx - 15, cx + 15, base, 4, 8);
}

// Vorada de pedra d'una tomba vista en 3/4 (el davant a baix). Retorna els quatre vèrtexs de l'interior
function voradaTomba(ctx, W, base, fons, marge, entrant) {
    const a = { x: marge, y: base - 5 }, b = { x: W - marge, y: base - 5 }, c = { x: W - marge - entrant, y: base - 5 - fons }, d = { x: marge + entrant, y: base - 5 - fons };
    ctx.fillStyle = PEDRA_TOMBA.fosc; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(b.x, base); ctx.lineTo(a.x, base); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = PEDRA_TOMBA.clar; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y); ctx.closePath(); ctx.fill(); ctx.stroke();
    const k = 5;
    return [{ x: a.x + k + 1, y: a.y - k * 0.6 }, { x: b.x - k - 1, y: b.y - k * 0.6 }, { x: c.x - k + 1, y: c.y + k * 0.5 }, { x: d.x + k - 1, y: d.y + k * 0.5 }];
}
function camiPunts(ctx, p) { ctx.beginPath(); ctx.moveTo(p[0].x, p[0].y); p.slice(1).forEach(q => ctx.lineTo(q.x, q.y)); ctx.closePath(); }

// Herba d'un túmul dins la vorada
function tumulHerba(ctx, rnd, dins, W, base, fons) {
    camiPunts(ctx, dins); ctx.fillStyle = '#4c7432'; ctx.fill();
    ctx.save(); camiPunts(ctx, dins); ctx.clip();
    const g = ctx.createRadialGradient(W / 2, base - fons * 0.55, 4, W / 2, base - fons * 0.5, W * 0.45);
    g.addColorStop(0, 'rgba(140,190,90,0.45)'); g.addColorStop(1, 'rgba(20,40,15,0.45)');
    ctx.fillStyle = g; ctx.fillRect(0, base - fons - 8, W, fons + 8);
    herbaTomba(ctx, rnd, 12, W - 12, base - 7, 12, 6);
    herbaTomba(ctx, rnd, 16, W - 16, base - fons * 0.5, 9, 5);
    ctx.restore();
}

// Tomba a terra amb vorada (110 x 96), coberta de grava ('grava'), d'herba ('herba') o d'herba florida ('flors'),
// i una làpida petita al cap
function pintarTombaVorada(ctx, W, H, mode, llavor = 11) {
    const rnd = rndTomba(llavor), base = H - 3, fons = 34;
    ombraTerra(ctx, W / 2 + 2, base - 4, W * 0.5, 7);
    ctx.lineJoin = 'round'; ctx.strokeStyle = PEDRA_TOMBA.linia; ctx.lineWidth = 1.5;
    // Làpida del cap, darrere la vorada
    const lx0 = W / 2 - 20, lx1 = W / 2 + 20, lb = base - fons - 2, lt = lb - 40;
    const lap = (dx, dy) => { ctx.beginPath(); ctx.moveTo(lx0 + dx, lb + dy); ctx.lineTo(lx0 + dx, lt + 10 + dy); ctx.quadraticCurveTo(W / 2 + dx, lt - 6 + dy, lx1 + dx, lt + 10 + dy); ctx.lineTo(lx1 + dx, lb + dy); ctx.closePath(); };
    ctx.fillStyle = PEDRA_TOMBA.ombra; lap(3, -2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = pedraGrad(ctx, lx0, lx1); lap(0, 0); ctx.fill();
    ctx.save(); lap(0, 0); ctx.clip(); molsaTomba(ctx, rnd, lx0, lb - 8, lx1, lb, 6, 2.2); ctx.restore();
    lap(0, 0); ctx.stroke();
    ctx.strokeStyle = 'rgba(40,36,30,0.6)'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(W / 2, lt + 6); ctx.lineTo(W / 2, lt + 20); ctx.moveTo(W / 2 - 5, lt + 11); ctx.lineTo(W / 2 + 5, lt + 11); ctx.stroke();
    ctx.lineWidth = 1; [lt + 26, lt + 30].forEach(y => { ctx.beginPath(); ctx.moveTo(W / 2 - 11, y); ctx.lineTo(W / 2 + 11, y); ctx.stroke(); });
    ctx.strokeStyle = PEDRA_TOMBA.linia; ctx.lineWidth = 1.5;
    const dins = voradaTomba(ctx, W, base, fons, 6, 7);
    if (mode === 'grava') {
        camiPunts(ctx, dins); ctx.fillStyle = '#8c8676'; ctx.fill();
        ctx.save(); camiPunts(ctx, dins); ctx.clip();
        for (let i = 0; i < 160; i++) { ctx.fillStyle = ['#b2ab98', '#6e695c', '#c8c2b0', '#958f7e'][i % 4]; ctx.beginPath(); ctx.ellipse(rnd() * W, base - fons - 4 + rnd() * (fons + 2), 1 + rnd() * 1.2, 0.7 + rnd() * 0.6, 0, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
    } else {
        tumulHerba(ctx, rnd, dins, W, base, fons);
        const cols = mode === 'flors' ? ['#d9c2f0', '#f2e6a0', '#ffffff', '#c89ae0'] : ['#e8e2c8'];
        for (let i = 0; i < (mode === 'flors' ? 16 : 6); i++) {
            const x = 18 + rnd() * (W - 36), y = base - 10 - rnd() * (fons - 12);
            ctx.fillStyle = cols[i % cols.length];
            for (let p = 0; p < 5; p++) { const a = p * Math.PI * 0.4; ctx.beginPath(); ctx.arc(x + Math.cos(a) * 1.5, y + Math.sin(a) * 1.2, 1.2, 0, Math.PI * 2); ctx.fill(); }
            ctx.fillStyle = '#e0a830'; ctx.beginPath(); ctx.arc(x, y, 0.8, 0, Math.PI * 2); ctx.fill();
        }
    }
    ctx.strokeStyle = PEDRA_TOMBA.linia; ctx.lineWidth = 1.2; camiPunts(ctx, dins); ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.rect(0, base - 6, W, 6); ctx.clip(); molsaTomba(ctx, rnd, 6, base - 5, W - 6, base, 7, 1.8); ctx.restore();
    herbaTomba(ctx, rnd, 2, W - 2, base, 7, 6);
}

// Creueta de tomba (alt 36): creu curta de pedra amb una anella al creuer, a l'estil de les creus de cementiri
function creuTomba(ctx, rnd, cx, top) {
    const alt = 36, b = 3.6, braca = 11, cy = top - alt * 0.67;
    const anella = (dx, dy) => { ctx.beginPath(); ctx.arc(cx + dx, cy + dy, 9.5, 0, Math.PI * 2); ctx.arc(cx + dx, cy + dy, 6.2, 0, Math.PI * 2, true); };
    ctx.strokeStyle = PEDRA_TOMBA.linia; ctx.lineWidth = 1.4;
    ctx.fillStyle = PEDRA_TOMBA.ombra; anella(2.5, -1.5); ctx.fill(); ctx.stroke();      // gruix
    formaCreuPedra(ctx, cx, top, b, braca, alt, 2.5, -1.5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = pedraGrad(ctx, cx - 10, cx + 10); anella(0, 0); ctx.fill(); ctx.stroke();
    ctx.fillStyle = pedraGrad(ctx, cx - braca, cx + braca); formaCreuPedra(ctx, cx, top, b, braca, alt); ctx.fill();
    ctx.save(); formaCreuPedra(ctx, cx, top, b, braca, alt); ctx.clip();
    molsaTomba(ctx, rnd, cx - braca, top - 10, cx + braca, top, 5, 1.6);
    ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.fillRect(cx - b, top - alt, 1.5, alt);
    ctx.restore();
    formaCreuPedra(ctx, cx, top, b, braca, alt); ctx.stroke();
    ctx.fillStyle = 'rgba(40,36,30,0.6)'; ctx.beginPath(); ctx.arc(cx, cy, 1.5, 0, Math.PI * 2); ctx.fill();   // rosetó
}

// Tomba de la creueta (140 x 112): vorada a terra, túmul d'herba i una creueta de pedra al cap
function pintarTombaCreu(ctx, W, H) {
    pintarTombaRam(ctx, W, H, null, (rnd, cx, sb) => {
        socolTomba(ctx, cx - 12, cx + 12, sb, 6, 2);
        creuTomba(ctx, rnd, cx, sb - 6);
        ctx.strokeStyle = 'rgba(40,36,30,0.65)'; ctx.lineWidth = 0.9;                 // inscripció del sòcol
        ctx.beginPath(); ctx.moveTo(cx - 7, sb - 3); ctx.lineTo(cx + 7, sb - 3); ctx.stroke();
    });
}

// La tomba de l'àngel on el Germà Francesc porta flors (140 x 226): l'àngel que plora al cap de la tomba i, als peus,
// un gerro amb el ram (marcit o fresc, amb una espelmeta encesa)
function pintarTombaAngel(ctx, W, H, fresc) {
    pintarTombaRam(ctx, W, H, fresc, (rnd, cx, sb) => {
        ctx.save(); ctx.translate(cx - 48, sb - 172); pintarAngelPedra(ctx, 96, 176); ctx.restore();
    });
}

// Tomba a terra amb vorada i túmul d'herba (fons 44). cap(rnd, cx, sb) dibuixa la peça del cap, amb la base a sb;
// fresc: null sense gerro, false amb el ram marcit, true amb el ram fresc
function pintarTombaRam(ctx, W, H, fresc, cap) {
    const rnd = rndTomba(29), base = H - 3, fons = 44, cx = W / 2;
    ombraTerra(ctx, cx + 2, base - 5, W * 0.5, 8);
    ctx.lineJoin = 'round'; ctx.strokeStyle = PEDRA_TOMBA.linia; ctx.lineWidth = 1.7;
    const sb = base - fons - 4;
    cap(rnd, cx, sb);
    ctx.lineJoin = 'round';
    // Vorada i túmul d'herba
    ctx.strokeStyle = PEDRA_TOMBA.linia; ctx.lineWidth = 1.7;
    const dins = voradaTomba(ctx, W, base, fons, 8, 9);
    tumulHerba(ctx, rnd, dins, W, base, fons);
    ctx.lineWidth = 1.2; camiPunts(ctx, dins); ctx.stroke();
    // Plaqueta de bronze a la vorada del davant
    ctx.fillStyle = '#8a6a2a'; ctx.strokeStyle = '#2a1c08'; ctx.lineWidth = 1;
    ctx.fillRect(cx - 12, base - 5, 24, 4.5); ctx.strokeRect(cx - 12, base - 5, 24, 4.5);
    ctx.fillStyle = 'rgba(255,220,140,0.45)'; ctx.fillRect(cx - 11, base - 4.6, 22, 1);
    if (fresc === null) {
        ctx.save(); ctx.beginPath(); ctx.rect(0, base - 6, W, 6); ctx.clip(); molsaTomba(ctx, rnd, 8, base - 5, W - 8, base, 8, 1.8); ctx.restore();
        herbaTomba(ctx, rnd, 2, W - 2, base, 8, 6);
        return;
    }
    // Gerro de pedra als peus de la tomba (el ram, baix, no tapa el cap)
    const gx = cx, gy = base - 10;
    ctx.fillStyle = pedraGrad(ctx, gx - 8, gx + 8); ctx.strokeStyle = PEDRA_TOMBA.linia; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(gx - 9, gy - 15); ctx.lineTo(gx + 9, gy - 15); ctx.lineTo(gx + 6, gy - 3); ctx.lineTo(gx + 4, gy); ctx.lineTo(gx - 4, gy); ctx.lineTo(gx - 6, gy - 3); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = PEDRA_TOMBA.ombra; ctx.beginPath(); ctx.ellipse(gx, gy - 15, 9, 2.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // Ram
    ctx.lineCap = 'round';
    const tiges = [[-11, -20], [-5, -23], [0, -25], [6, -22], [12, -19], [-14, -15], [15, -14]];
    tiges.forEach(([dx, dy], i) => {
        const caiguda = (i % 2 ? 1 : -1) * (8 + i);                       // les marcides s'arrosseguen cap avall
        const fx = gx + dx + (fresc ? 0 : caiguda * 0.5), fy = gy - 15 + (fresc ? dy : dy * 0.45 + 8);
        ctx.strokeStyle = fresc ? '#3f7a2a' : '#6a5a30'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(gx + dx * 0.15, gy - 15); ctx.quadraticCurveTo(gx + dx * 0.6, gy - 15 + dy * (fresc ? 0.7 : 0.5), fx, fy); ctx.stroke();
        if (fresc) {
            ctx.fillStyle = '#4f9a34'; ctx.beginPath(); ctx.ellipse(gx + dx * 0.55, gy - 15 + dy * 0.55, 3.2, 1.5, Math.atan2(dy, dx), 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = ['#f4f0f8', '#e86a8a', '#f6d24a', '#c8a0f0', '#ffffff', '#f09ab4', '#ffd870'][i]; ctx.strokeStyle = 'rgba(40,20,20,0.6)'; ctx.lineWidth = 0.8;
            for (let p = 0; p < 6; p++) { const a = p * Math.PI / 3; ctx.beginPath(); ctx.arc(fx + Math.cos(a) * 2.6, fy + Math.sin(a) * 2.3, 2.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
            ctx.fillStyle = i % 2 ? '#e8a020' : '#a05a20'; ctx.beginPath(); ctx.arc(fx, fy, 1.5, 0, Math.PI * 2); ctx.fill();
        } else {
            ctx.fillStyle = ['#7a5a3a', '#8a6a48', '#6a4a30'][i % 3]; ctx.strokeStyle = 'rgba(30,20,10,0.6)'; ctx.lineWidth = 0.7;
            ctx.beginPath(); ctx.ellipse(fx, fy + 1.5, 2.4, 3.4, 0.4 * (i % 2 ? 1 : -1), 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        }
    });
    if (!fresc) {                                                         // pètals secs caiguts
        for (let i = 0; i < 7; i++) { ctx.fillStyle = 'rgba(120,90,55,0.85)'; ctx.beginPath(); ctx.ellipse(gx - 26 + rnd() * 52, gy - 8 + rnd() * 12, 1.6, 1, rnd() * 3, 0, Math.PI * 2); ctx.fill(); }
    } else {                                                              // espelmeta encesa al costat
        ctx.fillStyle = '#efe6cc'; ctx.strokeStyle = PEDRA_TOMBA.linia; ctx.lineWidth = 1;
        ctx.fillRect(gx + 16, gy - 9, 5, 9); ctx.strokeRect(gx + 16, gy - 9, 5, 9);
        const fl = ctx.createRadialGradient(gx + 18.5, gy - 13, 0, gx + 18.5, gy - 13, 8); fl.addColorStop(0, 'rgba(255,220,130,0.9)'); fl.addColorStop(1, 'rgba(255,200,100,0)');
        ctx.fillStyle = fl; ctx.beginPath(); ctx.arc(gx + 18.5, gy - 13, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffcc55'; ctx.beginPath(); ctx.ellipse(gx + 18.5, gy - 12.5, 1.6, 3, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.lineCap = 'butt';
    ctx.save(); ctx.beginPath(); ctx.rect(0, base - 6, W, 6); ctx.clip(); molsaTomba(ctx, rnd, 8, base - 5, W - 8, base, 8, 1.8); ctx.restore();
    herbaTomba(ctx, rnd, 2, W - 2, base, 8, 6);
}

// Àngel de pedra que plora sobre un pedestal (96 x 176)
function pintarAngelPedra(ctx, W, H) {
    const rnd = rndTomba(41), base = H - 4, cx = W / 2;
    ombraTerra(ctx, cx + 4, base - 1, W * 0.46, 6);
    ctx.lineJoin = 'round'; ctx.strokeStyle = PEDRA_TOMBA.linia; ctx.lineWidth = 1.8;
    socolTomba(ctx, cx - 34, cx + 34, base, 10, 5);
    socolTomba(ctx, cx - 26, cx + 26, base - 10, 34, 4);
    socolTomba(ctx, cx - 30, cx + 30, base - 44, 7, 4);
    ctx.strokeStyle = 'rgba(40,36,30,0.55)'; ctx.lineWidth = 1.1;                  // inscripció del pedestal
    [base - 32, base - 27, base - 22].forEach((y, i) => { ctx.beginPath(); ctx.moveTo(cx - 15 + i * 3, y); ctx.lineTo(cx + 15 - i * 3, y); ctx.stroke(); });
    ctx.save(); ctx.beginPath(); ctx.rect(cx - 26, base - 44, 52, 34); ctx.clip(); molsaTomba(ctx, rnd, cx - 26, base - 20, cx + 26, base - 10, 10, 2.4); ctx.restore();
    const peu = base - 51;
    ctx.strokeStyle = PEDRA_TOMBA.linia; ctx.lineWidth = 1.8;
    // Ales (darrere)
    const ala = s => {
        ctx.beginPath(); ctx.moveTo(cx + s * 6, peu - 88);
        ctx.bezierCurveTo(cx + s * 30, peu - 118, cx + s * 46, peu - 100, cx + s * 40, peu - 64);
        ctx.bezierCurveTo(cx + s * 38, peu - 40, cx + s * 30, peu - 20, cx + s * 22, peu - 6);
        ctx.bezierCurveTo(cx + s * 22, peu - 30, cx + s * 14, peu - 60, cx + s * 6, peu - 68); ctx.closePath();
    };
    [-1, 1].forEach(s => {
        ctx.fillStyle = s < 0 ? '#b6b2a4' : '#86827a'; ala(s); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(50,46,40,0.5)'; ctx.lineWidth = 1;          // plomes
        for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.moveTo(cx + s * (12 + k * 2), peu - 80 + k * 10); ctx.quadraticCurveTo(cx + s * (30 + k), peu - 78 + k * 12, cx + s * (36 - k * 2), peu - 58 + k * 9); ctx.stroke(); }
        ctx.strokeStyle = PEDRA_TOMBA.linia; ctx.lineWidth = 1.8;
    });
    // Túnica
    ctx.fillStyle = pedraGrad(ctx, cx - 22, cx + 22);
    ctx.beginPath(); ctx.moveTo(cx - 10, peu - 76); ctx.quadraticCurveTo(cx - 22, peu - 40, cx - 21, peu); ctx.lineTo(cx + 21, peu); ctx.quadraticCurveTo(cx + 22, peu - 40, cx + 10, peu - 76); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(50,46,40,0.55)'; ctx.lineWidth = 1.2;                   // plecs
    [[-12, -2], [-5, 0], [3, 0], [11, -1]].forEach(([dx, c]) => { ctx.beginPath(); ctx.moveTo(cx + dx * 0.4, peu - 50); ctx.quadraticCurveTo(cx + dx + c, peu - 26, cx + dx * 1.3, peu - 1); ctx.stroke(); });
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.moveTo(cx - 9, peu - 70); ctx.quadraticCurveTo(cx - 18, peu - 40, cx - 17, peu - 2); ctx.lineTo(cx - 13, peu - 2); ctx.quadraticCurveTo(cx - 13, peu - 40, cx - 6, peu - 70); ctx.fill();
    // Braços plegats amb les mans juntes sota la cara
    ctx.strokeStyle = PEDRA_TOMBA.linia; ctx.lineWidth = 1.8; ctx.fillStyle = PEDRA_TOMBA.mig;
    ctx.beginPath(); ctx.moveTo(cx - 11, peu - 72); ctx.quadraticCurveTo(cx - 16, peu - 56, cx - 5, peu - 52); ctx.lineTo(cx + 2, peu - 68); ctx.lineTo(cx - 4, peu - 74); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#8f8b80';
    ctx.beginPath(); ctx.moveTo(cx + 11, peu - 72); ctx.quadraticCurveTo(cx + 15, peu - 56, cx + 5, peu - 52); ctx.lineTo(cx - 1, peu - 68); ctx.lineTo(cx + 4, peu - 74); ctx.closePath(); ctx.fill(); ctx.stroke();
    // Cap cot, amb els cabells recollits
    ctx.fillStyle = PEDRA_TOMBA.clar;
    ctx.beginPath(); ctx.ellipse(cx + 2, peu - 82, 8.5, 9.5, 0.35, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = PEDRA_TOMBA.mig;
    ctx.beginPath(); ctx.ellipse(cx - 1, peu - 86, 9, 7, 0.35, Math.PI * 0.9, Math.PI * 2.1); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(50,46,40,0.6)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx + 2, peu - 80); ctx.quadraticCurveTo(cx + 5, peu - 78, cx + 8, peu - 79); ctx.stroke();   // parpella closa
    // Molsa i líquens per la figura
    for (let i = 0; i < 14; i++) { ctx.fillStyle = rnd() < 0.6 ? 'rgba(95,128,54,0.55)' : 'rgba(214,196,110,0.45)'; ctx.beginPath(); ctx.arc(cx - 16 + rnd() * 32, peu - 4 - rnd() * 40, 1 + rnd() * 2, 0, Math.PI * 2); ctx.fill(); }
    herbaTomba(ctx, rnd, cx - 38, cx + 38, base, 9, 8);
}

// La gran tomba dels monjos primers (240 x 150): sarcòfag sobre una plataforma de dos graons, arcs cecs al davant,
// columnetes als cantons, heura i la tapa esquerdada (oberta: en surt llum lila; tancada: només la ferida a la pedra)
function pintarTombaMonjos(ctx, W, H, oberta = true) {
    const rnd = rndTomba(53), base = H - 4;
    ombraTerra(ctx, W / 2 + 4, base - 3, W * 0.5, 10);
    ctx.lineJoin = 'round'; ctx.strokeStyle = PEDRA_TOMBA.linia; ctx.lineWidth = 2.2;
    socolTomba(ctx, 6, W - 14, base, 10, 14);
    socolTomba(ctx, 20, W - 28, base - 10, 10, 12);
    const x0 = 34, x1 = W - 44, yb = base - 20, yt = yb - 56, fons = 30, ent = 10;
    // Cantell dret i cara del davant
    ctx.fillStyle = PEDRA_TOMBA.ombra; ctx.beginPath(); ctx.moveTo(x1, yb); ctx.lineTo(x1 + ent, yb - fons); ctx.lineTo(x1 + ent, yt - fons); ctx.lineTo(x1, yt); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = pedraGrad(ctx, x0, x1, '#bdb8a8', '#8a867a'); ctx.fillRect(x0, yt, x1 - x0, yb - yt); ctx.strokeRect(x0, yt, x1 - x0, yb - yt);
    // Arcs cecs amb una creueta a dins
    const n = 4, aw = (x1 - x0 - 24) / n;
    for (let i = 0; i < n; i++) {
        const ax = x0 + 12 + i * aw, r = aw / 2 - 4;
        ctx.fillStyle = 'rgba(50,46,40,0.35)'; ctx.strokeStyle = 'rgba(40,36,30,0.7)'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(ax + 4, yb - 6); ctx.lineTo(ax + 4, yt + 24 + r); ctx.arc(ax + aw / 2, yt + 24 + r, r, Math.PI, 0); ctx.lineTo(ax + aw - 4, yb - 6); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.beginPath(); ctx.moveTo(ax + 5, yb - 7); ctx.lineTo(ax + 5, yt + 25 + r); ctx.stroke();
        ctx.strokeStyle = 'rgba(30,26,22,0.7)'; ctx.lineWidth = 1.6; const mx = ax + aw / 2, my = yt + 24 + r + 6;
        ctx.beginPath(); ctx.moveTo(mx, my - 5); ctx.lineTo(mx, my + 7); ctx.moveTo(mx - 4, my - 1); ctx.lineTo(mx + 4, my - 1); ctx.stroke();
    }
    // Faixa amb les lletres antigues gairebé esborrades
    ctx.fillStyle = 'rgba(230,224,206,0.6)'; ctx.fillRect(x0 + 10, yt + 6, x1 - x0 - 20, 11);
    ctx.strokeStyle = 'rgba(40,36,30,0.75)'; ctx.lineWidth = 1; ctx.strokeRect(x0 + 10, yt + 6, x1 - x0 - 20, 11);
    for (let x = x0 + 16; x < x1 - 16; x += 5 + rnd() * 3) { ctx.beginPath(); ctx.moveTo(x, yt + 9); ctx.lineTo(x + 1 + rnd() * 2, yt + 9 + rnd() * 5); ctx.stroke(); }
    // Columnetes als cantons
    ctx.strokeStyle = PEDRA_TOMBA.linia; ctx.lineWidth = 1.6;
    [x0 - 4, x1 - 6].forEach(cx => {
        ctx.fillStyle = pedraGrad(ctx, cx, cx + 10); ctx.fillRect(cx, yt, 10, yb - yt); ctx.strokeRect(cx, yt, 10, yb - yt);
        ctx.fillStyle = PEDRA_TOMBA.clar; ctx.fillRect(cx - 2, yt - 1, 14, 5); ctx.strokeRect(cx - 2, yt - 1, 14, 5); ctx.fillRect(cx - 2, yb - 5, 14, 5); ctx.strokeRect(cx - 2, yb - 5, 14, 5);
    });
    // Tapa (una mica sortida)
    const tp = [{ x: x0 - 8, y: yt }, { x: x1 + 4, y: yt }, { x: x1 + ent + 6, y: yt - fons }, { x: x0 + ent - 6, y: yt - fons }];
    ctx.lineWidth = 2.2;
    ctx.fillStyle = '#7f7b70'; ctx.beginPath(); ctx.moveTo(tp[0].x, yt); ctx.lineTo(tp[1].x, yt); ctx.lineTo(tp[1].x, yt + 6); ctx.lineTo(tp[0].x, yt + 6); ctx.closePath(); ctx.fill(); ctx.stroke();
    camiPunts(ctx, tp); ctx.fillStyle = '#b4af9f'; ctx.fill(); ctx.stroke();
    ctx.save(); camiPunts(ctx, tp); ctx.clip();
    molsaTomba(ctx, rnd, x0, yt - fons, x1 + 10, yt, 22, 3);
    // Creu gran en relleu a la tapa, en escorç
    const cxT = (x0 + x1) / 2 + 4, cyT = yt - fons / 2;
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(cxT - 40, cyT - 3, 80, 6); ctx.fillRect(cxT - 20, cyT - 11, 7, 22);
    ctx.strokeStyle = 'rgba(40,36,30,0.6)'; ctx.lineWidth = 1; ctx.strokeRect(cxT - 40, cyT - 3, 80, 6); ctx.strokeRect(cxT - 20, cyT - 11, 7, 22);
    // L'esquerda
    const esq = [[cxT + 18, yt - fons], [cxT + 12, yt - fons + 8], [cxT + 20, yt - fons + 14], [cxT + 10, yt - fons + 22], [cxT + 16, yt]];
    const linia = () => { ctx.beginPath(); esq.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); };
    if (oberta) {
        ctx.shadowColor = 'rgba(200,150,255,0.95)'; ctx.shadowBlur = 10;
        ctx.strokeStyle = '#e6cfff'; ctx.lineWidth = 3.4; linia();
        ctx.shadowBlur = 0; ctx.strokeStyle = '#7a3ac0'; ctx.lineWidth = 1.2; linia();
    } else {
        ctx.strokeStyle = 'rgba(30,26,20,0.8)'; ctx.lineWidth = 1.3; linia();
    }
    ctx.restore();
    ctx.strokeStyle = PEDRA_TOMBA.linia; ctx.lineWidth = 2.2; camiPunts(ctx, tp); ctx.stroke();
    if (oberta) {                                                        // l'esquerda baixa per la cara del davant
        ctx.shadowColor = 'rgba(200,150,255,0.9)'; ctx.shadowBlur = 8;
        ctx.strokeStyle = '#d8b8ff'; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(cxT + 16, yt + 6); ctx.lineTo(cxT + 11, yt + 20); ctx.lineTo(cxT + 15, yt + 30); ctx.stroke();
        ctx.shadowBlur = 0;
    }
    // Heura que s'enfila pel cantó esquerre
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#3a5a22'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(x0 - 2, base - 10); ctx.bezierCurveTo(x0 + 6, yb - 20, x0 - 6, yt + 20, x0 + 10, yt - 6); ctx.stroke();
    for (let i = 0; i < 16; i++) {
        const t = i / 15, x = x0 - 2 + Math.sin(t * 7) * 6 + t * 10, y = base - 10 - t * (base - 10 - yt + 6);
        ctx.fillStyle = i % 3 ? '#4f7a2e' : '#6a9a3a'; ctx.beginPath(); ctx.ellipse(x + (i % 2 ? 4 : -4), y, 3.6, 2.4, i, 0, Math.PI * 2); ctx.fill();
    }
    ctx.lineCap = 'butt';
    ctx.save(); ctx.beginPath(); ctx.rect(0, base - 20, W, 20); ctx.clip(); molsaTomba(ctx, rnd, 8, base - 18, W - 14, base, 20, 2.6); ctx.restore();
    herbaTomba(ctx, rnd, 4, W - 8, base, 16, 8);
}

// Fanalet de tomba (24 x 46): caseta de ferro amb vidres i una espelma encesa
function pintarFanalet(ctx, W, H) {
    const base = H - 3, cx = W / 2;
    ombraTerra(ctx, cx + 1, base - 1, 9, 2.5);
    ctx.lineJoin = 'round'; ctx.strokeStyle = '#0e0c0a'; ctx.lineWidth = 1.4;
    const g = ctx.createRadialGradient(cx, base - 18, 1, cx, base - 18, 11); g.addColorStop(0, 'rgba(255,214,130,0.95)'); g.addColorStop(1, 'rgba(255,180,90,0.25)');
    ctx.fillStyle = '#2a2622'; ctx.fillRect(cx - 8, base - 6, 16, 6); ctx.strokeRect(cx - 8, base - 6, 16, 6);
    ctx.fillStyle = g; ctx.fillRect(cx - 7, base - 30, 14, 24); ctx.strokeRect(cx - 7, base - 30, 14, 24);
    ctx.fillStyle = '#f4ead0'; ctx.fillRect(cx - 2, base - 15, 4, 8);
    ctx.fillStyle = '#ffd060'; ctx.beginPath(); ctx.ellipse(cx, base - 18, 1.6, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx, base - 30); ctx.lineTo(cx, base - 6); ctx.stroke();
    ctx.fillStyle = '#2a2622'; ctx.beginPath(); ctx.moveTo(cx - 10, base - 30); ctx.lineTo(cx + 10, base - 30); ctx.lineTo(cx, base - 40); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, base - 42, 2.4, 0, Math.PI * 2); ctx.stroke();
}

// L'Ocellaire (Mestre Gaspar): hàbit de monjo negre i esparracat, lligat amb cadenes (creuades al pit, a la cintura i
// grillons als canells), calb i ossut, amb els ulls lila que brillen. Una gàbia petita li penja del cinturó.
// El bàcul no hi és: el dibuixa la zona, perquè gira.
function dibuixarOcellaire(c, w) {
    lienc(c, w, w * 1.3, (ctx, W, H) => {
        const m = W / 2;
        ctx.lineWidth = 3; ctx.strokeStyle = CONTORN; ctx.lineJoin = 'round';
        // Caputxa abaixada, darrere les espatlles
        ctx.fillStyle = '#1a1418';
        ctx.beginPath(); ctx.ellipse(m, H * 0.27, W * 0.2, H * 0.06, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Hàbit: ample de baix, amb la vora esparracada
        ctx.fillStyle = '#2a2026';
        ctx.beginPath(); ctx.moveTo(m - W * 0.16, H * 0.26); ctx.lineTo(m + W * 0.16, H * 0.26);
        ctx.lineTo(m + W * 0.3, H * 0.6); ctx.lineTo(m + W * 0.36, H * 0.95);
        for (let k = 0; k <= 8; k++) ctx.lineTo(m + W * 0.36 - k * W * 0.09, H * (k % 2 ? 0.92 : 0.98));
        ctx.lineTo(m - W * 0.3, H * 0.6); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Plecs
        ctx.strokeStyle = '#120c10'; ctx.lineWidth = 2;
        [-0.12, 0, 0.12].forEach(d => { ctx.beginPath(); ctx.moveTo(m + W * d * 0.6, H * 0.62); ctx.lineTo(m + W * d * 1.5, H * 0.93); ctx.stroke(); });
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
        // Mànigues i mans ossudes amb grillons
        [-1, 1].forEach(sd => {
            ctx.fillStyle = '#2a2026';
            ctx.beginPath(); ctx.moveTo(m + sd * W * 0.14, H * 0.3); ctx.lineTo(m + sd * W * 0.34, H * 0.5); ctx.lineTo(m + sd * W * 0.3, H * 0.58); ctx.lineTo(m + sd * W * 0.18, H * 0.5); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#c8b8a8';
            ctx.beginPath(); ctx.ellipse(m + sd * W * 0.33, H * 0.6, W * 0.04, H * 0.03, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#5a5a60'; ctx.fillRect(m + sd * W * 0.33 - W * 0.05, H * 0.555, W * 0.1, H * 0.022); ctx.strokeRect(m + sd * W * 0.33 - W * 0.05, H * 0.555, W * 0.1, H * 0.022);
        });
        // Cadenes: baules grises
        const baules = (x0, y0, x1, y1, n) => {
            for (let k = 0; k <= n; k++) {
                const t = k / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t, a = Math.atan2(y1 - y0, x1 - x0);
                ctx.save(); ctx.translate(x, y); ctx.rotate(a + (k % 2 ? Math.PI / 2 : 0));
                ctx.fillStyle = '#7a7a82'; ctx.strokeStyle = '#1a1a1e'; ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.ellipse(0, 0, W * 0.022, W * 0.012, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.restore();
            }
        };
        baules(m - W * 0.15, H * 0.28, m + W * 0.24, H * 0.6, 11);
        baules(m + W * 0.15, H * 0.28, m - W * 0.24, H * 0.6, 11);
        baules(m - W * 0.27, H * 0.62, m + W * 0.27, H * 0.62, 14);
        baules(m - W * 0.33, H * 0.62, m - W * 0.36, H * 0.82, 6);       // la que penja del grilló
        baules(m + W * 0.33, H * 0.62, m + W * 0.3, H * 0.86, 7);
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
        // Cadenat al pit, on es creuen
        ctx.fillStyle = '#8a7a4a'; ctx.beginPath(); ctx.roundRect(m - W * 0.035, H * 0.42, W * 0.07, H * 0.05, 3); ctx.fill(); ctx.stroke();
        ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(m, H * 0.42, W * 0.022, Math.PI, 0); ctx.stroke(); ctx.lineWidth = 3;
        // Gàbia petita al cinturó
        ctx.strokeStyle = '#b89a50'; ctx.lineWidth = 2;
        const gx = m + W * 0.12, gy = H * 0.66;
        ctx.beginPath(); ctx.arc(gx, gy + H * 0.02, W * 0.04, Math.PI, 0); ctx.stroke();
        for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(gx + k * W * 0.018, gy + H * 0.02); ctx.lineTo(gx + k * W * 0.018, gy + H * 0.065); ctx.stroke(); }
        ctx.beginPath(); ctx.moveTo(gx - W * 0.045, gy + H * 0.065); ctx.lineTo(gx + W * 0.045, gy + H * 0.065); ctx.stroke();
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
        // Cap calb i ossut
        ctx.fillStyle = '#cdbcaa';
        ctx.beginPath(); ctx.ellipse(m, H * 0.16, W * 0.1, H * 0.085, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(m - W * 0.03, H * 0.11, W * 0.035, H * 0.02, -0.4, 0, Math.PI * 2); ctx.fill();
        // Conques fosques, celles arrufades i galtes xuclades
        ctx.fillStyle = '#3a2a2a';
        ctx.beginPath(); ctx.ellipse(m - W * 0.042, H * 0.165, W * 0.03, H * 0.02, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(m + W * 0.042, H * 0.165, W * 0.03, H * 0.02, 0, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(m - W * 0.075, H * 0.14); ctx.lineTo(m - W * 0.015, H * 0.155); ctx.moveTo(m + W * 0.075, H * 0.14); ctx.lineTo(m + W * 0.015, H * 0.155); ctx.stroke();
        ctx.strokeStyle = 'rgba(60,40,40,0.6)'; ctx.beginPath(); ctx.moveTo(m - W * 0.07, H * 0.19); ctx.lineTo(m - W * 0.05, H * 0.215); ctx.moveTo(m + W * 0.07, H * 0.19); ctx.lineTo(m + W * 0.05, H * 0.215); ctx.stroke();
        ctx.strokeStyle = CONTORN; ctx.beginPath(); ctx.moveTo(m - W * 0.03, H * 0.215); ctx.quadraticCurveTo(m, H * 0.205, m + W * 0.03, H * 0.215); ctx.stroke();
        // Ulls lila que brillen
        [-1, 1].forEach(sd => {
            const ex = m + sd * W * 0.042, ey = H * 0.165;
            const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, W * 0.05);
            g.addColorStop(0, '#ffffff'); g.addColorStop(0.25, '#b070ff'); g.addColorStop(1, 'rgba(154,80,255,0)');
            ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ex, ey, W * 0.05, 0, Math.PI * 2); ctx.fill();
        });
    });
}

// Ratpenat de boira: ales lila translúcides i dos punts vermells
function dibuixarRatpenat(c, w) {
    lienc(c, w, w * 0.6, (ctx, W, H) => {
        ctx.lineWidth = 2.5; ctx.strokeStyle = '#1a0a2a';
        ctx.fillStyle = 'rgba(120,80,170,0.85)';
        [-1, 1].forEach(sd => {
            ctx.beginPath(); ctx.moveTo(W / 2, H * 0.4);
            ctx.quadraticCurveTo(W / 2 + sd * W * 0.25, H * 0.0, W / 2 + sd * W * 0.49, H * 0.25);
            ctx.lineTo(W / 2 + sd * W * 0.4, H * 0.55); ctx.lineTo(W / 2 + sd * W * 0.3, H * 0.45); ctx.lineTo(W / 2 + sd * W * 0.2, H * 0.62);
            ctx.closePath(); ctx.fill(); ctx.stroke();
        });
        ctx.fillStyle = '#3a2050';
        ctx.beginPath(); ctx.ellipse(W / 2, H * 0.5, W * 0.1, H * 0.25, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(W / 2 - W * 0.07, H * 0.32); ctx.lineTo(W / 2 - W * 0.04, H * 0.14); ctx.lineTo(W / 2, H * 0.3); ctx.lineTo(W / 2 + W * 0.04, H * 0.14); ctx.lineTo(W / 2 + W * 0.07, H * 0.32); ctx.fill();
        ctx.fillStyle = '#ff4040'; ctx.fillRect(W / 2 - W * 0.05, H * 0.4, W * 0.03, H * 0.06); ctx.fillRect(W / 2 + W * 0.02, H * 0.4, W * 0.03, H * 0.06);
    });
}

// Ferralla viva: un garbuix d'eines rovellades (estenalles, un ganxo, una clau de gàbia i cadena) amb un ull lila
function dibuixarFerralla(c, w) {
    lienc(c, w, w * 0.9, (ctx, W, H) => {
        ombraTerra(ctx, W / 2, H * 0.92, W * 0.36, H * 0.05);
        ctx.lineCap = 'round'; ctx.strokeStyle = CONTORN;
        const eina = (x0, y0, x1, y1, color, gruix) => { ctx.lineWidth = gruix + 4; ctx.strokeStyle = CONTORN; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.lineWidth = gruix; ctx.strokeStyle = color; ctx.stroke(); };
        // Potes: dues eines que fan de cames
        eina(W * 0.35, H * 0.55, W * 0.22, H * 0.9, '#7a5030', 6);
        eina(W * 0.65, H * 0.55, W * 0.8, H * 0.9, '#6a4a2a', 6);
        // Estenalles obertes (la boca)
        eina(W * 0.3, H * 0.5, W * 0.12, H * 0.2, '#8a5a3a', 7);
        eina(W * 0.3, H * 0.5, W * 0.05, H * 0.42, '#9a6a40', 7);
        // Ganxo
        eina(W * 0.7, H * 0.55, W * 0.78, H * 0.15, '#7a6a5a', 6);
        ctx.lineWidth = 6; ctx.strokeStyle = '#7a6a5a'; ctx.beginPath(); ctx.arc(W * 0.86, H * 0.17, W * 0.08, Math.PI, Math.PI * 0.2, true); ctx.stroke();
        // Cos: un pany vell
        ctx.lineWidth = 3; ctx.strokeStyle = CONTORN; ctx.fillStyle = '#6a4a30';
        ctx.beginPath(); ctx.roundRect(W * 0.3, H * 0.36, W * 0.4, H * 0.28, 8); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(170,90,40,0.6)'; ctx.fillRect(W * 0.34, H * 0.52, W * 0.12, H * 0.07); ctx.fillRect(W * 0.55, H * 0.4, W * 0.1, H * 0.05);
        // L'ull de boira
        const g = ctx.createRadialGradient(W / 2, H * 0.47, 0, W / 2, H * 0.47, W * 0.09);
        g.addColorStop(0, '#ffffff'); g.addColorStop(0.35, '#c080ff'); g.addColorStop(1, 'rgba(154,80,255,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(W / 2, H * 0.47, W * 0.09, 0, Math.PI * 2); ctx.fill();
        // Cadena que penja
        ctx.lineWidth = 2; ctx.strokeStyle = '#5a5a60';
        for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.ellipse(W * 0.5 + k * 4, H * 0.66 + k * 7, 4, 3, k % 2 ? 1.2 : 0, 0, Math.PI * 2); ctx.stroke(); }
    });
}

// Capoll de boira on dorm un nen (es trenca amb Runna)
function dibuixarCapoll(c, w) {
    lienc(c, w, w * 1.6, (ctx, W, H) => {
        const g = ctx.createRadialGradient(W / 2, H * 0.5, 4, W / 2, H * 0.5, W * 0.5);
        g.addColorStop(0, 'rgba(60,30,90,0.9)'); g.addColorStop(0.6, 'rgba(184,138,255,0.75)'); g.addColorStop(1, 'rgba(224,200,255,0.4)');
        ctx.fillStyle = g; ctx.strokeStyle = '#e0c8ff'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.ellipse(W / 2, H / 2, W * 0.46, H * 0.47, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(224,200,255,0.6)'; ctx.lineWidth = 2;
        for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.ellipse(W / 2, H / 2, W * 0.46, H * (0.12 + k * 0.08), 0.3 * (k - 2), 0, Math.PI * 2); ctx.stroke(); }
    });
}

// El turista corromput per la boira (el «Visitant»): camisa hawaiana, gorra de sol, càmera al pit, mitjons amb sandàlies i la mirada perduda.
function dibuixarTurista(canvas, w) {
    const h = Math.round(w * 4 / 3);
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    const s = w / 96;
    ctx.scale(s, s);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.lineWidth = 2.6; ctx.strokeStyle = CONTORN;
    const R = (x, y, ww, hh, r, fons) => { ctx.fillStyle = fons; ctx.beginPath(); ctx.roundRect(x, y, ww, hh, r); ctx.fill(); ctx.stroke(); };
    const E = (x, y, rx, ry, rot, fons) => { ctx.fillStyle = fons; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); };
    ombraTerra(ctx, 48, 124, 26, 4);
    const pell = '#c4c8a0';
    // cames amb mitjons blancs i sandàlies
    [38, 54].forEach(x => {
        R(x - 4, 96, 8, 14, 2, pell);
        R(x - 4.6, 108, 9.2, 11, 2, '#f4f0e6');
        ctx.strokeStyle = '#c04a3a'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x - 4.4, 111); ctx.lineTo(x + 4.4, 111); ctx.moveTo(x - 4.4, 114); ctx.lineTo(x + 4.4, 114); ctx.stroke();
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 2.6;
        R(x - 6, 118, 12.5, 6, 3, '#7a5230');
    });
    // pantalons curts caqui amb butxaques
    ctx.fillStyle = '#d8c48a'; ctx.beginPath(); ctx.moveTo(28, 80); ctx.lineTo(68, 80); ctx.lineTo(70, 102); ctx.lineTo(52, 102); ctx.lineTo(48, 92); ctx.lineTo(44, 102); ctx.lineTo(26, 102); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(70,50,20,0.7)'; ctx.strokeRect(31, 86, 9, 8); ctx.strokeRect(56, 86, 9, 8); ctx.strokeStyle = CONTORN; ctx.lineWidth = 2.6;
    // camisa hawaiana
    const cam = ctx.createLinearGradient(0, 44, 0, 84); cam.addColorStop(0, '#f08a52'); cam.addColorStop(1, '#d8503a');
    ctx.fillStyle = cam; ctx.beginPath(); ctx.moveTo(26, 50); ctx.quadraticCurveTo(48, 42, 70, 50); ctx.lineTo(72, 66); ctx.lineTo(68, 86); ctx.lineTo(28, 86); ctx.lineTo(24, 66); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.save(); ctx.clip();
    [[34, 56, '#2a9a9a'], [56, 60, '#f4d24a'], [44, 72, '#f4f0e6'], [62, 76, '#2a9a9a'], [32, 78, '#f4d24a'], [50, 54, '#f4f0e6']].forEach(([x, y, col]) => {   // flors
        ctx.fillStyle = col; for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; ctx.beginPath(); ctx.arc(x + Math.cos(a) * 3.2, y + Math.sin(a) * 3.2, 2.2, 0, Math.PI * 2); ctx.fill(); }
        ctx.fillStyle = '#d83a6a'; ctx.beginPath(); ctx.arc(x, y, 1.6, 0, Math.PI * 2); ctx.fill();
    });
    ctx.strokeStyle = '#3a7a3a'; ctx.lineWidth = 2; [[40, 64], [58, 68], [36, 70]].forEach(([x, y]) => { ctx.beginPath(); ctx.ellipse(x, y, 5, 2, 0.6, 0, Math.PI * 2); ctx.stroke(); });
    ctx.restore(); ctx.strokeStyle = CONTORN; ctx.lineWidth = 2.6;
    // solapa en V i pit
    ctx.fillStyle = pell; ctx.beginPath(); ctx.moveTo(40, 49); ctx.lineTo(48, 62); ctx.lineTo(56, 49); ctx.closePath(); ctx.fill(); ctx.stroke();
    // marsupi
    R(40, 82, 16, 8, 3, '#3a6a8a');
    // mànigues curtes i braços penjant, l'esquerre cap endavant amb el mapa
    E(24, 56, 7, 9, 0.2, '#e8704a'); E(72, 56, 7, 9, -0.2, '#e8704a');
    R(19, 62, 8, 18, 4, pell); R(69, 62, 8, 18, 4, pell);
    E(23, 83, 4.4, 4.6, 0, pell); E(73, 83, 4.4, 4.6, 0, pell);
    ctx.fillStyle = '#f4ecd0'; ctx.beginPath(); ctx.moveTo(66, 80); ctx.lineTo(82, 78); ctx.lineTo(84, 94); ctx.lineTo(68, 96); ctx.closePath(); ctx.fill(); ctx.stroke();   // mapa
    ctx.lineWidth = 1.2; ctx.strokeStyle = '#7a8aa0'; ctx.beginPath(); ctx.moveTo(69, 84); ctx.lineTo(80, 83); ctx.moveTo(70, 89); ctx.lineTo(82, 88); ctx.stroke(); ctx.strokeStyle = CONTORN; ctx.lineWidth = 2.6;
    // càmera penjada del coll
    ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(34, 50); ctx.quadraticCurveTo(48, 70, 62, 50); ctx.stroke(); ctx.strokeStyle = CONTORN; ctx.lineWidth = 2.6;
    R(38, 66, 20, 12, 3, '#2a2a30'); E(48, 72, 5.4, 5.4, 0, '#55606a'); E(48, 72, 2.6, 2.6, 0, '#9ac0e0');
    R(40, 63, 6, 4, 1, '#c8c8d0');
    // cap pàl·lid, ulls mig tancats i boca fluixa
    E(48, 30, 15, 16, 0, pell);
    E(33, 32, 3.6, 5, 0, pell); E(63, 32, 3.6, 5, 0, pell);
    ctx.lineWidth = 2.2;
    [-1, 1].forEach(sd => { E(48 + sd * 6.2, 32, 4.2, 3, 0, '#e8e4cc'); ctx.fillStyle = '#7a4aa8'; ctx.beginPath(); ctx.arc(48 + sd * 6.2, 33.2, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = pell; ctx.beginPath(); ctx.ellipse(48 + sd * 6.2, 30.2, 4.6, 2.2, 0, Math.PI, 0); ctx.fill(); ctx.beginPath(); ctx.moveTo(48 + sd * 6.2 - 4.6, 30.4); ctx.lineTo(48 + sd * 6.2 + 4.6, 30.4); ctx.stroke();   // parpella caiguda
        ctx.fillStyle = 'rgba(80,40,110,0.4)'; ctx.beginPath(); ctx.ellipse(48 + sd * 6.2, 36.6, 4.2, 1.6, 0, 0, Math.PI * 2); ctx.fill(); });                                                         // ulleres de son
    ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(48, 41.5, 3.4, 2.4, 0, 0, Math.PI * 2); ctx.fillStyle = '#5a2a30'; ctx.fill(); ctx.stroke();
    ctx.lineWidth = 2.6;
    // ulleres de sol aixecades al front
    R(37, 22, 9.6, 5, 2, '#26262e'); R(49.4, 22, 9.6, 5, 2, '#26262e'); ctx.beginPath(); ctx.moveTo(46.6, 24); ctx.lineTo(49.4, 24); ctx.stroke();
    // barret de palla d'ala ampla amb cinta vermella
    E(48, 20, 29, 8, 0, '#e6cc7a');
    ctx.fillStyle = '#d8b858'; ctx.beginPath(); ctx.ellipse(48, 15, 15, 12, 0, Math.PI, 0); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#c8362a'; ctx.fillRect(33.4, 15.4, 29.2, 4.6); ctx.strokeRect(33.4, 15.4, 29.2, 4.6);
    ctx.strokeStyle = 'rgba(120,80,20,0.6)'; ctx.lineWidth = 1.2; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.ellipse(48, 20, 29 - k * 4.6, 8 - k * 1.2, 0, 0.1, Math.PI - 0.1); ctx.stroke(); }
    // fils de boira lila que li surten del cap
    ctx.strokeStyle = 'rgba(190,150,255,0.7)'; ctx.lineWidth = 2.2;
    [[30, 14, -8], [66, 12, 10]].forEach(([x, y, d]) => { ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x + d, y - 8, x - d, y - 14, x + d * 0.4, y - 22); ctx.stroke(); });
}

// El Germà Andreu convertit en Pastor de Boira: hàbit violeta fosc, caiada de fusta amb una esquella i un fanal de boira, i els ulls lila lluminosos.
function dibuixarPastorBoira(canvas, w) {
    const h = Math.round(w * 4 / 3);
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    const s = w / 96;
    ctx.scale(s, s);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.lineWidth = 2.8; ctx.strokeStyle = CONTORN;
    const E = (x, y, rx, ry, rot, fons) => { ctx.fillStyle = fons; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); };
    ombraTerra(ctx, 44, 125, 28, 4);
    // la caiada, darrere el cos: fusta retorçada, volta al capdamunt i una esquella
    ctx.strokeStyle = CONTORN; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(80, 124); ctx.lineTo(80, 24); ctx.arc(70, 24, 10, 0, Math.PI, true); ctx.stroke();
    ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 4.6; ctx.beginPath(); ctx.moveTo(80, 124); ctx.lineTo(80, 24); ctx.arc(70, 24, 10, 0, Math.PI, true); ctx.stroke();
    ctx.strokeStyle = '#a8784a'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(78.6, 118); ctx.lineTo(78.6, 30); ctx.stroke();
    ctx.strokeStyle = CONTORN; ctx.lineWidth = 2.6;
    // fanal de boira que penja de la volta
    const fg = ctx.createRadialGradient(60, 40, 1, 60, 40, 12); fg.addColorStop(0, '#ffffff'); fg.addColorStop(0.35, '#d8a8ff'); fg.addColorStop(1, 'rgba(154,80,255,0)');
    ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(60, 40, 12, 0, Math.PI * 2); ctx.fill();
    E(60, 34, 2, 2, 0, '#3a2a1a');
    // esquella de coure
    ctx.fillStyle = '#c88a3a'; ctx.beginPath(); ctx.moveTo(76.4, 62); ctx.lineTo(83.6, 62); ctx.lineTo(86, 74); ctx.lineTo(74, 74); ctx.closePath(); ctx.fill(); ctx.stroke(); E(80, 76, 2, 2, 0, '#6a3a1a');
    // hàbit: túnica llarga amb plecs i vora esparracada
    const hab = ctx.createLinearGradient(20, 50, 70, 120); hab.addColorStop(0, '#3a2c52'); hab.addColorStop(1, '#1e1530');
    ctx.fillStyle = hab; ctx.beginPath(); ctx.moveTo(34, 50); ctx.quadraticCurveTo(44, 44, 56, 50); ctx.lineTo(70, 116);
    for (let k = 0; k < 7; k++) ctx.lineTo(70 - k * 8.6 - 4, k % 2 ? 122 : 126);
    ctx.lineTo(18, 116); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(10,6,22,0.8)'; ctx.lineWidth = 1.8; [[36, 66, 30, 118], [46, 64, 46, 122], [56, 66, 62, 118]].forEach(([x0, y0, x1, y1]) => { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2 + 3, (y0 + y1) / 2, x1, y1); ctx.stroke(); });
    ctx.strokeStyle = CONTORN; ctx.lineWidth = 2.8;
    // cordó de monjo
    ctx.strokeStyle = '#b8a070'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(30, 80); ctx.quadraticCurveTo(48, 86, 64, 80); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(56, 82); ctx.lineTo(58, 100); ctx.stroke(); ctx.strokeStyle = CONTORN; ctx.lineWidth = 2.8;
    // mànigues i mans (la dreta agafa la caiada, l'esquerra, oberta)
    E(25, 70, 7.5, 16, 0.25, '#32254a'); E(66, 70, 7.5, 16, -0.2, '#32254a');
    E(21, 87, 4.6, 4.6, 0, '#d8b090'); E(70, 86, 4.6, 4.6, 0, '#d8b090');
    ctx.fillStyle = '#d8b090'; ctx.beginPath(); ctx.roundRect(76, 82, 8, 7, 3); ctx.fill(); ctx.stroke();                     // la mà damunt la caiada
    // coll de boira (una bufanda de llana lila)
    E(44, 52, 15, 6, 0, '#c8b4ec'); E(36, 53, 6, 5, 0, '#e0d0f8'); E(52, 53, 6, 5, 0, '#e0d0f8');
    // caputxa abaixada al darrere del coll
    ctx.fillStyle = '#2a2040'; ctx.beginPath(); ctx.ellipse(44, 44, 19, 9, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // cap d'home jove, cabell fosc i somriure de qui sap alguna cosa
    E(44, 34, 13, 15, 0, '#e0b896');
    ctx.fillStyle = '#d8d8dc'; ctx.beginPath(); ctx.moveTo(30.4, 32); ctx.quadraticCurveTo(32, 16, 44, 16); ctx.quadraticCurveTo(57, 16, 57.6, 32); ctx.quadraticCurveTo(52, 25, 44, 25); ctx.quadraticCurveTo(36, 25, 30.4, 32); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(37, 44); ctx.quadraticCurveTo(44, 49, 52, 43.4); ctx.stroke();                // somriure ample
    ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(35, 30); ctx.lineTo(41, 32); ctx.moveTo(53, 30); ctx.lineTo(47, 32); ctx.stroke();   // celles de murri
    [-1, 1].forEach(sd => {
        ctx.save(); ctx.shadowColor = '#c080ff'; ctx.shadowBlur = 7;
        ctx.fillStyle = '#e0b0ff'; ctx.beginPath(); ctx.ellipse(44 + sd * 5.6, 35.4, 3.2, 2.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(44 + sd * 5.6, 35.4, 1.1, 0, Math.PI * 2); ctx.fill();
    });
    // boira a la vora de la túnica
    ctx.fillStyle = 'rgba(190,150,255,0.35)';
    [[20, 122, 14], [44, 126, 18], [68, 122, 13]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.ellipse(x, y, r, 4, 0, 0, Math.PI * 2); ctx.fill(); });
}

// Pergamí partit pel mig, estès a terra: el tall és irregular, amb línies d'escriptura i un racó rosegat
function dibuixarPergamiPartit(c, w) {
    lienc(c, w, w * 0.78, (ctx, W, H) => {
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.beginPath(); ctx.ellipse(W / 2 + 2, H - 4, W * 0.46, 4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-0.12); ctx.translate(-W / 2, -H / 2);
        const x0 = W * 0.08, x1 = W * 0.94, y0 = H * 0.1, y1 = H * 0.86;
        ctx.beginPath(); ctx.moveTo(x0, y0 + 3); ctx.lineTo(x1 - 6, y0);
        // Vora dreta esquinçada (el tall)
        const talls = [[x1, y0 + 8], [x1 - 7, y0 + 16], [x1 + 1, y0 + 24], [x1 - 8, y0 + 34], [x1 - 1, y1 - 14], [x1 - 9, y1 - 6], [x1 - 3, y1]];
        talls.forEach(([x, y]) => ctx.lineTo(x, y));
        ctx.lineTo(x0 + 6, y1 + 2); ctx.lineTo(x0 - 1, y1 - 12); ctx.lineTo(x0 + 2, y0 + 14); ctx.closePath();
        const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, '#f2e4b4'); g.addColorStop(0.6, '#e2cd96'); g.addColorStop(1, '#c4a666');
        ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 2.4; ctx.strokeStyle = '#2a1608'; ctx.stroke();
        // Taca d'humitat i vora fosca
        ctx.fillStyle = 'rgba(120,80,30,0.2)'; ctx.beginPath(); ctx.ellipse(x0 + W * 0.18, y1 - 6, W * 0.16, 5, 0, 0, Math.PI * 2); ctx.fill();
        // Línies de text (tallades a la dreta) i una caplletra vermella
        ctx.strokeStyle = '#4a2c14'; ctx.lineWidth = 1.5;
        const llarg = [0.68, 0.74, 0.6, 0.72, 0.5];
        llarg.forEach((l, i) => { const y = y0 + 12 + i * ((y1 - y0 - 18) / 5); ctx.beginPath(); ctx.moveTo(x0 + 16, y); ctx.lineTo(x0 + 16 + (x1 - x0 - 24) * l, y + (i % 2 ? 0.6 : -0.4)); ctx.stroke(); });
        ctx.fillStyle = '#9a2a1a'; ctx.fillRect(x0 + 5, y0 + 8, 9, 9); ctx.strokeStyle = '#2a1608'; ctx.lineWidth = 1; ctx.strokeRect(x0 + 5, y0 + 8, 9, 9);
        ctx.restore();
    });
}
