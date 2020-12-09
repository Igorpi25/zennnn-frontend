import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

// Base components
import './components'

// Plugins
import i18n from './plugins/i18n'
import notify from './plugins/notify'
import breakpoint from './plugins/breakpoint'

// Tailwindcss
import './assets/css/main.css'

createApp(App)
  .use(router)
  .use(i18n)
  .use(notify)
  .use(breakpoint)
  .mount('#app')
