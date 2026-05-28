const CACHE = 'owl-v2';
// Path relatif (tanpa leading slash) agar bekerja di GitHub Pages subfolder
const ASSETS = ['./', './index.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // JANGAN cache request ke Firebase — selalu ambil data fresh dari server
  if(url.includes('firebasedatabase.app') || url.includes('firebaseio.com')){
    return; // biarkan browser handle langsung
  }
  // Untuk asset lain: cache-first
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request)).catch(()=>caches.match('./index.html'))
  );
});
