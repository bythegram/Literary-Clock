var CACHE_NAME = 'literary-clock-v9';
var ASSETS = [
  './',
  './index.html',
  './temporal-loader.js',
  './temporal-polyfill.js',
  './app.js',
  './theme.js',
  './sw-register.js',
  './style.css',
  './fonts.css',
  './fonts/playfair-display-400-latin.woff2',
  './fonts/playfair-display-latin-ext.woff2',
  './fonts/z7NFdQDnbTkabZAIOl9il_O6KJj73e7Ff1GhDujMR6WR.woff2',
  './fonts/z7NFdQDnbTkabZAIOl9il_O6KJj73e7Ff1GhDuHMR6WR.woff2',
  './fonts/z7NFdQDnbTkabZAIOl9il_O6KJj73e7Ff1GhDunMR6WR.woff2',
  './fonts/z7NFdQDnbTkabZAIOl9il_O6KJj73e7Ff1GhDubMR6WR.woff2',
  './fonts/z7NFdQDnbTkabZAIOl9il_O6KJj73e7Ff1GhDurMR6WR.woff2',
  './fonts/z7NFdQDnbTkabZAIOl9il_O6KJj73e7Ff1GhDuvMR6WR.woff2',
  './fonts/z7NFdQDnbTkabZAIOl9il_O6KJj73e7Ff1GhDuXMRw.woff2',
  './fonts/BngMUXZYTXPIvIBgJJSb6ufA5qW54A.woff2',
  './fonts/BngMUXZYTXPIvIBgJJSb6ufJ5qW54A.woff2',
  './fonts/BngMUXZYTXPIvIBgJJSb6ufB5qW54A.woff2',
  './fonts/BngMUXZYTXPIvIBgJJSb6ufO5qW54A.woff2',
  './fonts/BngMUXZYTXPIvIBgJJSb6ufC5qW54A.woff2',
  './fonts/BngMUXZYTXPIvIBgJJSb6ufD5qW54A.woff2',
  './fonts/BngMUXZYTXPIvIBgJJSb6ufN5qU.woff2',
  './litclock.json',
  './litdays.json',
  './litmonths.json',
  './litdates.json',
  './favicon.ico',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-192-maskable.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (name) { return name !== CACHE_NAME; })
          .map(function (name) { return caches.delete(name); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  var url = new URL(event.request.url);

  // Network-first for data JSON files so updates propagate immediately;
  // fall back to cache when offline.
  if (url.pathname.endsWith('/litclock.json') ||
      url.pathname.endsWith('/litdays.json') ||
      url.pathname.endsWith('/litmonths.json') ||
      url.pathname.endsWith('/litdates.json')) {
    event.respondWith(
      fetch(event.request)
        .then(function (response) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, clone);
          });
          return response;
        })
        .catch(function () {
          return caches.match(event.request);
        })
    );
    return;
  }

  // Cache-first for all other assets; fall back to network.
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request).catch(function () {
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});
