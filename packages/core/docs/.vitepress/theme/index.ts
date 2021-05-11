import { createI18n } from 'vue-i18n'
import { EnhanceAppContext } from 'vitepress'

import 'vitepress/dist/client/theme-default/styles/vars.css'
import 'vitepress/dist/client/theme-default/styles/code.css'

// import { datetimeFormats, numberFormats } from '/@core-shared/plugins/i18n/formats'
// import en from '/@core-shared/plugins/i18n/locales/en.json'
// import '/@core-shared/index.css'
// import * as components from 'core-components'

import { datetimeFormats, numberFormats } from '../../../shared/plugins/i18n/formats'
import en from '../../../shared/plugins/i18n/locales/en.json'
import '../../../shared/index.css'
import * as components from '../../../src'

import Layout from './Layout.vue'
import NotFound from './NotFound.vue'
import Example from './components/Example.vue'
import Table from './components/Table.vue'

const i18n = createI18n({
  locale: 'en',
  legacy: false,
  messages: {
    en,
  },
  datetimeFormats,
  numberFormats,
})

export default {
  Layout,
  NotFound,
  enhanceApp({ app, router, siteData }: EnhanceAppContext) {
    // app is the Vue 3 app instance from `createApp()`. router is VitePress'
    // custom router. `siteData`` is a `ref`` of current site-level metadata.
    app.use(i18n)
    app.component('Table', Table)
    app.component('Example', Example)
    for (const key in components) {
      // @ts-ignore
      app.component(key, components[key])
    }
  }
}
