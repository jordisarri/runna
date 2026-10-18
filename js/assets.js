/**
 * GRÀFICS
 * - CATALEG: PNG que el joc intenta carregar de la carpeta assets/.
 *   Si un PNG no hi és, es dibuixa un marcador provisional (funció `provisional`).
 *   Quan hi posis el PNG definitiu (encara que tingui fons blanc), apareixerà sol.
 * - Els PNG es redueixen a la mida de joc i se'ls treu el fons blanc automàticament.
 * - Les textures es creen a resolució RES (x2) i es mostren a escala 1/RES perquè es vegin nítides.
 */
const RES = 2;

const CATALEG = [
    // Edificis
    { key: 'esglesia',     file: 'assets/esglesia.png',     amplada: 700 },
    { key: 'monestir',     file: 'assets/monestir.png',     amplada: 620, provisional: (c, w) => dibuixarEdifici(c, w, w * 0.62, '#cdb08a', '#7a4a2a', 'Monestir') },
    { key: 'casa_gran',    file: 'assets/casa_gran.png',    amplada: 640, provisional: (c, w) => dibuixarEdifici(c, w, w * 0.6, '#e2cfa8', '#9a5a32', 'Casa Gran') },
    // Personatges
    { key: 'pare_jordi',   file: 'assets/pare_jordi.png',   amplada: 96, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#1d1b22', alt: 1.08, ulleres: true, cabell: '#9c9c9c' }) },
    { key: 'germa_andreu', file: 'assets/germa_andreu.png', amplada: 96, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#2a2230', cabell: '#3b2a1e', pilota: true }) },
    { key: 'pare_daniel',  file: 'assets/pare_daniel.png',  amplada: 96, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#1d1b22', cabell: '#5a4636' }) },
    { key: 'pare_alcui',   file: 'assets/pare_alcui.png',   amplada: 96, provisional: (c, w) => dibuixarMonjo(c, w, { habit: '#1d1b22', cabell: '#d8d8d8', llibre: true }) },
    // Elements
    { key: 'home_raim',    file: 'assets/home_raim.png',    amplada: 80,  provisional: (c, w) => dibuixarHomeRaim(c, w) },
    { key: 'creu',         file: 'assets/creu.png',         amplada: 70,  provisional: (c, w) => dibuixarCreu(c, w) },
    { key: 'bassadoria',   file: 'assets/bassadoria.png',   amplada: 260, provisional: (c, w) => dibuixarBassadoria(c, w) },
    { key: 'font',         file: 'assets/font.png',         amplada: 110, provisional: (c, w) => dibuixarFont(c, w) },
    { key: 'arbre',        file: 'assets/arbre.png',        amplada: 150, provisional: (c, w) => dibuixarArbre(c, w) },
    { key: 'xiprer',       file: 'assets/xiprer.png',       amplada: 60,  provisional: (c, w) => dibuixarXiprer(c, w) },
    { key: 'retaule',      file: 'assets/retaule.png',      amplada: 360, provisional: (c, w) => dibuixarRetaule(c, w) }
];

/**
 * SPRITES DE L'INEU (generats amb eines/generar_sprites.html a partir de la fitxa del personatge)
 * Cada spritesheet té 4 fotogrames de 230×300 amb els peus a y=294.
 *   avall/amunt: fotograma 0 = quiet · costat: fotograma 1 = quiet (mira a la dreta)
 */
const SPRITE_INEU = {
    ample: 230, alt: 300, peus: 294,
    alcada: 128,          // alçada en píxels de joc
    fps: 8,
    quiet: { avall: 0, amunt: 0, costat: 1 }
};

const Grafics = {
    // Avís si el navegador no deixa llegir els píxels (obert amb doble clic, file://)
    pixelsBloquejats: false,
    faltants: [],

    carregar(scene) {
        scene.load.on('loaderror', f => Grafics.faltants.push(f.key));
        CATALEG.forEach(item => scene.load.image(item.key, item.file));
        ['avall', 'amunt', 'costat'].forEach(dir => scene.load.spritesheet('ineu_' + dir, `assets/sprites/ineu_${dir}.png`,
            { frameWidth: SPRITE_INEU.ample, frameHeight: SPRITE_INEU.alt }));
    },

    // Processa tots els PNG carregats i crea marcadors/textures generades
    preparar(scene) {
        CATALEG.forEach(item => {
            const existeix = scene.textures.exists(item.key) && !Grafics.faltants.includes(item.key);
            if (existeix) Grafics.netejarPNG(scene, item);
            else Grafics.crearProvisional(scene, item);
        });
        Grafics.texturesGenerades(scene);
        Grafics.animacions(scene);
    },

    // Animacions de caminar de l'Ineu (són globals: es creen una sola vegada)
    animacions(scene) {
        ['avall', 'amunt', 'costat'].forEach(dir => {
            const key = 'caminar_' + dir;
            if (scene.anims.exists(key) || !scene.textures.exists('ineu_' + dir)) return;
            scene.anims.create({
                key,
                frames: scene.anims.generateFrameNumbers('ineu_' + dir, { start: 0, end: 3 }),
                frameRate: SPRITE_INEU.fps,
                repeat: -1
            });
        });
    },

    netejarPNG(scene, item) {
        const font = scene.textures.get(item.key).getSourceImage();
        const escala = Math.min(1, (item.amplada * RES) / font.width);
        const w = Math.round(font.width * escala);
        const h = Math.round(font.height * escala);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(font, 0, 0, w, h);
        try {
            const img = ctx.getImageData(0, 0, w, h);
            treureFonsBlanc(img.data, w, h);
            ctx.putImageData(img, 0, 0);
        } catch (e) {
            Grafics.pixelsBloquejats = true; // es veurà amb fons blanc, però el joc continua
        }
        scene.textures.remove(item.key);
        scene.textures.addCanvas(item.key, canvas);
        // Escala que cal aplicar a la imatge per mostrar-la a "amplada" píxels de joc
        scene.textures.get(item.key).customData.escala = item.amplada / w;
    },

    crearProvisional(scene, item) {
        const w = item.amplada * RES;
        const canvas = document.createElement('canvas');
        if (item.provisional) {
            item.provisional(canvas, w);
        } else {
            canvas.width = w; canvas.height = w;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#a07050';
            ctx.fillRect(0, 0, w, w);
        }
        if (scene.textures.exists(item.key)) scene.textures.remove(item.key);
        scene.textures.addCanvas(item.key, canvas);
        scene.textures.get(item.key).customData.escala = 1 / RES;
    },

    // Textures que sempre es generen per codi (terra, boira, etc.)
    texturesGenerades(scene) {
        const crea = (key, w, h, dibuix) => {
            const canvas = document.createElement('canvas');
            canvas.width = w * RES; canvas.height = h * RES;
            const ctx = canvas.getContext('2d');
            ctx.scale(RES, RES);
            dibuix(ctx, w, h);
            if (scene.textures.exists(key)) scene.textures.remove(key);
            scene.textures.addCanvas(key, canvas);
            scene.textures.get(key).customData.escala = 1 / RES;
        };

        crea('herba', 64, 64, (ctx, w, h) => soroll(ctx, w, h, '#5d8f3f', ['#68a046', '#527f37', '#73a84d'], 90, 2, 3));
        crea('llamborda', 64, 64, (ctx, w, h) => {
            ctx.fillStyle = '#b9a588'; ctx.fillRect(0, 0, w, h);
            ctx.strokeStyle = '#9a8668'; ctx.lineWidth = 1.5;
            for (let fila = 0; fila < 4; fila++) {
                const y = fila * 16, desp = (fila % 2) * 12;
                for (let x = -24; x < w + 24; x += 24) {
                    ctx.fillStyle = ['#c3af90', '#b5a083', '#bfaa8b'][(x / 24 + fila + 3) % 3 | 0];
                    ctx.fillRect(x + desp + 1, y + 1, 22, 14);
                    ctx.strokeRect(x + desp + 1, y + 1, 22, 14);
                }
            }
        });
        crea('cami', 64, 64, (ctx, w, h) => soroll(ctx, w, h, '#b89b6d', ['#a88b5d', '#c4a97c', '#9e8255'], 70, 1.5, 3));
        crea('rajola', 64, 64, (ctx, w, h) => {
            ctx.fillStyle = '#4a4038'; ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#5a4e44'; ctx.fillRect(1, 1, 30, 30); ctx.fillRect(33, 33, 30, 30);
            ctx.fillStyle = '#524740'; ctx.fillRect(33, 1, 30, 30); ctx.fillRect(1, 33, 30, 30);
        });
        crea('boira', 64, 64, (ctx, w, h) => {
            const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
            g.addColorStop(0, 'rgba(70,35,100,0.9)');
            g.addColorStop(0.5, 'rgba(50,25,80,0.45)');
            g.addColorStop(1, 'rgba(30,15,50,0)');
            ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
        });
        crea('ombra', 64, 24, (ctx, w, h) => {
            ctx.fillStyle = 'rgba(0,0,0,0.28)';
            ctx.beginPath(); ctx.ellipse(32, 12, 30, 10, 0, 0, Math.PI * 2); ctx.fill();
        });
        crea('reixa', 48, 28, (ctx, w, h) => {
            ctx.fillStyle = '#2b2622'; ctx.fillRect(0, 0, w, h);
            ctx.strokeStyle = '#6b625a'; ctx.lineWidth = 3;
            ctx.strokeRect(1.5, 1.5, w - 3, h - 3);
            for (let x = 8; x < w; x += 8) { ctx.beginPath(); ctx.moveTo(x, 2); ctx.lineTo(x, h - 2); ctx.stroke(); }
        });
        crea('cartell', 56, 64, (ctx, w, h) => {
            ctx.fillStyle = '#5a3a1e'; ctx.fillRect(25, 26, 6, 38);
            ctx.fillStyle = '#9c6b3c'; ctx.strokeStyle = '#3d2610'; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.roundRect(3, 4, 50, 28, 4); ctx.fill(); ctx.stroke();
            ctx.strokeStyle = '#6e4622'; ctx.lineWidth = 1.5;
            for (let y = 12; y < 30; y += 7) { ctx.beginPath(); ctx.moveTo(10, y); ctx.lineTo(46, y); ctx.stroke(); }
        });
        crea('banc', 140, 34, (ctx, w, h) => {
            ctx.fillStyle = '#5b3a20'; ctx.fillRect(0, 0, w, 12);
            ctx.fillStyle = '#7a5030'; ctx.fillRect(0, 12, w, 14);
            ctx.fillStyle = '#3e2714'; ctx.fillRect(4, 26, 8, 8); ctx.fillRect(w - 12, 26, 8, 8);
        });
        crea('reclinatori', 60, 34, (ctx, w, h) => {
            ctx.fillStyle = '#7a1f2a'; ctx.fillRect(4, 18, 52, 12);
            ctx.fillStyle = '#5b3a20'; ctx.fillRect(0, 0, w, 16);
            ctx.fillStyle = '#d4af37'; ctx.fillRect(26, 4, 8, 8);
        });
        crea('orgue', 120, 150, (ctx, w, h) => {
            ctx.fillStyle = '#4a2c16'; ctx.fillRect(0, 60, w, 90);
            for (let i = 0; i < 9; i++) {
                const ph = 50 + Math.abs(4 - i) * -8 + 40;
                ctx.fillStyle = '#c9b48a'; ctx.fillRect(6 + i * 12, 70 - ph + 40, 9, ph);
                ctx.fillStyle = '#8e7a52'; ctx.fillRect(6 + i * 12 + 6, 70 - ph + 40, 3, ph);
            }
            ctx.fillStyle = '#eee'; ctx.fillRect(10, 112, 100, 10);
        });
    }
};

// ---------- Neteja del fons blanc ----------
// Omple des de les vores tot el blanc connectat i el fa transparent. Els blancs interiors (ulls...) es conserven.
function treureFonsBlanc(px, w, h) {
    const esFons = i => {
        const r = px[i], g = px[i + 1], b = px[i + 2];
        const mn = Math.min(r, g, b), mx = Math.max(r, g, b);
        return mn >= 228 && mx - mn < 28;
    };
    const tret = new Uint8Array(w * h);
    const pila = [];
    const prova = (x, y) => {
        const p = y * w + x;
        if (!tret[p] && esFons(p * 4)) { tret[p] = 1; pila.push(p); }
    };
    for (let x = 0; x < w; x++) { prova(x, 0); prova(x, h - 1); }
    for (let y = 0; y < h; y++) { prova(0, y); prova(w - 1, y); }
    while (pila.length) {
        const p = pila.pop(), x = p % w, y = (p / w) | 0;
        if (x > 0) prova(x - 1, y);
        if (x < w - 1) prova(x + 1, y);
        if (y > 0) prova(x, y - 1);
        if (y < h - 1) prova(x, y + 1);
    }
    for (let p = 0; p < w * h; p++) {
        if (tret[p]) { px[p * 4 + 3] = 0; continue; }
        // Suavitza la vora: píxels clars que toquen el fons es tornen semitransparents
        const x = p % w, y = (p / w) | 0;
        const veiTret = (x > 0 && tret[p - 1]) || (x < w - 1 && tret[p + 1]) || (y > 0 && tret[p - w]) || (y < h - 1 && tret[p + w]);
        if (veiTret) {
            const i = p * 4, l = Math.min(px[i], px[i + 1], px[i + 2]);
            if (l > 170) px[i + 3] = Math.max(0, Math.min(255, ((255 - l) / 85) * 255));
        }
    }
}

// ---------- Dibuixos provisionals ----------
function soroll(ctx, w, h, fons, colors, n, rmin, rmax) {
    ctx.fillStyle = fons; ctx.fillRect(0, 0, w, h);
    let llavor = 7;
    const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
    for (let i = 0; i < n; i++) {
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.ellipse(rnd() * w, rnd() * h, rmin + rnd() * (rmax - rmin), rmin * 0.7, rnd() * 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

function dibuixarMonjo(canvas, w, o) {
    const h = Math.round(w * 4 / 3);
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    const s = w / 96;
    ctx.scale(s, s);
    ctx.lineWidth = 3; ctx.strokeStyle = '#120c08'; ctx.lineJoin = 'round';
    const alt = o.alt || 1;
    const capY = 128 - 108 * alt;
    // Hàbit
    ctx.fillStyle = o.habit;
    ctx.beginPath();
    ctx.moveTo(48, capY + 26); ctx.lineTo(70, capY + 40); ctx.lineTo(78, 122); ctx.lineTo(18, 122); ctx.lineTo(26, capY + 40);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // Cordó
    ctx.strokeStyle = '#c9b48a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(28, capY + 66); ctx.lineTo(68, capY + 66); ctx.stroke();
    ctx.strokeStyle = '#120c08';
    // Peus
    ctx.fillStyle = '#5b3a20';
    ctx.fillRect(30, 120, 12, 6); ctx.fillRect(54, 120, 12, 6);
    // Cap
    ctx.fillStyle = '#e8b48a';
    ctx.beginPath(); ctx.arc(48, capY + 14, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = o.cabell;
    ctx.beginPath(); ctx.arc(48, capY + 10, 15, Math.PI * 1.05, Math.PI * 1.95); ctx.fill();
    // Ulls
    ctx.fillStyle = '#120c08';
    ctx.fillRect(41, capY + 14, 3, 4); ctx.fillRect(52, capY + 14, 3, 4);
    if (o.ulleres) {
        ctx.lineWidth = 2;
        ctx.strokeRect(37, capY + 11, 10, 9); ctx.strokeRect(49, capY + 11, 10, 9);
        ctx.beginPath(); ctx.moveTo(47, capY + 15); ctx.lineTo(49, capY + 15); ctx.stroke();
    }
    if (o.pilota) {
        ctx.lineWidth = 2;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(76, capY + 70, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#a50044'; ctx.fillRect(70, capY + 66, 5, 8);
        ctx.fillStyle = '#004d98'; ctx.fillRect(77, capY + 66, 5, 8);
    }
    if (o.llibre) {
        ctx.fillStyle = '#7a1f2a'; ctx.lineWidth = 2;
        ctx.fillRect(34, capY + 46, 28, 18); ctx.strokeRect(34, capY + 46, 28, 18);
        ctx.fillStyle = '#f2e6c8'; ctx.fillRect(36, capY + 48, 24, 3);
    }
}

function dibuixarEdifici(canvas, w, h, paret, teulada, nom) {
    canvas.width = w; canvas.height = Math.round(h);
    const ctx = canvas.getContext('2d');
    const tH = h * 0.22;
    ctx.fillStyle = paret; ctx.strokeStyle = '#3a2818'; ctx.lineWidth = 6;
    ctx.fillRect(10, tH, w - 20, h - tH - 10); ctx.strokeRect(10, tH, w - 20, h - tH - 10);
    ctx.fillStyle = teulada;
    ctx.beginPath(); ctx.moveTo(0, tH + 10); ctx.lineTo(w * 0.12, 6); ctx.lineTo(w * 0.88, 6); ctx.lineTo(w, tH + 10); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#2c3a4a';
    for (let x = w * 0.12; x < w * 0.88; x += w * 0.14) {
        ctx.fillRect(x, tH + h * 0.12, w * 0.05, h * 0.12);
        ctx.fillRect(x, tH + h * 0.36, w * 0.05, h * 0.12);
    }
    ctx.fillStyle = '#4a2c16';
    ctx.fillRect(w / 2 - w * 0.05, h - 10 - h * 0.24, w * 0.1, h * 0.24);
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(w / 2 - w * 0.2, tH - h * 0.13, w * 0.4, h * 0.1);
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `bold ${Math.round(h * 0.06)}px Georgia`;
    ctx.fillText(nom + ' (provisional)', w / 2, tH - h * 0.08);
}

function dibuixarCreu(canvas, w) {
    const h = w * 2.4; canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#a89a86'; ctx.strokeStyle = '#3a3026'; ctx.lineWidth = w * 0.05;
    ctx.fillRect(w * 0.15, h * 0.8, w * 0.7, h * 0.18); ctx.strokeRect(w * 0.15, h * 0.8, w * 0.7, h * 0.18);
    ctx.fillStyle = '#cfc3ae';
    ctx.fillRect(w * 0.42, h * 0.08, w * 0.16, h * 0.74); ctx.strokeRect(w * 0.42, h * 0.08, w * 0.16, h * 0.74);
    ctx.fillRect(w * 0.18, h * 0.22, w * 0.64, w * 0.16); ctx.strokeRect(w * 0.18, h * 0.22, w * 0.64, w * 0.16);
}

function dibuixarBassadoria(canvas, w) {
    const h = w * 0.55; canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#9c8e7a'; ctx.strokeStyle = '#3a3026'; ctx.lineWidth = w * 0.015;
    ctx.beginPath(); ctx.ellipse(w / 2, h / 2, w * 0.48, h * 0.45, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#4b5a4c';
    ctx.beginPath(); ctx.ellipse(w / 2, h / 2, w * 0.40, h * 0.34, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(80,40,110,0.45)';
    ctx.beginPath(); ctx.ellipse(w * 0.45, h * 0.48, w * 0.26, h * 0.18, 0.2, 0, Math.PI * 2); ctx.fill();
}

function dibuixarFont(canvas, w) {
    const h = w * 1.1; canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#3a3026'; ctx.lineWidth = w * 0.03;
    ctx.fillStyle = '#b8aa94';
    ctx.fillRect(w * 0.25, h * 0.05, w * 0.5, h * 0.6); ctx.strokeRect(w * 0.25, h * 0.05, w * 0.5, h * 0.6);
    ctx.fillStyle = '#6a8fa8';
    ctx.fillRect(w * 0.47, h * 0.4, w * 0.06, h * 0.35);
    ctx.fillStyle = '#9c8e7a';
    ctx.beginPath(); ctx.ellipse(w / 2, h * 0.82, w * 0.46, h * 0.14, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#6a8fa8';
    ctx.beginPath(); ctx.ellipse(w / 2, h * 0.82, w * 0.36, h * 0.08, 0, 0, Math.PI * 2); ctx.fill();
}

function dibuixarHomeRaim(canvas, w) {
    const h = w * 2.2; canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#3a3026'; ctx.lineWidth = w * 0.04;
    ctx.fillStyle = '#a39888';
    ctx.fillRect(w * 0.1, h * 0.82, w * 0.8, h * 0.16); ctx.strokeRect(w * 0.1, h * 0.82, w * 0.8, h * 0.16);
    ctx.fillStyle = '#bdb2a0';
    ctx.fillRect(w * 0.28, h * 0.25, w * 0.44, h * 0.58); ctx.strokeRect(w * 0.28, h * 0.25, w * 0.44, h * 0.58);
    // Cap del revés: es veu el clatell (sense cara)
    ctx.beginPath(); ctx.arc(w / 2, h * 0.17, w * 0.17, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#8f8574';
    ctx.beginPath(); ctx.arc(w / 2, h * 0.15, w * 0.17, Math.PI, 0); ctx.fill();
    // Carràs de raïm
    ctx.fillStyle = '#5b2a6e';
    for (let i = 0; i < 6; i++) {
        const fx = w / 2 + ((i % 3) - 1) * w * 0.09, fy = h * 0.44 + Math.floor(i / 3) * w * 0.1;
        ctx.beginPath(); ctx.arc(fx, fy, w * 0.06, 0, Math.PI * 2); ctx.fill();
    }
    ctx.beginPath(); ctx.arc(w / 2, h * 0.44 + w * 0.2, w * 0.06, 0, Math.PI * 2); ctx.fill();
}

function dibuixarArbre(canvas, w) {
    const h = w * 1.15; canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#5a3a1e'; ctx.strokeStyle = '#1f140a'; ctx.lineWidth = w * 0.02;
    ctx.fillRect(w * 0.44, h * 0.55, w * 0.12, h * 0.42); ctx.strokeRect(w * 0.44, h * 0.55, w * 0.12, h * 0.42);
    const copes = [[0.5, 0.32, 0.3], [0.3, 0.45, 0.22], [0.7, 0.45, 0.22], [0.5, 0.5, 0.24]];
    ctx.fillStyle = '#3f7a34';
    copes.forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(w * x, h * y, w * r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    ctx.fillStyle = '#4f9142';
    copes.forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(w * x - w * 0.04, h * y - w * 0.05, w * r * 0.6, 0, Math.PI * 2); ctx.fill(); });
}

function dibuixarXiprer(canvas, w) {
    const h = w * 3.2; canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#5a3a1e'; ctx.fillRect(w * 0.42, h * 0.9, w * 0.16, h * 0.1);
    ctx.fillStyle = '#2f5a2a'; ctx.strokeStyle = '#13240f'; ctx.lineWidth = w * 0.04;
    ctx.beginPath(); ctx.ellipse(w / 2, h * 0.5, w * 0.45, h * 0.42, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#3d7034';
    ctx.beginPath(); ctx.ellipse(w * 0.42, h * 0.45, w * 0.2, h * 0.3, 0, 0, Math.PI * 2); ctx.fill();
}

function dibuixarRetaule(canvas, w) {
    const h = w * 0.75; canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#8a6a1c'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#d4af37';
    for (let i = 0; i < 5; i++) ctx.fillRect(w * (0.04 + i * 0.2), h * 0.05, w * 0.12, h * 0.9);
    ctx.fillStyle = '#3a2a10';
    for (let i = 0; i < 4; i++) ctx.fillRect(w * (0.17 + i * 0.2), h * 0.25, w * 0.06, h * 0.3);
    ctx.fillStyle = '#f2e6c8';
    ctx.beginPath(); ctx.arc(w / 2, h * 0.38, w * 0.05, 0, Math.PI * 2); ctx.fill();
}
