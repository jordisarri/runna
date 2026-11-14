#!/usr/bin/env node
/**
 * Genera js/proves_llistes.js: la llista de tots els flags i objectes que fa servir el codi (per al mode de proves, pestanya «Estat»).
 *   node eines/fer_llistes_proves.js
 * Cerca a js/**.js les crides flag('x'), posaFlag('x'), te('x'), dona('x'), treu('x') (cometes simples o dobles) i els literals de les marques de js/progres.js.
 * Torna-la a executar quan s'afegeixin flags o objectes nous.
 */
const fs = require('fs');
const path = require('path');
const ARREL = path.resolve(__dirname, '..');

function fitxers(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
        const p = path.join(dir, d.name);
        if (d.isDirectory()) return d.name === 'lib' ? [] : fitxers(p);
        return d.name.endsWith('.js') && !d.name.startsWith('proves_llistes') ? [p] : [];
    });
}

const flags = new Set(), objectes = new Set();
const reFlag = /\b(?:flag|posaFlag)\(\s*(['"])([A-Za-z0-9_]+)\1/g;
const reObj = /\b(?:te|dona|treu)\(\s*(['"])([A-Za-z0-9_]+)\1/g;
const reMarca = /marca:\s*\[([^\]]*)\]/g;
for (const f of fitxers(path.join(ARREL, 'js'))) {
    const s = fs.readFileSync(f, 'utf8');
    let m;
    while ((m = reFlag.exec(s))) flags.add(m[2]);
    while ((m = reObj.exec(s))) objectes.add(m[2]);
    while ((m = reMarca.exec(s))) for (const x of m[1].split(',').map(t => t.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)) (x.startsWith('obj:') ? objectes.add(x.slice(4)) : flags.add(x));
}
const ord = a => [...a].sort((x, y) => x.localeCompare(y));
const sortida = `// GENERAT per eines/fer_llistes_proves.js: no s'edita a mà. Flags i objectes que fa servir el codi (mode de proves, pestanya «Estat»).
const PROVES_FLAGS = ${JSON.stringify(ord(flags))};
const PROVES_OBJECTES = ${JSON.stringify(ord(objectes))};
`;
fs.writeFileSync(path.join(ARREL, 'js', 'proves_llistes.js'), sortida);
console.log('flags:', flags.size, 'objectes:', objectes.size);
