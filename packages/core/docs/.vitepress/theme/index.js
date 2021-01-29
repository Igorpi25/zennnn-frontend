import 'vitepress/dist/client/theme-default/styles/vars.css'
import 'vitepress/dist/client/theme-default/styles/code.css'

import Layout from './Layout.vue'
import NotFound from './NotFound.vue'
import Example from './components/Example.vue'
import Table from './components/Table.vue'
import * as components from '../../../src'

import './index.css'

export default {
  Layout,
  NotFound,
  enhanceApp({ app, router, siteData }) {
    // app is the Vue 3 app instance from `createApp()`. router is VitePress'
    // custom router. `siteData`` is a `ref`` of current site-level metadata.
    app.component('Table', Table)
    app.component('Example', Example)
    for (const key in components) {
      app.component(key, components[key])
    }
  }
}
