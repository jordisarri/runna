/**
 * EL CELLER: el partit de ping-pong contra en Jusef, estil arcade «Threepon» (el prototip és a proves/pingpong/arcade.html; el minijoc antic, de tres carrils, a proves/pingpong/antic/)
 *
 * Un sol gest, sense botons ni joystick. L'Ineu CORRE SOL cap a la pilota (una marca groga t'ensenya on botarà); tu només LLISCES el dit cap amunt per colpejar:
 *    · la DIRECCIÓ del lliscament apunta (cap a l'esquerra o la dreta)
 *    · la LLARGADA decideix la profunditat (curt = cop curt cap a la xarxa; llarg = fins al fons de la taula)
 *    · la VELOCITAT decideix la força (ràpid = cop fort i difícil de tornar, però més arriscat)
 *    · el MOMENT en què ho fas: un anell a la pilota es posa VERD quan ja és a la pala. Si lliscs en verd, és PERFECTE (precís i difícil per a en Jusef);
 *      si és una mica abans o després, és BÉ (amb una mica d'error); molt abans: «Massa aviat»; si la pilota ja ha passat: «Massa tard» (punt d'en Jusef).
 *  El lliscament es veu com una estela lluminosa. Sense lliscar, l'Ineu no colpeja (cal estar atent!).
 *  Servei (com a la realitat): la pilota bota PRIMER al camp de qui serveix i després passa la xarxa. El teu: llisca cap amunt (apuntes igual).
 *  El d'en Jusef: un de cada tres és MÀGIC: la pilota encantada fa zigzags i només un cop PERFECTE trenca l'encanteri (llavors en Jusef no la pot tornar);
 *  si el cop no és perfecte, l'encanteri resisteix i la pilota torna fluixa.
 *  Partit a 5 punts al prototip (11 al joc). Després de dues derrotes, s'ofereix el mode fàcil (anell verd més llarg, en Jusef falla més). Càmera mòbil.
 *
 * Coordenades del món (metres): X de través (centre 0), z al llarg (0 = vora de l'Ineu, L = vora d'en Jusef), h alçada sobre la taula.
 *
 * Al joc: un sol partit contra en Jusef, obligatori (el Senyor Pomers no parla de la roda fins que el guanyes). En guanyar-lo, celebració de l'Ineu i, en tocar la pantalla, es tanca
 * i s'obre el diàleg del premi (DIALEGS.jusefGuanyat). Si perds, panell amb «Tornar a jugar» (i el mode fàcil després de dues derrotes) o «Marxar» (DIALEGS.jusefPerdut).
 */
const EscenaPingPong = (() => {
const ALT_PP = 1280;                // alçada per a la qual està dissenyada l'escena (AMPLE i ALT_PP venen del joc: la pantalla real pot ser més baixa)
const T = {
    L: 2.74, W: 0.7625, NH: 0.1525,               // taula reglamentària
    F: 1236, HY: -414, K: 4299, ZN: 3.04,          // càmera darrere l'Ineu (la mateixa perspectiva que el minijoc d'ara)
    G: 9.81, REST: 0.86,                           // gravetat i rebot a la taula
    Z_INEU: -0.42, Z_JUSEF: T_L_PLUS(0.42),        // on es posen els jugadors
    Z_IDEAL: -0.08,                                // on és la pilota en el moment perfecte del cop (just passada la vora de la taula)
    PUNTS: 11, PUNTS_ZERO: 7                       // PUNTS_ZERO: si un arriba a 7 i l'altre en té 0, el partit s'acaba
};
function T_L_PLUS(d) { return 2.74 + d; }
const MODES = {
    // finestra: segons (reals) abans d'arribar la pilota en què lliscar és PERFECTE · bona: fins on és «bé» · abast: fins on arriba l'Ineu (m)
    normal: { temps: 0.8, finestra: 0.45, bona: 1.3, abast: 0.45, abastJusef: 0.3, velJusef: 0.9, fallaJusef: 0 },
    facil:  { temps: 0.65, finestra: 0.7, bona: 1.8,  abast: 0.65, abastJusef: 0.26, velJusef: 0.72, fallaJusef: 0 }
};
const GIR_AN = {      // [centre x, peus y] (0-1) de cada fotograma dels fulls de gir d'AutoSprite
    jusef_gir_dreta: [[0.461, 0.969], [0.463, 0.961], [0.461, 0.953], [0.461, 0.945], [0.463, 0.938], [0.486, 0.926], [0.506, 0.918], [0.514, 0.902], [0.506, 0.895], [0.482, 0.879], [0.492, 0.863], [0.498, 0.859], [0.498, 0.859], [0.498, 0.859], [0.498, 0.859], [0.498, 0.859]],
    jusef_gir_esquerra: [[0.461, 0.969], [0.455, 0.957], [0.445, 0.945], [0.438, 0.926], [0.441, 0.906], [0.453, 0.895], [0.477, 0.875], [0.496, 0.863], [0.498, 0.859], [0.498, 0.859], [0.498, 0.859], [0.498, 0.859], [0.498, 0.859], [0.498, 0.859], [0.498, 0.859], [0.498, 0.859]]
};
const Z_COP = 0.05;           // fondària on l'Ineu colpeja la pilota

const ESTAT_PP = { mode: 'normal', derrotes: 0 };      // el mode fàcil i les derrotes duren mentre no es recarrega el joc

class EscenaPingPong extends Phaser.Scene {
    constructor() { super('PingPong'); }

    preload() {
        // L'Ineu d'esquena, en alta resolució (512 px per fotograma; eines/fer_pingpong_ineu_hd.py): es mostra molt gran i només de genolls amunt
        ['drive', 'reves', 'servei'].forEach(n => this.load.spritesheet(n === 'servei' ? 'ineu_servei' : 'pp_' + n, `assets/pingpong2/ineu_${n}.webp?v=2`, { frameWidth: 512, frameHeight: 512 }));
                this.load.image('pp_cartell', 'assets/objectes/cartell_llums.webp?v=2611110200');
        this.load.spritesheet('ineu_celebracio', 'assets/pingpong2/ineu_celebracio.webp?v=2', { frameWidth: 512, frameHeight: 512 });
        ['jusef_dret', 'jusef_revers', 'jusef_servei'].forEach(n => this.load.spritesheet(n, `assets/pingpong2/${n}.webp?v=5`, { frameWidth: 256, frameHeight: 256 }));
        ['jusef_gir_dreta', 'jusef_gir_esquerra'].forEach(n => this.load.spritesheet(n, `assets/pingpong2/${n}.webp?v=5`, { frameWidth: 256, frameHeight: 256 }));       // el gir de cara a perfil, fotograma a fotograma
        ['jusef_cop_drive_esquerra', 'jusef_revers_3q'].forEach(n => this.load.spritesheet(n, `assets/pingpong2/${n}.webp?v=5`, { frameWidth: 256, frameHeight: 256 }));       // de perfil: gira el cos cap al costat de la pilota
    }

    create() {
        this.scene.bringToTop();
        this.scene.bringToTop('UI');            // el HUD (només el botó del menú ☰ al ping-pong) queda per sobre del minijoc, perquè es pugui pausar
        // La zona i el HUD dormen mentre es juga (no es veuen i no gasten); en acabar es desperten
        this.zona = Joc.zonaActiva(this);
        if (this.zona) this.scene.sleep(this.zona.scene.key);
        this.mode = ESTAT_PP.mode; this.derrotes = ESTAT_PP.derrotes; this.uiLlista = []; this.guanyat = false; this.sortint = false;
        this.kPantalla = Math.min(1, ALT / ALT_PP);          // si la pantalla és més baixa que el disseny, tot es redueix (centrat)
        this.dibuixaEscenari();
        this.anims.create({ key: 'drive', frames: this.anims.generateFrameNumbers('pp_drive', { start: 4, end: 15 }), frameRate: 34 });
        this.anims.create({ key: 'reves', frames: this.anims.generateFrameNumbers('pp_reves', { start: 6, end: 15 }), frameRate: 40 });
        // factor per fotograma de cada full: en girar-se, l'Ineu ocupa menys a la pantalla; s'hi compensa una mica perquè no sembli que s'encongeix
        this.compIneu = { pp_drive: [1,1,1,1.02,1.08,1.09,1,1.04,1.05,1.05,1.06,1.02,1,1,1,1], pp_reves: [1,1,1.02,1.1,1.05,1.05,1.06,1.08,1.01,1,1.01,1.01,1,1,1,1], ineu_servei: [1,1,1.01,1.02,1.04,1.04,1.05,1.07,1,1,1,1,1,1,1,1] };
        this.escIneu = 1.5; this.tallIneu = 370;                          // escala (512 px de fotograma → 768 de pantalla) i alçada que es veu (dalt fins als genolls)
        this.spIneu = this.add.sprite(0, 0, 'pp_drive', 0).setOrigin(0.5, 1).setCrop(0, 0, 512, this.tallIneu);
        this.spIneu.on('animationcomplete', () => this.spIneu.setTexture('pp_drive', 0));
        // En Jusef (d'AutoSprite): quiet = el primer fotograma; els gestos de cop de dret, de revers i de servei s'engeguen quan toca
        this.anims.create({ key: 'jf_dret', frames: this.anims.generateFrameNumbers('jusef_dret', { start: 2, end: 12 }), frameRate: 30 });
        this.anims.create({ key: 'jf_revers', frames: this.anims.generateFrameNumbers('jusef_revers', { start: 2, end: 12 }), frameRate: 30 });
        this.anims.create({ key: 'jf_drive_esq', frames: this.anims.generateFrameNumbers('jusef_cop_drive_esquerra', { start: 1, end: 12 }), frameRate: 32 });          // drive de perfil mirant a l'esquerra, fet a AutoSprite amb la raqueta a la mà dreta (no és el full de la dreta emmirallat: això li canviava la raqueta de mà)
        this.anims.create({ key: 'jf_revers3q', frames: this.anims.generateFrameNumbers('jusef_revers_3q', { start: 2, end: 12 }), frameRate: 30 });
        [['dreta', 11], ['esquerra', 9]].forEach(([n, fi]) => {          // el gir acaba de moure's al fotograma fi: els següents són el mateix perfil
            this.anims.create({ key: 'jf_gir_' + n, frames: this.anims.generateFrameNumbers('jusef_gir_' + n, { start: 1, end: fi }), frameRate: 60 });
            this.anims.create({ key: 'jf_gir_' + n + '_tornada', frames: this.anims.generateFrameNumbers('jusef_gir_' + n, { start: fi, end: 1 }), frameRate: 60 });
        });
        this.anims.create({ key: 'jf_servei', frames: this.anims.generateFrameNumbers('jusef_servei', { start: 1, end: 12 }), frameRate: 20 });
        this.anims.create({ key: 'ineu_servei', frames: this.anims.generateFrameNumbers('ineu_servei', { start: 3, end: 15 }), frameRate: 26 });
        this.spJusef = this.add.sprite(0, 0, 'jusef_dret', 0).setOrigin(0.5, 0.97);
        this.kJusef = 1; this.sqJ = 1;
        // Cadena del cop de perfil (en Jusef és DRETÀ: la raqueta a la mà dreta, a l'esquerra de la pantalla quan mira de cara):
        //  pilota a la DRETA de la pantalla (a la seva esquerra) -> gira cap a la dreta i fa el REVERS; pilota a l'ESQUERRA (a la seva dreta) -> gira cap a l'esquerra i fa el DRIVE.
        // gir (fotogrames d'AutoSprite) -> cop -> gir de tornada -> de cara. Qualsevol altra animació acaba de cara.
        this.spJusef.on('animationcomplete', a => {
            const k = a.key;
            if (k === 'jf_gir_dreta') { this.posaJusef('jusef_revers_3q', 2, false); this.spJusef.play('jf_revers3q', true); }
            else if (k === 'jf_gir_esquerra') { this.posaJusef('jusef_cop_drive_esquerra', 1, false); this.spJusef.play('jf_drive_esq', true); }
            else if (k === 'jf_revers3q') { this.posaJusef('jusef_gir_dreta', 11, false); this.spJusef.play('jf_gir_dreta_tornada', true); }
            else if (k === 'jf_drive_esq') { this.posaJusef('jusef_gir_esquerra', 9, false); this.spJusef.play('jf_gir_esquerra_tornada', true); }
            else this.posaJusef('jusef_dret', 0);
        });
        this.auraJusef = this.add.ellipse(0, 0, 160, 190, 0xb890ff, 0).setDepth(1);
        this.ombra = this.add.ellipse(0, 0, 20, 8, 0x000000, 0.35).setDepth(0.6);
        this.pilota = this.add.circle(0, 0, 14, 0xfff6e0).setStrokeStyle(4, 0x3a2a14);
        this.halo = this.add.circle(0, 0, 24, 0xffffff, 0.3).setVisible(false);         // halo clar darrere la pilota: es veu sobre la roba blanca d'en Jusef i sobre la paret
        this.marcaBot = this.add.ellipse(0, 0, 40, 16).setStrokeStyle(3, 0xffd34d, 0.0).setDepth(0.55);
        this.anell = this.add.graphics().setDepth(21);                         // l'anell que es posa verd quan toca lliscar
        this.estela = this.add.graphics().setDepth(19);                        // estela del cop màgic
        // Interfície (a una càmera a part, perquè no es mogui amb la càmera del joc)
        const est = (mida, color) => ({ fontFamily: 'Georgia, serif', fontSize: mida + 'px', color, stroke: '#1a0e06', strokeThickness: 6, align: 'center' });
        this.estUI = est;
        this.txtMarcador = this.ui(this.add.text(20, 44, '', est(34, '#f2e6c8')).setOrigin(0, 0.5).setDepth(50));
        this.txtAvis = this.ui(this.add.text(AMPLE / 2, 416, '', { fontFamily: 'Georgia, serif', fontSize: '40px', color: '#ffe9a0', stroke: '#000000', strokeThickness: 8, align: 'center', wordWrap: { width: 540 } }).setOrigin(0.5).setDepth(50));
        this.txtCop = this.ui(this.add.text(0, 0, '', { fontFamily: 'Georgia, serif', fontSize: '40px', color: '#ffe9a0', stroke: '#000000', strokeThickness: 8, align: 'center', wordWrap: { width: 460 } }).setOrigin(0.5).setDepth(50));
        this.txtMode = this.ui(this.add.text(AMPLE - 20, 130, '', est(22, '#c8b890')).setOrigin(1, 0.5).setDepth(50));          // sota el botó del menú
        this.txtAjuda = null;                                                    // (sense text de tutorial a sota)
        this.estelaG = this.ui(this.add.graphics().setDepth(48));
        this.pistaCop = this.ui(this.add.text(0, 0, '', { fontFamily: 'Georgia, serif', fontSize: '34px', color: '#ffe9a0', stroke: '#000000', strokeThickness: 7, align: 'center' }).setOrigin(0.5, 1).setDepth(49).setVisible(false));
        this.btnSortir = this.ui(this.add.text(20, 94, 'Sortir ✕', { fontFamily: 'Georgia, serif', fontSize: '26px', color: '#f2e6c8', backgroundColor: '#1a120bcc', padding: { x: 12, y: 6 } })
            .setOrigin(0, 0.5).setDepth(50).setInteractive({ useHandCursor: true }).on('pointerdown', (p, x, y, ev) => { if (ev) ev.stopPropagation(); this.punxo = null; this.sortir(); }));
        // Estat
        this.Xi = 0; this.Xj = 0; this.lent = 1; this.zoomExtra = 0; this.punxo = null; this.traç = [];
        this.pulsIneu = 0; this.pulsJusef = 0; this.paradaFins = 0; this.rastre = [];
        this.rastreG = this.add.graphics().setDepth(8.8);                      // l'estela de la pilota
        this.flaix = this.ui(this.add.rectangle(0, 0, AMPLE, ALT_PP, 0xffffff, 0).setOrigin(0).setDepth(45));
        // celebració de l'Ineu en guanyar el PARTIT (no cada punt): fons fosc, línies de velocitat d'anime i l'Ineu gran
        this.celebFons = this.ui(this.add.rectangle(0, 0, AMPLE, ALT_PP, 0x180a26, 0).setOrigin(0).setDepth(44));
        this.celebLinies = this.ui(this.add.graphics().setDepth(45.5));
        this.celebActiva = 0;
        if (this.textures.exists('ineu_celebracio')) {
            this.anims.create({ key: 'celebra', frames: this.anims.generateFrameNumbers('ineu_celebracio', { start: 3, end: 15 }), frameRate: 14 });
            this.spCeleb = this.ui(this.add.sprite(AMPLE / 2, ALT_PP + 30, 'ineu_celebracio', 0).setOrigin(0.5, 1).setScale(2.0).setDepth(46.5).setVisible(false));
        }          // flaix a pantalla (cops perfectes i punts)
        this.input.on('pointerdown', p => this.alPrimer(p));
        this.input.on('pointermove', p => this.alMoure(p));
        this.input.on('pointerup', p => this.alSoltar(p));
        // Teclat (per provar): ESPAI/amunt = cop recte; ←/→ = cop cap a aquell costat; (la força és la normal)
        this.input.keyboard.on('keydown-SPACE', () => this.gestura(0, -300, 300, 1.0));
        this.input.keyboard.on('keydown-UP', () => this.gestura(0, -300, 300, 1.0));
        this.input.keyboard.on('keydown-LEFT', () => this.gestura(-150, -260, 300, 1.0));
        this.input.keyboard.on('keydown-RIGHT', () => this.gestura(150, -260, 300, 1.0));
        this.audio = null;
        // Càmera del joc (mòbil) i càmera de la interfície
        this.cameras.main.setBackgroundColor('#0d0b09');
        this.events.once('shutdown', () => { ESTAT_PP.mode = this.mode; ESTAT_PP.derrotes = this.derrotes; });
        this.camUI = this.cameras.add(0, 0, AMPLE, ALT);
        this.camUI.setZoom(this.kPantalla); this.camUI.centerOn(AMPLE / 2, ALT_PP / 2);
        this.camUI.ignore(this.children.list.filter(o => !this.uiLlista.includes(o)));
        this.cameras.main.ignore(this.uiLlista);
        this.nouPartit();
    }
    ui(o) { this.uiLlista.push(o); return o; }
    // posició del món a la pantalla (per posar els textos flotants sobre la pilota, malgrat la càmera)
    mundAPantalla(x, y) { const c = this.cameras.main; return { x: (x - c.midPoint.x) * c.zoom + AMPLE / 2, y: (y - c.midPoint.y) * c.zoom + ALT / 2 }; }

    // ---------------- Projecció ----------------
    proj(X, z, h = 0) { const Zc = T.ZN + z; return { x: AMPLE / 2 + T.F * X / Zc, y: T.HY + (T.K - T.F * h) / Zc, k: T.F / Zc }; }
    mon(px, z) { return (px - AMPLE / 2) * (T.ZN + z) / T.F; }          // x de pantalla → X del món (a la fondària z)

    // La sala del Celler, com al minijoc de debò: paret de pedra, terra fosc, llum d'espelmes i una taula amb potes, ombra i cantells
    dibuixaEscenari() {
        const M = 500;                                                      // el fons passa del llenç perquè la càmera es pot moure
        this.add.rectangle(-M, -M, AMPLE + 2 * M, ALT_PP + 2 * M, 0x140e0a, 1).setOrigin(0).setDepth(-10);
        // paret de pedra (maons de colors lleugerament diferents)
        const mur = this.add.graphics().setDepth(-9);
        let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
        for (let r = -9, y = -M; y < 300; r++, y += 46) {
            let x = -M - (r % 2 ? 40 : 0);
            while (x < AMPLE + M) {
                const w = 70 + rnd() * 60, t = 0.78 + rnd() * 0.3, c = Phaser.Display.Color.GetColor(Math.round(110 * t), Math.round(96 * t), Math.round(84 * t));
                mur.fillStyle(c, 1).fillRect(x + 2, y + 2, w - 4, 42);
                mur.fillStyle(0xffffff, 0.04).fillRect(x + 2, y + 2, w - 4, 6);
                mur.fillStyle(0x000000, 0.18).fillRect(x + 2, y + 38, w - 4, 6);
                x += w;
            }
        }
        mur.fillStyle(0x000000, 0.32).fillRect(-M, -M, AMPLE + 2 * M, 300 + M);          // la paret queda en penombra
        this.add.rectangle(-M, 300, AMPLE + 2 * M, ALT_PP + M - 300, 0x2a221c, 1).setOrigin(0).setDepth(-8);
        const llum = this.add.graphics().setDepth(-7);
        llum.fillStyle(0xffd38a, 0.06).fillEllipse(AMPLE / 2, 640, 900, 900);
        llum.fillStyle(0xffd38a, 0.05).fillEllipse(AMPLE / 2, 640, 600, 600);
        // espelmes de la paret (parpellegen)
        [630].forEach((x, i) => {
            const cd = this.add.graphics().setDepth(-6);
            cd.fillStyle(0x3a2a1a, 1).fillRect(x - 5, 140, 10, 90).fillStyle(0xe8dcc0, 1).fillRect(x - 7, 120, 14, 36);
            const fl = this.add.ellipse(x, 108, 14, 26, 0xffb040, 0.95).setDepth(-5);
            const halo = this.add.circle(x, 112, 70, 0xffc060, 0.14).setDepth(-6).setBlendMode(Phaser.BlendModes.ADD);
            this.tweens.add({ targets: [fl, halo], alpha: { from: 0.6, to: 1 }, scaleY: { from: 0.85, to: 1.12 }, yoyo: true, repeat: -1, duration: 380 + i * 110, ease: 'Sine.easeInOut' });
        });
        // El cartell de «prohibit jugar a pilota» (amb un ratolí), a la paret, darrere d'en Jusef: gris, difuminat i una mica tapat, perquè no faci ombra a la pilota blanca
        this.cartellProhibit();
        // taula, com al minijoc de debò
        const t = this.add.graphics().setDepth(0.1);
        const Pt = (X, z, h = 0) => this.proj(X, z, h), W = T.W, ALT_PATA = 0.76;
        const poli = (pts, c, a) => t.fillStyle(c, a).fillPoints(pts.map(q => ({ x: q.x, y: q.y })), true);
        poli([Pt(-W, 0, -ALT_PATA), Pt(W, 0, -ALT_PATA), Pt(W, T.L, -ALT_PATA), Pt(-W, T.L, -ALT_PATA)], 0x000000, 0.3);          // ombra al terra
        const pota = (X, z) => { const a = Pt(X, z, 0), b = Pt(X, z, -ALT_PATA), k = a.k * 0.06; t.fillStyle(0x3a2a1a, 1).fillRect(a.x - k, a.y, 2 * k, b.y - a.y).lineStyle(2, 0x1a0e06, 1).strokeRect(a.x - k, a.y, 2 * k, b.y - a.y); };
        pota(-W + 0.1, 0.08); pota(W - 0.1, 0.08); pota(-W + 0.1, T.L - 0.08); pota(W - 0.1, T.L - 0.08);
        const gr = 0.05;
        poli([Pt(-W, T.L, 0), Pt(W, T.L, 0), Pt(W, T.L, -gr), Pt(-W, T.L, -gr)], 0x134a30, 1);
        poli([Pt(-W, 0, 0), Pt(-W, T.L, 0), Pt(-W, T.L, -gr), Pt(-W, 0, -gr)], 0x0f3a26, 1);
        poli([Pt(W, 0, 0), Pt(W, T.L, 0), Pt(W, T.L, -gr), Pt(W, 0, -gr)], 0x0f3a26, 1);
        poli([Pt(-W, 0, 0), Pt(W, 0, 0), Pt(W, 0, -gr), Pt(-W, 0, -gr)], 0x134a30, 1);
        const cara = [Pt(-W, 0), Pt(W, 0), Pt(W, T.L), Pt(-W, T.L)];
        poli(cara, 0x1f6a46, 1);
        t.fillGradientStyle(0x3a9a6a, 0x3a9a6a, 0x1f6a46, 0x1f6a46, 0.22, 0.22, 0, 0).fillPoints(cara.map(q => ({ x: q.x, y: q.y })), true);
        t.lineStyle(5, 0xf2f2e8, 1).strokePoints(cara.map(q => ({ x: q.x, y: q.y })), true);
        t.lineStyle(2, 0xf2f2e8, 0.8).lineBetween(Pt(0, 0).x, Pt(0, 0).y, Pt(0, T.L).x, Pt(0, T.L).y);
        // xarxa (amb alçada de veritat)
        const a1 = Pt(-W, T.L / 2, 0), a2 = Pt(W, T.L / 2, 0), b1 = Pt(-W, T.L / 2, T.NH), b2 = Pt(W, T.L / 2, T.NH);
        const x = this.add.graphics().setDepth(10 - T.L / 2);
        x.fillStyle(0xe8e8e0, 0.22).fillPoints([a1, a2, b2, b1].map(q => ({ x: q.x, y: q.y })), true);
        x.lineStyle(2, 0xe8e8e0, 0.75); for (let k = 0; k <= 28; k++) { const X = -W + 2 * W * k / 28, u = Pt(X, T.L / 2, 0), v = Pt(X, T.L / 2, T.NH); x.lineBetween(u.x, u.y, v.x, v.y); }
        for (let k = 1; k < 4; k++) { const u = Pt(-W, T.L / 2, T.NH * k / 4), v = Pt(W, T.L / 2, T.NH * k / 4); x.lineBetween(u.x, u.y, v.x, v.y); }
        x.lineStyle(5, 0xffffff, 1).lineBetween(b1.x, b1.y, b2.x, b2.y);
        [[-1, a1, b1], [1, a2, b2]].forEach(([sg, a, b]) => { x.lineStyle(7, 0x2a2a2e, 1).lineBetween(a.x + sg * 8, a.y, b.x + sg * 8, b.y - 8); });
        // espurnes que pugen al voltant d'en Jusef (es veu que levita)
        const gt = this.add.graphics(); gt.fillStyle(0xffffff, 1).fillCircle(8, 8, 8); gt.generateTexture('espurna', 16, 16); gt.destroy();
        const pj = Pt(0, T.Z_JUSEF);
        this.add.particles(pj.x, pj.y - 20, 'espurna', { x: { min: -100, max: 100 }, speedY: { min: 14, max: 36 }, speedX: { min: -8, max: 8 }, lifespan: 1300,
            scale: { start: 0.35, end: 0 }, alpha: { start: 0.8, end: 0 }, tint: [0xd8b0ff, 0xffe08a, 0xffffff], frequency: 140, quantity: 1 }).setDepth(0.9);
    }

    // El cartell del ratolí («No oblideu apagar els llums», art/objectes/cartell_llums), a la paret del fons, darrere d'en Jusef: gris, difuminat i una mica tapat,
    // perquè el seu blanc no distregui del de la pilota
    cartellProhibit() {
        const img = this.add.image(88, 196, 'pp_cartell').setDepth(-4).setAngle(0).setTint(0x8c8a86);
        img.setScale(112 / img.width);
        try { if (img.postFX) img.postFX.addBlur(0, 0.7, 0.7, 1.0); } catch (e) { /* sense WebGL: es veu sense difuminar */ }
    }

    // Fotograma de repòs o d'un full d'en Jusef, amb el punt d'ancoratge (els peus i el centre del cos) i l'escala que li toquen: els fulls de perfil
    // (seu de cara a la dreta) tenen el cos més baix i descentrat. 'mirall' = el mira a l'esquerra.
    posaJusef(textura, fotograma, mirall = false) {
        const AN = { jusef_cop_drive_esquerra: [0.498, 0.859, 1.15], jusef_revers_3q: [0.496, 0.859, 1.15] }[textura] || [0.5, 0.97, 1];
        this.spJusef.setTexture(textura, fotograma).setOrigin(AN[0], AN[1]).setFlipX(mirall);
        this.kJusef = AN[2];
    }

    // Ancoratge fotograma a fotograma durant el gir (taula mesurada als fulls d'AutoSprite): centre i peus del cos; l'escala creix del de cara (1) al de perfil (1,15)
    ancoraGir() {
        const t = this.spJusef.texture.key;
        if (t !== 'jusef_gir_dreta' && t !== 'jusef_gir_esquerra') return;
        const f = parseInt(this.spJusef.frame.name, 10) || 0, a = GIR_AN[t][f];
        this.spJusef.setOrigin(a[0], a[1]); this.kJusef = 1 + 0.15 * Math.min(1, f / (t === 'jusef_gir_dreta' ? 11 : 8));
    }

    // (versió antiga, sense fulls de gir) Transició de gir: el cos s'estreny (com si es girés) fins a quasi de perfil, es canvia de full i s'obre de nou; llavors comença l'animació del cop (si n'hi ha).
    giraJusef(textura, fotograma, mirall, anim) {
        this.tweens.killTweensOf(this);
        this.spJusef.anims.stop();
        this.tweens.add({ targets: this, sqJ: 0.3, duration: 75, ease: 'Sine.easeIn', onComplete: () => {
            this.posaJusef(textura, fotograma, mirall);
            this.tweens.add({ targets: this, sqJ: 1, duration: 85, ease: 'Back.easeOut', onComplete: () => { if (anim) this.spJusef.play(anim, true); } });
        } });
    }

    // ---------------- Partit ----------------
    nouPartit() {
        this.punts = { ineu: 0, jusef: 0 }; this.serveis = 0; this.serveisJusef = 0; this.acabat = false;
        if (this.capa) { this.capa.destroy(); this.capa = null; }
        this.txtMode.setText(this.mode === 'facil' ? 'Mode fàcil' : '');
        this.actualitzaMarcador();
        this.preparaServei();
    }
    get M() { return MODES[this.mode]; }
    actualitzaMarcador() { this.txtMarcador.setText(`Ineu  ${this.punts.ineu}  ·  ${this.punts.jusef}  Jusef`); }
    serveixIneu() { return Math.floor(this.serveis / 2) % 2 === 0; }

    preparaServei() {
        this.b = null; this.tossJ = null; this.estat = 'servei'; this.rally = 0;
        this.pilota.setVisible(false); this.ombra.setVisible(false); this.marcaBot.setStrokeStyle(3, 0xffd34d, 0);
        if (this.serveixIneu()) {
            this.avis('Llisca cap amunt', 1600, '#f2e6c8');
            this.estat = 'serveiIneu';
        } else {
            this.serveisJusef++;
            this.time.delayedCall(900, () => (this.serveisJusef % 3 === 1 ? this.serveiMagic() : this.serveiJusef(false)));
        }
    }

    // El servei normal d'en Jusef (o el que ve després de trencar l'encanteri, més lent)
    serveiJusef(suau) {
        if (this.acabat) return;
        this.estat = 'joc';
        const X = Phaser.Math.FloatBetween(-0.55, 0.55);
        this.tweens.killTweensOf(this); this.sqJ = 1; this.posaJusef('jusef_dret', 0); this.spJusef.play('jf_servei', true); this.tossJ = { t0: this.time.now, dur: 420, magica: false };
        this.time.delayedCall(420, () => { if (!this.acabat) this.serveix('jusef', { X: this.Xj, z: T.L + 0.25, h: 0.3 }, X, Phaser.Math.FloatBetween(0.35, 0.9), suau ? 1.15 : 0.95); });
    }

    // ---- Servei màgic: la pilota encantada fa zigzags; només un cop PERFECTE trenca l'encanteri (i llavors en Jusef no la pot tornar) ----
    serveiMagic() {
        if (this.acabat) return;
        this.estat = 'res';
        this.avis('Servei màgic!', 1500, '#d8b0ff');
        this.tweens.add({ targets: this.auraJusef, fillAlpha: 0.4, duration: 300, yoyo: true, hold: 900 });
        this.so('magia');
        this.time.delayedCall(1500, () => {
            if (this.acabat) return;
            this.estat = 'joc';
            const X = Phaser.Math.FloatBetween(-0.5, 0.5) || 0.3;
            this.tweens.killTweensOf(this); this.sqJ = 1; this.posaJusef('jusef_dret', 0); this.spJusef.play('jf_servei', true); this.tossJ = { t0: this.time.now, dur: 420, magica: true };
            this.time.delayedCall(420, () => { if (!this.acabat) this.serveix('jusef', { X: this.Xj, z: T.L + 0.25, h: 0.3 }, X, Phaser.Math.FloatBetween(0.35, 0.75), 0.85, true); });
        });
    }

    // ---------------- Física de la pilota ----------------
    // Llança la pilota des de 'des' perquè boti a (Xt, zt) al cap de 'temps' segons (s'allarga si no passa la xarxa)
    // Velocitats per anar des de 'des' fins a botar a (Xt, zt) al cap de 'temps' segons (s'allarga si no passa la xarxa)
    vel(des, Xt, zt, temps) {
        let t = temps, vh;
        const vz = () => (zt - des.z) / t;
        for (let i = 0; i < 20; i++) {
            vh = (0 - des.h + 0.5 * T.G * t * t) / t;
            const tn = (T.L / 2 - des.z) / vz(), hn = des.h + vh * tn - 0.5 * T.G * tn * tn;
            if (tn < 0 || tn > t || hn > T.NH + 0.06) break;
            t += 0.06;
        }
        return { vx: (Xt - des.X) / t, vz: vz(), vh, t };
    }

    // Força mínima: després del primer bot al camp d'en Jusef la pilota ha de sortir de la taula (z > L) sense botar-hi una segona vegada.
    // Si el cop és massa fluix o curt, es fa més ràpid (menys temps fins al bot) i, si encara no n'hi ha prou (bot just darrere la xarxa), el bot es mou una mica cap enrere:
    // així el punt només el decideix on cau la pilota lateralment, mai un doble bot. Retorna { t, zt } (temps i fondària del bot ja ajustats).
    assegura(des, Xt, zt, temps) {
        const prou = (z, t) => {
            const v = this.vel(des, Xt, z, t);                       // v.t: el temps real fins al bot (s'allarga si cal passar la xarxa)
            const impacte = -(v.vh - T.G * v.t);                     // velocitat vertical en tocar la taula
            return z + v.vz * 0.97 * (2 * impacte * T.REST / T.G) >= T.L + 0.25;
        };
        for (let z = zt; z <= T.L - 0.25; z += 0.06) {
            let t = temps;
            for (let k = 0; k < 14; k++) { if (prou(z, t)) return { t, zt: z }; t = Math.max(0.32, t * 0.93); }
        }
        return { t: Math.max(0.32, temps * 0.6), zt: Math.min(zt + 0.4, T.L - 0.3) };
    }

    // SERVEI: la pilota ha de botar PRIMER al camp de qui serveix i després passar la xarxa i botar a l'altre camp
    serveix(qui, des, Xt, zt, temps, magica = false) {
        this.tossJ = null;
        const z1 = qui === 'ineu' ? 0.55 : T.L - 0.55;
        const v = this.vel(des, des.X + (Xt - des.X) * 0.25, z1, 0.4);
        this.b = { X: des.X, z: des.z, h: des.h, vx: v.vx, vz: v.vz, vh: v.vh, de: qui, bots: 0, decidit: false, morta: false, marca: { X: Xt, z: zt },
                   serveix: { Xt, zt, t: temps }, magica, t0: Math.random() * 6.28 };
        this.pilota.setVisible(true).setFillStyle(magica ? 0xe0b8ff : 0xfff6e0).setStrokeStyle(4, magica ? 0x3a1860 : 0x3a2a14); this.ombra.setVisible(true);
        const pm = this.proj(Xt, zt);
        this.marcaBot.setPosition(pm.x, pm.y).setSize(46 * pm.k / 300 * 1.4, 18 * pm.k / 300 * 1.4).setStrokeStyle(3, magica ? 0xd8b0ff : 0xffd34d, qui === 'jusef' ? 0.75 : 0);
        this.so('pala');
    }

    llanca(qui, des, Xt, zt, temps) {
        if (qui === 'ineu') { const aj = this.assegura(des, Xt, zt, temps); temps = aj.t; zt = aj.zt; }
        let t = temps, vh;
        const vz = () => (zt - des.z) / t;
        for (let i = 0; i < 20; i++) {
            vh = (0 - des.h + 0.5 * T.G * t * t) / t;
            const tn = (T.L / 2 - des.z) / vz(), hn = des.h + vh * tn - 0.5 * T.G * tn * tn;
            if (tn < 0 || tn > t || hn > T.NH + 0.06) break;
            t += 0.06;
        }
        this.b = { X: des.X, z: des.z, h: des.h, vx: (Xt - des.X) / t, vz: vz(), vh, de: qui, bots: 0, decidit: false, morta: false, marca: { X: Xt, z: zt } };
        this.b.xInt = Xt + this.b.vx * (T.L + 0.05 - zt) / this.b.vz;          // on passarà pel lloc d'en Jusef (la pilota segueix derivant de costat després del bot): allà s'ha de posar ell
        this.pilota.setVisible(true).setFillStyle(0xfff6e0).setStrokeStyle(4, 0x3a2a14); this.ombra.setVisible(true);
        // la marca d'on botarà (només quan ve cap a tu)
        const pm = this.proj(Xt, zt);
        this.marcaBot.setPosition(pm.x, pm.y).setSize(46 * pm.k / 300 * 1.4, 18 * pm.k / 300 * 1.4).setStrokeStyle(3, 0xffd34d, qui === 'jusef' ? 0.75 : 0);
        this.so('pala');
    }

    update(time, delta) {
        const dt = Math.max(1, delta) / 1000, b = this.b;
        // Càmera lenta (cop màgic): es recupera sola
        this.lent = Phaser.Math.Linear(this.lent, this.lentObj === undefined ? 1 : this.lentObj, 0.12);
        // L'Ineu ARRIBA SOL a la pilota: va cap a on arribarà (la marca groga); si no hi ha pilota, al mig
        let objI = 0;
        if (b && !b.morta && b.de === 'jusef' && b.serveix) objI = b.serveix.Xt;
        else if (b && !b.morta && b.de === 'jusef' && b.vz < 0) { const t = Math.max(0, (b.z - Z_COP) / -b.vz); objI = Phaser.Math.Clamp(b.X + b.vx * t, -0.72, 0.72); }
        else if (b && !b.morta && b.de === 'jusef') objI = b.marca.X;
        this.Xi += Phaser.Math.Clamp(objI - this.Xi, -7.5 * dt, 7.5 * dt);
        // L'Ineu és a primer pla: molt gran, només de genolls amunt, i el tall de baix és la vora de baix de la pantalla (es mou una mica a banda i banda)
        const pi = this.proj(this.Xi, T.Z_INEU), tall = this.tallIneu, comp = (this.compIneu[this.spIneu.texture.key] || [])[parseInt(this.spIneu.frame.name, 10)] || 1, ES = this.escIneu * comp * (1 + 0.05 * this.pulsIneu);
        this.pulsIneu *= Math.pow(0.0005, dt); this.pulsJusef *= Math.pow(0.0005, dt);
        this.spIneu.setScale(ES).setPosition(360 + Phaser.Math.Clamp((pi.x - 360) * 0.55, -150, 150), ALT_PP + 40 + (512 - tall) * ES).setDepth(12);
        // Simulació de la pilota (el temps del joc va més lent que el real, segons el mode i el cop màgic)
        const aturada = this.time.now < (this.parada_fins || 0) ? 0.06 : 1;
        if (b && !b.morta) this.simula(dt * this.M.temps * this.lent * aturada);
        this.pintaRastre(b);
        // Jusef: va cap a on arribarà la pilota
        let objJ = 0;
        if (this.b && this.b.de === 'ineu' && !this.b.morta) objJ = Phaser.Math.Clamp(this.b.xInt !== undefined ? this.b.xInt : this.b.marca.X, -0.85, 0.85);          // va just on cau (abans se'n passava quan el cop era fort)
        const pasJ = this.M.velJusef * dt;
        this.Xj += Phaser.Math.Clamp(objJ - this.Xj, -pasJ, pasJ);
        const pj = this.proj(this.Xj, T.Z_JUSEF);
        const flota = Math.sin(time / 400) * 6;
        this.ancoraGir();
        { const esc = 2.1 * pj.k / 400 * (1 + 0.07 * this.pulsJusef) * this.kJusef; this.spJusef.setPosition(pj.x, pj.y + flota).setScale(esc * this.sqJ, esc).setDepth(10 - T.Z_JUSEF); }
        this.spJusef.angle = Phaser.Math.Linear(this.spJusef.angle, Phaser.Math.Clamp((objJ - this.Xj) * 9, -6, 6), 0.2);                  // s'inclina cap a on corre
        this.auraJusef.setPosition(pj.x, pj.y - 120 + flota);
        if (this.estat === 'serveiIneu') {            // la pilota a la mà de l'Ineu
            const p = this.proj(this.Xi + 0.18, -0.15, 0.32 + Math.abs(Math.sin(time / 260)) * 0.12);
            this.pilota.setVisible(true).setPosition(p.x, p.y).setRadius(Math.max(13, 0.062 * p.k)).setDepth(9);
            this.ombra.setVisible(false);
        }
        // llançament de la pilota d'en Jusef abans del servei: puja de la seva mà i baixa (així es veu des del primer moment)
        if (this.tossJ) {
            const f = Math.min(1, (this.time.now - this.tossJ.t0) / this.tossJ.dur), p = this.proj(this.Xj + 0.14, T.L + 0.2, 0.5 + 0.5 * Math.sin(Math.PI * f));
            this.pilota.setVisible(true).setFillStyle(this.tossJ.magica ? 0xe0b8ff : 0xfff6e0).setPosition(p.x, p.y).setRadius(Math.max(13, 0.062 * p.k)).setDepth(7.6);
        }
        if (this.pilota.visible) this.halo.setVisible(true).setPosition(this.pilota.x, this.pilota.y).setRadius(this.pilota.radius * 1.7).setDepth(this.pilota.depth - 0.02);
        else this.halo.setVisible(false);
        this.pintaAnell();
        this.pintaCelebracio(time);
        this.pintaEstela();
        this.movCamera(dt);
    }

    // L'anell que es posa VERD quan toca lliscar: es veu a la pilota que arriba i passa de gris (lluny) a groc (a prop) a verd (ara!)
    // estela de la pilota: les últimes posicions, cada cop més petites i transparents (es nota quan va ràpid)
    pintaRastre(b) {
        const g = this.rastreG; g.clear();
        if (!b || b.morta) { this.rastre.length = 0; return; }
        const p = this.proj(this.visX(b), b.z, b.h);
        this.rastre.push({ x: p.x, y: p.y, r: Math.max(13, 0.062 * p.k) });
        if (this.rastre.length > 8) this.rastre.shift();
        const n = this.rastre.length;
        this.rastre.forEach((q, i) => { const f = i / n; g.fillStyle(b.magica ? 0xe0b8ff : 0xfff6e0, 0.32 * f).fillCircle(q.x, q.y, q.r * (0.35 + 0.6 * f)); });
    }

    pintaAnell() {
        const g = this.anell, b = this.b; g.clear();
        if (!b || b.morta || b.de !== 'jusef' || b.bots !== 1 || this.copFet === b) return;
        const eta = this.eta(b), F = this.M.finestra, B = this.M.bona, p = this.proj(this.visX(b), b.z, b.h);
        const r = Math.max(22, 0.05 * p.k * 2.4);
        if (eta <= B) {
            g.lineStyle(7, 0x58ff8a, 1).strokeCircle(p.x, p.y, r);                                                   // verd: ja pots lliscar
            if (eta <= F) g.lineStyle(6, 0xffffff, 1).strokeCircle(p.x, p.y, r * 0.66).lineStyle(3, 0x7ad8ff, 0.9).strokeCircle(p.x, p.y, r * 1.18);     // moment perfecte
        }
        else if (eta <= B * 2.2) g.lineStyle(5, 0xffd34d, 0.85).strokeCircle(p.x, p.y, r * (1 + Math.min(1, (eta - B) / (B * 1.2)) * 0.8));
        else g.lineStyle(3, 0xffffff, 0.3).strokeCircle(p.x, p.y, r * 1.8);
    }
    // posició X que es dibuixa (la pilota encantada fa zigzags, però la física i els cops fan servir b.X)
    visX(b) {
        if (!b.magica) return b.X;
        const env = b.bots === 0 ? 1 : Phaser.Math.Clamp((b.z - 0.35) / 1.1, 0, 1);
        return b.X + Math.sin(b.z * 8.5 + b.t0) * 0.3 * env;
    }

    // segons REALS que falten perquè la pilota arribi a l'Ineu
    eta(b) { return b.vz < 0 ? Math.max(0, (b.z - Z_COP) / -b.vz) / (this.M.temps * this.lent) : 99; }

    // L'estela lluminosa del lliscament
    pintaEstela() {
        const g = this.estelaG; g.clear();
        const t = this.traç; if (!t.length) return;
        const ara = this.time.now;
        while (t.length && ara - t[0].t > 700) t.shift();
        for (let i = 1; i < t.length; i++) { const a = 1 - (ara - t[i].t) / 700; g.lineStyle(14 * a + 3, 0xfff0a0, Math.max(0.1, a)).lineBetween(t[i - 1].x, t[i - 1].y, t[i].x, t[i].y); }
    }

    // Càmera mòbil: segueix la pilota una mica, s'acosta quan ve cap a tu, s'inclina lleugerament i fa «cop de zoom» en els cops forts
    movCamera(dt) {
        const c = this.cameras.main, b = this.b;
        let cx = AMPLE / 2, cy = ALT_PP / 2, z = 1.0, rot = 0;
        if (b && !b.morta) {
            const p = this.proj(b.X, b.z, b.h);
            cx += (p.x - AMPLE / 2) * 0.2; cy += (p.y - ALT_PP / 2) * 0.12 + 20;
            rot = Phaser.Math.Clamp((p.x - AMPLE / 2) / AMPLE, -0.5, 0.5) * 0.03;
            if (b.de === 'jusef' && b.bots === 1) z += 0.05 * (1 - Phaser.Math.Clamp(b.z / T.L, 0, 1));         // s'acosta quan ve cap a tu
        }
        z += this.zoomExtra; this.zoomExtra *= Math.pow(0.002, dt);
        if (this.lent < 0.8) z += 0.1;                                                                         // cop màgic
        c.setZoom(Phaser.Math.Linear(c.zoom, z * this.kPantalla, 0.1));
        c.setRotation(Phaser.Math.Linear(c.rotation, rot, 0.08));
        c.centerOn(Phaser.Math.Linear(c.midPoint.x, cx, 0.1), Phaser.Math.Linear(c.midPoint.y, cy, 0.1));
    }

    simula(dt) {
        const b = this.b;
        const pasos = Math.ceil(dt / 0.004);
        for (let i = 0; i < pasos && !b.morta; i++) {
            const d = dt / pasos, zAbans = b.z;
            b.X += b.vx * d; b.z += b.vz * d; b.vh -= T.G * d; b.h += b.vh * d;
            if (b.de === 'jusef' && b.bots === 1 && this.copFet !== b && b.vz < 0 && b.z <= Z_COP - 0.5) { this.copFet = b; this.txtCopa('Massa tard!', '#ff9a7a', this.proj(b.X, b.z, b.h)); this.so('mal'); }
            // xarxa
            if ((zAbans - T.L / 2) * (b.z - T.L / 2) <= 0 && b.h < T.NH && Math.abs(b.X) < T.W + 0.1) {
                b.vz = -b.vz * 0.15; b.vx *= 0.3; this.so('xarxa'); this.cameras.main.shake(100, 0.004); { const q = this.proj(b.X, T.L / 2, T.NH); this.chispes(q.x, q.y, 8, [0xffffff, 0xd8d0c0], 160, 0.3, 380); }
                this.finalBola(b.de === 'ineu' ? 'jusef' : 'ineu', 'A la xarxa!');
                return;
            }
            // bot a la taula, o a terra
            if (b.h <= 0 && b.vh < 0) {
                if (Math.abs(b.X) <= T.W && b.z >= 0 && b.z <= T.L) {
                    b.h = 0; b.vh = -b.vh * T.REST; b.vx *= 0.97; b.vz *= 0.97;
                    this.so('bot'); { const q = this.proj(b.X, b.z, 0); this.botPilota(q.x, q.y); }
                    const banda = b.z < T.L / 2 ? 'ineu' : 'jusef';
                    if (banda === b.de) {
                        if (b.serveix) { const sv = b.serveix; b.serveix = null; if (b.de === 'ineu') { const aj = this.assegura({ X: b.X, z: b.z, h: 0 }, sv.Xt, sv.zt, sv.t); sv.t = aj.t; sv.zt = aj.zt; }
                        const v = this.vel({ X: b.X, z: b.z, h: 0 }, sv.Xt, sv.zt, sv.t); b.vx = v.vx; b.vz = v.vz; b.vh = v.vh; b.xInt = sv.Xt + v.vx * (T.L + 0.05 - sv.zt) / v.vz; continue; }     // servei: primer bot al seu camp
                        this.finalBola(b.de === 'ineu' ? 'jusef' : 'ineu', 'Ha botat al seu camp'); return;
                    }
                    b.bots++;
                    if (b.bots >= 2) {
                        // un cop fluix o curt bota dos cops al seu camp abans d'arribar al lloc on en Jusef el torna: llavors també l'ha d'intentar tornar (si hi arriba), no donar-lo per perdut
                        if (banda === 'jusef' && b.de === 'ineu' && !b.decidit) { b.decidit = true; this.copJusef(); if (b !== this.b) return; }
                        this.finalBola(b.de, banda === 'ineu' ? 'No hi has arribat' : (b.motiu || 'En Jusef no hi arriba!')); return; }
                    if (banda === 'ineu') this.marcaBot.setStrokeStyle(3, 0xffd34d, 0);
                } else {
                    this.finalBola(b.bots >= 1 ? b.de : (b.de === 'ineu' ? 'jusef' : 'ineu'), b.bots >= 1 ? (b.de === 'ineu' ? (b.motiu || 'En Jusef no hi arriba!') : 'No hi has arribat') : 'Fora!');
                    return;
                }
            }
            // En Jusef torna la pilota (quan ja ha botat al seu camp)
            if (b.de === 'ineu' && b.bots === 1 && !b.decidit && b.z > T.L + 0.05) { b.decidit = true; this.copJusef(); if (b !== this.b) return; }
            // Ha passat de llarg
            if (b.z < -1.4 || b.z > T.L + 1.5) { this.finalBola(b.bots >= 1 ? b.de : (b.de === 'ineu' ? 'jusef' : 'ineu'), b.bots >= 1 ? (b.de === 'ineu' ? (b.motiu || 'En Jusef no hi arriba!') : 'No hi has arribat') : 'Fora!'); return; }
        }
        this.pintaPilota();
    }

    pintaPilota() {
        const b = this.b, p = this.proj(this.visX(b), b.z, b.h), s = this.proj(b.X, b.z, 0);
        this.pilota.setPosition(p.x, p.y).setRadius(Math.max(13, 0.062 * p.k)).setDepth(b.z > T.L / 2 ? 10 - b.z + 0.01 : 9);      // a la teva banda, per DARRERE de l'Ineu (que la tapa)
        const r = Math.max(7, 0.05 * s.k * 0.8);
        const sobreTaula = Math.abs(b.X) <= T.W && b.z >= 0 && b.z <= T.L;
        this.ombra.setPosition(s.x, s.y).setSize(r * 2.2, r * 0.9).setAlpha(sobreTaula ? Phaser.Math.Clamp(0.45 - b.h * 0.6, 0.12, 0.45) : 0);
    }

    // En Jusef torna la pilota si hi arriba. NO hi ha cap sorteig: arriba si la pilota cau dins del seu abast des d'on és (es mou cap on cau, a velocitat limitada). Si no hi arriba, es diu per què:
    //  · cop FORT: no té temps d'arribar-hi ("Massa ràpid"); cop TALLAT: és curt i no s'hi acosta ("Cop tallat"); la resta: cau massa lluny d'on és
    //  · l'encanteri màgic trencat: no el pot tornar mai. Així, apuntar als racons, i colpejar fort o tallat, és com es guanyen els punts.
    copJusef() {
        const b = this.b, M = this.M;
        const lat = b.X - this.Xj;
        if (Math.abs(lat) < 0.12) { this.tweens.killTweensOf(this); this.sqJ = 1; this.posaJusef('jusef_dret', 0); this.spJusef.play(b.X < this.Xj ? 'jf_dret' : 'jf_revers', true); }       // a prop del mig: els de cara (dretà: la pilota a l'esquerra de la pantalla és drive)
        else if (lat > 0) { this.posaJusef('jusef_gir_dreta', 1, false); this.spJusef.play('jf_gir_dreta', true); }       // pilota a la dreta de la pantalla (a la seva esquerra): gira cap a la dreta i fa el revers
        else { this.posaJusef('jusef_gir_esquerra', 1, false); this.spJusef.play('jf_gir_esquerra', true); }               // pilota a l'esquerra (a la seva dreta): gira cap a l'esquerra i fa el drive
        this.juiceCopJusef(this.proj(b.X, b.z, b.h));
        const dx = Math.abs(b.X - this.Xj);
        const abast = M.abastJusef;          // el mateix abast per a tots els cops: si és ben situat lateralment, la torna sempre
        if (b.tipus === 'magic') { b.motiu = 'L\'encanteri trencat: no hi pot fer res!'; return; }
        if (dx > abast) {
            b.motiu = b.tipus === 'fort' ? 'En Jusef no hi arriba!' : b.tipus === 'tallat' ? 'Cop tallat: en Jusef no hi arriba!' : 'Massa lluny per a en Jusef!';
            return;                                                          // la pilota segueix i és punt de l'Ineu
        }
        this.rally++;
        const lluny = Math.random() < 0.6 ? -Math.sign(this.Xi || 1) * Phaser.Math.FloatBetween(0.25, 0.62) : Phaser.Math.FloatBetween(-0.6, 0.6);
        const temps = b.qualitat === 'fluix' ? 0.55 : Math.max(0.62, 0.95 - this.rally * 0.03);
        this.llanca('jusef', { X: b.X, z: b.z, h: Math.max(0.15, b.h) }, lluny, Phaser.Math.FloatBetween(0.3, 1.05), temps);
    }

    // ---------------- «Game juice»: espurnes, anells d'impacte, parada breu, flaix, pols de la pilota i estela ----------------
    chispes(x, y, n, tints, vel = 320, mida = 0.5, vida = 480) {
        const em = this.add.particles(x, y, 'espurna', { speed: { min: vel * 0.35, max: vel }, angle: { min: 0, max: 360 }, lifespan: vida, scale: { start: mida, end: 0 }, alpha: { start: 1, end: 0 },
            tint: tints, gravityY: 380, emitting: false }).setDepth(30);
        this.camUI.ignore(em); em.explode(n);
        this.time.delayedCall(vida + 200, () => em.destroy());
    }
    anellImpacte(x, y, color, r = 100) {
        const g = this.add.graphics().setDepth(30), o = { r: 12, a: 1 }; this.camUI.ignore(g);
        this.tweens.add({ targets: o, r, a: 0, duration: 330, ease: 'Cubic.easeOut', onUpdate: () => { g.clear().lineStyle(8 * o.a + 1, color, o.a).strokeCircle(x, y, o.r); }, onComplete: () => g.destroy() });
    }
    parada(ms) { this.parada_fins = this.time.now + ms; }
    flaixPantalla(a = 0.22, ms = 160) { this.tweens.killTweensOf(this.flaix); this.flaix.setAlpha(a); this.tweens.add({ targets: this.flaix, alpha: 0, duration: ms }); }
    // la pilota s'aixafa en botar i aixeca una mica de pols
    botPilota(x, y) {
        this.tweens.killTweensOf(this.pilota);
        this.pilota.setScale(1.45, 0.6); this.tweens.add({ targets: this.pilota, scaleX: 1, scaleY: 1, duration: 130, ease: 'Back.easeOut' });
        this.chispes(x, y, 5, [0xd8d0c0, 0xa89c88], 90, 0.28, 320);
    }
    // el cop que fa l'Ineu: espurnes, anell, parada, tremolor, cop de zoom i l'Ineu s'infla un moment
    juiceCopIneu(bp, fort) {
        this.chispes(bp.x, bp.y, fort ? 22 : 12, fort ? [0xffffff, 0x7ad8ff, 0xffe9a0] : [0xffe9a0, 0xffffff], fort ? 460 : 300, fort ? 0.6 : 0.45);
        this.anellImpacte(bp.x, bp.y, fort ? 0x7ad8ff : 0xffe9a0, fort ? 130 : 90);
        this.parada(fort ? 85 : 45); this.pulsIneu = fort ? 1 : 0.6;
        this.cameras.main.shake(fort ? 150 : 90, fort ? 0.007 : 0.004); this.zoomExtra = fort ? 0.08 : 0.04;
        if (fort) this.flaixPantalla(0.2);
    }
    // el cop d'en Jusef: espurnes lila i blanques, anell, aura i un petit tremolor
    juiceCopJusef(bp) {
        this.chispes(bp.x, bp.y, 14, [0xd8b0ff, 0xffffff, 0xffe9a0], 320, 0.5);
        this.anellImpacte(bp.x, bp.y, 0xd8b0ff, 100);
        this.parada(35); this.pulsJusef = 1; this.cameras.main.shake(90, 0.003);
        this.tweens.add({ targets: this.auraJusef, fillAlpha: 0.55, duration: 90, yoyo: true });
    }

    // ---------------- El gest: un lliscament cap amunt ----------------
    alPrimer(p) {
        this.punxo = { x: p.x, y: p.y, t: this.time.now }; this.traç = [{ x: p.x, y: p.y, t: this.time.now }];
    }
    alMoure(p) {
        if (!this.punxo) return;
        this.traç.push({ x: p.x, y: p.y, t: this.time.now });
        // (cap text en els cops: només surt el cop, amb el seu «juice»)
    }
    alSoltar(p) {
        if (!this.punxo || this.acabat) { this.punxo = null; return; }
        const ini = this.punxo; this.punxo = null; this.pistaCop.setVisible(false);
        const dx = p.x - ini.x, dy = p.y - ini.y, len = Math.hypot(dx, dy), ms = Math.max(30, this.time.now - ini.t);
        this.gestura(dx, dy, len, len / ms);
    }
    gestura(dx, dy, len, vel) {
        if (this.acabat) return;
        if (this.txtAjuda) this.txtAjuda.setAlpha(0);
        if (len < 40 || dy > -20) { this.avisCurt('Llisca cap amunt!'); return; }                       // un toc o un lliscament cap avall no és un cop
        // Paràmetres del cop: direcció (aim), profunditat (0..1) i força (0..1)
        const aim = Phaser.Math.Clamp(dx / Math.max(60, -dy), -1, 1) * 0.66;
        const prof = Phaser.Math.Clamp((len - 70) / 360, 0, 1);
        const forca = Phaser.Math.Clamp((vel - 0.35) / 1.5, 0, 1);               // vel en px/ms
        if (this.estat === 'serveiIneu') {
            this.estat = 'joc';
            this.spIneu.play('ineu_servei', true);
            const Xs = Phaser.Math.Clamp(aim, -0.62, 0.62), zs = T.L * (0.62 + 0.3 * prof), ts = 0.95 - 0.2 * forca;
            this.time.delayedCall(260, () => { if (this.acabat) return; this.serveix('ineu', { X: this.Xi + 0.18, z: -0.15, h: 0.3 }, Xs, zs, ts); this.b.qualitat = 'be'; this.b.tipus = 'normal'; });
            return;
        }
        const b = this.b;
        if (this.estat !== 'joc' || !b || b.morta || b.de !== 'jusef') return;
        if (b.bots < 1) { this.avisCurt('Massa aviat'); return; }
        const eta = this.eta(b);
        if (this.copFet === b) return;
        if (eta > this.M.bona) { this.avisCurt('Massa aviat'); return; }                   // encara no: es pot tornar a intentar
        this.copFet = b;
        this.copIneu(aim, prof, forca, eta);
    }
    avisCurt() { /* sense textos */ }
    avisCurtVell(t) { const bp = this.b && !this.b.morta ? this.proj(this.b.X, this.b.z, this.b.h) : { x: AMPLE / 2, y: 900 }; this.txtCopa(t, '#ffd34d', bp); }

    // El cop de l'Ineu, amb el que ha fet el dit
    copIneu(aim, prof, forca, eta) {
        const b = this.b, M = this.M;
        if (Math.abs(b.X - this.Xi) > M.abast) { this.txtCopa('Massa lluny!', '#ff9a7a', this.proj(b.X, b.z, b.h)); this.b.bots = 2; this.finalBola('jusef', 'No hi has arribat'); return; }
        const q = eta <= M.finestra ? 'perfecte' : 'be';
        // Errada: un cop perfecte és exacte; un de bé té un petit error (més gran com més fort i més lluny)
        const err = q === 'perfecte' ? 0 : (0.07 + 0.16 * forca);
        const Xt = Phaser.Math.Clamp(aim + Phaser.Math.FloatBetween(-err, err), -0.78, 0.78);
        let zt = T.L * 0.5 + 0.3 + prof * (T.L * 0.5 - 0.35) + (q === 'perfecte' ? 0 : Phaser.Math.FloatBetween(-err, err * 1.5));
        const temps = 1.0 - 0.52 * forca;
        this.gest(Xt >= this.Xi);
        this.llanca('ineu', { X: b.X, z: b.z, h: Math.max(0.12, b.h) }, Xt, zt, temps);
        this.b.qualitat = forca > 0.65 ? 'perfecte' : q; this.b.tipus = forca > 0.65 ? 'fort' : prof < 0.3 ? 'tallat' : 'normal';
        const noms = { normal: 'Bé', fort: 'FORT!', tallat: 'Tallat!' };
        const bp = this.proj(b.X, b.z, b.h);
        if (b.magica) {
            if (q === 'perfecte') { this.b.tipus = 'magic'; this.b.qualitat = 'perfecte'; this.txtCopa('ENCANTERI TRENCAT!', '#d8b0ff', bp); this.so('magia'); this.zoomExtra = 0.1; }
            else { this.b.qualitat = 'fluix'; this.b.tipus = 'normal'; this.txtCopa('L\'encanteri resisteix...', '#ff9a7a', bp); }
        } else
        this.txtCopa(q === 'perfecte' ? 'PERFECTE ' + noms[this.b.tipus] : noms[this.b.tipus], q === 'perfecte' ? '#7ad8ff' : '#a0ffb0', bp);
        this.juiceCopIneu(bp, q === 'perfecte' || forca > 0.65);
        if (q === 'perfecte' || forca > 0.65) this.so('fort');
    }

    gest(dreta) { this.spIneu.play(dreta ? 'drive' : 'reves', true); }
    txtCopa() { /* sense textos en els cops */ }

    // ---------------- Punts ----------------
    finalBola(guanyador, text) {
        if (!this.b || this.b.morta) return;
        this.b.morta = true;
        this.time.delayedCall(450, () => { this.pilota.setVisible(false); this.ombra.setVisible(false); });
        this.punt(guanyador, text);
    }
    punt(guanyador, text) {
        if (this.acabat) return;
        this.estat = 'punt';
        this.marcaBot.setStrokeStyle(3, 0xffd34d, 0);
        this.punts[guanyador]++;
        this.serveis++;
        this.actualitzaMarcador();
        this.so(guanyador === 'ineu' ? 'be' : 'mal');
        if (guanyador === 'ineu') { const c = this.proj(0, T.L * 0.78); this.chispes(c.x, c.y, 34, [0xffe9a0, 0xffffff, 0x7ad8ff, 0xff9ac8], 520, 0.7, 900); this.flaixPantalla(0.18, 260); }
        else { this.cameras.main.shake(220, 0.006); this.pulsJusef = 1; }
        this.avis(guanyador === 'ineu' ? 'Punt teu!' : 'Punt d\'en Jusef.', 1600, '#ffe9a0');          // només això: cap explicació de per què
        const { ineu, jusef } = this.punts;
        const golejada = Math.max(ineu, jusef) >= T.PUNTS_ZERO && Math.min(ineu, jusef) === 0;          // 7-0 (o 0-7): s'acaba igualment, victòria o derrota
        if (((ineu >= T.PUNTS || jusef >= T.PUNTS) && Math.abs(ineu - jusef) >= 2) || golejada) { this.time.delayedCall(1400, () => this.final(ineu > jusef)); return; }
        this.time.delayedCall(1500, () => this.preparaServei());
    }

    final(guanyat) {
        this.acabat = true; this.guanyat = guanyat; this.estat = 'final'; this.txtAvis.setAlpha(0); this.tweens.killTweensOf(this.txtAvis);
        if (!guanyat) this.derrotes++;
        if (guanyat && this.spCeleb) { this.celebraVictoria(() => this.tancar(true)); return; }
        if (guanyat) { this.tancar(true); return; }
        this.panellFinal(false);
    }

    // ---- Celebració de l'Ineu en guanyar el partit (animació d'AutoSprite + efectes d'anime) ----
    celebraVictoria(fet) {
        const sp = this.spCeleb;
        if (this.btnSortir) this.btnSortir.setVisible(false).disableInteractive();          // durant la celebració no hi ha «Sortir»: tocar la pantalla ja la tanca
        this.celebActiva = this.time.now;
        this.tweens.add({ targets: this.celebFons, fillAlpha: 0.74, duration: 260 });
        this.flaixPantalla(0.9, 380);
        this.cameras.main.shake(400, 0.01);
        // 1) «HAS GUANYAT!» en lletres d'onomatopeia d'anime: cada lletra cau gran amb un impacte
        const lletres = [];
        const font = 'Bangers, Impact, sans-serif';          // tipografia de còmic, allotjada al nostre servidor (assets/fonts/)
        const linia = (text, y, mida, t0) => {
            const objs = text.split('').map(ch => {
                const mk = (stroke, sw, color, dx, dy) => this.add.text(0, 0, ch, { fontFamily: font, fontSize: mida + 'px', color, stroke, strokeThickness: sw, padding: { x: 30, y: 30 } }).setOrigin(0.5).setDepth(46).setAngle(0);
                const grup = [mk('#2a0a3a', 34, '#2a0a3a'), mk('#ffffff', 20, '#ffffff'), mk('#c4161c', 10, '#ffb020'), mk('#c4161c', 0, '#ffe9a0')];     // ombra lila, vora blanca, vora vermella i farciment groc
                grup[3].setScale(1); grup.forEach(o => { this.cameras.main.ignore(o); o.setVisible(false); });
                return { ch, grup, w: grup[3].width - 60 };          // (el padding de 30 per banda no compta a l'espaiat)
            });
            const total = objs.reduce((a, o) => a + o.w + 12, -12); let x = AMPLE / 2 - total / 2;
            objs.forEach((o, k) => { o.x = x + o.w / 2; x += o.w + 12; o.y = y; o.rot = (t0 ? 3 : -4) + Phaser.Math.FloatBetween(-2.5, 2.5); lletres.push(o); });
        };
        linia('HAS', 305, 150, 0);
        linia('GUANYAT!', 480, 104, 1);
        // TOT el text apareix de cop, amb una explosió de còmic (estil K.O. de Street Fighter / Dr. Slump): estrella dentada darrere, flaix blanc, tremolor fort
        const expl = this.add.graphics().setDepth(45.9); this.cameras.main.ignore(expl);
        const punts = [], N = 26, cx = AMPLE / 2, cy = 400;
        for (let k = 0; k < N * 2; k++) { const a = (k / (N * 2)) * Math.PI * 2, r = k % 2 ? 250 + Math.random() * 40 : 360 + Math.random() * 110; punts.push({ x: Math.cos(a) * r, y: Math.sin(a) * r * 0.82 }); }
        expl.setPosition(cx, cy);
        expl.fillStyle(0xc4161c, 1).fillPoints(punts.map(q => ({ x: q.x * 1.06, y: q.y * 1.06 })), true);
        expl.fillStyle(0xff9a20, 1).fillPoints(punts.map(q => ({ x: q.x * 0.92, y: q.y * 0.92 })), true);
        expl.fillStyle(0xffe34a, 1).fillPoints(punts.map(q => ({ x: q.x * 0.74, y: q.y * 0.74 })), true);
        expl.setScale(0.05).setAngle(-8);
        this.tweens.add({ targets: expl, scale: 1.12, angle: 2, duration: 240, ease: 'Back.easeOut' });
        this.tweens.add({ targets: expl, scale: 1.0, duration: 320, delay: 240, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 });
        lletres.forEach(o => o.grup.forEach(g => { if (o.ch === ' ') return; g.setVisible(true).setPosition(o.x, o.y).setAngle(o.rot).setScale(0.05); this.tweens.add({ targets: g, scale: 1.18, duration: 190, ease: 'Back.easeOut' }); this.tweens.add({ targets: g, scale: 1, duration: 170, delay: 190, ease: 'Sine.easeInOut' }); }));
        this.flaixPantalla(1, 420); this.cameras.main.shake(600, 0.016);
        this.so('fort'); this.time.delayedCall(80, () => this.so('magia')); this.time.delayedCall(240, () => this.so('fort'));
        this.chispesUI(cx, cy, 60, [0xffffff, 0xffe9a0, 0xff9a20, 0xff5a3a], 900, 0.9, 700);
        // el text vibra suaument mentre dura la celebració
        const vibra = this.time.addEvent({ delay: 60, loop: true, callback: () => lletres.forEach((o, k) => o.grup.forEach(g => { if (g.visible) g.y = o.y + Math.sin(this.time.now / 90 + k) * 3; })) });
        // 2) després, per davant del text, l'Ineu salta
        this.time.delayedCall(1300, () => {
            this.spIneu.setVisible(false);          // el gràfic de l'Ineu jugador desapareix: només es veu el de la celebració
            sp.setVisible(true).setScale(2.0).setPosition(AMPLE / 2, ALT_PP + 30).play('celebra');
            this.so('be'); this.time.delayedCall(300, () => this.so('fort'));
            this.flaixPantalla(0.35, 220);
            [0, 380, 760, 1150].forEach((t, i) => this.time.delayedCall(t, () => this.chispesUI(AMPLE / 2 + (i % 2 ? 90 : -90), 700, 34, [0xffe9a0, 0xffffff, 0x7ad8ff, 0xff9ac8, 0xa0ffb0], 700, 0.8, 1100)));
            this.tweens.add({ targets: sp, scaleX: 2.15, scaleY: 2.15, duration: 520, delay: 380, yoyo: true, ease: 'Back.easeOut' });
            sp.once('animationcomplete', () => {
                // l'Ineu es queda fix (últim fotograma) amb el text darrere; en tocar la pantalla es passa al panell final
                // l'últim fotograma no queda aturat: l'Ineu hi flota amunt i avall, amb un lleuger balanceig
                const yBase = sp.y;
                this.tweens.add({ targets: sp, y: yBase - 16, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
                this.tweens.add({ targets: sp, angle: { from: -1.6, to: 1.6 }, duration: 1700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
                this.time.delayedCall(500, () => this.input.once('pointerdown', () => {
                    this.tweens.add({ targets: [sp, expl, ...lletres.flatMap(o => o.grup)], alpha: 0, duration: 280, onComplete: () => {
                        vibra.remove(); expl.destroy(); lletres.forEach(o => o.grup.forEach(g => g.destroy()));
                        this.tweens.killTweensOf(sp); sp.setVisible(false).setAlpha(1).setAngle(0).setY(yBase); this.spIneu.setVisible(true); this.celebActiva = 0; this.celebLinies.clear(); this.celebFons.setFillStyle(0x180a26, 0); fet();
                    } });
                }));
            });
        });
    }
    // línies de velocitat radials, que pampalluguen i giren una mica (estil anime)
    pintaCelebracio(time) {
        const g = this.celebLinies; g.clear();
        if (!this.celebActiva) return;
        const t = (this.time.now - this.celebActiva) / 1000, cx = AMPLE / 2, cy = ALT_PP * 0.5, n = 46, alfa = Math.min(1, t * 3);
        for (let i = 0; i < n; i++) {
            const a = (i / n) * Math.PI * 2 + Math.sin(time / 900) * 0.04, f = Math.sin(time / 70 + i * 3.1) * 0.5 + 0.5;
            const r0 = 230 + (i % 3) * 40 + f * 40, r1 = 900 + (i % 4) * 120;
            g.lineStyle(3 + (i % 5) * 2.2, i % 2 ? 0xffe9a0 : 0xffffff, alfa * (0.28 + 0.4 * f)).lineBetween(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
        }
        g.fillStyle(0xffe9a0, 0.1 * alfa).fillCircle(cx, cy + 60, 260 + Math.sin(time / 160) * 14);
    }
    chispesUI(x, y, n, tints, vel = 320, mida = 0.5, vida = 480) {
        const em = this.add.particles(x, y, 'espurna', { speed: { min: vel * 0.35, max: vel }, angle: { min: 0, max: 360 }, lifespan: vida, scale: { start: mida, end: 0 }, alpha: { start: 1, end: 0 }, tint: tints, gravityY: 300, emitting: false }).setDepth(47);
        this.cameras.main.ignore(em); em.explode(n);
        this.time.delayedCall(vida + 200, () => em.destroy());
    }

    panellFinal(guanyat) {
        const c = this.capa = this.add.container(0, 0).setDepth(100); this.cameras.main.ignore(c);
        c.add(this.add.rectangle(0, 0, AMPLE, ALT_PP, 0x000000, 0.6).setOrigin(0).setInteractive());
        const est = (m, col) => ({ fontFamily: 'Georgia, serif', fontSize: m + 'px', color: col, stroke: '#1a0e06', strokeThickness: 6, align: 'center', wordWrap: { width: 600 } });
        c.add(this.add.text(AMPLE / 2, 460, 'En Jusef guanya el partit', est(48, '#ff9a7a')).setOrigin(0.5));
        c.add(this.add.text(AMPLE / 2, 540, `${this.punts.ineu} - ${this.punts.jusef}`, est(40, '#f2e6c8')).setOrigin(0.5));
        const boto = (y, text, fn) => {
            const r = this.add.rectangle(AMPLE / 2, y, 440, 90, 0x6a4426, 1).setStrokeStyle(4, 0xd4af37).setInteractive({ useHandCursor: true });
            const t = this.add.text(AMPLE / 2, y, text, est(32, '#f2e6c8')).setOrigin(0.5);
            r.on('pointerdown', (p, x, y, ev) => { ev.stopPropagation(); fn(); });
            c.add([r, t]);
        };
        if (!guanyat && this.derrotes >= 2 && this.mode !== 'facil') {
            c.add(this.add.text(AMPLE / 2, 650, 'Vols tornar-ho a provar en mode fàcil?\n(pilota més lenta, més marge)', est(28, '#f2e6c8')).setOrigin(0.5));
            boto(780, 'Sí, més fàcil', () => { this.mode = 'facil'; this.nouPartit(); });
            boto(900, 'No, igual', () => this.nouPartit());
            boto(1020, 'Marxar', () => this.sortir());
        } else {
            boto(720, 'Tornar a jugar', () => this.nouPartit());
            boto(840, 'Marxar', () => this.sortir());
            if (this.mode === 'facil') boto(960, 'Tornar al mode normal', () => { this.mode = 'normal'; this.nouPartit(); });
        }
    }

    // Sortir (botó, ESC o «Marxar»): es considera partit abandonat. Un cop guanyat, només es surt en tocar la pantalla de la celebració
    sortir() {
        if (this.sortint || this.guanyat) return;
        this.sortint = true;
        this.tancar(false, true);
    }

    // Tanca el minijoc: la zona i el HUD es desperten i s'obre el diàleg d'en Jusef (premi si has guanyat)
    tancar(guanyat, abandonat = false) {
        // Si has guanyat, en Jusef ha de poder acostar-se a donar-te el premi: l'Ineu es posa al nord de la taula (no a sobre), al costat d'en Jusef
        if (guanyat && this.zona && this.zona.ineu && this.zona.AX) {
            const z = this.zona, x = z.AX - 90, y = 480;
            z.ineu.setPosition(x, y);
            if (z.ineu.body) z.ineu.body.reset(x, y);
        }
        if (this.zona) this.scene.wake(this.zona.scene.key);
        const ui = this.scene.get('UI');
        if (ui) ui.bloquejatFins = ui.time.now + 300;
        this.scene.stop();
        if (ui) ui.obrirDialeg(guanyat ? DIALEGS.jusefGuanyat(Estat) : DIALEGS.jusefPerdut(Estat, abandonat), () => Estat.desar());
    }

    avis(text, ms, color) {
        this.txtAvis.setText(text).setColor('#ffe9a0').setAlpha(1);
        this.tweens.killTweensOf(this.txtAvis);
        this.tweens.add({ targets: this.txtAvis, alpha: 0, delay: ms, duration: 300 });
    }

    // ---------------- So (WebAudio, sense fitxers) ----------------
    so(tipus, n = 0) {
        try {
            if (!this.audio) this.audio = new (window.AudioContext || window.webkitAudioContext)();
            const a = this.audio, t = a.currentTime, o = a.createOscillator(), g = a.createGain();
            const def = { bot: [1100, 0.05, 'square', 0.08], pala: [520, 0.07, 'triangle', 0.25], fort: [220, 0.18, 'sawtooth', 0.18], xarxa: [140, 0.2, 'triangle', 0.25],
                be: [880, 0.25, 'sine', 0.2], mal: [180, 0.3, 'sine', 0.2], magia: [660, 0.6, 'sine', 0.15], nota: [[523, 659, 784][n] || 600, 0.3, 'sine', 0.22] }[tipus];
            if (!def) return;
            o.type = def[2]; o.frequency.setValueAtTime(def[0], t);
            if (tipus === 'magia') o.frequency.exponentialRampToValueAtTime(1320, t + def[1]);
            if (tipus === 'be') o.frequency.exponentialRampToValueAtTime(1320, t + def[1]);
            g.gain.setValueAtTime(def[3], t); g.gain.exponentialRampToValueAtTime(0.001, t + def[1]);
            o.connect(g).connect(a.destination); o.start(t); o.stop(t + def[1] + 0.02);
        } catch (e) { /* sense àudio */ }
    }
}
return EscenaPingPong;
})();
