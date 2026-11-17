#!/usr/bin/env python3
"""Genera docs/TEXTS.md: TOTES les frases del joc amb qui les diu, més o menys en ordre cronològic i NUMERADES ([1], [2]...), per llegir-les i corregir-les
(«al text 45 canvia tal cosa»).

    python3 eines/fer_textos.py

Els números són ESTABLES: es guarden a docs/textos_ids.json (número -> fitxer, conversa, qui, text). En tornar a generar el document, cada frase conserva el seu
número encara que se'n corregeixi el text o se'n moguin d'altres; les frases noves reben el número següent i les esborrades queden retirades al registre.
Cal tornar-lo a executar (i desar docs/TEXTS.md i docs/textos_ids.json) cada cop que canvia qualsevol text del joc.

Extreu del codi amb el mateix extractor que art/arxiu/docs/GUIO_COMPLET.md (eines/fer_guio_complet.py): js/dialegs.js, js/zones/*.js, js/musica.js, js/zona_base.js, js/estels.js, js/ui.js,
més els pensaments curts de l'Ineu (ineuDiu), el pròleg (js/main.js) i els crèdits no (només text de joc).
"""
import os, re, sys, glob, json, collections, difflib

AQUI = os.path.dirname(os.path.abspath(__file__))
ARREL = os.path.join(AQUI, '..')
sys.path.insert(0, AQUI)
import fer_guio_complet as G            # (l'extractor de diàlegs)

SORTIDA = os.path.join(ARREL, 'docs', 'TEXTS.md')
REGISTRE = os.path.join(ARREL, 'docs', 'textos_ids.json')

# ---------------------------------------------------------------------------------------------------------------------------------------------------------
# ORDRE CRONOLÒGIC (aproximat, segons la ruta de js/progres.js). Cada secció: títol + converses (clau de la conversa; «fitxer:clau» per concretar si la clau es repeteix).
# Les converses que no surten aquí van a «Altres» al final (el programa les avisa per la consola).
# ---------------------------------------------------------------------------------------------------------------------------------------------------------
SECCIONS = [
    ('Pròleg «Tres nits de boira»', ['proleg']),
    ('Inici: el Monestir i la Plaça', ['despertarCaigut', 'zones/monestir:enEntrar', 'zones/monestir:construir', 'pareJorda', 'cartellPlaca', 'germaAldreu', 'creu', 'avisRosansa']),
    ('El Santuari: la Pianista i els cants', ['pianista', 'completarLliço', 'pareDaimiel', 'encarrecDaimiel', 'faristolOratori', 'pedraEscolta', 'pedraSecretaOberta', 'cofreTresor', 'sagrari', 'zones/esglesia:construir']),
    ('La Bassadòria (el Cant de l\'Aurora)', ['bassadoria', 'zones/bassadoria:construir', 'bassadoriaNeta']),
    ('El bosc de Sant Joan: la Font, la Joaneta i l\'Alzina Buida', ['fontSJ', 'joaneta', 'alzinaBuida', 'cartellBosc', 'cofreCabanaCami', 'zones/nord:construir', 'prunera']),
    ('El Gran Til·ler, la Cirosa i els pastors', ['boiraTiller', 'tiller', 'branca', 'arrelsTiller', 'cartellCirosa', 'pastorA', 'pastorB', 'pastorVell', 'pastor_vell', 'pastorsConvencuts',
                                                  'zones/cirosa:construir', 'zones/cirosa:masiaTaula', 'zones/cirosa:masiaLlibre', 'zones/cirosa:masiaEsquelles', 'aldreuPastor', 'aldreuDerrotat',
                                                  'tillerSoparIntro', 'tillerSoparFalta', 'tillerSoparPreparat', 'tillerSoparRitual']),
    ('Les Cel·les: la Meus, el senyor Llaminer, les Venerables i la Carry', ['zones/cela:construir', 'meus', 'molner', 'consellVenerables', 'premiMonja', 'carry', 'pallofa', 'llac']),
    ('La Taverna: l\'Eve, el senyor Buidor i l\'Iscu', ['zones/taverna:construir', 'zones/taverna:portaTaverna', 'zones/taverna:eve', 'eve', 'senyorBudo', 'iscu']),
    ('Acte 2: el Celler i en Jusef', ['cartellRuinesPingpong', 'cartellCeller', 'julius', 'pomers', 'jusef', 'jusefGuanyat', 'jusefPerdut']),
    ('Acte 2: les Runes, l\'ombra del monjo i el Saber', ['ruines', 'zona_base:pedraMobil', 'ombraMonjo', 'benedicioMonjo', 'pareAlcovi', 'zones/cementiri:construir', 'zones/cementiri:alAtacar', 'creuCementiri', 'lapida', 'tombaMonjos']),
    ('Acte 2: l\'ermita de la Desaparició i la clau del sagrari', ['cartellCami', 'sortidaErmita', 'columna', 'creuDesaparicio', 'taulaPedra', 'altarErmita', 'cofreAltar', 'zones/oest:construir']),
    ('Acte 2: l\'Era, el Galf i el telescopi', ['cartellEra', 'galf', 'cofreGabriel', 'telescopiMon', 'estelDiposit', 'cotxer']),
    ('Acte 2: el Dolmen i Runna', ['estels:completarEstels', 'boiraDolmen', 'dolmenBaix', 'placaDolmen']),
    ('El pi dels tres cants i la Nena de les Trenes', ['zones/bosc_pi:piOest', 'zones/bosc_pi:piPlaca', 'zones/bosc_pi:piTresCants', 'zones/bosc_pi:piHistoria', 'nenaTrenes', 'nenaEpileg', 'mandu']),
    ('Acte 3: els Guants de Poder i la roda de carruatge', ['germa_franci', 'zones/nord:germaFranci']),
    ('Acte 3: el passadís secret, la cambra i la maneta (en Jorgi)', ['zones/casa:georgiCaseta', 'llibreCambra', 'cofreManeta', 'zones/casa:golfesRellotge', 'zones/casa:golfesNota', 'zones/casa:golfesReparat']),
    ('Acte 3: la Casa Gran, la cripta i l\'Home del Raïm', ['portaReixa', 'reixaDins', 'homeRaim', 'zones/casa:homeRaimInt', 'zones/casa:raimDesperta', 'zones/casa:raimSenseArma', 'zones/casa:raimDerrotat',
                                                            'zones/casa:raimEstatuaFinal', 'zones/casa:cofreCripta', 'zones/casa:puzleRaim', 'zones/casa:mecanismePorta', 'zones/casa_gran:construir']),
    ('Acte 3: l\'Hostatgeria, les sacerdotesses i la llosa del jardí', ['isilderBase', 'isilderRunna', 'isilder', 'llosaJardi', 'zones/jardi:construir', 'rosansa', 'avisLlosa', 'hostatgeria', 'taulaRefetor',
                                                                         'dolora', 'pilaria', 'carmelia', 'cofreMonges']),
    ('La porta de ferro i les Gírgoles', ['zones/taverna:portaSoterrani', 'zones/taverna:portaFerro', 'cartellGirgoles', 'zones/gabia:girgolesInscripcio', 'zones/gabia:tornRastell']),
    ('La Gàbia i l\'Ocellaire', ['zones/gabia:pontGabia', 'zones/gabia:gabiaGran', 'zones/gabia:aldreuGabia', 'zones/gabia:nenGabia', 'zones/gabia:actualitzar', 'zones/gabia:enMelodia',
                                'zones/gabia:iniciarCombatFinal', 'zones/gabia:ocellaireDerrotat', 'zones/gabia:obrirGabia', 'zones/gabia:finalGabia']),
    ('Epíleg: després del final', ['zones/esglesia:ferEpileg', 'zones/gabia:gentEpileg']),
]
# ---------------------------------------------------------------------------------------------------------------------------------------------------------
# NOMS DE FLAGS I OBJECTES -> català entenedor (per a les línies «Si: ...»). La frase afirmativa comença per un verb («ha ...», «és ...», «sap ...», «porta ...»):
# la negativa s'obté posant-hi «encara no» davant. Si surt un nom que no és aquí, es mostra tal qual i el programa t'ho avisa.
# ---------------------------------------------------------------------------------------------------------------------------------------------------------
FLAGS = {
    'clauerNovici': "ha parlat per primer cop amb el Pare Jordà (l'encàrrec inicial)",
    'cantAurora': "sap el Cant de l'Aurora", 'cantPedres': "sap el Cant de Vespres (el de les pedres)", 'cantMiracle': "sap el Cant del Miracle",
    'aurora': "toca el Cant de l'Aurora", 'pedres': "toca el Cant de Vespres", 'miracle': "toca el Cant del Miracle",
    'bassadoriaNeta': "ha netejat la Bassadòria", 'camiCirosaObert': "ha obert el camí de la Cirosa",
    'soparObert': "ha sentit parlar del sopar del Til·ler", 'soparFet': "ha fet el sopar del Til·ler", 'pastorsConvencuts': "ha convençut els pastors de la Cirosa",
    'pastorVencut': "ha vençut el Pastor de Boira", 'parlatTiler': "ha parlat amb el Gran Til·ler", 'escudella': "té l'escudella de la Meus", 'floresIsilder': "té les flors de l'Isílder",
    'fullaTiler': "té la fulla del Til·ler", 'benediccio': "ha rebut la benedicció del prior", 'benedicioMonjo': "ha rebut la benedicció de l'ombra del monjo",
    'saber': "ha rebut el Saber (les paraules del monjo)", 'alcoviLlegit': "ha fet llegir els pergamins al Pare Alcoví", 'alcoviPlacaDita': "ha sentit del Pare Alcoví què diu la placa del Dolmen",
    'ombraDemanaCant': "ha sentit que l'ombra del monjo demana un cant", 'perOmbra': "parla amb l'ombra del monjo",
    'runna': "ha aconseguit Runna", 'cantAurora ': "", 'relTretes': "ha tret les relíquies de la Casa Gran", 'tombaSegellada': "ha trobat segellada la tomba de l'Ocellaire", 'tombaLlegida': "ha llegit la tomba dels monjos",
    'garfBancSegut': "s'ha assegut al banc del Galf", 'telescopi': "té el telescopi", 'cristallGel': "ha trobat el cristall de gel", 'estelsFets': "ha vist tots els estels", 'estelLlorenc': "ha recollit l'estel d'en Llorenç",
    'rellotgeExplicat': "ha sentit l'explicació del rellotge del Santuari", 'rellotgeReparat': "ha reparat el rellotge de la torre", 'portaCampanarOberta': "ha obert la porta del campanar",
    'clau_campanar': "porta la clau del campanar", 'senseClauCampanar(E': "encara no té la clau del campanar", 'carryParlat': "ha parlat amb la Carry",
    'premiDolora': "ha rebut el premi de la Dolora", 'premiPilaria': "ha rebut el premi de la Pilària", 'premiCarmelia': "ha rebut el premi de la Carmèlia",
    'missatgeDesxifrat': "ha desxifrat el missatge de les dotze columnes", 'totes': "ha llegit totes les columnes", 'clau_sagrari': "porta la clau del sagrari", 'sagrari': "ha obert el sagrari",
    'guants': "porta els Guants de Poder", 'maneta': "porta la maneta", 'georgiManeta': "ha parlat amb en Jorgi de la maneta", 'esquelles': "porta les esquelles", 'esquellesVistes': "ha vist les esquelles",
    'basto_tiller': "porta el bastó del Til·ler", 'carta_cortiner': "porta la carta del Cortiner", 'piObert': "ha obert el pi dels tres cants", 'placaDolmen': "ha llegit la placa del Dolmen",
    'llosaOberta': "ha obert la llosa del jardí", 'llavorLluna': "porta la llavor de lluna", 'isilderSap': "ha avisat l'Isílder", 'mongesTrobades': "ha trobat les sacerdotesses",
    'manduNinaTrencada': "s'ha trencat la nina de la Mandu", 'nenaVista': "ha vist la Nena de les Trenes", 'joanetaVista': "ha vist la Joaneta", 'iscuTrobat': "ha trobat l'Iscu", 'eveParlat': "ha parlat amb l'Eve",
    'epilegFet': "ha vist l'epíleg", 'carruatgeObert': "ha obert el carruatge del Follet", 'ocellaireVencut': "ha vençut l'Ocellaire", 'pontGabia': "ha creuat el pont de la Gàbia",
    'bastoObtingut': "porta el bastó", 'florsCreu': "ha deixat flors a la creu", 'raimVolantVist': "ha vist el volant del Raïm", 'botaAlcada': "ha fet servir la bota d'alçada", 'pallofa': "porta l'encàrrec del Pallofa",
    'ram': "porta el ram", 'aigua_sj': "porta l'aigua de Sant Joan", 'abandonat': "ha abandonat la partida de ping-pong", 'encarrec': "té un encàrrec del Pare Nadiel", 'parlatDaimiel': "ha parlat amb el Pare Nadiel",
    'herbes': "té les herbes de Sant Joan",
}
OBJECTES = {'runna': "porta l'espasa Runna", 'maneta': 'porta la maneta', 'guants': 'porta els Guants de Poder', 'ram': 'porta el ram', 'aigua_sj': "porta l'aigua de Sant Joan", 'llavorLluna': 'porta la llavor de lluna',
            'basto_tiller': 'porta el bastó del Til·ler', 'carta_cortiner': 'porta la carta del Cortiner', 'clau_sagrari': 'porta la clau del sagrari', 'clau_campanar': 'porta la clau del campanar',
            'esquelles': 'porta les esquelles', 'telescopi': 'porta el telescopi', 'pallofa': "porta l'encàrrec del Pallofa", 'cristall_gel': 'porta el cristall de gel', 'llanterna': "porta el Llum d'en Mamet"}
CONNECTORS = {'i': 'i', 'o': 'o'}
STOP = ('combatActiu', 'combatIniciat', 'avisBoira', 'faltaRunna', 'pas', 'ui', 'now', 'conegudes', 'f1', 'f2', 'gestionada', 'mogut', 'primera', 'avis', 'n', 'nom', 'id', 'aviat', 'portats', 'totsPlacats', 'encarrec', 'abandonat', 'ineu', 'hi', 'si', 'que')           # variables internes del programa: la condició es resumeix com a «calculada»
NOS_CONEGUTS = set()


def humanitza(marca):
    """Converteix la condició «NO x i té y» en català entenedor."""
    if not marca or marca.startswith('altrament'):
        return marca
    parts = []
    for tros in marca.split(' ; '):
        tros = tros.strip()
        tros = re.sub(r'//.*$', '', tros).strip()
        sub = []
        # la fletxa → separa condicions encadenades
        for peça in re.split(r'\s*→\s*', tros):
            peça = peça.strip(' ){')
            # qualsevol cosa que no sigui «NO / té / noms / i / o» és codi del programa
            if re.search(r"[=<>.\[\]'+*/%]|\bthis\b|\bnow\b|\blength\b", peça):
                sub.append('(depèn d\'un càlcul del joc)')
                continue
            if any(re.search(r'\b' + re.escape(z) + r'\b', peça) for z in STOP):          # variables internes del programa
                sub.append("(depèn d'un càlcul del joc)")
                continue
            toks = re.findall(r"NO |té |[A-Za-z_][A-Za-z_0-9]*\(?E?|\)|\(", peça)
            sortida = []
            neg = False; te = False
            for t in toks:
                if t == 'NO ': neg = True; continue
                if t == 'té ': te = True; continue
                if t in ('(', ')'): continue
                if t in CONNECTORS and not neg and not te:
                    sortida.append(CONNECTORS[t]); continue
                nom = t.strip()
                if te and nom in OBJECTES and nom not in FLAGS:
                    sortida.append(('encara no ' + OBJECTES[nom]) if neg else OBJECTES[nom]); neg = False; te = False; continue
                if nom in FLAGS and FLAGS[nom]:
                    f = FLAGS[nom]
                    if te:                                   # «té X» (objecte)
                        f = OBJECTES.get(nom, 'porta ' + nom)
                    sortida.append(('encara no ' + f) if neg else f)
                else:
                    NOS_CONEGUTS.add(nom)
                    sortida.append(('NO ' if neg else '') + ('té ' if te else '') + nom)
                neg = False; te = False
            sub.append(' '.join(sortida).replace(' i ', ' i ').strip())
        parts.append(' → '.join(x for x in sub if x))
    return ' ; '.join(x for x in parts if x)


SECCIO_ALTRES = 'Altres (encara sense classificar)'
SECCIO_PENSAMENTS = 'Pensaments i avisos curts de l\'Ineu (ineuDiu)'
SECCIO_PROLEG = SECCIONS[0][0]

FONTS = [('js/dialegs.js', 'dialegs')] + [(os.path.relpath(f, ARREL).replace('\\', '/'), 'zones/' + os.path.basename(f)[:-3]) for f in sorted(glob.glob(os.path.join(ARREL, 'js', 'zones', '*.js')))] + \
        [('js/musica.js', 'musica'), ('js/zona_base.js', 'zona_base'), ('js/estels.js', 'estels')]


def llegeix_fonts():
    """Llista de textos: dict(grup=(etiqueta_fitxer, clau), fitxer, linia, qui, cond, text, avis, pensament)."""
    tots = []
    for f, etiqueta in FONTS:
        ruta = os.path.join(ARREL, f)
        if not os.path.exists(ruta):
            continue
        for p in G.extreu(ruta, etiqueta):
            if etiqueta == 'zona_base' and p['clau'] == 'ineuDiu': continue          # (la funció auxiliar, no un text del joc)
            p['grup'] = (etiqueta, p['clau']); p['ruta'] = f
            tots.append(p)
    # Pensaments i avisos curts de l'Ineu: ineuDiu("...")
    for f, etiqueta in FONTS:
        ruta = os.path.join(ARREL, f)
        if not os.path.exists(ruta):
            continue
        t = open(ruta, encoding='utf8').read()
        linies = t.split('\n')
        clau = '(general)'
        claus = []
        for l in linies:
            m = re.match(r'^ {4}(\w+)\s*:\s*(?:\(?E|\(|\w+\s*=>|\{)', l) or re.match(r'^ {4}(\w+)\s*\(.*\)\s*\{\s*$', l) or re.match(r'^(?:function|const)\s+(\w+)', l)
            if m and not l.strip().startswith('//') and m.group(1) not in ('if', 'for', 'while', 'switch', 'else', 'return', 'catch'): clau = m.group(1)
            claus.append(clau)
        for i, l in enumerate(linies):
            for m in re.finditer(r'ineuDiu\(\s*', l):
                pos = sum(len(x) + 1 for x in linies[:i]) + m.end()
                for c, txt in G.variants(G.expressio(t, pos)):
                    tots.append(dict(grup=(etiqueta, 'ineuDiu·' + claus[i]), clau='ineuDiu·' + claus[i], fitxer=etiqueta, ruta=f, linia=i + 1, qui='Ineu', cond=G.condicions(linies, i),
                                     varcond=c, text=txt, pensament=True))
    # Pròleg (js/main.js): cinc quadres
    main = open(os.path.join(ARREL, 'js', 'main.js'), encoding='utf8').read()
    for n, q in enumerate(re.findall(r'^\s*\{ text: ("(?:[^"\\]|\\.)*"),\s*dibuix:', main, re.M)):
        tots.append(dict(grup=('main', 'proleg'), clau='proleg', fitxer='main', ruta='js/main.js', linia=0, qui='(narrador)', cond=[], varcond='', text=G.desescapa(q[1:-1]).replace('\n', ' / ')))
    return tots


def seccio_de(grup, pensament):
    etiqueta, clau = grup
    if pensament:
        return SECCIO_PENSAMENTS
    for titol, claus in SECCIONS:
        for k in claus:
            if ':' in k:
                f, c = k.split(':', 1)
                if f == etiqueta and c == clau: return titol
            elif k == clau and etiqueta != 'x':
                return titol
    return SECCIO_ALTRES


def firma(p):
    return (p['qui'], p['text'])


def assigna_ids(grups):
    """grups: OrderedDict (etiqueta, clau) -> [textos]. Manté els números del registre; retorna (registre nou, ids per cada text)."""
    reg = json.load(open(REGISTRE, encoding='utf8')) if os.path.exists(REGISTRE) else {'seguent': 1, 'converses': {}, 'retirats': {}}
    antic = reg['converses']
    nou = {}
    seg = reg['seguent']
    consumit = set()

    def clau_g(g): return g[0] + '::' + g[1]

    # 1) converses amb el mateix nom
    pendents = []
    for g, ps in grups.items():
        k = clau_g(g)
        if k in antic:
            consumit.add(k)
            nou[k] = alinea(antic[k], ps, reg)
        else:
            pendents.append((g, ps))
    # 2) converses de nom nou: si s'assemblen molt a una d'antiga que ja no hi és (canvi de nom de la conversa), n'agafa els números
    lliures = {k: v for k, v in antic.items() if k not in consumit}
    for g, ps in pendents:
        millor, mr = None, 0.0
        sf = set(firma(p) for p in ps)
        for k, v in lliures.items():
            so = set((e['qui'], e['text']) for e in v)
            if not so: continue
            r = len(sf & so) / max(len(sf), len(so))
            if r > mr: millor, mr = k, r
        if millor and mr >= 0.5:
            nou[clau_g(g)] = alinea(lliures.pop(millor), ps, reg)
        else:
            nou[clau_g(g)] = alinea([], ps, reg)
    # retirats: línies de converses antigues que ja no hi són
    for k, v in lliures.items():
        for e in v:
            reg['retirats'][str(e['id'])] = dict(conversa=k, qui=e['qui'], text=e['text'])
    # (els números de línies retirades dins d'una conversa viva ja s'han anotat a alinea)
    reg['converses'] = nou
    return reg


def alinea(vell, ps, reg):
    """Llista d'entrades {id, qui, text, fitxer, linia} per als textos ps, reutilitzant els ids de la llista vella (alineació per diferències)."""
    a = [(e['qui'], e['text']) for e in vell]
    b = [firma(p) for p in ps]
    ids = [None] * len(ps)
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == 'equal':
            for k in range(i2 - i1): ids[j1 + k] = vell[i1 + k]['id']
        elif op == 'replace':
            vell_b = list(range(i1, i2)); nou_b = list(range(j1, j2))
            if len(vell_b) == len(nou_b):
                # mateix nombre de frases: correcció de textos, es conserva el número de cada una (en ordre)
                for k in range(len(vell_b)): ids[nou_b[k]] = vell[vell_b[k]]['id']
            else:
                # nombre diferent (s'ha afegit o tret alguna frase a la vegada que se'n corregien d'altres): s'aparella cada frase vella amb la nova més semblant, en ordre
                usats = set(); darrer = -1
                for iv in vell_b:
                    millor, mr = None, 0.0
                    for jn in nou_b:
                        if jn in usats or jn <= darrer: continue
                        r = difflib.SequenceMatcher(None, a[iv][1], b[jn][1]).ratio()
                        if r > mr: millor, mr = jn, r
                    if millor is not None and mr >= 0.45:
                        ids[millor] = vell[iv]['id']; usats.add(millor); darrer = millor
                    else:
                        e = vell[iv]; reg['retirats'][str(e['id'])] = dict(conversa='', qui=e['qui'], text=e['text'])
        elif op == 'delete':
            for k in range(i1, i2):
                e = vell[k]; reg['retirats'][str(e['id'])] = dict(conversa='', qui=e['qui'], text=e['text'])
    res = []
    for j, p in enumerate(ps):
        if ids[j] is None:
            ids[j] = reg['seguent']; reg['seguent'] += 1
        res.append(dict(id=ids[j], qui=p['qui'], text=p['text'], fitxer=p['ruta'], linia=p['linia']))
    return res


def main():
    tots = llegeix_fonts()
    grups = collections.OrderedDict()
    for p in tots:
        grups.setdefault(p['grup'], []).append(p)
    # Estructura per secció
    seccions = collections.OrderedDict((t, []) for t, _ in SECCIONS)
    seccions[SECCIO_PENSAMENTS] = []; seccions[SECCIO_ALTRES] = []
    for g, ps in grups.items():
        seccions[seccio_de(g, any(p.get('pensament') for p in ps))].append((g, ps))
    # dins de cada secció, en l'ordre de la llista de SECCIONS (per respectar l'ordre cronològic escrit a mà)
    ordre = {}
    for titol, claus in SECCIONS:
        for n, k in enumerate(claus):
            ordre[(titol, k)] = n

    def pes(titol, g):
        etiqueta, clau = g
        for k in (etiqueta + ':' + clau, clau):
            if (titol, k) in ordre: return ordre[(titol, k)]
        return 9999
    # els números nous es donen en l'ordre del document (la primera vegada, doncs, van de l'1 cap amunt en ordre cronològic)
    ordenats = collections.OrderedDict()
    for titol, llista in seccions.items():
        seccions[titol] = sorted(llista, key=lambda x: pes(titol, x[0]))
        for g, ps in seccions[titol]: ordenats[g] = ps
    reg = assigna_ids(ordenats)
    out = []
    out.append('# Textos del joc (numerats)\n')
    out.append('Tot el que diuen els personatges, en ordre aproximadament cronològic, amb el **número** de cada frase entre claudàtors: per corregir, digues «al text 45 canvia ...».\n')
    out.append('- Els números són **estables**: una frase conserva el seu número encara que se\'n corregeixi el text; les noves reben el número següent; les esborrades desapareixen d\'aquí (queden al registre `docs/textos_ids.json`).')
    out.append('- *Si: ...* indica en quin moment de la partida es diu una variant (en català; «(depèn d\'un càlcul del joc)» vol dir que la condició la decideix el programa i no es pot resumir). Els `[…]` són parts del text que el joc calcula.')
    out.append('- Les línies amb ★ són els avisos d\'objectes que s\'obtenen. Aquest document es genera amb `python3 eines/fer_textos.py` (vegeu `CLAUDE.md`).\n')
    total = 0
    for titol, llista in seccions.items():
        if not llista: continue
        out.append(f'\n---\n\n## {titol}\n')
        for g, ps in llista:
            k = g[0] + '::' + g[1]
            entrades = reg['converses'][k]
            f0 = ps[0]['ruta']; l0 = ps[0]['linia']
            nom = g[1].replace('ineuDiu·', 'pensament a ')
            out.append(f'\n### {nom}  <sub>({f0}{":" + str(l0) if l0 else ""})</sub>\n')
            antic = None
            for p, e in zip(ps, entrades):
                cond = list(p['cond'])
                if p['varcond']: cond.append(p['varcond'])
                marca = humanitza(' ; '.join(cond))
                if marca != antic:
                    out.append(f'\n*Si: {marca}*\n' if marca else ('\n*Altrament (per defecte):*\n' if antic else '\n'))
                    antic = marca
                qui = p['qui'] or '(narrador)'
                text = p['text'].replace('\n', ' / ')
                if p.get('avis'):
                    out.append(f"**[{e['id']}]** {text}\n")
                else:
                    out.append(f"**[{e['id']}] {qui}:** {text}\n")
                total += 1
    text_final = re.sub(r'\n{3,}', '\n\n', '\n'.join(out))
    open(SORTIDA, 'w', encoding='utf8').write(text_final)
    json.dump(reg, open(REGISTRE, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    sense = [g for g in grups if seccio_de(g, any(p.get('pensament') for p in grups[g])) == SECCIO_ALTRES]
    print('fet', SORTIDA, total, 'textos,', len(grups), 'converses; següent número:', reg['seguent'])
    if NOS_CONEGUTS:
        print('Noms de flags sense traducció (afegeix-los a FLAGS):', ', '.join(sorted(NOS_CONEGUTS)))
    if sense:
        print('Converses sense classificar (afegeix-les a SECCIONS):', ', '.join(f'{a}:{c}' for a, c in sense))


if __name__ == '__main__':
    main()
