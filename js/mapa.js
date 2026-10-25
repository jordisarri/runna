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
        { id: 'ZonaCirosa',        nom: 'La Cirosa',                x: 1100, y: 90 },
        { id: 'ZonaMasiaCirosa',   nom: 'El Mas de la Cirosa',     x: 930,  y: 90 },
        { id: 'ZonaCamiCirosa',    nom: 'Camí de la Cirosa',        x: 950,  y: 150 },
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
        { id: 'ZonaPingpong',      nom: 'El Celler',                x: 640,  y: 390 },
        { id: 'ZonaGolfes',         nom: 'Sala del Rellotge',       x: 930,  y: 335 },
        { id: 'ZonaEsglesia',      nom: 'Santuari',                 x: 930,  y: 390 },
        { id: 'ZonaEra',           nom: 'L\'Era',                   x: 330,  y: 390 },
        // Fila del poble (oest -> est): Hostatgeria · Taverna · Casa Gran · Plaça · Monestir
        { id: 'ZonaJardi',         nom: 'L\'Hostatgeria',           x: 250,  y: 470 },
        { id: 'ZonaHostatgeriaInt', nom: 'Hostatgeria per dins',      x: 420,  y: 470 },
        { id: 'ZonaCambraPains',    nom: 'Dormitori',                x: 250,  y: 420 },
        { id: 'ZonaCambraPhili',   nom: 'Refetor',                  x: 410,  y: 420 },
        { id: 'ZonaCambraCharm',   nom: 'Capella',                  x: 570,  y: 420 },
        { id: 'ZonaSoterraniHost', nom: 'Soterrani de l\'Hostatgeria', x: 420, y: 520 },
        { id: 'ZonaTaverna',       nom: 'La Taverna',               x: 590,  y: 470 },
        { id: 'ZonaTavernaInt',    nom: 'La Taverna per dins',      x: 590,  y: 520 },
        { id: 'ZonaSotaTaverna',   nom: 'Soterrani de la Taverna',  x: 590,  y: 596 },
        { id: 'ZonaGirgoles',      nom: 'Sala de les Gírgoles',     x: 930,  y: 596 },
        { id: 'ZonaTortura',       nom: 'Passadís de tortura',      x: 1100, y: 596 },
        { id: 'ZonaGabia',         nom: 'Sala de la Gàbia',         x: 1100, y: 650 },
        { id: 'ZonaCelaStAntoni',   nom: 'Cel·la de Sant Antoni',      x: 1100, y: 330 },
        { id: 'ZonaMonestirRebedor',  nom: 'Rebedor del Monestir',        x: 1010, y: 520 },
        { id: 'ZonaBiblioteca',    nom: 'Biblioteca del Monestir',  x: 1100, y: 545 },
        { id: 'ZonaCasaGran',      nom: 'Arcs de la Casa Gran',         x: 760,  y: 470 },
        { id: 'ZonaPlaca',         nom: 'Plaça del Santuari',       x: 930,  y: 470 },
        { id: 'ZonaMonestir',      nom: 'El Monestir',              x: 1100, y: 470 },
        { id: 'ZonaSantAntoni',    nom: 'Sant Antoni',              x: 1100, y: 390 },
        { id: 'ZonaCasaGranInt',   nom: 'Casa Gran · Escalinata',   x: 760,  y: 550 },
        { id: 'ZonaCasaCripta',    nom: 'Cripta dels Monjos',       x: 760,  y: 596 },
        { id: 'ZonaCasaTresor',    nom: 'Cambra secreta',          x: 590,  y: 550 },
        { id: 'ZonaPassadis',      nom: 'Passadís secret',          x: 760,  y: 420 },
        { id: 'ZonaCreu',          nom: 'La Bassadòria',            x: 930,  y: 550 },
        // Sud-oest i franja sud
        { id: 'ZonaCamiRov',       nom: 'Camí Rovellonera',         x: 230,  y: 540 },
        { id: 'ZonaRovellonera',   nom: 'Rovellonera',              x: 400,  y: 590 },
        { id: 'ZonaGabriel',       nom: 'Ermita de Sant Gabriel',   x: 400,  y: 640 },
        { id: 'ZonaDipositos',     nom: 'Els Dipòsits',             x: 650,  y: 640 },
        { id: 'ZonaDolmen',        nom: 'El Dolmen',                x: 900,  y: 640 }
    ],
    enllacos: [
        ['ZonaPlaca', 'ZonaCreu'], ['ZonaPlaca', 'ZonaCasaGran'], ['ZonaCasaGran', 'ZonaCasaGranInt'], ['ZonaCasaGranInt', 'ZonaCasaCripta'], ['ZonaCasaGranInt', 'ZonaCasaTresor'], ['ZonaCasaTresor', 'ZonaPassadis'], ['ZonaPassadis', 'ZonaPingpong'],
        ['ZonaPlaca', 'ZonaEsglesia'], ['ZonaEsglesia', 'ZonaGolfes'], ['ZonaPlaca', 'ZonaMonestir'], ['ZonaPlaca', 'ZonaRuines'],
        ['ZonaRuines', 'ZonaPingpong'], ['ZonaRuines', 'ZonaCami'], ['ZonaCami', 'ZonaErmita'], ['ZonaCami', 'ZonaCabanaCami'],
        ['ZonaErmita', 'ZonaErmitaInt'], ['ZonaErmita', 'ZonaEra'], ['ZonaEra', 'ZonaJardi'],
        ['ZonaJardi', 'ZonaTaverna'], ['ZonaJardi', 'ZonaSoterraniHost'], ['ZonaSoterraniHost', 'ZonaHostatgeriaInt'], ['ZonaHostatgeriaInt', 'ZonaCambraPains'], ['ZonaHostatgeriaInt', 'ZonaCambraPhili'], ['ZonaHostatgeriaInt', 'ZonaCambraCharm'], ['ZonaTaverna', 'ZonaCasaGran'], ['ZonaTaverna', 'ZonaTavernaInt'], ['ZonaTaverna', 'ZonaSotaTaverna'], ['ZonaSotaTaverna', 'ZonaGirgoles'], ['ZonaGirgoles', 'ZonaTortura'], ['ZonaTortura', 'ZonaGabia'], ['ZonaMonestir', 'ZonaMonestirRebedor'], ['ZonaMonestirRebedor', 'ZonaBiblioteca'],
        ['ZonaRuines', 'ZonaCementiri'], ['ZonaCementiri', 'ZonaMonestir'], ['ZonaMonestir', 'ZonaSantAntoni'], ['ZonaSantAntoni', 'ZonaCelaStAntoni'],
        ['ZonaRuines', 'ZonaCelles'], ['ZonaCelles', 'ZonaBosc'], ['ZonaBosc', 'ZonaCabana'], ['ZonaCabana', 'ZonaCabanaInt'],
        ['ZonaCelles', 'ZonaTiller'], ['ZonaTiller', 'ZonaJordi'], ['ZonaJordi', 'ZonaCasetaJoc'], ['ZonaJordi', 'ZonaCasaJordi'], ['ZonaTiller', 'ZonaCamiCirosa'], ['ZonaCamiCirosa', 'ZonaCirosa'], ['ZonaCirosa', 'ZonaMasiaCirosa'],
        ['ZonaEra', 'ZonaCamiRov'], ['ZonaCamiRov', 'ZonaRovellonera'], ['ZonaRovellonera', 'ZonaGabriel'],
        ['ZonaGabriel', 'ZonaDipositos'], ['ZonaDipositos', 'ZonaDolmen']
    ],

    visitada(id) { return Estat.flag('visitada_' + id); },

    // Tipus de lloc (color de la fitxa): exterior, interior o sota terra
    SOTA: ['ZonaSotaTaverna', 'ZonaGirgoles', 'ZonaTortura', 'ZonaGabia', 'ZonaCasaCripta', 'ZonaSoterraniHost', 'ZonaPassadis', 'ZonaCasaTresor'],
    INTERIOR: ['ZonaCabanaInt', 'ZonaCasaJordi', 'ZonaCasetaJoc', 'ZonaMasiaCirosa', 'ZonaErmitaInt', 'ZonaPingpong', 'ZonaGolfes', 'ZonaEsglesia',
               'ZonaHostatgeriaInt', 'ZonaCambraPains', 'ZonaCambraPhili', 'ZonaCambraCharm', 'ZonaTavernaInt', 'ZonaCelaStAntoni', 'ZonaMonestirRebedor', 'ZonaBiblioteca', 'ZonaCasaGranInt', 'ZonaCabanaCami'],
    COLORS: { ext: [0x24453a, 0x6ac09a], int: [0x4a3220, 0xd8a868], sota: [0x2e2248, 0xa888e8] },
    tipus(id) { return MAPA.SOTA.includes(id) ? 'sota' : MAPA.INTERIOR.includes(id) ? 'int' : 'ext'; },

    // Dibuixa el mapa dins del contenidor, entre les y top i baix; actual = id de la zona on som
    dibuixar(scene, cont, actual, top = 120, baix = ALT - 60) {
        const E = Estat, X0 = 24, X1 = AMPLE - 24;
        const pos = z => ({ x: 64 + (z.x - 150) * 0.625, y: top + 50 + (z.y - 80) * (baix - top - 190) / 570 });
        const per = id => MAPA.zones.find(z => z.id === id);
        const add = o => { cont.add(o); return o; };
        // Tauler fosc amb una quadrícula suau
        add(scene.add.rectangle(X0, top, X1 - X0, baix - top, 0x15110d, 1).setOrigin(0).setStrokeStyle(3, 0xb89a50, 0.9));
        const q = add(scene.add.graphics());
        q.lineStyle(1, 0xffffff, 0.04);
        for (let x = X0 + 30; x < X1; x += 30) q.lineBetween(x, top + 2, x, baix - 2);
        for (let y = top + 30; y < baix; y += 30) q.lineBetween(X0 + 2, y, X1 - 2, y);
        add(scene.add.text(X1 - 14, top + 10, 'N ▲', estilText(16, '#6a5a48', { fontStyle: 'bold' })).setOrigin(1, 0));

        // On és l'objectiu i on hi ha encàrrecs
        const seg = PROGRES.seguent(E);
        const zObj = seg && DIARI_PASSOS[seg.id] ? DIARI_PASSOS[seg.id][1] : null;
        const encarrecs = {};
        PROGRES.laterals.filter(l => l.obert(E) && !l.fet(E)).forEach(l => { const d = DIARI_LATERALS[l.id]; if (d) (encarrecs[d[1]] = encarrecs[d[1]] || []).push(d[0]); });
        const vis = id => MAPA.visitada(id);
        // Llocs per explorar: no visitats però al costat d'un de visitat (o on és l'objectiu)
        const conegut = id => vis(id) || id === zObj || MAPA.enllacos.some(([a, b]) => (a === id && vis(b)) || (b === id && vis(a)));

        // Camins
        const g = add(scene.add.graphics());
        MAPA.enllacos.forEach(([a, b]) => {
            if (!conegut(a) || !conegut(b) || (!vis(a) && !vis(b))) return;
            const pa = pos(per(a)), pb = pos(per(b));
            if (vis(a) && vis(b)) { g.lineStyle(6, 0x000000, 0.5).lineBetween(pa.x, pa.y + 2, pb.x, pb.y + 2); g.lineStyle(4, 0x9a8668, 1).lineBetween(pa.x, pa.y, pb.x, pb.y); }
            else {                                                       // camí a un lloc encara per explorar: puntejat
                const n = Math.max(2, Math.floor(Math.hypot(pb.x - pa.x, pb.y - pa.y) / 12));
                g.fillStyle(0x7a6a58, 0.9);
                for (let k = 1; k < n; k += 2) g.fillCircle(pa.x + (pb.x - pa.x) * k / n, pa.y + (pb.y - pa.y) * k / n, 2.5);
            }
        });

        // Fitxes dels llocs
        const info = add(scene.add.text(AMPLE / 2, baix - 104, '', estilText(19, '#f2e6c8', { align: 'center', wordWrap: { width: X1 - X0 - 40 } })).setOrigin(0.5, 0));
        const explicar = id => {
            const z = per(id), parts = [vis(id) ? z.nom : 'Lloc per explorar'];
            if (id === actual) parts[0] += '  ·  ets aquí';
            if (id === zObj) parts.push('★ ' + DIARI_PASSOS[seg.id][0]);
            (encarrecs[id] || []).forEach(t => parts.push('! ' + t));
            info.setText(parts.join('\n'));
        };
        const W = 98, H = 40;
        let trobats = 0;
        MAPA.zones.forEach(z => {
            if (!conegut(z.id)) return;
            const { x, y } = pos(z), v = vis(z.id), ara = z.id === actual;
            if (v) trobats++;
            if (ara) {                                                   // halo daurat que batega
                const h = add(scene.add.rectangle(x, y, W + 16, H + 16, 0xffd34d, 0.25).setStrokeStyle(3, 0xffd34d, 0.9));
                scene.tweens.add({ targets: h, alpha: 0.35, scaleX: 1.08, scaleY: 1.15, yoyo: true, repeat: -1, duration: 650 });
            }
            const [fons, vora] = v ? MAPA.COLORS[MAPA.tipus(z.id)] : [0x221c16, 0x5a4a3a];
            const f = add(scene.add.graphics());
            f.fillStyle(0x000000, 0.45).fillRoundedRect(x - W / 2 + 2, y - H / 2 + 3, W, H, 10);
            f.fillStyle(fons, 1).fillRoundedRect(x - W / 2, y - H / 2, W, H, 10);
            f.lineStyle(ara ? 3 : 2, ara ? 0xffd34d : vora, 1).strokeRoundedRect(x - W / 2, y - H / 2, W, H, 10);
            add(scene.add.text(x, y, v ? z.nom : '?', estilText(v ? 13 : 20, ara ? '#ffe9a8' : v ? '#f2e6c8' : '#8a7a68', { align: 'center', fontStyle: 'bold', wordWrap: { width: W - 8 } })).setOrigin(0.5));
            add(scene.add.zone(x, y, W, H).setInteractive({ useHandCursor: true }).on('pointerdown', () => explicar(z.id)));
            if (z.id === zObj) {
                const st = add(scene.add.text(x + W / 2 - 4, y - H / 2 + 2, '★', estilText(30, '#ff7a4a', { stroke: '#2a0a04', strokeThickness: 5 })).setOrigin(0.5));
                scene.tweens.add({ targets: st, scale: 1.3, yoyo: true, repeat: -1, duration: 500 });
            }
            if (encarrecs[z.id]) add(scene.add.text(x - W / 2 + 4, y - H / 2 + 2, '!', estilText(24, '#7ab8ff', { fontStyle: 'bold', stroke: '#0a1a2a', strokeThickness: 5 })).setOrigin(0.5));
            if (ara) add(scene.add.text(x, y - H / 2 - 14, 'ETS AQUÍ', estilText(13, '#ffd34d', { fontStyle: 'bold', stroke: '#000000', strokeThickness: 4 })).setOrigin(0.5));
        });
        explicar(actual && per(actual) ? actual : (zObj || 'ZonaPlaca'));

        // Llegenda i recompte
        const ly = baix - 34;
        add(scene.add.rectangle(X0 + 2, baix - 50, X1 - X0 - 4, 48, 0x000000, 0.35).setOrigin(0));
        [['■', '#6ac09a', 'Fora'], ['■', '#d8a868', 'Dins'], ['■', '#a888e8', 'Sota terra'], ['★', '#ff7a4a', 'Objectiu'], ['!', '#7ab8ff', 'Encàrrec'], ['?', '#8a7a68', 'Per explorar']].forEach(([s, col, t], i) => {
            const x = X0 + 18 + i * 112;
            add(scene.add.text(x, ly, s, estilText(18, col, { fontStyle: 'bold' })).setOrigin(0, 0.5));
            add(scene.add.text(x + 20, ly, t, estilText(14, '#c8b898')).setOrigin(0, 0.5));
        });
        add(scene.add.text(X0 + 14, top + 10, `${trobats}/${MAPA.zones.length} llocs · toca un lloc per veure què hi ha`, estilText(15, '#8a7a68', { fontStyle: 'italic' })));
    }
};
