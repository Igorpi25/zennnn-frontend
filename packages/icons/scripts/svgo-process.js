const SVGO = require('svgo')

const svgo = new SVGO({
  plugins: [{
    mergePaths: { force: true },
    removeAttrs: { attrs: '(stroke|fill)' },
  }]
})

const svgoRemoveAttrs = new SVGO({
  plugins: [{
    removeAttrs: { attrs: '(stroke|fill)' },
  }]
})

const svgoMergePaths = new SVGO({
  plugins: [{
    mergePaths: { force: true },
  }]
})

const getPath = (data, filename) => {
  const match = data.match(/<path (.*?)\/>/g)
  const hasRuleRe = /-rule/g
  if (match) {
    if (match.some(m => hasRuleRe.test(m))) {
      console.log(`WARN: ${filename} has '-rule' attribute.`)
      return null
    }
    if (match.length > 1) {
      console.log(`WARN: ${filename} <path> count ${match.length}, should be only 1.`)
      return null
    }
    const d = match[0].match(/d=\"(.*?)\"/)
    return d[1]
  }
  return null
}

const optimizeSvg = (data) => {
  return new Promise((resolve) => {
    svgo.optimize(data).then((result) => {
      resolve(result)
    })
  })
}

const removeSvgAttrs = (data) => {
  return new Promise((resolve) => {
    svgoRemoveAttrs.optimize(data).then((result) => {
      resolve(result)
    })
  })
}

const mergeSvgPaths = (data) => {
  return new Promise((resolve) => {
    svgoMergePaths.optimize(data).then((result) => {
      resolve(result)
    })
  })
}

module.exports = {
  getPath,
  optimizeSvg,
  removeSvgAttrs,
  mergeSvgPaths,
}
