import path from 'path'
import glob from 'globby'
import { defineConfig } from 'vite'
import { SITE_DATA_ID, SITE_DATA_REQUEST_PATH } from 'vitepress/dist/node/alias'
import { SiteConfig, SiteData } from 'vitepress'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import viteComponents from 'vite-plugin-components'
import { createVitePressPlugin } from './vitepressPlugin'
import siteData from './src/config'

const components = [
  'Alert',
  'Autocomplete',
  'Btn',
  'BtnToggle',
  'Checkbox',
  'DataTable',
  'DatePicker',
  'ExpandTransition',
  'Form',
  'Icon',
  'Image',
  'Label',
  'LoadingSpinner',
  'Menu',
  'Messages',
  'Modal',
  'Progress',
  'Radio',
  'Select',
  'Switch',
  'TextField',
  'TextArea',
  'Tooltip',
  'Window',
]

const toAbsolute = (p) => path.resolve(__dirname, p)

const pages = glob
  .sync('**.md', { cwd: toAbsolute('src/pages') })
  .map((file) => file.toLowerCase())

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
  configPath: 'src/config.js',
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
    viteComponents({
      customComponentResolvers: [
        (name: string) => {
          if (components.includes(name)) {
            // const folder = name === 'MenuItem' ? 'Menu' : name === 'WindowItem' ? 'Window' : name
            // return { name, path: `@zennnn/core/lib/components/${folder}/${name}` }
            return { importName: name, path: '@zennnn/core' }
          }
        }
      ]
    }),
  ],
})
