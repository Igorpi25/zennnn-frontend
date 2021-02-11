import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'vite-plugin-pages/client'
import { createI18n } from 'vue-i18n'

import * as components from '../../src'

import '../../docs/.vitepress/theme/index.css'
import App from './App.vue'
import Example from './Example.vue'

import { datetimeFormats, numberFormats } from '../../../zennnn/src/plugins/i18n/formats'
import { slavicPluralRule } from '../../../zennnn/src/plugins/i18n/pluralizationRules'
import en from '../../../zennnn/src/locales/main/en.json'
import ru from '../../../zennnn/src/locales/main/ru.json'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...routes,
    { path: '/', redirect: '/alerts' },
  ],
})

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

const app = createApp(App)

app.component('Example', Example)
for (const key in components) {
  app.component(key, components[key])
}

app.use(i18n)
app.use(router)
app.mount('#app')
