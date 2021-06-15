import { createSSRApp } from 'vue'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/vite-plugin-vue-i18n/messages'
import './index.css'
import App from './App.vue'
import { createRouter } from './router'
import { inBrowser, pathToFile } from './utils'
import { datetimeFormats, numberFormats } from './plugins/i18n/formats'
import Table from './components/Table.vue'
import Example from './components/Example.vue'
import { pageDataMap } from './composables/pageData'

import type { Router } from 'vue-router'

const i18n = createI18n({
  locale: 'en',
  messages,
  datetimeFormats,
  numberFormats,
})

// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance. If using Vuex, we'd also be creating a
// fresh store here.
export function createApp() {
  const app = createSSRApp(App)
  const router = createRouter()

  handleHMR(router)

  handleAnchorScroll()

  router.beforeEach(async (to, from) => {
    const path = to.path

    if (path === from.path || to.name === 'NotFound') return true

    const pageFilePath = pathToFile(path)
    if (inBrowser || import.meta.env.DEV) {
      const pageData = await loadPageData(pageFilePath)
      pageDataMap.value[path] = pageData
    } else {
      const pagePath = path.endsWith('/') ? `${path}index` : path
      // dynamic import not work in SSR
      const pathSplit = pagePath.split('/')
      const page =
        pathSplit.length === 3
          ? import(`./pages/${pathSplit[1]}/${pathSplit[2]}.md`)
          : import(`./pages/${pathSplit[1]}.md`)
      const { __pageData: pageData } = await page
      pageDataMap.value[path] = JSON.parse(pageData)
    }
  })

  app.component('Example', Example)
  app.component('Table', Table)

  app.use(router)
  app.use(i18n)
  return { app, router }
}

function handleAnchorScroll() {
  if (inBrowser) {
    window.addEventListener(
      'click',
      (e) => {
        const link = (e.target as Element).closest('a')
        const isAnchor =
          link &&
          (link.classList.contains('header-anchor') ||
            link.classList.contains('toc-anchor'))
        if (link && isAnchor) {
          const { protocol, hostname, pathname, hash, target } = link
          const currentUrl = window.location
          // only intercept inbound links
          if (
            !e.ctrlKey &&
            !e.shiftKey &&
            !e.altKey &&
            !e.metaKey &&
            target !== `_blank` &&
            protocol === currentUrl.protocol &&
            hostname === currentUrl.hostname
          ) {
            if (pathname === currentUrl.pathname) {
              // scroll between hash anchors in the same page
              if (hash && hash !== currentUrl.hash) {
                e.preventDefault()
                history.pushState(history.state, '', hash)
                // use smooth scroll when clicking on header anchor links
                scrollTo(link, hash, true)
              }
            }
          }
        }
      },
      { capture: true }
    )
  }
}

function scrollTo(el: HTMLElement, hash: string, smooth = false) {
  const pageOffset = (document.querySelector('.nav-bar') as HTMLElement)
    .offsetHeight
  const target = el.classList.contains('.header-anchor')
    ? el
    : document.querySelector(decodeURIComponent(hash))
  if (target) {
    const targetTop = (target as HTMLElement).offsetTop - pageOffset - 15
    // only smooth scroll if distance is smaller than screen height.
    if (!smooth || Math.abs(targetTop - window.scrollY) > window.innerHeight) {
      window.scrollTo(0, targetTop)
    } else {
      window.scrollTo({
        left: 0,
        top: targetTop,
        behavior: 'smooth',
      })
    }
  }
}

async function loadPageData(path: string) {
  try {
    const page = import(/*@vite-ignore*/ path)
    const { __pageData } = await page
    return JSON.parse(__pageData)
  } catch (error) {
    throw new Error(error)
  }
}

function handleHMR(router: Router): void {
  // update route.data on HMR updates of active page
  if (import.meta.hot) {
    // hot reload pageData
    import.meta.hot!.on('vitepress:pageData', (payload) => {
      const path = payload.path.replace(/(\bindex)?$/, '')
      const currentRoute = router.currentRoute.value
      if (path === currentRoute.path) {
        pageDataMap.value[path] = payload.pageData
      }
    })
  }
}
