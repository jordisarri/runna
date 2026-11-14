/**
 * ESCENARIS DE PROVES: per a cada missió (lateral o no) els estats en què es pot voler provar-la, i on cal anar-hi.
 * Dades pures (el mode de proves, js/proves.js, les aplica): cap funció amb efectes.
 *   posa:    flags que es posen (true);   valors: { flag: valor } per als que no són booleans (p. ex. les roques: 'E' = empesa cap a l'est)
 *   treu:    flags que es treuen;          obj: objectes que es donen;   treuObj: objectes que es treuen
 *   zona / entrada: on s'aparca l'Ineu en aplicar-lo.
 * Les missions laterals de js/progres.js (PROGRES.laterals) hi són totes; hi ha també altres moments que es proven sovint (el Dolmen).
 * `lateral` és l'id de PROGRES.laterals: serveix per mostrar si la missió està oberta (○) o feta (✓) en aquest moment.
 */
const ESCENARIS = [
    {
        id: 'nena', nom: 'La Nena de les Trenes', lateral: 'nena',
        estats: [
            { nom: 'No començada', treu: ['nenaVista', 'llac1', 'llac2', 'nenaAlliberada', 'trenesNena', 'pedra_llac1', 'pedra_llac2'], treuObj: ['llac_nena', 'cinta_nena'], zona: 'ZonaCamiRov', entrada: 'era' },
            { nom: 'Ha parlat (falten els 2 llaços)', posa: ['nenaVista'], treu: ['llac1', 'llac2', 'nenaAlliberada', 'trenesNena', 'pedra_llac1', 'pedra_llac2'], treuObj: ['llac_nena', 'cinta_nena'], zona: 'ZonaCamiRov', entrada: 'era' },
            { nom: 'Té 1 llaç (falta el de la clariana)', posa: ['nenaVista', 'llac1'], valors: { pedra_llac1: 'E' }, treu: ['llac2', 'nenaAlliberada', 'trenesNena', 'pedra_llac2'], obj: ['llac_nena'], treuObj: ['cinta_nena'], zona: 'ZonaRovellonera', entrada: 'portal' },
            { nom: 'Té els 2 llaços (cal tornar-hi) ▶ escena', posa: ['nenaVista', 'llac1', 'llac2'], valors: { pedra_llac1: 'E', pedra_llac2: 'E' }, treu: ['nenaAlliberada', 'trenesNena'], obj: ['llac_nena'], treuObj: ['cinta_nena'], zona: 'ZonaCamiRov', entrada: 'era' },
            { nom: 'Feta (ja marxada; a l\'epíleg)', posa: ['nenaVista', 'llac1', 'llac2', 'nenaAlliberada', 'trenesNena'], obj: ['cinta_nena'], treuObj: ['llac_nena'], zona: 'ZonaCamiRov', entrada: 'era' }
        ]
    },
    {
        id: 'taverna', nom: 'Taverna i l\'Eve', lateral: 'taverna',
        estats: [
            { nom: 'No començada (porta tancada)', posa: ['clauerNovici'], treu: ['tavernaOberta', 'eveParlat'], zona: 'ZonaTaverna', entrada: 'jardi' },
            { nom: 'Porta oberta, falta parlar amb l\'Eve', posa: ['clauerNovici', 'tavernaOberta'], treu: ['eveParlat'], zona: 'ZonaTavernaInt', entrada: 'porta' },
            { nom: 'Feta', posa: ['clauerNovici', 'tavernaOberta', 'eveParlat'], zona: 'ZonaTavernaInt', entrada: 'porta' }
        ]
    },
    {
        id: 'carry', nom: 'La Carry i el Pallofa', lateral: 'carry',
        estats: [
            { nom: 'No començada', posa: ['clauerNovici'], treu: ['carryParlat', 'pallofaTornat', 'clauCampanar'], treuObj: ['pallofa', 'clau_campanar'], zona: 'ZonaCelles', entrada: 'ruines' },
            { nom: 'Ha parlat (cal trobar el gos a Sant Antoni)', posa: ['clauerNovici', 'carryParlat'], treu: ['pallofaTornat', 'clauCampanar'], treuObj: ['pallofa', 'clau_campanar'], zona: 'ZonaSantAntoni', entrada: 'monestir' },
            { nom: 'Té el Pallofa (cal portar-lo a la Carry)', posa: ['clauerNovici', 'carryParlat'], treu: ['pallofaTornat', 'clauCampanar'], obj: ['pallofa'], treuObj: ['clau_campanar'], zona: 'ZonaCelles', entrada: 'ruines' },
            { nom: 'Feta (té la clau del campanar)', posa: ['clauerNovici', 'carryParlat', 'pallofaTornat'], obj: ['clau_campanar'], treuObj: ['pallofa'], zona: 'ZonaCelles', entrada: 'ruines' }
        ]
    },
    {
        id: 'rellotge', nom: 'El rellotge de la torre', lateral: 'rellotge',
        estats: [
            { nom: 'Té la clau (falta obrir la porta del retaule)', posa: ['rellotgeDit', 'rellotgeExplicat'], treu: ['portaCampanarOberta', 'rellotgeReparat'], obj: ['clau_campanar'], zona: 'ZonaEsglesia', entrada: 'porta' },
            { nom: 'Porta oberta: puzle dels engranatges per fer', posa: ['rellotgeDit', 'rellotgeExplicat', 'portaCampanarOberta'], treu: ['rellotgeReparat'], obj: ['clau_campanar'], zona: 'ZonaGolfes', entrada: 'porta' },
            { nom: 'Feta (rellotge en marxa)', posa: ['rellotgeDit', 'rellotgeExplicat', 'portaCampanarOberta', 'rellotgeReparat', 'visitada_ZonaTorre'], obj: ['clau_campanar'], zona: 'ZonaEsglesia', entrada: 'porta' }
        ]
    },
    {
        id: 'tresor', nom: 'El tresor de la façana (pedra que escolta)', lateral: 'tresor',
        estats: [
            { nom: 'Sense el cant de Vespres', treu: ['cantPedres', 'tresorObert', 'cofreTresor'], zona: 'ZonaPlaca', entrada: 'tresor' },
            { nom: 'Amb flauta i el cant (cal tocar-lo a la pedra)', posa: ['cantPedres'], treu: ['tresorObert', 'cofreTresor'], obj: ['flauta'], zona: 'ZonaPlaca', entrada: 'tresor' },
            { nom: 'Feta (cova oberta)', posa: ['cantPedres', 'tresorObert'], treu: ['cofreTresor'], obj: ['flauta'], zona: 'ZonaTresor', entrada: 'porta' }
        ]
    },
    {
        id: 'pi', nom: 'El Pi dels Tres Cants', lateral: 'pi',
        estats: [
            { nom: 'Pi adormit (cap cant)', posa: ['cantAurora', 'cantPedres', 'cantMiracle'], treu: ['piAurora', 'piPedres', 'piMiracle', 'piObert', 'piVist', 'flauta_pi'], obj: ['flauta'], zona: 'ZonaBoscPi', entrada: 'santantoni' },
            { nom: 'A mig despertar (Aurora i Vespres)', posa: ['cantAurora', 'cantPedres', 'cantMiracle', 'piAurora', 'piPedres', 'flauta_pi'], treu: ['piMiracle', 'piObert', 'piVist'], obj: ['flauta'], zona: 'ZonaBoscPi', entrada: 'santantoni' },
            { nom: 'Despert (camí lliure)', posa: ['cantAurora', 'cantPedres', 'cantMiracle', 'piAurora', 'piPedres', 'piMiracle', 'piObert', 'piVist', 'flauta_pi'], obj: ['flauta'], zona: 'ZonaBoscPi', entrada: 'santantoni' }
        ]
    },
    {
        id: 'carruatge', nom: 'El Carro Verd del Follet', lateral: 'carruatge',
        estats: [
            { nom: 'Epíleg fet, carro tancat', posa: ['epilegFet', 'parada_era'], treu: ['carruatgeObert'], zona: 'ZonaEra', entrada: 'jardi' },
            { nom: 'Feta (carro obert)', posa: ['epilegFet', 'parada_era', 'carruatgeObert'], zona: 'ZonaEra', entrada: 'jardi' }
        ]
    },
    {
        id: 'dolmen', nom: 'Dolmen: alçar Runna (les tres coses)', lateral: null,
        estats: [
            { nom: 'Sense res', posa: ['cantMiracle'], treu: ['fullaTiler', 'saber', 'benediccio', 'placaDolmen', 'alcuiPlacaDita', 'placaCompleta', 'runna'], treuObj: ['runna', 'medallo_arbre', 'medallo_saber', 'medallo_benedicio'], zona: 'ZonaDolmen', entrada: 'bosc' },
            { nom: 'Només la fulla del Til·ler', posa: ['fullaTiler'], treu: ['saber', 'benediccio', 'placaCompleta', 'runna'], treuObj: ['runna'], zona: 'ZonaDolmen', entrada: 'bosc' },
            { nom: 'Les tres coses (cal alçar Runna) ▶ animació', posa: ['fullaTiler', 'saber', 'benediccio'], treu: ['placaCompleta', 'runna'], treuObj: ['runna'], zona: 'ZonaDolmen', entrada: 'bosc' },
            { nom: 'Runna ja alçada', posa: ['fullaTiler', 'saber', 'benediccio', 'runna', 'placaCompleta'], obj: ['runna'], zona: 'ZonaDolmen', entrada: 'bosc' }
        ]
    }
];
