
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('BF').then((cache) => {
            return cache.addAll(["index.html"])
        })
    )

    self.skipwaiting();
});

self.addEventListener('activate', (event) => {
    self.skipWaiting();
})
 
self.addEventListener('fetch', async (event) => {
    if (!navigator.onLine) {
        event.respondWith(
            caches.match(event.request).then((responce) => {
                if (responce) {
                    return responce;
                } else {
                    return caches.match(new Request('index.html'));
                }
            })
        );
    } else {
        const responce = await updateCache(event.request);
        return responce; 
    }
});

async function updateCache(request) {
    const responce = await fetch(request);
    const cache = await caches.open('BF');
    
    if (request.method === 'GET'){
        cache.put(request, responce.clone());
    }

    return responce;
}

