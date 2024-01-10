// キャッシュしたいファイルの一覧を指定 ---
const cacheFiles = ['index.html', 'bv-calculator.html', 'gator.html', 'HitLocationTable.html', 'logo.png'];
const cacheName = 'v6';
// インストール時に実行されるイベント ---
self.addEventListener('install', event => {
  // キャッシュしたいファイルを指定
  caches.open(cacheName).then(cache => cache.addAll(cacheFiles));
});
// インストール後に実行されるイベント
function deleteOldCache() {
  caches.keys().then( (keyList) => 
    Promise.all(
      keyList.map( (key) => {
        if( key === cacheName) {
        }
        else {
          return caches.delete( key);
        }
      })
    )
  )
}
self.addEventListener('activate', event => {
  // 古いキャッシュの削除処理
  event.waitUntil(deleteOldCache());
});
// fetchイベント
self.addEventListener('fetch', event => {
  // キャッシュがあればそれを返す ---
  event.respondWith(
    caches.match(event.request).then(function(resp) {
      return resp || fetch(event.request).then(function(response) {
        let responseClone = response.clone();
        caches.open(cacheName).then(function(cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      });
    }).catch(function() {
      return caches.match('logo.png');
    }));
});