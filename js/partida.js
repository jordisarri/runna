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
            zona: 'ZonaMonestirRebedor',
            entrada: 'inici',
            x: null,
            y: null,
            vida: 6,          // en meitats de gra del rosari (6 = 3 grans encesos)
            corsMax: 3,
            monedes: 0,
            objectiu: 'Parla amb el Pare Jordi a la Plaça.',
            objectes: [],
            flags: {},
            pingpongVictories: 0
        };
        return this.dades;
    },

    // ---------- Flags i objectes ----------
    flag(nom) { return !!(this.dades && this.dades.flags[nom]); },
    posaFlag(nom, valor = true) { this.dades.flags[nom] = valor; },
    te(objecte) { return this.dades.objectes.includes(objecte); },
    dona(objecte) { if (!this.te(objecte)) { this.dades.objectes.push(objecte); if (typeof Sfx !== 'undefined') Sfx.objecte(); } },
    treu(objecte) { this.dades.objectes = this.dades.objectes.filter(o => o !== objecte); },
    posaObjectiu(text) { this.dades.objectiu = text; },

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

    hiHaPartida() {
        try { return !!localStorage.getItem(this.CLAU); } catch (e) { return false; }
    },

    carregar() {
        try {
            const text = localStorage.getItem(this.CLAU);
            if (!text) return false;
            const d = this.validar(JSON.parse(text));
            if (!d) return false;
            this.dades = d;
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
        resultat.flags = Object.assign({}, d.flags || {});
        resultat.objectes = Array.isArray(d.objectes) ? d.objectes.slice() : base.objectes;
        if (typeof d.vida !== 'number') resultat.vida = (typeof d.cors === 'number' ? d.cors : resultat.corsMax) * 2;
        // El bastó s'aconsegueix al tutorial del Til·ler: les partides antigues no el tenen "de regal"
        if (!resultat.flags.bastoObtingut) resultat.objectes = resultat.objectes.filter(o => o !== 'basto');
        // Si ja se sap el Cant de l'Aurora, la flauta hi ha de ser (alguna versió antiga no la donava)
        if (resultat.flags.cantAurora && !resultat.objectes.includes('flauta')) resultat.objectes.push('flauta');
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
