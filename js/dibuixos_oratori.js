/**
 * L'ORATORI AMAGAT (ZonaTresor): el racó secret dels monjos darrere la pedra que escolta de la façana del Santuari.
 * La paret del fons amb l'absis i el relleu de les pedres que escolten, l'arqueta-reliquiari (tancada i oberta),
 * els canelobres i el faristol.
 */

// Paret del fons (640 x 250): carreus, absis amb dovelles i el relleu dels cercles, prestatge de llibres a l'esquerra i
// prestatge de les pedres polides amb una campaneta a la dreta. Teranyines als racons.
function pintarParetOratori(ctx, w, h) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    let llavor = 41;
    const rnd = () => (llavor = (llavor * 16807) % 2147483647) / 2147483647;
    // Carreus
    ctx.fillStyle = '#5e5246'; ctx.fillRect(0, 0, w, h);
    const fila = 32;
    for (let y = 0, r = 0; y < h; y += fila, r++) {
        let x = r % 2 ? -30 : 0;
        while (x < w) {
            const amp = 56 + rnd() * 44, to = 0.85 + rnd() * 0.3;
            const c = (v) => Math.round(v * to);
            ctx.fillStyle = `rgb(${c(126)},${c(112)},${c(96)})`;
            ctx.fillRect(x + 1.5, y + 1.5, amp - 3, fila - 3);
            ctx.fillStyle = 'rgba(255,240,210,0.12)'; ctx.fillRect(x + 2, y + 2, amp - 4, 3);
            ctx.fillStyle = 'rgba(0,0,0,0.16)'; ctx.fillRect(x + 2, y + fila - 5, amp - 4, 3);
            for (let k = 0; k < 4; k++) { ctx.fillStyle = rnd() < 0.5 ? 'rgba(40,30,20,0.25)' : 'rgba(255,240,210,0.15)'; ctx.fillRect(x + 4 + rnd() * (amp - 10), y + 6 + rnd() * (fila - 12), 2, 2); }
            x += amp;
        }
    }
    // Pilastres dels costats, més fosques
    [[0, 40], [w - 40, 40]].forEach(([x, a]) => {
        ctx.fillStyle = 'rgba(20,12,6,0.45)'; ctx.fillRect(x, 0, a, h);
        ctx.fillStyle = 'rgba(255,230,190,0.1)'; ctx.fillRect(x === 0 ? a - 4 : x, 0, 4, h);
    });
    // La volta s'enfosqueix a dalt
    const gv = ctx.createLinearGradient(0, 0, 0, 120); gv.addColorStop(0, 'rgba(8,4,2,0.8)'); gv.addColorStop(1, 'rgba(8,4,2,0)');
    ctx.fillStyle = gv; ctx.fillRect(0, 0, w, 120);

    // Absis al mig: fons fosc, dovelles i el relleu de les pedres que escolten
    const AX = w / 2, AY = 118, AR = 104, peu = h - 14;
    const buit = new Path2D(); buit.arc(AX, AY, AR, Math.PI, 0); buit.lineTo(AX + AR, peu); buit.lineTo(AX - AR, peu); buit.closePath();
    const gb = ctx.createLinearGradient(0, AY - AR, 0, peu); gb.addColorStop(0, '#120c08'); gb.addColorStop(1, '#3a2c20');
    ctx.fillStyle = gb; ctx.fill(buit);
    ctx.save(); ctx.clip(buit);
    for (let y = AY - AR; y < peu; y += 26) for (let x = AX - AR; x < AX + AR; x += 46) {           // carreus de dins, a l'ombra
        ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 1.5; ctx.strokeRect(x + ((y / 26) % 2 ? 23 : 0), y, 46, 26);
    }
    // el relleu: una pedra rodona amb tres anells, com ones que s'escampen
    const RX = AX, RY = AY - 18;
    ctx.fillStyle = '#9a8a74'; ctx.beginPath(); ctx.arc(RX, RY, 40, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = CONTORN; ctx.lineWidth = 2.5; ctx.stroke();
    [32, 23, 14].forEach((r, i) => {
        ctx.strokeStyle = 'rgba(40,28,16,0.75)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(RX, RY, r, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,240,210,0.35)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(RX - 0.8, RY - 0.8, r, Math.PI * 1.05, Math.PI * 1.75); ctx.stroke();
    });
    ctx.fillStyle = '#c8b898'; ctx.beginPath(); ctx.arc(RX, RY, 6, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = CONTORN; ctx.lineWidth = 1.5; ctx.stroke();
    // una inscripció gastada a sota
    ctx.fillStyle = '#7a6a56'; ctx.fillRect(RX - 52, RY + 52, 104, 16); ctx.strokeStyle = CONTORN; ctx.lineWidth = 1.5; ctx.strokeRect(RX - 52, RY + 52, 104, 16);
    ctx.strokeStyle = 'rgba(30,20,10,0.7)'; ctx.lineWidth = 1.3;
    for (let x = RX - 46; x < RX + 44; x += 7) { const a = rnd() * 3; ctx.beginPath(); ctx.moveTo(x, RY + 56 + a); ctx.lineTo(x + 3, RY + 64 - a); ctx.stroke(); }
    // la finestreta de dalt, per on entra el raig de llum
    ctx.fillStyle = '#d8c8a0'; ctx.fillRect(AX - 4, AY - AR + 10, 8, 26); ctx.fillStyle = 'rgba(255,248,220,0.9)'; ctx.fillRect(AX - 2, AY - AR + 12, 4, 22);
    ctx.restore();
    // dovelles
    const N = 13;
    for (let i = 0; i < N; i++) {
        const a0 = Math.PI + i * Math.PI / N, a1 = Math.PI + (i + 1) * Math.PI / N, r0 = AR, r1 = AR + 22;
        const pts = [[r0, a0], [r1, a0], [r1, a1], [r0, a1]].map(([r, a]) => [AX + Math.cos(a) * r, AY + Math.sin(a) * r]);
        ctx.fillStyle = i === (N - 1) / 2 ? '#d4c6a8' : i % 2 ? '#a89a82' : '#b8aa90';
        ctx.beginPath(); pts.forEach(([x, y], k) => k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 1.8; ctx.stroke();
    }
    // brancals de l'absis
    [AX - AR - 22, AX + AR].forEach(x => {
        ctx.fillStyle = '#b0a288'; ctx.fillRect(x, AY, 22, peu - AY); ctx.strokeStyle = CONTORN; ctx.lineWidth = 1.8; ctx.strokeRect(x, AY, 22, peu - AY);
        ctx.fillStyle = 'rgba(255,240,210,0.25)'; ctx.fillRect(x + 2, AY + 2, 4, peu - AY - 4);
        ctx.fillStyle = '#cbbd9f'; ctx.fillRect(x - 4, AY - 8, 30, 10); ctx.strokeRect(x - 4, AY - 8, 30, 10);
    });

    // Prestatge de llibres (esquerra)
    const pl = (x0, y, amp) => {
        ctx.fillStyle = '#5a3a1e'; ctx.fillRect(x0, y, amp, 7); ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 1.6; ctx.strokeRect(x0, y, amp, 7);
        ctx.fillStyle = 'rgba(255,220,170,0.25)'; ctx.fillRect(x0 + 1, y + 1, amp - 2, 1.5);
        ctx.fillStyle = '#3a2412'; ctx.fillRect(x0 + 8, y + 7, 5, 10); ctx.fillRect(x0 + amp - 13, y + 7, 5, 10);      // escaires
    };
    pl(58, 120, 118); pl(58, 186, 118);
    let bx = 62;
    ['#7a2a20', '#3a4a6a', '#6a5a2a', '#2a4a3a', '#7a4a2a', '#5a2a4a'].forEach((c, i) => {
        const a = 9 + (i % 3) * 3, al = 34 + (i * 7) % 12;
        if (i === 4) { ctx.save(); ctx.translate(bx + 4, 120); ctx.rotate(-0.22); ctx.fillStyle = c; ctx.fillRect(0, -al, a, al); ctx.strokeStyle = CONTORN; ctx.lineWidth = 1.4; ctx.strokeRect(0, -al, a, al); ctx.restore(); bx += a + 8; return; }
        ctx.fillStyle = c; ctx.fillRect(bx, 120 - al, a, al); ctx.strokeStyle = CONTORN; ctx.lineWidth = 1.4; ctx.strokeRect(bx, 120 - al, a, al);
        ctx.fillStyle = '#c9a24a'; ctx.fillRect(bx + 1, 120 - al + 6, a - 2, 2); ctx.fillRect(bx + 1, 120 - 8, a - 2, 2);
        bx += a + 1;
    });
    // pergamins enrotllats i un tinter al prestatge de baix
    [[78, 180], [96, 182], [88, 172]].forEach(([x, y]) => {
        ctx.fillStyle = '#e8d8b0'; ctx.beginPath(); ctx.ellipse(x + 10, y, 14, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = CONTORN; ctx.lineWidth = 1.3; ctx.stroke();
        ctx.fillStyle = '#c8b080'; ctx.beginPath(); ctx.ellipse(x - 3, y, 2.5, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#8a2a20'; ctx.fillRect(x + 8, y - 5, 3, 10);
    });
    ctx.fillStyle = '#2a2a30'; ctx.beginPath(); ctx.roundRect(140, 172, 16, 14, 3); ctx.fill(); ctx.strokeStyle = CONTORN; ctx.lineWidth = 1.3; ctx.stroke();
    ctx.strokeStyle = '#f0e8d8'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(150, 172); ctx.quadraticCurveTo(158, 156, 166, 150); ctx.stroke();      // ploma

    // Prestatge de les pedres polides (dreta): cinc còdols de riu en fila i una campaneta de bronze penjada
    pl(w - 176, 150, 118);
    [[w - 166, 12, '#8a8e94'], [w - 146, 15, '#a09484'], [w - 122, 18, '#6a7078'], [w - 98, 14, '#b0a08a'], [w - 78, 11, '#7e7468']].forEach(([x, r, c]) => {
        ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x + r, 150 - r * 0.62, r, r * 0.66, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(x + r * 0.7, 150 - r * 0.95, r * 0.35, r * 0.16, -0.3, 0, Math.PI * 2); ctx.fill();
    });
    const cx = w - 118;
    ctx.strokeStyle = '#2a2018'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, 158); ctx.lineTo(cx, 182); ctx.stroke();
    const gc = ctx.createLinearGradient(cx - 12, 0, cx + 12, 0); gc.addColorStop(0, '#8a5a1c'); gc.addColorStop(0.45, '#e0b050'); gc.addColorStop(1, '#7a4a14');
    ctx.fillStyle = gc; ctx.beginPath(); ctx.moveTo(cx - 5, 182); ctx.quadraticCurveTo(cx - 6, 192, cx - 13, 204); ctx.lineTo(cx + 13, 204); ctx.quadraticCurveTo(cx + 6, 192, cx + 5, 182); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = CONTORN; ctx.lineWidth = 1.6; ctx.stroke();
    ctx.fillStyle = '#4a2a0c'; ctx.beginPath(); ctx.arc(cx, 206, 3, 0, Math.PI * 2); ctx.fill();

    // Teranyines als racons de dalt
    [[40, 1], [w - 40, -1]].forEach(([x, sg]) => {
        ctx.strokeStyle = 'rgba(230,225,215,0.45)'; ctx.lineWidth = 0.9;
        for (let k = 0; k < 5; k++) { const a = k / 4 * Math.PI / 2; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + sg * Math.cos(a) * 60, Math.sin(a) * 60); ctx.stroke(); }
        [18, 32, 46].forEach(r => { ctx.beginPath(); for (let k = 0; k <= 4; k++) { const a = k / 4 * Math.PI / 2, px = x + sg * Math.cos(a) * r, py = Math.sin(a) * r; k ? ctx.quadraticCurveTo(x + sg * Math.cos(a - 0.2) * (r - 4), Math.sin(a - 0.2) * (r - 4), px, py) : ctx.moveTo(px, py); } ctx.stroke(); });
    });
    // Sòcol
    ctx.fillStyle = '#4e4438'; ctx.fillRect(0, h - 14, w, 14);
    ctx.fillStyle = 'rgba(255,240,210,0.3)'; ctx.fillRect(0, h - 14, w, 2);
    ctx.strokeStyle = CONTORN; ctx.lineWidth = 2; ctx.strokeRect(-2, h - 14, w + 4, 14);
}

// Arqueta-reliquiari romànica (150 x 170, amb 30 de marge a dalt per a la tapa oberta): una caseta de fusta amb sòcol motllurat, arcuacions al davant, marcs daurats amb
// pedres de colors i una teulada d'escates daurades amb una creu al carener. Oberta, la tapa s'aixeca i dins hi ha claror.
function pintarReliquiari(ctx, w, h, obert) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.translate(0, 30); h -= 30;                     // marge de dalt: oberta, la tapa i la creu s'aixequen
    const x0 = 16, x1 = w - 16, yBaix = h - 18, yCos = 74, desp = obert ? -30 : 0;
    // Ombra
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(w / 2 + 2, h - 9, w * 0.47, 8, 0, 0, Math.PI * 2); ctx.fill();
    // Sòcol motllurat amb potes de bola
    [[x0 + 6], [x1 - 6]].forEach(([x]) => { ctx.fillStyle = '#c99a32'; ctx.beginPath(); ctx.arc(x, h - 12, 6, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 1.6; ctx.stroke(); });
    ctx.fillStyle = '#4a2a12'; ctx.beginPath(); ctx.roundRect(x0 - 8, yBaix - 2, x1 - x0 + 16, 12, 3); ctx.fill(); ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#d8aa44'; ctx.fillRect(x0 - 6, yBaix - 2, x1 - x0 + 12, 3);
    // Cos
    const g = ctx.createLinearGradient(0, yCos, 0, yBaix); g.addColorStop(0, '#9a6430'); g.addColorStop(1, '#5e3616');
    ctx.fillStyle = g; ctx.fillRect(x0, yCos, x1 - x0, yBaix - yCos); ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 2.2; ctx.strokeRect(x0, yCos, x1 - x0, yBaix - yCos);
    // Arcuacions: quatre arcs amb columnetes daurades i fons de vellut vermell
    const n = 4, ample = (x1 - x0 - 16) / n, ab = yBaix - 6, at = yCos + 20;
    for (let i = 0; i < n; i++) {
        const ax = x0 + 8 + i * ample, cx = ax + ample / 2, r = ample / 2 - 3;
        ctx.fillStyle = '#5a1a14';
        ctx.beginPath(); ctx.moveTo(cx - r, ab); ctx.lineTo(cx - r, at); ctx.arc(cx, at, r, Math.PI, 0); ctx.lineTo(cx + r, ab); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(255,200,170,0.18)'; ctx.fillRect(cx - r + 2, at, 3, ab - at);
        ctx.strokeStyle = '#d8aa44'; ctx.lineWidth = 2.4; ctx.stroke();
        // una figureta de sant, només la silueta amb aurèola
        ctx.fillStyle = '#c9a24a'; ctx.beginPath(); ctx.arc(cx, at + 2, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#e8c870'; ctx.beginPath(); ctx.arc(cx, at + 2, 6.5, Math.PI, 0); ctx.strokeStyle = '#e8c870'; ctx.lineWidth = 1.2; ctx.stroke();
        ctx.fillStyle = '#b08a3a'; ctx.beginPath(); ctx.moveTo(cx - 5, ab - 1); ctx.lineTo(cx - 3, at + 7); ctx.lineTo(cx + 3, at + 7); ctx.lineTo(cx + 5, ab - 1); ctx.closePath(); ctx.fill();
    }
    // Marc daurat del cos amb pedres de colors (vermelles i blaves) a les cantonades i al mig
    ctx.strokeStyle = '#d8aa44'; ctx.lineWidth = 3; ctx.strokeRect(x0 + 3, yCos + 3, x1 - x0 - 6, yBaix - yCos - 6);
    const pedra = (x, y, c) => {
        ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, 4.5, 3.6, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#7a5410'; ctx.lineWidth = 1.4; ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.beginPath(); ctx.arc(x - 1.3, y - 1.2, 1.2, 0, Math.PI * 2); ctx.fill();
    };
    [[x0 + 3, yCos + 3, '#b02030'], [x1 - 3, yCos + 3, '#2050b0'], [x0 + 3, yBaix - 3, '#2050b0'], [x1 - 3, yBaix - 3, '#b02030']].forEach(([x, y, c]) => pedra(x, y, c));
    // Interior (obert): fosc i amb claror daurada que en surt
    if (obert) {
        ctx.fillStyle = '#1a0c04'; ctx.beginPath(); ctx.moveTo(x0, yCos); ctx.lineTo(x0 + 8, yCos - 12); ctx.lineTo(x1 - 8, yCos - 12); ctx.lineTo(x1, yCos); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 2; ctx.stroke();
        const gl = ctx.createRadialGradient(w / 2, yCos - 8, 2, w / 2, yCos - 8, 60);
        gl.addColorStop(0, 'rgba(255,236,160,0.95)'); gl.addColorStop(0.4, 'rgba(255,210,110,0.45)'); gl.addColorStop(1, 'rgba(255,200,90,0)');
        ctx.fillStyle = gl; ctx.fillRect(x0 - 10, yCos - 70, x1 - x0 + 20, 80);
    }
    // Teulada (tapa): dues aigües d'escates daurades, amb un carener i una creu
    const ty = yCos + desp, tc = 30 + desp, tx0 = x0 - 6, tx1 = x1 + 6, cx0 = x0 + 22, cx1 = x1 - 22;
    const teu = new Path2D(); teu.moveTo(tx0, ty); teu.lineTo(cx0, tc); teu.lineTo(cx1, tc); teu.lineTo(tx1, ty); teu.closePath();
    const gt = ctx.createLinearGradient(0, tc, 0, ty); gt.addColorStop(0, '#f2cf72'); gt.addColorStop(1, '#a8781e');
    ctx.fillStyle = gt; ctx.fill(teu);
    ctx.save(); ctx.clip(teu);
    for (let y = tc + 6, f = 0; y < ty + 6; y += 8, f++) {                          // escates
        for (let x = tx0 + (f % 2 ? 5 : 0); x < tx1; x += 10) {
            ctx.strokeStyle = 'rgba(110,70,10,0.6)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI); ctx.stroke();
        }
    }
    ctx.fillStyle = 'rgba(255,250,220,0.35)'; ctx.beginPath(); ctx.ellipse(w * 0.38, tc + 12, 26, 5, -0.1, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 2.2; ctx.stroke(teu);
    ctx.fillStyle = '#e0b450'; ctx.fillRect(tx0 - 1, ty - 3, tx1 - tx0 + 2, 5); ctx.strokeRect(tx0 - 1, ty - 3, tx1 - tx0 + 2, 5);       // vora
    ctx.fillStyle = '#e8c060'; ctx.fillRect(cx0 - 4, tc - 5, cx1 - cx0 + 8, 6); ctx.strokeRect(cx0 - 4, tc - 5, cx1 - cx0 + 8, 6);     // carener
    [cx0 + 6, w / 2, cx1 - 6].forEach((x, i) => pedra(x, tc - 2, i === 1 ? '#2a8a5a' : '#b02030'));
    // creu al carener
    ctx.fillStyle = '#f0c860'; ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.rect(w / 2 - 2.5, tc - 26, 5, 22); ctx.rect(w / 2 - 9, tc - 20, 18, 5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f0c860'; ctx.fillRect(w / 2 - 1.5, tc - 25, 3, 20); ctx.fillRect(w / 2 - 8, tc - 19, 16, 3);
    // Pany (tancada): placa daurada amb forat de clau, a la vora de la teulada
    if (!obert) {
        ctx.fillStyle = '#e8c060'; ctx.beginPath(); ctx.roundRect(w / 2 - 9, yCos - 6, 18, 20, 4); ctx.fill(); ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 1.8; ctx.stroke();
        ctx.fillStyle = '#1c1008'; ctx.beginPath(); ctx.arc(w / 2, yCos + 2, 2.6, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(w / 2 - 1, yCos + 2, 2, 7);
    }
}

// Canelobre de ferro (44 x 130): peu de tres potes, tija amb nusos i tres espelmes
function pintarCanelobre(ctx, w, h) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const cx = w / 2;
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(cx + 1, h - 4, 18, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = CONTORN; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(cx, h - 18); ctx.lineTo(cx - 16, h - 4); ctx.moveTo(cx, h - 18); ctx.lineTo(cx + 16, h - 4); ctx.moveTo(cx, h - 18); ctx.lineTo(cx, h - 3); ctx.moveTo(cx, h - 18); ctx.lineTo(cx, 46); ctx.stroke();
    ctx.strokeStyle = '#4a4a52'; ctx.lineWidth = 2.6; ctx.stroke();
    [h - 30, 80].forEach(y => { ctx.fillStyle = '#5a5a64'; ctx.beginPath(); ctx.ellipse(cx, y, 5, 3.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = CONTORN; ctx.lineWidth = 1.4; ctx.stroke(); });
    // braços i plats
    ctx.strokeStyle = CONTORN; ctx.lineWidth = 4.5; ctx.beginPath(); ctx.moveTo(cx - 16, 40); ctx.quadraticCurveTo(cx - 16, 52, cx, 52); ctx.quadraticCurveTo(cx + 16, 52, cx + 16, 40); ctx.stroke();
    ctx.strokeStyle = '#4a4a52'; ctx.lineWidth = 2.4; ctx.stroke();
    [[cx - 16, 40], [cx, 36], [cx + 16, 40]].forEach(([x, y]) => {
        ctx.fillStyle = '#6a6a74'; ctx.fillRect(x - 6, y, 12, 4); ctx.strokeStyle = CONTORN; ctx.lineWidth = 1.3; ctx.strokeRect(x - 6, y, 12, 4);
        ctx.fillStyle = '#f2ead8'; ctx.fillRect(x - 3, y - 16, 6, 16); ctx.strokeRect(x - 3, y - 16, 6, 16);
        ctx.fillStyle = 'rgba(200,180,150,0.6)'; ctx.fillRect(x + 1, y - 14, 1.5, 12);
        ctx.fillStyle = '#ff9a2a'; ctx.beginPath(); ctx.moveTo(x - 3, y - 17); ctx.quadraticCurveTo(x, y - 30, x + 3, y - 17); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#ffe080'; ctx.beginPath(); ctx.moveTo(x - 1.4, y - 17); ctx.quadraticCurveTo(x, y - 24, x + 1.4, y - 17); ctx.closePath(); ctx.fill();
    });
}

// Faristol de fusta (80 x 110) amb un llibre obert de pàgines grogues
function pintarFaristol(ctx, w, h) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const cx = w / 2;
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(cx + 2, h - 4, 26, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#4a2a12'; ctx.beginPath(); ctx.roundRect(cx - 22, h - 14, 44, 10, 3); ctx.fill(); ctx.strokeStyle = CONT_FUSTA; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#6a4220'; ctx.fillRect(cx - 6, 44, 12, h - 56); ctx.strokeRect(cx - 6, 44, 12, h - 56);
    ctx.fillStyle = 'rgba(255,220,170,0.25)'; ctx.fillRect(cx - 4, 46, 3, h - 60);
    // el pla inclinat
    ctx.fillStyle = '#7a4c24'; ctx.beginPath(); ctx.moveTo(6, 46); ctx.lineTo(w - 6, 46); ctx.lineTo(w - 14, 18); ctx.lineTo(14, 18); ctx.closePath(); ctx.fill(); ctx.stroke();
    // llibre obert
    ctx.fillStyle = '#efe0b8'; ctx.beginPath(); ctx.moveTo(12, 40); ctx.quadraticCurveTo(cx - 14, 34, cx, 42); ctx.lineTo(cx, 14); ctx.quadraticCurveTo(cx - 14, 8, 18, 14); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = CONTORN; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w - 12, 40); ctx.quadraticCurveTo(cx + 14, 34, cx, 42); ctx.lineTo(cx, 14); ctx.quadraticCurveTo(cx + 14, 8, w - 18, 14); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(60,40,20,0.55)'; ctx.lineWidth = 1;
    for (let k = 0; k < 4; k++) { const y = 19 + k * 5; ctx.beginPath(); ctx.moveTo(20, y + 1); ctx.lineTo(cx - 5, y); ctx.moveTo(cx + 5, y); ctx.lineTo(w - 20, y + 1); ctx.stroke(); }
    ctx.fillStyle = '#9a2a20'; ctx.fillRect(cx - 7, 17, 4, 5);              // caplletra vermella
    ctx.strokeStyle = '#a02a20'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, 42); ctx.lineTo(cx + 2, 58); ctx.stroke();     // punt de llibre
}
