// Define the cache

// Define cache name prefix
var restrCachePrfx = "mws-restaurant-static-v";
// Add a random cache ID
var restrCacheName = restrCachePrfx + Math.floor(Math.random() * 10000);

var initialUrls = [
  "index.html",
  "restaurant.html",
  "/css/styles.css",
  "/js/dbhelper.js",
  "/js/main.js",
  "/js/restaurant_info.js",
  "img/1.jpg",
  "img/2.jpg",
  "img/3.jpg",
  "img/4.jpg",
  "img/5.jpg",
  "img/6.jpg",
  "img/7.jpg",
  "img/8.jpg",
  "img/9.jpg",
  "img/10.jpg",
  "/js/register_workers.js"
];

// First step of worker, install. Fetch urls here.
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(restrCacheName).then(function(cache) {
      return cache.addAll(initialUrls).catch(error => {
        console.log("Error during service worker installation: " + error);
      });
    })
  );
});

// Called after install. Clear any caches created by other service worker.
self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(cacheName) {
            return (
              cacheName.startsWith(restrCachePrfx) &&
              cacheName != restrCacheName
            );
          })
          .map(function(cacheName) {
            return caches.delete(cacheName);
          })
      );
    })
  );
});

// Called when a resource is fetched.
self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response !== undefined) {
        return response;
      } else {
        return fetchAndStore(event.request);
      }
    })
  );
});

// Fetch from network, store in cache and return the fetched response
var fetchAndStore = function(request) {
  return fetch(request).then(function(response) {
    var clone = response.clone();
    caches.open(restrCacheName).then(function(cache) {
      cache.put(request, clone);
    });
    return response;
  });
};
