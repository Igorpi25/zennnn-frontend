const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { execSync } = require('child_process')
const pkg = require('./package.json')
const pkgVersion = pkg.version
const commitHash = execSync('git rev-parse HEAD').toString().trim().slice(0, 7)
const version = `v${pkgVersion}-${commitHash}`
const path = require('path')

module.exports = {
  // chainWebpack: config => {
  //   // remove the prefetch plugin
  //   // config.plugins.delete('prefetch')
  //   // or:
  //   // modify prefetch plugin options:
  //   //
  //   // The preload/prefetch plugins are disabled for now, we'll re-enable them after migrating them to webpack 5
  //   //
  //   config.plugin('prefetch-index').tap(options => {
  //     options[0].fileBlacklist = options[0].fileBlacklist || [/\.map/]
  //     options[0].fileBlacklist.push(/(pdfFonts|pdfMake)(.)+?\.js$/)
  //     return options
  //   })
  // },
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

    const definePlugin = new webpack.DefinePlugin({
      'process.env.FRONTEND_VERSION': JSON.stringify(version),
      'process.env.COMMIT_HASH': JSON.stringify(commitHash),
    })
    // TODO: replace with pwa plugin
    const copyPlugin = new CopyWebpackPlugin({
      patterns: [{ from: 'src/sw.js', to: 'service-worker.js' }],
    })
    config.plugins.push(definePlugin, copyPlugin)
  },
}
