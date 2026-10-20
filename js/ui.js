/**
 * ESCENA UI: corre sempre per sobre de la zona activa.
 * HUD (cors, monedes, objectiu), caixa de diàleg, menú de pausa i controls tàctils.
 */
const AMPLE = 720, ALT = 1280;
const FONT = 'Georgia, "Times New Roman", serif';

function estilText(mida, color = '#fff8e7', extra = {}) {
    return Object.assign({ fontFamily: FONT, fontSize: mida + 'px', color, resolution: 2 }, extra);
}

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

    // La zona consulta això per saber si l'Ineu pot moure's
    get bloquejat() {
        return !!this.dialeg || this.menuObert || this.time.now < this.bloquejatFins || this.game.scene.isActive('Musica') || this.game.scene.isActive('Estels');
    }

    // ---------------- HUD ----------------
    crearHUD() {
        this.fonsHUD = this.add.rectangle(12, 10, 440, 130, 0x120b06, 0.55).setOrigin(0).setStrokeStyle(2, 0x6e522e);
        this.textCors = this.add.text(26, 14, '', estilText(38, '#e0283a', { stroke: '#000', strokeThickness: 4 }));
        this.textMonedes = this.add.text(30, 62, '', estilText(26, '#ffd34d', { stroke: '#000', strokeThickness: 4, fontStyle: 'bold' }));
        this.textObjectiu = this.add.text(30, 98, '', estilText(24, '#f2e6c8', { fontStyle: 'italic', wordWrap: { width: 410 } }));

        this.bannerZona = this.add.text(AMPLE / 2, 180, '', estilText(42, '#ffe9a8', { stroke: '#1a120b', strokeThickness: 7 }))
            .setOrigin(0.5).setAlpha(0);
        this.toast = this.add.text(AMPLE / 2, 240, '', estilText(28, '#ffffff', { backgroundColor: '#1a120bdd', padding: { x: 16, y: 10 }, wordWrap: { width: 640 }, align: 'center' }))
            .setOrigin(0.5).setAlpha(0).setDepth(50);

        // Botó de menú (ratolí i pantalla tàctil)
        this.botoMenu = this.add.text(AMPLE - 12, 12, '☰', estilText(40, '#f2e6c8', { backgroundColor: '#1a120bcc', padding: { x: 16, y: 8 } }))
            .setOrigin(1, 0).setInteractive({ useHandCursor: true })
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
        this.fonsHUD.setSize(440, Math.max(130, 112 + this.textObjectiu.height));
        const flauta = Estat.te('flauta');
        if (this.textAjuda) this.textAjuda.setText('Fletxes/WASD: moure · ESPAI: parlar o atacar' + (flauta ? ' · M: flauta' : '') + (Estat.te('foc_jaumeta') ? ' · F: foc' : '') + ' · K: esquivar · ESC: menú');
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
        const fons = this.add.rectangle(0, 0, 690, 360, 0x1a120b, 0.95).setStrokeStyle(4, 0xd4af37);
        this.plaquetaNom = this.add.text(-330, -204, '', estilText(28, '#1a120b', { backgroundColor: '#d4af37', padding: { x: 12, y: 4 }, fontStyle: 'bold' }));
        this.textDialeg = this.add.text(-325, -156, '', estilText(30, '#ffffff', { wordWrap: { width: 650 }, lineSpacing: 6 }));
        this.indicador = this.add.text(325, 172, '▼', estilText(28, '#d4af37')).setOrigin(1, 1);
        this.tweens.add({ targets: this.indicador, y: 178, yoyo: true, repeat: -1, duration: 400 });
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
        const panell = this.add.rectangle(AMPLE / 2, ALT / 2, 640, 700, 0x1a120b, 0.97).setStrokeStyle(4, 0xd4af37);
        const titol = this.add.text(AMPLE / 2, ALT / 2 - 300, 'Pausa', estilText(44, '#ffd34d', { fontStyle: 'bold' })).setOrigin(0.5);
        this.menu.add([vel, panell, titol]);

        this.opcions = [
            { text: 'Continuar', fn: () => this.tancarMenu() },
            { text: 'Mapa', fn: () => this.obrirMapa() },
            { text: 'Tocar la flauta', fn: () => this.tocarFlauta() },
            { text: 'Desar partida', fn: () => { this.tancarMenu(); this.desar(); } },
            { text: 'Copiar codi de partida', fn: () => this.copiarCodi() },
            { text: 'Carregar codi de partida', fn: () => this.carregarCodi() },
            { text: 'Tornar al títol', fn: () => { this.tancarMenu(); Joc.anarAlTitol(this); } }
        ];
        this.textOpcions = this.opcions.map((o, i) => {
            const t = this.add.text(AMPLE / 2, ALT / 2 - 215 + i * 78, o.text, estilText(34, '#f2e6c8'))
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
            t.setColor(i === this.seleccio ? '#ffd34d' : '#f2e6c8');
            t.setText((i === this.seleccio ? '▸ ' : '') + this.opcions[i].text);
        });
    }

    executarOpcio(i) { this.opcions[i].fn(); }

    tocarFlauta() {
        if (!Estat.te('flauta')) { this.notifica('Encara no tens cap flauta'); return; }
        const zona = Joc.zonaActiva(this);
        this.tancarMenu();
        if (zona) zona.obrirMusica();
    }

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

        // Cap botó visible: tocar la meitat dreta de la pantalla = acció (parlar, atacar, avançar diàleg)
        this.input.on('pointerdown', (p, objectes) => {
            if (objectes.length) return;
            if (this.menuObert || this.mapaObert) return;
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
