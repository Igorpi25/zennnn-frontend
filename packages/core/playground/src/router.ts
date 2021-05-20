import {
  createRouter,
  createWebHistory,
} from 'vue-router'
import { kebabCase } from 'lodash-es'

// Auto generates routes from vue files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
const pages = import.meta.glob('./components/**/*.vue')

interface Route {
  name: string
  path: string
}

const routesGroupMap = {} as Record<string, Route[]>

const routes = Object.keys(pages).map((key) => {
  const componentPath = key.match(/\.\/components(.*)\.vue$/)![1]
  const path = componentPath.split('/').map(p => kebabCase(p)).join('/')
  const name = kebabCase(path)
  const [groupName] = path.slice(1).split('/')
  const route = { name, path }
  if (!routesGroupMap[groupName]) {
    routesGroupMap[groupName] = [route]
  } else {
    routesGroupMap[groupName].push(route)
  }
  return {
    name,
    path,
    component: () => import(`./components/${componentPath}.vue`),
  }
})

const routesGroup = Object.entries(routesGroupMap).map(([name, children]) => ({ name, children}))

export { routesGroup as routes }

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...routes,
    { path: '/', redirect: '/alert/usage' },
  ],
})

export default router
