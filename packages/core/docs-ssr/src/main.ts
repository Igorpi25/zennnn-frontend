import { createI18n } from 'vue-i18n'
import { datetimeFormats, numberFormats } from './plugins/i18n/formats'
import messages from '@intlify/vite-plugin-vue-i18n/messages'
import '@zennnn/core/lib/index.esm.css'
import './index.css'
import * as components from '@zennnn/core'
import App from './App.vue'
import { createSSRApp, defineComponent, h } from 'vue'
import { createRouter } from './router'

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

  for (const key in components) {
    // @ts-ignore
    app.component(key, components[key])
  }

  app.component('Example', Example)
  app.component('Table', Table)

  app.use(router)
  app.use(i18n)
  return { app, router }
}
