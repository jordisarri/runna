/**
 * COMBAT (fase 2)
 * S'afegeix a ZonaBase (carregar després de zona_base.js). Cada zona crida this.enemic(tipus, x, y).
 *   Atac: J, ESPAI o ENTER/E (si no hi ha res per parlar) · Esquiva: K o MAJÚS
 * Vida del jugador en meitats de cor (Estat.dades.vida). Bastó = 1 de dany; Runna = 2.
 * Cap enemic "mor": es desfà en boira lila (els visitants cauen adormits).
 */
const DIRS = { avall: { x: 0, y: 1 }, amunt: { x: 0, y: -1 }, esquerra: { x: -1, y: 0 }, dreta: { x: 1, y: 0 } };

const ENEMICS = {
    // Titella de pràctica del tutorial del Til·ler: no es mou, no fa mal i no es pot derrotar
    espantaocell: {
        tex: 'espantaocell', vida: 999, vel: 0, mal: 0, radi: 22, cos: [30, 16], ombra: 0, practica: true,
        monedes: [0, 0, 0], cor: 0,
        ia() {}
    },

    escolopendra: {
        tex: 'escolopendra', vida: 2, vel: 95, mal: 1, radi: 20, cos: [40, 16], ombra: 0.3,
        monedes: [0.35, 1, 1], cor: 0.08,
        ia(z, e, ara) {
            const jo = z.ineu.body.center, c = e.spr.body.center;
            if (ara > e.canviFins) {
                if (Math.random() < 0.25) {                         // s'atura de cop
                    e.pausaFins = ara + 300 + Math.random() * 300;
                    e.canviFins = e.pausaFins;
                } else {
                    e.ang = Math.random() * Math.PI * 2;            // moviment erràtic
                    if (Phaser.Math.Distance.Between(c.x, c.y, jo.x, jo.y) < 240 && Math.random() < 0.5) {
                        e.ang = Math.atan2(jo.y - c.y, jo.x - c.x) + (Math.random() - 0.5) * 1.2;
                    }
                    e.canviFins = ara + 250 + Math.random() * 450;
                }
            }
            const quiet = ara < (e.pausaFins || 0);
            e.spr.body.setVelocity(quiet ? 0 : Math.cos(e.ang) * this.vel, quiet ? 0 : Math.sin(e.ang) * this.vel);
            e.spr.rotation = e.ang + Math.sin(ara / 70) * 0.12;
        }
    },

    gripau: {
        tex: 'gripau', vida: 3, vel: 250, mal: 1, radi: 22, cos: [36, 22], ombra: 0.38,
        monedes: [0.6, 1, 2], cor: 0.12,
        // Només fa mal mentre salta; en aterrar queda quiet i vulnerable
        perill: e => e.estat === 'salt',
        ia(z, e, ara) {
            const jo = z.ineu.body.center, c = e.spr.body.center;
            const dist = Phaser.Math.Distance.Between(c.x, c.y, jo.x, jo.y);
            if (e.estat === 'salt') {
                if (ara > e.fins) { e.estat = 'repos'; e.fins = ara + 900; e.spr.body.setVelocity(0); e.spr.setScale(e.escalaBase); }
                return;
            }
            e.spr.body.setVelocity(0);
            if (ara > e.fins) {
                const cap = dist < 340 ? Math.atan2(jo.y - c.y, jo.x - c.x) : Math.random() * Math.PI * 2;
                const vel = dist < 340 ? this.vel : 110;
                e.estat = 'salt'; e.fins = ara + (dist < 340 ? 430 : 300);
                e.spr.body.setVelocity(Math.cos(cap) * vel, Math.sin(cap) * vel);
                e.spr.setFlipX(Math.cos(cap) < 0);
                e.spr.setScale(e.escalaBase * 1.18, e.escalaBase * 1.18);
                Sfx.salt();
            }
        }
    },

    // Bolet brut: estàtic; carrega espores (cercle verd) i les deixa anar a l'àrea
    bolet: {
        tex: 'bolet', vida: 2, vel: 0, mal: 1, radi: 22, cos: [34, 18], ombra: 0.35,
        monedes: [0.4, 1, 2], cor: 0.1,
        perill: () => false,            // el mal el fan les espores, no el contacte
        ia(z, e, ara) {
            e.spr.body.setVelocity(0);
            if (!e.proxEsp) e.proxEsp = ara + 1500 + Math.random() * 1500;
            const c = e.spr.body.center;
            if (!e.carregant && ara > e.proxEsp) {
                e.carregant = true; e.fins = ara + 750;
                e.spr.setTint(0xd8ff90);
                e.cercle = z.add.circle(c.x, c.y, 110, 0x9adf50, 0.08).setStrokeStyle(2, 0x9adf50, 0.7).setDepth(c.y - 1);
                z.tweens.add({ targets: e.cercle, alpha: 0.9, duration: 700 });
            } else if (e.carregant && ara > e.fins) {
                e.carregant = false; e.proxEsp = ara + 2600; e.spr.clearTint();
                if (e.cercle) { e.cercle.destroy(); e.cercle = null; }
                z.boiraPuf(c.x, c.y);
                const jo = z.ineu.body.center;
                if (Phaser.Math.Distance.Between(c.x, c.y, jo.x, jo.y) < 115) z.ferIneu(1, c);
            }
        }
    },

    // Embesteix en línia recta: apunta (flaix lila), carrega, i queda cansada i vulnerable
    ovella: {
        tex: 'ovella_boira', vida: 3, vel: 290, mal: 1, radi: 24, cos: [46, 24], ombra: 0.4,
        monedes: [0.5, 1, 2], cor: 0.12,
        perill: e => e.estat === 'carrega',
        ia(z, e, ara) {
            const jo = z.ineu.body.center, c = e.spr.body.center;
            const dist = Phaser.Math.Distance.Between(c.x, c.y, jo.x, jo.y);
            const vel = (v) => e.spr.body.setVelocity(Math.cos(e.ang) * v, Math.sin(e.ang) * v);
            if (e.estat === 'repos' || e.estat === 'cansada') {
                e.spr.body.setVelocity(0);
                if (ara > e.fins) { e.estat = 'vaga'; e.fins = ara + 500; }
            } else if (e.estat === 'apunta') {
                e.spr.body.setVelocity(0);
                if (ara > e.fins) { e.estat = 'carrega'; e.fins = ara + 520; e.spr.clearTint(); vel(this.vel); }
            } else if (e.estat === 'carrega') {
                vel(this.vel);
                if (ara > e.fins) { e.estat = 'cansada'; e.fins = ara + 1000; e.spr.body.setVelocity(0); }
            } else {   // vaga
                if (ara > e.canviFins) { e.ang = Math.random() * Math.PI * 2; e.canviFins = ara + 900 + Math.random() * 800; }
                vel(35);
                if (dist < 380 && ara > e.fins) {
                    e.estat = 'apunta'; e.fins = ara + 650;
                    e.ang = Math.atan2(jo.y - c.y, jo.x - c.x);
                    e.spr.setTint(0xffa8ff);
                    Sfx.carrega();
                }
            }
            e.spr.setFlipX(Math.cos(e.ang) < 0);
        }
    },

    // BOSS: el Germà Andreu convertit en Pastor de Boira. Crida ovelles i carrega amb la caiada.
    pastor: {
        tex: 'pastor_boira', vida: 12, vel: 330, mal: 1, radi: 28, cos: [44, 24], ombra: 0.5,
        monedes: [1, 15, 15], cor: 0, robust: true,
        perill: e => e.estat === 'carrega',
        ia(z, e, ara) {
            const jo = z.ineu.body.center, c = e.spr.body.center;
            const dist = Phaser.Math.Distance.Between(c.x, c.y, jo.x, jo.y);
            const fase2 = e.vida <= 6;
            if (!e.proxCrida) { e.proxCrida = ara + 2500; e.proxCarrega = ara + 3500; }
            const cap = Math.atan2(jo.y - c.y, jo.x - c.x);
            if (e.estat === 'apunta') {
                e.spr.body.setVelocity(0);
                if (ara > e.fins) { e.estat = 'carrega'; e.fins = ara + 340; e.spr.clearTint(); e.spr.body.setVelocity(Math.cos(e.ang) * this.vel, Math.sin(e.ang) * this.vel); }
            } else if (e.estat === 'carrega') {
                if (ara > e.fins) { e.estat = 'cansat'; e.fins = ara + (fase2 ? 700 : 1100); e.spr.body.setVelocity(0); e.proxCarrega = ara + (fase2 ? 2200 : 3400); }
            } else if (e.estat === 'cansat') {
                e.spr.body.setVelocity(0);
                if (ara > e.fins) e.estat = 'camina';
            } else {   // camina cap a l'Ineu i crida el ramat
                e.estat = 'camina';
                const v = dist > 140 ? 42 : 0;
                e.spr.body.setVelocity(Math.cos(cap) * v, Math.sin(cap) * v);
                e.spr.setFlipX(Math.cos(cap) < 0);
                if (ara > e.proxCrida) {
                    e.proxCrida = ara + (fase2 ? 4200 : 6500);
                    const vius = z.enemics.filter(x => x.tipus === 'ovella' && !x.mort).length;
                    if (vius < 4) {
                        z.flotant(c.x, c.y - 120, 'Be-e-e!', '#e0a0ff');
                        Sfx.be();
                        [-1, 1].forEach(s => { const o = z.enemic('ovella', c.x + s * 150, c.y + 60); if (o) { z.boiraPuf(o.spr.x, o.spr.y); o.fins = ara + 900; } });
                    }
                } else if (ara > e.proxCarrega && dist < 440) {
                    e.estat = 'apunta'; e.fins = ara + (fase2 ? 450 : 700); e.ang = cap;
                    e.spr.setTint(0xff8080);
                    Sfx.carrega();
                }
            }
        },
        alDerrotar(z, e) { z.pastorDerrotat(e); }
    },

    visitant: {
        tex: 'visitant', vida: 4, vel: 58, mal: 1, radi: 24, cos: [40, 22], ombra: 0.42,
        monedes: [1, 2, 4], cor: 0.2,
        frases: ['Quin retaule... més... barroc...', 'On... és... el bus?', 'Només volia... una foto...', 'Zzz... retaule... zzz...'],
        ia(z, e, ara) {
            const jo = z.ineu.body.center, c = e.spr.body.center;
            const dist = Phaser.Math.Distance.Between(c.x, c.y, jo.x, jo.y);
            let vx, vy;
            if (dist < 380) {
                const a = Math.atan2(jo.y - c.y, jo.x - c.x);
                vx = Math.cos(a) * this.vel; vy = Math.sin(a) * this.vel;
            } else {
                if (ara > e.canviFins) { e.ang = Math.random() * Math.PI * 2; e.canviFins = ara + 1200 + Math.random() * 1500; e.pausa = Math.random() < 0.4; }
                vx = e.pausa ? 0 : Math.cos(e.ang) * this.vel * 0.5; vy = e.pausa ? 0 : Math.sin(e.ang) * this.vel * 0.5;
            }
            e.spr.body.setVelocity(vx, vy);
            if (Math.abs(vx) > 5) e.spr.setFlipX(vx < 0);
            e.spr.rotation = Math.sin(ara / 220) * 0.05;     // caminar de zombi
        }
    }
};

Object.assign(ZonaBase.prototype, {
    // ---------------- Crear enemics ----------------
    enemic(tipus, x, y, opts = {}) {
        const def = ENEMICS[tipus];
        // Fins que l'Ineu no ha acabat el tutorial del bastó, la boira no ha despertat les bestioles
        if (!def.practica && !Estat.flag('combatActiu')) return null;
        const tex = this.textures.get(def.tex);
        const esc = ((tex.customData && tex.customData.escala) || 1 / RES);
        const spr = this.physics.add.sprite(x, y, def.tex).setScale(esc);
        const fw = tex.getSourceImage().width, fh = tex.getSourceImage().height;
        spr.body.setSize(def.cos[0] / esc, def.cos[1] / esc);
        spr.body.setOffset((fw - def.cos[0] / esc) / 2, fh - def.cos[1] / esc);
        spr.setCollideWorldBounds(true);
        this.physics.add.collider(spr, this.obstacles);
        const ombra = this.add.image(x, y, 'ombra').setScale(def.ombra || 0.3).setDepth(-500).setVisible(!!def.ombra);
        const e = {
            spr, ombra, tipus, def, vida: def.vida, mort: false, atorditFins: 0, escalaBase: esc,
            ang: Math.random() * Math.PI * 2, canviFins: 0, estat: 'repos', fins: this.time.now + 600 + Math.random() * 600
        };
        if (opts.sortida) {                 // surt de l'aigua (gripaus de la Bassadòria)
            spr.setAlpha(0).setScale(0.1);
            e.atorditFins = this.time.now + 600;
            this.tweens.add({ targets: spr, alpha: 1, scale: esc, duration: 450, ease: 'Back.out' });
            this.esquitxar(x, y);
        }
        this.enemics.push(e);
        return e;
    },

    esquitxar(x, y) {
        const p = this.add.particles(x, y, 'espurna', {
            speed: { min: 40, max: 120 }, lifespan: 420, scale: { start: 0.7, end: 0 },
            tint: 0x9a7acf, quantity: 8, emitting: false
        }).setDepth(99990);
        p.explode(8);
        this.time.delayedCall(600, () => p.destroy());
    },

    flotant(x, y, text, color = '#ffffff') {
        const t = this.add.text(x, y, text, estilText(26, color, { stroke: '#000', strokeThickness: 4, fontStyle: 'bold' }))
            .setOrigin(0.5, 1).setDepth(99999);
        this.tweens.add({ targets: t, y: y - 46, alpha: 0, duration: 1300, delay: 300, onComplete: () => t.destroy() });
    },

    congelarEnemics() {
        this.enemics.forEach(e => { if (!e.mort) e.spr.body.setVelocity(0); });
    },

    // ---------------- Atac i esquiva del jugador ----------------
    teArma() { return Estat.te('basto') || Estat.te('runna'); },

    atacar() {
        const ara = this.time.now;
        if (!this.teArma() || this.config.pacifica || ara < (this.atacFins || 0) || this.caient || this.assegut) return;
        const runna = Estat.te('runna');
        const agil = runna || Estat.te('basto_tiller');          // el bastó de Til·ler (i Runna) són més ràpids i amb més abast
        this.atacFins = ara + (agil ? 270 : 380);
        const d = DIRS[this.direccio] || DIRS.avall;
        const jo = this.ineu.body.center;
        const dany = runna ? 2 : 1;
        // Zona de cop al terra, davant l'Ineu (amunt arriba una mica més lluny: l'enemic es veu "per sobre" del cap)
        const reach = d.y < 0 ? 58 : 48;
        const px = jo.x + d.x * reach, py = jo.y + d.y * reach, abast = agil ? 66 : 58;

        // Petit tret endavant, so i mitja lluna que surt de la silueta de l'Ineu
        this.forcat = { vx: d.x * 150, vy: d.y * 150, fins: ara + 100 };
        Sfx.atac(runna);
        this.tallBasto(jo, d, runna, agil);

        let encertats = 0;
        this.enemics.forEach(e => {
            if (e.mort) return;
            const c = e.spr.body.center;
            if (Phaser.Math.Distance.Between(c.x, c.y, px, py) < abast + e.def.radi) { this.colpejar(e, dany, d); encertats++; }
        });
        if (encertats) this.forcat = { vx: -d.x * 110, vy: -d.y * 110, fins: ara + 80 };     // retrocés en xocar
        // Runna talla els esbarzers negres
        if (runna) this.esbarzers.forEach(o => { if (o.viu && Phaser.Math.Distance.Between(o.x, o.y - 20, px, py) < 85) this.destruirEsbarzer(o, false); });
    },

    // La mitja lluna del cop: surt del pit de l'Ineu, més enllà del cap, dels peus i dels costats
    tallBasto(jo, d, runna, agil) {
        const ang = Math.atan2(d.y, d.x);
        const color = runna ? 0xffe08a : agil ? 0xd8f0b0 : 0xf5ecd0;
        const g = this.add.graphics().setDepth(99990).setPosition(jo.x, jo.y - 62);
        const R = agil ? 118 : 108;
        [[0, 12, 0.95], [-14, 7, 0.55], [-28, 4, 0.3]].forEach(([dr, gruix, alfa]) => {
            g.lineStyle(gruix, dr ? 0xffffff : color, alfa).beginPath().arc(0, 0, R + dr, ang - 1.05, ang + 1.05).strokePath();
        });
        g.rotation = -0.45; g.setScale(0.8);
        this.tweens.add({ targets: g, rotation: 0.35, scale: 1.12, alpha: 0, duration: 200, ease: 'Cubic.out', onComplete: () => g.destroy() });
        // Fragments de vent a la vora de la lluna
        const p = this.add.particles(jo.x + d.x * R * 0.7, jo.y - 62 + d.y * R * 0.7, 'espurna', {
            angle: { min: Phaser.Math.RadToDeg(ang) - 50, max: Phaser.Math.RadToDeg(ang) + 50 },
            speed: { min: 60, max: 200 }, lifespan: 240, scale: { start: 0.22, end: 0 },
            tint: color, quantity: 6, emitting: false
        }).setDepth(99989);
        p.explode(6);
        this.time.delayedCall(350, () => p.destroy());
    },

    esquivar() {
        const ara = this.time.now;
        if (!this.teArma() || this.config.pacifica || ara < (this.esquivaFins || 0) || this.caient || this.assegut) return;
        this.esquivaFins = ara + 750;
        const c = this.cursors, t = this.tecles;
        let dx = (c.right.isDown || t.D.isDown ? 1 : 0) - (c.left.isDown || t.A.isDown ? 1 : 0);
        let dy = (c.down.isDown || t.S.isDown ? 1 : 0) - (c.up.isDown || t.W.isDown ? 1 : 0);
        if (!dx && !dy) { const d = DIRS[this.direccio]; dx = d.x; dy = d.y; }
        const l = Math.hypot(dx, dy);
        this.forcat = { vx: dx / l * 520, vy: dy / l * 520, fins: ara + 170 };
        this.invulnerableFins = ara + 380;
        Sfx.esquiva();
        this.polsEsquiva();
        this.ineu.setAlpha(0.55);
        this.time.delayedCall(380, () => { if (!this.caient) this.ineu.setAlpha(1); });
    },

    colpejar(e, dany, d) {
        const ara = this.time.now;
        if (e.def.practica) { this.colpPractica(e, d); return; }
        e.vida -= dany;
        const mort = e.vida <= 0;
        if (e.def.robust) {             // els bosses no perden el torn ni surten volant
            e.atorditFins = ara + 110;
            e.spr.body.setVelocity(d.x * 90, d.y * 90);
        } else {
            e.atorditFins = ara + 260;
            e.estat = 'repos'; e.fins = ara + 700;
            e.spr.body.setVelocity(d.x * 380, d.y * 380);      // retrocés fort
        }
        // Flaix blanc, esclafament i sacsejada de l'enemic
        e.spr.setTintFill(0xffffff);
        this.time.delayedCall(100, () => { if (e.spr.active) e.spr.clearTint(); });
        this.tweens.killTweensOf(e.spr);
        e.spr.setScale(e.escalaBase * 1.3, e.escalaBase * 0.72);
        this.tweens.add({ targets: e.spr, scaleX: e.escalaBase, scaleY: e.escalaBase, duration: 200, ease: 'Back.out' });
        const c = e.spr.body.center;
        this.impacte(c.x, c.y - 10, d, mort ? 2 : dany > 1 ? 1 : 0);
        Sfx.cop(mort || dany > 1);
        this.hitStop(mort ? 120 : dany > 1 ? 85 : 55);
        this.cameras.main.shake(mort ? 170 : 110, mort ? 0.008 : 0.004, true);
        if (mort) this.derrotar(e);
    },

    // Espurnes direccionals, anell d'impacte i estrelleta. forta: 0 normal, 1 Runna, 2 colp final
    impacte(x, y, d, forta = 0) {
        const ang = Phaser.Math.RadToDeg(Math.atan2(d.y, d.x));
        const n = 8 + forta * 5;
        const p = this.add.particles(x, y, 'espurna', {
            angle: { min: ang - 38, max: ang + 38 }, speed: { min: 140, max: 380 }, lifespan: { min: 200, max: 380 },
            scale: { start: 0.3 + forta * 0.08, end: 0 }, tint: [0xffffff, 0xffe08a, 0xff9a40], quantity: n, emitting: false
        }).setDepth(99991);
        p.explode(n);
        // Borrissol lila cap als costats
        const q = this.add.particles(x, y, 'espurna', {
            speed: { min: 30, max: 110 }, lifespan: 500, scale: { start: 0.4, end: 0 }, tint: 0x9a7acf, quantity: 6, emitting: false
        }).setDepth(99990);
        q.explode(6);
        this.time.delayedCall(650, () => { p.destroy(); q.destroy(); });
        // Anell i ratlles
        const g = this.add.graphics().setDepth(99992).setPosition(x, y);
        g.lineStyle(forta ? 5 : 3, 0xffffff, 0.95).strokeCircle(0, 0, 14);
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2 + Math.random() * 0.4;
            g.lineStyle(3, 0xfff0b0, 0.9).lineBetween(Math.cos(a) * 14, Math.sin(a) * 14, Math.cos(a) * 30, Math.sin(a) * 30);
        }
        this.tweens.add({ targets: g, scale: 1.7 + forta * 0.6, alpha: 0, duration: 230, ease: 'Cubic.out', onComplete: () => g.destroy() });
    },

    // Micro-congelació: el món s'atura un instant (física, animacions i tweens) i la càmera segueix tremolant
    hitStop(ms) {
        if (!this.physics || !this.physics.world) return;
        const fins = performance.now() + ms;
        if (this.hitStopFins && fins <= this.hitStopFins) return;
        const nou = !this.hitStopFins;
        this.hitStopFins = fins;
        if (nou) {
            this.physics.world.pause();
            this.anims.pauseAll();
            this.tweens.timeScale = 0.04;
        }
        clearTimeout(this.hitStopTimer);
        this.hitStopTimer = setTimeout(() => {
            this.hitStopFins = 0;
            this.anims.resumeAll();                       // les animacions són globals: es reprenen sempre
            if (!this.sys || !this.sys.settings || this.sys.settings.status > Phaser.Scenes.RUNNING) return;
            this.physics.world.resume();
            this.tweens.timeScale = 1;
        }, ms);
    },

    polsEsquiva() {
        const c = this.ineu.body.center;
        const p = this.add.particles(c.x, c.y + 8, 'boira', {
            speed: { min: 10, max: 40 }, lifespan: 380, scale: { start: 0.25, end: 0.6 },
            alpha: { start: 0.45, end: 0 }, quantity: 4, emitting: false
        }).setDepth(this.ineu.depth - 1);
        p.explode(4);
        this.time.delayedCall(450, () => p.destroy());
    },

    // Vinyeta vermella a les vores de la pantalla quan et fan mal
    vinyeta() {
        const cam = this.cameras.main;
        const w = cam.width / cam.zoom, h = cam.height / cam.zoom;
        const g = this.add.graphics().setDepth(99995);
        const f = 130, K = 0xd01830;
        g.fillGradientStyle(K, K, K, K, 0.65, 0.65, 0, 0).fillRect(0, 0, w, f);
        g.fillGradientStyle(K, K, K, K, 0, 0, 0.65, 0.65).fillRect(0, h - f, w, f);
        g.fillGradientStyle(K, K, K, K, 0.65, 0, 0.65, 0).fillRect(0, 0, f, h);
        g.fillGradientStyle(K, K, K, K, 0, 0.65, 0, 0.65).fillRect(w - f, 0, f, h);
        // Fixa a la vista de la càmera (ella es mou amb l'Ineu)
        const seguir = () => g.setPosition(cam.worldView.x, cam.worldView.y);
        seguir();
        this.events.on('update', seguir);
        this.tweens.add({ targets: g, alpha: 0, duration: 520, ease: 'Quad.out', onComplete: () => { this.events.off('update', seguir); g.destroy(); } });
    },

    // Cop a un espantaocell: s'agita i compta cap al tutorial
    colpPractica(e, d) {
        Sfx.cop(false);
        this.hitStop(45);
        this.cameras.main.shake(80, 0.003, true);
        e.spr.setTintFill(0xffffff);
        this.time.delayedCall(80, () => { if (e.spr.active) e.spr.clearTint(); });
        this.tweens.add({ targets: e.spr, angle: { from: -14, to: 0 }, duration: 260, ease: 'Elastic.out' });
        const c = e.spr.body.center;
        this.impacte(c.x, c.y - 20, d || DIRS.avall, 0);
        const f = Estat.dades.flags;
        f.practica = (f.practica || 0) + 1;
        this.flotant(c.x, c.y - 90, `${Math.min(f.practica, 6)}/6`, '#f5ecd0');
        if (f.practica >= 6 && !Estat.flag('tutorialCombat')) this.acabarTutorial();
    },

    acabarTutorial() {
        Estat.posaFlag('tutorialCombat');
        this.time.delayedCall(500, () => this.ui().obrirDialeg({
            pagines: [
                { qui: 'El Gran Til·ler', text: "Prou, prou, petit monjo! Ja saps manejar el bastó. Recorda: l'esquiva (K) et salvarà més sovint que el cop." },
                { qui: 'El Gran Til·ler', text: "Escolta. Sota terra s'ha esquerdat un segell molt antic, i la boira desperta les bestioles del vell cementiri." },
                { qui: '', text: "La boira s'espesseix. A partir d'ara hi haurà escolopendres, gripaus i visitants perduts pels camins.\nAtac: J o ESPAI · Esquiva: K o Majús." }
            ],
            enAcabar: () => {
                Estat.posaFlag('combatActiu');
                Estat.posaObjectiu('La boira ha despertat bestioles: ves amb compte pels camins i segueix investigant.');
            }
        }));
    },

    derrotar(e) {
        e.mort = true;
        if (e.cercle) { e.cercle.destroy(); e.cercle = null; }
        e.spr.body.setVelocity(0);
        e.spr.body.enable = false;
        const c = e.spr.body.center;
        Estat.dades.flags.derrotats = (Estat.dades.flags.derrotats || 0) + 1;
        this.boiraPuf(c.x, c.y);
        Sfx.derrota();
        this.tweens.killTweensOf(e.spr);
        this.ondaMort(c.x, c.y);
        if (e.def.alDerrotar) { e.def.alDerrotar(this, e); return; }

        if (e.tipus === 'visitant') {            // cau adormit i es desperta confús
            const frase = e.def.frases[Math.floor(Math.random() * e.def.frases.length)];
            this.flotant(c.x, c.y - 90, frase, '#ffe9a8');
            this.tweens.add({ targets: e.spr, angle: 90, duration: 300 });
            this.tweens.add({ targets: [e.spr, e.ombra], alpha: 0, duration: 700, delay: 1500, onComplete: () => this.retirar(e) });
        } else {
            this.tweens.add({ targets: e.spr, scale: 0.05, alpha: 0, angle: e.spr.angle + 180, duration: 320, onComplete: () => this.retirar(e) });
            e.ombra.setVisible(false);
        }

        // Botí: només cors de tant en tant (no hi ha monedes: no es compra ni es ven res)
        if (Math.random() < e.def.cor && Estat.dades.vida < Estat.dades.corsMax * 2) {
            const abans = Estat.dades.vida;
            Estat.dades.vida = Math.min(Estat.dades.corsMax * 2, Estat.dades.vida + 2);
            this.flotant(c.x + 20, c.y - 60, '+♥', '#ff6a7a');
            Sfx.cura();
            this.time.delayedCall(250, () => { const ui = this.ui(); if (ui && ui.animarGuany) ui.animarGuany(abans, Estat.dades.vida); });
        }
        this.ui().actualitzarHUD();
    },

    // Anell gran i espurnes d'un enemic que es desfà
    ondaMort(x, y) {
        const g = this.add.graphics().setDepth(99992).setPosition(x, y);
        g.lineStyle(6, 0xe0c8ff, 0.9).strokeCircle(0, 0, 24);
        this.tweens.add({ targets: g, scale: 3, alpha: 0, duration: 420, ease: 'Cubic.out', onComplete: () => g.destroy() });
        const p = this.add.particles(x, y - 10, 'espurna', {
            speed: { min: 90, max: 280 }, lifespan: { min: 350, max: 650 }, scale: { start: 0.35, end: 0 },
            tint: [0xe0c8ff, 0xffffff, 0x9a7acf], gravityY: -60, quantity: 16, emitting: false
        }).setDepth(99991);
        p.explode(16);
        this.time.delayedCall(800, () => p.destroy());
    },

    boiraPuf(x, y) {
        Sfx.puf();
        const p = this.add.particles(x, y, 'boira', {
            speed: { min: 20, max: 70 }, lifespan: 900, scale: { start: 0.6, end: 1.6 },
            alpha: { start: 0.7, end: 0 }, quantity: 8, emitting: false
        }).setDepth(99980);
        p.explode(8);
        this.time.delayedCall(1100, () => p.destroy());
    },

    retirar(e) {
        e.spr.destroy(); e.ombra.destroy();
        this.enemics = this.enemics.filter(x => x !== e);
    },

    // Final del combat contra el Pastor de Boira
    pastorDerrotat(e) {
        const c = e.spr.body.center;
        this.enemics.filter(x => x.tipus === 'ovella' && !x.mort).forEach(o => {
            o.mort = true; o.spr.body.enable = false; this.boiraPuf(o.spr.x, o.spr.y);
            this.tweens.add({ targets: [o.spr, o.ombra], alpha: 0, duration: 500, onComplete: () => this.retirar(o) });
        });
        this.tweens.add({ targets: e.spr, angle: 80, duration: 400 });
        this.ui().actualitzarHUD();
        this.time.delayedCall(900, () => this.ui().obrirDialeg(DIALEGS.andreuDerrotat(Estat), () => {
            this.tweens.add({ targets: [e.spr, e.ombra], alpha: 0, duration: 800, onComplete: () => this.retirar(e) });
            Estat.desar();
        }));
    },

    // ---------------- Dany al jugador ----------------
    ferIneu(mal, des) {
        const ara = this.time.now;
        if (ara < (this.invulnerableFins || 0) || this.caient) return;
        // La Cinta de la Nena absorbeix un cop cada cop que entres a una zona
        if (Estat.te('cinta_nena') && !this.cintaGastada) {
            this.cintaGastada = true;
            this.invulnerableFins = ara + 1100;
            this.flotant(this.ineu.x, this.ineu.y - 150, 'La cinta et protegeix', '#e0a0c0');
            Sfx.escut();
            return;
        }
        const d = Estat.dades;
        const abans = d.vida;
        d.vida = Math.max(0, d.vida - mal);
        this.invulnerableFins = ara + 1100;
        const c = this.ineu.body.center;
        let dx = c.x - des.x, dy = c.y - des.y;
        const l = Math.hypot(dx, dy) || 1;
        this.forcat = { vx: dx / l * 420, vy: dy / l * 420, fins: ara + 210 };      // retrocés
        // Cop rebut: so, congelació, sacsejada, vinyeta, espurnes i flaix blanc
        Sfx.ferit();
        Sfx.corPerdut();
        this.hitStop(130);
        this.cameras.main.shake(260, 0.013, true);
        this.vinyeta();
        this.ineu.setTintFill(0xffffff);
        this.time.delayedCall(110, () => { if (this.ineu.active) this.ineu.setTint(0xff6060); });
        this.time.delayedCall(320, () => { if (this.ineu.active) this.ineu.clearTint(); });
        this.impacte(c.x, c.y - 50, { x: dx / l, y: dy / l }, 1);
        const sang = this.add.particles(c.x, c.y - 50, 'espurna', {
            speed: { min: 60, max: 220 }, lifespan: 480, scale: { start: 0.3, end: 0 },
            tint: [0xe03a4a, 0xff7a8a], gravityY: 380, quantity: 10, emitting: false
        }).setDepth(99991);
        sang.explode(10);
        this.time.delayedCall(600, () => sang.destroy());
        this.tweens.add({ targets: this.ineu, alpha: 0.3, yoyo: true, repeat: 4, duration: 90, onComplete: () => { if (!this.caient) this.ineu.setAlpha(1); } });
        const ui = this.ui();
        ui.actualitzarHUD();
        if (ui.animarPerdua) ui.animarPerdua(abans, d.vida);
        if (d.vida <= 0) this.caure();
    },

    // L'Ineu cau: el Pare Jordi el recull a la Plaça amb tota la vida
    caure() {
        this.caient = true; this.canviant = true;
        this.ineu.body.setVelocity(0);
        this.cameras.main.fadeOut(900, 40, 0, 20);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            Estat.dades.vida = Estat.dades.corsMax * 2;
            Estat.dades.entrada = 'inici'; Estat.dades.x = null; Estat.dades.y = null;
            Estat.caigut = true;
            this.scene.start('ZonaPlaca', { entrada: 'inici' });
        });
    },

    // ---------------- Bucle ----------------
    actualitzarCombat(ara) {
        const jo = this.ineu.body.center;
        for (const e of this.enemics) {
            if (e.mort) continue;
            const b = e.spr.body;
            if (ara >= e.atorditFins) e.def.ia.call(e.def, this, e, ara);
            e.spr.setDepth(b.bottom);
            e.ombra.setPosition(b.center.x, b.bottom - 4);
            // Contacte amb l'Ineu
            const perillos = e.def.perill ? e.def.perill(e) : true;
            if (perillos && ara >= e.atorditFins &&
                Phaser.Math.Distance.Between(b.center.x, b.center.y, jo.x, jo.y) < e.def.radi + 20) {
                this.ferIneu(e.def.mal, b.center);
            }
        }
    }
});
