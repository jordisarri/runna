/**
 * EL SANTUARI DEL MIRACLE (interior): nau, presbiteri, retaule, orgue i bancs.
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

        // Presbiteri: terra una mica més clar fins als dos graons (ySt), on hi ha l'altar, l'orgue amb la Pianista i el Pare Nadiel
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

        // Portes del peu del retaule: totes dues tancades. Quan el Pare Nadiel diu que el rellotge s'ha aturat (rellotgeDit)
        // s'obre la de la dreta, que duu a la torre i a la Sala del Rellotge. L'esquerra és només decorativa: no s'obre mai i no té cap punt d'interacció.
        this.portaRellotge = false;
        this.obrirPortaRellotge(false);
        this.interactiu(ESG.portaDx, ESG.retY + 50, RADI_OBJECTE, () => Estat.te('clau_campanar') ? ({
            pagines: [{ qui: 'Ineu', text: 'La clau de la torre del rellotge encaixa al pany. La porta s\'obre.' }],
            enAcabar: () => { Estat.posaFlag('portaCampanarOberta'); Sfx.secret(); this.obrirPortaRellotge(false); }
        }) : ({
            pagines: [{ qui: 'Ineu', text: 'Tancada amb clau.' }]
        }), { altura: 150, actiu: () => !this.portaRellotge });

        // Orgue (la Pianista seu a l'orgue) i el Pare Nadiel, que dirigeix el cor
        const epileg = Estat.flag('epilegPendent') && !Estat.flag('epilegFet');          // a l'epíleg, el Pare Nadiel es posa amb la resta; l'orgue, la Pianista (asseguda: no s'aixeca) i els bancs es queden al seu lloc
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
        if (!epileg) this.posar('atril_barroc', 340, ESG.retY + 262, { col: { w: 34, h: 14 }, opac: true });      // atril barroc daurat, girat d'esquena (no es veu el llibre), a l'esquerra del presbiteri i per davant del Pare Nadiel

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
         ['pare_daimiel', 360, R + 215, AD], ['pare_jorda', 965, R + 215, AD],                                      // el presbiteri: el Pare Nadiel a l'esquerra, el Pare Jordà a la dreta, i l'orgue amb la Pianista asseguda
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
        // La Nena de les Trenes i la seva mare (si l'Ineu les va retrobar): dos esperits translúcids, de la mà al forat lliure del fons de la nau, que han sentit el cant des de lluny
        if (Estat.flag('nenaAlliberada') && this.textures.exists('mare_nena') && this.textures.exists('nena_trenes') && !(this.npcs && this.npcs.nena_trenes)) {
            const mare = this.npc('mare_nena', 935, R + 740, () => ({ pagines: [] }), { flipX: true });
            this.fixaAlcada(mare, AD); mare.setTint(0xe8eeff).setAlpha(0.8);
            const nena = this.npc('nena_trenes', 1004, R + 740, DIALEGS.nenaEpileg, { flipX: true });
            this.fixaAlcada(nena, 100); nena.setAlpha(0.9);
        }
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
            // La Nena de les Trenes i la seva mare, al fons de la nau (només si l'Ineu les va retrobar): l'agraeixen de nou i, en acabar, s'esvaeixen en llum, en pau
            ...(hi('nena_trenes') ? [
                accio(z => [pla(970, R + 700, 1.0, 1000), f => z.bombolla('mare_nena', '♥', f, 900)]),
                foc(['nena_trenes', 'mare_nena'], 2.0, 1000),
                { qui: 'Nena de les Trenes', text: "La mare i jo ho hem sentit des de lluny. Cantes molt bé, monjo." },
                { qui: 'Nena de les Trenes', text: "Gràcies per portar-me a casa." },
                { fer: (z, fet) => {
                    const a = [z.npcs.nena_trenes, z.npcs.mare_nena].filter(o => o && o.active);
                    z.llum(970, R + 650, 0xfff4e0);
                    z.tweens.add({ targets: a, alpha: 0, y: '-=14', duration: 2600, ease: 'Sine.easeIn', onComplete: () => { a.forEach(o => { if (o.punt) o.punt.actiu = () => false; if (o.col) o.col.destroy(); o.setVisible(false); }); } });
                    z.esperar(3000, fet);
                } }
            ] : []),
            // Només si l'Ineu va fer caminar el rellotge (missió lateral): la torre del rellotge torna a tocar les hores
            ...(Estat.flag('rellotgeReparat') ? [
                { fer: (z, fet) => { [0, 1, 2].forEach(k => z.time.delayedCall(k * 850, () => Sfx.campana())); z.esperar(3000, fet); } },
                foc(['pare_daimiel'], 1.9),
                { qui: 'Pare Nadiel', text: "Sents la torre del rellotge, Ineu? Torna a tocar les hores! Fa tres nits que el temps no passava, i l'has tornat a posar en marxa tu." },
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

    // Obre la porta de la dreta del retaule si el Pare Nadiel ja ha parlat del rellotge (també a mitja visita)
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
