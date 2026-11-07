/**
 * MODE DE PROVES: saltar a qualsevol punt de la història sense jugar des del principi.
 * S'activa obrint el joc amb ?proves a l'adreça (p. ex. http://localhost:8000/?proves). Llavors:
 *   - la partida es desa a part (clau 'runna_proves'): la partida de veritat no es toca;
 *   - a l'esquerra, a mitja alçada, hi ha un botó 🧪 que obre la llista de passos de la història.
 * Triar un pas deixa fets tots els anteriors (els flags i objectes de 'marca' de js/progres.js), et porta a la zona on passa
 * (la de DIARI_PASSOS, js/diari.js) i desa. També es pot anar a qualsevol zona sense tocar l'estat.
 */
const Proves = {
    actiu: new URLSearchParams(location.search).has('proves'),

    iniciar() {
        if (!this.actiu) return;
        Estat.CLAU = 'runna_proves';
        const b = document.createElement('button');
        b.textContent = '🧪';
        b.title = 'Proves: salta a un punt de la història';
        b.style.cssText = 'position:fixed;left:4px;top:40%;opacity:.8;z-index:20;font-size:22px;width:44px;height:44px;border-radius:8px;border:2px solid #d4af37;background:#1a120bcc;color:#fff;cursor:pointer';
        b.onclick = () => this.panell();
        document.body.appendChild(b);
    },

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
        Estat.dades.corsMax = Math.min(7, 3 + Math.floor(fins / 8) + (laterals ? 3 : 0));        // aproximadament els grans que hi hauria (el màxim del joc és 7: 3 + Pastor, sacerdotesses i els dos cofres)
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

    panell() {
        if (document.getElementById('panellProves')) { document.getElementById('panellProves').remove(); return; }
        const d = document.createElement('div');
        d.id = 'panellProves';
        d.style.cssText = 'position:fixed;inset:56px 8px 8px 8px;z-index:21;overflow:auto;background:#1a120bf2;color:#f2e6c8;border:2px solid #d4af37;border-radius:10px;padding:10px;font:15px Georgia,serif';
        const estil = 'display:block;width:100%;text-align:left;margin:3px 0;padding:9px 10px;font:inherit;color:inherit;background:#3a2a1a;border:1px solid #6a5030;border-radius:6px;cursor:pointer';
        const tanca = () => { d.remove(); document.removeEventListener('keydown', alEsc, true); };
        const alEsc = e => { if (e.key === 'Escape') tanca(); };
        document.addEventListener('keydown', alEsc, true);
        d.innerHTML = '<button id="provesTanca" title="Tanca" style="position:sticky;top:0;float:right;font:bold 20px Georgia,serif;padding:2px 12px;color:#f2e6c8;background:#6a1f12;border:1px solid #d4af37;border-radius:6px;cursor:pointer">✕</button>' +
            '<b>Proves</b> · la partida de proves es desa a part<br>' +
            '<label style="display:inline-block;margin:8px 0"><input type="checkbox" id="provesLaterals" checked> amb totes les missions laterals fetes</label><br>' +
            '<label style="display:inline-block;margin:0 0 8px"><input type="checkbox" id="provesMapa" checked> amb tot el mapa desbloquejat (tots els escenaris visibles)</label><br>' +
            '<label style="display:inline-block;margin:0 0 8px"><input type="checkbox" id="provesMelodies" checked> amb totes les melodies apreses (Aurora, Vespres i Miracle)</label>' +
            '<div style="margin:6px 0 2px;opacity:.8">Comença just abans de… (tot l\'anterior ja és fet)</div>';
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
        entrades.forEach((e, n) => {
            const b = document.createElement('button');
            b.style.cssText = estil;
            const opcions = () => [d.querySelector('#provesLaterals').checked, d.querySelector('#provesMapa').checked, d.querySelector('#provesMelodies').checked];
            if (e.passa !== undefined) {
                const p = PROGRES.passos[e.passa], info = DIARI_PASSOS[p.id];
                b.textContent = (n + 1) + '. ' + (info ? info[0] : p.id) + (info ? '  ·  ' + info[1].replace(/^Zona/, '') : '');
                b.onclick = () => { const [l, m, me] = opcions(); tanca(); this.saltar(e.passa, l, m, me); };
            } else {
                b.textContent = (n + 1) + '. ' + e.text + '  ·  BoscPi';
                b.onclick = () => {
                    const [l, m] = opcions(); tanca();
                    this.estatFins(iMiracle + 1, l, m, true);                       // fins al Cant del Miracle inclòs, amb les tres melodies apreses
                    FLAGS_PI.forEach(f => { delete Estat.dades.flags[f]; });
                    e.flags.forEach(f => Estat.posaFlag(f));
                    this.anar('ZonaBoscPi', 'santantoni');
                };
            }
            d.appendChild(b);
        });
        // Anar a una zona sense canviar l'estat (amb la partida de proves actual)
        const t = document.createElement('div');
        t.style.cssText = 'margin:12px 0 4px;opacity:.8';
        t.textContent = 'O ves a una zona amb l\'estat actual:';
        d.appendChild(t);
        const s = document.createElement('select');
        s.style.cssText = 'font:inherit;padding:8px;max-width:100%';
        Joc.ZONES.forEach(z => s.add(new Option(z.replace(/^Zona/, ''), z)));
        const anar = document.createElement('button');
        anar.textContent = 'Ves-hi';
        anar.style.cssText = 'font:inherit;padding:8px 14px;margin-left:6px';
        anar.onclick = () => { tanca(); if (!Estat.dades) Estat.carregar() || this.estatFins(0); this.anar(s.value); };
        d.append(s, anar);
        d.querySelector('#provesTanca').onclick = tanca;
        document.body.appendChild(d);
    }
};
Proves.iniciar();
