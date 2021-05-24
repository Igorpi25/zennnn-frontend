const base = require('../tailwind.config')

module.exports = {
  ...base,
  purge: {
    mode: 'layers',
    layers: ['utilities'],
    content: ['./playground/index.html', './playground/src/**/*.{vue,js,ts,jsx,tsx,md}', './src/**/*.{vue,js,ts,jsx,tsx,md}'],
  },
}
