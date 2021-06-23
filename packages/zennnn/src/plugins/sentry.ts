import { init, configureScope, captureException } from '@sentry/browser'
import { Integrations } from '@sentry/tracing'
import pkg from '../../package.json'

import type { App } from 'vue'

const dsn = process.env.VUE_APP_SENTRY_DSN
const release = pkg.version
const revision = process.env.COMMIT_HASH || ''
const environment = process.env.VUE_APP_SENTRY_ENV

export default {
  install(app: App) {
    if (process.env.NODE_ENV === 'production' && dsn) {
      init({
        dsn,
        release,
        environment,
        integrations: [new Integrations.BrowserTracing()],
        tracesSampleRate: 1.0,
      })
      configureScope((scope) => {
        scope.setTag('revision', revision)
      })

      app.config.errorHandler = (err) => {
        captureException(err)
      }

      window.addEventListener('error', (event) => {
        captureException(event)
      })
      window.addEventListener('unhandledrejection', (event) => {
        captureException(event)
      })
    }
  },
}
