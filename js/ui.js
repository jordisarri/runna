/**
 * ESCENA UI: corre sempre per sobre de la zona activa.
 * HUD (rosari d'energia, objectiu), caixa de diàleg, menú de pausa i controls tàctils.
 */
const AMPLE = 720;
// L'ample del llenç és fix; l'alçada s'adapta a la proporció de la pantalla (així el llenç l'omple sense barres laterals).
// Va de 900 (tauleta, 4:5) a 1600 (mòbil molt llarg); més enllà, el llenç es queda dins la pantalla amb barres. ?alt=1500 la força (proves).
const ALT_MIN = 900, ALT_MAX = 1600;
function calcularAlt() {
    const q = +new URLSearchParams(location.search).get('alt');
    if (q) return Math.min(ALT_MAX, Math.max(ALT_MIN, Math.round(q)));
    const el = document.getElementById('joc');
    const r = el ? el.getBoundingClientRect() : null;
    const w = (r && r.width) || window.innerWidth, h = (r && r.height) || window.innerHeight;
    if (!w || !h) return 1280;
    return Math.min(ALT_MAX, Math.max(ALT_MIN, Math.round(AMPLE * h / w)));
}
const ALT = calcularAlt();

// Escenes dissenyades per a una alçada fixa (el ping-pong, de 1280): el disseny es centra a la pantalla i, si aquesta és més baixa, es redueix
function encaixarDisseny(scene, alt0 = 1280) {
    const cam = scene.cameras.main;
    cam.setZoom(Math.min(1, ALT / alt0));
    cam.centerOn(AMPLE / 2, alt0 / 2);
}
const ALT_HUD = 170;   // franja de dalt reservada per al HUD: l'escenari es dibuixa només per sota
const FONT = 'Georgia, "Times New Roman", serif';

// ---------- Retrat de qui parla (a la caixa de diàleg) ----------
// El cap retallat del sprite del personatge: es fa una sola vegada i es desa com a textura 'retrat_<clau>'.
// Els noms que no són personatges (cartells, llibres, inscripcions, el Til·ler...) no en tenen.
const RETRATS = {
    'Ineu': 'ineu', 'Pare Jordi': 'pare_jordi', 'Germà Andreu': 'germa_andreu', 'Germà Francesc': 'germa_francesc', 'Pare Daniel': 'pare_daniel',
    'Pare Alcuí': 'pare_alcui', 'Eva': 'eva', 'Josep': 'josep', 'Frederic': 'frederic', 'Juli': 'juli', 'Garf': 'garf', 'Isidre': 'isidre',
    'La Pianista': 'pianista', 'La Jaumeta': 'jaumeta', 'Siscu': 'ciscu', 'Nena de les Trenes': 'nena_trenes', 'Les Venerables Sàvies': 'venerables',
    'Charm': 'monja_charm', 'Phili': 'monja_phili', 'Pains': 'monja_pains', 'Pastor vell': 'pastor_vell', 'Pastor': 'pastor_a', 'Pastora': 'pastor_b',
    'Neus': 'neus', 'Senyor Moliner': 'marit_neus', 'Jordi': 'jordi_caseta', 'Sansa': 'sansa', 'Home del Raïm': 'home_raim', 'Daniel': 'daniel_t',
    'Yordi': 'yordi', 'Turbo': 'turbo', 'Judit': 'judit', 'Home del Carruatge Verd': 'home_carruatge'
};
const MIDA_RETRAT = 170;          // costat del retrat a la caixa de diàleg (px de joc)
// Retocs del retall per a dibuixos amb una altra proporció (alt: fracció de la figura que fa el cap; per defecte 0,4)
const AJUST_RETRAT = { pianista: { alt: 0.5 } };

function retratDe(scene, qui) {
    const key = RETRATS[qui];
    if (!key) return null;
    const clau = 'retrat_' + key;
    if (scene.textures.exists(clau)) return clau;
    const nomTex = key === 'ineu' ? 'ineu_down' : key;
    if (!scene.textures.exists(nomTex)) return null;
    try {
        const tex = scene.textures.get(nomTex), fr = key === 'ineu' ? tex.get(SPRITE_INEU.quiet) : tex.get();
        const fw = fr.cutWidth, fh = fr.cutHeight;
        const tmp = document.createElement('canvas'); tmp.width = fw; tmp.height = fh;
        const tc = tmp.getContext('2d', { willReadFrequently: true });
        tc.drawImage(fr.source.image, fr.cutX, fr.cutY, fw, fh, 0, 0, fw, fh);
        const d = tc.getImageData(0, 0, fw, fh).data;
        // Caixa del personatge
        let x0 = fw, y0 = fh, x1 = -1, y1 = -1;
        for (let y = 0; y < fh; y++) for (let x = 0; x < fw; x++) if (d[(y * fw + x) * 4 + 3] > 40) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
        if (x1 < 0) return null;
        const bw = x1 - x0 + 1, bh = y1 - y0 + 1, grup = bw > bh * 0.8;      // grup: les dues Venerables, agafades del braç
        // Retall del cap: el terç de dalt (els personatges són xibi, de cap gran), centrat on hi ha més figura
        const alt = bh * (grup ? 0.4 : (AJUST_RETRAT[key] && AJUST_RETRAT[key].alt) || 0.4);
        let sx = 0, sa = 0;
        for (let y = y0; y < y0 + alt * 0.8; y++) for (let x = x0; x <= x1; x++) { const a = d[(y * fw + x) * 4 + 3]; sx += x * a; sa += a; }
        const cx = grup ? (x0 + x1) / 2 : (sa ? sx / sa : (x0 + x1) / 2);
        const rw = grup ? bw * 0.92 : alt * 1.1, rh = grup ? alt * 1.05 : alt * 1.1;
        const rx = cx - rw / 2, ry = y0 - bh * 0.03;
        // Retrat: fons de pergamí fosc arrodonit i el cap ajustat a dins
        const N = MIDA_RETRAT * RES, out = document.createElement('canvas'); out.width = N; out.height = N;
        const c = out.getContext('2d');
        c.beginPath(); c.roundRect(0, 0, N, N, N * 0.12); c.clip();
        const g = c.createLinearGradient(0, 0, 0, N); g.addColorStop(0, '#d8c08a'); g.addColorStop(1, '#a8885a');
        c.fillStyle = g; c.fillRect(0, 0, N, N);
        const k = Math.min(N / rw, N / rh), dw = rw * k, dh = rh * k;
        c.imageSmoothingQuality = 'high';
        c.drawImage(tmp, rx, ry, rw, rh, (N - dw) / 2, grup ? (N - dh) / 2 : N - dh, dw, dh);      // el grup, centrat; la resta, amb el coll a baix
        scene.textures.addCanvas(clau, out);
        return clau;
    } catch (e) {
        return null;           // sense lectura de píxels (fitxer obert sense servidor): sense retrat
    }
}

function estilText(mida, color = '#fff8e7', extra = {}) {
    return Object.assign({ fontFamily: FONT, fontSize: mida + 'px', color, resolution: 2 }, extra);
}

// Marc de pergamí amb vores de fusta i ornaments d'or (nineslice: les cantonades no s'estiren)
function marcPergami(scene, x, y, w, h, clau = 'marc_gran') {
    const c = (clau === 'marc_gran' ? MARC_GRAN : MARC_PETI) * RES;
    return scene.add.nineslice(x, y, clau, undefined, w * RES, h * RES, c, c, c, c).setScale(1 / RES);
}

// El sarró de l'Ineu (inventari): nom i una línia de cada objecte que es pot portar
const CATALEG_OBJECTES = {
    flauta:           ['Flauta', 'Es toca amb ESPAI allà on la música pot fer efecte.'],
    basto:            ['Bastó de pelegrí', 'Per caminar... i per defensar-se.'],
    basto_tiller:     ['Branca del Til·ler', 'Més lleugera i àgil que el bastó de pelegrí.'],
    clau_campanar:    ['Clau del campanar', 'Obre la porta de la dreta del retaule, la que duu a la torre del rellotge. La guardaven les Venerables Sàvies.'],
    clau_sagrari:     ['Clau del sagrari', 'Petita, gairebé de joguina. Guardada a l\'ermita.'],
    aigua_sj:         ['Aigua de la Font del Bisbe', 'Aigua beneïda, clara com el vidre.'],
    cristall_gel:     ['Cristall de gel', 'No es fon ni a l\'estiu. El Garf en sabrà fer alguna cosa.'],
    pruna:            ['Pruna daurada', 'De la Prunera de l\'Hostatgeria. La Font del Bisbe en vol una.'],
    beuratge:         ['Beuratge de la Jaumeta', 'Fa fugir la boira dolenta. No te\'l beguis!'],
    escudella:        ['Escudella de la Neus', 'Amb la cullerada de més, la del que falta.'],
    flors_isidre:     ['Flors de l\'Isidre', 'Un ram embolicat amb un tros de pergamí.'],
    pa_pastor:        ['Pa dels pastors', 'Una barra baixa i fosca, cuita sota la cendra.'],
    esquelles:        ['Esquelles dels pastors', 'Amb elles, els cants antics sonen més clars.'],
    fulla_tiler:      ['Fulla del Til·ler', 'Un record del sopar sota el Gran Til·ler.'],
    cinta_nena:       ['Llaç de la Nena', 'Absorbeix un cop cada vegada que entres a una zona.'],
    llac_nena:        ['Llaç de cinta', 'Rosa i descolorit. És de la Nena de les Trenes.'],
    llanterna:        ['Llanterna', 'Fa més llum a les foscors de sota terra.'],
    telescopi:        ['Telescopi del Garf', 'Per mirar els estels als Dipòsits.'],
    estel_llorenc:    ['Estel de Sant Llorenç', 'Un bocí de llum caigut del cel.'],
    runna:            ['Runna', 'L\'espasa de llum del monjo.'],
    ram:              ['Ram de flors', 'Del Germà Francesc, per a la tomba de l\'àngel.'],
    guants:           ['Guants de Poder', 'Per moure el que pesa massa.'],
    palanca:          ['Palanca d\'en Jordi', 'De ferro, de les bones.'],
    clau_girgoles:    ['Clau rovellada', 'Petita, amb un ocell gravat. Al Germà Andreu li va caure; el Siscu te l\'ha donada.'],
    fragment1:        ['Pergamí partit (1/2)', 'La meitat d\'un pergamí esquinçat, trobada a les Runes.'],
    pergami_monjo:    ['Pergamí del monjo', '«On neix el sol, el raïm madura.» Al revers: «Qui busqui sortida, que alci la bóta marcada amb la creu.»'],
    calze:            ['Calze de Rosada', "De plata, antic. A l'altar de Sant Gabriel, cada cop que hi beus l'aigua de rosada, el rosari et queda ple."],
    clau_ferro:       ['Clau de ferro', 'Obre la porta de ferro de la Sala de les Gírgoles.'],
    llavorLluna:      ['Llavor de Lluna', 'De la Sansa. L\'Isidre sap on plantar-la.'],
};

class EscenaUI extends Phaser.Scene {
    constructor() { super('UI'); }

    create() {
        this.dialeg = null;          // diàleg obert
        this.menuObert = false;
        this.mapaObert = false;
        this.bloquejatFins = 0;
        this.vectorTactil = { x: 0, y: 0 };
        this.accioTactil = false;

        this.crearHUD();
        this.crearCaixaDialeg();
        this.crearMenu();
        this.crearControlsTactils();
        this.crearObjectes();

        this.input.keyboard.on('keydown-ESC', () => {
            if (this.game.scene.isActive('Musica') || this.game.scene.isActive('Estels') || this.game.scene.isActive('PingPong')) return;
            if (this.inventariObert) this.tancarInventari();
            else if (this.mapaObert) this.tancarMapa();
            else if (this.menuObert) this.tancarMenu();
            else this.obrirMenu();
        });
        this.input.keyboard.on('keydown-UP', () => this.menuObert && this.moureSeleccio(-1));
        this.input.keyboard.on('keydown-DOWN', () => this.menuObert && this.moureSeleccio(1));
        this.input.keyboard.on('keydown-W', () => this.menuObert && this.moureSeleccio(-1));
        this.input.keyboard.on('keydown-S', () => this.menuObert && this.moureSeleccio(1));
        const confirmar = () => {
            if (this.inventariObert) this.tancarInventari();
            else if (this.mapaObert) this.tancarMapa();
            else if (this.menuObert) this.executarOpcio(this.seleccio);
        };
        this.input.keyboard.on('keydown-ENTER', confirmar);
        this.input.keyboard.on('keydown-SPACE', confirmar);

        // Tocar/clicar la pantalla avança el diàleg
        this.input.on('pointerdown', (p, objectes) => {
            if (objectes.length) return;
            if (this.dialeg && !this.menuObert) this.avancar();
        });

        this.actualitzarHUD();
    }

    // ---------------- SARRÓ (inventari) ----------------
    // Un medalló petit a la dreta del HUD obre el sarró (també la tecla I). Quan l'Ineu és en un lloc on la flauta fa
    // efecte, al costat hi brilla la flauta: l'acció (ESPAI o tocar la meitat dreta de la pantalla) la toca.
    // Vegeu ZonaBase.flautaActiva.
    crearObjectes() {
        const x = 548, y = ALT_HUD / 2, commuta = () => this.inventariObert ? this.tancarInventari() : this.obrirInventari();
        this.fonsSarro = this.add.image(x, y, 'medallo').setScale(0.62 / RES).setVisible(false)
            .setInteractive({ useHandCursor: true }).on('pointerdown', commuta);
        this.iconaSarro = this.add.image(x, y, 'icona_sarro').setScale(0.62 / RES).setVisible(false);
        this.haloFlauta = this.add.circle(x - 68, y, 30, 0xffe08a, 0).setVisible(false);
        this.iconaFlauta = this.add.image(x - 68, y, 'icona_flauta').setScale(0.75 / RES).setVisible(false);
        this.input.keyboard.on('keydown-I', commuta);
        this.input.keyboard.on('keydown-M', () => this.inventariObert ? this.tancarInventari() : this.obrirInventari('mapa'));
        ['LEFT', 'A'].forEach(k => this.input.keyboard.on('keydown-' + k, () => this.inventariObert && DIARI.moure(this, -1)));
        ['RIGHT', 'D'].forEach(k => this.input.keyboard.on('keydown-' + k, () => this.inventariObert && DIARI.moure(this, 1)));
        ['UP', 'W'].forEach(k => this.input.keyboard.on('keydown-' + k, () => this.inventariObert && DIARI.desplacar(this, -140)));
        ['DOWN', 'S'].forEach(k => this.input.keyboard.on('keydown-' + k, () => this.inventariObert && DIARI.desplacar(this, 140)));
    }

    refrescaObjectes() {
        if (!this.fonsSarro) return;
        const vis = !!Estat.dades && !this.menuObert && !this.mapaObert;
        this.fonsSarro.setVisible(vis); this.iconaSarro.setVisible(vis);
        const lliure = vis && !this.dialeg && !this.inventariObert;
        const zona = lliure ? Joc.zonaActiva(this) : null;
        const flauta = !!zona && Estat.te('flauta') && !!zona.flautaActiva();
        this.iconaFlauta.setVisible(flauta);
        this.haloFlauta.setVisible(flauta).setFillStyle(0xffe08a, flauta ? 0.3 + 0.25 * Math.sin(this.time.now / 180) : 0);
    }

    // El sarró obre el Diari de l'Ineu (js/diari.js): missió, encàrrecs, objectes i mapa
    obrirInventari(pestanya) {
        if (this.dialeg || this.menuObert || !Estat.dades || this.game.scene.isActive('Musica') || this.game.scene.isActive('Estels') || this.game.scene.isActive('PingPong')) return;
        DIARI.obrir(this, pestanya);
    }

    tancarInventari() {
        this.inventariObert = false;
        DIARI.netejar(this);
        if (this.inventari) { this.inventari.destroy(); this.inventari = null; }
        this.bloquejatFins = this.time.now + 200;
    }

    update() { this.refrescaObjectes(); }

    // La zona consulta això per saber si l'Ineu pot moure's
    get bloquejat() {
        return !!this.dialeg || this.menuObert || this.inventariObert || this.time.now < this.bloquejatFins || this.game.scene.isActive('Musica') || this.game.scene.isActive('Estels') || this.game.scene.isActive('PingPong');
    }

    // ---------------- HUD ----------------
    crearHUD() {
        // Franja de dalt: un sol llenç de pergamí enmarcat a tot l'ample; l'escenari comença just a sota
        this.fonsHUD = marcPergami(this, 0, 0, AMPLE, ALT_HUD, 'marc_peti').setOrigin(0);
        // Rosari d'energia: un cordó amb una creueta i un gra per cada punt (cada gra són dues meitats)
        this.cordo = this.add.graphics();
        this.creuRosari = this.add.image(38, 62, 'creu_rosari').setScale(1 / RES);
        this.cors = [];     // els grans del rosari (es creen a mesura que n'hi ha més)
        this.textObjectiu = this.add.text(48, 86, '', estilText(20, '#3a2412', { fontStyle: 'italic', wordWrap: { width: 400 } }));

        this.bannerZona = this.add.text(AMPLE / 2, 236, '', estilText(42, '#ffe9a8', { stroke: '#1a120b', strokeThickness: 7 }))
            .setOrigin(0.5).setAlpha(0);
        this.toast = this.add.text(AMPLE / 2, 300, '', estilText(28, '#ffffff', { backgroundColor: '#1a120bdd', padding: { x: 16, y: 10 }, wordWrap: { width: 640 }, align: 'center' }))
            .setOrigin(0.5).setAlpha(0).setDepth(50);

        // Botó de menú (ratolí i pantalla tàctil)
        this.botoMenu = this.add.text(AMPLE - 46, ALT_HUD / 2, '☰', estilText(40, '#3a2412', { backgroundColor: '#8a5a2a44', padding: { x: 16, y: 8 } }))
            .setOrigin(1, 0.5).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.menuObert ? this.tancarMenu() : this.obrirMenu());

        if (!this.sys.game.device.input.touch) {
            this.textAjuda = this.add.text(AMPLE - 16, ALT - 12, 'Fletxes/WASD: moure · ESPAI: parlar o atacar · I: sarró · ESC: menú',
                estilText(12, '#f2e6c8')).setOrigin(1, 1).setAlpha(0.55);
            // Només al principi: després s'esvaeix perquè no es quedi a la pantalla tota l'estona
            this.tweens.add({ targets: this.textAjuda, alpha: 0, delay: 9000, duration: 1500 });
        }
    }

    actualitzarHUD() {
        const d = Estat.dades;
        if (!d) return;
        while (this.cors.length < d.corsMax) this.cors.push(this.add.image(0, 0, 'gra_ple').setScale(1 / RES));
        const gx = i => 78 + i * 46, GY = 52;
        this.cors.forEach((img, i) => {
            const v = d.vida - i * 2;
            img.setVisible(i < d.corsMax).setPosition(gx(i), GY).setTexture(v >= 2 ? 'gra_ple' : v === 1 ? 'gra_mig' : 'gra_buit');
        });
        // Cordó: de la creueta al primer gra i, entre gra i gra, una mica penjant
        const c = this.cordo.clear();
        c.lineStyle(2.4, 0x3a2412, 0.95);
        c.beginPath(); c.moveTo(38, 44);
        for (let k = 1; k <= 8; k++) { const t = k / 8; c.lineTo(38 + (gx(0) - 38) * t, 44 + (GY - 44) * t + Math.sin(Math.PI * t) * 5); }
        for (let i = 0; i < d.corsMax - 1; i++) {
            for (let k = 1; k <= 6; k++) { const t = k / 6; c.lineTo(gx(i) + 46 * t, GY + Math.sin(Math.PI * t) * 4); }
        }
        c.strokePath();
        c.lineStyle(1, 0xb08850, 0.6);
        c.beginPath(); c.moveTo(gx(0), GY - 1); c.lineTo(gx(Math.max(0, d.corsMax - 1)), GY - 1); c.strokePath();
        this.gestionarLatidor();
        this.textObjectiu.setText('Objectiu: ' + (d.objectiu || ''));
        // L'objectiu ha de cabre dins del marc fix de la franja: si és llarg, es redueix la lletra
        let mida = 20;
        this.textObjectiu.setFontSize(mida);
        while (this.textObjectiu.height > 52 && mida > 14) this.textObjectiu.setFontSize(--mida);
        if (this.textAjuda) this.textAjuda.setText('Fletxes/WASD: moure · ESPAI: parlar o atacar' + ' · I: sarró · ESC: menú');
    }

    // Quan queda un sol gra o menys, l'últim gra bategueja
    gestionarLatidor() {
        if (this.animantCor) return;
        const v = Estat.dades.vida;
        const idx = v > 0 && v <= 2 ? Math.floor((v - 1) / 2) : -1;
        if (idx === this.latidorIdx) return;
        if (this.latidorTween) {
            this.latidorTween.stop(); this.latidorTween = null;
            const a = this.cors[this.latidorIdx];
            if (a) a.setScale(1 / RES);
        }
        this.latidorIdx = idx;
        if (idx >= 0 && this.cors[idx]) {
            this.latidorTween = this.tweens.add({
                targets: this.cors[idx], scale: { from: 1 / RES, to: 1.2 / RES }, yoyo: true, repeat: -1, duration: 380, ease: 'Sine.inOut'
            });
        }
    }

    // Grans que perden alguna meitat entre "abans" i "ara": s'esquerden, en cau un tros i la resta fa una onada
    animarPerdua(abans, ara) {
        const valor = (v, i) => Math.max(0, Math.min(2, v - i * 2));
        const base = 1 / RES;
        this.animantCor = true;
        if (this.latidorTween) { this.latidorTween.stop(); this.latidorTween = null; }
        this.latidorIdx = -1;
        this.cors.forEach(c => { this.tweens.killTweensOf(c); c.setScale(base).setAngle(0).clearTint(); });
        this.cameras.main.shake(240, 0.006, true);
        this.cors.forEach((img, i) => {
            if (!img.visible) return;
            const antes = valor(abans, i), despres = valor(ara, i);
            if (despres >= antes) {
                // Els grans que es mantenen fan una petita onada d'ensurt
                this.tweens.add({ targets: img, scale: base * 1.25, yoyo: true, duration: 110, delay: 60 + i * 45, ease: 'Sine.out' });
                return;
            }
            // Flaix blanc i bot gran que s'afebleix
            img.setTintFill(0xffffff);
            this.time.delayedCall(90, () => img.clearTint());
            img.setScale(base * 2.1);
            this.tweens.add({ targets: img, scale: base, duration: 380, ease: 'Back.out' });
            this.tweens.add({ targets: img, angle: { from: -22, to: 0 }, duration: 480, ease: 'Elastic.out' });
            // Anell de llum que s'apaga
            const anell = this.add.graphics().setPosition(img.x, img.y).setDepth(img.depth + 1);
            anell.lineStyle(4, 0xffb060, 0.95).strokeCircle(0, 0, 18);
            this.tweens.add({ targets: anell, scale: 2.6, alpha: 0, duration: 380, ease: 'Cubic.out', onComplete: () => anell.destroy() });
            // La part perduda: un tros de gra que cau girant
            const part = antes - despres;
            const fantasma = this.add.image(img.x, img.y, part === 1 ? 'gra_mig' : 'gra_ple').setScale(base).setDepth(img.depth + 2);
            this.tweens.add({
                targets: fantasma, y: img.y + 120, x: img.x + Phaser.Math.Between(-22, 22), angle: Phaser.Math.Between(-80, 80),
                alpha: 0, scale: base * 0.8, duration: 700, ease: 'Quad.in', onComplete: () => fantasma.destroy()
            });
            // Estelles de fusta
            const p = this.add.particles(img.x, img.y, 'espurna', {
                speed: { min: 70, max: 260 }, lifespan: { min: 400, max: 700 }, scale: { start: 0.3, end: 0 },
                tint: [0xc8843a, 0x8a5424, 0xffe0a0], gravityY: 420, quantity: 14, emitting: false
            }).setDepth(img.depth + 3);
            p.explode(14);
            this.time.delayedCall(800, () => p.destroy());
        });
        this.time.delayedCall(700, () => { this.animantCor = false; this.gestionarLatidor(); });
    }

    // Grans que es tornen a encendre: bot i espurnes daurades
    animarGuany(abans, ara) {
        const valor = (v, i) => Math.max(0, Math.min(2, v - i * 2));
        const base = 1 / RES;
        this.cors.forEach((img, i) => {
            if (!img.visible || valor(ara, i) <= valor(abans, i)) return;
            this.tweens.killTweensOf(img);
            img.setScale(base);
            this.tweens.add({ targets: img, scale: base * 1.6, yoyo: true, duration: 170, ease: 'Sine.out' });
            const p = this.add.particles(img.x, img.y, 'espurna', {
                speed: { min: 30, max: 120 }, lifespan: 600, scale: { start: 0.25, end: 0 },
                tint: [0xffd894, 0xfff2c8], gravityY: -80, quantity: 8, emitting: false
            }).setDepth(img.depth + 3);
            p.explode(8);
            this.time.delayedCall(700, () => p.destroy());
        });
    }

    mostrarZona(nom) {
        this.tweens.killTweensOf(this.bannerZona);
        this.bannerZona.setText(nom).setAlpha(0);
        this.tweens.chain({
            targets: this.bannerZona,
            tweens: [
                { alpha: 1, duration: 450 },
                { alpha: 1, duration: 1500 },
                { alpha: 0, duration: 600 }
            ]
        });
    }

    notifica(text) {
        this.tweens.killTweensOf(this.toast);
        this.toast.setText(text).setAlpha(1);
        this.tweens.add({ targets: this.toast, alpha: 0, delay: 1800 + text.length * 40, duration: 500 });
    }

    // Missatge llegible: surt al quadre de baix, com qualsevol diàleg, i el joc s'atura fins que es llegeix.
    // Si ja hi ha un diàleg obert, es posa a la cua i surt just quan es tanqui.
    missatge(text, fet) {
        if (this.dialeg) { (this.cuaMissatges = this.cuaMissatges || []).push({ text, fet }); return; }
        this.obrirDialeg({ pagines: [{ avis: text }] }, fet);
    }

    // ---------------- CINEMÀTIQUES I BOSSES ----------------
    // Franges negres de cinema a dalt i a baix (per sota de tota la resta de la UI)
    franges(on, ms = 600) {
        if (!this.frangesG) {
            const h = 120;
            this.frangesG = [this.add.rectangle(0, ALT_HUD, AMPLE, h, 0x000000).setOrigin(0, 1), this.add.rectangle(0, ALT, AMPLE, h, 0x000000).setOrigin(0, 0)];
            this.frangesG.forEach(r => r.setDepth(-1));
            this.frangesG.h = h;
        }
        const [a, b] = this.frangesG, h = this.frangesG.h;
        this.tweens.killTweensOf(this.frangesG);
        this.tweens.add({ targets: a, y: on ? ALT_HUD + h : ALT_HUD, duration: ms, ease: 'Sine.easeInOut' });
        this.tweens.add({ targets: b, y: on ? ALT - h : ALT, duration: ms, ease: 'Sine.easeInOut' });
    }

    // Rètol gran amb el nom del boss: apareix, s'hi queda i s'esvaeix
    titolBoss(nom, sub) {
        const t1 = this.add.text(AMPLE / 2, ALT * 0.42, nom, { fontFamily: typeof FONT_TITOL !== 'undefined' ? FONT_TITOL : 'Georgia', fontSize: '76px', fontStyle: 'bold', color: '#ff6a5a', stroke: '#1a0408', strokeThickness: 10, align: 'center' }).setOrigin(0.5).setAlpha(0).setScale(1.4);
        const t2 = this.add.text(AMPLE / 2, ALT * 0.42 - 70, sub, estilText(30, '#f2e6c8', { fontStyle: 'italic', stroke: '#1a0408', strokeThickness: 6 })).setOrigin(0.5).setAlpha(0);
        this.tweens.add({ targets: t1, alpha: 1, scale: 1, duration: 500, ease: 'Back.easeOut' });
        this.tweens.add({ targets: t2, alpha: 1, duration: 600, delay: 250 });
        this.tweens.add({ targets: [t1, t2], alpha: 0, duration: 700, delay: 2600, onComplete: () => { t1.destroy(); t2.destroy(); } });
    }

    // Barra de vida del boss, a baix de la pantalla
    barraBoss(nom) {
        this.amagarBarraBoss();
        const y = ALT - 64, w = AMPLE - 120, x = 60;
        const c = this.add.container(0, 0).setAlpha(0);
        c.add(this.add.rectangle(x - 4, y - 4, w + 8, 26, 0x1a0408).setOrigin(0).setStrokeStyle(3, 0xb89a50));
        const fons = this.add.rectangle(x, y, w, 18, 0x3a1010).setOrigin(0);
        const ple = this.add.rectangle(x, y, w, 18, 0xe03a2a).setOrigin(0);
        const brill = this.add.rectangle(x, y, w, 6, 0xffb0a0, 0.5).setOrigin(0);
        c.add([fons, ple, brill]);
        c.add(this.add.text(AMPLE / 2, y - 12, nom, estilText(24, '#ffe9a8', { stroke: '#1a0408', strokeThickness: 5 })).setOrigin(0.5, 1));
        this.tweens.add({ targets: c, alpha: 1, duration: 500 });
        this.boss = { c, ple, brill, w };
    }
    vidaBoss(fr) {
        if (!this.boss) return;
        const b = this.boss, ww = Math.max(0, fr) * b.w;
        this.tweens.add({ targets: [b.ple, b.brill], width: ww, duration: 250, ease: 'Cubic.out' });
        b.ple.setFillStyle(0xffffff);
        this.time.delayedCall(80, () => b.ple.setFillStyle(fr > 0.5 ? 0xe03a2a : 0xff6a20));
    }
    amagarBarraBoss() {
        if (!this.boss) return;
        const c = this.boss.c; this.boss = null;
        this.tweens.add({ targets: c, alpha: 0, duration: 500, onComplete: () => c.destroy() });
    }

    // ---------------- DIÀLEG ----------------
    crearCaixaDialeg() {
        this.caixa = this.add.container(AMPLE / 2, ALT - 190).setVisible(false).setDepth(40);
        const ombra = this.add.rectangle(4, 8, 704, 360, 0x000000, 0.35);
        const fons = marcPergami(this, 0, 0, 704, 360);
        // Cinta amb el nom de qui parla, penjada de la vora de dalt
        this.cintaNom = this.add.nineslice(-318, -186, 'cinta_nom', undefined, 160 * RES, 60 * RES, 26 * RES, 26 * RES)
            .setScale(1 / RES).setOrigin(0, 0.5);
        this.plaquetaNom = this.add.text(-310, -186, '', { fontFamily: FONT_PLACA, fontSize: '32px', fontStyle: 'bold', color: '#fff3c8', stroke: '#2a0a0e', strokeThickness: 4, resolution: 2 })
            .setOrigin(0, 0.5);
        this.textDialeg = this.add.text(-316, -146, '', estilText(28, '#2a170b', { wordWrap: { width: 632 }, lineSpacing: 5 }));
        this.indicador = this.add.text(318, 152, '▼', estilText(26, '#7a3a14')).setOrigin(1, 1);
        this.tweens.add({ targets: this.indicador, y: 158, yoyo: true, repeat: -1, duration: 400 });
        // Retrat de qui parla: dalt a l'esquerra, sobresortint de la caixa (el text conserva tot l'ample)
        const RX = -352 + 14 + MIDA_RETRAT / 2, RY = -180 + 26 - MIDA_RETRAT / 2;
        this.retratImg = this.add.image(RX, RY, '__WHITE').setDisplaySize(MIDA_RETRAT, MIDA_RETRAT).setVisible(false);
        this.marcRetrat = this.add.graphics().setVisible(false);
        this.marcRetrat.fillStyle(0x000000, 0.35).fillRoundedRect(RX - MIDA_RETRAT / 2 + 4, RY - MIDA_RETRAT / 2 + 7, MIDA_RETRAT, MIDA_RETRAT, MIDA_RETRAT * 0.12);
        const marc = this.add.graphics().setVisible(false);
        marc.lineStyle(7, 0x2a0a0e, 1).strokeRoundedRect(RX - MIDA_RETRAT / 2, RY - MIDA_RETRAT / 2, MIDA_RETRAT, MIDA_RETRAT, MIDA_RETRAT * 0.12);
        marc.lineStyle(4, 0xd4af37, 1).strokeRoundedRect(RX - MIDA_RETRAT / 2, RY - MIDA_RETRAT / 2, MIDA_RETRAT, MIDA_RETRAT, MIDA_RETRAT * 0.12);
        this.marcRetratVora = marc;
        this.caixa.add([ombra, fons, this.marcRetrat, this.retratImg, marc, this.cintaNom, this.plaquetaNom, this.textDialeg, this.indicador]);
    }

    // dialeg = { pagines: [{qui, text}], enAcabar? }
    obrirDialeg(dialeg, enTancar) {
        if (!dialeg || !dialeg.pagines) return;
        if (!dialeg.pagines.length) { if (dialeg.enAcabar) dialeg.enAcabar(); if (enTancar) enTancar(); return; }    // sense text: només l'efecte
        this.dialeg = { dades: dialeg, pagina: 0, enTancar };
        this.caixa.setVisible(true);
        this.mostrarPagina();
    }

    mostrarPagina() {
        let p = this.dialeg.dades.pagines[this.dialeg.pagina];
        // Pàgina d'avís ({ avis: 'Has obtingut...' }): es veu a la caixa de text, sense nom, i es passa amb un clic com la resta
        if (p.avis !== undefined) p = { qui: '', text: p.avis, avis: true };
        // Pàgina d'acció: no hi ha text, el personatge ho fa (camina, salta, dona una cosa...) i després es continua
        if (p.fer) {
            this.caixa.setVisible(false);
            this.dialeg.fent = true;
            const d = this.dialeg, z = Joc.zonaActiva(this);
            let fet = false;
            const seguir = () => {
                if (fet || this.dialeg !== d) return;
                fet = true; d.fent = false;
                d.pagina++;
                if (d.pagina < d.dades.pagines.length) { this.caixa.setVisible(true); this.mostrarPagina(); } else this.tancarDialeg();
            };
            if (z) { try { p.fer(z, seguir); } catch (e) { console.warn('Acció de diàleg', e); seguir(); } } else seguir();
            return;
        }
        this.caixa.setVisible(true);
        // Retrat (si qui parla és un personatge amb sprite): la cinta del nom es desplaça a la seva dreta
        const retrat = p.qui ? retratDe(this, p.qui) : null;
        [this.retratImg, this.marcRetrat, this.marcRetratVora].forEach(o => o.setVisible(!!retrat));
        if (retrat) this.retratImg.setTexture(retrat).setDisplaySize(MIDA_RETRAT, MIDA_RETRAT);
        const xCinta = retrat ? -352 + 14 + MIDA_RETRAT + 10 : -318;
        this.plaquetaNom.setText(p.qui || '').setVisible(!!p.qui).setX(xCinta + 44);
        this.cintaNom.setVisible(!!p.qui).setX(xCinta);
        if (p.qui) this.cintaNom.setSize((this.plaquetaNom.width + 88) * RES, 60 * RES);
        this.textComplet = p.text;
        this.lletres = 0;
        this.textDialeg.setText('');
        // La veu del narrador, en cursiva i en un to vermellós; els personatges, en tinta fosca
        this.textDialeg.setColor(p.qui || p.avis ? '#2a170b' : '#5a2410').setFontStyle(p.qui || p.avis ? 'normal' : 'italic');
        this.indicador.setVisible(false);
        if (this.timerText) this.timerText.remove();
        this.timerText = this.time.addEvent({
            delay: 22, loop: true, callback: () => {
                this.lletres++;
                if (this.lletres % 2 === 0 && /\S/.test(this.textComplet[this.lletres - 1] || '')) Sfx.lletra();
                this.textDialeg.setText(this.textComplet.slice(0, this.lletres));
                if (this.lletres >= this.textComplet.length) this.acabarEscriptura();
            }
        });
    }

    acabarEscriptura() {
        if (this.timerText) { this.timerText.remove(); this.timerText = null; }
        this.textDialeg.setText(this.textComplet);
        this.indicador.setVisible(true);
    }

    avancar() {
        if (!this.dialeg || this.dialeg.fent) return;
        if (this.timerText) { this.acabarEscriptura(); return; }
        this.dialeg.pagina++;
        Sfx.pagina();
        if (this.dialeg.pagina < this.dialeg.dades.pagines.length) { this.mostrarPagina(); return; }
        this.tancarDialeg();
    }

    tancarDialeg() {
        const { dades, enTancar } = this.dialeg;
        this.dialeg = null;
        this.caixa.setVisible(false);
        this.bloquejatFins = this.time.now + 200;
        if (dades.enAcabar) dades.enAcabar();
        if (enTancar) enTancar();
        this.actualitzarHUD();
        if (!this.dialeg && this.cuaMissatges && this.cuaMissatges.length) {          // missatges que han arribat mentre hi havia un diàleg obert
            const m = this.cuaMissatges.shift();
            this.time.delayedCall(250, () => this.missatge(m.text, m.fet));
        }
    }

    // Tria entre dues (o més) respostes, com «Sí» / «No»: botons grans que es toquen o es trien amb ← → (A D) i ESPAI/ENTER.
    // cb(i) rep la posició de la resposta. S'usa des d'una pàgina d'acció d'un diàleg: { fer: (z, fet) => z.ui().triar(['Sí', 'No'], i => { ...; fet(); }) }
    triar(opcions, cb) {
        const y = ALT - 330, ample = 250, sep = 40, total = opcions.length * ample + (opcions.length - 1) * sep, x0 = AMPLE / 2 - total / 2 + ample / 2;
        const cont = this.add.container(0, 0).setDepth(70);
        let sel = 0, fet = false;
        const botons = opcions.map((t, i) => {
            const x = x0 + i * (ample + sep);
            const fons = marcPergami(this, x, y, ample, 110);
            const txt = this.add.text(x, y, t, { fontFamily: FONT_PLACA, fontSize: '44px', fontStyle: 'bold', color: '#3a1a0c', resolution: 2 }).setOrigin(0.5);
            const zona = this.add.rectangle(x, y, ample, 110, 0xffffff, 0.001).setInteractive({ useHandCursor: true });
            zona.on('pointerdown', () => tria(i)); zona.on('pointerover', () => { sel = i; pinta(); });
            cont.add([fons, txt, zona]);
            return { txt, fons };
        });
        const pinta = () => botons.forEach((b, i) => { b.txt.setText((i === sel ? '▸ ' : '') + opcions[i]).setColor(i === sel ? '#a01c10' : '#3a1a0c'); b.fons.setAlpha(i === sel ? 1 : 0.8); });
        const tecla = ev => {
            if (['ArrowLeft', 'ArrowUp', 'KeyA', 'KeyW'].includes(ev.code)) { sel = (sel + opcions.length - 1) % opcions.length; pinta(); }
            else if (['ArrowRight', 'ArrowDown', 'KeyD', 'KeyS'].includes(ev.code)) { sel = (sel + 1) % opcions.length; pinta(); }
            else if (['Space', 'Enter'].includes(ev.code)) tria(sel);
        };
        const tria = i => {
            if (fet) return; fet = true;
            this.input.keyboard.off('keydown', tecla);
            cont.destroy();
            this.bloquejatFins = this.time.now + 250;
            cb(i);
        };
        this.input.keyboard.on('keydown', tecla);
        pinta();
    }

    // ---------------- MENÚ ----------------
    crearMenu() {
        this.menu = this.add.container(0, 0).setVisible(false).setDepth(60);
        const vel = this.add.rectangle(0, 0, AMPLE, ALT, 0x000000, 0.65).setOrigin(0).setInteractive();
        const panell = marcPergami(this, AMPLE / 2, ALT / 2, 640, 470);
        const titol = this.add.text(AMPLE / 2, ALT / 2 - 160, 'Pausa', { fontFamily: FONT_PLACA, fontSize: '44px', fontStyle: 'bold', color: '#6a1f12', resolution: 2 }).setOrigin(0.5);
        this.menu.add([vel, panell, titol]);

        this.opcions = [
            { text: 'Continuar', fn: () => this.tancarMenu() },
            { text: 'Diari i mapa', fn: () => { this.tancarMenu(); this.obrirInventari('mapa'); } },
            { text: 'Tornar al títol', fn: () => { this.tancarMenu(); Joc.anarAlTitol(this); } }
        ];
        this.textOpcions = this.opcions.map((o, i) => {
            const t = this.add.text(AMPLE / 2, ALT / 2 - 80 + i * 84, o.text, { fontFamily: FONT_PLACA, fontSize: '30px', fontStyle: 'bold', color: '#3a2412', resolution: 2 })
                .setOrigin(0.5).setInteractive({ useHandCursor: true })
                .on('pointerover', () => { this.seleccio = i; this.pintarSeleccio(); })
                .on('pointerdown', () => this.executarOpcio(i));
            this.menu.add(t);
            return t;
        });
        this.seleccio = 0;
    }

    obrirMenu() {
        if (this.dialeg || this.game.scene.isActive('Musica') || this.game.scene.isActive('Estels') || this.game.scene.isActive('PingPong')) return;
        this.menuObert = true;
        this.seleccio = 0;
        this.pintarSeleccio();
        this.menu.setVisible(true);
    }

    tancarMenu() {
        this.menuObert = false;
        this.mapaObert = false;
        if (this.mapa) { this.mapa.destroy(); this.mapa = null; }
        this.menu.setVisible(false);
        this.bloquejatFins = this.time.now + 200;
    }

    // ---------------- MAPA ----------------
    obrirMapa() {
        if (this.mapa) this.mapa.destroy();
        this.mapa = this.add.container(0, 0).setDepth(70);
        const zona = Joc.zonaActiva(this);
        MAPA.dibuixar(this, this.mapa, zona ? zona.scene.key : null);
        // Clic a qualsevol lloc tanca el mapa
        const vel = this.add.rectangle(0, 0, AMPLE, ALT, 0x000000, 0.01).setOrigin(0).setInteractive()
            .on('pointerdown', () => this.tancarMapa());
        this.mapa.add(vel);
        this.mapaObert = true;
        this.menu.setVisible(false);
    }

    tancarMapa() {
        if (!this.mapaObert) return;
        this.mapaObert = false;
        if (this.mapa) { this.mapa.destroy(); this.mapa = null; }
        this.menu.setVisible(true);
        this.bloquejatFins = this.time.now + 200;
    }

    moureSeleccio(d) {
        this.seleccio = (this.seleccio + d + this.opcions.length) % this.opcions.length;
        this.pintarSeleccio();
    }

    pintarSeleccio() {
        this.textOpcions.forEach((t, i) => {
            t.setColor(i === this.seleccio ? '#9a1f1f' : '#3a2412');
            t.setText((i === this.seleccio ? '▸ ' : '') + this.opcions[i].text);
        });
    }

    executarOpcio(i) { this.opcions[i].fn(); }

    // Desa la posició actual de l'Ineu (la zona activa la informa)
    desar() {
        const zona = Joc.zonaActiva(this);
        if (zona) zona.guardarPosicio();
        Estat.desar();                      // la partida es desa sola: cap avís
    }

    // ---------------- CONTROLS TÀCTILS ----------------
    crearControlsTactils() {
        if (!this.sys.game.device.input.touch) return;
        this.input.addPointer(2);

        this.joyBase = this.add.circle(0, 0, 70, 0xffffff, 0.12).setStrokeStyle(3, 0xffffff, 0.4).setVisible(false);
        this.joyBola = this.add.circle(0, 0, 32, 0xffffff, 0.35).setVisible(false);
        this.joyPunter = null;

        // Cap botó visible: tocar la meitat dreta de la pantalla = acció (parlar, atacar, avançar diàleg)
        this.input.on('pointerdown', (p, objectes) => {
            if (objectes.length) return;
            if (this.menuObert || this.mapaObert) return;
            if (p.y < ALT_HUD) return;   // la franja del HUD no mou l'Ineu
            if (p.x >= AMPLE * 0.5) {
                if (!this.dialeg) this.accioTactil = true;
            } else if (!this.dialeg) {
                this.joyPunter = p.id;
                this.joyBase.setPosition(p.x, p.y).setVisible(true);
                this.joyBola.setPosition(p.x, p.y).setVisible(true);
            }
        });
        this.input.on('pointermove', p => {
            if (p.id !== this.joyPunter) return;
            const dx = p.x - this.joyBase.x, dy = p.y - this.joyBase.y;
            const dist = Math.min(70, Math.hypot(dx, dy));
            const ang = Math.atan2(dy, dx);
            this.joyBola.setPosition(this.joyBase.x + Math.cos(ang) * dist, this.joyBase.y + Math.sin(ang) * dist);
            const f = dist < 12 ? 0 : dist / 70;
            this.vectorTactil = { x: Math.cos(ang) * f, y: Math.sin(ang) * f };
        });
        const amagar = p => {
            if (p.id !== this.joyPunter) return;
            this.joyPunter = null;
            this.vectorTactil = { x: 0, y: 0 };
            this.joyBase.setVisible(false);
            this.joyBola.setVisible(false);
        };
        this.input.on('pointerup', amagar);
        this.input.on('pointerupoutside', amagar);
    }

    consumirAccioTactil() {
        const a = this.accioTactil;
        this.accioTactil = false;
        return a;
    }
}
