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
// Caixa de col·lisió del tronc de l'arbre (gràfic 'arbre': les arrels fan ~130 px d'ample i el tronc ~70-100)
const TRONC_ARBRE = esc => ({ w: Math.round(100 * esc), h: Math.round(36 * esc) });

const PROFUNDITAT_PORTA = 36;   // els interiors es surten per sota de la porta: l'Ineu l'ha de traspassar abans de canviar de zona
const MARGE_TEULADA = 62;   // mig cos de l'Ineu: la col·lisió d'un edifici comença així de baix de la seva teulada, i per dalt es pot passar-hi darrere
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
        Joc.musicaZona(this);
        const uiB = this.ui();                         // si es venia d'un combat de boss (o s'hi ha caigut), fora barra i franges
        if (uiB && uiB.boss) uiB.amagarBarraBoss();
        if (uiB && uiB.frangesG) uiB.franges(false, 10);

        // La caixa dels peus fa 30 d'alt. Als interiors el món s'allarga una mica per sota: la porta es traspassa de debò
        this.physics.world.setBounds(0, TOPE_Y - 30, c.amplada, c.alcada - TOPE_Y + 30 + (this.esInterior() ? PROFUNDITAT_PORTA + 50 : 0));
        this.obstacles = this.physics.add.staticGroup();
        this.interactius = [];
        this.llocsFlauta = [];
        this.sortides = [];
        this.enemics = []; this.copes = []; this.atacantFins = 0;
        this.esbarzers = [];
        this.caient = false;
        this.forcat = null;
        this.cop = null; this.armaNet = null; this.atacFins = 0;
        this.invulnerableFins = 0;
        this.cintaGastada = false;

        this.sols = [];
        this.pedresMobils = [];
        this.camins = [];     // rectangles de camí de terra: es fusionen i es dibuixen amb vores suaus (construirCamins)
        this.extraSud = 0;
        this.yTall = Infinity;
        this.preparaTweens();
        this.portesInt = [];
        this.portesAnim = [];
        Grafics.epoca++;
        this.construir();
        this.obrirPortes();
        this.ampliarSud();
        this.construirCamins();
        this.crearIneu();
        Grafics.alliberar(this.textures, this.scene.key);      // fora les textures grans de la zona anterior (vegeu Grafics, a assets.js)

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
        this.tecles = this.input.keyboard.addKeys('W,A,S,D,E,SPACE,ENTER,J,M,F');

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
        this.interactius.concat(this.esbarzers).forEach(o => { if (o.y >= tall) o.y += extra; });
        this.sortides.forEach(s => {
            if (s.r.y >= tall) s.r.y += extra;
            else if (s.r.bottom >= c.alcada - 20) s.r.height += extra;
        });
        this.physics.world.setBounds(0, TOPE_Y - 30, c.amplada, c.alcada + extra - TOPE_Y + 30);

        // Les vores laterals continuen per la franja nova
        if (this.textures.exists('arbre')) {
            // (una capçada fa uns 340 d'alt: els arbres que en taparien una sortida lateral es deixen)
            const tapa = (x, y) => this.sortides.some(s => s.r.width <= 40 && Math.abs(s.r.centerX - x) < 60 && s.r.bottom > y - 340 && s.r.y < y + 40);
            for (let y = tall + 60; y < tall + extra; y += 90) {
                if (!tapa(24, y)) this.posar('arbre', 24, y);
                if (!tapa(c.amplada - 24, y)) this.posar('arbre', c.amplada - 24, y);
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
        // Algunes zones (config.pins = { pi, pinyer }: proporcions) canvien una part dels arbres per pins; l'elecció és fixa per posició
        if (key === 'arbre' && this.config.pins && !opts.escala) {
            const h = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1, P = this.config.pins;
            if (h < (P.pi || 0)) key = 'pi'; else if (h < (P.pi || 0) + (P.pinyer || 0)) key = 'pi_pinyer';
            if (key !== 'arbre' && !(opts.col && opts.col.fix)) opts = Object.assign({}, opts, { col: { w: key === 'pi' ? 30 : 46, h: 16 } });
        }
        const tex = this.textures.get(key);
        const escala = (tex.customData && tex.customData.escala) || 1 / RES;
        const img = this.add.image(x, y, key).setOrigin(0.5, 1).setScale(escala * (opts.escala || 1));
        img.setDepth(opts.fonsY !== undefined ? opts.fonsY : y);
        if (/^(arbre|xiprer|pi|pi_pinyer|roure|alzina_buida|pinassa|rovello)$/.test(key)) (this.copes = this.copes || []).push(img);   // copes que es tornen translúcides si amaguen un enemic
        // Tots els arbres del mateix gràfic tenen el mateix tronc sòlid (arrels incloses), proporcional a l'escala
        if (key === 'arbre' && !(opts.col && opts.col.fix)) opts = Object.assign({}, opts, { col: TRONC_ARBRE(opts.escala || 1) });
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

    // Personatge quiet amb diàleg (es pot moure amb npcVa: les accions dels diàlegs es fan caminant, no explicant-les)
    npc(key, x, y, dialeg, opts = {}) {
        const img = this.posar(key, x, y);
        img.col = this.colisio(x, y - 9, opts.colAmple || 40, 18);
        img.ombra = this.add.image(x, y, 'ombra').setScale(0.42).setDepth(-500);
        if (opts.flipX) img.setFlipX(true);
        img.escalaBase = img.scaleY;
        // Respiració suau perquè sembli viu
        img.respira = this.tweens.add({ targets: img, scaleY: img.scaleY * 1.02, yoyo: true, repeat: -1, duration: 1100 + Math.random() * 400 });
        img.punt = this.interactiu(x, y - 10, opts.radi || 85, dialeg, { altura: img.displayHeight + 6 });
        (this.npcs = this.npcs || {})[key] = img;
        return img;
    }

    // ---------------- Accions animades (les fan servir les pàgines { fer } dels diàlegs) ----------------
    // Cada acció rep fet() i el crida en acabar. seq() en fa una rere l'altra.
    seq(passos, fet) {
        let i = 0;
        const seguent = () => { if (i >= passos.length) { if (fet) fet(); return; } const p = passos[i++]; p(seguent); };
        seguent();
    }
    esperar(ms, fet) { this.time.delayedCall(ms, fet); }

    // Un personatge camina fins a (x, y), balancejant-se, i s'hi gira
    npcVa(key, x, y, fet, vel = 150) {
        const img = this.npcs && this.npcs[key];
        if (!img) { if (fet) fet(); return; }
        const dist = Phaser.Math.Distance.Between(img.x, img.y, x, y), dur = Math.max(150, dist / vel * 1000);
        if (Math.abs(x - img.x) > 4) img.setFlipX(x < img.x);
        const pas = this.tweens.add({ targets: img, angle: { from: -4, to: 4 }, yoyo: true, repeat: -1, duration: 160 });
        this.tweens.add({ targets: [img, img.ombra].filter(Boolean), x, y, duration: dur, ease: 'Sine.easeInOut', onUpdate: () => img.setDepth(img.y), onComplete: () => {
            pas.stop(); img.setAngle(0);
            if (img.col) { img.col.setPosition(img.x, img.y - 9); img.col.body.updateFromGameObject(); }
            if (img.punt) { img.punt.x = img.x; img.punt.y = img.y - 10; }
            if (fet) fet();
        } });
    }
    // Un personatge se'n va i desapareix (fos), i deixa de ser interactiu
    npcMarxa(key, x, y, fet, vel = 150) {
        const img = this.npcs && this.npcs[key];
        if (!img) { if (fet) fet(); return; }
        this.npcVa(key, x, y, () => {
            this.tweens.add({ targets: [img, img.ombra].filter(Boolean), alpha: 0, duration: 500, onComplete: () => {
                img.setVisible(false); if (img.ombra) img.ombra.setVisible(false);
                if (img.col) this.obstacles.remove(img.col, true, true);
                if (img.punt) img.punt.actiu = () => false;
                if (fet) fet();
            } });
        }, vel);
    }
    npcSalta(key, fet, vegades = 2) {
        const img = this.npcs && this.npcs[key];
        if (!img) { if (fet) fet(); return; }
        this.tweens.add({ targets: img, y: img.y - 26, yoyo: true, repeat: vegades - 1, duration: 170, ease: 'Quad.easeOut', onComplete: fet });
    }
    npcMira(key, cap, fet) {                 // cap: 'ineu' o una x
        const img = this.npcs && this.npcs[key];
        if (img) img.setFlipX((cap === 'ineu' ? this.ineu.x : cap) < img.x);
        if (fet) fet();
    }
    // Feina amb les mans: es mou endavant i enrere, amb guspires o notes (tipus: 'guspires' | 'notes' | 'fulles')
    npcFeina(key, ms, tipus, fet) {
        const img = this.npcs && this.npcs[key];
        if (!img) { if (fet) fet(); return; }
        const t = this.tweens.add({ targets: img, angle: { from: -7, to: 7 }, yoyo: true, repeat: -1, duration: 140 });
        const colors = { guspires: [0xffd060, 0xff8030], notes: [0xd8c8ff, 0xffe8a0], fulles: [0x6ab04a, 0xe86aa0], bombolles: [0x6aff6a, 0xb8ffb0] }[tipus] || [0xffffff];
        const ev = this.time.addEvent({ delay: 160, loop: true, callback: () => {
            if (tipus === 'notes') { this.flotant(img.x + Phaser.Math.Between(-30, 30), img.y - img.displayHeight, Phaser.Utils.Array.GetRandom(['♪', '♫', '♩']), '#d8c8ff'); return; }
            const p = this.add.circle(img.x + Phaser.Math.Between(-20, 20), img.y - img.displayHeight * 0.5, 4, Phaser.Utils.Array.GetRandom(colors)).setDepth(img.depth + 1);
            this.tweens.add({ targets: p, x: p.x + Phaser.Math.Between(-50, 50), y: p.y - Phaser.Math.Between(20, 60), alpha: 0, duration: 600, onComplete: () => p.destroy() });
        } });
        this.time.delayedCall(ms, () => { t.stop(); img.setAngle(0); ev.remove(); if (fet) fet(); });
    }
    // Bombolla sobre el cap d'algú: '!', '?', '♪', '❤', '…', 'Zzz'
    bombolla(qui, text, fet, ms = 900) {
        const img = qui === 'ineu' ? this.ineu : this.npcs && this.npcs[qui];
        if (!img) { if (fet) fet(); return; }
        const t = this.add.text(img.x, img.y - img.displayHeight - 16, text, estilText(34, '#2a170b', { backgroundColor: '#f2e6c8', padding: { x: 10, y: 4 } })).setOrigin(0.5, 1).setDepth(99000);
        const v = this.cameras.main.worldView, mw = t.displayWidth / 2 + 8;          // que no surti per la vora de la pantalla
        if (v.width > 2 * mw) t.x = Phaser.Math.Clamp(t.x, v.x + mw, v.right - mw);
        this.tweens.add({ targets: t, y: t.y - 10, duration: 250, ease: 'Back.easeOut' });
        this.time.delayedCall(ms, () => { t.destroy(); if (fet) fet(); });
    }
    // Un objecte (o una espurna) vola d'algú cap a l'Ineu
    objecteVola(de, fet, key) {
        const img = de && de.x !== undefined ? de : this.npcs && this.npcs[de];
        const x0 = img ? img.x : this.ineu.x, y0 = img ? img.y - (img.displayHeight || 60) * 0.6 : this.ineu.y - 120;
        const o = key && this.textures.exists(key) ? this.add.image(x0, y0, key) : this.add.circle(x0, y0, 10, 0xffe8a0, 1);
        if (o.type === 'Image') o.setScale(46 / Math.max(o.height, o.width));
        o.setDepth(99000);
        this.tweens.add({ targets: o, x: this.ineu.x, y: this.ineu.y - 70, duration: 700, ease: 'Sine.easeInOut', onComplete: () => {
            o.destroy();
            const fl = this.add.circle(this.ineu.x, this.ineu.y - 70, 14, 0xffffff, 0.9).setDepth(99000);
            this.tweens.add({ targets: fl, radius: 46, alpha: 0, duration: 350, onComplete: () => fl.destroy() });
            if (fet) fet();
        } });
    }
    // L'Ineu alça l'arma que acaba de rebre (sprite mirant amunt), amb un esclat de llum i la fanfara de l'objecte, i torna a la pose normal.
    // ox: on cau el cos de l'Ineu dins el dibuix (l'arma queda a un costat), perquè no salti de lloc en canviar de sprite
    // L'Ineu canvia a l'sprite d'«aixecar l'objecte» a l'instant (sense saltar ni parpellejar) i hi roman fins que es crida ineuBaixa()
    // (el diàleg ho fa quan s'avança després del missatge d'obtenció). Continua de seguida (fet).
    ineuAixeca(key, fet, ox = 0.5) {
        const I = this.ineu, esc = (this.textures.get(key).customData || {}).escala || 0.5;
        if (this.ineuAlt) this.ineuAlt.destroy();
        I.setVisible(false);
        if (this.fantasma) this.fantasma.setVisible(false);          // la silueta translúcida de l'Ineu també: un dibuix desapareix i l'altre apareix, sense transparències
        this.ineuAlt = this.add.image(I.x, I.y + 2, key).setOrigin(ox, 1).setScale(esc).setDepth(99100);       // per sobre de tothom (també del Germà Andreu)
        this.llum(I.x - 8, I.y - 190, 0xffe8a0);
        Joc.fanfaraObjecte(this);
        if (fet) fet();
    }
    ineuBaixa(fet) {
        if (this.ineuAlt) { this.ineuAlt.destroy(); this.ineuAlt = null; }
        this.ineu.setVisible(true);
        if (this.fantasma) this.fantasma.setVisible(true);
        if (fet) fet();
    }
    // ---- Accions de l'Ineu sobre el punt amb què interactua (this.puntActiu) ----
    // Agafar: l'objecte (o una llum) vola del punt a l'Ineu, que s'ajup
    agafar(fet, key, color = 0xffe8a0) {
        const p = this.puntActiu || { x: this.ineu.x, y: this.ineu.y - 60 };
        this.ajupir('ineu', null, 300);
        this.objecteVolaDe(p.x, p.y - 30, this.ineu.x, this.ineu.y - 70, key, color, () => { this.llum(this.ineu.x, this.ineu.y - 70, color); this.esperar(300, fet); });
    }
    // Deixar: l'objecte vola de l'Ineu al punt i s'hi encén
    deixar(fet, key, color = 0xffe8a0) {
        const p = this.puntActiu || { x: this.ineu.x, y: this.ineu.y - 60 };
        this.ajupir('ineu', null, 400);
        this.objecteVolaDe(this.ineu.x, this.ineu.y - 70, p.x, p.y - 30, key, color, () => { this.llum(p.x, p.y - 30, color); this.esperar(400, fet); });
    }
    // Beure (un flascó, l'aigua d'un calze, una pruna): llum que puja per l'Ineu
    beure(fet, color = 0xffd890) {
        this.tweens.add({ targets: this.ineu, y: this.ineu.y - 10, yoyo: true, duration: 200 });
        this.llum(this.ineu.x, this.ineu.y - 60, color, () => this.esperar(200, fet));
    }
    objecteVolaDe(x0, y0, x1, y1, key, color, fet) {
        const o = key && this.textures.exists(key) ? this.add.image(x0, y0, key) : this.add.circle(x0, y0, 9, color, 1);
        if (o.type === 'Image') o.setScale(42 / Math.max(o.height, o.width));
        o.setDepth(99000);
        this.tweens.add({ targets: o, x: x1, y: y1, duration: 650, ease: 'Sine.easeInOut', onComplete: () => { o.destroy(); if (fet) fet(); } });
    }

    // L'Ineu camina fins a (x, y)
    ineuVa(x, y, fet, vel = 180) {
        const dx = x - this.ineu.x, dy = y - this.ineu.y, dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'esquerra' : 'dreta') : (dy < 0 ? 'amunt' : 'avall');
        this.posarDireccio(dir, true);
        const dur = Math.max(150, Math.hypot(dx, dy) / vel * 1000);
        this.tweens.add({ targets: this.ineu, x, y, duration: dur, onComplete: () => { this.posarDireccio(dir, false); if (fet) fet(); } });
    }
    // L'Ineu (o un personatge) s'ajup/agenolla un moment
    ajupir(qui, fet, ms = 900) {
        const img = qui === 'ineu' ? this.ineu : this.npcs && this.npcs[qui];
        if (!img) { if (fet) fet(); return; }
        const s = img.scaleY;
        this.tweens.add({ targets: img, scaleY: s * 0.8, duration: 300, yoyo: true, hold: ms, onComplete: () => { img.scaleY = s; if (fet) fet(); } });
    }
    // Un esclat de llum suau en un punt (benediccions, màgia)
    llum(x, y, color = 0xffe8a0, fet) {
        const c = this.add.circle(x, y, 20, color, 0.7).setDepth(99000).setBlendMode('ADD');
        this.tweens.add({ targets: c, radius: 120, alpha: 0, duration: 900, onComplete: () => { c.destroy(); if (fet) fet(); } });
        const p = this.add.particles(x, y, 'espurna', { speed: { min: 20, max: 90 }, lifespan: 1000, scale: { start: 0.35, end: 0 }, tint: [color, 0xffffff], blendMode: 'ADD', quantity: 18, emitting: false }).setDepth(99001);
        p.explode(18);
        this.time.delayedCall(1200, () => p.destroy());
    }

    // Llista d'arbres [[x, y], ...]
    arbres(llista, key = 'arbre') {
        llista.forEach(([x, y]) => this.posar(key, x, y, { col: { w: 34, h: 16 } }));
    }

    // Franja d'arbres que tanca un costat de la pantalla (per no deixar sortir on no hi ha res).
    // Els troncs s'uneixen amb tires de col·lisió (sense forats) i, si la fila és a dalt de tot, una paret
    // pel darrere impedeix passar per l'estreta franja que queda sobre els troncs (paretDarrere = false per a una fila a baix de tot).
    muralla(x1, y1, x2, y2, pas = 90, key = 'arbre', paretDarrere = true, senseArbre = null) {
        const n = Math.max(1, Math.round(Math.hypot(x2 - x1, y2 - y1) / pas));
        const arbre = key === 'arbre';
        const alt = arbre ? TRONC_ARBRE(1).h : 30;
        for (let i = 0; i <= n; i++) {
            const x = x1 + (x2 - x1) * i / n, y = y1 + (y2 - y1) * i / n;
            if (senseArbre && senseArbre(x, y)) continue;                  // només la col·lisió (la mateixa de sota): sense arbre dibuixat
            this.posar(key, x, y, { col: arbre ? { w: TRONC_ARBRE(1).w, h: alt, fix: true } : { w: 60, h: 30 } });
        }
        const horitzontal = Math.abs(y2 - y1) < 5, vertical = Math.abs(x2 - x1) < 5;
        for (let i = 0; i < n; i++) {
            const mx = x1 + (x2 - x1) * (i + 0.5) / n, my = y1 + (y2 - y1) * (i + 0.5) / n;
            if (horitzontal) this.colisio(mx, my - alt / 2, Math.abs(x2 - x1) / n, alt);
            else if (vertical) this.colisio(mx, my - alt / 2, arbre ? TRONC_ARBRE(1).w : 60, Math.abs(y2 - y1) / n);
        }
        if (paretDarrere && horitzontal && y1 - 30 > 10) {
            const xa = Math.min(x1, x2), xb = Math.max(x1, x2);
            this.colisio((xa + xb) / 2, (y1 - 30) / 2, xb - xa, y1 - 30);
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

    // Bloc invisible darrere d'un edifici: l'Ineu no hi ha de travessar la façana (amb la silueta fantasma, es veuria a través).
    // dalt = on comença el gràfic. A la part de la teulada hi queda un marge (MARGE_TEULADA) lliure: l'Ineu hi pot passar
    // per darrere de l'edifici, amb el cos tapat per la façana (però mai per sobre de TOPE_Y, on els peus no arriben).
    blocDarrere(x, ample, baix, dalt = 0) {
        const cim = Math.max(dalt, TOPE_Y) + MARGE_TEULADA;
        if (baix - cim > 10) this.colisio(x, (cim + baix) / 2, ample, baix - cim);
    }

    // Ovella que pastura: s'atura a menjar (cap cap a terra i mastegant) i de tant en tant fa uns passos fins a una altra mata d'herba,
    // sempre dins d'un radi al voltant d'on l'has posat. Només mou la imatge (angle, escala, posició), així serveix amb qualsevol gràfic.
    pasturar(spr, radi = 70) {
        const x0 = spr.x, y0 = spr.y, sx = spr.scaleX, sy = spr.scaleY;
        const nova = () => {
            const dreta = !spr.flipX, cap = dreta ? 1 : -1;
            // Menja una estona: el cap baixa i mastega
            this.tweens.add({ targets: spr, angle: 9 * cap, duration: 500, ease: 'Sine.easeOut' });
            const masteg = this.tweens.add({ targets: spr, scaleY: sy * 0.965, angle: 9 * cap + 1.6 * cap, yoyo: true, repeat: -1, duration: 230, delay: 500 });
            this.time.delayedCall(Phaser.Math.Between(1400, 3600), () => {
                masteg.stop();
                this.tweens.add({ targets: spr, angle: 0, scaleY: sy, duration: 350 });
                // Aixeca el cap i camina fins a una altra mata
                const tx = Phaser.Math.Clamp(x0 + Phaser.Math.Between(-radi * 2, radi * 2), 40, this.config.amplada - 40), ty = y0 + Phaser.Math.Between(-radi * 0.9, radi * 0.9);
                this.time.delayedCall(450, () => {
                    spr.setFlipX(tx < spr.x);
                    const dist = Phaser.Math.Distance.Between(spr.x, spr.y, tx, ty);
                    const passos = this.tweens.add({ targets: spr, scaleY: sy * 1.045, yoyo: true, repeat: -1, duration: 190 });
                    this.tweens.add({ targets: spr, x: tx, y: ty, duration: Math.max(900, dist / 20 * 1000), ease: 'Sine.easeInOut',
                        onUpdate: () => spr.setDepth(spr.y),
                        onComplete: () => { passos.stop(); spr.setScale(sx, sy); spr.setDepth(spr.y); nova(); } });
                });
            });
        };
        this.time.delayedCall(Phaser.Math.Between(0, 2500), nova);
    }

    cartell(x, y, dialeg) {
        this.posar('cartell', x, y, { col: { w: 20, h: 10 } });
        return this.interactiu(x, y, 70, dialeg, { altura: 70 });
    }

    // Les parets d'un interior que barren la porta es parteixen perquè hi quedi un pas lliure (la porta s'ha de poder traspassar)
    obrirPortes() {
        (this.portesInt || []).forEach(p => {
            const x0 = p.x - 8, x1 = p.x + p.w + 8;
            this.obstacles.getChildren().slice().forEach(o => {
                const b = o.body;
                if (!b || b.x >= x1 || b.x + b.width <= x0 || b.y >= p.y + 60 || b.y + b.height <= p.y - 40) return;
                if (b.width < 4 || b.height > 80) return;               // només tires de paret baixa
                const { x, y, width: w, height: h } = b;
                this.obstacles.remove(o, true, true);
                if (x < x0) this.colisio((x + x0) / 2, y + h / 2, x0 - x, h);
                if (x + w > x1) this.colisio((x1 + x + w) / 2, y + h / 2, x + w - x1, h);
            });
        });
    }

    // Rectangle de sortida: quan l'Ineu el toca, es canvia a la zona "desti" i entra per "entrada"
    // peu = true: només compta el punt dels peus (no tota la caixa), per traspassar de debò un camí d'arbres.
    sortida(x, y, w, h, desti, entrada, peu = false) {
        // Porta a la vora de baix d'un interior: es desplaça cap avall perquè l'Ineu hagi de sortir per la porta
        if (this.esInterior() && w >= h && y > this.config.alcada / 2 && y + h >= this.config.alcada - 30) {
            (this.portesInt = this.portesInt || []).push({ x, y, w });
            y += PROFUNDITAT_PORTA; h = 60;
        }
        // Una sortida enganxada a la vora superior s'allarga fins on l'Ineu pot arribar (TOPE_Y)
        if (y < TOPE_Y - 10) h = Math.max(h, TOPE_Y - 10 - y);
        const r = new Phaser.Geom.Rectangle(x, y, w, h);
        this.sortides.push({ r, desti, entrada, peu });
        this.marcarSortida(r);
        if (Joc.debug) this.add.rectangle(x, y, w, h).setOrigin(0).setStrokeStyle(2, 0x00ffff).setDepth(99998);
    }

    // Sortida: una llum càlida i suau que s'esvaeix cap a dins i una remor de llumetes (focs follets) que s'enlairen
    // cap a la sortida i s'hi esvaeixen. Sense fletxes: la llum "crida" sola, d'acord amb la boira màgica del Miracle.
    marcarSortida(r) {
        const c = this.config, vora = 20;
        let dir = 'amunt', ex = r.centerX, ey = r.centerY, span = r.width, fons = 100;
        if (r.x <= vora) { dir = 'esquerra'; ex = 4; ey = r.centerY; span = Math.max(r.height, 90); }
        else if (r.right >= c.amplada - vora) { dir = 'dreta'; ex = c.amplada - 4; ey = r.centerY; span = Math.max(r.height, 90); }
        else if (r.bottom >= c.alcada - vora) { dir = 'avall'; ex = r.centerX; ey = c.alcada - 4; span = Math.max(r.width, 90); }
        else if (r.y < TOPE_Y) { dir = 'amunt'; ex = r.centerX; ey = r.y <= 20 ? 4 : TOPE_Y - 14; span = Math.max(r.width, 90); }   // vora superior de la pantalla
        else { dir = 'amunt'; ex = r.centerX; ey = r.y + r.height * 0.7; span = Math.min(Math.max(r.width, 70), 150); fons = 70; }   // porta d'un edifici
        const v = { dreta: [1, 0], avall: [0, 1], esquerra: [-1, 0], amunt: [0, -1] }[dir];   // cap a fora
        const angle = Math.atan2(v[1], v[0]);

        // Resplendor: capes ovalades superposades, ben suaus, que neixen a la vora
        const llum = this.add.container(ex, ey).setRotation(angle).setDepth(-940);
        const g = this.add.graphics();
        for (let i = 0; i < 7; i++) {
            const f = i / 6;
            g.fillStyle(0xd89a4a, 0.045 + 0.03 * (1 - f)).fillEllipse(-fons * 0.12, 0, fons * (1.5 - f * 1.1), span * (1.05 - f * 0.55));
        }
        llum.add(g);
        llum.setBlendMode(Phaser.BlendModes.ADD);
        this.tweens.add({ targets: llum, alpha: 0.55, yoyo: true, repeat: -1, duration: 2400, ease: 'Sine.easeInOut' });

        // Llumetes: neixen dins de la pantalla i s'allunyen lentament cap a la sortida, tremolant una mica
        const ample = Math.abs(v[0]) ? fons : span * 0.9, alt = Math.abs(v[0]) ? span * 0.9 : fons;
        const zona = new Phaser.Geom.Rectangle(ex - v[0] * fons * 0.55 - ample / 2, ey - v[1] * fons * 0.55 - alt / 2, ample, alt);
        this.add.particles(0, 0, 'espurna', {
            emitZone: { type: 'random', source: zona },
            speedX: { min: v[0] * 14 - 6, max: v[0] * 30 + 6 },
            speedY: { min: v[1] * 14 - 6, max: v[1] * 30 + 6 },
            lifespan: { min: 2600, max: 4200 },
            scale: { values: [0, 0.24, 0.14, 0] },
            alpha: { values: [0, 0.6, 0.5, 0] },
            tint: [0xe8b068, 0xd89a58, 0xb8a0e0],
            blendMode: 'ADD',
            frequency: Math.max(45, 220 - span * 0.6)
        }).setDepth(86000);
    }

    // Emissor de boira fosca
    boira(x, y, ample = 120, alt = 40, quantitat = 1, to = null) {
        return this.add.particles(x, y, 'boira', {
            ...(to ? { tint: to } : {}),
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
    // Una posició desada és bona si és dins la zona i els peus no queden dins d'un obstacle (si l'escena ha canviat
    // des que es va desar, la posició pot haver quedat dins d'una paret: llavors l'Ineu surt per l'entrada)
    llocLliure(x, y) {
        if (x < 0 || y < 0 || x > this.config.amplada || y > this.config.alcada) return false;
        const peus = new Phaser.Geom.Rectangle(x - 18, y - 12, 36, 12);
        return !this.obstacles.getChildren().some(o => o.body && Phaser.Geom.Intersects.RectangleToRectangle(peus, new Phaser.Geom.Rectangle(o.body.x, o.body.y, o.body.width, o.body.height)));
    }

    crearIneu() {
        const e = this.config.entrades;
        let pos;
        if (this.dadesEntrada.restaurar && Estat.dades.x !== null && this.llocLliure(Estat.dades.x, Estat.dades.y)) {
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
        if (this.atacantFins && this.time.now < this.atacantFins) return;      // l'animació de l'atac no es talla
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

    // Roca que l'Ineu empeny de debò cap a (dx, dy) per descobrir el que hi ha a sota: s'hi ha de posar a l'altra banda
    // i caminar contra ella. ESPAI només l'examina (i diu cap on s'ha d'empènyer).
    pedraMobil(x, y, id, dx, dy, textPista) {
        const mogut = Estat.flag('pedra_' + id);
        const dist = Math.hypot(dx, dy);
        const o = { id, mogut, x: x + (mogut ? dx : 0), y: y + (mogut ? dy : 0), ux: dx / dist, uy: dy / dist, dist, fet: 0, empenta: 0 };
        o.img = this.posar('roca', o.x, o.y);
        o.col = this.colisio(o.x, o.y - 13, 70, 26);
        if (!mogut) {
            const cap = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'la dreta' : "l'esquerra") : (dy > 0 ? 'avall' : 'amunt');
            this.interactiu(x, y + 24, 90, { pagines: [{ qui: '', text: textPista }, { qui: 'Ineu', text: '(Si m\'hi recolzo i l\'empenyo cap a ' + cap + ', potser cedirà.)' }] },
                { altura: 70, actiu: () => !o.mogut });
            (this.pedresMobils = this.pedresMobils || []).push(o);
        }
        return o;
    }

    // Cada fotograma: si l'Ineu toca la roca pel costat de darrere i camina cap on s'ha d'empènyer, la roca avança a poc a poc
    actualitzarPedres(delta) {
        if (!this.pedresMobils) return;
        const b = this.ineu.body, v = b.velocity;
        this.pedresMobils.forEach(o => {
            if (o.mogut) return;
            const c = o.col.body, M = 10;
            const toca = o.ux ? (o.ux > 0 ? Math.abs(b.right - c.left) < M : Math.abs(b.left - c.right) < M) && b.bottom > c.top + 2 && b.top < c.bottom - 2
                              : (o.uy > 0 ? Math.abs(b.bottom - c.top) < M : Math.abs(b.top - c.bottom) < M) && b.right > c.left + 4 && b.left < c.right - 4;
            const empeny = toca && (v.x * o.ux + v.y * o.uy) > VELOCITAT_INEU * 0.5;
            o.empenta = empeny ? o.empenta + delta : 0;
            if (o.empenta < 220) return;                                    // primer s'hi recolza una mica
            const pas = Math.min(o.dist - o.fet, 75 * delta / 1000);
            o.fet += pas;
            o.img.x += o.ux * pas; o.img.y += o.uy * pas; o.img.setDepth(o.img.y);
            o.col.setPosition(o.img.x, o.img.y - 13); c.updateFromGameObject();
            if (this.time.now > (o.proxSo || 0)) { o.proxSo = this.time.now + 260; Sfx.pas(true); this.cameras.main.shake(80, 0.0015); }
            if (o.fet >= o.dist - 0.5) {
                o.mogut = true;
                Estat.posaFlag('pedra_' + o.id);
                Sfx.secret();
                Estat.desar();
            }
        });
    }

    destruirEsbarzer(o, foc) {
        Sfx.talla();
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
            if (e.mort) return;
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
    // prioritat: la flauta passa davant de qualsevol persona que hi hagi a prop (p. ex. els pastors al voltant del foc)
    llocFlauta(id, x, y, radi, pista = false, actiu = null, prioritat = false) {
        this.llocsFlauta.push({ id, x, y, radi, pista, actiu, prioritat });
    }

    // Lloc de flauta on és l'Ineu (o null)
    flautaActiva() {
        if (!Estat.te('flauta') || !this.ineu || this.sensePunts()) return null;
        return this.llocsFlauta.find(l => (!l.pista || Estat.flag('flauta_' + l.id)) && (!l.actiu || l.actiu()) &&
            Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, l.x, l.y) <= l.radi) || null;
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
            this.missatge('♪ ' + MELODIES[nom].nom + '\nAquí no passa res...');
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
        this.transparenciaCopes();
    }

    // Un enemic darrere la capçada d'un arbre no es perd: se'n veu una silueta translúcida per sobre
    // (com la de l'Ineu), que apareix i s'esvaeix suaument. Els arbres no canvien.
    transparenciaCopes() {
        if (!this.copes || !this.enemics) return;
        const caixes = this.copes.map(img => ({ y: img.y, b: img.getBounds() }));
        this.enemics.forEach(e => {
            const sp = e.spr;
            let alfa = 0;
            if (!e.mort && sp.active && sp.visible) {
                const b = sp.getBounds();
                if (caixes.some(c => sp.y < c.y + 4 && Phaser.Geom.Rectangle.Overlaps(c.b, b))) alfa = 0.42;
            }
            let f = e.fantasma;
            if (!f) {
                if (!alfa) return;
                f = e.fantasma = this.add.sprite(sp.x, sp.y, sp.texture.key, sp.frame.name).setDepth(87000).setAlpha(0);
            }
            if (f.texture.key !== sp.texture.key || f.frame.name !== sp.frame.name) f.setTexture(sp.texture.key, sp.frame.name);
            f.setOrigin(sp.originX, sp.originY).setPosition(sp.x, sp.y).setScale(sp.scaleX, sp.scaleY).setFlip(sp.flipX, sp.flipY).setAngle(sp.angle);
            const dest = alfa * sp.alpha;
            f.setAlpha(f.alpha + (dest - f.alpha) * 0.18);
            f.setVisible(f.alpha > 0.01);
        });
    }

    sincroFantasma() {
        const f = this.fantasma, i = this.ineu;
        if (!f || !i) return;
        if (f.texture.key !== i.texture.key || f.frame.name !== i.frame.name) f.setTexture(i.texture.key, i.frame.name);
        f.setPosition(i.x, i.y).setFlipX(i.flipX).setAlpha(this.assegut ? 0 : i.alpha * 0.38);   // assegut: el banc el tapa de debò
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
        this.actualitzarPedres(delta);
        const proper = this.puntProper();
        this.indicador.setVisible(!!proper);
        if (proper) this.indicador.setPosition(proper.x, proper.y - proper.altura);
        const T = Phaser.Input.Keyboard.JustDown;
        // La flauta passa davant només del punt del mateix lloc (la bassa, la pedra...): un cartell o algú proper es llegeix/escolta
        const flauta = accio && this.flautaActiva();
        if (flauta && (flauta.prioritat || !proper || Phaser.Math.Distance.Between(proper.x, proper.y, flauta.x, flauta.y) < 80)) this.obrirMusica();
        else if (accio && proper) this.interactuar(proper);
        else if (accio && this.esbarzerDavant()) this.foc();
        else if (accio || T(this.tecles.J)) this.atacar();
        if (Estat.te('foc_jaumeta') && T(this.tecles.F)) this.foc();
        time = this.time.now;   // un sol rellotge per a tot el combat
        this.actualitzarCombat(time);
        this.comprovarSortides();
        if (this.actualitzar) this.actualitzar(time, delta);
        this.actualitzarPortes(delta);
    }

    // Porta de doble batent dibuixada damunt de la del gràfic de l'edifici: els batents giren cap endins quan l'Ineu
    // s'hi acosta i es tornen a tancar quan se n'allunya; a dins s'entreveu la foscor càlida.
    // o = { x, top, bottom, ample, fons (profunditat de l'edifici), arc (true: arc de mig punt; un número: arc rebaixat, amb aquesta
    //       fletxa), color, panell, vora, finestra, ferro }
    // Amb retall (la imatge de l'edifici ja posada), el batent és el tros del mateix gràfic: la porta oberta és la que es veu dibuixada.
    portaAnimada(o) {
        const DX = o.x, DT = o.top, DB = o.bottom, DW = o.ample, H = DB - DT, w = o.unic ? DW : DW / 2, r = o.arc ? DW / 2 : 0, Z = o.fons;
        const forma = (x0, ample, alt, arc) => {                       // contorn d'un rectangle amb (opcionalment) la part de dalt en arc
            if (!arc) return [{ x: x0, y: alt }, { x: x0, y: 0 }, { x: x0 + ample, y: 0 }, { x: x0 + ample, y: alt }];
            const pts = [{ x: x0, y: alt }], fl = arc === true ? ample / 2 : arc;
            for (let k = 0; k <= 12; k++) { const a = Math.PI + k / 12 * Math.PI; pts.push({ x: x0 + ample / 2 + Math.cos(a) * ample / 2, y: fl + Math.sin(a) * fl }); }
            pts.push({ x: x0 + ample, y: alt });
            return pts;
        };
        const dins = this.add.graphics().setDepth(Z + 1).setPosition(0, DT);
        dins.fillStyle(0x0e0806, 1).fillPoints(forma(DX - DW / 2, DW, H, o.arc), true);
        dins.fillGradientStyle(0x0e0806, 0x0e0806, 0x6a4420, 0x6a4420, 1, 1, 0.9, 0.9).fillRect(DX - DW / 2, H * 0.45, DW, H * 0.55);
        dins.fillStyle(0xffd38a, 0.5).fillCircle(DX, H - 22, 9);       // una espelma al fons
        const batent = esq => {
            if (o.retall) {
                // El batent és el tros del gràfic de la porta, retallat amb la seva forma (a una textura pròpia)
                const im = o.retall, src = im.texture.getSourceImage(), nom = 'porta_' + im.texture.key + '_' + DX + '_' + DT;
                const sx = (DX - DW / 2 - im.x + im.displayWidth * im.originX) / im.scaleX, sy = (DT - im.y + im.displayHeight * im.originY) / im.scaleY;
                if (!this.textures.exists(nom)) {
                    const sw = Math.ceil(DW / im.scaleX), sh = Math.ceil(H / im.scaleY), ct = this.textures.createCanvas(nom, sw, sh), cx = ct.getContext();
                    if (o.arc) { cx.beginPath(); forma(0, sw, sh, o.arc === true ? true : o.arc / im.scaleY).forEach((p, k) => k ? cx.lineTo(p.x, p.y) : cx.moveTo(p.x, p.y)); cx.closePath(); cx.clip(); }
                    cx.drawImage(src, sx, sy, sw, sh, 0, 0, sw, sh);
                    ct.refresh();
                }
                const g = this.add.container(DX - DW / 2, DT).setDepth(Z + 2);
                const bi = this.add.image(0, 0, nom).setOrigin(0).setScale(im.scaleX, im.scaleY);
                if (o.tint) bi.setTint(o.tint);                         // la façana té un to (setTint): el batent l'ha de tenir igual
                g.add(bi);
                return g;
            }
            const g = this.add.graphics().setDepth(Z + 2);
            const x = esq ? 0 : -w;                                      // l'origen és la frontissa (vora de fora)
            let pts;
            if (!r || o.unic) pts = forma(x, w, H, !!r);
            else {                                                       // mig arc: cada batent té el seu quart de cercle
                pts = [{ x, y: H }];
                const cx = esq ? x + w : x;
                for (let k = 0; k <= 8; k++) { const a = (esq ? Math.PI : Math.PI * 1.5) + k / 8 * Math.PI / 2; pts.push({ x: cx + Math.cos(a) * r, y: r + Math.sin(a) * r }); }
                pts.push({ x: x + w, y: H });
            }
            g.fillStyle(o.color, 1).fillPoints(pts, true).lineStyle(2, o.vora, 1).strokePoints(pts, true);
            if (o.panell !== undefined) {
                const p0 = r + 8, ph = (H - p0 - 18) / 2;
                g.fillStyle(o.panell, 1).fillRect(x + 6, p0, w - 12, ph - 6).fillRect(x + 6, p0 + ph + 2, w - 12, ph - 6);
                g.lineStyle(1.5, o.vora, 1).strokeRect(x + 6, p0, w - 12, ph - 6).strokeRect(x + 6, p0 + ph + 2, w - 12, ph - 6);
            } else {
                g.lineStyle(1.5, o.vora, 0.8);
                for (let k = 1; k < 3; k++) g.lineBetween(x + w * k / 3, r * 0.6, x + w * k / 3, H - 2);
            }
            if (o.ferro) [0.22, 0.78].forEach(f => { g.lineStyle(4, 0x2a2018, 1).lineBetween(x + 3, H * f, x + w - 3, H * f); g.fillStyle(0x2a2018, 1).fillCircle(esq ? x + w - 8 : x + 8, H * f, 4); });
            if (esq && o.finestra) {                                     // finestreta enreixada
                g.fillStyle(o.vora, 1).fillRect(x + 10, H - 66, 26, 40);
                g.lineStyle(1.5, 0x5a7a70, 1); for (let k = 1; k < 4; k++) g.lineBetween(x + 10 + k * 6.5, H - 66, x + 10 + k * 6.5, H - 26);
            }
            g.fillStyle(0xcfb36a, 1).fillCircle(esq ? x + w - 9 : x + 9, H * 0.55, 2.8);   // pom
            g.setPosition(esq ? DX - DW / 2 : DX + DW / 2, DT);
            return g;
        };
        const esq = batent(true), dre = o.unic ? null : batent(false);
        const P = { DX, DB, a: 0, estat: 'tancada', esq, dre, bloq: o.bloq };
        this.portesAnim.push(P);
        return P;
    }

    // Mostra una imatge gran (un cartell, una carta...) amb zoom automàtic: surt de l'objecte de la paret, creix fins a omplir la pantalla i s'aclareix de borrosa a nítida.
    // x, y: centre de l'objecte al món; ample: la seva amplada al món; borros: textura petita que hi ha a la paret (opcional). Es tanca tocant o amb ESPAI/ESC; fet() quan es tanca.
    mostrarImatge(key, x, y, ample, borros, fet) {
        const ui = this.ui(), cam = this.cameras.main;
        const sx = cam.x + (x - cam.worldView.x) * cam.zoom, sy = cam.y + (y - cam.worldView.y) * cam.zoom, aw = ample * cam.zoom;
        const tex = ui.textures.get(key).getSourceImage();
        const fons = ui.add.rectangle(AMPLE / 2, ALT / 2, AMPLE, ALT, 0x000000, 0).setDepth(99000).setInteractive();
        const nitid = ui.add.image(sx, sy, key).setDepth(99002).setAlpha(0);
        const dif = borros ? ui.add.image(sx, sy, borros).setDepth(99001) : null;
        const ini = aw / tex.width;
        nitid.setScale(ini);
        if (dif) dif.setScale(aw / ui.textures.get(borros).getSourceImage().width);
        const fi = Math.min(AMPLE * 0.9 / tex.width, ALT * 0.78 / tex.height);
        const pista = ui.add.text(AMPLE / 2, ALT - 70, 'Toca per tancar', estilText(26, '#f2e6c8', { stroke: '#000000', strokeThickness: 5 })).setOrigin(0.5).setDepth(99003).setAlpha(0);
        const v = { u: 0 };
        let obert = false, tancat = false;
        ui.tweens.add({ targets: v, u: 1, duration: 900, ease: 'Sine.easeInOut', onUpdate: () => {
            const e = v.u, x2 = Phaser.Math.Linear(sx, AMPLE / 2, e), y2 = Phaser.Math.Linear(sy, ALT / 2 - 10, e), sc = Phaser.Math.Linear(ini, fi, e);
            nitid.setPosition(x2, y2).setScale(sc).setAlpha(Phaser.Math.Clamp((e - 0.3) / 0.5, 0, 1));
            if (dif) { dif.setPosition(x2, y2).setScale(sc * (ini > 0 ? (tex.width / ui.textures.get(borros).getSourceImage().width) : 1)).setAlpha(1 - Phaser.Math.Clamp((e - 0.3) / 0.5, 0, 1)); }
            fons.setFillStyle(0x000000, 0.82 * e);
        }, onComplete: () => { obert = true; ui.tweens.add({ targets: pista, alpha: 1, duration: 300 }); } });
        const tanca = () => {
            if (!obert || tancat) return; tancat = true;
            ui.input.keyboard.off('keydown', tecla);
            ui.tweens.add({ targets: [nitid, dif, pista, fons].filter(Boolean), alpha: 0, duration: 260, onComplete: () => {
                [nitid, dif, pista, fons].forEach(o => o && o.destroy());
                ui.bloquejatFins = ui.time.now + 350;
                if (fet) fet();
            } });
        };
        const tecla = ev => { if (['Space', 'Enter', 'Escape'].includes(ev.code)) tanca(); };
        ui.input.keyboard.on('keydown', tecla);
        fons.on('pointerdown', tanca);
    }

    // El portal d'arc de la masia (gràfic provisional 'masia'): x, y = peus del centre de la façana
    portaMasia(img, x, y) {
        const t = y - img.displayHeight;
        this.portaAnimada({ x, top: t + img.displayHeight * 0.56, bottom: y - 4, ample: img.displayWidth * 0.15, fons: y - 20, unic: true, arc: true, retall: img, tint: img.isTinted ? img.tintTopLeft : 0 });
    }

    actualitzarPortes(delta) {
        if (!this.ineu) return;
        this.portesAnim.forEach(P => {
            const d = Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, P.DX, P.DB + 16);
            const objectiu = P.forcaFins && this.time.now < P.forcaFins ? 1 : (P.bloq && P.bloq()) ? 0 : Phaser.Math.Clamp((230 - d) / 150, 0, 1);
            P.a += (objectiu - P.a) * (1 - Math.exp(-(delta || 16) / 130));
            const e = P.a * P.a * (3 - 2 * P.a);                          // entrada i sortida suaus
            [P.esq, P.dre].forEach(b => { if (b) { b.scaleX = 1 - 0.88 * e; b.setAlpha(1 - 0.25 * e); } });   // el batent es veu "de cantó" a mesura que gira cap endins
            if (P.estat === 'tancada' && P.a > 0.1) { P.estat = 'oberta'; Sfx.porta(); }
            else if (P.estat === 'oberta' && P.a < 0.04) { P.estat = 'tancada'; Sfx.porta(); }
        });
    }

    moure(ui, delta) {
        // Assegut en un banc: es queda quiet fins que el jugador es mou (llavors s'aixeca i continua caminant)
        if (this.assegut) {
            const c = this.cursors, t = this.tecles;
            const vol = c.left.isDown || c.right.isDown || c.up.isDown || c.down.isDown ||
                t.A.isDown || t.D.isDown || t.W.isDown || t.S.isDown || Math.hypot(ui.vectorTactil.x, ui.vectorTactil.y) > 0.15;
            if (!vol) { this.ineu.body.setVelocity(0); return; }
            this.alcar();
        }
        // Empenta forçada (retrocés quan et fan mal): el jugador no la controla
        if (this.forcat && this.time.now < this.forcat.fins) {
            this.ineu.body.setVelocity(this.forcat.vx, this.forcat.vy);
            this.ineu.setDepth(this.ineu.y);
            this.ombraIneu.setPosition(this.ineu.x, this.ineu.y);
            return;
        }
        // Mentre ataca no es mou del lloc (així els peus no llisquen sobre l'animació)
        if (this.atacantFins && this.time.now < this.atacantFins) {
            this.ineu.body.setVelocity(0);
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
            if (this.time.now > (this.proxPas || 0)) { this.proxPas = this.time.now + 300; this.altrePas = !this.altrePas; Sfx.pas(this.altrePas); }
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

    // Punt interactiu que l'Ineu té al davant: prou a prop (80% del radi) i dins d'un con de ±70° cap on mira.
    // Així, si ataca d'esquena a un cartell, no es posa a llegir.
    // Una zona pot desactivar tots els punts interactius i la flauta (el combat final: ningú no parla ni toca res)
    sensePunts() { return false; }

    puntProper() {
        if (this.sensePunts()) return null;
        const v8 = { right: [1, 0], southeast: [1, 1], down: [0, 1], southwest: [-1, 1], left: [-1, 0], northwest: [-1, -1], up: [0, -1], northeast: [1, -1] }[this.vista8];
        const dv = v8 ? { x: v8[0] / Math.hypot(...v8), y: v8[1] / Math.hypot(...v8) } : (DIRS[this.direccio] || DIRS.avall);
        let millor = null, millorDist = Infinity;
        for (const p of this.interactius) {
            if (p.actiu && !p.actiu()) continue;
            if (!p.enTancar) { const d = typeof p.dialeg === 'function' ? p.dialeg(Estat) : p.dialeg; if (d && d.pagines && !d.pagines.length) continue; }     // sense res a dir: no és interactiu
            const dx = p.x - this.ineu.x, dy = p.y - this.ineu.y, d = Math.hypot(dx, dy);
            if (d > p.radi * 0.8 || d >= millorDist) continue;
            if (d > 36 && (dx * dv.x + dy * dv.y) / d < 0.34) continue;          // no el mira
            millor = p; millorDist = d;
        }
        return millor;
    }

    interactuar(punt) {
        this.puntActiu = punt;
        const dialeg = typeof punt.dialeg === 'function' ? punt.dialeg(Estat) : punt.dialeg;
        if (!dialeg) { if (punt.enTancar) punt.enTancar(); return; }   // accions sense diàleg (només un efecte a l'escena)
        this.ui().obrirDialeg(dialeg, () => {
            if (punt.enTancar) punt.enTancar();
            Estat.desar();
        });
    }

    comprovarSortides() {
        const b = this.ineu.body;
        const peus = new Phaser.Geom.Rectangle(b.x, b.y, b.width, b.height);
        for (const s of this.sortides) {
            if (s.peu ? s.r.contains(b.center.x, b.bottom) : Phaser.Geom.Intersects.RectangleToRectangle(peus, s.r)) {
                if (s.baixar !== undefined) this.baixarEscala(s);
                else this.canviarZona(s.desti, s.entrada);
                return;
            }
        }
    }

    // Escala que baixa sota terra cap al nord (un forat, una trapa): ycut és la vora de davant del forat
    sortidaEscala(x, y, w, h, desti, entrada, ycut) {
        this.sortida(x, y, w, h, desti, entrada);
        Object.assign(this.sortides[this.sortides.length - 1], { baixar: ycut, xEscala: x + w / 2 });
    }

    // L'Ineu baixa l'escala: camina d'esquena cap al mig de l'escala i s'enfonsa darrere la vora de davant del forat,
    // cada cop més fosc, graó a graó; després canvia de zona
    baixarEscala(s) {
        if (this.canviant) return;
        this.canviant = true;
        const I = this.ineu, alt = I.displayHeight, y0 = I.y, y1 = s.baixar + alt * 0.95;
        I.body.setVelocity(0); I.body.enable = false;
        this.posarDireccio('amunt', true);
        this.ombraIneu.setVisible(false);
        I.setMask(this.make.graphics({ add: false }).fillRect(0, 0, this.config.amplada, s.baixar).createGeometryMask());
        const graons = 6;
        this.tweens.addCounter({
            from: 0, to: 1, duration: 1500,
            onUpdate: tw => {
                const f = tw.getValue(), g = f * graons, pas = Math.floor(g) + Phaser.Math.Easing.Sine.InOut(g % 1);   // cada graó: baixada suau i repòs
                I.setPosition(Phaser.Math.Linear(I.x, s.xEscala, 0.08), y0 + (y1 - y0) * pas / graons);
                const c = Math.round(255 * (1 - 0.7 * f));
                I.setTint(Phaser.Display.Color.GetColor(c, c, c));
            }
        });
        Sfx.porta();
        this.time.delayedCall(1250, () => { this.canviant = false; this.canviarZona(s.desti, s.entrada); });
    }

    canviarZona(desti, entrada) {
        if (this.canviant) return;
        this.canviant = true;
        Sfx.porta();
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
