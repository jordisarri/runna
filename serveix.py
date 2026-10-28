"""Servidor local per provar el joc: python serveix.py  ->  http://localhost:8000/
(sense memòria cau, perquè els canvis es vegin sempre en recarregar)
També deixa que eines/ajust_arma.html desi la taula, la mida i els ajustos fins de l'arma directament a js/atac_arma.js."""
import http.server, socketserver, json, os, re

ARREL = os.path.dirname(os.path.abspath(__file__))
FITXER_ARMA = os.path.join(ARREL, 'js', 'atac_arma.js')
VISTES = ['down', 'up', 'left', 'right', 'southwest', 'southeast', 'northwest', 'northeast']

def taula_valida(t):
    if not isinstance(t, dict) or set(t) != set(VISTES):
        return False
    for v in VISTES:
        if not isinstance(t[v], list) or len(t[v]) != 10:
            return False
        for e in t[v]:
            if e is None:
                continue
            if not isinstance(e, dict) or set(e) != {'x', 'y', 'a', 'd'}:
                return False
            if not all(isinstance(e[k], (int, float)) and not isinstance(e[k], bool) for k in 'xya') or not isinstance(e['d'], bool):
                return False
    return True

ARMES = ['basto', 'tiller', 'espasa']

def config_valida(llarg, armes):
    num = lambda v: isinstance(v, (int, float)) and not isinstance(v, bool)
    return (num(llarg) and 20 <= llarg <= 400 and isinstance(armes, dict) and set(armes) == set(ARMES)
            and all(isinstance(armes[k], dict) and num(armes[k].get('agafa')) and 0 <= armes[k]['agafa'] <= 1 for k in ARMES))

def ajust_valid(a):
    """ajust = { arma: { vista: [10 x (null | {dx, dy, a, e})] } }"""
    num = lambda v: isinstance(v, (int, float)) and not isinstance(v, bool)
    if not isinstance(a, dict) or set(a) != set(ARMES):
        return False
    for k in ARMES:
        if not isinstance(a[k], dict) or not set(a[k]) <= set(VISTES):
            return False
        for v, llista in a[k].items():
            if not isinstance(llista, list) or len(llista) != 10:
                return False
            for e in llista:
                if e is not None and (not isinstance(e, dict) or not {'dx', 'dy', 'a', 'e'} <= set(e) <= {'dx', 'dy', 'a', 'e', 'd'}
                                      or not all(num(e[c]) for c in ('dx', 'dy', 'a', 'e')) or not 0.1 <= e['e'] <= 5
                                      or not (e.get('d') is None or isinstance(e['d'], bool))):
                    return False
    return True

COMENTARI_AJUST = '''
/**
 * AJUSTOS FINS PER ARMA I FOTOGRAMA (sobre la taula comuna ATAC_ARMA)
 * Per a cada arma ('basto', 'tiller', 'espasa') i vista, una entrada per fotograma (com a ATAC_ARMA):
 *   { dx, dy, a, e, d }  desplaçament de la mà (px de la cel·la de 256), gir afegit (graus), factor de mida de l'arma
 *                   i, si hi és, d: true/false per posar-la davant/darrere de l'Ineu en lloc d'usar el de ATAC_ARMA
 *   null              sense ajust: l'arma fa el que diu ATAC_ARMA
 * Es fa amb eines/ajust_arma.html (mode "Només aquesta arma") i es desa amb el botó "Desa al joc".
 */
'''

def desa_arma(t, llarg, armes, ajust):
    """Reescriu ARMA_LLARG, ARMES_ATAC (només el valor d'agafa), ATAC_ARMA i ATAC_AJUST de js/atac_arma.js; en fa una còpia .bak."""
    with open(FITXER_ARMA, encoding='utf-8', newline='') as f:
        text = f.read()
    original = text
    crlf = '\r\n' in text
    text = text.replace('\r\n', '\n')
    fmt = lambda e: 'null' if e is None else '{ x: %s, y: %s, a: %s, d: %s }' % (e['x'], e['y'], e['a'], 'true' if e['d'] else 'false')
    fmt_aj = lambda e: 'null' if e is None else '{ dx: %s, dy: %s, a: %s, e: %s%s }' % (e['dx'], e['dy'], e['a'], e['e'], '' if e.get('d') is None else ', d: ' + ('true' if e['d'] else 'false'))
    cos = ',\n'.join('    %s: [%s]' % (v, ', '.join(fmt(e) for e in t[v])) for v in VISTES)
    aj = ',\n'.join('    %s: {%s}' % (k, ''.join(
        '\n        %s: [%s],' % (v, ', '.join(fmt_aj(e) for e in ajust[k][v]))
        for v in VISTES if v in ajust[k] and any(e is not None for e in ajust[k][v])).rstrip(',') + ('\n    ' if any(any(e is not None for e in l) for l in ajust[k].values()) else ''))
        for k in ARMES)
    text = re.sub(r'const ARMA_LLARG = [^;]*;', lambda m: 'const ARMA_LLARG = %s;' % llarg, text, count=1)
    for k in ARMES:
        text = re.sub(r"(%s: \{ clau: '[^']*', agafa: )[^ }]*( \})" % k, lambda m: m.group(1) + str(armes[k]['agafa']) + m.group(2), text, count=1)
    i = text.index('const ATAC_ARMA = ')
    text = text[:i] + 'const ATAC_ARMA = {\n' + cos + '\n};\n' + COMENTARI_AJUST + 'const ATAC_AJUST = {\n' + aj + '\n};\n'
    if crlf:
        text = text.replace('\n', '\r\n')          # manté els salts de línia del fitxer
    with open(FITXER_ARMA + '.bak', 'w', encoding='utf-8', newline='') as f:
        f.write(original)
    with open(FITXER_ARMA, 'w', encoding='utf-8', newline='') as f:
        f.write(text)

class Tros:
    """Fitxer limitat a n bytes (per a les respostes parcials 206)."""
    def __init__(self, f, n):
        self.f, self.n = f, n
    def read(self, k=-1):
        k = self.n if k is None or k < 0 else min(k, self.n)
        d = self.f.read(k)
        self.n -= len(d)
        return d
    def close(self):
        self.f.close()

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

    def send_head(self):
        # Peticions Range (bytes=a-b): imprescindibles perquè <audio> pugui començar una cançó pel mig (la fanfarria de la intro)
        rang = self.headers.get('Range')
        cami = self.translate_path(self.path)
        m = re.match(r'bytes=(\d*)-(\d*)$', (rang or '').strip())
        if not m or not os.path.isfile(cami) or not (m.group(1) or m.group(2)):
            return super().send_head()
        mida = os.path.getsize(cami)
        if m.group(1):
            ini = int(m.group(1)); fi = int(m.group(2)) if m.group(2) else mida - 1
        else:
            ini = max(0, mida - int(m.group(2))); fi = mida - 1
        fi = min(fi, mida - 1)
        if ini > fi:
            self.send_error(416, 'Requested Range Not Satisfiable')
            return None
        f = open(cami, 'rb')
        f.seek(ini)
        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(cami))
        self.send_header('Content-Range', 'bytes %d-%d/%d' % (ini, fi, mida))
        self.send_header('Content-Length', str(fi - ini + 1))
        self.end_headers()
        return Tros(f, fi - ini + 1)

    def do_POST(self):
        resposta, codi = {'ok': False}, 400
        if self.path == '/desa-atac-arma' and self.client_address[0] in ('127.0.0.1', '::1'):
            try:
                dades = json.loads(self.rfile.read(int(self.headers.get('Content-Length', 0))))
                if taula_valida(dades.get('taula')) and config_valida(dades.get('llarg'), dades.get('armes')) and ajust_valid(dades.get('ajust')):
                    desa_arma(dades['taula'], dades['llarg'], dades['armes'], dades['ajust'])
                    resposta, codi = {'ok': True}, 200
                else:
                    resposta['error'] = 'taula no vàlida'
            except Exception as e:
                resposta['error'] = str(e)
        else:
            codi = 404
        cos = json.dumps(resposta).encode()
        self.send_response(codi)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(cos)))
        self.end_headers()
        self.wfile.write(cos)

socketserver.ThreadingTCPServer.allow_reuse_address = True
with socketserver.ThreadingTCPServer(('', 8000), Handler) as s:
    print('Joc a http://localhost:8000/')
    s.serve_forever()
