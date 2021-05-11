const base = require('../../tailwind.config.js')

const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))
const isPlayground = argv._.includes('playground')

const content = isPlayground
  ? ['./src/**/*.{vue,js,ts,jsx,tsx,md}', './playground/src/**/*.{vue,ts}', './playground/index.html']
  : ['./src/**/*.{vue,js,ts,jsx,tsx,md}']

module.exports = {
  ...base,
  purge: {
    mode: 'layers',
    layers: ['utilities'],
    content,
  },
}
