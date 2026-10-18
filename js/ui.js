/**
 * ESCENA UI: corre sempre per sobre de la zona activa.
 * HUD (cors, monedes, objectiu), caixa de diàleg, menú de pausa i controls tàctils.
 */
const AMPLE = 1280, ALT = 720;
const FONT = 'Georgia, "Times New Roman", serif';

function estilText(mida, color = '#fff8e7', extra = {}) {
    return Object.assign({ fontFamily: FONT, fontSize: mida + 'px', color, resolution: 2 }, extra);
}

class EscenaUI extends Phaser.Scene {
    constructor() { super('UI'); }

    create() {
        this.dialeg = null;          // diàleg obert
        this.menuObert = false;
        this.bloquejatFins = 0;
        this.vectorTactil = { x: 0, y: 0 };
        this.accioTactil = false;

        this.crearHUD();
        this.crearCaixaDialeg();
        this.crearMenu();
        this.crearControlsTactils();

        this.input.keyboard.on('keydown-ESC', () => this.menuObert ? this.tancarMenu() : this.obrirMenu());
        this.input.keyboard.on('keydown-UP', () => this.menuObert && this.moureSeleccio(-1));
        this.input.keyboard.on('keydown-DOWN', () => this.menuObert && this.moureSeleccio(1));
        this.input.keyboard.on('keydown-W', () => this.menuObert && this.moureSeleccio(-1));
        this.input.keyboard.on('keydown-S', () => this.menuObert && this.moureSeleccio(1));
        const confirmar = () => {
            if (this.menuObert) this.executarOpcio(this.seleccio);
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

    // La zona consulta això per saber si l'Ineu pot moure's
    get bloquejat() {
        return !!this.dialeg || this.menuObert || this.time.now < this.bloquejatFins;
    }

    // ---------------- HUD ----------------
    crearHUD() {
        this.fonsHUD = this.add.rectangle(12, 10, 420, 102, 0x120b06, 0.55).setOrigin(0).setStrokeStyle(2, 0x6e522e);
        this.textCors = this.add.text(26, 16, '', estilText(30, '#e0283a', { stroke: '#000', strokeThickness: 4 }));
        this.textMonedes = this.add.text(30, 54, '', estilText(18, '#ffd34d', { stroke: '#000', strokeThickness: 4, fontStyle: 'bold' }));
        this.textObjectiu = this.add.text(30, 80, '', estilText(14, '#f2e6c8', { fontStyle: 'italic', wordWrap: { width: 395 } }));

        this.bannerZona = this.add.text(AMPLE / 2, 70, '', estilText(34, '#ffe9a8', { stroke: '#1a120b', strokeThickness: 7 }))
            .setOrigin(0.5).setAlpha(0);
        this.toast = this.add.text(AMPLE / 2, 130, '', estilText(20, '#ffffff', { backgroundColor: '#1a120bdd', padding: { x: 14, y: 8 } }))
            .setOrigin(0.5).setAlpha(0).setDepth(50);

        // Botó de menú (ratolí i pantalla tàctil)
        this.botoMenu = this.add.text(AMPLE - 24, 20, '☰ Menú', estilText(18, '#f2e6c8', { backgroundColor: '#1a120bcc', padding: { x: 10, y: 6 } }))
            .setOrigin(1, 0).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.menuObert ? this.tancarMenu() : this.obrirMenu());

        if (!this.sys.game.device.input.touch) {
            this.add.text(AMPLE - 16, ALT - 12, 'Fletxes/WASD: moure · ESPAI: parlar/acció · ESC: menú',
                estilText(13, '#f2e6c8')).setOrigin(1, 1).setAlpha(0.55);
        }
    }

    actualitzarHUD() {
        const d = Estat.dades;
        if (!d) return;
        this.textCors.setText('♥'.repeat(d.cors) + '♡'.repeat(Math.max(0, d.corsMax - d.cors)));
        this.textMonedes.setText('● ' + d.monedes);
        this.textObjectiu.setText('Objectiu: ' + (d.objectiu || ''));
        this.fonsHUD.height = Math.max(102, 86 + this.textObjectiu.height);
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
        this.caixa = this.add.container(AMPLE / 2, ALT - 110).setVisible(false).setDepth(40);
        const fons = this.add.rectangle(0, 0, 1120, 170, 0x1a120b, 0.95).setStrokeStyle(4, 0xd4af37);
        this.plaquetaNom = this.add.text(-540, -100, '', estilText(20, '#1a120b', { backgroundColor: '#d4af37', padding: { x: 12, y: 4 }, fontStyle: 'bold' }));
        this.textDialeg = this.add.text(-530, -62, '', estilText(23, '#ffffff', { wordWrap: { width: 1060 }, lineSpacing: 8 }));
        this.indicador = this.add.text(530, 62, '▼', estilText(20, '#d4af37')).setOrigin(1, 1);
        this.tweens.add({ targets: this.indicador, y: 68, yoyo: true, repeat: -1, duration: 400 });
        this.caixa.add([fons, this.plaquetaNom, this.textDialeg, this.indicador]);
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
        this.plaquetaNom.setText(p.qui || '').setVisible(!!p.qui);
        this.textComplet = p.text;
        this.lletres = 0;
        this.textDialeg.setText('');
        this.textDialeg.setColor(p.qui ? '#ffffff' : '#ffe9a8');
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
        const panell = this.add.rectangle(AMPLE / 2, ALT / 2, 520, 420, 0x1a120b, 0.97).setStrokeStyle(4, 0xd4af37);
        const titol = this.add.text(AMPLE / 2, ALT / 2 - 165, 'Pausa', estilText(32, '#ffd34d', { fontStyle: 'bold' })).setOrigin(0.5);
        this.menu.add([vel, panell, titol]);

        this.opcions = [
            { text: 'Continuar', fn: () => this.tancarMenu() },
            { text: 'Desar partida', fn: () => { this.tancarMenu(); this.desar(); } },
            { text: 'Copiar codi de partida', fn: () => this.copiarCodi() },
            { text: 'Carregar codi de partida', fn: () => this.carregarCodi() },
            { text: 'Tornar al títol', fn: () => { this.tancarMenu(); Joc.anarAlTitol(this); } }
        ];
        this.textOpcions = this.opcions.map((o, i) => {
            const t = this.add.text(AMPLE / 2, ALT / 2 - 95 + i * 58, o.text, estilText(24, '#f2e6c8'))
                .setOrigin(0.5).setInteractive({ useHandCursor: true })
                .on('pointerover', () => { this.seleccio = i; this.pintarSeleccio(); })
                .on('pointerdown', () => this.executarOpcio(i));
            this.menu.add(t);
            return t;
        });
        this.seleccio = 0;
    }

    obrirMenu() {
        if (this.dialeg) return;
        this.menuObert = true;
        this.seleccio = 0;
        this.pintarSeleccio();
        this.menu.setVisible(true);
    }

    tancarMenu() {
        this.menuObert = false;
        this.menu.setVisible(false);
        this.bloquejatFins = this.time.now + 200;
    }

    moureSeleccio(d) {
        this.seleccio = (this.seleccio + d + this.opcions.length) % this.opcions.length;
        this.pintarSeleccio();
    }

    pintarSeleccio() {
        this.textOpcions.forEach((t, i) => {
            t.setColor(i === this.seleccio ? '#ffd34d' : '#f2e6c8');
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

    copiarCodi() {
        const zona = Joc.zonaActiva(this);
        if (zona) zona.guardarPosicio();
        const codi = Estat.exportarCodi();
        const manual = () => window.prompt('Copia aquest codi i guarda\'l bé:', codi);
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(codi)
                .then(() => this.notifica('Codi copiat al porta-retalls'))
                .catch(manual);
        } else {
            manual();
        }
    }

    carregarCodi() {
        const codi = window.prompt('Enganxa el teu codi de partida:');
        if (!codi) return;
        if (Estat.importarCodi(codi)) {
            this.tancarMenu();
            Joc.continuar(this);
        } else {
            this.notifica('Aquest codi no és vàlid');
        }
    }

    // ---------------- CONTROLS TÀCTILS ----------------
    crearControlsTactils() {
        if (!this.sys.game.device.input.touch) return;
        this.input.addPointer(2);

        this.joyBase = this.add.circle(0, 0, 70, 0xffffff, 0.12).setStrokeStyle(3, 0xffffff, 0.4).setVisible(false);
        this.joyBola = this.add.circle(0, 0, 32, 0xffffff, 0.35).setVisible(false);
        this.joyPunter = null;

        this.botoAccio = this.add.circle(AMPLE - 110, ALT - 130, 58, 0xd4af37, 0.45).setStrokeStyle(4, 0xffffff, 0.6)
            .setInteractive()
            .on('pointerdown', () => {
                if (this.dialeg) this.avancar();
                else if (!this.menuObert) this.accioTactil = true;
            });
        this.add.text(AMPLE - 110, ALT - 130, 'ACCIÓ', estilText(18, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5);

        this.input.on('pointerdown', (p, objectes) => {
            if (objectes.length || this.dialeg || this.menuObert) return;
            if (p.x < AMPLE * 0.55) {
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
