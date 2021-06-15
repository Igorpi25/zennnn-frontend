import path from 'path'
import glob from 'globby'
import { resolveSiteData } from 'vitepress/dist/node/config'
import { SITE_DATA_ID, SITE_DATA_REQUEST_PATH } from 'vitepress/dist/node/alias'
import { createMarkdownToVueRenderFn } from 'vitepress/dist/node/markdownToVue'
import type { Plugin, ResolvedConfig } from 'vite'
import type { SiteConfig, SiteData } from 'vitepress'
import type { OutputAsset, OutputChunk } from 'rollup'
import siteData from '../src/config'

const toAbsolute = (p) => path.resolve(__dirname, '..', p)

const vitepressRoot = toAbsolute('src/pages')

const pages = glob
  .sync('**.md', { cwd: toAbsolute('src/pages') })
  .map((file) => file.toLowerCase())

const siteConfig: SiteConfig = {
  root: vitepressRoot,
  site: siteData as SiteData,
  pages,
  alias: [
    {
      find: SITE_DATA_ID,
      replacement: SITE_DATA_REQUEST_PATH,
    },
  ],
  configPath: toAbsolute('src/config.js'),
  outDir: '',
  tempDir: '',
  themeDir: '',
}

export default function (root?: string): Plugin {
  root = root || vitepressRoot
  const { configPath, alias, markdown, site, pages } = siteConfig

  const markdownToVue = createMarkdownToVueRenderFn(root, markdown, pages)

  let siteData = site
  let hasDeadLinks = false
  let config: ResolvedConfig
  const pageAssetsMap = {} as Record<string, string>

  const isPageChunk = (
    chunk: OutputAsset | OutputChunk
  ): chunk is OutputChunk & { facadeModuleId: string } =>
    !!(
      chunk.type === 'chunk' &&
      chunk.facadeModuleId &&
      chunk.facadeModuleId.includes(root) &&
      chunk.facadeModuleId.endsWith('.md')
    )

  const filenameToPath = (file: string) =>
    file.replace(root, '').replace('.md', '')

  const vitePressPlugin: Plugin = {
    name: 'vitepress',

    configResolved(resolvedConfig) {
      config = resolvedConfig
    },

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
        const { vueSrc, deadLinks } = markdownToVue(code, id, config.publicDir)
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

    generateBundle(_options, bundle) {
      for (const name in bundle) {
        const chunk = bundle[name] as OutputChunk
        if (isPageChunk(chunk)) {
          const path = filenameToPath(chunk.facadeModuleId)
          pageAssetsMap[path] = chunk.fileName.replace('assets/', '')
        }
      }
    },

    transformIndexHtml(html) {
      const assetsMapString = JSON.stringify(JSON.stringify(pageAssetsMap))
      return {
        html,
        tags: [
          {
            tag: 'script',
            children: `__PAGE_ASSETS_MAP__ = JSON.parse(${assetsMapString})`,
            injectTo: 'body',
          },
        ],
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
      if (file.endsWith('.md') && file.includes(root)) {
        const content = await read()
        const { pageData, vueSrc } = markdownToVue(
          content,
          file,
          config.publicDir
        )

        // notify the client to update page data
        server.ws.send({
          type: 'custom',
          event: 'vitepress:pageData',
          data: {
            path: filenameToPath(file),
            pageData,
          },
        })

        // reload the content component
        ctx.read = () => vueSrc
      }
    },
  }

  return vitePressPlugin
}