/**
 * MIDES de l'Aleu i del Pastor de la Boira. Es poden canviar amb l'eina proves/ajust_aldreu.html (al joc publicat: .../proves/ajust_aldreu.html), que els compara amb l'Ineu aturat.
 *
 * `base`: els valors de sempre (de codi). `mult`: el que s'hi multiplica (1 = com sempre). L'eina desa els multiplicadors al navegador (localStorage 'runna_mides_aldreu'): el joc els fa servir
 * tot sol en aquest dispositiu, així es veu el resultat al joc de seguida; per fer-los definitius, cal passar-los aquí (el botó «Copia» de l'eina dona la línia de `mult`).
 * Aquest fitxer s'ha de carregar abans d'assets.js i de combat.js (index.html).
 */
const MIDES_ALDREU = {
    base: {
        pastor: 0.80,                 // escala del Pastor al combat (poses de 600 px: x300/600; full de caminar: x227/342, vegeu ESC_CAMINA a combat.js)
        poses: { apunta: 0.98, ataca: 1.32, enfadat: 1.28, derrota: 0.95 },     // factor de cada pose, perquè el cap tingui la mateixa mida a totes
        aldreu: { germa_aldreu: 71.5, germa_aldreu_trist: 68.2, pastor_boira: 88 }       // amplada de joc (px) de cada dibuix de l'Aleu fora del combat (js/assets.js)
    },
    mult: { pastor: 1, camina: 0.80, apunta: 0.76, ataca: 0.75, enfadat: 0.64, derrota: 0.78, germa_aldreu: 1, germa_aldreu_trist: 1, pastor_boira: 1 }          // (triats segons l'autor: caminant i quiet de cara = alçada del Germà Aleu (133 px, línia blanca); batent: el cap a l'alçada de l'Ineu (121 px); enfadat: el cap a la línia blanca)
};
try {
    const desat = JSON.parse(localStorage.getItem('runna_mides_aldreu') || 'null');
    if (desat && typeof desat === 'object') Object.keys(MIDES_ALDREU.mult).forEach(k => { if (typeof desat[k] === 'number' && desat[k] > 0.2 && desat[k] < 4) MIDES_ALDREU.mult[k] = desat[k]; });
} catch (e) { /* sense localStorage: valors de codi */ }
const MA = clau => MIDES_ALDREU.mult[clau] || 1;
