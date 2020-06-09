const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { execSync } = require('child_process')
const pkgVersion = require('./package.json').version
const commitHash = execSync('git rev-parse HEAD').toString().trim().slice(0, 7)
const version = `v${pkgVersion}-${commitHash}`
// const version = execSync('git describe --always').toString().trim()
const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin')

const productionPlugins = [
  new PrerenderSPAPlugin({
    // Required - The path to the webpack-outputted app to prerender.
    staticDir: path.join(__dirname, 'dist'),

    // Optional - The path your rendered app should be output to.
    // (Defaults to staticDir.)
    // outputDir: path.join(__dirname, 'dist'),

    // Optional - The location of index.html
    // indexPath: path.join(__dirname, 'src', 'about.html'),

    // Required - Routes to render.
    routes: ['/', '/about'],

    postProcess (renderedRoute) {
      if (renderedRoute.route === '/') {
        renderedRoute.outputPath = path.join(__dirname, 'dist', '/home/index.html')
      } else {
        renderedRoute.outputPath = path.join(__dirname, 'dist', `${renderedRoute.route}/index.html`)
      }
      return renderedRoute
    },
  }),
]

module.exports = {
  chainWebpack: config => {
    // remove the prefetch plugin
    // config.plugins.delete('prefetch')
    // or:
    // modify prefetch plugin options:
    config.plugin('prefetch').tap(options => {
      options[0].fileBlacklist = options[0].fileBlacklist || [/\.map/]
      options[0].fileBlacklist.push(/(pdfFonts|pdfMake|intl)(.)+?\.js$/)
      return options
    })
  },
  configureWebpack: (config) => {
    const definePlugin = new webpack.DefinePlugin({
      'process.env': {
        FRONTEND_VERSION: JSON.stringify(version),
      },
    })
    const copyPlugin = new CopyWebpackPlugin(
      [
        {
          from: 'src/sw.js',
          to: 'service-worker.js',
        },
      ],
    )
    config.plugins.push(definePlugin, copyPlugin)
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(...productionPlugins)
    }
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
