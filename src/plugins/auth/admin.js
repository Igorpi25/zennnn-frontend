import Vue from 'vue'
import Auth from './Auth'

const _instance = new Auth({
  userPoolId: process.env.VUE_APP_ADMIN_AWS_COGNITO_USER_POOL_ID,
  userPoolWebClientId: process.env.VUE_APP_ADMIN_AWS_COGNITO_USER_POOL_WEB_CLIENT_ID,
})

const AuthPlugin = {
  install (Vue) {
    if (AuthPlugin.installed) return
    Object.defineProperties(Vue.prototype, {
      $Auth: {
        get () {
          return _instance
        },
      },
    })
  },
}

Vue.use(AuthPlugin)

export default _instance
