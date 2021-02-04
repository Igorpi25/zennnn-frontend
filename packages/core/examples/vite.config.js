import vue from '@vitejs/plugin-vue'
import pages from 'vite-plugin-pages'
import markdown from 'vite-plugin-md'

/**
 * @type {import('vite').UserConfig}
 */
export default {
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    pages({
      extensions: ['vue', 'md'],
      pagesDir: '../docs/components'
    }),
    markdown(),
  ]
}
