import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import viteComponents from 'vite-plugin-components'
import vitePressMdToVue from './plugins/markdownToVue'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: 'vue-i18n',
        replacement: 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
      },
      {
        find: '/@shared',
        replacement: path.join(__dirname, '../shared'),
      },
    ],
  },
  plugins: [
    vitePressMdToVue(),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    vueJsx(),
    vueI18n({
      include: path.resolve(__dirname, '../shared/plugins/i18n/locales/**'),
    }),
    viteComponents({
      customComponentResolvers: [
        (name: string) => {
          if (components.includes(name)) {
            return { importName: name, path: '@zennnn/core' }
          }
        },
      ],
    }),
  ],
})

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
  'MenuItem',
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
  'WindowItem',
]
