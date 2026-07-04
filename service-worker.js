
const CACHE="mundo-leo-lucas-pastel-v1";
const ASSETS=[
 "./","./index.html","./css/styles.css","./js/app.js","./js/data.js",
 "./js/storage.js","./js/audio.js","./manifest.webmanifest","./assets/icons/icon.svg",
 "./assets/audio/click.wav","./assets/audio/success.wav","./assets/audio/error.wav",
 "./assets/audio/discovery.wav","./assets/audio/soft.wav","./assets/audio/animal.wav",
 "./assets/audio/water.wav","./assets/audio/star.wav","./assets/audio/drum.wav","./assets/audio/bell.wav"
];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener("fetch",e=>{e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(cache=>cache.put(e.request,c));return r}).catch(()=>caches.match(e.request)))});
