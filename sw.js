/**
 * SERVICE WORKER (perquè el joc es pugui instal·lar com a aplicació i, un cop jugat, tornar-hi sense connexió)
 * Estratègia: SEMPRE la xarxa primer (així es veu sempre l'última versió del joc, sense versions velles enganxades) i, si no hi ha connexió, el que s'hagi
 * guardat la vegada anterior. No hi ha cap llista de fitxers: es guarda el que el joc va demanant mentre es juga (uns 50 MB com a molt).
 * Per esborrar el que ha guardat: puja el número de VERSIO (es buida la memòria de les versions anteriors).
 */
const VERSIO = 'runna-1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', ev => {
    ev.waitUntil((async () => {
        const claus = await caches.keys();
        await Promise.all(claus.filter(k => k !== VERSIO).map(k => caches.delete(k)));
        await self.clients.claim();
    })());
});

self.addEventListener('fetch', ev => {
    const req = ev.request, url = new URL(req.url);
    // Només lectures del mateix lloc, i sense peticions parcials (àudio/vídeo amb Range: la memòria cau no les guarda bé)
    if (req.method !== 'GET' || url.origin !== self.location.origin || req.headers.has('range')) return;
    ev.respondWith((async () => {
        const cache = await caches.open(VERSIO);
        try {
            const resposta = await fetch(req);
            if (resposta && resposta.status === 200 && resposta.type === 'basic') cache.put(req, resposta.clone()).catch(() => { /* sense lloc: res */ });
            return resposta;
        } catch (e) {
            const guardada = await cache.match(req, { ignoreSearch: false }) || await cache.match(req, { ignoreSearch: true });
            if (guardada) return guardada;
            if (req.mode === 'navigate') { const inici = await cache.match('./') || await cache.match('index.html'); if (inici) return inici; }
            throw e;
        }
    })());
});
