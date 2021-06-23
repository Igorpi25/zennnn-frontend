import { createApp } from 'vue'

import App from './App'
import router from './router'
import plugins from './plugins'

import './index.css'

import './registerServiceWorker'

createApp(App).use(router).use(plugins).mount('#app')
