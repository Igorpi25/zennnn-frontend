import Vue from 'vue'
import VueRouter from 'vue-router'

import Preview from '../views/Preview.vue'
import NotFound from '../views/NotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'preview',
    meta: { requiresAuth: true },
    component: Preview,
  },
  {
    path: '*',
    name: 'not-found',
    component: NotFound,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
