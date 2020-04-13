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

Vue.config.productionTip = false

new Vue({
  router,
  i18n,
  vuetify,
  apolloProvider,
  render: h => h(App),
}).$mount('#app')

// Intl polyfill https://github.com/andyearnshaw/Intl.js
async function initIntl () {
  if (typeof Intl === 'object') {
    return
  }
  await Promise.all([
    import(/* webpackChunkName: "intl" */ 'intl'),
    import(/* webpackChunkName: "intl" */ 'intl/locale-data/jsonp/ru'),
    import(/* webpackChunkName: "intl" */ 'intl/locale-data/jsonp/en'),
    import(/* webpackChunkName: "intl" */ 'intl/locale-data/jsonp/fr'),
    import(/* webpackChunkName: "intl" */ 'intl/locale-data/jsonp/uk'),
    import(/* webpackChunkName: "intl" */ 'intl/locale-data/jsonp/zh-Hans'),
    import(/* webpackChunkName: "intl" */ 'intl/locale-data/jsonp/zh-Hant'),
  ])
}

initIntl()
