"""
Baixa les tipografies de Google Fonts que fa servir el joc i les deixa al nostre servidor (assets/fonts/), amb el seu fonts.css,
perquè el joc no hagi de demanar res a fonts.googleapis.com / fonts.gstatic.com (sense errors si no hi ha xarxa, i sense enviar res a Google):
    python eines/baixa_tipografies.py
Només es guarden els subconjunts «latin» i «latin-ext» (el català i les lletres que fem servir). Les tipografies són de llicència lliure (SIL OFL).
Cal tornar-lo a executar només si es canvien les famílies o els pesos de la llista de sota.
"""
import os, re, urllib.request

ARREL = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SORTIDA = os.path.join(ARREL, 'assets', 'fonts')
URL = ('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Cinzel+Decorative:wght@700;900'
       '&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=IM+Fell+English:ital@0;1&display=swap')
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'   # perquè Google serveixi woff2
SUBCONJUNTS = ('latin', 'latin-ext')


def baixa(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60).read()


def nom_fitxer(familia, pes, estil, subconjunt):
    return f"{familia.lower().replace(' ', '-')}-{pes}{'-italic' if estil == 'italic' else ''}-{subconjunt}.woff2"


def main():
    os.makedirs(SORTIDA, exist_ok=True)
    css = baixa(URL).decode('utf8')
    sortida = ['/* Tipografies allotjades al nostre servidor (generat per eines/baixa_tipografies.py; llicència SIL OFL) */']
    n = 0
    for bloc in re.findall(r'/\*\s*([\w-]+)\s*\*/\s*(@font-face\s*\{[^}]*\})', css):
        subconjunt, regla = bloc
        if subconjunt not in SUBCONJUNTS:
            continue
        familia = re.search(r"font-family:\s*'([^']+)'", regla).group(1)
        estil = re.search(r'font-style:\s*(\w+)', regla).group(1)
        pes = re.search(r'font-weight:\s*(\d+)', regla).group(1)
        url = re.search(r'url\((https://[^)]+\.woff2)\)', regla).group(1)
        nom = nom_fitxer(familia, pes, estil, subconjunt)
        with open(os.path.join(SORTIDA, nom), 'wb') as f:
            f.write(baixa(url))
        sortida.append(regla.replace(url, nom))          # la url és relativa al fonts.css (mateixa carpeta)
        n += 1
    with open(os.path.join(SORTIDA, 'fonts.css'), 'w', encoding='utf8') as f:
        f.write('\n'.join(sortida) + '\n')
    print('fet:', n, 'tipografies a', os.path.normpath(SORTIDA))


if __name__ == '__main__':
    main()
