const base = require('../../tailwind.config.js')

module.exports = {
  ...base,
  purge: {
    mode: 'layers',
    layers: ['utilities'],
    content: ['./src/**/*.{vue,js,ts,jsx,tsx,md}'],
  },
}
