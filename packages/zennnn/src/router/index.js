import { createRouter, createWebHistory } from 'vue-router'

import { i18n } from '../plugins/i18n'
import { notify } from '../plugins/notify'
import { checkAuth } from '../plugins/auth/checkAuth'
import { apolloClient } from '../plugins/apollo'
import { CHECK_INVITATION, GET_ROLE_IN_PROJECT, GET_ORGS, GET_PROFILE } from '../graphql/queries'

import { CURRENT_LOCALE_STORE_KEY, CURRENT_ORG_STORE_KEY, PAPER_SID_STORE_KEY } from '../config/globals'

import SignIn from '../views/SignIn.vue'
import Registration from '../views/Registration.vue'
import SignUp from '../views/SignUp.vue'
import Welcome from '../views/Welcome.vue'
import PasswordRestore from '../views/PasswordRestore.vue'
import PasswordRestoreConfirm from '../views/PasswordRestoreConfirm.vue'
import Print from '../views/Print.vue'
import NotFound from '../views/NotFound.vue'

import Pricing from '../views/Pricing.vue'
import OrgLayout from '../views/OrgLayout.vue'
import Payment from '../views/Payment.vue'
import Subscription from '../views/Subscription.vue'
import WordList from '../views/WordList.vue'
import RequisiteList from '../views/RequisiteList.vue'
import RequisiteItem from '../views/RequisiteItem.vue'
import ItemList from '../views/ItemList.vue'
import Specs from '../views/Specs.vue'
import Spec from '../views/Spec.vue'
import ClientItem from '../views/ClientItem.vue'
import ClientList from '../views/ClientList.vue'
import SupplierItem from '../views/SupplierItem.vue'
import SupplierList from '../views/SupplierList.vue'
import Staff from '../views/Staff.vue'
import Invitation from '../views/Invitation.vue'

import Paper from '../views/Paper.vue'

const Home = () => import(/* webpackChunkName: "home" */ '../views/Home.vue')

const About = () => import(/* webpackChunkName: "about" */ '../views/About.vue')

// Tailwind utility and components layers sort not working with lazy loading routes

// const SignIn = () => import(/* webpackChunkName: "common" */ '../views/SignIn.vue')
// const Registration = () => import(/* webpackChunkName: "common" */ '../views/Registration.vue')
// const SignUp = () => import(/* webpackChunkName: "common" */ '../views/SignUp.vue')
// const Welcome = () => import(/* webpackChunkName: "common" */ '../views/Welcome.vue')
// const PasswordRestore = () => import(/* webpackChunkName: "common" */ '../views/PasswordRestore.vue')
// const PasswordRestoreConfirm = () => import(/* webpackChunkName: "common" */ '../views/PasswordRestoreConfirm.vue')
// const Print = () => import(/* webpackChunkName: "common" */ '../views/Print.vue')
// const NotFound = () => import(/* webpackChunkName: "common" */ '../views/NotFound.vue')

// const Pricing = () => import(/* webpackChunkName: "common" */ '../views/Pricing.vue')
// const OrgLayout = () => import(/* webpackChunkName: "common" */ '../views/OrgLayout.vue')
// const Payment = () => import(/* webpackChunkName: "common" */ '../views/Payment.vue')
// const Subscription = () => import(/* webpackChunkName: "common" */ '../views/Subscription.vue')
// const WordList = () => import(/* webpackChunkName: "common" */ '../views/WordList.vue')
// const RequisiteList = () => import(/* webpackChunkName: "common" */ '../views/RequisiteList.vue')
// const RequisiteItem = () => import(/* webpackChunkName: "common" */ '../views/RequisiteItem.vue')
// const ItemList = () => import(/* webpackChunkName: "common" */ '../views/ItemList.vue')
// const Specs = () => import(/* webpackChunkName: "common" */ '../views/Specs.vue')
// const Spec = () => import(/* webpackChunkName: "common" */ '../views/Spec.vue')
// const ClientItem = () => import(/* webpackChunkName: "common" */ '../views/ClientItem.vue')
// const ClientList = () => import(/* webpackChunkName: "common" */ '../views/ClientList.vue')
// const SupplierItem = () => import(/* webpackChunkName: "common" */ '../views/SupplierItem.vue')
// const SupplierList = () => import(/* webpackChunkName: "common" */ '../views/SupplierList.vue')
// const Staff = () => import(/* webpackChunkName: "common" */ '../views/Staff.vue')
// const Invitation = () => import(/* webpackChunkName: "common" */ '../views/Invitation.vue')

// const Paper = () => import(/* webpackChunkName: "paper" */ '../views/Paper.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    beforeEnter: async () => {
      try {
        const loggedIn = await checkAuth()
        if (!loggedIn) {
          return true
        }
        const orgId = localStorage.getItem(CURRENT_ORG_STORE_KEY) || ''
        return { name: 'specs', params: { orgId } }
      } catch (error) {
        // eslint-disable-next-line
        console.warn('Error on / before route enter', error.message)
      }
    },
  },
  {
    path: '/zn/:orgId?',
    meta: { requiresAuth: true },
    component: OrgLayout,
    beforeEnter: async (to) => {
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
            return { name: 'specs', params: { orgId: org.id } }
          } else {
            localStorage.removeItem(CURRENT_ORG_STORE_KEY)
            throw new Error('Not found')
          }
        } else if (getOrgs.some(el => el.id === orgId)) {
          localStorage.setItem(CURRENT_ORG_STORE_KEY, orgId)
          return true
        } else {
          localStorage.removeItem(CURRENT_ORG_STORE_KEY)
          throw new Error('Not found')
        }
      } catch (error) {
        if (error.message === 'Not found') {
          return { name: 'not-found' }
        } else {
          throw new Error(error)
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
        beforeEnter: async (to) => {
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
          } catch (error) {
            throw new Error(error)
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
        path: 'clients/:groupId?/create',
        name: 'client-create',
        meta: { requiresAuth: true, scrollToTop: true },
        props: { create: true },
        component: ClientItem,
      },
      {
        path: 'clients/:groupId/:clientId',
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
        path: 'dictionary',
        name: 'dictionary',
        meta: { requiresAuth: true },
        component: WordList,
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
      {
        path: 'goods',
        name: 'items',
        meta: { requiresAuth: true },
        component: ItemList,
      },
    ],
  },
  {
    path: '/pricing',
    name: 'pricing',
    meta: { scrollToTop: true },
    component: Pricing,
    beforeEnter: async () => {
      try {
        const loggedIn = await checkAuth()
        if (loggedIn) {
          await apolloClient.query({
            query: GET_ORGS,
            fetchPolicy: 'cache-first',
          })
          await apolloClient.query({
            query: GET_PROFILE,
            fetchPolicy: 'cache-first',
          })
        }
      } catch (error) {
        // eslint-disable-next-line
        console.log('Error on navigation to pricing.', error)
      }
    },
  },
  {
    path: '/payment/:type(change|promo|invoice)',
    name: 'payment',
    meta: { requiresAuth: true, scrollToTop: true },
    component: Payment,
    beforeEnter: async () => {
      try {
        await apolloClient.query({
          query: GET_ORGS,
          fetchPolicy: 'cache-first',
        })
        const { data: { getProfile } } = await apolloClient.query({
          query: GET_PROFILE,
          fetchPolicy: 'cache-first',
        })
        const orgId = getProfile && getProfile.account && getProfile.account.org
        if (!orgId) {
          return false
        }
      } catch (error) {
        throw new Error(error)
      }
    },
  },
  {
    path: '/subscription',
    name: 'subscription',
    meta: { requiresAuth: true, scrollToTop: true },
    component: Subscription,
    beforeEnter: async () => {
      try {
        await apolloClient.query({
          query: GET_ORGS,
          fetchPolicy: 'cache-first',
        })
        const { data: { getProfile } } = await apolloClient.query({
          query: GET_PROFILE,
          fetchPolicy: 'cache-first',
        })
        const orgId = getProfile && getProfile.account && getProfile.account.org
        if (!orgId) {
          return false
        }
      } catch (error) {
        throw new Error(error)
      }
    },
  },
  {
    path: '/invitations/:invitationId',
    name: 'invitation',
    component: Invitation,
    beforeEnter: async (to) => {
      try {
        const id = to.params.invitationId
        if (!id) {
          throw new Error('No valid link')
        }

        const loggedIn = await checkAuth()
        if (!loggedIn) {
          return { name: 'signin', query: { redirect: `/invitations/${id}` } }
        }

        const { data: { checkInvitation } } = await apolloClient.query({
          query: CHECK_INVITATION,
          variables: { id },
          fetchPolicy: 'network-only',
        })

        if (!checkInvitation) {
          throw new Error('No valid link!')
        }
      } catch (error) {
        notify.show({ color: 'error', text: error.message || '' })
        return { name: 'not-found' }
      }
    },
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
  {
    path: '/paper/:specId',
    name: 'paper',
    component: Paper,
    meta: { requiresAuth: true, scrollToTop: true },
    beforeEnter: async (to) => {
      try {
        await apolloClient.query({
          query: GET_ORGS,
          fetchPolicy: 'cache-first',
        })
      } catch (error) {
        // eslint-disable-next-line
        console.log('Error on navigation to overview.', error)
      }
      if (to.query.sid) {
        localStorage.setItem(PAPER_SID_STORE_KEY, to.query.sid)
        return { name: 'paper', params: { specId: to.params.specId }, query: {} }
      }
    },
  },
  {
    path: '/print/:docNo',
    name: 'print',
    component: Print,
    beforeEnter: (to) => {
      if (!to.params.docNo || !window.opener) {
        return false
      }
      notify.show({
        color: 'primary',
        text: i18n.t('message.documentGenerateLoading'),
        timeout: 0,
        close: false,
      })
    },
  },
  {
    path: '/signin',
    name: 'signin',
    meta: { requiresNotAuth: true },
    component: SignIn,
  },
  // TODO: need check
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
    beforeEnter: (to) => {
      if (to.query.username) {
        if (to.query.state === 'success') {
          notify.show({ color: 'success', text: i18n.t('message.emailConfirmed') })
        } else if (to.query.state === 'confirmed') {
          notify.show({ color: 'warn', text: i18n.t('message.emailAlreadyConfirmed') })
        } else if (to.query.state === 'error') {
          notify.show({ color: 'error', text: to.query.message })
          // Add message to Analytics
        }
      }
      return { name: 'signin' }
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
    beforeEnter: (to) => {
      if (to.query.username && to.query.code && to.query.email) {
        return true
      } else {
        // Incorrect request to restore password
        notify.show({ color: 'error', text: i18n.t('message.incorrectRestorePassword') })
        return { name: 'signin' }
      }
    },
  },
  // docs
  {
    path: '/agreenemt',
    beforeEnter: (to, from, next) => {
      window.location = '/docs/AGREEMENT.pdf'
      next(false)
    },
  },
  {
    path: '/policy',
    beforeEnter: (to, from, next) => {
      window.location = '/docs/PRIVACY%20POLICY.pdf'
      next(false)
    },
  },
  // alias for policy, for link in documents
  {
    path: '/privacy',
    beforeEnter: (to, from, next) => {
      window.location = '/docs/PRIVACY%20POLICY.pdf'
      next(false)
    },
  },
  {
    path: '/cloud',
    beforeEnter: (to, from, next) => {
      window.location = '/docs/ZENNNN%20CLOUD%20HOSTING.pdf'
      next(false)
    },
  },
  {
    path: '/security',
    beforeEnter: (to, from, next) => {
      window.location = '/docs/SECURITY%20POLICY.pdf'
      next(false)
    },
  },
  {
    path: '/dicslosure',
    beforeEnter: (to, from, next) => {
      window.location = '/docs/RESPONSIBLE%20DISCLOSURE.pdf'
      next(false)
    },
  },
  {
    path: '/acceptable',
    beforeEnter: (to, from, next) => {
      window.location = '/docs/ACCEPTABLE%20USE%20POLICY%20(CLOUD).pdf'
      next(false)
    },
  },
  {
    path: '/policy_iap',
    beforeEnter: (to, from, next) => {
      window.location = '/docs/IAP%20PRIVACY%20POLICY.pdf'
      next(false)
    },
  },
  // alias for policy_iap, for link in documents
  {
    path: '/privacy_iap',
    beforeEnter: (to, from, next) => {
      window.location = '/docs/IAP%20PRIVACY%20POLICY.pdf'
      next(false)
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior (to, from, savedPosition) {
    if (to.matched.some((m) => m.meta.scrollToTop)) {
      return { left: 0, top: 0 }
    }
    if (savedPosition) {
      return savedPosition
    } else {
      return {}
    }
  },
  routes,
})

router.beforeEach(async (to, from) => {
  // browser language detect
  const localLang = localStorage.getItem(CURRENT_LOCALE_STORE_KEY)
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
      localStorage.setItem(CURRENT_LOCALE_STORE_KEY, lang)
      i18n.locale = lang
    }
  }
  // check auth
  const loggedIn = await checkAuth()
  if (to.meta.requiresAuth && !loggedIn) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    return {
      name: 'signin',
      query: to.fullPath && (to.fullPath !== '/' || to.fullPath !== '/signin')
        ? { redirect: to.fullPath }
        : {},
    }
  } else if (to.meta.requiresNotAuth && loggedIn) {
    return { name: 'home' }
  } else {
    // set light theme permanently
    const fromUndef = from.name === undefined && from.path === '/'
    if (fromUndef && (to.name === 'paper' || to.name === 'about' || to.name === 'pricing' || to.name === 'payment' || to.name === 'subscription')) {
      setTheme('light')
    }
  }
})

router.beforeResolve((to) => {
  let theme = 'dark'
  if (to.name === 'paper' || to.name === 'about' || to.name === 'pricing' || to.name === 'payment' || to.name === 'subscription') {
    theme = 'light'
  }
  // set theme meta && attribute
  setTheme(theme)
})

const setTheme = (theme) => {
  if (theme === 'dark') {
    document.querySelector('html').classList.add('dark')
  } else {
    document.querySelector('html').classList.remove('dark')
  }
  const themeColor = theme === 'dark' ? '#1E1E1E' : '#ffffff'
  document.head.querySelector('meta[name="theme-color"]')
    .setAttribute('content', themeColor)
}

export default router