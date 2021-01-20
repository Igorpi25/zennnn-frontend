const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { execSync } = require('child_process')
const pkg = require('./package.json')
const pkgVersion = pkg.version
const commitHash = execSync('git rev-parse HEAD').toString().trim().slice(0, 7)
const version = `v${pkgVersion}-${commitHash}`
// const path = require('path')
// const PrerenderSPAPlugin = require('prerender-spa-plugin')

const isAdmin = process.env.VUE_APP_NAME === 'admin'

// PrerenderSPAPlugin not working with webpack 5
//
// const productionPlugins = [
//   new PrerenderSPAPlugin({
//     // Required - The path to the webpack-outputted app to prerender.
//     staticDir: path.join(__dirname, 'dist'),

//     // Optional - The path your rendered app should be output to.
//     // (Defaults to staticDir.)
//     // outputDir: path.join(__dirname, 'dist'),

//     // Optional - The location of index.html
//     // indexPath: path.join(__dirname, 'src', 'about.html'),

//     // Required - Routes to render.
//     routes: ['/', '/about'],

//     postProcess (renderedRoute) {
//       if (renderedRoute.route === '/') {
//         renderedRoute.outputPath = path.join(__dirname, 'dist', '/home/index.html')
//       } else {
//         renderedRoute.outputPath = path.join(__dirname, 'dist', `${renderedRoute.route}/index.html`)
//       }
//       return renderedRoute
//     },
//   }),
// ]

module.exports = {
  pages: {
    index: {
      // entry for the page
      entry: 'src/main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'ZENNNN',
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
    // admin: {
    //   // entry for the page
    //   entry: 'src/admin.js',
    //   // the source template
    //   template: 'public/index.html',
    //   // output as dist/index.html
    //   filename: 'admin/index.html',
    //   // when using title option,
    //   // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
    //   title: 'ZENNNN | ADMIN',
    //   // chunks to include on this page, by default includes
    //   // extracted common chunks and vendor chunks.
    //   chunks: ['chunk-vendors', 'chunk-common', 'admin'],
    // },
  },
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
  configureWebpack: (config) => {
    // webpack 5 not polyfill node crypto
    // crypto used in amazon-cognito-identity-js
    // can polyfill with
    // resolve.fallback: { crypto: require.resolve('crypto-browserify') }
    //
    config.resolve.fallback = { crypto: false }

    const definePlugin = new webpack.DefinePlugin({
      'process.env': {
        FRONTEND_VERSION: JSON.stringify(version),
        COMMIT_HASH: JSON.stringify(commitHash),
      },
    })
    // TODO: replace with pwa plugin
    const copyPlugin = new CopyWebpackPlugin({
      patterns: [
        { from: 'src/sw.js', to: 'service-worker.js' },
      ],
    })
    config.plugins.push(definePlugin)
    if (!isAdmin) {
      config.plugins.push(copyPlugin)
      // if (process.env.NODE_ENV === 'production') {
      //   config.plugins.push(...productionPlugins)
      // }
    }
  },
}
