const CACHE = "mundo-leo-lucas-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/app.js",
  "./js/data.js",
  "./js/audio.js",
  "./js/storage.js",
  "./data/progress.default.json",
  "./manifest.webmanifest",
  "./assets/icons/icon.svg",
  "./assets/audio/click.wav",
  "./assets/audio/success.wav",
  "./assets/audio/error.wav",
  "./assets/audio/unlock.wav",
  "./assets/audio/soft.wav",
  "./assets/audio/animal.wav",
  "./assets/audio/water.wav",
  "./assets/audio/feed.wav"
];

self.addEventListener("install", event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", event=>{
  event.waitUntil(
    caches.keys().then(keys=>
      Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event=>{
  event.respondWith(
    fetch(event.request)
      .then(response=>{
        const copy = response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy));
        return response;
      })
      .catch(()=>caches.match(event.request))
  );
});
