const webpack = require('webpack')
const { execSync } = require('child_process')
const version = execSync('git describe --always').toString().trim()

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'FRONTEND_VERSION': JSON.stringify(version),
        },
      }),
    ],
  },
  pluginOptions: {
    i18n: {
      locale: 'ru',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
}
