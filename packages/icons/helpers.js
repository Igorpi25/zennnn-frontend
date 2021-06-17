const { optimize, extendDefaultPlugins } = require('svgo')

const optimizeSvg = (item) =>
  optimize(item, {
    plugins: extendDefaultPlugins([
      { name: 'mergePaths', params: { force: true } },
      { name: 'removeAttrs', params: { attrs: '(stroke|fill)' } },
    ]),
  })

const getSvgPath = (data, filename) => {
  const match = data.match(/<path (.*?)\/>/g)
  const hasRuleRe = /-rule/g
  if (match) {
    if (match.some((m) => hasRuleRe.test(m))) {
      console.log(`WARN: ${filename} has '-rule' attribute.`)
      return null
    }
    if (match.length > 1) {
      console.log(
        `WARN: ${filename} <path> count ${match.length}, should be only 1.`
      )
      return null
    }
    const d = match[0].match(/d=\"(.*?)\"/)
    return d[1]
  }
  return null
}

module.exports = {
  getSvgPath,
  optimizeSvg,
}
