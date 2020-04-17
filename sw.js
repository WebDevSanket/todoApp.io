const cacheName = "v1";

//Put items to be cached.
const cacheAssets = ["./index.html", "./style.css", "./app.js"];

//STEP 2 INSTALL
// Call Install Event
self.addEventListener("install", (e) => {
  console.log("Service Worker: Installed", new Date().toLocaleTimeString());

  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log(
          "Service Worker: Caching Files",
          new Date().toLocaleTimeString()
        );
        cache.addAll(cacheAssets);
      })
      .then(() => {
        self.skipWaiting();
      })
  );
});

//STEP 2 ACTIVATE
// Call Activate Event
self.addEventListener("activate", (e) => {
  console.log("Service Worker: Activated", new Date().toLocaleTimeString());

  //Remove old caches
  e.waitUntil(
    caches.keys().then((cacheKeys) => {
      return Promise.all(
        cacheKeys.map((cacheKey) => {
          if (cacheKey != cacheName) {
            console.log(
              "Service Worker: Clearing Old Cache",
              new Date().toLocaleTimeString()
            );
            return caches.delete(cacheKey);
          }
        })
      );
    })
  );
});
//STEP 3 FETCH
// Call Fetch Event
self.addEventListener("fetch", (e) => {
  console.log(
    "Service Worker: Fetching Cache" + new Date().toLocaleTimeString()
  );
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
