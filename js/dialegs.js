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

// Les Tietes sempre donen una pista segons el que et falta fer
function pistaActual(E) {
    let consell;
    const cols = Array.from({ length: 12 }, (_, i) => E.flag("col" + (i + 1))).filter(Boolean).length;
    if (!E.flag("clauerNovici")) consell = "Fill, ves a la Plaça: el Pare Jordi et busca i t'ha de donar el clauer.";
    else if (!E.flag("cantAurora")) consell = "Al Santuari, la Pianista encara sap un cant que la boira no li pot prendre. Fes-te'l ensenyar.";
    else if (!E.flag("bassadoriaNeta")) consell = "Davant la Bassadòria, al sud de la Plaça, prem ESPAI i tria tocar la flauta: 1-2-3.";
    else if (!E.flag("fontNeta")) consell = "Al bosc de l'oest, a tocar de les Cel·les, hi ha una Font del Bisbe que s'ha adormit. Porta-li l'herba de Sant Joan i el romaní, que brillen entre els arbres com espurnes, i una pruna de la Prunera Màgica del jardí de l'Hostatgeria.";
    else if (!E.flag("jaumetaVista") && !E.flag("parlatTiler")) consell = "Amb l'aigua de la Font del Bisbe, l'Alzina Buida del bosc, la més grossa de la clariana, s'obre com un portal. Allà viu la Jaumeta, que és vident i et donarà alguna cosa per al camí del Til·ler.";
    else if (!E.flag("boiraTillerNeta") && !E.flag("parlatTiler")) consell = "El Gran Til·ler és al nord de les Cel·les, però una boira espessa tapa el camí. Aboca-hi el beuratge de la Jaumeta i es desfarà.";
    else if (!E.flag("parlatTiler")) consell = "Pel camí que s'ha aclarit, al nord de les Cel·les, hi ha el Gran Til·ler. Parla-hi: ell sap què fer amb les bestioles que desperten.";
    else if (!E.te("basto_tiller")) consell = "Agafa la branca que ha caigut al peu del Til·ler: és més àgil que el bastó de pelegrí que portes.";
    else if (E.flag("soparFet") && !E.flag("saber")) consell = "El Pare Alcuí, a la biblioteca, sap la paraula que desperta l'espasa. Només te la dirà si has parlat amb l'ombra del monjo.";
    else if (E.flag("soparFet") && !E.flag("benediccio")) consell = "El Pare Jordi, a la Plaça, vol donar-te la benedicció. Fes-li una visita.";
    else if (E.flag("soparFet") && !E.flag("runna")) consell = "Surt de l'Hostatgeria cap a l'oest, passa per davant de l'Era i segueix el camí un bon tros: arribaràs a la Rovellonera. Allà, on hi ha rovellons sota els pins, hi ha camí: sud, ponent i sud. I mira el cel als Dipòsits.";
    else if (!E.flag("fredericRoda") && !E.flag("cofreCambra")) consell = "Ara que portes Runna... Al Celler, a les Runes, hi ha una roda de carruatge que amaga alguna cosa. El Frederic, el pare del Juli, en sap més del que diu. Parla-hi.";
    else if (!E.te("guants") && !E.flag("rodaMoguda")) consell = E.flag("florsCreu") ? "Torna a Sant Antoni, fill: el Germà Francesc t'espera." : E.te("ram") ? "El ram del Germà Francesc va a la tomba de l'àngel del Cementiri." : "El Germà Francesc, que passeja per Sant Antoni (a llevant del Monestir), té uns guants que mouen el que pesa. Fes-li un favor i te'ls deixarà.";
    else if (!E.flag("cofreCambra")) consell = "Amb els guants posats, empeny la roda del Celler des d'un costat. Al darrere hi ha el túnel dels monjos.";
    else if (!E.flag("raimDerrotat")) consell = "A la gran escalinata de la Casa Gran hi ha l'Home del Raïm. Necessites la palanca: és a la caseta de joc del jardí de la masia d'en Jordi, a l'oest del Gran Til·ler. I recorda el que diu el pergamí del monjo: on neix el sol, el raïm madura.";
    else if (!E.flag("relIquiesRetornades")) consell = "Les relíquies dels monjos s'han de tornar a la tomba esquerdada del Cementiri, darrere el Santuari i el Monestir. I guarda bé aquella clau que has trobat: obre la porta de ferro de sota la Taverna.";
    else if (!E.flag("cantMiracle")) consell = "Abans de baixar sota la Taverna, passa pel Santuari: la Pianista té un últim cant per a tu, el Cant del Miracle. Els barrots de la gàbia només l'escolten a ell.";
    else if (!E.flag("telescopi")) consell = "Aquest cristall de gel que has trobat... el Garf, a l'Era, en sabrà fer alguna cosa. Segueix el camí de les Runes cap a l'oest, fins a l'Ermita i l'Era.";
    else if (cols < 12) consell = "El camí de la Desaparició té dotze columnes. Cada una t'explica una paraula. Apunta-les totes!";
    else if (!E.flag("missatgeDesxifrat")) consell = "Ja tens les dotze paraules. A l'ermita hi ha dues taules de pedra que només tu pots llegir.";
    else if (!E.flag("llosaOberta")) consell = "La Sansa, la de les verdures, ven coses que no s'han de veure. L'Isidre, al jardí, sap quina llavor fa florir la llosa.";
    else if (E.flag("llosaOberta") && !E.flag("mongesTrobades")) consell = "A la llosa del jardí de l'Hostatgeria hi ha una escala que baixa: busca les monges per dins.";
    else consell = "Aviat tindràs més camins oberts. Vés pas a pas, fill, i no et deixis la bufanda.";
    return consell;
}

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
                    { qui: "Pare Jordi", text: "No et vull espantar, però el Biel, de les cel·les de Sant Antoni, fa dos dies que va desaparèixer. I aquesta nit ha estat el Pol, de Sant Benet." },
                    { qui: "Pare Jordi", text: "Les famílies estan angoixades. I aquesta boira que surt de sota terra... no m'agrada gens." },
                    { qui: "Pare Jordi", text: "Tu tens bons ulls i bon cor. Pren el meu clauer de novici: parla amb tothom i explica-m'ho tot." },
                    { qui: "", text: "Has obtingut el CLAUER DE NOVICI!\nObre la biblioteca i les cel·les." },
                    { qui: "Pare Jordi", text: "I abans de marxar, passa a saludar el Germà Andreu, al costat dels xiprers: sempre té la butxaca plena de coses. Ves amb compte pels camins, Ineu." }
                ],
                enAcabar: () => {
                    E.posaFlag("clauerNovici");
                    E.dona("clauer");
                    E.posaObjectiu(E.flag("bastoObtingut") ? "Parla amb la gent del Santuari. Les cel·les són al nord, passant per les Runes." : "Passa a veure el Germà Andreu, vora els xiprers de la plaça. Després, les cel·les són al nord, passant per les Runes.");
                }
            };
        }
        if (E.flag("fullaTiler") && !E.flag("benediccio")) {
            return {
                pagines: [
                    { qui: "Pare Jordi", text: "Ineu! Ho he sentit: el Til·ler t'ha donat el seu permís. Aquell arbre no en dóna ni a mi." },
                    { qui: "Pare Jordi", text: "Mira, fill: jo no soc valent com tu, però sí que sé una cosa. Una benedicció no és una paraula màgica, és voler bé de debò. Ajup el cap." },
                    { qui: "", text: "El Pare Jordi posa la mà a la teva testa i resa una pregària breu, en veu baixa." },
                    { qui: "Pare Jordi", text: "No vas sol, Ineu. Vas amb tot el Miracle darrere teu." },
                    { qui: "", text: "Has rebut la BENEDICCIÓ DEL PARE JORDI." }
                ],
                enAcabar: () => { E.posaFlag("benediccio"); E.posaObjectiu(DIALEGS.objectiuRunna(E)); }
            };
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
                { qui: '', text: 'Beus el flascó. Notes el cor més fort.\n+1 GRA AL ROSARI i rosari ple.' }
            ],
            enAcabar: () => { E.posaFlag('cofreTresor'); E.dades.corsMax += 1; E.dades.vida = E.dades.corsMax * 2; }
        };
    },

    cofreCabanaCami: E => {
        if (E.flag('cofreCabanaCami')) return { pagines: [{ qui: '', text: "El cofre és obert i buit. Només queda l'olor de fusta vella i de cera." }] };
        return {
            pagines: [
                { qui: '', text: "Una cabana de llenyataire oblidada, amagada entre els arbres. Ningú no hi ha entrat en anys: la pols és una catifa grisa." },
                { qui: '', text: "Al fons, un cofre petit. A dins, un flascó daurat embolicat amb un drap i una nota gastada: «Per a qui es perd pel camí i el troba.»" },
                { qui: '', text: "Beus el flascó. Notes el cor més fort.\n+1 GRA AL ROSARI i rosari ple." }
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
                { qui: "", text: "La Pianista prem les tecles amb els dits gruixuts i ràpids. Les notes surten... i s'apaguen a mig aire, com si algú se les empassés." },
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
                    { qui: 'Pare Daniel', text: 'No et preocupis: si la música s\'ha amagat, la cantarem perquè torni! Riure és la primera pregària.' }
                ],
                enAcabar: () => E.posaFlag('parlatDaniel')
            };
        }
        if (!E.te('clau_sagrari') && !E.flag('fragment2') && (E.flag('fragment1') || E.flag('sagrariVist'))) {
            return {
                pagines: [
                    { qui: 'Pare Daniel', text: 'El sagrari? Hi guardo quatre papers vells dels monjos, perquè la humitat no se\'ls mengi. Si el Pare Alcuí els busca, ja era hora que algú els llegís!' },
                    { qui: 'Pare Daniel', text: 'Té, la clau del sagrari. És aquesta petita, la que sembla de joguina. Torna a tancar quan acabis, eh?' },
                    { qui: '', text: 'Has obtingut la CLAU DEL SAGRARI.' }
                ],
                enAcabar: () => E.dona('clau_sagrari')
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
    // Sagrari del Retaule Major: hi ha el fragment 2 de la llegenda del monjo. És tancat fins que el Pare Daniel en dona la clau.
    sagrari: E => {
        if (E.flag("fragment2")) return { pagines: [{ qui: "", text: "El sagrari, tancat de nou amb la clau del Pare Daniel. A dins hi ha quedat el lloc buit on era el pergamí." }] };
        if (!E.te("clau_sagrari")) {
            return {
                pagines: [{ qui: "", text: "Al mig del retaule, el sagrari de fusta daurada. La porteta és tancada amb clau. El Pare Daniel en deu tenir la clau." }],
                enAcabar: () => E.posaFlag("sagrariVist")
            };
        }
        return {
            pagines: [
                { qui: "", text: "Gires la clau petita del Pare Daniel i la porteta del sagrari s'obre. A dins, darrere el calze, hi ha un pergamí doblegat amb cura (fragment 2 de 2):\n«El monjo va guardar el segell fins al darrer dia. Des d'aleshores la seva ombra torna cada nit al mur de les Runes a vigilar. Les relíquies dels seus germans, i amb elles la clau de ferro, són on ell les va deixar, sota la mirada d'un guardià de pedra.»" },
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
            { qui: 'Ineu', text: "Falta l'altre fragment. Potser a l'església... I cada nit, diuen, a aquest mur s'hi veu l'ombra d'un monjo." }
        ],
        enAcabar: () => E.posaFlag('fragment1')
    }),

    cartellRuinesPingpong: E => ({ pagines: [{ qui: '', text: "← Camí de la Desaparició\n→ Cementiri\n↑ Cel·les\n↓ Plaça" }] }),

    juli: E => ({
        pagines: [
            { qui: 'Juli', text: 'Ineu! Sabies que el ping-pong és física pura? Efecte Magnus, rebot, fricció... i els angelets de la samarreta són de l\'edició limitada.' },
            { qui: 'Juli', text: 'El meu pare, en Frederic, juga amb una pala de pedra. De pedra! I em guanya igualment. Frikis de mena.' },
            { qui: 'Juli', text: 'En Josep és el millor de la sala, i només es pot vèncer d\'una manera: tornant-li el servei. Quan hi hagi taula... jo t\'entreno.' }
        ]
    }),

    frederic: E => E.te("runna") && !E.flag("cofreCambra") ? {
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
            { qui: 'Frederic', text: 'Mira-li la mà al rival, no la pilota. I quan el cercle toqui l\'anell... ni abans, ni després. Això és tot.' },
            { qui: 'Frederic', text: 'La pala de pedra? Pesa, sí. Però no perdona ni dubta. Com jo.' }
        ]
    }),

    eloi: E => ({
        pagines: [
            { qui: 'Eloi', text: 'Mira qui ha vingut a perdre el temps. Soc l\'Eloi, el segon millor de la sala. I el primer, si no fos per aquell servei absurd d\'en Josep.' },
            { qui: 'Eloi', text: 'Vols jugar? Ho veurem aviat. Primer m\'he d\'escalfar... Però el repte important no és el meu: és el d\'en Josep.' },
            { qui: '', text: '(El ping-pong arribarà en una pròxima fase del joc.)' }
        ]
    }),

    josep: E => ({
        pagines: [
            { qui: 'Josep', text: 'Aquest és el meu servei. Ningú no l\'ha tornat mai. Ni l\'Eloi, per molt que presumeixi.' },
            { qui: 'Josep', text: 'Si vols vèncer-me, hauràs de tornar el meu servei: un sol partit, a set punts. I només et mostraré la màgia si saps tornar-la.' },
            { qui: '', text: '(Repte de ping-pong: pròxima fase.)' }
        ]
    }),

    taulaPP: E => ({ pagines: [{ qui: '', text: 'Una taula de ping-pong. Ara mateix hi ha massa gent per jugar-hi... aviat tindràs la teva oportunitat.' }] }),

    // ---------------- CEL·LES I TIL·LER ----------------
    neus: E => {
        if (E.flag("soparObert") && !E.flag("escudella")) {
            return {
                pagines: [
                    { qui: "Neus", text: "El sopar del Til·ler? Ai, Ineu, i qui té ganes de taula, aquest any! Amb el Pol fora..." },
                    { qui: "Neus", text: "...Però el Til·ler té raó, maleït sigui. No es pot deixar de fer el que s'ha fet sempre, ni quan el cor fa mal. Pren l'escudella, i no la vessis!" },
                    { qui: "Neus", text: "Hi he posat una cullerada més, com cada any: la del que falta. Enguany és per al Pol. Tu tingues-ne cura de portar-la sencera." },
                    { qui: "", text: "Has obtingut L'ESCUDELLA DE LA NEUS." }
                ],
                enAcabar: () => { E.dona("escudella"); E.posaFlag("escudella"); objectiuSopar(E); }
            };
        }
        return {
            pagines: [
                { qui: "Neus", text: "Ineu, fill, no t'hi quedis plantat! El Pol va marxar d'aquí fa dues nits i ningú no fa res!" },
                { qui: "Senyor Moliner", text: "Neus, deixa'l respirar..." },
                { qui: "Neus", text: "Tu calla, que ets tan pesat com el cafè d'ahir. Ineu, busca'l. I si veus la Júlia, que no surti de cel·la." }
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
    danielT: E => ({ pagines: [{ qui: 'Daniel', text: 'Bon dia, Ineu. Aquest és el meu nebot Turbo. No paris atenció si desapareix cada dos minuts.' }] }),
    turbo: E => ({ pagines: [{ qui: 'Turbo', text: 'Corro més que tu! Corro més que tu! Corro més que... on és el meu tió?' }] }),

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
            return { pagines: [{ qui: "El Gran Til·ler", text: "El permís és teu, petit monjo, i les espelmes continuen enceses. Recorda a taula qui hi falta. Ara ves a veure el Pare Alcuí: et falta el Saber." }] };
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
        return { pagines: [{ qui: "El Gran Til·ler", text: "Et donaré el meu permís quan hagis tornat la vida a la terra que la boira ha emmalaltit. Has tornat l'aigua: encara en falta, de terra." }] };
    },

    branca: E => ({
        pagines: [
            { qui: "", text: "Agafes la branca del Gran Til·ler. És lleugera, recta i càlida, com si encara respirés." },
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
                    { qui: "Pare Alcuí", text: "Amb el que m'expliques, ara ho entenc. «La foscor tem la llum, però més encara el riure.» La paraula que desperta Runna no és un conjur, fill: és «RIURE»." },
                    { qui: "", text: "Has après la PARAULA DEL SABER: «RIURE»." }
                ],
                enAcabar: () => { E.posaFlag("saber"); E.posaObjectiu(DIALEGS.objectiuRunna(E)); }
            };
        }
        if (E.flag("fragment3")) {
            return { pagines: [{ qui: "Pare Alcuí", text: E.flag("saber") ? "Ja saps la paraula, fill. Ara només cal que arribi el dia de pronunciar-la." : "Els dos fragments expliquen el mateix, fill: algú vigila el segell des de fa segles. Ves a les Runes quan caigui la nit, i no tinguis por de l'ombra." }] };
        }
        if (f1 && f2) {
            return {
                pagines: [
                    { qui: "Pare Alcuí", text: "Has trobat els dos fragments! Deixa'm llegir-los... Sí. Ho explica la Crònica que guardo a la biblioteca: un monjo va segellar la foscor amb la llum de Runna." },
                    { qui: "", text: "El Pare Alcuí, a la Crònica, assenyala un marge (llegit amb els dos fragments):\n«Des que la tercera església va quedar inacabada, l'ombra del monjo es veu clarament sobre el mur de les Runes: mig corbat, amb les mans unides, com si pregués. Apareix cada nit.»" },
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
                    { qui: "", text: "L'ombra gira lentament el cap cap a tu. Dins el teu cap, una veu molt baixa, de moltes veus." },
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
            { qui: "", text: "Les notes pugen cap al mur. L'ombra aixeca el cap, i per primer cop se li veu la cara: serena, vella, cansada." },
            { qui: "Monjo", text: "Jo era el qui va tancar la porta. Quan van obrir el cementiri, rient, els meus germans van deixar de descansar i el segell es va esquerdar." },
            { qui: "Monjo", text: "Sota terra hi ha una gàbia, petit monjo, i una cosa que no ha oblidat cap cant ni cap nen. Jo només puc vigilar. Tu pots tornar a tancar-ho." },
            { qui: "Monjo", text: "L'espasa dorm al sud-est, entre pedres, allà on el sol s'atura. Rep la meva benedicció, que no pesa ni es veu, i recorda: la foscor tem la llum, però més encara el riure." },
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
            { qui: "", text: "Les tres notes cauen sobre l'aigua com gotes de llum. La boira lila s'esfilagarsa, la bassa es torna clara, i al fons se sent un cop d'aigua: els gripaus han tornat a ser gripaus normals i se'n van saltant." },
            { qui: "Ineu", text: "Ha funcionat! L'aigua és neta..." }
        ],
        enAcabar: () => {
            E.posaFlag("bassadoriaNeta");
            E.posaObjectiu("La Bassadòria és neta. Segueix investigant: les Tietes i el Gran Til·ler tenen més coses a dir.");
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
                    { qui: '', text: 'Poses l\'herba de Sant Joan, el romaní i la pruna lila de la Prunera a la pica de la font.' },
                    { qui: '', text: 'L\'aigua s\'aclareix a poc a poc. Un fil de llum puja de les pedres i la boira lila fuig del bosc.' },
                    { qui: 'Ineu', text: 'Ha funcionat! Al fons de la pica hi ha un cristall que sembla de gel...' },
                    { qui: '', text: 'Has obtingut l\'AIGUA DE LA FONT DEL BISBE i un CRISTALL DE GEL.\nEl Garf, a l\'Era, segur que sap què fer-ne.' }
                ],
                enAcabar: () => {
                    E.posaFlag('fontNeta'); E.treu('pruna'); E.dona('aigua_sj'); E.dona('cristall_gel'); E.posaFlag('cristallGel');
                    E.posaObjectiu('Porta el Cristall de Gel al Garf, a l\'Era (camí de la Desaparició).');
                }
            };
        }
        return {
            pagines: [
                { qui: '', text: 'La Font del Bisbe: una font de pedra del temps de Sant Joan, seca i amb una olor estranya. Sobre la pica hi ha una mitra gravada: diuen que un bisbe, fa segles, hi va beneir l\'aigua.' },
                { qui: 'Ineu', text: 'Les Tietes diuen que la nit de Sant Joan aquesta aigua guaria. Ara està morta... Hi ha unes lletres gravades a la pica: «Herba de Sant Joan, romaní i el fruit de l\'arbre lila.»' },
                { qui: 'Ineu', text: 'Les herbes de la Nit de Sant Joan fan llum: n\'hi ha una al nord (cap al Til·ler) i el romaní al sud-est, sempre en una clariana. I l\'arbre lila... és la Prunera Màgica, al jardí de l\'Hostatgeria! Una pruna.' },
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
                    { qui: "", text: "Aboques unes gotes de l'aigua de la Font del Bisbe sobre les arrels. L'escorça beu amb un sospir; el forat s'eixampla i la claror es torna d'un verd profund." },
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
    cartellCirosa: E => ({ pagines: [{ qui: "", text: E.flag("camiCirosaObert") ? "↑ La Cirosa (camí llarg, tot el camí a munt)\n← La masia d'en Jordi\n↓ Les Cel·les" : "↑ La Cirosa\nEl camí és tancat per una bardissa viva. Diuen que només s'aparta amb la fusta del Gran Til·ler.\n← La masia d'en Jordi" }] }),

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
    altarErmita: E => ({
        pagines: [
            { qui: '', text: 'Un altar de pedra nua amb una creu de ferro. Hi ha cera vella i petites ofrenes de nens: pedretes, plomes, una trompeta de llauna.' },
            { qui: 'Ineu', text: 'Darrere l\'altar, a la paret, dues grans taules de pedra amb signes gravats.' }
        ]
    }),
    taulaPedra: part => E => {
        const inici = part === 1 ? 0 : 6;
        const mots = [];
        for (let i = inici; i < inici + 6; i++) mots.push(E.flag('col' + (i + 1)) ? PARAULES_MISSATGE[i] : SIGNES_MISSATGE[i]);
        const totes = Array.from({ length: 12 }, (_, i) => E.flag('col' + (i + 1))).every(Boolean);
        const pagines = [{ qui: '', text: `Taula de pedra ${part} de 2:\n\n${mots.join('   ')}` }];
        if (totes) {
            pagines.push({ qui: 'Ineu', text: 'Quan la boira cobreixi el Miracle, els passos dels absents tornaran amb l\'alba.' });
            if (!E.flag('missatgeDesxifrat')) {
                pagines.push({ qui: '', text: 'Al peu de la taula, dins d\'una nínxol, hi ha un fanalet vell.\nHas obtingut la LLANTERNA DE LA DESAPARICIÓ.' });
            }
        } else {
            pagines.push({ qui: 'Ineu', text: 'Només entenc les paraules que he apuntat al camí. Els signes que em falten... són a les columnes.' });
        }
        return {
            pagines,
            enAcabar: () => {
                if (totes && !E.flag('missatgeDesxifrat')) {
                    E.posaFlag('missatgeDesxifrat'); E.dona('llanterna'); E.posaFlag('llanterna');
                    E.posaObjectiu('Els nens tornaran amb l\'alba: cal trobar Runna al Dolmen.');
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
                    { qui: '', text: 'El Garf martelleja, mesura, bufa i fa saltar guspires. Al cap d\'una estona, et mostra un tub de llautó amb lents.' },
                    { qui: 'Garf', text: 'Un telescopi! Amb això veuràs coses que cap monjo no ha vist. Perquè no se\'t perdi: les estrelles fan camí.' },
                    { qui: '', text: 'Has obtingut el TELESCOPI DEL GARF.' }
                ],
                enAcabar: () => {
                    E.dona('telescopi'); E.posaFlag('telescopi'); E.treu('cristall_gel');
                    E.posaObjectiu('Segueix buscant Runna. (Els Dipòsits: més endavant.)');
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
    // L'Isidre dóna les tisores de podar la primera vegada que hi parles
    isidre: E => {
        const d = DIALEGS.isidreBase(E);
        if (E.te('tisores')) return d;
        const prev = d.enAcabar;
        return {
            pagines: [...d.pagines,
                { qui: 'Isidre', text: 'Espera, monjo, que no marxis així. Agafa aquestes tisores de podar: les he fet jo i tallen com el vent. Pel món hi ha arbustos tan espessos que amaguen coses... i tu tens cara de ficar el nas a tot arreu.' },
                { qui: '', text: 'Has obtingut les TISORES DE PODAR: amb ESPAI davant d\'un arbust espès, el podes.' }],
            enAcabar: () => { if (prev) prev(); E.dona('tisores'); }
        };
    },
    isidreBase: E => {
        if (E.flag("soparObert") && !E.flag("floresIsidre")) {
            return {
                pagines: [
                    { qui: "Isidre", text: "Sopar del Til·ler, eh? Cada any se n'omple el cap amb escudelles i s'obliden de les flors. Jo hi fico flors des que tenia dos peus bons." },
                    { qui: "", text: "L'Isidre, coix, va de parterre en parterre tallant amb una navalla petita. Al final et dona un ram embolicat amb un tros de pergamí." },
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
            { qui: '', text: 'A l\'extrem de ponent del jardí, una prunera vella i retorçuda, carregada de prunes d\'un lila que lluu com si fossin de vidre.' },
            { qui: 'Isidre', text: '(des de la pèrgola) No te\'n facis un fart, monjo! Són prunes màgiques: una sola et deixa com nou.' },
            { qui: '', text: 'Menges una pruna. Té gust de tardor, de mel i de música. Et sents completament renovat.' }
        ];
        const perFont = !E.flag('fontNeta') && !E.te('pruna') && !E.flag('herba3');
        if (perFont) pagines.push({ qui: '', text: 'En culls una altra i te la guardes al sarró: la Font del Bisbe en vol una.\nHas obtingut una PRUNA MÀGICA.' });
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
                { qui: 'Pains', text: 'La boira va entrar pel soterrani una nit de fa tres lluns. Vaig veure un home amb abric d\'ocells que s\'enduia les nenes del poble, rient baixet.' },
                { qui: 'Pains', text: 'Pren això, fill. El rosari d\'aquesta casa és vell i fort: que et doni una mica de la seva claror.' }
            ],
            enAcabar: () => premiMonja('Pains', 'premiPains')
        };
        return { pagines: [{ qui: 'Pains', text: 'Vés amb Déu, fill. La cadira em fa mal als ossos, però encara tinc bones orelles.' }] };
    },
    monjaPhili: E => {
        if (!E.flag('premiPhili')) return {
            pagines: [
                { qui: 'Phili', text: 'Per fi! Tres lluns que colpejo aquesta porta! Soc la Phili, i no, no m\'he estat quieta ni un minut.' },
                { qui: 'Phili', text: 'T\'ho dic perquè ho vaig veure: el Germà Andreu, el de la pilota, baixava a la Taverna cada nit amb una clau grossa. Mai no li he cregut el somriure.' },
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
        if (!E.flag("esquelles")) {
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
                { qui: "Pastor vell", text: "Fa anys que no sentim música vora el foc. Si algú en toqués... potser ens recordaria que encara som persones." }
            ] };
        }
        return { pagines: [{ qui: "Pastor vell", text: "Aquesta pastura torna a ser un lloc tranquil. Gràcies per això." }] };
    },

    // Es llança quan l'Ineu toca música vora la foguera dels pastors (durant el sopar del Til·ler)
    pastorsConvencuts: E => ({
        pagines: [
            { qui: "", text: "Les notes pugen amb el fum. Els pastors, que s'escalfaven en silenci, aixequen el cap un a un. La flama s'aviva sola." },
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
            { qui: "", text: "Cau el dia. De les cel·les surt la gent amb safates i cadires; per l'altre camí baixen, callats i amb el pa sota el braç, els pastors de la Cirosa." }
        ],
        enAcabar: () => game.scene.getScene("ZonaTiller").fesSopar()
    }),

    // El ritual: s'encén una espelma per cada absent... i una per qui no té nom
    tillerSoparRitual: E => ({
        pagines: [
            { qui: "", text: "Sota el Til·ler hi ha una taula llarguíssima: l'escudella fumeja, el pa dels pastors al mig, i flors de lluna entre els plats. Tres cadires buides, i una de més, al capdavall." },
            { qui: "Neus", text: "Aquest any m'he descuidat de fer-hi cantar ningú. I a l'escudella hi he posat una cullerada de més, com cada any: la del que falta. Enguany és per al Pol." },
            { qui: "Senyor Moliner", text: "...I jo hi he posat una altra per a ella. Per si de cas. Que no ho sàpiga." },
            { qui: "Tieta Enriqueta", text: "Sempre fem el mateix, fill: una espelma per cada llar que té una cadira buida. Encén-la tu, que ets qui ho ha de portar a terme." },
            { qui: "", text: "L'Ineu encén una espelma per al Biel. Una altra per al Pol. Una tercera per a la Martina. Mentre ho fa, ningú no diu res; només es veu com cada flama es reflecteix als ulls dels qui miren." },
            { qui: "Pastor vell", text: "I una quarta... per als que no tenen nom. Per als que ningú no va recordar. Si el pare ho permet." },
            { qui: "", text: "L'Ineu la posa a l'extrem. Les quatre flames tremolen alhora i, per un moment, es fan una de sola." },
            { qui: "El Gran Til·ler", text: "Aquesta és la saviesa que et volia donar, petit monjo: ningú no es perd del tot mentre algú el recorda a taula. La gàbia de l'Ocellaire només s'omple de qui s'ha quedat sol." },
            { qui: "El Gran Til·ler", text: "Rep el meu permís. Que et sigui lleu, i que no et faci oblidar mai que vas menjar amb tots." },
            { qui: "", text: "Una fulla de til·ler, daurada, es desprèn de la branca més alta i cau, giravoltant, a les teves mans.\nHas obtingut la FULLA DEL TIL·LER!" },
            { qui: "", text: "Els qui són a la taula mengen, riuen poc a poc, i algú comença a cantar a mitja veu. Des del Santuari, molt lluny, arriba una nota d'orgue que, per primer cop en dies, no s'apaga.\nEl sopar t'omple de força: +1 gra al rosari, i el rosari torna a brillar sencer." }
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
            { qui: "", text: "Quatre espelmes que no s'han apagat des del sopar, vora les arrels del Til·ler: per al Biel, per al Pol, per a la Martina... i una de més, per qui no té nom." },
            ...(E.flag("rescatBiel") && E.flag("rescatPol") && E.flag("rescatMartina") ? [{ qui: "", text: "Les tres primeres s'han apagat soles, i fa olor de cera tèbia i de rialles." }] : [])
        ]
    }),

    andreuPastor: E => ({
        pagines: [
            { qui: "", text: "Al mig de la pastura, el Germà Andreu aixeca una caiada. Els ulls li brillen lila, i el ramat de boira bessa al seu voltant." },
            { qui: "Germà Andreu", text: "Ineu! Has pujat fins aquí... Mira'ls. Mira com em segueixen. Ningú no m'havia seguit mai." },
            { qui: "Germà Andreu", text: "El Mestre m'ho va prometre: «Tots els que tinguin por et seguiran.» Jo no el trobo a faltar: l'admiro. I ara sóc el seu pastor. El PASTOR!" },
            { qui: "Ineu", text: "Andreu, això que et parla no és bo. Encara pots tornar enrere." },
            { qui: "Germà Andreu", text: "Tornar enrere? Mai! El Mestre em va veure, quan ningú més no ho feia. Calla! Be-e-e!" }
        ],
        enAcabar: () => game.scene.getScene("ZonaCirosa").iniciarBoss()
    }),

    andreuDerrotat: E => ({
        pagines: [
            { qui: "", text: "El Pastor cau de genolls. La boira surt del seu cos com un fum lila i s'escampa entre els xais, que de sobte tornen a ser blancs." },
            { qui: "Germà Andreu", text: "Has guanyat aquesta, monjo... Fa trenta anys que ningú no em mirava, i ell sí. Mai no li fallaré." },
            { qui: "Germà Andreu", text: "El Mestre és sota el Bar, i ja és despert. Vine, si goses: els nens ja són seus, i jo només sóc el primer dels seus ocells." },
            { qui: "", text: "El Germà Andreu s'aixeca, riu amb un riure sec i s'allunya pel camí, cap al sud, cap a la Taverna." },
            { qui: "Ineu", text: "(«Sota el Bar»... Ara ja sé on mirar.)" }
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
                    { qui: "", text: "En una corba del camí, una nena transparent seu a terra, amb dues trenes llargues i sense res que les lligui. Plora sense fer soroll; on cauen les llàgrimes, l'herba es posa blanca." },
                    { qui: "Nena de les Trenes", text: "No et facis enrere, si us plau... No vull espantar ningú. Només que, quan arriba algú, sempre fuig." },
                    { qui: "Nena de les Trenes", text: "Vaig venir a collir rovellons amb la mare. Em va lligar les dues trenes amb dos llaços rosa, i em vaig perdre pel bosc. Fa molts, molts anys. No he pogut marxar d'aquí." },
                    { qui: "Nena de les Trenes", text: "Els llaços van caure mentre corria: un va quedar pel camí, amagat sota una roca, i l'altre ja dins el bosc dels rovellons, darrere un arbust. Sense ells, no sento les mans de la mare. Si me'ls tornessis a lligar..." },
                    { qui: "Ineu", text: "Els trobaré. Et prometo que no hauràs de plorar sola." }
                ],
                enAcabar: () => {
                    E.posaFlag("nenaVista");
                    E.posaObjectiu("Troba els dos llaços de la Nena de les Trenes (un sota una roca del camí; l'altre darrere un arbust de la Rovellonera) i porta-li-los.");
                }
            };
        }
        if (n < 2) {
            return { pagines: [{ qui: "Nena de les Trenes", text: "Has trobat " + n + " dels 2 llaços? Un és pel camí, sota una roca que cal empènyer... i l'altre, més endins, darrere un arbust, entre els pins. Jo m'espero." }] };
        }
        return {
            pagines: [
                { qui: "Nena de les Trenes", text: "Els has trobat... Els dos? Oh, monjo..." },
                { qui: "", text: "L'Ineu s'agenolla davant la nena. Amb molta cura, perquè sembla de boira, lliga un llaç rosa a cada trena. Sota els seus dits, els cabells es fan, per un moment, de debò." },
                { qui: "Nena de les Trenes", text: "Les sento... Sento les mans de la mare! Mare...? Mare, ets tu? M'has trobat?" },
                { qui: "", text: "A la corba del camí, una dona sense rostre ni veu s'agenolla i obre els braços. La nena corre cap a ella, i quan s'abracen, tot es torna llum." },
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
            E.posaObjectiu(n < 2 ? "Troba el segon llaç de la Nena de les Trenes (" + n + "/2)." : "Ja tens els dos llaços: porta-los a la Nena de les Trenes, a la corba del camí.");
        }
    }),

    // ---------------- SANT GABRIEL ----------------
    altarGabriel: E => ({
        pagines: [
            { qui: "", text: "Un altar senzill de blocs de pedra clara, amb una creu i dos canelobres de ferro. Al costat de la creu, un calze d'argent entelat, ple d'aigua de rosada del matí." },
            ...(E.flag("calze") ? [] : [{ qui: "", text: "Un raig de claror baixa de la finestra i es posa al calze. És el CALZE DE ROSADA: cada cop que en beguis, et sentiràs renovat." }]),
            { qui: "", text: "Beus l'aigua fresca del calze. Et sents renovat." }
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
                { qui: "", text: "Poses el telescopi del Garf a la tripode. La nit és neta i freda, i fa olor de pedra mullada." },
                { qui: "Ineu", text: "Diuen que per Sant Llorenç el cel plora. Compta les llàgrimes... i potser et mostraran alguna cosa." }
            ],
            enAcabar: () => { E.posaFlag("telescopiMuntat"); game.scene.start("Estels"); }
        };
    },

    // La llum que ha deixat l'últim estel a l'aigua del dipòsit de llevant
    estelDiposit: E => ({
        pagines: [
            { qui: "", text: "T'enfiles per l'escala de ferro del dipòsit. A l'aigua, arran del coronament, sura una pedreta que fa una llum freda i blava, com la dels estels fugaços." },
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
        if (!E.flag("saber")) falta.push("la Paraula del Saber (Pare Alcuí)");
        if (!E.flag("benediccio")) falta.push("la Benedicció del prior (Pare Jordi)");
        if (falta.length) {
            return { pagines: [
                { qui: "", text: "Una espasa clavada entre les lloses, fosca i tranquil·la, com si dormís. Sembla que et reconegui... però no s'inmuta." },
                { qui: "Ineu", text: "Em falta: " + falta.join(", ") + ". Quan ho tingui, tornaré." }
            ] };
        }
        return {
            pagines: [
                { qui: "", text: "L'Ineu s'agenolla davant l'espasa. Posa la Fulla del Til·ler sobre la llosa, i la fulla fa un petit llum daurat." },
                { qui: "Ineu", text: "Per la benedicció del prior, pel permís de l'arbre vell, i per la paraula que fa servir la foscor com a cant... RIURE." },
                { qui: "", text: "El silenci del Dolmen es trenca. L'aire vibra com una corda tibada." }
            ],
            enAcabar: () => game.scene.getScene("ZonaDolmen").despertarRunna()
        };
    },

    runnaDespertada: E => ({
        pagines: [
            { qui: "", text: "L'espasa surt de la pedra sola, llisca fins a la mà de l'Ineu i s'acomoda al palmell com si hi hagués viscut sempre." },
            { qui: "Runna", text: "Fa molt que dormo. Hi torna a haver una gàbia, oi? Anem-hi." },
            { qui: "Ineu", text: "Runna... Tu em parles al cap!" },
            { qui: "Runna", text: "Em sents perquè em vas somriure al despertar-me. Es veu que això de riure encara funciona." },
            { qui: "", text: "Has obtingut RUNNA, L'ESPASA DEL MIRACLE!\nFa 2 de dany. Les escolopendres cauen d'un sol cop." }
        ],
        enAcabar: () => {
            E.dona("runna"); E.posaFlag("runna");
            E.posaObjectiu("Les ombres s'han fet més fortes. Parla amb el Frederic, al Celler (a les Runes): sap com baixar-hi per una altra banda.");
        }
    }),

    dolmenBuit: E => ({
        pagines: [{ qui: "", text: "La llosa del Dolmen, buida i tèbia. Al lloc on dormia Runna ha quedat una empremta de llum que no s'acaba d'apagar." }]
    }),

    objectiuRunna: E => {
        const falta = [];
        if (!E.flag("saber")) falta.push("la Paraula del Saber (Pare Alcuí)");
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
                { qui: "", text: "Beus la gota. Notes com el pit se't fa més ample.\n+1 GRA AL ROSARI i rosari ple." }
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
            { qui: "", text: "La reixa del porxo, vista des de dins: unes cadenes gruixudes i una barra de ferro travessada. De fora no hi ha qui l'obri, però per dins n'hi ha prou amb aixecar la barra." },
            { qui: "", text: "L'Ineu aixeca la barra amb un xiscle de ferro vell. La reixa cedeix una mica: ara es pot sortir a la plaça (per dins; de fora continua tancada)." }
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

    taverna: E => ({ pagines: [
        { qui: '', text: 'La porta de la Taverna és tancada amb pany i clau. Al vidre hi ha un paper clavat amb xinxetes: «Avui no servim. — Carmen».' },
        { qui: 'Ineu', text: 'Des de dins se sent un fil de música d\'acordió, molt baixet... i una olor de fregit que no s\'acaba d\'esvair.' }
    ] }),


    // Cambra secreta dels monjos (sala del tresor, entre el Celler i la Casa Gran)
    cofreCambra: E => {
        if (E.flag("cofreCambra")) return { pagines: [{ qui: "", text: "El cofre és obert i buit. Només queda un pergamí de tapes de cuir." }] };
        return {
            pagines: [
                { qui: "", text: "Una cambra secreta que els monjos van fer servir fa segles: un cofre massís entre botes buides. A dins, un flascó de vidre amb un líquid daurat i un pergamí de tapes de cuir." },
                { qui: "", text: "Beus el flascó. Notes el cor més fort.\n+1 GRA AL ROSARI i rosari ple." },
                { qui: "", text: "Has obtingut el PERGAMÍ DEL MONJO." },
                { qui: "Pergamí del monjo", text: "«Les relíquies dels meus germans i la clau de ferro són sota l'escala, murades. Un guardià de pedra les vigila: ningú no hi baixa si no li gira el cap cap al sol que neix. On neix el sol, el raïm madura.»" },
                { qui: "", text: "Al fons de la sala s'ha desfet un pany: una porta de fusta s'obre cap a l'escalinata de la Casa Gran." }
            ],
            enAcabar: () => {
                E.dona("pergami_monjo"); E.posaFlag("cofreCambra");
                E.dades.corsMax += 1; E.dades.vida = E.dades.corsMax * 2;
                E.posaObjectiu(E.te("palanca") ? "Puja a l'escalinata de la Casa Gran: gira el cap de l'Home del Raïm cap a llevant amb la palanca i prem-li el raïm." : "L'Home del Raïm guarda les relíquies: cal una palanca. En Jordi de la Caseta (darrere el Til·ler) en té una.");
            }
        };
    },

    homeRaimInt: E => ({
        pagines: [
            { qui: "", text: "Al mig de la gran escalinata, l'Home del Raïm: una escultura de pedra gairebé tan alta com dos homes, amb un carràs de raïm de marbre a les mans." },
            { qui: "Ineu", text: "Té el cap girat cap enrere, com si vigilés la porta de sota l'escala. Sembla que guardi alguna cosa." },
            { qui: "", text: "(Cal una palanca per fer-lo girar. L'en Jordi, de la masia a l'oest del Til·ler, en té una.)" }
        ]
    }),

    portaRetrats: E => ({ pagines: [{ qui: "", text: "Dalt de l'escalinata, una porta de doble batent: la Sala dels Retrats.\n(Tancada per ara: la masmorra s'obrirà en una fase propera.)" }] }),
    portaCeller: E => ({ pagines: [{ qui: "", text: "Una porta baixa, de ferro, amb un pany antic, sota el pas de l'escala. Del forat de la pany surt aire fred.\nSembla que l'Home del Raïm en tingui la clau... (Clau de ferro, per a la fase propera.)" }] }),

    // ---------------- LA CABANA DE LA JAUMETA ----------------
    // La Jaumeta, bruixa del bosc: una curiositat. Hi vas pel portal de l'Alzina Buida i et diu la pista del moment (és vident)
    jaumeta: E => {
        const pista = pistaActual(E).replace(/^Fill, /, "");
        if (!E.flag("jaumetaVista")) {
            return {
                pagines: [
                    { qui: "", text: "Dins la cabana fa olor de fum, de pèl mullat i de sopa de fa setmanes. Una dona petita i espigada, amb uns cabells feréstecs plens de fulles, remena una olla negra amb una cullera de fusta." },
                    { qui: "La Jaumeta", text: "Ei! Tu! Qui coi t'ha dit que podies entrar? Els frares no veniu mai per aquí! Fot el camp o et faig créixer bolets a les orelles!" },
                    { qui: "Ineu", text: "Perdoni... He arribat per l'alzina. Duc aigua de la Font del Bisbe." },
                    { qui: "La Jaumeta", text: "Aigua... de la Font del Bisbe?! Dona'm aixòooo! Fa trenta anys que no en tinc ni una gota neta." },
                    { qui: "", text: "L'agafa, destapa l'ampolla amb les dents i la buida a mitges a l'olla. SPLASH verd! La cabana s'omple d'una olor de menta, de roses i de pluja." },
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
            { qui: "", text: "Destapes l'ampolla de la Jaumeta i n'aboques el beuratge a la boira. Fa un so de ferro roent... i la boira es retira davant teu, com si tingués por." },
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
                { qui: "", text: "Acostes la branca del Gran Til·ler a la bardissa. S'estremeix... però no es mou." },
                { qui: "Ineu", text: "Sembla que espera alguna cosa: potser que l'aigua clara de la Bassadòria torni a respirar." }
            ] };
        }
        return { pagines: [
            { qui: "", text: "Passes la branca del Gran Til·ler entre les punxes. Les branques de la bardissa es retiren, una a una, com si reconeguessin una veu molt antiga." }
        ] };
    },

    masiaJordi: E => ({ pagines: [{ qui: "", text: "La masia d'en Jordi: de pedra vella, amb les finestres obertes de bat a bat i una olor de pa torrat. La porta és tancada: en Jordi és al jardí." }] }),

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
                { qui: "", text: "Aparteu els soldadets de fusta i una baldufa: sota, entre un tambor sense pell i una pilota, hi ha una palanca de ferro, de les bones." },
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
                { qui: "", text: "Treus les flors marcides del gerro i hi poses el ram del Germà Francesc, als peus de l'àngel. Hi encens l'espelmeta. Per un moment, la boira s'aparta i hi toca el sol." }
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
    },

    // ---------------- GENÈRICS ----------------
    enConstruccio: nom => E => ({
        pagines: [{ qui: '', text: `${nom}\n(Aquesta zona encara s'està construint. Aviat hi podràs entrar!)` }]
    })
};
