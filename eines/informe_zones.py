"""Resum de la prova de fum (eines/prova_zones.js): python3 eines/informe_zones.py smoke_fi.json"""
import json, sys, collections
d=json.load(open(sys.argv[1])); res=d['res']
print('ESTAT', d['estat'], '| càrregues', len(res), '| errors', len(d['errors']))
print('\n== ERRORS DE JAVASCRIPT / CONSOLA')
c=collections.Counter((e['zona'],e['tipus'],e['msg']) for e in d['errors'])
for (z,t,m),n in c.items(): print(f'  {z or "(càrrega inicial)"} [{t}] x{n}: {m}')
print('\n== ZONES QUE NO CARREGUEN')
for r in res:
    if r.get('error'): print('  ', r['zona'], r.get('entrada'), r['error'])
print("\n== L'INEU COMENÇA ENCALLAT (dins d'un obstacle)")
for r in res:
    if r.get('encallatAlInici'): print('  ', r['zona'], '/', r.get('entrada'))
print('\n== SORTIDES (destí o entrada que no existeix, o no abastable des d\'aquesta entrada)')
vist=set()
for r in res:
    for s in r.get('sortides',[]):
        clau=(r['zona'], s['a'], s['entrada'])
        if not s['destiExisteix'] or not s['entradaExisteix']:
            if clau not in vist: vist.add(clau); print('  TRENCADA', r['zona'], '->', s['a'], s['entrada'], 'destí' if not s['destiExisteix'] else 'entrada inexistent')
print('\n== SORTIDES NO ABASTABLES des de cap entrada de la zona (excloent les tancades)')
per=collections.defaultdict(lambda: collections.defaultdict(list))
for r in res:
    if r.get('error'): continue
    for s in r.get('sortides',[]): per[r['zona']][(s['a'],s['entrada'])].append(s['abastable'])
for z,m in per.items():
    for k,v in m.items():
        if not any(v): print('  ', z, '->', k)
print("\n== PUNTS D'INTERACCIÓ NO ABASTABLES des de cap entrada (actius ara)")
pp=collections.defaultdict(lambda: collections.defaultdict(list))
for r in res:
    if r.get('error'): continue
    for p in r.get('punts',[]): pp[r['zona']][(p['x'],p['y'])].append(p['abastable'])
for z,m in pp.items():
    for k,v in m.items():
        if not any(v): print('  ', z, k)
print('\n== GRÀFICS QUE FALTEN (Grafics.faltants)')
f=set()
for r in res: f.update(r.get('faltants',[]))
print('  ', sorted(f))
print('\n== ZONES AMB POC ESPAI ABASTABLE')
for r in res:
    if not r.get('error') and r.get('cellesAbastables',999)<150: print('  ', r['zona'], r.get('entrada'), r['cellesAbastables'])
