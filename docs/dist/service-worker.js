const CACHE_NAME = 'docentepp-cache-v1';
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
    '/activities.html',
    '/evaluations.html',
    '/schedule.html',
    '/aiAssistant.html',
    '/documentImport.html',
    '/statistiche.html',
    '/settings.html',
    '/help.html',
    '/home.html'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Pre-caching offline page');
                return cache.addAll(FILES_TO_CACHE);
            })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => caches.match('/index.html'))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});
