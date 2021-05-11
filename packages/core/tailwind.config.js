const base = require('../../tailwind.config.js')

const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))
const isPlayground = argv._.includes('playground')
const isDocs = argv._.includes('docs')

// TODO: move to postcss.config.js
const content = isPlayground
  ? ['./src/**/*.{vue,js,ts,jsx,tsx,md}', './playground/src/**/*.{vue,ts}', './playground/index.html']
  : isDocs
    ? ['./src/**/*.{vue,js,ts,jsx,tsx,md}', './docs/.vitepress/**/*.{vue,js,ts,jsx,tsx,md}']
    : ['./src/**/*.{vue,js,ts,jsx,tsx,md}']

module.exports = {
  ...base,
  purge: {
    mode: 'layers',
    layers: ['utilities'],
    content,
  },
}
