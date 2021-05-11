const path = require('path')
const vue = require('@vitejs/plugin-vue')

/**
 * @type {import('vite').UserConfig}
 */
module.exports = {
  resolve: {
    alias: [
      {
        find: /^core-components$/,
        replacement: path.join(__dirname, '../src/index')
      },
      {
        find: '/@shared',
        replacement: path.join(__dirname, '../shared')
      }
    ],
  },

  plugins: [vue()]
}
