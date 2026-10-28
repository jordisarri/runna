/**
 * PROGRÉS DE LA PARTIDA: l'ordre dels passos del joc, en un sol lloc.
 * Cada pas té:
 *   id     nom curt (per a la prova eines/prova_progres.js i per depurar)
 *   fet    E => true quan el pas ja és fet
 *   pista  E => text que diuen les Venerables Sàvies (i els monjos, i el Til·ler) quan aquest és el pas següent
 *   marca  flags ('nom') i objectes ('obj:nom') que el joc posa en acabar el pas; la prova comprova que el codi els posa de debò
 * Les pistes de tot el joc surten d'aquí: si canvia l'ordre del guió, només cal tocar aquesta taula (i docs/GUIO.md).
 */
const PROGRES = {
    // Història principal, en ordre. Els passos de més d'un tram (sopar, fragments) donen una pista diferent per a cada tram.
    passos: [
        // ---- ACTE 1 ----
        { id: 'clauer', marca: ['clauerNovici'], fet: E => E.flag('clauerNovici'),
          pista: E => "Fill, ves a la Plaça: el Pare Jordi et busca." },
        { id: 'basto', marca: ['bastoObtingut', 'obj:basto'], fet: E => E.flag('bastoObtingut'),
          pista: E => "El Germà Andreu, vora els xiprers de la Plaça, té un bastó de pelegrí per a tu. Amb les bestioles que corren, et farà falta." },
        { id: 'cantAurora', marca: ['cantAurora'], fet: E => E.flag('cantAurora'),
          pista: E => "Al Santuari, la Pianista encara sap un cant que la boira no li pot prendre. Fes-te'l ensenyar." },
        { id: 'bassadoria', marca: ['bassadoriaNeta'], fet: E => E.flag('bassadoriaNeta'),
          pista: E => "Davant la Bassadòria, al sud de la Plaça, prem ESPAI i tria tocar la flauta: 1-2-3." },
        // ---- ACTE 2: el camí del Til·ler ----
        { id: 'font', marca: ['fontNeta', 'cristallGel', 'obj:cristall_gel', 'obj:aigua_sj'], fet: E => E.flag('fontNeta'),
          pista: E => "Al bosc de l'oest, a tocar de les Cel·les, hi ha una Font del Bisbe que s'ha adormit. Porta-li l'herba de Sant Joan i el romaní, que brillen entre els arbres com espurnes, i una pruna de la Prunera Màgica del jardí de l'Hostatgeria." },
        { id: 'jaumeta', marca: ['jaumetaVista', 'obj:beuratge'], fet: E => E.flag('jaumetaVista') || E.flag('parlatTiler'),
          pista: E => "Amb l'aigua de la Font del Bisbe, l'Alzina Buida del bosc, la més grossa de la clariana, s'obre com un portal. Allà viu la Jaumeta, que és vident i et donarà alguna cosa per al camí del Til·ler." },
        { id: 'boiraTiller', marca: ['boiraTillerNeta'], fet: E => E.flag('boiraTillerNeta') || E.flag('parlatTiler'),
          pista: E => "El Gran Til·ler és al nord de les Cel·les, però una boira espessa tapa el camí. Aboca-hi el beuratge de la Jaumeta i es desfarà." },
        { id: 'tiller', marca: ['parlatTiler', 'tillerBranca'], fet: E => E.flag('parlatTiler'),
          pista: E => "Pel camí que s'ha aclarit, al nord de les Cel·les, hi ha el Gran Til·ler. Parla-hi: ell sap què fer amb les bestioles que desperten." },
        { id: 'branca', marca: ['obj:basto_tiller'], fet: E => E.te('basto_tiller'),
          pista: E => "Agafa la branca que ha caigut al peu del Til·ler: és més àgil que el bastó de pelegrí que portes." },
        { id: 'bardissa', marca: ['camiCirosaObert'], fet: E => E.flag('camiCirosaObert'),
          pista: E => "Al Gran Til·ler, el camí del nord-est és tancat per les arrels de l'arbre. Colpeja-les amb la branca del Til·ler i s'enfonsaran." },
        { id: 'pastor', marca: ['pastorVencut'], fet: E => E.flag('pastorVencut'),
          pista: E => "Puja a la Cirosa pel camí que han obert les arrels. El Germà Andreu ja no és a la Plaça: és a la pastura, a la dreta de la tanca, fet Pastor de Boira. L'has de vèncer." },
        { id: 'esquelles', marca: ['esquelles', 'obj:esquelles'], fet: E => E.flag('esquelles'),
          pista: E => "A la Cirosa, parla amb el pastor vell, vora el foc: t'ha de donar les esquelles dels seus avis." },
        { id: 'soparObert', marca: ['soparObert'], fet: E => E.flag('soparObert'),
          pista: E => "Torna al Gran Til·ler amb les esquelles: et vol parlar d'un sopar." },
        { id: 'sopar', marca: ['escudella', 'floresIsidre', 'pastorsConvencuts', 'soparFet', 'fullaTiler', 'obj:fulla_tiler'], fet: E => E.flag('soparFet'),
          pista: E => {
              const f = [];
              if (!E.flag('escudella')) f.push("l'escudella de la Neus (Sant Benet, a les cel·les)");
              if (!E.flag('floresIsidre')) f.push("les flors de l'Isidre (jardí de l'Hostatgeria)");
              if (!E.flag('pastorsConvencuts')) f.push("els pastors de la Cirosa (toca la flauta vora el seu foc)");
              return f.length ? "Per al sopar del Til·ler et falta: " + f.join(', ') + "." : "Ja ho tens tot: torna al Gran Til·ler i que es faci el sopar.";
          } },
        // ---- ACTE 2: el Saber i les benediccions ----
        { id: 'fragment1', marca: ['fragment1'], fet: E => E.flag('fragment1'),
          pista: E => "A les Runes, entre dues pedres, hi ha un pergamí esquinçat (fragment 1). Mira-hi bé." },
        { id: 'clauSagrari', marca: ['missatgeDesxifrat', 'obj:clau_sagrari'], fet: E => E.flag('missatgeDesxifrat') || E.te('clau_sagrari') || E.flag('fragment2'),
          pista: E => {
              const cols = Array.from({ length: 12 }, (_, i) => E.flag('col' + (i + 1))).filter(Boolean).length;
              return cols < 12 ? "El sagrari del Santuari guarda el fragment 2, però és tancat amb una clau petita que els monjos van deixar a l'ermita de la Desaparició. Al camí de la Desaparició hi ha dotze columnes, i cada una t'explica una paraula (" + cols + "/12). Apunta-les totes!"
                  : "Ja tens les dotze paraules. A l'ermita de la Desaparició, llegeix les taules de pedra i digues la frase sencera davant l'altar: apareixerà un cofre amb la clau petita del sagrari.";
          } },
        { id: 'fragment2', marca: ['fragment2'], fet: E => E.flag('fragment2'),
          pista: E => "Ja tens la clau petita: el sagrari és al mig del retaule del Santuari i guarda el fragment 2." },
        { id: 'fragment3', marca: ['fragment3'], fet: E => E.flag('fragment3'),
          pista: E => "Porta els dos fragments al Pare Alcuí, a la biblioteca del Monestir: te'ls llegirà." },
        { id: 'ombra', marca: ['ombraDemanaCant', 'cantPedres', 'benedicioMonjo'], fet: E => E.flag('benedicioMonjo'),
          pista: E => !E.flag('ombraDemanaCant') ? "Parla amb l'ombra del monjo, a les Runes (a la dreta del replà de pedra): et dirà què vol."
              : !E.flag('cantPedres') ? "La Pianista, al Santuari, t'ensenya el Cant de les Pedres. Després toca'l amb la flauta davant l'ombra del monjo, a les Runes."
              : "Toca el Cant de les Pedres amb la flauta (3-1-2-1) davant l'ombra del monjo, a les Runes." },
        { id: 'saber', marca: ['saber'], fet: E => E.flag('saber'),
          pista: E => "Ara que l'ombra t'ha beneït, el Pare Alcuí, a la biblioteca, et dirà les Paraules del Saber." },
        { id: 'benediccio', marca: ['benediccio'], fet: E => E.flag('benediccio'),
          pista: E => "El Pare Jordi, a la Plaça, vol donar-te la benedicció ara que tens el permís del Til·ler." },
        // ---- ACTE 2: el camí del Dolmen ----
        { id: 'telescopi', marca: ['garfBancSegut', 'telescopi', 'obj:telescopi'], fet: E => E.flag('telescopi') || E.flag('estelLlorenc'),
          pista: E => !E.flag('garfBancSegut')
              ? "A l'Era (camí de les Runes cap a l'oest, passada l'Ermita) hi ha el Garf, l'inventor. Seu al banc de davant seu i parla-hi: amb el cristall de gel de la Font del Bisbe et farà una cosa per mirar el cel."
              : "Porta al Garf, a l'Era, el cristall de gel de la Font del Bisbe: et construirà un telescopi." },
        { id: 'estels', marca: ['telescopiMuntat', 'estelsFets'], fet: E => E.flag('estelsFets') || E.flag('estelLlorenc'),
          pista: E => "Amb el telescopi, ves als Dipòsits: de l'Era cap a l'oest, la Rovellonera (on hi ha rovellons sota els pins hi ha camí: sud, ponent i sud), Sant Gabriel i, a llevant, els Dipòsits. Munta el telescopi al mirador i compta els estels." },
        { id: 'estelLlorenc', marca: ['estelLlorenc', 'obj:estel_llorenc'], fet: E => E.flag('estelLlorenc'),
          pista: E => "L'últim estel ha caigut a l'aigua del dipòsit de llevant, als Dipòsits. Enfila't per l'escala de ferro i agafa la seva llum." },
        { id: 'runna', marca: ['runna', 'obj:runna'], fet: E => E.flag('runna'),
          pista: E => "Amb l'Estel de Sant Llorenç, la boira del camí de llevant dels Dipòsits s'aparta. Al final hi ha el Dolmen: amb la Fulla, el Saber i la Benedicció, Runna es despertarà." },
        // ---- ACTE 3 ----
        { id: 'cantMiracle', marca: ['cantMiracle'], fet: E => E.flag('cantMiracle'),
          pista: E => "Ara que portes Runna, torna al Santuari: la Pianista t'ha d'ensenyar l'últim cant, el Cant del Miracle. Els barrots de la gàbia només l'escolten a ell." },
        { id: 'josep', marca: ['josepVencut', 'obj:llanterna'], fet: E => E.flag('josepVencut'),
          pista: E => "Al Celler, entre la Plaça i les Runes, en Josep és el millor jugador de ping-pong. Allà els secrets es guanyen a la taula: parla amb en Josep i guanya-li el partit. (Quan la pilota bota i s'enlaira, espera que el cercle es posi verd i prem el carril de la pilota.)" },
        { id: 'guants', marca: ['obj:ram', 'florsCreu', 'obj:guants'], fet: E => E.te('guants') || E.flag('rodaMoguda'),
          pista: E => E.flag('florsCreu') ? "Torna a Sant Antoni, fill: el Germà Francesc t'espera."
              : E.te('ram') ? "El ram del Germà Francesc va a la tomba de l'àngel del Cementiri."
              : "El Germà Francesc, que passeja per Sant Antoni (a llevant del Monestir), té uns guants que mouen el que pesa. Fes-li un favor i te'ls deixarà." },
        { id: 'roda', marca: ['rodaMoguda'], fet: E => E.flag('rodaMoguda'),
          pista: E => "La roda de carruatge del Celler amaga el túnel dels monjos: amb els guants posats, empeny-la des d'un costat, caminant-hi en contra." },
        { id: 'cambra', marca: ['cofreCambra', 'obj:pergami_monjo'], fet: E => E.flag('cofreCambra'),
          pista: E => "Baixa pel passadís de darrere la roda: talla amb Runna el mur d'esbarzers negres (llueixen violeta entre quatre espelmes) i arribaràs a la Cambra secreta dels monjos, amb un cofre." },
        { id: 'palanca', marca: ['jordiPalanca', 'palanca', 'obj:palanca'], fet: E => E.flag('palanca') || E.te('palanca'),
          pista: E => E.flag('jordiPalanca')
              ? "La palanca d'en Jordi és al cofre de les joguines, dalt de la caseta aixecada sobre pals, a la Caseta (a l'oest del Gran Til·ler)."
              : "Per fer girar l'Home del Raïm cal una palanca. En Jordi de la Caseta, a l'oest del Gran Til·ler, en té una: parla-hi." },
        { id: 'raim', marca: ['raimDesperta', 'raimDerrotat'], fet: E => E.flag('raimDerrotat'),
          pista: E => "A la gran escalinata de la Casa Gran, l'Home del Raïm. Recorda el pergamí del monjo: gira-li el cap amb la palanca cap a on neix el sol (la rosa dels vents t'ho diu) i prem-li el raïm." },
        { id: 'cripta', marca: ['relTretes', 'clauFerro', 'obj:clau_ferro'], fet: E => E.flag('relTretes'),
          pista: E => "Vençut l'Home del Raïm, la trapa de sota l'escalinata baixa a la Cripta dels monjos: hi ha la Clau de ferro." },
        { id: 'segell', marca: ['tombaLlegida', 'tombaSegellada'], fet: E => E.flag('tombaSegellada'),
          pista: E => E.flag('tombaLlegida') || !E.flag('relTretes')
              ? "La tomba esquerdada del Cementiri (darrere el Santuari i el Monestir) encara treu boira. La llum que va tancar la porta la pot tancar: acosta-hi Runna. I guarda la Clau de ferro: obre la porta de sota la Taverna."
              : "La tomba dels monjos del Cementiri treu boira. El Pare Alcuí, a la Biblioteca, deu trobar a la Crònica què s'hi ha de fer. I guarda la Clau de ferro: obre la porta de sota la Taverna." },        // ---- Sota la Taverna ----
        { id: 'soterrani', marca: ['portaSoterraniOberta'], fet: E => E.flag('portaSoterraniOberta'),
          pista: E => "A l'est del Pati del Celler, pel camí entre els arbres, hi ha la Sala de les Gírgoles: una porta de ferro, la que el Germà Andreu tanca cada nit. La Clau de ferro l'obre." },
        { id: 'clauCiscu', marca: ['ciscuTrobat', 'clauGirgoles', 'obj:clau_girgoles'], fet: E => E.te('clau_girgoles') || E.flag('portaFerroOberta'),
          pista: E => E.flag('ciscuTrobat') ? "Torna a la cabana amagada: el Siscu té una clau rovellada per a tu."
              : "La porta de ferro del fons del soterrani té un pany petit: la Clau de ferro no hi entra. El Siscu, el fill de la Carmen, va veure el Germà Andreu entrar-hi de nit. L'Eva diu que s'escapa pel camí de la Desaparició, per un forat entre els arbres." },
        { id: 'portaFerro', marca: ['portaFerroOberta'], fet: E => E.flag('portaFerroOberta'),
          pista: E => "Al soterrani de la Taverna, la clau rovellada del Siscu obre la porta de ferro del fons, d'on surt la boira." },
        { id: 'girgoles', marca: ['girgolesEnceses'], fet: E => E.flag('girgolesEnceses'),
          pista: E => "A la Sala de les Gírgoles, sota la porta de ferro, fes que les cinc mates de gírgoles lluminoses brillin alhora: cada una que toques canvia ella i les dues del costat." },
        { id: 'rastell', marca: ['rastellObert'], fet: E => E.flag('rastellObert'),
          pista: E => "Al passadís de tortura, un rastell rovellat barra el pas. Gira el torn de la dreta amb els Guants de Poder." },
        { id: 'tortura', marca: ['torturaNet'], fet: E => E.flag('torturaNet'),
          pista: E => "Al final del passadís de tortura, talla amb Runna el mur d'esbarzers negres." },
        { id: 'pont', marca: ['pontGabia'], fet: E => E.flag('pontGabia'),
          pista: E => "A la Sala de la Gàbia, la gàbia penja sobre un avenc. Al marge, toca el Cant de les Pedres (3-1-2-1) i els blocs del fons s'aixecaran fent un pont." },
        { id: 'ocellaire', marca: ['ocellaireVencut'], fet: E => E.flag('ocellaireVencut'),
          pista: E => E.flag('ocellaireVist') ? "L'Ocellaire fa girar el bàcul per treure'n ocells de foc. Talla els ocells amb Runna, aparta't quan el bàcul gira de pressa i colpeja'l quan s'alenteix."
              : "Creua el pont fins a la gàbia. El Germà Andreu hi fa guàrdia... i no hi és sol." },
        { id: 'gabia', marca: ['gabiaOberta'], fet: E => E.flag('gabiaOberta'),
          pista: E => "L'Ocellaire ha caigut. Davant dels barrots de la gàbia, toca el Cant del Miracle (1-3-2-3-1)." },
        { id: 'nens', marca: ['rescatUri', 'rescatFlam', 'rescatSardin'], fet: E => E.flag('rescatUri') && E.flag('rescatFlam') && E.flag('rescatSardin'),
          pista: E => "La gàbia és oberta. Trenca amb Runna els capolls de boira on dormen l'Huri, el Flami i el Sardi." },
        { id: 'final', marca: ['andreuTancat', 'epilegFet'], fet: E => E.flag('epilegFet'),
          pista: E => E.flag('andreuTancat') ? "Els nens tornen a riure. Al Santuari t'esperen tots."
              : "Els tres nens són lliures. Torna a la Sala de la Gàbia: encara t'esperen allà." }
    ],

    // Missions laterals: no barren el camí. Les Tietes les recorden quan ja s'han pogut començar.
    laterals: [
        { id: 'taverna', marca: ['tavernaOberta', 'evaParlat'], obert: E => E.flag('clauerNovici'), fet: E => E.flag('evaParlat'),
          pista: E => "El Sardi berenava cada tarda a la Taverna amb l'Eva. La porta és tancada, però truca: potser l'Eva et deixa entrar." },
        { id: 'rellotge', marca: ['rellotgeReparat'], obert: E => E.te('clau_campanar') || E.flag('portaCampanarOberta'), fet: E => E.flag('rellotgeReparat'),
          pista: E => "El rellotge del campanar s'ha aturat a les tres i quart. Amb la clau del campanar que et van donar les Venerables Sàvies, obre la porta de la dreta del retaule del Santuari, puja per la torre fins a la Sala del Rellotge i posa els engranatges en ordre." },
        { id: 'tresor', marca: ['tresorObert'], obert: E => E.flag('cantPedres'), fet: E => E.flag('tresorObert'),
          pista: E => "Diuen que a la façana del Santuari hi ha una pedra que escolta el Cant de les Pedres." },
        { id: 'nena', marca: ['nenaVista', 'llac1', 'llac2', 'nenaAlliberada'], obert: E => E.flag('nenaVista'), fet: E => E.flag('nenaAlliberada'),
          pista: E => "La Nena de les Trenes, al camí de la Rovellonera, encara espera els seus dos llaços: tots dos colgats sota pedres: una roca del camí i una pedra de la primera clariana de la Rovellonera. Posa't darrere la pedra i camina contra ella per empènyer-la." },
        { id: 'monges', marca: ['isidreSansa', 'llavorSansa', 'llosaOberta', 'mongesTrobades'], obert: E => E.flag('isidreSansa'), fet: E => E.flag('mongesTrobades'),
          pista: E => !E.flag('llavorSansa') && !E.flag('llosaOberta') ? "La Sansa, la de les verdures, passa per les Cel·les: l'Isidre diu que té una Llavor de Lluna."
              : !E.flag('llosaOberta') ? "Porta la Llavor de Lluna a l'Isidre, al jardí de l'Hostatgeria."
              : "Sota la llosa del jardí de l'Hostatgeria hi ha un soterrani que puja a les cambres de les sacerdotesses. Per alliberar-les et caldran el Cant de l'Aurora, els Guants de Poder i Runna." }
    ],

    // El primer pas de la història que encara no és fet
    seguent(E) { return this.passos.find(p => !p.fet(E)) || null; },

    // Pista del pas següent; si la història principal està aturada en una part encara per fer, recorda una lateral
    pista(E) {
        const p = this.seguent(E);
        if (p && !p.pendent) return p.pista(E);
        const l = this.laterals.find(m => m.obert(E) && !m.fet(E));
        if (p && l) return p.pista(E) + " Mentrestant: " + l.pista(E);
        if (p) return p.pista(E);
        if (l) return "Els nens tornen a riure i l'orgue sona (gairebé bé). Si encara vols feina: " + l.pista(E);
        return "Els nens tornen a riure i l'orgue sona (gairebé bé). Ho has fet tot, fill.";
    },

    // Pista només fins a Runna (null quan ja la tens): la fan servir el Pare Jordi, el Pare Alcuí i el Til·ler
    pistaRunna(E) {
        if (E.flag('runna')) return null;
        const p = this.seguent(E);
        return p ? p.pista(E) : null;
    }
};

if (typeof module !== 'undefined') module.exports = PROGRES;
