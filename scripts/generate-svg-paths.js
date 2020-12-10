const SVGO = require('svgo')
const fs = require('fs').promises
const path = require('path')
const upperFirst = require('lodash/upperFirst')
const camelCase = require('lodash/camelCase')

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

const genPaths = async (directory) => {
  try {
    const entries = await fs.readdir(directory)
    const paths = {}
    for (key of entries) {
      const matched = key.match(/([A-Za-z0-9-_]+)\./i)
      if (matched && matched.length > 1) {
        const name = matched[1]
        const transformedName = `zi${upperFirst(camelCase(name.replace(/\.\w+$/, '')))}`
        const filepath = `${directory}/${key}`
        const svgData = await fs.readFile(filepath, 'utf8')
        const clearedResult = await removeSvgAttrs(svgData)
        const result = await mergeSvgPaths(clearedResult.data)
        const data = result.data
        if (data) {
          const path = getPath(data, name)
          paths[transformedName] = path
          console.log(`SUCCESS: File ${name} processed.`)
        }
      } else {
        console.log(`WARN: File ${key} not processed.`)
      }
    }
    const jsonData = JSON.stringify(paths, null, 2)
    await fs.writeFile(path.join(__dirname, 'icons-paths.json'), jsonData)
    let jsData = ''
    Object.keys(paths).forEach(k => {
      const v = paths[k]
      jsData += `export const ${k} = '${v}'\n`
    })
    await fs.writeFile(path.join(__dirname, 'icons-paths.js'), jsData)
  } catch (error) {
    throw new Error(error)
  }
}

const genPath = async (filepath) => {
  const file = await fs.readFile(filepath, 'utf8')
  const clearedResult = await removeSvgAttrs(file)
  const result = await mergeSvgPaths(clearedResult.data)
  console.log('SVGO removeAttrs result')
  console.log(clearedResult)
  console.log('SVGO mergePaths result')
  console.log(result)
  const data = result.data
  console.log('Result')
  console.log(getPath(data, filepath))
}

const fileIndex = process.argv.indexOf('--file')
const file = fileIndex === -1 ? undefined : process.argv[fileIndex + 1]
const dirIndex = process.argv.indexOf('--dir')
const dir = dirIndex === -1 ? undefined : process.argv[dirIndex + 1]

console.log('filename', file)
console.log('dir', dir)

if (file) {
  genPath(path.join(__dirname, file))
} else if (dir) {
  genPaths(path.join(__dirname, dir))
}
