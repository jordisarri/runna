/**
 * MODE DE PROVES (debug): provar qualsevol cosa sense jugar des del principi.
 * S'activa obrint el joc amb ?proves a l'adreça (p. ex. http://localhost:8000/?proves). Llavors:
 *   - la partida es desa a part (clau 'runna_proves'): la partida de veritat no es toca;
 *   - a l'esquerra hi ha una barra petita: 🧪 obre el panell, ↻ reinicia la zona, 🛡 invulnerabilitat, ✚ cura, ⏭ salta el diàleg;
 *   - el panell és un calaix a la part de baix (el joc continua visible a dalt) amb cinc pestanyes:
 *       Missions: cada missió amb els seus estats («no començada», «té els 2 llaços», «feta»…), que posen els flags i objectes i et porten allà (js/proves_escenaris.js)
 *       Història: salta a un punt de la història principal (tot l'anterior fet)
 *       Estat:    tots els flags i objectes amb una casella per tenir-los o no, en viu (llista generada per eines/fer_llistes_proves.js)
 *       Anar:     a qualsevol zona i entrada, o teletransportar l'Ineu amb un clic al mapa
 *       Eines:    arma, flauta i cants, llanterna, guants, cors, mapa desbloquejat
 *   - els canvis d'estat es veuen en reiniciar la zona (les escenes llegeixen l'estat en construir-se): per defecte es reinicia sola.
 */
const Proves = {
    actiu: new URLSearchParams(location.search).has('proves') || new URLSearchParams(location.search).has('esglesia'),
    invuln: false,
    autoReinicia: true,
    pestanya: 'missions',

    iniciar() {
        if (!this.actiu) return;
        Estat.CLAU = 'runna_proves';
        try { this.pestanya = localStorage.getItem('provesPestanya') || 'missions'; } catch (e) { /* sense emmagatzematge */ }
        const barra = document.createElement('div');
        barra.id = 'barraProves';
        barra.style.cssText = 'position:fixed;left:4px;top:34%;z-index:22;display:flex;flex-direction:column;gap:4px;opacity:.85';
        [['🧪', 'Proves: obre el panell', () => this.panell()],
         ['↻', 'Reinicia la zona (mateix lloc, amb l\'estat actual)', () => this.reinicia()],
         ['🛡', 'Invulnerable (no et fan mal)', b => { this.invuln = !this.invuln; this.avis('Invulnerable: ' + (this.invuln ? 'sí' : 'no')); b.style.background = this.invuln ? '#2f6b2f' : '#1a120bcc'; }],
         ['✚', 'Cura del tot', () => { Estat.dades.vida = Estat.dades.corsMax * 2; this.ui() && this.ui().actualitzarHUD && this.ui().actualitzarHUD(); this.avis('Vida plena'); }],
         ['⏭', 'Salta el diàleg obert', () => this.saltaDialeg()]
        ].forEach(([t, titol, f]) => {
            const b = document.createElement('button');
            b.textContent = t; b.title = titol;
            b.style.cssText = 'font-size:20px;width:40px;height:40px;border-radius:8px;border:2px solid #d4af37;background:#1a120bcc;color:#fff;cursor:pointer';
            b.onclick = () => f(b);
            barra.appendChild(b);
        });
        document.body.appendChild(barra);
        // Invulnerabilitat: cada mig segon es torna a posar a la zona activa (les escenes es reinicien i ho oblidarien)
        setInterval(() => { if (this.invuln) { const z = this.zonaActiva(); if (z) z.invulnerableFins = Infinity; } }, 400);
    },

    // ---------- Ajudants ----------
    zonaActiva() { return typeof game !== 'undefined' ? Joc.zonaActiva({ game }) : null; },
    ui() { return typeof game !== 'undefined' ? game.scene.getScene('UI') : null; },
    avis(text) {
        let t = document.getElementById('avisProves');
        if (!t) { t = document.createElement('div'); t.id = 'avisProves'; t.style.cssText = 'position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:30;background:#1a120bf2;color:#f2e6c8;border:2px solid #d4af37;border-radius:8px;padding:6px 14px;font:14px Georgia,serif;pointer-events:none'; document.body.appendChild(t); }
        t.textContent = text; t.style.display = 'block';
        clearTimeout(this._avisT); this._avisT = setTimeout(() => { t.style.display = 'none'; }, 2200);
    },
    carregaEstat() { if (!Estat.dades && !Estat.carregar()) this.estatFins(0); },
    donaObj(o) { if (!Estat.te(o)) Estat.dades.objectes.push(o); },                       // (sense el so de rebre un objecte)
    treuObj(o) { Estat.treu(o); },
    treuFlag(f) { delete Estat.dades.flags[f]; },

    // Deixa fets els passos de la història anteriors a l'índex 'fins' (i, si cal, totes les missions laterals)
    estatFins(fins, laterals, mapa, melodies) {
        Estat.nova();
        const marca = llista => llista.forEach(m => m.startsWith('obj:') ? Estat.dona(m.slice(4)) : Estat.posaFlag(m));
        Estat.posaFlag('introVista');
        PROGRES.passos.slice(0, fins).forEach(p => marca(p.marca));
        if (laterals) PROGRES.laterals.forEach(l => marca(l.marca));
        if (melodies) { Object.values(MELODIES).forEach(m => Estat.posaFlag(m.flag)); Estat.dona('flauta'); }              // totes les melodies apreses (i la tarota)
        if (mapa) Joc.ZONES.forEach(z => Estat.posaFlag('visitada_' + z));                        // tot el mapa desbloquejat: totes les escenes visitades
        if (Estat.flag('placaCompleta')) ['medallo_arbre', 'medallo_saber', 'medallo_benedicio'].forEach(o => Estat.treu(o));        // els medallons ja són a la placa
        if (Estat.flag('bastoObtingut')) { Estat.posaFlag('tutorialCombat'); Estat.posaFlag('combatActiu'); }
        PARADES.forEach(pd => Estat.posaFlag('parada_' + pd.id));                                 // a proves, totes les parades del carruatge ja conegudes
        // Els grans del rosari que ja s'haurien guanyat (3 + Pastor de Boira, sacerdotesses, cofre de l'oratori i cofre de la cabana): mai més de 7
        if (Estat.flag('pastorVencut')) Estat.posaFlag('pastorGra');
        Estat.dades.corsMax = Math.min(Estat.GRANS_MAX, 3 + ['pastorVencut', 'mongesTrobades', 'cofreTresor', 'cofreCabanaCami'].filter(f => Estat.flag(f)).length);
        Estat.dades.vida = Estat.dades.corsMax * 2;
        const p = PROGRES.passos[fins];
        Estat.posaObjectiu(p ? p.pista(Estat) : 'Proves: final de la història.');
    },

    // Comença a la zona triada amb l'estat que hi ha a Estat.dades
    anar(zona, entrada) {
        Estat.dades.zona = zona;
        Estat.dades.entrada = entrada;
        Estat.dades.x = Estat.dades.y = null;
        Estat.desar();
        const sc = game.scene.getScenes(true).find(s => !['UI', 'Carrega'].includes(s.scene.key)) || game.scene.getScene('Titol');
        Joc.continuar(sc);
    },

    saltar(i, laterals, mapa, melodies) {
        const p = PROGRES.passos[i];
        this.estatFins(i, laterals, mapa, melodies);
        this.anar((DIARI_PASSOS[p.id] && DIARI_PASSOS[p.id][1]) || 'ZonaPlaca');
    },

    // Torna a construir la zona actual (perquè es vegin els canvis d'estat) deixant l'Ineu on era
    reinicia() {
        const z = this.zonaActiva();
        if (!z || !Estat.dades) { this.avis('No hi ha cap zona oberta'); return; }
        if (z.canviant) { this.avis('Espera: l\'escena fa una transició'); return; }
        if (z.guardarPosicio) z.guardarPosicio();
        Estat.dades.zona = z.scene.key;
        Estat.desar();
        Joc.continuar(z);
        this.avis('Zona reiniciada');
    },
    reiniciaSiCal() {
        if (!this.autoReinicia) return;
        clearTimeout(this._reiniT);
        this._reiniT = setTimeout(() => this.reinicia(), 600);
    },
    saltaDialeg() {
        const u = this.ui();
        if (u && u.dialeg) { u.tancarDialeg(); this.avis('Diàleg saltat'); } else this.avis('Cap diàleg obert');
    },
    // Teletransporta l'Ineu al punt del mapa que es clica
    tp() {
        const z = this.zonaActiva();
        if (!z || !z.ineu) { this.avis('No hi ha cap zona oberta'); return; }
        if (this._tp) { z.input.off('pointerdown', this._tp); this._tp = null; this.avis('Teletransport cancel·lat'); return; }
        this.avis('Clica al mapa on vols anar (de nou el botó cancel·la)');
        this._tp = p => {
            this._tp = null;
            const w = z.cameras.main.getWorldPoint(p.x, p.y);
            z.ineu.setPosition(w.x, w.y);
            if (z.ineu.body) z.ineu.body.reset(w.x, w.y);
            if (z.ombraIneu) z.ombraIneu.setPosition(w.x, w.y);
            z.ineu.setDepth(w.y);
            this.avis('Ineu a (' + Math.round(w.x) + ', ' + Math.round(w.y) + ')');
        };
        z.input.once('pointerdown', this._tp);
    },

    // Aplica un estat d'ESCENARIS (js/proves_escenaris.js). base: 'actual' | 'abansEpileg' | 'tot'
    aplicaEscenari(e, base) {
        if (!Estat.dades && !Estat.carregar()) base = base === 'actual' ? 'abansEpileg' : base;       // partida de proves nova: es parteix d'una història feta
        if (base === 'abansEpileg') this.estatFins(PROGRES.passos.findIndex(p => p.id === 'final'), false, true, true);
        else if (base === 'tot') this.estatFins(PROGRES.passos.length, false, true, true);
        this.carregaEstat();
        (e.treu || []).forEach(f => this.treuFlag(f));
        (e.posa || []).forEach(f => Estat.posaFlag(f));
        Object.entries(e.valors || {}).forEach(([k, v]) => Estat.posaFlag(k, v));
        (e.treuObj || []).forEach(o => this.treuObj(o));
        (e.obj || []).forEach(o => this.donaObj(o));
        Estat.posaObjectiu(PROGRES.pista(Estat));
        this.anar(e.zona, e.entrada);
    },

    // ---------- Panell ----------
    panell() {
        const antic = document.getElementById('panellProves');
        if (antic) { antic.remove(); document.removeEventListener('keydown', this._esc, true); return; }
        this.carregaEstat();
        const d = document.createElement('div');
        d.id = 'panellProves';
        d.style.cssText = 'position:fixed;left:0;right:0;bottom:0;height:46vh;min-height:260px;z-index:21;display:flex;flex-direction:column;background:#1a120bf5;color:#f2e6c8;border-top:2px solid #d4af37;font:15px Georgia,serif';
        d.addEventListener('keydown', e => e.stopPropagation());                 // que escriure al cercador no mogui l'Ineu
        d.addEventListener('keyup', e => e.stopPropagation());
        this._esc = e => { if (e.key === 'Escape' && !(e.target && e.target.tagName === 'INPUT')) this.panell(); };
        document.addEventListener('keydown', this._esc, true);

        const cap = document.createElement('div');
        cap.style.cssText = 'display:flex;align-items:center;gap:4px;padding:6px 8px 0 58px;flex-wrap:wrap';
        const cos = document.createElement('div');
        cos.style.cssText = 'flex:1;overflow:auto;padding:8px 10px 14px 58px';
        const PESTANYES = [['missions', 'Missions'], ['historia', 'Història'], ['estat', 'Estat'], ['anar', 'Anar'], ['eines', 'Eines']];
        const mostra = nom => {
            this.pestanya = nom;
            try { localStorage.setItem('provesPestanya', nom); } catch (e) { /* res */ }
            [...cap.querySelectorAll('button[data-p]')].forEach(b => { b.style.background = b.dataset.p === nom ? '#6a5030' : '#3a2a1a'; });
            cos.innerHTML = '';
            ({ missions: this.pMissions, historia: this.pHistoria, estat: this.pEstat, anar: this.pAnar, eines: this.pEines })[nom].call(this, cos);
            cos.scrollTop = 0;
        };
        PESTANYES.forEach(([k, t]) => {
            const b = document.createElement('button');
            b.dataset.p = k; b.textContent = t;
            b.style.cssText = 'font:inherit;padding:6px 12px;color:inherit;border:1px solid #6a5030;border-radius:6px 6px 0 0;cursor:pointer';
            b.onclick = () => mostra(k);
            cap.appendChild(b);
        });
        const x = document.createElement('button');
        x.textContent = '✕'; x.title = 'Tanca (Esc)';
        x.style.cssText = 'margin-left:auto;font:bold 18px Georgia,serif;padding:4px 12px;color:#f2e6c8;background:#6a1f12;border:1px solid #d4af37;border-radius:6px;cursor:pointer';
        x.onclick = () => this.panell();
        cap.appendChild(x);
        d.append(cap, cos);
        document.body.appendChild(d);
        mostra(this.pestanya);
    },

    // Botó de text amb estil
    boto(text, f, extra = '') {
        const b = document.createElement('button');
        b.textContent = text;
        b.style.cssText = 'font:inherit;margin:2px;padding:7px 10px;color:inherit;background:#3a2a1a;border:1px solid #6a5030;border-radius:6px;cursor:pointer;text-align:left;' + extra;
        b.onclick = f;
        return b;
    },
    etiqueta(text, css = '') { const e = document.createElement('div'); e.style.cssText = 'margin:8px 0 3px;opacity:.85;' + css; e.textContent = text; return e; },

    // --- Pestanya Missions ---
    pMissions(cos) {
        const sel = document.createElement('select');
        sel.style.cssText = 'font:inherit;padding:5px;max-width:100%';
        [['actual', 'Partir de l\'estat actual (no toca res més)'], ['abansEpileg', 'Partir d\'una història feta fins abans de l\'epíleg'], ['tot', 'Partir d\'una història tota feta']].forEach(([v, t]) => sel.add(new Option(t, v)));
        try { sel.value = localStorage.getItem('provesBase') || 'actual'; } catch (e) { /* res */ }
        sel.onchange = () => { try { localStorage.setItem('provesBase', sel.value); } catch (e) { /* res */ } };
        cos.append(this.etiqueta('Base de la partida en aplicar un estat (la història principal):', 'margin-top:0'), sel,
                   this.etiqueta('Tria l\'estat de la missió: es posen els flags i objectes i l\'Ineu va al lloc on cal provar-la.'));
        ESCENARIS.forEach(m => {
            const lat = m.lateral && PROGRES.laterals.find(l => l.id === m.lateral);
            let marca = '';
            if (lat && Estat.dades) marca = lat.fet(Estat) ? '  ✓ feta' : lat.obert(Estat) ? '  ○ oberta' : '  — encara no oberta';
            const t = this.etiqueta(m.nom + marca, 'font-weight:bold;opacity:1;margin-top:10px');
            const fila = document.createElement('div');
            m.estats.forEach(e => fila.appendChild(this.boto(e.nom, () => { this.aplicaEscenari(e, sel.value); this.panell(); })));
            cos.append(t, fila);
        });
    },

    // --- Pestanya Història ---
    pHistoria(cos) {
        const check = (id, text, marcat) => {
            const l = document.createElement('label');
            l.style.cssText = 'display:inline-block;margin:2px 14px 2px 0';
            l.innerHTML = '<input type="checkbox" id="' + id + '"' + (marcat ? ' checked' : '') + '> ' + text;
            return l;
        };
        cos.append(check('provesLaterals', 'amb totes les missions laterals fetes', true), check('provesMapa', 'amb tot el mapa desbloquejat', true), check('provesMelodies', 'amb totes les melodies apreses', true),
                   this.etiqueta('Comença just abans de… (tot l\'anterior ja és fet)'));
        // Les etapes del Pi dels Tres Cants (Bosc del Pi, al sud de Sant Antoni) van just després del Cant del Miracle: ja es tenen els tres cants
        // i es pot donar la volta per Sant Antoni. La resta de la història queda feta només fins aquí.
        const iMiracle = PROGRES.passos.findIndex(p => p.id === 'cantMiracle');
        const FLAGS_PI = ['piObert', 'piAurora', 'piPedres', 'piMiracle', 'piVist', 'flauta_pi'];
        const entrades = [];
        PROGRES.passos.forEach((p, i) => {
            entrades.push({ passa: i });
            if (i === iMiracle) [['Pi adormit: cap cant tocat encara', []],
                ['Pi a mig despertar: Aurora i Vespres tocats (falta el Miracle)', ['piAurora', 'piPedres', 'flauta_pi']],
                ["Pi despert: les branques s'han alçat i el camí és lliure", ['piAurora', 'piPedres', 'piMiracle', 'piObert', 'piVist', 'flauta_pi']]
            ].forEach(([text, flags]) => entrades.push({ text, flags }));
        });
        const opcions = () => ['#provesLaterals', '#provesMapa', '#provesMelodies'].map(s => cos.querySelector(s).checked);
        entrades.forEach((e, n) => {
            let text, f;
            if (e.passa !== undefined) {
                const p = PROGRES.passos[e.passa], info = DIARI_PASSOS[p.id];
                text = (n + 1) + '. ' + (info ? info[0] : p.id) + (info ? '  ·  ' + info[1].replace(/^Zona/, '') : '');
                f = () => { const [l, m, me] = opcions(); this.panell(); this.saltar(e.passa, l, m, me); };
            } else {
                text = (n + 1) + '. ' + e.text + '  ·  BoscPi';
                f = () => {
                    const [l, m] = opcions(); this.panell();
                    this.estatFins(iMiracle + 1, l, m, true);                       // fins al Cant del Miracle inclòs, amb les tres melodies apreses
                    FLAGS_PI.forEach(fl => { delete Estat.dades.flags[fl]; });
                    e.flags.forEach(fl => Estat.posaFlag(fl));
                    this.anar('ZonaBoscPi', 'santantoni');
                };
            }
            cos.appendChild(this.boto(text, f, 'display:block;width:100%'));
        });
    },

    // --- Pestanya Estat: flags i objectes en viu ---
    pEstat(cos) {
        const barra = document.createElement('div');
        barra.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;align-items:center;position:sticky;top:-8px;background:#1a120bf5;padding:4px 0;z-index:1';
        const cerca = document.createElement('input');
        cerca.placeholder = 'Cerca un flag o un objecte…';
        cerca.style.cssText = 'font:inherit;padding:6px;flex:1;min-width:140px';
        const opc = (text, marcat) => { const l = document.createElement('label'); const c = document.createElement('input'); c.type = 'checkbox'; c.checked = marcat; l.append(c, ' ' + text); l.style.whiteSpace = 'nowrap'; return [l, c]; };
        const [lAct, cAct] = opc('només els que tinc', false), [lDer, cDer] = opc('mostra els derivats (visitada_, parada_…)', false), [lRei, cRei] = opc('reinicia la zona en canviar', this.autoReinicia);
        barra.append(cerca, lAct, lDer, lRei, this.boto('↻ Reinicia ara', () => this.reinicia()));
        const llista = document.createElement('div');
        cos.append(barra, llista);
        const derivat = n => /^(visitada_|parada_|esb_|premi|pedra_)/.test(n);
        const pinta = () => {
            llista.innerHTML = '';
            const q = cerca.value.trim().toLowerCase();
            const flags = [...new Set([...(typeof PROVES_FLAGS !== 'undefined' ? PROVES_FLAGS : []), ...Object.keys(Estat.dades.flags)])].sort();
            const objs = [...new Set([...(typeof PROVES_OBJECTES !== 'undefined' ? PROVES_OBJECTES : []), ...Estat.dades.objectes])].sort();
            const fila = (tipus, n, te, valor) => {
                const l = document.createElement('label');
                l.style.cssText = 'display:inline-block;width:260px;max-width:100%;margin:1px 6px 1px 0;padding:3px 6px;border-radius:4px;background:' + (te ? '#2f4a2a' : '#2a1d12') + ';cursor:pointer';
                const c = document.createElement('input'); c.type = 'checkbox'; c.checked = te;
                c.onchange = () => {
                    if (tipus === 'f') { if (c.checked) Estat.posaFlag(n); else this.treuFlag(n); } else { if (c.checked) this.donaObj(n); else this.treuObj(n); }
                    l.style.background = c.checked ? '#2f4a2a' : '#2a1d12';
                    Estat.desar();
                    this.reiniciaSiCal();
                };
                l.append(c, ' ' + n + (valor !== undefined && valor !== true ? ' = ' + valor : ''));
                return l;
            };
            const afegeix = (titol, llistaN, tipus) => {
                const f = llistaN.filter(n => (!q || n.toLowerCase().includes(q)) && (cDer.checked || tipus === 'o' || !derivat(n) || q))
                    .filter(n => !cAct.checked || (tipus === 'f' ? Estat.flag(n) : Estat.te(n)));
                llista.appendChild(this.etiqueta(titol + ' (' + f.length + ')', 'font-weight:bold;opacity:1'));
                f.slice(0, 400).forEach(n => llista.appendChild(fila(tipus, n, tipus === 'f' ? Estat.flag(n) : Estat.te(n), tipus === 'f' ? Estat.dades.flags[n] : undefined)));
            };
            afegeix('Objectes', objs, 'o');
            afegeix('Flags', flags, 'f');
        };
        cerca.oninput = pinta; cAct.onchange = pinta; cDer.onchange = pinta; cRei.onchange = () => { this.autoReinicia = cRei.checked; };
        pinta();
    },

    // --- Pestanya Anar ---
    pAnar(cos) {
        const zones = Joc.ZONES;
        const sz = document.createElement('select'), se = document.createElement('select');
        [sz, se].forEach(s => { s.style.cssText = 'font:inherit;padding:7px;max-width:100%;margin:2px 6px 2px 0'; });
        zones.forEach(z => sz.add(new Option(z.replace(/^Zona/, ''), z)));
        const act = this.zonaActiva();
        if (act) sz.value = act.scene.key;
        const omple = () => {
            se.innerHTML = '';
            const sc = game.scene.getScene(sz.value), ent = (sc && sc.config && sc.config.entrades) || {};
            Object.keys(ent).forEach(k => se.add(new Option(k, k)));
            if (!se.options.length) se.add(new Option('(entrada per defecte)', ''));
        };
        sz.onchange = omple; omple();
        cos.append(this.etiqueta('Anar a una zona i una entrada, amb l\'estat actual (no toca flags ni objectes):', 'margin-top:0'), sz, se,
            this.boto('Ves-hi', () => { this.carregaEstat(); this.panell(); this.anar(sz.value, se.value || undefined); }),
            this.etiqueta('A la zona on ets:'),
            this.boto('📍 Teletransporta l\'Ineu (clic al mapa)', () => { this.panell(); this.tp(); }),
            this.boto('↻ Reinicia la zona (mateix lloc)', () => { this.panell(); this.reinicia(); }));
    },

    // --- Pestanya Eines ---
    pEines(cos) {
        const interruptor = (text, te, posa, treu) => {
            const b = this.boto('', () => { te() ? treu() : posa(); Estat.desar(); pinta(); this.reiniciaSiCal(); });
            b._text = text; b._te = te;
            return b;
        };
        const botons = [];
        const arma = (nom, objs, fl, actiu) => { const b = this.boto('', () => {
            ['basto', 'basto_tiller', 'runna'].forEach(o => this.treuObj(o));
            objs.forEach(o => this.donaObj(o));
            if (objs.length) { Estat.posaFlag('bastoObtingut'); Estat.posaFlag('tutorialCombat'); Estat.posaFlag('combatActiu'); }
            if (fl) Estat.posaFlag('runna'); else this.treuFlag('runna');
            Estat.desar(); pinta(); this.reiniciaSiCal();
        }); b._text = nom; b._te = actiu; return b; };
        const sec = (t, ...bs) => { cos.appendChild(this.etiqueta(t)); bs.forEach(b => { botons.push(b); cos.appendChild(b); }); };
        const teR = () => Estat.te('runna'), teB = () => Estat.te('basto_tiller'), teBa = () => Estat.te('basto');
        sec('Arma', arma('Cap', [], false, () => !teR() && !teB() && !teBa()), arma('Bastó', ['basto'], false, () => !teR() && !teB() && teBa()),
            arma('Branca del Til·ler', ['basto_tiller'], false, () => !teR() && teB()), arma('Runna', ['runna'], true, teR));
        const obj = (nom, o) => interruptor(nom, () => Estat.te(o), () => this.donaObj(o), () => this.treuObj(o));
        const fl = (nom, f) => interruptor(nom, () => Estat.flag(f), () => Estat.posaFlag(f), () => this.treuFlag(f));
        sec('Flauta i cants', obj('Flauta (tarota)', 'flauta'), fl('Cant de l\'Aurora', 'cantAurora'), fl('Cant de Vespres (Pedres)', 'cantPedres'), fl('Cant del Miracle', 'cantMiracle'));
        sec('Objectes', obj('Llanterna', 'llanterna'), obj('Guants', 'guants'), obj('Clau del campanar', 'clau_campanar'), obj('Clau del sagrari', 'clau_sagrari'), obj('Clau de ferro', 'clau_ferro'), obj('Clau de les Gírgoles', 'clau_girgoles'));
        const pinta = () => botons.forEach(b => { const si = b._te(); b.textContent = (si ? '✔ ' : '☐ ') + b._text; b.style.background = si ? '#2f4a2a' : '#3a2a1a'; });
        pinta();
        cos.appendChild(this.etiqueta('Vida'));
        const cors = document.createElement('select');
        cors.style.cssText = 'font:inherit;padding:7px;margin:2px 6px 2px 0';
        for (let n = 3; n <= Estat.GRANS_MAX; n++) cors.add(new Option(n + ' grans del rosari', n));
        cors.value = Estat.dades.corsMax;
        cors.onchange = () => { Estat.dades.corsMax = +cors.value; Estat.dades.vida = Estat.dades.corsMax * 2; Estat.desar(); this.ui() && this.ui().actualitzarHUD && this.ui().actualitzarHUD(); };
        cos.append(cors, this.boto('✚ Cura del tot', () => { Estat.dades.vida = Estat.dades.corsMax * 2; Estat.desar(); this.ui() && this.ui().actualitzarHUD && this.ui().actualitzarHUD(); this.avis('Vida plena'); }));
        cos.appendChild(this.etiqueta('Mapa'));
        cos.appendChild(this.boto('🗺 Desbloqueja tot el mapa (totes les zones visitades)', () => { Joc.ZONES.forEach(z => Estat.posaFlag('visitada_' + z)); Estat.desar(); this.avis('Mapa desbloquejat'); }));
        cos.appendChild(this.etiqueta('Els canvis d\'objectes i flags es veuen en reiniciar la zona (↻ a la barra de l\'esquerra).', 'font-size:13px'));
    }
};
Proves.iniciar();
// ?esglesia: obre directament la nova església jugable (apart de la de la història), amb la partida de proves just abans del Cant de l'Aurora
if (new URLSearchParams(location.search).has('esglesia')) {
    const espera = setInterval(() => {
        try {
            if (!Joc.recursosLlestos || !game.scene.isActive('Titol')) return;
            clearInterval(espera);
            Proves.estatFins(Math.max(0, PROGRES.passos.findIndex(p => p.id === 'cantAurora')), true, true, false);
            Proves.anar('ZonaEsglesiaNova', 'porta');
        } catch (e) { /* el joc encara no és a punt */ }
    }, 300);
}
