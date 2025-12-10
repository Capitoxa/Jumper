const cacheName = "DefaultCompany-Jumper-1.0.8";
const contentToCache = [
    "Build/b5a167642b56433d1fb70267deb78377.loader.js",
    "Build/117a288ff998eb8ca8f1537007370af2.framework.js.gz",
    "Build/dd7f553296bf92bd039a3399f4542d26.data.gz",
    "Build/20c3409d5cdda0d35c7f611c9a4d01c7.wasm.gz",
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
