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
          pista: E => "El Pare Jordà t'ha fet cridar. Deu ser a la Plaça." },
        { id: 'basto', marca: ['bastoObtingut', 'obj:basto'], fet: E => E.flag('bastoObtingut'),
          pista: E => "El Germà Andreu, vora els xiprers de la Plaça, té un bastó per a tu: hi ha bestioles pels camins." },
        { id: 'cantAurora', marca: ['cantAurora', 'obj:flauta'], fet: E => E.flag('cantAurora'),
          pista: E => "Al Santuari, la Pianista guarda un cant que la boira no ha sabut prendre-li." },
        { id: 'bassadoria', marca: ['bassadoriaNeta'], fet: E => E.flag('bassadoriaNeta'),
          pista: E => "La Bassadòria, al sud de la Plaça, raja tèrbola. Potser el Cant de l'Aurora la deixaria neta." },
        // ---- ACTE 2: el camí del Til·ler ----
        { id: 'font', marca: ['fontNeta', 'cristallGel', 'obj:cristall_gel', 'obj:aigua_sj'], fet: E => E.flag('fontNeta'),
          pista: E => "La Font del Bisbe, al bosc de l'oest, dorm. La despertarien les herbes que espurnegen i una pruna de la Prunera de l'Hostatgeria." },
        { id: 'jaumeta', marca: ['jaumetaVista', 'obj:beuratge'], fet: E => E.flag('jaumetaVista') || E.flag('parlatTiler'),
          pista: E => "Amb l'aigua de la font, l'Alzina Buida s'obre com un portal. A dins, la Jacmeta té un regal per al camí del Til·ler." },
        { id: 'boiraTiller', marca: ['boiraTillerNeta'], fet: E => E.flag('boiraTillerNeta') || E.flag('parlatTiler'),
          pista: E => "Una boira espessa tapa el camí al nord de les Cel·les. El beuratge de la vident la desfaria." },
        { id: 'tiller', marca: ['parlatTiler', 'tillerBranca'], fet: E => E.flag('parlatTiler'),
          pista: E => "El camí al nord de les Cel·les ja és clar. Al capdamunt hi ha un arbre que sap què fer amb les bestioles que desperten." },
        { id: 'branca', marca: ['obj:basto_tiller'], fet: E => E.te('basto_tiller'),
          pista: E => "Al peu del Til·ler ha caigut alguna cosa que et serviria més que el bastó de pelegrí." },
        { id: 'bardissa', marca: ['camiCirosaObert'], fet: E => E.flag('camiCirosaObert'),
          pista: E => "Al nord-est del Til·ler, unes arrels tanquen el pas. Són de fusta: potser cedirien als cops d'una branca amiga." },
        { id: 'pastor', marca: ['pastorVencut'], fet: E => E.flag('pastorVencut'),
          pista: E => "A la pastura de la Cirosa, la boira s'ha endut el Germà Andreu: ara és el Pastor de Boira." },
        { id: 'esquelles', marca: ['esquelles', 'obj:esquelles'], fet: E => E.flag('esquelles'),
          pista: E => "El pastor vell, vora el foc de la Cirosa, guarda les esquelles dels seus avis." },
        { id: 'soparObert', marca: ['soparObert'], fet: E => E.flag('soparObert'),
          pista: E => "Amb les esquelles al sarró, el Til·ler tindrà ganes de parlar-te d'un sopar." },
        { id: 'sopar', marca: ['escudella', 'floresIsidre', 'pastorsConvencuts', 'soparFet', 'fullaTiler', 'obj:fulla_tiler'], fet: E => E.flag('soparFet'),
          pista: E => {
              const f = [];
              if (!E.flag('escudella')) f.push("l'escudella de la Meus (a les cel·les)");
              if (!E.flag('floresIsidre')) f.push("les flors d'Isildren (al jardí de l'Hostatgeria)");
              if (!E.flag('pastorsConvencuts')) f.push("el pa que pasten els pastors de la Cirosa");
              return f.length ? "Al sopar del Til·ler encara hi falta: " + f.join(', ') + "." : "Ja ho tens tot: el Gran Til·ler espera la taula parada.";
          } },
        // ---- ACTE 2: el Saber i les benediccions ----
        { id: 'fragment1', marca: ['fragment1'], fet: E => E.flag('fragment1'),
          pista: E => "A les Runes, entre dues pedres, algú va deixar un pergamí esquinçat. Val la pena mirar-hi bé." },
        { id: 'clauSagrari', marca: ['missatgeDesxifrat', 'obj:clau_sagrari'], fet: E => E.flag('missatgeDesxifrat') || E.te('clau_sagrari') || E.flag('fragment2'),
          pista: E => {
              const cols = Array.from({ length: 12 }, (_, i) => E.flag('col' + (i + 1))).filter(Boolean).length;
              return cols < 12 ? "La clau del sagrari és a l'ermita de la Desaparició. Pel camí, dotze columnes parlen (" + cols + "/12): recorda què diuen."
                  : "Les dotze paraules formen una frase. Les taules de pedra de l'ermita de la Desaparició esperen que algú la digui davant l'altar.";
          } },
        { id: 'fragment2', marca: ['fragment2'], fet: E => E.flag('fragment2'),
          pista: E => "La clau petita encaixa al sagrari, al mig del retaule del Santuari." },
        { id: 'alcuiLlegit', marca: ['alcuiLlegit'], fet: E => E.flag('alcuiLlegit'),
          pista: E => "Els dos pergamins són en un llatí molt vell. El Pare Alcoví, entre els llibres del Monestir, el sap llegir." },
        { id: 'ombra', marca: ['ombraDemanaCant', 'cantPedres', 'benedicioMonjo'], fet: E => E.flag('benedicioMonjo'),
          pista: E => !E.flag('ombraDemanaCant') ? "A les Runes, passat el Pati del Celler, l'ombra del monjo és sobre el mur de l'església inacabada. Parla-hi."
              : !E.flag('cantPedres') ? "L'ombra del monjo demana un cant que les pedres entenen. La Pianista, al Santuari, el coneix."
              : "L'ombra del monjo, a les Runes, només escoltarà el Cant de les Pedres." },
        { id: 'saber', marca: ['saber'], fet: E => E.flag('saber'),
          pista: E => "Ara que l'ombra t'ha parlat, el Pare Alcoví tindrà paraules per a tu, a la biblioteca." },
        { id: 'benediccio', marca: ['benediccio'], fet: E => E.flag('benediccio'),
          pista: E => "El Pare Jordà, a la Plaça, voldria posar-te la mà al cap ara que el Til·ler t'ha donat permís." },
        // ---- ACTE 2: el camí del Dolmen ----
        { id: 'telescopi', marca: ['garfBancSegut', 'telescopi', 'obj:telescopi'], fet: E => E.flag('telescopi') || E.flag('estelLlorenc'),
          pista: E => !E.flag('garfBancSegut')
              ? "A l'Era, passada l'Ermita, un inventor anomenat Garf mira el cel. Potser et deixa seure al seu banc."
              : "El Garf, a l'Era, sabria fer un tub per mirar els estels si li portessis un cristall de gel de la Font del Bisbe." },
        { id: 'estels', marca: ['telescopiMuntat', 'estelsFets'], fet: E => E.flag('estelsFets') || E.flag('estelLlorenc'),
          pista: E => "El telescopi vol un lloc alt i fosc: els Dipòsits, a ponent, passada la Rovellonera i Sant Gabriel." },
        { id: 'estelLlorenc', marca: ['estelLlorenc', 'obj:estel_llorenc'], fet: E => E.flag('estelLlorenc'),
          pista: E => "L'últim estel ha caigut a l'aigua del dipòsit de llevant. Algú n'hauria de pujar a collir la llum." },
        { id: 'runna', marca: ['runna', 'obj:runna'], fet: E => E.flag('runna'),
          pista: E => "L'estel aparta la boira a llevant dels Dipòsits. Al final, el Dolmen espera la Fulla, el Saber i la Benedicció." },
        // ---- ACTE 3 ----
        { id: 'cantMiracle', marca: ['cantMiracle'], fet: E => E.flag('cantMiracle'),
          pista: E => "Runna ja és amb tu. Els barrots de la gàbia només escolten un cant que la Pianista encara no t'ha ensenyat." },
        { id: 'josep', marca: ['josepVencut', 'obj:llanterna'], fet: E => E.flag('josepVencut'),
          pista: E => "Al Celler, entre la Plaça i les Runes, en Jusef guarda secrets. Es guanyen a la taula de ping-pong." },
        { id: 'guants', marca: ['obj:ram', 'florsCreu', 'obj:guants'], fet: E => E.te('guants') || E.flag('rodaMoguda'),
          pista: E => E.flag('florsCreu') ? "El Germà Francí t'espera a Sant Antoni, content."
              : E.te('ram') ? "El ram del Germà Francí és per a algú que ja no el pot rebre: la tomba de l'àngel, al Cementiri."
              : "El Germà Francí, a Sant Antoni (a llevant del Monestir), té uns guants que mouen el que pesa. Fes-li un favor." },
        { id: 'roda', marca: ['rodaMoguda'], fet: E => E.flag('rodaMoguda'),
          pista: E => "La roda de carruatge del Celler tapa el túnel dels monjos. Amb uns guants, es deixaria empènyer." },
        { id: 'cambra', marca: ['cofreCambra', 'obj:pergami_monjo'], fet: E => E.flag('cofreCambra'),
          pista: E => "Rere la roda, un passadís baixa a una cambra secreta. Els esbarzers negres del camí només cedeixen a Runna." },
        { id: 'maneta', marca: ['jordiManeta', 'maneta', 'obj:maneta'], fet: E => E.flag('maneta') || E.te('maneta'),
          pista: E => E.flag('jordiManeta')
              ? "La maneta d\'en Georgi és al cofre de les joguines, dalt de la caseta de pals, a la Caseta."
              : "El volant de ferro de l'Home del Raïm no té maneta. En Georgi de la Caseta, a l'oest del Gran Til·ler, en deu saber alguna cosa." },
        { id: 'raim', marca: ['raimDesperta', 'raimDerrotat'], fet: E => E.flag('raimDerrotat'),
          pista: E => "A l'escalinata de la Casa Gran, l'Home del Raïm té el cap girat. La maneta, al volant de la base, el faria mirar-te." },
        { id: 'cripta', marca: ['relTretes', 'clauFerro', 'obj:clau_ferro'], fet: E => E.flag('relTretes'),
          pista: E => "Vençut l'Home del Raïm, la trapa de sota l'escalinata baixa a la Cripta dels monjos. Allà hi ha una clau de ferro." },
        { id: 'segell', marca: ['tombaLlegida', 'tombaSegellada'], fet: E => E.flag('tombaSegellada'),
          pista: E => E.flag('tombaLlegida') || !E.flag('relTretes')
              ? "La tomba esquerdada del Cementiri treu boira: la llum de Runna la tancaria. La porta de ferro a l'est del Pati del Celler vol la clau i el campanar."
              : "La tomba del Cementiri treu boira: el Pare Alcoví, a la Biblioteca, sabrà què fer-hi. La porta de ferro a l'est del Pati del Celler vol la clau i el campanar." },        // ---- Les Gírgoles ----
        // El pany de la porta de ferro dels monjos només gira quan el campanar toca les hores: cal fer caminar el rellotge
        { id: 'carry', marca: ['carryParlat', 'pallofaTornat', 'obj:pallofa', 'obj:clau_campanar'], fet: E => E.flag('pallofaTornat') || E.te('clau_campanar') || E.flag('rellotgeReparat'),
          pista: E => !E.flag('carryParlat') ? "El pany de la porta de ferro només gira si el campanar toca. La Carry, a Nostra Senyora (a l'oest de les Cel·les), guarda la clau del campanar."
              : E.te('pallofa') ? "El Pallofa ja és amb tu: la Carry el deu trobar a faltar a Nostra Senyora."
              : "La Carry vol el Pallofa, el seu gos, que passeja per Sant Antoni. A canvi, et donarà la clau del campanar." },
        { id: 'rellotge', marca: ['rellotgeReparat'], fet: E => E.flag('rellotgeReparat'),
          pista: E => "La clau de la Carry obre una porta del retaule; dalt la torre, uns engranatges esperen. Sense el campanar, el pany de la porta de ferro no gira." },
        { id: 'soterrani', marca: ['portaSoterraniOberta'], fet: E => E.flag('portaSoterraniOberta'),
          pista: E => "A l'est del Pati del Celler, pel camí entre els arbres, hi ha una porta de ferro. Cal la clau de ferro i que el campanar toqui." },
        { id: 'clauCiscu', marca: ['ciscuTrobat', 'clauGirgoles', 'obj:clau_girgoles'], fet: E => E.te('clau_girgoles') || E.flag('portaFerroOberta'),
          pista: E => E.flag('ciscuTrobat') ? "L\'Iscu t'espera a la cabana amagada: té una clau rovellada per a tu."
              : "La porta del fons té un pany petit. L\'Iscu, el noi de la Taverna, ho ha vist tot: s'amaga pel camí de la Desaparició." },
        { id: 'portaFerro', marca: ['portaFerroOberta'], fet: E => E.flag('portaFerroOberta'),
          pista: E => "Al fons de la galeria de la Porta de Ferro, la clau rovellada de l\'Iscu té una porta de ferro que treu boira." },
        { id: 'girgoles', marca: ['girgolesEnceses'], fet: E => E.flag('girgolesEnceses'),
          pista: E => "Darrere la porta de ferro, cinc mates de gírgoles lluminoses voldrien brillar alhora, però cada una desperta les veïnes." },
        { id: 'rastell', marca: ['rastellObert'], fet: E => E.flag('rastellObert'),
          pista: E => "Al passadís de tortura, un rastell rovellat barra el pas. Els Guants de Poder saben de torns." },
        { id: 'tortura', marca: ['torturaNet'], fet: E => E.flag('torturaNet'),
          pista: E => "Al final del passadís de tortura, un mur d'esbarzers negres es deixa tallar per Runna." },
        { id: 'benediccioFraterna', marca: ['isidreSansa', 'llavorSansa', 'llosaOberta', 'lliurePains', 'refetorObert', 'esb_host_cap1', 'esb_host_cap2', 'mongesTrobades', 'premiPains', 'premiPhili', 'premiCharm', 'cofreMonges', 'obj:benedicio_fraterna'], fet: E => E.te('benedicio_fraterna'),
          pista: E => !E.flag('llosaOberta')
              ? "Per passar la boira verinosa cal l'Empara Fraternal de les sacerdotesses. La gent de les Cel·les sap el secret de la llosa del jardí."
              : !E.flag('mongesTrobades')
                  ? "Sota la llosa, les sacerdotesses: desperta la Dolora, empeny la taula de la Pilària i talla els esbarzers de la Carmèlia."
                  : "Les sacerdotesses són lliures: la seva Empara Fraternal t'espera al cofre del vestíbul de l'Hostatgeria." },
        { id: 'pont', marca: ['pontGabia'], fet: E => E.flag('pontGabia'),
          pista: E => "Davant l'avenc de la Sala de la Gàbia, els blocs del fons dormen. Un cant de pedres els faria aixecar." },
        { id: 'ocellaire', marca: ['ocellaireVencut'], fet: E => E.flag('ocellaireVencut'),
          pista: E => E.flag('ocellaireVist') ? "Talla els ocells de foc i aparta't del bàcul. Quan l'Ocellaire cau de genolls, colpeja-li el cap."
              : "Més enllà del pont, a la gàbia, el Germà Andreu fa guàrdia... i no hi és sol." },
        { id: 'gabia', marca: ['gabiaOberta'], fet: E => E.flag('gabiaOberta'),
          pista: E => "L'Home de la Gàbia ha caigut. Els barrots de la gàbia només escolten el Cant del Miracle." },
        { id: 'nens', marca: ['rescatUri', 'rescatFlam', 'rescatSardin'], fet: E => E.flag('rescatUri') && E.flag('rescatFlam') && E.flag('rescatSardin'),
          pista: E => "La gàbia és oberta. Als capolls de boira hi dormen l'Huri, el Fram i el Sardi; Runna els sap trencar." },
        { id: 'final', marca: ['andreuTancat', 'epilegFet'], fet: E => E.flag('epilegFet'),
          pista: E => E.flag('andreuTancat') ? "Els nens tornen a riure. Al Santuari t'esperen tots."
              : "Els tres nens són lliures, però a la Sala de la Gàbia encara hi ha algú que t'espera." },
    ],

    // Missions laterals: no barren el camí. Les Venerables Sàvies les recorden quan ja s'han pogut començar.
    laterals: [
        { id: 'taverna', marca: ['tavernaOberta', 'evaParlat'], obert: E => E.flag('clauerNovici'), fet: E => E.flag('evaParlat'),
          pista: E => "El Sardi berenava cada tarda a la Taverna amb l\'Eve. La porta és tancada, però una trucada potser l'obriria." },
        { id: 'tresor', marca: ['tresorObert'], obert: E => E.flag('cantPedres'), fet: E => E.flag('tresorObert'),
          pista: E => "Diuen que a la façana del Santuari hi ha una pedra que escolta cants antics." },
        { id: 'nena', marca: ['nenaVista', 'llac1', 'llac2', 'nenaAlliberada'], obert: E => E.flag('nenaVista'), fet: E => E.flag('nenaAlliberada'),
          pista: E => "La Nena de les Trenes espera dos llaços colgats sota pedres: un a la roca del camí i l'altre a la primera clariana." },
        { id: 'pi', marca: ['piObert', 'piAurora', 'piPedres', 'piMiracle', 'piVist'], obert: E => E.flag('cantMiracle'), fet: E => E.flag('piObert'),
          pista: E => "Al sud de Sant Antoni, un bosc molt llarg amaga un pi vell que sembla escoltar els tres cants. Només s'hi pot arribar des de llevant." },
        { id: 'carruatge', marca: ['carruatgeObert'], obert: E => E.flag('epilegFet'), fet: E => E.flag('carruatgeObert'),
          pista: E => "El Follet del Carro Verd, a l'Era, deia que obriria el carro quan la boira marxés del tot." }
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

    // Pista només fins a Runna (null quan ja la tens): la fan servir el Pare Jordà, el Pare Alcoví i el Til·ler
    pistaRunna(E) {
        if (E.flag('runna')) return null;
        const p = this.seguent(E);
        return p ? p.pista(E) : null;
    }
};

if (typeof module !== 'undefined') module.exports = PROGRES;
