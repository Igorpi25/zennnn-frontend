import AuthClass from './Auth'

export const auth = new AuthClass({
  userPoolId: process.env.VUE_APP_ADMIN_AWS_COGNITO_USER_POOL_ID,
  userPoolWebClientId: process.env.VUE_APP_ADMIN_AWS_COGNITO_USER_POOL_WEB_CLIENT_ID,
})

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
