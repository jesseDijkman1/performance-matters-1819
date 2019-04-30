const cacheName = "v1";

const cacheAssets = [
  "/search/words",
  "search/genres",
  "/js/main.js",
  "/css/bg-lab.css",
  "/css/styles.css"
]

self.addEventListener("install", e => {
  console.log("Service Worker Installed")

  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        console.log("Caching Files")
        cache.addAll(cacheAssets)
      })
      .then(() => self.skipWaiting())

  )
})

self.addEventListener("activate", e => {
  console.log("Service Worker Activated")

  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log("Cleaning old cache")
            return caches.delete(cache)
          }
        })
      )
    })
  )
})

self.addEventListener("fetch", e => {
  console.log("Fetching")

  e.respondWith(
    fetch(e.request)
      .catch(() => caches.match(e.request))
  )
})
