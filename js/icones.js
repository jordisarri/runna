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
    flauta: ctx => {
        ctx.save(); ctx.translate(48, 48); ctx.rotate(-Math.PI / 4);
        ctx.fillStyle = '#b8864a'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.roundRect(-40, -7, 80, 14, 6); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#7a4e26'; ctx.fillRect(-40, 2, 80, 4);
        ctx.fillStyle = CONTORN; [-18, -6, 6, 18].forEach(x => { ctx.beginPath(); ctx.arc(x, -1, 2.8, 0, Math.PI * 2); ctx.fill(); });
        ctx.fillStyle = '#d8a868'; ctx.beginPath(); ctx.rect(-40, -7, 10, 14); ctx.fill(); ctx.stroke();
        ctx.restore();
    },
    basto: ctx => {
        ctx.lineCap = 'round';
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(20, 86); ctx.lineTo(74, 12); ctx.stroke();
        ctx.strokeStyle = '#8a5a32'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(20, 86); ctx.lineTo(74, 12); ctx.stroke();
        ctx.fillStyle = '#6a4024'; ctx.lineWidth = 3; ctx.strokeStyle = CONTORN; ctx.beginPath(); ctx.arc(74, 12, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
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
    clau_sagrari: ctx => iconaClau(ctx, '#e8c050', '#a07a20'),
    clau_girgoles: ctx => iconaClau(ctx, '#a8603a', '#6a3418'),
    clau_ferro: ctx => iconaClau(ctx, '#6a6a72', '#3a3a40', true),
    aigua_sj: ctx => iconaFlasco(ctx, '#6ab0e8', '#c8e8ff'),
    beuratge: ctx => iconaFlasco(ctx, '#8a5ac8', '#c8a0ff'),
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
    escudella: ctx => {
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(255,255,255,0.75)'; [36, 48, 60].forEach(x => { ctx.beginPath(); ctx.moveTo(x, 40); ctx.bezierCurveTo(x - 8, 30, x + 8, 22, x, 10); ctx.stroke(); });
        ctx.strokeStyle = CONTORN; ctx.fillStyle = '#c8784a';
        ctx.beginPath(); ctx.moveTo(12, 48); ctx.bezierCurveTo(14, 90, 82, 90, 84, 48); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#e8b060'; ctx.beginPath(); ctx.ellipse(48, 48, 36, 9, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#f4f0e0'; [[38, 47], [56, 49], [48, 45]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill(); });
    },
    flors_isidre: ctx => iconaFlors(ctx, ['#f0f0ff', '#d8e0ff', '#ffffff']),
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
    fulla_tiler: ctx => {
        ctx.lineWidth = 3; ctx.fillStyle = '#6a9a3a';
        ctx.beginPath(); ctx.moveTo(48, 86); ctx.bezierCurveTo(4, 56, 18, 8, 48, 26); ctx.bezierCurveTo(78, 8, 92, 56, 48, 86); ctx.fill(); ctx.stroke();
        ctx.lineWidth = 2; ctx.strokeStyle = '#3a6a22'; ctx.beginPath(); ctx.moveTo(48, 86); ctx.lineTo(48, 30);
        [44, 58, 72].forEach(y => { ctx.moveTo(48, y); ctx.lineTo(30, y - 12); ctx.moveTo(48, y); ctx.lineTo(66, y - 12); }); ctx.stroke();
    },
    cinta_nena: ctx => {
        ctx.lineWidth = 3; ctx.fillStyle = '#ec8cae';
        ctx.beginPath(); ctx.moveTo(10, 30); ctx.bezierCurveTo(30, 10, 46, 50, 66, 30); ctx.lineTo(86, 44); ctx.lineTo(76, 52); ctx.lineTo(84, 64);
        ctx.bezierCurveTo(60, 70, 50, 44, 26, 62); ctx.lineTo(10, 50); ctx.lineTo(18, 40); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.beginPath(); ctx.moveTo(18, 34); ctx.bezierCurveTo(32, 22, 46, 50, 62, 38); ctx.stroke();
    },
    llac_nena: (ctx, cv) => { const t = document.createElement('canvas'); dibuixarLlac(t, 80); ctx.drawImage(t, 8, (96 - t.height) / 2); },
    llanterna: ctx => {
        ctx.lineWidth = 3;
        ctx.fillStyle = 'rgba(255,210,110,0.35)'; ctx.beginPath(); ctx.arc(48, 54, 34, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = CONTORN; ctx.beginPath(); ctx.arc(48, 18, 9, Math.PI, 0); ctx.stroke();
        ctx.fillStyle = '#3a3a40'; ctx.beginPath(); ctx.moveTo(30, 28); ctx.lineTo(66, 28); ctx.lineTo(60, 20); ctx.lineTo(36, 20); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ffd870'; ctx.beginPath(); ctx.rect(32, 28, 32, 44); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ff9a30'; ctx.beginPath(); ctx.ellipse(48, 52, 6, 11, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(48, 28); ctx.lineTo(48, 72); ctx.moveTo(32, 50); ctx.lineTo(64, 50); ctx.stroke();
        ctx.fillStyle = '#3a3a40'; ctx.beginPath(); ctx.rect(28, 72, 40, 10); ctx.fill(); ctx.stroke();
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
    palanca: ctx => {
        ctx.lineCap = 'round';
        ctx.strokeStyle = CONTORN; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(22, 84); ctx.lineTo(66, 22); ctx.quadraticCurveTo(74, 10, 84, 18); ctx.stroke();
        ctx.strokeStyle = '#6a6e78'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(22, 84); ctx.lineTo(66, 22); ctx.quadraticCurveTo(74, 10, 84, 18); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(26, 78); ctx.lineTo(62, 26); ctx.stroke();
    },
    fragment1: ctx => {
        ctx.lineWidth = 3; ctx.fillStyle = '#e8d8a8';
        ctx.beginPath(); ctx.moveTo(20, 20); ctx.lineTo(70, 18); ctx.lineTo(64, 30); ctx.lineTo(72, 42); ctx.lineTo(63, 54); ctx.lineTo(71, 66); ctx.lineTo(66, 78); ctx.lineTo(22, 80); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#6a4a2a'; ctx.lineWidth = 2; [32, 43, 54, 65].forEach(y => { ctx.beginPath(); ctx.moveTo(30, y); ctx.lineTo(58 - (y % 11), y); ctx.stroke(); });
        ctx.fillStyle = '#9a2a1a'; ctx.fillRect(27, 24, 7, 7);
    },
    pergami_monjo: ctx => {
        ctx.lineWidth = 3; ctx.fillStyle = '#e8d8a8';
        ctx.beginPath(); ctx.rect(22, 18, 52, 60); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#c8b480'; [18, 78].forEach(y => { ctx.beginPath(); ctx.ellipse(48, y, 30, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
        ctx.strokeStyle = '#6a4a2a'; ctx.lineWidth = 2; [32, 42, 52, 62].forEach(y => { ctx.beginPath(); ctx.moveTo(30, y); ctx.lineTo(66 - (y % 20), y); ctx.stroke(); });
        ctx.fillStyle = '#9a2a1a'; ctx.beginPath(); ctx.arc(62, 66, 6, 0, Math.PI * 2); ctx.fill();
    },
    calze: ctx => {
        ctx.lineWidth = 3; ctx.fillStyle = '#d0d4dc';
        ctx.beginPath(); ctx.moveTo(22, 14); ctx.lineTo(74, 14); ctx.bezierCurveTo(72, 44, 60, 50, 52, 52); ctx.lineTo(52, 70); ctx.lineTo(68, 84); ctx.lineTo(28, 84); ctx.lineTo(44, 70); ctx.lineTo(44, 52); ctx.bezierCurveTo(36, 50, 24, 44, 22, 14); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#9ac8ff'; ctx.beginPath(); ctx.ellipse(48, 16, 25, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillRect(30, 22, 5, 18);
    },
    llavorLluna: ctx => {
        const g = ctx.createRadialGradient(48, 52, 2, 48, 52, 42); g.addColorStop(0, 'rgba(230,230,255,0.8)'); g.addColorStop(1, 'rgba(200,200,255,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, 96, 96);
        ctx.lineWidth = 3; ctx.fillStyle = '#e8e4f8';
        ctx.beginPath(); ctx.ellipse(48, 54, 18, 26, 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#b8b0e0'; ctx.beginPath(); ctx.arc(44, 50, 10, 0.5, Math.PI * 1.5); ctx.arc(48, 46, 8, Math.PI * 1.5, 0.5, true); ctx.fill();
    }
};

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
        dib(ctx, cv);
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
    clau_sagrari: E => E.flag('fragment2') ? 'record' : 'cal',
    escudella: E => E.flag('soparFet') ? 'record' : 'cal',
    flors_isidre: E => E.flag('soparFet') ? 'record' : 'cal',
    esquelles: E => E.flag('soparFet') ? 'record' : 'cal',
    fulla_tiler: E => E.flag('benediccio') ? 'record' : 'cal',
    cinta_nena: () => 'sempre',
    llanterna: () => 'sempre',
    runna: () => 'sempre',
    telescopi: E => E.flag('telescopiMuntat') || E.flag('estelsPart1') ? 'record' : 'cal',
    estel_llorenc: E => E.flag('boiraDolmenNeta') ? 'record' : 'cal',
    guants: E => E.flag('rodaMoguda') && E.flag('refetorObert') && E.flag('rastellObert') ? 'record' : 'cal',
    palanca: E => E.flag('raimDerrotat') ? 'record' : 'cal',
    fragment1: E => E.flag('benedicioMonjo') ? 'record' : 'cal',
    pergami_monjo: E => E.flag('raimDerrotat') ? 'record' : 'cal',
    clau_girgoles: E => E.flag('portaFerroOberta') ? 'record' : 'cal',
    clau_ferro: E => E.flag('portaSoterraniOberta') ? 'record' : 'cal',
    calze: () => 'sempre'
    // La resta (aigua, cristall, pruna, beuratge, pa, llaç, ram, llavor) es gasten en fer-los servir: si els portes, encara et calen
};
const US_TEXTOS = {
    cal: ['★ Encara et farà falta.', '#8a2a14'],
    sempre: ["◆ T'acompanya sempre: no te'n separis.", '#2a4a7a'],
    record: ['✓ Ja l\'has fet servir. Te\'l pots quedar de record.', '#3a7a3a']
};
function usObjecte(E, id) { return (US_OBJECTES[id] || (() => 'cal'))(E); }
