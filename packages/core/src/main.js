import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'vite-plugin-pages/client'
import 'prismjs/themes/prism.css'

import App from './App.vue'
import './index.css'

async function scrollBehavior (to, from, savedPosition) {
  return new Promise((resolve, reject) => {
    window.requestAnimationFrame(() => {
      if (to.hash) {
        resolve({
          el: to.hash,
          top: 64,
        })
      } else if (savedPosition) {
        resolve(savedPosition)
      } else {
        resolve({ top: 0 })
      }
    })
  })
}

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior,
})

createApp(App)
  .use(router)
  .mount('#app')
