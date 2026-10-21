/**
 * ESCENA UI: corre sempre per sobre de la zona activa.
 * HUD (cors, monedes, objectiu), caixa de diàleg, menú de pausa i controls tàctils.
 */
const AMPLE = 720, ALT = 1280;
const ALT_HUD = 170;   // franja de dalt reservada per al HUD: l'escenari es dibuixa només per sota
const FONT = 'Georgia, "Times New Roman", serif';

function estilText(mida, color = '#fff8e7', extra = {}) {
    return Object.assign({ fontFamily: FONT, fontSize: mida + 'px', color, resolution: 2 }, extra);
}

// Marc de pergamí amb vores de fusta i ornaments d'or (nineslice: les cantonades no s'estiren)
function marcPergami(scene, x, y, w, h, clau = 'marc_gran') {
    const c = (clau === 'marc_gran' ? MARC_GRAN : MARC_PETI) * RES;
    return scene.add.nineslice(x, y, clau, undefined, w * RES, h * RES, c, c, c, c).setScale(1 / RES);
}

// Objectes que es mostren a la dreta del HUD. te: l'Ineu l'ha aconseguit; activa(zona): té efecte ara mateix (brilla i l'acció l'usa)
const OBJECTES_HUD = [
    { id: 'flauta', icona: 'icona_flauta', te: () => Estat.te('flauta'), activa: zona => zona.flautaActiva() }
];

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
            if (this.game.scene.isActive('Musica') || this.game.scene.isActive('Estels')) return;
            if (this.mapaObert) this.tancarMapa();
            else if (this.menuObert) this.tancarMenu();
            else this.obrirMenu();
        });
        this.input.keyboard.on('keydown-UP', () => this.menuObert && this.moureSeleccio(-1));
        this.input.keyboard.on('keydown-DOWN', () => this.menuObert && this.moureSeleccio(1));
        this.input.keyboard.on('keydown-W', () => this.menuObert && this.moureSeleccio(-1));
        this.input.keyboard.on('keydown-S', () => this.menuObert && this.moureSeleccio(1));
        const confirmar = () => {
            if (this.mapaObert) this.tancarMapa();
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

    // ---------------- OBJECTES (columna dreta) ----------------
    // Cada objecte és un medalló només informatiu: quan és "actiu" (brilla), l'acció (ESPAI o tocar la meitat dreta
    // de la pantalla) l'utilitza. Vegeu ZonaBase.flautaActiva.
    crearObjectes() {
        this.objectesHUD = OBJECTES_HUD.map((o, i) => {
            const x = 530 - i * 100, y = ALT_HUD / 2;
            const halo = this.add.circle(x, y, 54, 0xffe08a, 0).setVisible(false);
            const fons = this.add.image(x, y, 'medallo').setScale(1 / RES).setVisible(false);
            const icona = this.add.image(x, y, o.icona).setScale(1 / RES).setVisible(false);
            return { o, halo, fons, icona };
        });
    }

    refrescaObjectes() {
        if (!this.objectesHUD) return;
        const lliure = !this.dialeg && !this.menuObert && !this.mapaObert && !!Estat.dades;
        const zona = lliure ? Joc.zonaActiva(this) : null;
        this.objectesHUD.forEach(({ o, halo, fons, icona }) => {
            const vis = lliure && o.te();
            fons.setVisible(vis); icona.setVisible(vis);
            const actiu = vis && !!zona && o.activa(zona);
            halo.setVisible(actiu).setFillStyle(0xffe08a, actiu ? 0.3 + 0.25 * Math.sin(this.time.now / 180) : 0);
        });
    }

    update() { this.refrescaObjectes(); }

    // La zona consulta això per saber si l'Ineu pot moure's
    get bloquejat() {
        return !!this.dialeg || this.menuObert || this.time.now < this.bloquejatFins || this.game.scene.isActive('Musica') || this.game.scene.isActive('Estels');
    }

    // ---------------- HUD ----------------
    crearHUD() {
        // Franja de dalt: un sol llenç de pergamí enmarcat a tot l'ample; l'escenari comença just a sota
        this.fonsHUD = marcPergami(this, 0, 0, AMPLE, ALT_HUD, 'marc_peti').setOrigin(0);
        this.textCors = this.add.text(48, 36, '', estilText(36, '#c0182a', { stroke: '#4a0a10', strokeThickness: 3 }));
        this.textMonedes = this.add.text(300, 42, '', estilText(26, '#6e4400', { fontStyle: 'bold' }));
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
            this.textAjuda = this.add.text(AMPLE - 16, ALT - 12, 'Fletxes/WASD: moure · ESPAI: parlar o atacar · ESC: menú',
                estilText(12, '#f2e6c8')).setOrigin(1, 1).setAlpha(0.55);
        }
    }

    actualitzarHUD() {
        const d = Estat.dades;
        if (!d) return;
        let cors = '';
        for (let i = 0; i < d.corsMax; i++) cors += d.vida >= (i + 1) * 2 ? '♥' : d.vida === i * 2 + 1 ? '◐' : '♡';
        this.textCors.setText(cors);
        this.textMonedes.setText('● ' + d.monedes);
        this.textObjectiu.setText('Objectiu: ' + (d.objectiu || ''));
        // L'objectiu ha de cabre dins del marc fix de la franja: si és llarg, es redueix la lletra
        let mida = 20;
        this.textObjectiu.setFontSize(mida);
        while (this.textObjectiu.height > 52 && mida > 14) this.textObjectiu.setFontSize(--mida);
        if (this.textAjuda) this.textAjuda.setText('Fletxes/WASD: moure · ESPAI: parlar o atacar' + (Estat.te('foc_jaumeta') ? ' · F: foc' : '') + ' · K: esquivar · ESC: menú');
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
        this.tweens.add({ targets: this.toast, alpha: 0, delay: 1800, duration: 500 });
    }

    // ---------------- DIÀLEG ----------------
    crearCaixaDialeg() {
        this.caixa = this.add.container(AMPLE / 2, ALT - 190).setVisible(false).setDepth(40);
        const ombra = this.add.rectangle(4, 8, 704, 360, 0x000000, 0.35);
        const fons = marcPergami(this, 0, 0, 704, 360);
        // Cinta amb el nom de qui parla, penjada de la vora de dalt
        this.cintaNom = this.add.nineslice(-310, -178, 'cinta_nom', undefined, 120 * RES, 40 * RES, 20 * RES, 20 * RES)
            .setScale(1 / RES).setOrigin(0, 0.5);
        this.plaquetaNom = this.add.text(-310, -178, '', { fontFamily: FONT_PLACA, fontSize: '22px', fontStyle: 'bold', color: '#f8e9b8', resolution: 2 })
            .setOrigin(0, 0.5);
        this.textDialeg = this.add.text(-316, -146, '', estilText(28, '#2a170b', { wordWrap: { width: 632 }, lineSpacing: 5 }));
        this.indicador = this.add.text(318, 152, '▼', estilText(26, '#7a3a14')).setOrigin(1, 1);
        this.tweens.add({ targets: this.indicador, y: 158, yoyo: true, repeat: -1, duration: 400 });
        this.caixa.add([ombra, fons, this.cintaNom, this.plaquetaNom, this.textDialeg, this.indicador]);
    }

    // dialeg = { pagines: [{qui, text}], enAcabar? }
    obrirDialeg(dialeg, enTancar) {
        if (!dialeg || !dialeg.pagines || !dialeg.pagines.length) return;
        this.dialeg = { dades: dialeg, pagina: 0, enTancar };
        this.caixa.setVisible(true);
        this.mostrarPagina();
    }

    mostrarPagina() {
        const p = this.dialeg.dades.pagines[this.dialeg.pagina];
        this.plaquetaNom.setText(p.qui || '').setVisible(!!p.qui).setX(-310 + 28);
        this.cintaNom.setVisible(!!p.qui);
        if (p.qui) this.cintaNom.setSize((this.plaquetaNom.width + 56) * RES, 40 * RES);
        this.textComplet = p.text;
        this.lletres = 0;
        this.textDialeg.setText('');
        // La veu del narrador, en cursiva i en un to vermellós; els personatges, en tinta fosca
        this.textDialeg.setColor(p.qui ? '#2a170b' : '#5a2410').setFontStyle(p.qui ? 'normal' : 'italic');
        this.indicador.setVisible(false);
        if (this.timerText) this.timerText.remove();
        this.timerText = this.time.addEvent({
            delay: 22, loop: true, callback: () => {
                this.lletres++;
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
        if (!this.dialeg) return;
        if (this.timerText) { this.acabarEscriptura(); return; }
        this.dialeg.pagina++;
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
            { text: 'Mapa', fn: () => this.obrirMapa() },
            { text: 'Desar partida', fn: () => { this.tancarMenu(); this.desar(); } },
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
        if (this.dialeg || this.game.scene.isActive('Musica') || this.game.scene.isActive('Estels')) return;
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
        this.notifica(Estat.desar() ? 'Partida desada' : 'No s\'ha pogut desar');
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
