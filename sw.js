// Expensio Service Worker v5.0
const CACHE  = 'expensio-v5';
const SHELL  = ['/', '/index.html', '/manifest.json', '/icons/icon-192.png', '/icons/icon-512.png'];
const NO_CAC = [
  '/.netlify/',
  'https://api.razorpay.com', 'https://checkout.razorpay.com',
  'https://firestore.googleapis.com', 'https://identitytoolkit.googleapis.com',
  'https://securetoken.googleapis.com', 'https://www.googleapis.com/identitytoolkit',
  'https://api.groq.com', 'https://generativelanguage.googleapis.com',
  'https://openrouter.ai', 'https://api.anthropic.com',
];
const CDN_OK = [
  'https://cdnjs.cloudflare.com', 'https://fonts.googleapis.com',
  'https://fonts.gstatic.com', 'https://www.gstatic.com/firebasejs',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(SHELL.map(u => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = req.url;

  // Never cache auth / payment / API calls
  if (NO_CAC.some(p => url.includes(p))) {
    e.respondWith(fetch(req));
    return;
  }
  // CDN: cache-first with background refresh
  if (CDN_OK.some(p => url.startsWith(p))) {
    e.respondWith(
      caches.match(req).then(hit => {
        const fresh = fetch(req).then(r => {
          if (r?.ok) caches.open(CACHE).then(c => c.put(req, r.clone()));
          return r;
        });
        return hit || fresh;
      })
    );
    return;
  }
  // Shell: cache-first
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r?.ok) caches.open(CACHE).then(c => c.put(req, r.clone()));
      return r;
    }).catch(() => caches.match('/index.html')))
  );
});
