// @ts-check
const fs = require('fs')
const path = require('path')
const express = require('express')
const minimist = require('minimist')
const chalk = require('chalk')
const compression = require('compression')()

const argv = minimist(process.argv.slice(2))

console.log(chalk.cyan(`vite v${require('vite/package.json').version}`))

const serverOption = {
  port: argv['port'] || 3000,
  force: !!argv['force'],
}

const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD

async function createServer(
  root = argv._[0] || process.cwd(),
  isProd = process.env.NODE_ENV === 'production'
) {
  const resolve = (p) => path.resolve(__dirname, p)

  const indexProd = isProd
    ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
    : ''

  const manifest = isProd
    ? // @ts-ignore
      require('./dist/client/ssr-manifest.json')
    : {}

  const app = express()

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite
  if (!isProd) {
    vite = await require('vite').createServer({
      root,
      logLevel: isTest ? 'error' : 'info',
      server: {
        force: serverOption.force,
        middlewareMode: true,
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
      },
    })
    // use vite's connect instance as middleware
    app.use(vite.middlewares)
  } else {
    app.use(compression())
    app.use(
      require('serve-static')(resolve('dist/client'), {
        index: false,
      })
    )
  }

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl

      let template, render
      if (!isProd) {
        // always read fresh template in dev
        template = fs.readFileSync(resolve('index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/entry-server.js')).render
      } else {
        template = indexProd
        render = require('./dist/server/entry-server.js').render
      }

      const [appHtml, preloadLinks] = await render(url, manifest)

      const html = template
        .replace(`<!--preload-links-->`, preloadLinks)
        .replace(`<!--app-html-->`, appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite && vite.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })

  return { app, vite }
}

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(serverOption.port, () => {
      console.log(`http://localhost:${serverOption.port}`)
    })
  )
}

// for test use
exports.createServer = createServer
