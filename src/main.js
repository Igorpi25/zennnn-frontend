import { createApp } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'

import App from './App.vue'
import router from './router'

// Plugins
import i18n from './plugins/i18n'
import auth from './plugins/auth'
import apolloClient from './plugins/apollo'
import notify from './plugins/notify'
import breakpoint from './plugins/breakpoint'
import logger from './plugins/logger'
import store from './plugins/localforage'
import isoDate from './plugins/date-fns'

// Tailwindcss
import './assets/css/main.css'

import './registerServiceWorker'

createApp(App)
  .use(router)
  .use(i18n)
  .use(auth)
  .provide(DefaultApolloClient, apolloClient)
  .use(notify)
  .use(breakpoint)
  .use(logger)
  .use(store)
  .use(isoDate)
  .mount('#app')
