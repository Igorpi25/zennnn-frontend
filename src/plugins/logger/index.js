import Logger from './Logger'

const level = process.env.NODE_ENV === 'production' ? 'WARN' : 'INFO'

// global logger instance
const _instance = new Logger(null, level)

export const logger = {
  install (app) {
    app.config.globalProperties.$logger = {
      get () {
        return {
          log: (...msg) => {
            _instance.log(...msg)
          },
          error: (...msg) => {
            _instance.error(...msg)
          },
          warn: (...msg) => {
            _instance.warn(...msg)
          },
          info: (...msg) => {
            _instance.info(...msg)
          },
          debug: (...msg) => {
            _instance.debug(...msg)
          },
          verbose: (...msg) => {
            _instance.verbose(...msg)
          },
        }
      },
    }
  },
}

export default Logger
