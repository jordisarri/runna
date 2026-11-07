/**
 * EL BOSC DEL PI DELS TRES CANTS
 * Un bosc molt llarg, amb un camí pel mig i enemics. S'hi entra pel nord, des de Sant Antoni (a l'est); el camí baixa i gira cap a l'oest fins al
 * Dolmen (sortida a l'extrem oest, a la mateixa alçada que l'entrada est del Dolmen). A mig camí hi ha una clariana amb el Pi dels Tres Cants.
 *
 * El pi barra el pas amb les seves branques baixes i només deixa passar qui li porta els tres cants (Aurora, Vespres i Miracle) amb la tarota:
 * cada cant fa reviure una de les tres branques (la imatge del pi canvia amb un fade). Només es pot fer des de l'est (Sant Antoni): des del Dolmen, el camí s'acaba contra les branques
 * i l'Ineu entén que cal anar per l'altre costat. El premi, a banda d'obrir el camí, és la història del pi: d'on van sortir els tres cants.
 */
const PI3 = { A: 2800, H: 1000, camiY: 600, camiH: 140, vx: 2490, barX: 1150, piX: 1500, piY: 545, plX: 1500, plY: 598 };
// Cada cant que sona davant el pi en fa reviure una branca: la imatge canvia amb un fade, sense llums ni efectes.
// Estats: 0 pi sec · 1 només la branca esquerra viva · 2 també la dreta · 3 tot l'arbre viu.
const PI3_ESTATS = ['pi_tres_cants_mort', 'pi_tres_cants_esq', 'pi_tres_cants_dos', 'pi_tres_cants'];
const PI3_CANTS = { aurora: { flag: 'piAurora' }, pedres: { flag: 'piPedres' }, miracle: { flag: 'piMiracle' } };      // el flag que posa cada cant en sonar davant el pi
const PI3_FLAGS_LLISTA = Object.values(PI3_CANTS).map(c => c.flag);
const PI3_ALCADA = 400;      // alçada del pi a l'escena, igual per a tots els estats (el que canvia és la imatge, no la mida)
const PI3_ZOOM_MIN = 0.9;     // el zoom més allunyat en llegir la placa o tocar un cant (sense el HUD de dalt ja no cal allunyar tant)
const PI3_FADE = 2200;       // durada del canvi d'una imatge a la següent

class ZonaBoscPi extends ZonaBase {
    constructor() {
        super('ZonaBoscPi', {
            nom: 'Bosc del Pi dels Tres Cants',
            amplada: PI3.A,
            alcada: PI3.H,
            pins: { pi: 0.4, pinyer: 0.2 },
            colorFons: '#1a2c16',              // prou clar perquè no compti com a interior (camins amb vora difuminada)
            entrades: {
                santantoni: { x: PI3.vx, y: 200, dir: 'avall' },
                dolmen:     { x: 70, y: PI3.camiY, dir: 'dreta' }
            }
        });
    }

    construir() {
        const { A, H, vx, camiY, camiH, barX, piX, piY } = PI3;
        const y0 = camiY - camiH / 2, y1 = camiY + camiH / 2;          // vora de dalt i de baix del camí (530 i 670)
        const x0c = vx - camiH / 2, x1c = vx + camiH / 2;              // el tram vertical del camí, a l'est
        this.terra('herba', 0, 0, A, H, -1100);
        this.terra('cami', x0c, 0, camiH, y1);                         // baixa des de Sant Antoni
        this.terra('cami', 0, y0, x1c, camiH);                         // i gira cap a l'oest, fins al Dolmen

        // La clariana, al mig: herba més clara i lluminosa
        const cl = this.add.graphics().setDepth(-1090);
        cl.fillStyle(0x9ad86a, 0.22).fillEllipse(piX, 640, 1000, 640);
        cl.fillStyle(0xc8f08a, 0.16).fillEllipse(piX, 620, 640, 420);

        // Dues files de bosc, netes i regulars (com al Camí de la Desaparició): una al nord i una al sud, lluny del camí perquè es vegi bé
        // (les capçades pugen uns 250 px per sobre dels peus). Entre les dues, una franja d'herba amb el camí al mig.
        const N = 400, S = 940, PAS = 150;
        const senseCapcadaNord = x => Math.abs(x - barX) < 300 || Math.abs(x - piX) < 330;   // ni a prop del pas ni darrere del pi: no han de tapar res
        const senseCapcada = x => Math.abs(x - barX) < 300 || Math.abs(x - piX) < 430;        // al sud: ni a prop del pas ni davant del pi (allà, arbres baixos: vegeu sota)
        this.muralla(0, N, x0c - 60, N, PAS, 'arbre', true, senseCapcadaNord);         // nord, fins al tram vertical
        this.muralla(x0c - 60, 0, x0c - 60, N, PAS);                                   // a l'oest del tram vertical
        this.muralla(x1c + 60, 0, x1c + 60, S, PAS);                                   // a l'est del tram vertical, fins a baix
        this.muralla(0, S, x1c + 60, S, PAS, 'arbre', false, senseCapcada);            // sud
        // Davant del pi, la fila del sud és d'arbres baixos (el gràfic «arbre», no els pins alts), perquè no tapin la placa
        for (let x = piX - 420; x <= piX + 420; x += PAS) if (Math.abs(x - barX) >= 300) this.posar('arbre', x, S, { escala: 0.85, col: { w: 34, h: 16, fix: true } });
        this.colisio((x1c + 60 + A) / 2, H / 2, A - x1c - 60, H);                      // darrere de la fila de l'est
        this.colisio(x1c / 2, (S + H) / 2, x1c + 60, H - S);                           // darrere de la fila de sud
        // Segona fila al nord, desplaçada mig pas, per donar fondària sense atapeir (darrere la primera: no s'hi pot arribar)
        for (let x = 110; x < x0c - 140; x += 2 * PAS) if (Math.abs(x + PAS / 2 - piX) > 330) this.posar('arbre', x + PAS / 2, N - 120, { col: { w: 34, h: 16 } });
        for (let x = 40; x < x0c - 140; x += 2 * PAS) if (Math.abs(x - piX) > 330) this.posar('arbre', x, N - 235, { col: { w: 34, h: 16 } });

        // Decoració de les dues franges d'herba (nord i sud del camí): uns quants arbres, pins, roques i flors, ben repartits i sense tapar el camí,
        // el pas, la clariana del pi ni els enemics. Les posicions són fixes (no canvien cada vegada).
        {
            let ll = 91;
            const r2 = () => { ll = (ll * 16807) % 2147483647; return ll / 2147483647; };
            const enemics = [[2450, 330], [2150, 640], [700, 620], [350, 580], [2300, 760], [2450, 520], [550, 760]];
            const lliure = (x, y, marge) => !enemics.some(([ex, ey]) => Math.hypot(ex - x, ey - y) < marge) && Math.abs(x - barX) > 330
                && !(Math.abs(x - piX) < 480) && x > 140 && x < x0c - 130;
            const franges = [[y0 - 60, y0 - 10, 130], [y1 + 20, S - 120, 130]];        // [de y, fins a y, cada quants píxels]
            franges.forEach(([ya, yb]) => {
                for (let x = 190; x < x0c - 140; x += 150) {
                    const px = x + (r2() - 0.5) * 80, py = ya + r2() * (yb - ya), t = r2();
                    if (!lliure(px, py, 150)) continue;
                    if (t < 0.34) this.posar('arbre', px, py, { escala: 0.8 + r2() * 0.3, col: { w: 34, h: 16, fix: true } });        // arbres baixos
                    else if (t < 0.5) this.posar('roca', px, py, { escala: 0.7 + r2() * 0.6, col: { w: 46, h: 16 } });
                    else if (t < 0.62) this.posar('arbre', px, py, { escala: 0.55, col: { w: 22, h: 12, fix: true } });               // arbustos
                }
            });
            for (let i = 0; i < 70; i++) {                                                   // flors i mates: sense col·lisió
                const px = 120 + r2() * (x0c - 260), py = r2() < 0.5 ? y0 - 70 + r2() * 60 : y1 + 15 + r2() * (S - y1 - 130);
                if (!lliure(px, py, 80)) continue;
                this.posar('flors', px, py, { fonsY: -800, escala: 0.4 + r2() * 0.3 }).setTint([0xffb0d0, 0xffe080, 0xd0b0ff, 0xffffff][i % 4]);
            }
        }

        // El pas del pi: la franja d'herba s'estreny fins al camí entre dues files de roques baixes (sense capçades que tapin res); allà hi ha la barrera
        const pasDalt = camiY - camiH / 2 - 30, pasBaix = camiY + camiH / 2 + 30;      // 500 i 700
        this.muralla(barX, N, barX, pasDalt, 70, 'roca', false);                       // de la fila del nord fins a la barrera...
        this.muralla(barX, pasBaix, barX, S, 70, 'roca', false);                       // ...i de la barrera fins a la fila del sud: tot tancat
        for (let x = barX - 270; x <= barX + 270; x += 80) { this.posar('roca', x, N + 14); this.posar('roca', x, S - 6); }   // roques on abans hi havia arbres: es veu on s'acaba el camí

        this.cameraFollowOffsetY = -150;           // la càmera mira una mica més amunt: així es veu la part de dalt del pi des del camí

        // El Pi dels Tres Cants, al mig de la clariana: sec, o amb tantes branques vives com cants hagin sonat (tot viu un cop obert)
        this.estatPi = Estat.flag('piObert') ? 3 : PI3_FLAGS_LLISTA.filter(f => Estat.flag(f)).length;
        this.pi = this.posar(PI3_ESTATS[this.estatPi], piX, piY, { col: { w: 80, h: 34 } });
        this.pi.setScale(PI3_ALCADA / this.pi.height);

        // Les branques baixes que barren el camí (a l'oest de la clariana), mentre el pi no s'ha obert
        if (!Estat.flag('piObert')) this.posarBarrera();

        // Enemics: només fora de la clariana, a banda i banda del pi
        [[2450, 330], [2150, 640], [700, 620], [350, 580]].forEach(([x, y]) => this.enemic('escolopendra', x, y));
        [[2300, 760], [2450, 520], [550, 760]].forEach(([x, y]) => this.enemic('bolet', x, y));
        this.boira(2200, 640, 360, 80, 0.8);
        this.boira(500, 640, 360, 80, 0.8);

        // La placa de pedra, davant el pi: explica què cal fer. Un cop llegida (i amb la tarota), s'obre la tarota per tocar els cants; la tarota només
        // funciona aquí, a prop de la placa. Des de l'oest de la barrera, només s'hi pot llegir què passa.
        this.placa = this.posar('placa_pi', PI3.plX, PI3.plY, { col: { w: 50, h: 16 }, opac: true });
        const puntPlaca = this.interactiu(PI3.plX, PI3.plY + 10, 150, () => Estat.flag('piObert') ? DIALEGS.piTresCants(Estat) : DIALEGS.piPlaca(Estat), {
            altura: this.placa.displayHeight + 20,
            actiu: () => this.ineu.x > barX + 40,
            enTancar: () => {
                if (Estat.flag('piObert') || !Estat.te('flauta')) return;
                Estat.posaFlag('flauta_pi');
                this.obrirMusica();                                               // just en acabar el text: l'Ineu no es pot moure entremig
            }
        });
        Object.defineProperty(puntPlaca, 'cameraCossos', { get: () => [this.pi] });         // en llegir la placa, el pi es veu sencer (la càmera s'allunya si cal)
        puntPlaca.centrarCamera = true;                                                     // i la càmera panegi suau fins que el pi (i l'Ineu) queden centrats entre el HUD i el quadre de text
        this.interactiu(barX, camiY, 190, () => DIALEGS.piOest(Estat), { altura: 150, actiu: () => !Estat.flag('piObert') && this.ineu.x < barX + 40 });
        // (la tarota no es pot tocar lliurement a prop del pi: només s'obre en llegir la placa, quan se'n tanca el diàleg)

        this.sortida(0, y0, 14, camiH, 'ZonaDolmen', 'bosc');
        this.sortida(x0c, 0, camiH, 14, 'ZonaSantAntoni', 'bosc');
    }

    // Una paret d'arrels del pi, ben tupida, que creua el camí: seca mentre el pi dorm. Quan el pi es desperta, reviscola (passa a 'pi_arrels', amb molsa i fulles)
    // i s'enfonsa a terra per baix, traient pols i terra
    posarBarrera() {
        const { barX, camiY } = PI3;
        this.barrera = this.posar('pi_arrels_mortes', barX, camiY + 150, { fonsY: camiY + 200 });      // seca, com el pi adormit
        this.colBarrera = this.colisio(barX, camiY, 110, 220);
    }

    // Les arrels reviscolen (s'afegeix la imatge viva per sobre, que apareix poc a poc) i, tot seguit, s'enfonsen a terra per la part de baix: el que
    // queda per sobre del terra es va retallant, mentre surt pols i alguns trossos de terra. Quan gairebé no hi són, el camí queda lliure.
    despertarBarrera() {
        const sec = this.barrera;
        if (!sec) return;
        const base = sec.y, alt = sec.displayHeight;
        const viva = this.add.image(sec.x, base, 'pi_arrels').setOrigin(0.5, 1).setDepth(sec.depth + 0.1).setAlpha(0);
        viva.setScale(sec.displayWidth / viva.width);                      // la mateixa amplada que la seca
        this.tweens.add({ targets: viva, alpha: 1, duration: 2200, ease: 'Sine.easeInOut' });
        this.time.delayedCall(2500, () => {
            const pols = this.add.particles(sec.x, base - 6, 'boira', {
                x: { min: -62, max: 62 }, speedY: { min: -75, max: -25 }, speedX: { min: -28, max: 28 }, lifespan: 1500,
                scale: { start: 0.22, end: 0.95 }, alpha: { start: 0.65, end: 0 }, tint: [0x8a6a40, 0xb09060, 0x6a5030], frequency: 30
            }).setDepth(base + 260);
            const terra = this.add.particles(sec.x, base - 8, 'espurna', {
                x: { min: -55, max: 55 }, speed: { min: 50, max: 140 }, angle: { min: 235, max: 305 }, gravityY: 320, lifespan: 1000,
                scale: { start: 0.2, end: 0 }, alpha: { start: 1, end: 0.2 }, tint: [0x6a4a2a, 0x8a6a40, 0x4e3a20], quantity: 2, frequency: 55
            }).setDepth(base + 261);
            this.cameras.main.shake(1700, 0.003);
            Sfx.secret();
            const p = { v: 0 };
            this.tweens.add({
                targets: p, v: 1, duration: 1900, ease: 'Sine.easeIn',
                onUpdate: () => {
                    [sec, viva].forEach(im => {
                        if (!im.active) return;
                        im.y = base + p.v * alt;                                    // s'enfonsa...
                        im.setCrop(0, 0, im.width, Math.max(1, im.height * (1 - p.v)));   // ...i el que ja és sota terra desapareix
                    });
                    if (p.v > 0.65 && this.colBarrera) { this.obstacles.remove(this.colBarrera, true, true); this.colBarrera = null; }
                },
                onComplete: () => {
                    sec.destroy(); viva.destroy(); this.barrera = null;
                    pols.stop(); terra.stop();
                    this.time.delayedCall(1600, () => { pols.destroy(); terra.destroy(); });
                }
            });
        });
    }

    // Mentre es toca la tarota davant el pi, la càmera s'allunya i enquadra el pi sencer (i l'Ineu), per damunt del pergamí; en acabar, s'hi queda
    // una estona perquè es vegi com s'il·lumina la branca (o com es desperta el pi) i llavors torna a l'Ineu
    ineuFlauta(on) {
        super.ineuFlauta(on);
        if (on) this.enquadrarPi();
        else this.time.delayedCall(120, () => this.desenquadrarPi());
    }

    // El pi es posa al MIG de l'espai lliure (entre el HUD de dalt i el pergamí de la tarota, o el quadre de text quan parla), amb un paneig suau: abans quedava enganxat a dalt
    // i amb molt de buit a sota. Amb la tarota oberta es centra només el pi (l'Ineu surt gran en primer pla); amb el quadre de text, el pi i l'Ineu.
    enquadrarPi(ambTexte) {
        if ((this.camCinema && !this.camPi) || !this.pi || !this.pi.active || this.ineu.x < PI3.barX + 40) return;      // (si ja som al pla del pi, només es reenquadra)
        const H = ALT - ALT_HUD, ui = this.ui();
        const reserva = ambTexte ? (ui.alcadaCaixaDialeg || 360) + 40 : 435 * Math.min(1, (ALT - 440) / 435);      // el pergamí de la tarota (més petit en pantalles baixes) o el quadre de text
        const dalt = this.pi.y - this.pi.displayHeight - 20, baix = ambTexte ? Math.max(this.ineu.y, PI3.plY) + 30 : PI3.plY + 20;
        const top = TOP_HUD + 10, lliure = H - reserva - top - 10;
        const z = Math.min(ZOOM_CAMERA, lliure / (baix - dalt));
        this.camPi = true;
        // enquadrar() posa el punt a la meitat de [0, H - reserva]; es compensa el HUD perquè el centre sigui el de [TOP_HUD, H - reserva]
        this.enquadrar(PI3.piX, (dalt + baix) / 2 - top / (2 * Math.max(PI3_ZOOM_MIN, z)), Math.max(PI3_ZOOM_MIN, z), 1000, null, reserva);
    }

    desenquadrarPi() {
        if (!this.camPi) return;
        const resta = (this.camPiFins || 0) - this.time.now;
        if (resta === Infinity) return;                                  // el pi s'està despertant: es lliura quan acabi (obrirPi)
        if (resta > 0) { this.time.delayedCall(resta, () => this.desenquadrarPi()); return; }
        this.camPi = false;
        this.alliberarCamera(900);
    }

    // El pi passa a l'estat n (vegeu PI3_ESTATS): la imatge nova apareix poc a poc per sobre de l'anterior i, quan és del tot visible, l'anterior desapareix
    canviarPi(n, ms = PI3_FADE) {
        const antic = this.pi;
        if (!antic || !antic.active || this.estatPi === n) return;
        this.estatPi = n;
        const nou = this.add.image(antic.x, antic.y, PI3_ESTATS[n]).setOrigin(0.5, 1).setDepth(antic.depth + 0.1).setAlpha(0);
        nou.setScale(PI3_ALCADA / nou.height);                              // la mateixa alçada que l'anterior
        this.pi = nou;
        this.tweens.add({ targets: nou, alpha: 1, duration: ms, ease: 'Sine.easeInOut', onComplete: () => { nou.setDepth(antic.depth); antic.destroy(); } });
    }

    teEfecteMelodia(nom) {
        if (!PI3_CANTS[nom] || this.ineu.x < PI3.barX + 40 || Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, PI3.plX, PI3.plY) > 260) return false;
        return !Estat.flag(PI3_CANTS[nom].flag);                                     // la branca encara no canta
    }

    // Un dels tres cants sona davant el pi: reviu una branca (primer l'esquerra, després la dreta). Amb el tercer, reviu tot l'arbre i el pi s'obre.
    enMelodia(nom) {
        if (!PI3_CANTS[nom]) return false;
        if (this.ineu.x < PI3.barX + 40 || Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, PI3.plX, PI3.plY) > 260) return false;
        const flag = PI3_CANTS[nom].flag;
        const pensa = (text, ms = 0) => this.time.delayedCall(ms, () => this.ui().obrirDialeg({ pagines: [{ qui: 'Ineu', text }] }));
        if (Estat.flag(flag)) { pensa("(Aquesta branca ja canta. Li cal un altre cant.)"); return true; }
        Estat.posaFlag(flag);
        this.camPiFins = this.time.now + PI3_FADE + 800;                 // la càmera es queda al pi mentre reviu la branca
        const n = PI3_FLAGS_LLISTA.filter(f => Estat.flag(f)).length;
        if (n < 3) {                                                     // es deixa veure com reviu la branca i després ho diu l'Ineu
            this.canviarPi(n);
            pensa(n === 1 ? "(Una branca ha respost al cant! Les altres dues encara dormen.)" : "(Ja en canten dues. Només en falta una.)", PI3_FADE + 300);
            Estat.desar();
        }
        else this.obrirPi();
        return true;
    }

    // Els tres cants han sonat: tot l'arbre reviu, les branques s'aixequen, el pi explica d'on vénen els cants i el camí queda lliure
    obrirPi() {
        if (Estat.flag('piObert')) return;
        Estat.posaFlag('piObert');
        this.camPiFins = Infinity;                                        // la càmera es queda al pi mentre es desperta i parla
        Sfx.secret();
        this.cameras.main.shake(500, 0.004);
        this.canviarPi(3);
        this.despertarBarrera();
        this.time.delayedCall(5400, () => {
            this.ui().obrirDialeg(DIALEGS.piHistoria(Estat), () => {
                Estat.posaObjectiu(PROGRES.pista(Estat));
                Estat.desar();
                this.camPiFins = 0;
                this.desenquadrarPi();
            });
            this.enquadrarPi(true);                                         // quan parla, el pi queda centrat a l'espai que deixa el quadre de text
        });
    }
}

Object.assign(DIALEGS, {
    // Des de l'oest (el Dolmen): el camí s'acaba contra les branques
    piOest: E => ({
        pagines: [
            { qui: 'Ineu', text: "(Unes branques molt baixes, i gruixudes com troncs, baixen fins a terra i barren el camí. Per aquí no hi ha manera de passar.)" },
            { qui: 'Ineu', text: "(Totes miren cap a llevant, cap on neix l'alba, i al fons es veu una clariana amb un pi enorme. Si el pi escolta algú, ha de ser pel cantó d'allà. Hauré d'arribar-hi per l'altre costat: per Sant Antoni, potser.)" }
        ],
        enAcabar: () => { if (!E.flag('piVist')) E.posaFlag('piVist'); }
    }),

    // La placa de pedra davant el pi: què cal fer
    piPlaca: E => {
        const saps = ['cantAurora', 'cantPedres', 'cantMiracle'].filter(f => E.flag(f)).length;
        const n = ['piAurora', 'piPedres', 'piMiracle'].filter(f => E.flag(f)).length;
        const pagines = [
            ...(E.flag('flauta_pi') ? [] : [{ qui: 'Ineu', text: "(Davant el pi, una pedra de fita baixa, gastada i coberta de molsa. Hi ha gravat un pi de tres soques i, a sota, tres notes.)" }]),
            { qui: 'La placa', text: "Tres branques té el vell pi,\ntres cants li cal sentir.\nUn cant per cada branca:\nsols així s'obrirà el camí." },
            saps < 3
                ? { qui: 'Ineu', text: "(Un cant per cada branca... Em falta aprendre'n algun amb la Pianista abans de poder-ho provar.)" }
                : E.te('flauta')
                    ? { qui: 'Ineu', text: n > 0 ? "(" + n + " de les tres branques ja brillen. Falta que cantin les altres.)" : "(Tres cants, tres branques. Ho provaré amb la tarota, aquí mateix.)" }
                    : { qui: 'Ineu', text: "(Necessitaré la tarota per respondre-li.)" }
        ];
        return { pagines };
    },

    // Quan el pi ja és despert: només respira
    piTresCants: E => {
        if (E.flag('piObert')) return { pagines: [{ qui: 'Ineu', text: "(El pi es mou una mica, com si respirés. Sembla content.)" }] };
        return { pagines: [{ qui: 'Ineu', text: "(Un pi vell, amb tres soques que s'obren com tres braços. Sembla que escolta.)" }] };
    },

    // El premi del pi: la història dels tres cants
    piHistoria: E => ({
        pagines: [
            { qui: 'El Pi', text: "Fa molt de temps que espero això: tres cants davant meu, i tots tres de la mateixa boca." },
            { qui: 'El Pi', text: "No t'espantis, petit. Els pins parlem poc, però ens ho recordem tot. Cada agulla meva és un record." },
            { qui: 'El Pi', text: "Abans de la boira, els ocells dormien en els pins d'aquest bosc. A l'alba cantaven tots alhora, i aquell cant feia viure la terra: el Cant del Miracle." },
            { qui: 'El Pi', text: "Un home sol, l'Ocellaire, el va voler per a ell. Va tancar els ocells en una gàbia i se'n va endur el cant. I amb el cant se'n va anar l'alba, i va començar la boira." },
            { qui: 'El Pi', text: "Hi havia dos cants més, germans d'aquell: el de l'Aurora, que fa fugir la boira, i el de Vespres, que la terra escolta. Van tenir por que també se'ls emportés." },
            { qui: 'El Pi', text: "Van venir a amagar-se aquí, a les meves branques: un a cada una. Jo els he guardat muts, com un nen guarda un secret, fins avui." },
            { qui: 'El Pi', text: "El Cortiner va ser qui els va posar notes. Va arribar un vespre, cansat, i es va asseure sota meu. Em va escoltar i els va escriure en tres sons: un, dos i tres. Els de la tarota. Cada nota és una de les meves branques." },
            { qui: 'El Pi', text: "Només deixo passar qui porta els tres cants, perquè només qui els porta els pot tornar als ocells." },
            { qui: 'El Pi', text: "Quan la boira se'n vagi del tot, que els qui guarden els ocells robats vinguin aquí. Aquest bosc és casa seva. Ja ho saben, de cor." },
            { qui: 'Ineu', text: "(Les arrels s'han enfonsat a terra com un respir llarg. El camí d'aquí al Dolmen ha quedat lliure.)" }
        ]
    })
});

// Les arrels del pi, en vertical: una paret tupida de rels gruixudes que s'entrellacen, amb molsa i alguna fulla (provisional de 'pi_arrels')
function pintarArrelsPi(ctx, W, H) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    let sd = 19; const r = () => (sd = sd * 16807 % 2147483647) / 2147483647;
    ombraTerra(ctx, W / 2, H - 8, W * 0.45, 10);
    const rel = (x0, x1, amp, gruix, col) => {
        const p = [];
        for (let k = 0; k <= 30; k++) { const t = k / 30; p.push([x0 + (x1 - x0) * t + Math.sin(t * 6 + x0) * amp * (1 - t * 0.4), H - 14 - (H - 40) * t]); }
        ctx.strokeStyle = CONTORN; ctx.lineWidth = gruix + 5; ctx.beginPath(); p.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
        ctx.strokeStyle = col; ctx.lineWidth = gruix; ctx.beginPath(); p.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,210,160,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); p.forEach(([x, y], i) => i ? ctx.lineTo(x - gruix * 0.25, y) : ctx.moveTo(x - gruix * 0.25, y)); ctx.stroke();
    };
    const cols = ['#6a3a1e', '#7a4426', '#5a2e18', '#8a5230'];
    for (let k = 0; k < 9; k++) rel(W * (0.12 + r() * 0.76), W * (0.1 + r() * 0.8), W * (0.05 + r() * 0.1), 11 + r() * 9, cols[k % 4]);
    for (let k = 0; k < 14; k++) { const x = W * (0.12 + r() * 0.76), y = H * (0.12 + r() * 0.8); ctx.fillStyle = k % 2 ? '#6a9a3a' : '#4e7e2e'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(x, y, 11, 5, r() * 3, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    ctx.fillStyle = '#7a4426'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
    [[0.1, 0.18], [0.9, 0.18]].forEach(([fx, l]) => { ctx.beginPath(); ctx.ellipse(W * fx, H - 8, W * l, 9, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
}

// La placa de pedra davant el pi: una fita petita i baixa, vista de cara (només se'n veu la cara de davant): un bloc ample de pedra amb un pi
// gravat (una soca que es bifurca en tres cap amunt) i, a sota, tres notes (cercles amb un, dos i tres punts). No és una làpida: sense creu,
// sense cap arrodonit i sense lletres.
function pintarPlacaPi(ctx, W, H) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ombraTerra(ctx, W / 2, H - 5, W * 0.46, 7);
    ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
    // Llosa de base, plana
    ctx.fillStyle = '#7a7466'; ctx.beginPath(); ctx.roundRect(W * 0.04, H * 0.84, W * 0.92, H * 0.13, 3); ctx.fill(); ctx.stroke();
    // Bloc de pedra: rectangle ample amb la vora de dalt recta
    const g = ctx.createLinearGradient(0, H * 0.1, 0, H * 0.86); g.addColorStop(0, '#c4bca8'); g.addColorStop(1, '#8e8774');
    ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(W * 0.1, H * 0.1, W * 0.8, H * 0.76, 3); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.fillRect(W * 0.14, H * 0.13, W * 0.72, 3);
    ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fillRect(W * 0.78, H * 0.16, W * 0.1, H * 0.66);
    // Relleu gravat: un pi amb una sola soca de baix que es bifurca en tres cap amunt, cada una amb la seva copa
    ctx.strokeStyle = '#4e4636'; ctx.lineWidth = 3;
    const bx = W / 2, base = H * 0.52, fork = H * 0.4;
    ctx.beginPath(); ctx.moveTo(bx, base); ctx.lineTo(bx, fork); ctx.stroke();                               // la soca comuna
    [[bx - W * 0.2, H * 0.22], [bx, H * 0.17], [bx + W * 0.2, H * 0.22]].forEach(([tx, ty]) => {
        ctx.beginPath(); ctx.moveTo(bx, fork); ctx.lineTo(tx, ty + 5); ctx.stroke();                         // cada soca s'obre cap amunt
        ctx.beginPath(); ctx.ellipse(tx, ty, 7, 4.5, 0, 0, Math.PI * 2); ctx.stroke();                       // i porta la seva copa
    });
    // Tres notes a sota
    [0.3, 0.5, 0.7].forEach((fx, i) => {
        const x = W * fx, y = H * 0.7;
        ctx.strokeStyle = '#4e4636'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#4e4636';
        for (let k = 0; k <= i; k++) { ctx.beginPath(); ctx.arc(x + (k - i / 2) * 4, y, 1.5, 0, Math.PI * 2); ctx.fill(); }
    });
    // Molsa i herba
    ctx.fillStyle = '#5f8a3a'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 1.8;
    [[0.16, 0.12, 10, 4], [0.86, 0.86, 9, 4], [0.14, 0.86, 11, 5]].forEach(([fx, fy, a2, b2]) => { ctx.beginPath(); ctx.ellipse(W * fx, H * fy, a2, b2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
}

// El Pi dels Tres Cants (provisional): com el Pi de les Tres Branques, el tronc es parteix en tres soques des de la mateixa base; cada una puja pel seu
// compte i porta la seva copa de núvols d'agulles (la de l'esquerra, la del mig i la de la dreta)
function pintarPiTresCants(ctx, W, H) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    let sd = 77; const r = () => (sd = sd * 16807 % 2147483647) / 2147483647;
    ombraTerra(ctx, W / 2, H - 8, W * 0.3, 11);
    // Una soca: de la base (bx, by) al cim (tx, ty), amb amplades w0 -> w1 i una lleugera corba
    const soca = (bx, by, tx, ty, w0, w1, corba) => {
        const punts = [];
        for (let k = 0; k <= 24; k++) { const t = k / 24; punts.push({ x: bx + (tx - bx) * t + Math.sin(t * Math.PI) * corba, y: by + (ty - by) * t, w: w0 + (w1 - w0) * t }); }
        const g = ctx.createLinearGradient(Math.min(bx, tx) - w0, 0, Math.max(bx, tx) + w0, 0); g.addColorStop(0, '#c26a3e'); g.addColorStop(0.5, '#9a4a2a'); g.addColorStop(1, '#5e2718');
        ctx.fillStyle = g; ctx.strokeStyle = CONTORN; ctx.lineWidth = 4.5;
        ctx.beginPath();
        punts.forEach((q, i) => i ? ctx.lineTo(q.x - q.w, q.y) : ctx.moveTo(q.x - q.w, q.y));
        for (let k = punts.length - 1; k >= 0; k--) ctx.lineTo(punts[k].x + punts[k].w, punts[k].y);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(58,22,10,0.6)'; ctx.lineWidth = 1.8;
        for (let k = 0; k < 40; k++) { const q = punts[Math.floor(r() * 24)], x = q.x + (r() - 0.5) * q.w * 1.6; ctx.beginPath(); ctx.moveTo(x - 3, q.y); ctx.quadraticCurveTo(x, q.y + 8, x + 3, q.y + 16); ctx.stroke(); }
    };
    const by = H - 10, ty = H * 0.22, cx = W * 0.5;
    // Base comuna, ampla: les tres soques surten d'una mateixa soca baixa
    soca(cx, by, cx, H * 0.78, W * 0.17, W * 0.12, 0);
    soca(cx, H * 0.8, cx, H * 0.1, W * 0.075, W * 0.045, 0);                              // la del mig, la més alta
    soca(cx - W * 0.03, H * 0.8, W * 0.2, ty, W * 0.07, W * 0.04, -W * 0.05);              // l'esquerra, que s'allunya
    soca(cx + W * 0.03, H * 0.8, W * 0.8, ty, W * 0.07, W * 0.04, W * 0.05);               // la dreta
    // Copes: un grup de núvols d'agulles al cim de cada soca
    const nuv = [
        [[0.2, 0.2, 0.17, 0.06], [0.1, 0.27, 0.1, 0.045], [0.3, 0.27, 0.1, 0.045], [0.2, 0.33, 0.14, 0.045]],
        [[0.8, 0.2, 0.17, 0.06], [0.7, 0.27, 0.1, 0.045], [0.9, 0.27, 0.1, 0.045], [0.8, 0.33, 0.14, 0.045]],
        [[0.5, 0.09, 0.19, 0.06], [0.39, 0.16, 0.12, 0.05], [0.61, 0.16, 0.12, 0.05], [0.5, 0.23, 0.16, 0.05]]
    ];
    nuv.forEach(grup => grup.forEach(([nx, ny, rx, ry]) => {
        const x = W * nx, y = H * ny, a = W * rx, bb = H * ry;
        ctx.fillStyle = '#2c5646'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.ellipse(x, y + bb * 0.25, a, bb, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#4a7c64'; ctx.beginPath(); ctx.ellipse(x - a * 0.05, y - bb * 0.1, a * 0.86, bb * 0.72, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#6d9c7e'; ctx.beginPath(); ctx.ellipse(x - a * 0.18, y - bb * 0.38, a * 0.5, bb * 0.34, 0, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = 1.5;
        for (let k = 0; k < 36; k++) { const px = x + (r() - 0.5) * a * 1.8, py = y + (r() - 0.45) * bb * 1.5; ctx.strokeStyle = k % 3 ? '#1f4034' : '#86b090'; ctx.beginPath(); ctx.moveTo(px - 4, py - 2); ctx.lineTo(px + 4, py + 3); ctx.stroke(); }
    }));
    // Arrels que s'obren a la base
    ctx.fillStyle = '#7a3a22'; ctx.strokeStyle = CONTORN; ctx.lineWidth = 3;
    [[-1, 0.2], [1, 0.22], [-1, 0.1], [1, 0.12]].forEach(([sg, l]) => { ctx.beginPath(); ctx.moveTo(cx + sg * W * 0.12, H - 34); ctx.quadraticCurveTo(cx + sg * W * l * 1.2, H - 14, cx + sg * W * l * 1.6, H - 2); ctx.quadraticCurveTo(cx + sg * W * l * 0.9, H - 22, cx + sg * W * 0.05, H - 6); ctx.closePath(); ctx.fill(); ctx.stroke(); });
}
