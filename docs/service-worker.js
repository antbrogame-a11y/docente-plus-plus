// A minimal service worker to prevent 404 errors on registration.
self.addEventListener('install', event => {
  console.log('Service worker installing...');
});

self.addEventListener('fetch', event => {
  // Do nothing. Let the browser handle all network requests.
  return;
});
