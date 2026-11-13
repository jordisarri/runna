/**
 * ZONES VEÏNES DE LA PLAÇA
 * Santuari (interior), Monestir, La Bassadòria (amb la Creu de l'Aparició), Casa Gran.
 * Algunes parts encara són provisionals i es completaran als passos següents.
 */

// ---------------- ESGLÉSIA (interior) ----------------
// La nau fa 800 d'ample (x 240-1040). El retaule ocupa tot l'ample i es veu sencer (800 x 990); al seu peu hi ha dues
// portes: la de la dreta duu a la torre de l'escala (ZonaTorre) i d'allà a les golfes del rellotge.
const ESG = { alcada: 2040, retY: 1010, retBaix: 24, retTop: 20, sostre: 1034, sostrePorta: 1000, portaDx: 870, portaEsq: 408 };      // sostre: fins on arriba la base del retaule (els peus no hi pugen); sostrePorta: només davant la porta de la dreta, que s'ha de poder tocar

class ZonaEsglesia extends ZonaBase {
    // La Pianista toca l'orgue d'esquena (animació en bucle) o es gira cap a l'Ineu (dibuix de front, asseguda al banc davant de l'orgue)
    pianistaToca(on, fet) {
        const pia = this.npcs && this.npcs.pianista;
        if (!pia || !pia.active || !this.orgue || !this.textures.exists('pianista_idle')) { if (fet) fet(); return; }
        if (on) {
            if (!this.anims.exists('idle_pianista')) this.anims.create({ key: 'idle_pianista', frames: this.anims.generateFrameNumbers('pianista_idle', { start: 0, end: NPC_IDLE.pianista.n - 1 }), frameRate: NPC_IDLE.pianista.fps, repeat: -1 });
            pia.setTexture('pianista_idle', 0).setFlipX(false); pia.escalaBase = pia.scaleX = pia.scaleY = this.textures.get('pianista_esquena').customData.escala * 0.85;       // (l'orgue és més petit: ella també)
            if (pia.balToca) { pia.balToca.remove(); pia.balToca = null; }           // (no es balanceja: només les mans i el cos de l'animació)
            pia.setAngle(0).setY(this.orgue.y + 1); pia.play('idle_pianista'); if (pia.ombra) pia.ombra.setY(this.orgue.y + 1);       // el banc, una mica més avall: queda davant del teclat
        } else {
            if (pia.anims) pia.anims.stop();
            if (pia.balToca) { pia.balToca.remove(); pia.balToca = null; } pia.setAngle(0);
            pia.setTexture('pianista').setFlipX(true); pia.escalaBase = pia.scaleX = pia.scaleY = this.textures.get('pianista').customData.escala;
            pia.setY(this.orgue.y + 24); if (pia.ombra) pia.ombra.setY(this.orgue.y + 24);
        }
        if (fet) fet();
    }

    // La Pianista mira l'Ineu: de cara, i l'Ineu es posa al costat esquerre de l'orgue perquè no la tapi
    pianistaCara(fet) {
        this.pianistaToca(false);
        const pia = this.npcs && this.npcs.pianista, I = this.ineu;
        if (!pia || !I || !this.orgue) { if (fet) fet(); return; }
        const x = pia.x - 105, y = this.orgue.y + 22;
        this.tweens.add({ targets: I, x, y, duration: 350, ease: 'Sine.easeInOut', onUpdate: () => { if (I.body) I.body.reset(I.x, I.y); I.setDepth(I.y); if (this.ombraIneu) this.ombraIneu.setPosition(I.x, I.y); }, onComplete: () => { if (this.cara) this.cara(pia); if (fet) fet(); } });
    }

    constructor() {
        super('ZonaEsglesia', {
            nom: 'Santuari del Miracle',
            amplada: 1280,
            alcada: ESG.alcada,
            colorFons: '#140e0a',
            pacifica: true,
            entrades: { porta: { x: 640, y: ESG.alcada - 50, dir: 'amunt' }, golfes: { x: ESG.portaDx, y: ESG.retY + 40, dir: 'avall' } }
        });
    }

    construir() {
        const A = ESG.alcada;
        this.yGraons = undefined;
        this.epileg = false; this.epilegEngegat = false;          // (l'escena es reaprofita: l'epíleg d'una altra partida no compta)
        // Terra i murs
        this.terra('rajola', 240, 0, 800, A, -1100);
        const murs = this.add.graphics().setDepth(-1000);
        murs.fillStyle(0x4a1e22, 1).fillRect(240, 0, 800, ESG.retY);                 // paret del fons, darrere el retaule
        murs.fillStyle(0x2e1216, 1).fillRect(240, ESG.retY - 8, 800, 8);            // sòcol fosc (si el retaule no el tapa del tot, no es veu cap línia clara)
        murs.fillStyle(0xcdb89a, 1).fillRect(200, 0, 40, A).fillRect(1040, 0, 40, A);
        this.colisio(120, A / 2, 240, A);
        this.colisio(1160, A / 2, 240, A);
        // El retaule (fins a y = sostre) no es pot trepitjar; només s'obre un pas davant la porta de la dreta (x 828-912), que duu a la torre
        const P0 = ESG.portaDx - 42, P1 = ESG.portaDx + 42;
        this.colisio((240 + P0) / 2, ESG.sostre / 2, P0 - 240, ESG.sostre);
        this.colisio((P1 + 1040) / 2, ESG.sostre / 2, 1040 - P1, ESG.sostre);
        this.colisio((P0 + P1) / 2, ESG.sostrePorta / 2, P1 - P0, ESG.sostrePorta);
        this.colisio(420, A - 10, 360, 20);
        this.colisio(860, A - 10, 360, 20);

        // Presbiteri: terra una mica més clar fins als dos graons (ySt), on hi ha l'altar, l'orgue amb la Pianista i el Pare Daimiel
        const ySt = ESG.retY + 300, pg = this.add.graphics().setDepth(-1090);
        pg.fillStyle(0xffe2a0, 0.14).fillRect(240, ESG.retY, 800, ySt - ESG.retY);
        pg.fillStyle(0xf0e2b8, 1).fillRect(240, ySt, 800, 24).fillStyle(0x6e5a38, 1).fillRect(240, ySt + 24, 800, 16).fillStyle(0x000000, 0.3).fillRect(240, ySt + 40, 800, 3);       // primer graó: replà i contrapetja
        pg.fillStyle(0xd2bd8a, 1).fillRect(240, ySt + 43, 800, 24).fillStyle(0x5a4828, 1).fillRect(240, ySt + 67, 800, 16);                                                    // segon graó
        pg.fillStyle(0x000000, 0.3).fillRect(240, ySt + 83, 800, 10);
        // Catifa vermella central, de la base de l'altar a la porta, amb vora doble, fil d'or i rombes; segueix els dos graons
        const cg = this.add.graphics().setDepth(-1085), cw = 100, c0 = 640 - cw / 2, c1 = ESG.retY + 128, c2 = A;
        cg.fillStyle(0x5a1018, 1).fillRect(c0, c1, cw, c2 - c1);
        cg.fillStyle(0x8c1c26, 1).fillRect(c0 + 5, c1, cw - 10, c2 - c1);
        cg.fillStyle(0xd8a64a, 1).fillRect(c0 + 9, c1, 3, c2 - c1).fillRect(c0 + cw - 12, c1, 3, c2 - c1);
        cg.fillStyle(0xa82a34, 1).fillRect(c0 + 13, c1, cw - 26, c2 - c1);
        // Només 4 rombes, a intervals iguals de 250 (un abans dels graons i tres després): els graons en queden lliures
        [ESG.retY + 214, ESG.retY + 464, ESG.retY + 714, ESG.retY + 964].forEach(y => {
            cg.fillStyle(0xd8a64a, 1).fillPoints([{ x: 640, y: y - 30 }, { x: 640 + 28, y }, { x: 640, y: y + 30 }, { x: 640 - 28, y }], true);
            cg.fillStyle(0x8c1c26, 1).fillPoints([{ x: 640, y: y - 19 }, { x: 640 + 17, y }, { x: 640, y: y + 19 }, { x: 640 - 17, y }], true);
            cg.fillStyle(0xf2d27a, 1).fillCircle(640, y, 5);
        });
        cg.fillStyle(0x000000, 0.38).fillRect(c0, ySt + 24, cw, 16).fillRect(c0, ySt + 67, cw, 16);               // contrapetges: la catifa hi baixa i es fa fosca
        cg.fillStyle(0xf2d27a, 0.35).fillRect(c0, ySt, cw, 2).fillRect(c0, ySt + 43, cw, 2);                       // vora dels replans

        // Retaule Major (tot l'ample de la nau, sencer) i, al davant, l'altar de pedra
        this.retaule = this.posar('retaule', 640, ESG.retY + ESG.retBaix, { fonsY: 900 });   // una mica més avall: les bases tapen el sòcol
        // La porta de la dreta del peu del retaule: la mateixa del gràfic, que s'obre cap endins (amb la clau de la torre del rellotge) i duu a la torre
        this.portaRetaule = this.portaAnimada({ x: 872, top: 868, bottom: 1021, ample: 83, fons: 900, senseAjust: true, unic: true, arc: true, retall: this.retaule, bloq: () => !this.portaRellotge });
        this.dibuixarSagrari();
        this.interactiu(640, ESG.retY + 36, 130, DIALEGS.sagrari, { altura: 170, actiu: () => !Estat.flag('fragment2') });     // el sagrari, al mig del retaule (fragment 2)
        this.posar('altar', 640, ESG.retY + 128, { col: { w: 130, h: 30 }, opac: true });

        // Portes del peu del retaule: totes dues tancades. Quan el Pare Daimiel diu que el rellotge s'ha aturat (rellotgeDit)
        // s'obre la de la dreta, que duu a la torre i a la Sala del Rellotge. L'esquerra és només decorativa: no s'obre mai i no té cap punt d'interacció.
        this.portaRellotge = false;
        this.obrirPortaRellotge(false);
        this.interactiu(ESG.portaDx, ESG.retY + 50, RADI_OBJECTE, () => Estat.te('clau_campanar') ? ({
            pagines: [{ qui: 'Ineu', text: 'La clau de la torre del rellotge encaixa al pany. La porta s\'obre.' }],
            enAcabar: () => { Estat.posaFlag('portaCampanarOberta'); Sfx.secret(); this.obrirPortaRellotge(false); }
        }) : ({
            pagines: [{ qui: 'Ineu', text: 'Tancada amb clau.' }]
        }), { altura: 150, actiu: () => !this.portaRellotge });

        // Orgue (la Pianista seu a l'orgue) i el Pare Daimiel, que dirigeix el cor
        const epileg = Estat.flag('epilegPendent') && !Estat.flag('epilegFet');          // a l'epíleg, el Pare Daimiel es posa amb la resta; l'orgue, la Pianista (asseguda: no s'aixeca) i els bancs es queden al seu lloc
        this.orgue = this.posar('orgue', 850, ESG.retY + 264, { col: { w: 110, h: 50 }, opac: true });
        {
            // La Pianista és de cara al banc de l'orgue; només hi toca d'esquena (animada) quan l'Ineu la troba la primera vegada i mentre ensenya un cant (pianistaToca)
            const pia = this.npc('pianista', this.orgue.x, this.orgue.y + 24, DIALEGS.pianista, { flipX: true, radi: RADI_NPC, zoomConversa: 1.5 });
            pia.setDepth(this.orgue.y + 1);                                                                       // per davant de l'orgue
            [pia.respira, pia.balanceig].forEach(t => t && t.remove()); pia.respira = pia.balanceig = null; pia.setAngle(0);       // fixa: ni respira ni es balanceja (no canvia de mida)
            pia.punt.npc = null;                                                                                  // l'Ineu no es fa enrere en parlar-hi: es posa al costat de l'orgue (pianistaCara)
            // Sempre és tocant l'orgue (d'esquena); només para per parlar amb l'Ineu
            if (!epileg) this.pianistaToca(true);
        }
        if (!epileg) this.npc('pare_daimiel', 440, ESG.retY + 215, DIALEGS.pareDaimiel, { flipX: false });
        if (!epileg) this.posar('atril_barroc', 340, ESG.retY + 262, { col: { w: 34, h: 14 }, opac: true });      // atril barroc daurat, girat d'esquena (no es veu el llibre), a l'esquerra del presbiteri i per davant del Pare Daimiel

        // Bancs, vistos per darrere (amb respatller), mirant cap a l'altar (a l'epíleg es retiren: la gent és de peu, en files, i no es tapa)
        if (!epileg) {
            const bancs = [ESG.retY + 540, ESG.retY + 690, ESG.retY + 840];       // la primera fila, ben separada dels graons (que acaben a retY + 393)
            // Bancs més amplis (hi caben dos o tres personatges): l'Ineu s'hi asseu sol en caminar-hi des del davant (vigilaBancs)
            this.bancsEsg = [];
            bancs.forEach(y => [466, 814].forEach(x => {
                this.posar('banc_esglesia_ample', x, y, { col: { w: 228, h: 16 }, opac: true });
                this.bancsEsg.push({ x, y, w: 228, cara: 'amunt' });
            }));
        }
        this.assegut = false;

        // Llum de les vidrieres
        this.add.rectangle(640, A / 2, 800, A, 0xffd38a, 0.05).setDepth(80000);

        this.sortida(600, A - 20, 80, 20, 'ZonaPlaca', 'esglesia');
        if (Estat.flag('epilegPendent') && !Estat.flag('epilegFet')) this.prepararEpileg();
    }

    // El sagrari: la porteta del tabernacle, petita, al peu de les escales de l'altar (a (642, 912) del món). Es tanca amb clau; en agafar el pergamí, s'obre i queda oberta.
    dibuixarSagrari() {
        const X = 642, Y = 912, W = 19, H = 32, R = { tl: W / 2, tr: W / 2, bl: 1, br: 1 };
        this.sagrariX = X; this.sagrariY = Y;
        const fons = this.add.graphics().setDepth(905);                      // l'interior del tabernacle, fosc, amb una claror càlida
        fons.fillStyle(0x24120a, 1).fillRoundedRect(X - W / 2, Y - H / 2, W, H, R);
        fons.fillStyle(0xffd070, 0.35).fillRoundedRect(X - W / 2 + 3, Y - H / 2 + 5, W - 6, H - 8, { tl: 6, tr: 6, bl: 1, br: 1 });
        this.sagrariFons = fons.setAlpha(0);
        const fulla = this.add.graphics({ x: X - W / 2, y: Y }).setDepth(906);          // la fulla de la porta, amb la frontissa a l'esquerra
        fulla.fillStyle(0xdcae3e, 1).lineStyle(1.5, 0x6a4810, 1);
        fulla.fillRoundedRect(0, -H / 2, W, H, R); fulla.strokeRoundedRect(0, -H / 2, W, H, R);
        fulla.fillStyle(0xf4d27a, 0.7).fillRoundedRect(3, -H / 2 + 5, W - 6, 4, 2);
        fulla.fillStyle(0x6a4810, 1).fillCircle(W - 4, 2, 1.4);                            // el pany
        this.sagrariFulla = fulla;
        if (Estat.flag('fragment2')) { fulla.setScale(0.1, 1); this.sagrariFons.setAlpha(1); }
    }

    // La porta del sagrari s'obre (amb la clau) i en surt una claror; després va l'animació d'obtenir objecte (amb fanfara), que el pergamí comença des d'aquí
    obrirSagrari(fet) {
        if (!this.sagrariFulla) { fet(); return; }
        this.puntActiu = { x: this.sagrariX, y: this.sagrariY + 30 };                 // (el pergamí surt del sagrari, no del punt d'interacció, que és més avall)
        if (Sfx.porta) Sfx.porta();
        const llum = this.add.circle(this.sagrariX, this.sagrariY, 30, 0xffe29a, 0.5).setBlendMode('ADD').setDepth(907).setScale(0.2).setAlpha(0);
        this.tweens.add({ targets: this.sagrariFons, alpha: 1, duration: 500 });
        this.tweens.add({ targets: this.sagrariFulla, scaleX: 0.1, duration: 600, ease: 'Sine.easeInOut' });
        this.tweens.add({ targets: llum, alpha: 0.7, scale: 1.2, duration: 600, yoyo: true, hold: 200, onComplete: () => llum.destroy() });
        this.esperar(900, fet);
    }

    // ---------------- EPÍLEG: «Torna el cant» ----------------
    // Tothom és al Santuari, ben distribuït per la nau sense bancs ni orgue perquè ningú es tapi:
    // els nens davant l'altar, la Pianista i el Pare Jordà a banda i banda, i el poble repartit en files
    // deixant un passadís ample al mig per on puja l'Ineu, que es queda mirant de cara a la càmera.
    prepararEpileg() {
        this.epileg = true;
        const R = ESG.retY;
        // Tots els adults fan la mateixa alçada (140) i els nens (105). Sense bancs: el poble és DE PEU, en tres files de tres a cada costat del passadís central (x 590-690),
        // a 85 px entre persones i 130 entre files per sota dels graons del presbiteri; els qui toquen el passadís (x 515 i 765) són els qui en surten per anar cap als nens.
        const AD = 140, NEN = 105, FILES = [R + 480, R + 610, R + 740];
        const seient = (fila, costat, n) => [(costat < 0 ? [345, 430, 515] : [765, 850, 935])[n], FILES[fila]];
        [['nen_uri', 480, R + 245, NEN], ['nen_flam', 590, R + 245, NEN], ['nen_sardin', 700, R + 245, NEN],      // els tres nens, separats, al peu de l'altar
         ['pare_daimiel', 360, R + 215, AD], ['pare_jorda', 965, R + 215, AD],                                      // el presbiteri: el Pare Daimiel a l'esquerra, el Pare Jordà a la dreta, i l'orgue amb la Pianista asseguda
         ['carry', ...seient(0, -1, 0), AD], ['pare_alcovi', ...seient(0, -1, 1), AD], ['venerables', ...seient(0, -1, 2), AD],
         ['isilder', ...seient(0, 1, 0), AD], ['carmelia', ...seient(0, 1, 1), AD], ['pilaria', ...seient(0, 1, 2), AD],
         ['meus', ...seient(1, -1, 0), AD], ['molner', ...seient(1, -1, 1), AD], ['mandu', ...seient(1, -1, 2), NEN],
         ['dolora', ...seient(1, 1, 0), AD], ['eve', ...seient(1, 1, 1), AD], ['iscu', ...seient(1, 1, 2), AD],
         ['pomers', ...seient(2, -1, 0), AD], ['jusef', ...seient(2, -1, 1), AD], ['germa_franci', ...seient(2, -1, 2), AD],
         ['joaneta', ...seient(2, 1, 0), AD], ['galf', ...seient(2, 1, 1), AD]
        ].forEach(([k, x, y, h]) => {
            if (!this.textures.exists(k) || (this.npcs && this.npcs[k])) return;
            const n = this.npc(k, x, y, DIALEGS.gentEpileg, { flipX: x > 640 });
            this.fixaAlcada(n, h);
        });
        if (this.npcs && this.npcs.mandu && Estat.flag('manduNinaTrencada')) this.npcs.mandu.setTexture('mandu_trencada');            // la nina, encara sense cap
        this.direccio = 'avall';
        if (this.ineu) this.posarDireccio('avall', false);
        this.cameras.main.fadeIn(1200, 0, 0, 0);
    }

    // Fa que un personatge tingui una alçada concreta a la pantalla (px de joc), sigui quin sigui el seu dibuix
    fixaAlcada(n, h) {
        const e = h / n.frame.height;
        [n.respira, n.balanceig].forEach(t => t && t.remove());
        n.setScale(e); n.escalaBase = e;
        this.idleCodi(n);                         // (la respiració es refà amb la mida nova)
        if (n.ombra) n.ombra.setScale(0.42 * h / 140);
        if (n.punt) n.punt.altura = h + 6;
    }

    actualitzar(temps) {
        this.obrirPortaRellotge(true);
        // Als dos graons del presbiteri l'Ineu els puja i els baixa un a un: a cada contrapetja va una mica més lent i sona un tap; a la resta, gairebé normal.
        const I = this.ineu, ySt = ESG.retY + 300;
        const alsGraons = !!(I && I.body && !this.cinema && !this.camCinema && I.x > 240 && I.x < 1040 && I.y > ySt - 6 && I.y < ySt + 100);
        const BANDES = [[ySt + 58, ySt + 84], [ySt + 20, ySt + 44]];          // les dues contrapetges: la de baix i la de dalt
        if (alsGraons) {
            let k = 0.85;
            BANDES.forEach(([ya, yb]) => { if (I.y > ya && I.y < yb) k = 0.55; });
            I.body.velocity.scale(k);
            if (this.yGraons !== undefined) BANDES.forEach(([ya, yb]) => { const amunt = I.y < this.yGraons, vora = amunt ? yb : ya; if ((this.yGraons - vora) * (I.y - vora) < 0) Sfx.escala(amunt); });          // un tap per graó, just quan hi trepitja (la vora per on hi entra)
            this.yGraons = I.y;
        } else this.yGraons = undefined;
        if (this.epileg && !this.epilegEngegat) {
            this.epilegEngegat = true;
            // La càmera (que la zona acaba de posar a seguir l'Ineu) passa a un pla general fix de tota la sala
            this.camCinema = false; this.cameras.main.stopFollow(); this.enquadrar(640, ESG.retY + 320, 0.9, 0, null, 0);
            if (this.ineu) this.posarDireccio('avall', false);
            this.time.delayedCall(900, () => this.ferEpileg());
        }
    }

    // El Fram cus el cap de la nina de la Mandu: una brillantor daurada i la nina torna a estar sencera
    arreglaNina(fet) {
        const m = this.npcs.mandu, f = this.npcs.nen_flam;
        if (!m) { fet(); return; }
        if (f) this.npcSalta('nen_flam', null, 1);
        Sfx.objecte();
        this.llum(m.x, m.y - m.displayHeight * 0.4, 0xffe8a0);
        this.esperar(500, () => { m.setTexture('mandu'); this.npcSalta('mandu', null, 1); this.esperar(900, fet); });
    }

    ferEpileg() {
        const R = ESG.retY, nens = ['nen_uri', 'nen_flam', 'nen_sardin'];
        const gent = Object.keys(this.npcs).filter(k => !nens.includes(k) && k !== 'pianista' && k !== 'pare_jorda');
        const tots = Object.keys(this.npcs);
        const hi = k => !!this.npcs[k];
        const riure = (llista, f) => { Sfx.riure(); llista.filter(hi).forEach(k => this.npcSalta(k, null, 2)); this.esperar(1500, f); };
        const accio = pas => ({ fer: (z, fet) => z.seq(pas(z), fet) });
        // La càmera enfoca qui parla (un o dos personatges) per damunt del quadre de diàleg; a les pàgines d'acció (sense quadre) enquadra al mig de tota la pantalla (reserva 0)
        const cos = k => k === 'ineu' ? this.ineu : (this.npcs && this.npcs[k]);
        const foc = (ks, zoom = 1.5, ms = 800) => ({ fer: (z, fet) => {
            const os = ks.map(cos).filter(o => o && o.active);
            if (os.length) z.enquadrar(os.reduce((q, o) => q + o.x, 0) / os.length, os.reduce((q, o) => q + o.y - o.displayHeight * 0.5, 0) / os.length, zoom, ms);
            fet();
        } });
        // Pla d'acció: tota la zona que s'ha de veure (sense quadre: al centre de la pantalla)
        const pla = (x, y, zoom, ms = 900) => f => { this.enquadrar(x, y, zoom, ms, null, 0); f(); };
        // Camina per etapes (de la banqueta al passadís, i del passadís als nens): cada punt és [x, y]
        const camina = (k, punts, vel = 170) => f => this.seq(punts.map(([x, y]) => g => this.npcVa(k, x, y, g, vel)), f);
        // On s'aturen al costat de cada nen (els nens són a x 480, 590 i 700, y R+245)
        const AL_NEN = { nen_uri: [425, R + 262], nen_flam: [548, R + 262], nen_sardin: [748, R + 262] };
        this.ui().obrirDialeg({ pagines: [
            accio(z => [
                f => z.ineuVa(640, R + 440, () => { z.posarDireccio('amunt', false); f(); }, 150),
                pla(640, R + 330, 1.0, 1200),
                f => riure(nens, f)
            ]),
            // Els adults importants per als nens: les Venerables Sàvies, la Mandu (la germana del Fram) i l'Isílder (el pare del Sardi). La Meus i el senyor Molner, a la multitud, sense protagonisme.
            // Cada un surt del seu banc pel passadís i puja fins al nen (caminant).
            accio(z => [pla(560, R + 380, 0.95, 900), camina('venerables', [[640, R + 480], [640, R + 330], AL_NEN.nen_uri]), f => z.npcMira('venerables', 'nen_uri', f), f => z.bombolla('venerables', '♥', f, 900),
                        f => { z.npcSalta('nen_uri', null, 2); z.npcSalta('nen_flam', f, 2); }]),
            foc(['venerables', 'nen_uri'], 1.5),
            { qui: 'Les Venerables Sàvies', text: "Huri, no hem dubtat ni per un instant que l'Ineu et salvaria. El seu destí estava escrit a la crònica del Miracle." },
            // La Mandu corre cap al seu germà el Fram (si l'Ineu l'havia vist amb la nina sense cap, el Fram l'hi cus: només ell la sap arreglar)
            ...(hi('mandu') ? [
                accio(z => [pla(600, R + 400, 0.95, 900), camina('mandu', [[640, R + 610], [640, R + 330], AL_NEN.nen_flam], 200),
                            f => { if (Estat.flag('manduNinaTrencada')) z.npcs.mandu.setTexture('mandu_trencada'); z.npcMira('mandu', 'nen_flam', f); }]),
                foc(['nen_flam', 'mandu'], 2.0),
                ...(Estat.flag('manduNinaTrencada') ? [
                    { qui: 'Fram', text: "Mandu! Què li ha passat a la nina? Dona-me-la, que només jo sé cosir caps de nina." },
                    { fer: (z, fet) => z.arreglaNina(fet) },
                    foc(['mandu'], 2.1),
                    { qui: 'Mandu', text: "Gràcies, Fram! Ja torna a tenir cap... i tu ja no te n'aniràs mai més, oi?" }
                ] : [
                    { qui: 'Mandu', text: "Fram! Ja has tornat! I tu ja no te n'aniràs mai més, oi?" },
                    foc(['nen_flam'], 2.1),
                    { qui: 'Fram', text: "Mai més, Mandu. T'ho prometo." }
                ])
            ] : []),
            // Les sacerdotesses s'alegren pel seu protegit, sense dir res: un cor i el Sardi que salta
            accio(z => [pla(790, R + 400, 0.95, 900), f => { z.bombolla('carmelia', '♥', null, 1100); z.bombolla('pilaria', '♥', null, 1100); z.bombolla('dolora', '♥', null, 1100); f(); },
                        f => z.npcSalta('nen_sardin', f, 2)]),
            // L'Isílder, el pare del Sardi, hi puja pel passadís i l'abraça
            ...(hi('isilder') ? [
                accio(z => [pla(720, R + 400, 0.95, 900), camina('isilder', [[690, R + 480], [690, R + 330], AL_NEN.nen_sardin], 200), f => z.npcMira('isilder', 'nen_sardin', f), f => z.bombolla('isilder', '♥', f, 900), f => z.npcSalta('nen_sardin', f, 2)]),
                foc(['isilder', 'nen_sardin'], 1.8),
                { qui: 'Isílder', text: "Sardi! Fill meu... Tres nits sense saber de tu." },
                foc(['nen_sardin'], 2.1),
                { qui: 'Sardi', text: "Pare! Has regat la prunera?" },
                foc(['isilder'], 1.9),
                { qui: 'Isílder', text: "Cada dia, fill. Cada dia. Així, quan tornessis, ho trobaves tot com ho havies deixat." }
            ] : []),
            // L'Iscu, que avui no ha de fregar gots
            ...(hi('iscu') ? [foc(['iscu'], 1.9), accio(z => [f => z.npcSalta('iscu', f, 2)]),
                { qui: 'Iscu', text: "Avui no frego ni un got! Festa grossa: els nens són a casa!" }] : []),
            // La Pianista dona l'entrada des del seu lloc (asseguda a l'orgue: no s'aixeca): l'Ineu es queda al passadís, es gira cap a l'orgue i comença el Cant del Miracle amb la tarota; l'orgue el segueix
            accio(z => [pla(745, R + 360, 0.95, 900), f => { z.posarDireccio('dreta', false); z.npcMira('pianista', 'ineu', f); }]),
            foc(['pianista', 'ineu'], 1.25),
            { qui: 'La Pianista', text: "Ara sí. Ineu, la tarota: avui el Cant del Miracle el comences tu, i l'orgue et seguirà." },
            accio(z => [
                f => {
                    z.enquadrar(640, R + 400, 1.9, 900, null, 0);
                    z.ineuFlauta(true);
                    MELODIES.miracle.notes.forEach((n, i) => this.time.delayedCall(i * 420, () => { Sfx.ocarina(FREQ_NOTA[n] * 2, 0.4, 0.14); z.bombolla('ineu', '♪', null, 380); }));
                    this.esperar(MELODIES.miracle.notes.length * 420 + 300, f);
                },
                f => {
                    z.enquadrar(640, R + 320, 0.9, 1100, null, 0);
                    // L'orgue torna a sonar: la fanfàrria del joc sencera, amb els acords, i tothom canta (la Pianista, asseguda, toca d'esquena)
                    const d = Joc.leitmotiv(this, 'orgue') || 4;
                    z.pianistaToca(true);
                    // Només uns quants canten amb notes (no tot el poble: n'hi hauria massa damunt dels caps); la resta es gronxa en silenci
                    const canten = ['pare_jorda', 'venerables', 'isilder', 'pare_daimiel'];
                    canten.filter(hi).forEach(k => z.npcFeina(k, d * 1000 - 400, 'notes'));
                    gent.filter(k => !canten.includes(k)).forEach(k => z.npcFeina(k, d * 1000 - 400, 'silenci'));
                    this.esperar(d * 1000 + 300, f);
                },
                f => {
                    z.pianistaToca(false);
                    z.ineuFlauta(false);
                    z.posarDireccio('avall', false);
                    riure(tots, f);
                },
                // El Pare Jordà (de la dreta del presbiteri) baixa a trobar l'Ineu
                pla(800, R + 330, 0.95, 900),
                camina('pare_jorda', [[965, R + 300], [700, R + 395], [705, R + 440]], 130),
                f => z.npcMira('pare_jorda', 'ineu', f)
            ]),
            // Només si l'Ineu va fer caminar el rellotge (missió lateral): la torre del rellotge torna a tocar les hores
            ...(Estat.flag('rellotgeReparat') ? [
                { fer: (z, fet) => { [0, 1, 2].forEach(k => z.time.delayedCall(k * 850, () => Sfx.campana())); z.esperar(3000, fet); } },
                foc(['pare_daimiel'], 1.9),
                { qui: 'Pare Daimiel', text: "Sents la torre del rellotge, Ineu? Torna a tocar les hores! Fa tres nits que el temps no passava, i l'has tornat a posar en marxa tu." },
                ...(hi('carry') ? [foc(['carry'], 1.9), { qui: 'Carry', text: "El meu home ho hauria sentit des de lluny, aquest so. Gràcies, fill." }] : [])
            ] : []),
            // L'Ineu explica al Pare Jordà què ha passat amb l'Aldreu, i el prior tanca l'epíleg
            foc(['ineu', 'pare_jorda'], 2.2),
            { qui: 'Ineu', text: "Pare Jordà... el Germà Aldreu no ha tornat. Es va quedar amb el Mestre, sota terra, i la gàbia se'l va tancar a dins." },
            { qui: 'Pare Jordà', text: "L'Aldreu... dins la gàbia?" },
            { fer: (z, fet) => z.seq([f => z.bombolla('pare_jorda', '…', f, 1300)], fet) },        // sospira i mira cap al terra
            { qui: 'Pare Jordà', text: "Quan un home busca l'admiració a la foscor perquè no sap trobar l'amor entre els seus germans, acaba sent el seu propi carceller." },
            { qui: 'Pare Jordà', text: "Haurà de respondre davant de Déu i davant nostre per cada llàgrima dels infants. Però la gàbia que ell mateix ha triat tancar... és on la seva boira ja no farà mal a ningú més." },
            foc(['pare_jorda', 'ineu'], 1.7),
            { qui: 'Pare Jordà', text: "Ara mira al teu voltant, Ineu: els nens riuen i el Santuari canta. Que la seva tristor no ens robi la llum que has tornat al Miracle. Benvingut a casa, fill." },
            { fer: (z, fet) => {
                z.posarDireccio('avall', false);
                z.seq([
                    // L'últim pla, sense quadre de diàleg: tot el Santuari centrat a la pantalla (abans la càmera quedava desplaçada: la gent a dalt i un tros negre a baix)
                    f => { z.enquadrar(640, R + 320, 0.9, 1400, null, 0); z.esperar(1500, f); },
                    f => riure(tots, f),
                    f => { this.cameras.main.fadeOut(1800, 0, 0, 0); this.esperar(1900, f); }
                ], fet);
            } }] }, () => {
            Estat.posaFlag('epilegFet');
            Estat.posaFlag('epilegPendent', false);
            Estat.posaObjectiu("El Santuari torna a cantar.");
            // El joc s'acaba aquí: no es pot tornar a jugar des del Santuari. La partida desada s'esborra ara mateix (si es tanca el navegador durant els crèdits, no queda
            // res per continuar); les dades es mantenen en memòria només perquè els crèdits en mostrin el percentatge.
            Estat.esborrar();
            this.canviant = true;
            Joc.aturarTot(this);
            this.scene.stop('UI');
            this.scene.start('Credits');
        });
    }

    // Venint de la torre, l'Ineu surt per la porta del peu del retaule: comença darrere el retaule (tapat per ell) i camina cap avall fins
    // passar-ne la vora, i només llavors es dibuixa davant. Així no se li superposa el retaule.
    enEntrar() {
        if (this.dadesEntrada.entrada !== 'golfes' || this.dadesEntrada.restaurar) return;
        this.entradaPropia = true;
        const I = this.ineu, x = ESG.portaDx, y0 = ESG.retY - 10, y1 = ESG.retY + 110, darrere = this.retaule.depth + 1.5;      // dins del forat de la porta: sobre la foscor, sota el batent
        this.canviant = true;
        this.portaRetaule.forcaFins = this.time.now + 1800;                                                                       // la porta s'obre per deixar-lo sortir
        I.body.checkCollision.none = true;
        I.setPosition(x, y0).setDepth(darrere);
        this.ombraIneu.setVisible(false);
        if (this.fantasma) this.fantasma.setVisible(false);
        this.posarDireccio('avall', true);
        this.tweens.addCounter({
            from: 0, to: 1, duration: 900, delay: 150,
            onUpdate: tw => {
                const y = y0 + (y1 - y0) * tw.getValue(), fora = y > ESG.retY + 34;
                I.setPosition(x, y).setDepth(fora ? y : darrere);
                this.ombraIneu.setPosition(x, y).setVisible(fora);
            },
            onComplete: () => {
                I.body.checkCollision.none = false;
                if (this.fantasma) this.fantasma.setVisible(true);
                this.canviant = false;
                this.posarDireccio('avall', false);
            }
        });
    }

    // Obre la porta de la dreta del retaule si el Pare Daimiel ja ha parlat del rellotge (també a mitja visita)
    obrirPortaRellotge(avis) {
        if (this.portaRellotge || !(Estat.flag('portaCampanarOberta') || Estat.flag('rellotgeReparat') || Estat.flag('visitada_ZonaTorre'))) return;   // (partides velles: ja hi havien pujat)
        this.portaRellotge = true;                // el batent de la porta (portaRetaule) ja no queda bloquejat: s'obre quan l'Ineu s'hi acosta
        this.sortida(ESG.portaDx - 30, ESG.retY - 20, 60, 18, 'ZonaTorre', 'baix');
        if (avis) {
            Sfx.secret();
            this.ineuDiu('La porta de la dreta del retaule ja és oberta.');
        }
    }
}

// ---------------- MONESTIR (exterior) ----------------
const MONESTIR_DY = 150;      // tot l'escenari baixa perquè la façana del Monestir es vegi sencera, de dalt a baix

class ZonaMonestir extends ZonaBase {
    constructor() {
        const D = MONESTIR_DY;
        super('ZonaMonestir', {
            pins: { pinyer: 0.35 },
            nom: 'El Monestir',
            densitatBoira: 1.8,                // la boira del Miracle és més espessa aquí, a prop d'on neix
            amplada: 1600,
            alcada: 800 + D,
            entrades: { placa: { x: 60, y: 520 + D, dir: 'dreta' }, rebedor: { x: 800, y: 494, dir: 'avall' }, inici: { x: 800, y: 540, dir: 'avall' }, cementiri: { x: 1480, y: 70, dir: 'avall' }, santantoni: { x: 1530, y: 560 + D, dir: 'esquerra' } }
        });
    }

    // La partida comença aquí, davant la porta del Monestir: l'Ineu n'acaba de sortir i ha d'anar cap a la Plaça
    enEntrar() {
        if (Estat.flag('introVista')) return;
        Estat.posaFlag('introVista');
        // L'inici del joc: un pla proper de l'Ineu sortint del Monestir mentre es llegeix el primer text; en acabar-lo, la càmera s'obre al zoom normal del joc
        this.enquadrar(this.ineu.x, this.ineu.y - 50, 2.3, 0);
        this.time.delayedCall(700, () => {
            this.ui().obrirDialeg({
                pagines: [
                    { qui: 'Ineu', text: 'Una altra nit de boira... i aquest fred que no marxa. El Pare Jordà em deu estar esperant a la Plaça.' }
                ]
            }, () => { Estat.desar(); this.alliberarCamera(1800); });
        });
    }

    construir() {
        const D = MONESTIR_DY;
        this.terra('herba', 0, 0, 1600, 800 + D, -1100);
        this.terra('llamborda', 0, 430 + D, 1600, 370);  // la mateixa plaça empedrada, fins a baix de tot
        this.terra('cami', 1400, 0, 160, 460 + D);         // cap al cementiri (darrere el Monestir i el Santuari)

        // 800 d'ample: la façana surt per dalt de la pantalla i només es veu a partir de les últimes fileres de teula
        // La façana: el portal del mig duu a la biblioteca (on treballa el Pare Alcoví)
        // La imatge va al fons (fonsY): l'Ineu puja l'escalinata per davant i arriba a la porta, que es veu obrir-se i el duu al Rebedor
        this.posar('monestir', 800, 440 + D, { fonsY: 330 });
        // Murs de la façana: als costats de l'escalinata la paret arriba fins a y=535; dalt de l'escalinata el mur i la porta són a y=438
        this.colisio(531, 267.5, 238, 535);
        this.colisio(1069, 267.5, 238, 535);
        this.colisio(704, 219, 108, 438);
        this.colisio(896, 219, 108, 438);
        this.colisio(800, 208, 84, 416);
        // Baranes de pedra en pendent als dos costats de l'escalinata (de y=438 a y=588)
        for (let i = 0; i < 6; i++) {
            const cy = 450.5 + i * 25, t = (i + 0.5) / 6;
            const lx0 = Math.round(655 + (552 - 655) * t), lx1 = Math.round(695 + (592 - 695) * t), w = lx1 - lx0, cx = (lx0 + lx1) / 2;
            this.colisio(cx, cy, w, 25);
            this.colisio(1600 - cx, cy, w, 25);
        }
        this.sortida(764, 416, 72, 14, 'ZonaMonestirRebedor', 'porta');
        this.portaAnimada({ x: 800, top: 325, bottom: 435, ample: 76, fons: 335, color: 0x6a4328, panell: 0x7a5233, vora: 0x2a1608, ferro: true });   // el portal romànic: els batents de fusta s'obren cap endins
        // Xiprers alts a l'esquerra del portal i una conífera a la dreta (al peu de la façana, y=535)
        [[440, 392, 1.7], [492, 398, 1.5]].forEach(([x, y, e]) => this.posar('xiprer', x, y + D, { escala: e, col: { w: 26, h: 12 } }));
        this.posar('xiprer', 1165, 395 + D, { escala: 1.9, col: { w: 30, h: 12 } });

        this.cartell(1368, 450 + D, () => ({ pagines: [{ qui: 'Cartell', text: '→ Cel·les de Sant Antoni\n↑ El Cementiri' }] }));
        this.arbres([[160, 250], [330, 200], [1250, 260], [250, 720], [1250, 720], [420, 770], [1090, 770], [750, 780]].map(([x, y]) => [x, y + D]));

        // La boira violeta que surt de sota terra jeu a la plaça, davant del Monestir i al peu de l'escalinata (vegeu posarBoiraGeneral):
        // aquí és on és més espessa, i va marxant a mesura que es resolen les missions
        if (!Estat.flag('ocellaireVencut')) {
            const nivell = () => nivellBoira();
            const vel = this.add.graphics().setDepth(5000);
            vel.fillGradientStyle(0x9a5ae8, 0x9a5ae8, 0x9a5ae8, 0x9a5ae8, 0, 0, 0.5, 0.5).fillRect(0, 440 + D, 1600, 800);
            this.tweens.add({ targets: vel, alpha: 0.65 * nivell(), yoyo: true, repeat: -1, duration: 3600, ease: 'Sine.easeInOut' });
            [[800, 590, 1500, 110, 4], [800, 530, 760, 90, 3.2], [420, 660, 800, 120, 3], [1180, 660, 800, 120, 3], [800, 730, 1500, 100, 3]].forEach(([x, y, w, h, q]) => {
                const f = this.boira(x, y + D, w, h, q * nivell());
                f.setDepth(5100);
            });
        }

        this.enemic('visitant', 1100, 700 + D);
        this.enemic('escolopendra', 400, 700 + D);
        this.sortida(0, 450 + D, 14, 140, 'ZonaPlaca', 'monestir');
        this.sortida(1400, 0, 160, 14, 'ZonaCementiri', 'monestir');
        this.sortida(1586, 490 + D, 14, 140, 'ZonaSantAntoni', 'monestir');
    }
}

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
        this.netejant = false;
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
            this.ui().obrirDialeg(DIALEGS.bassadoriaNeta(Estat), () => Estat.desar());
        });
        return true;
    }

    actualitzar(ara) {
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

// ---------------- ELS ARCS DE LA CASA GRAN (façana, escalinata i porxo d'arcs) ----------------
class ZonaCasaGran extends ZonaBase {
    constructor() {
        super('ZonaCasaGran', {
            nom: 'Els arcs de la Casa Gran',
            amplada: 1600,
            alcada: 1100,
            entrades: {
                placa:  { x: 1540, y: 930, dir: 'esquerra' },
                oest:   { x: 60,   y: 930, dir: 'dreta' },
                porxo:  { x: 700,  y: 600 + 70, dir: 'avall' }
            }
        });
    }

    construir() {
        const D = 70;       // la façana (i tot el que hi va lligat) baixa una mica perquè les arcades no quedin tallades per dalt
        this.terra('llamborda', 0, 0, 1600, 1100, -1100);   // tota l'escena és de pedra (la mateixa plaça empedrada), sense gespa

        // Façana gran (1250 d'ample): la reixa del porxo (arc del mig) queda a x=700, amb la base a y≈563 i ~170 d'alt
        const facana = this.posar('casa_gran', 700, 727 + D, { fonsY: 560 + D });
        // Parets: tot el que és darrere el terra de les arcades (y<572) és mur; les piles i els sòcols laterals també.
        // Només es pot pujar per l'escalinata (x 355-1050) i entrar a les arcades pels buits entre piles.
        this.blocDarrere(362, 575, 572 + D);                                                               // paret darrere l'arcada esquerra
        this.blocDarrere(1037, 575, 572 + D);                                                              // paret darrere l'arcada dreta
        this.blocDarrere(700, 100, 544 + D);                                                               // dintell sobre la reixa del porxo
        this.colisio(227, 650 + D, 305, 156);     // mur lateral esquerre recte, sense graons al hitbox
        this.colisio(1172, 650 + D, 305, 156);    // mur lateral dret recte
        this.colisio(585, 592 + D, 60, 40);         // pila entre l'arc esquerre i el del mig
        this.colisio(817, 592 + D, 55, 40);         // pila entre l'arc del mig i el dret
        // La reixa del porxo, tancada des de fa generacions: per fora no hi ha manera d'entrar
        if (Estat.flag('reixaObertaDins') || Estat.flag('ocellaireVencut')) {
            // Un cop s'ha aixecat la barra per dins, la reixa queda oberta (els batents giren en acostar-s'hi) i es pot entrar a la Casa Gran
            this.portaReixaFora = this.portaAnimada({ x: 700, top: 400 + D, bottom: 573 + D, ample: 107, fons: 560 + D, arc: true, retall: facana });
            this.sortida(658, 548 + D, 84, 16, 'ZonaCasaGranInt', 'porxo');
        } else this.interactiu(700, 585 + D, RADI_OBJECTE, DIALEGS.portaReixa, { altura: 190 });

        // Cartell que indica la Taverna, a la vora de la sortida de l'esquerra
        this.cartell(170, 880, () => ({ pagines: [{ qui: 'Cartell', text: '← La Taverna i l\'Hostatgeria\n→ La Plaça del Santuari' }] }));

        // Arbres només a la dreta, deixant el camí lliure
        this.arbres([[1480, 300], [1530, 520], [1470, 740]]);

        // Les sortides són a sota de la casa (la façana no les tapa)
        this.sortida(1586, 880, 14, 160, 'ZonaPlaca', 'casaGran');
        this.sortida(0, 880, 14, 160, 'ZonaTaverna', 'casagran');
    }
}


// ---------------- SALA DEL TRESOR (passatge secret de la cantonada Monestir-Santuari) ----------------
class ZonaTresor extends ZonaBase {
    constructor() {
        super('ZonaTresor', {
            nom: 'L\'oratori amagat',
            amplada: 640,
            alcada: 760,
            colorFons: '#140e0a',
            pacifica: true,
            entrades: { porta: { x: 320, y: 690, dir: 'amunt' } }
        });
    }

    // Un oratori petit dels monjos, amagat darrere la pedra que escolta: absis amb el relleu de les pedres que escolten, la
    // tarima amb l'arqueta-reliquiari entre dos canelobres, un raig de llum que hi cau, un mosaic rodó al terra i un faristol
    construir() {
        const W = 640, H = 760, M = 40, YP = 250;
        this.terra('pedra', M, YP - 10, W - 2 * M, H - YP + 10, -1100).setTint(0xa89480);
        this.add.image(0, 0, 'paret_oratori').setOrigin(0).setScale(1 / RES).setDepth(-995);
        const murs = this.add.graphics().setDepth(-990);
        murs.fillStyle(0x2a1f18, 1).fillRect(0, YP, M, H - YP).fillRect(W - M, YP, M, H - YP);
        murs.fillStyle(0x000000, 0.35).fillRect(M, YP, 14, H - YP).fillRect(W - M - 14, YP, 14, H - YP);      // ombra dels murs al terra
        this.colisio(M / 2, H / 2, M, H);
        this.colisio(W - M / 2, H / 2, M, H);
        this.colisio(W / 2, (YP + 10) / 2, W, YP + 10);
        this.colisio((M + W / 2 - 50) / 2, H - 6, W / 2 - 50 - M, 12);
        this.colisio((W / 2 + 50 + W - M) / 2, H - 6, W / 2 - 50 - M, 12);

        // Mosaic rodó al terra: anells de tessel·les, com les ones del relleu
        const mo = this.add.graphics().setDepth(-1050), MX = W / 2, MY = 470;
        [[118, 0x6a5240], [104, 0xb89a6a], [86, 0x3a4a5a], [70, 0xc8b088], [52, 0x8a4a30], [36, 0xd8c8a0], [18, 0x3a4a5a]].forEach(([r, c]) => {
            mo.fillStyle(c, 0.9).fillEllipse(MX, MY, r * 2, r * 1.2);
        });
        for (let k = 0; k < 48; k++) { const a = k / 48 * Math.PI * 2; mo.lineStyle(1.2, 0x2a1c10, 0.35).lineBetween(MX + Math.cos(a) * 36, MY + Math.sin(a) * 21.6, MX + Math.cos(a) * 118, MY + Math.sin(a) * 70.8); }
        mo.lineStyle(3, 0x2a1c10, 0.6).strokeEllipse(MX, MY, 236, 141.6);

        // Tarima de dos graons davant l'absis
        const t = this.add.graphics().setDepth(-1000);
        [[YP, 340, 0xb8aa90], [YP + 26, 380, 0x9a8c74]].forEach(([y, a, c]) => {
            t.fillStyle(c, 1).fillRect(W / 2 - a / 2, y, a, 26).lineStyle(2, 0x1c1610, 1).strokeRect(W / 2 - a / 2, y, a, 26);
            t.fillStyle(0xfff0d8, 0.3).fillRect(W / 2 - a / 2 + 2, y + 2, a - 4, 3);
        });
        // L'arqueta-reliquiari, al mig de la tarima
        const obert = Estat.flag('cofreTresor');
        this.reliquiari = this.posar(obert ? 'reliquiari_obert' : 'reliquiari', W / 2, YP + 34, { col: { w: 110, h: 24 }, opac: true });
        this.interactiu(W / 2, YP + 44, RADI_OBJECTE, DIALEGS.cofreTresor, { altura: 120 });
        // El raig de llum de la finestreta de l'absis, fins a l'arqueta, amb pols que sura
        const raig = this.add.graphics().setDepth(79000).setBlendMode('ADD');
        raig.fillStyle(0xfff0c0, 0.09).fillPoints([{ x: W / 2 - 4, y: 30 }, { x: W / 2 + 4, y: 30 }, { x: W / 2 + 70, y: YP + 40 }, { x: W / 2 - 70, y: YP + 40 }], true);
        raig.fillStyle(0xfff0c0, 0.07).fillPoints([{ x: W / 2 - 2, y: 30 }, { x: W / 2 + 2, y: 30 }, { x: W / 2 + 36, y: YP + 40 }, { x: W / 2 - 36, y: YP + 40 }], true);
        this.tweens.add({ targets: raig, alpha: 0.65, yoyo: true, repeat: -1, duration: 2200, ease: 'Sine.easeInOut' });
        this.add.particles(W / 2, 150, 'espurna', { x: { min: -50, max: 50 }, y: { min: -90, max: 120 }, speedY: { min: -6, max: 6 }, speedX: { min: -5, max: 5 }, lifespan: 3500,
            scale: { start: 0.2, end: 0 }, alpha: { start: 0.7, end: 0 }, tint: 0xfff2c8, frequency: 220, blendMode: 'ADD' }).setDepth(79001);

        // Canelobres a banda i banda de la tarima, amb la claror de les espelmes
        [W / 2 - 150, W / 2 + 150].forEach((x, i) => {
            this.posar('canelobre', x, YP + 60, { col: { w: 30, h: 14 } });
            const llum = this.add.circle(x, YP + 60 - 100, 70, 0xffb050, 0.12).setDepth(YP + 59).setBlendMode('ADD');
            this.tweens.add({ targets: llum, alpha: 0.2, scale: 1.08, yoyo: true, repeat: -1, duration: 320 + i * 90, ease: 'Sine.easeInOut' });
        });
        // Faristol amb el llibre obert, a la dreta
        this.posar('faristol', W - 120, 470, { col: { w: 50, h: 16 } });
        this.interactiu(W - 120, 480, RADI_OBJECTE, DIALEGS.faristolOratori, { altura: 120 });
        // Un banc de pedra a l'esquerra i unes pedres caigudes al racó
        const banc = this.add.graphics().setDepth(560);
        banc.fillStyle(0x000000, 0.3).fillEllipse(110, 562, 120, 14);
        banc.fillStyle(0x9a8c74, 1).fillRect(56, 520, 110, 22).lineStyle(2, 0x1c1610, 1).strokeRect(56, 520, 110, 22);
        banc.fillStyle(0x7a6c58, 1).fillRect(62, 542, 14, 18).fillRect(146, 542, 14, 18).strokeRect(62, 542, 14, 18).strokeRect(146, 542, 14, 18);
        banc.fillStyle(0xfff0d8, 0.3).fillRect(58, 522, 106, 3);
        this.colisio(111, 548, 116, 26);
        [[560, 660, 0.45], [584, 676, 0.35], [80, 690, 0.4]].forEach(([x, y, e]) => this.posar('roca', x, y, { escala: e, col: { w: 40 * e * 2, h: 14 } }));

        // L'escala d'entrada, amb la claror de la plaça que baixa
        const esc = this.add.graphics().setDepth(H);
        [0, 1, 2].forEach(k => {
            const y = H - 14 - k * 12;
            esc.fillStyle([0xc8b898, 0xb8a888, 0xa89878][k], 1).fillRect(W / 2 - 50 + k * 4, y, 100 - k * 8, 12).lineStyle(1.5, 0x1c1610, 1).strokeRect(W / 2 - 50 + k * 4, y, 100 - k * 8, 12);
        });
        const dia = this.add.graphics().setDepth(H - 1).setBlendMode('ADD');
        dia.fillStyle(0xfff0c0, 0.08).fillPoints([{ x: W / 2 - 50, y: H }, { x: W / 2 + 50, y: H }, { x: W / 2 + 120, y: H - 200 }, { x: W / 2 - 120, y: H - 200 }], true);

        this.add.rectangle(W / 2, H / 2, W, H, 0x1a0c04, 0.12).setDepth(80000);
        this.sortida(W / 2 - 40, H - 14, 80, 14, 'ZonaPlaca', 'tresor');
    }

    // L'arqueta s'obre: la tapa s'aixeca amb un esclat de llum daurada (l'Ineu no fa res)
    obrirReliquiari(fet) {
        const r = this.reliquiari;
        Sfx.secret();
        this.cameras.main.shake(200, 0.002);
        const nova = this.add.image(r.x, r.y, 'reliquiari_obert').setOrigin(r.originX, r.originY).setScale(r.scaleX).setDepth(r.depth + 1).setAlpha(0);
        this.tweens.add({ targets: nova, alpha: 1, duration: 450, onComplete: () => { r.setTexture('reliquiari_obert'); nova.destroy(); } });
        this.llum(r.x, r.y - 70, 0xffe08a);
        this.esperar(900, fet);
    }
}
