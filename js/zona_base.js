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
const VELOCITAT_INEU = 230;

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

        this.physics.world.setBounds(0, 0, c.amplada, c.alcada);
        this.obstacles = this.physics.add.staticGroup();
        this.interactius = [];
        this.sortides = [];

        this.construir();
        this.crearIneu();

        const cam = this.cameras.main;
        cam.setBounds(0, 0, c.amplada, c.alcada);
        cam.startFollow(this.ineu, true, 0.12, 0.12);
        cam.setBackgroundColor(c.colorFons || '#2d4a22');
        cam.fadeIn(350, 0, 0, 0);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.tecles = this.input.keyboard.addKeys('W,A,S,D,E,SPACE,ENTER');

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
    }

    ui() { return this.scene.get('UI'); }

    // ---------------- Construcció ----------------
    // Fons repetit (herba, llambordes...) en una àrea
    terra(key, x, y, w, h, profunditat = -1000) {
        return this.add.tileSprite(x, y, w, h, key).setOrigin(0).setTileScale(1 / RES).setDepth(profunditat);
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

    cartell(x, y, dialeg) {
        this.posar('cartell', x, y, { col: { w: 20, h: 10 } });
        return this.interactiu(x, y, 70, dialeg, { altura: 70 });
    }

    // Rectangle de sortida: quan l'Ineu el toca, es canvia a la zona "desti" i entra per "entrada"
    sortida(x, y, w, h, desti, entrada) {
        const r = new Phaser.Geom.Rectangle(x, y, w, h);
        this.sortides.push({ r, desti, entrada });
        if (Joc.debug) this.add.rectangle(x, y, w, h).setOrigin(0).setStrokeStyle(2, 0x00ffff).setDepth(99998);
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
        }

        this.ombraIneu = this.add.image(pos.x, pos.y, 'ombra').setScale(0.4).setDepth(-500);
        const S = SPRITE_INEU;
        this.ineu = this.physics.add.sprite(pos.x, pos.y, 'ineu_avall', S.quiet.avall).setOrigin(0.5, S.peus / S.alt);
        this.ineu.setScale(S.alcada / S.alt);
        // Caixa de col·lisió petita als peus (en píxels de textura)
        this.ineu.body.setSize(76, 24);
        this.ineu.body.setOffset((S.ample - 76) / 2, S.peus - 24);
        this.ineu.setCollideWorldBounds(true);
        this.physics.add.collider(this.ineu, this.obstacles);
        this.direccio = pos.dir || 'avall';
        this.posarDireccio(this.direccio);
    }

    // dir: 'avall' | 'amunt' | 'esquerra' | 'dreta'
    posarDireccio(dir, caminant = false) {
        this.direccio = dir;
        const vista = dir === 'esquerra' || dir === 'dreta' ? 'costat' : dir;
        this.ineu.setFlipX(dir === 'esquerra');
        if (caminant) {
            this.ineu.anims.play('caminar_' + vista, true);
        } else {
            this.ineu.anims.stop();
            this.ineu.setTexture('ineu_' + vista, SPRITE_INEU.quiet[vista]);
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
        if (this.canviant) return;
        const ui = this.ui();
        const accio = Phaser.Input.Keyboard.JustDown(this.tecles.SPACE) ||
                      Phaser.Input.Keyboard.JustDown(this.tecles.ENTER) ||
                      Phaser.Input.Keyboard.JustDown(this.tecles.E) ||
                      ui.consumirAccioTactil();

        if ((ui.dialeg || ui.bloquejat) && this.ineu.anims.isPlaying) this.posarDireccio(this.direccio, false);
        if (ui.dialeg) {
            this.ineu.body.setVelocity(0);
            if (accio && !ui.menuObert) ui.avancar();
            this.indicador.setVisible(false);
            return;
        }
        if (ui.bloquejat) {
            this.ineu.body.setVelocity(0);
            return;
        }

        this.moure(ui, delta);
        const proper = this.puntProper();
        this.indicador.setVisible(!!proper);
        if (proper) this.indicador.setPosition(proper.x, proper.y - proper.altura);
        if (accio && proper) this.interactuar(proper);
        this.comprovarSortides();
        if (this.actualitzar) this.actualitzar(time, delta);
    }

    moure(ui, delta) {
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
            this.posarDireccio(dir, true);
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
