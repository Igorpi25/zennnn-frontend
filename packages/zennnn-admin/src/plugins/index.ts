import mitt from 'mitt'
import localforage from 'localforage'
// import { DefaultApolloClient } from '@vue/apollo-composable'

import { createDisplay, DisplaySymbol } from 'shared/composables/display'
import { createTheme, ThemeSymbol } from 'shared/composables/theme'
import { createNotify, NotifySymbol } from 'shared/composables/notify'

import Auth from 'shared/plugins/auth'
import Logger from 'shared/plugins/logger'
import i18nInstance from './i18n'
// import apolloClient from './apollo'

import type { App } from 'vue'

const i18n = i18nInstance.global
const display = createDisplay()
const theme = createTheme()
const notify = createNotify()

const auth = new Auth({
  region: process.env.VUE_APP_AWS_COGNITO_REGION,
  userPoolId: process.env.VUE_APP_AWS_COGNITO_USER_POOL_ID,
  userPoolWebClientId: process.env.VUE_APP_AWS_COGNITO_USER_POOL_WEB_CLIENT_ID,
})
const logger = new Logger(
  null,
  process.env.NODE_ENV === 'production' ? 'WARN' : 'INFO'
)

const store = localforage.createInstance({
  name: 'zn',
})

const emitter = mitt()

export { i18n, auth, logger, store, emitter }

export default {
  install(app: App) {
    app.use(i18nInstance)

    app.provide(DisplaySymbol, display)
    app.provide(ThemeSymbol, theme)
    app.provide(NotifySymbol, notify)

    // app.provide(DefaultApolloClient, apolloClient)
  },
}