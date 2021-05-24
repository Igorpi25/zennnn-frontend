const base = require('../../tailwind.config')

module.exports = {
  ...base,
  purge: {
    mode: 'layers',
    layers: ['utilities'],
    content: ['./docs/.vitepress/**/*.{vue,js,ts,jsx,tsx,md}', './src/**/*.{vue,js,ts,jsx,tsx,md}'],
  },
}
