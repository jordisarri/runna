/**
 * ZONA BASE: tot el que comparteixen les pantalles del joc.
 * Cada zona hereta d'aquesta classe i implementa construir() amb els seus objectes,
 * personatges, punts d'interacció i sortides.
 *
 *   class ZonaX extends ZonaBase {
 *       constructor() { super('ZonaX', { nom: 'Nom visible', amplada: 1600, alcada: 1200,
 *                                        entrades: { inici: { x, y, dir: 'avall' } } }); }
 *       construir() { ... }
 *   }
 */
const ZOOM_CAMERA = 1;
const BANDA_SUD = 120;   // franja de baix (vora sud, sortides) que es desplaça cap avall en ampliar la zona
const VELOCITAT_INEU = 230;
const TOPE_Y = 100;   // els peus de l'Ineu no passen d'aquí amunt: sempre se li veu el cos (la càmera s'atura a y=0)

class ZonaBase extends Phaser.Scene {
    constructor(key, config) {
        super(key);
        this.config = config;
    }

    init(data) {
        this.dadesEntrada = data || {};
        this.canviant = false;
    }

    create() {
        const c = this.config;
        Estat.dades.zona = this.scene.key;
        Estat.posaFlag('visitada_' + this.scene.key); // el mapa només mostra el que s'ha visitat

        this.physics.world.setBounds(0, TOPE_Y - 30, c.amplada, c.alcada - TOPE_Y + 30);   // la caixa dels peus fa 30 d'alt
        this.obstacles = this.physics.add.staticGroup();
        this.interactius = [];
        this.llocsFlauta = [];
        this.sortides = [];
        this.enemics = [];
        this.esbarzers = [];
        this.tallables = [];
        this.caient = false;
        this.forcat = null;
        this.invulnerableFins = 0;
        this.cintaGastada = false;

        this.sols = [];
        this.camins = [];     // rectangles de camí de terra: es fusionen i es dibuixen amb vores suaus (construirCamins)
        this.extraSud = 0;
        this.yTall = Infinity;
        this.preparaTweens();
        this.construir();
        this.ampliarSud();
        this.construirCamins();
        this.crearIneu();

        const cam = this.cameras.main;
        cam.setViewport(0, ALT_HUD, AMPLE, ALT - ALT_HUD);   // la franja de dalt és per al HUD: no s'hi dibuixa escenari
        cam.setZoom(ZOOM_CAMERA);
        // Si el món és més petit que la pantalla (interiors), es centra en lloc de quedar enganxat a una vora
        const vw = AMPLE / ZOOM_CAMERA, vh = (ALT - ALT_HUD) / ZOOM_CAMERA, alcadaMon = c.alcada + this.extraSud;
        const bx = Math.max(0, (vw - c.amplada) / 2), by = Math.max(0, (vh - alcadaMon) / 2);
        cam.setBounds(-bx, -by, c.amplada + 2 * bx, alcadaMon + 2 * by);
        cam.startFollow(this.ineu, true, 0.12, 0.12);
        cam.setBackgroundColor(c.colorFons || '#2d4a22');
        cam.fadeIn(350, 0, 0, 0);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.tecles = this.input.keyboard.addKeys('W,A,S,D,E,SPACE,ENTER,J,K,M,F,SHIFT');

        // Indicador "!" sobre el punt interactiu més proper
        this.indicador = this.add.text(0, 0, '!', estilText(28, '#ffd34d', { stroke: '#000', strokeThickness: 5, fontStyle: 'bold' }))
            .setOrigin(0.5, 1).setDepth(99999).setVisible(false);
        this.tweens.add({ targets: this.indicador, scale: 1.2, yoyo: true, repeat: -1, duration: 350 });

        const ui = this.ui();
        ui.actualitzarHUD();
        ui.mostrarZona(c.nom);

        // Autodesat en entrar a una zona
        this.guardarPosicio();
        Estat.desar();

        if (this.enEntrar) this.enEntrar();
        if (Estat.caigut) {
            Estat.caigut = false;
            this.time.delayedCall(600, () => ui.obrirDialeg({ pagines: [
                { qui: '', text: 'Tot es torna fosc... i després, càlid.' },
                { qui: 'Pare Jordi', text: 'Ineu! Que et trobo a terra! Respira, fill. Has de tenir més cura. Ja estàs bé?' }
            ] }));
        }
    }

    ui() { return this.scene.get('UI'); }

    // ---------------- Construcció ----------------
    // Fons repetit (herba, llambordes...) en una àrea
    terra(key, x, y, w, h, profunditat = -1000) {
        // Els camins (i els replans) de l'exterior són sempre de terra, amb vora suau i corbes
        if ((key === 'cami' || key === 'pedra') && profunditat === -1000 && !this.esInterior()) {
            const r = { x, y, w, h, alfa: 1 };
            this.camins.push(r);
            const stub = { setAlpha: a => { r.alfa = a; return stub; }, setTint: () => stub };
            return stub;
        }
        const t = this.add.tileSprite(x, y, w, h, key).setOrigin(0).setTileScale(1 / RES).setDepth(profunditat);
        this.sols.push(t);
        return t;
    }

    // Interior = sala fosca (colorFons molt fosc): es dibuixa centrada i no s'allarga
    esInterior() {
        const h = (this.config.colorFons || '').replace('#', '');
        if (h.length !== 6) return false;
        return [0, 2, 4].reduce((t, i) => t + parseInt(h.slice(i, i + 2), 16), 0) < 70;
    }

    // y d'una posició dissenyada abans d'ampliar la zona -> y real
    mapY(y) { return y >= this.yTall ? y + this.extraSud : y; }

    // Els tweens amb un 'y' fix (flotar, balancejar-se) s'han de moure amb l'objecte quan es desplaça
    preparaTweens() {
        const t = this.tweens;
        if (!t.afegirOriginal) t.afegirOriginal = t.add;
        t.add = cfg => {
            if (cfg && typeof cfg.y === 'number') { const v = cfg.y; cfg = Object.assign({}, cfg, { y: () => this.mapY(v) }); }
            return t.afegirOriginal.call(t, cfg);
        };
    }

    // La pantalla vertical és més alta que la majoria de zones. S'afegeix terra al sud: tot el que
    // és a la franja de baix (vora sud, sortides) baixa, i el terra que la travessa s'allarga.
    ampliarSud() {
        const c = this.config;
        const extra = this.esInterior() ? 0 : Math.ceil((ALT - ALT_HUD) / ZOOM_CAMERA) - c.alcada;
        if (extra <= 0) return;
        const tall = c.alcada - BANDA_SUD;
        this.extraSud = extra;
        this.yTall = tall;

        const sols = new Set(this.sols);
        this.sols.forEach(t => {
            if (t.y >= tall) t.y += extra;
            else if (t.y + t.height > tall) t.setSize(t.width, t.height + extra);
        });
        this.camins.forEach(r => {
            if (r.y >= tall) r.y += extra;
            else if (r.y + r.h > tall) r.h += extra;
        });
        this.children.list.forEach(go => {
            if (sols.has(go) || go.scrollFactorY === 0 || go.type === 'Graphics' || go.y < tall) return;
            go.y += extra;
            if (go.depth >= 0 && go.depth < 50000) go.setDepth(go.depth + extra);
            if (go.body && go.body.updateFromGameObject && go.body.physicsType === Phaser.Physics.Arcade.STATIC_BODY) go.body.updateFromGameObject();
        });
        this.interactius.concat(this.esbarzers, this.tallables).forEach(o => { if (o.y >= tall) o.y += extra; });
        this.sortides.forEach(s => {
            if (s.r.y >= tall) s.r.y += extra;
            else if (s.r.bottom >= c.alcada - 20) s.r.height += extra;
        });
        this.physics.world.setBounds(0, TOPE_Y - 30, c.amplada, c.alcada + extra - TOPE_Y + 30);

        // Les vores laterals continuen per la franja nova
        if (this.textures.exists('arbre')) {
            for (let y = tall + 60; y < tall + extra; y += 90) {
                this.posar('arbre', 24, y);
                this.posar('arbre', c.amplada - 24, y);
            }
        }
    }

    // Camins de terra: tots els rectangles es fusionen en un sol mapa de baixa resolució que s'enfosqueix (desenfocament)
    // i es talla amb una rampa suau. Així les vores es difuminen cap a l'herba, les cantonades s'arrodoneixen
    // i els encreuaments fan corbes en lloc d'angles rectes.
    construirCamins() {
        const rs = this.camins.filter(r => r.alfa > 0);
        if (!rs.length || !this.textures.exists('cami')) return;
        const W = this.config.amplada, H = this.config.alcada + this.extraSud;
        const MG = 64, CEL = 4, RAD = 5;
        const gw = Math.ceil((W + 2 * MG) / CEL), gh = Math.ceil((H + 2 * MG) / CEL);
        let a = new Float32Array(gw * gh), b = new Float32Array(gw * gh);

        rs.forEach(r => {
            // Un camí que arriba a la vora del món continua més enllà, perquè no es difumini allà
            const x0 = r.x <= 2 ? -MG : r.x, y0 = r.y <= 2 ? -MG : r.y;
            const x1 = r.x + r.w >= W - 2 ? W + MG : r.x + r.w, y1 = r.y + r.h >= H - 2 ? H + MG : r.y + r.h;
            for (let j = 0; j < gh; j++) {
                const wy = (j + 0.5) * CEL - MG;
                if (wy < y0 || wy > y1) continue;
                for (let i = 0; i < gw; i++) {
                    const wx = (i + 0.5) * CEL - MG;
                    if (wx >= x0 && wx <= x1 && a[j * gw + i] < r.alfa) a[j * gw + i] = r.alfa;
                }
            }
        });

        // Desenfocament de caixa separable (quatre passades ~ gaussiana)
        const desenfoca = (s, d, horitz) => {
            const n = horitz ? gw : gh, m = horitz ? gh : gw, pas = horitz ? 1 : gw, sal = horitz ? gw : 1;
            for (let l = 0; l < m; l++) {
                const base = l * sal;
                let suma = 0;
                for (let k = -RAD; k <= RAD; k++) suma += s[base + Math.min(n - 1, Math.max(0, k)) * pas];
                for (let k = 0; k < n; k++) {
                    d[base + k * pas] = suma / (2 * RAD + 1);
                    suma += s[base + Math.min(n - 1, k + RAD + 1) * pas] - s[base + Math.max(0, k - RAD) * pas];
                }
            }
        };
        desenfoca(a, b, true); desenfoca(b, a, false); desenfoca(a, b, true); desenfoca(b, a, false);

        // Soroll de valors: fa que la vora del camí ondulegi una mica
        const hash = (x, y) => { const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); };
        const soroll = (x, y) => {
            const xi = Math.floor(x), yi = Math.floor(y), u = x - xi, v = y - yi;
            const su = u * u * (3 - 2 * u), sv = v * v * (3 - 2 * v);
            const f = (p, q, t) => p + (q - p) * t;
            return f(f(hash(xi, yi), hash(xi + 1, yi), su), f(hash(xi, yi + 1), hash(xi + 1, yi + 1), su), sv);
        };

        const mascara = document.createElement('canvas');
        mascara.width = gw; mascara.height = gh;
        const mctx = mascara.getContext('2d');
        const px = mctx.createImageData(gw, gh);
        for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
            const k = j * gw + i;
            const ona = (soroll(i / 7, j / 7) - 0.5) * 0.30 + (soroll(i / 2.5 + 40, j / 2.5) - 0.5) * 0.12;
            const t = Math.min(1, Math.max(0, (a[k] + ona - 0.28) / 0.44));
            px.data[k * 4] = px.data[k * 4 + 1] = px.data[k * 4 + 2] = 255;
            px.data[k * 4 + 3] = Math.round(t * t * (3 - 2 * t) * 255);
        }
        mctx.putImageData(px, 0, 0);

        // Es talla en blocs perquè cap textura passi del límit de la targeta gràfica
        const peca = this.textures.get('cami').getSourceImage(), LIM = 2048;
        let n = 0;
        for (let cy = 0; cy < H; cy += LIM) for (let cx = 0; cx < W; cx += LIM) {
            const cw = Math.min(LIM, W - cx), ch = Math.min(LIM, H - cy);
            const cv = document.createElement('canvas');
            cv.width = cw; cv.height = ch;
            const ctx = cv.getContext('2d');
            for (let ty = Math.floor(cy / 64) * 64; ty < cy + ch; ty += 64) {
                for (let tx = Math.floor(cx / 64) * 64; tx < cx + cw; tx += 64) ctx.drawImage(peca, tx - cx, ty - cy, 64, 64);
            }
            ctx.globalCompositeOperation = 'destination-in';
            ctx.imageSmoothingEnabled = true;
            ctx.drawImage(mascara, 0, 0, gw, gh, -MG - cx, -MG - cy, gw * CEL, gh * CEL);
            const clau = 'camins_' + this.scene.key + '_' + (n++);
            if (this.textures.exists(clau)) this.textures.remove(clau);
            this.textures.addCanvas(clau, cv);
            this.add.image(cx, cy, clau).setOrigin(0).setDepth(-1040);
        }
    }

    // Imatge del catàleg amb els peus a (x, y). col = { w, h } caixa de col·lisió a la base.
    // fonsY: línia de profunditat (per defecte y); l'Ineu es dibuixa davant si és més avall.
    posar(key, x, y, opts = {}) {
        const tex = this.textures.get(key);
        const escala = (tex.customData && tex.customData.escala) || 1 / RES;
        const img = this.add.image(x, y, key).setOrigin(0.5, 1).setScale(escala * (opts.escala || 1));
        img.setDepth(opts.fonsY !== undefined ? opts.fonsY : y);
        if (opts.col) this.colisio(x + (opts.col.dx || 0), y - opts.col.h / 2 + (opts.col.dy || 0), opts.col.w, opts.col.h);
        return img;
    }

    // Rectangle invisible que bloqueja el pas (centrat a x, y)
    colisio(x, y, w, h) {
        const z = this.add.zone(x, y, w, h);
        this.physics.add.existing(z, true);
        this.obstacles.add(z);
        if (Joc.debug) this.add.rectangle(x, y, w, h).setStrokeStyle(2, 0xff0000).setDepth(99998);
        return z;
    }

    // Punt on es pot prémer ESPAI. dialeg = funció de DIALEGS o funció pròpia que retorna un diàleg.
    interactiu(x, y, radi, dialeg, opts = {}) {
        const punt = { x, y, radi, dialeg, altura: opts.altura || 60, enTancar: opts.enTancar, actiu: opts.actiu };
        this.interactius.push(punt);
        return punt;
    }

    // Personatge quiet amb diàleg
    npc(key, x, y, dialeg, opts = {}) {
        const img = this.posar(key, x, y, { col: { w: 40, h: 18 } });
        this.add.image(x, y, 'ombra').setScale(0.42).setDepth(-500);
        if (opts.flipX) img.setFlipX(true);
        // Respiració suau perquè sembli viu
        this.tweens.add({ targets: img, scaleY: img.scaleY * 1.02, yoyo: true, repeat: -1, duration: 1100 + Math.random() * 400 });
        img.punt = this.interactiu(x, y - 10, 85, dialeg, { altura: img.displayHeight + 6 });
        return img;
    }

    // Llista d'arbres [[x, y], ...]
    arbres(llista, key = 'arbre') {
        llista.forEach(([x, y]) => this.posar(key, x, y, { col: { w: 34, h: 16 } }));
    }

    // Franja d'arbres que tanca un costat de la pantalla (per no deixar sortir on no hi ha res)
    muralla(x1, y1, x2, y2, pas = 90, key = 'arbre') {
        const n = Math.max(1, Math.round(Math.hypot(x2 - x1, y2 - y1) / pas));
        for (let i = 0; i <= n; i++) {
            this.posar(key, x1 + (x2 - x1) * i / n, y1 + (y2 - y1) * i / n, { col: { w: 60, h: 30 } });
        }
    }

    // Edifici amb porta: dues col·lisions als costats i un forat al mig per entrar (sortida).
    // x, y = peus del centre; ample = amplada de col·lisió total; porta = amplada del forat
    edifici(key, x, y, ample, porta, desti, entrada, opts = {}) {
        const img = this.posar(key, x, y, { fonsY: y - 20 });
        const alt = opts.alt || 70;
        const costat = (ample - porta) / 2;
        this.colisio(x - porta / 2 - costat / 2, y - alt / 2, costat, alt);
        this.colisio(x + porta / 2 + costat / 2, y - alt / 2, costat, alt);
        this.colisio(x, y - alt - 10, porta, 20);   // dintell
        if (desti) this.sortida(x - porta / 2, y - alt + 10, porta, alt - 4, desti, entrada);
        this.blocDarrere(x, ample, y - alt - 20, Math.max(0, y - img.displayHeight));
        return img;
    }

    // Bloc invisible darrere d'un edifici: no s'hi ha de poder passar per darrere (amb la silueta fantasma, l'Ineu es veuria a través de la façana)
    blocDarrere(x, ample, baix, dalt = 0) {
        if (baix - dalt > 10) this.colisio(x, (dalt + baix) / 2, ample, baix - dalt);
    }

    cartell(x, y, dialeg) {
        this.posar('cartell', x, y, { col: { w: 20, h: 10 } });
        return this.interactiu(x, y, 70, dialeg, { altura: 70 });
    }

    // Rectangle de sortida: quan l'Ineu el toca, es canvia a la zona "desti" i entra per "entrada"
    sortida(x, y, w, h, desti, entrada) {
        // Una sortida enganxada a la vora superior s'allarga fins on l'Ineu pot arribar (TOPE_Y)
        if (y < TOPE_Y - 10) h = Math.max(h, TOPE_Y - 10 - y);
        const r = new Phaser.Geom.Rectangle(x, y, w, h);
        this.sortides.push({ r, desti, entrada });
        this.marcarSortida(r);
        if (Joc.debug) this.add.rectangle(x, y, w, h).setOrigin(0).setStrokeStyle(2, 0x00ffff).setDepth(99998);
    }

    // Llum pulsant i fletxa que indiquen on hi ha una sortida (vora de la pantalla o porta)
    marcarSortida(r) {
        const c = this.config, vora = 20;
        let dir = 'amunt', cx = r.centerX, cy = r.centerY, ample = r.width, alt = r.height;
        if (r.x <= vora) { dir = 'esquerra'; cx = 40; ample = 70; alt = Math.max(r.height, 80); }
        else if (r.right >= c.amplada - vora) { dir = 'dreta'; cx = c.amplada - 40; ample = 70; alt = Math.max(r.height, 80); }
        else if (r.bottom >= c.alcada - vora) { dir = 'avall'; cy = c.alcada - 40; alt = 70; ample = Math.max(r.width, 80); }
        else if (r.y < TOPE_Y) { dir = 'amunt'; cy = TOPE_Y - 50; alt = 70; ample = Math.max(r.width, 80); }
        else { cy = r.y + r.height * 0.35; ample = Math.max(r.width, 60); alt = 60; }   // porta d'un edifici
        const llum = this.add.ellipse(cx, cy, ample, alt, 0xffe08a, 0.28).setDepth(-940);
        this.tweens.add({ targets: llum, alpha: 0.08, scaleX: 1.12, scaleY: 1.12, yoyo: true, repeat: -1, duration: 900, ease: 'Sine.easeInOut' });
        const fletxa = { amunt: '▲', avall: '▼', esquerra: '◀', dreta: '▶' }[dir];
        const dx = { esquerra: 26, dreta: -26 }[dir] || 0, dy = { amunt: 30, avall: -30 }[dir] || -30;
        const t = this.add.text(cx + dx, cy + dy, fletxa, estilText(26, '#ffe08a', { stroke: '#000', strokeThickness: 4 })).setOrigin(0.5).setDepth(86000).setAlpha(0.85);
        const m = { amunt: [0, -8], avall: [0, 8], esquerra: [-8, 0], dreta: [8, 0] }[dir];
        this.tweens.add({ targets: t, x: t.x + m[0], y: t.y + m[1], yoyo: true, repeat: -1, duration: 650, ease: 'Sine.easeInOut' });
    }

    // Emissor de boira fosca
    boira(x, y, ample = 120, alt = 40, quantitat = 1) {
        return this.add.particles(x, y, 'boira', {
            x: { min: -ample / 2, max: ample / 2 },
            y: { min: -alt / 2, max: alt / 2 },
            speedX: { min: -12, max: 12 },
            speedY: { min: -22, max: -6 },
            scale: { start: 0.7, end: 1.8 },
            alpha: { start: 0.55, end: 0 },
            lifespan: { min: 2600, max: 4200 },
            frequency: 260 / quantitat,
            rotate: { min: 0, max: 360 }
        }).setDepth(y + 40);
    }

    // ---------------- Ineu ----------------
    crearIneu() {
        const e = this.config.entrades;
        let pos;
        if (this.dadesEntrada.restaurar && Estat.dades.x !== null) {
            pos = { x: Estat.dades.x, y: Estat.dades.y, dir: 'avall' };
        } else {
            pos = e[this.dadesEntrada.entrada] || e[Object.keys(e)[0]];
            pos = Object.assign({}, pos, { y: this.mapY(pos.y) });
        }

        if (pos.y < TOPE_Y + 40) pos = Object.assign({}, pos, { y: TOPE_Y + 40 });
        this.ombraIneu = this.add.image(pos.x, pos.y, 'ombra').setScale(0.4).setDepth(-500);
        const S = SPRITE_INEU;
        this.ineu = this.physics.add.sprite(pos.x, pos.y, 'ineu_down', S.quiet).setOrigin(0.5, S.peus / S.alt);
        this.ineu.setScale(S.alcada / S.alt);
        // Silueta fantasma: sempre per sobre de tot; on no hi ha res davant, es confon amb l'Ineu,
        // però si un edifici o un arbre el tapa, se'n veu un contorn translúcid.
        this.fantasma = this.add.sprite(pos.x, pos.y, 'ineu_down', S.quiet).setOrigin(0.5, S.peus / S.alt)
            .setScale(S.alcada / S.alt).setDepth(87000);
        // Caixa de col·lisió petita als peus (en píxels de textura)
        this.ineu.body.setSize(72, 30);
        this.ineu.body.setOffset((S.ample - 72) / 2, S.peus - 30);
        this.ineu.setCollideWorldBounds(true);
        this.physics.add.collider(this.ineu, this.obstacles);
        this.direccio = pos.dir || 'avall';
        this.vista8Manual = false; this.vista8 = undefined;
        this.posarDireccio(this.direccio);
    }

    // dir: 'avall' | 'amunt' | 'esquerra' | 'dreta' (per atacar i interactuar)
    // vista8: una de DIRS_INEU (down, southeast...) per dibuixar el sprite en 8 direccions
    posarDireccio(dir, caminant = false, vista8) {
        this.direccio = dir;
        const per4 = { avall: 'down', amunt: 'up', esquerra: 'left', dreta: 'right' };
        if (vista8) this.vista8 = vista8;
        else if (!this.vista8 || !this.vista8Manual) this.vista8 = per4[dir];
        const vista = this.vista8;
        if (caminant) {
            this.ineu.anims.play('caminar_' + vista, true);
        } else {
            this.ineu.anims.stop();
            this.ineu.setTexture('ineu_' + vista, quietIneu(vista));
        }
    }

    // ---------------- Esbarzers negres i foc de la Jaumeta ----------------
    // id: nom únic perquè no tornin a créixer un cop cremats
    esbarzer(x, y, id) {
        if (id && Estat.flag('esb_' + id)) return null;
        const img = this.posar('esbarzer', x, y, { fonsY: y });
        const col = this.colisio(x, y - 13, 80, 26);
        const o = { img, col, x, y, id, viu: true };
        this.esbarzers.push(o);
        return o;
    }

    // Arbust verd que amaga alguna cosa: es poda amb les tisores de l'Isidre (ESPAI). id: perquè quedi tallat per sempre
    arbust(x, y, id, textPista) {
        const o = { x, y, id, viu: !Estat.flag('arb_' + id) };
        if (!o.viu) return o;
        o.img = this.posar('esbarzer', x, y).setTint(0x5a9a44);
        o.col = this.colisio(x, y - 13, 80, 26);
        this.tallables.push(o);
        this.interactiu(x, y + 10, 90, () => Estat.te('tisores')
            ? { pagines: [{ qui: '', text: 'Retalles les branques amb les tisores de l' + String.fromCharCode(39) + 'Isidre: clic, clic, clic.' }] }
            : { pagines: [{ qui: '', text: textPista }] },
            { altura: 70, actiu: () => o.viu, enTancar: () => { if (Estat.te('tisores')) this.tallarArbust(o); } });
        return o;
    }

    tallarArbust(o) {
        if (!o.viu) return;
        o.viu = false;
        Estat.posaFlag('arb_' + o.id);
        this.obstacles.remove(o.col, true, true);
        const p = this.add.particles(o.x, o.y - 30, 'espurna', {
            speed: { min: 40, max: 120 }, lifespan: 700, scale: { start: 0.9, end: 0 },
            tint: [0x5a9a44, 0x8acb5a], quantity: 10, emitting: false
        }).setDepth(99990);
        p.explode(14);
        this.time.delayedCall(900, () => p.destroy());
        this.tweens.add({ targets: o.img, alpha: 0, scaleY: o.img.scaleY * 0.5, duration: 400, onComplete: () => o.img.destroy() });
    }

    // Roca que es pot empènyer (ESPAI) cap a (dx, dy) per descobrir el que hi ha a sota
    pedraMobil(x, y, id, dx, dy, textPista) {
        const mogut = Estat.flag('pedra_' + id);
        const o = { id, mogut, x: x + (mogut ? dx : 0), y: y + (mogut ? dy : 0) };
        o.img = this.posar('roca', o.x, o.y);
        o.col = this.colisio(o.x, o.y - 13, 70, 26);
        if (!mogut) {
            const dialeg = { pagines: [{ qui: '', text: textPista }, { qui: '', text: 'Empenys la roca amb tot el pes del cos. Es mou, rascant la terra.' }] };
            this.interactiu(x, y + 24, 90, dialeg, {
                altura: 70, actiu: () => !o.mogut,
                enTancar: () => {
                    o.mogut = true;
                    Estat.posaFlag('pedra_' + id);
                    this.obstacles.remove(o.col, true, true);
                    this.tweens.add({ targets: o.img, x: x + dx, y: y + dy, duration: 600, onComplete: () => {
                        o.img.setDepth(y + dy);
                        o.col = this.colisio(x + dx, y + dy - 13, 70, 26);
                    } });
                }
            });
        }
        return o;
    }

    destruirEsbarzer(o, foc) {
        if (!o.viu) return;
        o.viu = false;
        if (o.id) Estat.posaFlag('esb_' + o.id);
        this.obstacles.remove(o.col, true, true);
        if (foc) o.img.setTint(0xff8030);
        const p = this.add.particles(o.x, o.y - 30, 'espurna', {
            speed: { min: 30, max: 110 }, lifespan: 700, scale: { start: 0.9, end: 0 },
            tint: foc ? [0xff8030, 0xffd040] : [0xc070ff, 0x6a3a9a], quantity: 10, emitting: false
        }).setDepth(99990);
        p.explode(14);
        this.time.delayedCall(900, () => p.destroy());
        this.tweens.add({ targets: o.img, alpha: 0, scaleY: o.img.scaleY * 0.6, duration: 600, onComplete: () => o.img.destroy() });
    }

    // Petar de dits de la Jaumeta: flama cap on mires; crema esbarzers i fa mal als enemics
    foc() {
        const ara = this.time.now;
        if (this.config.pacifica || ara < (this.focFins || 0) || this.caient) return;
        this.focFins = ara + 1300;
        const d = DIRS[this.direccio] || DIRS.avall;
        const jo = this.ineu.body.center;
        const fx = jo.x + d.x * 64, fy = jo.y + d.y * 64 - 14;
        const flama = this.add.circle(fx, fy, 14, 0xffa030, 0.85).setDepth(99990);
        this.tweens.add({ targets: flama, radius: 52, alpha: 0, duration: 420, onComplete: () => flama.destroy() });
        const p = this.add.particles(fx, fy, 'espurna', {
            speed: { min: 30, max: 120 }, lifespan: 500, scale: { start: 1, end: 0 },
            tint: [0xff8030, 0xffd040, 0xff4010], quantity: 10, emitting: false
        }).setDepth(99991);
        p.explode(16);
        this.time.delayedCall(700, () => p.destroy());
        this.forcat = { vx: -d.x * 60, vy: -d.y * 60, fins: ara + 80 };
        this.enemics.forEach(e => {
            if (e.mort || e.def.practica) return;
            const c = e.spr.body.center;
            if (Phaser.Math.Distance.Between(c.x, c.y, fx, fy) < 64 + e.def.radi) this.colpejar(e, 1, d);
        });
        this.esbarzers.forEach(o => { if (o.viu && Phaser.Math.Distance.Between(o.x, o.y - 20, fx, fy) < 90) this.destruirEsbarzer(o, true); });
        if (this.enFoc) this.enFoc(fx, fy);
    }

    // Amb la Jaumeta, l'acció (un sol toc) crema l'esbarzer que tens a davant en lloc d'atacar
    esbarzerDavant() {
        if (!Estat.te('foc_jaumeta') || Estat.te('runna')) return false;
        const d = DIRS[this.direccio] || DIRS.avall;
        const jo = this.ineu.body.center;
        return this.esbarzers.some(o => o.viu && Phaser.Math.Distance.Between(o.x, o.y - 20, jo.x + d.x * 64, jo.y + d.y * 64) < 130);
    }

    // ---------------- Música ----------------
    // Llocs on una melodia pot fer efecte. Amb la flauta a la mà, l'Ineu hi pot tocar (ESPAI o el medalló de la dreta).
    // pista: cal haver llegit abans la pista del lloc (flag 'flauta_<id>', que posa el diàleg en tancar-se).
    llocFlauta(id, x, y, radi, pista = false) {
        this.llocsFlauta.push({ id, x, y, radi, pista });
    }

    flautaActiva() {
        if (!Estat.te('flauta') || !this.ineu) return false;
        return this.llocsFlauta.some(l => (!l.pista || Estat.flag('flauta_' + l.id)) &&
            Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, l.x, l.y) <= l.radi);
    }

    obrirMusica() {
        if (this.canviant || this.game.scene.isActive('Musica')) return;
        this.ineu.body.setVelocity(0);
        this.game.scene.start('Musica', { mode: 'lliure' });
        this.game.scene.bringToTop('Musica');
    }

    // Una melodia ha sonat bé. La zona pot gestionar-la amb enMelodia(nom) -> true
    melodiaTocada(nom) {
        const gestionada = this.enMelodia ? this.enMelodia(nom) : false;
        if (!gestionada) {
            this.flotant(this.ineu.x, this.ineu.y - 150, '♪ ' + MELODIES[nom].nom, '#d8c8ff');
            this.time.delayedCall(900, () => this.flotant(this.ineu.x, this.ineu.y - 130, 'Aquí no passa res...', '#a89878'));
        }
    }

    guardarPosicio() {
        if (!this.ineu) return;
        Estat.dades.zona = this.scene.key;
        Estat.dades.x = Math.round(this.ineu.x);
        Estat.dades.y = Math.round(this.ineu.y);
    }

    // ---------------- Bucle ----------------
    update(time, delta) {
        this.cicle(time, delta);
        this.sincroFantasma();
    }

    sincroFantasma() {
        const f = this.fantasma, i = this.ineu;
        if (!f || !i) return;
        if (f.texture.key !== i.texture.key || f.frame.name !== i.frame.name) f.setTexture(i.texture.key, i.frame.name);
        f.setPosition(i.x, i.y).setFlipX(i.flipX).setAlpha(i.alpha * 0.38);
    }

    cicle(time, delta) {
        if (this.canviant) return;
        const ui = this.ui();
        const accio = Phaser.Input.Keyboard.JustDown(this.tecles.SPACE) ||
                      Phaser.Input.Keyboard.JustDown(this.tecles.ENTER) ||
                      Phaser.Input.Keyboard.JustDown(this.tecles.E) ||
                      ui.consumirAccioTactil();

        if ((ui.dialeg || ui.bloquejat) && this.ineu.anims.isPlaying) this.posarDireccio(this.direccio, false);
        if (ui.dialeg) {
            this.ineu.body.setVelocity(0);
            this.congelarEnemics();
            if (accio && !ui.menuObert) ui.avancar();
            this.indicador.setVisible(false);
            return;
        }
        if (ui.bloquejat) {
            this.ineu.body.setVelocity(0);
            this.congelarEnemics();
            return;
        }

        this.moure(ui, delta);
        const proper = this.puntProper();
        this.indicador.setVisible(!!proper);
        if (proper) this.indicador.setPosition(proper.x, proper.y - proper.altura);
        const T = Phaser.Input.Keyboard.JustDown;
        if (accio && this.flautaActiva()) this.obrirMusica();
        else if (accio && proper) this.interactuar(proper);
        else if (accio && this.esbarzerDavant()) this.foc();
        else if (accio || T(this.tecles.J)) this.atacar();
        if (T(this.tecles.K) || T(this.tecles.SHIFT)) this.esquivar();
        if (Estat.te('foc_jaumeta') && T(this.tecles.F)) this.foc();
        time = this.time.now;   // un sol rellotge per a tot el combat
        this.actualitzarCombat(time);
        this.comprovarSortides();
        if (this.actualitzar) this.actualitzar(time, delta);
    }

    moure(ui, delta) {
        // Empenta forçada (esquiva, retrocés, tret de l'atac): el jugador no la controla
        if (this.forcat && this.time.now < this.forcat.fins) {
            this.ineu.body.setVelocity(this.forcat.vx, this.forcat.vy);
            this.ineu.setDepth(this.ineu.y);
            this.ombraIneu.setPosition(this.ineu.x, this.ineu.y);
            return;
        }
        let vx = 0, vy = 0;
        const c = this.cursors, t = this.tecles;
        if (c.left.isDown || t.A.isDown) vx -= 1;
        if (c.right.isDown || t.D.isDown) vx += 1;
        if (c.up.isDown || t.W.isDown) vy -= 1;
        if (c.down.isDown || t.S.isDown) vy += 1;
        if (vx === 0 && vy === 0) { vx = ui.vectorTactil.x; vy = ui.vectorTactil.y; }

        const len = Math.hypot(vx, vy);
        if (len > 1) { vx /= len; vy /= len; }
        this.ineu.body.setVelocity(vx * VELOCITAT_INEU, vy * VELOCITAT_INEU);

        const movent = Math.hypot(vx, vy) > 0.15;
        if (movent) {
            const dir = Math.abs(vx) > Math.abs(vy) * 1.1 ? (vx < 0 ? 'esquerra' : 'dreta') : (vy < 0 ? 'amunt' : 'avall');
            const oct = (Math.round(Math.atan2(vy, vx) / (Math.PI / 4)) + 8) % 8;
            this.vista8Manual = true;
            this.posarDireccio(dir, true, OCTANTS_INEU[oct]);
        } else if (this.ineu.anims.isPlaying) {
            this.posarDireccio(this.direccio, false);
        }
        this.ineu.setDepth(this.ineu.y);
        this.ombraIneu.setPosition(this.ineu.x, this.ineu.y);
    }

    puntProper() {
        let millor = null, millorDist = Infinity;
        for (const p of this.interactius) {
            if (p.actiu && !p.actiu()) continue;
            const d = Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, p.x, p.y);
            if (d <= p.radi && d < millorDist) { millor = p; millorDist = d; }
        }
        return millor;
    }

    interactuar(punt) {
        const dialeg = typeof punt.dialeg === 'function' ? punt.dialeg(Estat) : punt.dialeg;
        this.ui().obrirDialeg(dialeg, () => {
            if (punt.enTancar) punt.enTancar();
            Estat.desar();
        });
    }

    comprovarSortides() {
        const b = this.ineu.body;
        const peus = new Phaser.Geom.Rectangle(b.x, b.y, b.width, b.height);
        for (const s of this.sortides) {
            if (Phaser.Geom.Intersects.RectangleToRectangle(peus, s.r)) {
                this.canviarZona(s.desti, s.entrada);
                return;
            }
        }
    }

    canviarZona(desti, entrada) {
        if (this.canviant) return;
        this.canviant = true;
        this.ineu.body.setVelocity(0);
        Estat.dades.entrada = entrada;
        Estat.dades.x = null;
        Estat.dades.y = null;
        this.posarDireccio(this.direccio, false);
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(desti, { entrada });
        });
    }
}
