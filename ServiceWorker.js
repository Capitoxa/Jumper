const cacheName = "DefaultCompany-Jumper-1.0.9";
const contentToCache = [
    "Build/7bd6b010df2a139750adf907c1ee8bde.loader.js",
    "Build/7ca4243d05def46c18c6f05ea968cfaf.framework.js.gz",
    "Build/d9cc3d1026e3239e143ba3d707001258.data.gz",
    "Build/22c1cd600aac634c1d0b7aba84e478d3.wasm.gz",
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
