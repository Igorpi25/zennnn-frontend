const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))
const isPlayground = argv._.includes('playground')
const isDocs = argv._.includes('docs')
const isDocsSSr = argv._.includes('docs-ssr')

const base = isPlayground
  ? './playground'
  : isDocs
    ? './docs/.vitepress'
    : isDocsSSr
      ? './docs-ssr'
      : '.'

module.exports = {
  plugins: {
    tailwindcss: { config: `${base}/tailwind.config.js` },
    autoprefixer: {},
  }
}
