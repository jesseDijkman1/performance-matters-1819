const cacheName = "v1";
const cacheAssets = [
  "css/styles.css",
  "css/bg-lab.css",
  "js/main.js"
]

self.addEventListener("install", e => {
  console.log("Service worker installed")

  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        console.log("Caching");
        cache.addAll(cacheAssets)
      })
      .then(() => self.skipWaiting())
  )
})

self.addEventListener("activate", e => {
  console.log("Service worker activated")
})
