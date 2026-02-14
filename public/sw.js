// Service Worker for Bukadita Admin PWA
const CACHE_NAME = 'bukadita-admin-v2';
const urlsToCache = [
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Opened cache');
      return cache.addAll(urlsToCache).catch((err) => {
        console.error('[SW] Failed to cache:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // ✅ Skip non-GET requests
  if (request.method !== 'GET') return;

  // ✅ Skip chrome-extension and other non-http(s) schemes
  if (!url.protocol.startsWith('http')) {
    console.log('[SW] Skipping non-http request:', url.protocol);
    return;
  }

  // ✅ Skip API requests (let them go to network)
  if (url.pathname.includes('/api/')) return;

  // ✅ Skip cross-origin requests
  if (url.origin !== self.location.origin) return;

  // ✅ Skip auth-protected routes - always fetch fresh to handle redirects properly
  const authProtectedRoutes = ['/admin/dashboard', '/admin/', '/'];
  const isAuthProtected = authProtectedRoutes.some(route => url.pathname.startsWith(route));
  
  if (isAuthProtected) {
    // For auth-protected routes, always go to network (don't cache)
    event.respondWith(
      fetch(request, { redirect: 'follow' })
        .catch((error) => {
          console.error('[SW] Fetch failed for auth route:', request.url, error);
          // Return offline page
          return caches.match('/offline.html').then((offlineResponse) => {
            return offlineResponse || new Response('Offline', { status: 503 });
          });
        })
    );
    return;
  }

  // For non-auth routes, use cache-first strategy
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Cache hit - return response
      if (cachedResponse) {
        return cachedResponse;
      }

      // Clone the request with redirect mode 'follow'
      const fetchRequest = new Request(request.url, {
        method: request.method,
        headers: request.headers,
        mode: 'same-origin',
        credentials: request.credentials,
        cache: request.cache,
        redirect: 'follow', // ✅ Allow redirects
      });

      return fetch(fetchRequest)
        .then((response) => {
          // ✅ Don't cache if not a valid response
          if (!response || response.status !== 200) {
            return response;
          }

          // ✅ Don't cache redirected responses
          if (response.redirected) {
            console.log('[SW] Skipping cache for redirected response:', request.url);
            return response;
          }

          // ✅ Don't cache opaque responses
          if (response.type === 'opaque') {
            return response;
          }

          // Clone the response for caching
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache).catch((err) => {
              console.error('[SW] Failed to cache:', request.url, err);
            });
          });

          return response;
        })
        .catch((error) => {
          console.error('[SW] Fetch failed:', request.url, error);
          // Return offline page if available
          return caches.match('/offline.html').then((offlineResponse) => {
            return offlineResponse || new Response('Offline', { status: 503 });
          });
        });
    })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
