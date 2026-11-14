/**

 * LA BASSADÒRIA I LA CREU DE L'APARICIÓ
 */

// ---------------- CREU DE L'APARICIÓ I BASSADÒRIA ----------------
class ZonaCreu extends ZonaBase {
    constructor() {
        super('ZonaCreu', {
            nom: 'La Bassadòria',
            amplada: 1600,
            alcada: 1000,
            entrades: {
                placa:    { x: 1180, y: 70, dir: 'avall' }
            }
        });
    }

    construir() {
        this.terra('herba', 0, 0, 1600, 1000, -1100);
        this.terra('cami', 1100, 0, 160, 905);          // des de la plaça (nord): baixa pel costat de la creu i s'acaba a la seva alçada

        // Creu de l'Aparició (sense cap tanca ni mur al darrere)
        this.posar('creu', 1010, 900, { col: { w: 56, h: 24 }, opac: true });
        // La creu, a la gespa, amb flors al seu voltant (menys pel costat del camí)
        [[895, 885], [918, 940], [985, 955], [1052, 950], [945, 845], [1042, 838], [868, 925], [1080, 905]].forEach(([x, y]) => this.posar('flors', x, y, { fonsY: y - 10 }));
        this.interactiu(1010, 905, RADI_OBJECTE, DIALEGS.creu, { altura: 400 });
        [[760, 860], [1260, 860]].forEach(([x, y]) => this.posar('arbre', x, y, { col: { w: 34, h: 16 } }).setTint(0xcfe08a));   // plàtans

        // Bassadòria: una bassa molt gran (520 d'ample, uns quatre Ineus), sense mur al darrere; plàtans de tardor als costats
        [[330, 560]].forEach(([x, y]) => this.posar('arbre', x, y, { col: { w: 34, h: 16 } }).setTint(0xe0b868));
        // Dos dibuixos de la mateixa bassa: tèrbola i amb boira, i neta (després del Cant de l'Aurora)
        this.bassa = this.posar(Estat.flag('bassadoriaNeta') ? 'bassadoria' : 'bassadoria_boira', 700, 560, { fonsY: 300 });   // profunditat de la vora del fons: els gripaus de dins l'aigua es veuen
        this.colisio(700, 400, 600, 170);             // l'anella de pedra (una el·lipse feta de tres franges)
        this.colisio(700, 290, 430, 60);
        this.colisio(705, 515, 390, 80);              // portella, jardinera i abeurador
        this.interactiu(700, 480, 260, DIALEGS.bassadoria, { altura: 110, enTancar: () => Estat.posaFlag('flauta_bassadoria') });    // la tarota s'obre sola en acabar el text (zona_base: tarotaDespresDeText)
        this.llocFlauta('bassadoria', 700, 470, 340, true, () => !Estat.flag('bassadoriaNeta'), false, ['aurora']);
        if (!Estat.flag('bassadoriaNeta')) this.boiraBass = this.boira(700, 360, 480, 120, 3.5);

        this.cartell(1065, 440, () => ({ pagines: [{ qui: 'Cartell', text: '↑ Plaça del Santuari' }] }));      // a la vora esquerra del camí, no al mig
        this.arbres([[150, 180], [320, 260], [1450, 220], [1500, 780], [100, 520], [190, 640], [1400, 440], [1480, 600], [260, 440]]);

        this.enemic('escolopendra', 1350, 300);
        // Els gripaus corromputs s'escapen de la Bassadòria: n'hi ha per tota l'escena i, a mesura que en caiguin,
        // en surten de nous de la bassa. Quan la boira se'n va (aigua neta) ja no en surten més.
        this.propGripau = this.time.now + 2500;
        this.netejant = false; this.aiguaViva = false;
        if (!Estat.flag('bassadoriaNeta')) {
            [[560, 600], [1330, 620], [800, 860], [1180, 300]].forEach(([x, y]) => this.enemic('gripau', x, y));
        }
        this.sortida(1100, 0, 160, 14, 'ZonaPlaca', 'creu');
    }

    teEfecteMelodia(nom) {
        return nom === 'aurora' && !Estat.flag('bassadoriaNeta') && Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, 700, 470) < 520;
    }

    // Efecte clàssic de deformació d'ones sinusoïdals per línies d'escaneig (raster / sine-wave de SNES)
    // durant la transformació de la Bassadòria tèrbola a neta
    transicioBassadoriaSNES(enAcabar) {
        const texBoira = this.textures.get('bassadoria_boira');
        const texNeta = this.textures.get('bassadoria');
        const imgBoira = texBoira ? texBoira.getSourceImage() : null;
        const imgNeta = texNeta ? texNeta.getSourceImage() : null;

        if (!imgBoira || !imgNeta) {
            // Reserva per si no s'han pogut llegir les imatges d'origen
            const neta = this.posar('bassadoria', 700, 560).setDepth(this.bassa.depth + 0.5).setAlpha(0);
            this.tweens.add({ targets: neta, alpha: 1, duration: 2200, onComplete: () => {
                this.bassa.destroy(); this.bassa = neta;
                if (enAcabar) enAcabar();
            } });
            return;
        }

        const W_DISP = 620;
        const H_DISP = (this.bassa && this.bassa.displayHeight) ? Math.round(this.bassa.displayHeight) : 384;
        const MARGIN = 48;
        const CANVAS_W = W_DISP + MARGIN * 2;
        const CANVAS_H = H_DISP;

        const canvas = document.createElement('canvas');
        canvas.width = CANVAS_W;
        canvas.height = CANVAS_H;
        const ctx = canvas.getContext('2d');

        const texKey = 'transicio_bassa_' + Date.now();
        this.textures.addCanvas(texKey, canvas);

        const sprTrans = this.add.image(700, 560, texKey)
            .setOrigin(0.5, 1)
            .setDepth(this.bassa.depth + 0.1);
        this.bassa.setVisible(false);

        // Màscara ovalada que s'ajusta exactament a la silueta de la Bassadòria:
        // impedeix que cap píxel ni vora quadrada pugui sortir fora de l'oval
        const mascG = this.make.graphics({ x: 0, y: 0, add: false });
        mascG.fillStyle(0xffffff, 1).fillEllipse(700, 560 - H_DISP * 0.46, W_DISP * 0.96, H_DISP * 0.88);
        sprTrans.setMask(mascG.createGeometryMask());

        // Espurnes de llum mística sobre la làmina d'aigua ovalada de la bassa
        const espurnes = this.add.particles(700, 420, 'espurna', {
            emitZone: { type: 'random', source: new Phaser.Geom.Ellipse(0, 0, 360, 120) },
            speed: { min: 20, max: 80 },
            scale: { start: 0.32, end: 0.05 },
            alpha: { start: 0.9, end: 0 },
            tint: [0xffea88, 0x7ae8ff, 0xffffff],
            lifespan: 1100,
            frequency: 45,
            blendMode: 'ADD'
        }).setDepth(this.bassa.depth + 0.5);

        this.time.delayedCall(2500, () => {
            espurnes.stop();
            this.time.delayedCall(1200, () => espurnes.destroy());
        });

        const swBoira = imgBoira.width, shBoira = imgBoira.height;
        const swNeta = imgNeta.width, shNeta = imgNeta.height;
        const pas = 2; // línies de 2px: màxima resolució i sensació d'efecte de línies d'escaneig SNES pur

        const anim = { prog: 0, fase: 0 };
        this.tweens.add({
            targets: anim,
            prog: 1,
            fase: Math.PI * 7,
            duration: 2600,
            ease: 'Linear',
            onUpdate: () => {
                ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
                ctx.save();
                // Retalla estrictament a l'oval de la bassadòria: elimina qualsevol caixa o vora quadrada
                ctx.beginPath();
                ctx.ellipse(CANVAS_W / 2, CANVAS_H * 0.54, W_DISP * 0.48, H_DISP * 0.44, 0, 0, Math.PI * 2);
                ctx.clip();

                const k = anim.prog;
                // Amplitud d'ona sinusoïdal: arrenca a 0, arriba a ~26px al punt central i decau a 0
                const amp = Math.sin(k * Math.PI) * 26;
                const freq = 0.052;
                const fase = anim.fase;

                // Fosa creuada de la corrupció cap a l'aigua neta
                const aBoira = Math.max(0, Math.min(1, (0.6 - k) / 0.35));
                const aNeta = Math.max(0, Math.min(1, (k - 0.35) / 0.35));

                for (let y = 0; y < H_DISP; y += pas) {
                    // La base de la bassa toca a terra i queda fixa; el cos i l'aigua de la bassa s'ondulen
                    const factorFix = Math.min(1, Math.max(0, (H_DISP - 8 - y) / 45));
                    const dx = MARGIN + (Math.sin(y * freq + fase) * amp
                                      + Math.cos(y * freq * 0.45 - fase * 0.8) * (amp * 0.35)) * factorFix;
                    const syB = (y / H_DISP) * shBoira;
                    const syN = (y / H_DISP) * shNeta;
                    const sHB = (pas / H_DISP) * shBoira;
                    const sHN = (pas / H_DISP) * shNeta;

                    if (aBoira > 0) {
                        ctx.globalAlpha = aBoira;
                        ctx.drawImage(imgBoira, 0, syB, swBoira, sHB, dx, y, W_DISP, pas);
                    }
                    if (aNeta > 0) {
                        ctx.globalAlpha = aNeta;
                        ctx.drawImage(imgNeta, 0, syN, swNeta, sHN, dx, y, W_DISP, pas);
                    }
                }
                ctx.restore();
                ctx.globalAlpha = 1.0;
                this.textures.get(texKey).refresh();
            },
            onComplete: () => {
                sprTrans.destroy();
                this.textures.remove(texKey);
                this.bassa.destroy();
                this.bassa = this.posar('bassadoria', 700, 560, { fonsY: 300 });
                if (enAcabar) enAcabar();
            }
        });
    }

    // La Bassadòria reacciona al Cant de l'Aurora (només quan l'Ineu és a prop)
    enMelodia(nom) {
        if (nom !== 'aurora') return false;
        const prop = Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, 700, 470) < 520;
        if (!prop) return false;
        if (Estat.flag('bassadoriaNeta')) { this.ineuDiu("L'aigua ja és clara."); return true; }

        this.netejant = true;                         // des d'ara i fins que l'aigua és neta, no en surten gripaus nous
        if (this.boiraBass) this.boiraBass.stop();
        this.enemics.filter(e => e.tipus === 'gripau' && !e.mort).forEach(e => {
            e.mort = true; e.spr.body.enable = false;
            this.boiraPuf(e.spr.x, e.spr.y);
            this.tweens.add({ targets: [e.spr, e.ombra], alpha: 0, duration: 600, onComplete: () => this.retirar(e) });
        });

        // Efecte de transició amb deformació d'ones estil SNES JRPG
        this.transicioBassadoriaSNES(() => {
            this.netejant = false;          // (ja és neta: ara es pot posar l'efecte d'aigua tranquil·la)
            this.ui().obrirDialeg(DIALEGS.bassadoriaNeta(Estat), () => Estat.desar());
        });
        return true;
    }

    actualitzar(ara) {
        if (Estat.flag('bassadoriaNeta') && !this.netejant && !this.aiguaViva) { this.aiguaViva = true; this.aiguaTranquila(728, 363, 235, 52, 302, { color: 0xffffff, intensitat: 2.4 }); }          // aigua neta: reflexos i ones tranquils
        if (Estat.flag('bassadoriaNeta') || this.netejant || ara < this.propGripau) return;
        const vius = this.enemics.filter(e => e.tipus === 'gripau' && !e.mort).length;
        if (vius >= 5) return;
        this.propGripau = ara + 3800;
        // Surt de la bassa d'un salt i s'escampa per l'escena
        const sx = 820 + Math.random() * 380, sy = 720;
        let dx, dy, intents = 0;
        do { dx = 150 + Math.random() * 1300; dy = 280 + Math.random() * 600; intents++; }
        while (intents < 12 && (dx > 680 && dx < 1340 && dy > 560 && dy < 920));       // no tornar a caure a la bassa
        this.enemic('gripau', sx, sy, { sortida: true, salt: { x: dx, y: dy } });
    }
}
