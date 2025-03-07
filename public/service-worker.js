// service-worker.js

// Cache versioning
importScripts("https://js.pusher.com/beams/service-worker.js");
const CACHE_NAME = 'v1'; // Current version of cache

// Install event - caching assets for offline use
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/icons/icon-192x192.png',
        '/icons/icon-512x512.png',
        // Add other necessary files here
      ]);
    })
  );
});

// Activate event - cleaning up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]; // Only keep the current cache

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete any caches that are not in the whitelist
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serving assets from cache, falling back to network if not found
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
self.addEventListener("push", (event) => {
  const data = event.data.json(); // Get push notification data
  const options = {
    body: data.body, // Set notification body
    icon: '/icons/icon-192x192.png', // Your app's icon
    badge: '/icons/icon-192x192.png', // Badge image (optional)
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options) // Display the notification
  );
});

// Handling notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Open a new window or tab if the notification is clicked
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
