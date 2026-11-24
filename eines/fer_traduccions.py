#!/usr/bin/env python3
"""Genera les taules de traducció que carrega el joc (js/textos/<idioma>.js) a partir de docs/traduccions/<idioma>.json.

    python3 eines/fer_traduccions.py                 (genera es, fr i en i diu quants textos falten de cada idioma)
    python3 eines/fer_traduccions.py --pendents es   (escriu docs/traduccions/pendents_es.md: els textos que encara no tenen traducció, amb el número i qui ho diu)

docs/traduccions/<idioma>.json:
    {
      "textos":     { "1": "traducció del text [1] de docs/TEXTS.md", ... },     <- per NÚMERO (els de docs/textos_ids.json, que són estables)
      "interficie": { "Nova partida": "Nueva partida", "Has obtingut {0}!": "...", ... }   <- textos del menú, noms, avisos... per text en català
    }
El joc tradueix buscant el text català exacte (js/idioma.js); per això la taula final és «text català -> traducció». Si es corregeix un text català
a TEXTS.md, la traducció del mateix número continua valent (però potser cal revisar-la: l'script avisa de les traduccions de textos que han canviat).
"""
import os, re, sys, json, hashlib

AQUI = os.path.dirname(os.path.abspath(__file__))
ARREL = os.path.normpath(os.path.join(AQUI, '..'))
REG = os.path.join(ARREL, 'docs', 'textos_ids.json')
DIR = os.path.join(ARREL, 'docs', 'traduccions')
SORT = os.path.join(ARREL, 'js', 'textos')
IDIOMES = ['es', 'fr', 'en']
NOMS = {'es': 'castellà', 'fr': 'francès', 'en': 'anglès'}


def registre():
    reg = json.load(open(REG, encoding='utf8'))
    return {e['id']: e for v in reg['converses'].values() for e in v}


def empremta(t):
    return hashlib.md5(t.encode('utf8')).hexdigest()[:8]


def carrega(lang):
    ruta = os.path.join(DIR, lang + '.json')
    if not os.path.exists(ruta):
        return {'textos': {}, 'interficie': {}, 'origen': {}}
    d = json.load(open(ruta, encoding='utf8'))
    d.setdefault('textos', {}); d.setdefault('interficie', {}); d.setdefault('origen', {})
    return d


def genera(lang, reg):
    d = carrega(lang)
    taula, canviats = {}, []
    for k, tr in d['textos'].items():
        e = reg.get(int(k))
        if not e or not tr:
            continue
        ca = e['text']
        if '[…]' in ca:
            continue          # text calculat: va a «interficie» com a patró amb {0}
        if e['fitxer'] == 'js/main.js':          # (el pròleg: al registre els salts de línia són « / »; al joc, \n)
            taula[ca.replace(' / ', '\n')] = tr.replace(' / ', '\n')
        else:
            taula[ca] = tr
        # «origen» guarda l'empremta del text català que es va traduir: si el català ha canviat, cal revisar la traducció
        o = d['origen'].get(k)
        if o and o != empremta(ca):
            canviats.append(int(k))
    for ca, tr in d['interficie'].items():
        if tr:
            taula[ca] = tr
    os.makedirs(SORT, exist_ok=True)
    with open(os.path.join(SORT, lang + '.js'), 'w', encoding='utf8') as f:
        f.write('// GENERAT per eines/fer_traduccions.py a partir de docs/traduccions/%s.json: no l\'editis a mà.\n' % lang)
        f.write('TRADUCCIONS.%s = ' % lang)
        json.dump(taula, f, ensure_ascii=False, indent=0)
        f.write(';\n')
    falten = [i for i, e in sorted(reg.items()) if '[…]' not in e['text'] and not d['textos'].get(str(i))]
    return d, falten, canviats


def pendents(lang, reg):
    d = carrega(lang)
    linies = ['# Textos pendents de traduir al %s\n' % NOMS.get(lang, lang),
              'Cada línia: el número (el de docs/TEXTS.md), qui ho diu i el text en català. La traducció va a docs/traduccions/%s.json, a "textos", amb el mateix número.\n' % lang]
    for i, e in sorted(reg.items()):
        if '[…]' in e['text'] or d['textos'].get(str(i)):
            continue
        linies.append('**[%d] %s:** %s\n' % (i, e['qui'] or '', e['text'].replace('\n', ' / ')))
    ruta = os.path.join(DIR, 'pendents_%s.md' % lang)
    open(ruta, 'w', encoding='utf8').write('\n'.join(linies))
    print('Escrit', os.path.relpath(ruta, ARREL), '(%d textos)' % (len(linies) - 2))


def main():
    reg = registre()
    if '--pendents' in sys.argv:
        pendents(sys.argv[sys.argv.index('--pendents') + 1], reg)
        return
    # (marca l'origen dels textos traduïts que encara no en tenen, per poder detectar canvis del català més endavant)
    for lang in IDIOMES:
        d, falten, canviats = genera(lang, reg)
        nou = False
        for k in d['textos']:
            if k not in d['origen'] and int(k) in reg:
                d['origen'][k] = empremta(reg[int(k)]['text']); nou = True
        if nou:
            json.dump(d, open(os.path.join(DIR, lang + '.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
        total = len([1 for e in reg.values() if '[…]' not in e['text']])
        print('%s: %d de %d textos traduïts, %d textos de la interfície%s' % (
            lang, total - len(falten), total, len(d['interficie']),
            ('; REVISAR (el català ha canviat): ' + ', '.join(map(str, canviats))) if canviats else ''))


if __name__ == '__main__':
    main()
