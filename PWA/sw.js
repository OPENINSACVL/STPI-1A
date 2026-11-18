const V = 'stpi1a-pwa-v2';
const SCOPE = self.registration.scope;
const ROOT = SCOPE.endsWith('/PWA/') ? new URL('../', SCOPE).href : SCOPE;
const HOSTS = ['cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];
const PRECACHE = ['', 'index.html', 'INSACVL.png', 'PWA/manifest.json', 'PWA/icons/icon-192.png', 'PWA/icons/icon-512.png'].map(p => ROOT + p);

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(V)
      .then(c => Promise.all(PRECACHE.map(u => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const u = new URL(req.url);
  if (u.origin !== location.origin && !HOSTS.includes(u.host)) return;
  e.respondWith(handle(req));
});

async function handle(req) {
  const c = await caches.open(V);
  const isDoc = req.mode === 'navigate' || req.destination === 'document';
  const store = r => {
    if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone());
    return r;
  };
  if (isDoc) {
    const res = await fetch(req).then(store).catch(() => null);
    if (res && res.ok) return res;
    return (await c.match(req)) || res || (await c.match(ROOT + 'index.html')) || Response.error();
  }
  const hit = await c.match(req);
  const upd = fetch(req).then(store).catch(() => null);
  return hit || (await upd) || Response.error();
}
