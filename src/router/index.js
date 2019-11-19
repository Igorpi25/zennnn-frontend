import Vue from 'vue'
import VueRouter from 'vue-router'

import Specs from '../views/Specs.vue'
import Spec from '../views/Spec.vue'
import SignIn from '../views/SignIn.vue'
import SignUp from '../views/SignUp.vue'
import PasswordRestore from '../views/PasswordRestore.vue'
import PasswordRestoreConfirm from '../views/PasswordRestoreConfirm.vue'
import NotFound from '../views/NotFound.vue'

import Auth from '../plugins/auth'
import { apolloClient } from '../plugins/apollo'
import { GET_ROLE_IN_PROJECT } from '../graphql/queries'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Specs,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/spec/:specId',
    name: 'spec',
    component: Spec,
    meta: {
      requiresAuth: true,
    },
    beforeEnter: async (to, from, next) => {
      try {
        const specId = to.params.specId
        const { data: { roleInProject } } = await apolloClient.query({
          query: GET_ROLE_IN_PROJECT,
          variables: {
            specId,
          },
          fetchPolicy: 'network-only',
        })

        if (!roleInProject) {
          throw new Error('No have access!')
        }

        next()
      } catch (error) { // eslint-disable-line
        next(false)
      }
    },
  },
  {
    path: '/signin',
    name: 'signin',
    component: SignIn,
    meta: {
      requiresNotAuth: true,
    },
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUp,
    meta: {
      requiresNotAuth: true,
    },
  },
  {
    path: '/email-confirm',
    name: 'email-confirm',
    beforeEnter: (to, from, next) => {
      if (to.query.username) {
        if (to.query.state === 'success') {
          alert('Email confirmed.')
        } else if (to.query.state === 'confirmed') {
          alert('Email already confirmed.')
        } else if (to.query.state === 'error') {
          alert(`Email confirm error: ${to.query.message}`)
        }
      }
      next('/')
    },
  },
  {
    path: '/password-restore',
    name: 'password-restore',
    component: PasswordRestore,
  },
  {
    path: '/password-restore/confirm',
    name: 'password-restore-confirm',
    component: PasswordRestoreConfirm,
    beforeEnter: (to, from, next) => {
      if (to.query.username && to.query.code && to.query.email) {
        next()
      } else {
        // Incorrect request to restore password
        alert('Incorrect request to restore password.')
        next('/')
      }
    },
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

router.beforeEach(async (to, from, next) => {
  // check auth
  const loggedIn = await Auth.checkAuth()
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!loggedIn) {
      next({
        name: 'signin',
        query: to.fullPath && to.fullPath !== '/' && to.fullPath !== '/signin'
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
