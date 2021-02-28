import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'pages-generated'
import { createI18n } from 'vue-i18n'

import * as components from '../../src'

import '../../docs/.vitepress/theme/index.css'
import App from './App.vue'
import Example from './Example.vue'

import { datetimeFormats, numberFormats } from '../../docs/.vitepress/theme/plugins/i18n/formats'
import en from '../../docs/.vitepress/theme/plugins/i18n/locales/en.json'

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
  },
  datetimeFormats,
  numberFormats,
})

const app = createApp(App)

app.component('Example', Example)
for (const key in components) {
  app.component(key, components[key])
}

app.use(i18n)
app.use(router)
app.mount('#app')
