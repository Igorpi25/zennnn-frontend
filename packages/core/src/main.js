import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'vite-plugin-pages/client'
import 'prismjs/themes/prism.css'

import App from './App.vue'
import './index.css'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App)
  .use(router)
  .mount('#app')
