import LoggerClass from './Logger'

const level = process.env.NODE_ENV === 'production' ? 'WARN' : 'INFO'

export const Logger = LoggerClass

// global logger instance
export const logger = new LoggerClass(null, level)

const loggerPlugin = {
  install (app) {
    app.config.globalProperties.$logger = {
      log: (...msg) => {
        logger.log(...msg)
      },
      error: (...msg) => {
        logger.error(...msg)
      },
      warn: (...msg) => {
        logger.warn(...msg)
      },
      info: (...msg) => {
        logger.info(...msg)
      },
      debug: (...msg) => {
        logger.debug(...msg)
      },
      verbose: (...msg) => {
        logger.verbose(...msg)
      },
    }
  },
}

export default loggerPlugin
