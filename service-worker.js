// 缓存名称和版本
const CACHE_NAME = 'xiaoshitou-music-v1';

// 需要缓存的核心资源列表
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/login.html',
  '/manifest.json',
  '/css/style.css',
  '/css/desktop.css',
  '/css/mobile.css',
  '/js/index.js',
  '/js/mobile.js',
  '/favicon.png',
  '/favicon.svg',
  '/favicon1.png'
];

// 安装事件 - 缓存核心资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: 正在缓存核心资源');
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: 清理旧缓存', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch事件 - 拦截网络请求
self.addEventListener('fetch', (event) => {
  // 对于API请求，直接走网络，不缓存
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // API请求失败时，返回错误响应
          return new Response(JSON.stringify({ error: '网络连接失败' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  // 对于静态资源，使用缓存优先策略
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // 如果缓存中有资源，直接返回
        if (cachedResponse) {
          return cachedResponse;
        }

        // 缓存中没有资源，从网络获取
        return fetch(event.request)
          .then((networkResponse) => {
            // 只缓存成功的响应
            if (networkResponse && networkResponse.status === 200) {
              // 克隆响应，因为响应流只能使用一次
              const responseToCache = networkResponse.clone();
              
              // 将新资源添加到缓存
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            
            return networkResponse;
          })
          .catch(() => {
            // 网络请求失败时，如果是导航请求，返回离线页面
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            // 其他请求失败时，返回错误响应
            return new Response('网络连接失败', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// 后台同步事件 - 可选，用于离线时的数据同步
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-music-data') {
    event.waitUntil(syncMusicData());
  }
});

// 推送通知事件 - 可选，用于接收推送通知
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/favicon.png',
      badge: '/favicon.png',
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || '小石头Music', options)
    );
  }
});

// 通知点击事件 - 处理通知点击
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // 如果已有打开的窗口，聚焦到该窗口
        for (const client of clientList) {
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        // 否则打开新窗口
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
  );
});

// 同步音乐数据的辅助函数
async function syncMusicData() {
  console.log('Service Worker: 同步音乐数据');
  // 这里可以添加离线数据同步逻辑
  return Promise.resolve();
}