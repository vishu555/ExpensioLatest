const CACHE='expensio-v5';
const NO_CAC=['/.netlify/','https://api.razorpay.com','https://firestore.','https://identitytoolkit.','https://api.groq.com','https://generativelanguage.'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(['/','index.html','manifest.json','icons/icon-192.png'].map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const url=e.request.url;
  if(e.request.method!=='GET'||NO_CAC.some(p=>url.includes(p))) return;
  e.respondWith(caches.match(e.request).then(h=>h||fetch(e.request).then(r=>{if(r?.ok)caches.open(CACHE).then(c=>c.put(e.request,r.clone()));return r;}).catch(()=>caches.match('/index.html'))));
});
