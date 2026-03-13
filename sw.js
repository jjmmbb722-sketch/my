const cacheName = 'quran-audio-v1';
// هنا نضيف الملفات الأساسية فقط في البداية
const assets = [
  './',
  './index.html',
  './manifest.json'
];
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(assets))
  );
});
// هذا الجزء هو "الصياد" الذكي لكل ملفات الصوت الخارجية
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      // إذا الملف موجود بالذاكرة شغله فوراً
      if (res) return res;

      // إذا مو موجود، روح جيبه من النت واحفظه للمرة الجاية
      return fetch(e.request).then(fetchRes => {
        return caches.open(cacheName).then(cache => {
          // نحفظ نسخة من الصوت (الـ MP3 القادم من الرابط الخارجي)
          cache.put(e.request.url, fetchRes.clone());
          return fetchRes;
        });
      });
    })
  );
});


// ... الكود القديم ينتهي هنا

self.addEventListener('push', function(event) {
    const options = {
        body: 'حان الآن موعد أذان الصلاة حسب توقيتك المحلي',
        icon: 'https://cdn-icons-png.flaticon.com/512/2800/2800103.png',
        vibrate: [200, 100, 200],
        data: { url: './index.html' }
    };

    event.waitUntil(
        self.registration.showNotification('نداء الصلاة 🕌', options)
    );
});
