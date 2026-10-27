/**
 * DIÀLEGS (extrets de GUIO.md)
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

function consellTieta(E, qui) {
    return { pagines: [{ qui, text: "Ai, fill, torna a seure. A veure... " + pistaActual(E) }] };
}

// Objectiu viu del sopar del Til·ler: diu què falta
function objectiuSopar(E) {
    const f = [];
    if (!E.flag("escudella")) f.push("l'escudella de la Neus");
    if (!E.flag("floresIsidre")) f.push("les flors de l'Isidre (Hostatgeria)");
    if (!E.flag("pastorsConvencuts")) f.push("convèncer els pastors de la Cirosa (toca música vora el seu foc)");
    E.posaObjectiu(f.length ? "El sopar del Til·ler: falta " + f.join(", ") + "." : "Tot a punt: torna al Gran Til·ler per al sopar.");
}

// Cada monja allibera dona un gra més al rosari (+1 cor) i, quan les tres són lliures, l'Hostatgeria obre la porta per dins
function premiMonja(nom, flag) {
    const E = Estat;
    E.posaFlag(flag);
    E.dades.corsMax += 1; E.dades.vida = E.dades.corsMax * 2;
    const ui = game.scene.getScene('UI');
    if (ui) { ui.actualitzarHUD(); ui.notifica('+1 gra al rosari: ' + nom); }
    if (E.flag('premiPains') && E.flag('premiPhili') && E.flag('premiCharm')) {
        E.posaFlag('mongesTrobades');
        E.posaObjectiu("Les tres monges són lliures i han obert la porta de l'Hostatgeria per dins: hi ha un lloc de repòs al vestíbul.");
    } else {
        const f = ['Pains', 'Phili', 'Charm'].filter(n => !E.flag('premi' + n));
        E.posaObjectiu('Allibera les monges que falten: ' + f.join(', ') + '.');
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
                    { qui: "Pare Jordi", text: "No et vull espantar. Fa tres nits que una boira lila surt de sota terra, i cada nit falta un nen: l'Uri i el Flam, de les cel·les de Sant Benet, porta amb porta; i aquesta nit, el Sardin, el nebot de les monges de l'Hostatgeria." },
                    { qui: "Pare Jordi", text: "Ningú no els ha vist marxar. Els llits són desfets i les finestres, tancades per dins. Només queda una olor de terra mullada... i, diu la Neus, un piular d'ocells que no se sap d'on ve." },
                    { qui: "Pare Jordi", text: "Tu tens bons ulls i bon cor. Parla amb tothom i explica-m'ho tot." },
                    { qui: "", text: "Has obtingut el CLAUER DE NOVICI!\nObre la biblioteca i les cel·les." },
                    { qui: "Pare Jordi", text: "I abans de marxar, passa a saludar el Germà Andreu, al costat dels xiprers: sempre té la butxaca plena de coses. Ves amb compte pels camins, Ineu." }
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
                    { qui: "", text: "Has rebut la BENEDICCIÓ DEL PARE JORDI." }
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
                { qui: "Pare Jordi", text: "Les bestioles han sortit pels camins, Ineu. Fins i tot alguns visitants vagaregen com sonàmbuls. No els facis mal de debò: només fes-los dormir." },
                { qui: "Pare Jordi", text: "I torna abans que es faci fosc." }
            ] };
        }
        return {
            pagines: [
                { qui: "Pare Jordi", text: "Parla amb la gent: les famílies de les cel·les, els germans, la Pianista... Algú haurà vist alguna cosa." },
                { qui: "Pare Jordi", text: "Si et perds, les Tietes de les cel·les sempre tenen un bon consell." }
            ]
        };
    },

    germaAndreu: E => {
        if (!E.flag('bastoObtingut')) {
            return {
                pagines: [
                    { qui: 'Germà Andreu', text: 'Ineu! Quin drama, oi? Tothom corrent amunt i avall...' },
                    { qui: 'Germà Andreu', text: 'Segur que els nens s\'han amagat per jugar. Jo els entenc, eh... Tantes pregàries, tant de silenci...' },
                    { qui: 'Germà Andreu', text: 'Ei, vine. Pren aquest bastó de pelegrí: era d\'un vell que ja no el vol. Va bé per a tot, fins i tot per anar a collir bolets.' },
                    { qui: '', text: 'Has obtingut el BASTÓ DE PELEGRÍ!\nAtac: J o ESPAI (cap on mires).' },
                    { qui: 'Germà Andreu', text: 'I vés amb compte, eh. Amb els visitants, que van com sonàmbuls, i amb les escolopendres: piquen que no et pots ni imaginar. No les facis mal de debò: només fes-les adormir.' },
                    { qui: 'Germà Andreu', text: 'Ets del Barça, tu? Tinc uns cromos que els nens es moren per tenir. Ells sí que m\'escolten.' },
                    { qui: 'Ineu', text: '(El Germà Andreu sembla molt tranquil. Massa tranquil.)' }
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

    bassadoria: E => E.flag("bassadoriaNeta") ? ({
        pagines: [{ qui: "", text: "La Bassadòria, clara com el cristall. Les flors de la Creu, al costat, comencen a aixecar el cap." }]
    }) : ({
        pagines: [
            { qui: "", text: "La Bassadòria, al costat de la Creu de l'Aparició." },
            { qui: "Ineu", text: "L'aigua sempre ha estat clara... Ara és tèrbola i fa olor de soterrani. I en surten aquests gripaus enverinats i una boira lila, a glopades." }
        ]
    }),

    creu: E => ({
        pagines: [
            { qui: '', text: 'La Creu de l\'Aparició. Sempre hi ha flors fresques als seus peus.' },
            { qui: 'Ineu', text: 'Avui les flors estan pansides. Com si la boira se\'n begués el color.' }
        ]
    }),

    reixa: E => ({
        pagines: [
            { qui: 'Ineu', text: 'Per aquesta reixa del terra surt boira. És freda com el gel... i sembla que respiri.' }
        ]
    }),

    cartellPlaca: E => ({ pagines: [{ qui: '', text: "↑ Runes\n← Casa Gran\n↓ La Bassadòria" }] }),
    pedraSecreta: E => E.flag('tresorObert') ? {
        pagines: [{ qui: '', text: 'La pedra ha girat i deixa un pas estret. Una escala baixa a un passatge fosc.' }]
    } : {
        pagines: [
            { qui: '', text: 'El camí mor contra un mur de pedra vella. Una de les pedres és de color diferent de les altres, i quan hi passes la mà sembla que vibri.' },
            { qui: 'Ineu', text: 'Aquesta pedra no hi pertany... Com si esperés una veu. Potser un cant de pedres la desvetlli.' }
        ]
    },
    pedraSecretaOberta: { pagines: [
        { qui: '', text: 'El Cant de les Pedres ressona al mur. La pedra tremola, gira lentament i deixa a la vista un passatge secret.' },
        { qui: 'Ineu', text: 'Un passatge entre el Monestir i el Santuari! Els monjos antics sí que en sabien, d\'amagar coses.' }
    ] },
    cofreTresor: E => {
        if (E.flag('cofreTresor')) return { pagines: [{ qui: '', text: 'El cofre és obert i buit. Les espelmes encara cremen, com si algú les cuidés.' }] };
        return {
            pagines: [
                { qui: '', text: 'Un cofre vell, de bisagres rovellades, vigilat per dues espelmes que ningú no recorda haver encès.' },
                { qui: '', text: 'A dins, un flascó de vidre amb un líquid daurat i una nota: «Per al qui sap escoltar les pedres.»' },
                { fer: (z, fet) => z.seq([c => z.agafar(c, null, 0xf0c040), c => z.beure(c, 0xf0c040)], fet) },
                { qui: "", text: "+1 GRA AL ROSARI i rosari ple." }
            ],
            enAcabar: () => { E.posaFlag('cofreTresor'); E.dades.corsMax += 1; E.dades.vida = E.dades.corsMax * 2; }
        };
    },

    // El Ciscu, el fill de la Carmen, s'ha escapat a la cabana amagada a jugar al solitari
    ciscu: E => {
        // La clau rovellada: al Germà Andreu li va caure a la porta de ferro, i el Ciscu se la va quedar
        const clau = [
            { qui: 'Ciscu', text: 'I mira què vaig trobar: una nit, al Germà Andreu li va caure aquesta clau davant la porta de ferro, i no se n\'adonà. És petita i rovellada. Me la vaig quedar per jugar a pirates.' },
            { qui: 'Ciscu', text: 'Té, a tu et servirà més que a mi. Però no diguis a la mare que jo era a fora de nit!' },
            { qui: '', text: 'Has obtingut la CLAU ROVELLADA: petita, de ferro vell, amb un ocell gravat a l\'anella.' }
        ];
        const donar = () => { E.posaFlag('ciscuTrobat'); E.posaFlag('clauGirgoles'); E.dona('clau_girgoles'); };
        if (!E.flag('ciscuTrobat')) return {
            pagines: [
                { fer: (z, fet) => z.seq([c => z.bombolla('ciscu', '!', c, 600), c => z.npcSalta('ciscu', c, 1)], fet) },
                { qui: 'Ciscu', text: 'No diguis res a la mare! Sóc el Ciscu, el de la Carmen, la de la Taverna. Des que hi ha boira, ella dorm tot el dia i l\'Eva em fa fregar gots.' },
                { qui: 'Ciscu', text: 'Aquí ningú no em busca i puc jugar al solitari tranquil. Les cartes són de l\'avi. Li falta el set d\'oros, però faig veure que hi és.' },
                { qui: 'Ciscu', text: 'De nit he vist el Germà Andreu picar tres cops a la porta de ferro de darrere la Taverna, la del soterrani. No té clau, d\'aquesta: la porta s\'obre sola, com si de dins l\'esperessin. A baix n\'hi ha una altra, amb un pany petit.' },
                ...clau
            ],
            enAcabar: donar
        };
        if (!E.flag('clauGirgoles')) return { pagines: clau, enAcabar: donar };
        return { pagines: [
            { qui: 'Ciscu', text: E.flag('relIquiesRetornades') ? 'Ja m\'ha sortit el solitari! Bé, una mica. He fet una trampa petita amb el set d\'oros de paper. No ho diguis.' : 'Encara no m\'ha sortit. La sota d\'espases sempre queda a sota de tot... com jo a la Taverna.' },
            { qui: 'Ciscu', text: 'Si veus la mare, no li diguis on sóc. Bé... si et pregunta molt, sí.' }
        ] };
    },

    solitari: E => ({ pagines: [{ qui: '', text: 'Un solitari a mig fer amb la baralla espanyola de l\'avi. Falta el set d\'oros: algú n\'hi ha dibuixat un en un paper.' }] }),

    cofreCabanaCami: E => {
        if (E.flag('cofreCabanaCami')) return { pagines: [{ qui: '', text: "El cofre és obert i buit. Només queda l'olor de fusta vella i de cera." }] };
        return {
            pagines: [
                { qui: '', text: "Una cabana de llenyataire oblidada, amagada entre els arbres. La pols és una catifa grisa, menys al voltant de la taula, on algú hi juga a cartes." },
                { qui: '', text: "Al fons, un cofre petit. A dins, un flascó daurat embolicat amb un drap i una nota gastada: «Per a qui es perd pel camí i el troba.»" },
                { fer: (z, fet) => z.seq([c => z.agafar(c, null, 0xf0c040), c => z.beure(c, 0xf0c040)], fet) },
                { qui: "", text: "+1 GRA AL ROSARI i rosari ple." }
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
                    { qui: 'Pare Daniel', text: 'Ah, i una cosa que em preocupa: el rellotge del campanar s\'ha aturat a les tres i quart, la nit que va arribar la boira. La porta de la dreta del retaule puja per la torre fins a la Sala del Rellotge. Jo ja no tinc l\'esquena per a tants graons, però tu... mira què hi passa.' }
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
        if (!E.flag('rellotgeReparat') && !E.flag('rellotgeDit')) {
            return {
                pagines: [
                    { qui: 'Pare Daniel', text: 'Ei, Ineu, una cosa més que em preocupa: el rellotge del campanar s\'ha aturat a les tres i quart, la nit que va arribar la boira. I no hi ha manera de saber quina hora és, ni de posar-hi remei.' },
                    { qui: 'Pare Daniel', text: 'Té, la clau de la porta de la dreta del retaule: puja per la torre fins a la Sala del Rellotge. Jo ja no tinc l\'esquena per a tants graons, però tu... mira què hi passa, i a veure si algú pot fer-lo caminar.' }
                ],
                enAcabar: () => E.posaFlag('rellotgeDit')
            };
        }
        if (!E.flag('rellotgeReparat')) {
            return { pagines: [{ qui: 'Pare Daniel', text: 'La Sala del Rellotge, fill: la porta de la dreta del retaule, i torre amunt. Si algú el fa caminar de nou, potser la boira s\'ho pensarà dues vegades.' }] };
        }
        return { pagines: [{ qui: 'Pare Daniel', text: 'Sents el rellotge, Ineu? Torna a caminar! Fa tres nits que no el sentia. Els nens em diuen que canto massa fort, però avui no cal: ho fa ell per mi!' }] };
    },
    // Sagrari del Retaule Major: hi ha el fragment 2 de la llegenda del monjo. És tancat amb una clau petita que és a l'ermita de la Desaparició (premi del missatge de les dotze columnes).
    sagrari: E => {
        if (E.flag("fragment2")) return { pagines: [{ qui: "", text: "El sagrari, tancat de nou amb la clau petita. A dins hi ha quedat el lloc buit on era el pergamí." }] };
        if (!E.te("clau_sagrari")) {
            return {
                pagines: [{ qui: "", text: "Al mig del retaule, el sagrari de fusta daurada. La porteta és tancada amb una clau molt petita. Potser el Pare Daniel sap on és." }],
                enAcabar: () => E.posaFlag("sagrariVist")
            };
        }
        return {
            pagines: [
                { fer: (z, fet) => z.agafar(fet, 'pergami', 0xf2e6c8) },
                { qui: "", text: "Fragment 2 de 2:\n«El monjo va guardar el segell fins al darrer dia. Des d'aleshores la seva ombra torna cada nit al mur de les Runes a vigilar. Les relíquies dels seus germans, i amb elles la clau de ferro, són on ell les va deixar, sota la mirada d'un guardià de pedra.»" },
                { qui: "", text: "«Qui busqui la clau, que no oblidi mai on neix el sol.»" }
            ],
            enAcabar: () => E.posaFlag("fragment2")
        };
    },

    // ---------------- MONESTIR ----------------
    // ---------------- CASA GRAN ----------------
    homeRaim: E => ({
        pagines: [
            { qui: '', text: 'L\'Home del Raïm, a les escalinates de la Casa Gran. Té un carràs de raïm a les mans...' },
            { qui: 'Ineu', text: '...i el cap posat del revés. Sembla que vigili alguna cosa a la seva esquena.' }
        ]
    }),

    // ---------------- RUÏNES I PING-PONG ----------------
    ruines: E => ({
        pagines: [
            { qui: '', text: "Les Les Runes. Murs i arcs que mai no es van acabar de construir." },
            { qui: '', text: "Entre dues pedres, un pergamí esquinçat (fragment 1 de 2):\n«Quan l'Ocellaire va ser tancat a la seva gàbia, un monjo va segellar la porta de ferro amb la llum de Runna i la va deixar dormint a la pedra. Després va amagar la clau i les relíquies dels monjos morts allà on ningú no les trobés.»" },
            { qui: 'Ineu', text: "Falta l'altre fragment. Potser a l'església... I cada nit, diuen, a aquest mur s'hi veu l'ombra d'un monjo." },
            ...(E.flag('fragment1') ? [] : [
                { fer: (z, fet) => z.aparicioOmbra ? z.aparicioOmbra(fet) : fet() },
                { qui: '', text: "De cop, el cel s'enfosqueix. Sobre el mur de les Runes es dibuixa l'ombra d'un monjo corbat, amb les mans unides, com si pregués. No hi ha ningú que la projecti." },
                { qui: 'Ineu', text: "Ha aparegut en llegir el pergamí... És el monjo del segell? El Pare Alcuí ha de veure això: li duré els dos fragments." }
            ])
        ],
        enAcabar: () => E.posaFlag('fragment1')
    }),

    cartellRuinesPingpong: E => ({ pagines: [{ qui: '', text: "← Camí de la Desaparició\n→ Cementiri\n↑ Cel·les\n↓ Plaça" }] }),

    juli: E => ({
        pagines: [
            { qui: 'Juli', text: 'Ineu! Sabies que el ping-pong és física pura? Efecte Magnus, rebot, fricció... i els angelets de la samarreta són de l\'edició limitada.' },
            { qui: 'Juli', text: 'El meu pare, en Frederic, juga amb una pala de pedra. De pedra! I em guanya igualment. Frikis de mena. (Segons ell, la pala és igual: «el que compta és el que portes dins».)' },
            { qui: 'Juli', text: 'En Josep és el millor de la sala, i només es pot vèncer d\'una manera: tornant-li el servei. Quan et fa el servei màgic ensenya tres carrils: memoritza\'ls i repeteix-los en ordre. Tens dos intents, i et deixa mirar-ho una altra vegada. Quan encertes l\'ordre, l\'Ineu li torna la pilota.' }
        ]
    }),

    frederic: E => E.te("runna") && !E.flag("josepVencut") && !E.flag("cofreCambra") ? {
        pagines: [
            { qui: 'Frederic', text: "Ei, noi. Portes una espasa que no és de ferro, eh? Ja veig que vens a preguntar." },
            { qui: 'Frederic', text: "Però al Celler hi ha una norma més vella que jo: els secrets es guanyen a la taula. Guanya en Josep i parlarem." }
        ],
        enAcabar: () => E.posaObjectiu("Guanya en Josep a ping-pong, al Celler: el Frederic t'explicarà què amaga la roda.")
    } : E.te("runna") && !E.flag("cofreCambra") ? {
        pagines: [
            { qui: 'Frederic', text: "Ei, noi. Veig que portes una espasa que no és de ferro. Això canvia el que et volia dir." },
            { qui: 'Frederic', text: "Aquest lloc es diu el Celler per alguna cosa: era el celler de la Casa Gran, la casa vella dels monjos. Els monjos hi van fer un túnel que va a la casa sense que ningú el vegi." },
            { qui: 'Frederic', text: "Aquella roda de carruatge no és decoració: al darrere hi ha un túnel que va a la Casa Gran. Però pesa com un carro ple, i amb els braços sols no la mouràs." },
            { qui: 'Frederic', text: E.te("guants") ? "Aquests guants que portes... són els dels picapedrers dels monjos! Amb això, empeny-la des d'un costat, caminant-hi en contra." : "El Germà Francesc, del Monestir, que passeja cada dia per Sant Antoni, guarda els guants dels picapedrers dels monjos. Amb ells, la roda cediria." },
            { qui: 'Frederic', text: "Allà baix hi ha una clau de ferro que els monjos van perdre fa segles: la de la porta de ferro de sota la Taverna. Fes-ne bon ús." }
        ],
        enAcabar: () => {
            E.posaFlag("fredericRoda");
            E.posaObjectiu(E.te("guants") ? "Empeny la roda de carruatge del Celler (a les Runes): amaga un passadís cap a la Casa Gran."
                                          : "Demana els guants dels picapedrers al Germà Francesc (passeja per Sant Antoni, a llevant del Monestir) i empeny la roda del Celler.");
        }
    } : ({
        pagines: [
            { qui: 'Frederic', text: 'Calma, noi. La pilota no s\'ha de perseguir, s\'ha d\'esperar.' },
            { qui: 'Frederic', text: 'Jo jugo amb una pala de pedra. De pedra, sí: pesa com un maó i no té goma ni res. Quan jugueu a la taula, no em veuràs ni a mi ni la pala; no cal.' },
            { qui: 'Frederic', text: 'Perquè amb què es juga és igual. La pala només és la mà allargada. El que compta és l\'esperit del joc que portes dins: el talent, o la màgia, que a la teva edat és gairebé el mateix.' },
            { qui: 'Frederic', text: 'I la teva màgia funciona així: mira per quin carril ve la pilota. Bota a la taula i s\'enlaira: quan és al punt més alt, el cercle es posa verd (ja pots) i blau (perfecte). Llavors colpeja-la, i prem EL CARRIL DE LA PILOTA: l\'Ineu hi anirà i la pilota en sortirà d\'allà mateix.' },
            { qui: 'Frederic', text: 'Si prems un altre carril, l\'Ineu s\'hi mou i fa el gest a l\'aire, però no la toca: perds un instant. Només perds el punt si la pilota et passa de llarg. Això és tot.' }
        ]
    }),

    eloi: E => ({
        pagines: [
            { qui: 'Eloi', text: 'Mira qui ha vingut a perdre el temps. Soc l\'Eloi, el segon millor de la sala. I el primer, si no fos per aquell servei absurd d\'en Josep.' },
            { qui: 'Eloi', text: E.flag('josepVencut') ? 'Has guanyat en Josep? Sort, segur. Jo també ho hauria fet si no m\'hagués cansat escalfant.' : 'Vols jugar? Primer m\'he d\'escalfar... Però el repte important no és el meu: és el d\'en Josep. Parla-hi.' }
        ]
    }),

    josep: E => E.flag('josepVencut') ? {
        pagines: [
            { qui: 'Josep', text: 'Ningú no m\'havia tornat el servei en vint anys. Ni l\'Eloi. Ja no et regalaré res, però la taula és teva quan vulguis.' },
            { qui: 'Josep', text: 'Vols jugar un altre partit?' },
            { fer: (z, fet) => z.ui().triar(['Sí', 'No'], i => { DIALEGS._triaPP = i; fet(); }) }
        ],
        enAcabar: () => { if (DIALEGS._triaPP === 0) game.scene.start('PingPong'); DIALEGS._triaPP = null; }
    } : {
        pagines: [
            { qui: 'Josep', text: 'Aquest és el meu servei. Ningú no l\'ha tornat mai. Ni l\'Eloi, per molt que presumeixi.' },
            { qui: 'Josep', text: 'Aquí al Celler les coses es guanyen a la taula. Si vols que la gent d\'aquí et parli de debò, guanya\'m: un sol partit, a set punts.' },
            { qui: '', text: 'COM ES JUGA (1/3). La pilota ve per un dels tres carrils de la taula. Un cercle groc es fa petit fins a l\'anell d\'aquell carril. Quan l\'atrapa, prem el carril: ← ↓ → (o A S D, o els tres botons de sota). L\'Ineu es desplaça fins al carril, colpeja amb la pala i la pilota torna des d\'allà mateix.' },
            { qui: '', text: 'COM ES JUGA (2/3). La pilota bota a la teva meitat de la taula i s\'enlaira: quan és al punt més alt, el cercle es posa VERD (ja pots colpejar) i BLAU (cop perfecte: en Josep gairebé mai no la torna). Cal prémer EL CARRIL DE LA PILOTA: si prems un altre, l\'Ineu hi va i fa el gest a l\'aire, però no la toca. Perds el punt només si la pilota et passa de llarg.' },
            { qui: '', text: 'COM ES JUGA (3/3). Quan en Josep serveix, el servei màgic ensenya tres carrils, un a un: memoritza\'ls i repeteix-los en ordre (dos intents). Quan serveixes tu, prem el carril des d\'on vols servir: l\'Ineu hi va i la pilota en surt d\'allà. Set punts, i cal guanyar de dos.' }
        ],
        enAcabar: () => game.scene.start('PingPong')
    },

    josepGuanyat: E => E.flag('josepVencut') ? ({
        pagines: [
            { qui: 'Josep', text: 'Un altre cop me l\'has tornat... El servei és teu, noi. Quan vulguis, tornem-hi.' }
        ]
    }) : ({
        pagines: [
            { qui: 'Josep', text: '...Me l\'has tornat. El servei. Me l\'has tornat de debò.' },
            { qui: 'Juli', text: 'HO SABIA! Efecte Magnus, Josep! Física pura!' },
            { qui: 'Frederic', text: 'Bon partit, noi. Ara sí: vine, que t\'he de dir una cosa.' },
            { fer: (z, fet) => z.seq([c => z.npcVa('josep', z.ineu.x + 60, z.ineu.y, c), c => z.objecteVola('josep', c)], fet) },
            { qui: 'Josep', text: 'Pren-la. Al Celler en teníem per als passadissos dels monjos: allà baix hi fa una fosca que no perdona.' },
            { qui: '', text: 'Has obtingut la LLANTERNA: hi veuràs millor a les zones fosques.' }
        ],
        enAcabar: () => {
            E.posaFlag('josepVencut');
            if (!E.te('llanterna')) { E.dona('llanterna'); E.posaFlag('llanterna'); }
            const ui = game.scene.getScene('UI'); if (ui) ui.actualitzarHUD();
            E.posaObjectiu(E.flag('runna') ? 'Parla amb el Frederic, al Celler: ara et dirà el que sap.' : 'Has guanyat en Josep. Segueix buscant Runna.');
        }
    }),

    josepPerdut: (E, abandonat) => ({
        pagines: [{ qui: 'Josep', text: abandonat ? 'Ja te\'n vas? La taula no fuig. Torna quan vulguis.' : 'Bona partida, monjo. Però el servei encara és meu. Torna-hi quan vulguis: el Juli diu que la segona vegada sempre surt millor.' }],
        enAcabar: () => { if (!E.flag('josepVencut')) E.posaObjectiu('Guanya en Josep a ping-pong, al Celler: parla-hi per jugar.'); }
    }),

    taulaPP: E => ({ pagines: [{ qui: '', text: E.flag('josepVencut') ? 'La taula on vas guanyar en Josep. Encara hi ha la marca de la pilota, al cantell.' : 'Una taula de ping-pong. Per jugar-hi, parla amb en Josep: és ell qui mana a la sala.' }] }),

    // ---------------- CEL·LES I TIL·LER ----------------
    neus: E => {
        if (E.flag("soparObert") && !E.flag("escudella")) {
            return {
                pagines: [
                    { qui: "Neus", text: "El sopar del Til·ler? Ai, Ineu, i qui té ganes de taula, aquest any! Amb tres nens que falten..." },
                    { qui: "Neus", text: "...Però el Til·ler té raó, maleït sigui. No es pot deixar de fer el que s'ha fet sempre, ni quan el cor fa mal. Pren l'escudella, i no la vessis!" },
                    { qui: "Neus", text: "Hi he posat una cullerada més, com cada any: la del que falta. Enguany n'hi he posat tres. Tu tingues-ne cura de portar-la sencera." },
                    { qui: "", text: "Has obtingut L'ESCUDELLA DE LA NEUS." }
                ],
                enAcabar: () => { E.dona("escudella"); E.posaFlag("escudella"); objectiuSopar(E); }
            };
        }
        return {
            pagines: [
                { qui: "Neus", text: "Ineu, fill, no t'hi quedis plantat! L'Uri i el Flam dormien aquí mateix, a Sant Benet, porta amb porta, i ara no hi són. I ningú no fa res!" },
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

    tieta1: E => consellTieta(E, 'Tieta Enriqueta'),
    tieta2: E => consellTieta(E, 'Tieta Lola'),

    yordi: E => ({ pagines: [{ qui: 'Yordi', text: 'Hola, Ineu! Si veus la meva germana Judit, digues-li que em deu un gelat.' }] }),
    judit: E => ({ pagines: [{ qui: 'Judit', text: 'Bon dia! Jo no li dec cap gelat a en Yordi. Que ho sàpigues.' }] }),
    danielT: E => ({ pagines: [
        { qui: 'Daniel', text: 'Ineu... L\'Uri, el nen de la porta de la dreta, va ser el primer. Fa tres nits el seu llit era buit i la finestra, tancada per dins. Ell no sortia mai sol de nit: li feia por la fosca.' },
        { qui: 'Daniel', text: 'La nit següent va ser el Flam, el de la porta de l\'esquerra. Jo em quedo amb el Turbo, el meu nebot: no el deixo sortir d\'aquí.' }
    ] }),
    turbo: E => ({ pagines: [{ qui: 'Turbo', text: 'L\'Uri em va dir que els ocells de nit canten el seu nom. Jo no els he sentit mai. Però jo corro més que tu!' }] }),

    tiller: E => {
        if (E.te("basto") && !E.flag("tutorialCombat")) { E.posaFlag("tutorialCombat"); E.posaFlag("combatActiu"); }   // partides velles
        if (!E.flag("parlatTiler")) {
            return {
                pagines: [
                    { qui: "", text: "El Gran Til·ler. L'escorça forma una cara antiga i serena. Les fulles tremolen sense vent." },
                    { qui: "El Gran Til·ler", text: "Fa tres-cents anys que vaig veure aquella gàbia baixar a la foscor, petit monjo." },
                    { qui: "El Gran Til·ler", text: "Sento que la terra s'esquerda a sota. Ja en surten, d'animalons dels vells cementiris, i no vénen amb bones intencions." },
                    { qui: "El Gran Til·ler", text: "El bastó de pelegrí aguanta per a un camí tranquil, però no et farà prou. Una branca meva ha caigut al peu del tronc: agafa-la, serà el teu bastó, més àgil i més ràpid." },
                    { qui: "", text: "Una branca llarga i recta descansa a terra, a prop de l'arbre." }
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
            return { pagines: [{ qui: "El Gran Til·ler", text: "El permís és teu, petit monjo, i les espelmes continuen enceses. Recorda a taula qui hi falta." + (pas ? " Ara, per despertar l'espasa: " + pas : " Que Runna et sigui lleu.") }] };
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
                    { qui: "El Gran Til·ler", text: "El camí del nord-est cap a la Cirosa el vaig tancar jo amb una bardissa viva, perquè la boira no hi pugés. Ara que l'aigua respira, pots passar: la bardissa només reconeix la meva branca. Acosta-l'hi." },
                    { qui: "El Gran Til·ler", text: "A la Cirosa viuen uns pastors desterrats que guarden les esquelles dels seus avis: amb elles es van afinar els cants antics. Tracta'ls amb dolçor, que ja han patit prou. I vés amb compte: un monjo hi ha pujat aquests dies." },
                    { qui: "", text: "Al fons, el camí que puja cap al nord-est és tancat per una bardissa de punxes negres." }
                ],
                enAcabar: () => {
                    E.posaObjectiu("Aparta la bardissa del camí del nord-est (a la dreta del Til·ler) amb la branca del Gran Til·ler.");
                }
            };
        }
        return { pagines: [
            { qui: "El Gran Til·ler", text: "Et donaré el meu permís quan hagis tornat la vida a la terra que la boira ha emmalaltit. Has tornat l'aigua: encara en falta, de terra." },
            ...(pistaRunna(E) ? [{ qui: "", text: "(" + pistaRunna(E) + ")" }] : [])
        ] };
    },

    branca: E => ({
        pagines: [
            { fer: (z, fet) => z.agafar(fet, 'branca', 0xd8f0a0) },
            { qui: "", text: "Has obtingut el BASTÓ DE TIL·LER!\nTambé ataca amb J o ESPAI, però més ràpid i amb més abast." }
        ],
        enAcabar: () => {
            E.dona("basto_tiller");
            E.posaObjectiu("Tens el bastó de Til·ler (més àgil). Segueix investigant: les Tietes saben què et falta fer.");
        }
    }),


    pareAlcui: E => {
        const f1 = E.flag("fragment1"), f2 = E.flag("fragment2");
        if (E.flag("fragment3") && E.flag("benedicioMonjo") && !E.flag("saber")) {
            return {
                pagines: [
                    { qui: "Pare Alcuí", text: "Has parlat amb l'ombra, oi? Fa temps que ho sospitava. A la Crònica hi ha un marge que no vaig saber llegir: una paraula esborrada, de la mateixa mà que va escriure els fragments." },
                    { qui: "Pare Alcuí", text: "Amb el que m'expliques, ara ho entenc. «La foscor tem la llum, però més encara el riure.» Aquestes són les paraules que desperten Runna, fill: no és un conjur, és una veritat. Digues-les davant l'espasa, senceres i amb tot el cor." },
                    { qui: "", text: "Has après les PARAULES DEL SABER:\n«La foscor tem la llum, però més encara el riure.»" }
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
                    { qui: "Pare Alcuí", text: "Has trobat els dos fragments! Deixa'm llegir-los... Sí. Ho explica la Crònica que guardo a la biblioteca: un monjo va segellar la foscor amb la llum de Runna." },
                    { fer: (z, fet) => z.npcVa('pare_alcui', 812, 372, fet, 120) },
                    { qui: "", text: "Al marge de la Crònica, amb la mateixa lletra dels fragments:\n«Des que la tercera església va quedar inacabada, l'ombra del monjo es veu clarament sobre el mur de les Runes: mig corbat, amb les mans unides, com si pregués. Apareix cada nit.»" },
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
            return { pagines: [{ qui: "", text: "L'ombra del monjo continua pregant, immòbil, sobre el mur. Quan t'acostes, aixeca una mica el cap i torna a baixar-lo, com un adéu." }] };
        }
        if (fr < 2 || !E.flag("fragment3")) {
            return {
                pagines: [
                    { qui: "", text: "Sobre el mur de les Runes, l'ombra d'un monjo corbat, amb les mans unides. No hi ha ningú que la projecti." },
                    { qui: "", text: "Sembla que et mira. Però no parla. Necessites saber-ne més: has trobat " + fr + " de 2 fragments de la crònica, i el Pare Alcuí te'ls ha de llegir." }
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
                { qui: "", text: "L'ombra espera, immòbil, amb les mans unides." },
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
            { qui: "", text: "Has rebut la BENEDICCIÓ DEL MONJO.\nAra necessites el Saber del Pare Alcuí i el permís del Til·ler per despertar Runna." }
        ],
        enAcabar: () => {
            E.posaFlag("benedicioMonjo");
            E.posaObjectiu("Troba Runna, al sud-est del Santuari, entre pedres, on el sol s'atura.");
        }
    }),

    // ---- Bassadòria ----
    bassadoriaNeta: E => ({
        pagines: [
            { qui: "", text: "La boira lila s'esfilagarsa i l'aigua de la bassa es torna clara. Els gripaus tornen a ser gripaus." },
            { qui: "Ineu", text: "Ha funcionat! L'aigua és neta..." }
        ],
        enAcabar: () => {
            E.posaFlag("bassadoriaNeta");
            E.posaObjectiu("La Bassadòria és neta. Segueix investigant: les Tietes, a les Cel·les, et diran per on continuar.");
        }
    }),

    // ---------------- BOSC DE SANT JOAN ----------------
    fontSJ: E => {
        const herbes = ofrenesFont(E);
        if (E.flag('fontNeta')) {
            return { pagines: [{ qui: '', text: 'La Font del Bisbe raja cristal·lina. Sota l\'aigua, el gel brilla, tot i ser estiu.' }] };
        }
        if (herbes === 3) {
            return {
                pagines: [
                    { fer: (z, fet) => z.seq([c => z.deixar(c, 'herba_sj'), c => z.deixar(c, 'romani'), c => z.deixar(c, null, 0xffd060)], fet) },
                    { qui: '', text: 'L\'aigua s\'aclareix i la boira lila fuig del bosc.' },
                    { qui: 'Ineu', text: 'Ha funcionat! Al fons de la pica hi ha un cristall que sembla de gel...' },
                    { qui: '', text: 'Has obtingut l\'AIGUA DE LA FONT DEL BISBE i un CRISTALL DE GEL.\nEl Garf, a l\'Era, segur que sap què fer-ne.' }
                ],
                enAcabar: () => {
                    E.posaFlag('fontNeta'); E.treu('pruna'); E.dona('aigua_sj'); E.dona('cristall_gel'); E.posaFlag('cristallGel');
                    E.posaObjectiu('Porta l\'aigua de la Font del Bisbe a l\'Alzina Buida, la més grossa del bosc. (I guarda el Cristall de Gel: el Garf, a l\'Era, en sabrà fer alguna cosa.)');
                }
            };
        }
        return {
            pagines: [
                { qui: '', text: 'La Font del Bisbe: seca, i amb una olor estranya. A la pica hi ha una mitra gravada.' },
                { qui: 'Ineu', text: 'Les Tietes diuen que la nit de Sant Joan aquesta aigua guaria. Ara està morta... Hi ha unes lletres gravades a la pica: «Herba de Sant Joan, romaní i el fruit de l\'arbre d\'or.»' },
                { qui: 'Ineu', text: 'Les herbes de la Nit de Sant Joan fan llum: n\'hi ha una al nord (cap al Til·ler) i el romaní al sud-est, sempre en una clariana. I l\'arbre d\'or... és la Prunera Màgica, al jardí de l\'Hostatgeria! Una pruna.' },
                { qui: '', text: `Ofrenes trobades: ${herbes}/3.` }
            ],
            enAcabar: () => { E.posaFlag('fontVista'); E.posaObjectiu(objectiuFont(herbes)); }
        };
    },

    herba: (n, nom) => E => ({
        pagines: [{ qui: '', text: `Has trobat ${nom}!` }],
        enAcabar: () => {
            E.posaFlag('herba' + n);
            if (E.flag('fontVista')) E.posaObjectiu(objectiuFont(ofrenesFont(E)));
        }
    }),

    alzinaBuida: E => {
        if (E.flag("portalJaumeta")) {
            return { pagines: [
                { qui: "", text: "L'Alzina Buida brilla amb una llum verdosa. El forat del tronc s'obre com una porta, i del cap a l'altre s'aixeca una olor de fum de llenya i de sopa de fa setmanes." }
            ] };
        }
        if (E.te("aigua_sj")) {
            return {
                pagines: [
                    { qui: "", text: "L'alzina vella té un forat al tronc, i sembla que tingui set. De dins surt una claror verdosa." },
                    { qui: "Ineu", text: "Duc aigua de la Font del Bisbe. Potser..." },
                    { fer: (z, fet) => z.deixar(fet, null, 0x8fe0ff) },
                    { qui: "Veu del bosc", text: "...Qui ens porta... l'aigua... bona... Passa, passa, fill... Només la Jaumeta... sap on acabes." },
                    { qui: "", text: "Un portal màgic s'ha obert a l'Alzina Buida. Una cabana molt lluny, al cor del bosc, t'espera a l'altra banda." }
                ],
                enAcabar: () => { E.posaFlag("portalJaumeta"); E.posaObjectiu("Passa pel portal de l'Alzina Buida: la cabana de la Jaumeta, la bruixa del bosc, és a l'altra banda."); }
            };
        }
        return { pagines: [
            { qui: "", text: "Una alzina vella amb un forat al tronc. De dins surt una claror verdosa i una olor de fum de llenya. L'escorça sembla assedegada." },
            { qui: "Ineu", text: "Sento una veu allà dins... «Aigua... aigua de la Font del Bisbe...» Potser necessito l'aigua de la font d'aquí a prop." }
        ] };
    },

    cartellBosc: E => ({ pagines: [{ qui: "", text: "Bosc de Sant Joan.\n«Qui busca la font, que segueixi l'aigua... i qui no, que no es perdi.»" }] }),
    cartellCirosa: E => ({ pagines: [{ qui: "", text: E.flag("camiCirosaObert") ? "↑ La Cirosa (camí llarg, tot el camí a munt)\n← La Caseta\n↓ Les Cel·les" : "↑ La Cirosa\nEl camí és tancat per una bardissa viva. Diuen que només s'aparta amb la fusta del Gran Til·ler.\n← La Caseta" }] }),

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
                { qui: '', text: `Columna ${n} de 12. Als peus hi ha una pedra plana amb un signe gravat: ${signe}` },
                { qui: 'Ineu', text: E.flag('col' + n)
                    ? `Ja el vaig apuntar: ${signe} vol dir «${paraula}».`
                    : `Sota el signe, amb lletra petita: «${paraula}». ${signe} = «${paraula}». Ho apunto.` },
                { qui: '', text: `Paraules apuntades: ${total() + (E.flag('col' + n) ? 0 : 1)}/12.` }
            ],
            enAcabar: () => {
                E.posaFlag('col' + n);
                if (total() === 12 && !E.flag('missatgeDesxifrat')) E.posaObjectiu('Tens les 12 paraules. Llegeix les taules de pedra de l\'Ermita de la Desaparició.');
                else if (total() < 12) E.posaObjectiu(`Segueix el camí de la Desaparició: columna ${n} (${total()}/12 paraules).`);
            }
        };
    },

    cartellCami: E => ({ pagines: [{ qui: '', text: 'Camí de la Desaparició.\n"Qui segueix els passos, no torna sol."' }] }),

    // ---------------- ERMITA DE LA DESAPARICIÓ ----------------
    ermitaPorta: E => ({ pagines: [{ qui: '', text: 'L\'ermita és petita i antiga. La porta és oberta de bat a bat.' }] }),
    taulaPedra: part => E => {
        const inici = part === 1 ? 0 : 6;
        const mots = [];
        for (let i = inici; i < inici + 6; i++) mots.push(E.flag('col' + (i + 1)) ? PARAULES_MISSATGE[i] : SIGNES_MISSATGE[i]);
        const totes = Array.from({ length: 12 }, (_, i) => E.flag('col' + (i + 1))).every(Boolean);
        const pagines = [{ qui: '', text: `Taula de pedra ${part} de 2:\n\n${mots.join('   ')}` }];
        if (totes) {
            pagines.push({ qui: 'Ineu', text: 'Quan la boira cobreixi el Miracle, els passos dels absents tornaran amb l\'alba.' });
            if (!E.flag('missatgeDesxifrat')) {
                pagines.push({ qui: '', text: 'Al peu de la taula, dins d\'un nínxol, hi ha una clau petita lligada amb un cordill, gairebé de joguina.\nHas obtingut la CLAU DEL SAGRARI.' });
                pagines.push({ qui: 'Ineu', text: 'La clau del sagrari del Santuari! Els monjos la van deixar aquí. Amb això obriré el sagrari del retaule.' });
            }
        } else {
            pagines.push({ qui: 'Ineu', text: 'Només entenc les paraules que he apuntat al camí. Els signes que em falten... són a les columnes.' });
        }
        return {
            pagines,
            enAcabar: () => {
                if (totes && !E.flag('missatgeDesxifrat')) {
                    E.posaFlag('missatgeDesxifrat');
                    if (!E.te('clau_sagrari') && !E.flag('fragment2')) E.dona('clau_sagrari');
                    if (!E.flag('fragment2')) E.posaObjectiu('Amb la clau petita, obre el sagrari del Santuari (al mig del retaule): guarda el fragment 2.');
                }
            }
        };
    },
    sortidaErmita: E => ({ pagines: [{ qui: '', text: '← L\'Era · → Camí de la Desaparició' }] }),
    creuDesaparicio: E => ({
        pagines: [
            { qui: '', text: "La Creu de la Desaparició. Una creu de pedra, igual que la de l'Aparició, però aquesta no té flors als peus: només cera vella i alguna pedreta posada amb cura." },
            { qui: '', text: "Al sòcol, gravat amb lletra gastada: «Els qui se'n van no s'obliden; només esperen que algú els cridi pel nom.»" }
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
                    { qui: '', text: 'Has obtingut el TELESCOPI DEL GARF.' }
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
    cartellEra: E => ({ pagines: [{ qui: '', text: '↑ Ermita de la Desaparició\n→ Hostatgeria\n← Rovellonera' }] }),

    // ---------------- JARDÍ ----------------
    isidre: E => DIALEGS.isidreBase(E),
    isidreBase: E => {
        if (E.flag("soparObert") && !E.flag("floresIsidre")) {
            return {
                pagines: [
                    { qui: "Isidre", text: "Sopar del Til·ler, eh? Cada any se n'omple el cap amb escudelles i s'obliden de les flors. Jo hi fico flors des que tenia dos peus bons." },
                    { fer: (z, fet) => { const i = z.npcs.isidre, x0 = i.x, y0 = i.y; z.seq([c => z.npcVa('isidre', x0 - 140, y0 - 30, c, 80), c => z.npcFeina('isidre', 1300, 'fulles', c), c => z.npcVa('isidre', x0, y0, c, 80), c => z.objecteVola('isidre', c, 'flors')], fet); } },
                    { qui: "Isidre", text: "Les flors de lluna són pels que falten. Posa-les al mig de la taula. Jo no podré ser-hi, que el peu em ballaria... però seré a cada pètal." },
                    { qui: "", text: "Has obtingut les FLORS DE L'ISIDRE." }
                ],
                enAcabar: () => { E.dona("flors_isidre"); E.posaFlag("floresIsidre"); objectiuSopar(E); }
            };
        }
        if (E.flag('llosaOberta')) {
            return { pagines: [{ qui: 'Isidre', text: 'La flor de lluna ja ha florit sobre la llosa. Em fa mal el peu, però no deixaré de cuidar-la.' }] };
        }
        if (E.te('llavorLluna')) {
            return {
                pagines: [{ qui: 'Isidre', text: 'Una Llavor de Lluna! Fa trenta anys que no en veia cap. Deixa-me-la, monjo, que el peu em fa mal però encara sé cavar un clot.' }],
                enAcabar: () => {
                    E.treu('llavorLluna');
                    const z = Joc.zonaActiva(game.scene.getScene('UI'));
                    if (z && z.obrirLlosa) z.obrirLlosa(); else E.posaFlag('llosaOberta');
                }
            };
        }
        return {
            pagines: [
                { qui: 'Isidre', text: 'Bon dia, monjo! Perdona que no m\'aixequi: el peu, ja saps. Aquesta pèrgola de pedra és més vella que el monestir: les columnes, els arcs... i l\'Hostatgeria, aquí al costat, que s\'hi aguanta al darrere.' },
                { qui: 'Isidre', text: 'Aquest jardí amaga una llosa que ningú no ha aixecat mai. Diuen que només s\'obre amb una flor de lluna, i la llavor, ves a saber... potser la tingui la venedora de verdura, la Sansa.' }
            ],
            enAcabar: () => { E.posaFlag('isidreSansa'); E.posaObjectiu('Busca la Sansa, la venedora de verdura: potser té una Llavor de Lluna per a la llosa del jardí.'); }
        };
    },
    // La Sansa passa per les cel·les un sol cop: et ven la Llavor de Lluna i se'n va
    sansa: E => ({
        pagines: [
            { qui: 'Sansa', text: 'Verdures fresques, fruita de la rodalia! ...Ai, ets el monjo de l' + String.fromCharCode(39) + 'Isidre? M' + String.fromCharCode(39) + 'ha dit que buscaves una cosa especial.' },
            { qui: 'Sansa', text: 'Una Llavor de Lluna. Fa anys que la guardo al fons del carro, entre les cebes, i no sé ni per què. Pren, és teva. Que floreixi a qui sàpiga cuidar-la.' },
            { qui: '', text: 'Has obtingut la LLAVOR DE LLUNA.' },
            { qui: 'Sansa', text: 'Bé, jo ja he d' + String.fromCharCode(39) + 'anar fent camí. Avui encara em queden tres pobles per davant. Adéu, monjo!' }
        ],
        enAcabar: () => { E.dona('llavorLluna'); E.posaFlag('llavorSansa'); E.posaObjectiu('Porta la Llavor de Lluna a l' + String.fromCharCode(39) + 'Isidre, a l' + String.fromCharCode(39) + 'Hostatgeria.'); }
    }),
    llosaJardi: E => ({
        pagines: [{ qui: '', text: 'Una llosa de pedra rodona entre les flors, dins la pèrgola. Té una ranura al mig, com un clot per una llavor.' }]
    }),
    prunera: E => {
        const pagines = [
            { qui: '', text: 'A l\'extrem de ponent del jardí, una prunera vella i retorçuda, carregada de prunes daurades que lluen com si fossin d\'or.' },
            { qui: 'Isidre', text: '(des de la pèrgola) No te\'n facis un fart, monjo! Són prunes daurades, màgiques: una sola et deixa com nou.' },
            { fer: (z, fet) => z.seq([c => z.agafar(c, null, 0xffd060), c => z.beure(c, 0xffd060)], fet) },
        ];
        const perFont = !E.flag('fontNeta') && !E.te('pruna') && !E.flag('herba3');
        if (perFont) pagines.push({ qui: '', text: 'En culls una altra i te la guardes al sarró: la Font del Bisbe en vol una.\nHas obtingut una PRUNA DAURADA.' });
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
        : { pagines: [{ qui: '', text: 'L\'Hostatgeria. Les portes són tancades per dins i els finestrals són foscos.' }] },
    sortidaMonges: E => ({ pagines: [{ qui: '', text: 'La gran porta de l\'Hostatgeria, tancada per dins amb tres barres de ferro.' }] }),
    taulaRefetor: E => E.te('guants')
        ? { pagines: [{ qui: 'Ineu', text: 'Amb els Guants de Poder, aquesta taula no pesa tant...' }] }
        : { pagines: [
            { qui: '', text: 'Una taula de roure massissa barra la porta del mig. Des de l\'altra banda, una veu fina i enrabiada colpeja el fusta.' },
            { qui: 'Ineu', text: 'No la puc moure amb les mans soles. Ni dues persones... Necessito molta més força.' }] },
    // El mur d'esbarzers del passadís secret (Celler → Cambra secreta)
    murEsbarzers: E => ({ pagines: E.te('runna') ? [
        { qui: '', text: "Un mur d'esbarzers negres tanca el passadís de banda a banda. Les punxes llueixen violeta a la llum de les espelmes." },
        { qui: 'Ineu', text: "Runna els talla: situa't davant de cada un i ataca (ESPAI). Són cinc. Mata també les escolopendres, que després tornen." }
    ] : [
        { qui: '', text: "Un mur d'esbarzers negres tanca el passadís de banda a banda. Les punxes llueixen violeta a la llum de les espelmes." },
        { qui: 'Ineu', text: "Ni el bastó de pelegrí ni el del Til·ler no els tallen: només Runna. Primer cal despertar-la al Dolmen. Torna quan la tinguis." }
    ] }),

    esbarzersCapella: E => ({ pagines: [
        { qui: '', text: 'Uns esbarzers negres han crescut davant la porta de la dreta i la tapen del tot. Se sent algú resar a dins, molt baixet.' },
        { qui: 'Ineu', text: 'El bastó no els talla. Només Runna ho aconsegueix.' }] }),

    // ---------------- LES MONGES DE L'HOSTATGERIA ----------------
    monjaPains: E => {
        if (!E.flag('lliurePains')) return { pagines: [
            { qui: '', text: 'Una velleta en cadira de rodes dorm dins un capoll de boira lila. No respon.' },
            { qui: 'Ineu', text: 'Una música lleugera, de tres notes, potser la desperta. (Flauta: 1-2-3.)' }] };
        if (!E.flag('premiPains')) return {
            pagines: [
                { qui: 'Pains', text: 'Oh, mon petit! Quin cant més bonic... fa seixanta anys que no el sentia així. Jo sóc la Pains.' },
                { qui: 'Pains', text: 'La boira va entrar pel soterrani fa tres nits. Vaig veure un home amb abric d\'ocells que s\'enduia els nens del poble, rient baixet.' },
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
                { qui: 'Phili', text: 'Aquí tens, per les molèsties. Que no se t\'acabin les forces!' }
            ],
            enAcabar: () => premiMonja('Phili', 'premiPhili')
        };
        return { pagines: [{ qui: 'Phili', text: 'Si necessites algú que miri amb els ulls ben oberts, ja saps on trobar-me.' }] };
    },
    monjaCharm: E => {
        if (!E.flag('premiCharm')) return {
            pagines: [
                { qui: 'Charm', text: 'Benvingut, fill de Déu. Sóc la Charm, la mare superiora d\'aquesta casa. Havíem perdut l\'esperança, però no la pregària.' },
                { qui: 'Charm', text: 'El nostre nebot, el Sardin, passava aquí la tardor amb nosaltres. La nit que la boira ens va tancar a les cambres, el seu llit va quedar buit. Porta\'l a casa, fill. Porta\'ls a tots.' },
                { qui: 'Charm', text: 'Als llibres d\'aquesta casa he llegit que l\'Ocellaire va robar el cant dels ocells, i que només aquest mateix cant obre la seva gàbia. Tu l\'aprendràs: la Pianista el recorda.' },
                { qui: 'Charm', text: 'Accepta el que podem donar: una mica de la nostra paciència.' }
            ],
            enAcabar: () => premiMonja('Charm', 'premiCharm')
        };
        return { pagines: [{ qui: 'Charm', text: 'Que la llum del Miracle t\'acompanyi, fill.' }] };
    },

    portaHostatgeria: E => ({ pagines: [{ qui: '', text: 'Una porta de fusta, tancada per dins.' }] }),

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
                    { qui: "", text: "Has obtingut les ESQUELLES DELS PASTORS!\nEls cants antics sonaran més clars amb elles." }
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
            { qui: "", text: "Has obtingut el PA DELS PASTORS: una barra baixa i fosca, cuita sota la cendra." }
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
            { qui: "", text: "Sota el Til·ler, una taula llarga: l'escudella, el pa dels pastors i les flors de lluna. Tres cadires buides, i una de més." },
            { qui: "Neus", text: "Aquest any m'he descuidat de fer-hi cantar ningú. I a l'escudella hi he posat una cullerada de més, com cada any: la del que falta. Enguany n'hi he posat tres." },
            { qui: "Senyor Moliner", text: "...I jo hi he posat una altra per a ella. Per si de cas. Que no ho sàpiga." },
            { qui: "Tieta Enriqueta", text: "Sempre fem el mateix, fill: una espelma per cada llar que té una cadira buida. Encén-la tu, que ets qui ho ha de portar a terme." },
            { fer: (z, fet) => z.encendreEspelmes([0, 1, 2], fet) },
            { qui: "Pastor vell", text: "I una quarta... per als que no tenen nom. Per als que ningú no va recordar. Si el pare ho permet." },
            { fer: (z, fet) => z.encendreEspelmes([3], fet) },
            { qui: "El Gran Til·ler", text: "Aquesta és la saviesa que et volia donar, petit monjo: ningú no es perd del tot mentre algú el recorda a taula. La gàbia de l'Ocellaire només s'omple de qui s'ha quedat sol." },
            { qui: "El Gran Til·ler", text: "Rep el meu permís. Que et sigui lleu, i que no et faci oblidar mai que vas menjar amb tots." },
            { fer: (z, fet) => z.fullaCau(fet) },
            { qui: "", text: "Has obtingut la FULLA DEL TIL·LER!" },
            { fer: (z, fet) => { ['sopar_pastor_a', 'sopar_pastor_b', 'sopar_pastor_vell'].forEach(k => z.bombolla(k, '♪', null, 1400)); z.esperar(1500, fet); } },
            { qui: "", text: "Des del Santuari, molt lluny, arriba una nota d'orgue que, per primer cop en dies, no s'apaga.\n+1 gra al rosari, i el rosari torna a brillar sencer." }
        ],
        enAcabar: () => {
            E.dona("fulla_tiler"); E.posaFlag("fullaTiler"); E.posaFlag("soparFet");
            E.treu("pa_pastor");
            E.dades.corsMax += 1; E.dades.vida = E.dades.corsMax * 2;
            E.posaObjectiu("Tens la Fulla del Til·ler. Ara falten el Saber del Pare Alcuí i la Benedicció, i trobar Runna al sud-est.");
            const z = game.scene.getScene("ZonaTiller");
            if (z && z.acabarSopar) z.acabarSopar();
        }
    }),

    espelmesTiller: E => ({
        pagines: [
            { qui: "", text: "Quatre espelmes que no s'han apagat des del sopar, vora les arrels del Til·ler: per a l'Uri, per al Flam, per al Sardin... i una de més, per qui no té nom." },
            ...(E.flag("rescatUri") && E.flag("rescatFlam") && E.flag("rescatSardin") ? [{ qui: "", text: "Les tres primeres s'han apagat soles, i fa olor de cera tèbia i de rialles." }] : [])
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
            return { pagines: [{ qui: "", text: "En aquesta corba del camí, l'herba és de nou verda. De vegades, quan passa el vent, sembla que s'hi senti una rialleta." }] };
        }
        if (!E.flag("nenaVista")) {
            return {
                pagines: [
                    { qui: "", text: "Una nena transparent seu a terra, amb dues trenes sense lligar. Plora en silenci, i on cauen les llàgrimes l'herba es torna blanca." },
                    { qui: "Nena de les Trenes", text: "No et facis enrere, si us plau... No vull espantar ningú. Només que, quan arriba algú, sempre fuig." },
                    { qui: "Nena de les Trenes", text: "Vaig venir a collir rovellons amb la mare. Ella deia que els rovellons creixen sempre vora el bon camí, i que qui se'n fia no es perd mai pel bosc. Em vaig perdre perquè em vaig oblidar de mirar a terra. Em va lligar les dues trenes amb dos llaços rosa, i em vaig perdre pel bosc. Fa molts, molts anys. No he pogut marxar d'aquí." },
                    { qui: "Nena de les Trenes", text: "Els llaços van caure mentre corria: un va quedar pel camí, amagat sota una roca, i l'altre ja dins el bosc dels rovellons, a la primera clariana. Sense ells, no sento les mans de la mare. Si me'ls tornessis a lligar..." },
                    { qui: "Ineu", text: "Els trobaré. Et prometo que no hauràs de plorar sola." }
                ],
                enAcabar: () => {
                    E.posaFlag("nenaVista");
                    E.posaObjectiu("Troba els dos llaços de la Nena de les Trenes (un sota una roca del camí; l'altre a la primera clariana de la Rovellonera) i porta-li-los.");
                }
            };
        }
        if (n < 2) {
            const pista = n === 0 ? "Un és pel camí, sota una roca que cal empènyer... i l'altre, més endins, a la primera clariana del bosc dels rovellons."
                : E.flag("llac1") ? "El del camí ja el tens! Falta el de dins el bosc dels rovellons, a la primera clariana, entre els pins."
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
                { qui: "", text: "Has obtingut la CINTA DE LA NENA: absorbeix un cop cada cop que entres a una zona.\nLa Nena de les Trenes ja no espantarà ningú." }
            ],
            enAcabar: () => {
                E.posaFlag("nenaAlliberada"); E.posaFlag("trenesNena"); E.dona("cinta_nena"); E.treu("llac_nena");
                E.posaObjectiu("Segueix el camí cap al sud-oest: la Rovellonera, Sant Gabriel, els Dipòsits i, a l'extrem sud-est, el Dolmen.");
            }
        };
    },

    llac: k => E => ({
        pagines: [{ qui: "", text: "Un llaç de cinta, rosa i descolorit, entre l'herba. Sembla que encara estigui calent. (Llaços: " + (["llac1", "llac2"].filter(f => E.flag(f) || f === "llac" + k).length) + "/2)" }],
        enAcabar: () => {
            E.posaFlag("llac" + k); E.dona("llac_nena");
            const n = ["llac1", "llac2"].filter(f => E.flag(f)).length;
            E.posaObjectiu(n < 2 ? (k === 1 ? "Troba el segon llaç de la Nena de les Trenes (1/2): és a la primera clariana de la Rovellonera, entre els pins." : "Troba el segon llaç de la Nena de les Trenes (1/2): és pel camí, sota una roca grossa que cal empènyer.") : "Ja tens els dos llaços: porta-los a la Nena de les Trenes, a la corba del camí.");
        }
    }),

    // ---------------- SANT GABRIEL ----------------
    altarGabriel: E => ({
        pagines: [
            { qui: "", text: "Un altar senzill de blocs de pedra clara, amb una creu i dos canelobres de ferro. Al costat de la creu, un calze d'argent entelat, ple d'aigua de rosada del matí." },
            ...(E.flag("calze") ? [] : [{ qui: "", text: "Un raig de claror baixa de la finestra i es posa al calze. És el CALZE DE ROSADA: cada cop que en beguis, et sentiràs renovat." }]),
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
            return { pagines: [{ qui: "", text: "El mirador dels Dipòsits. El cel és ple d'estels, i les llàgrimes de Sant Llorenç ja han dit el que havien de dir." }] };
        }
        if (E.flag("estelsFets")) {
            return { pagines: [{ qui: "Ineu", text: "L'últim estel s'ha apagat damunt del dipòsit de llevant. Hi ha una llum a l'aigua: he d'anar-hi." }] };
        }
        if (!E.te("telescopi")) {
            return { pagines: [
                { qui: "", text: "Un mirador de pedra, amb la tripode buida. Segurament és el lloc on s'han de mirar els estels." },
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
            { qui: "", text: "Has obtingut l'ESTEL DE SANT LLORENÇ: una llàgrima de llum que no crema ni s'apaga." },
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
            { qui: "", text: "L'Estel de Sant Llorenç s'encén a la teva mà. La boira recula davant la seva llum, s'esfilagarsa i deixa veure un corriol que s'enfila entre els arbres." }
        ] }
        : { pagines: [
            { qui: "", text: "Una boira espessa i freda tapa el camí de llevant, el que puja al Dolmen. Quan t'hi acostes, s'espesseix encara més." },
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
                { qui: "", text: "Una espasa clavada entre les lloses, fosca i tranquil·la, com si dormís. Sembla que et reconegui... però no s'inmuta." },
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
                E.posaObjectiu("Les ombres s'han fet més fortes. Parla amb el Frederic, al Celler (a les Runes): sap com baixar-hi per una altra banda.");
            }
        };
    },

    dolmenBuit: E => ({
        pagines: [{ qui: "", text: "La llosa del Dolmen, buida i tèbia. Al lloc on dormia Runna ha quedat una empremta de llum que no s'acaba d'apagar." }]
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
            { qui: "", text: "Un cercle de bolets vermells i grocs, dibuixat amb una precisió que no és natural. Brilla suaument, igual que l'Alzina Buida." },
            { qui: "Ineu", text: "És l'altra banda del portal de la Jaumeta. Si hi entro, arribaré a la seva cabana." }
        ] : [
            { qui: "", text: "Un cercle perfecte de bolets, enmig de la clariana. Sembla que hi ballin fades, si n'hi hagués." },
            { qui: "Ineu", text: "Estrany... Em fa la sensació que és una porta, però no sé de què." }
        ]
    }),

    portalTornada: E => ({
        pagines: [{ qui: "", text: "El cercle de bolets de la cabana tremola. Si hi poses els peus, tornaràs al lloc d'on has vingut." }]
    }),

    cofreBosc: E => {
        if (E.flag("cofreBosc")) return { pagines: [{ qui: "", text: "El cofre és obert i buit. Les cendres dels esbarzers encara estan tèbies." }] };
        return {
            pagines: [
                { qui: "", text: "Dins l'amagatall, un cofre vell. Les bisagres són rovellades, però el pany ha cedit amb un petit toc." },
                { qui: "", text: "A dins hi ha un coure petit amb una gota de sang de color rosa pàl·lid i una nota: «Per al qui vingui amb l'espasa.»" },
                { fer: (z, fet) => z.seq([c => z.agafar(c, null, 0xffb8c8), c => z.beure(c, 0xffb8c8)], fet) },
                { qui: "", text: "+1 GRA AL ROSARI i rosari ple." }
            ],
            enAcabar: () => { E.posaFlag("cofreBosc"); E.dades.corsMax += 1; E.dades.vida = E.dades.corsMax * 2; }
        };
    },

    // ---------------- LA CASA GRAN ----------------
    portaReixa: E => ({
        pagines: [
            { qui: "", text: "Sota el porxo d'arcs, una porta amb una reixa de ferro gruixuda, lligada amb cadenes rovellades. El pany és tan antic que ja ni té forat." },
            { qui: "Ineu", text: E.flag("reixaObertaDins") ? "Per dins hi ha la barra aixecada, però les cadenes de fora no cedeixen. Aquí no s'hi entra." : "Ni el Clauer de Novici hi encaixa. Fa generacions que ningú no obre això. Haurà d'haver-hi una altra manera d'entrar-hi." }
        ]
    }),

    // Reixa del porxo vista des de l'escalinata (per dins només hi ha una barra de ferro)
    reixaDins: E => ({
        pagines: [
            { qui: "", text: "La reixa del porxo, tancada amb una barra de ferro. Per dins, n'hi ha prou amb aixecar-la." },
            { fer: (z, fet) => { z.cameras.main.shake(250, 0.004); z.agafar(fet, null, 0x8a8a90); } },
            { qui: "Ineu", text: "(Ara puc sortir a la plaça per aquí. De fora, la reixa continua tancada.)" }
        ],
        enAcabar: () => E.posaFlag("reixaObertaDins")
    }),

    posterSecret: E => {
        if (E.flag("rodaMoguda")) {
            return { pagines: [{ qui: "", text: "La roda de carruatge, desplaçada, i al darrere un passadís fosc que baixa. Se sent una olor de vi vell i d'humitat." }] };
        }
        return {
            pagines: [
                { qui: "", text: "Una roda de carruatge enorme, dreta contra la paret com a decoració. De sota la fusta ve un fil d'aire fred, i una olor de vi i d'humitat." },
                { qui: "Ineu", text: E.te("guants") ? "Hi ha un forat darrere... Amb els guants, si l'empenyo des d'un costat, caminant-hi en contra, potser rodolarà." : "Hi ha alguna cosa al darrere, però la roda pesa com un carro ple. Amb les mans soles no la mouré mai." }
            ]
        };
    },



    // Cambra secreta dels monjos (sala del tresor, entre el Celler i la Casa Gran)
    cofreCambra: E => {
        if (E.flag("cofreCambra")) return { pagines: [{ qui: "", text: "El cofre és obert i buit. Només queda un pergamí de tapes de cuir." }] };
        return {
            pagines: [
                { qui: "", text: "Un cofre massís entre botes buides. A dins, un flascó daurat i un pergamí de tapes de cuir." },
                { fer: (z, fet) => z.seq([c => z.agafar(c, null, 0xf0c040), c => z.beure(c, 0xf0c040)], fet) },
                { qui: "", text: "+1 GRA AL ROSARI i rosari ple." },
                { qui: "", text: "Has obtingut el PERGAMÍ DEL MONJO." },
                { qui: "Pergamí del monjo", text: "«Les relíquies dels meus germans i la clau de ferro són sota l'escala, murades. Un guardià de pedra les vigila: ningú no hi baixa si no li gira el cap cap al sol que neix. On neix el sol, el raïm madura.»" },
                { qui: "", text: "Al fons de la sala s'ha desfet un pany: una porta de fusta s'obre cap a l'escalinata de la Casa Gran." }
            ],
            enAcabar: () => {
                E.dona("pergami_monjo"); E.posaFlag("cofreCambra");
                E.dades.corsMax += 1; E.dades.vida = E.dades.corsMax * 2;
                E.posaObjectiu(E.te("palanca") ? "Puja a l'escalinata de la Casa Gran: gira el cap de l'Home del Raïm cap a llevant amb la palanca i prem-li el raïm." : "L'Home del Raïm guarda les relíquies: cal una palanca. En Jordi de la Caseta (a l'oest del Til·ler) en té una.");
            }
        };
    },

    homeRaimInt: E => ({
        pagines: [
            { qui: "", text: "Al mig de la gran escalinata, l'Home del Raïm: una escultura de pedra gairebé tan alta com dos homes, amb un carràs de raïm de marbre a les mans." },
            { qui: "Ineu", text: "Té el cap girat cap enrere, com si vigilés la porta de sota l'escala. Sembla que guardi alguna cosa." },
            { qui: "", text: "(Cal una palanca per fer-lo girar. En Jordi de la Caseta, a l'oest del Til·ler, en té una.)" }
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
                    { qui: "", text: "Has obtingut el BEURATGE DE LA JAUMETA.\nAboca'l a la boira que tapa el camí al nord de les Cel·les." }
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
            { qui: "", text: "Una boira espessa i freda tapa el camí que puja cap al nord. Quan hi poses la mà, et glaça els dits." },
            { qui: "Ineu", text: "No hi puc passar... Aquesta boira no és de les que marxen amb el vent. Algú que en sàpiga, de bruixeries, potser la Jaumeta, del bosc, tindria alguna cosa per desfer-la." }
        ]
    },

    // La bardissa viva del camí de la Cirosa (s'aparta amb la branca del Til·ler)
    bardissa: E => {
        if (!E.te("basto_tiller")) {
            return { pagines: [
                { qui: "", text: "Una bardissa viva, de punxes negres, tanca el camí cap al nord-est. Quan t'hi acostes, les branques es belluguen soles." },
                { qui: "Ineu", text: "El bastó de pelegrí no la tallarà. Potser alguna cosa de fusta viva... la branca del Gran Til·ler?" }
            ] };
        }
        if (!E.flag("bassadoriaNeta")) {
            return { pagines: [
                { fer: (z, fet) => { z.deixar(() => { z.cameras.main.shake(200, 0.003); fet(); }, 'branca', 0xd8f0a0); } },
                { qui: "Ineu", text: "Sembla que espera alguna cosa: potser que l'aigua clara de la Bassadòria torni a respirar." }
            ] };
        }
        return { pagines: [
            { fer: (z, fet) => z.deixar(fet, 'branca', 0xd8f0a0) },
        ] };
    },


    // El cofre de les joguines de la caseta: la palanca és a sota
    cofrePalanca: E => {
        if (E.te("palanca") || E.flag("palanca")) {
            return { pagines: [{ qui: "", text: "El cofre de les joguines, ple de soldadets de fusta, una baldufa i un tambor sense pell. La palanca ja no hi és." }] };
        }
        if (!E.flag("jordiPalanca")) {
            return { pagines: [
                { qui: "", text: "Un cofre de joguines. Sota els soldadets de fusta s'hi endevina una palanca de ferro, gran i pesada." },
                { qui: "Ineu", text: "No és meva... Millor preguntar a en Jordi abans d'agafar-la." }
            ] };
        }
        return {
            pagines: [
                { fer: (z, fet) => z.agafar(fet, null, 0x8a8a90) },
                { qui: "", text: "Has obtingut la PALANCA." }
            ],
            enAcabar: () => {
                E.dona("palanca"); E.posaFlag("palanca");
                if (E.flag("cofreCambra")) E.posaObjectiu("Porta la palanca a l'Home del Raïm, al mig de l'escalinata de la Casa Gran.");
            }
        };
    },

    // ---------------- EL CEMENTIRI ----------------
    tombaMonjos: E => {
        if (E.flag("relIquiesRetornades")) {
            return { pagines: [{ qui: "", text: "La tapa del sarcòfag dels monjos primers, tancada de nou. Les relíquies reposen a sota, i només un fil de llum tèbia surt de l'esquerda." }] };
        }
        return {
            pagines: [
                { qui: "", text: "Un gran sarcòfag de pedra al mig del replà, amb la tapa esquerdada i lletres antigues gairebé esborrades: «Ací reposen els qui van tancar la porta.»" },
                { qui: "", text: "De l'esquerda surt una boira lila, freda, que sembla respirar. Al seu voltant, la terra és plena d'animalets que no haurien de sortir." },
                { qui: "Ineu", text: "Aquí és, doncs, el cementiri vell dels monjos del segle XV. L'esquerda del segell... i la boira. Si algú els tornés el que els van prendre..." },
                { qui: "", text: "(El monjo les va amagar a la Casa Gran perquè ningú no les robés. Quan les portis aquí, l'esquerda es tancarà.)" }
            ],
            enAcabar: () => E.posaFlag("tombaVista")
        };
    },

    creuCementiri: E => {
        const gravat = { qui: "", text: "Una tomba arran de terra, voltada de pedra, amb un àngel que plora al cap i un gerro als peus. A la base, gravat: «Els monjos del Miracle, d'ara i d'abans.»" };
        if (E.te("ram")) return {
            pagines: [gravat,
                { fer: (z, fet) => z.deixar(fet, 'flors', 0xffd8e8) },
            ],
            enAcabar: () => { E.treu("ram"); E.posaFlag("florsCreu"); E.posaObjectiu("Torna a Sant Antoni: el Germà Francesc t'ha de donar una cosa."); }
        };
        return { pagines: [gravat, E.flag("florsCreu")
            ? { qui: "Ineu", text: "El ram del Germà Francesc encara és fresc. La boira no s'hi acosta." }
            : { qui: "Ineu", text: "La boira ha marcit les flors, però algú encara les canvia cada setmana. Segur que el Germà Francesc, del Monestir." }] };
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
        return { pagines: [{ qui: "", text: mots[n % mots.length] }] };
    }
};
