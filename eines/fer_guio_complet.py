"""
Genera docs/GUIO_COMPLET.md: la ruta pas a pas (escrita a mà a eines/guio_ruta.md) + un annex amb TOTS els diàlegs del joc,
extrets del codi (js/dialegs.js i les escenes de js/zones/), amb les condicions de cada variant:
    python eines/fer_guio_complet.py
Només text (cap imatge). Si canvia un diàleg al codi, torna a executar-lo.
"""
import os, re, glob, collections

ARREL = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
RUTA = os.path.join(ARREL, 'eines', 'guio_ruta.md')
SORTIDA = os.path.join(ARREL, 'docs', 'GUIO_COMPLET.md')

LIT = re.compile(r'"((?:[^"\\]|\\.)*)"|\'((?:[^\'\\]|\\.)*)\'|`((?:[^`\\]|\\.)*)`', re.S)


def desescapa(s):
    return s.replace('\\n', '\n').replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\')


def indent(l):
    return len(l) - len(l.lstrip(' '))


def expressio(t, i):
    """Des de la posició i d'un text, l'expressió fins a la coma o clau de nivell 0 (sense sortir de cadenes)."""
    prof, j, q = 0, i, None
    while j < len(t):
        c = t[j]
        if q:
            if c == '\\': j += 2; continue
            if c == q: q = None
        elif c in '"\'`': q = c
        elif c in '([{': prof += 1
        elif c in ')]}':
            if prof == 0: break
            prof -= 1
        elif c == ',' and prof == 0: break
        j += 1
    return t[i:j]


def talla_ternari(e):
    """(cond, a, b) si l'expressió és «cond ? a : b» a nivell 0; si no, None."""
    prof, q, pos_q = 0, None, None
    for k, c in enumerate(e):
        if q:
            if c == '\\': continue
            if c == q: q = None
            continue
        if c in '"\'`': q = c
        elif c in '([{': prof += 1
        elif c in ')]}': prof -= 1
        elif c == '?' and prof == 0 and pos_q is None and e[k + 1:k + 2] != '.': pos_q = k
        elif c == ':' and prof == 0 and pos_q is not None:
            return e[:pos_q].strip(), e[pos_q + 1:k].strip(), e[k + 1:].strip()
    return None


def netejacond(c):
    c = c.strip()
    c = re.sub(r'E\.flag\([\'"](\w+)[\'"]\)', r'\1', c)
    c = re.sub(r'E\.te\([\'"](\w+)[\'"]\)', r'té \1', c)
    c = re.sub(r'Estat\.flag\([\'"](\w+)[\'"]\)', r'\1', c)
    c = re.sub(r'Estat\.te\([\'"](\w+)[\'"]\)', r'té \1', c)
    c = c.replace('!', 'NO ').replace('&&', ' i ').replace('||', ' o ')
    return re.sub(r'\s+', ' ', c).strip(' ()')


def variants(e):
    """Llista de (condició o '', text) d'una expressió de text (cadenes, concatenacions, ternaris)."""
    e = e.strip()
    t = talla_ternari(e)
    if t:
        cond, a, b = t
        cond = netejacond(cond)
        res = [((cond + (' → ' if cond else '')) + c if c else cond, x) for c, x in variants(a)]
        res += [(('NO ' + cond) + (' → ' + c if c else ''), x) for c, x in variants(b)]
        return res
    trossos = LIT.findall(e)
    if trossos:
        # Si la cadena és només una part (p. ex. text: "abc" + variable), es mostra amb … on hi ha el que es calcula
        s = ''.join(desescapa(a or b or c) for a, b, c in trossos)
        if not re.fullmatch(r'\s*(?:"(?:[^"\\]|\\.)*"|\'(?:[^\'\\]|\\.)*\'|`(?:[^`\\]|\\.)*`)(?:\s*\+\s*(?:"(?:[^"\\]|\\.)*"|\'(?:[^\'\\]|\\.)*\'|`(?:[^`\\]|\\.)*`))*\s*', e):
            s += ' […]'
        return [('', s)]
    if re.match(r'pista(Runna|Actual)\(E\)', e): return [('', '[pista del pas següent de la història: vegeu la Ruta]')]
    return [('', '[text calculat pel joc: ' + re.sub(r'\s+', ' ', e)[:90] + ']')]


def condicions(linies, i):
    """Condicions «if» que envolten la línia i (mirant enrere per sagnat)."""
    cur, res = indent(linies[i]), []
    for j in range(i - 1, -1, -1):
        l = linies[j]
        if not l.strip():
            continue
        if indent(l) < cur:
            s = l.strip()
            m = re.match(r'(?:\}\s*)?(else\s+)?if\s*\((.*)\)\s*\{?\s*(?:return\s*\{)?\s*$', s)
            if m:
                res.append(netejacond(m.group(2)))
            elif re.match(r'\}\s*else\s*\{', s):
                res.append('altrament')
            cur = indent(l)
            if cur <= 4: break
    return list(reversed(res))


def extreu(fitxer, nom_zona):
    t = open(fitxer, encoding='utf8').read()
    linies = t.split('\n')
    # clau «de situació» de cada línia: la darrera línia amb sagnat 4 de la forma «clau: ...» (dialegs.js) o la funció/mètode més a prop (zones)
    claus = []
    clau = '(general)'
    for l in linies:
        m = re.match(r'^ {4}(\w+)\s*:\s*(?:\(?E|\(|\w+\s*=>|\{)', l) or re.match(r'^ {4}(\w+)\s*\(.*\)\s*\{\s*$', l) or re.match(r'^(?:function|const)\s+(\w+)', l)
        if m and not l.strip().startswith('//') and m.group(1) not in ('if', 'for', 'while', 'switch', 'else', 'return', 'catch'): clau = m.group(1)
        claus.append(clau)
    pagines = []
    for i, l in enumerate(linies):
        for m in re.finditer(r'qui\s*:\s*(?:("(?:[^"\\]|\\.)*"|\'(?:[^\'\\]|\\.)*\')|([A-Za-z_]\w*))\s*,\s*text\s*:', l):
            if m.group(1):
                qui = desescapa(m.group(1)[1:-1])
            else:
                qui = m.group(2)     # un nom de variable (A, O...): es busca on es defineix
                for j in range(i, -1, -1):
                    d = re.search(r'\b' + qui + r'\s*=\s*("(?:[^"\\]|\\.)*"|\'(?:[^\'\\]|\\.)*\')', linies[j])
                    if d:
                        qui = desescapa(d.group(1)[1:-1]); break
            pos = sum(len(x) + 1 for x in linies[:i]) + m.end()
            if t[pos:pos + 40].lstrip().startswith('{'):     # text: { Huri: "...", Fram: "..." }[nom]
                bloc = expressio(t, pos + t[pos:].index('{'))
                for k, v in re.findall(r'(\w+)\s*:\s*("(?:[^"\\]|\\.)*")', bloc):
                    pagines.append(dict(fitxer=nom_zona, clau=claus[i], linia=i + 1, qui=k, cond=condicions(linies, i), varcond='', text=desescapa(v[1:-1])))
                continue
            for c, txt in variants(expressio(t, pos)):
                pagines.append(dict(fitxer=nom_zona, clau=claus[i], linia=i + 1, qui=qui, cond=condicions(linies, i), varcond=c, text=txt))
        for m in re.finditer(r'avis\s*:\s*("(?:[^"\\]|\\.)*"|\'(?:[^\'\\]|\\.)*\')', l):
            pagines.append(dict(fitxer=nom_zona, clau=claus[i], linia=i + 1, qui='', cond=condicions(linies, i), varcond='', text='★ ' + desescapa(m.group(1)[1:-1]), avis=True))
    return pagines


def main():
    fonts = [('js/dialegs.js', 'Diàlegs generals')] + [(f.replace('\\', '/'), 'Escena ' + os.path.basename(f)[:-3]) for f in sorted(glob.glob(os.path.join(ARREL, 'js', 'zones', '*.js')))]
    totes = []
    for f, nom in fonts:
        p = os.path.join(ARREL, f) if not os.path.isabs(f) else f
        totes += extreu(p, nom if f.startswith('js/') else nom)
    # agrupa per (fitxer, clau) mantenint l'ordre
    grups = collections.OrderedDict()
    for p in totes:
        grups.setdefault((p['fitxer'], p['clau']), []).append(p)

    out = []
    if os.path.exists(RUTA):
        out.append(open(RUTA, encoding='utf8').read().rstrip() + '\n\n---\n')
    out.append('# ANNEX — Tots els diàlegs del joc\n')
    out.append('Extrets automàticament del codi (`js/dialegs.js` i `js/zones/`). Cada bloc és una conversa; quan una conversa té variants segons el progrés, '
               'es marquen amb *Si …* (nom dels flags i objectes del joc; «té X» = l\'Ineu porta l\'objecte X). Les línies amb ★ són els avisos d\'objectes que s\'obtenen. '
               'Els `[…]` són parts del text que el joc calcula (noms, pistes dinàmiques).\n')
    # índex per personatge
    per_qui = collections.OrderedDict()
    for (f, c), ps in grups.items():
        for p in ps:
            if p['qui']:
                per_qui.setdefault(p['qui'], collections.OrderedDict())[(f, c)] = 1
    out.append('\n## Índex: personatge → converses\n')
    for qui in sorted(per_qui, key=lambda s: s.lower()):
        out.append(f"- **{qui}**: " + ', '.join(f"`{c}`" for (f, c) in per_qui[qui]))
    out.append('')
    ultim_f = None
    for (f, c), ps in grups.items():
        if f != ultim_f:
            out.append(f'\n\n## {f}\n'); ultim_f = f
        out.append(f'\n### {c}\n')
        antic = None
        for p in ps:
            cond = list(p['cond'])
            if p['varcond']: cond.append(p['varcond'])
            marca = ' ; '.join(cond)
            if marca != antic:
                out.append(f'\n*Si: {marca}*\n' if marca else ('\n*Altrament (per defecte):*\n' if antic else '\n'))
                antic = marca
            if p.get('avis'):
                out.append(p['text'] + '\n')
            else:
                out.append(f"**{p['qui'] or '(narrador)'}:** {p['text']}\n")
    # El pròleg (quadres il·lustrats de js/main.js) va al començament de l'annex
    mainjs = open(os.path.join(ARREL, 'js', 'main.js'), encoding='utf8').read()
    quadres = re.findall(r'^\s*\{ text: ("(?:[^"\\]|\\.)*"),\s*dibuix:', mainjs, re.M)
    if quadres:
        pos = out.index('\n## Índex: personatge → converses\n')
        out.insert(pos, '\n## Pròleg «Tres nits de boira» (cinc quadres, `js/main.js`)\n\n' + '\n\n'.join(f'**Quadre {n + 1}.** ' + desescapa(q[1:-1]).replace('\n', ' / ') for n, q in enumerate(quadres)) + '\n')
    open(SORTIDA, 'w', encoding='utf8').write('\n'.join(out))
    print('fet', SORTIDA, len(totes), 'línies de diàleg,', len(grups), 'converses')


if __name__ == '__main__':
    main()
