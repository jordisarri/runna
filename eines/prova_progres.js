/**
 * Prova de la progressió: node eines/prova_progres.js
 *  1. Recorre la història pas a pas (js/progres.js): cada pas ha de ser el següent quan toca, donar pista
 *     i quedar fet quan el joc hi posa els seus flags i objectes.
 *  2. Comprova que cada flag i objecte que la taula espera, el codi del joc el posa de debò (posaFlag / dona).
 *  3. Llista els flags que el joc llegeix però que mai no posa ningú (errors de lletra, com benediccio/benedicioMonjo).
 * Surt amb codi 1 si hi ha cap error.
 */
const fs = require('fs');
const path = require('path');
const ARREL = path.join(__dirname, '..');
const PROGRES = require(path.join(ARREL, 'js', 'progres.js'));

const errors = [], avisos = [];

// ---------------- Estat fals ----------------
function nouEstat() {
    const E = { flags: {}, objs: [] };
    E.flag = n => !!E.flags[n];
    E.te = o => E.objs.includes(o);
    E.marca = llista => llista.forEach(m => m.startsWith('obj:') ? E.objs.push(m.slice(4)) : (E.flags[m] = true));
    return E;
}

// ---------------- 1. Recorregut ----------------
const E = nouEstat();
PROGRES.passos.forEach((p, i) => {
    const seg = PROGRES.seguent(E);
    if (seg !== p) { errors.push(`Pas ${i} (${p.id}): el pas següent hauria de ser «${p.id}» però és «${seg && seg.id}»`); return; }
    const text = PROGRES.pista(E);
    if (!text || text.length < 20) errors.push(`Pas ${p.id}: pista buida`);
    if (p.pendent) return;
    E.marca(p.marca);
    if (!p.fet(E)) errors.push(`Pas ${p.id}: amb els seus flags (${p.marca.join(', ')}) encara no és fet`);
    if (PROGRES.seguent(E) === p) errors.push(`Pas ${p.id}: no s'avança`);
});
// Fins a Runna, el Pare Jordi i el Til·ler tenen pista; després, no
const E2 = nouEstat();
for (const p of PROGRES.passos) {
    if (p.id === 'runna') break;
    if (!PROGRES.pistaRunna(E2)) errors.push(`pistaRunna buida abans del pas ${p.id}`);
    E2.marca(p.marca);
}
E2.marca(PROGRES.passos.find(p => p.id === 'runna').marca);
if (PROGRES.pistaRunna(E2) !== null) errors.push('pistaRunna hauria de ser null amb Runna');

// ---------------- 2 i 3. Flags que es llegeixen i que es posen ----------------
const fitxers = [];
(function llegeix(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(f => {
        const ruta = path.join(dir, f.name);
        if (f.isDirectory()) llegeix(ruta);
        else if (f.name.endsWith('.js')) fitxers.push(ruta);
    });
})(path.join(ARREL, 'js'));
const codi = fitxers.filter(f => !f.endsWith('progres.js')).map(f => fs.readFileSync(f, 'utf8')).join('\n');
const progresCodi = fs.readFileSync(path.join(ARREL, 'js', 'progres.js'), 'utf8');

const posats = new Set(), donats = new Set();
for (const m of codi.matchAll(/posaFlag\(\s*['"]([\w·]+)['"]/g)) posats.add(m[1]);
for (const m of codi.matchAll(/flags\.(\w+)\s*=/g)) posats.add(m[1]);
for (const m of codi.matchAll(/\bflag:\s*['"]([\w·]+)['"]/g)) posats.add(m[1]);                  // taules de dades (cants de musica.js)
for (const m of codi.matchAll(/premiMonja\([^)]*?,\s*['"]([\w·]+)['"]\s*\)/g)) posats.add(m[1]);   // premiMonja(nom, flag)
for (const m of codi.matchAll(/dona\(\s*['"]([\w·]+)['"]/g)) donats.add(m[1]);
// Flags fets amb un prefix variable: 'col' + n, 'visitada_' + zona, 'esb_' + id...
const prefixos = [...codi.matchAll(/posaFlag\(\s*['"]([\w·]+)['"]\s*\+/g)].map(m => m[1]);
prefixos.push('visitada_');
const esPosat = f => posats.has(f) || prefixos.some(p => f.startsWith(p));

PROGRES.passos.concat(PROGRES.laterals).forEach(p => {
    p.marca.forEach(m => {
        if (m.startsWith('obj:')) { if (!donats.has(m.slice(4))) errors.push(`${p.id}: el joc no dóna mai l'objecte «${m.slice(4)}»`); }
        else if (!esPosat(m)) errors.push(`${p.id}: el joc no posa mai el flag «${m}»`);
    });
});
for (const m of progresCodi.matchAll(/E\.flag\(\s*'([\w·]+)'\s*\)/g)) if (!esPosat(m[1])) errors.push(`progres.js llegeix el flag «${m[1]}», que el joc no posa mai`);
for (const m of progresCodi.matchAll(/E\.te\(\s*'([\w·]+)'\s*\)/g)) if (!donats.has(m[1])) errors.push(`progres.js mira l'objecte «${m[1]}», que el joc no dóna mai`);

// Cada pas i cada lateral ha de tenir títol i lloc al Diari de l'Ineu (js/diari.js), per a la pestanya Encàrrecs i el mapa
const diari = fs.readFileSync(path.join(ARREL, 'js', 'diari.js'), 'utf8');
const bloc = nom => { const i = diari.indexOf('const ' + nom); return diari.slice(i, diari.indexOf('};', i)); };
PROGRES.passos.forEach(p => { if (!new RegExp('\\b' + p.id + ':').test(bloc('DIARI_PASSOS'))) errors.push(`Pas ${p.id}: falta a DIARI_PASSOS (js/diari.js)`); });
PROGRES.laterals.forEach(p => { if (!new RegExp('\\b' + p.id + ':').test(bloc('DIARI_LATERALS'))) errors.push(`Lateral ${p.id}: falta a DIARI_LATERALS (js/diari.js)`); });

// Flags llegits a tot el joc que ningú no posa (avís: poden ser de partides velles)
const llegits = new Set([...codi.matchAll(/(?:E|Estat|F)\.flag\(\s*['"]([\w·]+)['"]\s*\)/g)].map(m => m[1]));
[...llegits].filter(f => !esPosat(f)).sort().forEach(f => avisos.push(`el joc llegeix el flag «${f}», però no el posa enlloc`));
const mirats = new Set([...codi.matchAll(/(?:E|Estat)\.te\(\s*['"]([\w·]+)['"]\s*\)/g)].map(m => m[1]));
[...mirats].filter(o => !donats.has(o)).sort().forEach(o => avisos.push(`el joc mira l'objecte «${o}», però no el dóna enlloc`));

// ---------------- Resultat ----------------
console.log(`Passos de la història: ${PROGRES.passos.length} · laterals: ${PROGRES.laterals.length}`);
avisos.forEach(a => console.log('AVÍS  ' + a));
errors.forEach(e => console.log('ERROR ' + e));
console.log(errors.length ? `${errors.length} error(s)` : 'Tot correcte');
process.exit(errors.length ? 1 : 0);
