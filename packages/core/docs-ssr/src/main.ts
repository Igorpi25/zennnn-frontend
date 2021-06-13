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

  router.beforeEach(async (r) => {
    const path = r.path
    const pageFilePath = pathToFile(path)
    if (inBrowser || import.meta.env.DEV) {
      const pageData = await loadPageData(pageFilePath)
      r.meta.pageData = pageData
    } else {
      const pagePath = path.endsWith('/') ? `${path}index` : path
      // dynamic import not work in SSR
      const pathSplit = pagePath.split('/')
      const page =
        pathSplit.length === 3
          ? import(`./pages/${pathSplit[1]}/${pathSplit[2]}.md`)
          : import(`./pages/${pathSplit[1]}.md`)
      const { __pageData: pageData } = await page
      r.meta.pageData = JSON.parse(pageData)
    }
  })

  app.component('Example', Example)
  app.component('Table', Table)

  app.use(router)
  app.use(i18n)
  return { app, router }
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
        currentRoute.meta.pageData = payload.pageData
      }
    })
  }
}
