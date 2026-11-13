/**
 * ICONES DEL SARRÓ: un dibuix petit de cada objecte (96 x 96), amb el mateix contorn fosc que la resta del joc,
 * i si l'objecte encara farà falta o ja s'ha fet servir.
 */

const ICONA_MIDA = 96;

// Ajudes de dibuix
function iconaClau(ctx, cos, ombra, gran) {
    const s = gran ? 1.15 : 1;
    ctx.save(); ctx.translate(48, 48); ctx.rotate(-Math.PI / 4); ctx.scale(s, s);
    ctx.fillStyle = cos; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(-22, 0, 13, 0, Math.PI * 2); ctx.arc(-22, 0, 6, 0, Math.PI * 2, true); ctx.fill('evenodd'); ctx.stroke();
    ctx.beginPath(); ctx.arc(-22, 0, 6, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.rect(-10, -4, 40, 8); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.rect(18, 4, 6, 10); ctx.rect(26, 4, 4, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = ombra; ctx.fillRect(-9, 1, 38, 2);
    ctx.restore();
}

function iconaFlasco(ctx, liquid, brill) {
    ctx.lineWidth = 3;
    ctx.fillStyle = 'rgba(220,235,240,0.55)';
    ctx.beginPath(); ctx.moveTo(40, 14); ctx.lineTo(56, 14); ctx.lineTo(56, 34); ctx.bezierCurveTo(78, 42, 80, 82, 48, 84); ctx.bezierCurveTo(16, 82, 18, 42, 40, 34); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.save(); ctx.clip();
    ctx.fillStyle = liquid; ctx.fillRect(10, 52, 76, 40);
    ctx.fillStyle = brill; ctx.fillRect(10, 52, 76, 4);
    ctx.restore();
    ctx.beginPath(); ctx.moveTo(40, 14); ctx.lineTo(56, 14); ctx.lineTo(56, 34); ctx.bezierCurveTo(78, 42, 80, 82, 48, 84); ctx.bezierCurveTo(16, 82, 18, 42, 40, 34); ctx.closePath(); ctx.stroke();
    ctx.fillStyle = '#8a5a32'; ctx.beginPath(); ctx.rect(39, 6, 18, 11); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(32, 50); ctx.quadraticCurveTo(28, 62, 33, 72); ctx.stroke();
}

// El flascó rodó de coll llarg que prepara la Joaneta: bombolla de vidre gran amb un líquid verd brillant, bombolles i un reflex (el beuratge)
function iconaFlascoRodo(ctx) {
    const cx = 48, cy = 60, R = 27;
    const forma = () => { ctx.beginPath(); ctx.moveTo(42, 12); ctx.lineTo(42, 36); ctx.arc(cx, cy, R, -Math.PI * 0.62, -Math.PI * 0.38, true); ctx.lineTo(54, 12); ctx.closePath(); };
    ctx.lineWidth = 3;
    ctx.fillStyle = 'rgba(214,238,238,0.6)'; forma(); ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R - 1, 0, Math.PI * 2); ctx.clip();
    const g = ctx.createLinearGradient(0, 46, 0, 90); g.addColorStop(0, '#86e83a'); g.addColorStop(1, '#3a9a12');
    ctx.fillStyle = g; ctx.fillRect(10, 48, 76, 50);
    ctx.fillStyle = '#c4ff7a'; ctx.beginPath(); ctx.ellipse(cx, 48, 27, 4.5, 0, 0, Math.PI * 2); ctx.fill();            // la superfície del líquid
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    [[38, 66, 2.6], [56, 72, 3.2], [48, 58, 2], [62, 62, 1.8], [40, 77, 1.8]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); });   // bombolles
    ctx.restore();
    ctx.strokeStyle = '#1c3c3c'; ctx.beginPath(); ctx.arc(cx, cy, R, -Math.PI * 0.38, -Math.PI * 0.62 + Math.PI * 2); ctx.stroke();           // el contorn de la bombolla (obert pel coll)
    ctx.beginPath(); ctx.moveTo(42, 36); ctx.lineTo(42, 12); ctx.moveTo(54, 36); ctx.lineTo(54, 12); ctx.stroke();
    ctx.fillStyle = 'rgba(214,238,238,0.9)'; ctx.beginPath(); ctx.rect(39, 8, 18, 6); ctx.fill(); ctx.stroke();                                   // la vora de la boca
    ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, R - 6, Math.PI * 0.62, Math.PI * 0.9); ctx.stroke();   // reflex
}

function iconaFlors(ctx, colors) {
    ctx.lineWidth = 3; ctx.strokeStyle = '#2e5a22';
    [[48, 20], [32, 26], [64, 26], [40, 14], [58, 14]].forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(48, 84); ctx.quadraticCurveTo(48, 60, x, y + 8); ctx.stroke(); });
    ctx.strokeStyle = CONTORN; ctx.lineWidth = 2;
    [[48, 22], [30, 28], [66, 28], [39, 15], [58, 15]].forEach(([x, y], i) => {
        ctx.fillStyle = colors[i % colors.length];
        for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; ctx.beginPath(); ctx.arc(x + Math.cos(a) * 6, y + Math.sin(a) * 6, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
        ctx.fillStyle = '#f4d040'; ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = '#d8c8a0'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(36, 56); ctx.lineTo(60, 56); ctx.lineTo(54, 86); ctx.lineTo(42, 86); ctx.closePath(); ctx.fill(); ctx.stroke();
}

const ICONES_OBJECTES = {
    // La tarota (instrument de canya doble catalana): cos cònic de fusta fosca amb el pavelló obert, forats i anelles de llautó, bocal i canya
    flauta: ctx => {
        ctx.save(); ctx.translate(48, 48); ctx.rotate(-Math.PI / 4);
        ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.lineWidth = 3; ctx.strokeStyle = CONTORN;
        const llauto = ctx.createLinearGradient(0, -8, 0, 8);
        llauto.addColorStop(0, '#f6dc8a'); llauto.addColorStop(0.5, '#c8942e'); llauto.addColorStop(1, '#7a5418');
        // Cos de fusta: cònic, s'obre en un pavelló a l'extrem
        const fusta = ctx.createLinearGradient(0, -16, 0, 16);
        fusta.addColorStop(0, '#b0683a'); fusta.addColorStop(0.5, '#7a3e1c'); fusta.addColorStop(1, '#3e1e0c');
        ctx.fillStyle = fusta;
        ctx.beginPath();
        ctx.moveTo(-44, -17); ctx.quadraticCurveTo(-36, -9, -26, -8); ctx.lineTo(18, -5);
        ctx.lineTo(18, 5); ctx.lineTo(-26, 8); ctx.quadraticCurveTo(-36, 9, -44, 17);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // Vora de llautó del pavelló
        ctx.fillStyle = llauto; ctx.beginPath(); ctx.roundRect(-47, -18, 6, 36, 2); ctx.fill(); ctx.stroke();
        // Anelles de llautó
        [[-14, 7.5], [8, 5.8]].forEach(([x, h]) => { ctx.fillStyle = llauto; ctx.beginPath(); ctx.roundRect(x - 2.5, -h - 1, 5, 2 * h + 2, 1.5); ctx.fill(); ctx.stroke(); });
        // Forats
        ctx.fillStyle = '#1a0c06'; ctx.lineWidth = 1.2;
        [[-32, 3.2], [-23, 3], [-6, 2.6], [1, 2.4], [13, 2.2]].forEach(([x, r]) => { ctx.beginPath(); ctx.ellipse(x, -0.5, r, r * 0.8, 0, 0, Math.PI * 2); ctx.fill(); });
        // Llum al llom de la fusta
        ctx.strokeStyle = 'rgba(255,220,170,0.45)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-34, -9); ctx.lineTo(16, -4.2); ctx.stroke();
        // Bocal de llautó, pirueta (el disc) i canya
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
        ctx.fillStyle = llauto; ctx.beginPath(); ctx.moveTo(18, -3.4); ctx.lineTo(33, -2); ctx.lineTo(33, 2); ctx.lineTo(18, 3.4); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = llauto; ctx.beginPath(); ctx.ellipse(33, 0, 2.6, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ecd89c'; ctx.beginPath(); ctx.roundRect(34, -2.6, 10, 5.2, 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(120,90,40,0.7)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(36, 0); ctx.lineTo(42, 0); ctx.stroke();
        ctx.restore();
    },
    // El bastó de pelegrí, com l'arma del joc (assets/armes/basto.webp): una branca gruixuda i rústica, una mica tortuosa, amb nusos, vetes i
    // amples que canvien, el cap en ganxo gros i irregular (amb el tall de la branca a la punta) i un casquet de metall abonyegat a baix
    basto: ctx => {
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        // Línia central (de la punta de baix al final del ganxo), suavitzada amb una spline de Catmull-Rom
        const P = [[28, 90], [33, 72], [41, 55], [51, 41], [60, 30], [61, 17], [52, 9], [41, 10], [33, 17], [31, 29]];
        const mostres = [];
        for (let k = 0; k < P.length - 1; k++) {
            const p0 = P[Math.max(0, k - 1)], p1 = P[k], p2 = P[k + 1], p3 = P[Math.min(P.length - 1, k + 2)];
            for (let t = 0; t < 1; t += 0.1) {
                const t2 = t * t, t3 = t2 * t;
                mostres.push([0, 1].map(d => 0.5 * ((2 * p1[d]) + (-p0[d] + p2[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * t3)));
            }
        }
        mostres.push(P[P.length - 1]);
        const N = mostres.length;
        // Ample a cada punt: gruixut de baix, una mica més prim cap al ganxo, amb irregularitats (no és una vara polida)
        const ample = i => { const u = i / (N - 1); return 12.5 - 3.5 * u + 1.3 * Math.sin(u * 19) + 0.9 * Math.sin(u * 41 + 1); };
        const normal = i => { const a = mostres[Math.max(0, i - 1)], b = mostres[Math.min(N - 1, i + 1)]; const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; };
        const esq = [], dre = [];
        mostres.forEach((m, i) => { const n = normal(i), w = ample(i) / 2; esq.push([m[0] + n[0] * w, m[1] + n[1] * w]); dre.push([m[0] - n[0] * w, m[1] - n[1] * w]); });
        const forma = () => { ctx.beginPath(); esq.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); for (let i = N - 1; i >= 0; i--) ctx.lineTo(dre[i][0], dre[i][1]); ctx.closePath(); };
        const FOSC = '#4a2412';
        const g = ctx.createLinearGradient(20, 90, 66, 8); g.addColorStop(0, '#9a5a2c'); g.addColorStop(0.5, '#c47c40'); g.addColorStop(1, '#a8632f');
        forma(); ctx.fillStyle = g; ctx.fill();
        // Vetes de la fusta (llargues, fines i desiguals) i llum al costat esquerre
        ctx.save(); forma(); ctx.clip();
        ctx.lineWidth = 1.1;
        [[-0.22, 0.5], [0.1, 0.4], [0.28, 0.35]].forEach(([desp, alfa], k) => {
            ctx.strokeStyle = 'rgba(70,32,12,' + alfa + ')'; ctx.beginPath();
            let primer = true;
            mostres.forEach((m, i) => {
                if (i < 2 + k * 3 || i > N - 4 - k * 5) return;
                const n = normal(i), d = desp * ample(i) + Math.sin(i * 0.9 + k) * 0.5, x = m[0] + n[0] * d, y = m[1] + n[1] * d;
                if (primer) { ctx.moveTo(x, y); primer = false; } else ctx.lineTo(x, y);
            });
            ctx.stroke();
        });
        ctx.strokeStyle = 'rgba(255,222,170,0.5)'; ctx.lineWidth = 1.8; ctx.beginPath();
        esq.forEach((p, i) => { if (i < 1 || i > N - 6) return; const m = mostres[i], n = normal(i); const x = p[0] - n[0] * 2.2, y = p[1] - n[1] * 2.2; i === 1 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }); ctx.stroke();
        ctx.fillStyle = 'rgba(60,24,8,0.22)'; ctx.beginPath(); dre.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); for (let i = N - 1; i >= 0; i--) { const m = mostres[i], n = normal(i); ctx.lineTo(m[0] - n[0] * 1.5, m[1] - n[1] * 1.5); } ctx.closePath(); ctx.fill();
        ctx.restore();
        forma(); ctx.strokeStyle = FOSC; ctx.lineWidth = 2.6; ctx.stroke();
        // Nusos (on va néixer una branqueta): un a cada costat, amb el centre fosc
        const nus = (i, costat, r) => {
            const m = mostres[i], n = normal(i), w = ample(i) / 2, x = m[0] + n[0] * costat * (w - 0.5), y = m[1] + n[1] * costat * (w - 0.5);
            ctx.fillStyle = '#b86f36'; ctx.strokeStyle = FOSC; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.8, 0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#5a2c14'; ctx.beginPath(); ctx.ellipse(x, y, r * 0.45, r * 0.35, 0.5, 0, Math.PI * 2); ctx.fill();
        };
        nus(Math.round(N * 0.34), 1, 3.4); nus(Math.round(N * 0.56), -1, 2.8);
        // El tall de la branca a la punta del ganxo: una elipse clara amb anells
        const fi = mostres[N - 1], dir = [fi[0] - mostres[N - 3][0], fi[1] - mostres[N - 3][1]], ang = Math.atan2(dir[1], dir[0]);
        ctx.fillStyle = '#e2aa6a'; ctx.strokeStyle = FOSC; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.ellipse(fi[0], fi[1], 4.6, 3, ang + Math.PI / 2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(110,60,24,0.6)'; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.ellipse(fi[0], fi[1], 2.3, 1.4, ang + Math.PI / 2, 0, Math.PI * 2); ctx.stroke();
        // Casquet de metall de la punta, vell i abonyegat
        const b0 = mostres[0], tb = [mostres[2][0] - b0[0], mostres[2][1] - b0[1]], ab = Math.atan2(tb[1], tb[0]);
        ctx.save(); ctx.translate(b0[0], b0[1]); ctx.rotate(ab - Math.PI / 2);
        ctx.fillStyle = '#9aa2ac'; ctx.strokeStyle = FOSC; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(-7.5, -1, 15, 9, 3); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(-5.5, 0.4, 3, 6);
        ctx.fillStyle = 'rgba(40,40,48,0.55)'; [[2, 3.5, 1.1], [-1, 6, 0.8], [4.6, 5.8, 0.7]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); });
        ctx.restore();
    },
    basto_tiller: ctx => {
        ctx.lineCap = 'round';
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(18, 86); ctx.quadraticCurveTo(44, 54, 76, 14); ctx.stroke();
        ctx.strokeStyle = '#a07a48'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(18, 86); ctx.quadraticCurveTo(44, 54, 76, 14); ctx.stroke();
        ctx.lineWidth = 2.5; ctx.strokeStyle = CONTORN;
        [[60, 26, 0x6a9a3a], [70, 40, 0x5a8a32], [46, 40, 0x7aaa44]].forEach(([x, y, c]) => {
            ctx.fillStyle = '#' + c.toString(16);
            ctx.beginPath(); ctx.moveTo(x, y + 12); ctx.bezierCurveTo(x - 14, y + 2, x - 8, y - 12, x, y - 4); ctx.bezierCurveTo(x + 8, y - 12, x + 14, y + 2, x, y + 12); ctx.fill(); ctx.stroke();
        });
    },
    clau_campanar: ctx => iconaClau(ctx, '#c8a858', '#7a5a22'),
    pallofa: ctx => {
        ctx.lineWidth = 3; ctx.lineJoin = 'round';
        ctx.fillStyle = '#f4f0e8';
        ctx.beginPath(); ctx.ellipse(44, 58, 28, 13, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(18, 54); ctx.quadraticCurveTo(8, 38, 14, 28); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(66, 38, 14, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(77, 44, 8, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#7a4a2a';
        ctx.beginPath(); ctx.ellipse(56, 30, 6, 11, -0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(34, 54, 9, 5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#2a1608'; ctx.beginPath(); ctx.arc(70, 36, 2.6, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(82, 42, 2.6, 0, Math.PI * 2); ctx.fill();
        [[28, 46], [48, 48], [58, 62], [40, 63]].forEach(([x, y]) => ctx.fillRect(x, y, 2.4, 2.4));
        ctx.fillStyle = '#f4f0e8'; [[28, 66], [38, 68], [56, 68], [64, 66]].forEach(([x, y]) => { ctx.fillRect(x - 3, y - 6, 6, 18); ctx.strokeRect(x - 3, y - 6, 6, 18); });
    },
    clau_sagrari: ctx => iconaClau(ctx, '#e8c050', '#a07a20'),
    clau_girgoles: ctx => iconaClau(ctx, '#a8603a', '#6a3418'),
    clau_ferro: ctx => iconaClau(ctx, '#6a6a72', '#3a3a40', true),
    clau_gabriel: ctx => iconaClau(ctx, '#9fb8cc', '#4a6278'),
    aigua_sj: ctx => iconaFlasco(ctx, '#6ab0e8', '#c8e8ff'),
    beuratge: ctx => iconaFlascoRodo(ctx),                  // igual que el flascó verd que prepara la Joaneta
    cristall_gel: ctx => {
        ctx.lineWidth = 3; ctx.fillStyle = '#bfe6ff';
        const p = [[48, 8], [70, 34], [62, 84], [34, 84], [26, 34]];
        ctx.beginPath(); p.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#8ec8f0'; ctx.beginPath(); ctx.moveTo(48, 8); ctx.lineTo(70, 34); ctx.lineTo(62, 84); ctx.lineTo(48, 40); ctx.closePath(); ctx.fill();
        ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(26, 34); ctx.lineTo(48, 40); ctx.lineTo(70, 34); ctx.moveTo(48, 40); ctx.lineTo(48, 84); ctx.stroke();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(38, 30, 4, 0, Math.PI * 2); ctx.fill();
    },
    pruna: ctx => {
        ctx.lineWidth = 3;
        const g = ctx.createRadialGradient(40, 44, 4, 48, 54, 34); g.addColorStop(0, '#fff2a0'); g.addColorStop(0.5, '#f0c040'); g.addColorStop(1, '#b8801a');
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(48, 56, 28, 30, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(48, 28); ctx.quadraticCurveTo(46, 50, 50, 84); ctx.stroke();
        ctx.lineWidth = 3; ctx.strokeStyle = '#5a3a1a'; ctx.beginPath(); ctx.moveTo(48, 28); ctx.lineTo(52, 12); ctx.stroke();
        ctx.strokeStyle = CONTORN; ctx.fillStyle = '#5a9a32'; ctx.beginPath(); ctx.ellipse(64, 18, 13, 6, -0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    },
    herba_sj: ctx => {                                          // herba de Sant Joan: tiges verdes amb flors petites i grogues
        ctx.lineWidth = 3; ctx.strokeStyle = '#2f6a22';
        [[48, 84, 48, 30], [48, 84, 30, 36], [48, 84, 66, 38]].forEach(([x0, y0, x1, y1]) => { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2 + (x1 - x0) * 0.2, (y0 + y1) / 2, x1, y1); ctx.stroke(); });
        ctx.strokeStyle = CONTORN; ctx.fillStyle = '#5aa83a';
        [[40, 66, -0.7], [58, 62, 0.7], [38, 50, -0.9], [60, 50, 0.9]].forEach(([x, y, a]) => { ctx.beginPath(); ctx.ellipse(x, y, 9, 4, a, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
        [[48, 28], [30, 34], [66, 36], [40, 20], [57, 22]].forEach(([x, y]) => {
            ctx.fillStyle = '#ffd83a'; ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#c88a10'; ctx.beginPath(); ctx.arc(x, y, 2.4, 0, Math.PI * 2); ctx.fill();
        });
    },
    romani: ctx => {                                            // una branqueta de romaní: fulles fines i flors blavoses
        ctx.lineWidth = 3; ctx.strokeStyle = '#5a4a2a';
        ctx.beginPath(); ctx.moveTo(34, 86); ctx.quadraticCurveTo(48, 54, 62, 14); ctx.stroke();
        ctx.strokeStyle = CONTORN; ctx.fillStyle = '#6f9a58';
        for (let i = 0; i < 6; i++) {
            const t = i / 6, x = 36 + t * 24, y = 82 - t * 66;
            [-1, 1].forEach(s => { ctx.beginPath(); ctx.ellipse(x + s * 10, y - 3, 11, 3.4, s * -0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
        }
        ctx.fillStyle = '#9ab8f0';
        [[56, 30], [49, 46], [62, 20]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    },
    rialla: (ctx, cv, scene) => {                               // rialla, l'herba del riure: el dibuix de la flor (assets/natura/rialla.webp); si no hi és, un de fet amb codi
        if (scene && scene.textures.exists('rialla') && !(typeof Grafics !== 'undefined' && Grafics.faltants && Grafics.faltants.includes('rialla'))) {
            const im = scene.textures.get('rialla').getSourceImage(), m = 3, k = Math.min((ICONA_MIDA - 2 * m) / im.width, (ICONA_MIDA - 2 * m) / im.height);
            ctx.drawImage(im, (ICONA_MIDA - im.width * k) / 2, (ICONA_MIDA - im.height * k) / 2, im.width * k, im.height * k);
            return;
        }
        ctx.lineWidth = 3; ctx.strokeStyle = '#2f6a22';
        ctx.beginPath(); ctx.moveTo(48, 90); ctx.quadraticCurveTo(50, 70, 48, 56); ctx.stroke();
        ctx.strokeStyle = CONTORN; ctx.fillStyle = '#5aa83a';
        [[36, 76, -0.7], [60, 72, 0.7]].forEach(([x, y, an]) => { ctx.beginPath(); ctx.ellipse(x, y, 10, 4.5, an, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
        ctx.fillStyle = '#d8307e'; ctx.lineWidth = 2.5;
        for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; ctx.beginPath(); ctx.ellipse(48 + Math.cos(a) * 25, 38 + Math.sin(a) * 25, 12, 7, a, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
        ctx.fillStyle = '#58b0ec'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(48, 38, 19, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#6a1c14'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(35, 36); ctx.quadraticCurveTo(48, 62, 61, 36); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#e8606a'; ctx.beginPath(); ctx.ellipse(48, 47, 6, 3.4, 0, 0, Math.PI * 2); ctx.fill();
    },
    escudella: ctx => {
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(255,255,255,0.75)'; [36, 48, 60].forEach(x => { ctx.beginPath(); ctx.moveTo(x, 40); ctx.bezierCurveTo(x - 8, 30, x + 8, 22, x, 10); ctx.stroke(); });
        ctx.strokeStyle = CONTORN; ctx.fillStyle = '#c8784a';
        ctx.beginPath(); ctx.moveTo(12, 48); ctx.bezierCurveTo(14, 90, 82, 90, 84, 48); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#e8b060'; ctx.beginPath(); ctx.ellipse(48, 48, 36, 9, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#f4f0e0'; [[38, 47], [56, 49], [48, 45]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill(); });
    },
    flors_isilder: ctx => iconaFlors(ctx, ['#f0f0ff', '#d8e0ff', '#ffffff']),
    ram: ctx => iconaFlors(ctx, ['#ff90c0', '#ffd0e8', '#f06090']),
    pa_pastor: ctx => {
        ctx.lineWidth = 3; ctx.fillStyle = '#7a4a24';
        ctx.beginPath(); ctx.ellipse(48, 56, 38, 22, -0.15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#a06a38'; ctx.beginPath(); ctx.ellipse(46, 50, 30, 13, -0.15, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = 2.5; [28, 44, 60].forEach(x => { ctx.beginPath(); ctx.moveTo(x, 42 + (x - 48) * 0.15); ctx.lineTo(x + 8, 60 + (x - 48) * 0.15); ctx.stroke(); });
        ctx.fillStyle = 'rgba(80,70,60,0.6)'; [[24, 66], [70, 50], [52, 70]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill(); });
    },
    esquelles: ctx => {
        ctx.lineWidth = 3;
        [[34, 40, 1], [62, 52, 0.85]].forEach(([x, y, s]) => {
            ctx.fillStyle = '#c8963a';
            ctx.beginPath(); ctx.moveTo(x - 12 * s, y - 18 * s); ctx.lineTo(x + 12 * s, y - 18 * s); ctx.lineTo(x + 18 * s, y + 20 * s); ctx.lineTo(x - 18 * s, y + 20 * s); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#e8c070'; ctx.fillRect(x - 10 * s, y - 14 * s, 5 * s, 28 * s);
            ctx.fillStyle = '#5a3a1a'; ctx.beginPath(); ctx.arc(x, y + 24 * s, 5 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.strokeStyle = '#6a4a2a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y - 22 * s, 7 * s, Math.PI, 0); ctx.stroke(); ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
        });
    },
    // Els tres medallons de pedra de la placa del Dolmen (la mateixa imatge dels emblemes): el permís de l'Arbre, el Saber i la Benedicció
    medallo_arbre: (ctx, cv, scene) => dibuixaEmblemaIcona(ctx, scene, 'emblema_arbre'),
    medallo_saber: (ctx, cv, scene) => dibuixaEmblemaIcona(ctx, scene, 'emblema_saber'),
    medallo_benedicio: (ctx, cv, scene) => dibuixaEmblemaIcona(ctx, scene, 'emblema_benedicio'),
    fulla_tiler: ctx => {
        ctx.lineWidth = 3; ctx.fillStyle = '#6a9a3a';
        ctx.beginPath(); ctx.moveTo(48, 86); ctx.bezierCurveTo(4, 56, 18, 8, 48, 26); ctx.bezierCurveTo(78, 8, 92, 56, 48, 86); ctx.fill(); ctx.stroke();
        ctx.lineWidth = 2; ctx.strokeStyle = '#3a6a22'; ctx.beginPath(); ctx.moveTo(48, 86); ctx.lineTo(48, 30);
        [44, 58, 72].forEach(y => { ctx.moveTo(48, y); ctx.lineTo(30, y - 12); ctx.moveTo(48, y); ctx.lineTo(66, y - 12); }); ctx.stroke();
    },
    // Les tres coses que calen per alçar Runna (només es veuen a l'animació del Dolmen; no són objectes del sarró): la Fulla del Til·ler (fulla_tiler), les Paraules del Saber i la Benedicció
    saber: ctx => {
        ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 3; ctx.strokeStyle = CONTORN;
        ctx.fillStyle = '#7a1c24'; ctx.beginPath(); ctx.roundRect(8, 30, 80, 48, 5); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#f2e6c4';
        ctx.beginPath(); ctx.moveTo(48, 34); ctx.quadraticCurveTo(30, 26, 13, 32); ctx.lineTo(13, 70); ctx.quadraticCurveTo(30, 64, 48, 73); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(48, 34); ctx.quadraticCurveTo(66, 26, 83, 32); ctx.lineTo(83, 70); ctx.quadraticCurveTo(66, 64, 48, 73); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(80,46,20,0.7)'; ctx.lineWidth = 1.6;
        [[20, 42, 40], [20, 49, 38], [20, 56, 40], [56, 42, 76], [56, 49, 74], [56, 56, 76]].forEach(([x, y, x2]) => { ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo((x + x2) / 2, y - 2, x2, y); ctx.stroke(); });
        ctx.fillStyle = '#ddd2b6'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 2.4;                                    // ploma
        ctx.beginPath(); ctx.moveTo(66, 36); ctx.quadraticCurveTo(84, 8, 90, 6); ctx.quadraticCurveTo(88, 26, 70, 40); ctx.closePath(); ctx.fill(); ctx.stroke();
    },
    // La Benedicció: una mà oberta alçada, de palmell, sobre una aura daurada amb raigs. Els dits són traços gruixuts de punta rodona (primer el contorn fosc i
    // després la pell), així la mà surt d'una sola peça, sense juntes; la mànega de monjo la tanca per baix
    benediccio: ctx => {
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        const aura = ctx.createRadialGradient(48, 46, 6, 48, 46, 47);
        aura.addColorStop(0, 'rgba(255,236,160,0.95)'); aura.addColorStop(0.55, 'rgba(255,208,90,0.42)'); aura.addColorStop(1, 'rgba(255,200,80,0)');
        ctx.fillStyle = aura; ctx.beginPath(); ctx.arc(48, 46, 47, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#f2c040'; ctx.lineWidth = 3.2;
        for (let k = 0; k < 14; k++) {
            const a = k / 14 * Math.PI * 2, r0 = 36, r1 = k % 2 ? 43 : 47;
            ctx.beginPath(); ctx.moveTo(48 + Math.cos(a) * r0, 46 + Math.sin(a) * r0); ctx.lineTo(48 + Math.cos(a) * r1, 46 + Math.sin(a) * r1); ctx.stroke();
        }
        const dits = [[40, 66, 35, 24], [47, 64, 46, 14], [55, 65, 58, 21], [61, 69, 69, 34], [38, 72, 19, 52]];           // [x0, y0, x1, y1]: cinc dits (l'últim, el polze)
        const palmell = (r) => { ctx.beginPath(); ctx.ellipse(49, 68, r, r * 0.95, 0, 0, Math.PI * 2); ctx.fill(); };
        ctx.strokeStyle = CONTORN; ctx.fillStyle = CONTORN; ctx.lineWidth = 16;
        dits.forEach(([x0, y0, x1, y1]) => { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); });
        palmell(22);
        ctx.strokeStyle = '#f2c9a0'; ctx.fillStyle = '#f2c9a0'; ctx.lineWidth = 10;
        dits.forEach(([x0, y0, x1, y1]) => { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); });
        palmell(19.5);
        // ombra a la vora dreta de cada dit i del palmell, i una llum a l'esquerra
        ctx.strokeStyle = 'rgba(170,100,60,0.45)'; ctx.lineWidth = 2.4;
        dits.slice(0, 4).forEach(([x0, y0, x1, y1]) => { ctx.beginPath(); ctx.moveTo(x0 + 3.4, y0 - 4); ctx.lineTo(x1 + 3.2, y1 + 3); ctx.stroke(); });
        ctx.strokeStyle = 'rgba(255,240,215,0.6)'; ctx.lineWidth = 2;
        dits.slice(0, 4).forEach(([x0, y0, x1, y1]) => { ctx.beginPath(); ctx.moveTo(x0 - 2.6, y0 - 6); ctx.lineTo(x1 - 2.6, y1 + 4); ctx.stroke(); });
        ctx.strokeStyle = 'rgba(150,90,50,0.55)'; ctx.lineWidth = 1.6;                                                   // línies del palmell
        ctx.beginPath(); ctx.moveTo(38, 66); ctx.quadraticCurveTo(46, 74, 60, 64); ctx.moveTo(44, 60); ctx.quadraticCurveTo(50, 70, 56, 78); ctx.stroke();
        // mànega
        ctx.fillStyle = '#6a4426'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.roundRect(32, 84, 34, 13, 3); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,215,160,0.35)'; ctx.fillRect(35, 86, 4, 8);
    },
    cinta_nena: (ctx, cv) => { const t = document.createElement('canvas'); dibuixarLlac(t, 80); ctx.drawImage(t, 8, (96 - t.height) / 2); },      // el mateix llaç que es troba sota les pedres
    benedicio_fraterna: ctx => {                                // una creu al mig d'una aurèola daurada, amb raigs de claror i dos cors petits als costats
        ctx.lineWidth = 3;
        ctx.fillStyle = 'rgba(255,220,120,0.35)'; ctx.beginPath(); ctx.arc(48, 48, 40, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#e8b830'; ctx.lineWidth = 3;
        for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; ctx.beginPath(); ctx.moveTo(48 + Math.cos(a) * 30, 48 + Math.sin(a) * 30); ctx.lineTo(48 + Math.cos(a) * 42, 48 + Math.sin(a) * 42); ctx.stroke(); }
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 3; ctx.fillStyle = '#f6e6a8';
        ctx.beginPath(); ctx.arc(48, 48, 28, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(43, 28, 10, 40); ctx.fillRect(32, 38, 32, 10); ctx.strokeRect(43, 28, 10, 40); ctx.strokeRect(32, 38, 32, 10);
        ctx.fillStyle = '#d4af37'; ctx.fillRect(44, 39, 8, 8);
        ctx.fillStyle = '#c8442a';
        [[22, 78], [74, 78]].forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(x, y + 7); ctx.bezierCurveTo(x - 12, y - 2, x - 5, y - 10, x, y - 3); ctx.bezierCurveTo(x + 5, y - 10, x + 12, y - 2, x, y + 7); ctx.fill(); ctx.stroke(); });
    },
    llac_nena: (ctx, cv) => { const t = document.createElement('canvas'); dibuixarLlac(t, 80); ctx.drawImage(t, 8, (96 - t.height) / 2); },
    llanterna: ctx => {
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        const C = '#1e1a17';

        // Resplendor càlida de la flama
        const halo = ctx.createRadialGradient(48, 56, 4, 48, 56, 38);
        halo.addColorStop(0, 'rgba(255, 230, 140, 0.55)');
        halo.addColorStop(0.45, 'rgba(255, 160, 50, 0.22)');
        halo.addColorStop(1, 'rgba(255, 140, 30, 0)');
        ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(48, 56, 38, 0, Math.PI * 2); ctx.fill();

        // Anella de ferro a sobre (per agafar o penjar el fanal)
        ctx.strokeStyle = C; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(48, 14, 8.5, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = '#5a544e'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(48, 13.5, 8.5, -Math.PI * 0.8, -Math.PI * 0.2); ctx.stroke();
        // Enganxe de l'anella
        ctx.fillStyle = '#2c2622'; ctx.strokeStyle = C; ctx.lineWidth = 2;
        ctx.fillRect(44, 21, 8, 4); ctx.strokeRect(44, 21, 8, 4);

        // Capçada / teuladeta de ferro forjat (forma piramidal)
        ctx.fillStyle = '#342e2a'; ctx.beginPath();
        ctx.moveTo(38, 25); ctx.lineTo(58, 25); ctx.lineTo(68, 36); ctx.lineTo(28, 36); ctx.closePath();
        ctx.fill(); ctx.strokeStyle = C; ctx.lineWidth = 2.5; ctx.stroke();
        ctx.fillStyle = '#4a423c'; ctx.fillRect(32, 34, 34, 3);

        // Vidre translúcid càlid
        const vidre = ctx.createLinearGradient(28, 36, 68, 74);
        vidre.addColorStop(0, '#fff4c2'); vidre.addColorStop(0.5, '#ffd270'); vidre.addColorStop(1, '#f0a840');
        ctx.fillStyle = vidre; ctx.fillRect(28, 37, 40, 37);

        // Flama i caliu a l'interior
        ctx.fillStyle = '#ff6010'; ctx.beginPath(); ctx.ellipse(48, 57, 6, 12, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff090'; ctx.beginPath(); ctx.ellipse(48, 58, 3.5, 7, 0, 0, Math.PI * 2); ctx.fill();

        // Estructura de ferro: reixa creuada en aspa
        ctx.strokeStyle = C; ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(30, 38); ctx.lineTo(66, 73);
        ctx.moveTo(66, 38); ctx.lineTo(30, 73);
        ctx.stroke();

        // Marc de ferro al voltant dels vidres
        ctx.lineWidth = 3;
        ctx.strokeRect(28, 37, 40, 37);
        // Barrots cantoners reforçats
        ctx.fillStyle = '#24201c';
        ctx.fillRect(26, 36, 4, 39); ctx.strokeRect(26, 36, 4, 39);
        ctx.fillRect(66, 36, 4, 39); ctx.strokeRect(66, 36, 4, 39);

        // Base de ferro amb motllura i peus
        ctx.fillStyle = '#342e2a'; ctx.fillRect(24, 74, 48, 8);
        ctx.strokeStyle = C; ctx.lineWidth = 2.5; ctx.strokeRect(24, 74, 48, 8);
        ctx.fillStyle = '#24201c';
        ctx.fillRect(25, 82, 8, 4); ctx.strokeRect(25, 82, 8, 4);
        ctx.fillRect(63, 82, 8, 4); ctx.strokeRect(63, 82, 8, 4);
    },
    telescopi: ctx => {
        ctx.save(); ctx.translate(48, 50); ctx.rotate(-0.55); ctx.lineWidth = 3;
        ctx.fillStyle = '#c8963a'; ctx.beginPath(); ctx.rect(-40, -9, 34, 18); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#e0b058'; ctx.beginPath(); ctx.rect(-8, -12, 34, 24); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#c8963a'; ctx.beginPath(); ctx.rect(24, -15, 14, 30); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#9ad0ff'; ctx.beginPath(); ctx.ellipse(38, 0, 4, 13, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fillRect(-6, -9, 30, 4);
        ctx.restore();
    },
    estel_llorenc: ctx => {
        const g = ctx.createRadialGradient(48, 48, 2, 48, 48, 46); g.addColorStop(0, 'rgba(230,240,255,0.9)'); g.addColorStop(1, 'rgba(180,200,255,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, 96, 96);
        ctx.lineWidth = 3; ctx.fillStyle = '#f4f8ff';
        ctx.beginPath();
        for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 13 : 34; ctx.lineTo(48 + Math.cos(a) * r, 50 + Math.sin(a) * r); }
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#c8d8ff'; ctx.beginPath(); ctx.arc(48, 50, 7, 0, Math.PI * 2); ctx.fill();
    },
    runna: ctx => {
        const g = ctx.createRadialGradient(48, 48, 4, 48, 48, 46); g.addColorStop(0, 'rgba(216,232,255,0.7)'); g.addColorStop(1, 'rgba(216,232,255,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, 96, 96);
        ctx.save(); ctx.translate(48, 48); ctx.rotate(-Math.PI / 4); ctx.lineWidth = 3;
        ctx.fillStyle = '#e8f0ff'; ctx.beginPath(); ctx.moveTo(-12, -5); ctx.lineTo(34, -5); ctx.lineTo(44, 0); ctx.lineTo(34, 5); ctx.lineTo(-12, 5); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#a8b8d8'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(36, 0); ctx.stroke(); ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
        ctx.fillStyle = '#c8a040'; ctx.beginPath(); ctx.rect(-17, -16, 6, 32); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#5a3a24'; ctx.beginPath(); ctx.rect(-36, -4, 19, 8); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#c8a040'; ctx.beginPath(); ctx.arc(-40, 0, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.restore();
    },
    guants: ctx => {
        ctx.lineWidth = 3; ctx.fillStyle = '#8a5a32';
        ctx.beginPath(); ctx.moveTo(30, 88); ctx.lineTo(28, 50); ctx.lineTo(16, 38); ctx.quadraticCurveTo(14, 30, 22, 32); ctx.lineTo(30, 40);
        ctx.lineTo(30, 16); ctx.quadraticCurveTo(36, 10, 40, 16); ctx.lineTo(41, 34); ctx.lineTo(43, 12); ctx.quadraticCurveTo(49, 6, 53, 12);
        ctx.lineTo(53, 34); ctx.lineTo(56, 16); ctx.quadraticCurveTo(62, 10, 66, 17); ctx.lineTo(64, 38); ctx.lineTo(68, 24); ctx.quadraticCurveTo(74, 20, 76, 27);
        ctx.lineTo(70, 58); ctx.lineTo(66, 88); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#c8a040'; ctx.beginPath(); ctx.rect(28, 74, 40, 12); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(34, 46, 6, 24);
    },
    maneta: ctx => {         // maneta de ferro en forma de colze, amb el puny de fusta
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        const forma = () => { ctx.beginPath(); ctx.moveTo(24, 30); ctx.lineTo(24, 58); ctx.lineTo(62, 58); ctx.stroke(); };
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 14; forma();
        ctx.strokeStyle = '#6a6e78'; ctx.lineWidth = 8; forma();
        ctx.fillStyle = '#4a4e58'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3; ctx.beginPath(); ctx.rect(14, 18, 20, 14); ctx.fill(); ctx.stroke();      // encaix quadrat
        ctx.fillStyle = '#9a6a3a'; ctx.beginPath(); ctx.roundRect(58, 48, 26, 20, 7); ctx.fill(); ctx.stroke();                                   // puny
        ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(22, 34); ctx.lineTo(22, 54); ctx.stroke();
    },
    fragment1: ctx => {
        ctx.lineWidth = 3; ctx.fillStyle = '#e8d8a8';
        ctx.beginPath(); ctx.moveTo(20, 20); ctx.lineTo(70, 18); ctx.lineTo(64, 30); ctx.lineTo(72, 42); ctx.lineTo(63, 54); ctx.lineTo(71, 66); ctx.lineTo(66, 78); ctx.lineTo(22, 80); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#6a4a2a'; ctx.lineWidth = 2; [32, 43, 54, 65].forEach(y => { ctx.beginPath(); ctx.moveTo(30, y); ctx.lineTo(58 - (y % 11), y); ctx.stroke(); });
        ctx.fillStyle = '#9a2a1a'; ctx.fillRect(27, 24, 7, 7);
    },
    pergami_monjo: ctx => {          // el mateix pergamí esquinçat, amb plecs, taques, escriptura i segell, que es veu clavat a les parets
        ctx.save(); ctx.translate(14, 5); ctx.rotate(-0.04);
        pintarPergamiParet(ctx, 68, 86, { senseClaus: true });
        ctx.restore();
    },
    carta_cortiner: ctx => {                      // un pergamí enrotllat, lligat amb una cinta blava
        ctx.save(); ctx.translate(48, 48); ctx.rotate(-0.35); ctx.translate(-48, -48);
        ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.fillStyle = '#efe0b4';
        ctx.beginPath(); ctx.rect(18, 34, 60, 30); ctx.fill(); ctx.stroke();                                              // el cos del rotlle
        ctx.fillStyle = '#d9c48a'; ctx.beginPath(); ctx.rect(18, 55, 60, 9); ctx.fill();                                // ombra de baix
        ctx.beginPath(); ctx.moveTo(18, 64); ctx.lineTo(78, 64); ctx.stroke();
        ctx.fillStyle = '#c8b070'; [18, 78].forEach(x => { ctx.beginPath(); ctx.ellipse(x, 49, 7, 15, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });   // les dues puntes enrotllades
        ctx.lineWidth = 2; ctx.strokeStyle = '#6a4a2a'; [18, 78].forEach(x => { ctx.beginPath(); ctx.ellipse(x, 49, 3.5, 8, 0, 0, Math.PI * 2); ctx.stroke(); });
        ctx.fillStyle = '#2a5a8a'; ctx.strokeStyle = '#1c3c5c'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.rect(42, 32, 11, 34); ctx.fill(); ctx.stroke();                                              // la cinta
        ctx.beginPath(); ctx.moveTo(47, 66); ctx.lineTo(41, 78); ctx.lineTo(47, 74); ctx.lineTo(53, 78); ctx.closePath(); ctx.fill(); ctx.stroke();   // els caps penjant
        ctx.restore();
    },
    llavorLluna: ctx => {
        const g = ctx.createRadialGradient(48, 52, 2, 48, 52, 42); g.addColorStop(0, 'rgba(230,230,255,0.8)'); g.addColorStop(1, 'rgba(200,200,255,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, 96, 96);
        ctx.lineWidth = 3; ctx.fillStyle = '#e8e4f8';
        ctx.beginPath(); ctx.ellipse(48, 54, 18, 26, 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#b8b0e0'; ctx.beginPath(); ctx.arc(44, 50, 10, 0.5, Math.PI * 1.5); ctx.arc(48, 46, 8, Math.PI * 1.5, 0.5, true); ctx.fill();
    },
    gra_rosari: ctx => {
        ctx.lineJoin = 'round';
        // Aura radiant daurada
        const h = ctx.createRadialGradient(48, 48, 10, 48, 48, 44);
        h.addColorStop(0, 'rgba(255, 235, 150, 0.65)');
        h.addColorStop(0.5, 'rgba(255, 180, 50, 0.28)');
        h.addColorStop(1, 'rgba(255, 140, 20, 0)');
        ctx.fillStyle = h; ctx.beginPath(); ctx.arc(48, 48, 44, 0, Math.PI * 2); ctx.fill();

        // Gra d'olivera
        const r = 30;
        const g = ctx.createRadialGradient(40, 38, 4, 48, 48, r);
        g.addColorStop(0, '#ffe4a0');
        g.addColorStop(0.4, '#c88238');
        g.addColorStop(1, '#5a2a0c');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(48, 48, r, 0, Math.PI * 2); ctx.fill();

        // Vetis de fusta
        ctx.save();
        ctx.beginPath(); ctx.arc(48, 48, r, 0, Math.PI * 2); ctx.clip();
        ctx.strokeStyle = 'rgba(70, 30, 8, 0.35)'; ctx.lineWidth = 2.5;
        for (let dy = -20; dy <= 20; dy += 10) {
            ctx.beginPath();
            ctx.moveTo(18, 48 + dy - 6);
            ctx.quadraticCurveTo(48, 48 + dy + 8, 78, 48 + dy - 4);
            ctx.stroke();
        }
        // Brillantor de fusta envernissada
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.beginPath(); ctx.ellipse(39, 36, 9, 5, -0.6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.beginPath(); ctx.arc(58, 60, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // Contorn i forats del cordó
        ctx.lineWidth = 3.2; ctx.strokeStyle = CONTORN;
        ctx.beginPath(); ctx.arc(48, 48, r, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = CONTORN;
        [48 - r + 2.5, 48 + r - 2.5].forEach(x => {
            ctx.beginPath(); ctx.ellipse(x, 48, 3, 5, 0, 0, Math.PI * 2); ctx.fill();
        });
    }
};

function dibuixaEmblemaIcona(ctx, scene, clau) {
    if (!scene || !scene.textures.exists(clau)) return;
    const im = scene.textures.get(clau).getSourceImage(), m = 4;
    ctx.drawImage(im, m, m, ICONA_MIDA - 2 * m, ICONA_MIDA - 2 * m);
}

// Clau de la textura de la icona (es crea el primer cop que cal); null si l'objecte no en té
function iconaObjecte(scene, id) {
    const dib = ICONES_OBJECTES[id];
    if (!dib) return null;
    const clau = 'icona_' + id;
    if (!scene.textures.exists(clau)) {
        const cv = document.createElement('canvas');
        cv.width = cv.height = ICONA_MIDA;
        const ctx = cv.getContext('2d');
        ctx.lineJoin = 'round'; ctx.strokeStyle = CONTORN;
        dib(ctx, cv, scene);
        scene.textures.addCanvas(clau, cv);
    }
    return clau;
}

// L'objecte encara farà falta? 'cal' (encara el necessitaràs), 'sempre' (t'acompanya: arma, eina o protecció) o 'record' (ja s'ha fet servir)
const US_OBJECTES = {
    flauta: () => 'sempre',
    basto: E => E.te('basto_tiller') || E.te('runna') ? 'record' : 'sempre',
    basto_tiller: E => !E.flag('camiCirosaObert') ? 'cal' : E.te('runna') ? 'record' : 'sempre',
    clau_campanar: E => E.flag('rellotgeReparat') ? 'record' : 'cal',
    pallofa: () => 'cal',
    clau_sagrari: E => E.flag('fragment2') ? 'record' : 'cal',
    escudella: E => E.flag('soparFet') ? 'record' : 'cal',
    flors_isilder: E => E.flag('soparFet') ? 'record' : 'cal',
    esquelles: E => E.flag('soparFet') ? 'record' : 'cal',
    fulla_tiler: E => E.flag('benediccio') ? 'record' : 'cal',
    medallo_arbre: () => 'cal',
    medallo_saber: () => 'cal',
    medallo_benedicio: () => 'cal',
    cinta_nena: () => 'sempre',
    benedicio_fraterna: () => 'sempre',
    llanterna: () => 'sempre',
    runna: () => 'sempre',
    telescopi: E => E.flag('telescopiMuntat') || E.flag('estelsPart1') ? 'record' : 'cal',
    estel_llorenc: E => E.flag('boiraDolmenNeta') ? 'record' : 'cal',
    guants: E => E.flag('rodaMoguda') && E.flag('refetorObert') && E.flag('rastellObert') ? 'record' : 'cal',
    maneta: E => E.flag('raimDerrotat') ? 'record' : 'cal',
    fragment1: E => E.flag('benedicioMonjo') ? 'record' : 'cal',
    pergami_monjo: E => E.flag('raimDerrotat') ? 'record' : 'cal',
    clau_girgoles: E => E.flag('portaFerroOberta') ? 'record' : 'cal',
    clau_ferro: E => E.flag('portaSoterraniOberta') ? 'record' : 'cal',
    clau_gabriel: E => E.flag('portaGabrielOberta') ? 'record' : 'cal',
    carta_cortiner: E => 'record',
    pruna: E => E.flag('fontNeta') ? 'record' : 'cal',               // un cop oferta a la font, es queda al sarró de record
    // La resta (aigua, cristall, beuratge, pa, llaç, ram, llavor) es gasten en fer-los servir: si els portes, encara et calen
};
const US_TEXTOS = {
    cal: ['★ Encara et farà falta.', '#8a2a14'],
    sempre: ["◆ T'acompanya sempre: no te'n separis.", '#2a4a7a'],
    record: ['✓ Ja l\'has fet servir. Te\'l pots quedar de record.', '#3a7a3a']
};
function usObjecte(E, id) { return (US_OBJECTES[id] || (() => 'cal'))(E); }

// Objectes que es poden tenir més d'un cop (són una sola entrada al sarró): quants se'n porten. El sarró ho mostra amb un número al quadre.
const QUANTITAT_OBJECTES = { llac_nena: E => ['llac1', 'llac2'].filter(f => E.flag(f)).length };
function quantitatObjecte(E, id) { const f = QUANTITAT_OBJECTES[id]; return f ? Math.max(1, f(E)) : 1; }
