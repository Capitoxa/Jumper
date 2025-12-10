const cacheName = "DefaultCompany-Jumper-1.0.10";
const contentToCache = [
    "Build/e9721bd3241efdd2255f2bac0850c3a6.loader.js",
    "Build/0efaa950c6acf51a27a91b44b9e3704b.framework.js.gz",
    "Build/e55fd25acc9cc1c3d087e3274e79ce30.data.gz",
    "Build/4049e94397bb799502e8d1856a27dc5f.wasm.gz",
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
