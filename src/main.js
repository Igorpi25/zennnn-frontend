import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {
  i18n,
  vuetify,
  apolloProvider,
} from './plugins'

// Base components
import './components'

// Tailwindcss
import './assets/css/main.css'

import './registerServiceWorker'

Vue.config.productionTip = false

function runApp () {
  new Vue({
    router,
    i18n,
    vuetify,
    apolloProvider,
    render: h => h(App),
  }).$mount('#app')
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
