import { ref } from 'vue'
import mitt from 'mitt'
import localforage from 'localforage'
import { DefaultApolloClient } from '@vue/apollo-composable'

import {
  createDisplay,
  useDisplay,
  DisplaySymbol,
} from 'shared/composables/display'
import { createTheme, useTheme, ThemeSymbol } from 'shared/composables/theme'
import {
  createNotify,
  useNotify,
  NotifySymbol,
} from 'shared/composables/notify'

import Auth from 'shared/plugins/auth'
import Logger from 'shared/plugins/logger'
import { parseDate, toISOString } from 'shared/utils/date'

import i18nInstance from './i18n'
import apolloClient from './apollo'
import sentry from './sentry'

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

const isLoggedIn = ref(false)

export {
  i18n,
  auth,
  logger,
  store,
  emitter,
  isLoggedIn,
  theme,
  useDisplay,
  useTheme,
  useNotify,
}

export default {
  install(app: App) {
    app.use(i18nInstance)
    app.use(sentry)

    app.provide(DisplaySymbol, display)
    app.provide(ThemeSymbol, theme)
    app.provide(NotifySymbol, notify)

    app.provide(DefaultApolloClient, apolloClient)

    // legacy
    app.config.globalProperties.$auth = auth
    app.config.globalProperties.$breakpoint = display
    app.config.globalProperties.$notify = notify
    app.config.globalProperties.$logger = logger
    app.config.globalProperties.$store = store
    app.config.globalProperties.$parseDate = parseDate
    app.config.globalProperties.$toISOString = toISOString
  },
}
