/**
 * SERVICE WORKER (perquè el joc es pugui instal·lar com a aplicació i, un cop jugat, tornar-hi sense connexió i gastant molt poca xarxa)
 * Estratègies:
 *  - la pàgina, aquest fitxer i el manifest: la xarxa primer (així sempre es veu l'última versió; sense connexió, la còpia guardada);
 *  - els fitxers amb versió a l'adreça (?v=...: el codi del joc) i l'àudio/vídeo (que pesen molt i no canvien): primer la còpia guardada, sense tornar-los a baixar
 *    (el codi canvia d'adreça quan canvia; si canvia un àudio o un vídeo, puja VERSIO);
 *  - tota la resta (imatges, àudio, vídeo...): primer la còpia guardada i, en segon pla, es comprova si ha canviat (una petició molt petita, sense tornar a baixar res si no ha canviat);
 *    si ha canviat, s'hi veu la propera vegada.
 * No hi ha cap llista de fitxers: es guarda el que el joc va demanant mentre es juga (uns 50 MB com a molt).
 * Per esborrar el que ha guardat: puja el número de VERSIO (es buida la memòria de les versions anteriors).
 */
const VERSIO = 'runna-53';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', ev => {
    ev.waitUntil((async () => {
        const claus = await caches.keys();
        await Promise.all(claus.filter(k => k !== VERSIO).map(k => caches.delete(k)));
        await self.clients.claim();
    })());
});

// La xarxa del mòbil a vegades talla una de les molts peticions simultànies (sobretot en carregar els ~60 fitxers de codi): es torna a provar un parell de vegades abans de donar-la per perduda
const baixa = async (req, intents = 3) => {
    let ultim;
    for (let i = 0; i < intents; i++) {
        try {
            const r = await fetch(i ? new Request(req, { cache: 'reload' }) : req);
            if (r && (r.status === 200 || r.status === 304 || i === intents - 1)) return r;     // (un 404 o un 5xx també es repeteix: pot ser un desplegament a mig fer)
            ultim = r;
        } catch (e) { ultim = e; }
        await new Promise(res => setTimeout(res, 350 * (i + 1)));
    }
    if (ultim instanceof Response) return ultim;
    throw ultim;
};

const guarda = (cache, req, resposta) => {
    if (resposta && resposta.status === 200 && resposta.type === 'basic') cache.put(req, resposta.clone()).catch(() => { /* sense lloc: res */ });
    return resposta;
};

self.addEventListener('fetch', ev => {
    const req = ev.request, url = new URL(req.url);
    // Només lectures del mateix lloc, i sense peticions parcials (àudio/vídeo amb Range: la memòria cau no les guarda bé)
    if (req.method !== 'GET' || url.origin !== self.location.origin || req.headers.has('range')) return;
    const mateixa = url.pathname.endsWith('/') || /\/(index\.html|sw\.js|manifest\.json)$/.test(url.pathname) || req.mode === 'navigate';
    // L'àudio i el vídeo pesen molt i no canvien: primer la còpia guardada i mai es tornen a baixar (si en canvia algun, puja VERSIO)
    const ambVersio = url.searchParams.has('v') || /\.(m4a|mp3|ogg|wav|mp4|webm)$/i.test(url.pathname);
    ev.respondWith((async () => {
        const cache = await caches.open(VERSIO);
        if (mateixa) {                                                          // xarxa primer
            try { return guarda(cache, req, await baixa(req, 2)); }
            catch (e) {
                const guardada = await cache.match(req) || await cache.match(req, { ignoreSearch: true });
                if (guardada) return guardada;
                if (req.mode === 'navigate') { const inici = await cache.match('./') || await cache.match('index.html'); if (inici) return inici; }
                throw e;
            }
        }
        const guardada = await cache.match(req);
        if (guardada) {
            if (!ambVersio) ev.waitUntil(fetch(req, { cache: 'no-cache' }).then(r => guarda(cache, req, r)).catch(() => { /* sense connexió: ens quedem amb la còpia */ }));      // en segon pla: ha canviat?
            return guardada;
        }
        return guarda(cache, req, await baixa(req));
    })());
});
