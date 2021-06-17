import { createRouter, createWebHistory } from 'vue-router'
import { auth, isLoggedIn } from '../plugins'

import type { RouteRecordRaw } from 'vue-router'

/**
 * Check auth of current user
 * @return {boolean} - logged in
 */
export const checkAuth = async () => {
  try {
    const session = await auth.currentSession()
    const loggedIn = !!session.getIdToken().getJwtToken()
    isLoggedIn.value = loggedIn
    return loggedIn
  } catch (error) {
    isLoggedIn.value = false
    return false
  }
}

const routes: RouteRecordRaw[] = [
  // TODO: control redirect on CloudFront with Lamda@Edge
  // https://aws.amazon.com/blogs/compute/implementing-default-directory-indexes-in-amazon-s3-backed-amazon-cloudfront-origins-using-lambdaedge/
  // remove index.html with `x-amz-website-redirect-location` metadata
  {
    path: '/',
    name: 'Words',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "words" */ '../views/Words'),
  },
  {
    path: '/login',
    name: 'Login',
    meta: { requiresNotAuth: true },
    component: () => import(/* webpackChunkName: "login" */ '../views/Login'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () =>
      import(/* webpackChunkName: "common" */ 'shared/components/NotFound'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  // check auth
  const loggedIn = await checkAuth()
  if (to.meta.requiresAuth && !loggedIn) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    return {
      name: 'Login',
      query:
        to.fullPath && to.fullPath !== '/' && to.fullPath !== '/login'
          ? { redirect: to.fullPath }
          : {},
    }
  } else if (to.meta.requiresNotAuth && loggedIn) {
    return { name: 'Words' }
  }
})

export default router
