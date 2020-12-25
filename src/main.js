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

function runApp () {
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
}

// Intl polyfill https://github.com/andyearnshaw/Intl.js
if (!global.Intl) {
  require.ensure([
    'intl',
    'intl/locale-data/jsonp/en.js',
    'intl/locale-data/jsonp/fr.js',
    'intl/locale-data/jsonp/zh-Hans.js',
    'intl/locale-data/jsonp/zh-Hant.js',
    'intl/locale-data/jsonp/ru.js',
    'intl/locale-data/jsonp/uk.js',
  ], function (require) {
    require('intl')
    require('intl/locale-data/jsonp/en.js')
    require('intl/locale-data/jsonp/fr.js')
    require('intl/locale-data/jsonp/zh-Hans.js')
    require('intl/locale-data/jsonp/zh-Hant.js')
    require('intl/locale-data/jsonp/ru.js')
    require('intl/locale-data/jsonp/uk.js')
    runApp()
  }, 'intl')
} else {
  runApp()
}
