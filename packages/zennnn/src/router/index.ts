import { createRouter, createWebHistory } from 'vue-router'

import { CURRENT_LOCALE_STORE_KEY } from 'shared/config'
import { CURRENT_ORG_STORE_KEY, PAPER_SID_STORE_KEY } from '../config'
import { auth, i18n, emitter } from '../plugins'
import { apolloClient, isLoggedInVar } from '../plugins/apollo'

import { GET_ROLE_IN_PROJECT, GET_ORGS } from '../graphql/queries'

import type { RouteRecordRaw } from 'vue-router'
import type { NotifyOptions } from 'shared/composables/notify'

/**
 * Check auth of current user
 * @return {boolean} - logged in
 */
export const checkAuth = async () => {
  try {
    const session = await auth.currentSession()
    const loggedIn = !!session.getIdToken().getJwtToken()
    isLoggedInVar(loggedIn)
    return loggedIn
  } catch (error) {
    isLoggedInVar(false)
    return false
  }
}

const showNotify = (payload: string | NotifyOptions) => {
  emitter.emit('show-notify', payload)
}

const EmptyLayout = () =>
  import(/* webpackChunkName: "layout" */ '../views/layouts/Empty')

const Spec = () => import(/* webpackChunkName: "common" */ '../views/Spec.vue')
const Paper = () => import(/* webpackChunkName: "paper" */ '../views/Paper.vue')
const ClientCard = () =>
  import(/* webpackChunkName: "clients" */ '../views/clients/Card')
const SupplierCard = () =>
  import(/* webpackChunkName: "suppliers" */ '../views/suppliers/Card')
const CompanyCard = () =>
  import(/* webpackChunkName: "companies" */ '../views/companies/Card')

const routes: RouteRecordRaw[] = [
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/About'),
  },
  {
    path: '/pricing',
    name: 'pricing',
    meta: { scrollToTop: true },
    component: () =>
      import(/* webpackChunkName: "pricing" */ '../views/Pricing'),
  },
  {
    path: '/',
    name: 'main',
    component: () => import(/* webpackChunkName: "main" */ '../views/Main'),
    beforeEnter: async () => {
      try {
        const loggedIn = await checkAuth()
        if (!loggedIn) {
          return true
        }
        const orgId = localStorage.getItem(CURRENT_ORG_STORE_KEY) || ''
        return { name: 'deals', params: { orgId } }
      } catch (error) {
        // eslint-disable-next-line
        console.warn('Error on / before route enter', error.message)
      }
    },
  },
  {
    path: '/zn/:orgId?',
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "layout" */ '../views/layouts/Zn'),
    beforeEnter: async (to) => {
      try {
        const {
          data: { getOrgs },
        } = await apolloClient.query({
          query: GET_ORGS,
          fetchPolicy: 'cache-first',
        })
        if (!getOrgs || getOrgs.length === 0) {
          throw new Error('Not found')
        }
        const orgId = to.params.orgId as string
        if (!orgId) {
          const [org] = getOrgs
          if (org && org.id) {
            localStorage.setItem(CURRENT_ORG_STORE_KEY, orgId)
            return { name: 'deals', params: { orgId: org.id } }
          } else {
            localStorage.removeItem(CURRENT_ORG_STORE_KEY)
            throw new Error('Not found')
          }
        } else if (getOrgs.some((el: any) => el.id === orgId)) {
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
        name: 'deals',
        meta: { requiresAuth: true },
        component: () =>
          import(/* webpackChunkName: "deals" */ '../views/deals'),
      },
      {
        path: 'spec/:specId',
        name: 'spec',
        meta: { requiresAuth: true, scrollToTop: true },
        component: Spec,
        beforeEnter: async (to) => {
          try {
            const specId = to.params.specId
            const {
              data: { roleInProject },
            } = await apolloClient.query({
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
        component: () =>
          import(/* webpackChunkName: "clients" */ '../views/clients'),
      },
      {
        path: 'clients/create/:groupId?',
        name: 'client-create',
        meta: { requiresAuth: true, scrollToTop: true },
        props: { create: true },
        component: ClientCard,
      },
      {
        path: 'clients/:groupId/:clientId',
        name: 'client',
        meta: { requiresAuth: true, scrollToTop: true },
        component: ClientCard,
      },
      {
        path: 'suppliers',
        name: 'suppliers',
        meta: { requiresAuth: true },
        component: () =>
          import(/* webpackChunkName: "suppliers" */ '../views/suppliers'),
      },
      {
        path: 'suppliers/create',
        name: 'supplier-create',
        meta: { requiresAuth: true, scrollToTop: true },
        props: { create: true },
        component: SupplierCard,
      },
      {
        path: 'suppliers/:supplierId',
        name: 'supplier',
        meta: { requiresAuth: true, scrollToTop: true },
        component: SupplierCard,
      },
      {
        path: 'staff',
        name: 'staff',
        meta: { requiresAuth: true },
        component: () =>
          import(/* webpackChunkName: "staff" */ '../views/staff'),
      },
      {
        path: 'dictionary',
        name: 'dictionary',
        meta: { requiresAuth: true },
        component: () =>
          import(/* webpackChunkName: "dictionary" */ '../views/dictionary'),
      },
      {
        path: 'companies',
        name: 'companies',
        meta: { requiresAuth: true },
        component: () =>
          import(/* webpackChunkName: "companies" */ '../views/companies'),
      },
      {
        path: 'companies/create',
        name: 'company-create',
        meta: { requiresAuth: true },
        props: { create: true },
        component: CompanyCard,
      },
      {
        path: 'companies/:companyId',
        name: 'company',
        meta: { requiresAuth: true, scrollToTop: true },
        component: CompanyCard,
      },
      {
        path: 'items',
        name: 'items',
        meta: { requiresAuth: true },
        component: () =>
          import(/* webpackChunkName: "items" */ '../views/items'),
      },
    ],
  },
  {
    path: '/payment/:type(CHANGE|PROMO|INVOICE)',
    name: 'payment',
    meta: { requiresAuth: true, scrollToTop: true },
    component: () =>
      import(/* webpackChunkName: "payment" */ '../views/account/Payment'),
  },
  {
    path: '/subscription',
    name: 'subscription',
    meta: { requiresAuth: true, scrollToTop: true },
    component: () =>
      import(
        /* webpackChunkName: "subscription" */ '../views/account/Subscription'
      ),
  },
  {
    path: '/invitations/:invitationId',
    name: 'invitation',
    component: () =>
      import(/* webpackChunkName: "invitation" */ '../views/Invitation'),
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
      } catch (error) {
        showNotify({
          color: 'error',
          text: error.message || '',
        })
        return { name: 'not-found' }
      }
    },
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
        localStorage.setItem(PAPER_SID_STORE_KEY, to.query.sid as string)
        return {
          name: 'paper',
          params: { specId: to.params.specId },
          query: {},
        }
      }
    },
  },
  {
    path: '/print/:docNo',
    name: 'print',
    component: () => import(/* webpackChunkName: "print" */ '../views/Print'),
    beforeEnter: (to) => {
      if (!to.params.docNo || !window.opener) {
        return '/'
      }
    },
  },
  // Auth
  {
    path: '/signin',
    name: 'signin',
    meta: { requiresNotAuth: true },
    component: () =>
      import(/* webpackChunkName: "auth" */ '../views/auth/SignIn'),
  },
  {
    path: '/signup',
    name: 'signup',
    meta: { requiresNotAuth: true },
    component: () =>
      import(/* webpackChunkName: "auth" */ '../views/auth/SignUp'),
  },
  {
    path: '/welcome',
    name: 'welcome',
    meta: { requiresNotAuth: true },
    component: () =>
      import(/* webpackChunkName: "auth" */ '../views/auth/Welcome'),
  },
  {
    path: '/email-confirm',
    name: 'email-confirm',
    component: EmptyLayout,
    beforeEnter: (to) => {
      if (to.query.username) {
        if (to.query.state === 'success') {
          showNotify({
            color: 'success',
            text: i18n.t('message.emailConfirmed'),
          })
        } else if (to.query.state === 'confirmed') {
          showNotify({
            color: 'warn',
            text: i18n.t('message.emailAlreadyConfirmed'),
          })
        } else if (to.query.state === 'error') {
          showNotify({
            color: 'error',
            text: to.query.message as string,
          })
        }
      }
      return { name: 'signin' }
    },
  },
  {
    path: '/password-restore',
    name: 'password-restore',
    meta: { requiresNotAuth: true },
    component: () =>
      import(/* webpackChunkName: "auth" */ '../views/auth/PasswordRestore'),
  },
  {
    path: '/password-restore/confirm',
    name: 'password-restore-confirm',
    component: () =>
      import(
        /* webpackChunkName: "auth" */ '../views/auth/PasswordRestoreConfirm'
      ),
    beforeEnter: (to) => {
      if (to.query.username && to.query.code && to.query.email) {
        return true
      } else {
        // Incorrect request to restore password
        showNotify({
          color: 'error',
          text: i18n.t('message.incorrectRestorePassword'),
        })
        return { name: 'signin' }
      }
    },
  },
  // Docs
  {
    path: '/agreement',
    beforeEnter: () => {
      window.location.href = '/docs/AGREEMENT.pdf'
      return false
    },
    component: EmptyLayout,
  },
  {
    path: '/policy',
    beforeEnter: () => {
      window.location.href = '/docs/PRIVACY%20POLICY.pdf'
      return false
    },
    component: EmptyLayout,
  },
  // alias for policy, for link in documents
  {
    path: '/privacy',
    beforeEnter: () => {
      window.location.href = '/docs/PRIVACY%20POLICY.pdf'
      return false
    },
    component: EmptyLayout,
  },
  {
    path: '/cloud',
    beforeEnter: () => {
      window.location.href = '/docs/ZENNNN%20CLOUD%20HOSTING.pdf'
      return false
    },
    component: EmptyLayout,
  },
  {
    path: '/security',
    beforeEnter: () => {
      window.location.href = '/docs/SECURITY%20POLICY.pdf'
      return false
    },
    component: EmptyLayout,
  },
  {
    path: '/dicslosure',
    beforeEnter: () => {
      window.location.href = '/docs/RESPONSIBLE%20DISCLOSURE.pdf'
      return false
    },
    component: EmptyLayout,
  },
  {
    path: '/acceptable',
    beforeEnter: () => {
      window.location.href = '/docs/ACCEPTABLE%20USE%20POLICY%20(CLOUD).pdf'
      return false
    },
    component: EmptyLayout,
  },
  {
    path: '/policy_iap',
    beforeEnter: () => {
      window.location.href = '/docs/IAP%20PRIVACY%20POLICY.pdf'
      return false
    },
    component: EmptyLayout,
  },
  // alias for policy_iap, for link in documents
  {
    path: '/privacy_iap',
    beforeEnter: () => {
      window.location.href = '/docs/IAP%20PRIVACY%20POLICY.pdf'
      return false
    },
    component: EmptyLayout,
  },
  {
    path: '/forbidden',
    name: 'forbidden',
    component: () =>
      import(/* webpackChunkName: "common" */ '../views/Forbidden'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () =>
      import(/* webpackChunkName: "common" */ '../views/NotFound'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
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

router.beforeEach(async (to) => {
  // browser language detect
  const localLang = localStorage.getItem(CURRENT_LOCALE_STORE_KEY)
  if (!localLang) {
    const defaultLang = process.env.VUE_APP_I18N_LOCALE || 'en'
    // @ts-ignore
    const userLanguage = navigator.userLanguage
    const userLang = navigator.language || userLanguage || ''
    // is not default lang
    if (!userLang.startsWith(defaultLang)) {
      const supportedLangs = i18n.availableLocales
      let lang = userLang.split('-')[0] || ''
      if (!supportedLangs.includes(lang)) {
        // default for not supported langs
        lang = defaultLang
        const langs = navigator.languages || []
        for (const sLang of supportedLangs) {
          if (langs.some((el) => (el || '').startsWith(sLang))) {
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
      query:
        to.fullPath && to.fullPath !== '/' && to.fullPath !== '/signin'
          ? { redirect: to.fullPath }
          : {},
    }
  } else if (to.meta.requiresNotAuth && loggedIn) {
    return '/'
  }
})

export default router
