import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/admin/Login.vue'
import WordList from '../views/admin/WordList.vue'
import NotFound from '../views/NotFound.vue'

import { Auth } from '../plugins/admin'

/**
 * Check auth of current user
 * @return {boolean} - logged in
 */
export const checkAuth = async () => {
  try {
    const session = await Auth.currentSession()
    const loggedIn = !!session.getIdToken().getJwtToken()
    return loggedIn
  } catch (error) {
    return false
  }
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: WordList,
    beforeEnter: async (to, from, next) => {
      try {
        const loggedIn = await checkAuth()
        if (!loggedIn) {
          return next({ name: 'login' })
        }
        return next()
      } catch (error) {
        // eslint-disable-next-line
        console.warn('Error on / before route enter', error.message)
        next(false)
      }
    },
  },
  {
    path: '/login',
    name: 'login',
    meta: { requiresNotAuth: true },
    component: Login,
  },
  {
    path: '/words',
    name: 'words',
    meta: { requiresAuth: true },
    component: WordList,
  },
  {
    path: '*',
    name: 'not-found',
    component: NotFound,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: '/admin/',
  routes,
})

router.beforeEach(async (to, from, next) => {
  // check auth
  const loggedIn = await checkAuth()
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!loggedIn) {
      next({
        name: 'login',
        query: to.fullPath && to.fullPath !== '/' && to.name !== 'login'
          ? { redirect: to.fullPath } : {},
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresNotAuth)) {
    if (loggedIn) {
      next({ name: 'home' })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router
