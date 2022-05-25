self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('BF').then((cache) => {
            return cache.addAll(["offlineTest.html"])
        })
    )

    self.skipwaiting();
    // console.log('Installed service worker at ', new Date().toLocaleTimeString);
});

self.addEventListener('activate', (event) => {
    self.skipWaiting();
    // console.log('Activated service worker at ', new Date().toLocaleTimeString());
})
 
self.addEventListener('fetch', async (event) => {
    // console.log(event.request.url);
    // console.log(`Intercepting fetch request for: ${event.request.url}`);
    if (!navigator.onLine) {
        // console.log('Offline');
        event.respondWith(
            caches.match(event.request).then((responce) => {
                // console.log('RESPONCE: ', responce);
                if (responce) {
                    // console.log('RESPONCE IS TRUE, RESPNCE: ', responce);
                    return responce;
                } else {
                    // console.log('RESPONCE IS FALSE');
                    return caches.match(new Request('offlineTest.html'));
                }
            })
        );
    } else {
        // console.log('Online');
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