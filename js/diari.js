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
    clauer: ['El clauer del novici', 'ZonaPlaca'], basto: ['El bastó de pelegrí', 'ZonaPlaca'],
    cantAurora: ["El Cant de l'Aurora", 'ZonaEsglesia'], bassadoria: ['La Bassadòria tèrbola', 'ZonaCreu'],
    font: ['La Font del Bisbe', 'ZonaBosc'], jaumeta: ["L'Alzina Buida", 'ZonaBosc'],
    boiraTiller: ['La boira del Til·ler', 'ZonaCelles'], tiller: ['El Gran Til·ler', 'ZonaTiller'],
    branca: ['La branca del Til·ler', 'ZonaTiller'], bardissa: ['La bardissa viva', 'ZonaTiller'],
    pastor: ['El Pastor de Boira', 'ZonaCirosa'], esquelles: ['Les esquelles', 'ZonaCirosa'],
    soparObert: ['Tornar al Til·ler', 'ZonaTiller'], sopar: ['El sopar del Til·ler', 'ZonaTiller'],
    fragment1: ['El primer fragment', 'ZonaRuines'], fragment2: ['El sagrari', 'ZonaEsglesia'],
    fragment3: ['Els fragments del Pare Alcuí', 'ZonaBiblioteca'], ombra: ["L'ombra del monjo", 'ZonaRuines'],
    saber: ['Les Paraules del Saber', 'ZonaBiblioteca'], benediccio: ['La benedicció', 'ZonaPlaca'],
    telescopi: ['El telescopi del Garf', 'ZonaEra'], estels: ['Els estels', 'ZonaDipositos'],
    estelLlorenc: ['L\'Estel de Sant Llorenç', 'ZonaDipositos'], runna: ['Runna', 'ZonaDolmen'],
    josep: ['El partit contra en Josep', 'ZonaPingpong'], frederic: ['El secret del Frederic', 'ZonaPingpong'],
    guants: ['Els Guants de Poder', 'ZonaSantAntoni'], roda: ['La roda del Celler', 'ZonaPingpong'],
    cambra: ['La cambra secreta', 'ZonaPassadis'], palanca: ["La palanca d'en Jordi", 'ZonaJordi'],
    raim: ['L\'Home del Raïm', 'ZonaCasaGranInt'], cripta: ['La Cripta', 'ZonaCasaCripta'],
    reliquies: ['La tomba dels monjos', 'ZonaCementiri'], cantMiracle: ['El Cant del Miracle', 'ZonaEsglesia'],
    soterrani: ['El soterrani de la Taverna', 'ZonaTaverna'], clauCiscu: ['La clau del Ciscu', 'ZonaCabanaCami'],
    portaFerro: ['La porta de ferro', 'ZonaSotaTaverna'], girgoles: ['Les gírgoles', 'ZonaGirgoles'],
    rastell: ['El rastell', 'ZonaTortura'], tortura: ['El mur d\'esbarzers', 'ZonaTortura'],
    pont: ['El pont de pedra', 'ZonaGabia'], ocellaire: ["L'Ocellaire", 'ZonaGabia'],
    gabia: ['La gàbia', 'ZonaGabia'], nens: ['Els tres capolls', 'ZonaGabia'], final: ['Torna el cant', 'ZonaEsglesia']
};
const DIARI_LATERALS = {
    taverna: ["L'Eva de la Taverna", 'ZonaTaverna', '2 infusions'],
    rellotge: ['El rellotge aturat', 'ZonaGolfes', "3 infusions, i una infusió més a l'altar cada cop que hi reposis"],
    tresor: ['La pedra que escolta', 'ZonaPlaca', 'Escapulari del sant (més temps sense poder-te ferir)'],
    nena: ['Els llaços de la Nena', 'ZonaCamiRov', 'Cinta de la Nena i 1 infusió'],
    llanterna: ['Les dotze columnes', 'ZonaCami', 'Llanterna i 2 infusions'],
    monges: ["Les monges de l'Hostatgeria", 'ZonaJardi', '+1 cor per cada monja i un lloc de repòs']
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
            const fons = ui.add.rectangle(x, y, w - 8, 52, 0x8a5a2a, 0.15).setStrokeStyle(2, 0x8a5a2a, 0.6).setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this.mostrar(ui, id));
            const t = ui.add.text(x, y, nom, { fontFamily: FONT_PLACA, fontSize: '22px', fontStyle: 'bold', color: TINTA, resolution: 2 }).setOrigin(0.5);
            c.add([fons, t]);
            return { id, fons, t };
        });
        c.add(ui.add.text(AMPLE / 2, ALT - 40, '◀ ▶ canvia de pestanya · I o ✕ per tancar', estilText(15, '#7a5a3a')).setOrigin(0.5));
        this.mostrar(ui, pestanya || this.darrera || 'missio');
    },

    mostrar(ui, id) {
        if (!ui.inventari) return;
        this.darrera = this.actual = id;
        this.netejar(ui);
        this.cos = ui.add.container(0, 0);
        ui.inventari.add(this.cos);
        this.botons.forEach(b => {
            const sel = b.id === id;
            b.fons.setFillStyle(sel ? 0x6a1f12 : 0x8a5a2a, sel ? 0.9 : 0.15);
            b.t.setColor(sel ? '#ffe9a8' : TINTA);
        });
        Sfx.pagina();
        this[id](ui, this.cos);
    },

    // Atura els batecs del mapa abans de destruir-ne els objectes
    netejar(ui) {
        if (!this.cos) return;
        this.cos.list.forEach(o => ui.tweens.killTweensOf(o));
        this.cos.destroy(); this.cos = null;
    },

    moure(ui, d) {
        const i = DIARI_PESTANYES.findIndex(p => p[0] === this.actual);
        this.mostrar(ui, DIARI_PESTANYES[(i + d + 4) % 4][0]);
    },

    // ---------------- Ajudes de dibuix ----------------
    titol(ui, c, x, y, text) {
        c.add(ui.add.text(x, y, text, { fontFamily: FONT_PLACA, fontSize: '22px', fontStyle: 'bold', color: VERMELL, resolution: 2 }));
        const g = ui.add.graphics().lineStyle(2, 0x8a5a2a, 0.5).lineBetween(x, y + 32, AMPLE - 60, y + 32);
        c.add(g);
        return y + 44;
    },
    text(ui, c, x, y, text, mida = 19, color = TINTA, extra = {}) {
        const t = ui.add.text(x, y, text, estilText(mida, color, Object.assign({ wordWrap: { width: AMPLE - 60 - x } }, extra)));
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
        const E = Estat, X = 50;
        const passos = PROGRES.passos, fets = passos.filter(p => p.fet(E)).length;
        const seg = PROGRES.seguent(E);
        const iActe = seg ? DIARI_ACTES.reduce((a, acte, i) => passos.findIndex(p => p.id === acte.des) <= passos.indexOf(seg) ? i : a, 0) : 2;
        let y = 170;
        // L'objectiu, en un requadre
        const obj = E.dades.objectiu || '';
        const tObj = ui.add.text(X + 20, y + 44, obj, estilText(22, TINTA, { fontStyle: 'italic', wordWrap: { width: AMPLE - 2 * X - 40 } }));
        const h = tObj.height + 64;
        c.add(ui.add.rectangle(X, y, AMPLE - 2 * X, h, 0xffffff, 0.25).setOrigin(0).setStrokeStyle(2, 0x6a1f12, 0.7));
        c.add(ui.add.text(X + 20, y + 12, seg ? DIARI_ACTES[iActe].nom.toUpperCase() : 'HISTÒRIA ACABADA', estilText(16, VERMELL, { fontStyle: 'bold' })));
        c.add(tObj);
        y += h + 26;
        // Progrés per actes
        y = this.titol(ui, c, X, y, 'Progrés');
        DIARI_ACTES.forEach((a, i) => {
            const ini = passos.findIndex(p => p.id === a.des), fi = i < 2 ? passos.findIndex(p => p.id === DIARI_ACTES[i + 1].des) : passos.length;
            const tram = passos.slice(ini, fi), f = tram.filter(p => p.fet(E)).length;
            c.add(ui.add.text(X, y, a.nom, estilText(18, i === iActe ? TINTA : TINTA_SUAU, { fontStyle: i === iActe ? 'bold' : 'normal' })));
            c.add(ui.add.text(AMPLE - X, y, f === tram.length ? '✓' : f + '/' + tram.length, estilText(18, TINTA_SUAU)).setOrigin(1, 0));
            this.barra(ui, c, X, y + 34, AMPLE - 2 * X, f / tram.length, f === tram.length ? 0x3a7a3a : 0x6a1f12);
            y += 54;
        });
        c.add(ui.add.text(AMPLE - X, y - 6, 'Total: ' + Math.round(fets / passos.length * 100) + '%', estilText(16, TINTA_SUAU, { fontStyle: 'italic' })).setOrigin(1, 0));
        y += 26;
        // Nens rescatats
        y = this.titol(ui, c, X, y, 'Els nens');
        [['Uri', 'rescatUri'], ['Flam', 'rescatFlam'], ['Sardin', 'rescatSardin']].forEach(([n, f], i) => {
            const ok = E.flag(f), x = X + 20 + i * 205;
            c.add(ui.add.circle(x + 14, y + 16, 14, ok ? 0x3a7a3a : 0x8a5a2a, ok ? 0.9 : 0.25).setStrokeStyle(2, 0x3a2412, 0.6));
            c.add(ui.add.text(x + 14, y + 16, ok ? '✓' : '?', estilText(18, ok ? '#ffffff' : TINTA_SUAU, { fontStyle: 'bold' })).setOrigin(0.5));
            c.add(ui.add.text(x + 38, y + 4, n, estilText(20, ok ? TINTA : TINTA_SUAU, { fontStyle: ok ? 'bold' : 'normal' })));
        });
        y += 56;
        // Cants apresos, amb les notes per tocar-los
        y = this.titol(ui, c, X, y, 'Cants de la flauta');
        Object.values(MELODIES).forEach(m => {
            const sap = E.flag(m.flag);
            c.add(ui.add.text(X, y + 4, sap ? m.nom : '— encara no el saps —', estilText(19, sap ? TINTA : TINTA_SUAU, { fontStyle: sap ? 'bold' : 'italic' })));
            if (sap) m.notes.forEach((n, k) => {
                const x = AMPLE - X - (m.notes.length - k) * 40 + 14;
                c.add(ui.add.circle(x, y + 16, 15, COLORS_NOTA[n], 1).setStrokeStyle(2, 0x2a1808, 0.8));
                c.add(ui.add.text(x, y + 16, String(n), estilText(17, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5));
            });
            y += 44;
        });
        y += 10;
        y = this.titol(ui, c, X, y, 'L\'Ineu');
        const d = E.dades;
        this.text(ui, c, X, y, `Grans del rosari: ${d.corsMax}   ·   Bestioles calmades: ${d.flags.derrotats || 0}   ·   Llocs trobats: ${MAPA.zones.filter(z => MAPA.visitada(z.id)).length}/${MAPA.zones.length}`, 17, TINTA_SUAU);
    },

    // ---------------- Encàrrecs ----------------
    encarrecs(ui, c) {
        const E = Estat, X = 50;
        let y = 170;
        const seg = PROGRES.seguent(E);
        y = this.titol(ui, c, X, y, 'Ara toca');
        if (seg) {
            const [nom, zona] = DIARI_PASSOS[seg.id] || [seg.id, null];
            c.add(ui.add.text(X, y, '★ ' + nom, estilText(22, VERMELL, { fontStyle: 'bold' })));
            if (zona) c.add(ui.add.text(AMPLE - X, y + 4, this.nomZona(zona), estilText(16, TINTA_SUAU, { fontStyle: 'italic' })).setOrigin(1, 0));
            y = this.text(ui, c, X + 26, y + 34, seg.pista(E), 18, TINTA) + 30;
        } else y = this.text(ui, c, X, y, 'Ja ho has fet tot. Els nens tornen a riure.', 19, TINTA, { fontStyle: 'italic' }) + 30;

        y = this.titol(ui, c, X, y, 'Et van demanar...');
        const oberts = PROGRES.laterals.filter(l => l.obert(E) && !l.fet(E));
        const fets = PROGRES.laterals.filter(l => l.fet(E));
        if (!oberts.length) y = this.text(ui, c, X, y, fets.length ? 'No tens cap encàrrec pendent.' : 'Encara ningú no t\'ha demanat res. Parla amb la gent!', 18, TINTA_SUAU, { fontStyle: 'italic' }) + 20;
        oberts.forEach(l => {
            const [nom, zona, premi] = DIARI_LATERALS[l.id] || [l.id, null];
            c.add(ui.add.text(X, y, '! ' + nom, estilText(20, '#2a4a7a', { fontStyle: 'bold' })));
            if (zona) c.add(ui.add.text(AMPLE - X, y + 3, this.nomZona(zona), estilText(15, TINTA_SUAU, { fontStyle: 'italic' })).setOrigin(1, 0));
            y = this.text(ui, c, X + 26, y + 30, l.pista(E), 17, TINTA);
            if (premi) y = this.text(ui, c, X + 26, y + 3, 'Premi: ' + premi, 15, '#3a7a3a', { fontStyle: 'italic' });
            y += 20;
        });
        if (fets.length) {
            y += 6;
            y = this.titol(ui, c, X, y, 'Fets');
            fets.forEach(l => { c.add(ui.add.text(X, y, '✓ ' + (DIARI_LATERALS[l.id] || [l.id])[0], estilText(18, '#3a7a3a'))); y += 32; });
        }
    },

    // ---------------- Sarró ----------------
    sarro(ui, c) {
        const llista = Estat.dades.objectes.filter(o => CATALEG_OBJECTES[o]);
        const inf = Estat.dades.infusions || 0;
        if (inf) c.add(ui.add.text(AMPLE / 2, 168, `Infusions: ${inf}  ·  tecla H (o el flascó de la pantalla) per beure'n una i recuperar 2 grans`, estilText(16, '#3a7a3a', { fontStyle: 'bold', align: 'center', wordWrap: { width: AMPLE - 80 } })).setOrigin(0.5, 0));
        const X = 44, W = (AMPLE - 2 * X - 16) / 2, top = inf ? 214 : 170;
        if (!llista.length) { c.add(ui.add.text(AMPLE / 2, ALT / 2, 'El sarró és buit.', estilText(24, TINTA_SUAU, { fontStyle: 'italic' })).setOrigin(0.5)); return; }
        const files = Math.ceil(llista.length / 2), hFila = Math.min(96, (ALT - 110 - top) / files);
        llista.forEach((o, i) => {
            const [nom, desc] = CATALEG_OBJECTES[o];
            const x = X + (i % 2) * (W + 16), y = top + Math.floor(i / 2) * hFila;
            c.add(ui.add.rectangle(x, y, W, hFila - 8, 0xffffff, 0.22).setOrigin(0).setStrokeStyle(1.5, 0x8a5a2a, 0.5));
            c.add(ui.add.text(x + 12, y + 8, nom, estilText(hFila > 70 ? 19 : 17, TINTA, { fontStyle: 'bold', wordWrap: { width: W - 24 } })));
            if (hFila > 60) c.add(ui.add.text(x + 12, y + (hFila > 70 ? 36 : 30), desc, estilText(14, TINTA_SUAU, { fontStyle: 'italic', wordWrap: { width: W - 24 } })));
        });
    },

    // ---------------- Mapa ----------------
    mapa(ui, c) {
        const zona = Joc.zonaActiva(ui);
        MAPA.dibuixar(ui, c, zona ? zona.scene.key : null, 170, ALT - 70);
    }
};
