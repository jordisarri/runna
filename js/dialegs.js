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
                    ? "Pobreta, no té el cap per res: fa dues nits que busca el seu gos, el Pallofa. Si el trobes i li'l portes, segur que et dona la clau."
                    : "Parla-hi, però amb paciència: la pobreta no és la mateixa des que va pujar la boira. Potser et pot necessitar." }
            ]
        };
    }
    return { pagines: [{ qui: 'Les Venerables Sàvies', text: "Ai, fill, torna a seure. A veure... " + pistaActual(E) }] };
}

// Objectiu viu del sopar del Til·ler: diu què falta
function objectiuSopar(E) {
    const f = [];
    if (!E.flag("escudella")) f.push("l'escudella de la Meus");
    if (!E.flag("floresIsidre")) f.push("les flors d'Isílder (Hostatgeria)");
    if (!E.flag("pastorsConvencuts")) f.push(E.flag("cantPedres") ? "el pa dels pastors de la Cirosa (toca'ls el cant vora el foc)" : "el pa dels pastors (primer, una música antiga: la Pianista)");
    E.posaObjectiu(f.length ? "El sopar del Til·ler: falta " + f.join(", ") + "." : "Tot a punt: torna al Gran Til·ler per al sopar.");
}

// Quan s'allibera la tercera sacerdotessa (sigui quina sigui) el rosari guanya un gra (+1 cor) i l'Hostatgeria obre la porta per dins;
// la mateixa sacerdotessa avisa que al vestíbul hi ha aparegut el premi (un cofre amb l'Empara Fraternal)
const ultimaMonja = nom => ['Pains', 'Phili', 'Charm'].filter(n => n !== nom).every(n => Estat.flag('premi' + n));
const NOMS_MONJA = { Pains: 'Dolora', Phili: 'Pilària', Charm: 'Carmèlia' };      // els identificadors (premiPains...) es queden; aquests són els noms que es veuen
const avisPremiMonja = nom => ({ qui: NOMS_MONJA[nom], text: "Al vestíbul t'hem deixat la nostra Empara, fill. T'ajudarà a protegir-te de la boira de l'avenc i salvar els nens segrestats." });
function premiMonja(nom, flag) {
    const E = Estat;
    E.posaFlag(flag);
    const ui = game.scene.getScene('UI');
    if (E.flag('premiPains') && E.flag('premiPhili') && E.flag('premiCharm')) {
        E.posaFlag('mongesTrobades');
        if (ui) {
            ui.obrirDialeg({
                pagines: [
                    { avis: "Has obtingut un GRA DEL ROSARI: la llum de les tres germanes (+1 cor).", obj: 'gra_rosari' }
                ],
                enAcabar: () => {
                    E.afegirGra();
                    ui.actualitzarHUD();
                    E.posaObjectiu("Les sacerdotesses són lliures. Al vestíbul de l'Hostatgeria t'espera el premi.");
                    E.desar();
                }
            });
        } else {
            E.afegirGra();
            E.posaObjectiu("Les sacerdotesses són lliures. Al vestíbul de l'Hostatgeria t'espera el premi.");
            E.desar();
        }
    } else {
        const f = ['Pains', 'Phili', 'Charm'].filter(n => !E.flag('premi' + n));
        E.posaObjectiu('Encara hi ha sacerdotesses per trobar: ' + f.map(n => NOMS_MONJA[n]).join(', ') + '.');
    }
    E.desar();
}

const DIALEGS = {

    // ---------------- PLAÇA ----------------
    pareJordi: E => {
        if (!E.flag("clauerNovici")) {
            return {
                pagines: [
                    { qui: "Pare Jordà", text: "Ineu, bon dia. Que bé que hagis sortit, et buscava." },
                    { qui: "Pare Jordà", text: "No et vull espantar. Fa tres nits que una boira violeta surt de sota terra, i cada nit falta un nen: l'Huri i el Fram, de les cel·les de Sant Benet, porta amb porta; i aquesta nit, el Sardi, el protegit de les sacerdotesses de l'Hostatgeria." },
                    { qui: "Pare Jordà", text: "Ningú no els ha vist marxar. Els llits són desfets i les finestres, tancades per dins. Només queda una olor de terra mullada." },
                    { qui: "Pare Jordà", text: "Tu tens bons ulls i bon cor. Parla amb tothom i explica-m'ho tot. Ves amb compte pels camins, Ineu." }
                ],
                enAcabar: () => {
                    E.posaFlag("clauerNovici");
                    E.posaObjectiu(E.flag("bastoObtingut") ? "Parla amb la gent del Santuari. Després, ves a les cel·les." : "Passa a veure el Germà Aldreu, vora els xiprers de la plaça. Després, ves a les cel·les.");
                }
            };
        }
        if (E.flag("fullaTiler") && !E.flag("benediccio")) {
            return {
                pagines: [
                    { qui: "Pare Jordà", text: "Ineu! Ho he sentit: el Til·ler t'ha donat el seu permís. Aquell arbre no en dóna ni a mi." },
                    { qui: "Pare Jordà", text: "Mira, fill: jo no soc valent com tu, però sí que sé una cosa. Una benedicció no és una paraula màgica, és voler bé de debò. Ajup el cap." },
                    { fer: (z, fet) => z.seq([c => z.npcVa('pare_jordi', z.ineu.x + 60, z.ineu.y + 4, c), c => z.npcMira('pare_jordi', 'ineu', c), c => { z.ajupir('ineu'); z.llum(z.ineu.x, z.ineu.y - 90, 0xffe8a0, c); }], fet) },
                    { qui: "Pare Jordà", text: "No vas sol, Ineu. Vas amb tot el Miracle darrere teu." },
                    { qui: "Pare Jordà", text: "I pren això. És un medalló de pedra, amb una mà oberta tallada, que ha passat de mà en mà per les generacions de priors del Miracle. Ara ha de ser teu: duu-lo a la placa del Dolmen." },
                    { avis: "Has obtingut el MEDALLÓ DE LA BENEDICCIÓ!", obj: 'medallo_benedicio' }
                ],
                enAcabar: () => { E.dona("medallo_benedicio"); E.posaFlag("benediccio"); E.posaObjectiu(DIALEGS.objectiuRunna(E)); }
            };
        }
        if (E.te("basto_tiller") && !E.flag("runna")) {
            return { pagines: [
                { qui: "Pare Jordà", text: "Ineu, la gent diu que has parlat amb el Gran Til·ler. Per despertar Runna et calen tres coses: el permís de l'arbre (el seu medalló), les Paraules del Saber del Pare Alcoví i la meva benedicció." },
                { qui: "Pare Jordà", text: pistaRunna(E) }
            ] };
        }
        if (E.flag("combatActiu")) {
            return { pagines: [
                { qui: "Pare Jordà", text: "Les bestioles han sortit pels camins, Ineu. Fins i tot alguns visitants, que pujaven al Miracle a fer fotos, vagaregen amb la pell verdosa i la mirada perduda: la boira els ha trastocat i no saben ni qui són. Si en veus pel Santuari o pel Cementiri, no t'espantis." },
                { qui: "Pare Jordà", text: "No són dolents, pobrets: només fes-los dormir i es despertaran sense recordar res. Quan la boira se'n vagi, tornaran a ser turistes." },
                { qui: "Pare Jordà", text: "I torna abans que es faci fosc." }
            ] };
        }
        return {
            pagines: [
                { qui: "Pare Jordà", text: "Parla amb la gent: les famílies de les cel·les, els germans, la Pianista... Algú haurà vist alguna cosa." },
                { qui: "Pare Jordà", text: "Si et perds, les Venerables Sàvies de les cel·les sempre tenen un bon consell." }
            ]
        };
    },

    germaAldreu: E => {
        if (!E.flag('bastoObtingut')) {
            return {
                pagines: [
                    { qui: 'Germà Aldreu', text: 'Ineu! Quin drama, oi? Tothom corrent amunt i avall... Segur que els nens s\'han amagat per jugar.' },
                    { qui: 'Germà Aldreu', text: 'Ets del Barça, tu? Tinc uns cromos que els nens es moren per tenir. Ells sí que m\'escolten.' },
                    { qui: 'Germà Aldreu', text: 'Ei, pren aquest bastó de pelegrí. Era d\'un vell que ja no el vol.' },
                    { fer: (z, fet) => z.objecteVola('germa_aldreu', () => z.ineuAixeca('ineu_aixeca_basto', fet, 0.58), 'arma_basto') },
                    { avis: 'Has obtingut el BASTÓ DE PELEGRÍ!' },        // quadre de diàleg: l'Ineu hi roman alçant el bastó fins que s'avança
                    { fer: (z, fet) => z.ineuBaixa(fet) }
                ],
                enAcabar: () => {
                    E.posaFlag('parlatAndreu');
                    E.dona('basto'); E.posaFlag('bastoObtingut'); E.posaFlag('tutorialCombat'); E.posaFlag('combatActiu');
                    if (E.flag('clauerNovici')) E.posaObjectiu('Parla amb la gent del Santuari. Després, ves a les cel·les.');
                }
            };
        }
        return {
            pagines: [
                { qui: 'Germà Aldreu', text: 'Avui no tinc temps, Ineu. Tinc... coses a fer. Força Barça!' }
            ]
        };
    },

    bassadoria: E => E.flag("bassadoriaNeta") ? ({
        pagines: [{ qui: "Ineu", text: "L'aigua ja és neta: torna a ser clara i tranquil·la, i la boira violeta s'ha esvaït. Ara sí que se sent com canta." }]
    }) : ({
        pagines: [
            { qui: "Ineu", text: "L'aigua sempre ha estat clara... Ara és tèrbola i fa olor de soterrani. I en surten aquests gripaus enverinats i una boira violeta, a glopades." }
        ]
    }),

    creu: E => ({
        pagines: [
            { qui: 'Ineu', text: E.flag('bassadoriaNeta')
                ? 'Les flors del peu de la creu s\'han redreçat. Ara que l\'aigua torna a ser clara, també elles tornen a tenir color.'
                : 'Avui les flors estan pansides. Com si la boira se\'n begués el color.' }
        ]
    }),

    cartellPlaca: E => ({ pagines: [{ qui: 'Cartell', text: "↑ El Celler i les Runes\n← Casa Gran\n↓ La Bassadòria" }] }),
    pedraSecreta: E => ({ pagines: [] }),
    // La pedra de la cantonada de la façana, abans d'obrir-la: no lliga amb les altres i sembla que escolti
    pedraEscolta: E => ({ pagines: E.flag('tresorObert') ? [] : [
        { qui: 'Ineu', text: E.flag('cantPedres')
            ? "(Aquesta pedra no lliga amb la resta de la façana. Hi poso l'orella i sembla que escolti... Potser vol sentir el Cant de Vespres.)"
            : "(Aquesta pedra no lliga amb la resta de la façana. Hi poso l'orella i sembla que escolti... però no sé què vol sentir.)" }
    ] }),
    pedraSecretaOberta: { pagines: [
        { qui: 'Ineu', text: 'Un passatge entre el Monestir i el Santuari! Els monjos antics sí que en sabien, d\'amagar coses.' }
    ] },
    faristolOratori: E => ({ pagines: [
        { qui: 'Ineu', text: "«Les pedres guarden el que se'ls diu. Qui calla prou estona, les sent respondre.»" }
    ] }),
    cofreTresor: E => {
        if (E.flag('cofreTresor')) return { pagines: [] };
        return {
            pagines: [
                { fer: (z, fet) => z.obrirReliquiari ? z.obrirReliquiari(fet) : fet() },
                { qui: 'Nota', text: '«Per al qui sap escoltar les pedres.»' },
                { avis: E.dades.corsMax < E.GRANS_MAX ? "Has obtingut un GRA DEL ROSARI (+1 cor)." : "El rosari ja té tots els grans: queda ple.", obj: 'gra_rosari' }
            ],
            enAcabar: () => { E.posaFlag('cofreTresor'); E.afegirGra(); }
        };
    },

    // L'Iscu, el fill de la Càren, s'ha escapat de fregar gots i s'amaga a la cabana del camí de la Desaparició, on ha trobat una baralla vella
    ciscu: E => {
        // La clau rovellada: al Germà Aldreu li va caure davant la porta de ferro, i l'Iscu la va trobar
        const clau = [
            { qui: 'Iscu', text: 'Ei, espera. Tinc una cosa que potser et va bé. Una nit, passant per davant la porta de ferro de les Gírgoles, vaig veure una clau a terra: li havia caigut al Germà Aldreu i ni se\'n va adonar.' },
            { qui: 'Iscu', text: 'És rovellada, però encara gira. Te la dono: jo no tinc res a obrir.' },
            { avis: 'Has obtingut la CLAU ROVELLADA', obj: 'clau_girgoles' },
            { qui: 'Iscu', text: 'Crec que és per a la porta petita del fons, la del pany petit. I tu no m\'has vist, eh?' }
        ];
        const donar = () => { E.posaFlag('ciscuTrobat'); E.posaFlag('clauGirgoles'); E.dona('clau_girgoles'); E.posaObjectiu(PROGRES.pista(E)); };
        if (!E.flag('ciscuTrobat')) return {
            pagines: [
                { fer: (z, fet) => z.seq([c => z.bombolla('ciscu', '!', c, 600), c => z.npcSalta('ciscu', c, 1)], fet) },
                { qui: 'Iscu', text: 'Xxt! Baixa la veu! Si la mare em troba, em fa fregar gots fins a Nadal.' },
                { qui: 'Iscu', text: 'Em dic Iscu. Vaig trobar el forat entre els arbres «per on els grans no hi caben» i aquesta cabana. Ningú més no la coneix: aquí ningú em mana res!' },
                { qui: 'Iscu', text: 'Hi havia una baralla vella damunt la taula, i m\'encanta fer solitaris amb les cartes. Més val això que fregar gots!' },
                ...clau
            ],
            enAcabar: donar
        };
        if (!E.flag('clauGirgoles')) return { pagines: clau, enAcabar: donar };
        return { pagines: [
            { qui: 'Iscu', text: 'Em passaria tot el dia fent solitaris amb aquestes cartes. I aquí, almenys, no hi ha gots per fregar.' }
        ] };
    },

    solitari: E => ({ pagines: [] }),

    cofreCabanaCami: E => {
        if (E.flag('cofreCabanaCami')) return { pagines: [] };
        return {
            pagines: [
                { qui: 'Nota', text: "«Per a qui es perd pel camí i el troba.»" },
                { avis: E.dades.corsMax < E.GRANS_MAX ? "Has obtingut un GRA DEL ROSARI (+1 cor)." : "El rosari ja té tots els grans: queda ple.", obj: 'gra_rosari' }
            ],
            enAcabar: () => { E.posaFlag('cofreCabanaCami'); E.afegirGra(); }
        };
    },

    // ---------------- ESGLÉSIA ----------------
    pianista: E => {
        const primera = !E.flag("parlatPianista");
        if (!E.flag("cantAurora")) {
            const intro = primera ? [
                { qui: "La Pianista", text: "Ai, Ineu, fill... Passa, passa. Perdona que no et miri, no puc deixar l'orgue." },
                { fer: (z, fet) => z.npcFeina('pianista', 1600, 'silenci', fet) },
                { qui: "La Pianista", text: "Fa quaranta anys que toco cada dia i mai no m'havia faltat el so. Ara els dits es mouen per les tecles, però de l'orgue no en surt ni una nota." },
                { qui: "La Pianista", text: "Des que va arribar la boira, fa tres nits, el Santuari s'ha quedat mut. Em fa por que s'estigui empassant tota la música." }
            ] : [{ qui: "La Pianista", text: "Ho tornem a provar, fill? Escolta bé les tres notes." }];
            return {
                pagines: [...intro,
                    { qui: "La Pianista", text: "Però hi ha un cant que encara em surt, perquè la boira no se'l pot empassar: el Cant de l'Aurora. Te l'ensenyaré. Escolta'm i repeteix les notes amb 1, 2 i 3 (o amb ← ESPAI →)." }
                ],
                enAcabar: () => { E.posaFlag("parlatPianista"); iniciarLliço("aurora"); }
            };
        }
        // El Cant de Vespres: l'Ineu el demana a la Pianista, o perquè l'ombra del monjo ha dit que qui toca l'orgue el coneix, o perquè el Til·ler l'hi
        // ha remès pels pastors de la Cirosa. Ella no sap res de l'ombra ni dels pastors: ho sap pel que l'Ineu li explica.
        if ((E.flag("ombraDemanaCant") || E.flag("soparObert")) && !E.flag("cantPedres")) {
            const perOmbra = E.flag("ombraDemanaCant");
            return {
                pagines: [
                    { qui: "Ineu", text: perOmbra
                        ? "Una ombra de monjo, a les Runes, diu que vostè coneix un cant que les pedres entenen."
                        : "Els pastors de la Cirosa fa anys que no senten música vora el foc. El Gran Til·ler diu que vostè guarda un cant tan vell com ells." },
                    { qui: "La Pianista", text: perOmbra
                        ? "Un cant que les pedres entenen? Ai, fill... Potser és el de Vespres: és molt vell, me'l va ensenyar la meva mare. Vine, escolta."
                        : "Un cant tan vell com ells? Tinc el de Vespres, fill: molt vell, me'l va ensenyar la meva mare. Potser els recorda casa. Vine, escolta." }
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
                    { qui: "La Pianista", text: "Duen una música antiga. Amb la tarota, els cants antics encara desperten allò que dorm sota la boira. Vés amb compte, que amb aquesta força la boira no et perdonarà." }
                ],
                enAcabar: () => E.posaFlag("esquellesVistes")
            };
        }
        return { pagines: [{ qui: "La Pianista", text: E.flag("bassadoriaNeta")
            ? "Se sent l'aigua cantar des d'aquí, fill. Ho has aconseguit. Torna a veure'm quan tinguis un altre cant per aprendre."
            : "Si trobes la manera de tornar la música, porta-me-la. Jo no em moc d'aquest banc, ni que s'acabi el món. Toca el cant amb la tarota quan siguis al lloc on cal." }] };
    },

    pareDaniel: E => {
        // Del sagrari només en parla quan l'Ineu ja té el primer pergamí (que el diu): llavors és com si li ho preguntés ell.
        // A la primera conversa només hi ha el cor i el rellotge aturat.
        const sagrari = !E.te('clau_sagrari') && !E.flag('fragment2') && E.flag('fragment1');
        const paginesSagrari = [
            { qui: 'Ineu', text: "Pare Daimiel, el pergamí que he trobat a les Runes diu que l'altra meitat és al sagrari. Sap on és la clau?" },
            { qui: 'Pare Daimiel', text: 'El sagrari? Hi guardo quatre papers vells dels monjos, perquè la humitat no se\'ls mengi. Si el Pare Alcoví els busca, ja era hora que algú els llegís!' },
            { qui: 'Pare Daimiel', text: 'Però la clau, ai, fa anys que no sé on para: una de petita, que sembla de joguina. Els monjos antics deixaven les seves coses a l\'ermita de la Desaparició. Potser és allà.' }
        ];
        if (!E.flag('parlatDaniel')) {
            return {
                pagines: [
                    { qui: 'Pare Daimiel', text: 'Ineu! Quina alegria de veure\'t! Vine, que necessito veus noves per al cor.' },
                    { qui: 'Pare Daimiel', text: 'La Pianista i jo som amics de tota la vida. Ella toca com ningú, i jo dirigeixo els cants. Però la música es queda sense orgue, ja ho veus.' },
                    { qui: 'Pare Daimiel', text: 'No et preocupis: si la música s\'ha amagat, la cantarem perquè torni! Riure és la primera pregària.' },
                    { qui: 'Pare Daimiel', text: 'Ah, i una cosa que em preocupa: el rellotge del campanar s\'ha aturat a un quart de quatre, la nit que va arribar la boira.' },
                    { qui: 'Pare Daimiel', text: 'La porta de la dreta del retaule puja per la torre fins a la Sala del Rellotge, però és tancada amb clau, i la clau la guarda la Carry, la vídua del campaner, a Nostra Senyora. Jo ja no tinc l\'esquena per a tants graons, però tu... mira què hi passa.' },
                ],
                enAcabar: () => { E.posaFlag('parlatDaniel'); E.posaFlag('rellotgeDit'); }
            };
        }
        // El rellotge encara aturat: ho recorda sempre (també quan parla del sagrari)
        const textRellotge = E.te('clau_campanar') || E.flag('portaCampanarOberta')
            ? 'La Sala del Rellotge, fill: la porta de la dreta del retaule, i torre amunt. Si algú el fa caminar de nou, potser la boira s\'ho pensarà dues vegades.'
            : 'La porta de la dreta del retaule és tancada, fill: la clau la guarda la Carry, la vídua del campaner, a Nostra Senyora. Si algú fa caminar el rellotge, potser la boira s\'ho pensarà dues vegades.';
        if (sagrari) return {
            pagines: [...paginesSagrari, ...(E.flag('rellotgeReparat') ? [] : [{ qui: 'Pare Daimiel', text: 'I no t\'oblidis del rellotge, Ineu. ' + textRellotge }])],
            enAcabar: () => E.posaFlag('clauSagrariDita')
        };
        if (!E.flag('rellotgeReparat')) {
            return { pagines: [{ qui: 'Pare Daimiel', text: E.te('clau_campanar') || E.flag('portaCampanarOberta')
                ? 'La Sala del Rellotge, fill: la porta de la dreta del retaule, i torre amunt. Si algú el fa caminar de nou, potser la boira s\'ho pensarà dues vegades.'
                : 'La porta de la dreta del retaule és tancada, fill: la clau la guarda la Carry, la vídua del campaner, a Nostra Senyora. Si algú fa caminar el rellotge, potser la boira s\'ho pensarà dues vegades.' }] };
        }
        // El rellotge camina: ho celebra i, en agraïment, explica la primera missió lateral que encara tens pendent
        const encarrec = DIALEGS.encarrecDaniel(E);
        if (!E.flag('rellotgeExplicat')) {
            return {
                pagines: [
                    { qui: 'Pare Daimiel', text: 'Sents el rellotge, Ineu? Torna a caminar! Fa tres nits que no el sentia. Els nens em diuen que canto massa fort, però avui no cal: ho fa ell per mi!' },
                    { qui: 'Pare Daimiel', text: encarrec ? 'I ara que el temps torna a passar, t\'explico una cosa que m\'ha dit la gent mentre era aturat:' : 'I ara que el temps torna a passar...' },
                    { qui: 'Pare Daimiel', text: encarrec || 'Doncs res, fill: tu ja ho saps tot. Jo continuaré cantant, que el rellotge ja em porta el compàs.' }
                ],
                enAcabar: () => { E.posaFlag('rellotgeExplicat'); E.posaObjectiu(PROGRES.pista(E)); }
            };
        }
        return { pagines: [{ qui: 'Pare Daimiel', text: encarrec || 'Doncs res, fill: tu ja ho saps tot. Jo continuaré cantant, que el rellotge ja em porta el compàs.' }] };
    },
    // La primera missió lateral pendent, dita pel Pare Daimiel (null si no en queda cap). La de la Carry ja és feta: sense ella no hi ha rellotge
    encarrecDaniel: E => {
        if (!E.flag('evaParlat')) return "L\'Eve de la Taverna va molt amoïnada: el Sardi berenava cada tarda amb ella. La porta és tancada, però si hi truques, a tu t'obrirà.";
        if (!E.flag('nenaAlliberada')) return "Al camí de la Rovellonera, passat l'Era, hi ha una nena amb trenes que espera algú. Ningú no sap de qui és.";
        if (!E.flag('mongesTrobades')) return "Les sacerdotesses de l'Hostatgeria fa dies que no surten de les cambres. L'Isílder, que cuida el jardí, en sap alguna cosa: pregunta-li per la llosa.";
        if (!E.flag('tresorObert')) return "Diuen que a la façana del Santuari hi ha una pedra que escolta. Quan sàpigues el Cant de Vespres, canta-li i veuràs.";
        return null;
    },
    // Sagrari del Retaule Major: hi ha el fragment 2 de la llegenda del monjo. És tancat amb una clau petita que és a l'ermita de la Desaparició (premi del missatge de les dotze columnes).
    sagrari: E => {
        if (E.flag("fragment2")) return { pagines: [] };
        if (!E.te("clau_sagrari")) {
            return {
                pagines: [{ qui: "Ineu", text: "El sagrari és tancat amb una clau molt petita." }]
            };
        }
        return {
            pagines: [
                { fer: (z, fet) => z.agafar(fet, 'pergami', 0xf2e6c8) },
                { qui: "Pergamí", text: "Fragment 2 de 2:\n«El monjo va guardar el segell fins al darrer dia. Des d'aleshores la seva ombra torna cada nit al mur de les Runes a vigilar. La clau de ferro és on ell la va deixar, amb els seus germans, sota la mirada d'un guardià de pedra.»" },
                { qui: "Pergamí", text: "«Qui busqui la clau, que no oblidi mai on neix el sol.»" }
            ],
            enAcabar: () => { E.posaFlag("fragment2"); E.posaObjectiu("Ja tens els dos fragments: porta'ls al Pare Alcoví, a la biblioteca del Monestir."); }
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
    ruines: E => {
        if (!E.flag('pedraRunes')) return {
            pagines: [
                { qui: 'Ineu', text: "(Una pedra grossa, enfonsada a terra just al peu del mur. Sota seu hi ha alguna cosa: se n'ha escapat un corrent d'aire fred. Potser la puc empènyer.)" },
                { fer: (z, fet) => z.mouPedraRunes ? z.mouPedraRunes(fet) : fet() },
                { qui: 'Ineu', text: E.te('llanterna') ? "(Un forat fosc! Amb el Llum d'en Mamet s'hi veu alguna cosa...)" : "(Hi ha un forat negre, fonda i espessa. Sense llum no s'hi veu res: hauré de tornar amb alguna cosa que il·lumini.)" }
            ]
        };
        if (!E.te('llanterna')) return { pagines: [{ qui: 'Ineu', text: "(El forat és tan negre que no s'hi distingeix res. Em cal una llum.)" }] };
        return {
            pagines: [
                { qui: 'Ineu', text: "El Llum d'en Mamet forada la tenebra del forat... Al fons hi ha un full amagat!" },
                { qui: 'Pergamí', text: "Un pergamí esquinçat (fragment 1 de 2):\n«Quan l'Ocellaire va ser tancat a la seva gàbia, un monjo va segellar la porta de ferro amb la llum de l'espasa Runna i la va deixar dormint a la pedra. Després va amagar la clau de la porta allà on ningú no la trobés.\nL'altra meitat d'aquesta crònica la deixo sota clau, al sagrari de l'església.»" },
                { fer: (z, fet) => z.agafarPergamiRunes ? z.agafarPergamiRunes(fet) : fet() },
                { qui: 'Ineu', text: "El pergamí s'acaba aquí, però diu que l'altra meitat és sota clau, al sagrari de l'església. I cada nit, diuen, a aquest mur s'hi veu l'ombra d'un monjo." },
                { fer: (z, fet) => z.aparicioOmbra ? z.aparicioOmbra(fet) : fet() },
                { qui: 'Ineu', text: "Ha aparegut en llegir el pergamí... És el monjo del segell? Quan tingui l'altre fragment, el Pare Alcoví sabrà llegir-los junts." }
            ],
            enAcabar: () => { E.posaFlag('fragment1'); E.posaObjectiu("Segons el pergamí, l'altra meitat és sota clau al sagrari de l'església, al Santuari. El Pare Daimiel en sabrà alguna cosa."); }
        };
    },

    cartellRuinesPingpong: E => ({ pagines: [{ qui: 'Cartell', text: "← Camí de la Desaparició\n→ Cementiri\n↑ Cel·les\n↓ El Celler i la Plaça" }] }),
    cartellCeller: E => ({ pagines: [{ qui: 'Cartell', text: "← El Celler (ping-pong)\n→ Sala de les Gírgoles\n↑ Les Runes\n↓ Plaça" }] }),
    cartellGirgoles: E => ({ pagines: [{ qui: 'Cartell', text: "Porta de les Gírgoles" }] }),

    juli: E => {
        E.posaFlag('parlatJuli');
        return {
            pagines: [
                { qui: 'Julius', text: 'Ei, Ineu! El repte més gran del Miracle és derrotar el Jusef i el seu servei màgic. T\'hi atreveixes?' },
                { qui: 'Julius', text: 'El Senyor Pomers juga amb una pala de pedra. De pedra! I tot i així, em guanya fàcilment.' }
            ]
        };
    },

    frederic: E => {
        E.posaFlag('parlatFrederic');
        return {
            pagines: [
                { qui: 'Senyor Pomers', text: 'Calma, noi. La pilota no s\'ha de perseguir, s\'ha d\'esperar.' },
                { qui: 'Senyor Pomers', text: 'Jo jugo amb una pala de pedra. De pedra, sí: pesa com un maó i no té goma ni res. Quan jugueu a la taula, no em veuràs ni a mi ni la pala; no cal.' },
                { qui: 'Senyor Pomers', text: 'Perquè amb què es juga és igual. La pala només és una extensió de l\'ànima. El que compta és l\'esperit del joc, la màgia que portes dins.' }
            ]
        };
    },

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
            { fer: (z, fet) => z.npcVa('josep', z.ineu.x + (z.ineu.x < z.config.amplada / 2 ? 60 : -60), z.ineu.y, fet) },
            { qui: 'Jusef', text: 'Això és per a tu: el Llum d\'en Mamet. En Mamet era un vell ermità del Miracle que coneixia tots els passos subterranis i les escletxes dels murs.' },
            { qui: 'Jusef', text: 'La seva flama s\'alimenta d\'un oli antic que mai no s\'apaga. Als passadissos fondos i a la foscor de les pedres velles, la seva claror et farà visible allò que sembla ocult.' },
            { fer: (z, fet) => z.objecteVola('josep', fet) },
            { avis: "Has obtingut el LLUM D'EN MAMET.", obj: 'llanterna' },
            { qui: 'Jusef', text: 'I un secret, per qui sap tornar un servei: aquella roda de carruatge del Celler no és decoració. Darrere hi ha el túnel dels monjos cap a la Casa Gran. Però pesa com un carro ple.' }
        ],
        enAcabar: () => {
            E.posaFlag('josepVencut');
            if (!E.te('llanterna')) { E.dona('llanterna'); E.posaFlag('llanterna'); }
            const ui = game.scene.getScene('UI'); if (ui) ui.actualitzarHUD();
            E.posaObjectiu(!E.flag('runna') ? 'Has guanyat en Jusef. Segueix buscant Runna.'
                : E.te('guants') ? 'Empeny amb els Guants la roda de carruatge: amaga el túnel dels monjos (Runna en talla els esbarzers).'
                : 'La roda de carruatge pesa massa: el Germà Francí, a Sant Antoni, té uns guants que mouen el que pesa.');
        }
    }),

    josepPerdut: (E, abandonat) => ({
        pagines: [{ qui: 'Jusef', text: abandonat ? 'Ja te\'n vas? La taula no fuig. Torna quan vulguis.' : 'Bona partida, monjo. Però el servei encara és meu. Torna-hi quan vulguis: el Julius diu que la segona vegada sempre surt millor.' }],
        enAcabar: () => { if (!E.flag('josepVencut')) E.posaObjectiu("En Jusef, al Celler, sempre té ganes d'una partida."); }
    }),


    // ---------------- CEL·LES I TIL·LER ----------------
    neus: E => {
        if (E.flag("soparObert") && !E.flag("escudella")) {
            return {
                pagines: [
                    { qui: "Meus", text: "El sopar del Til·ler? Ai, Ineu, i qui té ganes de taula, aquest any! Amb tres nens que falten..." },
                    { qui: "Meus", text: "...Però el Til·ler té raó, maleït sigui. No es pot deixar de fer el que s'ha fet sempre, ni quan el cor fa mal. Pren l'escudella, i no la vessis!" },
                    { qui: "Meus", text: "És l'escudella de cada any, la de les nostres àvies, però enguany té un gust que no voldria explicar. Tu tingues-ne cura de portar-la sencera." },
                    { avis: "Has obtingut L'ESCUDELLA DE LA MEUS.", obj: 'escudella' }
                ],
                enAcabar: () => { E.dona("escudella"); E.posaFlag("escudella"); objectiuSopar(E); }
            };
        }
        return {
            pagines: [
                { qui: "Meus", text: "Ineu, fill, no t'hi quedis plantat! L'Huri i el Fram dormien aquí mateix, a Sant Benet, porta amb porta, i ara no hi són. I ningú no fa res!" },
                { qui: "Senyor Molner", text: "Meus, deixa'l respirar..." },
                { qui: "Meus", text: "Tu calla, que ets tan pesat com el cafè d'ahir. Ineu, busca'ls." }
            ],
            enAcabar: () => E.posaFlag("parlatSantBenet")
        };
    },

    maritNeus: E => ({
        pagines: [
            { qui: 'Senyor Molner', text: 'Sí, Meus. No, Meus. Ara vinc, Meus.' },
            { qui: 'Senyor Molner', text: '...Ah, Ineu. Ets tu. Fes cas del que digui ella. Sempre té raó. Sempre.' }
        ]
    }),

    venerables: E => consellVenerables(E),

    // La Carry, anciana molt prima i pàl·lida de Nostra Senyora, vídua del campaner: busca el seu gos, el Pallofa, que passeja per Sant Antoni
    // un cop has parlat amb ella. En portar-li, et dona la clau del campanar i et conta com van desaparèixer l'Huri i el Fram.
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
                { qui: 'Carry', text: "La nit següent va ser el Fram, el de la porta de l'esquerra. El Pallofa va lladrar a la boira, com si veiés algú que jo no veia, i va marxar darrere seu. Per això he tingut tanta por." }
            ];
            if (clau) pagines.push(
                { qui: 'Carry', text: "El meu home era el campaner. Des que se'n va, la clau de la torre la guardo jo, i fa anys que ningú no hi puja. Pren-la. Aquell rellotge s'ha aturat a un quart de quatre, i ningú no s'ha adonat que el temps ja no passa." },
                { avis: 'Has obtingut la CLAU DEL CAMPANAR.', obj: 'clau_campanar' });
            return {
                pagines,
                enAcabar: () => {
                    E.treu('pallofa'); E.posaFlag('pallofaTornat');
                    if (clau) { E.dona('clau_campanar'); E.posaFlag('clauCampanar'); E.posaObjectiu("La clau del campanar obre una porta del retaule del Santuari, i la torre puja cap al rellotge."); }
                    E.desar();
                }
            };
        }
        if (E.flag('carryParlat')) return { pagines: [
            { qui: 'Carry', text: "Encara no l'has vist? És petitó, prim i borni, i no sap estar-se quiet. Diuen que passeja per Sant Antoni. Agafa'l amb compte: està ple de puces." }
        ] };
        return {
            pagines: [
                { qui: 'Carry', text: "Ai, Ineu... no, no t'has de preocupar per mi. Bé, sí. Busco el Pallofa, el meu gos." },
                { qui: 'Carry', text: "És petit i prim, blanc amb taques marrons, i li falta un ull: diuen que se'l va menjar un gat. Va marxar fa dues nits, darrere el Fram, i no ha tornat." },
                { qui: 'Carry', text: "A ell li agrada passejar. Si el trobes, porta-me'l. Diners no en tinc, però a casa guardo una cosa que potser et farà falta." }
            ],
            enAcabar: () => { E.posaFlag('carryParlat'); E.posaObjectiu("El Pallofa, el gos de la Carry, passeja per Sant Antoni."); E.desar(); }
        };
    },
    pallofa: E => ({
        pagines: [
            { qui: '', text: "Un gos petit, prim i borni, ple de puces, et mira amb l'únic ull que li queda. Al collaret de cuir hi ha una placa: «PALLOFA»." },
            { avis: 'Has agafat el PALLOFA. Duu-lo a la Carry.' }
        ],
        enAcabar: () => { E.dona('pallofa'); E.posaObjectiu("La Carry, a Nostra Senyora, deu trobar a faltar el Pallofa."); }
    }),

    tiller: E => {
        if (E.te("basto") && !E.flag("tutorialCombat")) { E.posaFlag("tutorialCombat"); E.posaFlag("combatActiu"); }   // partides velles
        if (!E.flag("parlatTiler")) {
            return {
                pagines: [
                    { qui: "El Gran Til·ler", text: "Fa tres-cents anys vaig veure aquella gàbia baixar a la foscor, petit monjo. I des d'aleshores no he tancat mai els ulls." },
                    { qui: "El Gran Til·ler", text: "Ara sento la terra esquerdar-se sota les meves arrels. Els vells cementiris s'obren, i en surt tot allò que hi dormia: no ve amb bones intencions." },
                    { qui: "El Gran Til·ler", text: "El teu bastó de pelegrí és bo per a un camí tranquil. Aquest ja no ho és. Alça els ulls, petit monjo." },
                    { fer: (z, fet) => z.brancaCau ? z.brancaCau(fet) : fet() },
                    { qui: "El Gran Til·ler", text: "Una branca meva, enfortida per tres segles de vent i de pena. Agafa-la: serà més àgil i més viva que cap bastó." },
                    { qui: "El Gran Til·ler", text: "L'arbre que dona una branca no mor. Va créixer per a aquest dia: que et guardi com m'ha guardat a mi." }
                ],
                enAcabar: () => {
                    E.posaFlag("parlatTiler"); E.posaFlag("tillerBranca");
                    E.posaObjectiu("Al peu del Gran Til·ler ha caigut una branca.");
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
                    { qui: "El Gran Til·ler", text: "A la Cirosa viuen uns pastors desterrats que guarden les esquelles dels seus avis: amb elles es van afinar els cants antics. Tracta'ls amb dolçor, que ja han patit prou." },
                    { qui: "El Gran Til·ler", text: "I vés amb compte: el Germà Aldreu hi puja de nit per un pas que jo no vigilo, i porta la boira a dins. L'Home de la Gàbia li parla a cau d'orella, i ell l'escolta." }
                ],
                enAcabar: () => {
                    E.posaObjectiu("Les arrels que tanquen el camí del nord-est, a la dreta del Til·ler, cediran als cops de la branca.");
                }
            };
        }
        return { pagines: [
            { qui: "El Gran Til·ler", text: "Et donaré el meu permís quan hagis tornat la vida a la terra que la boira ha emmalaltit. Has tornat l'aigua: encara en falta, de terra." },
        ] };
    },

    branca: E => ({
        pagines: [
            { fer: (z, fet) => { z.brancaAgafada = true; z.agafar(() => z.ineuAixeca('ineu_aixeca_tiler', fet), 'arma_tiller', 0xd8f0a0); } },
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
        // Ha llegit la placa del Dolmen i li ho pregunta: la Crònica diu què calen per alçar Runna i qui ho dona
        if (E.flag("placaDolmen") && !E.flag("alcuiPlacaDita") && DIALEGS.faltaRunna(E).length === 3) {
            const pas = pistaRunna(E);
            const pagines = [
                { qui: "Ineu", text: "Pare Alcoví, a la placa del Dolmen hi diu que només podrà alçar Runna qui posseeixi el permís de l'arbre sagrat, les paraules del saber i la benedicció divina. Què vol dir?" },
                { qui: "Pare Alcoví", text: "Això ho tinc a la Crònica, fill. Deixa'm que t'ho llegeixi." },
                { fer: (z, fet) => z.npcVa('pare_alcui', 812, 372, fet, 120) },
                { qui: "Crònica", text: "«Per alçar l'espasa calen tres coses: el permís de l'arbre més vell, que seu a taula amb tothom; les paraules que el monjo va deixar, que només entén qui ha parlat amb la seva ombra; i la benedicció del prior, que és la de Déu passada per les mans dels homes.»" },
                { qui: "Pare Alcoví", text: "L'arbre sagrat és el Gran Til·ler, el de les cel·les: el seu medalló és el permís. Les paraules les guarda l'ombra del monjo, a les Runes, i només jo sabré entendre-les quan te les digui. I la benedicció divina és la del Pare Jordà, el prior." }
            ];
            if (pas) pagines.push({ qui: "Pare Alcoví", text: "I ara, el que et toca: " + pas });
            return { pagines, enAcabar: () => { E.posaFlag("alcuiPlacaDita"); E.desar(); } };
        }
        if (E.flag("runna") && E.flag("relTretes") && !E.flag("tombaSegellada") && !E.flag("tombaLlegida")) {
            return {
                pagines: [
                    { qui: "Ineu", text: "Pare Alcoví, he baixat a la cripta de la Casa Gran. Hi havia una clau de ferro, i la tomba dels monjos no para de treure boira." },
                    { qui: "Pare Alcoví", text: "Una clau de ferro, i una tomba que no calla... Deixa'm mirar la Crònica." },
                    { fer: (z, fet) => z.npcVa('pare_alcui', 812, 372, fet, 120) },
                    { qui: "Crònica", text: "«Amb la llum de Runna van tancar la porta, i amb la mateixa llum van tancar la seva tomba. Mentre l'esquerda treu boira, la porta no és del tot closa.»" },
                    { qui: "Pare Alcoví", text: "La tomba és al Cementiri, darrere del Santuari i el Monestir. Colpeja l'esquerda amb Runna, fill." }
                ],
                enAcabar: () => { E.posaFlag("tombaLlegida"); E.posaObjectiu("La tomba esquerdada del Cementiri espera la llum de Runna."); }
            };
        }
        if (E.flag("alcuiLlegit") && E.flag("benedicioMonjo") && !E.flag("saber")) {
            return {
                pagines: [
                    { qui: "Pare Alcoví", text: "Has parlat amb l'ombra, oi? Fa temps que ho sospitava. A la Crònica hi ha un marge que no vaig saber llegir: una paraula esborrada, de la mateixa mà que va escriure els fragments." },
                    { qui: "Pare Alcoví", text: "Amb la paraula que t'ha donat, ara ho entenc. «La foscor tem la llum, però més encara el riure.» Aquestes són les paraules que desperten Runna, fill: no és un conjur, és una veritat. Digues-les davant l'espasa, senceres i amb tot el cor." },
                    { qui: "Pare Alcoví", text: "I una cosa més, fill. Fa anys, a la biblioteca, vaig trobar un compartiment secret dins el llibre més antic de tots, i hi havia això: un medalló de pedra amb un llibre obert tallat. Té centenars d'anys." },
                    { qui: "Pare Alcoví", text: "No sabia per a què servia. Ara sí: porta'l a la placa del Dolmen, i guarda les paraules dins teu per al moment de dir-les." },
                    { avis: "Has obtingut el MEDALLÓ DEL SABER!", obj: 'medallo_saber' }
                ],
                enAcabar: () => { E.dona("medallo_saber"); E.posaFlag("saber"); E.posaObjectiu(DIALEGS.objectiuRunna(E)); }
            };
        }
        if (E.flag("alcuiLlegit")) {
            return { pagines: [{ qui: "Pare Alcoví", text: E.flag("saber") ? "Ja saps les paraules, fill. Ara només cal que arribi el dia de cridar-les." : "Els dos fragments expliquen el mateix, fill: algú vigila el segell des de fa segles. " + (pistaRunna(E) || "Ves a les Runes i no tinguis por de l'ombra.") }] };
        }
        if (f1 && f2) {
            return {
                pagines: [
                    { qui: "Pare Alcoví", text: "Has trobat els dos fragments! Deixa'm llegir-los... Sí. Ho explica la Crònica que guardo a la biblioteca: un monjo va segellar la foscor amb la llum de l'espasa Runna." },
                    { fer: (z, fet) => z.npcVa('pare_alcui', 812, 372, fet, 120) },
                    { qui: "Crònica", text: "«Des que la tercera església va quedar inacabada, l'ombra del monjo es veu clarament sobre el mur de les Runes: mig corbat, amb les mans unides, com si pregués. Apareix cada nit.»" },
                    { qui: "Pare Alcoví", text: "L'ombra del monjo... No fa mal a ningú, Ineu. Crec que és el monjo que va segellar la foscor amb la llum de Runna. Ves a les Runes, passat el Pati del Celler: és sobre el mur de l'església inacabada. Parla-hi." }
                ],
                enAcabar: () => { E.posaFlag("alcuiLlegit"); E.posaFlag("parlatAlcui"); E.posaObjectiu("A les Runes, passat el Pati del Celler, l'ombra del monjo és sobre el mur de l'església inacabada. Parla-hi."); }
            };
        }
        return {
            pagines: [
                { qui: "Pare Alcoví", text: "Ineu, fill. Aquesta boira no és natural. Les boires d'aquí baixen de les muntanyes; aquesta puja de sota terra." },
                { qui: "Pare Alcoví", text: "Diuen que cada nit apareix l'ombra d'un monjo a les Runes. Hi ha dos fragments d'una crònica antiga escampats pel Santuari: un a les Runes i un altre al sagrari de l'església. Porta-me'ls i els llegirem junts." }
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
        if (fr < 2 || !E.flag("alcuiLlegit")) {
            return {
                pagines: [
                ]
            };
        }
        if (!E.flag("ombraDemanaCant")) {
            return {
                pagines: [
                    { fer: (z, fet) => z.ombraReacciona(fet) },
                    { qui: "Monjo", text: "Fa segles que no sento parlar cap llengua que no siguin les pedres. Només el cant de les pedres em desperta del tot." },
                    { qui: "Monjo", text: E.flag("cantPedres") ? "Qui toca l'orgue el coneix, i tu ja el portes a la tarota. Canta-me'l aquí, petit monjo." : "Qui toca l'orgue el coneix. Aprèn-lo, petit monjo, i torna a cantar-me'l aquí." }
                ],
                enAcabar: () => {
                    E.posaFlag("ombraDemanaCant");
                    E.posaObjectiu(E.flag("cantPedres") ? "L'ombra del monjo vol sentir, a les Runes, el Cant de Vespres que ja saps." : "La Pianista, al Santuari, coneix un cant que les pedres entenen; l'ombra del monjo el voldria sentir.");
                }
            };
        }
        return {
            pagines: [
                { qui: "Ineu", text: "Toca el Cant de Vespres amb la tarota: 3-1-2-1." }
            ]
        };
    },

    // Es llança quan l'Ineu toca el Cant de Vespres davant l'ombra
    benedicioMonjo: E => ({
        pagines: [
            { fer: (z, fet) => z.ombraReacciona(fet) },
            { qui: "Monjo", text: "Jo era el qui va tancar la porta. Quan van obrir el cementiri, rient, els meus germans van deixar de descansar i el segell es va esquerdar." },
            { qui: "Monjo", text: "Sota terra hi ha una gàbia, petit monjo, i una cosa que no ha oblidat cap cant ni cap nen. Jo només puc vigilar. Tu pots tornar a tancar-ho." },
            { qui: "Monjo", text: "L'espasa dorm al sud-est, entre pedres, allà on el sol s'atura. Rep la meva paraula, que no pesa ni es veu, i recorda: la foscor tem la llum, però més encara el riure." },
            { qui: "Monjo", text: "Jo només puc dir-te les paraules; el Pare Alcoví sabrà entendre-les. Quan les cridis davant l'espasa, la meva paraula farà que et reconegui." },
            { qui: "Monjo", text: "Ara ja puc descansar en pau." },
            { fer: (z, fet) => z.ombraDescansa ? z.ombraDescansa(fet) : fet() },
            { avis: "Has rebut la PARAULA DE L'OMBRA." }
        ],
        enAcabar: () => {
            E.posaFlag("benedicioMonjo");
            E.posaObjectiu("Ara que l'ombra t'ha parlat, el Pare Alcoví tindrà paraules per a tu, a la biblioteca.");
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
                    { qui: 'Ineu', text: 'Ha funcionat! L\'aigua de la pica torna a ser clara com el vidre.' },
                    { avis: 'Has obtingut l\'AIGUA DE LA FONT DEL BISBE.', obj: 'aigua_sj' }
                ],
                enAcabar: () => {
                    E.posaFlag('fontNeta'); E.dona('aigua_sj');                  // (la pruna es queda al sarró, de record)
                    E.posaObjectiu("L'aigua de la Font del Bisbe obriria l'Alzina Buida.");
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

    herba: (n, nom, icona) => E => ({
        pagines: [{ avis: `Has trobat ${nom}!`, obj: icona }],               // l'Ineu alça l'ofrena amb la fanfarra i la imatge de l'objecte
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
                    { qui: "Veu del bosc", text: "...Qui ens porta... l'aigua... bona... Passa, passa, fill... Només la Jauneta... sap on acabes." },
                ],
                enAcabar: () => { E.posaFlag("portalJaumeta"); E.posaObjectiu("L'Alzina Buida s'ha obert: la cabana de la Jauneta, la bruixa del bosc, és a l'altra banda."); }
            };
        }
        return { pagines: [
            { qui: "Ineu", text: "Sento una veu allà dins... «Aigua... aigua de la Font del Bisbe...» Potser necessito l'aigua de la font d'aquí a prop." }
        ] };
    },

    cartellBosc: E => ({ pagines: [{ qui: "Cartell", text: "Bosc de Sant Joan.\n«Qui busca la font, que segueixi l'aigua... i qui no, que no es perdi.»" }] }),
    cartellCirosa: E => ({ pagines: [{ qui: "Cartell", text: E.flag("camiCirosaObert") ? "↑ La Cirosa (camí llarg, tot el camí amunt)\n← La Caseta\n↓ Les Cel·les" : "↑ La Cirosa\n← La Caseta" }] }),

    // ---------------- EL FOLLET DEL CARRO VERD: VIATGE RÀPID ----------------
    // Condueix el carro de vapor que li va fer el Galf (al codi, 'carruatge'). A cada parada (PARADES, js/zona_base.js) la primera conversa la
    // desbloqueja; després pregunta on anem. La seva història (els ocells que porta tapats al darrere, que els seus avis van
    // recollir quan van tancar l'Ocellaire) queda per a l'epíleg: a l'Era, quan la boira ha marxat, obre la gàbia.
    cotxer: (E, id) => {
        const nom = 'Follet del Carro Verd';
        if (id === 'era' && E.flag('epilegFet') && !E.flag('carruatgeObert')) {
            return {
                pagines: [
                    { qui: nom, text: "La boira se n'ha anat del tot, monjo. Abans de tornar a la carretera, deixa'm obrir la gàbia del darrere." },
                    { qui: nom, text: "Hi porto els ocells que l'Ocellaire va tancar fa segles. Els meus avis els van recollir i els hem guardat de pare a fill, perquè amb la boira no volien cantar." },
                    { fer: (z, fet) => {
                        const [cx, cy] = z.paradaAqui ? z.paradaAqui.c : [260, 1230];
                        for (let i = 0; i < 10; i++) z.time.delayedCall(i * 170, () => {
                            const g = z.add.graphics().setDepth(90000);
                            g.lineStyle(3, 0x2a1a10, 1).beginPath().moveTo(-9, 2).lineTo(0, -5).lineTo(9, 2).strokePath();
                            g.setPosition(cx - 60 - Math.random() * 45, cy - 75);      // la gàbia és al darrere (el carruatge és girat)
                            z.tweens.add({ targets: g, scaleY: { from: 1, to: -0.6 }, yoyo: true, repeat: -1, duration: 160 + Math.random() * 60 });
                            z.tweens.add({ targets: g, x: cx + (Math.random() - 0.5) * 700, y: cy - 700 - Math.random() * 250, alpha: 0, duration: 2400 + Math.random() * 600, ease: 'Sine.easeOut', onComplete: () => g.destroy() });
                        });
                        z.esperar(2400, fet);
                    } },
                    { qui: nom, text: "Ja poden cantar. Gràcies per tornar-los el cant." }
                ],
                enAcabar: () => { E.posaFlag('carruatgeObert'); E.posaFlag('parada_era'); }
            };
        }
        const conegudes = PARADES.filter(pd => E.flag('parada_' + pd.id)).length;
        if (!E.flag('parada_' + id)) {
            return {
                pagines: [{ qui: nom, text: conegudes
                    ? "Mira qui hi ha! Ara ja saps que també paro aquí. Recorda: només puc parar allà on ja ens hàgim trobat."
                    : "Eh, monjo! Aquest trasto me'l va fer el Galf: va amb vapor i no es cansa mai. Si has d'anar lluny, puja. Això sí: només paro allà on ja m'hagis trobat." }],
                enAcabar: () => E.posaFlag('parada_' + id)
            };
        }
        if (conegudes < 2) return { pagines: [{ qui: nom, text: "De moment només conec aquest lloc, monjo. Quan em trobis en un altre, t'hi portaré." }] };
        return { pagines: [
            { qui: nom, text: "On anem? Recorda que només puc parar allà on ja ens hàgim trobat." },
            { fer: (z, fet) => z.triarViatge(fet) }
        ] };
    },

    // ---------------- CAMÍ DE LA DESAPARICIÓ ----------------
    columna: n => E => {
        const paraula = PARAULES_MISSATGE[n - 1], signe = SIGNES_MISSATGE[n - 1];
        const total = () => Array.from({ length: 12 }, (_, i) => E.flag('col' + (i + 1))).filter(Boolean).length;
        return {
            pagines: [
                // Un sol quadre de text per columna: el signe, la paraula i quantes en porta apuntades
                { qui: 'Ineu', text: E.flag('col' + n)
                    ? `Columna ${n} de 12: ${signe} vol dir «${paraula}». Ja ho tenia apuntat (${total()}/12).`
                    : `Columna ${n} de 12. Sota el signe ${signe}, amb lletra petita: «${paraula}». Ho apunto (${total() + 1}/12).` }
            ],
            enAcabar: () => {
                E.posaFlag('col' + n);
                if (total() === 12 && !E.flag('missatgeDesxifrat')) E.posaObjectiu("Les dotze paraules parlen de les taules de pedra de l'Ermita de la Desaparició.");
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
                if (totes && !E.flag('missatgeDesxifrat') && !E.flag('cofreAltar')) E.posaObjectiu("La frase sencera sonaria bé davant l'altar de l'ermita de la Desaparició.");
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
            { avis: 'Has obtingut la CLAU DEL SAGRARI.', obj: 'clau_sagrari' },
            { qui: 'Ineu', text: 'La clau del sagrari del Santuari! Els monjos la van deixar aquí. Amb això obriré el sagrari del retaule.' }
        ],
        enAcabar: () => {
            E.posaFlag('missatgeDesxifrat');
            if (!E.te('clau_sagrari') && !E.flag('fragment2')) E.dona('clau_sagrari');
            if (!E.flag('fragment2')) E.posaObjectiu("La clau petita deu encaixar al sagrari del Santuari, al mig del retaule.");
        }
    }),
    sortidaErmita: E => ({ pagines: [{ qui: 'Cartell', text: '← L\'Era\n→ Camí de la Desaparició' }] }),
    creuDesaparicio: E => ({
        pagines: [
            { qui: 'Inscripció', text: "«Dotze paraules guarda el camí. Qui les escolti, trobarà el nom dels que callen.»" }
        ]
    }),

    // ---------------- L'ERA ----------------
    galf: E => {
        if (E.flag('telescopi')) {
            return { pagines: [{ qui: 'Galf', text: 'Mira bé les estrelles amb el telescopi, noi. Els Dipòsits són el millor mirador de la comarca... quan hi puguis arribar.' }] };
        }
        if (E.flag('cristallGel')) {
            return {
                pagines: [
                    { qui: 'Galf', text: 'Un cristall de gel de debò! Fa anys que en buscava un. Dóna\'m una estona.' },
                    { fer: (z, fet) => z.seq([c => z.npcFeina('galf', 1800, 'guspires', c), c => z.npcSalta('galf', c, 1), c => z.objecteVola('galf', c, 'telescopi_mon')], fet) },
                    { qui: 'Galf', text: 'Un telescopi! Amb això veuràs coses que cap monjo no ha vist. Perquè no se\'t perdi: les estrelles fan camí.' },
                    { avis: 'Has obtingut el TELESCOPI DEL GALF.', obj: 'telescopi' }
                ],
                enAcabar: () => {
                    E.dona('telescopi'); E.posaFlag('telescopi'); E.treu('cristall_gel');
                    E.posaObjectiu("El telescopi vol un mirador alt i fosc: els Dipòsits.");
                }
            };
        }
        // Fins que l'Ineu no s'ha assegut al banc de davant, el Galf només l'hi convida; un cop assegut, passa directament a la conversa
        if (!E.flag('garfBancSegut')) {
            return { pagines: [{ qui: 'Galf', text: "Mmm? Ah, un monjo! Seu, seu al banc de davant, que per xerrar s'hi està millor." }] };
        }
        const clauDonada = E.flag('clauGabrielDonada') || E.te('clau_gabriel') || E.flag('portaGabrielOberta');
        if (clauDonada) return { pagines: [{ qui: 'Galf', text: "Torna quan tinguis el cristall de gel, noi. L'ermita de Sant Gabriel s'obre amb la clau que t'he donat." }] };
        return { pagines: [
            { qui: 'Galf', text: "Així sí. Soc el Galf, inventor. Visc a la cel·la de Sant Antoni, però vinc aquí cada dia: és l'únic racó on cap teulada no em tapa el cel. Tinc idees que ni jo entenc." },
            { qui: 'Galf', text: "Si em portes un cristall de gel, et construiré un telescopi per mirar el cel. N'hi ha un a l'ermita de Sant Gabriel." },
            { qui: 'Galf', text: "Però l'ermita és tancada, i la clau la guardo jo des que el sagristà va marxar. Té: no te la deixis perdre." },
            { avis: "Has obtingut la CLAU DE SANT GABRIEL.", obj: 'clau_gabriel' }
        ], enAcabar: () => { E.dona('clau_gabriel'); E.posaFlag('clauGabrielDonada'); } };
    },
    cartellEra: E => ({ pagines: [{ qui: 'Cartell', text: '↑ Ermita de la Desaparició\n→ Hostatgeria\n← Rovellonera' }] }),

    // ---------------- JARDÍ ----------------
    isidre: E => DIALEGS.isidreBase(E),
    isidreBase: E => {
        if (E.flag("soparObert") && !E.flag("floresIsidre")) {
            return {
                pagines: [
                    { qui: "Isílder", text: "Sopar del Til·ler, eh? La gent només pensa en el menjar i s'obliden de les flors. Jo hi fico flors des que era jove." },
                    { fer: (z, fet) => { const i = z.npcs.isidre, x0 = i.x, y0 = i.y; z.seq([c => z.npcVa('isidre', x0 - 140, y0 - 30, c, 80), c => z.npcFeina('isidre', 1300, 'fulles', c), c => z.npcVa('isidre', x0, y0, c, 80), c => z.objecteVola('isidre', c, 'flors')], fet); } },
                    { qui: "Isílder", text: "Les flors de lluna són pels que falten. Posa-les al mig de la taula; jo també vindré a seure-hi." },
                    { avis: "Has obtingut les FLORS D'ISÍLDER.", obj: 'flors_isidre' }
                ],
                enAcabar: () => { E.dona("flors_isidre"); E.posaFlag("floresIsidre"); objectiuSopar(E); }
            };
        }
        if (E.flag('mongesTrobades') && !E.flag('isidreSap')) {
            return {
                pagines: [
                    { qui: 'Isílder', text: 'He sentit com s\'obria la porta de l\'Hostatgeria. Són elles, oi? La Dolora, la Pilària, la Carmèlia... les sacerdotesses de la nostra casa.' },
                    { qui: 'Isílder', text: 'Tres nits tancades a vint passes de mi, i jo aquí amb les flors, sense saber-ne res. La seva pregària sempre ha mantingut la pau a aquesta terra.' },
                    { qui: 'Isílder', text: 'I el Sardi... el meu fill Sardi. Té set anys, monjo. Cada tarda s\'enfilava a la prunera i es manxava de prunes fins a no poder dir ni mu. Si el trobes, digues-li que el seu pare no ha deixat de regar la prunera.' }
                ],
                enAcabar: () => E.posaFlag('isidreSap')
            };
        }
        if (E.flag('llosaOberta')) {
            return { pagines: [{ qui: 'Isílder', text: 'La flor de lluna ja ha florit sobre la llosa. No deixaré de cuidar-la.' }] };
        }
        if (E.te('llavorLluna')) {
            return {
                pagines: [
                    { qui: 'Ineu', text: "Isílder, mira què duc. La Rosansa me l'ha donada: diu que és una Llavor de Lluna." },
                    { qui: 'Isílder', text: "Una Llavor de Lluna! Fa trenta anys que no en veia cap. Floreix de nit, amb la llum de la lluna, i només si la planta algú que no ha perdut l'esperança." },
                    { qui: 'Isílder', text: "El meu Sardi s'asseia aquí a esperar que s'obrissin, i deia que les flors de lluna canten quan floreixen. Deixa-me-la, monjo: encara sé cavar un clot. I mira bé." },
                    { fer: (z, fet) => { E.treu('llavorLluna'); if (z && z.obrirLlosa) z.obrirLlosa(fet); else { E.posaFlag('llosaOberta'); fet(); } } },
                    { qui: 'Isílder', text: "La llosa s'ha apartat... Sota hi ha el camí que els monjos feien servir per portar menjar a les cel·les del soterrani de la casa. Fa segles que ningú no el trepitja." },
                    { qui: 'Isílder', text: "Baixa-hi amb compte, fill. I si trobes el meu Sardi... digue-li que les flors de lluna han tornat a obrir-se." }
                ]
            };
        }
        return {
            pagines: [
                { qui: 'Isílder', text: 'Bon dia, monjo! Aquesta pèrgola de pedra és més vella que el monestir: les columnes, els arcs... i l\'Hostatgeria, aquí al costat, que s\'hi aguanta al darrere.' },
                { qui: 'Isílder', text: "Aquest jardí amaga una llosa que ningú no ha aixecat mai. Diuen que només s'obre amb una flor de lluna. La Rosansa, la venedora de verdures, en deu tenir alguna llavor estranya." },
                { qui: 'Isílder', text: 'No et sorprenguis si em veus aquí cada dia, ni amb pluja. Aquest jardí, el Sardi el cuidava molt. Des que la boira se\'l va endur, el cuido jo perquè, quan torni, ho trobi tot tal com ho va deixar.' }
            ],
            enAcabar: () => { E.posaFlag('isidreSansa'); E.posaObjectiu('Pregunta a la venedora de verdures per la llavor d\'una flor de lluna.'); }
        };
    },
    // La Rosansa passa per les cel·les un sol cop: et ven la Llavor de Lluna i se'n va
    sansa: E => ({
        pagines: [
            { qui: 'Rosansa', text: 'Verdures fresques, fruita de la rodalia! Cebes, raves, cols... Què et poso, monjo?' },
            { qui: 'Ineu', text: "Res de menjar, gràcies. Busco una llavor: la d'una flor de lluna, per a la llosa del jardí de l'Hostatgeria." },
            { qui: 'Rosansa', text: 'Una flor de lluna? Mmm... Fa anys que porto una llavor estranya al fons del carro, entre les cebes. Ningú no sap què és, ni jo.' },
            { qui: 'Rosansa', text: 'Tingues, és teva. Que floreixi a qui sàpiga cuidar-la.' },
            { avis: 'Has obtingut la LLAVOR DE LLUNA.', obj: 'llavorLluna' },
            { qui: 'Rosansa', text: 'Ara me n\'he d\'anar, que avui encara em queden tres pobles per davant. Adéu, monjo!' }
        ],
        enAcabar: () => { E.dona('llavorLluna'); E.posaFlag('llavorSansa'); E.posaObjectiu('Porta la Llavor de Lluna a l' + String.fromCharCode(39) + 'Isílder, a l' + String.fromCharCode(39) + 'Hostatgeria.'); }
    }),
    llosaJardi: E => ({
        pagines: [{ qui: 'Ineu', text: E.te('llavorLluna')
            ? "Una llosa de pedra amb una creu gravada. La Llavor de Lluna voldria terra aquí vora, però cal algú que conegui el jardí: l'Isílder."
            : E.flag('isidreSansa')
                ? "Una llosa de pedra amb una creu gravada, ben encaixada a terra. Cal la llavor d'una flor de lluna: la venedora de verdures en deu tenir."
                : "Una llosa de pedra amb una creu gravada, ben encaixada a terra. No es mou ni un pam." }]
    }),
    prunera: E => {
        const pagines = [
            { qui: 'Isílder', text: '(des de la pèrgola) No te\'n facis un fart, monjo! Són prunes daurades, màgiques: una sola et deixa com nou. El meu Sardi en menjava deu cada tarda i no n\'hi tenia mai prou...' },
            { fer: (z, fet) => z.seq([c => z.agafar(c, null, 0xffd060), c => z.beure(c, 0xffd060)], fet) },
        ];
        const perFont = !E.flag('fontNeta') && !E.te('pruna') && !E.flag('herba3');      // en collir-ne una, se'n guarda una al sarró per a la Font del Bisbe (encara que la font no hagi dit què calen)
        if (perFont) pagines.push({ avis: 'Has obtingut una PRUNA DAURADA.', obj: 'pruna' });
        return {
            pagines,
            enAcabar: () => {
                E.dades.vida = E.dades.corsMax * 2;
                if (perFont) { E.dona('pruna'); if (E.flag('fontVista')) E.posaObjectiu(objectiuFont(ofrenesFont(E))); }
            }
        };
    },
    hostatgeria: E => E.flag('mongesTrobades')
        ? { pagines: [{ qui: 'Carmèlia', text: 'Entra, fill: aquesta casa torna a ser teva.' }] }
        : { pagines: [{ qui: 'Ineu', text: 'La porta està tancada per dins.' }] },
    sortidaMonges: E => ({ pagines: [] }),
    taulaRefetor: E => E.te('guants')
        ? { pagines: [{ qui: 'Ineu', text: "Un àngel de pedra massís barra la porta del mig. Amb els Guants de Poder el podré empènyer: només cal posar-me a un costat i fer força contra ell." }] }
        : { pagines: [
            { qui: 'Ineu', text: "Un àngel de pedra massís barra la porta del mig. Des de l'altra banda, una veu fina i enrabiada colpeja la fusta." },
            { qui: 'Ineu', text: "No el puc moure amb les mans soles. Ni dues persones... Necessito molta més força." }] },
    // El mur d'esbarzers del passadís secret (Celler → Cambra secreta)
    // ---------------- LES SACERDOTESSES DE L'HOSTATGERIA ----------------
    monjaPains: E => {
        if (!E.flag('lliurePains')) return { pagines: [
            { qui: 'Ineu', text: "Una música lleugera, de tres notes, potser la desperta." }] };
        if (!E.flag('premiPains')) return {
            pagines: [
                { qui: 'Dolora', text: 'Oh, jove monjo! Quin cant més bonic... fa seixanta anys que no el sentia així. Jo sóc la Dolora.' },
                { qui: 'Dolora', text: 'La boira va entrar pel soterrani fa tres nits. Vaig veure un home amb hàbit i ocells a l\'espatlla que s\'enduia els nens del poble, rient baixet.' },
                { qui: 'Dolora', text: 'Si passes pel jardí, saluda l\'Isílder, el jardiner d\'aquesta casa. Un bon home, amb el cor malmès des que van desaparèixer les criatures.' },
                ...(!(E.flag('esb_host_cap1') && E.flag('esb_host_cap2')) ? [{ qui: 'Dolora', text: 'La Carmèlia, la nostra gran sacerdotessa, és tancada a la capella del fons. Uns esbarzers negres li tapen la porta: d\'aquests que no els talla ni la falç. Diuen que només cedeixen davant d\'una espasa de llum.'
                    + (E.te('runna') ? ' Aquesta espasa que portes, fill, brilla com la que diuen. Prova-ho.' : '') }] : []),
                { qui: 'Dolora', text: 'Vés amb compte, fill. Entre les tres germanes guardem l\'Empara d\'aquesta casa. Quan siguem lliures les tres, serà teva.' },
                ...(ultimaMonja('Pains') ? [avisPremiMonja('Pains')] : [])
            ],
            enAcabar: () => premiMonja('Pains', 'premiPains')
        };
        return { pagines: [{ qui: 'Dolora', text: 'Vés amb Déu, fill. La cadira em fa mal als ossos, però encara tinc bones orelles.' }] };
    },
    monjaPhili: E => {
        if (!E.flag('premiPhili')) return {
            pagines: [
                { qui: 'Pilària', text: 'Per fi! Tres nits que colpejo aquesta porta! Soc la Pilària, i no, no m\'he estat quieta ni un minut.' },
                { qui: 'Pilària', text: 'T\'ho dic perquè ho vaig veure: el Germà Aldreu, aquell pesat que sempre anava jugant amb els nens, abans que la boira ens tanqués, anava moltes nits a la Porta de les Gírgoles, a l\'est del Celler, i la porta se li obria sola. Mai no li he cregut el somriure.' },
                { qui: 'Pilària', text: 'Tots aquests nens innocents segrestats per aquesta maleïda boira... Troba\'ls, monjo! Salva\'ls a tots!' },
                { qui: 'Pilària', text: 'Gràcies pel teu coratge! Que no se t\'acabin les forces!' },
                ...(ultimaMonja('Phili') ? [avisPremiMonja('Phili')] : [])
            ],
            enAcabar: () => premiMonja('Phili', 'premiPhili')
        };
        return { pagines: [{ qui: 'Pilària', text: 'Si necessites algú que miri amb els ulls ben oberts, ja saps on trobar-me.' }] };
    },
    monjaCharm: E => {
        if (!E.flag('premiCharm')) return {
            pagines: [
                { qui: 'Carmèlia', text: 'Benvingut, fill de Déu. Sóc la Carmèlia, la gran sacerdotessa d\'aquesta casa. Havíem perdut l\'esperança, però no la pregària.' },
                { qui: 'Carmèlia', text: 'Els infants d\'aquesta terra han estat arrossegats a la foscor d\'un avenc profund. La nit que la boira ens va tancar a les cambres, els seus llits van quedar buits. Salva\'ls, fill: porta a casa tots els nens segrestats.' },
                { qui: 'Carmèlia', text: E.flag('cantMiracle')
                    ? "Als llibres d'aquesta casa he llegit que l'Ocellaire va robar el cant dels ocells, i que només aquest mateix cant obre la seva gàbia. El que has après amb la Pianista, fill, és el que ell va robar. No el deixis anar."
                    : "Als llibres d'aquesta casa he llegit que l'Ocellaire va robar el cant dels ocells, i que només aquest mateix cant obre la seva gàbia. Tu l'aprendràs: la Pianista el recorda." },
                { qui: 'Carmèlia', text: 'Que la paciència t\'acompanyi, fill.' },
                ...(ultimaMonja('Charm') ? [avisPremiMonja('Charm')] : [])
            ],
            enAcabar: () => premiMonja('Charm', 'premiCharm')
        };
        return { pagines: [{ qui: 'Carmèlia', text: 'Que la llum del Miracle t\'acompanyi, fill.' }] };
    },

    portaHostatgeria: E => ({ pagines: [] }),

    // El premi de les sacerdotesses, al vestíbul: l'Empara Fraternal per travessar la boira verinosa que barra el camí de la Sala de la Gàbia
    cofreMonges: E => {
        if (E.flag('cofreMonges')) return { pagines: [] };
        return {
            pagines: [
                { qui: 'Nota', text: "«Per a qui ha tornat la llum a aquesta casa. Al fons de les Gírgoles, abans d'arribar a la gàbia, hi ha una boira que crema: la nostra empara l'esvairà al teu pas.» — Dolora, Pilària i Carmèlia" },
                { avis: "Has obtingut l'EMPARA FRATERNAL: et protegeix de la boira verinosa que barra el camí de la Sala de la Gàbia.", obj: 'benedicio_fraterna' }
            ],
            enAcabar: () => { E.posaFlag('cofreMonges'); E.dona('benedicio_fraterna'); E.desar(); }
        };
    },

    // ---------------- LA CIROSA ----------------
    // Els pastors de la Cirosa: desterrats, arruïnats i sense nom. No s'han de combatre.
    pastorA: E => ({
        pagines: E.flag("soparFet") ? [
            { qui: "Pastor", text: "M'han assegut a taula... M'han passat el pa. Fa cinquanta anys que ningú no em passava el pa." }
        ] : E.flag("pastorVencut") ? [
            { qui: "Pastor", text: "El ramat és de nou al corral. No sé com agrair-t'ho, monjo. Nosaltres només volem una mica de pau, i un racó on no ens miri ningú malament." }
        ] : [
            { qui: "Pastor", text: "No s'acosti gaire, pare, que la gent diu que portem mala sort. Només tenim el ramat... i el Germà Aldreu, aquell monjo pesat que sempre jugava amb els nens, ens l'ha pres. Ara es fa dir el Pastor de Boira." }
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
                    { qui: "Pastor vell", text: "Fill, el Germà Aldreu feia bona cara, però això ja ho portava dins. L'Ocellaire, l'Home de la Gàbia, només li va prometre que tothom el seguiria, i ell se'l va creure." },
                    { qui: "Pastor vell", text: "I no només les ovelles. Fa unes nits el vam veure baixar cap al poble amb un nen adormit als braços. Els nens que falten, fill, se'ls ha endut ell." },
                    { qui: "Pastor vell", text: "Els nostres avis van tancar aquella gàbia sota terra fa segles, i el poble ens va pagar amb oblit." },
                    { qui: "Pastor vell", text: "Si trobes la manera de treure-li aquesta cosa, ho agrairem. Hi ha unes esquelles que van ser dels nostres avis: te les donarem, però el ramat és a la pastura, i ell hi és." }
                ],
                enAcabar: () => E.posaObjectiu("El Germà Aldreu, fet Pastor de Boira, té la pastura de la Cirosa, a la dreta de la masia.")
            };
        }
        if (!E.te("esquelles")) {                    // (també si el senyal hi és però l'objecte no: es tornen a donar)
            return {
                pagines: [
                    { qui: "Pastor vell", text: "Has tornat el ramat. El Germà Aldreu ha baixat camí avall rient: encara porta la boira a dins, pobre home. Que Déu t'ho pagui, monjo." },
                    { qui: "Pastor vell", text: "Aquí tens les esquelles dels nostres avis. Que sonin amb la teva tarota, i que els cants antics et guiïn." },
                    { avis: "Has obtingut les ESQUELLES DELS PASTORS!", obj: 'esquelles' }
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
                { qui: "Pastor vell", text: "Fa anys que no sentim música vora el foc, ni pastem el pa que fèiem per a les festes. Si algú en toqués... potser ens recordaria que encara som persones." },
                E.flag("cantPedres")
                    ? { qui: "Ineu", text: "Tinc la tarota. Les esquelles dels seus avis van afinar els cants antics... El Cant de Vespres, 3-1-2-1: el tocaré vora el foc, i que sigui el que Déu vulgui." }
                    : { qui: "Ineu", text: "Tinc la tarota, però només sé uns pocs cants. Els vells els coneixen tots: potser la Pianista, al Santuari, en sap algun que els faci recordar casa." }
            ], enAcabar: () => E.posaObjectiu("Els pastors de la Cirosa escoltarien una música vora el seu foc.") };
        }
        return { pagines: [{ qui: "Pastor vell", text: "Aquesta pastura torna a ser un lloc tranquil. Gràcies per això." }] };
    },

    // Es llança quan l'Ineu toca música vora la foguera dels pastors (durant el sopar del Til·ler)
    pastorsConvencuts: E => ({
        pagines: [
            { fer: (z, fet) => { ['pastor_a', 'pastor_vell', 'pastor_b'].forEach((k, i) => z.time.delayedCall(i * 300, () => { z.npcSalta(k, null, 1); z.bombolla(k, '♪', null, 1100); })); if (z.foc) z.tweens.add({ targets: z.foc, scale: z.foc.scale * 1.5, yoyo: true, duration: 600 }); z.esperar(1600, fet); } },
            { qui: "Pastora", text: "Havia oblidat que existia això..." },
            { qui: "Pastor vell", text: "Fa cinquanta anys que ningú no ens convidava enlloc, monjo. Ni a una missa, ni a una taula. I tu ens parles amb música." },
            { qui: "Pastor vell", text: "Mira: el forn encara és calent. Aquest pa el pastem nosaltres, amb aquestes mans, com abans. Porta'l al teu arbre. I vindrem: no direm gaire cosa, perquè no sabem com es fa, però el pa és el que sabem fer." },
            { avis: "Has obtingut el PA DELS PASTORS.", obj: 'pa_pastor' }
        ],
        enAcabar: () => { E.posaFlag("pastorsConvencuts"); E.dona("pa_pastor"); objectiuSopar(E); }
    }),

    // ---------------- EL SOPAR DEL TIL·LER ----------------
    tillerSoparIntro: E => ({
        pagines: [
            { qui: "El Gran Til·ler", text: "Has portat música al lloc on feia anys que no n'hi havia. Això em fa pensar en el sopar." },
            { qui: "El Gran Til·ler", text: "Un cop l'any, a la tardor, la gent de les cel·les s'asseu sota les meves branques i menja plegada. Ho anomeneu el sopar del Til·ler. Jo no menjo, però escolto. Tota la saviesa d'un arbre és escoltar la gent que menja junta." },
            { qui: "El Gran Til·ler", text: "Aquest any ningú no té ganes de taula: tres cadires buides, i el poble amb por. La boira s'alimenta de la solitud, petit monjo. I no val a mitges: la taula ha d'estar plena." },
            { qui: "El Gran Til·ler", text: "Fa tres-cents anys, quan van tancar la gàbia, els pastors de la Cirosa s'asseien aquí amb els monjos i els pelegrins. Després els van foragitar, i van oblidar que també eren de la casa. Que vingui el menjar de cada llar, també el seu. I que hi hagi flors." },
            { qui: "El Gran Til·ler", text: "Porta l'escudella de la Meus, les flors d'Isílder i el pa que els pastors de la Cirosa pasten amb les seves mans. Llavors, i només llavors, et donaré el meu permís." },
            { qui: "El Gran Til·ler", text: "Però els pastors no s'asseuran a taula només amb paraules: fa anys que no senten música vora el foc. Abans de tornar-hi, ves a veure la Pianista del Santuari: guarda un cant tan vell com ells." }
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

    // El ritual: s'encén una espelma per cada nen que falta (l'Huri, el Fram i el Sardi)
    tillerSoparRitual: E => ({
        pagines: [
            { qui: "Meus", text: "Aquest any l'escudella té gust de poc, fill: hi falta l'alegria de tres nens. Que ens ho perdonin els tres, allà on siguin." },
            { qui: "Isílder", text: "He posat les flors de lluna al mig, com cada any. Aquest cop són per l'Huri, pel Fram... i pel meu Sardi." },
            { qui: "Les Venerables Sàvies", text: "Sempre fem el mateix, fill: una espelma per cada cadira buida a la taula. Enguany en són tres: l'Huri, el Fram i el Sardi. Encén-les tu: ets tu en qui tenim les nostres esperances posades." },
            { fer: (z, fet) => z.encendreEspelmes([0, 1, 2], fet) },
            { qui: "Pastor vell", text: "Fa molts anys que a nosaltres ningú no ens guardava cap cadira a cap taula. Gràcies per asseure'ns, fill." },
            { qui: "El Gran Til·ler", text: "Aquesta és la saviesa que et volia donar, petit monjo: ningú no es perd del tot mentre algú el recorda a taula. La gàbia de l'Ocellaire només s'omple de qui s'ha quedat sol." },
            { qui: "El Gran Til·ler", text: "Rep el meu permís. Que et sigui lleu, i que no et faci oblidar mai que vas menjar amb tots." },
            { qui: "El Gran Til·ler", text: "Entre les meves branques hi custodio, des de temps immemorials, un medalló de pedra amb una fulla tallada: el permís de l'arbre. Fa segles que espera algú que s'assegui a taula amb tothom. Agafa'l." },
            { fer: (z, fet) => z.fullaCau(fet) },
            { avis: "Has obtingut el MEDALLÓ DE L'ARBRE!", obj: 'medallo_arbre' },
            { fer: (z, fet) => { ['sopar_pastor_a', 'sopar_pastor_b', 'sopar_pastor_vell'].forEach(k => z.bombolla(k, '♪', null, 1400)); z.esperar(1500, fet); } },
        ],
        enAcabar: () => {
            E.dona("medallo_arbre"); E.posaFlag("fullaTiler"); E.posaFlag("soparFet");
            E.treu("pa_pastor");
            E.posaObjectiu("Tens el Medalló de l'Arbre. Ara falten el Saber del Pare Alcoví, la Benedicció del Pare Jordà i trobar Runna més enllà del mirador de les estrelles.");
            const z = game.scene.getScene("ZonaTiller");
            if (z && z.acabarSopar) z.acabarSopar();
        }
    }),

    espelmesTiller: E => ({
        pagines: [
        ]
    }),

    aldreuPastor: E => ({
        pagines: [
            { fer: (z, fet) => z.seq([c => { z.aldreuFlota.pause(); z.npcs.aldreu.y = 640; z.aldreuOmbra.setScale(0.5); c(); }, c => z.npcSalta('aldreu', c, 1), c => z.llum(z.npcs.aldreu.x, z.npcs.aldreu.y - 90, 0xb88aff, c)], fet) },
            { qui: "Aldreu, Pastor de Boira", text: "Ineu!" },
            { qui: "Ineu", text: "Germà Aldreu?!" },
            { qui: "Aldreu, Pastor de Boira", text: "L'Aldreu era un monjo que ningú no mirava. Ara sóc el Pastor de Boira. Mira'ls, com em segueixen. Ningú no m'havia seguit mai." },
            { qui: "Aldreu, Pastor de Boira", text: "El Mestre m'ho va prometre: «Tots els que tinguin por et seguiran.» Jo no el trobo a faltar: l'admiro. I ara sóc el seu pastor. El PASTOR!" },
            { qui: "Ineu", text: "On són l'Huri, el Fram i el Sardi?" },
            { qui: "Aldreu, Pastor de Boira", text: "Dormen. Els vaig portar jo al Mestre, un per un, de nit. Allà dins ja no tenen por de res." },
            { qui: "Ineu", text: "Aldreu, això que et parla no és bo. Encara pots tornar enrere." },
            { qui: "Aldreu, Pastor de Boira", text: "Tornar enrere? Mai! El Mestre em va veure, quan ningú més no ho feia. Calla! Be-e-e!" }
        ],
        enAcabar: () => game.scene.getScene("ZonaCirosa").iniciarBoss()
    }),

    aldreuDerrotat: E => ({
        pagines: [
            { fer: (z, fet) => z.aldreuAgenollat(fet) },
            { qui: "Aldreu, Pastor de Boira", text: "Has guanyat aquesta, monjo... Fa trenta anys que ningú no em mirava, i ell sí. Mai no li fallaré." },
            { qui: "Aldreu, Pastor de Boira", text: "El Mestre és al fons de les Gírgoles, i ja és despert. Vine, si goses: els nens ja són seus, i jo només sóc el primer dels seus ocells." },
            { fer: (z, fet) => z.aldreuAixeca(fet) },
            { qui: "Aldreu, Pastor de Boira", text: "Je, je, je... Ens veurem allà baix, monjo." },
            { fer: (z, fet) => z.aldreuMarxa(fet) },
            { qui: "Ineu", text: "(«Al fons de les Gírgoles»... Ara ja sé on mirar.)" },
            { qui: "Ineu", text: "(I el pastor vell em va prometre les esquelles dels seus avis. Aniré a veure'l vora el foc.)" }
        ],
        enAcabar: () => {
            E.posaFlag("pastorVencut");
            E.posaFlag("portaGirgolesVista");
            E.posaObjectiu("El pastor vell de la Cirosa guarda les esquelles dels seus avis.");
        }
    }),

    // ---------------- LES CEL·LES: LA MANDU, LA GERMANA DEL FRAM ----------------
    // Juga amb una nina davant la porta de la dreta de Sant Benet. A la primera conversa, la pena i la ràbia li fan arrencar el cap a la nina; no deixa que ningú
    // la toqui: només la pot arreglar el Fram (a l'epíleg).
    mandu: E => {
        if (E.flag('epilegFet')) return { pagines: [{ qui: 'Mandu', text: "El Fram m'ha cosit el cap de la nina! Diu que ara és una nina valenta. I jo ja no el deixo marxar enlloc." }] };
        if (E.flag('manduNinaTrencada')) return { pagines: [
            { qui: 'Mandu', text: "No la toquis, eh? Li he arrencat el cap perquè estava enfadada, i només el Fram sap cosir-lo." },
            { qui: 'Mandu', text: "La nina espera. Jo també espero." }
        ] };
        return {
            pagines: [
                { qui: 'Mandu', text: "Zuuum! La nina vola per sobre dels núvols... i aterra a la lluna! Ui... un monjo." },
                { qui: 'Ineu', text: "Hola. Jo sóc l'Ineu. Com et dius?" },
                { qui: 'Mandu', text: "Mandu. I ella és la nina. Sempre juguem aquí, davant la porta, esperant el Fram." },
                { qui: 'Ineu', text: "El Fram és el teu germà?" },
                { qui: 'Mandu', text: "Sí. Dormíem a la mateixa habitació. Una nit em vaig adormir amb ell al costat, i al matí el seu llit era buit. Sempre em diu on va, i aquesta vegada..." },
                { qui: 'Mandu', text: "La Meus diu que la boira se l'ha endut. Però jo li vaig dir que no se n'anés! Li ho vaig dir! I ell se n'ha anat igualment! PER QUÈ NO TORNA?!" },
                { fer: (z, fet) => z.seq([c => z.enquadrarMandu ? z.enquadrarMandu(c) : c(), c => z.bombolla('mandu', '!!', c, 500), c => z.manduTrencaNina ? z.manduTrencaNina(c) : c()], fet) },
                { qui: 'Mandu', text: "Ja n'hi ha prou! LI HE ARRENCAT EL CAP A LA NINA! I m'és igual: així el Fram haurà de tornar per cosir-lo!" },
                { qui: 'Ineu', text: "Tranquil·la, Mandu. Deixa'm veure-la: potser el puc cosir." },
                { qui: 'Mandu', text: "No! No la toquis! Només el Fram sap cosir caps de nina: ell m'arregla tot el que es trenca." },
                { qui: 'Ineu', text: "Doncs el trobaré i te'l portaré. I et cosirà la nina." },
                { qui: 'Mandu', text: "...Promès?" },
                { qui: 'Ineu', text: "Promès." }
            ],
            enAcabar: () => E.posaFlag('manduParlat')
        };
    },

    // ---------------- ROVELLONERA: LA NENA DE LES TRENES ----------------
    nenaTrenes: E => {
        const n = ["llac1", "llac2"].filter(f => E.flag(f)).length;
        if (E.flag("nenaAlliberada")) {
            return { pagines: [] };
        }
        if (!E.flag("nenaVista")) {
            return {
                pagines: [
                    { qui: "Nena de les Trenes", text: "No fugis, si us plau. Tothom que em veu surt corrent. Només voldria parlar amb algú." },
                    { qui: "Nena de les Trenes", text: "Vaig venir a collir rovellons amb la mare. Ella sempre deia: «On hi ha rovellons, hi ha pins; on hi ha pins, hi ha camí.» Però jo només mirava els rovellons, i em vaig oblidar del camí." },
                    { qui: "Nena de les Trenes", text: "La mare m'havia lligat les trenes amb dos llaços rosa. Quan em vaig adonar que m'havia perdut, vaig córrer, i els llaços van caure pel bosc. Fa molts, molts anys d'això." },
                    { qui: "Nena de les Trenes", text: "Un el vaig perdre pel camí de la Rovellonera, i l'altre a la primera clariana. Sense ells no puc sentir les mans de la mare. Si me'ls portessis..." },
                    { qui: "Ineu", text: "Els trobaré. No et quedaràs sola, t'ho prometo." }
                ],
                enAcabar: () => {
                    E.posaFlag("nenaVista");
                    E.posaObjectiu("La Nena de les Trenes va perdre dos llaços: un pel camí de la Rovellonera i l'altre a la primera clariana.");
                }
            };
        }
        if (n < 2) {
            const text = n === 0 ? "Encara no en tens cap. Un el vaig perdre pel camí de la Rovellonera, i l'altre a la primera clariana. Jo m'espero aquí."
                : E.flag("llac1") ? "Ja en tens un! L'altre el vaig perdre a la primera clariana."
                : "Ja en tens un! L'altre el vaig perdre pel camí de la Rovellonera.";
            return { pagines: [{ qui: "Nena de les Trenes", text }] };
        }
        return {
            pagines: [
                { qui: "Nena de les Trenes", text: "Els tens... els dos? Oh, monjo..." },
                // L'Ineu s'acosta a la dreta de la nena i, vingui d'on vingui, hi arriba mirant-la (no en la direcció en què ha caminat)
                { fer: (z, fet) => z.seq([c => z.ineuVa(z.nena.x + 70, z.nena.y + 10, () => { z.cara(z.nena); c(); }), c => { z.ajupir('ineu'); z.llum(z.nena.x, z.nena.y - 60, 0xffc8e0, c); }], fet) },
                { qui: "Nena de les Trenes", text: "Els sento... són les mans de la mare lligant-me'ls. Mare...? Mare, ets tu? M'has trobat?" },
                { fer: (z, fet) => z.mareNena(fet) },
                { qui: "Nena de les Trenes", text: "Ja no tinc por. Gràcies, monjo. Et deixo un dels llaços: guarda'l, que protegeix els qui es perden." },
                { avis: "Has obtingut el LLAÇ DE LA NENA.", obj: 'cinta_nena' },
                { qui: "Nena de les Trenes", text: "La mare me'l va lligar perquè res de dolent no em fes mal. Ara et servirà a tu: cada vegada que entris a un lloc nou, el llaç aguantarà el primer cop que rebis, i no et farà mal." },
                { qui: "Nena de les Trenes", text: "Només aguanta un cop per lloc. Quan surtis i tornis a entrar en un altre, el llaç es renova." }
            ],
            enAcabar: () => {
                E.posaFlag("nenaAlliberada"); E.posaFlag("trenesNena"); E.dona("cinta_nena"); E.treu("llac_nena");
                E.posaObjectiu(PROGRES.pista(E));
            }
        };
    },

    llac: k => E => ({
        pagines: [{ avis: "Has trobat un llaç de la nena (" + (["llac1", "llac2"].filter(f => E.flag(f) || f === "llac" + k).length) + "/2).", obj: 'llac_nena' }],      // (amb obj, l'Ineu alça el llaç)
        enAcabar: () => {
            E.posaFlag("llac" + k); E.dona("llac_nena");
            const n = ["llac1", "llac2"].filter(f => E.flag(f)).length;
            E.posaObjectiu(n < 2 ? (k === 1 ? "Troba el segon llaç de la Nena de les Trenes (1/2): és a la primera clariana." : "Troba el segon llaç de la Nena de les Trenes (1/2): és pel camí de la Rovellonera.") : "Ja tens els dos llaços: porta'ls a la Nena de les Trenes.");
        }
    }),

    // ---------------- SANT GABRIEL ----------------
    // El cofre de l'ermita de Sant Gabriel: hi ha el cristall de gel que demana el Galf (només es veu un cop el Galf n'ha parlat)
    cofreGabriel: E => E.flag("cristallGel") || E.te("cristall_gel") ? { pagines: [] } : ({
        pagines: [
            { qui: "Ineu", text: "Un cofre petit, tan fred que em fa mal a les mans. El pany és ple de gel i cedeix en tocar-lo. A la tapa hi ha gravat: «La rosada de l'alba no es fon ni a l'estiu.»" },
            { avis: "Has obtingut el CRISTALL DE GEL.", obj: "cristall_gel" }
        ],
        enAcabar: () => { E.dona("cristall_gel"); E.posaFlag("cristallGel"); }
    }),

    telescopiMon: E => {
        if (E.flag("estelLlorenc")) {
            return { pagines: [] };
        }
        if (E.flag("estelsFets")) {
            return { pagines: [{ qui: "Ineu", text: "L'últim estel s'ha apagat damunt del dipòsit de llevant. Hi ha una llum a l'aigua: he d'anar-hi." }] };
        }
        if (!E.te("telescopi")) {
            // El peu del mirador: es veu que hi va alguna cosa. Si el Galf ja li ha parlat del telescopi, l'Ineu hi cau; si no, pensa que potser el Galf n'entén
            return { pagines: [
                { qui: "Ineu", text: "(Un peu amb tres potes, plantat al mig del mirador. Sembla fet per aguantar alguna cosa... com una mena de trípode.)" },
                { qui: "Ineu", text: E.flag("garfBancSegut")
                    ? "(Potser el telescopi del qual m'ha parlat el Galf encaixaria aquí. Cal que me'l construeixi.)"
                    : "(Algú que entengui d'enginys sabria dir per a què serveix. El Galf, l'inventor de l'Era, potser en sap alguna cosa.)" }
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
            { avis: "Has obtingut l'ESTEL DE SANT LLORENÇ.", obj: 'estel_llorenc' },
            { qui: "Ineu", text: "Fa la mateixa claror que els set estels... Diuen que la boira no gosa tocar la llum de Sant Llorenç. El camí del Dolmen, a llevant, n'és ple." }
        ],
        enAcabar: () => {
            E.posaFlag("estelLlorenc"); E.dona("estel_llorenc");
            E.posaObjectiu("La boira que tapa el camí del Dolmen s'apartaria davant l'Estel de Sant Llorenç.");
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
    // Runna és dalt de la llosa: s'hi puja per darrere (el camí de margarides). Dalt, darrere l'espasa, l'Ineu diu les Paraules del Saber
    dolmen: E => {
        if (E.te("runna")) return { pagines: [] };
        if (!E.flag("placaCompleta")) return { pagines: [] };            // (a l'espasa no hi ha punt d'interacció fins que els tres medallons són a la placa: aquí no s'arriba)
        return {
            pagines: [
                { qui: "Ineu", vers: true, text: "LA FOSCOR TEM LA LLUM,\nPERÒ MÉS ENCARA EL RIURE!" },
                { fer: (z, fet) => z.alcarRunna(fet) }
            ],
            enAcabar: () => {
                E.dona("runna"); E.posaFlag("runna");
                E.posaObjectiu("Torna al Santuari: la Pianista t'ha d'ensenyar l'últim cant, el Cant del Miracle.");
            }
        };
    },

    // Des de baix: l'espasa és dalt de la llosa
    dolmenBaix: E => {
        if (E.te("runna")) return { pagines: [] };
        if (!E.flag("placaCompleta")) return { pagines: [] };            // fins que no són els tres medallons a la placa, el dolmen no diu res
        return { pagines: [{ qui: "Ineu", text: "(Runna és dalt de la llosa. Potser s'hi pot pujar per darrere.)" }] };
    },

    // La placa de pedra davant el dolmen: diu què cal per alçar Runna i hi van els tres medallons de pedra (el de l'Arbre, el del Saber i el de la Benedicció).
    // L'Ineu col·loca, un per un, els que porta; quan hi són els tres, la placa s'il·lumina i el dolmen respon (apareix el punt d'interacció a l'espasa).
    placaDolmen: E => {
        const MEDALLONS = [['medallo_arbre', 'placaArbre', "de l'arbre", "El permís del Gran Til·ler: la fulla tallada encaixa al seu lloc amb un clic de pedra."],
                           ['medallo_saber', 'placaSaber', 'del saber', "Les paraules del monjo: el llibre tallat entra al seu cercle i la pedra s'escalfa un instant."],
                           ['medallo_benedicio', 'placaBenedicio', 'de la benedicció', "La benedicció del prior: la mà oberta s'acobla al seu cercle, i la pedra brilla amb una llum daurada."]];
        const portats = MEDALLONS.filter(([obj, placat]) => E.te(obj) && !E.flag(placat));
        const pagines = [];
        if (!E.flag('placaCompleta')) pagines.push({ qui: "Placa", text: "Només podrà alçar Runna qui posseeixi el permís de l'arbre sagrat, les paraules del saber i la benedicció divina." });
        portats.forEach(([obj, placat, nom, text]) => {
            pagines.push({ fer: (z, fet) => z.posarMedallo(obj, placat, fet) });
            pagines.push({ qui: "Ineu", text: "(El medalló " + nom + ". " + text + ")" });
        });
        const aviat = MEDALLONS.filter(([, placat]) => !E.flag(placat) && !portats.some(p => p[1] === placat)).length;      // els que encara falten
        const totsPlacats = MEDALLONS.every(([, placat]) => E.flag(placat) || portats.some(p => p[1] === placat));
        if (totsPlacats && !E.flag('placaCompleta')) {
            pagines.push({ fer: (z, fet) => z.placaCompleta(fet) });
        } else if (!totsPlacats && portats.length) {
            pagines.push({ qui: "Ineu", text: "(Encara em falta " + (aviat === 1 ? "un medalló" : aviat + " medallons") + " per omplir la placa.)" });
        } else if (E.te('runna') || E.flag('runna')) {
            pagines.push({ qui: "Ineu", text: "(Els tres medallons continuen al seu lloc, a la placa. L'espasa ja és meva: Runna.)" });
        } else if (E.flag('placaCompleta')) {
            pagines.push({ qui: "Ineu", text: "(Els tres medallons són al seu lloc. Només em falta alçar l'espasa.)" });
        } else {
            // Sense cap medalló a les mans: què cal i què falta
            const falta = DIALEGS.faltaRunna(E);
            if (falta.length === 3) { if (!E.flag("alcuiPlacaDita")) pagines.push({ qui: "Ineu", text: "(El permís de l'arbre sagrat... les paraules del saber... la benedicció divina. Què voldrà dir tot això? El Pare Alcoví deu saber-ho: ho tindrà escrit a la Crònica.)" }); }
            else pagines.push({ qui: "Ineu", text: "(Tres cercles buits: un per a cada medalló. Em falta: " + falta.join(", ") + ".)" });
        }
        return { pagines, enAcabar: () => { E.posaFlag("placaDolmen"); E.desar(); } };
    },

    faltaRunna: E => {
        const falta = [];
        if (!E.flag("fullaTiler")) falta.push("el permís del Til·ler (el Medalló de l'Arbre)");
        if (!E.flag("saber")) falta.push("les Paraules del Saber (Medalló del Saber, Pare Alcoví)");
        if (!E.flag("benediccio")) falta.push("la Benedicció del prior (Medalló de la Benedicció, Pare Jordà)");
        return falta;
    },

    objectiuRunna: E => {
        const falta = [];
        if (!E.flag("saber")) falta.push("les Paraules del Saber (Pare Alcoví)");
        if (!E.flag("benediccio")) falta.push("la Benedicció del Pare Jordà");
        if (!E.flag("fullaTiler")) falta.push("el Medalló de l'Arbre (sopar)");
        if (falta.length) return "Per despertar Runna falta: " + falta.join(", ") + ".";
        if (!E.flag("estelLlorenc")) return PROGRES.pista(E);                  // el camí del Dolmen encara és tapat per la boira: primer l'estel
        return "Ho tens tot: porta els tres medallons a la placa del Dolmen i desperta Runna.";
    },

    // ---------------- NENA DE LES TRENES (sense creu) ----------------
    // (la missió es resol parlant-hi: l'Ineu li lliga els llaços a les trenes)

    portalTornada: E => ({
        pagines: []
    }),

    // ---------------- LA CASA GRAN ----------------
    portaReixa: E => ({
        pagines: [
            { qui: "Ineu", text: "Fa generacions que ningú no obre això. Haurà d'haver-hi una altra manera d'entrar-hi." }
        ]
    }),

    // Reixa del porxo vista des de l'escalinata (per dins només hi ha una barra de ferro)
    reixaDins: E => ({
        pagines: [
            { fer: (z, fet) => { z.cameras.main.shake(250, 0.004); z.agafar(fet, null, 0x8a8a90); } },
            { qui: "Ineu", text: "(La barra fora: ara puc entrar i sortir per la plaça.)" }
        ],
        enAcabar: () => E.posaFlag("reixaObertaDins")
    }),

    // Cambra secreta dels monjos (sala del tresor, entre el Celler i la Casa Gran)
    cofreCambra: E => {
        if (E.flag("cofreCambra")) return { pagines: [] };
        return {
            pagines: [
                { avis: "Has obtingut el PERGAMÍ DEL MONJO.", obj: 'pergami_monjo' },
                { qui: "Ineu", text: "«La clau de ferro és sota l'escala, murada amb els meus germans. Un guardià de pedra la vigila d'esquena: ningú no hi baixa fins que no et mira a la cara.»" },
                { qui: "Ineu", text: "I al revers, amb una altra lletra: «Qui busqui sortida, que alci la bóta marcada amb la creu.»" }
            ],
            enAcabar: () => {
                E.dona("pergami_monjo"); E.posaFlag("cofreCambra");
                E.posaObjectiu("A la cambra, la bóta de la creu vermella sembla fora de lloc: potser amaga una porta.");
            }
        };
    },

    // La bóta marcada de la cambra secreta: en alçar-la, deixa a la vista l'anella que obre la porta del fons
    botaTresor: E => ({
        pagines: [{ qui: "Ineu", text: "(Una bóta amb una creu vermella. Pesa molt menys que les altres... La faré rodar.)" }]
    }),

    homeRaimInt: E => ({
        pagines: [
            { qui: "Ineu", text: "Mira cap amunt i de costat, com si vigilés el balcó de sobre l'escala. Sembla que guardi alguna cosa." },
        ]
    }),


    // ---------------- LA CABANA DE LA JACMETA ----------------
    // La Jauneta, bruixa del bosc: una curiositat. Hi vas pel portal de l'Alzina Buida i et diu la pista del moment (és vident)
    jaumeta: E => {
        const pista = pistaActual(E).replace(/^Fill, /, "");
        if (!E.flag("jaumetaVista")) {
            return {
                pagines: [
                    { fer: (z, fet) => z.seq([c => z.npcFeina('jaumeta', 1400, 'bombolles', c), c => z.bombolla('jaumeta', '!', c, 700)], fet) },
                    { qui: "La Jauneta", text: "Ei! Tu! Qui coi t'ha dit que podies entrar? Els frares no veniu mai per aquí! Fot el camp o et faig créixer bolets a les orelles!" },
                    { qui: "Ineu", text: "Perdoni... He arribat per l'alzina. Duc aigua de la Font del Bisbe." },
                    { qui: "La Jauneta", text: "Aigua... de la Font del Bisbe?! Dona'm aixòooo! Fa trenta anys que no en tinc ni una gota neta." },
                    { fer: (z, fet) => z.seq([c => z.npcVa('jaumeta', 500, 360, c, 200), c => z.llum(450, 290, 0x6aff6a, c), c => z.npcVa('jaumeta', 560, 420, c, 200)], fet) },
                    { qui: "La Jauneta", text: "Mmm... collonut. Ets tonto, xaval, però ets bo. Els ocells i les guineus xerren, i jo ho sento tot: busques el Gran Til·ler, oi? No és al nord de sempre, com et diuen: és al nord de les Cel·les, i han tapat el camí amb una boira que no marxa amb el vent." },
                    { qui: "La Jauneta", text: "Mira, he barrejat l'aigua que queda amb romaní, herba de Sant Joan i una mica de pruna daurada. Aquest beuratge fa fugir la boira dolenta. No te'l beguis, eh! Aboca'l sobre la boira i prou, que si no et sortiran bolets." },
                    { avis: "Has obtingut el BEURATGE DE LA JACMETA.", obj: 'beuratge' }
                ],
                enAcabar: () => {
                    E.treu("aigua_sj"); E.posaFlag("jaumetaVista"); E.dona("beuratge");
                    E.posaObjectiu("El beuratge de la Jauneta desfaria la boira que tapa el camí del Gran Til·ler.");
                }
            };
        }
        return { pagines: [
            { qui: "La Jauneta", text: "Ja tornes, xaval? Els ocells m'ho diuen tot. Escolta: " + pista },
            { qui: "La Jauneta", text: "Ara fot el camp, que tinc feina amb la sopa. I no li diguis a ningú on visc, o et converteixo en bolet." }
        ] };
    },

    // La boira que tapa el camí al Til·ler (nord de les Cel·les)
    boiraTiller: E => E.te("beuratge") ? {
        pagines: [
            { qui: "Ineu", text: "Provaré amb el beuratge de la Jauneta." },
            { fer: (z, fet) => z.seq([c => z.deixar(c, iconaObjecte(z, 'beuratge'), 0x9a6aff), c => z.esvairBoira(c)], fet) },
            { qui: "Ineu", text: "Ha funcionat! El camí del Gran Til·ler torna a ser net." }
        ]
    } : {
        pagines: [
            { qui: "Ineu", text: "No hi puc passar. Aquesta boira no és de les que marxen amb el vent: per desfer-la em caldria algun líquid, una poció... alguna cosa que no tinc." }
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


    // El cofre de les joguines de la caseta: la maneta d'en Georgi és a sota
    cofreManeta: E => {
        if (E.te("maneta") || E.flag("maneta")) {
            return { pagines: [] };
        }
        if (!E.flag("jordiManeta")) {
            return { pagines: [
                { qui: "Ineu", text: "No és meva... Millor preguntar a en Georgi abans d'agafar-la." }
            ] };
        }
        return {
            pagines: [
                { fer: (z, fet) => { const d = Joc.leitmotiv(z, 'capsa', true); z.esperar(d * 1000 + 300, fet); } },     // en obrir el cofre, la capsa de música de dins toca el tema
                { avis: "Has obtingut la MANETA D'ENGRANATGE.", obj: 'maneta' }
            ],
            enAcabar: () => {
                E.dona("maneta"); E.posaFlag("maneta");
                if (E.flag("cofreCambra")) E.posaObjectiu("La maneta encaixaria al volant de ferro de l'Home del Raïm, a l'escalinata de la Casa Gran.");
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
                { qui: "Ineu", text: "Aquest ram és del Germà Francí, per als monjos que dormen aquí. El deixo als peus de l'àngel." },
                { fer: (z, fet) => z.deixar(() => { if (z.ramDeixat) z.ramDeixat(); fet(); }, 'flors', 0xffd8e8) },       // les flors es veuen al gerro mentre es parla
                { qui: "Ineu", text: "(Els pètals tremolen, com si algú respirés a prop. L'àngel, que mirava a terra, alça la cara al cel i somriu: ja no plora sol.)" },
                { qui: "Ineu", text: "El Germà Francí es posarà content. Va dir que, en tornar, tindria alguna cosa per a mi a Sant Antoni." },
                { avis: "Has deixat el RAM DE FLORS als peus de l'àngel." }
            ],
            enAcabar: () => { E.treu("ram"); E.posaFlag("florsCreu"); E.posaObjectiu("El Germà Francí, a Sant Antoni, t'espera amb una cosa."); }
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

// ---------------- DESPRÉS DE L'EPÍLEG ----------------
// Quan ja s'ha acabat la història (epilegFet), la gent diu una cosa nova. Si la funció torna null (té una lateral encara oberta),
// es manté el seu diàleg de sempre. Les que donen pistes (Pare Jordà, Venerables Sàvies, Alcoví, Til·ler) no canvien: ja saben dir que tot és fet.
const DIALEGS_FINAL = {
    pianista: E => ({ pagines: [
        { qui: 'La Pianista', text: "Has sentit l'orgue? Encara li falla el re, però canta. Escolta." },
        { fer: (z, fet) => { const d = Joc.leitmotiv(z, 'orgue') || 4; z.npcFeina('pianista', d * 1000, 'notes'); z.esperar(d * 1000 + 300, fet); } },
        { qui: 'La Pianista', text: "I tu, fill, no deixis mai la tarota al calaix." }] }),
    neus: E => ({ pagines: [
        { qui: 'Meus', text: "Ja els tinc a casa, i ja els he renyat tres vegades. Dues més i potser els deixo sortir a jugar." },
        { qui: 'Meus', text: "Gràcies, Ineu. No ho diré gaires cops, així que escolta'm bé: gràcies." }] }),
    marit_neus: E => ({ pagines: [
        { qui: 'Senyor Molner', text: "Des que han tornat els nens, la Meus canta mentre renta. Desafina, però canta." },
        { qui: 'Senyor Molner', text: "No li diguis que t'ho he dit." }] }),
    monja_pains: E => ({ pagines: [{ qui: 'Dolora', text: "El Sardi ja torna a robar galetes del rebost. Senyal que està bé del tot." }] }),
    monja_phili: E => ({ pagines: [{ qui: 'Pilària', text: "Hem posat una espelma per tu a cada cambra, Ineu. I una altra per si de cas." }] }),
    monja_charm: E => ({ pagines: [{ qui: 'Carmèlia', text: "Les tres te'n devem una. I nosaltres sempre paguem els deutes... amb pastissos." }] }),
    isidre: E => ({ pagines: [{ qui: 'Isílder', text: "Les flors de lluna ja s'obren de dia. Diria que és el riure dels nens, que les enganya." }] }),
    jaumeta: E => ({ pagines: [{ qui: 'La Jauneta', text: "L'olla ja no fa bombolles liles. Ara fa olor de farigola, com ha de ser." }] }),
    galf: E => ({ pagines: [{ qui: 'Galf', text: "Des del telescopi es veu tot el poble, i aquesta nit no hi ha ni un fil de boira." }] }),
    germa_francesc: E => ({ pagines: [{ qui: 'Germà Francí', text: "La tomba de l'àngel té flors noves cada dia. No sóc jo qui les hi porta... i no em preguntis qui." }] }),
    ciscu: E => ({ pagines: [{ qui: 'Iscu', text: "M'ha sortit el solitari! M'encanta això de les cartes. Ara ja no cal que m'amagui tant..." }] }),
    eva: E => E.flag('evaParlat') ? ({ pagines: [{ qui: 'Eve', text: "El Sardi ja torna a berenar aquí cada tarda. La Càren encara dorm, però ronca més contenta." }] }) : null,
    carry: E => E.flag('pallofaTornat') ? ({ pagines: [{ qui: 'Carry', text: "El Pallofa ja no s'escapa: des que no hi ha boira, no té res a perseguir." }] }) : null,
    pastor_vell: E => ({ pagines: [{ qui: 'Pastor vell', text: "Les ovelles tornen a ser blanques. Alguna encara té les orelles una mica liles, però ja li passarà." }] })
};
