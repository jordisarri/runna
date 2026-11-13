/**
 * LA CASA GRAN (masmorra): l'Escalinata i una petita cripta.
 *   Entrada: només la secreta, des d'El Celler (el ping-pong; darrere la roda de carruatge, amb Runna): passadís amb escolopendres
 *            i un esbarzer negre, sala del tresor (la cambra secreta dels monjos) i una porta cap a l'Escalinata. La reixa del porxo
 *            (plaça) és tancada des de fora; només es pot obrir per dins, com a drecera de tornada.
 *   Escalinata: l'Home del Raïm, amb el cap girat. Amb la Maneta d'en Georgi (és a la caseta, a la Caseta) es fa girar el volant de
 *               ferro de la base: tres voltes i el cap et mira de cara; llavors l'estàtua cobra vida (BOSS). Derrotada, s'obre la trapa.
 *   Cripta: la Clau de ferro (i un paper: la llum de Runna segella la tomba esquerdada del Cementiri),
 *           que obre la Porta de les Gírgoles (a sota de la Taverna, no pas des d'aquí).
 */

// ---------------- DIÀLEGS ----------------

Object.assign(DIALEGS, {
    homeRaimInt: E => {
        if (E.flag('raimDerrotat')) {
            return { pagines: [] };
        }
        return {
            pagines: [
                { qui: 'Ineu', text: "L'estàtua té el cap completament girat d'esquena, mirant la paret. A la base del pedestal hi ha un volant de ferro amb engranatges, però li falta la maneta per poder-lo fer girar." }
            ],
            enAcabar: () => E.posaFlag('raimVolantVist')
        };
    },

    raimDesperta: {
        pagines: [
            { qui: 'Home del Raïm', text: "Cinquanta anys de pedra... Qui gosa despertar el guardià del silenci?" },
            { qui: 'Ineu', text: "S'ha mogut! La pedra ha cobrat vida!" },
            { qui: 'Home del Raïm', text: "Mentre jo alci aquesta maça, cap mortal posarà els peus a la cripta!" }
        ]
    },

    raimSenseArma: {
        pagines: [
            { qui: 'Ineu', text: "Si això desperta el guardià de pedra, no podré resistir la seva maça amb les mans nues. Caldrà tornar amb una arma." }
        ]
    },

    raimDerrotat: {
        pagines: [
            { qui: 'Home del Raïm', text: "El pes dels segles... s'esmicola... Baixeu, doncs... i afronteu el que reposa a la foscor." },
        ]
    },

    trapaCripta: E => ({
        pagines: []
    }),

    cofreCripta: E => E.flag('relTretes') ? {
        pagines: []
    } : {
        pagines: [
            { avis: "Has obtingut la CLAU DE FERRO.", obj: 'clau_ferro' }
        ],
        enAcabar: () => {
            E.dona('clau_ferro'); E.posaFlag('relTretes'); E.posaFlag('clauFerro');
            E.posaObjectiu(E.flag('tombaSegellada') ? "Troba la Porta de les Gírgoles, al Pati del Celler."
                                                   : "Porta la Clau de ferro al Pare Alcoví, a la Biblioteca: la Crònica deu dir què fer amb la tomba dels monjos.");
        }
    },

    // El Georgi de la Caseta (a l'oest del Til·ler): diu on té la maneta, dins la caseta aixecada del jardí
    georgiCaseta: E => {
        if (E.te('maneta') || E.flag('maneta')) {
            return { pagines: [{ qui: 'Georgi', text: "Fes-ne bon ús, monjo! I vigila, que les coses de pedra no sempre s'estan quietes." }] };
        }
        if (!E.flag('raimVolantVist')) {
            return {
                pagines: [
                    { qui: 'Georgi', text: "Ei, monjo! Sóc en Georgi de la Caseta. Conec cada drecera del Miracle, i les eines, encara millor." },
                    { qui: 'Ineu', text: "M'anirà bé saber-ho. De moment només passava a saludar." },
                    { qui: 'Georgi', text: "Doncs ja saps on trobar-me si algun dia et cal un cop de mà." }
                ]
            };
        }
        if (E.flag('georgiManeta')) {
            return { pagines: [{ qui: 'Georgi', text: "La caseta és aquí al costat: puja per l'escala. Al cofre de les meves joguines, la maneta és a sota. Que no se't cansi el braç!" }] };
        }
        return {
            pagines: [
                { qui: 'Georgi', text: "Ei, monjo! Sóc en Georgi de la Caseta. Conec cada drecera del Miracle, i les eines, encara millor." },
                { qui: 'Ineu', text: "Georgi, em diuen que en saps, d'eines. Hi ha un volant de ferro vell que no té maneta, i sense no hi ha manera de fer-lo girar." },
                { qui: 'Georgi', text: "Una maneta! En tinc una de ferro, de les bones. Encaixa en rodes de pou, en premses... i, si cal, en el volant d'una estàtua tossuda." },
                { qui: 'Georgi', text: "Però la vaig amagar dalt de la meva caseta, la que està aixecada sobre pals, al cofre de les meves joguines. Ningú no s'atreveix a tocar-les, perquè jo no deixo que ningú hi posi les mans. MAI! MAI!" },
                { qui: 'Georgi', text: "Però tu vens per una cosa seriosa, així que per aquesta vegada et deixo. Puja per l'escala, que la porta no té clau, i agafa-la." }
            ],
            enAcabar: () => {
                E.posaFlag('georgiManeta');
                E.posaObjectiu("La maneta d\'en Georgi és al cofre de les joguines, dalt de la caseta aixecada sobre pals.");
            }
        };
    }
});

// On és l'Home del Raïm a l'Escalinata (peu del pedestal) i quant més gran és que el dibuix original del volant
const RAIM = { x: 700, y: 560, f: 1.35 };

// ---------------- BOSS: L'HOME DEL RAÏM VIU ----------------
ENEMICS.raim = {
    tex: 'home_raim_desperta', vida: 24, vel: 320, mal: 1, radi: 38, cos: [66, 30], ombra: 0.65,
    arma: 'runna',                            // només Runna li fa mal
    // El punt feble és el cap (al 27% del dibuix des de dalt), i només quan ha caigut de morros després d'una envestida:
    // llavors el cap queda a terra, a l'abast (sense cap abast extra cap amunt)
    cap: { y: 0.27, r: 42, nomesCansat: true, senseAbast: true },
    copsPausa: 3,                             // a terra, com a molt tres cops: al tercer s'aixeca
    robust: true, barra: true,
    perill: e => e.estat === 'carrega',
    // Trossos de marbre i pols que cauen del guardià
    trossos(z, x, y, n = 7) {
        const p = z.add.particles(x, y - 30, 'espurna', {
            speed: { min: 50, max: 150 }, angle: { min: 200, max: 340 }, gravityY: 420, lifespan: 600, scale: { start: 0.9, end: 0.2 },
            tint: [0xd8d2c0, 0xb9b3a2, 0x9a7acf], quantity: n, emitting: false
        }).setDepth(99990);
        p.explode(n);
        z.time.delayedCall(800, () => p.destroy());
    },
    // On queda el cap quan és a terra (el sprite gira pels peus)
    capATerra(z, e) { return z.puntsCop(e)[0]; },
    ia(z, e, ara) {
        const jo = z.ineu.body.center, c = e.spr.body.center;
        const dist = Phaser.Math.Distance.Between(c.x, c.y, jo.x, jo.y);
        const fase2 = e.vida <= 9;
        const estatAbans = e.estat;
        if (!e.proxCarrega) e.proxCarrega = ara + 2200;
        const cap = Math.atan2(jo.y - c.y, jo.x - c.x);
        if (e.estat === 'apunta') {
            e.spr.body.setVelocity(0);
            if (ara > e.fins) { e.estat = 'carrega'; e.fins = ara + (fase2 ? 460 : 400); e.spr.clearTint(); e.spr.body.setVelocity(Math.cos(e.ang) * this.vel, Math.sin(e.ang) * this.vel); }
        } else if (e.estat === 'carrega') {
            const bl = e.spr.body.blocked;
            if (ara > e.fins || bl.left || bl.right || bl.up || bl.down) {
                e.spr.body.setVelocity(0);
                // A la fase 2, de vegades encadena una segona envestida abans de caure
                if (fase2 && !e.segona && Math.random() < 0.6) { e.segona = true; e.estat = 'apunta'; e.fins = ara + 380; e.ang = cap; e.spr.setTint(0xff8080); }
                else {
                    e.segona = false;
                    e.estat = 'cansat'; e.fins = ara + (fase2 ? 1700 : 2300); e.copsRebuts = 0;
                    e.cauDreta = Math.cos(e.ang) >= 0;
                    e.proxCarrega = ara + (fase2 ? 1500 : 2600);
                }
            }
        } else if (e.estat === 'cansat') {                 // de morros a terra
            e.spr.body.setVelocity(0);
            if (ara > e.fins) { e.estat = 'aixeca'; e.fins = ara + 550; }
        } else if (e.estat === 'aixeca') {
            e.spr.body.setVelocity(0);
            if (ara > e.fins) e.estat = 'camina';
        } else {
            e.estat = 'camina';
            const v = dist > 120 ? (fase2 ? 80 : 56) : 0;
            e.spr.body.setVelocity(Math.cos(cap) * v, Math.sin(cap) * v);
            e.spr.setFlipX(Math.cos(cap) < 0);
            if (ara > e.proxCarrega && dist < 480) {
                e.estat = 'apunta'; e.fins = ara + (fase2 ? 420 : 650); e.ang = cap;
                e.spr.setTint(0xff8080);
            }
        }
        // Cos de pedra (gira pels peus): camina balancejant-se, es tira enrere en apuntar, s'inclina en carregar,
        // cau de morros quan s'ha cansat i es redreça a poc a poc
        const s = e.estat === 'cansat' || e.estat === 'aixeca' ? (e.cauDreta ? 1 : -1) : Math.cos(e.estat === 'apunta' || e.estat === 'carrega' ? e.ang : cap) < 0 ? -1 : 1;
        let rot, lerp = 0.25;
        if (e.estat === 'apunta') rot = -s * 0.2 + Math.sin(ara / 28) * 0.025;
        else if (e.estat === 'carrega') rot = s * 0.22;
        else if (e.estat === 'cansat') { rot = s * 1.28 + Math.sin(ara / 160) * 0.02; lerp = 0.35; }
        else if (e.estat === 'aixeca') { rot = 0; lerp = 0.12; }
        else rot = Math.sin(ara / (fase2 ? 190 : 260)) * 0.06;
        e.spr.rotation = Phaser.Math.Linear(e.spr.rotation, rot, lerp);
        if (e.estat !== estatAbans) {
            if (e.estat === 'apunta') { z.esquitxar(c.x, c.y - 60); Sfx.carrega(); }
            else if (e.estat === 'carrega') this.trossos(z, c.x, c.y, 5);
            else if (e.estat === 'cansat') {
                // Quan el cap toca a terra: cop sec, pols i, si l'Ineu hi era a sota, li fa mal
                z.time.delayedCall(220, () => {
                    if (e.mort) return;
                    const q = this.capATerra(z, e);
                    z.cameras.main.shake(260, 0.008); Sfx.cop(true);
                    this.trossos(z, q.x, q.y + 30, 14);
                    const jo2 = z.ineu.body.center;
                    if (Phaser.Math.Distance.Between(q.x, q.y + 30, jo2.x, jo2.y) < 70) z.ferIneu(1, { x: q.x, y: q.y });
                });
            } else if (e.estat === 'aixeca') this.trossos(z, c.x, c.y, 6);
        }
    },
    alDerrotar(z, e) { z.raimDerrotat(e); }
};

// ---------------- BASE DE LES SALES ----------------
class ZonaCasaBase extends ZonaBase {
    // Sala amb terra de marbre, murs i una obertura de 120 al mig de la paret de sota
    sala(amp, alt, portaX, tint = 0xcfc2b0) {
        this.terra('rajola', 130, 80, amp - 260, alt - 80, -1100).setTint(tint);
        const murs = this.add.graphics().setDepth(-1000);
        murs.fillStyle(0x2a1f18, 1).fillRect(90, 0, 40, alt).fillRect(amp - 130, 0, 40, alt);
        murs.fillStyle(0x3a2c22, 1).fillRect(130, 0, amp - 260, 90);
        this.colisio(50, alt / 2, 80, alt);
        this.colisio(amp - 50, alt / 2, 80, alt);
        this.colisio(amp / 2, 80, amp - 260, 160);
        this.colisio((portaX - 60) / 2, alt - 10, portaX - 60, 20);
        this.colisio((portaX + 60 + amp) / 2, alt - 10, amp - portaX - 60, 20);
        this.add.rectangle(amp / 2, alt / 2, amp, alt, 0xffd38a, 0.05).setDepth(80000);
    }

    // Sala de pedra amb els gràfics de dibuixos_casa.js: paret del fons (textura), murs laterals, vora fosca al terra i parets de col·lisió.
    // forats: [[x0, x1], ...] trams de la paret del fons que queden oberts (per a una porta).
    salaPedra(amp, alt, portaX, o = {}) {
        this.terra('rajola', 130, 80, amp - 260, alt - 80, -1100).setTint(o.tint || 0x8a7a68);
        this.add.image(130, 0, o.paret).setOrigin(0).setScale(1 / RES).setDepth(-995);
        this.add.image(90, 0, 'mur_ermita').setOrigin(0).setScale(1 / RES).setDepth(-995);
        this.add.image(amp - 130, 0, 'mur_ermita').setOrigin(0).setScale(1 / RES).setDepth(-995).setFlipX(true);
        const vora = this.add.graphics().setDepth(-1040);
        vora.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.45, 0, 0.45, 0).fillRect(130, 170, 110, alt - 170);
        vora.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0.45, 0, 0.45).fillRect(amp - 240, 170, 110, alt - 170);
        this.colisio(50, alt / 2, 80, alt);
        this.colisio(amp - 50, alt / 2, 80, alt);
        let x = 130;
        [...(o.forats || []), [amp - 130, amp - 130]].forEach(([a, b]) => { if (a > x) this.colisio((x + a) / 2, 85, a - x, 170); x = Math.max(x, b); });
        this.colisio((portaX - 60) / 2, alt - 10, portaX - 60, 20);
        this.colisio((portaX + 60 + amp) / 2, alt - 10, amp - portaX - 60, 20);
        this.add.rectangle(amp / 2, alt / 2, amp, alt, 0xffd38a, 0.05).setDepth(80000);
    }

    porta(x, y, w, h, color = 0x4a2c16) {
        return this.add.rectangle(x, y, w, h, color).setStrokeStyle(4, 0x2a1a0c).setDepth(y - 60);
    }

    // Aplic de ferro clavat a la paret: placa, volutes que aguanten el platet, espelma i flama. (x, y) és el platet.
    aplic(x, y, i = 0, fons = -930) {
        const ap = this.add.graphics().setDepth(fons);
        ap.fillStyle(0xffc060, 0.08).fillCircle(x, y - 34, 46).fillStyle(0xffc060, 0.08).fillCircle(x, y - 34, 26);   // claror a la paret
        ap.fillStyle(0x000000, 0.3).fillRoundedRect(x - 7, y - 4, 16, 34, 4);
        ap.fillStyle(0x1e1a18, 1).fillRoundedRect(x - 8, y - 6, 16, 34, 4);
        ap.fillStyle(0x4a4440, 1).fillCircle(x, y + 3, 2.2).fillCircle(x, y + 19, 2.2);
        [-1, 1].forEach(s => {
            ap.lineStyle(3.5, 0x1e1a18, 1).beginPath(); ap.arc(x + s * 8, y + 6, 8, Math.PI * 1.5, Math.PI * 0.5, s < 0); ap.strokePath();
        });
        ap.fillStyle(0x1e1a18, 1).fillEllipse(x, y - 3, 26, 7);
        ap.fillStyle(0x5a524c, 1).fillEllipse(x, y - 4.5, 22, 3);
        ap.fillStyle(0xeee2c4, 1).fillRect(x - 4, y - 30, 8, 26);
        ap.fillStyle(0xc8b896, 1).fillRect(x + 1, y - 30, 3, 26);
        ap.fillStyle(0xeee2c4, 1).fillEllipse(x - 4, y - 18, 3, 9);                                                         // regalim de cera
        ap.lineStyle(1.5, 0x2a1608, 1).lineBetween(x, y - 30, x, y - 34);
        const flama = this.add.graphics({ x, y: y - 34 }).setDepth(fons + 1);
        flama.fillStyle(0xffb040, 0.35).fillCircle(0, -3, 9);
        flama.fillStyle(0xffc860, 1).fillEllipse(0, -5, 8, 15);
        flama.fillStyle(0xfff4c0, 1).fillEllipse(0, -3, 4, 8);
        this.tweens.add({ targets: flama, alpha: 0.75, scaleY: 0.88, yoyo: true, repeat: -1, duration: 350 + i * 90 });
    }

    espelmes(llista) {
        llista.forEach(([x, y], i) => {
            const e = this.posar('espelma', x, y, { fonsY: y });
            this.tweens.add({ targets: e, alpha: 0.7, yoyo: true, repeat: -1, duration: 350 + i * 90 });
        });
    }
}

// ---------------- L'ESCALINATA ----------------
class ZonaCasaGranInt extends ZonaCasaBase {
    constructor() {
        super('ZonaCasaGranInt', {
            nom: 'La Casa Gran · Escalinata',
            amplada: 1400,
            alcada: 1000,
            colorFons: '#120c08',
            entrades: {
                porxo:   { x: 700,  y: 930, dir: 'amunt' },
                secreta: { x: 170,  y: 740, dir: 'dreta' },
                cripta:  { x: 700,  y: 700, dir: 'avall' }
            }
        });
    }

    construir() {
        this.sala(1400, 1000, 700, 0xb5a58a);

        // Escala de pedra a l'esquerra, volta i balcó al fons, mur amb porta a la dreta, lloses al mig (a partir de les fotos de l'Home del Raïm real)
        this.add.image(130, 0, 'escalinata_fons').setOrigin(0).setScale(1 / RES).setDepth(-990);
        this.colisio(290, 400, 320, 480);
        this.colisio(1112, 400, 320, 480);
        this.colisio(450, 400, 24, 430);
        this.colisio(950, 400, 24, 430);
        // Un raig de claror que cau de la volta sobre l'estàtua
        this.add.graphics().setDepth(-950).fillStyle(0xfff0c0, 0.07).fillPoints([{ x: 620, y: 0 }, { x: 800, y: 0 }, { x: 900, y: 600 }, { x: 540, y: 600 }], true);

        // Porta camuflada (esquerra): torna a la sala del tresor
        this.porta(115, 740, 20, 110, 0x6a4a2c);
        this.sortida(116, 690, 14, 100, 'ZonaCasaTresor', 'escala');

        this.reixaPorxo();
        // Paret de baix, a banda i banda de la reixa: un sòcol de pedra fosca que tanca la sala (abans s'hi podia ficar l'Ineu)
        const sc = this.add.graphics().setDepth(1003);
        [[130, 478], [792, 478]].forEach(([x, w]) => {
            sc.fillStyle(0x2a1f18, 1).fillRect(x, 950, w, 50);
            sc.fillStyle(0x6a5a48, 1).fillRect(x, 946, w, 8).lineStyle(2, 0x1c1610, 1).strokeRect(x, 946, w, 8);
            sc.lineStyle(1.5, 0x1c1610, 0.8);
            for (let k = x + 60; k < x + w; k += 60) sc.lineBetween(k, 954, k, 1000);
            this.colisio(x + w / 2, 973, w, 54);
        });

        this.puzleRaim();
    }

    // La reixa del porxo vista per dins, a baix de tot: una reixa de ferro entre dos brancals de pedra, amb la claror de la plaça
    // que entra entre els barrots i una barra de fusta travessada. Aixecant la barra s'obre, i des de llavors s'hi entra i se surt
    reixaPorxo() {
        const oberta = Estat.flag('reixaObertaDins') || Estat.flag('ocellaireVencut');
        const X0 = 630, X1 = 770, Y0 = 930, Y1 = 1000;
        // la claror de fora: darrere dels barrots i escampada pel terra cap amunt
        const llum = this.add.graphics().setDepth(-940).setBlendMode('ADD');
        llum.fillStyle(0xfff0c0, 0.06).fillPoints([{ x: X0 + 10, y: Y1 }, { x: X1 - 10, y: Y1 }, { x: X1 + 90, y: Y0 - 230 }, { x: X0 - 90, y: Y0 - 230 }], true);
        llum.fillStyle(0xfff0c0, 0.06).fillPoints([{ x: X0 + 30, y: Y1 }, { x: X1 - 30, y: Y1 }, { x: X1 + 30, y: Y0 - 150 }, { x: X0 - 30, y: Y0 - 150 }], true);
        this.tweens.add({ targets: llum, alpha: 0.6, yoyo: true, repeat: -1, duration: 1800, ease: 'Sine.easeInOut' });
        const g = this.add.graphics().setDepth(Y1);
        g.fillStyle(0xf4e2b0, 1).fillRect(X0, Y0, X1 - X0, Y1 - Y0);                                     // la plaça, a fora, de dia
        g.fillStyle(0xd8c090, 1).fillRect(X0, Y1 - 22, X1 - X0, 22);
        [[X0 - 22, 22], [X1, 22]].forEach(([x, w]) => {                                               // brancals de pedra
            g.fillStyle(0xb5a58a, 1).fillRect(x, Y0 - 16, w, Y1 - Y0 + 16).lineStyle(2.5, 0x1c1610, 1).strokeRect(x, Y0 - 16, w, Y1 - Y0 + 16);
            g.fillStyle(0xffffff, 0.2).fillRect(x + 3, Y0 - 14, 4, Y1 - Y0 + 12);
        });
        g.fillStyle(0xcdbd9e, 1).fillRect(X0 - 26, Y0 - 24, X1 - X0 + 52, 12).lineStyle(2.5, 0x1c1610, 1).strokeRect(X0 - 26, Y0 - 24, X1 - X0 + 52, 12);   // llinda
        this.barrots = this.add.graphics().setDepth(Y1 + 1);
        this.barrots.lineStyle(5, 0x2a2622, 1);
        for (let x = X0 + 10; x <= X1 - 10; x += 15) this.barrots.lineBetween(x, Y0, x, Y1);
        this.barrots.lineStyle(4, 0x2a2622, 1).lineBetween(X0, Y0 + 8, X1, Y0 + 8).lineBetween(X0, Y1 - 10, X1, Y1 - 10);
        this.barrots.lineStyle(1.5, 0x8a8278, 0.8);
        for (let x = X0 + 9; x <= X1 - 10; x += 15) this.barrots.lineBetween(x, Y0 + 2, x, Y1 - 2);
        // la barra de fusta amb abraçadores de ferro, travessada als brancals
        this.barra = this.add.graphics().setDepth(Y1 + 2);
        this.barra.fillStyle(0x6a4424, 1).fillRect(X0 - 30, Y0 + 26, X1 - X0 + 60, 14).lineStyle(2.5, 0x1c1006, 1).strokeRect(X0 - 30, Y0 + 26, X1 - X0 + 60, 14);
        this.barra.fillStyle(0x9a6a3a, 1).fillRect(X0 - 28, Y0 + 28, X1 - X0 + 56, 3);
        [X0 - 12, X1 + 4].forEach(x => this.barra.fillStyle(0x3a3a40, 1).fillRect(x, Y0 + 22, 8, 22).lineStyle(1.5, 0x111114, 1).strokeRect(x, Y0 + 22, 8, 22));
        const obrir = () => {
            this.barra.setVisible(false);
            this.barrots.setAlpha(0.35);
            this.sortida(X0 + 10, Y1 - 14, X1 - X0 - 20, 14, 'ZonaCasaGran', 'porxo');
        };
        if (oberta) { obrir(); return; }
        this.colReixa = this.colisio(700, Y0 - 2, X1 - X0 + 44, 52);         // des de la llinda: l'Ineu no es fica dins la reixa
        // El punt és a la mateixa reixa i el «!» hi surt a sobre, als barrots (no damunt de l'Ineu, que s'hi posa al davant)
        this.interactiu(700, Y0 + 30, 96, DIALEGS.reixaDins, {
            altura: -40, actiu: () => !Estat.flag('reixaObertaDins'),
            enTancar: () => {
                this.obstacles.remove(this.colReixa, true, true);
                this.tweens.add({ targets: this.barra, y: -18, alpha: 0, duration: 500, ease: 'Sine.easeIn', onComplete: obrir });
            }
        });
    }

    // ---- L'Home del Raïm i el volant de ferro ----
    // El cap de pedra comença girat del tot (d'esquena). Amb la maneta d'en Georgi, el volant de ferro del pedestal (amb engranatges) li
    // fa girar el cap un pas cada volta: d'esquena, de tres quarts, de perfil i, a la tercera volta, de cara: el guardià es desperta.
    puzleRaim() {
        this.raimPas = 0;      // 0 d'esquena, 1 tres quarts, 2 perfil, 3 de cara (CAPS_RAIM)
        const derrotat = Estat.flag('raimDerrotat'), { x: RX, y: RY } = RAIM;
        const desperta = Estat.flag('raimDesperta');

        // L'estàtua (o, si ja ha estat vençuda, un munt de pedres)
        this.estatua = null;
        if (derrotat) {
            this.runes();
        } else {
            this.estatua = this.posar(this.texRaim(), RX, RY);
            this.colEstatua = this.colisio(RX, RY - 10, 62, 24);
        }
        // Mirar l'estàtua només fa falta si encara no tens la maneta: et diu on és
        this.interactiu(RX, RY + 10, 90, DIALEGS.homeRaimInt, { altura: 250, actiu: () => !Estat.flag('raimDesperta') && !Estat.te('maneta') });

        // El volant de ferro amb engranatges, encastat a la cara del pedestal: amb la maneta, cada volta gira el cap un quart
        if (!derrotat) this.dibuixarVolant(RX, Math.round(RY - this.estatua.displayHeight * 0.17));
        this.interactiu(RX, RY + 32, 90, E => {
            this.raimPas = Math.min(3, this.raimPas + 1);
            this.girarVolant();
            this.girarEstatua();
            this.volDespertar = this.raimPas === 3 && this.teArma();
            return { pagines: [] };
        }, { altura: 70, actiu: () => !Estat.flag('raimDesperta') && Estat.te('maneta'),
             enTancar: () => { if (this.volDespertar) { this.volDespertar = false; this.time.delayedCall(500, () => this.ui().obrirDialeg(DIALEGS.raimDesperta, () => this.despertarRaim())); } } });

        // Trapa de la cripta, a sota de l'escalinata: una llosa amb una creu gravada; vençut el guardià, es fa a un costat i
        // deixa veure l'escala que baixa
        this.dibuixarTrapa(derrotat);
        this.interactiu(700, 730, RADI_OBJECTE, DIALEGS.trapaCripta, {
            altura: 70, actiu: () => Estat.flag('raimDerrotat'),
            enTancar: () => this.canviarZona('ZonaCasaCripta', 'porta')
        });

        // Si el guardià ja estava despert (has sortit i tornat), segueix aquí
        if (desperta && !derrotat) this.despertarRaim(true);
    }

    // La boca de la cripta (marc de pedra, foscor i graons) i la llosa que la tapa. oberta: la llosa ja és apartada
    dibuixarTrapa(oberta) {
        const X0 = 640, Y0 = 668, W = 120, H = 58;
        const boca = this.add.graphics().setDepth(-958);
        boca.fillStyle(0x8a7a5e, 1).fillRect(X0 - 8, Y0 - 8, W + 16, H + 16).lineStyle(2.5, 0x2a2018, 1).strokeRect(X0 - 8, Y0 - 8, W + 16, H + 16);
        boca.fillStyle(0x050302, 1).fillRect(X0, Y0, W, H);
        [[0, 0.62], [14, 0.42], [26, 0.26], [36, 0.14]].forEach(([dy, a], k) => {               // graons que s'enfonsen a la foscor
            boca.fillStyle(0x9a8a70, a).fillRect(X0 + 6 + k * 6, Y0 + 6 + dy, W - 12 - k * 12, 8);
        });
        this.llumTrapa = this.add.ellipse(X0 + W / 2, Y0 + H / 2, W, H, 0x9ab8ff, 0).setBlendMode('ADD').setDepth(-957);
        // La llosa
        const ll = this.add.graphics().setDepth(-956);
        ll.fillStyle(0xb5a58a, 1).fillRect(0, 0, W, H).lineStyle(3, 0x2a2018, 1).strokeRect(0, 0, W, H);
        ll.fillStyle(0xffffff, 0.18).fillRect(3, 3, W - 6, 5);
        ll.lineStyle(4, 0x6a5a44, 1).lineBetween(W / 2, 10, W / 2, H - 10).lineBetween(W / 2 - 18, 22, W / 2 + 18, 22);     // creu gravada
        ll.fillStyle(0x4a4038, 1).fillCircle(10, H / 2, 4).fillCircle(W - 10, H / 2, 4);                                   // anelles
        ll.setPosition(X0, Y0);
        this.llosaTrapa = ll;
        if (oberta) { ll.setPosition(X0 + W + 14, Y0 + 6); this.llumTrapa.setFillStyle(0x9ab8ff, 0.12); }
    }
    // Vençut el guardià: la càmera mira la llosa, la terra tremola i la llosa llisca a un costat; de sota en surt claror freda i pols
    obrirTrapa(fet) {
        const cam = this.cameras.main, X0 = 640, Y0 = 668, W = 120;
        cam.stopFollow();
        cam.pan(700, 650, 700, 'Sine.easeInOut');
        this.time.delayedCall(750, () => {
            cam.shake(900, 0.005); Sfx.porta();
            this.tweens.add({ targets: this.llosaTrapa, x: X0 + W + 14, y: Y0 + 6, duration: 1300, ease: 'Sine.easeInOut', onComplete: () => {
                Sfx.secret();
                this.tweens.add({ targets: this.llumTrapa, fillAlpha: 0.28, duration: 500, yoyo: true, onComplete: () => this.llumTrapa.setFillStyle(0x9ab8ff, 0.12) });
                this.boira(700, 690, 100, 30, 0.6);
                this.time.delayedCall(700, () => { cam.startFollow(this.ineu, true, 0.1, 0.1); if (fet) fet(); });
            } });
            const pols = this.add.particles(700, 700, 'espurna', { x: { min: -60, max: 60 }, speedY: { min: -60, max: -20 }, lifespan: 900, scale: { start: 0.5, end: 0 },
                tint: [0xd8d2c0, 0xb9b3a2], frequency: 40, alpha: { start: 0.7, end: 0 } }).setDepth(99990);
            this.time.delayedCall(1300, () => pols.destroy());
        });
    }

    // Volant de ferro amb radis i un engranatge petit que hi engrana (el que mou el cap); la maneta s'hi veu quan la tens
    dibuixarVolant(x, y) {
        const roda = (g, r, dents, gruix) => {
            const pts = [];
            for (let k = 0; k < dents * 2; k++) { const a = k * Math.PI / dents, rr = k % 2 ? r : r + gruix; pts.push({ x: Math.cos(a) * rr, y: Math.sin(a) * rr }); }
            g.fillStyle(0x3a3a42, 1).fillPoints(pts, true).lineStyle(2, 0x111114, 1).strokePoints(pts, true);
            g.fillStyle(0x5a5a64, 1).fillCircle(0, 0, r * 0.55).fillStyle(0x1a1a1e, 1).fillCircle(0, 0, r * 0.18);
        };
        this.engranatge = this.add.graphics().setPosition(x + 24 * RAIM.f, y - 16 * RAIM.f).setScale(RAIM.f).setDepth(RAIM.y + 1);
        roda(this.engranatge, 11, 8, 4);
        const v = this.add.graphics().setPosition(x, y).setScale(RAIM.f).setDepth(RAIM.y + 2);
        v.lineStyle(7, 0x111114, 1).strokeCircle(0, 0, 21).lineStyle(4, 0x6a6a74, 1).strokeCircle(0, 0, 21);
        for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; v.lineStyle(4, 0x4a4a54, 1).lineBetween(0, 0, Math.cos(a) * 20, Math.sin(a) * 20); }
        v.fillStyle(0x8a7a40, 1).fillCircle(0, 0, 6).lineStyle(2, 0x111114, 1).strokeCircle(0, 0, 6);
        this.volant = v;
        // La maneta (d'en Georgi), clavada a la vora del volant
        this.manetaVolant = this.add.graphics().setScale(RAIM.f).setDepth(RAIM.y + 3);
        this.manetaVolant.lineStyle(5, 0x111114, 1).lineBetween(0, 0, 0, -12).lineStyle(3, 0x8a6a3a, 1).lineBetween(0, 0, 0, -12);
        this.manetaVolant.fillStyle(0x8a6a3a, 1).fillRoundedRect(-3, -20, 6, 10, 2);
        this.manetaVolant.setVisible(Estat.te('maneta'));
        this.posarManeta();
    }
    posarManeta() {
        if (!this.manetaVolant || !this.volant) return;
        const a = this.volant.rotation;
        this.manetaVolant.setPosition(this.volant.x + Math.cos(a) * 18 * RAIM.f, this.volant.y + Math.sin(a) * 18 * RAIM.f);
    }

    // Una volta del volant: gira (i l'engranatge, al revés), grinyola i sacseja
    girarVolant() {
        if (!this.volant) return;
        if (this.manetaVolant) this.manetaVolant.setVisible(true);
        Sfx.porta();
        this.cameras.main.shake(260, 0.003);
        this.tweens.add({ targets: this.volant, rotation: this.volant.rotation + Math.PI * 2, duration: 900, ease: 'Sine.easeInOut', onUpdate: () => this.posarManeta() });
        this.tweens.add({ targets: this.engranatge, rotation: this.engranatge.rotation - Math.PI * 3.8, duration: 900, ease: 'Sine.easeInOut' });
        if (this.raimPas === 3) this.time.delayedCall(950, () => this.llum(RAIM.x, RAIM.y - 190, 0xffe08a));
    }

    runes() {
        [[-30, -2], [30, 2], [0, -12]].forEach(([dx, dy]) => this.posar('roca', RAIM.x + dx, RAIM.y + dy, { col: { w: 50, h: 20 } }));
        this.raimPas = 3;
    }

    // Imatge de l'estàtua segons com té girat el cap (de cara és la imatge base)
    texRaim() {
        const k = ['home_raim_n', 'home_raim_ne', 'home_raim_e', 'home_raim'][this.raimPas];
        return this.textures.exists(k) && !Grafics.faltants.includes(k) ? k : 'home_raim';
    }

    // El cap de l'estàtua gira: la nova imatge es fon per sobre de l'anterior
    girarEstatua() {
        const e = this.estatua, k = this.texRaim();
        if (!e || !e.active || e.texture.key === k) return;
        const esc = (this.textures.get(k).customData && this.textures.get(k).customData.escala) || 1 / RES;
        const nova = this.add.image(e.x, e.y, k).setOrigin(e.originX, e.originY).setScale(esc).setDepth(e.depth + 1).setAlpha(0);
        this.tweens.add({ targets: nova, alpha: 1, duration: 380, delay: 300, ease: 'Sine.easeInOut', onComplete: () => { e.setTexture(k).setScale(esc); nova.destroy(); } });
    }

    // L'estàtua cobra vida: s'esquerda i tremola, esclata en llum lila, el guardià salta del pedestal (que es queda) i alça la maça rugint
    despertarRaim(sense = false) {
        if (!sense) Estat.posaFlag('raimDesperta');
        const { x: RX, y: RY } = RAIM, boss = this.enemic('raim', RX, sense ? RY + 85 : RY - 70);
        if (!boss) return;
        this.boss = boss;
        // L'origen del sprite passa als peus: així, quan cau de morros, gira pels peus i el cap toca a terra
        const hh = boss.spr.displayHeight / 2;
        boss.spr.setOrigin(0.5, 1); boss.spr.y += hh;
        this.ui().barraBoss("L'Home del Raïm", [9 / 24]);                       // a 9 de vida, la segona fase
        const ponPedestal = () => {
            const t = this.textures.get('home_raim_pedestal');
            this.pedestal = this.add.image(RX, RY, 'home_raim_pedestal').setOrigin(0.5, 1).setScale((t.customData && t.customData.escala) || 1 / RES).setDepth(RY);
        };
        if (this.estatua) this.estatua.setVisible(false);
        if (sense || !this.estatua) { ponPedestal(); return; }

        // Mentre dura l'escena el guardià no actua ni fa mal
        const spr = boss.spr, est = this.estatua;
        boss.atorditFins = this.time.now + 3300;
        spr.setAlpha(0); boss.ombra.setAlpha(0);
        est.setVisible(true).setTint(0xe0c8ff);
        this.cameras.main.shake(800, 0.004);
        Sfx.porta();
        this.tweens.add({ targets: est, x: est.x + 3, duration: 55, yoyo: true, repeat: 13 });
        let lila = false;
        this.time.addEvent({ delay: 140, repeat: 5, callback: () => { lila = !lila; if (est.active) est.setTint(lila ? 0xb890ff : 0xe0c8ff); } });
        this.time.delayedCall(250, () => ENEMICS.raim.trossos(this, RX, RY - 40, 8));
        this.time.delayedCall(550, () => ENEMICS.raim.trossos(this, RX, RY - 70, 8));
        this.time.delayedCall(850, () => {
            est.setVisible(false); ponPedestal();
            this.cameras.main.flash(260, 200, 160, 255);
            this.boiraPuf(RX, RY - 90);
            spr.setAlpha(1).setScale(boss.escalaBase);
            boss.ombra.setAlpha(1);
            // Salta del pedestal i cau al davant
            this.tweens.addCounter({
                from: 0, to: 1, duration: 620, ease: 'Bounce.easeOut',
                onUpdate: tw => { if (spr.active && !boss.mort) spr.body.reset(RX, RY - 70 + hh + 155 * tw.getValue()); },
                onComplete: () => {
                    if (!spr.active || boss.mort) return;
                    spr.body.reset(RX, RY + 85 + hh);
                    this.cameras.main.shake(320, 0.009);
                    Sfx.cop(true);
                    ENEMICS.raim.trossos(this, RX, RY + 110, 12);
                    // Rugit: es tira enrere amb la maça alçada i torna endreçat (sense deformar el sprite)
                    spr.setScale(boss.escalaBase);
                    this.tweens.add({ targets: spr, rotation: -0.32, duration: 420, ease: 'Sine.easeOut', yoyo: true, hold: 500, onYoyo: () => { Sfx.carrega(); this.esquitxar(RX, RY); } });
                }
            });
        });
    }

    raimDerrotat(e) {
        const c = e.spr.body.center;
        this.ui().amagarBarraBoss();
        Estat.posaFlag('raimDerrotat');
        ENEMICS.raim.trossos(this, c.x, c.y, 22);
        this.ui().actualitzarHUD();
        this.tweens.add({ targets: e.spr, angle: 70, duration: 400 });
        // El volant, l'engranatge i la maneta cauen amb el pedestal
        [this.volant, this.engranatge, this.manetaVolant].forEach(o => { if (o) this.tweens.add({ targets: o, y: o.y + 40, alpha: 0, duration: 600, ease: 'Quad.easeIn', onComplete: () => o.destroy() }); });
        this.volant = null; this.engranatge = null; this.manetaVolant = null;
        if (this.pedestal) {                // el pedestal s'esmicola
            ENEMICS.raim.trossos(this, RAIM.x, RAIM.y, 14);
            this.tweens.add({ targets: this.pedestal, alpha: 0, duration: 700, onComplete: () => { this.pedestal.destroy(); this.pedestal = null; } });
            if (this.colEstatua) { this.obstacles.remove(this.colEstatua, true, true); this.colEstatua = null; }
        }
        this.time.delayedCall(900, () => this.ui().obrirDialeg(DIALEGS.raimDerrotat, () => {
            this.tweens.add({ targets: [e.spr, e.ombra], alpha: 0, duration: 800, onComplete: () => this.retirar(e) });
            this.runes();
            Estat.posaObjectiu("La llosa de sota l'escalinata s'ha obert: baixa a la cripta dels monjos.");
            Estat.desar();
            this.obrirTrapa();
        }));
    }
}

// ---------------- LA CRIPTA ----------------
class ZonaCasaCripta extends ZonaCasaBase {
    constructor() {
        super('ZonaCasaCripta', {
            nom: 'Casa Gran · Cripta',
            amplada: 1000,
            alcada: 700,
            colorFons: '#0a0806',
            pacifica: true,
            entrades: { porta: { x: 500, y: 620, dir: 'amunt' } }
        });
    }

    construir() {
        this.salaPedra(1000, 700, 500, { paret: 'paret_cripta', tint: 0x6a6a72 });
        // Sarcòfags dels monjos, tres a cada banda, amb les piles que aguanten les voltes entre ells
        [[230, 330], [230, 470], [230, 610], [770, 330], [770, 470], [770, 610]].forEach(([x, y], i) => {
            this.add.image(x, y, 'sarcofag_cripta').setOrigin(0.5, 1).setScale(1 / RES).setDepth(y);
            this.colisio(x, y - 22, 140, 36);
        });
        [[345, 300], [655, 300], [345, 560], [655, 560]].forEach(([x, y]) => {
            this.add.image(x, y, 'pilastra_ermita').setOrigin(0.5, 1).setScale(1 / RES).setDepth(y);
            this.colisio(x, y - 8, 40, 16);
        });
        // Llosa amb la clau de ferro sota un raig de llum tènue, i dos candelabres
        this.llosaCripta = this.add.image(500, 340, Estat.flag('relTretes') ? 'llosa_cripta_buida' : 'llosa_cripta').setOrigin(0.5, 1).setScale(1 / RES).setDepth(340);
        this.colisio(500, 316, 180, 36);
        this.interactiu(500, 372, RADI_OBJECTE, DIALEGS.cofreCripta, { altura: 130, enTancar: () => { if (Estat.flag('relTretes')) this.llosaCripta.setTexture('llosa_cripta_buida'); } });
        [[400, 360], [600, 360]].forEach(([x, y], i) => {
            this.add.image(x, y, 'candelabre_hall').setOrigin(0.5, 1).setScale(1 / RES).setDepth(y);
            this.colisio(x, y - 8, 24, 14);
            const llum = this.add.circle(x, y - 78, 80, 0xffc060, 0.1).setDepth(y + 1);
            this.tweens.add({ targets: llum, alpha: 0.05, scale: 0.92, yoyo: true, repeat: -1, duration: 420 + i * 90 });
        });
        const raig = this.add.graphics().setDepth(79000).setBlendMode(Phaser.BlendModes.ADD);
        raig.fillStyle(0xcfd8ff, 0.07).fillPoints([{ x: 450, y: 0 }, { x: 550, y: 0 }, { x: 600, y: 330 }, { x: 400, y: 330 }], true);
        this.add.particles(0, 0, 'espurna', { x: { min: 420, max: 580 }, y: { min: 120, max: 340 }, speedY: { min: -8, max: 2 }, lifespan: 4000, scale: { start: 0.2, end: 0 }, alpha: { start: 0.45, end: 0 }, tint: 0xdfe6ff, frequency: 300, blendMode: 'ADD' }).setDepth(79001);
        this.add.rectangle(500, 350, 1000, 700, 0x100820, 0.18).setDepth(80100);
        this.sortida(460, 680, 80, 14, 'ZonaCasaGranInt', 'cripta');
    }
}

// ---------------- EL PASSADÍS SECRET (de la Sala del Ping-pong a la sala del tresor) ----------------
// El túnel dels monjos (des del celler de la Casa Gran): fosc, amb escolopendres i un mur d'esbarzers negres que només Runna talla.
class ZonaPassadis extends ZonaCasaBase {
    constructor() {
        super('ZonaPassadis', {
            fosca: true,
            nom: 'Passadís secret',
            amplada: 800,
            alcada: 1400,
            colorFons: '#0a0806',
            entrades: {
                porta:  { x: 400, y: 1320, dir: 'amunt' },
                tresor: { x: 400, y: 200,  dir: 'avall' }
            }
        });
    }

    construir() {
        this.terra('pedra', 200, 100, 400, 1300, -1100).setTint(0xa89c8c);        // pedra clara: els esbarzers negres i les bestioles fosques hi contrasten
        this.add.image(160, 0, 'mur_passadis').setOrigin(0).setScale(1 / RES).setDepth(-995);
        this.add.image(600, 0, 'mur_passadis').setOrigin(0).setScale(1 / RES).setDepth(-995).setFlipX(true);
        this.add.image(200, 0, 'fons_passadis').setOrigin(0).setScale(1 / RES).setDepth(-994);
        [300, 640, 980, 1290].forEach(y => this.add.image(200, y, 'costella_passadis').setOrigin(0).setScale(1 / RES).setDepth(79000).setAlpha(0.5));      // costelles de la volta, per damunt
        // La porta del fons, que s'obre en acostar-s'hi: porta a la cambra del tresor
        this.portaFons = this.portaAnimada({ x: 400, top: 14, bottom: 92, ample: 96, fons: -990, arc: true, unic: true, color: 0x4a3a2a, vora: 0x140a04, ferro: true });
        this.colisio(100, 700, 200, 1400);
        this.colisio(700, 700, 200, 1400);
        this.colisio(270, 60, 140, 120);
        this.colisio(530, 60, 140, 120);
        this.colisio(400, 40, 120, 80);                                       // dintell sobre la porta nord
        this.colisio(270, 1395, 140, 30);
        this.colisio(530, 1395, 140, 30);

        this.espelmes([[230, 1250], [570, 1250], [230, 820], [570, 820], [230, 360], [570, 360]]);

        // Un mur d'esbarzers negres a mig passadís: només es talla amb Runna. Negre sobre pedra fosca no es veuria: al darrere hi ha
        // una claror lila (es retallen a contrallum), cada esbarzer té una vora lluminosa i hi ha dues espelmes a cada costat.
        this.espelmes([[225, 770], [575, 770]]);
        if (!['passadis0', 'passadis1', 'passadis2', 'passadis3', 'passadis4'].every(id => Estat.flag('esb_' + id))) {
            this.contrallum = this.add.ellipse(400, 712, 460, 130, 0xc8a0ff, 0.55).setDepth(738).setBlendMode('ADD');
            this.tweens.add({ targets: this.contrallum, alpha: 0.25, yoyo: true, repeat: -1, duration: 1400, ease: 'Sine.easeInOut' });
        }
        [240, 320, 400, 480, 560].forEach((x, i) => {
            const o = this.esbarzer(x, 740, 'passadis' + i);
            if (!o) return;
            if (o.img.preFX) o.img.preFX.addGlow(0xe8d0ff, 5, 0, false, 0.1, 10);
            const halo = this.add.ellipse(x, 722, 96, 60, 0xb070ff, 0.4).setDepth(739).setBlendMode('ADD');
            this.tweens.add({ targets: halo, alpha: 0.15, scale: 1.2, yoyo: true, repeat: -1, duration: 900 + i * 110 });
            o.halo = halo;
        });

        // Els animalets del cementiri esquerdat, abans i després del mur
        if (!Estat.flag('passadisNet')) {
            [[330, 1150], [470, 1000], [350, 880], [440, 520], [340, 330]].forEach(([x, y]) => this.enemic('escolopendra', x, y));
        }

        this.add.rectangle(AMPLE / 2, (ALT - ALT_HUD) / 2, AMPLE / ZOOM_CAMERA + 4, (ALT - ALT_HUD) / ZOOM_CAMERA + 4, 0x000018, 0.12).setScrollFactor(0).setDepth(80000);
        this.sortida(340, 1386, 120, 14, 'ZonaPingpong', 'passadis');
        this.sortida(348, 86, 104, 22, 'ZonaCasaTresor', 'porta');
    }

    actualitzar() {
        this.esbarzers.forEach(o => { if (!o.viu && o.halo) { o.halo.destroy(); o.halo = null; } });
        if (this.contrallum && this.esbarzers.every(o => !o.viu)) { this.contrallum.destroy(); this.contrallum = null; }
        if (Estat.flag('passadisNet')) return;
        if (this.enemics.every(e => e.mort) && this.esbarzers.every(o => !o.viu)) Estat.posaFlag('passadisNet');
    }
}

// ---------------- LA CAMBRA SECRETA (sala del tresor) ----------------
// Una cambra dels monjos: prestatgeries amb mercaderia, sacs, botes i, sobre una tarima, el cofre amb el pergamí. La porta de sortida (al fons, a la dreta)
// és tancada: s'obre alçant la bóta marcada amb una creu vermella, que el pergamí del monjo assenyala.
class ZonaCasaTresor extends ZonaCasaBase {
    constructor() {
        super('ZonaCasaTresor', {
            nom: 'Cambra secreta',
            amplada: 1000,
            alcada: 700,
            colorFons: '#0a0806',
            pacifica: true,
            entrades: { porta: { x: 500, y: 620, dir: 'amunt' }, escala: { x: 760, y: 215, dir: 'avall' } }
        });
    }

    construir() {
        this.salaPedra(1000, 700, 500, { paret: 'paret_tresor', tint: 0x8a7a68, forats: [[715, 805]] });
        // Estora, tarima del cofre i el cofre
        this.add.image(500, 690, 'catifa_ermita').setOrigin(0.5, 1).setScale(1 / RES).setDepth(-1050);
        this.add.image(500, 178, 'graons_ermita').setOrigin(0.5, 0).setScale(1 / RES).setDepth(-990);
        this.registraGraons(310, 690, [[250, 268], [218, 238]]);          // els dos graons del cofre: frenada i un tap a cada un
        this.cofre = this.add.image(500, 218, Estat.flag('cofreCambra') ? 'cofre_tresor_obert' : 'cofre_tresor').setOrigin(0.5, 1).setScale(1 / RES).setDepth(218);
        (this.opacs = this.opacs || []).push(this.cofre);              // opac: la silueta de l'Ineu no es veu a través seu
        this.colisio(500, 205, 100, 24);
        this.interactiu(500, 262, RADI_OBJECTE, DIALEGS.cofreCambra, { altura: 110, enTancar: () => { if (Estat.flag('cofreCambra')) this.cofre.setTexture('cofre_tresor_obert'); } });
        [[390, 262], [610, 262]].forEach(([x, y], i) => {
            this.add.image(x, y, 'candelabre_hall').setOrigin(0.5, 1).setScale(1 / RES).setDepth(y);
            this.colisio(x, y - 8, 24, 14);
            const llum = this.add.circle(x, y - 78, 70, 0xffc060, 0.1).setDepth(y + 1);
            this.tweens.add({ targets: llum, alpha: 0.05, scale: 0.92, yoyo: true, repeat: -1, duration: 420 + i * 90 });
        });
        // Sacs, or, botes i prestatges
        [[190, 330, 'sacs_tresor', 130, 24], [200, 560, 'sacs_tresor', 130, 24], [800, 600, 'monedes_tresor', 90, 20]].forEach(([x, y, k, w, h]) => {
            this.add.image(x, y, k).setOrigin(0.5, 1).setScale(1 / RES).setDepth(y);
            this.colisio(x, y - h / 2, w, h);
        });
        [[190, 215], [190, 450], [250, 215]].forEach(([x, y]) => this.barril(x, y, 50, 22));
        [[810, 300], [810, 484]].forEach(([x, y]) => this.barril(x, y, 50, 22));

        this.mecanismePorta();
    }

    // ---- La porta del fons i el seu mecanisme ----
    // La porta és una llosa de pedra amb ferros, sense pany. A terra, la bóta de la creu tapa una anella de ferro; de l'anella surt
    // una cadena que corre per una regata del terra, puja per la paret i passa per una politja al costat de la porta. Primer cal
    // fer rodar la bóta; després, estirant l'anella, la politja gira i la llosa puja dins la llinda.
    mecanismePorta() {
        const oberta = Estat.flag('portaTresorOberta'), apartada = oberta || Estat.flag('botaAlcada');
        const PX = 760, PT = 20, PB = 164, PW = 90, AX = 810, AY = 392, PO = { x: 846, y: 96 };
        this.PT = { PX, PT, PB, PW, AX, AY, PO };
        // Dins de la porta: foscor, uns graons i la claror de l'escalinata
        const dins = this.add.graphics().setDepth(-989);
        dins.fillStyle(0x0a0604, 1).fillRect(PX - PW / 2, PT, PW, PB - PT);
        dins.fillGradientStyle(0x0a0604, 0x0a0604, 0x5a3c1c, 0x5a3c1c, 1, 1, 0.9, 0.9).fillRect(PX - PW / 2, PT + 60, PW, PB - PT - 60);
        dins.fillStyle(0xffd38a, 0.45).fillCircle(PX, PT + 70, 8);
        // La llosa de la porta (amb màscara: quan puja, desapareix dins la llinda)
        const ll = this.add.graphics().setDepth(-988);
        const H = PB - PT;
        ll.fillStyle(0x6a5a48, 1).fillRect(-PW / 2, 0, PW, H).lineStyle(3, 0x1c140c, 1).strokeRect(-PW / 2, 0, PW, H);
        ll.fillStyle(0x7a6a56, 1).fillRect(-PW / 2 + 6, 6, PW - 12, H - 12);
        ll.lineStyle(1.5, 0x3a2e22, 0.7).lineBetween(-PW / 2 + 6, H * 0.5, PW / 2 - 6, H * 0.5).lineBetween(0, 6, 0, H * 0.5).lineBetween(-PW / 4, H * 0.5, -PW / 4, H - 6).lineBetween(PW / 4, H * 0.5, PW / 4, H - 6);
        [0.2, 0.8].forEach(f => { ll.fillStyle(0x2a2420, 1).fillRect(-PW / 2, H * f - 5, PW, 10); for (let x = -PW / 2 + 8; x < PW / 2; x += 16) ll.fillStyle(0x8a8478, 1).fillCircle(x, H * f, 2.4); });
        ll.fillStyle(0x2a2420, 1).fillRect(PW / 2 - 10, 10, 6, 20);                                      // el ganxo d'on estira la cadena
        ll.setPosition(PX, PT);
        const mascara = this.make.graphics({ add: false }).fillRect(PX - PW / 2 - 2, PT, PW + 4, H + 4);
        ll.setMask(mascara.createGeometryMask());
        this.llosaPorta = ll;
        // La politja de la paret, la cadena que hi passa i la regata del terra fins a l'anella
        this.politja = this.add.graphics({ x: PO.x, y: PO.y }).setDepth(-987);
        this.politja.lineStyle(6, 0x1c1814, 1).strokeCircle(0, 0, 14).lineStyle(3, 0x6a6a72, 1).strokeCircle(0, 0, 14);
        for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2; this.politja.lineStyle(3, 0x4a4a52, 1).lineBetween(0, 0, Math.cos(a) * 13, Math.sin(a) * 13); }
        this.politja.fillStyle(0x8a7a40, 1).fillCircle(0, 0, 4);
        const sup = this.add.graphics().setDepth(-988);
        sup.fillStyle(0x2a2420, 1).fillRect(PO.x - 3, PO.y - 26, 6, 20).fillRect(PO.x - 10, PO.y - 30, 20, 6);
        const regata = this.add.graphics().setDepth(-1045);
        regata.lineStyle(10, 0x1a120c, 0.55).lineBetween(AX, AY, PO.x + 14, 178);
        this.cadena = this.add.graphics().setDepth(-986);
        this.offCadena = 0;
        this.dibuixarCadena(oberta);
        // L'anella (sota la bóta) i la bóta
        this.anella = this.add.graphics().setDepth(AY - 1);
        this.anella.fillStyle(0x7a6a56, 1).fillRect(AX - 30, AY - 16, 60, 30).lineStyle(2.5, 0x2a2018, 1).strokeRect(AX - 30, AY - 16, 60, 30);
        this.anellaFerro = this.add.graphics({ x: AX, y: AY - 2 }).setDepth(AY);
        this.anellaFerro.lineStyle(5, 0x1c1814, 1).strokeCircle(0, 0, 10).lineStyle(3, 0x9a948a, 1).strokeCircle(0, 0, 10).fillStyle(0x2a2420, 1).fillRect(-4, 8, 8, 6);
        this.anella.setVisible(apartada); this.anellaFerro.setVisible(apartada);
        this.bota = this.posar('bota_creu', apartada ? 880 : AX, AY, { col: { w: 50, h: 22 } });
        this.colBota = this.obstacles.getChildren()[this.obstacles.getChildren().length - 1];
        if (oberta) { this.llosaPorta.y = PT - H; }
        else this.colPorta = this.colisio(PX, PB - 6, PW + 10, 24);     // tancada, no es passa
        this.colisio(760, 65, 90, 130);                                 // dintell sobre la llosa
        this.sortida(722, 136, 76, 22, 'ZonaCasaGranInt', 'secreta');

        // Inspeccionar la porta tancada
        this.interactiu(PX, PB + 46, RADI_OBJECTE, E => ({ pagines: [{ qui: 'Ineu', text: E.flag('botaAlcada')
            ? "(La llosa no té pany ni maneta. La cadena de la politja hi està lligada: l'anella de terra la deu fer pujar.)"
            : E.flag('cofreCambra')
                ? "(Una llosa de pedra sense pany ni maneta. No cedeix gens. «Qui busqui sortida, que alci la bóta marcada amb la creu»...)"
                : "(Una llosa de pedra sense pany ni maneta. No cedeix gens: s'ha d'obrir d'una altra manera.)" }] }),
            { altura: PB - PT + 36, actiu: () => !Estat.flag('portaTresorOberta') });
        // La bóta: rodola a un costat i deixa veure l'anella
        this.interactiu(AX, AY + 32, RADI_OBJECTE, DIALEGS.botaTresor, { altura: 90, actiu: () => !Estat.flag('botaAlcada') && !Estat.flag('portaTresorOberta'),
            enTancar: () => this.rodarBota() });
        // L'anella: en estirar-la s'obre la porta
        this.interactiu(AX, AY + 30, RADI_OBJECTE, () => ({ pagines: [{ fer: (z, fet) => z.estirarAnella(fet) }] }),
            { altura: 50, actiu: () => Estat.flag('botaAlcada') && !Estat.flag('portaTresorOberta') });
    }

    // La cadena: de l'anella puja per la regata i la paret fins a la politja, i baixa fins al ganxo de la llosa. tibant: a tocar
    dibuixarCadena(tibant) {
        const { PX, PT, PW, AX, AY, PO } = this.PT, g = this.cadena;
        g.clear();
        const tram = (x0, y0, x1, y1) => {
            const L = Math.hypot(x1 - x0, y1 - y0), n = Math.floor(L / 9), ux = (x1 - x0) / L, uy = (y1 - y0) / L;
            for (let k = 0; k < n; k++) {
                const t = ((k * 9 + this.offCadena) % L), x = x0 + ux * t, y = y0 + uy * t;
                g.lineStyle(2.5, 0x1c1814, 1).strokeEllipse(x, y, k % 2 ? 4 : 8, k % 2 ? 8 : 4).lineStyle(1.2, 0x9a948a, 1).strokeEllipse(x, y, k % 2 ? 4 : 8, k % 2 ? 8 : 4);
            }
        };
        tram(AX, AY - 2, PO.x + 14, 178);
        tram(PO.x + 14, 178, PO.x + 14, PO.y);
        const ganxo = { x: PX + PW / 2 - 7, y: this.llosaPorta.y + 20 };
        tram(PO.x - 14, PO.y, ganxo.x, Math.max(ganxo.y, PT + 2));
    }

    // La bóta rodola a un costat (fa una volta sencera) i deixa veure l'anella de ferro
    rodarBota() {
        if (Estat.flag('botaAlcada')) return;
        Estat.posaFlag('botaAlcada'); Estat.desar();
        this.ajupir('ineu', null, 300);
        this.time.delayedCall(250, () => {
            Sfx.porta();
            this.tweens.add({ targets: this.bota, x: 880, angle: 360, duration: 900, ease: 'Sine.easeOut', onComplete: () => {
                this.bota.angle = 0;
                this.obstacles.remove(this.colBota, true, true);
                this.colBota = this.colisio(880, this.PT.AY - 11, 50, 22);
                this.anella.setVisible(true); this.anellaFerro.setVisible(true).setAlpha(0);
                this.tweens.add({ targets: this.anellaFerro, alpha: 1, duration: 300 });
                this.llum(this.PT.AX, this.PT.AY - 10, 0xffe8a0);
                Estat.posaObjectiu("Sota la bóta hi havia una anella de ferro, amb una cadena que puja fins a la porta.");
            } });
        });
    }

    // L'Ineu estira l'anella: la cadena corre, la politja gira i la llosa de la porta puja dins la llinda
    estirarAnella(fet) {
        if (Estat.flag('portaTresorOberta')) { if (fet) fet(); return; }
        const { PT, PB } = this.PT, H = PB - PT;
        this.ajupir('ineu', null, 1600);
        this.tweens.add({ targets: this.anellaFerro, y: this.anellaFerro.y - 10, duration: 300, ease: 'Sine.easeOut' });
        this.time.delayedCall(300, () => {
            Sfx.porta(); this.cameras.main.shake(1600, 0.003);
            const cam = this.cameras.main;
            cam.stopFollow(); cam.pan(this.PT.PX, (PT + PB) / 2 + 60, 500, 'Sine.easeInOut');
            this.tweens.add({ targets: this.politja, rotation: -Math.PI * 4, duration: 1600, ease: 'Sine.easeInOut' });
            this.tweens.add({ targets: this.llosaPorta, y: PT - H, duration: 1600, ease: 'Sine.easeInOut',
                onUpdate: () => { this.offCadena -= 3; this.dibuixarCadena(true); } });
            const pols = this.add.particles(this.PT.PX, PB - 4, 'espurna', { x: { min: -40, max: 40 }, speedY: { min: -40, max: -10 }, speedX: { min: -30, max: 30 },
                lifespan: 900, scale: { start: 0.45, end: 0 }, tint: [0xd8d2c0, 0xb9b3a2], frequency: 50, alpha: { start: 0.7, end: 0 } }).setDepth(99990);
            this.time.delayedCall(1700, () => {
                pols.destroy();
                Sfx.secret();
                Estat.posaFlag('portaTresorOberta'); Estat.desar();
                if (this.colPorta) { this.obstacles.remove(this.colPorta, true, true); this.colPorta = null; }
                Estat.posaObjectiu("La porta del fons de la cambra s'ha obert.");
                this.time.delayedCall(400, () => { cam.startFollow(this.ineu, true, 0.1, 0.1); if (fet) fet(); });
            });
        });
    }
}

// ---------------- LA SALA DEL RELLOTGE (el rellotge de la torre, dalt de la torre del Santuari) ----------------
// El rellotge és aturat a un quart de quatre (l'hora que va arribar la boira). Puzle: posar tres engranatges a la mida correcta
// perquè torni a caminar. (No dona cap gra al rosari.)
const GOLFES_SOLUCIO = [0, 1, 2];      // 0 petit, 1 mitjà, 2 gran: «el petit primer, el mitjà al mig i el gran darrere»
const GOLFES_DENTS = [18, 24, 30];     // radi primitiu = dents * 1.5: totes les rodes tenen el mateix pas de dent i poden engranar
const GOLFES_NOM = ['petit', 'mitjà', 'gran'];
// Els engranatges són en un bastidor dret a terra, a l'esquerra (lluny del rellotge, que té el seu punt propi a la paret).
// Els eixos estan a la distància justa perquè, amb la solució, les dents de cada roda encaixin amb les de la veïna.
const GOLFES_ENG_X = [222, 222 + 27 + 36, 222 + 27 + 36 + 36 + 45];      // radis 27 (petit), 36 (mitjà) i 45 (gran): la suma de cada parella és la distància entre eixos
const GOLFES_ENG_Y = 524;
const GOLFES_BASTIDOR = 604;       // peus del bastidor dels engranatges
const GOLFES_PARET = 446;          // fins on arriba la paret del fons (a sota, el terra)
const radiEng = mida => GOLFES_DENTS[mida] * 1.5;

Object.assign(DIALEGS, {
    golfesRellotge: E => ({ pagines: E.flag('rellotgeReparat') ? [
    ] : [
        { qui: 'Ineu', text: "El mecanisme és al bastidor de fusta de l'esquerra: tres engranatges a les posicions I, II i III. Cada cop que en toco un canvia de mida: petit, mitjà, gran." }
    ] }),

    golfesNota: E => ({ pagines: [
        { qui: 'Ineu', text: "«Nota del rellotger. El rellotge només camina si els engranatges hi van en ordre: el petit primer, el mitjà al mig, i el gran darrere.»" }
    ] }),

    golfesPendol: E => ({ pagines: [] }),

    // Els engranatges en ordre: el rellotge arrenca, toca les hores i l'Ineu ho celebra
    golfesReparat: {
        pagines: [
            { fer: (z, fet) => z.arrencarRellotge(fet) },
            { qui: 'Ineu', text: "(Torna a caminar! Ara se sentirà per tot el poble.)" }
        ],
        enAcabar: () => {
            Estat.posaFlag('rellotgeReparat');
            Estat.posaObjectiu('El rellotge del Santuari torna a caminar. Explica-ho al Pare Daimiel.');
            Estat.desar();
        }
    }
});

// Roda dentada de llautó dibuixada al voltant de (0, 0). R = radi primitiu (on engranen les dents).
// Dents trapezoïdals (una centrada a l'angle 0), corona, radis buidats, cub amb cargols i forat de l'eix.
// La llum (lluïssor a dalt a l'esquerra, ombra a baix a la dreta) va a part a llumEngranatge, perquè no giri amb la roda.
function pintaEngranatge(g, R, dents, color = 0xc8a64a) {
    const m = 2 * R / dents, cap = R + m, peu = R - 1.25 * m, pas = Math.PI * 2 / dents;
    const fosc = 0x2a1608, buit = 0x3a2410, ombra = 0x8a6a28;
    const p = [];
    for (let k = 0; k < dents; k++) {
        const c = k * pas;
        [[-0.3, peu], [-0.17, cap], [0.17, cap], [0.3, peu]].forEach(([f, rr]) => p.push({ x: Math.cos(c + f * pas) * rr, y: Math.sin(c + f * pas) * rr }));
    }
    g.fillStyle(color, 1).fillPoints(p, true);
    g.lineStyle(2.5, fosc, 1).strokePoints(p, true);
    // Corona: una línia fosca marca on comencen les dents i una de clara el cantell de la corona
    const corona = peu - Math.max(3, R * 0.16);
    g.lineStyle(1.5, ombra, 0.9).strokeCircle(0, 0, peu - 1.5);
    // Buit entre la corona i el cub, amb els radis
    g.fillStyle(buit, 1).fillCircle(0, 0, corona);
    const nRadis = dents >= 28 ? 6 : dents >= 20 ? 5 : 4, ampleRadi = Math.max(3, R * 0.13), cub = Math.max(7, R * 0.3);
    for (let k = 0; k < nRadis; k++) {
        const a = k * Math.PI * 2 / nRadis + pas / 2, ca = Math.cos(a), sa = Math.sin(a), nx = -sa, ny = ca;
        const rp = [
            { x: ca * cub * 0.6 + nx * ampleRadi * 1.3, y: sa * cub * 0.6 + ny * ampleRadi * 1.3 },
            { x: ca * (corona + 1) + nx * ampleRadi, y: sa * (corona + 1) + ny * ampleRadi },
            { x: ca * (corona + 1) - nx * ampleRadi, y: sa * (corona + 1) - ny * ampleRadi },
            { x: ca * cub * 0.6 - nx * ampleRadi * 1.3, y: sa * cub * 0.6 - ny * ampleRadi * 1.3 }
        ];
        g.fillStyle(color, 1).fillPoints(rp, true);
        g.lineStyle(1.2, fosc, 0.9).lineBetween(rp[0].x, rp[0].y, rp[1].x, rp[1].y).lineBetween(rp[2].x, rp[2].y, rp[3].x, rp[3].y);
    }
    g.lineStyle(2, fosc, 1).strokeCircle(0, 0, corona);
    // Cub: anell, cargols i forat de l'eix amb el xaveter
    g.fillStyle(color, 1).fillCircle(0, 0, cub);
    g.lineStyle(2, fosc, 1).strokeCircle(0, 0, cub);
    g.lineStyle(1.2, ombra, 1).strokeCircle(0, 0, cub * 0.72);
    if (cub >= 9) for (let k = 0; k < 3; k++) {
        const a = k * Math.PI * 2 / 3 + 0.5;
        g.fillStyle(fosc, 1).fillCircle(Math.cos(a) * cub * 0.72, Math.sin(a) * cub * 0.72, 1.6);
    }
    g.fillStyle(0x1a0c04, 1).fillCircle(0, 0, cub * 0.34);
    g.fillRect(-1.5, -cub * 0.34 - 2, 3, 3);
}

// Llum fixa sobre una roda dentada (no gira): reflex de metall a dalt a l'esquerra i ombra a baix a la dreta
function llumEngranatge(g, R, dents) {
    const m = 2 * R / dents, cap = R + m, peu = R - 1.25 * m;
    g.lineStyle(Math.max(2, m * 0.8), 0xfff0b0, 0.45).beginPath(); g.arc(0, 0, peu - m * 0.6, Math.PI * 1.05, Math.PI * 1.5); g.strokePath();
    g.lineStyle(1.5, 0xfff8d8, 0.5).beginPath(); g.arc(0, 0, R * 0.3 - 1, Math.PI * 1.1, Math.PI * 1.45); g.strokePath();
    g.lineStyle(Math.max(2, m * 0.8), 0x1a0c04, 0.28).beginPath(); g.arc(0, 0, peu - m * 0.6, Math.PI * 0.05, Math.PI * 0.5); g.strokePath();
    g.lineStyle(2, 0x000000, 0.18).beginPath(); g.arc(0, 0, cap, Math.PI * 0.1, Math.PI * 0.45); g.strokePath();
}

class ZonaGolfes extends ZonaCasaBase {
    constructor() {
        super('ZonaGolfes', {
            nom: 'Sala del Rellotge',
            amplada: 1000,
            alcada: 700,
            colorFons: '#0a0806',
            pacifica: true,
            entrades: { porta: { x: 500, y: 620, dir: 'amunt' } }
        });
    }

    construir() {
        this.sala(1000, 700, 500, 0x8a6a48);
        // Paret del fons de fusta, amb sòcol, i unes bigues robustes al sostre
        const paret = this.add.graphics().setDepth(-995);
        paret.fillStyle(0x4a2e18, 1).fillRect(130, 0, 740, GOLFES_PARET);
        for (let x = 130; x < 870; x += 46) {
            paret.fillStyle(x / 46 % 2 ? 0x54341c : 0x4a2e18, 1).fillRect(x, 0, 46, GOLFES_PARET);
            paret.lineStyle(2, 0x2a1608, 0.8).lineBetween(x, 0, x, GOLFES_PARET);
            paret.lineStyle(1, 0x2a1608, 0.35).lineBetween(x + 14, 30, x + 16, GOLFES_PARET - 40).lineBetween(x + 31, 50, x + 29, GOLFES_PARET - 30);
        }
        paret.fillStyle(0x2a1608, 1).fillRect(130, GOLFES_PARET - 10, 740, 12);
        paret.fillStyle(0xffd9a0, 0.14).fillRect(130, GOLFES_PARET + 2, 740, 3);
        this.colisio(500, (160 + GOLFES_PARET) / 2, 740, GOLFES_PARET - 160);                                                           // la paret del fons, fins al sòcol
        const bigues = this.add.graphics().setDepth(-990);
        for (let x = 200; x <= 800; x += 120) {
            bigues.fillStyle(0x2a1608, 1).fillRect(x - 7, 0, 14, 160);
            bigues.fillStyle(0x4a2c14, 1).fillRect(x - 5, 0, 10, 160);
            bigues.fillStyle(0xffd9a0, 0.18).fillRect(x - 5, 0, 2, 160);
        }
        bigues.fillStyle(0x2a1608, 1).fillRect(130, 140, 740, 20);
        bigues.fillStyle(0x4a2c14, 1).fillRect(130, 142, 740, 14);
        bigues.fillStyle(0xffd9a0, 0.2).fillRect(130, 142, 740, 2);

        // Rodes dentades decoratives (no fan res) a la paret, a banda i banda
        [[205, 200, 27, 14, 0x9a8650], [800, 205, 33, 18, 0x9a8650], [200, 250, 15, 8, 0xb59a52]].forEach(([x, y, r, d, col]) => {
            const g = this.add.graphics({ x, y }).setDepth(-960);
            pintaEngranatge(g, r, d, col);
            llumEngranatge(g, r, d);
        });
        // Cadenes amb contrapesos de pedra, a cada costat del rellotge
        const cad = this.add.graphics().setDepth(-940);
        [240, 760].forEach(x => {
            cad.lineStyle(3, 0x2a1608, 1);
            for (let y = 164; y < 288; y += 11) cad.strokeEllipse(x, y + 5, 7, 11);
            cad.fillStyle(0x6a6862, 1).lineStyle(3, 0x1a1008, 1);
            cad.fillRoundedRect(x - 14, 288, 28, 52, 6).strokeRoundedRect(x - 14, 288, 28, 52, 6);
            cad.lineStyle(1.5, 0x2a2824, 0.7).lineBetween(x - 14, 304, x + 14, 304).lineBetween(x - 14, 322, x + 14, 322);
            cad.fillStyle(0xffffff, 0.22).fillRect(x - 11, 291, 4, 46);
        });

        // El rellotge gran, a la paret del fons: aturat a les 3:15 fins que s'arregla
        const cx = 500, cy = 196;
        const cara = this.add.graphics().setDepth(-900);
        cara.fillStyle(0x000000, 0.3).fillCircle(cx + 4, cy + 6, 116);
        cara.fillStyle(0x2a1608, 1).fillCircle(cx, cy, 114);
        cara.fillStyle(0xb58a3a, 1).fillCircle(cx, cy, 109);
        cara.fillStyle(0xe0b857, 1).fillCircle(cx, cy, 104);
        cara.lineStyle(2, 0x2a1608, 1).strokeCircle(cx, cy, 104).strokeCircle(cx, cy, 98);
        cara.fillStyle(0xf0e6cc, 1).fillCircle(cx, cy, 96);
        cara.fillStyle(0xd8c8a0, 0.6).fillCircle(cx + 18, cy + 30, 52);                            // taques d'humitat
        cara.fillStyle(0xc8b488, 0.5).fillCircle(cx - 38, cy - 24, 26);
        cara.lineStyle(3, 0x3a2412, 1).strokeCircle(cx, cy, 96).strokeCircle(cx, cy, 62);
        cara.lineStyle(1, 0x3a2412, 0.5).strokeCircle(cx, cy, 90);
        for (let i = 0; i < 60; i++) {
            const a = i * Math.PI / 30, gran = i % 5 === 0;
            cara.lineStyle(gran ? 4 : 1.5, 0x3a2412, 1).lineBetween(cx + Math.sin(a) * (gran ? 78 : 83), cy - Math.cos(a) * (gran ? 78 : 83), cx + Math.sin(a) * 90, cy - Math.cos(a) * 90);
        }
        for (let i = 0; i < 12; i++) {                                                           // reblons del bisell
            const a = i * Math.PI / 6;
            cara.fillStyle(0x6a4a18, 1).fillCircle(cx + Math.sin(a) * 101, cy - Math.cos(a) * 101, 2.4);
            cara.fillStyle(0xfff0b0, 0.7).fillCircle(cx + Math.sin(a) * 101 - 0.7, cy - Math.cos(a) * 101 - 0.7, 0.9);
        }
        ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'].forEach((n, i) => {
            const a = i * Math.PI / 6;
            this.add.text(cx + Math.sin(a) * 68, cy - Math.cos(a) * 68, n, estilText(i % 3 === 0 ? 17 : 13, '#3a2412', { fontStyle: 'bold' })).setOrigin(0.5).setDepth(-895);
        });
        this.agullaMinuts = this.add.graphics({ x: cx, y: cy }).setDepth(-880);
        this.agullaMinuts.fillStyle(0x2a1608, 1).fillPoints([{ x: -3.5, y: 8 }, { x: -1.6, y: -78 }, { x: 0, y: -86 }, { x: 1.6, y: -78 }, { x: 3.5, y: 8 }], true);
        this.agullaHores = this.add.graphics({ x: cx, y: cy }).setDepth(-879);
        this.agullaHores.fillStyle(0x2a1608, 1).fillPoints([{ x: -5, y: 8 }, { x: -3.5, y: -26 }, { x: 0, y: -33 }, { x: 3.5, y: -26 }, { x: 5, y: 8 }], true);
        this.agullaHores.fillPoints([{ x: -2, y: -33 }, { x: 0, y: -52 }, { x: 2, y: -33 }], true);
        this.add.circle(cx, cy, 9, 0xb58a3a).setStrokeStyle(2, 0x2a1608).setDepth(-870);
        this.add.circle(cx, cy, 3, 0x2a1608).setDepth(-869);
        this.agullaMinuts.rotation = Math.PI / 2;           // 3:15
        this.agullaHores.rotation = Math.PI / 2 + 0.13;
        this.interactiu(500, GOLFES_PARET + 10, RADI_OBJECTE, DIALEGS.golfesRellotge, { altura: 170 });

        // Mecanisme: un bastidor de fusta dret a terra, a l'esquerra, amb tres engranatges (cada interacció en canvia la mida).
        // Està separat de la paret perquè el rellotge i cada engranatge tinguin el seu punt d'ESPAI.
        this.reparat = Estat.flag('rellotgeReparat');
        this.mides = this.reparat ? GOLFES_SOLUCIO.slice() : [1, 1, 1];
        const B = GOLFES_BASTIDOR, bx0 = 156, bx1 = 442, dalt = 448, D = B;           // dalt: travesser de dalt (on van els llums)
        const bast = this.add.graphics().setDepth(D);
        bast.fillStyle(0x000000, 0.3).fillEllipse((bx0 + bx1) / 2, B + 2, bx1 - bx0 + 30, 20);
        bast.fillStyle(0x2a1608, 1).fillRoundedRect(bx0 + 6, dalt + 10, bx1 - bx0 - 12, B - dalt - 26, 4);                // tauler del fons
        for (let x = bx0 + 8; x < bx1 - 10; x += 26) {
            bast.fillStyle(x / 26 % 2 < 1 ? 0x4a2c14 : 0x442812, 1).fillRect(x, dalt + 12, Math.min(26, bx1 - 8 - x), B - dalt - 30);
            bast.lineStyle(1, 0x1a0c04, 0.6).lineBetween(x, dalt + 12, x, B - 18);
        }
        bast.fillStyle(0x000000, 0.25).fillRect(bx0 + 8, dalt + 12, bx1 - bx0 - 16, 8);                                     // ombra del travesser
        [bx0, bx1 - 18].forEach(x => {                                                                                       // muntants
            bast.fillStyle(0x2a1608, 1).fillRect(x - 2, dalt - 4, 22, B - dalt + 6);
            bast.fillStyle(0x6a4424, 1).fillRect(x, dalt - 2, 18, B - dalt + 2);
            bast.fillStyle(0xffd9a0, 0.18).fillRect(x + 2, dalt - 2, 3, B - dalt + 2);
            bast.fillStyle(0x2a1608, 1).fillRect(x - 6, B - 8, 30, 10);                                                       // peus
        });
        bast.fillStyle(0x2a1608, 1).fillRect(bx0 - 4, dalt - 8, bx1 - bx0 + 8, 22);                                        // travesser de dalt
        bast.fillStyle(0x6a4424, 1).fillRect(bx0 - 2, dalt - 6, bx1 - bx0 + 4, 18);
        bast.fillStyle(0xffd9a0, 0.2).fillRect(bx0 - 2, dalt - 6, bx1 - bx0 + 4, 3);
        bast.fillStyle(0x2a1608, 1).fillRect(bx0, B - 26, bx1 - bx0, 14);                                                  // travesser de baix
        bast.fillStyle(0x5a3a1e, 1).fillRect(bx0 + 2, B - 24, bx1 - bx0 - 4, 10);
        [[bx0 + 9, dalt + 3], [bx1 - 9, dalt + 3], [bx0 + 9, B - 19], [bx1 - 9, B - 19]].forEach(([x, y]) => {
            bast.fillStyle(0x8a8a90, 1).fillCircle(x, y, 3.5); bast.fillStyle(0x2a1608, 1).fillRect(x - 2.5, y - 0.7, 5, 1.4);
        });
        GOLFES_ENG_X.forEach(x => {                                                                                         // suports dels eixos
            bast.fillStyle(0x1a0c04, 1).fillRect(x - 5, GOLFES_ENG_Y, 10, B - 26 - GOLFES_ENG_Y);
            bast.fillStyle(0x5a5a60, 1).fillRect(x - 3, GOLFES_ENG_Y, 6, B - 26 - GOLFES_ENG_Y);
        });
        this.colisio((bx0 + bx1) / 2, B - 12, bx1 - bx0 + 8, 24);
        // Cada engranatge: ombra al tauler (fixa), la roda (gira) i la llum (fixa). El del mig va per darrere dels dos veïns.
        this.engranatges = GOLFES_ENG_X.map((x, i) => ({
            ombra: this.add.graphics({ x: x + 4, y: GOLFES_ENG_Y + 5 }).setDepth(D + 1),
            roda: this.add.graphics({ x, y: GOLFES_ENG_Y }).setDepth(D + (i === 1 ? 2 : 4)),
            llum: this.add.graphics({ x, y: GOLFES_ENG_Y }).setDepth(D + (i === 1 ? 3 : 5))
        }));
        GOLFES_ENG_X.forEach((x, i) => {
            this.dibuixaEngranatge(i);
            this.interactiu(x, B + 26, 64, () => this.girarEngranatge(i), { altura: 190, actiu: () => !this.reparat });
        });
        if (this.reparat) this.encaixaEngranatges();
        // Plaques de posició (I, II, III) al travesser de baix. Cap llum ni avís: el puzle només es resol quan tots tres són bons.
        GOLFES_ENG_X.forEach((x, i) => {
            this.add.rectangle(x, B - 19, 30, 14, 0x3a2412).setStrokeStyle(1.5, 0xb58a3a).setDepth(D + 6);
            this.add.text(x, B - 19, ['I', 'II', 'III'][i], estilText(11, '#f2e6c8', { fontStyle: 'bold' })).setOrigin(0.5).setDepth(D + 7);
        });

        // Nota del rellotger (la pista del puzle), clavada a la paret de l'esquerra: pergamí desplegat i gastat
        this.posar('pergami_paret', 175, 360, { fonsY: -850, escala: 1.15 });
        this.interactiu(175, GOLFES_PARET + 10, RADI_OBJECTE, DIALEGS.golfesNota, { altura: 90 });

        // Caixa del pèndol, al costat dret: el pèndol batega quan el rellotge camina
        const caixa = this.add.graphics().setDepth(522);
        caixa.fillStyle(0x000000, 0.28).fillEllipse(810, 530, 120, 18);
        caixa.fillStyle(0x2a1608, 1).fillRoundedRect(766, 360, 88, 168, 6);
        caixa.fillStyle(0x5a3a1e, 1).fillRoundedRect(770, 364, 80, 160, 5);
        caixa.fillStyle(0x140a04, 1).fillRoundedRect(780, 380, 60, 124, 3);
        caixa.fillStyle(0x7a5a30, 1).fillRect(760, 354, 100, 12).fillRect(764, 520, 92, 10);
        caixa.lineStyle(2, 0x2a1608, 1).strokeRect(760, 354, 100, 12).strokeRect(764, 520, 92, 10);
        this.pendol = this.add.graphics({ x: 810, y: 386 }).setDepth(523);
        this.pendol.lineStyle(3, 0x8a6a28, 1).lineBetween(0, 0, 0, 92);
        this.pendol.fillStyle(0xb58a3a, 1).fillCircle(0, 98, 17).lineStyle(2.5, 0x2a1608, 1).strokeCircle(0, 98, 17);
        this.pendol.fillStyle(0xfff0b0, 0.55).fillCircle(-5, 92, 4);
        this.pendol.fillStyle(0x6a4a18, 1).fillCircle(0, 0, 4);
        const vidre = this.add.graphics().setDepth(524);
        vidre.fillStyle(0xbfe6ff, 0.1).fillRoundedRect(780, 380, 60, 124, 3);
        vidre.fillStyle(0xffffff, 0.14).fillPoints([{ x: 784, y: 384 }, { x: 800, y: 384 }, { x: 784, y: 440 }], true);
        this.colisio(810, 516, 96, 22);
        this.interactiu(810, 545, RADI_OBJECTE, DIALEGS.golfesPendol, { altura: 100 });

        this.aplic(320, 290, 0); this.aplic(680, 290, 1);           // dos aplics a la paret, entre les cadenes i el rellotge
        this.sortida(440, 686, 120, 14, 'ZonaTorre', 'dalt');
        if (this.reparat) this.agullaMinuts.rotation = 0;
        this.objectiuGolfes();
    }

    // L'objectiu diu què toca fer a la sala
    objectiuGolfes() {
        const E = Estat;
        if (this.reparat) return;
        E.posaObjectiu("Els engranatges del rellotge esperen ordre.");
        const ui = this.ui(); if (ui && ui.actualitzarHUD) ui.actualitzarHUD();
    }

    dibuixaEngranatge(i) {
        const e = this.engranatges[i], dents = GOLFES_DENTS[this.mides[i]], R = radiEng(this.mides[i]);
        e.ombra.clear().fillStyle(0x000000, 0.35).fillCircle(0, 0, R + 2 * R / dents);
        e.roda.clear(); pintaEngranatge(e.roda, R, dents);
        e.llum.clear(); llumEngranatge(e.llum, R, dents);
    }

    // Gira cada roda perquè les dents encaixin amb les de la veïna (una dent davant d'un forat al punt de contacte).
    // f: fracció del pas de dent que la roda té al punt de contacte (0 = centre d'una dent, 0.5 = centre d'un forat);
    // dues rodes engranades sumen sempre 0.5 i, si giren a la velocitat que toca, la suma es manté.
    encaixaEngranatges() {
        let f = 0;
        this.engranatges.forEach((e, i) => {
            const pas = Math.PI * 2 / GOLFES_DENTS[this.mides[i]];
            if (i === 0) { e.roda.rotation = 0; return; }
            const fi = ((0.5 - f) % 1 + 1) % 1;                  // fracció que necessita a l'angle PI (de cara a la roda d'abans)
            e.roda.rotation = Math.PI - fi * pas;
            f = (((-e.roda.rotation) / pas) % 1 + 1) % 1;        // fracció que té a l'angle 0 (de cara a la roda següent)
        });
    }

    girarEngranatge(i) {
        this.mides[i] = (this.mides[i] + 1) % 3;
        this.dibuixaEngranatge(i);
        const roda = this.engranatges[i].roda;
        this.tweens.add({ targets: roda, scale: { from: 0.86, to: 1 }, duration: 220, ease: 'Back.Out' });
        Sfx.menu();
        const bé = this.mides.every((m, k) => m === GOLFES_SOLUCIO[k]);
        if (!bé) return null;
        return DIALEGS.golfesReparat;
    }

    // Les rodes encaixen, les agulles corren des d'un quart de quatre fins a les cinc, el pèndol arrenca i sonen cinc campanades
    arrencarRellotge(fet) {
        // La càmera s'allunya (zoom out) per veure el rellotge i el mecanisme sencers mentre arrenca; en acabar, torna a l'Ineu
        this.enquadrar(500, 340, 0.9, 1300, null, 0);
        this.esperar(1200, () => this.arrencaAnimacio(fet));
    }

    arrencaAnimacio(fet) {
        this.encaixaEngranatges();
        this.cameras.main.shake(300, 0.003); Sfx.secret();
        const PI2 = Math.PI * 2;
        this.tweens.add({ targets: this.agullaMinuts, rotation: PI2 * 2, duration: 1800, ease: 'Cubic.easeInOut' });
        this.tweens.add({ targets: this.agullaHores, rotation: PI2 * 5 / 12, duration: 1800, ease: 'Cubic.easeInOut', onComplete: () => {
            this.agullaMinuts.rotation = 0;
            this.reparat = true;                                  // a partir d'ara, engranatges, agulles i pèndol es mouen (actualitzar)
            let n = 0;
            this.time.addEvent({ delay: 750, repeat: 4, callback: () => {
                Sfx.campana(); this.cameras.main.shake(160, 0.0025);
                if (++n === 5) this.esperar(1200, () => this.alliberarCamera(1400, fet));
            } });
        } });
    }

    actualitzar(ara, delta) {
        if (!this.reparat) return;
        // Amb el rellotge en marxa: agulles, engranatges (cadascun en sentit contrari al del veí) i pèndol
        this.agullaMinuts.rotation += delta * 0.0006;
        this.agullaHores.rotation += delta * 0.00005;
        // Velocitat inversa al nombre de dents: així les dents de les rodes veïnes continuen encaixades
        this.engranatges.forEach((e, i) => { e.roda.rotation += delta * 0.0009 * (i % 2 ? -1 : 1) * GOLFES_DENTS[this.mides[0]] / GOLFES_DENTS[this.mides[i]]; });
        this.pendol.rotation = Math.sin(ara / 520) * 0.32;
    }
}
