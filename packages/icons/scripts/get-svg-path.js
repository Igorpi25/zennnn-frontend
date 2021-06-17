const path = require('path')
const fs = require('fs').promises
const { optimizeSvg, getSvgPath } = require('../helpers')

const getPath = async (filepath) => {
  if (!filepath) {
    console.log('filepath not setted.')
    return
  }
  const file = await fs.readFile(filepath, 'utf8')
  const result = optimizeSvg(file)
  console.log('SVGO result')
  console.log(result)
  const data = result.data
  console.log('Result')
  console.log(getSvgPath(data, filepath))
}

const fileIndex = process.argv.indexOf('--file')
const file = fileIndex === -1 ? undefined : process.argv[fileIndex + 1]

;(async () => {
  const filepath = path.resolve(__dirname, '../', file)
  await getPath(filepath)
})()
