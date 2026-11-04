/**
 * COMBAT (fase 2)
 * S'afegeix a ZonaBase (carregar després de zona_base.js). Cada zona crida this.enemic(tipus, x, y).
 *   Atac: J, ESPAI o ENTER/E (si no hi ha res per parlar)
 * Vida del jugador en meitats de cor (Estat.dades.vida). Mal de les armes: bastó 1, branca del Til·ler 2, Runna 3.
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
// L'ocell de boira de les gàbies vives: el mateix ocell, refet en boira lila (de violeta fosc a blanc lilós segons la llum)
function preparaOcellBoira(scene) {
    preparaOcellFoc(scene);
    const FW = 160, FH = 120;
    if (!scene.textures.exists('ocell_boira')) {
        const src = scene.textures.get('ocell_foc').getSourceImage();
        const tex = scene.textures.createCanvas('ocell_boira', FW * 4, FH), ctx = tex.getContext();
        ctx.drawImage(src, 0, 0);
        const im = ctx.getImageData(0, 0, FW * 4, FH), d = im.data;
        for (let i = 0; i < d.length; i += 4) {
            if (!d[i + 3]) continue;
            const l = (0.3 * d[i] + 0.55 * d[i + 1] + 0.15 * d[i + 2]) / 255;
            d[i] = 70 + l * 185; d[i + 1] = 30 + l * 190; d[i + 2] = 130 + l * 125;
            d[i + 3] = Math.min(255, d[i + 3] * 0.92);
        }
        ctx.putImageData(im, 0, 0);
        tex.refresh();
        for (let i = 0; i < 4; i++) tex.add(i, 0, i * FW, 0, FW, FH);
        tex.customData.escala = 1 / RES;
    }
    if (!scene.anims.exists('ocell_boira_vola')) {
        scene.anims.create({ key: 'ocell_boira_vola', frames: [0, 1, 2, 1].map(f => ({ key: 'ocell_boira', frame: f })), frameRate: 14, repeat: -1 });
    }
}

// La gàbia viva (passadís de tortura): una gàbia d'ocell de llautó que penja del sostre amb una cadena, amb boira lila i dos ulls
// a dins. Es dibuixa amb codi, tancada i oberta (la porteta girada i la boira que surt). El llenç té espai buit a sota: el cos
// físic (a terra, amb l'ombra) queda sota la gàbia, que es veu penjant.
function preparaGabiaViva(scene) {
    if (scene.textures.exists('gabia_viva')) return;
    const W = 180, H = 400;                 // a RES 2: es veu de 90x200
    ['gabia_viva', 'gabia_viva_oberta'].forEach((clau, oberta) => {
        const t = scene.textures.createCanvas(clau, W, H), c = t.getContext();
        const cx = W / 2, top = 64, base = 254, R = 62;      // la cúpula comença a 'top', la base és a 'base'
        const llauto = (x0, x1) => { const g = c.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, '#6a4410'); g.addColorStop(0.35, '#f2d488'); g.addColorStop(0.6, '#c8902e'); g.addColorStop(1, '#5a3608'); return g; };
        c.lineCap = 'round'; c.lineJoin = 'round';
        // Cadena del sostre
        for (let k = 0; k < 5; k++) { c.lineWidth = 4; c.strokeStyle = '#2a2a30'; c.beginPath(); c.ellipse(cx, 6 + k * 11, k % 2 ? 3 : 5, 6, 0, 0, Math.PI * 2); c.stroke();
            c.lineWidth = 2; c.strokeStyle = '#8a8a96'; c.stroke(); }
        // Anella de dalt
        c.lineWidth = 7; c.strokeStyle = '#2a1a06'; c.beginPath(); c.arc(cx, top - 6, 11, 0, Math.PI * 2); c.stroke();
        c.lineWidth = 4; c.strokeStyle = llauto(cx - 12, cx + 12); c.stroke();
        // Boira lila de dins, amb resplendor
        const gl = c.createRadialGradient(cx, top + 90, 6, cx, top + 90, R + 10);
        gl.addColorStop(0, oberta ? 'rgba(230,200,255,0.75)' : 'rgba(210,170,255,0.95)'); gl.addColorStop(0.45, 'rgba(150,90,230,0.6)'); gl.addColorStop(1, 'rgba(90,40,160,0)');
        c.fillStyle = gl; c.beginPath(); c.ellipse(cx, top + 92, R - 4, 88, 0, 0, Math.PI * 2); c.fill();
        // Els dos ulls de la boira (a la gàbia tancada: l'ocell encara hi és)
        if (!oberta) {
            [[-16, 0], [16, 0]].forEach(([dx]) => { const ey = top + 84;
                const ge = c.createRadialGradient(cx + dx, ey, 0, cx + dx, ey, 11); ge.addColorStop(0, '#ffffff'); ge.addColorStop(0.4, '#e8c8ff'); ge.addColorStop(1, 'rgba(180,120,255,0)');
                c.fillStyle = ge; c.beginPath(); c.arc(cx + dx, ey, 11, 0, Math.PI * 2); c.fill();
                c.fillStyle = '#3a1060'; c.beginPath(); c.ellipse(cx + dx, ey + 1, 2.5, 4.5, 0, 0, Math.PI * 2); c.fill(); });
        }
        // Barrots: de la cúpula a la base (els del darrere més prims i foscos)
        const nb = 9;
        for (let pas = 0; pas < 2; pas++) for (let i = 0; i < nb; i++) {
            const a = (i / (nb - 1)) * Math.PI, x = cx - Math.cos(a) * R, darrere = i % 2 === 1;
            if ((pas === 0) !== darrere) continue;
            if (oberta && !darrere && (i === 4)) continue;                    // a la porteta oberta hi falta el barrot del mig
            const xt = cx - Math.cos(a) * R * 0.35;
            c.lineWidth = darrere ? 4 : 7; c.strokeStyle = '#2a1a06';
            c.beginPath(); c.moveTo(xt, top + 8); c.quadraticCurveTo(x, top + 18, x, top + 70); c.lineTo(x, base); c.stroke();
            c.lineWidth = darrere ? 2 : 4; c.strokeStyle = darrere ? '#7a5418' : llauto(x - 3, x + 3); c.stroke();
        }
        // Cèrcols horitzontals
        [top + 70, top + 130].forEach(y => { c.lineWidth = 7; c.strokeStyle = '#2a1a06'; c.beginPath(); c.ellipse(cx, y, R, 8, 0, 0, Math.PI * 2); c.stroke();
            c.lineWidth = 4; c.strokeStyle = llauto(cx - R, cx + R); c.stroke(); });
        // Base: un plat de llautó amb sanefa i un floró a sota
        c.fillStyle = llauto(cx - R - 8, cx + R + 8); c.strokeStyle = '#2a1a06'; c.lineWidth = 4;
        c.beginPath(); c.ellipse(cx, base, R + 8, 13, 0, 0, Math.PI * 2); c.fill(); c.stroke();
        c.fillStyle = 'rgba(255,240,190,0.55)'; c.beginPath(); c.ellipse(cx - 18, base - 4, 22, 3.5, 0, 0, Math.PI * 2); c.fill();
        c.fillStyle = '#7a4a14'; for (let k = -3; k <= 3; k++) { c.beginPath(); c.arc(cx + k * 16, base + 4, 2.5, 0, Math.PI * 2); c.fill(); }
        c.fillStyle = llauto(cx - 9, cx + 9); c.beginPath(); c.moveTo(cx - 10, base + 10); c.lineTo(cx + 10, base + 10); c.lineTo(cx, base + 34); c.closePath(); c.fill(); c.stroke();
        // La porteta: tancada, amb un cadenat; oberta, girada cap a fora a la dreta
        if (!oberta) {
            c.lineWidth = 3; c.strokeStyle = '#2a1a06'; c.strokeRect(cx - 18, top + 96, 36, 56);
            c.fillStyle = '#d8a83a'; c.beginPath(); c.arc(cx, top + 126, 7, 0, Math.PI * 2); c.fill(); c.stroke();
            c.fillStyle = '#2a1a06'; c.fillRect(cx - 1.5, top + 124, 3, 6);
        } else {
            c.save(); c.translate(cx + 20, top + 96); c.transform(0.45, 0.18, 0, 1, 0, 0);
            c.lineWidth = 6; c.strokeStyle = '#2a1a06'; c.strokeRect(0, 0, 40, 56); for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(k * 10, 0); c.lineTo(k * 10, 56); c.stroke(); }
            c.lineWidth = 3; c.strokeStyle = '#e0b850'; c.strokeRect(0, 0, 40, 56); for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(k * 10, 0); c.lineTo(k * 10, 56); c.stroke(); }
            c.restore();
            const gs = c.createRadialGradient(cx + 10, top + 122, 0, cx + 10, top + 122, 40); gs.addColorStop(0, 'rgba(230,200,255,0.8)'); gs.addColorStop(1, 'rgba(160,100,255,0)');
            c.fillStyle = gs; c.beginPath(); c.arc(cx + 10, top + 122, 40, 0, Math.PI * 2); c.fill();
        }
        t.refresh();
    });
}

// L'Ocellaire cansat (assets/enemics/ocellaire_cansat.webp), si hi és
// L'arma amb què pica l'Ineu: sempre la millor que té
function armaIneu() { return Estat.te('runna') ? 'runna' : Estat.te('basto_tiller') ? 'tiller' : 'basto'; }
function teCansatOcellaire(z) { return z.textures.exists('ocellaire_cansat') && !Grafics.faltants.includes('ocellaire_cansat'); }
// L'Ocellaire de genolls (assets/enemics/ocellaire_genolls.webp): la pausa en què se li pot picar el cap
function teGenollsOcellaire(z) { return z.textures.exists('ocellaire_genolls') && !Grafics.faltants.includes('ocellaire_genolls'); }

const ENEMICS = {
    escolopendra: {
        tex: 'escolopendra', vida: 2, vel: 95, mal: 1, radi: 20, cos: [40, 16], ombra: 0, centrat: true,   // l'ombra ja és al dibuix; vista de dalt, el cos és al mig
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
                e.spr.setScale(e.escalaBase);
                Sfx.salt();
            }
        }
    },

    // Bolet brut: estàtic; carrega espores (cercle verd) i les deixa anar a l'àrea
    bolet: {
        tex: 'bolet', vida: 2, vel: 0, mal: 1, radi: 22, cos: [34, 18], ombra: 0.35,
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
                    e.estat = 'apunta'; e.fins = ara + 800;
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
        tex: 'pastor_boira', vida: 24, vel: 320, mal: 1, radi: 30, cos: [46, 26], ombra: 0.5, immune: 520,
        robust: true, barra: true, arma: 'tiller',          // només cedeix a la branca del Til·ler
        perill: e => e.estat === 'carrega',
        ia(z, e, ara) {
            const jo = z.ineu.body.center, c = e.spr.body.center;
            const dist = Phaser.Math.Distance.Between(c.x, c.y, jo.x, jo.y);
            const fase2 = e.vida <= this.vida / 2;
            if (!e.proxCrida) { e.proxCrida = ara + 3500; e.proxCarrega = ara + 2600; e.proxBat = ara + 1800; }
            const cap = Math.atan2(jo.y - c.y, jo.x - c.x);
            if (e.estat === 'apunta') {
                e.spr.body.setVelocity(0);
                if (ara > e.fins) { e.estat = 'carrega'; e.fins = ara + 340; e.spr.clearTint(); e.spr.body.setVelocity(Math.cos(e.ang) * this.vel, Math.sin(e.ang) * this.vel); }
            } else if (e.estat === 'carrega') {
                if (ara > e.fins) { e.estat = 'cansat'; e.fins = ara + (fase2 ? 950 : 1300); e.spr.body.setVelocity(0); e.proxCarrega = ara + (fase2 ? 2200 : 3000); }
            } else if (e.estat === 'bat') {
                // Cop de caiada en arc: mentre s'atura, un oval a terra s'omple i marca exactament l'àrea on farà mal (els peus de l'Ineu
                // a dins); en acabar, l'ona que surt és el mateix oval
                e.spr.body.setVelocity(0);
                const R = 125, RY = R * 0.55;
                if (!e.avisBat) {
                    e.avisBat = z.add.ellipse(c.x, c.y, R * 2, RY * 2, 0xffd080, 0.06).setStrokeStyle(4, 0xffd080, 0.9).setDepth(c.y - 400);
                    z.tweens.add({ targets: e.avisBat, fillAlpha: 0.32, duration: e.fins - ara, ease: 'Quad.in' });
                }
                if (ara > e.fins) {
                    e.spr.clearTint();
                    z.tweens.killTweensOf(e.avisBat); e.avisBat.destroy(); e.avisBat = null;
                    z.cameras.main.shake(120, 0.004);
                    Sfx.cop(true);
                    const ona = z.add.ellipse(c.x, c.y, R * 2, RY * 2, 0xfff0b0, 0.35).setStrokeStyle(6, 0xffffff, 0.9).setDepth(c.y - 399).setScale(0.4);
                    z.tweens.add({ targets: ona, scale: 1, alpha: 0, duration: 280, ease: 'Cubic.out', onComplete: () => ona.destroy() });
                    const dx = (jo.x - c.x) / R, dy = (jo.y - c.y) / RY;
                    if (dx * dx + dy * dy < 1) z.ferIneu(1, { x: c.x, y: c.y });
                    e.estat = 'cansat'; e.fins = ara + 700; e.proxBat = ara + (fase2 ? 2200 : 3000);
                }
            } else if (e.estat === 'cansat') {
                e.spr.body.setVelocity(0);
                if (ara > e.fins) e.estat = 'camina';
            } else {   // camina cap a l'Ineu i crida el ramat
                e.estat = 'camina';
                const v = dist > 95 ? (fase2 ? 85 : 66) : 0;
                e.spr.body.setVelocity(Math.cos(cap) * v, Math.sin(cap) * v);
                e.spr.setFlipX(Math.cos(cap) < 0);
                if (dist < 130 && ara > e.proxBat) { e.estat = 'bat'; e.fins = ara + (fase2 ? 550 : 750); e.spr.setTint(0xffe080); }
                if (ara > e.proxCrida) {
                    e.proxCrida = ara + (fase2 ? 6000 : 8500);
                    const vius = z.enemics.filter(x => x.tipus === 'ovella' && !x.mort).length;
                    if (vius < 2) {
                        z.flotant(c.x, c.y - 120, 'Be-e-e!', '#e0a0ff');
                        Sfx.be();
                        [-1, 1].slice(0, 2 - vius).forEach(s => { const o = z.enemic('ovella', c.x + s * 150, c.y + 60); if (o) { z.boiraPuf(o.spr.x, o.spr.y); o.fins = ara + 900; } });   // mai més de dues alhora
                    }
                } else if (ara > e.proxCarrega && dist < 440) {
                    e.estat = 'apunta'; e.fins = ara + (fase2 ? 550 : 800); e.ang = cap;
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
        tex: 'ocellaire', vida: 54, vel: 70, mal: 1, radi: 38, cos: [58, 26], ombra: 0.8,
        cap: { y: 0.19, r: 40, nomesCansat: true },          // el punt feble: el cap (al 19% del dibuix des de dalt), i només quan està cansat
        capTex: { ocellaire_genolls: { x: 0.15, y: 0.32, r: 40, nomesCansat: true } },   // de genolls, el cap és més avall i decantat
        copsPausa: 3,
        arma: 'runna',                                       // només Runna li fa mal                                        // a la tercera, s'aixeca d'una revolada i t'empeny
        robust: true, barra: true,
        perill: e => !e.amagat && e.estat !== 'apareix',
        ia(z, e, ara) {
            const jo = z.ineu.body.center, c = e.spr.body.center;
            const fase3 = e.vida <= this.vida / 3, fase2 = e.vida <= this.vida * 2 / 3;      // tres fases d'un terç de vida cadascuna: 54 → 36 → 18 (dues pauses de genolls per fase)
            const pausa = fase3 ? 1600 : fase2 ? 1900 : 2200;     // quant dura de genolls
            if (!e.proxAtac) { e.proxAtac = ara + 1800; e.estat = 'sura'; e.nAtac = 0; }
            // Idle: respira (1 → 2 → 1 → 3) mentre sura; pose de rugit als canvis de fase; en la resta d'estats, el sprite base
            const clauIdle = e.estat === 'rugit' ? 'ocellaire_rugit'
                : e.estat === 'cansat' && teGenollsOcellaire(z) ? 'ocellaire_genolls'
                : e.estat === 'cansat' && teCansatOcellaire(z) ? 'ocellaire_cansat'
                : e.estat === 'sura' ? ['ocellaire', 'ocellaire_idle2', 'ocellaire', 'ocellaire_idle3'][Math.floor(ara / 260) % 4] : 'ocellaire';
            if (e.spr.texture.key !== clauIdle && z.textures.exists(clauIdle)) e.spr.setTexture(clauIdle);
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
                    z.genollsOcellaire(e, pausa);                 // ha buidat el bàcul: cau de genolls mentre els ocells es llancen
                }
            } else if (e.estat === 'cercle') {
                // Cop de bàcul en cercle: avisa amb un anell a terra i, en acabar, una ona que fa mal i t'allunya
                e.spr.body.setVelocity(0);
                b.gir = Math.min(0.6, b.gir + 0.05);
                if (!e.avisCercle) e.avisCercle = z.avisAnell(c.x, c.y, e.radiCercle, e.fins - ara);
                if (ara > e.fins) {
                    z.colpAnell(e, e.radiCercle);
                    e.avisCercle = null;
                    e.estat = 'sura'; e.proxAtac = ara + (fase3 ? 700 : 1000); e.puntSura = null;      // el cop en cercle no el cansa
                }
            } else if (e.estat === 'foc') {
                // Fase 3: alça el bàcul i el terra crema al voltant de l'Ineu (cal moure's de seguida)
                e.spr.body.setVelocity(0);
                b.gir = 0.6;
                if (!e.focFet) { e.focFet = true; z.focsTerra(e); Sfx.carrega(); }
                if (ara > e.fins) { e.focFet = false; z.genollsOcellaire(e, pausa); }
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
                        onComplete: () => { b.volant = false; if (!e.mort && e.estat === 'llança') { e.estat = 'sura'; e.proxAtac = z.time.now + 700; e.puntSura = null; } } });   // recupera el bàcul i torna a surar
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
            } else {   // cansat: de genolls, el bàcul s'alenteix, abaixa el cap i és el moment de colpejar-lo
                e.spr.body.setVelocity(0);
                b.gir = Math.max(0.02, b.gir * 0.94);
                if (ara > e.fins) {
                    if (e.copsRebuts >= this.copsPausa) z.aixecaOcellaire(e);          // l'han picat prou: s'aixeca d'una revolada i t'empeny
                    e.estat = 'sura'; e.proxAtac = ara + (fase3 ? 900 : fase2 ? 1300 : 1800); e.puntSura = null;
                }
            }
            e.spr.setFlipX(jo.x < c.x);
            z.moureBasto(e);
        },
        alDerrotar(z, e) { z.ocellaireDerrotat(e); }
    },

    // Ocell de foc de l'Ocellaire: volta al voltant del seu amo i, quan li toca, es llança contra l'Ineu
    ocellFoc: {
        tex: 'ocell_foc', vida: 1, vel: 300, mal: 1, radi: 18, cos: [26, 20], ombra: 0.15, centrat: true,
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

    // Gàbia viva (passadís de tortura): penja del sostre i es gronxa. Quan l'Ineu s'acosta, la porteta s'obre i en surt un ocell de
    // boira que el busca en picat i després torna a la gàbia. Tres cops la trenquen (i el seu ocell s'esvaeix).
    gabiaViva: {
        tex: 'gabia_viva', vida: 3, vel: 0, mal: 1, radi: 34, cos: [44, 20], ombra: 0.5, robust: true,
        preparar: z => { preparaGabiaViva(z); preparaOcellBoira(z); },
        perill: e => false,
        ia(z, e, ara) {
            if (!e.base) { e.base = { x: e.spr.x, y: e.spr.y }; e.proxObre = ara + 700 + Math.random() * 800; }
            if (Math.abs(e.spr.x - e.base.x) + Math.abs(e.spr.y - e.base.y) > 1) e.spr.body.reset(e.base.x, e.base.y);
            e.spr.body.setVelocity(0);
            e.spr.angle = Math.sin(ara / 520 + e.base.x) * 3.5;
            const jo = z.ineu.body.center, d = Phaser.Math.Distance.Between(e.base.x, e.base.y, jo.x, jo.y);
            if (e.ocell && e.ocell.mort) { e.ocell = null; e.proxObre = ara + 2200; e.spr.setTexture('gabia_viva'); }
            if (!e.ocell && ara > e.proxObre && d < 340) {
                e.spr.setTexture('gabia_viva_oberta');
                z.tweens.add({ targets: e.spr, scaleX: e.escalaBase * 1.08, yoyo: true, duration: 120 });
                Sfx.xiscle();
                const o = z.enemic('ocellGabia', e.spr.x, e.spr.y - 120);
                if (o) { o.amo = e; o.estat = 'surt'; o.fins = ara + 650; o.ang0 = Math.random() * Math.PI * 2; e.ocell = o; }
                else e.proxObre = ara + 2000;
            }
        },
        alDerrotar(z, e) {
            if (e.ocell && !e.ocell.mort) z.derrotar(e.ocell);
            const c = { x: e.spr.x, y: e.spr.y - 110 };
            const pl = z.add.particles(c.x, c.y, 'espurna', { speed: { min: 60, max: 200 }, lifespan: 700, scale: { start: 0.35, end: 0 }, tint: [0xf2d488, 0xc8902e, 0xc8a0ff], quantity: 18, emitting: false }).setDepth(99990);
            pl.explode(18); z.time.delayedCall(800, () => pl.destroy());
            z.tweens.add({ targets: e.spr, y: e.spr.y + 30, angle: 25, alpha: 0, duration: 450, ease: 'Quad.easeIn', onComplete: () => z.retirar(e) });
            e.ombra.setVisible(false);
            z.ui().actualitzarHUD();
        }
    },

    // Ocell de boira de la gàbia viva: surt voltant, es llança en picat contra l'Ineu i torna a la seva gàbia
    ocellGabia: {
        tex: 'ocell_boira', vida: 1, vel: 300, mal: 1, radi: 18, cos: [26, 20], ombra: 0.15, centrat: true,
        preparar: z => preparaOcellBoira(z),
        perill: e => e.estat === 'picat',
        ia(z, e, ara) {
            if (!e.vestit) { e.vestit = true; e.spr.anims.play('ocell_boira_vola'); e.spr.setAlpha(0.92); }
            const jo = z.ineu.body.center, c = e.spr.body.center, amo = e.amo;
            if (!amo || amo.mort) { if (!e.mort) { e.mort = true; e.spr.body.enable = false; z.tweens.add({ targets: e.spr, alpha: 0, duration: 300, onComplete: () => z.retirar(e) }); } return; }
            const casa = { x: amo.spr.x, y: amo.spr.y - 120 };
            if (e.estat === 'surt') {                 // voltant la gàbia, pujant
                const t = e.ang0 + ara / 220;
                e.spr.body.setVelocity((casa.x + Math.cos(t) * 70 - c.x) * 4, (casa.y - 20 + Math.sin(t) * 40 - c.y) * 4);
                e.spr.setFlipX(Math.sin(t) > 0);
                if (ara > e.fins) { e.estat = 'picat'; e.fins = ara + 950; e.ang = Math.atan2(jo.y - 30 - c.y, jo.x - c.x); }
            } else if (e.estat === 'picat') {
                if (ara < e.fins - 650) { const a = Math.atan2(jo.y - 30 - c.y, jo.x - c.x); e.ang += Phaser.Math.Clamp(Phaser.Math.Angle.Wrap(a - e.ang), -0.07, 0.07); }
                e.spr.body.setVelocity(Math.cos(e.ang) * this.vel, Math.sin(e.ang) * this.vel);
                e.spr.setFlipX(Math.cos(e.ang) < 0);
                const bl = e.spr.body.blocked;
                if (ara > e.fins || bl.left || bl.right || bl.up || bl.down) e.estat = 'torna';
            } else {                                  // torna a la gàbia i s'hi fica
                const dx = casa.x - c.x, dy = casa.y - c.y, l = Math.hypot(dx, dy) || 1;
                e.spr.body.setVelocity(dx / l * 200, dy / l * 200);
                e.spr.setFlipX(dx < 0);
                if (l < 22) { e.mort = true; e.spr.body.enable = false; z.tweens.add({ targets: e.spr, alpha: 0, scale: e.escalaBase * 0.4, duration: 220, onComplete: () => z.retirar(e) }); }
            }
        }
    },

    // Ratpenat de boira (Gírgoles): penja quiet a la foscor; quan l'Ineu s'acosta, baixa fent ziga-zaga, i després s'enlaira
    ratpenat: {
        tex: 'ratpenat', vida: 2, vel: 190, mal: 1, radi: 20, cos: [34, 20], ombra: 0.2, centrat: true,
        perill: e => e.estat === 'ataca',
        ia(z, e, ara) {
            const jo = z.ineu.body.center, c = e.spr.body.center;
            const dist = Phaser.Math.Distance.Between(c.x, c.y, jo.x, jo.y);
            if (!e.casa) e.casa = { x: c.x, y: c.y };
            e.spr.setScale(e.escalaBase);
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
                    z.tweens.add({ targets: e.spr, y: e.spr.y - 12, yoyo: true, duration: 160 });
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
        perill: () => false,
        ia(z, e, ara) {
            e.spr.body.setVelocity(0);
            e.spr.y = e.yBase + Math.sin(ara / 400 + e.fase) * 6;
        },
        alDerrotar(z, e) { z.capollTrencat(e); }
    },

    visitant: {
        tex: 'visitant_zombi', texAlt: 'visitant', escala: 0.6, vida: 4, vel: 58, mal: 1, radi: 24, cos: [40, 22], ombra: 0.42,
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
            if (e.spr.texture.key === 'visitant_zombi' && z.anims.exists('visitant_camina')) {
                // El full és de cara i serveix per a totes les direccions (sense girar-lo); s'atura quan es queda quiet
                const quiet = vx === 0 && vy === 0;
                if (!quiet && !e.spr.anims.isPlaying) e.spr.play('visitant_camina', true);
                else if (quiet && e.spr.anims.isPlaying) e.spr.anims.pause();
                else if (!quiet && e.spr.anims.isPaused) e.spr.anims.resume();
            } else if (Math.abs(vx) > 5) e.spr.setFlipX(vx < 0);
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
        // Amb full de caminar (def.tex) i la imatge de reserva (def.texAlt): si el full no s'ha pogut carregar, es fa servir la de reserva
        const animada = !!def.texAlt && this.textures.exists(def.tex) && this.textures.get(def.tex).frameTotal > 2;
        const clauTex = def.texAlt && !animada ? def.texAlt : def.tex;
        const tex = this.textures.get(clauTex);
        const esc = animada && def.escala ? def.escala : ((tex.customData && tex.customData.escala) || 1 / RES);
        const spr = this.physics.add.sprite(x, y, clauTex, tex.has(0) ? 0 : undefined).setScale(esc);   // (els fulls d'animació, al fotograma 0)
        spr.setDepth(y + spr.displayHeight / 2);       // ja des del primer moment (mentre hi ha un diàleg no s'actualitza: sense això el decorat el tapava)
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
            spr.setAlpha(0).setScale(esc);
            e.atorditFins = this.time.now + 600;
            this.tweens.add({ targets: spr, alpha: 1, duration: 450, ease: 'Sine.easeOut' });
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

    // Missatge que s'ha de poder llegir: al quadre de diàleg de sota
    missatge(text, fet) { this.ui().missatge(text, fet); },

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
        const agil = runna || Estat.te('basto_tiller');          // la branca del Til·ler (i Runna) són més ràpids i amb més abast
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
        this.cop = { fins: ara + 200, d, L, ample: agil ? 34 : 28, dany: runna ? 3 : agil ? 2 : 1, tocats: new Set(), runna };
        this.comprovarCop();
        // Runna talla els esbarzers negres
        if (runna) {
            const px = jo.x + d.x * 55, py = jo.y + d.y * 55;
            this.esbarzers.forEach(o => { if (o.viu && Phaser.Math.Distance.Between(o.x, o.y - 20, px, py) < 85) this.destruirEsbarzer(o); });
        }
        if (this.alAtacar) this.alAtacar(jo, d);          // les zones poden reaccionar al cop (les arrels del Til·ler)
    },

    // Animació d'atac de l'Ineu amb la fulla de la direcció (8 vistes). Retorna fals si no n'hi ha.
    // La fulla mostra l'Ineu sense arma: l'arma (bastó, branca del Til·ler o espasa) és una capa que segueix la mà (ATAC_ARMA).
    animarAtac(d, runna, agil) {
        const vista = OCTANTS_INEU[(Math.round(Math.atan2(d.y, d.x) / (Math.PI / 4)) + 8) % 8];
        if (!Grafics.atacsVista || !Grafics.atacsVista.has(vista)) return false;
        this.atacantFins = 0;
        this.vista8Manual = true;
        this.posarDireccio(this.direccio, false, vista);
        this.ineu.setFlipX(false);
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
            const jo = this.ineu, s = jo.scaleX * SPRITE_INEU.k;          // (la taula és en píxels de la cel·la de 256)
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
                // Contra el cap d'un boss alt, un cop cap amunt (l'arma per sobre del cap) arriba més amunt
                const extra = c.cap && d.y < -0.4 && !this.capDe(e).senseAbast ? 75 : 0;
                if (t < -12 || t > k.L + c.r + extra) return false;
                const lat = Math.abs(rx * d.y - ry * d.x);          // distància lateral
                return lat < c.r + k.ample;
            });
            if (!tocats.length) return;
            k.tocats.add(e);
            // Cada boss té la seva arma (el Pastor, la branca del Til·ler; l'Home del Raïm i l'Ocellaire, Runna): amb una altra, el cop rebota.
            // (La història ja ho garanteix, perquè l'Ineu sempre fa servir la millor arma que té; això n'és la xarxa de seguretat.)
            if (e.def.arma && e.def.arma !== armaIneu()) { this.copRebutjat(e, d); return; }
            if (e.def.cap && (!tocats.some(c => c.cap) || (this.capDe(e).nomesCansat && e.estat !== 'cansat'))) { this.copRebutjat(e, d); return; }
            this.colpejar(e, k.dany, d); encertats++;
            // Bosses amb un màxim de cops per pausa: a l'últim, la pausa s'acaba
            if (e.def.copsPausa && e.estat === 'cansat' && !e.mort && ++e.copsRebuts >= e.def.copsPausa) e.fins = Math.min(e.fins, this.time.now + 120);
        });
    },

    // L'arma a la mà: bastó (assets/armes/basto.png), branca del Til·ler o espasa de Runna, girant en arc durant el cop.
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

    // On cal colpejar un enemic: el cos físic (que bloqueja i fa mal) és als peus. Els bosses alts amb 'cap' (l'Home de la Gàbia, l'Home
    // del Raïm) només es poden ferir al cap: és on el dibuix el té (def.cap.y: fracció de l'alçada des de dalt), i la resta del cos
    // (una cadena de cercles fins als peus) rebutja el cop. Si el sprite està inclinat, el cap el segueix.
    puntsCop(e) {
        const c = e.spr.body.center;
        if (!e.def.cap) return [{ x: c.x, y: c.y, r: e.def.radi }];
        const s = e.spr, h = s.displayHeight, cp = this.capDe(e);
        const punt = (f, r, cap, fx = 0) => {
            const oy = -h * s.originY + h * f, ox = fx * s.displayWidth * (s.flipX ? -1 : 1), a = s.rotation || 0;
            return { x: s.x + Math.cos(a) * ox - Math.sin(a) * oy, y: s.y + Math.sin(a) * ox + Math.cos(a) * oy, r, cap };
        };
        return [punt(cp.y, cp.r, true, cp.x || 0), punt(0.45, 44), punt(0.7, 44), { x: s.x, y: c.y, r: 44 }];
    },
    // El cap d'un boss segons el dibuix que fa servir ara (de genolls, el cap de l'Ocellaire és més avall)
    capDe(e) {
        return (e.def.capTex && e.def.capTex[e.spr.texture.key]) || e.def.cap;
    },
    zonaCop(e) {                    // on surten les espurnes del cop
        const c = e.spr.body.center;
        if (!e.def.cap) return { x: c.x, y: c.y, r: e.def.radi };
        const q = this.puntsCop(e)[0];
        return { x: q.x, y: q.y, r: q.r };
    },
    // El cop ha caigut al cos, no al cap: no fa mal
    copRebutjat(e, d) {
        const q = this.puntsCop(e)[2], ara = this.time.now;
        Sfx.escut();
        this.cameras.main.shake(70, 0.0015, true);
        this.impacte(q.x, q.y, { x: -d.x, y: -d.y }, 0);
    },

    colpejar(e, dany, d) {
        const ara = this.time.now;
        // Alguns bosses no deixen que els colpegis seguit: després d'un cop, un instant sense dany
        if (e.def.immune && ara < (e.immuneFins || 0)) { Sfx.escut(); return; }
        if (e.def.immune) e.immuneFins = ara + e.def.immune;
        if (e.fins === Infinity) e.fins = this.time.now + 300;          // una bèstia adormida (el ramat del Pastor) es desperta si la piquen
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
        // Flaix blanc, retrocés i sacsejada de l'enemic (sense deformar el sprite)
        e.spr.setTintFill(0xffffff);
        this.time.delayedCall(100, () => { if (e.spr.active) e.spr.clearTint(); });
        this.tweens.killTweensOf(e.spr);
        e.spr.setScale(e.escalaBase);
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

        if (e.tipus === 'visitant') {
            if (e.spr.anims) e.spr.anims.stop();
            this.tweens.add({ targets: e.spr, angle: 90, duration: 300 });
            this.tweens.add({ targets: [e.spr, e.ombra], alpha: 0, duration: 700, onComplete: () => this.retirar(e) });
        } else {
            this.tweens.add({ targets: e.spr, alpha: 0, duration: 320, onComplete: () => this.retirar(e) });
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
        this.ui().amagarBarraBoss();
        if (e.avisBat) { this.tweens.killTweensOf(e.avisBat); e.avisBat.destroy(); e.avisBat = null; }
        this.bossCaigut = e;
        if (this.treureTanques) this.treureTanques();
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
        const ui = this.ui(); ui.actualitzarHUD(); ui.missatge('+1 gra al rosari: ' + motiu);
        Sfx.cura();
        this.llum(this.ineu.x, this.ineu.y - 70, 0xf0c040);
        return true;
    },

    // ---------------- Dany al jugador ----------------
    ferIneu(mal, des) {
        const ara = this.time.now;
        if (ara < (this.invulnerableFins || 0) || this.caient) return;
        // El Llaç de la Nena absorbeix un cop cada cop que entres a una zona
        if (Estat.te('cinta_nena') && !this.cintaGastada) {
            this.cintaGastada = true;
            this.invulnerableFins = ara + 1100;
            this.flotant(this.ineu.x, this.ineu.y - 150, 'El llaç et protegeix', '#e0a0c0');
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

    // L'Ineu cau: el Pare Jordà el recull a la Plaça amb tota la vida
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
