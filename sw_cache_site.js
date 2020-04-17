const cacheName = "v2";
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
self.addEventListener("fetch", (e) => {
  console.log(
    "Service Worker: Fetching Cache" + new Date().toLocaleTimeString()
  );
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        //Make a copy/clone of response
        const responseClone = response.clone();
        //Open Cache
        caches.open(cacheName).then((cache) => {
          //Add respose to cache
          cache.put(e.request, responseClone);
        });
        return response;
      })
      .catch((err) => {
        caches.match(e.request).then((response) => {
          return response;
        });
      })
  );
});
