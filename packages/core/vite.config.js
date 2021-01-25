import vue from '@vitejs/plugin-vue'
import pages from 'vite-plugin-pages'
import components from 'vite-plugin-components'
import markdown from 'vite-plugin-md'
import anchor from 'markdown-it-anchor'
import toc from 'markdown-it-table-of-contents'
import { highlight } from './plugins/highlight'
import { preWrapperPlugin } from './plugins/preWrapper'

/**
 * @type {import('vite').UserConfig}
 */
export default {
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    pages({
      importMode (path) {
        return path === '/src/pages/index.md' ? 'sync' : 'async'
      },
      extensions: ['vue', 'md'],
    }),
    components({
      dirs: ['src/components', 'src/app'],
      extensions: ['vue', 'js'],
      deep: true,
      directoryAsNamespace: true,
      customLoaderMatcher: path => !path.endsWith('index.js'),
    }),
    markdown({
      markdownItOptions: {
        html: true,
        linkify: true,
        highlight,
      },
      markdownItSetup(md) {
        md.use(preWrapperPlugin)
        md.use(anchor, {
          permalink: true,
          permalinkSymbol: '#',
          permalinkBefore: true,
          permalinkAttrs: () => ({ 'aria-hidden': true }),
        })
        md.use(toc, {
          includeLevel: [2, 3],
        })
      },
    }),
  ],
}
