import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import { Vue as VueIntegration } from '@sentry/integrations'
import pkg from '../../../package.json'

const dsn = process.env.VUE_APP_SENTRY_DSN
const release = pkg.version
const revision = process.env.COMMIT_HASH || ''
const environment = process.env.VUE_APP_SENTRY_ENV

if (process.env.NODE_ENV === 'production' && dsn) {
  Sentry.init({
    dsn,
    release,
    environment,
    integrations: [new VueIntegration({ Vue, attachProps: true })],
  })
  Sentry.configureScope((scope) => {
    scope.setTag('revision', revision)
  })
}
