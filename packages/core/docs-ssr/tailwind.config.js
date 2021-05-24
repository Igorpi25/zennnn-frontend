const base = require('../tailwind.config')

module.exports = {
  ...base,
  purge: {
    mode: 'layers',
    layers: ['utilities'],
    content: ['./docs-ssr/index.html', './docs-ssr/src/**/*.{vue,js,ts,jsx,tsx,md}', './src/**/*.{vue,js,ts,jsx,tsx,md}'],
  },
}
