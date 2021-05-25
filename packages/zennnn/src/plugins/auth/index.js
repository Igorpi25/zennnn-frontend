import AuthClass from './Auth'

export const auth = new AuthClass()

const AuthPlugin = {
  install(app) {
    app.config.globalProperties.$auth = auth
  },
}

export default AuthPlugin
