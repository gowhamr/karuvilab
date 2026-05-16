importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

if (workbox) {
  console.log('Workbox is loaded');

  const { registerRoute, setCatchHandler } = workbox.routing;
  const { StaleWhileRevalidate, CacheFirst, NetworkFirst } = workbox.strategies;
  const { ExpirationPlugin } = workbox.expiration;
  const { CacheableResponsePlugin } = workbox.cacheableResponse;

  // Cache names
  const CACHE_NAMES = {
    static: 'karuvilab-static-v1',
    images: 'karuvilab-images-v1',
    pages: 'karuvilab-pages-v1',
    googleFonts: 'google-fonts',
  };

  // 1. Cache Google Fonts
  registerRoute(
    ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
    new StaleWhileRevalidate({
      cacheName: CACHE_NAMES.googleFonts,
      plugins: [new ExpirationPlugin({ maxEntries: 20 })],
    })
  );

  // 2. Cache Images (Cache-First)
  registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
      cacheName: CACHE_NAMES.images,
      plugins: [
        new ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  // 3. Cache Next.js Static Assets (_next/static)
  registerRoute(
    ({ url }) => url.pathname.startsWith('/_next/static/'),
    new StaleWhileRevalidate({
      cacheName: CACHE_NAMES.static,
    })
  );

  // 4. Cache Tool Pages (Network-First for fresh content, fallback to cache)
  registerRoute(
    ({ request }) => request.mode === 'navigate',
    new NetworkFirst({
      cacheName: CACHE_NAMES.pages,
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // 5. General Assets (manifest, favicon, etc.)
  registerRoute(
    ({ url }) => ['/manifest.json', '/favicon.ico'].includes(url.pathname),
    new StaleWhileRevalidate({
      cacheName: CACHE_NAMES.static,
    })
  );

  // Critical App Shell Assets for proactive caching
  const APP_SHELL = [
    '/',
    '/offline',
    '/manifest.json',
    '/favicon.ico',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
  ];

  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(CACHE_NAMES.static).then((cache) => {
        console.log('Precaching App Shell');
        return cache.addAll(APP_SHELL);
      }).then(() => self.skipWaiting())
    );
  });

  // Offline Fallback for Navigation
  setCatchHandler(async ({ event }) => {
    if (event.request.mode === 'navigate') {
      return caches.match('/offline') || caches.match('/') || Response.error();
    }
    return Response.error();
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (!Object.values(CACHE_NAMES).includes(key)) {
              return caches.delete(key);
            }
          })
        )
      ).then(() => self.clients.claim())
    );
  });
}
