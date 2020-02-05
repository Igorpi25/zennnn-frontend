import Vue from 'vue'
import App from './PaperApp.vue'
import router from './router/paper'
import {
  i18n,
  vuetify,
  apolloProvider,
} from './plugins/paper'

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
