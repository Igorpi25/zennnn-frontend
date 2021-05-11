import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: 'vue-i18n',
        replacement: 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
      },
      {
        find: /^@zennnn\/core$/,
        replacement: path.join(__dirname, '../src/index'),
      },
      {
        find: '/@shared',
        replacement: path.join(__dirname, '../shared'),
      }
    ],
  },

  plugins: [
    vue(),
    vueI18n({
      include: path.resolve(__dirname, '../shared/plugins/i18n/locales/**'),
    }),
  ],
})
