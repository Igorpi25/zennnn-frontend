import Vue from 'vue'
import VueRouter from 'vue-router'

// TODO: Uncaught TypeError: y.b is not a constructor
import OrgLayout from '../views/OrgLayout.vue'

import { Auth, i18n } from '../plugins'
import { apolloClient } from '../plugins/apollo'
import { CHECK_INVITATION, GET_ROLE_IN_PROJECT, GET_ORGS } from '../graphql/queries'

import { CURRENT_LANG_STORE_KEY, CURRENT_ORG_STORE_KEY, PAPER_SID_STORE_KEY } from '../config/globals'

const Home = () => import(/* webpackChunkName: "home" */ '../views/About.vue')
const RequisiteList = () => import(/* webpackChunkName: "main" */ '../views/RequisiteList.vue')
const RequisiteItem = () => import(/* webpackChunkName: "main" */ '../views/RequisiteItem.vue')
// const OrgLayout = () => import(/* webpackChunkName: "main" */ '../views/OrgLayout.vue')
const Specs = () => import(/* webpackChunkName: "main" */ '../views/Specs.vue')
const Spec = () => import(/* webpackChunkName: "main" */ '../views/Spec.vue')
const ClientItem = () => import(/* webpackChunkName: "main" */ '../views/ClientItem.vue')
const ClientList = () => import(/* webpackChunkName: "main" */ '../views/ClientList.vue')
const SupplierItem = () => import(/* webpackChunkName: "main" */ '../views/SupplierItem.vue')
const SupplierList = () => import(/* webpackChunkName: "main" */ '../views/SupplierList.vue')
const Staff = () => import(/* webpackChunkName: "main" */ '../views/Staff.vue')
const Preview = () => import(/* webpackChunkName: "paper" */ '../views/Preview.vue')
const Invitation = () => import(/* webpackChunkName: "main" */ '../views/Invitation.vue')
const SignIn = () => import(/* webpackChunkName: "common" */ '../views/SignIn.vue')
const Registration = () => import(/* webpackChunkName: "common" */ '../views/Registration.vue')
const SignUp = () => import(/* webpackChunkName: "common" */ '../views/SignUp.vue')
const Welcome = () => import(/* webpackChunkName: "common" */ '../views/Welcome.vue')
const PasswordRestore = () => import(/* webpackChunkName: "common" */ '../views/PasswordRestore.vue')
const PasswordRestoreConfirm = () => import(/* webpackChunkName: "common" */ '../views/PasswordRestoreConfirm.vue')
const NotFound = () => import(/* webpackChunkName: "common" */ '../views/NotFound.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    beforeEnter: async (to, from, next) => {
      try {
        const loggedIn = await Auth.checkAuth()
        if (!loggedIn) {
          // set light theme permanently
          document.body.dataset.theme = 'light'
          return next()
        }
        const orgId = localStorage.getItem(CURRENT_ORG_STORE_KEY) || ''
        return next({ name: 'specs', params: { orgId } })
      } catch (error) {
        // eslint-disable-next-line
        console.warn('Error on / before route enter')
        next()
      }
    },
  },
  {
    path: '/z-:orgId',
    meta: { requiresAuth: true },
    component: OrgLayout,
    beforeEnter: async (to, from, next) => {
      try {
        const { data: { getOrgs } } = await apolloClient.query({
          query: GET_ORGS,
          fetchPolicy: 'cache-first',
        })
        if (!getOrgs || getOrgs.length === 0) {
          throw new Error('Not found')
        }
        const orgId = to.params.orgId
        if (!orgId) {
          const [org] = getOrgs
          if (org && org.id) {
            localStorage.setItem(CURRENT_ORG_STORE_KEY, orgId)
            next({ name: 'specs', params: { orgId: org.id } })
          } else {
            localStorage.removeItem(CURRENT_ORG_STORE_KEY)
            throw new Error('Not found')
          }
        } else if (getOrgs.some(el => el.id === orgId)) {
          localStorage.setItem(CURRENT_ORG_STORE_KEY, orgId)
          next()
        } else {
          localStorage.removeItem(CURRENT_ORG_STORE_KEY)
          throw new Error('Not found')
        }
      } catch (error) {
        if (error.message === 'Not found') {
          next('not-found')
        } else {
          next(false)
        }
      }
    },
    children: [
      {
        path: '',
        name: 'specs',
        meta: { requiresAuth: true },
        component: Specs,
      },
      {
        path: 'spec/:specId',
        name: 'spec',
        meta: { requiresAuth: true, scrollToTop: true },
        component: Spec,
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
        path: 'clients',
        name: 'clients',
        meta: { requiresAuth: true },
        component: ClientList,
      },
      {
        path: 'clients/create',
        name: 'client-create',
        meta: { requiresAuth: true, scrollToTop: true },
        props: { create: true },
        component: ClientItem,
      },
      {
        path: 'clients/:clientId',
        name: 'client',
        meta: { requiresAuth: true, scrollToTop: true },
        component: ClientItem,
      },
      {
        path: 'suppliers',
        name: 'suppliers',
        meta: { requiresAuth: true },
        component: SupplierList,
      },
      {
        path: 'suppliers/create',
        name: 'supplier-create',
        meta: { requiresAuth: true, scrollToTop: true },
        props: { create: true },
        component: SupplierItem,
      },
      {
        path: 'suppliers/:supplierId',
        name: 'supplier',
        meta: { requiresAuth: true, scrollToTop: true },
        component: SupplierItem,
      },
      {
        path: 'staff',
        name: 'staff',
        meta: { requiresAuth: true },
        component: Staff,
      },
      {
        path: 'requisites',
        name: 'requisites',
        meta: { requiresAuth: true },
        component: RequisiteList,
      },
      {
        path: 'requisites/create',
        name: 'requisite-create',
        meta: { requiresAuth: true },
        props: { create: true },
        component: RequisiteItem,
      },
      {
        path: 'requisites/:reqId',
        name: 'requisite',
        meta: { requiresAuth: true, scrollToTop: true },
        component: RequisiteItem,
      },
    ],
  },
  {
    path: '/invitations/:invitationId',
    name: 'invitation',
    component: Invitation,
    beforeEnter: async (to, from, next) => {
      try {
        const id = to.params.invitationId
        if (!id) {
          throw new Error('No valid link')
        }

        const loggedIn = await Auth.checkAuth()
        if (!loggedIn) {
          return next({ name: 'signin', query: { redirect: `/invitations/${id}` } })
        }

        const { data: { checkInvitation } } = await apolloClient.query({
          query: CHECK_INVITATION,
          variables: { id },
          fetchPolicy: 'network-only',
        })

        if (!checkInvitation) {
          throw new Error('No valid link!')
        }

        next()
      } catch (error) {
        router.app.$notify({ color: 'red', text: error.message || '' })
        next('/not-found')
      }
    },
  },
  {
    path: '/about',
    name: 'about',
    component: Home,
  },
  {
    path: '/paper/:specId',
    name: 'preview',
    component: Preview,
    meta: { scrollToTop: true },
    beforeEnter: (to, from, next) => {
      if (to.query.sid) {
        localStorage.setItem(PAPER_SID_STORE_KEY, to.query.sid)
        return next({ name: 'preview', params: { specId: to.params.specId }, query: {} })
      }
      next()
    },
  },
  {
    path: '/signin',
    name: 'signin',
    meta: { requiresNotAuth: true },
    component: SignIn,
  },
  {
    path: '/registration',
    name: 'registration',
    meta: { requiresNotAuth: true },
    component: Registration,
  },
  {
    path: '/signup',
    name: 'signup',
    meta: { requiresNotAuth: true },
    component: SignUp,
  },
  {
    path: '/welcome',
    name: 'welcome',
    meta: { requiresNotAuth: true },
    component: Welcome,
  },
  {
    path: '/email-confirm',
    name: 'email-confirm',
    beforeEnter: (to, from, next) => {
      if (to.query.username) {
        if (to.query.state === 'success') {
          router.app.$notify({ color: 'green', text: i18n.t('message.emailConfirmed') })
        } else if (to.query.state === 'confirmed') {
          router.app.$notify({ color: 'orange', text: i18n.t('message.emailAlreadyConfirmed') })
        } else if (to.query.state === 'error') {
          router.app.$notify({ color: 'red', text: to.query.message })
          // Add message to Analytics
        }
      }
      next('/signin')
    },
  },
  {
    path: '/password-restore',
    name: 'password-restore',
    meta: { requiresNotAuth: true },
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
        router.app.$notify({ color: 'red', text: i18n.t('message.incorrectRestorePassword') })
        next('/signin')
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
  scrollBehavior (to, from, savedPosition) {
    if (to.matched.some((m) => m.meta.scrollToTop)) {
      return { x: 0, y: 0 }
    }
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes,
})

router.beforeEach(async (to, from, next) => {
  // browser language detect
  const localLang = localStorage.getItem(CURRENT_LANG_STORE_KEY)
  if (!localLang) {
    const defaultLang = process.env.VUE_APP_I18N_LOCALE || 'en'
    const userLang = navigator.language || navigator.userLanguage || ''
    // is not default lang
    if (!userLang.startsWith(defaultLang)) {
      const supportedLangs = i18n.availableLocales
      let lang = userLang.split('-')[0] || ''
      if (!supportedLangs.includes(lang)) {
        // default for not supported langs
        lang = defaultLang
        const langs = navigator.languages || []
        for (const sLang of supportedLangs) {
          if (langs.some(el => (el || '').startsWith(sLang))) {
            lang = sLang
            break
          }
        }
      }
      localStorage.setItem(CURRENT_LANG_STORE_KEY, lang)
      i18n.locale = lang
    }
  }
  // set light theme permanently
  if (to.name === 'preview' || to.name === 'about') {
    document.body.dataset.theme = 'light'
  }
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
    if (!loggedIn && to.path === '/') {
      return next()
    }
    next() // make sure to always call next()!
  }
})

router.beforeResolve((to, from, next) => {
  // set theme attribute
  if (to.path === '/' || to.name === 'preview' || to.name === 'about') {
    document.body.dataset.theme = 'light'
  } else {
    document.body.dataset.theme = 'dark'
  }
  next()
})

export default router
