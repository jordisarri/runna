/**
 * IDIOMES: el joc s'escriu en català i es tradueix en el moment de posar el text a la pantalla.
 *
 * Totes les frases del joc passen per un objecte Text de Phaser (diàlegs, avisos, menús, cartells...). Aquí s'intercepta Text.setText (i, per tant,
 * també scene.add.text): si l'idioma triat no és el català i el text català és a la taula de l'idioma, es mostra la traducció.
 *   - Les taules són a js/textos/<idioma>.js (TRADUCCIONS.es = { 'text en català': 'traducció', ... }). NO s'editen a mà: es generen amb
 *     python3 eines/fer_traduccions.py a partir de docs/traduccions/<idioma>.json (traduccions per NÚMERO de docs/TEXTS.md + textos de la interfície).
 *   - Els textos que es construeixen sumant trossos («Has obtingut » + nom) van a la taula amb {0}, {1}... (vegeu PATRONS).
 *   - Els textos que no tenen traducció es veuen en català i es recullen a Idioma.pendents (a la consola: Idioma.mostraPendents()).
 * L'idioma es tria al menú del títol (es desa al navegador i canvia a l'instant) o amb ?idioma=es a l'adreça.
 */
const TRADUCCIONS = {};

const Idioma = {
    IDIOMES: [['ca', 'Català'], ['es', 'Castellano'], ['fr', 'Français'], ['en', 'English']],
    codi: 'ca',
    literal: false,             // true mentre es posen trossos d'un text ja traduït (les paraules del pròleg): no es tornen a traduir
    pendents: new Set(),
    _patrons: null,

    iniciar() {
        let c = null;
        try { c = new URLSearchParams(location.search).get('idioma'); } catch (e) { /* res */ }
        if (!c) { try { c = localStorage.getItem('runnaIdioma'); } catch (e) { /* sense emmagatzematge */ } }
        if (this.IDIOMES.some(([k]) => k === c)) this.codi = c;
        document.documentElement.lang = this.codi;
    },

    nom(codi = this.codi) { return (this.IDIOMES.find(([k]) => k === codi) || [codi, codi])[1]; },

    // Canvia d'idioma a l'instant, sense tornar a carregar: cada text de Phaser recorda el seu original en català (_textCa) i els que hi ha a la pantalla
    // es tornen a traduir. (Els textos que s'escriuen lletra a lletra o paraula a paraula —diàlegs, pròleg— no ho recorden: el canvi es fa al títol.)
    canvia(codi) {
        if (!this.IDIOMES.some(([k]) => k === codi)) return;
        try { localStorage.setItem('runnaIdioma', codi); } catch (e) { /* res */ }
        this.codi = codi;
        this._patrons = null;
        this.pendents.clear();
        document.documentElement.lang = codi;
        if (typeof game === 'undefined') return;
        const recorre = llista => llista.forEach(o => {
            if (o instanceof Phaser.GameObjects.Text) { if (o._textCa !== undefined && !o.senseTraduir) o.setText(o._textCa); }
            else if (o.list) recorre(o.list);
        });
        game.scene.getScenes(true).forEach(s => recorre(s.children.list));
    },

    seguent() {
        const i = this.IDIOMES.findIndex(([k]) => k === this.codi);
        return this.IDIOMES[(i + 1) % this.IDIOMES.length][0];
    },

    taula() { return TRADUCCIONS[this.codi] || {}; },

    // Patrons de la taula (claus amb {0}, {1}...) convertits en expressions regulars, un sol cop
    patrons() {
        if (this._patrons) return this._patrons;
        const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        this._patrons = Object.entries(this.taula()).filter(([k]) => /\{\d\}/.test(k)).map(([k, v]) => {
            const parts = k.split(/\{(\d)\}/), ordre = [];
            let re = '^';
            parts.forEach((p, i) => { if (i % 2) { ordre.push(+p); re += '([\\s\\S]*?)'; } else re += esc(p); });
            return { re: new RegExp(re + '$'), ordre, v, fix: k.replace(/\{\d\}/g, '').length };
        });
        this._patrons.sort((a, b) => b.fix - a.fix);          // els més concrets (més text fix) primer: «Escolta: {0}» abans que «{0}\nRecorda...»
        return this._patrons;
    },

    // Tradueix un text (si no en té traducció, el torna igual). Els trossos variables d'un patró també es tradueixen (noms d'objectes...).
    t(text) {
        if (this.codi === 'ca' || typeof text !== 'string' || !/[A-Za-zÀ-ÿ]/.test(text)) return text;
        const T = this.taula();
        if (Object.prototype.hasOwnProperty.call(T, text)) return T[text];
        // Decoracions dels menús: «✦ Nova partida ✦», «▸ Sí»
        const m = text.match(/^(\s*[✦▸•★→←↑↓]+\s*)?([\s\S]*?)(\s*[✦]+\s*)?$/);
        if (m && (m[1] || m[3]) && Object.prototype.hasOwnProperty.call(T, m[2])) return (m[1] || '') + T[m[2]] + (m[3] || '');
        // Els avisos «★ Has obtingut...» també surten sense l'estrella (objectiu, missatges)
        if (Object.prototype.hasOwnProperty.call(T, '★ ' + text)) return T['★ ' + text].replace(/^★\s*/, '');
        for (const p of this.patrons()) {
            const r = text.match(p.re);
            if (r) return p.v.replace(/\{(\d)\}/g, (_, n) => this.tros(r[1 + p.ordre.indexOf(+n)] || ''));
        }
        if (!this.IDIOMES.some(([, n]) => n === text)) this.pendents.add(text);          // (els noms dels idiomes no es tradueixen)
        return text;
    },

    // Un tros variable d'un patró: sencer (o per un altre patró) si té traducció; si no, una llista «a, b i c» element per element,
    // però només si TOTS els elements en tenen (una frase qualsevol amb una «i» no s'ha de partir)
    I_LLISTA: { es: ' y ', fr: ' et ', en: ' and ' },
    tros(s) {
        if (!s || this.codi === 'ca') return s;
        const sencer = this.t(s);
        if (sencer !== s || !/, | i /.test(s)) return sencer;
        const T = this.taula(), te = x => Object.prototype.hasOwnProperty.call(T, x);
        const i = s.lastIndexOf(' i ');
        const parts = (i > 0 ? s.slice(0, i) : s).split(', '), darrer = i > 0 ? s.slice(i + 3) : null;
        if (!parts.every(te) || (darrer !== null && !te(darrer))) return s;
        return parts.map(x => T[x]).join(', ') + (darrer !== null ? (this.I_LLISTA[this.codi] || ' i ') + T[darrer] : '');
    },

    // Les dotze paraules de les columnes del camí de la Desaparició: en cada idioma, la frase de l'altar (texts 347 i 350) partida en dotze trossos
    PARAULES_MISSATGE: {
        es: ['Cuando', 'la', 'niebla', 'cubra', 'el', 'Miracle,', 'los', 'pasos', 'de los', 'ausentes', 'volverán', 'con el alba.'],
        fr: ['Quand', 'la', 'brume', 'couvrira', 'le', 'Miracle,', 'les', 'pas', 'des', 'absents', 'reviendront', "avec l'aube."],
        en: ['When', 'the', 'mist', 'covers', 'the', 'Miracle,', 'the', 'footsteps', 'of the', 'absent', 'will return', 'with the dawn.']
    },
    paraulesMissatge(ca) { return this.PARAULES_MISSATGE[this.codi] || ca; },

    mostraPendents() { const l = [...this.pendents]; console.log(l.join('\n')); return l.length; }
};
Idioma.iniciar();

// Tots els textos de Phaser passen per aquí (també els creats amb scene.add.text, que crida setText)
if (typeof Phaser !== 'undefined') {
    const setTextOriginal = Phaser.GameObjects.Text.prototype.setText;
    Phaser.GameObjects.Text.prototype.setText = function (valor) {
        if (!this.senseTraduir && !Idioma.literal) this._textCa = valor;        // l'original, per tornar-lo a traduir si es canvia d'idioma
        if (Idioma.codi !== 'ca' && !this.senseTraduir && !Idioma.literal) {
            if (typeof valor === 'string') valor = Idioma.t(valor);
            else if (Array.isArray(valor)) valor = valor.map(v => Idioma.t(v));
        }
        return setTextOriginal.call(this, valor);
    };
}
