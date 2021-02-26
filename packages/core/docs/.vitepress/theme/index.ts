import { createI18n } from 'vue-i18n'

import 'vitepress/dist/client/theme-default/styles/vars.css'
import 'vitepress/dist/client/theme-default/styles/code.css'

import Layout from './Layout.vue'
import NotFound from './NotFound.vue'
import Example from './components/Example.vue'
import Table from './components/Table.vue'
import * as components from '../../../src'

import './index.css'

import { datetimeFormats, numberFormats } from '../../../../zennnn/src/plugins/i18n/formats'
import { slavicPluralRule } from '../../../../zennnn/src/plugins/i18n/pluralizationRules'
import en from '../../../../zennnn/src/locales/main/en.json'
import ru from '../../../../zennnn/src/locales/main/ru.json'

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  legacy: false,
  messages: {
    en,
    ru,
  },
  datetimeFormats,
  numberFormats,
  // Key - language to use the rule for, `'ru'`, in this case
  // Value - function to choose right plural form
  pluralRules: {
    ru: slavicPluralRule,
    uk: slavicPluralRule,
  },
})

export default {
  Layout,
  NotFound,
  enhanceApp({ app, router, siteData }) {
    // app is the Vue 3 app instance from `createApp()`. router is VitePress'
    // custom router. `siteData`` is a `ref`` of current site-level metadata.
    app.use(i18n)
    app.component('Table', Table)
    app.component('Example', Example)
    for (const key in components) {
      app.component(key, components[key])
    }
  }
}
