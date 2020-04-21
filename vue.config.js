const webpack = require('webpack')
const { execSync } = require('child_process')
const pkgVersion = require('./package.json').version
const commitHash = execSync('git rev-parse HEAD').toString().trim().slice(0, 7)
const version = `v${pkgVersion}-${commitHash}`
// const version = execSync('git describe --always').toString().trim()
const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin')

module.exports = {
  configureWebpack: {
    plugins: [
      new PrerenderSPAPlugin({
        // Required - The path to the webpack-outputted app to prerender.
        staticDir: path.join(__dirname, 'dist'),
  
        // Optional - The path your rendered app should be output to.
        // (Defaults to staticDir.)
        // outputDir: path.join(__dirname, 'dist'),
  
        // Optional - The location of index.html
        // indexPath: path.join(__dirname, 'src', 'about.html'),
  
        // Required - Routes to render.
        routes: ['/about'],
      }),
      new webpack.DefinePlugin({
        'process.env': {
          'FRONTEND_VERSION': JSON.stringify(version),
        },
      }),
    ],
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
}
