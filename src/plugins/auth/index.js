import { default as AuthClass } from './Auth'

export const auth = new AuthClass()

const AuthPlugin = {
  install (app) {
    app.config.globalProperties.$auth = {
      get () {
        return auth
      },
    }
  },
}

export default AuthPlugin
