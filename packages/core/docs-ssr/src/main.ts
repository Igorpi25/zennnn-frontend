import { createI18n } from 'vue-i18n'
import { datetimeFormats, numberFormats } from './plugins/i18n/formats'
import messages from '@intlify/vite-plugin-vue-i18n/messages'
import './index.css'
import App from './App.vue'
import { createSSRApp, defineComponent, h } from 'vue'
import { createRouter } from './router'
import { inBrowser } from './utils'

const i18n = createI18n({
  locale: 'en',
  messages,
  datetimeFormats,
  numberFormats,
})

const Example = defineComponent({
  name: 'Example',
  props: {
    file: String,
  },
  render () {
    return h('div', this.file)
  },
})

const Table = defineComponent({
  name: 'Table',
  props: {
    name: String,
    field: String,
  },
  render () {
    return h('div', `name: ${this.name}, field: ${this.field}`)
  },
})

// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance. If using Vuex, we'd also be creating a
// fresh store here.
export function createApp() {
  const app = createSSRApp(App)
  const router = createRouter()


  router.beforeEach(r => {
    // const path = r.path
    // let pageFilePath = pathToFile(path)
    if (!import.meta.env.DEV && inBrowser) {
      // const base = import.meta.env.BASE_URL
      // const pageHash = __VP_HASH_MAP__[path]
      // const pagePath = `${base}assets/${path}.${pageHash}.js`
      // console.log('pagePath', pagePath)
      // console.log('pageFilePath', pageFilePath)
      // return loadPage(pageFilePath)
    }
    // r.meta.pageData = path
    // console.log('BEFORE RESOLVE pageFilePath', pageFilePath)
  })

  app.component('Example', Example)
  app.component('Table', Table)

  app.use(router)
  app.use(i18n)
  return { app, router }
}

async function loadPage (path: string) {
  const page = import(/*@vite-ignore*/ path)
  const d = await page
  console.log('d', d)
}

function handleHMR(router: any): void {
  // update route.data on HMR updates of active page
  if (import.meta.hot) {
    // hot reload pageData
    import.meta.hot!.on('vitepress:pageData', (payload) => {
      if (shouldHotReload(payload)) {
        // router.route.data = payload.pageData
        console.log('PAGE HOT RELAOD', payload.pageData)
      }
    })
  }
}

function shouldHotReload(payload: any): boolean {
  const payloadPath = payload.path.replace(/(\bindex)?\.md$/, '')
  const locationPath = location.pathname.replace(/(\bindex)?\.html$/, '')

  console.log('shouldHotReload', payloadPath, locationPath)

  return payloadPath === locationPath
}
