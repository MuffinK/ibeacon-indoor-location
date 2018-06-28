var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/indoor/pc.html',
  '/indoor/leaflet/Leaflet.ImageOverlay.Rotated.js',
  '/indoor/leaflet/ramda.min.js',
  '/indoor/leaflet/graph-dijkstra.min.js',
  '/indoor/leaflet/kalman.es5.js',
  '/indoor/script.es5.js',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/leaflet.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/leaflet.js',
  'https://cdn.jsdelivr.net/npm/vue/dist/vue.js',
  '/indoor/svg/1-1.svg',
  '/indoor/svg/2-1.svg',
  '/indoor/svg/3-1.svg',
  '/indoor/maps/1-1.svg',
  '/indoor/maps/2-1.svg',
  '/indoor/maps/3-1.svg',
  '/indoor/arrows/inner.svg'

];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});
self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
          return fetch(event.request);
        }
      )
    );
  });