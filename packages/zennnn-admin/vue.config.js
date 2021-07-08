const path = require('path')

module.exports = {
  publicPath:
    process.env.NODE_ENV === 'production' ? process.env.BASE_URL || '/' : '/',
  chainWebpack: (config) => {
    config.resolve.alias.set('shared', path.resolve(__dirname, '../shared'))
  },
  configureWebpack: (config) => {
    // webpack 5 not polyfill node crypto
    // crypto used in amazon-cognito-identity-js
    // can polyfill with
    // resolve.fallback: { crypto: require.resolve('crypto-browserify') }
    //
    config.resolve.fallback = { crypto: false }
  },
}
