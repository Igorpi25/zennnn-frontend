const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))
const isPlayground = argv._.includes('playground')
const isDocs = argv._.includes('docs')
// const isDocsSSr =
//   argv._.includes('docs-ssr') ||
//   (process.argv[1] && process.argv[1].includes('docs-ssr')) // TODO: pass arg to command line

const base = isPlayground ? './playground' : isDocs ? './docs' : '.'

module.exports = {
  plugins: {
    tailwindcss: { config: `${base}/tailwind.config.js` },
    autoprefixer: {},
  },
}
