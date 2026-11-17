#!/usr/bin/env python3
"""Passa al codi del joc els canvis fets a mà a docs/TEXTS.md.

    python3 eines/aplica_textos.py            (aplica els canvis i torna a generar docs/TEXTS.md)
    python3 eines/aplica_textos.py --prova    (només diu què canviaria, sense tocar res)

Com funciona: docs/textos_ids.json guarda el text i qui ho diu de cada número tal com és ara al codi. Es llegeix docs/TEXTS.md, es compara cada línia numerada
amb el registre i, per cada text (o personatge) que has canviat, es busca la cadena exacta al fitxer indicat i se substitueix. Després es torna a generar el document.

Només es canvia el que és segur: el text vell ha de sortir una sola vegada al fitxer (o una de molt a prop de la línia anotada). Els textos que el joc construeix
sumant trossos o calculant (els que porten […]) NO es poden canviar així: l'script els avisa i cal fer-ho a mà. No toca l'estructura (no afegeix ni treu frases):
per afegir o treure frases, digues-ho a qui manté el joc.
"""
import os, re, sys, json, subprocess

AQUI = os.path.dirname(os.path.abspath(__file__))
ARREL = os.path.normpath(os.path.join(AQUI, '..'))
sys.path.insert(0, AQUI)
import fer_guio_complet as G

MD = os.path.join(ARREL, 'docs', 'TEXTS.md')
REG = os.path.join(ARREL, 'docs', 'textos_ids.json')
LIT = re.compile(r'"((?:[^"\\]|\\.)*)"|\'((?:[^\'\\]|\\.)*)\'|`((?:[^`\\]|\\.)*)`', re.S)


def escapa(t, q):
    t = t.replace('\\', '\\\\').replace('\n', '\\n')
    return t.replace(q, '\\' + q)


def llegeix_md():
    """{id: (qui, text)} de les línies numerades del document."""
    res = {}
    for l in open(MD, encoding='utf8'):
        m = re.match(r'^\*\*\[(\d+)\]\s*(.*?):\*\*\s?(.*)$', l.rstrip('\n')) or re.match(r'^\*\*\[(\d+)\]\*\*()\s?(.*)$', l.rstrip('\n'))
        if m:
            res[int(m.group(1))] = (m.group(2).strip(), m.group(3).strip())
    return res


def main():
    prova = '--prova' in sys.argv
    reg = json.load(open(REG, encoding='utf8'))
    vell = {}
    for k, v in reg['converses'].items():
        for e in v: vell[e['id']] = e
    nou = llegeix_md()
    canvis = [(i, nou[i]) for i in sorted(nou) if i in vell and (nou[i][0] != (vell[i]['qui'] or '(narrador)') and vell[i]['qui'] != '' or nou[i][1] != vell[i]['text'].replace('\n', ' / ').strip())]
    # (els avisos ★ no tenen «qui»: només es compara el text)
    if not canvis:
        print('Cap canvi a docs/TEXTS.md respecte al joc.')
        return
    fitxers = {}
    fets, fallits = [], []
    for i, (qui_n, text_n) in canvis:
        e = vell[i]
        ruta = os.path.join(ARREL, e['fitxer'])
        src = fitxers.setdefault(e['fitxer'], open(ruta, encoding='utf8').read())
        linia = e['linia'] or 0
        text_v = e['text']
        if text_n != text_v.replace('\n', ' / ').strip():
            if '[…]' in text_v or text_v.startswith('★') and False:
                fallits.append((i, 'text calculat pel joc […]: cal canviar-lo a mà')); continue
            # candidats: la cadena exacta (amb les seves cometes) del text vell, tal com s'escriuria al codi
            vell_cru = text_v.replace(' / ', '\n') if e['fitxer'] == 'js/main.js' else text_v
            nou_cru = text_n.replace(' / ', '\n') if e['fitxer'] == 'js/main.js' else text_n
            trobat = False
            for q in ('"', "'", '`'):
                agulla = q + escapa(vell_cru, q) + q
                if agulla in src:
                    src = src.replace(agulla, q + escapa(nou_cru, q) + q)          # (si la mateixa frase surt repetida, es canvia a tot arreu: és el mateix text)
                    trobat = True
            if not trobat:
                fallits.append((i, "no trobo la frase al codi (potser es construeix sumant trossos o amb un altre escapament)")); continue
            fitxers[e['fitxer']] = src
            fets.append((i, 'text'))
        if qui_n != (e['qui'] or '(narrador)') and e['qui']:
            # personatge: «qui: '...'» al costat del text
            src = fitxers[e['fitxer']]
            patro = re.compile(r"(qui\s*:\s*)(['\"])" + re.escape(e['qui']) + r"\2(\s*,\s*text\s*:)")
            ms = list(patro.finditer(src))
            if not ms:
                fallits.append((i, "no trobo el personatge «%s» al costat del text" % e['qui'])); continue
            if len(ms) > 1 and linia:
                ms.sort(key=lambda m: abs(src[:m.start()].count('\n') + 1 - linia))
            m = ms[0]
            q = m.group(2)
            src = src[:m.start()] + m.group(1) + q + escapa(qui_n, q) + q + m.group(3) + src[m.end():]
            fitxers[e['fitxer']] = src
            fets.append((i, 'personatge'))
    for i, per_que in fallits:
        print(f'  [{i}] NO aplicat: {per_que}')
    for i, que in fets:
        print(f'  [{i}] {que} canviat')
    if prova:
        print('(prova: no s\'ha tocat cap fitxer)')
        return
    if not fets:
        print('No s\'ha pogut aplicar res; docs/TEXTS.md es queda tal com el tens.')
        return
    for f, src in fitxers.items():
        open(os.path.join(ARREL, f), 'w', encoding='utf8').write(src)
    # comprovació de sintaxi
    for f in fitxers:
        if f.endswith('.js'):
            r = subprocess.run(['node', '--check', os.path.join(ARREL, f)], capture_output=True, text=True)
            if r.returncode:
                print('ERROR de sintaxi a', f, '\n', r.stderr[:400]); sys.exit(1)
    if fallits:
        # no es torna a generar el document (esborraria els teus canvis que no s'han pogut aplicar): només s'actualitza el registre dels que sí
        aplicats = {i for i, _ in fets}
        for k, v in reg['converses'].items():
            for e in v:
                if e['id'] in aplicats:
                    q, t = nou[e['id']]
                    e['text'] = t.replace(' / ', '\n') if e['fitxer'] == 'js/main.js' else t
                    if q and e['qui']: e['qui'] = q
        json.dump(reg, open(REG, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
        print('Fet: %d canvis aplicats, %d SENSE aplicar (els teus textos romanen a docs/TEXTS.md; no es regenera el document fins que ho arreglem).' % (len(fets), len(fallits)))
        return
    subprocess.run([sys.executable, os.path.join(AQUI, 'fer_textos.py')])
    print('Fet: %d canvis aplicats.' % len(fets))


if __name__ == '__main__':
    main()
