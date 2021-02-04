import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'vite-plugin-pages/client'

import * as components from '../../src'

import '../../docs/.vitepress/theme/index.css'
import App from './App.vue'
import Example from './Example.vue'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)

app.component('Example', Example)
for (const key in components) {
  app.component(key, components[key])
}

app.use(router)
app.mount('#app')
