const cacheName = "DefaultCompany-Jumper-1.0.1";
const contentToCache = [
    "Build/c6cbef21d94990eb934b8e41e94b3ae4.loader.js",
    "Build/117a288ff998eb8ca8f1537007370af2.framework.js.gz",
    "Build/8750d2f5787c7114b3bf3585fe20c2de.data.gz",
    "Build/2afbf98cd4c32f0b952202759f90791f.wasm.gz",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
	e.waitUntil(
		caches.keys().then((cacheNames) => {
		  return Promise.all(
			cacheNames
			  .filter((name) => {
				return name !== cacheName;
			  })
			  .map((name) => {
				console.log("[Service Worker] Deleting old cache:", name);
				return caches.delete(name);
			  })
		  );
		})
	  );
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
