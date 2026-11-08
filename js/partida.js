/**
 * ESTAT DE LA PARTIDA
 * Totes les dades que cal desar viuen a Estat.dades (objecte JSON pla).
 * Es desa al localStorage del navegador i es pot exportar com a "codi de partida" (Base64).
 */
const Estat = {
    CLAU: 'runna_partida',
    VERSIO: 1,
    PREFIX_CODI: 'RUNNA1-',
    dades: null,

    nova() {
        this.dades = {
            versio: this.VERSIO,
            zona: 'ZonaMonestir',
            entrada: 'inici',
            x: null,
            y: null,
            vida: 6,          // en meitats de gra del rosari (6 = 3 grans encesos)
            corsMax: 3,
            objectiu: 'Parla amb el Pare Jordà a la Plaça.',
            objectes: [],
            flags: {},
            pingpongVictories: 0
        };
        return this.dades;
    },

    // ---------- Rosari ----------
    // Els grans del rosari (els cors) són 3 al principi i mai poden passar de GRANS_MAX: 3 + el Pastor de Boira, les tres sacerdotesses, el cofre de l'oratori i el de la cabana
    GRANS_MAX: 7,
    // Un gran més (cura del tot). Retorna fals si ja n'hi ha el màxim (només es cura).
    afegirGra() {
        const d = this.dades, nou = d.corsMax < this.GRANS_MAX;
        if (nou) d.corsMax += 1;
        d.vida = d.corsMax * 2;
        return nou;
    },

    // ---------- Flags i objectes ----------
    flag(nom) { return !!(this.dades && this.dades.flags[nom]); },
    posaFlag(nom, valor = true) { this.dades.flags[nom] = valor; },
    te(objecte) { return this.dades.objectes.includes(objecte); },
    dona(objecte) { if (!this.te(objecte)) { this.dades.objectes.push(objecte); if (typeof Sfx !== 'undefined') Sfx.objecte(); } },
    treu(objecte) { this.dades.objectes = this.dades.objectes.filter(o => o !== objecte); },
    posaObjectiu(text) { this.dades.objectiu = text; },
    // L'objectiu que es mostra (HUD i Diari) és SEMPRE el del primer pas de la història que encara falta, segons PROGRES (progres.js):
    // així no depèn de l'ordre en què el jugador fa les coses ni dels textos escrits a mà als diàlegs (posaObjectiu només és un recanvi).
    objectiu() { return (this.dades && typeof PROGRES !== 'undefined' && PROGRES.pista(this)) || (this.dades && this.dades.objectiu) || ''; },

    // ---------- localStorage ----------
    desar() {
        try {
            localStorage.setItem(this.CLAU, JSON.stringify(this.dades));
            return true;
        } catch (e) {
            console.warn('No s\'ha pogut desar la partida', e);
            return false;
        }
    },

    // ---------- Desa i carrega a un fitxer ----------
    // Per a qui juga en mode privat/incògnit (el navegador esborra el que es desa en tancar-lo, o no deixa desar): la partida es pot baixar a un fitxer i tornar-la a carregar.
    emmagatzematgeOk() {
        try { const k = this.CLAU + '_prova'; localStorage.setItem(k, '1'); localStorage.removeItem(k); return true; } catch (e) { return false; }
    },

    // Baixa la partida actual com a fitxer .json
    exportar() {
        const text = JSON.stringify({ joc: 'runna', versio: this.VERSIO, desatEl: new Date().toISOString(), dades: this.dades });
        const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
        const a = document.createElement('a'), d = new Date(), z = n => String(n).padStart(2, '0');
        a.href = url; a.download = `runna-partida-${d.getFullYear()}${z(d.getMonth() + 1)}${z(d.getDate())}-${z(d.getHours())}${z(d.getMinutes())}.json`;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
    },

    // Obre el selector de fitxers i, si el fitxer és una partida vàlida, la deixa com a partida actual (i la desa si es pot). fet(ok): ok és cert si s'ha carregat.
    importar(fet) {
        const inp = document.createElement('input');
        inp.type = 'file'; inp.accept = '.json,application/json'; inp.style.display = 'none';
        document.body.appendChild(inp);
        let acabat = false;
        const acaba = ok => { if (acabat) return; acabat = true; inp.remove(); if (fet) fet(ok); };
        inp.addEventListener('change', () => {
            const f = inp.files && inp.files[0];
            if (!f) return acaba(false);
            const lector = new FileReader();
            lector.onload = () => {
                try {
                    const obj = JSON.parse(String(lector.result));
                    const d = this.validar(obj && obj.dades ? obj.dades : obj);
                    if (!d || !d.flags || !Array.isArray(d.objectes)) return acaba(false);
                    this.dades = d;
                    this.migrar();
                    this.desar();
                    acaba(true);
                } catch (e) { acaba(false); }
            };
            lector.onerror = () => acaba(false);
            lector.readAsText(f);
        });
        inp.addEventListener('cancel', () => acaba(false));
        inp.click();
    },

    hiHaPartida() {
        try { return !!localStorage.getItem(this.CLAU); } catch (e) { return false; }
    },

    // Partides de versions velles: els tres medallons del Dolmen (abans només eren flags; la Fulla del Til·ler era un objecte)
    migrar() {
        const d = this.dades, f = d.flags;
        if (f.runna || f.placaCompleta || (d.objectes || []).includes('runna')) return;
        [['fullaTiler', 'medallo_arbre', 'placaArbre'], ['saber', 'medallo_saber', 'placaSaber'], ['benediccio', 'medallo_benedicio', 'placaBenedicio']].forEach(([flag, obj, placat]) => {
            if (f[flag] && !f[placat] && !d.objectes.includes(obj)) d.objectes.push(obj);
        });
        d.objectes = d.objectes.filter(o => o !== 'fulla_tiler');
    },

    carregar() {
        try {
            const text = localStorage.getItem(this.CLAU);
            if (!text) return false;
            const d = this.validar(JSON.parse(text));
            if (!d) return false;
            this.dades = d;
            this.migrar();
            return true;
        } catch (e) {
            console.warn('Partida desada il·legible', e);
            return false;
        }
    },

    esborrar() {
        try { localStorage.removeItem(this.CLAU); } catch (e) { /* res */ }
    },

    // Comprova que l'objecte té la forma esperada i el porta a la versió actual
    validar(d) {
        if (!d || typeof d !== 'object' || typeof d.versio !== 'number') return null;
        const base = this.nova();
        const resultat = Object.assign({}, base, d);
        resultat.corsMax = Math.max(1, Math.min(this.GRANS_MAX, Number(resultat.corsMax) || base.corsMax));      // (partides amb més grans dels que toca)
        resultat.vida = Math.min(resultat.vida, resultat.corsMax * 2);
        resultat.flags = Object.assign({}, d.flags || {});
        resultat.objectes = Array.isArray(d.objectes) ? d.objectes.slice() : base.objectes;
        if (typeof d.vida !== 'number') resultat.vida = (typeof d.cors === 'number' ? d.cors : resultat.corsMax) * 2;
        // El bastó s'aconsegueix al tutorial del Til·ler: les partides antigues no el tenen "de regal"
        if (!resultat.flags.bastoObtingut) resultat.objectes = resultat.objectes.filter(o => o !== 'basto');
        // Si ja se sap el Cant de l'Aurora, la flauta hi ha de ser (alguna versió antiga no la donava)
        if (resultat.flags.cantAurora && !resultat.objectes.includes('flauta')) resultat.objectes.push('flauta');
        // La palanca d'en Georgi ara és una maneta (el volant de l'Home del Raïm)
        resultat.objectes = resultat.objectes.map(o => o === 'palanca' ? 'maneta' : o);
        [['palanca', 'maneta'], ['jordiPalanca', 'jordiManeta'], ['fragment3', 'alcuiLlegit']].forEach(([vell, nou]) => { if (resultat.flags[vell]) { resultat.flags[nou] = resultat.flags[vell]; delete resultat.flags[vell]; } });
        // Migracions futures: if (resultat.versio < 2) { ... }
        resultat.versio = this.VERSIO;
        this.dades = resultat;
        return resultat;
    },

    // ---------- Codi de partida (per canviar de dispositiu) ----------
    exportarCodi() {
        const bytes = new TextEncoder().encode(JSON.stringify(this.dades));
        let binari = '';
        bytes.forEach(b => { binari += String.fromCharCode(b); });
        return this.PREFIX_CODI + btoa(binari);
    },

    importarCodi(codi) {
        try {
            codi = (codi || '').trim();
            if (!codi.startsWith(this.PREFIX_CODI)) return false;
            const binari = atob(codi.slice(this.PREFIX_CODI.length));
            const bytes = Uint8Array.from(binari, c => c.charCodeAt(0));
            const d = this.validar(JSON.parse(new TextDecoder().decode(bytes)));
            if (!d) return false;
            this.desar();
            return true;
        } catch (e) {
            return false;
        }
    }
};
