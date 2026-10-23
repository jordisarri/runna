/**
 * COMBAT (fase 2)
 * S'afegeix a ZonaBase (carregar després de zona_base.js). Cada zona crida this.enemic(tipus, x, y).
 *   Atac: J, ESPAI o ENTER/E (si no hi ha res per parlar)
 * Vida del jugador en meitats de cor (Estat.dades.vida). Bastó = 1 de dany; Runna = 2.
 * Cap enemic "mor": es desfà en boira lila (els visitants cauen adormits).
 */
const DIRS = { avall: { x: 0, y: 1 }, amunt: { x: 0, y: -1 }, esquerra: { x: -1, y: 0 }, dreta: { x: 1, y: 0 } };

const ENEMICS = {
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
        if (!Estat.flag('combatActiu')) return null;
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
            if (opts.salt) {                // i s'escapa d'un salt cap a un punt de l'escena
                const t = opts.salt, dur = 900;
                e.atorditFins = this.time.now + dur + 200;
                this.tweens.addCounter({
                    from: 0, to: 1, duration: dur, ease: 'Sine.easeInOut',
                    onUpdate: tw => {
                        if (e.mort || !spr.active) return;
                        const k = tw.getValue();
                        spr.body.reset(x + (t.x - x) * k, y + (t.y - y) * k - Math.sin(Math.PI * k) * 90);
                    },
                    onComplete: () => { if (!e.mort && spr.active) { spr.body.reset(t.x, t.y); this.esquitxar(t.x, t.y); } }
                });
            }
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

    // ---------------- Atac del jugador ----------------
    teArma() { return Estat.te('basto') || Estat.te('runna'); },

    atacar() {
        const ara = this.time.now;
        if (!this.teArma() || this.config.pacifica || ara < (this.atacFins || 0) || this.caient || this.assegut) return;
        const runna = Estat.te('runna');
        const agil = runna || Estat.te('basto_tiller');          // el bastó de Til·ler (i Runna) són més ràpids i amb més abast
        this.atacFins = ara + (agil ? 270 : 380);
        const jo = this.ineu.body.center;
        const L = agil ? 135 : 118;                              // llargada de la zona de cop (des dels peus)
        // Direcció: la de la vista de 8 direccions; si hi ha un enemic a prop dins del con, s'hi apunta
        const v8 = { right: [1, 0], southeast: [1, 1], down: [0, 1], southwest: [-1, 1], left: [-1, 0], northwest: [-1, -1], up: [0, -1], northeast: [1, -1] }[this.vista8];
        let d = v8 ? { x: v8[0] / Math.hypot(...v8), y: v8[1] / Math.hypot(...v8) } : (DIRS[this.direccio] || DIRS.avall);
        let millor = null, millorDist = Infinity;
        this.enemics.forEach(e => {
            if (e.mort) return;
            const c = e.spr.body.center, dist = Phaser.Math.Distance.Between(c.x, c.y, jo.x, jo.y);
            if (dist > L + e.def.radi + 30 || dist >= millorDist) return;
            const dif = Math.abs(Phaser.Math.Angle.Wrap(Math.atan2(c.y - jo.y, c.x - jo.x) - Math.atan2(d.y, d.x)));
            if (dif < 1.0) { millor = c; millorDist = dist; }
        });
        if (millor) { const a = Math.atan2(millor.y - jo.y, millor.x - jo.x); d = { x: Math.cos(a), y: Math.sin(a) }; }
        if (Math.abs(d.x) > Math.abs(d.y) * 1.1) this.direccio = d.x < 0 ? 'esquerra' : 'dreta';
        else this.direccio = d.y < 0 ? 'amunt' : 'avall';

        // So, arma visible i mitja lluna (l'Ineu no es desplaça en atacar)
        Sfx.atac(runna);
        this.tallBasto(jo, d, runna, agil);
        if (!this.animarAtac(d, runna, agil)) { this.atacantFins = ara + 260; this.armaCop(d, runna, agil); }       // amb fulla d'atac, l'arma és una capa que segueix la mà
        // Finestra de cop activa mentre dura l'animació: cada enemic només rep un cop per atac
        this.cop = { fins: ara + 200, d, L, ample: agil ? 34 : 28, dany: runna ? 2 : 1, tocats: new Set(), runna };
        this.comprovarCop();
        // Runna talla els esbarzers negres
        if (runna) {
            const px = jo.x + d.x * 55, py = jo.y + d.y * 55;
            this.esbarzers.forEach(o => { if (o.viu && Phaser.Math.Distance.Between(o.x, o.y - 20, px, py) < 85) this.destruirEsbarzer(o, false); });
        }
    },

    // Animació d'atac de l'Ineu amb la fulla de la direcció (8 vistes). Retorna fals si no n'hi ha.
    // La fulla mostra l'Ineu sense arma: l'arma (bastó, branca del Til·ler o espasa) és una capa que segueix la mà (ATAC_ARMA).
    animarAtac(d, runna, agil) {
        const vista = OCTANTS_INEU[(Math.round(Math.atan2(d.y, d.x) / (Math.PI / 4)) + 8) % 8];
        if (!Grafics.atacsVista || !Grafics.atacsVista.has(vista)) return false;
        this.atacantFins = 0;
        this.vista8Manual = true;
        this.posarDireccio(this.direccio, false, vista);
        this.atacantFins = this.time.now + ATAC_INEU.fotogrames.length / ATAC_INEU.fps * 1000;
        const net = this.capaArma(vista, runna, agil);
        this.ineu.anims.play('atac_' + vista, true);
        this.ineu.once('animationcomplete', () => {
            net();
            this.atacantFins = 0;
            if (!this.caient) this.posarDireccio(this.direccio, false);
        });
        return true;
    },

    // L'arma de l'atac: una imatge que a cada fotograma de l'animació es posa a la mà de l'Ineu (taula ATAC_ARMA).
    // Retorna la funció que la treu.
    capaArma(vista, runna, agil) {
        if (this.armaNet) this.armaNet();
        // Les tres armes fan la mateixa llargada i s'agafen pel mateix lloc (ARMA_LLARG i ARMES_ATAC, a js/atac_arma.js)
        const nom = runna ? 'espasa' : agil ? 'tiller' : 'basto';       // agil sense Runna = la branca del Til·ler
        const conf = ARMES_ATAC[nom];
        const arma = this.add.image(0, 0, conf.clau).setOrigin(0.5, conf.agafa).setVisible(false);
        const escalaBase = ARMA_LLARG / arma.height;
        const ajustos = (ATAC_AJUST[nom] && ATAC_AJUST[nom][vista]) || [];      // ajust fi d'aquesta arma, vista i fotograma
        const taula = ATAC_ARMA[vista] || [];
        const posa = frame => {
            const e = taula[frame.index - 1];                  // frame.index compta des d'1 dins l'animació
            if (!e) { arma.setVisible(false); return; }
            const aj = ajustos[frame.index - 1] || { dx: 0, dy: 0, a: 0, e: 1 };
            const davant = aj.d == null ? e.d : aj.d;
            const jo = this.ineu, s = jo.scaleX;
            arma.setVisible(true).setPosition(jo.x + (e.x + aj.dx - SPRITE_INEU.ample / 2) * s, jo.y + (e.y + aj.dy - SPRITE_INEU.peus) * s)
                .setAngle(e.a + aj.a).setScale(escalaBase * aj.e).setDepth(jo.depth + (davant ? 1 : -1));
        };
        const alActualitzar = (anim, frame) => posa(frame);
        this.ineu.on('animationstart', alActualitzar);
        this.ineu.on('animationupdate', alActualitzar);
        const net = () => {
            this.ineu.off('animationstart', alActualitzar);
            this.ineu.off('animationupdate', alActualitzar);
            if (arma.active) arma.destroy();
            if (this.armaNet === net) this.armaNet = null;
        };
        this.armaNet = net;
        this.time.delayedCall(ATAC_INEU.fotogrames.length / ATAC_INEU.fps * 1000 + 150, net);       // per si l'animació s'interromp
        return net;
    },

    // Comprova cada fotograma els enemics tocats per la línia del cop (segment des dels peus de l'Ineu)
    comprovarCop() {
        const k = this.cop;
        if (!k) return;
        if (this.time.now > k.fins) { this.cop = null; return; }
        const jo = this.ineu.body.center, d = k.d;
        let encertats = 0;
        this.enemics.forEach(e => {
            if (e.mort || k.tocats.has(e)) return;
            const c = e.spr.body.center;
            const rx = c.x - jo.x, ry = c.y - jo.y;
            const t = rx * d.x + ry * d.y;                          // distància al llarg del cop
            if (t < -12 || t > k.L + e.def.radi) return;
            const lat = Math.abs(rx * d.y - ry * d.x);              // distància lateral
            if (lat < e.def.radi + k.ample) { k.tocats.add(e); this.colpejar(e, k.dany, d); encertats++; }
        });
    },

    // L'arma a la mà: bastó (assets/basto.png), bastó de Til·ler o espasa de Runna, girant en arc durant el cop.
    // Apareix i desapareix de cop, sense fade.
    armaCop(d, runna, agil) {
        if (this.armaNet) this.armaNet();
        let g;
        if (runna) {                                               // espasa
            g = this.add.graphics();
            g.fillStyle(0x5a3a22, 1).fillRect(4, -4, 22, 8);                              // empunyadura
            g.fillStyle(0xe0b84a, 1).fillRect(24, -16, 8, 32).fillCircle(2, 0, 6);          // guarda i pom
            g.fillStyle(0xdfe8f0, 1).fillPoints([{ x: 32, y: -7 }, { x: 112, y: -5 }, { x: 128, y: 0 }, { x: 112, y: 5 }, { x: 32, y: 7 }], true);
            g.fillStyle(0xffffff, 0.8).fillRect(34, -2, 78, 3);                           // fil de llum
            g.lineStyle(2, 0x7a8896, 1).strokePoints([{ x: 32, y: -7 }, { x: 112, y: -5 }, { x: 128, y: 0 }, { x: 112, y: 5 }, { x: 32, y: 7 }], true);
        } else {
            // La imatge és vertical (cap amb ganxo a dalt, virolla a baix): s'agafa pel terç inferior i el cap apunta endavant
            const clau = agil ? 'arma_tiller' : 'arma_basto';       // agil sense Runna = la branca del Til·ler
            const t = this.textures.get(clau);
            g = this.add.image(0, 0, clau).setOrigin(0.5, 0.82).setScale(((t.customData && t.customData.escala) || 1) * (agil ? 1.1 : 1));
        }
        const jo = this.ineu;
        const ang = Math.atan2(d.y, d.x);
        const gir = runna ? 0 : Math.PI / 2;                       // el bastó dibuixat apunta cap amunt
        // El cop va de dalt a baix: arranca alçat darrere d'un costat i acaba a l'altre
        const des = ang - 1.25 + gir, fins = ang + 1.0 + gir;
        g.setRotation(des);
        if (runna) g.setScale(1.05);
        const seguir = () => g.setPosition(jo.x + d.x * 10, jo.y - 58 + d.y * 6).setDepth(d.y < -0.3 ? jo.y - 1 : jo.y + 40);
        seguir();
        this.events.on('update', seguir);
        const net = () => { this.events.off('update', seguir); if (g.active) g.destroy(); if (this.armaNet === net) this.armaNet = null; };
        this.armaNet = net;
        this.tweens.add({ targets: g, rotation: fins, duration: 150, ease: 'Cubic.out' });
        this.time.delayedCall(170, net);
    },

    // La mitja lluna del cop: surt del pit de l'Ineu, més enllà del cap, dels peus i dels costats
    tallBasto(jo, d, runna, agil) {
        const ang = Math.atan2(d.y, d.x);
        const arc = ARC_ATAC[runna ? 'espasa' : agil ? 'tiller' : 'basto'];       // color i radi, a js/atac_arma.js
        const color = parseInt(arc.color.slice(1), 16), R = arc.R;
        const g = this.add.graphics().setDepth(99990).setPosition(jo.x, jo.y - 62);
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

    colpejar(e, dany, d) {
        const ara = this.time.now;
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

        // Sense botí: l'energia només es recupera als llocs de repòs (la Prunera, l'altar...)
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
        this.comprovarCop();
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
