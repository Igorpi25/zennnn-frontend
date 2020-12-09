import { createApp } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'

import App from './AdminApp.vue'
import router from './router/admin'

// Base components
import './components'

// Plugins
import i18n from './plugins/i18n/admin'
import auth from './plugins/auth/admin'
import apolloClient from './plugins/apollo/admin'
import notify from './plugins/notify'
import breakpoint from './plugins/breakpoint'
import logger from './plugins/logger'
import isoDate from './plugins/date-fns'

// Tailwindcss
import './assets/css/main.css'

createApp(App)
  .use(router)
  .use(i18n)
  .use(auth)
  .provide(DefaultApolloClient, apolloClient)
  .use(notify)
  .use(breakpoint)
  .use(logger)
  .use(isoDate)
  .mount('#app')
