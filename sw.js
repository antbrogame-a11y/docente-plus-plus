// Service Worker per Docente++
// Versione: 3.0.0 (Forced Update)

// MIME Types constants
const MIME_TYPES = {
    TEXT_PLAIN: 'text/plain',
    TEXT_HTML: 'text/html'
};

const STATIC_CACHE = 'docente-static-v6';
const DYNAMIC_CACHE = 'docente-dynamic-v6';

// File da cachare immediatamente (app shell)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Vendored libraries
  '/libs/jspdf.umd.min.js',
  '/libs/jspdf.plugin.autotable.min.js',
  '/libs/xlsx.full.min.js',
  '/libs/papaparse.min.js',
  '/libs/pdf.min.js',
  '/libs/pdf.worker.min.js',
  '/libs/rss-parser.min.js',
  '/libs/jszip.min.js',
  // Vendored fonts
  '/fonts/material-icons.css',
  '/fonts/roboto.css'
];

// Installazione del Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker v6...', event);
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Precaching App Shell v6');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  
  // Forza l'attivazione immediata
  self.skipWaiting();
});

// Attivazione del Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker v6...', event);
  
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
  if (url.origin !== location.origin) {
    event.respondWith(fetch(request)); // Lascia passare le richieste API
    return;
  }
  
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        // Trovato in cache, ritorna la risposta cached
        // console.log('[SW] Serving from cache:', request.url); // Commentato per ridurre il rumore
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
        if (request.headers.get('accept')?.includes(MIME_TYPES.TEXT_HTML)) {
          return caches.match('/index.html');
        }
        
        // Altrimenti ritorna un errore generico
        return new Response('Offline - Contenuto non disponibile', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': MIME_TYPES.TEXT_PLAIN
          })
        });
      });
    })
  );
});

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

// Gestione delle notifiche push
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received:', event);
  
  let notificationData = {
    title: 'Docente++',
    body: 'Hai una nuova notifica',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    tag: 'docente-notification'
  };
  
  // Se il push ha dati, usali
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        ...data
      };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      data: notificationData.data || {},
      requireInteraction: notificationData.requireInteraction || false,
      actions: notificationData.actions || []
    })
  );
});

// Gestione dei click sulle notifiche
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  
  event.notification.close();
  
  // Apri o focalizza la finestra dell'app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Se c'è già una finestra aperta, focalizzala
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Altrimenti apri una nuova finestra
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

console.log('[SW] Service Worker v6 loaded');