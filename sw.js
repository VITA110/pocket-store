const CACHE_NAME = 'pocketstore-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json'
];

// Fase 1: Instalación (Guardamos el App Shell en caché)
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierta');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fase 2: Fetch (Interceptar peticiones)
// Estrategia: Cache First con Network Fallback (y caché dinámica para la API)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si el recurso está en caché, lo devolvemos
                if (response) {
                    return response;
                }
                
                // Si no está en caché, hacemos la petición a la red
                return fetch(event.request).then(networkResponse => {
                    // Verificamos que sea una respuesta válida antes de cachearla dinámicamente
                    if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        // Si la petición es hacia la API externa, type será 'cors', así que ajustamos la condición:
                        if(!networkResponse || networkResponse.status !== 200) {
                            return networkResponse;
                        }
                    }
                    
                    // Clonamos la respuesta porque un stream solo se puede consumir una vez
                    const responseToCache = networkResponse.clone();
                    
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                        
                    return networkResponse;
                });
            })
    );
});

// Fase 3: Activación (Limpieza de cachés antiguas si actualizamos la versión)
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});