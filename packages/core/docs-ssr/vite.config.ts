import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'
import { SITE_DATA_ID, SITE_DATA_REQUEST_PATH } from 'vitepress/dist/node/alias'
import { SiteConfig, SiteData } from 'vitepress'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import { createVitePressPlugin } from './vitepressPlugin'
import siteData from './src/config'

const toAbsolute = (p) => path.resolve(__dirname, p)

const pages = fs.readdirSync(toAbsolute('src/pages')).reduce((acc, file) => {
  if (file.endsWith('.md')) {
    const name = file.toLowerCase()
    return [...acc, name]
  } else {
    return acc
  }
}, [])

const config: SiteConfig = {
  root: 'src/pages',
  site: siteData as SiteData,
  pages,
  alias: [
    {
      find: 'vue-i18n',
      replacement: 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
    },
    {
      find: SITE_DATA_ID,
      replacement: SITE_DATA_REQUEST_PATH,
    },
  ],
  configPath: '',
  outDir: '',
  tempDir: '',
  themeDir: ''
}

const plugins = createVitePressPlugin('src/pages', config)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    ...plugins,
    vueJsx(),
    vueI18n({
      include: path.resolve(__dirname, './src/plugins/i18n/locales/**'),
    }),
  ],
})
