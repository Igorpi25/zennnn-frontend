self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim()) // eslint-disable-line no-undef
})

self.addEventListener('fetch', (e) => {
  const resourcesRe =
    /^https:\/\/(s3\.ap-northeast-1\.amazonaws\.com|images\.zennnn-dev\.com|images.zennnn\.com)\/.+\/pdf\/fonts\/.+\.ttf$/
  const googleFontsRe =
    /^https:\/\/fonts.googleapis\.com\/css\?family=Montserrat.*/
  const localFontsRe = /\/fonts\/.*/
  const url = e.request.url
  if (
    resourcesRe.test(url) ||
    googleFontsRe.test(url) ||
    localFontsRe.test(url)
  ) {
    e.respondWith(
      caches.open('zennnn-dynamic').then((cache) => {
        return cache.match(e.request).then((response) => {
          return (
            response ||
            fetch(e.request).then((response) => {
              cache.put(e.request, response.clone())
              return response
            })
          )
        })
      })
    )
  }
})
