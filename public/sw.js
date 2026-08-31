try {
  importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.4.1/workbox-sw.js');
} catch (e) {
  console.error('Workbox SW failed to load:', e);
}

if (typeof workbox !== 'undefined') {
  console.log('Workbox is loaded');
  
  const basePath = self.location.pathname.replace('sw.js', '');
  console.log('Service Worker Base Path:', basePath);

  const { registerRoute, setCatchHandler } = workbox.routing;
  const { StaleWhileRevalidate, CacheFirst, NetworkFirst } = workbox.strategies;
  const { ExpirationPlugin } = workbox.expiration;
  const { CacheableResponsePlugin } = workbox.cacheableResponse;

  // Cache names
  const CACHE_NAMES = {
    static: 'karuvilab-static-1788163758127',
    images: 'karuvilab-images-1788163758127',
    pages: 'karuvilab-pages-1788163758127',
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
  // ExpirationPlugin bounds growth: max 200 entries, 30-day TTL (GEMINI §15)
  registerRoute(
    ({ url }) => url.pathname.includes('/_next/static/'),
    new CacheFirst({
      cacheName: CACHE_NAMES.static,
      plugins: [
        new ExpirationPlugin({
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
      ],
    })
  );

  // 4. Cache Tool Pages (Network-First for fresh content, fallback to cache)
  registerRoute(
    ({ request }) => request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html'),
    new NetworkFirst({
      cacheName: CACHE_NAMES.pages,
      networkTimeoutSeconds: 3,
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // 4b. Cache Next.js App Router RSC payloads
  registerRoute(
    ({ request, url }) => {
      return request.headers.has('rsc') || url.searchParams.has('_rsc');
    },
    new StaleWhileRevalidate({
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
    ({ url }) => url.pathname.endsWith('/manifest.json') || url.pathname.endsWith('/favicon.ico'),
    new StaleWhileRevalidate({
      cacheName: CACHE_NAMES.static,
    })
  );

  // Critical App Shell Assets for proactive caching
  // Using relative paths to the service worker location
  const APP_SHELL = [
    './',
    './offline/',
    './offline',
    './manifest.json',
    './favicon.ico',
    './pdf.min.mjs',
    './pdf.worker.min.mjs',
    './icons/icon-16.png',
    './icons/icon-32.png',
    './icons/icon-48.png',
    './icons/icon-180.png',
    './icons/icon-192.png',
    './icons/icon-256.png',
    './icons/icon-512.png',
  ];

  // 6. Cache ESM modules (workers, etc.) - Excluding sw.js
  registerRoute(
    ({ url }) => (url.pathname.endsWith('.mjs') || url.pathname.endsWith('.js')) && !url.pathname.endsWith('sw.js'),
    new StaleWhileRevalidate({
      cacheName: CACHE_NAMES.static,
    })
  );

  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(CACHE_NAMES.static).then((cache) => {
        console.log('Precaching App Shell');
        return cache.addAll(APP_SHELL).catch(err => {
          console.error('App Shell precaching failed:', err);
          return Promise.resolve();
        });
      })
    );
  });

  // Handle skipWaiting message from client
  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });

  // Offline Fallback for Navigation
  setCatchHandler(async ({ event }) => {
    if (event.request.mode === 'navigate') {
      // 1. Try to find the exact request in ANY cache (covers / and visited tools)
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) return cachedResponse;

      // 2. Fallback to /offline/ page for non-cached pages
      const offlineResponse = await caches.match(`${basePath}offline/`) || await caches.match(`${basePath}offline`);
      if (offlineResponse) return offlineResponse;

      return new Response('Offline - Page not cached', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    return new Response(null, { status: 404 });
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
} else {
  // Pure native ServiceWorker fallback when Workbox is offline or unavailable
  self.addEventListener('install', () => {
    self.skipWaiting();
  });
  self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
  });
  self.addEventListener('fetch', (event) => {
    if (event.request.method === 'GET' && event.request.url.startsWith(self.location.origin)) {
      event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
      );
    }
  });
}
