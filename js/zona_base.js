/**
 * ZONA BASE: tot el que comparteixen les pantalles del joc.
 * Cada zona hereta d'aquesta classe i implementa construir() amb els seus objectes,
 * personatges, punts d'interacció i sortides.
 *
 *   class ZonaX extends ZonaBase {
 *       constructor() { super('ZonaX', { nom: 'Nom visible', amplada: 1600, alcada: 1200,
 *                                        entrades: { inici: { x, y, dir: 'avall' } } }); }
 *       construir() { ... }
 *   }
 */
// Distància a partir de la qual es pot interactuar: l'Ineu ha d'estar a menys del 80% del «radi» del punt (vegeu puntProper).
// Tres mides, perquè tot s'activi més o menys a la mateixa distància (uns 72-88 px dels peus de l'Ineu al punt):
const RADI_NPC = 100;        // personatges: 80 px, la mateixa distància a la qual es queda l'Ineu en parlar-hi (separarDeNpc)
const RADI_OBJECTE = 90;     // cartells, cofres, portes, pedres, taules...: 72 px
const RADI_GRAN = 110;       // objectes grans (arbres, fonts, dolmen...), amb el punt al centre: 88 px
// Els objectes enormes (el pantà, les bardisses, la gàbia gran...) fan servir el seu propi radi, més gran.

// Zoom de la càmera de les zones: 1,2 per defecte (al mòbil els personatges es veien massa petits). Es pot canviar amb ?zoom=1.1
// (de 1 a 1,6) a l'adreça: es recorda fins que se'n posi un altre
const ZOOM_NPC = 1.12;      // acostament suau de la càmera en parlar amb un personatge (1 = res)
const ZOOM_COMBAT = 1.12;    // acostament addicional de la càmera mentre hi ha combat (1 = res)
// Zoom base de cada zona = ZOOM_CAMERA × el factor d'aquí (1 si no hi surt: camins, places i exteriors es queden com abans). Vegeu design/PLA_ZOOM.md.
// Interiors petits més a prop (acollidors, sense marges buits); interiors mitjans una mica; el tram tens de l'Acte 3 va a més pressió.
const ZOOM_ZONES = {
    ZonaCasetaJoc: 1.3, ZonaTresor: 1.3, ZonaCelaStAntoni: 1.3, ZonaCabanaInt: 1.3, ZonaCabanaCami: 1.3, ZonaMasiaCirosa: 1.3, ZonaGolfes: 1.3, ZonaCasaCripta: 1.3, ZonaCasaTresor: 1.3, ZonaCasaGeorgi: 1.3,
    ZonaHostatgeriaInt: 1.2, ZonaBiblioteca: 1.2, ZonaMonestirRebedor: 1.2, ZonaErmitaInt: 1.2, ZonaGabrielInt: 1.2,
    ZonaCambraDolora: 1.25, ZonaCambraPilaria: 1.25, ZonaCambraCarmelia: 1.25, ZonaSoterraniHost: 1.2,
    ZonaPingpong: 1.2, ZonaEsglesia: 1.1, ZonaEsglesiaNova: 1.1, ZonaTavernaInt: 1.25, ZonaCasaGranInt: 1.4,
    ZonaPlaca: 1.1, ZonaEra: 1.1, ZonaJardi: 1.1, ZonaCementiri: 1.1,       // exteriors amb poc contingut: una mica més a prop
    ZonaSotaTaverna: 1.1, ZonaGirgolesFora: 1.1, ZonaPassadis: 1.15, ZonaGirgoles: 1.15, ZonaTortura: 1.2, ZonaBoira: 1.2
};
const ZOOM_MAX_ZONA = 1.85;   // per sobre d'això els gràfics es veuen massa grans
// Primer cop que s'entra en aquestes zones: pla de situació (la càmera comença una mica més lluny i s'acosta lentament)
const ZONES_CLAU = ['ZonaPlaca', 'ZonaTiller', 'ZonaDolmen', 'ZonaCirosa', 'ZonaCementiri', 'ZonaRuines', 'ZonaGirgoles', 'ZonaGabia', 'ZonaRovellonera', 'ZonaBosc', 'ZonaCreu', 'ZonaEsglesia'];
const ZOOM_CAMERA = (() => {
    let z = parseFloat(new URLSearchParams(location.search).get('zoom'));
    try {
        if (z >= 1 && z <= 1.6) localStorage.setItem('runna_zoom2', String(z));
        else z = parseFloat(localStorage.getItem('runna_zoom2'));
    } catch (e) { }
    return z >= 1 && z <= 1.6 ? z : 1.2;
})();
// Inici tancat: fins que l'Ineu no ha parlat amb el Pare Jordà i no té el bastó de pelegrí, només pot anar pel Monestir i la Plaça
const ZONES_INICI = ['ZonaMonestir', 'ZonaMonestirRebedor', 'ZonaBiblioteca', 'ZonaPlaca'];
const BANDA_SUD = 120;   // franja de baix (vora sud, sortides) que es desplaça cap avall en ampliar la zona
const VELOCITAT_INEU = 230;
// Caixa de col·lisió del tronc de l'arbre (gràfic 'arbre': les arrels fan ~130 px d'ample i el tronc ~70-100)
// Part del dibuix (fraccions x0, y0, x1, y1 del gràfic) que és el tronc: és opac (la silueta de l'Ineu s'hi amaga); la copa i les branques, no
const TRONCS = { arbre: [0.27, 0.52, 0.75, 1], pi: [0.36, 0.55, 0.66, 1], pi_pinyer: [0.30, 0.60, 0.62, 1] };
const TRONC_ARBRE = esc => ({ w: Math.round(100 * esc), h: Math.round(36 * esc) });

const PROFUNDITAT_PORTA = 36;   // els interiors es surten per sota de la porta: l'Ineu l'ha de traspassar abans de canviar de zona
const MARGE_TEULADA = 62;   // mig cos de l'Ineu: la col·lisió d'un edifici comença així de baix de la seva teulada, i per dalt es pot passar-hi darrere
// Missions que fan marxar la boira del Miracle (cadascuna n'esvaeix una part); la boira no desapareix del tot fins que cau l'Ocellaire
const BOIRA_PASSOS = [
    E => E.flag('bassadoriaNeta'),                                         // Bassadòria: Cant de l'Aurora
    E => E.flag('fontNeta'),                                               // Font del Bisbe: les tres ofrenes
    E => E.flag('boiraTillerNeta'),                                        // Camí del Gran Til·ler: beuratge de la Joaneta
    E => E.flag('pastorVencut'),                                           // Cirosa: Pastor de Boira
    E => E.flag('boiraDolmenNeta'),                                        // Camí del Dolmen: Estel de Sant Llorenç
    E => E.flag('tombaSegellada')         // Cementiri: Runna segella la tomba
];
const BOIRA_MINIM = 0.2;                                                  // el que en queda quan s'han fet totes, fins al combat final
// 1 = tota la boira; 0 = cap (només quan l'Ocellaire és vençut)
function nivellBoira() {
    if (Estat.flag('ocellaireVencut')) return 0;
    const fets = BOIRA_PASSOS.filter(f => f(Estat)).length;
    return 1 - (1 - BOIRA_MINIM) * fets / BOIRA_PASSOS.length;
}

// La boira no és igual a tot arreu: neix al Santuari (Plaça i Monestir, la més espessa), és forta als llocs on hi ha un focus (Bassadòria, Cementiri, Cirosa, Dolmen),
// més fluixa als camins llunyans i gairebé inexistent als llocs protegits (el Gran Til·ler, la cabana de la Joaneta). dens: multiplicador de l'espessor; neta/resta: quan
// s'ha resolt el seu focus, la boira d'aquella zona baixa a `resta` (fracció del nivell general) sense esperar que marxi la resta. L'Ocellaire vençut ho esborra tot.
const BOIRA_ZONES = {
    ZonaPlaca: { dens: 1.8 }, ZonaMonestir: { dens: 1.8 }, ZonaEsglesia: { dens: 1.5 }, ZonaCasaGran: { dens: 1.4 },
    ZonaRuines: { dens: 1.3 }, ZonaCellerFora: { dens: 1.3 },
    ZonaCreu: { dens: 1.6, neta: E => E.flag('bassadoriaNeta'), resta: 0.25 },                       // la Bassadòria: neta amb el Cant de l'Aurora
    ZonaCementiri: { dens: 1.6, neta: E => E.flag('tombaSegellada'), resta: 0.25 },                 // la tomba segellada
    ZonaCamiCirosa: { dens: 1.3, neta: E => E.flag('pastorVencut'), resta: 0.3 },                   // el Pastor de Boira vençut
    ZonaCirosa: { dens: 1.3, neta: E => E.flag('pastorVencut'), resta: 0.3 },
    ZonaDolmen: { dens: 1.5, neta: E => E.flag('boiraDolmenNeta'), resta: 0.3 },                    // l'Estel de Sant Llorenç
    ZonaBosc: { dens: 1.2, neta: E => E.flag('fontNeta'), resta: 0.3 },                             // la Font del Bisbe neta
    ZonaBoscPi: { dens: 1.0, neta: E => E.flag('piObert'), resta: 0.3 },                            // el pi desperta
    ZonaJardi: { dens: 0.8, neta: E => E.flag('mongesTrobades'), resta: 0.35 },                     // l'Hostatgeria, quan les sacerdotesses són lliures
    ZonaCelles: { dens: 1.0 }, ZonaTaverna: { dens: 1.0 }, ZonaCami: { dens: 1.0 }, ZonaCamiRov: { dens: 0.9 }, ZonaRovellonera: { dens: 0.9 },
    ZonaErmita: { dens: 0.8 }, ZonaEra: { dens: 0.8 }, ZonaGabriel: { dens: 0.6 }, ZonaDipositos: { dens: 0.6 }, ZonaSantAntoni: { dens: 0.6 }, ZonaGeorgi: { dens: 0.6 },
    ZonaTiller: { dens: 0.4 }, ZonaCabana: { dens: 0.4 }                                              // llocs protegits: l'aire gairebé net
};
function nivellBoiraZona(clau) {
    let v = nivellBoira();
    const z = BOIRA_ZONES[clau];
    if (v > 0 && z && z.neta && z.neta(Estat)) v *= (z.resta == null ? 0.3 : z.resta);
    return v;
}

// Un punt interactiu sense res a dir (diàleg buit i sense efecte) no és interactiu. Només es mira als diàlegs del registre DIALEGS (funcions pures
// de l'estat): les funcions que fan alguna cosa en cridar-les (girar un engranatge, el volant de l'Home del Raïm...) no s'han d'executar mai per mirar-ho.
let _dialegsPurs = null;
function esDialegBuit(dialeg) {
    let d = dialeg;
    if (typeof dialeg === 'function') {
        _dialegsPurs = _dialegsPurs || new Set(Object.values(DIALEGS).filter(v => typeof v === 'function'));
        if (!_dialegsPurs.has(dialeg)) return false;
        d = dialeg(Estat);
    }
    return !!(d && d.pagines && !d.pagines.length && !d.enAcabar);
}

// Les bestioles que es ressalten als llocs foscos (ZonaBase.ressaltarEnemics)
const BESTIOLES_FOSQUES = ['escolopendra', 'gripau', 'bolet', 'bolet_verinos', 'ratpenat', 'ferralla'];

// VIATGE RÀPID: el carro de vapor (al codi, 'carruatge') del Follet del Carro Verd (el va fer el Galf). A cada parada hi ha el carruatge i l'home;
// parlant-hi la primera vegada la parada queda desbloquejada (flag parada_<id>) i després s'hi pot viatjar entre les desbloquejades.
// c: peu del carruatge · h: l'home · a: on apareix l'Ineu en arribar
const PARADES = [
    { id: 'era',       zona: 'ZonaEra',        nom: "L'Era",              c: [260, 1230],  h: [410, 1245],  a: [300, 1285] },
    { id: 'bassadoria', zona: 'ZonaCreu',      nom: 'La Bassadòria',      c: [250, 900],  h: [400, 915],  a: [290, 955] },
    { id: 'celles',    zona: 'ZonaCelles',     nom: 'Les Cel·les',        c: [610, 960],  h: [760, 975],  a: [650, 1015] },
    { id: 'cirosa',    zona: 'ZonaCirosa',     nom: 'La Cirosa',          c: [1310, 1120],  h: [1460, 1135],  a: [1350, 1175] },
    { id: 'santantoni', zona: 'ZonaSantAntoni', nom: 'Sant Antoni',       c: [260, 1010],  h: [410, 1025],  a: [300, 1065] },
    { id: 'diposits',  zona: 'ZonaGabriel',    nom: 'Sant Gabriel',       c: [1150, 990], h: [1300, 1005], a: [1210, 1050] }
];

const PAS_PORTA = 44;       // en passar una porta (o qualsevol sortida), l'Ineu camina aquests píxels més cap a la foscor abans de canviar d'escena, i en arribar en camina altres tants cap endins
const MS_PAS_PORTA = 450;
const TOPE_Y = 100;   // els peus de l'Ineu no passen d'aquí amunt: sempre se li veu el cos (la càmera s'atura a y=0)

// ---------- Rendiment: el decorat dibuixat amb codi, a una imatge ----------
// Un Graphics es torna a dibuixar sencer (totes les seves ordres) a cada fotograma: amb molts traços (parets de cova, terres
// fets de lloses, plomes...) costa molt als mòbils justets. Quan la zona ja és construïda, els Graphics grans i fixos es passen
// a una imatge (RenderTexture) un sol cop, al mateix lloc i a la mateixa profunditat; es veuen igual i no cal descarregar res.
// Només es toquen els que segur que no canvien: els que l'escena no guarda enlloc (cap propietat ni llista seva), sense tweens,
// visibles i opacs, sense màscara, gir, escala, mode de fusió ni contenidor, i sense transformacions dins del dibuix.
const ARGS_ORDRE_GRAFIC = { 0: 7, 1: 0, 2: 0, 3: 4, 4: 2, 5: 2, 6: 3, 7: 2, 8: 0, 9: 0, 10: 6, 11: 6, 14: 0, 15: 0, 21: 8, 22: 6 };
function limitsGrafic(g) {
    const c = g.commandBuffer;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, gruix = 0;
    const pt = (x, y, r = 0) => { x0 = Math.min(x0, x - r); y0 = Math.min(y0, y - r); x1 = Math.max(x1, x + r); y1 = Math.max(y1, y + r); };
    for (let i = 0; i < c.length; ) {
        const o = c[i], n = ARGS_ORDRE_GRAFIC[o];
        if (n === undefined) return null;                       // translate, scale, rotate o una ordre desconeguda: no es toca
        if (o === 0) pt(c[i + 1], c[i + 2], c[i + 3]);
        else if (o === 3) { pt(c[i + 1], c[i + 2]); pt(c[i + 1] + c[i + 3], c[i + 2] + c[i + 4]); }
        else if (o === 4 || o === 5) pt(c[i + 1], c[i + 2]);
        else if (o === 10 || o === 11) { pt(c[i + 1], c[i + 2]); pt(c[i + 3], c[i + 4]); pt(c[i + 5], c[i + 6]); }
        else if (o === 6 || o === 22) gruix = Math.max(gruix, c[i + 1]);
        i += 1 + n;
    }
    if (x0 === Infinity) return null;
    const m = gruix / 2 + 3;
    return { x: Math.floor(x0 - m), y: Math.floor(y0 - m), w: Math.ceil(x1 - x0 + 2 * m), h: Math.ceil(y1 - y0 + 2 * m) };
}
function fixarDecorat(escena, minim = 200) {
    if (!escena.sys.game.renderer || escena.sys.game.renderer.type !== Phaser.WEBGL) return;
    // Tot el que l'escena guarda (propietats, llistes i objectes simples, fins a quatre nivells): això pot canviar més endavant
    const guardats = new Set(), vist = new Set();
    const cerca = (v, n) => {
        if (!v || typeof v !== 'object' || vist.has(v) || n > 4) return;
        vist.add(v);
        if (v instanceof Phaser.GameObjects.GameObject) { guardats.add(v); if (!(v instanceof Phaser.GameObjects.Container)) return; v.list.forEach(x => cerca(x, n + 1)); return; }
        if (Array.isArray(v)) { v.forEach(x => cerca(x, n + 1)); return; }
        if (Object.getPrototypeOf(v) === Object.prototype) Object.values(v).forEach(x => cerca(x, n + 1));
    };
    Object.keys(escena).forEach(k => cerca(escena[k], 0));
    escena.children.list.filter(o => o.type === 'Graphics').forEach(g => {
        if (g.commandBuffer.length < minim || guardats.has(g) || !g.visible || g.alpha !== 1 || g.blendMode !== 0 || g.mask || g.parentContainer
            || g.rotation || g.scaleX !== 1 || g.scaleY !== 1 || g.scrollFactorX !== 1 || g.scrollFactorY !== 1 || g.depth >= 85000 || escena.tweens.getTweensOf(g).length) return;
        const b = limitsGrafic(g);
        if (!b || b.w > 2048 || b.h > 2048 || b.w < 1 || b.h < 1) return;
        const x = g.x + b.x, y = g.y + b.y;
        const rt = escena.add.renderTexture(x, y, b.w, b.h).setOrigin(0).setDepth(g.depth);
        rt.draw(g, -x, -y);
        escena.children.moveTo(rt, escena.children.getIndex(g));          // mateix lloc a la llista: el mateix ordre de dibuix
        g.destroy();
    });
}

// ATRIBUTS A REINICIAR cada vegada que s'entra en una zona. Phaser reutilitza la mateixa escena (el constructor només corre un cop), de manera que tot el que
// una visita deixa guardat a l'escena (objectes ja destruïts, indicadors d'una cinemàtica a mig fer...) tornaria a la visita següent i la trencaria.
// Aquí hi ha el que es crea només en alguns casos o dins d'un esdeveniment i després es consulta amb «if (this.x)»; la resta es refà a construir().
const REINICI_BASE = {
    despertarImg: null, dialegDePunt: false, puntActiu: null, twCinema: null, boundsCinema: null, paradaAqui: null,
    ineuAlt: null, ineuAltObjecte: null, ineuAixecaEfecte: null, ineuAixecaAura: null, fonsTex: null, fonsSprite: null, proxPas: 0, altrePas: false, caminantAuto: false
};
const REINICI_ZONES = {
    ZonaTaverna: { portaTaverna: null, portaOberta: false },
    ZonaSotaTaverna: { portaOberta: false },
    ZonaJardi: { obrintLlosa: false },
    ZonaCasaGranInt: { colTrapa: null, gemmes: null, runesCercle: null, avisFosc: null, brillVolant: null, reixaBoss: false, colSecreta: null, estatuaFinal: null, reixaEstavaOberta: false, volDespertar: false, raimPas: 0, colReixa: null, barrots: null, barra: null, estatua: null, colEstatua: null, llosaTrapa: null, llumTrapa: null, engranatge: null, manetaVolant: null, volant: null, pedestal: null, boss: null },
    ZonaBosc: { fontBrilla: null, llumLila: null },
    ZonaRuines: { ombraForta: false, pergamiBrill: null },
    ZonaTiller: { avisArrels: false, sopar: null },
    ZonaDipositos: { tripodeMuntat: false, llumEstel: null, estelCaient: false, colBoira: null, boiraDolmen: null },
    ZonaBoscPi: { camPi: false, camPiFins: 0 },
    ZonaCirosa: { aldreuPunt: null },
    ZonaPassadis: { contrallum: null },
    ZonaCementiri: { boiraTomba: null, llumTomba: null },
    ZonaGirgoles: { colCortina: null },
    ZonaTortura: { colRastell: null },
    ZonaBoira: { bombollesV: null, colBoira: null, avisBoira: 0 },
    ZonaGabia: { colPont: null, llumCapolls: null, espurnesCapolls: null },
    ZonaGirgolesFora: { colPorta: null, boiraPorta: null },
    ZonaCelles: { colBoira: null, fosc: null, colCarro: null, colRosansa: null, rosansa: null, carroRosansa: null },
    ZonaCambraDolora: { dolora: null, boiraCapoll: null, capoll: null }
};

class ZonaBase extends Phaser.Scene {
    constructor(key, config) {
        super(key);
        this.config = config;
    }

    init(data) {
        Object.assign(this, REINICI_BASE, REINICI_ZONES[this.constructor.name]);
        this.dadesEntrada = data || {};
        this.canviant = false;
        this.camDialeg = null;
        this.bancsEsg = []; this.assegut = false; this.davantBanc = null; this.npcs = {}; this.opacs = []; this.npcDavant = null; this.camCinema = false; this.camArma = false; this.efectesArma = null; this.ineuFlautaImg = null; this.ineuAmagat = false;          // (l'escena es reaprofita: res de la visita anterior)
        this.boundsCamOrig = null;
        this.twCamDialeg = null;
        this.entradaPropia = false;
    }

    create() {
        const c = this.config;
        Estat.dades.zona = this.scene.key;
        const primeraVisita = !Estat.flag('visitada_' + this.scene.key);       // (per al pla de situació d'entrada)
        Estat.posaFlag('visitada_' + this.scene.key); // el mapa només mostra el que s'ha visitat
        // Si s'hi arriba després d'una derrota (el Pare Jordà et recull), sona la música de l'església durant tota l'escena; en acabar entra la de la zona
        if (Estat.caigut) Joc.iniciarMusica(this, 0, Joc.MUSICA_ZONES.ZonaEsglesia, 1500); else Joc.musicaZona(this);
        // Red de seguretat: si passat un moment una zona amb música no en té cap (o la que sona no és la seva), s'hi posa la de la zona
        this.time.delayedCall(1500, () => {
            const clau = Joc.MUSICA_ZONES[this.scene.key];
            if (!this.sys.isActive() || !clau || Estat.caigut || this.canviant || Joc.musicaPendent) return;
            if (!Joc.musica || !Joc.musica.isPlaying) Joc.musicaZona(this);
        });
        const uiB = this.ui();                         // si es venia d'un combat de boss (o s'hi ha caigut), fora barra i franges
        if (uiB && uiB.boss) uiB.amagarBarraBoss(true);
        if (uiB && uiB.frangesG) uiB.franges(false, 10);

        // La caixa dels peus fa 30 d'alt. Als interiors el món s'allarga una mica per sota: la porta es traspassa de debò
        this.physics.world.setBounds(0, TOPE_Y - 30, c.amplada, c.alcada - TOPE_Y + 30 + (this.esInterior() ? PROFUNDITAT_PORTA + 50 : 0));
        this.obstacles = this.physics.add.staticGroup();
        this.interactius = [];
        this.llocsFlauta = [];
        this.sortides = [];
        this.enemics = []; this.copes = []; this.atacantFins = 0;
        this.esbarzers = [];
        this.barrils = [];
        this.graonsLlista = [];
        this.caient = false;
        this.forcat = null;
        this.cop = null; this.armaNet = null; this.atacFins = 0;
        this.invulnerableFins = 0;
        this.cintaGastada = false;

        this.sols = [];
        this.pedresMobils = [];
        this.camins = [];     // rectangles de camí de terra: es fusionen i es dibuixen amb vores suaus (construirCamins)
        this.extraSud = 0;
        this.yTall = Infinity;
        this.preparaTweens();
        this.portesInt = [];
        this.portesAnim = [];
        Grafics.epoca++;
        this.llumsDiferides = [];
        this.llumsSortida = [];
        this.construir();
        if (Proves.actiu) PARADES.forEach(pd => Estat.posaFlag('parada_' + pd.id));      // a proves, totes les parades conegudes (també amb partides de proves velles)
        PARADES.filter(pd => pd.zona === this.scene.key).forEach(pd => this.parada(pd));     // el carruatge de vapor, si aquí n'hi ha parada
        this.obrirPortes();
        this.ampliarSud();
        const diferides = this.llumsDiferides; this.llumsDiferides = null;
        diferides.forEach(sd => { if (!sd.pendentLlum) this.marcarSortida(sd.r); });          // les llums de les sortides, ja a la seva posició definitiva
        this.ponFonsContinu();
        this.construirCamins();
        this.crearIneu();
        this.events.on('postupdate', this.postFisica, this);              // (es treu en tancar l'escena: l'escena es reaprofita)
        this.events.once('shutdown', () => this.events.off('postupdate', this.postFisica, this));
        this.posarBoiraSortides();
        this.posarBoiraGeneral();
        Grafics.alliberar(this.textures, this.scene.key);      // fora les textures grans de la zona anterior (vegeu Grafics, a assets.js)

        const cam = this.cameras.main;
        cam.setViewport(0, ALT_HUD, AMPLE, ALT - ALT_HUD);   // la franja de dalt és per al HUD: no s'hi dibuixa escenari
        const zoomZona = this.zoomZona || Math.min(ZOOM_MAX_ZONA, ZOOM_CAMERA * (ZOOM_ZONES[this.scene.key] || 1));
        this.zoomZona = zoomZona;          // (també el fan servir alliberarCamera i el Dolmen per tornar al zoom de la zona)
        cam.setZoom(zoomZona);
        this.zoomBase = zoomZona;
        // Si el món és més petit que la pantalla (interiors), es centra en lloc de quedar enganxat a una vora
        const vw = AMPLE / zoomZona, vh = (ALT - ALT_HUD) / zoomZona, alcadaMon = c.alcada + this.extraSud;
        const bx = Math.max(0, (vw - c.amplada) / 2), by = Math.max(0, (vh - alcadaMon) / 2);
        cam.setBounds(-bx, -by, c.amplada + 2 * bx, alcadaMon + 2 * by);
        cam.startFollow(this.ineu, false, 0.12, 0.12, 0, this.cameraFollowOffsetY || 0);
        cam.setBackgroundColor(c.colorFons || '#2d4a22');
        cam.fadeIn(350, 0, 0, 0);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.tecles = this.input.keyboard.addKeys('W,A,S,D,E,SPACE,ENTER,J,M');

        // Indicador "!" sobre el punt interactiu més proper
        this.indicador = this.add.text(0, 0, '!', estilText(28, '#ffd34d', { stroke: '#000', strokeThickness: 5, fontStyle: 'bold' }))
            .setOrigin(0.5, 1).setDepth(99999).setVisible(false);
        this.tweens.add({ targets: this.indicador, scale: 1.2, yoyo: true, repeat: -1, duration: 350 });

        const ui = this.ui();
        ui.actualitzarHUD();
        ui.mostrarZona(c.nom);

        // Autodesat en entrar a una zona
        this.guardarPosicio();
        Estat.desar();

        if (this.enEntrar) this.enEntrar();
        if (this.dadesEntrada.entrada && !this.dadesEntrada.restaurar && !Estat.caigut && !this.entradaPropia) this.pasEntrada(this.posEntrada);
        const caigut = Estat.caigut;
        if (Estat.caigut) {
            Estat.caigut = false;
            this.despertarCaigut();
        }
        this.entradaZoom(primeraVisita, caigut);
        fixarDecorat(this);
    }

    // Zoom d'entrada (design/PLA_ZOOM.md): als interiors, un acostament des del zoom de fora fins al de la sala; a les zones clau, el primer cop, un pla de situació
    // (comença una mica més lluny i s'acosta lentament). No es fa si l'escena porta ja la seva càmera (cinema, diàleg, caiguda, entrada pròpia).
    entradaZoom(primera, caigut) {
        this.camEntrada = false;
        const cam = this.cameras.main, base = this.zoomBase;
        if (this.twEntrada) { this.twEntrada.stop(); this.twEntrada = null; }
        if (this.camCinema || this.camDialeg || this.entradaPropia || caigut || !base) return;
        let des = 0, ms = 0;
        if (this.esInterior() && base > ZOOM_CAMERA * 1.05) { des = ZOOM_CAMERA; ms = 900; }
        else if (primera && ZONES_CLAU.includes(this.scene.key)) { des = base * 0.94; ms = 1500; }
        if (!des) return;
        this.camEntrada = true;
        cam.setZoom(des);
        const v = { u: 0 };
        this.twEntrada = this.tweens.add({
            targets: v, u: 1, duration: ms, ease: 'Sine.easeInOut',
            onUpdate: () => { cam.setZoom(Phaser.Math.Linear(des, base, v.u)); this.ajustarSuperposicions(); },
            onComplete: () => { cam.setZoom(base); this.camEntrada = false; this.twEntrada = null; this.ajustarSuperposicions(); }
        });
    }

    // Una càmera pròpia (diàleg o cinema) talla el zoom d'entrada i deixa la zona al seu zoom base
    tallarEntradaZoom() {
        if (!this.camEntrada) return;
        if (this.twEntrada) { this.twEntrada.stop(); this.twEntrada = null; }
        this.camEntrada = false;
        this.cameras.main.setZoom(this.zoomBase);
        this.ajustarSuperposicions();
    }

    // Després d'una derrota: l'Ineu a terra, i de cop el Pare Jordà agenollat al seu costat; en tancar el diàleg l'Ineu s'aixeca
    despertarCaigut() {
        const ui = this.ui(), I = this.ineu;
        const dialeg = { pagines: [{ qui: 'Pare Jordà', text: 'Ineu! Que et trobo a terra! Respira, fill. Has de tenir més cura. Ja estàs bé?' }] };
        if (!this.textures.exists('ineu_inconscient') || !this.textures.exists('pare_jorda_desperta')) {
            this.time.delayedCall(600, () => ui.obrirDialeg(dialeg, () => Joc.musicaZona(this, 3000)));
            return;
        }
        const esc = this.textures.get('ineu_inconscient').customData.escala || 1 / RES;
        const terra = this.add.image(I.x, I.y, 'ineu_inconscient').setOrigin(0.5, 0.85).setScale(esc).setDepth(I.y + 1);
        const veu = [I, this.fantasma, this.ombraIneu].filter(Boolean);
        veu.forEach(o => o.setVisible(false));
        this.canviant = true;
        // L'Ineu és a terra i no passa res fins que el jugador fa clic, toca la pantalla o prem ESPAI/ENTER: llavors apareix el Pare Jordà i comença el diàleg
        let fase = 0;                                   // 0: a terra, esperant · 1: diàleg · 2: acabat
        const llest = this.time.now + 900;              // un instant perquè un toc o una tecla d'abans no es salti l'escena
        const avis = ui.add.text(AMPLE / 2, ALT - 230, 'Toca la pantalla', estilText(24, '#f1e3b6', { stroke: '#1a120b', strokeThickness: 5 })).setOrigin(0.5).setAlpha(0).setDepth(60);
        ui.tweens.add({ targets: avis, alpha: 0.9, duration: 700, delay: 1200, yoyo: true, repeat: -1, hold: 500 });
        const tecles = ['SPACE', 'ENTER', 'E'];
        let alAccio;
        const neteja = () => {
            tecles.forEach(k => this.input.keyboard.off('keydown-' + k, alAccio));
            ui.input.off('pointerdown', alAccio);
            if (avis.active) { ui.tweens.killTweensOf(avis); avis.destroy(); }
        };
        alAccio = ev => {
            const esTecla = !!(ev && ev.key !== undefined);
            if (esTecla && ev.repeat) return;
            if (fase === 0) {
                if (this.time.now < llest) return;
                fase = 1;
                if (avis.active) { ui.tweens.killTweensOf(avis); avis.destroy(); }
                // un instant després, perquè el mateix toc no avanci també la primera pàgina
                this.time.delayedCall(30, () => {
                    terra.setTexture('pare_jorda_desperta');
                    this.despertarImg = terra;
                    ui.obrirDialeg(dialeg, () => {
                        fase = 2;
                        neteja();
                        this.despertarImg = null;
                        terra.destroy();
                        veu.forEach(o => o.setVisible(true));
                        this.canviant = false;           // (el cicle torna a córrer i la càmera del diàleg es restableix sola)
                        ui.accioTactil = false;          // un toc que hagi quedat pendent no ha de fer cap acció en tornar el control
                        Joc.musicaZona(this, 3000);      // ara la música de la zona, que entra poc a poc
                    });
                    this.camaraDialeg(true);             // el cicle no corre mentre dura aquesta escena: cal buscar-hi la càmera aquí, perquè el diàleg no tapi el Pare Jordà
                });
            } else if (fase === 1 && esTecla && ui.dialeg && !ui.menuObert) ui.avancar();      // el cicle de la zona no corre mentre dura l'escena: el teclat s'ha de llegir aquí (el toc ja el llegeix la UI)
        };
        tecles.forEach(k => this.input.keyboard.on('keydown-' + k, alAccio));
        ui.input.on('pointerdown', alAccio);
        this.events.once('shutdown', neteja);
    }

    ui() { return this.scene.get('UI'); }

    // L'Ineu ho pensa en veu alta: un quadre de diàleg amb el seu retrat i entre parèntesis (com els seus pensaments). Si ja n'hi ha un
    // d'obert, espera que es tanqui (fins a uns 6 s) en lloc d'apilar-ne un altre.
    ineuDiu(text, fet, intents = 0) {
        const ui = this.ui();
        if (!ui) { if (fet) fet(); return; }
        if (ui.dialeg) {
            if (intents < 12) this.time.delayedCall(500, () => this.ineuDiu(text, fet, intents + 1));
            else if (fet) fet();
            return;
        }
        ui.obrirDialeg({ pagines: [{ qui: 'Ineu', text: '(' + text + ')' }] }, fet);
    }

    // ---------------- Viatge ràpid ----------------
    parada(pd) {
        const [cx, cy] = pd.c, [hx, hy] = pd.h;
        const carro = this.posar('carruatge', cx, cy, { col: { w: 190, h: 40 }, opac: true }).setFlipX(true);     // girat: el davant mira cap a l'escena
        // el fum blanc de la xemeneia (la xemeneia és a l'esquerra del dibuix, que està girat): animat per codi, sempre blanc
        this.carroParada = carro;
        const ox = 107 * carro.scaleX - 8, oy = -carro.displayHeight + 6;             // la xemeneia, respecte al peu del carruatge (si la zona s'amplia cap al sud, el carruatge es mou i el fum el segueix)
        const fum = this.add.particles(carro.x + ox, carro.y + oy, 'fum', {
            speedY: { min: -34, max: -20 }, speedX: { min: -9, max: 7 }, accelerationX: 1, lifespan: { min: 2400, max: 3400 },
            scale: { start: 0.16, end: 0.95 }, alpha: { start: 0.85, end: 0 }, rotate: { min: -25, max: 25 }, frequency: 260, quantity: 1
        }).setDepth(cy + 1);
        // El motor en marxa: el carruatge vibra una mica (uns píxels, ràpid) i el fum surt de la xemeneia quieta, sense vibrar
        let bx = null, by = null;
        const motor = (t) => {
            if (!carro.active || !fum.active) return;
            if (bx === null) { bx = carro.x; by = carro.y; }                   // (la posició de repòs, un cop la zona ja s'ha ampliat cap al sud)
            carro.setPosition(bx + Math.sin(t / 31) * 0.45, by + Math.sin(t / 23 + 1) * 0.55 + (Math.random() - 0.5) * 0.35);
            carro.setRotation(Math.sin(t / 47) * 0.0035);
            fum.setPosition(bx + ox, by + oy);
        };
        fum.setPosition(carro.x + ox, carro.y + oy);
        this.events.on('update', motor);
        this.events.once('shutdown', () => this.events.off('update', motor));
        this.npc('follet_carro', hx, hy, () => DIALEGS.cotxer(Estat, pd.id), { flipX: true, colAmple: 48 });     // girat: mira cap a l'escena, no cap al carruatge
        this.paradaAqui = pd;
        if (Estat.arribadaCarruatge === pd.id) {                       // hi acabem d'arribar: bufada de vapor
            Estat.arribadaCarruatge = null;
            this.time.delayedCall(250, () => { this.vaporPuf(carro.x + ox, carro.y + oy + 20); this.vaporPuf(this.ineu.x, this.ineu.y - 20); });
        }
    }

    // Una bufada de vapor blanc (sempre blanc): arribada i sortida del carruatge
    vaporPuf(x, y) {
        const p = this.add.particles(x, y, 'fum', { speed: { min: 12, max: 60 }, angle: { min: 200, max: 340 }, scale: { start: 0.35, end: 1.2 }, alpha: { start: 0.75, end: 0 },
            lifespan: { min: 900, max: 1500 }, rotate: { min: -40, max: 40 }, quantity: 9, emitting: false }).setDepth(99990);
        p.explode(9);
        this.time.delayedCall(1700, () => p.destroy());
    }

    // Tria el destí entre les parades desbloquejades i hi viatja
    triarViatge(fet) {
        const aqui = this.paradaAqui, ui = this.ui();
        const destins = PARADES.filter(pd => pd !== aqui && Estat.flag('parada_' + pd.id));
        const perill = (this.enemics || []).some(e => !e.mort && Phaser.Math.Distance.Between(e.spr.x, e.spr.y, this.ineu.x, this.ineu.y) < 260);
        if (perill) { fet(); this.ineuDiu('Ara no: hi ha bèsties a prop.'); return; }
        ui.triarLlista([...destins.map(pd => pd.nom), 'Res, gràcies'], i => {
            fet();
            if (i < destins.length) this.time.delayedCall(200, () => this.viatjar(destins[i]));
        });
    }

    viatjar(pd) {
        if (this.canviant) return;
        this.canviant = true;
        this.ineu.body.setVelocity(0);
        Sfx.vapor();
        if (this.carroParada && this.carroParada.active) this.vaporPuf(this.carroParada.x + 107 * this.carroParada.scaleX, this.carroParada.y - this.carroParada.displayHeight + 26);
        Estat.dades.zona = pd.zona; Estat.dades.entrada = null;
        Estat.dades.x = pd.a[0]; Estat.dades.y = pd.a[1];
        Estat.arribadaCarruatge = pd.id;
        this.cameras.main.fadeOut(700, 235, 240, 235);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start(pd.zona, { restaurar: true }));
    }

    // ---------------- Construcció ----------------
    // Fons repetit (herba, llambordes...) en una àrea
    terra(key, x, y, w, h, profunditat = -1000) {
        // Els camins (i els replans) de l'exterior són sempre de terra, amb vora suau i corbes
        if ((key === 'cami' || key === 'pedra') && profunditat === -1000 && !this.esInterior()) {
            const r = { x, y, w, h, alfa: 1 };
            this.camins.push(r);
            const stub = { setAlpha: a => { r.alfa = a; return stub; }, setTint: () => stub };
            return stub;
        }
        const t = this.add.tileSprite(x, y, w, h, key).setOrigin(0).setTileScale(1 / RES).setDepth(profunditat);
        this.sols.push(t);
        if (profunditat === -1100 && x === 0 && y === 0 && !this.fonsTex) { this.fonsTex = key; this.fonsSprite = t; }      // el terra de tota la zona: és el que es continua fora dels límits
        return t;
    }

    // Fora dels límits de la zona (quan la càmera s'allunya o es mou fora, com en un diàleg) es veu el mateix terra, continuant-lo, i no un color pla.
    // Els interiors (sales fosques) es queden amb el seu color de fons.
    // Memòria: un TileSprite fa un llenç de la seva mida (Safari el compta encara que no s'hi dibuixi); el de tota la zona més 1600 px
    // per banda eren ~95 MB. Ara és de la mida de la vista (i creix si la càmera s'allunya, com als diàlegs) i segueix la càmera saltant
    // de rajola en rajola: es veu igual.
    ponFonsContinu() {
        if (!this.fonsTex || this.esInterior() || !this.textures.exists(this.fonsTex)) return;
        const per = Math.max(8, this.textures.get(this.fonsTex).getSourceImage().width / RES);        // el que fa una rajola al món: la quadrícula queda alineada amb la del terra
        const cam = this.cameras.main;
        const mida = z => [(Math.ceil(AMPLE / z / per) + 2) * per, (Math.ceil((ALT - ALT_HUD) / z / per) + 2) * per];
        const [w0, h0] = mida(Math.min(ZOOM_CAMERA, cam.zoom));
        const f = this.add.tileSprite(0, 0, w0, h0, this.fonsTex).setOrigin(0).setTileScale(1 / RES).setDepth(-1500);
        if (this.fonsSprite && this.fonsSprite.isTinted) f.setTint(this.fonsSprite.tintTopLeft);
        const seguir = () => {
            const [w, h] = mida(cam.zoom);
            if (w > f.width || h > f.height) f.setSize(Math.max(w, f.width), Math.max(h, f.height));
            const cx = cam.scrollX + cam.width / 2, cy = cam.scrollY + cam.height / 2;              // el centre de la vista, al món
            f.setPosition(Math.floor((cx - f.width / 2) / per) * per, Math.floor((cy - f.height / 2) / per) * per);
        };
        seguir();
        this.events.on('postupdate', seguir);
        this.events.once('shutdown', () => this.events.off('postupdate', seguir));
    }

    // Interior = sala fosca (colorFons molt fosc): es dibuixa centrada i no s'allarga
    esInterior() {
        const h = (this.config.colorFons || '').replace('#', '');
        if (h.length !== 6) return false;
        return [0, 2, 4].reduce((t, i) => t + parseInt(h.slice(i, i + 2), 16), 0) < 70;
    }

    // y d'una posició dissenyada abans d'ampliar la zona -> y real
    mapY(y) { return y >= this.yTall ? y + this.extraSud : y; }

    // Els tweens amb un 'y' fix (flotar, balancejar-se) s'han de moure amb l'objecte quan es desplaça
    preparaTweens() {
        const t = this.tweens;
        if (!t.afegirOriginal) t.afegirOriginal = t.add;
        t.add = cfg => {
            if (cfg && typeof cfg.y === 'number') { const v = cfg.y; cfg = Object.assign({}, cfg, { y: () => this.mapY(v) }); }
            return t.afegirOriginal.call(t, cfg);
        };
    }

    // La pantalla vertical és més alta que la majoria de zones. S'afegeix terra al sud: tot el que
    // és a la franja de baix (vora sud, sortides) baixa, i el terra que la travessa s'allarga.
    ampliarSud() {
        const c = this.config;
        const extra = this.esInterior() ? 0 : Math.ceil((ALT - ALT_HUD) / ZOOM_CAMERA) - c.alcada;
        if (extra <= 0) return;
        const tall = c.alcada - BANDA_SUD;
        this.extraSud = extra;
        this.yTall = tall;

        const sols = new Set(this.sols);
        this.sols.forEach(t => {
            if (t.y >= tall) t.y += extra;
            else if (t.y + t.height > tall) t.setSize(t.width, t.height + extra);
        });
        this.camins.forEach(r => {
            if (r.y >= tall) r.y += extra;
            else if (r.y + r.h > tall) r.h += extra;
        });
        this.children.list.forEach(go => {
            if (sols.has(go) || go.scrollFactorY === 0 || go.type === 'Graphics' || go.y < tall) return;
            go.y += extra;
            if (go.depth >= 0 && go.depth < 50000) go.setDepth(go.depth + extra);
            if (go.body && go.body.updateFromGameObject && go.body.physicsType === Phaser.Physics.Arcade.STATIC_BODY) go.body.updateFromGameObject();
        });
        this.interactius.concat(this.esbarzers).forEach(o => { if (o.y >= tall) o.y += extra; });
        this.sortides.forEach(s => {
            if (s.r.y >= tall) s.r.y += extra;
            else if (s.r.bottom >= c.alcada - 20) s.r.height += extra;
        });
        this.physics.world.setBounds(0, TOPE_Y - 30, c.amplada, c.alcada + extra - TOPE_Y + 30);

        // Les vores laterals continuen per la franja nova
        if (this.textures.exists('arbre')) {
            // (una capçada fa uns 340 d'alt: els arbres que en taparien una sortida lateral es deixen)
            const tapa = (x, y) => this.sortides.some(s => s.r.width <= 40 && Math.abs(s.r.centerX - x) < 60 && s.r.bottom > y - 340 && s.r.y < y + 40);
            for (let y = tall + 60; y < tall + extra; y += 90) {
                if (!tapa(24, y)) this.posar('arbre', 24, y);
                if (!tapa(c.amplada - 24, y)) this.posar('arbre', c.amplada - 24, y);
            }
        }
    }

    // Camins de terra: tots els rectangles es fusionen en un sol mapa de baixa resolució que s'enfosqueix (desenfocament)
    // i es talla amb una rampa suau. Així les vores es difuminen cap a l'herba, les cantonades s'arrodoneixen
    // i els encreuaments fan corbes en lloc d'angles rectes.
    construirCamins() {
        const rs = this.camins.filter(r => r.alfa > 0);
        if (!rs.length || !this.textures.exists('cami')) return;
        // El món real acaba a H0; però la càmera del diàleg pot ensenyar-ne fins a ~450 px més avall (per veure els dos que parlen sobre el quadre de text):
        // els camins que arriben a la vora sud hi continuen, perquè allà no es vegi herba on hi hauria el camí
        const W = this.config.amplada, H0 = this.config.alcada + this.extraSud, H = H0 + (this.esInterior() ? 0 : 450);
        const MG = 64, CEL = 4, RAD = 5;
        const gw = Math.ceil((W + 2 * MG) / CEL), gh = Math.ceil((H + 2 * MG) / CEL);
        let a = new Float32Array(gw * gh), b = new Float32Array(gw * gh);

        rs.forEach(r => {
            // Un camí que arriba a la vora del món continua més enllà, perquè no es difumini allà
            const x0 = r.x <= 2 ? -MG : r.x, y0 = r.y <= 2 ? -MG : r.y;
            const x1 = r.x + r.w >= W - 2 ? W + MG : r.x + r.w, y1 = r.y + r.h >= H0 - 2 ? H + MG : r.y + r.h;
            for (let j = 0; j < gh; j++) {
                const wy = (j + 0.5) * CEL - MG;
                if (wy < y0 || wy > y1) continue;
                for (let i = 0; i < gw; i++) {
                    const wx = (i + 0.5) * CEL - MG;
                    if (wx >= x0 && wx <= x1 && a[j * gw + i] < r.alfa) a[j * gw + i] = r.alfa;
                }
            }
        });

        // Desenfocament de caixa separable (quatre passades ~ gaussiana)
        const desenfoca = (s, d, horitz) => {
            const n = horitz ? gw : gh, m = horitz ? gh : gw, pas = horitz ? 1 : gw, sal = horitz ? gw : 1;
            for (let l = 0; l < m; l++) {
                const base = l * sal;
                let suma = 0;
                for (let k = -RAD; k <= RAD; k++) suma += s[base + Math.min(n - 1, Math.max(0, k)) * pas];
                for (let k = 0; k < n; k++) {
                    d[base + k * pas] = suma / (2 * RAD + 1);
                    suma += s[base + Math.min(n - 1, k + RAD + 1) * pas] - s[base + Math.max(0, k - RAD) * pas];
                }
            }
        };
        desenfoca(a, b, true); desenfoca(b, a, false); desenfoca(a, b, true); desenfoca(b, a, false);

        // Soroll de valors: fa que la vora del camí ondulegi una mica
        const hash = (x, y) => { const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); };
        const soroll = (x, y) => {
            const xi = Math.floor(x), yi = Math.floor(y), u = x - xi, v = y - yi;
            const su = u * u * (3 - 2 * u), sv = v * v * (3 - 2 * v);
            const f = (p, q, t) => p + (q - p) * t;
            return f(f(hash(xi, yi), hash(xi + 1, yi), su), f(hash(xi, yi + 1), hash(xi + 1, yi + 1), su), sv);
        };

        const mascara = document.createElement('canvas');
        mascara.width = gw; mascara.height = gh;
        const mctx = mascara.getContext('2d');
        const px = mctx.createImageData(gw, gh);
        for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
            const k = j * gw + i;
            const ona = (soroll(i / 7, j / 7) - 0.5) * 0.30 + (soroll(i / 2.5 + 40, j / 2.5) - 0.5) * 0.12;
            const t = Math.min(1, Math.max(0, (a[k] + ona - 0.28) / 0.44));
            px.data[k * 4] = px.data[k * 4 + 1] = px.data[k * 4 + 2] = 255;
            px.data[k * 4 + 3] = Math.round(t * t * (3 - 2 * t) * 255);
        }
        mctx.putImageData(px, 0, 0);

        // Es talla en blocs perquè cap textura passi del límit de la targeta gràfica. Memòria: es dibuixa a 3/4 de la mida del món
        // (ESC) i la imatge s'amplia: ocupa poc més de la meitat i, amb la vora difuminada i la terra, no es nota
        const peca = this.textures.get('cami').getSourceImage(), LIM = 2048, ESC = 0.75;
        let n = 0;
        for (let cy = 0; cy < H; cy += LIM) for (let cx = 0; cx < W; cx += LIM) {
            const cw = Math.min(LIM, W - cx), ch = Math.min(LIM, H - cy);
            const cv = document.createElement('canvas');
            cv.width = Math.ceil(cw * ESC); cv.height = Math.ceil(ch * ESC);
            const ctx = cv.getContext('2d');
            ctx.scale(ESC, ESC);
            for (let ty = Math.floor(cy / 64) * 64; ty < cy + ch; ty += 64) {
                for (let tx = Math.floor(cx / 64) * 64; tx < cx + cw; tx += 64) ctx.drawImage(peca, tx - cx, ty - cy, 64, 64);
            }
            ctx.globalCompositeOperation = 'destination-in';
            ctx.imageSmoothingEnabled = true;
            ctx.drawImage(mascara, 0, 0, gw, gh, -MG - cx, -MG - cy, gw * CEL, gh * CEL);
            const clau = 'camins_' + this.scene.key + '_' + (n++);
            if (this.textures.exists(clau)) this.textures.remove(clau);
            this.textures.addCanvas(clau, cv);
            this.add.image(cx, cy, clau).setOrigin(0).setScale(1 / ESC).setDepth(-1040);
        }
    }

    // Imatge del catàleg amb els peus a (x, y). col = { w, h } caixa de col·lisió a la base.
    // fonsY: línia de profunditat (per defecte y); l'Ineu es dibuixa davant si és més avall.
    posar(key, x, y, opts = {}) {
        // Algunes zones (config.pins = { pi, pinyer }: proporcions) canvien una part dels arbres per pins; l'elecció és fixa per posició
        if (key === 'arbre' && this.config.pins && !opts.escala) {
            const h = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1, P = this.config.pins;
            if (h < (P.pi || 0)) key = 'pi'; else if (h < (P.pi || 0) + (P.pinyer || 0)) key = 'pi_pinyer';
            // El tronc dels pins no és al mig del dibuix (el pi, uns 8 px a l'esquerra; el pinyer, uns 34): la caixa de col·lisió s'hi ajusta, i és prou ampla per cobrir les arrels
            if (key !== 'arbre' && !(opts.col && opts.col.fix)) opts = Object.assign({}, opts, { col: key === 'pi' ? { w: 62, h: 18, dx: -8 } : { w: 84, h: 18, dx: -34 } });
        }
        const tex = this.textures.get(key);
        const escala = (tex.customData && tex.customData.escala) || 1 / RES;
        const img = this.add.image(x, y, key).setOrigin(0.5, 1).setScale(escala * (opts.escala || 1));
        img.setDepth(opts.fonsY !== undefined ? opts.fonsY : y);
        if (/^(arbre|xiprer|pi|pi_pinyer|roure|alzina_buida|pinassa|rovello)$/.test(key)) (this.copes = this.copes || []).push(img);   // copes que es tornen translúcides si amaguen un enemic
        if (TRONCS[key]) {          // font de la màscara del tronc (no es dibuixa: només amaga la silueta de l'Ineu quan passa darrere el tronc)
            const f = TRONCS[key], W = img.width, H = img.height;
            img.tronc = this.make.image({ key, add: false }).setOrigin(0.5, 1).setCrop(f[0] * W, f[1] * H, (f[2] - f[0]) * W, (f[3] - f[1]) * H);
            img.troncRect = () => { const sx = Math.abs(img.scaleX), sy = Math.abs(img.scaleY); return new Phaser.Geom.Rectangle(img.x - W * sx / 2 + f[0] * W * sx, img.y - H * sy + f[1] * H * sy, (f[2] - f[0]) * W * sx, (f[3] - f[1]) * H * sy); };
        }
        // Tots els arbres del mateix gràfic tenen el mateix tronc sòlid (arrels incloses), proporcional a l'escala
        if (key === 'arbre' && !(opts.col && opts.col.fix)) opts = Object.assign({}, opts, { col: TRONC_ARBRE(opts.escala || 1) });
        if (opts.col) this.colisio(x + (opts.col.dx || 0), y - opts.col.h / 2 + (opts.col.dy || 0), opts.col.w, opts.col.h);
        // opac: objecte baix (una placa) que no s'ha de veure a través quan l'Ineu hi passa darrere: la silueta translúcida de l'Ineu s'hi amaga com amb els personatges
        // Tot element de decoració sòlid més baix o més estret que l'Ineu (troncs, bancs, taules, pedres, tamborets...) és opac: no se'n veu la silueta a través.
        // (Els arbres i els pins ja tenen la seva pròpia màscara del tronc.)
        const baixOEstret = img.displayHeight <= 120 || img.displayWidth <= 70;
        if (opts.opac || (opts.opac !== false && opts.col && baixOEstret && !img.tronc && !(this.copes || []).includes(img))) (this.opacs = this.opacs || []).push(img);
        return img;
    }

    // Rectangle invisible que bloqueja el pas (centrat a x, y)
    colisio(x, y, w, h) {
        const z = this.add.zone(x, y, w, h);
        this.physics.add.existing(z, true);
        this.obstacles.add(z);
        if (Joc.debug) this.add.rectangle(x, y, w, h).setStrokeStyle(2, 0xff0000).setDepth(99998);
        return z;
    }

    // Punt on es pot prémer ESPAI. dialeg = funció de DIALEGS o funció pròpia que retorna un diàleg.
    interactiu(x, y, radi, dialeg, opts = {}) {
        const punt = { x, y, radi, dialeg, altura: opts.altura || 60, enTancar: opts.enTancar, actiu: opts.actiu, senseMirada: opts.senseMirada };
        this.interactius.push(punt);
        return punt;
    }

    // Personatge quiet amb diàleg (es pot moure amb npcVa: les accions dels diàlegs es fan caminant, no explicant-les)
    npc(key, x, y, dialeg, opts = {}) {
        // Un cop acabada la història, cadascú té una frase nova (DIALEGS_FINAL); si no en té o encara té feina oberta, la de sempre
        if (typeof DIALEGS_FINAL !== 'undefined' && DIALEGS_FINAL[key] && Estat.flag('epilegFet') && dialeg !== DIALEGS.gentEpileg) {
            const final = DIALEGS_FINAL[key], abans = dialeg;
            dialeg = E => final(E) || (typeof abans === 'function' ? abans(E) : abans);
        }
        const tex = this.textures.get(key);
        const escala = (tex.customData && tex.customData.escala) || 1 / RES;
        const idle = false;           // (els fulls d'animació de NPC_IDLE no es fan servir d'idle: només en moments concrets, vegeu animaNpc)
        const img = this.add.sprite(x, y, key).setOrigin(0.5, 1).setScale(escala * (opts.escala || 1));
        img.setDepth(opts.fonsY !== undefined ? opts.fonsY : y);
        img.col = this.colisio(x, y - 9, opts.colAmple || 40, 18);
        img.ombra = this.add.image(x, y, 'ombra').setScale(0.42).setDepth(-500);
        if (opts.flipX) img.setFlipX(true);
        img.escalaBase = img.scaleY;
        if (!idle) this.idleCodi(img, opts.quiet);
        img.punt = this.interactiu(x, y - 10, opts.radi || RADI_NPC, dialeg, { altura: img.displayHeight + 6 });
        if (opts.zoomConversa) img.punt.zoomConversa = opts.zoomConversa;       // més zoom (que ZOOM_NPC) en parlar-hi, perquè s'apreciïn els sprites
        img.punt.npc = img;                                  // en parlar-hi, l'Ineu es fa enrere i no se solapen (vegeu separarDeNpc)
        (this.npcs = this.npcs || {})[key] = img;
        return img;
    }

    // Idle per codi: respira (s'allarga una mica d'alçada i s'estreny d'ample, com un cos que agafa aire) i es balanceja una mica sobre els peus, de manera
    // diferent per a cada un (durada i fase a l'atzar) perquè no vagin tots al compàs. quiet = sense balanceig. Serveix per a qualsevol sprite amb origen als peus
    // (els NPC de npc() ja ho tenen; la resta de personatges que es posen amb posar() hi poden cridar).
    idleCodi(img, quiet = false) {
        const d = 1500 + Math.random() * 700, sy = img.scaleY, sx = img.scaleX;
        img.respira = this.tweens.add({ targets: img, scaleY: sy * 1.028, scaleX: sx * 0.992, yoyo: true, repeat: -1, duration: d, ease: 'Sine.easeInOut', delay: Math.random() * 900 });
        if (!quiet) img.balanceig = this.tweens.add({ targets: img, angle: { from: -0.8, to: 0.8 }, yoyo: true, repeat: -1, duration: d * 2.1, ease: 'Sine.easeInOut', delay: Math.random() * 1500 });
        return img;
    }
    // Atura l'idle per codi (abans de destruir el sprite o de canviar-ne el dibuix)
    aturaIdleCodi(img) { ['respira', 'balanceig'].forEach(k => { if (img[k]) { img[k].stop(); img[k] = null; } }); img.setAngle(0); }

    // Idle frontal d'un NPC: l'animació 'idle_<clau>' en bucle (a un ritme lent i una mica diferent per a cada un, perquè no vagin tots al compàs)
    posaIdleNpc(img, key) {
        if (!this.anims.exists('idle_' + key)) this.anims.create({ key: 'idle_' + key, frames: this.anims.generateFrameNumbers(key + '_idle', { start: 0, end: NPC_IDLE[key].n - 1 }), frameRate: NPC_IDLE[key].fps || 4, repeat: -1 });
        img.idleClau = key;
        img.play({ key: 'idle_' + key, startFrame: Phaser.Math.Between(0, NPC_IDLE[key].n - 1) });
    }
    // Un NPC fa durant 'ms' una animació pròpia (full de NPC_IDLE, p. ex. la Joaneta fent el beuratge) i després torna al seu idle per codi. tipus: espurnes opcionals
    // ('bombolles', 'guspires'...: els mateixos colors que npcFeina). Si no té full, només espera.
    animaNpc(key, ms, fet, tipus) {
        const img = this.npcs && this.npcs[key], d = NPC_IDLE[key];
        if (!img || !d || !this.textures.exists(key + '_idle')) { this.time.delayedCall(ms, () => { if (fet) fet(); }); return; }
        const tween = [img.respira, img.balanceig].filter(Boolean);
        tween.forEach(t => t.pause());
        img.setAngle(0); img.setScale(img.escalaBase, img.escalaBase);
        if (!this.anims.exists('idle_' + key)) this.anims.create({ key: 'idle_' + key, frames: this.anims.generateFrameNumbers(key + '_idle', { start: 0, end: d.n - 1 }), frameRate: d.fps || 8, repeat: -1 });
        img.setTexture(key + '_idle', 0); img.play('idle_' + key);
        const colors = { guspires: [0xffd060, 0xff8030], fulles: [0x6ab04a, 0xe86aa0], bombolles: [0x6aff6a, 0xb8ffb0] }[tipus];
        const ev = colors ? this.time.addEvent({ delay: 200, loop: true, callback: () => {
            const p = this.add.circle(img.x + Phaser.Math.Between(-40, 0), img.y - img.displayHeight * 0.55, 4, Phaser.Utils.Array.GetRandom(colors)).setDepth(img.depth + 1);
            this.tweens.add({ targets: p, x: p.x + Phaser.Math.Between(-30, 30), y: p.y - Phaser.Math.Between(30, 70), alpha: 0, duration: 700, onComplete: () => p.destroy() });
        } }) : null;
        this.time.delayedCall(ms, () => {
            if (ev) ev.remove();
            if (img.active) { img.anims.stop(); img.setTexture(d.fix || key); tween.forEach(t => t.resume()); }
            if (fet) fet();
        });
    }
    // Torna al dibuix d'idle (després d'una caminada o d'un canvi de dibuix)
    tornaIdleNpc(img, key) {
        if (img.clauPastor) { img.setTexture(img.clauPastor); return; }          // (l'Aldreu convertit en Pastor de la Boira: no torna mai al dibuix de monjo mentre dura la conversió)
        if (img.idleClau && this.textures.exists(key + '_idle')) { img.setTexture(key + '_idle', 0); img.play('idle_' + key, true); }
        else img.setTexture(key);
    }

    // ---------------- Accions animades (les fan servir les pàgines { fer } dels diàlegs) ----------------
    // Cada acció rep fet() i el crida en acabar. seq() en fa una rere l'altra.
    seq(passos, fet) {
        let i = 0;
        const seguent = () => { if (i >= passos.length) { if (fet) fet(); return; } const p = passos[i++]; p(seguent); };
        seguent();
    }
    esperar(ms, fet) { this.time.delayedCall(ms, fet); }
    // Als llocs foscos (config.fosca), les bestioles fosques no es veurien sobre el terra: tenen una vora lluminosa ambre i una mica
    // de llum al terra. Amb fosca: 'total' (una foscor que ho tapa tot fora dels cercles de llum), la llum del terra va per sobre
    // de la foscor, perquè se sàpiga on són. fosca pot ser una funció (la foscor de les Runes només hi és de nit).
    ressaltarEnemics() {
        const f = this.config.fosca;
        if (!f || !this.enemics) return;
        const actiu = typeof f === 'function' ? f.call(this) : true;
        this.enemics.forEach(e => {
            const viu = !e.mort && e.spr && e.spr.active && BESTIOLES_FOSQUES.includes(e.tipus);
            if (!viu || !actiu) {
                if (e.llumTerra) { e.llumTerra.destroy(); e.llumTerra = null; }
                if (e.glow && e.spr && e.spr.preFX) { e.spr.preFX.remove(e.glow); e.glow = null; }
                return;
            }
            if (!e.llumTerra) {
                if (e.spr.preFX && !e.glow) e.glow = e.spr.preFX.addGlow(0xffc070, 4, 0, false, 0.1, 10);
                e.llumTerra = this.add.ellipse(0, 0, 110, 54, 0xffb060, 0.3).setBlendMode('ADD');
            }
            e.llumTerra.setPosition(e.spr.x, e.spr.y - 4).setDepth(f === 'total' ? 85001 : e.spr.depth - 1).setAlpha(e.spr.alpha * (f === 'total' ? 0.35 : 0.3));
        });
    }
    // Dins d'una pàgina d'acció: es queda així fins que el jugador prem (ESPAI, ENTER o un toc), com per passar una pàgina
    esperarClic(fet) {
        const d = this.ui().dialeg;
        if (d) d.alClic = fet; else fet();
    }

    // Un personatge es desplaça fins a (x, y); si té animació de caminar, la reprodueix
    npcVa(key, x, y, fet, vel = 150) {
        const img = this.npcs && this.npcs[key];
        if (!img) { if (fet) fet(); return; }
        const dist = Phaser.Math.Distance.Between(img.x, img.y, x, y), dur = Math.max(150, dist / vel * 1000);
        const dx = x - img.x, dy = y - img.y;
        let animClau = null;
        if (img.clauPastor) { if (Math.abs(dx) > 4) img.setFlipX(dx < 0); }       // el Pastor de la Boira llisca amb el seu dibuix (l'animació de caminar és la del monjo)
        else if (key === 'germa_aldreu' && dy < -15 && Math.abs(dx) > 10 && this.anims.exists('germa_aldreu_ne')) {
            animClau = 'germa_aldreu_ne';
            img.setFlipX(dx < 0);
        } else {
            if (Math.abs(dx) > 4) img.setFlipX(dx < 0);
            animClau = [key + '_camina', key + '_caminar', key + '_walk'].find(k => this.anims.exists(k));
        }
        if (animClau && img.anims) {
            // (el tween de respirar pot haver estat aturat/destruït per una escena: pause()/resume() d'un tween mort peta)
            if (img.respira && !img.respira.isDestroyed()) img.respira.pause();
            if (img.balanceig && !img.balanceig.isDestroyed()) img.balanceig.pause();
            img.setScale(img.escalaBase, img.escalaBase);
            img.play(animClau, true);
        }
        this.tweens.add({ targets: [img, img.ombra].filter(Boolean), x, y, duration: dur, ease: 'Sine.easeInOut', onUpdate: () => img.setDepth(img.y), onComplete: () => {
            if (animClau && img.anims) {
                img.anims.stop();
                this.tornaIdleNpc(img, key);
                if (img.respira && !img.respira.isDestroyed()) img.respira.resume();
                if (img.balanceig && !img.balanceig.isDestroyed()) img.balanceig.resume();
            }
            img.setAngle(0);
            if (img.col) { img.col.setPosition(img.x, img.y - 9); img.col.body.updateFromGameObject(); }
            if (img.punt) { img.punt.x = img.x; img.punt.y = img.y - 10; }
            if (fet) fet();
        } });
    }
    // Un personatge se'n va i desapareix (fos), i deixa de ser interactiu
    npcMarxa(key, x, y, fet, vel = 150) {
        const img = this.npcs && this.npcs[key];
        if (!img) { if (fet) fet(); return; }
        this.npcVa(key, x, y, () => {
            this.tweens.add({ targets: [img, img.ombra].filter(Boolean), alpha: 0, duration: 500, onComplete: () => {
                img.setVisible(false); if (img.ombra) img.ombra.setVisible(false);
                if (img.col) this.obstacles.remove(img.col, true, true);
                if (img.punt) img.punt.actiu = () => false;
                if (fet) fet();
            } });
        }, vel);
    }
    npcSalta(key, fet, vegades = 2) {
        const img = this.npcs && this.npcs[key];
        if (!img) { if (fet) fet(); return; }
        this.tweens.add({ targets: img, y: img.y - 26, yoyo: true, repeat: vegades - 1, duration: 170, ease: 'Quad.easeOut', onComplete: fet });
    }
    npcMira(key, cap, fet) {                 // cap: 'ineu' o una x
        const img = this.npcs && this.npcs[key];
        if (img) img.setFlipX((cap === 'ineu' ? this.ineu.x : cap) < img.x);
        if (fet) fet();
    }
    // Feina amb les mans: es mou endavant i enrere, amb guspires, notes o en silenci
    npcFeina(key, ms, tipus, fet) {
        const img = this.npcs && this.npcs[key];
        if (!img) { if (fet) fet(); return; }
        if (img.balanceig) img.balanceig.pause();                         // (mentre fa la feina, el balanceig d'idle s'atura)
        const d = NPC_IDLE[key];
        if (d && d.alFeina === tipus && d.fix && img.texture.key === d.fix && this.textures.exists(key + '_idle')) {      // té una animació pròpia per a aquesta feina (la Pianista tocant l'orgue d'esquena)
            this.animaNpc(key, ms, fet);
            const ev2 = this.time.addEvent({ delay: 220, loop: true, callback: () => this.flotant(img.x + Phaser.Math.Between(-40, 40), img.y - img.displayHeight, Phaser.Utils.Array.GetRandom(['♪', '♫', '♩']), '#d8c8ff') });
            this.time.delayedCall(ms, () => ev2.remove());
            return;
        }
        const t = this.tweens.add({ targets: img, angle: { from: -7, to: 7 }, yoyo: true, repeat: -1, duration: 140 });
        const colors = { guspires: [0xffd060, 0xff8030], notes: [0xd8c8ff, 0xffe8a0], fulles: [0x6ab04a, 0xe86aa0], bombolles: [0x6aff6a, 0xb8ffb0] }[tipus] || [0xffffff];
        const ev = this.time.addEvent({ delay: tipus === 'notes' ? 380 : 160, loop: true, callback: () => {
            if (tipus === 'silenci') return;
            if (tipus === 'notes') { this.flotant(img.x + Phaser.Math.Between(-30, 30), img.y - img.displayHeight, Phaser.Utils.Array.GetRandom(['♪', '♫', '♩']), '#d8c8ff'); return; }
            const p = this.add.circle(img.x + Phaser.Math.Between(-20, 20), img.y - img.displayHeight * 0.5, 4, Phaser.Utils.Array.GetRandom(colors)).setDepth(img.depth + 1);
            this.tweens.add({ targets: p, x: p.x + Phaser.Math.Between(-50, 50), y: p.y - Phaser.Math.Between(20, 60), alpha: 0, duration: 600, onComplete: () => p.destroy() });
        } });
        this.time.delayedCall(ms, () => { t.stop(); img.setAngle(0); if (img.balanceig) img.balanceig.resume(); ev.remove(); if (fet) fet(); });
    }
    // Bombolla sobre el cap d'algú: '!', '?', '♪', '❤', '…', 'Zzz'
    bombolla(qui, text, fet, ms = 900) {
        const img = qui === 'ineu' ? this.ineu : this.npcs && this.npcs[qui];
        if (!img) { if (fet) fet(); return; }
        const t = this.add.text(img.x, img.y - img.displayHeight - 16, text, estilText(34, '#2a170b', { backgroundColor: '#f2e6c8', padding: { x: 10, y: 4 } })).setOrigin(0.5, 1).setDepth(99000);
        const v = this.cameras.main.worldView, mw = t.displayWidth / 2 + 8;          // que no surti per la vora de la pantalla
        if (v.width > 2 * mw) t.x = Phaser.Math.Clamp(t.x, v.x + mw, v.right - mw);
        this.tweens.add({ targets: t, y: t.y - 10, duration: 250, ease: 'Back.easeOut' });
        this.time.delayedCall(ms, () => { t.destroy(); if (fet) fet(); });
    }
    // Un objecte (o una espurna) vola d'algú cap a l'Ineu
    objecteVola(de, fet, key) {
        const img = de && de.x !== undefined ? de : this.npcs && this.npcs[de];
        const x0 = img ? img.x : this.ineu.x, y0 = img ? img.y - (img.displayHeight || 60) * 0.6 : this.ineu.y - 120;
        const o = key && this.textures.exists(key) ? this.add.image(x0, y0, key) : this.add.circle(x0, y0, 10, 0xffe8a0, 1);
        if (o.type === 'Image') o.setScale((String(key).startsWith('arma_') ? 150 : 46) / Math.max(o.height, o.width));      // les armes (el bastó, la branca) són llargues i primes: es veuen a 150 px
        o.setDepth(99000);
        this.tweens.add({ targets: o, x: this.ineu.x, y: this.ineu.y - 70, duration: 700, ease: 'Sine.easeInOut', onComplete: () => {
            o.destroy();
            const fl = this.add.circle(this.ineu.x, this.ineu.y - 70, 14, 0xffffff, 0.9).setDepth(99000);
            this.tweens.add({ targets: fl, radius: 46, alpha: 0, duration: 350, onComplete: () => fl.destroy() });
            if (fet) fet();
        } });
    }
    // L'Ineu alça l'arma que acaba de rebre (sprite mirant amunt), amb un esclat de llum i la fanfara de l'objecte, i torna a la pose normal.
    // ox: on cau el cos de l'Ineu dins el dibuix (l'arma queda a un costat), perquè no salti de lloc en canviar de sprite
    // L'Ineu canvia a l'sprite d'«aixecar l'objecte» a l'instant (sense saltar ni parpellejar) i hi roman fins que es crida ineuBaixa()
    // (el diàleg ho fa quan s'avança després del missatge d'obtenció). Continua de seguida (fet).
    ineuAixeca(key, fet, ox = 0.5) {
        const I = this.ineu, esc = (this.textures.get(key).customData || {}).escala || 0.5;
        if (this.ineuAixecaEfecte) { this.ineuAixecaEfecte.destroy(); this.ineuAixecaEfecte = null; }
        if (this.ineuAixecaAura) { this.ineuAixecaAura.destroy(); this.ineuAixecaAura = null; }
        if (this.ineuAlt) this.ineuAlt.destroy();
        if (this.ineuAltObjecte) { this.ineuAltObjecte.forEach(o => { this.tweens.killTweensOf(o); o.destroy(); }); this.ineuAltObjecte = null; }
        I.setVisible(false);
        if (this.fantasma) this.fantasma.setVisible(false);          // la silueta translúcida de l'Ineu també: un dibuix desapareix i l'altre apareix, sense transparències
        this.ineuAlt = this.add.image(I.x, I.y + 2, key).setOrigin(ox, 1).setScale(esc).setDepth(85000);       // per sobre de tothom (també del Germà Aldreu), però SOTA la boira (89990+): si no, quedava il·luminat
        if (key === 'ineu_aixeca_tiler') {
            const x = I.x - this.ineuAlt.displayWidth * 0.16;
            const y = I.y + 2 - this.ineuAlt.displayHeight * 0.97;
            this.ineuAixecaAura = this.add.circle(x, y, 24, 0xb9e879, 0.2).setBlendMode('ADD').setDepth(84999);
            this.tweens.add({ targets: this.ineuAixecaAura, scale: { from: 0.7, to: 1.2 }, alpha: { from: 0.12, to: 0.34 }, yoyo: true, repeat: -1, duration: 850, ease: 'Sine.easeInOut' });
            this.ineuAixecaEfecte = this.add.particles(x, y, 'espurna', {
                x: { min: -12, max: 12 }, y: { min: -10, max: 10 },
                angle: { min: 220, max: 320 }, speed: { min: 8, max: 24 }, lifespan: 850,
                scale: { start: 0.24, end: 0 }, alpha: { start: 0.9, end: 0 },
                tint: [0xb9e879, 0xffe890, 0xffffff], blendMode: 'ADD', frequency: 110
            }).setDepth(84999);
        }
        this.llum(I.x - 8, I.y - 190, 0xffe8a0);
        Joc.fanfaraArma(this);
        if (key === 'ineu_aixeca_basto' || key === 'ineu_aixeca_tiler') this.sucArma(key === 'ineu_aixeca_tiler' ? 0xb9e879 : 0xffe8a0);
        if (fet) fet();
    }

    // El «suc» de rebre una arma nova: la càmera s'acosta a l'Ineu, la pantalla s'enfosqueix una mica, un flaix blanc i uns raigs de llum giren darrere l'arma, ones de llum
    // s'expandeixen, espurnes pugen i la càmera fa un cop sec. Tot es treu (i la càmera torna a lloc) en baixar el braç (ineuBaixa).
    sucArma(color) {
        const I = this.ineu, cam = this.cameras.main, A = this.ineuAlt;
        if (!A) return;
        const x = I.x - A.displayWidth * 0.16, y = I.y + 2 - A.displayHeight * 0.97;          // on és l'arma, alçada
        const efectes = this.efectesArma = this.efectesArma || [];
        const afegeix = o => { efectes.push(o); return o; };
        // Zoom: càmera cap a l'Ineu i l'arma (per sobre del quadre de diàleg)
        this.camArma = true;
        this.enquadrar(I.x, y + 70, ZOOM_CAMERA * 1.55, 750, null, 420);
        // Enfosquiment suau de tot el que no és l'Ineu (per sota seu)
        const vel = afegeix(this.add.rectangle(AMPLE / 2, (ALT - ALT_HUD) / 2, AMPLE / ZOOM_CAMERA * 2, (ALT - ALT_HUD) / ZOOM_CAMERA * 2, 0x000000, 0).setScrollFactor(0).setDepth(84900));
        this.tweens.add({ targets: vel, fillAlpha: 0.5, duration: 500 });
        // Flaix i cop de càmera
        cam.flash(260, 255, 255, 255);
        cam.shake(260, 0.006);
        // Raigs de llum que giren darrere l'arma
        const raigs = afegeix(this.add.container(x, y).setDepth(84950).setBlendMode(Phaser.BlendModes.ADD).setScale(0.2).setAlpha(0));
        const g = this.add.graphics();
        for (let i = 0; i < 14; i++) {
            const a = i * Math.PI * 2 / 14, w = 0.09;
            g.fillStyle(color, 0.27).fillTriangle(0, 0, Math.cos(a - w) * 210, Math.sin(a - w) * 210, Math.cos(a + w) * 210, Math.sin(a + w) * 210);
        }
        raigs.add(g);
        this.tweens.add({ targets: raigs, scale: 1, alpha: 1, duration: 600, ease: 'Back.easeOut' });
        this.tweens.add({ targets: raigs, angle: 360, duration: 9000, repeat: -1 });
        // Resplendor que bategueja i ones que s'expandeixen
        const halo = afegeix(this.add.circle(x, y, 60, color, 0.35).setBlendMode('ADD').setDepth(84960));
        this.tweens.add({ targets: halo, scale: { from: 0.8, to: 1.35 }, alpha: { from: 0.45, to: 0.2 }, yoyo: true, repeat: -1, duration: 700, ease: 'Sine.easeInOut' });
        for (let k = 0; k < 3; k++) {
            const anell = afegeix(this.add.circle(x, y, 16, color, 0).setStrokeStyle(4, color, 0.9).setBlendMode('ADD').setDepth(84961));
            this.tweens.add({ targets: anell, scale: 9, alpha: 0, duration: 1100, delay: k * 280, ease: 'Cubic.easeOut', onComplete: () => anell.destroy() });
        }
        // Espurnes que pugen
        afegeix(this.add.particles(x, y, 'espurna', {
            x: { min: -34, max: 34 }, y: { min: -20, max: 20 }, speed: { min: 20, max: 90 }, angle: { min: 230, max: 310 }, lifespan: { min: 900, max: 1600 },
            scale: { start: 0.4, end: 0 }, alpha: { start: 1, end: 0 }, tint: [color, 0xffffff, 0xffe890], blendMode: 'ADD', frequency: 45
        }).setDepth(84970));
    }

    // Treu el «suc» de l'arma (raigs, llums, enfosquiment) i la càmera torna a lloc
    treuSucArma() {
        if (this.efectesArma) {
            this.efectesArma.forEach(o => {
                if (!o || !o.active) return;
                this.tweens.killTweensOf(o);
                this.tweens.add({ targets: o, alpha: 0, duration: 450, onComplete: () => { if (o.active) o.destroy(); } });
            });
            this.efectesArma = null;
        }
        if (this.camArma) { this.camArma = false; this.alliberarCamera(900); }
    }
    // L'Ineu REP un objecte (el ram, els guants, una clau...): alça el braç amb la mà oberta, l'objecte vola del qui el dona (el punt amb què s'interactua)
    // fins a la seva mà i hi queda, brillant, fins que es crida ineuBaixa() (la UI ho fa en passar la pàgina d'avís { avis, obj: 'id' }). Sona la fanfara.
    // Si no es pot (no hi ha el dibuix, l'Ineu és ocult, ja alça una altra cosa), no fa res: l'avís es mostra igualment. Assegut en un banc sí que es pot (el Galf et dona
    // la clau): el dibuix de l'Ineu dret alça el braç al lloc del seient i, en acabar, torna el de l'Ineu assegut: no s'aixeca del banc (this.assegut no es toca).
    ineuRep(id) {
        const I = this.ineu, KEY = 'ineu_aixeca_buit';
        if (!I || !I.visible || this.ineuAlt || this.ineuFlautaImg || !this.textures.exists(KEY) || Grafics.faltants.includes(KEY)) return false;
        const OX = 0.556;                                          // on cau el cos de l'Ineu dins del dibuix (centre dels peus)
        this.ineuAixeca(KEY, null, OX);
        const A = this.ineuAlt, dw = A.displayWidth, dh = A.displayHeight;
        const mx = I.x - OX * dw + 0.11 * dw, my = I.y + 2 - dh + 0.065 * dh - 24;          // sobre la palma de la mà alçada
        const color = 0xffe8a0, icona = iconaObjecte(this, id);
        const p = (this.puntActiu && Phaser.Math.Distance.Between(this.puntActiu.x, this.puntActiu.y, I.x, I.y) < 250) ? this.puntActiu : { x: mx, y: my + 80 };
        const obj = icona ? this.add.image(p.x, p.y - 30, icona).setScale(0.22) : this.add.circle(p.x, p.y - 30, 9, color, 1);
        const halo = this.add.circle(p.x, p.y - 30, 34, color, 0.45).setBlendMode('ADD').setScale(0.4);
        obj.setDepth(85002); halo.setDepth(85001);
        const fins = icona ? 0.5 : 1.4;
        this.tweens.add({ targets: [obj, halo], x: mx, y: my, duration: 700, ease: 'Sine.easeOut' });
        this.tweens.add({ targets: obj, scale: fins, duration: 700, ease: 'Back.easeOut' });
        this.tweens.add({ targets: halo, scale: 1, duration: 700, ease: 'Sine.easeOut', onComplete: () => this.tweens.add({ targets: halo, alpha: 0.2, scale: 1.25, yoyo: true, repeat: -1, duration: 700, ease: 'Sine.easeInOut' }) });
        this.tweens.add({ targets: obj, y: my - 5, delay: 700, yoyo: true, repeat: -1, duration: 900, ease: 'Sine.easeInOut' });        // sura una mica a la mà
        this.ineuAltObjecte = [obj, halo];
        this.esGraRosari = (id === 'gra_rosari');
        return true;
    }
    ineuBaixa(fet) {
        if (this.ineuAltObjecte) {
            const objs = this.ineuAltObjecte;
            this.ineuAltObjecte = null;
            if (this.esGraRosari) {
                this.esGraRosari = false;
                const cam = this.cameras.main;
                const idx = Math.max(0, Estat.dades.corsMax - 1);
                const hudX = cam.worldView ? (cam.worldView.x + (92 + idx * 50 + 20) / cam.zoom) : (cam.scrollX + 92 + idx * 50);
                const hudY = cam.worldView ? (cam.worldView.y + 40 / cam.zoom) : (cam.scrollY + 40);
                objs.forEach(o => this.tweens.killTweensOf(o));
                this.tweens.add({
                    targets: objs,
                    x: hudX,
                    y: hudY,
                    scale: 0.28,
                    alpha: 0.1,
                    duration: 650,
                    ease: 'Cubic.easeInOut',
                    onComplete: () => {
                        objs.forEach(o => o.destroy());
                        const ui = this.ui();
                        if (ui) ui.actualitzarHUD();
                    }
                });
            } else {
                objs.forEach(o => { this.tweens.killTweensOf(o); o.destroy(); });
            }
        }
        if (this.ineuAixecaEfecte) { this.ineuAixecaEfecte.destroy(); this.ineuAixecaEfecte = null; }
        if (this.ineuAixecaAura) { this.ineuAixecaAura.destroy(); this.ineuAixecaAura = null; }
        if (this.ineuAlt) { this.ineuAlt.destroy(); this.ineuAlt = null; }
        this.treuSucArma();
        this.ineu.setVisible(true);
        if (this.fantasma) this.fantasma.setVisible(true);
        if (fet) fet();
    }
    // Mentre es toca la flauta, l'Ineu es veu de cara a la càmera tocant-la (art 'ineu_flauta'); en acabar torna el sprite normal.
    // Si el gràfic encara no és al joc, no es canvia res.
    ineuFlauta(on) {
        if (!this.ineu || !this.sys || !this.sys.isActive()) return;
        if (!on) {
            if (this.ineuFlautaImg) { this.ineuFlautaImg.destroy(); this.ineuFlautaImg = null; this.ineuBaixa(); }
            if (this.ineuAmagat) {                                  // s'havia amagat mentre sortia gran tocant: torna amb un fade in
                this.ineuAmagat = false;
                this.ineu.setVisible(true).setAlpha(0);              // (la silueta de darrere l'Ineu en segueix l'alfa)
                this.tweens.add({ targets: this.ineu, alpha: 1, duration: 500 });
            }
            return;
        }
        if (this.ineuFlautaImg || this.ineuAlt || !this.textures.exists('ineu_flauta') || Grafics.faltants.includes('ineu_flauta')) return;
        const I = this.ineu, esc = (this.textures.get('ineu_flauta').customData || {}).escala || 0.5;
        I.setVisible(false);
        if (this.fantasma) this.fantasma.setVisible(false);
        this.ineuFlautaImg = this.add.image(I.x, I.y + 2, 'ineu_flauta').setOrigin(0.5, 1).setScale(esc).setDepth(I.depth);
    }
    // Mentre l'Ineu surt gran tocant la tarota (primer pla de la música), el de l'escenari desapareix amb un fade out; ineuFlauta(false) el torna amb un fade in
    amagarIneuFlauta(ms = 350) {
        if (this.ineuAmagat || !this.ineu) return;
        this.ineuAmagat = true;
        this.tweens.add({ targets: this.ineuFlautaImg || this.ineu, alpha: 0, duration: ms });
    }
    // ---- Accions de l'Ineu sobre el punt amb què interactua (this.puntActiu) ----
    // Agafar: l'objecte (o una llum) vola del punt a l'Ineu, que s'ajup
    agafar(fet, key, color = 0xffe8a0) {
        const p = this.puntActiu || { x: this.ineu.x, y: this.ineu.y - 60 };
        this.ajupir('ineu', null, 300);
        this.objecteVolaDe(p.x, p.y - 30, this.ineu.x, this.ineu.y - 70, key, color, () => { this.llum(this.ineu.x, this.ineu.y - 70, color); this.esperar(300, fet); });
    }
    // Deixar: l'objecte vola de l'Ineu al punt i s'hi encén
    deixar(fet, key, color = 0xffe8a0) {
        const p = this.puntActiu || { x: this.ineu.x, y: this.ineu.y - 60 };
        this.ajupir('ineu', null, 400);
        this.objecteVolaDe(this.ineu.x, this.ineu.y - 70, p.x, p.y - 30, key, color, () => { this.llum(p.x, p.y - 30, color); this.esperar(400, fet); });
    }
    // Beure (un flascó, l'aigua d'un calze, una pruna): llum que puja per l'Ineu
    beure(fet, color = 0xffd890) {
        this.tweens.add({ targets: this.ineu, y: this.ineu.y - 10, yoyo: true, duration: 200 });
        this.llum(this.ineu.x, this.ineu.y - 60, color, () => this.esperar(200, fet));
    }
    objecteVolaDe(x0, y0, x1, y1, key, color, fet) {
        const o = key && this.textures.exists(key) ? this.add.image(x0, y0, key) : this.add.circle(x0, y0, 9, color, 1);
        if (o.type === 'Image') o.setScale((String(key).startsWith('arma_') ? 130 : 42) / Math.max(o.height, o.width));
        o.setDepth(99000);
        this.tweens.add({ targets: o, x: x1, y: y1, duration: 650, ease: 'Sine.easeInOut', onComplete: () => { o.destroy(); if (fet) fet(); } });
    }

    // Un objecte surt del punt amb què s'interactua (un cofre...): la seva icona puja amb una claror, s'hi queda un moment i vola fins
    // a l'Ineu (que no fa res), on s'encén amb la fanfara d'objecte
    mostrarObjecte(id, fet, color = 0xffe8a0) {
        const p = this.puntActiu || { x: this.ineu.x, y: this.ineu.y - 60 }, key = iconaObjecte(this, id);
        const o = key ? this.add.image(p.x, p.y - 20, key).setScale(0.2) : this.add.circle(p.x, p.y - 20, 9, color, 1);
        const halo = this.add.circle(p.x, p.y - 20, 40, color, 0.5).setBlendMode('ADD');
        o.setDepth(99001); halo.setDepth(99000).setScale(0.3);
        Joc.fanfaraObjecte(this);
        this.tweens.add({ targets: [o, halo], y: p.y - 160, duration: 600, ease: 'Back.easeOut' });
        this.tweens.add({ targets: o, scale: key ? 0.9 : 1.6, duration: 600, ease: 'Back.easeOut' });
        this.tweens.add({ targets: halo, scale: 1.4, alpha: 0.25, yoyo: true, repeat: 1, duration: 450 });
        this.time.delayedCall(1300, () => {
            const x1 = this.ineu.x, y1 = this.ineu.y - 70;
            this.tweens.add({ targets: [o, halo], x: x1, y: y1, duration: 450, ease: 'Sine.easeIn' });
            this.tweens.add({ targets: o, scale: key ? 0.3 : 0.8, duration: 450, onComplete: () => {
                o.destroy(); halo.destroy();
                this.llum(x1, y1, color);
                this.esperar(350, fet);
            } });
        });
    }

    // L'Ineu camina fins a (x, y)
    ineuVa(x, y, fet, vel = 180) {
        const dx = x - this.ineu.x, dy = y - this.ineu.y, dist = Math.hypot(dx, dy);
        if (dist < 4) { if (fet) fet(); return; }
        const dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'esquerra' : 'dreta') : (dy < 0 ? 'amunt' : 'avall');
        const oct = OCTANTS_INEU[(Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) + 8) % 8];
        this.caminantAuto = true;
        this.vista8Manual = true;
        this.posarDireccio(dir, true, oct);
        const dur = Math.max(150, dist / vel * 1000);
        this.tweens.add({
            targets: this.ineu, x, y, duration: dur,
            onUpdate: () => {
                this.ineu.setDepth(this.ineu.y);
                if (this.ombraIneu) this.ombraIneu.setPosition(this.ineu.x, this.ineu.y);
                if (this.ineu.body) this.ineu.body.reset(this.ineu.x, this.ineu.y);
            },
            onComplete: () => {
                this.caminantAuto = false;
                this.vista8Manual = false; this.vista8 = null;
                this.posarDireccio(dir, false);
                if (fet) fet();
            }
        });
    }
    // L'Ineu (o un personatge) s'inclina lleugerament (sense deformar mai el sprite)
    ajupir(qui, fet, ms = 900) {
        const img = qui === 'ineu' ? this.ineu : this.npcs && this.npcs[qui];
        if (!img) { if (fet) fet(); return; }
        const y0 = img.y;
        this.tweens.add({ targets: img, y: y0 + 6, duration: 250, yoyo: true, hold: ms, onComplete: () => { img.y = y0; if (fet) fet(); } });
    }
    // Un esclat de llum suau en un punt (benediccions, màgia)
    llum(x, y, color = 0xffe8a0, fet) {
        const c = this.add.circle(x, y, 20, color, 0.7).setDepth(99000).setBlendMode('ADD');
        this.tweens.add({ targets: c, radius: 120, alpha: 0, duration: 900, onComplete: () => { c.destroy(); if (fet) fet(); } });
        const p = this.add.particles(x, y, 'espurna', { speed: { min: 20, max: 90 }, lifespan: 1000, scale: { start: 0.35, end: 0 }, tint: [color, 0xffffff], blendMode: 'ADD', quantity: 18, emitting: false }).setDepth(99001);
        p.explode(18);
        this.time.delayedCall(1200, () => p.destroy());
    }

    // Llista d'arbres [[x, y], ...]
    arbres(llista, key = 'arbre') {
        llista.forEach(([x, y]) => this.posar(key, x, y, { col: { w: 34, h: 16 } }));
    }

    // Franja d'arbres que tanca un costat de la pantalla (per no deixar sortir on no hi ha res).
    // Els troncs s'uneixen amb tires de col·lisió (sense forats) i, si la fila és a dalt de tot, una paret
    // pel darrere impedeix passar per l'estreta franja que queda sobre els troncs (paretDarrere = false per a una fila a baix de tot).
    muralla(x1, y1, x2, y2, pas = 90, key = 'arbre', paretDarrere = true, senseArbre = null) {
        const n = Math.max(1, Math.round(Math.hypot(x2 - x1, y2 - y1) / pas));
        const arbre = key === 'arbre';
        const alt = arbre ? TRONC_ARBRE(1).h : 30;
        for (let i = 0; i <= n; i++) {
            const x = x1 + (x2 - x1) * i / n, y = y1 + (y2 - y1) * i / n;
            if (senseArbre && senseArbre(x, y)) continue;                  // només la col·lisió (la mateixa de sota): sense arbre dibuixat
            this.posar(key, x, y, { col: arbre ? { w: TRONC_ARBRE(1).w, h: alt, fix: true } : { w: 60, h: 30 } });
        }
        const horitzontal = Math.abs(y2 - y1) < 5, vertical = Math.abs(x2 - x1) < 5;
        for (let i = 0; i < n; i++) {
            const mx = x1 + (x2 - x1) * (i + 0.5) / n, my = y1 + (y2 - y1) * (i + 0.5) / n;
            if (horitzontal) this.colisio(mx, my - alt / 2, Math.abs(x2 - x1) / n, alt);
            else if (vertical) this.colisio(mx, my - alt / 2, arbre ? TRONC_ARBRE(1).w : 60, Math.abs(y2 - y1) / n);
        }
        if (paretDarrere && horitzontal && y1 - 30 > 10) {
            const xa = Math.min(x1, x2), xb = Math.max(x1, x2);
            this.colisio((xa + xb) / 2, (y1 - 30) / 2, xb - xa, y1 - 30);
        }
    }

    // Edifici amb porta: dues col·lisions als costats i un forat al mig per entrar (sortida).
    // x, y = peus del centre; ample = amplada de col·lisió total; porta = amplada del forat
    edifici(key, x, y, ample, porta, desti, entrada, opts = {}) {
        const img = this.posar(key, x, y, { fonsY: y - 20 });
        const alt = opts.alt || 70;
        const costat = (ample - porta) / 2;
        this.colisio(x - porta / 2 - costat / 2, y - alt / 2, costat, alt);
        this.colisio(x + porta / 2 + costat / 2, y - alt / 2, costat, alt);
        this.colisio(x, y - alt - 10, porta, 20);   // dintell
        if (desti) {
            const hSortida = Math.max(36, alt - 16);
            this.sortida(x - porta / 2 + 4, y - alt + 8, porta - 8, hSortida, desti, entrada);
        }
        this.blocDarrere(x, ample, y - alt - 20, Math.max(0, y - img.displayHeight));
        return img;
    }

    // Bloc invisible darrere d'un edifici: l'Ineu no hi ha de travessar la façana (amb la silueta fantasma, es veuria a través).
    // dalt = on comença el gràfic. A la part de la teulada hi queda un marge (MARGE_TEULADA) lliure: l'Ineu hi pot passar
    // per darrere de l'edifici, amb el cos tapat per la façana (però mai per sobre de TOPE_Y, on els peus no arriben).
    blocDarrere(x, ample, baix, dalt = 0) {
        const cim = Math.max(dalt, TOPE_Y) + MARGE_TEULADA;
        if (baix - cim > 10) this.colisio(x, (cim + baix) / 2, ample, baix - cim);
    }

    // Ovella que pastura: s'atura a menjar (cap cap a terra i mastegant) i de tant en tant fa uns passos fins a una altra mata d'herba,
    // sempre dins d'un radi al voltant d'on l'has posat. Només mou la imatge (angle, escala, posició), així serveix amb qualsevol gràfic.
    pasturar(spr, radi = 70) {
        const x0 = spr.x, y0 = spr.y, sx = spr.scaleX, sy = spr.scaleY;
        const nova = () => {
            const dreta = !spr.flipX, cap = dreta ? 1 : -1;
            // Menja una estona: el cap baixa i mastega
            this.tweens.add({ targets: spr, angle: 9 * cap, duration: 500, ease: 'Sine.easeOut' });
            const masteg = this.tweens.add({ targets: spr, scaleY: sy * 0.965, angle: 9 * cap + 1.6 * cap, yoyo: true, repeat: -1, duration: 230, delay: 500 });
            this.time.delayedCall(Phaser.Math.Between(1400, 3600), () => {
                masteg.stop();
                this.tweens.add({ targets: spr, angle: 0, scaleY: sy, duration: 350 });
                // Aixeca el cap i camina fins a una altra mata
                const tx = Phaser.Math.Clamp(x0 + Phaser.Math.Between(-radi * 2, radi * 2), 40, this.config.amplada - 40), ty = y0 + Phaser.Math.Between(-radi * 0.9, radi * 0.9);
                this.time.delayedCall(450, () => {
                    spr.setFlipX(tx < spr.x);
                    const dist = Phaser.Math.Distance.Between(spr.x, spr.y, tx, ty);
                    const passos = this.tweens.add({ targets: spr, scaleY: sy * 1.045, yoyo: true, repeat: -1, duration: 190 });
                    this.tweens.add({ targets: spr, x: tx, y: ty, duration: Math.max(900, dist / 20 * 1000), ease: 'Sine.easeInOut',
                        onUpdate: () => spr.setDepth(spr.y),
                        onComplete: () => { passos.stop(); spr.setScale(sx, sy); spr.setDepth(spr.y); nova(); } });
                });
            });
        };
        this.time.delayedCall(Phaser.Math.Between(0, 2500), nova);
    }

    cartell(x, y, dialeg) {
        this.posar('cartell', x, y, { col: { w: 20, h: 10 }, opac: true });
        const f = typeof dialeg === 'function' ? dialeg : () => dialeg;
        return this.interactiu(x, y, RADI_OBJECTE, (...a) => this.cartellAmbNom(f(...a)), { altura: 70 });
    }

    // Tots els cartells diuen primer on som (el nom de la zona) i després cap a on duen els camins; si el text ja comença amb el nom del lloc, es deixa tal qual
    cartellAmbNom(d) {
        const nom = this.config && this.config.nom, pag = d && d.pagines && d.pagines[0];
        if (!nom || !pag || pag.qui !== 'Cartell' || typeof pag.text !== 'string') return d;
        const norm = t => t.toLowerCase().replace(/[.,«»"]/g, '');
        if (norm(pag.text).startsWith(norm(nom))) return d;
        return Object.assign({}, d, { pagines: [Object.assign({}, pag, { text: nom + '\n\n' + pag.text }), ...d.pagines.slice(1)] });
    }

    // Les parets d'un interior que barren la porta es parteixen perquè hi quedi un pas lliure (la porta s'ha de poder traspassar)
    obrirPortes() {
        (this.portesInt || []).forEach(p => {
            const x0 = p.x - 4, x1 = p.x + p.w + 4;
            this.obstacles.getChildren().slice().forEach(o => {
                const b = o.body;
                if (!b || b.x >= x1 || b.x + b.width <= x0 || b.y >= p.y + 60 || b.y + b.height <= p.y - 40) return;
                if (b.width < 4 || b.height > 80) return;               // només tires de paret baixa
                const { x, y, width: w, height: h } = b;
                this.obstacles.remove(o, true, true);
                if (x < x0) this.colisio((x + x0) / 2, y + h / 2, x0 - x, h);
                if (x + w > x1) this.colisio((x1 + x + w) / 2, y + h / 2, x + w - x1, h);
            });
            // Brancals als dos costats de la sortida sud perquè només s'hi pugui entrar pel buit de la porta:
            // han de començar al llindar inferior (p.y + PROFUNDITAT_PORTA) per no sobresortir dins de l'habitació
            const yBrancal = p.y + PROFUNDITAT_PORTA;
            const hJ = 60;
            this.colisio(x0 - 15, yBrancal + hJ / 2, 30, hJ);
            this.colisio(x1 + 15, yBrancal + hJ / 2, 30, hJ);
        });
    }

    // Rectangle de sortida: quan l'Ineu el toca, es canvia a la zona "desti" i entra per "entrada"
    // peu = true: només compta el punt dels peus (no tota la caixa), per traspassar de debò un camí d'arbres.
    sortida(x, y, w, h, desti, entrada, peu = false) {
        // Porta a la vora de baix d'un interior: es desplaça cap avall perquè l'Ineu hagi de sortir per la porta
        if (this.esInterior() && w >= h && y > this.config.alcada / 2 && y + h >= this.config.alcada - 30) {
            (this.portesInt = this.portesInt || []).push({ x, y, w });
            y += PROFUNDITAT_PORTA; h = 60;
        }
        // Una sortida enganxada a la vora superior s'allarga fins on l'Ineu pot arribar (TOPE_Y)
        if (y < TOPE_Y - 10) h = Math.max(h, TOPE_Y - 10 - y);
        const r = new Phaser.Geom.Rectangle(x, y, w, h);
        const s = { r, desti, entrada, peu };
        this.sortides.push(s);
        // Sortida encara tancada (l'inici del joc): ni llum ni paret invisible. Es camina contra el marge com a la resta de l'escenari;
        // la llum apareix quan s'obre el camí (vegeu posarBoiraSortides)
        if (this.sortidaTancada(s)) s.pendentLlum = true;
        else if (this.llumsDiferides) this.llumsDiferides.push(s);        // la llum es fa quan la zona ja és ampliada (ampliarSud mou les sortides de la vora sud)
        else this.marcarSortida(r);
        if (Joc.debug) this.add.rectangle(x, y, w, h).setOrigin(0).setStrokeStyle(2, 0x00ffff).setDepth(99998);
        return s;
    }

    // Sortida: una llum càlida i suau que s'esvaeix cap a dins i una remor de llumetes (focs follets) que s'enlairen
    // cap a la sortida i s'hi esvaeixen. Sense fletxes: la llum "crida" sola, d'acord amb la boira màgica del Miracle.
    marcarSortida(r) {
        const c = this.config, vora = 20, fonsMon = c.alcada + (this.extraSud || 0);          // (la vora sud real: ampliarSud allarga el món)
        let dir = 'amunt', ex = r.centerX, ey = r.centerY, span = r.width, fons = 100;
        // Cada llum és on l'Ineu arriba de debò: els peus no passen de TOPE_Y per dalt ni dels límits del món pels costats i per baix
        if (r.x <= vora) { dir = 'esquerra'; ex = 10; ey = r.centerY; span = Math.max(r.height, 90); }
        else if (r.right >= c.amplada - vora) { dir = 'dreta'; ex = c.amplada - 10; ey = r.centerY; span = Math.max(r.height, 90); }
        else if (r.bottom >= fonsMon - vora) { dir = 'avall'; ex = r.centerX; ey = fonsMon - 10; span = Math.max(r.width, 90); }
        else if (r.y < TOPE_Y) { dir = 'amunt'; ex = r.centerX; ey = TOPE_Y - 14; span = Math.max(r.width, 90); }   // vora superior de la pantalla
        else { dir = 'amunt'; ex = r.centerX; ey = r.y + r.height * 0.7; span = Math.min(Math.max(r.width, 70), 150); fons = 70; }   // porta d'un edifici
        const v = { dreta: [1, 0], avall: [0, 1], esquerra: [-1, 0], amunt: [0, -1] }[dir];   // cap a fora
        const angle = Math.atan2(v[1], v[0]);
        (this.llumsSortida = this.llumsSortida || []).push({ r, ex, ey, dir });              // (per revisar que cada llum queda a la sortida)

        // Resplendor: capes ovalades superposades, ben suaus, que neixen a la vora
        const llum = this.add.container(ex, ey).setRotation(angle).setDepth(-940);
        const g = this.add.graphics();
        for (let i = 0; i < 7; i++) {
            const f = i / 6;
            g.fillStyle(0xd89a4a, 0.045 + 0.03 * (1 - f)).fillEllipse(-fons * 0.12, 0, fons * (1.5 - f * 1.1), span * (1.05 - f * 0.55));
        }
        llum.add(g);
        llum.setBlendMode(Phaser.BlendModes.ADD);
        this.tweens.add({ targets: llum, alpha: 0.55, yoyo: true, repeat: -1, duration: 2400, ease: 'Sine.easeInOut' });

        // Llumetes: neixen dins de la pantalla i s'allunyen lentament cap a la sortida, tremolant una mica
        const ample = Math.abs(v[0]) ? fons : span * 0.9, alt = Math.abs(v[0]) ? span * 0.9 : fons;
        const zona = new Phaser.Geom.Rectangle(ex - v[0] * fons * 0.55 - ample / 2, ey - v[1] * fons * 0.55 - alt / 2, ample, alt);
        this.add.particles(0, 0, 'espurna', {
            emitZone: { type: 'random', source: zona },
            speedX: { min: v[0] * 14 - 6, max: v[0] * 30 + 6 },
            speedY: { min: v[1] * 14 - 6, max: v[1] * 30 + 6 },
            lifespan: { min: 2600, max: 4200 },
            scale: { values: [0, 0.24, 0.14, 0] },
            alpha: { values: [0, 0.6, 0.5, 0] },
            tint: [0xe8b068, 0xd89a58, 0xb8a0e0],
            blendMode: 'ADD',
            frequency: Math.max(45, 220 - span * 0.6)
        }).setDepth(86000);
    }

    // Emissor de boira fosca
    // ---------------- La boira del Miracle (general) ----------------
    // Una sola boira per a tot el Santuari: un vel violeta i uns bancs de boira que passen per davant de la càmera a totes les zones
    // d'exterior. Va marxant a poc a poc a mesura que es resolen les missions (BOIRA_PASSOS) i s'esvaeix del tot quan cau l'Ocellaire.
    // Si una missió es resol dins de la mateixa zona, es veu com la boira s'aclareix. config.densitatBoira: més espessa a prop d'on neix.
    posarBoiraGeneral() {
        if (this.esInterior() || this.config.senseBoira) return;
        const dens = (BOIRA_ZONES[this.scene.key] || {}).dens || this.config.densitatBoira || 1;
        const W = AMPLE / ZOOM_CAMERA + 4, H = (ALT - ALT_HUD) / ZOOM_CAMERA + 4, CY = (ALT - ALT_HUD) / 2;      // la càmera mira per una finestra més baixa que el llenç (sota el HUD): el centre és el d'aquesta finestra
        const parts = [];                                               // { o, alfa }: el que val cada peça amb la boira al màxim
        const vel = this.add.rectangle(AMPLE / 2, CY, W, H, 0x3a1a55, 1).setScrollFactor(0).setDepth(90000).setAlpha(0);
        parts.push({ o: vel, alfa: Math.min(0.34, 0.14 * dens) });
        if (this.textures.exists('boira')) {
            const n = Math.round(4 + 2 * dens);
            for (let i = 0; i < n; i++) {
                const x = AMPLE / 2 + (i / (n - 1) - 0.5) * W * 0.9, y = CY + (((i * 37) % 7) / 7 - 0.5) * H * 0.9;
                const b = this.add.image(x, y, 'boira').setTint(0xa878ec).setScrollFactor(0).setDepth(89990 + i * 0.01).setAlpha(0).setDisplaySize(W * 0.7, H * 0.28);
                parts.push({ o: b, alfa: 0.3 * Math.min(dens, 1.6) });
                this.tweens.add({ targets: b, x: x + (i % 2 ? 60 : -60), duration: 9000 + i * 1300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
            }
        }
        let nivell = nivellBoiraZona(this.scene.key), objectiu = nivell, tw = null;
        const posa = v => { nivell = v; parts.forEach(p => p.o.setAlpha(p.alfa * v)); };
        posa(nivell);
        this.time.addEvent({ delay: 700, loop: true, callback: () => {
            const n = nivellBoiraZona(this.scene.key);
            if (Math.abs(n - objectiu) < 0.001) return;
            objectiu = n;
            if (tw) tw.stop();
            tw = this.tweens.addCounter({ from: nivell, to: n, duration: 4000, onUpdate: c => posa(c.getValue()) });
        } });
    }

    // Boira ambient d'un exterior: com `boira`, però més o menys espessa segons el nivell de la zona (BOIRA_ZONES) i, si ja n'hi ha molt poca, no se'n posa
    boiraAmbient(x, y, ample, alt, quantitat = 1, to = null) {
        const q = quantitat * nivellBoiraZona(this.scene.key) * (((BOIRA_ZONES[this.scene.key] || {}).dens) || 1);
        return q < 0.08 ? null : this.boira(x, y, ample, alt, q, to);
    }

    boira(x, y, ample = 120, alt = 40, quantitat = 1, to = null) {
        return this.add.particles(x, y, 'boira', {
            ...(to ? { tint: to } : {}),
            x: { min: -ample / 2, max: ample / 2 },
            y: { min: -alt / 2, max: alt / 2 },
            speedX: { min: -12, max: 12 },
            speedY: { min: -22, max: -6 },
            scale: { start: 0.7, end: 1.8 },
            alpha: { start: 0.55, end: 0 },
            lifespan: { min: 2600, max: 4200 },
            frequency: 260 / quantitat,
            rotate: { min: 0, max: 360 }
        }).setDepth(y + 40);
    }

    // Una paret de boira espessa i creïble que tapa un pas: moltes capes de núvols grans i suaus, de colors i fondàries diferents, que
    // s'inflen i van a la deriva a poc a poc (el nucli, més fosc; la vora, més clara i esfilagarsada), amb volves que se'n desprenen.
    // o.to (color de la vora), o.fosc (color del nucli), o.dens (1 = normal). Torna { dissipar(fet), objectes } (dissipar: s'esfilagarsa i s'esvaeix).
    boiraParet(x, y, ample, alt, o = {}) {
        const clar = Phaser.Display.Color.IntegerToColor(o.to || 0xc9bde6), fosc = Phaser.Display.Color.IntegerToColor(o.fosc || 0x3a2468);
        const D = Math.min(ample * 0.5, alt * 1.2), dep = o.dep !== undefined ? o.dep : y + 70, objs = [];      // dep: profunditat (per defecte, just per davant del que hi ha al seu nivell)                       // D: diàmetre d'un núvol
        const n = Math.max(6, Math.round(ample * alt / (D * D * 0.55) * (o.dens || 1)));          // núvols per capa
        const ombra = this.add.ellipse(x, y, ample * 1.05, alt * 1.15, o.fosc || 0x3a2468, 0.28).setDepth(dep - 2);          // la foscor que fa la boira a terra
        objs.push(ombra);
        const puff = (f, capa) => {                                         // f: 0 = nucli (fosc), 1 = vora (clar)
            const c = Phaser.Display.Color.Interpolate.ColorWithColor(fosc, clar, 100, Math.round(100 * f));
            const px = x + (Math.random() - 0.5) * ample * (0.9 - 0.25 * (1 - f)), py = y + (Math.random() - 0.5) * alt * (0.9 - 0.25 * (1 - f));
            const e = D / 256 * (0.75 + Math.random() * 0.55);
            const im = this.add.image(px, py, 'boira_nuvol').setTint(Phaser.Display.Color.GetColor(c.r, c.g, c.b)).setScale(e * 1.25, e * 0.95)
                .setAlpha(0.5 + 0.3 * (1 - f) + Math.random() * 0.15).setAngle(Math.random() * 360).setDepth(dep + capa);
            im.baseAlpha = im.alpha;
            this.tweens.add({ targets: im, x: px + (Math.random() - 0.5) * 70, y: py + (Math.random() - 0.5) * 26, angle: im.angle + (Math.random() - 0.5) * 50, scaleX: im.scaleX * (0.88 + Math.random() * 0.26), scaleY: im.scaleY * (0.88 + Math.random() * 0.26),
                duration: 4500 + Math.random() * 4500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: Math.random() * 3000 });
            this.tweens.add({ targets: im, alpha: im.alpha * (0.6 + Math.random() * 0.25), duration: 3000 + Math.random() * 3500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: Math.random() * 2000 });
            objs.push(im);
        };
        for (let i = 0; i < n; i++) puff(0.05 + 0.25 * Math.random(), 0);                 // nucli fosc, al fons
        for (let i = 0; i < n; i++) puff(0.35 + 0.35 * Math.random(), 1);                 // cos mitjà
        for (let i = 0; i < Math.round(n * 0.7); i++) puff(0.7 + 0.3 * Math.random(), 2); // vora clara, al davant
        // Volves que se'n desprenen i s'enlairen
        const volves = this.add.particles(x, y, 'boira_nuvol', {
            x: { min: -ample / 2, max: ample / 2 }, y: { min: -alt / 2, max: alt / 2 }, speedX: { min: -14, max: 14 }, speedY: { min: -26, max: -8 },
            scale: { start: D / 500, end: D / 250 }, alpha: { start: 0.25, end: 0 }, lifespan: { min: 3500, max: 6000 }, frequency: 420,
            tint: o.to || 0xc9bde6, rotate: { min: 0, max: 360 }
        }).setDepth(dep + 3);
        return {
            objectes: objs,
            dissipar: fet => {
                volves.stop();
                objs.forEach(im => {
                    this.tweens.killTweensOf(im);
                    const d = Math.random() * 900;
                    this.tweens.add({ targets: im, alpha: 0, scaleX: im.scaleX * 1.7, scaleY: im.scaleY * 1.5, x: im.x + (Math.random() - 0.5) * 160, y: im.y - 40 - Math.random() * 110, delay: d, duration: 1900 + Math.random() * 900, ease: 'Sine.easeIn',
                        onComplete: () => im.destroy() });
                });
                this.time.delayedCall(3200, () => { volves.destroy(); if (fet) fet(); });
            },
            stop: () => { volves.stop(); }
        };
    }

    // ---------------- Ineu ----------------
    // Una posició desada és bona si és dins la zona i els peus no queden dins d'un obstacle (si l'escena ha canviat
    // des que es va desar, la posició pot haver quedat dins d'una paret: llavors l'Ineu surt per l'entrada)
    llocLliure(x, y) {
        if (x < 0 || y < 0 || x > this.config.amplada || y > this.config.alcada) return false;
        const peus = new Phaser.Geom.Rectangle(x - 18, y - 12, 36, 12);
        return !this.obstacles.getChildren().some(o => o.body && Phaser.Geom.Intersects.RectangleToRectangle(peus, new Phaser.Geom.Rectangle(o.body.x, o.body.y, o.body.width, o.body.height)));
    }

    crearIneu() {
        const e = this.config.entrades;
        let pos;
        if (this.dadesEntrada.restaurar && Estat.dades.x !== null && this.llocLliure(Estat.dades.x, Estat.dades.y)) {
            pos = { x: Estat.dades.x, y: Estat.dades.y, dir: 'avall' };
        } else {
            pos = e[this.dadesEntrada.entrada] || e[Object.keys(e)[0]];
            pos = Object.assign({}, pos, { y: this.mapY(pos.y) });
        }

        if (pos.y < TOPE_Y + 40) pos = Object.assign({}, pos, { y: TOPE_Y + 40 });
        this.posEntrada = pos;
        this.ombraIneu = this.add.image(pos.x, pos.y, 'ombra').setScale(0.4).setDepth(-500);
        const S = SPRITE_INEU;
        this.ineu = this.physics.add.sprite(pos.x, pos.y, 'ineu_down', S.quiet).setOrigin(0.5, S.peus / S.alt);
        this.ineu.setScale(S.alcada / (S.alt * S.k));
        // Silueta fantasma: sempre per sobre de tot; on no hi ha res davant, es confon amb l'Ineu,
        // però si un edifici o un arbre el tapa, se'n veu un contorn translúcid.
        this.fantasma = this.add.sprite(pos.x, pos.y, 'ineu_down', S.quiet).setOrigin(0.5, S.peus / S.alt)
            .setScale(S.alcada / (S.alt * S.k)).setDepth(87000);
        // Caixa de col·lisió petita als peus (en píxels de textura: els de la cel·la de 256 per k)
        this.ineu.body.setSize(72 * S.k, 30 * S.k);
        this.ineu.body.setOffset((S.ample - 72) / 2 * S.k, (S.peus - 30) * S.k);
        // Els fulls d'atac (320 px) són més grans que els de caminar (192 px) i l'origen del sprite és una fracció del fotograma: sense això, durant el cop
        // la caixa de col·lisió es desplaçava ~90 px amunt i ~47 a l'esquerra (i podia tocar una sortida i fer canviar de zona). L'offset es recalcula
        // a cada fotograma perquè la caixa quedi sempre als peus, al mateix lloc que caminant.
        const preIneu = this.ineu.preUpdate.bind(this.ineu);
        this.ineu.preUpdate = (t, d) => {
            preIneu(t, d);
            const f = this.ineu.frame, b = this.ineu.body;
            if (f && b) b.setOffset(f.realWidth / 2 - 36 * S.k, S.peus / S.alt * f.realHeight - 30 * S.k);
        };
        this.ineu.setCollideWorldBounds(true);
        this.physics.add.collider(this.ineu, this.obstacles);
        this.direccio = pos.dir || 'avall';
        this.vista8Manual = false; this.vista8 = undefined;
        this.posarDireccio(this.direccio);
    }

    // dir: 'avall' | 'amunt' | 'esquerra' | 'dreta' (per atacar i interactuar)
    // vista8: una de DIRS_INEU (down, southeast...) per dibuixar el sprite en 8 direccions
    posarDireccio(dir, caminant = false, vista8) {
        this.direccio = dir;
        const per4 = { avall: 'down', amunt: 'up', esquerra: 'left', dreta: 'right' };
        if (vista8) this.vista8 = vista8;
        else if (!this.vista8 || !this.vista8Manual) this.vista8 = per4[dir];
        const vista = this.vista8;
        if (!this.ineu || !this.ineu.anims) return;
        if (this.atacantFins && this.time.now < this.atacantFins) return;      // l'animació de l'atac no es talla
        if (caminant) {
            this.ineu.setFlipX(false);
            // En canviar de vista caminant, el pas continua pel mateix fotograma (no torna a començar: es veia un salt)
            const a = this.ineu.anims, clau = 'caminar_' + vista, ara = a.isPlaying && a.currentAnim;
            if (ara && ara.key !== clau && ara.key.startsWith('caminar_') && a.currentFrame && this.anims.exists(clau)) {
                const n = this.anims.get(clau).frames.length;
                a.play({ key: clau, startFrame: Math.min(n - 1, a.currentFrame.index - 1) });
            } else a.play(clau, true);
        } else {
            const quiet = 'aturat_' + vista;
            if (this.anims.exists(quiet)) {
                this.ineu.setFlipX(false);
                if (!this.ineu.anims.isPlaying || !this.ineu.anims.currentAnim || this.ineu.anims.currentAnim.key !== quiet) {
                    this.ineu.anims.play(quiet, true);
                }
            } else {
                this.ineu.setFlipX(false);
                this.ineu.anims.stop();
                this.ineu.setTexture('ineu_' + vista, quietIneu());
            }
        }
    }

    // ---------------- Esbarzers negres ----------------
    // id: nom únic perquè no tornin a créixer un cop cremats
    esbarzer(x, y, id) {
        if (id && Estat.flag('esb_' + id)) return null;
        const img = this.posar('esbarzer', x, y, { fonsY: y });
        const col = this.colisio(x, y - 13, 80, 26);
        const o = { img, col, x, y, id, viu: true };
        this.esbarzers.push(o);
        return o;
    }

    // Roca que l'Ineu empeny de debò, des de qualsevol costat (dalt, baix, esquerra o dreta), per descobrir el que hi ha a sota:
    // s'hi ha de posar a un costat i caminar contra ella; ella s'aparta 'dist' píxels cap a l'altra banda. ESPAI només l'examina.
    // El costat per on s'ha empès es desa al flag ('E', 'O', 'S' o 'N') perquè en tornar-hi la roca sigui on l'has deixada.
    pedraMobil(x, y, id, dist, extra, textPista, condicio) {
        const flag = Estat.dades.flags['pedra_' + id];
        const DIR = { E: [1, 0], O: [-1, 0], S: [0, 1], N: [0, -1] };
        const d0 = DIR[flag] || [1, 0];                                   // les partides velles només guardaven «true»: la roca era a la dreta
        const mogut = !!flag;
        const o = { id, mogut, x: x + (mogut ? d0[0] * dist : 0), y: y + (mogut ? d0[1] * dist : 0), dist, fet: 0, empenta: 0, dir: null, permet: condicio || (() => true) };       // permet: fins que no es compleix, la roca és un obstacle més (no s'empeny ni mostra cap marca)
        o.img = this.posar('roca', o.x, o.y);
        o.col = this.colisio(o.x, o.y - 13, 70, 26);
        if (!mogut) {
            // Punt d'interacció com els de parlar (la marca només surt quan ets molt a prop), però sense text: la roca es mou en tocar-la (si hi ha textPista, el diu)
            this.interactiu(x, y + 24, 60, textPista ? { pagines: [{ qui: 'Ineu', text: textPista }] } : { pagines: [] },
                { altura: 70, actiu: () => !o.mogut && o.permet() });
            (this.pedresMobils = this.pedresMobils || []).push(o);
        }
        return o;
    }

    // Cada fotograma: si l'Ineu és a tocar de la roca per un costat i vol anar cap a ella, l'empeny a poc a poc cap a l'altre costat.
    // És generós amb la direcció: compta cap a on VOL anar el jugador (no la velocitat física, que el xoc amb la roca anul·la) i n'hi ha prou amb una component
    // cap a la roca d'un ~30% (fins a uns 70° de biaix, també amb el joystick); no cal estar perfectament alineat (vores i cantonades compten) i, mentre
    // s'empeny, no es llisca pels costats de la roca: la component lateral s'anul·la.
    actualitzarPedres(delta) {
        if (!this.pedresMobils) return;
        const b = this.ineu.body, I = this.intent || { x: 0, y: 0 }, M = 14, MARGE = 0.3, MANTENIR = 0.12;
        this.pedresMobils.forEach(o => {
            if (o.mogut || !o.permet()) { o.empenta = 0; return; }
            const c = o.col.body;
            const entreY = b.bottom > c.top - 10 && b.top < c.bottom + 10, entreX = b.right > c.left - 14 && b.left < c.right + 14;
            const costats = [
                { c: 'E', x: 1, y: 0, toca: entreY && Math.abs(b.right - c.left) < M, comp: I.x },
                { c: 'O', x: -1, y: 0, toca: entreY && Math.abs(b.left - c.right) < M, comp: -I.x },
                { c: 'S', x: 0, y: 1, toca: entreX && Math.abs(b.bottom - c.top) < M, comp: I.y },
                { c: 'N', x: 0, y: -1, toca: entreX && Math.abs(b.top - c.bottom) < M, comp: -I.y }
            ];
            let dir = null;
            if (o.dir) { const k = costats.find(q => q.c === o.dir.c); if (k && k.toca && k.comp > MANTENIR) dir = o.dir; }        // un cop començada, segueix cap a la mateixa banda (encara que es biaixi una mica)
            else dir = costats.filter(q => q.toca && q.comp > MARGE).sort((p, q) => q.comp - p.comp)[0] || null;
            if (dir) { if (dir.x) b.setVelocityY(0); else b.setVelocityX(0); }                      // no s'esllavissa pels costats de la roca
            const empeny = !!dir;
            o.empenta = empeny ? o.empenta + delta : Math.max(0, o.empenta - delta * 2);            // si el dit tremola un instant, no es perd tot el que s'havia recolzat
            if (!empeny && o.fet === 0) o.dir = null;
            if (!dir || o.empenta < 220) return;                            // primer s'hi recolza una mica
            o.dir = dir;
            const pas = Math.min(o.dist - o.fet, 75 * delta / 1000);
            o.fet += pas;
            o.img.x += dir.x * pas; o.img.y += dir.y * pas; o.img.setDepth(o.img.y);
            o.col.setPosition(o.img.x, o.img.y - 13); c.updateFromGameObject();
            if (this.time.now > (o.proxSo || 0)) { o.proxSo = this.time.now + 260; Sfx.pas(true); this.cameras.main.shake(80, 0.0015); }
            if (o.fet >= o.dist - 0.5) {
                o.mogut = true;
                Estat.posaFlag('pedra_' + o.id, dir.c);
                Sfx.secret();
                Estat.desar();
            }
        });
    }

    // Un llaç de la Nena a terra: es recull només amb tocar-lo (img = el llaç; k = 1 o 2)
    recullLlac(k, img) {
        if (this.llacAgafat || this.cinema || this.camCinema || !img || !img.visible) return;
        const ui = this.ui();
        if (!ui || ui.dialeg || ui.bloquejat) return;
        if (Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, img.x, img.y) > 46) return;
        this.llacAgafat = true;
        ui.obrirDialeg(DIALEGS.llac(k)(Estat));
    }

    // Escales caminables: x0..x1 és l'ample i 'bandes' les contrapetges [[yDalt, yBaix], ...]. L'Ineu hi va una mica més lent, a cada contrapetja encara més, i hi sona
    // un tap just quan hi trepitja (per la vora per on hi entra, pujant o baixant). (La de l'església, la del Dolmen i la de la torre tenen el seu propi codi.)
    registraGraons(x0, x1, bandes) { (this.graonsLlista = this.graonsLlista || []).push({ x0, x1, bandes, yAnt: undefined, yMin: Math.min(...bandes.map(b => b[0])) - 10, yMax: Math.max(...bandes.map(b => b[1])) + 10 }); }

    efecteGraons() {
        const I = this.ineu;
        if (!I || !I.body || !this.graonsLlista || !this.graonsLlista.length || this.cinema || this.camCinema || this.canviant) return;
        for (const z of this.graonsLlista) {
            if (I.x > z.x0 && I.x < z.x1 && I.y > z.yMin && I.y < z.yMax) {
                let k = 0.85;
                z.bandes.forEach(([ya, yb]) => { if (I.y > ya && I.y < yb) k = 0.55; });
                I.body.velocity.scale(k);
                if (z.yAnt !== undefined) z.bandes.forEach(([ya, yb]) => { const amunt = I.y < z.yAnt, vora = amunt ? yb : ya; if ((z.yAnt - vora) * (I.y - vora) < 0) Sfx.escala(amunt); });
                z.yAnt = I.y;
            } else z.yAnt = undefined;
        }
    }

    // Tots els esbarzers negres punxen: tocar-ne un fa perdre mig gra del rosari i t'empeny enrere (ferIneu dona 1,1 s d'invulnerabilitat).
    // Mai no et deixen sense vida: l'últim mig gra no se'l poden endur (només cal no tocar-los: Runna els talla de lluny, a ~75 px).
    punxenEsbarzers() {
        const b = this.ineu && this.ineu.body;
        if (!b || !this.esbarzers.length || Estat.dades.vida <= 1 || this.caient || this.camCinema || this.cinema) return;
        for (const o of this.esbarzers) {
            if (!o.viu) continue;
            const c = o.col.body;
            if (b.right > c.left - 3 && b.left < c.right + 3 && b.bottom > c.top - 3 && b.top < c.bottom + 3) { this.ferIneu(1, { x: o.x, y: o.y - 13 }); break; }
        }
    }

    destruirEsbarzer(o) {
        Sfx.talla();
        if (!o.viu) return;
        o.viu = false;
        if (o.id) Estat.posaFlag('esb_' + o.id);
        this.obstacles.remove(o.col, true, true);
        const p = this.add.particles(o.x, o.y - 30, 'espurna', {
            speed: { min: 30, max: 110 }, lifespan: 700, scale: { start: 0.9, end: 0 },
            tint: [0xc070ff, 0x6a3a9a], quantity: 10, emitting: false
        }).setDepth(99990);
        p.explode(14);
        this.time.delayedCall(900, () => p.destroy());
        this.tweens.add({ targets: o.img, alpha: 0, scaleY: o.img.scaleY * 0.6, duration: 600, onComplete: () => o.img.destroy() });
    }

    // ---------------- Barrils ----------------
    // Tots els barrils són el mateix gràfic ('barril'), opacs, i es trenquen amb qualsevol arma (vegeu combat.js, atacar)
    barril(x, y, w, h, key = 'barril') {
        const img = this.posar(key, x, y, { opac: true });
        const col = this.colisio(x, y - h / 2, w, h);
        const b = { img, col, x, y, viu: true, key };
        this.barrils.push(b);
        return b;
    }

    // Un sac de gra: es trenca amb qualsevol arma, com un barril (vegeu trencarBarril), en trossos de tela i deixant caure els grans a terra
    sac(x, y, key = 'sac') { return this.barril(x, y, 40, 16, key); }
    // Sacs agrupats de maneres diferents: 'un', 'duo' (un al costat de l'altre), 'tres' (dos i un al davant), 'fila' (tres seguits), 'mont' (quatre, repartits, mai apilats: un sac apilat es quedaria flotant en trencar el de sota)
    sacs(x, y, patro = 'un') {
        const G = {
            un: [[0, 0, 'sac']],
            duo: [[-22, 0, 'sac'], [22, 2, 'sac_b']],
            tres: [[-28, 0, 'sac_b'], [28, 2, 'sac'], [0, 18, 'sac']],
            fila: [[-44, 0, 'sac'], [0, 2, 'sac_b'], [44, 0, 'sac']],
            mont: [[-44, 0, 'sac'], [0, -4, 'sac_b'], [44, 2, 'sac'], [-20, 20, 'sac_b']]
        }[patro] || [[0, 0, 'sac']];
        return G.map(([dx, dy, k, alt]) => {
            const b = this.sac(x + dx, y + dy, alt ? k : k);
            if (alt) { b.img.y -= alt; b.img.setDepth(y + dy + 1); }             // el de sobre queda dalt dels de baix (el cop va al de baix, com un barril)
            return b;
        });
    }

    // El barril es trenca: trossos de fusta (retalls del mateix dibuix) i estelles que salten, reboten i es desfan amb un fade out
    trencarBarril(b, d) {
        if (!b.viu) return;
        b.viu = false;
        const sac = String(b.key || '').startsWith('sac');
        if (sac) { Sfx.puf && Sfx.puf(); Sfx.trenca && Sfx.trenca(); } else Sfx.trenca && Sfx.trenca();
        this.obstacles.remove(b.col, true, true);
        const idx = this.opacs ? this.opacs.indexOf(b.img) : -1;
        if (idx >= 0) this.opacs.splice(idx, 1);
        const key = b.key || 'barril', fr = this.textures.get(key).get(), W = fr.width, H = fr.height;
        const esc = b.img.scaleX, dw = W * esc, dh = H * esc;
        // Tall irregular en 3 columnes x 3 files
        const tallV = [0, W * Phaser.Math.FloatBetween(0.28, 0.38), W * Phaser.Math.FloatBetween(0.62, 0.74), W];
        const tallH = [0, H * Phaser.Math.FloatBetween(0.22, 0.34), H * Phaser.Math.FloatBetween(0.6, 0.74), H];
        const peces = [];
        const dx = d ? d.x : 0, dy = d ? d.y : 0.5;
        for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
            const cx0 = tallV[c], cw = tallV[c + 1] - cx0, cy0 = tallH[r], ch = tallH[r + 1] - cy0;
            const im = this.add.image(0, 0, key).setCrop(cx0, cy0, cw, ch).setScale(esc);
            im.setOrigin((cx0 + cw / 2) / W, (cy0 + ch / 2) / H);
            const px = b.x + ((cx0 + cw / 2) / W - 0.5) * dw, py = b.y - dh + ((cy0 + ch / 2) / H) * dh;
            im.setPosition(px, py);
            const ang = Math.atan2((py - (b.y - dh * 0.4)) * 0.5, px - b.x) + Phaser.Math.FloatBetween(-0.5, 0.5);
            const v = Phaser.Math.FloatBetween(70, 190);
            peces.push({ im, x: px, y: py, vx: Math.cos(ang) * v + dx * 90, vy: -Phaser.Math.FloatBetween(120, 260) + Math.sin(ang) * 40 + dy * 40,
                         vr: Phaser.Math.FloatBetween(-9, 9), terra: b.y + Phaser.Math.FloatBetween(-8, 14), reb: 0 });
        }
        // Estelles fines
        if (!this.textures.exists('astella')) {
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            g.fillStyle(0x8a5a2e, 1).fillRect(0, 0, 14, 3); g.fillStyle(0xc89560, 1).fillRect(0, 0, 14, 1);
            g.generateTexture('astella', 14, 3); g.destroy();
        }
        for (let i = 0; i < (sac ? 0 : 12); i++) {
            const a = Phaser.Math.FloatBetween(0, Math.PI * 2), v = Phaser.Math.FloatBetween(90, 260);
            const im = this.add.image(b.x, b.y - dh * Phaser.Math.FloatBetween(0.2, 0.8), 'astella').setScale(Phaser.Math.FloatBetween(0.5, 1.1)).setAngle(Phaser.Math.Between(0, 360));
            peces.push({ im, x: im.x, y: im.y, vx: Math.cos(a) * v + dx * 70, vy: -Phaser.Math.FloatBetween(100, 280), vr: Phaser.Math.FloatBetween(-14, 14), terra: b.y + Phaser.Math.FloatBetween(-10, 16), reb: 0 });
        }
        // Pols de fusta
        const p = this.add.particles(b.x, b.y - dh * 0.4, 'espurna', {
            speed: { min: 20, max: 80 }, lifespan: 600, scale: { start: 0.8, end: 0 }, alpha: { start: 0.5, end: 0 },
            tint: sac ? [0xe8d8a8, 0xcdb27c] : [0xc9a878, 0x9b7a50], quantity: 8, emitting: false
        }).setDepth(b.y + 5);
        p.explode(10);
        this.time.delayedCall(800, () => p.destroy());
        // Els grans de gra cauen a terra i s'hi queden una estona, amb un petit munt
        if (sac) {
            if (!this.textures.exists('gra')) {
                const g = this.make.graphics({ x: 0, y: 0, add: false });
                g.fillStyle(0xffffff, 1).fillEllipse(3, 2, 5, 3.2); g.generateTexture('gra', 6, 4); g.destroy();
            }
            const ter = b.y + 6;
            for (let i = 0; i < 46; i++) {
                const a = Phaser.Math.FloatBetween(0, Math.PI * 2), v = Phaser.Math.FloatBetween(30, 150);
                const im = this.add.image(b.x + Phaser.Math.FloatBetween(-14, 14), b.y - dh * Phaser.Math.FloatBetween(0.3, 0.8), 'gra').setTint(Phaser.Utils.Array.GetRandom([0xe0b84a, 0xd8a83c, 0xc89a34, 0xe8c860])).setScale(Phaser.Math.FloatBetween(0.8, 1.3));
                peces.push({ im, x: im.x, y: im.y, vx: Math.cos(a) * v + dx * 40, vy: -Phaser.Math.FloatBetween(40, 180), vr: Phaser.Math.FloatBetween(-8, 8),
                    terra: ter + Phaser.Math.FloatBetween(-12, 14), reb: 1, llarg: true });
            }
            const munt = this.add.ellipse(b.x, ter, 46, 12, 0xd2a840, 0.0).setDepth(b.y - 1);
            this.tweens.add({ targets: munt, fillAlpha: 0.55, duration: 700, delay: 500 });
            peces.push({ im: munt, x: b.x, y: ter, vx: 0, vy: 0, vr: 0, terra: 1e9, reb: 9, llarg: true, fix: true });
        }
        // El barril sencer desapareix de cop (queda amagat pels trossos)
        b.img.destroy();
        if (b.alTrencar) b.alTrencar();
        // Els trossos (de fusta, de tela, els grans) cauen i reboten, però no desapareixen: es queden a terra fins que se surt de l'escenari
        // (en tornar-hi, els barrils i els sacs són sencers de nou, perquè l'escena es construeix altra vegada).
        const act = (t, dt) => {
            const s = Math.min(dt, 50) / 1000;
            let enMoviment = false;
            peces.forEach(q => {
                if (!q.im.active || q.fix || q.parat) return;
                q.vy += 900 * s;
                q.x += q.vx * s; q.y += q.vy * s;
                if (q.y > q.terra && q.vy > 0) {
                    q.y = q.terra;
                    if (q.reb < 2) { q.vy *= -0.35; q.vx *= 0.6; q.vr *= 0.5; q.reb++; } else { q.vy = 0; q.vx = 0; q.vr = 0; q.parat = true; }
                }
                q.im.setPosition(q.x, q.y).rotation += q.vr * s;
                q.im.setDepth(Math.max(q.terra, q.y) + 1);
                if (!q.parat) enMoviment = true;
            });
            if (!enMoviment) this.events.off('update', act);
        };
        this.events.on('update', act);
        this.events.once('shutdown', () => this.events.off('update', act));
    }

    // ---------------- Música ----------------
    // Llocs on una melodia pot fer efecte. Amb la flauta a la mà, l'Ineu hi pot tocar (ESPAI o el medalló de la dreta).
    // pista: cal haver llegit abans la pista del lloc (flag 'flauta_<id>', que posa el diàleg en tancar-se).
    // prioritat: la flauta passa davant de qualsevol persona que hi hagi a prop (p. ex. els pastors al voltant del foc)
    // cants: els cants (claus de MELODIES) que hi tenen efecte; si l'Ineu no en sap cap, la interfície de tocar la tarota no s'obre (ni sola ni amb ESPAI)
    llocFlauta(id, x, y, radi, pista = false, actiu = null, prioritat = false, cants = null) {
        this.llocsFlauta.push({ id, x, y, radi, pista, actiu, prioritat, cants });
    }

    // Lloc de flauta on és l'Ineu (o null)
    flautaActiva() {
        if (!Estat.te('flauta') || !this.ineu || this.sensePunts()) return null;
        return this.llocsFlauta.find(l => (!l.pista || Estat.flag('flauta_' + l.id)) && (!l.actiu || l.actiu()) &&
            (!l.cants || l.cants.some(c => MELODIES[c] && Estat.flag(MELODIES[c].flag))) &&
            Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, l.x, l.y) <= l.radi) || null;
    }

    obrirMusica() {
        if (this.canviant || this.game.scene.isActive('Musica')) return;
        this.ineu.body.setVelocity(0);
        this.game.scene.start('Musica', { mode: 'lliure' });
        this.game.scene.bringToTop('Musica');
    }

    // Té efecte aquest cant aquí i ara? Si sí, la tarota el toca sencer (peça completa, vegeu musica.js) abans que passi res; si no, només el missatge curt.
    // Cada zona que té un enMelodia(nom) amb efecte ho reflecteix aquí (les mateixes condicions, sense fer res).
    teEfecteMelodia(nom) { return false; }

    // Una melodia ha sonat bé. La zona pot gestionar-la amb enMelodia(nom) -> true
    melodiaTocada(nom) {
        const gestionada = this.enMelodia ? this.enMelodia(nom) : false;
        if (!gestionada) {
            this.ineuDiu('He tocat el ' + MELODIES[nom].nom + ', però aquí no passa res...');
        }
    }

    guardarPosicio() {
        if (!this.ineu) return;
        Estat.dades.zona = this.scene.key;
        Estat.dades.x = Math.round(this.ineu.x);
        Estat.dades.y = Math.round(this.ineu.y);
    }

    // ---------------- Bucle ----------------
    update(time, delta) {
        this.vigilaBancs();
        this.cicle(time, delta);
        this.zoomCombat(delta);
    }

    // Durant un combat (hi ha un enemic viu a prop, o el boss) la càmera s'acosta una mica (ZOOM_COMBAT) i en acabar torna a lloc, suaument.
    // No toca la càmera quan hi ha un diàleg o una escena: elles porten el seu propi zoom.
    zoomCombat(delta) {
        if (this.camCinema || this.camDialeg || this.camEntrada || !this.zoomBase) return;
        const cam = this.cameras.main, I = this.ineu;
        // Histèresi: s'entra en combat a 650 px, però no se'n surt fins que no hi ha cap enemic a menys de 900 px durant 3 s (sinó, un enemic que passeja
        // vora el límit, amb l'Ineu quiet, feia que el zoom s'acostés i s'allunyés sense parar).
        // Només s'acosta amb un mini-boss (barra de vida) o un grup de 3 o més: una bestiola sola no mou la càmera (el zoom canviant a cada bestiola cansava).
        const dins = r => {
            if (!this.enemics || !I) return false;
            let prop = 0;
            for (const e of this.enemics) {
                if (e.mort || !e.spr || !e.spr.active) continue;
                if (e.def.barra) return true;
                if (Phaser.Math.Distance.Between(e.spr.x, e.spr.y, I.x, I.y) < r) prop++;
            }
            return prop >= 3;
        };
        const ara = this.time.now;
        if (dins(this.enLluita ? 900 : 650)) { this.enLluita = true; this.lluitaFins = ara + 3000; }
        else if (this.enLluita && ara > (this.lluitaFins || 0)) this.enLluita = false;
        const lluita = !!this.enLluita;
        const objectiu = this.zoomBase * (lluita ? ZOOM_COMBAT : 1);
        if (Math.abs(cam.zoom - objectiu) < 0.002) return;
        cam.setZoom(Phaser.Math.Linear(cam.zoom, objectiu, Math.min(1, delta / 450)));
        this.ajustarSuperposicions();
    }

    // Les siluetes translúcides (la de l'Ineu i les dels enemics darrere les capçades) es col·loquen DESPRÉS que la física hagi mogut els cossos: si es feia dins d'update(),
    // copiaven la posició d'abans i anaven sempre un fotograma enrere, i en caminar es veia l'Ineu amb la cara doble, tremolosa i borrosa
    postFisica() {
        // L'ombra de l'Ineu sempre als seus peus, passi el que passi (diàlegs, objectes alçats, canvis de dibuix...): s'actualitza a cada fotograma, també quan l'escena no processa el moviment
        if (this.ombraIneu && this.ineu && this.ineu.active && this.ineu.body && !this.ombraIneuFixa) this.ombraIneu.setPosition(this.ineu.x, this.ineu.y);
        this.sincroFantasma();
        this.transparenciaCopes();
    }

    // Un enemic darrere la capçada d'un arbre no es perd: se'n veu una silueta translúcida per sobre
    // (com la de l'Ineu), que apareix i s'esvaeix suaument. Els arbres no canvien.
    transparenciaCopes() {
        if (!this.copes || !this.enemics) return;
        const caixes = this.copes.map(img => ({ y: img.y, b: img.getBounds() }));
        this.enemics.forEach(e => {
            const sp = e.spr;
            let alfa = 0;
            if (!e.mort && sp.active && sp.visible) {
                const b = sp.getBounds();
                if (caixes.some(c => sp.y < c.y + 4 && Phaser.Geom.Rectangle.Overlaps(c.b, b))) alfa = 0.42;
            }
            let f = e.fantasma;
            if (!f) {
                if (!alfa) return;
                f = e.fantasma = this.add.sprite(sp.x, sp.y, sp.texture.key, sp.frame.name).setDepth(87000).setAlpha(0);
            }
            if (f.texture.key !== sp.texture.key || f.frame.name !== sp.frame.name) f.setTexture(sp.texture.key, sp.frame.name);
            f.setOrigin(sp.originX, sp.originY).setPosition(sp.x, sp.y).setScale(sp.scaleX, sp.scaleY).setFlip(sp.flipX, sp.flipY).setAngle(sp.angle);
            const dest = alfa * sp.alpha;
            f.setAlpha(f.alpha + (dest - f.alpha) * 0.18);
            f.setVisible(f.alpha > 0.01);
        });
    }

    sincroFantasma() {
        const f = this.fantasma, i = this.ineu;
        if (!f || !i || !f.active || !i.active) return;             // (en tancar l'escena ja no hi són)
        if (f.texture.key !== i.texture.key || f.frame.name !== i.frame.name) f.setTexture(i.texture.key, i.frame.name);
        f.setPosition(i.x, i.y).setFlipX(i.flipX).setAlpha(this.assegut ? 0 : i.alpha * 0.38);   // assegut: el banc el tapa de debò
        // Els personatges no es transparenten com els arbres: si un que és davant de l'Ineu el tapa, la silueta s'amaga on hi ha el personatge
        const ib = i.getBounds();
        // Un objecte opac (orgue, altar, bancs...) davant l'Ineu amaga del tot la silueta, encara que també hi hagi un personatge davant (només es pot emmascarar amb un objecte)
        if ((this.opacs || []).some(n => n && n.active && n.visible && n.depth > i.depth && Phaser.Geom.Intersects.RectangleToRectangle(n.getBounds(), ib))) f.setAlpha(0);
        let davant = Object.values(this.npcs || {}).concat(this.opacs || []).find(n => n && n.active && n.visible && n.depth > i.depth
            && Phaser.Geom.Intersects.RectangleToRectangle(n.getBounds(), ib));
        if (!davant) {            // el tronc d'un arbre davant l'Ineu també l'amaga (la copa no: la silueta s'hi veu a través)
            const arbre = (this.copes || []).find(t => t.tronc && t.active && t.visible && t.depth > i.depth && Phaser.Geom.Intersects.RectangleToRectangle(t.troncRect(), ib));
            if (arbre) { davant = arbre.tronc; davant.setPosition(arbre.x, arbre.y).setScale(arbre.scaleX, arbre.scaleY).setFlipX(arbre.flipX); }
        }
        if (davant !== this.npcDavant) {
            this.npcDavant = davant;
            if (davant && !davant.mascaraInv) { davant.mascaraInv = new Phaser.Display.Masks.BitmapMask(this, davant); davant.mascaraInv.invertAlpha = true; }
            if (davant) f.setMask(davant.mascaraInv);
            else f.clearMask();
        }
    }

    // Quan hi ha un diàleg, la caixa de text (i el retrat de qui parla) tapen la part de baix de la pantalla i el HUD la de dalt. Els dos que parlen
    // (l'Ineu i qui li parla) s'han de veure SENCERS entre les dues coses: si no hi cap bé, la càmera es mou just el que cal i, si encara així no hi caben
    // (cos alt o dos personatges molt separats), s'allunya una mica (zoom) fins que hi caben. En acabar torna a lloc igual de suau.
    camaraDialeg(obert) {
        const cam = this.cameras.main;
        if (this.camCinema) return;                  // una escena (enquadrar) porta la càmera ella mateixa
        if (obert) this.tallarEntradaZoom();
        if (obert) {
            if (this.camDialeg) return;
            const p = this.dialegDePunt ? this.puntActiu : null;
            const cossos = [this.ineu];
            if (this.despertarImg && this.despertarImg.active) cossos.push(this.despertarImg);       // el dibuix gran del despertar, que no es pot tapar
            if (p && p.npc && p.npc.active && p.npc.visible) cossos.push(p.npc);
            if (p && p.cameraCossos) cossos.push(...p.cameraCossos.filter(o => o && o.active && o.visible));
            const TOP = TOP_HUD + 8;                                    // sota el HUD flotant
            const alcadaCaixa = this.ui().alcadaCaixaDialeg || 360;
            const LIM = ALT - SAFE_BAIX - alcadaCaixa - 60;                         // 50 px sobre la vora superior del quadre
            const LIM_RETRAT = ALT - SAFE_BAIX - alcadaCaixa - 160;                 // sobre el retrat, que sobresurt per damunt del quadre
            const Z = cam.zoom, wv = cam.worldView, H = ALT - ALT_HUD;
            const mides = cossos.map(o => {
                const b = o.getBounds(), esq = (b.x - wv.x) * Z, dre = (b.right - wv.x) * Z;
                return { dalt: b.y, baix: b.bottom, lim: esq < 200 && dre > 10 ? LIM_RETRAT : LIM };
            });
            // On queden ara (y de pantalla del cap i dels peus)
            const pantalla = (m, z, wy) => ({ dalt: ALT_HUD + (m.dalt - wy) * z, baix: ALT_HUD + (m.baix - wy) * z });
            const be = (z, wy) => mides.every(m => { const q = pantalla(m, z, wy); return q.dalt >= TOP && q.baix <= m.lim; });
            const centrar = !!(p && p.centrarCamera);                   // (el pi: tot el conjunt es posa al mig de l'espai lliure, entre el HUD i el quadre)
            // Parlant amb un personatge, la càmera s'hi acosta una mica (ZOOM_NPC) i es centra entre els dos, dins l'espai que deixen el HUD i el quadre de text:
            // un zoom suau (els gràfics tenen resolució de sobra, no es veu borrós) que en acabar el diàleg torna a lloc. Si no hi caben amb aquest zoom, es fa l'ajust de sempre.
            let z2 = Z, wy2 = wv.y, trobat = false, sx2 = cam.scrollX;
            const conversa = !centrar && !!(p && p.npc && p.npc.active && p.npc.visible);
            if (conversa) {
                const zt = Math.min(p.zoomConversa ? 2.2 : 1.8, Z * (p.zoomConversa || (this.esInterior() ? 1.3 : ZOOM_NPC)));      // als interiors, més a prop (es veuen els NPC amb detall, com a la biblioteca)
                const dalt = Math.min(...mides.map(m => m.dalt)), baix = Math.max(...mides.map(m => m.baix));
                const wyC = (dalt + baix) / 2 - ((TOP + LIM) / 2 - ALT_HUD) / zt;
                if (be(zt, wyC)) {
                    z2 = zt; wy2 = wyC; trobat = true;
                    const esq = Math.min(...cossos.map(o => o.getBounds().x)), dre = Math.max(...cossos.map(o => o.getBounds().right));
                    let cx = (esq + dre) / 2;
                    const ob = this.boundsCamOrig || (() => { const bb = cam.getBounds(); return { x: bb.x, w: bb.width }; })();
                    if (ob.w) cx = Phaser.Math.Clamp(cx, ob.x + AMPLE / (2 * zt), Math.max(ob.x + AMPLE / (2 * zt), ob.x + ob.w - AMPLE / (2 * zt)));
                    sx2 = cx - AMPLE / 2;
                }
            }
            if (!trobat && !centrar && be(Z, wv.y)) return;             // ja es veuen bé: la càmera no es mou
            // Es busca el zoom més gran (fins a 0,6) en què hi caben; la y de la vista s'escull perquè els peus més baixos quedin just al seu límit
            if (centrar) {
                const dalt = Math.min(...mides.map(m => m.dalt)), baix = Math.max(...mides.map(m => m.baix));
                z2 = Phaser.Math.Clamp((LIM - TOP) / (baix - dalt), 0.6, Z);
                wy2 = (dalt + baix) / 2 - ((TOP + LIM) / 2 - ALT_HUD) / z2;
                trobat = true;
            }
            for (let z = Z; z >= 0.6 - 1e-6 && !trobat; z -= 0.05) {
                const wy = Math.max(...mides.map(m => m.baix - (m.lim - ALT_HUD) / z));            // els peus més exigents al seu límit
                if (be(z, wy)) { z2 = z; wy2 = wy; trobat = true; }
            }
            if (!trobat) { z2 = 0.6; wy2 = Math.max(...mides.map(m => m.baix - (m.lim - ALT_HUD) / z2)); }      // no hi cap enlloc: es prioritza que no els tapi la caixa
            this.camDialeg = { sx: cam.scrollX, sy: cam.scrollY, z: cam.zoom };
            if (!this.boundsCamOrig) { const b = cam.getBounds(); this.boundsCamOrig = { x: b.x, y: b.y, w: b.width, h: b.height }; }
            cam.removeBounds(); cam.stopFollow();
            if (this.twCamDialeg) this.twCamDialeg.stop();
            const sy2 = wy2 - (H - H / z2) / 2;                         // scrollY que dona aquesta y de la vista amb aquest zoom
            const v = { u: 0 }, sx0 = cam.scrollX, sy0 = cam.scrollY, z0 = cam.zoom;
            this.twCamDialeg = this.tweens.add({ targets: v, u: 1, duration: 1000, ease: 'Sine.easeInOut', onUpdate: () => { cam.setZoom(Phaser.Math.Linear(z0, z2, v.u)); cam.setScroll(Phaser.Math.Linear(sx0, sx2, v.u), Phaser.Math.Linear(sy0, sy2, v.u)); this.ajustarSuperposicions(); } });
        } else if (this.camDialeg) {
            const d = this.camDialeg, o = this.boundsCamOrig;
            this.camDialeg = null;
            if (this.twCamDialeg) this.twCamDialeg.stop();
            const v = { u: 0 }, sx0 = cam.scrollX, sy0 = cam.scrollY, z0 = cam.zoom;
            // On ha de quedar la càmera: no on era abans del diàleg, sinó on la deixaria seguint l'Ineu ARA (si s'ha aixecat i camina, no la fem tornar enrere i saltar després)
            const destí = () => {
                const I = this.ineu;
                if (!o || !I) return { x: d.sx == null ? sx0 : d.sx, y: d.sy };
                const W = cam.width, H = cam.height, vw = W / d.z, vh = H / d.z;
                const clamp = (p, ini, llarg, vista) => llarg <= vista ? ini + (llarg - vista) / 2 : Phaser.Math.Clamp(p, ini, ini + llarg - vista);
                const esq = clamp(I.x - vw / 2, o.x, o.w, vw), dalt = clamp(I.y - (this.cameraFollowOffsetY || 0) - vh / 2, o.y, o.h, vh);
                return { x: esq - (W - vw) / 2, y: dalt - (H - vh) / 2 };
            };
            this.twCamDialeg = this.tweens.add({
                targets: v, u: 1, duration: 800, ease: 'Sine.easeInOut',
                onUpdate: () => { const t = destí(); cam.setZoom(Phaser.Math.Linear(z0, d.z, v.u)); cam.setScroll(Phaser.Math.Linear(sx0, t.x, v.u), Phaser.Math.Linear(sy0, t.y, v.u)); this.ajustarSuperposicions(); },
                onComplete: () => {
                    cam.setZoom(d.z); this.ajustarSuperposicions();
                    if (o) cam.setBounds(o.x, o.y, o.w, o.h);
                    cam.startFollow(this.ineu, false, 0.12, 0.12, 0, this.cameraFollowOffsetY || 0);
                    this.boundsCamOrig = null;
                }
            });
        }
    }

    // Pla de cinema: la càmera deixa de seguir l'Ineu i enquadra (x, y) al mig de la part de la pantalla que el quadre de diàleg no tapa
    enquadrar(x, y, zoom, ms = 800, fet, reserva = 470) {
        const cam = this.cameras.main;
        this.tallarEntradaZoom();
        if (!this.camCinema) {
            this.camCinema = true;
            if (this.twCamDialeg) this.twCamDialeg.stop();
            // Si la càmera del diàleg ja ha tret els límits (en tancar-se un diàleg que ha mogut la càmera), els límits de veritat són els que va guardar
            const o = this.boundsCamOrig, b = o ? { x: o.x, y: o.y, width: o.w, height: o.h } : cam.getBounds();
            this.boundsCinema = { x: b.x, y: b.y, w: b.width, h: b.height };
            this.boundsCamOrig = null; this.camDialeg = null;
            cam.stopFollow(); cam.removeBounds();
        }
        const W = AMPLE, H = ALT - ALT_HUD, lliure = Math.max(240, H - reserva);
        const sx = x - W / 2, sy = y - (lliure / 2) / zoom - H / 2 + H / (2 * zoom);
        if (this.twCinema) this.twCinema.stop();
        if (ms <= 0) {
            cam.setScroll(sx, sy); cam.setZoom(zoom);
            this.ajustarSuperposicions();
            if (fet) fet();
            return;
        }
        this.twCinema = this.tweens.add({ targets: cam, scrollX: sx, scrollY: sy, zoom, duration: ms, ease: 'Sine.easeInOut',
            onUpdate: () => this.ajustarSuperposicions(), onComplete: () => { this.ajustarSuperposicions(); if (fet) fet(); } });
    }
    // Torna a l'Ineu i el torna a seguir
    alliberarCamera(ms = 800, fet) {
        const cam = this.cameras.main, I = this.ineu, H = ALT - ALT_HUD;
        if (!this.camCinema) { if (fet) fet(); return; }
        if (this.twCinema) this.twCinema.stop();
        // On es posaria la càmera en seguir l'Ineu: a Phaser el centre de la vista és scroll + la meitat de la finestra (sigui quin sigui el zoom) i el
        // desplaçament del seguiment es resta. S'hi aplica també el límit del món, perquè en tornar a posar-lo no hi hagi cap salt.
        const zoom = this.zoomBase || this.zoomZona || ZOOM_CAMERA, b = this.boundsCinema, dw = AMPLE / zoom, dh = H / zoom;          // (el zoom que té ara la zona, no el de l'entrada: així no hi ha salt)
        let destiX = I.x - AMPLE / 2, destiY = I.y - (this.cameraFollowOffsetY || 0) - H / 2;
        if (b) {
            const bx = b.x + (dw - AMPLE) / 2, by = b.y + (dh - H) / 2;
            destiX = Phaser.Math.Clamp(destiX, bx, Math.max(bx, bx + b.w - dw));
            destiY = Phaser.Math.Clamp(destiY, by, Math.max(by, by + b.h - dh));
        }
        this.twCinema = this.tweens.add({ targets: cam, scrollX: destiX, scrollY: destiY, zoom, duration: ms, ease: 'Sine.easeInOut',
            onUpdate: () => this.ajustarSuperposicions(), onComplete: () => {
                const b = this.boundsCinema;
                if (b) cam.setBounds(b.x, b.y, b.w, b.h);
                cam.startFollow(I, false, 0.12, 0.12, 0, this.cameraFollowOffsetY || 0);
                this.camCinema = false; this.ajustarSuperposicions();
                if (fet) fet();
            } });
    }

    // Els vels de color i la boira (fixos a la pantalla: scrollFactor 0) es dibuixen amb la mida del zoom habitual; si la càmera s'allunya, es fan més grans
    // en la mateixa proporció perquè continuïn cobrint tota la pantalla
    ajustarSuperposicions() {
        const k = ZOOM_CAMERA / this.cameras.main.zoom;
        this.children.list.forEach(o => {
            if (o.scrollFactorX !== 0 || o.scrollFactorY !== 0 || !o.setScale) return;
            // (només els velums grans; però un cop apuntat, s'ha de poder tornar a ajustar encara que ara, amb molt de zoom, sigui més petit de 300 px: abans es quedava petit i deixava un quadre fosc)
            if (!o.__esc0) { if (o.displayWidth < 300) return; o.__esc0 = { x: o.scaleX, y: o.scaleY }; }
            o.setScale(o.__esc0.x * k, o.__esc0.y * k);
        });
    }

    cicle(time, delta) {
        if (this.canviant) return;
        const ui = this.ui();
        const accio = Phaser.Input.Keyboard.JustDown(this.tecles.SPACE) ||
                      Phaser.Input.Keyboard.JustDown(this.tecles.ENTER) ||
                      Phaser.Input.Keyboard.JustDown(this.tecles.E) ||
                      ui.consumirAccioTactil();

        if (!this.caminantAuto && (ui.dialeg || ui.bloquejat) && this.ineu && this.ineu.anims && this.ineu.anims.isPlaying) this.posarDireccio(this.direccio, false);
        this.camaraDialeg(!!ui.dialeg);
        if (ui.dialeg) {
            this.ineu.body.setVelocity(0);
            this.congelarEnemics();
            if (accio && !ui.menuObert) ui.avancar();
            this.indicador.setVisible(false);
            return;
        }
        if (ui.bloquejat) {
            this.ineu.body.setVelocity(0);
            this.congelarEnemics();
            return;
        }
        // Mentre sona la tarota (és una escena a part), el món s'atura: ni els enemics es mouen ni fan mal, fins que el cant acaba i el lloc hi reacciona
        if (game.scene.isActive('Musica')) {
            this.ineu.body.setVelocity(0);
            this.congelarEnemics();
            return;
        }

        this.moure(ui, delta);
        this.actualitzarPedres(delta);
        const proper = this.puntProper();
        // La tarota NO s'obre mai directament amb ESPAI: cada lloc de tarota té un punt d'interacció (el «!») amb el seu text, i la tarota s'obre
        // en acabar-lo (vegeu tarotaDespresDeText). Així els enemics de prop no hi interfereixen.
        const mostra = proper;
        this.indicador.setVisible(!!mostra);
        if (mostra) this.indicador.setPosition(mostra.x, mostra.y - mostra.altura);
        const T = Phaser.Input.Keyboard.JustDown;
        if (accio && proper) this.interactuar(proper);
        else if (accio || T(this.tecles.J)) this.atacar();
        time = this.time.now;   // un sol rellotge per a tot el combat
        this.actualitzarCombat(time);
        this.ressaltarEnemics();
        this.comprovarSortides();
        this.punxenEsbarzers();
        this.efecteGraons();
        if (this.actualitzar) this.actualitzar(time, delta);
        this.actualitzarPortes(delta);
    }

    // Porta de doble batent dibuixada damunt de la del gràfic de l'edifici: els batents giren cap endins quan l'Ineu
    // s'hi acosta i es tornen a tancar quan se n'allunya; a dins s'entreveu la foscor càlida.
    // o = { x, top, bottom, ample, fons (profunditat de l'edifici), arc (true: arc de mig punt; un número: arc rebaixat, amb aquesta
    //       fletxa), color, panell, vora, finestra, ferro }
    // Amb retall (la imatge de l'edifici ja posada), el batent és el tros del mateix gràfic: la porta oberta és la que es veu dibuixada.
    portaAnimada(o) {
        // Z: profunditat de la porta. Ha de ser PER DAMUNT de qualsevol cosa que hi passi per darrere: l'Ineu és «dins» la porta mentre la seva y és menor que la base (bottom) i
        // llavors la porta (el batent i l'interior fosc) el tapa, com en travessar un portal. Per això sempre és, com a mínim, just sota la base. (senseAjust: es respecta fons tal qual.)
        const DX = o.x, DT = o.top, DB = o.bottom, DW = o.ample, H = DB - DT, w = o.unic ? DW : DW / 2, r = o.arc ? DW / 2 : 0, Z = o.senseAjust ? o.fons : Math.max(o.fons, DB + 2);
        const forma = (x0, ample, alt, arc) => {                       // contorn d'un rectangle amb (opcionalment) la part de dalt en arc
            if (!arc) return [{ x: x0, y: alt }, { x: x0, y: 0 }, { x: x0 + ample, y: 0 }, { x: x0 + ample, y: alt }];
            const pts = [{ x: x0, y: alt }], fl = arc === true ? ample / 2 : arc;
            for (let k = 0; k <= 12; k++) { const a = Math.PI + k / 12 * Math.PI; pts.push({ x: x0 + ample / 2 + Math.cos(a) * ample / 2, y: fl + Math.sin(a) * fl }); }
            pts.push({ x: x0 + ample, y: alt });
            return pts;
        };
        const dins = this.add.graphics().setDepth(Z + 1).setPosition(0, DT);
        dins.fillStyle(0x0e0806, 1).fillPoints(forma(DX - DW / 2, DW, H, o.arc), true);
        dins.fillGradientStyle(0x0e0806, 0x0e0806, 0x6a4420, 0x6a4420, 1, 1, 0.9, 0.9).fillRect(DX - DW / 2, H * 0.45, DW, H * 0.55);
        dins.fillStyle(0xffd38a, 0.5).fillCircle(DX, H - 22, 9);       // una espelma al fons
        const batent = esq => {
            if (o.retall) {
                // El batent és el tros del gràfic de la porta, retallat amb la seva forma (a una textura pròpia)
                const im = o.retall, src = im.texture.getSourceImage(), nom = 'porta_' + im.texture.key + '_' + DX + '_' + DT;
                const sx = (DX - DW / 2 - im.x + im.displayWidth * im.originX) / im.scaleX, sy = (DT - im.y + im.displayHeight * im.originY) / im.scaleY;
                if (!this.textures.exists(nom)) {
                    const sw = Math.ceil(DW / im.scaleX), sh = Math.ceil(H / im.scaleY), ct = this.textures.createCanvas(nom, sw, sh), cx = ct.getContext();
                    if (o.arc) { cx.beginPath(); forma(0, sw, sh, o.arc === true ? true : o.arc / im.scaleY).forEach((p, k) => k ? cx.lineTo(p.x, p.y) : cx.moveTo(p.x, p.y)); cx.closePath(); cx.clip(); }
                    cx.drawImage(src, sx, sy, sw, sh, 0, 0, sw, sh);
                    ct.refresh();
                }
                const g = this.add.container(DX - DW / 2, DT).setDepth(Z + 2);
                const bi = this.add.image(0, 0, nom).setOrigin(0).setScale(im.scaleX, im.scaleY);
                if (o.tint) bi.setTint(o.tint);                         // la façana té un to (setTint): el batent l'ha de tenir igual
                g.add(bi);
                return g;
            }
            const g = this.add.graphics().setDepth(Z + 2);
            const x = esq ? 0 : -w;                                      // l'origen és la frontissa (vora de fora)
            let pts;
            if (!r || o.unic) pts = forma(x, w, H, !!r);
            else {                                                       // mig arc: cada batent té el seu quart de cercle
                pts = [{ x, y: H }];
                const cx = esq ? x + w : x;
                for (let k = 0; k <= 8; k++) { const a = (esq ? Math.PI : Math.PI * 1.5) + k / 8 * Math.PI / 2; pts.push({ x: cx + Math.cos(a) * r, y: r + Math.sin(a) * r }); }
                pts.push({ x: x + w, y: H });
            }
            g.fillStyle(o.color, 1).fillPoints(pts, true).lineStyle(2, o.vora, 1).strokePoints(pts, true);
            if (o.panell !== undefined) {
                const p0 = r + 8, ph = (H - p0 - 18) / 2;
                g.fillStyle(o.panell, 1).fillRect(x + 6, p0, w - 12, ph - 6).fillRect(x + 6, p0 + ph + 2, w - 12, ph - 6);
                g.lineStyle(1.5, o.vora, 1).strokeRect(x + 6, p0, w - 12, ph - 6).strokeRect(x + 6, p0 + ph + 2, w - 12, ph - 6);
            } else {
                g.lineStyle(1.5, o.vora, 0.8);
                for (let k = 1; k < 3; k++) g.lineBetween(x + w * k / 3, r * 0.6, x + w * k / 3, H - 2);
            }
            // Porta vella: el detall cobreix TOT el batent, també la part de l'arc (ha de ser igual de ric a dalt que a baix). El contorn del batent és un quart
            // de cercle de radi r amb el centre al cantó del mig de la porta (cxx): a cada x, el batent comença a topAt(x).
            const cxx = esq ? x + w : x;
            const topAt = px => r ? Math.max(0, r - Math.sqrt(Math.max(0, r * r - (px - cxx) * (px - cxx)))) : 0;
            const ext = y => r && y < r ? Math.sqrt(Math.max(0, r * r - (r - y) * (r - y))) : w;           // fins on arriba el batent a l'alçada y (des del cantó del mig)
            const xa = y => esq ? Math.max(x, x + w - ext(y)) : x, xb = y => esq ? x + w : Math.min(x + w, x + ext(y));
            if (o.vell) {
                const rn = n => { const q = Math.sin(n * 91.7 + (esq ? 3.1 : 7.7)) * 43758.5453; return q - Math.floor(q); };
                const NP = 4;
                for (let k = 0; k < NP; k++) {                           // cada taulò, d'un to una mica diferent, des de la vora de l'arc fins a terra
                    const p0 = x + w * k / NP, p1 = x + w * (k + 1) / NP, tone = [0x5a4630, 0x4c3a26, 0x634d34, 0x503e2a][(k + (esq ? 0 : 2)) % 4];
                    g.fillStyle(tone, 0.55).fillPoints([{ x: p0 + 1, y: topAt(p0 + 1) + 1 }, { x: p1 - 1, y: topAt(p1 - 1) + 1 }, { x: p1 - 1, y: H - 2 }, { x: p0 + 1, y: H - 2 }], true);
                    g.fillStyle(0xffffff, 0.05).fillRect(p0 + 2, topAt(p0 + 2) + 2, 2, H - topAt(p0 + 2) - 4);
                    if (k > 0) g.lineStyle(2, 0x0e0804, 0.85).lineBetween(p0, topAt(p0) + 1, p0, H - 2);
                }
                for (let k = 0; k < 26; k++) {                          // vetes de la fusta, repartides per tot el batent
                    const gx = x + 3 + rn(k) * (w - 6), ty = topAt(gx) + 6, gy = ty + rn(k + 40) * Math.max(4, H - ty - 40), gl = 12 + rn(k + 80) * 28;
                    g.lineStyle(1, k % 3 ? 0x1c1208 : 0x9a7a52, k % 3 ? 0.45 : 0.22).lineBetween(gx, gy, gx + (rn(k + 7) - 0.5) * 3, Math.min(H - 4, gy + gl));
                }
                [[0.3, 0.2], [0.72, 0.45], [0.45, 0.78]].forEach(([fx, fy]) => { const kx = x + w * fx, ty = topAt(kx), ky = ty + (H - ty) * fy; g.fillStyle(0x1c1208, 0.8).fillEllipse(kx, ky, 7, 11); g.lineStyle(1, 0x0e0804, 0.7).strokeEllipse(kx, ky, 12, 17); });      // nusos
                g.lineStyle(1.5, 0x0a0604, 0.9);                         // esquerdes (una a la part de l'arc i dues més avall)
                [[0.34, 0.06], [0.2, 0.34], [0.64, 0.5]].forEach(([fx, fy]) => { const kx = x + w * fx, ty = topAt(kx) + 4, ky = ty + (H - ty) * fy; g.lineBetween(kx, ky, kx + 3, ky + 12).lineBetween(kx + 3, ky + 12, kx - 1, ky + 22).lineBetween(kx - 1, ky + 22, kx + 4, ky + 34); });
                g.fillStyle(0x1e3a22, 0.32).fillRect(x + 2, H - 16, w - 4, 14);                     // humitat i molsa al peu
                for (let k = 0; k < 7; k++) g.fillStyle(0x080402, 1).fillTriangle(x + 3 + k * (w - 6) / 7, H - 1, x + 3 + k * (w - 6) / 7 + 4 + rn(k) * 5, H - 1, x + 5 + k * (w - 6) / 7, H - 3 - rn(k + 3) * 5);   // vora de baix rosegada
                for (let k = 0; k < 9; k++) { const sx = cxx + (esq ? -1 : 1) * (4 + k * 7.5), sy = topAt(sx) + 2; g.fillStyle(0x8a8a96, 0.8).fillCircle(sx, sy + 3.5, 1.4); }          // fila de claus al llarg de la vora de l'arc
            }
            if (o.ferro && !o.vell) [0.22, 0.78].forEach(f => { g.lineStyle(4, 0x2a2018, 1).lineBetween(x + 3, H * f, x + w - 3, H * f); g.fillStyle(0x2a2018, 1).fillCircle(esq ? x + w - 8 : x + 8, H * f, 4); });
            if (o.vell && o.ferro) {                                     // tres bandes de ferro (la de dalt, dins de l'arc), amb rovell, reblons i frontisses afilades
                [0.17, 0.5, 0.82].forEach(f => {
                    const yb = H * f, ba = xa(yb) + 2, bb = xb(yb) - 2;
                    if (bb - ba < 6) return;
                    g.fillStyle(0x1c1c22, 1).fillRect(ba, yb - 4, bb - ba, 8).lineStyle(1, 0x6a6a74, 0.55).strokeRect(ba, yb - 4, bb - ba, 8);
                    for (let k = 0; k < 6; k++) { const rx = ba + (bb - ba) * (k + 0.5) / 6; g.fillStyle(0x7a4a22, 0.55).fillRect(rx, yb + 4, 2, 5 + (k * 7) % 9); }       // rovell que regalima
                    for (let rx = ba + 6; rx < bb - 3; rx += 12) { g.fillStyle(0x7a7a84, 1).fillCircle(rx, yb, 1.8); g.fillStyle(0x000000, 0.5).fillCircle(rx + 0.6, yb + 0.5, 0.9); }
                    const hx = esq ? ba - 2 : bb + 2, sg = esq ? 1 : -1, hl = w * 0.6;       // frontissa des de la vora de fora
                    if (f !== 0.5) g.fillStyle(0x23232a, 1).fillPoints([{ x: hx, y: yb - 7 }, { x: hx + sg * hl, y: yb - 2 }, { x: hx + sg * (hl + 8), y: yb }, { x: hx + sg * hl, y: yb + 2 }, { x: hx, y: yb + 7 }], true);
                });
            }
            if (esq && o.finestra) {                                     // finestreta enreixada
                g.fillStyle(o.vora, 1).fillRect(x + 10, H - 66, 26, 40);
                g.lineStyle(1.5, 0x5a7a70, 1); for (let k = 1; k < 4; k++) g.lineBetween(x + 10 + k * 6.5, H - 66, x + 10 + k * 6.5, H - 26);
            }
            if (o.vell) {                                                // anella de ferro negre penjada d'un clau, en lloc del pom
                const ax = esq ? x + w - 11 : x + 11, ay = H * 0.55;
                g.fillStyle(0x15151a, 1).fillCircle(ax, ay - 8, 3.2).lineStyle(3, 0x15151a, 1).strokeCircle(ax, ay + 1, 7).lineStyle(1.2, 0x8a8a96, 0.55).strokeCircle(ax - 0.5, ay + 0.5, 7);
            } else
            g.fillStyle(0xcfb36a, 1).fillCircle(esq ? x + w - 9 : x + 9, H * 0.55, 2.8);   // pom
            g.setPosition(esq ? DX - DW / 2 : DX + DW / 2, DT);
            return g;
        };
        const esq = batent(true), dre = o.unic ? null : batent(false);
        const P = { DX, DB, a: 0, estat: 'tancada', esq, dre, bloq: o.bloq };
        this.portesAnim.push(P);
        return P;
    }

    // Mostra una imatge gran (un cartell, una carta...) amb zoom automàtic: surt de l'objecte de la paret, creix fins a omplir la pantalla i s'aclareix de borrosa a nítida.
    // x, y: centre de l'objecte al món; ample: la seva amplada al món; borros: textura petita que hi ha a la paret (opcional). Es tanca tocant o amb ESPAI/ESC; fet() quan es tanca.
    mostrarImatge(key, x, y, ample, borros, fet) {
        const ui = this.ui(), cam = this.cameras.main;
        const sx = cam.x + (x - cam.worldView.x) * cam.zoom, sy = cam.y + (y - cam.worldView.y) * cam.zoom, aw = ample * cam.zoom;
        const tex = ui.textures.get(key).getSourceImage();
        const fons = ui.add.rectangle(AMPLE / 2, ALT / 2, AMPLE, ALT, 0x000000, 0).setDepth(99000).setInteractive();
        const nitid = ui.add.image(sx, sy, key).setDepth(99002).setAlpha(0);
        const dif = borros ? ui.add.image(sx, sy, borros).setDepth(99001) : null;
        const ini = aw / tex.width;
        nitid.setScale(ini);
        if (dif) dif.setScale(aw / ui.textures.get(borros).getSourceImage().width);
        const fi = Math.min(AMPLE * 0.9 / tex.width, ALT * 0.78 / tex.height);
        const pista = ui.add.text(AMPLE / 2, ALT - 70, 'Toca per tancar', estilText(26, '#f2e6c8', { stroke: '#000000', strokeThickness: 5 })).setOrigin(0.5).setDepth(99003).setAlpha(0);
        const v = { u: 0 };
        let obert = false, tancat = false;
        ui.tweens.add({ targets: v, u: 1, duration: 900, ease: 'Sine.easeInOut', onUpdate: () => {
            const e = v.u, x2 = Phaser.Math.Linear(sx, AMPLE / 2, e), y2 = Phaser.Math.Linear(sy, ALT / 2 - 10, e), sc = Phaser.Math.Linear(ini, fi, e);
            nitid.setPosition(x2, y2).setScale(sc).setAlpha(Phaser.Math.Clamp((e - 0.3) / 0.5, 0, 1));
            if (dif) { dif.setPosition(x2, y2).setScale(sc * (ini > 0 ? (tex.width / ui.textures.get(borros).getSourceImage().width) : 1)).setAlpha(1 - Phaser.Math.Clamp((e - 0.3) / 0.5, 0, 1)); }
            fons.setFillStyle(0x000000, 0.82 * e);
        }, onComplete: () => { obert = true; ui.tweens.add({ targets: pista, alpha: 1, duration: 300 }); } });
        const tanca = () => {
            if (!obert || tancat) return; tancat = true;
            ui.input.keyboard.off('keydown', tecla);
            ui.tweens.add({ targets: [nitid, dif, pista, fons].filter(Boolean), alpha: 0, duration: 260, onComplete: () => {
                [nitid, dif, pista, fons].forEach(o => o && o.destroy());
                ui.bloquejatFins = ui.time.now + 350;
                if (fet) fet();
            } });
        };
        const tecla = ev => { if (['Space', 'Enter', 'Escape'].includes(ev.code)) tanca(); };
        ui.input.keyboard.on('keydown', tecla);
        fons.on('pointerdown', tanca);
    }

    // El portal d'arc de la masia (gràfic provisional 'masia'): x, y = peus del centre de la façana
    portaMasia(img, x, y) {
        const t = y - img.displayHeight;
        this.portaAnimada({ x, top: t + img.displayHeight * 0.56, bottom: y - 4, ample: img.displayWidth * 0.15, fons: y - 20, unic: true, arc: true, retall: img, tint: img.isTinted ? img.tintTopLeft : 0 });
    }

    actualitzarPortes(delta) {
        if (!this.ineu) return;
        this.portesAnim.forEach(P => {
            const d = Phaser.Math.Distance.Between(this.ineu.x, this.ineu.y, P.DX, P.DB + 16);
            const objectiu = P.forcaFins && this.time.now < P.forcaFins ? 1 : (P.bloq && P.bloq()) ? 0 : Phaser.Math.Clamp((230 - d) / 150, 0, 1);
            P.a += (objectiu - P.a) * (1 - Math.exp(-(delta || 16) / 130));
            const e = P.a * P.a * (3 - 2 * P.a);                          // entrada i sortida suaus
            [P.esq, P.dre].forEach(b => { if (b) { b.scaleX = 1 - 0.88 * e; b.setAlpha(1 - 0.25 * e); } });   // el batent es veu "de cantó" a mesura que gira cap endins
            if (P.estat === 'tancada' && P.a > 0.1) { P.estat = 'oberta'; Sfx.porta(); }
            else if (P.estat === 'oberta' && P.a < 0.04) { P.estat = 'tancada'; Sfx.porta(); }
        });
    }

    // ---------------- Seure als bancs ----------------
    // this.bancsEsg = [{ x, y, w, cara, img }] (vegeu posarBanc). Caminant cap a un banc l'Ineu hi seu, sense punt d'interacció, i s'aixeca quan el jugador es mou.
    //   cara 'amunt' (banc vist per darrere, com els de l'església): s'hi arriba des de dalt, baixant, i s'hi mira cap amunt; el respatller el tapa.
    //   cara 'avall' (banc vist de cara, amb respatller darrere): s'hi arriba des de baix, pujant, i s'hi mira cap avall; el davant del seient li tapa les cames.
    posarBanc(x, y, w = 130, key = 'banc_respatller', cara = 'avall') {
        const img = this.posar(key, x, y, { col: { w, h: 16 }, opac: true });
        (this.bancsEsg = this.bancsEsg || []).push({ x, y, w, cara, img });
        return img;
    }

    // Assegut, l'Ineu no es belluga: ni l'animació d'idle, un sol fotograma fix
    ineuQuietSeient() {
        const I = this.ineu;
        if (!I || !I.anims) return;
        I.anims.stop();
        I.setTexture('ineu_' + (this.vista8 || 'down'), quietIneu());
    }

    vigilaBancs() {
        if (this.assegut && this.ineu && this.ineu.anims && this.ineu.anims.isPlaying) this.ineuQuietSeient();
        if (this.assegut || !this.ineu || !this.bancsEsg || !this.bancsEsg.length || this.epileg || this.canviant || this.camCinema || this.ineuAlt || this.cinema || this.caient || !this.ineu.body) return;
        const ui = this.ui();
        if ((ui && ui.dialeg) || this.time.now < (this.noSeureFins || 0) || !this.intent) return;
        const I = this.ineu;
        const b = this.bancsEsg.find(b => Math.abs(I.x - b.x) < b.w / 2 && (b.cara === 'avall'
            ? (this.intent.y < -0.35 && I.y > b.y + 4 && I.y < b.y + 46)
            : (this.intent.y > 0.35 && I.y > b.y - 40 && I.y < b.y - 8)));
        if (b) this.seureBanc(b);
    }

    seureBanc(b) {
        this.seientLliure = false;
        this.assegut = true; this.bancActual = b;
        const I = this.ineu, avall = b.cara === 'avall';
        const x = this.seientX = Phaser.Math.Clamp(I.x, b.x - b.w / 2 + 35, b.x + b.w / 2 - 35);
        I.body.checkCollision.none = true;
        const y = avall ? b.y + 8 : b.y - 4;                // de cara: els malucs queden a l'alçada del seient (els peus, darrere el davant del banc)
        I.body.reset(x, y);
        this.ombraIneu.setPosition(x, avall ? b.y - 8 : y);
        this.vista8Manual = true;
        if (avall) {
            I.setDepth(b.y + 1);                                  // davant del banc: les cames li pengen per sobre del cantell del seient, sense fustes pel mig
            if (this.davantBanc) { this.davantBanc.destroy(); this.davantBanc = null; }
            this.posarDireccio('avall', false, 'down');
        } else {
            I.setDepth(b.y - 1);                                  // el banc es dibuixa per sobre: el respatller el tapa
            this.posarDireccio('amunt', false, 'up');             // de cara a l'altar / al que hi hagi davant
        }
        this.ineuQuietSeient();
        if (this.enSeureBanc) this.enSeureBanc(b);
    }

    // S'aixeca just al costat d'on s'ha assegut (a prop, no al cap del banc)
    alcar(dir = 'avall') {
        const b = this.bancActual, x = this.seientX;
        this.assegut = false; this.noSeureFins = this.time.now + 700;
        this.ineu.body.checkCollision.none = false;
        if (this.davantBanc) { this.davantBanc.destroy(); this.davantBanc = null; }
        if (b.cara === 'avall') b.img.setDepth(b.y);
        let pos;
        if (b.cara === 'avall') pos = ({ esquerra: [x - 60, b.y + 14], dreta: [x + 60, b.y + 14] })[dir] || [x, b.y + 40];
        else pos = ({ amunt: [x, b.y - 42], esquerra: [Math.max(x - 45, b.x - b.w / 2 + 12), b.y - 26], dreta: [Math.min(x + 45, b.x + b.w / 2 - 12), b.y - 26] })[dir] || [x, b.y + 38];
        this.ineu.body.reset(pos[0], pos[1]);
        this.posarDireccio(dir === 'amunt' && b.cara === 'avall' ? 'avall' : dir, false);
    }

    moure(ui, delta) {
        this.intent = { x: 0, y: 0 };                                                // cap a on vol anar el jugador (el fan servir l'empenta de les pedres)
        // Assegut en un banc: es queda quiet fins que el jugador es mou (llavors s'aixeca i continua caminant). Si encara té premuda la tecla amb què hi ha arribat, espera que la solti
        if (this.assegut) {
            const c = this.cursors, t = this.tecles;
            const vol = c.left.isDown || c.right.isDown || c.up.isDown || c.down.isDown ||
                t.A.isDown || t.D.isDown || t.W.isDown || t.S.isDown || Math.hypot(ui.vectorTactil.x, ui.vectorTactil.y) > 0.15;
            if (!this.seientLliure) { if (vol) { this.ineu.body.setVelocity(0); return; } this.seientLliure = true; }
            if (!vol) { this.ineu.body.setVelocity(0); return; }
            // Cap a on vol anar el jugador: s'aixeca pel costat on mira, no pel de darrere el banc
            const vx = (c.right.isDown || t.D.isDown ? 1 : 0) - (c.left.isDown || t.A.isDown ? 1 : 0) + ui.vectorTactil.x;
            const vy = (c.down.isDown || t.S.isDown ? 1 : 0) - (c.up.isDown || t.W.isDown ? 1 : 0) + ui.vectorTactil.y;
            this.alcar(Math.abs(vy) >= Math.abs(vx) ? (vy < 0 ? 'amunt' : 'avall') : (vx < 0 ? 'esquerra' : 'dreta'));
        }
        // Empenta forçada (retrocés quan et fan mal): el jugador no la controla
        if (this.forcat && this.time.now < this.forcat.fins) {
            this.ineu.body.setVelocity(this.forcat.vx, this.forcat.vy);
            this.ineu.setDepth(this.ineu.y);
            this.ombraIneu.setPosition(this.ineu.x, this.ineu.y);
            return;
        }
        // Mentre ataca no es mou del lloc (així els peus no llisquen sobre l'animació)
        if (this.atacantFins && this.time.now < this.atacantFins) {
            this.ineu.body.setVelocity(0);
            this.ineu.setDepth(this.ineu.y);
            this.ombraIneu.setPosition(this.ineu.x, this.ineu.y);
            return;
        }
        let vx = 0, vy = 0;
        const c = this.cursors, t = this.tecles;
        if (c.left.isDown || t.A.isDown) vx -= 1;
        if (c.right.isDown || t.D.isDown) vx += 1;
        if (c.up.isDown || t.W.isDown) vy -= 1;
        if (c.down.isDown || t.S.isDown) vy += 1;
        if (vx === 0 && vy === 0) { vx = ui.vectorTactil.x; vy = ui.vectorTactil.y; }

        const len = Math.hypot(vx, vy);
        if (len > 1) { vx /= len; vy /= len; }
        this.intent = { x: vx, y: vy };
        this.ineu.body.setVelocity(vx * VELOCITAT_INEU, vy * VELOCITAT_INEU);

        const movent = Math.hypot(vx, vy) > 0.15;
        if (movent) {
            if (this.time.now > (this.proxPas || 0)) { this.proxPas = this.time.now + 300; this.altrePas = !this.altrePas; Sfx.pas(this.altrePas); }
            const dir = Math.abs(vx) > Math.abs(vy) * 1.1 ? (vx < 0 ? 'esquerra' : 'dreta') : (vy < 0 ? 'amunt' : 'avall');
            // Vista de 8 direccions, amb una mica d'histèresi: caminant en diagonal amb el joystick, l'angle balla a prop del límit
            // entre dues vistes i l'Ineu canviava de fulla a cada moment (parpellejava). No es canvia fins que s'allunya ~10° del sector
            const ang = Math.atan2(vy, vx), actual = OCTANTS_INEU.indexOf(this.vista8);
            let oct = (Math.round(ang / (Math.PI / 4)) + 8) % 8;
            if (actual >= 0 && this.ineu.anims.isPlaying && Math.abs(Phaser.Math.Angle.Wrap(ang - actual * Math.PI / 4)) < Math.PI / 8 + 0.17) oct = actual;
            this.vista8Manual = true;
            this.posarDireccio(dir, true, OCTANTS_INEU[oct]);
        } else if (this.ineu.anims.isPlaying) {
            this.posarDireccio(this.direccio, false);
        }
        this.ineu.setDepth(this.ineu.y);
        this.ombraIneu.setPosition(this.ineu.x, this.ineu.y);
    }

    // Punt interactiu que l'Ineu té al davant: prou a prop (80% del radi) i dins d'un con de ±70° cap on mira.
    // Així, si ataca d'esquena a un cartell, no es posa a llegir.
    // Una zona pot desactivar tots els punts interactius i la flauta (el combat final: ningú no parla ni toca res)
    sensePunts() { return false; }

    puntProper() {
        if (this.sensePunts()) return null;
        const v8 = { right: [1, 0], southeast: [1, 1], down: [0, 1], southwest: [-1, 1], left: [-1, 0], northwest: [-1, -1], up: [0, -1], northeast: [1, -1] }[this.vista8];
        const dv = v8 ? { x: v8[0] / Math.hypot(...v8), y: v8[1] / Math.hypot(...v8) } : (DIRS[this.direccio] || DIRS.avall);
        let millor = null, millorDist = Infinity;
        for (const p of this.interactius) {
            if (p.actiu && !p.actiu()) continue;
            if (!p.enTancar && esDialegBuit(p.dialeg)) continue;                                        // sense res a dir: no és interactiu
            const dx = p.x - this.ineu.x, dy = p.y - this.ineu.y, d = Math.hypot(dx, dy);
            if (d > p.radi * 0.8 || d >= millorDist) continue;
            if (!p.senseMirada && d > 36 && (dx * dv.x + dy * dv.y) / d < 0.34) continue; // no el mira
            millor = p; millorDist = d;
        }
        return millor;
    }

    interactuar(punt) {
        this.puntActiu = punt;
        this.dialegDePunt = true;       // la càmera del diàleg només té en compte qui parla quan el diàleg ve d'una interacció
        if (punt.enInteractuar) punt.enInteractuar();
        const dialeg = typeof punt.dialeg === 'function' ? punt.dialeg(Estat) : punt.dialeg;
        if (!dialeg) { this.dialegDePunt = false; if (punt.enTancar) punt.enTancar(); this.tarotaDespresDeText(punt); return; }   // accions sense diàleg (només un efecte a l'escena)
        const obre = () => this.ui().obrirDialeg(dialeg, () => {
            if (punt.enTancar) punt.enTancar();
            Estat.desar();
            this.dialegDePunt = false;
            this.tarotaDespresDeText(punt);
        });
        if (punt.npc && dialeg.pagines && dialeg.pagines.length) this.separarDeNpc(punt.npc, obre); else obre();
    }

    // Sempre primer el text i després la tarota: si el punt llegit és al lloc d'una tarota activa (la bassa, la pedra...), en acabar el diàleg
    // s'obre la interfície de tocar. Així no depèn dels enemics de prop (amb ells, ESPAI ataca).
    tarotaDespresDeText(punt) {
        this.time.delayedCall(400, () => {
            if (this.canviant || this.ui().dialeg || this.ui().bloquejat) return;
            const lloc = this.flautaActiva();
            if (lloc && Phaser.Math.Distance.Between(punt.x, punt.y, lloc.x, lloc.y) < 80) this.obrirMusica();
        });
    }

    // Parlar amb algú: l'Ineu fa un pas enrere perquè els dos dibuixos no se solapin («parlen a una petita distància, sense tocar-se»).
    // La distància és una el·lipse: més ample als costats (l'amplada dels dos dibuixos i un buit) que de cara (uns 80 px). Si enrere hi ha una paret,
    // un arbre, un altre personatge o una sortida, prova altres direccions properes; si no hi cap enlloc, es queda on és.
    separarDeNpc(n, fet) {
        const I = this.ineu;
        if (this.assegut || !n || !n.active || !I.visible) { fet(); return; }
        const ax = 31 + n.displayWidth * 0.5 + 14, ay = 80;                                   // mig cos de l'Ineu + mig cos de l'altre + un buit de 14
        const dx0 = I.x - n.x, dy0 = I.y - n.y, d0 = Math.hypot(dx0, dy0) || 1, ang0 = Math.atan2(dy0 || 1, dx0);
        const radi = a => 1 / Math.hypot(Math.cos(a) / ax, Math.sin(a) / ay);              // distància necessària en aquella direcció
        const lliure = (x, y) => this.llocLliure(x, y) && y > TOPE_Y + 8 && x > 24 && x < this.config.amplada - 24 &&
            !this.sortides.some(r => Phaser.Geom.Rectangle.Contains(Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(r.r), 24, 24), x, y));
        const cami = (x, y) => { for (let k = 1; k <= 8; k++) if (!lliure(I.x + (x - I.x) * k / 8, I.y + (y - I.y) * k / 8)) return false; return true; };
        if (d0 >= radi(ang0) - 4) { this.cara(n); fet(); return; }                           // ja és prou lluny
        let millor = null;
        for (const gir of [0, 0.45, -0.45, 0.9, -0.9, 1.35, -1.35]) {
            const a = ang0 + gir, r = radi(a), x = n.x + Math.cos(a) * r, y = n.y + Math.sin(a) * r;
            if (cami(x, y)) { millor = { x, y }; break; }
        }
        if (!millor) {                                                                       // tan enrere com es pugui en línia recta
            let t = 0; const r = radi(ang0), ux = Math.cos(ang0), uy = Math.sin(ang0);
            for (let k = 1; k <= 12; k++) { const x = I.x + ux * (r - d0) * k / 12, y = I.y + uy * (r - d0) * k / 12; if (!lliure(x, y)) break; t = k / 12; }
            if (t > 0) millor = { x: I.x + ux * (r - d0) * t, y: I.y + uy * (r - d0) * t };
        }
        if (!millor) { this.cara(n); fet(); return; }
        this.canviant = true;                                                                // no es pot moure mentre fa el pas
        I.body.setVelocity(0);
        this.cara(n);
        let fet2 = false;
        const acaba = () => { if (fet2) return; fet2 = true; I.body.reset(I.x, I.y); this.canviant = false; this.cara(n); fet(); };
        this.tweens.add({ targets: I, x: millor.x, y: millor.y, duration: 170, ease: 'Sine.easeOut',
            onUpdate: () => { I.setDepth(I.y); if (this.ombraIneu) this.ombraIneu.setPosition(I.x, I.y); }, onComplete: () => { if (this.ombraIneu) this.ombraIneu.setPosition(I.x, I.y); acaba(); } });
        this.time.delayedCall(600, acaba);              // si el pas s'interromp (un cop...), no es queda mai encallat
    }
    // L'Ineu es gira cap a algú
    cara(n) {
        const dx = n.x - this.ineu.x, dy = n.y - this.ineu.y;
        this.vista8Manual = false; this.vista8 = null;                // (si no, es quedava la vista de 8 direccions de l'últim tram caminat, i mirava cap a un altre costat)
        this.posarDireccio(Math.abs(dx) > Math.abs(dy) * 0.9 ? (dx < 0 ? 'esquerra' : 'dreta') : (dy < 0 ? 'amunt' : 'avall'), false);
    }

    // ---- Inici tancat ----
    // L'aventura s'obre en tenir parlat amb el Pare Jordà i el bastó de pelegrí (les partides que ja han anat més enllà, també queden obertes)
    iniciObert() {
        return (Estat.flag('clauerNovici') && Estat.flag('bastoObtingut')) ||
            ['cantAurora', 'visitada_ZonaRuines', 'visitada_ZonaCreu', 'visitada_ZonaCasaGran', 'visitada_ZonaCelles', 'visitada_ZonaEsglesia'].some(f => Estat.flag(f));
    }
    sortidaTancada(s) { return !this.iniciObert() && ZONES_INICI.includes(this.scene.key) && !ZONES_INICI.includes(s.desti); }

    // Les sortides tancades de l'inici no tenen llum: en obrir-se el camí (bastó + Pare Jordà), apareix la llum i ja es pot passar
    posarBoiraSortides() {
        const pendents = this.sortides.filter(s => s.pendentLlum);
        if (!pendents.length) return;
        const vig = this.time.addEvent({ delay: 400, loop: true, callback: () => {
            if (!this.iniciObert()) return;
            vig.remove();
            pendents.forEach(s => { s.pendentLlum = false; this.marcarSortida(s.r); });
        } });
    }

    comprovarSortides() {
        if (this.forcat && this.time.now < this.forcat.fins) return;       // un retrocés mai no fa canviar de zona
        const b = this.ineu.body;
        const peus = new Phaser.Geom.Rectangle(b.x, b.y, b.width, b.height);
        for (const s of this.sortides) {
            if (s.desarmada) { if (!Phaser.Geom.Intersects.RectangleToRectangle(peus, s.r)) s.desarmada = false; continue; }       // sortida recent: només compta quan l'Ineu en surt i hi torna
            // Per una porta només s'hi entra pel buit: el centre del cos ha d'estar dins l'amplada de la porta (o alçada en sortides laterals)
            const dir = this.dirSortida(s.r);
            const horitz = dir === 'amunt' || dir === 'avall';
            const c = b.center;
            const mx = Math.min(6, Math.max(2, s.r.width * 0.05));
            const my = Math.min(6, Math.max(2, s.r.height * 0.05));
            const centrat = horitz ? (c.x >= s.r.x + mx && c.x <= s.r.right - mx)
                                   : (c.y >= s.r.y + my && c.y <= s.r.bottom - my);
            if (s.peu ? s.r.contains(b.center.x, b.bottom) : (centrat && Phaser.Geom.Intersects.RectangleToRectangle(peus, s.r))) {
                if (s.pendentLlum) continue;                             // encara tancada: no és una sortida (sense llum; es camina contra el marge)
                if (s.baixar !== undefined) this.baixarEscala(s);
                else this.canviarZona(s.desti, s.entrada, dir);
                return;
            }
        }
    }

    // Escala que baixa sota terra cap al nord (un forat, una trapa): ycut és la vora de davant del forat
    sortidaEscala(x, y, w, h, desti, entrada, ycut) {
        Object.assign(this.sortida(x, y, w, h, desti, entrada), { baixar: ycut, xEscala: x + w / 2 });
    }

    // L'Ineu baixa l'escala: camina d'esquena cap al mig de l'escala i s'enfonsa darrere la vora de davant del forat,
    // cada cop més fosc, graó a graó; després canvia de zona
    baixarEscala(s) {
        if (this.canviant) return;
        this.canviant = true;
        const I = this.ineu, alt = I.displayHeight, y0 = I.y, y1 = s.baixar + alt * 0.95;
        I.body.setVelocity(0); I.body.enable = false;
        this.posarDireccio('amunt', true);
        this.ombraIneu.setVisible(false);
        I.setMask(this.make.graphics({ add: false }).fillRect(0, 0, this.config.amplada, s.baixar).createGeometryMask());
        const graons = 6;
        let graoAnt = -1;
        this.tweens.addCounter({
            from: 0, to: 1, duration: 1500,
            onUpdate: tw => {
                const f = tw.getValue(), g = f * graons, pas = Math.floor(g) + Phaser.Math.Easing.Sine.InOut(g % 1);   // cada graó: baixada suau i repòs
                if (Math.floor(g) !== graoAnt) { graoAnt = Math.floor(g); Sfx.escala(false); }          // un tap a cada graó que baixa
                I.setPosition(Phaser.Math.Linear(I.x, s.xEscala, 0.08), y0 + (y1 - y0) * pas / graons);
                const c = Math.round(255 * (1 - 0.7 * f));
                I.setTint(Phaser.Display.Color.GetColor(c, c, c));
            }
        });
        Sfx.porta();
        this.time.delayedCall(1250, () => { this.canviant = false; this.canviarZona(s.desti, s.entrada); });
    }

    // Per on surt una sortida: segons la vora de la zona on és el rectangle (igual que marcarSortida)
    dirSortida(r) {
        const c = this.config, vora = 20;
        if (r.x <= vora) return 'esquerra';
        if (r.right >= c.amplada - vora) return 'dreta';
        if (r.bottom >= c.alcada - vora) return 'avall';
        return 'amunt';
    }

    // L'Ineu camina PAS_PORTA píxels en la direcció dir, sense col·lisions (travessa la porta, la llum, la paret...). amb foscor: s'enfosqueix mentre avança.
    pasPorta(dir, fet, foscor = false, d = PAS_PORTA) {
        const I = this.ineu, v = { esquerra: [-1, 0], dreta: [1, 0], amunt: [0, -1], avall: [0, 1] }[dir] || [0, 0];
        I.body.setVelocity(0);
        I.body.checkCollision.none = true;
        this.posarDireccio(dir, true);
        const x0 = I.x, y0 = I.y;
        this.tweens.addCounter({
            from: 0, to: 1, duration: MS_PAS_PORTA,
            onUpdate: tw => {
                const f = tw.getValue();
                I.setPosition(x0 + v[0] * d * f, y0 + v[1] * d * f);
                I.setDepth(I.y);                                    // la profunditat segueix la y: en entrar per una porta, la porta (que és més amunt en profunditat) el tapa
                this.ombraIneu.setPosition(I.x, I.y);
                if (foscor) { const c = Math.round(255 * (1 - 0.65 * f)); I.setTint(Phaser.Display.Color.GetColor(c, c, c)); }
            },
            onComplete: () => { this.posarDireccio(dir, false); if (fet) fet(); }
        });
    }

    // En arribar per una porta, l'Ineu camina una mica cap endins de la sala (el mateix pas que en sortir)
    pasEntrada(pos) {
        const ui = this.ui();
        if (!pos || ui.dialeg || ui.bloquejat) return;
        const v = { esquerra: [-1, 0], dreta: [1, 0], amunt: [0, -1], avall: [0, 1] }[pos.dir || 'avall'];
        let d = PAS_PORTA;
        while (d > 0 && !this.llocLliure(pos.x + v[0] * d, pos.y + v[1] * d)) d -= 8;       // no cap a dins d'un obstacle
        if (d <= 0) return;
        this.canviant = true;
        this.pasPorta(pos.dir || 'avall', () => {
            this.ineu.body.checkCollision.none = false;
            this.canviant = false;
        }, false, d);
    }

    // dir: per on s'ha sortit (si es coneix): l'Ineu avança un pas més cap a la foscor mentre la pantalla s'enfosqueix
    canviarZona(desti, entrada, dir) {
        if (this.canviant) return;
        this.canviant = true;
        Sfx.porta();
        this.ineu.body.setVelocity(0);
        Estat.dades.entrada = entrada;
        Estat.dades.x = null;
        Estat.dades.y = null;
        if (dir) {
            this.pasPorta(dir, null, true);
            this.cameras.main.fadeOut(MS_PAS_PORTA, 0, 0, 0);
        } else {
            this.posarDireccio(this.direccio, false);
            this.cameras.main.fadeOut(300, 0, 0, 0);
        }
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(desti, { entrada });
        });
    }
}
