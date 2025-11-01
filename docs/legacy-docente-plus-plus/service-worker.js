const CACHE_NAME = 'docentepp-cache-v2'; // Aggiornato per forzare l'aggiornamento
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    '/agenda.html',
    '/classes.html',
    '/students.html',
    '/lessons.html',
    '/evaluations.html',
    '/schedule.html',
    '/aiAssistant.html',
    '/ai-suggestions.html', // Aggiunto file mancante
    '/documentImport.html',
    '/statistiche.html'
    // Rimosso file non esistenti come /home.html, /settings.html, etc.
];

// L'evento 'install' viene eseguito quando il nuovo service worker viene installato.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Salvataggio dei file nella nuova cache.');
                return cache.addAll(FILES_TO_CACHE);
            })
            .then(() => {
                // Forza il nuovo service worker ad attivarsi immediatamente.
                return self.skipWaiting(); 
            })
    );
});

// L'evento 'activate' pulisce le vecchie cache.
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Se la cache non è quella nuova, viene eliminata.
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('[Service Worker] Eliminazione della vecchia cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            // Prende il controllo immediato della pagina.
            return self.clients.claim(); 
        })
    );
});

// L'evento 'fetch' intercetta le richieste di rete.
self.addEventListener('fetch', (event) => {
    // Per le richieste di navigazione (pagine HTML), prova prima la rete.
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                // Se la rete fallisce, restituisce la pagina principale dalla cache.
                return caches.match('/index.html');
            })
        );
        return;
    }

    // Per tutti gli altri file (CSS, JS, immagini), usa una strategia "cache-first".
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Se la risorsa è in cache, la restituisce. Altrimenti, la richiede alla rete.
                return response || fetch(event.request);
            })
    );
});
