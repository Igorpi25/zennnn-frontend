import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { datetimeFormats, numberFormats } from '/@shared/plugins/i18n/formats'
import en from '/@shared/plugins/i18n/locales/en.json'
import '/@shared/index.css'
import * as components from 'core-components'
import App from './App.vue'
import router from './router'

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

for (const key in components) {
  // @ts-ignore
  app.component(key, components[key])
}

app.use(router)
app.use(i18n)

app.mount('#app')
