/**
 * DIÀLEGS (extrets de docs/GUIO.md)
 * Cada entrada és una funció que rep l'Estat i retorna { pagines: [{qui, text}], enAcabar? }.
 * Així cada personatge diu una cosa o una altra segons el progrés (flags).
 * qui: nom que surt a la caixa ('' = narrador / sistema).
 */
// Missatge xifrat de les taules de pedra de l'Ermita (una paraula per columna del camí)
const PARAULES_MISSATGE = ["Quan", "la", "boira", "cobreixi", "el", "Miracle,", "els", "passos", "dels", "absents", "tornaran", "amb l'alba."];
const SIGNES_MISSATGE = ["☉", "☽", "✦", "♆", "⚶", "☿", "♄", "♃", "⚸", "☋", "☊", "⚷"];

// Ofrenes per a la Font del Bisbe: l'herba de Sant Joan, el romaní i una pruna de la Prunera Màgica
// (a les partides velles, la farigola que s'hi portava abans compta com la pruna)
function ofrenesFont(E) { return ['herba1', 'herba2'].filter(h => E.flag(h)).length + (E.te('pruna') || E.flag('herba3') ? 1 : 0); }
function objectiuFont(n) {
    return n === 3 ? 'Ja ho tens tot: torna a la Font del Bisbe.' : `Porta a la Font del Bisbe l'herba de Sant Joan, el romaní (al bosc) i una pruna de la Prunera de l'Hostatgeria (${n}/3).`;
}

// Pistes: totes surten de la taula de passos de js/progres.js
function pistaRunna(E) { return PROGRES.pistaRunna(E); }
function pistaActual(E) { return PROGRES.pista(E); }

// La clau de la porta del retaule que duu a la torre del rellotge és de la Carry (la vídua del campaner); les Venerables només t'hi envien.
// Les partides velles que ja tenen la clau, o que ja han pujat a la torre, no la necessiten.
function senseClauCampanar(E) { return !E.te('clau_campanar') && !E.flag('portaCampanarOberta') && !E.flag('rellotgeReparat') && !E.flag('visitada_ZonaTorre') && !E.flag('clauCampanar'); }

function consellVenerables(E) {
    if (senseClauCampanar(E)) {
        return {
            pagines: [
                { qui: 'Les Venerables Sàvies', text: "Ai, fill, has vist que el rellotge del campanar s'ha aturat? La porta del retaule que duu a la torre fa anys que és tancada: des que el campaner se'n va, la clau la guarda la seva vídua, la Carry, aquí a Nostra Senyora." },
                { qui: 'Les Venerables Sàvies', text: E.flag('carryParlat')
                    ? "Pobreta, no té el cap per res: fa tres nits que busca el seu gos, el Pallofa. Si el trobes i li'l portes, segur que et dona la clau."
                    : "Parla-hi, però amb paciència: la pobreta no és la mateixa des que va pujar la boira. Potser et pot necessitar." }
            ]
        };
    }
    return { pagines: [{ qui: 'Les Venerables Sàvies', text: "Ai, fill, torna a seure. A veure... " + pistaActual(E) }] };
}

// Objectiu viu del sopar del Til·ler: diu què falta
function objectiuSopar(E) {
    const f = [];
    if (!E.flag("escudella")) f.push("l'escudella de la Neus");
    if (!E.flag("floresIsidre")) f.push("les flors de l'Isidre (Hostatgeria)");
    if (!E.flag("pastorsConvencuts")) f.push("convèncer els pastors de la Cirosa (toca música vora el seu foc)");
    E.posaObjectiu(f.length ? "El sopar del Til·ler: falta " + f.join(", ") + "." : "Tot a punt: torna al Gran Til·ler per al sopar.");
}

// Cada sacerdotessa allibera dona un gra més al rosari (+1 cor) i, quan les tres són lliures, l'Hostatgeria obre la porta per dins
function premiMonja(nom, flag) {
    const E = Estat;
    E.posaFlag(flag);
    const ui = game.scene.getScene('UI');
    if (E.flag('premiPains') && E.flag('premiPhili') && E.flag('premiCharm')) {
        E.posaFlag('mongesTrobades');
        E.dades.corsMax += 1; E.dades.vida = E.dades.corsMax * 2;      // un sol gra pel conjunt de les tres germanes
        if (ui) { ui.actualitzarHUD(); ui.missatge('+1 gra al rosari: les tres germanes'); }
        E.posaObjectiu("Les tres sacerdotesses són lliures i han obert la porta de l'Hostatgeria per dins: hi ha un lloc de repòs al vestíbul.");
    } else {
        const f = ['Pains', 'Phili', 'Charm'].filter(n => !E.flag('premi' + n));
        E.posaObjectiu('Allibera les sacerdotesses que falten: ' + f.join(', ') + '.');
    }
    E.desar();
}

const DIALEGS = {

    // ---------------- PLAÇA ----------------
    pareJordi: E => {
        if (!E.flag("clauerNovici")) {
            return {
                pagines: [
                    { qui: "Pare Jordi", text: "Ineu, bon dia. Que bé que hagis sortit, et buscava." },
                    { qui: "Pare Jordi", text: "No et vull espantar. Fa tres nits que una boira violeta surt de sota terra, i cada nit falta un nen: l'Huri i el Flami, de les cel·les de Sant Benet, porta amb porta; i aquesta nit, el Sardi, el nebot de les sacerdotesses de l'Hostatgeria." },
                    { qui: "Pare Jordi", text: "Ningú no els ha vist marxar. Els llits són desfets i les finestres, tancades per dins. Només queda una olor de terra mullada." },
                    { qui: "Pare Jordi", text: "Tu tens bons ulls i bon cor. Parla amb tothom i explica-m'ho tot. Ves amb compte pels camins, Ineu." }
                ],
                enAcabar: () => {
                    E.posaFlag("clauerNovici");
                    E.posaObjectiu(E.flag("bastoObtingut") ? "Parla amb la gent del Santuari. Les cel·les són al nord, passant per les Runes." : "Passa a veure el Germà Andreu, vora els xiprers de la plaça. Després, les cel·les són al nord, passant per les Runes.");
                }
            };
        }
        if (E.flag("fullaTiler") && !E.flag("benediccio")) {
            return {
                pagines: [
                    { qui: "Pare Jordi", text: "Ineu! Ho he sentit: el Til·ler t'ha donat el seu permís. Aquell arbre no en dóna ni a mi." },
                    { qui: "Pare Jordi", text: "Mira, fill: jo no soc valent com tu, però sí que sé una cosa. Una benedicció no és una paraula màgica, és voler bé de debò. Ajup el cap." },
                    { fer: (z, fet) => z.seq([c => z.npcVa('pare_jordi', z.ineu.x + 60, z.ineu.y + 4, c), c => z.npcMira('pare_jordi', 'ineu', c), c => { z.ajupir('ineu'); z.llum(z.ineu.x, z.ineu.y - 90, 0xffe8a0, c); }], fet) },
                    { qui: "Pare Jordi", text: "No vas sol, Ineu. Vas amb tot el Miracle darrere teu." },
                    { avis: "Has rebut la BENEDICCIÓ DEL PARE JORDI." }
                ],
                enAcabar: () => { E.posaFlag("benediccio"); E.posaObjectiu(DIALEGS.objectiuRunna(E)); }
            };
        }
        if (E.te("basto_tiller") && !E.flag("runna")) {
            return { pagines: [
                { qui: "Pare Jordi", text: "Ineu, la gent diu que has parlat amb el Gran Til·ler. Per despertar Runna et calen tres coses: el permís de l'arbre (la Fulla), les Paraules del Saber del Pare Alcuí i la meva benedicció." },
                { qui: "Pare Jordi", text: pistaRunna(E) }
            ] };
        }
        if (E.flag("combatActiu")) {
            return { pagines: [
                { qui: "Pare Jordi", text: "Les bestioles han sortit pels camins, Ineu. Fins i tot alguns visitants, que pujaven al Miracle a fer fotos, vagaregen amb la pell verdosa i la mirada perduda: la boira els ha trastocat i no saben ni qui són. Si en veus pel Santuari o pel Cementiri, no t'espantis." },
                { qui: "Pare Jordi", text: "No són dolents, pobrets: només fes-los dormir i es despertaran sense recordar res. Quan la boira se'n vagi, tornaran a ser turistes." },
                { qui: "Pare Jordi", text: "I torna abans que es faci fosc." }
            ] };
        }
        return {
            pagines: [
                { qui: "Pare Jordi", text: "Parla amb la gent: les famílies de les cel·les, els germans, la Pianista... Algú haurà vist alguna cosa." },
                { qui: "Pare Jordi", text: "Si et perds, les Venerables Sàvies de les cel·les sempre tenen un bon consell." }
            ]
        };
    },

    germaAndreu: E => {
        if (!E.flag('bastoObtingut')) {
            return {
                pagines: [
                    { qui: 'Germà Andreu', text: 'Ineu! Quin drama, oi? Tothom corrent amunt i avall... Segur que els nens s\'han amagat per jugar.' },
                    { qui: 'Germà Andreu', text: 'Ets del Barça, tu? Tinc uns cromos que els nens es moren per tenir. Ells sí que m\'escolten.' },
                    { qui: 'Germà Andreu', text: 'Ei, pren aquest bastó de pelegrí. Era d\'un vell que ja no el vol.' },
                    { fer: (z, fet) => z.objecteVola('germa_andreu', () => z.ineuAixeca('ineu_aixeca_basto', fet, 0.58), 'arma_basto') },
                    { avis: 'Has obtingut el BASTÓ DE PELEGRÍ!' },        // quadre de diàleg: l'Ineu hi roman alçant el bastó fins que s'avança
                    { fer: (z, fet) => z.ineuBaixa(fet) }
                ],
                enAcabar: () => {
                    E.posaFlag('parlatAndreu');
                    E.dona('basto'); E.posaFlag('bastoObtingut'); E.posaFlag('tutorialCombat'); E.posaFlag('combatActiu');
                    if (E.flag('clauerNovici')) E.posaObjectiu('Parla amb la gent del Santuari. Les cel·les són al nord, passant per les Runes.');
                }
            };
        }
        return {
            pagines: [
                { qui: 'Germà Andreu', text: 'Avui no tinc temps, Ineu. Tinc... coses a fer. Força Barça!' }
            ]
        };
    },

    bassadoria: E => E.flag("bassadoriaNeta") ? ({ pagines: [] }) : ({
        pagines: [
            { qui: "Ineu", text: "L'aigua sempre ha estat clara... Ara és tèrbola i fa olor de soterrani. I en surten aquests gripaus enverinats i una boira violeta, a glopades." }
        ]
    }),

    creu: E => ({
        pagines: [
            { qui: 'Ineu', text: 'Avui les flors estan pansides. Com si la boira se\'n begués el color.' }
        ]
    }),

    cartellPlaca: E => ({ pagines: [{ qui: 'Cartell', text: "↑ El Celler i les Runes\n← Casa Gran\n↓ La Bassadòria" }] }),
    pedraSecreta: E => ({ pagines: [] }),
    pedraSecretaOberta: { pagines: [
        { qui: 'Ineu', text: 'Un passatge entre el Monestir i el Santuari! Els monjos antics sí que en sabien, d\'amagar coses.' }
    ] },
    cofreTresor: E => {
        if (E.flag('cofreTresor')) return { pagines: [] };
        return {
            pagines: [
                { qui: 'Nota', text: '«Per al qui sap escoltar les pedres.»' },
                { fer: (z, fet) => z.seq([c => z.agafar(c, null, 0xf0c040), c => z.beure(c, 0xf0c040)], fet) },
                { avis: "+1 GRA AL ROSARI i rosari ple." }
            ],
            enAcabar: () => { E.posaFlag('cofreTresor'); E.dades.corsMax += 1; E.dades.vida = E.dades.corsMax * 2; }
        };
    },

    // El Siscu, el fill de la Carmen, s'ha escapat a la cabana amagada a jugar al solitari
    ciscu: E => {
        // La clau rovellada: al Germà Andreu li va caure a la porta de ferro, i el Siscu se la va quedar
        const clau = [
            { qui: 'Siscu', text: 'I mira què vaig trobar: una nit, al Germà Andreu li va caure aquesta clau davant la porta de ferro, i no se n\'adonà. És petita i rovellada. Me la vaig quedar per jugar a pirates.' },
            { qui: 'Siscu', text: 'Té, a tu et servirà més que a mi. Però no diguis a la mare que jo era a fora de nit!' },
            { avis: 'Has obtingut la CLAU ROVELLADA' }
        ];
        const donar = () => { E.posaFlag('ciscuTrobat'); E.posaFlag('clauGirgoles'); E.dona('clau_girgoles'); };
        if (!E.flag('ciscuTrobat')) return {
            pagines: [
                { fer: (z, fet) => z.seq([c => z.bombolla('ciscu', '!', c, 600), c => z.npcSalta('ciscu', c, 1)], fet) },
                { qui: 'Siscu', text: 'No diguis res a la mare! Sóc el Siscu, el de la Carmen, la de la Taverna. Des que hi ha boira, ella dorm tot el dia i l\'Eva em fa fregar gots.' },
                { qui: 'Siscu', text: 'Aquí ningú no em busca i puc jugar al solitari tranquil. Les cartes són de l\'avi. Li falta el set d\'oros, però faig veure que hi és.' },
                { qui: 'Siscu', text: 'De nit he vist el Germà Andreu picar tres cops a la porta de ferro de la Sala de les Gírgoles, al camí de l\'est del Pati del Celler. No té clau, d\'aquesta: la porta s\'obre sola, com si de dins l\'esperessin. A baix n\'hi ha una altra, amb un pany petit.' },
                ...clau
            ],
            enAcabar: donar
        };
        if (!E.flag('clauGirgoles')) return { pagines: clau, enAcabar: donar };
        return { pagines: [
            { qui: 'Siscu', text: (E.flag('tombaSegellada')) ? 'Ja m\'ha sortit el solitari! Bé, una mica. He fet una trampa petita amb el set d\'oros de paper. No ho diguis.' : 'Encara no m\'ha sortit. La sota d\'espases sempre queda a sota de tot... com jo a la Taverna.' },
            { qui: 'Siscu', text: 'Si veus la mare, no li diguis on sóc. Bé... si et pregunta molt, sí.' }
        ] };
    },

    solitari: E => ({ pagines: [] }),

    cofreCabanaCami: E => {
        if (E.flag('cofreCabanaCami')) return { pagines: [] };
        return {
            pagines: [
                { qui: 'Nota', text: "«Per a qui es perd pel camí i el troba.»" },
                { fer: (z, fet) => z.seq([c => z.agafar(c, null, 0xf0c040), c => z.beure(c, 0xf0c040)], fet) },
                { avis: "+1 GRA AL ROSARI i rosari ple." }
            ],
            enAcabar: () => { E.posaFlag('cofreCabanaCami'); E.dades.corsMax += 1; E.dades.vida = E.dades.corsMax * 2; }
        };
    },

    // ---------------- ESGLÉSIA ----------------
    pianista: E => {
        const primera = !E.flag("parlatPianista");
        if (!E.flag("cantAurora")) {
            const intro = primera ? [
                { qui: "La Pianista", text: "Ai, Ineu, fill... Passa, passa. Perdona que no et miri, no puc deixar l'orgue." },
                { fer: (z, fet) => z.seq([c => z.npcFeina('pianista', 1600, 'notes', c), c => z.bombolla('pianista', '…', c)], fet) },
                { qui: "La Pianista", text: "Fa quaranta anys que toco cada dia i mai no m'havia faltat el so. Jo només visc per això, fill. Sense música, què sóc?" },
                { qui: "La Pianista", text: "És com si alguna cosa s'estigués menjant la música. Fa tres nits, des que va arribar la boira." }
            ] : [{ qui: "La Pianista", text: "Ho tornem a provar, fill? Escolta bé les tres notes." }];
            return {
                pagines: [...intro,
                    { qui: "La Pianista", text: "Però hi ha un cant que encara em surt, perquè la boira no se'l pot empassar: el Cant de l'Aurora. Te l'ensenyaré. Escolta'm i repeteix les notes amb 1, 2 i 3 (o amb ← ESPAI →)." }
                ],
                enAcabar: () => { E.posaFlag("parlatPianista"); iniciarLliço("aurora"); }
            };
        }
        if (E.flag("ombraDemanaCant") && !E.flag("cantPedres")) {
            return {
                pagines: [
                    { qui: "La Pianista", text: "El monjo de les Runes vol sentir el Cant de les Pedres? Ai, fill, aquest és molt vell. Me'l va ensenyar la meva mare. Vine, escolta." }
                ],
                enAcabar: () => iniciarLliço("pedres")
            };
        }
        if (E.flag("runna") && !E.flag("cantMiracle")) {
            return {
                pagines: [
                    { qui: "La Pianista", text: "Ai, Ineu, fill, portes Runna! Se't nota a la mirada. Aleshores t'he d'ensenyar l'últim cant, el que l'Ocellaire va robar als ocells: el Cant del Miracle." },
                    { qui: "La Pianista", text: "Jo me'n recordo perquè el cantava la meva mare. Escolta'm i repeteix les notes amb 1, 2 i 3 (o amb ← ESPAI →). Et farà falta allà baix." }
                ],
                enAcabar: () => iniciarLliço("miracle")
            };
        }
        if (E.flag("esquelles") && !E.flag("esquellesVistes")) {
            return {
                pagines: [
                    { qui: "La Pianista", text: "Ai, mare de Déu, les esquelles dels pastors! Fa vint anys que no en sentia el so. Deixa-me-les tocar un instant..." },
                    { qui: "La Pianista", text: "Duen una música antiga. Amb la flauta, els cants antics encara desperten allò que dorm sota la boira. Vés amb compte, que amb aquesta força la boira no et perdonarà." }
                ],
                enAcabar: () => E.posaFlag("esquellesVistes")
            };
        }
        return { pagines: [{ qui: "La Pianista", text: E.flag("bassadoriaNeta")
            ? "Se sent l'aigua cantar des d'aquí, fill. Ho has aconseguit. Torna'm quan hi hagi un altre cant per aprendre."
            : "Si trobes la manera de tornar la música, porta-me-la. Jo no em moc d'aquest banc, ni que s'acabi el món. Toca el cant amb la flauta quan siguis al lloc on cal." }] };
    },

    pareDaniel: E => {
        if (!E.flag('parlatDaniel')) {
            return {
                pagines: [
                    { qui: 'Pare Daniel', text: 'Ineu! Quina alegria de veure\'t! Vine, vine, que dirigeixo el cor i necessito una veu més.' },
                    { qui: 'Pare Daniel', text: 'La Pianista i jo som amics de tota la vida. Ella toca com ningú, i jo... jo només canto i faig el ximple amb els nens. Però la música es queda sense orgue, ja ho veus.' },
                    { qui: 'Pare Daniel', text: 'No et preocupis: si la música s\'ha amagat, la cantarem perquè torni! Riure és la primera pregària.' },
                    { qui: 'Pare Daniel', text: 'Ah, i una cosa que em preocupa: el rellotge del campanar s\'ha aturat a un quart de quatre, la nit que va arribar la boira.' },
                    { qui: 'Pare Daniel', text: 'La porta de la dreta del retaule puja per la torre fins a la Sala del Rellotge, però és tancada amb clau, i la clau la guarden les Venerables Sàvies, a les Cel·les. Jo ja no tinc l\'esquena per a tants graons, però tu... mira què hi passa.' }
                ],
                enAcabar: () => { E.posaFlag('parlatDaniel'); E.posaFlag('rellotgeDit'); }
            };
        }
        if (!E.te('clau_sagrari') && !E.flag('fragment2') && (E.flag('fragment1') || E.flag('sagrariVist'))) {
            return {
                pagines: [
                    { qui: 'Pare Daniel', text: 'El sagrari? Hi guardo quatre papers vells dels monjos, perquè la humitat no se\'ls mengi. Si el Pare Alcuí els busca, ja era hora que algú els llegís!' },
                    { qui: 'Pare Daniel', text: 'Però la clau, ai, fa anys que no sé on para: una de petita, que sembla de joguina. Els monjos antics deixaven les seves coses a l\'ermita de la Desaparició, camí de l\'Era, a l\'oest de les Runes. Potser allà.' }
                ],
                enAcabar: () => E.posaFlag('clauSagrariDita')
            };
        }
        if (!E.flag('rellotgeReparat')) {
            return { pagines: [{ qui: 'Pare Daniel', text: E.te('clau_campanar') || E.flag('portaCampanarOberta')
                ? 'La Sala del Rellotge, fill: la porta de la dreta del retaule, i torre amunt. Si algú el fa caminar de nou, potser la boira s\'ho pensarà dues vegades.'
                : 'La porta de la dreta del retaule és tancada, fill: la clau la guarden les Venerables Sàvies, a les Cel·les. Si algú fa caminar el rellotge, potser la boira s\'ho pensarà dues vegades.' }] };
        }
        return { pagines: [{ qui: 'Pare Daniel', text: 'Sents el rellotge, Ineu? Torna a caminar! Fa tres nits que no el sentia. Els nens em diuen que canto massa fort, però avui no cal: ho fa ell per mi!' }] };
    },
    // Sagrari del Retaule Major: hi ha el fragment 2 de la llegenda del monjo. És tancat amb una clau petita que és a l'ermita de la Desaparició (premi del missatge de les dotze columnes).
    sagrari: E => {
        if (E.flag("fragment2")) return { pagines: [] };
        if (!E.te("clau_sagrari")) {
            return {
                pagines: [{ qui: "Ineu", text: "El sagrari és tancat amb una clau molt petita." }],
                enAcabar: () => E.posaFlag("sagrariVist")
            };
        }
        return {
            pagines: [
                { fer: (z, fet) => z.agafar(fet, 'pergami', 0xf2e6c8) },
                { qui: "Pergamí", text: "Fragment 2 de 2:\n«El monjo va guardar el segell fins al darrer dia. Des d'aleshores la seva ombra torna cada nit al mur de les Runes a vigilar. La clau de ferro és on ell la va deixar, amb els seus germans, sota la mirada d'un guardià de pedra.»" },
                { qui: "Pergamí", text: "«Qui busqui la clau, que no oblidi mai on neix el sol.»" }
            ],
            enAcabar: () => E.posaFlag("fragment2")
        };
    },

    // ---------------- MONESTIR ----------------
    // ---------------- CASA GRAN ----------------
    homeRaim: E => ({
        pagines: [
            { qui: 'Ineu', text: 'Té el cap posat del revés. Sembla que vigili alguna cosa a la seva esquena.' }
        ]
    }),

    // ---------------- RUÏNES I PING-PONG ----------------
    ruines: E => ({
        pagines: [
            { qui: 'Pergamí', text: "Un pergamí esquinçat (fragment 1 de 2):\n«Quan l'Ocellaire va ser tancat a la seva gàbia, un monjo va segellar la porta de ferro amb la llum de l'espasa Runna i la va deixar dormint a la pedra. Després va amagar la clau de la porta allà on ningú no la trobés.»" },
            { fer: (z, fet) => z.agafarPergamiRunes ? z.agafarPergamiRunes(fet) : fet() },
            { qui: 'Ineu', text: "Falta l'altre fragment. Potser a l'església... I cada nit, diuen, a aquest mur s'hi veu l'ombra d'un monjo." },
            { fer: (z, fet) => z.aparicioOmbra ? z.aparicioOmbra(fet) : fet() },
            { qui: 'Ineu', text: "Ha aparegut en llegir el pergamí... És el monjo del segell? El Pare Alcuí ha de veure això: li duré els dos fragments." }
        ],
        enAcabar: () => E.posaFlag('fragment1')
    }),

    cartellRuinesPingpong: E => ({ pagines: [{ qui: 'Cartell', text: "← Camí de la Desaparició\n→ Cementiri\n↑ Cel·les\n↓ El Celler i la Plaça" }] }),
    cartellCeller: E => ({ pagines: [{ qui: 'Cartell', text: "← El Celler (ping-pong)\n→ Sala de les Gírgoles\n↑ Les Runes\n↓ Plaça" }] }),
    cartellGirgoles: E => ({ pagines: [{ qui: 'Cartell', text: "Sala de les Gírgoles" }] }),

    juli: E => ({
        pagines: [
            { qui: 'July', text: 'Ei, Ineu! El repte més gran del Miracle és derrotar el Jusef i el seu servei màgic. T\'hi atreveixes?' },
            { qui: 'July', text: 'El Senyor Perers juga amb una pala de pedra. De pedra! I tot i així, em guanya fàcilment.' }
        ]
    }),

    frederic: E => ({
        pagines: [
            { qui: 'Senyor Perers', text: 'Calma, noi. La pilota no s\'ha de perseguir, s\'ha d\'esperar.' },
            { qui: 'Senyor Perers', text: 'Jo jugo amb una pala de pedra. De pedra, sí: pesa com un maó i no té goma ni res. Quan jugueu a la taula, no em veuràs ni a mi ni la pala; no cal.' },
            { qui: 'Senyor Perers', text: 'Perquè amb què es juga és igual. La pala només és una extensió de l\'ànima. El que compta és l\'esperit del joc, la màgia que portes dins.' }
        ]
    }),

    josep: E => E.flag('josepVencut') ? {
        pagines: [
            { qui: 'Jusef', text: 'La taula és teva quan vulguis, noi. Vols provar de tornar-me el servei un altre cop?' },
            { fer: (z, fet) => z.ui().triar(['Sí', 'No'], i => { DIALEGS._triaPP = i; fet(); }) }
        ],
        enAcabar: () => { if (DIALEGS._triaPP === 0) game.scene.start('PingPong'); DIALEGS._triaPP = null; }
    } : {
        pagines: [
            { qui: 'Jusef', text: 'Benvingut al Celler, viatger. Les pales i la pilota només són l\'escorça: el que jo practico aquí és màgia blanca.' },
            { qui: 'Jusef', text: 'Aquest és el meu servei màgic. La pilota desprèn tres llums que s\'encenen una a una. Fins ara ningú ha aconseguit aturar-lo.' },
            { qui: 'Jusef', text: 'Vols provar-ho? Una partida, a set punts.' },
            { fer: (z, fet) => z.ui().triar(['Sí', 'No'], i => { DIALEGS._triaPP = i; fet(); }) }
        ],
        enAcabar: () => {
            const triat = DIALEGS._triaPP; DIALEGS._triaPP = null;
            const ui = game.scene.getScene('UI');
            if (triat === 0) ui.obrirDialeg(DIALEGS.josepRegles(E), () => game.scene.start('PingPong'));
            else ui.obrirDialeg({ pagines: [{ qui: 'Jusef', text: 'Com vulguis. La taula ja no se\'n va enlloc.' }] });
        }
    },

    // Les úniques explicacions de com es juga: les dóna en Jusef, i curtes
    josepRegles: E => ({
        pagines: [
            { qui: 'Jusef', text: 'Mira per on ve la pilota: quan el cercle es posi verd, prem el seu carril (← ↓ → o els botons) i la tornaràs.' },
            { qui: 'Jusef', text: 'I quan jo faci el servei màgic, mira els tres signes i repeteix-los en el mateix ordre.' }
        ]
    }),

    josepGuanyat: E => E.flag('josepVencut') ? ({
        pagines: [
            { qui: 'Jusef', text: 'Un altre cop me l\'has tornat... El servei és teu, noi. Quan vulguis, tornem-hi.' }
        ]
    }) : ({
        pagines: [
            { qui: 'Jusef', text: '...Me l\'has tornat. El servei. Algú, per fi, l\'ha aturat de debò.' },
            { fer: (z, fet) => z.npcVa('josep', z.ineu.x + 60, z.ineu.y, fet) },
            { qui: 'Jusef', text: 'Això és per a tu: una llanterna. Als passadissos dels monjos hi fa una fosca que no perdona, i amb la seva llum hi veuràs.' },
            { fer: (z, fet) => z.objecteVola('josep', fet) },
            { avis: 'Has obtingut la LLANTERNA.' },
            { qui: 'Jusef', text: 'I un secret, per qui sap tornar un servei: aquella roda de carruatge del pati no és decoració. Darrere hi ha el túnel dels monjos cap a la Casa Gran. Però pesa com un carro ple.' }
        ],
        enAcabar: () => {
            E.posaFlag('josepVencut');
            if (!E.te('llanterna')) { E.dona('llanterna'); E.posaFlag('llanterna'); }
            const ui = game.scene.getScene('UI'); if (ui) ui.actualitzarHUD();
            E.posaObjectiu(!E.flag('runna') ? 'Has guanyat en Jusef. Segueix buscant Runna.'
                : E.te('guants') ? 'Empeny amb els Guants la roda de carruatge del Celler: amaga el túnel dels monjos (Runna en talla els esbarzers).'
                : 'La roda del Celler pesa massa: el Germà Francesc, a Sant Antoni, té uns guants que mouen el que pesa.');
        }
    }),

    josepPerdut: (E, abandonat) => ({
        pagines: [{ qui: 'Jusef', text: abandonat ? 'Ja te\'n vas? La taula no fuig. Torna quan vulguis.' : 'Bona partida, monjo. Però el servei encara és meu. Torna-hi quan vulguis: el July diu que la segona vegada sempre surt millor.' }],
        enAcabar: () => { if (!E.flag('josepVencut')) E.posaObjectiu('Guanya en Jusef a ping-pong, al Celler: parla-hi per jugar.'); }
    }),


    // ---------------- CEL·LES I TIL·LER ----------------
    neus: E => {
        if (E.flag("soparObert") && !E.flag("escudella")) {
            return {
                pagines: [
                    { qui: "Neus", text: "El sopar del Til·ler? Ai, Ineu, i qui té ganes de taula, aquest any! Amb tres nens que falten..." },
                    { qui: "Neus", text: "...Però el Til·ler té raó, maleït sigui. No es pot deixar de fer el que s'ha fet sempre, ni quan el cor fa mal. Pren l'escudella, i no la vessis!" },
                    { qui: "Neus", text: "Hi he posat una cullerada més, com cada any: la del que falta. Enguany n'hi he posat tres. Tu tingues-ne cura de portar-la sencera." },
                    { avis: "Has obtingut L'ESCUDELLA DE LA NEUS." }
                ],
                enAcabar: () => { E.dona("escudella"); E.posaFlag("escudella"); objectiuSopar(E); }
            };
        }
        return {
            pagines: [
                { qui: "Neus", text: "Ineu, fill, no t'hi quedis plantat! L'Huri i el Flami dormien aquí mateix, a Sant Benet, porta amb porta, i ara no hi són. I ningú no fa res!" },
                { qui: "Senyor Moliner", text: "Neus, deixa'l respirar..." },
                { qui: "Neus", text: "Tu calla, que ets tan pesat com el cafè d'ahir. Ineu, busca'ls." }
            ],
            enAcabar: () => E.posaFlag("parlatSantBenet")
        };
    },

    maritNeus: E => ({
        pagines: [
            { qui: 'Senyor Moliner', text: 'Sí, Neus. No, Neus. Ara vinc, Neus.' },
            { qui: 'Senyor Moliner', text: '...Ah, Ineu. Ets tu. Fes cas del que digui ella. Sempre té raó. Sempre.' }
        ]
    }),

    venerables: E => consellVenerables(E),

    // La Carry, anciana molt prima i pàl·lida de Nostra Senyora, vídua del campaner: busca el seu gos, el Pallofa, que passeja per Sant Antoni
    // un cop has parlat amb ella. En portar-li, et dona la clau del campanar i et conta com van desaparèixer l'Huri i el Flami.
    carry: E => {
        if (E.flag('pallofaTornat')) return { pagines: [
            { qui: 'Carry', text: "El Pallofa no em deixa ni a sol ni a ombra, ara. Gràcies, Ineu. I no t'oblidis del rellotge: sense hora, tot es fa més llarg." }
        ] };
        if (E.te('pallofa')) {
            const clau = senseClauCampanar(E);
            const pagines = [
                { qui: 'Carry', text: "Pallofa! Pallofa meu! On t'havies ficat, bestiola? Mira't: més prim que jo i ple de puces." },
                { qui: 'Carry', text: "Gràcies, Ineu, gràcies. Diners no en tinc, però et dec una cosa. Aquelles nits vaig veure, des de la finestra, el que no hauria de veure ningú." },
                { qui: 'Carry', text: "L'Huri, el petit de la porta de la dreta de Sant Benet, va ser el primer. El seu llit va quedar buit i la finestra, tancada per dins. Ell no sortia mai sol de nit: li feia por la fosca." },
                { qui: 'Carry', text: "La nit següent va ser el Flami, el de la porta de l'esquerra. El Pallofa va lladrar a la boira, com si veiés algú que jo no veia, i va marxar darrere seu. Per això he tingut tanta por." }
            ];
            if (clau) pagines.push(
                { qui: 'Carry', text: "El meu home era el campaner. Des que se'n va, la clau de la torre la guardo jo, i fa anys que ningú no hi puja. Pren-la. Aquell rellotge s'ha aturat a un quart de quatre, i ningú no s'ha adonat que el temps ja no passa." },
                { avis: 'Has obtingut la CLAU DEL CAMPANAR.' });
            return {
                pagines,
                enAcabar: () => {
                    E.treu('pallofa'); E.posaFlag('pallofaTornat');
                    if (clau) { E.dona('clau_campanar'); E.posaFlag('clauCampanar'); E.posaObjectiu("Amb la clau del campanar, obre la porta de la dreta del retaule del Santuari i puja a la torre del rellotge."); }
                    E.desar();
                }
            };
        }
        if (E.flag('carryParlat')) return { pagines: [
            { qui: 'Carry', text: "Encara no l'has vist? És petitó, prim i borni, i no sap estar-se quiet. Diuen que passeja per Sant Antoni, a llevant del Monestir. Agafa'l amb compte: està ple de puces." }
        ] };
        return {
            pagines: [
                { qui: 'Carry', text: "Ai, Ineu... no, no t'has de preocupar per mi. Bé, sí. Busco el Pallofa, el meu gos." },
                { qui: 'Carry', text: "És petit i prim, blanc amb taques marrons, i li falta un ull: diuen que se'l va menjar un gat. Va marxar fa tres nits, quan va pujar la boira, i no ha tornat." },
                { qui: 'Carry', text: "A ell li agrada passejar. Si el trobes, porta'l-me. Diners no en tinc, però a casa guardo una cosa que potser et farà falta." }
            ],
            enAcabar: () => { E.posaFlag('carryParlat'); E.posaObjectiu("Busca el Pallofa, el gos de la Carry: passeja per Sant Antoni, a llevant del Monestir. Porta'l a la Carry (Nostra Senyora, a l'oest de les Cel·les)."); E.desar(); }
        };
    },
    pallofa: E => ({
        pagines: [
            { qui: '', text: "Un gos petit, prim i borni, ple de puces, et mira amb l'únic ull que li queda. Al collaret de cuir hi ha una placa: «PALLOFA»." },
            { avis: 'Has agafat el PALLOFA. Duu-lo a la Carry.' }
        ],
        enAcabar: () => { E.dona('pallofa'); E.posaObjectiu("Duu el Pallofa a la Carry, a Nostra Senyora (a l'oest de les Cel·les)."); }
    }),

    tiller: E => {
        if (E.te("basto") && !E.flag("tutorialCombat")) { E.posaFlag("tutorialCombat"); E.posaFlag("combatActiu"); }   // partides velles
        if (!E.flag("parlatTiler")) {
            return {
                pagines: [
                    { qui: "El Gran Til·ler", text: "Fa tres-cents anys que vaig veure aquella gàbia baixar a la foscor, petit monjo." },
                    { qui: "El Gran Til·ler", text: "Sento que la terra s'esquerda a sota. Ja en surten, d'animalons dels vells cementiris, i no vénen amb bones intencions." },
                    { qui: "El Gran Til·ler", text: "El bastó de pelegrí aguanta per a un camí tranquil, però no et farà prou. Una branca meva ha caigut al peu del tronc: agafa-la, serà el teu bastó, més àgil i més ràpid." },
                ],
                enAcabar: () => {
                    E.posaFlag("parlatTiler"); E.posaFlag("tillerBranca");
                    E.posaObjectiu("Agafa la branca que ha caigut del Gran Til·ler (al peu de l'arbre).");
                }
            };
        }
        if (!E.te("basto_tiller")) {
            return { pagines: [{ qui: "El Gran Til·ler", text: "La branca és a terra, a prop de les meves arrels. Agafa-la, petit monjo." }] };
        }
        if (E.flag("soparFet")) {
            const pas = pistaRunna(E);
            const pagines = [{ qui: "El Gran Til·ler", text: "El permís és teu, petit monjo, i les espelmes continuen enceses. Recorda a taula qui hi falta." + (pas ? "" : " Que Runna et sigui lleu.") }];
            if (pas) pagines.push({ qui: "El Gran Til·ler", text: "Ara, per despertar l'espasa: " + pas });      // la pista, a part: tota junta no cabia a la caixa
            return { pagines };
        }
        if (E.flag("esquelles") && !E.flag("soparObert")) return DIALEGS.tillerSoparIntro(E);
        if (E.flag("soparObert") && !E.flag("soparFet")) {
            return (E.flag("escudella") && E.flag("floresIsidre") && E.flag("pastorsConvencuts"))
                ? DIALEGS.tillerSoparPreparat(E) : DIALEGS.tillerSoparFalta(E);
        }
        if (E.flag("bassadoriaNeta") && !E.flag("camiCirosaObert")) {
            return {
                pagines: [
                    { qui: "El Gran Til·ler", text: "Sento l'aigua cantar de lluny... La Bassadòria és neta. Has fet bé, petit monjo." },
                    { qui: "El Gran Til·ler", text: "El camí del nord-est cap a la Cirosa el vaig tancar jo amb les meves arrels, perquè la boira no hi pugés. Ara que l'aigua respira, pots passar: les arrels només reconeixen la meva branca. Colpeja-les amb ella i s'enfonsaran." },
                    { qui: "El Gran Til·ler", text: "A la Cirosa viuen uns pastors desterrats que guarden les esquelles dels seus avis: amb elles es van afinar els cants antics. Tracta'ls amb dolçor, que ja han patit prou. I vés amb compte: un monjo hi ha pujat aquests dies." }
                ],
                enAcabar: () => {
                    E.posaObjectiu("Colpeja amb la branca del Gran Til·ler les arrels que tanquen el camí del nord-est (a la dreta del Til·ler).");
                }
            };
        }
        return { pagines: [
            { qui: "El Gran Til·ler", text: "Et donaré el meu permís quan hagis tornat la vida a la terra que la boira ha emmalaltit. Has tornat l'aigua: encara en falta, de terra." },
        ] };
    },

    branca: E => ({
        pagines: [
            { fer: (z, fet) => { z.brancaAgafada = true; z.agafar(() => z.ineuAixeca('ineu_aixeca_tiler', fet), 'branca', 0xd8f0a0); } },
            { avis: "Has obtingut la BRANCA DEL TIL·LER!" },
            { fer: (z, fet) => z.ineuBaixa(fet) }
        ],
        enAcabar: () => {
            E.dona("basto_tiller");
            E.posaObjectiu("Tens la branca del Til·ler (més àgil). Segueix investigant: les Venerables Sàvies saben què et falta fer.");
        }
    }),


    pareAlcui: E => {
        const f1 = E.flag("fragment1"), f2 = E.flag("fragment2");
        if (E.flag("runna") && E.flag("relTretes") && !E.flag("tombaSegellada") && !E.flag("tombaLlegida")) {
            return {
                pagines: [
                    { qui: "Pare Alcuí", text: "Has baixat a la cripta, oi? Una clau de ferro, i la tomba dels monjos que no para de treure boira... Deixa'm mirar la Crònica." },
                    { fer: (z, fet) => z.npcVa('pare_alcui', 812, 372, fet, 120) },
                    { qui: "Crònica", text: "«Amb la llum de Runna van tancar la porta, i amb la mateixa llum van tancar la seva tomba. Mentre l'esquerda treu boira, la porta no és del tot closa.»" },
                    { qui: "Pare Alcuí", text: "La tomba és al Cementiri, darrere del Santuari i el Monestir. Colpeja l'esquerda amb Runna, fill." }
                ],
                enAcabar: () => { E.posaFlag("tombaLlegida"); E.posaObjectiu("Segella amb Runna la tomba esquerdada del Cementiri."); }
            };
        }
        if (E.flag("fragment3") && E.flag("benedicioMonjo") && !E.flag("saber")) {
            return {
                pagines: [
                    { qui: "Pare Alcuí", text: "Has parlat amb l'ombra, oi? Fa temps que ho sospitava. A la Crònica hi ha un marge que no vaig saber llegir: una paraula esborrada, de la mateixa mà que va escriure els fragments." },
                    { qui: "Pare Alcuí", text: "Amb el que m'expliques, ara ho entenc. «La foscor tem la llum, però més encara el riure.» Aquestes són les paraules que desperten Runna, fill: no és un conjur, és una veritat. Digues-les davant l'espasa, senceres i amb tot el cor." },
                    { avis: "Has après les PARAULES DEL SABER." }
                ],
                enAcabar: () => { E.posaFlag("saber"); E.posaObjectiu(DIALEGS.objectiuRunna(E)); }
            };
        }
        if (E.flag("fragment3")) {
            return { pagines: [{ qui: "Pare Alcuí", text: E.flag("saber") ? "Ja saps les paraules, fill. Ara només cal que arribi el dia de cridar-les." : "Els dos fragments expliquen el mateix, fill: algú vigila el segell des de fa segles. " + (pistaRunna(E) || "Ves a les Runes i no tinguis por de l'ombra.") }] };
        }
        if (f1 && f2) {
            return {
                pagines: [
                    { qui: "Pare Alcuí", text: "Has trobat els dos fragments! Deixa'm llegir-los... Sí. Ho explica la Crònica que guardo a la biblioteca: un monjo va segellar la foscor amb la llum de l'espasa Runna." },
                    { fer: (z, fet) => z.npcVa('pare_alcui', 812, 372, fet, 120) },
                    { qui: "Crònica", text: "«Des que la tercera església va quedar inacabada, l'ombra del monjo es veu clarament sobre el mur de les Runes: mig corbat, amb les mans unides, com si pregués. Apareix cada nit.»" },
                    { qui: "Pare Alcuí", text: "L'ombra del monjo... No fa mal a ningú, Ineu. Crec que és el monjo que va segellar la foscor amb la llum de Runna. Ves a veure'l, de nit, a les Runes." }
                ],
                enAcabar: () => { E.posaFlag("fragment3"); E.posaFlag("parlatAlcui"); E.posaObjectiu("Visita l'ombra del monjo a les Runes (a l'est de la plaça de les Runes, de nit)."); }
            };
        }
        return {
            pagines: [
                { qui: "Pare Alcuí", text: "Ineu, fill. Aquesta boira no és natural. Les boires d'aquí baixen de les muntanyes; aquesta puja de sota terra." },
                { qui: "Pare Alcuí", text: "Diuen que cada nit apareix l'ombra d'un monjo a les Runes. Hi ha dos fragments d'una crònica antiga escampats pel Santuari: un a les Runes i un altre al sagrari de l'església. Porta-me'ls i els llegirem junts." }
            ],
            enAcabar: () => E.posaFlag("parlatAlcui")
        };
    },

    // ---- L'ombra del monjo (Runes) ----
    ombraMonjo: E => {
        const fr = ["fragment1", "fragment2"].filter(x => E.flag(x)).length;
        if (E.flag("benedicioMonjo")) {
            return { pagines: [] };
        }
        if (fr < 2 || !E.flag("fragment3")) {
            return {
                pagines: [
                ]
            };
        }
        if (!E.flag("cantPedres")) {
            return {
                pagines: [
                    { fer: (z, fet) => z.ombraReacciona(fet) },
                    { qui: "Monjo", text: "Fa segles que no sento parlar cap llengua que no siguin les pedres. Només el cant de les pedres em desperta del tot." },
                    { qui: "Monjo", text: "Qui toca l'orgue el coneix. Aprèn-lo, petit monjo, i torna a cantar-me'l aquí." }
                ],
                enAcabar: () => {
                    E.posaFlag("ombraDemanaCant");
                    E.posaObjectiu("Aprèn el Cant de les Pedres amb la Pianista, al Santuari, i toca'l davant l'ombra del monjo.");
                }
            };
        }
        return {
            pagines: [
                { qui: "Ineu", text: "Toca el Cant de les Pedres amb la flauta: 3-1-2-1." }
            ]
        };
    },

    // Es llança quan l'Ineu toca el Cant de les Pedres davant l'ombra
    benedicioMonjo: E => ({
        pagines: [
            { fer: (z, fet) => z.ombraReacciona(fet) },
            { qui: "Monjo", text: "Jo era el qui va tancar la porta. Quan van obrir el cementiri, rient, els meus germans van deixar de descansar i el segell es va esquerdar." },
            { qui: "Monjo", text: "Sota terra hi ha una gàbia, petit monjo, i una cosa que no ha oblidat cap cant ni cap nen. Jo només puc vigilar. Tu pots tornar a tancar-ho." },
            { qui: "Monjo", text: "L'espasa dorm al sud-est, entre pedres, allà on el sol s'atura. Rep la meva benedicció, que no pesa ni es veu, i recorda: la foscor tem la llum, però més encara el riure." },
            { qui: "Monjo", text: "Jo només puc dir-te les paraules; el Pare Alcuí sabrà entendre-les. Quan les cridis davant l'espasa, la meva benedicció farà que et reconegui." },
            { avis: "Has rebut la BENEDICCIÓ DEL MONJO." }
        ],
        enAcabar: () => {
            E.posaFlag("benedicioMonjo");
            E.posaObjectiu("Troba Runna, al sud-est del Santuari, entre pedres, on el sol s'atura.");
        }
    }),

    // ---- Bassadòria ----
    bassadoriaNeta: E => ({
        pagines: [
            { qui: "Ineu", text: "Ha funcionat! L'aigua és neta..." }
        ],
        enAcabar: () => {
            E.posaFlag("bassadoriaNeta");
            E.posaObjectiu("La Bassadòria és neta. Segueix investigant: les Venerables Sàvies, a les Cel·les, et diran per on continuar.");
        }
    }),

    // ---------------- BOSC DE SANT JOAN ----------------
    fontSJ: E => {
        const herbes = ofrenesFont(E);
        if (E.flag('fontNeta')) {
            return { pagines: [] };
        }
        if (herbes === 3) {
            return {
                pagines: [
                    { fer: (z, fet) => z.seq([c => z.deixar(c, 'herba_sj'), c => z.deixar(c, 'romani'), c => z.deixar(c, null, 0xffd060)], fet) },
                    { qui: 'Ineu', text: 'Ha funcionat! Al fons de la pica hi ha un cristall que sembla de gel...' },
                    { avis: 'Has obtingut l\'AIGUA DE LA FONT DEL BISBE i un CRISTALL DE GEL.' }
                ],
                enAcabar: () => {
                    E.posaFlag('fontNeta'); E.treu('pruna'); E.dona('aigua_sj'); E.dona('cristall_gel'); E.posaFlag('cristallGel');
                    E.posaObjectiu('Porta l\'aigua de la Font del Bisbe a l\'Alzina Buida, la més grossa del bosc. (I guarda el Cristall de Gel: el Garf, a l\'Era, en sabrà fer alguna cosa.)');
                }
            };
        }
        return {
            pagines: [
                { qui: 'Ineu', text: 'Les Venerables Sàvies diuen que la nit de Sant Joan aquesta aigua guaria. Ara està morta... Hi ha unes lletres gravades a la pica: «Herba de Sant Joan, romaní i el fruit de l\'arbre d\'or.»' },
                { qui: 'Ineu', text: 'Les herbes de la Nit de Sant Joan fan llum: n\'hi ha una al nord (cap al Til·ler) i el romaní al sud-est, sempre en una clariana. I l\'arbre d\'or... és la Prunera Màgica, al jardí de l\'Hostatgeria! Una pruna.' },
                { avis: `Ofrenes trobades: ${herbes}/3.` }
            ],
            enAcabar: () => { E.posaFlag('fontVista'); E.posaObjectiu(objectiuFont(herbes)); }
        };
    },

    herba: (n, nom) => E => ({
        pagines: [{ avis: `Has trobat ${nom}!` }],
        enAcabar: () => {
            E.posaFlag('herba' + n);
            if (E.flag('fontVista')) E.posaObjectiu(objectiuFont(ofrenesFont(E)));
        }
    }),

    alzinaBuida: E => {
        if (E.flag("portalJaumeta")) {
            return { pagines: [
            ] };
        }
        if (E.te("aigua_sj")) {
            return {
                pagines: [
                    { qui: "Ineu", text: "Duc aigua de la Font del Bisbe. Potser..." },
                    { fer: (z, fet) => z.deixar(fet, null, 0x8fe0ff) },
                    { qui: "Veu del bosc", text: "...Qui ens porta... l'aigua... bona... Passa, passa, fill... Només la Jaumeta... sap on acabes." },
                ],
                enAcabar: () => { E.posaFlag("portalJaumeta"); E.posaObjectiu("Passa pel portal de l'Alzina Buida: la cabana de la Jaumeta, la bruixa del bosc, és a l'altra banda."); }
            };
        }
        return { pagines: [
            { qui: "Ineu", text: "Sento una veu allà dins... «Aigua... aigua de la Font del Bisbe...» Potser necessito l'aigua de la font d'aquí a prop." }
        ] };
    },

    cartellBosc: E => ({ pagines: [{ qui: "Cartell", text: "Bosc de Sant Joan.\n«Qui busca la font, que segueixi l'aigua... i qui no, que no es perdi.»" }] }),
    cartellCirosa: E => ({ pagines: [{ qui: "Cartell", text: E.flag("camiCirosaObert") ? "↑ La Cirosa (camí llarg, tot el camí a munt)\n← La Caseta\n↓ Les Cel·les" : "↑ La Cirosa\n← La Caseta" }] }),

    // ---------------- CARRUATGE VERD ----------------
    homeCarruatge: E => {
        const frases = [
            'Ssshh... ets el monjo, oi? No sé si ets el que busco, però m\'agrada com et mous.',
            'Em trobaràs per aquí i per allà. Camino amb el carruatge perquè d\'aquí dins sento les coses abans que passin.',
            'Aquesta boira... jo ja la vaig veure fa molts anys, quan era un nen. Aleshores, el carruatge era el meu pare.',
            'Un dia et diré què porto allà dins. Avui no. Encara no ho ets.'
        ];
        const n = E.dades.flags.carruatge || 0;
        return {
            pagines: [{ qui: 'Home del Carruatge Verd', text: frases[n % frases.length] }],
            enAcabar: () => E.posaFlag('carruatge', n + 1)
        };
    },

    // ---------------- CAMÍ DE LA DESAPARICIÓ ----------------
    columna: n => E => {
        const paraula = PARAULES_MISSATGE[n - 1], signe = SIGNES_MISSATGE[n - 1];
        const total = () => Array.from({ length: 12 }, (_, i) => E.flag('col' + (i + 1))).filter(Boolean).length;
        return {
            pagines: [
                { qui: 'Inscripció', text: `Columna ${n} de 12. Signe gravat: ${signe}` },
                { qui: 'Ineu', text: E.flag('col' + n)
                    ? `Ja el vaig apuntar: ${signe} vol dir «${paraula}».`
                    : `Sota el signe, amb lletra petita: «${paraula}». ${signe} = «${paraula}». Ho apunto.` },
                { avis: `Paraules apuntades: ${total() + (E.flag('col' + n) ? 0 : 1)}/12.` }
            ],
            enAcabar: () => {
                E.posaFlag('col' + n);
                if (total() === 12 && !E.flag('missatgeDesxifrat')) E.posaObjectiu('Tens les 12 paraules. Llegeix les taules de pedra de l\'Ermita de la Desaparició.');
                else if (total() < 12) E.posaObjectiu(`Segueix el camí de la Desaparició: columna ${n} (${total()}/12 paraules).`);
            }
        };
    },

    cartellCami: E => ({ pagines: [{ qui: 'Cartell', text: 'Camí de la Desaparició.\n"Qui segueix els passos, no torna sol."' }] }),

    // ---------------- ERMITA DE LA DESAPARICIÓ ----------------
    ermitaPorta: E => ({ pagines: [] }),
    taulaPedra: part => E => {
        const inici = part === 1 ? 0 : 6;
        const mots = [];
        for (let i = inici; i < inici + 6; i++) mots.push(E.flag('col' + (i + 1)) ? PARAULES_MISSATGE[i] : SIGNES_MISSATGE[i]);
        const totes = Array.from({ length: 12 }, (_, i) => E.flag('col' + (i + 1))).every(Boolean);
        const pagines = [{ qui: 'Inscripció', text: `Taula de pedra ${part} de 2:\n\n${mots.join('   ')}` }];
        if (totes) {
            pagines.push({ qui: 'Ineu', text: E.flag('missatgeDesxifrat') ? 'Quan la boira cobreixi el Miracle, els passos dels absents tornaran amb l\'alba.' : 'Ja ho tinc sencer. Això són paraules per dir en veu alta... davant l\'altar.' });
        } else {
            pagines.push({ qui: 'Ineu', text: 'Només entenc les paraules que he apuntat al camí. Els signes que em falten... són a les columnes.' });
        }
        return {
            pagines,
            enAcabar: () => {
                if (totes && !E.flag('missatgeDesxifrat') && !E.flag('cofreAltar')) E.posaObjectiu('Digues la frase sencera davant l\'altar de l\'ermita de la Desaparició.');
            }
        };
    },
    // L'Ineu s'acosta a l'altar i pronuncia la frase: apareix un cofre amb la clau del sagrari
    altarErmita: E => ({
        pagines: [
            { fer: (z, fet) => z.ineuVa(500, 350, fet, 150) },
            { qui: 'Ineu', text: '«Quan la boira cobreixi el Miracle, els passos dels absents tornaran amb l\'alba.»' },
            { fer: (z, fet) => z.apareixCofreAltar(fet) }
        ]
    }),
    cofreAltar: E => ({
        pagines: [
            { avis: 'Has obtingut la CLAU DEL SAGRARI.' },
            { qui: 'Ineu', text: 'La clau del sagrari del Santuari! Els monjos la van deixar aquí. Amb això obriré el sagrari del retaule.' }
        ],
        enAcabar: () => {
            E.posaFlag('missatgeDesxifrat');
            if (!E.te('clau_sagrari') && !E.flag('fragment2')) E.dona('clau_sagrari');
            if (!E.flag('fragment2')) E.posaObjectiu('Amb la clau petita, obre el sagrari del Santuari (al mig del retaule): guarda el fragment 2.');
        }
    }),
    sortidaErmita: E => ({ pagines: [{ qui: 'Cartell', text: '← L\'Era\n→ Camí de la Desaparició' }] }),
    creuDesaparicio: E => ({
        pagines: [
            { qui: 'Inscripció', text: "«Els qui se'n van no s'obliden; només esperen que algú els cridi pel nom.»" }
        ]
    }),

    // ---------------- L'ERA ----------------
    garf: E => {
        if (E.flag('telescopi')) {
            return { pagines: [{ qui: 'Garf', text: 'Mira bé les estrelles amb el telescopi, noi. Els Dipòsits són el millor mirador de la comarca... quan hi puguis arribar.' }] };
        }
        if (E.flag('cristallGel')) {
            return {
                pagines: [
                    { qui: 'Garf', text: 'Un cristall de gel de la Font del Bisbe! Fa anys que en buscava un. Dóna\'m una estona.' },
                    { fer: (z, fet) => z.seq([c => z.npcFeina('garf', 1800, 'guspires', c), c => z.npcSalta('garf', c, 1), c => z.objecteVola('garf', c, 'telescopi_mon')], fet) },
                    { qui: 'Garf', text: 'Un telescopi! Amb això veuràs coses que cap monjo no ha vist. Perquè no se\'t perdi: les estrelles fan camí.' },
                    { avis: 'Has obtingut el TELESCOPI DEL GARF.' }
                ],
                enAcabar: () => {
                    E.dona('telescopi'); E.posaFlag('telescopi'); E.treu('cristall_gel');
                    E.posaObjectiu('Porta el telescopi als Dipòsits (Rovellonera: sud, ponent i sud, seguint els rovellons; Sant Gabriel; i a llevant) i munta\'l al mirador.');
                }
            };
        }
        // Fins que l'Ineu no s'ha assegut al banc de davant, el Garf només l'hi convida
        const pagines = [{ qui: 'Garf', text: 'Mmm? Ah, un monjo! Seu, seu al banc de davant, que per xerrar s\'hi està millor. Soc el Garf, inventor. Tinc idees que ni jo entenc.' }];
        if (E.flag('garfBancSegut')) pagines.push({ qui: 'Garf', text: 'Si em portes un cristall de gel (n\'hi ha un a la Font del Bisbe, al bosc de l\'oest del Til·ler), et construiré un telescopi per mirar el cel.' });
        return { pagines };
    },
    cartellEra: E => ({ pagines: [{ qui: 'Cartell', text: '↑ Ermita de la Desaparició\n→ Hostatgeria\n← Rovellonera' }] }),

    // ---------------- JARDÍ ----------------
    isidre: E => DIALEGS.isidreBase(E),
    isidreBase: E => {
        if (E.flag("soparObert") && !E.flag("floresIsidre")) {
            return {
                pagines: [
                    { qui: "Isidre", text: "Sopar del Til·ler, eh? Cada any se n'omple el cap amb escudelles i s'obliden de les flors. Jo hi fico flors des que era jove." },
                    { fer: (z, fet) => { const i = z.npcs.isidre, x0 = i.x, y0 = i.y; z.seq([c => z.npcVa('isidre', x0 - 140, y0 - 30, c, 80), c => z.npcFeina('isidre', 1300, 'fulles', c), c => z.npcVa('isidre', x0, y0, c, 80), c => z.objecteVola('isidre', c, 'flors')], fet); } },
                    { qui: "Isidre", text: "Les flors de lluna són pels que falten. Posa-les al mig de la taula. Jo no podré ser-hi, que algú ha de quedar-se al jardí... però seré a cada pètal." },
                    { avis: "Has obtingut les FLORS DE L'ISIDRE." }
                ],
                enAcabar: () => { E.dona("flors_isidre"); E.posaFlag("floresIsidre"); objectiuSopar(E); }
            };
        }
        if (E.flag('mongesTrobades') && !E.flag('isidreSap')) {
            return {
                pagines: [
                    { qui: 'Isidre', text: 'He sentit com s\'obria la porta de l\'Hostatgeria. Són elles, oi? La Pains, la Phili, la Charm... les germanes de la meva dona.' },
                    { qui: 'Isidre', text: 'Tres nits tancades a vint passes de mi, i jo aquí amb les flors, sense saber-ne res. Ella em deia sempre: «cuida-les, que elles no saben cuidar-se».' },
                    { qui: 'Isidre', text: 'I el Sardi... el nostre Sardi. Té set anys, monjo. Cada tarda s\'enfilava a la prunera i es manxava de prunes fins a no poder dir ni mu. Si el trobes, digues-li que el seu pare no ha deixat de regar la prunera.' }
                ],
                enAcabar: () => E.posaFlag('isidreSap')
            };
        }
        if (E.flag('llosaOberta')) {
            return { pagines: [{ qui: 'Isidre', text: 'La flor de lluna ja ha florit sobre la llosa. No deixaré de cuidar-la.' }] };
        }
        if (E.te('llavorLluna')) {
            return {
                pagines: [{ qui: 'Isidre', text: 'Una Llavor de Lluna! Fa trenta anys que no en veia cap. Deixa-me-la, monjo, que encara sé cavar un clot.' }],
                enAcabar: () => {
                    E.treu('llavorLluna');
                    const z = Joc.zonaActiva(game.scene.getScene('UI'));
                    if (z && z.obrirLlosa) z.obrirLlosa(); else E.posaFlag('llosaOberta');
                }
            };
        }
        return {
            pagines: [
                { qui: 'Isidre', text: 'Bon dia, monjo! Aquesta pèrgola de pedra és més vella que el monestir: les columnes, els arcs... i l\'Hostatgeria, aquí al costat, que s\'hi aguanta al darrere.' },
                { qui: 'Isidre', text: 'Aquest jardí amaga una llosa que ningú no ha aixecat mai. Diuen que només s\'obre amb una flor de lluna, i la llavor, ves a saber... potser la gent de les cel·les en sap alguna cosa més, d\'aquesta llosa.' },
                { qui: 'Isidre', text: 'No et sorprenguis si em veus aquí cada dia, ni amb pluja. Aquest jardí, el Sardi el cuidava molt. Des que la boira se\'l va endur, el cuido jo perquè, quan torni, ho trobi tot tal com ho va deixar.' }
            ],
            enAcabar: () => { E.posaFlag('isidreSansa'); E.posaObjectiu('Pregunta a la gent de les Cel·les, al nord-est: potser en saben alguna cosa més de la llosa del jardí.'); }
        };
    },
    // La Sansa passa per les cel·les un sol cop: et ven la Llavor de Lluna i se'n va
    sansa: E => ({
        pagines: [
            { qui: 'Sansa', text: 'Verdures fresques, fruita de la rodalia! ...Ai, ets el monjo que pregunta per la llosa del jardí? Aleshores potser busques una cosa especial.' },
            { qui: 'Sansa', text: 'Una Llavor de Lluna. Fa anys que la guardo al fons del carro, entre les cebes, i no sé ni per què. Pren, és teva. Que floreixi a qui sàpiga cuidar-la.' },
            { avis: 'Has obtingut la LLAVOR DE LLUNA.' },
            { qui: 'Sansa', text: 'Bé, jo ja he d' + String.fromCharCode(39) + 'anar fent camí. Avui encara em queden tres pobles per davant. Adéu, monjo!' }
        ],
        enAcabar: () => { E.dona('llavorLluna'); E.posaFlag('llavorSansa'); E.posaObjectiu('Porta la Llavor de Lluna a l' + String.fromCharCode(39) + 'Isidre, a l' + String.fromCharCode(39) + 'Hostatgeria.'); }
    }),
    llosaJardi: E => ({
    }),
    prunera: E => {
        const pagines = [
            { qui: 'Isidre', text: '(des de la pèrgola) No te\'n facis un fart, monjo! Són prunes daurades, màgiques: una sola et deixa com nou. El meu Sardi en menjava deu cada tarda i no n\'hi tenia mai prou...' },
            { fer: (z, fet) => z.seq([c => z.agafar(c, null, 0xffd060), c => z.beure(c, 0xffd060)], fet) },
        ];
        const perFont = !E.flag('fontNeta') && !E.te('pruna') && !E.flag('herba3');
        if (perFont) pagines.push({ avis: 'Has obtingut una PRUNA DAURADA.' });
        return {
            pagines,
            enAcabar: () => {
                E.dades.vida = E.dades.corsMax * 2;
                if (perFont) { E.dona('pruna'); if (E.flag('fontVista')) E.posaObjectiu(objectiuFont(ofrenesFont(E))); }
            }
        };
    },
    hostatgeria: E => E.flag('mongesTrobades')
        ? { pagines: [{ qui: 'Charm', text: 'Entra, fill, que et farem una infusió.' }] }
        : { pagines: [] },
    sortidaMonges: E => ({ pagines: [] }),
    taulaRefetor: E => E.te('guants')
        ? { pagines: [{ qui: 'Ineu', text: 'Amb els Guants de Poder, aquesta taula no pesa tant...' }] }
        : { pagines: [
            { qui: 'Ineu', text: 'No la puc moure amb les mans soles. Ni dues persones... Necessito molta més força.' }] },
    // El mur d'esbarzers del passadís secret (Celler → Cambra secreta)
    murEsbarzers: E => ({ pagines: E.te('runna') ? [
        { qui: 'Ineu', text: "Runna els talla: situa't davant de cada un i ataca (ESPAI). Són cinc. Mata també les escolopendres, que després tornen." }
    ] : [
        { qui: 'Ineu', text: "Ni el bastó de pelegrí ni la branca del Til·ler no els tallen: només Runna. Primer cal despertar-la al Dolmen. Torna quan la tinguis." }
    ] }),

    esbarzersCapella: E => ({ pagines: [
        { qui: 'Ineu', text: 'El bastó no els talla. Només Runna ho aconsegueix.' }] }),

    // ---------------- LES SACERDOTESSES DE L'HOSTATGERIA ----------------
    monjaPains: E => {
        if (!E.flag('lliurePains')) return { pagines: [
            { qui: 'Ineu', text: 'Una música lleugera, de tres notes, potser la desperta. (Flauta: 1-2-3.)' }] };
        if (!E.flag('premiPains')) return {
            pagines: [
                { qui: 'Pains', text: 'Oh, mon petit! Quin cant més bonic... fa seixanta anys que no el sentia així. Jo sóc la Pains.' },
                { qui: 'Pains', text: 'La boira va entrar pel soterrani fa tres nits. Vaig veure un home amb abric d\'ocells que s\'enduia els nens del poble, rient baixet.' },
                { qui: 'Pains', text: 'Si passes pel jardí, saluda l\'Isidre, el marit de la nostra germana. Un bon home, amb el cor malmès des que ens va faltar el petit.' },
                { qui: 'Pains', text: 'Pren això, fill. El rosari d\'aquesta casa és vell i fort: que et doni una mica de la seva claror.' }
            ],
            enAcabar: () => premiMonja('Pains', 'premiPains')
        };
        return { pagines: [{ qui: 'Pains', text: 'Vés amb Déu, fill. La cadira em fa mal als ossos, però encara tinc bones orelles.' }] };
    },
    monjaPhili: E => {
        if (!E.flag('premiPhili')) return {
            pagines: [
                { qui: 'Phili', text: 'Per fi! Tres nits que colpejo aquesta porta! Soc la Phili, i no, no m\'he estat quieta ni un minut.' },
                { qui: 'Phili', text: 'T\'ho dic perquè ho vaig veure: el Germà Andreu, el de la pilota, baixava a la Taverna cada nit, al soterrani, amb una clau petita i rovellada. Mai no li he cregut el somriure.' },
                { qui: 'Phili', text: 'I si veus el Sardi, el meu nebot... digues-li que la tieta Phili ha après a no cridar tant. Només una mica.' },
                { qui: 'Phili', text: 'Aquí tens, per les molèsties. Que no se t\'acabin les forces!' }
            ],
            enAcabar: () => premiMonja('Phili', 'premiPhili')
        };
        return { pagines: [{ qui: 'Phili', text: 'Si necessites algú que miri amb els ulls ben oberts, ja saps on trobar-me.' }] };
    },
    monjaCharm: E => {
        if (!E.flag('premiCharm')) return {
            pagines: [
                { qui: 'Charm', text: 'Benvingut, fill de Déu. Sóc la Charm, la gran sacerdotessa d\'aquesta casa. Havíem perdut l\'esperança, però no la pregària.' },
                { qui: 'Charm', text: 'El nostre nebot, el Sardi, el fill de la nostra germana i de l\'Isidre, el jardiner d\'aquí al costat, passava aquí la tardor amb nosaltres. La nit que la boira ens va tancar a les cambres, el seu llit va quedar buit. Porta\'l a casa, fill: a ell, i a tots els altres.' },
                { qui: 'Charm', text: 'Als llibres d\'aquesta casa he llegit que l\'Ocellaire va robar el cant dels ocells, i que només aquest mateix cant obre la seva gàbia. Tu l\'aprendràs: la Pianista el recorda.' },
                { qui: 'Charm', text: 'Accepta el que podem donar: una mica de la nostra paciència.' }
            ],
            enAcabar: () => premiMonja('Charm', 'premiCharm')
        };
        return { pagines: [{ qui: 'Charm', text: 'Que la llum del Miracle t\'acompanyi, fill.' }] };
    },

    portaHostatgeria: E => ({ pagines: [] }),

    // ---------------- LA CIROSA ----------------
    // Els pastors de la Cirosa: desterrats, arruïnats i sense nom. No s'han de combatre.
    pastorA: E => ({
        pagines: E.flag("soparFet") ? [
            { qui: "Pastor", text: "M'han assegut a taula... M'han passat el pa. Fa cinquanta anys que ningú no em passava el pa." }
        ] : E.flag("pastorVencut") ? [
            { qui: "Pastor", text: "El ramat és de nou al corral. No sé com agrair-t'ho, monjo. Nosaltres només volem una mica de pau, i un racó on no ens miri ningú malament." }
        ] : [
            { qui: "Pastor", text: "No s'acosti gaire, pare, que la gent diu que portem mala sort. Només tenim el ramat... i un monjo ens l'ha pres, amb una cançó que no coneixem." }
        ]
    }),

    pastorB: E => ({
        pagines: E.flag("soparFet") ? [
            { qui: "Pastora", text: "Hi havia flors a la taula. Feia tant de temps que no veia flors a una taula." }
        ] : [
            { qui: "Pastora", text: "Teníem terres a la plana, i pous, i una casa amb llar de foc. Ho vam perdre tot, i el poble ens va girar l'esquena. Aquí dalt, almenys, no ens esquiven." },
            { qui: "Pastora", text: "No fem mal a ningú. Només intentem refer el que ens queda." }
        ]
    }),

    pastorVell: E => {
        if (!E.flag("pastorVencut")) {
            return {
                pagines: [
                    { qui: "Pastor vell", text: "Fill, aquell monjo no és mala persona: té una cosa dolenta dins. Els nostres avis van tancar fa segles una gàbia sota terra, i el poble ens va pagar amb oblit." },
                    { qui: "Pastor vell", text: "Si trobes la manera de treure-li aquesta cosa, ho agrairem. Hi ha unes esquelles que van ser dels nostres avis: te les donarem, però el ramat és a la pastura, i ell hi és." }
                ],
                enAcabar: () => E.posaObjectiu("Derrota el Pastor de Boira a la pastura de la Cirosa (porta de la tanca, a la dreta de la masia).")
            };
        }
        if (!E.te("esquelles")) {                    // (també si el senyal hi és però l'objecte no: es tornen a donar)
            return {
                pagines: [
                    { qui: "Pastor vell", text: "Has tornat el ramat... i li has tret la boira a aquell pobre home. Que Déu t'ho pagui, monjo." },
                    { qui: "Pastor vell", text: "Aquí tens les esquelles dels nostres avis. Que sonin amb la teva flauta, i que els cants antics et guiïn." },
                    { avis: "Has obtingut les ESQUELLES DELS PASTORS!" }
                ],
                enAcabar: () => {
                    E.dona("esquelles"); E.posaFlag("esquelles");
                    E.posaObjectiu("Torna a les cel·les i parla amb el Gran Til·ler: encara falta el seu permís.");
                }
            };
        }
        if (E.flag("soparFet")) {
            return { pagines: [{ qui: "Pastor vell", text: "Vam plorar a taula, monjo. Vam plorar com nens. Que l'arbre us beneeixi a tots, també als que no tenim nom." }] };
        }
        if (E.flag("soparObert") && !E.flag("pastorsConvencuts")) {
            return { pagines: [
                { qui: "Pastor vell", text: "Un sopar, dius? Al Til·ler? Amb els de les cel·les?... No, fill. Nosaltres no som gent per a asseure's amb la gent." },
                { qui: "Pastor vell", text: "Fa anys que no sentim música vora el foc. Si algú en toqués... potser ens recordaria que encara som persones." },
                { qui: "Ineu", text: "Tinc la flauta. Qualsevol cant val: tocaré el de l'Aurora vora el foc, i que sigui el que Déu vulgui." }
            ], enAcabar: () => E.posaObjectiu("Toca la flauta vora el foc dels pastors, a la Cirosa (qualsevol cant que sàpigues, com el de l'Aurora): acosta't a les flames i prem ESPAI quan brilli la flauta.") };
        }
        return { pagines: [{ qui: "Pastor vell", text: "Aquesta pastura torna a ser un lloc tranquil. Gràcies per això." }] };
    },

    // Es llança quan l'Ineu toca música vora la foguera dels pastors (durant el sopar del Til·ler)
    pastorsConvencuts: E => ({
        pagines: [
            { fer: (z, fet) => { ['pastor_a', 'pastor_vell', 'pastor_b'].forEach((k, i) => z.time.delayedCall(i * 300, () => { z.npcSalta(k, null, 1); z.bombolla(k, '♪', null, 1100); })); if (z.foc) z.tweens.add({ targets: z.foc, scale: z.foc.scale * 1.5, yoyo: true, duration: 600 }); z.esperar(1600, fet); } },
            { qui: "Pastora", text: "Havia oblidat que existia això..." },
            { qui: "Pastor vell", text: "Fa cinquanta anys que ningú no ens convidava enlloc, monjo. Ni a una missa, ni a una taula. I tu ens parles amb música." },
            { qui: "Pastor vell", text: "Vindrem. No direm gaire cosa, perquè no sabem com es fa. Però portarem pa. És el que sabem fer." },
            { avis: "Has obtingut el PA DELS PASTORS." }
        ],
        enAcabar: () => { E.posaFlag("pastorsConvencuts"); E.dona("pa_pastor"); objectiuSopar(E); }
    }),

    // ---------------- EL SOPAR DEL TIL·LER ----------------
    tillerSoparIntro: E => ({
        pagines: [
            { qui: "El Gran Til·ler", text: "Has portat música al lloc on feia anys que no n'hi havia. Això em fa pensar en el sopar." },
            { qui: "El Gran Til·ler", text: "Un cop l'any, a la tardor, la gent de les cel·les s'asseu sota les meves branques i menja plegada. Ho anomeneu el sopar del Til·ler. Jo no menjo, però escolto. Tota la saviesa d'un arbre és escoltar la gent que menja junta." },
            { qui: "El Gran Til·ler", text: "Aquest any ningú no té ganes de taula: tres cadires buides, i el poble amb por. La boira s'alimenta de la solitud, petit monjo. I no val a mitges: la taula ha d'estar plena." },
            { qui: "El Gran Til·ler", text: "Fa tres-cents anys, quan van tancar la gàbia, els pastors de la Cirosa s'asseien aquí amb els monjos i els pelegrins. Després els van foragitar, i van oblidar que també eren de la casa. Que vinguin ells. Que vingui el menjar de cada llar. I que hi hagi flors." },
            { qui: "El Gran Til·ler", text: "Porta l'escudella de la Neus, les flors de l'Isidre i els pastors de la Cirosa. Llavors, i només llavors, et donaré el meu permís." }
        ],
        enAcabar: () => { E.posaFlag("soparObert"); objectiuSopar(E); }
    }),

    tillerSoparFalta: E => ({
        pagines: [{ qui: "El Gran Til·ler", text: "La taula encara no és plena, petit monjo. Menjar sol és només alimentar-se; per això hem de ser tots." }],
        enAcabar: () => objectiuSopar(E)
    }),

    tillerSoparPreparat: E => ({
        pagines: [
            { qui: "El Gran Til·ler", text: "Ho has portat tot. Que es faci el sopar." },
        ],
        enAcabar: () => game.scene.getScene("ZonaTiller").fesSopar()
    }),

    // El ritual: s'encén una espelma per cada absent... i una per qui no té nom
    tillerSoparRitual: E => ({
        pagines: [
            { qui: "Neus", text: "Aquest any m'he descuidat de fer-hi cantar ningú. I a l'escudella hi he posat una cullerada de més, com cada any: la del que falta. Enguany n'hi he posat tres." },
            { qui: "Senyor Moliner", text: "...I jo hi he posat una altra per a ella. Per si de cas. Que no ho sàpiga." },
            { qui: "Les Venerables Sàvies", text: "Sempre fem el mateix, fill: una espelma per cada llar que té una cadira buida. Encén-la tu, que ets qui ho ha de portar a terme." },
            { fer: (z, fet) => z.encendreEspelmes([0, 1, 2], fet) },
            { qui: "Pastor vell", text: "I una quarta... per als que no tenen nom. Per als que ningú no va recordar. Si el pare ho permet." },
            { fer: (z, fet) => z.encendreEspelmes([3], fet) },
            { qui: "El Gran Til·ler", text: "Aquesta és la saviesa que et volia donar, petit monjo: ningú no es perd del tot mentre algú el recorda a taula. La gàbia de l'Ocellaire només s'omple de qui s'ha quedat sol." },
            { qui: "El Gran Til·ler", text: "Rep el meu permís. Que et sigui lleu, i que no et faci oblidar mai que vas menjar amb tots." },
            { fer: (z, fet) => z.fullaCau(fet) },
            { avis: "Has obtingut la FULLA DEL TIL·LER!" },
            { fer: (z, fet) => { ['sopar_pastor_a', 'sopar_pastor_b', 'sopar_pastor_vell'].forEach(k => z.bombolla(k, '♪', null, 1400)); z.esperar(1500, fet); } },
        ],
        enAcabar: () => {
            E.dona("fulla_tiler"); E.posaFlag("fullaTiler"); E.posaFlag("soparFet");
            E.treu("pa_pastor");
            E.posaObjectiu("Tens la Fulla del Til·ler. Ara falten el Saber del Pare Alcuí i la Benedicció, i trobar Runna al sud-est.");
            const z = game.scene.getScene("ZonaTiller");
            if (z && z.acabarSopar) z.acabarSopar();
        }
    }),

    espelmesTiller: E => ({
        pagines: [
        ]
    }),

    andreuPastor: E => ({
        pagines: [
            { fer: (z, fet) => z.seq([c => z.npcSalta('andreu', c, 1), c => z.llum(z.npcs.andreu.x, z.npcs.andreu.y - 90, 0xb88aff, c)], fet) },
            { qui: "Germà Andreu", text: "Ineu! Has pujat fins aquí... Mira'ls. Mira com em segueixen. Ningú no m'havia seguit mai." },
            { qui: "Germà Andreu", text: "El Mestre m'ho va prometre: «Tots els que tinguin por et seguiran.» Jo no el trobo a faltar: l'admiro. I ara sóc el seu pastor. El PASTOR!" },
            { qui: "Ineu", text: "Andreu, això que et parla no és bo. Encara pots tornar enrere." },
            { qui: "Germà Andreu", text: "Tornar enrere? Mai! El Mestre em va veure, quan ningú més no ho feia. Calla! Be-e-e!" }
        ],
        enAcabar: () => game.scene.getScene("ZonaCirosa").iniciarBoss()
    }),

    andreuDerrotat: E => ({
        pagines: [
            { fer: (z, fet) => z.andreuAgenollat(fet) },
            { qui: "Germà Andreu", text: "Has guanyat aquesta, monjo... Fa trenta anys que ningú no em mirava, i ell sí. Mai no li fallaré." },
            { qui: "Germà Andreu", text: "El Mestre és sota la Taverna, i ja és despert. Vine, si goses: els nens ja són seus, i jo només sóc el primer dels seus ocells." },
            { fer: (z, fet) => z.andreuMarxa(fet) },
            { qui: "Ineu", text: "(«Sota la Taverna»... Ara ja sé on mirar.)" }
        ],
        enAcabar: () => {
            E.posaFlag("pastorVencut");
            E.posaFlag("portaGirgolesVista");
            E.posaObjectiu("Parla amb el pastor vell de la Cirosa: t'ha de donar les esquelles dels seus avis.");
        }
    }),

    // ---------------- ROVELLONERA: LA NENA DE LES TRENES ----------------
    nenaTrenes: E => {
        const n = ["llac1", "llac2"].filter(f => E.flag(f)).length;
        if (E.flag("nenaAlliberada")) {
            return { pagines: [] };
        }
        if (!E.flag("nenaVista")) {
            return {
                pagines: [
                    { qui: "Nena de les Trenes", text: "No et facis enrere, si us plau... No vull espantar ningú. Només que, quan arriba algú, sempre fuig." },
                    { qui: "Nena de les Trenes", text: "Vaig venir a collir rovellons amb la mare. Ella deia que els rovellons creixen sempre vora el bon camí, i que qui se'n fia no es perd mai pel bosc. Em vaig perdre perquè em vaig oblidar de mirar a terra." },
                    { qui: "Nena de les Trenes", text: "Em va lligar les dues trenes amb dos llaços rosa, i em vaig perdre pel bosc. Fa molts, molts anys. No he pogut marxar d'aquí." },
                    { qui: "Nena de les Trenes", text: "Els llaços van caure mentre corria, i les pedres els van colgar: un és aquí al camí, sota una roca grossa a la vora, i l'altre a la Rovellonera, a la primera clariana, sota una altra pedra. Sense ells, no sento les mans de la mare. Si me'ls tornessis a lligar..." },
                    { qui: "Ineu", text: "Els trobaré. Et prometo que no hauràs de plorar sola." }
                ],
                enAcabar: () => {
                    E.posaFlag("nenaVista");
                    E.posaObjectiu("Troba els dos llaços de la Nena de les Trenes, colgats sota pedres: un sota una roca del camí; l'altre sota una pedra de la primera clariana de la Rovellonera. Empeny-les i porta-li'ls.");
                }
            };
        }
        if (n < 2) {
            const pista = n === 0 ? "Són sota les pedres: un aquí al camí, sota una roca que cal empènyer... i l'altre a la Rovellonera, sota una pedra de la primera clariana."
                : E.flag("llac1") ? "El del camí ja el tens! Falta el de la Rovellonera: és sota una pedra de la primera clariana, entre els pins."
                : "El del bosc ja el tens! Falta el del camí, sota una roca grossa a la vora: empeny-la.";
            return { pagines: [{ qui: "Nena de les Trenes", text: "Has trobat " + n + " dels 2 llaços. " + pista + " Jo m'espero." }] };
        }
        return {
            pagines: [
                { qui: "Nena de les Trenes", text: "Els has trobat... Els dos? Oh, monjo..." },
                { fer: (z, fet) => z.seq([c => z.ineuVa(z.nena.x + 70, z.nena.y + 10, c), c => { z.ajupir('ineu'); z.llum(z.nena.x, z.nena.y - 60, 0xffc8e0, c); }], fet) },
                { qui: "Nena de les Trenes", text: "Les sento... Sento les mans de la mare! Mare...? Mare, ets tu? M'has trobat?" },
                { fer: (z, fet) => z.mareNena(fet) },
                { qui: "Nena de les Trenes", text: "Gràcies, monjo. Ja no tinc por. Aquí et deixo un dels meus llaços: guarda't amb ell, que també protegeix els que es perden." },
                { avis: "Has obtingut el LLAÇ DE LA NENA." }
            ],
            enAcabar: () => {
                E.posaFlag("nenaAlliberada"); E.posaFlag("trenesNena"); E.dona("cinta_nena"); E.treu("llac_nena");
                E.posaObjectiu("Segueix el camí cap al sud-oest: la Rovellonera, Sant Gabriel, els Dipòsits i, a l'extrem sud-est, el Dolmen.");
            }
        };
    },

    llac: k => E => ({
        pagines: [{ avis: "Has trobat un llaç de la nena (" + (["llac1", "llac2"].filter(f => E.flag(f) || f === "llac" + k).length) + "/2)." }],
        enAcabar: () => {
            E.posaFlag("llac" + k); E.dona("llac_nena");
            const n = ["llac1", "llac2"].filter(f => E.flag(f)).length;
            E.posaObjectiu(n < 2 ? (k === 1 ? "Troba el segon llaç de la Nena de les Trenes (1/2): és sota una pedra de la primera clariana de la Rovellonera; empeny-la." : "Troba el segon llaç de la Nena de les Trenes (1/2): és pel camí, sota una roca grossa que cal empènyer.") : "Ja tens els dos llaços: porta-los a la Nena de les Trenes, a la corba del camí.");
        }
    }),

    // ---------------- SANT GABRIEL ----------------
    altarGabriel: E => ({
        pagines: [
            ...(E.flag("calze") ? [] : [{ avis: "Has obtingut el CALZE DE ROSADA." }]),
            { fer: (z, fet) => z.beure(fet, 0xd8e8ff) },
        ],
        enAcabar: () => {
            if (!E.flag("calze")) { E.dona("calze"); E.posaFlag("calze"); }
            E.dades.vida = E.dades.corsMax * 2;
            const z = Joc.zonaActiva(game.scene.scenes[0]);
            if (z) z.flotant(z.ineu.x, z.ineu.y - 150, "✦ Rosari ple", "#ffd894");
        }
    }),

    telescopiMon: E => {
        if (E.flag("estelLlorenc")) {
            return { pagines: [] };
        }
        if (E.flag("estelsFets")) {
            return { pagines: [{ qui: "Ineu", text: "L'últim estel s'ha apagat damunt del dipòsit de llevant. Hi ha una llum a l'aigua: he d'anar-hi." }] };
        }
        if (!E.te("telescopi")) {
            return { pagines: [
                { qui: "Ineu", text: "Em falta un telescopi. El Garf, a l'Era, segur que en sap construir un." }
            ] };
        }
        return {
            pagines: [
                { fer: (z, fet) => z.deixar(fet, 'telescopi_mon', 0xd8e8ff) },
                { qui: "Ineu", text: "Diuen que per Sant Llorenç el cel plora. Compta les llàgrimes... i potser et mostraran alguna cosa." }
            ],
            enAcabar: () => { E.posaFlag("telescopiMuntat"); game.scene.start("Estels"); }
        };
    },

    // La llum que ha deixat l'últim estel a l'aigua del dipòsit de llevant
    estelDiposit: E => ({
        pagines: [
            { fer: (z, fet) => z.agafar(fet, null, 0x8fc8ff) },
            { avis: "Has obtingut l'ESTEL DE SANT LLORENÇ." },
            { qui: "Ineu", text: "Fa la mateixa claror que els set estels... Diuen que la boira no gosa tocar la llum de Sant Llorenç. El camí del Dolmen, a llevant, n'és ple." }
        ],
        enAcabar: () => {
            E.posaFlag("estelLlorenc"); E.dona("estel_llorenc");
            E.posaObjectiu("Porta l'Estel de Sant Llorenç a la boira que tapa el camí del Dolmen, a llevant dels Dipòsits.");
            E.desar();
        }
    }),

    // La boira que tapa el camí del Dolmen: només l'aparta la llum de l'Estel de Sant Llorenç
    boiraDolmen: E => E.te("estel_llorenc")
        ? { pagines: [
        ] }
        : { pagines: [
            { qui: "Ineu", text: "Aquí no s'hi veu res. Em caldria una llum que la boira no pogués apagar..." }
        ] },

    // ---------------- DOLMEN ----------------
    dolmen: E => {
        const falta = [];
        if (!E.flag("fullaTiler")) falta.push("el permís del Til·ler (la Fulla)");
        if (!E.flag("saber")) falta.push("les Paraules del Saber (Pare Alcuí)");
        if (!E.flag("benediccio")) falta.push("la Benedicció del prior (Pare Jordi)");
        if (falta.length) {
            return { pagines: [
                { qui: "Ineu", text: "Em falta: " + falta.join(", ") + ". Quan ho tingui, tornaré." }
            ] };
        }
        // Tot és acció: l'Ineu s'agenolla, la Fulla vola a la pedra, crida la paraula i Runna s'allibera (ZonaDolmen.despertarRunna)
        return {
            pagines: [
                { fer: (z, fet) => z.despertarRunna(fet) },
                { qui: "Runna", text: "Fa molt que dormo. Hi torna a haver una gàbia, oi? Anem-hi." },
                { qui: "Ineu", text: "Runna... Em parles al cap!" },
                { qui: "Runna", text: "Feia tres-cents anys que ningú no em deia que el riure espanta la foscor. Es veu que encara és veritat." }
            ],
            enAcabar: () => {
                E.dona("runna"); E.posaFlag("runna");
                const ui = game.scene.getScene("UI"); if (ui) ui.missatge("Runna: 2 de dany. Talla els esbarzers negres.");
                E.posaObjectiu("Torna al Santuari: la Pianista t'ha d'ensenyar l'últim cant, el Cant del Miracle.");
            }
        };
    },

    dolmenBuit: E => ({
        pagines: []
    }),

    objectiuRunna: E => {
        const falta = [];
        if (!E.flag("saber")) falta.push("les Paraules del Saber (Pare Alcuí)");
        if (!E.flag("benediccio")) falta.push("la Benedicció del Pare Jordi");
        if (!E.flag("fullaTiler")) falta.push("la Fulla del Til·ler (sopar)");
        return falta.length ? "Per despertar Runna falta: " + falta.join(", ") + "." : "Ho tens tot: ves al Dolmen (sud-est, passats els Dipòsits) i desperta Runna.";
    },

    // ---------------- NENA DE LES TRENES (sense creu) ----------------
    // (la missió es resol parlant-hi: l'Ineu li lliga els llaços a les trenes)

    cercleRovellonera: E => ({
        pagines: E.flag("portalJaumeta") ? [
            { qui: "Ineu", text: "És l'altra banda del portal de la Jaumeta. Si hi entro, arribaré a la seva cabana." }
        ] : [
            { qui: "Ineu", text: "Estrany... Em fa la sensació que és una porta, però no sé de què." }
        ]
    }),

    portalTornada: E => ({
        pagines: []
    }),

    cofreBosc: E => {
        if (E.flag("cofreBosc")) return { pagines: [] };
        return {
            pagines: [
                { qui: "Nota", text: "«Per al qui vingui amb l'espasa.»" },
                { fer: (z, fet) => z.seq([c => z.agafar(c, null, 0xffb8c8), c => z.beure(c, 0xffb8c8)], fet) },
                { avis: "+1 GRA AL ROSARI i rosari ple." }
            ],
            enAcabar: () => { E.posaFlag("cofreBosc"); E.dades.corsMax += 1; E.dades.vida = E.dades.corsMax * 2; }
        };
    },

    // ---------------- LA CASA GRAN ----------------
    portaReixa: E => ({
        pagines: [
            { qui: "Ineu", text: E.flag("reixaObertaDins") ? "Per dins hi ha la barra aixecada, però les cadenes de fora no cedeixen. Aquí no s'hi entra." : "Fa generacions que ningú no obre això. Haurà d'haver-hi una altra manera d'entrar-hi." }
        ]
    }),

    // Reixa del porxo vista des de l'escalinata (per dins només hi ha una barra de ferro)
    reixaDins: E => ({
        pagines: [
            { fer: (z, fet) => { z.cameras.main.shake(250, 0.004); z.agafar(fet, null, 0x8a8a90); } },
            { qui: "Ineu", text: "(Ara puc sortir a la plaça per aquí. De fora, la reixa continua tancada.)" }
        ],
        enAcabar: () => E.posaFlag("reixaObertaDins")
    }),

    // Cambra secreta dels monjos (sala del tresor, entre el Celler i la Casa Gran)
    cofreCambra: E => {
        if (E.flag("cofreCambra")) return { pagines: [] };
        return {
            pagines: [
                { avis: "Has obtingut el PERGAMÍ DEL MONJO." },
                { qui: "Ineu", text: "«La clau de ferro és sota l'escala, murada amb els meus germans. Un guardià de pedra la vigila d'esquena: ningú no hi baixa fins que no et mira a la cara.»" },
                { qui: "Ineu", text: "I al revers, amb una altra lletra: «Qui busqui sortida, que alci la bóta marcada amb la creu.»" }
            ],
            enAcabar: () => {
                E.dona("pergami_monjo"); E.posaFlag("cofreCambra");
                E.posaObjectiu("Alça la bóta de la creu vermella, a la cambra, per obrir la porta del fons i pujar a l'escalinata de la Casa Gran.");
            }
        };
    },

    // La bóta marcada de la cambra secreta: en alçar-la, deixa a la vista l'anella que obre la porta del fons
    botaTresor: E => ({
        pagines: [{ qui: "Ineu", text: "Una bóta amb una creu vermella. Pesa molt menys que les altres... i a sota hi ha una anella de ferro." }],
        enAcabar: () => { E.posaFlag("botaAlcada"); E.posaObjectiu("Puja a l'escalinata de la Casa Gran per la porta del fons de la cambra: fes girar el cap de l'Home del Raïm amb el volant de la base fins que et miri a la cara."); }
    }),

    homeRaimInt: E => ({
        pagines: [
            { qui: "Ineu", text: "Mira cap amunt i de costat, com si vigilés el balcó de sobre l'escala. Sembla que guardi alguna cosa." },
        ]
    }),


    // ---------------- LA CABANA DE LA JAUMETA ----------------
    // La Jaumeta, bruixa del bosc: una curiositat. Hi vas pel portal de l'Alzina Buida i et diu la pista del moment (és vident)
    jaumeta: E => {
        const pista = pistaActual(E).replace(/^Fill, /, "");
        if (!E.flag("jaumetaVista")) {
            return {
                pagines: [
                    { fer: (z, fet) => z.seq([c => z.npcFeina('jaumeta', 1400, 'bombolles', c), c => z.bombolla('jaumeta', '!', c, 700)], fet) },
                    { qui: "La Jaumeta", text: "Ei! Tu! Qui coi t'ha dit que podies entrar? Els frares no veniu mai per aquí! Fot el camp o et faig créixer bolets a les orelles!" },
                    { qui: "Ineu", text: "Perdoni... He arribat per l'alzina. Duc aigua de la Font del Bisbe." },
                    { qui: "La Jaumeta", text: "Aigua... de la Font del Bisbe?! Dona'm aixòooo! Fa trenta anys que no en tinc ni una gota neta." },
                    { fer: (z, fet) => z.seq([c => z.npcVa('jaumeta', 500, 360, c, 200), c => z.llum(450, 290, 0x6aff6a, c), c => z.npcVa('jaumeta', 560, 420, c, 200)], fet) },
                    { qui: "La Jaumeta", text: "Mmm... collonut. Ets tonto, xaval, però ets bo. Els ocells i les guineus xerren, i jo ho sento tot: busques el Gran Til·ler, oi? No és al nord de sempre, com et diuen: és al nord de les Cel·les, i han tapat el camí amb una boira que no marxa amb el vent." },
                    { qui: "La Jaumeta", text: "Mira, he barrejat l'aigua que queda amb farigola, romaní i herba de Sant Joan. Aquest beuratge fa fugir la boira dolenta. No te'l beguis, eh! Aboca'l sobre la boira i prou, que si no et sortiran bolets." },
                    { avis: "Has obtingut el BEURATGE DE LA JAUMETA." }
                ],
                enAcabar: () => {
                    E.treu("aigua_sj"); E.posaFlag("jaumetaVista"); E.dona("beuratge");
                    E.posaObjectiu("Aboca el beuratge de la Jaumeta a la boira que tapa el camí al nord de les Cel·les: duu al Gran Til·ler.");
                }
            };
        }
        return { pagines: [
            { qui: "La Jaumeta", text: "Ja tornes, xaval? Els ocells m'ho diuen tot. Escolta: " + pista },
            { qui: "La Jaumeta", text: "Ara fot el camp, que tinc feina amb la sopa. I no li diguis a ningú on visc, o et converteixo en bolet." }
        ] };
    },

    // La boira que tapa el camí al Til·ler (nord de les Cel·les)
    boiraTiller: E => E.te("beuratge") ? {
        pagines: [
            { fer: (z, fet) => z.deixar(fet, null, 0x6aff6a) },
            { qui: "Ineu", text: "Ha funcionat! El camí del Gran Til·ler torna a ser net." }
        ]
    } : {
        pagines: [
            { qui: "Ineu", text: "No hi puc passar... Aquesta boira no és de les que marxen amb el vent. Algú que en sàpiga, de bruixeries, potser la Jaumeta, del bosc, tindria alguna cosa per desfer-la." }
        ]
    },

    // Les arrels del Til·ler que tanquen el camí de la Cirosa (s'enfonsen davant la branca del mateix arbre)
    arrelsTiller: E => {
        if (!E.te("basto_tiller")) {
            return { pagines: [
                { qui: "Ineu", text: "Són les arrels del Gran Til·ler. El bastó de pelegrí no les mourà... però potser reconeixerien una branca del mateix arbre." }
            ] };
        }
        if (!E.flag("bassadoriaNeta")) {
            return { pagines: [
                { fer: (z, fet) => { z.deixar(() => { z.cameras.main.shake(200, 0.003); fet(); }, 'branca', 0xd8f0a0); } },
                { qui: "Ineu", text: "Les arrels s'han estremit en reconèixer la branca, però no s'enfonsen. Sembla que esperen alguna cosa: potser que l'aigua clara de la Bassadòria torni a respirar." }
            ] };
        }
        return { pagines: [
            { fer: (z, fet) => z.deixar(fet, 'branca', 0xd8f0a0) },
        ] };
    },


    // El cofre de les joguines de la caseta: la maneta d'en Jordi és a sota
    cofreManeta: E => {
        if (E.te("maneta") || E.flag("maneta")) {
            return { pagines: [] };
        }
        if (!E.flag("jordiManeta")) {
            return { pagines: [
                { qui: "Ineu", text: "No és meva... Millor preguntar a en Jordi abans d'agafar-la." }
            ] };
        }
        return {
            pagines: [
                { fer: (z, fet) => z.agafar(fet, null, 0x8a8a90) },
                { avis: "Has obtingut la MANETA." }
            ],
            enAcabar: () => {
                E.dona("maneta"); E.posaFlag("maneta");
                if (E.flag("cofreCambra")) E.posaObjectiu("Porta la maneta al volant de ferro de l'Home del Raïm, al mig de l'escalinata de la Casa Gran.");
            }
        };
    },

    // ---------------- EL CEMENTIRI ----------------
    tombaMonjos: E => ({
        pagines: [{ qui: "Ineu", text: "«Aquí reposen els qui van tancar la porta.»" }],
        enAcabar: () => E.posaFlag("tombaVista")
    }),

    creuCementiri: E => {
        const gravat = { qui: "Ineu", text: "«Els monjos del Miracle, d'ara i d'abans.»" };
        if (E.te("ram")) return {
            pagines: [gravat,
                { fer: (z, fet) => z.deixar(fet, 'flors', 0xffd8e8) },
            ],
            enAcabar: () => { E.treu("ram"); E.posaFlag("florsCreu"); E.posaObjectiu("Torna a Sant Antoni: el Germà Francesc t'ha de donar una cosa."); }
        };
        return { pagines: [gravat] };
    },

    lapida: n => E => {
        const mots = [
            "«Fra Anselm, † 1893. Va plantar el primer til·ler que no es va morir.»",
            "«Mare Teresa de la Creu. Va cantar fins a l'últim dia. Ara canta d'una altra manera.»",
            "«Germà Bru. No va dir mai res de res, i tothom l'estimava.»",
            "«Aquí reposa un pelegrí que no va arribar a veure el Santuari. Que el vegi ara.»",
            "«Fra Valeri, ortolà. Les tomaqueres l'han trobat a faltar.»",
            "«Un monjo sense nom, trobat a la cripta. Que algú li doni un nom, almenys al cel.»",
            "«Pare Quirze, bibliotecari. Va ensenyar a llegir més gent que ningú.»"
        ];
        return { pagines: [{ qui: "Làpida", text: mots[n % mots.length] }] };
    }
};
