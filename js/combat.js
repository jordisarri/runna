/**
 * COMBAT (fase 2)
 * S'afegeix a ZonaBase (carregar després de zona_base.js). Cada zona crida this.enemic(tipus, x, y).
 *   Atac: J, ESPAI o ENTER/E (si no hi ha res per parlar)
 * Vida del jugador en meitats de cor (Estat.dades.vida). Bastó = 1 de dany; Runna = 2.
 * Cap enemic "mor": es desfà en boira lila (els visitants cauen adormits).
 */
const DIRS = { avall: { x: 0, y: 1 }, amunt: { x: 0, y: -1 }, esquerra: { x: -1, y: 0 }, dreta: { x: 1, y: 0 } };

// L'ocell de foc de l'Ocellaire: un ocell fet de flames, de perfil, que mou les ales (4 fotogrames: amunt, mig, avall, mig)
// i deixa una cua de flames. Es dibuixa amb codi (el joc no necessita cap PNG) i s'anima amb 'ocell_foc_vola'.
function preparaOcellFoc(scene) {
    const FW = 160, FH = 120;
    if (!scene.textures.exists('ocell_foc')) {
        const tex = scene.textures.createCanvas('ocell_foc', FW * 4, FH);
        const ctx = tex.getContext();
        const TINTA = '#4a1204';
        const ala = (ox, ang, mida, alfa) => {                 // una ala de plomes de foc, que surt de l'espatlla
            ctx.save();
            ctx.translate(ox + 80, 58); ctx.rotate(ang); ctx.globalAlpha = alfa;
            const L = 64 * mida, g = ctx.createLinearGradient(0, 0, 0, -L);
            g.addColorStop(0, '#fff2a0'); g.addColorStop(0.45, '#ffa030'); g.addColorStop(1, '#e83a10');
            ctx.fillStyle = g; ctx.strokeStyle = TINTA; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
            ctx.beginPath(); ctx.moveTo(-9, 2);
            ctx.quadraticCurveTo(-26 * mida, -L * 0.5, -12 * mida, -L);
            [[-6, -L + 10], [-1, -L - 4], [4, -L + 12], [10, -L - 2], [14, -L + 14], [20, -L + 4], [22, -L * 0.62]].forEach(([x, y]) => ctx.lineTo(x * mida, y));
            ctx.quadraticCurveTo(22 * mida, -L * 0.3, 11, 2);
            ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.globalAlpha = alfa * 0.8; ctx.strokeStyle = '#fff6c0'; ctx.lineWidth = 2;      // les nervadures de llum
            [-6, 3, 12].forEach(x => { ctx.beginPath(); ctx.moveTo(x * 0.3, -6); ctx.quadraticCurveTo(x, -L * 0.5, x * 1.1, -L * 0.82); ctx.stroke(); });
            ctx.restore();
        };
        const llengua = (x, y, long, ample, ang, fons, punta) => {      // una llengua de foc que apunta cap a 'ang'
            ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
            const g = ctx.createLinearGradient(0, 0, long, 0);
            g.addColorStop(0, fons); g.addColorStop(1, punta);
            ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -ample);
            ctx.quadraticCurveTo(long * 0.55, -ample * 1.1, long, 0); ctx.quadraticCurveTo(long * 0.55, ample * 1.1, 0, ample);
            ctx.closePath(); ctx.fill(); ctx.restore();
        };
        // [angle de l'ala, fase de les flames]
        [[-0.3, 0], [-1.25, 1.2], [-2.3, 2.4], [-1.25, 3.6]].forEach(([ang, fase], i) => {
            const ox = i * FW;
            // resplendor
            const halo = ctx.createRadialGradient(ox + 84, 64, 4, ox + 84, 64, 62);
            halo.addColorStop(0, 'rgba(255,190,70,0.6)'); halo.addColorStop(1, 'rgba(255,90,20,0)');
            ctx.fillStyle = halo; ctx.fillRect(ox, 0, FW, FH);
            // cua de flames, darrere
            [[0, 28, 11], [-0.35, 24, 9], [0.35, 24, 9], [-0.7, 17, 7], [0.7, 17, 7]].forEach(([a, l, w], k) => {
                const ond = Math.sin(fase + k * 1.3) * 0.22;
                llengua(ox + 62, 66, l * 1.9, w * 1.15, Math.PI + a + ond, '#ff8a20', 'rgba(232,50,16,0)');
            });
            ala(ox, ang * 0.8 + 0.5, 0.78, 0.55);                 // l'ala llunyana, més fosca i petita
            // cos
            const cos = ctx.createRadialGradient(ox + 80, 62, 2, ox + 80, 66, 30);
            cos.addColorStop(0, '#fff0a0'); cos.addColorStop(0.5, '#ffa030'); cos.addColorStop(1, '#e8400e');
            ctx.fillStyle = cos; ctx.strokeStyle = TINTA; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.ellipse(ox + 80, 65, 27, 17, -0.12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            // cap, cresta de flames i bec
            [[-1.9, 12], [-1.4, 15], [-0.95, 11]].forEach(([a, l], k) => llengua(ox + 107, 51, l, 4.5, a + Math.sin(fase + k) * 0.15, '#ff9a28', 'rgba(255,230,120,0)'));
            ctx.fillStyle = cos; ctx.beginPath(); ctx.arc(ox + 108, 55, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#ffd860'; ctx.beginPath(); ctx.moveTo(ox + 118, 51); ctx.lineTo(ox + 138, 58); ctx.lineTo(ox + 118, 64); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#fffbe0'; ctx.beginPath(); ctx.arc(ox + 112, 52, 4.2, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#7a1604'; ctx.beginPath(); ctx.arc(ox + 113.5, 52, 2.1, 0, Math.PI * 2); ctx.fill();
            ala(ox, ang, 1, 1);                                    // l'ala propera, a davant
        });
        tex.refresh();
        for (let i = 0; i < 4; i++) tex.add(i, 0, i * FW, 0, FW, FH);
        tex.customData.escala = 1 / RES;
    }
    if (!scene.anims.exists('ocell_foc_vola')) {
        scene.anims.create({ key: 'ocell_foc_vola', frames: [0, 1, 2, 1].map(f => ({ key: 'ocell_foc', frame: f })), frameRate: 16, repeat: -1 });
    }
}

const ENEMICS = {
    escolopendra: {
        tex: 'escolopendra', vida: 2, vel: 95, mal: 1, radi: 20, cos: [40, 16], ombra: 0, centrat: true,   // l'ombra ja és al dibuix; vista de dalt, el cos és al mig
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
            // Mira cap on camina (gira suau) i les potes es mouen només quan avança
            e.spr.rotation = Phaser.Math.Angle.RotateTo(e.spr.rotation, e.ang, 0.18);
            if (z.anims.exists('cempeus')) {
                if (!quiet && !e.spr.anims.isPlaying) e.spr.play('cempeus', true);
                else if (quiet && e.spr.anims.isPlaying) e.spr.anims.pause();
                else if (!quiet && e.spr.anims.isPaused) e.spr.anims.resume();
            }
        }
    },

    gripau: {
        tex: 'gripau', vida: 2, vel: 250, mal: 1, radi: 22, cos: [36, 22], ombra: 0.38,
        monedes: [0.6, 1, 2], cor: 0.12,
        // Només fa mal mentre salta; en aterrar queda quiet i vulnerable
        perill: e => e.estat === 'salt',
        ia(z, e, ara) {
            const jo = z.ineu.body.center, c = e.spr.body.center;
            const dist = Phaser.Math.Distance.Between(c.x, c.y, jo.x, jo.y);
            if (e.estat === 'salt') {
                if (ara > e.fins) { e.estat = 'repos'; e.fins = ara + 1150; e.spr.body.setVelocity(0); e.spr.setScale(e.escalaBase); }
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

    // BOSS FINAL: l'Ocellaire. Sura per la plataforma i fa girar el bàcul: quan gira de pressa, en surten ocells de foc
    // que li volten al voltant i després es llancen contra l'Ineu (Runna els talla). A la segona meitat llança el bàcul
    // com un remolí i desapareix en boira per tornar a sortir en un altre lloc.
    ocellaire: {
        tex: 'ocellaire', vida: 36, vel: 70, mal: 1, radi: 38, cos: [58, 26], ombra: 0.8, soloCap: true,
        monedes: [0, 0, 0], cor: 0, robust: true, barra: true,
        perill: e => !e.amagat && e.estat !== 'apareix',
        ia(z, e, ara) {
            const jo = z.ineu.body.center, c = e.spr.body.center;
            const fase3 = e.vida <= this.vida / 3, fase2 = e.vida <= this.vida * 2 / 3;      // tres fases de dos terços de vida cadascuna: 36 → 24 → 12
            if (!e.proxAtac) { e.proxAtac = ara + 1800; e.estat = 'sura'; e.nAtac = 0; }
            // Cada canvi de fase: rugit, ona que l'empeny, els ocells s'apaguen i tot va més de pressa (la 3a crema el terra)
            if ((fase3 && !e.fase3) || (fase2 && !e.fase2)) {
                const f = fase3 ? 3 : 2;
                e.fase2 = true; if (fase3) e.fase3 = true;
                z.enemics.filter(o => o.tipus === 'ocellFoc' && !o.mort).forEach(o => z.apagarOcell(o));
                z.netejarRonda(e);
                e.estat = 'rugit'; e.fins = ara + 1500; e.basto.volant = false; e.nAtac = 0;
                z.tweens.killTweensOf(e.basto);
                z.furiaOcellaire(e, f);
            }
            const b = e.basto;
            if (e.estat === 'rugit') {
                e.spr.body.setVelocity(0);
                b.gir = 0.5;
                e.spr.angle = Math.sin(ara / 25) * 3;
                if (ara > e.fins) {
                    e.spr.angle = 0;
                    if (fase3) { e.estat = 'foc'; e.fins = ara + 950; e.focFet = false; }          // la fase 3 s'obre cremant el terra
                    else { e.estat = 'invoca'; e.fins = ara + 1500; e.nOcells = 0; e.proxOcell = ara + 150; }
                }
            } else if (e.estat === 'sura') {
                // Es manté a uns 240 px de l'Ineu, voltant-lo a poc a poc
                if (!e.puntSura || ara > e.canviFins) {
                    const a = Math.atan2(c.y - jo.y, c.x - jo.x) + (Math.random() < 0.5 ? -0.8 : 0.8);
                    e.puntSura = z.puntPlataforma(jo.x + Math.cos(a) * 240, jo.y + Math.sin(a) * 200);
                    e.canviFins = ara + 1400;
                }
                const dx = e.puntSura.x - c.x, dy = e.puntSura.y - c.y, l = Math.hypot(dx, dy);
                const v = l > 12 ? this.vel * (fase3 ? 1.9 : fase2 ? 1.5 : 1) : 0;
                e.spr.body.setVelocity(dx / (l || 1) * v, dy / (l || 1) * v);
                b.gir = 0.04;
                if (ara > e.proxAtac) {
                    e.spr.body.setVelocity(0);
                    // Repertori de cada fase: la 1a alterna ocells i un cop de bàcul en cercle; la 2a hi afegeix el bàcul llançat i
                    // l'esvaïment; la 3a, a més, crema el terra
                    const n = e.nAtac++;
                    const tria = (fase3 ? ['foc', 'invoca', 'llança', 'cercle'] : fase2 ? ['invoca', 'llança', 'cercle', 'esvaeix'] : ['invoca', 'cercle', 'invoca'])[n % (fase3 || fase2 ? 4 : 3)];
                    if (tria === 'llança') { e.estat = 'llança'; e.fins = ara + 400; e.spr.setTint(0xffb070); Sfx.carrega(); }
                    else if (tria === 'esvaeix') { e.estat = 'esvaeix'; e.fins = ara + 500; Sfx.puf(); z.boiraPuf(c.x, c.y - 40); z.tweens.add({ targets: [e.spr, b.g], alpha: 0, duration: 400 }); }
                    else if (tria === 'cercle') { e.estat = 'cercle'; e.fins = ara + 850; e.radiCercle = fase3 ? 230 : 190; e.avisCercle = null; Sfx.carrega(); }
                    else if (tria === 'foc') { e.estat = 'foc'; e.fins = ara + 950; e.focFet = false; }
                    else { e.estat = 'invoca'; e.fins = ara + (fase3 ? 1300 : fase2 ? 1500 : 1900); e.nOcells = 0; e.proxOcell = ara + 200; }
                }
            } else if (e.estat === 'invoca') {
                // Fa girar el bàcul cada cop més de pressa i n'escup ocells de foc, que li volten al voltant
                e.spr.body.setVelocity(0);
                b.gir = Math.min(0.55, b.gir + 0.03);
                Sfx.basto();
                const max = fase2 ? 6 : 4;
                if (e.nOcells < max && ara > e.proxOcell) {
                    e.proxOcell = ara + 260;
                    const o = z.enemic('ocellFoc', b.x, b.y);
                    if (o) { o.amo = e; o.angOrb = e.nOcells / max * Math.PI * 2; o.estat = 'orbita'; o.llançar = Infinity; o.rapid = e.nOcells % 3 === 2; z.flamaOcell(o); }
                    e.nOcells++;
                }
                if (Phaser.Math.Distance.Between(b.x, b.y, jo.x, jo.y - 40) < 95) z.ferIneu(1, { x: b.x, y: b.y });   // el bàcul que gira fa mal
                if (ara > e.fins) {
                    // Els ocells es llancen un rere l'altre
                    z.enemics.filter(o => o.amo === e && o.estat === 'orbita').forEach((o, i) => { o.llançar = fase3 ? ara + 250 + Math.floor(i / 2) * 450 : ara + 250 + i * (fase2 ? 220 : 380); });   // a la fase 3 surten de dos en dos
                    Sfx.xiscle();
                    e.estat = 'cansat'; e.fins = ara + (fase3 ? 1500 : fase2 ? 1900 : 2600);
                }
            } else if (e.estat === 'cercle') {
                // Cop de bàcul en cercle: avisa amb un anell a terra i, en acabar, una ona que fa mal i t'allunya
                e.spr.body.setVelocity(0);
                b.gir = Math.min(0.6, b.gir + 0.05);
                if (!e.avisCercle) e.avisCercle = z.avisAnell(c.x, c.y, e.radiCercle, e.fins - ara);
                if (ara > e.fins) {
                    z.colpAnell(e, e.radiCercle);
                    e.estat = 'cansat'; e.fins = ara + (fase3 ? 1500 : 1900); e.avisCercle = null;
                }
            } else if (e.estat === 'foc') {
                // Fase 3: alça el bàcul i el terra crema al voltant de l'Ineu (cal moure's de seguida)
                e.spr.body.setVelocity(0);
                b.gir = 0.6;
                if (!e.focFet) { e.focFet = true; z.focsTerra(e); Sfx.carrega(); }
                if (ara > e.fins) { e.estat = 'cansat'; e.fins = ara + 1600; e.focFet = false; }
            } else if (e.estat === 'llança') {
                // Llança el bàcul com un remolí cap a on és l'Ineu i li torna a la mà
                e.spr.body.setVelocity(0);
                b.gir = 0.6;
                if (ara > e.fins && !b.volant) {
                    e.spr.clearTint();
                    b.volant = true;
                    const desti = { x: jo.x, y: jo.y - 40 };
                    z.tweens.add({ targets: b, x: desti.x, y: desti.y, duration: 650, ease: 'Sine.easeOut', yoyo: true,
                        onUpdate: () => { if (Phaser.Math.Distance.Between(b.x, b.y, z.ineu.body.center.x, z.ineu.body.center.y - 30) < 70) z.ferIneu(1, { x: b.x, y: b.y }); },
                        onComplete: () => { b.volant = false; if (!e.mort) { e.estat = 'cansat'; e.fins = z.time.now + (fase3 ? 1500 : 1800); } } });
                }
                if (b.volant) Sfx.basto();
            } else if (e.estat === 'esvaeix') {
                e.spr.body.setVelocity(0);
                e.amagat = true;
                if (ara > e.fins) {
                    // Torna a sortir a l'altra banda de la plataforma
                    const p = z.puntPlataforma(jo.x + (jo.x < z.centreGabia().x ? 1 : -1) * 300, jo.y - 120);
                    e.spr.body.reset(p.x, p.y);
                    z.boiraPuf(p.x, p.y - 40);
                    z.tweens.add({ targets: [e.spr, b.g], alpha: 1, duration: 400 });
                    e.estat = 'apareix'; e.fins = ara + 500;
                }
            } else if (e.estat === 'apareix') {
                e.spr.body.setVelocity(0);
                if (ara > e.fins) { e.amagat = false; e.estat = 'invoca'; e.fins = ara + 1400; e.nOcells = 0; e.proxOcell = ara + 150; }
            } else {   // cansat: el bàcul s'alenteix, abaixa el cap i és el moment de colpejar-lo
                e.spr.body.setVelocity(0);
                e.baixaObj = 1;
                b.gir = Math.max(0.02, b.gir * 0.94);
                if (ara > e.fins) { e.estat = 'sura'; e.proxAtac = ara + (fase3 ? 900 : fase2 ? 1400 : 2400); e.puntSura = null; }
            }
            // S'ajup (o es redreça) suaument: el cap, que és el seu únic punt feble, baixa fins a l'abast de l'espasa
            if (e.estat !== 'cansat') e.baixaObj = 0;
            e.baixa = (e.baixa || 0) + ((e.baixaObj || 0) - (e.baixa || 0)) * 0.2;
            e.spr.setScale(e.escalaBase, e.escalaBase * (1 - 0.38 * e.baixa));
            e.spr.setFlipX(jo.x < c.x);
            z.moureBasto(e);
        },
        alDerrotar(z, e) { z.ocellaireDerrotat(e); }
    },

    // Ocell de foc de l'Ocellaire: volta al voltant del seu amo i, quan li toca, es llança contra l'Ineu
    ocellFoc: {
        tex: 'ocell_foc', vida: 1, vel: 300, mal: 1, radi: 18, cos: [26, 20], ombra: 0.15, centrat: true,
        monedes: [0, 0, 0], cor: 0,
        preparar: z => preparaOcellFoc(z),
        perill: e => e.estat === 'vola' || e.estat === 'orbita',
        ia(z, e, ara) {
            const jo = z.ineu.body.center, c = e.spr.body.center;
            const amo = e.amo;
            if (e.estat === 'orbita') {
                if (!amo || amo.mort || ara > e.llançar) {
                    e.estat = 'vola'; e.morFins = ara + (e.rapid ? 1800 : 2600); e.guiaFins = ara + (e.rapid ? 420 : 650);
                    e.ang = Math.atan2(jo.y - c.y, jo.x - c.x);
                    return;
                }
                const t = e.angOrb + ara / 260, ac = amo.spr.body.center;
                e.spr.body.setVelocity(0);
                e.spr.body.reset(ac.x + Math.cos(t) * 110, ac.y - 30 + Math.sin(t) * 70);
                e.spr.setFlipX(Math.sin(t) > 0);
            } else if (e.estat === 'vola') {
                if (ara < e.guiaFins) {     // corregeix una mica el rumb al principi
                    const a = Math.atan2(jo.y - c.y, jo.x - c.x);
                    e.ang += Phaser.Math.Clamp(Phaser.Math.Angle.Wrap(a - e.ang), -0.06, 0.06);
                }
                const vv = e.rapid ? 470 : this.vel;                 // l'ocell ràpid és blanc d'escalfor i corre més, però corregeix poc el rumb
                e.spr.body.setVelocity(Math.cos(e.ang) * vv, Math.sin(e.ang) * vv);
                e.spr.setFlipX(Math.cos(e.ang) < 0);
                const bl = e.spr.body.blocked;
                if (ara > e.morFins || bl.left || bl.right || bl.up || bl.down) z.apagarOcell(e);
            }
        }
    },

    // Ratpenat de boira (Gírgoles): penja quiet a la foscor; quan l'Ineu s'acosta, baixa fent ziga-zaga, i després s'enlaira
    ratpenat: {
        tex: 'ratpenat', vida: 2, vel: 190, mal: 1, radi: 20, cos: [34, 20], ombra: 0.2, centrat: true,
        monedes: [0, 0, 0], cor: 0,
        perill: e => e.estat === 'ataca',
        ia(z, e, ara) {
            const jo = z.ineu.body.center, c = e.spr.body.center;
            const dist = Phaser.Math.Distance.Between(c.x, c.y, jo.x, jo.y);
            if (!e.casa) e.casa = { x: c.x, y: c.y };
            e.spr.setScale(e.escalaBase, e.escalaBase * (0.75 + 0.25 * Math.abs(Math.sin(ara / 70))));     // aleteig
            if (e.estat === 'ataca') {
                const a = Math.atan2(jo.y - c.y, jo.x - c.x), zz = Math.sin(ara / 110) * 0.9;
                e.spr.body.setVelocity(Math.cos(a + zz) * this.vel, Math.sin(a + zz) * this.vel);
                if (ara > e.fins || dist < 26) { e.estat = 'fuig'; e.fins = ara + 900; e.ang = a + Math.PI + (Math.random() - 0.5); }
            } else if (e.estat === 'fuig') {
                e.spr.body.setVelocity(Math.cos(e.ang) * 150, Math.sin(e.ang) * 150);
                if (ara > e.fins) { e.estat = 'volta'; e.fins = ara + 700 + Math.random() * 900; }
            } else if (e.estat === 'volta') {
                const t = ara / 400;
                e.spr.body.setVelocity(Math.cos(t) * 70, Math.sin(t * 1.3) * 50);
                if (ara > e.fins && dist < 330) { e.estat = 'ataca'; e.fins = ara + 1400; Sfx.ratpenat(); }
            } else {   // penja
                e.spr.body.setVelocity(0);
                if (dist < 280) { e.estat = 'ataca'; e.fins = ara + 1400; Sfx.ratpenat(); }
            }
            e.spr.setFlipX(e.spr.body.velocity.x < 0);
        }
    },

    // Ferralla viva (passadís de tortura): eines rovellades que s'ajunten i avancen a salts, fent soroll de ferro
    ferralla: {
        tex: 'ferralla', vida: 4, vel: 230, mal: 1, radi: 26, cos: [44, 22], ombra: 0.4,
        monedes: [0, 0, 0], cor: 0,
        perill: e => e.estat === 'salta',
        ia(z, e, ara) {
            const jo = z.ineu.body.center, c = e.spr.body.center;
            const dist = Phaser.Math.Distance.Between(c.x, c.y, jo.x, jo.y);
            if (e.estat === 'salta') {
                if (ara > e.fins) {
                    e.estat = 'repos'; e.fins = ara + 650 + Math.random() * 400; e.spr.body.setVelocity(0);
                    Sfx.ferralla();
                }
            } else if (e.estat === 'apunta') {
                e.spr.body.setVelocity(0);
                e.spr.angle = Math.sin(ara / 30) * 6;      // tremola abans de saltar
                if (ara > e.fins) {
                    e.spr.angle = 0;
                    e.estat = 'salta'; e.fins = ara + 330;
                    const a = Math.atan2(jo.y - c.y, jo.x - c.x);
                    e.spr.body.setVelocity(Math.cos(a) * this.vel, Math.sin(a) * this.vel);
                    z.tweens.add({ targets: e.spr, y: e.spr.y - 1, scaleY: e.escalaBase * 1.15, yoyo: true, duration: 160 });
                }
            } else {
                e.spr.body.setVelocity(0);
                if (ara > e.fins && dist < 420) { e.estat = 'apunta'; e.fins = ara + 380; }
            }
            if (Math.abs(jo.x - c.x) > 5) e.spr.setFlipX(jo.x < c.x);
        }
    },

    // Capoll de boira on dorm un nen: Runna el trenca
    capoll: {
        tex: 'capoll', vida: 1, vel: 0, mal: 0, radi: 30, cos: [50, 40], ombra: 0.35,
        monedes: [0, 0, 0], cor: 0,
        perill: () => false,
        ia(z, e, ara) {
            e.spr.body.setVelocity(0);
            e.spr.y = e.yBase + Math.sin(ara / 400 + e.fase) * 6;
        },
        alDerrotar(z, e) { z.capollTrencat(e); }
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
        if (def.preparar) def.preparar(this);
        // Fins que l'Ineu no ha acabat el tutorial del bastó, la boira no ha despertat les bestioles
        if (!Estat.flag('combatActiu')) return null;
        const tex = this.textures.get(def.tex);
        const esc = ((tex.customData && tex.customData.escala) || 1 / RES);
        const spr = this.physics.add.sprite(x, y, def.tex, tex.has(0) ? 0 : undefined).setScale(esc);   // (els fulls d'animació, al fotograma 0)
        const fw = spr.width, fh = spr.height;
        spr.body.setSize(def.cos[0] / esc, def.cos[1] / esc);
        spr.body.setOffset((fw - def.cos[0] / esc) / 2, def.centrat ? (fh - def.cos[1] / esc) / 2 : fh - def.cos[1] / esc);
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
            const c = this.puntsCop(e).reduce((m, q) => Phaser.Math.Distance.Between(q.x, q.y, jo.x, jo.y) < Phaser.Math.Distance.Between(m.x, m.y, jo.x, jo.y) ? q : m),
                  dist = Phaser.Math.Distance.Between(c.x, c.y, jo.x, jo.y);
            if (dist > L + c.r + 30 || dist >= millorDist) return;
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
            if (e.mort || e.amagat || k.tocats.has(e)) return;
            const tocats = this.puntsCop(e).filter(c => {
                const rx = c.x - jo.x, ry = c.y - jo.y;
                const t = rx * d.x + ry * d.y;                      // distància al llarg del cop
                if (t < -12 || t > k.L + c.r) return false;
                const lat = Math.abs(rx * d.y - ry * d.x);          // distància lateral
                return lat < c.r + k.ample;
            });
            if (!tocats.length) return;
            k.tocats.add(e);
            if (e.def.soloCap && !tocats.some(c => c.cap)) { this.copRebutjat(e, d); return; }
            this.colpejar(e, k.dany, d); encertats++;
        });
    },

    // L'arma a la mà: bastó (assets/armes/basto.png), bastó de Til·ler o espasa de Runna, girant en arc durant el cop.
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

    // On cal colpejar un enemic: el cos físic (que bloqueja i fa mal) és als peus, però un enemic alt (el boss final) es colpeja
    // per tot el cos, dels peus al cap: la zona de cop és una cadena de cercles que puja 'copDy' píxels, amb el radi 'copRadi'.
    // Amb 'soloCap' (el boss final) només fa mal el cap: la resta del cos rebutja el cop. Les zones segueixen el sprite
    // dibuixat (s'abaixa quan s'ajup), de manera que el cap només s'abasta amb l'espasa quan l'Ocellaire abaixa el cap.
    puntsCop(e) {
        const c = e.spr.body.center;
        if (!e.def.soloCap) return [{ x: c.x, y: c.y, r: e.def.radi }];
        const s = e.spr, h = s.displayHeight, dalt = s.y - h / 2;
        return [{ x: s.x, y: dalt + h * 0.12, r: 34, cap: true },
                { x: s.x, y: dalt + h * 0.42, r: 44 }, { x: s.x, y: dalt + h * 0.66, r: 44 }, { x: s.x, y: c.y, r: 44 }];
    },
    zonaCop(e) {                    // on surten les espurnes del cop
        const c = e.spr.body.center;
        if (!e.def.soloCap) return { x: c.x, y: c.y, r: e.def.radi };
        const q = this.puntsCop(e)[e.baixa > 0.5 ? 0 : 1];
        return { x: q.x, y: q.y, r: q.r };
    },
    // El cop ha caigut al cos, no al cap: no fa mal
    copRebutjat(e, d) {
        const q = this.puntsCop(e)[2], ara = this.time.now;
        Sfx.escut();
        this.cameras.main.shake(70, 0.0015, true);
        this.impacte(q.x, q.y, { x: -d.x, y: -d.y }, 0);
        if (!(ara < (e.ultimAvis || 0))) { e.ultimAvis = ara + 2500; this.flotant(q.x, q.y - 150, 'Al cap!', '#ffe08a'); }
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
        const c = this.zonaCop(e);
        this.impacte(c.x, c.y - 10, d, mort ? 2 : dany > 1 ? 1 : 0);
        Sfx.cop(mort || dany > 1);
        this.hitStop(mort ? 120 : dany > 1 ? 85 : 55);
        this.cameras.main.shake(mort ? 170 : 110, mort ? 0.008 : 0.004, true);
        if (e.def.barra) this.ui().vidaBoss(e.vida / e.def.vida);
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
        if (e.flama) { e.flama.destroy(); e.flama = null; }
        e.spr.destroy(); e.ombra.destroy();
        this.enemics = this.enemics.filter(x => x !== e);
    },

    // Final del combat contra el Pastor de Boira
    pastorDerrotat(e) {
        const c = e.spr.body.center;
        this.bossCaigut = e;
        this.enemics.filter(x => x.tipus === 'ovella' && !x.mort).forEach(o => {
            o.mort = true; o.spr.body.enable = false; this.boiraPuf(o.spr.x, o.spr.y);
            this.tweens.add({ targets: [o.spr, o.ombra], alpha: 0, duration: 500, onComplete: () => this.retirar(o) });
        });
        this.tweens.add({ targets: e.spr, angle: 80, duration: 400 });
        this.ui().actualitzarHUD();
        this.time.delayedCall(900, () => this.ui().obrirDialeg(DIALEGS.andreuDerrotat(Estat), () => {
            this.tweens.add({ targets: [e.spr, e.ombra], alpha: 0, duration: 800, onComplete: () => this.retirar(e) });
            this.granRosari('pastorGra', 'Pastor de Boira vençut');
            Estat.desar();
        }));
    },

    // Un gra més al rosari (un cor més) com a premi, una sola vegada per cada 'flag'. Cura del tot.
    granRosari(flag, motiu) {
        if (Estat.flag(flag)) return false;
        Estat.posaFlag(flag);
        Estat.dades.corsMax += 1; Estat.dades.vida = Estat.dades.corsMax * 2;
        const ui = this.ui(); ui.actualitzarHUD(); ui.notifica('+1 gra al rosari: ' + motiu);
        Sfx.cura();
        this.llum(this.ineu.x, this.ineu.y - 70, 0xf0c040);
        return true;
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
            Estat.dades.x = null; Estat.dades.y = null;
            // Zones amb punt de control (el combat final): es torna a començar a l'entrada, amb tota la vida
            const rn = this.config.reneix;
            if (rn) { Estat.dades.entrada = rn; this.scene.start(this.scene.key, { entrada: rn }); return; }
            Estat.dades.entrada = 'inici';
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
