const path = require('path')
const fs = require('fs').promises
const upperFirst = require('lodash/upperFirst')
const camelCase = require('lodash/camelCase')
const { optimizeSvg, getSvgPath } = require('../helpers')

const dirname = path.join(__dirname, '../source')

async function* getFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true })
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name)
    if (dirent.isDirectory()) {
      yield* getFiles(res)
    } else if (res.match(/\w+\.svg$/)) {
      yield res
    }
  }
}

;(async () => {
  const paths = {}
  let filesCount = 0
  let warnCount = 0
  for await (const filepath of getFiles(dirname)) {
    filesCount++
    const file = await fs.readFile(filepath, 'utf8')
    const filename = path.parse(filepath).name
    const transformedName = `zi${upperFirst(camelCase(filename))}`
    const result = optimizeSvg(file)
    const data = result.data
    if (data) {
      const path = getSvgPath(data, filename)
      if (!path) warnCount++
      paths[transformedName] = path
      console.log(`SUCCESS: File ${filename} processed.`)
    } else {
      console.log(`WARN: File ${filepath} no svgo result data.`)
      warnCount++
    }
  }
  console.log(`
    Files count: ${filesCount}
    Warnings count: ${warnCount}
  `)
  let jsData = ''
  Object.keys(paths).forEach((k) => {
    const v = paths[k]
    jsData += `export const ${k}: string = '${v}'\n`
  })
  await fs.writeFile(path.join(__dirname, '../index.ts'), jsData)
})()
