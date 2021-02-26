const base = require('../../tailwind.config.js')

module.exports = {
  ...base,
  purge: {
    mode: 'layers',
    layers: ['utilities'],
    content: [
      './index.html',
      './src/**/*.{vue,js,ts,jsx,tsx,md}',
      './docs/.vitepress/theme/**/*.vue',
      './examples/**/*.vue',
    ],
  },
}
