/**
 * MAPA DEL JOC (es desplega des del menú)
 * Només es dibuixen les pantalles ja visitades (flag visitada_<Zona>) i els camins entre
 * dues pantalles visitades. La resta continua amagada. Les coordenades de 'zones' són d'un llenç antic de 1280x720; es converteixen al llenç vertical amb pos().
 * Les pantalles que encara no existeixen al joc no es poden visitar, així que no apareixen mai.
 */
const MAPA = {
    ample: 100, alt: 44,
    pos(z) { return { x: 56 + (z.x - 150) * 0.64, y: 140 + (z.y - 90) * 1.85 }; },
    zones: [
        // Nord
        { id: 'ZonaCirosa',        nom: 'La Cirosa',                x: 1100, y: 90 },
        { id: 'ZonaCamiCirosa',    nom: 'Camí de la Cirosa',        x: 950,  y: 150 },
        { id: 'ZonaCabanaInt',     nom: 'Dins la cabana',           x: 200,  y: 110 },
        { id: 'ZonaCabana',        nom: 'Cabana de la Jaumeta',     x: 370,  y: 110 },
        { id: 'ZonaBosc',          nom: 'Bosc de Sant Joan',        x: 520,  y: 200 },
        { id: 'ZonaCelles',        nom: 'Cel·les i Til·ler',        x: 800,  y: 210 },
        // Franja de les Runes, el Cementiri i el camí de la Desaparició
        { id: 'ZonaErmitaInt',     nom: 'Dins l\'ermita',           x: 150,  y: 300 },
        { id: 'ZonaErmita',        nom: 'Ermita Desaparició',       x: 330,  y: 300 },
        { id: 'ZonaCami',          nom: 'Camí de la Desaparició',   x: 560,  y: 300 },
        { id: 'ZonaRuines',        nom: 'Les Runes',                x: 800,  y: 300 },
        { id: 'ZonaCementiri',     nom: 'El Cementiri',             x: 1050, y: 300 },
        { id: 'ZonaPingpong',      nom: 'Sala del Ping-pong',       x: 640,  y: 390 },
        { id: 'ZonaEsglesia',      nom: 'Santuari',                 x: 930,  y: 390 },
        { id: 'ZonaEra',           nom: 'L\'Era',                   x: 330,  y: 390 },
        // Fila del poble (oest -> est): Jardí · Hospederia · Taverna · Casa Gran · Plaça · Monestir
        { id: 'ZonaJardi',         nom: 'Jardí pergolat',           x: 250,  y: 470 },
        { id: 'ZonaHospederia',    nom: 'Hospederia',               x: 420,  y: 470 },
        { id: 'ZonaTaverna',       nom: 'La Taverna',               x: 590,  y: 470 },
        { id: 'ZonaCasaGran',      nom: 'Casa Gran i Font',         x: 760,  y: 470 },
        { id: 'ZonaPlaca',         nom: 'Plaça del Santuari',       x: 930,  y: 470 },
        { id: 'ZonaMonestir',      nom: 'El Monestir',              x: 1100, y: 470 },
        { id: 'ZonaCasaGranInt',   nom: 'Casa Gran · Escalinata',   x: 760,  y: 550 },
        { id: 'ZonaCasaCripta',    nom: 'Cripta dels Monjos',       x: 760,  y: 596 },
        { id: 'ZonaCreu',          nom: 'Creu i Bassadòria',        x: 930,  y: 550 },
        // Sud-oest i franja sud
        { id: 'ZonaCamiRov',       nom: 'Camí Rovellonera',         x: 230,  y: 540 },
        { id: 'ZonaRovellonera',   nom: 'Rovellonera',              x: 400,  y: 590 },
        { id: 'ZonaGabriel',       nom: 'Ermita de Sant Gabriel',   x: 400,  y: 640 },
        { id: 'ZonaDipositos',     nom: 'Els Dipòsits',             x: 650,  y: 640 },
        { id: 'ZonaDolmen',        nom: 'El Dolmen',                x: 900,  y: 640 }
    ],
    enllacos: [
        ['ZonaPlaca', 'ZonaCreu'], ['ZonaPlaca', 'ZonaCasaGran'], ['ZonaCasaGran', 'ZonaCasaGranInt'], ['ZonaCasaGranInt', 'ZonaCasaCripta'], ['ZonaPlaca', 'ZonaCasaGranInt'],
        ['ZonaPlaca', 'ZonaEsglesia'], ['ZonaPlaca', 'ZonaMonestir'], ['ZonaPlaca', 'ZonaRuines'],
        ['ZonaRuines', 'ZonaPingpong'], ['ZonaRuines', 'ZonaCami'], ['ZonaCami', 'ZonaErmita'],
        ['ZonaErmita', 'ZonaErmitaInt'], ['ZonaErmita', 'ZonaEra'], ['ZonaEra', 'ZonaJardi'],
        ['ZonaJardi', 'ZonaHospederia'], ['ZonaJardi', 'ZonaCasaGran'],
        ['ZonaRuines', 'ZonaCementiri'], ['ZonaCementiri', 'ZonaMonestir'],
        ['ZonaRuines', 'ZonaCelles'], ['ZonaCelles', 'ZonaBosc'], ['ZonaBosc', 'ZonaCabana'], ['ZonaCabana', 'ZonaCabanaInt'],
        ['ZonaCelles', 'ZonaCamiCirosa'], ['ZonaCamiCirosa', 'ZonaCirosa'],
        ['ZonaEra', 'ZonaCamiRov'], ['ZonaCamiRov', 'ZonaRovellonera'], ['ZonaRovellonera', 'ZonaGabriel'],
        ['ZonaGabriel', 'ZonaDipositos'], ['ZonaDipositos', 'ZonaDolmen']
    ],

    visitada(id) { return Estat.flag('visitada_' + id); },

    // Dibuixa el mapa dins del contenidor; actual = id de la zona on som
    dibuixar(scene, contenidor, actual) {
        const fons = scene.add.rectangle(AMPLE / 2, ALT / 2, 700, 1220, 0x1a120b, 1).setStrokeStyle(4, 0xd4af37);
        const titol = scene.add.text(AMPLE / 2, 70, 'Mapa del Santuari', estilText(28, '#ffd34d', { fontStyle: 'bold' })).setOrigin(0.5);
        contenidor.add([fons, titol]);

        const per = id => MAPA.zones.find(z => z.id === id);
        const g = scene.add.graphics();
        contenidor.add(g);
        g.lineStyle(4, 0x8a7658, 1);
        MAPA.enllacos.forEach(([a, b]) => {
            if (!MAPA.visitada(a) || !MAPA.visitada(b)) return;
            const za = per(a), zb = per(b);
            const pa = MAPA.pos(za), pb = MAPA.pos(zb);
            g.lineBetween(pa.x, pa.y, pb.x, pb.y);
        });

        let visitades = 0;
        MAPA.zones.forEach(z => {
            if (!MAPA.visitada(z.id)) return;
            visitades++;
            const ara = z.id === actual;
            const { x, y } = MAPA.pos(z);
            const caixa = scene.add.rectangle(x, y, MAPA.ample, MAPA.alt, ara ? 0x5a3a1a : 0x2e2216, 1)
                .setStrokeStyle(ara ? 4 : 2, ara ? 0xffd34d : 0xc9b48a);
            const text = scene.add.text(x, y, z.nom, estilText(11, ara ? '#ffd34d' : '#f2e6c8', { align: 'center', wordWrap: { width: MAPA.ample - 8 } })).setOrigin(0.5);
            contenidor.add([caixa, text]);
        });

        const peu = visitades < MAPA.zones.length
            ? 'Els llocs que encara no has trobat continuen amagats.'
            : 'Has trobat tots els llocs!';
        contenidor.add(scene.add.text(AMPLE / 2, ALT - 46, peu + '\n(toca per tornar)', estilText(14, '#a89878', { fontStyle: 'italic' })).setOrigin(0.5));
    }
};
