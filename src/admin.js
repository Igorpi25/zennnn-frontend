import Vue from 'vue'
import App from './AdminApp.vue'
import router from './router/admin'
import {
  i18n,
  vuetify,
  apolloProvider,
} from './plugins/admin'

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
