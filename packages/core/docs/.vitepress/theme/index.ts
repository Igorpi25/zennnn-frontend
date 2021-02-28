import { createI18n } from 'vue-i18n'
import { EnhanceAppContext } from 'vitepress'

import 'vitepress/dist/client/theme-default/styles/vars.css'
import 'vitepress/dist/client/theme-default/styles/code.css'

import Layout from './Layout.vue'
import NotFound from './NotFound.vue'
import Example from './components/Example.vue'
import Table from './components/Table.vue'
import * as components from '../../../src'

import './index.css'

import { datetimeFormats, numberFormats } from './plugins/i18n/formats'
import en from './plugins/i18n/locales/en.json'

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
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
