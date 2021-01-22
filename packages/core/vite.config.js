import vue from '@vitejs/plugin-vue'
import pages from 'vite-plugin-pages'

/**
 * @type {import('vite').UserConfig}
 */
export default {
  plugins: [vue(), pages()],
}
