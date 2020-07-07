import Vue from 'vue'
import VueRouter from 'vue-router'

import Paper from '../views/Paper.vue'
import NotFound from '../views/NotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/:orgId/:specId',
    name: 'paper',
    meta: { requiresAuth: true },
    component: Paper,
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
