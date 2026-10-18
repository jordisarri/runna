/**
 * DIÀLEGS (extrets de GUIO.md)
 * Cada entrada és una funció que rep l'Estat i retorna { pagines: [{qui, text}], enAcabar? }.
 * Així cada personatge diu una cosa o una altra segons el progrés (flags).
 * qui: nom que surt a la caixa ('' = narrador / sistema).
 */
const DIALEGS = {

    // ---------------- PLAÇA ----------------
    pareJordi: E => {
        if (!E.flag('clauerNovici')) {
            return {
                pagines: [
                    { qui: 'Pare Jordi', text: 'Ineu, bon dia. Que bé que hagis sortit, et buscava.' },
                    { qui: 'Pare Jordi', text: 'No et vull espantar, però el Biel, de les cel·les de Sant Antoni, fa dos dies que va desaparèixer. I aquesta nit ha estat el Pol, de Sant Benet.' },
                    { qui: 'Pare Jordi', text: 'Les famílies estan angoixades. I aquesta boira que surt de sota terra... no m\'agrada gens.' },
                    { qui: 'Pare Jordi', text: 'Tu tens bons ulls i bon cor. Pren el meu clauer de novici: parla amb tothom i explica-m\'ho tot.' },
                    { qui: '', text: 'Has obtingut el CLAUER DE NOVICI!\nObre la biblioteca, les cel·les i el Celler de la Casa Gran.' }
                ],
                enAcabar: () => {
                    E.posaFlag('clauerNovici');
                    E.dona('clauer');
                    E.posaObjectiu('Parla amb les famílies de les cel·les (comença per Sant Antoni).');
                }
            };
        }
        return {
            pagines: [
                { qui: 'Pare Jordi', text: 'Comença per les famílies de Sant Antoni, a tocar de la carretera, passat el Monestir.' },
                { qui: 'Pare Jordi', text: 'I vés amb compte, Ineu. Torna abans que es faci fosc.' }
            ]
        };
    },

    germaAndreu: E => {
        if (!E.flag('parlatAndreu')) {
            return {
                pagines: [
                    { qui: 'Germà Andreu', text: 'Ineu! Quin drama, oi? Tothom corrent amunt i avall...' },
                    { qui: 'Germà Andreu', text: 'Segur que els nens s\'han amagat per jugar. Jo els entenc, eh... Tantes pregàries, tant de silenci...' },
                    { qui: 'Germà Andreu', text: 'Ets del Barça, tu? Tinc uns cromos que els nens es moren per tenir. Ells sí que m\'escolten.' },
                    { qui: 'Ineu', text: '(El Germà Andreu sembla molt tranquil. Massa tranquil.)' }
                ],
                enAcabar: () => E.posaFlag('parlatAndreu')
            };
        }
        return {
            pagines: [
                { qui: 'Germà Andreu', text: 'Avui no tinc temps, Ineu. Tinc... coses a fer. Força Barça!' }
            ]
        };
    },

    bassadoria: E => ({
        pagines: [
            { qui: '', text: 'La Bassadòria, al costat de la Creu de l\'Aparició.' },
            { qui: 'Ineu', text: 'L\'aigua sempre ha estat clara... Ara és tèrbola i fa olor de soterrani. I en surt aquesta boira lila, a glopades.' }
        ]
    }),

    creu: E => ({
        pagines: [
            { qui: '', text: 'La Creu de l\'Aparició. Sempre hi ha flors fresques als seus peus.' },
            { qui: 'Ineu', text: 'Avui les flors estan pansides. Com si la boira se\'n begués el color.' }
        ]
    }),

    ruines: E => ({
        pagines: [
            { qui: '', text: 'Les Ruïnes de l\'Església Inacabada. Murs i arcs que mai no es van acabar de construir.' },
            { qui: 'Ineu', text: 'Hi ha signes gravats a les pedres velles. No els entenc... potser el Pare Alcuí sí.' }
        ]
    }),

    reixa: E => ({
        pagines: [
            { qui: 'Ineu', text: 'Per aquesta reixa del terra surt boira. És freda com el gel... i sembla que respiri.' }
        ]
    }),

    cartellOest: E => ({ pagines: [{ qui: '', text: '← Casa Gran · Font de la Mare de Déu · Bar' }] }),
    cartellEst: E => ({ pagines: [{ qui: '', text: '→ Monestir · Cel·les de Sant Antoni' }] }),

    // ---------------- ESGLÉSIA ----------------
    pareDaniel: E => {
        if (!E.flag('parlatDaniel')) {
            return {
                pagines: [
                    { qui: 'Pare Daniel', text: 'Ah, Ineu... Escolta.' },
                    { qui: '', text: 'El Pare Daniel prem les tecles de l\'orgue. Les notes surten... i s\'apaguen a mig aire, com si algú se les empassés.' },
                    { qui: 'Pare Daniel', text: 'És com si alguna cosa s\'estigués menjant la música. Fa tres nits que passa, des que va arribar la boira.' }
                ],
                enAcabar: () => E.posaFlag('parlatDaniel')
            };
        }
        return { pagines: [{ qui: 'Pare Daniel', text: 'Si trobes alguna cosa que torni la música, porta-me-la. Jo no puc deixar l\'orgue.' }] };
    },

    retaule: E => ({
        pagines: [{ qui: '', text: 'El Retaule Major, barroc, tot d\'or i de figures. Avui fins i tot ell sembla més apagat.' }]
    }),

    // ---------------- MONESTIR ----------------
    pareAlcui: E => ({
        pagines: [
            { qui: 'Pare Alcuí', text: 'Ineu, fill. Aquesta boira no és natural. Les boires d\'aquí baixen de les muntanyes; aquesta puja de sota terra.' },
            { qui: 'Pare Alcuí', text: 'Buscaré a la Crònica del Miracle. Si algú ja ho va veure abans, ho haurà deixat escrit.' }
        ],
        enAcabar: () => E.posaFlag('parlatAlcui')
    }),

    // ---------------- CASA GRAN ----------------
    homeRaim: E => ({
        pagines: [
            { qui: '', text: 'L\'Home del Raïm, a les escalinates de la Casa Gran. Té un carràs de raïm a les mans...' },
            { qui: 'Ineu', text: '...i el cap posat del revés. Sembla que vigili alguna cosa a la seva esquena.' }
        ]
    }),

    font: E => ({
        pagines: [{ qui: '', text: 'La Font de la Mare de Déu. L\'aigua raja, però freda com el gel.' }]
    }),

    // ---------------- GENÈRICS ----------------
    enConstruccio: nom => E => ({
        pagines: [{ qui: '', text: `${nom}\n(Aquesta zona encara s'està construint. Aviat hi podràs entrar!)` }]
    })
};
