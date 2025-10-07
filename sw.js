// Service Worker per Docente++
// Versione: 1.0.0

const CACHE_NAME = 'docente-plus-plus-v1';
const STATIC_CACHE = 'docente-static-v1';
const DYNAMIC_CACHE = 'docente-dynamic-v1';

// File da cachare immediatamente (app shell)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// CDN resources da cachare
const CDN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
];

// Installazione del Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...', event);
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Precaching App Shell');
      // Cachiamo prima i file statici dell'app
      return cache.addAll(STATIC_ASSETS).then(() => {
        // Poi cachiamo le risorse CDN (in modo non-bloccante)
        return Promise.allSettled(
          CDN_ASSETS.map(url => 
            cache.add(url).catch(err => console.log('[SW] Failed to cache:', url, err))
          )
        );
      });
    })
  );
  
  // Forza l'attivazione immediata
  self.skipWaiting();
});

// Attivazione del Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...', event);
  
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  
  // Prendi controllo immediato di tutte le pagine
  return self.clients.claim();
});

// Strategia di caching: Cache First, poi Network (con fallback)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Non intercettare le chiamate API esterne (OpenRouter, ecc.)
  if (url.origin !== location.origin && !isCDNResource(request.url)) {
    event.respondWith(fetch(request)); // Lascia passare le richieste API
    return;
  }
  
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        // Trovato in cache, ritorna la risposta cached
        console.log('[SW] Serving from cache:', request.url);
        return response;
      }
      
      // Non in cache, fetch dalla rete
      return fetch(request).then((networkResponse) => {
        // Se è una richiesta GET, salva in cache dinamica
        if (request.method === 'GET' && networkResponse.status === 200) {
          return caches.open(DYNAMIC_CACHE).then((cache) => {
            // Clona la risposta perché può essere usata solo una volta
            cache.put(request, networkResponse.clone());
            console.log('[SW] Caching new resource:', request.url);
            return networkResponse;
          });
        }
        
        return networkResponse;
      }).catch((error) => {
        console.log('[SW] Fetch failed, offline mode:', error);
        
        // Se è una richiesta HTML, ritorna la pagina principale dalla cache
        if (request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/index.html');
        }
        
        // Altrimenti ritorna un errore generico
        return new Response('Offline - Contenuto non disponibile', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      });
    })
  );
});

// Helper per verificare se è una risorsa CDN da cachare
function isCDNResource(url) {
  return CDN_ASSETS.some(cdnUrl => url === cdnUrl);
}

// Gestione messaggi dal client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((keyList) => {
        return Promise.all(
          keyList.map((key) => {
            console.log('[SW] Clearing cache:', key);
            return caches.delete(key);
          })
        );
      })
    );
  }
});

// Sincronizzazione in background (per future implementazioni)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Qui si potrebbe implementare la sincronizzazione dei dati
      Promise.resolve()
    );
  }
});

console.log('[SW] Service Worker loaded');
