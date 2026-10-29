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
    estatFins(fins, laterals) {
        Estat.nova();
        const marca = llista => llista.forEach(m => m.startsWith('obj:') ? Estat.dona(m.slice(4)) : Estat.posaFlag(m));
        Estat.posaFlag('introVista');
        PROGRES.passos.slice(0, fins).forEach(p => marca(p.marca));
        if (laterals) PROGRES.laterals.forEach(l => marca(l.marca));
        if (Estat.flag('bastoObtingut')) { Estat.posaFlag('tutorialCombat'); Estat.posaFlag('combatActiu'); }
        Estat.dades.corsMax = Math.min(8, 3 + Math.floor(fins / 8) + (laterals ? 3 : 0));        // aproximadament els grans que hi hauria
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
        const sc = game.scene.getScenes(true).find(s => s.scene.key !== 'UI') || game.scene.getScene('Titol');
        Joc.continuar(sc);
    },

    saltar(i, laterals) {
        const p = PROGRES.passos[i];
        this.estatFins(i, laterals);
        this.anar((DIARI_PASSOS[p.id] && DIARI_PASSOS[p.id][1]) || 'ZonaPlaca');
    },

    panell() {
        if (document.getElementById('panellProves')) { document.getElementById('panellProves').remove(); return; }
        const d = document.createElement('div');
        d.id = 'panellProves';
        d.style.cssText = 'position:fixed;inset:56px 8px 8px 8px;z-index:21;overflow:auto;background:#1a120bf2;color:#f2e6c8;border:2px solid #d4af37;border-radius:10px;padding:10px;font:15px Georgia,serif';
        const estil = 'display:block;width:100%;text-align:left;margin:3px 0;padding:9px 10px;font:inherit;color:inherit;background:#3a2a1a;border:1px solid #6a5030;border-radius:6px;cursor:pointer';
        d.innerHTML = '<b>Proves</b> · la partida de proves es desa a part<br>' +
            '<label style="display:inline-block;margin:8px 0"><input type="checkbox" id="provesLaterals"> amb totes les missions laterals fetes</label>' +
            '<div style="margin:6px 0 2px;opacity:.8">Comença just abans de… (tot l\'anterior ja és fet)</div>';
        PROGRES.passos.forEach((p, i) => {
            const b = document.createElement('button');
            const info = DIARI_PASSOS[p.id];
            b.textContent = (i + 1) + '. ' + (info ? info[0] : p.id) + (info ? '  ·  ' + info[1].replace(/^Zona/, '') : '');
            b.style.cssText = estil;
            b.onclick = () => { const laterals = d.querySelector('#provesLaterals').checked; d.remove(); this.saltar(i, laterals); };
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
        anar.onclick = () => { d.remove(); if (!Estat.dades) Estat.carregar() || this.estatFins(0); this.anar(s.value); };
        d.append(s, anar);
        document.body.appendChild(d);
    }
};
Proves.iniciar();
