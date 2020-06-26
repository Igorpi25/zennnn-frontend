self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim()) // eslint-disable-line no-undef
})

self.addEventListener('fetch', (e) => {
  const resourcesRe = new RegExp('^https://s3.ap-northeast-1.amazonaws.com/.+/pdf/vfs/vfs_fonts.+\\.json$')
  const googleFontsRe = new RegExp('^https://fonts.googleapis\\.com/css\\?family=Montserrat.*')
  const localFontsRe = new RegExp('/fonts/.*')
  const url = e.request.url
  if (resourcesRe.test(url) || googleFontsRe.test(url) || localFontsRe.test(url)) {
    e.respondWith(
      caches.open('zennnn-dynamic').then((cache) => {
        return cache.match(e.request).then((response) => {
          return response || fetch(e.request).then((response) => {
            cache.put(e.request, response.clone())
            return response
          })
        })
      }),
    )
  }
})
