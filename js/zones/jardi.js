/**
 * EL JARDÍ DE L'HOSTATGERIA (ZonaJardi): pèrgola de pedra, Prunera Màgica, llosa del passadís secret i l'Isílder.
 */

// ---------------- L'HOSTATGERIA ----------------
// Un gran edifici de pedra a la dreta i, enganxada al seu lateral esquerre, una pèrgola d'arcades de pedra: és un jardí
// de gespa amb flors (només allà dins n'hi ha). Les arcades del davant són a la mateixa línia que la façana de la casa i
// tan altes com la seva planta baixa, perquè la façana i la pèrgola es llegeixin com una sola obra. Dins hi ha la Prunera
// Màgica i la llosa del passadís secret de la masmorra; davant l'entrada, l'Isílder. El camí de l'Era i de la Taverna
// passa per davant (sud). L'id de la zona continua sent ZonaJardi (les partides desades hi compten).
class ZonaJardi extends ZonaBase {
    constructor() {
        super('ZonaJardi', {
            nom: "L'Hostatgeria",
            amplada: 1800,
            alcada: 1100,
            entrades: { era: { x: 60, y: 960, dir: 'dreta' }, taverna: { x: 1740, y: 960, dir: 'esquerra' }, llosa: { x: 624, y: 568, dir: 'avall' }, hostatgeria: { x: 1339, y: 800, dir: 'avall' } }
        });
    }

    construir() {
        let llavor = 5;
        const rnd = () => { llavor = (llavor * 16807) % 2147483647; return llavor / 2147483647; };
        this.terra('herba', 0, 0, 1800, 1100, -1100);
        this.terra('cami', 0, 880, 1800, 130);            // camí de l'Era a la Taverna, davant la pèrgola i la casa

        // --- L'Hostatgeria: edifici gran a la dreta (1100 d'ample; la paret de l'esquerra és a x≈752) ---
        // La porta (~110x150) queda a x≈1339.
        const BASE = 734;                                  // on comença l'edifici (la base de la façana): el gràfic ja no té vorera; el mur de la pèrgola acaba al mateix nivell
        const casa = this.posar('hostatgeria', 1250, BASE, { fonsY: 640 });
        // La façana, amb un forat a la porta (x 1293-1383). Un cop s'ha sortit per dins (o les sacerdotesses l'han oberta), s'hi pot entrar
        if (this.dadesEntrada.entrada === 'hostatgeria') Estat.posaFlag('portaHostOberta');
        const oberta = Estat.flag('portaHostOberta') || Estat.flag('mongesTrobades');
        this.colisio((754 + 1293) / 2, (670 + BASE - 17) / 2, 1293 - 754, BASE - 17 - 670);          // (la paret de l'esquerra de la casa és a x≈754: l'Ineu s'hi pot arrambar des del jardí)
        this.colisio((1383 + 1800) / 2, (670 + BASE - 17) / 2, 1800 - 1383, BASE - 17 - 670);
        this.blocDarrere(1277, 1046, 670);
        if (oberta) {
            this.sortida(1295, 686, 86, 30, 'ZonaHostatgeriaInt', 'porta');
            this.portaAnimada({ x: 1338, top: 582, bottom: 719, ample: 90, fons: 640, unic: true, retall: casa });   // la mateixa porta del gràfic, que s'obre
        } else {
            this.colisio(1338, 698, 90, 36);
            this.interactiu(1339, 712, RADI_OBJECTE, DIALEGS.hostatgeria, { altura: 180 });          // (a la porta mateixa: l'Ineu s'hi para just davant, mirant cap amunt, i el punt ha de quedar davant seu)
        }

        // --- Pèrgola de pedra enganxada al lateral esquerre: dues files de columnes unides per bigues d'heura ---
        // Fila del davant a y=BASE-48 (el mur de sota acaba a la base de la façana); fila del darrere a y=410 perquè el jardí i la llosa quedin ben deslliurats.
        const COLS = [44, 276, 508, 740], YB = 410, YF = BASE - 48;          // quatre columnes per fila: la primera toca la vora de l'escenari (88 d'ample) i la de la dreta és enganxada a la paret de la casa
        const PLANTA = Math.round(casa.displayHeight * 0.339);            // alçada de la planta baixa de la façana
        const tex = this.textures.get('columna'), escalaBase = (tex.customData && tex.customData.escala) || 1 / RES;
        const colH = tex.getSourceImage().height * escalaBase;            // alçada d'una columna sense escalar
        const ESC = 1.4, ALT_COL = Math.round(colH * ESC), COL_W = Math.round(tex.getSourceImage().width * escalaBase * ESC);
        // L'heura només baixa per les columnes (ja no hi ha bigues d'heura pel capdamunt: tapaven l'Isílder i l'Ineu quan hi passaven per sota).
        // (La funció biga() es deixa per si cal tornar-hi.)
        const heura = (x, y, esc, alfa, prof, ang) => {
            if (Math.hypot(x - 160, (y - 430) * 1.25) < 195 && y < 545) prof = 638;   // sota la capçada de la Prunera però per damunt de les columnes del nord
            const l = this.add.image(x, y, 'fulla_heura').setScale(esc).setAlpha(alfa).setDepth(prof).setAngle(ang);
            l.setTint([0x4f8f35, 0x6aac3e, 0x7cbc4a, 0x3f7a30, 0x92cc58][Math.floor(rnd() * 5)]);
            return l;
        };
        const yTopB = YB - ALT_COL + 10, yTopF = YF - ALT_COL + 12;               // el capdamunt (capitell) de les columnes de cada fila
        const biga = (xa, ya, xb, yb) => {                                          // biga de dues files paral·leles de fulles de (xa, ya) a (xb, yb)
            const llarg = Math.hypot(xb - xa, yb - ya), n = Math.round(llarg / 10), ang = Math.atan2(yb - ya, xb - xa);
            const nx = -Math.sin(ang), ny = Math.cos(ang), baseAng = Phaser.Math.RadToDeg(ang) + 90;
            for (let i = 0; i <= n; i++) {
                [-1, 1].forEach(s => {
                    const t = Phaser.Math.Clamp((i + (s > 0 ? 0.4 : 0)) / n, 0, 1);
                    const cx = xa + (xb - xa) * t, cy = ya + (yb - ya) * t, perp = s * 7.5 + (rnd() - 0.5) * 2.2;
                    heura(cx + nx * perp + (rnd() - 0.5) * 2.5, cy + ny * perp + (rnd() - 0.5) * 2.5, 0.16 + rnd() * 0.07, 0.9 + rnd() * 0.1, YF + 3, baseAng + s * 42 + (rnd() - 0.5) * 32);
                });
            }
        };
        // Les columnes: el mateix sprite (pedres irregulars amb heura), girat amb el mirall alternant de columna en columna i de fila en fila perquè no siguin totes iguals
        COLS.forEach((x, i) => [YB, YF].forEach((y, j) => {
            // Sense col·lisió pròpia (la fa només el mur, d'una sola línia) i per sobre del mur (hi són a sobre); les de la dreta les tapa l'edifici (es retallen a la seva paret, x = 754)
            const c = this.posar('columna_heura', x, y, { opac: true });
            c.setFlipX((i + j) % 2 === 1).setDepth(y + 41);
            if (i === COLS.length - 1) { const fw = c.frame.width, ample = c.displayWidth; c.setCrop(0, 0, Math.max(1, Math.min(fw, (754 - (x - ample / 2)) / ample * fw)), c.frame.height); }
        }));
        this.pergola = { x0: COLS[0], x1: COLS[COLS.length - 1], yb: YB, yf: YF, planta: PLANTA };

        // --- El fons de la pèrgola (darrere la fila de columnes del darrere): el CEL, amb pocs núvols en forma de cargol (a l'estil de Monkey Island 3; prova; abans s'hi havia provat un mur de pedra i un bosc amb xiprers, i quedaven malament).
        // Degradat de blau a dalt a un blau-crema pàl·lid a l'horitzó (a l'altura del peu de les cortines), i uns quants núvols blancs que es mouen molt a poc a poc.
        {
            const HORITZO = YB - 70;
            const cel = this.add.graphics().setDepth(-1050);
            cel.fillGradientStyle(0x62a8e0, 0x62a8e0, 0xb4daf2, 0xb4daf2, 1).fillRect(0, 0, 1800, HORITZO + 34);
            // Núvols en cargol a l'estil de Monkey Island 3: el dibuix assets/natura/nuvol.webp, girat (el cargol va al davant i la cua darrere) i passant lentament d'esquerra a dreta de tot el cel;
            // en sortir per la dreta tornen a entrar per l'esquerra. Només un núvol al cel (x0, y, ample, velocitat en px/s).
            const nuvol = (x0, y, ample, vel, alfa) => {
                const g = this.add.image(x0, y, 'nuvol').setOrigin(0.5, 0.5).setDepth(-1045).setAlpha(alfa).setFlipX(true);
                g.setScale(ample / g.width);
                const FI = 1800 + ample, INICI = -ample;
                // Passa d'esquerra a dreta; quan l'edifici de l'Hostatgeria l'amaga del tot, torna a entrar de seguida per l'esquerra (sense esperar a sortir per l'extrem)
                const anar = x => { g.x = x; const tw = this.tweens.add({ targets: g, x: FI, duration: (FI - x) / vel * 1000, ease: 'Linear',
                    onUpdate: () => { if (casa.getBounds().contains(g.getBounds().left, g.getBounds().top) && casa.getBounds().contains(g.getBounds().right, g.getBounds().bottom)) { tw.stop(); anar(INICI); } },
                    onComplete: () => anar(INICI) }); };
                anar(x0);
                return g;
            };
            [[250, 150, 320, 12, 0.95]].forEach(([x, y, w, v, a]) => nuvol(x, y, w, v, a));
            this.colisio(900, HORITZO + 2, 1800, 4);                                          // (línia de col·lisió: no es pot pujar al fons)
        }

        // --- Cortines d'heura entre les columnes (la fila del davant i la del darrere): el dibuix cortina_heura (art/objectes), estàtic i una mica transparent, des del capitell fins al muret.
        // No toquen el tros de l'est (entre la 4a columna i la paret de la casa) i, davant, deixen lliure l'entrada (entre la 3a i la 4a columna, amb els graons, no hi ha res). Cada panell
        // mostra un tros diferent del dibuix (i alguns, girats) perquè no es repeteixin. Es pot ajustar: ALFA_CORT (opacitat; 1 = opac).
        {
            const ALFA_CORT = 0.75;
            const MARGE = 0;                                                               // la cortina arriba fins al centre de cada columna (que la tapa per davant): així la toca sempre
            const panells = [];
            [[YB, yTopB, false], [YF, yTopF, true]].forEach(([y, yTop, davant]) => {
                for (let i = 0; i < COLS.length - 1; i++) {
                    const xa = COLS[i] + MARGE, xb = COLS[i + 1] - MARGE;
                    if (davant && (i === 0 || i === 2)) continue;                                                        // davant, entre la 3a i la 4a columna (per on s'entra, amb els graons): res d'heura; tampoc entre la 1a i la 2a (aquí tampoc hi ha paret d'heura)
                    panells.push([xa, xb, y, yTop]);
                }
            });
            const fw = this.textures.get('cortina_heura').getSourceImage().width, fh = this.textures.get('cortina_heura').getSourceImage().height;
            panells.forEach(([xa, xb, y, yTop], n) => {
                const w = xb - xa, top = yTop + 12, h = y - 6 - top;
                if (w < 4 || h < 20) return;
                const sx = 250 / fw, sy = h / fh, cw = Math.min(fw, w / sx);                // escala (ample 250 px al joc, alçada ajustada) i ample del tros que es mostra
                const f0 = Math.max(0, (fw - cw) * [0.5, 0.15, 0.7, 0.3, 0.85][n % 5]);          // d'on comença el tros dins el dibuix
                this.add.image(xa - f0 * sx, top, 'cortina_heura').setOrigin(0, 0).setScale(sx, sy).setCrop(f0, 0, cw, fh).setAlpha(ALFA_CORT).setDepth(y + 40);
            });
        }

        // --- Murets sota les columnes (davant i darrere): les aguanten totes i van de la vora de l'escenari (x = 0) fins a la paret de la casa. Es construeixen repetint la textura
        // muret_textura (en trossos d'ample fix), tot seguit des de la vora de l'esquerra. El mur del davant no es talla: davant, entre la 3a i la 4a columna, hi ha un graó
        // que és l'entrada al jardí de la pèrgola (allà el mur no bloqueja el pas, i el tros de mur que hi ha es dibuixa per sota de l'Ineu perquè hi pugi). ---
        const MX1 = 754, TW = 182;                                                   // MX1: paret de l'esquerra de la casa; TW: ample d'un tros de la textura al joc
        const GX0 = (COLS[2] + COLS[3]) / 2 - 72, GX1 = GX0 + 144;                  // els graons: tot l'espai entre la columna 3 i la 4 (144 d'ample)
        {
            const tx = this.textures.get('muret_textura').getSourceImage();
            const sg = TW / tx.width, DH = tx.height * sg;                           // escala de la textura (1024 x 340: el cos del mur ocupa de la fila 9 a la 325)
            const PATX = 0;                                                            // la textura comença a la vora de l'escenari (la primera columna hi és just al damunt)
            const YTOP = -8 - 9 * sg;                                                  // la part de dalt del dibuix, respecte a la fila de columnes (els peus de les columnes són a +8 de la vora de dalt del mur)
            const WB = YF + 48;                                                        // la vora de baix del mur (al mateix nivell que la base de la casa)
            const opacs = (this.opacs = this.opacs || []);
            // Un tros de la textura de x = a fins a x = b, repetida. Per defecte, tota l'alçada; amb f = { r0, r1, top, h }: només les files r0..r1 de la textura, estirades a h píxels i amb la vora de dalt a y = top
            const tros = (y, a, b, prof, f, opac = true) => {
                const r0 = f ? f.r0 : 0, r1 = f ? f.r1 : tx.height, sy = f ? f.h / (r1 - r0) : sg;
                const yi = f ? f.top - r0 * sy : y + YTOP;
                const imgs = [];
                for (let k = Math.floor((a - PATX) / TW); PATX + k * TW < b; k++) {
                    const px = PATX + k * TW, x1 = Math.max(px, a), x2 = Math.min(px + TW, b);
                    if (x2 <= x1) continue;
                    const im = this.add.image(px, yi, 'muret_textura').setOrigin(0, 0).setScale(TW / tx.width, sy).setDepth(prof);
                    const c0 = (x1 - px) / TW * tx.width, cw = (x2 - x1) / TW * tx.width;
                    im.setCrop(c0, r0, cw, r1 - r0);
                    if (opac) opacs.push(im);
                    imgs.push(im);
                }
                return imgs;
            };
            this.gapMur = [];
            // Una sola línia de col·lisió, fina, a la base del darrere del mur (y + 31): per davant l'Ineu hi arriba amb els peus a la vora de baix del mur (y + 48, el nivell de la casa) i per darrere
            // hi arriba amb els peus a aquesta línia, de manera que el mur li tapa fins als genolls (el mur comença 39 px més amunt). El mur es dibuixa per darrere de l'Ineu quan és al davant
            // (y + 48 o més) i per davant quan és al darrere.
            const mur = (y, forat) => {
                const prof = y + 40;
                if (forat) { tros(y, PATX, GX0, prof); this.gapMur = tros(y, GX0, GX1, -750, null, false); tros(y, GX1, MX1, prof); }       // (el tros dels graons es dibuixa per sota de l'Ineu quan hi puja)
                else tros(y, PATX, MX1, prof);
                const col = (xa, xb) => this.colisio((xa + xb) / 2, y + 31.5, xb - xa, 2);
                if (forat) { col(0, GX0); col(GX1, MX1); } else col(0, MX1);
            };
            mur(YB, false);                                                            // darrere
            mur(YF, true);                                                             // davant
            // El graó: una llosa de pedra (pergola_grao) davant del mur, de tot l'espai entre les dues columnes. Es dibuixa per sobre del mur (que la taparia) i per sota de l'Ineu quan hi puja.
            const gI = this.add.image((GX0 + GX1) / 2, WB + 20, 'pergola_grao').setOrigin(0.5, 1).setDepth(YF + 41);
            gI.setScale((GX1 - GX0) / gI.frame.width);
            // Pujar-lo com a totes les escales del joc: més lent i un tap en pujar-hi i en passar al mur. Mentre puja (graó i mur) l'Ineu es dibuixa més amunt (elevacioIneu, a zona_base) i, en passar
            // el mur, torna a baixar: quan és a dins queda just darrere del mur, que li tapa fins als genolls.
            const PUNTS = [[WB + 26, 0], [WB + 14, 28], [WB - 4, 28], [YF + 32, 40], [YF + 24, 0]];          // [peus y, elevació]
            const alcada = y => {
                if (y >= PUNTS[0][0]) return 0;
                for (let k = 1; k < PUNTS.length; k++) if (y >= PUNTS[k][0]) return PUNTS[k][1] + (PUNTS[k - 1][1] - PUNTS[k][1]) * (y - PUNTS[k][0]) / (PUNTS[k - 1][0] - PUNTS[k][0]);
                return 0;
            };
            const elev = () => {
                const I = this.ineu;
                if (!I || !I.active) return;
                const dins = I.x > GX0 - 2 && I.x < GX1 + 2;
                this.elevacioIneu = dins ? alcada(I.y) : 0;
                const baix = dins && I.y > YF + 26;                                        // pujant (o davant): el tros de mur és per sota; ja a dins, passa a tapar-lo fins als genolls
                this.gapMur.forEach(im => im.setDepth(baix ? -750 : YF + 40));
            };
            // Com a les escales de l'església: mentre puja (o baixa) el graó i el mur va a poc a poc (velocitat limitada) i fa un tap cada pocs píxels, un per cada «graó» (el graó, el mur...)
            const Y_A = YF + 20, Y_B = WB + 30, PAS = 12;
            let lent = false, yAnt = null;
            const frenada = () => {
                const I = this.ineu;
                lent = false;
                if (!I || !I.active || !I.body || this.canviant || this.cinema || this.camCinema || !(I.x > GX0 - 2 && I.x < GX1 + 2) || I.y < Y_A || I.y > Y_B) { yAnt = null; return; }
                lent = true;
                if (yAnt !== null && Math.floor((I.y - Y_A) / PAS) !== Math.floor((yAnt - Y_A) / PAS)) Sfx.escala(I.y < yAnt);          // un tap a cada graó que es passa
                yAnt = I.y;
            };
            const limita = () => {
                const I = this.ineu;
                if (!lent || !I || !I.body) return;
                const v = I.body.velocity, m = Math.hypot(v.x, v.y);
                if (m > 110) v.scale(110 / m);                                              // (el límit s'aplica a postupdate: el moviment del joc posa la velocitat a update)
            };
            this.events.on('update', elev);
            this.events.on('update', frenada);
            this.events.on('postupdate', limita);
            this.events.once('shutdown', () => { this.events.off('update', elev); this.events.off('update', frenada); this.events.off('postupdate', limita); this.elevacioIneu = 0; });
        }

        // La Prunera Màgica, l'únic arbre: dins el jardí de la pèrgola
        const PX = 160, PY = 640, PRUNA_MIDA = 46;                 // PRUNA_MIDA: costat (px) de la icona de la pruna a les branques
        this.posar('prunera', PX, PY, { escala: 1.55, col: { w: 60, h: 26 } });   // gran i alta: destaca sobre la pèrgola
        this.add.particles(PX, PY - 220, 'espurna', {
            x: { min: -150, max: 150 }, y: { min: -110, max: 90 }, speed: { min: 4, max: 14 }, lifespan: 1800,
            scale: { start: 0.55, end: 0 }, tint: [0xffd060, 0xfff0b0], frequency: 220, alpha: { start: 0.9, end: 0 }
        }).setDepth(8001);
        [[-110, -190], [-60, -250], [0, -300], [70, -260], [120, -200], [-140, -140], [40, -170], [-20, -210], [100, -130], [-90, -100]].forEach(([dx, dy], i) => (this.fruitsPrunera = i ? this.fruitsPrunera : []).push(this.add.image(PX + dx, PY + dy, iconaObjecte(this, 'pruna_arbre')).setDisplaySize(PRUNA_MIDA, PRUNA_MIDA).setAngle(((i * 37) % 30) - 15).setDepth(PY + 1)));
        this.interactiu(PX, PY + 40, RADI_GRAN * 1.5, DIALEGS.prunera, { altura: 150, senseMirada: true }); // es pot collir la pruna des de qualsevol costat de l'arbre

        // La llosa del passadís cap al soterrani de l'Hostatgeria, entre les columnes i ben amunt perquè les columnes del sud no la tapin gens
        // La trapa funciona com la de la cripta de l'Escalinata del Raïm (90 x 46, en perspectiva, boca de pedra i llosa amb una creu): a prop del mur de darrere
        const TWD = 90, THD = 46, TX0 = Math.round((COLS[2] + COLS[3]) / 2) - TWD / 2, TY0 = YB + 66;
        const LX = TX0 + TWD / 2, LY = TY0 + THD / 2;
        this.llosaPos = { x: LX, y: LY };
        this.trapa = { x0: TX0, y0: TY0, w: TWD, h: THD, desplac: TWD + 10 };
        this.dibuixaTrapa();
        this.florLluna = this.posar('flors', LX - 66, LY + 22, { escala: 0.8 }).setVisible(false);
        this.puntLlosa = this.interactiu(LX, LY + 5, RADI_OBJECTE, DIALEGS.llosaJardi, { altura: 60, actiu: () => !Estat.flag('llosaOberta') });
        this.brilloImatge(this.llosa, { punt: this.puntLlosa, actiu: () => !Estat.flag('llosaOberta') });          // la llosa brilla fins que s'obre
        // Amb Runna (Acte 3), la llosa dels monjos s'encén: un cercle de runes de llum pàl·lida i blavosa que batega fins que s'obre
        this.brillLlosa = null;
        if (Estat.flag('runna') && !Estat.flag('llosaOberta')) this.posarBrillLlosa(LX, LY);

        // --- Gespa amb flors: només dins la pèrgola (cap flor fora). Un rectangle clar fa de gespa ben cuidada ---
        this.add.rectangle((COLS[0] + COLS[COLS.length - 1]) / 2, (YB + YF) / 2, COLS[COLS.length - 1] - COLS[0], YF - YB, 0xc4f08c, 0.14).setDepth(-1090);
        const lliure = (x, y) => Math.hypot(x - PX, (y - PY) * 1.6) > 45 && !(Math.abs(x - LX) < TWD / 2 + 14 && Math.abs(y - LY) < THD / 2 + 14);          // només queden sense flors el tronc de la Prunera i la boca de la trapa (abans, tot un cercle gran al voltant de la llosa)
        // Un jardí de debò: moltes flors, de colors diferents, escampades per tota la gespa i en mates més denses a les voreres i al peu de les columnes
        const COLORS_FLORS = [0xffffff, 0xffd6e6, 0xfff2b0, 0xd6e8ff, 0xffb0c8, 0xffcf80, 0xd0b0ff, 0xff9a9a, 0xb0f0d0];
        // Les flors no són objectes solts (en eren unes 200, amb molt de solapament: el que més pesava al mòbil): es dibuixen totes una sola vegada en una textura i el jardí en veu només una imatge
        const ESC_FLOR = (this.textures.get('flors').customData && this.textures.get('flors').customData.escala) || 1 / RES;
        const llistaFlors = [];
        const flor = (x, y, esc) => {
            const f = this.make.image({ key: 'flors', add: false }).setOrigin(0.5, 1).setScale(ESC_FLOR * esc).setPosition(x, y);
            f.setTint(COLORS_FLORS[Math.floor(rnd() * COLORS_FLORS.length)]);
            llistaFlors.push(f);
        };
        // Poques flors, només a tres llocs: al voltant de la Prunera, a l'entrada (els graons) i a la llosa. Al mig del jardí, cap. Cada zona és una el·lipse [x, y, radi x, radi y, quantes].
        [[PX, PY + 10, 140, 60, 16], [(COLS[2] + COLS[3]) / 2, YF + 6, 100, 34, 9], [LX, LY + 6, 90, 44, 9]].forEach(([zx, zy, rx, ry, n]) => {
            for (let k = 0; k < n; k++) {
                const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd());
                const x = zx + Math.cos(a) * rx * r, y = zy + Math.sin(a) * ry * r;
                if (lliure(x, y)) flor(x, y, 0.5 + rnd() * 0.5);
            }
        });
        if (llistaFlors.length) {
            const K = 2;                                                           // resolució de la textura (el doble de la del món, perquè no es vegi borrosa en apropar la càmera)
            let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
            llistaFlors.forEach(f => { const w = f.width * f.scaleX, h = f.height * f.scaleY; x0 = Math.min(x0, f.x - w / 2); x1 = Math.max(x1, f.x + w / 2); y0 = Math.min(y0, f.y - h); y1 = Math.max(y1, f.y); });
            x0 = Math.floor(x0); y0 = Math.floor(y0);
            const rt = this.add.renderTexture(x0, y0, Math.ceil((x1 - x0) * K), Math.ceil((y1 - y0) * K)).setOrigin(0).setScale(1 / K).setDepth(-800);
            llistaFlors.forEach(f => f.setPosition((f.x - x0) * K, (f.y - y0) * K).setScale(f.scaleX * K));
            rt.draw(llistaFlors);
            llistaFlors.forEach(f => f.destroy());
        }

        // L'Isílder, fora de la pèrgola, davant de la fila de columnes del davant i ben lluny de la Prunera (si la llosa ja és oberta, es queda al costat del forat)
        this.isilder = this.npc('isilder', 360, 840, DIALEGS.isilder, { zoomConversa: 1.5 });
        this.puntLlosa.cameraCossos = [this.llosa]; this.puntLlosa.senseZoom = true;          // en examinar la llosa, la càmera només es centra (sense zoom) entre l'Ineu i la llosa
        if (Estat.flag('llosaOberta')) {
            this.florLluna.setVisible(true);
            this.posarEntradaForat();
            const I = this.isilder, ix = LX - 32, iy = LY + 153;
            I.setPosition(ix, iy).setDepth(iy); I.ombra.setPosition(ix, iy);
            if (I.col) { I.col.setPosition(ix, iy - 9); I.col.body.updateFromGameObject(); }          // el cos de col·lisió també (abans es quedava on era abans de la llosa: es podia travessar)
            I.punt.x = ix; I.punt.y = iy - 10;
            this.florLluna.setPosition(LX - 30, LY + 54).setScale(1.15);
        }

        this.cartell(1500, 860, () => ({ pagines: [{ qui: 'Cartell', text: 'L\'Hostatgeria\n→ La Taverna\n← L\'Era' }] }));
        this.sortida(0, 900, 14, 130, 'ZonaEra', 'jardi');
        this.sortida(1786, 900, 14, 130, 'ZonaTaverna', 'jardi');
    }

    // Forat quadrat emmarcat amb carreus de pedra i una escala que baixa cap al nord (els graons del fons són més foscos)
    // Collir una pruna: una de les prunes daurades de la capçada (la més propera a l'Ineu) es deixa anar de la branca, cau en arc cap a les seves mans i l'arbre s'estremeix un moment;
    // al cap d'una estona en torna a créixer una altra al mateix lloc.
    collirPruna(fet) {
        const I = this.ineu, fruits = (this.fruitsPrunera || []).filter(f => !f.colli);
        if (!fruits.length) { this.agafar(fet, null, 0xffd060); return; }
        const f = fruits.sort((a, b) => Phaser.Math.Distance.Between(a.x, a.y, I.x, I.y) - Phaser.Math.Distance.Between(b.x, b.y, I.x, I.y))[0];
        const x0 = f.x, y0 = f.y, x1 = I.x, y1 = I.y - 70;
        const S0 = f.scaleX, o = this.add.image(x0, y0, f.texture.key).setScale(S0).setAngle(f.angle).setDepth(99000);
        f.colli = true; f.setAlpha(0);
        this.llum(x0, y0, 0xffd060);
        const rama = this.add.particles(x0, y0, 'espurna', { speed: { min: 20, max: 70 }, scale: { start: 0.3, end: 0 }, alpha: { start: 0.9, end: 0 }, tint: [0xffd060, 0xfff0b0], lifespan: 500, quantity: 6, emitting: false }).setDepth(99001);
        rama.explode(6); this.time.delayedCall(700, () => rama.destroy());
        this.ajupir && this.time.delayedCall(450, () => this.ajupir('ineu', null, 300));
        const T = { t: 0 };
        // 1) la pruna es deixa anar i cau una mica; 2) vola en arc fins a les mans de l'Ineu
        this.tweens.add({ targets: o, y: y0 + 24, scale: S0 * 1.4, duration: 260, ease: 'Quad.easeIn', onComplete: () => {
            const xa = o.x, ya = o.y;
            this.tweens.add({ targets: T, t: 1, duration: 760, ease: 'Sine.easeIn',
                onUpdate: () => { o.x = xa + (x1 - xa) * T.t; o.y = ya + (y1 - ya) * T.t - Math.sin(T.t * Math.PI) * 38; o.setScale(S0 * (1.4 - 0.4 * T.t)); },
                onComplete: () => { o.destroy(); this.llum(x1, y1, 0xffd060); this.esperar(300, fet); } });
        } });
        this.time.delayedCall(9000, () => { if (f.active) this.tweens.add({ targets: f, alpha: 1, duration: 900, onComplete: () => { f.colli = false; } }); });          // en torna a créixer una
    }

    // La trapa en perspectiva: la boca (marc de pedra, foscor i graons) i la llosa que la tapa, dibuixades com a trapezis (més estretes al fons que al davant) i amb el gruix de la llosa a la
    // vora de davant. Mateixa idea i mateixa mecànica que la cripta de l'Escalinata del Raïm (casa.js), però més petita i amb poc marc, perquè no toqui les columnes.
    dibuixaTrapa() {
        const { x0: X0, y0: Y0, w: W, h: H } = this.trapa, RET = 8;                              // RET: quant més estreta és la vora del fons, a cada costat
        let sem = 17; const rnd = () => { sem = (sem * 16807) % 2147483647; return sem / 2147483647; };
        const trap = (g, x0, y0, w, h, ret, ym = 0) => g.fillPoints([{ x: x0 + ret, y: y0 }, { x: x0 + w - ret, y: y0 }, { x: x0 + w, y: y0 + h }, { x: x0, y: y0 + h }], true);
        const bor = (g, x0, y0, w, h, ret) => g.strokePoints([{ x: x0 + ret, y: y0 }, { x: x0 + w - ret, y: y0 }, { x: x0 + w, y: y0 + h }, { x: x0, y: y0 + h }], true);
        const boca = this.add.graphics().setDepth(-705);
        const M = 5;                                                                              // el marc, fi
        boca.fillStyle(0x000000, 0.3); trap(boca, X0 - M - 3, Y0 - M, W + 2 * M + 6, H + 2 * M + 6, RET);
        boca.fillStyle(0x7a6c54, 1); trap(boca, X0 - M, Y0 - M, W + 2 * M, H + 2 * M, RET); boca.lineStyle(1, 0x241a10, 1); bor(boca, X0 - M, Y0 - M, W + 2 * M, H + 2 * M, RET);
        boca.fillStyle(0xa49477, 1).fillRect(X0 - M + RET, Y0 - M, W + 2 * M - 2 * RET, 2);
        boca.fillStyle(0x050302, 1); trap(boca, X0, Y0, W, H, RET);
        for (let k = 0; k < 2; k++) {                                                            // dos graons a la meitat de baix: el més proper és el més clar
            const alfa = [0.82, 0.45][k], yy = Y0 + H - 9 - k * 9, ample = W - 8 - k * 8, xx = X0 + 4 + k * 4;
            boca.fillStyle(0xa89a7e, alfa).fillRect(xx, yy, ample, 5);
            boca.fillStyle(0x2a2218, alfa).fillRect(xx, yy - 5, ample, 5);
            boca.fillStyle(0xe2d6bc, alfa * 0.5).fillRect(xx, yy, ample, 1);
        }
        boca.fillGradientStyle(0x050302, 0x050302, 0x050302, 0x050302, 1, 1, 0, 0).fillRect(X0 + RET, Y0 + H * 0.3, W - 2 * RET, H * 0.3);
        this.llumTrapa = this.add.ellipse(X0 + W / 2, Y0 + H * 0.8, W * 0.8, H * 0.34, 0x9ab8ff, 0).setBlendMode('ADD').setDepth(-704);
        // La llosa (la textura es fa una sola vegada): cara de dalt en perspectiva (trapezi), gruix a la vora de davant, bisell, panell enfonsat, una creu monàstica aplanada, anelles
        // de ferro, molsa i esquerdes. Contorns fins.
        if (!this.textures.exists('llosa_jardi')) {
            const T = 5, ll = this.make.graphics({ add: false });                                 // T: gruix de la llosa
            ll.translateCanvas(2, 2);
            ll.fillStyle(0x000000, 0.35); trap(ll, -1, 2, W + 2, H + T, RET);                      // ombra de contacte
            ll.fillStyle(0x6c5f4b, 1).fillRect(0, H, W, T);                                         // el gruix (vora de davant)
            ll.lineStyle(1, 0x241a10, 1).strokeRect(0, H, W, T);
            ll.fillStyle(0xb2a285, 1); trap(ll, 0, 0, W, H, RET); ll.lineStyle(1, 0x241a10, 1); bor(ll, 0, 0, W, H, RET);
            ll.fillStyle(0xd9ccb0, 1).fillRect(RET + 1, 1, W - 2 * RET - 2, 3);                    // bisell il·luminat (el fons)
            ll.fillStyle(0x9d8d70, 1); trap(ll, 8, 7, W - 16, H - 14, RET - 1); ll.lineStyle(0.8, 0x4a3e2c, 1); bor(ll, 8, 7, W - 16, H - 14, RET - 1);   // panell enfonsat
            for (let i = 0; i < 40; i++) ll.fillStyle(rnd() < 0.55 ? 0x4e4332 : 0xe4d8bd, 0.16 + rnd() * 0.14).fillRect(6 + rnd() * (W - 12), 4 + rnd() * (H - 8), 1 + rnd() * 3, 1 + rnd() * 1.2);
            ll.lineStyle(0.8, 0x3c3224, 0.85).strokePoints([{ x: W - 24, y: 2 }, { x: W - 28, y: 10 }, { x: W - 24, y: 16 }, { x: W - 31, y: 24 }, { x: W - 29, y: H - 2 }], false);
            const cx = W / 2, cy = H / 2 - 1;                                                       // la creu, aplanada (perspectiva)
            const creu = (dx, dy, col, a) => { ll.fillStyle(col, a); ll.fillRect(cx - 1.8 + dx, cy - 13 + dy, 3.6, 26); ll.fillRect(cx - 19 + dx, cy - 3 + dy, 38, 3.6); ll.fillTriangle(cx - 5 + dx, cy - 13 + dy, cx + 5 + dx, cy - 13 + dy, cx + dx, cy - 18 + dy); ll.fillTriangle(cx - 5 + dx, cy + 13 + dy, cx + 5 + dx, cy + 13 + dy, cx + dx, cy + 18 + dy); };
            creu(1, 1, 0xe6dac0, 0.7); creu(0, 0, 0x3a2f20, 1);
            ll.fillStyle(0x3a2f20, 1).fillEllipse(cx, cy - 1.5, 6, 4).fillStyle(0xcdbf9f, 1).fillEllipse(cx, cy - 1.5, 3, 2);
            [14, W - 14].forEach(x => { ll.fillStyle(0x2c2824, 1).fillEllipse(x, H / 2 + 5, 6, 8); ll.lineStyle(1.8, 0x26221f, 1).strokeEllipse(x, H / 2 + 5, 6, 8); });          // anelles de ferro
            for (let i = 0; i < 6; i++) ll.fillStyle(0x587a3a, 0.28 + rnd() * 0.16).fillEllipse(8 + rnd() * 18, H - 4 - rnd() * 6, 4 + rnd() * 6, 2 + rnd() * 2);                  // molsa
            ll.generateTexture('llosa_jardi', W + 4, H + T + 4);
            ll.destroy();
        }
        this.llosa = this.add.image(X0 + W / 2, Y0 + H / 2 + 2.5, 'llosa_jardi').setDepth(-700);
        if (Estat.flag('llosaOberta')) { this.llosa.setPosition(X0 + W / 2 - this.trapa.desplac, Y0 + H / 2 + 8); this.llumTrapa.setFillStyle(0x9ab8ff, 0.12); }
    }

    posarEntradaForat() {
        const { x0, y0, w, h } = this.trapa;
        this.posarTrapaEscala({ x0, x1: x0 + w, y0, yb: y0 + h, desti: 'ZonaSoterraniHost', entrada: 'entrada' });          // com a la cripta del Raïm
    }

    // El cercle de runes de la llosa quan es desperta amb Runna (el mateix dibuix que s'encén a la seva obertura, obrirLlosa): batega suaument, amb una mica de llum i espurnes.
    // Per no pesar: el cercle es dibuixa UNA sola vegada en una textura (abans, un Graphics que es retraçava a cada fotograma mentre batega)
    posarBrillLlosa(LX, LY) {
        if (!this.textures.exists('runes_llosa')) {
            const g0 = this.make.graphics({ add: false }), C = 48;
            g0.lineStyle(2.5, 0xbfe8ff, 1).strokeCircle(C, C, 44).strokeCircle(C, C, 28);
            for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; g0.lineBetween(C + Math.cos(a) * 28, C + Math.sin(a) * 28, C + Math.cos(a) * 44, C + Math.sin(a) * 44); }
            g0.fillStyle(0xbfe8ff, 0.18).fillCircle(C, C, 44);
            g0.generateTexture('runes_llosa', 96, 96); g0.destroy();
        }
        const g = this.add.image(LX, LY, 'runes_llosa').setDepth(-690).setScale(1, 0.5);          // (en perspectiva: el cercle, aplanat com la llosa)
        const llum = this.add.ellipse(LX, LY + 2, 160, 70, 0xbfe8ff, 0.2).setBlendMode(Phaser.BlendModes.ADD).setDepth(-689);
        const espurnes = this.add.particles(LX, LY, 'espurna', {
            x: { min: -30, max: 30 }, y: { min: -10, max: 10 }, speedY: { min: -40, max: -12 }, lifespan: 1500,
            scale: { start: 0.3, end: 0 }, alpha: { start: 0.8, end: 0 }, tint: [0xbfe8ff, 0xffffff], frequency: 380, blendMode: 'ADD'
        }).setDepth(-688);
        this.tweens.add({ targets: [g, llum], alpha: { from: 0.35, to: 1 }, yoyo: true, repeat: -1, duration: 1500, ease: 'Sine.easeInOut' });
        this.brillLlosa = { g, llum, espurnes };
    }

    // Un cop oberta la llosa, el cercle de runes ja no hi és (l'obertura en dibuixa el seu)
    treureBrillLlosa() {
        const b = this.brillLlosa;
        if (!b) return;
        [b.g, b.llum].forEach(o => this.tweens.killTweensOf(o));
        [b.g, b.llum, b.espurnes].forEach(o => o.destroy());
        this.brillLlosa = null;
    }

    // Falta que l'Isílder expliqui què fer amb la llosa? (amb Runna, abans de saber res de la Rosansa)
    llosaCal() {
        return !!(Estat.flag('runna') && !Estat.flag('isilderRosansa') && !Estat.flag('llosaOberta') && !Estat.flag('llavorRosansa') && !Estat.te('llavorLluna'));
    }

    encenLlosa() {
        const b = this.brillLlosa;
        if (!b) return;                                                   // un cop de llum: la llosa s'encén de debò
        this.tweens.killTweensOf(b.llum);
        b.llum.setAlpha(0.2);
        this.tweens.add({ targets: b.llum, alpha: 1, scale: 1.5, duration: 700, yoyo: true, ease: 'Sine.easeInOut', onComplete: () => this.tweens.add({ targets: [b.g, b.llum], alpha: { from: 0.35, to: 1 }, yoyo: true, repeat: -1, duration: 1500, ease: 'Sine.easeInOut' }) });
        Sfx.to(880, 1320, 0.5, 'sine', 0.1);
    }

    // Enquadra expressament l'Isílder i la llosa (per si l'Ineu hi parla des de lluny o de molt a prop: amb el zoom de conversa normal la llosa no es veuria i no se sabria de què parla),
    // amb la llosa encesa. Si l'escena ja porta la càmera (l'escena automàtica d'entrada), no fa res. fet() quan la càmera ja hi és.
    enquadrarLlosa(fet) {
        if (this.camCinema || !this.isilder || !this.isilder.active) { fet(); return; }
        const I = this.isilder, { x: LX, y: LY } = this.llosaPos;
        this.camCinemaPropia = true;
        this.enquadrar((I.x + LX) / 2, (I.y + LY) / 2 - 20, 0.95, 1000, () => { this.encenLlosa(); this.time.delayedCall(700, fet); }, 440);
    }
    deixaCamaraLlosa(fet) {
        if (this.camCinemaPropia) { this.camCinemaPropia = false; this.alliberarCamera(800); }
        fet();
    }

    escenaLlosaRunna(intents = 0) {
        if (Estat.flag('isilderRosansa') || Estat.flag('llosaOberta') || !this.isilder || !this.isilder.active || !this.sys.isActive()) return;
        const ui = this.ui();
        if (ui.dialeg || this.canviant || this.camCinema || this.ineuAlt || this.assegut || this.cinema) {           // hi ha un diàleg o una escena en marxa: espera
            if (intents < 20) this.time.delayedCall(700, () => this.escenaLlosaRunna(intents + 1));
            return;
        }
        const encenLlosa = () => this.encenLlosa();
        // L'Ineu pot entrar al jardí molt lluny (per l'Hostatgeria o la Taverna): la càmera de diàleg normal no hi cabria amb l'Isílder, i la llosa no hi és mai. Per això l'escena
        // enquadra expressament l'Isílder i la llosa (el que s'ha de veure), amb la llosa encesa, i en acabar torna a l'Ineu.
        const I = this.isilder, { x: LX, y: LY } = this.llosaPos;
        this.puntActiu = I.punt;
        this.dialegDePunt = false;
        this.enquadrar((I.x + LX) / 2, (I.y + LY) / 2 - 20, 0.95, 1000, () => {
            encenLlosa();
            this.time.delayedCall(1100, () => {
                ui.obrirDialeg(DIALEGS.isilderRunna(Estat), () => {
                    Estat.desar();
                    this.alliberarCamera(800);
                });
            });
        });
    }

    // L'Isílder porta la llavor a la llosa: la deixa caure, hi brota una flor de lluna i una columna de llum lunar baixa fins a ella; sobre la llosa
    // s'encén un cercle de runes, tot tremola i la llosa s'alça i s'aparta, i deixa veure l'escala. Tot es veu (res no s'ajup ni es deforma).
    // fet: quan l'escena ha acabat (es crida des d'una pàgina d'acció del diàleg de l'Isílder).
    obrirLlosa(fet) {
        if (this.obrintLlosa || Estat.flag('llosaOberta')) { if (fet) fet(); return; }
        this.obrintLlosa = true;
        this.treureBrillLlosa();
        const cam = this.cameras.main, I = this.isilder, { x: LX, y: LY } = this.llosaPos;
        this.tweens.killTweensOf(I);
        const espera = ms => new Promise(res => this.time.delayedCall(ms, res));
        // L'Isílder camina de debò (amb la seva animació de caminar i girant-se cap on va), a una velocitat que li fa tardar ms
        const mou = (dest, ms) => new Promise(res => this.npcVa('isilder', dest.x, dest.y, res, Phaser.Math.Distance.Between(I.x, I.y, dest.x, dest.y) / ms * 1000));
        const pols = (x, y, tints, n = 8) => { const p = this.add.particles(x, y, 'espurna', { speed: { min: 20, max: 70 }, angle: { min: 200, max: 340 }, lifespan: 600, scale: { start: 0.35, end: 0 }, tint: tints, quantity: n, emitting: false }).setDepth(99000); p.explode(n); this.time.delayedCall(800, () => p.destroy()); };
        let halo = null;
        const FX = LX - 30, FY = LY + 50;                                  // on creix la flor
        (async () => {
            // Càmera ampla i fixa, que ho deixa tot a la vista (la flor, la llosa i el camí de l'Isílder), sense el zoom de conversa que ho feia molt gran i ho tapava
            this.enquadrar(LX - 60, LY, 1.1, 900, null, 0);
            await espera(950);
            // L'Ineu se separa de la flor i de la llosa (si no, es posa al davant de l'Isílder i de la flor) i mira l'escena
            await new Promise(res => this.ineuVa(LX - 140, 880, res, 200));
            this.posarDireccio('amunt', false);
            await mou({ x: LX, y: 780 }, 1300);                            // surt per l'obertura de la pèrgola
            await mou({ x: FX + 48, y: Math.min(FY + 80, this.pergola.yf - 30) }, 1100);                   // fins al lloc de la flor (a la dreta i una mica avall, perquè no tapi ni la flor ni la llosa; a l'esquerra la flor quedaria darrere l'heura)
            // 1. La llavor surt de la mà de l'Isílder i cau a terra
            const icona = iconaObjecte(this, 'llavorLluna');
            const llavor = icona ? this.add.image(I.x - 12, I.y - 70, icona).setScale(0.28).setDepth(99000) : this.add.circle(I.x - 12, I.y - 70, 6, 0xe8e4f8, 1).setDepth(99000);
            await new Promise(res => { this.tweens.add({ targets: llavor, x: FX, y: FY + 6, duration: 700, ease: 'Quad.easeIn', onComplete: res }); });
            pols(FX, FY + 6, [0x8a6a44, 0x6a4a2c], 6);
            this.tweens.add({ targets: llavor, scale: 0, alpha: 0, delay: 200, duration: 400, onComplete: () => llavor.destroy() });
            await espera(700);
            // 2. Una tija verda creix i, al capdamunt, s'obre la flor de lluna
            const tija = this.add.graphics().setDepth(FY + 4), alt = { v: 0 };
            this.tweens.add({ targets: alt, v: 1, duration: 1100, ease: 'Sine.easeOut', onUpdate: () => {
                tija.clear().lineStyle(4, 0x3f7a30, 1).lineBetween(FX, FY + 8, FX + Math.sin(alt.v * 3) * 3, FY + 8 - alt.v * 34);
                if (alt.v > 0.4) tija.fillStyle(0x5aa83a, 1).fillEllipse(FX - 8, FY - 6, 12 * alt.v, 5).fillEllipse(FX + 8, FY - 14, 12 * alt.v, 5);
            } });
            await espera(1000);
            this.florLluna.setVisible(true).setScale(0.04).setPosition(FX, FY + 4).setAlpha(1);          // la flor s'obre
            this.tweens.add({ targets: this.florLluna, scale: 1.15, duration: 1300, ease: 'Back.easeOut' });
            halo = this.add.circle(FX, FY - 8, 46, 0xcfe4ff, 0.3).setBlendMode(Phaser.BlendModes.ADD).setDepth(FY + 3);          // un halo pàl·lid: la flor es veu bé
            this.tweens.add({ targets: halo, scale: 1.25, alpha: 0.15, yoyo: true, repeat: -1, duration: 700, ease: 'Sine.easeInOut' });
            Sfx.xiu(1.2, 0.1, 'bandpass', 900, 2200, 3); Sfx.to(880, 1320, 0.5, 'sine', 0.12);
            // 3. La llum de la lluna baixa del cel fins a la flor (una columna pàl·lida, amb borrissol de llum)
            const raig = this.add.rectangle(FX, FY - 150, 64, 340, 0xcfe4ff, 0).setBlendMode(Phaser.BlendModes.ADD).setDepth(FY + 30);
            this.tweens.add({ targets: raig, fillAlpha: 0.13, duration: 900, yoyo: false });
            const llum = this.add.particles(FX, FY - 10, 'espurna', { x: { min: -34, max: 34 }, speedY: { min: -70, max: -20 }, lifespan: 1700, scale: { start: 0.45, end: 0 }, alpha: { start: 1, end: 0 }, tint: [0xbfe8ff, 0xffffff, 0xe0d0ff], frequency: 60, blendMode: 'ADD' }).setDepth(FY + 31);
            await espera(1800);
            // 4. Sobre la llosa s'encén un cercle de runes; tot tremola
            const cercle = this.add.graphics({ x: LX, y: LY }).setDepth(-699).setScale(1, 0.5).setAlpha(0);
            cercle.lineStyle(2.5, 0xbfe8ff, 1).strokeCircle(0, 0, 44).strokeCircle(0, 0, 28);
            for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; cercle.lineBetween(Math.cos(a) * 28, Math.sin(a) * 28, Math.cos(a) * 44, Math.sin(a) * 44); }
            cercle.fillStyle(0xbfe8ff, 0.18).fillCircle(0, 0, 44);
            this.tweens.add({ targets: cercle, alpha: 1, duration: 900 });
            this.tweens.add({ targets: this.llosa, x: { from: LX - 1.5, to: LX + 1.5 }, yoyo: true, repeat: 10, duration: 60 });
            cam.shake(1100, 0.0025); Sfx.secret();
            await espera(1300);
            // 5. La llosa s'alça una mica i llisca cap a l'esquerra, i deixa veure l'escala
            this.tweens.add({ targets: this.llosa, scale: this.llosa.scale * 1.05, duration: 350, yoyo: true });
            await espera(380);
            await mou({ x: FX + 48, y: FY + 84 }, 500);
            this.tweens.add({ targets: this.llosa, x: LX - this.trapa.desplac, y: LY + 6, duration: 1300, ease: 'Sine.easeInOut' });
            cam.shake(900, 0.005); pols(LX - 20, LY, [0xa89878, 0x8a8478], 10);
            this.time.delayedCall(1300, () => { Sfx.secret(); this.tweens.add({ targets: this.llumTrapa, fillAlpha: 0.28, duration: 500, yoyo: true, onComplete: () => this.llumTrapa.setFillStyle(0x9ab8ff, 0.12) }); });
            this.tweens.add({ targets: cercle, alpha: 0, duration: 1200 });
            await espera(1800);
            raig.destroy(); if (halo) halo.destroy(); llum.stop(); this.time.delayedCall(1700, () => llum.destroy());
            await mou({ x: LX - 32, y: LY + 153 }, 700);                     // s'aparta cap a l'esquerra (a la dreta hi ha la paret de la casa)
            Estat.posaFlag('llosaOberta');
            this.posarEntradaForat();
            I.punt.x = I.x; I.punt.y = I.y - 10;
            tija.destroy();
            Estat.posaObjectiu("La llosa del jardí s'ha obert i deixa veure una escala cap al soterrani de l'Hostatgeria.");
            Estat.desar();
            await new Promise(res => this.alliberarCamera(800, res));
            this.obrintLlosa = false;
            if (fet) fet();
        })();
    }
}
