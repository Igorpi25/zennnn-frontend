import path from 'path'
import { Plugin } from 'vite'
import { SiteConfig, resolveSiteData } from 'vitepress/dist/node/config'
import { createMarkdownToVueRenderFn } from 'vitepress/dist/node/markdownToVue'
import { SITE_DATA_REQUEST_PATH } from 'vitepress/dist/node/alias'
import createVuePlugin from '@vitejs/plugin-vue'
import { slash } from 'vitepress/dist/node/utils/slash'

export function createVitePressPlugin(
  root: string,
  { configPath, alias, markdown, site, vueOptions, pages }: SiteConfig,
): Plugin[] {
  const markdownToVue = createMarkdownToVueRenderFn(root, markdown, pages)

  const vuePlugin = createVuePlugin({
    include: [/\.vue$/, /\.md$/],
    ...vueOptions,
  })

  let siteData = site
  let hasDeadLinks = false

  const vitePressPlugin: Plugin = {
    name: 'vitepress',

    config() {
      return {
        resolve: {
          alias,
        },
      }
    },

    resolveId(id) {
      if (id === SITE_DATA_REQUEST_PATH) {
        return SITE_DATA_REQUEST_PATH
      }
    },

    load(id) {
      if (id === SITE_DATA_REQUEST_PATH) {
        return `export default ${JSON.stringify(JSON.stringify(siteData))}`
      }
    },

    transform(code, id) {
      if (id.endsWith('.md')) {
        // transform .md files into vueSrc so plugin-vue can handle it
        const { vueSrc, deadLinks } = markdownToVue(code, id)
        if (deadLinks.length) {
          hasDeadLinks = true
        }
        return vueSrc
      }
    },

    renderStart() {
      if (hasDeadLinks) {
        throw new Error(`One or more pages contain dead links.`)
      }
    },

    async handleHotUpdate(ctx) {
      // handle config hmr
      const { file, read, server } = ctx
      if (file === configPath) {
        const newData = await resolveSiteData(root)
        if (newData.base !== siteData.base) {
          console.warn(
            `[vitepress]: config.base has changed. Please restart the dev server.`
          )
        }
        siteData = newData
        return [server.moduleGraph.getModuleById(SITE_DATA_REQUEST_PATH)!]
      }

      // hot reload .md files as .vue files
      if (file.endsWith('.md')) {
        const content = await read()
        const { pageData, vueSrc } = markdownToVue(content, file)

        // notify the client to update page data
        server.ws.send({
          type: 'custom',
          event: 'vitepress:pageData',
          data: {
            path: `/${slash(path.relative(root, file))}`,
            pageData,
          },
        })

        // reload the content component
        ctx.read = () => vueSrc
      }
    },
  }

  return [vitePressPlugin, vuePlugin]
}
