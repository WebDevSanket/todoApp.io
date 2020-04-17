const cacheName = "ToDo-v2";
//STEP 2 INSTALL
// Call Install Event
self.addEventListener("install", (e) => {
  console.log("Service Worker: Installed", new Date().toLocaleTimeString());
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
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(cacheName).then(function (cache) {
      return cache.match(event.request).then(function (response) {
        return (
          response ||
          fetch(event.request).then(function (response) {
            try {
              cache.put(event.request, response.clone());
              return response;
            } catch (e) {
              console.log(e);
              console.log(event.request.url);
            }
          })
        );
      });
    })
  );
});
