import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

// Plugins
import i18n from './plugins/i18n'
import notify from './plugins/notify'

// Tailwindcss
import './assets/css/main.css'

createApp(App)
  .use(router)
  .use(i18n)
  .use(notify)
  .mount('#app')
