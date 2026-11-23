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
          pista: E => "El Pare Jòrdius t'ha fet cridar. Deu ser a la Plaça." },
        { id: 'basto', marca: ['bastoObtingut', 'obj:basto'], fet: E => E.flag('bastoObtingut'),
          pista: E => "El Germà Aleu, vora els xiprers de la Plaça, té un bastó per a tu: hi ha bestioles pels camins." },
        { id: 'cantAurora', marca: ['cantAurora', 'obj:flauta'], fet: E => E.flag('cantAurora'),
          pista: E => "Al Santuari, la Pianista guarda un cant que la boira no ha sabut prendre-li." },
        { id: 'bassadoria', marca: ['bassadoriaNeta'], fet: E => E.flag('bassadoriaNeta'),
          pista: E => "La Bassadòria raja tèrbola. Potser el Cant de l'Aurora la deixaria neta." },
        // ---- ACTE 2: el camí del Til·ler ----
        { id: 'font', marca: ['fontNeta', 'obj:aigua_sj', 'obj:pruna'], fet: E => E.flag('fontNeta'),
          pista: E => {
              // Fins que no s'ha anat a la font (fontVista) no se sap què cal portar-hi: la pista només dona el lloc
              // (encara no s'hi ha estat: el lloc, perquè és lluny, i el camí des de la Plaça; el mapa del Diari també el mostra)
              if (!E.flag('fontVista')) return "La Font del Bisbe, que diuen que guaria tothom, s'ha quedat adormida. És al Bosc de Sant Joan" + (E.flag('visitada_ZonaBosc') ? "." : ", al nord-oest del mapa.") + " Val la pena anar-hi a mirar.";
              const n = ['herba1', 'herba2'].filter(h => E.flag(h)).length + (E.te('pruna') || E.flag('herba3') ? 1 : 0);
              return n === 3 ? "Ja tens totes les ofrenes: torna a la Font del Bisbe."
                  : "A la Font del Bisbe, les ofrenes que falten (" + n + "/3): l'herba de Sant Joan (en aquest mateix bosc), la rialla (una planta: al Bosc del Pi dels Tres Cants, al sud de Sant Antoni, guardada per bolets verinosos) i una pruna de la Prunera de l'Hostatgeria.";
          } },
        { id: 'joaneta', marca: ['joanetaVista', 'obj:beuratge'], fet: E => E.flag('joanetaVista') || E.flag('parlatTiler'),
          pista: E => !E.flag('portalJoaneta')
              ? "Ja tens l'aigua de la Font del Bisbe. L'Alzina Buida del bosc potser en sabria què fer-ne."
              : "A l'altra banda de l'Alzina Buida hi ha un regal per al camí del Til·ler." },
        { id: 'boiraTiller', marca: ['boiraTillerNeta'], fet: E => E.flag('boiraTillerNeta') || E.flag('parlatTiler'),
          pista: E => "Una boira espessa tapa un camí de les Cel·les. Un beuratge la desfaria." },
        { id: 'tiller', marca: ['parlatTiler', 'tillerBranca'], fet: E => E.flag('parlatTiler'),
          pista: E => "El camí de la boira ja és clar. Al capdamunt hi ha un arbre que sap què fer amb les bestioles que desperten." },
        { id: 'branca', marca: ['obj:basto_tiller'], fet: E => E.te('basto_tiller'),
          pista: E => "Al peu del Til·ler ha caigut alguna cosa que et serviria més que el bastó de pelegrí." },
        { id: 'bardissa', marca: ['camiCirosaObert'], fet: E => E.flag('camiCirosaObert'),
          pista: E => "Al Til·ler, unes arrels tanquen el pas. Són de fusta: potser cedirien als cops d'una branca amiga." },
        { id: 'pastor', marca: ['pastorVencut'], fet: E => E.flag('pastorVencut'),
          pista: E => "A la pastura de la Cirosa, el Germà Aleu s'ha deixat dur per la boira: ara és el Pastor de la Boira." },
        { id: 'esquelles', marca: ['esquelles', 'obj:esquelles'], fet: E => E.flag('esquelles'),
          pista: E => "El pastor vell, vora el foc de la Cirosa, guarda les esquelles dels seus avis." },
        { id: 'soparObert', marca: ['soparObert'], fet: E => E.flag('soparObert'),
          pista: E => "Amb les esquelles al sarró, el Til·ler tindrà ganes de parlar-te d'un sopar." },
        { id: 'sopar', marca: ['escudella', 'floresIsilder', 'pastorsConvencuts', 'soparFet', 'fullaTiler', 'obj:medallo_arbre'], fet: E => E.flag('soparFet'),
          pista: E => {
              const f = [];
              if (!E.flag('escudella')) f.push("l'escudella de la Nelis (a les cel·les)");
              if (!E.flag('floresIsilder')) f.push("les flors d'Isílder (a l'Hostatgeria)");
              if (!E.flag('pastorsConvencuts')) f.push(E.flag('cantPedres') ? "el pa que pasten els pastors de la Cirosa (toca'ls el cant vora el foc)" : "el pa dels pastors de la Cirosa: primer cal una música antiga per a ells, i la Pianista, al Santuari, en coneix una");
              return f.length ? "Al sopar del Til·ler encara hi falta: " + f.join(', ') + "." : "Ja ho tens tot: el Gran Til·ler espera la taula parada.";
          } },
        // ---- ACTE 2: el Saber i les benediccions ----
        { id: 'jusef', marca: ['jusefVencut', 'obj:llanterna'], fet: E => E.flag('jusefVencut') || E.flag('fragment1'),
          pista: E => "A les Runes hi ha un forat fosc al peu del mur, però sense llum no s'hi veu res. Al Celler, en Jusef guarda el Llum d'en Mamet: es guanya a la taula de ping-pong." },
        { id: 'fragment1', marca: ['fragment1'], fet: E => E.flag('fragment1'),
          pista: E => "Amb el Llum d'en Mamet, a les Runes hi ha un forat fosc al peu del mur: al fons hi ha un pergamí." },
        { id: 'clauSagrari', marca: ['missatgeDesxifrat', 'obj:clau_sagrari'], fet: E => E.flag('missatgeDesxifrat') || E.te('clau_sagrari') || E.flag('fragment2'),
          pista: E => {
              const cols = Array.from({ length: 12 }, (_, i) => E.flag('col' + (i + 1))).filter(Boolean).length;
              return cols < 12 ? "La clau del sagrari és a l'ermita de la Desaparició. Pel camí, dotze columnes parlen (" + cols + "/12): recorda què diuen."
                  : "Les dotze paraules formen una frase. Les taules de pedra de l'ermita de la Desaparició esperen que algú la digui davant l'altar.";
          } },
        { id: 'fragment2', marca: ['fragment2'], fet: E => E.flag('fragment2'),
          pista: E => "La clau petita encaixa al sagrari, al mig del retaule del Santuari." },
        { id: 'alcoviLlegit', marca: ['alcoviLlegit'], fet: E => E.flag('alcoviLlegit'),
          pista: E => "Ja tens els dos fragments de la crònica. Porta'ls al Pare Alberic, a la biblioteca del Monestir, perquè els compari amb la Crònica." },
        { id: 'ombra', marca: ['ombraDemanaCant', 'cantPedres', 'benedicioMonjo'], fet: E => E.flag('benedicioMonjo'),
          pista: E => !E.flag('ombraDemanaCant') ? "A les Runes, l'ombra del monjo és sobre el mur de l'església inacabada. Parla-hi."
              : !E.flag('cantPedres') ? "L'ombra del monjo demana un cant que les pedres entenen. La Pianista, al Santuari, el coneix."
              : "L'ombra del monjo, a les Runes, només escoltarà el Cant de Vespres." },
        { id: 'saber', marca: ['saber', 'obj:medallo_saber'], fet: E => E.flag('saber'),
          pista: E => "Ara que l'ombra t'ha parlat, a la biblioteca del Monestir hi ha paraules per a tu." },
        { id: 'benediccio', marca: ['benediccio', 'obj:medallo_benedicio'], fet: E => E.flag('benediccio'),
          pista: E => "Ara que el Til·ler t'ha donat permís, a la Plaça et poden posar la mà al cap: la benedicció del prior." },
        // ---- ACTE 2: el camí del Dolmen ----
        { id: 'telescopi', marca: ['garfBancSegut', 'telescopi', 'obj:telescopi'], fet: E => E.flag('telescopi') || E.flag('estelLlorenc'),
          pista: E => !E.flag('garfBancSegut')
              ? "A l'Era, un inventor anomenat Galf mira el cel. Potser et deixa seure al seu banc."
              : E.te('cristall_gel') ? "Ja tens el cristall de gel: el Galf, a l'Era, en farà un tub per mirar els estels."
              : !E.flag('galfCristallDit') && !E.te('clau_gabriel') && !E.flag('portaGabrielOberta') ? "El Galf, a l'Era, farà un tub per mirar els estels si li portes un cristall de gel. Parla-hi, assegut al seu banc: et dirà com entrar a l'ermita de Sant Gabriel."
              : !E.te('clau_gabriel') && !E.flag('portaGabrielOberta') ? "La clau de l'ermita de Sant Gabriel la té el senyor Buidor, a la Taverna: el Galf t'hi envia."
              : "El Galf, a l'Era, farà un tub per mirar els estels si li portes un cristall de gel. L'ermita de Sant Gabriel s'obre amb la clau del senyor Buidor." },
        { id: 'estels', marca: ['telescopiMuntat', 'estelsFets'], fet: E => E.flag('estelsFets') || E.flag('estelLlorenc'),
          pista: E => "El telescopi vol un lloc alt i fosc: els Dipòsits." },
        { id: 'estelLlorenc', marca: ['estelLlorenc', 'obj:estel_llorenc'], fet: E => E.flag('estelLlorenc'),
          pista: E => "L'últim estel ha caigut a l'aigua del dipòsit. Algú n'hauria de pujar a collir la llum." },
        { id: 'runna', marca: ['runna', 'obj:runna', 'placaArbre', 'placaSaber', 'placaBenedicio', 'placaCompleta'], fet: E => E.flag('runna'),
          pista: E => E.flag('placaCompleta')
              ? "Els tres medallons són a la placa: l'espasa del Dolmen espera, dalt de la llosa."
              : "La llàgrima aparta la boira. Al final, la placa del Dolmen espera els medallons de l'Arbre, del Saber i de la Benedicció." },
        // ---- ACTE 3 ----
        // Amb Runna, el Pare Alberic demana segellar la tomba del Cementiri per poder llegir-li la resta de la Crònica (el Pare Xèvius, el Pi, les proves de dins): és obligatori
        { id: 'segellDemana', marca: ['tombaDemanada'], fet: E => E.flag('tombaDemanada') || E.flag('tombaSegellada') || E.flag('tombaLlegida') || E.flag('portaSoterraniOberta'),
          pista: E => "Ja tens Runna: el Pare Alberic, a la Biblioteca, té més a dir-te de la Crònica." },
        // El rellotge de la torre (la Carry, el Pallofa i la clau) és obligatori: la tomba es va esquerdar a la mateixa hora a què es va aturar el rellotge, i el segell no aguanta si el temps no el sosté
        { id: 'rellotge', marca: ['carryParlat', 'pallofaTornat', 'obj:pallofa', 'obj:clau_campanar', 'portaCampanarOberta', 'rellotgeReparat'],
          fet: E => E.flag('rellotgeReparat') || E.flag('tombaSegellada') || E.flag('tombaLlegida') || E.flag('portaSoterraniOberta'),
          pista: E => (E.te('clau_campanar') || E.flag('portaCampanarOberta') || E.flag('clauCampanar') || E.flag('pallofaTornat'))
              ? "El rellotge de la torre s'ha aturat. La clau de la Carry obre una porta del retaule; dalt la torre, uns engranatges esperen."
              : !E.flag('carryParlat') ? "El Pare Alberic vol que el rellotge de la torre torni a caminar. La clau de la porta del retaule la té la Carry, a Nostra Senyora."
              : E.te('pallofa') ? "El Pallofa ja és amb tu: porta'l a la Carry, a Nostra Senyora, i et donarà la clau de la torre."
              : "El Pallofa, el gos de la Carry, passeja per Sant Antoni. La Carry, que guarda la clau de la torre del rellotge, t'ho agrairia." },
        { id: 'segell', marca: ['tombaSegellada', 'tombaLlegida'], fet: E => E.flag('tombaLlegida') || E.flag('portaSoterraniOberta'),
          pista: E => !E.flag('tombaSegellada') ? "El rellotge ja camina: la llum de Runna pot tancar l'esquerda de la tomba del Cementiri. El Pare Alberic no et llegirà la resta de la Crònica fins que no ho facis."
              : "Has segellat la tomba. Torna al Pare Alberic: et vol llegir la resta de la Crònica." },
        { id: 'cantMiracle', marca: ['cantMiracle'], fet: E => E.flag('cantMiracle'),
          pista: E => "Runna ja és amb tu. Els barrots de la gàbia només escolten un cant que la Pianista encara no t'ha ensenyat." },
        { id: 'guants', marca: ['obj:ram', 'florsCreu', 'obj:guants'], fet: E => E.te('guants') || E.flag('rodaMoguda'),
          pista: E => E.flag('florsCreu') ? "El Germà Francí t'espera a Sant Antoni, content."
              : E.te('ram') ? "El ram del Germà Francí és per a algú que ja no el pot rebre: la tomba de l'àngel, al Cementiri."
              : "El Germà Francí, a Sant Antoni, té uns guants que mouen el que pesa. Fes-li un favor." },
        // El Pi dels Tres Cants és obligatori: el Pare Xèvius, vigilant de la Porta de les Gírgoles, només deixa passar qui li ensenya la Carta del Cortiner.
        { id: 'pi', marca: ['piObert', 'piAurora', 'piPedres', 'piMiracle', 'piVist', 'obj:carta_cortiner'], fet: E => E.flag('piObert') || E.flag('portaSoterraniOberta'),
          pista: E => E.flag('cantMiracle')
              ? "El Pare Xèvius, a l'entrada de les Gírgoles, no deixa passar sense una prova de bona voluntat. Al sud de Sant Antoni, un bosc molt llarg amaga un pi vell que sembla escoltar els tres cants. Només s'hi pot arribar des de llevant."
              : "Un pi vell, al sud de Sant Antoni, escolta els tres cants. Caldrà saber-los tots tres." },
        // L'Empara Fraternal es guanya just després dels Guants (l'àngel de la Pilària els demana) i ABANS de baixar a les Gírgoles: la Porta de Ferro no s'obre sense ella (boira verinosa del fons)
        { id: 'benediccioFraterna', marca: ['isilderRosansa', 'llavorRosansa', 'llosaOberta', 'lliureDolora', 'refetorObert', 'esb_host_cap1', 'esb_host_cap2', 'mongesTrobades', 'premiDolora', 'premiPilaria', 'premiCarmelia', 'cofreMonges', 'obj:benedicio_fraterna'], fet: E => E.te('benedicio_fraterna'),
          pista: E => !E.flag('llosaOberta')
              ? (E.te('llavorLluna')
                  ? "Ja tens la Llavor de Lluna. Porta-la a l'Isílder, al jardí de l'Hostatgeria, perquè l'ajudi a florir damunt la llosa."
                  : !E.flag('isilderRosansa')
                      ? "Per passar la boira verinosa cal l'Empara Fraternal de les sacerdotesses. Al jardí de l'Hostatgeria, la llosa dels monjos s'encén amb la llum de Runna: parla-ho amb l'Isílder."
                      : "Per passar la boira verinosa cal l'Empara Fraternal de les sacerdotesses. La Rosansa, la venedora de verdures, ha tornat a passar per les cel·les: potser té la llavor d'una flor de lluna.")
              : !E.flag('mongesTrobades')
                  ? "Sota la llosa, les sacerdotesses: desperta la Dolora, empeny el mussol de pedra que barra la porta de la Pilària i talla els esbarzers de la Carmèlia."
                  : "Les sacerdotesses són lliures: la seva Empara Fraternal t'espera al cofre del vestíbul de l'Hostatgeria." },
        { id: 'roda', marca: ['rodaMoguda'], fet: E => E.flag('rodaMoguda'),
          pista: E => "La roda de carruatge de la qual et va parlar en Jusef tapa el túnel dels monjos. Amb els guants, es deixarà empènyer." },
        { id: 'cambra', marca: ['portaTresorOberta'], fet: E => E.flag('portaTresorOberta'),
          pista: E => "Rere la roda, un passadís baixa a una cambra secreta. Els esbarzers negres del camí només cedeixen a Runna." },
        { id: 'maneta', marca: ['georgiManeta', 'maneta', 'obj:maneta'], fet: E => E.flag('maneta') || E.te('maneta'),
          pista: E => E.flag('georgiManeta')
              ? "La maneta d\'en Gori és al cofre de les joguines, dalt de la caseta de pals, a la Caseta."
              : "El volant de ferro de l'Home del Raïm no té maneta. En Gori de la Caseta en deu saber alguna cosa." },
        { id: 'raim', marca: ['raimDesperta', 'raimDerrotat'], fet: E => E.flag('raimDerrotat'),
          pista: E => "A l'escalinata de la Casa Gran, l'Home del Raïm té el cap girat d'esquena. Amb la maneta al volant de la base, gira'l tres voltes fins que et miri de cara: es desperta. Només Runna li fa mal, i només al cap, quan ensopega de morros després d'una envestida." },
        { id: 'cripta', marca: ['relTretes', 'clauFerro', 'obj:clau_ferro'], fet: E => E.flag('relTretes'),
          pista: E => "Vençut l'Home del Raïm, la trapa de sota l'escalinata baixa a la Cripta dels monjos. Allà hi ha una clau de ferro." },
        // ---- Les Gírgoles ----
        { id: 'vigilant', marca: ['vigilantObert'], fet: E => E.flag('vigilantObert') || E.flag('portaSoterraniOberta'),
          pista: E => "El Pare Xèvius barra el camí de la porta de les Gírgoles. Vol una prova de bona voluntat: la Carta del Cortiner, que reposa al Pi dels Tres Cants." },
        { id: 'soterrani', marca: ['portaSoterraniOberta'], fet: E => E.flag('portaSoterraniOberta'),
          pista: E => "Al Pati del Celler hi ha una porta de ferro. La clau de ferro n'és amiga." },
        { id: 'clauIscu', marca: ['iscuTrobat', 'clauGirgoles', 'obj:clau_girgoles'], fet: E => E.te('clau_girgoles') || E.flag('portaFerroOberta'),
          pista: E => E.flag('iscuTrobat') ? "L\'Iscu t'espera a la cabana amagada, en un buit entre els arbres al nord del camí de la Desaparició: té una clau rovellada per a tu."
              : "La porta del fons té un pany petit. L\'Iscu, el noi de la Taverna, ho ha vist tot: s'amaga pel camí de la Desaparició: busca un buit entre els arbres, al nord del camí." },
        { id: 'portaFerro', marca: ['portaFerroOberta'], fet: E => E.flag('portaFerroOberta'),
          pista: E => !E.flag('cantMiracle') || !E.te('benedicio_fraterna') ? "La porta de ferro del fons de la galeria de sota la Taverna només s\'obre amb la clau rovellada, el Cant del Miracle i l\'Empara de les sacerdotesses." : "Al fons de la galeria de la Porta de Ferro, la clau rovellada de l\'Iscu té una porta de ferro que treu boira." },
        { id: 'girgoles', marca: ['girgolesEnceses'], fet: E => E.flag('girgolesEnceses'),
          pista: E => "Darrere la porta de ferro, cinc mates de gírgoles lluminoses voldrien brillar alhora, però cada una desperta les veïnes." },
        { id: 'tortura', marca: ['torturaNet'], fet: E => E.flag('torturaNet'),
          pista: E => "Segueix el camí de les Gírgoles fins al final: un mur d'esbarzers negres barra el pas, i Runna els sap tallar." },
        { id: 'pont', marca: ['pontGabia'], fet: E => E.flag('pontGabia'),
          pista: E => "Al fons de les Gírgoles, davant d'un abisme, uns blocs de pedra dormen. Potser la tarota sap com despertar-los." },
        { id: 'ocellaire', marca: ['ocellaireVencut'], fet: E => E.flag('ocellaireVencut'),
          pista: E => E.flag('ocellaireVist') ? "Talla els ocells de foc i aparta't del bàcul. Quan l'Ocellaire cau de genolls, colpeja-li el cap."
              : "Més enllà del pont, el Germà Aleu fa guàrdia... i no hi és sol." },
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
        { id: 'taverna', marca: ['tavernaOberta', 'eveParlat'], obert: E => E.flag('clauerNovici'), fet: E => E.flag('eveParlat'),
          pista: E => "El Sardi berenava cada tarda a la Taverna amb l\'Eve. La porta és tancada, però una trucada potser l'obriria." },
        { id: 'tresor', marca: ['tresorObert'], obert: E => E.flag('cantPedres'), fet: E => E.flag('tresorObert'),
          pista: E => "Diuen que a la façana del Santuari hi ha una pedra que escolta cants antics." },
        { id: 'nena', marca: ['nenaVista', 'llac1', 'llac2', 'nenaAlliberada'], obert: E => E.flag('nenaVista'), fet: E => E.flag('nenaAlliberada'),
          pista: E => "La Nena de les Trenes va perdre dos llaços: un pel camí de la Rovellonera i l'altre en una clariana del mig del bosc de la Rovellonera." }
    ],

    // El primer pas de la història que encara no és fet
    seguent(E) { return this.passos.find(p => !p.fet(E)) || null; },

    // Els passos que l'Ineu ja ha començat però no ha acabat (hi ha alguna de les seves marques i encara no són fets), sense el primer pendent (que ja és «el fil del camí»):
    // el Diari els mostra tots, perquè el jugador no es perdi quan té diverses coses a mig fer
    aMitges(E) {
        const seg = this.seguent(E);
        return this.passos.filter(p => p !== seg && !p.fet(E) && p.marca && p.marca.some(m => m.startsWith('obj:') ? E.te(m.slice(4)) : E.flag(m)));
    },

    // Recompte de joc completat (menú de pausa i crèdits): la història principal val un 70% i les missions laterals un 30%.
    // El 100% només hi és quan tot és fet (no s'arrodoneix cap amunt).
    completat(E) {
        const fets = this.passos.filter(p => p.fet(E)).length, lat = this.laterals.filter(l => l.fet(E)).length;
        const tp = this.passos.length, tl = this.laterals.length;
        const tot = fets === tp && lat === tl;
        return { percent: tot ? 100 : Math.min(99, Math.floor(70 * fets / tp + 30 * lat / tl)), historia: [fets, tp], laterals: [lat, tl] };
    },

    // Nombre de zones a creuar entre dues zones (pel graf de MAPA.enllacos); null si no es pot calcular (p. ex. a les proves de node)
    distanciaZones(a, b) {
        if (typeof MAPA === 'undefined' || !a || !b) return null;
        if (a === b) return 0;
        const veins = {};
        MAPA.enllacos.forEach(([x, y]) => { (veins[x] = veins[x] || []).push(y); (veins[y] = veins[y] || []).push(x); });
        const dist = { [a]: 0 }, cua = [a];
        while (cua.length) {
            const z = cua.shift();
            for (const v of veins[z] || []) if (dist[v] === undefined) { dist[v] = dist[z] + 1; if (v === b) return dist[v]; cua.push(v); }
        }
        return null;
    },

    // El pas següent és lluny (4 zones o més des d'on ets) i ja es pot viatjar amb el Follet del Carro Verd (n'has trobat alguna parada): se't recorda
    recordaFollet(E, p) {
        if (typeof game === 'undefined' || typeof PARADES === 'undefined' || typeof DIARI_PASSOS === 'undefined' || !p || !DIARI_PASSOS[p.id]) return false;
        if (!PARADES.some(pd => E.flag('parada_' + pd.id))) return false;
        const act = game.scene.getScenes(true).find(sc => /^Zona/.test(sc.scene.key));
        const d = act ? this.distanciaZones(act.scene.key, DIARI_PASSOS[p.id][1]) : null;
        return d !== null && d >= 4;
    },

    // Pista del pas següent (amb el recordatori del Follet quan toca)
    pista(E) {
        const t = this.pistaBase(E), p = this.seguent(E);
        return p && this.recordaFollet(E, p) ? t + "\nRecorda que el Follet del Carro Verd et pot portar de pressa d'una parada a l'altra." : t;
    },

    // Pista del pas següent; si la història principal està aturada en una part encara per fer, recorda una lateral
    pistaBase(E) {
        const p = this.seguent(E);
        if (p && !p.pendent) return p.pista(E);
        const l = this.laterals.find(m => m.obert(E) && !m.fet(E));
        if (p && l) return p.pista(E) + " Mentrestant: " + l.pista(E);
        if (p) return p.pista(E);
        if (l) return "Els nens tornen a riure i l'orgue sona (gairebé bé). Si encara vols feina: " + l.pista(E);
        return "Els nens tornen a riure i l'orgue sona (gairebé bé). Ho has fet tot, fill.";
    },

    // Pista només fins a Runna (null quan ja la tens): la fan servir el Pare Jòrdius, el Pare Alberic i el Til·ler
    pistaRunna(E) {
        if (E.flag('runna')) return null;
        const p = this.seguent(E);
        return p ? p.pista(E) : null;
    }
};

if (typeof module !== 'undefined') module.exports = PROGRES;
