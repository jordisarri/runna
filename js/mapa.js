/**
 * MAPA DEL JOC (es desplega des del menú)
 * Només es dibuixen les pantalles ja visitades (flag visitada_<Zona>) i els camins entre
 * dues pantalles visitades. La resta continua amagada. Les coordenades de 'zones' són d'un llenç antic de 1280x720; es converteixen al llenç vertical amb pos().
 * Les pantalles que encara no existeixen al joc no es poden visitar, així que no apareixen mai.
 */
const MAPA = {
    ample: 108, alt: 50,
    pos(z) { return { x: 56 + (z.x - 150) * 0.64, y: 140 + (z.y - 90) * 1.85 }; },
    zones: [
        // Nord
        { id: 'ZonaCirosa',        nom: 'La Cirosa',                x: 900, y: 0 },
        { id: 'ZonaMasiaCirosa',   nom: 'El Mas de la Cirosa',     x: 1070,  y: 0 },
        { id: 'ZonaCamiCirosa',    nom: 'Camí de la Cirosa',        x: 850,  y: 65 },
        { id: 'ZonaCabanaInt',     nom: 'Dins la cabana',           x: 200,  y: 110 },
        { id: 'ZonaCabana',        nom: 'Cabana de la Jaumeta',     x: 370,  y: 110 },
        { id: 'ZonaBosc',          nom: 'Bosc de Sant Joan',        x: 520,  y: 200 },
        { id: 'ZonaJordi',          nom: 'La Caseta',                x: 630,  y: 130 },
        { id: 'ZonaCasaJordi',     nom: 'Casa d\'en Jordi',         x: 470,  y: 80 },
        { id: 'ZonaCasetaJoc',     nom: 'Dins la caseta',           x: 630,  y: 80 },
        { id: 'ZonaTiller',        nom: 'El Gran Til·ler',          x: 800,  y: 130 },
        { id: 'ZonaCelles',        nom: 'Les Cel·les',              x: 800,  y: 210 },
        // Franja de les Runes, el Cementiri i el camí de la Desaparició
        { id: 'ZonaErmitaInt',     nom: 'Dins l\'ermita',           x: 150,  y: 300 },
        { id: 'ZonaErmita',        nom: 'Ermita Desaparició',       x: 330,  y: 300 },
        { id: 'ZonaCami',          nom: 'Camí de la Desaparició',   x: 560,  y: 300 },
        { id: 'ZonaCabanaCami',    nom: 'Cabana amagada',           x: 450,  y: 245 },
        { id: 'ZonaRuines',        nom: 'Les Runes',                x: 800,  y: 300 },
        { id: 'ZonaCementiri',     nom: 'El Cementiri',             x: 1050, y: 300 },
        { id: 'ZonaCellerFora',    nom: 'Pati del Celler',          x: 800,  y: 385 },
        { id: 'ZonaPingpong',      nom: 'El Celler',                x: 640,  y: 390 },
        { id: 'ZonaGolfes',         nom: 'Sala del Rellotge',       x: 930,  y: 335 },
        { id: 'ZonaEsglesia',      nom: 'Santuari',                 x: 930,  y: 390 },
        { id: 'ZonaEra',           nom: 'L\'Era',                   x: 300,  y: 390 },
        // Fila del poble (oest -> est): Hostatgeria · Taverna · Casa Gran · Plaça · Monestir
        { id: 'ZonaJardi',         nom: 'L\'Hostatgeria',           x: 440,  y: 470 },
        { id: 'ZonaHostatgeriaInt', nom: 'Hostatgeria per dins',      x: 440,  y: 410 },
        { id: 'ZonaCambraPains',    nom: 'Dormitori',                x: 340,  y: 350 },
        { id: 'ZonaCambraPhili',   nom: 'Refetor',                  x: 440,  y: 350 },
        { id: 'ZonaCambraCharm',   nom: 'Capella',                  x: 540,  y: 350 },
        { id: 'ZonaSoterraniHost', nom: 'Soterrani de l\'Hostatgeria', x: 440, y: 530 },
        { id: 'ZonaTaverna',       nom: 'La Taverna',               x: 590,  y: 470 },
        { id: 'ZonaTavernaInt',    nom: 'La Taverna per dins',      x: 590,  y: 520 },
        { id: 'ZonaSotaTaverna',   nom: 'Soterrani de la Taverna',  x: 590,  y: 596 },
        { id: 'ZonaGirgoles',      nom: 'Sala de les Gírgoles',     x: 930,  y: 596 },
        { id: 'ZonaTortura',       nom: 'Passadís de tortura',      x: 1100, y: 596 },
        { id: 'ZonaGabia',         nom: 'Sala de la Gàbia',         x: 1100, y: 650 },
        { id: 'ZonaCelaStAntoni',   nom: 'Cel·la de Sant Antoni',      x: 1260, y: 400 },
        { id: 'ZonaMonestirRebedor',  nom: 'Rebedor del Monestir',        x: 1010, y: 514 },
        { id: 'ZonaBiblioteca',    nom: 'Biblioteca del Monestir',  x: 1100, y: 562 },
        { id: 'ZonaCasaGran',      nom: 'Arcs de la Casa Gran',         x: 760,  y: 470 },
        { id: 'ZonaPlaca',         nom: 'Plaça del Santuari',       x: 930,  y: 470 },
        { id: 'ZonaMonestir',      nom: 'El Monestir',              x: 1100, y: 470 },
        { id: 'ZonaSantAntoni',    nom: 'Sant Antoni',              x: 1260, y: 470 },
        { id: 'ZonaCasaGranInt',   nom: 'Casa Gran · Escalinata',   x: 760,  y: 550 },
        { id: 'ZonaCasaCripta',    nom: 'Cripta dels Monjos',       x: 760,  y: 596 },
        { id: 'ZonaCasaTresor',    nom: 'Cambra secreta',          x: 675,  y: 550 },
        { id: 'ZonaPassadis',      nom: 'Passadís secret',          x: 675,  y: 425 },
        { id: 'ZonaCreu',          nom: 'La Bassadòria',            x: 930,  y: 550 },
        // Sud-oest i franja sud
        { id: 'ZonaCamiRov',       nom: 'Camí Rovellonera',         x: 170,  y: 460 },
        { id: 'ZonaRovellonera',   nom: 'Rovellonera',              x: 60,  y: 530 },
        { id: 'ZonaGabriel',       nom: 'Ermita de Sant Gabriel',   x: 60,  y: 610 },
        { id: 'ZonaDipositos',     nom: 'Els Dipòsits',             x: 250,  y: 640 },
        { id: 'ZonaDolmen',        nom: 'El Dolmen',                x: 430,  y: 640 }
    ],
    enllacos: [
        ['ZonaPlaca', 'ZonaCreu', 'S', 'N'], ['ZonaPlaca', 'ZonaCasaGran', 'W', 'E'], ['ZonaCasaGran', 'ZonaCasaGranInt'], ['ZonaCasaGranInt', 'ZonaCasaCripta'], ['ZonaCasaGranInt', 'ZonaCasaTresor'], ['ZonaCasaTresor', 'ZonaPassadis'], ['ZonaPassadis', 'ZonaPingpong'],
        ['ZonaPlaca', 'ZonaEsglesia'], ['ZonaEsglesia', 'ZonaGolfes'], ['ZonaPlaca', 'ZonaMonestir', 'E', 'W'], ['ZonaPlaca', 'ZonaCellerFora', 'N', 'S'], ['ZonaCellerFora', 'ZonaRuines', 'N', 'S'],
        ['ZonaCellerFora', 'ZonaPingpong'], ['ZonaRuines', 'ZonaCami', 'W', 'E'], ['ZonaCami', 'ZonaErmita', 'W', 'E'], ['ZonaCami', 'ZonaCabanaCami'],
        ['ZonaErmita', 'ZonaErmitaInt'], ['ZonaErmita', 'ZonaEra', 'S', 'N'], ['ZonaEra', 'ZonaJardi', 'E', 'W'],
        ['ZonaJardi', 'ZonaTaverna', 'E', 'W'], ['ZonaJardi', 'ZonaHostatgeriaInt'], ['ZonaJardi', 'ZonaSoterraniHost'], ['ZonaSoterraniHost', 'ZonaHostatgeriaInt'], ['ZonaHostatgeriaInt', 'ZonaCambraPains'], ['ZonaHostatgeriaInt', 'ZonaCambraPhili'], ['ZonaHostatgeriaInt', 'ZonaCambraCharm'], ['ZonaTaverna', 'ZonaCasaGran', 'E', 'W'], ['ZonaTaverna', 'ZonaTavernaInt'], ['ZonaTaverna', 'ZonaSotaTaverna'], ['ZonaSotaTaverna', 'ZonaGirgoles'], ['ZonaGirgoles', 'ZonaTortura'], ['ZonaTortura', 'ZonaGabia'], ['ZonaMonestir', 'ZonaMonestirRebedor'], ['ZonaMonestirRebedor', 'ZonaBiblioteca'],
        ['ZonaRuines', 'ZonaCementiri', 'E', 'W'], ['ZonaCementiri', 'ZonaMonestir', 'S', 'N'], ['ZonaMonestir', 'ZonaSantAntoni', 'E', 'W'], ['ZonaSantAntoni', 'ZonaCelaStAntoni'],
        ['ZonaRuines', 'ZonaCelles', 'N', 'S'], ['ZonaCelles', 'ZonaBosc', 'W', 'E'], ['ZonaBosc', 'ZonaCabana'], ['ZonaCabana', 'ZonaCabanaInt'],
        ['ZonaCelles', 'ZonaTiller', 'N', 'S'], ['ZonaTiller', 'ZonaJordi', 'W', 'E'], ['ZonaJordi', 'ZonaCasetaJoc'], ['ZonaJordi', 'ZonaCasaJordi'], ['ZonaTiller', 'ZonaCamiCirosa', 'N', 'S'], ['ZonaCamiCirosa', 'ZonaCirosa', 'N', 'S'], ['ZonaCirosa', 'ZonaMasiaCirosa'],
        ['ZonaEra', 'ZonaCamiRov', 'W', 'E'], ['ZonaCamiRov', 'ZonaRovellonera', 'W', 'E'], ['ZonaRovellonera', 'ZonaGabriel', 'S', 'N'],
        ['ZonaGabriel', 'ZonaDipositos', 'E', 'W'], ['ZonaDipositos', 'ZonaDolmen', 'E', 'W']
    ],

    visitada(id) { return Estat.flag('visitada_' + id); },

    // Tipus de lloc (color de la fitxa): exterior, interior o sota terra
    SOTA: ['ZonaSotaTaverna', 'ZonaGirgoles', 'ZonaTortura', 'ZonaGabia', 'ZonaCasaCripta', 'ZonaSoterraniHost', 'ZonaPassadis', 'ZonaCasaTresor'],
    INTERIOR: ['ZonaCabanaInt', 'ZonaCasaJordi', 'ZonaCasetaJoc', 'ZonaMasiaCirosa', 'ZonaErmitaInt', 'ZonaPingpong', 'ZonaGolfes', 'ZonaEsglesia',
               'ZonaHostatgeriaInt', 'ZonaCambraPains', 'ZonaCambraPhili', 'ZonaCambraCharm', 'ZonaTavernaInt', 'ZonaCelaStAntoni', 'ZonaMonestirRebedor', 'ZonaBiblioteca', 'ZonaCasaGranInt', 'ZonaCabanaCami'],
    COLORS: { ext: [0x24453a, 0x6ac09a], int: [0x4a3220, 0xd8a868], sota: [0x2e2248, 0xa888e8] },
    tipus(id) { return MAPA.SOTA.includes(id) ? 'sota' : MAPA.INTERIOR.includes(id) ? 'int' : 'ext'; },

    // ---------------- Mapa a l'estil metroidvania ----------------
    // El món es dibuixa en coordenades ampliades i es mira per una finestra: s'arrossega per desplaçar-lo i es fa zoom
    // amb la rodeta, pessigant o amb els botons +/−. Cada regió té el seu color i el seu nom.
    mon(z) { return { x: (z.x - 150) * 2, y: (z.y - 80) * 3 }; },
    REGIONS: [
        { nom: 'La Cirosa', color: 0xe0b050, ids: ['ZonaCirosa', 'ZonaMasiaCirosa', 'ZonaCamiCirosa'] },
        { nom: 'Bosc de Sant Joan', color: 0x58b878, ids: ['ZonaCabanaInt', 'ZonaCabana', 'ZonaBosc', 'ZonaJordi', 'ZonaCasaJordi', 'ZonaCasetaJoc', 'ZonaTiller', 'ZonaCelles'] },
        { nom: 'Les Runes', color: 0x78a8d8, ids: ['ZonaRuines', 'ZonaCellerFora', 'ZonaCementiri', 'ZonaPingpong', 'ZonaCami', 'ZonaCabanaCami', 'ZonaErmita', 'ZonaErmitaInt'] },
        { nom: 'El Poble', color: 0xd09a58, ids: ['ZonaEra', 'ZonaJardi', 'ZonaHostatgeriaInt', 'ZonaCambraPains', 'ZonaCambraPhili', 'ZonaCambraCharm', 'ZonaTaverna', 'ZonaTavernaInt', 'ZonaCasaGran', 'ZonaCasaGranInt', 'ZonaPlaca', 'ZonaCreu', 'ZonaEsglesia', 'ZonaGolfes'] },
        { nom: 'El Monestir', color: 0xd8704a, ids: ['ZonaMonestir', 'ZonaSantAntoni', 'ZonaCelaStAntoni', 'ZonaMonestirRebedor', 'ZonaBiblioteca'] },
        { nom: 'La Rovellonera', color: 0xc08848, ids: ['ZonaCamiRov', 'ZonaRovellonera', 'ZonaGabriel', 'ZonaDipositos', 'ZonaDolmen'] },
        { nom: 'Sota terra', color: 0x9070e0, etiqueta: false, ids: ['ZonaSotaTaverna', 'ZonaGirgoles', 'ZonaTortura', 'ZonaGabia', 'ZonaCasaCripta', 'ZonaSoterraniHost', 'ZonaPassadis', 'ZonaCasaTresor'] }
    ],
    regio(id) { return MAPA.REGIONS.find(r => r.ids.includes(id)); },

    // Dibuixa el mapa dins del contenidor, entre les y top i baix; actual = id de la zona on som
    dibuixar(scene, cont, actual, top = 120, baix = ALT - 60) {
        const E = Estat, X0 = 50, X1 = AMPLE - 50, VW = X1 - X0, VH = baix - top;   // dins del pergamí (el marc fa 44 px)
        const hInfo = 124, yInfo = baix - 46 - hInfo, VH2 = yInfo - top;        // VH2: part visible above the info panel
        const per = id => MAPA.zones.find(z => z.id === id);
        const hex = n => '#' + n.toString(16).padStart(6, '0');
        const add = (o, a = cont) => { a.add(o); return o; };
        const anims = [];
        const anima = cfg => { const t = scene.tweens.add(cfg); anims.push(t); return t; };

        // Lloc de l'objectiu i encàrrecs oberts
        const seg = PROGRES.seguent(E);
        const zObj = seg && DIARI_PASSOS[seg.id] ? DIARI_PASSOS[seg.id][1] : null;
        const encarrecs = {};
        PROGRES.laterals.filter(l => l.obert(E) && !l.fet(E)).forEach(l => { const d = DIARI_LATERALS[l.id]; if (d) (encarrecs[d[1]] = encarrecs[d[1]] || []).push(d[0]); });
        const vis = id => MAPA.visitada(id);
        // Llocs per explorar: no visitats però al costat d'un de visitat (o on és l'objectiu)
        const conegut = id => vis(id) || id === zObj || MAPA.enllacos.some(([a, b]) => (a === id && vis(b)) || (b === id && vis(a)));
        const nodes = MAPA.zones.filter(z => conegut(z.id)).map(z => {
            const p = MAPA.mon(z), t = MAPA.tipus(z.id), v = vis(z.id);
            const [w, h] = !v ? [46, 34] : t === 'ext' ? [78, 46] : [56, 38];
            return { z, id: z.id, x: p.x, y: p.y, t, v, w, h, ara: z.id === actual, reg: MAPA.regio(z.id) };
        });
        const nodeDe = id => nodes.find(n => n.id === id);

        // Marc i fons de la finestra
        add(scene.add.rectangle(X0, top, VW, VH, 0x0d0a07, 1).setOrigin(0));
        const mon = add(scene.add.container(0, 0));
        const mg = scene.make.graphics({ add: false }); mg.fillStyle(0xffffff).fillRect(X0 + 2, top + 2, VW - 4, VH2 - 2);
        mon.setMask(mg.createGeometryMask());

        // Límits del món conegut (per no perdre's)
        const marge = 190;
        const bx0 = Math.min(...nodes.map(n => n.x)) - marge, bx1 = Math.max(...nodes.map(n => n.x)) + marge;
        const by0 = Math.min(...nodes.map(n => n.y)) - marge, by1 = Math.max(...nodes.map(n => n.y)) + marge;
        const ZMIN = Math.max(0.24, Math.min(0.7, VW / (bx1 - bx0), VH2 / (by1 - by0))), ZMAX = 1.9;
        const V = MAPA.vista || (MAPA.vista = { z: 0.7 });
        const nAra = nodeDe(actual) || nodeDe(zObj) || nodes[0];
        V.cx = nAra ? nAra.x : 0; V.cy = nAra ? nAra.y : 0;
        V.z = Math.min(ZMAX, Math.max(ZMIN, V.z));

        // Quadrícula suau, que es mou amb el mapa i dóna sensació de desplaçament
        const gq = add(scene.add.graphics(), mon);
        gq.lineStyle(2, 0xb89a50, 0.05);
        for (let x = Math.floor(bx0 / 160) * 160; x <= bx1; x += 160) gq.lineBetween(x, by0, x, by1);
        for (let y = Math.floor(by0 / 160) * 160; y <= by1; y += 160) gq.lineBetween(bx0, y, bx1, y);

        // Resplendor de cada regió descoberta
        if (!scene.textures.exists('mapa_halo')) {
            const ct = scene.textures.createCanvas('mapa_halo', 256, 256), cx = ct.getContext();
            const gr = cx.createRadialGradient(128, 128, 0, 128, 128, 128);
            gr.addColorStop(0, 'rgba(255,255,255,0.9)'); gr.addColorStop(0.45, 'rgba(255,255,255,0.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
            cx.fillStyle = gr; cx.fillRect(0, 0, 256, 256); ct.refresh();
        }
        const etiquetes = [];
        nodes.forEach(n => { if (n.v && n.reg) add(scene.add.image(n.x, n.y, 'mapa_halo').setScale(n.t === 'sota' ? 1.0 : 1.45).setTint(n.reg.color).setAlpha(0.3).setBlendMode(Phaser.BlendModes.ADD), mon); });
        MAPA.REGIONS.forEach(r => {
            const vs = nodes.filter(n => n.v && n.reg === r);
            if (!vs.length || r.etiqueta === false) return;
            const cx = vs.reduce((s, n) => s + n.x, 0) / vs.length, cy = vs.reduce((s, n) => s + n.y, 0) / vs.length;
            etiquetes.push(add(scene.add.text(cx, cy, r.nom.toUpperCase(), estilText(60, hex(r.color), { fontStyle: 'bold', fontFamily: FONT_PLACA })).setOrigin(0.5).setAlpha(0.3), mon));
        });

        // Camins. Els que a l'escena surten per una vora (da, db: N, S, E, W) surten de la fitxa per aquell mateix costat i
        // fan corba fins a l'altra; les portes (sense direcció) són un traç recte.
        const g = add(scene.add.graphics(), mon);
        const DIR = { N: [0, -1], S: [0, 1], E: [1, 0], W: [-1, 0] };
        const tracat = (na, nb, da, db) => {
            if (!da || !db) return [{ x: na.x, y: na.y }, { x: nb.x, y: nb.y }];
            const [ax, ay] = DIR[da], [bx, by] = DIR[db];
            const p0 = new Phaser.Math.Vector2(na.x + ax * na.w / 2, na.y + ay * na.h / 2), p3 = new Phaser.Math.Vector2(nb.x + bx * nb.w / 2, nb.y + by * nb.h / 2);
            const L = Math.max(50, p0.distance(p3) * 0.45);
            return new Phaser.Curves.CubicBezier(p0, new Phaser.Math.Vector2(p0.x + ax * L, p0.y + ay * L), new Phaser.Math.Vector2(p3.x + bx * L, p3.y + by * L), p3).getPoints(24);
        };
        MAPA.enllacos.forEach(([a, b, da, db]) => {
            const na = nodeDe(a), nb = nodeDe(b);
            if (!na || !nb || (!na.v && !nb.v)) return;
            const pts = tracat(na, nb, da, db);
            if (na.v && nb.v) { g.lineStyle(9, 0x000000, 0.55).strokePoints(pts.map(p => ({ x: p.x, y: p.y + 2 }))); g.lineStyle(5, 0xb09a74, 1).strokePoints(pts); }
            else {                                                       // camí a un lloc encara per explorar: puntejat
                const corba = new Phaser.Curves.Spline(pts.map(p => new Phaser.Math.Vector2(p.x, p.y)));
                const n = Math.max(2, Math.floor(corba.getLength() / 22));
                g.fillStyle(0x8a7a62, 0.95);
                corba.getSpacedPoints(n).slice(1, -1).forEach(p => g.fillCircle(p.x, p.y, 3.5));
            }
        });

        // Fitxes dels llocs
        const etiquetesLloc = [];
        let trobats = 0;
        nodes.forEach(n => {
            const { x, y, w, h } = n;
            if (n.v) trobats++;
            const [fons, vora] = n.v ? MAPA.COLORS[n.t] : [0x1c1712, 0x5a4a3a];
            const f = add(scene.add.graphics(), mon);
            const forma = (dx = 0, dy = 0, ww = w, hh = h) => {
                if (n.t === 'sota' && n.v) { const c = 10, x0 = x - ww / 2 + dx, y0 = y - hh / 2 + dy, x1 = x0 + ww, y1 = y0 + hh; return [{ x: x0 + c, y: y0 }, { x: x1 - c, y: y0 }, { x: x1, y: y0 + c }, { x: x1, y: y1 - c }, { x: x1 - c, y: y1 }, { x: x0 + c, y: y1 }, { x: x0, y: y1 - c }, { x: x0, y: y0 + c }]; }
                return null;
            };
            const poli = forma();
            f.fillStyle(0x000000, 0.5);
            if (poli) f.fillPoints(forma(3, 4), true); else f.fillRoundedRect(x - w / 2 + 3, y - h / 2 + 4, w, h, 12);
            f.fillStyle(fons, 1);
            if (poli) f.fillPoints(poli, true); else f.fillRoundedRect(x - w / 2, y - h / 2, w, h, 12);
            f.lineStyle(n.ara ? 4 : 3, n.ara ? 0xffd34d : vora, n.v ? 1 : 0.8);
            if (poli) f.strokePoints(poli, true); else f.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 12);
            if (n.v) { f.lineStyle(1.5, vora, 0.35); if (!poli) f.strokeRoundedRect(x - w / 2 + 6, y - h / 2 + 6, w - 12, h - 12, 7); }
            if (!n.v) add(scene.add.text(x, y, '?', estilText(28, '#8a7a68', { fontStyle: 'bold' })).setOrigin(0.5), mon);
            else {
                const t = add(scene.add.text(x, y + h / 2 + 6, n.z.nom, estilText(22, n.ara ? '#ffe9a8' : '#efe3c4', { fontStyle: 'bold', align: 'center', wordWrap: { width: 200 }, stroke: '#0b0805', strokeThickness: 6, lineSpacing: -2 })).setOrigin(0.5, 0), mon);
                if (!n.ara) etiquetesLloc.push(t);
            }
            if (n.ara) {                                                // halo daurat que batega i xinxeta que bota
                const hl = add(scene.add.rectangle(x, y, w + 26, h + 26, 0xffd34d, 0.2).setStrokeStyle(3, 0xffd34d, 0.9), mon);
                anima({ targets: hl, alpha: 0.4, scaleX: 1.1, scaleY: 1.15, yoyo: true, repeat: -1, duration: 650 });
                const pin = add(scene.add.graphics(), mon);
                pin.fillStyle(0xffd34d, 1).fillTriangle(-13, -22, 13, -22, 0, 0).lineStyle(3, 0x3a2408, 1).strokeTriangle(-13, -22, 13, -22, 0, 0);
                pin.fillStyle(0x3a2408, 1).fillCircle(0, -15, 4);
                pin.setPosition(x, y - h / 2 - 12);
                anima({ targets: pin, y: y - h / 2 - 28, yoyo: true, repeat: -1, duration: 600, ease: 'Sine.easeInOut' });
            }
            if (n.id === zObj) {
                const st = add(scene.add.text(x + w / 2 - 2, y - h / 2 + 2, '★', estilText(38, '#ff7a4a', { stroke: '#2a0a04', strokeThickness: 6 })).setOrigin(0.5), mon);
                anima({ targets: st, scale: 1.3, yoyo: true, repeat: -1, duration: 500 });
            }
            if (encarrecs[n.id]) {
                add(scene.add.circle(x - w / 2 + 2, y - h / 2 + 2, 14, 0x1a3a66, 1).setStrokeStyle(3, 0x7ab8ff, 1), mon);
                add(scene.add.text(x - w / 2 + 2, y - h / 2 + 2, '!', estilText(24, '#bfe0ff', { fontStyle: 'bold' })).setOrigin(0.5), mon);
            }
        });
        const sel = add(scene.add.rectangle(0, 0, 10, 10, 0xffffff, 0).setStrokeStyle(2, 0xffffff, 0.85).setVisible(false), mon);

        // Vores fosques a dalt i a baix, perquè els textos es llegeixin sobre el mapa
        const ombra = add(scene.add.graphics());
        ombra.fillGradientStyle(0x0d0a07, 0x0d0a07, 0x0d0a07, 0x0d0a07, 0.95, 0.95, 0, 0).fillRect(X0 + 2, top + 2, VW - 4, 90);
        ombra.setDepth(1);

        // Quadre d'informació del lloc seleccionat (a baix) i llegenda
        add(scene.add.rectangle(X0 + 2, yInfo, VW - 4, hInfo, 0x0a0705, 1).setOrigin(0));
        add(scene.add.rectangle(X0 + 2, yInfo, VW - 4, 2, 0xb89a50, 0.8).setOrigin(0));
        const info = add(scene.add.text(AMPLE / 2, yInfo + hInfo / 2, '', estilText(25, '#f2e6c8', { align: 'center', wordWrap: { width: VW - 40 }, lineSpacing: 4 })).setOrigin(0.5));
        const explicar = id => {
            const n = nodeDe(id) || nodes[0];
            if (!n) return;
            const parts = [n.v ? n.z.nom : 'Lloc per explorar'];
            if (n.ara) parts[0] += '  ·  ets aquí';
            if (id === zObj) parts.push('★ ' + DIARI_PASSOS[seg.id][0]);
            (encarrecs[id] || []).forEach(t => parts.push('! ' + t));
            info.setText(parts.join('\n'));
            sel.setPosition(n.x, n.y).setSize(n.w + 22, n.h + 22).setVisible(true);
        };
        add(scene.add.rectangle(X0 + 2, baix - 46, VW - 4, 44, 0x000000, 1).setOrigin(0));
        const ly = baix - 24;
        let lx = X0 + 14;
        [['■', '#6ac09a', 'Fora'], ['■', '#d8a868', 'Dins'], ['■', '#a888e8', 'Sota terra'], ['★', '#ff7a4a', 'Objectiu'], ['!', '#7ab8ff', 'Encàrrec'], ['?', '#8a7a68', 'Per explorar']].forEach(([s, col, t]) => {
            const a = add(scene.add.text(lx, ly, s, estilText(20, col, { fontStyle: 'bold' })).setOrigin(0, 0.5));
            const b = add(scene.add.text(lx + a.width + 5, ly, t, estilText(17, '#c8b898')).setOrigin(0, 0.5));
            lx = b.x + b.width + 14;
        });
        add(scene.add.text(X0 + 16, top + 12, `${trobats}/${MAPA.zones.length} llocs`, estilText(22, '#c8b898', { fontStyle: 'italic', stroke: '#0b0805', strokeThickness: 4 })).setDepth(2));
        const ajuda = add(scene.add.text(X0 + 16, top + 42, 'arrossega · pessiga o rodeta per fer zoom', estilText(17, '#a89878', { stroke: '#0b0805', strokeThickness: 3 })));
        anima({ targets: ajuda, alpha: 0, delay: 5000, duration: 800 });
        add(scene.add.rectangle(X0, top, VW, VH, 0, 0).setOrigin(0).setStrokeStyle(3, 0xb89a50, 0.9));

        // ---- Càmera del mapa: posició i zoom ----
        const aplicar = () => {
            V.z = Math.min(ZMAX, Math.max(ZMIN, V.z));
            const mx = VW / 2 / V.z, my = VH2 / 2 / V.z;                // el món no surt de la finestra; si hi cap sencer, es centra
            V.cx = bx1 - bx0 <= 2 * mx ? (bx0 + bx1) / 2 : Math.min(bx1 - mx, Math.max(bx0 + mx, V.cx));
            V.cy = by1 - by0 <= 2 * my ? (by0 + by1) / 2 : Math.min(by1 - my, Math.max(by0 + my, V.cy));
            mon.setScale(V.z).setPosition(X0 + VW / 2 - V.cx * V.z, top + VH2 / 2 - V.cy * V.z);
            etiquetesLloc.forEach(t => t.setVisible(V.z >= 0.6));
            etiquetes.forEach(t => t.setAlpha(V.z > 1.2 ? 0.12 : 0.3));
        };
        const mon2 = p => ({ x: V.cx + (p.x - (X0 + VW / 2)) / V.z, y: V.cy + (p.y - (top + VH2 / 2)) / V.z });
        const zoomA = (p, z) => {                                       // zoom que manté fix el punt sota el dit/ratolí
            const w = mon2(p); V.z = Math.min(ZMAX, Math.max(ZMIN, z));
            V.cx = w.x - (p.x - (X0 + VW / 2)) / V.z; V.cy = w.y - (p.y - (top + VH2 / 2)) / V.z; aplicar();
        };
        aplicar();
        explicar(nodeDe(actual) ? actual : (zObj || (nodes[0] && nodes[0].id)));

        // Arrossegar, pessigar, rodeta i botons
        const dins = p => p.x >= X0 && p.x <= X1 && p.y >= top && p.y <= baix;
        let arr = null, pessic = 0;
        const zona = add(scene.add.zone(X0, top, VW, yInfo - top).setOrigin(0).setInteractive({ useHandCursor: false }));
        zona.on('pointerdown', p => { arr = { sx: p.x, sy: p.y, cx: V.cx, cy: V.cy, t: scene.time.now, mogut: false }; pessic = 0; });
        const mou = p => {
            if (!arr) return;
            const p1 = scene.input.pointer1, p2 = scene.input.pointer2;
            if (p1 && p2 && p1.isDown && p2.isDown) {                  // pessigar
                const d = Math.hypot(p1.x - p2.x, p1.y - p2.y), mig = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
                if (pessic) zoomA(mig, V.z * d / pessic);
                pessic = d; arr.mogut = true; return;
            }
            pessic = 0;
            if (!p.isDown) return;
            if (Math.hypot(p.x - arr.sx, p.y - arr.sy) > 10) arr.mogut = true;
            if (arr.mogut) { V.cx = arr.cx - (p.x - arr.sx) / V.z; V.cy = arr.cy - (p.y - arr.sy) / V.z; aplicar(); }
        };
        const solta = p => {
            if (!arr) return;
            const a = arr; arr = null; pessic = 0;
            if (a.mogut || scene.time.now - a.t > 600 || !dins(p) || p.y > yInfo) return;
            const w = mon2(p);                                          // toc: selecciona el lloc més proper
            const marge = 22 / V.z;
            const n = nodes.filter(q => Math.abs(w.x - q.x) < q.w / 2 + marge && Math.abs(w.y - q.y) < q.h / 2 + marge + (q.v ? 12 : 0))
                .sort((a1, b1) => Math.hypot(w.x - a1.x, w.y - a1.y) - Math.hypot(w.x - b1.x, w.y - b1.y))[0];
            if (n) { explicar(n.id); Sfx.pagina(); }
        };
        const roda = (p, o, dx, dy) => { if (dins(p)) zoomA(p, V.z * (dy > 0 ? 0.87 : 1.15)); };
        if (!scene.input.pointer2) scene.input.addPointer(1);
        scene.input.on('pointermove', mou); scene.input.on('pointerup', solta); scene.input.on('wheel', roda);

        const boto = (x, y, s, fer) => {
            const c = add(scene.add.circle(x, y, 28, 0x15110d, 0.92).setStrokeStyle(3, 0xb89a50, 0.95).setDepth(3).setInteractive({ useHandCursor: true }));
            const t = add(scene.add.text(x, y - 1, s, estilText(34, '#f2e6c8', { fontStyle: 'bold' })).setOrigin(0.5).setDepth(4));
            c.on('pointerdown', () => { fer(); Sfx.pagina(); });
            return c;
        };
        const centre = { x: X0 + VW / 2, y: top + VH2 / 2 };
        boto(X1 - 40, top + 62, '+', () => zoomA(centre, V.z * 1.3));
        boto(X1 - 40, top + 128, '−', () => zoomA(centre, V.z / 1.3));
        boto(X1 - 40, top + 194, '◎', () => { const n = nodeDe(actual) || nodeDe(zObj); if (n) { V.cx = n.x; V.cy = n.y; aplicar(); explicar(n.id); } });

        cont.once('destroy', () => {
            anims.forEach(t => t.remove());
            scene.input.off('pointermove', mou); scene.input.off('pointerup', solta); scene.input.off('wheel', roda);
            mg.destroy();
        });
    }
};
