/**
 * DIARI DE L'INEU: s'obre amb el medalló del sarró (o I; M obre directament el mapa).
 * Quatre pestanyes:
 *   Missió     l'objectiu, el progrés de cada acte, els nens rescatats i els cants apresos (amb les notes)
 *   Encàrrecs  què toca ara (pas principal de js/progres.js) i què t'han demanat (missions laterals obertes)
 *   Sarró      els objectes que portes
 *   Mapa       mapa del Santuari: on ets, on és l'objectiu, encàrrecs i camins per explorar
 * Les dades surten de PROGRES (progres.js), MAPA (mapa.js), MELODIES (musica.js) i CATALEG_OBJECTES (ui.js).
 */

// Títol i zona de cada pas de la història (la zona marca l'estrella de l'objectiu al mapa)
const DIARI_PASSOS = {
    clauer: ['El Pare Jordi et busca', 'ZonaPlaca'], basto: ['El bastó de pelegrí', 'ZonaPlaca'],
    cantAurora: ["El Cant de l'Aurora", 'ZonaEsglesia'], bassadoria: ['La Bassadòria tèrbola', 'ZonaCreu'],
    font: ['La Font del Bisbe', 'ZonaBosc'], jaumeta: ["L'Alzina Buida", 'ZonaBosc'],
    boiraTiller: ['La boira del Til·ler', 'ZonaCelles'], tiller: ['El Gran Til·ler', 'ZonaTiller'],
    branca: ['La branca del Til·ler', 'ZonaTiller'], bardissa: ['Les arrels del Til·ler', 'ZonaTiller'],
    pastor: ['El Pastor de Boira', 'ZonaCirosa'], esquelles: ['Les esquelles', 'ZonaCirosa'],
    soparObert: ['Tornar al Til·ler', 'ZonaTiller'], sopar: ['El sopar del Til·ler', 'ZonaTiller'],
    fragment1: ['El primer fragment', 'ZonaRuines'], clauSagrari: ['La clau del sagrari', 'ZonaCami'], fragment2: ['El sagrari', 'ZonaEsglesia'],
    fragment3: ['Els fragments del Pare Alcuí', 'ZonaBiblioteca'], ombra: ["L'ombra del monjo", 'ZonaRuines'],
    saber: ['Les Paraules del Saber', 'ZonaBiblioteca'], benediccio: ['La benedicció', 'ZonaPlaca'],
    telescopi: ['El telescopi del Garf', 'ZonaEra'], estels: ['Els estels', 'ZonaDipositos'],
    estelLlorenc: ['L\'Estel de Sant Llorenç', 'ZonaDipositos'], runna: ['Runna', 'ZonaDolmen'],
    josep: ['El partit contra en Josep', 'ZonaPingpong'],
    guants: ['Els Guants de Poder', 'ZonaSantAntoni'], roda: ['La roda del Celler', 'ZonaPingpong'],
    cambra: ['La cambra secreta', 'ZonaPassadis'], palanca: ["La palanca d'en Jordi", 'ZonaJordi'],
    raim: ['L\'Home del Raïm', 'ZonaCasaGranInt'], cripta: ['La Cripta', 'ZonaCasaCripta'],
    segell: ['La tomba dels monjos', 'ZonaCementiri'], cantMiracle: ['El Cant del Miracle', 'ZonaEsglesia'],
    soterrani: ['El soterrani de la Taverna', 'ZonaTaverna'], clauCiscu: ['La clau del Siscu', 'ZonaCabanaCami'],
    portaFerro: ['La porta de ferro', 'ZonaSotaTaverna'], girgoles: ['Les gírgoles', 'ZonaGirgoles'],
    rastell: ['El rastell', 'ZonaTortura'], tortura: ['El mur d\'esbarzers', 'ZonaTortura'],
    pont: ['El pont de pedra', 'ZonaGabia'], ocellaire: ["L'Ocellaire", 'ZonaGabia'],
    gabia: ['La gàbia', 'ZonaGabia'], nens: ['Els tres capolls', 'ZonaGabia'], final: ['Torna el cant', 'ZonaEsglesia']
};
const DIARI_LATERALS = {
    taverna: ["L'Eva de la Taverna", 'ZonaTaverna', null],
    rellotge: ['El rellotge aturat', 'ZonaGolfes', '+1 cor'],
    tresor: ['La pedra que escolta', 'ZonaPlaca', '+1 cor'],
    nena: ['Els llaços de la Nena', 'ZonaCamiRov', 'Llaç de la Nena (absorbeix un cop per zona)'],
    monges: ["Les sacerdotesses de l'Hostatgeria", 'ZonaJardi', '+1 cor per cada sacerdotessa i un lloc de repòs']
};
const DIARI_ACTES = [
    { nom: 'Acte 1 · La boira', des: 'clauer' },
    { nom: 'Acte 2 · El Til·ler i el Saber', des: 'font' },
    { nom: 'Acte 3 · La Sala de la Gàbia', des: 'josep' }
];
const DIARI_PESTANYES = [['missio', 'Missió'], ['encarrecs', 'Encàrrecs'], ['sarro', 'Sarró'], ['mapa', 'Mapa']];

const TINTA = '#3a2412', TINTA_SUAU = '#6a4a2a', VERMELL = '#8a2a14';

const DIARI = {
    // ---------------- Obrir i canviar de pestanya ----------------
    obrir(ui, pestanya) {
        ui.inventariObert = true;
        if (ui.inventari) ui.inventari.destroy();
        const c = ui.inventari = ui.add.container(0, 0).setDepth(60);
        c.add(ui.add.rectangle(0, 0, AMPLE, ALT, 0x000000, 0.7).setOrigin(0).setInteractive());
        c.add(marcPergami(ui, AMPLE / 2, ALT / 2, AMPLE - 16, ALT - 16));
        c.add(ui.add.text(AMPLE / 2, 54, "Diari de l'Ineu", { fontFamily: FONT_PLACA, fontSize: '40px', fontStyle: 'bold', color: '#6a1f12', resolution: 2 }).setOrigin(0.5));
        const tanca = ui.add.text(AMPLE - 44, 54, '✕', estilText(36, '#6a1f12', { fontStyle: 'bold' })).setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerdown', () => ui.tancarInventari());
        c.add(tanca);
        // Pestanyes
        this.botons = DIARI_PESTANYES.map(([id, nom], i) => {
            const w = (AMPLE - 80) / 4, x = 40 + w * i + w / 2, y = 120;
            const fons = ui.add.rectangle(x, y, w - 8, 60, 0x8a5a2a, 0.15).setStrokeStyle(2, 0x8a5a2a, 0.6).setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this.mostrar(ui, id));
            const t = ui.add.text(x, y, nom, { fontFamily: FONT_PLACA, fontSize: '27px', fontStyle: 'bold', color: TINTA, resolution: 2 }).setOrigin(0.5);
            // El títol sempre ha de cabre dins la pestanya (la tipografia del joc pot ser més ampla que la del navegador)
            for (let m = 27; t.width > w - 28 && m > 12; m--) t.setFontSize(m);
            c.add([fons, t]);
            return { id, fons, t };
        });
        // Peu, dins del pergamí (el marc fa 44 px): a l'esquerra, la mida de la lletra; a la dreta, la llegenda de les tecles
        const yPeu = this.PEU;
        c.add(ui.add.rectangle(AMPLE / 2, yPeu - 34, AMPLE - 120, 2, 0x8a5a2a, 0.35));
        c.add(ui.add.text(AMPLE - 64, yPeu, '◀ ▶ pestanya · I o ✕ tanca', estilText(19, '#7a5a3a')).setOrigin(1, 0.5));
        // Mida de la lletra: A− / A+ (també es pot pessigar o Ctrl + rodeta)
        this.botonsText = [];
        [['A−', 90, 1 / 1.15], ['A+', 146, 1.15]].forEach(([t, x, f]) => {
            const b = ui.add.circle(x, yPeu, 24, 0x8a5a2a, 0.25).setStrokeStyle(2, 0x6a1f12, 0.8).setInteractive({ useHandCursor: true })
                .on('pointerdown', () => { Sfx.pagina(); this.canviarEscala(ui, this.escala * f); });
            const l = ui.add.text(x, yPeu - 1, t, { fontFamily: FONT_PLACA, fontSize: '24px', fontStyle: 'bold', color: '#6a1f12', resolution: 2 }).setOrigin(0.5);
            c.add([b, l]); this.botonsText.push(b, l);
        });
        this.mostrar(ui, pestanya || this.darrera || 'missio');
    },

    mostrar(ui, id, silenci) {
        if (!ui.inventari) return;
        this.darrera = this.actual = id;
        this.netejar(ui);
        this.enToc = null; this.fitxa = null;
        this.cos = ui.add.container(0, 0);
        ui.inventari.add(this.cos);
        this.botons.forEach(b => {
            const sel = b.id === id;
            b.fons.setFillStyle(sel ? 0x6a1f12 : 0x8a5a2a, sel ? 0.9 : 0.15);
            b.t.setColor(sel ? '#ffe9a8' : TINTA);
        });
        if (this.botonsText) this.botonsText.forEach(o => o.setVisible(id !== 'mapa'));
        if (!silenci) Sfx.pagina();
        if (id === 'mapa') { this.mapa(ui, this.cos); return; }
        // Pestanyes de text: es dibuixen en una amplada «virtual» (AMPLE / escala) i es mostren ampliades, amb scroll
        this.AV = AMPLE / this.escala;
        this.MX = Math.max(26, 74 / this.escala);                       // marge lateral: uns 74 px a la pantalla, perquè la barra d'scroll (a la dreta) no toqui el text
        const cont = ui.add.container(0, 0);
        this[id](ui, cont);
        this.cos.add(cont);
        this.preparaScroll(ui, cont);
    },

    // Atura els batecs del mapa abans de destruir-ne els objectes
    netejar(ui) {
        if (!this.cos) return;
        this.cos.list.forEach(o => ui.tweens.killTweensOf(o));
        if (this.mascara) { this.mascara.destroy(); this.mascara = null; }
        this.cos.destroy(); this.cos = null; this.cont = null;
    },

    moure(ui, d) {
        const i = DIARI_PESTANYES.findIndex(p => p[0] === this.actual);
        this.mostrar(ui, DIARI_PESTANYES[(i + d + 4) % 4][0]);
    },

    // ---------------- Mida de la lletra i scroll ----------------
    escala: (() => { try { const v = parseFloat(localStorage.getItem('runna_diari_escala')); if (v >= 0.9 && v <= 2.2) return v; } catch (e) { /* sense emmagatzematge */ } return 1.25; })(),
    PEU: ALT - 82,                                                    // fila de botons de baix
    PANTALLA: { y0: 162, y1: ALT - 122 },

    // Canvia la mida de la lletra (es torna a distribuir el text perquè s'ajusti a l'amplada) i manté la posició de lectura
    canviarEscala(ui, nova) {
        nova = Math.min(2.2, Math.max(0.9, nova));
        if (!this.cont || Math.abs(nova - this.escala) < 0.01) return;
        this.fraccio = this.maxScroll > 0 ? this.scroll / this.maxScroll : 0;
        this.escala = nova;
        try { localStorage.setItem('runna_diari_escala', String(nova)); } catch (e) { /* res */ }
        this.mostrar(ui, this.actual, true);
    },

    preparaScroll(ui, cont) {
        const s = this.escala, { y0, y1 } = this.PANTALLA, TOP = 170;
        let baix = TOP;
        cont.list.forEach(o => { const h = o.displayHeight; if (Number.isFinite(h) && Number.isFinite(o.y)) baix = Math.max(baix, o.y + h * (1 - (o.originY === undefined ? 0 : o.originY))); });
        this.maxScroll = Math.max(0, (baix - TOP + 40) * s - (y1 - TOP));
        this.scroll = Math.min(this.maxScroll, Math.max(0, (this.fraccio || 0) * this.maxScroll)); this.fraccio = 0;
        // Les lletres es redibuixen amb més resolució quan s'amplien, perquè no es vegin borroses
        cont.list.forEach(o => { if (o.setResolution && o.type === 'Text') o.setResolution(Math.min(4, Math.ceil(2 * s))); });
        this.cont = cont;
        const g = ui.make.graphics({ add: false }); g.fillStyle(0xffffff).fillRect(48, y0, AMPLE - 96, y1 - y0);
        this.mascara = g; cont.setMask(g.createGeometryMask());
        // Barra d'scroll
        const ind = ui.add.rectangle(AMPLE - 44, y0, 6, 40, 0x6a1f12, 0.55).setOrigin(0.5, 0).setVisible(this.maxScroll > 0);
        this.cos.add(ind);
        const aplica = () => {
            this.scroll = Math.min(this.maxScroll, Math.max(0, this.scroll));
            cont.setScale(s).setPosition(0, TOP - TOP * s - this.scroll);
            if (this.maxScroll > 0) {
                const alt = Math.max(40, (y1 - y0) * (y1 - TOP) / ((y1 - TOP) + this.maxScroll));
                ind.setSize(6, alt).setY(y0 + (this.scroll / this.maxScroll) * (y1 - y0 - alt));
            }
        };
        this.aplicaScroll = aplica; aplica();
        // Entrada: arrossegar amb el dit/ratolí, rodeta, pessigar o botons per ampliar
        const zona = ui.add.zone(48, y0, AMPLE - 96, y1 - y0).setOrigin(0).setInteractive();
        this.cos.add(zona);
        let arr = null, d0 = 0;
        zona.on('pointerdown', p => { arr = { y: p.y, sc: this.scroll }; d0 = 0; });
        const mou = p => {
            const p1 = ui.input.pointer1, p2 = ui.input.pointer2;
            if (p1 && p2 && p1.isDown && p2.isDown) {                  // pessigar: ajusta la mida de la lletra
                const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                if (!d0) d0 = d;
                else if (Math.abs(d / d0 - 1) > 0.08) { const r = d / d0; d0 = d; arr = null; this.canviarEscala(ui, this.escala * r); }
                return;
            }
            d0 = 0;
            if (arr && p.isDown) { this.scroll = arr.sc - (p.y - arr.y); aplica(); }
        };
        // Un toc (sense arrossegar) es passa a la pestanya amb les coordenades del contingut
        const solta = p => {
            if (arr && p && Math.abs(p.y - arr.y) < 12 && this.enToc && !this.fitxa) this.enToc((p.x - cont.x) / s, (p.y - cont.y) / s);
            arr = null; d0 = 0;
        };
        const roda = (p, o, dx, dy, dz, ev) => {
            if ((ev && ev.ctrlKey) || (p.event && p.event.ctrlKey)) this.canviarEscala(ui, this.escala * (dy > 0 ? 0.92 : 1.09));
            else { this.scroll += dy; aplica(); }
        };
        if (!ui.input.pointer2) ui.input.addPointer(1);
        ui.input.on('pointermove', mou); ui.input.on('pointerup', solta); ui.input.on('wheel', roda);
        this.cos.once('destroy', () => { ui.input.off('pointermove', mou); ui.input.off('pointerup', solta); ui.input.off('wheel', roda); });
    },

    desplacar(ui, dy) { if (this.cont && this.aplicaScroll) { this.scroll += dy; this.aplicaScroll(); } },

    // ---------------- Ajudes de dibuix ----------------
    titol(ui, c, x, y, text) {
        c.add(ui.add.text(x, y, text, { fontFamily: FONT_PLACA, fontSize: '29px', fontStyle: 'bold', color: VERMELL, resolution: 2 }));
        const g = ui.add.graphics().lineStyle(2, 0x8a5a2a, 0.5).lineBetween(x, y + 40, this.AV - this.MX, y + 40);
        c.add(g);
        return y + 52;
    },
    text(ui, c, x, y, text, mida = 24, color = TINTA, extra = {}) {
        const t = ui.add.text(x, y, text, estilText(mida, color, Object.assign({ wordWrap: { width: this.AV - this.MX - x } }, extra)));
        c.add(t);
        return y + t.height;
    },
    barra(ui, c, x, y, w, fr, color = 0x6a1f12) {
        c.add(ui.add.rectangle(x, y, w, 14, 0x8a5a2a, 0.2).setOrigin(0, 0.5).setStrokeStyle(1.5, 0x8a5a2a, 0.6));
        if (fr > 0) c.add(ui.add.rectangle(x, y, Math.max(4, w * fr), 14, color, 0.85).setOrigin(0, 0.5));
    },
    nomZona(id) { const z = MAPA.zones.find(q => q.id === id); return z ? z.nom : ''; },

    // ---------------- Missió ----------------
    missio(ui, c) {
        const E = Estat, X = this.MX, AV = this.AV;
        const passos = PROGRES.passos, fets = passos.filter(p => p.fet(E)).length;
        const seg = PROGRES.seguent(E);
        const iActe = seg ? DIARI_ACTES.reduce((a, acte, i) => passos.findIndex(p => p.id === acte.des) <= passos.indexOf(seg) ? i : a, 0) : 2;
        let y = 170;
        // L'objectiu, en un requadre
        const obj = E.dades.objectiu || '';
        const tAct = ui.add.text(X + 20, y + 12, seg ? DIARI_ACTES[iActe].nom.toUpperCase() : 'HISTÒRIA ACABADA', estilText(20, VERMELL, { fontStyle: 'bold', wordWrap: { width: AV - 2 * X - 40 } }));
        const tObj = ui.add.text(X + 20, y + 22 + tAct.height, obj, estilText(27, TINTA, { fontStyle: 'italic', wordWrap: { width: AV - 2 * X - 40 } }));
        const h = tAct.height + tObj.height + 44;
        c.add(ui.add.rectangle(X, y, AV - 2 * X, h, 0xffffff, 0.25).setOrigin(0).setStrokeStyle(2, 0x6a1f12, 0.7));
        c.add(tAct); c.add(tObj);
        y += h + 20;
        // Progrés per actes
        y = this.titol(ui, c, X, y, 'Progrés');
        DIARI_ACTES.forEach((a, i) => {
            const ini = passos.findIndex(p => p.id === a.des), fi = i < 2 ? passos.findIndex(p => p.id === DIARI_ACTES[i + 1].des) : passos.length;
            const tram = passos.slice(ini, fi), f = tram.filter(p => p.fet(E)).length;
            const t = ui.add.text(X, y, a.nom, estilText(23, i === iActe ? TINTA : TINTA_SUAU, { fontStyle: i === iActe ? 'bold' : 'normal', wordWrap: { width: AV - 2 * X - 80 } }));
            c.add(t);
            c.add(ui.add.text(AV - X, y, f === tram.length ? '✓' : f + '/' + tram.length, estilText(23, TINTA_SUAU)).setOrigin(1, 0));
            this.barra(ui, c, X, y + t.height + 14, AV - 2 * X, f / tram.length, f === tram.length ? 0x3a7a3a : 0x6a1f12);
            y += t.height + 36;
        });
        c.add(ui.add.text(AV - X, y - 6, 'Total: ' + Math.round(fets / passos.length * 100) + '%', estilText(20, TINTA_SUAU, { fontStyle: 'italic' })).setOrigin(1, 0));
        y += 34;
        // Nens rescatats
        y = this.titol(ui, c, X, y, 'Els nens');
        const colNens = AV >= 520, ampleNen = (AV - 2 * X - 20) / 3;
        [['Huri', 'rescatUri'], ['Flami', 'rescatFlam'], ['Sardi', 'rescatSardin']].forEach(([n, f], i) => {
            const ok = E.flag(f), x = colNens ? X + 20 + i * ampleNen : X + 20, yy = colNens ? y : y + i * 48;
            c.add(ui.add.circle(x + 18, yy + 20, 18, ok ? 0x3a7a3a : 0x8a5a2a, ok ? 0.9 : 0.25).setStrokeStyle(2, 0x3a2412, 0.6));
            c.add(ui.add.text(x + 18, yy + 20, ok ? '✓' : '?', estilText(23, ok ? '#ffffff' : TINTA_SUAU, { fontStyle: 'bold' })).setOrigin(0.5));
            c.add(ui.add.text(x + 46, yy + 4, n, estilText(26, ok ? TINTA : TINTA_SUAU, { fontStyle: ok ? 'bold' : 'normal' })));
        });
        y += colNens ? 62 : 3 * 48 + 14;
        // Cants apresos, amb les notes per tocar-los
        y = this.titol(ui, c, X, y, 'Cants de la flauta');
        Object.values(MELODIES).forEach(m => {
            const sap = E.flag(m.flag), nn = sap ? m.notes.length : 0;
            const junt = AV - 2 * X - nn * 46 > 270;                     // si no hi caben, les notes baixen a sota del nom
            const t = ui.add.text(X, y + 4, sap ? m.nom : '— encara no el saps —', estilText(23, sap ? TINTA : TINTA_SUAU, { fontStyle: sap ? 'bold' : 'italic', wordWrap: { width: junt ? AV - 2 * X - nn * 46 - 6 : AV - 2 * X } }));
            c.add(t);
            const yn = junt ? y + 20 : y + t.height + 26;
            if (sap) m.notes.forEach((n, k) => {
                const x = junt ? AV - X - (m.notes.length - k) * 46 + 16 : X + 18 + k * 46;
                c.add(ui.add.circle(x, yn, 18, COLORS_NOTA[n], 1).setStrokeStyle(2, 0x2a1808, 0.8));
                c.add(ui.add.text(x, yn, String(n), estilText(22, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5));
            });
            y += Math.max(52, junt ? t.height + 14 : t.height + (sap ? 62 : 14));
        });
        y += 8;
        y = this.titol(ui, c, X, y, 'L\'Ineu');
        const d = E.dades;
        this.text(ui, c, X, y, `Grans del rosari: ${d.corsMax}\nBestioles calmades: ${d.flags.derrotats || 0}\nLlocs trobats: ${MAPA.zones.filter(z => MAPA.visitada(z.id)).length}/${MAPA.zones.length}`, 23, TINTA_SUAU, { lineSpacing: 6 });
    },

    // ---------------- Encàrrecs ----------------
    encarrecs(ui, c) {
        const E = Estat, X = this.MX;
        let y = 170;
        const seg = PROGRES.seguent(E);
        y = this.titol(ui, c, X, y, 'Ara toca');
        if (seg) {
            const [nom, zona] = DIARI_PASSOS[seg.id] || [seg.id, null];
            y = this.text(ui, c, X, y, '★ ' + nom, 27, VERMELL, { fontStyle: 'bold' });
            if (zona) y = this.text(ui, c, X + 26, y + 2, this.nomZona(zona), 20, TINTA_SUAU, { fontStyle: 'italic' });
            y = this.text(ui, c, X + 26, y + 8, seg.pista(E), 22, TINTA) + 26;
        } else y = this.text(ui, c, X, y, 'Ja ho has fet tot. Els nens tornen a riure.', 24, TINTA, { fontStyle: 'italic' }) + 26;

        y = this.titol(ui, c, X, y, 'Et van demanar...');
        const oberts = PROGRES.laterals.filter(l => l.obert(E) && !l.fet(E));
        const fets = PROGRES.laterals.filter(l => l.fet(E));
        if (!oberts.length) y = this.text(ui, c, X, y, fets.length ? 'No tens cap encàrrec pendent.' : 'Encara ningú no t\'ha demanat res. Parla amb la gent!', 22, TINTA_SUAU, { fontStyle: 'italic' }) + 20;
        oberts.forEach(l => {
            const [nom, zona, premi] = DIARI_LATERALS[l.id] || [l.id, null];
            y = this.text(ui, c, X, y, '! ' + nom, 25, '#2a4a7a', { fontStyle: 'bold' });
            if (zona) y = this.text(ui, c, X + 26, y + 2, this.nomZona(zona), 19, TINTA_SUAU, { fontStyle: 'italic' });
            y = this.text(ui, c, X + 26, y + 6, l.pista(E), 21, TINTA);
            if (premi) y = this.text(ui, c, X + 26, y + 4, 'Premi: ' + premi, 19, '#3a7a3a', { fontStyle: 'italic' });
            y += 22;
        });
        if (fets.length) {
            y += 6;
            y = this.titol(ui, c, X, y, 'Fets');
            fets.forEach(l => { y = this.text(ui, c, X, y, '✓ ' + (DIARI_LATERALS[l.id] || [l.id])[0], 22, '#3a7a3a') + 8; });
        }
    },

    // ---------------- Sarró ----------------
    // Una quadrícula d'icones amb el nom; tocar-ne una obre la fitxa (descripció i si encara farà falta)
    sarro(ui, c) {
        const llista = Estat.dades.objectes.filter(o => CATALEG_OBJECTES[o]);
        const AV = this.AV, X = this.MX, top = 170;
        if (!llista.length) { c.add(ui.add.text(AV / 2, 400, 'El sarró és buit.', estilText(30, TINTA_SUAU, { fontStyle: 'italic' })).setOrigin(0.5)); return; }
        c.add(ui.add.text(X, top, 'Toca un objecte per saber-ne més.', estilText(20, TINTA_SUAU, { fontStyle: 'italic', wordWrap: { width: AV - 2 * X } })));
        const cols = AV >= 520 ? 3 : 2, G = 12, W = (AV - 2 * X - G * (cols - 1)) / cols, IC = Math.min(96, W - 28);
        const caixes = [];
        let y = top + 40;
        for (let i = 0; i < llista.length; i += cols) {
            const fila = llista.slice(i, i + cols).map((o, k) => {
                const x = X + k * (W + G);
                const tn = ui.add.text(x + W / 2, y + IC + 22, CATALEG_OBJECTES[o][0], estilText(20, TINTA, { fontStyle: 'bold', align: 'center', wordWrap: { width: W - 12 } })).setOrigin(0.5, 0);
                return { o, x, tn, h: IC + 30 + tn.height };
            });
            const h = Math.max(...fila.map(f => f.h));
            fila.forEach(({ o, x, tn }) => {
                const us = usObjecte(Estat, o);
                c.add(ui.add.rectangle(x, y, W, h, 0xffffff, us === 'record' ? 0.1 : 0.25).setOrigin(0).setStrokeStyle(1.5, 0x8a5a2a, 0.5));
                const clau = iconaObjecte(ui, o);
                if (clau) c.add(ui.add.image(x + W / 2, y + 12 + IC / 2, clau).setDisplaySize(IC, IC).setAlpha(us === 'record' ? 0.6 : 1));
                if (us !== 'sempre') c.add(ui.add.text(x + W - 8, y + 6, us === 'cal' ? '★' : '✓', estilText(22, US_TEXTOS[us][1], { fontStyle: 'bold' })).setOrigin(1, 0));
                c.add(tn);
                caixes.push({ o, x, y, w: W, h });
            });
            y += h + G;
        }
        this.enToc = (cx, cy) => {
            const t = caixes.find(b => cx >= b.x && cx <= b.x + b.w && cy >= b.y && cy <= b.y + b.h);
            if (t) { Sfx.pagina(); this.fitxaObjecte(ui, t.o); }
        };
    },

    // Fitxa d'un objecte, damunt del sarró: icona gran, nom, descripció i si encara farà falta. Es tanca tocant-la.
    fitxaObjecte(ui, o) {
        if (this.fitxa) this.fitxa.destroy();
        const [nom, desc] = CATALEG_OBJECTES[o], [txtUs, colUs] = US_TEXTOS[usObjecte(Estat, o)];
        const W = AMPLE - 140, x0 = (AMPLE - W) / 2, f = this.fitxa = ui.add.container(0, 0);
        const tn = ui.add.text(AMPLE / 2, 0, nom, { fontFamily: FONT_PLACA, fontSize: '34px', fontStyle: 'bold', color: VERMELL, align: 'center', wordWrap: { width: W - 48 }, resolution: 2 }).setOrigin(0.5, 0);
        const td = ui.add.text(AMPLE / 2, 0, desc, estilText(25, TINTA, { fontStyle: 'italic', align: 'center', wordWrap: { width: W - 48 } })).setOrigin(0.5, 0);
        const tu = ui.add.text(AMPLE / 2, 0, txtUs, estilText(24, colUs, { fontStyle: 'bold', align: 'center', wordWrap: { width: W - 48 } })).setOrigin(0.5, 0);
        const tt = ui.add.text(AMPLE / 2, 0, '(toca per tancar)', estilText(18, TINTA_SUAU, { fontStyle: 'italic' })).setOrigin(0.5, 0);
        const h = 24 + 150 + 16 + tn.height + 14 + td.height + 22 + tu.height + 22 + tt.height + 22, y0 = (this.PANTALLA.y0 + this.PANTALLA.y1 - h) / 2;
        f.add(ui.add.rectangle(0, 0, AMPLE, ALT, 0x000000, 0.45).setOrigin(0).setInteractive().on('pointerdown', () => { f.destroy(); this.fitxa = null; Sfx.pagina(); }));
        f.add(ui.add.rectangle(x0, y0, W, h, 0xf4e6c4, 1).setOrigin(0).setStrokeStyle(4, 0x6a1f12, 0.9));
        f.add(ui.add.rectangle(x0 + 8, y0 + 8, W - 16, h - 16, 0, 0).setOrigin(0).setStrokeStyle(1.5, 0x8a5a2a, 0.6));
        let y = y0 + 24;
        const clau = iconaObjecte(ui, o);
        if (clau) f.add(ui.add.image(AMPLE / 2, y + 75, clau).setDisplaySize(150, 150));
        y += 166;
        [[tn, 14], [td, 22], [tu, 22], [tt, 0]].forEach(([t, d]) => { t.setY(y); f.add(t); y += t.height + d; });
        this.cos.add(f);
        f.once('destroy', () => { if (this.fitxa === f) this.fitxa = null; });
    },

    // ---------------- Mapa ----------------
    mapa(ui, c) {
        const zona = Joc.zonaActiva(ui);
        MAPA.dibuixar(ui, c, zona ? zona.scene.key : null, 170, this.PANTALLA.y1 + 4);
    }
};
