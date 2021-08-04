import mitt from 'mitt'
import localforage from 'localforage'
import { DefaultApolloClient } from '@vue/apollo-composable'
import Auth from '@aws-amplify/auth'

import { createDisplay, DisplaySymbol } from 'shared/composables/display'
import { createTheme, ThemeSymbol } from 'shared/composables/theme'
import { createNotify, NotifySymbol } from 'shared/composables/notify'

import Logger from 'shared/plugins/logger'
import { parseDate, toISOString } from 'shared/utils/date'

import i18nInstance from './i18n'
import apolloClient from './apollo'
import sentry from './sentry'

import type { App } from 'vue'
import type { NotifyOptions } from 'shared/composables/notify'

const i18n = i18nInstance.global
const display = createDisplay()
const theme = createTheme()
const notify = createNotify()

Auth.configure({
  region: process.env.VUE_APP_AWS_COGNITO_REGION,
  userPoolId: process.env.VUE_APP_AWS_COGNITO_USER_POOL_ID,
  userPoolWebClientId: process.env.VUE_APP_AWS_COGNITO_USER_POOL_WEB_CLIENT_ID,
})
const auth = Auth

const logger = new Logger(
  null,
  process.env.NODE_ENV === 'production' ? 'WARN' : 'INFO'
)

const store = localforage.createInstance({
  name: 'zn',
})

const emitter = mitt<{
  showNotify: string | NotifyOptions
  showSystemMessage: string
}>()

const getUsername = async (defaultUsername = '_') => {
  let username = defaultUsername
  try {
    const user = await auth.currentUserPoolUser()
    if (user) {
      username = user.getUsername()
    }
  } catch (error) {
    // eslint-disable-line
    username = defaultUsername
  }
  return username
}

export { i18n, auth, logger, store, emitter, getUsername }

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
