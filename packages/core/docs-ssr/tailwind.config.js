const base = require('../../tailwind.config.js')

module.exports = {
  ...base,
  purge: {
    mode: 'layers',
    layers: ['utilities'],
    content: [
      './src/**/*.{vue,js,ts,jsx,tsx,md}',
      './index.html',
      '../../node_modules/@zennnn/core/lib/components/**/*.js',
      '../../node_modules/@zennnn/core/lib/composables/**/*.js',
    ],
  },
}
